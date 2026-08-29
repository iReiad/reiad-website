#!/usr/bin/env node
/* ============================================================
   build-card-art.ts: the pictures the loud cards wear.

       node scripts/build-card-art.ts           draw them
       node scripts/build-card-art.ts --check   are they current
       node scripts/build-card-art.ts --sheet   a contact sheet to look at

   ---- why this exists rather than a folder of photographs ----

   The front page's big cards wanted real pictures, and there are
   only three ways to get one. A stock photograph is somebody
   else's work under somebody else's licence, and this site's
   `img-src` is `'self'`, so a borrowed URL does not even load. A
   photograph committed here is a licence to keep track of for
   every card, for ever. A DRAWING is neither: it is ours, it is
   in the site's own palette, and it is regenerated rather than
   hunted for when a colour changes.

   So each picture is composed here out of the same seven layers
   and rendered by a browser, which is what makes it a photograph
   of a thing that does not exist rather than a diagram. The
   layers, back to front:

     ground    the paper under everything, in the card's own hue
     aurora    two big soft lights, the painterly half of it
     floor     a horizon and a grid running away, which is what
               gives a flat canvas a depth to put an object in
     subject   the one thing the card is ABOUT, in neon glass
     streak    a shaft of light across the whole frame
     bokeh     a few out-of-focus points, so the air is not empty
     grain     film, at four per cent, which is what stops a
               gradient banding and reads as a photograph

   The subject is the only layer that differs between them. That
   is deliberate: six pictures drawn by six hands would be six
   pictures, and this is one set.

   ---- what it renders with, and what CI does instead ----

   A browser, because the layers use blend modes, blur and
   perspective, and because a picture you can look at while you
   tune it is the only way this ends up good. Playwright is a
   devDependency of `app/`, so this is a thing a clone runs, and
   the output is COMMITTED like every other generated file here.

   `--check` therefore never opens a browser: it compares a hash
   of this file against `scripts/card-art.stamp.json` and asserts
   every drawing named by a component is on disk. That is
   `scripts/build-stamp.ts`'s arrangement and it is here for the
   same reason: a browser's output is not reproducible byte for
   byte across versions, and the thing that actually goes wrong is
   that nobody re-ran the build.

   ---- the one number that is a constraint ----

   Supersampled at 2x and scaled down on the way into the file.
   A neon edge one pixel wide rendered at 1x is a stair, and the
   whole look rests on those edges.
   ============================================================ */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const OUT = join(ROOT, "aab", "art");
const STAMP = join(HERE, "card-art.stamp.json");

const CHECK = process.argv.includes("--check");
const SHEET = process.argv.includes("--sheet");

/* ---------- the set ----------

   `hue` is the card's own accent, straight out of the table in
   `next/styles/site.css`: 162 is the money school and the site
   itself, 75 the calculators, 345 the work, 30 the kitchen, 205
   Qur'anic Arabic, 255 German. `lift` is the second light, and it
   is always a DIFFERENT hue: one colour lighting a whole frame is
   a filter, two is a photograph.

   `wide` is worn as a card's whole ground and is cropped hard by
   `background-size: cover`, so every subject is composed inside
   the middle band and towards the right, where a card's words are
   not. `thumb` is the same subject centred, because an 84 by 58
   box crops to nothing else. */
type Subject = "chart" | "coins" | "sheets" | "book" | "pan" | "ridge";
type Size = "wide" | "tall" | "thumb";

type Scene = {
  id: string;
  hue: number;
  lift: number;
  subject: Subject;
  sizes: Size[];
  /** What it is a picture OF, for `--sheet` and for the reader of
      this file. A subject nobody can name from the drawing is a
      subject that has stopped being about the card. */
  of: string;
};

const SCENES: Scene[] = [
  { id: "live", hue: 75, lift: 345, subject: "chart", sizes: ["wide", "tall"],
    of: "one account's line, rising, over the candles it is drawn from" },
  { id: "money", hue: 162, lift: 75, subject: "coins", sizes: ["wide", "tall"],
    of: "three stacks of coins as a ladder, the top one lit" },
  { id: "work", hue: 345, lift: 300, subject: "sheets", sizes: ["wide", "tall"],
    of: "spreadsheets in perspective, the front one holding a model" },
  { id: "insights", hue: 162, lift: 205, subject: "book", sizes: ["wide", "tall", "thumb"],
    of: "a book open, its pages made of light" },
  { id: "cooking", hue: 30, lift: 75, subject: "pan", sizes: ["wide", "tall", "thumb"],
    of: "a pan seen from across the room, steam off it" },
  { id: "travel", hue: 345, lift: 255, subject: "ridge", sizes: ["wide", "tall", "thumb"],
    of: "ridges going back, a path through them, a moon" },
];

/* 1200 by 540 rather than anything squarer, because of the crop.
   These are worn as `background-size: cover`, so a card wider in
   ratio than the picture is scaled by its WIDTH and loses the top
   and the bottom: the featured card is close to four to one and
   keeps roughly the middle three quarters. Every subject is
   composed inside that middle band. Horizontally nothing is ever
   lost, because every card these hang on is wider in ratio than
   the 2.2 here. */
