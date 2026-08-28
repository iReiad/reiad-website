#!/usr/bin/env node
/* ============================================================
   lesson.test.ts: every kind of lesson block, and every model
   behind a lab, server-rendered and then hydrated in a real
   browser.

       node next/lesson.test.ts

   ---- the failure it was written for ----

   `<p className="ls-verdict">` held a `<TBlock>`, and a `TBlock`
   is two `<div>`s. A `<div>` inside a `<p>` is not something the
   HTML parser allows: it closes the paragraph and puts the div
   after it, so the DOM the browser builds is not the tree React
   rendered. React gives up on the server's markup and renders
   the whole root again.

   Everything still looked right, which is why nothing caught it.
   The lesson read, the blocks worked, `parity.test.ts` compares
   the server's HTML and found it correct, and `check-money.ts`
   reads the prose rather than the components. What went missing
   was invisible: on a real page React owns `<html>`, so the tree
   it throws away is the document, and the boot script in
   `shell.tsx` has already put `data-theme`, `data-rail` and
   `data-read-lang` on it before the first paint. 43 of the 81
   lessons lost the reader's theme, their rail and their language
   the moment React caught up.

   ---- what it asks ----

   Every kind in `BLOCK_KINDS`, every shape a figure can be, and
   every model in `LAB_IDS`, each on a page of its own. On its
   own because React reports the first mismatch on a page and
   then stops being informative about the rest, and because a
   per-case answer names the component to go and fix.

   React runs in development here, which `hydrate-fixture.ts`
   arranges, so a mismatch prints the tag and the tree rather
   than a numbered error.

   One bundle, one browser, one server, a page each. The first
   draft built a bundle and launched a browser per case and took
   ten minutes, which is a test nobody runs.
   ============================================================ */

import { load, open, skip, type Extra } from "./hydrate-fixture.ts";
/* By relative path rather than the way a route spells it, like
   `parity.test.ts`: node refuses to strip types under
   `node_modules`, and `@reiad/shared` resolves to the copy npm
   made there. The bundled source below uses the package name,
   because esbuild has no such restriction. */
import { LAB_IDS } from "../shared/lesson-labs.ts";
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
];

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n      ${detail}` : ""));
};

for (const c of CASES) {
  const problems = blockProblems(c.name, c.block, LAB_IDS);
  ok(`${c.name} is a block the validator accepts`, problems.length === 0, problems[0]);
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

const files: Record<string, Extra> = {};
CASES.forEach((c, i) => {
  files[`/c${i}`] = {
    type: "text/html; charset=utf-8",
    body: `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">`
      + `<title>${c.name}</title></head><body>`
      + `<div id="root">${render(c.block)}</div>`
      + `<script type="application/json" id="block">${json(c.block)}</script>`
      + `<script type="module" src="/hydrate.js"></script></body></html>`,
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

console.log(`${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log("  x " + f);
  await fixture.close(1);
}
console.log("Every kind, every figure and every model survives the browser"
  + " adopting the server's HTML.\n");
await fixture.close(0);
