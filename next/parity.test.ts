/* Does the Next.js route render the same article as the Worker, and do
   the hubs and school pages agree with the database?
     cd next && npm run build && npx opennextjs-cloudflare build
     node next/parity.test.ts
   Needs the OpenNext build and SKIPS without `.open-next/worker.js`; a
   skip is not a pass. Byte-identical head markup is not the bar and
   cannot be: React decides attribute order and self-closing. Every fact
   is compared one tag at a time, the article's own HTML as a string. */

import { spawn, execFileSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import type { Row } from "../scripts/schools-snapshot.ts";

const here = dirname(fileURLToPath(import.meta.url));
const PORT = 8787;

if (!existsSync(join(here, ".open-next/worker.js"))) {
  console.log("No .open-next/worker.js, so the parity check is skipped.");
  console.log("  cd next && npx opennextjs-cloudflare build");
  process.exit(0);
}

/* ---------- the article both renderers are given ---------- */

/** One row of `articles`, as this fixture writes it. */
interface Article {
  slug: string;
  section: string;
  lang: string;
  title: string;
  dek: string;
  tag: string;
  topics: string;
  body: string;
  cover: string;
  minutes: number;
  status: string;
  published_at: string;
  updated_at: string;
}

const ARTICLE: Article = {
      /* Not the slug of anything real: a fixture that collides with real
         data tests the fixture. */
  slug: "rate-cycle",
  section: "insights",
  lang: "en",
  title: 'How the "DSEX" actually works & why it matters',
  dek: "What the index measures, how a BO account works, and the questions to ask first.",
  tag: "Equities · Beginner",
      /* Pipe-separated, which is what the column holds: `/api/articles`
         and the hub route both split on it. */
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

const d1 = (sql: string) => execFileSync(
  "npx",
  ["wrangler", "d1", "execute", "reiad", "--local", "--persist-to", state, "--command", sql],
  { cwd: here, stdio: "pipe" },
);

    /* Three more rows for the hubs: one live piece per Bangla section, so
       the cards and the count are drawn from something, and one draft,
       which must appear nowhere. Slugs nothing real is called. */
const KITCHEN: Article = {
  ...ARTICLE,
  slug: "parity-kitchen", section: "cooking", lang: "bn",
  title: "পেঁয়াজ কাটার আসল নিয়ম", dek: "শিরা বরাবর কাটলে কী বদলায়।",
  tag: "রান্নাঘর · উপকরণ", topics: "উপকরণ|কৌশল", minutes: 12,
  cover: "", published_at: "2026-07-02",
};
const DESK: Article = {
  ...ARTICLE,
  slug: "parity-travel", section: "travel", lang: "bn",
  title: "ভিসার কাগজপত্র", dek: "কোন কাগজে সবচেয়ে বেশি নজর পড়ে।",
  tag: "ভ্রমণ · ভিসা", topics: "ভিসা", minutes: 9,
  cover: "", published_at: "2026-07-03",
};
const DRAFT: Article = {
  ...ARTICLE,
  slug: "parity-draft", section: "insights", status: "draft",
  title: "Not published yet", published_at: "",
};

    /* `Object.keys` is typed `string[]`, because a value may carry keys
       its type does not name. */
const columns = Object.keys(ARTICLE) as Array<keyof Article>;
const row = (article: Article) => columns
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
       Seeded from `content/schools.backup.json` rather than invented, and
       four stages rather than seventeen: the whole export is a megabyte
       and `wrangler d1 execute` takes it one statement at a time. The four
       cover the four shapes a school page has. */
const { readSnapshot } = await import("../scripts/schools-snapshot.ts");
const snapshot = readSnapshot();

    /* `basics-2` is the money school's first generated stage; `basics-1`
       is the eighteen original terms at /money/terms/, compared for less
       below. The other three are the first written stage of each language
       school. */
const SEEDED = ["start", "basics-1", "basics-2", "basics-3", "stufe-1", "dhap-1", "term-1"];

d1(`CREATE TABLE IF NOT EXISTS school_stages (
      school TEXT, slug TEXT, position INTEGER, title TEXT, status TEXT, meta TEXT,
      PRIMARY KEY (school, slug))`);
d1(`CREATE TABLE IF NOT EXISTS school_sections (
      school TEXT, stage TEXT, ident TEXT, position INTEGER, title TEXT, meta TEXT,
      PRIMARY KEY (school, stage, ident))`);
    /* `body_en` and `blocks` are columns rather than fields inside `meta`:
       `stagesOf()` selects `meta` for every lesson of a school to draw a
       ladder. Without them here every money lesson renders as its Bangla
       half with empty gaps where the blocks go, and passes. */
d1(`CREATE TABLE IF NOT EXISTS school_lessons (
      school TEXT, stage TEXT, slug TEXT, section TEXT, position INTEGER,
      title TEXT, minutes INTEGER, status TEXT, meta TEXT, body TEXT,
      body_en TEXT DEFAULT '', blocks TEXT DEFAULT '{}',
      PRIMARY KEY (school, stage, slug))`);

const q = (v: unknown) => (v === null || v === undefined
  ? "NULL"
  : typeof v === "number" ? String(v) : `'${String(v).replace(/'/g, "''")}'`);
const insert = (table: string, cols: string[], r: Row) =>
  `INSERT OR REPLACE INTO ${table} (${cols.join(", ")}) `
  + `VALUES (${cols.map((c) => q(r[c])).join(", ")});`;

    /* Every stage of every school, because a ladder needs its neighbours:
       a stage list with holes in it points at the wrong place. Written to
       one file and executed once: `wrangler d1 execute --command` is a
       whole node process per call and these are seventy rows. */
const statements = [
  ...snapshot.stages.map((r) =>
    insert("school_stages", ["school", "slug", "position", "title", "status", "meta"], r)),
  ...snapshot.sections.filter((x) => SEEDED.includes(String(x.stage))).map((r) =>
    insert("school_sections", ["school", "stage", "ident", "position", "title", "meta"], r)),
  ...snapshot.lessons.filter((x) => SEEDED.includes(String(x.stage))).map((r) =>
    insert("school_lessons",
      ["school", "stage", "slug", "section", "position", "title", "minutes",
       "status", "meta", "body", "body_en", "blocks"], r)),
];

const seedFile = join(state, "schools.sql");
writeFileSync(seedFile, `${statements.join("\n")}\n`);
execFileSync("npx",
  ["wrangler", "d1", "execute", "reiad", "--local", "--persist-to", state,
   "--file", seedFile],
  { cwd: here, stdio: "pipe" });

/* ---------- the Worker on workerd ---------- */

    /* Its own process group, so stopping it stops workerd too. `wrangler
       dev` runs workerd as a child of its own, and a SIGTERM to wrangler
       alone leaves that grandchild holding the port. */
const dev = spawn(
  "npx",
  ["wrangler", "dev", "--local", "--port", String(PORT), "--persist-to", state],
  { cwd: here, stdio: ["ignore", "pipe", "pipe"], detached: true },
);

let log = "";
dev.stdout.on("data", (d) => { log += d; });
dev.stderr.on("data", (d) => { log += d; });

let gone: number | string | null = null;
dev.on("exit", (code, signal) => { gone = code ?? signal ?? "gone"; });

const stop = () => {
      /* The whole group, so workerd goes with wrangler. A child with no
         pid has already gone. */
  try {
    if (dev.pid) process.kill(-dev.pid, "SIGTERM");
    else dev.kill("SIGTERM");
  } catch { dev.kill("SIGTERM"); }
  try { rmSync(state, { recursive: true, force: true }); } catch { /* fine */ }
};
process.on("exit", stop);

    /* Ready, or one of three ways of not being ready. Do NOT give up on a
       line matching `Error: `: `wrangler dev` prints exactly that,
       harmlessly, wherever there is no outbound network, and then starts
       perfectly forty seconds later. A real failure is the process being
       gone, or wrangler's own bracketed `[ERROR]` marker, which a thrown
       stack does not have. Everything else is waited out. */
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
    + "scripts/check-preview.ts asks the same questions of a deployed\n"
    + "branch preview instead.\n");
  console.log(log.split("\n").slice(-15).join("\n"));
  stop();
  process.exit(0);
}
// The first request compiles the route; give the server a moment.
await new Promise((r) => setTimeout(r, 500));