const DIMS: Record<Size, { w: number; h: number }> = {
  wide: { w: 1200, h: 540 },
  /* THE PHONE'S OWN PICTURE, and it has to be its own rather than
     the wide one cropped. A card on a phone is TALLER than it is
     wide, so `cover` on a two-to-one drawing throws away the
     sides and keeps a column of sky: measured on a 350 by 340
     card, what survived was the empty top third of the frame and
     none of the subject. Composed for the shape it is shown in,
     the subject fills the upper half and the words sit under it. */
  tall: { w: 900, h: 1000 },
  thumb: { w: 480, h: 330 },
};

export const ART_FILES: string[] =
  SCENES.flatMap((s) => s.sizes.map((z) => `${s.id}${fileSuffix(z)}.webp`));

/** `wide` is the plain name, because it is the one every card
    reaches for first and the one a reader on a laptop sees. */
function fileSuffix(size: Size): string {
  return size === "wide" ? "" : `-${size}`;
}

/* ---------- a seeded scatter ----------

   The bokeh and the film both want randomness and neither wants a
   different answer every run: an unseeded scatter would make
   every rebuild a diff of nine changed files for no visible
   reason. Mulberry32, which is small enough to read. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A hue's colours, at the five jobs a hue has in these pictures.

    Read as one object per light: `t` is the card's own accent and
    carries the picture, `l` is the second light and is spent only
    on small bright details. The two are never both large, which
    is the rule that keeps a frame from going muddy: two big
    complementary washes over each other mix to brown, and the
    first pass of these did exactly that. */
function tones(hue: number) {
  return {
    hot: `oklch(93% 0.155 ${hue})`,
    lit: `oklch(82% 0.16 ${hue})`,
    mid: `oklch(64% 0.15 ${hue})`,
    deep: `oklch(40% 0.10 ${hue})`,
    shade: `oklch(22% 0.055 ${hue})`,
    /* The bottom of the frame, in this hue. A subject that needs
       to go properly dark reaches for this rather than for black:
       a neutral black inside a coloured picture reads as a hole
       cut in it. */
    sink: `oklch(8% 0.018 ${hue})`,
  };
}

type Tones = ReturnType<typeof tones>;

/* ============================================================
   The subjects.

   Every one is drawn on a 520 by 400 stage and every one STANDS
   ON y = 300. That is not a detail: the reflection under it is
   the same drawing mirrored about three quarters of the stage's
   height, so a subject that floated would be a subject reflected
   in mid air.

   They are filled rather than outlined. The first pass was line
   art, and line art on a dark ground reads as a diagram: what
   makes a thing look photographed is that its faces catch the
   light at different strengths, so every shape here has a lit
   face, a darker side and a rim.
   ============================================================ */

