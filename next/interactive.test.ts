/* ============================================================
   interactive.test.ts: does what a page's own module writes into
   it survive the page being a route?

     node next/interactive.test.ts

   Needs `npx next build` in `next/` first, and a browser. Without
   either it says which one is missing and skips, and a skip is not
   a pass.

   ---- what it is for ----

   Every calculator on this site went blank on the day its page
   stopped being a file. `parity.test.ts` could not see it and
   neither could any other check here, because all of them read
   HTML: the markup was right, the module was right, the module ran
   and computed the right number, and then React's hydration put
   the empty markup back. Nothing but a browser can tell those two
   apart, which is the same argument `app/desk.test.ts` makes for
   the desk and is why this file looks like that one.

   So each case below names a page and something in it that ONLY
   that page's module can have written: a stat with a figure in it,
   a chart with an axis, a panel of drivers. If the module never
   ran, or ran and had its work undone, the element is empty and
   the check fails.

   The pages are served the way Cloudflare serves them: the HTML
   Next prerendered, the chunks it built beside it, and everything
   else out of `aab/`, which is exactly the split `wrangler.toml`
   describes. The dynamic routes are not here: they need the
   database, and `parity.test.ts` is where they are asked about.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Page, Route } from "playwright";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8991;

/* A page, the file Next prerendered it into, and one thing in it
   that only its own module can have put there. Where the markup
   ships a placeholder for that thing, the placeholder is named
   too: an element that exists in the page either way proves
   nothing, and this is a check about whether anything filled it. */
type Case = [url: string, file: string, selector: string, what: string, placeholder?: string];
const CASES: Case[] = [
  /* The home page is not here any more. It carried `#kinetic`, a
     headline `/app.js` rebuilt one span per word, and the front
     door has no such thing since Stage 11.8: it renders three
     headlines and shows one, and the choosing is a stylesheet
     rule rather than a script. What holds the door now is the
     block at the foot of this file, which checks that it shows
     one introduction and fits one screen. */
  ["/tools", "tools.html", '[data-stat="final"] .v',
   "what a monthly habit becomes, computed by /tools/tools.js", "–"],
  ["/tools/stock", "tools/stock.html", "#pillars .pillar",
   "the six pillars, built by /tools/stock.js"],
  ["/portfolio/dcf", "portfolio/dcf.html", "#drivers *",
   "the valuation's drivers, built by /portfolio/dcf.js"],
  ["/portfolio/dsex", "portfolio/dsex.html", "#chart-index *",
   "the index chart, drawn by /portfolio/dsex.js"],
  ["/portfolio/stress", "portfolio/stress.html", "#drivers *",
   "the stress test's drivers, built by /portfolio/stress.js"],
  ["/portfolio/three-statement", "portfolio/three-statement.html", "#drivers *",
   "the model's drivers, built by /portfolio/three-statement.js"],
  ["/portfolio/dissertation", "portfolio/dissertation.html", "#chart-evidence *",
   "the evidence chart, drawn by /portfolio/dissertation.js"],
  ["/portfolio/frontier", "portfolio/frontier.html", "#frontier-chart *",
   "the frontier itself, drawn by /portfolio/frontier.js"],
  ["/portfolio/scorecard", "portfolio/scorecard.html", "#roc-chart *",
   "the ROC curve, drawn by /portfolio/scorecard.js"],
  /* Both of these were here for `/app.js`, which every page loads
     and no page's markup held any of: the hover panel it built
     under the Skills link was in neither file, so it was the one
     thing that proved the module had run.

     There is no panel. The menu is a rail rendered on the server
     and it is in both files, which is the improvement and also
     why it cannot be the witness here. `#app-toast` is app.js's
     now: the toast host is appended by the module and by nothing
     else, and it is on every page. */
  ["/portfolio", "portfolio.html", "#palette",
   "the Ctrl+K palette, built by /app.js"],
  ["/skills", "skills.html", "#palette",
   "the Ctrl+K palette, built by /app.js"],
];

/* The home page shows one of four introductions, chosen before the
   first paint from what the reader chose last time. All four at
   once is what shipped when the boot script that picks was left
   out of the port. */
/* Three answers, not four. The `track` axis went at Stage 11.8:
   it split a learner into "finance" and "skills" because the
   learning half had two front doors, money at /money/ and
   everything else at /skills/. The money school is one entry in
   the skills list now, so there is one door and nothing left to
   refine. Anything a browser still has stored under `track` is
   ignored. */
type Reader = [who: string, audience: string | null, track: string | null, expected: string];
const READERS: Reader[] = [
  ["a reader who has just arrived", null, null, "open"],
  ["a learner", "learn", null, "learn"],
  ["a reader here for work", "work", null, "work"],
];

