#!/usr/bin/env node
/* ============================================================
   export-stock-fixtures.ts: the stock model's answers, frozen.

       node scripts/export-stock-fixtures.ts          write them
       node scripts/export-stock-fixtures.ts --check  fail on drift

   ---- why this exists ----

   `aab/tools/stock.model.js` is twelve hundred lines of
   arithmetic and judgement: forty-four metrics, six pillars,
   vetoes, flags, Altman, Piotroski, a fair value, a Shariah
   screen and a verdict band. The Android app has to produce the
   SAME answers, and two implementations of a model this size do
   not stay in step by being written carefully. They stay in step
   by one of them being checked against the other's output.

   So this runs the model over a set of companies and writes down
   what it said. The app's own test reads the same file and
   asserts the same numbers, which means a change to a threshold
   here fails a test there rather than quietly giving two readers
   two different verdicts on the same company.

   ---- what the cases are ----

   Not random. Each one is a shape the model has a branch for: a
   bank (where half the ratios are meaningless and the financial
   path takes over), a company with no prior year (where the trend
   metrics must report "not testable" rather than scoring zero), a
   loss-maker, a company with no dividend, and one carrying enough
   debt to trip the vetoes. A fixture set that only holds healthy
   pharma companies proves that the happy path agrees and nothing
   else.

   ---- and the formatters, which are the other half ----

   `formats` at the foot of the file is the same trick one level
   down. `fmtNum` and its four neighbours go through
   `Intl.NumberFormat`, which the app has no equivalent of that
   can be trusted to agree: Bangla groups in the South Asian way,
   the last three digits and then twos, and an app printing
   `১,০০০,০০০` where the site prints `১০,০০,০০০` is wrong in a
   way a reader notices instantly and cannot explain. So what
   `Intl` actually produced is written down, and the port asserts
   against it rather than against a second reading of the spec.

   `--check` is what CI runs, and it fails on a difference rather
   than rewriting: a generated file that quietly regenerates is a
   generated file that never disagrees with anything.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "content", "stock.fixtures.json");

const M = await import(join(ROOT, "aab", "tools", "stock.model.js"));

/* The formatters, out of `shared/tool-strings.ts` itself rather
   than out of its compiled copy: the source is what an editor
   changes, and the built module is checked against it by
   `build-modules.ts --check` already. */
const I18N = await import(join(ROOT, "shared", "tool-strings.ts"));

/** The companies, and what each one is FOR. */
const CASES: Array<{ name: string; why: string; input: Record<string, unknown> }> = [
  {
    name: "healthy-pharma",
    why: "the defaults: everything present, nothing extreme",
    input: {},
  },
  {
    name: "bank",
    why: "the financial path, where half the ordinary ratios do not apply "
      + "and the sector extras take over",
    input: {
      sector: "bank", car: 13.5, npl: 4.2, provisionCover: 85, costIncome: 52, adr: 78,
      revenue: 42000, grossProfit: 42000, inventory: 0, capex: 900,
    },
  },
  {
    name: "no-prior-year",
    why: "every trend metric and the whole Piotroski score must report "
      + "NOT TESTABLE rather than scoring a zero, which is the difference "
      + "between 'we cannot tell' and 'it is bad'",
    input: {
      revenuePrev: 0, grossProfitPrev: 0, netIncomePrev: 0, totalAssetsPrev: 0,
      currentAssetsPrev: 0, currentLiabilitiesPrev: 0, totalDebtPrev: 0,
      cfoPrev: 0, sharesPrev: 0, netIncome3y: 0,
    },
  },
  {
    name: "loss-maker",
    why: "a negative bottom line, where a P/E is meaningless and several "
      + "ratios divide by something that is not there",
    input: {
      netIncome: -4200, ebit: -1800, netIncomePrev: 900, cfo: -600,
      dps: 0, yearsPaid: 0,
    },
  },
  {
    name: "no-dividend",
    why: "the income pillar with nothing in it, which must not read as a "
      + "failure on a company that has never claimed to pay one",
    input: { dps: 0, yearsPaid: 0, divTax: 0 },
  },
  {
    name: "heavily-indebted",
    why: "the vetoes and the flags, which is the half of this model that "
      + "overrides a score rather than contributing to it",
    input: {
      totalDebt: 96000, equity: 21000, currentLiabilities: 61000, cash: 900,
      interestExpense: 9800, ebit: 8100, reserves: 4000, cfo: 2100,
    },
  },
  {
    name: "tiny-illiquid",
    why: "a Z category company nobody trades, where liquidity and float "
      + "are the things that actually decide the answer",
    input: {
      category: "Z", turnover: 0.4, freeFloat: 6, shares: 90, price: 11,
      high52: 34, low52: 9, ma50: 12, ma200: 19,
      stockReturn12m: -46, indexReturn12m: 7,
    },
  },
];

