/* ============================================================
   import-schools.mjs: the four curricula, as SQL.

     node scripts/import-schools.mjs > schools.sql
     npx wrangler d1 execute reiad --local  --file=schools.sql
     npx wrangler d1 execute reiad --remote --file=schools.sql

   TRANSITION.md Stage 8, step 2. It reads the files that are the
   source of truth today and writes the rows that will be the
   source of truth later. It changes nothing: the files stay, the
   builders still read them, and the only thing that exists
   afterwards is a copy in a database nothing queries yet.

   That order is the whole point. The dangerous version of this
   migration is the one where the importer, the schema and the
   readers all land together and the first thing anybody sees is a
   lesson page that lost a paragraph. So: import, prove the round
   trip (`scripts/schools.test.mjs`), and only then let a builder
   read from the database.

   ---- the four schools are not one school ----

   /learn/ has stages and sections. /deutsch/ has Stufen, Teile
   and a thirty day Arbeitsbuch. /quran/ makes the day itself the
   lesson and carries Arabic beside every Bangla line. /english/
   has terms and parts and a workbook of its own. They were
   written separately on purpose, and each one says so at the top
   of its own curriculum.js.

   So this file has a small adapter per school rather than one
   clever generic reader. Four objects, each naming its export and
   where its prose lives, is honest about the differences and is
   the thing somebody can correct when a fifth school arrives.

   ---- what goes in `meta`, and why nothing is dropped ----

   Everything the file said that is not one of the columns. It is
   round-tripped exactly, and `schools.test.mjs` compares what
   comes back out against the file field by field, so a lost
   `can:` or a dropped Arabic title fails a check rather than a
   reader.
   ============================================================ */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");

/* ---------- the four schools, and what is different ---------- */

export const SCHOOLS = [
  {
    id: "learn",
    dir: "learn",
    /* The money school's stages. `MONEY_STAGES` is the array;
       `STAGES` is the export that names it. */
    stages: (m) => m.STAGES,
    /* What a section calls its children. Four schools, three
       words: /learn/ and /quran/ say `lessons`, /deutsch/ says
       `teile` and /english/ says `parts`, because each one is
       written in the vocabulary of the thing it teaches. The
       first version of this file assumed `lessons` everywhere and
       quietly imported two schools with no lessons in them, which
       is the failure this whole stage is arranged to avoid. */
    within: "lessons",
    /* Its prose is under lessons/<stage>.js, not content/<stage>.js.
       The other three agreed on `content/` later; this one was
       first and nobody went back to rename it, which is a good
       reason to read it from a table rather than to guess. */
    bodies: (stage) => join(AAB, "learn", "lessons", `${stage.slug}.js`),
  },
  {
    id: "deutsch",
    dir: "deutsch",
    stages: (m) => m.STUFEN,
    within: "teile",
    bodies: (stage) => join(AAB, "deutsch", "content", `${stage.slug}.js`),
  },
  {
    id: "quran",
    dir: "quran",
    stages: (m) => m.DHAPS,
    within: "lessons",
    bodies: (stage) => join(AAB, "quran", "content", `${stage.slug}.js`),
  },
  {
    id: "english",
    dir: "english",
    stages: (m) => m.TERMS,
    within: "parts",
    bodies: (stage) => join(AAB, "english", "content", `${stage.slug}.js`),
  },
];

/* Columns, so they are not also in `meta`. A field in two places
   is a field that can disagree with itself. */
const STAGE_COLUMNS = new Set(["slug", "status", "sections"]);
const SECTION_COLUMNS = new Set(["id", "lessons", "teile", "parts"]);
const LESSON_COLUMNS = new Set(["slug", "minutes", "status"]);

/** Everything else the file said, in the order it said it. */
const restOf = (object, columns, titleKey) => {
  const meta = {};
  for (const [key, value] of Object.entries(object)) {
    if (columns.has(key) || key === titleKey) continue;
    meta[key] = value;
  }
  return meta;
};

/** The title column: Bangla is the site's learning language, so
    `bn` is the title of a lesson and everything else is `meta`. */
const titleOf = (object) => String(object.bn ?? object.en ?? object.title ?? "");

/* ---------- reading one school ---------- */

export async function readSchool(school) {
  const module = await import(join(AAB, school.dir, "curriculum.js"));
  const stages = school.stages(module);
  if (!Array.isArray(stages) || stages.length === 0) {
    throw new Error(`${school.id}: no stages found, the export moved`);
  }

  const rows = { stages: [], sections: [], lessons: [] };

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
    for (const [sectionIndex, section] of (stage.sections ?? []).entries()) {
      rows.sections.push({
        school: school.id,
        stage: stage.slug,
        ident: section.id ?? `section-${sectionIndex + 1}`,
        position: sectionIndex,
        title: titleOf(section),
        meta: restOf(section, SECTION_COLUMNS, "bn"),
      });

      const within = section[school.within] ?? [];
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
          body: bodies[lesson.slug] ?? "",
        });
      }
    }
  }

  return rows;
}

export async function readAll() {
  const all = { stages: [], sections: [], lessons: [] };
  for (const school of SCHOOLS) {
    const rows = await readSchool(school);
    all.stages.push(...rows.stages);
    all.sections.push(...rows.sections);
    all.lessons.push(...rows.lessons);
  }
  return all;
}

/* ---------- as SQL ---------- */

/** SQLite quoting: double the quote, and nothing else. The bodies
    are HTML full of quotes and Bangla and Arabic, and anything
    cleverer than this is a way to corrupt one of them. */
const q = (value) => `'${String(value).replace(/'/g, "''")}'`;
const json = (value) => q(JSON.stringify(value));

function toSql(all, now) {
  const lines = [
    "-- Written by scripts/import-schools.mjs. Do not edit by hand.",
    "-- The four curricula, as rows. See TRANSITION.md Stage 8.",
    "BEGIN TRANSACTION;",
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

  lines.push("COMMIT;");
  return lines.join("\n") + "\n";
}

/* ---------- run ---------- */

if (import.meta.url === `file://${process.argv[1]}`) {
  const all = await readAll();
  const written = all.lessons.filter((l) => l.body).length;

  process.stdout.write(toSql(all, new Date().toISOString()));

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
  console.error("\nNothing reads these rows yet. That is Stage 8 step 3.\n");
}
