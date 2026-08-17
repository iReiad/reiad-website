#!/usr/bin/env node
/* ============================================================
   check-css.mjs, catch a school's styles leaking into the
   whole site.

       node aab/check-css.mjs

   THE BUG THIS EXISTS FOR

   styles.css is one file in cascade order:

       tokens … components … money, deutsch, check, about …

   A school's layer therefore beats `components` everywhere, not
   only on that school's pages. So a class name the school
   invents, but that the site already uses for something else,
   silently restyles the whole site.

   Not hypothetical. The German school called one day of its
   practice book `.tag`– Tag, German for day, and `.tag` is what
   this site has always called the small label above an article
   card. One rule:

       .tag { border: 1px solid …; padding: 30px; border-radius: 16px }

   put an empty bordered box around the label on every card on the
   site: the home page bento, the Insights list, About, Services,
   Credentials. It shipped, because check-routes looks at links,
   check-sw looks at caches, and nothing looked at CSS.

   WHAT IT CHECKS

   Every selector at the top level of a school's layer, the ones
   that match anywhere, as opposed to nested `& .thing` rules,
   which cannot escape their parent, must be anchored by at
   least one class that belongs to that school. "Belongs" means
   it appears in that school's markup and nowhere else.

       .merke.warn                 ok, .merke is German-only
       .deutsch-hero .lede         ok, .deutsch-hero is German-only
       .buch-tag textarea          ok, .buch-tag is German-only
       .tag                        FLAGGED, .tag is the whole
                                   site's, so this rule is not
                                   about German at all

   ONLY THE SCHOOLS ARE CHECKED, and deliberately so. `money`
   holds the site's .hero, .band, .note and .section-label, which
   really are sitewide and really do live there; `check` and
   `work` share their furniture with the case studies on purpose.
   Flagging those would be flagging the design. A school mounted
   at its own path has no such excuse: nothing under /deutsch/
   should be styling the home page.

   Deliberately dumb, a regex over the stylesheet and a scan of
   the markup, no CSS parser and no browser. It has to finish in
   a second, next to the other checks, or it will not get run.
   ============================================================ */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

/** A school: its cascade layer, and the files it owns. */
const SCHOOLS = [
  { layer: "deutsch", owns: ["deutsch/"] },
  { layer: "quran", owns: ["quran/"] },
  { layer: "english", owns: ["english/"] },
  /* One layer and two folders. It owned `reads.js` too until
     Stage 11.1, which is when both index pages became Next.js
     routes and that module stopped having anything to draw. Most
     of what this layer styles is rendered by `next/components/`
     now, which this check cannot see; what it still catches is the
     reads layer leaking into the rest of the site. */
  { layer: "reads", owns: ["cooking/", "travel/", "../next/"] },
];

const css = readFileSync(join(ROOT, "styles.css"), "utf8");

/** The body of `@layer <name> { … }`, brace-matched. */
function layerBody(name) {
  const open = css.indexOf(`@layer ${name} {`);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < css.length; i++) {
    if (css[i] === "{") depth++;
    else if (css[i] === "}" && --depth === 0) {
      return css.slice(css.indexOf("{", open) + 1, i);
    }
  }
  return null;
}

/** Selectors at the top level of a layer body, including inside a
    top-level @media, those match just as widely. Nested rules are
    skipped: `& .foo` inside `.bar { … }` can only match in .bar. */
function topLevelSelectors(body) {
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
  const out = [];
  let depth = 0, buf = "", mediaAt = -1;
  for (const ch of clean) {
    if (ch === "{") {
      const sel = buf.trim();
      if (sel.startsWith("@")) {
        if (depth === 0) mediaAt = 0;           // a top-level @media
      } else if (depth === 0 || depth === mediaAt + 1) {
        out.push(sel.replace(/\s+/g, " "));
      }
      depth++; buf = "";
    } else if (ch === "}") {
      depth--; if (depth === 0) mediaAt = -1; buf = "";
    } else if (depth === 0 || depth === mediaAt + 1) {
      buf += ch;
    }
  }
  return out;
}

/* every file that can carry a class name */
const files = [];
function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!["og", "node_modules"].includes(entry)) walk(full);
    } else if (/\.(html|js|mjs|tsx|ts)$/.test(entry)) {
      files.push(relative(ROOT, full));
    }
  }
}
walk(ROOT);

/* And the Next.js app, which is not in `aab/` and renders into
   these same layers. Since Stage 11.1 the markup carrying
   `.read-card` and `.read-hero` is a component rather than a
   page, and a check that could not see it reported every rule in
   the reads layer as styling nothing at all: which is a leak, as
   far as this file can tell, and is not. */
