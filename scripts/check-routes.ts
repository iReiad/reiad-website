#!/usr/bin/env node
/* ============================================================
   check-routes.ts, catch broken URLs before deploying.

       node scripts/check-routes.ts

   Cloudflare's asset routing is the one part of this site that
   can't be tested with a local file server, and it has already
   broken the site once: a "pretty URL" rule in _redirects sent
   the extensionless spelling of an address to the `.html` one
   while Cloudflare itself redirects the `.html` one back, so the
   two bounced off each other forever and the page never loaded in
   any browser. Every rule in that file points one way now.

   This walks every public URL through the same rules Pages
   applies and fails loudly on a loop, a dead end, or a link
   pointing at a file that isn't there.

   Pages' asset behaviour, in order:
     1. _redirects rules, in file order, first match wins
     2. otherwise /foo.html is 308-redirected to /foo
     3. /foo serves foo.html, /dir serves dir/index.html

   And one step in front of all three, since Stage 11: a path in
   `run_worker_first` never reaches the asset router at all. It is
   answered by a Worker, and whether a file exists at that address
   is not a question anybody asks. Both halves are read out of the
   real files rather than typed here, so this catches the mistake
   that shape of routing invites: a route added to `NEXT_ROUTES`
   and not to `run_worker_first`, where the asset router answers
   first and the Worker is never called.
   ============================================================ */

import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { nextOwns } from "../worker.js";
/* The one table the rail, the footer and /skills are drawn from.
   Read here so that a link in the site's own chrome is held to
   the same standard as a link inside a page. */
import { NAV } from "../shared/nav.ts";
/* The four ladders, for the practice-book check at the end: a
   stage has a book only if it declares one, which no route
   pattern can tell. */
import { STAGES as MONEY } from "../shared/curricula/money.ts";
import { STUFEN } from "../shared/curricula/deutsch.ts";
import { TERMS } from "../shared/curricula/english.ts";
import { DHAPS } from "../shared/curricula/quran.ts";

/* `AAB` is what this walks and `ROOT` is the repository, and the
   two were the same directory until this file moved out of it.

   It moved because of what it checks two hundred lines down:
   every file in `aab/` is uploaded and served, so a check living
   there was a check published at its own URL. The rule
   that kept that from happening was a line in `.assetsignore`,
   and a rule you have to remember is the thing this repository
   keeps replacing. A check that is not in the served directory
   cannot be served, which retires the question rather than
   guarding it.

   `.assetsignore` still carries the `check-*` rules, and they
   still matter: they are what stops a check that has NOT moved
   out from being served. See the DEV_ONLY section below, which
   fails on any such file no rule covers. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");
const MAX_HOPS = 10;

/* ---------- what a Worker answers ---------- */

/* The patterns in `run_worker_first`, straight out of wrangler.toml.
   A `*` there matches any number of characters, including slashes.

   The comment lines inside that array are stripped first, and they
   have to be. They quote patterns in prose, and one of them once
   named a pattern that was deliberately ABSENT. Reading the block
   without stripping them picked that up as a rule, so this file
   believed the Worker answered paths wrangler had been told
   nothing about. */
const WORKER_FIRST = (
  readFileSync(join(ROOT, "wrangler.toml"), "utf8")
    .match(/run_worker_first\s*=\s*\[([\s\S]*?)\]/)?.[1] ?? ""
)
  .replace(/^\s*#.*$/gm, "")
  .match(/"([^"]+)"/g)?.map((quoted) => quoted.slice(1, -1)) ?? [];

const globs = (pattern: string, path: string): boolean =>
  new RegExp(`^${pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*")}$`)
    .test(path);

/** Does a Worker answer this, whatever is or is not in `aab/`?

    Both halves have to be true, and that is the point. A path in
    the allowlist that the asset router still gets to first is
    answered by a file; a path the Worker would claim that is not
    in `run_worker_first` never reaches it. */
const workerAnswers = (path: string): boolean =>
  WORKER_FIRST.some((pattern) => globs(pattern, path)) && nextOwns(path);

/* ---------- the rules ---------- */

const rules = readFileSync(join(AAB, "_redirects"), "utf8")
  .split("\n")
  .map((l) => l.trim())
  .filter((l) => l && !l.startsWith("#"))
  .map((line, i) => {
    const [from, to, status = "302"] = line.split(/\s+/);
    return { from, to, status: Number(status), line: i + 1 };
  });

