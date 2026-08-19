#!/usr/bin/env node
/* ============================================================
   check-prefixes.ts: the build writes the vendor prefixes, and a
   hand-written one can delete the property it was meant to help.

       node scripts/check-prefixes.ts
       node scripts/check-prefixes.ts --list   # every prefixed declaration

   THE BUG THIS EXISTS FOR

   `backdrop-filter: var(--glass-blur)` with
   `-webkit-backdrop-filter: var(--glass-blur)` under it, in the
   same block. Next builds this stylesheet through Lightning CSS,
   which reads the two as one property and keeps the last, so the
   built file carried the `-webkit-` line alone. Chrome has never
   supported `-webkit-backdrop-filter`, so every glass surface on
   the site (`.topbar`, `.rail`, `.slimbar`, `.tabs-nav`,
   `.acc-menu`, the drawer) was a flat translucent panel in every
   browser but Safari.

   THE RULE

   Lightning CSS adds the prefixes itself, from the build targets,
   so the standard property ALONE is the correct source. Which
   half of a hand-written pair survives is the compiler's business
   and differs per property: `backdrop-filter` loses the standard
   one, `mask-image` keeps both, `-webkit-text-size-adjust` is
   dropped and replaced with `-moz-`. Writing one is a guess in
   every direction, so this fails on any block that declares both
   `-webkit-FOO` (or `-moz-`, `-ms-`, `-o-`) and `FOO`.

   A prefixed property with no standard counterpart beside it is
   fine and is what those properties are for: `-webkit-line-clamp`,
   `-webkit-box-orient`, `-webkit-tap-highlight-color`. So is a
   prefixed pseudo-element in a SELECTOR, `::-webkit-scrollbar`,
   and so is a prefixed name inside an `@supports` CONDITION,
   which is a feature test rather than a declaration. None of the
   three reaches the check: it reads declarations, and a prelude
   is not one.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join("next", "styles");

const VENDOR = /^-(?:webkit|moz|ms|o)-/;

/** One declaration: the property it sets, and the line the
    property name is on. */
interface Decl {
  prop: string;
  line: number;
}

/** Every declaration in the file, grouped by the block holding
    it. A prelude is discarded at its `{`, which is what keeps a
    selector and an `@supports` condition out of the answer, and a
    nested rule is its own block, which is what "the same block"
    has to mean for the cascade. */
function blocks(css: string): Decl[][] {
  const out: Decl[][] = [];
  const stack: Decl[][] = [];
  let buf = "";
  let start = 1;
  let line = 1;
  /* Parens and brackets, so a `;` inside `url(...)` or a `{`
     inside an attribute selector is not read as a break. */
  let nesting = 0;
  let quote: string | null = null;

  /** File `buf` as a declaration of the block on top of the
      stack, if it is one, and start the next. */
  const flush = (): void => {
    const at = buf.indexOf(":");
    const prop = at === -1 ? "" : buf.slice(0, at).trim().toLowerCase();
    const here = stack[stack.length - 1];
    if (here && /^-{0,2}[a-z][a-z0-9-]*$/.test(prop)) here.push({ prop, line: start });
    buf = "";
    start = line;
  };

  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "\n") line += 1;

    if (quote) {
      if (c === "\\") { i += 1; continue; }
      if (c === quote) quote = null;
      buf += c;
      continue;
    }
    if (c === '"' || c === "'") { quote = c; buf += c; continue; }

    /* A comment is not code, and this stylesheet's comments quote
       CSS at length. Skipped whole, with its newlines counted. */
    if (c === "/" && css[i + 1] === "*") {
      const end = css.indexOf("*/", i + 2);
      const stop = end === -1 ? css.length : end + 2;
      for (let k = i; k < stop; k += 1) if (css[k] === "\n") line += 1;
      i = stop - 1;
      continue;
    }

    if (c === "(" || c === "[") nesting += 1;
    else if (c === ")" || c === "]") nesting = Math.max(0, nesting - 1);
    else if (nesting === 0) {
      if (c === "{") { buf = ""; start = line; stack.push([]); continue; }
      if (c === "}") {
        flush();
        const done = stack.pop();
        if (done) out.push(done);
        continue;
      }
      if (c === ";") { flush(); continue; }
    }

    if (buf.trim() === "" && c.trim() !== "") start = line;
    buf += c;
  }

  for (const left of stack) out.push(left);
  return out;
}

/** A hand-written prefix and the standard property beside it. */
interface Pair {
  file: string;
  prop: string;
  line: number;
  standard: string;
  at: number;
}

const files = readdirSync(join(ROOT, DIR))
  .filter((f) => f.endsWith(".css"))
  .sort();

if (files.length === 0) {
  console.error(`check-prefixes: no .css in ${DIR}. Did the stylesheet move?`);
  process.exit(1);
}

const list = process.argv.includes("--list");
const pairs: Pair[] = [];
/** Every prefixed declaration, for `--list` and for the count. */
const prefixed: Array<{ file: string; prop: string; line: number; paired: boolean }> = [];

for (const name of files) {
  const file = join(DIR, name);
  for (const block of blocks(readFileSync(join(ROOT, file), "utf8"))) {
    /* First line wins: a property set twice in one block is one
       property, and the first is where a reader will look. */
    const seen = new Map<string, number>();
    for (const d of block) if (!seen.has(d.prop)) seen.set(d.prop, d.line);

    for (const [prop, line] of seen) {
      if (!VENDOR.test(prop)) continue;
      const standard = prop.replace(VENDOR, "");
      const at = seen.get(standard);
      prefixed.push({ file, prop, line, paired: at !== undefined });
      if (at !== undefined) pairs.push({ file, prop, line, standard, at });
    }
  }
}

/** File first, then line, so the report reads down a stylesheet. */
const byPlace = (a: { file: string; line: number }, b: { file: string; line: number }): number =>
  (a.file === b.file ? a.line - b.line : a.file.localeCompare(b.file));

if (list) {
  for (const p of prefixed.sort(byPlace)) {
    console.log(`  ${p.file}:${p.line}  ${p.prop}${p.paired ? "   PAIRED" : ""}`);
  }
}

if (pairs.length) {
  console.error(`${pairs.length} hand-written vendor prefix(es) beside the `
    + "property they prefix:\n");
  for (const p of pairs.sort(byPlace)) {
    console.error(`  ${p.file}:${p.line}  ${p.prop}`
      + `  beside  ${p.standard} on line ${p.at}`);
  }
  console.error("\nDelete the prefixed line. Lightning CSS adds the prefixes from the\n"
    + "build targets, and which half of a hand-written pair survives is its\n"
    + "business: backdrop-filter kept the -webkit- line alone, so every glass\n"
    + "surface on the site was flat in every browser but Safari.");
  process.exit(1);
}

console.log(`prefixes: ${prefixed.length} prefixed declaration(s) in `
  + `${files.length} stylesheet(s), none beside the property it prefixes.`);
