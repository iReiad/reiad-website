/* ============================================================
   desk.test.mjs: the React desk, driven in a real browser.

     node app/desk.test.mjs

   OPTIONAL, like the Studio's own browser test: it needs
   Playwright, and nothing about building or deploying the site
   depends on it.

       npm i -D playwright
       PLAYWRIGHT=/path/to/playwright node app/desk.test.mjs

   It serves aab/ itself on a spare port and answers every /api/
   call from fixtures below, so there is no server and no database
   to start first. It drives the BUILT page at /desk/, not the
   TypeScript, which is deliberate: `aab/desk/app.js` is what
   deploys, and a test of the source would pass on a stale build.

   ---- why this exists ----

   The first React desk shipped as three thin panels and was
   described, accurately, as visually inferior to the page it was
   replacing. It had lost the search boxes, the per-filter counts,
   the "new" pill, the overview tiles and most of the actions, and
   nothing anywhere could have told me that: a port is the one kind
   of change where "it renders" and "it is finished" look identical
   from the outside.

   So this file is a list of the things the old desk did. Every
   check below is a feature `aab/desk.js` had. If the React desk
   loses one of them again, this fails.
   ============================================================ */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../aab/", import.meta.url));
const PORT = 8131;

/* ---------- Playwright, wherever it lives ---------- */

let chromium;
try {
  const spec = process.env.PLAYWRIGHT || "playwright";
  const mod = await import(spec);
  chromium = mod.chromium ?? mod.default?.chromium;
} catch {
  console.log("Playwright isn't installed, so the browser checks are skipped.");
  console.log("  npm i -D playwright   (or: PLAYWRIGHT=/path/to/playwright node app/desk.test.mjs)");
  process.exit(0);
}
if (!chromium) {
  console.log("Found the Playwright package but no chromium export; skipping.");
  process.exit(0);
}

