/* check-live.ts: is the site that is actually deployed doing what
   the repository thinks it is?

     node scripts/check-live.ts
     node scripts/check-live.ts --origin https://reiad.co.uk

   Every other check here reads files. This one asks the live site,
   because two of the things it depends on are in no file: the
   `NEXT` service binding, which is a setting on the deployed
   Worker, and whether the second Worker's own assets are uploaded
   and reachable. Both are invisible to `wrangler.toml`, to the
   parity test and to a reader, because an article renders
   perfectly with neither working.

   It checks no content: `check-content.ts` and `check-pieces.ts`
   do that from the data, offline. And it is not part of `Before
   deploying`, because it describes what is live. */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { SECURITY_HEADERS } from "../shared/headers.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const args = process.argv.slice(2);
const origin = (args[args.indexOf("--origin") + 1] || "").startsWith("http")
  ? args[args.indexOf("--origin") + 1].replace(/\/$/, "")
  : "https://reiad.co.uk";

/* A piece that is a row in D1 and nothing else, so only a renderer
   reading the database can answer for it. Named rather than
   discovered, because a check that picks its own subject can pick
   one that makes it pass.

   The SLUG is named and the mount is LOOKED UP, which is the one
   thing here a writer can change without touching this repository:
   a piece moved from `/insights/` to `/travel/` from the Studio,
   and this asked for the old address, got the 404 a piece asked
   for at the wrong mount is meant to get, and reported the article
   route as broken on a site that was working perfectly. */
const DB_SLUG = "tiny-experiments";

/* A piece at a mount other than /insights/, which is a row in D1.
   Named for the same reason DB_PIECE is. */
const WORKER_PIECE = "/cooking/onions.html";

let passed = 0;
const failures: string[] = [];
const ahead: string[] = [];

const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const same = (name: string, expected: unknown, actual: unknown): void =>
  ok(name, expected === actual, `expected ${expected}, got ${actual}`);

/* ---------- what is live is main, and this may not be main ----------

   `live-check.yml` runs on every push, on every branch, and this
   file compares the DEPLOYED site against the WORKING TREE. Those
   are the same thing on main and are not on a branch: a branch
   that adds a header, a route or a module is asking production to
   already be serving something nobody has merged.

   So a difference between what this branch says and what is
   deployed is a NOTE off main and a FAILURE on it. Everything else
   here asks a question a branch cannot make false. */
const branch = process.env.GITHUB_REF_NAME
  ?? (() => {
    try {
      return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"],
        { cwd: ROOT, encoding: "utf8" }).trim();
    } catch { return "main"; }
  })();
const ON_MAIN = branch === "main" || branch === "HEAD";

/** An assertion about something a branch can legitimately be ahead
    of production on. Off main it is reported and not counted. */
const deployed = (name: string, expected: unknown, actual: unknown): void => {
  if (expected === actual) { passed++; return; }
  if (ON_MAIN) {
    failures.push(`${name}: expected ${expected}, got ${actual}`);
    return;
  }
  ahead.push(`${name}\n      committed here: ${expected}\n      live right now: ${actual}`);
};

/** Every response is asked for without the cache, because reading
    Cloudflare's copy of yesterday's deploy is a green tick for the
    wrong build. And every one is given a deadline: `fetch` has no
    timeout of its own, and a check that hangs is worse than one
    that fails, because nobody reads a job that never finishes. */
const once = (url: string, init: RequestInit = {}): Promise<Response> =>
  fetch(url, {
    signal: AbortSignal.timeout(15_000),
    headers: { "Cache-Control": "no-cache", ...(init.headers ?? {}) },
    ...init,
  });

/** A 5xx is retried. Nothing else is.

    This site is TWO Workers. `deploy.yml` uploads one and then
    runs this file; `reiad-next` is built and rolled out by
    Cloudflare on its own schedule from the same push, so there is
    a window about a minute wide where the main Worker forwards to
    a service binding that is mid-rollout and pieces answer 500.

    Narrow on purpose. Every OTHER status is an ANSWER this file
    has an opinion about, and retrying one would be retrying until
    the site said what was wanted. A 5xx is the site saying it
    could not answer at all, which during a rollout is a fact about
    the clock. */
