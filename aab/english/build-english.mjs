#!/usr/bin/env node
/* ============================================================
   build-english.mjs, writes the English school's pages.

       node aab/english/build-english.mjs

   Like build-deutsch.mjs, build-quran.mjs and build-lessons.mjs,
   this is NOT a build step. It is a generator you run when you
   change something, and what it writes is committed as ordinary
   static files. The site never depends on it having been run.

   It writes:
     /english/<term>/index.html        a term's contents page
     /english/<term>/<part>.html       one page per part
     /english/term-1/workbook.html     the thirty-day practice book

   It never touches:
     /english/index.html               the school hub, hand-
                                       written, because the "how
                                       this works" section lives
                                       in it

   Part text comes from ./content/<term>.js. A part with no text
   there gets a proper "আসছে" page rather than a 404: a listed
   thing must always be a place you can go.

   ------------------------------------------------------------
   WHY THE WORKBOOK IS ONE PAGE AND NOT THIRTY

   The same answer the German school gives, and it has held up:
   a practice book is not thirty articles, it is one book you
   return to every day, and what a learner wants from it is
   "open today's page", not "navigate to day 14". One URL they
   can bookmark on the first evening and open every evening
   after is worth more than thirty they have to find.

   So all thirty days are written into one page, in full, in
   order. With JavaScript on it becomes a day-at-a-time book with
   a tracker and boxes that remember what was typed. With
   JavaScript off it is the printable workbook it came from,
   which is exactly the fallback a paper exercise book deserves.

   ------------------------------------------------------------
   THE ONE THING THIS BUILDER DOES THAT THE OTHERS DO NOT

   It sets English inside Bangla, which is the opposite of every
   other school here. In German and Arabic the foreign words are
   the rare things on the page and Bangla carries the prose. In
   this school half of every page is English by design: the
   patterns, the model sentences, the sentence bank. So English
   strings carry lang="en" and the stylesheet gives them the
   Latin face, exactly the way the German school does for German,
   and for the same reason: the Bangla face has no Latin worth
   the name and English set in it looks limp beside the Bangla
   explaining it.
   ============================================================ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const AAB = join(HERE, "..");

const {
  SCHOOL, termParts, termUrl, termMinutes, termCount,
  partId, workbookUrl,
} = await import(join(HERE, "curriculum.js"));
const { icon } = await import(join(HERE, "icons.js"));

/* ---------- where the ladder and the text come from ----------

   TRANSITION.md Stage 8, step 3. By default, from `curriculum.js`
   and the prose beside it, which is what every existing
   invocation does and what the committed pages were built from.

   With `SCHOOL_DB` set, from the rows in that SQLite file
   instead. `scripts/schools-build.test.mjs` builds both ways into
   two temporary directories and diffs every page: the database is
   only allowed to become the source of these pages when that diff
   is empty. `SCHOOL_OUT` is what keeps that test out of `aab/`.
   Neither variable is set in normal use. */
const { sourceFor } = await import(join(HERE, "../../scripts/school-source.mjs"));
const source = await sourceFor("english");
const TERMS = source.stages;
const OUT = process.env.SCHOOL_OUT || AAB;

const { bookFor, dayCount } = await import(join(HERE, "workbook.data.js"));

/* curriculum.js declares how many days a book has, because the
   browser needs that number and must not download a thousand
   lines of days to count them. Here, where both are in hand, the
   declaration is checked against the data. A book that grows by
   a day and a term page that still says thirty is exactly the
   kind of drift the rest of this site refuses to ship. */
for (const term of TERMS) {
  const declared = term.workbook?.days ?? 0;
  const actual = dayCount(term);
  if (declared !== actual) {
    console.error(
      `\n${term.slug}: curriculum.js says the workbook has ${declared} day(s), ` +
      `workbook.data.js holds ${actual}.\n` +
      "Fix whichever is wrong. Nothing was written.\n"
    );
    process.exit(1);
  }
  if (term.workbook && term.chorcha) {
    console.error(`\n${term.slug}: has both a workbook and a chorcha line. Pick one.\n`);
    process.exit(1);
  }
}

