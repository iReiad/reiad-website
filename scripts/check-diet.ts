#!/usr/bin/env node
/* ============================================================
   check-diet.ts: the diet tool's rules that are about PAGES
   rather than about numbers.

       node scripts/check-diet.ts

   `DIET.md` section 33 asks for two guards and they cover
   different halves. `scripts/diet.test.ts` is the arithmetic:
   every formula, every floor, asserted from the wrong side.
   `next/diet.test.ts` drives the built pages in a browser. This
   is the third thing, and it exists because most of what section
   33 lists cannot be caught by either: a page that prints a
   target with no disclaimer beside it, a widget whose empty
   state is a zero, a Bangla reader meeting an English string,
   a glossary that defines a word nothing links to, and a column
   in the migration that no part of the tool can ever put a value
   in. Every one of those renders perfectly.

   Eleven questions, and each one is a rule DIET.md states and
   nothing else holds:

   1. EVERY PAGE THAT PRINTS A TARGET PRINTS THE MEDICAL ADVICE
      LINE BESIDE IT. Section 31's first bullet, and the one with
      a reader on the other end of it.

   2. BOTH LANGUAGES COVER THE SAME KEYS. Section 23: the switch
      changes EVERYTHING on the page. A `<T>` with an empty half
      is a blank where a sentence should be, and an `aria-label`
      written as an English string literal is a control that
      never translates, because an attribute is not a node and
      cannot be rendered twice.

   3. NO WIDGET WITHOUT AN EMPTY STATE. Section 24: "Not a
      spinner, not an empty box, not a zero: a sentence saying
      what it will show and when."

   4. THE GLOSSARY DEFINES EVERY TERM THE PAGES USE, and every
      entry is reachable. Both halves, because a definition
      nothing links to is a page nobody arrives at and a term
      nothing defines is the tool written for people who already
      know.

   5. THE FIXED SETS ARE FIXED. The journal tags in section 11
      and the day marks the migration names beside the column.
      Neither has a CHECK constraint, so this check IS the
      constraint: a tag the migration does not know about fails
      here rather than in Postgres, which is the whole reason
      section 33 asks for it.

   6. EVERY `diet_*` COLUMN IS REACHED, or is named as not built
      yet with the section that will build it. This is the one
      that stops the schema drifting away from the tool.

   7. WHAT HAPPENS AFTER A GOAL IS REACHED IS SAID ONCE, on the
      goal page. Section 6 puts it there and only there: said
      twice it is a slogan, and said away from the projection it
      is a scare.

   8. THE FLOORS ARE THE MODULE'S, AND NOTHING RETYPES A
      FORMULA. Section 5 and section 33's first bullet. Every
      bound `target()` clamps with is asserted by
      `scripts/diet.test.ts`; the sentence that tells a reader
      which bound bound them draws its number from the constant
      rather than writing it out; and no page carries the SHAPE
      of a formula `shared/diet.ts` already exports.

   9. THE ASIAN CUT-OFFS ARE USED WHENEVER ANCESTRY SAYS SO.
      Section 2, which calls it the single most important honest
      detail in the tool. A band read with a fixed ancestry, a
      cut-off written into a comparison, or a band drawn without
      `bmiBand()` all tell a South Asian reader they are fine
      where their own health service would not.

   10. THE PORTION LIBRARY CARRIES A SOURCE, A DATED PRICE AND A
      STATE. Sections 12, 14 and 17. Raw rice is 365 kcal per
      100 g and cooked is about 130, and a row that does not say
      which it is is the error section 14 calls the most common
      in the whole of calorie counting.

   11. THE GENERATED SENTENCES JUDGE NOBODY. Section 31's last
      bullet: a tool that writes free prose about somebody's
      eating will eventually write something cruel. The list of
      templates is DERIVED from the panels rather than kept here,
      and `--templates` prints it.

   ---- what "reached" means, and why it is not "written" ----

   `fromDay()` in `next/lib/diet-api.ts` writes every day column
   on every save, so "is it written" is a question the API layer
   answers yes to for columns nothing can ever fill:
   `sleep_hours: d.sleepHours ?? null` is a null with a mapping
   over it. So this derives the name a CALLER would have to use
   out of that mapping, and asks whether any caller uses it. A
   column nothing in the tool names is a column that will hold
   null for ever, and the site is correct, every check passes,
   and a feature is missing where nobody can see it is missing.

   ---- and the vocabularies are read, never retyped ----

   The tags come out of DIET.md, the marks out of the migration,
   the columns out of the migration, the terms out of the
   glossary, the floors out of `target()`'s own body, the
   cut-offs out of `BMI_CUTS`, the nouns that must name a state
   out of DIET.md, and the templates out of the panels. Retyping
   any of them here would make this file one more place the same
   list is said, which is the failure the top of CLAUDE.md is
   about happening to the thing that catches it.

   Three tables here are NOT that, and the difference is the
   test. `UNUSED`, `NO_STATE` and `JUDGEMENT` say nothing the
   repository already holds: two are exemptions with a reason
   each, and both fail when the thing they exempt has gone, and
   the third is the vocabulary of judgement, which is a rule
   rather than a copy of anything.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { BMI_CUTS, TAGS, MARKS } from "../shared/diet.ts";
/* The namespace as well, and only question 8 needs it: the floors
   are read out of `target()`'s own body, so the name of a constant
   is a string at the time it is looked up. A list of them written
   out here would be the second copy the head of this file bans. */
import * as DIET from "../shared/diet.ts";
import { DIET_WORDS } from "../shared/diet-words.ts";
import { FOODS } from "../shared/foods.ts";
import { bnNum } from "../shared/schools.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

const COMPONENTS = "next/components/diet";
const ROUTES = "next/app/(site)/tools/diet";
const API = "next/lib/diet-api.ts";
const WORDS = "shared/diet-words.ts";

/** Every migration that touches a diet table, found rather than
    named. A migration's filename is the primary key of a row in
    `supabase_migrations.schema_migrations` and may never be
    renamed, so a second one adding a column is how this schema
    will grow, and a check reading one file by name would go on
    reporting on the schema of August. */
const MIGRATIONS = "supabase/migrations";
const migrationFiles = readdirSync(join(ROOT, MIGRATIONS)).sort()
  .filter((f) => f.endsWith(".sql")
    && readFileSync(join(ROOT, MIGRATIONS, f), "utf8").includes("public.diet_"));

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

/** Every `.ts` and `.tsx` under one directory, relative to the
    repository root, walked rather than listed: a hand-kept list
    of the files a check reads is the second copy this file
    exists to ban, one level up. */
function filesUnder(rel: string): string[] {
  const out: string[] = [];
  const walk = (dir: string): void => {
    for (const entry of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
      const here = `${dir}/${entry.name}`;
      if (entry.isDirectory()) walk(here);
      else if (/\.tsx?$/.test(entry.name)) out.push(here);
    }
  };
  walk(rel);
  return out.sort();
}

/** Comments stripped, so a column named in a comment does not
    read as a column the code carries. `//` only where it starts a
    line, because a URL is not a comment. */
const uncommented = (src: string): string =>
  src.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/^\s*\/\/.*$/gm, " ");

const TOOL_FILES = [...filesUnder(COMPONENTS), ...filesUnder(ROUTES)];
const SOURCE = new Map(TOOL_FILES.map((f) => [f, read(f)]));

/* ------------------------------------------------------------
   The one JSX reader everything below shares

   It walks rather than matching, because every prop worth
   looking at here holds JSX: `en={<p>...</p>}` has a `>` in it
   that a regex for the end of a tag would stop on, and the
   result would be a check that reads half an attribute list and
   reports the other half missing.
   ------------------------------------------------------------ */

interface Tag { file: string; line: number; attrs: string }

/** Every opening tag of one element, with its attribute text. */
function openTags(file: string, src: string, name: string): Tag[] {
  const found: Tag[] = [];
  const start = new RegExp(`<${name}(?![A-Za-z0-9_])`, "g");
  for (const at of src.matchAll(start)) {
    const from = (at.index ?? 0) + name.length + 1;
    let depth = 0;
    let quote = "";
    let i = from;
    for (; i < src.length; i += 1) {
      const c = src[i];
      if (quote) {
        if (c === "\\") { i += 1; continue; }
        if (c === quote) quote = "";
        continue;
      }
      if (c === '"' || c === "'" || c === "`") { quote = c; continue; }
      if (c === "{" || c === "(") { depth += 1; continue; }
      if (c === "}" || c === ")") { depth -= 1; continue; }
      if (c === ">" && depth === 0) break;
    }
    found.push({
      file,
      line: src.slice(0, at.index ?? 0).split("\n").length,
      attrs: src.slice(from, i),
    });
  }
  return found;
}

/** One attribute's value, as written, with its braces or quotes
    still on: the caller is the one that knows whether a bare
    string is the failure or the point. */
