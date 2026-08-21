/* ============================================================
   /api/comments: a thread under a piece, moderated.

   GET    /api/comments?slug=<slug>     public: approved comments
   GET    /api/comments?status=pending  admin:  the queue
   GET    /api/comments?by=author       admin:  who wrote them, counted
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

   archive/TRANSITION.md, Stage 7.
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.ts";
import type { DbEnv } from "../../_lib/db.ts";
import {
  body, fail, methods, notConfigured, ok, str, nowISO,
} from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.ts";
import { throttle } from "../../_lib/auth.ts";
import { readerFrom } from "../../_lib/reader.ts";
import type { Reader, ReaderEnv } from "../../_lib/reader.ts";
import { isAdmin } from "../../_lib/admins.ts";
import type { AdminEnv } from "../../_lib/admins.ts";
import { SECTIONS, COMMENT_STATUS, allowed } from "../../../shared/rows.ts";
import type { CommentRow } from "../../../shared/rows.ts";
import { read, safeSlug } from "../../_lib/input.ts";

/** What this route binds: D1 for the thread, and whatever
    `readerFrom()` and `isAdmin()` read for themselves. Narrow on
    purpose: adding a binding is a change to a type as well as to
    wrangler.toml. */
type CommentsEnv = DbEnv & ReaderEnv & AdminEnv;

/* Never `author_id`. The site shows a name, not an identifier, and
   a reader's Supabase id is not the public's business. */
const PUBLIC = `id, slug, section, parent_id, author_name, body, created_at`;
const ADMIN = `${PUBLIC}, author_id, status, approved_at`;

/** The two SELECT lists above, as types. Picked out of `CommentRow`
    rather than written again, and picked rather than used whole: a
    row selected without a column is not a row that has it, and a
    type saying otherwise is believed. */
type PublicComment = Pick<
  CommentRow,
  "id" | "slug" | "section" | "parent_id" | "author_name" | "body" | "created_at"
>;
type AdminComment = PublicComment
  & Pick<CommentRow, "author_id" | "status" | "approved_at">;

/** One person's comments, counted. `?by=author`, for ADMIN.md §3
    D's People panel, which is the one panel needing both
    credentials: this half is D1 behind the passphrase, and the
    account half reads `profiles` in Supabase with the reader's own
    bearer. `author_id` is the join and it is the ONLY one this
    database offers. Questions and enquiries carry a typed name and
    an email rather than an id, so nothing can attach one to an
    account without joining on a string anybody can type.

    Counted here rather than in the browser because the queue above
    stops at 200 rows per state, and a total drawn from a capped
    list is a wrong number on the one page where that is expensive. */
interface AuthorTally {
  author_id: string;
  /** The name on their LATEST comment, not their name today.
      `author_name` is a copy taken at the time of writing, so it
      differs row to row when somebody renames themselves. */
  author_name: string;
  comments: number;
  live: number;
  pending: number;
  binned: number;
  /** ISO, of the latest one. */
  last_at: string;
}

const MAX_BODY = 4000;
const MIN_BODY = 2;

/* Where a piece can live, so a thread cannot be attached to a made
   up mount. archive/TRANSITION.md Stage 12, step 1: this used to be a
   second copy of the list in the articles endpoint, under a
   comment saying so, which is how a copy gets kept until it is
   not. */
const safeSection = (v: unknown): string =>
  (allowed(SECTIONS, v) ? String(v) : "insights");

/* `safeSlug` is imported from _lib/input.ts as of Stage 12 step
   2. It was written out here and in the articles endpoint, and
   both said the same thing: lower case, and nothing in it that
   could become a path segment somewhere else. */

