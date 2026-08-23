#!/usr/bin/env node
/* ============================================================
   export-calculator-fixtures.ts: the five calculators, frozen.

       node scripts/export-calculator-fixtures.ts          write
       node scripts/export-calculator-fixtures.ts --check  fail on drift

   `shared/calculators.ts` is the model and the Android app has a
   Kotlin port of it. Two implementations of the same arithmetic
   do not stay in step by being written carefully, and these five
   are worse than the stock check in one way: every number in them
   is plausible. A compounding calculator off by a month still
   returns a sensible-looking balance, and nobody reading the
   screen could tell.

   So this runs each calculator over a set of inputs and writes
   down every number it produced, including the series, and the
   port asserts against the file.

   ---- what the cases are ----

   Not random, and not only the defaults. Each calculator's
   sentences are chosen by an `if`, and its arithmetic has edges:
   a rate of nought, a term of one year, a stop above the entry, a
   return under inflation, a position too big for the account. The
   defaults exercise exactly one branch of each, so a fixture set
   of five defaults would prove the happy path agrees and nothing
   else.

   `--check` is what CI runs, and it fails on a difference rather
   than rewriting: a generated file that quietly regenerates is a
   generated file that never disagrees with anything.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { CALCULATORS, FORMATS, defaultsFor } from "../shared/calculators.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "content", "calculators.fixtures.json");

/** Every case, and what each one is FOR.

    The `why` is not decoration: a case added later without a
    reason is a case nobody can judge, and the port's own test
    asserts every one of them says something. */
const CASES: Record<string, Array<{ name: string; why: string; input: Record<string, number> }>> = {
  compounding: [
    { name: "default", why: "the ordinary path: a habit, a rate and twenty years", input: {} },
    { name: "no-rate", why: "nothing compounds, so the verdict has to stop claiming it does "
      + "and the rule of 72 has to refuse rather than divide by nought", input: { rate: 0 } },
    { name: "nothing-in", why: "no starting sum and no habit, where the growth percentage "
      + "would divide by zero if it were not guarded", input: { start: 0, monthly: 0 } },
    { name: "one-year", why: "the shortest term, where the series is two points and an "
      + "off-by-one in the month loop shows up as a whole year", input: { years: 1 } },
    { name: "forty-years", why: "the longest, where a compounding error has room to grow "
      + "into something visible", input: { rate: 25, years: 40 } },
  ],
  sanchayapatra: [
    { name: "default", why: "sanchayapatra ahead, which is the usual answer at these rates",
      input: {} },
    { name: "fdr-ahead", why: "the other branch, where compounding overtakes a paid-out "
      + "profit", input: { frate: 15 } },
    { name: "too-close", why: "within half a per cent of the principal, where the tool has "
      + "to stop picking a winner and say the rules matter more than the rate. A simple "
      + "10.7% against a compounding 9% is that tie over five years",
      input: { srate: 10.7, frate: 9 } },
    { name: "no-tax", why: "one side taxed and the other not, which is the pair of "
      + "subtractions most easily written the wrong way round", input: { stax: 0, ftax: 20 } },
    { name: "ten-years", why: "the longest term, where compounding has the most room",
      input: { years: 10 } },
  ],
  inflation: [
    { name: "default", why: "a return exactly equal to inflation, where Fisher gives nought "
      + "and subtraction happens to agree", input: {} },
    { name: "beats", why: "a real return above nought", input: { nominal: 15 } },
    { name: "loses", why: "the quiet way safe savings lose money, which is the whole point "
      + "of this calculator and a different sentence", input: { nominal: 3 } },
    { name: "no-inflation", why: "where the two methods must agree exactly",
      input: { inflation: 0 } },
    { name: "thirty-years", why: "the longest horizon, where the two series diverge most",
      input: { years: 30, nominal: 12, inflation: 6 } },
  ],
  emi: [
    { name: "default", why: "the ordinary path: ten years at twelve per cent", input: {} },
    { name: "one-year", why: "where the shorter term cannot be two years shorter, so the "
      + "saving is nought and the other sentence prints", input: { years: 1 } },
    { name: "three-years", why: "the shortest term where a two-year saving still exists",
      input: { years: 3 } },
    { name: "cheapest", why: "the lowest rate the slider offers", input: { rate: 4 } },
    { name: "largest", why: "the biggest loan over the longest term, where the amortisation "
      + "loop runs three hundred times and a rounding drift accumulates",
      input: { principal: 10_000_000, years: 25, rate: 20 } },
  ],
  position: [
    { name: "default", why: "a stop below the entry and a position the account can hold",
      input: {} },
    { name: "no-stop", why: "a stop AT the entry, where there is no defined loss to size "
      + "against and the tool must refuse rather than divide by nought",
      input: { stop: 45 } },
    { name: "stop-above", why: "a stop above the entry, which is the same refusal by a "
      + "different route", input: { stop: 50 } },
    { name: "too-big", why: "a stop half a taka below the entry, where the rule needs more "
      + "stock than the whole account. That is the answer this calculator exists to give and "
      + "the one a reader least wants", input: { risk: 5, capital: 10_000, stop: 44.5 } },
    { name: "expensive", why: "a share price high enough that the floor matters: the rule "
      + "allows 28.57 shares and a reader can buy 28", input: { entry: 4000, stop: 3930 } },
  ],
};

const built = {
  /* How each named number is printed. The port asserts against
     this too: a value that is money on one side and a bare
     decimal on the other is a figure a reader cannot read. */
  formats: FORMATS,

  /* No timestamp, for the reason `content/schools.backup.json`
     carries none: identical content has to be identical bytes, so
     the git log answers "did the model change" rather than "was
     this regenerated". */
  calculators: CALCULATORS.map((calc) => ({
    id: calc.id,
    fields: calc.fields,
    figures: calc.figures,
    lines: calc.lines,
    cases: CASES[calc.id].map((c) => {
      const input = { ...defaultsFor(calc), ...c.input };
      return { name: c.name, why: c.why, input, out: calc.run(input) };
    }),
  })),
};

const text = `${JSON.stringify(built, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const have = readFileSync(OUT, "utf8");
  if (have === text) {
    console.log(`calculator fixtures: ${CALCULATORS.length} tools, unchanged.`);
    process.exit(0);
  }
  console.error("\n  x content/calculators.fixtures.json is not what the model produces.");
  console.error("        Either the model changed and the fixtures were not regenerated,");
  console.error("        or the fixtures were edited by hand. Run:");
  console.error("          node scripts/export-calculator-fixtures.ts");
  console.error("        and read the diff: every line of it is a number the Android app");
  console.error("        is asserting, so a change here is a change there.\n");
  process.exit(1);
}

writeFileSync(OUT, text);
const cases = CALCULATORS.reduce((a, c) => a + CASES[c.id].length, 0);
console.log(`calculator fixtures: ${cases} cases across ${CALCULATORS.length} tools`
  + ` written to content/calculators.fixtures.json`);