function attr(attrs: string, key: string): string | null {
  const at = attrs.search(new RegExp(`(^|[\\s{])${key}\\s*=`));
  if (at < 0) return null;
  let i = attrs.indexOf("=", at) + 1;
  while (i < attrs.length && /\s/.test(attrs[i])) i += 1;
  const opener = attrs[i];
  if (opener === '"' || opener === "'") {
    const end = attrs.indexOf(opener, i + 1);
    return attrs.slice(i, end < 0 ? attrs.length : end + 1);
  }
  if (opener !== "{") return null;
  let depth = 0;
  let quote = "";
  let last = "";
  for (let j = i; j < attrs.length; j += 1) {
    const c = attrs[j];
    if (quote) {
      if (c === "\\") { j += 1; continue; }
      if (c === quote) quote = "";
      continue;
    }
    /* AN APOSTROPHE IN PROSE IS NOT A STRING. `en={(<p>somebody's
       periods</p>)}` opened a string here and swallowed the rest
       of the file looking for a closing quote, so a `TBlock`
       whose English half contains one reported as having no
       English half. Both real cases inside these braces open in
       EXPRESSION position, after an operator or a bracket, so
       that is the test. A double quote and a backtick cannot
       appear in JSX text unescaped, so they need no test. */
    const expr = last === "" || "=(,:[{&|?!<>+-*/;".includes(last);
    if (c === '"' || c === "`" || (c === "'" && expr)) { quote = c; continue; }
    if (c === "{") depth += 1;
    else if (c === "}") {
      depth -= 1;
      if (depth === 0) return attrs.slice(i, j + 1);
    }
    if (!/\s/.test(c)) last = c;
  }
  return null;
}

/* ------------------------------------------------------------
   1. Every page that prints a target prints the disclaimer

   Section 31: "Every page that prints a target prints, next to
   it, that this is general education and not medical advice."

   A page is a route directory plus every diet component it
   reaches, because the disclaimer and the number are almost
   never in the same file: the number is in a panel and the
   sentence is under it, and either could hold either.

   A TARGET is what `shared/diet.ts` calls one. `target()` is the
   day's calories, `proteinFloor()` is the one macro with a
   floor, and `projection()` is the number a reader will plan
   around. All three are somebody being told to aim at
   something, which is the test section 31 sets.
   ------------------------------------------------------------ */

const TARGET_FUNCTIONS = ["target", "proteinFloor", "projection"];
const SAYS_EN = /general education and not medical advice/;
const SAYS_BN = /চিকিৎসা পরামর্শ নয়/;

/** Which diet components one file pulls in, one hop, followed to
    the end so a panel's own children are part of its page. */
function reaches(file: string, seen = new Set<string>()): Set<string> {
  if (seen.has(file)) return seen;
  seen.add(file);
  const src = SOURCE.get(file) ?? "";
  for (const m of src.matchAll(/from\s+"([^"]*components\/diet\/[\w-]+)"/g)) {
    const component = `${COMPONENTS}/${m[1].split("/").pop() as string}.tsx`;
    if (SOURCE.has(component)) reaches(component, seen);
  }
  return seen;
}

const pages = TOOL_FILES.filter((f) => f.startsWith(ROUTES) && f.endsWith("/page.tsx"));
let targeted = 0;
let disclaimed = 0;

for (const page of pages) {
  const set = [...reaches(page)];
  const prints = set.filter((f) => TARGET_FUNCTIONS.some(
    (fn) => new RegExp(`\\b${fn}\\(`).test(uncommented(SOURCE.get(f) ?? "")),
  ));
  if (!prints.length) continue;
  targeted += 1;

  /* Comments stripped, so a paragraph explaining why a page has
     no disclaimer does not read as the disclaimer. */
  const said = set.some((f) => {
    const src = uncommented(SOURCE.get(f) ?? "");
    return SAYS_EN.test(src) && SAYS_BN.test(src);
  });
  if (said) { disclaimed += 1; continue; }

  const address = `/${relative(join(ROOT, "next/app/(site)"), join(ROOT, dirname(page)))}`;
  fail(`${address} prints a target and carries no medical advice line`,
    `it is printed by ${prints.map((f) => relative(COMPONENTS, f)).join(", ")}`,
    "DIET.md section 31: every page that prints a target prints, next to it,",
    "that this is general education and not medical advice. In BOTH languages:",
    "this looks for the English sentence and for চিকিৎসা পরামর্শ নয়.",
    "body.tsx and goal-panel.tsx both have one to copy.");
}

/* ------------------------------------------------------------
   2. Both languages cover the same keys

   Section 23: one switch, and it changes EVERYTHING on the page.
   Three shapes of that going wrong, and they fail differently.

   A `<T>` or `<TBlock>` with an empty half is a blank on the
   page for exactly one of the two readers, and it is invisible
   to whoever wrote it, because nobody writes a page in the
   language they are not testing in.

   A `<T k="...">` says its two halves once, in
   `shared/diet-words.ts`, so the phone draws the same sentence
   with no app release. What goes wrong THERE is a key that
   reaches nothing: `lang.tsx` renders `[dt.foo]` rather than
   throwing, which on a page of finished sentences reads as a
   placeholder somebody meant to come back to. So a key has to
   be in the table, and a key in the table has to be drawn: a
   rename that stops halfway breaks one of those two.

   An `aria-label`, a `title` or a `placeholder` is an ATTRIBUTE
   rather than a node, so it cannot be rendered twice and hidden:
   `lang.tsx` says so where `useToolLang()` is defined, and that
   hook is already in scope in every file this finds. A literal
   with Bangla in it passes, because "Language / ভাষা" is both.
   ------------------------------------------------------------ */

const BANGLA = /[ঀ-৿]/;
const EMPTY = /^(\{?\s*(""|''|``|null|undefined|<>\s*<\/>)?\s*\}?|""|''|``)$/;
const ATTRS = ["aria-label", "title", "placeholder"];

let phrases = 0;
let keyed = 0;
const drawn = new Set<string>();

