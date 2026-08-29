/* ============================================================
   ui/crumbs.tsx: the trail across the top of a page.

   Server-rendered, from a trail the route hands it.

   ---- what this replaces, and why it was wrong ----

   `archive/modules/crumbs.ts` built the same row in the browser, after
   hydration, by reading `location.pathname` and `document.title`
   and guessing. It had to guess three things and got one of them
   wrong on the course pages: where to mount, what the page is
   called, and where the page sits. A route knows all three
   without guessing, so the trail is a prop.

   ---- every level, and the arrow between them opens it ----

   The row said Home > Skills > German on a lesson of Stufe 3, so
   two of the four levels a reader had walked were missing and the
   only way back to the ladder was the rail. It says all of them
   now, and the separator before a crumb is a BUTTON: it opens
   what else is at that level, which is the other schools beside
   German and the other stages beside Stufe 3.

   That makes the trail the fastest route sideways on the site,
   which is the thing a breadcrumb is usually too polite to be.
   `menu` on a crumb is what turns its arrow into a button;
   `lib/crumbs.ts` fills it from the same `NAV` and
   `SCHOOL_STAGES` the rail and the tree read, so nothing here
   can drift from them.

   ---- no client code, on purpose ----

   `popover="auto"` brings the top layer, light dismiss, Escape
   and the focus return, so this implements none of the four and
   ships no JavaScript. That is the argument `nav-tree.tsx`
   already makes and it matters more here: this is chrome on 251
   pages, and a trail that needs a bundle to open is a trail that
   does not open until the bundle arrives.

   It is `[popover]` rather than `<details>` for one reason worth
   keeping: the bar is a fixed pill with its own stacking context
   and `overflow`, and a details panel cannot escape it. The top
   layer is above all of it by definition.

   ---- it is a nav, and the last crumb is not a link ----

   `aria-label` names it and `aria-current="page"` marks where you
   are. The arrow is `aria-hidden` when it is only a separator and
   a labelled button when it is not, so a screen reader reads the
   words and either a control or nothing between them.

   `.crumbs` is the stylesheet's and stays: this component emits
   it and nothing else does. It was also how `aab/src/courses.ts`
   reached in to rename the last crumb after its fetch, which is
   gone: that section renders its own trail through this
   component now, in `components/courses/trail.tsx`, so there is
   one piece of markup rather than one piece and a hand written
   over it.
   ============================================================ */

import type { ReactNode } from "react";
import { Icon } from "../icons";

/** The separator's art, in px. One number for every arrow in a
    trail, whichever crumb it precedes and whichever of the two
    forms it takes: the marks either side of a word have to be the
    same mark. `.crumb-sep` sizes the box it sits in. */
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
  /** What else is at THIS level. Turns the arrow before this
      crumb into a button that opens them. Absent, or empty, and
      the arrow stays a separator. */
  menu?: CrumbLink[];
  /** What the button says it opens, for a screen reader. */
  menuLabel?: string;
  /** The level's own colour, so the German menu is German blue.
      One custom property does it: `styles.css` re-derives the
      soft, line and ring variants from `--accent`. */
  accent?: string;
}

/** The arrow between two crumbs.

    A separator when there is nothing to open, and that case is
    `aria-hidden` because a chevron is not a word. A button when
    there is, and then it is a real `<button>` with a real label,
    because a control that only a mouse can find is not a
    control.

    THE MARK IS THE ICON SET'S CHEVRON, NOT A `›`. A glyph is
    positioned by the font it is resolved out of and sized by the
    crumb it sits beside, and this row has neither held still: the
    trail's font stack starts at Noto Sans Bengali, which has no
    `›` and hands it to a fallback, and the crumb you are ON is a
    step larger than the ones behind it, so `1.35em` was two box
    sizes. Measured on a phone the three marks in `/money`'s trail
    sat at -0.5px, +2.5px and +3.1px against the middle of the
    bar: a 3.6px spread on marks 5px tall, which is the row in the
    screenshot that started this. An `<svg>` centred in a grid
    cell is centred, and the chevron's own path is drawn about
    y=12 of a 24 box, so its ink is centred too. */
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
        {/* The same words the button carries, written out, and
            the stylesheet shows them at one width only. On a
            laptop the panel grows out of the arrow and the arrow
            is what says where it came from; below 640px it is a
            sheet against the bottom edge of the screen, which
            has no such tie to anything, so it says what it is.
            `aria-hidden`, because the button it belongs to
            already announces this exact string and a screen
            reader should hear it once. */}
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
  /** How short a trail is still worth drawing. Two in a row of
      its own, where one crumb is the page's own name and says
      nothing the heading under it does not. One in the top bar,
      where the mark to its left is the home crumb and the trail
      picks up after it. */
  min?: number;
  /** Prefix for the popover ids. Unique per row, because two
      rows on one page would otherwise both own `crumb-1` and the
      button would open the first one either way. */
  id?: string;
  /** How many crumbs the caller has already drawn. The bar draws
      the home crumb as the mark, so it passes 1.

      A prop rather than the caller slicing, and the difference is
      not cosmetic: an arrow belongs to the level in front of it,
      so a sliced array makes the first REMAINING crumb look like
      the first crumb and silently loses its menu. Skills lost the
      one listing every other section that way. */
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
              {/* Before the crumb rather than after it, because
                  the menu belongs to the level it precedes: the
                  arrow in front of "German" opens the other
                  schools. Only the very first crumb of the trail
                  has nothing in front of it; a crumb the caller
                  skipped past still does. */}
              {at > 0 ? <Step crumb={c} id={`${id}-${at}`} /> : null}
              {c.href && !last ? <a href={c.href}>{c.label}</a> : <span>{c.label}</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
