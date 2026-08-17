/* ============================================================
   account.test.mjs: what an account actually gets you, driven in
   a real browser.

     node next/account.test.mjs

   Needs `npx next build` in `next/` first, and a browser. Without
   either it says which one is missing and skips, and a skip is
   not a pass.

   ---- why this file exists ----

   Five features landed on the account at once: a reading list,
   notes, reading preferences, a year of days and a way to take a
   copy of all of it. Every one of them is drawn by a script into
   markup a route rendered, which is the exact shape of thing that
   `parity.test.mjs` cannot see and `interactive.test.mjs` was
   written for: the HTML is right whether or not a single one of
   them worked.

   And the account menu is the other half. It stopped being a
   modal dialog and became a `popover`, which moved four
   behaviours out of `aab/signin.js` and into the browser. That is
   a good trade and it is only a good trade if the browser
   actually does them, so the light dismiss, the Escape key and
   the focus return are checked here rather than assumed.

   The pages are served the way Cloudflare serves them, which is
   the same three-line split `interactive.test.mjs` uses: the HTML
   Next prerendered, the chunks beside it, and everything else out
   of `aab/`. Supabase is routed, so nothing here reaches the real
   project and the test needs no network.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const BUILD = join(HERE, ".next");
const AAB = join(HERE, "..", "aab");
const PORT = 8993;

let passed = 0;
const failures = [];
const ok = (name, condition, detail = "") => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};
const is = (name, got, want) =>
  ok(name, JSON.stringify(got) === JSON.stringify(want),
    `got ${JSON.stringify(got)}, want ${JSON.stringify(want)}`);

const skip = (why) => {
  console.log(`account: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path) => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/account.html.html"))) {
  skip("next/.next holds no prerendered account page. Run `npx next build` in next/ first.");
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
  ".png": "image/png",
  ".ico": "image/x-icon",
};

const PRERENDERED = { "/account.html": "account.html.html" };

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

/* ---- a signed-in session, and an account with things in it ---- */

const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub) => [b64({ alg: "HS256" }),
  b64({ sub, email: "i@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
        user_metadata: { full_name: "Rony Reiad" } }), "s"].join(".");
const session = (sub) => JSON.stringify({
  access_token: jwt(sub), refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: sub, email: "i@reiad.co.uk", name: "Rony Reiad" },
});

