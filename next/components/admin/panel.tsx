"use client";

/* ============================================================
   admin/panel.tsx: one page, two credentials.

   `ADMIN.md` §1 is the reasoning and it is worth not restating
   here, except for the one sentence everything in this file
   depends on:

     The passphrase and the account are NOT two ways of proving
     the same thing. They authorise different data, held in
     different places, reachable only by different means.

   The passphrase (`functions/_lib/auth.ts`, a session cookie over
   D1) opens the site's own content. The account
   (`functions/_lib/admins.ts`, a reader id) opens rows in
   Supabase that row-level security answers with the reader's own
   JWT. A cookie is not a JWT and D1 has no notion of a Supabase
   reader, so neither can stand in for the other, and that is a
   fact about the storage rather than a policy.

   So this page shows what the credentials in hand can honestly
   reach, and names what the missing one would add.

   ---- the two rules it must not break ----

   1. NEVER MINT ONE FROM THE OTHER. A button that turned an
      account sign-in into a passphrase session would make the
      passphrase pointless, and one going the other way would be a
      service-role key by another name. This project holds no
      service-role key and this panel is not a reason to start.

   2. NEVER SHOW A LOCKED PANEL AS AN EMPTY ONE. A panel missing
      its credential says so, with the one thing to press. An
      empty list where a credential is missing looks exactly like
      a working panel with nothing in it, which is the failure the
      desk's own browser test existed for and this page inherited.

   All seven stages of ADMIN.md §6 are here: the route, the shell,
   the two sign-ins and Health; the account half; the three
   moderation queues; the rest of the desk; the three the desk
   never had; and People, which is the one needing both at once.

   `next/admin.test.ts` drives this page in a browser, and it is
   what says a panel does something rather than merely rendering.
   ============================================================ */

import { useEffect, useState } from "react";
import { runtimeModule } from "../account/runtime";
import { readerCall } from "../../lib/reader-api";
import { AdminHealth } from "./health";
import { CoursesPanel } from "./courses-panel";
import { RoutineTemplatesPanel } from "./routine-panel";
import { LivePanel } from "./live-panel";
import { CommentsPanel, EnquiriesPanel, QuestionsPanel } from "./queues";
import { OverviewPanel } from "./overview-panel";
import { PiecesPanel } from "./pieces-panel";
import { CardsPanel } from "./cards-panel";
import { SubscribersPanel } from "./subscribers-panel";
import { MediaPanel } from "./media-panel";
import { SchoolsPanel } from "./schools-panel";
import { BackupsPanel } from "./backups-panel";
import { StatsPanel } from "./stats-panel";
import { PeoplePanel } from "./people-panel";
import { Button, ButtonLink } from "../ui/button";
import { Surface } from "../ui/surface";
import { WorkerPanel } from "./worker";

type AccountModule = typeof import("/account.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");

/** What each credential is, said once, so the two cards below and
    every future panel's locked state read the same words. */
const CREDENTIALS = {
  pass: {
    name: "The passphrase",
    opens: "the site's own writing: pieces, comments, questions, enquiries, "
      + "subscribers, media and the backups.",
    press: "Sign in at the Studio",
    /* A real navigation, unlike the account's below: the
       passphrase is set at the Studio and nowhere else. */
    where: "/studio",
  },
  account: {
    name: "Your account",
    opens: "what belongs to a reader: the course section, the live portfolio's "
      + "admin half, and the private routine templates.",
    press: "Sign in to your account",
    /* THE SITE'S OWN SIGN-IN BUTTON, pressed where it already is.

       `signInWithGoogle()` in `aab/src/account.ts` sends
       `location.pathname` as the return address, so a control
       that walks the reader to /account first means signing in
       from /admin lands them on /account and leaves them there.
       The sign-in has to happen HERE.

       This was `popovertarget="account-menu"` and that was wrong
       in a way worth writing down, because it looked right and
       shipped: `#account-menu` does not exist until the top bar's
       button is pressed, since `open()` in `aab/src/signin.ts`
       builds it on demand. A `popovertarget` naming an element
       that is not there does nothing, so the fallback fired every
       single time and the button behaved exactly like the link it
       replaced. The check written beside it asserted the
       ATTRIBUTE and so passed throughout.

       `.account-btn` is that button, and clicking it is the one
       sign-in this site has rather than a second copy of it. */
    trigger: ".account-btn",
  },
} as const;

