#!/usr/bin/env node
/* ============================================================
   check-all.ts: every check and every fast test, in one command.

       node scripts/check-all.ts             checks, then tests
       node scripts/check-all.ts --checks    checks only
       node scripts/check-all.ts --stage=X   one stage: checks,
                                              generated or tests
       node scripts/check-all.ts --changed   only what the changed
                                              files could have broken
       node scripts/check-all.ts --since=REF what --changed compares
                                              against (origin/main)
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
   Those are listed in HANDBOOK.md under "Before deploying" and have
   to be run by hand.
   ============================================================ */

import { spawn, execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { cpus } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const QUIET = process.argv.includes("--quiet");
const ONLY_CHECKS = process.argv.includes("--checks");
/** One stage by name, for a CI step that wants its own heading. */
const STAGE = process.argv.find((a) => a.startsWith("--stage="))?.slice(8);
/** Only the entries whose inputs changed. CI never passes this: the
    full list runs on every push, so a scoped local run cannot lower
    the bar, only save the minutes between a one-line edit and the
    answer. */
const CHANGED = process.argv.includes("--changed");
const SINCE = process.argv.find((a) => a.startsWith("--since="))?.slice(8) ?? "origin/main";

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
    "scripts/check-calculators.ts",
    "scripts/check-csp.ts",
    "scripts/check-crons.ts",
    "scripts/check-pieces.ts",
    "scripts/check-headers.ts",
    "scripts/check-schools.ts",
    "scripts/check-money.ts",
    "scripts/check-english.ts",
    "scripts/check-rows.ts",
    "scripts/check-rls.ts",
    "scripts/check-migrations.ts",
    "scripts/check-api.ts",
    "scripts/check-app-surface.ts",
    "scripts/check-contrast.ts",
    "scripts/check-surfaces.ts",
    "scripts/check-components.ts",
    "scripts/check-jsx-space.ts",
    /* The other half of the JSX the compiler cannot see: that one
       is a space the transform ate, this one is a paragraph
       holding a block, which the parser rearranges and React then
       refuses to adopt. */
    "scripts/check-jsx-nesting.ts",
    "scripts/check-scale.ts",
    "scripts/check-prefixes.ts",
    "scripts/check-selfref.ts",
    /* The other half of check-selfref.ts: that one guards the
       TOKEN namespaces Tailwind owns, this one guards the class
       names. `.ring` is a utility and was also this site's
       progress ring, and layer order cannot help. */
    "scripts/check-utility-clash.ts",
    /* The migration rule, which was a paragraph in CLAUDE.md
       and was broken the same day it was quoted: `glow.ts` was
       written into `aab/src/` because `tilt.ts` is there. The
       old system is a recorded list now and the list may only
       get shorter. */
    "scripts/check-closed.ts",
    /* Every endpoint under functions/api/ is gated or is public
       on purpose and says why. Forgetting a gate produces an
       endpoint that answers, returns the right shape, passes
       every other check, and works for everybody. */
    "scripts/check-admin.ts",
    /* The design is plain, and this is what keeps it plain: no
       blur, no perspective, no view-driven animation and no
       pointer light, in the stylesheet or in a component. Each
       of those shipped once and was the most expensive thing on
       the page. */
    "scripts/check-plain.ts",
    /* The reader's two type settings are written out twice, in
       the panel's table and in the boot script that runs before
       the first paint. A value in one and not the other is a
       preference that applies on the press and is written over
       on the next page load. */
    "scripts/check-prefs.ts",
    /* Everything this site keeps in a browser, against what the
       code actually writes and what the account actually carries.
       A key that says it syncs and is not in `sync.ts` is a
       promise the account page makes and the account does not
       keep, and the reader finds out on their second device. The
       first thing it found was two of them: the sentences a
       learner types into a practice book. */
    "scripts/check-storage.ts",
    /* And the other half of the same question, one floor up: what
       the ACCOUNT holds, and whether leaving takes it. Four of a
       reader's own tables were in neither the copy nor the erase
       on the day it was written, and both buttons reported
       success. */
    "scripts/check-account.ts",
    /* The twelve drawings and the six walls, which are rendered
       in two places that resolve their tokens in two completely
       different ways: the site cascades them and a share card
       SUBSTITUTES them out of a list. A thirteenth token is
       invisible on the site and a black rectangle on a card. */
    "scripts/check-art.ts",
    "scripts/check-icons.ts",
    /* The extension rule, which was a paragraph in CLAUDE.md
       until 19 August 2026 and was broken anyway: the
       neighbours are the pattern, so somebody adding a test
       opens the one beside it and writes another `.mjs`. */
    "scripts/check-mjs.ts",
    "scripts/check-dashes.ts",
    "scripts/check-next.ts",
    "scripts/check-courses.ts",
    /* DIET.md section 33's page-level half: a target printed with
       no medical advice line beside it, a widget whose empty
       state is a zero, a Bangla reader meeting an English string,
       and a column in the migration nothing can ever fill. The
       arithmetic is scripts/diet.test.ts in the tests stage. */
    "scripts/check-diet.ts",
    /* RESEARCH.md section 30's page-level half: the pages table
       against the routes, both halves of every phrase, every
       vocabulary against the migration, and that the desk it
       replaced is really gone. */
    "scripts/check-research.ts",
    "scripts/check-accents.ts",
  ]],
  ["generated", [
    ["scripts/build-modules.ts", "--check"],
    ["scripts/build-fallback.ts", "--check"],
    ["scripts/build-school-icons.ts", "--check"],
    ["scripts/build-stamp.ts", "--check"],
    ["scripts/import-courses.ts", "--crawl", "scripts/fixtures/course-crawl", "--check"],
    ["scripts/export-stock-fixtures.ts", "--check"],
    ["scripts/export-calculator-fixtures.ts", "--check"],
    ["scripts/export-portfolio-fixtures.ts", "--check"],
    ["scripts/export-routine-fixtures.ts", "--check"],
    /* The body and the energy, so the Kotlin port cannot drift.
       Every number this file produces is plausible: a resting
       burn with the wrong sex constant is 166 kcal out, which is
       a fifth of a deficit and looks exactly like a number. */
    ["scripts/export-diet-fixtures.ts", "--check"],
  ]],
  ["tests", [
    "scripts/input.test.ts",
    "scripts/reader.test.ts",
    "scripts/comments.test.ts",
    "scripts/restore.test.ts",
    "scripts/bundle.test.ts",
    "scripts/snapshot.test.ts",
    "scripts/routine.test.ts",
    /* The study planner's two routes against the workbook's own
       rows, cell for cell, and the tracker's formulas. */
    "scripts/netzwerk.test.ts",
    "scripts/diet.test.ts", "scripts/csv.test.ts",
    "scripts/research.test.ts", "scripts/research-stats.test.ts", "scripts/research-field.test.ts", "scripts/research-tools.test.ts", "scripts/research-assist.test.ts",
    "scripts/insights.test.ts", "scripts/activity.test.ts",
    "scripts/widgets.test.ts",
    /* `next/research.test.ts` is deliberately not here beside its
       sibling: it needs a browser, and without one it exits 0
       having asserted nothing, which is the silent skip this
       repository has already been caught by. It belongs with the
       browser tests under "Before deploying" until its skip says
       so out loud. */
    "next/recipes.test.ts",
    "scripts/admin.test.ts",
    "scripts/schools.test.ts",
    "scripts/schools-api.test.ts",
    "scripts/site-api.test.ts",
    "functions/_lib/notion.test.ts",
    "functions/_lib/drive.test.ts",
    "functions/_lib/quiz.test.ts",
    "functions/_lib/food.test.ts",
    "aab/schools/progress.test.ts",
    "next/progress.test.ts",
    /* The medals, which are arithmetic over the same keys. */
    "next/medals.test.ts",
    "next/comments.test.ts",
    "next/book-api.test.ts",
    "aab/schools/hub.test.ts",
    "aab/schools/workbook.test.ts",
    "aab/courses.test.ts",
    "aab/portfolio/stress.test.ts",
    "aab/portfolio/scorecard.test.ts",
    "aab/portfolio/frontier.test.ts",
    "aab/portfolio/dissertation.test.ts",
  ]],
];

