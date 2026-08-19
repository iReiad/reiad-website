/* ============================================================
   research.test.ts: the research window on the About page, in a
   browser.

     node next/research.test.ts

   Needs Playwright and a browser. Without either it says which and
   skips, and a skip is not a pass.

   `aab/about.js` was 107 lines over `el` and `flip` imported from
   `/news.js`, and it did six things: it turned each research card
   into a control, it took away the plain link that was the way in
   without JavaScript, it built one window and reused it, it filled
   that window from the card that was pressed, it grew the window
   out of that card's own rectangle, and it closed on Escape, on
   the button and on the backdrop. It is `components/research.tsx`
   now, and a port is finished when it does what the thing it
   replaced did, not when it renders, so all six are written down
   here.

   ---- one of the six had already stopped working ----

   The detail a window shows was a `<template data-detail>` in the
   markup, and the port of the page itself to a route rendered
   those templates EMPTY. The module cloned an empty fragment, so
   every window on the live page opened on a title and nothing
   under it, and it looked exactly like a window that had been
   built correctly. The words are a prop now and the check below is
   that they arrive.

   ---- why a browser ----

   Everything here happens after React has hydrated: on the server
   a card is a card with a link under it, which is what a reader
   with no JavaScript gets and is asserted first.
   `hydrate-fixture.ts` renders the component the way the route
   does, serves that markup with a script that hydrates it, and
   watches for the mismatch that would mean React had put the
   server's version back.
   ============================================================ */

import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, open } from "./hydrate-fixture.ts";
import type { BrowserContext, ConsoleMessage, Page } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8996;

/* Three cards, the shape the route hands over: one with three
   paragraphs of detail, one with a single paragraph, and one in
   between, so "the window shows what the card had no room for"
   has more than one answer to be right about. The words are the
   test's rather than the page's on purpose: this file is about
   what the window DOES, and the route's own copy is held to being
   wired at the foot of it. */
const ITEMS = [
  {
    href: "/portfolio/dissertation.html",
    label: "Open the dissertation case study",
    tag: "Dissertation · 15,000 words",
    title: "Do Islamic funds actually carry less risk?",
    blurb: "Islamic against conventional UK funds, either side of COVID.",
    detail: [
      "220 funds and 19,577 fund-months, with an Islamic dummy beside the tests.",
      "Every univariate test returns p > 0.21, and the dummy is insignificant.",
      "The case study is the submitted document, made interactive.",
    ],
  },
  {
    href: "/portfolio/frontier.html",
    label: "Open the fund",
    tag: "Python",
    title: "An Islamic fund portfolio, built and tested",
    blurb: "Portfolio construction in Python, automated end to end.",
    detail: ["Ten FTSE 250 holdings chosen by a screen that runs before any price."],
  },
  {
    href: "/portfolio/scorecard.html",
    label: "Open the credit models",
    tag: "Credit",
    title: "A credit-risk case, worked as a bank would",
    blurb: "Liquidity, leverage and repayment capacity, in order.",
    detail: [
      "One borrower first: a logistic scorecard against a boosted ensemble.",
      "Then a whole loan book through a recession, and the gap is the model risk.",
    ],
  },
];

/* ---------- the server's half, rendered here ---------- */

/* The section the route wraps it in, so the markup under test is
   the markup the page ships. */
const PAGE = `
  import { createElement as h } from "react";
  import { Research } from "./components/research";
  export const markup = (items) => h("section", null,
    h("span", { className: "section-label mono" }, "Research"),
    h(Research, { items }));
`;

interface Server {
  renderToString: (node: unknown) => string;
  markup: (items: unknown) => unknown;
}

const { renderToString, markup } = await load<Server>(
  `${PAGE}\nexport { renderToString } from "react-dom/server.browser";`);

const served = renderToString(markup(ITEMS));

/* ---------- and the browser's, hydrating that exact markup ---------- */

/* Every animation this page starts, recorded before anything can
   run one. The window grows out of the card it came from and the
   growing is the only thing that says WHICH of three cards was
   pressed, so it is asserted rather than assumed; a moment later
   it has finished and there is nothing left to see.
   `market-pulse.test.ts` records the same way for the same
   reason. */
