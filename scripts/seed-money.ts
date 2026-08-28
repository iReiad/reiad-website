#!/usr/bin/env node
/* ============================================================
   seed-money.ts: the money school's rows, out of the ladder and
   the prose beside it.

       node scripts/seed-money.ts --check       validate, write nothing
       node scripts/seed-money.ts --out-dir tmp/money   the SQL
       node scripts/seed-money.ts --snapshot    refresh the backup
       node scripts/seed-money.ts --list        what is written, what is not

   ---- --out-dir, and never a `>` redirect ----

   `node scripts/seed-money.ts > money.sql` looks like the same
   thing and has one bad property: the shell creates the file
   BEFORE node runs. Run it from the wrong directory and node
   exits with "Cannot find module", the shell has already left an
   empty file behind, and importing that file succeeds perfectly:
   "Processed 0 queries", a success table, and a database nobody
   touched. `import-schools.ts` says this at length because it
   happened twice.

   ---- why it is chunked ----

   Eighty-one lessons in two languages is about a megabyte of
   SQL, and it is applied through an HTTP API with a request
   limit. So the SQL is written as numbered files, each a whole
   number of lessons, and each one is complete on its own: a run
   that stops halfway leaves a database that is consistent as far
   as it got rather than a half-written lesson.

   ---- and it UPSERTS rather than replacing ----

   A lesson with no prose in `scripts/money/` keeps whatever the
   database holds: the four stages above ভিত্তি are in the ladder,
   marked `soon`, and this must not blank them. So a written
   lesson updates every column and an unwritten one updates the
   ladder columns alone. `INSERT OR REPLACE` would have quietly
   emptied twenty-nine rows.
   ============================================================ */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { STAGES, lessonId, stageLessons, type Lesson, type Stage } from "../shared/curricula/money.ts";
import { blockProblems, mountsIn, type Blocks } from "../shared/lesson.ts";
import { LAB_IDS } from "../shared/lesson-labs.ts";
import { readSnapshot, writeSnapshot, type Row, type Rows } from "./schools-snapshot.ts";
import type { Written } from "./money/shape.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCHOOL = "money";

const arg = (name: string): string | undefined => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (found) return found.slice(name.length + 3);
  const at = process.argv.indexOf(`--${name}`);
  return at >= 0 ? process.argv[at + 1] : undefined;
};
const has = (name: string): boolean =>
  process.argv.some((a) => a === `--${name}` || a.startsWith(`--${name}=`));

/* ---------- the prose ---------- */

/** Every `scripts/money/<stage>.ts` that exists, by stage slug.

    A stage with no file is a stage nobody has written yet, which
    is a real state: the four above ভিত্তি are exactly that. */
export async function readWritten(): Promise<Record<string, Written>> {
  const dir = join(ROOT, "scripts", "money");
  const out: Record<string, Written> = {};
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".ts") || name === "shape.ts") continue;
    const stage = name.replace(/\.ts$/, "");
    const module = await import(pathToFileURL(join(dir, name)).href) as { LESSONS?: Written };
    if (module.LESSONS) out[stage] = module.LESSONS;
  }
  return out;
}

/* ---------- what a row is ---------- */

/** Everything the ladder said that is not a column. `stars` and
    `needs` go here with `en`, `blurb`, `risk` and `icon`, because
    the LADDER wants them: a card says how much a lesson matters
    before a reader opens it, and `stagesOf()` reads `meta` for
    every lesson of a school. The two bodies and the blocks are
    columns for the opposite reason. */
const lessonMeta = (lesson: Lesson): Record<string, unknown> => {
  const meta: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(lesson)) {
    if (["slug", "minutes", "status"].includes(key)) continue;
    if (key === "bn") continue;
    if (value !== undefined) meta[key] = value;
  }
  return meta;
};

const stageMeta = (stage: Stage): Record<string, unknown> => {
  const meta: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(stage)) {
    if (["slug", "status", "sections"].includes(key)) continue;
    if (key === "bn") continue;
    if (value !== undefined) meta[key] = value;
  }
  return meta;
};

export function rowsFor(written: Record<string, Written>): Rows {
  const rows: Rows = { stages: [], sections: [], lessons: [] };
  const now = "";

  for (const [stageIndex, stage] of STAGES.entries()) {
    rows.stages.push({
      school: SCHOOL, slug: stage.slug, position: stageIndex,
      title: stage.bn, status: stage.status,
      meta: JSON.stringify(stageMeta(stage)), updated_at: now,
    });

    let position = 0;
    for (const [sectionIndex, section] of stage.sections.entries()) {
      rows.sections.push({
        school: SCHOOL, stage: stage.slug, ident: section.id,
        position: sectionIndex, title: section.bn,
        meta: JSON.stringify({ en: section.en }), updated_at: now,
      });

      for (const lesson of section.lessons) {
        const content = written[stage.slug]?.[lesson.slug];
        rows.lessons.push({
          school: SCHOOL, stage: stage.slug, slug: lesson.slug,
          section: section.id, position, title: lesson.bn,
          minutes: lesson.minutes, status: lesson.status ?? "live",
          meta: JSON.stringify(lessonMeta(lesson)),
          body: content?.bn ?? null,
          body_en: content?.en ?? null,
          blocks: content ? JSON.stringify(content.blocks) : null,
          updated_at: now,
        });
        position += 1;
      }
    }
  }
  return rows;
}

