/* ============================================================
   /api/signals, analytics that can't identify anybody.

   POST /api/signals/view   { path }        counter += 1
   POST /api/signals/react  { slug, kind }  counter += 1
   GET  /api/signals/stats                  admin: what's working

   What is stored: a path, a date, and a number. That's the whole
   record. No IP address, no cookie, no fingerprint, no session, no
   third party: there is nothing here that could be tied back to a
   person even if someone wanted to.

   That keeps the promise the colophon makes while still answering
   the only question worth asking: which explainers are landing?
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.ts";
import { body, fail, methods, notConfigured, ok, str, today } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.js";

const REACTIONS = ["helpful", "confusing", "more"];

export async function onRequest(context) {
  const { request, params } = context;
  const kind = (params.kind ?? [])[0] ?? "";

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  /* ---------- a page was read ---------- */
  if (kind === "view") {
    return methods(request, {
      POST: async () => {
        const path = str((await body(request)).path, 200);
        // Only count paths this site actually serves.
        if (!/^\/[a-z0-9/_.-]*$/i.test(path)) return ok({ counted: false });

        await run(d1,
          `INSERT INTO views (path, day, count) VALUES (?, ?, 1)
           ON CONFLICT(path, day) DO UPDATE SET count = count + 1`,
          path, today());
        return ok({ counted: true });
      },
    });
  }

  /* ---------- a reader reacted ---------- */
  if (kind === "react") {
    return methods(request, {
      POST: async () => {
        const input = await body(request);
        const slug = str(input.slug, 120);
        const reaction = str(input.kind, 20);
        if (!slug || !REACTIONS.includes(reaction)) return fail("bad-reaction");

        await run(d1,
          `INSERT INTO reactions (slug, kind, count) VALUES (?, ?, 1)
           ON CONFLICT(slug, kind) DO UPDATE SET count = count + 1`,
          slug, reaction);

        const rows = await all(d1,
          `SELECT kind, count FROM reactions WHERE slug = ?`, slug);
        return ok({ counts: Object.fromEntries(rows.map((r) => [r.kind, r.count])) });
      },

      GET: async () => {
        const slug = str(new URL(request.url).searchParams.get("slug"), 120);
        const rows = await all(d1, `SELECT kind, count FROM reactions WHERE slug = ?`, slug);
        return ok({ counts: Object.fromEntries(rows.map((r) => [r.kind, r.count])) });
      },
    });
  }

  /* ---------- what's working ---------- */
  if (kind === "stats") {
    return methods(request, {
      GET: async () => {
        const guard = await requireAdmin(context);
        if (guard) return guard;

        const days = Math.min(90, Number(new URL(request.url).searchParams.get("days")) || 30);
        const since = new Date(Date.now() - days * 86400_000).toISOString().slice(0, 10);

        const [top, daily, totals, reactions] = await Promise.all([
          all(d1, `SELECT path, SUM(count) AS views FROM views WHERE day >= ?
                   GROUP BY path ORDER BY views DESC LIMIT 25`, since),
          all(d1, `SELECT day, SUM(count) AS views FROM views WHERE day >= ?
                   GROUP BY day ORDER BY day`, since),
          one(d1, `SELECT SUM(count) AS views FROM views WHERE day >= ?`, since),
          all(d1, `SELECT slug, kind, count FROM reactions ORDER BY count DESC LIMIT 40`),
        ]);

        return ok({ days, since, total: totals?.views ?? 0, top, daily, reactions });
      },
    });
  }

  return fail("unknown-signal", 404);
}
