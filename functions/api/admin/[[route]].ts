/* ============================================================
   /api/admin/*

   ONE ROUTE so far, `health`, and it is deliberately the only
   thing on this whole panel that needs no credential.

   ---- why an ungated route on an admin panel ----

   Because the panel has to be useful on the day the credential is
   the thing that is broken. A page that can only tell you the
   site is healthy once you have proved who you are cannot tell
   you that the sign-in is what is down, which is the one moment
   somebody opens it in a hurry.

   ---- so it answers only what a stranger could already infer ----

   Every field below is a BOOLEAN or a shape, never a value. That
   the database is reachable, not what is in it. That a secret is
   configured, not what it is. That the site is on a commit, which
   is public in the repository anyway.

   The test for adding a field is: could somebody work this out by
   using the site for a minute? A count of drafts could not, so a
   count of drafts does not go here; it goes in a panel behind the
   passphrase where `ADMIN.md` puts it.

   `scripts/check-admin.ts`, which ADMIN.md stage 2 adds, is what
   will hold that line: every endpoint under `functions/api/` is
   gated, or is named in a list with its reason. This route is the
   first entry in that list.
   ============================================================ */

import { fail, methods, ok } from "../../_lib/http.ts";

/** The one thing this asks of D1, declared rather than pulled in
    from `@cloudflare/workers-types`: nothing else under
    `functions/` is typed against that package, and adding a
    dependency to describe one call is a bigger commitment than
    the call. */
interface D1Like {
  prepare(sql: string): { first(): Promise<unknown> };
}

export interface AdminEnv {
  DB?: D1Like;
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
  /** The two Drive secrets, asked about and never read. */
  GOOGLE_SA_EMAIL?: string;
  GOOGLE_SA_KEY?: string;
  /** The sealed-key secret the broker needs to store one at all. */
  BROKER_TOKEN_KEY?: string;
  ADMIN_READERS?: string;
  /** Set by the deploy. Absent locally, which is not a fault. */
  COMMIT?: string;
}

interface AdminContext {
  request: Request;
  env: AdminEnv;
  params: { route?: string[] };
}

/** One round trip, timed, and never fatal: a store that is down
    is a thing to REPORT rather than a reason for this endpoint to
    fail, which is the whole point of it. */
async function reach(run: () => Promise<unknown>): Promise<{ ok: boolean; ms: number }> {
  const at = Date.now();
  try {
    await run();
    return { ok: true, ms: Date.now() - at };
  } catch {
    return { ok: false, ms: Date.now() - at };
  }
}

export async function onRequest(context: AdminContext): Promise<Response> {
  const { request, env, params } = context;
  const route = (params.route ?? []).join("/");

  if (route !== "health") return fail("not-found", 404);

  return methods(request, {
    GET: async () => {
      const d1 = env.DB
        ? await reach(() => env.DB!.prepare("select 1").first())
        : { ok: false, ms: 0 };

      /* Asked WITHOUT a reader's bearer, so what this establishes
         is that the project answers at all. Whether a given
         reader can see their rows is row-level security's answer
         and belongs to the reader, not to this. */
      const supa = env.SUPABASE_URL && env.SUPABASE_KEY
        ? await reach(async () => {
          const res = await fetch(`${env.SUPABASE_URL}/rest/v1/`, {
            headers: { apikey: env.SUPABASE_KEY! },
          });
          if (!res.ok) throw new Error(String(res.status));
        })
        : { ok: false, ms: 0 };

      return ok({
        commit: env.COMMIT ?? null,
        stores: {
          d1: { bound: Boolean(env.DB), ...d1 },
          supabase: { configured: Boolean(env.SUPABASE_URL && env.SUPABASE_KEY), ...supa },
        },
        /* Configured, never read. `canReachDrive()` asks the same
           question one level down and this deliberately does not
           call it: that would spend a token exchange on a page
           load. */
        secrets: {
          drive: Boolean(env.GOOGLE_SA_EMAIL && env.GOOGLE_SA_KEY),
          brokerSeal: Boolean(env.BROKER_TOKEN_KEY),
          adminReaders: String(env.ADMIN_READERS ?? "").split(",").filter((s) => s.trim()).length,
        },
      });
    },
  });
}
