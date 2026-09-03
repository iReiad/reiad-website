#!/usr/bin/env node
/* ============================================================
   check-account.ts: leaving takes everything with it.

       node scripts/check-account.ts
       node scripts/check-account.ts --list

   Two buttons at the bottom of `/account` are the whole of what
   this site promises anybody who wants out: TAKE A COPY, which
   is one JSON file with everything in it, and ERASE EVERYTHING,
   which empties the account and the mirror. Both are in
   `aab/src/account-page.ts` and both are lists.

   ---- why a check and not a paragraph ----

   `DIET.md` section 30 already said it in prose: a table and its
   two halves of leaving go in THE SAME COMMIT, because a table
   added and its export added later are the same omission twice.
   The prose was there and it was broken anyway. On the day this
   was written, four of the reader's own tables were in neither
   button:

     routines          the shape of somebody's week
     routine_entries   a year of what they actually did with it
     broker_tokens     their broker key, sealed
     threads           the research desk, added the same day

   Nothing was wrong with any of it. Both buttons worked, the
   copy downloaded, the erase reported success, and what came
   back was five sixths of an account. An export that is silently
   short and an export that is complete look identical: that is
   the whole reason this is a check rather than a habit.

   ---- what it asks ----

   1. Is every table the reader OWNS carried by both halves?
      A table with a `user_id` referencing `auth.users` is the
      reader's own rows. Each one names, in CARRIED below, the
      symbol in `account-page.ts` that carries it and the symbol
      that erases it, and the check reads that file for both.

   2. Is a reason still true? A table in CARRIED that no
      migration creates fails, and so does a NOT_MINE or a
      NOT_ERASED naming a table that is gone. `GONE` in
      `check-pointers.ts` is keyed by two things for the same
      reason: a stale exemption is an exemption that stops
      guarding something.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");

const PAGE = readFileSync(join(ROOT, "aab", "src", "account-page.ts"), "utf8");
const SYNC = readFileSync(join(ROOT, "aab", "src", "sync.ts"), "utf8");

/** How one table reaches the copy and the erase. Each value is a
    symbol that has to appear in `aab/src/account-page.ts`: not a
    description of what happens, but the name of the thing that
    makes it happen, so that renaming it fails here. */
const CARRIED: Record<string, { copy: string; erase?: string; how?: string }> = {
  progress: {
    copy: "SYNCED_KEYS",
    erase: "forgetOnAccount",
    how: "the mirror. The copy reads every synced key out of localStorage rather "
      + "than the table, because that IS the table after an exchange, and "
      + "`forgetOnAccount` deletes the rows and clears the mirror in one go.",
  },
  library: { copy: "listLibrary", erase: "removeLibraryRow" },
  targets: { copy: "listTargets", erase: "removeTarget" },
  scenarios: { copy: "listScenarios", erase: "removeScenario" },

  diet_profile: { copy: "DIET_TABLES", erase: "DIET_TABLES" },
  diet_days: { copy: "DIET_TABLES", erase: "DIET_TABLES" },
  diet_entries: { copy: "DIET_TABLES", erase: "DIET_TABLES" },
  diet_foods: { copy: "DIET_TABLES", erase: "DIET_TABLES" },
  diet_phases: { copy: "DIET_TABLES", erase: "DIET_TABLES" },
  diet_labs: { copy: "DIET_TABLES", erase: "DIET_TABLES" },

  /* The Research Studio, RESEARCH.md section 23: one constant
     spread into both halves, so a tenth table is one line. */
  research_projects: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_collections: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_sources: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_notes: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_versions: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_questions: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_tasks: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_lists: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_activity: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_highlights: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_searches: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_documents: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_events: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_sessions: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_people: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_reviews: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_review_records: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_datasets: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_transforms: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_runs: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_participants: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_codes: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_codings: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_surveys: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  research_chunks: { copy: "MINE_TABLES", erase: "RESEARCH_TABLES" },
  routines: { copy: "MINE_TABLES", erase: '"routines"' },
  routine_templates: {
    copy: "MINE_TABLES",
    erase: '"routine_templates"',
    how: "only the ones this reader MADE. The site ships templates in the same "
      + "table with no owner at all, so the filter is `owner_id` rather than "
      + "`user_id`: `OWNER` in account-page.ts is that one entry, and a delete "
      + "on the wrong column would have taken the site's own templates with it.",
  },
  routine_entries: { copy: "MINE_TABLES", erase: '"routine_entries"' },
  profiles: {
    /* The field in the bundle, not the function that fills it:
       `getProfile()` is called on boot for the page's own use and
       would still be there with the field gone. */
    copy: "profile,",
    /* No `erase`, because there is none: see NOT_ERASED. */
    how: "the display name. See NOT_ERASED for the other half.",
  },
  broker_tokens: {
    copy: '"broker_tokens"',
    erase: '"broker_tokens"',
    how: "the copy takes every column but `cipher`, which is AES-GCM under a "
      + "Worker secret: bytes nobody holding the file can open, and a credential "
      + "in a downloaded file is worth nothing to its owner. `COLUMNS` is that "
      + "list. The erase takes the whole row, which is the half that matters.",
  },
};

