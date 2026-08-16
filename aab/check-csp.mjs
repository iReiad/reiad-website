/* ============================================================
   check-csp.mjs: can the browser actually reach what the code
   asks for?

   THE BUG THIS EXISTS FOR

   Reader sign-in shipped, worked in every test, and failed on the
   live site with "Failed to fetch". Nothing was wrong with the
   code, the keys, the CORS headers or the server: `connect-src` in
   aab/_headers lists the hosts this site's JavaScript is allowed to
   talk to, and Supabase was not on it, so the browser refused every
   request before it left. Google sign-in still worked, because a
   redirect is a navigation rather than a fetch, which made the
   whole thing look like a Supabase outage rather than a policy this
   repository sets on itself.

   That is the worst shape a bug can have: invisible in review,
   invisible in local testing, and it blames somebody else.

   So: every host the browser-side code names in a fetch has to be
   in connect-src, or listed below as something deliberately not
   fetched. Run it with the other checks.
   ============================================================ */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

/* Hosts that appear in browser code and are never fetched from it.
   Each one needs a reason, because "it is probably fine" is how the
   list stops meaning anything.

   Only browser code is scanned, which is why nothing under
   functions/ is here: a Worker calling Notion or the BBC is on the
   server, where no page policy applies. The Studio never calls
   Notion directly for exactly that reason. If it ever starts, this
   check will say so. */
const NOT_FETCHED = {
  "https://reiad.co.uk": "canonical links, og:url and JSON-LD, never fetched",
  "https://schema.org": "the JSON-LD vocabulary, an identifier and not an address",
  "https://fonts.googleapis.com": "a stylesheet link, covered by style-src",
  "https://www.linkedin.com": "a link in the footer",
  "https://www.tbsnews.net": "a source credited in an article",
  "https://www.bbc.co.uk": "a source credited in an article",
  "https://doi.org": "a citation in the dissertation case study",
  "https://archive.ics.uci.edu": "a dataset credited in a case study",
};

/* ---------- what the policy allows ---------- */

const headers = readFileSync(join(ROOT, "_headers"), "utf8");
const csp = headers.match(/^\s*Content-Security-Policy:\s*(.+)$/m)?.[1];
if (!csp) {
  console.error("no Content-Security-Policy in aab/_headers: this check cannot see the policy.");
  process.exit(1);
}

const connect = (csp.match(/connect-src([^;]*)/)?.[1] ?? "")
  .trim()
  .split(/\s+/)
  .filter(Boolean);

/* ---------- what the code asks for ---------- */

const jsFiles = [];

/* Generated bundles are skipped, and their SOURCE is read instead.

   `aab/desk/app.js` and `aab/studio/app.js` are Vite's output:
   two hundred kilobytes of React each, with this app's few
   hundred lines inside them. Scanning one finds
   `https://react.dev`, which React puts in its error messages and
   never fetches, and it would find a new false alarm on every
   upgrade of somebody else's library.

   Skipping it would lose the guarantee, so `app/src` is walked
   instead. That is where a fetch this site is responsible for
   would actually be written, and it is a hundredth of the size. */
const GENERATED = new Set(["desk", "studio"]);

const walk = (dir, skip = new Set()) => {
  for (const name of readdirSync(dir)) {
    // node_modules is not ours, and the generated schools hold no fetches.
    if (name === "node_modules" || name.startsWith(".")) continue;
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, skip);
    else if (/\.(js|ts|tsx)$/.test(name)) jsFiles.push(path);
  }
};

walk(ROOT, GENERATED);
walk(join(ROOT, "..", "app", "src"));
/* Not `functions/` or `shared/`, on purpose. This check is about
   what a BROWSER is allowed to reach: a Content-Security-Policy
   governs the page, not the Worker that built it, and the Worker
   talks to Notion and to R2 without a browser being involved at
   all. Adding them would report every one of those as a violation
   of a policy that does not apply to them, and `shared/headers.js`
   would report itself, because the policy is what it contains. */

const wanted = new Map();      // origin → the files that name it
for (const path of jsFiles) {
  const src = readFileSync(path, "utf8");
  for (const [, origin] of src.matchAll(/(https:\/\/[a-zA-Z0-9._-]+)/g)) {
    if (!wanted.has(origin)) wanted.set(origin, new Set());
    wanted.get(origin).add(path.slice(ROOT.length + 1));
  }
}

/* ---------- the comparison ---------- */

let failures = 0;

for (const [origin, files] of wanted) {
  if (connect.includes(origin)) continue;
  if (origin in NOT_FETCHED) continue;

  failures++;
  console.error(`\n${origin} is named in ${[...files].join(", ")}`);
  console.error("        but is not in connect-src, and is not listed in NOT_FETCHED.");
  console.error("        If the browser fetches it, add it to the Content-Security-Policy");
  console.error("        line in aab/_headers. If it never does, say so in NOT_FETCHED");
  console.error("        in this file, with the reason.");
}

/* An entry that no longer matches anything is a stale exception,
   and a stale exception is how a real one gets waved through. */
for (const origin of Object.keys(NOT_FETCHED)) {
  if (wanted.has(origin)) continue;
  failures++;
  console.error(`\n${origin} is listed in NOT_FETCHED and appears nowhere in the code.`);
  console.error("        Remove it, so the list keeps meaning something.");
}

console.log(
  failures
    ? `\n${failures} host(s) the browser would refuse to reach: fix before deploying.`
    : `${wanted.size} external host(s) named in browser code, `
      + `${connect.filter((c) => c.startsWith("https")).length} allowed by connect-src, `
      + "none unaccounted for."
);
process.exit(failures ? 1 : 0);
