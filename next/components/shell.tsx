import "../styles/globals.css";

/* The page around the page: the head, the rail, the top bar and the
   footer, once. What is NOT here is anything a route states about itself:
   the title, description, canonical link and share card come out of each
   route's `generateMetadata`, because Next owns the head.

   The rail, the bar and the footer all read one table, `shared/nav.ts`.
   Two elements are deliberately not `<header>` and `<footer>` as direct
   children of `<body>`: the stylesheet has `body > header` and
   `body > footer` rules going back to the first version of this site, and
   a shell that half-matched them would be two designs fighting. */

import type { CSSProperties, ReactNode } from "react";
import { FONTS, LOOK } from "@reiad/shared/look";
import { SiteScripts } from "./scripts";
import { Glow } from "./glow";
import { Sound } from "./sound";
import { Weather } from "./weather";
import { Sidebar, DrawerBackdrop } from "./sidebar";
import { TopBar } from "./topbar";
import { NavTree } from "./nav-tree";
import { SiteFooter } from "./footer";
import { accentStyle, TOOL_KEYS } from "@reiad/shared/nav";
import { Used } from "./used";
import { OwnerMark } from "./work-alpha/owner-mark";
import { trailFor, trailJsonLd } from "../lib/crumbs";
import { siteOrigin } from "../lib/article";
import { Crumbs, type Crumb } from "./ui/crumbs";

    /* Before the first paint, and therefore inline and blocking. Every
       value here affects LAYOUT: the theme, or a dark-mode reader sees a
       white flash; the audience, which reorders the rail's groups; whether
       the rail is folded, which is 190px of width; and the type scale and
       the measure, which change the height of every paragraph. A page that
       restores one and not the others shows the furniture rearranging
       itself after load.

       The two custom properties are set rather than defaulted, and the
       defaults live in the stylesheet so a reader with no preference and a
       reader with JavaScript off get the same page. `aab/prefs.js` writes
       the same values; this is the copy that runs before a paint.

       First child of <body> rather than in <head>: App Router hoists only
       the tags it knows about and a blocking inline script is not one, and
       first-child-of-body runs before the browser has painted. */
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
  + `var m={narrow:"0.85",normal:"1",wide:"1.18"}[p.measure];`
  + `if(m)d.style.setProperty("--read-wide",m);`
      /* The glass. Three tables, the ones in `aab/src/prefs.ts`: GLASSES,
         BLURS and VEILS. A surface that arrived flat and frosted a frame
         later is worse than one that never blurred, so this cannot wait
         for a module.

         The finish list is written out a second time here and
         `scripts/check-glass.ts` stops the two drifting: it cannot be
         imported, and a finish missing from THIS copy is thrown away
         before the first paint while the panel goes on offering it. */
  + `d.setAttribute("data-glass",`
  + `{frost:1,paper:1,"thin-reed":1,"linear-ridge":1,"crossed-reed":1,`
  + `"deep-flute":1,aquatex:1,"arctic-ice":1,callisto:1,champagne:1,`
  + `eurodrop:1,plain:1}[p.glass]?p.glass:"frost");`
  + `var b={soft:"0.55",normal:"1",deep:"1.7"}[p.blur];`
  + `if(b)d.style.setProperty("--glass-amount",b);`
  + `var v={clear:"0.54",normal:"0.72",dense:"0.9"}[p.veil];`
  + `if(v)d.style.setProperty("--glass-veil",v);`
  + `var x={faint:"0.5",normal:"1",strong:"1.6"}[p.texture];`
  + `if(x)d.style.setProperty("--tex-strength",x);`
      /* WHETHER THE SITE MAKES A SOUND, as an attribute rather than a
         value the sound module digs out of storage on every press: the
         first press can come before any module has loaded, and a cue that
         fired once for somebody who turned sound off is the whole promise
         broken. */
  + `d.setAttribute("data-sound",p.sound==="off"?"off":"on");`
      /* WHICH LANGUAGE THE TOOLS SPEAK. `tool-lang` is the key the
         calculators have written since long before accounts, and
         `prefs.ts` writes the same one.

         It has to be an attribute set before the first paint because both
         languages are in the HTML and the stylesheet shows one. That is
         the only arrangement that survives hydration: a component picking
         a language in the browser renders one on the server and the other
         on the client, which is what blanked every calculator here. */
  + `var l=localStorage.getItem("tool-lang");`
  + `d.setAttribute("data-tool-lang",l==="bn"?"bn":"en");`
      /* WHETHER THIS READER IS THE OWNER, as the browser last heard it
         from /api/work-alpha (`components/work-alpha/owner.ts`). The
         rail draws the owner's entry from this attribute, so it has to
         be on the root before the first paint or the link arrives a
         paint late. A wrong "yes" costs nothing: the page it links
         answers 404. */
  + `if(localStorage.getItem("work-alpha-owner")==="yes")d.setAttribute("data-owner","yes");`
      /* THE SAME KEY, THE OTHER DEFAULT. A lesson is Bangla unless
         somebody has said English and a calculator is English unless
         somebody has said Bangla, so null means different things to the
         two. One key still, because a reader who has chosen has chosen
         once. */
  + `d.setAttribute("data-read-lang",l==="en"?"en":"bn")}catch(e){`
  + `d.setAttribute("data-rail","open");d.setAttribute("data-glass","frost");`
  + `d.setAttribute("data-tool-lang","en");d.setAttribute("data-read-lang","bn");`
  + `d.setAttribute("data-sound","on")}})()`;

    /** Which nav item is marked as where you are. A page marks its own
        link with `aria-current="page"`; a page INSIDE a section marks that
        section's link, because a lesson of the money school is in the
        money school. `null` is for a page the rail does not list. */