/** Reader-owned by the letter of the rule below and deliberately
    not this button's, with the reason. */
const NOT_MINE: Record<string, string> = {
  admins: "a GRANT rather than data. It is written in SQL only, has no write "
    + "policy at all, and a reader who could erase it could also erase somebody "
    + "else's. Leaving does not revoke your own admin rights; a person with the "
    + "database does.",
};

/** Carried by the copy and deliberately NOT erased, with the
    reason. This is the shorter list on purpose: an entry here is
    something a reader asked to be rid of and is not. */
const NOT_ERASED: Record<string, string> = {
  profiles: "the display name, and it is what puts an author beside a comment "
    + "that is already published. Erasing it would leave those comments "
    + "attributed to nobody rather than removing them, which is worse than "
    + "leaving the name: a comment lives in D1 behind the moderation queue and "
    + "is not this button's to delete. The copy carries it as `profile`.",
};

/* ---------- what a reader owns ---------- */

const DIR = join(ROOT, "supabase", "migrations");
const sql = readdirSync(DIR).filter((f) => f.endsWith(".sql")).sort()
  .map((f) => readFileSync(join(DIR, f), "utf8")).join("\n")
  .replace(/^\s*--.*$/gm, "");

/** A table, and the body of its create statement. */
const created = new Map<string, string>();
for (const m of sql.matchAll(
  /create table (?:if not exists )?public\.([a-z_]+)\s*\(([\s\S]*?)\n\);/g)) {
  if (!created.has(m[1])) created.set(m[1], m[2]);
}
/* A table a later migration DROPPED is not the reader's any more,
   and a check that went on demanding it be carried would demand
   a copy of nothing. `threads` was the first: the research desk's
   one table, carried into `research_questions` and dropped in the
   same file. */
for (const m of sql.matchAll(/drop table (?:if exists )?public\.([a-z_]+)/g)) {
  created.delete(m[1]);
}

/* THE RULE, and it is one line: a column named `user_id` pointing
   at `auth.users` means these rows belong to a person and leaving
   has to carry them. `owner_id` counts too, because it is the
   same fact spelled differently and a check that read the
   spelling rather than the meaning would be the accident it
   exists to catch. `profiles` uses `id` and is asked about by
   name below; `admins` references auth.users through a column
   that is neither, which is right, because it is a grant. */
const mine = [...created]
  .filter(([, body]) => /\b(?:user_id|owner_id)\b[^,]*references auth\.users/.test(body))
  .map(([table]) => table)
  .sort();

/* `profiles` is reader-owned by every reading except the column
   name, and it is in the copy, so it is asked about here rather
   than falling outside the rule by an accident of spelling. */
const asked = [...new Set([...mine, "profiles"])].sort();

