#!/usr/bin/env node
/* ============================================================
   check-all.ts: every check and every fast test, in one command.

       node scripts/check-all.ts             checks, then tests
       node scripts/check-all.ts --checks    checks only
       node scripts/check-all.ts --stage=X   one stage: checks,
                                              generated or tests
       node scripts/check-all.ts --quiet     one line per failure

   THE LIST BELOW IS THE ONLY LIST. `.github/workflows/checks.yml`
   ran its own copy of it in three hand-written steps until 19
   August 2026, and it was a second copy of a list, which is the
   failure the top of `CLAUDE.md` is about. It bit exactly the way
   that file predicts: renaming four generators to `.ts` updated
   this file, every document that named them and nothing in the
   workflow, so CI would have failed on a file that no longer
   existed, for a rename that was correct.

   The workflow calls `--stage` now, once per step, so the steps
   stay separate in the GitHub interface and the list stays here.

   Independent within a stage, so they run together rather than one
   after another: the whole suite is a few seconds instead of most
   of a minute. Stages are sequential because a build check that
   runs before the thing it checks was rebuilt reports a drift that
   is not there.

   Anything needing a browser, a server or a network is NOT here.
   Those are listed in CLAUDE.md under "Before deploying" and have
   to be run by hand.
   ============================================================ */

import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cpus } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const QUIET = process.argv.includes("--quiet");
const ONLY_CHECKS = process.argv.includes("--checks");
/** One stage by name, for a CI step that wants its own heading. */
const STAGE = process.argv.find((a) => a.startsWith("--stage="))?.slice(8);

/** One thing to run: a path, or a path and its arguments. */
type Entry = string | string[];

/** What one finished, with everything it said on both streams:
    a check that failed and printed nothing is a check nobody can
    act on, so stdout and stderr are kept together and in order. */
interface Result {
  name: string;
  code: number | null;
  out: string;
}

const STAGES: Array<[stage: string, entries: Entry[]]> = [
  ["checks", [
    /* First, because node strips the types in every other file
       below without reading them: a check whose own annotations
       are wrong reports on the site rather than on itself. */
    "scripts/check-types.ts",
    /* Second, and beside it for the same reason: it is a check on
       this repository's own writing rather than on the site, and
       what it catches is a comment sending a reader somewhere
       that is not there. */
    "scripts/check-pointers.ts",
    "scripts/check-routes.ts",
    "scripts/check-css.ts",
    "scripts/check-sw.ts",
    "scripts/check-content.ts",
    "scripts/check-csp.ts",
    "scripts/check-crons.ts",
    "scripts/check-pieces.ts",
    "scripts/check-headers.ts",
    "scripts/check-schools.ts",
    "scripts/check-rows.ts",
    "scripts/check-api.ts",
    "scripts/check-contrast.ts",
    "scripts/check-surfaces.ts",
    "scripts/check-components.ts",
    "scripts/check-jsx-space.ts",
    "scripts/check-scale.ts",
    "scripts/check-prefixes.ts",
    "scripts/check-selfref.ts",
    /* The other half of check-selfref.ts: that one guards the
       TOKEN namespaces Tailwind owns, this one guards the class
       names. `.ring` is a utility and was also this site's
       progress ring, and layer order cannot help. */
    "scripts/check-utility-clash.ts",
    /* The extension rule, which was a paragraph in CLAUDE.md
       until 19 August 2026 and was broken anyway: the
       neighbours are the pattern, so somebody adding a test
       opens the one beside it and writes another `.mjs`. */
    "scripts/check-mjs.ts",
    "scripts/check-next.ts",
    "scripts/check-courses.ts",
    "scripts/check-accents.ts",
  ]],
  ["generated", [
    ["scripts/build-modules.ts", "--check"],
    ["scripts/build-fallback.ts", "--check"],
    ["scripts/build-school-icons.ts", "--check"],
    ["scripts/build-stamp.ts", "--check"],
    ["scripts/import-courses.ts", "--crawl", "scripts/fixtures/course-crawl", "--check"],
  ]],
  ["tests", [
    "scripts/input.test.ts",
    "scripts/reader.test.ts",
    "scripts/comments.test.ts",
    "scripts/restore.test.ts",
    "scripts/snapshot.test.ts",
    "scripts/schools.test.ts",
    "scripts/schools-api.test.ts",
    "functions/_lib/notion.test.ts",
    "functions/_lib/drive.test.ts",
    "functions/_lib/quiz.test.ts",
    "aab/schools/progress.test.ts",
    "next/progress.test.ts",
    "next/comments.test.ts",
    "aab/schools/hub.test.ts",
    "aab/schools/workbook.test.ts",
    "aab/courses.test.ts",
    "aab/portfolio/stress.test.ts",
    "aab/portfolio/scorecard.test.ts",
    "aab/portfolio/frontier.test.ts",
    "aab/portfolio/dissertation.test.ts",
  ]],
];

/* One spare core, so a laptop stays usable while this runs. */
const AT_ONCE = Math.max(2, (cpus().length || 4) - 1);

function run(entry: Entry): Promise<Result> {
  const argv = Array.isArray(entry) ? entry : [entry];
  return new Promise<Result>((done) => {
    const child = spawn(process.execPath, argv, { cwd: ROOT });
    let out = "";
    child.stdout.on("data", (d) => { out += d; });
    child.stderr.on("data", (d) => { out += d; });
    child.on("close", (code) => done({ name: argv[0], code, out }));
    child.on("error", (err) => done({ name: argv[0], code: 1, out: String(err) }));
  });
}

/** At most `AT_ONCE` at a time, keeping the machine responsive. */
async function pool(entries: Entry[]): Promise<Result[]> {
  const results: Result[] = [];
  let next = 0;
  const workers = Array.from({ length: Math.min(AT_ONCE, entries.length) }, async () => {
    while (next < entries.length) {
      const mine = entries[next];
      next += 1;
      results.push(await run(mine));
    }
  });
  await Promise.all(workers);
  return results;
}

const started = process.hrtime.bigint();
const failures: Result[] = [];
let ran = 0;

if (STAGE && !STAGES.some(([name]) => name === STAGE)) {
  console.error(`No stage called "${STAGE}". They are: `
    + `${STAGES.map(([name]) => name).join(", ")}.`);
  process.exit(1);
}

for (const [stage, entries] of STAGES) {
  if (STAGE && stage !== STAGE) continue;
  if (ONLY_CHECKS && stage === "tests") continue;

  const results = await pool(entries);
  ran += results.length;

  const bad = results.filter((r) => r.code !== 0);
  failures.push(...bad);

  if (!QUIET) {
    const label = `${stage} (${results.length})`;
    console.log(`${bad.length ? "FAIL" : "  ok"}  ${label}`);
    for (const r of bad) console.log(`      ${r.name}`);
  }
}

const seconds = Number(process.hrtime.bigint() - started) / 1e9;

if (failures.length) {
  for (const f of failures) {
    console.error(`\n${"=".repeat(60)}\n${f.name}\n${"=".repeat(60)}`);
    console.error(f.out.trimEnd());
  }
  console.error(`\n${failures.length} of ${ran} failed in ${seconds.toFixed(1)}s.\n`);
  process.exit(1);
}

console.log(`\nall ${ran} passed in ${seconds.toFixed(1)}s.\n`);
