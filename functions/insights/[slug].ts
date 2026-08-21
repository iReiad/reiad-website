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

import { db, one } from "../_lib/db.ts";
import type { DbEnv } from "../_lib/db.ts";
import type { RouteContext } from "../_lib/http.ts";
/* The per-section table, the share-image rules and the head facts
   all live in shared/look/ now. They were written twice, here and
   in the Studio, under a comment asking whoever changed one to
   change the other; Stage 10 adds a third reader whose acceptance
   test is that it agrees with this one, and three copies cannot
   pass that.

   It is a package rather than another file under _lib/ because the
   Next.js route reads it too, and Turbopack will not resolve an
   import above its own root. See the note in next/next.config.ts. */
import { LOOK, dateLabel, headFacts, FONTS } from "../../shared/look.ts";
import type { Article } from "../../shared/look.ts";
import { htmlResponse } from "../../shared/headers.ts";

/** What this route binds. `SITE_ORIGIN` is what a canonical link
    and every og: tag are built from; without it the request's own
    origin is used, which is right for a preview and wrong for a
    shared link. */
interface ArticleRouteEnv extends DbEnv {
  SITE_ORIGIN?: string;
}

const ESCAPES: Record<string, string> =
  { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };

const esc = (s: unknown): string =>
  String(s ?? "").replace(/[&<>"]/g, (c) => ESCAPES[c]);

export function render(article: Article, origin: string): string {
  /* Every fact the head states, worked out once in shared/look.ts so
     that the Next.js route can state exactly the same ones. */
  const { look, url, image, sized, type, locale, title, jsonLd } =
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
  <!-- Both preferences, before the first paint, because both move
       the page: the theme, or a dark-mode reader gets a white
       flash, and the audience, which reorders the header's nav for
       somebody who has said they are here for work. Every
       hand-written page on this site restores both; a page
       rendered from the database restored only the first, so the
       nav reordered itself after load on exactly the pieces that
       came out of the Studio. -->
  <script>
    (function () {
      var root = document.documentElement;
      try {
        var theme = localStorage.getItem("theme");
        if (theme === "dark" || theme === "light") {
          root.setAttribute("data-theme", theme);
        }
        var audience = localStorage.getItem("audience");
        if (audience === "money" || audience === "work") {
          root.setAttribute("data-audience", audience);
        }
      } catch (e) {}
    })();
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="${FONTS}" rel="stylesheet">
  <!-- /fallback.css, not /styles.css: nothing has served the latter
       since the stylesheet became Next's and got a content hash, and
       a response a Worker builds cannot know that hash. This renderer
       only answers when the service binding is gone, which is exactly
       when an unstyled page is least welcome. -->
  <link rel="stylesheet" href="/fallback.css">
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
        <a href="/money" data-keep>Learn</a>
        <a href="/skills" data-nav-skills${
          look === LOOK.insights ? "" : ' aria-current="true"'}>Skills</a>
        <a href="/tools">Tools</a>
        <a href="/insights"${
          look === LOOK.insights ? ' aria-current="page"' : ""}>Insights</a>
        <a href="/portfolio">Portfolio</a>
        <a href="/about">About</a>
        <a href="/contact" data-keep>Contact</a>
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

    <!-- NO THREAD, and that is deliberate.

         The thread is next/components/comments.tsx as of #147, and
         this renderer cannot mount a React component. Keeping a
         second implementation of it here to serve this path would
         be exactly the copy CLAUDE.md refuses: two things that have
         to be changed together and only one of which anybody
         remembers.

         Dropping it costs almost nothing, because of what this
         renderer IS. It answers only when the service binding to
         the Next Worker is gone, which is break-glass, and a thread
         is the one thing on this page that has always been allowed
         to be absent: "a piece with a broken thread reads perfectly
         and has no thread" is the rule the module it used to load
         opened with. scripts/check-live.ts is what watches the
         binding. -->
  </main>

  <footer>
    <div class="wrap">
      <span class="mono">Reiad's Library · Finance &amp; Bangladesh markets</span>
      <p>${esc(look.footer)}</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <!-- NO READ-ALOUD CONTROL, for the reason the thread is absent
       above. It is next/components/read-aloud.tsx now and this
       renderer cannot mount a React component; /read-aloud.js is
       in archive/modules/, so a script tag here would fetch a 404
       on the one path that only answers when the service binding
       to the Next Worker is gone. -->
  <script type="module" src="/app.js"></script>
</body>
</html>`;
}

export async function onRequest(
  context: RouteContext<ArticleRouteEnv, { slug?: string; section?: string }>,
): Promise<Response> {
  const slug = String(context.params.slug ?? "").replace(/\.html$/, "");
  /* Which mount the request came in on. worker.js passes it; a Pages
     deployment of this folder would only ever serve /insights/, and
     that is the right default for it. */
  const section = context.params.section ?? "";
  const asked = LOOK[section] ? section : "insights";

  // Anything that isn't a plausible slug is not ours to answer.
  if (!/^[a-z0-9-]{1,80}$/i.test(slug)) return context.next();

  const d1 = await db(context.env);
  if (!d1) return context.next();

  const article = await one<Article>(d1,
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
     server, and this is not a static asset. See shared/headers.ts. */
  return htmlResponse(render(article, origin), {
    // Fresh enough that an edit shows up quickly, cached enough
    // that a popular piece isn't rebuilt for every reader.
    cache: "public, max-age=60, stale-while-revalidate=600",
  });
}