/** Everything the model says about one company. */
function verdict(input: Record<string, unknown>) {
  const d = { ...M.DEFAULTS, ...input };
  const r = M.ratios(d);
  const scored = M.scoreMetrics(d, r);
  const pillars = M.scorePillars(scored);
  const weights = M.WEIGHT_PRESETS.balanced;
  const score = M.composite(pillars, weights);

  return {
    ratios: r,
    /* Keyed by the metric's OWN id, so a renamed or reordered
       metric shows up as a missing key rather than as a shifted
       array.

       It was `Object.entries(scored)` for one commit, which on an
       array gives "0", "1", "2", and the comment above it claimed
       exactly what this now does. That is the worst shape this
       file can have: a port asserted against a fixture whose
       thirty-eighth entry silently became a different metric
       would go on passing while comparing the wrong two numbers. */
    scored: Object.fromEntries(scored.map((m: { id: string }) => [m.id, m])),
    pillars,
    score,
    grade: M.grade(score),
    band: M.bandFor(score),
    flags: M.checkFlags(d, r),
    signals: M.signals(d, r, pillars),
    altman: M.altman(d),
    piotroski: M.piotroski(d, r),
    fairValue: M.fairValue(d, r),
    shariah: M.shariahScreen(d, r),
    drags: M.drags(scored, pillars, weights),
    priceCap: M.priceCap(pillars),
  };
}

/* Every shape a number takes on that page, at both ends of its
   range and at the boundaries where the printing changes: the
   crore threshold, a negative, a rounding tie, and a value that
   is not there at all. */
const NUMBERS = [
  0, 1, 1.5, -1.5, 4.25, -4.25, 0.005, 9.995, 99, 99.5, 100, 100.5,
  999, 1000, 1234.5, 12345, 99999, 100000, 1000000, 12345678,
  -0.4, -12345.678, 1e9, 0.0001,
];

/** What `Intl` really printed, for every formatter and both
    languages. */
function formats(): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {};
  for (const lang of I18N.LANGS) {
    const row: Record<string, string> = {};
    for (const v of NUMBERS) {
      row[`num0:${v}`] = I18N.fmtNum(v, lang, 0);
      row[`num1:${v}`] = I18N.fmtNum(v, lang, 1);
      row[`num2:${v}`] = I18N.fmtNum(v, lang, 2);
      row[`int:${v}`] = I18N.fmtInt(v, lang);
      row[`tk:${v}`] = I18N.fmtTk(v, lang);
      row[`lakh:${v}`] = I18N.fmtLakh(v, lang);
      for (const kind of ["x", "%", "pp", "lakh", "n"]) {
        row[`value:${kind}:${v}`] = I18N.fmtValue(v, kind, lang);
      }
    }
    /* And the one thing every formatter has to agree about:
       what a number that is not there looks like. */
    row["num2:nan"] = I18N.fmtNum(NaN, lang, 2);
    row["int:nan"] = I18N.fmtInt(NaN, lang);
    row["tk:nan"] = I18N.fmtTk(NaN, lang);
    row["lakh:nan"] = I18N.fmtLakh(NaN, lang);
    row["value:x:nan"] = I18N.fmtValue(NaN, "x", lang);
    out[lang] = row;
  }
  return out;
}

const built = {
  /* Every field a reader can type in, at the value it starts at.

     Not a convenience. These fifty-odd numbers are the whole of
     what a shared link leaves OUT, because `writeUrl` on the site
     only writes what differs from a default. So the two sides
     agreeing about `DEFAULTS` is what makes a link portable, and
     the two drifting is a link that opens a different company on
     the other side while looking perfectly correct on both.

     A field added here has to reach the app, and this is what
     says so: the port asserts its own defaults against this
     object, key for key, and fails on one it does not have. */
  defaults: M.DEFAULTS,

  /* No timestamp, deliberately, and for the reason
     `content/schools.backup.json` carries none: identical content
     has to be identical bytes, so the git log answers "did the
     model change" rather than "was this regenerated". */
  formats: formats(),

  /* Just the NAMES, not the phrases: the app fetches the table
     itself from /api/tools, and this is what lets its own test
     say "every id I render has a phrase" without shipping 52KB of
     Bangla into a test resource.

     The failure it catches is a reader seeing `f.debtHeavy` where
     a sentence should be. That happens the moment a metric, flag
     or signal is added to the model and not to the words, which
     are two files, and nothing else compares them. */
  stringKeys: Object.keys(I18N.STRINGS).sort(),

  cases: CASES.map((c) => ({
    name: c.name,
    why: c.why,
    input: c.input,
    out: verdict(c.input),
  })),
};

const text = `${JSON.stringify(built, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const have = readFileSync(OUT, "utf8");
  if (have === text) {
    console.log(`stock fixtures: ${built.cases.length} cases, unchanged.`);
    process.exit(0);
  }
  console.error("\n  x content/stock.fixtures.json is not what the model produces.");
  console.error("        Either the model changed and the fixtures were not regenerated,");
  console.error("        or the fixtures were edited by hand. Run:");
  console.error("          node scripts/export-stock-fixtures.ts");
  console.error("        and read the diff: every line of it is a number the Android app");
  console.error("        is asserting, so a change here is a change there.\n");
  process.exit(1);
}

writeFileSync(OUT, text);
console.log(`stock fixtures: ${built.cases.length} cases written to content/stock.fixtures.json`);
