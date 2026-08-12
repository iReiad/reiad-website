#!/usr/bin/env node
/* ============================================================
   build-lessons.mjs — writes the Learn area's pages.

       node aab/learn/build-lessons.mjs

   Like build-meta.mjs, this is NOT a build step. It is a
   generator you run when you change something, and what it
   writes is committed as ordinary static files. The site never
   depends on it having been run.

   Why generate rather than hand-write:
   every lesson page is the same shell — head, fonts, header,
   footer, the modal reader markup — around a different body.
   Forty hand-copied shells drift apart within a month, and the
   first thing to rot is the part nobody looks at (the meta tags
   and the breadcrumb hooks). One template can't drift.

   It writes:
     /learn/<stage>/index.html    a stage's contents page
     /learn/<stage>/<slug>.html   one page per lesson

   It never touches:
     /learn/index.html            the hub — hand-written, because
                                  the starter guide lives in it
     /learn/terms/*.html          the original eighteen. Their
                                  URLs and their text are exactly
                                  where they were.

   Lesson text comes from ./lessons/<stage>.js. A lesson with no
   text there gets a proper "আসছে" page rather than a 404 — a
   listed thing must always be a place you can go.

   ------------------------------------------------------------
   BEFORE YOU RUN THIS: IT WILL REWRITE MORE THAN YOU EXPECT

   The committed pages and this template have drifted. Several
   lesson blurbs and titles were edited on the pages themselves
   (mostly a comma tightened into a colon — "কমিশন, স্প্রেড আর
   ভুলের সময়: …"), and curriculum.js never caught up. Page titles
   drifted the same way: the pages join every part with " · ",
   including inside a lesson name, where this file uses ", ".

   So a run today rewrites about seventy pages, and most of that
   diff is the published wording being reverted to the older
   version in curriculum.js — not what anyone running a generator
   is trying to do.

   Reconcile it deliberately, in its own change: decide which
   wording is right, put it in curriculum.js, run this once, and
   read the diff. Until then, `git diff` after every run and keep
   only the lines you meant.
   ------------------------------------------------------------
   ============================================================ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const AAB = join(HERE, "..");

const {
  STAGES, stageLessons, stageUrl, stageMinutes, stageCount, lessonId, lessonUrl,
} = await import(join(HERE, "curriculum.js"));
const { icon } = await import(join(HERE, "icons.js"));

/* Lesson bodies, one module per stage. A stage with no file is
   entirely "coming soon" and that is a valid state. */
