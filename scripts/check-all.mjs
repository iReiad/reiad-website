#!/usr/bin/env node
/* ============================================================
   check-all.mjs: every check and every fast test, in one command.

       node scripts/check-all.mjs           checks, then tests
       node scripts/check-all.mjs --checks  checks only
       node scripts/check-all.mjs --quiet   one line per failure

   The list is the same one `.github/workflows/checks.yml` runs and
   in the same order, so a green run here is a green run there.

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

const STAGES = [
  ["checks", [
    "scripts/check-routes.js",
    "aab/check-css.mjs",
    "scripts/check-sw.js",
    "aab/check-content.mjs",
    "scripts/check-csp.js",
    "scripts/check-crons.mjs",
    "scripts/check-pieces.mjs",
    "scripts/check-headers.mjs",
    "scripts/check-schools.mjs",
    "scripts/check-rows.mjs",
    "scripts/check-api.mjs",
    "scripts/check-contrast.mjs",
    "scripts/check-surfaces.mjs",
    "scripts/check-components.mjs",
    "scripts/check-scale.mjs",
    "scripts/check-next.mjs",
    "scripts/check-courses.mjs",
    "scripts/check-accents.mjs",
  ]],
  ["generated", [
    ["scripts/build-modules.mjs", "--check"],
    ["scripts/build-styles.mjs", "--check"],
    ["scripts/build-school-icons.mjs", "--check"],
    ["scripts/import-courses.mjs", "--crawl", "scripts/fixtures/course-crawl", "--check"],
  ]],
  ["tests", [
    "scripts/input.test.mjs",
    "scripts/reader.test.mjs",
    "scripts/comments.test.mjs",
    "scripts/restore.test.mjs",
    "scripts/snapshot.test.mjs",
    "scripts/schools.test.mjs",
    "scripts/schools-api.test.mjs",
    "functions/_lib/notion.test.mjs",
    "functions/_lib/drive.test.mjs",
    "functions/_lib/quiz.test.mjs",
    "aab/schools/progress.test.mjs",
    "next/progress.test.mjs",
    "aab/schools/hub.test.mjs",
    "aab/schools/workbook.test.mjs",
    "aab/courses.test.mjs",
    "aab/portfolio/stress.test.mjs",
    "aab/portfolio/scorecard.test.mjs",
    "aab/portfolio/frontier.test.mjs",
    "aab/portfolio/dissertation.test.mjs",
  ]],
];

/* One spare core, so a laptop stays usable while this runs. */
const AT_ONCE = Math.max(2, (cpus().length || 4) - 1);

function run(entry) {
  const argv = Array.isArray(entry) ? entry : [entry];
  return new Promise((done) => {
    const child = spawn(process.execPath, argv, { cwd: ROOT });
    let out = "";
    child.stdout.on("data", (d) => { out += d; });
    child.stderr.on("data", (d) => { out += d; });
    child.on("close", (code) => done({ name: argv[0], code, out }));
    child.on("error", (err) => done({ name: argv[0], code: 1, out: String(err) }));
  });
}

/** At most `AT_ONCE` at a time, keeping the machine responsive. */
async function pool(entries) {
  const results = [];
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
const failures = [];
let ran = 0;

for (const [stage, entries] of STAGES) {
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