/** What answers one path: a file, another path, or nothing.
    Exactly one of the three is set, which is what `trace()` below
    branches on. */
interface Step {
  file?: string;
  redirect?: string;
  why?: string;
  missing?: true;
}

function step(path: string): Step {
  const rule = rules.find((r) => r.from === path);
  if (rule) return { redirect: rule.to, why: `_redirects` };

  /* After the redirect rules rather than before them, which is
     what the site actually does: `/insights/dsex.html` is a
     Worker path AND carries a 301, and the 301 is what fires,
     because the handler declines a slug with no row and the asset
     router is what answers next. */
  if (workerAnswers(path)) return { file: "(a Worker renders this)" };

  if (path.endsWith(".html")) {
    const stripped = path.replace(/(\/index)?\.html$/, "") || "/";
    if (stripped !== path) return { redirect: stripped, why: "Pages strips .html" };
  }

  for (const candidate of [path, `${path}.html`, `${path.replace(/\/$/, "")}/index.html`]) {
    const file = join(AAB, candidate);
    if (existsSync(file) && statSync(file).isFile()) return { file: candidate };
  }
  return { missing: true };
}

/** Where a path ends up, and every hop it took to get there. */
interface Trace {
  status: "ok" | "LOOP" | "MISSING" | "TOO MANY HOPS";
  chain: string[];
  file?: string;
}

function trace(start: string): Trace {
  const chain: string[] = [];
  let path = start;
  for (let i = 0; i < MAX_HOPS; i++) {
    if (chain.includes(path)) return { status: "LOOP", chain: [...chain, path] };
    chain.push(path);
    const s = step(path);
    if (s.file) return { status: "ok", chain, file: s.file };
    if (s.missing) return { status: "MISSING", chain };
    /* A step that is neither a file nor missing is a redirect, and
       `step()` sets exactly one of the three. Said out loud rather
       than assumed, because the loop below would otherwise walk
       `undefined` round MAX_HOPS times and report a broken URL as
       "too many hops". */
    if (!s.redirect) return { status: "MISSING", chain };
    path = s.redirect;
  }
  return { status: "TOO MANY HOPS", chain };
}

/* ---------- what to check: every page, and every link in it ---------- */

/** Every file under aab/, as a path relative to it. The pages
    come out of this and so does the upload check further down. */
const files: string[] = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!["og", "functions", "node_modules"].includes(entry)) walk(full);
    } else {
      files.push(relative(AAB, full).split(sep).join("/"));
    }
  }
})(AAB);

const pages = files.filter((f) => f.endsWith(".html")).map((f) => `/${f}`);

const targets = new Set(["/", ...pages, ...rules.map((r) => r.from)]);

/* ---------- every root-absolute link, from wherever it is written

   THREE HTML FILES ARE LEFT. This walked `pages`, which is
   every `.html` under `aab/`, and that was the whole site when
   it was written; since Stage 11.7 it is `404.html`,
   `offline.html` and the preview harness. The other 250 pages
   are Next.js routes, and their links are written in `next/app`
   and `next/components`.

   So the dead-link half of this file was checking three pages out
   of two hundred and fifty. Proved before fixing, the way
   `PLAN.md` says: a link to a page that does not exist, added to
   a route, passed; the same link in `404.html` failed.

   A route writes its links as JSX, so only the literal ones can
   be read: `href="/money"` is checkable and
   `href={lesson.url}` is not, and pretending otherwise would mean
   a check that guesses. The literals are most of them, and the
   computed ones are computed by `shared/schools.ts`, which
   `check-schools.ts` already holds to the ladder.
   ---------------------------------------------------------- */

/** Every internal link found, against the first page or route
    that named it, so a failure can say where to go and change it. */
const linkSources = new Map<string, string>();

const addLinks = (text: string, source: string): void => {
  for (const m of text.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    targets.add(m[1]);
    if (!linkSources.has(m[1])) linkSources.set(m[1], source);
  }
};

for (const page of pages) {
  // Comments explain example paths that deliberately don't exist yet,
  // so scan the real markup only.
  addLinks(
    readFileSync(join(AAB, page.slice(1)), "utf8").replace(/<!--[\s\S]*?-->/g, ""),
    page,
  );
}

/* The routes and the components they are built from. Comments are
   stripped for the same reason: this repository's are long and
   several of them quote an address as an example. */
