/* ============================================================
   _lib/drive.ts: the one place this site reads Google Drive.

   ---- why the Worker and not the browser ----

   `/skills/courses/` is a catalogue of files in one person's
   private Drive folder. The first version handed those file ids
   to the browser and let it embed Drive directly: a `/preview`
   iframe for a video, a link for a reading. Neither works, and
   the reason is the same for both.

   A private Drive file needs Drive to know who is asking. Inside
   a cross-site iframe it cannot: browsers block or partition
   third-party cookies now, so Drive gets an anonymous request for
   a file that is not public and answers "Unable to load video".
   The embed is not broken and neither is the file. The mechanism
   only ever worked for files shared with a link, and these are
   deliberately not.

   So the reader's browser stops talking to Drive, and this does.
   One credential, held by the Worker, never in a page. The
   browser asks `/api/courses/file/<id>` and gets bytes from its
   own origin, where no third-party anything is involved.

   ---- what it is allowed to open ----

   NOTHING BY ITSELF. This module fetches whatever id it is
   given; the endpoint above it decides which ids exist, and it
   decides by looking them up in the committed catalogue. That
   split is deliberate and it is the important line in this
   feature: a proxy that fetched any id it was handed would be a
   read-only window onto the whole of somebody's Drive, one
   guessed id at a time, and the only thing in front of it would
   be the admin check. Two locks, and the second one is a list of
   ids that cannot be argued with.

   ---- the credential, and why it is a service account ----

   Two wrangler secrets, and the site works without them: every
   caller checks `canReachDrive()` first and says plainly that the
   section is not connected rather than failing oddly.

     GOOGLE_SA_EMAIL   a service account in the same project
     GOOGLE_SA_KEY     its private key, from the JSON key file

   This started as a user OAuth refresh token and that was the
   wrong credential twice over.

   It could not be obtained. `drive.readonly` is a RESTRICTED
   scope, so an app using it needs a security assessment before
   Google will let it out of "Testing", and refresh tokens issued
   by an app in Testing expire after seven days. The section would
   have worked for a week and then quietly stopped.

   And it was far too much power. A user refresh token with
   `drive.readonly` can read the WHOLE of that person's Drive:
   every document, every photo, everything anybody has ever shared
   with them. This section needs one folder. A service account is
   a principal with no files of its own, and it can see exactly
   what has been shared with it and nothing else, so sharing the
   course folder with it is the entire grant. If this credential
   ever leaks, what leaks with it is a folder of somebody else's
   course, not a life.

   That is also what makes `isCourseFile()` in the endpoint a
   second lock rather than the only real one.

   The scope is still `drive.readonly`: read, never write.
   `drive.metadata.readonly`, which the importer uses, is NOT
   enough here, because that scope deliberately cannot read file
   content and content is the whole point.
   ============================================================ */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FILES_URL = "https://www.googleapis.com/drive/v3/files";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

/** Two secrets, out of a service account's JSON key file.

    `GOOGLE_SA_KEY` is the `private_key` field, PEM and all. It
    arrives from that file with the newlines written as the two
    characters `\n`, and `wrangler secret put` will happily store
    it either way, so `pemToDer` below accepts both rather than
    making somebody find that out from a 500. */
export interface DriveEnv {
  GOOGLE_SA_EMAIL?: string;
  GOOGLE_SA_KEY?: string;
}

export const canReachDrive = (env: DriveEnv): boolean =>
  Boolean(env.GOOGLE_SA_EMAIL && env.GOOGLE_SA_KEY);

/* ---------- signing a JWT, which is the whole of the flow ----------

   A service account authenticates by signing a short-lived
   assertion about itself and trading it for an access token. There
   is no user, no consent screen and no refresh token, which is
   what makes it the right credential here and not merely the
   convenient one: see the note at the top of this file. */

const enc = new TextEncoder();

