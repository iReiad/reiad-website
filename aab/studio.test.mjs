/* ============================================================
   studio.test.mjs — the Studio, driven in a real browser.

     node aab/studio.test.mjs

   OPTIONAL, like build-og.mjs: it needs Playwright, and nothing
   about building or deploying the site depends on it.

       npm i -D playwright        # or a global install
       PLAYWRIGHT=/path/to/playwright node aab/studio.test.mjs

   It serves aab/ itself on a spare port, so there is no server to
   start first. Everything runs in the static mode of the Studio —
   no database — which is the half that can be checked without a
   Worker. The dynamic half is test-api.sh's job.

   ---- why this exists ----

   The editor is the one part of this site that cannot be checked by
   reading it. Three bugs found here, none of which any amount of
   staring would have caught:

     · the browser's sanitiser was stricter than the server's, so a
       note box became a plain paragraph and figure.wide lost its
       class on the way out of the editor — which quietly made the
       server's support for those classes unreachable
     · the markdown rules did nothing in an empty editor, because
       the first characters typed have no block to belong to; that
       is the first line of every new article
     · formatBlock silently does nothing without a block to replace,
       so "##" worked on the second line and not the first, while
       the list rules worked on both and hid it
   ============================================================ */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = 8129;

/* ---------- Playwright, wherever it lives ---------- */

