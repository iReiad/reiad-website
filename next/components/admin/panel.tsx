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
      a working panel with nothing in it, which is the failure
      `app/desk.test.ts` exists for.

   ADMIN.md §6 stages 1, 3 and 4 are here: the route, the shell,
   the two sign-ins and Health; the account half; and the three
   moderation queues. Stages 5 to 7 arrive one at a time, each
   shipping on its own.
   ============================================================ */

import { useEffect, useState } from "react";
import { runtimeModule } from "../account/runtime";
import { AdminHealth } from "./health";
import { CoursesPanel } from "./courses-panel";
import { RoutineTemplatesPanel } from "./routine-panel";
import { LivePanel } from "./live-panel";
import { CommentsPanel, EnquiriesPanel, QuestionsPanel } from "./queues";
import { OverviewPanel } from "./overview-panel";
import { PiecesPanel } from "./pieces-panel";
import { SubscribersPanel } from "./subscribers-panel";
import { ButtonLink } from "../ui/button";
import { Surface } from "../ui/surface";

type AccountModule = typeof import("/account.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");

/** What each credential is, said once, so the two cards below and
    every future panel's locked state read the same words. */
const CREDENTIALS = {
  pass: {
    name: "The passphrase",
    opens: "the site's own writing: pieces, comments, questions, enquiries, "
      + "subscribers, media and the backups.",
    where: "/studio",
    press: "Sign in at the Studio",
  },
  account: {
    name: "Your account",
    opens: "what belongs to a reader: the course section, the live portfolio's "
      + "admin half, and the private routine templates.",
    where: "/account",
    press: "Sign in to your account",
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
      <p className="ad-quiet">{held ? "Held. It opens " : "Not held. It would open "}{c.opens}</p>
      {held ? null : <ButtonLink kind="ghost" size="sm" href={c.where}>{c.press}</ButtonLink>}
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
        const acc = await accountModule();
        const mine = acc.current()
          ? await fetch("/api/routine/templates", {
            headers: { accept: "application/json" },
          })
            .then(async (r): Promise<{ templates?: unknown[] }> => (r.ok ? r.json() : {}))
            .then((d) => Array.isArray(d.templates) && d.templates.length > 0)
            .catch(() => false)
          : false;

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

  if (!ready) return <p className="ad-quiet" role="status">এক মুহূর্ত…</p>;

  return (
    <div className="ad-page">
      {/* Health first and always, because it is the panel that has
          to work on the day a credential is what is broken. */}
      <AdminHealth />

      <div className="ad-gates">
        <Gate which="pass" held={pass} />
        <Gate which="account" held={account} />
      </div>

      {pass && account ? (
        <Surface material="pane" className="ad-panel">
          <h3>Both</h3>
          <p className="ad-quiet">
            One panel needs the two at once and it is the reason this page asks
            for both: a person here is a Supabase account and a set of rows in
            D1 written under their name, and neither store knows about the
            other. ADMIN.md §3 D is what it will show, and what it will not.
          </p>
        </Surface>
      ) : null}

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
      <CommentsPanel />
      <QuestionsPanel />
      <EnquiriesPanel />
      <SubscribersPanel />

      <Surface material="pane" className="ad-panel">
        <h3>Not built yet</h3>
        <p className="ad-quiet">
          Thirteen panels, in ADMIN.md, and nine of them are above. Nothing here is a
          placeholder for the rest: an empty panel that will one day hold something reads
          exactly like a broken panel that holds nothing, which is the whole reason that
          file exists.
        </p>
        <p className="ad-quiet">
          Still to come, in that file&apos;s order: Media, Schools and Backups, the three
          the desk never had; then People, last because it is the only one needing both
          credentials at once.
        </p>
        <p className="ad-quiet">
          The desk at <a href="/desk">/desk</a> is still served. It goes to
          <code> archive/</code> once these panels have been driven in a browser
          against the checks that describe what it did: a port is finished when it does
          what the thing it replaced did, not when it renders, and those two look
          identical from here.
        </p>
      </Surface>
    </div>
  );
}