const NEXT = join(ROOT, "next");
const tsx = [];
(function walkTsx(dir) {
  let entries;
  try { entries = readdirSync(dir); } catch { return; }
  for (const entry of entries) {
    if (entry === "node_modules" || entry === ".next") continue;
    /* The node-side files beside the app are not pages, and the
       addresses in them are a fixture's rather than this site's:
       `hydrate-fixture.ts` serves one component on a server of its
       own, at paths nothing here answers. Same line
       `next/tsconfig.json` draws in its `exclude`. */
    if (entry.endsWith(".test.ts") || entry === "dev-worker.ts"
      || entry === "hydrate-fixture.ts") continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walkTsx(full);
    else if (entry.endsWith(".tsx") || entry.endsWith(".ts")) tsx.push(full);
  }
})(NEXT);

for (const file of tsx) {
  addLinks(
    readFileSync(file, "utf8")
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/^\s*\/\/.*$/gm, ""),
    `next/${relative(NEXT, file).split(sep).join("/")}`,
  );
}

let failures = 0;

/* No pattern in `run_worker_first` may be covered by another one.

   This is not tidiness. Wrangler rejects an overlapping list at
   parse time, before it reads the Worker or looks at aab/, and the
   deploy stops:

     Invalid routes in `run_worker_first`:
       '/cooking/index.html': rule '/cooking/*' makes it redundant

   Nothing about that is visible from the site, because a Worker
   that fails to deploy is a Worker still serving its last good
   upload. Six overlapping entries arrived across Stage 11 and the
   live Worker sat on a version from before Stage 11.1 for the rest
   of the day, still answering every request, while thirteen pushes
   built nothing.

   The test below is the one wrangler runs: a rule covers another
   when it matches it and is not the same string. `globs` already
   reads a `*` the way the asset router does. */
for (const pattern of WORKER_FIRST) {
  const covering = WORKER_FIRST.find(
    (other) => other !== pattern && globs(other, pattern),
  );
  if (!covering) continue;
  failures++;
  console.error(`overlapping-rule  ${pattern}   (covered by ${covering})`);
  console.error("        wrangler refuses this list and the deploy stops before it starts");
}

/* An article's slug becomes a URL, and only some strings can.
   worker.js matches /insights/([a-z0-9-]+) and static assets are
   no more forgiving, so a slug with a capital or a space cannot
   resolve however it is published, but it still reaches feed.xml
   and the sitemap.

   That is exactly what happened: a live entry with the slug
   "German Alphabets" put a URL containing a raw space into the
   sitemap submitted to search engines.

   ---- where the slugs are now ----

   This read `liveArticles()` out of `content.js`, which held
   every article when it was written and holds NONE of them since
   the writing became rows. So the loop ran over an empty list and
   reported nothing, on a site with live articles, which is a
   check that had stopped asking its own question.

   Two things answer it instead, and both are needed:

     `functions/api/articles/[[slug]].ts` strips anything outside
     `[a-z0-9-]` before it writes, and rejects what is left if it
     is empty. Nothing published through the Studio can be wrong.

     `content/articles.backup.json` is the nightly export of the
     live rows, and it is what this reads. It covers what the
     write path cannot: a slug that arrived by a migration, by
     wrangler, or by hand.

   The backup is committed, so this still needs no network. If it
   is missing entirely that is worth saying rather than passing
   quietly. */
/* ---------- what gets uploaded ----------

   Everything in aab/ is an asset, so everything in aab/ is a
   public URL. The checks, the tests, the two school builders and
   the TypeScript sources of four served modules were all being
   published: about 300 KB at addresses like /check-routes.ts
   and /schema.sql, which nobody had asked for and nobody
   maintained as pages.

   aab/.assetsignore is what stops that, and this is what stops
   .assetsignore going stale. A new check or a new test added
   beside the others starts being published the moment it is
   committed, and nothing about the site looks any different, so
   the failure is exactly the kind this repository writes down:
   silent, and only wrong later. Every path below has to be
   covered by a rule in that file. */
/* `.mjs` OR `.ts`, and the second half is not hypothetical. The
   checks and the tests are being converted to TypeScript, which
   node runs directly, and a rule that only knew `.mjs` would go
   quiet at exactly the moment the files it guards changed name.
   The whole point of this block is that the failure is silent.

   `.d.ts` is here for the same reason. A declaration describes
   JavaScript for the typechecker and answers nothing a browser
   asks for, and the four case-study models each have one beside
   them now. */
