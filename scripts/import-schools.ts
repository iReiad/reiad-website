/* ============================================================
   import-schools.ts: the four curricula, as SQL.

     node scripts/import-schools.ts --out schools.sql
     npx wrangler d1 execute reiad --local  --file=schools.sql
     npx wrangler d1 execute reiad --remote --file=schools.sql

   ---- use --out, not a `>` redirect ----

   `node scripts/import-schools.ts > schools.sql` looks like the
   same thing and has one bad property: the shell creates the file
   BEFORE node runs. Run it from the wrong directory and node
   exits with "Cannot find module", the shell has already left an
   empty `schools.sql` behind, and `wrangler d1 execute --file`
   then imports it perfectly: "Processed 0 queries", a success
   table, and a database nobody touched. That happened twice.

   With `--out` the file is written by this script, after the work
   is done, or not at all.

   archive/TRANSITION.md Stage 8, step 2. It reads the files that are the
   source of truth today and writes the rows that will be the
   source of truth later. It changes nothing: the files stay, the
   builders still read them, and the only thing that exists
   afterwards is a copy in a database nothing queries yet.

   That order is the whole point. The dangerous version of this
   migration is the one where the importer, the schema and the
   readers all land together and the first thing anybody sees is a
   lesson page that lost a paragraph. So: import, prove the round
   trip (`scripts/schools.test.ts`), and only then let a builder
   read from the database.

   ---- the four schools are not one school ----

   /money/ has stages and sections. /deutsch/ has Stufen, Teile
   and a thirty day Arbeitsbuch. /quran/ makes the day itself the
   lesson and carries Arabic beside every Bangla line. /english/
   has terms and parts and a workbook of its own. They were
   written separately on purpose, and each one says so at the top
   of its own file in `shared/curricula/`.

   So this file has a small adapter per school rather than one
   clever generic reader. Four objects, each naming its export and
   where its prose lives, is honest about the differences and is
   the thing somebody can correct when a fifth school arrives.

   ---- what goes in `meta`, and why nothing is dropped ----

   Everything the file said that is not one of the columns. It is
   round-tripped exactly, and `schools.test.ts` compares what
   comes back out against the file field by field, so a lost
   `can:` or a dropped Arabic title fails a check rather than a
   reader.
   ============================================================ */

