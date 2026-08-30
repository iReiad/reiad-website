/* ============================================================
   /account

   The one page on this site that is about the reader rather than
   about the writing, and since August 2026 the one page that has
   to hold seven different kinds of thing without looking like a
   settings screen from a router's admin panel.

   ---- what changed ----

   It was a hero, three fieldsets and two exit buttons: a form,
   with the browser's own defaults showing through. Everything an
   account had grown since then was being added to the bottom of
   it, so the page said "your name" at the top and "everything you
   have ever saved" eight screens down, in the same visual weight,
   with no way to get between them but scrolling.

   It is a summary and eight sections now, with a rail of links
   across the top that is sticky and scrolls sideways on a phone.
   The account menu in the header links straight into those
   sections by their fragment, which is why every `id` here is a
   word rather than a number: `#reading-list` is in
   `aab/signin.js` as well and the two have to agree.

   ---- the first component converted to Tailwind ----

   archive/TRANSITION.md Stage 14 set the arrangement up and left
   it unused on purpose, so that the first conversion would be a
   change to one component rather than a change to how the site is
   styled. This is that component, and the reason it is this one
   is that the markup below is almost entirely layout: sections, a
   rail, cards, a grid of tiles. Utilities are good at exactly
   that, and `@theme` in `next/styles/tailwind.css` now carries
   the site's real tokens, so `bg-panel` and `border-hairline`
   mean what `var(--panel)` and `var(--hairline)` mean in both
   themes.

   WHAT DELIBERATELY DID NOT CONVERT, and it is worth saying
   because "half of it is Tailwind" looks like an unfinished job
   rather than a decision. Three things stayed in `styles.css`:

     the account menu   it is a `popover`, and its placement is
                        `@starting-style`, `::backdrop`,
                        `:popover-open` and CSS anchor
                        positioning inside an `@supports`. None
                        of those has a utility, so converting it
                        means a line of arbitrary values that is
                        longer and less readable than the rule it
                        replaced.
     the year grid      53 columns sized in a custom property,
                        which is one CSS rule and would be one
                        arbitrary value per axis.
     anything an        the `tw` layer sits BELOW `article` on
     article carries    purpose and permanently: an article's body
                        is HTML in a database that Tailwind's
                        compiler cannot see. The note at the top
                        of `next/styles/tailwind.css` is the
                        long version.

   The class names that remain are hooks rather than styling, and
   there are fewer of them than the conversion started with.
   `ladder-list`, `kept-list`, `targets` and `saved-list` are the
   containers `aab/src/account-page.ts` fills, and the rows it builds
   inside them are named classes styled in `styles.css`: a class
   name inside a `createElement` call is one Tailwind's scanner
   finds only because `aab/*.js` is in its source list, which
   makes it work and does not make it readable. JSX gets
   utilities; DOM built in a loop gets a class.

   Nothing here carries a class that exists only to be selected. A
   section is addressed by its `id`, which it needs anyway for the
   menu's fragments, and the rail is a labelled `<nav>`, which is
   what `next/account.test.ts` asks for.

   ---- and it is still filled entirely by a script ----

   `/account-page.js`, from Supabase. None of it can be rendered
   on the server and none of it should be: a page that knew who
   you were before it reached you would be a page this site cached
   wrong. What the server renders is the shape, so the page does
   not reflow as each section answers.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../lib/pageMeta";
import { TabPanels, type Panel } from "../../../components/ui/tab-panels";
import { Eyebrow } from "../../../components/ui/label";
import { Button, ButtonLink } from "../../../components/ui/button";
import { Preferences } from "../../../components/account/prefs";
import { Scenarios } from "../../../components/account/saved";
import { ReadingList, Notes } from "../../../components/account/library";
import { Paths } from "../../../components/account/paths";
import { Targets } from "../../../components/account/targets";
import { RoutineAccount } from "../../../components/routine/account";
import { Tiles, Week, Year } from "../../../components/account/year";
import { Kept } from "../../../components/account/kept";
import { HeldHere } from "../../../components/account/held";
import { Settings } from "../../../components/account/settings";
import { SCHOOL_LADDERS } from "../../../lib/school-ladders";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/account",
    title: "Your account · Reiad's Library",
    description: "Your account: what you have read, kept, written and set.",
    ogTitle: "Your account",
    card: "insights",
  }),
  robots: { index: false, follow: false },
};

/* ---------- the two shapes this page repeats ----------

   A section and a card, written as components rather than as a
   class name each, because that is what a utility framework gives
   you instead of a class: the place the decision lives moves from
   the stylesheet to here, and it is still one place.

   There were four. `FORM` and `Actions` went with the two forms
   that used them: both are components under
   `components/account/` now and each carries its own layout,
   which is shorter than the `[&_fieldset]:` selectors that had to
   reach into markup a script was building. */

