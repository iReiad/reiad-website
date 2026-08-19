#!/usr/bin/env node
/* ============================================================
   build-modules.ts: the site's own modules, from TypeScript.

       node scripts/build-modules.ts           # write them
       node scripts/build-modules.ts --check   # or compare

   archive/TRANSITION.md Stage 13, and section 7 for why the output is
   committed rather than built in CI: the site deploys by
   uploading `aab/`, and adding a build step would put a build
   command in a dashboard that cannot be seen from this
   repository.

   ---- one file in, one file out ----

   No bundling and no renaming. `/share-card.js` is named in
   `sw.js`'s precache list, in `vite.config.ts`'s list of runtime
   externals and in the imports of both React apps, so the path is
   fixed and a hashed chunk would fight all three. `tsc` alone
   does exactly this, which is why there is no bundler here.

   ---- and the declaration is emitted, not written ----

   `app/src/types/` holds hand-written `.d.ts` files describing
   these modules, because they were plain JavaScript and
   TypeScript had nothing to go on. A module that moves here emits
   its own, and the hand-written one is deleted in the same
   commit. Stage 13 is done when that directory holds only its
   README, because every module describes itself.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "aab", "src");

/** Every module that has moved, by the name it is served under.

    Listed rather than globbed, so that adding one is a line
    somebody wrote and the check below knows what to compare
    without guessing. */
export const MODULES = [
  "share-card", "api", "photo",
  /* The account's own four, moved 17 August 2026 with the work
     that added them. They are the first modules here that import
     each other: `keep` imports `saved`, and `tsconfig.json` maps
     `/saved.js` at the SOURCE rather than at a declaration, so
     there is one description of that module and it is the module.

     They emit declarations into `app/src/types/` like the three
     above. Nothing in `app/` imports them today, which is not a
     reason to throw the declarations away: the desk is the next
     thing that will want to know what a saved scenario is. */
  "prefs", "saved", "checkpoints", "keep", "sync", "signin", "account-page",
  /* The third-party course player, added with the section it
     draws. It is a browser module rather than a React component
     for the reason at the top of `aab/src/courses.ts`: the
     catalogue is admin-only, so the server must not render it
     into a page, and a `<SiteScripts>` module runs after
     hydration where nothing React does can undo it. */
  "courses",
  /* The breadcrumb, converted with the fix to the bug it carried:
     six call sites split the document title on U+2014, a
     character this site's own rules guarantee never appears, so
     the split did nothing and the whole title reached the crumb. */
  "crumbs",
  /* The first module served from a subdirectory: the live
     portfolio's page module, at /tools/live.js beside the plain
     JavaScript calculators. The name here is the served path
     minus its extension, and everything below joins paths, so a
     slash in a name costs nothing. */
  "tools/live",
  /* The five calculators, converted with the change that stopped
     them naming a colour: every chart drew `--green` and `--gold`
     regardless of the page, so a calculator on the tools page drew
     itself in Insights' colour. They read `--series-1` and
     `--series-2` now, and the legend beside them reads the same
     two. */
  "tools/tools",
];

/** Compile into a temporary directory and read the results back.

    Not straight into `aab/`, because `--check` has to be able to
    compare without writing: a check that fixed what it was asked
    to find would always pass. */
export function compile() {
  const out = mkdtempSync(join(tmpdir(), "reiad-modules-"));
  try {
    execFileSync("npx", [
      "tsc", "-p", join(SRC, "tsconfig.json"),
      "--outDir", out, "--declarationDir", join(out, "types"),
    ], { cwd: ROOT, stdio: "pipe" });

    /* Repo-relative path to the text that belongs at it. */
    const built: Record<string, string> = {};
    for (const name of MODULES) {
      built[`aab/${name}.js`] = readFileSync(join(out, `${name}.js`), "utf8");
      built[`app/src/types/${name}.d.ts`] = readFileSync(join(out, "types", `${name}.d.ts`), "utf8");
    }
    /* Anything else tsc produced. A module added to `aab/src/`
       and not to MODULES would otherwise be compiled and
       silently thrown away. Recursive since `tools/live` moved
       in: a stray in a subdirectory is still a stray. */
    const strays = readdirSync(out, { recursive: true })
      .map((f) => String(f).replaceAll("\\", "/"))
      .filter((f) => f.endsWith(".js") && !f.startsWith("types/"))
      .filter((f) => !MODULES.includes(f.replace(/\.js$/, "")));
    return { built, strays };
  } finally {
    rmSync(out, { recursive: true, force: true });
  }
}

const RUN = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (RUN) {
  const { built, strays } = compile();

  if (strays.length) {
    console.error(`aab/src/ has ${strays.length} module(s) that MODULES does not name:`);
    for (const s of strays) console.error(`   ${s.replace(/\.js$/, ".ts")}`);
    console.error("\nAdd them to MODULES in scripts/build-modules.ts, or they compile\n"
      + "to nothing anybody serves.\n");
    process.exit(1);
  }

  if (process.argv.includes("--check")) {
    const wrong = Object.entries(built).filter(([rel, want]) => {
      let have = "";
      try { have = readFileSync(join(ROOT, rel), "utf8"); } catch { have = ""; }
      return have !== want;
    });
    if (wrong.length) {
      console.error(`${wrong.length} built file(s) are not what aab/src/ compiles to:`);
      for (const [rel] of wrong) console.error(`   ${rel}`);
      console.error("\nEdit the TypeScript, not the output:\n"
        + "  node scripts/build-modules.ts\n");
      process.exit(1);
    }
    console.log(`modules: ${MODULES.length} built file(s) match aab/src/.`);
  } else {
    for (const [rel, text] of Object.entries(built)) {
      mkdirSync(dirname(join(ROOT, rel)), { recursive: true });
      writeFileSync(join(ROOT, rel), text);
    }
    console.log(`wrote ${Object.keys(built).length} file(s) from aab/src/:`);
    for (const rel of Object.keys(built)) console.log(`   ${rel}`);
  }
}