const SUBJECTS: Record<Subject, (t: Tones, l: Tones) => string> = {
  /* The account's own line, over the candles it is drawn from.
     The candles are the evidence and the line is the claim, so
     the line is the only thing at full brightness. */
  chart: (t, l) => {
    const bars = [
      { x: 46, o: 250, c: 268, hi: 242, lo: 278 },
      { x: 106, o: 268, c: 240, hi: 232, lo: 276 },
      { x: 166, o: 240, c: 252, hi: 232, lo: 262 },
      { x: 226, o: 252, c: 206, hi: 196, lo: 260 },
      { x: 286, o: 206, c: 216, hi: 198, lo: 228 },
      { x: 346, o: 216, c: 168, hi: 158, lo: 224 },
      { x: 406, o: 168, c: 124, hi: 112, lo: 176 },
    ];
    const candles = bars.map((b) => {
      const top = Math.min(b.o, b.c);
      const height = Math.max(7, Math.abs(b.o - b.c));
      const up = b.c < b.o;
      return `
        <line x1="${b.x + 15}" y1="${b.hi}" x2="${b.x + 15}" y2="${b.lo}"
              stroke="${up ? t.lit : t.deep}" stroke-opacity="0.55" stroke-width="1.6"/>
        <rect x="${b.x}" y="${top}" width="30" height="${height}" rx="4"
              fill="url(#${up ? "cUp" : "cDown"})"
              stroke="${up ? t.lit : t.deep}" stroke-opacity="${up ? 0.75 : 0.5}"
              stroke-width="1.4"/>`;
    }).join("");

    const line = "M61 268 C 88 262, 96 244, 121 240 S 158 250, 181 252 "
      + "S 214 214, 241 206 S 278 218, 301 216 S 338 178, 361 168 S 398 138, 421 124";

    return `
      <defs>
        <linearGradient id="cUp" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${t.hot}" stop-opacity=".9"/>
          <stop offset="1" stop-color="${t.mid}" stop-opacity=".38"/>
        </linearGradient>
        <!-- A DOWN CANDLE IS NOT A FAINT UP CANDLE. It is the same
             body in shadow, so it goes darker than the ground
             rather than more transparent: painted as a fade it
             disappeared into the light behind it and the run of
             seven read as four. -->
        <linearGradient id="cDown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${t.sink}" stop-opacity=".92"/>
          <stop offset="1" stop-color="${t.sink}" stop-opacity=".7"/>
        </linearGradient>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${l.lit}" stop-opacity=".3"/>
          <stop offset="1" stop-color="${l.lit}" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M30 246 H490 M30 192 H490 M30 138 H490"
            stroke="${t.mid}" stroke-opacity="0.15" stroke-width="1.2"/>
      <path d="M30 300 H490" stroke="${t.lit}" stroke-opacity="0.4" stroke-width="1.6"/>
      ${candles}
      <path d="${line} L421 300 L61 300 Z" fill="url(#area)"/>
      <path d="${line}" fill="none" stroke="${l.hot}" stroke-width="4.5"
            stroke-linecap="round"/>
      <path d="M392 108 L432 112 L428 152" fill="none" stroke="${l.hot}"
            stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="421" cy="124" r="8.5" fill="${l.hot}"/>
      <circle cx="421" cy="124" r="18" fill="none" stroke="${l.lit}"
              stroke-opacity="0.5" stroke-width="1.6"/>`;
  },

  /* A ladder made of money: three stacks, each taller, the last
     one lit. Every coin is a side wall and a top face rather than
     an outline, which is the whole difference between a stack of
     coins and a stack of rings.

     No glyph anywhere. A rendering container has no Bengali font,
     so a taka sign here would come out as a tofu box in a picture
     nobody could fix by reading the markup. */
  coins: (t, l) => {
    const stack = (cx: number, count: number, top: Tones) => {
      const out: string[] = [];
      for (let i = 0; i < count; i += 1) {
        const cy = 288 - i * 15;
        const last = i === count - 1;
        const c = last ? top : t;
        out.push(`
          <path d="M${cx - 54} ${cy} v13 a54 17 0 0 0 108 0 v-13 z"
                fill="url(#${last ? "sideTop" : "side"})"
                stroke="${c.mid}" stroke-opacity="0.5" stroke-width="1.2"/>
          <ellipse cx="${cx}" cy="${cy}" rx="54" ry="17"
                   fill="url(#${last ? "faceTop" : "face"})"
                   stroke="${last ? c.hot : c.lit}" stroke-opacity="${last ? 0.95 : 0.6}"
                   stroke-width="${last ? 2 : 1.4}"/>
          ${last ? `<ellipse cx="${cx}" cy="${cy}" rx="30" ry="9" fill="none"
                             stroke="${c.hot}" stroke-opacity="0.55" stroke-width="1.4"/>` : ""}`);
      }
      return out.join("");
    };
    return `
      <defs>
        <linearGradient id="face" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${t.lit}" stop-opacity=".42"/>
          <stop offset="1" stop-color="${t.deep}" stop-opacity=".3"/>
        </linearGradient>
        <linearGradient id="faceTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${l.hot}" stop-opacity=".72"/>
          <stop offset="1" stop-color="${l.mid}" stop-opacity=".42"/>
        </linearGradient>
        <linearGradient id="side" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${t.mid}" stop-opacity=".34"/>
          <stop offset="1" stop-color="${t.shade}" stop-opacity=".85"/>
        </linearGradient>
        <linearGradient id="sideTop" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${l.mid}" stop-opacity=".5"/>
          <stop offset="1" stop-color="${t.shade}" stop-opacity=".8"/>
        </linearGradient>
      </defs>
      ${stack(110, 3, t)}
      ${stack(250, 5, t)}
      ${stack(392, 8, l)}
      <path d="M392 150 V112 M374 128 L392 110 L410 128" fill="none" stroke="${l.hot}"
            stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="462" cy="150" r="3.4" fill="${l.hot}" fill-opacity=".85"/>
      <circle cx="318" cy="122" r="2.6" fill="${t.hot}" fill-opacity=".6"/>
      <circle cx="176" cy="176" r="3" fill="${t.hot}" fill-opacity=".45"/>`;
  },

  /* Three sheets going back, and the front one holds a model
     rather than a grid: bars, a curve over them and a column of
     line items, which is what the seven case studies are. */
  sheets: (t, l) => `
    <defs>
      <linearGradient id="sheet" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="${t.lit}" stop-opacity=".3"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".72"/>
      </linearGradient>
      <linearGradient id="sheetBack" x1="0" y1="0" x2="0.4" y2="1">
        <stop offset="0" stop-color="${t.mid}" stop-opacity=".2"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".55"/>
      </linearGradient>
      <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${t.hot}" stop-opacity=".85"/>
        <stop offset="1" stop-color="${t.mid}" stop-opacity=".3"/>
      </linearGradient>
    </defs>
    <g transform="translate(214 54) skewY(-8)">
      <rect width="268" height="182" rx="12" fill="url(#sheetBack)"
            stroke="${t.mid}" stroke-opacity="0.35" stroke-width="1.4"/>
    </g>
    <g transform="translate(150 92) skewY(-8)">
      <rect width="286" height="192" rx="12" fill="url(#sheetBack)"
            stroke="${t.lit}" stroke-opacity="0.4" stroke-width="1.4"/>
    </g>
    <g transform="translate(74 128) skewY(-8)">
      <rect width="308" height="204" rx="14" fill="url(#sheet)"
            stroke="${l.lit}" stroke-opacity="0.75" stroke-width="2"/>
      <path d="M0 44 H308 M88 0 V204" stroke="${t.lit}" stroke-opacity="0.2"
            stroke-width="1.3"/>
      <path d="M18 22 H62 M110 22 H160 M188 22 H228" stroke="${t.lit}"
            stroke-opacity="0.5" stroke-width="5" stroke-linecap="round"/>
      <path d="M18 74 H62 M18 106 H62 M18 138 H62 M18 170 H62" stroke="${t.lit}"
            stroke-opacity="0.28" stroke-width="4.5" stroke-linecap="round"/>
      <rect x="112" y="132" width="17" height="44" rx="4" fill="url(#bar)"/>
      <rect x="148" y="108" width="17" height="68" rx="4" fill="url(#bar)"/>
      <rect x="184" y="142" width="17" height="34" rx="4" fill="url(#bar)"/>
      <rect x="220" y="88" width="17" height="88" rx="4" fill="url(#bar)"/>
      <rect x="256" y="122" width="17" height="54" rx="4" fill="url(#bar)"/>
      <path d="M120 124 C 146 116, 164 96, 192 100 S 240 74, 264 68" fill="none"
            stroke="${l.hot}" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="264" cy="68" r="6" fill="${l.hot}"/>
    </g>`,

  /* Pages of light. The two halves lift away from the spine and
     the second light falls on the right one only, which is what
     makes it a book being read rather than a symmetrical badge. */
  book: (t, l) => `
    <defs>
      <linearGradient id="pageL" x1="0" y1="0" x2="0.3" y2="1">
        <stop offset="0" stop-color="${t.lit}" stop-opacity=".34"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".7"/>
      </linearGradient>
      <linearGradient id="pageR" x1="1" y1="0" x2="0.6" y2="1">
        <stop offset="0" stop-color="${l.lit}" stop-opacity=".3"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".65"/>
      </linearGradient>
      <radialGradient id="spineGlow" cx="0.5" cy="0.5">
        <stop offset="0" stop-color="${l.hot}" stop-opacity=".55"/>
        <stop offset="1" stop-color="${l.hot}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <ellipse cx="260" cy="196" rx="120" ry="86" fill="url(#spineGlow)"/>
    <path d="M258 300 C 200 264, 128 252, 56 256 L56 128 C 128 124, 200 136, 258 172 Z"
          fill="url(#pageL)" stroke="${t.lit}" stroke-opacity="0.7" stroke-width="2"/>
    <path d="M262 300 C 320 264, 392 252, 464 256 L464 128 C 392 124, 320 136, 262 172 Z"
          fill="url(#pageR)" stroke="${l.lit}" stroke-opacity="0.8" stroke-width="2"/>
    <path d="M260 172 V300" stroke="${l.hot}" stroke-opacity="0.7" stroke-width="2.4"/>
    <path d="M92 178 H210 M92 206 H200 M92 234 H210 M92 262 H178"
          stroke="${t.hot}" stroke-opacity="0.3" stroke-width="5" stroke-linecap="round"/>
    <path d="M312 182 H428 M322 210 H428 M312 238 H418"
          stroke="${l.hot}" stroke-opacity="0.34" stroke-width="5" stroke-linecap="round"/>
    <path d="M260 104 L269 78 L295 69 L269 60 L260 34 L251 60 L225 69 L251 78 Z"
          fill="${l.hot}"/>
    <circle cx="370" cy="80" r="3.2" fill="${t.hot}" fill-opacity=".75"/>
    <circle cx="150" cy="68" r="2.6" fill="${t.hot}" fill-opacity=".55"/>
    <path d="M150 68 L260 70 L370 80" stroke="${t.lit}" stroke-opacity="0.2"
          stroke-width="1.4" fill="none"/>`,

  /* The kitchen, seen from across the room. The pan is an ellipse
     at a low angle with a lit far rim, and the steam is three
     curls at three weights: what says hot is that they are not
     the same curl. */
  pan: (t, l) => `
    <defs>
      <linearGradient id="panBody" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${t.lit}" stop-opacity=".5"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".9"/>
      </linearGradient>
      <radialGradient id="panHeat" cx="0.5" cy="0.42">
        <stop offset="0" stop-color="${l.hot}" stop-opacity=".6"/>
        <stop offset="1" stop-color="${l.mid}" stop-opacity=".05"/>
      </radialGradient>
    </defs>
    <path d="M328 258 H452 a15 15 0 0 1 0 30 H328 Z" fill="url(#panBody)"
          stroke="${t.lit}" stroke-opacity="0.55" stroke-width="1.8"/>
    <ellipse cx="200" cy="272" rx="150" ry="48" fill="url(#panBody)"
             stroke="${t.lit}" stroke-opacity="0.8" stroke-width="2.4"/>
    <ellipse cx="200" cy="268" rx="124" ry="37" fill="url(#panHeat)"
             stroke="${l.lit}" stroke-opacity="0.45" stroke-width="1.4"/>
    <path d="M156 226 C 128 190, 190 176, 162 136 S 190 90, 176 64" fill="none"
          stroke="${t.hot}" stroke-opacity="0.45" stroke-width="4"
          stroke-linecap="round"/>
    <path d="M222 218 C 196 180, 254 166, 230 126 S 252 90, 242 68" fill="none"
          stroke="${l.hot}" stroke-opacity="0.7" stroke-width="5"
          stroke-linecap="round"/>
    <path d="M284 230 C 268 202, 310 190, 294 160" fill="none"
          stroke="${t.hot}" stroke-opacity="0.32" stroke-width="3.4"
          stroke-linecap="round"/>
    <circle cx="162" cy="268" r="6" fill="${l.hot}" fill-opacity=".85"/>
    <circle cx="228" cy="276" r="5" fill="${t.hot}" fill-opacity=".7"/>
    <circle cx="196" cy="282" r="4" fill="${l.hot}" fill-opacity=".6"/>
    <circle cx="252" cy="262" r="3.4" fill="${t.hot}" fill-opacity=".5"/>`,

  /* Ridges going back, each one paler and higher, which is the
     only depth cue a landscape needs. The path is dashed because
     a solid line through mountains reads as a river. */
  ridge: (t, l) => `
    <defs>
      <!-- A RIDGE IS DARK WITH A LIT EDGE. Lighting one right
           through makes a pastel paper cut-out, which is what the
           first pass of this was: the land went pale where it met
           the sky and the two stopped being different things.
           Each gradient is therefore a bright top inch and then
           the ground's own darkness, and the nearer the ridge the
           faster it gets there. -->
      <linearGradient id="far" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${t.mid}" stop-opacity=".3"/>
        <stop offset="0.45" stop-color="${t.shade}" stop-opacity=".52"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".72"/>
      </linearGradient>
      <linearGradient id="mid" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${t.lit}" stop-opacity=".34"/>
        <stop offset="0.3" stop-color="${t.shade}" stop-opacity=".76"/>
        <stop offset="1" stop-color="${t.shade}" stop-opacity=".9"/>
      </linearGradient>
      <linearGradient id="near" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${l.lit}" stop-opacity=".42"/>
        <stop offset="0.22" stop-color="${t.shade}" stop-opacity=".9"/>
        <stop offset="1" stop-color="${t.sink}" stop-opacity=".97"/>
      </linearGradient>
      <radialGradient id="moon" cx="0.42" cy="0.36">
        <stop offset="0" stop-color="${l.hot}" stop-opacity=".85"/>
        <stop offset="1" stop-color="${l.mid}" stop-opacity=".22"/>
      </radialGradient>
    </defs>
    <circle cx="398" cy="96" r="36" fill="url(#moon)" stroke="${l.hot}"
            stroke-opacity="0.55" stroke-width="1.8"/>
    <path d="M10 300 L104 166 L172 226 L246 150 L338 300 Z" fill="url(#far)"
          stroke="${t.mid}" stroke-opacity="0.32" stroke-width="1.4"/>
    <path d="M148 300 L246 178 L318 240 L386 182 L488 300 Z" fill="url(#mid)"
          stroke="${t.lit}" stroke-opacity="0.5" stroke-width="1.8"/>
    <path d="M-6 300 L118 202 L212 272 L288 214 L404 300 Z" fill="url(#near)"
          stroke="${l.lit}" stroke-opacity="0.8" stroke-width="2.4"/>
    <path d="M158 306 C 200 282, 184 256, 220 244 S 266 226, 288 214"
          fill="none" stroke="${l.hot}" stroke-opacity="0.85" stroke-width="3.2"
          stroke-linecap="round" stroke-dasharray="2 13"/>
    <circle cx="288" cy="214" r="6" fill="${l.hot}"/>
    <circle cx="452" cy="58" r="2.6" fill="${l.hot}" fill-opacity=".7"/>
    <circle cx="318" cy="52" r="2" fill="${t.hot}" fill-opacity=".55"/>`,
};

