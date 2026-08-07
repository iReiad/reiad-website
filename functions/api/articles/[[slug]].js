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
  `slug, title, dek, tag, topics, lang, minutes, status, published_at, updated_at`;

const shape = (row) => ({
  ...row,
  topics: row.topics ? row.topics.split("|").filter(Boolean) : [],
});

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

      const clean = sanitiseHTML(str(input.body, 400_000));
      const status = input.status === "live" ? "live" : "draft";
      const now = nowISO();

      await run(d1,
        `INSERT INTO articles
           (slug, title, dek, tag, topics, lang, body, minutes, status,
            published_at, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(slug) DO UPDATE SET
           title = excluded.title, dek = excluded.dek, tag = excluded.tag,
           topics = excluded.topics, lang = excluded.lang, body = excluded.body,
           minutes = excluded.minutes, status = excluded.status,
           published_at = COALESCE(articles.published_at, excluded.published_at),
           updated_at = excluded.updated_at`,
        newSlug, title, str(input.dek, 600), str(input.tag, 80),
        (Array.isArray(input.topics) ? input.topics : [])
          .map((t) => str(t, 40)).filter(Boolean).join("|"),
        input.lang === "bn" ? "bn" : "en",
        clean,
        readingMinutes(clean),
        status,
        status === "live" ? (str(input.published_at, 10) || today()) : null,
        now, now);

      const saved = await one(d1, `SELECT ${PUBLIC_COLUMNS} FROM articles WHERE slug = ?`, newSlug);
      return ok({ article: shape(saved) });
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

      await run(d1,
        `UPDATE articles SET status = ?, published_at = ?, updated_at = ? WHERE slug = ?`,
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
