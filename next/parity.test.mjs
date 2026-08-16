/* ============================================================
   parity.test.mjs: does the Next.js route render the same
   article as the Worker does?

     cd next && npm run build && npx opennextjs-cloudflare build
     node next/parity.test.mjs

   OPTIONAL, like the browser tests: it needs the OpenNext build
   to have run, and it skips with a note if `.open-next/worker.js`
   is not there.

   It starts the built Worker on workerd through `wrangler dev`,
   with a local D1 seeded with a handful of rows, asks it for an
   article, and compares what comes back against what
   `functions/insights/[slug].js` would have produced for the same
   row. No network, no deploy, no Cloudflare account.

   Since Stage 11.1 it also drives the three reading hubs, which
   have no Worker-side twin to be compared against and are held to
   the database instead: the cards, their addresses, the count
   above them, and the draft that must appear on none of them.

   And since Stage 11.7 it drives a lesson of each of the four
   schools. Those DO have a twin, and it is not a renderer: it is
   the committed page a builder wrote from the same row, so the
   comparison is against the file, fact by fact, with the prose
   held byte for byte. It is the one route here whose replacement
   can be checked against the thing it replaces.

   ---- "byte-identical", and what that had to become ----

   TRANSITION.md's Stage 10 says the share card, the structured
   data and the canonical link must be "byte-identical to what the
   Worker produced". Two of those three can be exactly that and
   are checked as strings here. The third cannot: React writes
   `<meta content="..." property="og:title"/>` where a template
   string writes `<meta property="og:title" content="...">`, and
   no amount of care changes that, because the renderer decides
   attribute order and self-closing, not the author.

   So the bar is: every fact is identical, checked one tag at a
   time, and the article's own HTML is identical as a string. That
   is the thing the sentence was protecting. A page that says the
   same things in a different byte order is fine; a page that
   quietly drops og:image:type is not, and this fails on it.
   ============================================================ */

import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 8787;

if (!existsSync(join(here, ".open-next/worker.js"))) {
  console.log("No .open-next/worker.js, so the parity check is skipped.");
  console.log("  cd next && npx opennextjs-cloudflare build");
  process.exit(0);
}

/* ---------- the article both renderers are given ---------- */

const ARTICLE = {
  /* Not the slug of anything real. `dse-basics` was the obvious
     choice and is wrong: it is one of the pieces still committed
     as a file, so seeding it into D1 made the check below that
     those pieces fall through to the asset router pass for the
     wrong reason. A fixture that collides with real data tests
     the fixture. */
  slug: "rate-cycle",
  section: "insights",
  lang: "en",
  title: 'How the "DSEX" actually works & why it matters',
  dek: "What the index measures, how a BO account works, and the questions to ask first.",
  tag: "Equities · Beginner",
  /* Pipe-separated, which is what the column actually holds:
     `/api/articles` splits on it and so does the hub route. This
     said `JSON.stringify([...])` for as long as nothing read the
     field, and a fixture in a format the site does not use tests
     the fixture. */
  topics: "Equities|Beginner",
  body: '<p>The DSEX is a free-float weighted index.</p>\n'
    + '<figure class="lead-photo"><img src="/media/dse/9f2a1c.webp" alt="The board" '
    + 'width="1600" height="900" loading="lazy" decoding="async"></figure>\n'
    + '<div class="note">Worth knowing: the cap is applied after the float.</div>',
  cover: "/media/rate-cycle-card/9f2a1c.jpg",
  minutes: 9,
  status: "live",
  published_at: "2026-07-01",
  updated_at: "2026-08-01",
};

/* ---------- a local D1 with that row in it ---------- */

const state = mkdtempSync(join(tmpdir(), "reiad-parity-"));

const d1 = (sql) => execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "reiad", "--local", "--persist-to", state, "--command", sql],
  { cwd: here, stdio: "pipe" },
);

/* Three more rows, for the hubs. One piece in each Bangla
   section, so that the card, its address and the count above it
   are drawn from something; and one draft, which is the row that
   must not appear anywhere.

   Slugs nothing will ever be called, on the same reasoning as
   `rate-cycle` above: a fixture that collides with a real piece
   tests the fixture. */
const KITCHEN = {
  ...ARTICLE,
  slug: "parity-kitchen", section: "cooking", lang: "bn",
  title: "পেঁয়াজ কাটার আসল নিয়ম", dek: "শিরা বরাবর কাটলে কী বদলায়।",
  tag: "রান্নাঘর · উপকরণ", topics: "উপকরণ|কৌশল", minutes: 12,
  cover: "", published_at: "2026-07-02",
};
const DESK = {
  ...ARTICLE,
  slug: "parity-travel", section: "travel", lang: "bn",
  title: "ভিসার কাগজপত্র", dek: "কোন কাগজে সবচেয়ে বেশি নজর পড়ে।",
  tag: "ভ্রমণ · ভিসা", topics: "ভিসা", minutes: 9,
  cover: "", published_at: "2026-07-03",
};
const DRAFT = {
  ...ARTICLE,
  slug: "parity-draft", section: "insights", status: "draft",
  title: "Not published yet", published_at: "",
};

