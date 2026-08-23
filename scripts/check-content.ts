#!/usr/bin/env node
/* ============================================================
   check-content.ts, catch a page that has stopped telling the
   truth about the site.

       node scripts/check-content.ts

   THE BUG THIS EXISTS FOR

   Three case studies were written, given their own pages, added
   to the manifest, and published. The portfolio page kept listing
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
      slot: a <meta> description, a blurb inside the manifest, a
      sentence in a comment. Those are listed in CLAIMS below with
      the count they encode, and checked against COUNTS.

   5. THE TWO COUNTS shared/content.ts CANNOT COMPUTE. `ratios`
      and `pillars` describe /tools/stock.model.js, which the
      manifest does not import: it would pull a thousand lines
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
import { PAGES, COUNTS, DOOR } from "../shared/content.ts";
import { HEADS } from "../shared/heads.ts";
import { nextOwns } from "../worker.js";
import { METRICS, PILLARS } from "../aab/tools/stock.model.js";

/* `ROOT` was this file's own directory, which was `aab/`. It moved
   out for the reason the four checks before it did: every file in
   `aab/` is uploaded and answers at a public URL, so a check
   living there was a check published at `/check-content.ts`,
   kept private only by a line in `.assetsignore`. A check outside
   the served directory cannot be served, and the extension goes
   with it because the root declares `"type": "module"`.

   Everything it reads is still relative to `aab/`, so that is
   what `ROOT` keeps meaning. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "aab");
let failures = 0;

const fail = (line: string, ...detail: string[]): void => {
  failures++;
  console.error(line);
  detail.forEach((d) => console.error(`        ${d}`));
};

const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

/* ------------------------------------------------------------
   1. Every case study is in the manifest and on the page
   ------------------------------------------------------------ */

/* A case study is a route under /portfolio/, which since Stage
   11.3 means a directory in the Next.js app rather than a file in
   `aab/portfolio/`. That directory is still there and still holds
   the modules and the tests each study is computed from; what it
   no longer holds is a page.

   The two failures this section exists for are unchanged, and so
   is the answer: a case study nobody can reach, either because
   the manifest has never heard of it or because the portfolio
   page does not link it. */
const NEXT_PAGES = "../next/app/(site)";
/* One directory per case study, and the parenthesised one is not
   a case study: `(hub)` is the route group holding the portfolio
   page itself, which sits at `/portfolio` and would otherwise
   wrap every study below it in a second shell. */
const caseFiles = readdirSync(join(ROOT, NEXT_PAGES, "portfolio"), { withFileTypes: true })
  .filter((entry) => entry.isDirectory() && !entry.name.startsWith("("))
  .map((entry) => `/portfolio/${entry.name}`);

/* `flatMap` rather than `filter().map()`: the loop below compares
   urls to file names, and an entry with an empty one is section
   2's to report rather than something to match against. */
const listed = new Set(
  PAGES.flatMap((p) => (p.group === "case" && p.url ? [p.url] : []))
);
const portfolioHtml = read(`${NEXT_PAGES}/portfolio/(hub)/page.tsx`);

for (const url of caseFiles) {
  if (!listed.has(url)) {
    fail(`unlisted  ${url}`,
      "this page exists but has no PAGES entry in shared/content.ts, so it is in",
      "neither the menu, the Ctrl+K palette nor the sitemap.",
      'Add: { title: "…", url: "' + url + '", hint: "Case study", group: "case", blurb: "…" }');
  }
  if (!portfolioHtml.includes(`href="${url}"`)) {
    fail(`unlinked  ${url}`,
      "the portfolio route does not link this case study, so the only way",
      "to reach it is to already know the URL. Add a card for it.");
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
   check-routes.ts already answers: does anything at all answer
   this URL. A manifest entry pointing at neither is a dead link
   in the menu of every page on the site, which is what this has
   always been for.
   ------------------------------------------------------------ */
for (const page of PAGES) {
  /* An entry with no address at all. `Page.url` is a string since
     the manifest became TypeScript, so the two workbook groups can
     no longer produce a null one: they build the url first and skip
     the stage when `workbookUrl()` answers null for a book that
     does not exist. An empty one is still a menu item and a palette
     entry that go nowhere, and this is where that is said. */
  if (!page.url) {
    fail(`no-url    ${page.title}`,
      "this PAGES entry has no url, so it is in the menu and in the palette",
      "and neither goes anywhere.");
    continue;
  }
  const rel = page.url.replace(/^\//, "");
  if (existsSync(join(ROOT, rel))) continue;
  /* A Worker renders it, so there is no file to look for.
     `nextOwns` is worker.js's own predicate rather than a copy of
     it; whether the asset router lets the path through before the
     Worker sees it is check-routes.ts's question, not this
     file's. */
  if (nextOwns(page.url)) continue;
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
const toBangla = (n: number): string =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);
const fromBangla = (s: string): string =>
  s.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)));

