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

   ---- and that one needs `next/node_modules`, which CI has not ----

   `checks.yml` runs `npm ci` at the ROOT and nowhere else, for
   the reason written beside it: the root package.json is not a
   dependency of the site, it is there for the three `--check`
   steps and for linkedom. So `@cloudflare/workers-types` and
   every React type the components lean on are absent, and this
   config cannot be run there.

   It says so and moves on, rather than failing on a runner that
   was never going to have them or passing quietly as if it had
   looked. A SKIP IS NOT A PASS: the line names what to run and
   where, the same way every optional test in `CLAUDE.md` does.

   ---- and two more directories with the same hole in them ----

   `functions/tsconfig.test.json` and `app/tsconfig.test.json`.
   Wrangler's esbuild reads no tsconfig at all, and
   `app/tsconfig.json` is the BUILD, whose `include` is `src`, so
   the tests in both directories typechecked nowhere. The Worker's
   three lean on the root install and therefore run in CI; the
   app's two need `app/node_modules` for Playwright's types, and
   the skip below names that directory rather than next/.

   ---- and the second half: no JavaScript here at all ----

   `tsconfig.json` cannot say that. `checkJs` would, but it
   applies to every `.js` the imports REACH, and the checks import
   `worker.js`, the stock model and the money school's icons, and
   through worker.js most of `functions/`. Turning it on reports
   194 errors in `aab/tools/stock.model.js` alone: files this
   config is not the one converting, and a list nobody reads.

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
import { existsSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HERE = join(ROOT, "scripts");

/** Every config covering TypeScript that node runs directly and
    no build compiles. What `next build` already checks is
    deliberately absent: one check per thing. */
interface Config {
  what: string;
  config: string;
  /** Every directory whose `node_modules` this config needs, and
      it is a LIST because two of them need more than one.

      `next/tsconfig.json` maps the bare `playwright` specifier
      into `app/node_modules`, so the browser tests beside the app
      need both installs. Declaring only `next/` made this FAIL,
      loudly and about the wrong thing, on a machine that had one
      and not the other: forty errors reading "Cannot find module
      'playwright'" for an install nobody had said was required.
      CI never saw it because CI has neither. */
  needs?: string[];
}

const CONFIGS: Config[] = [
  { what: "scripts/", config: join(HERE, "tsconfig.json") },
  /* `build-og.ts` alone, because it is the one generator here
     that drives a browser and playwright is a devDependency of
     `app/`. It is excluded from the config above so that one
     keeps running on the root install, which is the only one
     CI does. */
  {
    what: "scripts/ (the share-card generator)",
    config: join(HERE, "tsconfig.browser.json"),
    needs: [join(ROOT, "app")],
  },
  {
    what: "next/ (the browser tests)",
    config: join(ROOT, "next", "tsconfig.test.json"),
    /* Both: React and the Worker's types from `next/`, and
       playwright from `app/`, which `next/tsconfig.json` maps the
       bare specifier on to. */
    needs: [join(ROOT, "next"), join(ROOT, "app")],
  },
  /* No `needs`: the Worker's tests import nothing but each other,
     the modules under test and @types/node, so this one runs on
     the root install and therefore in CI. */
  {
    what: "functions/ (the Worker's own tests)",
    config: join(ROOT, "functions", "tsconfig.test.json"),
  },
  {
    what: "app/ (the desk and the Studio in a browser)",
    config: join(ROOT, "app", "tsconfig.test.json"),
    needs: [join(ROOT, "app")],
  },
  /* The one entry whose `needs` is not its own directory. Most of
     these run in linkedom off the root install; three drive a real
     browser, and playwright is a devDependency of `app/`, so the
     config cannot resolve it without that install. */
  {
    what: "aab/ (the browser-side tests)",
    config: join(ROOT, "aab", "tsconfig.test.json"),
    needs: [join(ROOT, "app")],
  },
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

/** A skipped config, and every directory still to install in.
    The second is what makes the line actionable: two of these
    need a directory that is not their own, and one needs two. */
const skipped: Array<{ what: string; where: string[] }> = [];

for (const { what, config, needs } of CONFIGS) {
  const missing = (needs ?? []).filter((d) => !existsSync(join(d, "node_modules")));
  if (missing.length) {
    skipped.push({ what, where: missing.map((d) => relative(ROOT, d)) });
    continue;
  }
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

const ran = CONFIGS.length - skipped.length;
console.log("types: no JavaScript in scripts/, and every .ts file node runs"
  + `\n       directly typechecks, under ${ran} of ${CONFIGS.length} config(s).`);
for (const { what, where } of skipped) {
  /* One `npm install` per directory, joined, because a skip whose
     remedy is not a command you can paste is a skip nobody acts
     on: "cd next and app" was the line this printed before, for
     the one config that needs two installs. */
  const install = where.map((d) => `(cd ${d} && npm install)`).join(" && ");
  console.log(`       SKIPPED ${what}: ${where.join(" and ")} `
    + `${where.length > 1 ? "have" : "has"} no node_modules, so the types`
    + `\n       it needs are absent. This is not a pass. Run it where they are:`
    + `\n         ${install} && node scripts/check-types.ts`);
}
