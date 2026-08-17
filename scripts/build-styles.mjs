#!/usr/bin/env node
/* ============================================================
   build-styles.mjs: /tailwind.css, from aab/src/styles/.

       node scripts/build-styles.mjs           # write it
       node scripts/build-styles.mjs --check   # or compare

   archive/TRANSITION.md Stage 14. Same arrangement as every other
   generated thing here and for the reason in section 7: the site
   deploys by uploading `aab/` with no build step in CI, so the
   output is built on a laptop, committed, and compared by a
   check.

   ---- what it scans ----

   Tailwind emits only the utilities something actually uses, so
   it has to be told where to look. `next/app` and
   `next/components` are where every class name on this site is
   rendered now that no page is a file, and `app/src` is the desk
   and the Studio. `aab/**.js` is included too: the site's own
   modules build DOM and some of them write class names.

   What is deliberately NOT scanned is the database. An article's
   body is HTML written by a person and stored in D1, and
   Tailwind's compiler cannot see it. That is the whole reason
   the article layer stays a stylesheet: see the note at the top
   of `aab/src/styles/tailwind.css`.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "aab", "src", "styles", "tailwind.css");
const OUT = "aab/tailwind.css";

/** Compile into a temporary file and read it back.

    Not straight into `aab/`, for the same reason
    `build-modules.mjs` does the same: `--check` has to compare
    without writing, and a check that fixed what it was asked to
    find would always pass. */
export function compile() {
  const dir = mkdtempSync(join(tmpdir(), "reiad-styles-"));
  const out = join(dir, "tailwind.css");
  try {
    execFileSync("npx", ["@tailwindcss/cli", "-i", SRC, "-o", out, "--minify"],
      { cwd: ROOT, stdio: "pipe" });
    return readFileSync(out, "utf8");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const RUN = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (RUN) {
  const wanted = compile();

  if (process.argv.includes("--check")) {
    let have = "";
    try { have = readFileSync(join(ROOT, OUT), "utf8"); } catch { have = ""; }
    if (have !== wanted) {
      console.error(`${OUT} is not what aab/src/styles/ compiles to.`);
      console.error("Edit the source, not the output:\n  node scripts/build-styles.mjs\n");
      process.exit(1);
    }
    console.log(`styles: ${OUT} matches aab/src/styles/ (${wanted.length} bytes).`);
  } else {
    writeFileSync(join(ROOT, OUT), wanted);
    console.log(`wrote ${OUT}, ${wanted.length} bytes`);
  }
}
