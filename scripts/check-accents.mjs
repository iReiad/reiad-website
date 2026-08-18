#!/usr/bin/env node
/* ============================================================
   check-accents.mjs: one table decides what colour a page wears.

       node scripts/check-accents.mjs

   `next/lib/nav.ts` says which colour each destination owns, and
   `--accent` is the single property every component reads. The
   whole design rests on that mapping existing once.

   It did not. `aab/styles.css` carried five rules of the shape
   `body.deutsch { --accent: var(--blue) }`, covering five of the
   sixteen destinations, and they agreed with the rail only
   because nobody had added the sixth. This fails if they come
   back, and it fails if the table starts naming a colour the
   stylesheet does not define.
   ============================================================ */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { NAV, ACCENTS, accentFor, htmlAttrs } from "../next/lib/nav.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

const problems = [];
const say = (m) => problems.push(m);

/* ============================================================
   1. Nothing else sets --accent per section
   ============================================================ */

const css = read("aab/styles.css");

/* A rule that sets `--accent` under a body class or a section
   attribute is a second copy of this table. `:root` is the
   default and a component setting it on itself is scoping, not
   mapping, so neither of those counts. */
for (const m of css.matchAll(/^\s*(body\.[a-z-]+|\[data-section[^\]]*\])[^{]*\{[^}]*--accent\s*:/gmi)) {
  say(`aab/styles.css maps a section to a colour: \`${m[1].trim()}\`.\n`
    + "        That mapping belongs in next/lib/nav.ts and nowhere else.");
}

/* ============================================================
   2. Every colour the table names is a colour that exists
   ============================================================ */

/* Read the token names the stylesheet defines, so a typo in the
   table is caught here rather than by a reader seeing the default
   green on a page that should have been teal. */
const defined = new Set(
  [...css.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gmi)].map((m) => m[1]));

for (const [key, value] of Object.entries(ACCENTS)) {
  const name = /^var\(\s*(--[a-z0-9-]+)\s*\)$/i.exec(String(value))?.[1];
  if (!name) {
    say(`${key} names \`${value}\`, which is not a var(--token): a colour written `
      + "out here is a colour that cannot follow the theme");
    continue;
  }
  if (!defined.has(name)) {
    say(`${key} names \`${name}\`, which aab/styles.css does not define`);
  }
}

/* ============================================================
   3. Every destination in the rail has one
   ============================================================ */

for (const group of NAV) {
  for (const item of group.items) {
    const key = item.key ?? item.href;
    if (!accentFor(key)) say(`${key} is in the rail and owns no colour`);
  }
}

/* ============================================================
   4. The renderers agree

   Two of them: `accentStyle()` for a route and `htmlAttrs()` for
   the six pages that build their own <html>. A page rendered one
   way and a page rendered the other must wear the same colour, or
   the practice book is a different blue from the Stufe that links
   to it.
   ============================================================ */

for (const key of Object.keys(ACCENTS)) {
  const attrs = htmlAttrs(key);
  const wanted = accentFor(key);
  if (!attrs.includes(`--accent: ${wanted}`)) {
    say(`htmlAttrs(${key}) does not carry ${wanted}, so a static page and a `
      + "route would disagree about that section's colour");
  }
}

/* `in-skills` is the one alias, and both renderers have to know
   it: four routes still pass it for a piece in the kitchen or on
   the travel desk. */
if (accentFor("skills") !== null) {
  const viaAlias = htmlAttrs("in-skills");
  if (!viaAlias.includes(`--accent: ${accentFor("skills")}`)) {
    say("htmlAttrs('in-skills') does not resolve to the skills colour, "
      + "so four routes would fall back to the site default");
  }
}

/* ============================================================ */

if (problems.length) {
  console.error(`accents: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(
  `accents: ${Object.keys(ACCENTS).length} destination(s), each owning one colour `
  + "the stylesheet defines, mapped in one place.");
