/* ============================================================
   check-preview.mjs: does the Next.js Worker's branch preview
   render what the live site renders?

     node scripts/check-preview.mjs \
       --preview https://<branch>-reiad-next.i-reiad.workers.dev

   TRANSITION.md Stage 11. This is `next/parity.test.mjs`'s
   question asked of two deployed Workers instead of one local
   one, and it exists because that test cannot run everywhere.

   ---- why there are two of these ----

   `parity.test.mjs` starts the built Worker under `wrangler dev`
   on workerd, with a local D1 seeded with one article, and
   compares it against what `functions/insights/[slug].js` would
   have produced for the same row. No network, no account. That is
   the better test and it stays the one to reach for.

   It also does not run in every environment. In the container
   this stage is being written in, `wrangler dev` hangs with no
   output at all, `--local` included, so the machinery Stage 10
   built to keep a renderer honest is unavailable exactly where
   the routes are being written.

   The way round it is that the two Workers deploy separately, and
   Cloudflare gives `reiad-next` a branch preview URL on every
   push. That preview has the real D1 binding, so a route can be
   written, pushed, and asked real questions BEFORE anything in
   `worker.js` forwards a reader to it. Which is the order Stage
   10 already used: "the Next.js route exists" was one change and
   "Stage 10 switched on" was the next.

   ---- what it compares, and what it cannot ----

   The same facts `parity.test.mjs` compares, one tag at a time,
   because attribute order is the renderer's business and not the
   author's. It cannot compare against the Worker's own template
   the way that test does, because production now answers these
   URLs from Next itself. So it compares the preview against
   production: a route already switched on is being checked for
   regression, and a route not switched on yet is being checked
   for existence and shape before it is.

   It is not part of `Before deploying`. Like `check-live.mjs` it
   describes deployed things, and it wants a push to have happened
   first.
   ============================================================ */

const args = process.argv.slice(2);
const argOf = (name, fallback) => {
  const at = args.indexOf(name);
  return at === -1 ? fallback : args[at + 1];
};

const PREVIEW = argOf("--preview");
const LIVE = argOf("--against", "https://reiad.co.uk");

if (!PREVIEW) {
  console.error("Say which preview to ask:\n"
    + "  node scripts/check-preview.mjs --preview https://<branch>-reiad-next.i-reiad.workers.dev\n"
    + "\nThe URL is in the Cloudflare bot's comment on the pull request.\n");
  process.exit(2);
}

/* Every route the Next Worker owns or is being given. A path is
   listed here the moment its route is written, which is before
   `NEXT_ROUTES` in worker.js forwards anything to it: that gap is
   the whole point of this file. */
const ROUTES = [
  { path: "/insights/dse-basics", what: "an article, switched on" },
  { path: "/insights/tiny-experiments", what: "another article" },
];

/* fetch has no timeout of its own, and a check that hangs is
   worse than one that fails. check-live.mjs learned this on a
   runner, six minutes into a request nothing was answering. */
const get = async (url) => {
  const stop = AbortSignal.timeout(15000);
  try {
    const res = await fetch(url, { redirect: "follow", signal: stop });
    return { status: res.status, html: await res.text() };
  } catch (err) {
    return { status: 0, html: "", error: String(err?.message ?? err) };
  }
};

let failures = 0;
const check = (name, got, want) => {
  if (got === want) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       preview: ${got}\n       live   : ${want}`);
};
const okay = (name, cond, detail = "") => {
  if (cond) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
};

const attr = (html, re) => (html.match(re) ?? [])[1] ?? null;
const meta = (html, key) =>
  attr(html, new RegExp(`<meta[^>]*property="${key}"[^>]*content="([^"]*)"`))
  ?? attr(html, new RegExp(`<meta[^>]*content="([^"]*)"[^>]*property="${key}"`));

console.log(`\npreview: ${PREVIEW}\nagainst: ${LIVE}\n`);

for (const route of ROUTES) {
  console.log(`${route.path}  (${route.what})`);

  const [pre, live] = await Promise.all([
    get(PREVIEW + route.path),
    get(LIVE + route.path),
  ]);

  if (pre.error) { okay("the preview answers", false, pre.error); continue; }
  if (live.error) { okay("the live site answers", false, live.error); continue; }

  check("the same status", pre.status, live.status);
  if (pre.status !== 200 || live.status !== 200) { console.log(); continue; }

  check("the same title",
    attr(pre.html, /<title>([^<]*)<\/title>/),
    attr(live.html, /<title>([^<]*)<\/title>/));
  check("the same canonical link",
    attr(pre.html, /<link rel="canonical" href="([^"]+)"/),
    attr(live.html, /<link rel="canonical" href="([^"]+)"/));

  /* One tag at a time, because a page that says the same things
     in a different byte order is fine and a page that quietly
     drops og:image:type is not. */
  for (const key of ["og:type", "og:title", "og:description", "og:url",
                     "og:site_name", "og:image", "og:image:width", "og:image:height"]) {
    check(`the same ${key}`, meta(pre.html, key), meta(live.html, key));
  }

  /* The prose itself, as a string. This is the half that has to
     be identical rather than merely equivalent. */
  const body = (html) => (html.match(/<article[\s\S]*?<\/article>/) ?? [])[0] ?? null;
  okay("the article HTML is identical", body(pre.html) === body(live.html),
    body(pre.html) === null ? "no <article> in one of them"
      : `${(body(pre.html) ?? "").length} chars vs ${(body(live.html) ?? "").length}`);

  console.log();
}

console.log(failures
  ? `${failures} difference(s) between the preview and the live site.\n`
  : `the preview renders what the live site renders, on ${ROUTES.length} route(s).\n`);
process.exit(failures ? 1 : 0);
