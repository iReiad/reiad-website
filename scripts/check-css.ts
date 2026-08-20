#!/usr/bin/env node
/* ============================================================
   check-css.ts, catch a school's styles leaking into the
   whole site.

       node scripts/check-css.ts

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

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/* `AAB` is the served directory and `ROOT` is the repository.
   They were the same until this file moved out: every file in
   `aab/` is uploaded and answers at a public URL, so a check
   living there is a check published, kept private only by a line
   in `.assetsignore`. A check outside the served directory cannot
   be served. */
const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(REPO, "aab");

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

const css = readFileSync(join(REPO, "next", "styles", "site.css"), "utf8");

/* ============================================================
   Before anything else: do the braces balance.

   A stylesheet with one brace too many is not a stylesheet with
   one small error in it. A browser recovers by discarding until
   it finds its footing again, so a stray `}` two thousand lines
   up silently drops a layer's worth of rules, and every check
   below this one goes on passing because they all read the file
   as text.

   This is here because it happened, deleting a dead block whose
   last line also opened the next rule. The check is four lines
   and it is the difference between a failed build and a page
   that renders with a third of its design missing.
   ============================================================ */
{
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let depth = 0, line = 1, worst = 0;
  for (const ch of clean) {
    if (ch === "\n") line++;
    else if (ch === "{") depth++;
    else if (ch === "}" && --depth < 0 && !worst) worst = line;
  }
  if (depth !== 0 || worst) {
    console.error(
      worst
        ? `styles.css closes a block that was never opened, at or before line ${worst}.`
        : `styles.css leaves ${depth} block(s) open at the end of the file.`);
    console.error("        Everything after that point is parsed as something else.");
    process.exit(1);
  }
}

