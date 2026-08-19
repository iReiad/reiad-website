#!/usr/bin/env node
/* ============================================================
   build-school-tree.ts: the four ladders, for the two places
   that need them and cannot ask the database.

       node scripts/build-school-tree.ts           # write both
       node scripts/build-school-tree.ts --check   # or compare

   Two files out, one level deep each:

     next/lib/school-stages.ts    the stages, for the header tree
     next/lib/school-ladders.ts   the live lessons, for /account.html

   The header's tree shows every school's stages under the school
   (`next/components/nav-tree.tsx`). That list belongs to the
   database, and the first version of this read it: one query in
   the shell, four schools, seventeen stages.

   ---- why it is a file instead ----

   Chrome renders on every page, and half this site's routes are
   prerendered at build time, where there is no D1 binding. So the
   query answered on the school pages and answered nothing on
   `/about.html`, `/tools/stock.html` and thirteen others: the
   same menu, two levels deep on some pages and one on the rest.
   A component that renders differently depending on which Worker
   phase drew it is the drift this repository keeps returning to,
   and it is invisible, because both versions look finished.

   `content/schools.backup.json` is the committed export of those
   rows and is already read by two checks for exactly this reason:
   it is the only copy of the ladder that a build with no network
   can see. Refreshed by `scripts/export-schools.mjs`, which is in
   `CLAUDE.md` under "Where a lesson's words live".

   Titles and prose are the Studio's and change often; a STAGE
   list changes when a school gains a stage, which has happened
   four times in a year. That is what makes this safe to commit
   and `check-next.mjs` is what keeps it honest.

   ---- and why the account page is here too ----

   `/account.html` draws a bar per school, and a bar needs a
   denominator: how many lessons that school actually holds. It
   used to import all four `curriculum.js` modules in the browser
   to find out, 150 KB of them, which is the exact shape
   `next/lib/progress.ts` is written against: **the ladder is the
   server's and the ticks are the browser's.**

   That route is prerendered, so the server here is this script.
   The lesson list is 20 KB of ids, addresses and titles, which is
   an eighth of what the four modules cost and arrives with the
   page instead of after it.

   A lesson TITLE can be edited in the Studio between refreshes,
   and that is the one thing this file carries that changes often.
   It is worth it and the failure is small: a renamed lesson shows
   its old name on one card on one page until the snapshot is
   refreshed. Nothing is counted from a title.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const STAGES_OUT = join(ROOT, "next", "lib", "school-stages.ts");
const LADDER_OUT = join(ROOT, "next", "lib", "school-ladders.ts");
const SNAPSHOT = join(ROOT, "content", "schools.backup.json");

const SCHOOLS = ["money", "deutsch", "quran", "english"] as const;

/* The snapshot's rows, as `scripts/schools-snapshot.ts` writes
   them: every column a string except `position` and `minutes`,
   and `meta` a JSON string rather than an object. Typed here as
   what the FILE holds, not as what the site works with, because
   that is what this reads. */
interface StageRow {
  school: string;
  slug: string;
  position: number;
  title: string;
  status: string;
  meta: string;
}

interface LessonRow {
  school: string;
  stage: string;
  slug: string;
}

interface Snapshot {
  stages: StageRow[];
  lessons: LessonRow[];
}

/** What a stage's `meta` carries, of the parts this file reads.
    Everything else in there belongs to the hub. */
interface StageMeta {
  kicker?: string;
}

const metaOf = (row: StageRow): StageMeta => {
  try { return JSON.parse(row.meta || "{}") as StageMeta; } catch { return {}; }
};

export function generate(): string {
  const snap = JSON.parse(readFileSync(SNAPSHOT, "utf8")) as Snapshot;

  const lines: string[] = [];
  for (const school of SCHOOLS) {
    const stages = snap.stages
      .filter((s) => s.school === school && s.status === "live")
      .sort((a, b) => a.position - b.position);

    const rows = stages.map((stage) => {
      const meta = metaOf(stage);
      /* Counted, never remembered: the number beside a stage in
         the header is how many lesson rows that stage has. */
      const lessons = snap.lessons
        .filter((l) => l.school === school && l.stage === stage.slug).length;
      const kicker = meta.kicker ? `, kicker: ${JSON.stringify(meta.kicker)}` : "";
      return `    { slug: ${JSON.stringify(stage.slug)}, `
        + `label: ${JSON.stringify(stage.title)}${kicker}, lessons: ${lessons} },`;
    });

    lines.push(`  ${school}: [`, ...rows, `  ],`);
  }

  return `/* GENERATED by scripts/build-school-tree.ts. Do not edit.

   The four ladders one level deep, out of content/schools.backup.json,
   for the header's tree. Half this site's routes are prerendered with
   no D1 binding, so the menu cannot ask the database for this without
   being two levels deep on some pages and one on the others.

   Refresh it with the snapshot:

     npx wrangler d1 export reiad --remote --output schools.db
     node scripts/export-schools.mjs --db schools.db
     node scripts/build-school-tree.ts

   scripts/check-next.mjs fails if this file and the snapshot disagree. */

export interface TreeStage {
  slug: string;
  /** The stage's own name, as its hub shows it. */
  label: string;
  /** "Stufe 2", "ধাপ ৩": the short form, where the stage has one. */
  kicker?: string;
  /** How many pages are inside. */
  lessons: number;
}

export const SCHOOL_STAGES: Record<string, TreeStage[]> = {
${lines.join("\n")}
};
`;
}

