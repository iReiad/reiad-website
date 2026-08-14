#!/usr/bin/env node
/* ============================================================
   build-quran.mjs, writes the Quranic Arabic school's pages.

       node aab/quran/build-quran.mjs

   Like build-deutsch.mjs and build-lessons.mjs, this is NOT a
   build step. It is a generator you run when you change
   something, and what it writes is committed as ordinary static
   files. The site never depends on it having been run.

   It writes:
     /quran/<dhap>/index.html        a ধাপ's contents page
     /quran/<dhap>/<lesson>.html     one page per day

   It never touches:
     /quran/index.html               the school hub, hand-written,
                                     because the "how this works"
                                     section lives in it

   Lesson text comes from ./content/<dhap>.js. A lesson with no
   text there gets a proper "আসছে" page rather than a 404: a
   listed thing must always be a place you can go.

   ------------------------------------------------------------
   THE ONE THING THIS BUILDER DOES THAT THE OTHERS DO NOT

   It sets up Arabic. Two schools before this one were written in
   Bangla and a Latin-script language, which share a direction
   and a font stack. Arabic shares neither, so:

     · the webfont link carries Noto Naskh Arabic, and only these
       pages pay for it
     · every piece of Arabic is wrapped with lang="ar", and every
       piece that stands on its own also carries dir="rtl"

   The dir matters more than it looks. A Bangla sentence with one
   Arabic word in it is handled by the browser's bidi algorithm
   and needs nothing. But an Arabic PHRASE with punctuation or a
   number in it will have that punctuation flung to the wrong end
   unless the element says which way it runs. Getting this wrong
   does not look like a bug, it looks like a typo in the Quran,
   which is the one kind of typo this site must not ship.
   ============================================================ */

import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const AAB = join(HERE, "..");

const {
  DHAPS, SCHOOL, dhapLessons, dhapUrl, dhapMinutes, dhapCount, dhapDays,
  totalDays, lessonId,
} = await import(join(HERE, "curriculum.js"));
const { icon } = await import(join(HERE, "icons.js"));

/* The course promises sixty days on its own first slide, and the
   stage pages add up to whatever the lessons actually cover. If
   those two ever disagree, the promise is the thing that would
   quietly become a lie, so fail here instead. */
if (totalDays() !== 60) {
  console.error(
    `\nThe lessons now cover ${totalDays()} days, but this course is sold as sixty.\n` +
    "Either the days are wrong or the promise is. Nothing was written.\n"
  );
  process.exit(1);
}

/* Lesson bodies, one module per ধাপ. A ধাপ with no file is
   entirely "coming soon" and that is a valid state. */
async function bodiesFor(dhap) {
  const file = join(HERE, "content", `${dhap.slug}.js`);
  if (!existsSync(file)) return {};
  return (await import(file)).default ?? {};
}

const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* Bangla numerals. These pages are lang="bn" throughout, and a
   count rendered as "14টি" next to prose full of ১৪ reads as a
   glitch. Same helper as both other schools use. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* A standalone piece of Arabic: right to left, and tagged as
   Arabic so a screen reader switches voice and the browser picks
   the Naskh face rather than guessing. */
const ar = (s, cls) =>
  `<span lang="ar" dir="rtl"${cls ? ` class="${cls}"` : ""}>${esc(s)}</span>`;

/* ============================================================
   the shared shell

   Kept in step with build-deutsch.mjs and build-lessons.mjs on
   purpose. If you change the canonical link, the Open Graph
   tags, the header or the webfont line, change it in all three
   or the schools drift away from the rest of the site one deploy
   at a time. The ONE deliberate difference is the Arabic font.
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

/* Noto Naskh Arabic is on this line and on no other page's,
   because no other page has Arabic on it. It is a Naskh rather
   than a Kufi or a Nastaliq because Naskh is what a mushaf is
   set in, and a learner matching what they see here against what
   they see in their own copy should not have to translate
   between two letterforms while doing it. */
