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
   libraries with two front doors, money at `/learn/` and
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
export function TopBar() {
  return (
    <div className="topbar">
      <DrawerButton />
      <AudienceSwitch />
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
