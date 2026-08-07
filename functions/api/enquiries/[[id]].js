/* ============================================================
   /api/enquiries — the client pipeline.

   The contact form used to post to a third party and land in an
   inbox, where it competed with everything else and could be lost.
   Now every enquiry is also a row you can track: new → replied →
   closed, with private notes.

   POST   /api/enquiries        public: send one
   GET    /api/enquiries        admin:  the pipeline
   PATCH  /api/enquiries/<id>   admin:  status + notes
   DELETE /api/enquiries/<id>   admin
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.js";
import { body, fail, isEmail, methods, notConfigured, ok, str, nowISO } from "../../_lib/http.js";
import { requireAdmin, throttle } from "../../_lib/auth.js";

const KINDS = ["hiring", "project", "reader", "general"];

export async function onRequest(context) {
  const { request, params } = context;
  const id = Number((params.id ?? [])[0]) || null;

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(request, {
    POST: async () => {
      if (await throttle(context, "enquiry", 6, 60)) return fail("too-many", 429);

      const input = await body(request);
      if (str(input.website, 100)) return ok({ received: true });   // honeypot

      const email = str(input.email, 200);
      const message = str(input.message, 8000);
      if (!isEmail(email)) return fail("bad-email");
      if (message.length < 10) return fail("too-short");

      await run(d1,
        `INSERT INTO enquiries (name, email, kind, message, status, created_at)
         VALUES (?, ?, ?, ?, 'new', ?)`,
        str(input.name, 120), email,
        KINDS.includes(input.kind) ? input.kind : "general",
        message, nowISO());

      return ok({ received: true });
    },

    GET: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      const rows = await all(d1,
        `SELECT * FROM enquiries ORDER BY
           CASE status WHEN 'new' THEN 0 WHEN 'replied' THEN 1 ELSE 2 END,
           created_at DESC
         LIMIT 300`);
      return ok({ enquiries: rows });
    },

    PATCH: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");

      const existing = await one(d1, `SELECT * FROM enquiries WHERE id = ?`, id);
      if (!existing) return fail("not-found", 404);

      const input = await body(request);
      await run(d1, `UPDATE enquiries SET status = ?, notes = ? WHERE id = ?`,
        ["new", "replied", "closed"].includes(input.status) ? input.status : existing.status,
        input.notes === undefined ? existing.notes : str(input.notes, 4000),
        id);
      return ok({ enquiry: await one(d1, `SELECT * FROM enquiries WHERE id = ?`, id) });
    },

    DELETE: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");
      await run(d1, `DELETE FROM enquiries WHERE id = ?`, id);
      return ok({ deleted: id });
    },
  });
}
