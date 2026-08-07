/* ============================================================
   /insights/<slug> — renders an article that lives in the
   database, and gets out of the way for one that doesn't.

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

const esc = (s) =>
  String(s ?? "").replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Serif+Bengali:wght@500;600&display=swap";

function render(article, origin) {
  const date = new Intl.DateTimeFormat(article.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${article.published_at || "2026-01-01"}T00:00:00Z`));

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.dek,
    datePublished: article.published_at,
    dateModified: article.updated_at,
    inLanguage: article.lang,
    author: { "@type": "Person", name: "Rony Reiad", url: `${origin}/about.html` },
    mainEntityOfPage: `${origin}/insights/${article.slug}.html`,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="${article.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${esc(article.title)} — Rony Reiad</title>
  <meta name="description" content="${esc(article.dek)}">
  <link rel="canonical" href="${origin}/insights/${article.slug}.html">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${esc(article.dek)}">
  <meta property="og:url" content="${origin}/insights/${article.slug}.html">
  <meta property="og:image" content="${origin}/og/insights.png">
  <meta name="twitter:card" content="summary_large_image">
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
  <link rel="alternate" type="application/rss+xml" title="Rony Reiad — Insights" href="/feed.xml">
  <meta name="theme-color" content="#0B3D2E">
  <script type="application/ld+json">${jsonLd}</script>
</head>
<body>
  <a class="skip" href="#main">Skip to the article</a>
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
        Rony Reiad
      </a>
      <nav aria-label="Main">
        <a href="/learn/index.html" data-keep>Learn</a>
        <a href="/tools/index.html">Tools</a>
        <a href="/insights.html" aria-current="page">Insights</a>
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
        <span>${article.minutes} min read</span>
      </p>

${article.body}

      <div class="note">
        This piece is general education, not investment advice. Rules, rates and
        fees change — confirm the current details with the relevant institution
        before acting on anything here.
      </div>

      <div class="prev-next">
        <a href="/insights.html">
          <span class="mono">All insights</span>
          <strong>Back to the index →</strong>
        </a>
        <a href="/learn/index.html">
          <span class="mono">শেখার লাইব্রেরি</span>
          <strong>Learn hub — বাংলায় →</strong>
        </a>
      </div>
    </article>
  </main>

  <footer>
    <div class="wrap">
      <span class="mono">Rony Reiad · Finance &amp; Bangladesh markets</span>
      <p>Everything on this site is general education, not investment advice.
         Do your own research before putting money anywhere.</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <script type="module" src="/app.js"></script>
</body>
</html>`;
}

export async function onRequest(context) {
  const slug = String(context.params.slug ?? "").replace(/\.html$/, "");

  // Anything that isn't a plausible slug is not ours to answer.
  if (!/^[a-z0-9-]{1,80}$/i.test(slug)) return context.next();

  const d1 = await db(context.env);
  if (!d1) return context.next();

  const article = await one(d1,
    `SELECT * FROM articles WHERE slug = ? AND status = 'live'`, slug);
  if (!article) return context.next();      // static file, or a genuine 404

  const origin = context.env.SITE_ORIGIN || new URL(context.request.url).origin;
  return new Response(render(article, origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Fresh enough that an edit shows up quickly, cached enough
      // that a popular piece isn't rebuilt for every reader.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
    },
  });
}