const DAYS = (() => {
  /* Ten of the last fourteen, so the heatmap has something to
     draw and the week line has a number that is not zero. */
  const out = [];
  for (let i = 0; i < 14; i += (i % 4 === 2 ? 2 : 1)) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const pad = (n) => String(n).padStart(2, "0");
    out.push(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`);
  }
  return out;
})();

/**
 * A browser talking to an account that holds `state`.
 *
 * Every Supabase table is answered from memory, and what the
 * browser sent is kept, so a check can assert that pressing a
 * button actually wrote something rather than only that the row
 * disappeared from the page.
 */
async function open(path, { signedIn = true, rows = {}, seed = {} } = {}) {
  const context = await browser.newContext({ viewport: { width: 1180, height: 1000 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("https://fonts.googleapis.com/**", (r) => r.abort());

  const state = {
    progress: new Map(Object.entries({
      "learn-read": ["share", "dse"],
      "days-active": DAYS,
      ...(rows.progress ?? {}),
    }).map(([key, value]) => [key, { key, value, updated_at: new Date().toISOString() }])),
    library: rows.library ?? [],
    targets: rows.targets ?? [],
    scenarios: rows.scenarios ?? [],
    profile: rows.profile ?? {
      display_name: "Rony Reiad", following: ["money"], pace: "often",
      setup_at: new Date().toISOString(),
    },
    sent: [],
  };

  await context.route(`${SUPA}/rest/v1/**`, async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const table = url.pathname.split("/").pop();
    const json = (body, status = 200) =>
      route.fulfill({ status, contentType: "application/json", body: JSON.stringify(body) });

    const body = req.postData() ? JSON.parse(req.postData()) : null;
    if (req.method() !== "GET") state.sent.push({ table, method: req.method(), body });

    if (table === "profiles") {
      if (req.method() === "PATCH") {
        state.profile = { ...state.profile, ...body };
        return route.fulfill({ status: 204, body: "" });
      }
      return json([state.profile]);
    }
    if (table === "progress") {
      if (req.method() === "DELETE") { state.progress.clear(); return route.fulfill({ status: 204, body: "" }); }
      if (req.method() === "POST") {
        body.forEach((r) => state.progress.set(r.key,
          { ...r, updated_at: new Date().toISOString() }));
        return route.fulfill({ status: 201, body: "" });
      }
      return json([...state.progress.values()]);
    }
    if (table === "library" || table === "targets" || table === "scenarios") {
      if (req.method() === "DELETE") {
        state[table] = [];
        return route.fulfill({ status: 204, body: "" });
      }
      if (req.method() === "POST") {
        const rows = body.map((r) => ({
          id: `id-${state[table].length + 1}`, created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(), saved: false, note: "", ...r,
        }));
        state[table] = [...rows, ...state[table]];
        return json(rows, 201);
      }
      if (req.method() === "PATCH") return route.fulfill({ status: 204, body: "" });
      return json(state[table]);
    }
    return json([]);
  });

  await context.route(`${SUPA}/auth/v1/**`, (r) =>
    r.fulfill({ status: 200, contentType: "application/json", body: "{}" }));

  await page.addInitScript(([on, who, extra]) => {
    if (on) localStorage.setItem("reiad-session", who);
    for (const [k, v] of Object.entries(extra)) localStorage.setItem(k, v);
  }, [signedIn, session("u-1"), seed]);

  await page.goto(`http://localhost:${PORT}${path}`, { waitUntil: "load" });
  await page.waitForTimeout(2200);
  return { page, context, state, errors };
}

/* ============================================================
   1. The account menu, which is a popover now
   ============================================================ */

console.log("the account menu");
{
  const { page, context, errors } = await open("/account.html");

  const button = page.locator(".account-btn");
  is("the button says who is signed in", await button.textContent(), "R");
  is("and says it is a menu", await button.getAttribute("aria-haspopup"), "menu");
  is("which is shut", await button.getAttribute("aria-expanded"), "false");

  await button.click();
  await page.waitForTimeout(300);

  const menu = page.locator(".acc-menu");
  ok("it opens", await menu.count() === 1);
  is("in the top layer, as a popover", await menu.getAttribute("popover"), "auto");
  is("and the button says so", await button.getAttribute("aria-expanded"), "true");
  is("it names the account", await menu.locator(".acc-who-text strong").textContent(), "Rony Reiad");
  is("six places to go", await menu.locator(".acc-item[href]").count(), 6);
  ok("including the reading list",
    (await menu.locator('.acc-item[href="/account.html#reading-list"]').count()) === 1);
  ok("and a way out", (await menu.locator(".acc-out").count()) === 1);

  /* The four behaviours that moved out of signin.js and into the
     browser when this became a popover. If any of them is not
     actually free, the trade was a bad one. */
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  is("Escape closes it", await page.locator(".acc-menu").count(), 0);
  is("and says so on the button", await button.getAttribute("aria-expanded"), "false");
  is("and gives the focus back",
    await page.evaluate(() => document.activeElement?.className.includes("account-btn")), true);

  await button.click();
  await page.waitForTimeout(300);
  await page.mouse.click(600, 700);
  await page.waitForTimeout(300);
  is("a click elsewhere closes it too", await page.locator(".acc-menu").count(), 0);

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

console.log("\nthe menu when nobody is signed in");
{
  const { page, context, errors } = await open("/account.html", { signedIn: false });

  is("the button asks", await page.locator(".account-btn").textContent(), "Sign in");
  await page.locator(".account-btn").click();
  await page.waitForTimeout(300);

  ok("it offers a way in", (await page.locator(".acc-menu .signin-form").count()) === 1);
  ok("and Google", (await page.locator(".signin-google").count()) === 1);
  is("and no account destinations", await page.locator(".acc-item").count(), 0);
  ok("the page says nobody is signed in",
    await page.locator("#account-out").isVisible());
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   2. The page itself
   ============================================================ */

console.log("\nthe account page");
{
  const { page, context, errors } = await open("/account.html", {
    rows: {
      library: [
        { id: "l1", url: "/insights/dse-basics", title: "How the DSE works",
          kind: "piece", saved: true, note: "", updated_at: new Date().toISOString() },
        { id: "l2", url: "/money/basics-2/supply-demand.html", title: "চাহিদা ও জোগান",
          kind: "lesson", saved: false, note: "Read this again before the exam.",
          updated_at: new Date().toISOString() },
      ],
      targets: [{ id: "t1", kind: "habit", subject: "week", label: "Read on 4 days a week",
        target: 4, reached: 0, unit: "days", done_at: null,
        created_at: new Date().toISOString() }],
      scenarios: [{ id: "s1", tool: "stock", name: "Square Pharma",
        inputs: { query: "price=210" }, summary: "71.4 · Buy",
        updated_at: new Date().toISOString() }],
    },
  });

  ok("it greets the reader",
    (await page.locator("#account-hello").textContent())?.includes("Rony Reiad"));
  is("the eight sections are all there", await page.locator(".acct-sec").count(), 8);
  is("and the rail links to each", await page.locator(".acct-rail-link").count(), 8);
  is("four numbers above the fold", await page.locator(".acct-tile").count(), 4);

  /* A year of days, drawn from `days-active`. 53 weeks of seven
     is the grid; what matters is that the days in the account are
     the ones filled in. */
  const cells = await page.locator(".heat-cell[data-on]").count();
  ok("the year shows the days that had something on them", cells === DAYS.length,
    `${cells} filled, ${DAYS.length} in the account`);
  ok("and says how the week went",
    (await page.locator("#account-week").textContent())?.includes("of the last seven days"));

  /* The ladders, which need the four curricula to have loaded. */
  ok("every course has a bar", (await page.locator(".ladder-row .meter").count()) === 4);
  ok("and the money school is not at nought",
    (await page.locator(".ladder-row").first().locator(".ladder-pct").textContent()) !== "0%");

  is("the reading list holds what was kept",
    await page.locator("#account-kept-list .kept-row").count(), 1);
  is("and names it",
    await page.locator("#account-kept-list .kept-body h3 a").textContent(),
    "How the DSE works");
  is("the notes hold what was written",
    await page.locator("#account-notes .kept-row").count(), 1);
  is("as typed, and not as markup",
    await page.locator("#account-notes .kept-note").textContent(),
    "Read this again before the exam.");

  is("the target is drawn", await page.locator(".target").count(), 1);
  is("the scenario is listed", await page.locator(".saved-row").count(), 1);

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   3. Reading preferences, which have to act on the page at once
   ============================================================ */

console.log("\nreading preferences");
{
  const { page, context, errors } = await open("/account.html");

  is("four rows of them", await page.locator(".pref-row").count(), 4);
  is("normal is the one chosen",
    await page.locator('.pref-chips .pref-chip[data-on] strong').first().textContent(),
    "Normal");

  const scaleNow = () => page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--read-scale").trim());

  await page.getByRole("button", { name: /Comfortable/ }).click();
  await page.waitForTimeout(300);

  is("pressing Comfortable moves the type", await scaleNow(), "1.12");
  is("and is remembered", await page.evaluate(() =>
    JSON.parse(localStorage.getItem("reader-prefs")).text), "large");

  await page.getByRole("button", { name: /Narrow/ }).click();
  await page.waitForTimeout(300);
  is("and the measure with it", await page.evaluate(() =>
    getComputedStyle(document.documentElement).getPropertyValue("--read-measure").trim()), "56ch");

  /* The language chip writes the key the calculators have read
     since long before there were accounts. One choice, one key. */
  await page.getByRole("button", { name: /English/ }).click();
  await page.waitForTimeout(300);
  is("the language chip writes the tools' own key",
    await page.evaluate(() => localStorage.getItem("tool-lang")), "en");

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   4. Adding a target, and taking a copy of everything
   ============================================================ */

console.log("\nadding a target");
{
  const { page, context, state, errors } = await open("/account.html");

  await page.locator("#target-more summary").click();
  await page.getByLabel("Turn up n days a week").check();
  await page.waitForTimeout(200);
  await page.fill("#target-number", "5");
  await page.locator("#target-form button[type=submit]").click();
  await page.waitForTimeout(900);

  const sent = state.sent.find((s) => s.table === "targets" && s.method === "POST");
  ok("it was sent to the account", Boolean(sent));
  is("as a habit", sent?.body?.[0]?.kind, "habit");
  is("with the number on it", sent?.body?.[0]?.target, 5);
  is("and a sentence a person would write", sent?.body?.[0]?.label, "Read on 5 days a week");
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

console.log("\ntaking a copy of everything");
{
  const { page, context, errors } = await open("/account.html", {
    rows: {
      library: [{ id: "l1", url: "/insights/x", title: "X", kind: "piece",
        saved: true, note: "", updated_at: new Date().toISOString() }],
    },
  });

  const download = page.waitForEvent("download", { timeout: 10000 });
  await page.locator("#account-export").click();
  const file = await download;

  ok("it downloads a file", Boolean(file));
  ok("named for the day it was taken", /^reiad-library-\d{4}-\d{2}-\d{2}\.json$/.test(file.suggestedFilename()),
    file.suggestedFilename());

  const stream = await file.createReadStream();
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const bundle = JSON.parse(Buffer.concat(chunks).toString());

  ok("it holds the progress", Array.isArray(bundle.progress?.["learn-read"]));
  ok("the reading list", bundle.library?.length === 1);
  ok("the profile", bundle.profile?.display_name === "Rony Reiad");
  ok("and says what it is", typeof bundle.what === "string" && bundle.what.length > 10);
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

/* ============================================================
   5. Keeping a page, which happens on a reading page

   A piece and a lesson are dynamic routes and are not in this
   build, so the module is driven against the markup they render
   rather than against the route. That is the honest half of this
   test: what it proves is that `/keep.js` finds an article,
   appends its row and writes the right row to the account, and
   what it does NOT prove is that the route renders the article it
   is looking for. `parity.test.mjs` is what holds the routes to
   their markup.
   ============================================================ */

console.log("\nkeeping a page, and writing on it");
{
  const { page, context, state, errors } = await open("/account.html");

  /* An article shaped exactly as the piece route renders one. */
  await page.evaluate(() => {
    const article = document.createElement("article");
    article.className = "article";
    article.dataset.slug = "dse-basics";
    article.innerHTML = '<h1>How the DSE works</h1><p class="byline mono">Rony Reiad</p>';
    /* Into the scrolling column, where the piece route puts one.
       Appending to `body` puts it under the rail, which is fixed
       to the left edge, and a button behind the rail is a button
       nothing can click. */
    document.querySelector("#main").append(article);
    history.replaceState(null, "", "/insights/dse-basics");
  });
  /* Importing is what a reading page does, and the module wires
     itself on import. Calling `initKeep()` as well would be
     asking for two bars, which the module now refuses. */
  await page.evaluate(() => import("/keep.js"));
  await page.waitForTimeout(900);

  const bar = page.locator(".keep-bar");
  ok("the row appears", await bar.count() === 1);
  is("with a Save", await bar.locator(".keep-btn").first().textContent(), "Save");

  await bar.locator(".keep-btn").first().click();
  await page.waitForTimeout(700);

  const kept = state.sent.find((s) => s.table === "library" && s.method === "POST");
  ok("saving writes the page to the account", Boolean(kept));
  is("under its own address", kept?.body?.[0]?.url, "/insights/dse-basics");
  is("with its title", kept?.body?.[0]?.title, "How the DSE works");
  is("as a piece", kept?.body?.[0]?.kind, "piece");
  is("and saved", kept?.body?.[0]?.saved, true);
  /* The Save button must not send an empty note: the reader may
     have written one on their phone this morning. */
  is("and it does not touch the note", "note" in (kept?.body?.[0] ?? {}), false);
  is("the button says so now", await bar.locator(".keep-btn").first().textContent(), "Kept");

  await bar.locator(".keep-btn").nth(1).click();
  await page.waitForTimeout(300);
  ok("the note opens", await page.locator(".keep-panel").isVisible());
  await page.fill(".keep-note", "Worth rereading.");
  await page.locator(".keep-panel .btn-solid").click();
  await page.waitForTimeout(700);

  const noted = state.sent.filter((s) => s.table === "library" && s.method === "POST").at(-1);
  is("the note is written", noted?.body?.[0]?.note, "Worth rereading.");
  is("and it does not touch the save", "saved" in (noted?.body?.[0] ?? {}), false);

  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

console.log("\nand none of it exists signed out");
{
  const { page, context, errors } = await open("/account.html", { signedIn: false });

  await page.evaluate(() => {
    const article = document.createElement("article");
    article.className = "article";
    article.dataset.slug = "dse-basics";
    article.innerHTML = '<h1>How the DSE works</h1><p class="byline mono">Rony Reiad</p>';
    document.querySelector("#main").append(article);
  });
  await page.evaluate(() => import("/keep.js"));
  await page.waitForTimeout(600);

  /* Not a greyed-out button and not a "sign in to save" prompt.
     Nothing. A reader who has never signed in has no idea this
     exists, which is the correct amount of nagging. */
  is("no Save button", await page.locator(".keep-bar").count(), 0);
  is("no note panel", await page.locator(".keep-panel").count(), 0);
  is("no page errors", errors.length ? errors[0] : "none", "none");
  await context.close();
}

await browser.close();
server.close();

if (failures.length) {
  console.log(`\n${failures.length} failure(s):`);
  failures.forEach((f) => console.log(`  ${f}`));
  process.exit(1);
}
console.log(`\naccount: ${passed} checks, everything an account holds is drawn, `
  + `written and taken away again.`);