/* Every file that can carry a slot, which is no longer only
   `aab/*.html`.

   This walked `aab/` for `.html` and nothing else, and by the time
   anybody looked there was ONE slot left there and six in the
   routes. So the rule below was reading a seventh of the site and
   reporting "every count agrees with the data", which is this
   check's own opening bug wearing a hat: each thing was right when
   it was typed, and then the pages moved.

   Proven rather than assumed: setting `data-count="ratios"` to 99
   in `tools/index.html/page.tsx`, for a model that scores 44, left
   this passing. */
const htmlFiles = [];
(function walk(dir) {
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    const rel = dir ? `${dir}/${entry.name}` : entry.name;
    if (entry.name === "node_modules" || entry.name === ".next"
        || entry.name === ".open-next") continue;
    if (entry.isDirectory()) walk(rel);
    else if (entry.name.endsWith(".html") || entry.name.endsWith(".tsx")) {
      htmlFiles.push(rel);
    }
  }
})("");
for (const dir of ["../next/app", "../next/components"]) {
  if (existsSync(join(ROOT, dir))) (function walk(d) {
    for (const entry of readdirSync(join(ROOT, d), { withFileTypes: true })) {
      const rel = `${d}/${entry.name}`;
      if (entry.name === "node_modules" || entry.name === ".next") continue;
      if (entry.isDirectory()) walk(rel);
      else if (entry.name.endsWith(".tsx")) htmlFiles.push(rel);
    }
  })(dir);
}

/* `COUNTS`, looked up by a name this file cannot know at compile
   time: the keys come out of markup (`data-count="stages"`) and out
   of the CLAIMS table below, and whether one of them really is a
   key is the question both sections ask.

   An annotation rather than a cast, so that it is checked: this
   line stops compiling the day a value in COUNTS stops being a
   number, which is what both readers below take it to be. */
const COUNT: Record<string, number> = COUNTS;

const SLOT = /<span[^>]*\bdata-count="([a-zA-Z]+)"[^>]*>([^<]*)<\/span>/g;

