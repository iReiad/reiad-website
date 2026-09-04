/* What this site records about a reader, in a browser.
     node next/tracking.test.ts
   Needs Playwright and a browser; without either it says which and SKIPS,
   and a skip is not a pass.

   Every way of getting this wrong LOOKS like it works: a control offering
   a way back to somewhere the reader has already passed, one offering a
   way back to the end of a piece they finished, and one sending them to
   the wrong paragraph because the prose was edited under the index all
   render a button and all scroll somewhere. So each is a block below,
   written as the thing a reader would notice.

   The last block is the button that marks a money lesson read. The money
   school is the one of the four whose tick is React rather than a served
   module, so it is the one no browser test reached, and a button that
   renders and writes nothing looks exactly like one that works. */

import { load, open, type Fixture } from "./hydrate-fixture.ts";
import type { ConsoleMessage, Page } from "playwright";

const PORT = 8995;

/** A piece long enough to have a middle: forty paragraphs, each
    one distinguishable, so a position can be checked by reading
    the words rather than by trusting a number. */
const words = (n: number): string =>
  `Paragraph number ${n}, and this one is long enough to be a real block of `
  + "prose rather than a label, which matters because the component skips "
  + "anything under twenty characters.";

const PARAS = Array.from({ length: 40 }, (_, n) =>
  `<p id="p${n}">${words(n)}</p>`).join("");

/** The signature the component computes, computed the same way.
    Writing one out by hand is how a test asserts against a string
    that is nearly right: the first draft of this file was three
    characters long and every "come back" check failed for a
    reason that had nothing to do with coming back. */
const sig = (n: number): string =>
  words(n).replace(/\s+/g, " ").trim().slice(0, 40);

/* ONE SOURCE, BUNDLED ONCE, used for both the server render and
   the hydration. Two `load()` calls would be two copies of React
   in one process, and the second one throws "invalid hook call"
   from inside the component rather than from anywhere near the
   mistake. `read-aloud.test.ts` says the same thing where it does
   it. */
const PAGE = `
  import { createElement as h } from "react";
  import { Where } from "./components/where";
  export const markup = () => h("main", { id: "main" },
    h("article", { className: "wrap article", "data-slug": "a-piece" },
      h("h1", null, "A piece"),
      h("div", { className: "piece-tools" }, h(Where, { url: "/insights/a.html" })),
      h("div", { dangerouslySetInnerHTML: {
        __html: JSON.parse(document.getElementById("body").textContent) } })));
`;

/* The server half cannot read a `<script>` out of a document it
   has not got, so it takes the body as an argument and the
   browser half reads it back out of the page. Both build the
   same tree. */
const SERVER = `
  import { createElement as h } from "react";
  import { Where } from "./components/where";
  export { renderToString } from "react-dom/server.browser";
  export const markup = (body) => h("main", { id: "main" },
    h("article", { className: "wrap article", "data-slug": "a-piece" },
      h("h1", null, "A piece"),
      h("div", { className: "piece-tools" }, h(Where, { url: "/insights/a.html" })),
      h("div", { dangerouslySetInnerHTML: { __html: body } })));
`;

const { renderToString, markup } = await load<{
  renderToString: (node: unknown) => string;
  markup: (body: string) => unknown;
}>(SERVER);

/* A SECOND PAGE, served at /tick, with the money school's own
   tick button on it. `open()` takes anything else the fixture
   should answer for, which is how a component's runtime module is
   usually stubbed; here it is a whole second page, because the
   two things under test are two pages and one browser. */
const TICK = `
  import { createElement as h } from "react";
  import { LessonTick } from "./components/progress";
  export const markup = () => h("main", { id: "main" },
    h("article", { className: "term-article lesson money" },
      h("h1", null, "A money lesson"),
      h(LessonTick, {
        school: "money", id: "basics-1/one", title: "One", stage: "basics-1",
        url: "/money/terms/one.html", of: ["basics-1/one", "basics-1/two"],
        words: { done: "পড়া হয়েছে", notDone: "পড়া হয়েছে চিহ্ন দিন" },
      })));
`;

const tickServer = await load<{
  renderToString: (node: unknown) => string;
  markup: () => unknown;
}>(`${TICK}\nexport { renderToString } from "react-dom/server.browser";`);

