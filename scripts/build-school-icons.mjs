#!/usr/bin/env node
/* ============================================================
   build-school-icons.mjs: the schools' drawings, where `next/`
   can reach them.

       node scripts/build-school-icons.mjs           # write it
       node scripts/build-school-icons.mjs --check   # or compare

   archive/TRANSITION.md Stage 11.7. A lesson page puts a small drawing in
   its heading, and the four sets of them are browser modules
   under `aab/<school>/icons.js`. Turbopack refuses to resolve
   above `next/`, which is the wall `shared/` exists to get round,
   and those four files cannot go through it while forty files in
   `aab/` still import them.

   So this writes the fifth copy, and writes it rather than asking
   anybody to keep one by hand. `scripts/check-next.mjs` runs the
   same generation and fails if the committed file differs, which
   is the arrangement every generated page in this repository
   already has: edit the source, run the generator, commit both.

   Promoting the whole icon set to `shared/` instead would be the
   larger mistake today and the smaller one later: when the school
   pages stop being files, nothing in the browser imports these
   and the four modules can move properly. This file is what holds
   the two together until then, and it is deleted with them.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "next", "lib", "school-icons.ts");

const SCHOOLS = ["money", "deutsch", "quran", "english"];

/** Every name the school draws.

    Read out of the source rather than out of the module, because
    `PATHS` is not exported: `hasIcon()` is the only thing that
    answers for a name, so the names are found by looking and then
    confirmed by asking. A key that is not a drawing fails the
    second step and is left out. */
async function namesOf(school) {
  const src = readFileSync(join(ROOT, "aab", school, "icons.js"), "utf8");
  const mod = await import(join(ROOT, "aab", school, "icons.js"));
  return [...src.matchAll(/^\s{2}([a-zA-Z][\w-]*):/gm)]
    .map((m) => m[1])
    .filter((name) => mod.hasIcon(name));
}

/** The inside of the <svg>, which is the part React is handed as
    HTML. The wrapper is JSX in the component and carries the same
    attributes either way, exactly as `next/components/cards.tsx`
    already does for the three reading-card drawings. */
async function innerOf(school, name) {
  const mod = await import(join(ROOT, "aab", school, "icons.js"));
  return mod.icon(name).replace(/^<svg[^>]*>|<\/svg>$/g, "");
}

export async function generate() {
  const blocks = [];
  let count = 0;

  for (const school of SCHOOLS) {
    const names = await namesOf(school);
    const lines = [];
    for (const name of names) {
      lines.push(`  ${JSON.stringify(name)}: ${JSON.stringify(await innerOf(school, name))},`);
      count += 1;
    }
    blocks.push(`  ${school}: {\n${lines.map((l) => `  ${l}`).join("\n")}\n  },`);
  }

  return `/* ============================================================
   school-icons.ts: GENERATED. Do not edit.

       node scripts/build-school-icons.mjs

   The drawings the four schools put in a lesson's heading, copied
   out of \`aab/<school>/icons.js\` because \`next/\` cannot import
   above its own directory. \`scripts/check-next.mjs\` regenerates
   this and fails if what is committed differs, so the four
   browser modules stay the source and this stays a copy.

   ${count} drawings, across ${SCHOOLS.length} schools.
   ============================================================ */

export const SCHOOL_ICONS: Record<string, Record<string, string>> = {
${blocks.join("\n")}
};

/** The inside of one school's drawing, or an empty string.

    Empty rather than a fallback shape: a heading with no drawing
    reads as a heading, and a heading with the wrong drawing reads
    as the wrong lesson. */
export function schoolIcon(school: string, name: string | undefined): string {
  if (!name) return "";
  return SCHOOL_ICONS[school]?.[name] ?? "";
}
`;
}

/* Only when run, never when imported. `check-next.mjs` imports
   `generate()` to compare, and a generator that writes its output
   as a side effect of being imported would make that check pass
   by fixing what it was asked to find. */
const RUN = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (RUN) await main();

async function main() {
const CHECK = process.argv.includes("--check");
const wanted = await generate();

if (CHECK) {
  const have = (() => {
    try { return readFileSync(OUT, "utf8"); } catch { return ""; }
  })();
  if (have !== wanted) {
    console.error("next/lib/school-icons.ts is not what the four icons.js "
      + "modules draw.\nRegenerate it:\n  node scripts/build-school-icons.mjs\n");
    process.exit(1);
  }
  console.log("next/lib/school-icons.ts matches aab/*/icons.js.");
} else {
  writeFileSync(OUT, wanted);
  console.log(`wrote ${OUT.slice(ROOT.length + 1)}`);
}
}
