#!/usr/bin/env node
/* ============================================================
   export-diet-fixtures.ts: the body and the energy, frozen.

       node scripts/export-diet-fixtures.ts          write
       node scripts/export-diet-fixtures.ts --check  fail on drift

   `shared/diet.ts` is the arithmetic and the Android app has a
   Kotlin port of it. Two implementations of the same equations do
   not stay in step by being written carefully, and this one is
   the worst of the three ported so far for the reason
   `export-calculator-fixtures.ts` gives: every number it produces
   is plausible. A resting burn computed with the wrong sex
   constant is 166 kcal out, which is a fifth of a deficit and
   looks exactly like a number.

   ---- what makes a case worth having ----

   Every function here has a BAND or a FLOOR in it, and a band is
   an `if`. The cases below are chosen to land on both sides of
   each one:

   - the two BMI tables, which differ at 23 and 27.5, so the same
     body is `healthy` under one and `raised` under the other and
     that is the whole reason `asian` exists;
   - waist to height at .4, .5 and .6;
   - Navy against Deurenberg, which needs a neck and a hip and
     answers null without them;
   - Mifflin against Katch, which is a different equation the
     moment lean mass is known;
   - and `target`, which is the one function in the file that can
     refuse: four floors, more than one of which can hold at once,
     and a small person on a fast rate hits two.

   `--check` is what CI runs, and it fails on a difference rather
   than rewriting: a generated file that quietly regenerates is a
   generated file that never disagrees with anything.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  ACTIVITY, BMI_CUTS, activityFactor, bmi, bmiBand, deurenbergFat,
  estimatedBurn, fatEstimate, ffmi, ffmiNormalised, fit, floorKcal, katch,
  KCAL_PER_KG, LEARN_AFTER_DAYS, learnedBurn, mifflin, navyFat, proteinFloor,
  restingBurn, slopePerWeek, target, toFeetInches, toStone, trend,
  TREND_HALF_LIFE_DAYS, UNLOGGED_SE_SHARE, whtr, whtrBand,
  type Body, type GoalKind, type Point,
} from "../shared/diet.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "content", "diet.fixtures.json");

interface Case {
  name: string;
  /** What this case is FOR. Not decoration: a case added later
      without one is a case nobody can tell is redundant. */
  why: string;
  body: Body;
  leanKg?: number;
  activity: string;
  kind: GoalKind;
  ratePct: number;
  maintenance?: number;
}

