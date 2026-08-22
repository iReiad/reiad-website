/* ============================================================
   diet.ts: the arithmetic of the diet tool, said once.

   `DIET.md` is the plan. This is the half more than one runtime
   has to agree about: the Next route renders it, the check
   asserts it, and the day either of those keeps its own copy of
   a formula is the day the page and the check stop describing
   the same tool.

   ---- the three rules under all of it ----

   NO FUNCTION HERE RETURNS A NUMBER IT CANNOT KNOW. An estimate
   comes back with the width of its own error beside it, and the
   caller cannot get the point value without seeing the range,
   because they are one object.

   THE FLOORS ARE NOT ADVISORY. `target()` cannot return a figure
   below `floorKcal()` or below resting burn, and it says which
   bound it hit. There is no argument that switches that off, and
   adding one would be adding a way to hurt somebody.

   NOTHING READS A SINGLE WEIGHT. Every slope, projection and
   learned figure is computed against `trend()`, because a scale
   reading is a real weight plus one to two kilos of water, gut
   contents and cycle, and `DIET.md` section 4 is the list.
   ============================================================ */

/* ---------------------------------------------------------- */
/* what a body is                                             */
/* ---------------------------------------------------------- */

/** Which of the two equations to use. Stored because Mifflin and
    the Navy method both need it and there is no honest way
    around that; asked for as "which formula should this use". */
export type Sex = "male" | "female";

/** Where the reader eats, which decides the portion library, the
    currency and the food search's ranking. NOT the BMI cut-off:
    that is `Ancestry`, because a Bangladeshi reader in Manchester
    needs the lower one and `place` would give them the higher. */
export type Place = "bd" | "uk";

/** Which BMI cut-off set applies. The WHO's 2004 consultation
    recommends lower action points for Asian populations, and the
    NHS says the same for South Asian, Chinese, Black African and
    African-Caribbean backgrounds. */
export type Ancestry = "general" | "asian";

export type Units = "metric" | "imperial";
export type GoalKind = "lose" | "maintain" | "gain";

/** An estimate, which is the only shape most of this file
    returns. `low` and `high` are the honest answer and `mid` is
    what a sentence uses; a caller that wants one number still
    has to have been handed the other two. */
export interface Range {
  low: number;
  mid: number;
  high: number;
}

const range = (mid: number, half: number): Range =>
  ({ low: mid - half, mid, high: mid + half });

/** What the reader has told the tool about their body. Only the
    first four are ever required: everything else unlocks a
    better estimate and its absence is answered with `null`
    rather than with a guess. */
export interface Body {
  heightCm: number;
  weightKg: number;
  ageYears: number;
  sex: Sex;
  ancestry: Ancestry;
  waistCm?: number;
  hipCm?: number;
  neckCm?: number;
}

/* ---------------------------------------------------------- */
/* BMI, and the two sets of cut-offs                          */
/* ---------------------------------------------------------- */

export type BmiBand = "under" | "healthy" | "raised" | "high";

/** The two tables. `general` is the familiar 25 and 30, derived
    from European populations; `asian` is the WHO's 2004 action
    points. A tool serving Bangladesh that quietly used the first
    would tell a large number of its readers they are fine when
    their own health service would not. */
export const BMI_CUTS: Record<Ancestry, { under: number; raised: number; high: number }> = {
  general: { under: 18.5, raised: 25.0, high: 30.0 },
  asian:   { under: 18.5, raised: 23.0, high: 27.5 },
};

export const bmi = (weightKg: number, heightCm: number): number =>
  weightKg / ((heightCm / 100) ** 2);

export function bmiBand(value: number, ancestry: Ancestry): BmiBand {
  const cut = BMI_CUTS[ancestry];
  if (value < cut.under) return "under";
  if (value < cut.raised) return "healthy";
  if (value < cut.high) return "raised";
  return "high";
}

/* ---------------------------------------------------------- */
/* waist to height, which leads                               */
/* ---------------------------------------------------------- */

export type WhtrBand = "low" | "healthy" | "raised" | "high";

/** Waist over height, same units. It needs one tape measure and
    no assumption about population, which is exactly the property
    BMI lacks, so it is the number shown first and BMI is shown
    beside it. */
