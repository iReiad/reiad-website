#!/usr/bin/env node
/* ============================================================
   check-closed.ts: the old system is a CLOSED SET.

       node scripts/check-closed.ts
       node scripts/check-closed.ts --list      what is still in it
       node scripts/check-closed.ts --update    re-record, after a removal

   ---- the rule this exists to hold ----

   Nothing new is built the old way. A page is a route under
   `next/app/`; a piece of interface is a component under
   `next/components/`. That has been the rule in CLAUDE.md since
   the migration started, and `MIGRATION.md` tracks what is left.

   It was prose, and prose about a rule is a rule enforced by
   whoever last read it. This file is the same rule as a
   ledger: every file of the old system is recorded by name, and
   the list may only get SHORTER.

     · a new file in `aab/`, or a new `.js` under `functions/`,
       is not in the ledger and this fails, naming what to build
       instead;
     · a conversion removes one, and `--update` records the
       shorter list so it cannot come back.

   ---- why a ledger and not a rule about names ----

   Because "is this new" is not a property of a filename. Every
   file in `aab/` was correct on the day it was written, and a
   check that could tell them apart by shape would have to
   encode taste. A ledger encodes a DATE instead: this is what
   the old system held when the door was shut, and anything else
   arrived after.

   ---- what it caught on the day it was written ----

   `aab/src/glow.ts`, the browser half of the pointer glow,
   written that morning as a served module because `tilt.ts` is
   one and the neighbours are always the pattern. It is
   `next/components/glow.tsx` instead: nothing outside the Next
   shell ever needed it, and building it the old way would have
   cost a module registration, a tsconfig path, a service-worker
   precache entry and a version bump, all to serve one listener
   to pages that are already React.

   That is the same failure `check-mjs.ts` was written for, one
   level up: somebody adds a thing beside the thing that is
   already there, and the pattern reproduces itself faster than
   the paragraph gets read.
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER = join(ROOT, "scripts", "closed-set.json");

const LIST = process.argv.includes("--list");
const UPDATE = process.argv.includes("--update");

/* ---------- what is inside the door ----------

   Two directories and one rule each. `aab/` is the old site:
   its browser modules, its two remaining HTML files, the
   TypeScript four served modules are compiled from.
   `functions/` is the Worker, where the rule is narrower
   because that directory is not being emptied: it is being
   converted file by file from `.js` to `.ts`, so a NEW `.ts`
   there is fine and a new `.js` is not.

   `build`, `check` and `test` files are excluded because they
   are not the site. A test beside a module is a test, and the
   `.mjs` and `.ts` rules already cover what they may be. */
interface Area {
  dir: string;
  /** True for a path this ledger governs. */
  holds: (rel: string) => boolean;
  /** What to build instead, said in the failure. */
  instead: string;
}

const TOOLING = /(^|\/)(check|build|import|export)-[^/]+$|\.test\.[a-z]+$/;

const AREAS: Area[] = [
  {
    dir: "aab",
    holds: (rel) => /\.(js|ts|tsx|html)$/.test(rel) && !TOOLING.test(rel)
      /* Output, not source. `build-modules.ts` writes these from
         `aab/src/` and from `shared/`, so a new one here is a
         new SOURCE file, which the source's own entry catches. */
      && !/^(content|api|share-card|glow|tilt|app|editor|photo|auth|audience|activation|pieces|streak|prefs|signin|saved|sync|account|checkpoints|courses|routine)\.js$/.test(rel)
      && !/\/curriculum\.js$/.test(rel)
      && !/^studio\//.test(rel)
      && !/^fallback\.css$/.test(rel),
    instead: "a route under next/app/ or a component under next/components/",
  },
  {
    dir: "functions",
    holds: (rel) => rel.endsWith(".js") && !TOOLING.test(rel),
    instead: "the same file as .ts, which wrangler's esbuild type-strips with no config",
  },
];

function walk(dir: string, base: string, out: string[]): void {
  let entries: string[] = [];
  try { entries = readdirSync(dir); } catch { return; }
  for (const name of entries) {
    if (name.startsWith(".") || name === "node_modules") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, base, out);
    else out.push(relative(base, full));
  }
}

const found: string[] = [];
for (const area of AREAS) {
  const files: string[] = [];
  walk(join(ROOT, area.dir), join(ROOT, area.dir), files);
  for (const rel of files) {
    if (area.holds(rel)) found.push(`${area.dir}/${rel}`);
  }
}
found.sort();

const insteadFor = (path: string): string =>
  AREAS.find((a) => path.startsWith(`${a.dir}/`))?.instead ?? "";

if (UPDATE) {
  writeFileSync(LEDGER, `${JSON.stringify(found, null, 2)}\n`);
  console.log(`closed set: recorded ${found.length} file(s).`);
  process.exit(0);
}

const recorded: string[] = JSON.parse(readFileSync(LEDGER, "utf8"));
const known = new Set(recorded);

if (LIST) {
  console.log(`\n${recorded.length} file(s) still on the old system:\n`);
  for (const path of recorded) console.log(`  ${path}`);
  console.log("\nMIGRATION.md is what tracks them. This file is what stops"
    + "\nthe list growing while somebody is converting it.");
  process.exit(0);
}

const added = found.filter((path) => !known.has(path));
const gone = recorded.filter((path) => !found.includes(path));

if (added.length) {
  console.error("\nThe old system is closed, and these are new in it:\n");
  for (const path of added) {
    console.error(`  ${path}`);
    console.error(`      build it as ${insteadFor(path)}`);
  }
  console.error("\nCLAUDE.md, \"React or a route\": nothing new is built the old"
    + "\nway. If this file genuinely has to live there, say why in"
    + "\nMIGRATION.md and run:\n"
    + "\n    node scripts/check-closed.ts --update\n");
  process.exit(1);
}

console.log(
  gone.length
    ? `closed set: ${found.length} left, ${gone.length} converted since the ledger.`
      + " Run --update to record it."
    : `closed set: ${found.length} file(s), none new.`,
);