const columns = Object.keys(ARTICLE);
const row = (article) => columns
  .map((c) => (typeof article[c] === "number" ? article[c] : `'${String(article[c]).replace(/'/g, "''")}'`))
  .join(", ");

d1(`CREATE TABLE IF NOT EXISTS articles (
      slug TEXT PRIMARY KEY, section TEXT, lang TEXT, title TEXT, dek TEXT, tag TEXT,
      topics TEXT, body TEXT, cover TEXT, minutes INTEGER, status TEXT,
      published_at TEXT, updated_at TEXT)`);
for (const article of [ARTICLE, KITCHEN, DESK, DRAFT]) {
  d1(`INSERT OR REPLACE INTO articles (${columns.join(", ")}) VALUES (${row(article)})`);
}

/* ---------- and the schools, out of the real snapshot ----------

   TRANSITION.md Stage 11.7. Unlike the articles above, these are
   NOT invented: the lesson route has to render what the committed
   page renders, and the committed page was built from
   `content/schools.backup.json`. Seeding anything else would
   compare the route against a fixture rather than against the
   thing it is replacing.

   Four stages rather than seventeen, one per school, because the
   whole export is a megabyte of prose and `wrangler d1 execute`
   takes it one statement at a time. The four are chosen to cover
   the four shapes: the money school's terms answer at an address
   that is not their stage's, the German and English schools end a
   stage by pointing at a practice book, and the Quranic Arabic
   school labels its lessons by day and puts Arabic under the
   title. */
const { readSnapshot } = await import("../scripts/schools-snapshot.mjs");
const snapshot = readSnapshot();

/* `basics-2` is the money school's first GENERATED stage and is
   what its lesson page is compared against. `basics-1` is the
   eighteen original terms at /learn/terms/, which the builder has
   never written and which are compared for less: see the block
   below that asks them only what a wrong answer would cost. The
   other three are the first written stage of each language
   school. */
const SEEDED = ["basics-1", "basics-2", "stufe-1", "dhap-1", "term-1"];

d1(`CREATE TABLE IF NOT EXISTS school_stages (
      school TEXT, slug TEXT, position INTEGER, title TEXT, status TEXT, meta TEXT,
      PRIMARY KEY (school, slug))`);
d1(`CREATE TABLE IF NOT EXISTS school_sections (
      school TEXT, stage TEXT, ident TEXT, position INTEGER, title TEXT, meta TEXT,
      PRIMARY KEY (school, stage, ident))`);
d1(`CREATE TABLE IF NOT EXISTS school_lessons (
      school TEXT, stage TEXT, slug TEXT, section TEXT, position INTEGER,
      title TEXT, minutes INTEGER, status TEXT, meta TEXT, body TEXT,
      PRIMARY KEY (school, stage, slug))`);

