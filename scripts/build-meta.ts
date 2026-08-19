#!/usr/bin/env node
/* ============================================================
   build-meta.ts, regenerates the machine-readable files from
   the site's manifest, so they can never drift out of date:

     feed.xml      RSS for the articles
     sitemap.xml   every public page
     robots.txt    with the sitemap pointer

   Run it after publishing an article:

       node scripts/build-meta.ts

   It is deliberately not a build step: the site works whether
   or not you remember to run it; you just get a stale feed if
   you don't.

   ---- it lived in aab/ and read the built copy ----

   It was `scripts/build-meta.ts`, and it reached the manifest with
   `await import(join(HERE, "content.js"))`, which is the file
   `build-modules.ts` WRITES out of `shared/content.ts`. So it
   read the output of a build rather than its source, and a
   dynamic import by path is a value nothing can typecheck.

   Both are gone by moving it here: `shared/content.ts` is the
   source, the import is static, and `scripts/tsconfig.json`
   covers this directory, so the annotations below are checked
   rather than merely written. It is also where every other
   generator in this repository already lives.
   ============================================================ */

import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import {
  SITE, PAGES, TOOLS, STAGES, allLessons, liveArticles,
  STUFEN, allTeile, stufeUrl, workbookUrl,
  DHAPS, allDars, dhapUrl,
  ENGLISH_TERMS, allParts, termUrl,
  READS, livePieces,
} from "../shared/content.ts";

/* Written into `aab/`, which is what the site is uploaded from.
   Three of these four are in `.gitattributes` as generated. */
const OUT = join(dirname(fileURLToPath(import.meta.url)), "..", "aab");

const ENTITIES: Record<string, string> = {
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;",
};

const esc = (s: unknown): string =>
  String(s).replace(/[&<>"']/g, (c) => ENTITIES[c]);

const articles = liveArticles();
const now = new Date().toUTCString();

/* ---------- feed.xml ---------- */
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${esc(SITE.name)} · Insights</title>
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

/* ---------- sitemap.xml ----------
   Stage pages are listed, and so is every WRITTEN lesson. Lessons
   still marked "soon" are deliberately left out: those pages
   exist so that a listed thing is never a dead link, but they are
   a paragraph long and putting them in the sitemap would be
   asking search engines to index placeholders. They go in the
   moment they are written, with no other change needed here.

   There was a `&& !l.stage.inline` here, for a stage whose
   lessons were anchors on the hub rather than pages. The starter
   guide was the only one and it has been eight pages since 17
   August 2026, so the branch matched nothing: `inline` is not a
   field on `Stage` any more and the test was reading undefined on
   every lesson. Nothing typechecked this file, so it read as a
   live rule for two days. */
const lessons = allLessons().filter((l) => l.status === "live");

/* The German school, on the same rule: every Stufe index, every
   written Teil, and each Stufe's practice book. Unwritten Teile
   stay out, those pages exist so a listed thing is never a dead
   link, not so a search engine can index a placeholder. */
const teile = allTeile().filter((t) => t.status === "live");
/* `workbookUrl` already answers null for a Stufe with no book or
   one not yet live, so the condition is asked once, there, rather
   than being repeated here where it could drift from it. */
const workbooks = STUFEN.map(workbookUrl).filter((u): u is string => u !== null);

/* The Quranic Arabic school, third time the same rule. It has no
   practice book: the day is the lesson, so a ধাপ index and its
   days are the whole of it. */
const dars = allDars().filter((l) => l.status === "live");

/* The English school, fourth time the same rule. Its practice
   book is already a PAGES entry, built from the curriculum the
   way the German ones are, so only the terms and their parts are
   added here. */
const parts = allParts().filter((p) => p.status === "live");

/** One line of the sitemap. `lastmod` only where there is a real
    date to give: an article has one and a hub does not, and a
    made-up one is worse than none. */
interface SitemapUrl {
  loc: string;
  lastmod?: string;
  priority: string;
}

const urls: SitemapUrl[] = [
  /* `url` is optional on a PAGES entry and a sitemap cannot hold
     a missing one: without this filter an entry without one emits
     `<loc>https://reiad.co.uknull</loc>`, which is a URL a
     crawler will dutifully try. */
  ...PAGES.filter((p) => !p.private && p.url)
    .map((p) => ({ loc: p.url as string, priority: "0.8" })),
  ...articles.map((a) => ({ loc: `/insights/${a.slug}.html`, lastmod: a.date, priority: "0.9" })),
  ...STAGES.map((s) => ({ loc: `/money/${s.slug}/index.html`, priority: "0.8" })),
  ...lessons.map((l) => ({ loc: l.url, priority: "0.7" })),
  ...STUFEN.map((s) => ({ loc: stufeUrl(s), priority: "0.8" })),
  ...workbooks.map((loc) => ({ loc, priority: "0.8" })),
  ...teile.map((t) => ({ loc: t.url, priority: "0.7" })),
  ...DHAPS.map((d) => ({ loc: dhapUrl(d), priority: "0.8" })),
  ...dars.map((l) => ({ loc: l.url, priority: "0.7" })),
  ...ENGLISH_TERMS.map((t) => ({ loc: termUrl(t), priority: "0.8" })),
  ...parts.map((p) => ({ loc: p.url, priority: "0.7" })),
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
const robots = `# ${SITE.name}: ${SITE.tagline}
User-agent: *
Allow: /

# The publishing tool and what it collected are mine, not content.
Disallow: /studio/
Disallow: /desk/
Disallow: /insights/_template.html

# One person's own copy of a third-party course, behind the admin
# check. A crawler cannot sign in, so what it would index is the
# same "loading" shell under every address in the section.
Disallow: /skills/courses/

Sitemap: ${SITE.origin}/sitemap.xml
`;

writeFileSync(join(OUT, "feed.xml"), feed);
writeFileSync(join(OUT, "sitemap.xml"), sitemap);
writeFileSync(join(OUT, "robots.txt"), robots);

console.log(`feed.xml     ${articles.length} article(s)`);
console.log(`sitemap.xml  ${urls.length} URLs`);
console.log("robots.txt   written");
console.log(
  `(${TOOLS.length} calculators, ${STAGES.length} learn stages, ` +
  `${lessons.length} written lesson(s) of ${allLessons().length})`
);
console.log(
  `(${STUFEN.length} German Stufen, ${teile.length} written Teil(e) of ${allTeile().length}, ` +
  `${workbooks.length} practice book(s))`
);
console.log(
  `(${DHAPS.length} Quran ধাপ, ${dars.length} written day page(s) of ${allDars().length})`
);
console.log(
  `(${ENGLISH_TERMS.length} English terms, ${parts.length} written part(s) of ${allParts().length})`
);
console.log(
  `(${READS.map((s) => `${livePieces(s).length} ${s.en.toLowerCase()}`).join(", ")} piece(s))`
);
