/* check-pointers.ts: does a comment naming a file name one that
   exists?

     node scripts/check-pointers.ts

   A great many comments here say where to go and look, and that
   half rots silently: converting `scripts/` to TypeScript left
   twenty-five names resolving to nothing, two of which promised a
   check nobody had ever written. None of it fails anything, which
   is exactly why they survive.

   `GONE` below is keyed by file AND name, not by name alone: "x is
   gone" is a correct sentence and a NEW comment naming x somewhere
   else is not. Each entry carries its reason, and an entry that
   has stopped being needed fails too. */

import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** A file, a name in it, and why that name is allowed to point at
    nothing. */
interface Gone {
  file: string;
  name: string;
  why: string;
}

const GONE: Gone[] = [
  /* Named in the past tense, in the paragraph explaining why a
     test whose subject is a module should not be named after a
     page: it was `aab/studio.test.ts`, it spent its life failing
     on a 404, and it is `aab/editor.test.ts` now. Saying the old
     name is the whole of what that paragraph is for. */
  { file: "CLAUDE.md", name: "aab/studio.test.ts",
    why: "renamed to aab/editor.test.ts; the prose is about the rename" },
  /* Two files say this one never existed, which is the point of
     saying it: `share-card.ts` sent a reader to it for a year. */
  { file: "MIGRATION.md", name: "scripts/check-modules.mjs",
    why: "the record of a pointer that never resolved" },
  /* A path asserted ABSENT. `/admin`'s page and layout are in
     `(panel)/` so that `/admin/research` does not inherit a
     second shell, and the way to say that is to check that
     nothing is at the old path. A name that must not resolve is
     the one shape this check cannot tell from a stale pointer. */
  { file: "scripts/admin.test.ts", name: "next/app/(site)/admin/layout.tsx",
    why: "asserted absent: a layout there would wrap /admin/research too, "
      + "so the panel's own is in (panel)/ and this is the check for it" },

  /* Deleted on 18 August 2026 when Next took the Tailwind
     compiler over. All three name it as gone. */
  { file: "ARCHITECTURE.md", name: "scripts/build-styles.mjs",
    why: "names it as gone, with what replaced it" },
  { file: "MIGRATION.md", name: "scripts/build-styles.mjs",
    why: "the same" },
  { file: "next/postcss.config.mjs", name: "scripts/build-styles.mjs",
    why: "says why this config exists and that script does not" },

  /* Never existed under any extension, and two components named
     it. Each of these now names the check that really does the job
     and says what the old name was, which is the point: one of the
     two guarantees was real all along and the pointer was wrong,
     which is the worse way to be wrong. */
  { file: "MIGRATION.md", name: "check-workbook.mjs",
    why: "the record of a name two comments carried and nothing answered to" },

  /* Deleted when Next took the Tailwind compiler over. All three
     name it as gone. */
  { file: "CLAUDE.md", name: "build-styles.mjs",
    why: "the example in the rule that this list exists for" },

  /* The record of the sweep itself. */
  { file: "MIGRATION.md", name: "check-css.mjs", why: "a pointer this found" },
  { file: "MIGRATION.md", name: "check-icons.mjs", why: "a pointer this found" },
  { file: "MIGRATION.md", name: "aab/check-routes.mjs",
    why: "the SETUP.md instruction that was wrong twice over" },
  { file: "MIGRATION.md", name: "aab/deutsch/build-deutsch.mjs",
    why: "names the two builders that went with the books" },
  { file: "MIGRATION.md", name: "build-english.mjs",
    why: "the same" },

  /* Went with the practice books when those became routes, #129.
     Each of these names it as gone. */
  { file: "aab/deutsch/arbeitsbuch.data.js", name: "build-deutsch.mjs",
    why: "says the assertion it made went with it" },
  { file: "aab/english/workbook.data.js", name: "build-english.mjs",
    why: "the same" },

  /* A plan names what it planned to delete, and the deletion
     happened. Reading it for what the site looks like now is the
     mistake its own header warns against. */
  { file: "PLAN.md", name: "aab/deutsch/build-deutsch.mjs",
    why: "Phase 0 is a list of things to delete, and they were" },
  { file: "PLAN.md", name: "aab/english/build-english.mjs",
    why: "the same" },

  /* A scratch file, downloaded, checked and removed inside one
     job. It is named three times because the job writes it, reads
     it and deletes it, and it has never been in the repository. */
  { file: ".github/workflows/backup.yml", name: "content/articles.backup.raw.json",
    why: "written and removed by the same job; never committed" },

  /* A plan names what it planned to delete, and the deletion
     happened. Reading it for what the site looks like now is the
     mistake its own header warns against. */
  { file: "scripts/check-closed.ts", name: "aab/src/glow.ts",
    why: "the same, in the check that refused it" },

  /* The stylesheet moved to `next/styles/` on 18 August 2026.
     These three are the moved-from column of that stage, and one
     built file that went with the compiler it needed. */
  { file: "ARCHITECTURE.md", name: "aab/styles.css",
    why: "the moved-from column, beside `next/styles/site.css`" },
  { file: "ARCHITECTURE.md", name: "aab/src/styles/tailwind.css",
    why: "the same, beside `next/styles/tailwind.css`" },
  { file: "ARCHITECTURE.md", name: "aab/tailwind.css",
    why: "the committed output, named as gone with the script that wrote it" },
  { file: "MIGRATION.md", name: "aab/styles.css",
    why: "a pointer this found: a check printed it after the file moved" },
  { file: "MIGRATION.md", name: "aab/tailwind.css",
    why: "the same, said three days after the file went" },
  { file: "next/postcss.config.mjs", name: "aab/tailwind.css",
    why: "names the committed output as gone, which is why this config exists" },

  /* The module the closed door turned back. It was never
     committed: the pointer glow is `next/components/glow.tsx`, and
     naming the file that would have been is the argument. */
  { file: "next/comments.test.ts", name: "aab/comments.js",
    why: "asserts the replaced module is not served, by its address" },
  { file: "next/insights-hub.test.ts", name: "aab/hub.js", why: "the same" },
  { file: "next/keep.test.ts", name: "aab/keep.js", why: "the same" },
  { file: "next/market-pulse.test.ts", name: "aab/pulse.js", why: "the same" },
  { file: "next/read-aloud.test.ts", name: "aab/read-aloud.js", why: "the same" },
  { file: "next/research.test.ts", name: "aab/about.js", why: "the same" },

  /* The stylesheet moved to `next/styles/`. These three are the
     moved-from column of that stage, and one built file that went
     with the compiler it needed. */
  { file: "aab/tools/stock.model.js", name: "stock.test.mjs", why: "precached" },

  /* The one pointer here that must NEVER resolve. `admin.test.ts`
     asks whether the desk's route file exists and asserts the
     opposite thing either way: while it is there the panel has to
     admit /desk is served, and once it is gone the panel must stop
     naming it. Naming the path is how it asks. */
  { file: "scripts/admin.test.ts", name: "next/app/(site)/desk/page.tsx",
    why: "the check that asserts the retired route is absent, by its path" },
];