/* Four more asks, backing off 1s, 2s, 4s, 8s: fifteen seconds of
   settling. What is being waited for is a ROLLOUT, a Worker
   version going live across a network and a cold isolate then
   reading D1, rather than a slow response. Three seconds is a
   request; fifteen is a deploy. It is bounded, spent only on a
   5xx, and a page that is genuinely broken is still 500 at the end
   of it. */
const BACKOFF_MS = [1000, 2000, 4000, 8000];

/* A THROW is retried too, on the same reasoning: `fetch` rejects
   when the deadline fires or the connection is refused, which is a
   request that never landed. Leaving it uncaught was worse than
   not retrying, because the whole script died on the first blip
   with no report of the checks that had passed.

   The last attempt's rejection is deliberately NOT swallowed: a
   site that cannot be reached after fifteen seconds is the answer,
   and turning that into a pass is the green tick for the wrong
   build this file opens by refusing. */
const ask = async (url: string, init: RequestInit = {}): Promise<Response> => {
  let answer: Response | null = null;
  for (const wait of [0, ...BACKOFF_MS]) {
    if (wait) await new Promise((done) => { setTimeout(done, wait); });
    try {
      answer = await once(url, init);
      if (answer.status < 500) return answer;
    } catch (err) {
      /* Out of attempts: the site really is unreachable. */
      if (wait === BACKOFF_MS[BACKOFF_MS.length - 1]) throw err;
      answer = null;
    }
  }
  if (!answer) throw new Error(`${url} never answered`);
  return answer;
};

/** The same, at a path on the site, and without following what
    comes back: several of the checks below are about which
    redirect is served, and a followed redirect hides it. */
const get = (path: string, init: RequestInit = {}): Promise<Response> =>
  ask(`${origin}${path}`, { redirect: "manual", ...init });

/* The sitemap, read once and used twice: here, to find that piece
   at whatever mount it hangs under today, and in section 7 to ask
   every piece it advertises whether it answers. */
const advertised = [...new Set(
  (await (await get("/sitemap.xml")).text()).match(/<loc>([^<]+)<\/loc>/g) ?? [])]
  .map((tag) => tag.replace(/<\/?loc>/g, ""))
  /* A piece, and only a piece. A hub is one segment now
     (`/cooking`), so the depth test is the whole of it. */
  .filter((url) => /\/(insights|cooking|travel)\/[^/]+$/.test(url));

const found = advertised.find((url) => url.endsWith(`/${DB_SLUG}.html`));
ok(`the sitemap advertises ${DB_SLUG}`, Boolean(found),
  "the piece this check is written around is not in the sitemap at any mount");
const DB_PIECE = (found ?? `${origin}/insights/${DB_SLUG}.html`).replace(origin, "");

/* ---------- 1. the article route, and who renders it ---------- */

const article = await get(DB_PIECE);
same("the article answers 200", 200, article.status);

const html = await article.text();

/* The one fact that says Next is in front of this route rather
   than the Worker's own renderer. The Worker's page loads /app.js
   and nothing else; a page from the App Router carries its own
   chunks whatever the tree contains. */