/* ---------- validation ----------

   Everything `check-money.ts` asks, asked here too, because a
   seed that writes a broken lesson has already written it. The
   check is the one that runs in CI; this is the one that stops
   the damage. */

export function problemsIn(written: Record<string, Written>): string[] {
  const out: string[] = [];

  /* Ladder order, so `needs` can be told forwards from
     backwards. `lessonId` is the id progress is filed under, and
     `basics-1` files under a bare slug, which is why this is
     built rather than assumed. */
  const order = new Map<string, number>();
  let n = 0;
  for (const stage of STAGES) {
    for (const lesson of stageLessons(stage)) { order.set(lesson.id, n); n += 1; }
  }

  for (const stage of STAGES) {
    for (const lesson of stageLessons(stage)) {
      const id = lessonId(stage, lesson);
      const where = `${stage.slug}/${lesson.slug}`;

      if (lesson.status === "live") {
        const stars = (lesson as Lesson).stars;
        if (!stars) out.push(`${where}: has no stars`);
        else if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
          out.push(`${where}: stars is ${String(stars)}, which is not 1 to 5`);
        }
      }

      for (const need of (lesson as Lesson).needs ?? []) {
        if (!order.has(need)) {
          out.push(`${where}: needs "${need}", which is not a lesson id`);
        } else if ((order.get(need) as number) >= (order.get(id) as number)) {
          out.push(`${where}: needs "${need}", which comes after it in the ladder`);
        }
      }

      const content = written[stage.slug]?.[lesson.slug];
      if (!content) continue;

      /* Both bodies must mount the same blocks in the same
         order, because `lesson/body.tsx` walks the two lists
         together: the prose is rendered twice and each block
         once, between them. A mismatch is a block that vanishes
         in one language on a page that renders perfectly. */
      const bnMounts = mountsIn(content.bn);
      const enMounts = mountsIn(content.en);
      if (bnMounts.join("|") !== enMounts.join("|")) {
        out.push(`${where}: the two bodies mount different blocks.`
          + ` bn: ${bnMounts.join(", ") || "none"}; en: ${enMounts.join(", ") || "none"}`);
      }

      const blocks: Blocks = content.blocks ?? {};
      for (const id2 of bnMounts) {
        if (!blocks[id2]) out.push(`${where}: mounts "${id2}" and has no block by that name`);
      }
      for (const id2 of Object.keys(blocks)) {
        if (!bnMounts.includes(id2)) out.push(`${where}: block "${id2}" is never mounted`);
        out.push(...blockProblems(`${where} ${id2}`, blocks[id2], LAB_IDS));
      }
    }
  }
  return out;
}

/* ---------- SQL ---------- */

const lit = (v: unknown): string => {
  if (v === null || v === undefined) return "NULL";
  if (typeof v === "number") return String(v);
  return `'${String(v).replace(/'/g, "''")}'`;
};

const STAGE_SQL = (r: Row): string =>
  `INSERT INTO school_stages (school, slug, position, title, status, meta, updated_at)`
  + ` VALUES (${lit(r.school)}, ${lit(r.slug)}, ${lit(r.position)}, ${lit(r.title)},`
  + ` ${lit(r.status)}, ${lit(r.meta)}, ${lit(r.updated_at)})`
  + ` ON CONFLICT(school, slug) DO UPDATE SET position = excluded.position,`
  + ` title = excluded.title, status = excluded.status, meta = excluded.meta,`
  + ` updated_at = excluded.updated_at;`;

const SECTION_SQL = (r: Row): string =>
  `INSERT INTO school_sections (school, stage, ident, position, title, meta, updated_at)`
  + ` VALUES (${lit(r.school)}, ${lit(r.stage)}, ${lit(r.ident)}, ${lit(r.position)},`
  + ` ${lit(r.title)}, ${lit(r.meta)}, ${lit(r.updated_at)})`
  + ` ON CONFLICT(school, stage, ident) DO UPDATE SET position = excluded.position,`
  + ` title = excluded.title, meta = excluded.meta, updated_at = excluded.updated_at;`;

/** A written lesson updates every column; an unwritten one
    updates the ladder columns and leaves the prose alone. */
