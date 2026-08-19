/* ============================================================
   check-csp.ts: can the browser actually reach what the code
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
import { join, dirname, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

/* `AAB` is the browser modules and `ROOT` is the repository. They
   were the same directory until this file moved out of it. Every
   file in `aab/` is uploaded and answers at a public URL, so a
   check living there is a check published, kept private only by a
   line in `.assetsignore` somebody has to remember to add. A check
   outside the served directory cannot be served. */
const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const AAB = join(ROOT, "aab");

/* Hosts that appear in browser code and are never fetched from it.
   Each one needs a reason, because "it is probably fine" is how the
   list stops meaning anything.

   Only browser code is scanned, which is why nothing under
   functions/ is here: a Worker calling Notion or the BBC is on the
   server, where no page policy applies. The Studio never calls
   Notion directly for exactly that reason. If it ever starts, this
   check will say so. */
/* `https://fonts.googleapis.com` was here until 16 August 2026, when
   `studio.js` and `desk.js` were archived and took the last mention
   of it in any scanned file with them. The webfont link lives in
   HTML shells and in `shared/look.ts` now, and this check reads
   neither: it is about what a browser is allowed to *fetch*, and a
   stylesheet link is style-src's business. It comes back the day a
   script names it again, which is the point of the list. */
const NOT_FETCHED = {
  "https://reiad.co.uk": "canonical links, og:url and JSON-LD, never fetched",
  /* One link per file on /skills/courses/, to the original in
     Drive, beside the copy this site serves. Not a fetch and no
     longer a frame either: the video is same-origin media now,
     streamed by the Worker, and the frame-src that used to be in
     `_headers` went with the iframe. A link needs no policy. */
  "https://drive.google.com": "a link to the original, beside each file on /skills/courses/",
  "https://schema.org": "the JSON-LD vocabulary, an identifier and not an address",
  "https://www.linkedin.com": "a link in the footer",
  /* The profile links on the About page, beside the LinkedIn one
     that has been here since before the page was a route. `rel="me"`
     on every one of them: an anchor, never a fetch. */
  "https://x.com": "a profile link on /about.html",
  "https://www.facebook.com": "a profile link on /about.html",
  "https://www.instagram.com": "a profile link on /about.html",
  "https://github.com": "a link to this repository on /about.html",
  /* Links, never fetched: the anchors in `aab/editor.test.ts`'s
     sanitiser fixtures and the URL its Ctrl+K check is handed. The
     reserved documentation host, so it is the one entry here that
     names nothing real on purpose.

     It replaced `lh3.googleusercontent.com`, which used to sit
     here as the off-site photo the Studio's pre-flight warns
     about. That fixture is in `app/studio.test.ts` now, and this
     check walks `app/src` rather than `app/`, which is where a
     fetch this site is responsible for would be written. Why that
     host is in `img-src` is written where the policy is, in
     `aab/_headers` and `shared/headers.ts`. */
  "https://example.com": "links in the editor test's fixtures, and the URL Ctrl+K is given",
  /* The webfonts, and they are here rather than in connect-src
     because a stylesheet link and a font file are `style-src` and
     `font-src`, which the policy already allows both of. A
     `<link rel="preconnect">` opens a socket and fetches nothing;
     if a script ever fetches from either, this list is what stops
     it passing quietly. The same two were in this list once and
     left it when the Studio was archived, which is the entry above
     `NOT_FETCHED` saying they would come back the day something
     named them again. They did. */
  "https://fonts.googleapis.com": "the webfont stylesheet link and its preconnect",
  "https://fonts.gstatic.com": "the webfont files' preconnect",
  "https://www.tbsnews.net": "a source credited in an article",
  "https://www.bbc.co.uk": "a source credited in an article",
  "https://doi.org": "a citation in the dissertation case study",
  "https://archive.ics.uci.edu": "a dataset credited in a case study",
};

/* ---------- what the policy allows ---------- */

const headers = readFileSync(join(AAB, "_headers"), "utf8");
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

/** Every file the browser might run, gathered by `walk()` below.
    Absolute paths; `relative(ROOT, path)` is what a message says. */
const jsFiles: string[] = [];

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

const walk = (dir: string, skip = new Set<string>()): void => {
  for (const name of readdirSync(dir)) {
    // node_modules is not ours, and the generated schools hold no fetches.
    if (name === "node_modules" || name.startsWith(".")) continue;
    if (skip.has(name)) continue;
    const path = join(dir, name);
    if (statSync(path).isDirectory()) walk(path, skip);
    /* No `.mjs`, and there is none left to match: the browser
       tests under `aab/` were that extension and were therefore
       invisible here until 19 August 2026. Converting them is
       what brought `lh3.googleusercontent.com` into view, as a
       string in a Studio fixture. */
    else if (/\.(js|ts|tsx)$/.test(name)) jsFiles.push(path);
  }
};

walk(AAB, GENERATED);
walk(join(ROOT, "app", "src"));
walk(join(ROOT, "next", "lib"));

/* And the routes, which is where the site is built now.

   This walked `aab/` and `app/src` and stopped, which was every
   line of browser code when it was written. Proved before fixing:
   a `fetch()` to a host `connect-src` does not allow, added to a
   Next component, passed, and the same line in `aab/app.js`
   failed. The bug at the top of this file is one a route can make
   as easily as a module, and it is the same bug: invisible in
   review, invisible locally, and it blames somebody else.

   `next/lib` is walked too, and the sentence that used to be here
   said it should not be: it is the database reads, which run on
   the Worker. It is also where a string a component renders into
   the page is BUILT. `lib/crumbs.ts` writes the JSON-LD trail and
   names `https://schema.org` in it, and the check called that
   host unused while it sat one directory outside the walk, which
   is the check being wrong in the direction it exists to prevent.
   A component that fetches something does it in the browser, and
   a component that renders a `<script>` writes browser code as a
   string,
   which this reads as text like everything else. */
walk(join(ROOT, "next", "app"));
walk(join(ROOT, "next", "components"));

/* Not `functions/`, `shared/` or `next/lib`, on purpose. This
   check is about what a BROWSER is allowed to reach: a
   Content-Security-Policy governs the page, not the Worker that
   built it, and the Worker talks to Notion and to R2 without a
   browser being involved at all. Adding them would report every
   one of those as a violation of a policy that does not apply to
   them, and `shared/headers.ts` would report itself, because the
   policy is what it contains. */

const wanted = new Map();      // origin → the files that name it
for (const path of jsFiles) {
  const src = readFileSync(path, "utf8");
  for (const [, origin] of src.matchAll(/(https:\/\/[a-zA-Z0-9._-]+)/g)) {
    if (!wanted.has(origin)) wanted.set(origin, new Set());
    /* Named from the repository root, because half these files are
         no longer under `aab/` and "components/footer.tsx" alone
         does not say which of the three component folders it is. */
    wanted.get(origin).add(relative(ROOT, path).split(sep).join("/"));
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