export const whtr = (waistCm: number, heightCm: number): number => waistCm / heightCm;

export function whtrBand(value: number): WhtrBand {
  if (value < 0.4) return "low";
  if (value < 0.5) return "healthy";
  if (value < 0.6) return "raised";
  return "high";
}

/* ---------------------------------------------------------- */
/* body fat, with its error bars attached                     */
/* ---------------------------------------------------------- */

export type FatMethod = "navy" | "deurenberg";

export interface FatEstimate {
  method: FatMethod;
  /** Percentage points, one standard error. Printed as a range
      and never as a point: the Navy method is 3 to 4 points
      against DXA and worse at the extremes. */
  se: number;
  pct: Range;
  leanKg: number;
  fatKg: number;
}

/** At the same BMI, South Asians carry several points more fat
    than white Europeans, which is the same finding the lower BMI
    cut-off rests on. Applied to Deurenberg only: the Navy method
    measures the body rather than inferring from mass, so it does
    not inherit the bias. */
const DEURENBERG_ASIAN = 3.5;

/** The tape method. Needs neck and waist for men, plus hips for
    women. Returns null rather than a guess when a measurement is
    missing, and null when the logarithm's argument is not
    positive, which happens with a mistyped tape rather than with
    a real body. */
export function navyFat(b: Body): number | null {
  const { sex, heightCm, waistCm, neckCm, hipCm } = b;
  if (!waistCm || !neckCm || !heightCm) return null;
  const log10 = (n: number): number => Math.log10(n);
  if (sex === "male") {
    const girth = waistCm - neckCm;
    if (girth <= 0) return null;
    return 495 / (1.0324 - 0.19077 * log10(girth) + 0.15456 * log10(heightCm)) - 450;
  }
  if (!hipCm) return null;
  const girth = waistCm + hipCm - neckCm;
  if (girth <= 0) return null;
  return 495 / (1.29579 - 0.35004 * log10(girth) + 0.22100 * log10(heightCm)) - 450;
}

/** From BMI, for a reader with no tape. Worse, and it inherits
    every problem BMI has, which is why it is second. */
export function deurenbergFat(b: Body): number {
  const male = b.sex === "male" ? 1 : 0;
  const base = 1.20 * bmi(b.weightKg, b.heightCm) + 0.23 * b.ageYears - 10.8 * male - 5.4;
  return b.ancestry === "asian" ? base + DEURENBERG_ASIAN : base;
}

/** The tape if there is one, the equation if not, and the method
    named in the result so the page can say which it used. */
export function fatEstimate(b: Body): FatEstimate {
  const tape = navyFat(b);
  const method: FatMethod = tape === null ? "deurenberg" : "navy";
  const pct = tape === null ? deurenbergFat(b) : tape;
  const se = method === "navy" ? 3.5 : 5.0;
  const clamped = Math.min(Math.max(pct, 2), 70);
  const fatKg = (b.weightKg * clamped) / 100;
  return {
    method, se,
    pct: range(clamped, se),
    leanKg: b.weightKg - fatKg,
    fatKg,
  };
}

/** Fat free mass index: lean mass over height squared. The
    number that tells a lifter their BMI is lying. */
export const ffmi = (leanKg: number, heightCm: number): number =>
  leanKg / ((heightCm / 100) ** 2);

/** FFMI adjusted to a 1.8m frame, which is how the published
    reference values are stated. Without this a short lifter and
    a tall one cannot be compared to the same table. */
export const ffmiNormalised = (leanKg: number, heightCm: number): number =>
  ffmi(leanKg, heightCm) + 6.1 * (1.8 - heightCm / 100);

/* ---------------------------------------------------------- */
/* energy: the estimate, then the measurement                 */
/* ---------------------------------------------------------- */

export interface ActivityLevel {
  key: string;
  factor: number;
  en: string;
  bn: string;
}

/** A starting guess and nothing more. Self-reported activity is
    optimistic and self-reported intake is under-recorded, and
    both errors push the same way, which is the entire reason
    `learnedBurn()` exists. */
