/* ============================================================
   check-art.ts: a drawing may name nine colours, and every one
   of them has to be a colour somebody resolves.

   `shared/art-svg.ts` holds twelve subjects and six walls as the
   inside of an `<svg>`, and they are rendered in two places that
   resolve `var(--art-*)` in two completely different ways:

     the site   `@layer relief` declares the tokens on `.artwork`
                and the browser cascades them, so a token nobody
                declared computes to nothing and the shape is
                simply not painted.

     a card     `aab/src/share-card.ts` SUBSTITUTES them, from a
                list it holds, before the string is ever parsed.
                A token missing from that list would be left as
                the literal text `var(--art-x)`, which an SVG
                rasteriser reads as an invalid paint and draws in
                BLACK.

   So a thirteenth token is invisible on the site and a black
   rectangle on a card. The card guards itself, by refusing to
   draw anything with a token left in it, which turns the black
   rectangle into no picture at all. This is what says so before
   either happens.

   It also checks the pairing: every subject stands against a
   wall, and a subject with no entry in `MOTIF_OF` gets
   `undefined`, which is a room with no back to it.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { ART_MOTIFS, ART_SUBJECTS_SVG, MOTIF_OF, MOTIFS_LIST }
  from "../shared/art-svg.ts";
import { ART_SUBJECTS } from "../shared/art.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The list the card substitutes from, read out of the module
    rather than copied, which is the whole point of a check. */
const listed = (() => {
  const src = readFileSync(join(ROOT, "aab/src/share-card.ts"), "utf8");
  const block = src.match(/export const ART_TOKENS = \[([\s\S]*?)\] as const/)?.[1];
  if (!block) {
    console.error("could not find ART_TOKENS in aab/src/share-card.ts");
    process.exit(1);
  }
  return new Set([...block.matchAll(/"([a-z-]+)"/g)].map((m) => m[1]));
})();

const failures: string[] = [];
const used = new Set<string>();

const drawings: Array<[string, string]> = [
  ...Object.entries(ART_SUBJECTS_SVG).map(([k, v]) => [`subject ${k}`, v] as [string, string]),
  ...Object.entries(ART_MOTIFS).map(([k, v]) => [`wall ${k}`, v] as [string, string]),
];

for (const [what, svg] of drawings) {
  for (const [, token] of svg.matchAll(/var\(--art-([a-z-]+)\)/g)) {
    used.add(token);
    if (!listed.has(token)) {
      failures.push(`${what} names --art-${token}, which `
        + "aab/src/share-card.ts does not substitute");
    }
  }
  /* A literal colour is the same failure the components check
     names one floor up: a picture that stops following its own
     section. */
  const literal = svg.match(/(?:fill|stroke|stop-color)="(#[0-9a-f]{3,8}|rgb|hsl)/i);
  if (literal) failures.push(`${what} names a colour (${literal[1]}) rather than a token`);
}

for (const subject of ART_SUBJECTS) {
  if (!ART_SUBJECTS_SVG[subject]) failures.push(`subject ${subject} has no drawing`);
  const wall = MOTIF_OF[subject];
  if (!wall) failures.push(`subject ${subject} stands against no wall`);
  else if (!ART_MOTIFS[wall]) failures.push(`subject ${subject} stands against ${wall}, which is not drawn`);
}

for (const wall of MOTIFS_LIST) {
  if (!ART_MOTIFS[wall]) failures.push(`wall ${wall} is named and not drawn`);
}

/* And a token in the substitution list that no drawing uses,
   which is the same staleness the other way round: it costs a
   resolve per card and describes nothing. */
for (const token of listed) {
  if (!used.has(token)) {
    failures.push(`aab/src/share-card.ts resolves --art-${token}, `
      + "which no drawing names");
  }
}

if (failures.length) {
  console.error(`art: ${failures.length} problem(s):\n`);
  for (const f of failures) console.error(`   ${f}`);
  console.error("\nA token the card cannot substitute is left as literal text, which");
  console.error("an SVG rasteriser paints BLACK; the card refuses to draw rather than");
  console.error("do that, so the symptom is a card with an empty room. On the site the");
  console.error("same token is simply never declared and the shape is not painted at");
  console.error("all. Neither of those is an error anything else would report.");
  process.exit(1);
}

console.log(`art: ${ART_SUBJECTS.length} subject(s) and ${MOTIFS_LIST.length} wall(s), `
  + `naming ${used.size} token(s), every one of them resolved in both places.`);