const RECORD = `
  window.__animated = [];
  const real = Element.prototype.animate;
  Element.prototype.animate = function (frames, options) {
    window.__animated.push({ cls: this.className, frames: frames, options: options });
    return real.apply(this, arguments);
  };
`;

/* Something below the cards worth scrolling to. Space with a card
   focused scrolls a page that can scroll, which is what the
   keydown handler has to prevent, and a page with nothing under
   the fold cannot tell whether it did. */
const TALL = '<div style="height: 3000px"></div>';

const fixture = await open({
  port: PORT,
  /* The same three items on both sides, handed over as data
     rather than written into the bundle twice: two copies of a
     fixture that have to match is the failure this repository
     keeps naming, in a file about it. */
  body: `<div id="root">${served}</div>${TALL}`
    + `<script type="application/json" id="items">${JSON.stringify(ITEMS)}</script>`,
  entry: `
    import { hydrateRoot } from "react-dom/client";
    ${PAGE}
    hydrateRoot(document.getElementById("root"),
      markup(JSON.parse(document.getElementById("items").textContent)));
  `,
});

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

/** React only says a hydration mismatch out loud in development,
    and says it as a numbered error once minified. Both spellings
    are watched, because this bundle is the first and the site's is
    the second. */
const mismatches = (errors: string[]): string[] => errors.filter((e) =>
  /Minified React error #(418|423|425)|did not match|Hydration failed/i.test(e));

interface Opened {
  page: Page;
  context: BrowserContext;
  errors: string[];
}

/** One page, hydrated. The cards becoming controls is what says
    React has run, so nothing below waits on a timeout. */
const openPage = async (o: { reducedMotion?: "reduce" | "no-preference" } = {}):
Promise<Opened> => {
  const context = await fixture.browser.newContext({
    reducedMotion: o.reducedMotion ?? "no-preference",
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => errors.push(e.message));
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error" && !/favicon|Failed to load resource/i.test(m.text())) {
      errors.push(m.text());
    }
  });
  await page.addInitScript(RECORD);
  await page.goto(fixture.origin, { waitUntil: "load" });
  await page.waitForSelector(".res-live");
  return { page, context, errors };
};

/** What every card is saying and offering. */
const cards = (page: Page) => page.$$eval(".res", (nodes: Element[]) =>
  nodes.map((n) => ({
    tag: n.tagName,
    cls: n.className,
    role: n.getAttribute("role"),
    tabindex: n.getAttribute("tabindex"),
    eyebrow: (n.querySelector(".res-tag")?.textContent ?? "").trim(),
    title: (n.querySelector("h3")?.textContent ?? "").trim(),
    blurb: (n.querySelector("p")?.textContent ?? "").trim(),
    fallback: n.querySelector(".res-fallback")?.getAttribute("href") ?? null,
    fallbackText: (n.querySelector(".res-fallback")?.textContent ?? "").trim(),
  })));

/** Everything the window is saying, once one is open. */
const win = (page: Page) => page.$eval("dialog.res-window", (n: Element) => {
  const d = n as HTMLDialogElement;
  const foot = [...d.querySelectorAll(".news-window-foot a")] as HTMLAnchorElement[];
  const close = d.querySelector(".news-window-bar button") as HTMLButtonElement;
  return {
    open: d.open,
    id: d.id,
    cls: d.className,
    label: d.getAttribute("aria-label"),
    meta: (d.querySelector(".news-window-meta")?.textContent ?? "").trim(),
    title: (d.querySelector(".news-window-title")?.textContent ?? "").trim(),
    detail: [...d.querySelectorAll(".res-window-detail p")]
      .map((p) => (p.textContent ?? "").trim()),
    body: (d.querySelector(".news-window-body")?.textContent ?? "").trim(),
    closeTag: close.tagName,
    closeCls: close.className,
    closeLabel: close.getAttribute("aria-label"),
    closeText: (close.textContent ?? "").trim(),
    outHref: foot[0]?.getAttribute("href") ?? null,
    outText: (foot[0]?.textContent ?? "").trim(),
    outTarget: foot[0]?.getAttribute("target") ?? null,
    allHref: foot[1]?.getAttribute("href") ?? null,
    allText: (foot[1]?.textContent ?? "").trim(),
    dialogs: document.querySelectorAll("dialog").length,
  };
});

interface Frame { transform?: string; opacity?: number }
interface Animation { cls: string; frames: Frame[]; options: { duration?: number } }