/* Part bodies, one module per term. A term with no file is
   entirely "coming soon" and that is a valid state. */
/* Lesson bodies, one set per term, from whichever source was
   chosen above. One with none is entirely "coming soon" and that
   is a valid state, not a failure. */
const bodiesFor = async (term) => source.bodies[term.slug] ?? {};

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Bangla numerals. These pages are lang="bn" throughout, and a
   count rendered as "14টি" next to prose full of ১৪ reads as a
   glitch. Same helper as all three other schools use. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* A piece of English inside Bangla. Tagged so the stylesheet can
   give it the Latin face and a screen reader can switch voice. */
const en = (s, cls) =>
  `<span lang="en"${cls ? ` class="${cls}"` : ""}>${esc(s)}</span>`;

/* ============================================================
   the shared shell

   Kept in step with build-deutsch.mjs, build-quran.mjs and
   build-lessons.mjs on purpose. If you change the canonical
   link, the Open Graph tags, the header or the webfont line,
   change it in all four or the schools drift away from the rest
   of the site one deploy at a time.
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

/* No extra font on this line, and that is worth saying out loud:
   this school's foreign language is written in the Latin
   alphabet the site already ships three faces for. The Arabic
   school had to add one; this one would be paying for a webfont
   it already has. */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600" +
  "&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500" +
  "&family=Noto+Sans+Bengali:wght@400;500;600&family=Noto+Serif+Bengali:wght@500;600" +
  "&display=swap";

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
  <link rel="stylesheet" href="${FONTS}"
        media="print" onload="this.media='all'">
  <noscript><link rel="stylesheet" href="${FONTS}"></noscript>
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
      <p>ইংরেজির অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <script type="module" src="/app.js"></script>`;

/* `og` is a file name inside /og/. build-og.mjs both renders the
   cards and repoints every page at the right one, so the value
   here has to agree with its ASSIGN table, otherwise the two
   generators take turns overwriting each other. */
function page({ title, description, canonical, body, og = "english.png", extraScripts = "" }) {
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
<body class="english">
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
   a part page
   ============================================================ */

function prevNext(parts, index, term) {
  const prev = parts[index - 1];
  const next = parts[index + 1];
  const book = workbookUrl(term);
  const cell = (p, label) =>
    p
      ? `        <a href="${p.url}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(p.bn)}</strong>
        </a>`
      : "";

  /* The last part of a term points at that term's practice book,
     or at the next term, and the last part of the last term
     points back at the school. Reading a course through and
     being handed nothing is how someone quietly stops. */
  const termIndex = TERMS.findIndex((t) => t.slug === term.slug);
  const nextTerm = TERMS[termIndex + 1];
  const tail = next
    ? cell(next, "পরের পর্ব →")
    : book
      ? `        <a href="${book}">
          <span class="mono">এবার অনুশীলন →</span>
          <strong class="bn-h">${bn(term.workbook.days)} দিনের খাতা</strong>
        </a>`
      : nextTerm
        ? `        <a href="${termUrl(nextTerm)}">
          <span class="mono">পরের টার্ম →</span>
          <strong class="bn-h">${esc(nextTerm.kicker)} · ${esc(nextTerm.bn)}</strong>
        </a>`
        : `        <a href="/english/index.html">
          <span class="mono">শেষ পর্ব ✓</span>
          <strong class="bn-h">দুটো টার্ম একসাথে দেখুন</strong>
        </a>`;

  const cells = [cell(prev, "← আগের পর্ব"), tail].filter(Boolean);
  if (!cells.length) return "";
  return `      <nav class="prev-next" aria-label="এই টার্মের অন্য পর্ব">
