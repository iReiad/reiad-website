#!/usr/bin/env node
/* ============================================================
   check-contrast.ts: the palette is readable, and it is
   measured rather than believed.

       node scripts/check-contrast.ts
       node scripts/check-contrast.ts --table   # print the numbers

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

import {
  ratio, over, resolve, tokens, type Lab, type Mode,
} from "./lib/css-tokens.ts";

/* The palette, resolved in both modes. `lib/css-tokens.ts` is the
   parser and it is shared with `check-surfaces.ts`, so a token
   that stops resolving stops resolving for both rather than for
   one. */
const T = tokens();

/** The ground a translucent surface is composited over.

    The page, because that is what is behind a card. A surface
    that is 86% opaque shows 14% of this, and measuring the
    surface alone would measure a colour nobody sees. */
const GROUND: Record<Mode, Lab | null> = {
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

/** One combination the site actually puts on screen: the ink
    token, the ground token, the ratio that size needs, what to
    call it in the output, and which accent the page is wearing if
    the pair only exists inside a section. */
type Pair = [
  fg: string,
  bg: string,
  threshold: number,
  what: string,
  accent?: string,
];

const PAIRS: Pair[] = [
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
  ...ACCENTS.flatMap((accent): Pair[] => [
    [accent, "--paper", 4.5, `${accent.replace("--", "")} as text on the page`],
    [accent, "--panel", 4.5, `${accent.replace("--", "")} as text on a card`],
    [accent, "--paper-sunk", 4.5, `${accent.replace("--", "")} as text on a sunk ground`],
  ]),

  /* The danger red, which only ever labels something. */
  ["--danger", "--paper", 4.5, "a warning on the page"],
  ["--danger", "--panel", 4.5, "a warning on a card"],

  /* The soft ground, which 80 rules paint and nothing measured.

     It is the biggest area of colour on the site: a selected
     range, a chip that has latched, a lit row, the ground under
     a figure. Three things are set on it and all three are here,
     because the accent on its own 11% tint is the tightest pair
     in this file by construction and the one a person is least
     likely to doubt. */
  ...ACCENTS.flatMap((accent): Pair[] => [
    ["--ink", "--accent-soft", 4.5,
      `body text on a soft ${accent.replace("--", "")} ground`, accent],
    ["--ink-soft", "--accent-soft", 4.5,
      `secondary text on a soft ${accent.replace("--", "")} ground`, accent],
    [accent, "--accent-soft", 4.5,
      `${accent.replace("--", "")} on its own soft ground`, accent],
  ]),
];

/* Text ON an accent fill, which nothing measured until a reader
   photographed the same button twice.

   `<Band>` fills a block with `--accent-strong` and everything
   inside it is `--accent-ink`. That pairing was written out by
   hand in four places before it was a token, and two of the four
   got it wrong in a way no check could see: a ghost button kept
   the near-white panel it had and was given white text, so it
   was invisible on the dark band, and `.band.soft` then turned
   the ground back to paper without undoing the white text, so it
   was invisible on the light one too.

   Both directions are here because the accent is the DARK thing
   in the light theme and the LIGHT thing in the dark one, so the
   ink swaps and a check that measured one mode would have passed
   through the whole bug. */
const ON_ACCENT: Pair[] = [
  ["--accent-ink", "--accent-strong", 4.5, "text on a filled band"],
  ["--accent-ink", "--accent", 4.5, "text on a solid button"],
];

/* ============================================================
   The run
   ============================================================ */

const table = process.argv.includes("--table");
/** One measurement, for the `--table` listing and the count. */
const rows: Array<{
  what: string;
  theme: Mode;
  value: number;
  threshold: number;
  ok: boolean;
}> = [];
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
const TINTED: Pair[] = ACCENTS.flatMap((accent): Pair[] => [
  ["--ink", "--panel", 4.5, `heading on a card in ${accent.replace("--", "")}`, accent],
  ["--ink-soft", "--panel", 4.5, `secondary text on a card in ${accent.replace("--", "")}`, accent],
  ["--danger", "--panel", 4.5, `a warning on a card in ${accent.replace("--", "")}`, accent],
  ...ON_ACCENT.map(([fg, bg, min, what]): Pair =>
    [fg, bg, min, `${what} in ${accent.replace("--", "")}`, accent]),
]);

for (const [fg, bg, threshold, what, accent] of [...PAIRS, ...TINTED]) {
  /* A tinted pair is resolved on the spot, because the token it
     needs depends on which section is being measured. */
  const at = (name: string, theme: Mode): Lab | null => (accent
    ? resolve(`var(${name})`, theme, new Set(), accent)
    : T[name]?.[theme] ?? null);

  if (!at(fg, "light") || !at(bg, "light")) {
    missing++;
    console.error(`  ?    ${what}: ${!at(fg, "light") ? fg : bg} could not be resolved out of styles.css`);
    continue;
  }
  for (const theme of ["light", "dark"] as const) {
    /* Both sides composited over the page: a translucent card is
       what the reader sees through, and text on it is painted on
       the result rather than on the card's own colour. */
    const ground = GROUND[theme];
    const ink = at(fg, theme);
    const on = at(bg, theme);
    /* Both are known to resolve: the block above skipped this
       pair otherwise. Stated rather than asserted, so a token
       that resolves in light and not in dark is caught here
       instead of measured as black. */
    if (!ground || !ink || !on) {
      missing++;
      console.error(`  ?    ${what}: could not be resolved in ${theme}`);
      continue;
    }
    const value = ratio(over(ink, ground), over(on, ground));
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
