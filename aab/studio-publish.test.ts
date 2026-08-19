/* ============================================================
   studio-publish.test.ts: a photo actually reaches /media.

     node aab/studio-publish.test.ts

   This exists because of a bug that no amount of reading the code
   would have found, and that every check in this repository
   passed straight through.

   ---- what happened ----

   A photo pasted into the Studio is held as a `data:` URL until
   publish, when hostPhotos() reads the bytes back and uploads them
   to R2. It read them with fetch(), which is correct, obvious, and
   silently forbidden: **fetching a `data:` URL is governed by
   connect-src, not img-src.** This site's policy says
   `img-src 'self' data:`, so pasted photos displayed perfectly,
   and connect-src never mentioned `data:`, so every read-back was
   blocked before it left the browser.

   hostPhotos caught the failure, counted it, and left the photo
   embedded, which is its designed fallback and looks like nothing
   going wrong at all. The symptoms surfaced three removes away:
   R2 stayed empty, every article's `cover` stayed empty, and so
   every link shared to WhatsApp or LinkedIn showed the site's
   default card instead of the piece's own photo. Three separate
   complaints, one missing token in one header.

   ---- why this is a browser test and not a check ----

   The failure only exists when the real Content-Security-Policy is
   applied. A local `python -m http.server` sends no CSP, so the
   same code passes there and fails in production. So this test
   serves `aab/` with the CSP **read out of `aab/_headers`**, which
   means it keeps testing the policy the site actually ships rather
   than a copy of it that can drift.

   Skips itself, loudly, if Playwright is not installed.

   `aab/tsconfig.test.json` is what typechecks the annotations
   below, and `scripts/check-types.ts` runs it. A `!` inside a
   `page.evaluate` callback is the repo's usual "this element is in
   the markup": the callback runs in the browser and cannot reach a
   helper out here.
   ============================================================ */

import { createServer } from "node:http";
import { readFile, readFileSync } from "node:fs";
import { extname, join, dirname, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const aab = dirname(fileURLToPath(import.meta.url));

let chromium: typeof import("playwright").chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("Playwright is not installed, so this test is skipped.");
  console.log("  npm i -D playwright   (then it runs as part of the suite)");
  process.exit(0);
}

/* ---------- the policy the site actually ships ---------- */

const headers = readFileSync(join(aab, "_headers"), "utf8");
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

/* ---------- a server that sends it ---------- */

const TYPES: Record<string, string> = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".svg": "image/svg+xml", ".webp": "image/webp",
  ".ico": "image/x-icon", ".xml": "application/xml", ".woff2": "font/woff2",
};

const server = createServer((req, res) => {
  let path = decodeURIComponent(new URL(String(req.url), "http://x").pathname);
  if (path.endsWith("/")) path += "index.html";
  const file = join(aab, normalize(path).replace(/^(\.\.[/\\])+/, ""));
  readFile(file, (err, data) => {
    if (err) { res.writeHead(404).end("not found"); return; }
    res.writeHead(200, {
      "Content-Type": TYPES[extname(file)] ?? "application/octet-stream",
      "Content-Security-Policy": CSP,
    });
    res.end(data);
  });
});

await new Promise<void>((r) => { server.listen(0, () => r()); });
const address = server.address();
if (address === null || typeof address === "string") {
  console.error("The test server took a socket rather than a port, so there is no origin.");
  process.exit(1);
}
const origin = `http://localhost:${address.port}`;

/* ---------- the run ---------- */