/* ============================================================
   --changed: what each entry READS, as path prefixes (or `*.ext`
   for a suffix), so an edit to a food row does not run the
   research tests and an edit to a stylesheet does not rebuild the
   course catalogue.

   AN ENTRY WITH NO LINE HERE ALWAYS RUNS. That is the safe
   default: a check that reads the whole repository (dashes,
   pointers, types, mjs) or whose inputs are too spread to name
   stays on the list, and only a check with a small, known set of
   inputs is scoped. A pattern that is too narrow costs nothing in
   CI, which runs everything, and costs one missed local failure
   that CI then reports; so when in doubt, widen it.

   `scripts/check-all.ts` changing runs everything, and so does
   any change under `scripts/` that is not a fixture, because a
   check's own edit is the one thing its pattern cannot see.
   ============================================================ */
const WHEN: Record<string, string[]> = {
  "scripts/check-routes.ts": ["next/app/", "worker.js", "wrangler.toml", "aab/_redirects", "aab/.assetsignore", "aab/", "shared/nav.ts", "shared/content.ts"],
  "scripts/check-css.ts": ["*.css", "*.tsx", "aab/", "functions/_lib/sanitise.ts", "content/schools.backup.json"],
  "scripts/check-sw.ts": ["aab/"],
  "scripts/check-content.ts": ["shared/", "next/", "aab/", "content/"],
  "scripts/check-calculators.ts": ["aab/tools/", "aab/src/tools/", "aab/calculators.js", "shared/", "next/components/"],
  "scripts/check-csp.ts": ["aab/", "next/", "shared/headers.ts", "functions/"],
  "scripts/check-crons.ts": ["worker.js", "wrangler.toml", "functions/"],
  "scripts/check-pieces.ts": ["content/", "next/", "shared/"],
  "scripts/check-headers.ts": ["functions/", "shared/headers.ts", "aab/_headers", "worker.js"],
  "scripts/check-schools.ts": ["shared/curricula/", "shared/schools.ts", "content/schools.backup.json", "aab/"],
  "scripts/check-money.ts": ["scripts/money/", "shared/lesson", "shared/curricula/money.ts", "next/components/lesson/", "content/"],
  "scripts/check-english.ts": ["scripts/english/", "shared/curricula/english.ts", "next/lib/workbooks/", "functions/_lib/sanitise.ts", "content/"],
  "scripts/check-rows.ts": ["shared/rows.ts", "functions/", "supabase/", "next/lib/"],
  "scripts/check-rls.ts": ["supabase/"],
  "scripts/check-migrations.ts": ["supabase/"],
  "scripts/check-api.ts": ["aab/", "next/", "functions/", "worker.js", "app/src/"],
  "scripts/check-app-surface.ts": ["shared/", "functions/api/site", "functions/api/tools", "functions/api/foods"],
  "scripts/check-contrast.ts": ["*.css"],
  "scripts/check-surfaces.ts": ["*.css", "*.tsx"],
  "scripts/check-components.ts": ["*.css", "*.tsx", "aab/"],
  "scripts/check-jsx-space.ts": ["*.tsx"],
  "scripts/check-jsx-nesting.ts": ["*.tsx"],
  "scripts/check-scale.ts": ["*.css"],
  "scripts/check-prefixes.ts": ["*.css"],
  "scripts/check-selfref.ts": ["*.css"],
  "scripts/check-utility-clash.ts": ["*.css", "*.tsx"],
  "scripts/check-closed.ts": ["aab/", "functions/", "scripts/closed-set.json"],
  "scripts/check-admin.ts": ["functions/"],
  "scripts/check-plain.ts": ["*.css", "*.tsx", "aab/", "app/src/"],
  "scripts/check-prefs.ts": ["aab/src/prefs.ts", "next/components/shell.tsx", "next/components/account/", "shared/storage.ts"],
  "scripts/check-storage.ts": ["aab/", "next/", "shared/storage.ts", "app/src/"],
  "scripts/check-account.ts": ["aab/src/account-page.ts", "supabase/"],
  "scripts/check-art.ts": ["shared/art", "aab/src/share-card.ts", "*.css"],
  "scripts/check-icons.ts": ["*.tsx", "next/lib/school-icons.ts", "aab/"],
  "scripts/check-next.ts": ["next/", "aab/fallback.css", "aab/404.html", "aab/offline.html"],
  "scripts/check-courses.ts": ["shared/courses", "aab/src/courses.ts", "aab/courses", "next/app/(site)/skills/", "functions/api/courses/", "functions/_lib/drive", "scripts/fixtures/course-crawl/"],
  "scripts/check-diet.ts": ["shared/diet", "shared/foods", "next/components/diet/", "next/app/(site)/tools/diet", "supabase/", "DIET.md"],
  "scripts/check-research.ts": ["shared/research", "next/components/research/", "next/app/(site)/tools/research", "functions/api/research/", "supabase/", "RESEARCH.md"],
  "scripts/check-accents.ts": ["*.css", "*.tsx", "shared/nav.ts"],
  "scripts/build-modules.ts": ["aab/src/", "aab/", "shared/"],
  "scripts/build-fallback.ts": ["*.css", "aab/fallback.css"],
  "scripts/build-school-icons.ts": ["aab/", "next/lib/school-icons.ts"],
  "scripts/build-stamp.ts": ["app/", "aab/studio/"],
  "scripts/import-courses.ts": ["shared/courses", "scripts/fixtures/course-crawl/"],
  "scripts/export-stock-fixtures.ts": ["aab/tools/", "aab/src/tools/", "scripts/fixtures/"],
  "scripts/export-calculator-fixtures.ts": ["aab/tools/", "aab/src/tools/", "aab/calculators.js", "scripts/fixtures/"],
  "scripts/export-portfolio-fixtures.ts": ["aab/portfolio/", "scripts/fixtures/"],
  "scripts/export-routine-fixtures.ts": ["shared/routine", "scripts/fixtures/"],
  "scripts/export-diet-fixtures.ts": ["shared/diet", "shared/foods", "scripts/fixtures/"],
  "scripts/input.test.ts": ["functions/"],
  "scripts/reader.test.ts": ["functions/"],
  "scripts/comments.test.ts": ["functions/"],
  "scripts/restore.test.ts": ["functions/", "content/"],
  "scripts/bundle.test.ts": ["shared/bundle.ts", "aab/"],
  "scripts/snapshot.test.ts": ["functions/", "worker.js"],
  "scripts/routine.test.ts": ["shared/routine", "next/components/routine/", "next/app/(site)/tools/routine"],
  "scripts/netzwerk.test.ts": ["shared/netzwerk.ts", "next/components/netzwerk/", "next/lib/netzwerk", "scripts/fixtures/netzwerk-plan.json"],
  "scripts/diet.test.ts": ["shared/diet", "shared/foods"],
  "scripts/csv.test.ts": ["shared/csv.ts"],
  "scripts/research.test.ts": ["shared/research", "next/components/research/", "functions/api/research/"],
  "scripts/research-stats.test.ts": ["shared/research"],
  "scripts/research-field.test.ts": ["shared/research"],
  "scripts/research-tools.test.ts": ["shared/research"],
  "scripts/research-assist.test.ts": ["shared/research", "functions/api/research/"],
  "scripts/insights.test.ts": ["shared/insights.ts", "next/components/topic-filter.tsx", "next/app/(site)/insights"],
  "scripts/activity.test.ts": ["shared/activity.ts"],
  "scripts/widgets.test.ts": ["shared/widgets.ts", "next/components/home/"],
  "next/recipes.test.ts": ["next/lib/recipes", "next/components/", "shared/"],
  "scripts/admin.test.ts": ["functions/", "next/components/admin/"],
  "scripts/schools.test.ts": ["shared/curricula/", "shared/schools.ts", "content/schools.backup.json", "functions/"],
  "scripts/schools-api.test.ts": ["functions/", "shared/schools.ts"],
  "scripts/site-api.test.ts": ["functions/api/site", "shared/"],
  "functions/_lib/notion.test.ts": ["functions/_lib/notion"],
  "functions/_lib/drive.test.ts": ["functions/_lib/drive", "functions/_lib/ticket"],
  "functions/_lib/quiz.test.ts": ["functions/_lib/quiz", "functions/_lib/sanitise.ts"],
  "functions/_lib/food.test.ts": ["functions/_lib/food", "shared/foods", "shared/diet"],
  "aab/schools/progress.test.ts": ["aab/schools/", "aab/src/", "aab/deutsch/", "aab/english/", "aab/quran/", "shared/curricula/"],
  "next/progress.test.ts": ["next/lib/progress.ts", "next/components/progress.tsx"],
  "next/medals.test.ts": ["next/lib/medals.ts", "next/lib/progress.ts"],
  "next/comments.test.ts": ["next/components/comments", "next/lib/comments", "functions/"],
  "next/book-api.test.ts": ["functions/api/book", "next/lib/workbooks/", "shared/lesson.ts"],
  "aab/schools/hub.test.ts": ["aab/schools/", "next/lib/school-hubs.ts", "next/lib/school-hub-content.ts", "shared/curricula/"],
  "aab/schools/workbook.test.ts": ["aab/schools/", "next/lib/workbooks/", "next/components/workbook"],
  "aab/courses.test.ts": ["aab/src/courses.ts", "aab/courses", "shared/courses"],
  "aab/portfolio/stress.test.ts": ["aab/portfolio/"],
  "aab/portfolio/scorecard.test.ts": ["aab/portfolio/"],
  "aab/portfolio/frontier.test.ts": ["aab/portfolio/"],
  "aab/portfolio/dissertation.test.ts": ["aab/portfolio/"],
};

