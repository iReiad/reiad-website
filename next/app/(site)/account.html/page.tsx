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
        <header className="acct-top">
          <div className="wrap acct-top-inner">
            <span className="acct-face" id="account-face" aria-hidden="true" />
            <div className="acct-hello">
              <h1 id="account-hello">Hello.</h1>
              <p id="account-email" />
            </div>
            <div className="acct-tiles" id="account-tiles" />
          </div>
        </header>

        {/* Sticky, and the one piece of navigation on this page.
            It is a list of links to fragments rather than tabs
            that hide things: a reader who lands on
            `#reading-list` from the header menu should find the
            page scrolled to their reading list with everything
            else still there above and below it. */}
        <nav className="acct-rail" aria-label="This page">
          <div className="wrap acct-rail-inner">
            {SECTIONS.map((s) => (
              <a key={s.id} className="acct-rail-link" href={`#${s.id}`}>{s.label}</a>
            ))}
          </div>
        </nav>

        <div className="wrap acct-body">

          <section className="acct-sec" id="you">
            <div className="acct-head">
              <h2>Your year</h2>
              <p>Every day you opened something here. Nothing else is counted,
                 and none of it is shown to anybody but you.</p>
            </div>
            <div className="acct-card">
              <div className="heat" id="account-heat" />
              <p className="acct-note" id="account-week" />
            </div>
          </section>

          {/* ============ THE LADDERS ============ */}
          <section className="acct-sec" id="ladders">
            <div className="acct-head">
              <h2>Where you are</h2>
              <p>Your position in each course, the chapters you have finished
                 and the checkpoints you have ticked inside them. This is the
                 account&apos;s copy, so it is the same on every device.</p>
            </div>
            <div className="ladder-list" id="account-paths" />
            <p className="acct-note" id="account-synced" />
          </section>

          {/* ============ KEPT, AND WRITTEN ON ============ */}
          <section className="acct-sec" id="reading-list">
            <div className="acct-head">
              <h2>Reading list</h2>
              <p>Pages you kept for later. Save one from the row under its
                 title, on any piece or lesson.</p>
            </div>
            <div className="kept-list" id="account-kept-list" />
          </section>

          <section className="acct-sec" id="notes">
            <div className="acct-head">
              <h2>Your notes</h2>
              <p>What you wrote in the margin. Private, stored against your
                 account, and shown to nobody, including me.</p>
            </div>
            <div className="kept-list" id="account-notes" />
          </section>

          {/* ============ TARGETS ============ */}
          <section className="acct-sec" id="targets">
            <div className="acct-head">
              <h2>What you are aiming for</h2>
              <p>Set a target and this page measures it. Nothing is sent to
                 you about it: there are no notifications on this site and
                 there will not be any.</p>
            </div>
            <div className="targets" id="account-targets" />
            <details className="acct-more" id="target-more">
              <summary>Add a target</summary>
              <form className="acct-form" id="target-form">
                <div className="choice-row" id="target-kind" />
                <div className="target-fields" id="target-fields" />
                <div className="acct-actions">
                  <button className="btn btn-solid" type="submit">Add it</button>
                  <span className="signin-note" id="target-note" />
                </div>
              </form>
            </details>
          </section>

          {/* ============ SAVED SCENARIOS ============ */}
          <section className="acct-sec" id="scenarios">
            <div className="acct-head">
              <h2>Saved scenarios</h2>
              <p>A filled-in calculator, kept under a name. Open one and the
                 tool comes back exactly as you left it.</p>
            </div>
            <div className="saved-list" id="account-scenarios" />
          </section>

          {/* ============ PREFERENCES, AND THE THREE QUESTIONS ============

              One section, because they are one thing from the
              reader's side: how this site behaves for them. The
              reading preferences act on every page immediately
              and are applied before the first paint on the next
              one; the three below them are what the site is
              allowed to do with what it knows. */}
          <section className="acct-sec" id="preferences">
            <div className="acct-head">
              <h2>How you like to read</h2>
              <p>These take effect as you press them, on every page, and
                 follow you to your other devices.</p>
            </div>
            <div className="acct-card prefs" id="account-prefs" />

            <div className="acct-head acct-head-sub">
              <h3 id="settings-label">Your settings</h3>
              <p id="settings-intro">Three things, none of them required. You
                 can change any of them whenever you like.</p>
            </div>
            <form className="acct-form" id="settings-form">
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
              <div className="acct-actions">
                <button className="btn btn-solid" type="submit">Save</button>
                <button className="btn btn-ghost" type="button" id="settings-skip"
                        hidden>Not now</button>
                <span className="signin-note" id="settings-note" />
              </div>
            </form>
          </section>

          {/* ============ WHAT IS KEPT, AND LEAVING ============ */}
          <section className="acct-sec" id="data">
            <div className="acct-head">
              <h2>Your data</h2>
              <p>Only what is listed here, and only because it is useful to
                 you. There is no analytics profile behind any of it.</p>
            </div>
            <div className="cards grid-2" id="account-kept" />

            <div className="acct-exits">
              <div className="acct-card">
                <h3>Take a copy</h3>
                <p>One file with everything this account holds: your position
                   in every course, your checkpoints, your reading list, your
                   notes, your targets, your saved scenarios and your
                   preferences. Plain JSON, readable in any text editor.</p>
                <button className="btn btn-ghost" id="account-export">
                  Download everything
                </button>
              </div>
              <div className="acct-card">
                <h3>Sign out</h3>
                <p>Ends the session on this device and takes the account&apos;s
                   copy of your progress off it, so the next person at this
                   machine does not inherit your ticks. Nothing on the account
                   is touched.</p>
                <button className="btn btn-ghost" id="account-signout">
                  Sign out
                </button>
              </div>
              <div className="acct-card acct-card-warn">
                <h3>Erase everything</h3>
                <p>Removes all of it from the account: position, checkpoints,
                   reading list, notes, targets and scenarios. This cannot be
                   undone, so take a copy first if you want one.</p>
                <button className="btn btn-ghost" id="account-forget">
                  Erase it
                </button>
              </div>
            </div>
            <p className="signin-note" id="exit-note" />
          </section>

        </div>
      </div>
    </main>
  );
}
