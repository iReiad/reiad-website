#!/usr/bin/env node
/* ============================================================
   check-next.mjs: the things `next/` has a second copy of.

       node scripts/check-next.mjs

   The Next.js app is a package with its own root, and three
   things it renders live outside that root. All are copied in,
   and a copy nobody checks is the failure this repository has
   written up more times than any other.

   1. THE DRAWINGS on a Bangla reading card. `aab/learn/icons.js`
      is a browser module served out of `aab/`, and Turbopack
      refuses to resolve above `next/`, which is the wall
      `shared/` exists to get round. Promoting the whole icon set
      to a shared package to render three of them would be the
      larger mistake, so `next/components/cards.tsx` holds the
      three as strings, exactly as `icon()` writes them.

   2. THE SCHOOLS' DRAWINGS, all 103 of them, in
      `next/lib/school-icons.ts`. Same wall, four times the size,
      so it is generated rather than kept by hand:
      `scripts/build-school-icons.mjs` writes it and this
      regenerates it and compares. Promoting four icon sets to
      `shared/` to draw a heading would be the larger mistake
      while forty files in `aab/` still import them; when the
      school pages stop being files, they move properly and both
      this and the generator go.

   There was a second copy here until Stage 11.2: the "coming
   soon" teasers on the Insights hub lived in both `content.js`
   and `next/lib/hub.ts` while both pages existed. The
   hand-written page is in `archive/` and the arrays in
   `content.js` are empty, so `next/lib/hub.ts` is the only place
   those three sentences are written and there is nothing left to
   compare. The drawings stay: they are about two runtimes rather
   than about a transition, and they do not go away.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { icon } from "../aab/learn/icons.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

let failures = 0;
const fail = (line, ...detail) => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

/* ------------------------------------------------------------
   1. The three drawings a reading section uses
   ------------------------------------------------------------ */

const cards = read("next/components/cards.tsx");

/** The inside of the <svg>, which is the part `cards.tsx` holds
    as a string and hands to React as HTML. The wrapper around it
    is JSX in that file and the same attributes either way. */
const inner = (name) => icon(name).replace(/^<svg[^>]*>|<\/svg>$/g, "");

for (const name of ["cart", "book", "compass"]) {
  if (!cards.includes(inner(name))) {
    fail(`the "${name}" drawing in next/components/cards.tsx is not the one`
      + " aab/learn/icons.js draws.",
      "Copy it across verbatim:",
      `  ${name}: \`${inner(name)}\`,`);
  }
}

/* ------------------------------------------------------------
   2. The schools' 103 drawings, generated
   ------------------------------------------------------------ */

const { generate } = await import("./build-school-icons.mjs");
const wanted = await generate();
const drawings = (wanted.match(/^\s{4}"/gm) ?? []).length;

if (read("next/lib/school-icons.ts") !== wanted) {
  fail("next/lib/school-icons.ts is not what aab/*/icons.js draws.",
    "Regenerate it and commit the result:",
    "  node scripts/build-school-icons.mjs");
}

console.log(failures
  ? `\n${failures} copy(ies) in next/ have drifted from the original.\n`
  : `next/ holds 3 drawings copied out of aab/ by hand and ${drawings}\n`
    + "generated, and every one still matches what icons.js draws.\n");
process.exit(failures ? 1 : 0);