/* ------------------------------------------------------------
   The lessons, for /account.html
   ------------------------------------------------------------ */

/** Every live lesson of every school, in ladder order.

    Read back out through `shared/schools.ts` rather than reshaped
    from the JSON here, which is the whole reason
    `d1FromSnapshot` exists: the grouping of lessons into
    sections, the ordering and the spreading of `meta` are decided
    in one place, and this build runs the same code a build
    against the live database would. A second implementation of
    that grouping is how the two quietly stop agreeing. */
export async function generateLadders(): Promise<string> {
  const { d1FromSnapshot, readSnapshot } = await import("./schools-snapshot.mjs");
  const { stagesOf, laddered } = await import("../shared/schools.ts");

  const snap = readSnapshot(SNAPSHOT);
  const lines: string[] = [];
  let count = 0;

  for (const school of SCHOOLS) {
    const db = await d1FromSnapshot(school, snap);
    const stages = await stagesOf(db, school);

    /* Live only. A bar counts what a reader can actually open,
       which is the same filter the school hubs use, and carrying
       the unwritten ones so that every consumer could filter them
       again is a denominator waiting to be got wrong once. */
    const rows = stages
      .flatMap((stage) => laddered(school, stage))
      .filter((lesson) => (lesson.status ?? "live") === "live")
      .map((lesson) => `    { id: ${JSON.stringify(lesson.id)},`
        + ` url: ${JSON.stringify(lesson.url)},`
        + ` title: ${JSON.stringify(String(lesson.bn ?? lesson.en ?? lesson.id))} },`);

    count += rows.length;
    lines.push(`  ${school}: [`, ...rows, `  ],`);
  }

  return `/* GENERATED by scripts/build-school-tree.ts. Do not edit.

   Every live lesson of the four schools, in ladder order, out of
   content/schools.backup.json. ${count} of them.

   /account.html draws a bar per school and a bar needs a denominator.
   That route is prerendered, so it has no D1 binding and the server
   that reads the rows is the generator rather than the request. The
   rule is unchanged and is the one next/lib/progress.ts states: the
   ladder is the server's and the ticks are the browser's.

   Refresh it with the snapshot:

     npx wrangler d1 export reiad --remote --output schools.db
     node scripts/export-schools.mjs --db schools.db
     node scripts/build-school-tree.ts

   scripts/check-next.mjs fails if this file and the snapshot disagree. */

export interface LadderLesson {
  /** What this lesson's tick is filed under, and the only field
      anything decides anything by. Never an address: a lesson can
      move and an id cannot. */
  id: string;
  url: string;
  title: string;
}

export const SCHOOL_LADDERS: Record<string, LadderLesson[]> = {
${lines.join("\n")}
};
`;
}

/* Only when run, never when imported: `check-next.mjs` imports
   both generators to compare, and a generator that wrote its
   output on import would make that check pass by fixing what it
   found. */
const RUN = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (RUN) {
  const files: Array<[name: string, path: string, wanted: string]> = [
    ["next/lib/school-stages.ts", STAGES_OUT, generate()],
    ["next/lib/school-ladders.ts", LADDER_OUT, await generateLadders()],
  ];

  if (process.argv.includes("--check")) {
    let stale = 0;
    for (const [name, path, wanted] of files) {
      const have = (() => {
        try { return readFileSync(path, "utf8"); } catch { return ""; }
      })();
      if (have !== wanted) {
        stale += 1;
        console.error(`${name} is not what content/schools.backup.json holds.`);
      }
    }
    if (stale) {
      console.error("\nRegenerate them:\n  node scripts/build-school-tree.ts\n");
      process.exit(1);
    }
    console.log("next/lib/school-stages.ts and school-ladders.ts match the snapshot.");
  } else {
    for (const [name, path, wanted] of files) {
      writeFileSync(path, wanted);
      console.log(`wrote ${name}`);
    }
  }
}
