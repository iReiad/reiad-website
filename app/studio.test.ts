/* ============================================================
   studio.test.ts: the React Studio, driven in a real browser.

     node app/studio.test.ts

   OPTIONAL, like the other browser tests: it needs Playwright,
   and nothing about building or deploying the site depends on it.

       npm i -D playwright
       PLAYWRIGHT=/path/to/playwright node app/studio.test.ts

   It serves aab/ itself on a spare port and drives the BUILT page
   at /studio/, not the TypeScript: `aab/studio/app.js` is what
   deploys, and a test of the source would pass on a stale build.

   ---- what this covers, and what it deliberately does not ----

   The writing surface itself is `aab/editor.js` now, shared by
   both Studios, and `aab/studio.test.ts` already drives all 70 of
   its checks against the old page: the sanitiser, the markdown
   rules, the slash menu, the figure toolbar. Repeating them here
   would test the same module twice and prove nothing about the
   port.

   So this file is the chrome: the fields, the section picker, the
   topic chips, the three previews, the weight meter, pre-flight,
   the Open sheet, the drafts, and the publish. Every check is
   something `aab/studio.js` did. There are two passes, because
   half the behaviour is about whether there is a database: the
   Studio has always run as a local editor without one and says so.
   ============================================================ */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, BrowserContext, BrowserType, Page } from "playwright";

const ROOT = fileURLToPath(new URL("../aab/", import.meta.url));
const PORT = 8133;

/* ---------- Playwright, wherever it lives ---------- */

/** What `import(spec)` might hand back. The specifier is a
    variable on purpose, so PLAYWRIGHT can name an install
    somewhere else, and that is exactly what TypeScript cannot
    resolve: it answers `any`, and this is the one place that
    turns it back into a type the rest of the file can rely on. */
interface PlaywrightModule {
  chromium?: BrowserType;
  default?: { chromium?: BrowserType };
}

const isModule = (value: unknown): value is PlaywrightModule =>
  typeof value === "object" && value !== null;

let chromium: BrowserType | undefined;
try {
  const spec = process.env.PLAYWRIGHT || "playwright";
  const mod: unknown = await import(spec);
  chromium = isModule(mod) ? mod.chromium ?? mod.default?.chromium : undefined;
} catch {
  console.log("Playwright isn't installed, so the browser checks are skipped.");
  console.log("  npm i -D playwright   (or: PLAYWRIGHT=/path/to/playwright node app/studio.test.ts)");
  process.exit(0);
}
if (!chromium) {
  console.log("Found the Playwright package but no chromium export; skipping.");
  process.exit(0);
}

/* ---------- the shell the bundle mounts into ----------

   `/desk/index.html` and `/studio/index.html` are Next.js routes
   as of archive/TRANSITION.md Stage 11.6, so there is no file at either
   address for this server to hand back. That is the right place
   for them and the wrong thing to drag into a browser test: the
   subject here is the bundle, and starting a Next server to get a
   header and a footer would make a test of the panels depend on
   a renderer that has its own test.

   So the server answers those two addresses with the two things
   the bundle actually needs, the stylesheet and the element it
   mounts into, and nothing else. Everything this file checks is
   inside that element. */
const SHELLS: Record<string, [root: string, bundle: string]> = {
  "/desk/index.html": ["desk-root", "/desk/app.js"],
  "/studio/index.html": ["studio-root", "/studio/app.js"],
};

const shellFor = ([root, bundle]: [string, string]): string =>
  `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">`
  + `<link rel="stylesheet" href="/styles.css">`
  + `<script type="module" crossorigin src="${bundle}"></script></head>`
  + `<body><main id="main"><div class="wrap" id="${root}" hidden></div></main></body></html>`;

/* ---------- a static server, so there's nothing to start ---------- */

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png",
  ".ico": "image/x-icon", ".xml": "application/xml", ".webmanifest": "application/manifest+json",
};

