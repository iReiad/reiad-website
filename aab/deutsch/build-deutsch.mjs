#!/usr/bin/env node
/* ============================================================
   build-deutsch.mjs — writes the German school's pages.

       node aab/deutsch/build-deutsch.mjs

   Like build-lessons.mjs next door, this is NOT a build step.
   It is a generator you run when you change something, and what
   it writes is committed as ordinary static files. The site
   never depends on it having been run.

   It writes:
     /deutsch/<stufe>/index.html        a Stufe's contents page
     /deutsch/<stufe>/<teil>.html       one page per Teil
     /deutsch/stufe-1/arbeitsbuch.html  the thirty-day practice book

   It never touches:
     /deutsch/index.html                the school hub — hand-
                                        written, because the "how
                                        this works" section lives
                                        in it

   Teil text comes from ./content/<stufe>.js. A Teil with no text
   there gets a proper "আসছে" page rather than a 404 — a listed
   thing must always be a place you can go.

   ------------------------------------------------------------
   WHY THE WORKBOOK IS ONE PAGE AND NOT THIRTY

   Thirty pages would have been the obvious mirror of the Teile.
   But a practice book is not thirty articles; it is one book you
   return to every day, and the thing a learner wants from it is
   "open today's page", not "navigate to day 14". One URL they can
   bookmark on the first evening and open every evening after is
   worth more than thirty they have to find.

   So all thirty days are written into one page, in full, in
   order. With JavaScript on it becomes a day-at-a-time book with
   a tracker and boxes that remember what was typed. With
   JavaScript off it is the printable workbook it came from —
   which is exactly the fallback a paper exercise book deserves.
   ============================================================ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const AAB = join(HERE, "..");

const {
  STUFEN, SCHOOL, stufeTeile, stufeUrl, stufeMinutes, stufeCount,
  teilId, workbookUrl,
} = await import(join(HERE, "curriculum.js"));
const { icon } = await import(join(HERE, "icons.js"));
const { DAYS } = await import(join(HERE, "arbeitsbuch.data.js"));

/* Teil bodies, one module per Stufe. A Stufe with no file is
   entirely "coming soon" and that is a valid state. */