/* ---------- the two renderings ---------- */

const ORIGIN = "https://reiad.co.uk";
const { render } = await import("../functions/insights/[slug].ts");
const { SECURITY_HEADERS } = await import("../shared/headers.ts");

    /* Asked for at the address the piece actually has: `pieceUrl()` builds
       `/insights/<slug>.html`, which is the canonical link, the sitemap
       entry and every internal link. The extensionless form answers 404. */
const res = await fetch(`http://127.0.0.1:${PORT}/insights/${ARTICLE.slug}.html`);
const fromNext = await res.text();
const fromWorker = render(ARTICLE, ORIGIN);

/* ---------- the checks ---------- */

let passed = 0;
const failures: string[] = [];

    /* Compared after decoding, because the two renderers escape
       differently and neither is wrong: React writes `&#x27;` and `&amp;`
       where a template string writes the bare character, and a browser
       parses both to the same string. */
const NAMED: Record<string, string> = {
  amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: "\u00a0",
};
const decode = (v: string | null): string | null => (typeof v === "string"
  ? v.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (whole: string, body: string) => {
      if (body[0] === "#") {
        const code = body[1] === "x" || body[1] === "X"
          ? parseInt(body.slice(2), 16) : parseInt(body.slice(1), 10);
        return Number.isFinite(code) ? String.fromCodePoint(code) : whole;
      }
      return NAMED[body] ?? whole;
    })
  : v);

const check = (name: string, a: string | null, b: string | null): void => {
  if (decode(a) === decode(b)) { passed++; return; }
  failures.push(`${name}\n      worker: ${JSON.stringify(a)}\n      next:   ${JSON.stringify(b)}`);
};
const ok = (name: string, condition: unknown, detail = ""): void => {
  if (condition) { passed++; return; }
  failures.push(name + (detail ? `\n      ${detail}` : ""));
};

/** The content of a meta tag, whichever order its attributes are in. */
const meta = (html: string, key: string, attr = "property"): string | null => {
  const re = new RegExp(
    `<meta[^>]*(?:${attr}="${key}"[^>]*content="([^"]*)"`
    + `|content="([^"]*)"[^>]*${attr}="${key}")`, "i");
  const m = html.match(re);
  return m ? (m[1] ?? m[2]) : null;
};
    /** The money school's own name, as it is now, wherever a committed
        page still says what it was. Substituting rather than skipping
        keeps the rest of a page title compared character for character. */
    /** An address as it is now, wherever a committed page says where it
        used to be. The money school moved from /learn/ to /money/ and
        there is no redirect: the old addresses are gone. Only the hub,
        ladder and practice-book shapes lose `.html` here; a LESSON keeps
        its suffix, and stripping it everywhere would stop this test
        noticing a lesson link that lost one. */
const moved = (v: string | null): string | null => {
  if (typeof v !== "string") return v;
  return v
    .replaceAll("/learn/learn.js", "/money/reader.js")
    .replaceAll("/learn/", "/money/")
    .replace(/\/index\.html\b/g, "")
    .replace(/(\/(?:arbeitsbuch|workbook|contents))\.html\b/g, "$1");
};

const renamed = (v: string | null): string | null =>
  (typeof v === "string" ? v.replaceAll("\u09b6\u09c7\u0996\u09be\u09b0 \u09b2\u09be\u0987\u09ac\u09cd\u09b0\u09c7\u09b0\u09bf", "\u099f\u09be\u0995\u09be \u0993 \u09b6\u09c7\u09af\u09bc\u09be\u09b0") : v);

    /* ---------- sentences that were changed on purpose ----------
       Holding today's copy to the committed pages word for word would mean
       it can never change again, which is not what this is for: it is for
       a PORT that changed the words without meaning to. A deliberate
       change goes here, keyed by what the old page said, and every other
       word is still held exactly. A pair whose left side no longer appears
       anywhere is dead weight: delete it rather than keep it. */
