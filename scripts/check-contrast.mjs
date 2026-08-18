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

/** OKLCH (L 0..1, C, H degrees) to OKLab, which is the space
    everything below works in.

    Colours are held as OKLab rather than OKLCH because that is
    what `color-mix(in oklab, ...)` interpolates in, and the
    stylesheet mixes now: a panel is its base colour with a trace
    of the page's accent in it. Mixing in polar coordinates would
    take the long way round the hue circle and give a different
    answer from the browser's. */
const oklchToLab = (L, C, H) => {
  const h = (H * Math.PI) / 180;
  return { L, a: C * Math.cos(h), b: C * Math.sin(h), alpha: 1 };
};

/** OKLab to linear sRGB, clamped to gamut. */
function oklabToLinear({ L, a, b }) {
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

/** Two colours in OKLab, as a WCAG contrast ratio. */
function ratio(fg, bg) {
  const a = luminance(oklabToLinear(fg));
  const b = luminance(oklabToLinear(bg));
  const [hi, lo] = a > b ? [a, b] : [b, a];
  return (hi + 0.05) / (lo + 0.05);
}

/** `a` over `b`, which is what a translucent surface actually
    shows a reader.

    A panel is 86% opaque over the page, so measuring the panel's
    own colour would measure something nobody sees. What is on
    screen is the panel composited over the ground beneath it. */
const over = (a, b) => (a.alpha >= 1 ? a : {
  L: a.L * a.alpha + b.L * (1 - a.alpha),
  a: a.a * a.alpha + b.a * (1 - a.alpha),
  b: a.b * a.alpha + b.b * (1 - a.alpha),
  alpha: 1,
});

/** `color-mix(in oklab, A p%, B)`: p of A, the rest of B.

    PREMULTIPLIED, because that is what CSS does and the
    difference is not subtle. Mixing a colour with `transparent`
    is how a translucent surface is written, and interpolating the
    channels straight would drag the result toward black: 86% of a
    near-white panel would come out at 86% lightness rather than
    at the panel's own colour with 0.86 alpha. That is a 5.67:1
    pair reading 3.87:1, which is what it did until this was
    fixed. */
function mix(a, b, p) {
  const q = 1 - p;
  const alpha = a.alpha * p + b.alpha * q;
  if (alpha === 0) return { L: 0, a: 0, b: 0, alpha: 0 };

  /* Interpolate premultiplied, then divide the alpha back out. */
  return {
    L: (a.L * a.alpha * p + b.L * b.alpha * q) / alpha,
    a: (a.a * a.alpha * p + b.a * b.alpha * q) / alpha,
    b: (a.b * a.alpha * p + b.b * b.alpha * q) / alpha,
    alpha,
  };
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

/** `oklch(41% 0.08 var(--h-green))`, with an optional `/ alpha`. */
function parseOklch(text) {
  const m = text.trim().match(
    /^oklch\(\s*([\d.]+)%\s+([\d.]+)\s+(?:var\(\s*(--h-[a-z-]+)\s*\)|([\d.]+))\s*(?:\/\s*([\d.]+)\s*)?\)$/);
  if (!m) return null;
  const hue = m[3] ? HUES[m[3]] : Number(m[4]);
  if (hue === undefined) return null;
  const colour = oklchToLab(Number(m[1]) / 100, Number(m[2]), hue);
  if (m[5] !== undefined) colour.alpha = Number(m[5]);
  return colour;
}

/* ---------- the declarations, as written ---------- */

/** Every `--name: <value>;` in the stylesheet's token block, as
    text. Resolving happens below, per mode, because a value can
    name another token and can differ between light and dark. */
function declarations() {
  const out = {};
  /* Balanced to three levels of brackets, which is what
     `color-mix(in oklab, var(--accent) 4%, color-mix(in srgb,
     var(--panel-base) 86%, transparent))` needs. */
  const VALUE = String.raw`(?:[^;()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))+`;
  for (const [, name, value] of
       CSS.matchAll(new RegExp(String.raw`(--[a-z0-9-]+):\s*(${VALUE});`, "g"))) {
    if (!(name in out)) out[name] = value.trim();   // the first wins, as in the cascade
  }
  return out;
}

const DECLS = declarations();

/** Split `a, b` at the top level, ignoring commas inside brackets. */
function parts(text) {
  const out = [];
  let depth = 0;
  let at = 0;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (c === "(") depth += 1;
    else if (c === ")") depth -= 1;
    else if (c === "," && depth === 0) { out.push(text.slice(at, i)); at = i + 1; }
  }
  out.push(text.slice(at));
  return out.map((x) => x.trim());
}

/**
 * One value, in one mode, as OKLab.
 *
 * Handles what the stylesheet actually writes: an `oklch()`, a
 * `light-dark()` pair, a `var()` naming another token, a
 * `color-mix()` in either space, and `transparent`.
 *
 * Returns null for anything else, and the caller reports that
 * rather than skipping it. A check that quietly stops measuring
 * is worse than one that fails: ten pairs went unmeasured the
 * moment `--panel` became a mix, and the only thing that noticed
 * was the count in this file's own output.
 */
function resolve(value, mode, seen = new Set(), accent = null) {
  const text = String(value ?? "").trim();
  if (!text) return null;

  if (text === "transparent") return { L: 0, a: 0, b: 0, alpha: 0 };

  if (text.startsWith("oklch(")) return parseOklch(text);

  const varName = /^var\(\s*(--[a-z0-9-]+)\s*\)$/.exec(text)?.[1];
  if (varName) {
    /* `--accent` is whatever the page is wearing, so a surface
       that mixes it is a different colour in each section. The
       caller names one and every token downstream follows, which
       is how the seven sections get measured rather than only the
       default green. */
    if (varName === "--accent" && accent) {
      return resolve(`var(${accent})`, mode, seen, accent);
    }
    if (seen.has(varName)) return null;             // a token naming itself
    return resolve(DECLS[varName], mode, new Set([...seen, varName]), accent);
  }

  const ld = /^light-dark\(([\s\S]*)\)$/.exec(text);
  if (ld) {
    const [light, dark] = parts(ld[1]);
    return resolve(mode === "dark" ? dark : light, mode, seen, accent);
  }

  const cm = /^color-mix\(([\s\S]*)\)$/.exec(text);
  if (cm) {
    const [space, first, second] = parts(cm[1]);
    if (!/^in\s+(oklab|srgb|oklch)$/i.test(space)) return null;

    const pct = /([\d.]+)%\s*$/.exec(first);
    if (!pct) return null;
    const p = Number(pct[1]) / 100;

    const a = resolve(first.replace(/\s*[\d.]+%\s*$/, ""), mode, seen, accent);
    const b = resolve(second, mode, seen, accent);
    if (!a || !b) return null;
    return mix(a, b, p);
  }

  return null;
}

/** Every `--name: light-dark(oklch(...), oklch(...));` token.

    Every declaration is resolved in both modes through
    `resolve()` above, so a token is measured whatever it is
    written as: a literal, a `light-dark()` pair, a `var()` naming
    another, or a `color-mix()`. It used to read `light-dark(oklch,
    oklch)` and nothing else, which is why ten pairs stopped being
    measured the day `--panel` became a mix. */
function tokens() {
  const out = {};
  for (const name of Object.keys(DECLS)) {
    const light = resolve(`var(${name})`, "light");
    const dark = resolve(`var(${name})`, "dark");
    if (light && dark) out[name] = { light, dark };
  }
  return out;
}

const T = tokens();

/** The ground a translucent surface is composited over.

    The page, because that is what is behind a card. A surface
    that is 86% opaque shows 14% of this, and measuring the
    surface alone would measure a colour nobody sees. */
const GROUND = {
  light: resolve("var(--paper)", "light"),
  dark: resolve("var(--paper)", "dark"),
};

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

/* ---------- the same surfaces, in every section ----------

   A panel carries a trace of the page's accent, so there are
   seven of it rather than one, and the seven differ in lightness:
   gold is the lightest of the accents and violet the darkest.
   Measuring only the default green would measure one section and
   pass the other six on trust.

   Text on a card is the pair that moves, so that is the pair
   repeated. `--danger` is in because it is the tightest one on
   the whole site and the first that would go. */
const TINTED = ACCENTS.flatMap((accent) => [
  ["--ink", "--panel", 4.5, `heading on a card in ${accent.replace("--", "")}`, accent],
  ["--ink-soft", "--panel", 4.5, `secondary text on a card in ${accent.replace("--", "")}`, accent],
  ["--danger", "--panel", 4.5, `a warning on a card in ${accent.replace("--", "")}`, accent],
]);

for (const [fg, bg, threshold, what, accent] of [...PAIRS, ...TINTED]) {
  /* A tinted pair is resolved on the spot, because the token it
     needs depends on which section is being measured. */
  const at = (name, theme) => (accent
    ? resolve(`var(${name})`, theme, new Set(), accent)
    : T[name]?.[theme]);

  if (!at(fg, "light") || !at(bg, "light")) {
    missing++;
    console.error(`  ?    ${what}: ${!at(fg, "light") ? fg : bg} could not be resolved out of styles.css`);
    continue;
  }
  for (const theme of ["light", "dark"]) {
    /* Both sides composited over the page: a translucent card is
       what the reader sees through, and text on it is painted on
       the result rather than on the card's own colour. */
    const ground = GROUND[theme];
    const value = ratio(over(at(fg, theme), ground), over(at(bg, theme), ground));
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
