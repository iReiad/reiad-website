/* ============================================================
   check-sw.mjs — did a precached file change without a VERSION bump?

   This exists because the same mistake has now been made twice.
   sw.js precaches the shell, and a precached file is answered from
   the cache that holds it; only a new VERSION empties that cache.
   Change app.js or styles.css without bumping VERSION and every
   returning visitor keeps the old copy — silently, indefinitely,
   and invisibly to whoever made the change, because their own
   browser has no service worker in the way during development.

   It happened at v3 (page views went uncounted for as long as the
   old app.js survived) and again at v9, when the stock check was
   fixed three times and not one of those fixes reached anyone.

   HOW IT WORKS

   Every file in sw.js's PRECACHE list is hashed and the hashes are
   recorded in sw-manifest.json alongside the VERSION they belong
   to. Run this before committing:

       node check-sw.mjs            verify
       node check-sw.mjs --update   record the current state

   If any precached file has changed since the manifest was written
   and VERSION has not moved, it fails and says which files.
   ============================================================ */

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const MANIFEST = join(HERE, "sw-manifest.json");
const update = process.argv.includes("--update");

const sw = await readFile(join(HERE, "sw.js"), "utf8");

const version = sw.match(/const VERSION = "([^"]+)"/)?.[1];
if (!version) {
  console.error("could not find VERSION in sw.js");
  process.exit(1);
}

/* The PRECACHE array, read out of the source rather than duplicated
   here — a second copy of the list would drift from the first. */
const block = sw.match(/const PRECACHE = \[([\s\S]*?)\];/)?.[1];
if (!block) {
  console.error("could not find the PRECACHE list in sw.js");
  process.exit(1);
}
const paths = [...block.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

const hashes = {};
const missing = [];
for (const p of paths) {
  // "/" is the same file as /index.html on a static host
  const rel = p === "/" ? "index.html" : p.replace(/^\//, "");
  try {
    const buf = await readFile(join(HERE, rel));
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
  console.log(`sw-manifest.json written: ${version}, ${paths.length} files`);
  process.exit(0);
}

let prev = null;
try {
  prev = JSON.parse(await readFile(MANIFEST, "utf8"));
} catch {
  console.error("no sw-manifest.json — run: node check-sw.mjs --update");
  process.exit(1);
}

const changed = paths.filter((p) => prev.hashes[p] !== hashes[p]);
const added = paths.filter((p) => !(p in prev.hashes));
const removed = Object.keys(prev.hashes).filter((p) => !paths.includes(p));

if (!changed.length && !added.length && !removed.length) {
  console.log(`sw ${version}: ${paths.length} precached files, none changed.`);
  process.exit(0);
}

if (version !== prev.version) {
  console.log(`sw ${prev.version} → ${version}, ${changed.length} file(s) changed. Fine.`);
  console.log("   run: node check-sw.mjs --update");
  process.exit(0);
}

console.error(`STALE CACHE RISK — VERSION is still ${version} but precached files changed:`);
for (const p of changed) console.error(`   changed  ${p}`);
for (const p of added) console.error(`   added    ${p}`);
for (const p of removed) console.error(`   removed  ${p}`);
console.error("\nEvery returning visitor will keep the old copies until VERSION moves.");
console.error("Bump VERSION in sw.js, then run: node check-sw.mjs --update");
process.exit(1);
