#!/usr/bin/env node
/* check-types.ts: the node-side TypeScript, typechecked.

       node scripts/check-types.ts

   Node has stripped TypeScript types on its own since 22.18, so a
   `.ts` under `scripts/` runs with no build step. STRIPPING IS NOT
   CHECKING: a `.ts` that nothing typechecks is a `.js` wearing
   annotations, which is worse than the `.mjs` it replaced because
   a reader now believes them. So a conversion is finished when
   this passes with the file in it.

   `CONFIGS` is every directory of node-side TypeScript here, with
   the `node_modules` each one needs. A config whose installs are
   absent SAYS SO AND SKIPS, naming what to run and where: a skip
   is not a pass. `checks.yml` runs `npm ci` at the ROOT and
   nowhere else, so the ones needing `next/node_modules` or
   `app/node_modules` never run there.

   The second half is that no JavaScript is left in `scripts/` or
   `shared/`. `checkJs` cannot say that: it applies to every `.js`
   the imports REACH, which is `worker.js`, the stock model and
   most of `functions/` through it. */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
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
      need both installs: declaring only `next/` made this fail
      loudly and about the wrong thing on a machine that had one
      and not the other. */
  needs?: string[];
}

const CONFIGS: Config[] = [
  { what: "scripts/", config: join(HERE, "tsconfig.json") },
  /* `build-og.ts` alone, because it is the one generator here that
     drives a browser and playwright is a devDependency of `app/`.
     It is excluded from the config above so that one keeps running
     on the root install, which is the only one CI does. */
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
    what: "functions/ (the Worker's own code)",
    config: join(ROOT, "functions", "tsconfig.json"),
  },
  {
    what: "functions/ (the Worker's own tests)",
    config: join(ROOT, "functions", "tsconfig.test.json"),
  },
  {
    what: "app/ (the Studio in a browser)",
    config: join(ROOT, "app", "tsconfig.test.json"),
    needs: [join(ROOT, "app")],
  },
  /* The one entry whose `needs` is not its own directory. Most of
     these run in linkedom off the root install; three drive a real
     browser, and playwright is a devDependency of `app/`. */
  {
    what: "aab/ (the browser-side tests)",
    config: join(ROOT, "aab", "tsconfig.test.json"),
    needs: [join(ROOT, "app")],
  },
];

/* `fixtures/` is captured data rather than code: the Drive
   listing `import-courses.ts` rebuilds the catalogue from. */
const NOT_CODE = new Set(["fixtures", "node_modules"]);


/** What must not exist in each, and why the two differ.

    `scripts/`: any JavaScript. Node strips the types with no build
    step, so a `.js` here typechecks nowhere.

    `shared/`: JavaScript AND declarations, because both are
    COMPILED OUTPUT there. Those files are read directly by three
    runtimes, Next through `transpilePackages`, the Worker through
    wrangler's esbuild, and plain node through type stripping, so
    nothing needs a compile step. A stray `tsc` with no `--noEmit`
    puts them back, in place and untracked, where the next
    `git add -A` commits them. */
const TYPESCRIPT_ONLY: Array<{ dir: string; bad: RegExp; what: string }> = [
  { dir: "scripts", bad: /\.(js|mjs|cjs|jsx)$/, what: "JavaScript" },
  { dir: "shared", bad: /\.(js|mjs|cjs|jsx)$|\.d\.ts$/, what: "compiled output" },
];

const stray: string[] = [];
const walk = (dir: string, bad: RegExp): void => {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith(".") || NOT_CODE.has(entry.name)) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, bad);
    else if (bad.test(entry.name)) stray.push(relative(ROOT, full));
  }
};
for (const { dir, bad } of TYPESCRIPT_ONLY) walk(join(ROOT, dir), bad);

if (stray.length) {
  console.error(`${stray.length} file(s) where only TypeScript belongs:`);
  for (const file of stray) console.error(`   ${file}`);
  console.error("\nEverything here is TypeScript, and node strips the types"
    + " with no build step,\nso there is nothing to trade for keeping one."
    + " Rename it and give it real types;\nthis check is what says the"
    + " second half happened.\n");
  process.exit(1);
}

/* ---- and shared/README.md describes what is actually in it ----

   That file opens with a count and then a list, and the list is
   the only description of `shared/` there is. It said "six files
   and a directory" while nine were there. Here rather than in a
   check of its own because this already walks `shared/`. Naming a
   file is enough; `check-pointers.ts` holds the other direction,
   that a name in there resolves. */
const README = join(ROOT, "shared", "README.md");
const described = readFileSync(README, "utf8");
const undescribed = readdirSync(join(ROOT, "shared"))
  .filter((name) => name.endsWith(".ts"))
  .filter((name) => !described.includes(name));

if (undescribed.length) {
  console.error(`${undescribed.length} file(s) in shared/ that shared/README.md`
    + " does not mention:");
  for (const name of undescribed) console.error(`   shared/${name}`);
  console.error("\nThat list is the only description of shared/ there is, and it"
    + " is read by anybody deciding whether a thing belongs there.\n"
    + "Add the file, and the count at the top of it.\n");
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
console.log(`types: no stray output in ${TYPESCRIPT_ONLY.map((t) => `${t.dir}/`).join(" or ")},`
  + " and every .ts file node runs"
  + `\n       directly typechecks, under ${ran} of ${CONFIGS.length} config(s).`);
for (const { what, where } of skipped) {
  /* One `npm install` per directory, joined, because a skip whose
     remedy is not a command you can paste is a skip nobody acts
     on. */
  const install = where.map((d) => `(cd ${d} && npm install)`).join(" && ");
  console.log(`       SKIPPED ${what}: ${where.join(" and ")} `
    + `${where.length > 1 ? "have" : "has"} no node_modules, so the types`
    + `\n       it needs are absent. This is not a pass. Run it where they are:`
    + `\n         ${install} && node scripts/check-types.ts`);
}