const animations = (page: Page): Promise<Animation[]> => page.evaluate(() =>
  (window as unknown as { __animated: Animation[] }).__animated);

console.log("the research window on the About page");

/* ============================================================
   1. What the server sends, which is three cards and three links
   ============================================================ */
{
  ok("the three cards are in the server's HTML",
    (served.match(/class="res"/g) ?? []).length === 3, served.slice(0, 200));
  ok("and each carries a plain link to its case study, so the research "
    + "leads somewhere with no JavaScript at all",
    ITEMS.every((it) =>
      served.includes(`class="res-fallback more" href="${it.href}"`)),
    served.slice(0, 400));
  ok("none of them claims to be a control before anything is listening",
    !served.includes("res-live") && !served.includes('role="button"'),
    "a pointer cursor over a card that does nothing is worse than no cursor");
  ok("and no window ships with the page", !served.includes("res-window"));
}

/* ============================================================
   2. What hydration turns them into
   ============================================================ */
{
  const { page, context, errors } = await openPage();
  const list = await cards(page);

  ok("one card per piece of research, in the order the route gave them",
    list.map((c) => c.title).join(" | ") === ITEMS.map((i) => i.title).join(" | "),
    list.map((c) => c.title).join(" | "));
  ok("each says what kind of work it was", list[0].eyebrow === ITEMS[0].tag,
    list[0].eyebrow);
  ok("and what the work found", list[0].blurb === ITEMS[0].blurb, list[0].blurb);

  ok("every card becomes a control", list.every((c) => c.role === "button"),
    list.map((c) => c.role).join(","));
  ok("reachable from the keyboard", list.every((c) => c.tabindex === "0"),
    list.map((c) => c.tabindex).join(","));
  ok("and looking like one, which is what .res-live is for",
    list.every((c) => c.cls.split(" ").includes("res-live")),
    list.map((c) => c.cls).join(" / "));
  ok("the card itself is the control rather than a button inside it, "
    + "because a button may not contain a heading",
    list.every((c) => c.tag === "ARTICLE"), list.map((c) => c.tag).join(","));

  ok("and the plain link goes, so there are not two ways in saying the "
    + "same thing", list.every((c) => c.fallback === null),
    list.map((c) => c.fallback).join(","));

  ok("nothing hydrated wrongly on the way", mismatches(errors).length === 0,
    mismatches(errors)[0]);
  await context.close();
}

/* ============================================================
   3. The window, filled from the card that was pressed
   ============================================================ */
{
  const { page, context, errors } = await openPage();

  await page.click(".res >> nth=0");
  await page.waitForSelector("dialog.res-window[open]");
  const w = await win(page);

  ok("a card opens a modal window", w.open === true);
  ok("there is exactly one window in the document", w.dialogs === 1,
    String(w.dialogs));
  ok("it is the news window with a different body, so the two mini windows "
    + "on this site are one thing to learn",
    w.cls.split(" ").includes("news-window") && w.cls.split(" ").includes("res-window"),
    w.cls);
  ok("under its own id", w.id === "res-window", w.id);
  ok("and it says what it is", w.label === "Research", w.label ?? "none");

  ok("the bar carries the card's own kind of work", w.meta === ITEMS[0].tag, w.meta);
  ok("the heading is the card's heading", w.title === ITEMS[0].title, w.title);

  ok("the detail is what the card had no room for, every paragraph of it",
    w.detail.join(" | ") === ITEMS[0].detail.join(" | "), w.detail.join(" | "));
  ok("and not the card's own blurb, which is the shape of the bug that "
    + "shipped: an empty <template> cloned into an empty window",
    !w.body.includes(ITEMS[0].blurb), w.body.slice(0, 120));

  ok("the way out is the case study", w.outHref === ITEMS[0].href,
    w.outHref ?? "none");
  ok("named the way the card named it", w.outText === `${ITEMS[0].label} →`,
    w.outText);
  ok("on this site, so it is not opened away from it", w.outTarget === null,
    w.outTarget ?? "none");
  ok("and the second button is the way to all of them",
    w.allHref === "/portfolio.html" && w.allText === "All the case studies",
    `${w.allHref ?? "none"} / ${w.allText}`);

  ok("the way out of the window is a real button", w.closeTag === "BUTTON");
  ok("wearing the site's own, which is what the story window wears",
    w.closeCls.includes("btn") && w.closeCls.includes("btn-ghost"), w.closeCls);
  ok("saying so to a screen reader", w.closeLabel === "Close", w.closeLabel ?? "none");
  ok("and to everybody else", w.closeText === "✕ Esc", w.closeText);

  /* The second card, because a window built once and reused is the
     one that shows the last card's words on the next press. */
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog.res-window", { state: "detached" });
  await page.click(".res >> nth=1");
  await page.waitForSelector("dialog.res-window[open]");
  const second = await win(page);
  ok("pressing a second card shows the second card",
    second.title === ITEMS[1].title, second.title);
  ok("with its own detail", second.detail.join(" | ") === ITEMS[1].detail.join(" | "),
    second.detail.join(" | "));
  ok("its own way out", second.outHref === ITEMS[1].href, second.outHref ?? "none");
  ok("and still only one window exists", second.dialogs === 1,
    String(second.dialogs));

  ok("opening a card is not navigating anywhere",
    new URL(page.url()).pathname === "/", page.url());
  ok("and none of it is React putting the server's markup back",
    mismatches(errors).length === 0, mismatches(errors)[0]);
  await context.close();
}

