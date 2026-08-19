/* ============================================================
   check-schools.ts: does the snapshot still describe the same
   four schools the ladders do?

     node scripts/check-schools.ts

   archive/TRANSITION.md Stage 8, step 4. Two files now say what a ladder
   is, and they are read by different people:

   - `shared/curricula/<school>.ts` is the ladder itself. Every
     hub, breadcrumb, palette entry and precache list comes out of
     one of the four, and `build-modules.ts` compiles each to the
     `/money/curriculum.js` the browser fetches.
   - `content/schools.backup.json` is the schools' committed
     backup, and it is what a check running with no network reads.

   Adding a lesson to a ladder and not to the database gives a
   rung that leads to a page nobody wrote. Taking one out of the
   database and not the ladder gives a link to a page that is no
   longer written. Neither is an error anywhere: both render, both
   deploy, and the first person to find out is a reader following
   a link.

   So this compares them, and it compares the things a reader
   would notice: which lessons exist, in which order, in which
   section, under which stage. It deliberately does NOT compare
   titles or prose, because those are edited in the Studio now
   and the file is not expected to keep up with them.

   ---- and a second question, added for Stage 11.7 ----

   The ladder's arithmetic is written twice. `shared/schools.ts`
   holds `lessonUrl`, `lessonId`, `lessonLabel` and the rest over a
   ladder read out of the DATABASE; each school's own file holds
   the same functions over the ladder it declares, under the names
   that school uses for them.

   Two spellings of a URL that agree today and drift tomorrow is
   how a link goes dead without an error anywhere, so the second
   half of this file computes every lesson's address, progress id
   and label BOTH ways and fails on any pair that disagree. The
   money school is the one that makes this worth doing: its
   starter guide's lessons are anchors in a hub rather than pages,
   and `basics-1` files progress under a bare slug because its
   eighteen terms did so for a year before that stage existed.
   Neither is guessable from the shape of the data.

   The day a school's own spellings go, this half goes with them
   and `shared/schools.ts` is simply where the arithmetic lives.
   ============================================================ */

import { SCHOOLS, readSchool } from "./import-schools.ts";
import { readSnapshot, type Rows } from "./schools-snapshot.ts";
import { fromSnapshot } from "./school-source.ts";
import { laddered, stageUrl, workbookUrl } from "../shared/schools.ts";

const snapshot = readSnapshot();
const problems: string[] = [];

/** A ladder reduced to two lists of strings, so that a difference
    is a line rather than a diff of objects. */
interface Shape {
  stages: string[];
  lessons: string[];
}

/* Both sides are rows keyed by column name and nothing narrower,
   which is what `Rows` says and what each of them really carries:
   the snapshot's come back out of JSON, and `readSchool()` walks
   four ladders whose own types are four different vocabularies.
   So the two coercions below are the comparison's, not a cast
   hiding a shape somebody knows. */
const str = (v: unknown): string => String(v ?? "");
const num = (v: unknown): number => Number(v) || 0;

/** The shape of a school that both sides can be reduced to: the
    ladder, and nothing that anybody edits. */
const shapeOf = (rows: Rows, id: string): Shape => ({
  stages: rows.stages
    .filter((s) => s.school === id)
    .sort((a, b) => num(a.position) - num(b.position))
    .map((s) => `${num(s.position)}:${str(s.slug)}:${str(s.status)}`),
  lessons: rows.lessons
    .filter((l) => l.school === id)
    .sort((a, b) => (str(a.stage) < str(b.stage) ? -1
      : str(a.stage) > str(b.stage) ? 1 : num(a.position) - num(b.position)))
    .map((l) => `${str(l.stage)}/${num(l.position)}`
      + `:${str(l.slug)}:${str(l.section)}:${str(l.status)}`),
});

let checked = 0;

for (const school of SCHOOLS) {
  const fromFiles = shapeOf(await readSchool(school), school.id);
  const fromSnapshot = shapeOf(snapshot, school.id);

  for (const part of ["stages", "lessons"] as const) {
    const a = fromFiles[part];
    const b = fromSnapshot[part];
    checked += a.length;

    const onlyFile = a.filter((x) => !b.includes(x));
    const onlySnap = b.filter((x) => !a.includes(x));

    for (const line of onlyFile) {
      problems.push(`${school.id}: ${part.slice(0, -1)} "${line}" is in `
        + `shared/curricula/${school.dir}.ts and not in the snapshot`);
    }
    for (const line of onlySnap) {
      problems.push(`${school.id}: ${part.slice(0, -1)} "${line}" is in the `
        + `snapshot and not in shared/curricula/${school.dir}.ts`);
    }
  }
}

