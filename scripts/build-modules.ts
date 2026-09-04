#!/usr/bin/env node
/* build-modules.ts: the site's own modules, from TypeScript.

       node scripts/build-modules.ts           # write them
       node scripts/build-modules.ts --check   # or compare

   The output is COMMITTED, because the site deploys by uploading
   `aab/` with no build step in CI. Edit the source, never the
   output.

   ONE FILE IN, ONE FILE OUT. No bundling and no renaming:
   `/share-card.js` is named in `sw.js`'s precache list, in
   `vite.config.ts`'s runtime externals and in the imports of both
   React apps, so the path is fixed and a hashed chunk would fight
   all three. `tsc` alone does exactly this.

   A module that moves here EMITS its own declaration into
   `app/src/types/`, and the hand-written one is deleted in the
   same commit.

   The site's manifest and the four schools' ladders come from
   `shared/` instead, which costs a compile of their own and four
   specifiers rebased: `SHARED` and `rebase` below. */

import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "aab", "src");

/** Where that config's `rootDir` puts this directory's output.
    It is the repo root, so every emitted file carries its path
    from there. `aab/src/tsconfig.json` says why. */
const SRC_UNDER_ROOT = "aab/src";

/** Every module that has moved, by the name it is served under.
    Listed rather than globbed, so adding one is a line somebody
    wrote and the check below knows what to compare. */
export const MODULES = [
  "share-card", "api", "photo",
  /* The account's own. They are the first modules here that import
     each other, and `tsconfig.json` maps `/saved.js` at the SOURCE
     rather than at a declaration, so there is one description of
     that module and it is the module. They emit declarations into
     `app/src/types/` like the three above; nothing in `app/`
     imports them today, which is not a reason to throw the
     declarations away. */
  "prefs", "saved", "checkpoints", "sync", "signin", "account-page",
  /* Who a reader is. It was described by TWO hand-written
     declarations, one for `aab/src/` and one for `next/`, and they
     disagreed about what `saveProfile` answers. Both are gone:
     this emits the one in `app/src/types/` and `tsconfig.json`
     maps `/account.js` at the source. */
  "account",
  /* The third-party course player. A browser module rather than a
     React component for the reason at the top of
     `aab/src/courses.ts`: the catalogue is admin-only, so the
     server must not render it into a page, and a `<SiteScripts>`
     module runs after hydration where nothing React does can undo
     it. */
  "courses",
  /* The routine's wire. A browser module rather than a server read
     for the reason every account-backed thing here is one: what it
     reads is one reader's own session out of localStorage, and the
     server has neither the token nor any business holding it.
     `saved.ts` is the file it is shaped after. */
  "routine",
  /* The breadcrumb. Six call sites split the document title on
     U+2014, a character this site's own rules guarantee never
     appears, so the split did nothing and the whole title reached
     the crumb. */
  /* The first module served from a subdirectory: the live
     portfolio's page module, at /tools/live.js. The name here is
     the served path minus its extension, and everything below
     joins paths, so a slash in a name costs nothing. */
  "tools/live",
  /* The five calculators. Every chart drew `--green` and `--gold`
     regardless of the page, so a calculator on the tools page drew
     itself in Insights' colour. They read `--series-1` and
     `--series-2` now, and the legend beside them reads the same
     two. */
  "tools/tools",
  /* The Studio's gate and the one constant it reads. `auth-config`
     is the block the setup screen prints, so it is a file meant to
     be replaced wholesale: nothing in it is `as const`. */
  "auth-config", "auth",
  /* Whether the dynamic layer is reachable. It declares
     `document.prerendering` and `PerformanceNavigationTiming.
     activationStart` globally, because neither is in the DOM
     library and both are the browser this file exists for. */
  "activation",
  /* What has been written, wherever it is kept. The first module
     here to import `/content.js`, which is why that config's
     `rootDir` is the repo root and why the reads below carry a
     prefix. */
  "pieces",
  /* `days-active`, which four things count. Converting it emptied
     `aab/src/types/`: both declarations it held described modules
     that describe themselves now. */
  "streak",
  /* The learn/work switch. Typing its two vocabularies as unions
     found three comparisons against "money", a word this module
     has never stored: `data-track` was never set, the footer's
     switcher could not take a recruiter back to the library, and
     the track switcher was hidden everywhere. */
  "audience",
  /* The pointer effect on cards. */
  "tilt",
  /* The shell's browser half: the theme, the palette, the shortcut
     sheet, the counts, speculation rules and the service worker
     registration. */
  "app",
  /* The contenteditable. It stays a served module permanently:
     CLAUDE.md says why a second copy inside a component is the
     bug. `check-css.ts` reads `ATTRS` and `KEEP_CLASSES` out of
     the OUTPUT by name, so neither may stop being an object
     literal or a `new Set([...])`. */
  "editor",
];

