#!/usr/bin/env node
/* Every kind of lesson block, and every model behind a lab, server
   rendered and then hydrated in a real browser.
     node next/lesson.test.ts

   THE FAILURE IT WAS WRITTEN FOR: a `<div>` inside a `<p>` is not
   something the HTML parser allows, so it closes the paragraph and the
   DOM the browser builds is not the tree React rendered. React gives up
   on the server's markup and renders the whole root again. On a real page
   React owns `<html>`, so the tree it throws away is the document, and
   the boot script in `shell.tsx` has already put `data-theme`,
   `data-rail` and `data-read-lang` on it: 43 of the 81 lessons lost the
   reader's theme, their rail and their language the moment React caught
   up, with everything still looking right.

   Every kind in `BLOCK_KINDS`, every shape a figure can be, and every
   model in `LAB_IDS`, each on a page of its own: React reports the first
   mismatch on a page and then stops being informative, and a per-case
   answer names the component to go and fix. React runs in development
   here, which `hydrate-fixture.ts` arranges, so a mismatch prints the tag
   and the tree. One bundle, one browser, one server, a page each. */

import { readFileSync } from "node:fs";
import { load, open, skip, type Extra } from "./hydrate-fixture.ts";
/* By relative path rather than the way a route spells it, like
   `parity.test.ts`: node refuses to strip types under
   `node_modules`, and `@reiad/shared` resolves to the copy npm
   made there. The bundled source below uses the package name,
   because esbuild has no such restriction. */
import { LAB_IDS } from "../shared/lesson-labs.ts";
import { GRID_IDS, gridStart, solve } from "../shared/lesson-grids.ts";
import { BLOCK_KINDS, FIGURE_SHAPES, blockProblems, type Block } from "../shared/lesson.ts";

const say = (bn: string, en: string) => ({ bn, en });
const three = [say("এক", "One"), say("দুই", "Two"), say("তিন", "Three")];

/** One block of each kind. Small, and complete enough to pass
    `blockProblems()`, which is asserted below: a sample the
    validator would reject is a sample the component may render
    as a stub, and a stub hydrates cleanly while proving nothing. */
const SAMPLES: Record<string, Block> = {
  quiz: { kind: "quiz", title: say("প্রশ্ন", "Question"), questions: [{
    ask: say("কোনটা ঠিক", "Which is right"),
    options: [
      { text: say("এটা", "This"), right: true, why: say("কারণ", "Because") },
      { text: say("ওটা", "That"), why: say("কারণ", "Because") },
    ] }] },
  order: { kind: "order", title: say("ক্রম", "Order"),
    items: three.map((text) => ({ text })) },
  match: { kind: "match", title: say("মেলান", "Match"), pairs: [
    { left: say("ক", "A"), right: say("১", "1") },
    { left: say("খ", "B"), right: say("২", "2") },
    { left: say("গ", "C"), right: say("৩", "3") }] },
  bins: { kind: "bins", title: say("বাক্স", "Bins"),
    bins: [{ id: "a", label: say("ক", "A") }, { id: "b", label: say("খ", "B") }],
    items: three.map((text, i) => (
      { text, bin: i === 1 ? "b" : "a", why: say("কারণ", "Because") })) },
  lab: { kind: "lab", model: LAB_IDS[0], title: say("হিসাব", "Lab") },
  chart: { kind: "chart", shape: "line", title: say("ছক", "Chart"),
    labels: ["1", "2", "3"], unit: say("টাকা", "Taka"),
    mark: { at: 2, label: say("দাগ", "Mark") },
    series: [{ name: say("ধারা", "Series"), values: [1, 2, 3] }] },
  figure: { kind: "figure", shape: "flow", title: say("ছবি", "Figure"),
    parts: three.map((text) => ({ text, note: say("নোট", "Note"), value: 100 })) },
  reveal: { kind: "reveal", title: say("দেখুন", "Reveal"),
    ask: say("প্রশ্ন", "Question"), choices: [say("ক", "A"), say("খ", "B")],
    answer: say("উত্তর", "Answer"), why: say("কারণ", "Because") },
  compare: { kind: "compare", title: say("তুলনা", "Compare"),
    columns: [say("ক", "A"), say("খ", "B")],
    rows: [
      { label: say("সারি এক", "Row one"), cells: [say("এক", "One"), say("দুই", "Two")], best: 0 },
      { label: say("সারি দুই", "Row two"), cells: [say("তিন", "Three"), say("চার", "Four")] }] },
  spot: { kind: "spot", title: say("খুঁজুন", "Spot"), source: say("সূত্র", "Source"),
    lines: three.map((text, i) => i === 0 ? { text, flag: say("এটা", "This one") } : { text }) },
  drill: { kind: "drill", title: say("করুন", "Drill"),
    steps: three.map((text) => ({ text, hint: say("ইঙ্গিত", "Hint") })) },
  grid: { kind: "grid", model: GRID_IDS[0], title: say("ছক", "Sheet") },
};