${cells.join("\n")}
      </nav>`;
}

const SOON_BODY = `
<p class="soon-note">এই পর্বটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন
কী আসছে আর কোথায় ফিরে আসতে হবে।</p>
<p>এই টার্মের যে পর্বগুলো তৈরি, সেগুলো টার্মের পাতায় চিহ্নিত করা আছে। আপাতত আগের
পর্বগুলো আরেকবার জোরে পড়ুন: ক্রম মেনে এগোলে এই পর্বটা এলে অনেক সহজ লাগবে।</p>
`;

function partPage(term, parts, index, bodies) {
  const part = parts[index];
  const soon = part.status !== "live";
  const body = soon ? SOON_BODY : bodies[part.slug];

  if (!soon && !body) {
    console.warn(`  ! ${term.slug}/${part.slug} is marked live but has no text`);
  }

  const art = icon(part.icon ?? term.icon, "art lesson-art");

  return page({
    title: `${part.bn}: ${term.kicker}, ইংরেজি বাংলায়, Reiad's Library`,
    description: part.blurb,
    canonical: part.url,
    og: `english-${term.slug}.png`,
    body: `
      <article class="term-article lesson part"
               data-part-id="${esc(partId(term, part))}"
               data-term="${esc(term.slug)}"
               data-part-title="${esc(part.bn)}"${soon ? ' data-soon="1"' : ""}>
        <span class="eyebrow mono">
          <a href="${termUrl(term)}">${esc(term.kicker)} · ${esc(term.bn)}</a>
          · ${esc(part.section?.bn ?? "")}
        </span>
        <h1 class="bn-h">${art}${esc(part.bn)} ${en(part.en, "en-sub")}</h1>
        <p class="one-liner">${esc(part.blurb)}</p>
        <p class="lesson-meta mono">${esc(part.label)} · ${soon ? "আসছে" : `${bn(part.minutes)} মিনিটের পড়া`}</p>
${body || SOON_BODY}
        <p class="backlink">
          <a href="${termUrl(term)}">← ${esc(term.kicker)}-এর সব পর্ব</a>
          ${workbookUrl(term) ? `<a class="backlink-alt" href="${workbookUrl(term)}">${bn(term.workbook.days)} দিনের খাতা →</a>` : ""}
        </p>
      </article>
${prevNext(parts, index, term)}
`,
    extraScripts: `\n  <script type="module" src="/english/part.js"></script>`,
  });
}

/* ============================================================
   a term's contents page
   ============================================================ */

