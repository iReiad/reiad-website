/* ============================================================
   studio-publish.test.ts: a pasted photo actually reaches /media.

     CHROMIUM_PATH=/path/to/chrome node aab/studio-publish.test.ts

   ---- the bug ----

   A photo pasted into the Studio is held as a `data:` URL until
   publish, when `hostPhotosIn()` reads the bytes back and uploads
   them to R2. It read them with `fetch()`, which is correct,
   obvious, and silently forbidden: **fetching a `data:` URL is
   governed by connect-src, not img-src.** This site's policy says
   `img-src 'self' data:`, so a pasted photo displays perfectly,
   and connect-src never mentioned `data:`, so every read-back was
   refused before it left the browser.

   `hostPhotosIn` catches that, counts a failed upload and leaves
   the photo embedded, which is its designed fallback and looks
   like nothing going wrong. The symptoms surface three removes
   away: R2 stays empty, every article's `cover` stays empty, and
   so every link shared to WhatsApp or LinkedIn shows the site's
   default card. `aab/src/photo.ts` decodes instead, and this file
   is what fails if that is ever "simplified" back to a fetch.

   ---- why a browser and not a check ----

   The failure only exists when the real Content-Security-Policy is
   applied: a static server that sends none passes the broken code.
   So the policy is READ OUT OF `aab/_headers` rather than copied
   here, and the run starts by asking the browser to demonstrate
   both halves of it, so a policy widened to allow `data:` under
   connect-src fails here rather than quietly making this test
   about nothing.

   ---- what it drives ----

   `/studio/index.html` is a Next.js route now, so there is no file
   under `aab/` at that address. Starting Next to get a header and
   a footer would make a test of the upload path depend on a
   renderer that has its own tests, so the server answers that one
   address with the two things the bundle needs: the stylesheet and
   the element it mounts into. Everything below happens inside that
   element. `app/studio.test.ts` does the same for the same reason,
   and links `/fallback.css` for the same reason too: nothing has
   been served at `/styles.css` since the stylesheet moved into
   Next and started carrying a content hash.

   The subject is the BUILT bundle at `/studio/app.js` and the
   served `/photo.js` and `/share-card.js` it imports at runtime.
   Those are what deploy; a test of the TypeScript beside them
   would pass on a stale build.

   A skip here names which way it failed to start, because a skip
   is never a pass. `aab/tsconfig.test.json` typechecks this file
   and `scripts/check-types.ts` runs that config.
   ============================================================ */

import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Browser, BrowserContext, BrowserType, Page, Route } from "playwright";

const AAB = dirname(fileURLToPath(import.meta.url));
const wait = (ms: number): Promise<void> => new Promise((go) => { setTimeout(go, ms); });

/* ---------- Playwright, or a skip that says so ---------- */

/** What `import(spec)` might hand back. The specifier is a variable
    on purpose, so the driver can be found where it is installed,
    and that is exactly what TypeScript cannot resolve: it answers
    `any`, and this is what turns it back into a type. */
interface PlaywrightModule {
  chromium?: BrowserType;
  default?: { chromium?: BrowserType };
}
const isModule = (value: unknown): value is PlaywrightModule =>
  typeof value === "object" && value !== null;

/* Three places, and the third is the one that matters: `playwright`
   is a devDependency of `app/`, which is NOT on the resolution path
   from this directory, so a plain `import("playwright")` skips this
   test on a clone that has it. `aab/tsconfig.test.json` already
   points at that install to typecheck the annotations below, and
   this is the runtime saying the same thing. */
const WHERE = [
  process.env.PLAYWRIGHT,
  "playwright",
  new URL("../app/node_modules/playwright/index.mjs", import.meta.url).href,
].filter((spec): spec is string => Boolean(spec));