const b64url = (input: ArrayBuffer | string): string => {
  const bytes = typeof input === "string"
    ? enc.encode(input)
    : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/** The DER bytes inside a PEM private key.

    Accepts a real multi-line PEM and the one-line form with
    literal backslash-n in it, because both are what somebody
    actually pastes: the first is what you get selecting the key
    out of the JSON in an editor, the second is what you get
    copying the JSON field itself. */
function pemToDer(pem: string): ArrayBuffer {
  const body = pem
    .replace(/\\n/g, "\n")
    .replace(/-----BEGIN [^-]+-----/, "")
    .replace(/-----END [^-]+-----/, "")
    .replace(/\s+/g, "");
  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/* The imported key, per isolate. Importing is the expensive part
   of this and the key does not change between requests. */
let signingKey: CryptoKey | null = null;

async function keyFor(env: DriveEnv): Promise<CryptoKey> {
  if (signingKey) return signingKey;
  signingKey = await crypto.subtle.importKey(
    "pkcs8",
    pemToDer(env.GOOGLE_SA_KEY as string),
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return signingKey;
}

async function assertion(env: DriveEnv): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claims = b64url(JSON.stringify({
    iss: env.GOOGLE_SA_EMAIL,
    scope: SCOPE,
    aud: TOKEN_URL,
    iat: now,
    /* An hour is the maximum Google accepts, and it is the life of
       the assertion rather than of the token it buys. */
    exp: now + 3600,
  }));

  const signed = `${header}.${claims}`;
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5", await keyFor(env), enc.encode(signed));
  return `${signed}.${b64url(signature)}`;
}

/* One access token per isolate. Google issues them for an hour;
   this drops it ten minutes early so a request never picks up one
   that expires while it is still in flight. */
let cached: { token: string | null; until: number } = { token: null, until: 0 };
const EARLY = 10 * 60 * 1000;

export async function accessToken(env: DriveEnv): Promise<string | null> {
  if (!canReachDrive(env)) return null;
  if (cached.token && Date.now() < cached.until) return cached.token;

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: await assertion(env),
    }),
  });

  if (!res.ok) {
    /* Google's own reason is the useful one, and the two worth
       recognising both look like a code problem and are not:
       `invalid_grant` usually means the machine clock is wrong or
       the key has been deleted, and a 403 here means the Drive API
       is not enabled on the project. */
    const said = await res.text();
    throw new Error(`google token exchange failed (${res.status}): ${said.slice(0, 300)}`);
  }

  const body = await res.json() as { access_token?: string; expires_in?: number };
  cached = {
    token: body.access_token ?? null,
    until: Date.now() + Math.max(0, (Number(body.expires_in ?? 3600) * 1000) - EARLY),
  };
  return cached.token;
}

/** For tests, and for anything that wants a fresh exchange. */
export const forgetToken = (): void => {
  cached = { token: null, until: 0 };
  signingKey = null;
};

/**
 * One file's bytes, straight from Drive.
 *
 * The response is handed back whole rather than read, so the
 * caller can pass its body through without buffering: a lesson
 * video is thirty megabytes and a Worker that held one in memory
 * to hand it on would be a Worker that fell over on the second
 * reader.
 *
 * `range` is forwarded because it is what makes a video
 * scrubbable. Without it the browser can only play from the
 * start, and dragging the bar re-downloads everything before the
 * point it was dragged to.
 */
export async function driveFile(
  env: DriveEnv, id: string, { range }: { range?: string | null } = {}
): Promise<Response | null> {
  const token = await accessToken(env);
  if (!token) return null;

  const headers: Record<string, string> = { Authorization: `Bearer ${token}` };
  if (range) headers.Range = range;

  return fetch(`${FILES_URL}/${encodeURIComponent(id)}?alt=media&supportsAllDrives=true`, {
    headers,
  });
}

export interface DriveMeta {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
}

/** A file's name and type, without its content. */
export async function driveMeta(env: DriveEnv, id: string): Promise<DriveMeta | null> {
  const token = await accessToken(env);
  if (!token) return null;

  const url = `${FILES_URL}/${encodeURIComponent(id)}`
    + "?fields=id,name,mimeType,size&supportsAllDrives=true";
  const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.ok ? (res.json() as Promise<DriveMeta>) : null;
}
