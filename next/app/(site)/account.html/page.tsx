/* ============================================================
   /account.html

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
   that, and `@theme` in `aab/src/styles/tailwind.css` now carries
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
                        of `aab/src/styles/tailwind.css` is the
                        long version.

   The class names that remain are hooks rather than styling, and
   there are fewer of them than the conversion started with.
   `ladder-list`, `kept-list`, `targets` and `saved-list` are the
   containers `aab/account-page.ts` fills, and the rows it builds
   inside them are named classes styled in `styles.css`: a class
   name inside a `createElement` call is one Tailwind's scanner
   finds only because `aab/*.js` is in its source list, which
   makes it work and does not make it readable. JSX gets
   utilities; DOM built in a loop gets a class.

   Nothing here carries a class that exists only to be selected. A
   section is addressed by its `id`, which it needs anyway for the
   menu's fragments, and the rail is a labelled `<nav>`, which is
   what `next/account.test.mjs` asks for.

   ---- and it is still filled entirely by a script ----

   `/account-page.js`, from Supabase. None of it can be rendered
   on the server and none of it should be: a page that knew who
   you were before it reached you would be a page this site cached
   wrong. What the server renders is the shape, so the page does
   not reflow as each section answers.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../lib/pageMeta";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/account.html",
    title: "Your account · Reiad's Library",
    description: "Your account: what you have read, kept, written and set.",
    ogTitle: "Your account",
    card: "insights",
  }),
  robots: { index: false, follow: false },
};

/* The section rail. One entry per `<section>` below, in the order
   they appear, and the ids are the same strings the account menu
   in `aab/signin.js` links to. Written out here rather than
   derived, because a rail built by walking the DOM is a rail that
   is empty until a script runs and that jumps when it does. */
const SECTIONS = [
  { id: "you", label: "Overview" },
  { id: "ladders", label: "Courses" },
  { id: "reading-list", label: "Reading list" },
  { id: "notes", label: "Notes" },
  { id: "targets", label: "Targets" },
  { id: "scenarios", label: "Scenarios" },
  { id: "preferences", label: "Preferences" },
  { id: "data", label: "Your data" },
];

/* ---------- the four shapes this page repeats ----------

   A section, a card, a row of actions and a form. Written as
   components rather than as a class name each, because that is
   what a utility framework gives you instead of a class: the
   place the decision lives moves from the stylesheet to here,
   and it is still one place.

   `FORM` is a string rather than a component because it is
   applied to two `<form>` elements that differ in everything
   else, and a component wrapping a form would have to forward an
   id, a submit handler and children to earn its keep. */
