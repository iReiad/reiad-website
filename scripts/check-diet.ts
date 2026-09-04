#!/usr/bin/env node
/* check-diet.ts: DIET.md's page rules, the ones neither
   scripts/diet.test.ts (the arithmetic) nor next/diet.test.ts
   (the browser) can see. Eleven questions, each headed below.

       node scripts/check-diet.ts [--templates]

   Every vocabulary is READ (DIET.md, the migration, the glossary,
   `target()`'s body, `BMI_CUTS`, the panels) rather than retyped
   here. `UNUSED`, `NO_STATE` and `JUDGEMENT` are the three
   exceptions and each entry carries its reason. */

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
    named: a migration may never be renamed, so a second one
    adding a column is how this schema grows. */
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

/* The one JSX reader everything below shares. It walks rather
   than matching: every prop worth looking at holds JSX, and
   `en={<p>...</p>}` has a `>` a regex would stop on. */

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
    /* AN APOSTROPHE IN PROSE IS NOT A STRING: `en={(<p>somebody's
       periods</p>)}`. Both real cases open in EXPRESSION position,
       after an operator or a bracket, so that is the test. */
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

/* ---- 1. Every page that prints a target prints the disclaimer

   Section 31. A page is a route directory plus every diet
   component it reaches, because the number and the sentence are
   almost never in the same file. A TARGET is `target()`,
   `proteinFloor()` or `projection()`. ---- */

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

/* ---- 2. Both languages cover the same keys

   Section 23: one switch changes EVERYTHING on the page. Three
   shapes of that going wrong. A `<T>`/`<TBlock>` with an empty
   half is a blank for exactly one reader. A `<T k="...">` naming
   a key `shared/diet-words.ts` lacks renders as `[dt.foo]` rather
   than throwing, so both directions are checked. And an
   `aria-label`, `title` or `placeholder` is an ATTRIBUTE, so it
   cannot be rendered twice: a literal with Bangla in it passes. ---- */

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
      /* Every key-shaped literal, because a key may be chosen at
         runtime. The `dt.` shape is what tells a key from a value
         a condition compares against. */
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

/* And the other way round. A key nothing draws is usually the far
   half of a rename, and the page then prints the key. */
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

/* ---- 3. No widget without an empty state

   Section 24: "Not a spinner, not an empty box, not a zero: a
   sentence saying what it will show and when." `<Waiting>` is
   that sentence, and a `<Widget>` without one draws a zero. ---- */

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

/* ---- 4. The glossary, both halves

   An entry nothing links to is a page nobody reaches; a term used
   and never defined is the tool written for people who already
   know. The vocabulary is read out of DIET.md. ---- */

const glossary = read(`${COMPONENTS}/glossary.tsx`);
const entries = [...glossary.matchAll(/id:\s*"([\w-]+)",\s*en:\s*"([^"]*)"/g)]
  .map((m) => ({ id: m[1], en: m[2] }));

if (!entries.length) fail(`${COMPONENTS}/glossary.tsx defines no terms`);

const everywhere = filesUnder("next/components").concat(filesUnder("next/app"))
  .map((f) => read(f)).join("\n");

/* A LINK IS EITHER THE ADDRESS OR THE COMPONENT THAT BUILDS IT.
   `<Term id="bmi">` writes the href out of the id, so the literal
   `diet/glossary#bmi` appears nowhere: reading only the raw string
   would push the tool back to writing addresses by hand. */
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

/* Section 23's list, read out of the paragraph that states it, so
   a term added there is asked about with nobody coming here. */
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

/* ---- 5. The fixed sets

   Section 11's twelve journal tags and the migration's four day
   marks. NEITHER HAS A CHECK CONSTRAINT: `marks text[]` and
   `tags text[]` take whatever they are given, so a thirteenth tag
   is not a 400, it is a value nothing counts and nothing draws. ---- */

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

/* ---- 6. Every diet_* column is reached

   A column nothing can fill breaks nothing: the migration is
   correct, the API layer maps it, every check passes, and the
   feature is missing where nobody can see it is missing.

   `UNUSED` is what is genuinely still to be built, keyed by
   column, each naming the DIET.md section that will build it. A
   whole table with no caller is keyed `<table>.*`, and that
   wildcard fails as stale the moment the table gains a writer.
   `debt` is not a reason. ---- */

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

  /* A phase runs until the next begins, which is the end
     `stretches()` already reads. `ended_on` is for a phase that
     ends with nothing after it, and needs an `endPhase()`. */
  "diet_phases.ended_on": "section 10, a phase that ends with nothing after it",

  /* Two tables with no caller at all. */
  /* THE WILDCARD IS GONE, and its going is what this check is for:
     `diet_foods` gained a writer and the table-wide exemption went
     stale in the same commit. Four columns are still nobody's. */
  "diet_foods.price": "section 17, what a dish you cooked yourself actually cost",
  "diet_foods.currency": "section 17, the same figure in taka or in pounds",
  "diet_foods.priced_on": "section 17, and an undated price is worse than none",
  "diet_foods.fetched_on": "section 12, so a stale figure can be found and refreshed deliberately",
};

const used = new Set<string>();

/** The columns of one table, in declaration order. Deliberately
    dumb, and the same shape `check-rows.ts` reads `aab/schema.sql`
    with: first word of every line that is not a constraint. */
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
    body: `saveDay` hands the request to the private `writeDay`, so
    reading only the exports declares `diet_days` unwritable. */
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