const FONTS =
  "https://fonts.googleapis.com/css2?family=Spectral:wght@400;500;600" +
  "&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500" +
  "&family=Noto+Sans+Bengali:wght@400;500;600&family=Noto+Serif+Bengali:wght@500;600" +
  "&family=Noto+Naskh+Arabic:wght@400;500;700&display=swap";

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
        <a href="/learn/index.html" data-keep>Learn</a>
        <a href="/skills/index.html" data-nav-skills aria-current="page">Skills</a>
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
      <p>কুরআনের আরবির অংশটা বিনামূল্যে, বাংলায়, আর কোনো লগইন ছাড়া। আপনার অগ্রগতি আপনার নিজের ব্রাউজারেই থাকে।</p>
      <p style="margin-top:10px"><a href="mailto:i@reiad.co.uk">i@reiad.co.uk</a></p>
    </div>
  </footer>

  <script type="module" src="/app.js"></script>`;

/* `og` is a file name inside /og/. build-og.mjs both renders the
   cards and repoints every page at the right one, so the value
   here has to agree with its ASSIGN table, otherwise the two
   generators take turns overwriting each other. */
function page({ title, description, canonical, body, og = "quran.png", extraScripts = "" }) {
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
<body class="quran">
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

function prevNext(lessons, index, dhap) {
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const cell = (l, label) =>
    l
      ? `        <a href="${l.url}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(l.bn)}</strong>
        </a>`
      : "";

  /* The last day of a ধাপ points at the next ধাপ, and the last
     day of the last ধাপ points back at the school. Reading a
     stage through and being handed nothing is how someone
     quietly stops on day 10 of 60. */
  const dhapIndex = DHAPS.findIndex((d) => d.slug === dhap.slug);
  const nextDhap = DHAPS[dhapIndex + 1];
  const tail = next
    ? cell(next, "পরের দিন →")
    : nextDhap
      ? `        <a href="${dhapUrl(nextDhap)}">
          <span class="mono">পরের ধাপ →</span>
          <strong class="bn-h">${esc(nextDhap.kicker)} · ${esc(nextDhap.bn)}</strong>
        </a>`
      : `        <a href="/quran/index.html">
          <span class="mono">ষাট দিন শেষ ✓</span>
          <strong class="bn-h">তিনটা ধাপ একসাথে দেখুন</strong>
        </a>`;

  const cells = [cell(prev, "← আগের দিন"), tail].filter(Boolean);
  if (!cells.length) return "";
  return `      <nav class="prev-next" aria-label="এই ধাপের অন্য দিন">
${cells.join("\n")}
      </nav>`;
}

const SOON_BODY = `
<p class="soon-note">এই দিনটা এখনো লেখা হয়নি, কিন্তু জায়গাটা রাখা আছে, যাতে আপনি জানেন
কী আসছে আর কোথায় ফিরে আসতে হবে।</p>
<p>এই ধাপের যে দিনগুলো তৈরি, সেগুলো ধাপের পাতায় চিহ্নিত করা আছে। আপাতত আগের দিনগুলো
আরেকবার জোরে পড়ুন: ক্রম মেনে এগোলে এই দিনটা এলে অনেক সহজ লাগবে।</p>
`;

function lessonPage(dhap, lessons, index, bodies) {
  const lesson = lessons[index];
  const soon = lesson.status !== "live";
  const body = soon ? SOON_BODY : bodies[lesson.slug];

  if (!soon && !body) {
    console.warn(`  ! ${dhap.slug}/${lesson.slug} is marked live but has no text`);
  }

  const art = icon(lesson.icon ?? dhap.icon, "art lesson-art");

  return page({
    title: `${lesson.bn}: ${dhap.kicker}, কুরআনের আরবি, Reiad's Library`,
    description: lesson.blurb,
    canonical: lesson.url,
    og: `quran-${dhap.slug}.png`,
    body: `
      <article class="term-article lesson dars"
               data-lesson-id="${esc(lessonId(dhap, lesson))}"
               data-dhap="${esc(dhap.slug)}"
               data-lesson-title="${esc(lesson.bn)}"${soon ? ' data-soon="1"' : ""}>
        <span class="eyebrow mono">
          <a href="${dhapUrl(dhap)}">${esc(dhap.kicker)} · ${esc(dhap.bn)}</a>
          · ${esc(lesson.section?.bn ?? "")}
        </span>
        <h1 class="bn-h">${art}${esc(lesson.bn)} ${ar(lesson.ar, "ar-sub")}</h1>
        <p class="one-liner">${esc(lesson.blurb)}</p>
        <p class="lesson-meta mono">${esc(lesson.label)} · ${soon ? "আসছে" : `${bn(lesson.minutes)} মিনিটের পড়া`}</p>
${body || SOON_BODY}
        <p class="backlink">
          <a href="${dhapUrl(dhap)}">← ${esc(dhap.kicker)}-এর সব দিন</a>
        </p>
      </article>
${prevNext(lessons, index, dhap)}
`,
    extraScripts: `\n  <script type="module" src="/quran/dars.js"></script>`,
  });
}

/* ============================================================
   a ধাপ's contents page
   ============================================================ */