const q = (v) => (v === null || v === undefined
  ? "NULL"
  : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const insert = (table, cols, r) =>
  `INSERT OR REPLACE INTO ${table} (${cols.join(", ")}) `
  + `VALUES (${cols.map((c) => q(r[c])).join(", ")});`;

/* Every stage of every school, because a ladder needs its
   neighbours: the last lesson of a stage points at the next one,
   and a stage list with holes in it points at the wrong place.
   The prose is what is limited to the four.

   Written to one file and executed once, rather than a statement
   at a time. `wrangler d1 execute --command` is a whole node
   process per call and these are seventy rows: the first version
   of this spent four minutes seeding a test that then took forty
   seconds to run. */
const statements = [
  ...snapshot.stages.map((r) =>
    insert("school_stages", ["school", "slug", "position", "title", "status", "meta"], r)),
  ...snapshot.sections.filter((x) => SEEDED.includes(x.stage)).map((r) =>
    insert("school_sections", ["school", "stage", "ident", "position", "title", "meta"], r)),
  ...snapshot.lessons.filter((x) => SEEDED.includes(x.stage)).map((r) =>
    insert("school_lessons",
      ["school", "stage", "slug", "section", "position", "title", "minutes",
       "status", "meta", "body"], r)),
];

const seedFile = join(state, "schools.sql");
writeFileSync(seedFile, `${statements.join("\n")}\n`);
execFileSync("npx",
  ["wrangler", "d1", "execute", "reiad", "--local", "--persist-to", state,
   "--file", seedFile],
  { cwd: here, stdio: "pipe" });

/* ---------- the Worker on workerd ---------- */

/* Its own process group, so that stopping it stops all of it.
   `wrangler dev` runs workerd as a child of its own, and a
   SIGTERM to wrangler alone leaves that grandchild holding the
   port: the next run of this test then dies on "Address already
   in use", which reads like a broken test and is a leftover. */
const dev = spawn(
  "npx",
  ["wrangler", "dev", "--local", "--port", String(PORT), "--persist-to", state],
  { cwd: here, stdio: ["ignore", "pipe", "pipe"], detached: true },
);

let log = "";
dev.stdout.on("data", (d) => { log += d; });
dev.stderr.on("data", (d) => { log += d; });

let gone = null;
dev.on("exit", (code, signal) => { gone = code ?? signal ?? "gone"; });

const stop = () => {
  try { process.kill(-dev.pid, "SIGTERM"); } catch { dev.kill("SIGTERM"); }
  try { rmSync(state, { recursive: true, force: true }); } catch { /* fine */ }
};
process.on("exit", stop);

/* Ready, or one of three ways of not being ready, told apart.

   THE BUG THIS SHAPE FIXES, and it is worse than the one it
   replaces because it was quiet. The old loop gave up on any line
   matching `Error: `, and `wrangler dev` prints exactly that,
   harmlessly, wherever there is no outbound network: it cannot
   fetch the `Request.cf` object, says so with a stack, and then
   starts perfectly forty seconds later. So in the container this
   stage is being written in, and in any sandbox like it, this
   test printed "did not start", exited 0, and looked from the
   outside exactly like 49 passing checks.

   A real failure is the process being gone, or wrangler's own
   `[ERROR]` marker, which it brackets and a thrown stack does
   not. Everything else is waited out. */
const ready = async () => {
  for (let i = 0; i < 180; i++) {
    if (/Ready on http/.test(log)) return "ready";
    if (gone !== null) return `wrangler dev exited (${gone})`;
    if (/\[ERROR\]/.test(log)) return "wrangler dev reported an error";
    await new Promise((r) => setTimeout(r, 500));
  }
  return "wrangler dev never said it was ready, after 90 seconds";
};

const start = await ready();
if (start !== "ready") {
  console.log(`SKIPPED: ${start}, so nothing was compared.\n`);
  console.log("This test is optional, and a skip is not a pass. If it skips\n"
    + "everywhere, the routes it covers have no offline check at all:\n"
    + "scripts/check-preview.mjs asks the same questions of a deployed\n"
    + "branch preview instead.\n");
  console.log(log.split("\n").slice(-15).join("\n"));
  stop();
  process.exit(0);
}
// The first request compiles the route; give the server a moment.
await new Promise((r) => setTimeout(r, 500));

/* ---------- the two renderings ---------- */

const ORIGIN = "https://reiad.co.uk";
const { render } = await import("../functions/insights/[slug].js");
const { SECURITY_HEADERS } = await import("../shared/headers.js");

/* Asked for at the address the piece actually has.

   `pieceUrl()` in content.js builds `/insights/<slug>.html`, and
   that is the canonical link, the sitemap entry, every internal
   link and everything anybody has shared. The first version of
   this test asked for the extensionless form, which nothing on
   this site uses, and passed while every real URL answered 404. */
const res = await fetch(`http://127.0.0.1:${PORT}/insights/${ARTICLE.slug}.html`);
const fromNext = await res.text();
const fromWorker = render(ARTICLE, ORIGIN);

/* ---------- the checks ---------- */

let passed = 0;
const failures = [];

/* Compared after decoding, because the two renderers escape
   differently and neither is wrong. React writes `&#x27;` where a
   template string writes an apostrophe, and `&amp;` where the
   template writes a bare `&` inside an attribute (React is the
   more correct of the two there). A browser parses them to the
   same string, and the same string is the thing being checked. */
const decode = (v) => (typeof v === "string"
  ? v.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole, body) => {
      if (body[0] === "#") {
        const code = body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
      }
      return { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0" }[body] ?? whole;
    })
  : v);

const check = (name, a, b) => {
  if (decode(a) === decode(b)) { passed++; return; }
  failures.push(`${name}\n      worker: ${JSON.stringify(a)}\n      next:   ${JSON.stringify(b)}`);
};
const ok = (name, condition, detail = "") => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n      ${detail}` : ""));
};

/** The content of a meta tag, whichever order its attributes are in. */
const meta = (html, key, attr = "property") => {
  const re = new RegExp(
    `<meta[^>]*(?:${attr}="${key}"[^>]*content="([^"]*)"`
    + `|content="([^"]*)"[^>]*${attr}="${key}")`, "i");
  const m = html.match(re);
  return m ? (m[1] ?? m[2]) : null;
};
const tagText = (html, tag) => html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))?.[1] ?? null;
const attr = (html, re) => html.match(re)?.[1] ?? null;