export const ACTIVITY: ActivityLevel[] = [
  { key: "sedentary", factor: 1.20, en: "Desk work, little walking", bn: "বসে কাজ, হাঁটা কম" },
  { key: "light",     factor: 1.375, en: "Light activity most days", bn: "প্রতিদিন হালকা চলাফেরা" },
  { key: "moderate",  factor: 1.55, en: "On your feet, or training three times a week", bn: "দাঁড়িয়ে কাজ, বা সপ্তাহে তিন দিন ব্যায়াম" },
  { key: "active",    factor: 1.725, en: "Physical work, or training most days", bn: "শারীরিক কাজ, বা প্রায় রোজ ব্যায়াম" },
  { key: "very",      factor: 1.90, en: "Heavy physical work and training", bn: "ভারী শারীরিক কাজ ও ব্যায়াম" },
];

export const activityFactor = (key: string): number =>
  ACTIVITY.find((a) => a.key === key)?.factor ?? 1.2;

export const mifflin = (b: Body): number =>
  10 * b.weightKg + 6.25 * b.heightCm - 5 * b.ageYears + (b.sex === "male" ? 5 : -161);

export const katch = (leanKg: number): number => 370 + 21.6 * leanKg;

export interface Resting {
  kcal: number;
  method: "mifflin" | "katch";
}

/** Katch the moment lean mass is known, because it works from
    lean mass and therefore does not have to guess at
    composition. Mifflin otherwise, being the best validated
    equation for a general population. */
export function restingBurn(b: Body, leanKg?: number): Resting {
  if (typeof leanKg === "number" && leanKg > 0) {
    return { kcal: katch(leanKg), method: "katch" };
  }
  return { kcal: mifflin(b), method: "mifflin" };
}

export const estimatedBurn = (restingKcal: number, factor: number): number =>
  restingKcal * factor;

/* ---------------------------------------------------------- */
/* the trend, which is the only signal                        */
/* ---------------------------------------------------------- */

/** One reading. `day` is a whole number of days from any fixed
    origin: the caller decides which, and this file never touches
    a clock, so a check can seed it and a route can seed it and
    both get the same answer. */
export interface Point {
  day: number;
  kg: number;
}

/** About a week, which puts the daily weight on roughly a tenth
    of each new reading. Named rather than typed into `trend()`
    because `DIET.md` states it and a check reads it. */
export const TREND_HALF_LIFE_DAYS = 7;

/** An exponentially weighted moving average, weighted by ELAPSED
    TIME rather than by row.

    That is the whole difference between this and the version
    every tracker ships. Weighting by row treats a reading three
    weeks after the last one as the next day's, so a reader who
    weighs three times a week gets a trend that is confidently
    wrong instead of correct with a wider band. Seeded from the
    first reading, so the first point is itself. */
export function trend(points: Point[], halfLifeDays = TREND_HALF_LIFE_DAYS): Point[] {
  const sorted = [...points].sort((a, b) => a.day - b.day);
  const out: Point[] = [];
  let value = 0;
  let last = 0;
  sorted.forEach((p, i) => {
    if (i === 0) {
      value = p.kg;
      last = p.day;
    } else {
      const dt = Math.max(p.day - last, 0);
      const alpha = 1 - Math.exp((-Math.LN2 * dt) / halfLifeDays);
      value += alpha * (p.kg - value);
      last = p.day;
    }
    out.push({ day: p.day, kg: value });
  });
  return out;
}

export interface Fit {
  /** Change per day. Negative is loss. */
  slope: number;
  intercept: number;
  /** The standard error of the slope, which is what every band
      drawn downstream of this is made of. */
  se: number;
  n: number;
}

/** Ordinary least squares of kg against day. Needs three points
    to have a residual to measure, so two returns null rather
    than a slope with no error bar, which is the shape this file
    refuses everywhere else. */
