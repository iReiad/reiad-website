#!/usr/bin/env node
/* ============================================================
   seed-english.ts: the English school's rows, out of the ladder
   and the prose beside it.

       node scripts/seed-english.ts --check       validate, write nothing
       node scripts/seed-english.ts --out english.sql   the SQL, one file
       node scripts/seed-english.ts --out-dir tmp/english   chunked
       node scripts/seed-english.ts --snapshot    refresh the backup
       node scripts/seed-english.ts --list        what is written where

   `seed-money.ts` one school over, and the same three rules,
   which that file argues at length: `--out` rather than a `>`
   redirect, chunked for the HTTP API, and an UPSERT that leaves
   a lesson's prose alone when this run has none for it.

   ---- what is written here, and what is not ----

   The ladder is `shared/curricula/english.ts`, all three terms.
   The prose under `scripts/english/<term>.ts` is the grammar
   term's, written with blocks beside it. The first two terms
   have no file here: their prose was written into D1 before
   there were blocks and lives in `content/schools.backup.json`,
   so a lesson this directory does not carry keeps whatever the
   snapshot holds, and the SQL touches only its ladder columns.
   ============================================================ */

import { existsSync, mkdirSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { TERMS, termParts } from "../shared/curricula/english.ts";
import { blockProblems, mountsIn, splitBody, type Blocks } from "../shared/lesson.ts";
import { LAB_IDS } from "../shared/lesson-labs.ts";
import { GRID_IDS } from "../shared/lesson-grids.ts";
import { SCHOOLS, readSchool } from "./import-schools.ts";
import { readSnapshot, writeSnapshot, type Row, type Rows } from "./schools-snapshot.ts";
import type { Written } from "./english/shape.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SCHOOL = "english";

const arg = (name: string): string | undefined => {
  const found = process.argv.find((a) => a.startsWith(`--${name}=`));
  if (found) return found.slice(name.length + 3);
  const at = process.argv.indexOf(`--${name}`);
  return at >= 0 ? process.argv[at + 1] : undefined;
};
const has = (name: string): boolean =>
  process.argv.some((a) => a === `--${name}` || a.startsWith(`--${name}=`));

/* ---------- the prose ---------- */

/** Every `scripts/english/<term>.ts`, by term slug. `shape.ts` is
    the type and the `term-3/` directory holds a term's rungs;
    neither is a term. */
export async function readWritten(): Promise<Record<string, Written>> {
  const dir = join(ROOT, "scripts", "english");
  const out: Record<string, Written> = {};
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    if (!name.endsWith(".ts") || name === "shape.ts") continue;
    const term = name.replace(/\.ts$/, "");
    const module = await import(pathToFileURL(join(dir, name)).href) as { LESSONS?: Written };
    if (module.LESSONS) out[term] = module.LESSONS;
  }
  return out;
}

/* ---------- what a row is ----------

   The ladder rows come out of `readSchool()`, the same reader
   `import-schools.ts` and `check-schools.ts` use, so a stage's
   meta is spelled one way. A lesson this directory has prose for
   takes it, with its blocks; every other lesson keeps the
   snapshot's body, English body and blocks, which for the first
   two terms is the prose itself. */

export async function rowsFor(written: Record<string, Written>, old: Rows): Promise<Rows> {
  const school = SCHOOLS.find((s) => s.id === SCHOOL);
  if (!school) throw new Error("import-schools.ts no longer lists the English school");
  const ladder = await readSchool(school);

  const was = new Map(old.lessons.filter((l) => l.school === SCHOOL)
    .map((l) => [`${String(l.stage)}/${String(l.slug)}`, l]));

  const lessons: Row[] = ladder.lessons.map((row) => {
    const content = written[String(row.stage)]?.[String(row.slug)];
    const before = was.get(`${String(row.stage)}/${String(row.slug)}`);
    return {
      ...row,
      meta: JSON.stringify(row.meta ?? {}),
      /* `null` is the seeder's word for "leave the column alone",
         which the SQL below reads; the snapshot gets the string. */
      body: content ? content.bn : null,
      body_en: content ? "" : null,
      blocks: content ? JSON.stringify(content.blocks) : null,
      /* What the snapshot already held, for the rows this run
         does not write. */
      kept: {
        body: String(before?.body ?? ""),
        body_en: String(before?.body_en ?? ""),
        blocks: String(before?.blocks ?? "{}"),
      },
      updated_at: "",
    };
  });

  return {
    stages: ladder.stages.map((s) => ({ ...s, meta: JSON.stringify(s.meta ?? {}), updated_at: "" })),
    sections: ladder.sections.map((s) => ({ ...s, meta: JSON.stringify(s.meta ?? {}), updated_at: "" })),
    lessons,
  };
}

/* ---------- validation ----------

   The questions `check-money.ts` asks of that school's prose,
   asked of this one's, and written once here because a seed that
   writes a broken part has already written it. `check-english.ts`
   calls this and adds nothing of its own. */

