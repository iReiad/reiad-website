#!/usr/bin/env node
/* ============================================================
   build-og.ts, renders the social share images.

   A 1200×630 PNG is what WhatsApp, LinkedIn, Facebook and X show
   when someone shares a link, and it's the first impression most
   people get of the site. Rather than design them in an image
   editor and let them drift from the site, this draws them with
   the site's own fonts and colours in a headless browser.

       node scripts/build-og.ts   # needs playwright available

   Output lands in aab/og/. Re-run it if the palette changes.

   ---- it lived in aab/, which is the directory it writes into ----

   A generator inside the directory it generates is a generator
   that gets uploaded: every file in `aab/` answers at a public
   URL, and only a line in `.assetsignore` was keeping this one
   off the site. It reached the four ladders through the BUILT
   `<school>/curriculum.js` rather than through the
   `shared/curricula/*.ts` those are written from, and nothing
   typechecked it. All three are fixed by living here, where
   `scripts/tsconfig.json` covers it and every other generator
   already is.
   ============================================================ */

import { globSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
/* The three numbers on these cards are COUNTS', never typed.
   `stock.png` said "38 ratios" for a model scoring 44 and nothing
   could see it: `check-content.ts` reads pages and this is a
   script, so it was the one copy of that sentence the sweep in
   CLAUDE.md's opening section never reached. */
import { COUNTS } from "../shared/content.ts";
import { bnNum } from "../shared/schools.ts";

import { chromium } from "playwright";

import { STAGES } from "../shared/curricula/money.ts";
import { STUFEN } from "../shared/curricula/deutsch.ts";
import { DHAPS } from "../shared/curricula/quran.ts";
import { TERMS } from "../shared/curricula/english.ts";

/* `document` below is the PAGE's, not node's: the two callbacks
   handed to `evaluate()` are serialised and run inside the
   browser. Declared here rather than by pulling the DOM lib into
   `scripts/tsconfig.json`, because that config covers every check
   in this directory and a check that can name `document` and
   still typecheck is a check that fails under node. Two fields,
   and this is the only file that wants them. */
declare const document: {
  fonts: { ready: Promise<unknown>; size: number };
};

/* `aab/` is what the site is uploaded from, so that is where the
   cards go and that is where the pages this repoints live. */
const AAB = join(dirname(fileURLToPath(import.meta.url)), "..", "aab");
const OUT = join(AAB, "og");
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------
   Two flags, both for the same hazard: this script overwrites
   every PNG in og/, and a card rendered without the site's
   webfonts is a card in Arial. Somewhere with no route to
   fonts.googleapis.com, a locked-down CI box, a sandbox, an
   innocent run silently replaces twenty good images with bad
   ones.

     --only=<substring>   render just the cards whose file name
                          contains it, and leave the rest alone
     --fonts=<file.css>   inline this CSS instead of fetching from
                          Google. Give it @font-face rules whose
                          src is a data: URL and the render needs
                          no network at all

   Pointing the pages at their cards runs either way: it touches
   no network and is idempotent.
   ------------------------------------------------------------ */
const flag = (name: string): string | undefined =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const ONLY = flag("only");
const FONT_CSS = flag("fonts");

/** One share card. `bn` picks the Bangla faces and the Bangla
    line height; everything else is the same slab of text. */
interface Card {
  file: string;
  eyebrow: string;
  title: string;
  sub: string;
  bn?: boolean;
}

/* Spelled out, because a card reads as prose. Anything outside
   the table falls back to the numeral rather than to a wrong word. */
const WORD: Record<number, string> = {
  3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight",
};

const CARDS: Card[] = [
  { file: "default.png", eyebrow: "reiad.co.uk", title: "Bangladesh's markets, explained in the language we speak.",
    sub: "Plain-Bangla investment education · financial modeling · analysis" },
  /* The title was `টাকার ভাষা, আমাদের ভাষায়।`, which was the front
     door's headline until the door started describing the site
     rather than selling it. Nothing tied the two, so this went on
     saying the slogan after the door stopped. */
  { file: "learn.png", eyebrow: "শেখার লাইব্রেরি · Learn hub",
    title: "প্রতিটা কোর্স একদম শুরু থেকে, ব্যাখ্যা বাংলায়।",
    sub: `শেয়ার · সঞ্চয়পত্র · মিউচুয়াল ফান্ড · চক্রবৃদ্ধি: ${bnNum(COUNTS.terms)}টি টার্ম, সহজ বাংলায়`,
    bn: true },
  { file: "tools.png", eyebrow: "Tools · ক্যালকুলেটর",
    title: `The ${WORD[COUNTS.calculators] ?? COUNTS.calculators} sums worth doing before you decide anything.`,
    sub: "Compounding · সঞ্চয়পত্র vs FDR · inflation · EMI · position sizing" },
  { file: "insights.png", eyebrow: "Insights", title: "Notes on markets, written to be understood.",
    sub: "Explainers, analysis, and an auto-updating pulse of what matters" },

  /* Everything below used to share default.png. A link to the DCF
     and a link to the contact form previewed identically, which
     wastes the one thing a shared link gets to say for itself. */
  { file: "stock.png", eyebrow: "Tools · advanced", title: "Should you buy, hold or sell this share?",
    sub: `${COUNTS.ratios} ratios · ${WORD[COUNTS.pillars] ?? COUNTS.pillars} pillars`
      + " · a verdict that shows its own arithmetic · English or বাংলা" },
  { file: "portfolio.png", eyebrow: "Portfolio & services", title: "Models you can open and take apart.",
    sub: "Three-statement modelling · DCF · index analysis · live, in the browser" },
  { file: "three-statement.png", eyebrow: "Case study · Financial modelling",
    title: "A model whose balance sheet actually balances.",
    sub: "Linked income statement, balance sheet and cash flow, with a revolver and a scenario switch" },
  { file: "dcf.png", eyebrow: "Case study · Valuation",
    title: "A DCF that shows its working.",
    sub: "WACC built from its parts · two terminal value methods · a live sensitivity grid" },
  { file: "dsex.png", eyebrow: "Case study · Data analysis",
    title: "What volatility and drawdowns teach about holding periods.",
    sub: "Rolling volatility · drawdown episodes · fat tails · bring your own CSV" },
  { file: "frontier.png", eyebrow: "Case study · Portfolio construction",
    title: "Ten holdings, five years, half the market's beta.",
    sub: "Screened FTSE 250 fund · built on 2015 · held to 2020 · every figure recomputed live" },
  { file: "scorecard.png", eyebrow: "Case study · Machine learning",
    title: "Does the clever model actually win?",
    sub: "Logistic scorecard vs gradient boosting · fitted in the browser · cross-validated · calibrated" },
  { file: "stress.png", eyebrow: "Case study · Credit risk",
    title: "What a recession does to a loan book.",
    sub: "Merton and vintage analysis side by side · IFRS 9 provisions · the capital ratio · reverse stress testing" },
  { file: "dissertation.png", eyebrow: "Case study · Empirical research",
    title: "Are Islamic funds really lower risk?",
    sub: "220 UK funds · 19,577 fund-months · five-factor models · and what three funds could actually detect" },
  { file: "contents.png", eyebrow: "সব বিষয় · Full contents", title: "প্রতিটা লেখা, এক পাতায়।",
    sub: "আট ধাপের সবকিছু, সাথে ইংরেজি বর্ণানুক্রমে শব্দকোষ", bn: true },
  { file: "about.png", eyebrow: "About", title: "Chittagong economics to Brighton risk management.",
    sub: "Why this site exists, and who is writing it" },
  { file: "contact.png", eyebrow: "Contact", title: "For recruiters, clients and readers.",
    sub: "Financial modelling, analysis and writing, or just a question" },
  { file: "colophon.png", eyebrow: "Colophon", title: "Every technical decision, written down.",
    sub: "How this site is built, and why each choice was made" },

  /* One per stage, so a shared lesson previews as the stage it
     belongs to rather than as the whole library. Read from
     curriculum.js, so a renamed stage renames its card too. */
  ...STAGES.map((st) => ({
    file: `stage-${st.slug}.png`,
    eyebrow: `${st.kicker} · শেখার লাইব্রেরি`,
    title: st.bn,
    sub: (st.blurb ?? st.en ?? "").slice(0, 150),
    bn: true,
  })),

  /* The German school. Without these every /deutsch/ link, the
     hub, four Stufen, fourteen Teile and the practice book,
     previewed as the site's generic card, which says nothing
     about German at all. Same rule as the stages: one per Stufe,
     so a shared Teil previews as the Stufe it belongs to. */
  { file: "skills.png", eyebrow: "দক্ষতা · Skills",
    title: "টাকা ছাড়া বাকি যা কিছু।",
    sub: "জার্মান · কুরআন · ইংরেজি · রান্না · ভ্রমণ · রিভিউ", bn: true },
  { file: "deutsch.png", eyebrow: "জার্মান · Deutsch von Herzen",
    title: "মন থেকে জার্মান।",
    sub: "শব্দ মুখস্থ নয়, কাঠামো · চারটা স্তর · রোজ একটা পাতার অনুশীলন", bn: true },
  /* One card for all three practice books. They differ in length,
     not in kind, and a card naming a day count would be wrong on
     two of the three pages that use it. */
  { file: "deutsch-arbeitsbuch.png", eyebrow: "Das Arbeitsbuch · অনুশীলন",
    title: "দিনে একটা পাতা।",
    sub: "একটা ছাঁচ · পাঁচটা নমুনা · নিজের আটটা বাক্য · একটা সত্যি অনুচ্ছেদ", bn: true },
  ...STUFEN.map((st) => ({
    file: `deutsch-${st.slug}.png`,
    eyebrow: `${st.kicker} · ${st.de}`,
    title: st.bn,
    sub: (st.blurb ?? "").slice(0, 150),
    bn: true,
  })),

  /* The Quranic Arabic school, same arrangement again: a hub card
     and one per ধাপ, so a shared day previews as the stage it
     belongs to rather than as the site's generic card. The names
     are written in Bangla only. Arabic would need a fourth webfont
     in the renderer for four words, and the card is read by people
     deciding whether to tap a link, not by people reading Arabic. */
  { file: "quran.png", eyebrow: "কুরআনের আরবি · Qur'anic Arabic",
    title: "যা পড়ছেন, তা বোঝার জন্য।",
    sub: "ষাট দিন · রোজ আধ ঘণ্টা · কোনো লেখা নেই, শুধু পড়া আর বলা", bn: true },
  ...DHAPS.map((dh) => ({
    file: `quran-${dh.slug}.png`,
    eyebrow: `${dh.kicker} · কুরআনের আরবি`,
    title: dh.bn,
    sub: (dh.blurb ?? "").slice(0, 150),
    bn: true,
  })),

  /* The English school, the same arrangement a third time: a hub
     card, one per term, and one for the practice book. */
  { file: "english.png", eyebrow: "মন থেকে ইংরেজি · English From The Heart",
    title: "মুখস্থ নয়। কাঠামো।",
    sub: "দুই টার্ম · রোজ এক ঘণ্টা · অর্ধেকটা মুখে বলা", bn: true },
  { file: "english-workbook.png", eyebrow: "The 30-day workbook · অনুশীলন",
    title: "দিনে একটা পাতা।",
    sub: "একটা কাঠামো · পাঁচটা নমুনা · নিজের আটটা বাক্য · একটা সত্যি অনুচ্ছেদ", bn: true },
  /* The kitchen. One card for the whole of it: the pieces differ
     in ingredient, not in kind, and a card naming an onion would
     be wrong on the next piece that lands. */
  { file: "cooking.png", eyebrow: "রান্নাঘর · Cooking",
    title: "রেসিপি নয়, রান্নাটা।",
    sub: "একটা করে উপকরণ · কেন, শুধু কীভাবে নয় · সময়ের সৎ হিসাব", bn: true },
  /* The travel desk, on the same reasoning as the kitchen above:
     one card for the section, because a card naming one visa would
     be wrong on the next piece. */
  { file: "travel.png", eyebrow: "ভ্রমণ · Travel",
    title: "কাগজপত্র আগে, উত্তেজনা পরে।",
    sub: "একটা করে যাত্রা · কী কী লাগে · কত সময় আর কত খরচ", bn: true },
  ...TERMS.map((t) => ({
    file: `english-${t.slug}.png`,
    eyebrow: `${t.kicker} · ${t.en}`,
    title: t.bn,
    sub: (t.blurb ?? "").slice(0, 150),
    bn: true,
  })),
];

/* ------------------------------------------------------------
   Which page gets which card. First match wins, so the specific
   routes come before the folder-wide ones. Kept here, next to the
   cards themselves, so adding an image and pointing pages at it is
   one edit rather than two that can drift apart.
   ------------------------------------------------------------ */
/** A page pattern and the card it gets. Order matters: the first
    match wins, so a workbook rule has to come before the term
    rule that would otherwise claim it. */
type Assignment = [RegExp, string];

const ASSIGN: Assignment[] = [
  [/^tools\/stock\.html$/, "stock.png"],
  [/^tools\//, "tools.png"],
  [/^portfolio\/three-statement\.html$/, "three-statement.png"],
  [/^portfolio\/dcf\.html$/, "dcf.png"],
  [/^portfolio\/dsex\.html$/, "dsex.png"],
  [/^portfolio\/frontier\.html$/, "frontier.png"],
  [/^portfolio\/scorecard\.html$/, "scorecard.png"],
  [/^portfolio\/stress\.html$/, "stress.png"],
  [/^portfolio\/dissertation\.html$/, "dissertation.png"],
  [/^portfolio\.html$/, "portfolio.png"],
  [/^money\/contents\.html$/, "contents.png"],
  [/^money\/index\.html$/, "learn.png"],
  ...STAGES.map((st): Assignment => [
    st.slug === "basics-1"
      ? /^money\/(basics-1|terms)\//
      : new RegExp(`^money\\/${st.slug}\\/`),
    `stage-${st.slug}.png`,
  ]),
  [/^money\//, "learn.png"],
  [/^skills\//, "skills.png"],
  /* Every practice book, before the per-Stufe rule below, which
     would otherwise claim them for their Stufe's card. This has
     to agree with the `og` the German book's route renders into the
     workbook pages, or the two generators take turns overwriting
     each other's tags. */
  ...STUFEN.flatMap((st) => (st.workbook ? [[
    new RegExp(`^deutsch\\/${st.slug}\\/${st.workbook.slug}\\.html$`),
    "deutsch-arbeitsbuch.png",
  ] as Assignment] : [])),
  [/^deutsch\/index\.html$/, "deutsch.png"],
  ...STUFEN.map((st): Assignment => [
    new RegExp(`^deutsch\\/${st.slug}\\/`),
    `deutsch-${st.slug}.png`,
  ]),
  [/^deutsch\//, "deutsch.png"],
  /* The Quran school. Same order as the German block above: the
     hub first, then one rule per ধাপ, then a catch-all so a page
     added under /quran/ later still previews as the school. */
  [/^quran\/index\.html$/, "quran.png"],
  ...DHAPS.map((dh): Assignment => [
    new RegExp(`^quran\\/${dh.slug}\\/`),
    `quran-${dh.slug}.png`,
  ]),
  [/^quran\//, "quran.png"],
  /* The English school. The workbook first, before the per-term
     rule that would otherwise claim it, then the hub, then one
     rule per term, then a catch-all. These have to agree with the
     `og` values the English book's route renders. */
  ...TERMS.flatMap((t) => (t.workbook ? [[
    new RegExp(`^english\\/${t.slug}\\/${t.workbook.slug}\\.html$`),
    "english-workbook.png",
  ] as Assignment] : [])),
  [/^english\/index\.html$/, "english.png"],
  ...TERMS.map((t): Assignment => [
    new RegExp(`^english\\/${t.slug}\\/`),
    `english-${t.slug}.png`,
  ]),
  [/^english\//, "english.png"],
  [/^cooking\//, "cooking.png"],
  [/^travel\//, "travel.png"],
  [/^insights/, "insights.png"],
  [/^about\.html$/, "about.png"],
  [/^contact\.html$/, "contact.png"],
  [/^colophon\.html$/, "colophon.png"],
];

const cardFor = (rel: string): string =>
  ASSIGN.find(([re]) => re.test(rel))?.[1] ?? "default.png";

const FONTS = FONT_CSS
  ? `<style>${readFileSync(FONT_CSS, "utf8")}</style>`
  : `<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+Bengali:wght@600&family=Noto+Sans+Bengali:wght@400&display=swap" rel="stylesheet">`;

const page = (card: Card): string => `<!doctype html><meta charset="utf-8">
${FONTS}
<style>
  * { margin: 0; box-sizing: border-box; }
  body {
    width: 1200px; height: 630px; overflow: hidden;
    background: #0B3B29;
    color: #E8EEE8;
    font-family: "IBM Plex Mono", monospace;
    padding: 72px 80px;
    display: flex; flex-direction: column; justify-content: space-between;
    position: relative;
  }
  /* graph paper, same as the site's hero */
  body::before {
    content: ""; position: absolute; inset: 0;
    background:
      linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
    background-size: 60px 60px;
    -webkit-mask-image: radial-gradient(ellipse 80% 90% at 25% 10%, #000, transparent 72%);
  }
  .taka {
    position: absolute; right: -40px; bottom: -140px;
    font-family: "Spectral", serif; font-size: 460px;
    color: rgba(255,255,255,.05); line-height: 1;
  }
  .row { display: flex; align-items: center; gap: 14px; position: relative; }
  .eyebrow { color: #C9A24B; font-size: 22px; letter-spacing: .12em; text-transform: uppercase; }
  h1 {
    position: relative;
    font-family: ${card.bn ? '"Noto Serif Bengali", serif' : '"Spectral", serif'};
    font-weight: ${card.bn ? 600 : 500};
    font-size: ${card.bn ? 74 : 68}px; line-height: 1.14;
    max-width: 20ch; text-wrap: balance;
  }
  p.sub {
    position: relative;
    font-family: ${card.bn ? '"Noto Sans Bengali", sans-serif' : '"IBM Plex Mono", monospace'};
    font-size: 24px; color: #9FB8A8; max-width: 44ch; line-height: 1.5;
  }
  .foot { display: flex; align-items: baseline; justify-content: space-between; position: relative; }
  .name { font-family: "Spectral", serif; font-size: 30px; color: #fff; }
  .url { font-size: 22px; color: #9FB8A8; letter-spacing: .08em; }
  svg { width: 34px; height: 34px; }
</style>
<div class="taka">৳</div>
<div class="row">
  <svg viewBox="0 0 100 100" fill="none">
    <rect x="22" y="58" width="10" height="20" rx="3" fill="#4CB98A"/>
    <rect x="40" y="46" width="10" height="32" rx="3" fill="#4CB98A"/>
    <rect x="58" y="32" width="10" height="46" rx="3" fill="#4CB98A"/>
    <circle cx="63" cy="24" r="5.5" fill="#C9A24B"/>
  </svg>
  <span class="eyebrow">${card.eyebrow}</span>
</div>
<div>
  <h1>${card.title}</h1>
  <p class="sub" style="margin-top:24px">${card.sub}</p>
</div>
<div class="foot">
  <span class="name">Reiad's Library</span>
  <span class="url">reiad.co.uk</span>
</div>`;

/* The sandbox ships a full Chromium at PLAYWRIGHT_BROWSERS_PATH but
   no headless-shell build, which is what launch() reaches for by
   default. Point it at the binary that is actually there. */
const browser = await chromium.launch(
  process.env.PW_CHROMIUM ? { executablePath: process.env.PW_CHROMIUM } : {});
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const tab = await context.newPage();

const wanted = ONLY ? CARDS.filter((c) => c.file.includes(ONLY)) : CARDS;
if (ONLY) console.log(`--only=${ONLY}: ${wanted.length} of ${CARDS.length} card(s)\n`);

for (const card of wanted) {
  await tab.setContent(page(card), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  /* A card in the wrong typeface is worse than no new card, and
     silent is how that ships. Say so, and write nothing. */
  if (!(await tab.evaluate(() => document.fonts.size))) {
    console.error(
      `\nNo webfonts loaded, og/${card.file} would render in the fallback face.\n` +
      "Nothing written. Run this where fonts.googleapis.com is reachable, or\n" +
      "pass --fonts=<file.css> holding @font-face rules with data: URLs.");
    await browser.close();
    process.exit(1);
  }
  await tab.screenshot({ path: join(OUT, card.file) });
  console.log("wrote og/" + card.file);
}

await browser.close();

/* ------------------------------------------------------------
   Point every page at its card.
   ------------------------------------------------------------ */
const files = globSync("**/*.html", { cwd: AAB })
  .filter((f) => !f.startsWith("og/") && f !== "offline.html");

/* Pages that are nobody's business to share. The list matches
   the Disallow block in robots.txt, desk.html was in one and not
   the other, so a run quietly gave the admin desk a share card.
   Only files are walked here, so a private page that is a ROUTE
   never reaches this loop: `/admin` says `robots: index: false`
   in its own metadata, which is where the desk's entry went when
   it retired on 21 August 2026. */
const PRIVATE = new Set([
  "studio/index.html", "offline.html",
  "insights/_template.html",
]);

const esc = (t: string): string => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;")
  .replace(/</g, "&lt;").replace(/>/g, "&gt;");

let pointed = 0;
let added = 0;
for (const rel of files) {
  if (PRIVATE.has(rel)) continue;
  const abs = join(AAB, rel);
  const html = readFileSync(abs, "utf8");
  const want = `https://reiad.co.uk/og/${cardFor(rel)}`;

  if (html.includes('property="og:image"')) {
    const next = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${want}$2`);
    if (next !== html) { writeFileSync(abs, next); pointed++; }
    continue;
  }

  /* No card at all. Every term page was in this state, eighteen of
     the most linkable pages on the site previewing as a bare URL.
     Build the whole block from what the page already declares, so
     the preview says the same thing as the page. */
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim() ?? "Reiad's Library";
  const desc = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim() ?? "";
  const canonical = html.match(/<link rel="canonical" href="([^"]*)"/)?.[1]
    ?? `https://reiad.co.uk/${rel}`;

  const block = [
    `  <meta property="og:type" content="article">`,
    `  <meta property="og:title" content="${esc(title)}">`,
    desc ? `  <meta property="og:description" content="${esc(desc)}">` : null,
    `  <meta property="og:url" content="${esc(canonical)}">`,
    `  <meta property="og:image" content="${want}">`,
    `  <meta property="og:image:width" content="1200">`,
    `  <meta property="og:image:height" content="630">`,
    `  <meta property="og:site_name" content="Reiad's Library">`,
    `  <meta name="twitter:card" content="summary_large_image">`,
  ].filter(Boolean).join("\n");

  const next = html.replace("</head>", `${block}\n</head>`);
  if (next !== html) { writeFileSync(abs, next); added++; }
}
console.log(`\n${pointed} page(s) repointed, ${added} given a share card for the first time (${files.length} scanned)`);