const CASES: Case[] = [
  {
    name: "middle",
    why: "an ordinary body in the middle of every band, so a drift "
      + "anywhere shows up somewhere",
    body: {
      heightCm: 172, weightKg: 74, ageYears: 34, sex: "male",
      ancestry: "asian", waistCm: 88, hipCm: 98, neckCm: 38,
    },
    activity: "light", kind: "lose", ratePct: 0.5,
  },
  {
    name: "the two tables disagree",
    why: "BMI 24.2: `healthy` on the general cut-offs and `raised` on "
      + "the Asian ones. This is the pair the whole `ancestry` field "
      + "exists for, and a port that read one table would pass every "
      + "other case here",
    body: {
      heightCm: 170, weightKg: 70, ageYears: 40, sex: "male",
      ancestry: "asian", waistCm: 86, hipCm: 96, neckCm: 37,
    },
    activity: "sedentary", kind: "lose", ratePct: 0.5,
  },
  {
    name: "the same body, general",
    why: "the other half of the pair above, one field different",
    body: {
      heightCm: 170, weightKg: 70, ageYears: 40, sex: "male",
      ancestry: "general", waistCm: 86, hipCm: 96, neckCm: 37,
    },
    activity: "sedentary", kind: "lose", ratePct: 0.5,
  },
  {
    name: "no tape",
    why: "waist, hip and neck all absent, which is most readers on "
      + "day one: Navy answers null and Deurenberg has to carry it",
    body: {
      heightCm: 165, weightKg: 62, ageYears: 29, sex: "female",
      ancestry: "asian",
    },
    activity: "moderate", kind: "maintain", ratePct: 0,
  },
  {
    name: "a woman with the full tape",
    why: "Navy needs the hip for a woman and does not for a man, which "
      + "is the one place the two sexes take different arguments",
    body: {
      heightCm: 160, weightKg: 58, ageYears: 31, sex: "female",
      ancestry: "asian", waistCm: 74, hipCm: 96, neckCm: 32,
    },
    leanKg: 40,
    activity: "light", kind: "lose", ratePct: 0.75,
  },
  {
    name: "lean mass known",
    why: "Katch instead of Mifflin, which is a different equation "
      + "rather than a correction to one",
    body: {
      heightCm: 180, weightKg: 82, ageYears: 27, sex: "male",
      ancestry: "general", waistCm: 84, hipCm: 100, neckCm: 40,
    },
    leanKg: 66,
    activity: "active", kind: "gain", ratePct: 0.25,
  },
  {
    name: "small and in a hurry",
    why: "the case that hits more than one floor: a small body on a "
      + "fast rate is capped by the rate AND lands under the resting "
      + "burn, and reporting only the last of them tells the reader "
      + "the wrong thing",
    body: {
      heightCm: 152, weightKg: 48, ageYears: 55, sex: "female",
      ancestry: "asian", waistCm: 72, hipCm: 90, neckCm: 31,
    },
    activity: "sedentary", kind: "lose", ratePct: 2.0,
  },
  {
    name: "already underweight",
    why: "the one refusal in the file: `lose` under the BMI floor "
      + "returns maintenance and says why",
    body: {
      heightCm: 175, weightKg: 52, ageYears: 24, sex: "male",
      ancestry: "asian", waistCm: 68, hipCm: 84, neckCm: 34,
    },
    activity: "moderate", kind: "lose", ratePct: 0.5,
  },
  {
    name: "waist to height, low",
    why: "under 0.4, which is a band most tools do not have and this "
      + "one does because it is a real reading rather than an error",
    body: {
      heightCm: 178, weightKg: 58, ageYears: 22, sex: "male",
      ancestry: "general", waistCm: 68, hipCm: 88, neckCm: 35,
    },
    activity: "very", kind: "gain", ratePct: 0.5,
  },
  {
    name: "waist to height, high",
    why: "over 0.6, the top band, on a body the BMI table also calls "
      + "high: the two agreeing is worth freezing as much as the two "
      + "disagreeing",
    body: {
      heightCm: 168, weightKg: 96, ageYears: 47, sex: "male",
      ancestry: "asian", waistCm: 112, hipCm: 110, neckCm: 43,
    },
    activity: "sedentary", kind: "lose", ratePct: 1.0,
  },
  {
    name: "maintenance, which is a phase",
    why: "`maintain` returns the maintenance figure with no offset "
      + "and no floors, and is not the absence of a goal",
    body: {
      heightCm: 172, weightKg: 68, ageYears: 36, sex: "female",
      ancestry: "asian", waistCm: 76, hipCm: 98, neckCm: 33,
    },
    activity: "moderate", kind: "maintain", ratePct: 0,
    maintenance: 2100,
  },
];