const server = createServer(async (req, res) => {
  try {
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    if (SHELLS[path]) {
      res.writeHead(200, { "Content-Type": TYPES[".html"] });
      res.end(shellFor(SHELLS[path]));
      return;
    }
    const file = normalize(join(ROOT, path === "/" ? "/index.html" : path));
    if (!file.startsWith(ROOT)) { res.writeHead(403).end(); return; }
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("not found");
  }
});
await new Promise<void>((ready) => { server.listen(PORT, "127.0.0.1", ready); });

/* ---------- the checks ---------- */

let passed = 0;
const failures: string[] = [];
const check = (name: string, condition: boolean, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n    ${detail}` : ""));
};

/** What an element says. `textContent()` and `getAttribute()` both
    answer `string | null`, and a null here is a selector that found
    nothing rather than an element with nothing in it.

    So it throws, which is what the JavaScript did by calling
    `.includes` on the null. Answering "" instead would turn a check
    reading `!text.includes(x)` into a pass, and the two the Open
    sheet is checked with are exactly that shape. */
const said = (value: string | null): string => {
  if (value === null) throw new Error("nothing there to read");
  return value;
};

/* A browser, or a clean skip.

   `playwright` is a devDependency here, so `npm i` gets the
   library; it does not get the browser, and it refuses to launch
   one it did not download itself unless it is told where one is.
   A machine with Chromium already on it says so through
   CHROMIUM_PATH. Anything else skips with the reason, because a
   test that cannot start is not a test that failed. */
let browser: Browser;
try {
  browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || undefined,
  });
} catch (err) {
  console.log("No browser to drive, so the browser checks are skipped.");
  console.log(`  ${(err instanceof Error ? err.message : String(err)).split("\n")[0]}`);
  console.log("  npx playwright install chromium"
    + "   (or: CHROMIUM_PATH=/path/to/chrome node app/studio.test.ts)");
  server.close();
  process.exit(0);
}

const pageErrors: string[] = [];

/** One POST the Studio made, and the fields these checks read out
    of it. The payload carries more than this; what is described
    here is what is asserted. */
interface Posted {
  slug?: string;
  topics?: string[];
  tag?: string;
  section?: string;
  status?: string;
  overwrite?: boolean;
}

interface Sent {
  path: string;
  body: Posted;
}

interface Studio {
  page: Page;
  context: BrowserContext;
  /** Every /api/ path asked for, in order. */
  asked: string[];
  sent: Sent[];
}

/** A page at /studio/, with the API answering however we say. */
async function studio(
  { backend, fixtures = {} }:
  { backend: boolean; fixtures?: Record<string, unknown> },
): Promise<Studio> {
  const context = await browser.newContext({
    viewport: { width: 1500, height: 1100 },
    // The service worker would serve its own precached copies of
    // the site's modules, which is the wrong thing to test and a
    // very confusing way to find that out.
    serviceWorkers: "block",
  });

  const asked: string[] = [];
  const sent: Sent[] = [];

  await context.route("**/api/**", async (route) => {
    const url = new URL(route.request().url());
    /* The query is part of the key: "articles" and "articles?all=1"
       are different questions, and the second is the one the
       Studio asks. Matching on the path alone answered the wrong
       fixture and the failures read as missing features. */
    const path = (url.pathname + url.search).replace(/^\/api\//, "");
    asked.push(path);

    if (!backend) {
      /* 503 not-configured is exactly what a site with no database
         answers, and api.js turns it into null. That is the state
         the Studio has always had to keep working in. */
      await route.fulfill({ status: 503, contentType: "application/json",
        body: JSON.stringify({ ok: false, reason: "not-configured" }) });
      return;
    }
    if (route.request().method() !== "GET") {
      sent.push({ path, body: JSON.parse(route.request().postData() || "{}") });
      await route.fulfill({ status: 200, contentType: "application/json",
        body: JSON.stringify(fixtures[`POST ${path}`] ?? { ok: true }) });
      return;
    }
    await route.fulfill({ status: 200, contentType: "application/json",
      body: JSON.stringify(fixtures[path] ?? { ok: true }) });
  });

  const page = await context.newPage();
  /* Only this page's, and only real ones. A 503 from /api/ is the
     no-database pass working exactly as intended, and a console
     line about a failed resource is the network saying so, not
     the page throwing. */
  page.on("pageerror", (e) => pageErrors.push(e.message));
  page.on("console", (m) => {
    if (m.type() !== "error") return;
    if (/Failed to load resource/.test(m.text())) return;
    pageErrors.push(`console: ${m.text()}`);
  });

  // The static gate stores this on unlock; setting it skips the
  // lock screen without pretending the gate itself is being tested.
  await page.addInitScript(() => sessionStorage.setItem("studio-unlocked-local", "1"));
  await page.goto(`http://127.0.0.1:${PORT}/studio/index.html`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector("#editor", { timeout: 10_000 });
  await page.waitForTimeout(500);

  return { page, context, asked, sent };
}