/* ============================================================
   The frame every subject is set into.
   ============================================================ */

/** Film, as one tile of turbulence. Baked into the raster here,
    so no page pays a filter cost for it at paint time. */
const GRAIN = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">`
  + `<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.82"`
  + ` numOctaves="3" stitchTiles="stitch"/>`
  + `<feColorMatrix type="saturate" values="0"/></filter>`
  + `<rect width="180" height="180" filter="url(#n)"/></svg>`)}")`;

function scene(s: Scene, size: Size): string {
  const { w, h } = DIMS[size];
  const wide = size === "wide";
  const tall = size === "tall";
  /* Everything that is not a thumbnail is drawn at a size where
     a wide blur reads as atmosphere rather than as a smear. */
  const big = size !== "thumb";
  const t = tones(s.hue);
  const l = tones(s.lift);
  /* The second wash is ANALOGOUS, a little way round the wheel
     from the card's own hue, and never the lift hue. Two large
     washes far apart mix to brown wherever they overlap, which is
     what made the first pass of the gold card look like tea. The
     lift hue survives where it belongs: on the small bright
     things inside the subject. */
  const near = tones((s.hue + 34) % 360);
  const random = rng(s.hue * 977 + (wide ? 13 : tall ? 41 : 71));

  const art = SUBJECTS[s.subject](t, l);

  /* Out of focus points, small and few. Twelve is where they stop
     reading as air and start reading as a pattern. */
  const bokeh = Array.from({ length: big ? 9 : 6 }, () => {
    const r = 4 + random() * 15;
    return `<i style="left:${6 + random() * 90}%;top:${8 + random() * 78}%;`
      + `width:${r}px;height:${r}px;opacity:${(0.12 + random() * 0.34).toFixed(2)};`
      + `filter:blur(${(0.4 + random() * 3).toFixed(1)}px)"></i>`;
  }).join("");

  /* Three frames, three placements, and all three are decided by
     where the card's WORDS are rather than by taste.

     Wide: right of centre, because the words run down the left.
     Tall: the upper half, because on a phone the words sit under
     the picture rather than beside it. Thumb: dead centre, since
     an 84 by 58 box crops to nothing else. */
  const stage = wide
    ? "left:44%;top:15%;width:52%;height:70%"
    : tall
      ? "left:7%;top:7%;width:86%;height:54%"
      : "left:7%;top:9%;width:86%;height:82%";

  /* Where the ground meets the sky. It sits a little ABOVE the
     line the subject stands on, so the subject reads as being in
     front of the horizon rather than balanced on it. */
  const floorH = wide ? 44 : tall ? 58 : 44;

  return `<!doctype html>
<html><head><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${w}px;height:${h}px;overflow:hidden;background:#000}
  .frame{position:relative;width:${w}px;height:${h}px;isolation:isolate}
  .frame>*{position:absolute;inset:0}

  /* the ground, and it is nearly black everywhere the subject is
     not: the pop is contrast rather than saturation */
  .ground{background:
    radial-gradient(120% 96% at ${wide ? "70% 42%" : tall ? "52% 30%" : "50% 40%"},
      ${t.shade} 0%, oklch(12% 0.026 ${s.hue}) 44%,
      oklch(7.5% 0.015 ${s.hue}) 100%)}

  /* the light the subject stands in */
  /* ABOVE the subject rather than behind it, which is what gives
     the subject an edge to be read against. Centred on it, the
     light and the thing were the same brightness and the gold
     frame in particular went to soup. */
  .halo{background:radial-gradient(40% 56% at ${
    wide ? "74% 30%" : tall ? "54% 22%" : "52% 30%"},
    ${t.mid} 0%, transparent 72%);opacity:.28;mix-blend-mode:screen;
    filter:blur(${big ? 34 : 20}px)}

  /* two soft washes, analogous, plus one cold one for the depth */
  .aurora i{position:absolute;border-radius:50%;mix-blend-mode:screen}
  .aurora .a{left:${wide ? "40%" : tall ? "4%" : "12%"};
    top:${tall ? "-14%" : "-30%"};width:${tall ? "92%" : "74%"};
    height:${tall ? "72%" : "110%"};
    background:radial-gradient(closest-side,${t.deep} 0%,transparent 70%);
    opacity:.62;filter:blur(${big ? 70 : 44}px)}
  .aurora .b{left:${wide ? "60%" : tall ? "26%" : "40%"};
    top:${tall ? "14%" : "22%"};width:${tall ? "78%" : "58%"};
    height:${tall ? "60%" : "96%"};
    background:radial-gradient(closest-side,${near.deep} 0%,transparent 70%);
    opacity:.55;filter:blur(${big ? 78 : 48}px)}
  .aurora .c{left:-16%;top:${tall ? "48%" : "34%"};width:56%;
    height:${tall ? "56%" : "88%"};
    background:radial-gradient(closest-side,oklch(38% 0.07 ${(s.hue + 200) % 360})
      0%,transparent 74%);opacity:.5;filter:blur(${big ? 82 : 50}px)}

  /* a horizon with a grid running away from it */
  .floor{top:auto;height:${floorH}%;bottom:0;
    background:repeating-linear-gradient(to right,
      ${t.lit}2e 0 1.5px,transparent 1.5px 68px);
    transform:perspective(360px) rotateX(68deg);transform-origin:50% 0%;
    mask-image:linear-gradient(to bottom,#000,transparent 72%);
    opacity:.5}
  .horizon{top:auto;bottom:${floorH}%;height:1.5px;
    background:linear-gradient(to right,transparent 8%,${t.hot},transparent 92%);
    opacity:.45;filter:blur(1px)}

  /* the subject, its bloom, and the floor it is standing on */
  .stage{inset:auto;${stage}}
  .stage svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
  .real{filter:drop-shadow(0 0 9px ${t.lit}) drop-shadow(0 0 30px ${t.mid})
        drop-shadow(0 18px 30px oklch(5% 0.02 ${s.hue} / .9))}
  /* THE ECHO IS MIRRORED ABOUT 75% OF THE STAGE, which is the line
     every subject stands on. The mask is written in the copy's own
     coordinates and is flipped with it, so it fades UPWARD here in
     order to fade downward on the page. */
  .echo{transform-origin:50% 75%;transform:scaleY(-1);
    mask-image:linear-gradient(to bottom,transparent 42%,oklch(0% 0 0 / .8) 76%);
    filter:blur(3px);opacity:.3}

  /* a shaft across the frame and the light in the corner */
  .streak{background:linear-gradient(100deg,transparent 30%,
    oklch(97% 0.03 ${s.hue} / .13) 45%,transparent 57%);mix-blend-mode:screen}
  .spot{background:radial-gradient(40% 54% at ${
    wide ? "80% 12%" : tall ? "68% 8%" : "64% 10%"},
    ${near.hot} 0%,transparent 70%);opacity:.24;mix-blend-mode:screen}

  .bokeh i{position:absolute;border-radius:50%;background:${l.hot};
    mix-blend-mode:screen}

  /* film, the vignette, and the side a card writes on */
  .grain{background-image:${GRAIN};background-size:180px 180px;
    opacity:.05;mix-blend-mode:overlay}
  .vignette{background:radial-gradient(84% 74% at 50% 46%,transparent 48%,
    oklch(4% 0.012 ${s.hue} / .88) 100%)}
  ${wide ? `.scrim{background:linear-gradient(94deg,
    oklch(6% 0.016 ${s.hue} / .84) 4%,oklch(7% 0.018 ${s.hue} / .3) 44%,
    transparent 68%)}` : tall ? `.scrim{background:linear-gradient(to top,
    oklch(6% 0.016 ${s.hue} / .5) 0%,oklch(7% 0.018 ${s.hue} / .18) 34%,
    transparent 58%)}` : `.scrim{background:linear-gradient(to top,
    oklch(6% 0.016 ${s.hue} / .55),transparent 62%)}`}
</style></head><body>
  <div class="frame">
    <div class="ground"></div>
    <div class="aurora"><i class="a"></i><i class="b"></i><i class="c"></i></div>
    <div class="halo"></div>
    <div class="floor"></div>
    <div class="horizon"></div>
    <div class="spot"></div>
    <div class="stage">
      <svg class="echo" viewBox="0 0 520 400" fill="none">${art}</svg>
      <svg class="real" viewBox="0 0 520 400" fill="none">${art}</svg>
    </div>
    <div class="streak"></div>
    <div class="bokeh">${bokeh}</div>
    <div class="grain"></div>
    <div class="vignette"></div>
    <div class="scrim"></div>
  </div>
</body></html>`;
}

