/* ============================================================
   check-live.ts: is the site that is actually deployed doing
   what the repository thinks it is?

     node scripts/check-live.ts
     node scripts/check-live.ts --origin https://reiad.co.uk

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
   in archive/TRANSITION.md ends by saying so: the first thing to check
   after switching on is one `/_next/static/chunks/*.js` URL, and
   until this file existed there was nothing to check it with.

   ---- what it does not do ----

   It does not check content. `check-content.ts` and
   `check-pieces.ts` do that from the data, offline, and they are
   the ones to reach for. This asks the deployed site a small
   number of questions whose answers cannot be known from here.

   It is not part of `Before deploying` for the same reason: it
   describes what is live, so it belongs after a deploy, not
   before one.
   ============================================================ */

import { SECURITY_HEADERS } from "../shared/headers.ts";

const args = process.argv.slice(2);
const origin = (args[args.indexOf("--origin") + 1] || "").startsWith("http")
  ? args[args.indexOf("--origin") + 1].replace(/\/$/, "")
  : "https://reiad.co.uk";

/* A piece that is a row in D1 and nothing else, so the only thing
   that can answer for it is a renderer reading the database. It is
   named rather than discovered because a check that picks its own
   subject can pick one that makes it pass.

   The SLUG is named. The mount it hangs under is looked up, and
   that is the one thing here a writer can change without touching
   this repository: this piece moved from `/insights/` to
   `/travel/` from the Studio, and the check went red on a site
   that was working perfectly. It asked for the address the piece
   used to have, got exactly the 404 a piece asked for at the wrong
   mount is meant to get, and reported the article route as broken
   and the service binding as missing. A check that names a fact
   the writing surface owns will keep doing that. */
const DB_SLUG = "tiny-experiments";

/* A piece at a mount other than /insights/, which is a row in D1
   and has not been a file since Stage 11.2. Named for the same
   reason DB_PIECE is: a check that picks its own subject can pick
   one that makes it pass. */
const WORKER_PIECE = "/cooking/onions.html";

let passed = 0;
const failures: string[] = [];

const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(detail ? `${name}: ${detail}` : name);
};

const same = (name: string, expected: unknown, actual: unknown): void =>
  ok(name, expected === actual, `expected ${expected}, got ${actual}`);

/** Every response is asked for without the cache, because a check
    reading Cloudflare's copy of yesterday's deploy is worse than
    no check: it is a green tick for the wrong build.

    And every one of them is given a deadline. `fetch` has no
    timeout of its own: a request that is answered slowly, or not
    at all, leaves this script waiting for as long as the runner
    will let it, and a check that hangs is worse than one that
    fails because nobody reads a job that never finishes. Fifteen
    seconds is far longer than any page here takes and far shorter
    than anybody's patience. */
const ask = (url: string, init: RequestInit = {}): Promise<Response> =>
  fetch(url, {
    signal: AbortSignal.timeout(15_000),
    headers: { "Cache-Control": "no-cache", ...(init.headers ?? {}) },
    ...init,
  });

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
  /* A piece, not a hub: `/cooking/index.html` is at the same depth
     and is the kitchen's front page. */
  .filter((url) => /\/(insights|cooking|travel)\/[^/]+$/.test(url))
  .filter((url) => !/\/index\.html$/.test(url));

const found = advertised.find((url) => url.endsWith(`/${DB_SLUG}.html`));
ok(`the sitemap advertises ${DB_SLUG}`, Boolean(found),
  "the piece this check is written around is not in the sitemap at any mount");
const DB_PIECE = (found ?? `${origin}/insights/${DB_SLUG}.html`).replace(origin, "");

/* ---------- 1. the article route, and who renders it ---------- */

const article = await get(DB_PIECE);
same("the article answers 200", 200, article.status);

const html = await article.text();

/* The one fact that says Next is in front of this route rather
   than the Worker's own renderer. The Worker's page loads
   /app.js and nothing else; a page from the App Router carries
   its own chunks whatever the tree contains, which is the 170 KB
   Stage 10 measured and accepted. */
const chunks = [...new Set(html.match(/\/_next\/static\/[^"']+\.js/g) ?? [])];
ok("the piece is rendered by the Next.js Worker",
  chunks.length > 0,
  "no /_next/static script on the page, so the service binding is not in effect");

/* Named, rather than written out as a `<script>` tag, which is
   what a page rendered by the App Router does now: a module that
   runs before React has hydrated is a module whose work the
   hydration undoes, so a route names what it will load in a
   preload link and loads it once hydration is over. See
   `next/components/scripts.tsx`. Either spelling counts, because
   the question here is whether the page loads the site's own
   scripts at all, not which tag says so. */
const loads = (src: string): boolean =>
  new RegExp(`<script[^>]*src="${src}"`).test(html)
  || new RegExp(`<link[^>]*rel="(?:modulepreload|preload)"[^>]*href="${src}"`).test(html)
  || new RegExp(`<link[^>]*href="${src}"[^>]*rel="(?:modulepreload|preload)"`).test(html);

ok("the site's own script is still loaded", loads("\\/app\\.js"));
/* The speech control was `/read-aloud.js` and is
   `next/components/read-aloud.tsx`. A live page still asking for
   the module is a deploy that has not caught up, and it would be
   a 404 on every article. */
ok("and the archived one is not", !loads("\\/read-aloud\\.js"));
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

/* ---------- 3b. the photo the card points at ----------

   The share card is drawn from the piece's lead photo, uploaded to
   R2, and pointed at by `og:image`. Every part of that was broken
   once, silently, for weeks: the upload was blocked by the policy,
   R2 stayed empty, and the tag pointed at nothing. A tag with a
   plausible URL in it is exactly what that failure looked like, so
   the URL is fetched rather than read. */
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

   This asked the opposite question until Stage 11.2, and the
   change is the stage rather than a correction. Stage 10 forwarded
   exactly one mount to Next, so a kitchen piece proving it was
   still the Worker's was half of what "exactly one" meant. Stage
   11.2 forwarded all three, and the same assertion then failed on
   the first deploy that carried it, saying the allowlist had grown
   past a plan that had already been superseded.

   What is worth asking now is that a piece away from /insights/
   really does render from its own mount, because that is the half
   of Stage 11.2 nothing offline can see.

   Followed rather than asked for once, and the difference is the
   reason this reads oddly. Cloudflare's asset router answers
   `/cooking/onions.html` with a 307 to the extensionless form,
   which is its own behaviour and has been true since long before
   Stage 10, so the question is where the path ends up rather than
   what the first hop says. */
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

/* `/insights` is asked for separately because it is the one of
   these that is deliberately a redirect. `_redirects` has sent it
   to `/insights.html` since Stage 11.1, where the Next route
   renders the hub; before that the file was an asset and the
   extensionless form was served directly, which is why this used
   to sit in the list above and started failing on the first deploy
   that carried Stage 11.1. Followed, so what is asserted is that a
   reader typing the short address arrives at the hub. */
{
  const index = await ask(`${origin}/insights`);
  same("the Insights index answers, after its redirect", 200, index.status);
}

/* ---------- 7. every piece the site advertises can be read ----------

   `check-routes.ts` does this offline and cannot see the half
   that matters here: a piece that exists only as a row in D1 is in
   the sitemap because the Worker merges it in, and nothing in the
   repository knows whether its URL actually answers. A published
   row whose address 404s is the exact failure Stage 3 and Stage 10
   are both walking towards, so it is asked of the live site. */
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
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("The deployed site is doing what the repository says.\n");
