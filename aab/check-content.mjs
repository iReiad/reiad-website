#!/usr/bin/env node
/* ============================================================
   check-content.mjs, catch a page that has stopped telling the
   truth about the site.

       node aab/check-content.mjs

   THE BUG THIS EXISTS FOR

   Three case studies were written, given their own pages, added
   to content.js, and published. The portfolio page kept listing
   four, because its cards are markup and markup does not know
   that a fourth, fifth and sixth file appeared next to it. The
   same week, the stock check was described as "thirty-eight
   ratios" on one page, "thirty-odd" on four others and "more than
   thirty-six" in Bangla, for a model that scores forty-four.

   Nobody wrote a wrong number. Each one was right when it was
   typed, and then the thing it counted grew. check-routes looks
   at links, check-css looks at selectors, check-sw looks at
   caches, and nothing looked at whether the site's sentences
   still matched the site.

   WHAT IT CHECKS

   1. EVERY CASE STUDY IS REACHABLE. A page in /portfolio/ that
      looks like a case study must have an entry in PAGES (which
      is what puts it in the menu, the palette and the sitemap)
      and a link on portfolio.html (which is what a human finds).
      Either one missing is the exact failure above.

   2. EVERY PAGES ENTRY EXISTS. A manifest pointing at a file
      that was renamed is a dead link in the menu of every page
      on the site.

   3. [data-count] SLOTS ARE HONEST. app.js fills these from
      COUNTS at runtime, and the number left in the markup is the
      fallback for a reader with no JavaScript. A fallback nobody
      re-checks is the old bug wearing a hat, so it has to match
      the computed value, in Latin or Bangla digits.

   4. TYPED COUNTS AGREE WITH THE DATA. Some numbers cannot be a
      slot: a <meta> description, a blurb inside content.js, a
      sentence in a comment. Those are listed in CLAIMS below with
      the count they encode, and checked against COUNTS.

   5. THE TWO COUNTS content.js CANNOT COMPUTE. `ratios` and
      `pillars` describe /tools/stock.model.js, which content.js
      deliberately does not import: it would pull a thousand lines
      of scoring maths into every page on the site to print one
      number. They are typed in COUNTS and asserted here instead.

   ADDING A CASE STUDY, or any page with a count in its copy:
   put it in PAGES, link it from the page that lists its kind,
   and prefer a [data-count] slot over typing the number. If a
   sentence really cannot take a slot, add it to CLAIMS so the
   next person to change the data finds out from this script
   rather than from a reader.
   ============================================================ */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PAGES, COUNTS } from "./content.js";
import { NEXT_ROUTES, ARTICLE } from "../worker.js";
import { METRICS, PILLARS } from "./tools/stock.model.js";

const ROOT = dirname(fileURLToPath(import.meta.url));
let failures = 0;

/** Is this an address a Worker renders rather than a file? The
    allowlist in worker.js, read rather than copied. Whether the
    asset router lets it through is check-routes.mjs's question,
    and it asks it of the same two lists. */
const workerAnswers = (url) =>
  ARTICLE.test(url) || NEXT_ROUTES.some((route) => route.test(url));

const fail = (line, ...detail) => {
  failures++;
  console.error(line);
  detail.forEach((d) => console.error(`        ${d}`));
};

const read = (rel) => readFileSync(join(ROOT, rel), "utf8");

/* ------------------------------------------------------------
   1. Every case study is in the manifest and on the page
   ------------------------------------------------------------ */

/* A case study is an .html file in /portfolio/. The directory also
   holds the modules and test files each one is built from, and
   those are not pages. */
const caseFiles = readdirSync(join(ROOT, "portfolio"))
  .filter((f) => f.endsWith(".html"))
  .map((f) => `/portfolio/${f}`);

const listed = new Set(
  PAGES.filter((p) => p.group === "case").map((p) => p.url)
);
const portfolioHtml = read("portfolio.html");

for (const url of caseFiles) {
  if (!listed.has(url)) {
    fail(`unlisted  ${url}`,
      "this page exists but has no PAGES entry in content.js, so it is in",
      "neither the menu, the Ctrl+K palette nor the sitemap.",
      'Add: { title: "…", url: "' + url + '", hint: "Case study", group: "case", blurb: "…" }');
  }
  if (!portfolioHtml.includes(`href="${url}"`)) {
    fail(`unlinked  ${url}`,
      "portfolio.html does not link this case study, so the only way to",
      "reach it is to already know the URL. Add a card for it.");
  }
}

/* And the reverse: a manifest entry for a case study whose file
   has gone is a card linking into a 404. */
for (const url of listed) {
  if (!caseFiles.includes(url)) {
    fail(`missing   ${url}`,
      "PAGES lists this case study but the file is not in /portfolio/.");
  }
}

/* ------------------------------------------------------------
   2. Every PAGES entry resolves: a file, or a Worker

   "A file that exists" was the whole question until Stage 11.
   Some of these addresses are rendered on request now and have no
   file behind them on purpose, so the question is the one
   check-routes.mjs already answers: does anything at all answer
   this URL. A manifest entry pointing at neither is a dead link
   in the menu of every page on the site, which is what this has
   always been for.
   ------------------------------------------------------------ */