async function bodiesFor(stage) {
  const file = join(HERE, "lessons", `${stage.slug}.js`);
  if (!existsSync(file)) return {};
  return (await import(file)).default ?? {};
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Bangla numerals. These pages are lang="bn" throughout, and a
   count rendered as "21টি" next to prose full of ২১ reads as a
   glitch. Same helper as hub.js and stage.js. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* ============================================================
   the shared shell
   ============================================================ */

/* Theme AND audience, before first paint. Identical in every
   page of the site: see the note in styles.css about why the
   audience attribute has to land this early. */
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
  <link rel="alternate" type="application/rss+xml" title="Reiad's Library · Insights" href="/feed.xml">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="og:site_name" content="Reiad's Library">
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
        Reiad's Library
      </a>
      <nav aria-label="Main">
        <a href="/learn/index.html" data-keep aria-current="page">Learn</a>
        <a href="/deutsch/index.html">Deutsch</a>
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
      <span class="mono">Reiad's Library · Finance &amp; Bangladesh markets</span>
      <p>এই সাইটের সবকিছু সাধারণ শিক্ষামূলক তথ্য: বিনিয়োগ পরামর্শ না। টাকা কোথাও রাখার আগে নিজে যাচাই করুন।</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <!-- Modal reader -->
  <div id="reader" hidden role="dialog" aria-modal="true" aria-label="Term reader">
    <div class="reader-panel">
      <div class="reader-bar">
        <button class="icon-btn" id="reader-back" hidden aria-label="আগের লেখায় ফিরুন">← ফিরুন</button>
        <a id="reader-full" class="mono" href="#">পুরো পেজে পড়ুন ↗</a>
        <button class="icon-btn" id="reader-close" aria-label="বন্ধ করুন">✕</button>
      </div>
      <div class="reader-body" id="reader-body"></div>
    </div>
  </div>

  <script type="module" src="/app.js"></script>
  <script type="module" src="/learn/learn.js"></script>`;

/* `og` is a file name inside /og/, not a full URL. build-og.mjs
   renders one share image per stage — stage-basics-2.png and
   friends, all of them committed — and the published pages point
   at them. This generator used to hard-code /og/learn.png for
   every page, so running it silently replaced each per-stage
   image with the generic one. It is an argument now. */
function page({ title, description, canonical, body, og = "learn.png", extraScripts = "" }) {
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
  <meta property="og:image" content="https://reiad.co.uk/og/${og}">
${PREPAINT}
${HEAD_TAIL}
</head>
<body>
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
   a lesson page
   ============================================================ */

function prevNext(lessons, index) {
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  if (!prev && !next) return "";
  const cell = (l, label) =>
    l
      ? `        <a href="${l.url}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(l.bn)}</strong>
        </a>`
      : "";
  return `      <nav class="prev-next" aria-label="এই ধাপের অন্য লেখা">
${[cell(prev, "← আগের লেখা"), cell(next, "পরের লেখা →")].filter(Boolean).join("\n")}
      </nav>`;
}

const SOON_BODY = `
<p class="soon-note">এই লেখাটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন কী আসছে
এবং কোথায় ফিরে আসতে হবে।</p>
<p>এই ধাপের যে লেখাগুলো তৈরি, সেগুলো ধাপের পাতায় চিহ্নিত করা আছে। আপাতত আগের ধাপগুলো
পুরো করে নিতে পারেন: ক্রম মেনে এগোলে এই লেখাটা এলে অনেক সহজ লাগবে।</p>
`;

function lessonPage(stage, lessons, index, bodies) {
  const lesson = lessons[index];
  const soon = lesson.status !== "live";
  const body = soon ? SOON_BODY : bodies[lesson.slug];

  if (!soon && !body) {
    console.warn(`  ! ${stage.slug}/${lesson.slug} is marked live but has no text`);
  }

  const art = icon(lesson.icon ?? stage.icon, "art lesson-art");

  return page({
    title: `${lesson.bn}: ${stage.bn}, শেখার লাইব্রেরি, Reiad's Library`,
    description: lesson.blurb,
    canonical: lesson.url,
    og: `stage-${stage.slug}.png`,
    body: `
      <article class="term-article lesson"
               data-lesson-id="${esc(lessonId(stage, lesson))}"
               data-stage="${esc(stage.slug)}"
               data-lesson-title="${esc(lesson.bn)}"${soon ? ' data-soon="1"' : ""}>
        <span class="eyebrow mono">
          <a href="${stageUrl(stage)}">${esc(stage.kicker)} · ${esc(stage.bn)}</a>
          · ${esc(lesson.section?.bn ?? "")}
        </span>
        <h1 class="bn-h">${art}${esc(lesson.bn)} <span class="en-sub">${esc(lesson.en)}</span></h1>
        <p class="one-liner">${esc(lesson.blurb)}</p>
        <p class="lesson-meta mono">${soon ? "আসছে" : `${bn(lesson.minutes)} মিনিটের পড়া`}</p>
${body || SOON_BODY}
        <p class="backlink">
          <a href="${stageUrl(stage)}">← ${esc(stage.bn)}-এর সব লেখা</a>
          <a class="backlink-alt" href="/learn/contents.html">সব বিষয় এক নজরে →</a>
        </p>
      </article>
${prevNext(lessons, index)}
`,
  });
}

/* ============================================================
   a stage index page
   ============================================================ */