/** The body of `@layer <name> { … }`, brace-matched. */
function layerBody(name: string): string | null {
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
function topLevelSelectors(body: string): string[] {
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
const files: string[] = [];
function walk(dir: string): void {
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

/* And the Studio and the desk, which are a Vite workspace whose
   OUTPUT is committed into `aab/` and therefore already walked.
   The sources are here for the dead-rule count at the foot of
   this file: `.pill-warn` is written in `app/src/Published.tsx`
   and appears in the built bundle as a minified class string,
   which is enough for a substring test and not enough to trust. */
if (existsSync(join(ROOT, "../app/src"))) walk(join(ROOT, "../app/src"));

const markup = new Map(
  files.filter((f) => f !== "check-css.ts").map((f) => [f, readFileSync(join(ROOT, f), "utf8")])
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
  const add = (name: string, html: string): void => {
    files.push(name); markup.set(name, html);
  };

  const snapshot = join(ROOT, "..", "content", "schools.backup.json");
  if (existsSync(snapshot)) {
    const rows = JSON.parse(readFileSync(snapshot, "utf8")) as
      { lessons?: Array<{ school?: string; body?: string }> };
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

  /* The three hand-written hubs used to be an HTML string each in
     `school-hubs.ts`, and this read them because no other file
     could see the classes inside. They are `components/
     school-hub-page.tsx` now, which `walk()` above already reads,
     and the prose left in `school-hub-content.ts` carries inline
     markup and no class at all. So there is nothing here to read
     any more, and a reader for a field that no longer exists is
     worse than none: it would report every hub class as unused. */
}

/** Files using a class in a class attribute, not in prose or a
    selector string, which say nothing about what is on the page. */
function usedIn(cls: string): string[] {
  const re = new RegExp(`class(?:Name)?\\s*[=:]\\s*["'\`][^"'\`]*(?<![\\w-])${cls}(?![\\w-])`);
  return files.filter((f) => {
    const html = markup.get(f);
    return html !== undefined && re.test(html);
  });
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
  const isMine = (cls: string): boolean => {
    if (!mine.has(cls)) {
      /* A class NAMED for the school is the school's, whoever
         writes it. That used to be the same question as "which
         folder is it in", because each hub was an HTML string
         under its own key. `components/school-hub-page.tsx`
         renders all three now, so `deutsch-hero` appears in a
         file that also says `english-hero`, and the folder test
         reported the German hero rule as styling the English
         book. The name is the ownership; the folder was only ever
         a proxy for it. */
      if (cls.startsWith(`${layer}-`)) { mine.set(cls, true); return true; }
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

const classList = (file: string, name: string): string[] => {
  const src = readFileSync(join(ROOT, file), "utf8");
  /* `: Set<string>` may sit between the name and the `=` now that
     these files are TypeScript. Optional, so this reads both. */
  const block = src.match(
    new RegExp(`${name}\\s*(?::[^=]+)?=\\s*new Set\\(\\[([\\s\\S]*?)\\]\\)`));
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
const serverClasses = classList("../functions/_lib/sanitise.ts", "ALLOWED_CLASSES");

if (studioClasses.length && serverClasses.length) {
  const only = (a: string[], b: string[]): string[] =>
    a.filter((c) => !b.includes(c));
  /* Tuples rather than a bare array literal, so that destructuring
     gives a sentence and a list rather than one union of the two. */
  const disagreements: Array<[string, string[]]> = [
    ["the server strips what the Studio keeps", only(studioClasses, serverClasses)],
    ["the Studio strips what the server keeps", only(serverClasses, studioClasses)],
  ];
  for (const [side, missing] of disagreements) {
    if (!missing.length) continue;
    failures++;
    console.error(`\nthe two sanitisers disagree, ${side}: ${missing.join(", ")}`);
    console.error("        KEEP_CLASSES in aab/editor.js and ALLOWED_CLASSES in");
    console.error("        functions/_lib/sanitise.ts are one list written twice.");
  }
}

/* ============================================================
   The same two sanitisers, and the other half of their vocabulary

   The check above compares the CLASSES they allow. They also each
   carry a table of the ATTRIBUTES an element may keep, and nothing
   compared those, so they had drifted:

     aab/editor.js              IMG: src, alt, width, height
     functions/_lib/sanitise.ts img: src, alt, width, height,
                                     loading, decoding

   `hostPhotosIn` in `aab/src/photo.ts` sets `loading="lazy"` and
   `decoding="async"` on every photo it hosts. The browser's own
   sanitiser stripped both on the way out, so neither had ever
   reached the database and every photo in every article loaded
   eagerly while the markup said it should not. Two dead lines in
   one file and a server allowlist supporting something nothing
   could produce, which is the class version of this bug written
   out one paragraph up.

   A class check cannot see it. `class` is not in either table in
   the same sense: it is governed by the lists above.
   ============================================================ */

/** One table of tag to attributes, by variable name, lowercased so
    the browser's `IMG` and the server's `img` are one key. */
const attrTable = (file: string, name: string): Map<string, string[]> => {
  const src = readFileSync(join(ROOT, file), "utf8");
  const block = src.match(
    new RegExp(`${name}\\s*(?::[^=]+)?=\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!block) {
    console.error(`no ${name} in ${file}: this check cannot see the vocabulary any more`);
    failures++;
    return new Map();
  }
  const out = new Map<string, string[]>();
  for (const m of block[1].matchAll(/(\w+)\s*:\s*\[([^\]]*)\]/g)) {
    out.set(m[1].toLowerCase(), [...m[2].matchAll(/"([\w-]+)"/g)].map((a) => a[1]));
  }
  return out;
};

/* The two asymmetries that are deliberate, each with the reason.
   Anything not here is drift. Keyed by tag and attribute, for the
   same reason `GONE` in check-pointers.ts is keyed by two things:
   "the server allows class" is a true sentence and a NEW
   disagreement about class somewhere else is not. */
const AGREED: Record<string, string> = {
  "a/class": "governed by the class lists above, not by these tables",
  "figure/class": "the same",
  "div/class": "the same",
  "a/rel": "the browser does not ALLOW rel, it WRITES it: editor.js sets"
    + " rel=noopener on every external link after sanitising",
};

const browserAttrs = attrTable("editor.js", "ATTRS");
const serverAttrs = attrTable("../functions/_lib/sanitise.ts", "ALLOWED");

if (browserAttrs.size && serverAttrs.size) {
  for (const [tag, kept] of browserAttrs) {
    const theirs = serverAttrs.get(tag);
    if (!theirs) {
      failures++;
      console.error(`\nthe server has no rule for <${tag}> and the browser keeps`
        + ` ${kept.join(", ")} on it.`);
      continue;
    }
    const gap = (a: string[], b: string[]): string[] =>
      a.filter((x) => !b.includes(x) && !(`${tag}/${x}` in AGREED));
    const strips = gap(theirs, kept);
    const keeps = gap(kept, theirs);
    if (strips.length) {
      failures++;
      console.error(`\nthe two sanitisers disagree about <${tag}>: the server keeps`
        + ` ${strips.join(", ")} and the browser strips ${strips.length > 1 ? "them" : "it"}.`);
      console.error("        The browser's is the stricter one, so the server ends up");
      console.error("        allowing something nothing can produce. ATTRS in");
      console.error("        aab/editor.js, ALLOWED in functions/_lib/sanitise.ts.");
    }
    if (keeps.length) {
      failures++;
      console.error(`\nthe two sanitisers disagree about <${tag}>: the browser keeps`
        + ` ${keeps.join(", ")} and the server strips ${keeps.length > 1 ? "them" : "it"}.`);
      console.error("        A writer sees it work and it is gone once published.");
    }
  }
  /* A reason that has stopped describing a real difference reads as
     a live constraint to the next person. */
  for (const key of Object.keys(AGREED)) {
    const [tag, attr] = key.split("/");
    const mine = browserAttrs.get(tag);
    const theirs = serverAttrs.get(tag);
    if (!mine || !theirs) continue;
    if (mine.includes(attr) === theirs.includes(attr)) {
      failures++;
      console.error(`\n<${tag}> ${attr} is in AGREED in this file and the two`
        + " sanitisers now say the same thing about it. Remove the entry.");
    }
  }
}

/** The selectors a layer states unconditionally: depth zero, and
    NOT inside an `@media`, `@supports` or `@container`.

    `topLevelSelectors()` above deliberately reaches inside a
    top-level at-rule, because a school can leak from inside a
    media query just as easily as outside one. This asks a
    different question, "what does this layer say this class IS",
    and there a conditional rule is not an answer:

        @media (prefers-reduced-motion: reduce) {
          .ring-fill { transition: none }
        }

    is an adjustment to somebody else's ring, and counting it as a
    definition made three layers look like they each owned one. */
function bareSelectors(body: string): string[] {
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, "");
  const out: string[] = [];
  let depth = 0, buf = "";
  for (const ch of clean) {
    if (ch === "{") {
      if (depth === 0 && !buf.trim().startsWith("@")) out.push(buf.trim().replace(/\s+/g, " "));
      depth++; buf = "";
    } else if (ch === "}") {
      depth--; buf = "";
    } else if (depth === 0) {
      buf += ch;
    }
  }
  return out;
}

/** Every layer that gives a class a rule of its own: `.cls { … }`
    on its own, which is the shape that says "this is what this
    class is", as opposed to `.cls .child` or `.other.cls`. */
function definedIn(cls: string): string[] {
  const layers: string[] = [];
  for (const name of [...css.matchAll(/@layer ([a-z]+) \{/g)].map((m) => m[1])) {
    const body = layerBody(name);
    if (!body) continue;
    const bare = bareSelectors(body)
      .flatMap((sel) => sel.split(",").map((s) => s.trim()))
      .some((sel) => sel === `.${cls}`);
    if (bare && !layers.includes(name)) layers.push(name);
  }
  return layers;
}

const MATERIAL = new Map([
  ["glow", "the light inside the glass, which every surface carries"],
]);

/* `position` was on this list for one draft and it is the reason
   the list is worth having. The material set `position: relative`
   for a pseudo-element it stopped using, and a later layer saying
   `relative` overrides `fixed` on `.rail` and on `.topbar`: the
   rail and the bar dropped out of their fixed positions into the
   flow and pushed every page 1300 pixels down. Both still
   rendered, both still had their colours, and every check passed.

   Position is geometry. So is isolation, so is z-index, so is
   display. None of them is the light. */
const MATERIAL_PROPS = new Set([
  "background-image", "background-size", "transition",
  /* The three a surface is DESCRIBED by, and the four derived
     from them. Nothing else: a material layer says what a thing
     is made of, and every consequence of that is a light. */
  "--depth", "--polish", "--clarity",
  "--glow-w", "--glow-i", "--glow-stop", "--glow-a", "--gx", "--gy",
  "--surface-image", "--surface-size",
]);

for (const cls of new Set([...studioClasses, ...serverClasses])) {
  /* Material layers are filtered here for the same reason they
     are in the wider loop below, and the reason is the same one
     word for word: a material layer may set the light and nothing
     else, and this file proves that rather than trusting it. An
     article block carrying the site's own weave and a still light
     is the design system reaching the prose, which is what "one
     system all around" has to mean if it means anything. */
  const layers = definedIn(cls).filter((l) => !MATERIAL.has(l));
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

/* ============================================================
   The same question, asked about every class rather than only
   the twenty-one an article may carry.

   The loop above has caught a class that means two things since
   the Studio was written, but only for article blocks, because
   those were the ones a writer could put on a page by accident.
   That was too narrow. Twelve classes were defined in two layers
   at once in August 2026 and none of them was an article block:

     .ladder      the money school's stack of stages, and the
                  stock check's row of interest rates. `check`
                  comes after `money`, so every school's ladder
                  had been drawing with the stock check's gap for
                  as long as both existed.
     .ring        34px and green here, 44px and var(--accent)
                  there. The schools drew deck's, and the copy
                  that lost sat in the file looking authoritative.
     .contents-*  three names live in both `money` and `deck` on
                  the same page.

   Nobody typed a wrong rule. Each was right in its own layer, and
   a layer is exactly the thing that makes "in its own layer"
   false. So the rule is now the simple one: a bare `.cls { … }`
   belongs to one layer, whatever the class is.

   ALLOWED holds the pairs that are deliberate, and every entry
   needs a reason next to it. It is not a suppression list for
   whatever happens to be failing today: a genuine collision gets
   renamed, and this is only for a name two layers really do
   share on purpose.
   ============================================================ */

const ALLOWED = new Map([
  /* deck adds a margin and a width to the money school's resume
     card rather than restating it. Different properties, and the
     card is one card. */
  [".resume", "money+deck, deck adjusts the card money defines"],
]);

/* ============================================================
   A MATERIAL LAYER, which is the one exception that generalises

   `@layer glow` names a hundred classes that other layers define,
   and it has to: the light inside the glass is a property of what
   a thing IS rather than of what it looks like, so it cuts across
   every layer the way a theme does. Under the rule above that is
   a hundred failures, and the retreat when it first fired was to
   scope the material to an attribute, which left 203 surface-like
   classes with one of them on the design system.

   The rule the check was protecting is still right: a later layer
   silently redefining a class is how `.ladder` drew with the
   stock check's gap on every school page. What makes a material
   layer different is that it CANNOT do that, and the difference
   is checkable rather than a promise:

     a material layer may set the light and nothing else.

   Not a colour, not a size, not a font, not a radius, not a
   border, not a position in a grid. If `@layer glow` ever sets
   one of those, this fails and the exception is withdrawn for the
   whole layer rather than for the one rule that broke it.

   `transition` is on the list and is the uncomfortable one, for a
   real reason written at the rule itself: a transition list is
   not merged across layers, so a material layer that animates one
   property has to restate the ones underneath it or it takes them
   away. `.card[data-kind="go"]` in `@layer deck` carries the same
   note, having been bitten once.
   ============================================================ */


for (const [name, why] of MATERIAL) {
  const body = layerBody(name);
  if (!body) {
    failures++;
    console.error(`\n@layer ${name} is listed as a material layer and is not there.`);
    console.error("        Remove it from MATERIAL in this file: an exception to a rule");
    console.error("        that guards nothing is the stale entry the list exists to avoid.");
    continue;
  }
  /* Every property this layer sets, at any depth. A material
     layer is small enough that reading it whole is right: the
     claim is about the LAYER, not about one rule in it. */
  const bare = body.replace(/\/\*[\s\S]*?\*\//g, "");
  const props = new Set(
    [...bare.matchAll(/(^|[;{])\s*(-{2}[a-z0-9-]+|[a-z-]+)\s*:/gm)]
      .map((m) => m[2]),
  );
  const stray = [...props].filter((prop) => !MATERIAL_PROPS.has(prop));
  if (!stray.length) continue;
  failures++;
  console.error(`\n@layer ${name} sets ${stray.length} thing(s) that are not the material:`);
  console.error(`        ${stray.join(", ")}`);
  console.error(`        It is allowed to name classes other layers define because it is`);
  console.error(`        ${why}, and that only holds while it sets the light and nothing`);
  console.error("        else. Move these into the layer that owns the class.");
}

/** Every class the stylesheet gives a rule of its own, with no
    leading dot. Two sections read it: the one below, which fails
    on a class two layers both define, and the dead-class ledger at
    the end. */
const everyClass = new Set<string>();
for (const name of [...css.matchAll(/@layer ([a-z]+) \{/g)].map((m) => m[1])) {
  const body = layerBody(name);
  if (!body) continue;
  for (const sel of topLevelSelectors(body)) {
    for (const part of sel.split(",").map((s) => s.trim())) {
      const m = part.match(/^\.(-?[A-Za-z_][\w-]*)$/);
      if (m) everyClass.add(m[1]);
    }
  }
}

let shared = 0;
for (const cls of [...everyClass].sort()) {
  if (ALLOWED.has(`.${cls}`)) continue;
  /* A material layer is not a second definition, and the block
     above is what makes that true rather than assumed. */
  const layers = definedIn(cls).filter((l) => !MATERIAL.has(l));
  if (layers.length < 2) continue;
  failures++;
  shared++;
  console.error(`\n.${cls} is defined in ${layers.length} layers: ${layers.join(", ")}.`);
  console.error(
    `        ${layers[layers.length - 1]} comes last, so its rule wins on every\n`
    + "        page, including the ones that meant the other. Rename one, or\n"
    + "        add it to ALLOWED in this file with the reason it is deliberate."
  );
}

/* ============================================================
   A token nothing defines

   `background: var(--ground)` is a declaration the browser throws
   away whole: an undefined custom property is invalid at computed
   value time, and the property reverts rather than falling back.
   The quiz's selected answer was styled with it, so picking an
   option highlighted nothing and the only feedback was the native
   dot. `--header-h` was the same, left behind when `body > header`
   was removed, and both of its uses carried a fallback so nothing
   ever looked broken enough to chase.

   A token set by a script is real even though this file cannot
   see it declared, so those are proved rather than assumed: the
   name has to turn up in a `setProperty()` somewhere under
   `aab/`. Five do. Nothing else gets the benefit of the doubt.
   ============================================================ */

const strip = (t: string): string => t.replace(/\/\*[\s\S]*?\*\//g, "");
const noComments = strip(css);
const declared = new Set([...noComments.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const used = new Set([...noComments.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((m) => m[1]));

/* And the Tailwind source, which NAMES this stylesheet's tokens
   without declaring any: `@theme` there is how `bg-panel` comes to
   mean `var(--panel)`.

   Reading only `styles.css` missed the worst instance of exactly
   this. `--background-image-weave: var(--weave)` and its sheen
   twin sat in the Tailwind source for weeks and `--weave` was
   never declared anywhere, so `bg-weave` and `bg-sheen` computed
   to nothing in all seven components that asked for one, and
   every surface on the site was flat. It looked like a design
   choice. */
const tw = join(REPO, "next", "styles", "tailwind.css");
if (existsSync(tw)) {
  const theme = strip(readFileSync(tw, "utf8"));
  for (const m of theme.matchAll(/(--[a-z0-9-]+)\s*:/g)) declared.add(m[1]);
  for (const m of theme.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) used.add(m[1]);
}

/* Every custom property this site sets from code, from the
   sources rather than the built copies.

   TWO SPELLINGS, and only one of them was here. A browser module
   writes `setProperty("--x", ...)`; a React component writes it
   as an inline style, `style={{ "--x": value }}`, and that is
   how half of this site sets one now: the deck's accent, a
   school's colour, a band's colour, the fill of a heatmap cell.

   Reading only the first spelling made this check report a
   property React sets as one nothing sets, which is a false
   alarm, and false alarms are how a check gets ignored. It also
   meant the check could never see the other half: a component
   setting `--typo` would have gone unnoticed either way. */
const scriptSet = new Set();
for (const [, src] of markup) {
  for (const m of src.matchAll(/setProperty\(\s*["'`](--[a-z0-9-]+)["'`]/g)) {
    scriptSet.add(m[1]);
  }
  /* The inline form. A quoted key starting `--` inside an object
     literal is a custom property and cannot be much else: an
     ordinary CSS property in a React style object is camelCase
     and unquoted. */
  for (const m of src.matchAll(/["'`](--[a-z0-9-]+)["'`]\s*:/g)) {
    scriptSet.add(m[1]);
  }
}

for (const token of [...used].sort()) {
  if (declared.has(token) || scriptSet.has(token)) continue;
  failures++;
  console.error(`\n${token} is used but never defined, and no script sets it.`);
  console.error(
    "        An undefined custom property makes the whole declaration invalid\n"
    + "        at computed value time, so the property reverts and the rule does\n"
    + "        nothing. That is why it looks fine in a diff.");
}

/* ============================================================
   A rule that styles nothing

   This file already asks whether an ARTICLE class is styled
   nowhere. The other direction was never asked: a class with a
   rule of its own that no markup in this repository carries.

   That is how 236 lines went dead without anybody noticing, and
   they were found by hand on 18 August 2026 rather than by
   anything here: the whole `.wb-*` vocabulary outlived the module
   that wrote it, `.cell-aim` outlived the card it painted, and
   `.wb-picker` was a byte-for-byte copy of `.tag-waehler`.

   A RATCHET, not a wall, for the same reason `check-components.ts`
   is one: there are 45 of them, clearing them is a change nobody
   could review in one sitting, and each needs looking at rather
   than deleting. The number may only fall.

   The test is deliberately broader than `usedIn()` above. That one
   looks only in a class attribute, which is right for the leak
   question: a school's rule is anchored by a class the school's
   PAGES carry. Here any mention counts, because a class can be
   real without ever appearing in an attribute in this repository:
   `classList.add("x")`, a selector string in a module, a template
   literal. A rule flagged as dead and then deleted is a page
   losing its design, so this errs towards saying nothing.
   ============================================================ */
{
  const anywhere = [...markup.values()].join("\n");
  /* The name as a WHOLE WORD inside any quoted string, or after a
     dot in a selector. Not "the whole string is this class": half
     the site writes `className={plain ? "art" : "art stage-art"}`,
     and a pattern anchored to the quotes calls every one of those
     dead. Both false positives it produced were that shape. */
  const mentions = (cls: string): boolean =>
    new RegExp(`["'\`][^"'\`]*(?<![\\w-])${cls}(?![\\w-])[^"'\`]*["'\`]`).test(anywhere)
    || new RegExp(`\\.${cls}(?![\\w-])`).test(anywhere);

  const dead = [...everyClass].filter((c) => !mentions(c)).sort();

  const LEDGER = join(REPO, "scripts", "css-debt.json");
  const recorded = existsSync(LEDGER)
    ? JSON.parse(readFileSync(LEDGER, "utf8")).dead ?? 0
    : dead.length;

  if (process.argv.includes("--update")) {
    writeFileSync(LEDGER, `${JSON.stringify({ dead: dead.length, classes: dead }, null, 2)}\n`);
    console.log(`css debt recorded: ${dead.length} rule(s) that style nothing.`);
    process.exit(0);
  }

  if (dead.length > recorded) {
    failures++;
    const known = new Set(existsSync(LEDGER)
      ? JSON.parse(readFileSync(LEDGER, "utf8")).classes ?? [] : []);
    console.error(`\n${dead.length - recorded} new rule(s) style nothing on this site:`);
    for (const c of dead.filter((c) => !known.has(c))) console.error(`        .${c}`);
    console.error("        Either the markup that carried it went and the rule should go\n"
      + "        with it, or it was written before the thing it styles. Run\n"
      + "        `--update` only to record a fall.");
  } else if (dead.length < recorded && !failures) {
    console.log(`${recorded - dead.length} dead rule(s) gone since the last count. `
      + "Run --update to hold it.");
  }
}

console.log(
  failures
    ? `\n${failures} problem(s) in the stylesheet: fix before deploying.`
    : `${SCHOOLS.length} school layer(s) checked, nothing leaks into the rest of the site.\n`
      + `${new Set(studioClasses).size} article block classes, agreed by both sanitisers `
      + `and defined once each.\n`
      + `${everyClass.size} classes given a rule of their own, each in one layer `
      + `(${ALLOWED.size} deliberate exception).\n`
      + `${used.size} tokens used, every one of them defined here or set by a script.`
);
process.exit(failures ? 1 : 0);