const type = async (page: Page, text: string): Promise<void> => {
  await page.click("#editor");
  await page.keyboard.type(text);
  await page.waitForTimeout(400);
};

/* ============================================================
   1. WITHOUT A DATABASE
   ============================================================ */

{
  const { page, context } = await studio({ backend: false });
  const html = (): Promise<string> => page.evaluate(() => {
    const editor = document.querySelector("#editor");
    if (!editor) throw new Error("there is no #editor");
    return editor.innerHTML;
  });

  check("the library bar is there", await page.locator("#btn-new").count() > 0);
  check("Open is there too", await page.locator("#btn-open").count() > 0);
  check("Notion stays hidden without a backend",
    await page.locator("#btn-notion").count() === 0);
  check("publish stays hidden without a backend",
    await page.locator("#btn-publish").count() === 0);
  check("and the page says why",
    await page.locator("#no-database").isVisible());
  check("the desk link stays hidden too",
    await page.locator("#btn-desk").count() === 0);
  check("pre-flight is quiet on an empty editor",
    !(await page.locator("#preflight").isVisible()));

  /* ---- where it goes ---- */
  check("every section is offered", await page.locator("#f-section-seg .chip").count() === 3);
  check("Insights is the one chosen",
    await page.locator('#f-section-seg [aria-checked="true"]').textContent() === "Insights");
  check("the hint names the mount it will be published at",
    said(await page.locator("#section-hint").textContent()).startsWith("/insights/"));
  await page.locator("#f-section-seg .chip", { hasText: "রান্নাঘর" }).click();
  await page.waitForTimeout(300);
  check("choosing another moves the mount",
    said(await page.locator("#section-hint").textContent()).startsWith("/cooking/"));
  check("and says so in the bar",
    said(await page.locator("#now-line").textContent()).includes("Cooking"));
  await page.locator("#f-section-seg .chip", { hasText: "Insights" }).click();
  await page.waitForTimeout(300);

  /* ---- the fields ---- */
  await page.fill("#f-title", "How the Dhaka Stock Exchange actually works");
  await type(page, "The DSEX is a free-float weighted index. ");

  check("pre-flight appears once writing starts", await page.locator("#preflight").isVisible());
  {
    const issues = await page.locator("#preflight-list li").allTextContents();
    check("it wants a standfirst", issues.some((t) => /standfirst/i.test(t)));
    check("it wants topics", issues.some((t) => /topics/i.test(t)));
  }
  check("the preview renders the headline",
    said(await page.locator("#preview h1").textContent()).includes("Dhaka Stock Exchange"));
  check("the slug is derived from the headline",
    (await page.getAttribute("#f-slug", "placeholder")) === "how-the-dhaka-stock-exchange-actually");
  check("the word count is live",
    /\b7 words\b/.test(await page.locator("#stat-line").textContent() ?? ""));
  check("so is the weight meter",
    /\bKB page\b/.test(await page.locator("#meter-text").textContent() ?? ""));

  await page.fill("#f-dek", "x".repeat(200));
  await page.waitForTimeout(400);
  check("an over-long standfirst is flagged",
    (await page.locator("#preflight-list li").allTextContents())
      .some((t) => /cut off around/.test(t)));
  await page.fill("#f-dek", "A short one.");
  await page.waitForTimeout(300);

  /* ---- topics ---- */
  await page.fill("#f-topics", "Equities");
  await page.keyboard.press("Enter");
  await page.fill("#f-topics", "Beginner, Markets");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(400);

  check("Enter keeps a topic", await page.locator(".topic-chip").count() === 3,
    `${await page.locator(".topic-chip").count()} chips`);
  check("a comma splits a paste into several",
    (await page.locator(".topic-chip").allTextContents()).join("|").includes("Markets"));
  check("the first three become the line above the headline",
    (await page.locator("#preview .eyebrow").textContent()) === "Equities · Beginner · Markets");
  check("and pre-flight stops asking for topics",
    !(await page.locator("#preflight-list li").allTextContents()).some((t) => /No topics/.test(t)));

  await page.fill("#f-topics", "equities");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  check("the same topic in a different case is not a second chip",
    await page.locator(".topic-chip").count() === 3);

  await page.locator(".topic-chip", { hasText: "Beginner" }).locator(".topic-x").click();
  await page.waitForTimeout(300);
  check("a chip can be taken off", await page.locator(".topic-chip").count() === 2);
  check("its ✕ says what it removes, for a screen reader",
    said(await page.locator(".topic-chip .topic-x").first().getAttribute("aria-label"))
      .startsWith("Remove the topic"));

  /* Emptied first: the box keeps what was typed when a topic is
     refused, which is deliberate, so Backspace would be editing
     text rather than reaching the chips. */
  await page.fill("#f-topics", "");
  await page.click("#f-topics");
  await page.keyboard.press("Backspace");
  await page.waitForTimeout(300);
  check("Backspace on an empty box takes the last one back",
    await page.locator(".topic-chip").count() === 1);

  /* With no database there is nothing to suggest, and the strip
     says so by not being there. It used to be filled from the
     lists in content.js, which stopped holding pieces at Stage
     11.2: every piece is a row. The same two checks are made
     against a database in part 2, where the vocabulary is real. */
  check("with no database, no vocabulary is offered",
    await page.locator("#topic-known .chip").count() === 0);

  /* ---- the file name ---- */
  await page.fill("#f-slug", "German Alphabets");
  await page.locator("#f-title").click();
  await page.waitForTimeout(300);
  check("a typed file name is tidied into a usable slug",
    (await page.inputValue("#f-slug")) === "german-alphabets",
    await page.inputValue("#f-slug"));

  /* ---- the editor is really wired to editor.js ----
     The engine has its own 70 checks against the old page. These
     two only prove that this page is driving it. */
  await page.evaluate(() => {
    const editor = document.querySelector("#editor");
    if (!editor) throw new Error("there is no #editor");
    editor.innerHTML = "";
  });
  await page.click("#editor");
  await page.keyboard.type("## A heading in the React Studio");
  await page.waitForTimeout(300);
  check("markdown works, so the shared engine is running",
    /<h2>A heading in the React Studio<\/h2>/.test(await html()), await html());

  await page.keyboard.press("Enter");
  await page.keyboard.type("/note");
  await page.waitForTimeout(350);
  check("the slash menu opens over this page too",
    await page.locator(".slash-menu").isVisible());
  await page.keyboard.press("Enter");
  await page.waitForTimeout(350);
  check("and inserts the site's own block",
    /<div class="note">/.test(await html()), await html());

  check("the toolbar's block buttons are named from the same list",
    (await page.locator('[aria-label="Blocks"] .chip').allTextContents())
      .includes("At a glance"));

  /* ---- the three previews ---- */
  check("the article view is the default",
    await page.locator("#preview .article").count() === 1);

  await page.locator('[data-width="phone"]').click();
  await page.waitForTimeout(250);
  check("phone width constrains the stage",
    (await page.locator("#preview-stage")
      .evaluate((el: HTMLElement) => el.style.maxWidth)) === "390px");

  {
    const bg = async () => page.locator("#preview-scroll")
      .evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
    await page.locator("#preview-theme").click();      // light
    await page.waitForTimeout(200);
    const light = await bg();
    await page.locator("#preview-theme").click();      // dark
    await page.waitForTimeout(200);
    const dark = await bg();
    const body = await page.locator("body")
      .evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor);
    check("the preview theme changes the preview's colours", light !== dark, `${light} vs ${dark}`);
    check("and leaves the rest of the page alone", body !== dark, `${body} vs ${dark}`);
    await page.locator("#preview-theme").click();      // back to auto
  }

  await page.locator('[data-view="card"]').click();
  await page.waitForTimeout(300);
  check("the card view uses the real card markup",
    await page.locator("#preview .cards .sample-card").count() === 1);
  check("width buttons switch off outside the article view",
    await page.locator('[data-width="phone"]').isDisabled());

  await page.locator('[data-view="share"]').click();
  await page.waitForTimeout(300);
  check("the share view renders a link card", await page.locator(".share-card").isVisible());
  check("with the site's default image when there's no photo",
    said(await page.locator(".share-image img").getAttribute("src")).includes("/og/"));
  check("and it reports how the lengths compare",
    said(await page.locator(".share-notes").textContent()).includes("of about 60 characters"));

  await page.fill("#f-title", "x".repeat(80));
  await page.waitForTimeout(400);
  check("an over-long headline is flagged",
    said(await page.locator(".share-notes").textContent()).includes("will be cut around 60"));
  await page.locator('[data-view="article"]').click();
  await page.waitForTimeout(250);

  /* ---- drafts, and Open ---- */
  await page.fill("#f-title", "The first draft");
  await page.waitForTimeout(1200);            // the 700ms autosave
  check("a draft says when it was saved",
    /Draft saved/.test(await page.locator("#draft-line").textContent() ?? ""));

  await page.click("#btn-new");
  await page.waitForTimeout(300);
  check("New empties the headline", (await page.inputValue("#f-title")) === "");
  check("and empties the editor", (await html()).trim() === "");

  await page.fill("#f-title", "The second draft");
  await page.waitForTimeout(1200);

  await page.click("#btn-open");
  await page.waitForTimeout(700);
  {
    const text = said(await page.locator("dialog.sheet[open] .sheet-body").textContent());
    check("both drafts are listed, not just the latest",
      text.includes("The first draft") && text.includes("The second draft"), text.slice(0, 240));
    check("no database section without a backend", !text.includes("Published through the Studio"));
    /* Open used to carry a third list, "Written as files, in the
       repository", with an Edit that read a committed page back
       out of its own HTML and into the editor. That is how the
       last file pieces were moved into the database, and it went
       with them at Stage 11.2. */
    check("and nothing offers a file to import", !text.includes("Written as files"),
      text.slice(0, 240));
  }

  await context.close();
}

