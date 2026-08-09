/* ============================================================
   /api/questions — reader questions, moderated.

   Nothing a reader submits appears on the site until you publish
   it, so this can't be used to put words on your pages.

   GET   /api/questions?slug=<slug>   public: published Q&A there
   GET   /api/questions?status=pending admin: the moderation queue
   POST  /api/questions               public: ask one
   PATCH /api/questions/<id>          admin: answer / publish / bin
   DELETE /api/questions/<id>         admin
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.js";
import { body, fail, isEmail, methods, notConfigured, ok, str, nowISO } from "../../_lib/http.js";
import { requireAdmin } from "../../_lib/auth.js";
import { throttle } from "../../_lib/auth.js";

const PUBLIC = `id, slug, name, body, answer, created_at, answered_at`;

export async function onRequest(context) {
  const { request, params } = context;
  const id = Number((params.id ?? [])[0]) || null;
  const url = new URL(request.url);

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(request, {
    GET: async () => {
      const status = url.searchParams.get("status");

      // The moderation queue is the only view that needs an account.
      if (status && status !== "published") {
        const guard = await requireAdmin(context);
        if (guard) return guard;

        /* "all" exists because the alternative was worse: the desk
           could only ask for pending and published, so anything
           archived or marked spam left the interface for good. A
           button labelled "Not spam, just private" quietly became a
           delete. */
        const q = str(url.searchParams.get("q"), 120);
        const like = `%${q.replace(/[%_]/g, "")}%`;

        const rows = status === "all"
          ? await all(d1,
              `SELECT * FROM questions
                WHERE (? = '' OR body LIKE ? OR name LIKE ? OR slug LIKE ?)
                ORDER BY created_at DESC LIMIT 300`, q, like, like, like)
          : await all(d1,
              `SELECT * FROM questions
                WHERE status = ?
                  AND (? = '' OR body LIKE ? OR name LIKE ? OR slug LIKE ?)
                ORDER BY created_at DESC LIMIT 300`, status, q, like, like, like);

        // Counts for every status, so the desk can show what is where
        // without fetching all of it.
        const tally = await all(d1,
          `SELECT status, COUNT(*) AS n FROM questions GROUP BY status`);

        return ok({
          questions: rows,
          counts: Object.fromEntries(tally.map((r) => [r.status, r.n])),
        });
      }

      const slug = str(url.searchParams.get("slug"), 80);
      const rows = slug
        ? await all(d1,
            `SELECT ${PUBLIC} FROM questions
             WHERE slug = ? AND status = 'published' ORDER BY answered_at DESC LIMIT 50`, slug)
        : await all(d1,
            `SELECT ${PUBLIC} FROM questions
             WHERE status = 'published' ORDER BY answered_at DESC LIMIT 50`);
      return ok({ questions: rows });
    },

    /* ---------- anyone can ask ---------- */
    POST: async () => {
      if (await throttle(context, "ask", 5, 30)) return fail("too-many", 429);

      const input = await body(request);
      const text = str(input.body, 4000);
      if (text.length < 10) return fail("too-short");

      /* Honeypot: a hidden field only a bot fills in. The reply is
         still a cheerful "queued", so the bot has nothing to learn.

         What changed is what happens to the question. It used to be
         dropped on the floor — and a person whose password manager
         filled that hidden field got told "Got it, I read every one
         of these" while their question was destroyed, leaving no
         record that it had ever existed. Quarantining costs a row
         and makes that recoverable. */
      const trapped = !!str(input.website, 100);

      const email = str(input.email, 200);
      await run(d1,
        `INSERT INTO questions (slug, name, email, body, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        str(input.slug, 80) || null,
        str(input.name, 80),
        email && isEmail(email) ? email : null,
        text,
        trapped ? "spam" : "pending",
        nowISO());

      return ok({ queued: true });
    },

    /* ---------- moderate ---------- */
    PATCH: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");

      const input = await body(request);
      const existing = await one(d1, `SELECT * FROM questions WHERE id = ?`, id);
      if (!existing) return fail("not-found", 404);

      const status = ["pending", "published", "spam", "archived"].includes(input.status)
        ? input.status : existing.status;
      const answer = input.answer === undefined
        ? existing.answer : str(input.answer, 8000);

      await run(d1,
        `UPDATE questions SET answer = ?, status = ?, answered_at = ? WHERE id = ?`,
        answer, status,
        status === "published" ? (existing.answered_at ?? nowISO()) : existing.answered_at,
        id);

      return ok({ question: await one(d1, `SELECT * FROM questions WHERE id = ?`, id) });
    },

    DELETE: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");
      await run(d1, `DELETE FROM questions WHERE id = ?`, id);
      return ok({ deleted: id });
    },
  });
}
