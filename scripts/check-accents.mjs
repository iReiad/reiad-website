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

const css = read("next/styles/site.css");

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

/* ============================================================
   3. And no rule paints a section colour by name
   ============================================================

   The mapping existing once is not enough on its own, and this is
   what proved it: `--accent` was set correctly on every page and
   then ignored by 388 declarations that named `var(--green)`
   instead. A German page carried `--accent: var(--blue)` on
   <html> and drew a green button, a green eyebrow and a green
   section label, because that is what the rules said.

   Nothing could see it. The routes were clean, the table was
   right, the attribute was on the element, and the page was the
   wrong colour.

   So: a rule may not name one of the seven. Three shapes are
   allowed and each is a real category:

     --accent: var(--green)   the DEFAULT, which has to name one
     --h-<name>               a hue, used by inks and papers that
                              are not accents at all
     the rail's own wash      the rail lists every section, so one
                              section's colour across it would be
                              a lie about where the reader is
*/

const NAMED = /var\(--(green|teal|blue|violet|plum|rose|gold)\)/g;
const OK = [
  /--accent(-[a-z]+)?:\s*var\(--[a-z]+\)/,   // the default
  /radial-gradient\(120% 55% at 0% 0%/,        // the rail's wash
  /radial-gradient\(90% 40% at 100% 100%/,
];

/* The gold that is left is the gold that MEANS something.

   192 of them said gold and meant "an eyebrow", "a kicker", "a
   tag": the second brand colour used as decoration, which is why
   the German page drew a gold eyebrow over a blue button. Those
   are the accent now.

   Twenty are not decoration. A warning is gold on every page
   including the gold one, a rung that is not written yet says so
   in gold, and a risk bar is gold because the bar beside it is
   red. Swapping those for the accent would say something false,
   so they stay and this counts them rather than forgetting
   them. */
let gold = 0;
const painted = [];
{
  const lines = css.split("\n");
  let inComment = false;
  lines.forEach((line, i) => {
    const opens = line.lastIndexOf("/*");
    const closes = line.lastIndexOf("*/");
    const wasIn = inComment;
    if (inComment && closes > -1) inComment = false;
    else if (!inComment && opens > -1 && closes < opens) inComment = true;
    if (wasIn || /^\s*(\*|\/\*)/.test(line)) return;

    const code = line.replace(/\/\*[\s\S]*?\*\//g, "");
    if (OK.some((re) => re.test(code))) return;
    for (const [, name] of code.matchAll(NAMED)) {
      if (name === "gold") { gold += 1; continue; }
      painted.push(`aab/styles.css:${i + 1}  ${code.trim().slice(0, 74)}`);
    }
  });
}

for (const at of painted) {
  say(`a rule names a section colour: ${at}\n`
    + "        Every component reads var(--accent), which <html> carries from\n"
    + "        the table in next/lib/nav.ts. A named colour is a rule that\n"
    + "        paints green on a page wearing blue.");
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
console.log(
  `           no rule paints a section colour by name (${gold} --gold left, `
  + "which mean warn, soon and second series rather than a section).");