/** Every path that differs from `SINCE`, plus what is edited and
    not yet committed, plus new files. Null when git cannot answer,
    which runs everything and says so. */
function changedPaths(): Set<string> | null {
  const git = (...args: string[]): string[] =>
    execFileSync("git", args, { cwd: ROOT, encoding: "utf8" })
      .split("\n").map((l) => l.trim()).filter(Boolean);
  try {
    const base = git("merge-base", SINCE, "HEAD")[0];
    return new Set([
      ...git("diff", "--name-only", base),
      ...git("ls-files", "--others", "--exclude-standard"),
    ]);
  } catch {
    return null;
  }
}

const matches = (path: string, pattern: string): boolean =>
  pattern.startsWith("*.") ? path.endsWith(pattern.slice(1)) : path.startsWith(pattern);

/** Whether an entry has to run for this set of changes. */
function wanted(entry: Entry, changed: Set<string>): boolean {
  const name = Array.isArray(entry) ? entry[0] : entry;
  const patterns = WHEN[name];
  if (!patterns) return true;
  for (const path of changed) {
    if (path === name) return true;
    if (patterns.some((p) => matches(path, p))) return true;
  }
  return false;
}

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

/* The scope, decided once. Any check or test under scripts/ that
   changed, or this file, widens it back to everything: an edit to a
   check is the one input no pattern above can see. */