/* ============================================================
   the second question: do the two sets of helpers agree?

   `shared/schools.ts` is handed a ladder read out of the snapshot
   and asked for each lesson's URL, id and label. The school's own
   file is handed the same ladder and asked the same thing through
   whichever names it uses for them. Every school spells the
   flattening differently (`stageLessons`, `stufeTeile`,
   `dhapLessons`, `termParts`) and that is the point: four
   spellings of one function is what the shared one replaces.

   `days` is compared only where the file computes it, which is
   the Quranic Arabic school alone: it is the only one whose
   lessons can cover more than one day, and asking the other three
   for a number they never had would be inventing a disagreement
   rather than finding one. Same for `label`: two schools number
   their lessons and two do not.
   ============================================================ */

/** One school's ladder module, of the parts asked for below.
    Each names the same four ideas differently, which is what the
    tables under this are for, and each declares its own stage
    type while the ladder handed in here came out of the DATABASE.
    Indexed rather than imported by name, because that boundary is
    exactly what this half is checking across. */
type Curriculum = Record<string, (...args: never[]) => unknown>;

/** A lesson as a school's own module hands it back. Compared
    against `laddered()` field by field below, so only the fields
    compared are named. */
interface TheirLesson {
  slug?: string;
  days?: number;
  [key: string]: unknown;
}

const FLATTEN: Record<string, (m: Curriculum, stage: unknown) => TheirLesson[]> = {
  money: (m, stage) => (m.stageLessons as (s: unknown) => TheirLesson[])(stage),
  deutsch: (m, stage) => (m.stufeTeile as (s: unknown) => TheirLesson[])(stage),
  quran: (m, stage) => (m.dhapLessons as (s: unknown) => TheirLesson[])(stage),
  english: (m, stage) => (m.termParts as (s: unknown) => TheirLesson[])(stage),
};

/* The stage's own contents page, under each school's name for it.
   Four exports, one address. */
const STAGE_URL: Record<string, (m: Curriculum, stage: unknown) => string> = {
  money: (m, stage) => (m.stageUrl as (s: unknown) => string)(stage),
  deutsch: (m, stage) => (m.stufeUrl as (s: unknown) => string)(stage),
  quran: (m, stage) => (m.dhapUrl as (s: unknown) => string)(stage),
  english: (m, stage) => (m.termUrl as (s: unknown) => string)(stage),
};

/* The English school labels a part in a helper of its own rather
   than on the object, so it is asked for one; the other three
   either put it on the lesson or do not have one. */
const LABEL: Record<string, (m: Curriculum, lesson: TheirLesson) => string> = {
  english: (m, lesson) => (m.partLabel as (l: TheirLesson) => string)(lesson),
};

let agreed = 0;

for (const school of SCHOOLS) {
  const mod = await import(`../shared/curricula/${school.dir}.ts`) as Curriculum;
  const { stages } = await fromSnapshot(school.id);

  for (const stage of stages) {
    const mine = laddered(school.id, stage);
    const theirs = FLATTEN[school.id](mod, stage);

    if (mine.length !== theirs.length) {
      problems.push(`${school.id}: stage "${stage.slug}" flattens to `
        + `${mine.length} lessons through shared/schools.ts and `
        + `${theirs.length} through shared/curricula/${school.dir}.ts`);
      continue;
    }

    const here = stageUrl(school.id, stage);
    const there = STAGE_URL[school.id](mod, stage);
    if (here !== there) {
      problems.push(`${school.id}: stage "${stage.slug}" is at "${here}" `
        + `through shared/schools.ts and "${there}" through `
        + `shared/curricula/${school.dir}.ts`);
    }

    const bookHere = workbookUrl(school.id, stage) || "";
    const theirBook = mod.workbookUrl as ((s: unknown) => string | null) | undefined;
    const bookThere = (theirBook ? theirBook(stage) : null) || "";
    if (bookHere !== bookThere) {
      problems.push(`${school.id}: the practice book of "${stage.slug}" is `
        + `"${bookHere || "(none)"}" through shared/schools.ts and `
        + `"${bookThere || "(none)"}" through `
        + `shared/curricula/${school.dir}.ts`);
    }

    mine.forEach((lesson, i) => {
      const other = theirs[i];
      agreed += 1;

      const say = (what: string, a: unknown, b: unknown): number => problems.push(
        `${school.id}: the ${what} of "${stage.slug}/${lesson.slug}" is `
        + `"${a}" through shared/schools.ts and "${b}" through `
        + `shared/curricula/${school.dir}.ts`);

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
  console.error("\nThe ladders and the snapshot disagree:\n");
  for (const line of problems) console.error(`  ${line}`);
  console.error("\nIf the ladder changed, import it and export it again:");
  console.error("  node scripts/import-schools.ts --out schools.sql");
  console.error("  npx wrangler d1 execute reiad --remote --file=schools.sql");
  console.error("  npx wrangler d1 export reiad --remote --output schools.db");
  console.error("  node scripts/export-schools.ts --db schools.db\n");
  process.exit(1);
}

console.log(`schools: ${checked} ladder entries, the ladders and the snapshot agree.`);
console.log(`         ${agreed} lessons address and identify themselves the same `
  + `way\n         through shared/schools.ts and through `
  + `shared/curricula/.`);
