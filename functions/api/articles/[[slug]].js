/* ============================================================
   /api/articles — the CMS.

   GET    /api/articles           public: every live article
   GET    /api/articles?all=1     admin:  drafts too
   GET    /api/articles/<slug>    public: one article, body included
   POST   /api/articles           admin:  create or overwrite
   PATCH  /api/articles/<slug>    admin:  partial update (publish etc.)
   DELETE /api/articles/<slug>    admin

   The body is sanitised again here, server-side. The Studio already
   cleans what it pastes, but a client-side sanitiser protects the
   person pasting, not the site — anything that can reach the write
   endpoint has to be cleaned where it can't be bypassed.
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.js";
import {
  body, fail, methods, notConfigured, ok, str, nowISO, today,
} from "../../_lib/http.js";
import { requireAdmin, readSession } from "../../_lib/auth.js";
import { sanitiseHTML, readingMinutes } from "../../_lib/sanitise.js";

const PUBLIC_COLUMNS =
  `slug, title, dek, tag, topics, lang, minutes, status, cover,
   published_at, updated_at, notion_page_id, notion_synced_at`;

/* D1 caps a single value at 2 MB. A body is measured in bytes rather
   than characters because Bangla costs three of them per character,
   so a character count would let a Bangla piece through at three
   times the size of the English one it was meant to match. */
const MAX_BODY_BYTES = 1_000_000;
const bytes = (s) => new TextEncoder().encode(s).length;

const shape = (row) => ({
  ...row,
  topics: row.topics ? row.topics.split("|").filter(Boolean) : [],
});

/* A cover ends up in an og:image tag, so it has to be a path this
   site serves. An off-site URL there is someone else's bandwidth and
   someone else's uptime on our social cards. */
const safeCover = (value) => {
  const v = str(value, 300);
  return /^\/(media|og)\/[A-Za-z0-9._/-]+$/.test(v) ? v : "";
};

export async function onRequest(context) {
  const { request, params } = context;
  const slug = (params.slug ?? [])[0] ?? null;
  const url = new URL(request.url);

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(request, {
    /* ---------------- read ---------------- */
    GET: async () => {
      const signedIn = !!(await readSession(context));
      const wantsAll = url.searchParams.get("all") === "1" && signedIn;

      if (slug) {
        const row = await one(d1,
          `SELECT ${PUBLIC_COLUMNS}, body FROM articles WHERE slug = ?`, slug);
        if (!row) return fail("not-found", 404);
        if (row.status !== "live" && !signedIn) return fail("not-found", 404);
        return ok({ article: shape(row) });
      }

      const rows = wantsAll
        ? await all(d1,
            `SELECT ${PUBLIC_COLUMNS} FROM articles
             ORDER BY COALESCE(published_at, updated_at) DESC`)
        : await all(d1,
            `SELECT ${PUBLIC_COLUMNS} FROM articles
             WHERE status = 'live' ORDER BY published_at DESC`);

      return ok({ articles: rows.map(shape) });
    },

    /* ---------------- create / overwrite ---------------- */
    POST: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;

      const input = await body(request);
      const newSlug = str(input.slug, 80).toLowerCase().replace(/[^a-z0-9-]/g, "");
      const title = str(input.title, 300);
      if (!newSlug) return fail("slug-required");
      if (!title) return fail("title-required");

      /* The body used to be capped with slice(), which is a silent
         truncation: an article with two embedded photos was stored
         with its tail cut off, the sanitiser closed the tags that
         left dangling, and the result published cleanly as half a
         piece. Refusing is the only honest answer. */
      const raw = String(input.body ?? "");
      if (bytes(raw) > MAX_BODY_BYTES) {
        return fail("body-too-large", 413, {
          size: bytes(raw),
          limit: MAX_BODY_BYTES,
          message: "Upload the photos to /media instead of embedding them.",
        });
      }

      /* An unguarded upsert means one repeated headline silently
         replaces a published piece, with no version to go back to.
         The Studio asks first; anything else has to say so too. */
      const existing = await one(d1,
        `SELECT slug, title, status, updated_at FROM articles WHERE slug = ?`, newSlug);
      if (existing && input.overwrite !== true) {
        return fail("slug-exists", 409, { existing });
      }

      const clean = sanitiseHTML(raw);
      const status = input.status === "live" ? "live" : "draft";
      const now = nowISO();

      await run(d1,
        `INSERT INTO articles
           (slug, title, dek, tag, topics, lang, body, minutes, status, cover,
            published_at, created_at, updated_at, notion_page_id, notion_synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           title = excluded.title, dek = excluded.dek, tag = excluded.tag,
           topics = excluded.topics, lang = excluded.lang, body = excluded.body,
           minutes = excluded.minutes, status = excluded.status,
           cover = excluded.cover,
           published_at = COALESCE(articles.published_at, excluded.published_at),
           updated_at = excluded.updated_at,
           notion_page_id = COALESCE(excluded.notion_page_id, articles.notion_page_id),
           notion_synced_at = COALESCE(excluded.notion_synced_at, articles.notion_synced_at)`,
        newSlug, title, str(input.dek, 600), str(input.tag, 80),
        (Array.isArray(input.topics) ? input.topics : [])
          .map((t) => str(t, 40)).filter(Boolean).join("|"),
        input.lang === "bn" ? "bn" : "en",
        clean,
        readingMinutes(clean),
        status,
        safeCover(input.cover),
        status === "live" ? (str(input.published_at, 10) || today()) : null,
        now, now,
        str(input.notion_page_id, 64) || null,
        input.notion_page_id ? now : null);

      const saved = await one(d1, `SELECT ${PUBLIC_COLUMNS} FROM articles WHERE slug = ?`, newSlug);
      return ok({ article: shape(saved), replaced: !!existing });
    },

    /* ---------------- partial update ---------------- */
    PATCH: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!slug) return fail("slug-required");

      const existing = await one(d1, `SELECT * FROM articles WHERE slug = ?`, slug);
      if (!existing) return fail("not-found", 404);

      const input = await body(request);
      const status = input.status === "live" || input.status === "draft"
        ? input.status : existing.status;

      /* Everything here is optional: a PATCH that names only a status
         is the publish/unpublish button, and one that names a title
         is fixing a typo without republishing the whole body. */
      const pick = (key, value) => (key in input ? value : existing[key]);

      await run(d1,
        `UPDATE articles
            SET title = ?, dek = ?, tag = ?, topics = ?, lang = ?, cover = ?,
                status = ?, published_at = ?, updated_at = ?
          WHERE slug = ?`,
        pick("title", str(input.title, 300) || existing.title),
        pick("dek", str(input.dek, 600)),
        pick("tag", str(input.tag, 80)),
        pick("topics", (Array.isArray(input.topics) ? input.topics : [])
          .map((t) => str(t, 40)).filter(Boolean).join("|")),
        pick("lang", input.lang === "bn" ? "bn" : "en"),
        pick("cover", safeCover(input.cover)),
        status,
        status === "live" ? (existing.published_at ?? today()) : existing.published_at,
        nowISO(), slug);

      const saved = await one(d1, `SELECT ${PUBLIC_COLUMNS} FROM articles WHERE slug = ?`, slug);
      return ok({ article: shape(saved) });
    },

    /* ---------------- delete ---------------- */
    DELETE: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!slug) return fail("slug-required");
      await run(d1, `DELETE FROM articles WHERE slug = ?`, slug);
      return ok({ deleted: slug });
    },
  });
}
