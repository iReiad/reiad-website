#!/usr/bin/env node
/* ============================================================
   check-plain.ts: the design is plain, and this keeps it plain.

       node scripts/check-plain.ts

   Every surface on this site is a colour, a hairline and a
   corner. Nothing blurs what is behind it, nothing turns in
   three dimensions, nothing follows the pointer and nothing
   animates because the reader scrolled past it. Each of those
   shipped once, as a glass material, a card scene, a sky behind
   the page and a light under the pointer, and together they were
   four thousand lines of stylesheet, three listeners on every
   page and the most expensive thing on the site to paint.

   A check rather than a paragraph, because every one of them
   arrived as one small rule beside the rules that were already
   there. The list below is short and each entry is the first
   line of the thing it stops:

     backdrop-filter          a blur of what is behind a surface
     perspective, rotateX/Y   a surface turning towards a pointer
     animation-timeline: view()
                              an entrance animation on scroll
     data-glow                a component asking for a light

   `animation-timeline: scroll()` is allowed. The reading
   progress bar and the fade at the end of an overflowing row ARE
   the scroll position rather than a decoration playing over it.
   ============================================================ */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** Every file under a directory, recursively, with the extensions
    given. `node_modules` and `.next` are never walked. */
function walk(dir: string, ext: string[]): string[] {
  const out: string[] = [];
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name === ".next" || name.startsWith(".")) continue;
    const at = join(dir, name);
    if (statSync(at).isDirectory()) out.push(...walk(at, ext));
    else if (ext.some((e) => name.endsWith(e))) out.push(at);
  }
  return out;
}

const strip = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, "");

interface Rule { name: string; test: RegExp; why: string }

const STYLE_RULES: Rule[] = [
  { name: "backdrop-filter", test: /backdrop-filter\s*:/,
    why: "a blur of what is behind a surface, which is a compositing layer per surface" },
  { name: "perspective", test: /(^|[;{\s])perspective\s*:/,
    why: "a surface turning in three dimensions, which promotes a layer whatever its value" },
  { name: "rotateX / rotateY", test: /rotate[XY]\(/,
    why: "the same turn, written into a transform" },
  { name: "animation-timeline: view()", test: /animation-timeline\s*:\s*view\(/,
    why: "an entrance played when a thing scrolls into view; the page should simply be there" },
];

const MARKUP_RULES: Rule[] = [
  { name: "data-glow", test: /data-glow/,
    why: "a component asking the stylesheet for a light under the pointer" },
  { name: "backdrop-blur", test: /backdrop-blur/,
    why: "a Tailwind blur of what is behind a surface" },
];

const failures: string[] = [];

const styles = walk(join(ROOT, "next", "styles"), [".css"]);
for (const file of styles) {
  const css = strip(readFileSync(file, "utf8"));
  for (const rule of STYLE_RULES) {
    const lines = css.split("\n");
    lines.forEach((line, i) => {
      if (rule.test.test(line)) {
        failures.push(`${relative(ROOT, file)}:${i + 1}  ${rule.name}: ${rule.why}`);
      }
    });
  }
}

const markup = [
  ...walk(join(ROOT, "next", "app"), [".tsx", ".ts"]),
  ...walk(join(ROOT, "next", "components"), [".tsx", ".ts"]),
];
for (const file of markup) {
  const src = readFileSync(file, "utf8");
  for (const rule of MARKUP_RULES) {
    const lines = src.split("\n");
    lines.forEach((line, i) => {
      if (rule.test.test(line)) {
        failures.push(`${relative(ROOT, file)}:${i + 1}  ${rule.name}: ${rule.why}`);
      }
    });
  }
}

if (failures.length) {
  console.error(`plain: ${failures.length} thing(s) the plain design does not do:\n`);
  for (const f of failures) console.error(`   ${f}`);
  console.error("\nA surface is a colour, a hairline and a corner. Take the effect out");
  console.error("rather than adding it to a list here: there is no list, on purpose.");
  process.exit(1);
}

console.log(`plain: ${styles.length} stylesheet(s) and ${markup.length} component file(s), `
  + "and none of them blurs, turns, follows the pointer or animates on scroll.");