/** Every number one case produces, by name. */
const run = (c: Case) => {
  const body = c.body;
  const bmiValue = bmi(body.weightKg, body.heightCm);
  const resting = restingBurn(body, c.leanKg);
  const factor = activityFactor(c.activity);
  const estimate = estimatedBurn(resting.kcal, factor);
  const maintenance = c.maintenance ?? estimate;
  const fat = fatEstimate(body);
  const navy = navyFat(body);
  const lean = c.leanKg;

  return {
    why: c.why,
    body,
    leanKg: c.leanKg ?? null,
    activity: c.activity,
    factor,
    bmi: bmiValue,
    bmiBand: bmiBand(bmiValue, body.ancestry),
    whtr: body.waistCm == null ? null : whtr(body.waistCm, body.heightCm),
    whtrBand: body.waistCm == null ? null : whtrBand(whtr(body.waistCm, body.heightCm)),
    navyFat: navy,
    deurenbergFat: deurenbergFat(body),
    fat: {
      method: fat.method,
      se: fat.se,
      /* A RANGE and never a point, which is the whole reason
         this field is not a number: the Navy method is three
         to four points against DXA and worse at the extremes,
         and a port that flattened it to a midpoint would print
         a false precision the site refuses to. */
      pct: fat.pct,
      leanKg: fat.leanKg,
      fatKg: fat.fatKg,
    },
    ffmi: lean == null ? null : ffmi(lean, body.heightCm),
    ffmiNormalised: lean == null ? null : ffmiNormalised(lean, body.heightCm),
    mifflin: mifflin(body),
    katch: lean == null ? null : katch(lean),
    resting: { kcal: resting.kcal, method: resting.method },
    estimatedBurn: estimate,
    floorKcal: floorKcal(body.sex),
    target: target({
      body,
      maintenance,
      restingKcal: resting.kcal,
      kind: c.kind,
      ratePct: c.ratePct,
    }),
    proteinFloor: lean == null ? null : proteinFloor(lean, c.ratePct),
    stone: toStone(body.weightKg),
    feetInches: toFeetInches(body.heightCm),
  };
};

/* ------------------------------------------------------------
   The trend, which is the other half and has its own edges
   ------------------------------------------------------------

   `trend()` weights by ELAPSED TIME rather than by row, which is
   the whole difference between it and the version every tracker
   ships: a reader who weighs three times a week must not get a
   line that treats a three-week gap as the next day.

   `slopePerWeek()` fits the READINGS rather than the trend, and
   that is the least obvious decision in the file: an EWMA is the
   right estimator of a level and the wrong one for a rate, and
   seeded from the first reading it understates a real loss by
   roughly a third on a fortnight's data. In the FLATTERING
   direction, which is worse.

   So the histories below are chosen to make a port that got
   either of those wrong produce a different number:
   ------------------------------------------------------------ */

interface History {
  name: string;
  why: string;
  weights: Point[];
  intakes: Array<{ day: number; kcal: number }>;
}

/** Every morning for four weeks, losing steadily. */
const daily = (): Point[] =>
  Array.from({ length: 28 }, (_, d) => ({ day: d, kg: 82 - d * 0.07 }));

/** The same four weeks and the same trend, weighed on eight days
    of it: the gaps are uneven on purpose. */
const sparse = (): Point[] =>
  [0, 1, 6, 9, 17, 18, 25, 27].map((d) => ({ day: d, kg: 82 - d * 0.07 }));

