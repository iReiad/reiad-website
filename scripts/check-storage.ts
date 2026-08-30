/* ============================================================
   check-storage.ts: everything this site keeps in a browser is
   described, and what it says about itself is true.

     node scripts/check-storage.ts
     node scripts/check-storage.ts --list

   `shared/storage.ts` is the table. This is what stops it from
   becoming the kind of tracker CLAUDE.md opens by warning about:
   right on the day it was written, and wrong the first time
   somebody adds a key.

   Four questions, and each is a different way of being wrong.

   1. IS ANYTHING HELD AND NOT DESCRIBED? The common one. Somebody
      writes `localStorage.setItem("thing", …)` in a component and
      the site is now keeping something no page can tell a reader
      about, no export includes and no erase removes.

   2. DOES A ROW STILL NAME A FILE THAT WRITES IT? A key renamed
      in the code and not here reads as a description of the site
      and describes a version of it that is gone. Worse, the row
      says `syncs: true` about a string the account has never
      seen.

   3. DOES `syncs` MATCH `sync.ts`? This is the expensive one and
      it is invisible from either side alone. A row that claims to
      sync and is not in `KEYS` is a promise the account page
      makes and the account does not keep: the reader ticks
      something on a phone and it is not on the laptop, and every
      check passes. The reverse, a key synced and described as
      local, is the same lie the other way round: the account
      page's "erase everything" would leave it behind.

   4. DOES ANYTHING A READER DID, MADE OR CHOSE FAIL TO SYNC
      WITHOUT SAYING WHY? For those three kinds the default answer
      is that it should, so a blank is how a key quietly stops
      being carried between devices. Machinery, caches and facts
      about one machine need no excuse.
   ============================================================ */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { KEPT, HELD_ORDER, HELD_LABEL, MINE, type Keep } from "../shared/storage.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");

let failures = 0;
const fail = (...lines: string[]): void => {
  failures += 1;
  console.error(`\n  x ${lines.join("\n        ")}`);
};

/* ---------- the code, as text ---------- */

/** Where a browser key could be written. `archive/` is history
    and `node_modules` is somebody else's. */
const LOOK = ["aab", "next", "app/src", "shared"];
const SKIP = /node_modules|[/\\]\.next[/\\]|[/\\]archive[/\\]|[/\\]dist[/\\]/;

function* walk(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const at = join(dir, name);
    if (SKIP.test(at)) continue;
    if (statSync(at).isDirectory()) { yield* walk(at); continue; }
    if (/\.(ts|tsx|js|jsx)$/.test(at)) yield at;
  }
}

const sources = LOOK.flatMap((dir) => [...walk(join(ROOT, dir))])
  .map((at) => ({ at: relative(ROOT, at).replaceAll("\\", "/"), text: readFileSync(at, "utf8") }))
  /* A test drives storage with fixtures; the keys it names are
     the ones the module under test uses, and it is not the place
     a new one is introduced. */
  .filter((f) => !/\.test\.[jt]sx?$/.test(f.at));

const known = new Set(KEPT.map((k) => k.key));

/* ---------- 1. held and not described ---------- */

/** A literal handed straight to storage. */
const DIRECT = /\b(?:local|session)Storage\.(?:getItem|setItem|removeItem)\(\s*"([^"]+)"/g;

/** A constant that a file which touches storage declares, and
    calls a key or a store. The other half of the same question:
    most of this site names its keys once at the top of a file and
    passes the constant.

    A key is a NAME, so anything with a space or the shape of a
    credential is not one. `SUPABASE_KEY` is a publishable API key
    that happens to live in a file that also touches storage, and
    matching it made this check demand a description of somebody
    else's token. */
const NAMED = /\bconst\s+[A-Z][A-Z0-9_]*(?:KEY|STORE)[A-Z0-9_]*\s*=\s*"([a-z][a-z0-9-]{1,31})"/g;

const seen = new Map<string, string>();
for (const file of sources) {
  const touches = /(?:local|session)Storage/.test(file.text);
  for (const [, key] of file.text.matchAll(DIRECT)) {
    if (!seen.has(key)) seen.set(key, file.at);
  }
  if (!touches) continue;
  for (const [, key] of file.text.matchAll(NAMED)) {
    if (!seen.has(key)) seen.set(key, file.at);
  }
}

