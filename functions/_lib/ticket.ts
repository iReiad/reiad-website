/* ============================================================
   _lib/ticket.ts: a short-lived pass for one file.

   ---- the problem this exists for ----

   Everything else this site protects is fetched by JavaScript, so
   it can carry the reader's access token in an `Authorization`
   header. A video cannot. `<video src="/api/courses/file/…">` is
   the browser fetching a URL by itself, with no header this site
   can add, and the same is true of `<img>`, a download link and
   anything else the browser goes and gets on its own.

   So the request has to prove itself with what a URL can carry.
   The alternatives were worse:

     the session token in the query string   a long-lived bearer
       credential in browser history, in any proxy log, and in the
       `Referer` of anything the page later loads. No.

     a cookie                                works, and means a
       third way of being signed in on a site that deliberately
       has one for readers and one for the Studio. More surface
       for one video element.

   A ticket is neither. It names ONE file, it expires in minutes,
   it grants nothing else, and it is useless the moment it does.

   ---- the key ----

   Derived rather than added. The obvious move is a fourth
   wrangler secret, and that is a fourth thing to set up, rotate
   and forget. This takes the Drive client secret, which this
   feature cannot work without anyway, and derives a key from it
   for this one purpose:

       key = HMAC(GOOGLE_CLIENT_SECRET, "reiad-course-ticket-v1")

   That is domain separation, and it matters: the derived key
   signs tickets and nothing else, and a ticket tells an attacker
   nothing about the secret it came from. The label carries a
   version so the scheme can be changed without every old ticket
   silently still verifying.
   ============================================================ */

const LABEL = "reiad-course-ticket-v1";

/** How long a pass is good for.

    Long enough to start a two-hundred-megabyte video on a slow
    connection and to seek around inside it, short enough that a
    URL copied out of the network tab is scrap by the time anybody
    reads it. The browser re-requests with the same URL when it
    seeks, so this is the ceiling on one sitting with one file,
    not on a lesson. */
const MINUTES = 30;

const enc = new TextEncoder();

const b64url = (bytes: ArrayBuffer): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function hmacKey(secret: string, label: string): Promise<CryptoKey> {
  const base = await crypto.subtle.importKey(
    "raw", enc.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const derived = await crypto.subtle.sign("HMAC", base, enc.encode(label));
  return crypto.subtle.importKey(
    "raw", derived, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

export interface TicketEnv {
  GOOGLE_CLIENT_SECRET?: string;
}

export const canTicket = (env: TicketEnv): boolean => Boolean(env.GOOGLE_CLIENT_SECRET);

const sign = async (env: TicketEnv, message: string): Promise<string> => {
  const key = await hmacKey(env.GOOGLE_CLIENT_SECRET as string, LABEL);
  return b64url(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
};

/** A pass for one file, as `<expiry>.<signature>`. */
export async function mintTicket(env: TicketEnv, id: string): Promise<string | null> {
  if (!canTicket(env)) return null;
  const expires = Date.now() + MINUTES * 60 * 1000;
  return `${expires}.${await sign(env, `${id}.${expires}`)}`;
}

/**
 * Is this pass good, and is it for this file?
 *
 * Both halves matter. A signature that verifies against a
 * different id would be a pass for one lesson opening every
 * lesson, so the id is inside the signed message rather than
 * beside it.
 */
export async function checkTicket(
  env: TicketEnv, id: string, ticket: string | null
): Promise<boolean> {
  if (!canTicket(env) || !ticket) return false;

  const dot = ticket.indexOf(".");
  if (dot < 1) return false;

  const expires = Number(ticket.slice(0, dot));
  if (!Number.isFinite(expires) || Date.now() > expires) return false;

  const want = await sign(env, `${id}.${expires}`);
  const got = ticket.slice(dot + 1);

  /* Constant time, because a comparison that returns early on the
     first wrong character tells an attacker how much of a guess
     was right, one request at a time. */
  if (want.length !== got.length) return false;
  let diff = 0;
  for (let i = 0; i < want.length; i += 1) diff |= want.charCodeAt(i) ^ got.charCodeAt(i);
  return diff === 0;
}
