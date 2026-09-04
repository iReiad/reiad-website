/* The trail across the top of a page, server-rendered from a trail the
   route hands it: a route knows where it is, what it is called and where
   it sits without guessing any of them.

   EVERY LEVEL, and the separator before a crumb is a BUTTON that opens
   what else is at that level, which makes the trail the fastest route
   sideways on the site. `menu` on a crumb is what turns its arrow into
   one, and `lib/crumbs.ts` fills it from the same `NAV` and
   `SCHOOL_STAGES` the rail and the tree read.

   NO CLIENT CODE: `popover="auto"` brings the top layer, light dismiss,
   Escape and the focus return, so none of the four is implemented here.
   This is chrome on 251 pages, and a trail that needs a bundle to open
   does not open until the bundle arrives. `[popover]` rather than
   `<details>` because the bar is a fixed pill with its own stacking
   context and `overflow`, which a details panel cannot escape.

   `aria-current="page"` marks where you are; the arrow is `aria-hidden`
   when it is only a separator and a labelled button when it is not.
   `.crumbs` is emitted here and nowhere else. */

import type { ReactNode } from "react";
import { Icon } from "../icons";

    /** The separator's art, in px. One number for every arrow in a trail,
        whichever crumb it precedes and whichever form it takes: the marks
        either side of a word have to be the same mark. */
const CHEVRON = 13;

/** One destination inside a crumb's menu. */
export interface CrumbLink {
  href: string;
  label: ReactNode;
  /** The short form, where a level has one: "Stufe 2", "ধাপ ৩". */
  kicker?: ReactNode;
  /** A number at the right edge: how many pages are inside. */
  count?: number;
  /** The one you are on, which is listed and not a link. */
  here?: boolean;
}

export interface Crumb {
  /** Absent for the page you are on, which is not a link. */
  href?: string;
  label: ReactNode;
      /** What else is at THIS level. Turns the arrow before this crumb
          into a button that opens them; absent or empty, it stays a
          separator. */
  menu?: CrumbLink[];
  /** What the button says it opens, for a screen reader. */
  menuLabel?: string;
      /** The level's own colour, so the German menu is German blue. One
          custom property does it: the stylesheet re-derives the soft, line
          and ring variants from `--accent`. */
  accent?: string;
}

    /** The arrow between two crumbs: a separator when there is nothing to
        open, `aria-hidden` because a chevron is not a word, and a real
        `<button>` with a real label when there is.

        THE MARK IS THE ICON SET'S CHEVRON, NOT A `›`. A glyph is
        positioned by the font it resolves out of and sized by the crumb
        beside it, and this row holds neither still: the trail's stack
        starts at Noto Sans Bengali, which has no `›`, and the crumb you
        are ON is a step larger, so `1.35em` is two box sizes. Measured on
        a phone the three marks sat 3.6px apart on marks 5px tall. An
        `<svg>` centred in a grid cell is centred, and the chevron's path
        is drawn about y=12 of a 24 box. */
function Step({ crumb, id }: { crumb: Crumb; id: string }) {
  const menu = crumb.menu ?? [];
  if (menu.length === 0) {
    return (
      <span className="crumb-sep" aria-hidden="true">
        <Icon name="chevron" size={CHEVRON} />
      </span>
    );
  }

  const label = crumb.menuLabel ?? "What else is here";

  return (
    <>
      <button className="crumb-sep crumb-step" type="button"
              popoverTarget={id}
              aria-label={label}>
        <Icon name="chevron" size={CHEVRON} />
      </button>
      <div className="crumb-menu" id={id} popover="auto"
           style={crumb.accent ? ({ "--accent": crumb.accent } as React.CSSProperties) : undefined}>
            {/* The same words the button carries, shown at one width only:
                on a laptop the panel grows out of the arrow, and below
                640px it is a sheet against the bottom edge with no such
                tie. `aria-hidden`, because the button already announces
                this exact string. */}
        <p className="crumb-menu-head mono" aria-hidden="true">{label}</p>
        <ul>
          {menu.map((to) => (
            <li key={to.href}>
              <a href={to.href} aria-current={to.here ? "page" : undefined}>
                <span className="crumb-menu-text">
                  {to.kicker ? <span className="crumb-menu-kicker mono">{to.kicker}</span> : null}
                  <span className="crumb-menu-label">{to.label}</span>
                </span>
                {typeof to.count === "number" && to.count > 0
                  ? <span className="crumb-menu-n mono">{to.count}</span>
                  : null}
                <span className="crumb-menu-go" aria-hidden="true">
                  <Icon name="chevron" size={13} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export function Crumbs({
  trail, label = "Breadcrumb", className, min = 2, id = "crumb", skip = 0,
}: {
  trail: Crumb[];
  /** "পথ" on a Bangla page. */
  label?: string;
  className?: string;
      /** How short a trail is still worth drawing. Two in a row of its
          own, where one crumb is the page's own name; one in the top bar,
          where the mark to its left is the home crumb. */
  min?: number;
      /** Prefix for the popover ids. Unique per row, because two rows on
          one page would both own `crumb-1` and the button would open the
          first one either way. */
  id?: string;
      /** How many crumbs the caller has already drawn; the bar draws the
          home crumb as the mark, so it passes 1.

          A prop rather than the caller slicing: an arrow belongs to the
          level in front of it, so a sliced array makes the first REMAINING
          crumb look like the first crumb and silently loses its menu. */
  skip?: number;
}) {
  if (trail.length < min) return null;
  const shown = trail.slice(skip);

  return (
    <nav className={["crumbs", className].filter(Boolean).join(" ")} aria-label={label}>
      <ol>
        {shown.map((c, i) => {
          const at = i + skip;
          const last = at === trail.length - 1;
          return (
            <li key={typeof c.href === "string" ? c.href : `here-${at}`}
                aria-current={last ? "page" : undefined}>
                  {/* Before the crumb rather than after it, because the
                      menu belongs to the level it precedes: the arrow in
                      front of "German" opens the other schools. A crumb the
                      caller skipped past still has one in front of it. */}
              {at > 0 ? <Step crumb={c} id={`${id}-${at}`} /> : null}
              {c.href && !last ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
