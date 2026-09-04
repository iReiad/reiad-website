/* ============================================================
   The front door.

   ---- what it was, measured rather than felt ----

   4,747px on a laptop and 7,563px on a phone, for twelve distinct
   destinations. The board was 73 per cent of it, and the two
   bands inside the board that list the schools and the tools were
   61 per cent of the phone page: a second drawing of the rail,
   which is on screen already and has been since the reader
   arrived.

   And the first thing under the hero, for somebody who had never
   been here, was a section headed "আপনার বোর্ড · Your board" with
   an arrange button on it, and under that four rows reading ০টা
   পাঠ. A stranger was shown an empty dashboard of their own
   progress before they were shown a single thing this site has
   made.

   ---- what this page does instead ----

   It answers, in order, the three questions somebody arriving
   actually has: what is this, is it any good, and where do I
   start. Every band is one LEAD and a set behind it, so the page
   has a hierarchy rather than being six bands of equal weight
   stacked down a column.

     door      who this is, what is here, and two ways in
     work      seven case studies, each with its own chart
     library   six courses, the largest one drawn large
     writing   the newest pieces, out of the database
     tools     six things a reader can use today
     board     the reader's own, and only when they have one

   ---- the counts are counted ----

   Every figure in the ledger is a `data-count` slot filled from
   `COUNTS` in `shared/content.ts`, which derives each one from
   the data the site already holds. The numeral in the markup is
   the server's answer and the no-JavaScript fallback at once, so
   a course published tomorrow moves it with nobody editing this
   file. That is the rule at the top of CLAUDE.md, and the reason
   the front door said "six free courses" for a year while seven
   rows existed.

   ---- and it stays a prerendered file ----

   `/` is one of the routes Next renders at build time, and it was
   `force-dynamic` for an hour so that the writing band could read
   D1 on the server. What that cost was a Worker render and a
   query on every visit to the most-hit page on the site, for four
   card titles being inside the HTML rather than arriving a moment
   later, plus `next/interactive.test.ts`, which serves
   `.next/server/app/index.html` from disk and SKIPPED without
   saying anything: 217 checks covering every calculator here
   reported nothing at all.

   So the writing band fetches, and what it draws first is a real
   door to `/insights` rather than a skeleton. Everything else on
   this page is a compile-time constant out of `shared/`.
   ============================================================ */

import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Board } from "../../components/home/board";
import { LatestWriting } from "../../components/home/writing";
import { Reckoner } from "../../components/home/reckoner";
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
  /* No counts in the description. It said ছয়টা and পাঁচটা as
     number WORDS, which no slot can fill and no check can see, on
     the one sentence that is quoted into search results and into
     every pasted link. */
  description: "বাংলাদেশের বাজার আর টাকার কথা সহজ বাংলায়: ফ্রি কোর্স, "
    + "ক্যালকুলেটর, আর খুলে চালিয়ে দেখার মতো আর্থিক মডেল।",
  ogTitle: "Reiad's Library",
  ogDescription: "বাংলায় শেখা, আর যে কাজগুলো খুলে দেখা যায়।",
  card: "home",
  locale: "bn_BD",
});

/** The learning group, minus the hub itself and minus anything
    that is not written yet or not published.

    Out of `shared/nav.ts` for the reason the board's band was:
    a school added there appears in the rail, in the footer, on
    `/skills` and here at once. `soon` and `unlisted` are skipped
    because a card to a page that answers 403 is a promise the
    site cannot keep. */
const SCHOOLS = NAV.find((g) => g.id === "learn")?.items
  .filter((i) => !i.hub && !i.unlisted && !i.soon) ?? [];

/* The tools, and the calculators hub is one of them here.

   It carries `hub: true`, which is the flag the rail uses to draw
   the group's own head, and filtering on it took `/tools` off this
   band: the note under it promised calculators that had no card,
   and five cards with a two-wide lead is six cells in a four
   column grid, which is two holes. Six tools is two clean rows of
   three. */
/** The first lesson of the money ladder, for the invitation the
    board draws when a reader has no board yet.

    Computed here rather than in the board, which is a client
    component: `allLessons()` is the whole curriculum, and shipping
    it to a browser to read one URL would put a hundred kilobytes
    on the front page for a link. */
const FIRST_LESSON = allLessons().find((l) => l.status === "live")?.url;

