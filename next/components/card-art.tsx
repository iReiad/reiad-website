/* ============================================================
   card-art.tsx: the picture a card wears.

   ---- one drawing, both themes ----

   These were twenty-five committed WebP files, and a raster
   cannot answer a theme: light and dark would have meant two of
   everything, kept in step by hand for ever. Every colour here is
   instead a MIX of the card's own `--accent` with `--panel` and
   `--ink`, which are the two tokens that already flip. So one
   drawing is dark glass on a dark ground at night and inked glass
   on paper by day, and a school that changes colour in
   `shared/nav.ts` changes colour here with nothing regenerated.

   That also took a build step, a browser, a stamp file and 300 KB
   of binaries out of the repository. A drawing is markup now, so
   it is diffable, it is crisp at any density, and it costs one
   paint rather than one fetch.

   ---- and it moves ----

   A scene is layers at different DEPTHS. `glow.tsx` already
   publishes the pointer's position over a surface as `--gpx` and
   `--gpy`, normalised to -1..1, so each layer translates against
   them by its own depth and the picture opens into a box rather
   than sitting flat on one.

   Both are multiplied by `--glow-a`, which is the material's own
   "the pointer is here" number: it is registered, it animates on
   the 190-in/820-out curve, and it is 0 at rest. So the parallax
   arrives with the light and eases back out behind it, with no
   second listener, no second piece of state, and no motion at all
   for a reader who has asked for none.

   ---- what belongs here ----

   A drawing is about a SUBJECT rather than about a page: the
   coins are money wherever money appears. `shared/nav.ts` names
   which subject each school, tool and desk wears, so the board,
   `/skills`, `/tools` and the reading hubs all draw the same card
   for the same thing from one table.
   ============================================================ */

import type { ReactNode } from "react";

/** The twelve, by what they are a picture OF. */
export type ArtSubject =
  | "chart" | "coins" | "sheets" | "book" | "pan" | "ridge"
  | "cards" | "arch" | "bubbles" | "gauge" | "calendar" | "plate";

/* Every subject stands on y = 300 of a 520 by 400 stage, which is
   what lets one frame hold any of them: the horizon and the
   reflection below are drawn against that line. */