/** What a named list actually holds.

    THE CHECK WAS WORTH NOTHING WITHOUT THIS. A carrier named
    `MINE_TABLES` was asked for by asking whether the page
    contains that string, which it does whatever is inside it: a
    table deleted from the list passed, cheerfully, because the
    list still existed. What a check reports and what it looks at
    are two things, and this is the difference. */
const holds = (name: string): Set<string> | null => {
  if (!/^[A-Z_]+$/.test(name)) return null;
  /* Declared HERE, or it is somebody else's list and all this
     file can honestly say is whether it names it: `SYNCED_KEYS`
     is `sync.ts`'s and is a list of storage keys rather than of
     tables. */
  const body = PAGE.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\]`))?.[1];
  if (body === undefined) return null;
  const names = new Set([...body.matchAll(/"([a-z_]+)"/g)].map((m) => m[1]));
  /* A list spread into this one is held by this one. `MINE_TABLES`
     opens with `...RESEARCH_TABLES`, so that the nine names are
     written once and the erase loop spreads the same list. */
  for (const m of body.matchAll(/\.\.\.([A-Z_]+)/g)) for (const t of holds(m[1]) ?? []) names.add(t);
  return names;
};

/* THE TWO HALVES, AS TWO REGIONS. Grepping the whole file was
   the second thing wrong with this check: `"broker_tokens"` is
   in the copy as well as in the erase, so taking it out of the
   erase loop left the string in the file and the check said
   nothing. A carrier has to be named in the half that is
   supposed to do the carrying. */
const region = (from: RegExp, to: string): string => {
  const at = PAGE.search(from);
  if (at < 0) return "";
  const end = PAGE.indexOf(to, at);
  return PAGE.slice(at, end < 0 ? undefined : end + to.length);
};
const COPY = region(/async function exportEverything/, "\n}");
const ERASE = region(/\$\("#account-forget"\)\?\.addEventListener/, "\n});");

/** Does `where` carry `table` through `name`? A list carries what
    is in it AND has to be named in that half; anything else
    carries whatever that half names. */
const carries = (name: string, table: string, where: string): boolean => {
  const list = holds(name);
  if (list) return list.has(table) && where.includes(name);
  return where.includes(name);
};

/** Which of the two failures this is, so the message says the
    one that happened. */
const missing = (name: string, table: string): string =>
  holds(name)?.has(table) === false
    ? `\`${name}\` no longer holds it`
    : `\`${name}\` is not named there`;

let bad = 0;
const fail = (line: string, ...detail: string[]): void => {
  bad += 1;
  console.error(`\n  x ${line}`);
  for (const d of detail) console.error(`        ${d}`);
};

for (const table of asked) {
  if (table in NOT_MINE) continue;
  const at = CARRIED[table];
  const spared = NOT_ERASED[table];

  if (!at) {
    fail(`public.${table} is the reader's own and leaving does not carry it.`,
      "Nothing in aab/src/account-page.ts names it, so `take a copy of",
      "everything` writes a file without it and `erase everything` leaves it",
      "behind. Both halves, in this commit: add it to MINE_TABLES and to the",
      "erase loop, then name it in CARRIED here. A table that genuinely should",
      "not be erased goes in NOT_ERASED with the reason.");
    continue;
  }

  if (!carries(at.copy, table, COPY)) {
    fail(`public.${table} is not in the copy: ${missing(at.copy, table)}.`,
      "Either the copy stopped carrying it or the thing that carries it was",
      "renamed. A renamed carrier is a one-word fix here; a dropped one is a",
      "reader leaving without their rows.");
  }

  if (spared) {
    if (at.erase) {
      fail(`public.${table} is in NOT_ERASED and CARRIED names \`${at.erase}\` to erase it.`,
        "One of the two is now wrong. If it is erased, drop the exemption.");
    }
    continue;
  }

  if (!at.erase) {
    fail(`public.${table} names nothing that erases it and is not in NOT_ERASED.`,
      "Every reader-owned table is cleared by `erase everything` or says in one",
      "sentence why it is not.");
  } else if (!carries(at.erase, table, ERASE)) {
    fail(`public.${table} is not in the erase: ${missing(at.erase, table)}.`,
      "`Erase everything` names what it takes and a reader agreed to that",
      "sentence. A table it silently leaves behind is the one failure on this",
      "page nobody can see.");
  }
}