const chunks = [...new Set(html.match(/\/_next\/static\/[^"']+\.js/g) ?? [])];
ok("the piece is rendered by the Next.js Worker",
  chunks.length > 0,
  "no /_next/static script on the page, so the service binding is not in effect");

/* Named rather than written out as a `<script>` tag, which is what
   a page rendered by the App Router does: a module that runs
   before React has hydrated is a module whose work the hydration
   undoes, so a route names what it will load in a preload link.
   See `next/components/scripts.tsx`. Either spelling counts: the
   question is whether the page loads the site's own scripts at
   all, not which tag says so. */
const loads = (src: string): boolean =>
  new RegExp(`<script[^>]*src="${src}"`).test(html)
  || new RegExp(`<link[^>]*rel="(?:modulepreload|preload)"[^>]*href="${src}"`).test(html)
  || new RegExp(`<link[^>]*href="${src}"[^>]*rel="(?:modulepreload|preload)"`).test(html);

ok("the site's own script is still loaded", loads("\\/app\\.js"));

/* Every module the live page asks for, fetched.

   This named one file and so asked something it could not answer:
   a module named here is absent from production until the merge
   that deploys it, which is a check that fails by construction.
   This file runs against the LIVE site, so it can only honestly
   ask about the live site's own consistency: a page asking for a
   module the site does not serve, whatever the module is called. */
{
  const asked = [...new Set([
    ...(html.matchAll(/<script[^>]*src="(\/[a-z0-9/-]+\.js)"/g)),
    ...(html.matchAll(/<link[^>]*href="(\/[a-z0-9/-]+\.js)"[^>]*rel="(?:module)?preload"/g)),
    ...(html.matchAll(/<link[^>]*rel="(?:module)?preload"[^>]*href="(\/[a-z0-9/-]+\.js)"/g)),
  ].map((m) => m[1]))];
  const gone: string[] = [];
  for (const src of asked) {
    const answer = await fetch(`${origin}${src}`, { method: "HEAD" });
    if (!answer.ok) gone.push(`${src} (${answer.status})`);
  }
  ok(`every module the page asks for is served (${asked.length})`,
    gone.length === 0, gone.join(", "));
}
ok("the comment thread is on the page", /id="comments"/.test(html));
ok("the canonical link is the piece's own address",
  html.includes(`<link rel="canonical" href="${origin}${DB_PIECE}"`)
  || html.includes(`rel="canonical" href="${origin}${DB_PIECE}"`),
  "canonical missing or pointing elsewhere");
ok("the share card is the drawn one, not a raw photo",
  /<meta[^>]+og:image[^>]+\/media\/[^"']+\.jpg/.test(html)
  || /og:image[^>]*content="[^"]*\.(jpg|png)"/.test(html));

/* ---------- 2. the headers a Worker response does not get free ---------- */

/* A header that disagrees straight after a push is the same
   rollout fact as the 5xx above from the other side: the main
   Worker is new and the Next Worker rendering this piece is still
   the previous version, answering 200 with the previous headers.
   So a mismatch is asked again, four times over about a minute. A
   200 is an answer, which is why this is not folded into the 5xx
   retry. */
let headed = article;
for (const wait of [5000, 10000, 20000, 30000]) {
  const wrong = Object.entries(SECURITY_HEADERS).some(([key, value]) => headed.headers.get(key) !== value);
  if (!wrong) break;
  await new Promise((go) => setTimeout(go, wait));
  headed = await get(DB_PIECE);
}
for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
  deployed(`the ${key} header`, value, headed.headers.get(key));
}
ok("the article is cacheable at the edge",
  (article.headers.get("Cache-Control") || "").includes("stale-while-revalidate"),
  article.headers.get("Cache-Control") || "none");

/* ---------- 3. the scripts that answered 404 for a whole stage ----------

   The check the rest of the file exists for. A service binding
   skips the asset router in front of the Worker it calls,
   OpenNext's generated worker never touches its own ASSETS
   binding, and `next/worker-entry.js` is the wrapper that makes up
   the difference. None of that can be proved locally: `wrangler
   dev` does not serve assets for an auxiliary worker, so the
   parity test cannot tell the wrapper working from the wrapper
   being absent.

   The symptom, if it is wrong, is a console full of errors and a
   React that never hydrates, which on a page of prose is
   invisible. */
if (chunks.length) {
  const asset = await get(chunks[0]);
  same("Next's own JavaScript is served", 200, asset.status);
  const type = asset.headers.get("Content-Type") || "";
  ok("and served as JavaScript",
    /javascript|ecmascript/i.test(type),
    `Content-Type ${type || "none"}`);
  const body = await asset.text();
  ok("and is not this site's 404 page wearing a .js name",
    !/<!DOCTYPE html>/i.test(body.slice(0, 200)),
    "the asset router answered with 404.html");
}

/* ---------- 3b. the photo the card points at ----------

   The share card is drawn from the piece's lead photo, uploaded to
   R2, and pointed at by `og:image`. Every part of that was broken
   once, silently, for weeks, and a tag with a plausible URL in it
   is exactly what that looked like, so the URL is fetched rather
   than read. */
{
  const card = html.match(/og:image[^>]*content="([^"]+)"/)?.[1]
    ?? html.match(/content="([^"]+)"[^>]*og:image/)?.[1];
  if (card) {
    const res = await ask(card.startsWith("http") ? card : `${origin}${card}`);
    same("the share card is really there", 200, res.status);
    ok("and it is an image",
      /^image\//.test(res.headers.get("Content-Type") || ""),
      res.headers.get("Content-Type") || "none");
  } else {
    ok("the page names a share card", false, "no og:image on the page");
  }
}

/* ---------- 4. the fallback, which four pieces depend on ---------- */

const stray = await get("/insights/dsex.html");
ok("a piece Next does not have falls through to the asset router",
  stray.status === 301 || stray.status === 308,
  `status ${stray.status}, so the 301 in _redirects never fired`);

const missing = await get("/insights/not-a-piece-here.html");
same("an unknown slug is a 404, not a 500", 404, missing.status);

/* ---------- 5. all three mounts, not one ----------

   That a piece away from /insights/ really does render from its
   own mount is the half nothing offline can see.

   Followed rather than asked for once, which is why this reads
   oddly: Cloudflare's asset router answers `/cooking/onions.html`
   with a 307 to the extensionless form, so the question is where
   the path ends up rather than what the first hop says. */
const kitchen = await ask(`${origin}${WORKER_PIECE}`);
same("a piece in the kitchen answers", 200, kitchen.status);
const kitchenHtml = await kitchen.text();
ok("and it is the piece, not an empty shell",
  /<article|<h1/i.test(kitchenHtml),
  "200 with no article in it");

/* ---------- 6. the rest of the site is where it was ---------- */

for (const [path, what] of [
  ["/", "the home page"],
  ["/feed.xml", "the feed"],
  ["/sitemap.xml", "the sitemap"],
]) {
  const res = await get(path);
  same(`${what} answers 200`, 200, res.status);
}

/* The `.html` spellings, which are redirects now and which nothing
   in this repository can prove on its own: a rule in `_redirects`
   fires only because the path is absent from `run_worker_first`
   AND the Next Worker declines it, and both are settings on a
   deployed Worker.

   Followed rather than asked for once, so what is asserted is that
   a reader arriving at an address that was live for a year lands
   on the page rather than on `404.html`. One per shape: a page, a
   hub, a school, a stage's ladder and a practice book. */
for (const [was, what] of [
  ["/about.html", "a page"],
  ["/insights.html", "a reading hub"],
  ["/money/index.html", "a school"],
  ["/money/basics-1/index.html", "a stage's ladder"],
  ["/deutsch/stufe-1/arbeitsbuch.html", "a practice book"],
]) {
  const landed = await ask(`${origin}${was}`);
  same(`${was} still lands somewhere (${what})`, 200, landed.status);
}

/* ---------- 7. every piece the site advertises can be read ----------

   `check-routes.ts` does this offline and cannot see the half that
   matters: a piece that exists only as a row in D1 is in the
   sitemap because the Worker merges it in, and nothing in the
   repository knows whether its URL answers. */
{
  const urls = advertised;

  const bad = [];
  console.log(`  pieces in the sitemap: ${urls.length}`);
  for (const url of urls) {
    /* Asked for one at a time and printed as it goes, because the
       useful thing when this fails is which piece, and a loop that
       prints nothing until the end tells you only that something
       did not answer. */
    let status: number | string;
    try {
      status = (await ask(url)).status;
    } catch (err) {
      status = (err as Error)?.name === "TimeoutError"
        ? "no answer in 15s" : `failed: ${err}`;
    }
    console.log(`    ${String(status).padEnd(16)} ${url.replace(origin, "")}`);
    if (status !== 200) bad.push(`${url.replace(origin, "")} answered ${status}`);
  }
  ok(`all ${urls.length} piece(s) in the sitemap answer`,
    bad.length === 0, bad.join("; "));
}

/* ---------- done ---------- */

console.log(`\n${origin}: ${passed} checks passed`);
if (ahead.length) {
  console.log(`\n${ahead.length} thing(s) this branch changes that ${origin} has not`
    + ` deployed yet.\nOn main each of these is a failure; on "${branch}" it is what a`
    + ` branch looks like\nbefore it merges:\n`);
  for (const a of ahead) console.log(`  ~ ${a}`);
  console.log("");
}
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log(ahead.length
  ? "The deployed site is doing what main says. This branch is ahead of it.\n"
  : "The deployed site is doing what the repository says.\n");
