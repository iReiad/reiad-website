#!/usr/bin/env node
/* ============================================================
   check-contrast.mjs: the palette is readable, and it is
   measured rather than believed.

       node scripts/check-contrast.mjs
       node scripts/check-contrast.mjs --table   # print the numbers

   WHY THIS EXISTS

   The token block in `styles.css` has always carried a comment
   listing measured contrast ratios, with a note that they were
   "measured in a browser rather than eyeballed". That was true on
   the day it was written and it is a comment: nothing re-measured
   it when `--gold` moved, and nothing would have noticed if the
   warm paper had pushed a pair below 4.5.

   In fact the comment records exactly that happening once. The
   gold labels measured 4.50 against the old paper, the paper
   turned warm, and they fell to 4.45, which is a fail. It was
   caught by hand. This is that catch, automated, so the next one
   is a red check rather than a reader squinting.

   The seven accents landing in August 2026 make it necessary
   rather than nice: two hues can be checked by eye, and seven at
   matched lightness across two themes cannot.

   WHAT IT CHECKS

   Every accent against every ground it is actually painted on, in
   both themes, against the WCAG 2.2 threshold for the size it is
   used at:

     4.5:1   normal text. Every accent used for a link, a label
             or a number.
     3.0:1   large text (>=24px, or >=18.66px bold) and the
             meaningful edge of a control: a border that is the
             only thing saying where a button is.

   HOW, WITHOUT A BROWSER

   The tokens are `oklch()`, so this converts OKLCH to OKLab to
   linear sRGB to a WCAG relative luminance. The conversion is the
   standard one and is written out below rather than pulled from a
   package, because a check that needs `npm install` to answer a
   question about a stylesheet is a check that stops being run.

   Out-of-gamut colours are clamped, which is what a browser does
   too, so a value that cannot be shown is measured as the value
   that will be.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = readFileSync(join(ROOT, "aab", "styles.css"), "utf8");

/* ============================================================
   OKLCH to a luminance
   ============================================================ */

const cube = (x) => x * x * x;

/** OKLCH (L 0..1, C, H degrees) to linear sRGB, clamped to gamut. */
function oklchToLinear(L, C, H) {
  const h = (H * Math.PI) / 180;
  const a = C * Math.cos(h);
  const b = C * Math.sin(h);

  const l = cube(L + 0.3963377774 * a + 0.2158037573 * b);
  const m = cube(L - 0.1055613458 * a - 0.0638541728 * b);
  const s = cube(L - 0.0894841775 * a - 1.2914855480 * b);

  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s,
  ].map((v) => Math.min(1, Math.max(0, v)));
}

/** WCAG relative luminance. The coefficients are the sRGB ones
    and the input is already linear, which is the whole reason
    the conversion above stops where it does. */
