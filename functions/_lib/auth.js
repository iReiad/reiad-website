/* ============================================================
   _lib/auth.js, real authentication, at last.

   The old Studio gate ran entirely in the browser, which I was
   careful to describe honestly as a lock on a glass house: with
   no server there was nothing to actually verify against.

   There is a server now, so this is the real thing:

     · the password is never stored: only PBKDF2-SHA256 at
       210,000 iterations over a random 16-byte salt
     · comparison is constant-time
     · a successful login mints a 256-bit session token, stored
       server-side; the browser only gets an HttpOnly, Secure,
       SameSite=Strict cookie it cannot read from JavaScript
     · sessions expire, and can be revoked from the dashboard
     · failed attempts are throttled per caller, and the throttle
       table stores a daily-rotating salted hash rather than an IP

   Protected endpoints call requireAdmin(context) and get either a
   session or a 401. Nothing sensitive is decided in the browser.

   ---- Where the 210,000 iterations actually run ----

   They used to run here, and that was a bug you could not see
   from the code: Workers on the free plan get 10ms of CPU per
   request, and PBKDF2-SHA256 at 210,000 iterations costs about
   30ms. Every login and every first-run setup was killed by the
   runtime mid-request (Cloudflare error 1102), which reaches the
   browser as an HTML error page rather than JSON, so the Studio
   could only report "couldn't reach the server".

   So the work moved to the browser, where there is no CPU limit,
   and the server keeps a fast hash of the result:

     browser   dk = PBKDF2-SHA256(passphrase, salt, 210_000)
     server    stored = SHA-256(dk)

   The security that matters is unchanged. Anyone who steals the
   database gets SHA-256(dk), and to turn that back into the
   passphrase they still have to run 210,000 iterations of PBKDF2
   per guess, exactly as before. A single SHA-256 is the right
   hash for the server's half because its input is 256 bits of
   derived key, not a guessable human password.

   What the server gives up is checking the passphrase's length
   itself; the browser enforces the twelve-character minimum, and
   a caller who skips the browser is only ever weakening their own
   single-admin login. The setup endpoint still closes forever
   after first use, and login is still throttled.
   ============================================================ */

import { db, one, run, setting, setSetting } from "./db.js";
import { fail, nowISO } from "./http.ts";

const ITERATIONS = 210_000;
const SESSION_DAYS = 30;
const COOKIE = "reiad_session";
const enc = new TextEncoder();

