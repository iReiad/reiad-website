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

/** Whatever this needs off the Worker's environment. Declared
    rather than left as `any`, so that adding a record to consult
    is a change to a type as well as to a dashboard. */
export interface AdminEnv {
  /** Comma-separated Supabase user ids. A var and not a secret: a
      user id names an account and opens nothing. */
  ADMIN_READERS?: string;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}

const cache = new Map<string, { at: number; admin: boolean }>();
const TTL = 5 * 60 * 1000;

/**
 * The ORDER of these three arguments is load bearing and was not
 * checkable while this file was JavaScript.
 *
 * `/api/routine/templates` called it `isAdmin(reader, env)`, so
 * `readerId` arrived undefined, the guard on the next line
 * returned false, and the private template was served to nobody
 * including an admin. It failed closed, which is the right
 * direction to fail in and is exactly why nothing noticed: the
 * page looked like an account with no private templates, which is
 * what almost every account is.
 *
 * As `.ts` that call is a compile error at all four call sites.
 */
export async function isAdmin(
  env: AdminEnv, request: Request, readerId: string | null | undefined,
): Promise<boolean> {
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
    const rows: unknown = res.ok ? await res.json().catch(() => null) : null;
    admin = Array.isArray(rows) && rows.length > 0;
  }
  cache.set(readerId, { at: Date.now(), admin });
  return admin;
}

/** For tests and for anything that wants to reset between runs. */
export const forgetAdmins = (): void => cache.clear();