function dhapIndexPage(dhap, lessons) {
  const total = lessons.length;
  const live = lessons.filter((l) => l.status === "live").length;
  const minutes = dhapMinutes(dhap);
  const days = dhapDays(dhap);

  const sections = dhap.sections
    .map((section) => {
      const cards = section.lessons
        .map((raw) => {
          const l = lessons.find((x) => x.slug === raw.slug && x.section.id === section.id);
          const soon = l.status !== "live";
          return `        <a class="cell lesson-card${soon ? " is-soon" : ""}" href="${l.url}"
           data-lesson-id="${esc(l.id)}">
          <span class="lesson-card-art" aria-hidden="true">${icon(l.icon ?? dhap.icon)}</span>
          <span class="dars-day mono">${esc(l.label)}</span>
          <h3 class="bn-h">${esc(l.bn)} ${ar(l.ar, "ar-sub")}</h3>
          <p>${esc(l.blurb)}</p>
          <span class="lesson-card-foot mono">${soon ? "আসছে" : `${bn(l.minutes)} মিনিট`}</span>
        </a>`;
        })
        .join("\n");

      return `      <section id="${section.id}">
        <span class="section-label mono">${esc(section.bn)} · ${ar(section.ar)}</span>
        <div class="cards lesson-grid">
${cards}
        </div>
      </section>`;
    })
    .join("\n\n");

  const index = DHAPS.findIndex((d) => d.slug === dhap.slug);
  const prev = DHAPS[index - 1];
  const next = DHAPS[index + 1];
  const ladderCell = (d, label) =>
    d
      ? `        <a href="${dhapUrl(d)}">
          <span class="mono">${label}</span>
          <strong class="bn-h">${esc(d.kicker)} · ${esc(d.bn)}</strong>
        </a>`
      : "";

  return page({
    title: `${dhap.kicker} · ${dhap.bn}, কুরআনের আরবি, Reiad's Library`,
    description: dhap.blurb,
    canonical: dhapUrl(dhap),
    og: `quran-${dhap.slug}.png`,
    body: `
      <div class="hero stage-hero dhap-hero" data-dhap="${esc(dhap.slug)}">
        <span class="eyebrow mono">${esc(dhap.kicker)} · ${ar(dhap.ar)}</span>
        <h1 class="bn-h">${icon(dhap.icon, "art stage-art")}${esc(dhap.bn)}</h1>
        <p class="lede">${esc(dhap.blurb)}</p>
        <dl class="stage-facts">
          <div><dt>কার জন্য</dt><dd>${esc(dhap.who)}</dd></div>
          <div><dt>কত দিন</dt><dd>${bn(days)} দিন, ${bn(total)}টি পাঠে${live < total ? ` (${bn(live)}টি তৈরি)` : ""}</dd></div>
          <div><dt>রোজ কতক্ষণ</dt><dd>${bn(dhap.minutes[0])}–${bn(dhap.minutes[1])} মিনিট</dd></div>
          <div><dt>মোট পড়ার সময়</dt><dd>প্রায় ${bn(minutes)} মিনিট</dd></div>
        </dl>
        <p class="stufe-can">${esc(dhap.can)}</p>
        <div class="stage-progress" data-dhap-progress="${esc(dhap.slug)}">
          <span class="track"><i></i></span>
          <span class="count mono"></span>
        </div>
        <div class="hero-actions">
          <a class="btn btn-solid" href="${lessons[0].url}" data-dhap-continue="${esc(dhap.slug)}">শুরু করুন →</a>
          <a class="btn btn-ghost" href="/quran/index.html">তিনটা ধাপ দেখুন</a>
        </div>
      </div>

${sections}

      <nav class="prev-next" aria-label="ধাপের ক্রম">
${[ladderCell(prev, "← আগের ধাপ"), ladderCell(next, "পরের ধাপ →")].filter(Boolean).join("\n")}
      </nav>

      <div class="note">এই কোর্সটা তাঁদের জন্য যাঁরা আরবি পড়তে পারেন কিন্তু মানে বোঝেন না।
      কোনো লেখা নেই, কোনো পরীক্ষা নেই: শুধু রোজ একটু করে চেনা, শোনা আর অনুভব করা।</div>
`,
    extraScripts: `\n  <script type="module" src="/quran/dhap.js"></script>`,
  });
}

/* ============================================================
   go
   ============================================================ */

let pages = 0;

for (const dhap of DHAPS) {
  const lessons = dhapLessons(dhap);
  const dir = join(AAB, "quran", dhap.slug);
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, "index.html"), dhapIndexPage(dhap, lessons));
  pages++;

  const bodies = await bodiesFor(dhap);
  lessons.forEach((lesson, i) => {
    writeFileSync(join(dir, `${lesson.slug}.html`), lessonPage(dhap, lessons, i, bodies));
    pages++;
  });

  console.log(`${dhap.slug.padEnd(7)} ${lessons.length} lesson page(s) over ` +
    `${dhapDays(dhap)} day(s), ${dhapCount(dhap).live} written`);
}

console.log(
  `\n${pages} page(s) written for ${SCHOOL.en}, ${totalDays()} days in all. ` +
  `Now run: node aab/build-meta.mjs && node aab/check-routes.mjs`
);