const SUBJECTS: Record<ArtSubject, ReactNode> = {
  chart: (
    <>
    <defs>
    <linearGradient id="chart-cUp" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-hot)" stopOpacity=".9"/>
    <stop offset="1" stopColor="var(--art-mid)" stopOpacity=".38"/>
    </linearGradient>
    <linearGradient id="chart-cDown" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-sink)" stopOpacity=".92"/>
    <stop offset="1" stopColor="var(--art-sink)" stopOpacity=".7"/>
    </linearGradient>
    <linearGradient id="chart-area" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-fore-lit)" stopOpacity=".3"/>
    <stop offset="1" stopColor="var(--art-fore-lit)" stopOpacity="0"/>
    </linearGradient>
    </defs>
    <path d="M30 246 H490 M30 192 H490 M30 138 H490"
    stroke="var(--art-mid)" strokeOpacity="0.15" strokeWidth="1.2"/>
    <path d="M30 300 H490" stroke="var(--art-lit)" strokeOpacity="0.4" strokeWidth="1.6"/>
    <line x1="61" y1="242" x2="61" y2="278"
    stroke="var(--art-deep)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="46" y="250" width="30" height="18" rx="4"
    fill="url(#chart-cDown)"
    stroke="var(--art-deep)" strokeOpacity="0.5"
    strokeWidth="1.4"/>
    <line x1="121" y1="232" x2="121" y2="276"
    stroke="var(--art-lit)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="106" y="240" width="30" height="28" rx="4"
    fill="url(#chart-cUp)"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="1.4"/>
    <line x1="181" y1="232" x2="181" y2="262"
    stroke="var(--art-deep)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="166" y="240" width="30" height="12" rx="4"
    fill="url(#chart-cDown)"
    stroke="var(--art-deep)" strokeOpacity="0.5"
    strokeWidth="1.4"/>
    <line x1="241" y1="196" x2="241" y2="260"
    stroke="var(--art-lit)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="226" y="206" width="30" height="46" rx="4"
    fill="url(#chart-cUp)"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="1.4"/>
    <line x1="301" y1="198" x2="301" y2="228"
    stroke="var(--art-deep)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="286" y="206" width="30" height="10" rx="4"
    fill="url(#chart-cDown)"
    stroke="var(--art-deep)" strokeOpacity="0.5"
    strokeWidth="1.4"/>
    <line x1="361" y1="158" x2="361" y2="224"
    stroke="var(--art-lit)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="346" y="168" width="30" height="48" rx="4"
    fill="url(#chart-cUp)"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="1.4"/>
    <line x1="421" y1="112" x2="421" y2="176"
    stroke="var(--art-lit)" strokeOpacity="0.55" strokeWidth="1.6"/>
    <rect x="406" y="124" width="30" height="44" rx="4"
    fill="url(#chart-cUp)"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="1.4"/>
    <path d="M61 268 C 88 262, 96 244, 121 240 S 158 250, 181 252 S 214 214, 241 206 S 278 218, 301 216 S 338 178, 361 168 S 398 138, 421 124 L421 300 L61 300 Z" fill="url(#chart-area)"/>
    <path d="M61 268 C 88 262, 96 244, 121 240 S 158 250, 181 252 S 214 214, 241 206 S 278 218, 301 216 S 338 178, 361 168 S 398 138, 421 124" fill="none" stroke="var(--art-fore-hot)" strokeWidth="4.5"
    strokeLinecap="round"/>
    <path d="M392 108 L432 112 L428 152" fill="none" stroke="var(--art-fore-hot)"
    strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="421" cy="124" r="8.5" fill="var(--art-fore-hot)"/>
    <circle cx="421" cy="124" r="18" fill="none" stroke="var(--art-fore-lit)"
    strokeOpacity="0.5" strokeWidth="1.6"/>
    </>
  ),
  coins: (
    <>
    <defs>
    <linearGradient id="coins-face" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".42"/>
    <stop offset="1" stopColor="var(--art-deep)" stopOpacity=".3"/>
    </linearGradient>
    <linearGradient id="coins-faceTop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-fore-hot)" stopOpacity=".72"/>
    <stop offset="1" stopColor="var(--art-fore-mid)" stopOpacity=".42"/>
    </linearGradient>
    <linearGradient id="coins-side" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-mid)" stopOpacity=".34"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".85"/>
    </linearGradient>
    <linearGradient id="coins-sideTop" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-fore-mid)" stopOpacity=".5"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".8"/>
    </linearGradient>
    </defs>
    <path d="M56 288 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="110" cy="288" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M56 273 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="110" cy="273" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M56 258 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-sideTop)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="110" cy="258" rx="54" ry="17"
    fill="url(#coins-faceTop)"
    stroke="var(--art-hot)" strokeOpacity="0.95"
    strokeWidth="2"/>
    <ellipse cx="110" cy="258" rx="30" ry="9" fill="none"
    stroke="var(--art-hot)" strokeOpacity="0.55" strokeWidth="1.4"/>
    <path d="M196 288 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="250" cy="288" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M196 273 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="250" cy="273" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M196 258 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="250" cy="258" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M196 243 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="250" cy="243" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M196 228 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-sideTop)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="250" cy="228" rx="54" ry="17"
    fill="url(#coins-faceTop)"
    stroke="var(--art-hot)" strokeOpacity="0.95"
    strokeWidth="2"/>
    <ellipse cx="250" cy="228" rx="30" ry="9" fill="none"
    stroke="var(--art-hot)" strokeOpacity="0.55" strokeWidth="1.4"/>
    <path d="M338 288 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="288" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 273 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="273" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 258 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="258" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 243 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="243" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 228 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="228" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 213 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="213" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 198 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-side)"
    stroke="var(--art-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="198" rx="54" ry="17"
    fill="url(#coins-face)"
    stroke="var(--art-lit)" strokeOpacity="0.6"
    strokeWidth="1.4"/>
    <path d="M338 183 v13 a54 17 0 0 0 108 0 v-13 z"
    fill="url(#coins-sideTop)"
    stroke="var(--art-fore-mid)" strokeOpacity="0.5" strokeWidth="1.2"/>
    <ellipse cx="392" cy="183" rx="54" ry="17"
    fill="url(#coins-faceTop)"
    stroke="var(--art-fore-hot)" strokeOpacity="0.95"
    strokeWidth="2"/>
    <ellipse cx="392" cy="183" rx="30" ry="9" fill="none"
    stroke="var(--art-fore-hot)" strokeOpacity="0.55" strokeWidth="1.4"/>
    <path d="M392 150 V112 M374 128 L392 110 L410 128" fill="none" stroke="var(--art-fore-hot)"
    strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="462" cy="150" r="3.4" fill="var(--art-fore-hot)" fillOpacity=".85"/>
    <circle cx="318" cy="122" r="2.6" fill="var(--art-hot)" fillOpacity=".6"/>
    <circle cx="176" cy="176" r="3" fill="var(--art-hot)" fillOpacity=".45"/>
    </>
  ),
  sheets: (
    <>
    <defs>
    <linearGradient id="sheets-sheet" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".3"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".72"/>
    </linearGradient>
    <linearGradient id="sheets-sheetBack" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stopColor="var(--art-mid)" stopOpacity=".2"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".55"/>
    </linearGradient>
    <linearGradient id="sheets-bar" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-hot)" stopOpacity=".85"/>
    <stop offset="1" stopColor="var(--art-mid)" stopOpacity=".3"/>
    </linearGradient>
    </defs>
    <g transform="translate(214 54) skewY(-8)">
    <rect width="268" height="182" rx="12" fill="url(#sheets-sheetBack)"
    stroke="var(--art-mid)" strokeOpacity="0.35" strokeWidth="1.4"/>
    </g>
    <g transform="translate(150 92) skewY(-8)">
    <rect width="286" height="192" rx="12" fill="url(#sheets-sheetBack)"
    stroke="var(--art-lit)" strokeOpacity="0.4" strokeWidth="1.4"/>
    </g>
    <g transform="translate(74 128) skewY(-8)">
    <rect width="308" height="204" rx="14" fill="url(#sheets-sheet)"
    stroke="var(--art-fore-lit)" strokeOpacity="0.75" strokeWidth="2"/>
    <path d="M0 44 H308 M88 0 V204" stroke="var(--art-lit)" strokeOpacity="0.2"
    strokeWidth="1.3"/>
    <path d="M18 22 H62 M110 22 H160 M188 22 H228" stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="5" strokeLinecap="round"/>
    <path d="M18 74 H62 M18 106 H62 M18 138 H62 M18 170 H62" stroke="var(--art-lit)"
    strokeOpacity="0.28" strokeWidth="4.5" strokeLinecap="round"/>
    <rect x="112" y="132" width="17" height="44" rx="4" fill="url(#sheets-bar)"/>
    <rect x="148" y="108" width="17" height="68" rx="4" fill="url(#sheets-bar)"/>
    <rect x="184" y="142" width="17" height="34" rx="4" fill="url(#sheets-bar)"/>
    <rect x="220" y="88" width="17" height="88" rx="4" fill="url(#sheets-bar)"/>
    <rect x="256" y="122" width="17" height="54" rx="4" fill="url(#sheets-bar)"/>
    <path d="M120 124 C 146 116, 164 96, 192 100 S 240 74, 264 68" fill="none"
    stroke="var(--art-fore-hot)" strokeWidth="3.2" strokeLinecap="round"/>
    <circle cx="264" cy="68" r="6" fill="var(--art-fore-hot)"/>
    </g>
    </>
  ),
  book: (
    <>
    <defs>
    <linearGradient id="book-pageL" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".34"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".7"/>
    </linearGradient>
    <linearGradient id="book-pageR" x1="1" y1="0" x2="0.6" y2="1">
    <stop offset="0" stopColor="var(--art-fore-lit)" stopOpacity=".3"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".65"/>
    </linearGradient>
    <radialGradient id="book-spineGlow" cx="0.5" cy="0.5">
    <stop offset="0" stopColor="var(--art-fore-hot)" stopOpacity=".55"/>
    <stop offset="1" stopColor="var(--art-fore-hot)" stopOpacity="0"/>
    </radialGradient>
    </defs>
    <ellipse cx="260" cy="196" rx="120" ry="86" fill="url(#book-spineGlow)"/>
    <path d="M258 300 C 200 264, 128 252, 56 256 L56 128 C 128 124, 200 136, 258 172 Z"
    fill="url(#book-pageL)" stroke="var(--art-lit)" strokeOpacity="0.7" strokeWidth="2"/>
    <path d="M262 300 C 320 264, 392 252, 464 256 L464 128 C 392 124, 320 136, 262 172 Z"
    fill="url(#book-pageR)" stroke="var(--art-fore-lit)" strokeOpacity="0.8" strokeWidth="2"/>
    <path d="M260 172 V300" stroke="var(--art-fore-hot)" strokeOpacity="0.7" strokeWidth="2.4"/>
    <path d="M92 178 H210 M92 206 H200 M92 234 H210 M92 262 H178"
    stroke="var(--art-hot)" strokeOpacity="0.3" strokeWidth="5" strokeLinecap="round"/>
    <path d="M312 182 H428 M322 210 H428 M312 238 H418"
    stroke="var(--art-fore-hot)" strokeOpacity="0.34" strokeWidth="5" strokeLinecap="round"/>
    <path d="M260 104 L269 78 L295 69 L269 60 L260 34 L251 60 L225 69 L251 78 Z"
    fill="var(--art-fore-hot)"/>
    <circle cx="370" cy="80" r="3.2" fill="var(--art-hot)" fillOpacity=".75"/>
    <circle cx="150" cy="68" r="2.6" fill="var(--art-hot)" fillOpacity=".55"/>
    <path d="M150 68 L260 70 L370 80" stroke="var(--art-lit)" strokeOpacity="0.2"
    strokeWidth="1.4" fill="none"/>
    </>
  ),
  pan: (
    <>
    <defs>
    <linearGradient id="pan-panBody" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".5"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".9"/>
    </linearGradient>
    <radialGradient id="pan-panHeat" cx="0.5" cy="0.42">
    <stop offset="0" stopColor="var(--art-fore-hot)" stopOpacity=".6"/>
    <stop offset="1" stopColor="var(--art-fore-mid)" stopOpacity=".05"/>
    </radialGradient>
    </defs>
    <path d="M328 258 H452 a15 15 0 0 1 0 30 H328 Z" fill="url(#pan-panBody)"
    stroke="var(--art-lit)" strokeOpacity="0.55" strokeWidth="1.8"/>
    <ellipse cx="200" cy="272" rx="150" ry="48" fill="url(#pan-panBody)"
    stroke="var(--art-lit)" strokeOpacity="0.8" strokeWidth="2.4"/>
    <ellipse cx="200" cy="268" rx="124" ry="37" fill="url(#pan-panHeat)"
    stroke="var(--art-fore-lit)" strokeOpacity="0.45" strokeWidth="1.4"/>
    <path d="M156 226 C 128 190, 190 176, 162 136 S 190 90, 176 64" fill="none"
    stroke="var(--art-hot)" strokeOpacity="0.45" strokeWidth="4"
    strokeLinecap="round"/>
    <path d="M222 218 C 196 180, 254 166, 230 126 S 252 90, 242 68" fill="none"
    stroke="var(--art-fore-hot)" strokeOpacity="0.7" strokeWidth="5"
    strokeLinecap="round"/>
    <path d="M284 230 C 268 202, 310 190, 294 160" fill="none"
    stroke="var(--art-hot)" strokeOpacity="0.32" strokeWidth="3.4"
    strokeLinecap="round"/>
    <circle cx="162" cy="268" r="6" fill="var(--art-fore-hot)" fillOpacity=".85"/>
    <circle cx="228" cy="276" r="5" fill="var(--art-hot)" fillOpacity=".7"/>
    <circle cx="196" cy="282" r="4" fill="var(--art-fore-hot)" fillOpacity=".6"/>
    <circle cx="252" cy="262" r="3.4" fill="var(--art-hot)" fillOpacity=".5"/>
    </>
  ),
  ridge: (
    <>
    <defs>
    <linearGradient id="ridge-far" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-mid)" stopOpacity=".3"/>
    <stop offset="0.45" stopColor="var(--art-shade)" stopOpacity=".52"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".72"/>
    </linearGradient>
    <linearGradient id="ridge-mid" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".34"/>
    <stop offset="0.3" stopColor="var(--art-shade)" stopOpacity=".76"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".9"/>
    </linearGradient>
    <linearGradient id="ridge-near" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-fore-lit)" stopOpacity=".42"/>
    <stop offset="0.22" stopColor="var(--art-shade)" stopOpacity=".9"/>
    <stop offset="1" stopColor="var(--art-sink)" stopOpacity=".97"/>
    </linearGradient>
    <radialGradient id="ridge-moon" cx="0.42" cy="0.36">
    <stop offset="0" stopColor="var(--art-fore-hot)" stopOpacity=".85"/>
    <stop offset="1" stopColor="var(--art-fore-mid)" stopOpacity=".22"/>
    </radialGradient>
    </defs>
    <circle cx="398" cy="96" r="36" fill="url(#ridge-moon)" stroke="var(--art-fore-hot)"
    strokeOpacity="0.55" strokeWidth="1.8"/>
    <path d="M10 300 L104 166 L172 226 L246 150 L338 300 Z" fill="url(#ridge-far)"
    stroke="var(--art-mid)" strokeOpacity="0.32" strokeWidth="1.4"/>
    <path d="M148 300 L246 178 L318 240 L386 182 L488 300 Z" fill="url(#ridge-mid)"
    stroke="var(--art-lit)" strokeOpacity="0.5" strokeWidth="1.8"/>
    <path d="M-6 300 L118 202 L212 272 L288 214 L404 300 Z" fill="url(#ridge-near)"
    stroke="var(--art-fore-lit)" strokeOpacity="0.8" strokeWidth="2.4"/>
    <path d="M158 306 C 200 282, 184 256, 220 244 S 266 226, 288 214"
    fill="none" stroke="var(--art-fore-hot)" strokeOpacity="0.85" strokeWidth="3.2"
    strokeLinecap="round" strokeDasharray="2 13"/>
    <circle cx="288" cy="214" r="6" fill="var(--art-fore-hot)"/>
    <circle cx="452" cy="58" r="2.6" fill="var(--art-fore-hot)" fillOpacity=".7"/>
    <circle cx="318" cy="52" r="2" fill="var(--art-hot)" fillOpacity=".55"/>
    </>
  ),
  cards: (
    <>
    <defs>
    <linearGradient id="cards-cardBack" x1="0" y1="0" x2="0.4" y2="1">
    <stop offset="0" stopColor="var(--art-mid)" stopOpacity=".24"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".7"/>
    </linearGradient>
    <linearGradient id="cards-cardFront" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stopColor="var(--art-fore-lit)" stopOpacity=".38"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".82"/>
    </linearGradient>
    </defs>
    <g transform="rotate(-13 176 220)">
    <rect x="116" y="112" width="132" height="188" rx="16" fill="url(#cards-cardBack)"
    stroke="var(--art-lit)" strokeOpacity="0.4" strokeWidth="1.6"/>
    </g>
    <g transform="rotate(11 348 220)">
    <rect x="284" y="112" width="132" height="188" rx="16" fill="url(#cards-cardBack)"
    stroke="var(--art-lit)" strokeOpacity="0.45" strokeWidth="1.6"/>
    </g>
    <g transform="translate(0 -6)">
    <rect x="192" y="104" width="140" height="196" rx="18" fill="url(#cards-cardFront)"
    stroke="var(--art-fore-lit)" strokeOpacity="0.85" strokeWidth="2.2"/>
    <path d="M216 148 H308" stroke="var(--art-fore-hot)" strokeOpacity="0.85" strokeWidth="9"
    strokeLinecap="round"/>
    <path d="M216 186 H296 M216 214 H308 M216 242 H276" stroke="var(--art-hot)"
    strokeOpacity="0.32" strokeWidth="6" strokeLinecap="round"/>
    <circle cx="262" cy="276" r="7" fill="var(--art-fore-hot)" fillOpacity=".8"/>
    </g>
    <circle cx="418" cy="92" r="3" fill="var(--art-fore-hot)" fillOpacity=".7"/>
    <circle cx="126" cy="76" r="2.4" fill="var(--art-hot)" fillOpacity=".55"/>
    </>
  ),
  arch: (
    <>
    <defs>
    <linearGradient id="arch-archFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-fore-lit)" stopOpacity=".22"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".9"/>
    </linearGradient>
    <radialGradient id="arch-lampGlow" cx="0.5" cy="0.5">
    <stop offset="0" stopColor="var(--art-fore-hot)" stopOpacity=".75"/>
    <stop offset="1" stopColor="var(--art-fore-hot)" stopOpacity="0"/>
    </radialGradient>
    </defs>
    <ellipse cx="260" cy="214" rx="120" ry="118" fill="url(#arch-lampGlow)" opacity=".55"/>
    <path d="M176 300 V214 C 176 158, 214 122, 260 106 C 306 122, 344 158, 344 214 V300 Z"
    fill="url(#arch-archFill)" stroke="var(--art-lit)" strokeOpacity="0.8" strokeWidth="2.4"/>
    <path d="M206 300 V218 C 206 176, 232 150, 260 138 C 288 150, 314 176, 314 218 V300"
    fill="none" stroke="var(--art-fore-lit)" strokeOpacity="0.5" strokeWidth="1.6"/>
    <path d="M260 168 V206" stroke="var(--art-fore-hot)" strokeOpacity="0.7" strokeWidth="2"/>
    <path d="M248 206 h24 l-6 26 h-12 z" fill="var(--art-fore-hot)" fillOpacity=".7"
    stroke="var(--art-fore-hot)" strokeOpacity="0.95" strokeWidth="1.8"
    strokeLinejoin="round"/>
    <circle cx="260" cy="244" r="7" fill="var(--art-fore-hot)"/>
    <path d="M260 30 L272 62 L304 74 L272 86 L260 118 L248 86 L216 74 L248 62 Z"
    fill="var(--art-fore-hot)" fillOpacity=".8"/>
    <path d="M138 300 H382" stroke="var(--art-lit)" strokeOpacity="0.45" strokeWidth="2"/>
    <circle cx="392" cy="118" r="2.6" fill="var(--art-hot)" fillOpacity=".6"/>
    <circle cx="132" cy="150" r="2.2" fill="var(--art-fore-hot)" fillOpacity=".5"/>
    </>
  ),
  bubbles: (
    <>
    <defs>
    <linearGradient id="bubbles-bubFar" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stopColor="var(--art-mid)" stopOpacity=".3"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".72"/>
    </linearGradient>
    <linearGradient id="bubbles-bubNear" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stopColor="var(--art-fore-lit)" stopOpacity=".42"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".8"/>
    </linearGradient>
    </defs>
    <g>
    <path d="M262 92 h164 a26 26 0 0 1 26 26 v72 a26 26 0 0 1 -26 26 h-118
    l-30 26 v-26 h-16 a26 26 0 0 1 -26 -26 v-72 a26 26 0 0 1 26 -26 z"
    fill="url(#bubbles-bubFar)" stroke="var(--art-lit)" strokeOpacity="0.55" strokeWidth="2"/>
    <path d="M296 132 H418 M296 162 H392" stroke="var(--art-hot)" strokeOpacity="0.34"
    strokeWidth="6" strokeLinecap="round"/>
    </g>
    <g>
    <path d="M94 160 h164 a28 28 0 0 1 28 28 v78 a28 28 0 0 1 -28 28 h-104
    l-34 28 v-28 h-26 a28 28 0 0 1 -28 -28 v-78 a28 28 0 0 1 28 -28 z"
    fill="url(#bubbles-bubNear)" stroke="var(--art-fore-lit)" strokeOpacity="0.85" strokeWidth="2.4"/>
    <circle cx="140" cy="228" r="9" fill="var(--art-fore-hot)" fillOpacity=".9"/>
    <circle cx="176" cy="228" r="9" fill="var(--art-fore-hot)" fillOpacity=".65"/>
    <circle cx="212" cy="228" r="9" fill="var(--art-fore-hot)" fillOpacity=".4"/>
    </g>
    </>
  ),
  gauge: (
    <>
    <defs>
    <linearGradient id="gauge-dial" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".22"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".8"/>
    </linearGradient>
    </defs>
    <path d="M112 268 a148 148 0 0 1 296 0 z" fill="url(#gauge-dial)"
    stroke="var(--art-lit)" strokeOpacity="0.5" strokeWidth="2"/>
    <line x1="128.0" y1="268.0"
    x2="152.0" y2="268.0"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="3.4" strokeLinecap="round"/><line x1="134.5" y1="227.2"
    x2="147.8" y2="231.5"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="153.2" y1="190.4"
    x2="164.5" y2="198.6"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="182.4" y1="161.2"
    x2="190.6" y2="172.5"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="219.2" y1="142.5"
    x2="223.5" y2="155.8"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="260.0" y1="136.0"
    x2="260.0" y2="160.0"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="3.4" strokeLinecap="round"/><line x1="300.8" y1="142.5"
    x2="296.5" y2="155.8"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="337.6" y1="161.2"
    x2="329.4" y2="172.5"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="366.8" y1="190.4"
    x2="355.5" y2="198.6"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="385.5" y1="227.2"
    x2="372.2" y2="231.5"
    stroke="var(--art-lit)" strokeOpacity="0.35"
    strokeWidth="2" strokeLinecap="round"/><line x1="392.0" y1="268.0"
    x2="368.0" y2="268.0"
    stroke="var(--art-lit)" strokeOpacity="0.75"
    strokeWidth="3.4" strokeLinecap="round"/>
    <path d="M148 268 a112 112 0 0 1 82 -108" fill="none" stroke="var(--art-fore-hot)"
    strokeOpacity="0.9" strokeWidth="7" strokeLinecap="round"/>
    <path d="M260 268 L336 174" stroke="var(--art-fore-hot)" strokeWidth="7"
    strokeLinecap="round"/>
    <circle cx="260" cy="268" r="17" fill="var(--art-shade)" stroke="var(--art-fore-hot)"
    strokeWidth="3.4"/>
    <circle cx="260" cy="268" r="5" fill="var(--art-fore-hot)"/>
    <path d="M150 300 H370" stroke="var(--art-lit)" strokeOpacity="0.4" strokeWidth="2"/>
    </>
  ),
  calendar: (
    <>
    <defs>
    <linearGradient id="calendar-cal" x1="0" y1="0" x2="0.3" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".26"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".78"/>
    </linearGradient>
    </defs>
    <rect x="126" y="104" width="268" height="196" rx="20" fill="url(#calendar-cal)"
    stroke="var(--art-lit)" strokeOpacity="0.65" strokeWidth="2.2"/>
    <path d="M126 156 H394" stroke="var(--art-lit)" strokeOpacity="0.4" strokeWidth="1.8"/>
    <path d="M158 92 V126 M228 92 V126 M292 92 V126 M362 92 V126"
    stroke="var(--art-lit)" strokeOpacity="0.7" strokeWidth="7"
    strokeLinecap="round"/>
    <path d="M152 132 H236" stroke="var(--art-fore-hot)" strokeOpacity="0.75" strokeWidth="7"
    strokeLinecap="round"/>
    <rect x="150" y="176" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="196" y="176" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="242" y="176" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="288" y="176" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="334" y="176" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="150" y="216" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="196" y="216" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="242" y="216" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="288" y="216" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="334" y="216" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="150" y="256" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="196" y="256" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="242" y="256" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="288" y="256" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="334" y="256" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="150" y="296" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="196" y="296" width="34" height="28" rx="7"
    fill="var(--art-lit)"
    fillOpacity="0.42"
    stroke="var(--art-lit)"
    strokeOpacity="0.5" strokeWidth="1.4"/><rect x="242" y="296" width="34" height="28" rx="7"
    fill="var(--art-fore-hot)"
    fillOpacity="0.92"
    stroke="var(--art-fore-hot)"
    strokeOpacity="1" strokeWidth="1.4"/><rect x="288" y="296" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/><rect x="334" y="296" width="34" height="28" rx="7"
    fill="var(--art-shade)"
    fillOpacity="0.55"
    stroke="var(--art-lit)"
    strokeOpacity="0.22" strokeWidth="1.4"/>
    <path d="M296 256 l7 8 13 -16" fill="none" stroke="var(--art-sink)" strokeWidth="3.4"
    strokeLinecap="round" strokeLinejoin="round"/>
    </>
  ),
  plate: (
    <>
    <defs>
    <linearGradient id="plate-plate" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stopColor="var(--art-lit)" stopOpacity=".3"/>
    <stop offset="1" stopColor="var(--art-shade)" stopOpacity=".88"/>
    </linearGradient>
    </defs>
    <ellipse cx="260" cy="238" rx="152" ry="64" fill="url(#plate-plate)"
    stroke="var(--art-lit)" strokeOpacity="0.75" strokeWidth="2.4"/>
    <ellipse cx="260" cy="234" rx="118" ry="48" fill="none"
    stroke="var(--art-lit)" strokeOpacity="0.35" strokeWidth="1.6"/>
    <path d="M260 234 m-118 0 a118 48 0 0 1 118 -48 l0 48 z"
    fill="var(--art-fore-hot)" fillOpacity=".5"/>
    <path d="M260 234 m0 -48 a118 48 0 0 1 84 34 l-84 14 z"
    fill="var(--art-hot)" fillOpacity=".38"/>
    <path d="M260 234 l84 -14 a118 48 0 0 1 -84 62 z"
    fill="var(--art-fore-mid)" fillOpacity=".3"/>
    <path d="M260 234 L142 234 M260 234 L260 186 M260 234 L344 220"
    stroke="var(--art-sink)" strokeOpacity="0.55" strokeWidth="2.4"/>
    <path d="M330 150 c 34 -10 58 6 58 6 s -12 30 -44 34 c -22 3 -32 -8 -32 -8
    s 4 -26 18 -32 z" fill="var(--art-fore-lit)" fillOpacity=".45"
    stroke="var(--art-fore-hot)" strokeOpacity="0.8" strokeWidth="2"/>
    <path d="M300 202 c 24 -18 52 -28 78 -30" fill="none" stroke="var(--art-fore-hot)"
    strokeOpacity="0.7" strokeWidth="2"/>
    <path d="M116 300 H404" stroke="var(--art-lit)" strokeOpacity="0.35" strokeWidth="2"/>
    </>
  ),};

