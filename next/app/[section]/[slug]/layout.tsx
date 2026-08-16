/* ============================================================
   The root layout, which is also the article's layout.

   Every route this app serves is an article, so the topmost
   layout in the tree is this one, and it sits under both dynamic
   segments on purpose: `<html lang>` and the class on `<body>`
   are facts about the piece, and a layout only ever receives its
   own segment's params. A layout at `app/layout.tsx` would know
   neither.

   ---- the theme script ----

   It is the first thing inside `<body>` rather than in `<head>`,
   which is not where the Worker puts it. App Router owns the head
   and hoists only the tags it knows about; a blocking inline
   script is not one of them. First-child-of-body runs before the
   browser has painted anything, which is the property that
   matters: the point of the script is that a dark-mode reader
   never sees a white flash, not which element it is written in.
   ============================================================ */

import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { lookFor, FONTS } from "@reiad/shared/look";
import { getArticle } from "../../../lib/article";

const THEME_SCRIPT = `(function(){var s=localStorage.getItem("theme");`
  + `if(s==="dark"||s==="light"){document.documentElement.setAttribute("data-theme",s)}})()`;

export default async function ArticleLayout({
  children, params,
}: {
  children: ReactNode;
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;
  const article = await getArticle(section, slug);
  if (!article) notFound();

  const look = lookFor(article.section);

  return (
    <html lang={article.lang}>
      <head>
        {/* The stylesheet is the site's, whole and unchanged. That
            is the constraint at the top of Stage 9 and it does not
            stop being true because the renderer changed. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href={FONTS} rel="stylesheet" />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="alternate" type="application/rss+xml"
              title="Reiad's Library, Insights" href="/feed.xml" />
      </head>
      <body className={look.bodyClass || undefined}>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />

        <a className="skip" href="#main">{look.skip}</a>
        <div className="read-progress" aria-hidden="true" />

        <header>
          <div className="wrap header-inner">
            <a className="site-name" href="/index.html">
              <svg className="site-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
                <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor" />
                <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor" />
                <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor" />
                <circle cx="63" cy="24" r="5.5" fill="currentColor" />
              </svg>
              Reiad&apos;s Library
            </a>
            <nav aria-label="Main">
              <a href="/learn/index.html" data-keep>Learn</a>
              <a href="/skills/index.html" data-nav-skills
                 aria-current={article.section === "insights" ? undefined : "true"}>Skills</a>
              <a href="/tools/index.html">Tools</a>
              <a href="/insights.html"
                 aria-current={article.section === "insights" ? "page" : undefined}>Insights</a>
              <a href="/portfolio.html">Portfolio</a>
              <a href="/about.html">About</a>
              <a href="/contact.html" data-keep>Contact</a>
            </nav>
            <button className="icon-btn" id="open-menu" aria-label="Open the menu">
              <span className="burger" aria-hidden="true" />Menu
            </button>
            <button className="icon-btn" id="open-palette" aria-label="Search the site (Ctrl+K)">
              ⌕ <span className="kbd-hint">Ctrl K</span>
            </button>
            <button className="icon-btn" id="theme-toggle"
                    aria-label="Switch between light and dark mode">◐</button>
          </div>
        </header>

        {children}

        <footer>
          <div className="wrap">
            <span className="mono">Reiad&apos;s Library · Finance &amp; Bangladesh markets</span>
            <p>{look.footer}</p>
            <p style={{ marginTop: "10px" }}>
              <a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a>
            </p>
          </div>
        </footer>

        {/* The site's own scripts, at the paths every other page
            loads them from. Next's own runtime is loaded alongside
            them by the framework, which is a cost this stage
            measured and accepted rather than one it avoided: see
            the note at the top of page.tsx. */}
        <script src="/read-aloud.js" defer />
        <script type="module" src="/app.js" />
      </body>
    </html>
  );
}
