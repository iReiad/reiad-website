"use client";

/* ============================================================
   research/strip.tsx: the way from any room to any other.

   The diet tool's strip, applied to the studio's table. The same
   shape and the same classes (`.dt-tabs`, `.dt-tab`, the dot), so
   there is one strip on this site drawn twice rather than two
   strips; the day this is promoted to `ui/` the diet one comes
   with it. Links rather than tabs, because these are seventeen
   separate routes with their own addresses.
   ============================================================ */

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { toneVar } from "@reiad/shared/research";
import { RESEARCH_HOME, RESEARCH_PAGES, RESEARCH_TONE } from "../../lib/research-pages";
import { T } from "./lang";

export function ResearchStrip() {
  const path = usePathname();
  const bar = useRef<HTMLElement | null>(null);

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

  useEffect(() => {
    const here = bar.current?.querySelector<HTMLAnchorElement>('[aria-current="page"]');
    here?.scrollIntoView({ inline: "center", block: "nearest" });
  }, [path]);

  /* A room's children (`/library/<id>`) light the room. */
  const at = (href: string): boolean =>
    path === href || path === `${href}/` || (href !== RESEARCH_HOME && path.startsWith(`${href}/`));
  const onHome = at(RESEARCH_HOME);

  return (
    <nav
      className="dt-tabs topbar"
      ref={bar as React.RefObject<HTMLElement>}
      onKeyDown={onKey}
      aria-label="Research rooms / গবেষণার ঘর"
    >
      <Link
        href={RESEARCH_HOME}
        className="dt-tab"
        style={{ "--tone": toneVar(RESEARCH_TONE) } as React.CSSProperties}
        aria-current={onHome ? "page" : undefined}
        tabIndex={onHome ? 0 : -1}
      >
        <span className="dt-tab-dot" aria-hidden="true" />
        <T en="Board" bn="বোর্ড" />
      </Link>
      {RESEARCH_PAGES.map((p) => {
        const here = at(p.href);
        return (
          <Link
            key={p.href}
            href={p.href}
            className="dt-tab"
            style={{ "--tone": toneVar(p.tone) } as React.CSSProperties}
            aria-current={here ? "page" : undefined}
            tabIndex={here ? 0 : -1}
          >
            <span className="dt-tab-dot" aria-hidden="true" />
            <T en={p.tab.en} bn={p.tab.bn} />
          </Link>
        );
      })}
    </nav>
  );
}