let chromium;
try {
  const spec = process.env.PLAYWRIGHT || "playwright";
  const mod = await import(spec);
  chromium = mod.chromium ?? mod.default?.chromium;
} catch {
  console.log("Playwright isn't installed, so the browser checks are skipped.");
  console.log("  npm i -D playwright   (or: PLAYWRIGHT=/path/to/playwright node aab/studio.test.mjs)");
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
    // normalize() collapses "..", and the prefix check refuses
    // anything that still climbs out of aab/.
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

/* ---------- the checks ---------- */

let passed = 0;
const failures = [];
const check = (name, condition, detail = "") => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n    ${detail}` : ""));
};

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1400, height: 1000 } });

const pageErrors = [];
page.on("pageerror", (e) => pageErrors.push(e.message));

// The static gate stores this on unlock; setting it skips the lock
// screen without pretending the gate itself is being tested.
await page.addInitScript(() => sessionStorage.setItem("studio-unlocked-local", "1"));
await page.goto(`http://127.0.0.1:${PORT}/studio.html`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);

const html = () => page.evaluate(() => document.querySelector("#editor").innerHTML);
/** What the Studio would actually publish, after its own sanitiser. */
const published = () => page.evaluate(async () =>
  (await import("/studio.js")).sanitize(document.querySelector("#editor").innerHTML));

const empty = async () => {
  await page.evaluate(() => { document.querySelector("#editor").innerHTML = ""; });
  await page.click("#editor");
};
const seeded = async () => {
  await page.evaluate(() => { document.querySelector("#editor").innerHTML = "<p><br></p>"; });
  await page.click("#editor");
};

/* ---------- 1. the shell ---------- */

check("the library bar is there", await page.locator("#btn-new").count() > 0);
check("Notion stays hidden without a backend", !(await page.locator("#btn-notion").isVisible()));
check("publish stays hidden without a backend", !(await page.locator("#btn-publish").isVisible()));
check("pre-flight is quiet on an empty editor", !(await page.locator("#preflight").isVisible()));

await page.fill("#f-title", "How the Dhaka Stock Exchange actually works");
await page.click("#editor");
await page.keyboard.type("The DSEX is a free-float weighted index. ");
await page.waitForTimeout(600);

check("pre-flight appears once writing starts", await page.locator("#preflight").isVisible());
{
  const issues = await page.locator("#preflight-list li").allTextContents();
  check("it wants a standfirst", issues.some((t) => /standfirst/i.test(t)));
  check("it wants a label", issues.some((t) => /label/i.test(t)));
}
check("the preview renders the headline",
  (await page.locator("#preview h1").textContent()).includes("Dhaka Stock Exchange"));
check("the slug is derived from the headline",
  (await page.getAttribute("#f-slug", "placeholder")) === "how-the-dhaka-stock-exchange-actually");
check("the word count is live",
  /\b7 words\b/.test(await page.locator("#stat-line").textContent()));

await page.fill("#f-dek", "x".repeat(200));
await page.waitForTimeout(500);
check("an over-long standfirst is flagged",
  (await page.locator("#preflight-list li").allTextContents()).some((t) => /cut off around/.test(t)));
await page.fill("#f-dek", "A short one.");

/* ---------- 2. markdown, including the first line ---------- */

// An empty editor has no block for the caret to sit in. This is the
// state every new article starts in, and it used to be the broken one.
await empty();
await page.keyboard.type("## First line of a new piece");
await page.waitForTimeout(300);
check("## works on the first line of an empty editor",
  /<h2>First line of a new piece<\/h2>/.test(await html()), await html());

await empty();
await page.keyboard.type("- first bullet of a new piece");
await page.waitForTimeout(300);
check("- works on the first line of an empty editor",
  /<ul>[\s\S]*<li>first bullet/.test(await html()), await html());

for (const [typed, pattern, name] of [
  ["## A heading", /<h2>A heading<\/h2>/, "## makes an H2"],
  ["### A sub-heading", /<h3>A sub-heading<\/h3>/, "### makes an H3"],
  ["- an item", /<ul>[\s\S]*<li>an item/, "- makes a bullet list"],
  ["1. an item", /<ol>[\s\S]*<li>an item/, "1. makes a numbered list"],
  ["> quoted", /<blockquote>quoted/, "> makes a blockquote"],
]) {
  await seeded();
  await page.keyboard.type(typed);
  await page.waitForTimeout(280);
  check(name, pattern.test(await html()), await html());
}

await seeded();
await page.keyboard.type("I paid 1. then 2.");
await page.waitForTimeout(300);
check("a marker mid-sentence is left alone", !/<ol>/.test(await html()), await html());

/* ---------- 3. the slash menu ---------- */

await seeded();
await page.keyboard.type("/");
await page.waitForTimeout(300);
check("slash opens the menu", await page.locator(".slash-menu").isVisible());
check("the menu offers the site's own blocks",
  (await page.locator(".slash-item").allTextContents()).join("|").includes("Note"));

await page.keyboard.type("note");
await page.waitForTimeout(300);
{
  const shown = await page.locator(".slash-item").allTextContents();
  check("typing filters it", shown.length === 1 && shown[0].includes("Note"), shown.join("|"));
}

await page.keyboard.press("Enter");
await page.waitForTimeout(400);
check("Enter inserts the note box", /<div class="note">/.test(await html()), await html());
check("the typed /note is cleaned up", !(await html()).includes("/note"));
check("the menu closes", !(await page.locator(".slash-menu").isVisible()));

// The class has to survive the Studio's own sanitiser, or the server
// never sees it and the whole block vocabulary is decorative.
check("the note box survives sanitize()",
  /<div class="note">/.test(await published()), await published());

await seeded();
await page.keyboard.type("/");
await page.waitForTimeout(250);
await page.keyboard.press("Escape");
await page.waitForTimeout(200);
check("Escape closes it", !(await page.locator(".slash-menu").isVisible()));

await seeded();
await page.keyboard.type("see https:/");
await page.waitForTimeout(300);
check("a slash inside a word is just a slash",
  !(await page.locator(".slash-menu").isVisible()));

await seeded();
await page.keyboard.type("/table");
await page.waitForTimeout(300);
await page.keyboard.press("Enter");
await page.waitForTimeout(400);
check("a table gets the phone scroller",
  /<div class="table-scroll">/.test(await published()), await published());

/* ---------- 4. photos ---------- */

const PIXEL = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
await page.evaluate((src) => {
  document.querySelector("#editor").innerHTML =
    `<figure><img src="${src}" width="200" height="200"></figure><p>after</p>`;
}, PIXEL);

await page.click("#editor img");
await page.waitForTimeout(300);
check("clicking a photo opens its toolbar", await page.locator(".fig-bar").isVisible());
check("the toolbar offers alt text",
  (await page.locator(".fig-bar .chip").allTextContents()).some((c) => c.startsWith("Alt text")));

await page.locator('.fig-bar .chip:has-text("Wide")').click();
await page.waitForTimeout(300);
check("Wide sets the class", /<figure class="wide">/.test(await html()), await html());
check("and it survives sanitize()", /<figure class="wide">/.test(await published()));

page.once("dialog", (d) => d.accept("A chart of DSEX returns"));
await page.locator('.fig-bar .chip:has-text("Alt text")').click();
await page.waitForTimeout(400);
check("alt text reaches the image",
  (await html()).includes('alt="A chart of DSEX returns"'), await html());

await page.waitForTimeout(600);
check("and pre-flight stops asking for it",
  !(await page.locator("#preflight-list li").allTextContents()).some((t) => /alt text/i.test(t)));

/* ---------- 5. drafts ---------- */

await page.click("#btn-new");
await page.waitForTimeout(200);
check("New empties the headline", (await page.inputValue("#f-title")) === "");

await page.fill("#f-title", "A second piece");
await page.click("#editor");
await page.keyboard.type("Second body.");
await page.waitForTimeout(1200);

await page.click("#btn-open");
await page.waitForTimeout(400);
// One draft could be in progress at a time before these were keyed
// by id; starting a second destroyed the first.
check("both drafts are listed, not just the latest",
  (await page.locator("#open-body .admin-line").count()) >= 2);
check("no database section without a backend",
  !(await page.locator("#open-body").textContent()).includes("Published through the Studio"));
await page.click("#open-close");

/* ---------- done ---------- */

await browser.close();
server.close();

// Google Fonts is the only outbound request the page makes, and it is
// not what is under test here.
const real = pageErrors.filter((e) => !/fonts\.googleapis/.test(e));
for (const err of real) failures.push(`uncaught page error: ${err}`);

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} FAILED:\n`);
  for (const f of failures) console.log("  " + f + "\n");
  process.exit(1);
}
console.log("Studio: all good.\n");