const DEV_ONLY = new RegExp(
  "(^|/)(check-[^/]*\\.(mjs|ts)|build-[^/]*\\.(mjs|ts)|[^/]*\\.test\\.(mjs|ts))$"
  + "|\\.d\\.ts$|^src/|\\.sql$|scorecard\\.fetch\\.(mjs|ts)$");

const IGNORED = readFileSync(join(AAB, ".assetsignore"), "utf8")
  .split("\n")
  .map((line) => line.trim())
  .filter((line) => line && !line.startsWith("#"));

/** The matching .assetsignore does: a leading or trailing `/`
    anchors a directory, `*` matches within one path segment. */
const ignores = (rule: string, path: string): boolean => {
  if (rule.endsWith("/")) return path.startsWith(rule) || path.includes(`/${rule}`);
  const re = new RegExp(`^${rule.split("*").map((p: string) =>
    p.replace(/[.+?^${}()|[\]\\]/g, "\\$&")).join("[^/]*")}$`);
  /* Against the whole path and against the last segment, because
     `.assetsignore` allows both spellings. `split("/")` on a
     non-empty string always has a last element; `?? path` is what
     says so rather than a `!`. */
  return re.test(path) || re.test(path.split("/").pop() ?? path);
};

for (const path of files) {
  if (!DEV_ONLY.test(path)) continue;
  if (IGNORED.some((rule) => ignores(rule, path))) continue;
  failures++;
  console.error(`published  ${path}`);
  console.error("        this is a build or test file and would be served at "
    + `/${path}. Add a rule for it to aab/.assetsignore.`);
}

const SLUG = /^[a-z0-9-]+$/;
const BACKUP = join(ROOT, "content", "articles.backup.json");

/** The live articles out of the nightly export, of which this
    reads two fields: the slug it checks, and the title it names
    the offending piece by. */
interface Article {
  slug?: string;
  title?: string;
}

let live: Article[] = [];
if (!existsSync(BACKUP)) {
  failures++;
  console.error("no-backup  content/articles.backup.json");
  console.error("        the nightly export of the live articles is the only");
  console.error("        copy of their slugs a check with no network can read.");
} else {
  try {
    live = (JSON.parse(readFileSync(BACKUP, "utf8")) as { articles?: Article[] })
      .articles ?? [];
  } catch (e) {
    failures++;
    const said = e instanceof Error ? e.message : String(e);
    console.error(`unreadable-backup  content/articles.backup.json   (${said})`);
  }
}

for (const article of live) {
  if (SLUG.test(article.slug ?? "")) continue;
  failures++;
  console.error(`bad-slug  ${JSON.stringify(article.slug)}   (live article: "${article.title}")`);
  console.error("        a slug may only contain lowercase letters, digits and hyphens");
}

for (const url of [...targets].sort()) {
  const t = trace(url);
  if (t.status === "ok") continue;
  failures++;
  const from = linkSources.get(url);
  console.error(`${t.status}  ${url}${from ? `   (linked from ${from})` : ""}`);
  console.error(`        ${t.chain.join(" → ")}`);
}

