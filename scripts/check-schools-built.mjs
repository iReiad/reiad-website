/* ============================================================
   check-schools-built.mjs: are the committed school pages the
   pages the snapshot builds?

     node scripts/check-schools-built.mjs

   TRANSITION.md Stage 8, step 4. This is the check that outlives
   the migration, and it exists because the one before it is
   about to stop being true on purpose.

   ---- what schools-build.test.mjs proves, and for how long ----

   That test builds every school twice, once from the curriculum
   files and once from the database, and compares the two. It was
   the acceptance test for moving the prose into D1 and it did its
   job. But it compares the database against a copy of what the
   database held on the day it was filled, and the whole point of
   step 4 is that the two now diverge: the first lesson edited at
   `/studio/?lessons` makes the files wrong, deliberately, and
   that test starts failing for the best possible reason.

   ---- so this asks the question that stays useful ----

   Rebuild all four schools from `content/schools.backup.json`
   into a temporary directory, and compare every page against the
   one committed in `aab/`. It has no opinion about where the
   prose came from or what it says. It only says whether what is
   committed is what the current data produces.

   Two real failures it catches, and both have happened to
   generated files in this repository before:

   - a page edited by hand, which survives until the next build
     silently reverts it,
   - a snapshot refreshed and the schools not rebuilt, which is
     the state where the database, the file and the site all say
     three different things.

   Nothing here writes to `aab/`. `SCHOOL_OUT` is what keeps it
   out, the same way the test does.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { mkdtempSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const SCHOOLS = [
  { id: "quran", builder: "aab/quran/build-quran.mjs", writes: "quran" },
  { id: "deutsch", builder: "aab/deutsch/build-deutsch.mjs", writes: "deutsch" },
  { id: "english", builder: "aab/english/build-english.mjs", writes: "english" },
  { id: "learn", builder: "aab/learn/build-lessons.mjs", writes: "learn" },
];

const walk = (dir, base = dir, found = new Map()) => {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, base, found);
    else found.set(relative(base, path), readFileSync(path, "utf8"));
  }
  return found;
};

const work = mkdtempSync(join(tmpdir(), "schools-built-"));
const problems = [];
let pages = 0;

try {
  for (const school of SCHOOLS) {
    const out = join(work, school.id);
    mkdirSync(out, { recursive: true });

    /* SCHOOL_DB and SCHOOL_FILES are cleared rather than left
       alone. This check is about the snapshot specifically, and
       inheriting either of them from whoever ran it would quietly
       make it check something else. */
    execFileSync("node", [join(ROOT, school.builder)], {
      env: { ...process.env, SCHOOL_OUT: out, SCHOOL_DB: "", SCHOOL_FILES: "" },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });

    const built = walk(join(out, school.writes));
    const committed = walk(join(ROOT, "aab", school.writes));

    for (const [name, text] of built) {
      pages += 1;
      const have = committed.get(name);
      if (have === undefined) {
        problems.push(`${school.writes}/${name} would be written and is not committed`);
      } else if (have !== text) {
        const a = text.split("\n");
        const b = have.split("\n");
        const at = a.findIndex((line, i) => line !== b[i]);
        problems.push(
          `${school.writes}/${name} differs at line ${at + 1}\n`
          + `       committed: ${(b[at] ?? "").trim().slice(0, 90)}\n`
          + `       would be:  ${(a[at] ?? "").trim().slice(0, 90)}`
        );
      }
    }

    /* The other direction, and it has to be narrowed to what the
       builder owns. A school's directory holds its generated
       pages next to the modules it is generated FROM:
       `curriculum.js`, `hub.js`, `progress.js`, the workbook data
       and the builder itself all live in `aab/quran/` beside
       `dhap-1/*.html`. Comparing the whole tree reports every one
       of them as missing from the build, which is true and
       useless.

       So a stale page is looked for only in the folders this
       build actually wrote into, and only among the pages it
       writes. That still catches the thing worth catching: a
       lesson taken out of the ladder whose committed page stays
       behind and keeps answering. */
    const builtDirs = new Set([...built.keys()].map((name) => dirname(name)));
    for (const name of committed.keys()) {
      if (built.has(name)) continue;
      if (!name.endsWith(".html")) continue;
      const dir = dirname(name);
      /* Not the school's own top level. That folder holds the hub
         and its hand-written neighbours next to the one or two
         pages a builder writes there, so "committed here and not
         built" is the normal state of it. A stale lesson page,
         which is what this is looking for, is always inside a
         stage. */
      if (dir === ".") continue;
      if (!builtDirs.has(dir)) continue;
      problems.push(`${school.writes}/${name} is committed and would not be written`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (problems.length) {
  console.error("\nThe committed school pages are not what the snapshot builds:\n");
  for (const line of problems.slice(0, 12)) console.error(`  ${line}`);
  if (problems.length > 12) console.error(`\n  ...and ${problems.length - 12} more.`);
  console.error("\nIf the data is right, rebuild and commit the pages:");
  console.error("  node aab/quran/build-quran.mjs");
  console.error("  node aab/deutsch/build-deutsch.mjs");
  console.error("  node aab/english/build-english.mjs");
  console.error("  node aab/learn/build-lessons.mjs\n");
  process.exit(1);
}

console.log(`schools: ${pages} committed pages, all of them what the snapshot builds.`);