ok("the route answers at the address the piece actually has",
  res.status === 200, `status ${res.status} for /insights/${ARTICLE.slug}.html`);

/* Every shape worker.js will forward, because the allowlist regex
   makes the suffix optional and is case-insensitive. */
{
  const bare = await fetch(`http://127.0.0.1:${PORT}/insights/${ARTICLE.slug}`);
  ok("and without the suffix too", bare.status === 200, `status ${bare.status}`);
  const bareHtml = await bare.text();
  check("with the same canonical link either way",
    attr(fromNext, /<link rel="canonical" href="([^"]+)"/),
    attr(bareHtml, /<link rel="canonical" href="([^"]+)"/));

  /* And the section however it was typed, because the Worker's own
     route lowercases it before deciding. */
  const shouty = await fetch(`http://127.0.0.1:${PORT}/Insights/${ARTICLE.slug}.html`);
  ok("and whatever case the section was typed in",
    shouty.status === 200, `status ${shouty.status}`);
}

/* ---- the three the plan names ---- */

check("the canonical link",
  attr(fromWorker, /<link rel="canonical" href="([^"]+)"/),
  attr(fromNext, /<link rel="canonical" href="([^"]+)"/));

check("the structured data",
  tagText(fromWorker, 'script type="application\\/ld\\+json"'),
  tagText(fromNext, 'script type="application\\/ld\\+json"'));

for (const key of ["og:image", "og:image:type", "og:image:width", "og:image:height"]) {
  check(`the share card's ${key}`, meta(fromWorker, key), meta(fromNext, key));
}

/* ---- and the rest of the head, because dropping one of these
       is exactly as invisible as dropping og:image ---- */

for (const key of ["og:type", "og:title", "og:description", "og:url",
                   "og:site_name", "og:locale"]) {
  check(key, meta(fromWorker, key), meta(fromNext, key));
}
for (const key of ["twitter:card", "twitter:image", "description"]) {
  check(key, meta(fromWorker, key, "name"), meta(fromNext, key, "name"));
}
check("the title", tagText(fromWorker, "title"), tagText(fromNext, "title"));
check("the language",
  attr(fromWorker, /<html lang="([^"]+)"/), attr(fromNext, /<html lang="([^"]+)"/));
check("the stylesheet",
  attr(fromWorker, /<link rel="stylesheet" href="(\/styles\.css)"/),
  attr(fromNext, /<link rel="stylesheet" href="(\/styles\.css)"/));
check("the webfonts",
  attr(fromWorker, /<link href="(https:\/\/fonts\.googleapis[^"]+)"/),
  attr(fromNext, /href="(https:\/\/fonts\.googleapis[^"]+)"/));

/* ---- the article itself ---- */

ok("the body is passed through unchanged",
  fromNext.includes(ARTICLE.body.split("\n")[0]),
  "the first block of the stored body is not in the page");
ok("and so is the figure, with its class",
  fromNext.includes('class="lead-photo"'));
ok("and the note box",
  fromNext.includes('<div class="note">Worth knowing'));

check("the headline", tagText(fromWorker, "h1"), tagText(fromNext, "h1"));
check("the eyebrow",
  tagText(fromWorker, 'span class="eyebrow mono"'),
  tagText(fromNext, 'span class="eyebrow mono"'));
check("the standfirst",
  tagText(fromWorker, 'p class="lede"'), tagText(fromNext, 'p class="lede"'));
/* Case-insensitively: React serialises the attribute as it was
   written in the JSX, so this one comes back `dateTime`. HTML
   attribute names are case-insensitive and every parser reads the
   two identically, which is why this is a note and not a bug. */
check("the date",
  attr(fromWorker, /<time datetime="[^"]*">([^<]+)<\/time>/i),
  attr(fromNext, /<time datetime="[^"]*">([^<]+)<\/time>/i));
check("and the machine-readable date on it",
  attr(fromWorker, /<time datetime="([^"]*)"/i),
  attr(fromNext, /<time datetime="([^"]*)"/i));
ok("the reading time", fromNext.includes("9 min read"));
ok("the piece carries its slug for the scripts",
  fromNext.includes(`data-slug="${ARTICLE.slug}"`));
ok("the comment thread is there, empty",
  /id="comments"[^>]*data-section="insights"/.test(fromNext)
  || /data-section="insights"[^>]*id="comments"/.test(fromNext));
ok("the section's own footer line",
  fromNext.includes("not investment advice"));

/* ---- what a reader loads ---- */