export async function onRequest(
  context: RouteContext<CommentsEnv, { id?: string[] }>,
): Promise<Response> {
  const { request, params, env } = context;
  const id = Number((params.id ?? [])[0]) || null;
  const url = new URL(request.url);

  const d1 = await db(env);
  if (!d1) return notConfigured();

  return methods(request, {
    GET: async () => {
      /* ---- who has written them, counted ---- */
      if (url.searchParams.get("by") === "author") {
        const guard = await requireAdmin(context);
        if (guard) return guard;

        /* `author_name` is a BARE COLUMN beside an aggregate, and
           that is legal here rather than sloppy: SQLite takes
           every bare column from the row that produced the min or
           max, PROVIDED the query has exactly one of them. This
           has exactly one, `MAX(created_at)`, so the name is the
           one on their latest comment. Add a second min or max and
           the guarantee is gone and the name becomes whichever row
           the planner reached, silently.

           `author_id <> ''` because an id is what makes a row a
           person: grouping an empty one would invent somebody. */
        const authors = await all<AuthorTally>(d1,
          `SELECT author_id, author_name,
                  COUNT(*) AS comments,
                  SUM(CASE WHEN status = 'live'    THEN 1 ELSE 0 END) AS live,
                  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) AS pending,
                  SUM(CASE WHEN status = 'binned'  THEN 1 ELSE 0 END) AS binned,
                  MAX(created_at) AS last_at
             FROM comments
            WHERE author_id <> ''
            GROUP BY author_id
            ORDER BY comments DESC, last_at DESC
            LIMIT 200`);

        /* The whole table's numbers, so a capped list can never be
           read as a total. ADMIN.md §0: this is the one page where
           a wrong number is expensive. */
        const totals = await one<{ authors: number; comments: number }>(d1,
          `SELECT COUNT(DISTINCT author_id) AS authors, COUNT(*) AS comments
             FROM comments WHERE author_id <> ''`);

        return ok({ authors, totals: totals ?? { authors: 0, comments: 0 } });
      }

      /* ---- the moderation queue ---- */
      const wanted = url.searchParams.get("status");
      if (wanted) {
        const guard = await requireAdmin(context);
        if (guard) return guard;
        const rows = await all<AdminComment>(d1,
          `SELECT ${ADMIN} FROM comments WHERE status = ?
            ORDER BY created_at DESC LIMIT 200`,
          wanted === "all" ? "pending" : str(wanted, 20));
        return ok({ comments: rows });
      }

      /* ---- a thread, for anybody ---- */
      const slug = safeSlug(url.searchParams.get("slug"));
      if (!slug) return fail("slug-required");

      const rows = await all<PublicComment>(d1,
        `SELECT ${PUBLIC} FROM comments
          WHERE slug = ? AND status = 'live'
          ORDER BY created_at ASC LIMIT 500`, slug);

      /* One level of replies, assembled here rather than by the
         page: the page should not have to know the shape of a
         thread to draw one. */
      const top = rows.filter((r) => !r.parent_id);
      const byParent = new Map<number, PublicComment[]>();
      for (const r of rows) {
        if (!r.parent_id) continue;
        const kids = byParent.get(r.parent_id);
        if (kids) kids.push(r);
        else byParent.set(r.parent_id, [r]);
      }
      return ok({
        comments: top.map((r) => ({ ...r, replies: byParent.get(r.id) ?? [] })),
        count: rows.length,
      });
    },

    /* ---- leaving one ---- */
    POST: async () => {
      let reader: Reader | null;
      try {
        reader = await readerFrom(request, env);
      } catch (err) {
        /* A token was presented and is not good. Worth telling
           apart from not being signed in: the browser can react by
           refreshing its session rather than by asking the reader
           to sign in again. */
        return fail("bad-token", 401, {
          message: String(err instanceof Error ? err.message : err),
        });
      }
      if (!reader) return fail("sign-in-required", 401);

      /* Signed in or not, one person cannot fill the queue. It
         returns a boolean, not a Response, which is the same shape
         the questions endpoint uses two files away. */
      if (await throttle(context, "comment", 10, 60)) return fail("too-many", 429);

      /* archive/TRANSITION.md Stage 12, step 2. The three checks below
         were three checks in three files with three different
         minimums; the declaration is what they are now, and the
         reasons are the ones this endpoint has always answered
         with, because a browser reads them. */
      const got = await read(request, {
        slug: { slug: true, required: "slug-required" },
        body: { text: true, min: MIN_BODY, max: MAX_BODY, short: "empty" },
      });
      if (got.bad) return got.bad;
      const { slug, body: text } = got.value;
      const input = got.input;

      /* A reply has to point at a real, live comment on the SAME
         piece, or "one level of replies" is a suggestion rather
         than a rule, and a reply can be smuggled under a thread it
         was never written for. */
      let parent: number | null = null;
      if (input.parent_id) {
        const found = await one<Pick<CommentRow, "id" | "slug" | "parent_id">>(d1,
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

      /* The site's own people skip their own queue. Moderation
         exists so a stranger's words wait for the person who runs
         the site; when the writer IS that person, pending would
         mean approving yourself, a button with one possible
         answer. Everybody else's path is exactly as it was. */
      const live = await isAdmin(env, request, reader.id);

      await run(d1,
        `INSERT INTO comments
           (slug, section, parent_id, author_id, author_name, body,
            status, created_at, approved_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        slug, safeSection(input.section), parent,
        reader.id, name, text,
        live ? "live" : "pending", nowISO(), live ? nowISO() : null);

      /* Deliberately no row back. There is nothing to show yet, and
         answering with the comment would invite a page to render
         it, which is the one thing moderation is for. `live` tells
         an admin's browser their words are already up, so it can
         reload the thread instead of promising a wait. */
      return ok(live ? { queued: false, live: true } : { queued: true });
    },

    PATCH: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!id) return fail("id-required");

      const input = await body(request);
      /* `allowed()` answers a boolean and narrows nothing, so the
         value is stringified rather than asserted: anything that
         passes stringifies to one of the three states already. */
      const status: string | null =
        allowed(COMMENT_STATUS, input.status) ? String(input.status) : null;
      if (!status) return fail("bad-status");

      await run(d1,
        `UPDATE comments SET status = ?, approved_at = ? WHERE id = ?`,
        status, status === "live" ? nowISO() : null, id);

      return ok({
        comment: await one<AdminComment>(
          d1, `SELECT ${ADMIN} FROM comments WHERE id = ?`, id),
      });
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
