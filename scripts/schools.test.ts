/* ============================================================
   schools.test.ts: does a curriculum survive the round trip?

     node scripts/schools.test.ts

   archive/TRANSITION.md Stage 8. Before any page is rendered from these
   rows, the rows have to be provably the same thing the files
   say. This runs the real SQL against real SQLite through
   `node:sqlite`, reads it back, rebuilds the shape
   the ladder exports, and compares the two field by field.

   ---- why field by field, and not a row count ----

   Counting rows would have passed the first version of the
   importer, which found 17 stages, 61 sections and **zero
   lessons** for two of the four schools. `/deutsch/` calls them
   `teile` and `/english/` calls them `parts`, because each school
   is written in the vocabulary of the thing it teaches, and an
   importer that assumed `lessons` everywhere imported two empty
   schools without complaining. A check that only counted what it
   found would have agreed with it.

   So this compares the actual values: every stage, every section,
   every lesson, every field of each, and the body of every lesson
   as a string. A dropped Arabic title or a lost `can:` line is a
   failed check here rather than a page that quietly says less
   than it used to.
   ============================================================ */

import { DatabaseSync } from "node:sqlite";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHOOLS, readAll, readSchool, toSql } from "./import-schools.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}\n      ${detail}` : name);
};
const same = (name: string, a: unknown, b: unknown): void =>
  ok(name, a === b, `expected ${JSON.stringify(a)}, got ${JSON.stringify(b)}`);

/* ---------- the schema, out of the file the Worker also uses ----------

   Read rather than repeated. `functions/_lib/db.js` applies these
   statements to the live database and `aab/schema.sql` is the
   copy a human reads; a test carrying a third copy would be the
   one that stays right while the other two drift. */

const schema = readFileSync(join(ROOT, "aab/schema.sql"), "utf8");
const db = new DatabaseSync(":memory:");

/* Comments are stripped from the whole file BEFORE it is split on
   the semicolon, and both halves of that sentence were learned the
   hard way.

   Stripping first, because a trailing comment in that file
   contains a semicolon of its own ("the piece it is about; NULL =
   general"). Split first and a CREATE gets cut in half at a
   semicolon that was inside prose, and SQLite answers "incomplete
   input" about a line that reads perfectly.

   And trailing comments, not just whole comment lines, for the
   same reason. `--` inside a quoted string would be a false
   positive, so the scan tracks whether it is inside one. */
const withoutComments = (line: string): string => {
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === "'") quoted = !quoted;
    if (!quoted && line[i] === "-" && line[i + 1] === "-") return line.slice(0, i);
  }
  return line;
};

for (const statement of schema
  .split("\n")
  .map(withoutComments)
  .join("\n")
  .split(";")) {
  const sql = statement.trim();
  if (!sql) continue;
  db.exec(sql + ";");
}

ok("the schools tables exist in aab/schema.sql",
  ["school_stages", "school_sections", "school_lessons"].every((table) =>
    db.prepare("SELECT name FROM sqlite_master WHERE name = ?").get(table)),
  "one of the three tables is missing, so the schema and the importer disagree");

/* ---------- the files, and then the rows ---------- */

const fromFiles = await readAll();

ok("every school has stages", fromFiles.stages.length > 0);
ok("every school has lessons",
  SCHOOLS.every((s) => fromFiles.lessons.some((l) => l.school === s.id)),
  SCHOOLS.map((s) => `${s.id}:${fromFiles.lessons.filter((l) => l.school === s.id).length}`)
    .join(" "));

/* ---------- through the file that actually gets uploaded ----------

   THE BUG THIS ORDER EXISTS FOR

   This test used to insert the rows with prepared statements,
   which proved the data and never the file. The file was wrong.
   `wrangler d1 execute --file` hands it to D1's import, which
   reads statements line by line, and every lesson body carried
   raw newlines, so 311 statements were spread over 10,002 lines
   and not one of them ended on its own line. The upload
   succeeded, reported "Processed 0 queries", and wrote nothing.

   So the SQL is generated here by the same function the script
   uses, checked for the property D1 needs, and executed as text.
   The rows below are the rows that file produces or the test is
   testing something nobody runs. */

const now = "2026-08-16T00:00:00.000Z";
const sql = toSql(fromFiles, now);

const statements = sql.split("\n").filter((line) => line.trim() && !line.startsWith("--"));

ok("every statement is on one line, which is all D1's import can read",
  statements.every((line) => line.trim().endsWith(";")),
  "a statement that does not end on its own line is one the importer cannot see");

ok("and none of them opens a transaction",
  !/\bBEGIN\b|\bCOMMIT\b/i.test(sql),
  "D1's import applies the file itself and will not take an explicit transaction");

for (const statement of statements) db.exec(statement);

ok("every row inserted",
  (db.prepare("SELECT COUNT(*) n FROM school_lessons").get() as { n: number } | undefined)?.n
    === fromFiles.lessons.length);

/* ---------- and back out again ---------- */

const stagesOut = db.prepare(
  "SELECT * FROM school_stages ORDER BY school, position").all();