export const ART_SUBJECTS = Object.keys(SUBJECTS) as ArtSubject[];

/* ============================================================
   WHAT IS BEHIND THE SUBJECT

   Six motifs, not twelve. A drawing needs something behind it or
   it is a sticker on a gradient, but that something is about the
   KIND of thing the subject is rather than about the subject
   itself: money and bubbles both belong in a field of orbits, a
   ridge and a plate both sit against strata, and three of the
   four paper subjects share one wall of ruled edges.

   Twelve would have been twelve more drawings to keep in step for
   a layer rendered at 62% opacity behind a 1.1px blur, which is
   the definition of detail nobody can resolve. They carry no
   gradients, deliberately: an id in here would collide with the
   subject's own the moment both are on one page.
   ============================================================ */
type Motif = "grid" | "orbits" | "strata" | "rules" | "vault" | "plume";

const MOTIFS: Record<Motif, ReactNode> = {
  /* A back wall of rules, converging on the same vanishing point
     the floor does. For anything measured. */
  grid: (
    <>
    <path d="M96 40 L142 300 M186 30 L206 300 M276 26 L276 300 M366 30 L346 300 M456 40 L410 300"
    stroke="var(--art-deep)" strokeOpacity="0.5" strokeWidth="1.4"/>
    <path d="M40 96 H512 M28 158 H524 M20 218 H532"
    stroke="var(--art-deep)" strokeOpacity="0.34" strokeWidth="1.2"/>
    <path d="M8 300 H544" stroke="var(--art-mid)" strokeOpacity="0.4" strokeWidth="1.6"/>
    <circle cx="276" cy="300" r="3" fill="var(--art-mid)" fillOpacity="0.5"/>
    </>
  ),
  /* Rings around a centre, with a few bodies on them. For
     anything that accumulates or circulates. */
  orbits: (
    <>
    <ellipse cx="272" cy="216" rx="212" ry="86"
    stroke="var(--art-deep)" strokeOpacity="0.5" strokeWidth="1.4" fill="none"/>
    <ellipse cx="272" cy="216" rx="150" ry="60"
    stroke="var(--art-deep)" strokeOpacity="0.42" strokeWidth="1.3" fill="none"/>
    <ellipse cx="272" cy="216" rx="90" ry="36"
    stroke="var(--art-deep)" strokeOpacity="0.32" strokeWidth="1.2" fill="none"/>
    <circle cx="60" cy="216" r="5" fill="var(--art-mid)" fillOpacity="0.6"/>
    <circle cx="422" cy="176" r="4" fill="var(--art-mid)" fillOpacity="0.45"/>
    <circle cx="188" cy="256" r="3.4" fill="var(--art-lit)" fillOpacity="0.4"/>
    </>
  ),
  /* Distant ground, in bands. For anything with a landscape or a
     cross-section behind it. */
  strata: (
    <>
    <path d="M-20 214 L94 148 L176 194 L268 122 L352 178 L438 132 L540 190 L540 300 L-20 300 Z"
    fill="var(--art-deep)" fillOpacity="0.4"/>
    <path d="M-20 250 L82 206 L192 244 L286 196 L390 240 L482 204 L540 234 L540 300 L-20 300 Z"
    fill="var(--art-mid)" fillOpacity="0.24"/>
    <path d="M-20 214 L94 148 L176 194 L268 122 L352 178 L438 132 L540 190"
    stroke="var(--art-mid)" strokeOpacity="0.55" strokeWidth="1.5" fill="none"/>
    </>
  ),
  /* A wall of sheet edges, seen almost on. For anything made of
     pages. */
  rules: (
    <>
    <path d="M34 84 H486 M34 116 H486 M34 148 H430 M34 180 H486 M34 212 H392 M34 244 H486"
    stroke="var(--art-deep)" strokeOpacity="0.42" strokeWidth="1.3"/>
    <path d="M68 52 V300 M482 52 V300"
    stroke="var(--art-deep)" strokeOpacity="0.5" strokeWidth="1.4"/>
    <rect x="68" y="52" width="414" height="248" rx="10"
    stroke="var(--art-mid)" strokeOpacity="0.35" strokeWidth="1.5" fill="none"/>
    </>
  ),
  /* Nested arches, receding. For the one subject that is
     architecture. */
  vault: (
    <>
    <path d="M92 300 V196 A164 164 0 0 1 420 196 V300"
    stroke="var(--art-deep)" strokeOpacity="0.5" strokeWidth="1.5" fill="none"/>
    <path d="M136 300 V204 A120 120 0 0 1 376 204 V300"
    stroke="var(--art-deep)" strokeOpacity="0.4" strokeWidth="1.4" fill="none"/>
    <path d="M182 300 V212 A74 74 0 0 1 330 212 V300"
    stroke="var(--art-deep)" strokeOpacity="0.3" strokeWidth="1.3" fill="none"/>
    <path d="M18 300 H502" stroke="var(--art-mid)" strokeOpacity="0.4" strokeWidth="1.6"/>
    </>
  ),
  /* Something rising. For the one subject that is hot. */
  plume: (
    <>
    <path d="M198 274 C 176 220, 224 190, 200 132 C 184 96, 210 74, 206 44"
    stroke="var(--art-deep)" strokeOpacity="0.5" strokeWidth="2.4"
    fill="none" strokeLinecap="round"/>
    <path d="M266 282 C 244 214, 296 178, 268 116 C 250 76, 280 54, 274 22"
    stroke="var(--art-deep)" strokeOpacity="0.4" strokeWidth="2.6"
    fill="none" strokeLinecap="round"/>
    <path d="M334 276 C 316 224, 358 196, 338 148 C 324 114, 346 94, 342 66"
    stroke="var(--art-deep)" strokeOpacity="0.3" strokeWidth="2.2"
    fill="none" strokeLinecap="round"/>
    <path d="M40 300 H480" stroke="var(--art-mid)" strokeOpacity="0.34" strokeWidth="1.5"/>
    </>
  ),
};