let passed = 0;
const failures: string[] = [];
/** `detail` is whatever the page said, and a locator says null
    where there was nothing to say. */
const ok = (name: string, condition: unknown, detail: string | null = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

/** Says why, and does not come back: `never` rather than `void`,
    so the browser below is not optional once this line is past. */
const skip: (why: string) => never = (why) => {
  console.log(`interactive: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

/* ---- the two things this cannot run without ---- */

if (!await exists(join(BUILD, "server/app/index.html"))) {
  skip("next/.next holds no prerendered pages. Run `npx next build` in next/ first.");
}

const browserPath = process.env.CHROMIUM_PATH
  || (await exists("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    : null);

/* The runtime import is the real path, because node resolves a
   file on disk; the types come from the same package through the
   `paths` entry in `tsconfig.json`. The specifier is a VARIABLE
   because a literal is analysed, and a relative path `paths`
   cannot map is a module with no declaration. */
const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const playwright = await import(PLAYWRIGHT)
  .then((m) => m as typeof import("playwright"), () => null);
if (!playwright) {
  skip("playwright is not installed. It is a devDependency of app/: `cd app && npm install`.");
}
const { chromium } = playwright;
if (!browserPath && !process.env.CHROMIUM_PATH) {
  try {
    chromium.executablePath();
  } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---- the site, served the way Cloudflare serves it ---- */

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".xml": "application/xml",
};

/* Which URL is answered by which of Next's prerendered files.
   Mostly the cases above; the front door is here as well and is
   not one of them, because what it proves is not "a module ran"
   but "one introduction shows and the page fits a screen", which
   is the block at the foot of this file. Leaving it out of both
   is how it silently started 404ing. */
const PRERENDERED: Record<string, string> = {
  ...Object.fromEntries(CASES.map(([url, file]) => [url, file])),
  "/": "index.html",
  /* Not one of the cases either: what the contact form proves is
     not "a module drew something" but "pressing Send reaches
     somebody", which is the block at the foot of this file. */
  "/contact": "contact.html",
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  const prerendered = PRERENDERED[path];
  const file = prerendered
    ? join(BUILD, "server/app", prerendered)
    : path.startsWith("/_next/static/")
      ? join(BUILD, "static", path.slice("/_next/static/".length))
      : join(AAB, path.replace(/^\//, ""));
  try {
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
  }
});
await new Promise<void>((resolve) => { server.listen(PORT, () => resolve()); });

const browser = await chromium.launch(browserPath ? { executablePath: browserPath } : {});

/** What one load of a page leaves behind. */
interface Loaded {
  page: Page;
  errors: string[];
}

/** What a reader's browser remembers before the page opens: the
    audience they chose, and the track they chose before that axis
    went. */
type Remembers = [audience: string | null, track: string | null];

/** One page, loaded and left alone for a moment: a module that
    draws a chart is allowed to take longer than the load event. */
const open = async (path: string, remembers?: Remembers): Promise<Loaded> => {
  const page = await browser.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  /* The webfonts are the one thing here that is not this site's,
     and a test that needs Google to answer is a test that goes red
     on somebody else's afternoon. */
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  if (remembers) {
    await page.addInitScript(([a, k]: Remembers) => {
      if (a) localStorage.setItem("audience", a);
      if (k) localStorage.setItem("track", k);
    }, remembers);
  }
  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  return { page, errors };
};

for (const [url, , selector, what, placeholder] of CASES) {
  const { page, errors } = await open(url);

  /* The argument is a TUPLE and is annotated as one on both
     sides: inferred, it is an array of the union of its two
     members, and the function then cannot say which is which. */
  const asked: [string, string | undefined] = [selector, placeholder];
  const found = await page.evaluate(([s, empty]: [string, string | undefined]) => {
    const nodes = [...document.querySelectorAll(s)];
    if (!nodes.length) return "nothing matches";
    if (empty === undefined) return null;
    const text = (nodes[0].textContent || "").trim();
    return text && text !== empty ? null : `still reads "${text}"`;
  }, asked);
  ok(`${url} has ${what}`, found === null, `${found} ${selector}`);

  /* React error #418 and its neighbours are what a hydration
     mismatch looks like once the build is minified, and a page
     that logs one has thrown away the markup the server sent. */
  const hydration = errors.filter((e) => /Minified React error #(418|423|425)/.test(e));
  ok(`${url} hydrates cleanly`, hydration.length === 0, hydration[0]);

  await page.close();
}

for (const [who, audience, track, expected] of READERS) {
  const { page } = await open("/", [audience, track]);

  const shown = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>("[data-when]")]
      .filter((el) => getComputedStyle(el).display !== "none")
      .map((el) => el.dataset.when));

  ok(`the home page shows ${who} one introduction`,
    shown.length > 0 && new Set(shown).size === 1 && shown[0] === expected,
    `expected ${expected} only, got [${shown}]`);

  /* Under the hero there is a deck now, and the deck is the
     thing to hold: the one-screen door lasted a day, because a
     front page that cannot grow is a front page that turns
     things away. What must not regress is the deck's own
     contract: the tiles are there, every one of them is a real
     link somewhere, and the featured card answered THIS reader.
     The audience switch is the only personalisation the card
     reads, so learn features the money school, work features the
     case studies, and a reader who has said nothing gets the
     live portfolio. */
  const deck = await page.evaluate(() => ({
    tiles: [...document.querySelectorAll(".gate-tile")]
      .map((t) => t.getAttribute("href")).filter(Boolean),
    featured: document.querySelector(".gate-feat")?.getAttribute("href") ?? null,
  }));
  ok(`the deck stands under the hero for ${who}`, deck.tiles.length >= 8,
    `${deck.tiles.length} tiles`);
  const featured: Record<string, string> = { open: "/tools/live",
    learn: "/money", work: "/portfolio" };
  const wantFeatured = featured[expected];
  ok(`and the featured card answers ${who}`, deck.featured === wantFeatured,
    `featured ${deck.featured}, expected ${wantFeatured}`);

  await page.close();
}

/* ============================================================
   The drawer, on a phone.

   Three things, and all three were wrong at once in August 2026.

   1. The button that closes the menu was a 34px circle in the far
      corner of the drawer, 233px from the burger the reader had
      just pressed. Opening and closing are one gesture and it
      should not move, so the close button is laid out to land on
      the burger's exact pixels. That is asserted as a box, not as
      "roughly", because the whole point is that it is exact.

   2. `.audience-switch` carried `grid-column: 2`, which is right
      in the bar and wrong in the drawer, and this component is
      deliberately rendered in both. In the drawer it grew an
      implicit second column and sat in it, so the label "What
      brings you here" and the switch went side by side in a 275px
      drawer and the label was clipped to "What brings yo".

   3. The site's name was on screen twice with the menu open, once
      in the bar and once in the drawer's head.

   None of these is visible to a check that reads HTML. The markup
   was correct for all three.
   ============================================================ */
for (const width of [360, 390, 412]) {
  const page = await browser.newPage({ viewport: { width, height: 780 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const box = (sel: string) => page.evaluate((s: string) => {
    const e = document.querySelector(s);
    if (!e || getComputedStyle(e).display === "none") return null;
    const r = e.getBoundingClientRect();
    return [r.left, r.top, r.width, r.height].map(Math.round).join(",");
  }, sel);

  const burger = await box(".drawer-btn");
  ok(`${width}px: the bar has a burger`, burger !== null);

  /* Open it by pressing the burger where a thumb would. There is
     nothing to press if the check above already failed, and it
     has recorded that; going on would report the same absence a
     second time as eight different failures. */
  const b = await page.locator(".drawer-btn").boundingBox();
  if (!b) { await page.close(); continue; }
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);

  ok(`${width}px: the burger opens the drawer`,
    await page.evaluate(() => document.documentElement.dataset.drawer) === "open");

  ok(`${width}px: the close button is exactly where the burger was`,
    await box(".drawer-close") === burger,
    `burger ${burger}, close ${await box(".drawer-close")}`);

  const thumb: [number, number] = [x, y];
  ok(`${width}px: that pixel now belongs to the close button`,
    await page.evaluate(([px, py]: [number, number]) =>
      !!document.elementFromPoint(px, py)?.closest(".drawer-close"), thumb));

  /* The drawer's column is built from the button, so everything
     that is not indented starts on its line. */
  const lefts = await page.evaluate(() => {
    const l = (s: string) => { const e = document.querySelector(s);
      return e ? Math.round(e.getBoundingClientRect().left) : null; };
    return { close: l(".drawer-close"), group: l(".rail-nav .rail-label"),
             askLabel: l(".rail-audience .rail-label"),
             ask: l(".rail-audience .audience-switch") };
  });
  ok(`${width}px: the drawer's column starts on the button's line`,
    new Set(Object.values(lefts)).size === 1, JSON.stringify(lefts));

  /* The question and its switch stack. Side by side is the bug. */
  const stacked = await page.evaluate(() => {
    const a = document.querySelector(".rail-audience .rail-label");
    const c = document.querySelector(".rail-audience .audience-switch");
    if (!a || !c) return null;
    return a.getBoundingClientRect().bottom <= c.getBoundingClientRect().top + 1;
  });
  ok(`${width}px: the audience question sits above its switch`, stacked === true);

  /* And the label is not cut off, which is what side by side did. */
  ok(`${width}px: the audience question is not clipped`,
    await page.evaluate(() => {
      const e = document.querySelector(".rail-audience .rail-label");
      return e && e.scrollWidth <= e.clientWidth + 1;
    }));

  /* One site name on screen, not two. */
  ok(`${width}px: the site is named once with the menu open`,
    await page.evaluate(() => [...document.querySelectorAll(".rail-mark, .topbar-mark")]
      .filter((e) => getComputedStyle(e).display !== "none").length) === 1);

  /* The foot is reachable rather than pushed off the bottom. */
  ok(`${width}px: the audience switch is inside the drawer`,
    await page.evaluate(() => {
      const f = document.querySelector(".rail-foot");
      return !!f && f.getBoundingClientRect().bottom <= innerHeight + 1;
    }));

  /* And the same pixel closes it again. */
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);
  ok(`${width}px: the same pixel closes the drawer`,
    await page.evaluate(() => document.documentElement.dataset.drawer) === "shut");

  await page.close();
}

/* On a laptop the rail is a rail: no burger, no close button, the
   mark in the rail rather than the bar. The drawer rules must not
   leak up here.

   The switch is in the RAIL at every width now, which is a change
   and is what this used to assert the opposite of. It was in the
   bar on a laptop, so "what brings you here" sat across the top
   of every page somebody read; it is asked once and then never
   again, so it belongs with the menu.

   What the bar carries instead is the TRAIL, and that is asserted
   here too, because a bar with neither is what this change would
   look like if the component failed to render. It was the site
   tree until 19 August 2026: `TREE_IN_BAR` in `topbar.tsx` is
   false, the tree is still built and still passed in, and "where
   am I" is the question a reader arriving from a search result
   has. The rail down the left already answers "what else is
   there". */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => {
    const shown = (s: string) => { const e = document.querySelector(s);
      return !!e && getComputedStyle(e).display !== "none"; };
    return { burger: shown(".drawer-btn"), close: shown(".drawer-close"),
             railMark: shown(".rail-mark"), barMark: shown(".topbar-mark"),
             barSwitch: shown(".topbar > .audience-switch"),
             railSwitch: shown(".rail-audience"),
             tree: shown(".topbar .tree-btn"),
             trail: document.querySelectorAll(".topbar .crumbs-bar li").length };
  });
  ok("on a laptop the menu is a rail, not a drawer",
    !state.burger && !state.close && state.railMark && !state.barMark
    && !state.barSwitch && state.railSwitch && !state.tree && state.trail > 0,
    JSON.stringify(state));
  await page.close();
}

/* ============================================================
   The contact form, and the three ways sending it can go

   `components/contact-form.tsx` replaced `/contact-form.js` at
   Stage B, and the thing worth checking is not that it renders.
   It is that the fallbacks still fall back: this is the one page
   on the site where somebody with a broken script is trying to
   reach a person, so the form has to work three ways and say
   which happened.

   The third way is not driven here and cannot be: it is the
   browser posting the form itself with no JavaScript, and what
   makes it true is the `action` and the hidden fields being in
   the markup rather than in a handler. That IS checked, because
   the component could have swallowed them into state and the
   page would look identical.
   ============================================================ */
type Sending = [label: string, api: boolean, web3: boolean, expected: RegExp];
const SENDING: Sending[] = [
  ["the site's own endpoint answers", true, true, /^Sent/],
  ["it does not, and Web3Forms catches it", false, true, /^Sent/],
  ["neither does, and it says so", false, false, /^Couldn't send/],
];
for (const [label, api, web3, expected] of SENDING) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 900 } });
  const errors: string[] = [];
  page.on("pageerror", (e: Error) => { errors.push(e.message); });
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());

  let posted = 0;
  await page.route("**/api/**", (r: Route) => r.fulfill({
    status: 200, contentType: "application/json", body: JSON.stringify({ ok: api }),
  }));
  await page.route("https://api.web3forms.com/**", (r: Route) => {
    posted += 1;
    return r.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ success: web3, message: "x" }) });
  });

  await page.goto(`http://localhost:${PORT}/contact`, { waitUntil: "load" });
  await page.waitForTimeout(700);

  ok(`${label}: the form still posts on its own`,
    await page.locator("form").getAttribute("action") === "https://api.web3forms.com/submit");
  ok(`${label}: with its key and its honeypot in the markup`,
    await page.locator('input[name="access_key"]').count() === 1
    && await page.locator('input[name="botcheck"]').count() === 1);
  /* Empty until there is something to say, so a live region is
     not read out on load. */
  ok(`${label}: and says nothing before it is used`,
    (await page.locator("#form-status").textContent()) === "");

  await page.fill("#contact-name", "A Reader");
  await page.fill("#contact-email", "a@example.com");
  await page.fill("#contact-message", "Hello, this is a message.");
  await page.getByRole("button", { name: "Send message" }).click();
  await page.waitForTimeout(1200);

  const said = await page.locator("#form-status").textContent();
  ok(`${label}: it says what happened`, expected.test(said ?? ""), said);
  ok(`${label}: and falls through only when it has to`,
    api ? posted === 0 : posted === 1, `web3 posts: ${posted}`);
  ok(`${label}: no page errors`, errors.length === 0, errors[0]);
  await page.close();
}

/* ============================================================
   The trail in the bar, and the arrows that open it.

   Three things this cannot be checked without a browser for. The
   arrow is a `<button>` and the panel is `[popover]`, so whether
   it OPENS is the browser's own behaviour and not this site's;
   whether Escape closes it is the same; and whether it needs any
   JavaScript of ours to do either is the whole design claim,
   which only a page with our scripts blocked can settle.

   Only prerendered pages here, because that is what this file's
   server can hold: the 251 school pages are dynamic and their
   trail is `next/parity.test.ts`'s to check.
   ============================================================ */
console.log("\nthe trail, and what its arrows open");
{
  const { page, errors } = await open("/skills");

  ok("the trail is in the bar", await page.locator(".topbar .crumbs-bar").count() === 1);

  /* The mark is the home crumb, so the first crumb the row draws
     is the second of the trail and still has a level in front of
     it. It lost its arrow for a while by being sliced off the
     front of the array instead of skipped. */
  const arrows = page.locator(".crumbs-bar .crumb-step");
  ok("and the crumb after the mark keeps its arrow", await arrows.count() >= 1,
    `${await arrows.count()} arrow(s)`);

  ok("which is a real button", await arrows.first().evaluate(
    (el: Element) => el.tagName === "BUTTON" && (el as HTMLButtonElement).type === "button"));
  ok("with a label a screen reader can read",
    ((await arrows.first().getAttribute("aria-label")) ?? "").length > 3);

  /* Nothing is open until something is pressed. A panel that
     renders open is a panel the reader has to dismiss. */
  ok("nothing is open to begin with",
    await page.locator(".crumb-menu:popover-open").count() === 0);

  await arrows.first().click();
  await page.waitForTimeout(300);
  const open1 = page.locator(".crumb-menu:popover-open");
  ok("pressing it opens the menu", await open1.count() === 1);

  const rows = await open1.locator("a").count();
  ok("which lists where else you could be", rows > 1, `${rows} row(s)`);
  ok("and marks the one you are on",
    await open1.locator('a[aria-current="page"]').count() === 1);

  /* On screen and inside the window. A panel positioned off the
     edge is a panel that opened and cannot be read, which looks
     identical in the DOM to one that worked. */
  const box = await open1.boundingBox();
  const view = page.viewportSize();
  ok("the panel is on screen", Boolean(box) && (box?.width ?? 0) > 80 && (box?.height ?? 0) > 40,
    JSON.stringify(box));
  ok("and inside the window",
    Boolean(box && view && box.x >= 0 && box.y >= 0 && box.x + box.width <= view.width + 1),
    JSON.stringify({ box, view }));

  await page.keyboard.press("Escape");
  await page.waitForTimeout(250);
  ok("Escape closes it, which is the browser's job and not ours",
    await page.locator(".crumb-menu:popover-open").count() === 0);

  ok("no page errors", errors.length === 0, errors[0]);
  await page.close();
}

/* And the half that has to keep working with no JavaScript at
   all, because that is the reason it is a popover rather than a
   component: this is chrome on 251 pages. */
{
  const page = await browser.newPage();
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  await page.route("**/*.js", (r: Route) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);

  ok("with every script blocked, the trail is still drawn",
    await page.locator(".crumbs-bar li").count() >= 1);
  const arrow = page.locator(".crumbs-bar .crumb-step").first();
  await arrow.click();
  await page.waitForTimeout(300);
  ok("and the arrow still opens its menu",
    await page.locator(".crumb-menu:popover-open").count() === 1);
  await page.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.error(`interactive: ${failures.length} failed of ${passed + failures.length}`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`interactive: ${passed} checks, every page's own module ran and its work survived.`);
