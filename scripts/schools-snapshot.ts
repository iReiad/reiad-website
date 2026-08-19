/* ============================================================
   schools-snapshot.ts: the schools' rows, as a file a builder
   can read with no network.

   archive/TRANSITION.md Stage 8, step 4. The prose of a lesson lives in
   D1 now and is edited at `/studio/?lessons`. That leaves one
   question the stage has to answer before the old
   `content/<stage>.js` files can be retired: **where does a
   builder get the text from?**

   ---- why not straight from the database ----

   A builder is a generator somebody runs on a laptop, and
   `school-source.ts` says at the top that it has to work with no
   network and no Worker. A build that needs credentials is a
   build that cannot be run by the person checking whether their
   own change came out right, and it is a build CI cannot do
   without handing CI a token that can read the database.

   ---- so: an export, committed, the way articles already are ----

   `content/articles.backup.json` is the same shape of answer to
   the same shape of problem, and the reasoning in
   `functions/_lib/backup.js` transfers exactly: **every byte of
   this file is already served at a public URL.** A lesson body is
   what `/quran/dhap-1/al.html` shows to anybody who asks for it.
   There is nothing here belonging to a reader, no draft, no
   credential and no identifier of a system outside this site.

   It also closes a gap the retirement would otherwise open. Today
   the prose is in git, in those `content/<stage>.js` files. Move
   them to `archive/` with nothing to replace them and the schools'
   text lives in D1 and in a fortnight of R2 backups and nowhere
   else. This puts it back.

   ---- and why there is no timestamp in it ----

   `articles.backup.json` carries `taken_at` because it is a
   backup and nothing reads it. This is a build input. If it
   carried the time it was taken, every refresh would change the
   file whether or not a word of any lesson had changed, and the
   one question worth asking of it in git ("did the prose move?")
   would be answered by noise on every line of the log.

   So it is a pure function of the rows: same content, same bytes.
   When it was taken is what the commit date is for.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHOOL_IDS } from "../shared/schools.ts";
import { bindable, d1Open, type SqliteD1 } from "./sqlite-d1.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Where it lives. Beside the articles backup, because it is the
    same kind of thing and the next person looking for one will
    look for the other in the same place. */
export const SNAPSHOT = join(ROOT, "content/schools.backup.json");

/** The columns that go in, per table, in a fixed order.

    `updated_at` is deliberately not among them. The importer
    stamps every row with the moment the import ran, so including
    it would make every export differ from the last one for a
    reason that has nothing to do with any lesson. Nothing renders
    it: `stagesOf()` builds a stage out of slug, title, status and
    `meta`, and a column that is in none of those never reaches a
    page. */
/** A row of any of the three tables, as SQLite or the importer
    hands it over. Untyped per table on purpose: `tidy()` reads it
    by the column list below, which is the one place the shape is
    written down. */
export type Row = Record<string, unknown>;

/** The three tables, together. Everything here takes and returns
    this. */
export interface Rows {
  stages: Row[];
  sections: Row[];
  lessons: Row[];
}

/** Which table, for the three tables that have a column list, an
    order and a tidier each. */
type Table = "stages" | "sections" | "lessons";

const COLUMNS: Record<Table, string[]> = {
  stages: ["school", "slug", "position", "title", "status", "meta"],
  sections: ["school", "stage", "ident", "position", "title", "meta"],
  lessons: ["school", "stage", "slug", "section", "position", "title",
            "minutes", "status", "meta", "body"],
};

/** The order rows are written in, and it is not the order they
    came back in. A snapshot whose row order depends on what the
    database felt like returning is a snapshot that produces a
    diff for no reason. School, then ladder position, then slug as
    the tie-break that cannot itself tie. */
const ORDER: Record<Table, (a: Row, b: Row) => number> = {
  stages: (a, b) => cmp(a.school, b.school)
    || num(a.position) - num(b.position) || cmp(a.slug, b.slug),
  sections: (a, b) => cmp(a.school, b.school) || cmp(a.stage, b.stage)
    || num(a.position) - num(b.position) || cmp(a.ident, b.ident),
  lessons: (a, b) => cmp(a.school, b.school) || cmp(a.stage, b.stage)
    || num(a.position) - num(b.position) || cmp(a.slug, b.slug),
};

const cmp = (a: unknown, b: unknown): number =>
  (String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0);
const num = (v: unknown): number => Number(v) || 0;

/** `meta` as a string, whichever way it arrived.

    It is TEXT in the database and an object in the row the
    importer builds, and both reach this file: the exporter reads
    the first and the initial snapshot was taken from the second.
    Storing the string is what makes the two agree, and it is what
    goes back into the column. */
const metaText = (value: unknown): string =>
  typeof value === "string" ? value : JSON.stringify(value ?? {});

