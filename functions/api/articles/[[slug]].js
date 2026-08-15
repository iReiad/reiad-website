/* ============================================================
   /api/articles: the CMS.

   GET    /api/articles           public: every live article
   GET    /api/articles?all=1     admin:  drafts too
   GET    /api/articles/<slug>    public: one article, body included
   POST   /api/articles           admin:  create or overwrite
   PATCH  /api/articles/<slug>    admin:  partial update (publish etc.)
   DELETE /api/articles/<slug>    admin

   The body is sanitised again here, server-side. The Studio already
   cleans what it pastes, but a client-side sanitiser protects the
   person pasting, not the site, anything that can reach the write
   endpoint has to be cleaned where it can't be bypassed.
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.js";
import {
  body, fail, methods, notConfigured, ok, str, nowISO, today,
} from "../../_lib/http.js";
import { requireAdmin, readSession } from "../../_lib/auth.js";
import { sanitiseHTML, readingMinutes } from "../../_lib/sanitise.js";

/* `embedded` is computed rather than stored: it says whether the
   body still carries a photo as a data: URL instead of a /media
   path. The desk needs it to offer the repair, and it must not be
   a column, because the answer changes every time the body does.

   It exists at all because for a while no photo could reach R2:
   reading a data: URL back is governed by connect-src, and the
   policy allowed data: under img-src only, so every upload was
   blocked before it left the browser. See aab/photo.js. */
const PUBLIC_COLUMNS =
  `slug, title, dek, tag, topics, lang, minutes, status, section, cover,
   published_at, updated_at, notion_page_id, notion_synced_at,
   (instr(body, 'data:image') > 0) AS embedded`;

/* Where a piece lives. The Studio offers these three and the desk
   moves pieces between them; anything else is a typo or an older
   client, and Insights is where a piece went before sections
   existed. Kept as a list rather than a free string because it
   becomes a URL prefix, and a URL prefix from a request body is
   how you end up serving /etc/passwd.html. */
const SECTIONS = ["insights", "cooking", "travel"];
const safeSection = (value) =>
  SECTIONS.includes(String(value ?? "")) ? String(value) : "insights";

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

/** Keep the last twenty bodies for a slug, and no more. */
const KEEP_VERSIONS = 20;

async function snapshot(d1, row) {
  if (!row) return;
  await run(d1,
    `INSERT INTO article_versions (slug, title, dek, tag, lang, body, cover, saved_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    row.slug, row.title ?? "", row.dek ?? "", row.tag ?? "",
    row.lang ?? "en", row.body ?? "", row.cover ?? "", nowISO());

  // An article edited daily for a year should not carry a year of
  // bodies around with it.
  await run(d1,
    `DELETE FROM article_versions
      WHERE slug = ? AND id NOT IN (
        SELECT id FROM article_versions WHERE slug = ?
        ORDER BY saved_at DESC, id DESC LIMIT ?)`,
    row.slug, row.slug, KEEP_VERSIONS);
}

export async function onRequest(context) {
  const { request, params } = context;
  const parts = params.slug ?? [];
  const slug = parts[0] ?? null;
  const section = parts[1] ?? null;      // "versions"
  const url = new URL(request.url);

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  return methods(request, {
    /* ---------------- read ---------------- */
    GET: async () => {
      const signedIn = !!(await readSession(context));
      const wantsAll = url.searchParams.get("all") === "1" && signedIn;

      /* ---- /api/articles/<slug>/versions ---- */
      if (slug && section === "versions") {
        const guard = await requireAdmin(context);
        if (guard) return guard;
        const rows = await all(d1,
          `SELECT id, title, dek, tag, lang, cover, saved_at, length(body) AS size
             FROM article_versions WHERE slug = ?
            ORDER BY saved_at DESC, id DESC`, slug);
        return ok({ versions: rows });
      }

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

      /* ---- put an older body back ---- */
      if (slug && section === "versions") {
        const wanted = Number((await body(request)).id) || 0;
        const version = await one(d1,
          `SELECT * FROM article_versions WHERE id = ? AND slug = ?`, wanted, slug);
        if (!version) return fail("not-found", 404);

        const live = await one(d1, `SELECT * FROM articles WHERE slug = ?`, slug);
        if (!live) return fail("not-found", 404);

        // Restoring replaces a body too, so it is itself snapshotted.
        // Going back is never the thing that loses the newer draft.
        await snapshot(d1, live);

        await run(d1,
          `UPDATE articles
              SET title = ?, dek = ?, tag = ?, lang = ?, body = ?, cover = ?,
                  minutes = ?, updated_at = ?
            WHERE slug = ?`,
          version.title, version.dek, version.tag, version.lang,
          version.body, version.cover, readingMinutes(version.body), nowISO(), slug);

        return ok({
          article: shape(await one(d1, `SELECT ${PUBLIC_COLUMNS} FROM articles WHERE slug = ?`, slug)),
          restored: version.id,
        });
      }

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

      // Keep what is about to be replaced, before replacing it.
      if (existing) {
        await snapshot(d1, await one(d1, `SELECT * FROM articles WHERE slug = ?`, newSlug));
      }

      await run(d1,
        `INSERT INTO articles
           (slug, title, dek, tag, topics, lang, body, minutes, status, section, cover,
            published_at, created_at, updated_at, notion_page_id, notion_synced_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           title = excluded.title, dek = excluded.dek, tag = excluded.tag,
           topics = excluded.topics, lang = excluded.lang, body = excluded.body,
           minutes = excluded.minutes, status = excluded.status,
           section = excluded.section,
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
        safeSection(input.section),
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
            SET title = ?, dek = ?, tag = ?, topics = ?, lang = ?, section = ?,
                cover = ?, status = ?, published_at = ?, updated_at = ?
          WHERE slug = ?`,
        pick("title", str(input.title, 300) || existing.title),
        pick("dek", str(input.dek, 600)),
        pick("tag", str(input.tag, 80)),
        pick("topics", (Array.isArray(input.topics) ? input.topics : [])
          .map((t) => str(t, 40)).filter(Boolean).join("|")),
        pick("lang", input.lang === "bn" ? "bn" : "en"),
        /* Moving a piece between sections is a PATCH with one key in
           it, sent by the desk. It changes the URL the piece is
           served at, which is why the old one has to stop answering:
           see the section check in functions/insights/[slug].js. */
        pick("section", safeSection(input.section)),
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
      // The history of something that no longer exists is just weight.
      await run(d1, `DELETE FROM article_versions WHERE slug = ?`, slug);
      return ok({ deleted: slug });
    },
  });
}
