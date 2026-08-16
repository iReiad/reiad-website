#!/usr/bin/env node
/* ============================================================
   check-next.mjs: the things `next/` has a second copy of.

       node scripts/check-next.mjs

   The Next.js app is a package with its own root, and two things
   it renders live outside that root. Both are copied in, and a
   copy nobody checks is the failure this repository has written
   up more times than any other.

   1. THE DRAWINGS on a Bangla reading card. `aab/learn/icons.js`
      is a browser module served out of `aab/`, and Turbopack
      refuses to resolve above `next/`, which is the wall
      `shared/` exists to get round. Promoting the whole icon set
      to a shared package to render three of them would be the
      larger mistake, so `next/components/cards.tsx` holds the
      three as strings, exactly as `icon()` writes them.

   2. THE TEASERS on the Insights hub, the pieces that have been
      promised and not written. They are in the ARTICLES list in
      `aab/content.js`, where `aab/app.js` reads them for the
      hand-written `insights.html`, and in `next/lib/hub.ts`,
      where the route that replaces that page reads them. Two
      pages showing different "coming soon" cards is a small lie
      told twice.

      This half goes when `insights.html` is archived and the
      route is the only thing drawing them. The first half does
      not go: it is about two runtimes, not about a transition.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { icon } from "../aab/learn/icons.js";
import { ARTICLES } from "../aab/content.js";

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
   2. The pieces promised and not written
   ------------------------------------------------------------ */

const hub = read("next/lib/hub.ts");
const soonHere = ARTICLES.filter((a) => a.status === "soon");

/* Counted rather than assumed: an entry added to one list and not
   the other is exactly the drift being watched for, and it shows
   up as a count before it shows up as a missing sentence.

   Counted inside the SOON array rather than across the file,
   because the head of each hub carries a `title:` of its own and
   a count that includes those agrees with nothing. */
const soonBlock = hub.match(/export const SOON = \[([\s\S]*?)\n\];/)?.[1] ?? "";
const soonThere = (soonBlock.match(/^\s*title:/gm) ?? []).length;
if (soonThere !== soonHere.length) {
  fail(`content.js promises ${soonHere.length} unwritten pieces and`
    + ` next/lib/hub.ts has ${soonThere} teaser cards.`,
    "SOON in next/lib/hub.ts is what the rendered Insights hub draws;",
    "the ARTICLES entries marked soon are what insights.html draws.");
}

for (const piece of soonHere) {
  for (const [field, text] of [["title", piece.title], ["dek", piece.dek]]) {
    if (!hub.includes(text)) {
      fail(`the ${field} of the "${piece.slug}" teaser is not in next/lib/hub.ts.`,
        JSON.stringify(text));
    }
  }
}

console.log(failures
  ? `\n${failures} copy(ies) in next/ have drifted from the original.\n`
  : "next/ holds 3 drawings and "
    + `${soonHere.length} teasers, and each one still matches its original.\n`);
process.exit(failures ? 1 : 0);
