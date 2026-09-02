/* ============================================================
   account-page.ts: what is left of the account page.

   Nine sections of this page were drawn from here and are
   components under `next/components/account/` now. Four jobs
   remain, and each is here for a reason rather than because it
   has not been got to yet:

     1. WHICH HALF OF THE PAGE SHOWS. `#account-out` and
        `#account-in` are two branches of one route, and which one
        a reader gets is not a fact the server has: it is a token
        in this browser. Both start hidden and this reveals one.
     2. THE EXCHANGE, and the sentence about it. `sync()` writes
        the account's rows on to this device, and every component
        that counts anything redraws on the `sync:done` it fires.
        Something has to start it, once, and this is the only
        script the page loads.
     3. TAKE A COPY. One button, one blob, and it needs the whole
        account at once, which no single component has.
     4. LEAVING: sign out, and erase everything.

   THE ORDER IN (2) IS LOAD-BEARING AND IS THE OPPOSITE OF WHAT IT
   WAS. This page used to count localStorage immediately and
   correct itself when the network answered, because localStorage
   was a real second record that might be ahead of the account. It
   is the account's MIRROR now, so anything drawn before the
   exchange is the last visit's numbers, about to move.

   THE RULE THE PAGE IS STILL BUILT AROUND, wherever the drawing
   lives: nothing is asked for that the site does not then use,
   and nothing is shown that the site cannot measure.
   ============================================================ */

import {
  current, signOut, getProfile, token,
  SUPABASE_URL, SUPABASE_KEY, type Profile,
} from "/account.js";
import { sync, forgetOnAccount, SYNCED_KEYS } from "/sync.js";
import {
  listScenarios, removeScenario,
  listTargets, removeTarget,
  listLibrary, removeLibraryRow,
} from "/saved.js";
import { today } from "/streak.js";

const $ = <T extends HTMLElement = HTMLElement>(sel: string): T | null =>
  document.querySelector<T>(sel);

const say = (node: HTMLElement | null, text?: string | null, state?: string): void => {
  if (!node) return;
  node.textContent = text ?? "";
  if (state) node.dataset.state = state;
  else delete node.dataset.state;
};

/* ============================================================
   1. Which half of the page shows, and who it greets
   ============================================================ */

function paintIdentity(): void {
  const user = current();
  $("#account-out")!.hidden = !!user;
  $("#account-in")!.hidden = !user;
  if (!user) return;

  $("#account-hello")!.textContent = user.name ? `Hello, ${user.name}.` : "Hello.";
  $("#account-email")!.textContent = user.email ?? "";

  const face = $("#account-face");
  if (!face) return;

  /* The initial always, and the provider's picture over it when
     there is one. Two children of one grid cell rather than one
     or the other, so a picture that fails to load falls back to
     the letter instead of to an empty circle: an avatar URL
     outlives nothing, and Google rotates them.

     `referrerPolicy` because the host serving the picture has no
     business being told which page of this site it is on. */
  face.replaceChildren((user.name ?? "?").trim().charAt(0).toUpperCase() || "?");
  if (!user.avatar) return;
  const img = document.createElement("img");
  img.src = user.avatar;
  img.alt = "";
  img.decoding = "async";
  img.referrerPolicy = "no-referrer";
  img.addEventListener("error", () => img.remove());
  face.append(img);
}

/* ============================================================
   The diet tool's six tables

   `DIET.md` section 30: the six tables go into the copy and into
   the erase IN THE SAME COMMIT THAT CREATES THEM, and the erase
   is the more important half. `diet_profile.meds` and
   `diet_profile.cycle_tracking` are the two most sensitive
   columns in this database, and a "take a copy of everything"
   that leaves them behind and an "erase everything" that leaves
   them in place are the same omission twice.

   Read and deleted here rather than through `saved.js`, because
   nothing on this page draws a diet row: it needs them whole,
   once, which is what an export is. Every one is keyed
   `user_id`, and the row level security means a read with no
   filter would return this reader's rows anyway; the filter is
   there for the reason `saved.js` gives beside `mine()`.

   `scripts/check-diet.ts` fails if this list stops matching the
   migration, because section 30 says in as many words that this
   is the half that will rot first.
   ============================================================ */