const REWRITTEN = [
  ["\u09ac\u09bf\u09a8\u09be\u09ae\u09c2\u09b2\u09cd\u09af\u09c7, \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc, \u0986\u09b0 \u0995\u09cb\u09a8\u09cb \u09b2\u0997\u0987\u09a8 \u099b\u09be\u09dc\u09be\u0964",
   "\u09ac\u09bf\u09a8\u09be\u09ae\u09c2\u09b2\u09cd\u09af\u09c7, \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc\u0964"],
  ["\u09ac\u09bf\u09a8\u09be\u09ae\u09c2\u09b2\u09cd\u09af\u09c7, \u09b2\u0997\u0987\u09a8 \u099b\u09be\u09dc\u09be\u0964", "\u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc, \u09ac\u09bf\u09a8\u09be\u09ae\u09c2\u09b2\u09cd\u09af\u09c7\u0964"],
  ["\u0986\u09aa\u09a8\u09be\u09b0 \u0985\u0997\u09cd\u09b0\u0997\u09a4\u09bf \u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09bf\u099c\u09c7\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 \u09a5\u09be\u0995\u09c7\u0964",
   "\u0986\u09aa\u09a8\u09be\u09b0 \u0985\u0997\u09cd\u09b0\u0997\u09a4\u09bf \u099c\u09ae\u09be \u09a5\u09be\u0995\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f\u09c7\u0964"],
  ["\u0995\u09cb\u09a8\u09cb \u09b2\u0997\u0987\u09a8 \u09a8\u09c7\u0987, \u0995\u09cb\u09a8\u09cb \u09a6\u09be\u09ae \u09a8\u09c7\u0987 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09b2\u09be\u0997\u09c7 \u09a8\u09be, \u0987\u09ae\u09c7\u0987\u09b2 \u09b2\u09be\u0997\u09c7 \u09a8\u09be, \u0985\u09cd\u09af\u09be\u09aa \u09a8\u09be\u09ae\u09be\u09a4\u09c7 \u09b9\u09af\u09bc \u09a8\u09be\u0964 \u0986\u09aa\u09a8\u09be\u09b0 \u0985\u0997\u09cd\u09b0\u0997\u09a4\u09bf \u0986\u09b0 \u0986\u09aa\u09a8\u09be\u09b0 \u09b2\u09c7\u0996\u09be \u0995\u09a5\u09be\u0997\u09c1\u09b2\u09cb \u098f\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 \u099c\u09ae\u09be \u09a5\u09be\u0995\u09c7, \u0995\u09cb\u09a5\u09be\u0993 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc \u09a8\u09be\u0964",
   "\u09aa\u09a1\u09bc\u09a4\u09c7 \u0995\u09cb\u09a8\u09cb \u099f\u09be\u0995\u09be \u09b2\u09be\u0997\u09c7 \u09a8\u09be \u099c\u09be\u09b0\u09cd\u09ae\u09be\u09a8\u09c7\u09b0 \u09b8\u09ac \u09aa\u09be\u09a0 \u09ab\u09cd\u09b0\u09bf, \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc\u0964 \u0995\u09cb\u09a8 \u09aa\u09be\u09a0\u099f\u09be \u09aa\u09a1\u09bc\u09be \u09b9\u09af\u09bc\u09c7\u099b\u09c7 \u09b8\u09c7\u099f\u09be \u099c\u09ae\u09be \u09a5\u09be\u0995\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f\u09c7, \u09a4\u09be\u0987 \u09ab\u09cb\u09a8\u09c7 \u09af\u09c7\u0996\u09be\u09a8\u09c7 \u09a5\u09be\u09ae\u09ac\u09c7\u09a8 \u09b2\u09cd\u09af\u09be\u09aa\u099f\u09aa\u09c7 \u09b8\u09c7\u0996\u09be\u09a8 \u09a5\u09c7\u0995\u09c7\u0987 \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09ac\u09c7\u09a8\u0964 \u0996\u09be\u09a4\u09be\u09af\u09bc \u09af\u09be \u09b2\u09c7\u0996\u09c7\u09a8 \u09b8\u09c7\u099f\u09be \u09a5\u09be\u0995\u09c7 \u098f\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987, \u0995\u09cb\u09a5\u09be\u0993 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc \u09a8\u09be\u0964"],
  ["\u0995\u09cb\u09a8\u09cb \u09b2\u0997\u0987\u09a8 \u09a8\u09c7\u0987, \u0995\u09cb\u09a8\u09cb \u09a6\u09be\u09ae \u09a8\u09c7\u0987 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09b2\u09be\u0997\u09c7 \u09a8\u09be, \u0987\u09ae\u09c7\u0987\u09b2 \u09b2\u09be\u0997\u09c7 \u09a8\u09be, \u0985\u09cd\u09af\u09be\u09aa \u09a8\u09be\u09ae\u09be\u09a4\u09c7 \u09b9\u09af\u09bc \u09a8\u09be\u0964 \u0995\u09cb\u09a8 \u09a6\u09bf\u09a8\u0997\u09c1\u09b2\u09cb \u09b9\u09af\u09bc\u09c7\u099b\u09c7 \u09b8\u09c7\u0987 \u09b9\u09bf\u09b8\u09be\u09ac \u0986\u09aa\u09a8\u09be\u09b0 \u098f\u0987 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u0987 \u099c\u09ae\u09be \u09a5\u09be\u0995\u09c7, \u0995\u09cb\u09a5\u09be\u0993 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc \u09a8\u09be\u0964",
   "\u09aa\u09a1\u09bc\u09a4\u09c7 \u0995\u09cb\u09a8\u09cb \u099f\u09be\u0995\u09be \u09b2\u09be\u0997\u09c7 \u09a8\u09be \u0995\u09c1\u09b0\u0986\u09a8\u09c7\u09b0 \u0986\u09b0\u09ac\u09bf\u09b0 \u09b8\u09ac \u09aa\u09be\u09a0 \u09ab\u09cd\u09b0\u09bf, \u09ac\u09be\u0982\u09b2\u09be\u09af\u09bc\u0964 \u0995\u09cb\u09a8 \u09a6\u09bf\u09a8\u0997\u09c1\u09b2\u09cb \u09b9\u09af\u09bc\u09c7\u099b\u09c7 \u09b8\u09c7\u0987 \u09b9\u09bf\u09b8\u09be\u09ac \u099c\u09ae\u09be \u09a5\u09be\u0995\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f\u09c7, \u09a4\u09be\u0987 \u09ab\u09cb\u09a8\u09c7 \u09af\u09c7\u0996\u09be\u09a8\u09c7 \u09a5\u09be\u09ae\u09ac\u09c7\u09a8 \u09b2\u09cd\u09af\u09be\u09aa\u099f\u09aa\u09c7 \u09b8\u09c7\u0996\u09be\u09a8 \u09a5\u09c7\u0995\u09c7\u0987 \u09b6\u09c1\u09b0\u09c1 \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09ac\u09c7\u09a8\u0964"],
  ["\u09a8\u09bf\u099c\u09c7\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7, \u0986\u09aa\u09a8\u09be\u09b0 \u09a1\u09bf\u09ad\u09be\u0987\u09b8\u09c7\u0987\u0964 \u0995\u09cb\u09a5\u09be\u0993 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc \u09a8\u09be, \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09b2\u09be\u0997\u09c7 \u09a8\u09be\u0964 \u0985\u09a8\u09cd\u09af \u09ab\u09cb\u09a8\u09c7 \u0996\u09c1\u09b2\u09b2\u09c7 \u09a8\u09a4\u09c1\u09a8 \u0995\u09b0\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u09ac\u09c7, \u0986\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u09b0 \u09a1\u09c7\u099f\u09be \u09ae\u09c1\u099b\u09b2\u09c7 \u09b9\u09bf\u09b8\u09be\u09ac\u099f\u09be\u0993 \u099a\u09b2\u09c7 \u09af\u09be\u09ac\u09c7\u0964",
   "\u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f\u09c7\u0964 \u09af\u09c7 \u09a1\u09bf\u09ad\u09be\u0987\u09b8 \u09a5\u09c7\u0995\u09c7\u0987 \u0996\u09c1\u09b2\u09c1\u09a8 \u09b9\u09bf\u09b8\u09be\u09ac\u099f\u09be \u098f\u0995 \u09a5\u09be\u0995\u09c7: \u09ab\u09cb\u09a8\u09c7 \u099f\u09bf\u0995 \u09a6\u09bf\u09b2\u09c7 \u09b2\u09cd\u09af\u09be\u09aa\u099f\u09aa\u09c7\u0993 \u09a6\u09c7\u0996\u09be\u09ac\u09c7\u0964"],
  ["\u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09bf\u099c\u09c7\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7, \u0986\u09aa\u09a8\u09be\u09b0 \u09a1\u09bf\u09ad\u09be\u0987\u09b8\u09c7\u0987\u0964 \u0995\u09cb\u09a5\u09be\u0993 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc \u09a8\u09be, \u0995\u09cb\u09a8\u09cb \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f \u09b2\u09be\u0997\u09c7 \u09a8\u09be, \u0995\u09cb\u09a8\u09cb \u09b2\u0997\u0987\u09a8 \u09a8\u09c7\u0987\u0964 \u0985\u09a8\u09cd\u09af \u09ab\u09cb\u09a8\u09c7 \u0996\u09c1\u09b2\u09b2\u09c7 \u09a8\u09a4\u09c1\u09a8 \u0995\u09b0\u09c7 \u09b6\u09c1\u09b0\u09c1 \u09b9\u09ac\u09c7, \u0986\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u09b0 \u09a1\u09c7\u099f\u09be \u09ae\u09c1\u099b\u09b2\u09c7 \u09b2\u09c7\u0996\u09be\u0997\u09c1\u09b2\u09cb\u0993 \u099a\u09b2\u09c7 \u09af\u09be\u09ac\u09c7, \u09a4\u09be\u0987 \u0997\u09c1\u09b0\u09c1\u09a4\u09cd\u09ac\u09aa\u09c2\u09b0\u09cd\u09a3 \u0995\u09bf\u099b\u09c1 \u09b2\u09bf\u0996\u09b2\u09c7 \u09a8\u09bf\u099c\u09c7\u09b0 \u0996\u09be\u09a4\u09be\u09a4\u09c7\u0993 \u09b2\u09bf\u0996\u09c7 \u09b0\u09be\u0996\u09c1\u09a8\u0964",
   "\u0996\u09be\u09a4\u09be\u09af\u09bc \u09af\u09be \u09b2\u09c7\u0996\u09c7\u09a8 \u09b8\u09c7\u099f\u09be \u09a5\u09be\u0995\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u09a8\u09bf\u099c\u09c7\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7, \u0986\u09aa\u09a8\u09be\u09b0 \u09a1\u09bf\u09ad\u09be\u0987\u09b8\u09c7\u0987\u0964 \u0995\u09cb\u09a5\u09be\u0993 \u09aa\u09be\u09a0\u09be\u09a8\u09cb \u09b9\u09af\u09bc \u09a8\u09be\u0964 \u0985\u09a8\u09cd\u09af \u09ab\u09cb\u09a8\u09c7 \u0996\u09c1\u09b2\u09b2\u09c7 \u0998\u09b0\u0997\u09c1\u09b2\u09cb \u0996\u09be\u09b2\u09bf \u09aa\u09be\u09ac\u09c7\u09a8, \u0986\u09b0 \u09ac\u09cd\u09b0\u09be\u0989\u099c\u09be\u09b0\u09c7\u09b0 \u09a1\u09c7\u099f\u09be \u09ae\u09c1\u099b\u09b2\u09c7 \u09b2\u09c7\u0996\u09be\u0997\u09c1\u09b2\u09cb\u0993 \u099a\u09b2\u09c7 \u09af\u09be\u09ac\u09c7, \u09a4\u09be\u0987 \u0997\u09c1\u09b0\u09c1\u09a4\u09cd\u09ac\u09aa\u09c2\u09b0\u09cd\u09a3 \u0995\u09bf\u099b\u09c1 \u09b2\u09bf\u0996\u09b2\u09c7 \u09a8\u09bf\u099c\u09c7\u09b0 \u0996\u09be\u09a4\u09be\u09a4\u09c7\u0993 \u09b2\u09bf\u0996\u09c7 \u09b0\u09be\u0996\u09c1\u09a8\u0964 \u0995\u09cb\u09a8 \u09a6\u09bf\u09a8\u0997\u09c1\u09b2\u09cb \u09b9\u09af\u09bc\u09c7\u099b\u09c7, \u09b8\u09c7\u0987 \u09b9\u09bf\u09b8\u09be\u09ac\u099f\u09be \u0986\u09b2\u09be\u09a6\u09be: \u09b8\u09c7\u099f\u09be \u099c\u09ae\u09be \u09a5\u09be\u0995\u09c7 \u0986\u09aa\u09a8\u09be\u09b0 \u0985\u09cd\u09af\u09be\u0995\u09be\u0989\u09a8\u09cd\u099f\u09c7\u0964"],
];

    /* NFC on both sides before the substitution, because Bangla spells the
       same letter as one code point or as two: they render identically,
       and a table written in one form matches nothing in the other. */
