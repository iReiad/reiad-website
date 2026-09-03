#!/usr/bin/env node
/* ============================================================
   check-migrations.ts: SQL that the runner will refuse.

       node scripts/check-migrations.ts

   EVERY OTHER CHECK HERE READS THE MIGRATION FILES AND BELIEVES
   THEM. `check-rls.ts` asks whether a table has its policies,
   `check-rows.ts` whether the description still matches, and both
   are reading a file rather than a database: a migration that
   CANNOT BE APPLIED passes all of them, and the site's tests pass
   too, because they run against a fixture.

   That happened. `research_sources` and `research_notes` carried

       fts tsvector generated always as (
             to_tsvector('simple', ... || array_to_string(tags, ' '))) stored

   and `array_to_string(anyarray, text)` is STABLE, because it runs
   the element type's output function. Postgres refuses a stable
   call in a generated column, so the migration failed on its first
   table with `42P17: generation expression is not immutable`, the
   Supabase branch went to MIGRATIONS_FAILED, and NOTHING after 30
   August was applied: seventeen rooms of a studio whose tables did
   not exist, with 88 checks green over it. The only symptom was
   one red tick belonging to somebody else's integration.

   So this reads the SQL for what a runner will refuse, and the
   list is short on purpose: each entry is a thing that fails at
   APPLY time and cannot be seen by reading the schema.

   `public.words_to_text` is the immutable wrapper the two search
   columns use instead. A `text[]` joined on a constant really is
   immutable, so it says so.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "supabase", "migrations");

/** Functions Postgres marks stable or volatile, which a generated
    column may not call. The name, and what to use instead. */
const NOT_IMMUTABLE: Record<string, string> = {
  array_to_string: "public.words_to_text(text[]) for a text[], which is immutable and says so",
  now: "a plain default of now(), which is not a generated column",
  current_timestamp: "a plain default",
  current_date: "a plain default",
  age: "the arithmetic in the query that reads the row",
  to_char: "a formatted copy written by the caller",
  timezone: "the timestamptz itself, converted where it is read",
  random: "a value the caller supplies",
  "auth.uid": "a column default, which is where auth.uid() belongs",
};

let bad = 0;
const fail = (line: string, ...detail: string[]): void => {
  bad += 1;
  console.error(`\n  x ${line}`);
  for (const d of detail) console.error(`        ${d}`);
};

const files = readdirSync(DIR).filter((f) => f.endsWith(".sql")).sort();
let generated = 0;

for (const file of files) {
  const sql = readFileSync(join(DIR, file), "utf8");

  /* ---- 1. a generated column may only call immutable things ---- */
  for (const m of sql.matchAll(/generated\s+always\s+as\s*\(/gi)) {
    /* The expression, by balancing brackets from the opening one. */
    let depth = 0;
    let end = m.index + m[0].length - 1;
    for (; end < sql.length; end += 1) {
      if (sql[end] === "(") depth += 1;
      else if (sql[end] === ")") { depth -= 1; if (depth === 0) break; }
    }
    const expression = sql.slice(m.index, end + 1);
    generated += 1;
    for (const [name, instead] of Object.entries(NOT_IMMUTABLE)) {
      if (!new RegExp(`(?<![\\w.])${name.replace(".", "\\.")}\\s*\\(`, "i").test(expression)) continue;
      fail(`${file}: a generated column calls ${name}(), which is not immutable.`,
        "Postgres refuses the whole migration with 42P17, and every check that",
        "reads this file rather than the database will still pass.",
        `Use ${instead}.`);
    }
  }

  /* ---- 2. a migration runs in a transaction ---- */
  if (/create\s+(unique\s+)?index\s+concurrently/i.test(sql)) {
    fail(`${file}: creates an index CONCURRENTLY.`,
      "A migration is applied inside a transaction and Postgres refuses that",
      "there. Create it plainly, or do it by hand outside the migration.");
  }
  if (/^\s*(begin|commit|rollback)\s*;/im.test(sql)) {
    fail(`${file}: opens or closes a transaction of its own.`,
      "The runner has already opened one, so this either fails or leaves the",
      "rest of the file outside it.");
  }
}

console.log(bad
  ? `\nmigrations: ${bad} statement(s) the runner will refuse.\n`
  : `migrations: ${files.length} file(s), ${generated} generated column(s), `
    + "every one of them immutable, and none opens a transaction of its own.");
process.exit(bad ? 1 : 0);
