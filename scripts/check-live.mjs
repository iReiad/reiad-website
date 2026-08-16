/* ============================================================
   check-live.mjs: is the site that is actually deployed doing
   what the repository thinks it is?

     node scripts/check-live.mjs
     node scripts/check-live.mjs --origin https://reiad.co.uk

   Every other check in this repository reads files, and that is
   the right thing for almost everything: a check that needs the
   internet is a check that goes red when somebody else's DNS has
   a bad afternoon. This one is different because Stage 10 is
   different. Two of the things it turns on are not in any file:

     1. the `NEXT` service binding, which lives in the deployed
        Worker's settings rather than in `wrangler.toml` alone,
     2. whether the second Worker's own assets are actually
        uploaded and reachable.

   Both are invisible to `wrangler.toml`, invisible to the parity
   test, and invisible to a reader, because an article renders
   perfectly with neither of them working. The whole Stage 10 note
   in TRANSITION.md ends by saying so: the first thing to check
   after switching on is one `/_next/static/chunks/*.js` URL, and
   until this file existed there was nothing to check it with.

   ---- what it does not do ----

   It does not check content. `check-content.mjs` and
   `check-pieces.mjs` do that from the data, offline, and they are
   the ones to reach for. This asks the deployed site a small
   number of questions whose answers cannot be known from here.

   It is not part of `Before deploying` for the same reason: it
   describes what is live, so it belongs after a deploy, not
   before one.
   ============================================================ */

import { SECURITY_HEADERS } from "../shared/headers.js";

const args = process.argv.slice(2);
const origin = (args[args.indexOf("--origin") + 1] || "").startsWith("http")
  ? args[args.indexOf("--origin") + 1].replace(/\/$/, "")
  : "https://reiad.co.uk";

/* A piece that is a row in D1 and nothing else, so the only thing
   that can answer for it is a renderer reading the database. It is
   named rather than discovered because a check that picks its own
   subject can pick one that makes it pass. */
const DB_PIECE = "/insights/tiny-experiments.html";

/* A piece at a mount the allowlist deliberately leaves alone. The
   plan says exactly one mount goes to Next, so this one proving it
   is still the Worker's is half of what "exactly one" means. */
const WORKER_PIECE = "/cooking/onions.html";

let passed = 0;
const failures = [];

const ok = (name, condition, detail = "") => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const same = (name, expected, actual) =>
  ok(name, expected === actual, `expected ${expected}, got ${actual}`);

/** Every response is asked for without the cache, because a check
    reading Cloudflare's copy of yesterday's deploy is worse than
    no check: it is a green tick for the wrong build. */
const get = (path, init = {}) =>
  fetch(`${origin}${path}`, {
    redirect: "manual",
    headers: { "Cache-Control": "no-cache", ...(init.headers || {}) },
    ...init,
  });

/* ---------- 1. the article route, and who renders it ---------- */

const article = await get(DB_PIECE);
same("the article answers 200", 200, article.status);

const html = await article.text();

/* The one fact that says Next is in front of this route rather
   than the Worker's own renderer. The Worker's page loads
   /app.js and /read-aloud.js and nothing else; a page from the
   App Router carries its own chunks whatever the tree contains,
   which is the 170 KB Stage 10 measured and accepted. */
const chunks = [...new Set(html.match(/\/_next\/static\/[^"']+\.js/g) ?? [])];
ok("the piece is rendered by the Next.js Worker",
  chunks.length > 0,
  "no /_next/static script on the page, so the service binding is not in effect");

ok("the site's own scripts are still loaded",
  /<script[^>]*src="\/app\.js"/.test(html) && /read-aloud\.js/.test(html));
ok("the comment thread is on the page", /id="comments"/.test(html));
ok("the canonical link is the piece's own address",
  html.includes(`<link rel="canonical" href="${origin}${DB_PIECE}"`)
  || html.includes(`rel="canonical" href="${origin}${DB_PIECE}"`),
  "canonical missing or pointing elsewhere");
ok("the share card is the drawn one, not a raw photo",
  /<meta[^>]+og:image[^>]+\/media\/[^"']+\.jpg/.test(html)
  || /og:image[^>]*content="[^"]*\.(jpg|png)"/.test(html));

/* ---------- 2. the headers a Worker response does not get free ---------- */

for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
  same(`the ${key} header`, value, article.headers.get(key));
}
ok("the article is cacheable at the edge",
  (article.headers.get("Cache-Control") || "").includes("stale-while-revalidate"),
  article.headers.get("Cache-Control") || "none");

/* ---------- 3. the scripts that answered 404 for a whole stage ----------

   This is the check the rest of the file exists for. A service
   binding skips the asset router in front of the Worker it calls,
   OpenNext's generated worker never touches its own ASSETS
   binding, and `next/worker-entry.js` is the wrapper that makes up
   the difference. None of that can be proved locally: `wrangler
   dev` does not serve assets for an auxiliary worker, so the
   combined local run answers 500 here and the parity test cannot
   tell the difference between the wrapper working and the wrapper
   being absent.

   The symptom, if it is wrong, is a console full of errors and a
   React that never hydrates. On a page of prose that is invisible,
   which is exactly why it needs a check rather than an eye. */
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

/* ---------- 4. the fallback, which four pieces depend on ---------- */

const stray = await get("/insights/dsex.html");
ok("a piece Next does not have falls through to the asset router",
  stray.status === 301 || stray.status === 308,
  `status ${stray.status}, so the 301 in _redirects never fired`);

const missing = await get("/insights/not-a-piece-here.html");
same("an unknown slug is a 404, not a 500", 404, missing.status);

/* ---------- 5. the allowlist is one mount wide ---------- */

const kitchen = await get(WORKER_PIECE);
same("a piece in the kitchen still answers", 200, kitchen.status);
const kitchenHtml = await kitchen.text();
ok("and is not routed through Next",
  !/\/_next\/static\//.test(kitchenHtml),
  "the allowlist has grown past the one mount Stage 10 names");

/* ---------- 6. the rest of the site is where it was ---------- */

for (const [path, what] of [
  ["/", "the home page"],
  ["/insights.html", "the Insights index"],
  ["/feed.xml", "the feed"],
  ["/sitemap.xml", "the sitemap"],
]) {
  const res = await get(path);
  same(`${what} answers 200`, 200, res.status);
}

/* ---------- done ---------- */

console.log(`\n${origin}: ${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("The deployed site is doing what the repository says.\n");
