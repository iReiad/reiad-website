/* ============================================================
   ui/tabs.tsx: a strip of choices, and the two things a strip
   can be.

   There were three of these and no two matched. The account
   page's was twelve Tailwind arbitrary values written inline,
   naming `green` where every other component on this site names
   `--accent`, at `text-[0.82rem]`, which is not a size on the
   scale. The calculators' was `.tool-tab`, a two-line pill that
   was the best-looking of the three. The desk's was `.chip`.

   ---- two components, not one with a prop ----

   The same argument `deck.tsx` makes for `<GoCard>` and
   `<InfoCard>`. These two look identical and mean different
   things, and the difference is not decoration:

     <TabBar>  is `role="tablist"`. Choosing one HIDES the
               others, which is what the calculators do: five
               panels, one on screen. A screen reader is told
               there are five and which is showing.

     <PageNav> is a `<nav>`. Nothing is hidden: it is eight
               links to eight fragments of one long page, and a
               reader who lands on `#reading-list` from a link
               should find the page scrolled there with
               everything else still above and below it.

   Announcing the second as a tablist would be a lie a screen
   reader acts on: it would say "tab 3 of 8, selected" about a
   page that is showing all eight. One component with a
   `role` prop is how that lie gets made by accident, so there
   are two.

   ---- what a tab looks like ----

   `.tabs` and `.tab` in `@layer components`. A pill, the accent
   when it is the one you are on, and an optional Bangla line
   under the label, which the calculators have always had and the
   account page had nowhere to put.
   ============================================================ */

import type { ReactNode } from "react";

export function Tab({ href, label, sub, controls, current, id }: {
  href: string;
  label: ReactNode;
  /** The Bangla name, under the label. */
  sub?: ReactNode;
  /** Inside a `<TabBar>`: the id of the panel this one shows. */
  controls?: string;
  /** Inside a `<PageNav>`: the fragment the reader is at. */
  current?: boolean;
  id?: string;
}) {
  return (
    <a className="tab" href={href} id={id}
       role={controls ? "tab" : undefined}
       aria-controls={controls}
       aria-current={current ? "true" : undefined}>
      <span className="tab-en">{label}</span>
      {sub ? <span className="tab-bn bn-h">{sub}</span> : null}
    </a>
  );
}

/** Choices that swap what is on screen. `role="tablist"`.

    `aria-selected` is set by the browser module that does the
    swapping, never here: which panel is showing is decided after
    hydration, from the fragment, and a server that guessed would
    guess wrong for anybody arriving at a deep link. */
export function TabBar({ id, label, children }: {
  id?: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="tabs" id={id} role="tablist" aria-label={label}>
      {children}
    </div>
  );
}

/** Links down one long page. A `<nav>`, and nothing is hidden.

    `sticky` is the account page's: eight sections and a column
    of cards, so the strip stays under the bar as you scroll. It
    takes the glass treatment there rather than a flat fill,
    because a bar that content slides under is exactly the place
    a backdrop filter earns its cost. */
export function PageNav({ label, sticky, children }: {
  label: string;
  sticky?: boolean;
  children: ReactNode;
}) {
  return (
    <nav className="tabs tabs-nav" aria-label={label}
         data-sticky={sticky ? "" : undefined}>
      {children}
    </nav>
  );
}
