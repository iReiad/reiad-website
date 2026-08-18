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

   ---- the credential ----

   Three wrangler secrets, and the site works without them: every
   caller checks `canReachDrive()` first and says plainly that the
   section is not connected rather than failing oddly.

     GOOGLE_CLIENT_ID       an OAuth client, Desktop type
     GOOGLE_CLIENT_SECRET
     GOOGLE_REFRESH_TOKEN   granted once, for drive.readonly

   A refresh token rather than an access token because access
   tokens last an hour, and a section that stops working every
   hour until somebody pastes a new string is not a section. The
   refresh token is exchanged for an access token here, cached per
   isolate for slightly less than its life, and never leaves this
   file.

   `drive.readonly` and not `drive`: this reads and can never
   write. `drive.metadata.readonly`, which the importer uses, is
   NOT enough here, because that scope deliberately cannot read
   file content and content is the whole point.
   ============================================================ */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const FILES_URL = "https://www.googleapis.com/drive/v3/files";

/** Only the three the credential needs. The Worker's env carries
    a great deal more and none of it is this module's business. */
export interface DriveEnv {
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GOOGLE_REFRESH_TOKEN?: string;
}

/** Is the credential configured at all?

    Asked before anything else by every caller, so that a
    deployment without the secrets says "not connected" rather
    than throwing on a fetch nobody can diagnose from the page. */
export const canReachDrive = (env: DriveEnv): boolean => Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET && env.GOOGLE_REFRESH_TOKEN);

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
      client_id: env.GOOGLE_CLIENT_ID as string,
      client_secret: env.GOOGLE_CLIENT_SECRET as string,
      refresh_token: env.GOOGLE_REFRESH_TOKEN as string,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    /* The body carries Google's own reason, and the one worth
       recognising is `invalid_grant`: the refresh token has been
       revoked, or the OAuth client was rebuilt. Nothing here can
       recover from that, and saying so beats a generic 502. */
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
export const forgetToken = (): void => { cached = { token: null, until: 0 }; };

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
