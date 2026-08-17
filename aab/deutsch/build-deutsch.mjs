#!/usr/bin/env node
/* ============================================================
   build-deutsch.mjs, writes the German school's pages.

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
     /deutsch/index.html                the school hub, hand-
                                        written, because the "how
                                        this works" section lives
                                        in it

   Teil text comes from ./content/<stufe>.js. A Teil with no text
   there gets a proper "আসছে" page rather than a 404, a listed
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
   JavaScript off it is the printable workbook it came from,
   which is exactly the fallback a paper exercise book deserves.
   ============================================================ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const AAB = join(HERE, "..");

const {
  SCHOOL, stufeTeile, stufeUrl, stufeMinutes, stufeCount,
  teilId, workbookUrl,
} = await import(join(HERE, "curriculum.js"));
const { icon } = await import(join(HERE, "icons.js"));

/* ---------- where the ladder and the text come from ----------

   archive/TRANSITION.md Stage 8, step 3. By default, from `curriculum.js`
   and the prose beside it, which is what every existing
   invocation does and what the committed pages were built from.

   With `SCHOOL_DB` set, from the rows in that SQLite file
   instead. `scripts/schools-build.test.mjs` builds both ways into
   two temporary directories and diffs every page: the database is
   only allowed to become the source of these pages when that diff
   is empty. `SCHOOL_OUT` is what keeps that test out of `aab/`.
   Neither variable is set in normal use. */
const { sourceFor } = await import(join(HERE, "../../scripts/school-source.mjs"));
const source = await sourceFor("deutsch");
const STUFEN = source.stages;
const OUT = process.env.SCHOOL_OUT || AAB;

const { bookFor, dayCount } = await import(join(HERE, "arbeitsbuch.data.js"));

/* curriculum.js declares how many days a book has, because the
   browser needs that number and must not download five thousand
   lines of days to count them. Here, where both are in hand, the
   declaration is checked against the data. A book that grows by a
   day and a stage page that still says sixty is exactly the kind
   of drift the rest of this site refuses to ship. */
for (const stufe of STUFEN) {
  const declared = stufe.workbook?.days ?? 0;
  const actual = dayCount(stufe);
  if (declared !== actual) {
    console.error(
      `\n${stufe.slug}: curriculum.js says the workbook has ${declared} day(s), ` +
      `arbeitsbuch.data.js holds ${actual}.\n` +
      "Fix whichever is wrong. Nothing was written.\n"
    );
    process.exit(1);
  }
  if (stufe.workbook && stufe.uebung) {
    console.error(`\n${stufe.slug}: has both a workbook and a uebung line. Pick one.\n`);
    process.exit(1);
  }
}

/* Teil bodies, one module per Stufe. A Stufe with no file is
   entirely "coming soon" and that is a valid state. */
/* Lesson bodies, one set per stufe, from whichever source was
   chosen above. One with none is entirely "coming soon" and that
   is a valid state, not a failure. */
const bodiesFor = async (stufe) => source.bodies[stufe.slug] ?? {};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Bangla numerals. These pages are lang="bn" throughout, and a
   count rendered as "14টি" next to prose full of ১৪ reads as a
   glitch. Same helper as the Learn area uses. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* ============================================================
   the shared shell, identical to the Learn area's, so the two
   schools cannot drift apart visually
   ============================================================ */

const PREPAINT = `  <script>
    (function () {
      var d = document.documentElement;
      try {
        var t = localStorage.getItem("theme");
        if (t === "dark" || t === "light") d.setAttribute("data-theme", t);
        var a = localStorage.getItem("audience");
        if (a === "money" || a === "work") d.setAttribute("data-audience", a);
      } catch (e) {}
    })();
  </script>`;