let chromium: BrowserType | undefined;
const tried: string[] = [];
for (const spec of WHERE) {
  try {
    const mod: unknown = await import(spec);
    chromium = isModule(mod) ? mod.chromium ?? mod.default?.chromium : undefined;
    if (chromium) break;
  } catch (err) {
    tried.push(`${spec}: ${(err instanceof Error ? err.message : String(err)).split("\n")[0]}`);
  }
}
if (!chromium) {
  console.log("Playwright is not installed anywhere this test can reach, so it is skipped.");
  for (const line of tried) console.log(`  ${line}`);
  console.log("  npm i -D playwright"
    + "   (or: PLAYWRIGHT=/path/to/playwright node aab/studio-publish.test.ts)");
  process.exit(0);
}

/* ---------- the policy the site actually ships ---------- */

const headers = readFileSync(join(AAB, "_headers"), "utf8");
const CSP = headers
  .split("\n")
  .find((l) => l.trim().startsWith("Content-Security-Policy:"))
  ?.split("Content-Security-Policy:")[1]
  ?.trim();

if (!CSP) {
  console.error("No Content-Security-Policy found in aab/_headers.");
  process.exit(1);
}
if (!/connect-src/.test(CSP)) {
  console.error("The policy in aab/_headers has no connect-src, which this test is about.");
  process.exit(1);
}

const directive = (name: string): string =>
  CSP.match(new RegExp(`${name}[^;]*`))?.[0]?.trim() ?? "";

/* ---------- a server that sends it ---------- */

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json",
  ".svg": "image/svg+xml", ".webp": "image/webp", ".png": "image/png",
  ".ico": "image/x-icon", ".xml": "application/xml", ".woff2": "font/woff2",
  ".webmanifest": "application/manifest+json",
};

/* The shell the Vite bundle mounts into, standing in for the route
   at this address. `#studio-root` is the id `main.tsx` looks up and
   `requireOwner()` unhides; `/fallback.css` is the stylesheet at a
   name a hand-written page can know. */
const SHELL = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">`
  + `<meta name="viewport" content="width=device-width, initial-scale=1.0">`
  + `<title>Article Studio</title>`
  + `<link rel="stylesheet" href="/fallback.css">`
  + `<script type="module" crossorigin src="/studio/app.js"></script></head>`
  + `<body><main id="main"><div class="wrap" id="studio-root" hidden></div></main></body></html>`;