function Section({ id, title, blurb, children }: {
  id: string;
  title: string;
  blurb: string;
  children: React.ReactNode;
}) {
  return (
    /* `scroll-margin-top` so a link from the account menu lands
       with the heading under the sticky rail rather than behind
       it, and `:target` marks which of eight sections the page
       just jumped to: the rail is at the top and the eye is
       here. */
    <section id={id}
             className="grid content-start gap-3.5
                        scroll-mt-[calc(var(--top-space)+58px)]
                        target:[&>div:first-child]:-ms-3.5
                        target:[&>div:first-child]:border-s-2
                        target:[&>div:first-child]:border-green
                        target:[&>div:first-child]:ps-3">
      <div className="grid gap-1">
        {/* A short green stroke over every section head: the same
            rhythm device the section rail's active chip uses, so
            eight sections read as one page rather than as eight
            features that arrived separately. */}
        <span className="mb-1 h-[3px] w-7 rounded-full bg-green/70" aria-hidden="true" />
        <h2 className="m-0 font-read text-[clamp(1.2rem,3.4vw,1.5rem)]">{title}</h2>
        <p className="m-0 max-w-[var(--measure)] text-t5 text-ink-soft">{blurb}</p>
      </div>
      {children}
    </section>
  );
}

/** One card, used by every section, so the page reads as one
    thing rather than as six features that arrived separately.
    `container` is named so the rules inside can ask how wide THIS
    is: it sits beside a 268px rail on a laptop and full-width on
    a phone, and a media query would answer a question nobody
    asked. */
function Card({ id, className = "", children }: {
  id?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div id={id}
         className={`@container/acct grid content-start gap-2.5 rounded-card
                     border border-hairline bg-panel shadow-card
                     p-[clamp(14px,3vw,20px)]
                     [&>h3]:m-0 [&>h3]:font-read [&>h3]:text-t6
                     [&>p]:m-0 [&>p]:text-t4 [&>p]:text-ink-soft
                     [&>.btn]:justify-self-start ${className}`}>
      {children}
    </div>
  );
}

/* The eight sections, in the order they are offered.

   ONE TABLE, and it was two: a `SECTIONS` list of ids and labels
   for the rail, and the `<Section>`s underneath it, which
   agreed because somebody remembered. That is the failure at the
   top of `CLAUDE.md`, and the rail is exactly where this site has
   already been bitten by it once.

   The `id` is the fragment. The account menu in
   `aab/src/signin.ts` links straight to `#reading-list` and
   `#data`, so these strings are shared with that file and are not
   free to change. */
