/* ============================================================
   market-pulse.test.ts: the board of headlines on the Insights
   hub, in a browser.

     node next/market-pulse.test.ts

   Needs Playwright and a browser. Without either it says which and
   skips, and a skip is not a pass.

   `archive/modules/news.js` was 246 lines and
   `archive/modules/pulse.js` 83, and between them they did six
   things: raced two endpoints, kept the answer
   on the device, drew a square per story, opened one into a modal
   window that grows out of the card it came from, said when the
   feed was last updated, and got out of the way when it could not
   be reached at all. They are `components/news.tsx` and
   `components/market-pulse.tsx` now, and a port is finished when
   it does what the thing it replaced did, not when it renders, so
   all six are written down here.

   ---- why a browser ----

   None of it exists until React has hydrated and an effect has
   run: the server sends an empty live region and nothing else, on
   purpose, because what a reader has cached and whether a feed
   answers are facts about one browser. `/insights` is
   `force-dynamic`, so `interactive.test.ts` cannot serve it, and
   `hydrate-fixture.ts` is the smaller way in.

   ---- and why the endpoints are Playwright routes ----

   Both are real `fetch()` calls made by the component, so
   intercepting them at the network is the only way to answer as
   the two deployments would: one down and one up, both up, both
   down, and an answer with nothing in it. No mock and no
   injection, and the component under test is the one the route
   ships. `/tilt.js` is a served file instead, for the same reason
   `insights-hub.test.ts` serves `/api.js`: `runtimeModule()` is a
   real `import()` resolved against the origin the page came from.
   ============================================================ */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load, open } from "./hydrate-fixture.ts";
import type { BrowserContext, ConsoleMessage, Page, Route } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PORT = 8995;

const API = /\/api\/news$/;
const WORKER = /market-pulse\.i-reiad\.workers\.dev/;

/* Four stories, arranged so every rule a card follows has
   something to say: one translated into Bangla with a standfirst,
   one global with none, one with no time on it, and one nobody
   published under a name. */
const HOURS = (n: number): string => new Date(Date.now() - n * 3600_000).toISOString();

const FEED = {
  updated: new Date(Date.now() - 12 * 60_000).toISOString(),
  items: [
    {
      title: "Central bank holds the policy rate",
      title_bn: "নীতি সুদহার অপরিবর্তিত রাখল কেন্দ্রীয় ব্যাংক",
      url: "https://www.tbsnews.net/economy/policy-rate",
      source: "The Business Standard",
      region: "BD",
      published: HOURS(3),
      summary: "The rate stays where it was, and the reasoning is the same as last quarter.",
    },
    {
      title: "Wall Street closes higher on rate hopes",
      url: "https://www.bbc.co.uk/news/business/wall-street",
      source: "BBC Business",
      region: "Global",
      published: HOURS(9),
    },
    {
      title: "A story nobody dated",
      url: "https://www.bbc.co.uk/news/business/undated",
      source: "BBC Business",
      region: "Global",
      published: null,
      summary: "No timestamp came with it.",
    },
    {
      title: "A story with no publisher on it",
      url: "https://www.tbsnews.net/economy/anonymous",
      region: "BD",
      published: HOURS(30),
    },
  ],
};

/** The other deployment, so a check can tell which one answered. */
const WORKER_FEED = {
  updated: new Date(Date.now() - 5 * 60_000).toISOString(),
  items: [{
    title: "The standalone Worker answered",
    url: "https://www.bbc.co.uk/news/business/worker",
    source: "BBC Business",
    region: "Global",
    published: HOURS(1),
  }],
};

/* ---------- the server's half, rendered here ---------- */

interface Server {
  renderToString: (node: unknown) => string;
  markup: () => unknown;
}

const { renderToString, markup } = await load<Server>(`
  import { createElement as h } from "react";
  import { MarketPulse } from "./components/market-pulse";
  export { renderToString } from "react-dom/server.browser";
  export const markup = () => h("section", null, h(MarketPulse, null));
`);

const served = renderToString(markup());

/* ---------- and the browser's, hydrating that exact markup ---------- */