const DIET_TABLES = [
  "diet_profile", "diet_days", "diet_entries",
  "diet_foods", "diet_phases", "diet_labs",
] as const;

/* ============================================================
   The other four tables leaving has to carry

   Every one of these is the reader's own rows under the same row
   level security, and none of them had a module on this page
   that read them whole: the routine's dashboard draws a day at a
   time, the desk draws a thread at a time, and the broker key is
   only ever unsealed inside a Worker. So all four were absent
   from "take a copy of everything" AND from "erase everything",
   which is the failure the diet block above already names: a
   table added and its two halves of leaving added later are the
   same omission twice.

   `scripts/check-account.ts` is what holds it now, and it reads
   the migrations rather than this list: a reader-owned table
   nothing here names fails, and a name here that no table
   answers fails too. */
/** The Research Studio's tables, RESEARCH.md section 23. Every
    one is the reader's own rows and every one goes into BOTH
    halves below in the commit that creates it, which is what
    `scripts/check-account.ts` reads this list for. */
const RESEARCH_TABLES = [
  "research_projects", "research_collections", "research_sources", "research_notes",
  "research_versions", "research_questions", "research_tasks", "research_lists",
  "research_activity", "research_highlights", "research_searches", "research_documents",
  "research_events", "research_sessions",
] as const;

const MINE_TABLES = [
  ...RESEARCH_TABLES,
  /* The routine: the shape of somebody's week, and a year of what
     they actually did with it. The second is the bigger loss of
     the two and was the one nothing carried. */
  "routines", "routine_entries",
  /* A template somebody MADE. The site ships several in the same
     table with no owner at all, and the filter below is what
     keeps those out of a copy and, far more importantly, out of
     an erase. */
  "routine_templates",
] as const;

/** Which column says whose row it is, where it is not `user_id`.
    One entry, and it is the reason this is a table rather than a
    literal: a filter on the wrong column is a DELETE that either
    matches nothing or matches everything, and the second is what
    would take the site's own routine templates away. */
const OWNER: Record<string, string> = {
  routine_templates: "owner_id",
};

/** What a copy takes from a table, where taking all of it would
    be wrong. The broker key is the only one: `cipher` is AES-GCM
    under a Worker secret, so it is bytes nobody holding the file
    can open, and a credential in a downloaded file is worth
    nothing to its owner and is one more place it exists. The
    rest of the row is the useful half: which broker, what it was
    called, and whether it was the live account or the demo. */
const COLUMNS: Record<string, string> = {
  broker_tokens: "broker,label,env,created_at,updated_at",
};

/** One request against one of the reader's own tables. Null when
    nobody is signed in and on any failure, so a copy is never
    silently short: the caller turns a null into a thrown error
    rather than into an empty list. */
