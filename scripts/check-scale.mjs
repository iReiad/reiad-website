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

   ---- and the corners, for the same reason ----

   The radii went the same way and further: thirty-three literal
   `border-radius` declarations across fourteen values, from 2px
   to 20px, with a `--radius-icon` token that nothing reached for
   at all. Nobody chose fourteen corner sizes either. The result
   was a site that read as boxes, because a 10px corner on a
   200px card is a square with the edges taken off.

   `--radius-xs` to `--radius-lg` and `--radius-pill` are the
   rungs. A literal px radius fails here. A percentage or a `50%`
   does not, because a circle is a shape rather than a rung.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const FILE = join("next", "styles", "site.css");
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

/* ---------- the corners ---------- */

const RUNGS = [...css.matchAll(/(--radius(?:-[a-z]+)?):\s*([^;]+);/g)]
  .map(([, name]) => name);

/* Prose is not code, and this file's prose talks about corners.

   The line "used to end with `border-radius: 3px`" is inside a
   block comment whose first line is prose, so a test for a line
   STARTING with a comment marker walks straight past it. That is
   the same hole check-contrast.mjs had, where a comment saying
   `--accent: blue` became the first declaration of --accent.
   Track the block instead of guessing from one line. */
const corners = [];
let inComment = false;
lines.forEach((line, i) => {
  const opens = line.lastIndexOf("/*");
  const closes = line.lastIndexOf("*/");
  const wasIn = inComment;
  if (inComment && closes > -1) inComment = false;
  else if (!inComment && opens > -1 && closes < opens) inComment = true;
  if (wasIn) return;
  if (/^\s*(\/\/|\*)/.test(line)) return;

  const code = line.replace(/\/\*[\s\S]*?\*\//g, "");
  const decl = /border-radius:\s*([^;{}]+)/.exec(code);
  if (!decl) return;
  for (const [, px] of decl[1].matchAll(/\b([0-9.]+)px\b/g)) {
    corners.push({ line: i + offset, px: Number(px) });
  }
});

if (list) {
  console.log(`\n  corners: ${RUNGS.join(" ")}`);
}

if (corners.length) {
  console.error(`${corners.length} literal border-radius value(s):\n`);
  for (const c of corners.slice(0, 20)) {
    console.error(`  ${FILE}:${c.line}  ${c.px}px`);
  }
  if (corners.length > 20) console.error(`  ... and ${corners.length - 20} more`);
  console.error(`\nUse a rung: ${RUNGS.join(", ")}. Fourteen corner sizes is how`
    + "\nthe last set went, and the site read as boxes because of it.");
  process.exit(1);
}

const uses = [...css.matchAll(/var\(--t-\d+\)/g)].length;
const radii = [...css.matchAll(/var\(--radius(?:-[a-z]+)?\)/g)].length;
console.log(`type scale: ${scale.size} steps, ${uses} uses, and every font-size `
  + `below ${top}rem is one of them.`);
console.log(`corners: ${RUNGS.length} rungs, ${radii} uses, and no literal px radius.`);
