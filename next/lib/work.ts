/* ============================================================
   work.ts: the seven case studies, as rows rather than as markup.

   They were seven `<a class="cell work-card">` blocks written out
   in `/portfolio`, each carrying its own chart as inline SVG. The
   front page had to show them too, and copying the markup would
   have been the failure CLAUDE.md opens with: the portfolio index
   already said four while seven existed, for the same reason.

   IDENTITY COMES FROM `PAGES`, never from this file. The order,
   the URL, the title and the `kind` are read out of
   `shared/content.ts`, so publishing a case study is still one
   edit there and `COUNTS.caseStudies` still counts the same set.
   What is here is what a row cannot hold: the drawing, the three
   checkable facts, and the words on the button.

   A row in `PAGES` with no entry below still renders, without a
   chart. That is deliberate: a missing drawing is a quieter card,
   and a case study that is live and invisible is the bug this
   file exists to stop.
   ============================================================ */

import { PAGES } from "@reiad/shared/content";

/** The drawing, the facts and the words, for one case study.

    `spark` is the INSIDE of a `240x72` SVG, as a string, for the
    reason `shared/art-svg.ts` holds the twelve subjects that way:
    markup something other than React has to be able to read, and
    a second copy of a drawing is a drawing that will drift. Every
    class in it is painted from tokens in `@layer work`, so the
    charts follow the theme with the rest of the page. */
interface Drawing {
  /** The mono label above the title. */
  readonly chip: string;
  /** What pressing it does, written out. */
  readonly go: string;
  /** Three at most, one line each: horizon, sample size, method.
      The point of them is that an eye takes all three without
      reading, so a fourth is a fact too many. */
  readonly facts: readonly string[];
  /** One line for the front page, where there is no room for the
      paragraph `/portfolio` prints. Not the `blurb` in `PAGES`:
      that one is written for the search palette, where a reader
      has typed a word and wants to know which page they found. */
  readonly line: string;
  readonly spark: string;
}

