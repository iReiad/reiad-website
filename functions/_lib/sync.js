/* ============================================================
   _lib/sync.js, keeping Notion and the site in step.

   Run from a Cron trigger (see wrangler.toml) and from
   /api/notion/sync for an on-demand pass. For every article that
   came from Notion, ask whether the page has been edited since the
   last sync, and if it has, pull it in again.

   ---- "as I type" is not what you want ----

   Notion does not push a change per keystroke, and if it did, the
   half-written middle of a sentence would be live on the site. So
   this polls, and it only touches an article that is **already
   linked and already published**, importing something new is still
   a decision made in the Studio.

   A page can also hold the sync off entirely. If it has a Status
   property and that status is not one of the ready words below, the
   page is left alone however often it changes. That is the switch
   between "still writing" and "this is finished".

   ---- photos ----

   A Worker has no canvas, so nothing here can resize or re-encode.
   Images are copied to R2 at whatever size Notion holds them, which
   is the honest trade for a sync that runs without a browser: it
   keeps the article from pointing at a URL that expires within the
   hour, and the Studio can re-optimise later. Oversized ones are
   skipped rather than stored, and said so in the result.
   ============================================================ */

import { all, one, run } from "./db.ts";
import { nowISO } from "./http.ts";
import { sanitiseHTML, readingMinutes } from "./sanitise.ts";
import { client, convert, fetchBlocks, readFields } from "./notion.js";

/* A Cron run gets the same subrequest budget as any other request,
   50 on the free plan, and each article costs at least one page
   fetch plus one block page, before any images. Three at a time
   keeps a run comfortably inside it; the next run picks up the rest,
   oldest sync first. */
const MAX_ARTICLES_PER_RUN = 3;
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

/** Words in a Notion Status/State column that mean "put it out". */
const READY = /^(live|published|publish|ready|done|complete[d]?)$/i;

const IMAGE_EXT = {
  "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png",
  "image/gif": "gif", "image/avif": "avif",
};

async function hash(buffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest, 0, 8)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

/**
 * Copy every proxied Notion image into R2 and repoint it.
 *
 * The converter leaves images pointing at /api/notion/asset?u=<signed
 * URL>, which is fine in the Studio, the browser is logged in, and
 * useless in a stored article, because the signature expires. This
 * turns them into /media paths.
 */
