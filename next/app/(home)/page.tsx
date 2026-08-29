/* ============================================================
   The front door. The hallway is the board's.

   ---- this page held two menus, and that was the bug ----

   Under the door there was a hand-written deck of eleven tiles,
   and under THAT the board, which draws the schools and the tools
   out of `shared/nav.ts`. Counted off the built page, the two
   between them made 26 internal links to 17 places: seven
   destinations appeared in both, and `/money`, `/deutsch`,
   `/quran` and `/tools/live` appeared THREE times each, in two
   card languages, within two screens.

   The rule that settles which one loses is already in CLAUDE.md
   and is not about tidiness: a list of things that exist
   elsewhere is BUILT from the shared table, and the markup in
   the page is a fallback rather than the source. The board is
   built. The deck was a second copy kept by hand, and a second
   copy is right on the day it is written. It listed six of the
   site's schools and tools while the table held ten.

   ---- so what is left here is what the board cannot hold ----

   The featured card, and only that. It answers the audience
   switch rather than sitting in a catalogue, so it is not a
   widget and could not become one without `shared/widgets.ts`
   learning what an audience is.

   `/account` went with the rest deliberately, and it is the one
   removal worth defending: it is in the rail on every page of
   this site, in the top bar's own menu, and in the footer. A
   fourth link to it on the front page is exactly the "here is a
   link" card this change exists to remove.

   ---- what is still chosen for the reader ----

   - the headline and lede swap on `data-hl` (layout.tsx, before
     first paint);
   - the FEATURED card answers the audience switch
     (components/featured.tsx);
   - the whole board is the reader's own: what they are in the
     middle of, how far they are, and what is new, arranged the
     way they arranged it.

   ---- how this is styled, and where ----

   Layout is Tailwind utilities in this file, per the house rule
   that JSX gets utilities. What a tile IS (the accent rail, the
   wash, the chip and disc recipes, the lean from /tilt.js) stays
   `.gate-tile`/`.gt-*` in styles.css, because pseudo-elements,
   lang-driven type and a class /tilt.js selects on are exactly
   the three things the Tailwind table in CLAUDE.md keeps in the
   stylesheet.
   ============================================================ */

import type { Metadata } from "next";
import { FeaturedCard } from "../../components/featured";
import { Board } from "../../components/home/board";
import { Icon } from "../../components/icons";
import { pageMeta } from "../../lib/pageMeta";
import { COUNTS, DOOR } from "@reiad/shared/content";
import { bnNum } from "@reiad/shared/schools";

export const metadata: Metadata = pageMeta({
  path: "/",
  title: "Reiad's Library · বাংলায় টাকা, দক্ষতা আর কাজ",
  description: "বাংলাদেশের বাজার আর টাকার কথা সহজ বাংলায়, ছয়টা ফ্রি কোর্স, "
    + "পাঁচটা ক্যালকুলেটর, আর খুলে দেখার মতো আর্থিক মডেল।",
  ogTitle: "Reiad's Library",
  ogDescription: "বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়।",
  card: "home",
  locale: "bn_BD",
});


export default function HomePage() {
  return (
    <main id="main">
      <div className="mx-auto w-full max-w-[1240px]
        px-[clamp(16px,3vw,44px)] pt-[clamp(18px,3.4vw,44px)] pb-[clamp(28px,4vw,56px)]
        grid gap-[clamp(20px,3.2vw,40px)]">

        {/* ============ the door ============ */}
        <header className="grid gap-[clamp(10px,1.6vw,18px)]">
          <span className="gate-eyebrow mono">{DOOR.eyebrow}</span>

          {/* One <h1> per audience, all three server-rendered and
              chosen by `data-hl` before first paint. The copy is
              `DOOR` in shared/content.ts rather than written out
              here, because a sentence is DATA and data reaches the
              Android app with no release: this page and the app's
              front door now say the same words by construction. */}
          {Object.entries(DOOR.copy).map(([when, copy]) => {
            const [before, after] = copy.headline.split(copy.mark);
            return (
              <h1 className="gate-h1" data-when={when} key={when} lang={copy.lang}>
                {before}<em className="gate-mark">{copy.mark}</em>{after}
              </h1>
            );
          })}

          {Object.entries(DOOR.copy).map(([when, copy]) => (
            <p className="gate-lede" data-when={when} key={when} lang={copy.lang}>
              {copy.lede}
            </p>
          ))}

          <div className="flex flex-wrap items-center gap-y-2 gap-x-[clamp(20px,3vw,40px)] mt-0.5">
            <ul className="gate-facts">
              {DOOR.facts.map((f) => (
                <li key={f.en}>
                  <b data-count={f.count} lang="bn">{bnNum(COUNTS[f.count])}</b>
                  <span lang="bn">{f.label}</span>
                </li>
              ))}
            </ul>
            <p className="gate-hint mono max-sm:hidden">
              <Icon name="search" size={13} /> <kbd>Ctrl K</kbd>
              <span> anything on this site, by name</span>
            </p>
          </div>
        </header>

        {/* ============ the one thing chosen for you ============

            One card, and the section is a section rather than a
            `<div>` because it is still one of the page's parts:
            what the site would put in front of THIS reader. It
            answers the audience switch through an event rather
            than a prop, which is why it is a client component
            here and not a widget in the catalogue. */}
        <section aria-label="Chosen for you" className="gate-deck grid">
          <FeaturedCard />
        </section>

        {/* ---- the board ----

            The rest of the page, and it is the reader's rather
            than this file's: which widgets, in what order, at
            what width. `shared/widgets.ts` is the catalogue and
            the Android app draws the same board from the same
            list, which is what makes it the one place the
            schools and the tools are named.

            It draws its own head, so there is no wrapper here
            adding a second one: a board with no heading over it
            is a settings screen, and a board with two is a page
            that has not decided. */}
        <Board />
      </div>
    </main>
  );
}