function stageIndexPage(stage, lessons) {
  const { total, live } = {
    total: lessons.length,
    live: lessons.filter((l) => l.status === "live").length,
  };
  const minutes = stageMinutes(stage);

  const sections = stage.sections
    .map((section) => {
      const cards = section.lessons
        .map((raw) => {
          const l = lessons.find((x) => x.slug === raw.slug && x.section.id === section.id);
          const soon = l.status !== "live";
          return `        <a class="cell lesson-card${soon ? " is-soon" : ""}" href="${l.url}"
           data-lesson-id="${esc(l.id)}">
          <span class="lesson-card-art" aria-hidden="true">${icon(l.icon ?? stage.icon)}</span>
          <h3 class="bn-h">${esc(l.bn)} <span class="en-sub">${esc(l.en)}</span></h3>
          <p>${esc(l.blurb)}</p>
          <span class="lesson-card-foot mono">${soon ? "আসছে" : `${bn(l.minutes)} মিনিট`}</span>
        </a>`;
        })
        .join("\n");

      return `      <section id="${section.id}">
        <span class="section-label mono">${esc(section.bn)} · ${esc(section.en)}</span>
        <div class="cards lesson-grid">
${cards}
        </div>
      </section>`;
    })
    .join("\n\n");

  const index = STAGES.findIndex((s) => s.slug === stage.slug);
  const prev = STAGES[index - 1];
  const next = STAGES[index + 1];
  const ladderCell = (s, label) =>
    s
      ? `        <a href="${s.slug === "start" ? "/learn/index.html#starter" : stageUrl(s)}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(s.kicker)} · ${esc(s.bn)}</strong>
        </a>`
      : "";

  return page({
    title: `${stage.kicker} · ${stage.bn}, শেখার লাইব্রেরি, Reiad's Library`,
    description: stage.blurb,
    canonical: stageUrl(stage),
    og: `stage-${stage.slug}.png`,
    body: `
      <div class="hero stage-hero" data-stage="${esc(stage.slug)}">
        <span class="eyebrow mono">${esc(stage.kicker)} · ${esc(stage.en)}</span>
        <h1 class="bn-h">${icon(stage.icon, "art stage-art")}${esc(stage.bn)}</h1>
        <p class="lede">${esc(stage.blurb)}</p>
        <dl class="stage-facts">
          <div><dt>কার জন্য</dt><dd>${esc(stage.who)}</dd></div>
          <div><dt>কতগুলো লেখা</dt><dd>${bn(total)}টি${live < total ? ` (${bn(live)}টি তৈরি)` : ""}</dd></div>
          <div><dt>মোট সময়</dt><dd>প্রায় ${bn(minutes)} মিনিট</dd></div>
        </dl>
        <div class="stage-progress" data-stage-progress="${esc(stage.slug)}">
          <span class="track"><i></i></span>
          <span class="count mono"></span>
        </div>
        <div class="hero-actions">
          <a class="btn btn-solid" href="${lessons[0].url}" data-stage-continue="${esc(stage.slug)}">শুরু করুন →</a>
          <a class="btn btn-ghost" href="/learn/index.html">সব ধাপ দেখুন</a>
        </div>
      </div>

${sections}

      <nav class="prev-next" aria-label="ধাপের ক্রম">
${[ladderCell(prev, "← আগের ধাপ"), ladderCell(next, "পরের ধাপ →")].filter(Boolean).join("\n")}
      </nav>

      <p class="contents-footlink">
        <a href="/learn/contents.html">সব বিষয় এক নজরে, পুরো সূচিপত্র →</a>
      </p>

      <div class="note">এই লাইব্রেরির সবকিছু সাধারণ শিক্ষামূলক তথ্য: বিনিয়োগ পরামর্শ না।
      নিয়ম, হার আর ফি সময়ে সময়ে বদলায়; সিদ্ধান্তের আগে সংশ্লিষ্ট প্রতিষ্ঠানের সর্বশেষ তথ্য দেখে নিন।</div>
`,
    extraScripts: `\n  <script type="module" src="/learn/stage.js"></script>`,
  });
}

