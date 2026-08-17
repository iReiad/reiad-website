"use client";

/* ============================================================
   sidebar.tsx: the menu, down the left, on every page.

   ---- what it replaces ----

   Three things, and they were three because they grew one at a
   time. A header nav that could hold seven links and had eleven
   places to go. A full-screen overlay menu built in JavaScript by
   `buildMenu()` in `aab/app.js`, which meant a reader with no
   JavaScript had no menu at all and a crawler saw none of it. And
   a hover panel under "Skills" that opened on a timer.

   One list, rendered on the server, in `lib/nav.ts`. It is in the
   HTML before anything runs, which is the whole difference: the
   menu is now a fact about the page rather than something built
   on top of it.

   ---- why this file is a client component and how little of it
        actually is ----

   The links, the labels, the groups and which one is current are
   all decided on the server and rendered once. Two things are
   the browser's: whether the rail is open, and whether the
   small-screen drawer is showing. Both are attributes on
   `<html>`, both are restored before the first paint by the boot
   script in `shell.tsx`, and both are written here.

   Reading them into React state is deliberately NOT how this
   works. The attribute is the state; the buttons toggle it and
   the stylesheet answers. State in React as well would be a
   second copy of a thing the document already knows, and it is
   the copy that arrives one paint late.
   ============================================================ */

import { useEffect } from "react";
import { NAV, ORDER, type NavGroup } from "../lib/nav";
import { Icon } from "./icons";
import { AudienceSwitch } from "./topbar";
import type { Current } from "./shell";

const RAIL_KEY = "rail";

const root = () => document.documentElement;

/** Open, or shut. Stored, because a reader who folds the menu
    away wants it folded away on the next page too. */
function toggleRail() {
  const open = root().getAttribute("data-rail") !== "closed";
  root().setAttribute("data-rail", open ? "closed" : "open");
  try { localStorage.setItem(RAIL_KEY, open ? "closed" : "open"); } catch { /* private mode */ }
}

/** The same menu on a phone, where there is no room for a rail.
    Not stored: a drawer that reopened itself on the next page
    would be covering the page it just navigated to. */
const setDrawer = (open: boolean) =>
  root().setAttribute("data-drawer", open ? "open" : "shut");

export function SidebarToggle() {
  return (
    <button className="rail-toggle" type="button" onClick={toggleRail}
            aria-label="Fold the menu away, or open it">
      <Icon name="chevron" size={18} />
      <span className="rail-toggle-word">Collapse</span>
    </button>
  );
}

export function DrawerButton() {
  return (
    <button className="top-btn drawer-btn" type="button" onClick={() => setDrawer(true)}
            aria-label="Open the menu">
      <Icon name="menu" />
    </button>
  );
}

/** The tap-anywhere-else half of the drawer, and the Escape key.
    Rendered always and inert until the drawer is open, which is
    one element rather than a listener that has to be added and
    removed. */
export function DrawerBackdrop() {
  /* And, since this is mounted on every page, the one thing the
     rail needs a script for: scrolling the item you are on into
     view. Eleven links and five headings fit a laptop and do not
     fit a short window, and the item most worth seeing is the one
     marked. `nearest` so it does nothing at all when the item is
     already visible, which is most of the time. */
  useEffect(() => {
    document.querySelector(".rail-item[aria-current='page']")
      ?.scrollIntoView({ block: "nearest" });
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && root().getAttribute("data-drawer") === "open") {
        setDrawer(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <button className="drawer-back" type="button" tabIndex={-1} aria-hidden="true"
            onClick={() => setDrawer(false)} />
  );
}

/* ---------- the rail itself, which is a server render ---------- */

function Item({ item, current }: { item: NavGroup["items"][number]; current: Current }) {
  const here = item.key && item.key === current;

  return (
    /* The item's own colour, where it has one, overriding the
       group's for everything inside it: the icon tile, the
       current-page mark and the hover ground all read
       `var(--accent)` and none of them names a colour. Six of the
       seven live here, on the six learning destinations, because
       those are the six a reader sees in one list. */
    <a className="rail-item" href={item.href}
       style={item.accent ? ({ "--accent": item.accent } as React.CSSProperties) : undefined}
       aria-current={here ? "page" : undefined}
       data-soon={item.soon ? "" : undefined}>
      <span className="rail-ico"><Icon name={item.icon} size={19} /></span>
      <span className="rail-text">
        <span className="rail-item-label">{item.label}</span>
        {item.sub ? <span className="rail-item-sub" lang="bn">{item.sub}</span> : null}
      </span>
    </a>
  );
}

/** `audience` decides the order of the groups and nothing else.
    It is read on the server from nothing, because the server does
    not know: the markup renders in the learner's order and the
    stylesheet reorders it from `[data-audience="work"]`, which the
    boot script sets before the first paint. Reordering in
    JavaScript after load is the version of this that visibly
    jumps. */
export function Sidebar({ current }: { current: Current }) {
  const groups = ORDER.learn
    .map((id) => NAV.find((g) => g.id === id))
    .filter(Boolean) as NavGroup[];

  return (
    <aside className="rail" id="rail" aria-label="Site menu">
      <div className="rail-head">
        <a className="rail-mark" href="/" aria-label="Reiad's Library, home">
          <svg className="rail-mark-art" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor" />
            <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor" />
            <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor" />
            <circle cx="63" cy="24" r="5.5" fill="currentColor" />
          </svg>
          <span className="rail-wordmark">
            <span className="rail-wordmark-name">Reiad&apos;s Library</span>
            <span className="rail-wordmark-sub mono">Finance &amp; Bangla</span>
          </span>
        </a>
        <DrawerClose />
      </div>

      <nav className="rail-nav" aria-label="Main">
        {groups.map((group) => (
          <div className="rail-group" key={group.id} data-group={group.id}
               style={{ "--accent": group.accent } as React.CSSProperties}>
            <span className="rail-label mono">{group.label}</span>
            {group.items.map((item) => (
              <Item key={item.href} item={item} current={current} />
            ))}
          </div>
        ))}
      </nav>

      {/* The fold, and the audience switch.

          The switch is in the top bar on a laptop and in here on
          a phone, and the stylesheet shows exactly one of the
          two. That is two instances of one component rather than
          two implementations of one idea: it holds no state,
          because the state is `data-audience` on the root, so
          both copies write the same attribute and read back the
          same answer from the same stylesheet. There is nothing
          for them to drift about.

          Why it moves at all: below 900px the bar has a burger,
          two labels of the switch and three icon buttons on a
          360px screen, and the switch is the widest of them and
          the least urgent. It is a question a reader answers once
          and never again, so it belongs in the menu, which is
          where somebody goes when they are deciding rather than
          reading. */}
      <div className="rail-foot">
        <div className="rail-audience">
          <span className="rail-label mono">What brings you here</span>
          <AudienceSwitch />
        </div>
        <SidebarToggle />
      </div>
    </aside>
  );
}

function DrawerClose() {
  return (
    <button className="drawer-close" type="button" onClick={() => setDrawer(false)}
            aria-label="Close the menu">
      <Icon name="close" size={18} />
    </button>
  );
}