function Gate({ which, held }: { which: keyof typeof CREDENTIALS; held: boolean }) {
  const c = CREDENTIALS[which];
  return (
    <Surface material="pane" className="ad-gate" data-held={held ? "" : undefined}>
      <h3>
        <span className="ad-dot" aria-hidden="true" data-state={held ? "up" : "unset"} />
        {c.name}
      </h3>
      {/* What a credential OPENS is said only to somebody who
          already holds one. "pieces, comments, questions,
          enquiries, subscribers, media and the backups" is an
          inventory of this site's private surface, and it was
          printed for anybody who opened the page. */}
      <p className="ad-quiet">{held ? <>Held. It opens {c.opens}</> : "Not held."}</p>
      {held ? null : "where" in c ? (
        <ButtonLink kind="ghost" size="sm" href={c.where}>{c.press}</ButtonLink>
      ) : (
        <Button kind="ghost" size="sm"
                onClick={() => {
                  /* The top bar's sign-in, pressed. It opens the
                     menu anchored to itself and leaves the
                     address at /admin, which is the whole point.
                     Only if the bar is not there at all does this
                     fall back to the page that has a sign-in on
                     it, so it can never be an inert button. */
                  const bar = document.querySelector<HTMLElement>(c.trigger);
                  if (bar) { bar.click(); return; }
                  window.location.href = "/account";
                }}>
          {c.press}
        </Button>
      )}
    </Surface>
  );
}

