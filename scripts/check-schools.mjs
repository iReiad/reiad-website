/* ============================================================
   check-schools.mjs: does the snapshot still describe the same
   four schools the curriculum files do?

     node scripts/check-schools.mjs

   archive/TRANSITION.md Stage 8, step 4. Two files now say what a ladder
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

   ---- and a second question, added for Stage 11.7 ----

   There is now a third place the ladder's arithmetic is written:
   `shared/schools.js`, which is where it had to go for a Next.js
   route to reach it, because `next/` cannot import out of its own
   directory. It holds `lessonUrl`, `lessonId`, `lessonLabel` and
   the rest, and while the four `curriculum.js` modules survive it
   is a second implementation of each.

   Two spellings of a URL that agree today and drift tomorrow is
   how a link goes dead without an error anywhere, so the second
   half of this file computes every lesson's address, progress id
   and label BOTH ways and fails on any pair that disagree. The
   money school is the one that makes this worth doing: its
   starter guide's lessons are anchors in a hub rather than pages,
   and `basics-1` files progress under a bare slug because its
   eighteen terms did so for a year before that stage existed.
   Neither is guessable from the shape of the data.

   When the school pages stop being files, the modules go, this
   half goes with them, and `shared/schools.js` is simply where
   the arithmetic lives.
   ============================================================ */

import { SCHOOLS, readSchool } from "./import-schools.mjs";
import { readSnapshot } from "./schools-snapshot.mjs";
import { fromSnapshot } from "./school-source.mjs";
import { laddered, stageUrl, workbookUrl } from "../shared/schools.js";

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

/* ============================================================
   the second question: do the two sets of helpers agree?

   `shared/schools.js` is handed a ladder read out of the snapshot
   and asked for each lesson's URL, id and label. The school's own
   `curriculum.js` is handed the same ladder and asked the same
   thing through whichever names it uses for them. Every school
   spells the flattening differently (`stageLessons`,
   `stufeTeile`, `dhapLessons`, `termParts`) and that is the
   point: four spellings of one function is what the shared one
   replaces.

   `days` is compared only where the file computes it, which is
   the Quranic Arabic school alone: it is the only one whose
   lessons can cover more than one day, and asking the other three
   for a number they never had would be inventing a disagreement
   rather than finding one. Same for `label`: two schools number
   their lessons and two do not.
   ============================================================ */

const FLATTEN = {
  money: (m, stage) => m.stageLessons(stage),
  deutsch: (m, stage) => m.stufeTeile(stage),
  quran: (m, stage) => m.dhapLessons(stage),
  english: (m, stage) => m.termParts(stage),
};

/* The stage's own contents page, under each school's name for it.
   Four exports, one address. */
const STAGE_URL = {
  money: (m, stage) => m.stageUrl(stage),
  deutsch: (m, stage) => m.stufeUrl(stage),
  quran: (m, stage) => m.dhapUrl(stage),
  english: (m, stage) => m.termUrl(stage),
};

/* The English school labels a part in a helper of its own rather
   than on the object, so it is asked for one; the other three
   either put it on the lesson or do not have one. */
const LABEL = {
  english: (m, lesson) => m.partLabel(lesson),
};

let agreed = 0;

for (const school of SCHOOLS) {
  const mod = await import(`../aab/${school.dir}/curriculum.js`);
  const { stages } = await fromSnapshot(school.id);

  for (const stage of stages) {
    const mine = laddered(school.id, stage);
    const theirs = FLATTEN[school.id](mod, stage);

    if (mine.length !== theirs.length) {
      problems.push(`${school.id}: stage "${stage.slug}" flattens to `
        + `${mine.length} lessons through shared/schools.js and `
        + `${theirs.length} through aab/${school.dir}/curriculum.js`);
      continue;
    }

    const here = stageUrl(school.id, stage);
    const there = STAGE_URL[school.id](mod, stage);
    if (here !== there) {
      problems.push(`${school.id}: stage "${stage.slug}" is at "${here}" `
        + `through shared/schools.js and "${there}" through curriculum.js`);
    }

    const bookHere = workbookUrl(school.id, stage) || "";
    const bookThere = (mod.workbookUrl ? mod.workbookUrl(stage) : null) || "";
    if (bookHere !== bookThere) {
      problems.push(`${school.id}: the practice book of "${stage.slug}" is `
        + `"${bookHere || "(none)"}" through shared/schools.js and `
        + `"${bookThere || "(none)"}" through curriculum.js`);
    }

    mine.forEach((lesson, i) => {
      const other = theirs[i];
      agreed += 1;

      const say = (what, a, b) => problems.push(
        `${school.id}: the ${what} of "${stage.slug}/${lesson.slug}" is `
        + `"${a}" through shared/schools.js and "${b}" through `
        + `aab/${school.dir}/curriculum.js`);

      if (lesson.url !== other.url) say("URL", lesson.url, other.url);
      if (lesson.id !== other.id) say("progress id", lesson.id, other.id);

      const otherLabel = other.label ?? (LABEL[school.id]?.(mod, other) ?? "");
      if ((lesson.label || "") !== (otherLabel || "")) {
        say("label", lesson.label, otherLabel);
      }

      /* Only where the file has an opinion. */
      if (other.days !== undefined && lesson.days !== other.days) {
        say("day count", lesson.days, other.days);
      }
    });
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
console.log(`         ${agreed} lessons address and identify themselves the same `
  + `way\n         through shared/schools.js and through curriculum.js.`);