const FORM = "grid max-w-[620px] gap-[22px] "
  + "[&_fieldset]:m-0 [&_fieldset]:grid [&_fieldset]:gap-[9px] [&_fieldset]:border-0 [&_fieldset]:p-0 "
  + "[&_legend]:p-0 [&_legend]:font-serif [&_legend]:text-[1.04rem] [&_legend]:text-ink "
  + "[&_.field-note]:m-0 [&_.field-note]:-mt-[3px] [&_.field-note]:mb-0.5 "
  + "[&_.field-note]:max-w-[var(--measure)] [&_.field-note]:text-[0.85rem] [&_.field-note]:text-ink-soft "
  + "[&_input[type=text]]:max-w-[340px] [&_input[type=text]]:rounded-sm "
  + "[&_input[type=text]]:border [&_input[type=text]]:border-hairline "
  + "[&_input[type=text]]:bg-paper [&_input[type=text]]:px-[13px] [&_input[type=text]]:py-[11px] "
  + "[&_input[type=text]]:text-[0.95rem] "
  + "[&_input[type=text]:focus]:border-green [&_input[type=text]:focus]:outline-none "
  + "[&_input[type=text]:focus]:ring-2 [&_input[type=text]:focus]:ring-green/20";

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
                        scroll-mt-[calc(var(--top-h,58px)+58px)]
                        target:[&>div:first-child]:-ms-3.5
                        target:[&>div:first-child]:border-s-2
                        target:[&>div:first-child]:border-green
                        target:[&>div:first-child]:ps-3">
      <div className="grid gap-1">
        <h2 className="m-0 font-serif text-[clamp(1.2rem,3.4vw,1.5rem)]">{title}</h2>
        <p className="m-0 max-w-[var(--measure)] text-[0.9rem] text-ink-soft">{blurb}</p>
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
                     border border-hairline bg-panel p-[clamp(14px,3vw,20px)]
                     [&>h3]:m-0 [&>h3]:text-[1.02rem] [&>h3]:font-medium
                     [&>p]:m-0 [&>p]:text-[0.88rem] [&>p]:text-ink-soft
                     [&>.btn]:justify-self-start ${className}`}>
      {children}
    </div>
  );
}

const Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3">{children}</div>
);

export default function AccountPage() {
  return (
    <main id="main">

      {/* Signed out, this page is one sentence and a button.
          There is no account wall anywhere on this site and this
          page is not one either. */}
      <div className="wrap wrap-narrow" id="account-out" hidden>
        <div className="hero" style={{ paddingBlock: "52px 20px" }}>
          <span className="eyebrow mono">Your account</span>
          <h1>Nobody is signed in on this device.</h1>
          <p className="lede">
            An account keeps your place in a course, the pages you save, the
            notes you write, what you are aiming for and how you like to read,
            and carries all of it between your phone and your laptop. Every
            page on this site is readable without one.
          </p>
          <div className="hero-actions">
            <button className="btn btn-solid" id="account-signin">Sign in</button>
            <a className="btn btn-ghost" href="/index.html">Back to the site</a>
          </div>
        </div>
      </div>

      <div id="account-in" hidden>

        {/* ============ WHO, AND THE SHAPE OF THE YEAR ============ */}
        <header className="border-b border-hairline bg-[radial-gradient(90%_120%_at_0%_0%,var(--green-soft),transparent_70%)] py-[clamp(28px,5vw,52px)] pb-[clamp(20px,3vw,30px)]">
          <div className="wrap grid grid-cols-[auto_1fr] items-center gap-x-5 gap-y-[18px]">
            <span id="account-face" aria-hidden="true"
                  className="grid aspect-square w-[clamp(48px,12vw,62px)] place-items-center
                             rounded-full bg-green font-serif text-[clamp(1.3rem,5vw,1.8rem)]
                             leading-none text-white" />
            <div className="min-w-0">
              <h1 id="account-hello" className="m-0 text-[clamp(1.5rem,5vw,2.2rem)] text-balance">
                Hello.
              </h1>
              <p id="account-email"
                 className="mt-0.5 mb-0 overflow-hidden text-ellipsis whitespace-nowrap
                            font-mono text-[0.86rem] text-ink-soft" />
            </div>
            {/* The four numbers. `auto-fit` rather than four
                columns, because two-by-two is the right shape on
                a phone and one row is right on a laptop, and
                neither needs saying. */}
            <div id="account-tiles"
                 className="col-span-full grid gap-2.5
                            grid-cols-[repeat(auto-fit,minmax(min(45%,130px),1fr))]" />
          </div>
        </header>

        {/* Sticky, and the one piece of navigation on this page.
            It is a list of links to fragments rather than tabs
            that hide things: a reader who lands on
            `#reading-list` from the header menu should find the
            page scrolled to their reading list with everything
            else still there above and below it. */}
        <nav aria-label="This page"
             className="sticky top-[var(--top-h,58px)] z-20 border-b border-hairline
                        bg-[color-mix(in_oklab,var(--paper)_88%,transparent)]
                        backdrop-blur-[10px] backdrop-saturate-150">
          {/* It scrolls sideways rather than wrapping to three
              lines: eight links is more than a phone can show,
              and a rail that changed height as you scrolled past
              it would move the page under the thumb doing the
              scrolling. */}
          <div className="wrap flex gap-1 overflow-x-auto py-[7px]
                          [scrollbar-width:none] [scroll-snap-type:x_proximity]
                          [&::-webkit-scrollbar]:hidden">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`}
                 className="inline-flex min-h-9 shrink-0 items-center whitespace-nowrap
                            rounded-full px-[13px] py-[7px] text-[0.82rem] text-ink-soft
                            no-underline transition-colors [scroll-snap-align:start]
                            hover:bg-panel-hover hover:text-ink hover:opacity-100
                            focus-visible:bg-panel-hover focus-visible:text-ink
                            focus-visible:outline-none
                            focus-visible:ring-2 focus-visible:ring-green/30">
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="wrap grid gap-[clamp(34px,5vw,56px)]
                        pt-[clamp(26px,4vw,44px)] pb-[var(--step)]">

          <Section id="you" title="Your year"
                   blurb="Every day you opened something here. Nothing else is counted, and none of it is shown to anybody but you.">
            <Card>
              {/* The grid itself stays a stylesheet rule: 53
                  columns sized by a custom property is one line of
                  CSS and would be one arbitrary value per axis. */}
              <div className="heat" id="account-heat" />
              <p className="m-0 text-[0.82rem] text-ink-soft" id="account-week" />
            </Card>
          </Section>

          {/* ============ THE LADDERS ============ */}
          <Section id="ladders" title="Where you are"
                   blurb="Your position in each course, the chapters you have finished and the checkpoints you have ticked inside them. This is the account's copy, so it is the same on every device.">
            <div className="ladder-list" id="account-paths" />
            <p className="m-0 text-[0.82rem] text-ink-soft" id="account-synced" />
          </Section>

          {/* ============ KEPT, AND WRITTEN ON ============ */}
          <Section id="reading-list" title="Reading list"
                   blurb="Pages you kept for later. Save one from the row under its title, on any piece or lesson.">
            <div className="kept-list" id="account-kept-list" />
          </Section>

          <Section id="notes" title="Your notes"
                   blurb="What you wrote in the margin. Private, stored against your account, and shown to nobody, including me.">
            <div className="kept-list" id="account-notes" />
          </Section>

          {/* ============ TARGETS ============ */}
          <Section id="targets" title="What you are aiming for"
                   blurb="Set a target and this page measures it. Nothing is sent to you about it: there are no notifications on this site and there will not be any.">
            <div className="targets" id="account-targets" />
            {/* A form nobody needs open until they want it, and a
                `<details>` is the disclosure the rest of this site
                already uses rather than a second panel with its
                own open state in a script. */}
            <details id="target-more"
                     className="rounded-card border border-hairline bg-panel
                                [&>summary]:list-none
                                [&>summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-[46px] cursor-pointer items-center gap-2
                                  px-4 py-[13px] text-[0.92rem] text-green
                                  before:font-mono before:text-base before:content-['+']">
                Add a target
              </summary>
              <form id="target-form" className={`${FORM} gap-4 px-4 pb-[18px]`}>
                <div className="choice-row" id="target-kind" />
                <div className="target-fields" id="target-fields" />
                <Actions>
                  <button className="btn btn-solid" type="submit">Add it</button>
                  <span className="signin-note" id="target-note" />
                </Actions>
              </form>
            </details>
          </Section>

          {/* ============ SAVED SCENARIOS ============ */}
          <Section id="scenarios" title="Saved scenarios"
                   blurb="A filled-in calculator, kept under a name. Open one and the tool comes back exactly as you left it.">
            <div className="saved-list" id="account-scenarios" />
          </Section>

          {/* ============ PREFERENCES, AND THE THREE QUESTIONS ============

              One section, because they are one thing from the
              reader's side: how this site behaves for them. The
              reading preferences act on every page immediately
              and are applied before the first paint on the next
              one; the three below them are what the site is
              allowed to do with what it knows. */}
          <Section id="preferences" title="How you like to read"
                   blurb="These take effect as you press them, on every page, and follow you to your other devices.">
            <Card className="prefs gap-[18px]" id="account-prefs" />

            <div className="mt-3 grid gap-1 border-t border-hairline pt-5">
              <h3 id="settings-label" className="m-0 text-[1.08rem]">Your settings</h3>
              <p id="settings-intro" className="m-0 max-w-[var(--measure)] text-[0.9rem] text-ink-soft">
                Three things, none of them required. You can change any of them
                whenever you like.
              </p>
            </div>
            <form className={FORM} id="settings-form">
              <fieldset>
                <legend>Your name</legend>
                <p className="field-note">What appears beside anything you
                   write. Nothing else about you is shown to anyone.</p>
                <input type="text" id="account-name" maxLength={40}
                       autoComplete="name" placeholder="Your name" />
              </fieldset>
              <fieldset>
                <legend>What are you here to learn?</legend>
                <p className="field-note">The home page offers these first when
                   you come back, and a course you pick here shows up even
                   before you have opened it.</p>
                <div className="choice-grid" id="account-courses" />
              </fieldset>
              <fieldset>
                <legend>How often do you want to practise?</legend>
                <p className="field-note">Only so this page can tell you how
                   the last week went.</p>
                <div className="choice-row" id="account-pace" />
              </fieldset>
              <Actions>
                <button className="btn btn-solid" type="submit">Save</button>
                <button className="btn btn-ghost" type="button" id="settings-skip"
                        hidden>Not now</button>
                <span className="signin-note" id="settings-note" />
              </Actions>
            </form>
          </Section>

          {/* ============ WHAT IS KEPT, AND LEAVING ============ */}
          <Section id="data" title="Your data"
                   blurb="Only what is listed here, and only because it is useful to you. There is no analytics profile behind any of it.">
            <div className="cards grid-2" id="account-kept" />

            <div className="grid gap-[var(--gap)]
                            grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))]">
              <Card>
                <h3>Take a copy</h3>
                <p>One file with everything this account holds: your position
                   in every course, your checkpoints, your reading list, your
                   notes, your targets, your saved scenarios and your
                   preferences. Plain JSON, readable in any text editor.</p>
                <button className="btn btn-ghost" id="account-export">
                  Download everything
                </button>
              </Card>
              <Card>
                <h3>Sign out</h3>
                <p>Ends the session on this device and takes the account&apos;s
                   copy of your progress off it, so the next person at this
                   machine does not inherit your ticks. Nothing on the account
                   is touched.</p>
                <button className="btn btn-ghost" id="account-signout">
                  Sign out
                </button>
              </Card>
              <Card className="border-danger/35 bg-danger/5 [&_.btn:hover]:border-danger [&_.btn:hover]:text-danger">
                <h3>Erase everything</h3>
                <p>Removes all of it from the account: position, checkpoints,
                   reading list, notes, targets and scenarios. This cannot be
                   undone, so take a copy first if you want one.</p>
                <button className="btn btn-ghost" id="account-forget">
                  Erase it
                </button>
              </Card>
            </div>
            <p className="signin-note" id="exit-note" />
          </Section>

        </div>
      </div>
    </main>
  );
}
