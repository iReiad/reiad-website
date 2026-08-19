#!/usr/bin/env node
/* ============================================================
   check-selfref.ts: a custom property set to itself is a cycle,
   and the browser throws the whole declaration out.

       node scripts/check-selfref.ts
       node scripts/check-selfref.ts --list   # every --accent a component writes

   THE BUG THIS EXISTS FOR

   `school-hub.tsx` held `const ACCENT = { live: "var(--accent)" }`
   and handed that string to a card, which writes its accent into
   `--accent`. The declaration was `--accent: var(--accent)`: a
   cycle, thrown out, so `--accent` was the guaranteed-invalid
   value on the card and everything inside it. `--panel` is mixed
   from `--accent`, so fourteen cards on /money/index.html
   computed a background of `rgba(0, 0, 0, 0)`, and the rail, the
   icon tile and the chip lost their grounds with it. Wanting the
   page's accent means NOT SETTING the property.

   `--radius-sm: var(--radius-sm)` in `@theme` was the same
   sentence in CSS, and it made every corner on the site square.
   Six more of them, five fonts and `--shadow-lift`, survived that
   fix and put the whole site in the browser's default face.
   `tailwind.css` says so where it happened.

   `@theme inline` is the ONE place the shape is correct, and it
   is the fix for all seven rather than an exception to the rule:
   an inline key is emitted into the utility that uses it and
   never into `:root`, so there is no declaration to be a cycle.
   The block is skipped whole.

   WHAT IT READS

   The two places the declaration can be written: a value in
   `next/styles/*.css`, and a string in `next/**` or `aab/src/**`
   that becomes one, whether written as the property (`"--x":
   "var(--x)"`, `setProperty("--x", "var(--x)")`) or as an
   `accent`, which five components write into `--accent`.

   Anything in `next/components/**` naming `var(--accent)` at all
   is flagged: a component renders inside whatever accent the page
   is wearing, so the string either restates what inheritance
   already does or feeds `--accent` back into itself, and nothing
   here can tell which from a literal.

   A self-reference reached through a FALLBACK, `--x: var(--y,
   var(--x))`, is not flagged. CSS counts a fallback in the
   dependency graph too, so it is a cycle as well, but it is the
   one shape where the author is reaching for something else
   first. What is flagged is a value whose FIRST `var()` is the
   property being set, which is the declaration saying itself.

   Comments are stripped before any of it, in both languages.
   Both files quote the broken declaration in prose, and a check
   that reads its own warning as the bug is a check nobody keeps.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** One place a property is set to itself: where, and the line as
    a reader would quote it. */
interface Hit {
  file: string;
  line: number;
  text: string;
  why: string;
}

const hits: Hit[] = [];
const at = (src: string, index: number): number =>
  src.slice(0, index).split("\n").length;

/* ============================================================
   The stylesheet
   ============================================================ */

/** CSS with every comment blanked, offsets and lines intact. */
function decommentCSS(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, " "));
}

const STYLES = join("next", "styles");
const sheets = readdirSync(join(ROOT, STYLES)).filter((f) => f.endsWith(".css")).sort();

/** The same CSS with every `@theme inline { ... }` block blanked,
    offsets and lines intact. Those keys never reach `:root`, so a
    key naming the site token of the same name is the passthrough
    rather than a cycle. `@theme` without `inline` is not skipped:
    that one does emit, and is where all seven bugs were. */
function skipInlineTheme(css: string): string {
  let out = css;
  for (const m of css.matchAll(/@theme\s+inline\s*\{/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < css.length && depth > 0) {
      if (css[i] === "{") depth += 1;
      else if (css[i] === "}") depth -= 1;
      i += 1;
    }
    const body = css.slice(m.index, i);
    out = out.slice(0, m.index) + body.replace(/[^\n]/g, " ") + out.slice(i);
  }
  return out;
}

for (const name of sheets) {
  const file = join(STYLES, name);
  const css = skipInlineTheme(decommentCSS(readFileSync(join(ROOT, file), "utf8")));
  for (const m of css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+)/g)) {
    const first = /var\(\s*(--[\w-]+)/.exec(m[2]);
    if (!first || first[1] !== m[1]) continue;
    hits.push({
      file,
      line: at(css, m.index),
      text: `${m[1]}: ${m[2].trim()}`,
      why: "set to itself, so it is invalid on this element and every one inside it",
    });
  }
}

/* ============================================================
   The components
   ============================================================ */

/** TypeScript with every comment blanked and every escape inside
    a string blanked, offsets and lines intact. A `//` inside a
    string is not a comment, which is what the scan is for. */
