/* ============================================================
   /account.html

   Ported out of `aab/account.html` with archive/TRANSITION.md Stage 11.5,
   words unchanged. Personal, and not for a search engine: the
   robots tag it carried is in the metadata below rather than in
   the markup.

   Everything on it is filled by `/account-page.js`, from
   Supabase and from this browser's own storage. None of it can be
   rendered on the server and none of it should be: a page that
   knew who you were before it reached you would be a page this
   site cached wrong.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../lib/pageMeta";

export const metadata: Metadata = {
  ...pageMeta({
    path: "/account.html",
    title: "Your account · Reiad's Library",
    description: "Your account: your name, what is saved, and how to leave.",
    ogTitle: "Your account",
    card: "insights",
  }),
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (

      <main id="main">
        <div className="wrap wrap-narrow">
          {/* Signed out, this page is one sentence and a button. There
           is no account wall anywhere on this site and this page is
           not one either. */}
          <div id="account-out" hidden>
            <div className="hero" style={{ paddingBlock: "52px 20px" }}>
              <span className="eyebrow mono">Your account
              </span>
              <h1>Nobody is signed in on this device.
              </h1>
              <p className="lede">An account is where your reading position, your
          checkpoints, your saved calculations and anything you are aiming for
          are kept. Every page on this site is readable without one, and what
          you tick without one stays on this browser.
              </p>
              <div className="hero-actions">
                <button className="btn btn-solid" id="account-signin">Sign in
                </button>
                <a className="btn btn-ghost" href="/index.html">Back to the site
                </a>
              </div>
            </div>
          </div>
          <div id="account-in" hidden>
            <div className="hero" style={{ paddingBlock: "52px 14px" }}>
              <span className="eyebrow mono">Your account
              </span>
              <h1 id="account-hello">Hello.
              </h1>
              <p className="lede" id="account-email" />
            </div>
            {/* ============ SETTINGS, AND SETUP ============

             One form, two framings. The first time somebody lands
             here after signing in, the label and the paragraph
             above it ask the three questions as setup and there is
             a "not now" beside Save. Once answered, the same three
             fields are settings and the label says so.

             They are one form because they were nearly two, and
             two would have been two sets of markup, two save
             handlers and two places for the wording of a course
             name to drift. account-page.js swaps four strings. */}
            <section id="account-settings">
              <span className="section-label mono" id="settings-label">Your settings
              </span>
              <p className="measure" id="settings-intro">Three things, none of them
          required. You can change any of them whenever you like.
              </p>
              <form className="account-panel" id="settings-form">
                <fieldset>
                  <legend>Your name
                  </legend>
                  <p className="field-note">What appears beside anything you write.
              Nothing else about you is shown to anyone.
                  </p>
                  <input type="text" id="account-name" maxLength={40} autoComplete="name" placeholder="Your name" />
                </fieldset>
                <fieldset>
                  <legend>What are you here to learn?
                  </legend>
                  <p className="field-note">The home page offers these first when you
              come back, and a course you pick here shows up even before you
              have opened it.
                  </p>
                  {/* Built from COURSES in content.js. Ticked already
                   for anything this device has progress in. */}
                  <div className="choice-grid" id="account-courses" />
                </fieldset>
                <fieldset>
                  <legend>How often do you want to practise?
                  </legend>
                  <p className="field-note">Only so this page can tell you how the
              last week went. Nothing is sent to you: there are no
              notifications on this site and there will not be any.
                  </p>
                  <div className="choice-row" id="account-pace" />
                </fieldset>
                <div className="account-actions">
                  <button className="btn btn-solid" type="submit">Save
                  </button>
                  <button className="btn btn-ghost" type="button" id="settings-skip" hidden>Not now
                  </button>
                  <span className="signin-note" id="settings-note" />
                </div>
              </form>
            </section>
            {/* ============ THE LADDERS ============

             One row per course: how far through it you are, where
             you were when you stopped, and how many checkpoints
             inside those lessons you have ticked. All three come
             out of the account, which is what the rewrite of
             `aab/sync.js` made true: this page used to be able to
             report only what this browser happened to hold. */}
            <section>
              <span className="section-label mono">Where you are
              </span>
              <p className="measure">Your position in each course, the chapters you
          have finished, and the checkpoints you have ticked inside them. This
          is the account&apos;s copy, so it is the same on every device you sign
          in on.
              </p>
              <div className="ladder-list" id="account-paths" />
              <p className="tool-note" id="account-synced" />
              <p className="account-week" id="account-week" hidden />
            </section>
            {/* ============ TARGETS ============

             A goal with a number on it and a bar under it. Three
             kinds, and each one has a source for its progress
             that already exists: a course reads your ticks, a
             habit reads the days you turned up, and a number this
             site cannot see is one you type in. A fourth kind
             would have to pass that test too. */}
            <section>
              <span className="section-label mono">What you are aiming for
              </span>
              <p className="measure">Set a target and this page measures it. Nothing
          is sent to you about it: there are no notifications on this site and
          there will not be any.
              </p>
              <div className="targets" id="account-targets" />
              <form className="account-panel target-form" id="target-form">
                <fieldset>
                  <legend>Add a target
                  </legend>
                  <div className="choice-row" id="target-kind" />
                  <div className="target-fields" id="target-fields" />
                </fieldset>
                <div className="account-actions">
                  <button className="btn btn-solid" type="submit">Add it
                  </button>
                  <span className="signin-note" id="target-note" />
                </div>
              </form>
            </section>
            {/* ============ SAVED SCENARIOS ============ */}
            <section>
              <span className="section-label mono">Saved scenarios
              </span>
              <p className="measure">A filled-in calculator, kept under a name. Open
          one and the tool comes back exactly as you left it, on any device you
          are signed in on.
              </p>
              <div className="saved-list" id="account-scenarios" />
            </section>
            {/* ============ WHAT IS KEPT ============ */}
            <section>
              <span className="section-label mono">What this account keeps
              </span>
              <p className="measure">Only what is listed here, and only because it is
          useful to you. There is no analytics profile behind it: what you read
          is not shown to anybody, including me.
              </p>
              <div className="cards grid-2" id="account-kept" />
            </section>
            {/* ============ LEAVING ============ */}
            <section>
              <span className="section-label mono">Leaving
              </span>
              <div className="account-exits">
                <div className="cell">
                  <h3>Sign out here
                  </h3>
                  <p>Ends the session on this device and takes the account&apos;s
              copy of your progress off it, so the next person at this machine
              does not inherit your ticks. Nothing on the account is touched:
              sign in again, anywhere, and it is all there.
                  </p>
                  <button className="btn btn-ghost" id="account-signout">Sign out
                  </button>
                </div>
                <div className="cell">
                  <h3>Forget everything
                  </h3>
                  <p>Removes what this account has saved: your position, your
              checkpoints, your targets and your saved scenarios. This cannot be
              undone.
                  </p>
                  <button className="btn btn-ghost" id="account-forget">Forget it
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