/* ============================================================
   the full contents page

   This used to be a section on the hub, where it was 39% of the
   page on a laptop and 43% on a phone; the reader had to scroll
   past ninety lesson rows to reach the FAQ. A complete index is
   genuinely useful, but it is a reference, not something you read
   on the way somewhere. So it gets its own page, linked from the
   bottom of the hub and of every stage.

   Written out in full rather than built by JavaScript: it is the
   one page whose entire job is being a complete list, so it
   should still be a complete list with scripts off, and search
   engines should see every title.
   ============================================================ */

function contentsPage() {
  const stages = STAGES.map((stage) => {
    const lessons = stageLessons(stage);
    const sections = stage.sections
      .map((section) => {
        const rows = section.lessons
          .map((raw) => {
            const l = lessons.find(
              (x) => x.slug === raw.slug && x.section.id === section.id
            );
            const soon = l.status !== "live";
            return `            <li class="contents-row"${soon ? ' data-soon="1"' : ""} data-lesson-id="${esc(l.id)}">
              <a class="bn-h" href="${l.url}">${esc(l.bn)}</a>
              <span class="contents-en">${esc(l.en)}</span>
              <span class="contents-min mono">${soon ? "আসছে" : `${bn(l.minutes)} মি`}</span>
            </li>`;
          })
          .join("\n");
        return `        <div class="contents-section">
          <h3 class="mono">${esc(section.bn)} · ${esc(section.en)}</h3>
          <ul class="contents-list">
${rows}
          </ul>
        </div>`;
      })
      .join("\n");

    const { total, live } = stageCount(stage);
    const href = stage.inline ? "/learn/index.html#starter" : stageUrl(stage);

    return `      <section class="contents-stage" id="c-${stage.slug}">
        <div class="contents-stage-head">
          <span class="contents-art" aria-hidden="true">${icon(stage.icon)}</span>
          <div>
            <span class="mono contents-kicker">${esc(stage.kicker)}</span>
            <h2 class="bn-h"><a href="${href}">${esc(stage.bn)}</a>
              <span class="en-sub">${esc(stage.en)}</span></h2>
            <p class="contents-who">${esc(stage.who)}</p>
          </div>
          <span class="contents-tally mono">${bn(live)}/${bn(total)}</span>
        </div>
${sections}
      </section>`;
  }).join("\n\n");

  /* the A–Z of stage 1, which was also on the hub and belongs with
     the rest of the index rather than in the middle of a course */
  const terms = stageLessons(findStageBySlug("basics-1"));
  const byLetter = new Map();
  [...terms].sort((a, b) => a.en.localeCompare(b.en)).forEach((t) => {
    const letter = t.en[0].toUpperCase();
    if (!byLetter.has(letter)) byLetter.set(letter, []);
    byLetter.get(letter).push(t);
  });

  const azNav = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"]
    .map((L) => (byLetter.has(L) ? `<a href="#az-${L}">${L}</a>` : `<span>${L}</span>`))
    .join("");

  const azRows = [...byLetter.entries()]
    .map(([letter, group]) =>
      `        <div class="section-label mono" id="az-${letter}" style="margin:22px 0 6px;border:0;padding:0">${letter}</div>\n` +
      group
        .map((t) => `        <div class="g-row" data-lesson-id="${esc(t.id)}">
          <a class="term bn-h" href="${t.url}">${esc(t.bn)}</a>
          <span class="en">${esc(t.en)}: ${esc(t.section.en)}</span>
        </div>`)
        .join("\n")
    )
    .join("\n");

  const totals = STAGES.reduce(
    (acc, s) => {
      const c = stageCount(s);
      acc.total += c.total;
      acc.live += c.live;
      return acc;
    },
    { total: 0, live: 0 }
  );

  return page({
    title: "সব বিষয় এক নজরে, শেখার লাইব্রেরি, Reiad's Library",
    description:
      "শেখার লাইব্রেরির প্রতিটা লেখা এক পাতায়: আট ধাপের পুরো তালিকা, আর ইংরেজি বর্ণানুক্রমে শব্দকোষ।",
    canonical: "/learn/contents.html",
    og: "contents.png",
    body: `
      <div class="hero">
        <span class="eyebrow mono">শেখার লাইব্রেরি · সূচিপত্র</span>
        <h1 class="bn-h">সব বিষয় এক নজরে</h1>
        <p class="lede">লাইব্রেরির প্রতিটা লেখা, ধাপ অনুযায়ী সাজানো: মোট ${bn(totals.total)}টি,
        যার ${bn(totals.live)}টি এখন পড়া যায়। যেটা পড়া হয়ে গেছে সেটায় টিক চিহ্ন;
        টিকগুলো আপনার নিজের ব্রাউজারে জমা থাকে, কোথাও পাঠানো হয় না।</p>
        <search>
          <input type="search" id="contents-filter" placeholder="খুঁজুন… (যেমন: ব্রোকার, ঝুঁকি, নগদ)" aria-label="লেখা খুঁজুন">
        </search>
        <div id="contents-count" class="filter-count mono" hidden></div>
        <nav class="contents-jump" aria-label="ধাপে যান">
${STAGES.map((s) => `          <a href="#c-${s.slug}">${esc(s.kicker)}</a>`).join("\n")}
        </nav>
      </div>

${stages}

      <section id="glossary-section">
        <span class="section-label mono">A–Z · শব্দকোষ</span>
        <p class="measure" style="color:var(--ink-soft);font-size:0.95rem">
          ভিত্তি ধাপ ১-এর আঠারোটা শব্দ ইংরেজি বর্ণানুক্রমে: ইংরেজি নামটা জানা থাকলে এখান থেকেই দ্রুত খুঁজে নিন।
        </p>
        <div class="az">${azNav}</div>
        <div class="glossary">
${azRows}
        </div>
      </section>

      <div class="band">
        <span class="mono">ফিরে যান</span>
        <h2>ধাপে ধাপে পড়তে চান?</h2>
        <p>সূচিপত্র রেফারেন্সের জন্য। শেখার সাজানো পথটা আছে শেখার লাইব্রেরির মূল পাতায়,
           হাতেখড়ি দিয়ে শুরু, তারপর এক ধাপ করে।</p>
        <div class="hero-actions">
          <a class="btn btn-solid" href="/learn/index.html">শেখার লাইব্রেরিতে যান →</a>
        </div>
      </div>
`,
    extraScripts: `\n  <script type="module" src="/learn/contents.js"></script>`,
  });
}