const short = BLOCK_KINDS.filter((k) => !SAMPLES[k]);
if (short.length) skip(`no sample block for ${short.join(", ")}. Add one above.`);

interface Case { name: string; block: Block }

/* Three shapes want more than a list of parts, and each wants
   something different, which is the reason every shape is a case
   of its own here rather than one figure drawn ten ways. */
const VENN = [
  { text: say("বাঁ", "Left"), side: "left" },
  { text: say("দুই দিকে", "Both"), side: "both" },
  { text: say("ডান", "Right"), side: "right" },
];

const part = (text: { bn: string; en: string }, i: number) =>
  ({ text, note: say("নোট", "Note"), value: 100, at: i === 0 ? 0 : 1 });

const figure = (shape: string): Block => ({
  kind: "figure", shape, title: say("ছবি", "Figure"),
  parts: shape === "venn" ? VENN
    : shape === "matrix" ? [...three, say("চার", "Four")].map(part)
    : three.map(part),
  ...(shape === "matrix" ? { axes: { x: say("এক", "One"), y: say("দুই", "Two") } } : {}),
  ...(shape === "callouts" ? { screen: {
    title: say("পর্দা", "Screen"),
    rows: [
      { label: say("এক", "One"), value: say("১০০", "100") },
      { label: say("দুই", "Two"), value: say("২০০", "200") },
    ] } } : {}),
} as unknown as Block);

const CASES: Case[] = [
  ...BLOCK_KINDS.map((kind) => ({ name: `a ${kind}`, block: SAMPLES[kind] })),
  ...FIGURE_SHAPES.map((shape) => ({ name: `a ${shape} figure`, block: figure(shape) })),
  ...LAB_IDS.map((model) => ({
    name: `the ${model} lab`,
    block: { kind: "lab", model, title: say("হিসাব", "Lab") } as Block,
  })),
  /* EVERY SHEET, not one of them. Three of the six are a language
     school's, and a language school had no interactive at all
     before this: a sheet that renders only for the money school's
     numbers would be the whole point missed. */
  ...GRID_IDS.map((model) => ({
    name: `the ${model} sheet`,
    block: { kind: "grid", model, title: say("ছক", "Sheet") } as Block,
  })),
];

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n      ${detail}` : ""));
};

for (const c of CASES) {
  const problems = blockProblems(c.name, c.block, LAB_IDS, GRID_IDS);
  ok(`${c.name} is a block the validator accepts`, problems.length === 0, problems[0]);
}

    /* ---------- a sheet resolves a formula of a formula ----------
       `solve()` runs two passes rather than sorting the rows, and the six
       sheets that ship all list their rows in the order the formulas need,
       so one pass answers every one correctly. That is the second pass
       being untested rather than unnecessary: a total ABOVE the things it
       totals is a thing somebody will write. */
{
  const OUT_OF_ORDER = {
    id: "t", title: { bn: "", en: "" }, columns: [{ bn: "", en: "" }],
    fmt: "num" as const,
    rows: [
      /* The answer first, then what it is made of. */
      { id: "margin", label: { bn: "", en: "" }, cells: [
        { kind: "calc" as const, op: "pct" as const, from: ["profit", "sales"] }] },
      { id: "profit", label: { bn: "", en: "" }, cells: [
        { kind: "calc" as const, op: "diff" as const, from: ["sales", "cost"] }] },
      { id: "sales", label: { bn: "", en: "" }, cells: [{ kind: "input" as const, start: 200 }] },
      { id: "cost", label: { bn: "", en: "" }, cells: [{ kind: "input" as const, start: 150 }] },
    ],
  };
  const at = solve(OUT_OF_ORDER, gridStart(OUT_OF_ORDER));
  ok("a sheet resolves a formula whose inputs are below it",
    at.profit === 50, String(at.profit));
  ok("and one whose inputs are themselves formulas",
    Math.round(at.margin) === 25, String(at.margin));
}

/* Rendered from inside the bundle, so the React that renders is
   the React the components imported: two copies of it is an
   invalid hook call rather than an answer. */
const { render } = await load<{ render: (b: unknown) => string }>(`
  import { createElement } from "react";
  import { renderToString } from "react-dom/server.browser";
  import { LessonBlock } from "./components/lesson/block";
  export const render = (block) => renderToString(
    createElement(LessonBlock, { id: "b", block, lesson: "t/l", school: "money" }));