const HEAD_TAIL = `  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <!-- The webfont stylesheet does not block the first paint.
       It used to: a <link rel="stylesheet"> is render-blocking, so
       until fonts.googleapis.com answered, this page painted
       nothing at all. On the connection a reader in Dhaka
       actually has, that is seconds of white screen for a page
       whose text was ready immediately, and if the request never
       answers it is seconds of white screen for nothing.

       media="print" makes the browser fetch it at low priority
       without applying it; onload promotes it the moment it
       lands. The text is readable in the fallback face straight
       away and swaps when the webfont arrives, which is what
       display=swap in the URL was always asking for. -->
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500;600&family=Noto+Serif+Bengali:wght@500;600&display=swap"
        media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&family=Noto+Sans+Bengali:wght@400;500;600&family=Noto+Serif+Bengali:wght@500;600&display=swap"></noscript>
  <link rel="stylesheet" href="/styles.css">
  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="manifest" href="/site.webmanifest">
  <link rel="alternate" type="application/rss+xml" title="Reiad's Library · Insights" href="/feed.xml">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="og:site_name" content="Reiad's Library">
  <meta name="theme-color" content="#0B3D2E">`;

const HEADER = `  <a class="skip" href="#main">মূল লেখায় যান</a>
    <!-- The slim bar, not the site's rail. A practice book is
       generated static HTML a learner opens every evening and
       fills in offline; the rail is a React component and these
       pages have no React. The shell layer in styles.css says
       the same thing where the rule is. -->
  <div class="slimbar">
    <a class="slimbar-mark" href="/">
      <svg viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <rect x="22" y="58" width="10" height="20" rx="3" fill="currentColor"/>
        <rect x="40" y="46" width="10" height="32" rx="3" fill="currentColor"/>
        <rect x="58" y="32" width="10" height="46" rx="3" fill="currentColor"/>
        <circle cx="63" cy="24" r="5.5" fill="currentColor"/>
      </svg>
      Reiad's Library
    </a>
    <nav class="slimbar-nav" aria-label="Main">
      <a href="/skills/index.html">Skills</a>
      <a href="/tools/index.html">Tools</a>
      <a href="/insights.html">Insights</a>
      <a href="/portfolio.html">Portfolio</a>
    </nav>
    <div class="top-tools">
      <button class="top-btn" id="open-palette" aria-label="Search the site (Ctrl+K)">&#8981; <span class="kbd-hint mono">Ctrl K</span></button>
      <button class="top-btn" id="theme-toggle" aria-label="Switch between light and dark mode">&#9680;</button>
    </div>
  </div>`;

const FOOTER = `  <footer>
    <div class="wrap">
      <span class="mono">Reiad's Library · Finance &amp; Bangladesh markets</span>
      <p>জার্মান অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <script type="module" src="/app.js"></script>`;

/* `og` is a file name inside /og/. build-og.mjs both renders the
   cards and repoints every page at the right one, so the value
   here has to agree with its ASSIGN table, otherwise the two
   generators take turns overwriting each other. */