const DRAWINGS: Record<string, Drawing> = {
  "/portfolio/three-statement": {
    chip: "Financial model",
    go: "Open the model",
    facts: ["FY24A to FY29E", "Three scenarios", "Live balance check"],
    line: "Income statement, balance sheet and cash flow, linked. Drag an "
      + "assumption and all three move, with a balance check that is computed "
      + "rather than asserted.",
    spark: `<line class="wa-grid" x1="10" y1="62" x2="230" y2="62" />
      <rect class="wa-bar" x="18" y="40" width="26" height="22" rx="2" />
      <rect class="wa-bar" x="56" y="34" width="26" height="28" rx="2" />
      <rect class="wa-bar" x="94" y="27" width="26" height="35" rx="2" />
      <rect class="wa-bar" x="132" y="21" width="26" height="41" rx="2" />
      <rect class="wa-bar" x="170" y="13" width="26" height="49" rx="2" />
      <path class="wa-line" d="M31,49 L69,43 L107,34 L145,30 L183,19" />
      <circle class="wa-dot" cx="183" cy="19" r="3.5" />`,
  },
  "/portfolio/dcf": {
    chip: "Valuation",
    go: "Open the valuation",
    facts: ["WACC built up, not typed in", "Two terminal methods", "Fed by the model above"],
    line: "A WACC built from its parts, two terminal value methods that quote "
      + "each other back, and a two-way grid where every cell is a full "
      + "revaluation.",
    spark: `<line class="wa-grid" x1="10" y1="62" x2="230" y2="62" />
      <rect class="wa-bar" x="18" y="31" width="22" height="31" rx="2" />
      <rect class="wa-bar" x="48" y="35" width="22" height="27" rx="2" />
      <rect class="wa-bar" x="78" y="39" width="22" height="23" rx="2" />
      <rect class="wa-bar" x="108" y="43" width="22" height="19" rx="2" />
      <rect class="wa-bar" x="138" y="46" width="22" height="16" rx="2" />
      <rect class="wa-bar-gold" x="176" y="17" width="42" height="45" rx="2" />
      <path class="wa-line-dash" d="M29,27 L149,42" />`,
  },
  "/portfolio/dsex": {
    chip: "Data analysis",
    go: "Open the analysis",
    facts: ["Six linked views", "Your CSV, parsed in the browser", "Demo series marked as simulated"],
    line: "Rolling volatility, drawdown episodes with their recovery times, "
      + "fat-tail diagnostics, and what happened to somebody who held for a "
      + "day, a year or five.",
    spark: `<rect class="wa-band" x="100" y="10" width="62" height="52" />
      <path class="wa-fill" d="M10,54 L44,45 L78,51 L112,33 L146,47 L180,28 L214,33 L230,17 L230,62 L10,62 Z" />
      <path class="wa-line" d="M10,54 L44,45 L78,51 L112,33 L146,47 L180,28 L214,33 L230,17" />
      <line class="wa-grid" x1="10" y1="62" x2="230" y2="62" />`,
  },
  "/portfolio/frontier": {
    chip: "Portfolio construction",
    go: "Open the fund",
    facts: ["Ten holdings, £10m", "Weighted 2015, held to 2020", "Computed from daily closes"],
    line: "Ten mid-cap holdings past a Shariah and sustainability screen, "
      + "weighted at the end of 2015 by minimising contributed variance, then "
      + "held unchanged through five years nobody had seen.",
    spark: `<line class="wa-grid" x1="10" y1="62" x2="230" y2="62" />
      <path class="wa-line" d="M24,55 C62,27 108,17 150,15 C186,14 210,17 226,21" />
      <circle class="wa-scatter" cx="52" cy="48" r="2.6" />
      <circle class="wa-scatter" cx="86" cy="39" r="2.6" />
      <circle class="wa-scatter" cx="104" cy="52" r="2.6" />
      <circle class="wa-scatter" cx="138" cy="34" r="2.6" />
      <circle class="wa-scatter" cx="176" cy="45" r="2.6" />
      <circle class="wa-scatter" cx="204" cy="36" r="2.6" />
      <circle class="wa-point" cx="150" cy="15" r="4" />`,
  },
  "/portfolio/scorecard": {
    chip: "Machine learning",
    go: "Fit the models",
    facts: ["Nothing precomputed", "Refits on every seed change", "Calibrated, then priced"],
    line: "The whole pipeline on a public dataset, fitted in your browser while "
      + "you read: a logistic scorecard against a boosted ensemble, and an "
      + "honest answer about which one wins.",
    spark: `<path class="wa-fill" d="M16,62 C58,28 108,18 224,12 L224,62 Z" />
      <line class="wa-line-dash" x1="16" y1="62" x2="224" y2="12" />
      <path class="wa-line" d="M16,62 C58,28 108,18 224,12" />
      <circle class="wa-point" cx="108" cy="21" r="4" />`,
  },
  "/portfolio/stress": {
    chip: "Credit risk",
    go: "Run the stress test",
    facts: ["Two engines, side by side", "IFRS 9 staging to CET1", "Reverse stress test"],
    line: "Unemployment, growth and rates driving default rates through two "
      + "engines at once, then provisions and capital. The gap between the "
      + "engines stays on the page, because that gap is the model risk.",
    spark: `<rect class="wa-band" x="92" y="6" width="68" height="56" />
      <line class="wa-grid" x1="10" y1="62" x2="230" y2="62" />
      <line class="wa-zero" x1="10" y1="54" x2="230" y2="54" />
      <path class="wa-line" d="M14,22 L58,25 L96,30 L126,47 L152,50 L188,40 L226,30" />
      <circle class="wa-point" cx="152" cy="50" r="4" />`,
  },
  "/portfolio/dissertation": {
    chip: "Empirical research",
    go: "Read the research",
    facts: ["220 UK equity funds", "19,577 fund-months", "Five-factor and Carhart"],
    line: "The hypothesis was that Shariah-compliant funds carry less risk. It "
      + "failed, and the power analysis then showed why a sample of three could "
      + "never have tested it.",
    spark: `<line class="wa-zero" x1="120" y1="8" x2="120" y2="64" />
      <line class="wa-ci" x1="52" y1="27" x2="198" y2="27" />
      <circle class="wa-point" cx="142" cy="27" r="4" />
      <line class="wa-ci" x1="74" y1="50" x2="178" y2="50" />
      <circle class="wa-point" cx="108" cy="50" r="4" />`,
  },
};

/** The long paragraph `/portfolio` prints under the title. Kept
    apart from `line` above because they answer two questions: one
    page has room to say how the thing works, the other has room
    to say what it is. */