const rewritten = (v: string | null): string | null => (typeof v !== "string" ? v
  : REWRITTEN.reduce((s, [was, now]) => s.replaceAll(was.normalize("NFC"), now),
                     v.normalize("NFC")));

const tagText = (html: string, tag: string): string | null =>
  html.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i"))?.[1] ?? null;
const attr = (html: string, re: RegExp): string | null => html.match(re)?.[1] ?? null;

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
    /* NOT "both link the same href": Next emits the stylesheet under a
       content hash and a response a Worker builds cannot know the hash.
       What is worth asking is that each links A stylesheet, and that the
       Worker's names a file that exists. */
{
  const workerCss = attr(fromWorker, /<link rel="stylesheet" href="(\/[^"]+\.css)"/);
  const nextCss = attr(fromNext, /<link rel="stylesheet" href="([^"]+\.css)"/);
  ok("the Worker links a stylesheet", Boolean(workerCss), "no <link rel=stylesheet>");
  ok("and so does the route", Boolean(nextCss), "no <link rel=stylesheet>");
  ok("and the Worker's is a file that exists",
    workerCss !== null && existsSync(join(here, "..", "aab", workerCss.slice(1))),
    `aab${workerCss} is not there, so the page is served unstyled`);
}
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
    /* Case-insensitively: React serialises the attribute as it was written
       in the JSX, so this comes back `dateTime`, and HTML attribute names
       are case-insensitive. */
check("the date",
  attr(fromWorker, /<time datetime="[^"]*">([^<]+)<\/time>/i),
  attr(fromNext, /<time datetime="[^"]*">([^<]+)<\/time>/i));
check("and the machine-readable date on it",
  attr(fromWorker, /<time datetime="([^"]*)"/i),
  attr(fromNext, /<time datetime="([^"]*)"/i));
ok("the reading time", fromNext.includes("9 min read"));
ok("the piece carries its slug for the scripts",
  fromNext.includes(`data-slug="${ARTICLE.slug}"`));
    /* The thread's own heading, server-rendered: the client component's
       first paint arriving in the HTML rather than a tick after it. */
ok("the comment thread is there", /id="comments"/.test(fromNext));
ok("and its heading is server-rendered rather than written in later",
  /class="comment-title"[^>]*>Comments</.test(fromNext),
  "no <h2 class=comment-title> in the HTML the route served");
ok("the section's own footer line",
  fromNext.includes("not investment advice"));

/* ---- what a reader loads ---- */

    /* Named in a preload link rather than written out as a `<script>` tag.
       A module the page runs before React has hydrated is a module whose
       work React then undoes: see `components/scripts.tsx`. Either
       spelling counts here: the question is whether the page loads it. */
const loads = (html: string, src: string): boolean =>
  new RegExp(`<script[^>]*src="${src}"`).test(html)
  || new RegExp(`<link[^>]*rel="(?:modulepreload|preload)"[^>]*href="${src}"`).test(html)
  || new RegExp(`<link[^>]*href="${src}"[^>]*rel="(?:modulepreload|preload)"`).test(html);

ok("the site's own script is loaded", loads(fromNext, "\\/app\\.js"));
    /* No `/read-aloud.js`: the speech control is
       `components/read-aloud.tsx`, and the Worker's own renderer cannot
       mount a component. */
ok("and nothing asks for a module that has been archived",
  !loads(fromNext, "\\/read-aloud\\.js") && !loads(fromWorker, "\\/read-aloud\\.js"));
    /* ---- the client bundle, which is a budget ----
       The App Router ships its own runtime and router to every page and
       there is no supported switch to turn it off: 170 KB gzipped against
       the 31 KB of the site's own scripts. This fails if the number grows,
       so a dependency that drags the bundle up shows here rather than on
       somebody's phone. */
