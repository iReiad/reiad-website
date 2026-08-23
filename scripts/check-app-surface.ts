/* ============================================================
   check-app-surface.ts: does a table this site holds reach the
   app, or is it written down that it does not?

     node scripts/check-app-surface.ts
     node scripts/check-app-surface.ts --list

   THE RULE THIS EXISTS FOR

   `ANDROID.md` promises one thing above all others: **anything
   that is DATA reaches the Android app with no app release.** Add
   a school, a tool, a case study, a term, a count, a menu entry,
   and the app has it the next time it asks, because the app
   renders whatever the tables say and `/api/site` serialises
   those tables whole.

   That promise has exactly one failure mode, and it is silent.
   Somebody adds a fifteenth table to `shared/content.ts`, the
   site starts using it, every check passes, the site is correct,
   and the app never hears about it. No error, no red, no symptom
   until somebody opens the app months later and wonders why the
   new thing is missing.

   It is the same shape as the failure at the top of `CLAUDE.md`,
   one runtime along: the menu said in four places, agreeing
   because somebody remembered. The prose in `ANDROID.md` was that
   arrangement. This is the check.

   ---- what it asks ----

   Every `export const NAME` in the files `SOURCES` names whose
   name is a data table (SHOUTING_CASE) must either be imported by
   one of the endpoints in `ENDPOINTS`, which is what sends it to
   the app, or be named in `NOT_FOR_APP` below with a reason.

   Both lists are read from this file rather than assumed, because
   both have grown: `shared/nav.ts` arrived in `SOURCES` when the
   menu moved out of `next/lib/`, and `functions/api/tools.ts`
   arrived in `ENDPOINTS` when the calculators' 366 phrases became
   something the app fetches rather than bundles.

   The reason is the point, exactly as it is in `GONE`,
   `SERVER_ONLY`, `NOT_GLASS` and every other list in this
   repository: "the app does not need this" is a true sentence
   about several of these and is not an argument for the next one.

   ---- and the stale half ----

   An exemption for a table that has been deleted, or that the
   endpoint now sends anyway, is also a failure. A list is worth
   having only while it is true.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** A table the app deliberately does not get, and why. Keyed by
    name, carrying the reason, because the reason is what stops
    the next entry being added out of habit. */
const NOT_FOR_APP: Record<string, string> = {
  ARTICLES:
    "empty by design. Pieces have been rows in D1 since Stage 11.2 and "
    + "/api/articles is what answers for them.",
  COOKING: "the same, for the kitchen.",
  TRAVEL: "the same, for the travel section.",
  TERMS:
    "a flattening of TERM_GROUPS, which IS sent. The app can flatten a "
    + "list it already has.",
  READS:
    "SECTIONS minus insights, which the app can filter for itself out of "
    + "SECTIONS, which is sent.",
  COURSES:
    "derived from the `course` flag on SKILLS, which is sent. Nothing here "
    + "is the third-party catalogue, which is a different list entirely and "
    + "may never be published: see check-courses.ts.",
  SEARCH_GROUPS:
    "the headings the Ctrl+K palette groups its results under. Web chrome: "
    + "the app has its own search screen and its own grouping.",
  SCHOOL_ACCENTS:
    "the learning group's colours, derived from ACCENTS, which is sent whole.",
  TEMPLATES:
    "the two routines a reader can start from. Not sent YET, and this line "
    + "moves the day the app can create a routine: today it sends the reader "
    + "to the site for that, and the app's own ManifestSurfaceTest fails on a "
    + "field that is carried and never drawn.",
  FIRST_RUN: "which of TEMPLATES a new account gets, for the same reason.",
  SCHEMA:
    "the export file's version. The app can read a routine and cannot write "
    + "one, so nothing here has an export to stamp yet.",
  PRIVATE_TEMPLATES:
    "one person's real day, written out as a routine. It is the one table "
    + "here that must never leave, on the same grounds check-courses.ts "
    + "refuses the course catalogue: publishing it would not break "
    + "anything and would still be wrong. TEMPLATES, the two public ones, "
    + "IS sent.",
};

/* ---------- what the tables are ---------- */

/** `export const SHOUTING_CASE`. A table, rather than a function
    or a type: those are code and do not travel. */
const TABLE = /^export const ([A-Z][A-Z0-9_]*)\b/gm;

const tablesIn = (path: string): string[] => {
  const text = readFileSync(join(ROOT, path), "utf8");
  return [...text.matchAll(TABLE)].map((m) => m[1]);
};