async function readerTable(
  table: string, method: "GET" | "DELETE",
): Promise<unknown[] | null> {
  const access = await token();
  const who = current();
  if (!access || !who) return null;
  const select = method === "GET" ? `&select=${COLUMNS[table] ?? "*"}` : "";
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/${table}`
    + `?${OWNER[table] ?? "user_id"}=eq.${encodeURIComponent(who.id)}${select}`,
    {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
        ...(method === "DELETE" ? { Prefer: "return=minimal" } : {}),
      },
    },
  );
  if (!res.ok) return null;
  if (method === "DELETE" || res.status === 204) return [];
  return await res.json() as unknown[];
}

/* ============================================================
   3. Taking a copy

   Everything, in one file, readable in a text editor. Not an
   export button that produces something only this site can read:
   the whole argument for an account on a site like this one is
   that leaving is as easy as arriving.

   It is assembled in the browser out of the tables plus the
   mirror, rather than by asking the server for a bundle, because
   there is no server here that could assemble one: Supabase
   answers tables and the Worker never sees a reader's rows at
   all.
   ============================================================ */

let profile: Profile | null = null;

async function exportEverything(): Promise<void> {
  const button = $<HTMLButtonElement>("#account-export")!;
  const note = $("#exit-note");
  button.disabled = true;
  say(note, "Gathering it up…");

  try {
    const [scenarios, targets, rows] = await Promise.all([
      listScenarios(), listTargets(), listLibrary(),
    ]);

    /* The diet tool, whole. A table that answered with a failure
       throws rather than landing in the file as `[]`: an empty
       list and a list that could not be read look identical in
       JSON, and the second one is somebody leaving without their
       log. */
    const dietRows = await Promise.all(
      DIET_TABLES.map((table) => readerTable(table, "GET")),
    );
    const diet: Record<string, unknown[]> = {};
    DIET_TABLES.forEach((table, i) => {
      const got = dietRows[i];
      if (got === null) throw new Error(`Could not read ${table}. Nothing was downloaded.`);
      diet[table] = got;
    });

    /* The four above, on the same terms: a table that answered
       with a failure throws rather than landing in the file as
       an empty list. */
    const otherTables = [...MINE_TABLES, "broker_tokens"];
    const otherRows = await Promise.all(
      otherTables.map((table) => readerTable(table, "GET")),
    );
    const mine: Record<string, unknown[]> = {};
    otherTables.forEach((table, i) => {
      const got = otherRows[i];
      if (got === null) throw new Error(`Could not read ${table}. Nothing was downloaded.`);
      mine[table] = got;
    });

    /* Every synced key, whatever it is, rather than the eleven a
       reader is shown a count of. `components/account/mirror.ts`
       is that other list and this deliberately does not share it:
       a copy of somebody's account that quietly left a key out
       because nothing draws it would be the worst kind of wrong. */
    const progress: Record<string, unknown> = {};
    for (const key of SYNCED_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) progress[key] = JSON.parse(raw);
      } catch { /* a half-written value is nothing to take a copy of */ }
    }

    const bundle = {
      what: "Everything Reiad's Library holds for this account.",
      taken: new Date().toISOString(),
      account: { name: current()?.name ?? "", email: current()?.email ?? "" },
      profile,
      progress,
      library: rows,
      targets,
      scenarios,
      diet,
      /* Spread rather than nested under a name of its own, so
         `threads` sits beside `targets` and `scenarios` the way a
         reader opening the file would expect. `broker_tokens`
         comes without its ciphertext: `COLUMNS` says why. */
      ...mine,
    };

    /* A blob and an object URL, revoked immediately after the
       click: a data: URL of the same thing would be governed by
       the page's own navigation policy and is capped at a few
       megabytes in some browsers, and this bundle has no ceiling
       anybody has measured. */
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reiad-library-${today()}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    say(note, "Downloaded. It is yours: nothing about that file is sent anywhere.", "ok");
  } catch (err) {
    say(note, (err as Error).message || "That did not work.", "warn");
  } finally {
    button.disabled = false;
  }
}

/* ============================================================
   2. The exchange
   ============================================================ */

async function boot(): Promise<void> {
  paintIdentity();
  if (!current()) return;

  say($("#account-synced"), "Reading your account…");
  const done = await sync();
  say($("#account-synced"), done
    ? "Up to date with your other devices, as of a moment ago."
    : "Could not reach your account just now, so this is the last copy this "
      + "device saw.");

  /* The profile row, for the bundle above. Nothing on this page is
     painted from it any more: every component that shows part of
     the profile reads it off the `profile:changed` this
     dispatches. Awaited here so a copy is never taken without a
     name in it. */
  profile = await getProfile();
}

/* ============================================================
   4. Leaving
   ============================================================ */

$("#account-signin")?.addEventListener("click", () => {
  document.querySelector<HTMLButtonElement>(".account-btn")?.click();
});

$("#account-export")?.addEventListener("click", exportEverything);

$("#account-signout")?.addEventListener("click", async () => {
  await signOut();
  paintIdentity();
});

$("#account-forget")?.addEventListener("click", async () => {
  const note = $("#exit-note");
  /* The sentence names what actually goes, because a confirm
     that lists five of six things is a reader agreeing to
     something else. The diet half is spelled out rather than
     folded into "everything": it is the only place on this site
     holding a weight, a medicine or a cycle. */
  if (!confirm("Erase everything this account has saved?\n\n"
    + "Your position, your checkpoints, your reading list, your notes, your "
    + "targets, your saved scenarios, everything in your research studio "
    + "(sources, files, highlights, notes, questions, tasks and lists), your routines "
    + "and every day you have marked on them, the templates you made, and "
    + "your broker key.\n\n"
    + "And everything in the diet tool: your daily log, everything you have "
    + "eaten, your own foods and recipes, your phases, your clinic results, "
    + "and your diet profile, which is where your medicines and cycle "
    + "tracking are kept.\n\nThis cannot be undone.")) return;

  const button = $<HTMLButtonElement>("#account-forget")!;
  button.disabled = true;
  say(note, "Erasing…");

  let gone = await forgetOnAccount();
  try {
    await Promise.all([
      ...(await listTargets()).map((t) => removeTarget(t.id)),
      ...(await listScenarios()).map((s) => removeScenario(s.id)),
      ...(await listLibrary()).map((r) => removeLibraryRow(r.id)),
    ]);
  } catch (err) {
    console.warn("account: could not remove everything", err);
    gone = false;
  }

  /* One DELETE per diet table, filtered on the reader. Sequential
     rather than in parallel, because a failure has to be reported
     as one: `gone` going false is what turns the sentence below
     into "some of that did not work", and a reader told their
     medicines are erased when they are not is the worst answer
     this page can give. */
  for (const table of DIET_TABLES) {
    if (await readerTable(table, "DELETE") === null) {
      console.warn("account: could not erase", table);
      gone = false;
    }
  }

  /* The other four, on the same terms and for the same reason.
     `routine_entries` before `routines` is not required, since
     the foreign key cascades, but a delete that leaves entries
     behind for a moment is a delete somebody could interrupt. */
  for (const table of [
    "routine_entries", "routines", "routine_templates", ...RESEARCH_TABLES, "broker_tokens",
  ]) {
    if (await readerTable(table, "DELETE") === null) {
      console.warn("account: could not erase", table);
      gone = false;
    }
  }

  /* The reading room's files are bytes in R2 rather than rows, so
     no policy above reaches them: the Worker removes everything
     under the reader's prefix. After the rows, so a reader who
     interrupts this is left with rows pointing at files rather
     than files nothing points at. */
  try {
    const access = await token();
    const res = access
      ? await fetch("/api/research/files", { method: "DELETE", headers: { Authorization: `Bearer ${access}` } })
      : null;
    if (!res || !(res.ok || res.status === 503)) { console.warn("account: could not erase the research files"); gone = false; }
  } catch { gone = false; }

  say(note, gone
    ? "Erased. Nothing of yours is stored on this account or on this device."
    : "Some of that did not work. Reload and try again.", gone ? "ok" : "warn");

  /* The sections this file does not draw hear about it here.

     `components/account/` reads the same rows and cannot know that
     a button in this file has just emptied them. `forgetOnAccount()`
     clears the mirror and fires the school events, which covers
     everything counted out of localStorage; this covers the four
     that are Supabase tables. */
  document.dispatchEvent(new CustomEvent("account:refresh"));

  button.disabled = false;
});

document.addEventListener("account:changed", () => {
  paintIdentity();
  if (current()) boot();
});

boot();
