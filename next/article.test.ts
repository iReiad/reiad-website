/* ============================================================
   article.test.ts: the article page, in a browser, on the real
   Worker.

     node next/article.test.ts

   THE GAP THIS CLOSES

   Every browser test in this repository drives a PRERENDERED
   page: `interactive.test.mjs` serves Next's output files from a
   little static server, `account.test.mjs` and `app/desk.test.mjs`
   do the same for theirs. An article is not prerendered. It is
   rendered per request out of D1, so none of them could reach it,
   and a client component on it was verified for its first paint
   and for nothing an effect or a click does.

   That mattered the moment the comment thread became a component
   (#147), and it will matter again: `engage.js` and
   `read-aloud.js` are on the same page.

   ---- why the Worker rather than a deployed preview ----

   Cloudflare gives every branch a preview URL with the real
   database behind it, which sounds like the easier answer. A
   browser in the container this was written in cannot reach the
   network at all: `example.com` resets the same way the preview
   does, and only the browser's own component-update requests
   reach the egress proxy. Every browser test here serves from
   localhost, and that is why. `scripts/check-preview.ts` is what
   asks a deployed preview anything, over fetch.

   `dev-worker.ts` is the boot, shared with `parity.test.mjs`.
   ============================================================ */

import { dirname, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { access, readFile } from "node:fs/promises";
import { ARTICLES_TABLE, built, insert, startWorker } from "./dev-worker.ts";
import type { ConsoleMessage, Page, Request, Response, Route } from "playwright";

const here = dirname(fileURLToPath(import.meta.url));
const AAB = join(here, "..", "aab");
const PORT = 8791;

/** Says why, and does not come back. `never` rather than `void`
    so that the checks after `if (!worker.ok) skip(...)` know the
    Worker started: a skip that TypeScript thinks might return
    leaves every use of `worker.origin` below an error. */
const skip: (why: string) => never = (why) => {
  console.log(`SKIPPED: ${why}`);
  console.log("A skip is not a pass: the article page has no browser check\n"
    + "at all without this.\n");
  process.exit(0);
};

if (!built()) {
  skip("no .open-next/worker.js. Run: cd next && npx opennextjs-cloudflare build");
}

const exists = async (p: string): Promise<boolean> =>
  access(p).then(() => true, () => false);
const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const browserPath = process.env.CHROMIUM_PATH
  || (await exists(CHROME) ? CHROME : null);

/* The runtime import is the real path, because node resolves a
   file on disk; the types come from the same package through the
   `paths` entry in `tsconfig.json`.

   Caught into a null rather than wrapped in try/catch, so that
   the `skip` below is what narrows it: `skip` returns `never`, so
   everything after this line knows there is a browser. */
/* The specifier is a VARIABLE, which is the same shape
   `components/account/runtime.ts` uses and for a related reason:
   a literal here is analysed, and a relative path that `paths`
   cannot map is a module with no declaration. `paths` only
   applies to non-relative specifiers, so the type-only import
   above is how this gets typed and this is how it gets loaded. */
const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const playwright = await import(PLAYWRIGHT)
  .then((m) => m as typeof import("playwright"), () => null);
if (!playwright) {
  skip("playwright is not installed. It is a devDependency of app/: `cd app && npm install`.");
}
const { chromium } = playwright;
if (!browserPath) {
  try { chromium.executablePath(); } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---------- one piece, invented ----------

   A slug nothing will ever be called, on the same reasoning
   `parity.test.mjs` gives for `rate-cycle`: a fixture that
   collides with a real piece tests the fixture. */
const ARTICLE = {
  slug: "browser-fixture", section: "insights", lang: "en",
  title: "A piece to press buttons on",
  dek: "Seeded for this check and for nothing else.",
  tag: "Equities · Beginner", topics: "Equities",
  body: "<p>One paragraph is enough to hang a thread under.</p>",
  cover: "", minutes: 4, status: "live",
  published_at: "2026-07-01", updated_at: "2026-08-01",
};

const worker = await startWorker({
  port: PORT,
  seed: (db) => {
    db.exec(ARTICLES_TABLE);
    db.exec(insert("articles", Object.keys(ARTICLE), ARTICLE));
  },
});

if (!worker.ok) {
  console.log(worker.log().split("\n").slice(-15).join("\n"));
  skip(worker.reason);
}

const URL_ = `${worker.origin}/insights/${ARTICLE.slug}.html`;

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed += 1; return; }
  failures.push(detail ? `${name}\n      ${detail}` : name);
};

const browser = await chromium.launch(browserPath ? { executablePath: browserPath } : {});

