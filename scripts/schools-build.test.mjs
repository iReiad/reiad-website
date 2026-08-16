/* ============================================================
   schools-build.test.mjs: do the pages come out the same from the
   database as they do from the files?

     node scripts/schools-build.test.mjs

   TRANSITION.md Stage 8, step 3, and its whole acceptance test.
   The database is only allowed to become the source of a school's
   pages when building from it produces the same bytes as building
   from the files. Not "the same content", not "the same when you
   look at it": the same bytes, page by page.

   ---- what it does ----

   Imports the four curricula into a temporary SQLite database
   with the real schema, then runs a builder twice: once normally,
   once with `SCHOOL_DB` pointed at that database, each into its
   own temporary directory. Then it compares every file.

   Nothing touches `aab/`. `SCHOOL_OUT` is what keeps it out.

   ---- why this is worth a whole file ----

   Because the failure it is looking for is invisible. A ladder
   that comes back in the wrong order still renders a page. A
   lesson whose `blurb` was dropped still renders a page. A ধাপ
   whose Arabic title went missing still renders a page, and it
   renders it in Bangla, correctly, with one line gone. Every one
   of those is a diff and none of them is an error.
   ============================================================ */

import { DatabaseSync } from "node:sqlite";
import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, readdirSync, readFileSync, statSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { readSchool, SCHOOLS } from "./import-schools.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Which schools have a builder that can read a database yet.
   Stage 8 moves them one at a time on purpose: the first one is
   the proof that the shape works, and the other three are the
   same change with a different vocabulary. */
const READY = [
  { id: "quran", builder: "aab/quran/build-quran.mjs", writes: "quran" },
  { id: "deutsch", builder: "aab/deutsch/build-deutsch.mjs", writes: "deutsch" },
  { id: "english", builder: "aab/english/build-english.mjs", writes: "english" },
  { id: "learn", builder: "aab/learn/build-lessons.mjs", writes: "learn" },
];

let failures = 0;
const ok = (name, condition, detail = "") => {
  if (condition) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
};

/* ---------- a database with the real schema and the real rows ---------- */

const work = mkdtempSync(join(tmpdir(), "schools-"));
const dbPath = join(work, "schools.db");

{
  const schema = readFileSync(join(ROOT, "aab/schema.sql"), "utf8");
  const withoutComments = (line) => {
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      if (line[i] === "'") quoted = !quoted;
      if (!quoted && line[i] === "-" && line[i + 1] === "-") return line.slice(0, i);
    }
    return line;
  };

  const db = new DatabaseSync(dbPath);
  for (const statement of schema.split("\n").map(withoutComments).join("\n").split(";")) {
    const sql = statement.trim();
    if (sql) db.exec(sql + ";");
  }

  const insertStage = db.prepare(
    `INSERT INTO school_stages (school, slug, position, title, status, meta, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const insertSection = db.prepare(
    `INSERT INTO school_sections (school, stage, ident, position, title, meta, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`);
  const insertLesson = db.prepare(
    `INSERT INTO school_lessons
       (school, stage, slug, section, position, title, minutes, status, meta, body, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  const now = "2026-08-16T00:00:00.000Z";
  for (const school of SCHOOLS) {
    const rows = await readSchool(school);
    for (const s of rows.stages) {
      insertStage.run(s.school, s.slug, s.position, s.title, s.status, JSON.stringify(s.meta), now);
    }
    for (const s of rows.sections) {
      insertSection.run(s.school, s.stage, s.ident, s.position, s.title,
        JSON.stringify(s.meta), now);
    }
    for (const l of rows.lessons) {
      insertLesson.run(l.school, l.stage, l.slug, l.section, l.position, l.title,
        l.minutes, l.status, JSON.stringify(l.meta), l.body, now);
    }
  }
  db.close();
}

/* ---------- build it both ways ---------- */

const walk = (dir, base = dir, found = new Map()) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, base, found);
    else found.set(relative(base, path), readFileSync(path, "utf8"));
  }
  return found;
};

for (const school of READY) {
  console.log(`\n${school.id}`);

  const fromFiles = join(work, `${school.id}-files`);
  const fromDb = join(work, `${school.id}-db`);
  mkdirSync(fromFiles, { recursive: true });
  mkdirSync(fromDb, { recursive: true });

  const run = (env) => execFileSync("node", [join(ROOT, school.builder)], {
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

  let filesOut = "";
  let dbOut = "";
  try {
    filesOut = run({ SCHOOL_OUT: fromFiles, SCHOOL_DB: "" });
    dbOut = run({ SCHOOL_OUT: fromDb, SCHOOL_DB: dbPath });
  } catch (err) {
    ok("the builder runs both ways", false,
      String(err?.stderr || err?.message || err).split("\n").slice(0, 6).join("\n       "));
    continue;
  }

  ok("the builder runs both ways", true);

  const a = walk(join(fromFiles, school.writes));
  const b = walk(join(fromDb, school.writes));

  ok(`the same ${a.size} page(s) are written`, a.size === b.size && a.size > 0,
    `files ${a.size}, database ${b.size}`);

  const missing = [...a.keys()].filter((name) => !b.has(name));
  ok("no page went missing", missing.length === 0, missing.slice(0, 5).join(", "));

  const extra = [...b.keys()].filter((name) => !a.has(name));
  ok("and none appeared from nowhere", extra.length === 0, extra.slice(0, 5).join(", "));

  /* The whole point. Compared as strings, not by length or by
     some normalised form: an Arabic title that lost its `dir`
     attribute is four characters and a misquotation. */
  const differing = [...a.entries()]
    .filter(([name, text]) => b.has(name) && b.get(name) !== text)
    .map(([name]) => name);

  ok("every page is byte-identical", differing.length === 0,
    differing.length
      ? `${differing.length} differ, first: ${differing.slice(0, 3).join(", ")}`
      : "");

  if (differing.length) {
    /* One diff, shown, because "23 pages differ" tells you
       nothing about what to fix. */
    const [first] = differing;
    const want = a.get(first).split("\n");
    const got = b.get(first).split("\n");
    for (let i = 0; i < Math.max(want.length, got.length); i++) {
      if (want[i] !== got[i]) {
        console.log(`\n       ${first}, line ${i + 1}`);
        console.log(`       files:    ${String(want[i]).trim().slice(0, 120)}`);
        console.log(`       database: ${String(got[i]).trim().slice(0, 120)}`);
        break;
      }
    }
  }

  /* The counts a builder prints are the ones its pages state, so
     two runs that disagree here have already written two
     different sites. */
  const numbers = (text) => text.match(/\d+/g)?.join(",") ?? "";
  ok("and both runs counted the same things",
    numbers(filesOut) === numbers(dbOut),
    `files ${numbers(filesOut)}\n       database ${numbers(dbOut)}`);
}

/* ---------- done ---------- */

rmSync(work, { recursive: true, force: true });

console.log(failures
  ? `\n${failures} failed.\n`
  : "\nall good: the database builds the same pages the files do\n");
process.exit(failures ? 1 : 0);