let failures = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  if (JSON.stringify(got) === JSON.stringify(want)) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       got  ${JSON.stringify(got)}\n       want ${JSON.stringify(want)}`);
};
const okay = (name: string, cond: unknown): void => check(name, !!cond, true);

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});
const ctx = await browser.newContext({ viewport: { width: 1400, height: 1000 }, serviceWorkers: "block" });
const page = await ctx.newPage();

/** One file as R2 would hand it back. */
interface Held {
  buf: Buffer;
  type: string;
}

/** What the article endpoint was sent, which is the whole point:
    a body with no `data:` left in it and a cover that is a drawn
    card. */
interface Posted {
  body?: string;
  cover?: string;
}

const blocked: string[] = [];
const uploads: Array<{ key: string; bytes: number; type: string }> = [];
const store = new Map<string, Held>();
/* Declared rather than initialised, and that is not a style
   choice: a `let` only a callback ever writes stays narrowed to
   the value it was given here, so `if (posted)` below would be
   reading a type that can hold nothing. */
let posted: Posted | undefined;

page.on("console", (m) => {
  const text = m.text();
  if (/Refused to connect|violates the following Content Security Policy/.test(text)) {
    blocked.push(text.slice(0, 120));
  }
});

// What R2 would serve back, so the share card can actually be drawn.
await ctx.route("**/media/**", (route) => {
  const hit = store.get(new URL(route.request().url()).pathname);
  return hit
    ? route.fulfill({ status: 200, contentType: hit.type, body: hit.buf })
    : route.fulfill({ status: 404, body: "no" });
});

await ctx.route("**/api/**", (route) => {
  const req = route.request();
  const path = new URL(req.url()).pathname.replace("/api/", "");
  const json = (o: unknown) => route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(o) });

  if (path.startsWith("auth")) return json({ ok: true, signedIn: true, configured: true });

  if (path.startsWith("media")) {
    if (req.method() !== "POST") return json({ ok: true, objects: [] });
    const buf = req.postDataBuffer() ?? Buffer.alloc(0);
    const type = req.headers()["content-type"] ?? "";
    const key = `t/${uploads.length + 1}.${type.includes("jpeg") ? "jpg" : "webp"}`;
    uploads.push({ key, bytes: buf.length, type });
    store.set(`/media/${key}`, { buf, type });
    return json({ ok: true, url: `/media/${key}`, key });
  }

  if (path.startsWith("articles")) {
    if (req.method() === "POST") { posted = JSON.parse(String(req.postData())); return json({ ok: true, article: posted }); }
    return json({ ok: true, articles: [] });
  }
  return json({ ok: true });
});

console.log("a photo, from the editor to /media, under the real policy");
console.log(`  (connect-src: ${CSP.match(/connect-src[^;]*/)?.[0].slice(0, 76)}…)`);

await page.goto(`${origin}/studio/index.html`, { waitUntil: "domcontentloaded" });
await page.waitForTimeout(1200);

// A WebP the browser encodes itself, so the fixture is certainly valid.
const photo = await page.evaluate(async () => {
  const c = new OffscreenCanvas(600, 400);
  const g = c.getContext("2d")!;
  g.fillStyle = "#0B3D2E"; g.fillRect(0, 0, 600, 400);
  g.fillStyle = "#D4A24C"; g.fillRect(40, 40, 200, 120);
  const blob = await c.convertToBlob({ type: "image/webp", quality: 0.9 });
  return new Promise<string>((res) => { const fr = new FileReader(); fr.onload = () => res(String(fr.result)); fr.readAsDataURL(blob); });
});

okay("the fixture is a data: URL, the way a pasted photo arrives", photo.startsWith("data:image/webp"));

await page.evaluate((src) => {
  const ed = (document.querySelector("#editor") ?? document.querySelector("[contenteditable]"))!;
  ed.innerHTML = `<p>Before.</p><figure><img src="${src}" alt="a photo" width="600" height="400">`
    + `<figcaption>A caption</figcaption></figure><p>After.</p>`;
  ed.dispatchEvent(new Event("input", { bubbles: true }));
}, photo);

for (const [sel, value] of [
  ["#f-title", "Publish path test"],
  ["#f-slug", "publish-path-test"],
  ["#f-dek", "Checking that photos reach /media."],
]) {
  const el = await page.$(sel);
  if (el) { await el.fill(value); await el.dispatchEvent("input"); }
}

await page.click("#btn-publish");
await page.waitForTimeout(3500);

/* ---------- what must be true ---------- */

okay("nothing was blocked by the policy", blocked.length === 0);
if (blocked.length) blocked.slice(0, 2).forEach((b) => console.log(`       ${b}`));

okay("the article was sent at all", !!posted);

if (posted) {
  const body = posted.body ?? "";
  check("no data: URL survives into the database", (body.match(/src="data:/g) ?? []).length, 0);
  check("the photo is a /media path instead", (body.match(/src="\/media\//g) ?? []).length, 1);
  okay("a cover was set", !!posted.cover);
  okay("and the cover is a drawn JPEG card, not the raw photo",
    /\.jpg$/.test(posted.cover ?? ""));
}

check("two uploads: the photo, then the card", uploads.length, 2);
okay("the first is the photo, as WebP", uploads[0]?.type?.includes("webp"));
okay("the second is the share card, as JPEG", uploads[1]?.type?.includes("jpeg"));
okay("the card has real bytes in it", (uploads[1]?.bytes ?? 0) > 1000);

await browser.close();
server.close();

console.log(failures
  ? `\n${failures} failure(s)`
  : "\nall good: a pasted photo reaches R2 and a card gets drawn");
process.exit(failures ? 1 : 0);