const PANELS: Panel[] = [
    {
      id: "you",
      label: "Overview",
      node: (
        <Section id="you" title="Your year"
                 blurb="Every day you opened something here. Nothing else is counted, and none of it is shown to anybody but you.">
          <Card>
            {/* The grid itself stays a stylesheet rule: 53
                columns sized by a custom property is one line of
                CSS and would be one arbitrary value per axis. */}
            <div className="heat"><Year /></div>
            <p id="account-week" className="m-0 text-[0.82rem] text-ink-soft">
              <Week />
            </p>
          </Card>
        </Section>
      ),
    },
    {
      id: "ladders",
      label: "Courses",
      /* ============ THE LADDERS ============ */
      node: (
        <Section id="ladders" title="Where you are"
                 blurb="Your position in each course, the chapters you have finished and the checkpoints you have ticked inside them. This is the account's copy, so it is the same on every device.">
          {/* The ladder comes down from here, out of the
              generated snapshot, and the ticks are read in the
              browser. That split is the rule
              `next/lib/progress.ts` states, and this section
              broke it until 18 August 2026: it imported all
              four schools' `curriculum.js` at run time to find
              out what a bar's denominator was. */}
          <div className="ladder-list"><Paths ladders={SCHOOL_LADDERS} /></div>
          <p className="m-0 text-[0.82rem] text-ink-soft" id="account-synced" />
        </Section>
      ),
    },
    {
      id: "reading-list",
      label: "Reading list",
      /* ============ KEPT, AND WRITTEN ON ============ */
      node: (
        <Section id="reading-list" title="Reading list"
                 blurb="Pages you kept for later. Save one from the row under its title, on any piece or lesson.">
          <div className="kept-list" id="account-kept-list"><ReadingList /></div>
        </Section>
      ),
    },
    {
      id: "notes",
      label: "Notes",
      node: (
        <Section id="notes" title="Your notes"
                 blurb="What you wrote in the margin. Private, stored against your account, and shown to nobody, including me.">
          <div className="kept-list" id="account-notes"><Notes /></div>
        </Section>
      ),
    },
    {
      id: "targets",
      label: "Targets",
      /* ============ TARGETS ============ */
      node: (
        <Section id="targets" title="What you are aiming for"
                 blurb="Set a target and this page measures it. Nothing is sent to you about it: there are no notifications on this site and there will not be any.">
          <Targets ladders={SCHOOL_LADDERS} />
        </Section>
      ),
    },
    {
      id: "routine",
      label: "Routine",
      /* ============ ROUTINE ============ */
      node: (
        <Section id="routine" title="Your routine"
                 blurb="A day of your own: what you do, when, and what you have kept. It is set up here and read on its own page under Tools.">
          <RoutineAccount />
        </Section>
      ),
    },
    {
      id: "scenarios",
      label: "Scenarios",
      /* ============ SAVED SCENARIOS ============ */
      node: (
        <Section id="scenarios" title="Saved scenarios"
                 blurb="A filled-in calculator, kept under a name. Open one and the tool comes back exactly as you left it.">
          <div className="saved-list" id="account-scenarios">
            <Scenarios />
          </div>
        </Section>
      ),
    },
    {
      id: "preferences",
      label: "Preferences",
      /* ============ PREFERENCES, AND THE THREE QUESTIONS ============
         
         One section, because they are one thing from the
         reader's side: how this site behaves for them. The
         reading preferences act on every page immediately
         and are applied before the first paint on the next
         one; the three below them are what the site is
         allowed to do with what it knows. */
      node: (
        <Section id="preferences" title="How you like to read"
                 blurb="These take effect as you press them, on every page, and follow you to your other devices.">
          {/* The one section of this page that is a component
              rather than a slot a script fills in. `account-page.ts`
              painted it and no longer does: see the note at the top
              of `components/account/prefs.tsx`. */}
          <Card className="prefs gap-[18px]" id="account-prefs">
            <Preferences />
          </Card>

          <Settings />
        </Section>
      ),
    },
    {
      id: "data",
      label: "Your data",
      /* ============ WHAT IS KEPT, AND LEAVING ============ */
      node: (
        <Section id="data" title="Your data"
                 blurb="Only what is listed here, and only because it is useful to you. There is no analytics profile behind any of it.">
          <div className="cards grid-2"><Kept /></div>

          {/* AND THE WHOLE OF IT, drawn from `shared/storage.ts`
              rather than written out, so a key added anywhere on
              the site appears here without anybody coming to this
              route. The cards above count what a reader has done
              per school; this answers the question that had no
              answer anywhere, which is what all of it IS and
              which parts leave this machine. */}
          <HeldHere />

          <div className="grid gap-[var(--gap)]
                          grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
            <Card>
              <h3>Take a copy</h3>
              <p>One file with everything this account holds: your position
                 in every course, your checkpoints, your reading list, your
                 notes, your targets, your saved scenarios and your
                 preferences. Plain JSON, readable in any text editor.</p>
              <Button kind="ghost" id="account-export">
                Download everything
              </Button>
            </Card>
            <Card>
              <h3>Sign out</h3>
              <p>Ends the session on this device and takes the account&apos;s
                 copy of your progress off it, so the next person at this
                 machine does not inherit your ticks. Nothing on the account
                 is touched.</p>
              <Button kind="ghost" id="account-signout">
                Sign out
              </Button>
            </Card>
            <Card className="border-danger/35 bg-danger/5 [&_.btn:hover]:border-danger [&_.btn:hover]:text-danger">
              <h3>Erase everything</h3>
              <p>Removes all of it from the account: position, checkpoints,
                 reading list, notes, targets and scenarios. This cannot be
                 undone, so take a copy first if you want one.</p>
              <Button kind="ghost" id="account-forget">
                Erase it
              </Button>
            </Card>
          </div>
          <p className="signin-note" id="exit-note" />
        </Section>
      ),
    },
];