`);

/** The block for a page, as JSON in the page. `<` is escaped so
    a string in a lesson can never close the script tag. */
const json = (block: Block): string => JSON.stringify(block).replace(/</g, "\\u003c");

    /* THE REAL STYLESHEET, because half of what a block does is geometry
       and none of that is visible against no CSS at all.

       `aab/fallback.css` rather than `next/styles/site.css`: the second is
       three files behind an `@import` and a Tailwind compiler, and the
       first is the same design system with its comments taken out, held to
       the source by `check-next.ts`. */
const CSS = readFileSync(new URL("../aab/fallback.css", import.meta.url), "utf8");

const files: Record<string, Extra> = {
  "/fallback.css": { type: "text/css; charset=utf-8", body: CSS },
};
CASES.forEach((c, i) => {
  files[`/c${i}`] = {
    type: "text/html; charset=utf-8",
    body: `<!DOCTYPE html><html lang="en" data-read-lang="bn"><head>`
      + `<meta charset="utf-8"><title>${c.name}</title>`
      + `<link rel="stylesheet" href="/fallback.css">`
      /* The column a lesson block actually sits in: no margin on
         the body, and a root that is exactly as wide as the
         viewport. Anything wider than that is the block pushing
         the page sideways, which is what the width pass below
         asks about. */
      + `<style>body{margin:0}#root{width:100%}</style></head><body>`
      + `<div id="root">${render(c.block)}</div>`
      + `<script type="application/json" id="block">${json(c.block)}</script>`
      + `<script type="module" src="/hydrate.js"></script></body></html>`,
  };
});

    /* ---------- and the same question of the real lessons ----------
       The samples above are one block of each kind and every one of them
       fitted while 22 real charts did not: a three-point bar chart's last
       band overhangs by a third of a third.

       So the committed snapshot is asked as well. It is the only copy of
       the lesson prose a check with no network can read, which is what
       makes this affordable: 81 written lessons and 317 blocks, laid out
       rather than parsed. */
const REAL = (() => {
  const snap = JSON.parse(readFileSync(
    new URL("../content/schools.backup.json", import.meta.url), "utf8")) as {
      lessons: { school: string; stage: string; slug: string; blocks?: string }[] };
  const out: { at: string; blocks: Block[] }[] = [];
  for (const L of snap.lessons) {
    if (!L.blocks) continue;
    let parsed: unknown;
    try { parsed = JSON.parse(L.blocks); } catch { continue; }
    const list = (Array.isArray(parsed) ? parsed : Object.values(parsed as object))
      .filter((b): b is Block => !!b && typeof b === "object" && "kind" in b);
    if (list.length) out.push({ at: `${L.school}/${L.stage}/${L.slug}`, blocks: list });
  }
  return out;
})();

REAL.forEach((L, i) => {
  files[`/r${i}`] = {
    type: "text/html; charset=utf-8",
    body: `<!DOCTYPE html><html lang="bn" data-read-lang="bn"><head>`
      + `<meta charset="utf-8"><title>${L.at}</title>`
      + `<link rel="stylesheet" href="/fallback.css">`
      + `<style>body{margin:0}#root{width:100%}</style></head><body>`
      + `<div id="root">${L.blocks.map((b) => render(b)).join("")}</div>`
      + `</body></html>`,
  };
});

const fixture = await open({
  port: 8951,
  body: "",
  files,
  entry: `
    import { createElement } from "react";
    import { hydrateRoot } from "react-dom/client";
    import { LessonBlock } from "./components/lesson/block";
    const block = JSON.parse(document.getElementById("block").textContent);
    hydrateRoot(document.getElementById("root"),
      createElement(LessonBlock, { id: "b", block, lesson: "t/l", school: "money" }));
  `,
});

