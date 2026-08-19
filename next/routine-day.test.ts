/* ============================================================
   routine-day.test.ts: the day, in a browser, signed in.

       node next/routine-day.test.ts

   Needs the Next build and a browser. Without either it says
   which and skips, and a skip is not a pass.

   `scripts/routine.test.ts` is the arithmetic and it runs
   everywhere. This is the half that only a browser can settle,
   and it is the half where the promises live:

     that pressing a task marks it AND reaches the database,
     that pressing three times is full, half, nothing,
     that an empty day says so in WORDS and never as a zero,
     and that nothing on the page is red.

   The last two are `ROUTINE.md` §8 as a rendered page rather
   than as a function, which is the only way to know: `done()`
   answering null is not the same claim as a reader never seeing
   a nought.

   ---- why the database is routed rather than mocked ----

   The component reaches Supabase through `/routine.js`, which is
   a real module resolved at run time against whatever origin the
   page came from. So the route below IS the database as far as
   the page is concerned: no injection, no stub passed in as a
   prop, and the component under test is the one the route ships.
   `next/account.test.ts` makes the same argument at more length.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { dirname, join, extname } from "node:path";
import { fileURLToPath } from "node:url";
import type { BrowserContext, Route } from "playwright";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BUILD = join(ROOT, "next", ".next");
const PORT = 8412;
const SUPA = "https://wvjarqnnmkkuxyrndtya.supabase.co";

/** Says why, and does not come back. */
const skip: (why: string) => never = (why) => {
  console.log(`routine-day: SKIPPED, ${why}`);
  process.exit(0);
};

const exists = (path: string): Promise<boolean> => stat(path).then(() => true, () => false);

if (!await exists(join(BUILD, "server/app/index.html"))) {
  skip("next/.next holds no prerendered pages. Run `npx next build` in next/ first.");
}

const browserPath = process.env.CHROMIUM_PATH
  || (await exists("/opt/pw-browsers/chromium-1194/chrome-linux/chrome")
    ? "/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
    : null);

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

/* ---- a signed-in session ---- */

const b64 = (o: unknown) => Buffer.from(JSON.stringify(o)).toString("base64url");
const ME = "u-1";
const jwt = [b64({ alg: "HS256" }),
  b64({ sub: ME, email: "s@reiad.co.uk", exp: Math.floor(Date.now() / 1000) + 3600,
        user_metadata: { full_name: "Sadia" } }), "s"].join(".");