let changed: Set<string> | null = null;
if (CHANGED) {
  changed = changedPaths();
  if (!changed) {
    console.log(`--changed: git could not compare against ${SINCE}, so everything runs.`);
  } else if ([...changed].some((p) => p === "scripts/check-all.ts"
      || (p.startsWith("scripts/") && !p.startsWith("scripts/fixtures/") && /\.ts$/.test(p)
          && !/\.test\.ts$/.test(p) && !WHEN[p] && /^scripts\/(check|build|export|import)-/.test(p)))) {
    console.log("--changed: a check itself changed, so everything runs.");
    changed = null;
  } else {
    console.log(`--changed: ${changed.size} path(s) differ from ${SINCE}.`);
  }
}

let skipped = 0;
for (const [stage, entries] of STAGES) {
  if (STAGE && stage !== STAGE) continue;
  if (ONLY_CHECKS && stage === "tests") continue;

  const picked = changed ? entries.filter((e) => wanted(e, changed)) : entries;
  skipped += entries.length - picked.length;
  if (picked.length === 0) {
    if (!QUIET) console.log(`  --   ${stage} (0 of ${entries.length})`);
    continue;
  }

  const results = await pool(picked);
  ran += results.length;

  const bad = results.filter((r) => r.code !== 0);
  failures.push(...bad);

  if (!QUIET) {
    const label = changed ? `${stage} (${results.length} of ${entries.length})` : `${stage} (${results.length})`;
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

console.log(`\nall ${ran} passed in ${seconds.toFixed(1)}s.`
  + (changed ? ` ${skipped} skipped: their inputs did not change against ${SINCE}.` : "") + "\n");
