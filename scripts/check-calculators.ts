#!/usr/bin/env node
/* ============================================================
   check-calculators.ts: does every sentence have its numbers?

       node scripts/check-calculators.ts
       node scripts/check-calculators.ts --list

   The five calculators are split in two on purpose.
   `shared/calculators.ts` produces NUMBERS BY NAME and the key of
   a sentence; `shared/tool-strings.ts` holds the sentence, in two
   languages, with `{placeholders}` in it. Neither file knows
   anything about the other.

   That split is what stops the prose existing twice, once here
   and once in Kotlin. It also creates exactly one new way to be
   wrong, and this is the check for it: **a placeholder with no
   number behind it.** `{gap}` in a sentence whose calculator
   never produced a `gap` prints the word `{gap}` to a reader, on
   a page that renders perfectly, in one language only, on one of
   three branches.

   ---- what it asks ----

   1. Every figure a calculator names has a label, and the note it
      chose exists.
   2. Every verdict branch a calculator can return has a sentence.
   3. Every `{placeholder}` in any of those has a value behind it.
   4. **Both languages fill the same holes.** A Bangla sentence
      that forgot `{gapPct}` is not a translation, it is a
      different sentence, and nothing else in this repository
      would see it.
   5. Every value a calculator produces is in `FORMATS`, or it
      would print as a bare double where money was meant.
   6. Every field has a label, and its default is inside its own
      slider's range.
   ============================================================ */

import { CALCULATORS, FORMATS, defaultsFor, type Calculator } from "../shared/calculators.ts";
import { STRINGS, LANGS } from "../shared/tool-strings.ts";

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`FAIL  ${line}`);
  detail.forEach((d) => console.error(`      ${d}`));
};

const holes = (text: string): string[] =>
  [...text.matchAll(/\{([a-zA-Z0-9]+)\}/g)].map((m) => m[1]);

/* ---------- every branch, not just the default ----------

   A calculator's sentences are chosen by an `if`, so running each
   one once proves nothing about the other two. These drag each
   across its own edges: a zero rate, a stop above the entry, a
   position too big for the account, a return under inflation. */
const SWEEPS: Record<string, Array<Record<string, number>>> = {
  compounding: [{}, { rate: 0 }, { start: 0, monthly: 0 }],
  sanchayapatra: [{}, { srate: 9, frate: 9 }, { frate: 15 }],
  inflation: [{}, { nominal: 15 }, { nominal: 3 }],
  emi: [{}, { years: 1 }, { rate: 4 }],
  position: [{}, { stop: 50 }, { risk: 5, entry: 4000 }],
};

/** Every phrase key one calculator can reach, with the values
    that were live when it reached it. */
const reachable = (c: Calculator): Array<{ key: string; values: Record<string, number> }> => {
  const out: Array<{ key: string; values: Record<string, number> }> = [];
  const base = defaultsFor(c);
  const seen = new Set<string>();
  for (const patch of SWEEPS[c.id] ?? [{}]) {
    const o = c.run({ ...base, ...patch });
    const keys = [
      ...c.figures.map((f) => `calc.${c.id}.${f}`),
      ...Object.values(o.notes).filter(Boolean),
      `calc.${c.id}.${o.verdict}`,
    ];
    for (const key of keys) {
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({ key, values: o.values });
    }
  }
  return out;
};

if (process.argv.includes("--list")) {
  for (const c of CALCULATORS) {
    console.log(`\n${c.id}`);
    for (const { key } of reachable(c)) {
      const phrase = STRINGS[key];
      console.log(`  ${phrase ? " " : "x"} ${key.padEnd(38)} ${phrase?.en ?? "MISSING"}`);
    }
  }
  console.log();
  process.exit(0);
}

let checked = 0;

