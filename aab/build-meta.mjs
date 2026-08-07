#!/usr/bin/env node
/* ============================================================
   build-meta.mjs — regenerates the machine-readable files from
   content.js, so they can never drift out of date:

     feed.xml      RSS for the articles
     sitemap.xml   every public page
     robots.txt    with the sitemap pointer

   Run it after publishing an article:

       node aab/build-meta.mjs

   It is deliberately not a build step — the site works whether
   or not you remember to run it; you just get a stale feed if
   you don't.
   ============================================================ */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const { SITE, PAGES, TOOLS, TERMS, liveArticles } =
  await import(join(HERE, "content.js"));

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" }[c]));

const articles = liveArticles();
const now = new Date().toUTCString();

/* ---------- feed.xml ---------- */
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} — Insights</title>
    <link>${SITE.origin}/insights.html</link>
    <atom:link href="${SITE.origin}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Explainers and analysis on Bangladesh and global finance, in English and Bangla.</description>
    <language>en-gb</language>
    <lastBuildDate>${now}</lastBuildDate>
    <ttl>720</ttl>
${articles.map((a) => `    <item>
      <title>${esc(a.title)}</title>
      <link>${SITE.origin}/insights/${a.slug}.html</link>
      <guid isPermaLink="true">${SITE.origin}/insights/${a.slug}.html</guid>
      <description>${esc(a.dek)}</description>
      <pubDate>${new Date(`${a.date}T09:00:00Z`).toUTCString()}</pubDate>
${(a.topics ?? []).map((t) => `      <category>${esc(t)}</category>`).join("\n")}
    </item>`).join("\n")}
  </channel>
</rss>
`;

/* ---------- sitemap.xml ---------- */
const urls = [
  ...PAGES.filter((p) => !p.private).map((p) => ({ loc: p.url, priority: "0.8" })),
  ...articles.map((a) => ({ loc: `/insights/${a.slug}.html`, lastmod: a.date, priority: "0.9" })),
  ...TERMS.map((t) => ({ loc: `/learn/terms/${t.slug}.html`, priority: "0.7" })),
];
urls[0].priority = "1.0";

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE.origin}${u.loc}</loc>${u.lastmod ? `
    <lastmod>${u.lastmod}</lastmod>` : ""}
    <priority>${u.priority}</priority>
  </url>`).join("\n")}
</urlset>
`;

/* ---------- robots.txt ---------- */
const robots = `# ${SITE.name} — ${SITE.tagline}
User-agent: *
Allow: /

# The publishing tool is mine, not content.
Disallow: /studio.html
Disallow: /insights/_template.html

Sitemap: ${SITE.origin}/sitemap.xml
`;

writeFileSync(join(HERE, "feed.xml"), feed);
writeFileSync(join(HERE, "sitemap.xml"), sitemap);
writeFileSync(join(HERE, "robots.txt"), robots);

console.log(`feed.xml     ${articles.length} article(s)`);
console.log(`sitemap.xml  ${urls.length} URLs`);
console.log("robots.txt   written");
console.log(`(${TOOLS.length} calculators live on /tools/)`);
