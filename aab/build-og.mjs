#!/usr/bin/env node
/* ============================================================
   build-og.mjs — renders the social share images.

   A 1200×630 PNG is what WhatsApp, LinkedIn, Facebook and X show
   when someone shares a link, and it's the first impression most
   people get of the site. Rather than design them in an image
   editor and let them drift from the site, this draws them with
   the site's own fonts and colours in a headless browser.

       node aab/build-og.mjs      # needs playwright available

   Output lands in aab/og/. Re-run it if the palette changes.
   ============================================================ */

import { mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync, writeFileSync } from "node:fs";
import { globSync } from "node:fs";
import { chromium } from "playwright";
import { STAGES } from "./learn/curriculum.js";
import { STUFEN } from "./deutsch/curriculum.js";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "og");
mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------
   Two flags, both for the same hazard: this script overwrites
   every PNG in og/, and a card rendered without the site's
   webfonts is a card in Arial. Somewhere with no route to
   fonts.googleapis.com — a locked-down CI box, a sandbox — an
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
const flag = (name) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");
const ONLY = flag("only");
const FONT_CSS = flag("fonts");

const CARDS = [
  { file: "default.png", eyebrow: "reiad.co.uk", title: "Bangladesh's markets, explained in the language we speak.",
    sub: "Plain-Bangla investment education · financial modeling · analysis" },
  { file: "learn.png", eyebrow: "শেখার লাইব্রেরি · Learn hub", title: "টাকার ভাষা, আমাদের ভাষায়।",
    sub: "শেয়ার · সঞ্চয়পত্র · মিউচুয়াল ফান্ড · চক্রবৃদ্ধি: ১৮টি টার্ম, সহজ বাংলায়", bn: true },
  { file: "tools.png", eyebrow: "Tools · ক্যালকুলেটর", title: "The five sums worth doing before you decide anything.",
    sub: "Compounding · সঞ্চয়পত্র vs FDR · inflation · EMI · position sizing" },
  { file: "insights.png", eyebrow: "Insights", title: "Notes on markets, written to be understood.",
    sub: "Explainers, analysis, and an auto-updating pulse of what matters" },

  /* Everything below used to share default.png. A link to the DCF
     and a link to the contact form previewed identically, which
     wastes the one thing a shared link gets to say for itself. */
  { file: "stock.png", eyebrow: "Tools · advanced", title: "Should you buy, hold or sell this share?",
    sub: "38 ratios · six pillars · a verdict that shows its own arithmetic · English or বাংলা" },
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

  /* The German school. Without these every /deutsch/ link — the
     hub, four Stufen, fourteen Teile and the practice book —
     previewed as the site's generic card, which says nothing
     about German at all. Same rule as the stages: one per Stufe,
     so a shared Teil previews as the Stufe it belongs to. */
  { file: "skills.png", eyebrow: "দক্ষতা · Skills",
    title: "টাকা ছাড়া বাকি যা কিছু।",
    sub: "জার্মান · কুরআন · ইংরেজি · রান্না · ভ্রমণ · রিভিউ", bn: true },
  { file: "deutsch.png", eyebrow: "জার্মান · Deutsch von Herzen",
    title: "মন থেকে জার্মান।",
    sub: "শব্দ মুখস্থ নয়, কাঠামো · চারটা স্তর · রোজ একটা পাতার অনুশীলন", bn: true },
  { file: "deutsch-arbeitsbuch.png", eyebrow: "Das 30-Tage-Arbeitsbuch · অনুশীলন",
    title: "দিনে একটা পাতা।",
    sub: "একটা ছাঁচ · পাঁচটা নমুনা · নিজের আটটা বাক্য · একটা সত্যি অনুচ্ছেদ", bn: true },
  ...STUFEN.map((st) => ({
    file: `deutsch-${st.slug}.png`,
    eyebrow: `${st.kicker} · ${st.de}`,
    title: st.bn,
    sub: (st.blurb ?? "").slice(0, 150),
    bn: true,
  })),
];

/* ------------------------------------------------------------
   Which page gets which card. First match wins, so the specific
   routes come before the folder-wide ones. Kept here, next to the
   cards themselves, so adding an image and pointing pages at it is
   one edit rather than two that can drift apart.
   ------------------------------------------------------------ */
const ASSIGN = [
  [/^tools\/stock\.html$/, "stock.png"],
  [/^tools\//, "tools.png"],
  [/^portfolio\/three-statement\.html$/, "three-statement.png"],
  [/^portfolio\/dcf\.html$/, "dcf.png"],
  [/^portfolio\/dsex\.html$/, "dsex.png"],
  [/^portfolio\/dissertation\.html$/, "dissertation.png"],
  [/^portfolio\.html$/, "portfolio.png"],
  [/^learn\/contents\.html$/, "contents.png"],
  [/^learn\/index\.html$/, "learn.png"],
  ...STAGES.map((st) => [
    st.slug === "basics-1"
      ? /^learn\/(basics-1|terms)\//
      : new RegExp(`^learn\\/${st.slug}\\/`),
    `stage-${st.slug}.png`,
  ]),
  [/^learn\//, "learn.png"],
  [/^skills\//, "skills.png"],
  [/^deutsch\/stufe-1\/arbeitsbuch\.html$/, "deutsch-arbeitsbuch.png"],
  [/^deutsch\/index\.html$/, "deutsch.png"],
  ...STUFEN.map((st) => [
    new RegExp(`^deutsch\\/${st.slug}\\/`),
    `deutsch-${st.slug}.png`,
  ]),
  [/^deutsch\//, "deutsch.png"],
  [/^insights/, "insights.png"],
  [/^about\.html$/, "about.png"],
  [/^contact\.html$/, "contact.png"],
  [/^colophon\.html$/, "colophon.png"],
];

const cardFor = (rel) => (ASSIGN.find(([re]) => re.test(rel)) ?? [])[1] ?? "default.png";

const FONTS = FONT_CSS
  ? `<style>${readFileSync(FONT_CSS, "utf8")}</style>`
  : `<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+Bengali:wght@600&family=Noto+Sans+Bengali:wght@400&display=swap" rel="stylesheet">`;

const page = (card) => `<!doctype html><meta charset="utf-8">
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
      `\nNo webfonts loaded — og/${card.file} would render in the fallback face.\n` +
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
const files = globSync("**/*.html", { cwd: HERE })
  .filter((f) => !f.startsWith("og/") && f !== "offline.html");

/* Pages that are nobody's business to share. The list matches
   the Disallow block in robots.txt — desk.html was in one and not
   the other, so a run quietly gave the admin desk a share card. */
const PRIVATE = new Set([
  "studio.html", "desk.html", "offline.html", "insights/_template.html",
]);

const esc = (t) => t.replace(/&/g, "&amp;").replace(/"/g, "&quot;")
  .replace(/</g, "&lt;").replace(/>/g, "&gt;");

let pointed = 0;
let added = 0;
for (const rel of files) {
  if (PRIVATE.has(rel)) continue;
  const abs = join(HERE, rel);
  const html = readFileSync(abs, "utf8");
  const want = `https://reiad.co.uk/og/${cardFor(rel)}`;

  if (html.includes('property="og:image"')) {
    const next = html.replace(/(<meta property="og:image" content=")[^"]*(")/, `$1${want}$2`);
    if (next !== html) { writeFileSync(abs, next); pointed++; }
    continue;
  }

  /* No card at all. Every term page was in this state — eighteen of
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