/* ============================================================
   A redirect must point at a page that EXISTS, not at one whose
   shape a route pattern recognises.

   `workerAnswers()` above answers "a Worker renders this" for any
   path matching a route pattern, which is the right answer for
   the question it is asked and is not the whole question. A
   pattern says an address is well formed. It cannot say there is
   anything behind it.

   Two rules got through it on the day #28 landed:

     /deutsch/stufe-4/arbeitsbuch.html -> /deutsch/stufe-4/arbeitsbuch
     /english/term-2/workbook.html     -> /english/term-2/workbook

   Neither stage declares a `workbook` in `shared/curricula/`, so
   neither ever had a practice book. Each rule pointed an address
   that was never live at one that does not exist, both traced
   clean here, and both 404ed on the deployed site.

   The ladder is the data and this reads it, which is the rule at
   the top of `CLAUDE.md`: a list of things that exist comes from
   the data, never from a shape that looks right.
   ============================================================ */
{
  const BOOKS = new Set<string>();
  const LADDERS = { money: MONEY, deutsch: STUFEN, english: TERMS, quran: DHAPS };
  for (const [school, ladder] of Object.entries(LADDERS)) {
    for (const rung of ladder) {
      /* `workbook` ONLY, and `uebung` deliberately not. They read
         like alternatives and are not the same kind of thing: a
         `workbook` is an object with a slug and therefore a page,
         a `uebung` is a STRING, the note a stage carries instead
         of having a book. Stufe 4 has one, which is exactly why
         it has no practice book and why the rule pointing at one
         was wrong.

         `in` rather than a cast, because the four ladders are four
         types and the money school's `Stage` declares neither. */
      const book = "workbook" in rung ? rung.workbook : undefined;
      if (book) BOOKS.add(`/${school}/${rung.slug}/${book.slug}`);
    }
  }
  /* Only the practice books, because they are the one address on
     this site whose existence is a FIELD rather than a row: a
     stage without a `workbook` has no page, and nothing else here
     can tell. Lessons and stages come out of D1, which this check
     cannot reach. */
  const BOOKISH = /^\/(deutsch|english|quran|money)\/[a-z0-9-]+\/(arbeitsbuch|workbook|uebung)$/;
  for (const rule of rules) {
    if (!BOOKISH.test(rule.to) || BOOKS.has(rule.to)) continue;
    failures++;
    console.error(`MISSING  ${rule.from} redirects to ${rule.to}`);
    console.error("        No stage in shared/curricula/ declares that practice book,");
    console.error("        so the destination has no page and the source never had one.");
    console.error("        A redirect is a fact about an address that WAS live.");
  }
}

/* ============================================================
   A PAGE THAT WAS A DIRECTORY IS STILL AT ITS DIRECTORY ADDRESS.

   Cloudflare's `html_handling` serves `deutsch/index.html` at
   `/deutsch/`, WITH the slash. So for every page that was a file
   called `index.html`, the directory form was its canonical
   address: it is what the sitemap resolved to, what a crawler
   indexed, and what anybody who bookmarked one has.

   Task #28 dropped `.html` from every address and wrote a 301 for
   `/deutsch/index.html`, which is the other spelling of the same
   page. Nothing covered `/deutsch/`. It matched no route pattern,
   fell to the asset router, whose copy of the file had left in the
   same commit, and 21 addresses 404ed on a site where every
   internal link still worked: four school hubs and seventeen
   stage ladders. Every check here passed, because nothing on this
   site links the directory form. The readers who had it were the
   ones who had been here longest.

   The list is not typed out. A rule whose source ends
   `/index.html` IS the statement that the page was a directory,
   so `_redirects` names them, and the next one added gets checked
   without anybody remembering to come here.
   ============================================================ */
{
  for (const rule of rules) {
    const dir = /^(.*)\/index\.html$/.exec(rule.from);
    if (!dir) continue;
    const path = `${dir[1]}/`;
    const got = trace(path);
    if (got.status === "ok") continue;
    failures++;
    console.error(`SLASH    ${path} is not answered (${got.status})`);
    console.error(`        ${rule.from} says this page was a directory, so ${path} was`);
    console.error("        its canonical address and is what a bookmark or a crawler holds.");
    console.error(`        ${got.chain.join(" \u2192 ")}`);
  }
}

/* ============================================================
   EVERY LINK IN THE SITE'S OWN CHROME RESOLVES.

   `shared/nav.ts` is the one table the rail, the footer and /skills
   are all drawn from, so an address in it is on all 251 pages.
   Nothing checked it. This file walks `aab/` for links, and the
   chrome stopped being a file when the rail became a component,
   so the most-linked addresses on the site were the least
   checked ones.

   `/skills/courses` is what that cost. `run_worker_first` in
   wrangler.toml carried `/skills/courses/*` and not the bare
   path, and a `*` matches what comes AFTER the slash: the hub's
   own address was never forwarded to the Worker, the asset
   router answered, there is no file, and the entry in the rail
   pointed at this site's 404 page. `/skills/courses/` made it
   worse by 308ing into the same place, while
   `/skills/courses/index.html` and every course under it
   answered perfectly, which is why it read as "the course is
   gone" rather than as a routing bug.

   Fragments are dropped before the walk: `/skills#reviews` is
   the `/skills` page and the fragment is a place on it.
   ============================================================ */
{
  const seen = new Set<string>();
  for (const group of NAV) {
    for (const item of group.items) {
      const href = String(item.href ?? "").split("#")[0];
      if (!href.startsWith("/") || seen.has(href)) continue;
      seen.add(href);
      const got = trace(href);
      if (got.status === "ok") continue;
      failures++;
      console.error(`NAV      ${href} (${item.label}) does not resolve: ${got.status}`);
      console.error("        It is in shared/nav.ts, so it is a link in the rail, the footer");
      console.error("        and /skills, which is every page of this site.");
      console.error(`        ${got.chain.join(" \u2192 ")}`);
    }
  }
}