/* ============================================================
   4. It grows out of the card that was pressed
   ============================================================ */
{
  const { page, context } = await openPage();

  await page.click(".res >> nth=0");
  await page.waitForSelector("dialog.res-window[open]");
  const first = (await animations(page)).find((a) => a.cls.includes("res-window"));

  ok("the window grows rather than appearing", first !== undefined,
    (await animations(page)).map((a) => a.cls).join(",") || "nothing animated");
  ok("over the site's own 320ms", first?.options.duration === 320,
    JSON.stringify(first?.options ?? {}));
  ok("from a rectangle it has to be scaled out of",
    /^translate\(-?[\d.]+px, -?[\d.]+px\) scale\([\d.]+, [\d.]+\)$/
      .test(first?.frames[0].transform ?? ""),
    first?.frames[0].transform ?? "no transform");
  ok("fading up as it goes",
    first?.frames[0].opacity === 0.4 && first?.frames[1].opacity === 1,
    JSON.stringify(first?.frames.map((f) => f.opacity) ?? []));
  ok("and ending where the stylesheet puts it",
    first?.frames[1].transform === "translate(0, 0) scale(1, 1)",
    first?.frames[1].transform ?? "none");

  /* The whole point of measuring: a third card is somewhere else
     on the page, so it grows from somewhere else. An animation
     that is the same whichever card was pressed is a window that
     does not say which of three was opened. */
  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog.res-window", { state: "detached" });
  await page.click(".res >> nth=2");
  await page.waitForSelector("dialog.res-window[open]");
  const both = (await animations(page)).filter((a) => a.cls.includes("res-window"));
  ok("a different card grows the window from a different place",
    both.length === 2 && both[0].frames[0].transform !== both[1].frames[0].transform,
    both.map((a) => a.frames[0].transform).join("  |  "));

  await context.close();
}

/* ============================================================
   5. And under prefers-reduced-motion it simply appears
   ============================================================ */
{
  const { page, context } = await openPage({ reducedMotion: "reduce" });
  await page.click(".res >> nth=0");
  await page.waitForSelector("dialog.res-window[open]");
  ok("a reader who asked for less motion gets the window and no growing",
    (await animations(page)).length === 0,
    String((await animations(page)).length));
  ok("and it is the same window, open, saying the same thing",
    (await win(page)).title === ITEMS[0].title);
  await context.close();
}

/* ============================================================
   6. The keyboard, which is the reason for role and tabindex
   ============================================================ */
{
  const { page, context } = await openPage();

  await page.focus(".res >> nth=1");
  await page.keyboard.press("Enter");
  await page.waitForSelector("dialog.res-window[open]");
  ok("Enter on a focused card opens it", (await win(page)).title === ITEMS[1].title);

  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog.res-window", { state: "detached" });

  await page.focus(".res >> nth=2");
  await page.keyboard.press("Space");
  await page.waitForSelector("dialog.res-window[open]");
  ok("and so does Space", (await win(page)).title === ITEMS[2].title);
  ok("without scrolling the page out from under the reader, which is what "
    + "Space does to a page that has not prevented it",
    await page.evaluate(() => window.scrollY) === 0,
    String(await page.evaluate(() => window.scrollY)));

  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog.res-window", { state: "detached" });
  await page.focus(".res >> nth=0");
  await page.keyboard.press("Tab");
  ok("and no other key opens anything", (await page.$("dialog.res-window")) === null);

  await context.close();
}