const page = await fixture.browser.newPage();
let said: string[] = [];
page.on("console", (m) => said.push(m.text()));
page.on("pageerror", (e) => said.push(String(e)));

/* What React says when the DOM it finds is not the tree it
   rendered, in development and in production both, plus the
   plain throw a component that cannot render gives. */
const BAD = /hydrat|#4(18|22|23|25)|did not match|cannot be a descendant|is not a function/i;

console.log("\nevery block, hydrated in a browser\n");

for (const [i, c] of CASES.entries()) {
  said = [];
  await page.goto(`${fixture.origin}/c${i}`, { waitUntil: "load" });
  await page.waitForTimeout(200);
  const seen = await page.evaluate(() => ({
    blocks: document.querySelectorAll(".ls-block").length,
    /* An empty root is React having rendered nothing rather than
       having hydrated something, which is a pass by absence. */
    filled: (document.getElementById("root")?.textContent ?? "").trim().length,
  }));
  const bad = said.filter((line) => BAD.test(line));
  ok(`${c.name} renders`, seen.blocks === 1 && seen.filled > 0,
    `${seen.blocks} blocks, ${seen.filled} characters`);
  ok(`${c.name} hydrates with no mismatch`, bad.length === 0, bad[0]?.slice(0, 600));
}

    /* ---- a sheet is the one block that answers back ----
       Everything above asks whether a block renders and survives
       hydration. A sheet computes: a number typed into one cell has to
       move another, and a word typed into a hole has to be marked against
       the right answer. Both are invisible to anything reading HTML, and a
       sheet whose formulas never run renders a perfect table of
       noughts. */
{
  const at = CASES.findIndex((c) => c.name === "the pnl sheet");
  ok("the profit and loss sheet is one of the cases", at >= 0);
  said = [];
  await page.goto(`${fixture.origin}/c${at}`, { waitUntil: "load" });
  await page.waitForTimeout(300);

  const outs = (): Promise<string[]> => page.evaluate(() =>
    [...document.querySelectorAll(".ls-cell-out")].map((n) => n.textContent ?? ""));

  const before = await outs();
  /* BENGALI DIGITS, because the fixture page is `data-read-lang="bn"`
     and a sheet writes its numbers in the reader's own numerals.
     The first draft of this line looked for [1-9] and failed on a
     page that was working perfectly, which is the check being
     wrong about the site rather than the other way round. */
  const DIGIT = /[1-9\u09E7-\u09EF]/;
  ok("the computed cells arrive computed", before.some((v) => DIGIT.test(v)),
    JSON.stringify(before.slice(0, 4)));
  ok("and in the reader's own numerals",
    before.some((v) => /[\u09E6-\u09EF]/.test(v)),
    JSON.stringify(before.slice(0, 4)));

  /* Revenue is the first input on the sheet. Doubling it must
     move gross profit, operating profit, net profit and the
     margin, which are four cells at two levels of formula. */
  await page.fill(".ls-sheet input[type=number]", "19000");
  await page.waitForTimeout(250);
  const after = await outs();
  ok("typing into a cell moves the cells that depend on it",
    after[0] !== before[0], `${before[0]} then ${after[0]}`);
  ok("including the ones computed from those",
    after.filter((v, i) => v !== before[i]).length >= 3,
    JSON.stringify({ before: before.slice(0, 5), after: after.slice(0, 5) }));

  const verdict = await page.evaluate(() =>
    document.querySelector(".ls-grid .ls-verdict")?.textContent ?? "");
  ok("and the sentence under it says something", verdict.trim().length > 20, verdict);
  ok("nothing threw", said.filter((l) => BAD.test(l)).length === 0);
}

