/* ============================================================
   /api/comments: a thread under a piece, moderated.

   GET    /api/comments?slug=<slug>     public: approved comments
   GET    /api/comments?status=pending  admin:  the queue
   POST   /api/comments                 reader: leave one
   PATCH  /api/comments/<id>            admin:  approve / bin
   DELETE /api/comments/<id>            admin

   ---- the two rules this endpoint exists to enforce ----

   **Signing in is required, and the server decides who you are.**
   The browser sends its Supabase access token; `readerFrom()`
   checks the signature against Supabase's public keys before a
   single claim is believed. Without that, `author_id` is whatever
   the poster typed, and a comment system where anyone can post as
   anyone is worse than none.

   **Nothing appears until it is approved.** Including from a
   signed-in reader, including from me. That was the decision taken
   in August 2026 and it is the safe end of the range: it can be
   loosened later without anybody noticing, and tightening it after
   the spam arrives is a much worse day.

   ---- what a comment is not ----

   It is not HTML. The body is stored and returned as text and the
   page renders it with textContent, so there is no sanitiser in
   this path to get wrong. Every previous class of injection bug on
   this site came from parsing something; this parses nothing.

   TRANSITION.md, Stage 7.
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.js";
import {
  body, fail, methods, notConfigured, ok, str, nowISO,
} from "../../_lib/http.js";
import { requireAdmin } from "../../_lib/auth.js";
import { throttle } from "../../_lib/auth.js";
import { readerFrom } from "../../_lib/reader.js";
import { SECTIONS, COMMENT_STATUS, allowed } from "../../../shared/rows.js";

/* Never `author_id`. The site shows a name, not an identifier, and
   a reader's Supabase id is not the public's business. */
const PUBLIC = `id, slug, section, parent_id, author_name, body, created_at`;
const ADMIN = `${PUBLIC}, author_id, status, approved_at`;

const MAX_BODY = 4000;
const MIN_BODY = 2;

/* Where a piece can live, so a thread cannot be attached to a made
   up mount. TRANSITION.md Stage 12, step 1: this used to be a
   second copy of the list in the articles endpoint, under a
   comment saying so, which is how a copy gets kept until it is
   not. */
const safeSection = (v) => (allowed(SECTIONS, v) ? String(v) : "insights");

const safeSlug = (v) => {
  const s = str(v, 120).toLowerCase();
  return /^[a-z0-9-]+$/.test(s) ? s : "";
};

export async function onRequest(context) {
  const { request, params, env } = context;
  const id = Number((params.id ?? [])[0]) || null;
  const url = new URL(request.url);

  const d1 = await db(env);
  if (!d1) return notConfigured();

  return methods(request, {
    GET: async () => {
      /* ---- the moderation queue ---- */
      const wanted = url.searchParams.get("status");
      if (wanted) {
        const guard = await requireAdmin(context);
        if (guard) return guard;
        const rows = await all(d1,
          `SELECT ${ADMIN} FROM comments WHERE status = ?
            ORDER BY created_at DESC LIMIT 200`,
          wanted === "all" ? "pending" : str(wanted, 20));
        return ok({ comments: rows });
      }

      /* ---- a thread, for anybody ---- */
      const slug = safeSlug(url.searchParams.get("slug"));
      if (!slug) return fail("slug-required");

      const rows = await all(d1,
        `SELECT ${PUBLIC} FROM comments
          WHERE slug = ? AND status = 'live'
          ORDER BY created_at ASC LIMIT 500`, slug);

      /* One level of replies, assembled here rather than by the
         page: the page should not have to know the shape of a
         thread to draw one. */
      const top = rows.filter((r) => !r.parent_id);
      const byParent = new Map();
      for (const r of rows.filter((x) => x.parent_id)) {
        if (!byParent.has(r.parent_id)) byParent.set(r.parent_id, []);
        byParent.get(r.parent_id).push(r);
      }
      return ok({
        comments: top.map((r) => ({ ...r, replies: byParent.get(r.id) ?? [] })),
        count: rows.length,
      });
    },

    /* ---- leaving one ---- */
    POST: async () => {
      let reader;
      try {
        reader = await readerFrom(request, env);
      } catch (err) {
        /* A token was presented and is not good. Worth telling
           apart from not being signed in: the browser can react by
           refreshing its session rather than by asking the reader
           to sign in again. */
        return fail("bad-token", 401, { message: String(err.message ?? err) });
      }
      if (!reader) return fail("sign-in-required", 401);

      /* Signed in or not, one person cannot fill the queue. It
         returns a boolean, not a Response, which is the same shape
         the questions endpoint uses two files away. */
      if (await throttle(context, "comment", 10, 60)) return fail("too-many", 429);

      const input = await body(request);
      const slug = safeSlug(input.slug);
      if (!slug) return fail("slug-required");

      const text = str(input.body, MAX_BODY);
      if (text.length < MIN_BODY) return fail("empty");

      /* A reply has to point at a real, live comment on the SAME
         piece, or "one level of replies" is a suggestion rather
         than a rule, and a reply can be smuggled under a thread it
         was never written for. */
      let parent = null;
      if (input.parent_id) {
        const found = await one(d1,
          `SELECT id, slug, parent_id FROM comments
            WHERE id = ? AND status = 'live'`, Number(input.parent_id) || 0);
        if (!found || found.slug !== slug) return fail("no-such-parent", 400);
        if (found.parent_id) return fail("replies-are-one-level", 400);
        parent = found.id;
      }

      /* The name is taken from the verified token, never from the
         request body. Somebody may rename themselves on the account
         page afterwards; this is who they were when they wrote it. */
      const name = str(reader.name || "Reader", 60);

      await run(d1,
        `INSERT INTO comments
           (slug, section, parent_id, author_id, author_name, body, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, 'pending', ?)`,
        slug, safeSection(input.section), parent,
        reader.id, name, text, nowISO());

      /* Deliberately no row back. There is nothing to show yet, and
         answering with the comment would invite a page to render
         it, which is the one thing moderation is for. */
      return ok({ queued: true });
    },

    PATCH: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");

      const input = await body(request);
      const status = allowed(COMMENT_STATUS, input.status) ? input.status : null;
      if (!status) return fail("bad-status");

      await run(d1,
        `UPDATE comments SET status = ?, approved_at = ? WHERE id = ?`,
        status, status === "live" ? nowISO() : null, id);

      return ok({ comment: await one(d1, `SELECT ${ADMIN} FROM comments WHERE id = ?`, id) });
    },

    DELETE: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");
      /* A deleted parent would leave its replies pointing at
         nothing, so they go with it. */
      await run(d1, `DELETE FROM comments WHERE id = ? OR parent_id = ?`, id, id);
      return ok({ deleted: id });
    },
  });
}