/* ============================================================
   7. The three ways out, and the way back in
   ============================================================ */
{
  const { page, context } = await openPage();

  await page.click(".res >> nth=0");
  await page.waitForSelector("dialog.res-window[open]");
  await page.click(".news-window-bar button");
  await page.waitForSelector("dialog.res-window", { state: "detached" });
  ok("the close button closes it", (await page.$("dialog.res-window")) === null);

  await page.click(".res >> nth=0");
  await page.waitForSelector("dialog.res-window[open]");
  ok("and the same card opens again afterwards, which a window the page "
    + "still thought was open could not",
    (await win(page)).title === ITEMS[0].title);

  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog.res-window", { state: "detached" });
  ok("Escape closes it, because showModal() is what opened it",
    (await page.$("dialog.res-window")) === null);

  /* The backdrop belongs to the dialog, so a click on it targets
     the dialog itself. A click INSIDE targets something else, and
     the difference is the whole rule. */
  await page.click(".res >> nth=0");
  await page.waitForSelector("dialog.res-window[open]");
  await page.click(".news-window-title");
  ok("a click inside the window leaves it open",
    (await page.$("dialog.res-window[open]")) !== null);
  await page.mouse.click(4, 4);
  await page.waitForSelector("dialog.res-window", { state: "detached" });
  ok("and a click outside it closes it",
    (await page.$("dialog.res-window")) === null);

  await context.close();
}

/* ============================================================
   8. One flip, and the two modules that are gone
   ============================================================ */
{
  const read = (...parts: string[]): string =>
    readFileSync(join(ROOT, ...parts), "utf8");

  ok("aab/about.js is not served any more",
    !existsSync(join(ROOT, "aab", "about.js")));
  ok("and neither is the module it was the last importer of",
    !existsSync(join(ROOT, "aab", "news.js")));
  ok("both are readable in archive/, which is where a replaced file goes",
    existsSync(join(ROOT, "archive", "modules", "about.js"))
    && existsSync(join(ROOT, "archive", "modules", "news.js")));
  ok("and the About page does not ask for a script that is gone",
    !read("next", "app", "(site)", "about.html", "layout.tsx").includes("about.js"));

  /* The animation was written twice while both existed: once in
     the module and once in `news.tsx`, which copied it rather than
     importing from the file it was replacing. Two mini windows
     opening at different speeds would be the two feeling like
     different sites. */
  const flip = read("next", "lib", "flip.ts");
  ok("the FLIP is one function", flip.includes("export function flip("));
  for (const component of ["news", "research"]) {
    const src = read("next", "components", `${component}.tsx`);
    ok(`components/${component}.tsx imports it rather than keeping a copy`,
      /import \{ flip \} from "\.\.\/lib\/flip"/.test(src)
      && !src.includes("function flip("), component);
  }

  /* The words are the route's, and the empty `<template>` that the
     module used to clone is what this is really watching for: the
     window rendered perfectly with nothing in it.

     Comments stripped first, because the prose in this repository
     is long on purpose and one paragraph of it names the very
     thing this is looking for. `check-components.ts` reads a
     source the same way and says why. */
  const route = read("next", "app", "(site)", "about.html", "page.tsx")
    .replace(/\/\*[\s\S]*?\*\//g, "");
  ok("the route renders the component", route.includes("<Research items={RESEARCH} />"));
  ok("and hands it the page's own words rather than a template to clone",
    !route.includes("<template"),
    "an empty template is a window that opens on nothing");
  ok("all three cards, each with something to say in the window",
    (route.match(/^\s{4}detail: \[$/gm) ?? []).length === 3,
    String((route.match(/^\s{4}detail: \[$/gm) ?? []).length));
  ok("and every one of them names the case study it became",
    ITEMS.every((it) => route.includes(`href: "${it.href}"`)));
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await fixture.close(1);
}
console.log("Three cards that are links without JavaScript and controls with it,\n"
  + "and a window that grows out of the one you pressed.\n");
await fixture.close(0);