const LESSON_SQL = (r: Row): string => {
  const wrote = r.body !== null;
  const cols = "school, stage, slug, section, position, title, minutes, status, meta, body, body_en, blocks, updated_at";
  const values = [
    lit(r.school), lit(r.stage), lit(r.slug), lit(r.section), lit(r.position),
    lit(r.title), lit(r.minutes), lit(r.status), lit(r.meta),
    lit(r.body ?? ""), lit(r.body_en ?? ""), lit(r.blocks ?? "{}"), lit(r.updated_at),
  ].join(", ");
  const sets = [
    "section = excluded.section", "position = excluded.position",
    "title = excluded.title", "minutes = excluded.minutes",
    "status = excluded.status", "meta = excluded.meta",
    ...(wrote ? ["body = excluded.body", "body_en = excluded.body_en", "blocks = excluded.blocks"] : []),
    "updated_at = excluded.updated_at",
  ].join(", ");
  return `INSERT INTO school_lessons (${cols}) VALUES (${values})`
    + ` ON CONFLICT(school, stage, slug) DO UPDATE SET ${sets};`;
};

/* ---------- running it ----------

   Behind a guard, because `check-money.ts` imports `problemsIn`
   and `readWritten` from here rather than keeping a second copy
   of the same questions, and an import that also runs the CLI
   would print this file's tally in the middle of that check's
   output. Compared against `process.argv[1]` rather than
   `import.meta.main`, which is newer than the node this repo
   pins. */

const RAN_DIRECTLY = process.argv[1]
  && fileURLToPath(import.meta.url) === process.argv[1];

if (RAN_DIRECTLY) await main();

async function main(): Promise<void> {
const written = await readWritten();
const problems = problemsIn(written);

if (has("list")) {
  for (const stage of STAGES) {
    const lessons = stageLessons(stage);
    const done = lessons.filter((l) => written[stage.slug]?.[l.slug]).length;
    console.log(`${stage.kicker.padEnd(18)} ${stage.slug.padEnd(10)} ${String(done).padStart(3)}/${String(lessons.length).padEnd(3)} written`);
  }
  const bytes = Object.values(written).flatMap((s) => Object.values(s))
    .reduce((a, c) => a + c.bn.length + c.en.length + JSON.stringify(c.blocks).length, 0);
  console.log(`\n${Math.round(bytes / 1024)} KB of prose and blocks.`);
}

if (problems.length) {
  for (const line of problems) console.error(`  x ${line}`);
  console.error(`\nseed-money: ${problems.length} problem(s). Nothing written.`);
  process.exit(1);
}

const rows = rowsFor(written);

const outDir = arg("out-dir");
if (outDir) {
  const dir = join(ROOT, outDir);
  mkdirSync(dir, { recursive: true });
  const files: string[] = [];

  /* The ladder first, in one file: a lesson row naming a section
     that does not exist yet is a lesson nothing renders, and the
     stages and sections together are small. */
  files.push([
    ...rows.stages.map(STAGE_SQL),
    ...rows.sections.map(SECTION_SQL),
  ].join("\n"));

  /* Then the lessons, a whole number of them per file, under the
     API's request limit with room to spare. */
  const LIMIT = 60_000;
  let batch: string[] = [];
  let size = 0;
  for (const row of rows.lessons) {
    const sql = LESSON_SQL(row);
    if (size + sql.length > LIMIT && batch.length) {
      files.push(batch.join("\n"));
      batch = []; size = 0;
    }
    batch.push(sql);
    size += sql.length;
  }
  if (batch.length) files.push(batch.join("\n"));

  files.forEach((sql, i) => {
    writeFileSync(join(dir, `money-${String(i).padStart(3, "0")}.sql`), `${sql}\n`);
  });
  console.log(`wrote ${files.length} file(s) to ${outDir}, `
    + `${rows.stages.length} stage(s), ${rows.sections.length} section(s), `
    + `${rows.lessons.length} lesson(s).`);
}

if (has("snapshot")) {
  /* The other three schools come back out of the snapshot
     untouched: this script knows one school and must not be the
     thing that rewrites the German ladder. */
  const old = readSnapshot();
  const keep = (list: Row[]): Row[] => list.filter((r) => r.school !== SCHOOL);
  writeSnapshot({
    stages: [...keep(old.stages), ...rows.stages],
    sections: [...keep(old.sections), ...rows.sections],
    lessons: [...keep(old.lessons), ...rows.lessons.map((r) => ({
      ...r,
      /* A lesson this run did not write keeps the prose the
         snapshot already held, exactly as the SQL leaves the
         database's alone. */
      body: r.body ?? old.lessons.find(
        (o) => o.school === SCHOOL && o.stage === r.stage && o.slug === r.slug)?.body ?? "",
      body_en: r.body_en ?? "",
      blocks: r.blocks ?? "{}",
    }))],
  });
  console.log(`content/schools.backup.json refreshed.`);
}

if (!has("list") && !outDir && !has("snapshot")) {
  console.log(`seed-money: nothing to complain about. `
    + `${rows.lessons.filter((r) => r.body !== null).length} of ${rows.lessons.length} lesson(s) written.`);
}
}