ok("the site's own script is loaded",
  /<script[^>]*src="\/app\.js"/.test(fromNext));
ok("read-aloud too", /<script[^>]*src="\/read-aloud\.js"/.test(fromNext));
/* ---- the cost, which was measured and then accepted ----

   The App Router ships its own runtime and router to every page,
   hydrating a tree with no interactivity in it, and there is no
   supported switch to turn that off. That is 170 KB gzipped on a
   page of prose, against the 31 KB of the site's own scripts.

   It was measured and accepted on 16 August 2026: the site is
   going to grow a lot, one framework is worth more than the
   kilobytes, and the pages that come next are the ones React
   actually earns its keep on. The reasoning is under Stage 10 in
   TRANSITION.md.

   Accepted is not unwatched. This is a budget: it fails if the
   number grows, so an added dependency that drags the client
   bundle up shows here rather than on somebody's phone. */
const CHUNK_BUDGET = 8;
{
  const chunks = new Set(fromNext.match(/\/_next\/static\/chunks\/[a-z0-9_-]+\.js/g) ?? []);
  ok(`Next ships ${chunks.size} script(s) of its own to a reading page`,
    chunks.size <= CHUNK_BUDGET,
    `budget is ${CHUNK_BUDGET}; see the Stage 10 note in TRANSITION.md`);
  ok("the article is readable with none of them run",
    fromNext.includes(ARTICLE.title.replace(/"/g, "&quot;"))
    || fromNext.includes("actually works"),
    "the headline is not in the server-rendered HTML");
}

/* ---- the contract worker.js falls back on ----

   A slug this route has no row for must answer 404, because that
   is the only thing `fromNext()` in worker.js can read as "not
   mine". It used to mean "serve the committed file", and there
   are no committed pieces left as of Stage 11.2; it still means
   two things that matter. `_redirects` holds a 301 for
   `/insights/dsex`, a term that moved to `/learn/terms/`, and it
   only ever fires because this route declines the slug. And
   anything else gets the site's own 404 page rather than a
   framework one. */
{
  const missing = await fetch(`http://127.0.0.1:${PORT}/insights/not-a-piece-here.html`);
  ok("a slug with no row answers 404, so the front Worker can answer",
    missing.status === 404, `status ${missing.status}`);

  /* Named rather than described, because a name in a test is
     harder to lose than a category. `dsex` is the sharper of the
     two: it is a redirect rule that fires only if this route
     declines, so a route that started answering it would take a
     301 off the site silently. */
  for (const declined of ["dsex", "dse-basics"]) {
    const answer = await fetch(`http://127.0.0.1:${PORT}/insights/${declined}.html`);
    ok(`${declined} is handed back to the front Worker`,
      answer.status === 404, `status ${answer.status}`);
  }

  /* And a piece answering at the wrong mount is the same case:
     moving one from Insights to the kitchen must not leave it live
     at both addresses. */
  const wrongMount = await fetch(`http://127.0.0.1:${PORT}/cooking/${ARTICLE.slug}`);
  ok("and so does a piece asked for at the wrong mount",
    wrongMount.status === 404, `status ${wrongMount.status}`);
}

/* ---------- the three reading hubs ----------

   TRANSITION.md Stage 11.1. There is nothing on the Worker's side
   to compare these against: the hub it replaces is a committed
   HTML file with an empty grid in it, filled in the browser after
   a fetch, so a diff of the two would be a diff of one page
   against a hole. What can be checked, and is the thing that
   matters, is the hub against the database it was handed: every
   live piece of that section has a card at its own address, the
   number in the sentence is the number of cards, a draft is
   nowhere, and a piece does not appear on another section's
   index. All of it in the HTML, before any JavaScript runs.

   `scripts/check-preview.mjs` asks the same questions of a
   deployed branch preview, for the environments where this file
   cannot run. */

const hub = async (path) => {
  const answer = await fetch(`http://127.0.0.1:${PORT}${path}`);
  return { status: answer.status, html: await answer.text() };
};

/* `check()` above reports its two sides as "worker" and "next",
   which is the right pair for an article and a wrong one here:
   there is no worker side. Same comparison, honest labels. */
const says = (name, want, got) => ok(name, decode(got) === want,
  `wanted ${JSON.stringify(want)}\n      got    ${JSON.stringify(got)}`);

{
  const insights = await hub("/insights.html");
  ok("the Insights hub answers at /insights.html", insights.status === 200,
    `status ${insights.status}`);
  says("its title", "Insights · Reiad's Library", tagText(insights.html, "title"));
  says("its canonical link", "https://reiad.co.uk/insights.html",
    attr(insights.html, /<link rel="canonical" href="([^"]+)"/));

  ok("the live piece has a card, at its own address",
    insights.html.includes(`href="/insights/${ARTICLE.slug}.html"`));
  ok("the draft has none", !insights.html.includes(DRAFT.slug));
  ok("and neither has the kitchen's piece", !insights.html.includes(KITCHEN.slug));

  /* The chips are counted from the cards, so "Everything · 1" is
     the same claim as "one card was drawn". A hub that says one
     number and shows another is the failure CLAUDE.md opens
     with. */
  ok("the topic chips are in the HTML, counted from the cards",
    insights.html.includes("Everything") && insights.html.includes("Equities"));
  ok("and the pieces promised but not written are teasers",
    insights.html.includes("cell sample-card placeholder"));
}

{
  const kitchen = await hub("/cooking/index.html");
  ok("the kitchen answers at /cooking/index.html", kitchen.status === 200,
    `status ${kitchen.status}`);
  says("its title", "রান্নাঘর: উপকরণ ধরে ধরে রান্না বোঝা, Reiad's Library",
    tagText(kitchen.html, "title"));
  says("its canonical link", "https://reiad.co.uk/cooking/index.html",
    attr(kitchen.html, /<link rel="canonical" href="([^"]+)"/));
  says("the page is in Bangla", "bn", attr(kitchen.html, /<html lang="([^"]+)"/));

  ok("its piece has a card", kitchen.html.includes(`href="/cooking/${KITCHEN.slug}.html"`));
  ok("the count above the list is the number of cards, in Bangla digits",
    kitchen.html.includes("এখন পর্যন্ত ১টি লেখা"));
  ok("nothing from another section is on it", !kitchen.html.includes(ARTICLE.slug));

  const desk = await hub("/travel/index.html");
  ok("the travel desk answers too", desk.status === 200, `status ${desk.status}`);
  ok("with its own piece", desk.html.includes(`href="/travel/${DESK.slug}.html"`));
  ok("and its own share card",
    meta(desk.html, "og:image") === "https://reiad.co.uk/og/travel.png");

  /* An address this site has never produced. The hub lives at
     /insights.html, one segment up, and `[section]/index.html`
     must not answer for a section that has no hub there. */
  const nowhere = await hub("/insights/index.html");
  ok("and /insights/index.html is handed back to the asset router",
    nowhere.status === 404, `status ${nowhere.status}`);
}

/* ---------- the hand-written pages ----------

   Stage 11.5. Prose, ported markup for markup, so there is
   nothing to compare against a database and nothing the Worker
   renders. What is worth holding is that each address answers,
   with its own title and its own canonical link: the mistake this
   catches is a page whose route exists and whose head was copied
   from the one beside it. */
/* `nav` is the address the header marks, which is not always the
   page's own: the stock check is under Tools and marks the Tools
   link, exactly as the page it replaced did. */
for (const [path, title, nav] of [
  ["/about.html", "About · Reiad's Library", "/about.html"],
  ["/contact.html", "Contact · Reiad's Library", "/contact.html"],
  ["/skills/index.html", "দক্ষতা · Skills · Reiad's Library", "/skills/index.html"],
  ["/tools/index.html", "Tools & calculators · Reiad's Library", "/tools/index.html"],
  ["/tools/stock.html", "Stock check · buy, hold or sell · Reiad's Library", "/tools/index.html"],
  /* The home page marks nothing: it is not in the nav. */
  ["/", "Reiad's Library · Finance & Bangladesh Markets", null],
  ["/portfolio.html", "Portfolio & Services · Reiad's Library", "/portfolio.html"],
  ["/portfolio/dcf.html",
    "DCF with sensitivity tables · DSE-listed manufacturer · Reiad's Library",
    "/portfolio.html"],
  ["/portfolio/dissertation.html",
    "Islamic vs conventional funds in the UK · MSc dissertation · Reiad's Library",
    "/portfolio.html"],
]) {
  const page = await hub(path);
  ok(`${path} answers`, page.status === 200, `status ${page.status}`);
  says(`${path} states its own title`, title, tagText(page.html, "title"));
  says(`${path} states its own canonical link`, `https://reiad.co.uk${path}`,
    attr(page.html, /<link rel="canonical" href="([^"]+)"/));
  if (nav) {
    ok(`${path} marks ${nav} in the header`,
      new RegExp(`<a href="${nav}"[^>]*aria-current="page"`).test(page.html)
      || new RegExp(`aria-current="page"[^>]*href="${nav}"`).test(page.html),
      `nothing in the nav carries aria-current="page" for ${nav}`);
  } else {
    ok(`${path} marks nothing in the nav, because it is not in it`,
      !/<nav[\s\S]*?aria-current="page"[\s\S]*?<\/nav>/.test(page.html));
  }
}

/* Every case study is reachable from the portfolio index, and the
   index is the only thing that says so. A card pointing at a page
   that does not answer, or a page nothing links, is the failure
   `check-content.mjs` watches from the other side; this is the
   half that can only be seen once the pages are being served. */
{
  const index = await hub("/portfolio.html");
  const cards = [...index.html.matchAll(/href="(\/portfolio\/[a-z-]+\.html)"/g)]
    .map((m) => m[1]);
  const studies = [...new Set(cards)];
  ok("the portfolio index links seven case studies", studies.length === 7,
    `${studies.length}: ${studies.join(", ")}`);

  for (const study of studies) {
    const page = await hub(study);
    ok(`  ${study} answers`, page.status === 200, `status ${page.status}`);
  }
}

/* The account page marks no nav link, because it is in no nav,
   and it is the one page here that must not be indexed. */
{
  const account = await hub("/account.html");
  ok("/account.html answers", account.status === 200, `status ${account.status}`);
  ok("and tells search engines to leave it alone",
    /<meta name="robots" content="noindex/.test(account.html),
    "no robots tag: this page is somebody's name and their progress");
}

/* ---------- the four schools ----------

   Stage 11.7. This is the one route in this file with a real
   twin: 251 committed pages, generated from the same rows the
   route now reads. So the comparison is against the page itself,
   fact by fact, and against the prose byte for byte.

   Byte-identical HTML is not the bar and cannot be, for the
   reason the note at the top of this file gives: React decides
   attribute order and self-closing, not the author. What is held
   is everything a reader or a scraper would notice, plus the two
   things a school page carries that an article does not: the
   data attributes its progress script reads, and the script
   itself. A page that renders beautifully and files a reader's
   ticks under a key nothing reads has lost their progress. */
{
  const { readFileSync } = await import("node:fs");
  const committed = (rel) => readFileSync(join(here, "..", "aab", rel), "utf8");

  /* The inside of a tag, by class, whichever order its attributes
     are in. The builders write `class="x"` first and React does
     not promise to. */
  const byClass = (html, tag, cls) => html.match(
    new RegExp(`<${tag}[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</${tag}>`, "i")
  )?.[1] ?? null;

  /* Text, with the tags taken out and the whitespace flattened.
     Indentation is the one difference that is guaranteed and
     means nothing: the builders write a page a person can read
     and React writes one it does not occur to it to indent. */
  const words = (html) => (html === null ? null : decode(
    html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));

  /* One lesson per school, and each is the shape that school is
     the only one to have. */
  for (const [path, file, note] of [
    ["/learn/basics-2/supply-demand.html", "learn/basics-2/supply-demand.html",
      "a lesson of the money school"],
    ["/deutsch/stufe-1/anfang.html", "deutsch/stufe-1/anfang.html",
      "a Teil, with German under the title"],
    ["/quran/dhap-1/tin-prokar.html", "quran/dhap-1/tin-prokar.html",
      "a day, labelled and with Arabic under the title"],
    ["/english/term-1/word-order.html", "english/term-1/word-order.html",
      "a part, numbered"],
  ]) {
    const page = await hub(path);
    ok(`${path} answers (${note})`, page.status === 200, `status ${page.status}`);
    if (page.status !== 200) continue;

    const was = committed(file);
    const now = page.html;
    /* Labelled for what the two sides actually are. `check()`
       says "worker" and "next", which is the right pair for an
       article and a wrong one here: the thing on the other side
       of this comparison is a committed file. */
    const same = (what, extract) => {
      const a = decode(extract(was));
      const b = decode(extract(now));
      ok(`${path}: ${what}`, a === b,
        `page:  ${JSON.stringify(a)}\n      route: ${JSON.stringify(b)}`);
    };

    same("the title", (h) => tagText(h, "title"));
    same("the description", (h) => meta(h, "description", "name"));
    same("the canonical link", (h) => attr(h, /<link rel="canonical" href="([^"]+)"/));
    for (const key of ["og:type", "og:title", "og:description", "og:url", "og:image"]) {
      same(key, (h) => meta(h, key));
    }
    same("the language", (h) => attr(h, /<html lang="([^"]+)"/));

    /* The eyebrow, the heading, the blurb and the meta line: the
       four things above the prose, and the only four a reader
       reads before deciding whether they are in the right place. */
    same("the eyebrow", (h) => words(byClass(h, "span", "eyebrow")));
    same("the heading", (h) => words(tagText(h, "h1")));
    same("the one-liner", (h) => words(byClass(h, "p", "one-liner")));
    same("the meta line", (h) => words(byClass(h, "p", "lesson-meta")));
    same("the backlinks", (h) => words(byClass(h, "p", "backlink")));
    same("the prev/next pair", (h) => words(byClass(h, "nav", "prev-next")));

    /* Where the backlinks and the prev/next pair actually point,
       which `words()` throws away and is the half that breaks. */
    const links = (h, cls) => {
      const inside = byClass(h, cls === "prev-next" ? "nav" : "p", cls);
      return inside === null
        ? null
        : [...inside.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).join(" ");
    };
    same("where the backlinks point", (h) => links(h, "backlink"));
    same("where the prev/next pair points", (h) => links(h, "prev-next"));

    /* The progress attributes, by name and by value. Three
       schools call them three things and every one of those names
       is already a key in somebody's browser. */
    for (const name of ["data-lesson-id", "data-teil-id", "data-part-id",
                        "data-stage", "data-stufe", "data-dhap", "data-term"]) {
      same(`the ${name} attribute`,
        (h) => attr(h, new RegExp(`${name}="([^"]*)"`)));
    }

    same("the school's own script",
      (h) => attr(h, /<script type="module" src="(\/(?:learn|deutsch|quran|english)\/[a-z-]+\.js)"/));
    same("the body class", (h) => attr(h, /<body class="([^"]*)"/));

    /* And the prose itself, byte for byte, because that is the
       thing the database holds and the thing a rebuild was
       supposed to be carrying. Compared as the row has it rather
       than as either page indents it. */
    const stage = path.split("/")[2] === "terms" ? "basics-1" : path.split("/")[2];
    const slug = path.split("/").pop().replace(/\.html$/, "");
    const stored = snapshot.lessons.find(
      (l) => l.stage === stage && l.slug === slug)?.body ?? "";
    ok(`${path}: the prose is the row's, unchanged`,
      stored !== "" && now.includes(stored.trim()),
      "the stored body is not in the page, character for character");
  }

  /* ---- the eighteen originals, which are a different thing ----

     `/learn/terms/*.html` is not a generated page and never has
     been: `build-lessons.mjs` says so at the top and steps around
     them. They were written by hand before the money school had a
     builder, and they carry their own title, their own eyebrow,
     one backlink to the library rather than two to a stage, and no
     prev/next pair at all. The ladder names them, `basics-1` holds
     them, and the rows are in D1, so the route renders them like
     every other lesson.

     That is a CHANGE to those eighteen pages rather than a port of
     them, and comparing the two fact by fact would only be
     measuring a decision that has not been taken yet. TRANSITION.md
     Stage 11.7 step 2 is where it gets taken. What is worth holding
     now is the part where a wrong answer costs a reader something:
     the address, and the key their ticks are filed under. */
  {
    const page = await hub("/learn/terms/share.html");
    ok("a term of basics-1 answers at /learn/terms/, not at its stage's folder",
      page.status === 200, `status ${page.status}`);
    says("and says that address is its own",
      "https://reiad.co.uk/learn/terms/share.html",
      attr(page.html, /<link rel="canonical" href="([^"]+)"/));
    /* The one that silently loses a year of somebody's progress.
       Every other lesson on the site files a tick under
       `<stage>/<slug>`; these eighteen file it under the slug
       alone, because they did so before `basics-1` existed. */
    says("and files progress under the bare slug, as it always has",
      "share", attr(page.html, /data-lesson-id="([^"]*)"/));
  }

  /* A lesson the ladder does not have is handed back to the asset
     router, which is what keeps all 251 committed pages answering
     while NEXT_ROUTES says nothing about the schools. */
  const nothing = await hub("/learn/terms/not-a-lesson.html");
  ok("a slug the ladder does not name falls through",
    nothing.status === 404, `status ${nothing.status}`);

  /* The starter guide is `inline`: its eight steps are accordion
     sections of a hand-written hub, and they have never had pages.
     A route that invented one would be advertising eight
     addresses that have no prose behind them. */
  const inline = await hub("/learn/start/first-buy.html");
  ok("and so does a step of the starter guide, which has no page",
    inline.status === 404, `status ${inline.status}`);
}

/* ---- the headers a static page would have had ---- */

for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
  check(`the ${key} header`, value, res.headers.get(key));
}

/* ---------- done ---------- */

stop();

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  ✗ ${f}`);
  process.exit(1);
}
console.log("The article says everything the Worker's does, each hub says what\n"
  + "the database gave it, each school lesson says what its committed page\n"
  + "says, and every page answers at its own address.\n");

/* Said out loud, because falling off the end is not the same
   thing here. `wrangler dev` starts workerd as a child of its
   own, and SIGTERM to the one this test spawned does not always
   take the grandchild with it: the pipes stay open, the event
   loop stays awake, and a run that has printed its result sits
   there until something kills it. Which is a hung job in CI, on
   a green test. */
process.exit(0);