const tidy = (row: Row, columns: string[]): Row => {
  const out: Row = {};
  for (const key of columns) {
    out[key] = key === "meta" ? metaText(row[key])
      : key === "position" || key === "minutes" ? Number(row[key]) || 0
      : String(row[key] ?? "");
  }
  return out;
};

/* ---------- writing ---------- */

/** Rows in, file out. Returns what it wrote, so a caller can say
    how much rather than guess. */
export function writeSnapshot(rows: Rows, file = SNAPSHOT) {
  const out = {
    format: 1,
    kind: "schools",
    note: "The four curricula and their prose, exported from D1. "
      + "Generated; do not edit by hand. Every byte of it is already "
      + "served at a public URL: see the note at the top of "
      + "scripts/schools-snapshot.ts. Refresh it with "
      + "scripts/export-schools.ts.",
    counts: countsOf(rows),
    stages: [...rows.stages].sort(ORDER.stages).map((r) => tidy(r, COLUMNS.stages)),
    sections: [...rows.sections].sort(ORDER.sections).map((r) => tidy(r, COLUMNS.sections)),
    lessons: [...rows.lessons].sort(ORDER.lessons).map((r) => tidy(r, COLUMNS.lessons)),
  };
  writeFileSync(file, JSON.stringify(out, null, 2) + "\n");
  return out;
}

/** What the snapshot says about itself, all of it counted rather
    than carried. `bySchool` was assigned on to an object literal
    after it was built, which is legal JavaScript and left the
    field off the inferred type: `export-schools.ts` read
    `counts.bySchool[id]` and TypeScript said there is no such
    property. Declared here, and the assignment moved into the
    literal where it belongs. */
export interface Counts {
  stages: number;
  sections: number;
  lessons: number;
  written: number;
  bySchool: Record<string, { lessons: number; written: number }>;
}

/** Counted from the rows, never carried alongside them. */
export function countsOf(rows: Rows): Counts {
  const counts: Counts = {
    stages: rows.stages.length,
    sections: rows.sections.length,
    lessons: rows.lessons.length,
    written: rows.lessons.filter((l) => l.body).length,
    bySchool: {},
  };
  for (const id of SCHOOL_IDS) {
    const lessons = rows.lessons.filter((l) => l.school === id);
    counts.bySchool[id] = {
      lessons: lessons.length,
      written: lessons.filter((l) => l.body).length,
    };
  }
  return counts;
}

/* ---------- reading ---------- */

/** The file, as it is on disk: the three tables plus what it says
    about itself. */
export interface Snapshot extends Rows {
  format: number;
  kind: string;
  note: string;
  counts: Counts;
}

export function readSnapshot(file = SNAPSHOT): Snapshot {
  const snapshot = JSON.parse(readFileSync(file, "utf8"));
  if (snapshot.format !== 1 || snapshot.kind !== "schools") {
    throw new Error(`${file}: not a schools snapshot`);
  }
  return snapshot;
}

/** The snapshot's rows for one school, back into a database.

    Into an in-memory one, and then read out through
    `shared/schools.ts` like any other. That is the point of doing
    it this way rather than reshaping the JSON by hand: the
    grouping of lessons into sections, the ladder ordering and the
    spreading of `meta` are decided in exactly one place, and a
    build from this file is running the same code as a build from
    the live database. A second implementation of that grouping is
    how the two quietly stop agreeing. */
export async function d1FromSnapshot(
  school: string, snapshot: Snapshot = readSnapshot(),
): Promise<SqliteD1> {
  const d1 = await d1Open();
  const db = d1.handle;

  db.exec(`
    CREATE TABLE school_stages (school TEXT, slug TEXT, position INTEGER,
      title TEXT, status TEXT, meta TEXT, updated_at TEXT DEFAULT '');
    CREATE TABLE school_sections (school TEXT, stage TEXT, ident TEXT,
      position INTEGER, title TEXT, meta TEXT, updated_at TEXT DEFAULT '');
    CREATE TABLE school_lessons (school TEXT, stage TEXT, slug TEXT,
      section TEXT, position INTEGER, title TEXT, minutes INTEGER,
      status TEXT, meta TEXT, body TEXT, updated_at TEXT DEFAULT '');
  `);

  for (const [table, columns] of Object.entries(COLUMNS)) {
    const name = `school_${table}`;
    const insert = db.prepare(
      `INSERT INTO ${name} (${columns.join(", ")}) `
      + `VALUES (${columns.map(() => "?").join(", ")})`
    );
    for (const row of snapshot[table as Table]) {
      if (row.school !== school) continue;
      insert.run(...columns.map((k) => bindable(row[k])));
    }
  }

  return d1;
}