/* ---------- a static server, so there's nothing to start ---------- */

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".xml": "application/xml", ".webmanifest": "application/manifest+json",
};

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
    const file = normalize(join(ROOT, path === "/" ? "/index.html" : path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise((r) => server.listen(PORT, "127.0.0.1", r));

/* ---------- what the database would have said ----------

   Dated relative to now, because two of the things being checked
   are time-shaped: the "new" pill compares against a stamp in
   localStorage, and the relative dates are rendered from the
   difference. Fixtures pinned to a date in 2024 would have tested
   neither. */

const ago = (mins) => new Date(Date.now() - mins * 60_000).toISOString();

const FIXTURES = {
  "auth/me": { ok: true, signedIn: true, configured: true },

  questions: {
    ok: true,
    questions: [
      { id: 1, slug: "dse-basics", name: "Farhana", email: "f@example.com",
        body: "Is the DSEX free-float weighted before or after the cap?",
        answer: "", status: "pending", created_at: ago(20), answered_at: null },
      { id: 2, slug: null, name: "", email: null,
        body: "Do you take students one to one?",
        answer: "", status: "pending", created_at: ago(60 * 24 * 9), answered_at: null },
    ],
    counts: { pending: 2, published: 5, archived: 1, spam: 3 },
  },

  comments: {
    ok: true,
    comments: [
      { id: 11, slug: "onions", section: "cooking", parent_id: null,
        author_name: "Tanvir", body: "The browning step is the whole recipe.",
        status: "pending", created_at: ago(45) },
      { id: 12, slug: "onions", section: "cooking", parent_id: 11,
        author_name: "Sadia", body: "Agreed, and low heat matters more than time.",
        status: "pending", created_at: ago(60 * 40) },
    ],
  },

  enquiries: {
    ok: true,
    enquiries: [
      { id: 21, name: "Imran", email: "imran@example.com", kind: "modelling",
        message: "Can you build a DCF for a listed cement company?",
        status: "new", notes: "", created_at: ago(120) },
      { id: 22, name: "Nadia", email: "nadia@example.com", kind: "teaching",
        message: "Weekend sessions?", status: "closed", notes: "Sent rates.",
        created_at: ago(60 * 24 * 40) },
    ],
  },

  subscribers: {
    ok: true,
    counts: { total: 4, confirmed: 3, pending: 1 },
    subscribers: [
      { email: "one@example.com", status: "confirmed", lang: "bn", source: "insights",
        created_at: ago(60), confirmed_at: ago(58) },
      { email: "two@example.com", status: "confirmed", lang: "en", source: "insights",
        created_at: ago(600), confirmed_at: ago(598) },
      { email: "three@example.com", status: "pending", lang: "bn", source: "learn",
        created_at: ago(6000), confirmed_at: null },
      { email: "four@example.com", status: "confirmed", lang: "en", source: "",
        created_at: ago(60000), confirmed_at: ago(59000) },
    ],
  },

  "signals/stats": {
    ok: true, days: 30, since: "2026-07-17", total: 1234,
    top: [
      { path: "/portfolio.html", views: 400 },
      { path: "/tools/index.html", views: 300 },
      { path: "/insights/dse-basics.html", views: 200 },
    ],
    daily: [
      { day: "2026-08-13", views: 100 }, { day: "2026-08-14", views: 420 },
      { day: "2026-08-15", views: 300 }, { day: "2026-08-16", views: 414 },
    ],
    reactions: [{ slug: "dse-basics", kind: "useful", count: 12 }],
  },

  articles: {
    ok: true,
    articles: [
      { slug: "rate-cycle", title: "What the rate cycle did to bank margins",
        dek: "", tag: "Analysis", topics: ["banks", "rates"], lang: "en", minutes: 9,
        /* The shape a drawn card actually has: /media/<slug>-card/
           <hash>.jpg. Anything else is a photo, and the desk is
           supposed to say so. This fixture was wrong the first
           time and the panel correctly flagged it. */
        status: "live", section: "insights", cover: "/media/rate-cycle-card/9f2a1c.jpg",
        embedded: 0, published_at: ago(60 * 24 * 3), updated_at: ago(60 * 24 * 3) },
      { slug: "half-written", title: "A draft nobody has seen",
        dek: "", tag: "Analysis", topics: [], lang: "en", minutes: 2,
        status: "draft", section: "insights", cover: "",
        embedded: 0, published_at: null, updated_at: ago(90) },
      { slug: "photo-piece", title: "The one whose photo never left the browser",
        dek: "", tag: "Notes", topics: ["photos"], lang: "en", minutes: 4,
        status: "live", section: "travel", cover: "",
        embedded: 1, published_at: ago(60 * 24 * 8), updated_at: ago(60 * 24 * 8) },
    ],
  },

  "articles/rate-cycle/versions": {
    ok: true,
    versions: [
      { id: 91, title: "What the rate cycle did to bank margins", saved_at: ago(60 * 24 * 4),
        size: 8600 },
      { id: 90, title: "Bank margins and the rate cycle", saved_at: ago(60 * 24 * 6),
        size: 7400 },
    ],
  },
};

/* ---------- the checks ---------- */

let passed = 0;
const failures = [];
const check = (name, condition, detail = "") => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n    ${detail}` : ""));
};

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

/* The service worker would serve its own precached copies of the
   site's modules, which is the wrong thing to test and a very
   confusing way to find that out. */
const context = await browser.newContext({
  viewport: { width: 1400, height: 1100 },
  serviceWorkers: "block",
});

/** Every /api/ path this page asked for, in order. */
const asked = [];

await context.route("**/api/**", async (route) => {
  const url = new URL(route.request().url());
  const path = url.pathname.replace(/^\/api\//, "");
  asked.push(url.pathname + url.search);

  /* Anything that writes answers yes without changing a fixture.
     What is being checked here is that the button sends the right
     request, not that D1 can update a row: that is what
     scripts/comments.test.mjs and the API tests are for. */
  if (route.request().method() !== "GET") {
    await route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify({ ok: true }) });
    return;
  }

  const body = FIXTURES[path] ?? { ok: true };
  await route.fulfill({ status: 200, contentType: "application/json",
    body: JSON.stringify(body) });
});

const page = await context.newPage();
const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));
page.on("console", (m) => { if (m.type() === "error") pageErrors.push(`console: ${m.text()}`); });

/* The desk was last open an hour ago. Some of the fixtures are
   newer than that and some are older, which is the only way to
   check that the "new" pill is marking a difference rather than
   marking everything. */
await page.addInitScript(() =>
  localStorage.setItem("desk-last-seen", String(Date.now() - 3_600_000)));

await page.goto(`http://127.0.0.1:${PORT}/desk/index.html`, { waitUntil: "domcontentloaded" });
await page.waitForSelector(".desk-tiles", { timeout: 10_000 });
await page.waitForTimeout(400);

const tab = (label) => page.locator(`[role="tab"]`, { hasText: label }).first();
const open = async (label) => { await tab(label).click(); await page.waitForTimeout(350); };

/* ---------- 1. the shell ---------- */

check("the gate let the desk through", await page.locator("#desk-root").isVisible());
check("all six panels have a tab", await page.locator('[role="tab"]').count() === 6,
  `saw ${await page.locator('[role="tab"]').count()}`);
check("the Studio is one click away", await page.locator('a[href="/studio.html"]').count() > 0);
check("the panel is a real tabpanel",
  await page.locator('#desk-panel[role="tabpanel"]').count() === 1);
check("the selected tab says so",
  await page.locator('[role="tab"][aria-selected="true"]').count() === 1);

/* `section` in the base layer carries this site's vertical rhythm,
   68px of padding above itself. Making the panel its own section
   rather than sharing one with the tabs put all 68 of them between
   the tab strip and the first thing in the panel, and the panel
   read as belonging to nothing. */
check("the panel is not floating away from its tabs",
  await page.evaluate(() =>
    parseFloat(getComputedStyle(document.getElementById("desk-panel")).paddingTop) < 24),
  await page.evaluate(() =>
    getComputedStyle(document.getElementById("desk-panel")).paddingTop));

/* ---------- 2. the overview ---------- */

check("four tiles", await page.locator(".desk-tile").count() === 4);
{
  const tiles = await page.locator(".desk-tile").allTextContents();
  check("questions waiting is counted", /Questions waiting2/.test(tiles.join("|")), tiles.join(" | "));
  check("new enquiries is counted, not all of them",
    /New enquiries1/.test(tiles.join("|")), tiles.join(" | "));
  check("confirmed subscribers, not total",
    /Confirmed subscribers3/.test(tiles.join("|")), tiles.join(" | "));
  check("thirty days of views", /Views, 30 days1234/.test(tiles.join("|")), tiles.join(" | "));
}
check("only the tiles that mean somebody is waiting are urgent",
  await page.locator(".desk-tile.urgent").count() === 2);
check("a tile routes to its panel",
  await (async () => {
    await page.locator(".desk-tile", { hasText: "Confirmed subscribers" }).click();
    await page.waitForTimeout(300);
    const on = await page.locator('[role="tab"][aria-selected="true"]').textContent();
    return on.includes("Subscribers");
  })());

check("the two tabs with someone waiting carry a badge",
  await page.locator('[role="tab"] .tab-count').count() === 2);

/* ---------- 3. questions ---------- */

await open("Questions");

check("questions are cards, not compact rows",
  await page.locator(".admin-row").count() === 2);
check("every status is reachable",
  await page.locator(".desk-filters .chip").count() === 5);
check("the filters say how many are behind them",
  (await page.locator(".desk-filters .tab-count").allTextContents()).join(",") === "2,5,1,3",
  (await page.locator(".desk-filters .tab-count").allTextContents()).join(","));
check("a question carries its facts",
  await page.locator(".admin-row .admin-meta").count() === 2);
check("the asker's address is a mailto",
  await page.locator('.admin-meta a[href^="mailto:"]').count() === 1);
check("an anonymous asker is named as one",
  (await page.locator(".admin-row").nth(1).textContent()).includes("anonymous"));
check("the question is set in the serif column",
  await page.locator(".admin-q").count() === 2);
check("there is somewhere to write the answer",
  await page.locator("textarea.admin-answer").count() === 2);
check("the new one is marked new, the nine-day-old one is not",
  await page.locator(".admin-row .pill-new").count() === 1);
check("publishing is the solid button",
  (await page.locator(".admin-row").first().locator(".btn-solid").textContent())
    .includes("Answer"));
check("and it is not the only way out",
  await page.locator(".admin-row").first().locator(".btn").count() === 4,
  `${await page.locator(".admin-row").first().locator(".btn").count()} buttons`);

/* The typed answer survives a redraw of the panel, which is the
   thing the old desk got wrong: the textarea was recreated on
   every draw and any half-written answer went with it. */
await page.locator("textarea.admin-answer").first().fill("Before the cap.");
await page.locator(".desk-filters .chip", { hasText: "Everything" }).click();
await page.waitForTimeout(400);
await page.locator(".desk-filters .chip", { hasText: "Waiting" }).click();
await page.waitForTimeout(400);
check("the queue is searched at the endpoint",
  await (async () => {
    asked.length = 0;
    await page.locator(".desk-search").fill("free-float");
    await page.waitForTimeout(700);
    return asked.some((u) => u.includes("q=free-float"));
  })());
check("and it does not ask once per keystroke",
  asked.filter((u) => u.includes("questions?")).length === 1,
  asked.join(" | "));

/* ---------- 4. comments ---------- */

await open("Comments");
check("comments are listed", await page.locator(".comment-line").count() === 2);
check("a reply says it is one",
  (await page.locator(".comment-line").nth(1).textContent()).includes("reply"));
check("each one links to where it was written",
  await page.locator('.comment-line a[href="/cooking/onions.html"]').count() === 2);
check("approving is the one that stands out",
  await page.locator(".comment-line .chip-move").count() === 2);
check("comments are searched in the browser",
  await (async () => {
    await page.locator(".desk-search").fill("browning");
    await page.waitForTimeout(500);
    return await page.locator(".comment-line").count() === 1;
  })());

/* ---------- 5. enquiries ---------- */

await open("Enquiries");
check("only the new one shows by default",
  await page.locator(".admin-row").count() === 1);
check("replying by email comes first",
  (await page.locator(".admin-row .btn-solid").getAttribute("href")).startsWith("mailto:"));
check("with a subject line already written",
  (await page.locator(".admin-row .btn-solid").getAttribute("href")).includes("subject="));
check("there is somewhere for private notes",
  await page.locator("textarea.admin-answer").count() === 1);
check("the filters count every status",
  (await page.locator(".desk-filters .tab-count").allTextContents()).join(",") === "1,1,2",
  (await page.locator(".desk-filters .tab-count").allTextContents()).join(","));
check("a closed enquiry can be reopened",
  await (async () => {
    await page.locator(".desk-filters .chip", { hasText: "Closed" }).click();
    await page.waitForTimeout(300);
    const labels = await page.locator(".admin-row .btn").allTextContents();
    return labels.includes("Reopen");
  })());

/* ---------- 6. subscribers ---------- */

await open("Subscribers");
check("three figures, not one", await page.locator(".stat").count() === 3);
check("confirmed leads", (await page.locator(".stat-lead").textContent()).includes("Confirmed"));
check("the list can be taken away as a file",
  await page.locator('a[href="/api/subscribers/export"]').count() === 1);
check("every address is listed", await page.locator(".admin-table .admin-line").count() === 4);
check("addresses are searchable",
  await (async () => {
    await page.locator(".desk-search").fill("three@");
    await page.waitForTimeout(500);
    return await page.locator(".admin-table .admin-line").count() === 1;
  })());
check("nothing here can be edited",
  await page.locator(".admin-table button").count() === 0);

/* ---------- 7. what's read ---------- */

await open("What's read");
check("three windows to choose from", await page.locator(".desk-filters .chip").count() === 3);
check("the line is drawn", await page.locator(".chart-box svg polyline").count() === 1);
check("the busiest day is a figure of its own",
  (await page.locator(".stat-row").textContent()).includes("420"));
check("a path is named, not printed",
  (await page.locator(".admin-table .admin-line").first().textContent()).includes("Portfolio"),
  await page.locator(".admin-table .admin-line").first().textContent());
check("a tool is named too, and content.js is the only thing that knows that",
  (await page.locator(".admin-table").first().textContent()).toLowerCase().includes("tool"));
check("reactions are shown when there are any",
  (await page.locator(".section-label").allTextContents()).includes("Reactions"));
check("and the page says what it does not know",
  (await page.locator(".tool-note").textContent()).includes("No cookies"));

/* ---------- 8. published ---------- */

await open("Published");
{
  const count = await page.locator(".article-line").count();
  check("committed files are listed alongside the rows", count > 3, `${count} pieces`);
  check("a file piece is marked as one",
    await page.locator(".article-line.is-file").count() > 0);
  check("a file piece offers Import, not Edit",
    await page.locator(".article-line.is-file .chip-move").first().textContent() === "Import");
  check("the count says how many are still to import",
    /still to import/.test(await page.locator(".admin-count").textContent()),
    await page.locator(".admin-count").textContent());
  check("a piece with no hosted photo is flagged",
    await page.locator(".pill-warn").count() === 1);
  check("and the flag says what is wrong",
    (await page.locator(".pill-warn").textContent()) === "photo not hosted");
  check("a draft is shown as a draft",
    await page.locator(".article-line.status-draft").count() === 1);
  check("every section can be filtered to, plus everywhere",
    await page.locator(".desk-filters .chip").count() >= 4);
}

check("titles, slugs and topics are all searchable",
  await (async () => {
    await page.locator(".desk-search").fill("banks");
    await page.waitForTimeout(500);
    const n = await page.locator(".article-line").count();
    await page.locator(".desk-search").fill("");
    await page.waitForTimeout(500);
    return n === 1;
  })());

/* The rest of the actions, behind More. */
await page.locator(".article-line", { hasText: "rate cycle" }).locator("summary").click();
await page.waitForTimeout(200);
{
  const body = page.locator(".article-line", { hasText: "rate cycle" }).locator(".more-body");
  const labels = await body.locator("button, .chip").allTextContents();
  check("More holds the rest of the actions",
    ["Unpublish", "History", "Copy link", "Delete"].every((l) => labels.includes(l)),
    labels.join(" | "));
  check("a live piece can be moved, and the control names every section",
    await body.locator("select.move-select option").count() >= 3);
}

/* An open panel floats over the rows below it, so the second one
   is opened from a row above rather than under it. That is a menu
   behaving like a menu, and the two rules below are what keep it
   from behaving like a menu that will not go away. */
check("only one More is open at a time",
  await (async () => {
    await page.locator(".article-line", { hasText: "A draft nobody" })
      .locator("summary").click();
    await page.waitForTimeout(250);
    return await page.locator("details.more-menu[open]").count() === 1;
  })());

check("Escape closes it",
  await (async () => {
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    return await page.locator("details.more-menu[open]").count() === 0;
  })());

check("and so does a click anywhere else",
  await (async () => {
    await page.locator(".article-line", { hasText: "A draft nobody" })
      .locator("summary").click();
    await page.waitForTimeout(200);
    await page.locator(".hero h1").click();
    await page.waitForTimeout(250);
    return await page.locator("details.more-menu[open]").count() === 0;
  })());

check("a draft is offered Publish rather than Unpublish",
  await (async () => {
    await page.locator(".article-line", { hasText: "A draft nobody" })
      .locator("summary").click();
    await page.waitForTimeout(200);
    const labels = await page.locator(".article-line", { hasText: "A draft nobody" })
      .locator(".more-body button").allTextContents();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    return labels.includes("Publish");
  })());

check("the piece with no card is the one offered Draw card",
  await (async () => {
    await page.locator(".article-line", { hasText: "photo never left" })
      .locator("summary").click();
    await page.waitForTimeout(250);
    const labels = await page.locator(".article-line", { hasText: "photo never left" })
      .locator(".more-body button").allTextContents();
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    return labels.includes("Draw card");
  })());

/* History, which is a real modal dialog. */
await page.locator(".article-line", { hasText: "rate cycle" }).locator("summary").click();
await page.waitForTimeout(200);
await page.locator(".article-line", { hasText: "rate cycle" })
  .locator(".more-body .chip", { hasText: "History" }).click();
await page.waitForTimeout(400);
check("history opens as a modal", await page.locator("dialog.sheet[open]").count() === 1);
check("it names the piece it belongs to",
  (await page.locator("#history-title").textContent()).includes("rate cycle"));
check("both kept versions are listed",
  await page.locator("dialog.sheet[open] .admin-line").count() === 2);
check("each one can be put back",
  (await page.locator("dialog.sheet[open] .admin-line").first().textContent()).includes("Restore"));
await page.locator("dialog.sheet[open] .pane-bar .icon-btn").click();
await page.waitForTimeout(300);
check("and it closes", await page.locator("dialog.sheet[open]").count() === 0);

/* ---------- 9. the things that are easy to lose ---------- */

check("the panel is remembered in the URL", page.url().endsWith("#articles"), page.url());
check("arrow keys move between tabs",
  await (async () => {
    await tab("Published").focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(250);
    const on = await page.locator('[role="tab"][aria-selected="true"]').textContent();
    return on.includes("Questions");     // wraps round to the first
  })());

check("leaving a panel does not carry its typed text into the next one",
  await (async () => {
    await open("Questions");
    await page.locator("textarea.admin-answer").first().fill("half an answer");
    await open("Enquiries");
    await open("Questions");
    return (await page.locator("textarea.admin-answer").first().inputValue()) === "";
  })());

check("nothing threw", pageErrors.length === 0, pageErrors.join("\n    "));

/* ---------- done ---------- */

await browser.close();
server.close();

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("The desk does everything the old one did.\n");