function decommentTS(src: string): string {
  let out = "";
  let quote: string | null = null;
  for (let i = 0; i < src.length; i += 1) {
    const c = src[i];
    if (quote) {
      if (c === "\\") { out += "  "; i += 1; continue; }
      if (c === quote) quote = null;
      out += c;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") { quote = c; out += c; continue; }
    if (c === "/" && src[i + 1] === "/") {
      while (i < src.length && src[i] !== "\n") { out += " "; i += 1; }
      i -= 1;
      continue;
    }
    if (c === "/" && src[i + 1] === "*") {
      const end = src.indexOf("*/", i + 2);
      const stop = end === -1 ? src.length : end + 2;
      out += src.slice(i, stop).replace(/[^\n]/g, " ");
      i = stop - 1;
      continue;
    }
    out += c;
  }
  return out;
}

/** Every `.ts` and `.tsx` under `dir`, ignoring what is built or
    installed rather than written. */
function sources(dir: string): string[] {
  const skip = new Set(["node_modules", ".next", ".open-next", ".turbo", "dist"]);
  const out: string[] = [];
  for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (entry.name.startsWith(".") || skip.has(entry.name)) continue;
    const here = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...sources(here));
    else if (/\.tsx?$/.test(entry.name)) out.push(here);
  }
  return out.sort();
}

/* `--x` written as the property, and the same declaration reached
   through `setProperty`. `\2` is the backreference that makes it
   a self-reference rather than a pair of properties. */
const AS_PROPERTY = /(["'])(--[\w-]+)\1(?:\s+as\s+\w+)?\s*\]?\s*:\s*(["'])var\(\s*\2\s*\)\3/g;
const AS_SET = /setProperty\(\s*(["'])(--[\w-]+)\1\s*,\s*(["'])var\(\s*\2\s*\)\3/g;
/* An `accent` is written into `--accent` by deck, surface,
   sidebar, footer, nav-tree and nav.ts. Naming it is the cycle
   one indirection out. */
const AS_ACCENT = /\baccent\s*[:=]\s*\{?\s*(["'])var\(\s*--accent\s*\)\1/g;
/** Anywhere under here, `var(--accent)` in a string is either the
    cycle or a restatement of what inheritance does. */
const COMPONENTS = join("next", "components");
const ACCENT_STRING = /(["'])var\(\s*--accent\s*\)\1/g;

const list = process.argv.includes("--list");
/** Every `var(--accent)` string a component holds, for `--list`. */
const strings: Array<{ file: string; line: number }> = [];

for (const file of [...sources("next"), ...sources(join("aab", "src"))]) {
  const src = decommentTS(readFileSync(join(ROOT, file), "utf8"));
  const inComponent = !relative(COMPONENTS, file).startsWith("..") && file.endsWith(".tsx");

  for (const m of src.matchAll(AS_PROPERTY)) {
    hits.push({ file, line: at(src, m.index), text: m[0], why: `${m[2]} set to itself` });
  }
  for (const m of src.matchAll(AS_SET)) {
    hits.push({ file, line: at(src, m.index), text: m[0], why: `${m[2]} set to itself` });
  }
  for (const m of src.matchAll(AS_ACCENT)) {
    hits.push({
      file,
      line: at(src, m.index),
      text: m[0],
      why: "an accent is written into --accent, so this is --accent: var(--accent)",
    });
  }
  if (!inComponent) continue;
  for (const m of src.matchAll(ACCENT_STRING)) {
    strings.push({ file, line: at(src, m.index) });
    /* Already reported with the reason that names the property. */
    if (hits.some((h) => h.file === file && h.line === at(src, m.index))) continue;
    hits.push({
      file,
      line: at(src, m.index),
      text: m[0],
      why: "a component inherits the page's accent, so following it is undefined rather than this",
    });
  }
}

if (list) {
  for (const s of strings) console.log(`  ${s.file}:${s.line}  var(--accent)`);
  if (strings.length === 0) console.log("  no component names var(--accent).");
}

if (hits.length) {
  console.error(`${hits.length} custom propert(ies) set to themselves:\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}  ${h.text.replace(/\s+/g, " ")}`);
    console.error(`      ${h.why}`);
  }
  console.error("\nA cycle is thrown out whole, so the property is not the value it "
    + "names\nand not the value it had: it is nothing, on that element and every one\n"
    + "inside it. To follow the page, do not set the property. To follow "
    + "something\nelse, name that.");
  process.exit(1);
}

console.log(`selfref: nothing is set to itself, in ${sheets.length} stylesheet(s) `
  + `or in what next/ and aab/src/ write, and ${strings.length} component(s) name `
  + "var(--accent).");