const server = createServer((req, res) => {
  const send = (status: number, type: string, data: string | Buffer): void => {
    // Every response carries the real policy, which is the point.
    res.writeHead(status, { "Content-Type": type, "Content-Security-Policy": CSP });
    res.end(data);
  };

  let path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  if (path === "/studio/index.html") { send(200, TYPES[".html"], SHELL); return; }

  const file = join(AAB, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  readFile(file).then(
    (data) => { send(200, TYPES[extname(file)] ?? "application/octet-stream", data); },
    () => { send(404, TYPES[".html"], "not found"); },
  );
});

await new Promise<void>((ready) => { server.listen(0, "127.0.0.1", () => { ready(); }); });
const address = server.address();
if (address === null || typeof address === "string") {
  console.error("The test server took a socket rather than a port, so there is no origin.");
  process.exit(1);
}
const origin = `http://127.0.0.1:${address.port}`;

/* ---------- the harness ---------- */

let failures = 0;
let ran = 0;
const check = (name: string, got: unknown, want: unknown, detail = ""): void => {
  ran += 1;
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`
    + (detail ? `\n       ${detail}` : ""));
};
const okay = (name: string, cond: unknown, detail = ""): void => check(name, !!cond, true, detail);

/* ---------- a browser, or a skip that says so ---------- */

let browser: Browser;
try {
  browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
} catch (err) {
  console.log("No browser to drive, so this test is skipped.");
  console.log(`  ${(err instanceof Error ? err.message : String(err)).split("\n")[0]}`);
  console.log("  npx playwright install chromium"
    + "   (or: CHROMIUM_PATH=/path/to/chrome node aab/studio-publish.test.ts)");
  server.close();
  process.exit(0);
}

const ctx: BrowserContext = await browser.newContext({
  viewport: { width: 1400, height: 1000 },
  // The service worker would answer with its own precached copies
  // of the site's modules, which is the wrong thing to test and a
  // confusing way to find that out.
  serviceWorkers: "block",
});

/* ============================================================
   0. THE POLICY ITSELF

   Both halves of the bug, asked of the browser rather than
   assumed. If connect-src is ever widened to include `data:`,
   the second of these fails and says so, because widening the
   policy is the fix `photo.ts` exists to refuse.
   ============================================================ */

console.log("a photo, from the editor to /media, under the real policy");
console.log(`  (${directive("img-src").slice(0, 60)})`);
console.log(`  (${directive("connect-src").slice(0, 76)}…)`);

okay("the shipped policy allows data: under img-src", /img-src[^;]*\bdata:/.test(CSP),
  directive("img-src"));
okay("and does not allow it under connect-src", !/connect-src[^;]*\bdata:/.test(CSP),
  directive("connect-src"));

{
  /* Its own page, so its refusal does not land in the publish
     page's console log below. A 1x1 GIF: the smallest thing that
     is both a valid image and a data: URL. */
  const probe = await ctx.newPage();
  await probe.goto(`${origin}/404.html`, { waitUntil: "domcontentloaded" });
  const policy = await probe.evaluate(async () => {
    const url = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const shown = await new Promise<boolean>((res) => {
      const img = new Image();
      img.onload = () => { res(true); };
      img.onerror = () => { res(false); };
      img.src = url;
    });
    try {
      await fetch(url);
      return { shown, fetched: true, why: "" };
    } catch (err) {
      return { shown, fetched: false, why: err instanceof Error ? err.message : String(err) };
    }
  });
  await probe.close();

  okay("the browser displays a data: URL under it, so a pasted photo looks fine",
    policy.shown);
  check("and refuses to fetch one, which is the whole bug", policy.fetched, false,
    "connect-src has been widened: photo.ts decodes on purpose so it need not be");
  okay("the refusal is what the browser reports, not a missing feature",
    policy.fetched || policy.why.length > 0, policy.why);
}

/* ============================================================
   THE FIXTURE BACKEND

   Answering the way the real Worker does, because a fixture that
   is kinder than the endpoint hides the failure the endpoint
   would give. `functions/api/media/[[key]].js` is the original:
   a key is `<slug>/<content-hash>.<ext>`, an unsupported
   Content-Type is a 415, and the same bytes twice write once.
   ============================================================ */

/** One object as R2 holds it. */
interface Held { buf: Buffer; type: string }

/** One POST to /api/media, as the Worker saw it. */
interface Upload { key: string; slug: string; bytes: number; type: string; deduplicated: boolean }

/** What the article endpoint was sent, which is the whole point:
    a body with no `data:` left in it and a cover that is a drawn
    card. */
interface Posted {
  slug?: string;
  title?: string;
  status?: string;
  overwrite?: boolean;
  body?: string;
  cover?: string;
}

const EXT: Record<string, string> = {
  "image/webp": "webp", "image/jpeg": "jpg", "image/png": "png",
  "image/gif": "gif", "image/avif": "avif",
};

const extFor = (type: string): string | undefined =>
  EXT[type.split(";")[0].trim().toLowerCase()];
const safeSlug = (value: string): string =>
  value.slice(0, 80).toLowerCase().replace(/[^a-z0-9-]/g, "") || "loose";
const contentHash = (buf: Buffer): string =>
  createHash("sha256").update(buf).digest("hex").slice(0, 16);

const blocked: string[] = [];
const swallowed: string[] = [];
const threw: string[] = [];
const uploads: Upload[] = [];
const store = new Map<string, Held>();
const articles: Posted[] = [];

/* What R2 would serve back, so the share card can really be drawn
   from the photo that was just uploaded. Registered before the
   /api/ route and guarded by hand as well: Playwright checks the
   last route first, and `/api/media` must not fall in here. */
await ctx.route("**/media/**", async (route: Route) => {
  const path = new URL(route.request().url()).pathname;
  if (path.startsWith("/api/")) { await route.fallback(); return; }
  const hit = store.get(path);
  await (hit
    ? route.fulfill({ status: 200, contentType: hit.type, body: hit.buf })
    : route.fulfill({ status: 404, contentType: "text/plain", body: "not found" }));
});

await ctx.route("**/api/**", async (route: Route) => {
  const req = route.request();
  const url = new URL(req.url());
  const path = url.pathname.replace(/^\/api\//, "");
  const json = (o: unknown, status = 200): Promise<void> => route.fulfill({
    status, contentType: "application/json", body: JSON.stringify(o),
  });

  // A server session is what unlocks publishing, and requireOwner()
  // resolves without drawing the gate when it gets one.
  if (path.startsWith("auth")) { await json({ ok: true, signedIn: true, configured: true }); return; }

  if (path.startsWith("media")) {
    if (req.method() !== "POST") { await json({ ok: true, media: [], bytes: 0 }); return; }

    const type = req.headers()["content-type"] ?? "";
    const ext = extFor(type);
    // The real endpoint refuses anything that is not one of five
    // image types, so a re-encode that starts emitting PNG fails
    // here rather than passing.
    if (!ext) { await json({ ok: false, reason: "unsupported-type", accepts: Object.keys(EXT) }, 415); return; }

    const buf = req.postDataBuffer() ?? Buffer.alloc(0);
    if (!buf.length) { await json({ ok: false, reason: "empty-body" }, 400); return; }

    const slug = safeSlug(url.searchParams.get("slug") ?? "");
    const key = `${slug}/${contentHash(buf)}.${ext}`;
    const deduplicated = store.has(`/media/${key}`);
    if (!deduplicated) store.set(`/media/${key}`, { buf, type: type.split(";")[0].trim() });
    uploads.push({ key, slug, bytes: buf.length, type, deduplicated });
    await json({ ok: true, key, url: `/media/${key}`, size: buf.length, deduplicated });
    return;
  }

  if (path.startsWith("articles")) {
    if (req.method() === "POST") {
      const body: Posted = JSON.parse(req.postData() ?? "{}");
      articles.push(body);
      await json({ ok: true, article: body, replaced: false });
      return;
    }
    // What the Studio reads back to know which file names are taken.
    await json({ ok: true, articles: articles.map((a) => ({ ...a, body: undefined })) });
    return;
  }

  await json({ ok: true });
});

const page: Page = await ctx.newPage();
page.on("pageerror", (e) => { threw.push(e.message); });
page.on("console", (m) => {
  const text = m.text();
  if (/Refused to (connect|load)|violates the following Content Security Policy/.test(text)) {
    blocked.push(text.slice(0, 160));
  }
  // The fallback that hides the bug: hostPhotosIn() and publish()
  // both catch, count and carry on, so this is the fingerprint the
  // symptoms are three removes away from.
  if (/photo upload failed|share card failed/.test(text)) swallowed.push(text.slice(0, 160));
});

/* ============================================================
   1. THE PUBLISH
   ============================================================ */

await page.goto(`${origin}/studio/index.html`, { waitUntil: "domcontentloaded" });
await page.waitForSelector("#editor", { timeout: 20_000 });
await page.waitForSelector("#btn-publish", { timeout: 20_000 });
await wait(300);

// A WebP the browser encodes itself, so the fixture is certainly a
// valid one and certainly arrives the way a pasted photo does.
const photo = await page.evaluate(async () => {
  const c = new OffscreenCanvas(600, 400);
  const g = c.getContext("2d")!;
  g.fillStyle = "#0B3D2E"; g.fillRect(0, 0, 600, 400);
  g.fillStyle = "#D4A24C"; g.fillRect(40, 40, 200, 120);
  const blob = await c.convertToBlob({ type: "image/webp", quality: 0.9 });
  return new Promise<string>((res) => {
    const fr = new FileReader();
    fr.onload = () => { res(String(fr.result)); };
    fr.readAsDataURL(blob);
  });
});

okay("the fixture is a data: URL, the way a pasted photo arrives",
  photo.startsWith("data:image/webp"));

await page.evaluate((src) => {
  const ed = document.querySelector("#editor");
  if (!ed) throw new Error("there is no #editor");
  ed.innerHTML = `<p>Before.</p><figure><img src="${src}" alt="a photo" width="600" height="400">`
    + `<figcaption>A caption</figcaption></figure><p>After.</p>`;
  ed.dispatchEvent(new Event("input", { bubbles: true }));
}, photo);

for (const [sel, value] of [
  ["#f-title", "Publish path test"],
  ["#f-slug", "publish-path-test"],
  ["#f-dek", "Checking that photos reach /media."],
]) {
  await page.fill(sel, value);
}
await wait(600);

okay("the editor is holding the photo as a data: URL",
  (await page.locator('#editor img[src^="data:"]').count()) === 1);
okay("and the Studio will publish, so the run is about the upload",
  !(await page.locator("#btn-publish").isDisabled()));

await page.click("#btn-publish");

/* Polled rather than slept through. A blind wait passes a publish
   that never happened as long as it fails quietly, which is
   exactly the shape of the bug this file is about. */
const finished = await (async (): Promise<boolean> => {
  const stop = Date.now() + 20_000;
  while (Date.now() < stop) {
    if (articles.length > 0) { await wait(400); return true; }
    await wait(100);
  }
  return false;
})();

okay("the article was sent at all", finished,
  `uploads so far: ${JSON.stringify(uploads)}`);

/* ---------- what must be true ---------- */

okay("nothing was refused by the policy", blocked.length === 0, blocked.slice(0, 2).join(" | "));
okay("and nothing was refused that names a data: URL, which is the bug",
  !blocked.some((b) => /data:/.test(b)), blocked.find((b) => /data:/.test(b)) ?? "");
okay("no photo upload was caught and swallowed", swallowed.length === 0,
  swallowed.slice(0, 2).join(" | "));

const posted: Posted = articles[0] ?? {};
const body = posted.body ?? "";

check("the piece went out under the file name it was given", posted.slug, "publish-path-test");
check("as the live piece the button says it is", posted.status, "live");
check("no data: URL survives into the database", (body.match(/src="data:/g) ?? []).length, 0);
check("the photo is a /media path instead", (body.match(/src="\/media\//g) ?? []).length, 1);
check("and it is the path the upload answered with",
  body.match(/src="(\/media\/[^"]+)"/)?.[1], uploads[0] ? `/media/${uploads[0].key}` : "no upload");
okay("the img carries the size it was re-encoded at",
  /<img[^>]+width="600"[^>]+height="400"/.test(body), body.slice(0, 200));
okay("and the loading hints hostPhotosIn sets", /<img[^>]+loading="lazy"/.test(body));
okay("a cover was set", !!posted.cover, JSON.stringify(posted.cover));
check("and the cover is a drawn card, not the raw photo",
  /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(posted.cover ?? ""), true,
  `cover: ${JSON.stringify(posted.cover)}`);

check("two uploads: the photo, then the card", uploads.length, 2,
  uploads.map((u) => `${u.key} ${u.type}`).join(" | "));
okay("the first is the photo, as WebP", uploads[0]?.type?.includes("webp"), uploads[0]?.type);
check("filed under the piece's own slug", uploads[0]?.slug, "publish-path-test");
okay("the second is the share card, as JPEG", uploads[1]?.type?.includes("jpeg"), uploads[1]?.type);
check("filed under the card's slug, which is how one is told from a photo",
  uploads[1]?.slug, "publish-path-test-card");
okay("the card has real bytes in it", (uploads[1]?.bytes ?? 0) > 1000, String(uploads[1]?.bytes));

/* The data: URL is base64 text. If a regression ever uploaded the
   src rather than the decoded bytes, every check above could still
   pass and R2 would hold a text file with an image content type. */
okay("neither upload carried the data: URL as text",
  !uploads.some((u) => store.get(`/media/${u.key}`)?.buf.subarray(0, 64)
    .toString("latin1").startsWith("data:")));

/* Drawn, not passed through: only share-card.js makes a 1200x630
   JPEG, and a cover that is really the photo re-uploaded would be
   600x400 here and pass a check that only looked at the extension. */
const cardSize = await page.evaluate(async (url) => {
  const res = await fetch(url, { credentials: "same-origin" });
  const bitmap = await createImageBitmap(await res.blob());
  const size = { w: bitmap.width, h: bitmap.height };
  bitmap.close();
  return size;
}, posted.cover ?? "/media/none");
check("the card really is 1200x630, so it was drawn rather than copied",
  cardSize, { w: 1200, h: 630 });

const photoSize = await page.evaluate(async (url) => {
  const res = await fetch(url, { credentials: "same-origin" });
  const bitmap = await createImageBitmap(await res.blob());
  const size = { w: bitmap.width, h: bitmap.height };
  bitmap.close();
  return size;
}, body.match(/src="(\/media\/[^"]+)"/)?.[1] ?? "/media/none");
check("and the stored photo decodes as the picture that was pasted",
  photoSize, { w: 600, h: 400 });

/* ============================================================
   2. PUBLISHING IT AGAIN

   The rewritten body goes back into the editor so the next save
   does not re-upload the same photos, and `isHosted()` is what
   stops it. It is also the one place a legitimate fetch happens:
   share-card.js reads the photo back from `/media/`, which
   connect-src 'self' allows and a data: URL is not.
   ============================================================ */

okay("the rewritten body went back into the editor",
  (await page.locator('#editor img[src^="/media/"]').count()) === 1
  && (await page.locator('#editor img[src^="data:"]').count()) === 0);

const uploadsBefore = uploads.length;
await page.click("#btn-publish");
const publishedAgain = await (async (): Promise<boolean> => {
  const stop = Date.now() + 20_000;
  while (Date.now() < stop) {
    if (articles.length > 1) { await wait(400); return true; }
    await wait(100);
  }
  return false;
})();

okay("it publishes a second time", publishedAgain);

const again: Posted = articles[1] ?? {};
check("the photo is not uploaded twice",
  uploads.filter((u) => u.slug === "publish-path-test").length, 1,
  uploads.map((u) => u.slug).join(" | "));
okay("the card is drawn again, from /media, which connect-src 'self' allows",
  uploads.length > uploadsBefore, `${uploadsBefore} then ${uploads.length}`);
check("and the second copy of the card is the same bytes, so nothing new is stored",
  uploads[uploads.length - 1]?.deduplicated, true);
check("the body still points at the one hosted photo",
  (again.body?.match(/src="\/media\//g) ?? []).length, 1);
check("with no data: URL back in it", (again.body?.match(/src="data:/g) ?? []).length, 0);
okay("and it says it is replacing the piece it just made", again.overwrite === true);

okay("nothing was refused by the policy on the second pass", blocked.length === 0,
  blocked.slice(0, 2).join(" | "));
okay("nothing threw", threw.length === 0, threw.slice(0, 3).join(" | "));

await browser.close();
server.close();

console.log(failures
  ? `\n${failures} failure(s) out of ${ran}`
  : `\nall good, ${ran} checks: a pasted photo reaches R2 and a card gets drawn`);
process.exit(failures ? 1 : 0);
