/* ============================================================
   check-preview.ts: does the Next.js Worker's branch preview
   render what the live site renders?

     node scripts/check-preview.ts \
       --preview https://<branch>-reiad-next.i-reiad.workers.dev

   archive/TRANSITION.md Stage 11. This is `next/parity.test.ts`'s
   question asked of two deployed Workers instead of one local
   one, and it exists because that test cannot run everywhere.

   ---- why there are two of these ----

   `parity.test.ts` starts the built Worker under `wrangler dev`
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

   The same facts `parity.test.ts` compares, one tag at a time,
   because attribute order is the renderer's business and not the
   author's. It cannot compare against the Worker's own template
   the way that test does, because production now answers these
   URLs from Next itself. So it compares the preview against
   production: a route already switched on is being checked for
   regression, and a route not switched on yet is being checked
   for existence and shape before it is.

   It is not part of `Before deploying`. Like `check-live.ts` it
   describes deployed things, and it wants a push to have happened
   first.
   ============================================================ */

const args = process.argv.slice(2);
const argOf = (name: string, fallback = ""): string => {
  const at = args.indexOf(name);
  return at === -1 ? fallback : args[at + 1];
};

const PREVIEW = argOf("--preview");
const LIVE = argOf("--against", "https://reiad.co.uk");

if (!PREVIEW) {
  console.error("Say which preview to ask:\n"
    + "  node scripts/check-preview.ts --preview https://<branch>-reiad-next.i-reiad.workers.dev\n"
    + "\nThe URL is in the Cloudflare bot's comment on the pull request.\n");
  process.exit(2);
}

/* Every route the Next Worker owns or is being given. A path is
   listed here the moment its route is written, which is before
   `NEXT_ROUTES` in worker.js forwards anything to it: that gap is
   the whole point of this file.

   `section` marks a hub, and it changes what can be compared. A
   hub's head is the same question as an article's and is asked
   the same way. Its list is not: the page it is being compared
   against builds its cards in the browser, after a fetch, so
   there is nothing in the live HTML to diff them against. What
   the preview is held to instead is the database itself, through
   the public `/api/articles`: every live piece in that section
   has a card, at its own address, and there are no others. That
   is the stronger of the two checks anyway. */
const ROUTES = [
  { path: "/insights/dse-basics", what: "an article, switched on" },
  { path: "/insights/tiny-experiments", what: "another article" },
  { path: "/insights.html", what: "the Insights hub", section: "insights" },
  { path: "/cooking/index.html", what: "the kitchen", section: "cooking" },
  { path: "/travel/index.html", what: "the travel desk", section: "travel" },
];

/* fetch has no timeout of its own, and a check that hangs is
   worse than one that fails. check-live.ts learned this on a
   runner, six minutes into a request nothing was answering. */
const get = async (url: string): Promise<{
  status: number; html: string; error?: string;
}> => {
  const stop = AbortSignal.timeout(15000);
  try {
    const res = await fetch(url, { redirect: "follow", signal: stop });
    return { status: res.status, html: await res.text() };
  } catch (err) {
    return { status: 0, html: "", error: String((err as Error)?.message ?? err) };
  }
};

let failures = 0;
const check = (name: string, got: unknown, want: unknown): void => {
  if (got === want) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}\n       preview: ${got}\n       live   : ${want}`);
};
const okay = (name: string, cond: unknown, detail = ""): void => {
  if (cond) { console.log(`  ok   ${name}`); return; }
  failures += 1;
  console.log(`  FAIL ${name}${detail ? `\n       ${detail}` : ""}`);
};

/* Entities decoded before anything is compared, because the two
   sides escape differently and both are correct. React writes an
   apostrophe as `&#x27;`, a hand-written page writes it as
   itself, and "Reiad's Library" would otherwise fail against
   "Reiad&#x27;s Library" on every hub in this list. */