export function AdminPanel() {
  const [ready, setReady] = useState(false);
  const [pass, setPass] = useState(false);
  const [account, setAccount] = useState(false);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        /* The passphrase half asks the Worker, because the
           session is an httpOnly cookie and the browser
           deliberately cannot read it. */
        const seen = fetch("/api/auth/me", { headers: { accept: "application/json" } })
          .then(async (r): Promise<{ signedIn?: boolean }> => (r.ok ? r.json() : {}))
          .then((d) => Boolean(d.signedIn))
          .catch(() => false);

        /* The account half asks whether this reader is an admin,
           and it asks by requesting something only an admin gets
           rather than by keeping a second list: `isAdmin()` is
           the Worker's answer and nothing here should hold a
           copy of it. An empty list means not an admin, which is
           the same answer /api/routine/templates gives the page
           that uses it. */
        /* Through `readerCall`, which attaches the reader's own
           bearer. A plain fetch sends none, `readerFrom()` reads
           nothing else, and `isAdmin()` then says no before it
           consults either list: this gate read "Not held" for the
           real admin on every device, and the endpoint answering
           an empty list to a non-admin is by design, so nothing
           anywhere looked wrong. */
        const templates = await readerCall<{ templates?: unknown[] }>("routine/templates");
        const mine = templates.ok
          && Array.isArray(templates.data?.templates)
          && templates.data.templates.length > 0;

        const held = await seen;
        if (!live) return;
        setPass(held);
        setAccount(mine);
      } catch {
        /* `/account.js` is an `aab/` asset the Worker serves, so it is
           absent under a bare `next start` and could be absent for a
           moment on a bad connection. Either way the honest answer is
           "not signed in as an admin", not an unhandled rejection: this
           is the panel that has to work on the day a credential is what
           is broken. */
        if (live) { setPass(false); setAccount(false); }
      } finally { if (live) setReady(true); }
    })();
    return () => { live = false; };
  }, []);

  /* The browser panel draws in BOTH branches, and that is the
     point of it rather than an oversight. Everything else here
     waits on a credential check, and the day that check is what
     is stuck is the day somebody needs to be told what their
     browser is holding. It asks no endpoint, so nothing can
     leave it pending. */
  if (!ready) {
    return (
      <div className="ad-page">
        <WorkerPanel />
        <p className="ad-quiet" role="status">এক মুহূর্ত…</p>
      </div>
    );
  }

  /* ---- neither credential: a sign-in page, and that is all ----

     This used to render the whole shell to anybody: Health, both
     gate cards with an inventory of what each one opens, and
     thirteen panel headings under them. Every one of those is a
     description of a private surface, and a stranger reading it
     learns what this site keeps and where, without holding
     anything.

     ADMIN.md's rule that a locked panel must never look like an
     empty one still stands, and it is about somebody who is
     ALREADY through the door: which of their two credentials is
     missing, and what it would open. It was never an argument
     for showing the door's shape to the street.

     The browser panel stays, and it is the one thing that
     should: it reports what this VISITOR's own device is
     holding, tells a stranger nothing about the site, and is the
     way out of a stale cache for somebody who cannot load the
     page well enough to sign in. */
  if (!pass && !account) {
    return (
      <div className="ad-page">
        <Surface material="pane" className="ad-panel">
          <h3>Sign in</h3>
          <p className="ad-quiet">
            This page needs a credential. There are two, they open different
            things, and neither can stand in for the other.
          </p>
          <div className="ad-gates">
            <ButtonLink kind="ghost" size="sm" href={CREDENTIALS.pass.where}>
              {CREDENTIALS.pass.press}
            </ButtonLink>
            <Button kind="ghost" size="sm"
                    onClick={() => {
                      const bar = document.querySelector<HTMLElement>(CREDENTIALS.account.trigger);
                      if (bar) { bar.click(); return; }
                      window.location.href = "/account";
                    }}>
              {CREDENTIALS.account.press}
            </Button>
          </div>
        </Surface>

        <WorkerPanel />
      </div>
    );
  }

  return (
    <div className="ad-page">
      <WorkerPanel />

      {/* Health first among the rest, because it is the panel that
          has to work on the day a credential is what is broken. */}
      <AdminHealth />

      <div className="ad-gates">
        <Gate which="pass" held={pass} />
        <Gate which="account" held={account} />
      </div>

      {/* The desk is a ROUTE rather than a panel, and the link is
          here because this is where somebody arrives. Everything
          else on this page is a list or a queue; that is an hour
          at a working surface, and a working surface inside a
          column of nineteen panels is one you scroll to. */}
      {account ? (
        <Surface material="pane" className="ad-panel">
          <h3>Research</h3>
          <p className="ad-quiet">
            A question, what has been read about it, what is left, and what on
            this site it touches. Threads are rows under your own account.
          </p>
          <ButtonLink kind="ghost" size="sm" href="/admin/research">
            Open the desk
          </ButtonLink>
        </Surface>
      ) : null}

      {/* ADMIN.md §6 stage 7. The only panel needing both at once,
          and it decides that for itself rather than being hidden
          behind the two flags above: mounted unconditionally, it
          says WHICH credential is missing, which is what §3 D asks
          for and what a panel that vanishes cannot do. */}
      <PeoplePanel />

      {/* ADMIN.md §6 stage 3: the account half. All three already had
          their endpoint, which is why they are the stage that comes
          first. Each one is shown whatever the credential state is and
          says what it is missing, rather than being hidden: a panel
          that disappears when you are signed out is a panel you cannot
          debug on the day the sign-in is what is broken. */}
      {account ? (
        <>
          <CoursesPanel />
          <LivePanel />
          <RoutineTemplatesPanel />
        </>
      ) : null}

      {/* ADMIN.md §6 stages 4 and 5: the passphrase half. Shown
          whatever the credential state is, for the reason above:
          each says what it is missing rather than drawing an empty
          list, and the endpoint's own 401 is what it reads to
          decide. Waiting leads, because it is the one that says
          which of the others needs opening. */}
      <OverviewPanel />
      <PiecesPanel />
      {/* Beside the pieces, because it is the same job for
          everything the pieces panel does not cover: a lesson has
          never had a card of its own and 251 of them share six
          standing ones. */}
      <CardsPanel />
      <CommentsPanel />
      <QuestionsPanel />
      <EnquiriesPanel />
      <SubscribersPanel />

      {/* Not in ADMIN.md's thirteen, and here because comparing the
          desk's own browser test check by check found one whole
          panel the desk had and this page did not. §4 bans
          analytics BEYOND what the site already counts, which is
          what this reads. */}
      <StatsPanel />

      {/* ADMIN.md §6 stage 6: the three the desk never had. */}
      <MediaPanel />
      <SchoolsPanel />
      <BackupsPanel />

      <Surface material="pane" className="ad-panel">
        <h3>What is not here</h3>
        <p className="ad-quiet">
          Thirteen panels, in ADMIN.md, and all thirteen are above, plus two that
          are not on that list: the statistics the desk had, and what this browser
          is holding. Nothing here is a placeholder: an empty panel that will one
          day hold something reads exactly like a broken panel that holds nothing,
          which is the whole reason that file exists.
        </p>
        <p className="ad-quiet">
          The desk has retired. Its thirteen panels are the ones above, all four
          spellings of its address are a 301 to this page, and everything it was
          built from is in <code>archive/</code>, which is readable rather than
          deleted: the reason to keep a replaced thing at all is so that whoever
          has to check the replacement can read both.
        </p>
      </Surface>
    </div>
  );
}