/** The eight served modules whose source is in `shared/` rather
    than in `aab/src/`: the site's manifest, the four schools'
    ladders, the stock check's words, the calculators' arithmetic
    and the broker's derivations. The Worker, the checks, the
    Next.js routes and the browser read the same ones, and only the
    last needs a file at a URL.

    They are compiled on their own by
    `scripts/tsconfig.shared.json`, and that is the compile whose
    output is read here: it is the only run whose `rootDir` puts a
    ladder at the path `SHARED.files` names, and `rebase` below is
    applied to its output alone.

    No declaration is emitted for any of them and none should be.
    Anything wanting the types maps the served path on to the
    source, which is what `app/tsconfig.json`, `aab/src/tsconfig.json`
    and `next/tsconfig.json` do: one description, and it is the
    module. */
export const SHARED = {
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
    /* The stock check's words, which keep the address they have
       always had: it is in `sw.js`'s precache list and in the one
       import at the top of `aab/tools/stock.js`, so the file moved
       and the URL did not. */
    "tool-strings.js": "aab/tools/stock.i18n.js",
    /* And the five calculators' arithmetic, which the browser,
       the fixture generator and the Kotlin port all read. */
    "calculators.js": "aab/calculators.js",
    /* And what a broker's JSON means, which the live portfolio
       page and the app both read. */
    "portfolio.js": "aab/portfolio.js",
  } as Record<string, string>,
};

/** The one thing here that is not tsc's output verbatim. A ladder
    is `shared/curricula/money.ts` at the source and
    `aab/money/curriculum.js` at the output, so the specifier
    `content.ts` reaches it by has to be rebased: tsc never
    rewrites a specifier beyond its extension. */
const rebase = (js: string): string =>
  js.replace(/from "\.\/curricula\/(\w+)\.js"/g, 'from "./$1/curriculum.js"');

/** Compile into a temporary directory and read the results back.
    Not straight into `aab/`, because `--check` has to compare
    without writing: a check that fixed what it was asked to find
    would always pass. */
export function compile() {
  const out = mkdtempSync(join(tmpdir(), "reiad-modules-"));
  try {
    execFileSync("npx", [
      "tsc", "-p", join(SRC, "tsconfig.json"),
      "--outDir", out, "--declarationDir", join(out, "types"),
    ], { cwd: ROOT, stdio: "pipe" });

    /* Repo-relative path to the text that belongs at it.
       `aab/src/` is a PREFIX on everything this compile emits, and
       that is not cosmetic: `pieces.ts` imports `/content.js`, so
       `shared/content.ts` is an input, so that config's `rootDir`
       is the repo root. Change `rootDir` and these three joins
       change with it. */
    const built: Record<string, string> = {};
    for (const name of MODULES) {
      built[`aab/${name}.js`] = readFileSync(join(out, SRC_UNDER_ROOT, `${name}.js`), "utf8");
      built[`app/src/types/${name}.d.ts`] =
        readFileSync(join(out, "types", SRC_UNDER_ROOT, `${name}.d.ts`), "utf8");
    }
    /* Anything else tsc produced FROM THIS DIRECTORY. A module
       added to `aab/src/` and not to MODULES would otherwise be
       compiled and silently thrown away. Recursive, so a stray in
       a subdirectory is still a stray. `shared/` is emitted here
       too and is not a stray: those are read out of their own
       compile below, because only that one applies `rebase`. */
    const strays = readdirSync(out, { recursive: true })
      .map((f) => String(f).replaceAll("\\", "/"))
      .filter((f) => f.startsWith(`${SRC_UNDER_ROOT}/`))
      .map((f) => f.slice(SRC_UNDER_ROOT.length + 1))
      .filter((f) => f.endsWith(".js"))
      .filter((f) => !MODULES.includes(f.replace(/\.js$/, "")));

    /* And the manifest and the four ladders, out of `shared/`:
       their own directory, because that run's `rootDir` is
       `shared/` and tsc refuses an input above it. Only the files
       named in SHARED.files are read back, which is why nothing
       walks this output looking for strays. */
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
