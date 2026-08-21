/* ============================================================
   /api/backup: reading the backups out.

   GET /api/backup/articles   public: live articles, whole
   GET /api/backup/full       admin:  every table worth keeping
   GET /api/backup/status     admin:  what R2 is holding

   ---- why /articles is public, on purpose ----

   It returns live articles and only live articles, and every byte
   of a live article is already served to anyone who asks for its
   URL. This endpoint is a faster way to read what a crawler could
   read anyway, which is why the nightly backup workflow can call
   it with no credential at all.

   That is worth being explicit about rather than leaving to be
   inferred, because "a public endpoint that dumps the articles
   table" is a sentence that should make anyone reading it stop.
   The answer is the WHERE clause in articleBackup(), and it is the
   only thing standing between this and a leak. It is tested.

   ---- and why /full is not ----

   Because it holds readers' email addresses and the admin password
   hash. See the long note at the top of _lib/backup.ts.
   ============================================================ */

import { db } from "../../_lib/db.ts";
import { fail, json, methods, notConfigured } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.ts";
import { articleBackup, fullSnapshot, writeSnapshot } from "../../_lib/backup.ts";

export async function onRequest(context) {
  const { request, params } = context;
  const route = (params.route ?? [])[0] ?? "";

  return methods(request, {
    GET: async () => {
      const d1 = await db(context.env);
      if (!d1) return notConfigured();

      if (route === "articles") {
        const data = await articleBackup(d1);
        /* Cached for five minutes at the edge. The workflow asks
           once a night, but this is a public URL and the answer is
           the same for everybody, so there is no reason for a
           second caller to cost a second set of D1 reads. */
        return json(data, 200, { "Cache-Control": "public, max-age=300" });
      }

      const denied = await requireAdmin(context);
      if (denied) return denied;

      if (route === "full") return json(await fullSnapshot(d1));

      if (route === "status") {
        if (!context.env.MEDIA) return json({ ok: true, r2: false, snapshots: [] });
        const listed = await context.env.MEDIA.list({ prefix: "backups/" });
        return json({
          ok: true,
          r2: true,
          snapshots: listed.objects
            .map((o) => ({ key: o.key, bytes: o.size, at: o.uploaded }))
            .sort((a, b) => (a.key < b.key ? 1 : -1)),
        });
      }

      return fail("not-found", 404);
    },

    /* Taking one on demand, which is what you want the minute
       before doing something to the database you are not sure
       about. The cron does the same thing at 03:17. */
    POST: async () => {
      const denied = await requireAdmin(context);
      if (denied) return denied;
      const d1 = await db(context.env);
      if (!d1) return notConfigured();
      return json(await writeSnapshot(context.env, d1));
    },
  });
}
