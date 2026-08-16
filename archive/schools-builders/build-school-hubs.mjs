#!/usr/bin/env node
/* ============================================================
   build-school-hubs.mjs: the four schools' hand-written
   pages, where `next/` can reach them.

       node scripts/build-school-hubs.mjs           # write it
       node scripts/build-school-hubs.mjs --check   # or compare

   TRANSITION.md Stage 11.7 step 3. A school's hub is not a
   generated page and never was: all four are prose, written by
   hand, explaining what the course asks of a learner every
   evening. The one live thing on them is the ladder, and
   `hub.js` builds that in the browser out of `curriculum.js` and
   the reader's own progress; the list in the markup is its
   no-JavaScript fallback.

   ---- why the prose is copied rather than rewritten as JSX ----

   Because a port is finished when it does what the thing it
   replaced did, and eight hundred lines of Bangla hand-converted
   into JSX is eight hundred chances to change a word without
   noticing. Nobody reviewing the diff would catch it, and the
   reader who would is the one this site is written for.

   So the body of each hub is lifted out of the committed page
   exactly as it stands, and `check-next.mjs` lifts it again and
   fails if the two have parted. The route renders it inside the
   same shell every other page uses, so the head, the header and
   the footer are React's and shared, and only the writing is a
   string.

   ---- and what happens to this file ----

   It dies with the pages it reads. When step 3 archives them,
   `next/lib/school-hubs.ts` stops being a copy and becomes the
   original, this generator has nothing left to read, and both it
   and its half of `check-next.mjs` go. Until then it is the thing
   that stops the copy drifting, which is the failure this
   repository has written up more times than any other.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "next", "lib", "school-hubs.ts");

/* The five hand-written pages of the four schools, by the key
   the route looks them up under.

   `/learn/index.html` is the one with the most in it: it holds
   the starter guide, whose eight steps carry a two-column split,
   a risk badge and a call to action under classes no article
   allowlist holds. That is exactly why it is copied rather than
   rewritten, and why `start` is the one stage this site cannot
   edit in the Studio. `CLAUDE.md` says so at length.

   `/learn/contents.html` is not a hub at all, it is the money
   school's full index, and it is here for the same reason: it is
   a hand-written page of the schools that has to become a route
   before the schools can stop being files. */
/* `scripts` is what THIS page loads and the shell does not.
   `/learn/learn.js` is on all ninety-one of the money school's
   pages, so it belongs to that school's shell (`shellScript` in
   `lib/school.ts`) and is deliberately absent from both entries
   below: listing it here as well would put it on the page twice.
   `/app.js` is absent for the same reason, one level up. */
const PAGES = {
  learn: { file: "learn/index.html", scripts: ["/learn/hub.js"] },
  deutsch: { file: "deutsch/index.html", scripts: ["/deutsch/hub.js"] },
  quran: { file: "quran/index.html", scripts: ["/quran/hub.js"] },
  english: { file: "english/index.html", scripts: ["/english/hub.js"] },
  "learn/contents": {
    file: "learn/contents.html",
    scripts: ["/learn/contents.js"],
  },
};
const SCHOOLS = Object.keys(PAGES);

/** What is inside `<div class="wrap">` inside `<main>`.

    The shell around it, the head, the header, the footer and the
    scripts, is React's and is shared with every other page. Taking
    the wrap with it would put two of them on the page. */
function bodyOf(key) {
  const html = readFileSync(join(ROOT, "aab", PAGES[key].file), "utf8");
  const main = html.match(/<main id="main">\s*<div class="wrap">([\s\S]*)<\/div>\s*<\/main>/);
  if (!main) throw new Error(`no <main><div class="wrap"> in aab/${PAGES[key].file}`);
  return main[1].replace(/^\n+|\s+$/g, "");
}

/** The <head> facts the page states about itself, which the route
    has to state identically or a share card quietly changes. */
function headOf(key) {
  const html = readFileSync(join(ROOT, "aab", PAGES[key].file), "utf8");
  const one = (re) => html.match(re)?.[1] ?? "";
  return {
    title: one(/<title>([\s\S]*?)<\/title>/),
    description: one(/<meta name="description" content="([^"]*)"/),
    canonical: one(/<link rel="canonical" href="([^"]*)"/),
    ogImage: one(/<meta property="og:image" content="([^"]*)"/),
    ogType: one(/<meta property="og:type" content="([^"]*)"/),
  };
}

export function generate() {
  const blocks = SCHOOLS.map((key) => {
    const head = headOf(key);
    return `  ${JSON.stringify(key)}: {\n`
      + `    head: ${JSON.stringify(head, null, 6).replace(/\n/g, "\n    ")},\n`
      + `    scripts: ${JSON.stringify(PAGES[key].scripts)},\n`
      + `    body: ${JSON.stringify(bodyOf(key))},\n`
      + `  },`;
  });

  return `/* ============================================================
   school-hubs.ts: GENERATED. Do not edit.

       node scripts/build-school-hubs.mjs

   The four schools' hand-written pages, lifted out of the
   committed \`aab/**\` exactly as they stand.
   \`scripts/build-school-hubs.mjs\` says at length why the prose is
   copied rather than rewritten, and \`scripts/check-next.mjs\`
   fails if what is committed here has parted from what is there.

   The ladder inside each body is the no-JavaScript fallback.
   \`/deutsch/hub.js\` and its three siblings replace it in the
   browser with one built from the reader's own progress, exactly
   as they do on the pages these were taken from.
   ============================================================ */

export interface SchoolHub {
  head: {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
    ogType: string;
  };
  /** The school's own scripts, in the order the page loads them.
      \`/app.js\` is not among them: every page of this site loads
      that one and the shell renders it. */
  scripts: string[];
  /** The inside of \`<main><div class="wrap">\`, as written. */
  body: string;
}

export const SCHOOL_HUBS: Record<string, SchoolHub> = {
${blocks.join("\n")}
};
`;
}

const RUN = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (RUN) {
  const wanted = generate();
  if (process.argv.includes("--check")) {
    const have = (() => {
      try { return readFileSync(OUT, "utf8"); } catch { return ""; }
    })();
    if (have !== wanted) {
      console.error("next/lib/school-hubs.ts is not what the committed pages say.\n"
        + "Regenerate it:\n  node scripts/build-school-hubs.mjs\n");
      process.exit(1);
    }
    console.log("next/lib/school-hubs.ts matches the committed hubs.");
  } else {
    writeFileSync(OUT, wanted);
    console.log(`wrote ${OUT.slice(ROOT.length + 1)}`);
  }
}
