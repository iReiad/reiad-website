/* ============================================================
   check-sw.js, did a precached file change without a VERSION bump?

   This exists because the same mistake has now been made twice.
   sw.js precaches the shell, and a precached file is answered from
   the cache that holds it; only a new VERSION empties that cache.
   Change app.js or styles.css without bumping VERSION and every
   returning visitor keeps the old copy, silently, indefinitely,
   and invisibly to whoever made the change, because their own
   browser has no service worker in the way during development.

   It happened at v3 (page views went uncounted for as long as the
   old app.js survived) and again at v9, when the stock check was
   fixed three times and not one of those fixes reached anyone.

   HOW IT WORKS

   Every file in sw.js's PRECACHE list is hashed and the hashes are
   recorded in sw-manifest.json alongside the VERSION they belong
   to. Run this before committing:

       node scripts/check-sw.js            verify
       node scripts/check-sw.js --update   record the current state

   If any precached file has changed since the manifest was written
   and VERSION has not moved, it fails and says which files.
   ============================================================ */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

/* `AAB` is the served directory and `HERE` used to be it. Every
   file in `aab/` is uploaded and answers at a public URL, so a
   check living there was a check published at `/check-sw.mjs`,
   kept private only by a line in `.assetsignore` somebody has to
   remember to add. A check outside the served directory cannot be
   served. The extension went with it: the root declares
   `"type": "module"`, so `.js` behaves exactly as `.mjs` did.

   `sw-manifest.json` stays in `aab/`, and that is not an
   oversight: it is data the service worker's own check reads
   about files in that directory, it is committed beside them, and
   moving it would change a path in the one place a stale-cache
   bug is least welcome. */
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

/* ------------------------------------------------------------
   And the entries that are addresses rather than files.

   archive/TRANSITION.md Stage 11.7. Six of the pages this worker
   precaches are built by a Worker out of the database, so there
   is nothing in aab/ to hash. That is not a hole in the check:
   a rendered page changes when a row changes and no VERSION
   could ever have tracked that, which is what network-first is
   for. The hash was always about scripts and stylesheets, and
   those are still files and still hashed.

   What CAN go wrong here is an address in the list that nothing
   serves, because an install that fetches a 404 caches a 404 and
   the reader who finds out is the one with no connection. So
   each one is held to being a route worker.js forwards.
   ------------------------------------------------------------ */
const renderedBlock = sw.match(/const RENDERED = \[([\s\S]*?)\];/)?.[1] ?? "";
const rendered = [...renderedBlock.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

if (rendered.length) {
  const { NEXT_ROUTES } = await import("../worker.js");
  const orphans = rendered.filter((p) => !NEXT_ROUTES.some((re) => re.test(p)));
  if (orphans.length) {
    console.error(`sw.js precaches ${orphans.length} address(es) that no route `
      + "in worker.js answers:");
    for (const o of orphans) console.error(`   ${o}`);
    console.error("\nAn install would fetch a 404 and cache it. Add the route to "
      + "NEXT_ROUTES,\nor take the address out of RENDERED.");
    process.exit(1);
  }
}

/* ------------------------------------------------------------
   A precached module whose import is not precached

   `app.js` imports `pieces.js`, and the note beside that line in
   `sw.js` says why it is in the list: "a shell without it is an
   app.js whose import resolves to nothing: the menu, the palette
   and every list of writing die together on the first offline
   visit."

   That reasoning was written down and then had to be applied by
   hand every time, which is the failure this repository keeps
   naming. It went wrong again on 18 August 2026: the two practice
   books became four lines each over `/schools/workbook.js`, the
   callers stayed precached and the engine was not, so an offline
   visit would have got a printed book with none of the learner's
   writing in it. Nothing here would have said so, and it was
   caught by reading the `pieces.js` comment rather than by any
   check.

   A STATIC import only. `signin.js` is imported lazily by
   `app.js` inside a try, which is why the entry above it says an
   offline visit without it is "a page with no sign-in button
   rather than a broken one". A dynamic import that fails is a
   feature switching off; a static one that fails takes the module
   with it.
   ------------------------------------------------------------ */
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
     `import … from "/a.js"`, and an `export … from "/a.js"`. Both
     of the `from` kinds may span lines, so the gap is `[^;]` and
     not `.`.

     The first version of this was looser and found two things
     that are not imports at all, which is why it is written out
     rather than approximated:

       `import("/engage.js").catch(…)` in app.js, a DYNAMIC import
       inside a catch, which is the shape that is allowed to fail;

       `export const schoolFor = (path = "/money/") =>`, an export
       whose DEFAULT PARAMETER is a path.

     Adding either to PRECACHE would have been two files served to
     every reader for no reason, on the word of a check. */
  const specs = [
    ...src.matchAll(/(?:^|\n)\s*import\s+["'](\/[^"']+)["']/g),
    ...src.matchAll(/(?:^|\n)\s*(?:import|export)\s[^;]*?\bfrom\s*["'](\/[^"']+)["']/g),
  ];
  for (const [, spec] of specs) {
    if (!precached.has(spec)) unreachable.push({ from: p, spec });
  }
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

const hashes = {};
const missing = [];
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
  await writeFile(MANIFEST, `${JSON.stringify({ version, hashes }, null, 2)}\n`);
  console.log(`sw-manifest.json written: ${version}, ${paths.length} files`
    + (rendered.length ? ` and ${rendered.length} rendered page(s)` : ""));
  process.exit(0);
}

let prev = null;
try {
  prev = JSON.parse(await readFile(MANIFEST, "utf8"));
} catch {
  console.error("no sw-manifest.json: run: node scripts/check-sw.js --update");
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
  console.log("   run: node scripts/check-sw.js --update");
  process.exit(0);
}

console.error(`STALE CACHE RISK: VERSION is still ${version} but precached files changed:`);
for (const p of changed) console.error(`   changed  ${p}`);
for (const p of added) console.error(`   added    ${p}`);
for (const p of removed) console.error(`   removed  ${p}`);
console.error("\nEvery returning visitor will keep the old copies until VERSION moves.");
console.error("Bump VERSION in sw.js, then run: node scripts/check-sw.js --update");
process.exit(1);
