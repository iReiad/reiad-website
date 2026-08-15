/* ============================================================
   /feed.xml and /sitemap.xml: the static files, plus the database.

   Both are generated at build time by aab/build-meta.mjs, which
   reads content.js. That is the right source for everything written
   as a file, and it cannot see a thing about articles published
   through the Studio, because those live in D1 and content.js is
   committed to git.

   The effect was quiet and bad: a piece published from the Studio
   was live and readable, and absent from the feed and the sitemap.
   Nothing pointed search engines at it and nobody subscribed ever
   saw it. The "get the index entry" button existed to paste it in by
   hand, which cannot work for an article the Worker publishes,
   since the Worker cannot commit to the repository.

   So this takes the generated file as the base and merges the
   database in on the way out. No duplication of content.js in the
   Worker, and with no database bound it returns the static file
   untouched, which is exactly what it used to serve.
   ============================================================ */

import { all, db } from "../_lib/db.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

/* Where a piece is served from, by section. The same three mounts
   the Studio publishes to and worker.js routes; a row with an
   unknown section is served from /insights/, which is where every
   row lived before sections existed. */
const MOUNTS = { insights: "/insights/", cooking: "/cooking/", travel: "/travel/" };
const mountOf = (a) => MOUNTS[a?.section] ?? MOUNTS.insights;
const urlOf = (a, origin) => `${origin}${mountOf(a)}${a.slug}.html`;

/** Slugs the generated file already lists, so nothing appears twice.
    Any of the three mounts, because a piece written by hand in
    /cooking/ is in the committed sitemap under that path. */
function existingSlugs(xml) {
  const found = new Set();
  const re = /\/(?:insights|cooking|travel)\/([a-z0-9-]+)\.html/gi;
  for (const m of xml.matchAll(re)) found.add(m[1].toLowerCase());
  return found;
}

const rssItem = (a, origin) => {
  const url = urlOf(a, origin);
  return `
    <item>
      <title>${esc(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(`${a.published_at}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${esc(a.dek)}</description>
    </item>`;
};

const sitemapEntry = (a, origin) => `
  <url>
    <loc>${urlOf(a, origin)}</loc>
    <lastmod>${String(a.updated_at ?? a.published_at ?? "").slice(0, 10)}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

export async function onRequest(context) {
  const { request, env, params } = context;

  const kind = params.kind === "sitemap.xml" ? "sitemap"
    : params.kind === "feed.xml" ? "feed" : null;
  if (!kind) return context.next();

  // The generated file is the base, always.
  const base = await env.ASSETS.fetch(request);
  const d1 = await db(env);
  if (!d1) return base;

  let xml;
  try {
    xml = await base.text();
  } catch {
    return base;
  }

  let rows;
  try {
    rows = await all(d1,
      `SELECT slug, title, dek, published_at, updated_at
         FROM articles
        WHERE status = 'live' AND published_at IS NOT NULL
        ORDER BY published_at DESC`);
  } catch {
    return new Response(xml, { headers: base.headers });
  }

  const already = existingSlugs(xml);
  const extra = rows.filter((a) => !already.has(a.slug.toLowerCase()));
  if (!extra.length) return new Response(xml, { headers: base.headers });

  let merged;
  if (kind === "feed") {
    const origin = env.SITE_ORIGIN || new URL(request.url).origin;
    const items = extra.map((a) => rssItem(a, origin)).join("");
    // Newest first: the Studio's pieces are the recent ones, so they
    // go ahead of whatever the generated file already had.
    merged = xml.includes("<item>")
      ? xml.replace("<item>", `${items.trim()}\n    <item>`)
      : xml.replace("</channel>", `${items}\n  </channel>`);
  } else {
    const origin = env.SITE_ORIGIN || new URL(request.url).origin;
    merged = xml.replace("</urlset>",
      `${extra.map((a) => sitemapEntry(a, origin)).join("")}\n</urlset>`);
  }

  return new Response(merged, {
    headers: {
      "Content-Type": kind === "feed"
        ? "application/rss+xml; charset=utf-8"
        : "application/xml; charset=utf-8",
      // Long enough that a crawler isn't rebuilding it constantly,
      // short enough that a new piece is findable the same day.
      "Cache-Control": "public, max-age=600, stale-while-revalidate=3600",
    },
  });
}