const HISTORIES: History[] = [
  {
    name: "every morning",
    why: "the easy case, and the one every implementation agrees on",
    weights: daily(),
    intakes: Array.from({ length: 28 }, (_, d) => ({ day: d, kcal: 1900 + (d % 5) * 40 })),
  },
  {
    name: "eight readings in four weeks",
    why: "the same underlying trend on uneven gaps. A trend weighted "
      + "by ROW rather than by elapsed time produces a visibly "
      + "different line here and the same one above, so this is the "
      + "pair that catches it",
    weights: sparse(),
    intakes: [0, 1, 6, 9, 17, 18, 25, 27].map((d) => ({ day: d, kcal: 1900 + (d % 5) * 40 })),
  },
  {
    name: "three days logged in twenty",
    why: "the case the third error term exists for: identical intakes "
      + "on three days out of twenty used to give a NARROW band on a "
      + "figure computed as though the reader had eaten that on all "
      + "twenty",
    weights: Array.from({ length: 21 }, (_, d) => ({ day: d, kg: 90 - d * 0.05 })),
    intakes: [3, 11, 19].map((d) => ({ day: d, kcal: 2100 })),
  },
  {
    name: "two readings",
    why: "under the three a residual needs, so `fit` answers null "
      + "rather than a slope with no error bar",
    weights: [{ day: 0, kg: 80 }, { day: 5, kg: 79.4 }],
    intakes: [{ day: 0, kcal: 2000 }, { day: 5, kcal: 2000 }],
  },
  /* A boundary needs BOTH sides and the first draft of this had
     one. It was a single window 13 days wide, which is null under
     `<` and null under `<=` alike, so it asserted that a threshold
     exists and nothing at all about where it is. Reversing the
     comparison in the Kotlin port failed nothing. */
  {
    name: "one day short of a fortnight",
    why: "13 days wide against a `LEARN_AFTER_DAYS` of 14, so it "
      + "answers null. The near side of the boundary",
    weights: Array.from({ length: 14 }, (_, d) => ({ day: d, kg: 70 - d * 0.03 })),
    intakes: Array.from({ length: 14 }, (_, d) => ({ day: d, kcal: 1800 })),
  },
  {
    name: "a fortnight exactly, which is the threshold",
    why: "14 days wide, which is the FIRST window that answers. A "
      + "boundary written as `<` and ported as `<=` gives a number "
      + "here and null there, and nothing else in this file can "
      + "tell the two apart",
    weights: Array.from({ length: 15 }, (_, d) => ({ day: d, kg: 70 - d * 0.03 })),
    intakes: Array.from({ length: 15 }, (_, d) => ({ day: d, kcal: 1800 })),
  },
  {
    name: "gaining",
    why: "the sign, which is the one thing a formula that reads "
      + "correctly in prose comes out inverted for in code",
    weights: Array.from({ length: 30 }, (_, d) => ({ day: d, kg: 62 + d * 0.03 })),
    intakes: Array.from({ length: 30 }, (_, d) => ({ day: d, kcal: 2600 })),
  },
];

const runHistory = (h: History) => {
  const learned = learnedBurn(h.weights, h.intakes);
  return {
    why: h.why,
    weights: h.weights,
    intakes: h.intakes,
    trend: trend(h.weights),
    fit: fit(h.weights),
    slopePerWeek: slopePerWeek(h.weights),
    learned,
  };
};

const payload = {
  /* The tables as well as the answers. A port that computed every
     case correctly off a table it had copied wrongly would be a
     port that is right today and wrong the day a cut-off moves. */
  cuts: BMI_CUTS,
  activity: ACTIVITY.map((a) => ({ ...a })),
  cases: Object.fromEntries(CASES.map((c) => [c.name, run(c)])),
  histories: Object.fromEntries(HISTORIES.map((h) => [h.name, runHistory(h)])),
  /* The four numbers the trend is made of, by name. Every one of
     them is already implied by a history above, and naming them
     anyway is what turns "a history disagrees" into "the half-life
     is wrong": a port that reads 14 as `<=` and one that seeds the
     average from the wrong reading both fail the same case
     otherwise, and the reader of the failure has to work out
     which. */
  constants: {
    trendHalfLifeDays: TREND_HALF_LIFE_DAYS,
    kcalPerKg: KCAL_PER_KG,
    learnAfterDays: LEARN_AFTER_DAYS,
    unloggedSeShare: UNLOGGED_SE_SHARE,
  },
};

const text = `${JSON.stringify(payload, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const have = readFileSync(OUT, "utf8");
  if (have !== text) {
    console.error(
      "\ncontent/diet.fixtures.json has drifted from shared/diet.ts.\n\n"
      + "  Either the arithmetic changed on purpose, in which case run\n"
      + "  `node scripts/export-diet-fixtures.ts` and read the diff\n"
      + "  before committing it, or something moved that should not have.\n\n"
      + "  The Android port asserts against this file, so a number that\n"
      + "  changes here is a number that changes on a phone.\n",
    );
    process.exit(1);
  }
  console.log(
    `diet fixtures: ${CASES.length} cases and ${HISTORIES.length} histories, unchanged.`,
  );
} else {
  writeFileSync(OUT, text);
  console.log(
    `diet fixtures: ${CASES.length} cases and ${HISTORIES.length} histories written`,
  );
}
