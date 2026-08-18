/* ============================================================
   _lib/admins.js: is this reader one of the site's own people?

   Not the Studio's passphrase admin, which is _lib/auth.js and
   one person with a password. This is about a signed-in READER
   holding extra rights: the live-portfolio dashboard's admin
   half, and a comment that goes live without the queue.

   Two records, either is enough:

   - ADMIN_READERS in wrangler.toml, a comma-separated list of
     Supabase user ids. A user id names an account and opens
     nothing, so it is a var rather than a secret, and it is the
     half that works before any migration has run.

   - public.admins in Supabase, the durable record, one row per
     admin, granted only in SQL (see the broker_admins
     migration). Its select policy shows a reader their own row
     and nobody else's, which is exactly the one question asked
     here, asked with the reader's own forwarded bearer.

   The answer is cached per reader for five minutes per isolate,
   because "still an admin?" does not change mid-page and the
   comments endpoint should not pay a REST round trip per post.
   ============================================================ */

const cache = new Map();
const TTL = 5 * 60 * 1000;

export async function isAdmin(env, request, readerId) {
  if (!readerId) return false;

  const listed = String(env.ADMIN_READERS ?? "")
    .split(",").map((s) => s.trim()).filter(Boolean);
  if (listed.includes(readerId)) return true;

  const hit = cache.get(readerId);
  if (hit && Date.now() - hit.at < TTL) return hit.admin;

  let admin = false;
  if (env.SUPABASE_KEY && env.SUPABASE_URL) {
    const res = await fetch(
      `${env.SUPABASE_URL}/rest/v1/admins?select=user_id&limit=1`,
      {
        headers: {
          apikey: env.SUPABASE_KEY,
          Authorization: request.headers.get("Authorization") ?? "",
        },
      });
    const rows = res.ok ? await res.json().catch(() => null) : null;
    admin = Array.isArray(rows) && rows.length > 0;
  }
  cache.set(readerId, { at: Date.now(), admin });
  return admin;
}

/** For tests and for anything that wants to reset between runs. */
export const forgetAdmins = () => cache.clear();