const fixture: Fixture = await open({
  port: PORT,
  files: {
    "/tick": {
      type: "text/html; charset=utf-8",
      body: `<!DOCTYPE html><html lang="bn"><head><meta charset="utf-8">`
        + `<title>tick</title></head><body>`
        + `<div id="tick-root">${tickServer.renderToString(tickServer.markup())}</div>`
        + `<script type="module" src="/tick.js"></script></body></html>`,
    },
    "/tick.js": {
      type: "text/javascript; charset=utf-8",
      body: await (await import("./hydrate-fixture.ts")).bundle(`
        import { hydrateRoot } from "react-dom/client";
        ${TICK}
        hydrateRoot(document.getElementById("tick-root"), markup());
      `),
    },
  },
  body: `<style>
    body { margin: 0 }
    p { margin: 0 0 40px; height: 90px }
  </style><div id="root">${renderToString(markup(PARAS))}</div>`
    + `<script type="application/json" id="body">${JSON.stringify(PARAS)}</script>`,
  entry: `
    import { hydrateRoot } from "react-dom/client";
    ${PAGE}
    hydrateRoot(document.getElementById("root"), markup());
  `,
});

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

/** One page, with whatever was already in storage. */
const openPage = async (stored?: unknown): Promise<{ p: Page; errors: string[] }> => {
  const p = await fixture.browser.newPage({ viewport: { width: 900, height: 700 } });
  const errors: string[] = [];
  p.on("pageerror", (e: Error) => errors.push(e.message));
  p.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error" && !/favicon|Failed to load resource/i.test(m.text())) {
      errors.push(m.text());
    }
  });
  if (stored !== undefined) {
    await p.addInitScript(`localStorage.setItem("where-read", ${
      JSON.stringify(JSON.stringify(stored))});`);
  }
  await p.goto(fixture.origin, { waitUntil: "load" });
  /* `.where` is `display: contents` and holds nothing until there
     is something to offer, so it is never "visible" and waiting
     for it to be would time out on the case this test cares most
     about. Attached says the server's markup is there; the pause
     is for the effect that reads storage, which is what
     `read-aloud.test.ts` does where it has no marker either. */
  await p.waitForSelector(".where", { state: "attached" });
  await p.waitForTimeout(600);
  return { p, errors };
};

const held = (p: Page): Promise<Record<string, { i: number; sig: string }>> =>
  p.evaluate(() => JSON.parse(localStorage.getItem("where-read") || "{}"));

const scrollTo = async (p: Page, y: number): Promise<void> => {
  await p.evaluate((to: number) => window.scrollTo(0, to), y);
  await p.waitForTimeout(1200);
};

console.log("what this site records about a reader");