const CHUNK_BUDGET = 8;
{
  const chunks = new Set(fromNext.match(/\/_next\/static\/chunks\/[a-z0-9_-]+\.js/g) ?? []);
  ok(`Next ships ${chunks.size} script(s) of its own to a reading page`,
    chunks.size <= CHUNK_BUDGET,
    `budget is ${CHUNK_BUDGET}; see the Stage 10 note in archive/TRANSITION.md`);
  ok("the article is readable with none of them run",
    fromNext.includes(ARTICLE.title.replace(/"/g, "&quot;"))
    || fromNext.includes("actually works"),
    "the headline is not in the server-rendered HTML");
}

    /* ---- the contract worker.js falls back on ----
       A slug this route has no row for must answer 404, because that is
       the only thing `fromNext()` in worker.js can read as "not mine".
       `_redirects` holds a 301 for `/insights/dsex` that fires only
       because this route declines, and anything else gets the site's own
       404 page rather than a framework one. */
{
  const missing = await fetch(`http://127.0.0.1:${PORT}/insights/not-a-piece-here.html`);
  ok("a slug with no row answers 404, so the front Worker can answer",
    missing.status === 404, `status ${missing.status}`);

      /* Named rather than described, because a name is harder to lose than
         a category. `dsex` is a redirect rule that fires only if this route
         declines, so a route that started answering it would take a 301 off
         the site silently. */
  for (const declined of ["dsex", "dse-basics"]) {
    const answer = await fetch(`http://127.0.0.1:${PORT}/insights/${declined}.html`);
    ok(`${declined} is handed back to the front Worker`,
      answer.status === 404, `status ${answer.status}`);
  }

      /* And a piece answering at the wrong mount is the same case: moving
         one must not leave it live at both addresses. */
  const wrongMount = await fetch(`http://127.0.0.1:${PORT}/cooking/${ARTICLE.slug}`);
  ok("and so does a piece asked for at the wrong mount",
    wrongMount.status === 404, `status ${wrongMount.status}`);
}

    /* ---------- the three reading hubs ----------
       Nothing on the Worker's side to compare against, so they are held to
       the database they were handed: every live piece of the section has a
       card at its own address, the number in the sentence is the number of
       cards, a draft is nowhere, and a piece does not appear on another
       section's index. All of it in the HTML, before any JavaScript runs.
       `scripts/check-preview.ts` asks the same of a branch preview. */

const hub = async (path: string): Promise<{ status: number; html: string }> => {
  const answer = await fetch(`http://127.0.0.1:${PORT}${path}`);
  return { status: answer.status, html: await answer.text() };
};

    /* `check()` labels its two sides "worker" and "next", and there is no
       worker side here. Same comparison, honest labels. */
const says = (name: string, want: string, got: string | null): void => ok(name, decode(got) === want,
  `wanted ${JSON.stringify(want)}\n      got    ${JSON.stringify(got)}`);

{
  const insights = await hub("/insights");
  ok("the Insights hub answers at /insights", insights.status === 200,
    `status ${insights.status}`);
  says("its title", "Insights · Reiad's Library", tagText(insights.html, "title"));
  says("its canonical link", "https://reiad.co.uk/insights",
    attr(insights.html, /<link rel="canonical" href="([^"]+)"/));

  ok("the live piece has a card, at its own address",
    insights.html.includes(`href="/insights/${ARTICLE.slug}.html"`));
  ok("the draft has none", !insights.html.includes(DRAFT.slug));
  ok("and neither has the kitchen's piece", !insights.html.includes(KITCHEN.slug));

      /* The chips are counted from the cards, so "Everything · 1" is the
         same claim as "one card was drawn". */
  ok("the topic chips are in the HTML, counted from the cards",
    insights.html.includes("Everything") && insights.html.includes("Equities"));
  ok("and the pieces promised but not written are teasers",
    insights.html.includes("cell sample-card placeholder"));
}

{
  const kitchen = await hub("/cooking");
  ok("the kitchen answers at /cooking", kitchen.status === 200,
    `status ${kitchen.status}`);
  says("its title", "রান্নাঘর: উপকরণ ধরে ধরে রান্না বোঝা, Reiad's Library",
    tagText(kitchen.html, "title"));
  says("its canonical link", "https://reiad.co.uk/cooking",
    attr(kitchen.html, /<link rel="canonical" href="([^"]+)"/));
  says("the page is in Bangla", "bn", attr(kitchen.html, /<html lang="([^"]+)"/));

  ok("its piece has a card", kitchen.html.includes(`href="/cooking/${KITCHEN.slug}.html"`));
  ok("the count above the list is the number of cards, in Bangla digits",
    kitchen.html.includes("এখন পর্যন্ত ১টি লেখা"));
  ok("nothing from another section is on it", !kitchen.html.includes(ARTICLE.slug));

  const desk = await hub("/travel");
  ok("the travel desk answers too", desk.status === 200, `status ${desk.status}`);
  ok("with its own piece", desk.html.includes(`href="/travel/${DESK.slug}.html"`));
  ok("and its own share card",
    meta(desk.html, "og:image") === "https://reiad.co.uk/og/travel.png");

      /* An address this site has never produced: `[section]/[slug]` must
         read this as an article called `index` rather than as a hub. */
  const nowhere = await hub("/insights/index.html");
  ok("and /insights/index.html is handed back to the asset router",
    nowhere.status === 404, `status ${nowhere.status}`);
}

    /* ---------- the addresses task #28 moved, which only decline ----------
       A rule in `aab/_redirects` fires because the Worker DECLINES, and
       `fromNext()` falls through on 404 and on nothing else. 404 rather
       than 500 is the whole assertion: `getArticle` and `getLesson` both
       reach D1, and a route that threw would answer 500, which falls
       through to nothing, and every other check would still pass. It needs
       the binding, so it cannot be asked anywhere but here. */
{
  console.log("\nthe old addresses, which have to decline rather than throw");
  for (const [path, what] of [
    ["/cooking/index.html", "a reading hub's old address"],
    ["/travel/index.html", "the other one"],
    ["/money/basics-1/index.html", "a stage ladder's"],
    ["/deutsch/stufe-1/index.html", "a Stufe's"],
    ["/deutsch/stufe-1/arbeitsbuch.html", "a practice book's"],
    ["/english/term-1/workbook.html", "the other book's"],
  ] as Array<[string, string]>) {
    const gone = await hub(path);
    ok(`${path} declines with a 404 (${what})`, gone.status === 404,
      `status ${gone.status}, so _redirects never fires and the reader keeps it`);
  }
}

    /* ---------- the hand-written pages ----------
       Prose, with nothing to compare against a database. What is worth
       holding is that each address answers with its own title and its own
       canonical link: the mistake this catches is a page whose head was
       copied from the one beside it. */
    /* `nav` is the address the rail marks, which is not always the page's
       own: the stock check has its own item under Tools. */
const HAND_WRITTEN: Array<[path: string, title: string, nav: string | null]> = [
  ["/about", "About · Reiad's Library", "/about"],
  ["/contact", "Contact · Reiad's Library", "/contact"],
  ["/skills", "দক্ষতা · Skills · Reiad's Library", "/skills"],
  ["/tools", "Tools & calculators · Reiad's Library", "/tools"],
  ["/tools/stock", "Stock check · buy, hold or sell · Reiad's Library", "/tools/stock"],
  ["/tools/live", "Live portfolio · a real account, live from the broker · Reiad's Library", "/tools/live"],
  /* The home page marks nothing: it is not in the rail. */
  ["/", "Reiad's Library · বাংলায় টাকা, দক্ষতা আর কাজ", null],
  ["/portfolio", "Portfolio & Services · Reiad's Library", "/portfolio"],
  ["/portfolio/dcf",
    "DCF with sensitivity tables · DSE-listed manufacturer · Reiad's Library",
    "/portfolio"],
  ["/portfolio/dissertation",
    "Islamic vs conventional funds in the UK · MSc dissertation · Reiad's Library",
    "/portfolio"],
];
for (const [path, title, nav] of HAND_WRITTEN) {
  const page = await hub(path);
  ok(`${path} answers`, page.status === 200, `status ${page.status}`);
  says(`${path} states its own title`, title, tagText(page.html, "title"));
  says(`${path} states its own canonical link`, `https://reiad.co.uk${path}`,
    attr(page.html, /<link rel="canonical" href="([^"]+)"/));
  if (nav) {
        /* Order-agnostic on purpose: React writes `class` before `href`, so
           a pattern requiring `href` immediately after `<a ` goes quiet
           rather than red. */
    ok(`${path} marks ${nav} in the rail`,
      new RegExp(`<a [^>]*href="${nav}"[^>]*aria-current="page"`).test(page.html)
      || new RegExp(`<a [^>]*aria-current="page"[^>]*href="${nav}"`).test(page.html),
      `nothing in the rail carries aria-current="page" for ${nav}`);
  } else {
    ok(`${path} marks nothing in the rail, because it is not in it`,
      !/<nav[\s\S]*?aria-current="page"[\s\S]*?<\/nav>/.test(page.html));
  }
}

    /* Every case study is reachable from the portfolio index. A card
       pointing at a page that does not answer is what `check-content.ts`
       watches from the other side; this is the half that can only be seen
       once the pages are being served. */
{
  const index = await hub("/portfolio");
  const cards = [...index.html.matchAll(/href="(\/portfolio\/[a-z-]+)"/g)]
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
  const account = await hub("/account");
  ok("/account answers", account.status === 200, `status ${account.status}`);
  ok("and tells search engines to leave it alone",
    /<meta name="robots" content="noindex/.test(account.html),
    "no robots tag: this page is somebody's name and their progress");
}

    /* ---------- the four schools ----------
       The one route here with a real twin: committed pages generated from
       the same rows the route reads. Byte-identical HTML is not the bar,
       for the reason at the top of this file. What is held is everything a
       reader or a scraper would notice, plus the two things a school page
       carries that an article does not: the data attributes its progress
       script reads, and the script itself. A page that files a reader's
       ticks under a key nothing reads has lost their progress. */
{
      /* When these committed pages are eventually pruned these checks lose
         their other side, and the honest thing then is to delete them
         rather than weaken them into checks of nothing. */
  const { readFileSync } = await import("node:fs");
  const committed = (rel: string): string =>
    readFileSync(join(here, "..", "archive", "schools-pages", rel), "utf8");

      /* The inside of a tag, by class, whichever order its attributes are
         in: the builders write `class` first and React does not promise
         to. */
  const byClass = (html: string, tag: string, cls: string): string | null => html.match(
    new RegExp(`<${tag}[^>]*class="[^"]*\\b${cls}\\b[^"]*"[^>]*>([\\s\\S]*?)</${tag}>`, "i")
  )?.[1] ?? null;

      /* Every school script the page loads, sorted. Not the first one: the
         money school writes two. Order is not compared, and nor is the tag:
         the Worker writes a `<script>` and the route names the same file in
         a `modulepreload`, because a module that runs before hydration is a
         module whose work React undoes. What both sides have to agree on is
         WHICH modules the page loads. */
      /* `learn` is still in this pattern and the mount is `money`, because
         the older pages load `/learn/learn.js`: a pattern that could not
         see it would extract "" from the old side and pass for the wrong
         reason. Extract both spellings, then let `moved()` map old on to
         new. */
  const schoolScripts = (html: string): string => [...html.matchAll(
    /(?:<script type="module" src|<link rel="modulepreload" href)="(\/(?:learn|money|deutsch|quran|english)\/[a-z-]+\.js)"/g)]
    .map((m) => moved(m[1]) ?? "").sort().join(" ");

      /* Text, with the tags out and the whitespace flattened: indentation
         is the one difference that is guaranteed and means nothing. */
  const words = (html: string | null): string | null => (html === null ? null : decode(
    html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()));

      /** How one fact is pulled out of a page. Both sides of every
          comparison go through the same one, which is what makes the
          comparison a comparison. */
  type Extract = (html: string) => string | null;

  /* One lesson per school, and each is the shape that school is
     the only one to have. */
      /* The money school is not in this loop: the committed pages hold it
         as it was before the rewrite, so comparing against them asks "has
         the content changed" and the answer is yes, deliberately. What
         replaces it is the block below, which asks what a money lesson has
         to do now. */
  for (const [path, file, note] of [
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
        /* Labelled for what the two sides actually are: the thing on the
           other side of this comparison is a committed file, not a
           worker. */
    const same = (what: string, extract: Extract): void => {
      const a = rewritten(moved(decode(extract(was))));
      const b = moved(decode(extract(now)));
      const bn = typeof b === "string" ? b.normalize("NFC") : b;
      ok(`${path}: ${what}`, a === bn,
        `page:  ${JSON.stringify(a)}\n      route: ${JSON.stringify(bn)}`);
    };

        /* `renamed` on the two that carry the school's own name: see the
           note where it is defined. */
    same("the title", (h) => renamed(tagText(h, "title")));
    same("the description", (h) => meta(h, "description", "name"));
    same("the canonical link", (h) => attr(h, /<link rel="canonical" href="([^"]+)"/));
    for (const key of ["og:type", "og:title", "og:description", "og:url", "og:image"]) {
      same(key, (h) => renamed(meta(h, key)));
    }
    same("the language", (h) => attr(h, /<html lang="([^"]+)"/));

        /* The eyebrow, the heading, the blurb and the meta line: the four
           things a reader reads before deciding whether they are in the
           right place. */
    same("the eyebrow", (h) => words(byClass(h, "span", "eyebrow")));
    same("the heading", (h) => words(tagText(h, "h1")));
    same("the one-liner", (h) => words(byClass(h, "p", "one-liner")));
    same("the meta line", (h) => words(byClass(h, "p", "lesson-meta")));
    same("the backlinks", (h) => words(byClass(h, "p", "backlink")));
    same("the prev/next pair", (h) => words(byClass(h, "nav", "prev-next")));

    /* Where the backlinks and the prev/next pair actually point,
       which `words()` throws away and is the half that breaks. */
    const links = (h: string, cls: string): string | null => {
      const inside = byClass(h, cls === "prev-next" ? "nav" : "p", cls);
      return inside === null
        ? null
        : [...inside.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).join(" ");
    };
    same("where the backlinks point", (h) => links(h, "backlink"));
    same("where the prev/next pair points", (h) => links(h, "prev-next"));

        /* The progress attributes, by name and by value. Three schools call
           them three things and every one of those names is already a key
           in somebody's browser. */
    for (const name of ["data-lesson-id", "data-teil-id", "data-part-id",
                        "data-stage", "data-stufe", "data-dhap", "data-term"]) {
      same(`the ${name} attribute`,
        (h) => attr(h, new RegExp(`${name}="([^"]*)"`)));
    }

    same("the scripts the page loads", schoolScripts);
    same("the body class", (h) => attr(h, /<body class="([^"]*)"/));

        /* And the prose byte for byte, because that is what the database
           holds and what a rebuild was supposed to be carrying. */
    const stage = path.split("/")[2] === "terms" ? "basics-1" : path.split("/")[2];
    const slug = (path.split("/").pop() ?? "").replace(/\.html$/, "");
    const found = snapshot.lessons.find(
      (l) => l.stage === stage && l.slug === slug)?.body;
    const stored = typeof found === "string" ? found : "";
    ok(`${path}: the prose is the row's, unchanged`,
      stored !== "" && now.includes(stored.trim()),
      "the stored body is not in the page, character for character");
  }

      /* ---- a stage's contents page, which is the other half ----
         Every number on it is counted from the lessons rather than
         declared, so the facts list is compared word for word: a route that
         counted differently would tell a reader there are fourteen lessons
         where the ladder shows thirteen. */
      /* The money school's stage is out of this loop for the reason given
         above its lesson. What holds it now is `check-money.ts` on the
         ladder and the block below on the page. */
  for (const [path, file, note] of [
    ["/deutsch/stufe-1", "deutsch/stufe-1/index.html",
      "a Stufe, with a practice book above the cards"],
    ["/quran/dhap-1", "quran/dhap-1/index.html",
      "a dhap, counted in days"],
    ["/english/term-1", "english/term-1/index.html",
      "a term, with a book and a nightly range"],
  ]) {
    const page = await hub(path);
    ok(`${path} answers (${note})`, page.status === 200, `status ${page.status}`);
    if (page.status !== 200) continue;

    const was = committed(file);
    const now = page.html;
    const same = (what: string, extract: Extract): void => {
      const a = rewritten(moved(decode(extract(was))));
      const b = moved(decode(extract(now)));
      const bn = typeof b === "string" ? b.normalize("NFC") : b;
      ok(`${path}: ${what}`, a === bn,
        `page:  ${JSON.stringify(a)}\n      route: ${JSON.stringify(bn)}`);
    };

        /* The school's own name is the third clause of the title and it
           changed; compared with that substitution rather than skipped, so
           the other two thirds are still held exactly. */
    same("the title", (h) => renamed(tagText(h, "title")));
    same("the description", (h) => meta(h, "description", "name"));
    same("the canonical link", (h) => attr(h, /<link rel="canonical" href="([^"]+)"/));
    same("og:image", (h) => meta(h, "og:image"));

    same("the eyebrow", (h) => words(byClass(h, "span", "eyebrow")));
    same("the heading", (h) => words(tagText(h, "h1")));
    same("the lede", (h) => words(byClass(h, "p", "lede")));

    /* The facts, which is where a school says how big it is.
       Every one of these numbers is counted. */
    same("what the stage says about itself",
      (h) => words(byClass(h, "dl", "stage-facts")));

        /* Every card, in order, with its address: a ladder that has lost a
           rung or reordered two is the failure this exists to avoid. */
    same("every lesson card, in order", (h) => {
      const cards = [...h.matchAll(/class="cell lesson-card[^"]*"\s+href="([^"]+)"/g)]
        .map((m) => m[1]);
      /* The builders write href before the class on some cards
         and after it on others, so both orders are collected. */
      const other = [...h.matchAll(/href="([^"]+)"\s+[^>]*class="cell lesson-card/g)]
        .map((m) => m[1]);
      return [...cards, ...other].join(" ");
    });

        /* The bar and the "continue" button, for the three schools whose
           ladder is still a script reading a data attribute. The money
           school's is React and counts the ids the route rendered, so there
           is no attribute to compare. */
    if (path.startsWith("/money/")) {
      ok(`${path}: the bar counts what the route rendered`,
        /class="meter"/.test(now) && !/data-stage-progress/.test(now),
        "the money school's stage still carries the old progress markup");
    } else {
      same("the progress bar's key",
        (h) => attr(h, /data-(?:stufe|dhap|term)-progress="([^"]*)"/));
      same("where the continue button starts",
        (h) => attr(h, /data-(?:stufe|dhap|term)-continue="[^"]*"[^>]*>|href="([^"]+)"[^>]*data-(?:stufe|dhap|term)-continue/));
    }
    same("the prev/next pair", (h) => words(byClass(h, "nav", "prev-next")));
    same("where the prev/next pair points", (h) => {
      const inside = byClass(h, "nav", "prev-next");
      return inside === null ? null
        : [...inside.matchAll(/href="([^"]+)"/g)].map((m) => m[1]).join(" ");
    });
        /* The money school's ladder page loaded `/money/stage.js` on top of
           `/money/reader.js`: the second is the modal term reader and
           stayed, the first drew the bar and is gone. */
    if (path.startsWith("/money/")) {
      says(`${path}: the scripts the page loads`, "/money/reader.js", schoolScripts(now));
    } else {
      same("the scripts the page loads", schoolScripts);
    }
    same("the body class", (h) => attr(h, /<body class="([^"]*)"/));
  }

  /* The practice book's band, which only two schools have and
     which sits above the cards rather than under them. */
  {
    const stufe = await hub("/deutsch/stufe-1");
    ok("a Stufe with a book links it above the cards",
      stufe.html.indexOf("buch-cta") > 0
      && stufe.html.indexOf("buch-cta") < stufe.html.indexOf("lesson-card"),
      "the practice book is not above the lesson cards");
    const dhap = await hub("/quran/dhap-1");
    ok("and a school with no book draws no band at all",
      !dhap.html.includes("buch-cta") && !dhap.html.includes("wb-cta"));
  }

      /* ---- the trail says every level, on the pages that have most ----
         `[slug]` IS the stage, and the layout that reads it is the deepest
         one that can, because a layout cannot see a child's params. Only
         this file can check it: the 251 school routes are dynamic and need
         the database, and the browser test that covers the trail everywhere
         else serves prerendered HTML. */
  {
    const stage = await hub("/deutsch/stufe-1");
    ok("a stage page names the stage in the trail",
      stage.html.includes("Stufe 1") && stage.html.includes("crumbs-bar"),
      "no stage crumb in the bar");
    ok("and the arrow before it opens the ladder",
      stage.html.includes("crumb-step") && stage.html.includes("crumb-menu"),
      "no menu on the trail");
    /* Every rung, not just the one you are on: the menu IS the
       ladder, which is what makes the trail a way sideways. */
    const rungs = ["stufe-1", "stufe-2", "stufe-3", "stufe-4"]
      .filter((r) => stage.html.includes(`/deutsch/${r}"`));
    ok("and lists every stage of the school", rungs.length === 4, rungs.join(", "));

    const lesson = await hub("/deutsch/stufe-1/anfang.html");
    ok("a lesson three levels down carries the same trail",
      lesson.html.includes("Stufe 1") && lesson.html.includes("crumb-menu"),
      "the lesson lost the stage crumb");
  }

      /* ---- the eighteen originals, which are a different thing ----
         `/money/terms/*.html` was written by hand before the money school
         had a builder: their own title and eyebrow, one backlink rather
         than two, no prev/next pair. Comparing them fact by fact would only
         measure a decision nobody has taken. What is worth holding is where
         a wrong answer costs a reader something: the address, and the key
         their ticks are filed under. */
  {
    const page = await hub("/money/terms/share.html");
    ok("a term of basics-1 answers at /money/terms/, not at its stage's folder",
      page.status === 200, `status ${page.status}`);
    says("and says that address is its own",
      "https://reiad.co.uk/money/terms/share.html",
      attr(page.html, /<link rel="canonical" href="([^"]+)"/));
        /* The one that silently loses a year of somebody's progress: every
           other lesson files a tick under `<stage>/<slug>` and these
           eighteen file it under the slug alone. */
    says("and files progress under the bare slug, as it always has",
      "share", attr(page.html, /data-lesson-id="([^"]*)"/));
  }

      /* ---- the money school as it is now: two bodies and blocks ----
         Everything here is a way the page can render perfectly and be
         wrong. `case-study` is the one asked because it is the richest:
         seven blocks across five kinds, mounted in the same order by both
         bodies. */
  {
        /* By relative path, not like the route: node refuses to strip types
           under `node_modules`, and `@reiad/shared` resolves to the copy npm
           made there. */
    const { splitBody, parseBlocks } = await import("../shared/lesson.ts");
    const row = snapshot.lessons.find(
      (l) => l.school === "money" && l.stage === "basics-3" && l.slug === "case-study");
    const page = await hub("/money/basics-3/case-study.html");
    ok("a lesson of the rebuilt money school answers",
      page.status === 200, `status ${page.status}`);

    if (row && page.status === 200) {
      const html = page.html;
      const bn = splitBody(String(row.body));
      const en = splitBody(String(row.body_en));
      const blocks = parseBlocks(row.blocks);

          /* Both halves reach the page. The stylesheet chooses which one is
             seen, keyed on an attribute the boot script sets before the
             first paint, so a language missing from the HTML is a language
             no switch can reach. */
      ok("both bodies are in the HTML, each in its own element",
        html.includes('class="ls-bn" lang="bn"') && html.includes('class="ls-en" lang="en"'),
        "one of the two language wrappers is missing");

          /* And in pieces, because the body is cut at its mounts:
             `includes(body)` cannot hold once a block sits in the middle of
             the prose, and a dropped chunk is a paragraph nobody sees. */
      for (const [n, part] of bn.parts.entries()) {
        const chunk = part.trim();
        if (chunk.length < 40) continue;
        ok(`the Bangla prose reaches the page, chunk ${n + 1} of ${bn.parts.length}`,
          html.includes(chunk), "a chunk of the stored body is not in the page");
      }
      for (const [n, part] of en.parts.entries()) {
        const chunk = part.trim();
        if (chunk.length < 40) continue;
        ok(`the English prose reaches the page, chunk ${n + 1} of ${en.parts.length}`,
          html.includes(chunk), "a chunk of the stored English body is not in the page");
      }

          /* One block per mount, mounted where the marker was, and the
             marker gone: a `data-mount` left in the output is a block that
             did not render into a gap that still looks deliberate. */
      says("as many blocks as the body mounts",
        String(bn.ids.length),
        String((html.match(/class="ls-block"/g) ?? []).length));
      ok("and every one of them by name",
        bn.ids.every((id) => html.includes(`id="b-${id}"`)),
        `mounts: ${bn.ids.join(", ")}`);
      ok("and no mount marker survives into the page",
        !/data-mount="/.test(html),
        "a mount marker reached the reader, so a block did not render");
      ok("and every block declares its kind",
        Object.values(blocks).every((b) =>
          html.includes(`data-kind="${String((b as { kind: string }).kind)}"`)),
        "a block rendered without the kind its stylesheet keys on");

          /* The two things the route decides rather than the body: how much
             the lesson matters, and whether there is a second language. */
      ok("the lesson says how much it matters",
        html.includes("lesson-stars"), "no stars on a lesson whose row has them");
      ok("and offers the language switch, because it has both",
        html.includes('class="ls-lang"'), "no switch on a lesson with two bodies");
    }

        /* A switch that does nothing is worse than no switch: it says the
           English is missing rather than not written, and three schools have
           no English half at all. */
    const german = await hub("/deutsch/stufe-1/anfang.html");
    ok("and a lesson with one body is offered no switch",
      german.status === 200 && !german.html.includes('class="ls-lang"'),
      "a school with no English half drew a language switch");
  }

      /* ---- the three hand-written pages ----
         Prose, copied verbatim into `lib/school-hubs.ts` rather than
         rewritten as JSX. `check-next.ts` holds the copy to the original,
         so what is worth checking here is the part that is NOT copied: the
         head Next writes, the shell around the writing, and the scripts
         that make the ladder live. */
  for (const [path, file] of [
    ["/deutsch", "deutsch/index.html"],
    ["/quran", "quran/index.html"],
    ["/english", "english/index.html"],
  ]) {
    const page = await hub(path);
    ok(`${path} answers`, page.status === 200, `status ${page.status}`);
    if (page.status !== 200) continue;

    const was = committed(file);
    const now = page.html;
    const same = (what: string, extract: Extract): void => {
      const a = rewritten(moved(decode(extract(was))));
      const b = moved(decode(extract(now)));
      const bn = typeof b === "string" ? b.normalize("NFC") : b;
      ok(`${path}: ${what}`, a === bn,
        `page:  ${JSON.stringify(a)}\n      route: ${JSON.stringify(bn)}`);
    };

    same("the title", (h) => tagText(h, "title"));
    same("the description", (h) => meta(h, "description", "name"));
    same("the canonical link", (h) => attr(h, /<link rel="canonical" href="([^"]+)"/));
    same("og:image", (h) => meta(h, "og:image"));
    same("og:type", (h) => meta(h, "og:type"));
    same("the language", (h) => attr(h, /<html lang="([^"]+)"/));
    same("the body class", (h) => attr(h, /<body class="([^"]*)"/));
    same("the scripts the page loads", schoolScripts);

        /* The WRITING, whole and word for word, and NOT the markup: tags
           out, comments out, whitespace collapsed. Eight hundred lines of
           hand-converted Bangla is eight hundred chances to lose a word
           that nobody reviewing a diff of markup would catch. Comparing the
           markup instead fails on every deliberate redesign. */
    const body = (h: string): string | null => h.match(
      /<main id="main">\s*<div class="wrap"[^>]*>([\s\S]*)<\/div>\s*<\/main>/)?.[1] ?? null;
    const prose = (h: string | null): string => (h ?? "")
      .replace(/<!--[\s\S]*?-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
        /* Both sides, and WHERE they part. "a word of the writing differs"
           is a bisection by hand on a hub of nine hundred words. */
    {
          /* `prose()` answers "" for a page with no `<main>`, so both sides
             are strings whatever the pages turned out to be; the check below
             is what says the old one had one. */
      const a = rewritten(prose(moved(body(was)))) ?? "";
      const b = prose(moved(body(now))).normalize("NFC");
      const wa = a.split(" ");
      const wb = b.split(" ");
      let i = 0;
      while (i < wa.length && i < wb.length && wa[i] === wb[i]) i += 1;
      ok(`${path}: the writing is the page's, word for word`,
        body(was) !== null && a === b,
        `they part at word ${i} of ${wa.length}:`
        + `\n      page:  ${JSON.stringify(wa.slice(i, i + 14).join(" "))}`
        + `\n      route: ${JSON.stringify(wb.slice(i, i + 14).join(" "))}`);
    }

        /* The ladder's fallback list survives, which is the half a reader
           with no JavaScript gets and the half a search engine reads. */
    ok(`${path}: the no-JavaScript ladder is in the HTML`,
      /class="(?:leiter-fallback|ladder|stufe-liste|contents-stage)/.test(now)
      || path.endsWith("contents.html"),
      "no ladder fallback in the served page");
  }

      /* A lesson the ladder does not have is handed back to the asset
         router. */
  const nothing = await hub("/money/terms/not-a-lesson.html");
  ok("a slug the ladder does not name falls through",
    nothing.status === 404, `status ${nothing.status}`);

      /* The starter guide's eight steps are pages now, so this holds the
         route to rendering them. Same failure it always guarded against:
         the route and the ladder disagreeing about what exists. */
  const step = await hub("/money/start/first-buy.html");
  ok("a step of the starter guide is a page of its own", step.status === 200,
    `status ${step.status}`);

  /* ---- the money school's own two pages, out of the rows ---- */

  {
    const hubPage = await hub("/money");
    ok("/money answers", hubPage.status === 200, `status ${hubPage.status}`);

    if (hubPage.status === 200) {
      const h = hubPage.html;

          /* Every stage, and every step of the starter guide. Counted
             rather than sampled: seventeen is eight steps plus seven ladder
             rungs plus the two doors at the foot. */
      const stages = snapshot.stages.filter((r) => r.school === "money");
      for (const stage of stages.slice(1)) {
        ok(`/money/ links its ${stage.slug} rung`,
          h.includes(`href="/money/${stage.slug}"`),
          `no card for ${stage.slug}`);
      }
      const steps = snapshot.lessons
        .filter((r) => r.school === "money" && r.stage === "start");
      for (const step of steps) {
        ok(`/money/ links the starter step ${step.slug}`,
          h.includes(`href="/money/start/${step.slug}.html"`),
          `no card for ${step.slug}`);
        /* And keeps the anchor the old accordion had, so a link
           somebody saved still lands where it named. */
        ok(`/money/ keeps the #step-${step.slug} anchor`,
          h.includes(`id="step-${step.slug}"`), "the anchor is gone");
      }

      ok("/money/ tells a card that goes somewhere from one that does not",
        h.includes('data-kind="go"') && h.includes('data-kind="info"'),
        "the page has only one kind of card on it");
    }

    const contents = await hub("/money/contents");
    ok("/money/contents answers", contents.status === 200,
      `status ${contents.status}`);

    if (contents.status === 200) {
          /* The complete list is complete: every lesson of the school with
             prose in it, by name. This is the one page whose entire value
             is that nothing is missing from it. */
          /* Only the stages this fixture seeded prose for: the database has
             sixty written lessons and this local copy has the three it
             needs. */
      const written = snapshot.lessons
        .filter((r) => r.school === "money" && r.body && SEEDED.includes(String(r.stage)));
      const missing = written.filter((r) => !contents.html.includes(`>${r.title}<`));
      ok(`/money/contents names all ${written.length} written lessons`,
        missing.length === 0,
        `missing: ${missing.slice(0, 4).map((r) => r.slug).join(", ")}`);
    }
  }
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
  + "the database gave it, each school page says what the page it replaced\n"
  + "said, and every address answers.\n");

    /* Said out loud, because falling off the end is not the same thing
       here: `wrangler dev` starts workerd as a child of its own, SIGTERM
       does not always take the grandchild with it, the pipes stay open,
       and a run that has printed its result hangs. Which is a hung job in
       CI, on a green test. */
process.exit(0);
