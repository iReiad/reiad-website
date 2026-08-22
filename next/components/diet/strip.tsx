"use client";

/* ============================================================
   diet/strip.tsx: the way from any page of this tool to any
   other.

   There was none. Eleven routes, a deck on the front door, and
   from `/tools/diet/you` the only route to `/tools/diet/goal`
   was the browser's Back button. `DIET.md` section 29 calls for
   the account page's arrangement, and the account page's is
   `ui/tab-panels.tsx`, which is right for eight panels of ONE
   page and wrong here: these are eleven separate routes with
   their own metadata, their own data and their own addresses,
   and folding them into one page would take the addresses away.

   So it is the same SHAPE and not the same component: the pill,
   the glass, the roving tabindex, the arrow keys. What it is not
   is a `role="tablist"`, because these are links to other
   documents and calling a link a tab tells a screen reader a
   panel is about to change under it when a page is about to
   load instead.

   CLIENT, for one reason: `usePathname()`. Everything it renders
   is a link, so the payload it costs is the table and nothing
   else.
   ============================================================ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { DIET_HOME, DIET_PAGES, DIET_TONE } from "../../lib/diet-pages";
import { T, useToolLang } from "./lang";

export function DietStrip() {
  const path = usePathname();
  const lang = useToolLang();
  const bar = useRef<HTMLElement | null>(null);

  /* ONE TAB STOP, then the arrows. A strip of eleven links that
     each take a Tab press is eleven presses between the top of
     the page and its content, which is what a roving tabindex
     exists to prevent. Home and End because a strip long enough
     to want arrows is long enough to want its ends. */
  const onKey = useCallback((e: React.KeyboardEvent<HTMLElement>) => {
    const keys = ["ArrowLeft", "ArrowRight", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const links = [...(bar.current?.querySelectorAll<HTMLAnchorElement>("a") ?? [])];
    if (!links.length) return;
    const here = links.indexOf(document.activeElement as HTMLAnchorElement);
    const next = e.key === "Home" ? 0
      : e.key === "End" ? links.length - 1
        : e.key === "ArrowLeft"
          ? (here <= 0 ? links.length - 1 : here - 1)
          : (here < 0 || here === links.length - 1 ? 0 : here + 1);
    e.preventDefault();
    links[next].focus();
  }, []);

  /* THE TAB YOU ARE ON HAS TO BE ON SCREEN. The strip is wider
     than its column and scrolls, so from the twelfth page of
     fourteen a reader saw eleven grey tabs and no lit one, which
     reads as a strip that has lost track of where they are.

     `inline: "center"` rather than `"nearest"`, because nearest
     leaves the current tab flush against an edge where it looks
     like the end of the list. `block: "nearest"` so scrolling the
     strip does not scroll the page under a sticky bar, which is
     the bug the account page's tab strip was caught by. */
  useEffect(() => {
    const here = bar.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]');
    here?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [path]);

  /* A trailing slash is the same address. `bare()` in `worker.js`
     takes one off before the route table is consulted, so a
     reader who arrived at `/tools/diet/goal/` must still see
     Goal lit. */
  const at = (href: string): boolean =>
    path === href || path === `${href}/`;

  const onHome = at(DIET_HOME);

  return (
    <nav
      className="dt-tabs topbar"
      ref={bar as React.RefObject<HTMLElement>}
      onKeyDown={onKey}
      aria-label={lang === "bn" ? "খাদ্য ও ওজনের পাতাগুলো" : "Diet tool pages"}
    >
      <Link
        href={DIET_HOME}
        className="dt-tab"
        style={{ "--tone": DIET_TONE } as React.CSSProperties}
        aria-current={onHome ? "page" : undefined}
        tabIndex={onHome ? 0 : -1}
      >
        <span className="dt-tab-dot" aria-hidden="true" />
        <T en="Today" bn="আজ" />
      </Link>
      {DIET_PAGES.map((p) => {
        const here = at(p.href);
        return (
          <Link
            key={p.href}
            href={p.href}
            className="dt-tab"
            /* Its own colour, on every tab rather than only the
               current one: a strip where ten tabs are grey and
               one is coloured says which page you are on and
               nothing about where the others go. The dot carries
               it; the pill only fills on the current page. */
            style={{ "--tone": p.tone } as React.CSSProperties}
            aria-current={here ? "page" : undefined}
            /* Focus lands on the page you are on. Where that is
               the home entry, the first link takes it, so the
               strip is never a dead tab stop. */
            tabIndex={here || (onHome && false) ? 0 : -1}
          >
            <span className="dt-tab-dot" aria-hidden="true" />
            <T en={p.tab.en} bn={p.tab.bn} />
          </Link>
        );
      })}
    </nav>
  );
}
