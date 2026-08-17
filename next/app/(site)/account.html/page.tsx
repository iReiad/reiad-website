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
              <p className="lede">Signing in keeps your place in a course across your
          phone and your laptop, and puts a name on anything you write. Every
          page on this site is readable without one.
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
            {/* ============ WHAT IS KEPT ============ */}
            <section>
              <span className="section-label mono">What this account keeps
              </span>
              <p className="measure">Only what is listed here, and only because it is
          useful to you. There is no analytics profile behind it: what you read
          is not shown to anybody, including me.
              </p>
              <p className="account-week" id="account-week" hidden />
              <div className="cards grid-2" id="account-kept" />
              <p className="tool-note" id="account-synced" />
            </section>
            {/* ============ LEAVING ============ */}
            <section>
              <span className="section-label mono">Leaving
              </span>
              <div className="account-exits">
                <div className="cell">
                  <h3>Sign out here
                  </h3>
                  <p>Ends the session on this device. Your progress stays on the
              account and on this browser.
                  </p>
                  <button className="btn btn-ghost" id="account-signout">Sign out
                  </button>
                </div>
                <div className="cell">
                  <h3>Forget my progress
                  </h3>
                  <p>Removes what this account has saved. What is on this device
              stays until you clear it in each course.
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