/* ============================================================
   Drawing, checking, and the sheet to look at.
   ============================================================ */

/** The hash `--check` compares. This file IS the artwork, so its
    own bytes are the honest source: a tuned gradient here is a
    changed picture, and nothing else would say so. */
function sourceHash(): string {
  return createHash("sha256")
    .update(readFileSync(fileURLToPath(import.meta.url)))
    .digest("hex")
    .slice(0, 16);
}

/** Every `/art/<name>.webp` a component asks for. A drawing that
    is referenced and absent is a card with a hole in it, and the
    page still renders, so it is asked here. */
function referenced(): Array<{ file: string; art: string }> {
  const out: Array<{ file: string; art: string }> = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.name.startsWith(".") || entry.name === "node_modules") continue;
      const here = join(dir, entry.name);
      if (entry.isDirectory()) { walk(here); continue; }
      if (!/\.tsx?$/.test(entry.name)) continue;
      const src = readFileSync(here, "utf8");
      for (const m of src.matchAll(/\/art\/([a-z0-9-]+\.webp)/g)) {
        out.push({ file: here.slice(ROOT.length + 1), art: m[1] });
      }
    }
  };
  walk(join(ROOT, "next"));
  return out;
}

if (CHECK) {
  let bad = 0;
  const want = sourceHash();
  const have = existsSync(STAMP)
    ? (JSON.parse(readFileSync(STAMP, "utf8")) as { source?: string }).source
    : null;

  if (have !== want) {
    bad += 1;
    console.error("\n  x the drawings are older than the file that draws them.");
    console.error(`        stamp ${have ?? "missing"}, source ${want}`);
    console.error("        Run `node scripts/build-card-art.ts` and commit what it writes.");
    console.error("        A stale picture looks exactly like a correct one, which is why");
    console.error("        this is a check rather than a habit.");
  }

  for (const name of ART_FILES) {
    if (existsSync(join(OUT, name))) continue;
    bad += 1;
    console.error(`\n  x aab/art/${name} is in the set and is not on disk.`);
  }

  for (const { file, art } of referenced()) {
    if (existsSync(join(OUT, art))) continue;
    bad += 1;
    console.error(`\n  x ${file} asks for /art/${art}, which does not exist.`);
    console.error("        The card renders perfectly with no picture in it.");
  }

  console.log(bad ? `\ncard art: ${bad} problem(s).`
    : `card art: ${ART_FILES.length} drawing(s), current, and every one a component `
      + `asks for is on disk.`);
  process.exit(bad ? 1 : 0);
}