for (const outside of ["../next/app", "../next/components", "../next/lib"]) {
  if (existsSync(join(ROOT, outside))) walk(join(ROOT, outside));
}

const markup = new Map(
  files.filter((f) => f !== "check-css.mjs").map((f) => [f, readFileSync(join(ROOT, f), "utf8")])
);

/* And the schools' prose, which is not a file any more.

   archive/TRANSITION.md Stage 11.7. Until 247 committed pages left `aab/`,
   every class a lesson's body carries was in this repository as
   HTML and this file found it by walking. The bodies are rows in
   D1 now, rendered by a route, and the only copy of them that a
   check running on a laptop with no network can read is
   `content/schools.backup.json`, which is the same answer
   `content/articles.backup.json` already is to the same question.

   Without this, 32 rules in the four school layers reported
   themselves as styling nothing at all: `.shobdo-list`,
   `.word-grid` and thirty others, every one of them on a page a
   reader can see. A check that cannot see the markup does not
   report less, it reports wrongly. */
{
  /* `usedIn()` walks `files` and looks the name up in `markup`, so
     a source has to be in both. */
  const add = (name, html) => { files.push(name); markup.set(name, html); };

  const snapshot = join(ROOT, "..", "content", "schools.backup.json");
  if (existsSync(snapshot)) {
    const rows = JSON.parse(readFileSync(snapshot, "utf8"));
    /* One entry PER SCHOOL rather than one for the file, because
       ownership here is decided by the path a class was found
       under: a class in one file holding all four schools' prose
       would belong to none of them, and every rule in every
       school layer would flag. The names are not real paths and
       do not need to be; they start with the school's own folder,
       which is what `owns` matches on, and they read as an
       explanation when the check prints where a class is used. */
    for (const school of ["money", "deutsch", "quran", "english"]) {
      const prose = (rows.lessons ?? [])
        .filter((l) => l.school === school)
        .map((l) => l.body ?? "")
        .join("\n");
      if (prose) add(`${school}/ (lesson prose, in D1)`, prose);
    }
  }

  /* And the four hand-written pages, which are one generated
     module now rather than five committed pages. Split the same
     way and for the same reason. */
  const hubs = join(ROOT, "..", "next", "lib", "school-hubs.ts");
  if (existsSync(hubs)) {
    const text = readFileSync(hubs, "utf8");
    for (const [, key, body] of text.matchAll(/^  "([^"]+)": \{[\s\S]*?\n    body: ("(?:[^"\\]|\\.)*"),/gm)) {
      const school = key.split("/")[0];
      let html = "";
      try { html = JSON.parse(body); } catch { html = body; }
      add(`${school}/ (${key}, in next/lib/school-hubs.ts)`, html);
    }
  }
}

/** Files using a class in a class attribute, not in prose or a
    selector string, which say nothing about what is on the page. */
function usedIn(cls) {
  const re = new RegExp(`class(?:Name)?\\s*[=:]\\s*["'\`][^"'\`]*(?<![\\w-])${cls}(?![\\w-])`);
  return files.filter((f) => markup.has(f) && re.test(markup.get(f)));
}

let failures = 0;

for (const { layer, owns } of SCHOOLS) {
  const body = layerBody(layer);
  if (body === null) {
    console.error(`no @layer ${layer} in styles.css, update SCHOOLS in this file`);
    failures++;
    continue;
  }

  const mine = new Map(); // class → is it this school's alone?
  const isMine = (cls) => {
    if (!mine.has(cls)) {
      const users = usedIn(cls);
      mine.set(cls, users.length > 0 && users.every((f) => owns.some((p) => f.startsWith(p))));
    }
    return mine.get(cls);
  };

  for (const sel of topLevelSelectors(body)) {
    /* A selector is safe when something in it can only mean this
       school: the body class the school's pages carry, or a class
       used nowhere else. Anything else matches the rest of the
       site, including a selector with no class at all, which is
       how a bare `header { position: sticky }` came to pin the
       practice book's day header over the site's own. */
    if (sel.includes(`body.${layer}`)) continue;
    const classes = [...sel.matchAll(/\.([a-zA-Z][\w-]*)/g)].map((m) => m[1]);
    if (classes.some(isMine)) continue;

    const strangers = classes
      .flatMap(usedIn)
      .filter((f) => !owns.some((p) => f.startsWith(p)));
    failures++;
    console.error(`\n@layer ${layer}:  ${sel}`);
    console.error(
      `        No class in this selector belongs to ${owns.join(", ")}, so the rule\n` +
      `        matches outside the school. It is styling:`
    );
    [...new Set(strangers)].slice(0, 6).forEach((f) => console.error(`          ${f}`));
    console.error(`        Rename it to something only ${layer} could mean, or anchor it.`);
  }
}

