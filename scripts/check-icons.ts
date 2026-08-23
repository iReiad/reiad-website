#!/usr/bin/env node
/* ============================================================
   check-icons.ts: an icon name that draws nothing.

       node scripts/check-icons.ts
       node scripts/check-icons.ts --list

   ---- what this is for ----

   `iconInner()` in `next/components/icons.tsx` answers the EMPTY
   STRING for a name it does not know, and `<Icon>` renders a
   correctly sized `<svg>` with a correct stroke and nothing
   inside it. That is not an error, it does not warn, and it
   looks in a diff exactly like a name that works.

   It has already happened, and the file it happened in says so:
   the money school's id was `learn` until the school moved to
   `/money/`, the lookup still said `SCHOOL_ICONS.learn`
   afterwards, and `?.` answered `undefined` instead of throwing.
   Every icon a card or a lesson asked for fell through to the
   shell set, missed there too, and came back empty. Sixteen
   blank icons on the money hub alone, for as long as it took
   somebody to look at the page rather than at the code.

   So this resolves every literal icon name in `next/` the same
   way the component does, and fails on any that comes back with
   nothing in it.

   ---- and the second half, which is drift ----

   The diet tool keys its glyphs by href in
   `next/components/diet/icons.ts`, beside the table in
   `next/lib/diet-pages.ts` that says what a page is. Two tables
   keyed by the same thing drift, and this one drifts silently
   for the reason above: a page added to the table with no entry
   here renders a card with an empty tile. Both directions are
   checked.
   ============================================================ */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { SCHOOL_ICONS } from "../next/lib/school-icons.ts";
import { DIET_PAGES } from "../next/lib/diet-pages.ts";
import { DIET_ICONS } from "../next/components/diet/icons.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");
let bad = 0;

/* ---------- the two sets, read the way the component reads them ----------

   `icons.tsx` holds JSX, so it cannot be imported by a node
   script that only strips types. The SHELL object in it is a
   flat map of name to template literal, which is why the keys
   can be read out of the source: a shape change there breaks
   this loudly rather than quietly, which is the right direction.

   The money school's set is a real module and is imported. */
const SRC = readFileSync(join(ROOT, "next", "components", "icons.tsx"), "utf8");
const shellBody = SRC.slice(SRC.indexOf("const SHELL"), SRC.indexOf("const CARD_ICONS"));
const SHELL = new Set(
  [...shellBody.matchAll(/^\s{2}([a-zA-Z][a-zA-Z0-9_]*):/gm)].map((m) => m[1]),
);
if (SHELL.size < 5) {
  console.error("check-icons cannot read SHELL out of next/components/icons.tsx.");
  console.error("Its shape changed. Fix the reader here rather than deleting the check.");
  process.exit(1);
}

const CARD = new Set(Object.keys(SCHOOL_ICONS.money ?? {}));
/* School first, shell second: the order `iconInner()` uses. A
   name in neither draws nothing. */
const known = (name: string): boolean => CARD.has(name) || SHELL.has(name);

/* An entry that resolves but is EMPTY is the same failure with
   one more step, so the drawing itself is checked rather than
   the key. */
const empty = new Set<string>();
for (const [name, inner] of Object.entries(SCHOOL_ICONS.money ?? {})) {
  if (!String(inner ?? "").trim()) empty.add(name);
}

if (LIST) {
  console.log(`school set: ${[...CARD].sort().join(" ")}`);
  console.log(`shell set:  ${[...SHELL].sort().join(" ")}`);
}

/* ---------- 1. every literal name in next/ ---------- */

const SKIP = new Set(["node_modules", ".next", ".turbo", "dist"]);
const files: string[] = [];
(function walk(dir: string): void {
  for (const entry of readdirSync(dir)) {
    if (SKIP.has(entry) || entry.startsWith(".")) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.tsx?$/.test(full) && !/\.test\.tsx?$/.test(full)) files.push(full);
  }
})(join(ROOT, "next"));

/* `name="x"` on an Icon element, `icon="x"` on a card, and
   `icon: "x"` in a table. A name built at runtime is not a
   literal and is not checked: that is what the table rule below
   is for. */
const USES = [
  /<Icon\b[^>]*?\bname=["']([a-zA-Z0-9_-]+)["']/g,
  /\bicon=["']([a-zA-Z0-9_-]+)["']/g,
  /\bicon:\s*["']([a-zA-Z0-9_-]+)["']/g,
];

let used = 0;
for (const file of files) {
  const text = readFileSync(file, "utf8");
  for (const pattern of USES) {
    for (const m of text.matchAll(pattern)) {
      used += 1;
      const name = m[1];
      if (known(name) && !empty.has(name)) continue;
      bad += 1;
      const line = text.slice(0, m.index).split("\n").length;
      console.error(`\n  x ${relative(ROOT, file)}:${line} asks for the icon "${name}"`);
      console.error(empty.has(name)
        ? "        which resolves to an empty drawing, so it renders a correctly"
          + "\n        sized svg with nothing in it."
        : "        which is in neither the school set nor the shell set, so"
          + "\n        iconInner() answers the empty string and Icon renders a"
          + "\n        correctly sized svg with nothing in it.");
    }
  }
}

/* ---------- 2. the diet tool's two tables, both directions ---------- */

for (const page of DIET_PAGES) {
  const name = DIET_ICONS[page.href];
  if (!name) {
    bad += 1;
    console.error(`\n  x ${page.href} is in DIET_PAGES and has no entry in DIET_ICONS.`);
    console.error("        Its card on the front door draws an empty tile. Add a name to"
      + "\n        next/components/diet/icons.ts.");
    continue;
  }
  /* AND THE NAME HAS TO DRAW SOMETHING. The literal scan above
     cannot see these: the deck passes `dietIcon(p.href)`, which
     is a call rather than a string, so a name in this table
     reaches `<Icon>` without ever appearing in the source as
     one. This file's own header promised this check and did not
     make it for a while, which is the shape of failure it exists
     to catch. */
  if (known(name) && !empty.has(name)) continue;
  bad += 1;
  console.error(`\n  x DIET_ICONS gives ${page.href} the icon "${name}", which draws nothing.`);
  console.error("        It is in neither the school set nor the shell set, so the card"
    + "\n        on the front door gets a correctly sized empty svg."
    + `\n        --list prints both sets.`);
}
const hrefs = new Set(DIET_PAGES.map((p) => p.href));
for (const href of Object.keys(DIET_ICONS)) {
  if (hrefs.has(href)) continue;
  bad += 1;
  console.error(`\n  x DIET_ICONS names ${href}, which is not a page in DIET_PAGES.`);
  console.error("        A stale entry costs nothing until somebody copies it.");
}

if (bad) {
  console.error(`\nicons: ${bad} problem(s).`);
  process.exit(1);
}
console.log(`icons: ${used} literal name(s) in next/ all draw something, `
  + `and ${DIET_PAGES.length} diet pages each have one.`);