/* ---------- from here down a browser is needed ---------- */

/* ---- the browser, described rather than imported ----

   `scripts/tsconfig.json` has neither playwright's types nor the
   DOM library, and it should have neither: this is the one file
   under `scripts/` that drives a browser, and widening that
   config would hand `document` and `window` to forty node
   scripts that must never touch them.

   So the surface used here is written out. It is four methods,
   it is checked against the real thing every time this runs, and
   it is the honest alternative to `any`, which would describe
   nothing and silence the next mistake too. */
type Shot = { type: "png" };
type Pane = {
  setContent(html: string, options: { waitUntil: "load" }): Promise<void>;
  screenshot(options: Shot): Promise<Buffer>;
  /** Playwright takes an EXPRESSION as well as a function, and it
      has to be one here: a function would be typechecked in this
      file, where `document` and `Image` do not exist. */
  evaluate<T>(expression: string): Promise<T>;
  close(): Promise<void>;
};
type Chrome = {
  chromium: {
    launch(options: { executablePath?: string }): Promise<{
      newPage(options: {
        viewport: { width: number; height: number };
        deviceScaleFactor: number;
      }): Promise<Pane>;
      close(): Promise<void>;
    }>;
  };
};

/* By path into `app/`, which is where the browser tests reach for
   it too: playwright is a devDependency of that workspace and
   node's resolution from here would never find it. Written as a
   variable because a bare specifier in an import() is what the
   bundler-shaped tools try to follow. */