/* Every animation this page starts, recorded before anything can
   run one. The window grows out of the card it came from and the
   growing is the only thing on the page that says WHICH of twelve
   squares was opened, so it is asserted rather than assumed; a
   moment later it has finished and there is nothing to see.
   `read-aloud.test.ts` patches `scrollIntoView` for the same
   reason. */
const RECORD = `
  window.__animated = [];
  const real = Element.prototype.animate;
  Element.prototype.animate = function (frames, options) {
    window.__animated.push({ cls: this.className, frames: frames, options: options });
    return real.apply(this, arguments);
  };
`;

const fixture = await open({
  port: PORT,
  body: `<div id="root">${served}</div>`,
  entry: `
    import { createElement as h } from "react";
    import { hydrateRoot } from "react-dom/client";
    import { MarketPulse } from "./components/market-pulse";
    hydrateRoot(document.getElementById("root"),
      h("section", null, h(MarketPulse, null)));
  `,
  files: {
    /* The grid arrives long after `initTilt()` has run, so the
       component has to hand it over. This is `/tilt.js` as far as
       the component is concerned, and it records what it was
       given. */
    "/tilt.js": {
      type: "text/javascript; charset=utf-8",
      body: `export function tiltIn(root) {
        (window.__tilted = window.__tilted || []).push(root.className);
      }`,
    },
  },
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

/** What one endpoint answers. `null` is the deployment being down,
    which is the case the race exists for. */
type Reply = { status?: number; json: unknown } | null;

const answer = async (page: Page, url: RegExp, reply: Reply, count?: () => void):
Promise<void> => {
  await page.route(url, (route: Route) => {
    count?.();
    if (!reply) { void route.abort(); return; }
    void route.fulfill({
      status: reply.status ?? 200,
      contentType: "application/json",
      /* The second endpoint is another origin, so the browser
         applies CORS to a fulfilled response exactly as it would
         to a real one. */
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(reply.json),
    });
  });
};

interface Opts {
  api?: Reply;
  worker?: Reply;
  /** Runs in the page before any of its own scripts, which is how
      the device's own copy is put there. */
  before?: string;
  reducedMotion?: "reduce" | "no-preference";
}

interface Opened {
  page: Page;
  context: BrowserContext;
  errors: string[];
}

/** One page, hydrated, with both endpoints answering as told.
    The locale is pinned because every relative time on the page
    is `Intl.RelativeTimeFormat`'s and the machine's own locale is
    not a thing to assert against. */
const openPage = async (o: Opts = {}): Promise<Opened> => {
  const context = await fixture.browser.newContext({
    locale: "en-GB",
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
  if (o.before) await page.addInitScript(o.before);
  await answer(page, API, o.api ?? null);
  await answer(page, WORKER, o.worker ?? null);
  await page.goto(fixture.origin, { waitUntil: "load" });
  return { page, context, errors };
};

/** The grid the cards are in, which is the one that is not the
    skeleton row. */
const GRID = '.news-grid:not([aria-hidden="true"])';

const cards = (page: Page) => page.$$eval(".news-card:not(.skeleton)",
  (nodes: Element[]) => nodes.map((n) => ({
    title: (n.querySelector(".news-card-title")?.textContent ?? "").trim(),
    bn: n.querySelector(".news-card-title")?.classList.contains("nt-bn") ?? false,
    region: (n as HTMLElement).dataset.region ?? "",
    pill: (n.querySelector(".pill")?.textContent ?? "").trim(),
    pillClass: n.querySelector(".pill")?.className ?? "",
    time: (n.querySelector("time")?.textContent ?? "").trim(),
    dateTime: n.querySelector("time")?.getAttribute("datetime") ?? null,
    summary: n.querySelector(".news-card-sum")?.textContent ?? null,
    source: (n.querySelector(".news-card-src")?.textContent ?? "").trim(),
    arrow: n.querySelector(".news-card-go")?.getAttribute("aria-hidden") ?? null,
    tag: n.tagName,
  })));

/** Everything the window is saying, once one is open. */
const win = (page: Page) => page.$eval("dialog.news-window", (n: Element) => {
  const d = n as HTMLDialogElement;
  const out = d.querySelector(".news-window-foot a") as HTMLAnchorElement;
  return {
    open: d.open,
    meta: (d.querySelector(".news-window-meta")?.textContent ?? "").trim(),
    title: (d.querySelector(".news-window-title")?.textContent ?? "").trim(),
    bn: d.querySelector(".news-window-title")?.classList.contains("nt-bn") ?? false,
    en: (d.querySelector(".news-window-en")?.textContent ?? "").trim(),
    enHidden: (d.querySelector(".news-window-en") as HTMLElement).hidden,
    summary: (d.querySelector(".news-window-sum")?.textContent ?? "").trim(),
    sumHidden: (d.querySelector(".news-window-sum") as HTMLElement).hidden,
    note: (d.querySelector(".news-window-note")?.textContent ?? "").trim(),
    outHref: out.getAttribute("href"),
    outText: (out.textContent ?? "").trim(),
    outTarget: out.getAttribute("target"),
    outRel: out.getAttribute("rel"),
    outNoPrerender: out.hasAttribute("data-no-prerender"),
    allHref: (d.querySelectorAll(".news-window-foot a")[1] as HTMLAnchorElement)
      .getAttribute("href"),
    dialogs: document.querySelectorAll("dialog").length,
  };
});

const noteText = (page: Page) =>
  page.$eval(".pulse-updated", (n: Element) => (n.textContent ?? "").trim());

console.log("the market pulse on the Insights hub");

/* ============================================================
   1. What the server sends, which is the region and nothing in it
   ============================================================ */
{
  ok("the live region is in the server's HTML",
    /<div id="pulse" aria-live="polite">/.test(served), served.slice(0, 200));
  ok("and it is empty, because what a browser has cached is not a "
    + "fact the server has",
    /<div id="pulse" aria-live="polite"><\/div>/.test(served), served.slice(0, 300));
  ok("no cards ship with the page", !served.includes("news-card"), served.slice(0, 300));
  ok("nor a window nobody has opened", !served.includes("news-window"));
  ok("and nothing here is hidden by CSS waiting for a script",
    !served.includes("hidden"),
    "a reader with no JavaScript gets the rest of the page, not eight grey squares");
}

/* ============================================================
   2. The skeleton, while the feed is on its way
   ============================================================ */
{
  const context = await fixture.browser.newContext({ locale: "en-GB" });
  const page = await context.newPage();
  /* Held open rather than answered, so the loading state is a
     state and not a frame between two paints. */
  await page.route(API, async (route: Route) => {
    await new Promise((r) => setTimeout(r, 900));
    await route.fulfill({
      status: 200, contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(FEED),
    });
  });
  await answer(page, WORKER, null);
  await page.goto(fixture.origin, { waitUntil: "load" });

  await page.waitForSelector(".news-card.skeleton", { state: "attached" });
  const skeletons = await page.$$eval(".news-card.skeleton", (n: Element[]) => n.length);
  ok("eight squares stand in for the stories while it loads", skeletons === 8,
    String(skeletons));
  ok("in a grid the same shape as the real one",
    await page.$eval(".news-card.skeleton",
      (n: Element) => n.parentElement?.className) === "news-grid");
  ok("and the row is hidden from a screen reader, which has nothing to "
    + "gain from eight empty cards",
    await page.$eval(".news-card.skeleton",
      (n: Element) => n.parentElement?.getAttribute("aria-hidden")) === "true");

  await page.waitForSelector(GRID);
  ok("the stories replace them rather than joining them",
    (await page.$$(".news-card.skeleton")).length === 0);
  await context.close();
}

/* ============================================================
   3. The cards
   ============================================================ */
{
  const { page, context, errors } = await openPage({ api: { json: FEED } });
  await page.waitForSelector(GRID);
  const list = await cards(page);

  ok("one square per story, in the order the feed sent them",
    list.map((c) => c.title).join(" | ") === [
      "নীতি সুদহার অপরিবর্তিত রাখল কেন্দ্রীয় ব্যাংক",
      "Wall Street closes higher on rate hopes",
      "A story nobody dated",
      "A story with no publisher on it",
    ].join(" | "), list.map((c) => c.title).join(" | "));

  ok("a headline that has been translated is shown in Bangla", list[0].bn === true);
  ok("in the Bangla serif rather than the site's own",
    list[0].title.startsWith("নীতি"), list[0].title);
  ok("and one that has not is left alone", list[1].bn === false);

  ok("a Bangladesh story says so", list[0].pill === "Bangladesh", list[0].pill);
  ok("and everything else says Global", list[1].pill === "Global", list[1].pill);
  ok("the two carry different classes, so the stylesheet can tell them apart",
    list[0].pillClass.includes("pill-bd") && list[1].pillClass.includes("pill-global"),
    `${list[0].pillClass} / ${list[1].pillClass}`);
  ok("and the card itself is marked with which it is",
    list[0].region === "bd" && list[1].region === "global",
    `${list[0].region} / ${list[1].region}`);

  ok("the time is said the way a person says it", list[0].time === "3 hours ago",
    list[0].time);
  ok("and written the way a machine reads it",
    list[0].dateTime === FEED.items[0].published, list[0].dateTime ?? "none");
  ok("a story nobody dated shows no time at all", list[2].time === "", list[2].time);
  ok("and carries no empty timestamp either", list[2].dateTime === null,
    list[2].dateTime ?? "none");

  ok("the publisher's standfirst is on the card",
    list[0].summary === FEED.items[0].summary, list[0].summary ?? "none");
  ok("and a story without one has no empty box where it would be",
    list[1].summary === null, list[1].summary ?? "none");

  ok("the publisher is named", list[0].source === "The Business Standard",
    list[0].source);
  ok("and a story with no publisher leaves the line blank rather than saying "
    + "undefined", list[3].source === "", list[3].source);

  ok("the way in is an arrow rather than a word, because the alternative "
    + "was cutting the publisher's name", list[0].arrow === "true");
  ok("a card is a button, so a mistaken click cannot navigate",
    list.every((c) => c.tag === "BUTTON"), list.map((c) => c.tag).join(","));

  ok("the line under the grid says when the feed was last updated",
    await noteText(page)
      === "Updated 12 minutes ago · tap a card for a little more",
    await noteText(page));

  const tilted = await page.evaluate(() =>
    (window as unknown as { __tilted?: string[] }).__tilted ?? []);
  ok("the grid is handed to /tilt.js, because it arrives after initTilt() has run",
    tilted.includes("news-grid"), tilted.join(",") || "nothing was");

  ok("nothing hydrated wrongly on the way", mismatches(errors).length === 0,
    mismatches(errors)[0]);
  await context.close();
}

/* ============================================================
   4. The mini window
   ============================================================ */
{
  const { page, context, errors } = await openPage({ api: { json: FEED } });
  await page.waitForSelector(GRID);

  await page.click(".news-card >> nth=0");
  await page.waitForSelector("dialog.news-window[open]");
  const w = await win(page);

  ok("a card opens a modal window rather than the publisher's site", w.open === true);
  ok("there is exactly one window in the document", w.dialogs === 1,
    String(w.dialogs));
  ok("it carries the headline the card carried",
    w.title === FEED.items[0].title_bn, w.title);
  ok("in the Bangla face", w.bn === true);
  ok("with the publisher's own English underneath", w.en === FEED.items[0].title
    && !w.enHidden, `${w.en} hidden=${String(w.enHidden)}`);
  ok("and the standfirst in full", w.summary === FEED.items[0].summary, w.summary);
  ok("the bar says where it is from, who published it and when",
    w.meta === "Bangladesh  ·  The Business Standard  ·  3 hours ago", w.meta);
  ok("a translated headline says so, in Bangla",
    w.note.startsWith("শিরোনামের বাংলা রূপ"), w.note);

  ok("the button out goes to the story itself",
    w.outHref === FEED.items[0].url, w.outHref ?? "none");
  ok("and names the publisher on it",
    w.outText === "Read it at The Business Standard →", w.outText);
  ok("it opens away from this site", w.outTarget === "_blank", w.outTarget ?? "none");
  ok("without handing it this page", w.outRel === "noopener", w.outRel ?? "none");
  ok("and is never prerendered, because somebody else's site is not "
    + "ours to fetch on a hover", w.outNoPrerender === true);
  ok("the second button is the way back to all of them",
    w.allHref === "/insights", w.allHref ?? "none");

  const animated = await page.evaluate(() =>
    (window as unknown as { __animated: Array<{ cls: string;
      options: { duration?: number } }> }).__animated);
  ok("the window grows out of the card it came from",
    animated.some((a) => a.cls.includes("news-window")),
    animated.map((a) => a.cls).join(",") || "nothing animated");
  ok("over the site's own 320ms",
    animated.find((a) => a.cls.includes("news-window"))?.options.duration === 320,
    JSON.stringify(animated[0]?.options ?? {}));

  await page.keyboard.press("Escape");
  await page.waitForSelector("dialog.news-window", { state: "detached" });
  ok("Escape closes it, because showModal() is what opened it",
    (await page.$("dialog.news-window")) === null);

  /* An English-only story, which is the other half of three of the
     lines above. */
  await page.click(".news-card >> nth=1");
  await page.waitForSelector("dialog.news-window[open]");
  const second = await win(page);
  ok("opening a second story shows the second story",
    second.title === FEED.items[1].title, second.title);
  ok("and still only one window exists", second.dialogs === 1, String(second.dialogs));
  ok("a headline nobody translated has no English line under it",
    second.enHidden === true);
  ok("and its note is the English one",
    second.note.startsWith("Selected automatically"), second.note);
  ok("a story with no standfirst hides the paragraph rather than "
    + "showing an empty one", second.sumHidden === true);

  await page.click(".news-window-bar button");
  await page.waitForSelector("dialog.news-window", { state: "detached" });
  ok("the close button closes it", (await page.$("dialog.news-window")) === null);

  /* The backdrop belongs to the dialog, so a click on it targets
     the dialog itself. A click INSIDE targets something else, and
     the difference is the whole rule. */
  await page.click(".news-card >> nth=2");
  await page.waitForSelector("dialog.news-window[open]");
  await page.click(".news-window-title");
  ok("a click inside the window leaves it open",
    (await page.$("dialog.news-window[open]")) !== null);
  await page.mouse.click(4, 4);
  await page.waitForSelector("dialog.news-window", { state: "detached" });
  ok("and a click outside it closes it",
    (await page.$("dialog.news-window")) === null);

  ok("a story with no publisher still offers a way to read it",
    await (async () => {
      await page.click(".news-card >> nth=3");
      await page.waitForSelector("dialog.news-window[open]");
      const last = await win(page);
      return last.outText === "Read it at the source →";
    })(), "the button says the source when the feed named nobody");

  ok("opening a story is not navigating anywhere",
    new URL(page.url()).pathname === "/", page.url());
  ok("and none of it is React putting the server's markup back",
    mismatches(errors).length === 0, mismatches(errors)[0]);
  await context.close();
}

/* ============================================================
   5. And under prefers-reduced-motion it simply appears
   ============================================================ */
{
  const { page, context } = await openPage({
    api: { json: FEED }, reducedMotion: "reduce",
  });
  await page.waitForSelector(GRID);
  await page.click(".news-card >> nth=0");
  await page.waitForSelector("dialog.news-window[open]");
  const animated = await page.evaluate(() =>
    (window as unknown as { __animated: unknown[] }).__animated);
  ok("a reader who asked for less motion gets the window and no growing",
    animated.length === 0, String(animated.length));
  ok("and it is the same window, open", await page.$("dialog.news-window[open]") !== null);
  await context.close();
}

/* ============================================================
   6. Two endpoints, raced, and the device as the last resort
   ============================================================ */
{
  /* The first deployment down and the second up: the point of
     racing them is that the page does not care which. */
  const { page, context } = await openPage({
    api: null, worker: { json: WORKER_FEED },
  });
  await page.waitForSelector(GRID);
  const list = await cards(page);
  ok("with one endpoint down the other one still answers", list.length === 1,
    String(list.length));
  ok("and it is that one's stories on the page",
    list[0].title === "The standalone Worker answered", list[0].title);
  await context.close();
}

{
  const { page, context } = await openPage({ api: { json: FEED } });
  await page.waitForSelector(GRID);
  const stored = await page.evaluate(() => localStorage.getItem("pulse-cache"));
  const parsed = JSON.parse(stored ?? "null") as
    { at?: number; data?: { items?: unknown[] } } | null;
  ok("a live answer is kept on the device", parsed !== null, stored ?? "nothing");
  ok("under the key real browsers already carry, which is never renamed",
    stored !== null, "pulse-cache");
  ok("with every story in it",
    parsed?.data?.items?.length === FEED.items.length,
    String(parsed?.data?.items?.length));
  ok("and the moment it arrived, which is what the offline line reads",
    typeof parsed?.at === "number" && Date.now() - (parsed.at ?? 0) < 60_000,
    String(parsed?.at));
  await context.close();
}

{
  /* Both down, and yesterday's answer on the device. */
  const seeded = JSON.stringify({ at: Date.now() - 3 * 3600_000, data: FEED });
  const { page, context } = await openPage({
    before: `localStorage.setItem("pulse-cache", ${JSON.stringify(seeded)});`,
  });
  await page.waitForSelector(GRID);
  const list = await cards(page);
  ok("with nothing reachable, the last answer this device had is shown",
    list.length === FEED.items.length, String(list.length));
  ok("and it says so, with when it was",
    await noteText(page) === "Offline: showing the last update, from 3 hours ago",
    await noteText(page));
  await context.close();
}

{
  /* A day is the limit, and this one is over it. */
  const stale = JSON.stringify({ at: Date.now() - 25 * 3600_000, data: FEED });
  const { page, context } = await openPage({
    before: `localStorage.setItem("pulse-cache", ${JSON.stringify(stale)});`,
  });
  await page.waitForSelector(".pulse-fallback", { timeout: 15_000 });
  ok("a copy older than a day is not shown as though it were news",
    (await page.$$(".news-card:not(.skeleton)")).length === 0);
  await context.close();
}

{
  /* Up, and with nothing to say. An empty feed is a deployment
     answering, which is not the same as an answer. */
  const { page, context } = await openPage({
    api: { json: { updated: FEED.updated, items: [] } },
    worker: { json: { updated: FEED.updated, items: [] } },
  });
  await page.waitForSelector(".pulse-fallback", { timeout: 15_000 });
  ok("an answer with no stories in it does not win the race",
    (await page.$$(".news-card:not(.skeleton)")).length === 0);
  await context.close();
}

/* ============================================================
   7. What it says when it cannot be reached at all
   ============================================================ */
{
  const { page, context, errors } = await openPage();
  await page.waitForSelector(".pulse-fallback", { timeout: 15_000 });

  const said = await page.$eval(".pulse-fallback",
    (n: Element) => (n.textContent ?? "").replace(/\s+/g, " ").trim());
  ok("it says the feed is not reachable rather than showing nothing",
    said.startsWith("The live feed isn't reachable right now"), said);
  ok("and sends the reader to the sources themselves",
    said.includes("The Business Standard") && said.includes("BBC Business"), said);

  const links = await page.$$eval(".pulse-fallback a", (nodes: Element[]) =>
    nodes.map((n) => ({
      href: n.getAttribute("href"), rel: n.getAttribute("rel"),
      target: n.getAttribute("target"),
    })));
  ok("both as real links", links.length === 2, String(links.length));
  ok("straight to the section each one publishes",
    links[0].href === "https://www.tbsnews.net/economy"
    && links[1].href === "https://www.bbc.co.uk/news/business",
    links.map((l) => l.href).join(" "));
  ok("opened away from this site, without handing it this page",
    links.every((l) => l.target === "_blank" && l.rel === "noopener"),
    JSON.stringify(links));
  ok("no grid is left behind it",
    (await page.$$(".news-card")).length === 0);
  ok("nothing hydrated wrongly on the way there", mismatches(errors).length === 0,
    mismatches(errors)[0]);
  await context.close();
}

{
  /* Try again asks again, and this time somebody answers. */
  const context = await fixture.browser.newContext({ locale: "en-GB" });
  const page = await context.newPage();
  let asked = 0;
  await page.route(API, (route: Route) => {
    asked += 1;
    if (asked < 3) { void route.abort(); return; }
    void route.fulfill({
      status: 200, contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(FEED),
    });
  });
  await answer(page, WORKER, null);
  await page.goto(fixture.origin, { waitUntil: "load" });
  await page.waitForSelector(".pulse-fallback", { timeout: 15_000 });

  ok("a first load that fails is tried once more on its own, quietly",
    asked === 2, `it was asked ${asked} time(s)`);

  await page.click(".row-flex button");
  await page.waitForSelector(GRID, { timeout: 15_000 });
  ok("Try again asks again", asked === 3, `it was asked ${asked} time(s)`);
  ok("and the section comes back rather than staying an apology",
    (await cards(page)).length === FEED.items.length);
  ok("with the note under it", (await noteText(page)).startsWith("Updated "),
    await noteText(page));
  await context.close();
}

{
  /* The quiet second chance, from the other side: the first
     request fails and the section is not condemned for the visit. */
  const context = await fixture.browser.newContext({ locale: "en-GB" });
  const page = await context.newPage();
  let asked = 0;
  await page.route(API, (route: Route) => {
    asked += 1;
    if (asked === 1) { void route.abort(); return; }
    void route.fulfill({
      status: 200, contentType: "application/json",
      headers: { "access-control-allow-origin": "*" },
      body: JSON.stringify(FEED),
    });
  });
  await answer(page, WORKER, null);
  await page.goto(fixture.origin, { waitUntil: "load" });

  await page.waitForSelector(".news-card.skeleton", { state: "attached" });
  ok("the squares stay up while it waits, rather than flashing an apology",
    (await page.$(".pulse-fallback")) === null);
  await page.waitForSelector(GRID, { timeout: 15_000 });
  ok("a flaky first moment does not condemn the section for the visit",
    (await cards(page)).length === FEED.items.length);
  ok("and it took exactly one more ask", asked === 2, `asked ${asked} time(s)`);
  await context.close();
}

/* ============================================================
   8. And the module it replaced is gone
   ============================================================ */
{
  ok("aab/pulse.js is not served any more",
    !existsSync(join(ROOT, "aab", "pulse.js")),
    "two market pulses is the copy CLAUDE.md refuses");
  ok("and it is readable in archive/, which is where a replaced file goes",
    existsSync(join(ROOT, "archive", "modules", "pulse.js")));
  ok("the Insights layout does not load it",
    !readFileSync(join(ROOT, "next", "app", "insights", "layout.tsx"), "utf8")
      .includes("pulse.js"));
  const precached = Object.keys(
    (JSON.parse(readFileSync(join(ROOT, "aab", "sw-manifest.json"), "utf8")) as
      { hashes: Record<string, string> }).hashes);
  ok("nothing precaches it", !precached.includes("/pulse.js"),
    "an install would fetch a 404 and cache it");

  /* `archive/modules/news.js` outlived this port by a day.
     `about.js` imported `el` and `flip` from it for the About
     page's research window,
     so taking the file away would have taken that page with it;
     the window is `components/research.tsx` now and both modules
     are archived. `research.test.ts` is what holds the window. */
  const importers = readdirSync(join(ROOT, "aab"))
    .filter((name) => name.endsWith(".js"))
    .filter((name) => /from\s+"\/news\.js"/
      .test(readFileSync(join(ROOT, "aab", name), "utf8")));
  ok("nothing in aab/ imports /news.js any more", importers.length === 0,
    importers.join(",") || "nothing does");
  ok("so it is not served either", !existsSync(join(ROOT, "aab", "news.js")));
  ok("and it is readable in archive/, beside the page that held it up",
    existsSync(join(ROOT, "archive", "modules", "news.js"))
    && existsSync(join(ROOT, "archive", "modules", "about.js")));

  /* Two things have carried the word "pulse" since before either
     was a component, and merging them would be a redesign wearing
     a port's clothes. */
  const card = readFileSync(join(ROOT, "next", "components", "pulse-card.tsx"), "utf8");
  ok("pulse-card.tsx is still the home page's card of WRITING",
    card.includes("the writing, one piece at a time") && !card.includes("news-card"),
    "two different things with one name, and neither was renamed");
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  await fixture.close(1);
}
console.log("Two endpoints raced, the device as the last resort, a board of\n"
  + "squares, and a window that grows out of the one you pressed.\n");
await fixture.close(0);