async function bodiesFor(stufe) {
  const file = join(HERE, "content", `${stufe.slug}.js`);
  if (!existsSync(file)) return {};
  return (await import(file)).default ?? {};
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Bangla numerals. These pages are lang="bn" throughout, and a
   count rendered as "14টি" next to prose full of ১৪ reads as a
   glitch. Same helper as the Learn area uses. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* ============================================================
   the shared shell — identical to the Learn area's, so the two
   schools cannot drift apart visually
   ============================================================ */

const PREPAINT = `  <script>
    (function () {
      var d = document.documentElement;
      try {
        var t = localStorage.getItem("theme");
        if (t === "dark" || t === "light") d.setAttribute("data-theme", t);
        var a = localStorage.getItem("audience");
        if (a === "learn" || a === "work") d.setAttribute("data-audience", a);
      } catch (e) {}
    })();
  </script>`;

const HEAD_TAIL = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500;600&family=Noto+Serif+Bengali:wght@500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Rony Reiad · Insights" href="/feed.xml">
  <meta property="og:image" content="https://reiad.co.uk/og/learn.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="og:site_name" content="Rony Reiad">
  <meta name="theme-color" content="#0B3D2E">`;

const HEADER = `  <a class="skip" href="#main">মূল লেখায় যান</a>
  <header>
    <div class="wrap header-inner">
      <a class="site-name" href="/index.html">
        <svg class="site-mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor"/>
          <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor"/>
          <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor"/>
          <circle cx="63" cy="24" r="5.5" fill="currentColor"/>
        </svg>
        Rony Reiad
      </a>
      <nav aria-label="Main">
        <a href="/learn/index.html" data-keep>Learn</a>
        <a href="/deutsch/index.html" aria-current="page">Deutsch</a>
        <a href="/tools/index.html">Tools</a>
        <a href="/insights.html">Insights</a>
        <a href="/portfolio.html">Portfolio</a>
        <a href="/about.html">About</a>
        <a href="/contact.html" data-keep>Contact</a>
      </nav>
      <button class="icon-btn" id="open-menu" aria-label="Open the menu"><span class="burger" aria-hidden="true"></span>Menu</button>
      <button class="icon-btn" id="open-palette" aria-label="Search the site (Ctrl+K)">⌕ <span class="kbd-hint">Ctrl K</span></button>
      <button class="icon-btn" id="theme-toggle" aria-label="Switch between light and dark mode">◐</button>
    </div>
  </header>`;

const FOOTER = `  <footer>
    <div class="wrap">
      <span class="mono">Rony Reiad · Finance &amp; Bangladesh markets</span>
      <p>জার্মান অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <script type="module" src="/app.js"></script>`;

function page({ title, description, canonical, body, extraScripts = "" }) {
  return `<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="light dark">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="https://reiad.co.uk${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
${PREPAINT}
${HEAD_TAIL}
</head>
<body class="deutsch">
${HEADER}
  <main id="main">
    <div class="wrap">
${body}
    </div>
  </main>
${FOOTER}${extraScripts}
</body>
</html>
`;
}

/* ============================================================
   a Teil page
   ============================================================ */

function prevNext(teile, index, stufe) {
  const prev = teile[index - 1];
  const next = teile[index + 1];
  const book = workbookUrl(stufe);
  const cell = (t, label) =>
    t
      ? `        <a href="${t.url}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(t.bn)}</strong>
        </a>`
      : "";
  /* The last Teil points at the practice book rather than at
     nothing: reading the course through and then being handed no
     next step is how a learner quietly stops. */
  const tail = next
    ? cell(next, "পরের Teil →")
    : book
      ? `        <a href="${book}">
          <span class="mono">এবার অনুশীলন →</span>
          <strong class="bn-h">৩০ দিনের খাতা</strong>
        </a>`
      : "";
  const cells = [cell(prev, "← আগের Teil"), tail].filter(Boolean);
  if (!cells.length) return "";
  return `      <nav class="prev-next" aria-label="এই স্তরের অন্য পাঠ">
${cells.join("\n")}
      </nav>`;
}

const SOON_BODY = `
<p class="soon-note">এই পাঠটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন
কী আসছে আর কোথায় ফিরে আসতে হবে।</p>
<p>এই স্তরের যে পাঠগুলো তৈরি, সেগুলো স্তরের পাতায় চিহ্নিত করা আছে। আপাতত আগের স্তরটা
পুরো করে নিন, আর রোজকার অনুশীলন চালিয়ে যান: ক্রম মেনে এগোলে এই পাঠটা এলে অনেক সহজ লাগবে।</p>
`;

function teilPage(stufe, teile, index, bodies) {
  const teil = teile[index];
  const soon = teil.status !== "live";
  const body = soon ? SOON_BODY : bodies[teil.slug];

  if (!soon && !body) {
    console.warn(`  ! ${stufe.slug}/${teil.slug} is marked live but has no text`);
  }

  const art = icon(teil.icon ?? stufe.icon, "art lesson-art");

  return page({
    title: `${teil.bn}: ${stufe.kicker}, জার্মান বাংলায়, Rony Reiad`,
    description: teil.blurb,
    canonical: teil.url,
    body: `
      <article class="term-article lesson teil"
               data-teil-id="${esc(teilId(stufe, teil))}"
               data-stufe="${esc(stufe.slug)}"
               data-teil-title="${esc(teil.bn)}"${soon ? ' data-soon="1"' : ""}>
        <span class="eyebrow mono">
          <a href="${stufeUrl(stufe)}">${esc(stufe.kicker)} · ${esc(stufe.bn)}</a>
          · ${esc(teil.section?.bn ?? "")}
        </span>
        <h1 class="bn-h">${art}${esc(teil.bn)}</h1>
        <p class="teil-de" lang="de">${esc(teil.de)} <span class="en-sub">${esc(teil.en)}</span></p>
        <p class="one-liner">${esc(teil.blurb)}</p>
        <p class="lesson-meta mono">${soon ? "আসছে" : `${bn(teil.minutes)} মিনিটের পড়া`}</p>
${body || SOON_BODY}
        <p class="backlink">
          <a href="${stufeUrl(stufe)}">← ${esc(stufe.kicker)}-এর সব পাঠ</a>
          ${workbookUrl(stufe) ? `<a class="backlink-alt" href="${workbookUrl(stufe)}">৩০ দিনের খাতা →</a>` : ""}
        </p>
      </article>
${prevNext(teile, index, stufe)}
`,
    extraScripts: `\n  <script type="module" src="/deutsch/teil.js"></script>`,
  });
}

/* ============================================================
   a Stufe index page
   ============================================================ */

function stufeIndexPage(stufe, teile) {
  const total = teile.length;
  const live = teile.filter((t) => t.status === "live").length;
  const minutes = stufeMinutes(stufe);
  const book = workbookUrl(stufe);

  const sections = stufe.sections
    .map((section) => {
      const cards = section.teile
        .map((raw) => {
          const t = teile.find((x) => x.slug === raw.slug && x.section.id === section.id);
          const soon = t.status !== "live";
          return `        <a class="cell lesson-card${soon ? " is-soon" : ""}" href="${t.url}"
           data-teil-id="${esc(t.id)}">
          <span class="lesson-card-art" aria-hidden="true">${icon(t.icon ?? stufe.icon)}</span>
          <h3 class="bn-h">${esc(t.bn)}</h3>
          <span class="teil-de mono" lang="de">${esc(t.de)}</span>
          <p>${esc(t.blurb)}</p>
          <span class="lesson-card-foot mono">${soon ? "আসছে" : `${bn(t.minutes)} মিনিট`}</span>
        </a>`;
        })
        .join("\n");

      return `      <section id="${section.id}">
        <span class="section-label mono">${esc(section.bn)} · <span lang="de">${esc(section.de)}</span></span>
        <div class="cards lesson-grid">
${cards}
        </div>
      </section>`;
    })
    .join("\n\n");

  const index = STUFEN.findIndex((s) => s.slug === stufe.slug);
  const prev = STUFEN[index - 1];
  const next = STUFEN[index + 1];
  const ladderCell = (s, label) =>
    s
      ? `        <a href="${stufeUrl(s)}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(s.kicker)} · ${esc(s.bn)}</strong>
        </a>`
      : "";

  /* The practice book gets a band of its own, above the Teile.
     It is the thing a returning learner came for, and burying it
     under fourteen cards would mean scrolling past the course to
     reach the homework every single evening. */
  const bookBand = book
    ? `      <section id="uebung" class="no-filter">
        <span class="section-label mono">রোজকার অনুশীলন · <span lang="de">Jeden Tag</span></span>
        <a class="cell buch-cta" href="${book}" data-workbook="${esc(stufe.slug)}">
          <span class="buch-art" aria-hidden="true">${icon("pen")}</span>
          <span class="buch-text">
            <strong class="bn-h">৩০ দিনের অনুশীলন খাতা</strong>
            <span>দিনে একটা পাতা, একটা ছাঁচ, নিজের জীবনের একটা সত্যি অনুচ্ছেদ।
            যা লিখবেন সেটা আপনার নিজের ব্রাউজারেই জমা থাকবে।</span>
          </span>
          <span class="more" data-workbook-cta>খাতা খুলুন →</span>
        </a>
      </section>

`
    : "";

  return page({
    title: `${stufe.kicker} · ${stufe.bn}, জার্মান বাংলায়, Rony Reiad`,
    description: stufe.blurb,
    canonical: stufeUrl(stufe),
    body: `
      <div class="hero stage-hero stufe-hero" data-stufe="${esc(stufe.slug)}">
        <span class="eyebrow mono">${esc(stufe.kicker)} · <span lang="de">${esc(stufe.de)}</span></span>
        <h1 class="bn-h">${icon(stufe.icon, "art stage-art")}${esc(stufe.bn)}</h1>
        <p class="lede">${esc(stufe.blurb)}</p>
        <dl class="stage-facts">
          <div><dt>কার জন্য</dt><dd>${esc(stufe.who)}</dd></div>
          <div><dt>কতগুলো পাঠ</dt><dd>${bn(total)}টি${live < total ? ` (${bn(live)}টি তৈরি)` : ""}</dd></div>
          <div><dt>মোট পড়ার সময়</dt><dd>প্রায় ${bn(minutes)} মিনিট</dd></div>
          ${stufe.workbook ? `<div><dt>অনুশীলন</dt><dd>${bn(stufe.workbook.days)} দিন, রোজ একটা পাতা${book ? "" : " (আসছে)"}</dd></div>` : ""}
        </dl>
        <p class="stufe-can">${esc(stufe.can)}</p>
        <div class="stage-progress" data-stufe-progress="${esc(stufe.slug)}">
          <span class="track"><i></i></span>
          <span class="count mono"></span>
        </div>
        <div class="hero-actions">
          <a class="btn btn-solid" href="${teile[0].url}" data-stufe-continue="${esc(stufe.slug)}">শুরু করুন →</a>
          <a class="btn btn-ghost" href="/deutsch/index.html">চারটা স্তর দেখুন</a>
        </div>
      </div>

${bookBand}${sections}

      <nav class="prev-next" aria-label="স্তরের ক্রম">
${[ladderCell(prev, "← আগের স্তর"), ladderCell(next, "পরের স্তর →")].filter(Boolean).join("\n")}
      </nav>

      <div class="note">এই কোর্সটা বাংলাভাষীদের জন্য লেখা, আর ধরে নেওয়া হয়েছে আপনি
      ইংরেজি একবার শিখেছেন। কোনো পরীক্ষার প্রস্তুতি নয়, কোনো সার্টিফিকেট নয়:
      লক্ষ্য শুধু একটাই, যেন আপনি মুখ খুলে বলতে পারেন।</div>
`,
    extraScripts: `\n  <script type="module" src="/deutsch/stufe.js"></script>`,
  });
}

/* ============================================================
   the thirty-day practice book

   Every day is written out in full. See the long note at the top
   of this file for why this is one page and not thirty.
   ============================================================ */

/* The sound key from the front of the book. It is here as well as
   in Teil 2 on purpose: this is the page a learner has open while
   stuck on a word, and sending them to another tab to look up
   "does w sound like v again?" is how a practice session ends. */
const LAUT_SCHLUESSEL = [
  ["w → ভ", "Wasser (ভাসা)"], ["v → ফ", "Vater (ফাটা)"],
  ["z → ৎস", "zehn (ৎসেন)"], ["s + স্বর → জ়", "sie (জ়ী)"],
  ["ß / ss → স", "heißen (হাইসেন)"], ["sch → শ", "Schule (শূলে)"],
  ["st- / sp- → শ্ট / শ্প", "Stadt (শ্টাট)"], ["j → ইয়", "ja (ইয়া)"],
  ["ch (i/e-র পরে) → ইশ্", "ich · nicht"], ["ch (a/o/u-র পরে) → খ", "Buch (বুখ)"],
  ["ei → আই", "nein (নাইন)"], ["ie → ঈ", "vier (ফীয়া)"],
  ["au → আউ", "Haus (হাউস)"], ["eu / äu → অয়", "Deutsch (ডয়চ)"],
  ["ä → এ্যা", "Mädchen (মেটশেন)"], ["ö → এ + ও-ঠোঁট", "schön (শ্যোন)"],
  ["ü → ই + উ-ঠোঁট", "fünf (ফ্যুন্ফ)"], ["-er (শেষে) → আ", "Mutter (মুটা)"],
];

function dayArticle(d, stufe) {
  const schau = d.schau
    .map((s) => `            <p class="satz"><b lang="de">${esc(s.de)}</b><span>${esc(s.bn)}</span></p>`)
    .join("\n");

  const tausche = Array.from({ length: 8 }, (_, i) =>
    `            <label class="feld">
              <span class="feld-num mono">${bn(i + 1)}</span>
              <textarea rows="1" data-schrift="tag-${d.n}-tausche-${i + 1}"
                        aria-label="দিন ${bn(d.n)}, নিজের বাক্য ${bn(i + 1)}"
                        placeholder="নিজের বাক্য…"></textarea>
            </label>`).join("\n");

  const sagEs = d.sagEs
    .map((s, i) =>
      `            <div class="sag-zeile">
              <span class="feld-num mono">${bn(i + 1)}</span>
              <span class="sag-frage">${esc(s.q)}</span>
              <textarea rows="1" data-schrift="tag-${d.n}-sag-${i + 1}"
                        aria-label="দিন ${bn(d.n)}, অনুবাদ ${bn(i + 1)}"
                        placeholder="আগে বলো, তারপর লেখো…"></textarea>
              <span class="sag-antwort" lang="de">${esc(s.a)}</span>
            </div>`).join("\n");

  return `      <article class="tag" id="tag-${d.n}" data-tag="${d.n}" data-day-id="${esc(stufe.slug)}/tag-${d.n}">
        <header class="tag-kopf">
          <span class="tag-num mono"><span lang="de">Tag</span> ${bn(d.n)}</span>
          <h2 class="bn-h" lang="de">${esc(d.de)}</h2>
          <p class="tag-bn">${esc(d.bn)}</p>
        </header>

        <div class="muster">
          <span class="muster-label mono">Das Muster · ছাঁচ</span>
          <p class="muster-shape" lang="de">${esc(d.muster.pattern)}</p>
          <p class="muster-why">${esc(d.muster.why)}</p>
          <p class="muster-beispiel" lang="de">${esc(d.muster.examples)}</p>
          <p class="muster-tipp">${esc(d.muster.tip)}</p>
        </div>

        <section class="tag-teil schau">
          <h3 class="mono"><span lang="de">Schau</span> · দেখো ও তিনবার জোরে বলো</h3>
          <div class="satz-list">
${schau}
          </div>
        </section>

        <section class="tag-teil tausche">
          <h3 class="mono"><span lang="de">Tausche</span> · একই ছাঁচে নিজের আটটা বাক্য</h3>
          <p class="tag-hinweis">লেখার সময় প্রতিটা জোরে বলো। যা লেখো সেটা এই ব্রাউজারেই জমা থাকে।</p>
          <div class="felder">
${tausche}
          </div>
        </section>

        <section class="tag-teil sagen">
          <h3 class="mono"><span lang="de">Sag es</span> · আগে বলো, তারপর লেখো</h3>
          <div class="sag-liste">
${sagEs}
          </div>
          <button type="button" class="btn btn-ghost antwort-schalter" data-antwort="${d.n}"
                  aria-expanded="false">উত্তর দেখুন</button>
          <p class="tag-hinweis">আগে নিজে চেষ্টা, তারপর মিলাও। ছাঁচ ঠিক থাকলে আলাদা বাক্যও সঠিক — ছাঁচটাই আসল।</p>
        </section>

        <section class="tag-teil herzen">
          <h3 class="mono"><span lang="de">Von Herzen</span> · নিজের মন থেকে</h3>
          <p class="herz-aufgabe">${esc(d.vonHerzen.bn)}</p>
          <p class="herz-en mono">${esc(d.vonHerzen.en)}</p>
          <textarea rows="4" data-schrift="tag-${d.n}-herzen"
                    aria-label="দিন ${bn(d.n)}, নিজের কথা"
                    placeholder="নিজের সত্যি জীবন নিয়ে লেখো…"></textarea>
        </section>

        <footer class="tag-fuss">
          <button type="button" class="btn btn-solid tag-fertig" data-fertig="${d.n}">
            আজকের পাতা শেষ ✓
          </button>
          <span class="tag-fuss-note mono">সব জোরে বলেছি · গতকালের পাতা আগে পড়েছি</span>
        </footer>
      </article>`;
}

function arbeitsbuchPage(stufe) {
  const url = workbookUrl(stufe);
  const days = DAYS.map((d) => dayArticle(d, stufe)).join("\n\n");

  const schluessel = LAUT_SCHLUESSEL
    .map(([rule, ex]) =>
      `          <div class="laut-paar"><b>${esc(rule)}</b><span lang="de">${esc(ex)}</span></div>`)
    .join("\n");

  const tracker = DAYS.map((d) =>
    `          <a class="tracker-tag" href="#tag-${d.n}" data-tracker="${d.n}">${bn(d.n)}</a>`)
    .join("\n");

  return page({
    title: `৩০ দিনের অনুশীলন খাতা: ${stufe.kicker}, জার্মান বাংলায়, Rony Reiad`,
    description:
      "দিনে একটা পাতা, একটা ছাঁচ, নিজের জীবনের একটা সত্যি অনুচ্ছেদ। জার্মান স্তর ১-এর ত্রিশ দিনের অনুশীলন খাতা, বাংলায়, উত্তরমালাসহ।",
    canonical: url,
    body: `
      <div class="hero buch-hero" data-buch="${esc(stufe.slug)}">
        <span class="eyebrow mono"><span lang="de">Das 30-Tage-Arbeitsbuch</span> · ${esc(stufe.kicker)}</span>
        <h1 class="bn-h">৩০ দিনের অনুশীলন খাতা</h1>
        <p class="lede"><span lang="de">Eine Seite pro Tag. Ein Muster pro Tag. Ein ehrlicher Satz pro Tag.</span><br>
        দিনে একটা পাতা। একটা ছাঁচ। নিজের জীবনের একটা সত্যি অনুচ্ছেদ।</p>
        <p class="buch-warnung">এই খাতা পড়ার জন্য নয় — লেখার জন্য, আর জোরে বলার জন্য।
        খালি ঘরগুলো আপনার। ভরান। যা লেখেন সেটা শুধু আপনার এই ব্রাউজারেই জমা থাকে,
        কোথাও পাঠানো হয় না।</p>

        <div class="buch-fortschritt" data-buch-fortschritt>
          <span class="track"><i></i></span>
          <span class="count mono"></span>
        </div>

        <div class="hero-actions">
          <a class="btn btn-solid" href="#tag-1" data-buch-heute>আজকের পাতা খুলুন →</a>
          <a class="btn btn-ghost" href="${stufeUrl(stufe)}">${esc(stufe.kicker)}-এর পাঠগুলো</a>
        </div>
      </div>

      <section id="tracker" class="no-filter">
        <span class="section-label mono"><span lang="de">Dein 30-Tage-Tracker</span> · ৩০ দিনের হিসাব</span>
        <p class="measure">যে দিন সত্যিই বলেছেন ও লিখেছেন, সেই দিনটায় টিক দিন। ফাঁকা ঘর মানে
        লজ্জা নয়, মানে: কাল আবার। টিক দেওয়ার বোতামটা প্রতিটা দিনের পাতার নিচে।</p>
        <nav class="tracker" aria-label="দিন বেছে নিন">
${tracker}
        </nav>
      </section>

      <section id="schluessel" class="no-filter">
        <span class="section-label mono"><span lang="de">Der Schlüssel</span> · ধ্বনির চাবি</span>
        <p class="measure">আটকে গেলে এখানে ফিরে আসুন। এই এক তালিকা মুখস্থ হলে যেকোনো
        জার্মান শব্দ পড়তে পারবেন।</p>
        <details class="faq laut-details">
          <summary>ধ্বনির চাবি খুলুন</summary>
          <div class="laut-gitter">
${schluessel}
          </div>
          <p class="tag-hinweis">দুটো লম্বা-ছোট নিয়ম: স্বর + h বা জোড়া স্বর = লম্বা টান
          (<span lang="de">wohnen</span>)। পরে জোড়া ব্যঞ্জন = ছোট স্বর (<span lang="de">kommen</span>)।</p>
        </details>
      </section>

      <section id="huete" class="no-filter">
        <span class="section-label mono"><span lang="de">Die Hut-Sammlung</span> · টুপি-সংগ্রহ</span>
        <p class="measure">নতুন বিশেষ্য পেলেই এখানে জমান, সঠিক কলামে, টুপিসহ।
        সপ্তাহে একবার পুরোটা জোরে পড়ুন: টুপি আর শব্দ এক নিঃশ্বাসে।</p>
        <div class="hut-sammlung">
          <label class="hut-spalte" data-hut="der">
            <span class="hut-kopf" lang="de">der</span>
            <textarea rows="8" data-schrift="huete-der"
                      aria-label="der শব্দের তালিকা"
                      placeholder="der Vater&#10;der Tisch&#10;…"></textarea>
          </label>
          <label class="hut-spalte" data-hut="die">
            <span class="hut-kopf" lang="de">die</span>
            <textarea rows="8" data-schrift="huete-die"
                      aria-label="die শব্দের তালিকা"
                      placeholder="die Mutter&#10;die Tür&#10;…"></textarea>
          </label>
          <label class="hut-spalte" data-hut="das">
            <span class="hut-kopf" lang="de">das</span>
            <textarea rows="8" data-schrift="huete-das"
                      aria-label="das শব্দের তালিকা"
                      placeholder="das Kind&#10;das Buch&#10;…"></textarea>
          </label>
        </div>
      </section>

      <section id="tage" class="buch">
        <span class="section-label mono"><span lang="de">Die dreißig Tage</span> · ত্রিশটা দিন</span>
        <nav class="tag-nav" data-tag-nav hidden aria-label="দিন বদলান"></nav>

${days}
      </section>

      <div class="band">
        <span class="mono"><span lang="de">Tag 31</span></span>
        <h2>এই খাতায় ৩১তম দিন নেই</h2>
        <p><span lang="de">Tag 31 ist der Tag, an dem die Gewohnheiten ohne das Buch laufen.</span>
        ৩১তম দিন হলো সেই দিন, যেদিন অভ্যাসগুলো খাতা ছাড়াই হাঁটে: সারাদিন নিজের সাথে জার্মানে বলা,
        রোজ রাতে দিনটা জার্মানে বলা, সপ্তাহে দশটা নতুন বিশেষ্য টুপিসহ, আর না বুঝলে চুপ না থেকে
        <span lang="de">"Wie bitte? Langsam, bitte!"</span></p>
        <div class="hero-actions">
          <a class="btn btn-solid" href="/deutsch/stufe-2/index.html">Stufe ২ দেখুন →</a>
          <a class="btn btn-ghost" href="${stufeUrl(stufe)}">পাঠগুলোয় ফিরুন</a>
        </div>
      </div>

      <div class="note"><span lang="de">Sprich schlecht. Sprich heute.</span>
      আজকের ভাঙা জার্মান কালকের নিখুঁত জার্মানের চেয়ে অনেক দামি।</div>
`,
    extraScripts: `\n  <script type="module" src="/deutsch/arbeitsbuch.js"></script>`,
  });
}

/* ============================================================
   go
   ============================================================ */

let pages = 0;

for (const stufe of STUFEN) {
  const teile = stufeTeile(stufe);
  const dir = join(AAB, "deutsch", stufe.slug);
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, "index.html"), stufeIndexPage(stufe, teile));
  pages++;

  const bodies = await bodiesFor(stufe);
  teile.forEach((teil, i) => {
    writeFileSync(join(dir, `${teil.slug}.html`), teilPage(stufe, teile, i, bodies));
    pages++;
  });

  if (workbookUrl(stufe)) {
    writeFileSync(join(dir, `${stufe.workbook.slug}.html`), arbeitsbuchPage(stufe));
    pages++;
    console.log(`${stufe.slug.padEnd(9)} ${teile.length} Teil page(s), ` +
      `${stufeCount(stufe).live} written, + ${DAYS.length}-day workbook`);
  } else {
    console.log(`${stufe.slug.padEnd(9)} ${teile.length} Teil page(s), ${stufeCount(stufe).live} written`);
  }
}

console.log(
  `\n${pages} page(s) written for ${SCHOOL.en}. ` +
  `Now run: node aab/build-meta.mjs && node aab/check-routes.mjs`
);
