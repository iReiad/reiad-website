#!/usr/bin/env node
/* ============================================================
   check-types.ts: the node-side TypeScript, typechecked.

       node scripts/check-types.ts

   Node has stripped TypeScript types on its own since 22.18, so
   `node scripts/check-css.ts` runs with no build step, no loader
   and no configuration. That is what makes converting `scripts/`
   to TypeScript cheap.

   IT IS ALSO THE TRAP, and it is the reason this file exists.
   Stripping is not checking. Node removes the annotations and
   runs what is left, so a `.ts` file that nothing typechecks is a
   `.js` file wearing annotations: every one of them could be
   wrong and the script would behave exactly the same. That is
   strictly worse than the `.mjs` it replaced, because a reader
   now believes them.

   So the conversion is not finished when a file is renamed. It is
   finished when this passes with the file in it, which is why
   this runs in `check-all.ts` beside every other check rather
   than being something somebody remembers to do.

   `scripts/tsconfig.json` is the settings and says why each is
   what it is.

   ---- and the same trap one directory along ----

   `next/tsconfig.test.json` is here for the same reason and it
   took a red deploy to find. The browser tests beside the app
   were in `next/tsconfig.json` at first, which sounded better than
   a second config: `next build` typechecks that one, so the build
   would hold them to their types for free.

   It holds the PRODUCTION BUILD to the tests' imports as well.
   Playwright is a devDependency of `app/` and Cloudflare's build
   installs `next/` and nothing else, so `next build` compiled
   here, where `app/` happens to be installed, and failed on the
   deploy with two missing modules. They are excluded there and
   checked here, which is where a check on our own source belongs.

   ---- and the second half: no JavaScript here at all ----

   `tsconfig.json` cannot say that. `checkJs` would, but it
   applies to every `.js` the imports REACH, and the checks import
   `aab/content.js`, `worker.js` and four `curriculum.js` modules,
   and through worker.js most of `functions/`. Turning it on
   reports 194 errors in `aab/tools/stock.model.js` alone: files
   this config is not the one converting, and a list nobody reads.

   So the directory is walked here instead. It is a smaller
   question and it is the one worth asking: a `.js` in `scripts/`
   typechecks nowhere, and the whole of the four chunks was
   getting rid of them.

   ---- what it has already caught ----

   `kindOf()` in `lib/coursera.ts` returned `"file"`, and no file
   in a Coursera export is ever a `file`: `splitName()` answers
   `attachment` for one. Two vocabularies with four words in
   common, conflated under one name, and the arrow between them
   was the function whose return type nothing checked. A LESSON is
   one of five kinds and a FILE is one of seven; `LessonKind` in
   `shared/courses.ts` is the first and is imported rather than
   written out a second time.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HERE = join(ROOT, "scripts");

/** Every config covering TypeScript that node runs directly and
    no build compiles. What `next build` already checks is
    deliberately absent: one check per thing. */
const CONFIGS: Array<[what: string, config: string]> = [
  ["scripts/", join(HERE, "tsconfig.json")],
  ["next/ (the browser tests)", join(ROOT, "next", "tsconfig.test.json")],
];

/* `fixtures/` is captured data rather than code: the Drive
   listing `import-courses.ts` rebuilds the catalogue from. */
const NOT_CODE = new Set(["fixtures", "node_modules"]);

const javascript: string[] = [];
(function walk(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || NOT_CODE.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(js|mjs|cjs|jsx)$/.test(entry.name)) {
      javascript.push(relative(ROOT, full));
    }
  }
})(HERE);

if (javascript.length) {
  console.error(`${javascript.length} JavaScript file(s) in scripts/:`);
  for (const file of javascript) console.error(`   ${file}`);
  console.error("\nEverything here is TypeScript, and node strips the types"
    + " with no build step,\nso there is nothing to trade for keeping one."
    + " Rename it and give it real types;\nthis check is what says the"
    + " second half happened.\n");
  process.exit(1);
}

for (const [what, config] of CONFIGS) {
  try {
    execFileSync("npx", ["tsc", "-p", config], { cwd: ROOT, stdio: "pipe" });
  } catch (err) {
    /* tsc writes its complaints to stdout, not stderr, which is
       why this prints the one and not the other. A check that
       failed and said nothing is a check nobody can act on. */
    const out = (err as { stdout?: Buffer }).stdout?.toString() ?? "";
    console.error(out.trim() || "tsc failed and said nothing.");
    console.error(`\n${what} does not typecheck. Node strips these types without`
      + " reading them,\nso nothing else would have told you.\n");
    process.exit(1);
  }
}

console.log("types: no JavaScript in scripts/, and every .ts file node runs"
  + `\n       directly typechecks, under ${CONFIGS.length} config(s).`);
