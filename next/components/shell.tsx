/* ============================================================
   shell.tsx: the page around the page.

   The head, the header and the footer, once. Four routes render
   them now, an article and the three reading hubs, and the head
   is the part where a second copy costs the most: a canonical
   link, an Open Graph tag or the webfont URL written twice drifts
   the day one of them is edited, which is the whole argument of
   `shared/look.js` one level up.

   What is NOT in here is anything a route states about itself.
   The title, the description, the canonical link and the share
   card come out of each route's `generateMetadata`, because Next
   owns the head and hoists those tags itself. This file holds the
   furniture: the things every page of this site carries whatever
   is written on it.
   ============================================================ */

import type { ReactNode } from "react";
import { FONTS } from "@reiad/shared/look";

/* Before the first paint, and therefore inline and blocking.

   Two preferences, both stored by the site's own scripts and both
   affecting layout: the theme, or a dark-mode reader sees a white
   flash; and the audience, which reorders the header's nav for
   somebody who has said they are here for work rather than to
   learn. A page that restores the first and not the second shows
   the nav jumping about after load, which is the same bug wearing
   a different hat.

   It is the first thing inside <body> rather than in <head>, which
   is not where the Worker puts it. App Router owns the head and
   hoists only the tags it knows about; a blocking inline script is
   not one of them. First-child-of-body runs before the browser has
   painted anything, which is the property that matters. */
const BOOT = `(function(){var d=document.documentElement;try{`
  + `var t=localStorage.getItem("theme");`
  + `if(t==="dark"||t==="light")d.setAttribute("data-theme",t);`
  + `var a=localStorage.getItem("audience");`
  + `if(a==="learn"||a==="work")d.setAttribute("data-audience",a)}catch(e){}})()`;

/** Which nav item is marked as where you are.

    "insights" marks the Insights link as the current page. Every
    Bangla reading section is reached through Skills, so those mark
    Skills instead, and with `aria-current="true"` rather than
    `"page"`: the reader is inside that section, not on the page the
    link points at. Both spellings are what the hand-written pages
    already carry. */
export type Current = "insights" | "skills";

export function SiteHead() {
  return (
    <head>
      {/* The stylesheet is the site's, whole and unchanged. That is
          the constraint at the top of Stage 9 and it does not stop
          being true because the renderer changed. */}
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
  );
}

export function SiteHeader({ current }: { current: Current }) {
  return (
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
             aria-current={current === "skills" ? "true" : undefined}>Skills</a>
          <a href="/tools/index.html">Tools</a>
          <a href="/insights.html"
             aria-current={current === "insights" ? "page" : undefined}>Insights</a>
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
  );
}

export function SiteFooter({ note }: { note: string }) {
  return (
    <footer>
      <div className="wrap">
        <span className="mono">Reiad&apos;s Library · Finance &amp; Bangladesh markets</span>
        <p>{note}</p>
        <p style={{ marginTop: "10px" }}>
          <a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a>
        </p>
      </div>
    </footer>
  );
}

/**
 * A whole page: <html>, the head, the header, what is in the
 * middle, the footer, and the site's own scripts.
 *
 * `scripts` is for the modules one kind of page needs and the rest
 * do not, `/pulse.js` on the Insights hub for instance. `/app.js`
 * is not one of them: the menu, the palette, the theme toggle and
 * the tilt are on every page of this site.
 */
export function SiteShell({
  lang, bodyClass, skip, footer, current, beforeMain, scripts, children,
}: {
  lang: string;
  bodyClass?: string;
  skip: string;
  footer: string;
  current: Current;
  beforeMain?: ReactNode;
  scripts?: ReactNode;
  children: ReactNode;
}) {
  return (
    <html lang={lang}>
      <SiteHead />
      <body className={bodyClass || undefined}>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />

        <a className="skip" href="#main">{skip}</a>
        {beforeMain}

        <SiteHeader current={current} />
        {children}
        <SiteFooter note={footer} />

        {/* The site's own scripts, at the paths every other page
            loads them from. Next's own runtime is loaded alongside
            them by the framework, which is a cost Stage 10 measured
            and accepted rather than one it avoided: see the note at
            the top of app/[section]/[slug]/page.tsx. */}
        {scripts}
        <script type="module" src="/app.js" />
      </body>
    </html>
  );
}
