#!/usr/bin/env node
/* ============================================================
   check-surfaces.mjs: a card is still a card.

       node scripts/check-surfaces.mjs
       node scripts/check-surfaces.mjs --table   # print the numbers

   ---- what went wrong ----

   The surfaces became tinted: a panel is its base colour with a
   trace of the page's accent mixed in, so a German card is a
   little blue and a Quranic one a little teal. That is the whole
   design and it works.

   What it did NOT survive is the arithmetic. An accent on this
   site sits near 44% lightness in the light theme, so mixing it
   into a near-white surface DARKENS that surface, and there is no
   amount that tints without darkening: it is the colour space,
   not a setting. Eight percent into a panel put the panel BELOW
   the page it sits on. Every card on the site inverted from
   raised to sunk, which reads as a hole rather than as a card,
   and there is no way to see that in a diff.

   Every check passed. `check-contrast.mjs` measured text against
   those surfaces and was satisfied, because a hole has perfectly
   good contrast. `check-css.mjs` saw well-formed rules. Nothing
   measured the one thing that had broken, which is that a raised
   surface has to be lighter than its ground in a light theme and
   lighter again in a dark one.

   ---- what this measures ----

   The stack, in order, in both themes, in all seven sections:

       paper-sunk  <  paper  <  panel  <  panel-hover

   Lightness in OKLab, which is perceptual, so the comparison is
   the one an eye makes rather than one a hex triplet suggests.
   Dark mode is the same order for the same reason: a card is
   lighter than the page it lies on in both themes, because a
   thing in front of you catches more light. Only the distances
   differ.

   A minimum separation as well as an order, because two surfaces
   that differ in the fourth decimal place are one surface with a
   rounding error, and a border is then the only thing saying
   where a card is.
   ============================================================ */

import { resolve } from "./lib/css-tokens.ts";

const TABLE = process.argv.includes("--table");

const ACCENTS = ["--green", "--teal", "--blue", "--violet",
                 "--plum", "--rose", "--gold"];

/* The stack, ground first. Each is expected to be lighter than
   the one before it by at least `gap`.

   The gaps are small on purpose. This is not a design opinion
   about how much lighter a card should be: it is the floor below
   which the difference stops being a difference, and a design
   that wants more room is free to take it. What it may not do is
   cross zero. */
const STACK = [
  { token: "--paper-sunk", name: "a sunk ground" },
  { token: "--paper", name: "the page", gap: 0.004 },
  { token: "--panel", name: "a card", gap: 0.004 },
];

/* Hover is not a fourth step, and finding that out is what this
   check was for.

   A card in the light theme is already pure white, so there is no
   lighter it can go: deepening the tint is the only move
   available, and that is also how it reads, as the card taking
   the pointer rather than floating away from it. The LIFT is the
   shadow and the border, which is where it always was.

   So what has to hold is weaker and is still worth holding: a
   hovered card must be TELLABLE from an unhovered one, and it
   must not fall below the page, because a card that sinks under
   the pointer is the inversion this file exists to catch,
   arriving one interaction later. */
const HOVER = { token: "--panel-hover", gap: 0.004 };

/* A translucent surface is composited over what is behind it
   before being measured, for the same reason `check-contrast.mjs`
   does it: what a reader sees is the result, not the token. The
   page is behind everything above it. */
function lightness(token, mode, accent, ground) {
  const colour = resolve(`var(${token})`, mode, undefined, accent);
  if (!colour) return null;
  return (ground ? over(colour, ground) : colour).L;
}

const over = (a, b) => (a.alpha >= 1 || !b ? a : {
  L: a.L * a.alpha + b.L * (1 - a.alpha),
  a: a.a * a.alpha + b.a * (1 - a.alpha),
  b: a.b * a.alpha + b.b * (1 - a.alpha),
  alpha: 1,
});

const problems = [];
const rows = [];
let measured = 0;

for (const mode of ["light", "dark"]) {
  for (const accent of ACCENTS) {
    const section = accent.replace("--", "");

    /* The page is the ground for everything, and it is opaque, so
       it is resolved first and handed on. */
    const paper = resolve("var(--paper)", mode, undefined, accent);
    if (!paper) {
      problems.push(`--paper does not resolve in ${section}, ${mode}.`);
      continue;
    }

    let below = null;
    let belowName = null;

    for (const step of STACK) {
      const L = lightness(step.token, mode, accent, paper);
      if (L === null) {
        problems.push(`${step.token} does not resolve in ${section}, ${mode}.`);
        below = null;
        continue;
      }
      measured += 1;
      rows.push([mode, section, step.token, L.toFixed(4)]);

      if (below !== null) {
        const gap = L - below;
        if (gap < step.gap) {
          problems.push(
            `${step.name} is not above ${belowName} in ${section}, ${mode}: `
            + `${L.toFixed(4)} against ${below.toFixed(4)}`
            + (gap < 0
              ? ". It is BELOW it, so the card reads as a hole."
              : `, a gap of ${gap.toFixed(4)} where ${step.gap} is the floor.`));
        }
      }
      below = L;
      belowName = step.name;
    }

    /* `below` is the card at this point, which is what hover is
       measured against. */
    const card = below;
    const hover = lightness(HOVER.token, mode, accent, paper);
    if (hover === null) {
      problems.push(`${HOVER.token} does not resolve in ${section}, ${mode}.`);
    } else if (card !== null) {
      measured += 1;
      rows.push([mode, section, HOVER.token, hover.toFixed(4)]);

      if (Math.abs(hover - card) < HOVER.gap) {
        problems.push(
          `a card under the pointer is not tellable from one that is not, in `
          + `${section}, ${mode}: ${hover.toFixed(4)} against ${card.toFixed(4)}.`);
      }
      if (hover < paper.L) {
        problems.push(
          `a card under the pointer falls below the page in ${section}, ${mode}: `
          + `${hover.toFixed(4)} against ${paper.L.toFixed(4)}. `
          + "It sinks when the pointer arrives.");
      }
    }
  }
}

if (TABLE) {
  for (const [mode, section, token, L] of rows) {
    console.log(`${mode.padEnd(6)} ${section.padEnd(7)} ${token.padEnd(14)} ${L}`);
  }
}

if (problems.length) {
  console.error(`surfaces: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  ${p}`);
  console.error(
    "\n  A raised surface has to be lighter than its ground in both themes."
    + "\n  An accent near 44% lightness darkens a near-white surface, so the"
    + "\n  tint in the light theme has to stay small. --table prints them all.");
  process.exit(1);
}

console.log(
  `surfaces: ${measured} measured across 7 sections and both themes. `
  + "The stack holds: sunk below the page, the page below a card.");
