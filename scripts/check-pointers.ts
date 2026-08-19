/* ============================================================
   check-pointers.ts: does a comment naming a file name one that
   exists?

     node scripts/check-pointers.ts

   THE BUG THIS EXISTS FOR, nineteen times over

   This repository writes long comments on purpose, and the long
   ones are the good ones: they say what will fail, what must never
   be renamed, why an order is load-bearing. A great many of them
   also say **where to go and look**, and that half rots silently.

   Converting `scripts/` to TypeScript over four changes renamed
   thirty-six files, and every rename left pointers behind. A scan
   found twenty-five names that resolved to nothing:

   - `share-card.ts` sent a reader to `scripts/check-modules.mjs`,
     which has never existed under any extension.
   - `SETUP.md` had `node aab/check-routes.mjs` as an instruction
     to run: wrong in the directory AND the extension.
   - `README.md` told anybody regenerating the site to run
     `scripts/build-styles.mjs`, three days after it was deleted.
   - `CLAUDE.md` gave two build commands for files that went with
     the practice books when those became routes.
   - and two comments promised a `check-workbook.mjs` that has
     never existed, which is worse than a stale pointer: the next
     person reads "a check holds these two together", believes it,
     and stops looking.

   None of it fails anything. A stale pointer costs nothing until
   somebody follows it, which is exactly why it survives.

   ---- what it does not read, and why ----

   `archive/` is not a source. It is frozen history: a page that
   has been replaced goes there so whoever has to check the
   replacement can still read it, and a file there naming a file
   that was deleted afterwards is what history looks like rather
   than a mistake. It IS a resolution target, so a live comment
   pointing INTO the archive resolves.

   ---- and the list of names that are gone on purpose ----

   `GONE` below is keyed by file AND name, not by name alone. A
   comment that says "`build-styles.mjs` is gone" is correct and a
   NEW comment naming it somewhere else is not, and a list keyed
   by name alone would let the second through. Each entry carries a
   reason, because "it is probably fine" is how a list stops
   meaning anything.
   ============================================================ */

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
  /* Two files say this one never existed, which is the point of
     saying it: `share-card.ts` sent a reader to it for a year. */
  { file: "MIGRATION.md", name: "scripts/check-modules.mjs",
    why: "the record of a pointer that never resolved" },
  { file: "aab/sw.js", name: "scripts/check-modules.mjs",
    why: "the same, said where the reader it misled would be" },

  /* Deleted on 18 August 2026 when Next took the Tailwind
     compiler over. All three name it as gone. */
  { file: "ARCHITECTURE.md", name: "scripts/build-styles.mjs",
    why: "names it as gone, with what replaced it" },
  { file: "MIGRATION.md", name: "scripts/build-styles.mjs",
    why: "the same" },
  { file: "next/postcss.config.mjs", name: "scripts/build-styles.mjs",
    why: "says why this config exists and that script does not" },

  /* Never existed, and two components promised it. Both say so
     now rather than promising it. */
  { file: "MIGRATION.md", name: "check-workbook.mjs",
    why: "the record of a check two comments promised and nobody wrote" },
  { file: "next/lib/workbook.ts", name: "check-workbook.mjs",
    why: "names the check that does not exist, so nobody assumes it does" },
  { file: "next/components/workbook.tsx", name: "check-workbook.mjs",
    why: "the same" },

  /* The rule tripping over its own example, which is the right
     outcome and is left as one: CLAUDE.md explains why GONE is
     keyed by file and name using this name, and an entry is what
     that costs. */
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

  /* Precached, so editing a comment in one costs every returning
     visitor a refetch of the whole shell. Free to fix on the day
     each becomes aab/src/*.ts, and that is when they will be. */
  { file: "aab/app.js", name: "check-content.mjs", why: "precached; see MIGRATION.md" },
  { file: "aab/content.js", name: "check-content.mjs", why: "precached; see MIGRATION.md" },
  { file: "aab/deutsch/curriculum.js", name: "build-deutsch.mjs", why: "precached" },
  { file: "aab/english/curriculum.js", name: "build-english.mjs", why: "precached" },
  { file: "aab/tools/stock.model.js", name: "stock.test.mjs", why: "precached" },
];

const allowed = new Set(GONE.map((g) => `${g.file} ${g.name}`));

/* ---------- what to read ---------- */

const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
  .split("\n").filter(Boolean);

/* `archive/` is history and is read by nothing. The build outputs
   are somebody else's code carrying somebody else's comments. */
const NOT_A_SOURCE =
  /^(archive\/|next\/\.next\/|next\/\.open-next\/|next\/node_modules\/|node_modules\/)/;
const BINARY = /\.(png|jpe?g|webp|gif|svg|ico|woff2?|pdf|db|mp4|zip)$/i;

/** Names shaped like one of ours. A comment naming `react.dev` or
    `index.html` is not this: what rots is the name of a script
    somebody is being sent to run or to read. */
const NAMES = new RegExp(
  "(?<![\\w/.-])((?:[\\w./()-]*/)?"
  + "(?:check-[\\w.-]+|build-[\\w.-]+|import-[\\w.-]+|export-[\\w.-]+|[\\w.-]+\\.test)"
  + "\\.(?:mjs|cjs|js|jsx|ts|tsx))(?![\\w-])",
  "g");

/** Every file in the repository, by basename, so a comment can
    name one without giving its path.

    Walked off DISK rather than taken from `git ls-files`, and the
    difference is a real one: a file that has been written and not
    yet committed exists, and an index-only answer fails on the
    very commit that adds the thing a new comment points at. This
    check did that to itself twice while being written. The index
    still decides what is READ, which is a different question. */
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

/** Does this name reach a file? Relative to the file it was
    written in, then repo-relative, then by basename alone.

    The first two ask the FILESYSTEM and only the third asks the
    index, and the order is not incidental: a file that has been
    written and not yet committed exists, and a check that said
    otherwise would fail on the commit that adds the thing a new
    comment is pointing at. This one did, on itself, the first
    time it ran. */
const resolves = (name: string, from: string): boolean => {
  const clean = name.replace(/^\//, "");
  if (existsSync(join(ROOT, dirname(from), name))) return true;
  /* Not a name that starts with a dot: `../x.ts` is an import and
     belongs to the line above, and joined on to ROOT it would ask
     about a file OUTSIDE the repository, where a hit is a pass
     nobody meant. */
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
const used = new Set<string>();
let read = 0;

for (const file of tracked) {
  if (NOT_A_SOURCE.test(file) || BINARY.test(file)) continue;
  let text: string;
  try { text = readFileSync(join(ROOT, file), "utf8"); } catch { continue; }
  read += 1;

  for (const name of new Set([...text.matchAll(NAMES)].map((m) => m[1]))) {
    if (resolves(name, file)) continue;
    const key = `${file} ${name}`;
    if (allowed.has(key)) { used.add(key); continue; }
    dead.push({ file, name });
  }
}

/* An entry that has stopped being needed is the same failure one
   level up: a list that was right on the day it was written. */
const stale = GONE.filter((g) => !used.has(`${g.file} ${g.name}`));

if (dead.length || stale.length) {
  if (dead.length) {
    console.error(`\n${dead.length} comment(s) name a file that does not exist:\n`);
    for (const { file, name } of dead) console.error(`  x ${file}\n        names ${name}`);
    console.error(
      "\n        Follow it. If the file was renamed, say the new name; if it went,"
      + "\n        say so and add it to GONE in scripts/check-pointers.ts with the"
      + "\n        reason. A pointer nobody can follow costs nothing until somebody"
      + "\n        tries, which is exactly why they survive.\n");
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