async function rehost(html, slug, bucket) {
  if (!bucket) return { html, copied: 0, skipped: 0 };

  const pattern = /<img\b[^>]*\bsrc="([^"]*\/api\/notion\/asset\?u=([^"&]+))"/g;
  const seen = new Map();
  let copied = 0;
  let skipped = 0;

  for (const [, , encoded] of [...html.matchAll(pattern)]) {
    if (seen.has(encoded)) continue;
    try {
      const source = decodeURIComponent(encoded);
      const upstream = await fetch(source);
      if (!upstream.ok) { skipped++; continue; }

      const type = (upstream.headers.get("Content-Type") ?? "").split(";")[0].trim();
      const ext = IMAGE_EXT[type];
      if (!ext) { skipped++; continue; }

      const bytes = await upstream.arrayBuffer();
      if (bytes.byteLength > MAX_IMAGE_BYTES) { skipped++; continue; }

      const key = `${slug}/${await hash(bytes)}.${ext}`;
      if (!(await bucket.head(key))) {
        await bucket.put(key, bytes, {
          httpMetadata: { contentType: type, cacheControl: "public, max-age=31536000, immutable" },
        });
      }
      seen.set(encoded, `/media/${key}`);
      copied++;
    } catch {
      skipped++;
    }
  }

  // Replace whole src attributes, so a signed URL cannot survive by
  // being a substring of something else.
  const out = html.replace(pattern, (whole, src, encoded) => {
    const hosted = seen.get(encoded);
    return hosted ? whole.replace(src, hosted) : whole;
  });

  return { html: out, copied, skipped };
}

/**
 * One pass. Returns a report rather than throwing, because a Cron run
 * that dies silently is worse than one that says what it managed.
 */
export async function syncFromNotion(env, d1, { origin, force = false } = {}) {
  if (!env.NOTION_TOKEN) return { ok: false, reason: "not-configured" };

  const notion = client(env.NOTION_TOKEN);
  const linked = await all(d1,
    `SELECT slug, notion_page_id, notion_synced_at, status
       FROM articles
      WHERE notion_page_id IS NOT NULL AND notion_page_id != ''
      ORDER BY COALESCE(notion_synced_at, '') ASC
      LIMIT ?`, MAX_ARTICLES_PER_RUN);

  const report = { ok: true, checked: 0, updated: [], skipped: [], failed: [] };

  for (const article of linked) {
    report.checked++;
    try {
      const page = await notion(`/pages/${article.notion_page_id}`);

      // Untouched since the last pass? Nothing to do, and no block
      // fetches spent finding that out.
      if (!force && article.notion_synced_at
          && page.last_edited_time <= article.notion_synced_at) {
        report.skipped.push({ slug: article.slug, why: "unchanged" });
        continue;
      }

      const fields = readFields(page.properties);
      if (fields.status && !READY.test(fields.status)) {
        report.skipped.push({ slug: article.slug, why: `status is "${fields.status}"` });
        continue;
      }

      const state = { fetches: 0, truncated: false };
      const blocks = await fetchBlocks(notion, article.notion_page_id, state);
      const converted = await convert(blocks, { notion, origin, state });

      // A page that converts to nothing is almost always a page the
      // integration lost access to. Refusing to blank a live article
      // over that is worth the one extra branch.
      if (!converted.trim()) {
        report.skipped.push({ slug: article.slug, why: "converted to nothing" });
        continue;
      }

      const { html, copied, skipped } = await rehost(converted, article.slug, env.MEDIA);
      const clean = sanitiseHTML(html);
      const now = nowISO();

      // Same body as last time? Then this was a Notion edit that did
      // not change anything we render, and the article is left alone.
      const current = await one(d1, `SELECT * FROM articles WHERE slug = ?`, article.slug);
      if (current && current.body === clean && !force) {
        await run(d1, `UPDATE articles SET notion_synced_at = ? WHERE slug = ?`, now, article.slug);
        report.skipped.push({ slug: article.slug, why: "no rendered change" });
        continue;
      }

      // Keep the body being replaced, exactly as a publish does.
      if (current) {
        await run(d1,
          `INSERT INTO article_versions (slug, title, dek, tag, lang, body, cover, saved_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          current.slug, current.title ?? "", current.dek ?? "", current.tag ?? "",
          current.lang ?? "en", current.body ?? "", current.cover ?? "", now);
        await run(d1,
          `DELETE FROM article_versions
            WHERE slug = ? AND id NOT IN (
              SELECT id FROM article_versions WHERE slug = ?
              ORDER BY saved_at DESC, id DESC LIMIT 20)`,
          current.slug, current.slug);
      }

      await run(d1,
        `UPDATE articles
            SET title = COALESCE(NULLIF(?, ''), title),
                dek = COALESCE(NULLIF(?, ''), dek),
                tag = COALESCE(NULLIF(?, ''), tag),
                lang = ?, body = ?, minutes = ?,
                updated_at = ?, notion_synced_at = ?
          WHERE slug = ?`,
        fields.title ?? "", fields.dek ?? "", fields.tag ?? "",
        fields.lang === "bn" ? "bn" : "en",
        clean, readingMinutes(clean), now, now, article.slug);

      report.updated.push({
        slug: article.slug, photos: copied,
        ...(skipped ? { photosSkipped: skipped } : {}),
        ...(state.truncated ? { truncated: true } : {}),
      });
    } catch (err) {
      report.failed.push({ slug: article.slug, error: String(err?.message ?? err) });
    }
  }

  return report;
}