export function fit(points: Point[]): Fit | null {
  const n = points.length;
  if (n < 3) return null;
  const mx = points.reduce((s, p) => s + p.day, 0) / n;
  const my = points.reduce((s, p) => s + p.kg, 0) / n;
  const sxx = points.reduce((s, p) => s + (p.day - mx) ** 2, 0);
  if (sxx === 0) return null;
  const sxy = points.reduce((s, p) => s + (p.day - mx) * (p.kg - my), 0);
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const rss = points.reduce((s, p) => s + (p.kg - (intercept + slope * p.day)) ** 2, 0);
  const se = Math.sqrt(rss / (n - 2) / sxx);
  return { slope, intercept, se, n };
}

/** Kilograms per week, with its own error.

    FITTED TO THE READINGS, NOT TO THE TREND, and that is not the
    obvious choice so it is written down.

    An exponentially weighted average is the right estimator of a
    LEVEL and the wrong one for a RATE. Seeded from the first
    reading it lags the true line by about 1.44 half-lives while
    the transient settles, so on a fortnight's data its endpoints
    understate a real loss by roughly a third, and its own fitted
    slope understates it too. Nothing about that is visible: the
    line looks right, the number is wrong, and it is wrong in the
    flattering direction, which would make the tool report a
    smaller deficit than the reader is running.

    Ordinary least squares over the readings has no lag. The
    noise `trend()` exists to suppress is what its standard error
    is measuring, so the band comes out honestly wide on a
    reader who weighs erratically and honestly narrow on one who
    weighs every morning. `trend()` is still what a page draws
    and still what "your trend weight today" means. */
export function slopePerWeek(points: Point[]): Range | null {
  const f = fit(points);
  if (!f) return null;
  return range(f.slope * 7, 1.96 * f.se * 7);
}

/* ---------------------------------------------------------- */
/* the learned maintenance, which is the tool's best feature  */
/* ---------------------------------------------------------- */

/** The standard approximation for a kilogram of body tissue.
    Right for fat and wrong for water, which is precisely why
    everything here reads the trend. */
export const KCAL_PER_KG = 7700;

/** Fourteen days before this is shown at all. A shorter window
    is mostly the first week's water, and the whole point of this
    figure is that it is not that. */
export const LEARN_AFTER_DAYS = 14;

export interface Learned {
  kcal: Range;
  /** Days spanned, and days with an intake logged. The second
      over the first is what widens the band and what the page
      prints beside the number. */
  days: number;
  logged: number;
  meanIntake: number;
  /** Signed, from the trend. Negative is loss. */
  trendKgPerWeek: number;
}

/** What this reader appears to burn, given what they appear to
    eat.

        burn = mean intake − (trend change in kg × 7700) / days

    MINUS a signed change, because a loss is a negative delta and
    a deficit is a positive addition to intake. Writing it as a
    plus and meaning the magnitude is how a formula that reads
    correctly in prose comes out inverted in code.

    It absorbs metabolic adaptation, a wrong activity guess and
    consistent under-logging into one honest number, and the gap
    between it and `estimatedBurn()` IS the under-logging
    estimate. Returns null before `LEARN_AFTER_DAYS`. */
export function learnedBurn(
  weights: Point[],
  intakes: { day: number; kcal: number }[],
): Learned | null {
  const sorted = [...weights].sort((a, b) => a.day - b.day);
  if (sorted.length < 3) return null;
  const from = sorted[0].day;
  const to = sorted[sorted.length - 1].day;
  const days = to - from;
  if (days < LEARN_AFTER_DAYS) return null;

  const kept = intakes.filter((i) => i.day >= from && i.day <= to && i.kcal > 0);
  if (kept.length < 2) return null;

  const f = fit(sorted);
  if (!f) return null;
  const meanIntake = kept.reduce((s, i) => s + i.kcal, 0) / kept.length;
  /* The change the regression implies over the window, not the
     difference between two trend points: `slopePerWeek()` says
     why. */
  const deltaKg = f.slope * days;
  const kcal = meanIntake - (deltaKg * KCAL_PER_KG) / days;

  /* Two independent errors, added in quadrature: how well the
     mean intake is known, and how well the slope is. The second
     dominates on a short window and the first dominates on a
     patchy log, which is the correct behaviour in both cases. */
  const varIntake = kept.reduce((s, i) => s + (i.kcal - meanIntake) ** 2, 0)
    / (kept.length - 1);
  const seIntake = Math.sqrt(varIntake / kept.length);
  const seSlope = f.se * KCAL_PER_KG;
  const se = Math.sqrt(seIntake ** 2 + seSlope ** 2);

  return {
    kcal: range(kcal, 1.96 * se),
    days,
    logged: kept.length,
    meanIntake,
    trendKgPerWeek: f.slope * 7,
  };
}

