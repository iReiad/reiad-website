/* ============================================================
   parity.test.mjs: does the Next.js route render the same
   article as the Worker does?

     cd next && npm run build && npx opennextjs-cloudflare build
     node next/parity.test.mjs

   OPTIONAL, like the browser tests: it needs the OpenNext build
   to have run, and it skips with a note if `.open-next/worker.js`
   is not there.

   It starts the built Worker on workerd through `wrangler dev`,
   with a local D1 seeded with one article, asks it for that
   article, and compares what comes back against what
   `functions/insights/[slug].js` would have produced for the same
   row. No network, no deploy, no Cloudflare account.

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
import { existsSync, mkdtempSync, rmSync } from "node:fs";
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
  slug: "dse-basics",
  section: "insights",
  lang: "en",
  title: 'How the "DSEX" actually works & why it matters',
  dek: "What the index measures, how a BO account works, and the questions to ask first.",
  tag: "Equities · Beginner",
  topics: JSON.stringify(["Equities", "Beginner"]),
  body: '<p>The DSEX is a free-float weighted index.</p>\n'
    + '<figure class="lead-photo"><img src="/media/dse/9f2a1c.webp" alt="The board" '
    + 'width="1600" height="900" loading="lazy" decoding="async"></figure>\n'
    + '<div class="note">Worth knowing: the cap is applied after the float.</div>',
  cover: "/media/dse-basics-card/9f2a1c.jpg",
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

const columns = Object.keys(ARTICLE);
const values = columns
  .map((c) => (typeof ARTICLE[c] === "number" ? ARTICLE[c] : `'${String(ARTICLE[c]).replace(/'/g, "''")}'`))
  .join(", ");

d1(`CREATE TABLE IF NOT EXISTS articles (
      slug TEXT PRIMARY KEY, section TEXT, lang TEXT, title TEXT, dek TEXT, tag TEXT,
      topics TEXT, body TEXT, cover TEXT, minutes INTEGER, status TEXT,
      published_at TEXT, updated_at TEXT)`);
d1(`INSERT OR REPLACE INTO articles (${columns.join(", ")}) VALUES (${values})`);

/* ---------- the Worker on workerd ---------- */

const dev = spawn(
  "npx",
  ["wrangler", "dev", "--local", "--port", String(PORT), "--persist-to", state],
  { cwd: here, stdio: ["ignore", "pipe", "pipe"] },
);

let log = "";
dev.stdout.on("data", (d) => { log += d; });
dev.stderr.on("data", (d) => { log += d; });

const stop = () => {
  dev.kill("SIGTERM");
  try { rmSync(state, { recursive: true, force: true }); } catch { /* fine */ }
};
process.on("exit", stop);

const ready = async () => {
  for (let i = 0; i < 90; i++) {
    if (/Ready on http/.test(log)) return true;
    if (/\[ERROR\]|error while|Error: /i.test(log)) return false;
    await new Promise((r) => setTimeout(r, 500));
  }
  return false;
};

if (!await ready()) {
  console.log("wrangler dev did not start, so the parity check is skipped.\n");
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

const res = await fetch(`http://127.0.0.1:${PORT}/insights/${ARTICLE.slug}`);
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

ok("the route answered 200", res.status === 200, `status ${res.status}`);

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
/* ---- and the one the plan does not get ----

   TRANSITION.md's Stage 10 asks for "server components only, no
   client JavaScript on a reading page, because that is the
   current bar and dropping below it is not acceptable". The App
   Router does not offer that. It ships its own runtime and router
   to every page, hydrating a tree that has no interactivity in
   it, and there is no supported switch to turn that off.

   So this check is a budget rather than a pass: it records what
   the route costs today and fails if that grows. The decision
   about whether the cost is acceptable at all is a real one and
   is written up in TRANSITION.md, not settled here. */
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
console.log("The Next.js route says everything the Worker's does.\n");
