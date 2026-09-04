"use client";

/* Who is reading, and nothing else. The nav is down the left, so the bar
   at the top has one job: the question the home page used to ask once and
   then never again.

   TWO ANSWERS, not three. The `track` that refined `audience` existed
   because the learning half had two front doors; it is one library now,
   so the refinement has nothing left to refine. A stored `track` is
   cleared when either button is pressed: a value nothing reads is a value
   that comes back to life the day something reads it again.

   It writes an attribute, not state: `data-audience` on `<html>` is set
   before the first paint by the boot script and read by the stylesheet,
   which is what makes the reorder free of a flash. */

import type { ReactNode } from "react";
import { AUDIENCES } from "@reiad/shared/nav";
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
         `data-hl`, before paint, and it is the one page where the switch
         has to move something other than an order. Setting it here means
         pressing the switch changes the page you are on. */
  if (root.hasAttribute("data-hl")) root.setAttribute("data-hl", value);

      /* Said out loud as well, for the one component that answers the
         switch with different CONTENT rather than a different order. An
         attribute is the right channel for CSS and the wrong one for
         React, which would have to poll it. */
  document.dispatchEvent(new CustomEvent("audience:pick", { detail: value }));
}

    /** One drawing per audience, for the one place the words do not fit: a
        folded rail is 76px wide. Both icons are the money school's own,
        which is where every other icon in this shell comes from. */
const AUDIENCE_ICONS: Record<string, string> = { learn: "cap", work: "briefcase" };

export function AudienceSwitch() {
  return (
    <div className="audience-switch" role="group" aria-label="What brings you here">
      <span className="audience-slider" aria-hidden="true" />
      {AUDIENCES.map((a) => (
            /* The accessible name is on the button rather than left to its
               contents, because in the folded rail the contents are one
               icon and an icon is `aria-hidden`. Without it the two halves
               announce as "button, button". */
        <button key={a.id} type="button" className="audience-opt" data-pick={a.id}
                aria-label={a.label} onClick={() => pick(a.id)}>
          <span className="audience-ico" aria-hidden="true">
            <Icon name={AUDIENCE_ICONS[a.id] ?? "person"} size={18} />
          </span>
          <span className="audience-label">{a.label}</span>
          <span className="audience-sub" lang="bn">{a.sub}</span>
        </button>
      ))}
    </div>
  );
}

    /** The palette and the theme, as two icons at the right edge. Neither
        carries its behaviour: `initPalette()` and `initTheme()` in
        `/app.js` bind to these ids on every page. A second implementation
        here would be a second answer to "what is the theme". */
    /** The mark, for the one width where the rail is not on screen: the
        rail carries the wordmark and the rail is a drawer below 900px, so
        the bar carries it there and the stylesheet shows exactly one of
        the two at any width.

        The same artwork as `sidebar.tsx` draws, written out twice rather
        than shared, because it is nine attributes and a component boundary
        would be the larger thing. If it grows a fifth shape, that is the
        moment to make it one. It also stands in for the trail on the one
        page that has none. */
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

    /* The whole site as a tree, in a panel off the bar, built and not IN
       the bar: the trail is, because "where am I" is the question a reader
       arriving from a search result has and the rail already answers "what
       else is there".

       Flip this to put it back. `<NavTree>` is still rendered by the shell
       and still passed in, so nothing dead is shipped while it is off. */
const TREE_IN_BAR = false;

export function TopBar({ tree, crumbs, bare }: {
  tree: ReactNode;
  crumbs: ReactNode;
  /** No trail to show: the home page, and any page the nav table
      does not list that gave the shell no crumbs of its own. */
  bare?: boolean;
}) {
  return (
    <div className="topbar" data-trail={bare ? "none" : undefined}>
      <DrawerButton />
      <BarMark />
          {/* The switch is in the rail's foot, where the question belongs:
              "what brings you here" is asked once and then never again.

              The trail is here instead, rendered on the server and handed
              in as a slot because this file is a client component. The
              mark to its left is its first crumb. See `lib/crumbs.ts`. */}
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
