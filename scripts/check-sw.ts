/* check-sw.ts: did a precached file change without a VERSION bump?

       node scripts/check-sw.ts            verify
       node scripts/check-sw.ts --update   record the current state

   A precached file is answered from the cache that holds it, and
   only a new VERSION empties that cache. Change one without
   bumping VERSION and every returning visitor keeps the old copy,
   silently and indefinitely, and invisibly to whoever made the
   change, because their own browser has no service worker in the
   way during development.

   Every file in sw.js's PRECACHE list is hashed and the hashes are
   recorded in sw-manifest.json alongside the VERSION they belong
   to. */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, readdirSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative, sep } from "node:path";

/* `AAB` is the served directory and `HERE` used to be it: every
   file in `aab/` answers at a public URL, so a check living there
   is a check published.

   `sw-manifest.json` stays in `aab/`, and that is not an
   oversight: it is data about files in that directory, committed
   beside them, and moving it would change a path in the one place
   a stale-cache bug is least welcome. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");
const MANIFEST = join(AAB, "sw-manifest.json");
const update = process.argv.includes("--update");

const sw = await readFile(join(AAB, "sw.js"), "utf8");

const version = sw.match(/const VERSION = "([^"]+)"/)?.[1];
if (!version) {
  console.error("could not find VERSION in sw.js");
  process.exit(1);
}

/* The PRECACHE array, read out of the source rather than duplicated
   here, a second copy of the list would drift from the first. */
const block = sw.match(/const PRECACHE = \[([\s\S]*?)\];/)?.[1];
if (!block) {
  console.error("could not find the PRECACHE list in sw.js");
  process.exit(1);
}
const paths = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

/* ---- And the entries that are addresses rather than files.

   Six of the pages this worker precaches are built by a Worker out
   of the database, so there is nothing in aab/ to hash. That is
   not a hole: a rendered page changes when a row changes and no
   VERSION could ever have tracked that, which is what
   network-first is for.

   What CAN go wrong is an address in the list that nothing serves,
   because an install that fetches a 404 caches a 404 and the
   reader who finds out is the one with no connection. So each is
   held to being a route worker.js forwards. ---- */