const PARAGRAPHS: Record<string, string> = {
  "/portfolio/three-statement":
    "Linked income statement, balance sheet and cash flow, with a scenario "
    + "switch and a balance check that is computed rather than asserted: if the "
    + "model were wrong, it would say so. Drag any assumption and all three "
    + "statements, the charts and the credit metrics move with it.",
  "/portfolio/dcf":
    "WACC built up from its parts, two terminal value methods that quote each "
    + "other back, and a two-way grid on WACC and terminal growth where every "
    + "cell is a full revaluation and clicking one adopts it.",
  "/portfolio/dsex":
    "Rolling volatility, drawdown episodes with their recovery times, fat-tail "
    + "diagnostics against a normal curve, and what actually happened to "
    + "someone who held for a day, a year or five.",
  "/portfolio/frontier":
    "Ten mid-cap holdings past a Shariah and sustainability screen that runs "
    + "before any price is looked at, weighted at the end of 2015 by minimising "
    + "contributed variance, then held unchanged through five years nobody had "
    + "seen. The frontier and the optimised alternatives are solved beside it, "
    + "live.",
  "/portfolio/scorecard":
    "The whole pipeline on a real public dataset, fitted in your browser while "
    + "you read: split, encode, a logistic scorecard against a boosted "
    + "ensemble, cross-validation, calibration, and the cut-off where the "
    + "modelling stops and the lending decision starts. Including an honest "
    + "answer about which model wins.",
  "/portfolio/stress":
    "Unemployment, growth and rates driving default rates through a Merton "
    + "model and a vintage hazard model at once, then loss given default as an "
    + "option on the collateral, IFRS 9 staging, and the capital ratio. The gap "
    + "between the two engines stays on the page, because that gap is the model "
    + "risk.",
  "/portfolio/dissertation":
    "The hypothesis was that Shariah-compliant funds carry less risk. It "
    + "failed, and the power analysis then showed why a sample of three could "
    + "never have tested it. Every table and series on the page is the "
    + "submitted one.",
};

/** What a title reads as on a card, where the words "interactive
    case study" are already said by the section it is in.

    `short` in `PAGES` is written for the Ctrl+K palette, where a
    reader needs telling that the row is a case study; on a card
    under a heading that says so, the same words are the third
    time in one eyeful. */
const TITLES: Record<string, string> = {
  "/portfolio/three-statement": "Three-statement model: DSE-listed manufacturer",
  "/portfolio/dcf": "DCF with sensitivity tables",
  "/portfolio/dsex": "Index returns: volatility and drawdowns",
  "/portfolio/frontier": "A screened FTSE 250 fund, built in 2015 and held to 2020",
  "/portfolio/scorecard": "Probability of default: scorecard vs gradient boosting",
  "/portfolio/stress": "Portfolio stress testing: macro shocks to capital",
  "/portfolio/dissertation": "Islamic vs conventional funds: an MSc dissertation",
};

export interface Study {
  readonly url: string;
  readonly title: string;
  /** `model`, `analysis` or `research`, out of `PAGES`. It is the
      second half of the chip, so a reader can sort seven cards
      into three kinds without reading a word of the paragraphs. */
  readonly kind: string;
  readonly chip: string;
  readonly line: string;
  readonly paragraph: string;
  readonly facts: readonly string[];
  readonly go: string;
  readonly spark: string;
}

const KIND_WORDS: Record<string, string> = {
  model: "Financial model",
  analysis: "Analysis",
  research: "Research",
};

/** Every live case study, in the order `PAGES` lists them.

    The lead is first because the DCF is built on top of the
    three-statement model and reads better second, which is a fact
    about the work rather than about this list: `PAGES` already has
    them in that order. */
export const STUDIES: readonly Study[] = PAGES
  .filter((page) => page.group === "case" && !page.private)
  .map((page) => {
    const drawing = DRAWINGS[page.url];
    return {
      url: page.url,
      title: TITLES[page.url] ?? page.short ?? page.title,
      kind: KIND_WORDS[page.kind ?? ""] ?? "Case study",
      chip: drawing?.chip ?? "Case study",
      line: drawing?.line ?? page.blurb ?? "",
      paragraph: PARAGRAPHS[page.url] ?? page.blurb ?? "",
      facts: drawing?.facts ?? [],
      go: drawing?.go ?? "Open the case study",
      spark: drawing?.spark ?? "",
    };
  });
