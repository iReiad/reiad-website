/* ============================================================
   check-schools.mjs: does the snapshot still describe the same
   four schools the curriculum files do?

     node scripts/check-schools.mjs

   TRANSITION.md Stage 8, step 4. Two files now say what a ladder
   is, and they are read by different people:

   - `aab/<school>/curriculum.js` is read by the BROWSER. Forty
     files import from one of the four, and every hub, ladder,
     breadcrumb, palette entry and precache list comes out of
     them. They stay until Stage 11.7 replaces the pages that
     read them.
   - `content/schools.backup.json` is read by the BUILDERS, and
     through them by every generated page.

   Adding a lesson to `curriculum.js` and not to the database
   gives a ladder with a rung that leads to a page nobody built.
   Taking one out of the database and not the file gives a link
   to a page that is no longer written. Neither is an error
   anywhere: both render, both deploy, and the first person to
   find out is a reader following a link.

   So this compares them, and it compares the things a reader
   would notice: which lessons exist, in which order, in which
   section, under which stage. It deliberately does NOT compare
   titles or prose, because those are edited in the Studio now
   and the file is not expected to keep up with them.
   ============================================================ */

import { SCHOOLS, readSchool } from "./import-schools.mjs";
import { readSnapshot } from "./schools-snapshot.mjs";

const snapshot = readSnapshot();
const problems = [];

/** The shape of a school that both sides can be reduced to: the
    ladder, and nothing that anybody edits. */
const shapeOf = (rows, id) => ({
  stages: rows.stages
    .filter((s) => s.school === id)
    .sort((a, b) => a.position - b.position)
    .map((s) => `${s.position}:${s.slug}:${s.status}`),
  lessons: rows.lessons
    .filter((l) => l.school === id)
    .sort((a, b) => (a.stage < b.stage ? -1 : a.stage > b.stage ? 1 : a.position - b.position))
    .map((l) => `${l.stage}/${l.position}:${l.slug}:${l.section}:${l.status}`),
});

let checked = 0;

for (const school of SCHOOLS) {
  const fromFiles = shapeOf(await readSchool(school), school.id);
  const fromSnapshot = shapeOf(snapshot, school.id);

  for (const part of ["stages", "lessons"]) {
    const a = fromFiles[part];
    const b = fromSnapshot[part];
    checked += a.length;

    const onlyFile = a.filter((x) => !b.includes(x));
    const onlySnap = b.filter((x) => !a.includes(x));

    for (const line of onlyFile) {
      problems.push(`${school.id}: ${part.slice(0, -1)} "${line}" is in `
        + `aab/${school.dir}/curriculum.js and not in the snapshot`);
    }
    for (const line of onlySnap) {
      problems.push(`${school.id}: ${part.slice(0, -1)} "${line}" is in the `
        + `snapshot and not in aab/${school.dir}/curriculum.js`);
    }
  }
}

if (problems.length) {
  console.error("\nThe curriculum files and the snapshot disagree:\n");
  for (const line of problems) console.error(`  ${line}`);
  console.error("\nIf the ladder changed, import it and export it again:");
  console.error("  node scripts/import-schools.mjs --out schools.sql");
  console.error("  npx wrangler d1 execute reiad --remote --file=schools.sql");
  console.error("  npx wrangler d1 export reiad --remote --output schools.db");
  console.error("  node scripts/export-schools.mjs --db schools.db\n");
  process.exit(1);
}

console.log(`schools: ${checked} ladder entries, the files and the snapshot agree.`);
