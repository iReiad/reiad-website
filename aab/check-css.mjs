#!/usr/bin/env node
/* ============================================================
   check-css.mjs, catch a school's styles leaking into the
   whole site.

       node aab/check-css.mjs

   THE BUG THIS EXISTS FOR

   styles.css is one file in cascade order:

       tokens … components … learn, deutsch, check, about …

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

   ONLY THE SCHOOLS ARE CHECKED, and deliberately so. `learn`
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

import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));

/** A school: its cascade layer, and the files it owns. */
const SCHOOLS = [
  { layer: "deutsch", owns: ["deutsch/"] },
  { layer: "quran", owns: ["quran/"] },
  { layer: "english", owns: ["english/"] },
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
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (!["og", "node_modules"].includes(entry)) walk(full);
    } else if (/\.(html|js|mjs)$/.test(entry)) {
      files.push(relative(ROOT, full));
    }
  }
})(ROOT);

const markup = new Map(
  files.filter((f) => f !== "check-css.mjs").map((f) => [f, readFileSync(join(ROOT, f), "utf8")])
);

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

console.log(
  failures
    ? `\n${failures} rule(s) leak out of their school: fix before deploying.`
    : `${SCHOOLS.length} school layer(s) checked, nothing leaks into the rest of the site.`
);
process.exit(failures ? 1 : 0);