for (const file of htmlFiles) {
  const html = read(file);
  for (const [, key, fallback] of html.matchAll(SLOT)) {
    const value = COUNT[key];
    if (value === undefined) {
      fail(`bad-key   ${file}`,
        `data-count="${key}" is not a key of COUNTS in shared/content.ts.`,
        `Known keys: ${Object.keys(COUNT).join(", ")}`);
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
/** One sentence that states a number in words, and the COUNTS key
    it is really quoting. Two shapes, and a claim is exactly one of
    them: `word` is a number written out exactly, `approx` marks a
    vaguer form covering a decade. Writing both on one entry, or
    neither, is what this union refuses. */
type Claim =
  | { file: string; text: string; key: string; word: string; approx?: never }
  | { file: string; text: string; key: string; approx: true; word?: never };

const CLAIMS: Claim[] = [
  { file: "../shared/content.ts", text: "Forty-odd ratios across six pillars", key: "ratios", approx: true },
  { file: "../shared/content.ts", text: "eight stages deep", key: "stages", word: "eight" },
  { file: "../shared/content.ts", text: "German from Bangla in four stages", key: "stufen", word: "four" },
  /* The stock check's page is a Next.js route as of Stage 11.4,
     and the two sentences are the same two sentences. A claim
     follows its words rather than its file. */
  { file: "../next/app/(site)/tools/stock/page.tsx",
    text: "forty-odd ratios across six pillars", key: "ratios", approx: true },
  { file: "../next/app/(site)/tools/stock/page.tsx",
    text: "Forty-odd ratios across six pillars", key: "ratios", approx: true },
  { file: "tools/stock.i18n.js", text: "Forty-odd ratios, six pillars", key: "ratios", approx: true },
  { file: "tools/stock.model.js", text: "forty-odd ratios grouped into six", key: "ratios", approx: true },
];

const WORDS: Record<string, number> = {
  three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
};
const DECADE: Record<string, number> = {
  "twenty-odd": 20, "thirty-odd": 30, "forty-odd": 40, "fifty-odd": 50,
  "sixty-odd": 60, "seventy-odd": 70,
};

for (const claim of CLAIMS) {
  const body = read(claim.file);
  if (!body.includes(claim.text)) {
    fail(`gone      ${claim.file}`,
      `CLAIMS expects the phrase ${JSON.stringify(claim.text)} in this file,`,
      "and it is not there. If the sentence was rewritten, update CLAIMS in",
      "check-content.ts so the next data change is still checked.");
    continue;
  }
  const value = COUNT[claim.key];
  /* The same question section 3 asks of a markup slot, asked of
     this table too: a claim quoting a key COUNTS does not have is
     a sentence nothing is checking, and it used to compare
     undefined against a decade and pass. */
  if (value === undefined) {
    fail(`bad-key   ${claim.file}`,
      `CLAIMS says this sentence quotes "${claim.key}", which is not a key of`,
      `COUNTS. Known keys: ${Object.keys(COUNT).join(", ")}`);
    continue;
  }
  if (claim.approx) {
    const said = claim.text.toLowerCase().match(/\b\w+-odd\b/)?.[0];
    const decade = said ? DECADE[said] : undefined;
    if (decade === undefined || value < decade || value > decade + 9) {
      fail(`wrong     ${claim.file}`,
        `"${claim.text}" says ${said}, but ${claim.key} is ${value}.`);
    }
  } else if (WORDS[claim.word] !== value) {
    fail(`wrong     ${claim.file}`,
      `"${claim.text}" says ${claim.word}, but ${claim.key} is ${value}.`);
  }
}

/* ------------------------------------------------------------
   5. The two counts the manifest has to be told
   ------------------------------------------------------------ */
if (COUNTS.ratios !== METRICS.length) {
  fail("drifted   shared/content.ts",
    `COUNTS.ratios is ${COUNTS.ratios}, but stock.model.js scores ${METRICS.length} metrics.`,
    "Set COUNTS.ratios to the new number; every page that prints it follows.");
}
if (COUNTS.pillars !== PILLARS.length) {
  fail("drifted   shared/content.ts",
    `COUNTS.pillars is ${COUNTS.pillars}, but stock.model.js has ${PILLARS.length} pillars.`);
}

/* ------------------------------------------------------------
   6. The door marks words it actually says
   ------------------------------------------------------------

   `DOOR.copy[*].mark` is drawn by finding it inside `headline`
   and painting a marker stroke under those characters. A `mark`
   the headline does not contain is not an error anywhere: the
   site renders the sentence with nothing marked, the app renders
   it with nothing marked, and the flourish that carries the
   promise is silently gone on a page that looks finished. */
for (const [when, copy] of Object.entries(DOOR.copy)) {
  if (!copy.headline.includes(copy.mark)) {
    fail("drifted   shared/content.ts",
      `DOOR.copy.${when} marks "${copy.mark}", which is not in its headline.`,
      "The mark is a substring of the headline, so that the two cannot drift.");
  }
  if (!copy.mark.trim()) {
    fail("drifted   shared/content.ts", `DOOR.copy.${when} has an empty mark.`);
  }
}
for (const fact of DOOR.facts) {
  if (typeof COUNTS[fact.count] !== "number") {
    fail("drifted   shared/content.ts",
      `DOOR.facts names COUNTS.${fact.count}, which is not a number.`);
  }
}

/* ------------------------------------------------------------
   7. A number in a hub's lede is a SLOT, never a numeral
   ------------------------------------------------------------

   `HEADS` carries what each hub page says about itself, and a
   lede that states a count names the `COUNTS` key that fills it
   rather than holding a figure. Both halves have to be true and
   each fails differently:

   A `{n}` with no key ships the literal characters `{n}` to a
   reader, on the site and in the app. A key with no `{n}` is a
   count nobody ever prints, which is the shape this whole file
   exists for: right on the day it was written, and then the
   thing it counted grew and nothing said so.
   ------------------------------------------------------------ */
for (const [key, head] of Object.entries(HEADS)) {
  const slot = head.lede.includes("{n}");
  if (slot && !head.count) {
    fail("drifted   shared/heads.ts",
      `HEADS.${key} has a {n} in its lede and names no count.`,
      "A reader gets the characters {n}, on the site and on a phone.");
  }
  if (head.count && !slot) {
    fail("drifted   shared/heads.ts",
      `HEADS.${key} names COUNTS.${head.count} and has no {n} to put it in.`,
      "A count nobody prints is a count that cannot go stale visibly.");
  }
  if (head.count && typeof COUNTS[head.count] !== "number") {
    fail("drifted   shared/heads.ts",
      `HEADS.${key} names COUNTS.${head.count}, which is not a number.`);
  }
  for (const [what, said] of [["eyebrow", head.eyebrow], ["title", head.title],
                              ["lede", head.lede]] as const) {
    if (!said.trim()) {
      fail("drifted   shared/heads.ts", `HEADS.${key} has an empty ${what}.`);
    }
  }
}

/* ------------------------------------------------------------ */
console.log(
  failures
    ? `\n${failures} content problem(s): fix before deploying.`
    : `content checked: ${caseFiles.length} case studies listed and linked, ` +
      `${PAGES.length} pages resolve, ${Object.keys(HEADS).length} hub heads hold ` +
      "their slots, every count agrees with the data."
);
process.exit(failures ? 1 : 0);