for (const file of TOOL_FILES) {
  const src = SOURCE.get(file) as string;

  for (const tag of [...openTags(file, src, "T"), ...openTags(file, src, "TBlock")]) {
    phrases += 1;

    /* A key supplies both halves at once, which is the stronger
       of the two spellings: the pair cannot be half written. */
    const key = attr(tag.attrs, "k");
    if (key !== null) {
      keyed += 1;
      /* Every key-shaped literal in it, because a key may be
         chosen at runtime: the body page picks between two
         sentences on which method measured the fat. Every branch
         is still a string written here, so every branch is still
         checkable. The `dt.` shape is what tells a key from the
         `"navy"` the condition compares against, and the reverse
         walk below is what keeps that shape true. */
      const names = [...key.matchAll(/["'\`]([^"'\`]*)["'\`]/g)]
        .map((m) => m[1]).filter((name) => name.startsWith("dt."));
      if (!names.length) {
        fail(`${tag.file}:${tag.line} has a k with no key written in it`,
          `it is written k=${key.slice(0, 60)}`,
          "A key built at runtime cannot be held to the table, and a key that",
          "reaches nothing renders as [dt.foo] on an otherwise finished page.");
        continue;
      }
      for (const name of names) {
        drawn.add(name);
        const said = DIET_WORDS[name];
        if (!said) {
          fail(`${tag.file}:${tag.line} draws ${name}, which ${WORDS} does not hold`,
            "lang.tsx renders the key in square brackets rather than throwing, so",
            "this ships looking like a placeholder rather than failing.");
          continue;
        }
        for (const half of ["en", "bn"] as const) {
          if (said[half].trim()) continue;
          fail(`${WORDS} has an empty ${half} half for ${name}`,
            "A phrase said in one language is a blank in the other.");
        }
      }
      continue;
    }

    for (const half of ["en", "bn"] as const) {
      const value = attr(tag.attrs, half);
      if (value === null) {
        fail(`${tag.file}:${tag.line} has no ${half} half`,
          "A phrase said in one language is a blank in the other.");
        continue;
      }
      if (EMPTY.test(value.trim())) {
        fail(`${tag.file}:${tag.line} has an empty ${half} half`,
          `it is written ${half}=${value.trim()}`);
      }
    }
  }

  /* The attributes. A string literal, in either spelling, with
     Latin letters in it and no Bangla: an expression is left
     alone, because a value chosen by `lang` is exactly the fix. */
  for (const key of ATTRS) {
    const re = new RegExp(`(^|[\\s{])${key}\\s*=\\s*(\\{\\s*)?("[^"]*"|'[^']*')`, "g");
    for (const m of src.matchAll(re)) {
      const text = m[3].slice(1, -1);
      if (!/[A-Za-z]/.test(text) || BANGLA.test(text)) continue;
      /* From the attribute itself rather than from the match,
         whose first group is the character in front of it and is
         a newline as often as it is a space. */
      const line = src.slice(0, (m.index ?? 0) + m[1].length).split("\n").length;
      fail(`${file}:${line} has an English-only ${key}`,
        `it reads ${JSON.stringify(text)}`,
        "An attribute is not a node, so it cannot be rendered twice and",
        "hidden. useToolLang() is already in this file's scope:",
        `  ${key}={lang === "bn" ? "…" : ${JSON.stringify(text)}}`);
    }
  }
}

/* And the other way round. A key nothing draws is a sentence
   written, translated and served to the phone for a page that
   never asks for it, and more often it is the far half of a
   rename: the table was renamed, the page was not, and the page
   now prints the key. */
for (const name of Object.keys(DIET_WORDS)) {
  if (!name.startsWith("dt.")) {
    fail(`${WORDS} holds ${name}, which is not shaped like a key`,
      "A `<T k>` may choose its key at runtime, and the check above tells a key",
      "from the operand it is compared against by that prefix and nothing else.");
  }
  if (drawn.has(name)) continue;
  fail(`${WORDS} holds ${name}, and no page draws it`,
    "Either a <T k> lost this key in a rename, in which case that page is",
    "printing the key it asks for, or the phrase is dead copy that is still",
    "translated and still served to the app.");
}

/* ------------------------------------------------------------
   3. No widget without an empty state

   Section 24: "Every widget is legible with no data. Not a
   spinner, not an empty box, not a zero: a sentence saying what
   it will show and when." `widgets.tsx` repeats it fifteen lines
   above the component, and a board of empty panels reads exactly
   like a broken page, which is the rule `/admin` already exists
   under.

   `<Waiting>` is that sentence, and a `<Widget>` that never
   offers one has no state to be legible in: whatever it draws
   with no data, it draws a zero or nothing.
   ------------------------------------------------------------ */

if (!/export function Waiting\b/.test(read(`${COMPONENTS}/widgets.tsx`))) {
  fail(`${COMPONENTS}/widgets.tsx no longer exports Waiting`,
    "It is the empty state every widget is checked against below.");
}

let widgets = 0;

for (const file of TOOL_FILES) {
  const src = SOURCE.get(file) as string;
  const parts = src.split(/<Widget(?![A-Za-z0-9_])/).slice(1);
  for (const part of parts) {
    widgets += 1;
    const body = part.split("</Widget>")[0];
    if (/<Waiting(?![A-Za-z0-9_])/.test(body)) continue;
    const title = body.match(/title=\{<T\s+en="([^"]*)"/)?.[1]
      ?? body.match(/title=\{<T\s+en=\{"([^"]*)"/)?.[1] ?? "(untitled)";
    const line = src.slice(0, src.indexOf(part)).split("\n").length;
    fail(`${file}:${line} the "${title}" widget has no empty state`,
      "With nothing logged it draws a zero or an empty box.",
      "DIET.md section 24: a sentence saying what it will show and when,",
      "out of section 9's unlock table. <Waiting en= bn= /> is that sentence.");
  }
}

/* ------------------------------------------------------------
   4. The glossary, both halves

   `glossary.tsx` opens by saying "every entry is linked to from
   the first use of its term, and a definition somebody arrives
   at by anchor has to be findable on its own". Two ways that
   stops being true and they are different failures: an entry
   nothing links to is a page nobody reaches, and a term used and
   never defined is section 23's whole complaint, a tool written
   for people who already know.

   The vocabulary is read out of DIET.md rather than retyped,
   for the reason at the top of this file.
   ------------------------------------------------------------ */

const glossary = read(`${COMPONENTS}/glossary.tsx`);
const entries = [...glossary.matchAll(/id:\s*"([\w-]+)",\s*en:\s*"([^"]*)"/g)]
  .map((m) => ({ id: m[1], en: m[2] }));

if (!entries.length) fail(`${COMPONENTS}/glossary.tsx defines no terms`);

const everywhere = filesUnder("next/components").concat(filesUnder("next/app"))
  .map((f) => read(f)).join("\n");

/* A LINK IS EITHER THE ADDRESS OR THE COMPONENT THAT BUILDS IT.
   `<Term id="bmi">` in `glossary.tsx` writes the href out of the
   id, so the literal `diet/glossary#bmi` appears nowhere and this
   rule read every entry as unlinked. Reading only the raw string
   would push the tool back to writing addresses out by hand,
   which is the thing `Term` exists to stop.

   Both spellings count, and a `<Term>` naming an id the glossary
   does not define is its own failure below. */
const termUses = new Set(
  [...everywhere.matchAll(/<Term\s[^>]*\bid=["']([a-z0-9-]+)["']/g)].map((m) => m[1]),
);

for (const entry of entries) {
  if (everywhere.includes(`diet/glossary#${entry.id}`)) continue;
  if (termUses.has(entry.id)) continue;
  fail(`the glossary defines "${entry.en}" and nothing links to it`,
    `nothing under next/ links it, by address or by <Term id="${entry.id}">`,
    "glossary.tsx: every entry is linked to from the first use of its term.",
    "It is a table rather than prose for exactly that reason.");
}

/* And the other way round: a `<Term>` pointing at nothing is a
   dotted underline that takes a reader to the top of a page. */
const defined = new Set(entries.map((e) => e.id));
for (const id of termUses) {
  if (defined.has(id)) continue;
  fail(`<Term id="${id}"> names no glossary entry`,
    `glossary.tsx defines ${[...defined].join(", ")}`,
    "A first use linked to a definition that is not there lands a",
    "reader at the top of the glossary with nothing highlighted.");
}

/* Section 23's list, read out of the paragraph that states it.
   The terms are written as prose there, so this takes the
   sentence after the bold line and splits it: a term added to
   that list is a term this check starts asking about, with
   nobody having to come here. */
const diet = read("DIET.md");
const listed = diet
  .split("**A glossary, in both, linked from the first use of each term.**")[1]
  ?.split("A tool that uses those words")[0] ?? "";

if (!listed.trim()) {
  fail("DIET.md section 23 no longer states the glossary's terms",
    "This check reads them out of the sentence after the bold line.");
}

const terms = listed.replace(/\s+/g, " ").split(/[,.]/)
  .map((t) => t.trim().replace(/^the\s+/i, ""))
  .filter(Boolean);

/* What a READER meets, so comments are out: a term explained to
   the next programmer in a block comment is not a term put in
   front of somebody. The glossary is out too, which is where the
   words are supposed to be. */
const prose = TOOL_FILES.filter((f) => !f.endsWith("glossary.tsx"))
  .map((f) => uncommented(SOURCE.get(f) as string)).join("\n");

for (const term of terms) {
  const used = new RegExp(`\\b${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`)
    .test(prose);
  if (!used) continue;
  const defined = entries.some((e) => new RegExp(`\\b${term}\\b`, "i").test(e.en)
    || new RegExp(`\\b${term}\\b`, "i").test(e.id));
  if (defined) continue;
  fail(`the pages use "${term}" and the glossary does not define it`,
    "DIET.md section 23 names it as one of the words this tool must define.",
    `Add a TERMS entry in ${COMPONENTS}/glossary.tsx, in both languages.`);
}

/* ------------------------------------------------------------
   5. The fixed sets

   The journal tags are section 11's twelve, chosen because they
   recur, and short because a list of forty tags is a list nobody
   uses. The marks are the four the migration names beside the
   column.

   NEITHER HAS A CHECK CONSTRAINT, which is why this is here
   rather than in Postgres: `marks text[]` and `tags text[]` take
   whatever they are given. So a thirteenth tag is not a 400, it
   is a value in the array that nothing counts and nothing draws,
   and the page looks finished.
   ------------------------------------------------------------ */

const tagBlock = diet
  .split("plus a short fixed set of tags:")[1]?.split("\n\n")
  .find((para) => para.includes("`")) ?? "";
const wanted = [...tagBlock.matchAll(/`([^`]+)`/g)].map((m) => m[1].toLowerCase());

if (!wanted.length) {
  fail("DIET.md section 11 no longer lists the journal tags",
    "This check reads them out of the paragraph after 'a short fixed set of tags'.");
} else {
  const have = TAGS.map((t) => t.en.toLowerCase());
  for (const tag of wanted) {
    if (!have.includes(tag)) {
      fail(`DIET.md section 11 has the tag "${tag}" and shared/diet.ts does not`,
        `TAGS holds: ${have.join(", ")}`);
    }
  }
  for (const tag of have) {
    if (!wanted.includes(tag)) {
      fail(`shared/diet.ts has a tag DIET.md section 11 does not: "${tag}"`,
        "The set is fixed. A thirteenth tag is a decision rather than a tweak,",
        "and it goes in DIET.md first, because the plan is what says it is fixed.");
    }
  }
}

const migration = migrationFiles.map((f) => read(`${MIGRATIONS}/${f}`)).join("\n");
const markComment = migration.match(/((?:'[a-z-]+',\s*)+'[a-z-]+')\.\s*A marked day/);
const markNames = [...(markComment?.[1].matchAll(/'([a-z-]+)'/g) ?? [])].map((m) => m[1]);

if (!markNames.length) {
  fail("no migration names the marks beside diet_days.marks any more",
    "The column has no CHECK constraint, so that comment is the only",
    "statement of what may be in it, and this check reads it.");
} else {
  const drawn = MARKS.map((m) => m.id);
  for (const mark of markNames) {
    if (!drawn.includes(mark)) {
      fail(`the migration names the mark "${mark}" and MARKS does not draw it`,
        `MARKS holds: ${drawn.join(", ")}`);
    }
  }
  for (const mark of drawn) {
    if (!markNames.includes(mark)) {
      fail(`MARKS writes "${mark}" and the migration does not name it`,
        `the migration names: ${markNames.join(", ")}`,
        "`marks` has no CHECK constraint, so this saves and nothing complains:",
        "the value sits in the array and every reading of it skips the row.");
    }
  }
}

/* ------------------------------------------------------------
   6. Every diet_* column is reached

   The one that stops the schema drifting away from the tool. A
   column nothing can fill breaks nothing: the migration is
   correct, the API layer maps it, every check passes, and the
   feature it was added for is missing where nobody can see it is
   missing. That is this file's opening failure wearing the
   schema's hat.

   UNUSED is what is genuinely still to be built, keyed by
   column, each naming the DIET.md section that will build it. A
   whole table that has no caller is keyed `<table>.*`, and that
   wildcard CANNOT go stale silently: the moment the table's
   writer is imported anywhere the exemption fails as stale and
   every one of its columns is asked individually.

   `debt` is not a reason. A column added for a feature nobody
   has started is debt, and it goes in the same commit as the
   feature or it goes out of the migration.
   ------------------------------------------------------------ */

const UNUSED: Record<string, string> = {
  /* The profile. Four of these are the onboarding questions and
     the rest are one feature each. */
  "diet_profile.units": "section 22, stone and pounds and feet and inches offered beside metric",
  "diet_profile.activity": "section 26, the onboarding questions, which is what asks it",
  "diet_profile.goal_weight_kg": "section 5, for the reader who names one anyway",
  "diet_profile.board": "section 24, the reader arranges the widgets",

  /* The day. The tape's other three and the fields no form
     offers yet. */
  "diet_days.sodium_mg": "section 15, the day's rollup of what the entries already carry",
  "diet_days.chest_cm": "section 2, the rest of the measurement set",
  "diet_days.thigh_cm": "section 2, the same",
  "diet_days.arm_cm": "section 2, the same",

  /* What was eaten. */
  "diet_entries.fetched_on": "section 12, so a stale figure can be found and refreshed",

  /* The phase a reader is on. `/tools/diet/keto` starts one and
     ends one, and it ends one by STARTING THE NEXT: a phase runs
     until the next begins, which is the end `stretches()` already
     reads, so a second statement of the same end would be one too
     many. `ended_on` is for a phase that ends with nothing after
     it, and that needs an `endPhase()` in `diet-api.ts`. */
  "diet_phases.ended_on": "section 10, a phase that ends with nothing after it",

  /* Two tables with no caller at all. */
  /* THE WILDCARD IS GONE, and its going is what this check is
     for. `diet_foods` had no writer at all, so one exemption
     covered the table; the recipe maker landed a writer and the
     exemption went stale in the same commit, which is the check
     asking about every column one at a time instead. Four of
     them are still nobody's. */
  "diet_foods.price": "section 17, what a dish you cooked yourself actually cost",
  "diet_foods.currency": "section 17, the same figure in taka or in pounds",
  "diet_foods.priced_on": "section 17, and an undated price is worse than none",
  "diet_foods.fetched_on": "section 12, so a stale figure can be found and refreshed deliberately",
};

const used = new Set<string>();

/** The columns of one table, in the order the migration declares
    them. Deliberately dumb, and the same shape `check-rows.ts`
    reads `aab/schema.sql` with: the block between the
    parentheses, first word of every line that is not a
    constraint. */
function columnsOf(table: string): string[] {
  const re = new RegExp(`create table if not exists public\\.${table} \\(([\\s\\S]*?)\\n\\);`, "i");
  const block = migration.match(re)?.[1];
  if (!block) return [];
  return block.split("\n")
    .map((l) => l.replace(/--.*$/, "").trim())
    .filter(Boolean)
    .map((l) => l.split(/[\s(]+/)[0])
    .filter((w) => /^[a-z_]+$/.test(w)
      && !["primary", "foreign", "unique", "check", "constraint"].includes(w));
}

/** Housekeeping. The database sets all four and no page ever
    should, so asking whether the tool names them would report
    twenty-four failures that are the schema working. */
const KEPT_BY_POSTGRES = new Set(["id", "user_id", "created_at", "updated_at"]);

const api = uncommented(read(API));

/** `column: <something>.<name>` in `fromDay` and in the entry
    row: the name a caller has to use to fill that column. Where
    there is no mapping the column IS the name, which is how the
    profile and the reader's own foods are written. */
const mapping = new Map<string, string>();
for (const m of api.matchAll(/(\w+):\s*[A-Za-z_$][\w$]*\.(\w+)/g)) mapping.set(m[1], m[2]);

/** Every function in `diet-api.ts`, exported or not, with its
    body. Not the exports alone: `saveDay` hands the request to
    `writeDay`, which is private because the queue has to be able
    to retry without queueing again, and a check that read only
    the exports would have declared `diet_days` unwritable. */
const functions = [...api.matchAll(/^(export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/gm)]
  .map((m) => {
    const rest = api.slice(m.index ?? 0);
    const end = rest.search(/\n\}/);
    return { name: m[2], body: rest.slice(0, end < 0 ? rest.length : end) };
  });

/** Every name the tool imports out of `diet-api.ts`, so a table
    whose writer nothing calls is reported once rather than
    column by column. */
const imported = new Set<string>();
for (const file of filesUnder("next/components").concat(filesUnder("next/app"), filesUnder("next/lib"))) {
  if (file === API) continue;
  for (const m of read(file).matchAll(/import\s*\{([^}]*)\}\s*from\s*"[^"]*diet-api"/g)) {
    for (const name of m[1].split(",")) {
      imported.add(name.replace(/^\s*type\s+/, "").split(/\s+as\s+/)[0].trim());
    }
  }
}

/** What the tool can actually reach: the imported names, and
    whatever they call, followed through. */
const live = new Set<string>();
const follow = (name: string): void => {
  if (live.has(name)) return;
  live.add(name);
  const fn = functions.find((f) => f.name === name);
  if (!fn) return;
  for (const other of functions) {
    if (other.name !== name && new RegExp(`\\b${other.name}\\s*\\(`).test(fn.body)) {
      follow(other.name);
    }
  }
};
imported.forEach(follow);

/** A declaration is not a value. `Day` in `shared/diet.ts` names
    every day column as an optional property, so a corpus that
    kept the interfaces would report every unfilled column as
    filled: the type is exactly what makes an empty column look
    finished. */
const withoutTypes = (src: string): string => uncommented(src)
  .replace(/\b(?:export\s+)?interface\s+\w+[^{]*\{[\s\S]*?\n\}/g, " ")
  .replace(/\b(?:export\s+)?type\s+\w+\s*=[\s\S]*?\n\};?/g, " ");

/** The `shared/` functions that BUILD one of these rows, and
    nothing else out of those files. `loggedFrom()` in
    `shared/foods.ts` is what puts the macros on an entry, so a
    corpus of the components alone calls that column unfilled;
    the whole file is worse, because `meal:` is also a word in
    that file's table of portion names, and a units table is not
    somebody logging a dinner. A function whose return type is
    one of the row shapes is the honest middle. */
const rowBuilders = (src: string): string => {
  const out: string[] = [];
  for (const m of src.matchAll(/function\s+\w+\s*\([\s\S]*?\)\s*:\s*([^{;]*)\{/g)) {
    if (!/\b(Entry|Day|Profile|Phase)\b/.test(m[1])) continue;
    const rest = src.slice(m.index ?? 0);
    const end = rest.search(/\n\}/);
    out.push(rest.slice(0, end < 0 ? rest.length : end));
  }
  return out.join("\n");
};

/** What supplies a value: an object literal key, a shorthand, or
    an assignment. A text search rather than anything cleverer,
    for the reason `check-rows.ts` gives: a page that fills a
    column some other way will not be caught, and a page that
    never mentions the field will be, which is the way it
    actually happens. */
const sharedModules = [...new Set(
  TOOL_FILES.flatMap((f) => [...(SOURCE.get(f) as string)
    .matchAll(/from\s+"@reiad\/shared\/(\w+)"/g)].map((m) => `shared/${m[1]}.ts`)),
)].sort();

const supplied = [
  ...TOOL_FILES.map((f) => withoutTypes(SOURCE.get(f) as string)),
  ...sharedModules.map((f) => rowBuilders(withoutTypes(read(f)))),
].join("\n");
const supplies = (name: string): boolean =>
  new RegExp(`\\b${name}\\s*:|\\b${name}\\s*=[^=]|[,{]\\s*${name}\\s*[,}]`).test(supplied);

const tables = [...migration.matchAll(/create table if not exists public\.(\w+)/gi)]
  .map((m) => m[1]);
let columns = 0;

for (const table of tables) {
  /* Whoever POSTs to this table. A table with no writer in the
     API layer, or one whose writer nothing reaches, cannot have
     a row in it at all, whatever its columns say. */
  const writers = functions
    .filter((f) => f.body.includes(table) && /method:\s*"POST"/.test(f.body))
    .map((f) => f.name);
  const reachable = writers.some((fn) => live.has(fn));
  const whole = `${table}.*`;

  if (!reachable) {
    if (whole in UNUSED) {
      used.add(whole);
      continue;
    }
    fail(`nothing can write a row of ${table}`,
      writers.length
        ? `${writers.join(", ")} in ${API} is reached by nothing`
        : `${API} has no writer for it at all`,
      `Either build it, or name ${whole} in UNUSED with the DIET.md section`,
      "that will.");
    continue;
  }

  if (whole in UNUSED) {
    fail(`the UNUSED exemption ${whole} has gone stale`,
      `${writers.filter((fn) => live.has(fn)).join(", ")} is reached now,`,
      "so the table is built. Take the line out and let its columns be asked",
      "one at a time.");
    used.add(whole);
  }

  for (const column of columnsOf(table)) {
    if (KEPT_BY_POSTGRES.has(column)) continue;
    columns += 1;
    const key = `${table}.${column}`;
    const name = mapping.get(column) ?? column;
    const reached = new RegExp(`\\b${column}\\b`).test(api) && supplies(name);

    if (key in UNUSED) {
      used.add(key);
      if (reached) {
        fail(`the UNUSED exemption ${key} has gone stale`,
          "The tool fills it now. Take the line out.");
      }
      continue;
    }
    if (reached) continue;

    fail(`nothing in the tool can fill ${key}`,
      name === column
        ? `no file under ${COMPONENTS} or ${ROUTES} supplies ${column}`
        : `${API} maps it from ${name}, and nothing supplies a ${name}`,
      "Either fill it, or name it in UNUSED with the DIET.md section that will.");
  }
}

for (const key of Object.keys(UNUSED)) {
  if (used.has(key)) continue;
  fail(`the UNUSED exemption ${key} names nothing`,
    "The migration has no such column or table. An exemption that has",
    "outlived what it exempted reads as covering something and covers nothing.");
}

/* ------------------------------------------------------------
   7. The honest sentence is said once, on the goal page

   Section 6 puts it in exactly one place: "on the goal page,
   once, where the projection ends". Both halves are the rule.

   Said TWICE it stops being a fact and becomes a slogan, and
   said on a page where nobody is looking at how long this will
   take it is a scare rather than the reason maintenance is a
   built phase here. It is also the one sentence in this tool
   that argues for the tool, which is what makes it the one most
   likely to get copied on to a second panel by somebody who
   liked it.
   ------------------------------------------------------------ */

const REGAIN_EN = /strongest predictor of not doing so is continuing to weigh/;
const REGAIN_BN = /লক্ষ্যে পৌঁছানোর পরেও/;

const saysRegain = TOOL_FILES
  .filter((f) => REGAIN_EN.test(uncommented(SOURCE.get(f) as string)));
const saysRegainBn = TOOL_FILES
  .filter((f) => REGAIN_BN.test(uncommented(SOURCE.get(f) as string)));

if (saysRegain.length !== 1) {
  fail(saysRegain.length
    ? `what happens after a goal is reached is said in ${saysRegain.length} files`
    : "nothing says what happens after a goal is reached",
  saysRegain.length ? saysRegain.join(", ") : "",
  "DIET.md section 6: on the goal page, ONCE, where the projection ends.",
  "Most people regain a meaningful part of what they lose, and the strongest",
  "predictor of not doing so is continuing to weigh and log afterwards.");
} else if (!saysRegain[0].endsWith("goal-panel.tsx")) {
  fail(`it is on ${relative(COMPONENTS, saysRegain[0])} rather than the goal page`,
    "DIET.md section 6 puts it where the projection ends. Anywhere else it is",
    "a scare rather than the reason holding is a built phase here.");
} else if (saysRegainBn.length !== 1) {
  fail("what happens after a goal is reached is said in English only",
    "Section 23: the switch changes everything on the page, and this is the",
    "one sentence in the tool that argues for the tool.");
}

/* ------------------------------------------------------------
   8. The floors are the module's, and nothing retypes a formula

   Section 5's floors are the one part of this tool that can hurt
   somebody, and there are three ways they stop being true with
   every page still rendering.

   The first is that nothing pins them. `scripts/diet.test.ts` is
   what asserts each one from the wrong side, so this asks that
   the test still names every one, and it reads the list of them
   out of `target()`'s own body rather than keeping one.

   The second is CLAUDE.md's opening rule wearing this section's
   hat: a page that TELLS a reader a floor and types the number
   into the sentence is right on the day it is written. Change
   `floorKcal` and the sentence goes on saying 1200 for ever, on
   the one screen in the tool whose whole job is to say that the
   tool changed your number. The `surplus` line already
   interpolates its constant and is what the rest have to be.

   The third is a route that recomputes a formula instead of
   importing it. `body.tsx` opens by saying nothing there is
   recomputed and this is what holds it: every one-expression
   formula `shared/diet.ts` exports is reduced to its SHAPE, the
   names taken out and the numbers left in, and a page carrying
   that shape has a BMI or a Katch written out by hand.
   ------------------------------------------------------------ */

const dietSrc = read("shared/diet.ts");
const dietTest = read("scripts/diet.test.ts");

/** One exported function's body, brace-balanced.

    Not the `\n}` the API layer above is read with, and the
    difference matters here: `target()` takes an object literal
    written over six lines, so the first line closing a brace is
    the end of its ARGUMENT and the body would come back empty
    with nothing in this file noticing. */
function bodyOf(src: string, name: string): string {
  const at = src.search(new RegExp(`^export function ${name}\\s*\\(`, "m"));
  if (at < 0) return "";
  let depth = 0;
  let i = src.indexOf("(", at);
  for (; i < src.length; i += 1) {
    if (src[i] === "(") depth += 1;
    else if (src[i] === ")") {
      depth -= 1;
      if (depth === 0) break;
    }
  }
  return blockAt(src, i);
}

/** The block one declaration opens, brace-balanced. An
    interpolation carries braces of its own, which is why this
    counts rather than looking for the next closing line. */
function blockAt(src: string, from: number): string {
  const open = src.indexOf("{", from);
  if (open < 0) return "";
  let depth = 0;
  for (let i = open; i < src.length; i += 1) {
    if (src[i] === "{") depth += 1;
    else if (src[i] === "}") {
      depth -= 1;
      if (depth === 0) return src.slice(open, i + 1);
    }
  }
  return src.slice(open);
}

/** The numbers behind one name in `shared/diet.ts`. A constant
    is its own value and a `Range` is its three; a floor that
    depends on the reader, which is `floorKcal(sex)`, is every
    number its one-line body can return, because calling it would
    mean this file writing out the `Sex` union and that is a
    second copy of a vocabulary. */
const exported: Record<string, unknown> = { ...DIET };
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;
function valuesOf(name: string): number[] {
  const value = exported[name];
  if (typeof value === "number") return [value];
  if (isRecord(value)) {
    return Object.values(value).filter((v): v is number => typeof v === "number");
  }
  const line = dietSrc.match(new RegExp(`export const ${name} = [^;]*;`))?.[0] ?? "";
  return [...line.matchAll(/(?<![\w.])\d+(?:\.\d+)?/g)].map((m) => Number(m[0]));
}

const targetBody = bodyOf(dietSrc, "target");

/** THE FLOORS ARE WHAT `target()` CLAMPS WITH, read out of it. A
    sixth bound added there is asked about here with nobody
    having to come to this file, which is the difference between
    a rule and a habit. */
const clamping = uncommented(targetBody);
const floorNames = [...new Set([
  ...[...clamping.matchAll(/\b([A-Z][A-Z0-9_]{2,})\b/g)].map((m) => m[1]),
  ...[...clamping.matchAll(/\b([a-z][A-Za-z0-9]*Kcal)\s*\(/g)].map((m) => m[1]),
])].sort();

/** And the bounds' own names, which is the union `target()`
    reports in `floors`. */
const floorHits = [...(dietSrc.match(/export type FloorHit =([^;]*);/)?.[1] ?? "")
  .matchAll(/"([a-z]+)"/g)].map((m) => m[1]);

if (!floorNames.length || !floorHits.length) {
  fail("check-diet cannot read the floors out of shared/diet.ts",
    "Both the constants target() clamps with and the FloorHit union are read",
    "from its source, and one of the two came back empty. Fix the reader here",
    "rather than deleting the question.");
}

for (const name of floorNames) {
  if (dietTest.includes(name)) continue;
  fail(`scripts/diet.test.ts does not assert ${name}`,
    "target() clamps with it and nothing pins it, so it can be loosened in one",
    "character with every check still green. DIET.md section 33 asks for every",
    "floor asserted from the wrong side.");
}
for (const hit of floorHits) {
  if (dietTest.includes(`"${hit}"`)) continue;
  fail(`scripts/diet.test.ts does not assert the bound "${hit}"`,
    "target() can report it and no test drives it there, so the clamp could stop",
    "happening and a reader would simply never be told their number was changed.");
}

/** Every number a floor is. A name this cannot resolve is a
    failure rather than a skip: a floor whose value nothing here
    knows is a floor the sentence rule below would pass over in
    silence, which is the shape of the bug it exists to catch. */
const floorValues = new Map<number, string>();
for (const name of floorNames) {
  const numbers = valuesOf(name);
  if (!numbers.length) {
    fail(`check-diet cannot read what ${name} is worth`,
      "target() clamps with it and this resolves a constant, a Range or a"
      + " one-line function of the reader.",
      "Widen valuesOf() here. Skipping it would leave the floor unwatched with",
      "nothing saying so.");
  }
  for (const value of numbers) floorValues.set(value, name);
}

const BN_DIGIT = new Map([...bnNum("0123456789")].map((d, i) => [d, String(i)]));

/** Every number a sentence states, in either script, with
    whether a percent sign follows it.

    Tokens rather than a substring search: 1 is one floor and
    1200 is another, and finding the first inside the second is
    how a check reports the sentence that is right. The percent
    is what keeps a rate floor honest without catching every "1
    cup": a rate is a percentage of bodyweight and is written as
    one. */
interface Said { value: number; percent: boolean }
function numbersIn(text: string): Said[] {
  const said: Said[] = [];
  for (const m of text.matchAll(/(?<![\w.])(\d+(?:\.\d+)?)(\s*%)?/g)) {
    said.push({ value: Number(m[1]), percent: Boolean(m[2]) });
  }
  for (const m of text.matchAll(/([০-৯]+(?:\.[০-৯]+)?)(\s*%)?/g)) {
    const latin = [...m[1]].map((c) => BN_DIGIT.get(c) ?? c).join("");
    said.push({ value: Number(latin), percent: Boolean(m[2]) });
  }
  return said.filter((n) => Number.isFinite(n.value));
}

/** The table that tells a reader which bound bound them, found
    by its type rather than by its file: it is the one thing in
    the tool keyed by `FloorHit`, and a second copy of it would
    be found here too. */
let floorLines = 0;
for (const file of TOOL_FILES) {
  const src = uncommented(SOURCE.get(file) as string);
  const at = src.indexOf("Record<FloorHit");
  if (at < 0) continue;
  const rest = src.slice(at);
  const end = rest.search(/\n\};/);
  const table = rest.slice(0, end < 0 ? rest.length : end);

  for (const hit of floorHits) {
    const from = table.search(new RegExp(`\\n\\s*${hit}:\\s*\\{`));
    if (from < 0) continue;
    floorLines += 1;
    /* `${MAX_SURPLUS_KCAL}` is the fix, so what an interpolation
       fills in comes out before the numbers are counted.
       `unfilled()` under question 11 is the balanced one and this
       needs it for the same reason: an interpolation here holds a
       conditional with braces of its own. */
    const said = unfilled(blockAt(table, from));
    /* Grouped by the constant rather than by the number, because
       one floor is two numbers on this line and one sentence is
       said in two scripts: four failures for one fix. */
    const typed = new Map<string, number[]>();
    for (const n of numbersIn(said)) {
      const owner = floorValues.get(n.value);
      /* A floor under 2 is a percentage of bodyweight, and it is
         only that where a percent sign says so: without this the
         rate cap of 1 matches "1 cup" in a sentence that is
         perfectly correct. */
      if (!owner || (n.value < 2 && !n.percent)) continue;
      const had = typed.get(owner) ?? [];
      if (!had.includes(n.value)) typed.set(owner, [...had, n.value]);
    }
    for (const [owner, numbers] of typed) {
      fail(`${file}: the "${hit}" line writes ${owner} out as a number`,
        `it says ${numbers.sort((a, b) => a - b).join(" and ")}`,
        `and that is what ${owner} holds today rather than what it will hold`,
        "tomorrow. This is the one sentence in the tool whose whole job is to say",
        "that the tool changed your number, which makes it the worst place in the",
        "tool for a number that cannot change with it. Draw it from the constant",
        "the way the surplus line already does, in both scripts.");
    }
  }
}
if (!floorLines) {
  fail("nothing in the diet tool is keyed by FloorHit any more",
    "target() reports every bound it hit and something has to put those in front",
    "of a reader: a silent clamp is a lie of omission. DIET.md section 5.");
}

/* ---- and no page writes a formula out a second time ---- */

/** One expression with its names taken out and its numbers left
    in, so two spellings of the same arithmetic reduce to one
    string. */
const shapeOf = (expression: string): string => expression
  .replace(/"[^"]*"/g, "S")
  .replace(/\b[A-Za-z_$][\w$.]*\s*\(/g, "F(")
  .replace(/\b[A-Za-z_$][\w$.]*\b/g, "_")
  .replace(/\s+/g, "");

const formulas = new Map<string, string>();
for (const m of dietSrc.matchAll(/export const (\w+) = \([^)]*\)(?:\s*:\s*[^=]*?)?=>\s*([\s\S]*?);\n/g)) {
  const expression = m[2].trim();
  if (expression.startsWith("{")) continue;
  const shape = shapeOf(expression);
  const digits = (shape.match(/\d/g) ?? []).length;
  /* Three digits is the line between a formula and a phrase.
     `whtr` reduces to `_/_` and `estimatedBurn` to `_*_`, both of
     which are in half the files on this site and neither of which
     is worth a name. */
  if (digits >= 3 && (/[-+*/%]/.test(shape) || /\d{3}/.test(shape))) formulas.set(m[1], shape);
}

if (!formulas.size) {
  fail("check-diet can no longer read a formula out of shared/diet.ts",
    "The one-expression exports are what the pages are compared against.");
}

for (const file of TOOL_FILES) {
  const shape = shapeOf(uncommented(SOURCE.get(file) as string));
  for (const [name, formula] of formulas) {
    if (!shape.includes(formula)) continue;
    fail(`${file} writes ${name}() out rather than importing it`,
      `it carries the shape ${formula}`,
      "A page with its own copy of an equation is a page that will disagree with",
      "shared/diet.ts, and scripts/diet.test.ts is then testing the copy nobody",
      `sees. Import { ${name} } from "@reiad/shared/diet".`);
  }
}

/* ------------------------------------------------------------
   9. The Asian cut-offs are used whenever ancestry says so

   Section 2 calls this the single most important honest detail
   in the whole tool, and it costs one table. `BMI_CUTS` is that
   table and `bmiBand()` is the only thing that should read it.

   The failure is quiet in the worst way: a page that decides a
   band on the general cut-offs tells a South Asian reader they
   are in the healthy range where their own health service would
   not, and the page renders, the arithmetic is right, and
   nothing in the tool disagrees with it. Four shapes of it: a
   fixed ancestry handed to `bmiBand()` or read off `BMI_CUTS`; a
   body built with a literal ancestry rather than the reader's; a
   cut-off written into a comparison, which is `bmiBand()`
   retyped with one of the two tables missing; and a page that
   draws a band without going through `bmiBand()` at all.

   And section 2's own second half: the page says WHICH set it
   used. A band with no cut-off named beside it is one word for
   two readers who are owed different ones.
   ------------------------------------------------------------ */

const ancestries = Object.keys(BMI_CUTS);

/** Every cut-off, and what it is, so a number both sets share is
    reported once. */
const cutNames = new Map<number, string[]>();
for (const [place, cuts] of Object.entries(BMI_CUTS)) {
  for (const [band, cut] of Object.entries(cuts)) {
    cutNames.set(cut, [...(cutNames.get(cut) ?? []), `${band} for "${place}"`]);
  }
}

/** The band vocabulary is in `words.ts`, keyed by `bmiBand()`'s
    own tokens, which is what makes indexing it the signature of
    a page that draws a band. Both names are checked to exist,
    because a rename would otherwise leave this question asking
    about nothing and reporting that everything is fine. */
const BAND_TABLE = "BAND_WORDS";
const CUTS_TABLE = "CUTS_WORDS";
const words = read(`${COMPONENTS}/words.ts`);
for (const table of [BAND_TABLE, CUTS_TABLE]) {
  /* `export const NAME` or `NAME` in an export list, because the
     strings themselves moved to `shared/diet-words.ts` so the
     Android app draws the same bands: what this question needs is
     that the NAME still resolves here, which a re-export does. */
  if (new RegExp(`export const ${table}\\b`).test(words)) continue;
  if (new RegExp(`\\bas ${table}\\s*,|\\bas ${table}\\s*\\}|^\\s*${table}\\s*,`, "m").test(words)) continue;
  fail(`${COMPONENTS}/words.ts no longer exports ${table}`,
    "It is what a page drawing a BMI band is recognised by below, and what says",
    "which cut-offs were used. Point this question at the new name.");
}
let banded = 0;

for (const file of TOOL_FILES) {
  const src = uncommented(SOURCE.get(file) as string);

  for (const place of ancestries) {
    if (new RegExp(`bmiBand\\([^)]*["']${place}["']`).test(src)) {
      fail(`${file} hands bmiBand() a fixed "${place}"`,
        "DIET.md section 2: the threshold follows the reader, and a fixed one is",
        "the whole of what this table exists to prevent.");
    }
    if (new RegExp(`BMI_CUTS(\\.${place}\\b|\\[\\s*["']${place}["']\\s*\\])`).test(src)) {
      fail(`${file} reads BMI_CUTS.${place} by name`,
        "BMI_CUTS[ancestry] is the table's whole job. Reading one set by name is",
        "the other set never being used.");
    }
    if (new RegExp(`\\bancestry:\\s*["']${place}["']`).test(src)) {
      fail(`${file} builds a body with ancestry fixed at "${place}"`,
        "A Body carries the reader's answer. `profile.ancestry ?? \"general\"` is",
        "the default for somebody who has not been asked yet; a literal is every",
        "reader getting one set of cut-offs whatever they answered.");
    }
  }

  /* A cut-off in a comparison is bmiBand() written out with one
     of the two tables missing, and it is the shape that carries
     no clue about ancestry at all.

     Only in a file that says BMI somewhere, because 25 and 30
     are also a number of days and a number of grams. No file in
     this tool compares against any of the five today, so the
     rule is as wide as it can be without reaching those. */
  if (/\bbmi\b/i.test(src)) {
    for (const [cut, what] of cutNames) {
      const token = String(cut).replace(".", "\\.");
      const re = new RegExp(`(?:[<>]=?|={2,3}|!==?)\\s*${token}(?![\\d.])`
        + `|(?<![\\d.\\w])${token}\\s*(?:[<>]=?|={2,3}|!==?)`);
      if (!re.test(src)) continue;
      fail(`${file} compares against ${cut}, which is a BMI cut-off`,
        `${cut} is ${what.join(" and ")}, and the other set has a different one.`,
        "bmiBand(value, ancestry) is the only thing that should know either",
        "number: a comparison written out here is one set of cut-offs applied to",
        "every reader, which is what section 2 exists to stop.");
    }
  }

  if (!new RegExp(`\\b${BAND_TABLE}\\s*\\[`).test(src)) continue;
  banded += 1;
  if (!/\bbmiBand\s*\(/.test(src)) {
    fail(`${file} draws a BMI band without calling bmiBand()`,
      "Something else in that file decided which band this is, and whatever it",
      "was did not take the reader's ancestry with it. That is the failure",
      "section 2 calls the most important honest detail in the tool.");
  }
  if (!new RegExp(`\\b${CUTS_TABLE}\\b`).test(src) && !/\bancestry\s*===/.test(src)) {
    fail(`${file} draws a BMI band and never says which cut-offs it used`,
      "DIET.md section 2: the page says which set it is using and why. A band on",
      `its own is one word for two readers who are owed different ones, and`,
      `${CUTS_TABLE} in words.ts is the sentence that says which.`);
  }
}

/* ------------------------------------------------------------
   10. The portion library: a source, a dated price, and a state

   `shared/foods.ts` states all three at the top of itself and
   nothing held any of them.

   A SOURCE, because a number with no source is a number this
   tool invented, and section 12 puts that label in front of the
   reader on every figure.

   A DATE ON A PRICE, because section 17 is blunt about it: an
   undated price is worse than none. `price`, `currency` and
   `pricedOn` are three parts of one fact, so a row carries all
   three or none. A row in both kitchens carries none, because
   one number cannot be two currencies, and a row in one kitchen
   carries them, because the cost per gram of protein table is
   the whole reason section 17 exists and a row with no price
   falls silently out of it.

   A STATE, which is the one that has already gone wrong here:
   raw rice is 365 kcal per 100 g and cooked is about 130,
   section 14 calls that the most common single error in the
   whole of calorie counting, and the swap finder offered one for
   the other because both were tagged the same way. `raw` is what
   the arithmetic reads and THE NAME is what the reader reads, so
   a row in scope carries both, in both languages. The nouns come
   out of section 14's own sentence.
   ------------------------------------------------------------ */

const nouns = diet.replace(/\s+/g, " ")
  .match(/\*\*Every ([^*]*?) entry in the library/)?.[1] ?? "";
const stateNouns = nouns.split(/,| and /).map((n) => n.trim()).filter(Boolean);

if (stateNouns.length < 2) {
  fail("DIET.md section 14 no longer says which entries name their state",
    "This reads the nouns out of the sentence beginning 'Every ... entry in the",
    "library', so that a fifth noun added there is asked about here.");
}

/** A row that names no state because there is no second number
    to confuse the first with. Keyed by id with the reason, and
    it fails when it goes stale: an id that has gone, or a row
    that has grown the flag, is an exemption covering nothing. */
const NO_STATE: Record<string, string> = {
  "muri-cup": "puffed rice, which nobody buys dry and cooks in water, so there is"
    + " no second weight to confuse this one with. The same ground a slice of"
    + " bread and a roti carry no flag on",
};

const EN_STATE = /\b(raw|dry|dried|cooked|boiled|uncooked)\b/i;
const BN_STATE = /(কাঁচা|রান্না|সিদ্ধ|সেদ্ধ|শুকনো|ভেজানো)/;
const exempted = new Set<string>();
let pricedRows = 0;
let statedRows = 0;

for (const row of FOODS) {
  if (!row.source?.trim()) {
    fail(`the portion library row ${row.id} carries no source`,
      "A number with no source is a number this tool invented, and section 12",
      "shows that label beside every figure a reader is given.");
  }

  const given = ["price", "currency", "pricedOn"]
    .filter((k) => row[k as "price" | "currency" | "pricedOn"] !== undefined);
  if (given.length && given.length < 3) {
    fail(`the portion library row ${row.id} carries part of a price`,
      `it has ${given.join(" and ")} and not the rest`,
      "price, currency and pricedOn are three parts of one fact: all three or",
      "none. Section 17: a price is a fact with a date on it.");
  }
  if (row.pricedOn && !/^\d{4}-\d{2}$/.test(row.pricedOn)) {
    fail(`the portion library row ${row.id} has a price date of ${row.pricedOn}`,
      "It is YYYY-MM, which is what section 17 greys a figure by once it is more",
      "than a few months old. A date nothing can compare is an undated price.");
  }
  if (row.place.length === 1) {
    if (row.price === undefined) {
      fail(`the portion library row ${row.id} is priced in neither currency`,
        `it belongs to ${row.place[0]} alone, and section 17's cost per gram of`,
        "protein table is built out of these figures: a row with no price falls",
        "out of it without anything saying so.");
    } else pricedRows += 1;
  } else if (row.price !== undefined) {
    fail(`the portion library row ${row.id} is in both kitchens and carries a price`,
      `it is priced in ${row.currency}, and one number cannot be two currencies.`,
      "A food that matters to section 17 in both countries is two rows, each with",
      "its own price and its own date.");
  }

  const inScope = stateNouns.some((noun) => new RegExp(`\\b${noun}`, "i").test(row.en));
  if (row.raw === undefined) {
    if (!inScope) continue;
    if (row.id in NO_STATE) { exempted.add(row.id); continue; }
    fail(`the portion library row ${row.id} names a ${stateNouns.join("/")} and no state`,
      `it reads "${row.en}"`,
      "Raw rice is 365 kcal per 100 g and cooked is about 130. DIET.md section 14:",
      "every one of these says which it is, in the name, in both languages. Either",
      "add `raw`, or name it in NO_STATE with the reason the question cannot arise.");
    continue;
  }
  if (row.id in NO_STATE) {
    exempted.add(row.id);
    fail(`the NO_STATE exemption ${row.id} has gone stale`,
      "The row carries a raw flag now, so the question does arise for it. Take",
      "the line out and let the row be asked like every other.");
  }
  statedRows += 1;
  if (!EN_STATE.test(row.en) || !BN_STATE.test(row.bn)) {
    fail(`the portion library row ${row.id} carries a raw flag its name does not`,
      `en: "${row.en}"`,
      `bn: "${row.bn}"`,
      "The flag is what the arithmetic reads and the name is what the reader",
      "reads. A name that does not say which state it is in is the field section",
      "14 calls a field that will be both.");
  }
}

for (const id of Object.keys(NO_STATE)) {
  if (exempted.has(id)) continue;
  fail(`the NO_STATE exemption ${id} names no row`,
    "The portion library has no such id. An exemption that has outlived what it",
    "exempted reads as covering something and covers nothing.");
}

/* ------------------------------------------------------------
   11. The generated sentences, and the one thing none may say

   Section 31's last bullet: "The generated sentences in section
   16 come from a listed set of templates, and that list is what
   a check reads. A tool that writes free prose about somebody's
   eating will eventually write something cruel."

   THE LIST IS DERIVED, NEVER KEPT. This tool's own sentences
   written out again in this file would be right on the day they
   were typed and wrong at the next commit, which is CLAUDE.md's
   opening failure happening to the thing that catches that
   failure. So a template here is what the compiler calls one: a
   template literal with an interpolation and prose in it, plus a
   sentence a condition chooses between two written-out ones,
   which carries no interpolation and is generated all the same.

       node scripts/check-diet.ts --templates

   prints the list.

   Two rules over it.

   NO SECOND PERSON JUDGEMENT, in either language. Section 1: a
   tracker that shames you is one somebody deletes on the day
   they most need it. Section 16: a correlation is described and
   never explained, so "your heavier days are usually Fridays" is
   a fact and "Fridays are ruining your progress" is a judgement.
   The vocabulary below is the judgement rather than the data,
   which is why it is written out here with its reason on each
   line: it is a rule, not a copy of anything.

   AND THE ARITHMETIC RETURNS FIGURES, NEVER WORDS.
   `shared/insights.ts` opens by saying that no function in it
   returns a verdict, and a sentence built there is a sentence in
   one language, on no list, that neither this check nor the
   language switch can reach. It holds no prose today and this is
   what keeps it that way.
   ------------------------------------------------------------ */

const LIST_TEMPLATES = process.argv.includes("--templates");

/** A `${...}` taken out whole. Balanced, because half of these
    interpolations hold a conditional with braces of its own and
    a lazy match stops at the first `}`, which leaves a property
    name behind reading as prose. */
function unfilled(text: string): string {
  let out = "";
  let i = 0;
  while (i < text.length) {
    if (text[i] === "$" && text[i + 1] === "{") {
      let depth = 0;
      let j = i + 1;
      for (; j < text.length; j += 1) {
        if (text[j] === "{") depth += 1;
        else if (text[j] === "}") {
          depth -= 1;
          if (depth === 0) break;
        }
      }
      out += "{}";
      i = j + 1;
      continue;
    }
    out += text[i];
    i += 1;
  }
  return out;
}

/** Prose rather than a key, a class name or a unit. Three words
    with letters in them: "{} kcal" is a figure with a label on
    it and nobody has to read that for tone. */
const isProse = (text: string): boolean =>
  text.split(/\s+/).filter((w) => /[A-Za-zঀ-৿]{2}/.test(w)).length >= 3;

const tidy = (text: string): string => unfilled(text).replace(/\s+/g, " ").trim();

interface Template { file: string; line: number; text: string }
const templates: Template[] = [];
const lineAt = (src: string, at: number): number => src.slice(0, at).split("\n").length;

for (const file of TOOL_FILES) {
  const src = uncommented(SOURCE.get(file) as string);

  /* Wherever it is written. A sentence in a table like
     FLOOR_WORDS reaches a reader exactly the way one written
     inside the JSX does. */
  for (const m of src.matchAll(/`((?:[^`\\]|\\.|\$\{(?:[^{}`]|\{[^{}]*\}|`[^`]*`)*\})*)`/g)) {
    if (!m[1].includes("${")) continue;
    const text = tidy(m[1]);
    if (isProse(text)) templates.push({ file, line: lineAt(src, m.index ?? 0), text });
  }

  for (const tag of [...openTags(file, src, "T"), ...openTags(file, src, "TBlock")]) {
    for (const half of ["en", "bn"] as const) {
      const value = attr(tag.attrs, half);
      if (!value || !value.startsWith("{") || !value.includes("?")) continue;
      const said = [...value.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
        .map((s) => tidy(s[1])).filter(isProse);
      if (said.length < 2) continue;
      for (const text of said) templates.push({ file, line: tag.line, text });
    }
  }
}

if (templates.length < 20) {
  fail("check-diet can no longer read the tool's generated sentences",
    `it found ${templates.length}, and this tool has hundreds of them. What broke`,
    "is the reader here rather than the sentences going away.");
}

if (LIST_TEMPLATES) {
  for (const t of [...templates].sort((a, b) => a.text.localeCompare(b.text))) {
    console.log(`${t.file}:${t.line}\n  ${t.text}`);
  }
}

/** What a sentence about somebody's own eating may never say.
    The judgement rather than the data, and every line of it is
    named by DIET.md section 1, 11, 16 or 31. */
const JUDGEMENT: Array<[RegExp, string]> = [
  [/\byou (should|must|need to|have to|ought)\b/i,
    "an instruction. Section 16: described, never explained, and never prescribed"],
  [/\bshould have\b/i,
    "the same instruction pointed backwards, which is worse"],
  [/\btoo (much|many|little|few|high|low|often)\b/i,
    "section 31: a quantity judged rather than stated. The figure, and what it is"
    + " measured against, is the whole of what a reading may say"],
  [/\b(well done|good job|keep it up|congratulat|proud of|you smashed)\b/i,
    "section 11: a status that praises you is a status people stop reading"],
  [/\byou failed\b|\bfailure\b|\bfell off\b/i,
    "section 31 names this one by name: not \"you failed\""],
  [/\bover budget\b/i,
    "section 31 names this one too"],
  [/\b(on|off) track\b/i,
    "a scoreboard. Section 1: the streak counts days LOGGED and never days on"
    + " target, because a run of days under a ceiling punishes somebody for a"
    + " birthday"],
  [/\b(bad|unhealthy|junk|naughty|sinful|clean eating)\b/i,
    "section 16: it never says a food is bad. Protein and fibre per 100 kcal is"
    + " the honest form of every good food and bad food list ever written"],
  [/\bcheat\b/i,
    "the same thing with a day attached to it"],
  [/\b(lazy|willpower|no excuse)\b/i,
    "section 11: it never says the word willpower. A hunger score climbing for"
    + " three weeks is a target that is too aggressive rather than a person who"
    + " is weak"],
  [/\b(ruining|sabotag|guilt|ashamed|shame on)\b/i,
    "section 16's own example of where the line is: \"Fridays are ruining your"
    + " progress\""],
  [/\b(earned|burn(ed)? (it )?off|work(ed)? (it )?off|treat yourself)\b/i,
    "food as payment, which is what a calorie tracker is a known trigger for."
    + " Section 31's most careful case"],
  [/(খুব বেশি খা|অতিরিক্ত খা|বেশি খেয়ে ফেলেছেন)/,
    "eating too much, in Bangla. The site is Bangla first and a judgement can"
    + " arrive in one language only"],
  [/(ব্যর্থ|আপনার দোষ|অলস|ইচ্ছাশক্তি)/,
    "failed, your fault, lazy, willpower: section 31 in the other script"],
  [/(দারুণ|অভিনন্দন|ভালো করেছেন|বাহবা)/,
    "praise, and section 11's rule holds in both languages"],
  [/(খারাপ খাবার|বাজে খাবার)/,
    "a food called bad"],
];

for (const template of templates) {
  for (const [pattern, why] of JUDGEMENT) {
    if (!pattern.test(template.text)) continue;
    fail(`${template.file}:${template.line} generates a sentence that judges the reader`,
      `it reads: ${template.text.slice(0, 120)}`,
      `${String(pattern)}: ${why}`,
      "DIET.md section 31: a tool that writes free prose about somebody's eating",
      "will eventually write something cruel. What a reading may say is the",
      "figure, the span it was measured over, and how many days of that span",
      "were written down.");
  }
}

const INSIGHTS = "shared/insights.ts";
for (const m of uncommented(read(INSIGHTS)).matchAll(/["`]((?:[^"`\\]|\\.)*)["`]/g)) {
  const text = tidy(m[1]);
  if (!isProse(text)) continue;
  fail(`${INSIGHTS} holds a sentence: ${text.slice(0, 90)}`,
    "It opens by saying that no function in it returns a verdict, and that is",
    "what makes every reading checkable: it hands back the figures and a panel",
    "chooses the words, in both languages, where this check can read them.",
    "A sentence built here is a sentence in one language and on no list.");
}

/* ------------------------------------------------------------ */
console.log(failures
  ? `\n${failures} problem(s): the diet tool has stopped keeping one of DIET.md's\n`
    + "rules about pages. Each line above names the section.\n"
  : `diet: ${disclaimed} of the ${targeted} pages that print a target say so, ${phrases} phrases\n`
    + `      in both languages across ${pages.length} pages, ${keyed} of them from the one\n`
    + `      table the app reads, ${widgets} widgets with an empty\n`
    + `      state, ${entries.length} glossary entries linked, ${TAGS.length} tags and ${MARKS.length} marks as written\n`
    + `      down, ${columns} columns across ${tables.length} tables filled or named, what\n`
    + "      happens after a goal is reached said once, "
    + `${floorNames.length} floors asserted and\n`
    + `      drawn from the module, ${formulas.size} formulas imported rather than written out,\n`
    + `      ${banded} pages reading a band off the reader's own cut-offs, ${FOODS.length} library rows\n`
    + `      sourced, ${pricedRows} of them priced with a date and ${statedRows} naming their state,\n`
    + `      and ${templates.length} generated sentences that judge nobody.\n`);
process.exit(failures ? 1 : 0);
