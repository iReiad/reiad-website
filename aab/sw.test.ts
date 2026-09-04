/* sw.test.ts: the one file whose name never changes.

   Every script here is kept current by its URL: a Next chunk
   carries a content hash, and a served module is in `PRECACHE`,
   where `scripts/check-sw.ts` fails if its bytes change without
   `VERSION` moving. `/studio/app.js` is NEITHER. It is built to
   one file at a STABLE PATH so `sw.js` and the route that loads
   it keep naming something real, and at 232 KB precaching it
   would cost a quarter of a megabyte to every reader who never
   opens the Studio.

   That leaves it on stale-while-revalidate, which for a file that
   never changes name means THE STUDIO IS ALWAYS ONE BUILD
   BEHIND. Nothing that reads files can see it: the bytes are
   right and the worker is right about the rule it applies.

   So this serves the real `sw.js` with two scripts beside it,
   installs it, fetches both, changes both on the server and
   fetches again. The Studio's bundle has to come back NEW and an
   ordinary script has to come back STALE, because a test that
   could not tell them apart would pass with the worker deleted.

   Needs Playwright and a browser; says so and skips without,
   which is not a pass. */

import { createServer, type Server } from "node:http";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 8977;

/** Says why, and does not come back. Annotated ON THE CONST
    rather than only on the arrow, which is what makes TypeScript
    narrow after a call: the same shape `next/hydrate-fixture.ts`
    uses, and for the same reason. */
const skip: (why: string) => never = (why) => {
  console.log(`SKIPPED: ${why}`);
  console.log("A skip is not a pass.\n");
  process.exit(0);
};

/* The runtime import is a real path on disk; `aab/tsconfig.test.json`
   maps the types. `article.test.ts` says the rest. */
const PLAYWRIGHT = "../app/node_modules/playwright/index.mjs";
const playwright = await import(PLAYWRIGHT)
  .then((m) => m as typeof import("playwright"), () => null);
if (!playwright) {
  skip("playwright is not installed. It is a devDependency of app/: "
    + "`cd app && npm install`.");
}

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
let browserPath = process.env.CHROMIUM_PATH ?? "";
if (!browserPath) {
  try { readFileSync(CHROME); browserPath = CHROME; } catch { /* look below */ }
}
if (!browserPath) {
  try { playwright.chromium.executablePath(); } catch {
    skip("no browser. Point CHROMIUM_PATH at one, or `npx playwright install chromium`.");
  }
}

/* ---------- the server, whose files change underneath ---------- */

const sw = readFileSync(join(here, "sw.js"), "utf8");

/** What each address currently answers with. Mutable on purpose:
    changing an entry between two fetches is the whole experiment. */
const body: Record<string, string> = {
  "/studio/app.js": "export const build = 1;",
  "/plain.js": "export const build = 1;",
};

const TYPE: Record<string, string> = {
  "/sw.js": "text/javascript; charset=utf-8",
  "/studio/app.js": "text/javascript; charset=utf-8",
  "/plain.js": "text/javascript; charset=utf-8",
};

const PAGE = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">`
  + `<title>sw</title></head><body><p>worker</p></body></html>`;

const server: Server = createServer((req, res) => {
  const path = new URL(req.url ?? "/", "http://x").pathname;
  if (path === "/sw.js") {
    /* No-store, so the browser's own HTTP cache is never the
       thing answering: this test is about the service worker. */
    res.writeHead(200, { "Content-Type": TYPE[path], "Cache-Control": "no-store" });
    res.end(sw); return;
  }
  if (path in body) {
    res.writeHead(200, { "Content-Type": TYPE[path], "Cache-Control": "no-store" });
    res.end(body[path]); return;
  }
  if (path === "/" || path.endsWith(".html")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8",
                         "Cache-Control": "no-store" });
    res.end(PAGE); return;
  }
  /* Everything the worker precaches and this server does not have.
     `install` uses allSettled, so a 404 costs that entry and not
     the install. */
  res.writeHead(404, { "Content-Type": "text/plain" }).end("no");
});
await new Promise<void>((resolve) => server.listen(PORT, resolve));
const origin = `http://localhost:${PORT}`;

let passed = 0;
const failures: string[] = [];
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed += 1; return; }
  failures.push(name + (detail ? `\n      ${detail}` : ""));
};

const browser = await playwright.chromium.launch(
  browserPath ? { executablePath: browserPath } : {});
const page = await browser.newPage();

console.log("\nthe worker, with the files changing underneath it\n");

await page.goto(`${origin}/`, { waitUntil: "load" });

/* Register and wait for control. `controller` is null until the
   worker has claimed the page, and a fetch made before that never
   reaches the worker at all: the test would pass on every branch. */
const controlled = await page.evaluate(async (): Promise<boolean> => {
  const reg = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;
  if (navigator.serviceWorker.controller) return true;
  await new Promise<void>((done) => {
    navigator.serviceWorker.addEventListener("controllerchange", () => done(),
      { once: true });
    /* `clients.claim()` runs on activate, so this normally fires
       at once. Two seconds is a long time for it not to. */
    setTimeout(done, 2000);
  });
  void reg;
  return navigator.serviceWorker.controller !== null;
});
ok("the worker installs and takes the page over", controlled,
  "no controller after registering and waiting");

if (!controlled) {
  console.log(`${passed} checks passed`);
  for (const f of failures) console.log("  x " + f);
  await browser.close();
  await new Promise<void>((r) => server.close(() => r()));
  process.exit(1);
}

/** Fetch through the worker and hand back the text. */
const get = (path: string): Promise<string> =>
  page.evaluate((p) => fetch(p, { cache: "no-store" }).then((r) => r.text()), path);

const first = { studio: await get("/studio/app.js"), plain: await get("/plain.js") };
ok("the Studio bundle answers at all", first.studio.includes("build = 1"), first.studio);
ok("an ordinary script answers at all", first.plain.includes("build = 1"), first.plain);

/* A moment for the revalidate half to write both into RUNTIME,
   so the second round is answered by a cache that really has
   something in it. Without this the ordinary script would come
   back new and the test would pass for the wrong reason. */
await page.waitForTimeout(400);

/* The deploy. */
body["/studio/app.js"] = "export const build = 2;";
body["/plain.js"] = "export const build = 2;";

const second = { studio: await get("/studio/app.js"), plain: await get("/plain.js") };

ok("the Studio bundle is the new build on the very next load",
  second.studio.includes("build = 2"),
  `got ${JSON.stringify(second.studio)}. It is network first because its `
  + "address never changes; if this is build 1 the STABLE_BUNDLE branch is gone.");

ok("an ordinary script is still answered from the cache first",
  second.plain.includes("build = 1"),
  `got ${JSON.stringify(second.plain)}. If this is build 2 the worker is not `
  + "caching at all, and the check above passes without meaning anything.");

/* And the third load of the ordinary script IS new, which is the
   revalidate half doing its job: stale-while-revalidate, not
   stale-for-ever. */
await page.waitForTimeout(400);
const third = await get("/plain.js");
ok("and is refreshed for the load after that", third.includes("build = 2"),
  `got ${JSON.stringify(third)}`);

console.log(`${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log("  x " + f);
}
console.log(failures.length
  ? ""
  : "A stable-path bundle is never a build behind, and everything else"
    + " is still cached.\n");

await browser.close();
await new Promise<void>((r) => server.close(() => r()));
process.exit(failures.length ? 1 : 0);