function termIndexPage(term, parts) {
  const total = parts.length;
  const live = parts.filter((p) => p.status === "live").length;
  const minutes = termMinutes(term);
  const book = workbookUrl(term);

  const sections = term.sections
    .map((section) => {
      const cards = section.parts
        .map((raw) => {
          const p = parts.find((x) => x.slug === raw.slug && x.section.id === section.id);
          const soon = p.status !== "live";
          return `        <a class="cell lesson-card${soon ? " is-soon" : ""}" href="${p.url}"
           data-part-id="${esc(p.id)}">
          <span class="lesson-card-art" aria-hidden="true">${icon(p.icon ?? term.icon)}</span>
          <span class="part-num mono">${esc(p.label)}</span>
          <h3 class="bn-h">${esc(p.bn)} ${en(p.en, "en-sub")}</h3>
          <p>${esc(p.blurb)}</p>
          <span class="lesson-card-foot mono">${soon ? "আসছে" : `${bn(p.minutes)} মিনিট`}</span>
        </a>`;
        })
        .join("\n");

      return `      <section id="${section.id}">
        <span class="section-label mono">${esc(section.bn)} · ${en(section.en)}</span>
        <div class="cards lesson-grid">
${cards}
        </div>
      </section>`;
    })
    .join("\n\n");

  const index = TERMS.findIndex((t) => t.slug === term.slug);
  const prev = TERMS[index - 1];
  const next = TERMS[index + 1];
  const ladderCell = (t, label) =>
    t
      ? `        <a href="${termUrl(t)}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(t.kicker)} · ${esc(t.bn)}</strong>
        </a>`
      : "";

  /* The practice book gets a band of its own, above the parts.
     It is the thing a returning learner came for, and burying it
     under thirteen cards would mean scrolling past the course to
     reach the homework every single evening. */
  const bookBand = book
    ? `      <section id="chorcha" class="no-filter">
        <span class="section-label mono">রোজকার অনুশীলন · ${en("Every day")}</span>
        <a class="cell wb-cta" href="${book}" data-workbook="${esc(term.slug)}">
          <span class="wb-cta-art" aria-hidden="true">${icon("pen")}</span>
          <span class="wb-cta-text">
            <strong class="bn-h">${bn(term.workbook.days)} দিনের অনুশীলন খাতা</strong>
            <span>দিনে একটা পাতা, একটা কাঠামো, নিজের জীবনের একটা সত্যি অনুচ্ছেদ।
            যা লিখবেন সেটা আপনার নিজের ব্রাউজারেই জমা থাকবে।</span>
          </span>
          <span class="more" data-workbook-cta>খাতা খুলুন →</span>
        </a>
      </section>

`
    /* A term with no book says so where the book would have been.
       Leaving the band out entirely reads as something missing,
       and at this level the absence is the point: the practice
       has moved off the page and into the week. */
    : term.chorcha
      ? `      <section id="chorcha" class="no-filter">
        <span class="section-label mono">রোজকার অনুশীলন · ${en("Every day")}</span>
        <div class="note">${esc(term.chorcha)}</div>
      </section>

`
      : "";

  return page({
    title: `${term.kicker} · ${term.bn}, ইংরেজি বাংলায়, Reiad's Library`,
    description: term.blurb,
    canonical: termUrl(term),
    og: `english-${term.slug}.png`,
    body: `
      <div class="hero stage-hero term-hero" data-term="${esc(term.slug)}">
        <span class="eyebrow mono">${esc(term.kicker)} · ${en(term.en)}</span>
        <h1 class="bn-h">${icon(term.icon, "art stage-art")}${esc(term.bn)}</h1>
        <p class="lede">${esc(term.blurb)}</p>
        <dl class="stage-facts">
          <div><dt>কার জন্য</dt><dd>${esc(term.who)}</dd></div>
          <div><dt>কতগুলো পর্ব</dt><dd>${bn(total)}টি${live < total ? ` (${bn(live)}টি তৈরি)` : ""}</dd></div>
          <div><dt>মোট পড়ার সময়</dt><dd>প্রায় ${bn(minutes)} মিনিট</dd></div>
          <div><dt>রোজ কতক্ষণ</dt><dd>${bn(term.minutes[0])}–${bn(term.minutes[1])} মিনিট, তার অন্তত অর্ধেক জোরে বলা</dd></div>
          ${term.workbook
            ? `<div><dt>অনুশীলন</dt><dd>${bn(term.workbook.days)} দিন, রোজ একটা পাতা${book ? "" : " (আসছে)"}</dd></div>`
            : ""}
        </dl>
        <p class="term-can">${esc(term.can)}</p>
        <div class="stage-progress" data-term-progress="${esc(term.slug)}">
          <span class="track"><i></i></span>
          <span class="count mono"></span>
        </div>
        <div class="hero-actions">
          <a class="btn btn-solid" href="${parts[0].url}" data-term-continue="${esc(term.slug)}">শুরু করুন →</a>
          <a class="btn btn-ghost" href="/english/index.html">দুটো টার্ম দেখুন</a>
        </div>
      </div>

${bookBand}${sections}

      <nav class="prev-next" aria-label="টার্মের ক্রম">
${[ladderCell(prev, "← আগের টার্ম"), ladderCell(next, "পরের টার্ম →")].filter(Boolean).join("\n")}
      </nav>

      <div class="note">এই কোর্সটা বাংলাভাষীদের জন্য লেখা। কোনো পরীক্ষার প্রস্তুতি নয়,
      কোনো সার্টিফিকেট নয়: লক্ষ্য একটাই, যেন আপনি মুখ খুলে বলতে পারেন। ভুল হলেও।</div>
`,
    extraScripts: `\n  <script type="module" src="/english/term.js"></script>`,
  });
}

/* ============================================================
   the thirty-day practice book

   Every day is written out in full. See the long note at the top
   of this file for why this is one page and not thirty.
   ============================================================ */

/* Day counts in words. The book is thirty days, and a heading
   reading "৩০টা দিন" where the German school's reads "ত্রিশটা
   দিন" would be one school counting in numerals and the other in
   words for no reason. Any length not listed falls back to the
   numeral, which reads fine and is better than a missing word. */
