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

   ---- and five that come from shared/ instead ----

   The site's manifest and the four schools' ladders are read by
   three runtimes each, so their source is `shared/content.ts` and
   `shared/curricula/*.ts` and this writes the browser's copies.
   Two things follow from the source living one directory along:
   its own compile, and four specifiers rebased. `SHARED` and
   `rebase` below are where each is stated.
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
  /* The account's own, moved 17 August 2026 with the work that
     added them. They are the first modules here that import each
     other, and `tsconfig.json` maps `/saved.js` at the SOURCE
     rather than at a declaration, so there is one description of
     that module and it is the module.

     They emit declarations into `app/src/types/` like the three
     above. Nothing in `app/` imports them today, which is not a
     reason to throw the declarations away: the desk is the next
     thing that will want to know what a saved scenario is. */
  "prefs", "saved", "checkpoints", "sync", "signin", "account-page",
  /* Who a reader is, converted 19 August 2026 with the change
     that brought the picture Google sends through to the page.
     It was described by TWO hand-written declarations, one for
     `aab/src/` and one for `next/`, and they disagreed about
     what `saveProfile` answers. Both are gone: this emits the
     one in `app/src/types/` and `tsconfig.json` maps
     `/account.js` at the source. */
  "account",
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
  /* The Studio's gate and the one constant it reads. `auth-config`
     is the block the setup screen prints, so it is a file meant to
     be replaced wholesale: nothing in it is `as const`. */
  "auth-config",
  /* Whether the dynamic layer is reachable. It declares
     `document.prerendering` and `PerformanceNavigationTiming.
     activationStart` globally, because neither is in the DOM
     library and both are the browser this file exists for. */
  "activation",
];

/** The five served modules whose source is in `shared/` rather
    than in `aab/src/`: the site's manifest and the four schools'
    ladders. The Worker, the checks under `scripts/`, the Next.js
    routes and the browser read the same five, and only the last of
    them needs a file at a URL.

    They are compiled on their own, by
    `scripts/tsconfig.shared.json`, because `aab/src/tsconfig.json`
    has `rootDir` set to that directory and a source outside it
    cannot be added to that run.

    No declaration is emitted for any of them and none should be.
    Anything that wants the types maps the served path on to the
    source, which is what `app/tsconfig.json`,
    `aab/src/tsconfig.json` and `next/tsconfig.json` do: one
    description, and it is the module. */
const SHARED = {
  config: "scripts/tsconfig.shared.json",
  /** Where that config's `rootDir` puts each output, against the
      path in `aab/` it belongs at. Those four addresses are in
      `sw.js`'s precache list and in the imports of eleven browser
      modules, so they are fixed. */
  files: {
    "content.js": "aab/content.js",
    "curricula/money.js": "aab/money/curriculum.js",
    "curricula/deutsch.js": "aab/deutsch/curriculum.js",
    "curricula/quran.js": "aab/quran/curriculum.js",
    "curricula/english.js": "aab/english/curriculum.js",
  } as Record<string, string>,
};

/** The one thing here that is not tsc's output verbatim.

    A ladder is `shared/curricula/money.ts` at the source and
    `aab/money/curriculum.js` at the output, so the specifier
    `content.ts` reaches it by has to be rebased. tsc never
    rewrites a specifier beyond its extension, so nothing else was
    going to do this. */
const rebase = (js: string): string =>
  js.replace(/from "\.\/curricula\/(\w+)\.js"/g, 'from "./$1/curriculum.js"');

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

    /* And the manifest and the four ladders, out of `shared/`.
       Their own directory, because that run's `rootDir` is
       `shared/` and tsc refuses an input above it. Only the five
       files named in SHARED.files are read back, which is why
       nothing walks this output looking for strays. */
    const sharedOut = mkdtempSync(join(tmpdir(), "reiad-shared-"));
    try {
      execFileSync("npx", [
        "tsc", "-p", join(ROOT, SHARED.config), "--outDir", sharedOut,
      ], { cwd: ROOT, stdio: "pipe" });
      for (const [from, to] of Object.entries(SHARED.files)) {
        built[to] = rebase(readFileSync(join(sharedOut, from), "utf8"));
      }
    } finally {
      rmSync(sharedOut, { recursive: true, force: true });
    }

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
    console.log(`modules: ${MODULES.length} built file(s) match aab/src/, `
      + `and ${Object.keys(SHARED.files).length} match shared/.`);
  } else {
    for (const [rel, text] of Object.entries(built)) {
      mkdirSync(dirname(join(ROOT, rel)), { recursive: true });
      writeFileSync(join(ROOT, rel), text);
    }
    console.log(`wrote ${Object.keys(built).length} file(s) from aab/src/ and shared/:`);
    for (const rel of Object.keys(built)) console.log(`   ${rel}`);
  }
}