const allowed = new Set(GONE.map((g) => `${g.file} ${g.name}`));

  /* Six ports, each ending in a section that asserts the module it
     replaced is not served any more. The old address IS what is
     being asserted. */
const SELF = "scripts/check-pointers.ts";
const goneNames = new Set(GONE.map((g) => g.name));

/* ---------- what to read ---------- */

const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
  .split("\n").filter(Boolean);

  /* Precached, so editing a comment in one costs every returning
     visitor a refetch of the whole shell. Free to fix on the day
     it becomes aab/src/*.ts. */
const NOT_A_SOURCE =
  /^(archive\/|next\/\.next\/|next\/\.open-next\/|next\/node_modules\/|node_modules\/|content\/[\w-]+\.backup\.json$)/;

/* An IGNORE FILE is not prose that points at something. Every line
   in one is a path that is expected NOT to be in the repository,
   which is the opposite of what this check asks, and the answer
   depends on what has been BUILT rather than on what is committed:
   `.gitignore` names the `next-env.d.ts` that `next build` writes,
   so this passed on a laptop that had built and failed in CI on a
   fresh clone. That is the same trap the paragraph above describes
   for `node_modules/`, one file along.

   Note that this paragraph names that file WITHOUT its directory,
   and has to: a path into this repository is what `PATHS` below
   asks about, so writing it out here would fail this check on the
   commit that adds the exemption for it. Which it did. */
