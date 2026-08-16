/* ============================================================
   export-schools.mjs: the schools out of D1 and into git.

     node scripts/export-schools.mjs --db schools.db
     node scripts/export-schools.mjs --from-files

   TRANSITION.md Stage 8, step 4. The other direction from
   `import-schools.mjs`, and the one that runs often: the prose is
   edited at `/studio/?lessons` now, and this is what carries a
   change from the row it was saved into to the file the builders
   read. See the note at the top of `schools-snapshot.mjs` for why
   there is a file in the middle at all.

   ---- getting the database onto a disk ----

   D1 is not a file you can open, so `--db` wants a local SQLite
   copy of it, which wrangler will make:

     npx wrangler d1 export reiad --remote --output schools.db

   ---- and --from-files, which exists for exactly two reasons ----

   The first snapshot had to come from somewhere, and on the day
   it was taken the files and the database were the same thing,
   proved field by field. And `schools-build.test.mjs` builds both
   ways to compare them, so the file side has to stay reachable.

   That second reason is also why the prose files are still in
   `aab/` rather than in `archive/`. The rule for archiving is
   that nothing serves it and nothing imports it, and two things
   still import them: that test, and `check-schools.mjs`. Moving
   them is a step of its own.

   Neither switch is a way to publish. A change typed into one of
   those files and exported from here would be a change nobody
   made in the Studio and nobody can see in the database, which is
   the two-sources-of-truth problem this whole stage exists to
   end.
   ============================================================ */

import { existsSync } from "node:fs";
import { relative } from "node:path";
import { SNAPSHOT, countsOf, writeSnapshot } from "./schools-snapshot.mjs";
import { SCHOOL_IDS } from "../shared/schools.js";

/* ---------- out of a SQLite copy of the database ---------- */

async function fromDatabase(path) {
  const { DatabaseSync } = await import("node:sqlite");
  if (!existsSync(path)) throw new Error(`no such database: ${path}`);
  const db = new DatabaseSync(path);

  const all = (table) => db.prepare(`SELECT * FROM ${table}`).all();
  const rows = {
    stages: all("school_stages"),
    sections: all("school_sections"),
    lessons: all("school_lessons"),
  };
  db.close();

  /* A database with no schools in it is the failure this whole
     stage has already had twice, in the other direction: an
     import that wrote nothing and said it had worked. An export
     that writes an empty snapshot over a good one is the same
     mistake with the blast radius pointing at git. */
  if (!rows.lessons.length) {
    throw new Error(
      `${path} has no lessons in it. Nothing was written.\n`
      + `  If this came from wrangler, check the export actually ran.`
    );
  }
  const missing = SCHOOL_IDS.filter((id) => !rows.lessons.some((l) => l.school === id));
  if (missing.length) {
    throw new Error(
      `${path} has no lessons for: ${missing.join(", ")}. Nothing was written.\n`
      + `  A snapshot missing a school would archive that school's pages.`
    );
  }

  return rows;
}

/* ---------- out of the curriculum files ---------- */

async function fromFiles() {
  const { readAll } = await import("./import-schools.mjs");
  return readAll();
}

/* ---------- the command ---------- */

if (import.meta.url === (await import("node:url")).pathToFileURL(process.argv[1] ?? "").href) {
  const args = process.argv.slice(2);
  const dbAt = args.indexOf("--db");
  const useFiles = args.includes("--from-files");

  if (!useFiles && dbAt === -1) {
    console.error("Say where the rows come from:\n"
      + "  --db <file>     a SQLite copy of D1 (wrangler d1 export)\n"
      + "  --from-files    the curriculum files, for the tests\n");
    process.exit(2);
  }

  const rows = useFiles ? await fromFiles() : await fromDatabase(args[dbAt + 1]);
  const out = writeSnapshot(rows);

  console.log(`\n  ${relative(process.cwd(), SNAPSHOT)}`);
  console.log(`  ${out.counts.stages} stages, ${out.counts.sections} sections, `
    + `${out.counts.lessons} lessons, ${out.counts.written} written.\n`);
  for (const id of SCHOOL_IDS) {
    const c = out.counts.bySchool[id];
    console.log(`  ${id.padEnd(9)} ${String(c.lessons).padStart(3)} lesson(s), `
      + `${c.written} written`);
  }
  console.log("\n  Nothing is published until the schools are rebuilt.\n");
}

export { fromDatabase, fromFiles, countsOf };