/** How many lessons each ladder has, so the board's meters can
    say "20 / 81" rather than "20".

    Four integers, counted from the four curricula at build time
    and handed down. The meters read no ladder in the browser and
    must not: the reason they were a bare count was that reading
    four on the one page whose job is to be instant is not worth
    a denominator, and it is still not. Counting them here costs
    nothing, because `COUNTS` has already imported all four. */
const LADDER_TOTALS: Record<string, number> = {
  money: allLessons().filter((l) => l.status === "live").length,
  deutsch: allTeile().length,
  quran: allDars().length,
  english: allParts().length,
};

const TOOLBOX = NAV.find((g) => g.id === "make")?.items
  .filter((i) => !i.unlisted && !i.soon) ?? [];

/** A band wears its own section's colour, out of the one table
    that decides what colour anything is.

    Without this the whole page inherits `:root`'s green, so the
    seven case studies were green here and plum on `/portfolio`:
    one object, two colours, depending on which page you met it
    on. `accentFor` answers null for a key the table does not
    hold, and an undefined style is the page's own accent, which
    is the right fallback rather than a guess. */
function bandAccent(key: string): CSSProperties | undefined {
  const accent = accentFor(key);
  return accent ? { "--accent": accent } as CSSProperties : undefined;
}

export default function HomePage() {
  return (
    <main id="main" className="home-aura">
      <div className="home-wrap mx-auto w-full max-w-[1240px]
        px-[clamp(16px,3vw,44px)] pt-[clamp(18px,3.4vw,44px)] pb-[clamp(28px,4vw,56px)]
        grid gap-[clamp(34px,4.4vw,64px)]">

        {/* ============ the door ============

            Two columns from 1000px up: what this is on the left,
            what is here on the right. It was one column with the
            headline 490px wide inside a 1071px measure, so the
            right 581px of the first screen was empty on every
            laptop, on the one screen that decides whether
            anybody sees a second. */}
        <header className="door">
          <div className="door-say">
            <span className="gate-eyebrow mono" lang="en">{DOOR.eyebrow}</span>

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

            {/* THE SWITCH NOW MOVES A DOOR, not three sentences.
                It swapped the headline, the lede and one card;
                the card was the only thing on the page that took
                a reader anywhere, and it was two screens down.
                A pair of buttons per audience is server-rendered
                here and chosen by the same attribute, so the
                answer to "I am here to hire" is a button rather
                than a paragraph. */}
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

              What is actually here, counted. Five rows out of
              `COUNTS`, each one a way in, and the numeral is the
              slot rather than a number anybody typed.

              No ground and no edge on purpose: the hero already
              has a card's worth of weight in the headline, and a
              panel of glass beside it would be two things asking
              to be read first. Hairlines and type do the whole
              job, which also keeps this off the material's books
              rather than adding a seventh kind of surface for one
              list. */}
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
            {/* The keyboard hint carried `max-sm:hidden` and was on
                screen on every phone: `.gate-hint` sets
                `display: flex` in `@layer deck`, which is a LATER
                layer than `tw`, so the utility lost and nothing
                said so. A utility can only win where no later
                layer sets the same property, and `display` is set
                here. The media query is in the stylesheet now. */}
            <p className="gate-hint mono">
              <Icon name="search" size={13} /> <kbd>Ctrl K</kbd>
              <span>anything on this site, by name</span>
            </p>
          </div>
        </header>

        {/* ---- one line of the site's own arithmetic ----

            The one thing on this page a reader can USE, and it
            answers "is a site about money in Bangla worth my
            evening" better than any sentence could. Between the
            door and the library because it is the door's claim
            made concrete and the library's subject introduced:
            everything above it is who this is, everything below
            is what is here. */}
        <Reckoner />

        {/* ============ the library ============

            FIRST, AND IT WAS SECOND. The door speaks Bangla to
            anybody who has pressed nothing, and its primary button
            goes to `/skills`; under it was a band of seven English
            cards in CFA vocabulary. A reader who came for the
            Bangla had to scroll past the whole of somebody else's
            job advert to reach what the sentence above had just
            offered them. Somebody here to hire gets a door whose
            primary button IS the work, which is one press rather
            than one scroll.

            Every school wears its drawing. They are the site's
            best pictures and they are how a reader tells six
            schools apart at a glance; three columns rather than
            four, so six of them are two clean rows. */}
        <section aria-labelledby="learn-h">
          <div className="hub-section-head">
            <SectionLabel>
              শেখা · <span lang="en">The library</span>
            </SectionLabel>
            <h2 className="band-h" id="learn-h" lang="bn">যা যা শেখানো হয়</h2>
            {/* NOT "সব ডিভাইসে জমা থাকে", which is only true with
                an account and is read by a reader who has none.
                Ticks are kept in this browser; an account is what
                carries them between devices, and `/account` is
                where that is offered. */}
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

        {/* ============ the work ============

            The strongest evidence on this site was invisible from
            its front page: seven finished case studies, each one
            running its own arithmetic in the browser, all of them
            two clicks away behind a card that said "See the work".

            `next/lib/work.ts` is the one list, joined from `PAGES`,
            and `/portfolio` draws the same seven from it. This band
            is the compact density of the same card rather than a
            second card, which is the rule that made `<GoCard>` one
            component instead of three.

            IT WEARS THE PORTFOLIO'S ACCENT. A case study was green
            here and plum on `/portfolio`, which is one object with
            two colours depending on which page you met it on;
            `shared/nav.ts` decides what colour a thing is, and the
            band asks that table rather than inheriting the page's
            green. */}
        <section aria-labelledby="work-h" style={bandAccent("portfolio")}>
          <div className="hub-section-head">
            <SectionLabel>
              কাজ · <span lang="en">Selected work</span>
            </SectionLabel>
            <h2 className="band-h" id="work-h" lang="en">Models you can open and drive</h2>
            {/* No count in the sentence: the ledger a screen above
                states the same figure out of `COUNTS`, and a number
                said twice on one page is a number that will one day
                be said two ways. */}
            <p className="hub-section-note" lang="en">
              Interactive, all of them. The arithmetic runs in your browser as
              you read: nothing here is a picture of a spreadsheet.
            </p>
            {/* THE ONE BAND ON THIS PAGE THAT IS NOT IN THE
                READER'S LANGUAGE, and it says so in theirs. The
                work is written in English because that is who it
                is for; a Bangla reader arriving at a band of seven
                English cards with no explanation has been left to
                guess whether the site stopped being theirs. */}
            <p className="hub-section-note" lang="bn">
              এই অংশটা ইংরেজিতে, কারণ কাজগুলো ইংরেজিতেই করা।
              শেখার সবকিছু বাংলায়, উপরে।
            </p>
          </div>
          {/* ONE LEAD AND SIX. Seven equal cards in a three column
              grid is two rows and an orphan, and it is also seven
              things of equal weight where the second is built on
              top of the first. */}
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
          {/* Four, because the band is a row of four on a laptop
              and a column of four on a phone, and a fifth would be
              an orphan in both. */}
          <LatestWriting limit={4} />
        </section>

        {/* ============ the tools ============

            Every tool card had a picture, a name and NO
            description: `shared/nav.ts` carried a blurb for each
            school and an empty string for every tool, so a reader
            was shown six pictures and six names and told nothing
            about any of them. They have one each now, in Bangla,
            in the same table, which means the rail and the app get
            them too.

            AND NO PICTURES HERE. The library band above is six
            drawings, and six more directly under it is a page of
            wallpaper: a tool is a thing you go and use, so the
            icon and the sentence are what a reader needs. It is
            also what makes the two bands read as two bands. */}
        <section aria-labelledby="make-h" style={bandAccent("tools")}>
          <div className="hub-section-head">
            <SectionLabel>
              যন্ত্রপাতি · <span lang="en">The tools</span>
            </SectionLabel>
            <h2 className="band-h" id="make-h" lang="bn">যেগুলো দিয়ে হিসাবটা করা যায়</h2>
            {/* NOT "যা লেখেন তা আপনার কাছেই থাকে". The routine,
                the diet log and the Research Studio keep a
                reader's rows in an account, which is the opposite
                of that sentence, and the calculators are the ones
                it is true of. Say the thing that is true of all
                six instead. */}
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
            somebody who has never been here, which is what it
            should always have done: what a reader has read is not
            a fact the site has about a stranger, and a dashboard
            of noughts is worse than no dashboard. */}
        <Board start={FIRST_LESSON} totals={LADDER_TOTALS} />
      </div>
    </main>
  );
}