export type Current =
  | "money" | "skills" | "tools" | "stock" | "live" | "routine" | "diet" | "research"
  | "insights"
  | "portfolio"
  | "about" | "contact" | "account" | "deutsch" | "quran" | "english"
  | "cooking" | "travel" | "home" | "admin" | "work-alpha"
      /* Kept because four routes still pass it: a piece in the kitchen or
         on the travel desk is inside the skills half. */
  | "in-skills" | null;

export function SiteHead() {
  return (
    <head>
          {/* No stylesheet link: the stylesheet is imported at the top of
              this file, so Next compiles it, hashes it and puts the tag
              here itself. The cascade order that used to be the sequence
              of two `<link>` tags is two lines in `styles/globals.css`,
              because the first `@layer` statement a browser sees fixes the
              order of the layers. */}
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
     * A whole page: <html>, the head, the rail, the top bar, what is in
     * the middle, the footer, and the site's own scripts.
     *
     * `scripts` is for the modules one kind of page needs and the rest do
     * not. `/app.js` is not one of them: it is on every page.
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
  liveTrail,
  fixed = false,
  beforeMain, scripts, children,
}: {
  lang?: string;
  bodyClass?: string;
  skip?: string;
      /* Where the skip link goes. Most pages say #main and the case
         studies each point at the thing the page is for. */
  skipTo?: string;
  footer?: string;
  /* The desk signs its footer "Rony Reiad" rather than "Reiad's
     Library", which is its own and is kept. */
  footerName?: string;
  current?: Current;
      /** The trail in the bar, for a page deeper than its section. Left
          out, the section's own trail is built from `shared/nav.ts`, which
          is right for every page that IS a section. */
  crumbs?: Crumb[];
      /** A section that renders its OWN trail, in place of the row the bar
          draws from `crumbs`. One does: the course catalogue is
          admin-only, so a route there has no names to render and
          `check-courses.ts` refuses a value import of the catalogue into
          `next/`.

          `crumbs` is still passed and is still what the JSON-LD is built
          from: a machine-readable trail of what the server could not name
          is worse than a short one. */
  liveTrail?: ReactNode;
      /** One page is not a scrolling column: the front door fills the
          viewport exactly and has no footer under it. */
  fixed?: boolean;
  beforeMain?: ReactNode;
  scripts?: ReactNode;
  children: ReactNode;
}) {
      /* `suppressHydrationWarning` on both, because the boot script below
         writes `data-theme`, `data-audience`, `data-rail`, `data-read-lang`
         and, on the home page, `data-hl` on to the root before React sees
         any of it. Without this React treats an attribute it did not
         render as a mismatch and takes it off, which is a reader's theme
         thrown away between the paint and the hydration. */
  const trail = crumbs ?? trailFor(current);
  const ld = trailJsonLd(trail, siteOrigin());

  return (
    <html
      lang={lang}
          /* The page wears the colour of its own icon in the rail. One
             custom property does it: `--accent-soft`, `--accent-line` and
             `--accent-ring` all derive from `--accent`.

             Inline rather than a stylesheet of `[data-section]` rules, so
             the table in `shared/nav.ts` stays the only place the mapping
             exists. `data-section` is written too, for the few rules that
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

            {/* The trail again, for a machine. `dangerouslySetInnerHTML`
                because React drops the children of a `<script>`, which for
                this one tag is the ordinary way. */}
        {ld ? (
          <script type="application/ld+json"
                  dangerouslySetInnerHTML={{ __html: ld }} />
        ) : null}

        <div className="shell-col">
          <TopBar
            tree={<NavTree current={current} />}
            bare={trail.length < 2}
                /* `skip={1}` because the mark to its left IS the home
                   crumb. The whole trail goes in and the component draws
                   from the second, so the first crumb it DOES draw still
                   knows it has a level in front of it and keeps the arrow
                   that opens its siblings. Slicing here loses that. */
            crumbs={liveTrail ?? <Crumbs trail={trail} skip={1}
                            label="পথ" className="crumbs-bar" min={2} />}
          />
          {beforeMain}
          {children}
          {fixed ? null : <SiteFooter note={footer} name={footerName} />}
        </div>

            {/* The site's own scripts, through `SiteScripts` and never as
                `<script>` tags: a module that runs before React has
                hydrated has its work undone by the hydration.
                `components/scripts.tsx` is the whole story. */}
        {scripts}
        <SiteScripts srcs={["/app.js"]} />
            {/* The pointer's position, for `@layer glow`. A component
                rather than a served module because nothing outside this
                shell needed it and `aab/` is a closed set:
                `scripts/check-closed.ts`. */}
        <Glow />
        <Sound />
        <Weather />
            {/* WHEN A CALCULATOR WAS LAST OPENED, and nothing else: see
                `components/used.tsx`. Here because the shell already knows
                which rail key this page is, and `TOOL_KEYS` is derived
                from `shared/nav.ts`, so a sixth tool is recorded by being
                added to that table. */}
        {current && TOOL_KEYS.includes(current) ? <Used id={current} /> : null}
        <OwnerMark />
      </body>
    </html>
  );
}

export { SiteFooter };
