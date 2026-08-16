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
import { FONTS, LOOK } from "@reiad/shared/look";

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

    A page marks its own link with `aria-current="page"`. A page
    that sits INSIDE a section marks that section's link with
    `aria-current="true"` instead: the reader is in there, not on
    the page the link points at. Every Bangla reading section is
    reached through Skills, so a piece in the kitchen marks Skills
    that way. Both spellings are what the hand-written pages
    already carried, and `null` is for a page in the nav at all,
    like the account. */
export type Current =
  | "learn" | "skills" | "tools" | "insights" | "portfolio" | "about" | "contact"
  | "in-skills" | null;

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
      {/* Second, and the order is the whole of it. The first
          `@layer` statement a browser sees fixes the order of the
          layers, and `styles.css` declares all eighteen of them
          including `tw`. Swap these two links and Tailwind's own
          declaration wins instead, which puts its utilities above
          the article layer: see the note at the top of
          `aab/src/styles/tailwind.css` for why that must never
          happen. */}
      <link rel="stylesheet" href="/tailwind.css" />
      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="alternate" type="application/rss+xml"
            title="Reiad's Library, Insights" href="/feed.xml" />
    </head>
  );
}

export function SiteHeader({ current }: { current: Current }) {
  /* "page" for the page itself, "true" for a page inside the
     section that link points at. Written once rather than at each
     of the seven links. */
  const mark = (key: Current) => (current === key ? "page" : undefined);

  return (
    <header>
      <div className="wrap header-inner">
        {/* "/" rather than "/index.html" as of Stage 11.5: the home
            page answers there, and the old spelling is a 301. The
            schools' 251 generated pages still say the old one and
            take that hop until Stage 11.7 rewrites them. */}
        <a className="site-name" href="/">
          <svg className="site-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor" />
            <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor" />
            <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor" />
            <circle cx="63" cy="24" r="5.5" fill="currentColor" />
          </svg>
          Reiad&apos;s Library
        </a>
        <nav aria-label="Main">
          <a href="/learn/index.html" data-keep aria-current={mark("learn")}>Learn</a>
          <a href="/skills/index.html" data-nav-skills
             aria-current={current === "in-skills" ? "true" : mark("skills")}>Skills</a>
          <a href="/tools/index.html" aria-current={mark("tools")}>Tools</a>
          <a href="/insights.html" aria-current={mark("insights")}>Insights</a>
          <a href="/portfolio.html" aria-current={mark("portfolio")}>Portfolio</a>
          <a href="/about.html" aria-current={mark("about")}>About</a>
          <a href="/contact.html" data-keep aria-current={mark("contact")}>Contact</a>
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

export function SiteFooter({ note, name = "Reiad's Library" }: { note: string; name?: string }) {
  return (
    <footer>
      <div className="wrap">
        <span className="mono">{name} · Finance &amp; Bangladesh markets</span>
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
  lang = "en",
  bodyClass,
  skip = "Skip to the main content",
  skipTo = "#main",
  footer = LOOK.insights.footer,
  footerName,
  current = null,
  beforeMain, scripts, children,
}: {
  lang?: string;
  bodyClass?: string;
  skip?: string;
  /* Where the skip link goes. Most pages say #main and the case
     studies each point at the thing the page is actually for: the
     valuation, the stress test, the models. Their own choice, kept. */
  skipTo?: string;
  footer?: string;
  /* The desk signs its footer "Rony Reiad" rather than "Reiad's
     Library", which is its own and is kept. */
  footerName?: string;
  current?: Current;
  beforeMain?: ReactNode;
  scripts?: ReactNode;
  children: ReactNode;
}) {
  return (
    <html lang={lang}>
      <SiteHead />
      <body className={bodyClass || undefined}>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />

        <a className="skip" href={skipTo}>{skip}</a>
        {beforeMain}

        <SiteHeader current={current} />
        {children}
        <SiteFooter note={footer} name={footerName} />

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