/* ============================================================
   2. WITH A DATABASE
   ============================================================ */

{
  const ago = (d: number): string => new Date(Date.now() - d * 86_400_000).toISOString();
  const { page, context, sent } = await studio({
    backend: true,
    fixtures: {
      "auth/me": { ok: true, signedIn: true, configured: true },
      "notion/status": { ok: true, configured: true },
      "questions?status=pending": { ok: true, questions: [{ id: 1 }, { id: 2 }] },
      enquiries: { ok: true, enquiries: [{ status: "new" }, { status: "closed" }] },
      "articles?all=1": {
        ok: true,
        articles: [
          { slug: "rate-cycle", title: "What the rate cycle did to bank margins",
            status: "live", section: "insights", topics: ["Banks", "Rates"],
            tag: "Banks · Rates", lang: "en", dek: "", cover: "", updated_at: ago(3) },
        ],
      },
    },
  });

  check("publish appears once there is a database",
    await page.locator("#btn-publish").count() === 1);
  check("so does saving a draft to the site",
    await page.locator("#btn-save-draft").count() === 1);
  check("and the Notion import, because the token is set",
    await page.locator("#btn-notion").count() === 1);
  check("the Studio points at the desk", await page.locator("#btn-desk").count() === 1);
  check("and says how many people are waiting",
    said(await page.locator("#btn-desk").textContent()).includes("(3)"),
    await page.locator("#btn-desk").textContent() ?? "");
  check("which is the React desk, not the old page",
    said(await page.locator("#btn-desk").getAttribute("href")).startsWith("/desk/"));

  check("publishing is refused while the editor is empty",
    await page.locator("#btn-publish").isDisabled());

  await page.fill("#f-title", "What the rate cycle did to bank margins");
  // The clash is on the file name, which is what the URL is.
  await page.fill("#f-slug", "rate-cycle");
  await type(page, "Margins widened, then did not. ");
  await page.waitForTimeout(500);

  {
    const issues = await page.locator("#preflight-list li").allTextContents();
    check("a file name already in the database is an error",
      issues.some((t) => /already live/.test(t)), issues.join(" | "));
    check("and it names the piece that has it",
      issues.some((t) => /bank margins/.test(t)));
    check("which stops the publish",
      await page.locator("#btn-publish").isDisabled());
    check("and the panel says so",
      (await page.locator("#preflight").getAttribute("data-state")) === "blocked");
  }

  await page.fill("#f-slug", "");
  await page.fill("#f-title", "A piece nothing else is called");
  await page.waitForTimeout(600);
  check("changing it clears the block", !(await page.locator("#btn-publish").isDisabled()));
  check("and the summary counts what is left, not nothing",
    /note/.test(await page.locator("#preflight-summary").textContent() ?? ""),
    await page.locator("#preflight-summary").textContent() ?? "");

  /* Which is now the only place a vocabulary comes from: this
     check used to sit beside one that read the same list out of
     content.js, and content.js stopped holding pieces at Stage
     11.2. Clicking one is checked below, by publishing with it. */
  check("the database's topics are the vocabulary",
    (await page.locator("#topic-known .chip").allTextContents()).includes("Banks"),
    (await page.locator("#topic-known .chip").allTextContents()).join("|"));
  {
    const first = said(await page.locator("#topic-known .chip").first().textContent());
    await page.locator("#topic-known .chip").first().click();
    await page.waitForTimeout(300);
    check("and clicking one keeps it",
      (await page.locator(".topic-chip").allTextContents()).join("|").includes(first));
    await page.locator(".topic-chip", { hasText: first }).locator("button").click();
    await page.waitForTimeout(300);
  }

  /* ---- publishing ---- */
  await page.fill("#f-topics", "Rates");
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  await page.click("#btn-publish");
  await page.waitForTimeout(1200);

  {
    const post = sent.find((s) => s.path === "articles");
    check("publishing posts the article", Boolean(post), sent.map((s) => s.path).join("|"));
    check("with the slug the file-name box derived",
      post?.body?.slug === "a-piece-nothing-else-is-called", post?.body?.slug);
    check("with the topics as an array, not a split label",
      Array.isArray(post?.body?.topics) && post?.body?.topics?.[0] === "Rates",
      JSON.stringify(post?.body?.topics));
    check("with the label built from them",
      post?.body?.tag === "Rates", post?.body?.tag);
    check("with the section it is going to", post?.body?.section === "insights");
    check("and live, because that is the button that was pressed",
      post?.body?.status === "live");
    check("it does not claim to overwrite something it never opened",
      post?.body?.overwrite === false);
  }

  check("the bar now says what is being edited",
    said(await page.locator("#now-line").textContent()).includes("/insights/"),
    await page.locator("#now-line").textContent() ?? "");
  check("and View it appears", await page.locator("#btn-view").count() === 1);

  /* ---- the Open sheet, with a database behind it ---- */
  await page.click("#btn-open");
  await page.waitForTimeout(700);
  {
    const text = said(await page.locator("dialog.sheet[open] .sheet-body").textContent());
    check("Open lists what is in the database", text.includes("Published through the Studio"));
    check("including the piece that is live there", text.includes("bank margins"));
  }
  await page.locator("dialog.sheet[open] .pane-bar .icon-btn").click();
  await page.waitForTimeout(300);
  check("and the sheet closes", await page.locator("dialog.sheet[open]").count() === 0);

  check("nothing threw", pageErrors.length === 0, pageErrors.join("\n    "));

  await context.close();
}

/* ---------- done ---------- */

await browser.close();
server.close();

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("The React Studio does what the old one did.\n");