/* ============================================================
   THE ARTICLE VOCABULARY

   The Studio can put a small set of blocks into any piece: a box
   of quick answers, a note in the margin, numbered steps, a
   checklist, a row of figures, and the four ways of sizing a
   photo. They are plain HTML with a class on it, and that class
   has to survive two sanitisers and mean one thing everywhere.

   Three ways that goes wrong, all of them quietly:

     1. The two allowlists drift. The browser's is the stricter
        one, so the server ends up supporting a block that nothing
        can produce, and every callout imported from Notion
        arrives flattened.
     2. A class is allowed through but styled nowhere, so the
        block ships as a bare list.
     3. A class is already taken. `.glance` was written for this
        and collided with the About page's own `.glance`, which is
        a grid: the box of quick answers came out as two columns
        with the label in one of them, in the editor and on the
        page. Later layers win everywhere, not only on their own
        pages, which is the same bug this whole file exists for.
   ============================================================ */

const classList = (file, name) => {
  const src = readFileSync(join(ROOT, file), "utf8");
  const block = src.match(new RegExp(`${name}\\s*=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`));
  if (!block) {
    console.error(`no ${name} in ${file}: this check cannot see the vocabulary any more`);
    failures++;
    return [];
  }
  return [...block[1].matchAll(/"([a-z][\w-]*)"/g)].map((m) => m[1]);
};

/* The browser's allowlist moved out of studio.js and into
   editor.js when the React Studio needed the same sanitiser. It is
   read by name, so this check follows it rather than the file. */
const studioClasses = classList("editor.js", "KEEP_CLASSES");
const serverClasses = classList("../functions/_lib/sanitise.js", "ALLOWED_CLASSES");

if (studioClasses.length && serverClasses.length) {
  const only = (a, b) => a.filter((c) => !b.includes(c));
  for (const [side, missing] of [
    ["the server strips what the Studio keeps", only(studioClasses, serverClasses)],
    ["the Studio strips what the server keeps", only(serverClasses, studioClasses)],
  ]) {
    if (!missing.length) continue;
    failures++;
    console.error(`\nthe two sanitisers disagree, ${side}: ${missing.join(", ")}`);
    console.error("        KEEP_CLASSES in aab/editor.js and ALLOWED_CLASSES in");
    console.error("        functions/_lib/sanitise.js are one list written twice.");
  }
}

/** Every layer that gives a class a rule of its own: `.cls { … }`
    on its own, which is the shape that says "this is what this
    class is", as opposed to `.cls .child` or `.other.cls`. */
function definedIn(cls) {
  const layers = [];
  for (const name of [...css.matchAll(/@layer ([a-z]+) \{/g)].map((m) => m[1])) {
    const body = layerBody(name);
    if (!body) continue;
    const bare = topLevelSelectors(body)
      .flatMap((sel) => sel.split(",").map((s) => s.trim()))
      .some((sel) => sel === `.${cls}`);
    if (bare && !layers.includes(name)) layers.push(name);
  }
  return layers;
}

for (const cls of new Set([...studioClasses, ...serverClasses])) {
  const layers = definedIn(cls);
  if (!layers.length) {
    // Some are modifiers on a selector that names the tag as well,
    // like figure.wide, so a bare rule is not required, only some
    // rule.
    if (new RegExp(`\\.${cls}[\\s,{:.)]`).test(css)) continue;
    failures++;
    console.error(`\n.${cls} is allowed into an article and styled nowhere in styles.css.`);
    continue;
  }
  if (layers.length > 1) {
    failures++;
    console.error(`\n.${cls} is defined in two layers: ${layers.join(" and ")}.`);
    console.error(
      "        Whichever comes last in the layer statement wins, everywhere,\n"
      + "        including inside an article that only meant the other one.\n"
      + "        Rename one of them."
    );
  }
}

console.log(
  failures
    ? `\n${failures} problem(s) in the stylesheet: fix before deploying.`
    : `${SCHOOLS.length} school layer(s) checked, nothing leaks into the rest of the site.\n`
      + `${new Set(studioClasses).size} article block classes, agreed by both sanitisers `
      + `and defined once each.`
);
process.exit(failures ? 1 : 0);
