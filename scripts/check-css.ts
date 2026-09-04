#!/usr/bin/env node
/* check-css.ts: a school's styles leaking into the whole site,
   and everything else this stylesheet can get wrong as text.

       node scripts/check-css.ts

   A school's layer comes after `components`, so it beats it
   EVERYWHERE rather than only on that school's pages: `.tag`
   meaning Tag in German put a bordered box round the label on
   every card on the site. So every selector at the TOP LEVEL of a
   school's layer must be anchored by a class that belongs to that
   school; nested `& .thing` rules cannot escape their parent.

   Only the schools are checked. `money`, `check` and `work` hold
   furniture that really is sitewide; flagging those is flagging
   the design. A school mounted at its own path has no such excuse.

   Deliberately dumb: a regex over the stylesheet and a scan of the
   markup, no parser and no browser. It has to finish in a second
   or it will not get run. */

import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

/* `AAB` is the served directory and `ROOT` is the repository.
   Every file in `aab/` answers at a public URL, so a check living
   there is a check published. */
const REPO = join(dirname(fileURLToPath(import.meta.url)), "..");
const ROOT = join(REPO, "aab");

/** A school: its cascade layer, and the files it owns. */
const SCHOOLS = [
  { layer: "deutsch", owns: ["deutsch/"] },
  { layer: "quran", owns: ["quran/"] },
  { layer: "english", owns: ["english/"] },
  /* One layer and two folders. Most of what this layer styles is
     rendered by `next/components/` now, which this check cannot
     see; what it still catches is the reads layer leaking. */
  { layer: "reads", owns: ["cooking/", "travel/", "../next/"] },
];

const css = readFileSync(join(REPO, "next", "styles", "site.css"), "utf8");

/* Before anything else: do the braces balance? A browser recovers
   from a stray `}` by discarding until it finds its footing, so
   one two thousand lines up silently drops a layer's worth of
   rules and every check below goes on passing, because they all
   read the file as text. */
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
/** A layer's WHOLE body, which is every block that opens it. A
    cascade layer may be opened as many times as it likes and this
    stylesheet does: `deck` twice, `work` seven times. Returning the
    FIRST block only put every later block outside both ratchets
    below, including the whole front page. */
function layerBody(name: string): string | null {
  const parts: string[] = [];
  let from = 0;
  for (;;) {
    const open = css.indexOf(`@layer ${name} {`, from);
    if (open === -1) break;
    let depth = 0;
    for (let i = open; i < css.length; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}" && --depth === 0) {
        parts.push(css.slice(css.indexOf("{", open) + 1, i));
        from = i + 1;
        break;
      }
      if (i === css.length - 1) from = css.length;
    }
    if (from <= open) break;
  }
  return parts.length ? parts.join("\n") : null;
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
   these same layers. Without it every rule in the reads layer
   reports as styling nothing, which is a leak as far as this file
   can tell and is not. */
for (const outside of ["../next/app", "../next/components", "../next/lib"]) {
  if (existsSync(join(ROOT, outside))) walk(join(ROOT, outside));
}

/* And the Studio, whose OUTPUT is committed into `aab/` and so
   already walked. The source is here for the dead-rule count: a
   class a component writes appears in the bundle as a minified
   string, which is enough for a substring test and not to trust. */
if (existsSync(join(ROOT, "../app/src"))) walk(join(ROOT, "../app/src"));

const markup = new Map(
  files.filter((f) => f !== "check-css.ts").map((f) => [f, readFileSync(join(ROOT, f), "utf8")])
);