const ENTITIES: Record<string, string> = {
  "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"',
  "&#x27;": "'", "&#39;": "'", "&apos;": "'", "&#x2F;": "/",
};
const text = (value: string | null | undefined): string | null | undefined =>
  value === null || value === undefined ? value
    : String(value).replace(/&(?:amp|lt|gt|quot|apos|#x27|#39|#x2F);/g, (e) => ENTITIES[e]);

const attr = (html: string, re: RegExp): string | null | undefined =>
  text((html.match(re) ?? [])[1] ?? null);
const meta = (html: string, key: string): string | null | undefined =>
  attr(html, new RegExp(`<meta[^>]*property="${key}"[^>]*content="([^"]*)"`))
  ?? attr(html, new RegExp(`<meta[^>]*content="([^"]*)"[^>]*property="${key}"`));

/** Every live piece in a section, straight from the database, by
    way of the endpoint the site's own pages read. Asked of the
    live site rather than the preview: the preview is the thing
    being checked, and a page marking its own homework is the
    failure this repository has written up twice. */
/** One row of `/api/articles`, of the two fields this reads. */
interface LiveRow {
  slug: string;
  status?: string;
  section?: string;
  [key: string]: unknown;
}

async function livePieces(section: string): Promise<LiveRow[]> {
  const stop = AbortSignal.timeout(15000);
  const res = await fetch(`${LIVE}/api/articles`, { signal: stop });
  const body = await res.json() as { articles?: LiveRow[] };
  /* `{ ok, articles }`, and only the live ones without `?all=1`,
     which needs the admin session this script does not have and
     should not want. */
  return (body?.articles ?? [])
    .filter((row: LiveRow) => (row.status ?? "live") === "live")
    .filter((row: LiveRow) => (row.section || "insights") === section);
}

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

  /* And 200, which is a separate question from agreement.

     THE FALSE PASS THIS CLOSES. This used to compare the two
     statuses and then quietly `continue` on anything that was not
     200, so two sides answering the same wrong thing printed one
     tick and skipped every real check. Run from a sandbox whose
     egress proxy answers 403 to everything, it compared nothing
     at all across five routes and finished with "the preview
     renders what the live site renders". A check that agrees with
     itself is the failure this repository has written up twice,
     and this is the third. */
  if (pre.status !== 200 || live.status !== 200) {
    okay(`and both answer 200, rather than ${pre.status}`, false,
      "nothing below was compared. Two sides agreeing on a 404, or on a\n"
      + "       403 from something in the way, is not the same as agreeing.");
    console.log();
    continue;
  }

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

  /* A hub, held to the database rather than to the page it
     replaces: that page has an empty box in its HTML and fills it
     from /api/articles after it has painted. */
  if (route.section) {
    const pieces = await livePieces(route.section);
    const cards = (pre.html.match(/class="cell (?:read-card|sample-card)"/g) ?? []).length;

    okay(`the preview lists ${pieces.length} piece(s), which is what the`
      + " database has", cards === pieces.length, `${cards} card(s) rendered`);

    for (const piece of pieces) {
      const url = `/${route.section}/${piece.slug}.html`;
      okay(`  ${piece.slug} has a card, at ${url}`,
        pre.html.includes(`href="${url}"`));
    }

    /* Server-rendered or it has not moved. The whole gain of this
       step is a hub that says what is on it before any JavaScript
       runs, and a page that renders an empty grid and fills it in
       afterwards passes every other check on this list. */
    okay("the list is in the HTML rather than fetched",
      cards > 0 || pieces.length === 0);

    console.log();
    continue;
  }

  /* The prose itself, as a string. This is the half that has to
     be identical rather than merely equivalent. */
  const body = (html: string): string | null =>
    (html.match(/<article[\s\S]*?<\/article>/) ?? [])[0] ?? null;
  okay("the article HTML is identical", body(pre.html) === body(live.html),
    body(pre.html) === null ? "no <article> in one of them"
      : `${(body(pre.html) ?? "").length} chars vs ${(body(live.html) ?? "").length}`);

  console.log();
}

console.log(failures
  ? `${failures} difference(s) between the preview and the live site.\n`
  : `the preview renders what the live site renders, on ${ROUTES.length} route(s).\n`);
process.exit(failures ? 1 : 0);

/* This file has no import and no export of its own: it asks a URL
   and reads what comes back. `export {}` is what makes it a
   module all the same, which top-level `await` requires. */
export {};
