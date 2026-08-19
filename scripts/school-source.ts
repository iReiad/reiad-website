/* ============================================================
   school-source.ts: where a builder gets its curriculum.

   archive/TRANSITION.md Stage 8, step 3. The builders read the four
   `curriculum.js` modules today. This is the switch that lets one
   read the database instead, so that the two can be run against
   each other and the pages diffed.

   ```js
   const { stages, bodies } = await sourceFor("quran");
   const { stages, bodies } = await sourceFor("quran", { sqlite: "/tmp/x.db" });
   ```

   ---- why the shape is `{ stages, bodies }` and not the module ----

   A `curriculum.js` exports an array and about a dozen helpers
   over it, and nearly all of those helpers are pure functions of
   the object handed to them: `dhapLessons(dhap)` reads
   `dhap.sections`, `dhapMinutes(dhap)` sums what it finds. They
   work on any array of the right shape, which is why the database
   can supply one and nothing downstream has to know.

   The three that do not are the three that close over the
   module's own array: `allLessons()`, `totalDays()` and
   `findDhap()` in the Quran school, and their equivalents
   elsewhere. Those take the array as an argument now, defaulting
   to the module's, which is a change no existing caller can see.

   ---- and why SQLite rather than the API ----

   A builder is a generator somebody runs on a laptop, and it has
   to work with no network and no Worker. `shared/schools.ts` is
   written against the D1 interface, and `sqlite-d1.ts` is that
   interface over `node:sqlite`, the same one every server test in
   this repository uses. Against the live database the same code
   runs unchanged with a real D1 handle.
   ============================================================ */

import { WITHIN, stagesOf } from "../shared/schools.ts";
import { d1FromSnapshot } from "./schools-snapshot.ts";
import { d1Open, type SqliteD1 } from "./sqlite-d1.ts";

/* ---------- the two sources ----------

   `sqlite-d1.ts` is the D1 interface over node:sqlite, shared with
   the snapshot loader and with the server tests, so what a builder
   reads is read by the same code that reads the live database. */

async function fromSqlite(id: string, path: string) {
  return fromD1(id, await d1Open(path), "database");
}

/** The snapshot, which is what a builder uses when nobody has
    said otherwise.

    `content/schools.backup.json` is an export of the same three
    tables, and it is read by loading it into an in-memory
    database and going through `shared/schools.ts` exactly as the
    live one does. So there is one implementation of "what is a
    ladder", and a build from the file runs the same code as a
    build from D1. The note at the top of `schools-snapshot.ts`
    says why the file exists at all. */
async function fromSnapshot(id: string) {
  return fromD1(id, await d1FromSnapshot(id), "snapshot");
}

/** One lesson's body, as the row comes back. */
interface BodyRow {
  slug?: unknown;
  body?: unknown;
}

async function fromD1(id: string, d1: SqliteD1, from: string) {
  const stages = await stagesOf(d1, id);
  const within = WITHIN[id];

  /* The bodies, in the shape the builders already expect:
     `bodies[stageSlug][lessonSlug]` is the HTML. They are fetched
     per stage rather than with the ladder, because a ladder page
     names every lesson and needs none of their text. */
  const bodies: Record<string, Record<string, string>> = {};
  for (const stage of stages) {
    bodies[stage.slug] = {};
    const rows = await d1.prepare(
      `SELECT slug, body FROM school_lessons
        WHERE school = ? AND stage = ? ORDER BY position`
    ).bind(id, stage.slug).all();
    for (const row of (rows.results ?? []) as BodyRow[]) {
      /* An empty body is left out rather than written in as an
         empty string, because that is what a missing key in
         content/<stage>.js means and the builders already draw a
         "coming soon" page for it. Handing them "" instead would
         produce a page with an empty article in it. */
      if (row.body) bodies[stage.slug][String(row.slug)] = String(row.body);
    }
  }

  d1.handle.close();
  return { stages, bodies, within, from };
}

/* ---------- the switch ---------- */

/** Where this build's curriculum comes from.

    Three sources, and the default has moved. archive/TRANSITION.md Stage
    8 step 4: the prose is edited in the database now, so the
    files can no longer be what a build reads, or a lesson written
    in the Studio would never reach a page.

      (nothing)              content/schools.backup.json
      SCHOOL_DB=/tmp/x.db    that SQLite copy of D1

    There is no longer a third one. `SCHOOL_FILES` built from the
    `content/<stage>.js` modules, and those are in
    `archive/schools/` now: a build from them would have undone
    whatever was last saved in the Studio, which is the whole
    reason they stopped being the source. Its only caller was
    `schools-build.test.mjs`, archived beside them. */
export async function sourceFor(
  id: string, { sqlite = process.env.SCHOOL_DB }: { sqlite?: string } = {},
) {
  return sqlite ? fromSqlite(id, sqlite) : fromSnapshot(id);
}

export { fromSqlite, fromSnapshot };