const AN_IGNORE_FILE = /(^|\/)\.[a-z]*ignore$|(^|\/)\.gitignore$/;
const BINARY = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|pdf|db|mp4|zip)$/i;

/** Names shaped like one of ours. A comment naming `react.dev` or
    `index.html` is not this: what rots is the name of a script
    somebody is being sent to run or to read. */
const NAMES = new RegExp(
  "(?<![\\w/.-])((?:[\\w./()-]*/)?"
  + "(?:check-[\\w.-]+|build-[\\w.-]+|import-[\\w.-]+|export-[\\w.-]+|[\\w.-]+\\.test)"
  + "\\.(?:mjs|cjs|js|jsx|ts|tsx))(?![\\w-])",
  "g");

/* What is not read. The build outputs are somebody else's code
   carrying somebody else's comments.

   The two nightly snapshots under `content/` are DATA. A generated
   file carries the comment its generator wrote, so the file that
   has to be right is the generator: correcting the snapshot would
   last until the next run overwrote it. */
const PATHS = new RegExp(
  "(?<![\\w/.-])((?:aab|app|functions|next|scripts|shared|supabase|content)"
  + "/[\\w./()\\[\\]-]+\\.(?:mjs|cjs|js|jsx|ts|tsx|css|json|sql|md))(?![\\w-])",
  "g");

/* An IGNORE FILE is not prose that points at something: every line
   in one is a path expected NOT to be in the repository, and the
   answer depends on what has been BUILT rather than on what is
   committed. `.gitignore` names the `next-env.d.ts` that `next
   build` writes, so this passed on a laptop and failed in CI on a
   fresh clone.

   That file is named here WITHOUT its directory, and has to be: a
   path into this repository is what `PATHS` below asks about, so
   writing it out would fail this check on the commit that adds the
   exemption. Which it did. */
const NOT_A_POINTER = /(^|\/)(node_modules|\.next|\.open-next)\//;

/** Names shaped like one of ours. A comment naming `react.dev` or
    `index.html` is not this: what rots is the name of a script
    somebody is being sent to run or to read. */
const byBase = new Map<string, string[]>();
(function index(dir: string): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    if (entry.name === ".next" || entry.name === ".open-next") continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) { index(full); continue; }
    const path = relative(ROOT, full);
    const list = byBase.get(entry.name);
    if (list) list.push(path);
    else byBase.set(entry.name, [path]);
  }
})(ROOT);

/** And any name carrying one of this repository's own directories.

    The list above catches a script somebody is told to RUN, and
    caught none of the twelve found in one sweep, which were all
    the other kind: a comment naming the MODULE that does
    something, by an extension it no longer has. A leading
    directory is what makes a bare name safe to check: `sync.ts` in
    prose could be anybody's, `functions/_lib/sync.ts` is ours.

    Square brackets are in the class because a route's filename has
    them, and without them thirteen of the seventeen handlers here
    were invisible. `*` stays OUT, so a glob like `aab/*.js`
    matches nothing and is never asked about: a glob describes a
    set rather than pointing at a file. */
