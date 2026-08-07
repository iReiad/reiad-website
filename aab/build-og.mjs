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
import { chromium } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = join(HERE, "og");
mkdirSync(OUT, { recursive: true });

const CARDS = [
  { file: "default.png", eyebrow: "reiad.co.uk", title: "Bangladesh's markets, explained in the language we speak.",
    sub: "Plain-Bangla investment education · financial modeling · analysis" },
  { file: "learn.png", eyebrow: "শেখার লাইব্রেরি · Learn hub", title: "টাকার ভাষা, আমাদের ভাষায়।",
    sub: "শেয়ার · সঞ্চয়পত্র · মিউচুয়াল ফান্ড · চক্রবৃদ্ধি — ১৮টি টার্ম, সহজ বাংলায়", bn: true },
  { file: "tools.png", eyebrow: "Tools · ক্যালকুলেটর", title: "The five sums worth doing before you decide anything.",
    sub: "Compounding · সঞ্চয়পত্র vs FDR · inflation · EMI · position sizing" },
  { file: "insights.png", eyebrow: "Insights", title: "Notes on markets, written to be understood.",
    sub: "Explainers, analysis, and an auto-updating pulse of what matters" },
];

const page = (card) => `<!doctype html><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Spectral:wght@500&family=IBM+Plex+Mono:wght@400;500&family=Noto+Serif+Bengali:wght@600&family=Noto+Sans+Bengali:wght@400&display=swap" rel="stylesheet">
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
  <span class="name">Rony Reiad</span>
  <span class="url">reiad.co.uk</span>
</div>`;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1200, height: 630 },
  deviceScaleFactor: 1,
});
const tab = await context.newPage();

for (const card of CARDS) {
  await tab.setContent(page(card), { waitUntil: "networkidle" });
  await tab.evaluate(() => document.fonts.ready);
  await tab.screenshot({ path: join(OUT, card.file) });
  console.log("wrote og/" + card.file);
}

await browser.close();