export default function AccountPage() {
  return (
    <main id="main">

      {/* Signed out, this page is one sentence and a button.
          There is no account wall anywhere on this site and this
          page is not one either. */}
      <div className="wrap wrap-narrow" id="account-out" hidden>
        <div className="hero">
          <Eyebrow>Your account</Eyebrow>
          <h1>Nobody is signed in on this device.</h1>
          <p className="lede">
            An account keeps your place in a course, the pages you save, the
            notes you write, what you are aiming for and how you like to read,
            and carries all of it between your phone and your laptop. Every
            page on this site is readable without one.
          </p>
          <div className="hero-actions">
            <Button kind="solid" id="account-signin">Sign in</Button>
            <ButtonLink kind="ghost" href="/">Back to the site</ButtonLink>
          </div>
        </div>
      </div>

      <div id="account-in" hidden>

        {/* ============ WHO, AND THE SHAPE OF THE YEAR ============ */}
        <header className="border-b border-hairline bg-[radial-gradient(90%_120%_at_0%_0%,var(--accent-soft),transparent_70%)] py-[clamp(28px,5vw,52px)] pb-[clamp(20px,3vw,30px)]">
          <div className="wrap grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-[18px]">
            {/* The initial, and the provider's picture over it when
                there is one: `account-page.ts` writes both. The
                image is taken out of flow rather than stacked in a
                grid cell, because the initial is a bare text node
                and auto-placement would put it in the cell beside
                a pinned image instead of under it. A picture that
                fails to load removes itself and leaves the
                letter. */}
            <span id="account-face" aria-hidden="true"
                  className="relative grid aspect-square w-[clamp(48px,12vw,62px)] place-items-center
                             overflow-hidden rounded-full bg-green font-read
                             text-[clamp(1.3rem,5vw,1.8rem)] leading-none text-white
                             [&>img]:absolute [&>img]:inset-0 [&>img]:size-full [&>img]:object-cover" />
            <div className="min-w-0">
              <h1 id="account-hello" className="m-0 text-[clamp(1.5rem,5vw,2.2rem)] text-balance">
                Hello.
              </h1>
              <p id="account-email"
                 className="mt-0.5 mb-0 overflow-hidden text-ellipsis whitespace-nowrap
                            font-code text-[0.86rem] text-ink-soft" />
            </div>
            {/* The four numbers. `auto-fit` rather than four
                columns, because two-by-two is the right shape on
                a phone and one row is right on a laptop, and
                neither needs saying. */}
            <div className="col-span-full grid gap-2.5
                            grid-cols-[repeat(auto-fit,minmax(min(45%,130px),1fr))]">
              <Tiles />
            </div>
          </div>
        </header>

        {/* Eight sections, one on screen.

            It was one long page with a strip of links down it,
            and it was eight screens of scrolling to reach the
            last of them. `<TabPanels>` is the calculators'
            arrangement, in React: pressing one shows it and hides
            the rest, the address carries which, and a link from
            the account menu straight to `#reading-list` opens
            that panel rather than scrolling to it.

            The panels are built HERE, on the server, and handed
            over as a prop. A client component's children are
            serialised into the payload rather than re-rendered in
            the browser, so making the strip interactive does not
            make eight sections of markup the browser's job. */}
        <TabPanels label="This page" panels={PANELS}
                   className="wrap grid gap-[clamp(20px,3vw,30px)]
                              pt-[clamp(16px,2.5vw,24px)] pb-[var(--step)]" />
      </div>
    </main>
  );
}