function page({ title, description, canonical, body, og = "deutsch.png", extraScripts = "" }) {
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
  <meta property="og:url" content="https://reiad.co.uk${canonical}">
  <meta property="og:image" content="https://reiad.co.uk/og/${og}">
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
     next step is how a learner quietly stops.

     The very last Teil of the last Stufe has no book to point at
     and nothing after it, so it points back at the school. That
     is not a filler link: someone who has just finished
     fifty-six Teile should land somewhere that shows them the
     whole road they walked, not on a page with one way out. */
  const tail = next
    ? cell(next, "পরের Teil →")
    : book
      ? `        <a href="${book}">
          <span class="mono">এবার অনুশীলন →</span>
          <strong class="bn-h">${bn(stufe.workbook.days)} দিনের খাতা</strong>
        </a>`
      : `        <a href="/deutsch/index.html">
          <span class="mono">শেষ Teil ✓</span>
          <strong class="bn-h">চারটা স্তর একসাথে দেখুন</strong>
        </a>`;
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
    title: `${teil.bn}: ${stufe.kicker}, জার্মান বাংলায়, Reiad's Library`,
    description: teil.blurb,
    canonical: teil.url,
    og: `deutsch-${stufe.slug}.png`,
    body: `
      <article class="term-article lesson teil"
               data-teil-id="${esc(teilId(stufe, teil))}"
               data-stufe="${esc(stufe.slug)}"
               data-teil-title="${esc(teil.bn)}"${soon ? ' data-soon="1"' : ""}>
        <span class="eyebrow mono">
          <a href="${stufeUrl(stufe)}">${esc(stufe.kicker)} · ${esc(stufe.bn)}</a>
          · ${esc(teil.section?.bn ?? "")}
        </span>
        <h1 class="bn-h">${art}${esc(teil.bn)} <span class="en-sub" lang="de">${esc(teil.de)}</span></h1>
        <p class="one-liner">${esc(teil.blurb)}</p>
        <p class="lesson-meta mono">${soon ? "আসছে" : `${bn(teil.minutes)} মিনিটের পড়া`}</p>
${body || SOON_BODY}
        <p class="backlink">
          <a href="${stufeUrl(stufe)}">← ${esc(stufe.kicker)}-এর সব পাঠ</a>
          ${workbookUrl(stufe) ? `<a class="backlink-alt" href="${workbookUrl(stufe)}">${bn(stufe.workbook.days)} দিনের খাতা →</a>` : ""}
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
          <h3 class="bn-h">${esc(t.bn)} <span class="en-sub" lang="de">${esc(t.de)}</span></h3>
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
            <strong class="bn-h">${bn(stufe.workbook.days)} দিনের অনুশীলন খাতা</strong>
            <span>দিনে একটা পাতা, একটা ছাঁচ, নিজের জীবনের একটা সত্যি অনুচ্ছেদ।
            যা লিখবেন সেটা আপনার নিজের ব্রাউজারেই জমা থাকবে।</span>
          </span>
          <span class="more" data-workbook-cta>খাতা খুলুন →</span>
        </a>
      </section>

`
    /* A stage with no book says so where the book would have been.
       Leaving the band out entirely reads as something missing,
       and at this level the absence is the point: the practice has
       moved off the page and into the week. */
    : stufe.uebung
      ? `      <section id="uebung" class="no-filter">
        <span class="section-label mono">রোজকার অনুশীলন · <span lang="de">Jeden Tag</span></span>
        <div class="note">${esc(stufe.uebung)}</div>
      </section>

`
      : "";

  return page({
    title: `${stufe.kicker} · ${stufe.bn}, জার্মান বাংলায়, Reiad's Library`,
    description: stufe.blurb,
    canonical: stufeUrl(stufe),
    og: `deutsch-${stufe.slug}.png`,
    body: `
      <div class="hero stage-hero stufe-hero" data-stufe="${esc(stufe.slug)}">
        <span class="eyebrow mono">${esc(stufe.kicker)} · <span lang="de">${esc(stufe.de)}</span></span>
        <h1 class="bn-h">${icon(stufe.icon, "art stage-art")}${esc(stufe.bn)}</h1>
        <p class="lede">${esc(stufe.blurb)}</p>
        <dl class="stage-facts">
          <div><dt>কার জন্য</dt><dd>${esc(stufe.who)}</dd></div>
          <div><dt>কতগুলো পাঠ</dt><dd>${bn(total)}টি${live < total ? ` (${bn(live)}টি তৈরি)` : ""}</dd></div>
          <div><dt>মোট পড়ার সময়</dt><dd>প্রায় ${bn(minutes)} মিনিট</dd></div>
          ${stufe.workbook
            ? `<div><dt>অনুশীলন</dt><dd>${bn(stufe.workbook.days)} দিন, রোজ একটা পাতা${book ? "" : " (আসছে)"}</dd></div>`
            : stufe.uebung
              ? `<div><dt>অনুশীলন</dt><dd>${esc(stufe.uebung)}</dd></div>`
              : ""}
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

/* Day counts in words. The books are 30, 60 and 90 days, and a
   heading reading "৬০টা দিন" where the last one read "ত্রিশটা দিন"
   would be the page changing voice halfway up the ladder. Any
   book length not listed falls back to the numeral, which reads
   fine and is better than a missing word. */
const BN_WORD = { 30: "ত্রিশ", 60: "ষাট", 90: "নব্বই", 120: "একশো বিশ" };
const DE_WORD = { 30: "dreißig", 60: "sechzig", 90: "neunzig", 120: "hundertzwanzig" };
const bnWord = (n) => BN_WORD[n] ?? bn(n);
const deWord = (n) => DE_WORD[n] ?? String(n);

/* Everything a learner types is kept under one key per box, and
   those keys are namespaced by Stufe. Without the prefix, day 1
   of Stufe 2 would open showing the eight sentences written on
   day 1 of Stufe 1, because "tag-1-tausche-1" is not a name, it
   is a collision waiting for a second book. arbeitsbuch.js
   migrates the un-prefixed keys the first book shipped with. */
const schriftKey = (stufe, name) => `${stufe.slug}/${name}`;

/* Multi-line placeholders, the only way to get a line break into
   an attribute without the markup fighting back. */
const ph = (s) => esc(s).replace(/\n/g, "&#10;");

function dayArticle(d, stufe, book) {
  const schau = d.schau
    .map((s) => `            <p class="satz"><b lang="de">${esc(s.de)}</b><span>${esc(s.bn)}</span></p>`)
    .join("\n");

  const tausche = Array.from({ length: 8 }, (_, i) =>
    `            <label class="feld">
              <span class="feld-num mono">${bn(i + 1)}</span>
              <textarea rows="2" data-schrift="${esc(schriftKey(stufe, `tag-${d.n}-tausche-${i + 1}`))}"
                        aria-label="দিন ${bn(d.n)}, নিজের বাক্য ${bn(i + 1)}"
                        placeholder="নিজের বাক্য…"></textarea>
            </label>`).join("\n");

  const sagEs = d.sagEs
    .map((s, i) =>
      `            <div class="sag-zeile">
              <span class="feld-num mono">${bn(i + 1)}</span>
              <span class="sag-frage">${esc(s.q)}</span>
              <textarea rows="2" data-schrift="${esc(schriftKey(stufe, `tag-${d.n}-sag-${i + 1}`))}"
                        aria-label="দিন ${bn(d.n)}, অনুবাদ ${bn(i + 1)}"
                        placeholder="আগে বলো, তারপর লেখো…"></textarea>
              <span class="sag-antwort" lang="de">${esc(s.a)}</span>
            </div>`).join("\n");

  return `      <article class="buch-tag" id="tag-${d.n}" data-tag="${d.n}" data-day-id="${esc(stufe.slug)}/tag-${d.n}">
        <header class="tag-kopf">
          <span class="tag-num mono"><span lang="de">Tag</span> ${bn(d.n)}</span>
          <h2 lang="de">${esc(d.de)}</h2>
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
          <p class="tag-hinweis">আগে নিজে চেষ্টা, তারপর মিলাও। ছাঁচ ঠিক থাকলে আলাদা বাক্যও সঠিক, ছাঁচটাই আসল।</p>
        </section>

        <section class="tag-teil herzen">
          <h3 class="mono"><span lang="de">Von Herzen</span> · নিজের মন থেকে</h3>
          <p class="herz-aufgabe">${esc(d.vonHerzen.bn)}</p>
          <p class="herz-en mono">${esc(d.vonHerzen.en)}</p>
          <textarea rows="4" data-schrift="${esc(schriftKey(stufe, `tag-${d.n}-herzen`))}"
                    aria-label="দিন ${bn(d.n)}, নিজের কথা"
                    placeholder="নিজের সত্যি জীবন নিয়ে লেখো…"></textarea>
        </section>

        <footer class="tag-fuss">
          <button type="button" class="btn btn-solid tag-fertig" data-fertig="${d.n}">
            আজকের পাতা শেষ ✓
          </button>
          <span class="tag-fuss-note mono">সব জোরে বলেছি · ${esc(book.fuss)}</span>
        </footer>
      </article>`;
}

function arbeitsbuchPage(stufe) {
  const url = workbookUrl(stufe);
  const book = bookFor(stufe);
  const total = book.days.length;
  const days = book.days.map((d) => dayArticle(d, stufe, book)).join("\n\n");

  const tracker = book.days.map((d) =>
    `          <a class="tracker-tag" href="#tag-${d.n}" data-tracker="${d.n}">${bn(d.n)}</a>`)
    .join("\n");

  /* Only Stufe 1's book carries the sound key. By Stufe 2 the
     sounds are behind you, and a section repeating them would be
     the book treating a reader as if they had not moved. */
  const schluessel = book.schluessel
    ? `      <section id="schluessel" class="no-filter">
        <span class="section-label mono"><span lang="de">Der Schlüssel</span> · ধ্বনির চাবি</span>
        <p class="measure">আটকে গেলে এখানে ফিরে আসুন। এই এক তালিকা মুখস্থ হলে যেকোনো
        জার্মান শব্দ পড়তে পারবেন।</p>
        <details class="faq laut-details">
          <summary>ধ্বনির চাবি খুলুন</summary>
          <div class="laut-gitter">
${book.schluessel.map(([rule, ex]) =>
    `            <div class="laut-paar"><b>${esc(rule)}</b><span lang="de">${esc(ex)}</span></div>`)
      .join("\n")}
          </div>
          <p class="tag-hinweis">দুটো লম্বা-ছোট নিয়ম: স্বর + h বা জোড়া স্বর = লম্বা টান
          (<span lang="de">wohnen</span>)। পরে জোড়া ব্যঞ্জন = ছোট স্বর (<span lang="de">kommen</span>)।</p>
        </details>
      </section>

`
    : "";

  /* The collection page: hats in Stufe 1, Partizip pairs in
     Stufe 2, three verb forms in Stufe 3. Same furniture either
     way; the grid is auto-fit, so two columns and three both lay
     out without being told how many there are. */
  const s = book.sammlung;
  const sammlung = `      <section id="sammlung" class="no-filter">
        <span class="section-label mono"><span lang="de">${esc(s.de)}</span> · ${esc(s.bn)}</span>
        <p class="measure">${esc(s.blurb)}</p>
        <div class="hut-sammlung">
${s.columns.map((c) => `          <label class="hut-spalte" data-hut="${esc(c.key)}">
            <span class="hut-kopf" lang="de">${esc(c.head)}</span>
            <textarea rows="8" data-schrift="${esc(schriftKey(stufe, `${s.key}-${c.key}`))}"
                      aria-label="${esc(c.head)} তালিকা"
                      placeholder="${ph(c.placeholder)}"></textarea>
          </label>`).join("\n")}
        </div>
      </section>`;

  /* Where the band at the end points. The next Stufe if there is
     one, and there always is here, because no book sits on the
     last rung: Stufe 4 has no workbook at all. */
  const index = STUFEN.findIndex((x) => x.slug === stufe.slug);
  const next = STUFEN[index + 1];

  return page({
    title: `${bn(total)} দিনের অনুশীলন খাতা: ${stufe.kicker}, জার্মান বাংলায়, Reiad's Library`,
    description:
      `দিনে একটা পাতা, একটা ছাঁচ, নিজের জীবনের একটা সত্যি অনুচ্ছেদ। জার্মান ${stufe.kicker}-এর ` +
      `${bnWord(total)} দিনের অনুশীলন খাতা, বাংলায়, উত্তরমালাসহ।`,
    canonical: url,
    og: "deutsch-arbeitsbuch.png",
    body: `
      <div class="hero buch-hero" data-buch="${esc(stufe.slug)}">
        <span class="eyebrow mono"><span lang="de">Das ${total}-Tage-Arbeitsbuch</span> · ${esc(stufe.kicker)}</span>
        <h1 class="bn-h">${bn(total)} দিনের অনুশীলন খাতা</h1>
        <p class="lede"><span lang="de">${esc(book.lede.de)}</span><br>
        ${esc(book.lede.bn)}</p>
        <p class="buch-warnung">এই খাতা পড়ার জন্য নয়, লেখার জন্য, আর জোরে বলার জন্য।
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
        <span class="section-label mono"><span lang="de">Dein ${total}-Tage-Tracker</span> · ${bn(total)} দিনের হিসাব</span>
        <details class="faq tracker-details">
          <summary>কোন দিনগুলো বাকি, দেখুন</summary>
          <p class="measure">যে দিন সত্যিই বলেছেন ও লিখেছেন, সেই দিনটায় টিক দিন। ফাঁকা ঘর মানে
          লজ্জা নয়, মানে: কাল আবার। টিক দেওয়ার বোতামটা প্রতিটা দিনের পাতার নিচে।</p>
          <nav class="tracker" aria-label="দিন বেছে নিন">
${tracker}
          </nav>
        </details>
      </section>

${schluessel}${sammlung}

      <section id="tage" class="buch">
        <span class="section-label mono"><span lang="de">Die ${deWord(total)} Tage</span> · ${bnWord(total)}টা দিন</span>
        <nav class="tag-nav" data-tag-nav hidden aria-label="দিন বদলান"></nav>

${days}
      </section>

      <div class="band">
        <span class="mono"><span lang="de">Tag ${total + 1}</span></span>
        <h2>এই খাতায় ${bn(total + 1)}তম দিন নেই</h2>
        <p><span lang="de">${esc(book.schluss.de)}</span>
        ${esc(book.schluss.bn)}</p>
        <div class="hero-actions">
          ${next ? `<a class="btn btn-solid" href="${stufeUrl(next)}">${esc(next.kicker)} দেখুন →</a>` : ""}
          <a class="btn btn-ghost" href="${stufeUrl(stufe)}">পাঠগুলোয় ফিরুন</a>
        </div>
      </div>

      <div class="note"><span lang="de">${esc(book.motto.de)}</span>
      ${esc(book.motto.bn)}</div>
`,
    extraScripts: `\n  <script type="module" src="/deutsch/arbeitsbuch.js"></script>`,
  });
}

/* ============================================================
   go
   ============================================================ */

/* Only the practice books.

   archive/TRANSITION.md Stage 11.7. This file used to write a Stufe's
   ladder and all fourteen of its Teil pages as well, and those
   are a Next.js route now, rendered from the rows the Studio
   writes. Writing them here too would put a file back at an
   address a Worker already answers, which is the one thing this
   stage was arranged to end.

   The books stay files, and that is a decision rather than an
   oversight: a book is thirty, sixty or ninety days written out
   in full, it is the same for every reader, and none of it is in
   the database. `arbeitsbuch.data.js` beside this file is where
   it lives. When that moves, this goes with it. */
let pages = 0;

for (const stufe of STUFEN) {
  if (!workbookUrl(stufe)) {
    console.log(`${stufe.slug.padEnd(9)} no practice book`);
    continue;
  }
  const dir = join(OUT, "deutsch", stufe.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${stufe.workbook.slug}.html`), arbeitsbuchPage(stufe));
  pages++;
  console.log(`${stufe.slug.padEnd(9)} ${dayCount(stufe)}-day workbook`);
}

console.log(
  `\n${pages} page(s) written for ${SCHOOL.en}. ` +
  `Now run: node aab/build-meta.mjs && node aab/check-routes.mjs`
);
