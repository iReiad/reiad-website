/* ============================================================
   school-source.mjs: where a builder gets its curriculum.

   TRANSITION.md Stage 8, step 3. The builders read the four
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
   to work with no network and no Worker. `shared/schools.js` is
   written against the D1 interface, and the shim below is that
   interface over `node:sqlite`, the same one every server test in
   this repository uses. Against the live database the same code
   runs unchanged with a real D1 handle.
   ============================================================ */

import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHOOLS } from "./import-schools.mjs";
import { WITHIN, stagesOf } from "../shared/schools.js";
import { d1FromSnapshot } from "./schools-snapshot.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");

const schoolBy = (id) => {
  const school = SCHOOLS.find((s) => s.id === id);
  if (!school) throw new Error(`no such school: ${id}`);
  return school;
};

/* ---------- the files, which are still the source of truth ---------- */

async function fromFiles(id) {
  const school = schoolBy(id);
  const module = await import(join(AAB, school.dir, "curriculum.js"));
  const stages = school.stages(module);

  const bodies = {};
  for (const stage of stages) {
    const file = school.bodies(stage);
    bodies[stage.slug] = existsSync(file) ? (await import(file)).default ?? {} : {};
  }

  return { stages, bodies, from: "files" };
}

/* ---------- the database ---------- */

/** The D1 interface, over node:sqlite.

    `shared/schools.js` is written against D1 because that is what
    the Worker and the Next route hand it. A builder has neither,
    so it gets the same interface over a local file, and the code
    under test is the same code in all three places. */
async function d1Over(path) {
  const { DatabaseSync } = await import("node:sqlite");
  const db = new DatabaseSync(path);
  return {
    handle: db,
    prepare(sql) {
      const make = (args) => ({
        all: async () => ({ results: db.prepare(sql).all(...args) }),
        first: async () => db.prepare(sql).get(...args) ?? null,
        run: async () => { db.prepare(sql).run(...args); return { success: true }; },
      });
      return { bind: (...args) => make(args), ...make([]) };
    },
    batch: async (statements) => {
      for (const st of statements) await st.run();
      return [];
    },
  };
}

async function fromSqlite(id, path) {
  return fromD1(id, await d1Over(path), "database");
}

/** The snapshot, which is what a builder uses when nobody has
    said otherwise.

    `content/schools.backup.json` is an export of the same three
    tables, and it is read by loading it into an in-memory
    database and going through `shared/schools.js` exactly as the
    live one does. So there is one implementation of "what is a
    ladder", and a build from the file runs the same code as a
    build from D1. The note at the top of `schools-snapshot.mjs`
    says why the file exists at all. */
async function fromSnapshot(id) {
  return fromD1(id, await d1FromSnapshot(id), "snapshot");
}

async function fromD1(id, d1, from) {
  const stages = await stagesOf(d1, id);
  const within = WITHIN[id];

  /* The bodies, in the shape the builders already expect:
     `bodies[stageSlug][lessonSlug]` is the HTML. They are fetched
     per stage rather than with the ladder, because a ladder page
     names every lesson and needs none of their text. */
  const bodies = {};
  for (const stage of stages) {
    bodies[stage.slug] = {};
    const rows = await d1.prepare(
      `SELECT slug, body FROM school_lessons
        WHERE school = ? AND stage = ? ORDER BY position`
    ).bind(id, stage.slug).all();
    for (const row of rows.results ?? []) {
      /* An empty body is left out rather than written in as an
         empty string, because that is what a missing key in
         content/<stage>.js means and the builders already draw a
         "coming soon" page for it. Handing them "" instead would
         produce a page with an empty article in it. */
      if (row.body) bodies[stage.slug][row.slug] = row.body;
    }
  }

  d1.handle.close();
  return { stages, bodies, within, from };
}

/* ---------- the switch ---------- */

/** Where this build's curriculum comes from.

    Three sources, and the default has moved. TRANSITION.md Stage
    8 step 4: the prose is edited in the database now, so the
    files can no longer be what a build reads, or a lesson written
    in the Studio would never reach a page.

      (nothing)              content/schools.backup.json
      SCHOOL_DB=/tmp/x.db    that SQLite copy of D1
      SCHOOL_FILES=1         the curriculum files

    `SCHOOL_FILES` exists for `schools-build.test.mjs`, which has
    to build both ways to compare them. It is not a way to
    publish: the files are a copy nothing writes to any more, and
    a build from them would quietly undo whatever was last saved
    in the Studio. */
export async function sourceFor(id, {
  sqlite = process.env.SCHOOL_DB,
  files = process.env.SCHOOL_FILES,
} = {}) {
  if (sqlite) return fromSqlite(id, sqlite);
  if (files) return fromFiles(id);
  return fromSnapshot(id);
}

export { fromFiles, fromSqlite, fromSnapshot, d1Over };
