/* ============================================================
   /api/enquiries: the client pipeline.

   The contact form used to post to a third party and land in an
   inbox, where it competed with everything else and could be lost.
   Now every enquiry is also a row you can track: new → replied →
   closed, with private notes.

   POST   /api/enquiries        public: send one
   GET    /api/enquiries        admin:  the pipeline
   PATCH  /api/enquiries/<id>   admin:  status + notes
   DELETE /api/enquiries/<id>   admin
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.ts";
import { body, fail, methods, notConfigured, ok, str, nowISO } from "../../_lib/http.ts";
import { requireAdmin, throttle } from "../../_lib/auth.ts";
import { ENQUIRY_KIND, ENQUIRY_STATUS, allowed } from "../../../shared/rows.ts";
import { read } from "../../_lib/input.ts";

/* archive/TRANSITION.md Stage 12, step 1: the list is shared/rows.ts now. */
const KINDS = ENQUIRY_KIND;

/* Ten characters, which is what this endpoint has always asked
   for. The comments endpoint asks for two and the questions
   endpoint for ten, and the three numbers being visible beside
   each other is the point of Stage 12 step 2 rather than a thing
   it was going to unify. */
const MIN_MESSAGE = 10;

export async function onRequest(context) {
  const { request, params } = context;
  const id = Number((params.id ?? [])[0]) || null;

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(request, {
    POST: async () => {
      if (await throttle(context, "enquiry", 6, 60)) return fail("too-many", 429);

      /* The honeypot first, and before anything can fail: a bot
         that filled the hidden field gets the same cheerful
         answer as a person, and learns nothing from a validation
         error it could have used to try again. */
      const early = await read(request, { website: { text: true, max: 100 } });
      if (early.bad) return early.bad;
      if (early.value.website) return ok({ received: true });

      /* archive/TRANSITION.md Stage 12, step 2. Same declaration as the
         other two write endpoints, this one's own minimum, and
         the reasons this endpoint has always answered with. */
      const got = await read(request, {
        email: { email: true, required: "bad-email", invalid: "bad-email" },
        message: { text: true, min: MIN_MESSAGE, max: 8000, short: "too-short" },
        name: { text: true, max: 120 },
        kind: { oneOf: KINDS },
      });
      if (got.bad) return got.bad;
      const { email, message, name, kind } = got.value;

      await run(d1,
        `INSERT INTO enquiries (name, email, kind, message, status, created_at)
         VALUES (?, ?, ?, ?, 'new', ?)`,
        name, email, kind || "general", message, nowISO());

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
        allowed(ENQUIRY_STATUS, input.status) ? input.status : existing.status,
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
