/* ============================================================
   shell.tsx: the page around the page.

   The head, the rail, the top bar and the footer, once. Every
   route renders them, and the head is where a second copy costs
   the most: a canonical link, an Open Graph tag or the webfont
   URL written twice drifts the day one of them is edited, which
   is the whole argument of `shared/look.ts` one level up.

   What is NOT in here is anything a route states about itself.
   The title, the description, the canonical link and the share
   card come out of each route's `generateMetadata`, because Next
   owns the head and hoists those tags itself. This file holds the
   furniture: the things every page of this site carries whatever
   is written on it.

   ---- the shape, and what changed ----

   Until August 2026 this was a header bar with seven links, an
   overlay menu built in JavaScript, and a three-line footer. The
   nav is a rail down the left now (`sidebar.tsx`), the bar at the
   top carries the audience switch and nothing else
   (`topbar.tsx`), and the footer spells the whole site out
   (`footer.tsx`). All three read one table, `lib/nav.ts`.

   Two elements are deliberately not `<header>` and `<footer>` as
   direct children of `<body>`: `styles.css` has rules for
   `body > header` and `body > footer` going back to the first
   version of this site, and a shell that half-matched them would
   be two designs fighting. The rail is an `<aside>`, the footer
   sits inside the scrolling column, and the old rules match
   nothing.
   ============================================================ */

import type { ReactNode } from "react";
import { FONTS, LOOK } from "@reiad/shared/look";
import { SiteScripts } from "./scripts";
import { Sidebar, DrawerBackdrop } from "./sidebar";
import { TopBar } from "./topbar";
import { SiteFooter } from "./footer";

/* Before the first paint, and therefore inline and blocking.

   Three preferences now, all stored by the site's own scripts and
   all affecting layout: the theme, or a dark-mode reader sees a
   white flash; the audience, which reorders the rail's groups for
   somebody who has said they are here for work rather than to
   learn; and whether the rail is folded away, which is a 190px
   change to the width of everything. A page that restores one and
   not the others shows the furniture rearranging itself after
   load, which is the same bug wearing three hats.

   It is the first thing inside <body> rather than in <head>,
   which is not where the Worker puts it. App Router owns the head
   and hoists only the tags it knows about; a blocking inline
   script is not one of them. First-child-of-body runs before the
   browser has painted anything, which is the property that
   matters. */
const BOOT = `(function(){var d=document.documentElement;try{`
  + `var t=localStorage.getItem("theme");`
  + `if(t==="dark"||t==="light")d.setAttribute("data-theme",t);`
  + `var a=localStorage.getItem("audience");`
  + `if(a==="learn"||a==="work")d.setAttribute("data-audience",a);`
  + `var r=localStorage.getItem("rail");`
  + `d.setAttribute("data-rail",r==="closed"?"closed":"open")}catch(e){`
  + `d.setAttribute("data-rail","open")}})()`;

/** Which nav item is marked as where you are.

    A page marks its own link with `aria-current="page"`. A page
    that sits INSIDE a section marks that section's link the same
    way: the rail is a list of places, and a lesson of the money
    school is in the money school. `null` is for a page the rail
    does not list, a case study or an article. */
export type Current =
  | "money" | "skills" | "tools" | "stock" | "insights" | "portfolio"
  | "about" | "contact" | "account" | "deutsch" | "quran" | "english"
  | "cooking" | "travel" | "home"
  /* Kept because four routes still pass it: a piece in the
     kitchen or on the travel desk is inside the skills half, and
     said so before the money school joined that list. */
  | "in-skills" | null;

export function SiteHead() {
  return (
    <head>
      {/* The stylesheet is the site's, whole and unchanged. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href={FONTS} rel="stylesheet" />
      <link rel="stylesheet" href="/styles.css" />
      {/* Second, and the order is the whole of it. The first
          `@layer` statement a browser sees fixes the order of the
          layers, and `styles.css` declares all twenty of them
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

/**
 * A whole page: <html>, the head, the rail, the top bar, what is
 * in the middle, the footer, and the site's own scripts.
 *
 * `scripts` is for the modules one kind of page needs and the
 * rest do not, `/pulse.js` on the Insights hub for instance.
 * `/app.js` is not one of them: the palette, the theme toggle and
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
  fixed = false,
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
  /** One page is not a scrolling column: the front door fills the
      viewport exactly and has no footer under it, because there is
      nothing under it to scroll to. Everything else is a page. */
  fixed?: boolean;
  beforeMain?: ReactNode;
  scripts?: ReactNode;
  children: ReactNode;
}) {
  /* `suppressHydrationWarning` on both, because the boot script
     below writes `data-theme`, `data-audience`, `data-rail` and,
     on the home page, `data-hl` onto the root before React sees
     any of it. Without this React treats an attribute it did not
     render as a mismatch and takes it off, which is a reader's
     theme being thrown away between the paint and the hydration. */
  return (
    <html lang={lang} suppressHydrationWarning>
      <SiteHead />
      <body className={[bodyClass, fixed ? "shell-fixed" : null].filter(Boolean).join(" ") || undefined}
            suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />

        <a className="skip" href={skipTo}>{skip}</a>

        <Sidebar current={current} />
        <DrawerBackdrop />

        <div className="shell-col">
          <TopBar />
          {beforeMain}
          {children}
          {fixed ? null : <SiteFooter note={footer} name={footerName} />}
        </div>

        {/* The site's own scripts, at the paths every other page
            loads them from, through `SiteScripts` rather than as
            `<script>` tags, and never as `<script>` tags again: a
            module that runs before React has hydrated has its work
            undone by the hydration. `components/scripts.tsx` is
            the whole story and is worth reading before adding
            one. */}
        {scripts}
        <SiteScripts srcs={["/app.js"]} />
      </body>
    </html>
  );
}

export { SiteFooter };