/* ---------- encoding ---------- */
const toB64 = (buf) => btoa(String.fromCharCode(...new Uint8Array(buf)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
/* base64url, unpadded. A session token travels in a cookie, and
   padded base64 puts "=" inside the value, which trips up naive
   cookie parsers (including, briefly, the one below). Sticking to
   [A-Za-z0-9_-] sidesteps the entire class of problem. */
const randomToken = (bytes = 32) =>
  toB64(crypto.getRandomValues(new Uint8Array(bytes)))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function sha256(text) {
  return toB64(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

/* ---------- password hashing ---------- */

async function derive(password, salt, iterations = ITERATIONS) {
  const key = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" }, key, 256
  );
  return toB64(bits);
}

/** "pbkdf2$iterations$salt$hash"– everything needed to verify, and
    nothing that helps an attacker who reads the database.

    Legacy: this derives server-side and cannot complete inside the
    free plan's CPU budget. Kept only so a database written by an
    older deploy can still be signed into (and then re-set), never
    used for anything created from here on. */
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const hash = await derive(password, salt);
  return `pbkdf2$${ITERATIONS}$${toB64(salt)}$${hash}`;
}

export async function verifyPassword(password, stored) {
  const [scheme, iterations, salt, expected] = String(stored ?? "").split("$");
  if (scheme !== "pbkdf2" || !salt || !expected) return false;
  const actual = await derive(password, fromB64(salt), Number(iterations) || ITERATIONS);
  return timingSafeEqual(actual, expected);
}

/* ---------- the browser-derived scheme (the one in use) ----------

   Stored as "pbkdf2c$iterations$salt$verifier", where the browser
   produced dk = PBKDF2(passphrase, salt, iterations) and the
   verifier is SHA-256(dk). The "c" is for client-side, and it is
   what tells the two formats apart on read. */

export const CLIENT_ITERATIONS = ITERATIONS;

/** The salt is public by design: it stops one rainbow table from
    working against every site, and it is useless on its own. */
export const newSalt = () => toB64(crypto.getRandomValues(new Uint8Array(16)));

/** What the browser needs before it can derive: which scheme is
    stored, over which salt, at how many iterations. */
export function keyParams(stored) {
  const [scheme, iterations, salt] = String(stored ?? "").split("$");
  return { scheme, iterations: Number(iterations) || ITERATIONS, salt: salt ?? "" };
}

export async function setAdminKey(d1, { salt, iterations, dk }) {
  await setSetting(d1, ADMIN_KEY, `pbkdf2c$${iterations}$${salt}$${await sha256(dk)}`);
}

export async function verifyKey(dk, stored) {
  const [scheme, , , expected] = String(stored ?? "").split("$");
  if (scheme !== "pbkdf2c" || !expected) return false;
  return timingSafeEqual(await sha256(dk), expected);
}

/* base64 of 16 random bytes is 24 chars; of 256 derived bits, 44.
   Both are checked before they reach the database. */
export const isSalt = (s) => /^[A-Za-z0-9+/]{20,48}={0,2}$/.test(String(s ?? ""));
export const isKey = (s) => /^[A-Za-z0-9+/]{40,86}={0,2}$/.test(String(s ?? ""));

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/* ---------- sessions ---------- */

/* Split on the FIRST "=" only: a cookie value may legitimately
   contain more of them, and splitting on all of them silently
   throws such cookies away. */
function cookieFrom(request) {
  const out = {};
  for (const part of (request.headers.get("Cookie") ?? "").split(";")) {
    const at = part.indexOf("=");
    if (at < 1) continue;
    out[part.slice(0, at).trim()] = part.slice(at + 1).trim();
  }
  return out;
}

/** `secure` is decided by the request, not hard-coded: a Secure cookie
    is never stored over plain http, so hard-coding it would make
    `wrangler pages dev` on http://localhost impossible to sign into.
    Anything that isn't localhost is https in production, Cloudflare
    redirects and HSTS see to that, so this gives up nothing real. */
export function sessionCookie(token, { clear = false, secure = true } = {}) {
  return [
    `${COOKIE}=${clear ? "" : token}`,
    "Path=/",
    "HttpOnly",
    secure ? "Secure" : null,
    "SameSite=Strict",
    clear ? "Max-Age=0" : `Max-Age=${SESSION_DAYS * 86400}`,
  ].filter(Boolean).join("; ");
}

/** False only on a local development server. */
export const isSecure = (request) => {
  const url = new URL(request.url);
  return url.protocol === "https:" ||
    !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
};

export async function createSession(d1, label = "") {
  const token = randomToken(32);
  const expires = new Date(Date.now() + SESSION_DAYS * 86400_000).toISOString();
  // Only a hash of the token is stored, so a database dump doesn't
  // hand anyone a working session.
  await run(d1,
    `INSERT INTO sessions (token, label, created_at, expires_at) VALUES (?, ?, ?, ?)`,
    await sha256(token), label, nowISO(), expires);
  return token;
}

export async function readSession(context) {
  const d1 = await db(context.env);
  if (!d1) return null;
  const token = cookieFrom(context.request)[COOKIE];
  if (!token) return null;

  const row = await one(d1,
    `SELECT * FROM sessions WHERE token = ? AND expires_at > ?`,
    await sha256(token), nowISO());
  return row ?? null;
}

export async function destroySession(context) {
  const d1 = await db(context.env);
  const token = cookieFrom(context.request)[COOKIE];
  if (d1 && token) await run(d1, `DELETE FROM sessions WHERE token = ?`, await sha256(token));
}

/** Use at the top of any admin endpoint:
      const guard = await requireAdmin(context);
      if (guard) return guard;                */
export async function requireAdmin(context) {
  const session = await readSession(context);
  return session ? null : fail("unauthorised", 401);
}

/* ---------- first-run setup ---------- */

export const ADMIN_KEY = "admin_password";

export const isConfigured = async (d1) => !!(await setting(d1, ADMIN_KEY));

export async function setAdminPassword(d1, password) {
  await setSetting(d1, ADMIN_KEY, await hashPassword(password));
}

/* ---------- throttling ----------
   Keyed by a hash of the caller and the day, so the table can slow
   an abuser down without ever holding an address. */

export async function throttle(context, name, limit, windowMinutes = 15) {
  const d1 = await db(context.env);
  if (!d1) return false;

  // Throttling defends against the open internet. On a local dev server
  // there is no untrusted caller, and rate-limiting yourself out of your
  // own machine while testing helps nobody.
  if (!isSecure(context.request)) return false;

  const ip = context.request.headers.get("CF-Connecting-IP") ?? "local";
  const day = nowISO().slice(0, 10);
  const bucket = `${name}:${await sha256(`${ip}|${day}|${name}`)}`;
  const resets = new Date(Date.now() + windowMinutes * 60_000).toISOString();

  const row = await one(d1, `SELECT count, resets FROM throttle WHERE bucket = ?`, bucket);
  if (!row || row.resets < nowISO()) {
    await run(d1,
      `INSERT INTO throttle (bucket, count, resets) VALUES (?, 1, ?)
       ON CONFLICT(bucket) DO UPDATE SET count = 1, resets = excluded.resets`,
      bucket, resets);
    return false;
  }
  if (row.count >= limit) return true;
  await run(d1, `UPDATE throttle SET count = count + 1 WHERE bucket = ?`, bucket);
  return false;
}