/* ---------- and the reasons, both ways ---------- */

for (const table of Object.keys(CARRIED)) {
  if (created.has(table)) continue;
  fail(`CARRIED names public.${table} and no migration creates it.`,
    "A row here that reaches no table is a table this check believes it is",
    "guarding and is not.");
}
for (const [table, why] of [...Object.entries(NOT_MINE), ...Object.entries(NOT_ERASED)]) {
  if (created.has(table)) continue;
  fail(`an exemption names public.${table} and no migration creates it.`,
    why.slice(0, 70) + "…");
}

if (!COPY || !ERASE) {
  fail("aab/src/account-page.ts no longer has both halves where this expects them.",
    "`exportEverything` and the `#account-forget` handler are what every row",
    "above is read against, so a rename here turns this whole check into a",
    "green tick that looks at nothing.");
}

/* ---------- the sentence a reader agreed to ----------

   `erase everything` puts up a confirm naming what goes, and a
   reader pressing OK agreed to THAT sentence rather than to a
   list in a source file. The four words below are each a table
   that was silently left behind before this check existed, so
   the confirm has to keep naming them. */
const CONFIRM = PAGE.match(/confirm\(([\s\S]*?)\)\)\s*return;/)?.[1] ?? "";
for (const word of ["research", "routine", "template", "broker", "diet"]) {
  if (CONFIRM.toLowerCase().includes(word)) continue;
  fail(`the erase clears something the confirm does not name: "${word}".`,
    "A confirm that lists five of six things is a reader agreeing to",
    "something else.");
}

/* ---------- what the mirror carries ----------

   `progress` is the one table the copy reads out of localStorage
   instead, so the two have to agree about what a synced key is. */
if (!SYNC.includes("SYNCED_KEYS")) {
  fail("aab/src/sync.ts no longer exports SYNCED_KEYS.",
    "That is what the copy walks to gather the mirror, so the progress half of",
    "a downloaded account would be empty and nothing would say so.");
}

/* ---------- and the files, which are not rows ----------

   The reading room's files are bytes in R2 under the reader's
   prefix, and no migration names them, so the rule above cannot
   see them. RESEARCH.md section 23: the erase calls
   DELETE /api/research/files after the rows are gone, so leaving
   takes the files too. This is the question that says it does. */
if (!/fetch\(\s*"\/api\/research\/files"[\s\S]{0,200}method:\s*"DELETE"/.test(ERASE)) {
  fail("the erase does not call DELETE /api/research/files.",
    "The reading room's files live in R2 under the reader's prefix and no",
    "row-level policy reaches them: a reader who erased everything would",
    "leave every PDF they uploaded behind, and nothing would say so.");
}

if (LIST) {
  console.log("\nwhat leaving carries\n");
  for (const table of asked) {
    if (table in NOT_MINE) {
      console.log(`  --  ${table.padEnd(17)}not the reader's: ${NOT_MINE[table]}`);
      continue;
    }
    const at = CARRIED[table];
    const erase = NOT_ERASED[table] ? "kept on purpose" : at?.erase ?? "?";
    console.log(`  ok  ${table.padEnd(17)}copy ${(at?.copy ?? "?").padEnd(18)}erase ${erase}`);
    if (at?.how) console.log(`      ${" ".repeat(17)}${at.how}`);
    if (NOT_ERASED[table]) console.log(`      ${" ".repeat(17)}${NOT_ERASED[table]}`);
  }
  console.log("");
}

if (bad) {
  console.error(`\naccount: ${bad} problem(s).\n`);
  process.exit(1);
}
console.log(`account: ${asked.length} table(s) a reader owns, `
  + `every one carried by the copy and by the erase `
  + `(${Object.keys(NOT_ERASED).length} kept on purpose, `
  + `${Object.keys(NOT_MINE).length} not the reader's).`);
