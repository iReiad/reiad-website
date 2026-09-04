/* The front door. Every band is one LEAD and a set behind it, in the
   order somebody arriving asks: what is this, is it any good, where do I
   start.

     door      who this is, what is here, and two ways in
     work      seven case studies, each with its own chart
     library   six courses, the largest one drawn large
     writing   the newest pieces, out of the database
     tools     six things a reader can use today
     board     the reader's own, and only when they have one

   Every figure in the ledger is a `data-count` slot filled from `COUNTS`
   in `shared/content.ts`, so a course published tomorrow moves it with
   nobody editing this file.

   `/` MUST STAY A PRERENDERED FILE, never `force-dynamic`: that costs a
   Worker render and a query on every visit to the most-hit page, and it
   takes `next/interactive.test.ts` down silently, because that harness
   serves `.next/server/app/index.html` from disk and SKIPS without one.
   So the writing band fetches and draws a real door to `/insights`;
   everything else here is a compile-time constant out of `shared/`. */

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Board } from "../../components/home/board";
import { LatestWriting } from "../../components/home/writing";
import { Reckoner } from "../../components/home/reckoner";
import { Meadow } from "../../components/meadow";
import { GoCard } from "../../components/deck";
import { WorkCard } from "../../components/work-card";
import { Icon } from "../../components/icons";
import { ButtonLink } from "../../components/ui/button";
import { SectionLabel } from "../../components/ui/label";
import { pageMeta } from "../../lib/pageMeta";
import { STUDIES } from "../../lib/work";
import {
  COUNTS, DOOR, allDars, allLessons, allParts, allTeile,
} from "@reiad/shared/content";
import { NAV, accentFor } from "@reiad/shared/nav";
import { bnNum } from "@reiad/shared/schools";

export const metadata: Metadata = pageMeta({
  path: "/",
  title: "Reiad's Library · বাংলায় টাকা, দক্ষতা আর কাজ",
      /* No counts in the description: number WORDS fill no slot and no
         check can see them, on the one sentence quoted into search
         results and into every pasted link. */
  description: "বাংলাদেশের বাজার আর টাকার কথা সহজ বাংলায়: ফ্রি কোর্স, "
    + "ক্যালকুলেটর, আর খুলে চালিয়ে দেখার মতো আর্থিক মডেল।",
  ogTitle: "Reiad's Library",
  ogDescription: "বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়।",
  card: "home",
  locale: "bn_BD",
});

    /** The learning group, minus the hub itself and minus anything not
        written yet or not published. Out of `shared/nav.ts`, so a school
        added there appears in the rail, the footer, `/skills` and here at
        once. `soon` and `unlisted` are skipped because a card to a page
        that answers 403 is a promise the site cannot keep. */
const SCHOOLS = NAV.find((g) => g.id === "learn")?.items
  .filter((i) => !i.hub && !i.unlisted && !i.soon) ?? [];

    /** The first lesson of the money ladder, for the invitation the board
        draws when a reader has no board yet. Computed here rather than in
        the board, which is a client component: `allLessons()` is the whole
        curriculum, and shipping it to read one URL would put a hundred
        kilobytes on the front page for a link. */
const FIRST_LESSON = allLessons().find((l) => l.status === "live")?.url;

    /** How many lessons each ladder has, so the board's meters can say
        "২০ / ৮১" rather than "২০". Counted from the four curricula at
        build time and handed down: the meters read no ladder in the
        browser and must not, on the one page whose job is to be instant.
        The money school's is `COUNTS.lessons` rather than a second filter
        over the same rows. */
const LADDER_TOTALS: Record<string, number> = {
  money: COUNTS.lessons,
  deutsch: allTeile().length,
  quran: allDars().length,
  english: allParts().length,
};

    /* The tools, and the calculators hub is one of them here. It carries
       `hub: true`, the flag the rail uses to draw the group's own head,
       and filtering on it took `/tools` off this band: five cards is two
       holes in a three column grid, six is two clean rows. */
const TOOLBOX = NAV.find((g) => g.id === "make")?.items
  .filter((i) => !i.unlisted && !i.soon) ?? [];

    /** A band wears its own section's colour, out of the one table that
        decides what colour anything is. Without this the page inherits
        `:root`'s green and a case study is green here and plum on
        `/portfolio`. `accentFor` answers null for a key the table does not
        hold, and an undefined style is the page's own accent. */
function bandAccent(key: string): CSSProperties | undefined {
  const accent = accentFor(key);
  return accent ? { "--accent": accent } as CSSProperties : undefined;
}