const TYPES: Record<string, string> = {
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

/** One comment, as the endpoint answers it. Only the fields these
    checks put in. */
interface Seeded {
  id: number;
  author_name: string;
  body: string;
  created_at?: string;
  replies?: Seeded[];
}

/** What one load of the piece leaves behind. */
interface Loaded {
  page: Page;
  thrown: string[];
  logged: string[];
  unreachable: string[];
}

/** One load of the piece, with the thread's endpoint answered
    however the check needs it, and everything the page threw.
    `"broken"` aborts that endpoint instead of answering it. */
const open = async (comments: Seeded[] | "broken"): Promise<Loaded> => {
  const page = await browser.newPage();
  /* Three lists, and keeping them apart is what makes the checks
     below sayable. `thrown` is a real exception, which is always
     the page's fault. `logged` is the console, which is where
     React's hydration complaints appear. `unreachable` is what
     did not load, which in this harness is mostly deliberate. */
  const thrown: string[] = [];
  const logged: string[] = [];
  const unreachable: string[] = [];
  page.on("pageerror", (e: Error) => { thrown.push(e.message); });
  page.on("console", (m: ConsoleMessage) => {
    if (m.type() === "error") logged.push(m.text());
  });
  page.on("requestfailed", (r: Request) => {
    unreachable.push(new URL(r.url()).pathname);
  });
  page.on("response", (r: Response) => {
    if (r.status() >= 400) unreachable.push(new URL(r.url()).pathname);
  });

  /* THE OTHER HALF OF THE SITE, off disk.

     `wrangler dev` here is running the NEXT Worker, and that is
     one of two. `/app.js`, `/read-aloud.js` and every other
     served module live in `aab/`, which the front-door Worker
     answers with `[assets] directory = "./aab"`. Without this the
     page loads and every one of them 404s, and a 404 for a
     `<script type="module">` is not a quiet thing: it is a
     console error per module, and this test would have to ignore
     console errors to pass, which is the one thing it is here to
     notice.

     Registered FIRST, so the endpoint route below takes
     precedence: Playwright tries handlers in reverse. */
  await page.route("**/*", async (route: Route, request: Request) => {
    const path = new URL(request.url()).pathname;
    if (!/^\/[\w./-]+\.\w+$/.test(path) || path.startsWith("/_next/")) {
      return route.fallback();
    }
    try {
      const body = await readFile(join(AAB, path.slice(1)));
      return route.fulfill({
        status: 200,
        contentType: TYPES[extname(path)] ?? "application/octet-stream",
        body,
      });
    } catch { return route.fallback(); }
  });

  /* The webfonts are the one thing on this page that is not this
     site's, and a test that needs Google to answer is a test that
     goes red on somebody else's afternoon. */
  await page.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
  if (comments === "broken") {
    await page.route("**/api/comments*", (r: Route) => r.abort());
  } else if (comments) {
    await page.route("**/api/comments*", (r: Route) => r.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ comments }),
    }));
  }
  await page.goto(URL_, { waitUntil: "load" });
  await page.waitForTimeout(1500);
  return { page, thrown, logged, unreachable };
};

/** What this harness does not answer, and why each one is here.

    THE POINT OF THE LIST is that it is a list. "Ignore the
    console" would pass this file with a genuinely missing module
    on the page, which is the one thing it exists to notice, so
    what is allowed to be missing is named instead and anything
    else fails.

    The first three are the OTHER Worker's: `wrangler dev` is
    running `reiad-next`, and `functions/api/` belongs to the
    front door. Serving `aab/` off disk covers its static half and
    nothing covers its endpoints, which is the boundary of this
    harness and is worth knowing before writing a check that needs
    one. */
const MAY_BE_MISSING = [
  "/api/articles",        // the front door's, for the reading rail
  "/api/auth/me",         // the front door's, so nobody is ever signed in here
  "/api/comments",        // aborted on purpose, in the broken-thread block
  "/css2",                // the webfonts, aborted above
];

/** Anything that failed to load and is not on that list. */
const surprises = (unreachable: string[]): string[] =>
  [...new Set(unreachable)].filter((p) => !MAY_BE_MISSING.includes(p));

/** The errors that mean React adopted markup it did not agree
    with. #418 is the one that blanked every calculator on this
    site for a day, and a client component on a route nothing
    drove is exactly where it would hide next. */
const hydration = (errors: string[]): string[] =>
  errors.filter((e) => /Minified React error|hydrat/i.test(e));

console.log("the article page, in a browser");

/* ---------- 1. the page itself ---------- */