import type { Rows as SnapshotRows, Row } from "./schools-snapshot.ts";
import { existsSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* The prose these read is in `archive/schools/` as of
   archive/TRANSITION.md Stage 8 step 4. It left `aab/`, which is what
   taking it off the site means: those modules were being uploaded
   and served at `/quran/content/dhap-1.js` and nothing had asked
   for one in months. The database is where a lesson's words live
   now, and `content/schools.backup.json` is what the builders
   read.

   These files stay readable rather than deleted for the reason
   `archive/README.md` gives for everything in there: whoever has
   to check that the replacement really does what the thing it
   replaced did needs to be able to read both. `schools.test.ts`
   is that check, and it still runs against these. */
const ARCHIVE = join(ROOT, "archive", "schools");
const CURRICULA = join(ROOT, "shared", "curricula");

/* ---------- the four schools, and what is different ---------- */

/** The three tables, as `schools-snapshot.ts` writes them.
    Imported rather than restated: two descriptions of one shape
    is two things to keep true, which is what this whole file is
    about not doing to a curriculum. */
type Rows = SnapshotRows;

/** One curriculum module, of the one export this reads from it.
    Each school names its ladder differently, which is what the
    table below is for, and the rows this writes are the database's
    vocabulary rather than any school's: it walks the shape rather
    than reading the school's typed view of it. */
type Curriculum = Record<string, unknown>;

/** A stage, a section or a lesson as a ladder writes it: a few
    known fields and whatever else the school put there, which
    becomes `meta`. */
export type Node = Record<string, unknown>;

/** One school, and the four things that differ between them. */
export interface School {
  id: string;
  /** The file in `shared/curricula/`, and the folder in `aab/`
      its compiled copy is served from. */
  dir: string;
  stages: (m: Curriculum) => Node[];
  /** What a section calls its children: `lessons`, `teile` or
      `parts`. */
  within: string;
  bodies: (stage: Node) => string;
}

export const SCHOOLS: School[] = [
  {
    id: "money",
    dir: "money",
    /* The money school's stages. `MONEY_STAGES` is the array;
       `STAGES` is the export that names it. */
    stages: (m) => m.STAGES as Node[],
    /* What a section calls its children. Four schools, three
       words: /money/ and /quran/ say `lessons`, /deutsch/ says
       `teile` and /english/ says `parts`, because each one is
       written in the vocabulary of the thing it teaches. The
       first version of this file assumed `lessons` everywhere and
       quietly imported two schools with no lessons in them, which
       is the failure this whole stage is arranged to avoid. */
    within: "lessons",
    /* Its prose was under lessons/<stage>.js, not
       content/<stage>.js. The other three agreed on `content/`
       later; this one was first and nobody went back to rename
       it, which is a good reason to read it from a table rather
       than to guess. */
    bodies: (stage) => join(ARCHIVE, "money", `${String(stage.slug)}.js`),
  },
  {
    id: "deutsch",
    dir: "deutsch",
    stages: (m) => m.STUFEN as Node[],
    within: "teile",
    bodies: (stage) => join(ARCHIVE, "deutsch", `${String(stage.slug)}.js`),
  },
  {
    id: "quran",
    dir: "quran",
    stages: (m) => m.DHAPS as Node[],
    within: "lessons",
    bodies: (stage) => join(ARCHIVE, "quran", `${String(stage.slug)}.js`),
  },
  {
    id: "english",
    dir: "english",
    stages: (m) => m.TERMS as Node[],
    within: "parts",
    bodies: (stage) => join(ARCHIVE, "english", `${String(stage.slug)}.js`),
  },
];

/* Columns, so they are not also in `meta`. A field in two places
   is a field that can disagree with itself. */
const STAGE_COLUMNS = new Set(["slug", "status", "sections"]);
const SECTION_COLUMNS = new Set(["id", "lessons", "teile", "parts"]);
const LESSON_COLUMNS = new Set(["slug", "minutes", "status"]);

/** Everything else the file said, in the order it said it. */
const restOf = (object: Node, columns: Set<string>, titleKey: string): Node => {
  const meta: Node = {};
  for (const [key, value] of Object.entries(object)) {
    if (columns.has(key) || key === titleKey) continue;
    meta[key] = value;
  }
  return meta;
};

/** The title column: Bangla is the site's learning language, so
    `bn` is the title of a lesson and everything else is `meta`. */
const titleOf = (object: Node): string =>
  String(object.bn ?? object.en ?? object.title ?? "");

/* ---------- reading one school ---------- */

export async function readSchool(school: School): Promise<Rows> {
  const module = await import(join(CURRICULA, `${school.dir}.ts`)) as Curriculum;
  const stages = school.stages(module);
  if (!Array.isArray(stages) || stages.length === 0) {
    throw new Error(`${school.id}: no stages found, the export moved`);
  }

  const rows: Rows = { stages: [], sections: [], lessons: [] };

  for (const [stageIndex, stage] of stages.entries()) {
    rows.stages.push({
      school: school.id,
      slug: stage.slug,
      position: stageIndex,
      title: titleOf(stage),
      status: stage.status ?? "live",
      meta: restOf(stage, STAGE_COLUMNS, "bn"),
    });

    const file = school.bodies(stage);
    const bodies = existsSync(file) ? (await import(file)).default ?? {} : {};

    let lessonIndex = 0;
    for (const [sectionIndex, section] of
      ((stage.sections ?? []) as Node[]).entries()) {
      rows.sections.push({
        school: school.id,
        stage: stage.slug,
        ident: section.id ?? `section-${sectionIndex + 1}`,
        position: sectionIndex,
        title: titleOf(section),
        meta: restOf(section, SECTION_COLUMNS, "bn"),
      });

      const within = (section[school.within] ?? []) as Node[];
      if (within.length === 0) {
        throw new Error(
          `${school.id}/${stage.slug}: section "${section.id}" has no `
          + `"${school.within}", so the adapter is reading the wrong key`
        );
      }

      for (const lesson of within) {
        rows.lessons.push({
          school: school.id,
          stage: stage.slug,
          slug: lesson.slug,
          section: section.id ?? `section-${sectionIndex + 1}`,
          /* Position is across the whole stage, not within the
             section. That is the order the pages are built in and
             the order prev/next follows, and a lesson's neighbour
             is frequently in the next section. */
          position: lessonIndex++,
          title: titleOf(lesson),
          /* `minutes` is a number on a lesson and a [low, high]
             pair on a stage. Only the lesson's is a column. */
          minutes: Number.isFinite(lesson.minutes) ? lesson.minutes : 0,
          status: lesson.status ?? "live",
          meta: restOf(lesson, LESSON_COLUMNS, "bn"),
          /* An empty body is not a failure: the builders already
             draw a "coming soon" page for a lesson nobody has
             written, and that has to keep working. */
          body: bodies[String(lesson.slug)] ?? "",
        });
      }
    }
  }

  return rows;
}

export async function readAll(): Promise<Rows> {
  const all: Rows = { stages: [], sections: [], lessons: [] };
  for (const school of SCHOOLS) {
    const rows = await readSchool(school);
    all.stages.push(...rows.stages);
    all.sections.push(...rows.sections);
    all.lessons.push(...rows.lessons);
  }
  return all;
}

/* ---------- as SQL ---------- */

/** Text, as a hex literal SQLite decodes back to the same string.

    THE BUG THIS EXISTS FOR

    The first version quoted these as ordinary SQL strings, which
    is correct SQL and was silently useless. A lesson body is HTML
    with newlines in it, so a single INSERT ran to hundreds of
    lines: 311 statements over 10,002 lines. `wrangler d1 execute
    --file` hands the file to D1's import, which reads statements
    line by line, and a statement that does not end on its own
    line is not a statement it can see. It uploaded the whole 914
    KB, reported **"Processed 0 queries"** and "Executed 0 queries
    in 2.01ms", and returned success. Nothing was written and
    nothing said so.

    `x'...'` cannot contain a quote, a newline or a semicolon,
    because it is only ever hex digits. So every statement below
    is exactly one line of ASCII whatever the Bangla, the Arabic
    or the HTML inside it happens to be. It costs twice the bytes
    and that is the cheapest possible price for the file being
    readable by the thing that has to read it.

    `CAST(... AS TEXT)` because a bare `x'...'` is a BLOB, and a
    BLOB in a TEXT column comes back as bytes rather than as the
    string that went in. */
const q = (value: unknown): string => {
  const hex = Buffer.from(String(value), "utf8").toString("hex");
  return hex ? `CAST(x'${hex}' AS TEXT)` : `''`;
};
const json = (value: unknown): string => q(JSON.stringify(value));

export function toSql(all: Rows, now: string): string {
  /* No BEGIN TRANSACTION and no COMMIT. D1's import does not take
     them: it applies the file itself and an explicit transaction
     in the middle of that is either refused or ignored, and
     neither is a thing to find out about afterwards. */
  const lines = [
    "-- Written by scripts/import-schools.ts. Do not edit by hand.",
    "-- The four curricula, as rows. See archive/TRANSITION.md Stage 8.",
    "-- Every statement is one line: D1's import reads them line by line.",
    /* Replaced wholesale rather than merged. While the files are
       still the source of truth this table is a copy, and a copy
       that half-updates is worse than one that is rewritten. The
       day the database becomes the source, this script stops
       being the way rows change and the Studio becomes it. */
    "DELETE FROM school_lessons;",
    "DELETE FROM school_sections;",
    "DELETE FROM school_stages;",
  ];

  for (const s of all.stages) {
    lines.push(
      "INSERT INTO school_stages (school, slug, position, title, status, meta, updated_at) VALUES ("
      + [q(s.school), q(s.slug), s.position, q(s.title), q(s.status), json(s.meta), q(now)].join(", ")
      + ");"
    );
  }
  for (const s of all.sections) {
    lines.push(
      "INSERT INTO school_sections (school, stage, ident, position, title, meta, updated_at) VALUES ("
      + [q(s.school), q(s.stage), q(s.ident), s.position, q(s.title), json(s.meta), q(now)].join(", ")
      + ");"
    );
  }
  for (const l of all.lessons) {
    lines.push(
      "INSERT INTO school_lessons (school, stage, slug, section, position, title, minutes, status, meta, body, updated_at) VALUES ("
      + [
        q(l.school), q(l.stage), q(l.slug), q(l.section), l.position,
        q(l.title), l.minutes, q(l.status), json(l.meta), q(l.body), q(now),
      ].join(", ")
      + ");"
    );
  }

  /* The guarantee, asserted rather than hoped for. A statement
     that grew a newline is a statement D1's import cannot see,
     and the way that fails is a successful run that writes
     nothing. */
  for (const [i, line] of lines.entries()) {
    if (line.includes("\n")) {
      throw new Error(
        `statement ${i} spans more than one line, which D1's import cannot read`
      );
    }
  }

  return lines.join("\n") + "\n";
}

/* ---------- run ---------- */

/* `pathToFileURL` rather than `file://${argv[1]}`, because a path
   with a space or an accent in it percent-encodes in one and not
   the other, and the difference is this whole script silently not
   running. */
if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const all = await readAll();
  const written = all.lessons.filter((l: Row) => l.body).length;
  const sql = toSql(all, new Date().toISOString());

  const flag = process.argv.indexOf("--out");
  const out = flag === -1 ? null : process.argv[flag + 1];

  if (out) {
    writeFileSync(resolve(out), sql);
  } else {
    process.stdout.write(sql);
  }

  console.error(
    `\n${all.stages.length} stage(s), ${all.sections.length} section(s), `
    + `${all.lessons.length} lesson(s), ${written} of them written.`
  );
  for (const school of SCHOOLS) {
    const lessons = all.lessons.filter((l) => l.school === school.id);
    console.error(
      `  ${school.id.padEnd(8)} ${String(lessons.length).padStart(3)} lesson(s), `
      + `${lessons.filter((l) => l.body).length} written`
    );
  }
  /* The number to check the upload against. `wrangler d1 execute
     --file` prints "Processed N queries", and the failure this
     script has already had once is a run that prints 0 and
     reports success. If the two numbers do not match, nothing
     was written, whatever the tick says. */
  const count = sql.split("\n").filter((line) => line.trim() && !line.startsWith("--")).length;
  if (out) {
    console.error(`\n  written: ${resolve(out)}`);
    console.error(`  ${(sql.length / 1024).toFixed(0)} KB, ${count} queries.`);
  }
  console.error(`\n  wrangler should report ${count} queries. A 0 means it read none of them.\n`);
}
