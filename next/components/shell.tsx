import "../styles/globals.css";

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

import type { CSSProperties, ReactNode } from "react";
import { FONTS, LOOK } from "@reiad/shared/look";
import { SiteScripts } from "./scripts";
import { Sidebar, DrawerBackdrop } from "./sidebar";
import { TopBar } from "./topbar";
import { NavTree } from "./nav-tree";
import { SiteFooter } from "./footer";
import { accentStyle } from "../lib/nav";
import { trailFor, trailJsonLd } from "../lib/crumbs";
import { siteOrigin } from "../lib/article";
import { Crumbs, type Crumb } from "./ui/crumbs";

/* Before the first paint, and therefore inline and blocking.

   Everything here is stored by the site's own scripts and every
   one of them affects layout: the theme, or a dark-mode reader
   sees a white flash; the audience, which reorders the rail's
   groups for somebody who has said they are here for work rather
   than to learn; whether the rail is folded away, which is a
   190px change to the width of everything; and, since accounts
   grew reading preferences, the type scale and the measure, which
   change the height of every paragraph on the page. A page that
   restores one and not the others shows the furniture
   rearranging itself after load, which is the same bug wearing
   five hats.

   The two custom properties are set rather than defaulted, and
   the defaults live in `styles.css` so a reader with no
   preference and a reader with JavaScript off get the same page.
   `aab/prefs.js` writes the same three values from the account
   page and applies them the same way; this is the copy that runs
   first and the only one that runs before a paint.

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
  + `d.setAttribute("data-rail",r==="closed"?"closed":"open");`
  + `var p=JSON.parse(localStorage.getItem("reader-prefs")||"{}")||{};`
  + `var s={small:"0.94",normal:"1",large:"1.12"}[p.text];`
  + `if(s)d.style.setProperty("--read-scale",s);`
  + `var m={narrow:"56ch",normal:"66ch",wide:"78ch"}[p.measure];`
  + `if(m)d.style.setProperty("--read-measure",m);`
  /* The glass. Three tables, and they are the ones in
     `aab/src/prefs.ts`: GLASSES, BLURS and VEILS. A surface that
     arrived flat and frosted a frame later would be worse than
     one that never blurred, so this cannot wait for a module. */
  + `d.setAttribute("data-glass",`
  + `{frost:1,paper:1,plain:1}[p.glass]?p.glass:"frost");`
  + `var b={soft:"0.55",normal:"1",deep:"1.7"}[p.blur];`
  + `if(b)d.style.setProperty("--glass-amount",b);`
  + `var v={clear:"0.54",normal:"0.72",dense:"0.9"}[p.veil];`
  + `if(v)d.style.setProperty("--glass-veil",v)}catch(e){`
  + `d.setAttribute("data-rail","open");d.setAttribute("data-glass","frost")}})()`;

/** Which nav item is marked as where you are.

    A page marks its own link with `aria-current="page"`. A page
    that sits INSIDE a section marks that section's link the same
    way: the rail is a list of places, and a lesson of the money
    school is in the money school. `null` is for a page the rail
    does not list, a case study or an article. */
export type Current =
  | "money" | "skills" | "tools" | "stock" | "live" | "insights" | "portfolio"
  | "about" | "contact" | "account" | "deutsch" | "quran" | "english"
  | "cooking" | "travel" | "home"
  /* Kept because four routes still pass it: a piece in the
     kitchen or on the travel desk is inside the skills half, and
     said so before the money school joined that list. */
  | "in-skills" | null;

export function SiteHead() {
  return (
    <head>
      {/* No stylesheet link. The stylesheet is imported at the top
          of this file, so Next compiles it, hashes it and puts the
          tag here itself.

          It was two `<link>` tags at `/styles.css` and
          `/tailwind.css`, which were files in `aab/` served by the
          other Worker, and the order between them was the whole of
          the cascade: the first `@layer` statement a browser sees
          fixes the order of the layers. That ordering is now two
          lines in `styles/globals.css`, which is a sequence rather
          than something to remember. */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link href={FONTS} rel="stylesheet" />
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
 * rest do not, `/tools/stock.js` on the stock check for instance.
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
  crumbs,
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
  /** The trail in the bar, for a page deeper than its section: a
      stage, a lesson, a case study. Left out, the section's own
      trail is built from `lib/nav.ts`, which is right for every
      page that IS a section. */
  crumbs?: Crumb[];
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
  const trail = crumbs ?? trailFor(current);
  const ld = trailJsonLd(trail, siteOrigin());

  return (
    <html
      lang={lang}
      /* The page wears the colour of its own icon in the rail.
         One custom property does it: `--accent-soft`,
         `--accent-line` and `--accent-ring` all derive from
         `--accent`, so the cards, chips, meters, rules and focus
         rings on a German page are blue without one of them
         naming blue.

         Inline rather than a stylesheet of `[data-section]` rules,
         so the table in `lib/nav.ts` stays the only place the
         mapping exists and there is nothing to regenerate.
         `data-section` is written too, for the few rules that
         need to know WHICH section rather than what colour. */
      data-section={current ?? undefined}
      /* Cast for the same reason `footer.tsx` casts: React's
         CSSProperties cannot express a custom property. */
      style={accentStyle(current) as CSSProperties | undefined}
      suppressHydrationWarning
    >
      <SiteHead />
      <body className={[bodyClass, fixed ? "shell-fixed" : null].filter(Boolean).join(" ") || undefined}
            suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />

        <a className="skip" href={skipTo}>{skip}</a>

        <Sidebar current={current} />
        <DrawerBackdrop />

        {/* The trail again, for a machine. It is what `crumbs.js`
            emitted beside the row it drew, and the one thing that
            file did which the row itself did not, so it moves here
            rather than being lost with it. `dangerouslySetInnerHTML`
            because React drops the children of a `<script>`, which
            for this one tag is the ordinary way. */}
        {ld ? (
          <script type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: ld }} />
        ) : null}

        <div className="shell-col">
          <TopBar
            tree={<NavTree current={current} />}
            bare={trail.length < 2}
            /* `slice(1)` because the mark to its left IS the home
               crumb, and a bar reading "Reiad's Library > Home >
               Skills" says the first thing twice. The home crumb
               stays in the trail rather than being left out of it,
               so that a route reading the same array for anything
               else gets a complete one. */
            crumbs={<Crumbs trail={trail.slice(1)}
                            label="পথ" className="crumbs-bar" min={1} />}
          />
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