/* ---- and a drill is the same object with holes in it ---- */
{
  const at = CASES.findIndex((c) => c.name === "the de-praesens sheet");
  ok("a language school's sheet is one of the cases too", at >= 0);
  said = [];
  await page.goto(`${fixture.origin}/c${at}`, { waitUntil: "load" });
  await page.waitForTimeout(300);

  ok("it offers to mark what was typed",
    await page.$(".ls-sheet-foot button") !== null,
    "a table with holes and no way to check them is a table nobody fills in");
  ok("and marks nothing before it is asked",
    await page.$(".ls-sheet-score") === null,
    "a table that goes red while somebody is still typing tells them they are "
    + "wrong before they have finished being right");

  const boxes = await page.$$(".ls-sheet input[type=text]");
  ok("every hole is a box", boxes.length === 5, String(boxes.length));
  await boxes[0].fill("nimmst");
  await boxes[1].fill("nimmt");
  await boxes[2].fill("wrong");
  await page.click(".ls-sheet-foot button");
  await page.waitForTimeout(250);

  const score = (await page.textContent(".ls-sheet-score")) ?? "";
  ok("it counts what is right", /2/.test(score), score);
  const states = await page.evaluate(() =>
    [...document.querySelectorAll(".ls-sheet input[type=text]")]
      .map((n) => n.getAttribute("data-state")));
  ok("and says which is which", states[0] === "right" && states[2] === "wrong",
    JSON.stringify(states));
  /* A box nobody typed into is not wrong: it is not yet answered,
     and a table that marks every empty cell red the moment
     somebody checks two of six is a table that says they failed. */
  ok("an empty box is not marked wrong", states[3] === null, JSON.stringify(states));
  ok("nothing threw", said.filter((l) => BAD.test(l)).length === 0);
}

    /* ---------- and nothing is drawn outside its own column ----------
       The house rule for anything wider than the reading column is that it
       scrolls inside its own box. A block that paints past the column runs
       over whatever is beside it and, where nothing above it clips, gives
       the page a horizontal scrollbar.

       THE MEASURE IS PAINT, NOT SCROLL. Comparing the root's `scrollWidth`
       against its `clientWidth` is what a horizontal scrollbar is made of,
       and it passes against a bar chart drawing 107 pixels outside itself:
       an SVG's visible overflow is ink, and ink does not widen a scroll
       container. So every element is asked for its own box and the one
       furthest past the edge is named.

       Two widths, because the two ways to get this wrong are opposite. 360px
       catches a hard minimum; 1280px catches anything proportional, which
       no narrow test would see, because a 7% overhang is 25 pixels at
       360px and 90 at 1280px. */
const WIDTHS = [
  { name: "a phone", width: 360, height: 780 },
  { name: "a laptop", width: 1280, height: 900 },
];

/** The element furthest past the right edge of the viewport, and
    by how far, or null. One pixel of slack for sub-pixel
    rounding and a stroke's outer half, and no more: two is a gap
    somebody can see. */
interface Outside { worst: string; by: number; scroll: number }

/** Runs in the page. A function rather than a string of one: a
    string handed to `evaluate` is an EXPRESSION, so `"() => {}"`
    evaluates to a function and is never called, and every check
    compares `undefined` against null and fails with nothing to
    say. It cost 262 empty failures to find that out. */
const outside = (): Outside | null => {
  const d = document.documentElement;
  let worst = "", by = 0;
  for (const el of Array.from(d.querySelectorAll("#root *"))) {
    const r = el.getBoundingClientRect();
    const past = Math.round(r.right - d.clientWidth);
    if (past > by) {
      by = past;
      const cls = typeof el.className === "string" ? el.className.trim() : "";
      worst = el.tagName.toLowerCase() + (cls ? "." + cls.split(/\s+/).join(".") : "");
    }
  }
  return by > 1 ? { worst, by, scroll: d.scrollWidth - d.clientWidth } : null;
};

for (const at of WIDTHS) {
  await page.setViewportSize({ width: at.width, height: at.height });
  for (const [i, c] of CASES.entries()) {
    await page.goto(`${fixture.origin}/c${i}`, { waitUntil: "load" });
    await page.waitForTimeout(50);
    const over = await page.evaluate(outside);
    ok(`${c.name} stays inside ${at.name}`, over === null,
      over ? `${over.worst} reaches ${over.by}px past the edge`
        + (over.scroll > 1 ? `, and the page scrolls ${over.scroll}px` : "") : "");
  }
}

for (const at of WIDTHS) {
  await page.setViewportSize({ width: at.width, height: at.height });
  for (const [i, L] of REAL.entries()) {
    await page.goto(`${fixture.origin}/r${i}`, { waitUntil: "load" });
    const over = await page.evaluate(outside);
    ok(`${L.at} stays inside ${at.name}`, over === null,
      over ? `${over.worst} reaches ${over.by}px past the edge` : "");
  }
}

console.log(`${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log("  x " + f);
  await fixture.close(1);
}
console.log("Every kind, every figure and every model survives the browser"
  + " adopting the server's HTML.\n");
await fixture.close(0);