const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const pw = await import(PLAYWRIGHT)
  .then((m) => m as Chrome, () => null);
if (!pw) {
  console.error("card art: playwright is not installed. It is a devDependency of app/:");
  console.error("          cd app && npm install");
  process.exit(1);
}
const { chromium } = pw;

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(
  process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

const made: Array<{ name: string; kb: number }> = [];

for (const s of SCENES) {
  for (const size of s.sizes) {
    const { w, h } = DIMS[size];
    const name = `${s.id}${fileSuffix(size)}.webp`;

    /* Twice the size, then down. The look rests on one pixel
       neon edges and a stair on one of those is the whole
       difference between a render and a drawing. */
    const page = await browser.newPage({
      viewport: { width: w, height: h }, deviceScaleFactor: 2,
    });
    await page.setContent(scene(s, size), { waitUntil: "load" });
    const shot = await page.screenshot({ type: "png" });

    /* WebP, and it is worth the trip through a canvas: the same
       frame as a JPEG is five times the bytes and bands across
       exactly the smooth dark gradients everything here is made
       of. Chromium encodes WebP from a canvas, and a canvas fed
       from a `data:` URL is same-origin, where one fed from a
       `file://` image would be tainted and refuse to encode at
       all. */
    const webp = await page.evaluate<string>(`(async () => {
      const img = new Image();
      img.src = "data:image/png;base64,${shot.toString("base64")}";
      await img.decode();
      const canvas = document.createElement("canvas");
      canvas.width = ${w};
      canvas.height = ${h};
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("no 2d context");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, ${w}, ${h});
      return canvas.toDataURL("image/webp", 0.9).split(",")[1];
    })()`);

    const bytes = Buffer.from(webp, "base64");
    writeFileSync(join(OUT, name), bytes);
    made.push({ name, kb: Math.round(bytes.length / 102.4) / 10 });
    await page.close();
  }
}

if (SHEET) {
  /* Somewhere to LOOK at all of them at once, at the size a card
     actually crops them to.

     Written OUTSIDE `aab/`, with absolute sources, because every
     file in that directory is uploaded and answers at a public
     URL: a harness left there is a harness published, which is
     the whole argument of `aab/.assetsignore`. `--sheet` takes
     the directory to write it to, and defaults to the system's
     temporary one, so it leaves no trace in the repository at
     all. */
  const at = process.argv[process.argv.indexOf("--sheet") + 1];
  const dir = at && !at.startsWith("--") ? at : (process.env.TMPDIR ?? "/tmp");
  const rows = SCENES.map((s) => `
    <section>
      <h2>${s.id} <span>${s.of}</span></h2>
      <div class="row">
        <div class="card wide" style="background-image:url('file://${OUT}/${s.id}.webp')">
          <b>a card's whole ground</b>
        </div>
        ${s.sizes.includes("thumb")
          ? `<div class="card thumb"
                  style="background-image:url('file://${OUT}/${s.id}-thumb.webp')"></div>`
          : ""}
      </div>
    </section>`).join("");
  writeFileSync(join(dir, "card-art-sheet.html"), `<!doctype html><meta charset="utf-8">
    <style>body{background:#0d1210;color:#e6efe9;font:14px system-ui;padding:26px;
      display:grid;gap:26px}
      h2{font-size:13px;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
      h2 span{text-transform:none;letter-spacing:0;opacity:.55;font-weight:400}
      .row{display:flex;gap:14px;align-items:flex-start}
      .card{background-size:cover;background-position:center;border-radius:14px;
        border:1px solid #ffffff22}
      .wide{width:720px;height:280px;display:flex;align-items:flex-end;padding:18px}
      .wide b{font-size:22px}
      .thumb{width:168px;height:116px}</style>${rows}`);
  console.log(`  a sheet to look at: ${join(dir, "card-art-sheet.html")}`);
}

await browser.close();
writeFileSync(STAMP, `${JSON.stringify({ source: sourceHash(), files: ART_FILES }, null, 2)}\n`);

const total = made.reduce((n, m) => n + m.kb, 0);
for (const m of made) console.log(`  ${m.name.padEnd(20)} ${m.kb} KB`);
console.log(`card art: ${made.length} drawing(s), ${total.toFixed(1)} KB in all.`);