/* ---------------------------------------------------------- */
/* the goal engine, and the floors it will not cross          */
/* ---------------------------------------------------------- */

export interface Rate {
  key: "gentle" | "standard" | "hard";
  /** Percent of bodyweight per week. A percentage rather than a
      number of kilos, because half a kilo a week is gentle at
      110kg and severe at 55kg. */
  low: number;
  high: number;
  en: string;
  bn: string;
}

export const RATES: Rate[] = [
  { key: "gentle",   low: 0.25, high: 0.5,  en: "Gentle", bn: "ধীরে" },
  { key: "standard", low: 0.5,  high: 0.75, en: "Steady", bn: "মাঝারি" },
  { key: "hard",     low: 0.75, high: 1.0,  en: "Fast",   bn: "দ্রুত" },
];

/** A ceiling, and the reason is medical rather than
    motivational: loss faster than about 1.5kg a week measurably
    raises the risk of gallstones, and the people most likely to
    try it are already the people most at risk. */
export const MAX_LOSS_PCT_PER_WEEK = 1.0;

/** A surplus above roughly this adds fat faster than any body
    adds muscle, whatever the training. */
export const MAX_GAIN_PCT_PER_WEEK = 0.5;

/** The absolute stop. Below this the tool declines and says why.
    It is not a warning and there is no argument that lifts it. */
export const floorKcal = (sex: Sex): number => (sex === "male" ? 1500 : 1200);

/** No loss goal at all below this, on either set of cut-offs. */
export const NO_LOSS_BELOW_BMI = 18.5;

export type FloorHit = "absolute" | "resting" | "rate" | "underweight";

export interface Target {
  kcal: number;
  /** Signed against maintenance. Negative is a deficit. */
  offset: number;
  /** EVERY bound that bound, in the order they were applied, and
      empty when the requested rate was deliverable.

      A list rather than one value, because more than one can
      hold at once and reporting only the last of them is how a
      reader gets told "we stopped at your resting burn" without
      being told their rate was capped first. A small person on a
      fast rate hits both, which is exactly the reader these
      exist for. */
  floors: FloorHit[];
  /** What the rate actually works out at after any clamping, as
      a percentage of bodyweight per week. */
  ratePct: number;
}

/** The one function in this file that can refuse.

    It clamps in a fixed order and reports which bound it hit,
    because "we gave you 1500 instead of 1100" is a fact the
    reader needs and a silent clamp is a lie of omission. */
export function target(opts: {
  body: Body;
  /** Maintenance: the learned figure where there is one, the
      estimate before that. */
  maintenance: number;
  restingKcal: number;
  kind: GoalKind;
  /** Requested percent of bodyweight per week. */
  ratePct: number;
}): Target {
  const { body, maintenance, restingKcal, kind, ratePct } = opts;
  const value = bmi(body.weightKg, body.heightCm);

  if (kind === "maintain") {
    return { kcal: Math.round(maintenance), offset: 0, floors: [], ratePct: 0 };
  }

  if (kind === "lose" && value < NO_LOSS_BELOW_BMI) {
    return {
      kcal: Math.round(maintenance), offset: 0, floors: ["underweight"], ratePct: 0,
    };
  }

  const cap = kind === "lose" ? MAX_LOSS_PCT_PER_WEEK : MAX_GAIN_PCT_PER_WEEK;
  const floors: FloorHit[] = [];
  let rate = Math.abs(ratePct);
  if (rate > cap) { rate = cap; floors.push("rate"); }

  const kgPerWeek = (body.weightKg * rate) / 100;
  const perDay = (kgPerWeek * KCAL_PER_KG) / 7;

  let kcal = kind === "lose" ? maintenance - perDay : maintenance + perDay;
  if (kind === "lose") {
    if (kcal < restingKcal) { kcal = restingKcal; floors.push("resting"); }
    const hard = floorKcal(body.sex);
    if (kcal < hard) { kcal = hard; floors.push("absolute"); }
  }

  const delivered = Math.abs(kcal - maintenance) * 7 / KCAL_PER_KG;
  return {
    kcal: Math.round(kcal),
    offset: Math.round(kcal - maintenance),
    floors,
    ratePct: body.weightKg > 0 ? (delivered / body.weightKg) * 100 : 0,
  };
}

