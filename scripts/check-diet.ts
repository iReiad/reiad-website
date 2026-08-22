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

   Six questions, and each one is a rule DIET.md states and
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
   glossary. Retyping any of them here would make this file one
   more place the same list is said, which is the failure the top
   of CLAUDE.md is about happening to the thing that catches it.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { TAGS, MARKS } from "../shared/diet.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

const COMPONENTS = "next/components/diet";
const ROUTES = "next/app/(site)/tools/diet";
const API = "next/lib/diet-api.ts";

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
   Two shapes of that going wrong, and they fail differently.

   A `<T>` or `<TBlock>` with an empty half is a blank on the
   page for exactly one of the two readers, and it is invisible
   to whoever wrote it, because nobody writes a page in the
   language they are not testing in.

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

for (const file of TOOL_FILES) {
  const src = SOURCE.get(file) as string;

  for (const tag of [...openTags(file, src, "T"), ...openTags(file, src, "TBlock")]) {
    phrases += 1;
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
  "diet_profile.band_low_kg": "section 6, maintenance is a band rather than a number",
  "diet_profile.band_high_kg": "section 6, the other end of the same band",
  "diet_profile.food_budget": "section 17, what food costs",
  "diet_profile.budget_currency": "section 17, beside the budget",
  "diet_profile.oil_ml_week": "section 14, the oil calibration",
  "diet_profile.oil_people": "section 14, per household rather than per dish",
  "diet_profile.oil_meals": "section 14, the third of the three",
  "diet_profile.board": "section 24, the reader arranges the widgets",
  "diet_profile.onboarded_at": "section 26, getting in",

  /* The day. The tape's other three and the fields no form
     offers yet. */
  "diet_days.sodium_mg": "section 15, the day's rollup of what the entries already carry",
  "diet_days.sleep_hours": "section 18, the calendar",
  "diet_days.chest_cm": "section 2, the rest of the measurement set",
  "diet_days.thigh_cm": "section 2, the same",
  "diet_days.arm_cm": "section 2, the same",
  "diet_days.origin": "section 26, so an imported year and a logged year can be told apart",

  /* What was eaten. */
  "diet_entries.meal": "section 13, meals rather than only foods, which is what names one",
  "diet_entries.est_low": "section 14, a range for food eaten out",
  "diet_entries.est_high": "section 14, the other end of it",
  "diet_entries.planned": "section 13, a week's plan is the same rows dated ahead",
  "diet_entries.fetched_on": "section 12, so a stale figure can be found and refreshed",
  "diet_entries.origin": "section 26, the importer",

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

/* ------------------------------------------------------------ */
console.log(failures
  ? `\n${failures} problem(s): the diet tool has stopped keeping one of DIET.md's\n`
    + "rules about pages. Each line above names the section.\n"
  : `diet: ${disclaimed} of the ${targeted} pages that print a target say so, ${phrases} phrases\n`
    + `      in both languages across ${pages.length} pages, ${widgets} widgets with an empty\n`
    + `      state, ${entries.length} glossary entries linked, ${TAGS.length} tags and ${MARKS.length} marks as written\n`
    + `      down, and ${columns} columns across ${tables.length} tables filled or named.\n`);
process.exit(failures ? 1 : 0);