/** Which wall each subject stands against. Grouped by what the
    subject IS rather than by which page it appears on, which is
    the same rule the subjects themselves follow. */
const MOTIF_OF: Record<ArtSubject, Motif> = {
  chart: "grid", gauge: "grid", calendar: "grid",
  coins: "orbits", bubbles: "orbits",
  ridge: "strata", plate: "strata",
  sheets: "rules", book: "rules", cards: "rules",
  arch: "vault", pan: "plume",
};

/** How big the frame is, which decides one number and no others.

    `band` is the 16:9 strip across the top of a card and is the
    ordinary case. `tile` is the little square on a compact row.
    `panel` is the featured card, where the picture is beside the
    words rather than above them.

    The layers, the depths and the drawing are identical in all
    three. What changes is `--art-throw`, because a subject that
    slides 26px inside an 84px thumbnail slides off its own
    floor. */
export type ArtSize = "band" | "tile" | "panel";

/** THE ROOM, with anything at all standing in it.

    Ten layers, and the order is the order they are in the room.
    They are all inside `.art-space` rather than being children of
    the frame, because the frame CLIPS and a clip flattens: the
    room has to turn inside something that is not turning, or
    there is nothing for it to turn against.

    `children` is the subject, rendered TWICE: once mirrored about
    the line every subject stands on, faded and blurred, which is
    the whole of what puts it on a floor rather than in the air.
    Rendered rather than cloned, because a clone of a node with a
    key is a second node with the same key and React says so.

    It takes a drawing rather than owning one so that a card with
    a picture of its OWN can stand in the same room: the seven
    case studies each carry a sparkline describing that model,
    which is a better picture than any of the twelve, and it
    belongs in a room like everything else.

    `aria-hidden`, always: the card's own title says what it is,
    and a drawing of a book beside the word "Insights" read out
    twice is a screen reader saying everything twice. */