const BN_WORD = { 30: "ত্রিশ", 60: "ষাট", 90: "নব্বই" };
const bnWord = (n) => BN_WORD[n] ?? bn(n);

/* Everything a learner types is kept under one key per box, and
   those keys are namespaced by term from the first day, so a
   second book on Term Two cannot open showing what was written
   in the first. */
const writeKey = (term, name) => `${term.slug}/${name}`;

/* Multi-line placeholders, the only way to get a line break into
   an attribute without the markup fighting back. */
const ph = (s) => esc(s).replace(/\n/g, "&#10;");

function dayArticle(d, term, book) {
  const watch = d.watch
    .map((w) => `            <p class="line"><b lang="en">${esc(w.en)}</b><span>${esc(w.bn)}</span></p>`)
    .join("\n");

  const swap = Array.from({ length: 8 }, (_, i) =>
    `            <label class="wb-field">
              <span class="wb-num mono">${bn(i + 1)}</span>
              <textarea rows="2" data-wb-write="${esc(writeKey(term, `day-${d.n}-swap-${i + 1}`))}"
                        aria-label="দিন ${bn(d.n)}, নিজের বাক্য ${bn(i + 1)}"
                        placeholder="নিজের বাক্য…"></textarea>
            </label>`).join("\n");

  const say = d.say
    .map((s, i) =>
      `            <div class="wb-say-row">
              <span class="wb-num mono">${bn(i + 1)}</span>
              <span class="wb-say-q">${esc(s.q)}</span>
              <textarea rows="2" data-wb-write="${esc(writeKey(term, `day-${d.n}-say-${i + 1}`))}"
                        aria-label="দিন ${bn(d.n)}, অনুবাদ ${bn(i + 1)}"
                        placeholder="আগে বলো, তারপর লেখো…"></textarea>
              <span class="wb-say-a" lang="en">${esc(s.a)}</span>
            </div>`).join("\n");

  return `      <article class="wb-day" id="day-${d.n}" data-day="${d.n}" data-day-id="${esc(term.slug)}/day-${d.n}">
        <header class="wb-day-head">
          <span class="wb-day-num mono">${en("Day")} ${bn(d.n)}</span>
          <h2 lang="en">${esc(d.en)}</h2>
          <p class="wb-day-bn">${esc(d.bn)}</p>
        </header>

        <div class="shape">
          <span class="shape-label mono">${en("The pattern")} · কাঠামো</span>
          <p class="shape-line" lang="en">${esc(d.pattern.shape)}</p>
          <p class="shape-why">${esc(d.pattern.why)}</p>
          <p class="shape-eg" lang="en">${esc(d.pattern.examples)}</p>
          <p class="shape-tip">${esc(d.pattern.tip)}</p>
        </div>

        <section class="wb-block">
          <h3 class="mono">${en("Watch")} · দেখো ও তিনবার জোরে বলো</h3>
          <div class="line-list">
${watch}
          </div>
        </section>

        <section class="wb-block">
          <h3 class="mono">${en("Swap")} · একই কাঠামোয় নিজের আটটা বাক্য</h3>
          <p class="wb-hint">লেখার সময় প্রতিটা জোরে বলো। যা লেখো সেটা এই ব্রাউজারেই জমা থাকে।</p>
          <div class="wb-fields">
${swap}
          </div>
        </section>

        <section class="wb-block">
          <h3 class="mono">${en("Say it")} · আগে বলো, তারপর লেখো</h3>
          <div class="wb-say-list">
${say}
          </div>
          <button type="button" class="btn btn-ghost wb-answer-toggle" data-wb-answers="${d.n}"
                  aria-expanded="false">উত্তর দেখুন</button>
          <p class="wb-hint">আগে নিজে চেষ্টা, তারপর মিলাও। কাঠামো ঠিক থাকলে আলাদা বাক্যও সঠিক, কাঠামোটাই আসল।</p>
        </section>

        <section class="wb-block wb-heart">
          <h3 class="mono">${en("From your heart")} · নিজের মন থেকে</h3>
          <p class="wb-heart-task">${esc(d.heart.bn)}</p>
          <p class="wb-heart-en mono">${esc(d.heart.en)}</p>
          <textarea rows="4" data-wb-write="${esc(writeKey(term, `day-${d.n}-heart`))}"
                    aria-label="দিন ${bn(d.n)}, নিজের কথা"
                    placeholder="নিজের সত্যি জীবন নিয়ে লেখো…"></textarea>
        </section>

        <footer class="wb-foot">
          <button type="button" class="btn btn-solid wb-done" data-wb-done="${d.n}">
            আজকের পাতা শেষ ✓
          </button>
          <span class="wb-foot-note mono">সব জোরে বলেছি · ${esc(book.foot)}</span>
        </footer>
      </article>`;
}