const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/** Two colours, as a WCAG contrast ratio. */
function ratio(fg, bg) {
  const a = luminance(oklchToLinear(...fg));
  const b = luminance(oklchToLinear(...bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/* ============================================================
   Reading the tokens out of the stylesheet

   The values are the stylesheet's, parsed, rather than a second
   copy written here. A check with its own copy of the palette is
   a check that passes while the site fails.
   ============================================================ */

/** `--h-green: 162;` and friends. */
function hues() {
  const out = {};
  for (const [, name, value] of CSS.matchAll(/--h-([a-z-]+):\s*([\d.]+);/g)) {
    out[`--h-${name}`] = Number(value);
  }
  return out;
}

const HUES = hues();

/** `oklch(41% 0.08 var(--h-green))` or `oklch(41% 0.08 162)`. */
function parseOklch(text) {
  const m = text.trim().match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+(?:var\(\s*(--h-[a-z-]+)\s*\)|([\d.]+))\s*(?:\/\s*[\d.]+\s*)?\)$/);
  if (!m) return null;
  const hue = m[3] ? HUES[m[3]] : Number(m[4]);
  if (hue === undefined) return null;
  return [Number(m[1]) / 100, Number(m[2]), hue];
}

/** Every `--name: light-dark(oklch(...), oklch(...));` token.

    The inner pattern allows one level of nesting, because every
    value here ends in `var(--h-green)` and a `[^)]*` stops at
    that `var(`'s own closing bracket rather than at the colour's.
    That is the whole of why this reads as it does. */
const OKLCH = String.raw`oklch\((?:[^()]|\([^()]*\))*\)`;

function tokens() {
  const out = {};
  const pattern = new RegExp(
    String.raw`(--[a-z-]+):\s*light-dark\(\s*(${OKLCH})\s*,\s*(${OKLCH})\s*\)`, "g");
  for (const [, name, light, dark] of CSS.matchAll(pattern)) {
    const l = parseOklch(light);
    const d = parseOklch(dark);
    if (l && d) out[name] = { light: l, dark: d };
  }
  return out;
}

const T = tokens();

/* ============================================================
   What is painted on what

   Each pair is a real combination the site puts on screen, named
   for where it happens, with the threshold that applies to the
   size it is used at. A pair that stops being real should be
   deleted from here; a pair that is added to the design should be
   added here in the same commit.
   ============================================================ */

const ACCENTS = ["--green", "--teal", "--blue", "--violet",
                 "--plum", "--rose", "--gold"];

const PAIRS = [
  /* The text the whole site is made of. */
  ["--ink", "--paper", 4.5, "body text on the page"],
  ["--ink", "--panel", 4.5, "heading on a card"],
  ["--ink-soft", "--paper", 4.5, "secondary text on the page"],
  ["--ink-soft", "--panel", 4.5, "secondary text on a card"],
  ["--ink-soft", "--paper-sunk", 4.5, "secondary text on a sunk ground"],

  /* Every accent, as a link and as a label, on both grounds it
     is ever set on. This is the block the seven colours made
     necessary: one of them being a shade too light is invisible
     to a person and obvious to this. */
  ...ACCENTS.flatMap((accent) => [
    [accent, "--paper", 4.5, `${accent.replace("--", "")} as text on the page`],
    [accent, "--panel", 4.5, `${accent.replace("--", "")} as text on a card`],
    [accent, "--paper-sunk", 4.5, `${accent.replace("--", "")} as text on a sunk ground`],
  ]),

  /* The danger red, which only ever labels something. */
  ["--danger", "--paper", 4.5, "a warning on the page"],
  ["--danger", "--panel", 4.5, "a warning on a card"],
];

/* ============================================================
   The run
   ============================================================ */

const table = process.argv.includes("--table");
const rows = [];
let failures = 0;
let missing = 0;

for (const [fg, bg, threshold, what] of PAIRS) {
  if (!T[fg] || !T[bg]) {
    missing++;
    console.error(`  ?    ${what}: ${!T[fg] ? fg : bg} is not a light-dark() token in styles.css`);
    continue;
  }
  for (const theme of ["light", "dark"]) {
    const value = ratio(T[fg][theme], T[bg][theme]);
    const ok = value >= threshold;
    if (!ok) failures++;
    rows.push({ what, theme, value, threshold, ok });
  }
}

if (table) {
  const width = Math.max(...rows.map((r) => r.what.length));
  for (const r of rows) {
    console.log(`  ${r.ok ? "ok  " : "FAIL"} ${r.what.padEnd(width)} `
      + `${r.theme.padEnd(5)} ${r.value.toFixed(2)}:1 (needs ${r.threshold})`);
  }
} else {
  for (const r of rows.filter((x) => !x.ok)) {
    console.error(`  FAIL ${r.what}, ${r.theme}: ${r.value.toFixed(2)}:1, needs ${r.threshold}`);
  }
}

if (missing) {
  console.error(`\n${missing} pair(s) name a token this file could not find. `
    + "Either the token was renamed or PAIRS is out of date.");
}

if (failures || missing) {
  console.error(`\n${failures} contrast failure(s). A colour that cannot be read is not a colour.`);
  process.exit(1);
}

const worst = rows.reduce((a, b) => (a.value < b.value ? a : b));
console.log(`contrast: ${rows.length} pairs measured in both themes, all pass. `
  + `Tightest is ${worst.what} in ${worst.theme} at ${worst.value.toFixed(2)}:1.`);