const SOURCES = [
  "shared/content.ts",
  "shared/nav.ts",
  "shared/tool-strings.ts",
  /* The routine tool's tables. It arrived here when the
     Android app turned out to be carrying a Kotlin copy of
     the four moods, the six seasons and the five plants,
     which is exactly the shape of thing this check exists to
     find: a table the site holds, the app draws, and nothing
     sends. */
  "shared/routine.ts",
];
const tables = SOURCES.flatMap((path) => tablesIn(path).map((name) => ({ name, path })));

/* ---------- what the endpoint sends ---------- */

/* Read off the IMPORTS rather than the payload keys, deliberately.
   A payload key can be renamed for the app's convenience, and the
   question here is whether the table LEAVES this repository at
   all, which is what an import answers. */
/* More than one endpoint answers the app now, and the question
   this check asks is whether a table leaves the repository AT
   ALL, so it reads every one of them rather than the first.

   It was one path until `shared/tool-strings.ts` arrived, and a
   second endpoint listed nowhere would have made every table in a
   new file read as held back. The failure that shape produces is
   this check reporting a problem that is not one, which is worse
   than useless: it teaches a reader to add an exemption. */
const ENDPOINTS = ["functions/api/site.ts", "functions/api/tools.ts"];
const imported = new Set(
  ENDPOINTS.flatMap((path) =>
    [...readFileSync(join(ROOT, path), "utf8")
      .matchAll(/^import\s*\{([^}]+)\}\s*from\s*"[^"]*shared\/[^"]+"/gms)]
      .flatMap((m) => m[1].split(","))
      .map((name) => name.replace(/\s+as\s+.*/, "").trim())
      .filter((name) => /^[A-Z][A-Z0-9_]*$/.test(name))),
);

/* ---------- ask ---------- */

if (process.argv.includes("--list")) {
  console.log(`\nsent to the app by ${ENDPOINTS.join(" and ")}:\n`);
  for (const { name, path } of tables) {
    if (imported.has(name)) console.log(`  ->  ${name.padEnd(16)} ${path}`);
  }
  console.log("\nheld back, with a reason:\n");
  for (const { name } of tables) {
    if (!imported.has(name) && NOT_FOR_APP[name]) {
      console.log(`  --  ${name.padEnd(16)} ${NOT_FOR_APP[name]}`);
    }
  }
  console.log();
  process.exit(0);
}

let failures = 0;

const missing = tables.filter(({ name }) => !imported.has(name) && !(name in NOT_FOR_APP));
if (missing.length) {
  failures += missing.length;
  console.error(
    `\n${missing.length} table(s) this site holds that the app never hears about:\n`,
  );
  for (const { name, path } of missing) console.error(`  x ${name}\n        in ${path}`);
  console.error(
    "\n        ANDROID.md promises that anything which is DATA reaches the app"
    + "\n        with no app release, and /api/site keeps that promise by sending"
    + "\n        these tables. A new one is not sent until somebody says so."
    + `\n\n        Either import it in one of ${ENDPOINTS.join(", ")} and spread it`
    + "\n        into that payload,"
    + "\n        or add it to NOT_FOR_APP in this file with the reason it stays"
    + "\n        behind. A table nobody decided about is the silent half: the"
    + "\n        site is correct, every check passes, and the app is missing a"
    + "\n        feature nobody can see is missing.\n",
  );
}

const known = new Set(tables.map((t) => t.name));
const gone = Object.keys(NOT_FOR_APP).filter((name) => !known.has(name));
if (gone.length) {
  failures += gone.length;
  console.error(`\n${gone.length} exemption(s) for a table that no longer exists:\n`);
  for (const name of gone) console.error(`  x ${name}`);
  console.error("\n        Take it out. A list is worth having only while it is true.\n");
}

const sentAnyway = Object.keys(NOT_FOR_APP).filter((name) => imported.has(name));
if (sentAnyway.length) {
  failures += sentAnyway.length;
  console.error(`\n${sentAnyway.length} table(s) exempted and sent anyway:\n`);
  for (const name of sentAnyway) console.error(`  x ${name}`);
  console.error(
    "\n        The endpoint sends it, so the reason beside it in NOT_FOR_APP is"
    + "\n        describing a decision somebody has since reversed.\n",
  );
}

if (failures) process.exit(1);

const sent = tables.filter((t) => imported.has(t.name)).length;
console.log(
  `app surface: ${sent} table(s) reach the app through ${ENDPOINTS.length} endpoint(s), `
  + `${Object.keys(NOT_FOR_APP).length} held back on purpose.`,
);
