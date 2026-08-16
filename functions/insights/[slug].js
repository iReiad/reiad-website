/* ============================================================
   /<section>/<slug>, renders an article that lives in the
   database, and gets out of the way for one that doesn't.

   The file still lives under functions/insights/ because that is
   where it started and worker.js imports it by path, but it now
   answers for every reading section: /insights/, /cooking/ and
   /travel/. Which one a piece belongs to is a column on the row,
   and a request at the wrong mount falls through rather than
   serving the same piece at two URLs.

   Order of events:
     1. Is there a row for this slug, and is it live?  → render it
     2. Otherwise → context.next(), which serves the static file
        exactly as before

   That's what lets the Studio's publish button work while every
   article already committed as a file keeps being served as a
   file. Both kinds of article look identical to a reader, and
   the same stylesheet and scripts drive both.
   ============================================================ */

import { db, one } from "../_lib/db.js";
/* The per-section table, the share-image rules and the head facts
   all live in shared/look/ now. They were written twice, here and
   in the Studio, under a comment asking whoever changed one to
   change the other; Stage 10 adds a third reader whose acceptance
   test is that it agrees with this one, and three copies cannot
   pass that.

   It is a package rather than another file under _lib/ because the
   Next.js route reads it too, and Turbopack will not resolve an
   import above its own root. See the note in next/next.config.ts. */
import { LOOK, lookFor, dateLabel, headFacts, FONTS } from "../../shared/look.js";
import { htmlResponse } from "../../shared/headers.js";

const esc = (s) =>
  String(s ?? "").replace(/[&<>\"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function render(article, origin) {
  /* Every fact the head states, worked out once in _lib/look.js so
     that the Next.js route can state exactly the same ones. */
  const { look, url, cover, image, sized, type, locale, title, jsonLd } =
    headFacts(article, origin);
  const date = dateLabel(article);

  return `<!DOCTYPE html>
<html lang="${article.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(article.dek)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${esc(article.dek)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${image}">${sized ? `
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">` : ""}
  <meta property="og:image:type" content="${type}">
  <meta property="og:site_name" content="Reiad's Library">
  <meta property="og:locale" content="${locale}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${image}">
  <script>
    (function () {
      var saved = localStorage.getItem("theme");
      if (saved === "dark" || saved === "light") {
        document.documentElement.setAttribute("data-theme", saved);
      }
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Reiad's Library, Insights" href="/feed.xml">
  <meta name="theme-color" content="#0B3D2E">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body${look.bodyClass ? ` class="${look.bodyClass}"` : ""}>
  <a class="skip" href="#main">${look.skip}</a>
  <div class="read-progress" aria-hidden="true"></div>

  <header>
    <div class="wrap header-inner">
      <a class="site-name" href="/index.html">
        <svg class="site-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor"/>
          <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor"/>
          <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor"/>
          <circle cx="63" cy="24" r="5.5" fill="currentColor"/>
        </svg>
        Reiad's Library
      </a>
      <nav aria-label="Main">
        <a href="/learn/index.html" data-keep>Learn</a>
        <a href="/skills/index.html" data-nav-skills${
          look === LOOK.insights ? "" : ' aria-current="true"'}>Skills</a>
        <a href="/tools/index.html">Tools</a>
        <a href="/insights.html"${
          look === LOOK.insights ? ' aria-current="page"' : ""}>Insights</a>
        <a href="/portfolio.html">Portfolio</a>
        <a href="/about.html">About</a>
        <a href="/contact.html" data-keep>Contact</a>
      </nav>
      <button class="icon-btn" id="open-menu" aria-label="Open the menu"><span class="burger" aria-hidden="true"></span>Menu</button>
      <button class="icon-btn" id="open-palette" aria-label="Search the site (Ctrl+K)">⌕ <span class="kbd-hint">Ctrl K</span></button>
      <button class="icon-btn" id="theme-toggle" aria-label="Switch between light and dark mode">◐</button>
    </div>
  </header>

  <main id="main">
    <article class="wrap article" data-slug="${esc(article.slug)}">
      <span class="eyebrow mono">${esc(article.tag)}</span>
      <h1>${esc(article.title)}</h1>
      ${article.dek ? `<p class="lede">${esc(article.dek)}</p>` : ""}
      <p class="byline mono">
        <span>Rony Reiad</span><span class="dot"></span>
        <time datetime="${esc(article.published_at)}">${date}</time><span class="dot"></span>
        <span>${look.minutes(article.minutes)}</span>
      </p>

${article.body}

      <div class="note">${esc(look.note)}</div>

      <div class="prev-next">
        <a href="${look.back.url}">
          <span class="mono">${esc(look.back.kicker)}</span>
          <strong>${esc(look.back.label)}</strong>
        </a>
        <a href="${look.side.url}">
          <span class="mono">${esc(look.side.kicker)}</span>
          <strong>${esc(look.side.label)}</strong>
        </a>
      </div>
    </article>

    <!-- The thread. Empty in the markup and filled by comments.js,
         which is loaded lazily and allowed to fail: a piece with a
         broken thread reads perfectly and has no thread, which is
         rule 8 in TRANSITION.md. Approved comments are readable by
         anybody; signing in is only needed to add one. -->
    <section class="wrap wrap-narrow comments" id="comments"
             data-slug="${esc(article.slug)}" data-section="${esc(article.section)}"></section>
  </main>

  <footer>
    <div class="wrap">
      <span class="mono">Reiad's Library · Finance &amp; Bangladesh markets</span>
      <p>${esc(look.footer)}</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <!-- Read-aloud script: served from the static assets -->
  <script src="/read-aloud.js" defer></script>
  <script type="module" src="/app.js"></script>
  <script type="module">
    /* Lazy, and caught. Nothing about reading this piece depends on
       the thread loading, or on there being a database at all. */
    const host = document.getElementById("comments");
    if (host) {
      import("/comments.js")
        .then((m) => m.mountComments(host, {
          slug: host.dataset.slug,
          section: host.dataset.section,
        }))
        .catch(() => {});
    }
  </script>
</body>
</html>`;
}

export async function onRequest(context) {
  const slug = String(context.params.slug ?? "").replace(/\.html$/, "");
  /* Which mount the request came in on. worker.js passes it; a Pages
     deployment of this folder would only ever serve /insights/, and
     that is the right default for it. */
  const asked = LOOK[context.params.section] ? context.params.section : "insights";

  // Anything that isn't a plausible slug is not ours to answer.
  if (!/^[a-z0-9-]{1,80}$/i.test(slug)) return context.next();

  const d1 = await db(context.env);
  if (!d1) return context.next();

  const article = await one(d1,
    `SELECT * FROM articles WHERE slug = ? AND status = 'live'`, slug);
  if (!article) return context.next();      // static file, or a genuine 404

  /* A piece answers at its own section's mount and nowhere else.
     Without this, moving a piece from Insights to the kitchen would
     leave it live at both URLs, which is two pages of identical text
     competing with each other in search results, and a link someone
     already shared quietly becoming the wrong one. */
  if ((article.section || "insights") !== asked) return context.next();

  const origin = context.env.SITE_ORIGIN || new URL(context.request.url).origin;
  /* With the security headers, which a response built here does not
     get from aab/_headers: that file is read by the static asset
     server, and this is not a static asset. See _lib/headers.js. */
  return htmlResponse(render(article, origin), {
    // Fresh enough that an edit shows up quickly, cached enough
    // that a popular piece isn't rebuilt for every reader.
    cache: "public, max-age=60, stale-while-revalidate=600",
  });
}