for (const c of CALCULATORS) {
  /* ---------- 6. the fields ---------- */
  for (const f of c.fields) {
    const key = `calc.${c.id}.f.${f.name}`;
    if (!STRINGS[key]) fail(`${c.id}: the field '${f.name}' has no label at ${key}`);
    if (f.value < f.min || f.value > f.max) {
      fail(`${c.id}.${f.name} starts at ${f.value} and its slider runs ${f.min} to ${f.max}`,
        "The first drag would jump the value somewhere the reader did not put it.");
    }
    if (!(f.step > 0) || !(f.max > f.min)) fail(`${c.id}.${f.name} is not a usable range`);
    checked += 1;
  }

  /* ---------- 5. every number can be printed ---------- */
  const values = c.run(defaultsFor(c)).values;
  for (const name of Object.keys(values)) {
    if (!(name in FORMATS)) {
      fail(`${c.id} produces '${name}' and FORMATS does not say how to print it`,
        "It would render as a bare double where money or a percentage was meant.");
    }
    checked += 1;
  }

  /* ---------- the chrome a screen names for itself ----------

     Not reachable from the model, so nothing above would look at
     them: a short name for a chip, a label per chart line, and
     the four rows of the comparison. The Android app renders all
     of these, and a key it gets wrong prints as itself. */
  const chrome = [
    `calc.${c.id}.short`,
    ...c.lines.map((line) => `calc.${c.id}.line.${line}`),
  ];
  for (const key of chrome) {
    if (!STRINGS[key]) fail(`${c.id}: the screen names '${key}' and there is no such phrase`);
    checked += 1;
  }

  /* ---------- 1 to 4. every sentence ---------- */
  for (const { key, values: live } of reachable(c)) {
    const phrase = STRINGS[key];
    if (!phrase) {
      fail(`${c.id} can print '${key}' and there is no such phrase`,
        "A reader would see the key itself where a sentence belongs.");
      continue;
    }

    const perLang = LANGS.map((lang) => ({ lang, holes: holes(phrase[lang] ?? "") }));
    const first = perLang[0];
    for (const other of perLang.slice(1)) {
      const missing = first.holes.filter((h) => !other.holes.includes(h));
      const extra = other.holes.filter((h) => !first.holes.includes(h));
      if (missing.length || extra.length) {
        fail(`${key}: the two languages do not fill the same holes`,
          missing.length ? `${other.lang} is missing: ${missing.join(", ")}` : "",
          extra.length ? `${other.lang} has extra: ${extra.join(", ")}` : "",
          "A translation with a different set of numbers in it is a different sentence.");
      }
    }

    for (const { lang, holes: names } of perLang) {
      for (const name of names) {
        if (!(name in live)) {
          fail(`${key} (${lang}) fills in {${name}} and ${c.id} never produces one`,
            `It produces: ${Object.keys(live).sort().join(", ")}`,
            `A reader would see the characters {${name}} in the middle of a sentence.`);
        }
        checked += 1;
      }
    }
  }
}

/* And the handful that belong to no one calculator. */
for (const key of ["calc.eyebrow", "calc.ahead", "calc.disclaimer",
  "calc.chart.now", "calc.chart.year",
  "calc.part.gross", "calc.part.paidTax", "calc.part.net", "calc.part.total"]) {
  if (!STRINGS[key]) fail(`the calculators' chrome names '${key}' and it does not exist`);
  checked += 1;
}

/* The comparison's four rows are keyed by the SUFFIX of a value
   name, `sGross` and `fGross` sharing `calc.part.gross`, which is
   what stops the same four words being written twice. A suffix
   the model stopped producing is a row that would print an empty
   cell. */
const parts = ["Gross", "PaidTax", "Net", "Total"];
const sanchayapatra = CALCULATORS.find((c) => c.id === "sanchayapatra");
if (sanchayapatra) {
  const values = sanchayapatra.run(defaultsFor(sanchayapatra)).values;
  for (const side of ["s", "f"]) {
    for (const part of parts) {
      if (!(`${side}${part}` in values)) {
        fail(`the comparison shows '${side}${part}' and the model does not produce it`);
      }
      checked += 1;
    }
  }
}

console.log(failures
  ? `\n${failures} problem(s) between the calculators and their words.\n`
  : `calculators: ${CALCULATORS.length} tools, ${checked} checks; every sentence has its\n`
    + `             numbers, in both languages, on every branch.\n`);
process.exit(failures ? 1 : 0);