/** Grams per kilogram of LEAN mass, rising with the depth of the
    deficit, because protein is what decides whether the weight
    lost is fat or muscle. Returned as a range: the low end is
    the floor and the high end is where there is nothing further
    to gain. */
export function proteinFloor(leanKg: number, ratePct: number): Range {
  const span = Math.min(Math.max(ratePct, 0.25), 1.0);
  const perKg = 1.6 + ((span - 0.25) / 0.75) * 0.6;
  return { low: leanKg * 1.6, mid: leanKg * perKg, high: leanKg * 2.2 };
}

/** Weeks to a goal, as a band that widens with distance, from
    this reader's own observed variance. Never a date: "you will
    reach 70kg on 4 March" is a lie with a date on it.

    Returns null when the trend is going the wrong way or is
    indistinguishable from flat, because a projection off a slope
    whose error bar spans zero is a number with no content. */
export function projection(opts: {
  currentKg: number;
  goalKg: number;
  weekly: Range;
}): Range | null {
  const { currentKg, goalKg, weekly } = opts;
  const togo = goalKg - currentKg;
  if (togo === 0) return { low: 0, mid: 0, high: 0 };

  /* THE WHOLE BAND HAS TO POINT THE SAME WAY. A rate of "0.3 kg
     a week either way" is a rate that has not been measured, and
     dividing by its optimistic end produces a confident number
     of weeks out of data that cannot tell loss from gain. It is
     the one input that makes this function lie, so it is the
     first thing refused. */
  if (weekly.low <= 0 && weekly.high >= 0) return null;
  if (togo < 0 ? weekly.high > 0 : weekly.low < 0) return null;

  const fastest = togo < 0 ? weekly.low : weekly.high;
  const slowest = togo < 0 ? weekly.high : weekly.low;
  return {
    low: togo / fastest,
    mid: togo / weekly.mid,
    high: togo / slowest,
  };
}

/* ---------------------------------------------------------- */
/* keto's water, which is the whole of its first fortnight    */
/* ---------------------------------------------------------- */

/** The first fourteen days of a keto phase are excluded from the
    trend's slope, because what leaves in them is water. */
export const KETO_ADAPTATION_DAYS = 14;

/** Roughly 400 to 500g of glycogen at about 3g of water each.
    The number the tool states BEFORE week one rather than
    explaining after week two, which is when people quit. */
export const KETO_WEEK_ONE_KG: Range = { low: 1.5, mid: 1.75, high: 2.0 };

/** Points inside an adaptation window, for a slope that should
    not see them. Everything is still drawn: excluded from the
    fit is not hidden from the reader. */
export const outsideAdaptation = (
  points: Point[], startDay: number, days = KETO_ADAPTATION_DAYS,
): Point[] => points.filter((p) => p.day < startDay || p.day >= startDay + days);

/* ---------------------------------------------------------- */
/* units, because half the readers are in stone               */
/* ---------------------------------------------------------- */

export const KG_PER_LB = 0.45359237;

export const toStone = (kg: number): { st: number; lb: number } => {
  const total = kg / KG_PER_LB;
  const st = Math.floor(total / 14);
  return { st, lb: Math.round((total - st * 14) * 10) / 10 };
};

/** `12 st 4 lb`, never `12.3 st`, which is a number no British
    person has ever said out loud. */
export const stoneLabel = (kg: number): string => {
  const { st, lb } = toStone(kg);
  return `${st} st ${Math.round(lb)} lb`;
};

export const toFeetInches = (cm: number): { ft: number; inch: number } => {
  const total = cm / 2.54;
  const ft = Math.floor(total / 12);
  return { ft, inch: Math.round((total - ft * 12) * 10) / 10 };
};
