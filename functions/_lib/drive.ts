/* _lib/drive.ts: the one place this site reads Google Drive.

   THE BROWSER NEVER TALKS TO DRIVE. A private Drive file needs
   Drive to know who is asking, and inside a cross-site iframe it
   cannot: browsers block or partition third-party cookies, so
   Drive gets an anonymous request for a file that is not public
   and answers "Unable to load video". Nothing is broken; the embed
   only ever worked for files shared with a link, and these
   deliberately are not. So one credential is held by the Worker,
   never in a page, and the browser asks
   `/api/courses/file/<id>` and gets bytes from its own origin.

   THIS MODULE OPENS NOTHING BY ITSELF. It fetches whatever id it
   is given; `isCourseFile()` in the endpoint above decides which
   ids exist, by looking them up in the committed catalogue. That
   split is the important line in this feature: a proxy that
   fetched any id it was handed would be a read-only window on to
   the whole of somebody's Drive, one guessed id at a time, with
   only the admin check in front of it. Two locks, and the second
   is a list of ids that cannot be argued with.

   THE CREDENTIAL IS A SERVICE ACCOUNT, and that is not a
   convenience. Two wrangler secrets, and the site works without
   them: every caller checks `canReachDrive()` first and says the
   section is not connected rather than failing oddly.

     GOOGLE_SA_EMAIL   a service account in the same project
     GOOGLE_SA_KEY     its private key, from the JSON key file

   A user OAuth refresh token was the wrong credential twice over.
   It could not be obtained: `drive.readonly` is a RESTRICTED
   scope, so an app using it needs a security assessment to leave
   "Testing", and refresh tokens issued in Testing expire after
   seven days. And it reads the WHOLE of that person's Drive, where
   this needs one folder. A service account owns no files, so
   sharing the course folder with it is the entire grant, and what
   leaks if the key leaks is a folder of somebody else's course.

   The scope is `drive.readonly`: read, never write.
   `drive.metadata.readonly`, which the importer uses, is NOT
   enough here, because it deliberately cannot read file content. */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FILES_URL = "https://www.googleapis.com/drive/v3/files";
const SCOPE = "https://www.googleapis.com/auth/drive.readonly";

/** Two secrets, out of a service account's JSON key file.

    `GOOGLE_SA_KEY` is the `private_key` field, PEM and all. It
    arrives with the newlines written as the two characters `\n`,
    and `wrangler secret put` stores it either way, so `pemToDer`
    accepts both rather than making somebody find that out from a
    500. */
export interface DriveEnv {
  GOOGLE_SA_EMAIL?: string;
  GOOGLE_SA_KEY?: string;
}

export const canReachDrive = (env: DriveEnv): boolean =>
  Boolean(env.GOOGLE_SA_EMAIL && env.GOOGLE_SA_KEY);

/* ---------- signing a JWT, which is the whole of the flow ----------

   A service account authenticates by signing a short-lived
   assertion about itself and trading it for an access token. No
   user, no consent screen and no refresh token. */

const enc = new TextEncoder();

const b64url = (input: ArrayBuffer | string): string => {
  const bytes = typeof input === "string"
    ? enc.encode(input)
    : new Uint8Array(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

/** The DER bytes inside a PEM private key. Accepts a real
    multi-line PEM and the one-line form with literal backslash-n
    in it, because both are what somebody pastes: the first from
    selecting the key out of the JSON in an editor, the second from
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
 * video is thirty megabytes and a Worker holding one in memory
 * would fall over on the second reader.
 *
 * `range` is forwarded because it is what makes a video
 * scrubbable: without it the browser can only play from the start.
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
