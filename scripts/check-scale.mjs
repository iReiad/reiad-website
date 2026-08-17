#!/usr/bin/env node
/* ============================================================
   check-scale.mjs: the type scale is the type scale.

       node scripts/check-scale.mjs
       node scripts/check-scale.mjs --list   # every size in use

   WHY THIS EXISTS

   An audit of `styles.css` in August 2026 found fifty distinct
   font sizes in 476 declarations, in a near-continuum of 0.02rem
   steps from 0.58rem to 1.06rem. Eight different sizes lived
   inside the 1.3px band between 0.90 and 0.98, and 1.24rem and
   1.25rem both shipped, a sixth of a pixel apart.

   Nobody chose fifty sizes. Each one was chosen once, on its own,
   against whatever was next to it that afternoon, because there
   was nothing to reach for. `--t-0` to `--t-8` are the things to
   reach for now, and this is what stops the fifty-first from
   arriving the same way: not a rule anybody has to remember, a
   red check.

   WHAT IT ALLOWS

   Three things, and each is a real category rather than a hole:

     a `var(--t-N)`      the scale, which is the answer
     a `clamp()`         a page title, which answers to the
                         viewport rather than to a scale
     a size above the    section heads and page titles, nineteen
     top of the scale    of them, deliberately not on it

   A bare `font-size` in rem BELOW the top of the scale is the
   thing this fails on, because that is the one that had fifty
   answers.

   It reads the scale out of `styles.css` rather than keeping a
   copy: a check with its own copy of the design is a check that
   passes while the site drifts.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join("aab", "styles.css");
const css = readFileSync(join(ROOT, FILE), "utf8");

/* The scale, as the stylesheet states it. */
const scale = new Map();
for (const [, name, value] of css.matchAll(/(--t-\d+):\s*([0-9.]+)rem;/g)) {
  scale.set(name, Number(value));
}

if (scale.size === 0) {
  console.error("check-scale: no --t-N tokens in styles.css. Was the scale renamed?");
  process.exit(1);
}

const top = Math.max(...scale.values());

/* The block that DEFINES the scale is allowed to hold literals,
   obviously. Everything after it is the site. */
const defined = css.lastIndexOf(`--t-${scale.size - 1}:`);
const body = css.slice(css.indexOf("\n", defined) + 1);
const offset = css.slice(0, css.indexOf("\n", defined) + 1).split("\n").length;

const list = process.argv.includes("--list");
const found = new Map();
const bad = [];

const lines = body.split("\n");
lines.forEach((line, i) => {
  if (/^\s*(\/\*|\*)/.test(line)) return;            // a comment
  for (const [, value] of line.matchAll(/font-size:\s*([0-9.]+)rem/g)) {
    const size = Number(value);
    found.set(size, (found.get(size) ?? 0) + 1);
    /* Above the scale is a heading, and headings are not on it. */
    if (size > top) continue;
    const nearest = [...scale].reduce((a, b) =>
      Math.abs(a[1] - size) < Math.abs(b[1] - size) ? a : b);
    bad.push({ line: i + offset, size, nearest: nearest[0], to: nearest[1] });
  }
});

if (list) {
  for (const [size, n] of [...found].sort((a, b) => a[0] - b[0])) {
    const onScale = [...scale.values()].includes(size);
    console.log(`  ${size}rem  x${String(n).padEnd(3)} ${onScale ? "" : size > top ? "(heading)" : "OFF SCALE"}`);
  }
}

if (bad.length) {
  console.error(`${bad.length} font-size(s) below ${top}rem are not on the scale:\n`);
  for (const b of bad.slice(0, 20)) {
    console.error(`  ${FILE}:${b.line}  ${b.size}rem`
      + `  ->  var(${b.nearest}), which is ${b.to}rem`);
  }
  if (bad.length > 20) console.error(`  ... and ${bad.length - 20} more`);
  console.error(
    "\nUse the scale, or argue for the exception by putting the size above\n"
    + `${top}rem where the headings live. Fifty sizes is how the last one went.`);
  process.exit(1);
}

const uses = [...css.matchAll(/var\(--t-\d+\)/g)].length;
console.log(`type scale: ${scale.size} steps, ${uses} uses, and every font-size `
  + `below ${top}rem is one of them.`);
