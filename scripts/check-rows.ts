#!/usr/bin/env node
/* ============================================================
   check-rows.ts: does `shared/rows.ts` still describe this
   database, and do the handlers still agree with it?

       node scripts/check-rows.ts

   archive/TRANSITION.md Stage 12, step 1. `shared/rows.ts` is the one
   description of what a row of this database is, and a
   description is worth exactly what checks it. Two ways it can
   quietly stop being true, and this is both of them:

   1. **A column is added, renamed or dropped in `schema.sql`**
      and the interface in `rows.ts` still says what used to be
      there. Nothing fails: a row is `any` on the way out of D1
      today, and a type that lies is worse than no type, because
      it is believed.

   2. **A handler keeps its own copy of a vocabulary.** Four of
      them did, which is why `rows.ts` exists: the comment states
      are `pending`, `live` and `binned`, and the first draft of it
      said `approved` and `spam`, which are what those words would
      be if anybody had chosen them fresh and are not what the
      column holds. That was caught by comparing the two.
      The handlers import the vocabulary now, so the question
      flipped: nothing under `functions/` may write out a list
      `shared/rows.ts` already holds.

   ---- what it deliberately does not do ----

   It does not parse TypeScript. It reads the interfaces as text
   and compares the property names against the columns in
   `aab/schema.sql`, which is enough to catch a column that moved
   and cheap enough to run beside the other checks. Types are
   checked by `tsc` in `next/`, and that is a different question:
   `tsc` proves the code agrees with the description, this proves
   the description agrees with the database.
   ============================================================ */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { LADDER_SCHOOLS } from "../next/lib/nav.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

/* ------------------------------------------------------------
   1. Every table has a description, and every description has a
      table
   ------------------------------------------------------------ */

const schema = read("aab/schema.sql");
const { TABLES, ...vocab } = await import("../shared/rows.ts");

/** The columns of one table, in the order the schema declares
    them. Deliberately dumb: the block between the parentheses,
    split on commas that are not inside brackets, first word of
    each line that is not a constraint. */
function columnsOf(table: string): string[] | null {
  const re = new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\(([\\s\\S]*?)\\n\\);`, "i");
  const block = schema.match(re)?.[1];
  if (!block) return null;
  return block
    .split("\n")
    .map((line) => line.replace(/--.*$/, "").trim())
    .filter(Boolean)
    .map((line) => line.split(/\s+/)[0])
    .filter((word) => /^[a-z_]+$/.test(word) && !["primary", "foreign", "unique", "check"].includes(word));
}

const inSchema = [...schema.matchAll(/CREATE TABLE IF NOT EXISTS (\w+)/g)].map((m) => m[1]);

for (const table of inSchema) {
  if (!(table in TABLES)) {
    fail(`aab/schema.sql has a table shared/rows.ts does not describe: ${table}`,
      "Add it to TABLES, with one sentence on what it is for.");
  }
}
for (const table of Object.keys(TABLES)) {
  if (!inSchema.includes(table)) {
    fail(`shared/rows.ts describes a table that is not in aab/schema.sql: ${table}`);
  }
}

/* ------------------------------------------------------------
   2. Every interface names the columns its table has
   ------------------------------------------------------------ */

/* The interfaces and the constants are the same file now.

   They were `rows.d.ts` and `rows.js`, which is the split
   TypeScript forces on a JavaScript module that wants types, and
   the reason this check read the `.d.ts` rather than the module it
   describes. `shared/rows.ts` is TypeScript, so there is one file
   and this reads it. The parsing below is unchanged: it still
   matches `export interface <Name> {` as text, which that file
   still writes one per line exactly as the declaration file did. */
const types = read("shared/rows.ts");

/** The property names of one interface, as written. */
function propsOf(name: string): string[] | null {
  const block = types.match(new RegExp(`export interface ${name} \\{([\\s\\S]*?)\\n\\}`))?.[1];
  if (block === undefined) return null;
  return [...block.matchAll(/^\s{2}(\w+)\??:/gm)].map((m) => m[1]);
}

/* Which interface describes which table. Written out rather than
   guessed from the name, because `articles` is `ArticleRow` and
   `article_versions` is `ArticleVersionRow` and a rule that
   turned one into the other would turn the other into something
   else. */
const DESCRIBES = {
  articles: "ArticleRow",
  article_versions: "ArticleVersionRow",
  questions: "QuestionRow",
  comments: "CommentRow",
  subscribers: "SubscriberRow",
  enquiries: "EnquiryRow",
  views: "ViewRow",
  reactions: "ReactionRow",
  sessions: "SessionRow",
  settings: "SettingRow",
  throttle: "ThrottleRow",
  school_stages: "SchoolStageRow",
  school_sections: "SchoolSectionRow",
  school_lessons: "SchoolLessonRow",
};

let described = 0;

for (const [table, iface] of Object.entries(DESCRIBES)) {
  const columns = columnsOf(table);
  const props = propsOf(iface);
  if (!columns) { fail(`no CREATE TABLE for ${table} in aab/schema.sql`); continue; }
  if (!props) { fail(`no interface ${iface} in shared/rows.d.ts`); continue; }

  for (const column of columns) {
    if (!props.includes(column)) {
      fail(`${iface} does not describe ${table}.${column}`,
        `The schema has it and the interface does not, so anything reading`,
        `that column is untyped without saying so.`);
    }
  }
  for (const prop of props) {
    if (!columns.includes(prop)) {
      fail(`${iface} describes ${table}.${prop}, which the schema does not have`,
        "A description of a column that is not there is believed and is wrong.");
    }
  }
  described += columns.length;
}

/* ------------------------------------------------------------
   3. No handler keeps its own copy of a vocabulary
   ------------------------------------------------------------ */

/* This section used to do the opposite. Every handler had its own
   inline array of allowed values, so the check compared the two
   and reported a difference: that is how the comment states in
   `rows.js` came to be `live` and `binned` rather than the
   tidier words somebody would pick fresh.

   The arrays are gone, the handlers import the vocabulary, and
   the question worth asking flipped with them. A second copy that
   agrees today is the thing that drifts, and the four that were
   here are the reason this file exists at all. So: nothing under
   `functions/` may write out a list that `shared/rows.ts`
   already holds.

   Deliberately a text search rather than anything cleverer. A
   handler that builds the same list some other way will not be
   caught, and a handler that pastes it back in will be, which is
   the way it actually happens. */

const HANDLERS = [
  "functions/api/articles/[[slug]].js",
  "functions/api/comments/[[id]].js",
  "functions/api/questions/[[id]].js",
  "functions/api/enquiries/[[id]].js",
  "functions/api/subscribers/[[route]].js",
  "functions/api/schools/[[route]].js",
];

let scanned = 0;

for (const file of HANDLERS) {
  const src = read(file);
  scanned += 1;

  for (const [name, values] of Object.entries(vocab)) {
    if (!Array.isArray(values) || values.length < 2) continue;

    /* The list as a handler would paste it, in either quote
       style, allowing for whitespace between the entries. */
    const pattern = new RegExp(
      `\\[\\s*["']${values.map((v) => v.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join(`["']\\s*,\\s*["']`)}["']\\s*\\]`
    );

    if (pattern.test(src)) {
      fail(`${file} writes out ${name} instead of importing it`,
        `shared/rows.ts holds ${JSON.stringify(values)}.`,
        "Two copies that agree today are two copies, which is what",
        "this file exists to stop:",
        `  import { ${name}, allowed } from "<...>/shared/rows.ts";`);
    }
  }
}

