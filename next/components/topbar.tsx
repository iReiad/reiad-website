"use client";

/* ============================================================
   topbar.tsx: who is reading, and nothing else.

   The old header carried the whole nav, the menu button, the
   search button and the theme toggle, on one line, and ran out
   of room at seven links. The nav is down the left now, so the
   bar at the top has one job: the question the home page used to
   ask once and then never again.

   ---- two answers, and why it is not three ----

   `aab/audience.js` kept two things: an `audience` of "learn" or
   "work", and a `track` of "finance" or "skills" that refined
   the first. The track existed because the learning half was two
   libraries with two front doors, money at `/money/` and
   everything else at `/skills/`. It is one library now: the
   money school is an entry in the skills list like the other
   five. So the refinement has nothing left to refine, and the
   switch is the two answers it always really had.

   The stored `track` is cleared when either button is pressed,
   for the same reason the old module cleared it when somebody
   picked "work": a value nothing reads is a value that comes
   back to life the day something reads it again.

   ---- it writes an attribute, not state ----

   Same argument as the sidebar. `data-audience` on `<html>` is
   set before the first paint by the boot script and read by the
   stylesheet, which is what makes the reorder free of a flash.
   ============================================================ */

import type { ReactNode } from "react";
import { AUDIENCES } from "../lib/nav";
import { Icon } from "./icons";
import { DrawerButton } from "./sidebar";

const AUDIENCE_KEY = "audience";
const TRACK_KEY = "track";

function pick(value: "learn" | "work") {
  const root = document.documentElement;
  root.setAttribute("data-audience", value);
  try {
    localStorage.setItem(AUDIENCE_KEY, value);
    localStorage.removeItem(TRACK_KEY);
  } catch { /* private mode: the choice holds for this page */ }

  /* The home page decides which of its introductions to show from
     `data-hl`, before paint, and it is the one page where the
     switch has to move something other than an order. Setting it
     here means pressing the switch on the home page changes the
     home page, rather than changing the next one. */
  if (root.hasAttribute("data-hl")) root.setAttribute("data-hl", value);

  /* Said out loud as well, for the one component that answers
     the switch with different CONTENT rather than a different
     order: the featured card on the front page. An attribute is
     the right channel for CSS and the wrong one for React, which
     would have to poll it. */
  document.dispatchEvent(new CustomEvent("audience:pick", { detail: value }));
}

export function AudienceSwitch() {
  return (
    <div className="audience-switch" role="group" aria-label="What brings you here">
      <span className="audience-slider" aria-hidden="true" />
      {AUDIENCES.map((a) => (
        <button key={a.id} type="button" className="audience-opt" data-pick={a.id}
                onClick={() => pick(a.id)}>
          <span className="audience-label">{a.label}</span>
          <span className="audience-sub" lang="bn">{a.sub}</span>
        </button>
      ))}
    </div>
  );
}

/** The palette and the theme, as two icons at the right edge.

    Neither carries its behaviour: `initPalette()` and
    `initTheme()` in `/app.js` bind to these ids on every page of
    this site and have since long before this bar existed. A
    second implementation here would be a second answer to "what
    is the theme", which is the bug the boot script exists to
    avoid. */
/** The mark, for the one width where the rail is not on screen.

    A phone gets a burger, a switch and three icons and, until
    this existed, no indication of whose site it was: the rail
    carries the wordmark and the rail is a drawer below 900px. So
    the bar carries it there instead, and the stylesheet shows
    exactly one of the two at any width.

    It is the same artwork as `sidebar.tsx` draws, four rects and
    a circle, and it is written out twice rather than shared
    through a component because it is nine attributes and a
    component boundary would be the larger thing. If it grows a
    fifth shape, that is the moment to make it one. */
function BarMark() {
  return (
    <a className="topbar-mark" href="/" aria-label="Reiad's Library, home">
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor" />
        <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor" />
        <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor" />
        <circle cx="63" cy="24" r="5.5" fill="currentColor" />
      </svg>
      <span>Reiad&apos;s Library</span>
    </a>
  );
}

/* The whole site as a tree, in a panel off the bar. It is built
   and it is not in the bar: the trail is, because "where am I"
   is the question a reader arriving from a search result has and
   the tree answers "what else is there", which the rail already
   answers down the left of every page.

   Flip this to put it back. `<NavTree>` is still rendered by the
   shell and still passed in, so nothing else has to change, and
   nothing dead is shipped to 250 pages while it is off. */
const TREE_IN_BAR = false;

export function TopBar({ tree, crumbs }: { tree: ReactNode; crumbs: ReactNode }) {
  return (
    <div className="topbar">
      <DrawerButton />
      <BarMark />
      {/* The switch used to be here and is in the rail's foot
          now, where the question belongs: "what brings you here"
          is asked once and then never again, so it sits with the
          menu somebody opens when they are deciding rather than
          across the top of every page they read.

          The trail is here instead, rendered on the server and
          handed in as a slot because this file is a client
          component. The mark to its left is its first crumb: one
          line saying whose site this is and where in it you are,
          rather than a bar saying the first and a row under it
          saying the second. See `lib/crumbs.ts`. */}
      {crumbs}
      {TREE_IN_BAR ? tree : null}
      <div className="top-tools">
        <button className="top-btn" id="open-palette" type="button"
                aria-label="Search the site (Ctrl+K)">
          <Icon name="search" size={18} />
          <span className="kbd-hint mono">Ctrl K</span>
        </button>
        <button className="top-btn" id="theme-toggle" type="button"
                aria-label="Switch between light and dark mode">
          <Icon name="theme" size={18} />
        </button>
      </div>
    </div>
  );
}