{
  const { page, thrown, logged, unreachable } = await open([]);
  ok("the piece renders", await page.locator("article").count() === 1);
  ok("with its heading", (await page.locator("h1").first().textContent()) === ARTICLE.title);
  /* Not `article p`, which is the dek: the piece opens with a
     `.lede` and a `.byline` before a word of the writing. */
  ok("and its prose",
    (await page.locator("article p:not(.lede):not(.byline)").first().textContent())
      ?.startsWith("One paragraph"));
  ok("nothing hydrates wrongly", hydration(logged).length === 0, hydration(logged)[0]);
  ok("the page throws nothing", thrown.length === 0, thrown.slice(0, 2).join(" | "));
  ok("and everything it asks for is either served or on the list",
    surprises(unreachable).length === 0, surprises(unreachable).join(", "));
  await page.close();
}

/* ---------- 2. the thread, signed out, which is everybody ---------- */

{
  const { page } = await open([]);
  ok("the thread is under the piece", await page.locator("#comments").count() === 1);
  ok("and names itself", (await page.locator(".comment-title").textContent()) === "Comments");
  ok("a piece with no comments says so",
    (await page.locator(".comment-empty").textContent())?.trim() === "No comments yet.");
  ok("signed out draws the invitation",
    await page.locator(".comment-invite").count() === 1);
  ok("and no box, because there is nobody to write as",
    await page.locator(".comment-form").count() === 0);
  ok("the way in is a button rather than a wall",
    (await page.locator(".comment-invite button").textContent())?.trim() === "Sign in");
  await page.close();
}

/* ---------- 3. comments arriving, which no static render shows ---------- */

{
  const { page, logged } = await open([
    {
      id: 1, author_name: "Ayesha Rahman",
      body: "<script>alert('x')</script> & <b>bold</b>",
      created_at: new Date().toISOString(),
      replies: [{ id: 2, author_name: "Rony", body: "under" }],
    },
  ]);

  ok("a comment fetched from the endpoint reaches the page",
    await page.locator(".comment-list > .comment").count() === 1);
  ok("with the writer's name",
    (await page.locator(".comment-list > .comment strong").first().textContent())
      === "Ayesha Rahman");
  ok("and the initial in the little circle",
    (await page.locator(".comment-mark").first().textContent()) === "A");

  /* THE ONE THAT MATTERS, and the one only a browser can ask:
     the static render proves React escaped it, and this proves
     nothing downstream un-escaped it. A body is text on the way
     in, text in the column, and text on the way out. */
  const body = await page.locator(".comment-list > .comment > .comment-body")
    .textContent() ?? "";
  ok("a body that is markup arrives as the words it was",
    body.includes("<script>") && body.includes("<b>bold</b>"), JSON.stringify(body));
  ok("and none of it became an element",
    await page.locator(".comment-body script").count() === 0
    && await page.locator(".comment-body b").count() === 0);

  ok("a reply sits one level down", await page.locator(".comment-replies .comment").count() === 1);
  ok("and offers no Reply of its own, because the endpoint refuses one",
    await page.locator(".comment-reply").count() === 1);
  ok("a thread that fetched still hydrated cleanly",
    hydration(logged).length === 0, hydration(logged)[0]);
  await page.close();
}

/* ---------- 4. and a thread that will not load is silent ---------- */

{
  const { page, thrown, unreachable } = await open("broken");
  ok("a broken thread leaves the piece readable",
    await page.locator("article").count() === 1);
  ok("and the list empty rather than half-drawn",
    await page.locator(".comment-list > .comment").count() === 0);
  ok("and says nothing about it on somebody's reading page",
    await page.locator(".comment-note").count() === 0);
  ok("and throws nothing of its own", thrown.length === 0, thrown.join(" | "));
  ok("the aborted endpoint is the only thing that did not load",
    surprises(unreachable).length === 0, surprises(unreachable).join(", "));
  await page.close();
}

/* ---------- 5. and no account endpoint, which is this harness ----------

   `/api/auth/me` belongs to the front door and nothing here
   answers it, so `/account.js` cannot establish a session. That
   is a limitation and it is also a state a reader can be in: the
   session endpoint being unreachable must leave the thread signed
   out and silent, not half-drawn or thrown. */
{
  const { page, thrown } = await open([]);
  ok("an unreachable account endpoint leaves the thread signed out",
    await page.locator(".comment-invite").count() === 1
    && await page.locator(".comment-form").count() === 0);
  ok("and throws nothing on the way", thrown.length === 0, thrown.join(" | "));
  await page.close();
}

await browser.close();
worker.stop();

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
console.log("The piece reads, the thread fills, a body stays text, and\n"
  + "nothing hydrates wrongly.\n");
process.exit(0);