const resolves = (name: string, from: string): boolean => {
  const clean = name.replace(/^\//, "");
  if (existsSync(join(ROOT, dirname(from), name))) return true;
/** Two paths that are not a pointer at a file in this repository.
    `node_modules/` is installed rather than committed, so whether
    it resolves depends on whether somebody has run `npm install`.
    `.next/` is a build. */
  if (clean.includes("/") && !clean.startsWith(".") && existsSync(join(ROOT, clean))) {
    return true;
  }
  const paths = byBase.get(basename(clean)) ?? [];
  if (!paths.length) return false;
  if (!clean.includes("/")) return true;
  return paths.some((path) => path === clean || path.endsWith(`/${clean}`));
};

/* ---------- the walk ---------- */

const dead: Array<{ file: string; name: string }> = [];
/** Every file in the repository, by basename, so a comment can
    name one without giving its path.

    Walked off DISK rather than taken from `git ls-files`: a file
    written and not yet committed exists, and an index-only answer
    fails on the very commit that adds the thing a new comment
    points at. The index still decides what is READ, which is a
    different question. */
const built: Array<{ file: string; name: string }> = [];
const inIndex = new Set(tracked);
const used = new Set<string>();
let read = 0;

for (const file of tracked) {
  if (NOT_A_SOURCE.test(file) || BINARY.test(file) || AN_IGNORE_FILE.test(file)) continue;
  let text: string;
  try { text = readFileSync(join(ROOT, file), "utf8"); } catch { continue; }
  read += 1;

  const named = new Set([
    ...[...text.matchAll(NAMES)].map((m) => m[1]),
    ...[...text.matchAll(PATHS)].map((m) => m[1]).filter((n) => !NOT_A_POINTER.test(n)),
  ]);
  for (const name of named) {
    if (resolves(name, file)) {
      /* Resolved. On what, though? A repo-relative name that the
         index does not carry is a generated file, and generated
         files are not there before something has generated them. */
      const clean = name.replace(/^\//, "");
      if (clean.includes("/") && !clean.startsWith(".") && !inIndex.has(clean)
          && existsSync(join(ROOT, clean))) {
        built.push({ file, name });
      }
      continue;
    }
    /* Before the allowlist, and NOT recorded as using an entry: a
       GONE line whose only remaining mention is the GONE line
       itself has stopped being needed, and should say so. */
    if (file === SELF && goneNames.has(name)) continue;
    const key = `${file} ${name}`;
    if (allowed.has(key)) { used.add(key); continue; }
    dead.push({ file, name });
  }
}

/* An entry that has stopped being needed is the same failure one
   level up: a list that was right on the day it was written. */
const stale = GONE.filter((g) => !used.has(`${g.file} ${g.name}`));

if (dead.length || stale.length || built.length) {
  if (dead.length) {
    console.error(`\n${dead.length} comment(s) name a file that does not exist:\n`);
    for (const { file, name } of dead) console.error(`  x ${file}\n        names ${name}`);
    console.error(
      "\n        Follow it. If the file was renamed, say the new name; if it went,"
      + "\n        say so and add it to GONE in scripts/check-pointers.ts with the"
      + "\n        reason. A pointer nobody can follow costs nothing until somebody"
      + "\n        tries, which is exactly why they survive.\n");
  }
  if (built.length) {
    console.error(`\n${built.length} name(s) resolve only because something has been built:\n`);
    for (const { file, name } of built) console.error(`  x ${file}\n        names ${name}`);
    console.error(
      "\n        It is not committed, so it is not there on a fresh clone and this"
      + "\n        check goes red in CI on a commit that passed on a laptop. Name it"
      + "\n        without its directory if the sentence still reads, or name the"
      + "\n        source it is generated from instead.\n");
  }
  if (stale.length) {
    console.error(`\n${stale.length} GONE entr(y/ies) no longer needed:\n`);
    for (const g of stale) console.error(`  x ${g.file} no longer names ${g.name}`);
    console.error("\n        Take it out: the list is worth having only while it is true.\n");
  }
  process.exit(1);
}

console.log(
  `pointers: every file named in ${read} tracked file(s) exists, `
  + `and the ${GONE.length} named as gone really are.`);