for (const [key, at] of seen) {
  if (known.has(key)) continue;
  fail(`"${key}" is kept in a browser and nothing describes it`,
    `written in ${at}`,
    "Add it to KEPT in shared/storage.ts: what it is in one line a reader",
    "could read, which kind it is, and whether it syncs. A key nobody",
    "described is a key no page can tell a reader about, no export",
    "includes and no erase removes.");
}

/* ---------- 2. described and gone ---------- */

for (const row of KEPT) {
  /* A legacy key is one nothing writes any more, which is the
     definition, so it is exempt from this question and only from
     this one. Something must still MENTION it, or the sweep that
     deletes it has gone too. */
  const at = join(ROOT, row.by);
  let text: string;
  try { text = readFileSync(at, "utf8"); } catch {
    fail(`"${row.key}" says it is written by ${row.by}`,
      "and that file is not there. Follow the key to where it lives now.");
    continue;
  }
  /* A key BUILT from a prefix rather than written out: the four
     `<school>-checks` are `${prefix}-checks` inside one shared
     module, which is the arrangement that keeps four schools on
     one engine. The row names the file and the fragment, and both
     have to be there. */
  const said = text.includes(`"${row.key}"`)
    || (row.built ? text.includes(row.built) : false);
  if (!said) {
    fail(`"${row.key}" is not in ${row.by}`,
      row.held === "legacy"
        ? "Nothing sweeps it up any more, so the row can go too."
        : "The row names the file that writes it, and that file does not say"
          + "\n        the string. A key renamed in the code and not here describes a"
          + "\n        version of this site that is gone.");
  }
}

/* ---------- 3. does it really sync ---------- */

const SYNC = (() => {
  const text = readFileSync(join(ROOT, "aab", "src", "sync.ts"), "utf8");
  const block = /const KEYS: Record<[^>]*> = \{([\s\S]*?)\n\};/.exec(text)?.[1];
  if (!block) {
    console.error("could not find KEYS in aab/src/sync.ts");
    process.exit(1);
  }
  return new Set([...block.matchAll(/^\s*"([^"]+)":\s*\[/gm)].map((m) => m[1]));
})();

for (const row of KEPT) {
  if (row.syncs && !SYNC.has(row.key)) {
    fail(`"${row.key}" says it syncs and KEYS in aab/src/sync.ts does not carry it`,
      "The account page offers it, the account never sees it, and the reader",
      "finds out on their second device. Add it to that table with a rule,",
      "or say `syncs: false` here with the reason.");
  }
}
for (const key of SYNC) {
  const row = KEPT.find((k) => k.key === key);
  if (!row) {
    fail(`"${key}" is synced by aab/src/sync.ts and nothing describes it`,
      "Add it to KEPT in shared/storage.ts.");
  } else if (!row.syncs) {
    fail(`"${key}" is described as local and aab/src/sync.ts syncs it`,
      "One of the two is wrong, and if it is this table then a reader has",
      "been told their data stays on the machine while it does not.");
  }
}

/* ---------- 4. a reader's own, quietly not carried ---------- */

for (const row of KEPT) {
  if (row.syncs || !MINE.includes(row.held)) continue;
  if (!row.why?.trim()) {
    fail(`"${row.key}" is something the reader ${
      row.held === "progress" ? "did" : row.held === "made" ? "made" : "chose"
    } and does not sync, with no reason given`,
      "For those three the default answer is that it should, so a blank is",
      "how a key stops being carried between devices without anybody",
      "deciding. Write the reason, or sync it.");
  }
}

/* ---------- say what is held ---------- */

if (LIST) {
  for (const held of HELD_ORDER) {
    const rows = KEPT.filter((k: Keep) => k.held === held);
    if (!rows.length) continue;
    console.log(`\n${HELD_LABEL[held]}`);
    for (const row of rows) {
      console.log(`  ${row.syncs ? "↑" : " "} ${row.key.padEnd(22)} ${row.what}`);
    }
  }
  console.log("");
}

if (failures) {
  console.error(`\nstorage: ${failures} problem(s).`);
  process.exit(1);
}
console.log(`storage: ${KEPT.length} key(s) held in a browser, every one described,`
  + ` ${KEPT.filter((k) => k.syncs).length} of them carried to the account,`
  + " and the two tables agree.");
