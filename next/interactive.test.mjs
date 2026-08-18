/* ============================================================
   interactive.test.mjs: does what a page's own module writes into
   it survive the page being a route?

     node next/interactive.test.mjs

   Needs `npx next build` in `next/` first, and a browser. Without
   either it says which one is missing and skips, and a skip is not
   a pass.

   ---- what it is for ----

   Every calculator on this site went blank on the day its page
   stopped being a file. `parity.test.mjs` could not see it and
   neither could any other check here, because all of them read
   HTML: the markup was right, the module was right, the module ran
   and computed the right number, and then React's hydration put
   the empty markup back. Nothing but a browser can tell those two
   apart, which is the same argument `app/desk.test.mjs` makes for
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
   database, and `parity.test.mjs` is where they are asked about.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8991;

/* A page, the file Next prerendered it into, and one thing in it
   that only its own module can have put there. Where the markup
   ships a placeholder for that thing, the placeholder is named
   too: an element that exists in the page either way proves
   nothing, and this is a check about whether anything filled it. */
const CASES = [
  /* The home page is not here any more. It carried `#kinetic`, a
     headline `/app.js` rebuilt one span per word, and the front
     door has no such thing since Stage 11.8: it renders three
     headlines and shows one, and the choosing is a stylesheet
     rule rather than a script. What holds the door now is the
     block at the foot of this file, which checks that it shows
     one introduction and fits one screen. */
  ["/tools/index.html", "tools/index.html.html", '[data-stat="final"] .v',
   "what a monthly habit becomes, computed by /tools/tools.js", "–"],
  ["/tools/stock.html", "tools/stock.html.html", "#pillars .pillar",
   "the six pillars, built by /tools/stock.js"],
  ["/portfolio/dcf.html", "portfolio/dcf.html.html", "#drivers *",
   "the valuation's drivers, built by /portfolio/dcf.js"],
  ["/portfolio/dsex.html", "portfolio/dsex.html.html", "#chart-index *",
   "the index chart, drawn by /portfolio/dsex.js"],
  ["/portfolio/stress.html", "portfolio/stress.html.html", "#drivers *",
   "the stress test's drivers, built by /portfolio/stress.js"],
  ["/portfolio/three-statement.html", "portfolio/three-statement.html.html", "#drivers *",
   "the model's drivers, built by /portfolio/three-statement.js"],
  ["/portfolio/dissertation.html", "portfolio/dissertation.html.html", "#chart-evidence *",
   "the evidence chart, drawn by /portfolio/dissertation.js"],
  ["/portfolio/frontier.html", "portfolio/frontier.html.html", "#frontier-chart *",
   "the frontier itself, drawn by /portfolio/frontier.js"],
  ["/portfolio/scorecard.html", "portfolio/scorecard.html.html", "#roc-chart *",
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
  ["/portfolio.html", "portfolio.html.html", "#palette",
   "the Ctrl+K palette, built by /app.js"],
  ["/skills/index.html", "skills/index.html.html", "#palette",
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
const READERS = [
  ["a reader who has just arrived", null, null, "open"],
  ["a learner", "learn", null, "learn"],
  ["a reader here for work", "work", null, "work"],
];

let passed = 0;
const failures = [];
const ok = (name, condition, detail = "") => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const skip = (why) => {
  console.log(`interactive: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path) => stat(path).then(() => true, () => false);

/* ---- the two things this cannot run without ---- */

if (!await exists(join(BUILD, "server/app/index.html"))) {
  skip("next/.next holds no prerendered pages. Run `npx next build` in next/ first.");
}

const browserPath = process.env.CHROMIUM_PATH
  || (await exists("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    : null);

let chromium;
try {
  ({ chromium } = await import("../app/node_modules/playwright/index.mjs"));
} catch {
  skip("playwright is not installed. It is a devDependency of app/: `cd app && npm install`.");
}
if (!browserPath && !process.env.CHROMIUM_PATH) {
  try {
    chromium.executablePath();
  } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---- the site, served the way Cloudflare serves it ---- */

const TYPES = {
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
const PRERENDERED = {
  ...Object.fromEntries(CASES.map(([url, file]) => [url, file])),
  "/": "index.html",
};

const server = createServer(async (req, res) => {
  const path = new URL(req.url, "http://x").pathname;
  const file = PRERENDERED[path]
    ? join(BUILD, "server/app", PRERENDERED[path])
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
await new Promise((resolve) => server.listen(PORT, resolve));

const browser = await chromium.launch(browserPath ? { executablePath: browserPath } : {});

/** One page, loaded and left alone for a moment: a module that
    draws a chart is allowed to take longer than the load event. */
const open = async (path, remembers) => {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  /* The webfonts are the one thing here that is not this site's,
     and a test that needs Google to answer is a test that goes red
     on somebody else's afternoon. */
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  if (remembers) {
    await page.addInitScript(([a, k]) => {
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

  const found = await page.evaluate(([s, empty]) => {
    const nodes = [...document.querySelectorAll(s)];
    if (!nodes.length) return "nothing matches";
    if (empty === undefined) return null;
    const text = (nodes[0].textContent || "").trim();
    return text && text !== empty ? null : `still reads "${text}"`;
  }, [selector, placeholder]);
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

  const shown = await page.evaluate(() => [...document.querySelectorAll("[data-when]")]
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
  const wantFeatured = { open: "/tools/live.html", learn: "/money/index.html",
    work: "/portfolio.html" }[expected];
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
  await page.goto(`http://localhost:${PORT}/skills/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(900);

  const box = (sel) => page.evaluate((s) => {
    const e = document.querySelector(s);
    if (!e || getComputedStyle(e).display === "none") return null;
    const r = e.getBoundingClientRect();
    return [r.left, r.top, r.width, r.height].map(Math.round).join(",");
  }, sel);

  const burger = await box(".drawer-btn");
  ok(`${width}px: the bar has a burger`, burger !== null);

  /* Open it by pressing the burger where a thumb would. */
  const b = await page.locator(".drawer-btn").boundingBox();
  const x = b.x + b.width / 2, y = b.y + b.height / 2;
  await page.mouse.click(x, y);
  await page.waitForTimeout(700);

  ok(`${width}px: the burger opens the drawer`,
    await page.evaluate(() => document.documentElement.dataset.drawer) === "open");

  ok(`${width}px: the close button is exactly where the burger was`,
    await box(".drawer-close") === burger,
    `burger ${burger}, close ${await box(".drawer-close")}`);

  ok(`${width}px: that pixel now belongs to the close button`,
    await page.evaluate(([px, py]) =>
      !!document.elementFromPoint(px, py)?.closest(".drawer-close"), [x, y]));

  /* The drawer's column is built from the button, so everything
     that is not indented starts on its line. */
  const lefts = await page.evaluate(() => {
    const l = (s) => { const e = document.querySelector(s);
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
   mark in the rail rather than the bar, and the switch back in the
   bar's second column. The drawer rules must not leak up here. */
{
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());
  await page.goto(`http://localhost:${PORT}/skills/index.html`, { waitUntil: "load" });
  await page.waitForTimeout(900);
  const state = await page.evaluate(() => {
    const shown = (s) => { const e = document.querySelector(s);
      return !!e && getComputedStyle(e).display !== "none"; };
    return { burger: shown(".drawer-btn"), close: shown(".drawer-close"),
             railMark: shown(".rail-mark"), barMark: shown(".topbar-mark"),
             barSwitch: shown(".topbar > .audience-switch"),
             railSwitch: shown(".rail-audience") };
  });
  ok("on a laptop the menu is a rail, not a drawer",
    !state.burger && !state.close && state.railMark && !state.barMark
    && state.barSwitch && !state.railSwitch, JSON.stringify(state));
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