/* And the schools' prose, which is rows in D1 rather than files.
   `content/schools.backup.json` is the only copy a check running
   on a laptop with no network can read. Without it, 32 rules in
   the four school layers report as styling nothing at all, every
   one of them on a page a reader can see: a check that cannot see
   the markup does not report less, it reports wrongly. */
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
    /* One entry PER SCHOOL, because ownership is decided by the
       path a class was found under: one file holding all four
       schools' prose would belong to none of them and every rule
       in every school layer would flag. The names are not real
       paths; they start with the school's own folder, which is
       what `owns` matches on. */
    for (const school of ["money", "deutsch", "quran", "english"]) {
      const prose = (rows.lessons ?? [])
        .filter((l) => l.school === school)
        .map((l) => l.body ?? "")
        .join("\n");
      if (prose) add(`${school}/ (lesson prose, in D1)`, prose);
    }
  }

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
         writes it. `components/school-hub-page.tsx` renders all
         three hubs, so `deutsch-hero` sits in a file that also
         says `english-hero` and the folder test read the German
         hero rule as styling the English book. */
      if (cls.startsWith(`${layer}-`)) { mine.set(cls, true); return true; }
      const users = usedIn(cls);
      mine.set(cls, users.length > 0 && users.every((f) => owns.some((p) => f.startsWith(p))));
    }
    return mine.get(cls);
  };

  for (const sel of topLevelSelectors(body)) {
    /* A selector is safe when something in it can only mean this
       school. Anything else matches the rest of the site,
       including a selector with no class at all: a bare
       `header { position: sticky }` pinned the practice book's day
       header over the site's own. */
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

/* THE ARTICLE VOCABULARY

   A block the Studio can put into a piece is plain HTML with a
   class on it, and that class has to survive two sanitisers and
   mean one thing everywhere. Three ways it goes wrong, all
   quietly: the two allowlists drift, so the server supports a
   block nothing can produce; a class is allowed through and styled
   nowhere, so the block ships as a bare list; or the class is
   already taken, and a later layer wins everywhere rather than
   only on its own pages. */

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

/* The same two sanitisers, and the other half of their vocabulary:
   the ATTRIBUTES an element may keep. Nothing compared those, so
   they had drifted. `hostPhotosIn` sets `loading="lazy"` and
   `decoding="async"`; the browser's sanitiser stripped both, so
   neither had ever reached the database and every photo loaded
   eagerly while the markup said it should not. `class` is not in
   either table in the same sense: it is governed by the lists
   above. */

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
   Anything not here is drift. Keyed by tag AND attribute, for the
   reason `GONE` in check-pointers.ts is keyed by two things. */
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
    `topLevelSelectors()` deliberately reaches inside a top-level
    at-rule, because a school can leak from inside a media query.
    This asks a different question, "what does this layer say this
    class IS", and a conditional rule is not an answer: counting
    one made three layers look like they each owned a ring. */
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

/** A selector list, split on the commas that separate selectors.
    NOT `sel.split(",")`: a comma inside `:is()`, `:where()`,
    `:not()` or `:has()` separates arguments of ONE compound
    selector, and reading it as a list turns
    `:is(.card, .cell, .work-card):hover .artwork` into a bare
    `.cell` rule. */
function selectorList(sel: string): string[] {
  const out: string[] = [];
  let depth = 0, buf = "";
  for (const ch of sel) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
    if (ch === "," && depth === 0) { out.push(buf.trim()); buf = ""; continue; }
    buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
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
      .flatMap(selectorList)
      .some((sel) => sel === `.${cls}`);
    if (bare && !layers.includes(name)) layers.push(name);
  }
  return layers;
}

const MATERIAL = new Map([
  ["glow", "the light inside the glass, which every surface carries"],
]);

/* A RELIEF LAYER, which is the same exception earned differently.

   `@layer relief` names classes other layers define because a
   thing drawn on a surface sits above it, and that is true of an
   icon in a button and a sparkline on a case study, four layers
   apart. The material earns its exception by setting NOTHING but
   the light; a relief cannot promise that, because moving a thing
   is the whole of what it does. So:

     a relief layer may move a thing and may never lay it out.

   `translate`, `rotate` and `scale` COMPOSE with whatever
   `transform` the owning layer set; `transform` REPLACES it. So
   `transform` is the one word this layer may never say: one line
   of it naming `.art-floor` would stand every floor on this site
   back up with every rule still reading correctly. Nothing about
   size, position, colour or type either. */
const RELIEF = new Map([
  ["relief", "how far a thing drawn ON a surface stands off it"],
]);

const RELIEF_PROPS = new Set([
  /* The three that compose. Never `transform`. */
  "translate", "rotate", "scale",
  "filter", "opacity", "transition", "transition-duration", "will-change",
  "perspective", "transform-style", "transform-origin",
  /* Its own tokens, and the pointer it reads. */
  "--lift", "--relief-throw", "--relief-rise", "--relief-cast",
  "--gpx", "--gpy", "--gx", "--gy", "--gvx", "--gvy",
]);