/* ============================================================
   A PAGE WITH NO LAYOUT IS A PAGE WITH NO STYLESHEET

   The stylesheet is imported at the top of `shell.tsx`, so Next
   compiles it, hashes it and emits the `<link>` itself. A route
   that mounts no shell therefore links no stylesheet, and the
   shell is mounted by a LAYOUT: `siteLayout()` in
   `components/page.tsx` is what nearly every one of them is.

   Next answers a missing root layout by generating an empty one
   rather than by failing, so the page renders. It renders as
   bare HTML: no rail, no bar, no footer, default link colours,
   and every inline SVG at its intrinsic size.

   That shipped. `/tools/routine` had no `layout.tsx` for four
   pull requests and every check passed, because every other
   check reads MARKUP and the markup was right. Nothing here can
   see a stylesheet that was never linked; what it can see is the
   file that would have linked it.
   ============================================================ */
/* ---- AND A PAGE INSIDE TWO OF THEM IS THE SAME BUG UP ----

   Layouts NEST. A `layout.tsx` at `/admin/` wraps everything
   under it, so a second one at `/admin/research/` renders the
   whole shell twice: two rails, two top bars, two footers, two
   boot scripts writing the same three attributes on `<html>`,
   and `margin-left: var(--rail-w)` applied to two nested
   `.shell-col`s.

   IT RENDERS PERFECTLY. The rail and the bar are `position:
   fixed`, so the two copies sit exactly on top of each other and
   a screenshot shows one of each. What the page loses is width:
   268px of it, off the left, on the one route that most needed
   the room. It was found by measuring the element rather than by
   looking at it.

   `/portfolio/(hub)/` and `/tools/(hub)/` are what a section
   whose own page needs a shell does instead: the group holds the
   page and its layout, and a child route brings its own. */
{
  const app = join(NEXT, "app");
  /** A layout that mounts the site shell, as against one that
      only groups. `siteLayout()` is what nearly every one is. */
  const mountsShell = (dir: string): boolean => {
    try {
      return /\bsiteLayout\s*\(/.test(readFileSync(join(dir, "layout.tsx"), "utf8"));
    } catch { return false; }
  };
  const walkApp = (dir: string, layouts: number, shells: string[]): void => {
    let entries: string[] = [];
    try { entries = readdirSync(dir); } catch { return; }
    const has = entries.includes("layout.tsx");
    const here = layouts + (has ? 1 : 0);
    const stack = has && mountsShell(dir) ? [...shells, relative(ROOT, dir)] : shells;

    if (entries.includes("page.tsx") && here === 0) {
      failures++;
      const where = relative(ROOT, dir);
      console.error(`LAYOUT   ${where}/page.tsx is not inside any layout.`);
      console.error("        The stylesheet is imported by components/shell.tsx and the shell");
      console.error("        is mounted by a layout, so this page renders with no CSS and no");
      console.error("        chrome. Add a layout.tsx here or in a directory above it:");
      console.error('            export default siteLayout({ current: "..." });');
    }
    if (entries.includes("page.tsx") && stack.length > 1) {
      failures++;
      console.error(`LAYOUT   ${relative(ROOT, dir)}/page.tsx is inside `
        + `${stack.length} shells.`);
      console.error(`        ${stack.join("\n        ")}`);
      console.error("        Layouts nest, so this page renders the rail, the bar, the footer");
      console.error("        and the boot script once each per shell, and --rail-w is taken off");
      console.error("        the width once per shell. Both fixed layers sit exactly on top of");
      console.error("        each other, so it LOOKS right. Put the outer page and its layout");
      console.error("        in a route group of their own, the way (hub) does under /portfolio");
      console.error("        and /tools.");
    }

    for (const name of entries) {
      if (name.startsWith(".") || name === "node_modules") continue;
      const full = join(dir, name);
      if (statSync(full).isDirectory()) walkApp(full, here, stack);
    }
  };
  walkApp(app, 0, []);
}

console.log(
  failures
    ? `\n${failures} broken route(s): fix before deploying.`
    : `${targets.size} routes checked, all resolve.`
);
process.exit(failures ? 1 : 0);
