/* ============================================================
   check-pieces.ts: where every written piece actually lives.

     node scripts/check-pieces.ts          offline, and a gate
     node scripts/check-pieces.ts --live   asks the database too

   A piece on this site can be a committed HTML file, a row in D1,
   or both, and the row wins at the URL. That is the whole of
   Stage 3 in archive/TRANSITION.md, and until this file existed nobody
   could answer "which is which" without poking five URLs by hand.
   Stage 3 cannot be called done from a feeling.

   ---- what it gates on, offline ----

   Every `.html` in a section directory has to be one of three
   things, and it has to be obvious which:

     an entry in SECTIONS         a piece the site lists
     a redirect in _redirects     a URL kept alive after a move
     the section template         _template.html

   A file that is none of those is an orphan: reachable by typing
   its URL, listed nowhere, counted nowhere, and updated never.
   Three finished pieces were exactly that once, which is the
   paragraph in CLAUDE.md about lists coming from the data.

   ---- what --live adds ----

   The database half, read from /api/backup/articles, which needs
   no credential. It reports rather than gates: the network is
   allowed to be down, and a check that fails because a wire is
   loose teaches people to ignore checks.
   ============================================================ */

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const aab = join(root, "aab");

/* The manifest itself rather than the module built from it. Both
   answer the same, and this one carries its own types: it is
   `shared/content.ts`, which node reads directly. */
import { SECTIONS, livePieces } from "../shared/content.ts";

const live = process.argv.includes("--live");
const ORIGIN = process.env.SITE_ORIGIN ?? "https://reiad.co.uk";

let problems = 0;
const bad = (msg: string): void => { problems += 1; console.error(`  ${msg}`); };

/* ---------- what _redirects keeps alive ---------- */
const redirectsFile = join(aab, "_redirects");
const redirected = new Set(
  existsSync(redirectsFile)
    ? readFileSync(redirectsFile, "utf8")
        .split("\n")
        .filter((l) => l.trim() && !l.trim().startsWith("#"))
        .map((l) => l.trim().split(/\s+/)[0])
    : []
);

/* ---------- the database, if asked ---------- */
let rows = null;
if (live) {
  try {
    const res = await fetch(`${ORIGIN}/api/backup/articles`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as { articles: Array<Record<string, unknown>> };
    rows = new Map(data.articles.map((a) => [`${a.section}/${a.slug}`, a]));
  } catch (err) {
    console.error(`  (could not reach the database: ${(err as Error).message})`);
    console.error("  Reporting what is on disk only.\n");
  }
}

/* ---------- the survey ---------- */

/** Where one piece actually lives, said in the words the report
    prints. `inDb` is null when the database was not reachable,
    which is a different answer from "no row" and must not be
    printed as one. */
interface Where {
  section: string;
  slug: string;
  onDisk: boolean;
  inList: boolean;
  inDb: boolean | null;
}

const state: Where[] = [];

for (const section of SECTIONS) {
  const dir = join(aab, section.id);
  if (!existsSync(dir)) continue;

  const files = new Set(
    readdirSync(dir)
      .filter((f) => f.endsWith(".html") && f !== "index.html" && f !== "_template.html")
      .map((f) => f.replace(/\.html$/, ""))
  );

  const listed = new Set(livePieces(section).map((p) => p.slug));

  // Every slug either side knows about.
  const slugs = new Set([
    ...files,
    ...listed,
    ...(rows ? [...rows.keys()].filter((k) => k.startsWith(`${section.id}/`))
      .map((k) => k.slice(section.id.length + 1)) : []),
  ]);

  for (const slug of [...slugs].sort()) {
    const onDisk = files.has(slug);
    const inList = listed.has(slug);
    const inDb = rows ? rows.has(`${section.id}/${slug}`) : null;

    state.push({ section: section.id, slug, onDisk, inList, inDb });

    /* The gate: a file nothing points at. A slug that only exists
       as a redirect target is fine, and so is a file whose URL is
       redirected away, which is what a stub left behind by a move
       looks like. */
    if (onDisk && !inList && inDb !== true) {
      const url = `${section.mount}${slug}`;
      if (!redirected.has(url) && !redirected.has(`${url}.html`)) {
        bad(`aab/${section.id}/${slug}.html is in no list, in no redirect `
          + `and (as far as this run knows) in no database row. `
          + `Nothing on the site links to it.`);
      }
    }

    if (inList && !onDisk && inDb === false) {
      bad(`the manifest lists ${section.id}/${slug}, but there is no file `
        + `and no database row. That link is dead.`);
    }
  }
}

/* ---------- the report ---------- */

const where = (p: Where): string => {
  if (p.inDb === null) return p.onDisk ? "file" : "listed, no file";
  if (p.inDb && p.onDisk) return "BOTH (row wins)";
  if (p.inDb) return "database";
  return "file only";
};

console.log(`pieces: ${state.length} across ${SECTIONS.length} sections`
  + (rows ? `, ${rows.size} live row(s) in the database` : ", database not asked"));
console.log();

const width = Math.max(...state.map((p) => `${p.section}/${p.slug}`.length), 10);
for (const p of state) {
  const name = `${p.section}/${p.slug}`.padEnd(width);
  const listed = p.inList ? "listed" : "unlisted";
  console.log(`  ${name}  ${where(p).padEnd(15)} ${listed}`);
}

if (rows) {
  const remaining = state.filter((p) => p.onDisk && p.inDb === false && p.inList);
  console.log();
  if (remaining.length) {
    console.log(`Stage 3: ${remaining.length} piece(s) still only a file.`);
    for (const p of remaining) {
      console.log(`  /studio.html?file=${p.section}:${p.slug}`);
    }
  } else {
    console.log("Stage 3: every listed piece has a database row.");
  }

  const both = state.filter((p) => p.onDisk && p.inDb);
  if (both.length) {
    console.log();
    console.log(`${both.length} file(s) now shadowed by a row, and safe to delete `
      + `once the row has been live a fortnight:`);
    for (const p of both) console.log(`  aab/${p.section}/${p.slug}.html`);
  }
}

console.log();
console.log(problems
  ? `${problems} problem(s).`
  : "every file is listed, redirected, or in the database.");

process.exit(problems ? 1 : 0);