for (const page of PAGES) {
  const rel = page.url.replace(/^\//, "");
  if (existsSync(join(ROOT, rel))) continue;
  if (workerAnswers(page.url)) continue;
  fail(`no-file   ${page.url}`,
    `PAGES calls this "${page.title}", and there is neither a file`,
    "nor a Worker route that answers it.");
}

/* ------------------------------------------------------------
   3. The no-JavaScript fallback inside every [data-count]
   ------------------------------------------------------------ */

/* The same digits app.js uses, so this checks what a reader
   actually sees rather than what the markup happens to store. */
const BN_DIGITS = "০১২৩৪৫৬৭৮৯";
const toBangla = (n) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
const fromBangla = (s) =>
  s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.endsWith(".html")) htmlFiles.push(rel);
  }
})("");

const SLOT = /<span[^>]*\bdata-count="([a-zA-Z]+)"[^>]*>([^<]*)<\/span>/g;

for (const file of htmlFiles) {
  const html = read(file);
  for (const [, key, fallback] of html.matchAll(SLOT)) {
    const value = COUNTS[key];
    if (value === undefined) {
      fail(`bad-key   ${file}`,
        `data-count="${key}" is not a key of COUNTS in content.js.`,
        `Known keys: ${Object.keys(COUNTS).join(", ")}`);
      continue;
    }
    const printed = Number(fromBangla(fallback.trim()));
    if (printed !== value) {
      fail(`stale     ${file}`,
        `data-count="${key}" falls back to "${fallback.trim()}", but the data says ${value}.`,
        `A reader with no JavaScript sees the fallback. Change it to ` +
        `${/[০-৯]/.test(fallback) ? toBangla(value) : value}.`);
    }
  }
}

/* ------------------------------------------------------------
   4. Counts typed into prose that cannot hold a slot
   ------------------------------------------------------------ */

/* Each entry: the file, a phrase that appears in it, and the
   COUNTS key that phrase is really quoting. `approx` allows the
   vaguer forms ("forty-odd") to cover a decade, because that is
   what they mean: forty-odd is right for 41 and wrong for 58. */
const CLAIMS = [
  { file: "content.js", text: "Forty-odd ratios across six pillars", key: "ratios", approx: true },
  { file: "content.js", text: "eight stages deep", key: "stages", word: "eight" },
  { file: "content.js", text: "German from Bangla in four stages", key: "stufen", word: "four" },
  /* The stock check's page is a Next.js route as of Stage 11.4,
     and the two sentences are the same two sentences. A claim
     follows its words rather than its file. */
  { file: "../next/app/(site)/tools/stock.html/page.tsx",
    text: "forty-odd ratios across six pillars", key: "ratios", approx: true },
  { file: "../next/app/(site)/tools/stock.html/page.tsx",
    text: "Forty-odd ratios across six pillars", key: "ratios", approx: true },
  { file: "tools/stock.i18n.js", text: "Forty-odd ratios, six pillars", key: "ratios", approx: true },
  { file: "tools/stock.model.js", text: "forty-odd ratios grouped into six", key: "ratios", approx: true },
];

const WORDS = {
  three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};
const DECADE = {
  "twenty-odd": 20, "thirty-odd": 30, "forty-odd": 40, "fifty-odd": 50,
  "sixty-odd": 60, "seventy-odd": 70,
};

for (const claim of CLAIMS) {
  const body = read(claim.file);
  if (!body.includes(claim.text)) {
    fail(`gone      ${claim.file}`,
      `CLAIMS expects the phrase ${JSON.stringify(claim.text)} in this file,`,
      "and it is not there. If the sentence was rewritten, update CLAIMS in",
      "check-content.mjs so the next data change is still checked.");
    continue;
  }
  const value = COUNTS[claim.key];
  if (claim.approx) {
    const key = claim.text.toLowerCase().match(/\b\w+-odd\b/)?.[0];
    const decade = DECADE[key];
    if (decade === undefined || value < decade || value > decade + 9) {
      fail(`wrong     ${claim.file}`,
        `"${claim.text}" says ${key}, but ${claim.key} is ${value}.`);
    }
  } else if (WORDS[claim.word] !== value) {
    fail(`wrong     ${claim.file}`,
      `"${claim.text}" says ${claim.word}, but ${claim.key} is ${value}.`);
  }
}

/* ------------------------------------------------------------
   5. The two counts content.js has to be told
   ------------------------------------------------------------ */
if (COUNTS.ratios !== METRICS.length) {
  fail("drifted   content.js",
    `COUNTS.ratios is ${COUNTS.ratios}, but stock.model.js scores ${METRICS.length} metrics.`,
    "Set COUNTS.ratios to the new number; every page that prints it follows.");
}
if (COUNTS.pillars !== PILLARS.length) {
  fail("drifted   content.js",
    `COUNTS.pillars is ${COUNTS.pillars}, but stock.model.js has ${PILLARS.length} pillars.`);
}

/* ------------------------------------------------------------ */
console.log(
  failures
    ? `\n${failures} content problem(s): fix before deploying.`
    : `content checked: ${caseFiles.length} case studies listed and linked, ` +
      `${PAGES.length} pages resolve, every count agrees with the data.`
);
process.exit(failures ? 1 : 0);
