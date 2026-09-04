#!/usr/bin/env node
/* check-api.ts: does the browser call routes that exist?

       node scripts/check-api.ts

   `aab/api.js` knows every endpoint by string and `worker.js`
   decides what `/api/signals` means by a table of prefixes.
   Nothing connects the two. Rename a mount and the browser keeps
   asking for the old one; every call returns `null` on failure by
   design, so the page does not break, it quietly stops doing the
   thing.

   1. Every mount the browser asks for is a mount `worker.js`
      routes, whether through `api()` or a plain `fetch`. The first
      segment after `/api/` is the whole of the contract.
   2. Every mount `worker.js` routes is asked for by something, or
      is listed below as one nothing in a browser calls.

   It does not check the path after the mount, the method or the
   body: those are the handler's, and a check that tried to know
   them would be a second copy of every handler. */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

/* ---------- what the Worker routes ---------- */

const worker = readFileSync(join(ROOT, "worker.js"), "utf8");
const table = worker.match(/const API_ROUTES = \[([\s\S]*?)\n\];/)?.[1];
if (!table) {
  console.error("could not find API_ROUTES in worker.js");
  process.exit(1);
}
const mounts = [...table.matchAll(/\["\/api\/([a-z-]+)"/g)].map((m) => m[1]);

/* ---------- and the ones the OTHER Worker answers ----------

   A `/api/` path can reach the Next Worker, and one does: the API
   table is consulted first, so a path matching no prefix in it
   falls through to `NEXT_ROUTES`, and a pattern there beginning
   `/api/` is that path being routed. Reading only `API_ROUTES`
   reports a live endpoint as dead.

   Read from the same file rather than listed here, so the day a
   second one is added this check knows without being told. */
const nextTable = worker.slice(worker.indexOf("NEXT_ROUTES"));
const nextMounts = [...nextTable.matchAll(/\/\^\\\/api\\\/([a-z-]+)\\\//g)]
  .map((m) => m[1]);

/* ---------- what the browser asks for ---------- */

/* Two ways of calling this API exist, and the check has to see
   both or it reports the second as dead.

   `api()` in `aab/api.js` takes the path WITHOUT the `/api/`
   prefix, which it adds itself. Both quote styles, because a call
   with an interpolated slug is a template literal, and the
   character after the mount can be a slash, a query, the end of
   the string or the start of an interpolation. The Studio's own
   client is typed, so the generic sits between the name and the
   bracket.

   And `next/components/comments.tsx` calls `fetch("/api/comments")`
   directly. That is not an oversight to tidy: a comment thread
   wants the status code and the error body, and `api()`
   deliberately flattens both into `null` so every other caller can
   have a static fallback. */
const CALL = /\bapi(?:<[^>()]*>)?\(\s*(["'`])([a-z-]+)(?=[/?`"']|\$\{)/g;
const FETCH = /["'`]\/api\/([a-z-]+)(?=[/?`"']|\$\{)/g;

const files: string[] = [];
const walk = (dir: string, skip: string[] = []): void => {
  for (const entry of readdirSync(dir)) {
    if (skip.includes(entry)) continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, skip);
    else if (/\.(js|mjs|ts|tsx)$/.test(entry)) files.push(full);
  }
};
walk(join(ROOT, "aab"), ["og", "node_modules", "studio"]);
walk(join(ROOT, "app", "src"), ["node_modules"]);
/* And the routes and components, because that is where the
   browser's half of this site is. The three shipped directories
   only: a mount that just a test asks for is a mount nothing asks
   for. */
for (const dir of ["app", "components", "lib"]) {
  walk(join(ROOT, "next", dir), ["node_modules"]);
}

/** An endpoint's mount, to the files that ask for it. */
const asked = new Map<string, Set<string>>();

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const note = (mount: string): void => {
    if (!asked.has(mount)) asked.set(mount, new Set());
    asked.get(mount)!.add(relative(ROOT, file));
  };
  for (const [, , mount] of src.matchAll(CALL)) note(mount);
  for (const [, mount] of src.matchAll(FETCH)) note(mount);
}

/* ---------- 1. every mount asked for exists ---------- */

for (const [mount, where] of asked) {
  if (mounts.includes(mount) || nextMounts.includes(mount)) continue;
  fail(`the browser asks for /api/${mount}, which worker.js does not route`,
    `Asked for in: ${[...where].join(", ")}`,
    `worker.js routes: ${mounts.map((m) => `/api/${m}`).join(", ")}`,
    "Every one of those calls returns null on failure by design, so",
    "the page will not break: the feature will quietly stop working.");
}

/* ---------- 2. every mount is asked for ---------- */

/* Not called from a browser, and not meant to be. Listed rather
   than inferred, so that adding another is a decision somebody
   wrote down. The prose here said "three" while the table held
   one, which is the same drift one level up from the thing this
   check watches for. */
const SERVER_ONLY = {
  backup: "a cron writes it to R2, and scripts/restore.ts reads the file",
  site: "the Android app reads the site's own furniture from it. No browser "
    + "does: a browser imports the same tables as an ES module at /content.js",
  tools: "the Android app reads the calculators' words from it. No browser does: "
    + "the stock check imports the same table as an ES module at "
    + "/tools/stock.i18n.js, which shared/tool-strings.ts is compiled to",
  foods: "the Android app reads the portion library from it. No browser does: "
    + "the diet tool imports shared/foods.ts directly, so the rows are in the "
    + "route's own bundle. /api/diet/food is the different thing next door, a "
    + "lookup against two third-party databases, and the browser does ask for that",
};

for (const mount of mounts) {
  if (asked.has(mount)) continue;
  if (mount in SERVER_ONLY) continue;
  fail(`worker.js routes /api/${mount} and nothing in a browser asks for it`,
    "Either something stopped calling it, or it belongs in SERVER_ONLY",
    "with one line saying who does call it.");
}

console.log(failures
  ? `\n${failures} problem(s) between the browser and worker.js.\n`
  : `api: ${asked.size} mount(s) the browser asks for, all routed;\n`
    + `     ${mounts.length} routed here, ${nextMounts.length} forwarded to Next,`
    + ` ${Object.keys(SERVER_ONLY).length} deliberately not called from a browser.\n`);
process.exit(failures ? 1 : 0);
