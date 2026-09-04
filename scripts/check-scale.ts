#!/usr/bin/env node
/* check-scale.ts: the type scale is the type scale.

       node scripts/check-scale.ts
       node scripts/check-scale.ts --list   # every size in use

   An audit found fifty distinct font sizes in 476 declarations, a
   near-continuum of 0.02rem steps: eight of them inside the 1.3px
   band between 0.90 and 0.98. Nobody chose fifty. Each was chosen
   once, against whatever was next to it that afternoon.

   `--t-0` to `--t-8` are the scale, read out of the stylesheet
   rather than copied here. Three things are allowed: a
   `var(--t-N)`, a `clamp()`, which answers to the viewport, and a
   size above the top of the scale. A bare `font-size` in rem BELOW
   the top of the scale is what this fails on.

   The corners are the same rule: `--radius-xs` to `--radius-lg`
   and `--radius-pill` are the rungs and a literal px radius fails.
   A percentage does not, because a circle is a shape rather than a
   rung. */

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
/** A size in rem, to how many times the stylesheet writes it. */
const found = new Map<number, number>();

/** A font size that is not on the scale: where it is, what it is,
    and the token nearest to it. */
const bad: Array<{
  line: number;
  size: number;
  /** The token's name, `--t-4`. */
  nearest: string;
  /** What that token is worth, in rem. */
  to: number;
}> = [];

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

/* Prose is not code, and this file's prose talks about corners. A
   test for a line STARTING with a comment marker walks past a
   declaration quoted mid-paragraph, which is the hole
   check-contrast.ts had. Track the block instead. */
/** A corner radius written as a literal rather than as a rung:
    where it is, and how many pixels it asks for. */
const corners: Array<{ line: number; px: number }> = [];
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