function workbookPage(term) {
  const url = workbookUrl(term);
  const book = bookFor(term);
  const total = book.days.length;
  const days = book.days.map((d) => dayArticle(d, term, book)).join("\n\n");

  const tracker = book.days.map((d) =>
    `          <a class="wb-chip" href="#day-${d.n}" data-tracker-day="${d.n}">${bn(d.n)}</a>`)
    .join("\n");

  /* The sound key. Only this book carries one, and it is the one
     thing in the school that is about the mouth rather than the
     sentence: four pairs of English sounds Bangla does not have,
     which is where a Bangla speaker's accent is decided. It is
     here rather than only in the lessons because this is the
     page a learner has open while practising, and sending them
     to another tab to check whether v and w differ is how a
     practice session ends. */
  const sounds = book.sounds
    ? `      <section id="sounds" class="no-filter">
        <span class="section-label mono">${en("The sounds")} · ধ্বনির চাবি</span>
        <p class="measure">বাংলায় নেই, এমন কয়েকটা ইংরেজি ধ্বনি। এগুলো ঠিক না হলে বাকি
        সারাজীবন উচ্চারণে একটা টান থেকে যায়। রোজ পাঁচ মিনিট, আয়নার সামনে।</p>
        <details class="faq wb-sound-details">
          <summary>ধ্বনির চাবি খুলুন</summary>
          <div class="wb-sounds">
${book.sounds.map((s) =>
    `            <div class="wb-sound">
              <b>${esc(s.pair)}</b>
              <span lang="en">${esc(s.words)}</span>
              <span class="wb-sound-how">${esc(s.how)}</span>
            </div>`).join("\n")}
          </div>
        </details>
      </section>

`
    : "";

  /* The collection: two columns, the irregular pairs on one side
     and the sentences that failed on the other. Same furniture as
     the German school's, and the same reason for it: a book that
     only asks and never collects gives a learner nothing to read
     back on the day they feel they have not moved. */
  const c = book.collect;
  const collect = `      <section id="collect" class="no-filter">
        <span class="section-label mono">${en(c.en)} · ${esc(c.bn)}</span>
        <p class="measure">${esc(c.blurb)}</p>
        <div class="wb-collect">
${c.columns.map((col) => `          <label class="wb-collect-col">
            <span class="wb-collect-head" lang="en">${esc(col.head)}</span>
            <textarea rows="8" data-wb-write="${esc(writeKey(term, `${c.key}-${col.key}`))}"
                      aria-label="${esc(col.head)} তালিকা"
                      placeholder="${ph(col.placeholder)}"></textarea>
          </label>`).join("\n")}
        </div>
      </section>`;

  /* Where the band at the end points: the next term, which is
     where a learner who has done thirty days should go. */
  const index = TERMS.findIndex((t) => t.slug === term.slug);
  const next = TERMS[index + 1];

  return page({
    title: `${bn(total)} দিনের অনুশীলন খাতা: ${term.kicker}, ইংরেজি বাংলায়, Reiad's Library`,
    description:
      `দিনে একটা পাতা, একটা কাঠামো, নিজের জীবনের একটা সত্যি অনুচ্ছেদ। ইংরেজি ${term.kicker}-এর ` +
      `${bnWord(total)} দিনের অনুশীলন খাতা, বাংলায়, উত্তরমালাসহ।`,
    canonical: url,
    og: "english-workbook.png",
    body: `
      <div class="hero wb-hero" data-workbook="${esc(term.slug)}">
        <span class="eyebrow mono">${en(`The ${total}-day workbook`)} · ${esc(term.kicker)}</span>
        <h1 class="bn-h">${bn(total)} দিনের অনুশীলন খাতা</h1>
        <p class="lede">${en(book.lede.en)}<br>
        ${esc(book.lede.bn)}</p>
        <p class="wb-warning">এই খাতা পড়ার জন্য নয়, লেখার জন্য, আর জোরে বলার জন্য।
        খালি ঘরগুলো আপনার। ভরান। যা লেখেন সেটা শুধু আপনার এই ব্রাউজারেই জমা থাকে,
        কোথাও পাঠানো হয় না।</p>

        <div class="wb-progress" data-wb-progress>
          <span class="track"><i></i></span>
          <span class="count mono"></span>
        </div>

        <div class="hero-actions">
          <a class="btn btn-solid" href="#day-1" data-wb-today>আজকের পাতা খুলুন →</a>
          <a class="btn btn-ghost" href="${termUrl(term)}">${esc(term.kicker)}-এর পর্বগুলো</a>
        </div>
      </div>

      <section id="tracker" class="no-filter">
        <span class="section-label mono">${en(`Your ${total}-day tracker`)} · ${bn(total)} দিনের হিসাব</span>
        <details class="faq wb-tracker-details">
          <summary>কোন দিনগুলো বাকি, দেখুন</summary>
          <p class="measure">যে দিন সত্যিই বলেছেন ও লিখেছেন, সেই দিনটায় টিক দিন। ফাঁকা ঘর মানে
          লজ্জা নয়, মানে: কাল আবার। টিক দেওয়ার বোতামটা প্রতিটা দিনের পাতার নিচে।</p>
          <nav class="wb-tracker" aria-label="দিন বেছে নিন">
${tracker}
          </nav>
        </details>
      </section>

${sounds}${collect}

      <section id="days" class="wb">
        <span class="section-label mono">${en(`The ${total} days`)} · ${bnWord(total)}টা দিন</span>
        <nav class="wb-nav" data-wb-nav hidden aria-label="দিন বদলান"></nav>

${days}
      </section>

      <div class="band">
        <span class="mono">${en(`Day ${total + 1}`)}</span>
        <h2>এই খাতায় ${bn(total + 1)}তম দিন নেই</h2>
        <p>${en(book.end.en)}
        ${esc(book.end.bn)}</p>
        <div class="hero-actions">
          ${next ? `<a class="btn btn-solid" href="${termUrl(next)}">${esc(next.kicker)} দেখুন →</a>` : ""}
          <a class="btn btn-ghost" href="${termUrl(term)}">পর্বগুলোয় ফিরুন</a>
        </div>
      </div>

      <div class="note">${en(book.motto.en)}
      ${esc(book.motto.bn)}</div>
`,
    extraScripts: `\n  <script type="module" src="/english/workbook.js"></script>`,
  });
}

/* ============================================================
   go
   ============================================================ */

/* Only the practice books. See the note in
   `aab/deutsch/build-deutsch.mjs`, which says the same thing
   about the same change: a term's ladder and its part pages are
   a Next.js route now, and writing them here as well would put a
   file back at an address a Worker already answers.

   The book stays a file: thirty days written out in full, the
   same for every reader, none of it in the database, and
   `workbook.data.js` beside this file is where it lives. */
let pages = 0;

for (const term of TERMS) {
  if (!workbookUrl(term)) {
    console.log(`${term.slug.padEnd(7)} no practice book`);
    continue;
  }
  const dir = join(OUT, "english", term.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, `${term.workbook.slug}.html`), workbookPage(term));
  pages++;
  console.log(`${term.slug.padEnd(7)} ${dayCount(term)}-day workbook`);
}

console.log(
  `\n${pages} page(s) written for ${SCHOOL.en}. ` +
  `Now run: node aab/build-meta.mjs && node aab/check-routes.mjs`
);