/* `position` was on this list for one draft and it is the reason
   the list is worth having: the material set `position: relative`,
   and a later layer saying `relative` overrides `fixed` on `.rail`
   and `.topbar`, which pushed every page 1300 pixels down with
   every check passing. Position is geometry, and so are isolation,
   z-index and display. None of them is the light. */
const MATERIAL_PROPS = new Set([
  "background-image", "background-size", "background-position", "transition",
  /* The edge follows the border radius, which a gradient cannot. Safe only
     because every surface's own shadow is routed through --surface-shadow
     and check-material.ts fails on one that is not. */
  "box-shadow",
  /* The three a surface is DESCRIBED by, and the four derived
     from them. Nothing else: a material layer says what a thing
     is made of, and every consequence of that is a light. */
  "--depth", "--polish", "--clarity", "--standing",
  "--glow-w", "--glow-h", "--glow-i", "--glow-stop", "--glow-a", "--glow-fade",
  /* The ground's own texture, which this layer sets to `none` on
     everything drawn ON a surface: a row on the sheet repainting
     it is two gratings stacking into dirt. */
  "--glass-grain",
  /* Whether the light FOLLOWS the pointer, which is a fact about
     the light rather than the thing under it: the size formula
     multiplies by it, so a plate and a pane come out at nothing
     and are not tracked. It replaced a `--glow-w: 0` beside each
     of their depths, which the derived formula later in the same
     layer overrode at equal specificity. */
  "--follows",
  "--lit", "--rim", "--gpx", "--gpy", "--glass-face", "--glass-under", "--rim-a", "--rim-b", "--rim-face-a", "--rim-face-b",
  "--spec", "--gx", "--gy", "--tx", "--ty",
  "--surface-image", "--surface-size", "--surface-position",
  "--surface-shadow", "--edge",
]);