/* build-lessons imports findStage under a clearer local name, since
   `stage` is the loop variable everywhere below */
function findStageBySlug(slug) {
  return STAGES.find((s) => s.slug === slug);
}

/* ============================================================
   go
   ============================================================ */

let pages = 0;

for (const stage of STAGES) {
  const lessons = stageLessons(stage);
  const dir = join(AAB, "learn", stage.slug);
  mkdirSync(dir, { recursive: true });

  // Every stage gets a contents page, including the starter guide,
  // whose steps live on the hub. Its index simply points back there,
  // so /learn/start/ is never a dead URL.
  writeFileSync(join(dir, "index.html"), stageIndexPage(stage, lessons));
  pages++;

  // The starter guide's steps are hub anchors, and basics-1's pages
  // already exist at /learn/terms/. Neither gets generated lesson files.
  if (stage.inline || stage.base) {
    console.log(`${stage.slug.padEnd(10)} index only (${lessons.length} lessons live elsewhere)`);
    continue;
  }

  const bodies = await bodiesFor(stage);
  lessons.forEach((lesson, i) => {
    writeFileSync(join(dir, `${lesson.slug}.html`), lessonPage(stage, lessons, i, bodies));
    pages++;
  });

  const written = lessons.filter((l) => l.status === "live").length;
  console.log(`${stage.slug.padEnd(10)} ${lessons.length} lesson page(s), ${written} written`);
}

writeFileSync(join(AAB, "learn", "contents.html"), contentsPage());
pages++;
console.log(`contents   1 page, every lesson listed`);

console.log(`\n${pages} page(s) written. Now run: node aab/build-meta.mjs && node aab/check-routes.mjs`);