const renderedBlock = sw.match(/const RENDERED = \[([\s\S]*?)\];/)?.[1] ?? "";
const rendered = [...renderedBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

if (rendered.length) {
  const { nextOwns } = await import("../worker.js");
  const orphans = rendered.filter((p) => !nextOwns(p));
  if (orphans.length) {
    console.error(`sw.js precaches ${orphans.length} address(es) that no route `
      + "in worker.js answers:");
    for (const o of orphans) console.error(`   ${o}`);
    console.error("\nAn install would fetch a 404 and cache it. Add the route to "
      + "NEXT_ROUTES,\nor take the address out of RENDERED.");
    process.exit(1);
  }
}

/* ---- A precached module whose import is not precached

   `app.js` imports `pieces.js`, and a shell without it is an
   app.js whose import resolves to nothing: the menu, the palette
   and every list of writing die together on the first offline
   visit. That reasoning was written down and then applied by hand
   every time, and went wrong again when the two practice books
   became callers of `/schools/workbook.js`: the callers stayed
   precached and the engine was not.

   A STATIC import only. `signin.js` is imported lazily inside a
   try, so an offline visit without it is a page with no sign-in
   button rather than a broken one. A dynamic import that fails is
   a feature switching off; a static one takes the module with
   it. ---- */
const precached = new Set(paths);
const unreachable = [];

for (const p of paths) {
  if (!p.endsWith(".js")) continue;
  let src;
  try {
    src = await readFile(join(AAB, p.replace(/^\//, "")), "utf8");
  } catch {
    continue;      // the missing-file check below says so properly
  }
  /* The three static forms: a side-effect `import "/a.js"`, an
     `import ... from "/a.js"`, and an `export ... from "/a.js"`.
     Both `from` kinds may span lines, so the gap is `[^;]` and not
     `.`.

     Written out rather than approximated, because a looser version
     found two things that are not imports: a DYNAMIC import inside
     a catch, which is the shape that is allowed to fail, and an
     export whose DEFAULT PARAMETER is a path. Adding either to
     PRECACHE would be a file served to every reader for no reason,
     on the word of a check. */
  const specs = [
    ...src.matchAll(/(?:^|\n)\s*import\s+["'](\/[^"']+)["']/g),
    ...src.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?\bfrom\s*["'](\/[^"']+)["']/g),
  ];
  for (const [, spec] of specs) {
    if (!precached.has(spec)) unreachable.push({ from: p, spec });
  }
}

/* THE PATTERN FOR A FILE WHOSE NAME NEVER CHANGES.

   `STABLE_BUNDLE` in sw.js is network-first because
   `/studio/app.js` is the one script here that is neither
   content-hashed nor precached, so nothing else could tell a new
   build from an old one and the Studio was always a load behind.

   A pattern is a promise about a directory and a directory can
   move. A pattern matching nothing costs a reader nothing, which
   is exactly why it would sit here through the next rename,
   quietly putting the thing it was written for back on the
   cache-first branch. */
const stable = sw.match(/const STABLE_BUNDLE = ([^;]+);/)?.[1];
if (!stable) {
  console.error("could not find STABLE_BUNDLE in sw.js");
  process.exit(1);
}
const pattern = new RegExp(
  stable.trim().replace(/^\//, "").replace(/\/[gimsuy]*$/, ""));

/** Every file under `aab/`, as the address it answers at. */
const served: string[] = [];
(function walk(dir: string): void {
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name === "src") continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) { walk(full); continue; }
    served.push("/" + relative(AAB, full).split(sep).join("/"));
  }
})(AAB);

const covered = served.filter((path) => pattern.test(path));
if (!covered.length) {
  console.error(`sw.js's STABLE_BUNDLE is ${stable.trim()} and nothing in aab/ `
    + "matches it.");
  console.error("\nIt is what keeps a stable-path bundle off the cache-first");
  console.error("branch, so a pattern matching nothing is that bundle silently");
  console.error("going back to being one build behind. Point it at what is");
  console.error("built there now, or take it out with the last thing it named.");
  process.exit(1);
}

if (unreachable.length) {
  console.error(`sw.js precaches ${unreachable.length} module(s) whose static `
    + "import is not precached:");
  for (const u of unreachable) console.error(`   ${u.from}  imports  ${u.spec}`);
  console.error("\nOffline, the cached module loads and its import resolves to");
  console.error("nothing, so the module dies and takes its feature with it.");
  console.error("Add the import to PRECACHE, or take its caller out.");
  process.exit(1);
}

/* A WORKER THAT CACHES AN ERROR IS WORSE THAN NO CACHE.

   `fetch` rejects on a network failure and on NOTHING else: a 500,
   a 404 and a 302 all resolve, so a navigation handler that writes
   every answer into the cache writes those too and hands them back
   from its own offline branch later. A cached error outlives the
   minute that caused it, and nothing else can see it: the page
   renders, the worker installs, every other check passes.

   Asserted as a fact about the SOURCE rather than by driving a
   worker, because reproducing it needs a browser, a served origin
   and an install cycle. */
{
  /* Per PUT, not per file. Asking whether `response.ok` appears
     anywhere in sw.js is a check that cannot fail: there are two
     places that write to a cache and the other was already
     guarded, so removing this guard leaves the file still
     containing the words. */
  const unguarded = [...sw.matchAll(/\bc(?:ache)?\.put\(/g)]
    .filter((m) => !/response\.ok/.test(sw.slice(Math.max(0, m.index - 200), m.index)));
  if (unguarded.length) {
    console.error(`sw.js writes to a cache ${unguarded.length} time(s) `
      + "without asking whether the answer was ok.");
    console.error("");
    console.error("   `fetch` resolves for a 500 and for a 404, so both get stored and");
    console.error("   both come back from the offline branch. Guard the put with");
    console.error("   `if (response.ok)`, and bump VERSION: a new one is the only thing");
    console.error("   that empties the caches already holding an error page.");
    process.exit(1);
  }
}

/* A PAYLOAD IS NOT A FILE, and the cache-first branch treats
   everything that is not HTML as one.

   Next fetches a React Server Component payload at the route's own
   address with `_rsc` on it, on every client-side navigation and
   every prefetch. It describes ONE route under ONE build, varies
   on four router headers, and a prefetch payload is partial on
   purpose, so one captured under an earlier build answers a
   navigation under the next: /admin drew its heading and none of
   its thirteen panels for days, with the HTML, the chunks and the
   stylesheet on the server all correct.

   Asserted against the source for the reason the guard above is:
   the condition needs a registered worker, a served origin and two
   builds to reproduce. */
{
  /* Comments STRIPPED. The first version looked for the string
     `_rsc` before the first respondWith, and the paragraph
     explaining the exclusion says `_rsc` in it, so deleting the
     exclusion left the check passing on its own explanation.

     And before the first respondWith, because an exclusion written
     after the worker has answered is not an exclusion. */
  const code = sw.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  const head = code.slice(0, code.indexOf("respondWith"));
  const missing = ([
    ['searchParams.has("_rsc")', "an RSC payload"],
    ['pathname === "/admin"', "/admin"],
  ] as const).filter(([shape]) => !head.includes(shape));

  if (missing.length) {
    console.error(`sw.js does not exclude ${missing.map(([, what]) => what).join(" or ")} `
      + "from the fetch handler before it answers.");
    missing.forEach(([shape]) => console.error(`      expected: ${shape}`));
    console.error("");
    console.error("   Anything that is not HTML is served cache-first, so an RSC");
    console.error("   payload from an earlier build answers a navigation under this");
    console.error("   one, and a private page is left in a cache the next reader at");
    console.error("   the same machine is handed. Return early for both, and bump");
    console.error("   VERSION: a new one is the only thing that empties a cache");
    console.error("   already holding a payload.");
    process.exit(1);
  }
}

/** Each precached path against the first sixteen hex characters of
    its SHA-256, written to `sw-manifest.json` beside the VERSION
    the hashes belong to: a file that changed under a VERSION that
    did not is what this check looks for. */
type Hashes = Record<string, string>;

const hashes: Hashes = {};
const missing: string[] = [];
for (const p of paths) {
  // "/" is the same file as /index.html on a static host
  const rel = p === "/" ? "index.html" : p.replace(/^\//, "");
  try {
    const buf = await readFile(join(AAB, rel));
    hashes[p] = createHash("sha256").update(buf).digest("hex").slice(0, 16);
  } catch {
    missing.push(p);
  }
}

if (missing.length) {
  console.error(`sw.js precaches ${missing.length} file(s) that do not exist:`);
  for (const m of missing) console.error(`   ${m}`);
  process.exit(1);
}

if (update) {
  /* ---- --update may RECORD a bump. It may not EXCUSE one ----

     This wrote the manifest at whatever VERSION sw.js said and
     exited 0, without looking at the manifest it was overwriting.
     So the sequence that feels natural, edit a precached file and
     then run `--update` because the check complained, is the one
     that disarms the check: the new hashes go in under the OLD
     version, every later run compares clean, and every returning
     reader keeps the file they had.

     So `--update` refuses the one case it must: content moved,
     version did not. Bump first and record second, which is the
     order the changelog at the top of sw.js describes. */
  const prior = existsSync(MANIFEST)
    ? JSON.parse(await readFile(MANIFEST, "utf8")) as Manifest
    : null;
  if (prior && prior.version === version) {
    const moved = Object.keys(hashes)
      .filter(p => prior.hashes[p] && prior.hashes[p] !== hashes[p]);
    if (moved.length) {
      console.error(`STALE CACHE RISK: ${moved.length} precached file(s) changed`
        + ` and VERSION is still ${version}:`);
      for (const m of moved) console.error(`   ${m}`);
      console.error("\nRecording this would hide the change rather than ship it.");
      console.error("Bump VERSION in aab/sw.js with a changelog line saying what");
      console.error("changed and why it needs the bump, then run this again.");
      process.exit(1);
    }
  }
  await writeFile(MANIFEST, `${JSON.stringify({ version, hashes }, null, 2)}\n`);
  console.log(`sw-manifest.json written: ${version}, ${paths.length} files`
    + (rendered.length ? ` and ${rendered.length} rendered page(s)` : ""));
  process.exit(0);
}

/** The manifest as it is on disk: the VERSION it was written for
    and the hashes at that moment. */
interface Manifest {
  version: string;
  hashes: Hashes;
}

let prev: Manifest;
try {
  prev = JSON.parse(await readFile(MANIFEST, "utf8")) as Manifest;
} catch {
  console.error("no sw-manifest.json: run: node scripts/check-sw.ts --update");
  process.exit(1);
}

const changed = paths.filter((p) => prev.hashes[p] !== hashes[p]);
const added = paths.filter((p) => !(p in prev.hashes));
const removed = Object.keys(prev.hashes).filter((p) => !paths.includes(p));

if (!changed.length && !added.length && !removed.length) {
  console.log(`sw ${version}: ${paths.length} precached files, none changed`
    + (rendered.length ? `, and ${rendered.length} rendered page(s), each one a route.` : "."));
  process.exit(0);
}

if (version !== prev.version) {
  console.log(`sw ${prev.version} → ${version}, ${changed.length} file(s) changed. Fine.`);
  console.log("   run: node scripts/check-sw.ts --update");
  process.exit(0);
}

console.error(`STALE CACHE RISK: VERSION is still ${version} but precached files changed:`);
for (const p of changed) console.error(`   changed  ${p}`);
for (const p of added) console.error(`   added    ${p}`);
for (const p of removed) console.error(`   removed  ${p}`);
console.error("\nEvery returning visitor will keep the old copies until VERSION moves.");
console.error("Bump VERSION in sw.js, then run: node scripts/check-sw.ts --update");
process.exit(1);