/* ------------------------------------------------------------
   3. And a CHECK constraint holding a copy of a vocabulary

   Same rule as the handlers above, one database along.
   `public.profiles.following` holds SCHOOL IDS, and Postgres
   cannot import `next/lib/nav.ts`, so the list is written out in
   a constraint and there is no way for it not to be.

   THE BUG THIS EXISTS FOR. It said `learn`, and the money school
   stopped being called that on 17 August 2026 when it moved to
   /money/. The settings form sends the whole patch at once with
   `following` in it, PostgREST refused the row, and every save on
   /account answered "Could not save that (400)" for as long
   as that was true. Nothing here noticed, because nothing here
   had ever read a migration.

   Worse than it sounds, because the form ticks a school somebody
   has STARTED whether or not they chose it: a reader who had read
   one money lesson could not save their own name.

   Read out of the last migration that writes the constraint, so
   that a new migration is what changes the answer. `learn-read`
   and `learn-last` are storage keys and not school ids, and are
   deliberately not this: the rule at the top of "What a reader
   has read" in CLAUDE.md is why.
   ------------------------------------------------------------ */

const MIGRATIONS = join(ROOT, "supabase", "migrations");
const CONSTRAINT = /following\s*<@\s*array\[([^\]]*)\]/;

const writes = readdirSync(MIGRATIONS).sort()
  .filter((f) => CONSTRAINT.test(readFileSync(join(MIGRATIONS, f), "utf8")));

if (!writes.length) {
  fail("no migration constrains profiles.following",
    "This check reads the list out of the last one that does.",
    "If the constraint was dropped on purpose, drop this too.");
} else {
  const last = writes[writes.length - 1];
  const said = readFileSync(join(MIGRATIONS, last), "utf8")
    .match(new RegExp(CONSTRAINT.source, "g")) ?? [];
  /* The LAST occurrence in the file, because a migration that
     changes a constraint drops it and adds it, and the comment
     above the change quotes the old one. */
  const ids = [...(said[said.length - 1]?.matchAll(/'([a-z-]+)'/g) ?? [])]
    .map((m) => m[1]).sort();
  const want = LADDER_SCHOOLS.map((s) => s.key).sort();

  if (ids.join(",") !== want.join(",")) {
    fail(`supabase/migrations/${last} allows a different set of schools`,
      `the constraint: ${ids.join(", ") || "(none)"}`,
      `LADDER_SCHOOLS:  ${want.join(", ")}`,
      "profiles.following holds school ids, and a save that names one the",
      "constraint has not heard of is a 400 on the whole PATCH. Add a",
      "migration; do not edit one that has run.");
  } else {
    described += ids.length;
  }
}

console.log(failures
  ? `\n${failures} problem(s): shared/rows.ts does not describe this database.\n`
  : `rows: ${Object.keys(DESCRIBES).length} tables described, ${described} columns\n`
    + `      matched against aab/schema.sql, ${scanned} handlers holding no\n`
    + "      second copy of a vocabulary, and the schools a profile may\n"
    + "      follow the same in Postgres as in nav.ts.\n");
process.exit(failures ? 1 : 0);
