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

/* What changes about a rendered piece when it is not an Insights
   piece. This table is the twin of PAGE_STYLE in aab/studio.js:
   the Studio writes standalone files with the same five
   differences, and a piece published to the database renders the
   same page as one downloaded as a file. Change one, change both.

   `note` is the line at the foot. Insights carries a financial
   disclaimer because it is about money; a piece about onions
   carrying one would be comic. */
const LOOK = {
  insights: {
    mount: "/insights/",
    bodyClass: "",
    og: "/og/insights.png",
    minutes: (n) => `${n} min read`,
    skip: "Skip to the article",
    note: "This piece is general education, not investment advice. Rules, rates and "
      + "fees change: confirm the current details with the relevant institution "
      + "before acting on anything here.",
    back: { url: "/insights.html", kicker: "All insights", label: "Back to the index →" },
    side: { url: "/learn/index.html", kicker: "শেখার লাইব্রেরি", label: "Learn hub, বাংলায় →" },
    footer: "Everything on this site is general education, not investment advice. "
      + "Do your own research before putting money anywhere.",
  },
  cooking: {
    mount: "/cooking/",
    bodyClass: "cooking read",
    og: "/og/cooking.png",
    minutes: (n) => `${n} মিনিট পড়া`,
    skip: "মূল লেখায় যান",
    note: "রান্নাঘরের লেখাগুলো রেসিপি নয়, বোঝার জন্য। নিজের রান্নাঘর, নিজের চুলা আর নিজের "
      + "স্বাদ অনুযায়ী মাপ আর সময় একটু এদিক-ওদিক হবেই।",
    back: { url: "/cooking/index.html", kicker: "রান্নাঘর", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills/index.html", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    footer: "রান্নাঘরের লেখাগুলো বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া।",
  },
  travel: {
    mount: "/travel/",
    bodyClass: "travel read",
    og: "/og/travel.png",
    minutes: (n) => `${n} মিনিট পড়া`,
    skip: "মূল লেখায় যান",
    note: "এই লেখাটা সাধারণ তথ্য, আইনি পরামর্শ নয়। ভিসার নিয়ম আর ফি বদলায়, তাই আবেদনের "
      + "আগে অফিসিয়াল গাইডেন্স একবার দেখে নিন।",
    back: { url: "/travel/index.html", kicker: "ভ্রমণ", label: "সব লেখা এক জায়গায় →" },
    side: { url: "/skills/index.html", kicker: "দক্ষতা", label: "আর কী কী শেখানো হয় →" },
    footer: "ভ্রমণের লেখাগুলো বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া।",
  },
};

const lookFor = (section) => LOOK[section] ?? LOOK.insights;

/* What to say about the share image. Twinned with cardShape() in
   aab/studio.js.

   A social scraper is not a browser: it decides whether to show a
   card at all from these three tags, and several of them refuse a
   WebP outright. The Studio draws a JPEG at 1200x630 on publish for
   exactly that reason, and this describes whatever it stored, so a
   piece published before that existed still gets an honest tag
   rather than a confident wrong one. Dimensions are declared only
   for the two kinds of image known to be 1200x630: a section's own
   card, and one the Studio drew. */
const IMAGE_TYPES = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", avif: "image/avif", gif: "image/gif",
};

const cardShape = (url) => ({
  type: IMAGE_TYPES[String(url ?? "").split(".").pop().toLowerCase()] ?? "image/png",
  sized: /^\/og\/[a-z0-9-]+\.png$/.test(url ?? "")
    || /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(url ?? ""),
});

const esc = (s) =>
  String(s ?? "").replace(/[&<>\"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500&family=Noto+Seri[...]";

function render(article, origin) {
  const look = lookFor(article.section);
  const url = `${origin}${look.mount}${article.slug}.html`;
  /* Articles published before `cover` was added have an empty database
     column even when their body already contains a hosted photo. Recover
     the lead (or first) /media image here so a re-save is not required
     just to repair their social preview. The Studio stores this value on
     every new publish; this is the backwards-compatible bridge. */
  const lead = article.body?.match(
    /<figure\b[^>]*class="[^"]*\blead-photo\b[^"]*"[^>]*>[\s\S]*?<img\b[^>]*\bsrc="(\/media\/[A-Za-z0-9._/-]+)"/i
  )?.[1];
  const first = article.body?.match(/<img\b[^>]*\bsrc="(\/media\/[A-Za-z0-9._/-]+)"/i)?.[1];
  const cover = article.cover || lead || first || look.og;
  const shape = cardShape(cover);
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
    /* The piece's own address. This said /insights/ whatever the
       section was, which pointed a kitchen piece's structured data
       at a URL that answers 404. */
    mainEntityOfPage: url,
    image: `${origin}${cover}`,
  }).replace(/</g, "\\u003c");

  return `<!DOCTYPE html>
<html lang="${article.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${esc(article.title)}, Reiad's Library</title>
  <meta name="description" content="${esc(article.dek)}">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(article.title)}">
  <meta property="og:description" content="${esc(article.dek)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${origin}${cover}">${shape.sized ? `
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">` : ""}
  <meta property="og:image:type" content="${shape.type}">
  <meta property="og:site_name" content="Reiad's Library">
  <meta property="og:locale" content="${article.lang === "bn" ? "bn_BD" : "en_GB"}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:image" content="${origin}${cover}">
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
  return new Response(render(article, origin), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      // Fresh enough that an edit shows up quickly, cached enough
      // that a popular piece isn't rebuilt for every reader.
      "Cache-Control": "public, max-age=60, stale-while-revalidate=600",
    },
  });
}