export function Scene({ motif, size = "band", className, children }: {
  motif: Motif; size?: ArtSize; className?: string; children: ReactNode;
}) {
  return (
    <span className={["artwork", className].filter(Boolean).join(" ")}
          data-size={size === "band" ? undefined : size} aria-hidden="true">
      <span className="art-space">
        <span className="art-sky" />
        <span className="art-weave" />
        <span className="art-halo" />
        <span className="art-rays" />
        <span className="art-far">
          <svg className="art-svg" viewBox="0 0 520 400" fill="none">
            {MOTIFS[motif]}
          </svg>
        </span>
        <span className="art-floor" />
        <span className="art-stage">
          <span className="art-copy art-echo">{children}</span>
          <span className="art-copy art-real">{children}</span>
        </span>
        <span className="art-near" />
        <span className="art-spec" />
        <span className="art-veil" />
      </span>
    </span>
  );
}

/** The room with one of the twelve standing in it, which is what
    almost every card wants. */
export function CardArt({ subject, className, size = "band" }: {
  subject: ArtSubject; className?: string; size?: ArtSize;
}) {
  return (
    <Scene motif={MOTIF_OF[subject]} size={size}
           className={[`art-of-${subject}`, className].filter(Boolean).join(" ")}>
      <svg className="art-svg" viewBox="0 0 520 400" fill="none">{SUBJECTS[subject]}</svg>
    </Scene>
  );
}