/** A declaration is not a value. `Day` names every day column as
    an optional property, so keeping the interfaces would report
    every unfilled column as filled. */
const withoutTypes = (src: string): string => uncommented(src)
  .replace(/\b(?:export\s+)?interface\s+\w+[^{]*\{[\s\S]*?\n\}/g, " ")
  .replace(/\b(?:export\s+)?type\s+\w+\s*=[\s\S]*?\n\};?/g, " ");

/** The `shared/` functions that BUILD one of these rows, and
    nothing else out of those files: `loggedFrom()` puts the macros
    on an entry, but `meal:` is also a word in that file's table of
    portion names. A function whose return type is one of the row
    shapes is the honest middle. */
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
    an assignment. A text search, for the reason `check-rows.ts`
    gives: a page that never mentions the field is the way it
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

/* ---- 7. The honest sentence is said once, on the goal page

   Section 6: "on the goal page, once, where the projection ends".
   Both halves are the rule. Said twice it is a slogan; said away
   from the projection it is a scare. ---- */

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

/* ---- 8. The floors are the module's, and nothing retypes a formula

   Three ways section 5's floors stop being true with every page
   still rendering. Nothing pins them, so this asks that
   `scripts/diet.test.ts` still names every one, reading the list
   out of `target()`'s own body. A sentence that TYPES a floor goes
   on saying 1200 for ever, on the one screen whose job is to say
   the number changed; the `surplus` line interpolates its constant
   and is what the rest have to be. And a route that recomputes a
   formula instead of importing it: every one-expression formula
   `shared/diet.ts` exports is reduced to its SHAPE, and a page
   carrying that shape has a BMI or a Katch written out by hand. ---- */

const dietSrc = read("shared/diet.ts");
const dietTest = read("scripts/diet.test.ts");

/** One exported function's body, brace-balanced. Not the `\n}` the
    API layer is read with: `target()` takes an object literal over
    six lines, so the first line closing a brace is the end of its
    ARGUMENT and the body would come back empty. */
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

/** The numbers behind one name in `shared/diet.ts`. A floor that
    depends on the reader, `floorKcal(sex)`, is every number its
    one-line body can return: calling it would mean writing out the
    `Sex` union, which is a second copy of a vocabulary. */
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

/** Every number a sentence states, in either script, with whether
    a percent sign follows. Tokens rather than a substring search:
    1 is one floor and 1200 is another. The percent keeps a rate
    floor honest without catching every "1 cup". */
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
       `unfilled()` is balanced because an interpolation can hold a
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

/* ---- 9. The Asian cut-offs are used whenever ancestry says so

   Section 2's single most important honest detail. `BMI_CUTS` is
   the table and `bmiBand()` the only thing that should read it: a
   page deciding a band on the general cut-offs tells a South Asian
   reader they are healthy where their own health service would
   not, and nothing in the tool disagrees with it. Four shapes: a
   fixed ancestry; a body built with a literal ancestry; a cut-off
   written into a comparison; a band drawn without `bmiBand()`.
   And section 2's second half: the page says WHICH set it used. ---- */

const ancestries = Object.keys(BMI_CUTS);

/** Every cut-off, and what it is, so a number both sets share is
    reported once. */
const cutNames = new Map<number, string[]>();
for (const [place, cuts] of Object.entries(BMI_CUTS)) {
  for (const [band, cut] of Object.entries(cuts)) {
    cutNames.set(cut, [...(cutNames.get(cut) ?? []), `${band} for "${place}"`]);
  }
}

/** The band vocabulary is in `words.ts`, keyed by `bmiBand()`'s own
    tokens, so indexing it is the signature of a page drawing a
    band. Both names are checked to exist, because a rename would
    leave this asking about nothing and reporting all is well. */
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

  /* A cut-off in a comparison is bmiBand() written out with one of
     the two tables missing. Only in a file that says BMI somewhere,
     because 25 and 30 are also a number of days and of grams. */
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

/* ---- 10. The portion library: a source, a dated price, a state

   A SOURCE, because a number with no source is one this tool
   invented. A DATE ON A PRICE: section 17, an undated price is
   worse than none, so `price`, `currency` and `pricedOn` are three
   parts of one fact and a row carries all three or none (a row in
   both kitchens carries none: one number cannot be two
   currencies). A STATE: raw rice is 365 kcal per 100 g and cooked
   about 130, which section 14 calls the most common single error
   in calorie counting, so a row in scope says which in `raw` AND
   in the name, in both languages. ---- */

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

/* ---- 11. The generated sentences, and the one thing none may say

   Section 31: the templates are a listed set and that list is what
   a check reads. THE LIST IS DERIVED, NEVER KEPT: a template here
   is what the compiler calls one, plus a sentence a condition
   chooses between two written-out ones. `--templates` prints it.

   NO SECOND PERSON JUDGEMENT, in either language: a correlation is
   described and never explained, so "your heavier days are usually
   Fridays" is a fact and "Fridays are ruining your progress" is a
   judgement. `JUDGEMENT` below is that vocabulary, which is a rule
   rather than a copy of anything.

   AND THE ARITHMETIC RETURNS FIGURES, NEVER WORDS. A sentence
   built in `shared/insights.ts` is a sentence in one language, on
   no list, that neither this check nor the language switch can
   reach. ---- */

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