/** The classes the server's sanitiser keeps, read out of the one
    file that decides. A class it strips is a box that arrives as
    a paragraph. */
const allowedClasses = async (): Promise<Set<string>> => {
  const { readFileSync } = await import("node:fs");
  const src = readFileSync(join(ROOT, "functions/_lib/sanitise.ts"), "utf8");
  const block = src.match(/ALLOWED_CLASSES\s*(?::[^=]+)?=\s*new Set\(\[([\s\S]*?)\]\)/);
  return new Set(block ? [...block[1].matchAll(/"([a-z][\w-]*)"/g)].map((m) => m[1]) : []);
};

const CONTAINER = /<(\/?)(ul|ol|li|table|thead|tbody|tr|figure|blockquote|div)\b[^>]*>/g;
const openAt = (html: string): number => {
  let depth = 0;
  for (const m of html.matchAll(CONTAINER)) depth += m[1] === "/" ? -1 : 1;
  return depth;
};

/** A stub that renders is worse than a part marked `soon`. The
    floor is generous: it catches a placeholder, not a short
    lesson. */
const FLOOR = 2000;

export async function problemsIn(written: Record<string, Written>): Promise<string[]> {
  const out: string[] = [];
  const allowed = await allowedClasses();
  if (!allowed.size) out.push("cannot read ALLOWED_CLASSES out of functions/_lib/sanitise.ts");

  for (const [term, parts] of Object.entries(written)) {
    const rung = TERMS.find((t) => t.slug === term);
    if (!rung) {
      out.push(`scripts/english/${term}.ts: no term called "${term}" in shared/curricula/english.ts`);
      continue;
    }
    const slugs = new Set(termParts(rung).map((p) => p.slug));

    /* A term with a file here is a term this seeder owns, so a
       live part with no prose is a rung leading to a page nobody
       wrote, and a slug the ladder does not name is prose nothing
       will ever render. */
    for (const part of termParts(rung)) {
      if (part.status === "live" && !parts[part.slug]) {
        out.push(`${term}/${part.slug}: in the ladder and not written`);
      }
    }
    for (const slug of Object.keys(parts)) {
      if (!slugs.has(slug)) out.push(`${term}/${slug}: written, and not in the ladder`);
    }

    for (const [slug, content] of Object.entries(parts)) {
      const where = `${term}/${slug}`;
      const mounts = mountsIn(content.bn);
      const blocks: Blocks = content.blocks ?? {};

      for (const id of mounts) {
        if (!blocks[id]) out.push(`${where}: mounts "${id}" and has no block by that name`);
      }
      for (const id of Object.keys(blocks)) {
        if (!mounts.includes(id)) out.push(`${where}: block "${id}" is never mounted`);
        out.push(...blockProblems(`${where} ${id}`, blocks[id], LAB_IDS, GRID_IDS));
      }

      /* A mount is a top level element: `splitBody()` cuts the
         string there, and a list holding one closes early. */
      const { parts: pieces } = splitBody(content.bn);
      let depth = 0;
      for (const [n, piece] of pieces.entries()) {
        depth += openAt(piece);
        if (n < pieces.length - 1 && depth !== 0) {
          out.push(`${where}: a mount sits inside ${depth} open element(s)`);
        }
      }
      if (depth !== 0) out.push(`${where}: ${Math.abs(depth)} unclosed or stray tag(s)`);

      for (const m of content.bn.matchAll(/class="([^"]+)"/g)) {
        for (const cls of m[1].split(/\s+/)) {
          if (allowed.size && !allowed.has(cls)) {
            out.push(`${where}: uses class "${cls}", which the server's sanitiser strips`);
          }
        }
      }

      const text = content.bn.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      if (text.length < FLOOR) out.push(`${where}: ${text.length} characters of prose, under ${FLOOR}`);
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

/** A written part updates every column; an unwritten one updates
    the ladder columns and leaves the prose alone. The INSERT half
    still needs a body for a row that does not exist yet, and the
    snapshot's is the right one: a term-2 part inserted into an
    empty database gets its prose rather than an empty page. */
const LESSON_SQL = (r: Row): string => {
  const wrote = r.body !== null;
  const kept = r.kept as { body: string; body_en: string; blocks: string };
  const cols = "school, stage, slug, section, position, title, minutes, status, meta, body, body_en, blocks, updated_at";
  const values = [
    lit(r.school), lit(r.stage), lit(r.slug), lit(r.section), lit(r.position),
    lit(r.title), lit(r.minutes), lit(r.status), lit(r.meta),
    lit(wrote ? r.body : kept.body), lit(wrote ? r.body_en : kept.body_en),
    lit(wrote ? r.blocks : kept.blocks), lit(r.updated_at),
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

/** Everything of this school's the ladder no longer names, LAST,
    for the reason `seed-money.ts` gives: a run that stops halfway
    leaves a ladder with too much on it rather than too little. */
const PRUNE_SQL = (rows: Rows): string[] => {
  const keys = (list: string[]): string => list.map((v) => lit(v)).join(", ");
  return [
    `DELETE FROM school_lessons WHERE school = ${lit(SCHOOL)}`
    + ` AND stage || '/' || slug NOT IN (`
    + keys(rows.lessons.map((r) => `${String(r.stage)}/${String(r.slug)}`)) + `);`,
    `DELETE FROM school_sections WHERE school = ${lit(SCHOOL)}`
    + ` AND stage || '/' || ident NOT IN (`
    + keys(rows.sections.map((r) => `${String(r.stage)}/${String(r.ident)}`)) + `);`,
    `DELETE FROM school_stages WHERE school = ${lit(SCHOOL)}`
    + ` AND slug NOT IN (` + keys(rows.stages.map((r) => String(r.slug))) + `);`,
  ];
};

/** The snapshot's row for a lesson: what this run wrote, or what
    the snapshot already held. */
const snapshotRow = (r: Row): Row => {
  const kept = r.kept as { body: string; body_en: string; blocks: string };
  const { kept: _kept, ...rest } = r;
  void _kept;
  return {
    ...rest,
    body: r.body === null ? kept.body : r.body,
    body_en: r.body_en === null ? kept.body_en : r.body_en,
    blocks: r.blocks === null ? kept.blocks : r.blocks,
  };
};

/* ---------- running it ---------- */

const RAN_DIRECTLY = process.argv[1]
  && fileURLToPath(import.meta.url) === process.argv[1];

if (RAN_DIRECTLY) await main();

async function main(): Promise<void> {
  const written = await readWritten();
  const problems = await problemsIn(written);

  if (has("list")) {
    for (const term of TERMS) {
      const parts = termParts(term);
      const mine = written[term.slug];
      const done = mine ? parts.filter((p) => mine[p.slug]).length : 0;
      console.log(`${term.kicker.padEnd(10)} ${term.slug.padEnd(8)} `
        + (mine ? `${String(done).padStart(3)}/${String(parts.length).padEnd(3)} written here`
          : `${String(parts.length).padStart(3)} part(s), prose in the snapshot`));
    }
  }

  if (problems.length) {
    for (const line of problems) console.error(`  x ${line}`);
    console.error(`\nseed-english: ${problems.length} problem(s). Nothing written.`);
    process.exit(1);
  }

  const old = readSnapshot();
  const rows = await rowsFor(written, old);

  const outDir = arg("out-dir");
  if (outDir) {
    const dir = join(ROOT, outDir);
    mkdirSync(dir, { recursive: true });
    const files: string[] = [];
    files.push([...rows.stages.map(STAGE_SQL), ...rows.sections.map(SECTION_SQL)].join("\n"));
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
    files.push(PRUNE_SQL(rows).join("\n"));
    files.forEach((sql, i) => {
      writeFileSync(join(dir, `english-${String(i).padStart(3, "0")}.sql`), `${sql}\n`);
    });
    console.log(`wrote ${files.length} file(s) to ${outDir}, `
      + `${rows.stages.length} stage(s), ${rows.sections.length} section(s), `
      + `${rows.lessons.length} lesson(s).`);
  }

  const outFile = arg("out");
  if (outFile) {
    const sql = [
      ...rows.stages.map(STAGE_SQL),
      ...rows.sections.map(SECTION_SQL),
      ...rows.lessons.map(LESSON_SQL),
      ...PRUNE_SQL(rows),
    ].join("\n");
    writeFileSync(join(ROOT, outFile), `${sql}\n`);
    console.log(`wrote ${outFile}, ${rows.stages.length} stage(s), `
      + `${rows.sections.length} section(s), ${rows.lessons.length} lesson(s), `
      + `and 3 prune statement(s).`);
  }

  if (has("snapshot")) {
    /* The other three schools come back out untouched: this
       script knows one school and must not be the thing that
       rewrites the German ladder. */
    const keep = (list: Row[]): Row[] => list.filter((r) => r.school !== SCHOOL);
    const out = writeSnapshot({
      stages: [...keep(old.stages), ...rows.stages],
      sections: [...keep(old.sections), ...rows.sections],
      lessons: [...keep(old.lessons), ...rows.lessons.map(snapshotRow)],
    });
    console.log(`snapshot: ${out.counts.bySchool[SCHOOL].written} of `
      + `${out.counts.bySchool[SCHOOL].lessons} English lessons written.`);
  }

  if (has("check") || (!outDir && !outFile && !has("snapshot") && !has("list"))) {
    const parts = Object.values(written).flatMap((t) => Object.values(t));
    const blocks = parts.reduce((n, p) => n + Object.keys(p.blocks).length, 0);
    console.log(`seed-english: ${parts.length} part(s) written in `
      + `${Object.keys(written).length} term(s), ${blocks} block(s), no problems.`);
  }
}
