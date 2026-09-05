/* account-page.ts: the four jobs left on /account after nine
   sections became components under `next/components/account/`.
   Which half of the page shows, the `sync()` exchange every
   counter redraws off, take-a-copy, and leaving. The exchange
   must run before anything counts: localStorage is the account's
   mirror, so a number drawn first is the last visit's. */

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

/* The diet tool's six tables. `DIET.md` section 30: a table goes
   into the copy AND into the erase in the commit that creates it,
   and `diet_profile.meds` and `.cycle_tracking` are the two most
   sensitive columns in this database. `scripts/check-diet.ts`
   fails if this list stops matching the migration. */

const DIET_TABLES = [
  "diet_profile", "diet_days", "diet_entries",
  "diet_foods", "diet_phases", "diet_labs",
] as const;

/* The other four tables leaving has to carry, all the reader's
   own rows under the same row level security.
   `scripts/check-account.ts` reads the MIGRATIONS rather than
   this list: a reader-owned table nothing here names fails, and
   so does a name here that no table answers. */
/** The Research Studio's tables, RESEARCH.md section 23. Every
    one is the reader's own rows and every one goes into BOTH
    halves below in the commit that creates it, which is what
    `scripts/check-account.ts` reads this list for. */
const RESEARCH_TABLES = [
  "research_projects", "research_collections", "research_sources", "research_notes",
  "research_versions", "research_questions", "research_tasks", "research_lists",
  "research_activity", "research_highlights", "research_searches", "research_documents",
  "research_events", "research_sessions", "research_people", "research_reviews", "research_review_records",
  "research_datasets", "research_transforms", "research_runs",
  "research_participants", "research_codes", "research_codings", "research_surveys",
  "research_chunks",
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
  /* The owner's month plan, one row, the whole state as JSON. */
  "work_alpha_state",
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

/* 3. Taking a copy: everything, in one file, readable in a text
   editor. Assembled in the BROWSER out of the tables plus the
   mirror, because no server here could assemble one: Supabase
   answers tables and the Worker never sees a reader's rows. */

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
    "work_alpha_state",
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