for (const cls of new Set([...studioClasses, ...serverClasses])) {
  /* Material layers are filtered here for the same reason as in
     the wider loop below: a material layer may set the light and
     nothing else, and this file proves that rather than trusting
     it. */
  const layers = definedIn(cls).filter((l) => !MATERIAL.has(l) && !RELIEF.has(l));
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

/* The same question, asked about every class rather than only the
   twenty-one an article may carry.

   Twelve classes were defined in two layers at once and none was
   an article block: `.ladder` was the money school's stack of
   stages and the stock check's row of rates, and `check` comes
   after `money`, so every school's ladder had been drawing with
   the stock check's gap for as long as both existed. Nobody typed
   a wrong rule. Each was right in its own layer, and a layer is
   exactly what makes "in its own layer" false.

   ALLOWED holds the pairs that are deliberate, each with a reason.
   It is not a suppression list for whatever is failing today: a
   genuine collision gets renamed. */

const ALLOWED = new Map([
  /* deck adds a margin and a width to the money school's resume
     card rather than restating it. Different properties, and the
     card is one card. */
  [".resume", "money+deck, deck adjusts the card money defines"],
  /* `components` says what the account popover IS; `shell` names
     it in ONE grouped rule giving all six pieces of fixed chrome
     the same glass ground, which is cross-cutting and cannot
     redefine what the popover is. */
  [".acc-menu", "components+shell, shell gives the six chrome surfaces one glass ground"],
]);

/* A MATERIAL LAYER, which is the one exception that generalises.

   `@layer glow` names a hundred classes other layers define, and
   it has to: the light is a property of what a thing IS rather
   than of what it looks like, so it cuts across every layer the
   way a theme does. What makes it different from the collision the
   rule above guards against is that it CANNOT do that damage, and
   that is checkable rather than promised:

     a material layer may set the light and nothing else.

   Not a colour, size, font, radius, border or grid position. If
   `@layer glow` ever sets one, this fails and the exception is
   withdrawn for the whole layer rather than the one rule.

   `transition` is on the list and is the uncomfortable one: a
   transition list is not merged across layers, so a material layer
   that animates one property has to restate the ones underneath or
   it takes them away. */


const CROSSING: Array<[Map<string, string>, Set<string>, string]> = [
  [MATERIAL, MATERIAL_PROPS, "material"],
  [RELIEF, RELIEF_PROPS, "relief"],
];

for (const [list, allowed, kind] of CROSSING)
for (const [name, why] of list) {
  const body = layerBody(name);
  if (!body) {
    failures++;
    console.error(`\n@layer ${name} is listed as a ${kind} layer and is not there.`);
    console.error(`        Remove it from ${kind.toUpperCase()} in this file: an exception to a`);
    console.error("        rule that guards nothing is the stale entry the list exists to avoid.");
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
  const stray = [...props].filter((prop) => !allowed.has(prop));
  if (!stray.length) continue;
  failures++;
  console.error(`\n@layer ${name} sets ${stray.length} thing(s) a ${kind} layer may not:`);
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
    for (const part of selectorList(sel)) {
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
  const layers = definedIn(cls).filter((l) => !MATERIAL.has(l) && !RELIEF.has(l));
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

/* A TOKEN NOTHING DEFINES. `background: var(--ground)` is a
   declaration the browser throws away whole: an undefined custom
   property is invalid at computed value time, and the property
   reverts rather than falling back. A token set by a script is
   real even though this file cannot see it declared, so those are
   proved rather than assumed: the name has to turn up in a
   `setProperty()` somewhere under `aab/`. Nothing else gets the
   benefit of the doubt. */

const strip = (t: string): string => t.replace(/\/\*[\s\S]*?\*\//g, "");
const noComments = strip(css);
const declared = new Set([...noComments.matchAll(/(--[a-z0-9-]+)\s*:/g)].map((m) => m[1]));
const used = new Set([...noComments.matchAll(/var\(\s*(--[a-z0-9-]+)/g)].map((m) => m[1]));

/* And the Tailwind source, which NAMES this stylesheet's tokens
   without declaring any: `@theme` there is how `bg-panel` comes to
   mean `var(--panel)`. Reading only `site.css` missed the worst
   instance: `--background-image-weave: var(--weave)` with `--weave`
   declared nowhere, so `bg-weave` computed to nothing in seven
   components and every surface on the site was flat. */
const tw = join(REPO, "next", "styles", "tailwind.css");
if (existsSync(tw)) {
  const theme = strip(readFileSync(tw, "utf8"));
  for (const m of theme.matchAll(/(--[a-z0-9-]+)\s*:/g)) declared.add(m[1]);
  for (const m of theme.matchAll(/var\(\s*(--[a-z0-9-]+)/g)) used.add(m[1]);
}

/* Every custom property this site sets from code, from the sources
   rather than the built copies.

   TWO SPELLINGS. A browser module writes `setProperty("--x", ...)`;
   a React component writes an inline style, `style={{ "--x": v }}`,
   and that is how half of this site sets one. Reading only the
   first made this report a property React sets as one nothing
   sets, and false alarms are how a check gets ignored. */
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

/* A RULE THAT STYLES NOTHING: a class with a rule of its own that
   no markup in this repository carries. 236 lines went dead that
   way, the whole `.wb-*` vocabulary outliving the module that
   wrote it.

   A RATCHET, not a wall: each of the remaining ones needs looking
   at rather than deleting, and the number may only fall.

   The test is broader than `usedIn()` above, which looks only in a
   class attribute. Here any mention counts, because a class can be
   real without appearing in an attribute: `classList.add("x")`, a
   selector string, a template literal. A rule flagged dead and
   then deleted is a page losing its design, so this errs towards
   saying nothing. */
{
  const anywhere = [...markup.values()].join("\n");
  /* The name as a WHOLE WORD inside any quoted string, or after a
     dot in a selector. Not "the whole string is this class": half
     the site writes `className={plain ? "art" : "art stage-art"}`,
     and a pattern anchored to the quotes calls those dead. */
  /* A class BUILT by concatenation is real and its full name is
     nowhere in the repository: `` `finding-${d.k}` `` gives seven
     live rules no search for their own name can find. Every prefix
     immediately before a template placeholder counts as a mention
     of everything under it. */
  const built = new Set<string>();
  for (const m of anywhere.matchAll(/([A-Za-z][\w-]*?-)\$\{/g)) built.add(m[1]);

  const mentions = (cls: string): boolean =>
    new RegExp(`["'\`][^"'\`]*(?<![\\w-])${cls}(?![\\w-])[^"'\`]*["'\`]`).test(anywhere)
    || new RegExp(`\\.${cls}(?![\\w-])`).test(anywhere)
    || [...built].some((prefix) => cls.startsWith(prefix));

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

/* THE LIGHT'S SECOND RADIUS, overridden once. `--glow-h` exists so
   the pointer light can be an ellipse on a surface that is not
   roughly square, and there is exactly one: `.rail`, 268px wide
   and the height of the window. A SECOND literal override means
   the ladder needs the axis, the way `--glow-w` is derived from
   `--depth`, rather than a class needing an exception. */
{
  const literal = [...css.matchAll(/--glow-h:\s*([^;]+);/g)]
    .map((m) => m[1].trim())
    .filter((value) => !value.startsWith("var(--glow-w)"));
  if (literal.length > 1) {
    failures++;
    console.error(`\n--glow-h is overridden ${literal.length} times: ${literal.join(", ")}`);
    console.error("        One surface is an ellipse and it is the rail, for a reason");
    console.error("        written where it is set. A second means the ladder needs the");
    console.error("        axis rather than a class needing an exception.");
  }
}

/* THE LANGUAGE SWITCH HAS TO HAVE A LANGUAGE TO SWITCH TO.

   `@layer lesson` puts both bodies of a lesson in the markup and
   hides one, keyed on `data-read-lang`. That is right for the 81
   money lessons, which are written twice, and wrong for the other
   144, which are Bangla and nothing else: hiding the Bangla there
   hides the LESSON, and those pages render no switch to undo it.
   The row was right and the route rendered every word of it, so
   `parity.test.ts` found it correct.

   A rule that hides a prose half has to say which lessons it may
   hide it on, and the component has to mark them. */
{
  const layer = layerBody("lesson");
  if (layer === null) {
    failures++;
    console.error("\nno @layer lesson in the stylesheet, and it is where the two "
      + "languages of a lesson are chosen between.");
  } else {
    /* Comments first, or a paragraph naming a class reads as a
       selector: the prose above this check would match itself. */
    const rules = [...layer.replace(/\/\*[\s\S]*?\*\//g, " ")
      .matchAll(/([^{}]+)\{([^{}]*)\}/g)];

    const unguarded = rules
      .map(([, selector, decls]) => ({ selector: selector.trim().replace(/\s+/g, " "), decls }))
      .filter(({ selector, decls }) =>
        /display\s*:\s*none/.test(decls)
        && /\.ls-(bn|en)\b/.test(selector)
        && /\.ls-(body|slice)\b/.test(selector)
        && !selector.includes("[data-langs"));

    if (unguarded.length) {
      failures++;
      console.error(`\n${unguarded.length} rule(s) can hide a lesson's only language:`);
      for (const { selector } of unguarded) console.error(`        ${selector}`);
      console.error("        144 of the 225 written lessons have no English half, so this\n"
        + "        hides the whole lesson on every one of them. Add [data-langs=\"both\"],\n"
        + "        which `next/components/lesson/body.tsx` sets from the prose it was\n"
        + "        given. `next/reading.test.ts` measures the box this leaves behind.");
    }

    /* THE MARKER IS HALF OF IT, and the half that fails silently:
       a selector keyed on an attribute nothing writes matches
       nothing, so the rules above stop firing and the 81 money
       lessons show BOTH languages at once. */
    const at = join(REPO, "next", "components", "lesson", "body.tsx");
    const src = existsSync(at) ? readFileSync(at, "utf8") : "";
    const keyed = rules.some(([, selector]) => selector.includes("[data-langs"));
    if (keyed && !/className="ls-body"\s+data-langs=/.test(src)) {
      failures++;
      console.error("\n@layer lesson keys on [data-langs] and lesson/body.tsx does not "
        + "write it.\n        Every rule that names it matches nothing, so a lesson "
        + "written in two\n        languages now shows both at once.");
    }
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
