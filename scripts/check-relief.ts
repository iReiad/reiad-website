#!/usr/bin/env node
/* ============================================================
   check-relief.ts: everything that lifts, stops lifting.

       node scripts/check-relief.ts
       node scripts/check-relief.ts --list

   `@layer relief` in `next/styles/site.css` gives every icon,
   disc and plate on this site the same depth a card's scene has,
   one order of magnitude down: it moves with the light, it comes
   towards you, and it throws a shadow the other way.

   It is a CURATED LIST, like the material's, and for the same
   reason: most of this site is still classes rather than
   components, and a selector broad enough to catch every figure
   would catch the scene's own ten layers too and parallax them
   twice. A curated list rots, so this is what stops it.

   Three questions, and each one is a way of shipping something
   that looks completely correct:

   1. DOES EVERY NAME IN THE LIST REACH A CLASS? A relief on a
      class the stylesheet has never defined is a rule that runs
      on nothing. `check-css.ts` catches a class that ONLY the
      relief defines; it cannot catch a name that is simply never
      rendered, because the relief defining it is what makes it
      look defined.

   2. DOES EVERYTHING THAT LIFTS ALSO STOP? A reader who has
      asked for less motion gets the light and none of the
      movement, and that promise is kept by one block at the foot
      of the layer listing the same selectors again. Two lists
      that have to agree is the failure this whole repository
      keeps writing up, so they are compared rather than trusted.

   3. IS ANYTHING LIFTED TWICE? A scene's ten layers already
      parallax against the same pointer, at up to fifteen times
      this distance. A class that is in both systems moves twice,
      which does not look like a bug: it looks like that one
      element being slightly wrong.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = readFileSync(join(ROOT, "next/styles/site.css"), "utf8");
const LIST = process.argv.includes("--list");

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

/** One layer's body, by brace depth from its opening. A regex
    cannot do this: the layer holds nested blocks and `@media`. */
function layerBody(name: string): string {
  const at = CSS.indexOf(`@layer ${name} {`);
  if (at < 0) return "";
  let depth = 0;
  for (let i = CSS.indexOf("{", at); i < CSS.length; i += 1) {
    if (CSS[i] === "{") depth += 1;
    else if (CSS[i] === "}") {
      depth -= 1;
      if (!depth) return CSS.slice(CSS.indexOf("{", at) + 1, i);
    }
  }
  return "";
}

const relief = layerBody("relief");
if (!relief) {
  fail("there is no `@layer relief` in next/styles/site.css.",
    "Either it was renamed, in which case rename it here too, or it went,",
    "in which case this check goes with it.");
  process.exit(1);
}

/** Everything after the last `@media` in the layer is the
    reduced-motion block; everything before it is the layer
    proper. Split rather than parsed, because the promise being
    checked is about those two halves specifically. */
const cut = relief.lastIndexOf("@media (prefers-reduced-motion: reduce)");
const moving = cut < 0 ? relief : relief.slice(0, cut);
const still = cut < 0 ? "" : relief.slice(cut);

/** The classes a chunk of CSS names, without the dot. */
const classesIn = (css: string): Set<string> =>
  new Set([...css.replace(/\/\*[\s\S]*?\*\//g, "")
    .matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)].map((m) => m[1]));

/** Every top-level rule in a layer, as selector and body. */
function rules(css: string): Array<{ sel: string; body: string }> {
  const bare = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: Array<{ sel: string; body: string }> = [];
  let start = 0, depth = 0, open = -1;
  for (let i = 0; i < bare.length; i += 1) {
    if (bare[i] === "{") {
      if (!depth) open = i;
      depth += 1;
    } else if (bare[i] === "}") {
      depth -= 1;
      if (!depth) {
        out.push({ sel: bare.slice(start, open).trim(), body: bare.slice(open + 1, i) });
        start = i + 1;
      }
    }
  }
  return out;
}

/** THE FIGURES, which is not the same list as the selectors in
    this layer. Half the layer is the ANCESTORS: a broad
    `:where(a, button, .card, ...)` that sets `--lift` and moves
    nothing itself, and holding a card to the promise that it
    stops moving would be holding it to a promise it never made.

    A figure is a rule that sets `translate` or `scale`. */
const figuresIn = (css: string): Set<string> => {
  const out = new Set<string>();
  for (const rule of rules(css)) {
    /* An at-rule holds rules rather than declarations, so the
       promise inside a `@media` is made by the rules IN it. Not
       recursing here is why the reduced-motion block read as
       empty and every figure looked as though it never stopped. */
    if (rule.sel.startsWith("@")) {
      for (const cls of figuresIn(rule.body)) out.add(cls);
      continue;
    }
    if (!/(^|[;{\s])(translate|scale)\s*:/.test(rule.body)) continue;
    for (const cls of classesIn(rule.sel)) out.add(cls);
  }
  return out;
};

/* ---- 1. every name reaches a class ---- */

const named = [...figuresIn(moving)].sort();

/** Does any layer OTHER than the relief define this class? The
    relief's own mentions are stripped first, so a name only it
    knows about comes out as nothing. */
const elsewhere = CSS.replace(relief, "");
const orphans = named.filter((cls) => !new RegExp(`\\.${cls}\\b`).test(elsewhere));

/* `relief-lift` is the layer's own opt-in hook and is handed to
   components rather than being styled anywhere else, so it is
   deliberately not in the stylesheet twice. It has to appear in
   the markup instead, which is the same question asked of the
   place that can answer it. */
const HOOK = "relief-lift";
const inMarkup = readFileSync(join(ROOT, "next/components/news.tsx"), "utf8");

for (const cls of orphans) {
  if (cls === HOOK) {
    if (!inMarkup.includes(HOOK)) {
      fail(`\`.${HOOK}\` is the relief's opt-in hook and nothing wears it.`,
        "Either give it to the figure that needed it, or take it out of the layer.");
    }
    continue;
  }
  fail(`\`.${cls}\` lifts in @layer relief and no other layer defines it.`,
    "A relief on a class that does not exist is a rule that runs on nothing,",
    "and it looks exactly like one that works. Fix the name or drop it.");
}

/* ---- 2. everything that lifts also stops ---- */

const stops = figuresIn(still);
const restless = named.filter((cls) => !stops.has(cls));
if (restless.length) {
  fail(`${restless.length} class(es) lift and never stop:`,
    restless.join(", "),
    "Add them to the `prefers-reduced-motion` block at the foot of the layer.",
    "A reader who asked for no motion gets the light and none of the movement,",
    "and half a promise is worse than none: the page still moves, just less.");
}

/* ---- 3. nothing is lifted twice ---- */

/* The scene's own layers, which parallax against the same pointer
   in `@layer deck` at up to fifteen times this distance. */
const SCENE = ["artwork", "art-space", "art-sky", "art-weave", "art-halo",
  "art-rays", "art-far", "art-floor", "art-stage", "art-near", "art-spec",
  "art-veil", "art-copy", "art-echo", "art-real", "art-svg"];

const twice = named.filter((cls) => SCENE.includes(cls));
if (twice.length) {
  fail(`${twice.length} class(es) are in both the scene and the relief:`,
    twice.join(", "),
    "They would move twice against one pointer, which does not read as a bug.",
    "It reads as that one element being slightly wrong.");
}

if (LIST) {
  console.log(`${named.length} class(es) lift:\n  ${named.join("\n  ")}`);
}

if (failures) {
  console.error(`\n${failures} problem(s) in @layer relief.`);
  process.exit(1);
}
console.log(`${named.length} classes lift, every one of them defined elsewhere,`
  + " and all of them stop for a reader who asked for no motion.");