const session = JSON.stringify({
  access_token: jwt, refresh_token: "r", expires_at: Date.now() + 3600e3,
  user: { id: ME, email: "s@reiad.co.uk", name: "Sadia", avatar: "" },
});

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".woff2": "font/woff2", ".svg": "image/svg+xml",
};
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  const tries = [
    join(BUILD, "server/app", `${path}.html`),
    join(BUILD, "server/app", path, "index.html"),
    join(BUILD, "../../aab", path.replace(/^\//, "")),
    join(BUILD, "static", path.replace(/^\/_next\/static\//, "")),
    join(BUILD, path.replace(/^\/_next\//, "")),
  ];
  for (const f of tries) {
    try {
      const data = await readFile(f);
      res.writeHead(200, { "Content-Type": TYPES[extname(f)] ?? "application/octet-stream" });
      res.end(data); return;
    } catch { /* next */ }
  }
  res.writeHead(404).end("nf");
});
await new Promise<void>((r) => { server.listen(PORT, () => r()); });

const browser = await chromium.launch({
  ...(browserPath ? { executablePath: browserPath } : {}),
});
const ctx: BrowserContext = await browser.newContext({ serviceWorkers: "block" });

/* The database, as the policies would answer it. */
let routine: Record<string, unknown> | null = null;
const entries = new Map<string, Record<string, unknown>>();
const sent: string[] = [];
await ctx.route(`${SUPA}/rest/v1/**`, async (route: Route) => {
  const req = route.request();
  const url = new URL(req.url());
  const table = url.pathname.split("/").pop() ?? "";
  const json = (p: unknown, status = 200) =>
    route.fulfill({ status, contentType: "application/json", body: JSON.stringify(p) });
  const body = req.postData() ? JSON.parse(req.postData() as string) : null;
  if (req.method() !== "GET") sent.push(`${req.method()} ${table}`);

  if (table === "profiles") return json([{ display_name: "Sadia", routine_locale: "both", routine_day_roll: 4 }]);
  if (table === "routines") {
    if (req.method() === "POST") {
      routine = { id: "r-1", ...(Array.isArray(body) ? body[0] : {}) };
      return json([routine], 201);
    }
    return json(routine ? [routine] : []);
  }
  if (table === "routine_entries") {
    if (req.method() === "POST") {
      const row = { id: "e-1", ...(Array.isArray(body) ? body[0] : {}) };
      entries.set(String(row.entry_date), row);
      return json([row], 201);
    }
    const want = (url.searchParams.get("entry_date") ?? "").replace("eq.", "");
    const row = entries.get(want);
    return json(row ? [row] : []);
  }
  return json([]);
});

await ctx.route("https://fonts.googleapis.com/**", (r: Route) => r.abort());
const page = await ctx.newPage();
const errors: string[] = [];
page.on("pageerror", (e: Error) => errors.push(e.message));
await page.addInitScript((who: string) => localStorage.setItem("reiad-session", who), session);
await page.goto(`http://localhost:${PORT}/tools/routine`, { waitUntil: "load" });
await page.waitForTimeout(2500);

let pass = 0; const fail: string[] = [];
const ok = (n: string, c: unknown, d = "") => { if (c) pass++; else fail.push(d ? `${n}: ${d}` : n); };

ok("a routine was made on first visit", routine !== null);
const tasks = await page.locator(".rt-mark").count();
ok("the day lists the tasks", tasks === 6, String(tasks));
const figure = (await page.locator(".rt-figure").textContent()) ?? "";
ok("an empty day says so rather than showing a zero",
  figure.includes("খালি") && !figure.includes("0"), JSON.stringify(figure));

/* Mark one. */
await page.locator(".rt-mark").first().click();
await page.waitForTimeout(900);
ok("pressing marks it", await page.locator('.rt-mark[data-state="1"]').count() === 1);
ok("and it reaches the database", sent.some((s) => s.startsWith("POST routine_entries")), sent.join(","));
const after = (await page.locator(".rt-figure").textContent()) ?? "";
ok("and now there is a figure", /[0-9০-৯]/.test(after), JSON.stringify(after));

/* Press again: full to half. */
await page.locator(".rt-mark").first().click();
await page.waitForTimeout(700);
ok("pressing again is a half", await page.locator('.rt-mark[data-state="0.5"]').count() === 1);
await page.locator(".rt-mark").first().click();
await page.waitForTimeout(700);
ok("and again is nothing", await page.locator('.rt-mark[data-state="0"]').count() === 6);
const back = (await page.locator(".rt-figure").textContent()) ?? "";
ok("and the figure goes back to words, never to zero",
  back.includes("খালি"), JSON.stringify(back));

/* Nothing red anywhere. */
const reds = await page.evaluate(() => [...document.querySelectorAll(".rt-day *")]
  .filter((el) => {
    const c = getComputedStyle(el).color;
    const m = /rgba?\((\d+),\s*(\d+),\s*(\d+)/.exec(c);
    return m ? Number(m[1]) > 150 && Number(m[2]) < 80 && Number(m[3]) < 80 : false;
  }).length);
ok("nothing on the page is red", reds === 0, String(reds));

ok("no page errors", errors.length === 0, errors[0] ?? "");

await browser.close();
server.close();

if (fail.length) {
  console.log(`\n${pass} checks passed\n${fail.length} failed:\n`);
  for (const f of fail) console.log(`  x ${f}`);
  process.exit(1);
}
console.log(`\nroutine-day: ${pass} checks, a day marks and saves, three presses are`);
console.log("full, half and nothing, an empty day says so in words, and nothing is red.");