/* Ordered by the STAGE'S position, not by its slug, and the
   difference is not cosmetic. Three of the four schools have
   slugs that happen to sort into ladder order (`dhap-1..3`,
   `stufe-1..4`, `term-1..2`) and the money school does not: its
   ladder is start, basics-1, basics-2, basics-3, inter-1 and so
   on, which sorts as advanced, basics-1, ..., start. A query that
   ordered by the slug would have looked right on three schools
   and quietly reordered the fourth, which is the shape of bug
   this whole stage is arranged to catch before a reader does. */
const lessonsOut = db.prepare(`
  SELECT l.* FROM school_lessons l
    JOIN school_stages s ON s.school = l.school AND s.slug = l.stage
   ORDER BY l.school, s.position, l.position`).all();

/* ---------- school by school, against the file ---------- */

for (const school of SCHOOLS) {
  const fromFile = await readSchool(school);
  const stages = stagesOut.filter((s) => s.school === school.id);
  const lessons = lessonsOut.filter((l) => l.school === school.id);

  same(`${school.id}: the stage count`, fromFile.stages.length, stages.length);
  same(`${school.id}: the lesson count`, fromFile.lessons.length, lessons.length);

  /* The ladder order is the one thing a reader would notice
     immediately and the one thing a database will not preserve by
     itself: rows come back in whatever order the query asks for,
     and `position` is the only reason that order is the file's. */
  ok(`${school.id}: the stages come back in ladder order`,
    stages.every((s, i) => s.slug === fromFile.stages[i].slug),
    `${stages.map((s) => s.slug).join(",")} vs ${fromFile.stages.map((s) => s.slug).join(",")}`);

  ok(`${school.id}: the lessons come back in page order`,
    lessons.every((l, i) => l.slug === fromFile.lessons[i].slug
      && l.stage === fromFile.lessons[i].stage),
    "a lesson moved, so prev/next would point at the wrong page");

  /* Every field of every stage, including the ones only this
     school has: `de` on a Stufe, `ar` on a ধাপ, `workbook` on a
     term, `base` on the money school's first stage. */
  let stageFields = 0;
  for (const [i, expected] of fromFile.stages.entries()) {
    const got = stages[i];
    if (!got) break;
    if (got.title !== expected.title) {
      failures.push(`${school.id}/${expected.slug}: the title changed`);
      break;
    }
    const meta = JSON.parse(String(got.meta)) as Record<string, unknown>;
    for (const [key, value] of
      Object.entries(expected.meta as Record<string, unknown>)) {
      stageFields++;
      if (JSON.stringify(meta[key]) !== JSON.stringify(value)) {
        failures.push(`${school.id}/${expected.slug}: "${key}" did not survive`);
        break;
      }
    }
  }
  ok(`${school.id}: ${stageFields} stage field(s) survived`, true);

  let lessonFields = 0;
  let bodies = 0;
  for (const [i, expected] of fromFile.lessons.entries()) {
    const got = lessons[i];
    if (!got) break;
    if (got.title !== expected.title || got.minutes !== expected.minutes) {
      failures.push(`${school.id}/${expected.slug}: the title or the minutes changed`);
      break;
    }
    /* The body is the whole reason this migration exists, and it
       is Bangla and Arabic and HTML all at once. Compared as a
       string, not by length: a quote doubled one time too many
       inside a `dir="rtl"` span is a misquotation of a verse, and
       it would not change the length by much. */
    if (got.body !== expected.body) {
      failures.push(`${school.id}/${expected.slug}: the body is not byte-identical`);
      break;
    }
    if (got.body) bodies++;
    const meta = JSON.parse(String(got.meta)) as Record<string, unknown>;
    for (const [key, value] of
      Object.entries(expected.meta as Record<string, unknown>)) {
      lessonFields++;
      if (JSON.stringify(meta[key]) !== JSON.stringify(value)) {
        failures.push(`${school.id}/${expected.slug}: "${key}" did not survive`);
        break;
      }
    }
  }
  ok(`${school.id}: ${lessonFields} lesson field(s) and ${bodies} bod(ies) survived`, true);
}

/* ---------- the two things that would break a page ---------- */

/* A lesson nobody has written yet is not a broken row. The
   builders draw a "coming soon" page for it and the hub counts it
   as not-yet-written, so an empty body has to be allowed through
   and has to stay distinguishable from a missing row. */
const empty = lessonsOut.filter((l) => !l.body).length;
ok(`${empty} lesson(s) are not written yet, and are rows all the same`,
  empty > 0 && empty < lessonsOut.length,
  "either everything is written or nothing is, and neither is true of this site");

/* Two lessons with the same slug in the same stage would collide
   on the primary key, and SQLite would have thrown above. This
   says so out loud, because the collision a person would actually
   make is across stages, which is allowed and must stay allowed:
   `/money/basics-2/inflation` and `/deutsch/stufe-1/inflation`
   are different pages. */
const slugs = new Set(lessonsOut.map((l) => `${l.school}/${l.stage}/${l.slug}`));
same("every lesson has its own address", lessonsOut.length, slugs.size);

/* ---------- done ---------- */

db.close();

console.log(`\n${passed} checks passed`);
console.log(
  `  ${fromFiles.stages.length} stages, ${fromFiles.sections.length} sections, `
  + `${fromFiles.lessons.length} lessons, `
  + `${fromFiles.lessons.filter((l) => l.body).length} written`
);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("The curricula survive the round trip, field for field.\n");