export default function HomePage() {
  return (
    <main id="main" className="home-aura">
          {/* The ground this page stands in: `@layer meadow` is the whole
              drawing. Inside `.home-aura` on purpose, because that
              element's `isolation: isolate` is what makes a `z-index: -1`
              child paint behind the page's content instead of behind the
              page. It stands down under `html[data-weather]`. */}
      <Meadow />

      <div className="home-wrap mx-auto w-full max-w-[1240px]
        px-[clamp(16px,3vw,44px)] pt-[clamp(18px,3.4vw,44px)] pb-[clamp(28px,4vw,56px)]
        grid gap-[clamp(34px,4.4vw,64px)]">

            {/* ---- the door ----
                Two columns from 1000px up: what this is on the left, what
                is here on the right. One column left the right 581px of
                the first screen empty on every laptop. */}
        <header className="door">
          <div className="door-say">
                {/* THE NAME IS A LINK: a reader who wants to know who
                    wrote this presses the name, which is where they would
                    press anyway. */}
            <span className="gate-eyebrow mono" lang="en">
              <a href="/about">{DOOR.eyebrow}</a>
            </span>

                {/* One <h1> per audience, all three server-rendered and
                    chosen by `data-hl` before first paint. The copy is
                    `DOOR` in shared/content.ts, because a sentence is DATA
                    and data reaches the Android app with no release. */}
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

                {/* THE SWITCH MOVES A DOOR, not three sentences. A pair
                    of buttons per audience is server-rendered here and
                    chosen by the same attribute, so the answer to "I am
                    here to hire" is a button rather than a paragraph. */}
            {DOOR.ways.map((way) => (
              <div className="hero-actions" data-when={way.when} key={way.when}>
                <ButtonLink kind="solid" href={way.go.href} lang={way.go.lang}>
                  {way.go.label}
                </ButtonLink>
                <ButtonLink kind="ghost" href={way.also.href} lang={way.also.lang}>
                  {way.also.label}
                </ButtonLink>
              </div>
            ))}
          </div>

              {/* ---- the ledger ----
                  What is actually here, counted: five rows out of
                  `COUNTS`, each one a way in, the numeral a slot rather
                  than a number anybody typed.

                  No ground and no edge on purpose: the hero already has a
                  card's worth of weight, and a panel of glass beside it
                  would be two things asking to be read first. That also
                  keeps this off the material's books. */}
          <div className="door-ledger">
            <ul className="ledger">
              {DOOR.facts.map((row) => (
                <li key={row.count}>
                  <a href={row.href}>
                    <b data-count={row.count} lang="bn">{bnNum(COUNTS[row.count])}</b>
                    <span className="ledger-bn" lang="bn">{row.label}</span>
                    <span className="ledger-en mono">{row.en}</span>
                  </a>
                </li>
              ))}
            </ul>
                {/* The keyboard hint's `max-sm:hidden` lost silently:
                    `.gate-hint` sets `display: flex` in `@layer deck`,
                    which is a LATER layer than `tw`. A utility can only
                    win where no later layer sets the same property. The
                    media query is in the stylesheet. */}
            <p className="gate-hint mono">
              <Icon name="search" size={13} /> <kbd>Ctrl K</kbd>
              <span>anything on this site, by name</span>
            </p>
          </div>
        </header>

            {/* ---- one line of the site's own arithmetic ----
                The one thing on this page a reader can USE. Between the
                door and the library because it is the door's claim made
                concrete and the library's subject introduced. */}
        <Reckoner />

            {/* ---- the library ----
                First, because the door speaks Bangla to anybody who has
                pressed nothing and its primary button goes to `/skills`.
                Somebody here to hire gets a door whose primary button IS
                the work, which is one press rather than one scroll.

                Every school wears its drawing: they are how a reader tells
                six schools apart at a glance. Three columns, so six of
                them are two clean rows. */}
        <section aria-labelledby="learn-h">
          <div className="hub-section-head">
            <SectionLabel>
              শেখা · <span lang="en">The library</span>
            </SectionLabel>
            <h2 className="band-h" id="learn-h" lang="bn">যা যা শেখানো হয়</h2>
                {/* NOT "সব ডিভাইসে জমা থাকে", which is only true with an
                    account and is read by a reader who has none. Ticks are
                    kept in this browser; an account carries them between
                    devices, and `/account` is where that is offered. */}
            <p className="hub-section-note" lang="bn">
              সবগুলো ফ্রি, সবগুলো বাংলায়, একদম শুরু থেকে। কোন পাঠটা পড়া হয়েছে
              টিক দিয়ে রাখা যায়, অ্যাকাউন্ট ছাড়াই।
            </p>
          </div>
          <div className="deck learn-deck">
            {SCHOOLS.map((item) => (
              <GoCard
                key={item.href}
                href={item.href}
                art={item.art}
                icon={item.icon}
                accent={item.accent ?? "var(--green)"}
                chip={item.kind ? <span lang="bn">{item.kind}</span> : undefined}
                title={item.sub ?? item.label}
                lang={item.sub ? "bn" : undefined}
                dek={item.blurb}
                go="খুলুন"
              />
            ))}
          </div>
        </section>

            {/* ---- the work ----
                `next/lib/work.ts` is the one list, joined from `PAGES`,
                and `/portfolio` draws the same seven from it. This band is
                the compact density of the same card rather than a second
                card, which is the rule that made `<GoCard>` one component.

                IT WEARS THE PORTFOLIO'S ACCENT: `shared/nav.ts` decides
                what colour a thing is, so the band asks that table rather
                than inheriting the page's green. */}
        <section aria-labelledby="work-h" style={bandAccent("portfolio")}>
          <div className="hub-section-head">
            <SectionLabel>
              কাজ · <span lang="en">Selected work</span>
            </SectionLabel>
            <h2 className="band-h" id="work-h" lang="en">Models you can open and drive</h2>
                {/* No count in the sentence: the ledger a screen above
                    states the same figure out of `COUNTS`, and a number
                    said twice on one page is a number that will one day be
                    said two ways. */}
            <p className="hub-section-note" lang="en">
              Interactive, all of them. The arithmetic runs in your browser as
              you read: nothing here is a picture of a spreadsheet.
            </p>
                {/* THE ONE BAND NOT IN THE READER'S LANGUAGE, and it says
                    so in theirs: a Bangla reader arriving at seven English
                    cards with no explanation has been left to guess
                    whether the site stopped being theirs. */}
            <p className="hub-section-note" lang="bn">
              এই অংশটা ইংরেজিতে, কারণ কাজগুলো ইংরেজিতেই করা।
              শেখার সবকিছু বাংলায়, উপরে।
            </p>
          </div>
              {/* ONE LEAD AND SIX: seven equal cards in a three column
                  grid is two rows and an orphan, and seven things of equal
                  weight where the second is built on the first. */}
          <WorkCard study={STUDIES[0]} lead compact />
          <div className="deck work-deck">
            {STUDIES.slice(1).map((study) => (
              <WorkCard key={study.url} study={study} compact />
            ))}
          </div>
        </section>

        {/* ============ the writing ============ */}
        <section aria-labelledby="read-h">
          <div className="hub-section-head">
            <SectionLabel>
              নতুন লেখা · <span lang="en">Latest writing</span>
            </SectionLabel>
            <h2 className="band-h" id="read-h" lang="bn">সবচেয়ে নতুন যা লেখা হয়েছে</h2>
          </div>
              {/* Three, which is the row every other band here is, so the
                  page has one rhythm. A fourth lays out three and one. */}
          <LatestWriting limit={3} />
        </section>

            {/* ---- the tools ----
                Every tool carries a blurb in `shared/nav.ts` now, in
                Bangla, which means the rail and the app get them too.

                AND NO PICTURES HERE: the library band above is six
                drawings, and six more directly under it is a page of
                wallpaper. A tool is a thing you go and use, so the icon
                and the sentence are what a reader needs, and it is what
                makes the two bands read as two bands. */}
        <section aria-labelledby="make-h" style={bandAccent("tools")}>
          <div className="hub-section-head">
            <SectionLabel>
              যন্ত্রপাতি · <span lang="en">The tools</span>
            </SectionLabel>
            <h2 className="band-h" id="make-h" lang="bn">যেগুলো দিয়ে হিসাবটা করা যায়</h2>
                {/* NOT "যা লেখেন তা আপনার কাছেই থাকে": the routine, the
                    diet log and the Research Studio keep a reader's rows
                    in an account, which is the opposite. Say the thing
                    that is true of all six. */}
            <p className="hub-section-note" lang="bn">
              হিসাবটা আপনার ব্রাউজারেই চলে, কিছু ইনস্টল করতে হয় না। বেশিরভাগই
              অ্যাকাউন্ট ছাড়াই খোলা যায়।
            </p>
          </div>
          <div className="deck make-deck">
            {TOOLBOX.map((item) => (
              <GoCard
                key={item.href}
                href={item.href}
                icon={item.icon}
                accent={item.accent ?? "var(--gold)"}
                chip={<span lang="bn">যন্ত্র</span>}
                title={item.sub ?? item.label}
                lang={item.sub ? "bn" : undefined}
                dek={item.blurb}
                go="খুলুন"
              />
            ))}
          </div>
        </section>

            {/* ---- the board ----
                The reader's own, and last. It draws nothing at all for
                somebody who has never been here: what a reader has read is
                not a fact the site has about a stranger, and a dashboard
                of noughts is worse than no dashboard. */}
        <Board start={FIRST_LESSON} totals={LADDER_TOTALS} />
      </div>
    </main>
  );
}