/* ============================================================
   1. A FIRST READ OFFERS NOTHING, and records as it goes
   ============================================================ */
{
  const { p, errors } = await openPage();
  ok("nothing is offered to somebody who has not been here",
    await p.$(".where-btn") === null,
    "a way back to the top of a piece is a control that does nothing");

  await scrollTo(p, 1400);
  const first = await held(p);
  ok("scrolling down records where they are",
    (first["/insights/a.html"]?.i ?? -1) > 0,
    JSON.stringify(first));
  ok("and it names the block rather than an offset",
    /Paragraph number/.test(first["/insights/a.html"]?.sig ?? ""),
    first["/insights/a.html"]?.sig ?? "nothing");

  ok("still nothing offered, because they never left",
    await p.$(".where-btn") === null);

  /* FORWARDS ONLY WITHIN ONE VISIT. Scrolling back up to check a
     figure has not un-read the page, and recording the step back
     would leave a reader who read on to the end with a position
     at the top. The store does not guard this and should not:
     only something that knows what a visit is can, and opening
     the page again tomorrow to reread it legitimately starts
     lower down. */
  const deep = (await held(p))["/insights/a.html"].i;
  await scrollTo(p, 200);
  ok("scrolling back up does not move the position",
    (await held(p))["/insights/a.html"].i === deep,
    JSON.stringify(await held(p)));
  await scrollTo(p, 2600);
  ok("and carrying on does",
    (await held(p))["/insights/a.html"].i > deep,
    JSON.stringify(await held(p)));

  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

/* ============================================================
   2. COMING BACK

   The offer, and the fact that pressing it lands on the block it
   named rather than near it.
   ============================================================ */
{
  const { p, errors } = await openPage({
    "/insights/a.html": {
      i: 20, of: 40, sig: sig(20), ts: 1000,
    },
    ts: 1000,
  });
  ok("a reader who was half way through is offered a way back",
    await p.$(".where-btn") !== null);

  await p.click(".where-btn");
  await p.waitForTimeout(900);
  const where = await p.evaluate(() => {
    const el = document.getElementById("p20");
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });
  ok("and it lands on the paragraph they were on",
    where !== null && where > 0 && where < 700, String(where));
  ok("the offer goes once it has been taken",
    await p.$(".where-btn") === null,
    "a button that stays is a button a reader presses twice");
  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

/* ============================================================
   3. THE PROSE WAS EDITED UNDER IT

   The index alone is a promise the piece has not changed. A
   signature that does not match anything near it means the place
   is gone, and no offer is better than a wrong one.
   ============================================================ */
{
  const { p, errors } = await openPage({
    "/insights/a.html": {
      i: 20, of: 40, sig: "A sentence this piece has never contained", ts: 1000,
    },
    ts: 1000,
  });
  ok("a piece that has been rewritten offers nothing",
    await p.$(".where-btn") === null,
    "sending a reader to the wrong paragraph is worse than not offering");
  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

/* ---- and one paragraph inserted is not a rewrite ---- */
{
  /* The same signature, filed one index out, which is what a
     single inserted paragraph does to everything after it. */
  const { p, errors } = await openPage({
    "/insights/a.html": {
      i: 18, of: 39, sig: sig(20), ts: 1000,
    },
    ts: 1000,
  });
  ok("a paragraph added above does not lose the place",
    await p.$(".where-btn") !== null,
    "the signature is looked for either side of the index it was filed at");
  await p.click(".where-btn");
  await p.waitForTimeout(900);
  const where = await p.evaluate(() => {
    const el = document.getElementById("p20");
    return el ? Math.round(el.getBoundingClientRect().top) : null;
  });
  ok("and lands on the right paragraph anyway",
    where !== null && where > 0 && where < 700, String(where));
  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

/* ============================================================
   4. ALREADY PAST IT

   A reader who arrives with the browser's own scroll restoration,
   or who followed a link to an anchor further down, is already
   past the place. Offering them a way BACKWARDS is offering to
   undo what they just did.
   ============================================================ */
{
  const { p, errors } = await openPage({
    "/insights/a.html": {
      i: 3, of: 40, sig: sig(3), ts: 1000,
    },
    ts: 1000,
  });
  ok("somebody already past their old place is offered nothing",
    await p.$(".where-btn") === null,
    "the third paragraph is on screen when the page opens");
  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

/* ============================================================
   5. FINISHING IS NOT A PLACE TO COME BACK TO
   ============================================================ */
{
  const { p, errors } = await openPage({
    "/insights/a.html": {
      i: 20, of: 40, sig: sig(20), ts: 1000,
    },
    ts: 1000,
  });
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await p.waitForTimeout(1300);
  const after = await held(p);
  ok("reading to the end forgets the piece",
    after["/insights/a.html"] === undefined,
    JSON.stringify(after));
  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

    /* ---- 6. the money school's tick ----
       Three of the four schools tick through `aab/schools/progress.js` and
       `aab/schools/progress.test.ts` drives all three. The money school's
       is `components/progress.tsx`, because its lessons are routes.

       The key it writes is `learn-read` and not `money-read`, and that is
       deliberate: the school moved to /money/ and the key did not move
       with it, because renaming one does not move somebody's ticks, it
       loses them. Asserting the string here is asserting the thing that
       must never change. */
{
  const p = await fixture.browser.newPage({ viewport: { width: 900, height: 700 } });
  const errors: string[] = [];
  p.on("pageerror", (e: Error) => errors.push(e.message));
  await p.goto(`${fixture.origin}/tick`, { waitUntil: "load" });
  await p.waitForSelector(".tick-btn");

  const pressed = (): Promise<boolean> =>
    p.$eval(".tick-btn", (n: Element) => n.getAttribute("aria-pressed") === "true");
  const readSet = (): Promise<string[]> =>
    p.evaluate(() => JSON.parse(localStorage.getItem("learn-read") || "[]"));

  ok("a lesson starts unticked", (await pressed()) === false);
  ok("and opening it has not marked it read", (await readSet()).length === 0,
    "opening is not finishing: the old money school counted every reader who "
    + "arrived, saw it was the wrong lesson and left");

  ok("but it did move the bookmark",
    await p.evaluate(() =>
      JSON.parse(localStorage.getItem("learn-last") || "{}").id === "basics-1/one"),
    await p.evaluate(() => localStorage.getItem("learn-last") ?? "nothing"));

  await p.click(".tick-btn");
  await p.waitForTimeout(300);
  ok("pressing it ticks the lesson", await pressed());
  ok("under `learn-read`, which is the key in real browsers",
    (await readSet()).join() === "basics-1/one", JSON.stringify(await readSet()));

  await p.click(".tick-btn");
  await p.waitForTimeout(300);
  ok("pressing it again takes the tick off", (await pressed()) === false);
  ok("and the id goes with it", (await readSet()).length === 0);
  ok("nothing threw", errors.length === 0, errors[0]);
  await p.close();
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await fixture.close(1);
}
console.log("It remembers the block and not the offset, it never jumps on its own,\n"
  + "and it says nothing rather than sending a reader to the wrong paragraph.\n"
  + "The money school's tick writes `learn-read`, which is the key in real browsers.\n");
await fixture.close(0);
