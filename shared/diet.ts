/* ============================================================
   diet.ts: the arithmetic of the diet tool, said once. `DIET.md`
   is the plan; a route or a check keeping its own copy of a
   formula here is a page and a check describing two tools.

   Three rules under all of it:

   NO FUNCTION HERE RETURNS A NUMBER IT CANNOT KNOW. An estimate
   comes back as a `Range`, so a caller cannot take the point
   value without its width.

   THE FLOORS ARE NOT ADVISORY. `target()` cannot return a figure
   below `floorKcal()` or below resting burn, and it says which
   bound it hit. No argument switches that off.

   NOTHING READS A SINGLE WEIGHT. Every slope, projection and
   learned figure is computed against `trend()`: a scale reading
   is a real weight plus one to two kilos of water and gut.
   ============================================================ */

/* ---------------------------------------------------------- */
/* what a body is                                             */
/* ---------------------------------------------------------- */

/** Which of the two equations to use: Mifflin and the Navy
    method both need it. */
export type Sex = "male" | "female";

/** Where the reader eats: the portion library, the currency and
    the food search's ranking. NOT the BMI cut-off, which is
    `Ancestry`: a Bangladeshi reader in Manchester needs the
    lower cut-off and `place` would give them the higher. */
export type Place = "bd" | "uk";

/** Which BMI cut-off set applies. The WHO's 2004 consultation
    recommends lower action points for Asian populations. */
export type Ancestry = "general" | "asian";

export type Units = "metric" | "imperial";
export type GoalKind = "lose" | "maintain" | "gain";

/** An estimate, which is the only shape most of this file
    returns. A caller that wants one number still has to have
    been handed the other two. */
export interface Range {
  low: number;
  mid: number;
  high: number;
}

const range = (mid: number, half: number): Range =>
  ({ low: mid - half, mid, high: mid + half });

/** Only the first four are ever required. Everything else
    unlocks a better estimate, and its absence is answered with
    `null` rather than with a guess. */
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

/** `general` is the familiar 25 and 30, from European
    populations; `asian` is the WHO's 2004 action points. Using
    the first for a South Asian reader tells them they are fine
    where their own health service would not. */
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

/** Waist over height, same units. One tape measure and no
    assumption about population, which BMI cannot manage, so it
    is the number shown first. */
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
    than white Europeans. Deurenberg only: the Navy method
    measures the body rather than inferring from mass. */
const DEURENBERG_ASIAN = 3.5;

/** The tape method: neck and waist for men, plus hips for
    women. Null rather than a guess where a measurement is
    missing, and null where the logarithm's argument is not
    positive, which is a mistyped tape. */
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

/** From BMI, for a reader with no tape. It inherits every
    problem BMI has, which is why it is second. */
export function deurenbergFat(b: Body): number {
  const male = b.sex === "male" ? 1 : 0;
  const base = 1.20 * bmi(b.weightKg, b.heightCm) + 0.23 * b.ageYears - 10.8 * male - 5.4;
  return b.ancestry === "asian" ? base + DEURENBERG_ASIAN : base;
}

/** The tape if there is one, the equation if not, with the
    method named so the page can say which it used. */
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

/** Fat free mass index: lean mass over height squared. */
export const ffmi = (leanKg: number, heightCm: number): number =>
  leanKg / ((heightCm / 100) ** 2);

/** FFMI adjusted to a 1.8m frame, which is how the published
    reference values are stated. */
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

/** A starting guess and nothing more: self-reported activity is
    optimistic and self-reported intake under-recorded, and both
    errors push the same way. `learnedBurn()` is the answer. */
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

/** Katch the moment lean mass is known, since it does not have
    to guess at composition. Mifflin otherwise. */
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

/** One reading. `day` is a whole number of days from an origin
    the CALLER owns: nothing in this file touches a clock, so a
    check and a route seed it and get the same answer. */
export interface Point {
  day: number;
  kg: number;
}

/** About a week. Named rather than typed into `trend()`,
    because `DIET.md` states it and a check reads it. */
export const TREND_HALF_LIFE_DAYS = 7;

/** An exponentially weighted moving average, weighted by ELAPSED
    TIME rather than by row: weighting by row treats a reading
    three weeks after the last as the next day's, so a reader who
    weighs three times a week gets a trend that is confidently
    wrong. Seeded from the first reading. */
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
  /** The standard error of the slope, which every band drawn
      downstream of this is made of. */
  se: number;
  n: number;
}

/** Ordinary least squares of kg against day. Three points to
    have a residual to measure, so two returns null rather than a
    slope with no error bar. */
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

    FITTED TO THE READINGS, NOT TO THE TREND. An EWMA is the
    right estimator of a LEVEL and the wrong one for a RATE: it
    lags by about 1.44 half-lives while the transient settles, so
    on a fortnight's data it understates a real loss by roughly a
    third, in the flattering direction, and the line still looks
    right. `trend()` remains what a page draws. */
export function slopePerWeek(points: Point[]): Range | null {
  const f = fit(points);
  if (!f) return null;
  return range(f.slope * 7, 1.96 * f.se * 7);
}

/* ---------------------------------------------------------- */
/* the learned maintenance, which is the tool's best feature  */
/* ---------------------------------------------------------- */

/** The standard approximation for a kilogram of body tissue.
    Right for fat and wrong for water, which is why everything
    here reads the trend. */
export const KCAL_PER_KG = 7700;

/** Fourteen days before this is shown at all: a shorter window
    is mostly the first week's water. */
export const LEARN_AFTER_DAYS = 14;

/** What a day nobody wrote down is worth in uncertainty, as a
    share of the mean intake. Self-reported intake is
    under-recorded by 20 to 30 per cent, so a day with no entry
    at all is unknown to about that much. */
export const UNLOGGED_SE_SHARE = 0.25;

export interface Learned {
  kcal: Range;
  /** Days spanned, and days with an intake logged. The second
      over the first widens the band. */
  days: number;
  logged: number;
  meanIntake: number;
  /** Signed, from the trend. Negative is loss. */
  trendKgPerWeek: number;
}

/** What this reader appears to burn, given what they appear to
    eat.

        burn = mean intake − (trend change in kg × 7700) / days

    MINUS a SIGNED change: a loss is a negative delta and a
    deficit is a positive addition to intake. Writing it as a
    plus and meaning the magnitude inverts it.

    The gap between this and `estimatedBurn()` IS the
    under-logging estimate. Null before `LEARN_AFTER_DAYS`. */
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
  /* The change the REGRESSION implies over the window, not the
     difference between two trend points: `slopePerWeek()` says
     why. */
  const deltaKg = f.slope * days;
  const kcal = meanIntake - (deltaKg * KCAL_PER_KG) / days;

  /* Three independent errors in quadrature: the mean intake,
     the slope, and how much of the window was written down at
     all. THE THIRD IS THE DAYS THAT ARE NOT THERE: the first two
     are computed from the rows that exist, so without it a
     reader who logs three days in twenty gets a narrow band on a
     figure worked out as though they ate that on all twenty. */
  const varIntake = kept.reduce((s, i) => s + (i.kcal - meanIntake) ** 2, 0)
    / (kept.length - 1);
  const seIntake = Math.sqrt(varIntake / kept.length);
  const seSlope = f.se * KCAL_PER_KG;
  const covered = Math.min(kept.length / (days + 1), 1);
  const seUnlogged = UNLOGGED_SE_SHARE * meanIntake * (1 - covered);
  const se = Math.sqrt(seIntake ** 2 + seSlope ** 2 + seUnlogged ** 2);

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
  /** Percent of bodyweight per week, not kilos: half a kilo a
      week is gentle at 110kg and severe at 55kg. */
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

/** A ceiling, and the reason is medical: loss faster than about
    1.5kg a week measurably raises the risk of gallstones. */
export const MAX_LOSS_PCT_PER_WEEK = 1.0;

/** A surplus above roughly this adds fat faster than any body
    adds muscle, whatever the training. */
export const MAX_GAIN_PCT_PER_WEEK = 0.5;

/** The same ceiling in kilocalories, and the one that binds on
    a large reader: half a per cent of 130kg is 715 kcal a day,
    which is the bulk `MAX_GAIN_PCT_PER_WEEK` means to refuse.
    `target()` applies both. */
export const MAX_SURPLUS_KCAL = 500;

/** The gentlest rate the table offers, which is what a
    maintenance band offers when it has been left. Read out of
    `RATES` so a fourth row cannot make it stale. */
export const LOWEST_RATE_PCT = Math.min(...RATES.map((r) => r.low));

/** The absolute stop. Below this the tool declines and says
    why; no argument lifts it. */
export const floorKcal = (sex: Sex): number => (sex === "male" ? 1500 : 1200);

/** No loss goal at all below this, on either set of cut-offs. */
export const NO_LOSS_BELOW_BMI = 18.5;

export type FloorHit = "absolute" | "resting" | "rate" | "underweight" | "surplus";

export interface Target {
  kcal: number;
  /** Signed against maintenance. Negative is a deficit. */
  offset: number;
  /** EVERY bound that bound, in the order applied, and empty
      where the requested rate was deliverable. A list, because
      more than one can hold at once and a small person on a fast
      rate hits both. */
  floors: FloorHit[];
  /** What the rate actually works out at after any clamping, as
      a percentage of bodyweight per week. */
  ratePct: number;
}

/** The one function in this file that can refuse. It clamps in
    a fixed order and reports which bound it hit: a silent clamp
    is a lie of omission. */
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
  } else {
    /* THE SURPLUS CEILING IS NOT THE RATE CEILING: on a large
       reader the rate is a proxy for `MAX_SURPLUS_KCAL` and
       drifts above it past about 100kg. */
    const top = maintenance + MAX_SURPLUS_KCAL;
    if (kcal > top) { kcal = top; floors.push("surplus"); }
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
    deficit. The low end is the floor, the high end is where
    there is nothing further to gain. */
export function proteinFloor(leanKg: number, ratePct: number): Range {
  const span = Math.min(Math.max(ratePct, 0.25), 1.0);
  const perKg = 1.6 + ((span - 0.25) / 0.75) * 0.6;
  return { low: leanKg * 1.6, mid: leanKg * perKg, high: leanKg * 2.2 };
}

/** Weeks to a goal, as a band that widens with distance. Never
    a date. Null where the trend is going the wrong way or is
    indistinguishable from flat: a projection off a slope whose
    error bar spans zero has no content. */
export function projection(opts: {
  currentKg: number;
  goalKg: number;
  weekly: Range;
}): Range | null {
  const { currentKg, goalKg, weekly } = opts;
  const togo = goalKg - currentKg;
  if (togo === 0) return { low: 0, mid: 0, high: 0 };

  /* THE WHOLE BAND HAS TO POINT THE SAME WAY. "0.3 kg a week
     either way" is a rate nobody has measured, and dividing by
     its optimistic end is a confident number of weeks out of
     data that cannot tell loss from gain. */
  if (weekly.low <= 0 && weekly.high >= 0) return null;
  if (togo < 0 ? weekly.high > 0 : weekly.low < 0) return null;

  const fastest = togo < 0 ? weekly.low : weekly.high;
  const slowest = togo < 0 ? weekly.high : weekly.low;
  /* A `Range` built by hand can carry a mid of zero between two
     same-signed bounds, and dividing by it puts `-Infinity
     weeks` on the page. The bounds are already checked. */
  const mid = weekly.mid !== 0 && Math.sign(weekly.mid) === Math.sign(fastest)
    ? weekly.mid : (fastest + slowest) / 2;
  return {
    low: togo / fastest,
    mid: togo / mid,
    high: togo / slowest,
  };
}

/* ---------------------------------------------------------- */
/* keto's water, which is the whole of its first fortnight    */
/* ---------------------------------------------------------- */

/** The first fourteen days of a keto phase are excluded from the
    trend's slope: what leaves in them is water. */
export const KETO_ADAPTATION_DAYS = 14;

/** Roughly 400 to 500g of glycogen at about 3g of water each.
    Stated BEFORE week one rather than explained after week
    two. */
export const KETO_WEEK_ONE_KG: Range = { low: 1.5, mid: 1.75, high: 2.0 };

/** Points inside an adaptation window, for a slope that should
    not see them. Excluded from the fit is not hidden from the
    reader: everything is still drawn. */
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

/** `12 st 4 lb`, never `12.3 st`. */
export const stoneLabel = (kg: number): string => {
  const { st, lb } = toStone(kg);
  return `${st} st ${Math.round(lb)} lb`;
};

export const toFeetInches = (cm: number): { ft: number; inch: number } => {
  const total = cm / 2.54;
  const ft = Math.floor(total / 12);
  return { ft, inch: Math.round((total - ft * 12) * 10) / 10 };
};

/* ---------------------------------------------------------- */
/* changing what you are doing, mid-flight                    */
/* ---------------------------------------------------------- */

/** What somebody is doing. `fast` is a protocol rather than a
    mark because it has to be a span: what it does to the scale
    depends on how long it ran and what ran before it.

    A fourteenth needs a row in `WATER` below, which is keyed by
    this type, so the compiler asks. */
export type Protocol =
  | "standard" | "keto" | "lowfat" | "highprotein" | "med"
  | "window" | "5:2" | "omad" | "fast" | "ramadan"
  | "maintain" | "gain" | "break";

/** What each one is called, in both languages, once. A panel
    naming its own is a second table, and the day they disagree
    one page calls a thing a fast and another does not. */
export const PROTOCOL_NAMES: Array<{ id: Protocol; en: string; bn: string }> = [
  { id: "standard",    en: "An ordinary deficit", bn: "সাধারণ ঘাটতি" },
  { id: "keto",        en: "Keto",                bn: "কিটো" },
  { id: "lowfat",      en: "Low fat",             bn: "কম চর্বি" },
  { id: "highprotein", en: "High protein",        bn: "বেশি প্রোটিন" },
  { id: "med",         en: "Mediterranean",       bn: "ভূমধ্যসাগরীয় ধরন" },
  { id: "window",      en: "An eating window",    bn: "সময় বেঁধে খাওয়া" },
  { id: "5:2",         en: "5:2",                 bn: "৫:২" },
  { id: "omad",        en: "One meal a day",      bn: "দিনে এক বেলা" },
  { id: "fast",        en: "A complete fast",     bn: "পূর্ণ উপবাস" },
  { id: "ramadan",     en: "Ramadan",             bn: "রমজান" },
  { id: "maintain",    en: "Maintaining",         bn: "ধরে রাখা" },
  { id: "gain",        en: "Gaining",             bn: "ওজন বাড়ানো" },
  { id: "break",       en: "A diet break",        bn: "বিরতি" },
];

export const protocolName = (p: Protocol): { en: string; bn: string } =>
  PROTOCOL_NAMES.find((r) => r.id === p) ?? { en: p, bn: p };

/** Glycogen, in kilograms, scaled to bodyweight rather than
    fixed at 400 to 500 grams, which is a third too high for a
    55kg person. Roughly 0.55% across muscle and liver. */
export const glycogenKg = (weightKg: number): number => 0.0055 * weightKg;

/** Each gram of glycogen is held with about three grams of
    water, so emptying the store moves four times its mass. */
export const GLYCOGEN_WATER_RATIO = 3;

/** What a fed gut holds: not water and not fat, and on a two day
    fast it is a kilogram of the drop. */
const GUT_KG: Range = { low: 0.5, mid: 0.9, high: 1.5 };

/** What sodium does to a glycogen figure, as a multiplier.
    Inside the range rather than its own number, because nothing
    here can measure it. ONE TABLE: the drain, the rebound and
    the refill are the same fact read three ways. */
const WITH_SODIUM: Range = { low: 0.8, mid: 1.15, high: 1.5 };

/** What a protocol takes off that is not fat.

    ONE ROW PER PROTOCOL, AND THE TABLE IS TOTAL: an absent row
    reads as a measurement of zero, so a protocol missing from it
    is forecast as a drop that is 100% fat.
    `Record<Protocol, ...>` makes the compiler ask. */
interface Water {
  /** Days. How fast the glycogen store drains under it. */
  tau: number;
  /** How much of the store it empties in the end. One for the
      two that clear it, a fraction for the rest: eating less
      LOWERS the store and does not empty it. */
  share: number;
  /** How much of `GUT_KG` it eventually takes. */
  gut: number;
  /** Whether the two above scale with HOW MUCH LESS is eaten.
      False where the water follows the carbohydrate rather than
      the energy: keto empties the store on maintenance calories
      and a fast empties it by definition. */
  byDeficit: boolean;
}

const WATER: Record<Protocol, Water> = {
  keto:        { tau: 2.0, share: 1,   gut: 0,    byDeficit: false },
  fast:        { tau: 0.8, share: 1,   gut: 1,    byDeficit: false },
  omad:        { tau: 6.0, share: 1,   gut: 0.35, byDeficit: false },
  "5:2":       { tau: 8.0, share: 1,   gut: 0.15, byDeficit: false },
  window:      { tau: 5.0, share: 0.7, gut: 0.4,  byDeficit: true },
  ramadan:     { tau: 4.0, share: 0.7, gut: 0.5,  byDeficit: true },
  standard:    { tau: 3.0, share: 0.6, gut: 0.6,  byDeficit: true },
  lowfat:      { tau: 3.0, share: 0.6, gut: 0.6,  byDeficit: true },
  highprotein: { tau: 3.0, share: 0.6, gut: 0.6,  byDeficit: true },
  med:         { tau: 3.0, share: 0.6, gut: 0.6,  byDeficit: true },
  /* Not a deficit, so nothing is emptied. A surplus and a break
     REFILL the store, which is the `rebound` half, so these
     three get no fat share rather than a flattering one. */
  maintain:    { tau: 0,   share: 0,   gut: 0,    byDeficit: false },
  gain:        { tau: 0,   share: 0,   gut: 0,    byDeficit: false },
  break:       { tau: 0,   share: 0,   gut: 0,    byDeficit: false },
};

/** The deepest cut this tool will ever set, as a fraction of
    maintenance: `floorKcal("male")` against a maintenance of
    about 2,550 is 41%, and `target()` hands nobody less. A
    deficit's water term is at full size there. */
const FULL_CUT = 0.4;

/** Days for the gut to reach its new level: a transit time
    rather than a preference. */
const GUT_DAYS = 2;

/** How much less is being eaten, as a fraction of maintenance. */
const cutOf = (intake: number, burn: number): number =>
  burn > 0 ? Math.min(Math.max((burn - intake) / burn, 0), 1) : 0;

/** How far into its own water term a protocol gets at this depth
    of cut. `null` is NOT zero and not one: the depth is unknown,
    and an unknown protocol is credited with no water rather than
    a guess, because crediting it makes the NEW drop look more
    real than it is. */
const depthOf = (w: Water, cut: number | null): number =>
  w.byDeficit ? (cut === null ? 0 : Math.min(cut / FULL_CUT, 1)) : 1;

/** How much of the glycogen store a protocol has emptied after
    so many days, at a known depth of cut. Exponential: most of
    it goes in the first two days and the tail takes a week. */
export function drainedBy(protocol: Protocol, days: number, cut: number | null): number {
  const w = WATER[protocol];
  if (!w || !w.tau || days <= 0) return 0;
  return w.share * depthOf(w, cut) * (1 - Math.exp(-days / w.tau));
}

/** The same, at the deepest cut this tool will set, which is as
    far as a protocol's drain ever reaches. */
export const drained = (protocol: Protocol, days: number): number =>
  drainedBy(protocol, days, FULL_CUT);

/** How much of `GUT_KG` has gone after so many days. A complete
    fast empties it; everything else lowers it by as much as it
    lowers the food. */
export function gutTaken(protocol: Protocol, days: number, cut: number | null): number {
  const w = WATER[protocol];
  if (!w || !w.gut || days <= 0) return 0;
  return w.gut * depthOf(w, cut) * Math.min(days / GUT_DAYS, 1);
}

export interface Change {
  /** What was running, and for how long. `null` for somebody
      starting from ordinary eating. `intake` is the mean daily
      intake UNDER THAT protocol, which is how much of the store
      it had really taken; leaving it out errs wetter and never
      flatteringly drier. */
  from: { protocol: Protocol; days: number; intake?: number } | null;
  to: Protocol;
  /** How long the new one will run, or has run. */
  days: number;
  weightKg: number;
  /** Maintenance, from `learnedBurn()` where there is one. */
  burn: number;
  /** Mean daily intake under the NEW protocol. Zero for a
      complete fast. */
  intake: number;
}

export interface Forecast {
  /** What the scale will show. Negative is down. */
  scale: Range;
  /** What of it is fat. The only number a projection may be
      built from. */
  fat: number;
  /** The difference, which is water and gut contents. */
  water: Range;
  /** What comes back when ordinary eating resumes. Positive. */
  rebound: Range;
  /** Days from the change before the trend means anything
      again. */
  settling: number;
  /** What share of the drop is fat, as a fraction. */
  fatShare: number;
  /** Whether that share may be PRINTED. False where the scale
      MOVES and the model has no water term to explain any of it
      (`maintain`, `gain`, `break`), so calling the rise 100% fat
      would be a claim about what the model cannot see. Nothing
      moving at all comes back true. */
  fatShareKnown: boolean;
}

/** What a change of protocol will do, and how much of it is
    real.

    THIS IS THE FUNCTION FOR STACKING. Three days into keto then
    two days fasting is not twice the water loss: the store is
    already two thirds empty. `from.days` carries that, and
    leaving it out turns a forecast into an encouragement.

    Everything is a range except the fat, which is arithmetic on
    a deficit and has no spread to pretend to. */
export function forecastChange(c: Change): Forecast {
  const store = glycogenKg(c.weightKg) * (1 + GLYCOGEN_WATER_RATIO);
  const cut = cutOf(c.intake, c.burn);

  /* What the previous protocol had already taken: a fresh start
     finds a full store, a stacked one does not. */
  const already = c.from
    ? drainedBy(c.from.protocol, c.from.days,
        c.from.intake === undefined ? null : cutOf(c.from.intake, c.burn))
    : 0;
  const after = Math.max(already, drainedBy(c.to, c.days, cut));
  const newlyDrained = Math.max(after - already, 0) * store;

  /* And what has gone out of the gut, which is why an ordinary
     deficit moves the scale on day one without a gram of fat
     having left. */
  const gutShare = gutTaken(c.to, c.days, cut);

  /* `WITH_SODIUM` is why this is a range at all. */
  const water: Range = {
    low: newlyDrained * WITH_SODIUM.low + GUT_KG.low * gutShare,
    mid: newlyDrained * WITH_SODIUM.mid + GUT_KG.mid * gutShare,
    high: newlyDrained * WITH_SODIUM.high + GUT_KG.high * gutShare,
  };

  const fat = ((c.intake - c.burn) * c.days) / KCAL_PER_KG;

  const scale: Range = {
    low: fat - water.high,
    mid: fat - water.mid,
    high: fat - water.low,
  };

  /* Everything drained comes back when ordinary eating resumes,
     and the gut refills within a day or two. */
  const back = after * store;
  const rebound: Range = {
    low: back * WITH_SODIUM.low + GUT_KG.low * gutShare,
    mid: back * WITH_SODIUM.mid + GUT_KG.mid * gutShare,
    high: back * WITH_SODIUM.high + GUT_KG.high * gutShare,
  };

  const drop = Math.abs(scale.mid);
  return {
    scale, fat, water, rebound,
    settling: settlingDays(c.to),
    fatShare: drop > 0 ? Math.min(Math.abs(fat) / drop, 1) : 0,
    fatShareKnown: water.mid > 0 || drop === 0,
  };
}

/** Days after a change before a slope through the trend means
    anything: the drain plus the refill. A complete fast is
    quicker to take the water off and slower to be readable
    after it, because the rebound has to finish. */
export function settlingDays(protocol: Protocol): number {
  if (protocol === "keto") return KETO_ADAPTATION_DAYS;
  if (protocol === "fast") return 10;
  if (protocol === "omad" || protocol === "5:2" || protocol === "ramadan") return 7;
  if (protocol === "break" || protocol === "gain") return 7;
  return 0;
}

export interface Phase {
  protocol: Protocol;
  /** Days from the same origin `Point.day` uses. */
  startDay: number;
  endDay?: number;
}

export interface Stretch {
  protocol: Protocol;
  from: number;
  to: number;
  readable: boolean;
  /** Why not, where it is not. Shown on the chart. */
  why?: "settling" | "too short" | "rebound";
}

/** Split a run of days at every protocol boundary and say which
    stretches a rate may be read from.

    A SLOPE NEVER CROSSES A BOUNDARY: a regression across a
    change of protocol is a regression across a step in body
    water, and three days of keto then two of fasting reads as
    0.8kg a day. A stretch under about a week carries no readable
    rate either, whatever it is under. */
export function stretches(phases: Phase[], today: number): Stretch[] {
  const ordered = [...phases].sort((a, b) => a.startDay - b.startDay);
  return ordered.map((p, i) => {
    const end = p.endDay ?? ordered[i + 1]?.startDay ?? today;
    const settle = settlingDays(p.protocol);
    const from = p.startDay + settle;
    const span = end - from;
    if (end - p.startDay < settle) {
      return { protocol: p.protocol, from: p.startDay, to: end,
               readable: false, why: "settling" };
    }
    if (span < 7) {
      return { protocol: p.protocol, from, to: end, readable: false, why: "too short" };
    }
    return { protocol: p.protocol, from, to: end, readable: true };
  });
}

/** The weighings a rate may honestly be fitted to: everything
    inside a readable stretch. Drawn either way. */
export function readable(points: Point[], phases: Phase[], today: number): Point[] {
  const spans = stretches(phases, today).filter((s) => s.readable);
  if (!spans.length) return [];
  return points.filter((p) => spans.some((s) => p.day >= s.from && p.day <= s.to));
}

/* ---------------------------------------------------------- */
/* what a day is, and what a run of them says                 */
/* ---------------------------------------------------------- */

/** One day, as the browser holds it. Mirrors
    `public.diet_days`: a field this has and the table does not
    is a save that silently drops a column. */
export interface Day {
  date: string;
  weightKg?: number;
  kcal?: number;
  proteinG?: number; carbsG?: number; fatG?: number; fibreG?: number;
  sodiumMg?: number;
  ketonesMmol?: number;
  steps?: number;
  sleepHours?: number;
  waterMl?: number;
  /** One to five. The only leading indicator here. */
  hunger?: number;
  waistCm?: number; hipCm?: number; neckCm?: number;
  chestCm?: number; thighCm?: number; armCm?: number;
  marks?: string[];
  tags?: string[];
  note?: string;
}

/** The fixed journal set. FIXED because free text cannot be
    counted, SHORT because a list of forty is one nobody uses.
    `check-diet.ts` reads it against `DIET.md` section 11. */
export const TAGS: Array<{ id: string; en: string; bn: string }> = [
  { id: "hungry",  en: "Hungry",       bn: "ক্ষুধা লেগেছে" },
  { id: "tired",   en: "Tired",        bn: "ক্লান্ত" },
  { id: "headache", en: "Headache",    bn: "মাথাব্যথা" },
  { id: "craving", en: "Craving",      bn: "কিছু খেতে ইচ্ছে করছে" },
  { id: "low",     en: "Low energy",   bn: "শক্তি কম" },
  { id: "good",    en: "Good day",     bn: "ভালো দিন" },
  { id: "out",     en: "Ate out",      bn: "বাইরে খেয়েছি" },
  { id: "stress",  en: "Stressed",     bn: "চাপে আছি" },
  { id: "badsleep", en: "Slept badly", bn: "ঘুম ভালো হয়নি" },
  { id: "unwell",  en: "Unwell",       bn: "অসুস্থ" },
  { id: "sore",    en: "Sore",         bn: "গা ব্যথা" },
  { id: "strong",  en: "Strong",       bn: "শরীর ভালো লাগছে" },
];

/** A day marked as not counting towards the slope: a fever puts
    water on. Drawn either way.

    THE ID IS THE STRING THAT GOES INTO `diet_days.marks`, which
    has no CHECK constraint, so nothing at write time stops these
    drifting from the names the migration lists.
    `check-diet.ts` reads both and fails on either. */
export const MARKS: Array<{ id: string; en: string; bn: string }> = [
  { id: "ill",          en: "Unwell",       bn: "অসুস্থ" },
  { id: "travel",       en: "Travelling",   bn: "ভ্রমণে" },
  { id: "refeed",       en: "A big meal",   bn: "বড় খাওয়া" },
  { id: "off-protocol", en: "Off protocol", bn: "নিয়মের বাইরে" },
];

/** The one spelling that is not in the list above and is in real
    rows: `off` was written where the column has always said
    `off-protocol`. Without this such a day loses its name on the
    chart and its pressed chip in the form. */
const MARK_WAS: Record<string, string> = { off: "off-protocol" };

export const markNamed = (id: string): { id: string; en: string; bn: string } | null =>
  MARKS.find((m) => m.id === (MARK_WAS[id] ?? id)) ?? null;

/* ---------------------------------------------------------- */
/* which weighings a rate may be read from                    */
/* ---------------------------------------------------------- */

/** The weighings out of a run of days, split into what is DRAWN
    and what may be FITTED. TWO LISTS RATHER THAN ONE: a marked
    day is drawn and left out of the slope, and one list forces a
    page to choose between hiding a reading and fitting a line
    through a fortnight of fever water. */
export interface Weighings {
  /** Every weighing there is, in day order. What a chart draws. */
  drawn: Point[];
  /** The ones a rate, a learned burn or a projection may be
      fitted to: marked days removed, and where phases are known,
      nothing out of a stretch that is still settling. */
  fittable: Point[];
  /** The ones taken out because the reader marked the day, so a
      chart can tick them. */
  marked: Point[];
}

export function weighings(opts: {
  days: Day[];
  /** An ISO date to the day numbers `Point.day` uses. Handed in
      because this file never touches a clock. */
  dayOf: (iso: string) => number;
  /** Where the page has them. A stretch that is still settling
      is drawn and not fitted, like a marked day. */
  phases?: Phase[];
  /** Today, in the same day numbers. Defaults to the last
      weighing. */
  today?: number;
}): Weighings {
  const { days, dayOf, phases = [], today } = opts;
  const byDay = (a: Point, b: Point): number => a.day - b.day;
  const drawn: Point[] = [];
  const marked: Point[] = [];
  const unmarked: Point[] = [];
  for (const d of days) {
    if (d.weightKg == null) continue;
    const p: Point = { day: dayOf(d.date), kg: d.weightKg };
    drawn.push(p);
    ((d.marks?.length ?? 0) > 0 ? marked : unmarked).push(p);
  }
  drawn.sort(byDay);
  marked.sort(byDay);
  unmarked.sort(byDay);
  const end = today ?? (drawn.length ? drawn[drawn.length - 1].day : 0);
  return {
    drawn,
    marked,
    fittable: phases.length ? readable(unmarked, phases, end) : unmarked,
  };
}

/** The learned maintenance, measured inside ONE stretch.

    `learnedBurn()` knows nothing about phases, so a whole run
    handed to it is a window with a fast in the middle and a
    maintenance figure built on an intake nobody ate. This is
    that call per readable stretch, answered with the LAST one.
    Null where that stretch is still settling or too short. */
export interface LearnedHere extends Learned {
  /** Which stretch it was measured over. `null` where the page
      knows no phases: the whole run is one window. */
  protocol: Protocol | null;
  from: number;
  to: number;
}

export function learnedHere(opts: {
  weights: Point[];
  intakes: { day: number; kcal: number }[];
  phases?: Phase[];
  today: number;
}): LearnedHere | null {
  const { weights, intakes, phases = [], today } = opts;

  if (!phases.length) {
    const all = learnedBurn(weights, intakes);
    if (!all) return null;
    const sorted = [...weights].sort((a, b) => a.day - b.day);
    return {
      ...all, protocol: null,
      from: sorted[0].day, to: sorted[sorted.length - 1].day,
    };
  }

  const spans = stretches(phases, today).filter((s) => s.readable);
  for (let i = spans.length - 1; i >= 0; i -= 1) {
    const s = spans[i];
    const inside = <P extends { day: number }>(p: P): boolean =>
      p.day >= s.from && p.day <= s.to;
    const got = learnedBurn(weights.filter(inside), intakes.filter(inside));
    if (got) return { ...got, protocol: s.protocol, from: s.from, to: s.to };
  }
  return null;
}

/* ---------------------------------------------------------- */
/* the streak, which is a count of showing up                 */
/* ---------------------------------------------------------- */

export interface Streak {
  /** Days up to and including today, or up to yesterday when
      today has not been logged yet. */
  current: number;
  /** The longest run there has ever been. */
  best: number;
  /** Whether today is already in it. */
  today: boolean;
  /** Total days logged, ever. */
  total: number;
}

/** A run of days with something in them.

    IT COUNTS SHOWING UP, NEVER HITTING A TARGET: a streak of
    days under a calorie target punishes somebody for a birthday.
    `best` sits beside `current` because a number that can only
    fall is one people stop looking at. Yesterday still counts as
    unbroken when today has not been logged yet. */
export function streak(days: Day[], todayISO: string): Streak {
  const logged = new Set(
    days.filter((d) => d.weightKg != null || d.kcal != null
      || (d.tags?.length ?? 0) > 0 || d.note)
      .map((d) => d.date),
  );
  if (!logged.size) return { current: 0, best: 0, today: false, total: 0 };

  const step = (iso: string, by: number): string => {
    const [y, m, d] = iso.split("-").map(Number);
    const at = Date.UTC(y, m - 1, d + by);
    return new Date(at).toISOString().slice(0, 10);
  };

  const today = logged.has(todayISO);
  let cursor = today ? todayISO : step(todayISO, -1);
  let current = 0;
  while (logged.has(cursor)) { current += 1; cursor = step(cursor, -1); }

  const sorted = [...logged].sort();
  let best = 0;
  let run = 0;
  let last = "";
  for (const date of sorted) {
    run = last && step(last, 1) === date ? run + 1 : 1;
    best = Math.max(best, run);
    last = date;
  }

  return { current, best: Math.max(best, current), today, total: logged.size };
}

/* ---------------------------------------------------------- */
/* what the day adds up to, and how much of it is known       */
/* ---------------------------------------------------------- */

/** One thing eaten, as the browser holds it. Mirrors
    `public.diet_entries`. */
export interface Entry {
  id?: string;
  date: string;
  meal?: string;
  /** Local clock, "HH:MM", stored beside the date rather than
      read back out of `meal`, which is a meal name.
      `diet_entries.at_time` is the column. */
  atTime?: string;
  label: string;
  labelBn?: string;
  qty?: number;
  unit?: string;
  kcal?: number;
  macros?: Record<string, number>;
  micros?: Record<string, number>;
  estLow?: number;
  estHigh?: number;
  planned?: boolean;
  source?: string;
  sourceId?: string;
}

/** The hour a thing was eaten, 0 to 23, or null where the row
    does not say.

    THE `meal` FALLBACK STAYS: real rows written before `at_time`
    carry a clock where a meal name belongs, and dropping it
    empties the by-hour reading for anybody who logged then. Null
    rather than a default of noon, which would put somebody's
    breakfast in the afternoon. */
export function entryHour(e: Pick<Entry, "atTime" | "meal">): number | null {
  const clock = (s: string | undefined): number | null => {
    const m = /^\s*(\d{1,2}):([0-5]\d)/.exec(s ?? "");
    if (!m) return null;
    const h = Number(m[1]);
    return h >= 0 && h < 24 ? h : null;
  };
  return clock(e.atTime) ?? clock(e.meal);
}

export interface DayTotal {
  kcal: number;
  protein: number; carbs: number; fat: number; fibre: number;
  micros: Record<string, number>;
  /** The share of the day's energy from an entry with ANY
      composition attached. The WRONG number to print beside one
      nutrient: see `microCoverage`. */
  coverage: number;
  /** The same share, PER NUTRIENT. A crowdsourced row may carry
      sodium and nothing else, so the day's own coverage reads
      100% while potassium, calcium and iron are all unknown. A
      key absent here is a nutrient nothing today carries; a key
      at 0.3 is one a third of today's energy knows about, and
      the panel prints that third rather than the day's. */
  microCoverage: Record<string, number>;
  /** How wide the day's own estimate is, from entries logged as
      a range: a restaurant plate is not knowable. */
  spread: number;
  count: number;
}

/** Under this the panel says the day is too sparse to read
    rather than drawing a bar. */
export const COVERAGE_FLOOR = 0.5;

/** Rows rather than a day: a saved meal's parts carry no date
    and are exactly this arithmetic.

    THE DATE IS OPTIONAL RATHER THAN ABSENT. `Omit<Entry, "date">`
    alone is not assignable from an entry written as a literal,
    because an object literal is excess-property checked, and
    that is how most callers spell one. */
export function totalFor(
  entries: Array<Omit<Entry, "date"> & { date?: string }>,
  which: Side = "eaten",
): DayTotal {
  const eaten = entries.filter((e) => (which === "planned" ? e.planned === true : !e.planned));
  const micros: Record<string, number> = {};
  const knownPer: Record<string, number> = {};
  let kcal = 0, protein = 0, carbs = 0, fat = 0, fibre = 0, known = 0, spread = 0;

  for (const e of eaten) {
    const c = e.kcal ?? 0;
    kcal += c;
    protein += e.macros?.protein ?? 0;
    carbs += e.macros?.carbs ?? 0;
    fat += e.macros?.fat ?? 0;
    fibre += e.macros?.fibre ?? 0;
    if (e.estLow != null && e.estHigh != null) spread += e.estHigh - e.estLow;
    /* Covered means composition attached, weighted by ENERGY
       rather than by entry count: a 700 kcal plate with nothing
       attached leaves a bigger hole than an apple. */
    if (e.micros && Object.keys(e.micros).length) {
      known += c;
      for (const [k, v] of Object.entries(e.micros)) {
        micros[k] = (micros[k] ?? 0) + v;
        /* Per nutrient, by energy: an entry carrying a key
           counts towards that key and no other. */
        knownPer[k] = (knownPer[k] ?? 0) + c;
      }
    }
  }

  const microCoverage: Record<string, number> = {};
  if (kcal > 0) {
    for (const [k, v] of Object.entries(knownPer)) microCoverage[k] = v / kcal;
  }

  return {
    kcal, protein, carbs, fat, fibre, micros, microCoverage,
    coverage: kcal > 0 ? known / kcal : 0,
    spread,
    count: eaten.length,
  };
}

/* ---------------------------------------------------------- */
/* which meal of the day a row belongs to                     */
/* ---------------------------------------------------------- */

/** The fixed set `diet_entries.meal` holds. The column has no
    CHECK constraint, so this table is the only statement of what
    may be in it.

    `from` and `to` are the hours covered, `from` included and
    `to` excluded, and they wrap: the late one runs 21 round to
    5. They NAME a row nobody named and nothing more. */
export interface MealName {
  id: string;
  en: string;
  bn: string;
  from: number;
  to: number;
}

export const MEALS: MealName[] = [
  { id: "breakfast", en: "Breakfast", bn: "সকালের খাবার", from: 5, to: 11 },
  { id: "lunch", en: "Lunch", bn: "দুপুরের খাবার", from: 11, to: 16 },
  { id: "dinner", en: "Dinner", bn: "রাতের খাবার", from: 16, to: 21 },
  { id: "late", en: "Late", bn: "রাত জেগে", from: 21, to: 5 },
];

export const mealNamed = (id: string | undefined): MealName | null =>
  MEALS.find((m) => m.id === id) ?? null;

/** Which meal an hour falls in. Every hour falls in exactly
    one, so this cannot return null. */
export function mealAt(hour: number): MealName {
  const h = ((Math.floor(hour) % 24) + 24) % 24;
  return MEALS.find((m) => (m.from <= m.to
    ? h >= m.from && h < m.to
    : h >= m.from || h < m.to)) ?? MEALS[0];
}

/**
 * The meal a row belongs to, or null where nothing says.
 *
 * THE COLUMN FIRST, AND ASKED THROUGH `mealNamed`. Rows written
 * before `at_time` carry a CLOCK in `meal`, so a raw `e.meal`
 * returns "08:30" as the name of a meal and groups every such
 * row under a heading that is a time. An unknown value falls
 * through to the hour. Null rather than a default, for
 * `entryHour`'s reason.
 */
export function mealOf(e: Pick<Entry, "atTime" | "meal">): MealName | null {
  const named = mealNamed(e.meal);
  if (named) return named;
  const hour = entryHour(e);
  return hour === null ? null : mealAt(hour);
}

/** Which side of the day a total is about. A planned row never
    counts as an eaten one. */
export type Side = "eaten" | "planned";

/** A day's rows under the meal each belongs to, in the order
    `MEALS` declares, plus whatever could not be placed. ONE
    TABLE: a page writing its own hours out is the same dinner in
    two meals. An empty meal is left out. */
export function byMeal(
  entries: Entry[], which: Side = "eaten",
): Array<{ meal: MealName | null; entries: Entry[]; total: DayTotal }> {
  const wanted = entries.filter((e) => (which === "planned" ? e.planned === true : !e.planned));
  const by = new Map<string, Entry[]>();
  for (const e of wanted) {
    const key = mealOf(e)?.id ?? "";
    by.set(key, [...(by.get(key) ?? []), e]);
  }
  const out: Array<{ meal: MealName | null; entries: Entry[]; total: DayTotal }> = [];
  for (const meal of MEALS) {
    const rows = by.get(meal.id);
    if (rows?.length) out.push({ meal, entries: rows, total: totalFor(rows, which) });
  }
  const loose = by.get("");
  if (loose?.length) out.push({ meal: null, entries: loose, total: totalFor(loose, which) });
  return out;
}

/* ---------------------------------------------------------- */
/* rows kept in a jsonb column, read back                     */
/* ---------------------------------------------------------- */

const numberOr = (value: unknown): number | undefined =>
  typeof value === "number" && Number.isFinite(value) ? value : undefined;

const textOr = (value: unknown): string | undefined =>
  typeof value === "string" && value.trim() !== "" ? value.trim() : undefined;

const figuresOr = (value: unknown): Record<string, number> | undefined => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const out: Record<string, number> = {};
  for (const [key, raw] of Object.entries(value as Record<string, unknown>)) {
    const n = numberOr(raw);
    if (n !== undefined) out[key] = n;
  }
  return Object.keys(out).length ? out : undefined;
};

/**
 * The rows kept in a `jsonb` column, as entries.
 *
 * What comes back out of `diet_foods.parts` is `unknown`, so
 * every field is CHECKED rather than cast: a value written by an
 * older version of this tool arrives as a string where a number
 * belongs and puts NaN into somebody's day.
 *
 * IT CARRIES THE BAND. A logged part can be a plate somebody
 * else cooked, so dropping `estLow` and `estHigh` claims a
 * precision the day does not have. `partsOf()` in
 * `next/lib/recipes.ts` reads the same column for a recipe's
 * INGREDIENTS, which cannot carry one, and is narrower.
 *
 * `id` and `planned` are deliberately not read: an id would let
 * a meal logged twice claim to be one entry.
 */
export function entriesFrom(raw: unknown): Array<Omit<Entry, "date">> {
  if (!Array.isArray(raw)) return [];
  const out: Array<Omit<Entry, "date">> = [];
  for (const item of raw) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    const label = textOr(row.label);
    if (!label) continue;
    out.push({
      label,
      labelBn: textOr(row.labelBn),
      meal: textOr(row.meal),
      qty: numberOr(row.qty),
      unit: textOr(row.unit),
      kcal: numberOr(row.kcal),
      macros: figuresOr(row.macros),
      micros: figuresOr(row.micros),
      estLow: numberOr(row.estLow),
      estHigh: numberOr(row.estHigh),
      source: textOr(row.source),
      sourceId: textOr(row.sourceId),
    });
  }
  return out;
}

/* ---------------------------------------------------------- */
/* a plan, and what became of it                              */
/* ---------------------------------------------------------- */

/**
 * What was planned for a day against what was eaten on it. Two
 * figures and no verdict: no "kept" percentage and no tick.
 * A day appears only where something was planned for it.
 */
export interface PlanDay {
  date: string;
  planned: number;
  eaten: number;
  /** Planned rows still waiting. A count rather than a share,
      because a share of nothing divides by zero. */
  left: number;
}

export function planKept(entries: Entry[]): PlanDay[] {
  const dates = new Set(entries.filter((e) => e.planned).map((e) => e.date));
  return [...dates].sort().map((date) => {
    const rows = entries.filter((e) => e.date === date);
    const left = rows.filter((e) => e.planned);
    return {
      date,
      planned: totalFor(rows, "planned").kcal,
      eaten: totalFor(rows).kcal,
      left: left.length,
    };
  });
}

/* ---------------------------------------------------------- */
/* the readings that come out of a month of it                */
/* ---------------------------------------------------------- */

/** The top few foods by contribution. */
export function topSources(entries: Entry[], n = 5): Array<{
  label: string; kcal: number; times: number; share: number;
}> {
  const by = new Map<string, { label: string; kcal: number; times: number }>();
  let total = 0;
  for (const e of entries.filter((x) => !x.planned)) {
    const c = e.kcal ?? 0;
    total += c;
    const row = by.get(e.label) ?? { label: e.label, kcal: 0, times: 0 };
    row.kcal += c;
    row.times += 1;
    by.set(e.label, row);
  }
  return [...by.values()]
    .sort((a, b) => b.kcal - a.kcal)
    .slice(0, n)
    .map((r) => ({ ...r, share: total > 0 ? r.kcal / total : 0 }));
}

/** Mean intake by weekday. */
export function byWeekday(days: Day[]): Array<{ day: number; mean: number; n: number }> {
  const buckets: Array<{ sum: number; n: number }> = Array.from(
    { length: 7 }, () => ({ sum: 0, n: 0 }),
  );
  for (const d of days) {
    if (d.kcal == null) continue;
    const [y, m, dd] = d.date.split("-").map(Number);
    const wd = new Date(Date.UTC(y, m - 1, dd)).getUTCDay();
    buckets[wd].sum += d.kcal;
    buckets[wd].n += 1;
  }
  return buckets.map((b, day) => ({ day, mean: b.n ? b.sum / b.n : 0, n: b.n }));
}

/** Hunger over a run of days, and whether it is climbing. THE
    ONLY LEADING INDICATOR IN THE TOOL: a score rising over three
    weeks says a target is too aggressive before the trend does.
    Everything else here is a lagging measure. */
export function hungerTrend(days: Day[]): { mean: number; rising: boolean; n: number } {
  const points = days
    .filter((d) => typeof d.hunger === "number")
    .map((d, i) => ({ day: i, kg: d.hunger as number }));
  if (points.length < 10) {
    return { mean: points.reduce((s, p) => s + p.kg, 0) / (points.length || 1),
             rising: false, n: points.length };
  }
  const f = fit(points);
  const mean = points.reduce((s, p) => s + p.kg, 0) / points.length;
  /* Rising means the slope is positive AND bigger than its own
     error, which is the whole difference between a pattern and a
     fortnight of noise. */
  return { mean, rising: !!f && f.slope > 0 && f.slope > f.se, n: points.length };
}

/** What the tool can honestly show, and on which day it starts.
    Nothing is held back as a reward: each appears when there is
    enough data for it to be honest. */
export const UNLOCKS: Array<{ day: number; en: string; bn: string }> = [
  { day: 1, en: "BMI, waist to height, composition, a first target",
    bn: "বিএমআই, কোমর ও উচ্চতা, গঠন, আর প্রথম লক্ষ্য" },
  { day: 7, en: "A trend with a slope worth drawing",
    bn: "যে ধারার ঢাল আঁকার মতো হয়েছে" },
  { day: LEARN_AFTER_DAYS, en: "Your learned maintenance, and the under-logging gap",
    bn: "আপনার নিজের খরচ, আর কম লেখার ফাঁক" },
  { day: 21, en: "Stall detection",
    bn: "আটকে যাওয়া ধরা পড়বে" },
  { day: 28, en: "Weekday patterns, your top calorie sources, how protein is spread",
    bn: "বারের ধরন, সবচেয়ে বেশি ক্যালোরি কোথা থেকে, প্রোটিন কেমন ছড়ানো" },
  { day: 60, en: "Cycle to cycle comparison",
    bn: "চক্র থেকে চক্র তুলনা" },
  { day: 90, en: "What your own deficit actually does, measured on you",
    bn: "আপনার ঘাটতি আসলে কী করে, আপনার শরীরেই মাপা" },
  { day: 365, en: "The year page",
    bn: "বছরের পাতা" },
];

/* ---------------------------------------------------------- */
/* the first week, hour by hour                               */
/* ---------------------------------------------------------- */

/** One point on the first week's curve. Everything that makes
    week one confusing happens inside the first seventy-two
    hours, and `drained()` is an exponential in days taking a
    fraction, so this is the same arithmetic at a finer
    resolution rather than a second model. */
export interface HourPoint {
  hour: number;
  /** Cumulative, in kilograms. Positive is gone. */
  water: Range;
  fat: number;
  /** What the scale would read against the start. Negative is
      down. */
  scale: Range;
  /** How much of the drop SO FAR is fat. It climbs all week. */
  fatShare: number;
  /** Whether that share may be printed. See `Forecast`. */
  fatShareKnown: boolean;
}

/** The first week as a curve. Twelve hours is the coarsest step
    that still separates "the gut emptied" from "the liver ran
    out". */
export function hourlyArc(c: Change, everyHours = 12, upTo = 168): HourPoint[] {
  const out: HourPoint[] = [];
  for (let hour = 0; hour <= upTo; hour += everyHours) {
    const at = forecastChange({ ...c, days: hour / 24 });
    out.push({
      hour, water: at.water, fat: at.fat, scale: at.scale,
      fatShare: at.fatShare, fatShareKnown: at.fatShareKnown,
    });
  }
  return out;
}

/** A stretch of the first week, in the protocol's own terms.
    Each names a MECHANISM rather than a feeling: the feeling is
    what the reader already has. */
export interface Band {
  from: number;
  to: number;
  en: string;
  bn: string;
}

const FAST_BANDS: Band[] = [
  { from: 0, to: 12,
    en: "The gut is emptying. Most of the first movement on the scale is food that has not finished being food.",
    bn: "পেট খালি হচ্ছে। দাঁড়িপাল্লার প্রথম নড়াচড়ার বেশিরভাগই এমন খাবার যার হজম এখনো শেষ হয়নি।" },
  { from: 12, to: 24,
    en: "The liver's glycogen is going, about a hundred grams of it, and roughly three times its own weight in water goes with it.",
    bn: "যকৃতের গ্লাইকোজেন যাচ্ছে, প্রায় একশো গ্রাম, আর সঙ্গে যাচ্ছে তার নিজের ওজনের প্রায় তিন গুণ পানি।" },
  { from: 24, to: 48,
    en: "The biggest water day. Muscle glycogen, and the sodium that leaves with it. Expect the largest single drop of the week here, and expect almost none of it to be fat.",
    bn: "পানি সবচেয়ে বেশি যাওয়ার দিন। পেশির গ্লাইকোজেন আর তার সঙ্গে যাওয়া লবণ। সপ্তাহের সবচেয়ে বড় একদিনের কমাটা এখানেই, আর তার প্রায় কিছুই চর্বি নয়।" },
  { from: 48, to: 72,
    en: "Water is tapering. The store is mostly empty, so what leaves now is increasingly the real thing.",
    bn: "পানি যাওয়া কমে আসছে। জমা প্রায় শেষ, তাই এখন যা যাচ্ছে তার বেশিরভাগই আসল।" },
  { from: 72, to: 168,
    en: "Most of what leaves now is fat, and the daily movement is much smaller because of it. This is what the real rate looks like.",
    bn: "এখন যা যাচ্ছে তার বেশিরভাগই চর্বি, আর সেজন্যই প্রতিদিনের নড়াচড়া অনেক কম। আসল হার দেখতে এমনই।" },
];

const KETO_BANDS: Band[] = [
  { from: 0, to: 24,
    en: "Glycogen starts draining. The scale will move and none of it is fat yet.",
    bn: "গ্লাইকোজেন কমতে শুরু করেছে। দাঁড়িপাল্লা নড়বে, আর তার কিছুই এখনো চর্বি নয়।" },
  { from: 24, to: 72,
    en: "The bulk of the water leaves. This is the triumphant part, and it is the part that sets up the disappointment in week two.",
    bn: "পানির বড় অংশটা এখন যাচ্ছে। এই সময়টাই আনন্দের, আর এই সময়টাই দ্বিতীয় সপ্তাহের হতাশা তৈরি করে।" },
  { from: 72, to: 120,
    en: "The adaptation window. If there is going to be a headache, fatigue or cramp it sits here, and it is mostly the sodium that left with the water.",
    bn: "খাপ খাওয়ানোর সময়। মাথাব্যথা, ক্লান্তি বা খিঁচুনি হলে এই সময়েই হয়, আর তার বেশিরভাগই পানির সঙ্গে চলে যাওয়া লবণের জন্য।" },
  { from: 120, to: 168,
    en: "Water is nearly done. From here the trend starts to mean something, and the adaptation window closes on day fourteen.",
    bn: "পানি যাওয়া প্রায় শেষ। এখান থেকে ধারার মানে দাঁড়াতে শুরু করে, আর খাপ খাওয়ানোর সময় শেষ হয় চৌদ্দতম দিনে।" },
];

const PLAIN_BANDS: Band[] = [
  { from: 0, to: 24,
    en: "Gut contents and sodium. Nothing that moves today is fat.",
    bn: "পেটের খাবার আর লবণ। আজ যা নড়ছে তার কিছুই চর্বি নয়।" },
  { from: 24, to: 72,
    en: "The first drop is still mostly water. A deficit takes about three days to show anything real.",
    bn: "প্রথম কমাটা এখনো বেশিরভাগই পানি। ঘাটতির আসল কিছু দেখাতে প্রায় তিন দিন লাগে।" },
  { from: 72, to: 168,
    en: "The real rate starts showing, and it is a great deal smaller than the first two days suggested.",
    bn: "আসল হার দেখা দিতে শুরু করেছে, আর সেটা প্রথম দুই দিন যা মনে হয়েছিল তার চেয়ে অনেক কম।" },
];

export const bandsFor = (p: Protocol): Band[] =>
  p === "fast" ? FAST_BANDS : p === "keto" ? KETO_BANDS : PLAIN_BANDS;

/** Where you are now, and what is next. `hoursIn` is passed
    rather than computed: nothing here touches a clock. */
export function bandAt(p: Protocol, hoursIn: number): {
  now: Band | null; next: Band | null; intoNext: number;
} {
  const bands = bandsFor(p);
  const now = bands.find((b) => hoursIn >= b.from && hoursIn < b.to) ?? null;
  const next = bands.find((b) => b.from > hoursIn) ?? null;
  return { now, next, intoNext: next ? next.from - hoursIn : 0 };
}

/* ---------------------------------------------------------- */
/* the day as it happens                                      */
/* ---------------------------------------------------------- */

/** Where today is going, from what has been logged so far.

    NOT A PREDICTION OF BEHAVIOUR: it is the reader's OWN
    distribution of intake across the day, applied to what they
    have logged. Null before there is enough history to know that
    shape, because an assumed shape is somebody else's day. */
export interface DayPace {
  soFar: number;
  /** Where the day lands if it goes as this reader's days
      usually go. */
  landing: number;
  /** The share of a day's energy that has usually arrived by
      this hour. */
  usualShare: number;
  target?: number;
}

export function dayPace(opts: {
  history: Array<{ hour: number; kcal: number }>;
  today: Array<{ hour: number; kcal: number }>;
  hourNow: number;
  target?: number;
}): DayPace | null {
  const { history, today, hourNow, target } = opts;
  const soFar = today.reduce((s, e) => s + e.kcal, 0);
  if (history.length < 20) return null;

  const total = history.reduce((s, e) => s + e.kcal, 0);
  if (total <= 0) return null;
  const by = history.filter((e) => e.hour <= hourNow).reduce((s, e) => s + e.kcal, 0);
  const usualShare = by / total;

  /* A share of zero divides to infinity and a share of one
     means the day is done. */
  if (usualShare <= 0.05) return { soFar, landing: soFar, usualShare, target };
  return { soFar, landing: soFar / Math.min(usualShare, 1), usualShare, target };
}

/** When the calories actually land, as 24 buckets. */
export function byHour(entries: Array<{ hour: number; kcal: number }>): number[] {
  const buckets = new Array<number>(24).fill(0);
  for (const e of entries) {
    if (e.hour >= 0 && e.hour < 24) buckets[e.hour] += e.kcal;
  }
  return buckets;
}

/* ---------------------------------------------------------- */
/* the body has a calendar                                    */
/* ---------------------------------------------------------- */

/** Where a day falls in a cycle, from one start date and a
    length.

    Luteal water retention is half a kilo to two kilos, so the
    net effect is AN APPARENT STALL IN THE SECOND HALF OF EVERY
    CYCLE followed by a drop that looks like a whoosh and is not.

    ONE DATE AND A LENGTH, NOT A DIARY: everything below is
    arithmetic on a repeating interval, so a log of periods would
    be a more sensitive record for no extra answer. */
export interface CyclePlace {
  /** Days since the last start, 0 on the day itself. */
  day: number;
  /** The length being assumed. */
  length: number;
  /** The luteal phase is the half that holds water. Counted as
      the fourteen days BEFORE the next start rather than after
      this one, because it is the more constant half. */
  phase: "follicular" | "luteal";
}

export const LUTEAL_DAYS = 14;

/** Null where there is nothing to say: tracking off, no start
    date, a length outside what this can read, or a day before
    the start. */
export function cyclePlace(opts: {
  /** The day being asked about, in `Point.day` numbers. */
  day: number;
  /** The recorded start, in the same numbers. */
  startDay?: number;
  /** The recorded length. Defaults to 28, the median, and that
      is stated as an assumption wherever it is used. */
  length?: number;
}): CyclePlace | null {
  if (opts.startDay == null) return null;
  const length = opts.length ?? 28;
  if (length < 21 || length > 35) return null;
  if (opts.day < opts.startDay) return null;
  const day = (opts.day - opts.startDay) % length;
  return {
    day,
    length,
    phase: day >= length - LUTEAL_DAYS ? "luteal" : "follicular",
  };
}

/** The trend read CYCLE TO CYCLE rather than week to week: a
    luteal week is compared against a luteal week, so the water
    is on both sides of the subtraction and cancels. Null under
    two full cycles. */
export function cycleOverCycle(opts: {
  weights: Point[];
  startDay: number;
  length?: number;
  today: number;
}): { kgPerCycle: number; cycles: number; length: number } | null {
  const length = opts.length ?? 28;
  if (length < 21 || length > 35) return null;

  const bucket = new Map<number, number[]>();
  for (const p of opts.weights) {
    if (p.day < opts.startDay) continue;
    const n = Math.floor((p.day - opts.startDay) / length);
    const got = bucket.get(n) ?? [];
    got.push(p.kg);
    bucket.set(n, got);
  }
  const full = [...bucket.entries()]
    .filter(([, kgs]) => kgs.length >= 4)
    .sort((a, b) => a[0] - b[0]);
  if (full.length < 2) return null;

  const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;
  const first = mean(full[0][1]);
  const last = mean(full[full.length - 1][1]);
  const spanned = full[full.length - 1][0] - full[0][0];
  return {
    kgPerCycle: (last - first) / spanned,
    cycles: full.length,
    length,
  };
}

/* ---------------------------------------------------------- */
/* the calendar, which changes what a flat month means        */
/* ---------------------------------------------------------- */

export type SeasonId =
  | "ramadan" | "eid-fitr" | "eid-adha"
  | "winter" | "christmas"
  | "heat" | "monsoon"
  | "puja" | "boishakh";

/** A stretch of the year that changes how the numbers read.

    NONE OF THESE CHANGE THE ARITHMETIC: a season changes what a
    flat month MEANS, which is a sentence rather than a
    coefficient. Two fields reach code: `quiet` says a flat trend
    inside this is not offered as a stall, `shifted` says the
    eating window has moved so an empty afternoon is not a missed
    day. */
export interface Season {
  id: SeasonId;
  /** Where it is drawn. A fast is kept in London too; a monsoon
      is not. */
  where: Place[];
  en: string;
  bn: string;
  /** What it does to the reading, in one sentence. */
  readEn: string;
  readBn: string;
  quiet: boolean;
  shifted: boolean;
}

export const SEASONS: Season[] = [
  {
    id: "ramadan", where: ["bd", "uk"],
    en: "Ramadan", bn: "রমজান",
    readEn: "The eating window moves to suhoor and iftar, so an empty afternoon is not a missed day. A morning weight taken while fasting is largely a hydration reading.",
    readBn: "খাওয়ার সময় সাহরি আর ইফতারে সরে যায়, তাই দুপুরে কিছু না লেখা মানে দিন বাদ পড়া নয়। রোজা রেখে সকালে ওজন মাপলে সেটা মূলত পানির হিসাব।",
    quiet: true, shifted: true,
  },
  {
    id: "eid-fitr", where: ["bd", "uk"],
    en: "Eid al-Fitr", bn: "ঈদুল ফিতর",
    readEn: "A feast, and the days around it are a refeed rather than a failure. Annotated, not counted.",
    readBn: "উৎসবের খাওয়া, ব্যর্থতা নয়। এই দিনগুলো চিহ্ন হিসেবে থাকে, হিসাবে ধরা হয় না।",
    quiet: true, shifted: false,
  },
  {
    id: "eid-adha", where: ["bd", "uk"],
    en: "Eid al-Adha", bn: "ঈদুল আজহা",
    readEn: "A week of meat, and a rise across it is the same refeed. Annotated, not counted.",
    readBn: "কয়েক দিন মাংসের খাওয়া। ওজন বাড়লে সেটাও উৎসবের হিসাব, ব্যর্থতা নয়।",
    quiet: true, shifted: false,
  },
  {
    id: "winter", where: ["uk"],
    en: "British winter", bn: "বিলেতের শীত",
    readEn: "Weight rises across a British winter on average, vitamin D falls, and the dark ends the outdoor half of moving about. A December rise is the norm rather than an emergency.",
    readBn: "বিলেতে শীতে গড়পড়তা ওজন বাড়ে, ভিটামিন ডি কমে, আর অন্ধকারে বাইরের হাঁটাচলা বন্ধ হয়। ডিসেম্বরে ওজন বাড়া স্বাভাবিক, বিপদ নয়।",
    quiet: true, shifted: false,
  },
  {
    id: "christmas", where: ["uk"],
    en: "Christmas and New Year", bn: "বড়দিন ও নববর্ষ",
    readEn: "The single most annotated fortnight in the British year. Two weeks of it move a trend and nothing about that is a failure.",
    readBn: "বিলেতের বছরের সবচেয়ে বেশি খাওয়ার দুই সপ্তাহ। এতে ওজনের রেখা নড়বে, আর সেটা ব্যর্থতা নয়।",
    quiet: true, shifted: false,
  },
  {
    id: "heat", where: ["bd"],
    en: "The summer heat", bn: "গরমের সময়",
    readEn: "Appetite falls in extreme heat, so a light week is the weather rather than discipline, and the water lost is not fat.",
    readBn: "প্রচণ্ড গরমে ক্ষুধা কমে যায়। কম খাওয়ার সপ্তাহটা আবহাওয়ার, আর যে পানি ঝরে সেটা চর্বি নয়।",
    quiet: false, shifted: false,
  },
  {
    id: "monsoon", where: ["bd"],
    en: "The monsoon", bn: "বর্ষা",
    readEn: "Heavy rain takes the walking out of a day, so a flat month here is the weather rather than a stall.",
    readBn: "ভারী বৃষ্টিতে হাঁটাচলা কমে যায়। এই সময়ে ওজন এক জায়গায় থাকলে সেটা আবহাওয়ার, আটকে যাওয়া নয়।",
    quiet: true, shifted: false,
  },
  {
    id: "puja", where: ["bd"],
    en: "Durga Puja", bn: "দুর্গাপূজা",
    readEn: "Food-centred, and read the same way as Eid: annotated, not counted.",
    readBn: "খাওয়ার উৎসব, ঈদের মতোই পড়া হয়: চিহ্ন থাকে, হিসাবে ধরা হয় না।",
    quiet: true, shifted: false,
  },
  {
    id: "boishakh", where: ["bd"],
    en: "Pohela Boishakh", bn: "পহেলা বৈশাখ",
    readEn: "One day of panta, ilish and sweets. It moves a day and not a trend.",
    readBn: "একদিনের পান্তা, ইলিশ আর মিষ্টি। একটা দিন নড়ে, রেখা নয়।",
    quiet: false, shifted: false,
  },
];

export const seasonById = (id: SeasonId): Season | null =>
  SEASONS.find((s) => s.id === id) ?? null;

/** The half of the year this calendar can compute: a month and a
    day, wrapping the new year where it has to. */
const FIXED: Array<{ id: SeasonId; from: [number, number]; to: [number, number] }> = [
  { id: "winter",    from: [11, 1],  to: [2, 28] },
  { id: "christmas", from: [12, 20], to: [1, 2] },
  { id: "heat",      from: [4, 1],   to: [5, 31] },
  { id: "monsoon",   from: [6, 1],   to: [9, 30] },
  { id: "boishakh",  from: [4, 14],  to: [4, 14] },
];

/** THE MOVING HALF IS A TABLE AND HAS TO BE: the day Ramadan or
    an Eid begins is settled by local sighting, so Dhaka and
    London can differ by one.

    IT RUNS OUT ON PURPOSE. Past the last row for an id,
    `seasonsOn` returns nothing rather than extrapolating, and
    `calendarKnownTo` is what a page asks so it can say the dates
    are not known yet. Add rows. Do not compute them. */
const MOVING: Array<{ id: SeasonId; from: string; to: string }> = [
  { id: "ramadan",  from: "2026-02-18", to: "2026-03-19" },
  { id: "eid-fitr", from: "2026-03-20", to: "2026-03-22" },
  { id: "eid-adha", from: "2026-05-27", to: "2026-05-29" },
  { id: "puja",     from: "2026-10-17", to: "2026-10-21" },

  { id: "ramadan",  from: "2027-02-08", to: "2027-03-09" },
  { id: "eid-fitr", from: "2027-03-10", to: "2027-03-12" },
  { id: "eid-adha", from: "2027-05-17", to: "2027-05-19" },
  { id: "puja",     from: "2027-10-07", to: "2027-10-11" },

  { id: "ramadan",  from: "2028-01-28", to: "2028-02-26" },
  { id: "eid-fitr", from: "2028-02-27", to: "2028-02-29" },
  { id: "eid-adha", from: "2028-05-05", to: "2028-05-07" },
  { id: "puja",     from: "2028-09-24", to: "2028-09-28" },

  { id: "ramadan",  from: "2029-01-16", to: "2029-02-14" },
  { id: "eid-fitr", from: "2029-02-15", to: "2029-02-17" },
  { id: "eid-adha", from: "2029-04-24", to: "2029-04-26" },

  { id: "ramadan",  from: "2030-01-05", to: "2030-02-03" },
  { id: "eid-fitr", from: "2030-02-04", to: "2030-02-06" },
  { id: "eid-adha", from: "2030-04-14", to: "2030-04-16" },
];

/** A whole day, UTC, so the same ISO date is the same number
    wherever this runs. */
const dayNo = (iso: string): number =>
  Math.round(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000);

/** The last date the moving table can answer for, or null where
    it holds nothing for that id. With no id, the earliest of
    those: "known to" has to mean all of them. */
export function calendarKnownTo(id?: SeasonId): string | null {
  const ids = id ? [id] : [...new Set(MOVING.map((r) => r.id))];
  const ends: string[] = [];
  for (const one of ids) {
    const dates = MOVING.filter((r) => r.id === one).map((r) => r.to).sort();
    if (!dates.length) return null;
    ends.push(dates[dates.length - 1]);
  }
  return ends.length ? ends.sort()[0] : null;
}

export interface SeasonNow {
  season: Season;
  /** One-based, so a page can say "day 12 of 30". */
  day: number;
  of: number;
}

/** Which seasons a date is inside, in the place the reader eats.
    An empty array is the ordinary answer. */
export function seasonsOn(opts: { date: string; place: Place }): SeasonNow[] {
  const today = dayNo(opts.date);
  const year = +opts.date.slice(0, 4);
  const out: SeasonNow[] = [];

  const add = (id: SeasonId, start: number, end: number): void => {
    const season = seasonById(id);
    if (!season || !season.where.includes(opts.place)) return;
    const day = today - start + 1;
    const of = end - start + 1;
    if (day < 1 || day > of) return;
    out.push({ season, day, of });
  };

  for (const row of FIXED) {
    /* A range whose end sorts before its start wraps the new
       year, so it may have begun in the December before. Both
       candidates are tried; `add` drops the wrong one. */
    const wraps = row.from[0] * 100 + row.from[1] > row.to[0] * 100 + row.to[1];
    for (const startY of wraps ? [year - 1, year] : [year]) {
      add(
        row.id,
        Math.round(Date.UTC(startY, row.from[0] - 1, row.from[1]) / 86400000),
        Math.round(Date.UTC(wraps ? startY + 1 : startY, row.to[0] - 1, row.to[1]) / 86400000),
      );
    }
  }
  for (const row of MOVING) add(row.id, dayNo(row.from), dayNo(row.to));
  return out;
}

/** Whether a flat trend on this date should be left alone. */
export const quietSeason = (opts: { date: string; place: Place }): Season | null =>
  seasonsOn(opts).find((s) => s.season.quiet)?.season ?? null;

/** Whether the eating window has moved, so nothing reads an
    empty afternoon as a day nobody logged. */
export const shiftedSeason = (opts: { date: string; place: Place }): Season | null =>
  seasonsOn(opts).find((s) => s.season.shifted)?.season ?? null;

/* ---------------------------------------------------------- */
/* stalls, and telling the four kinds apart                   */
/* ---------------------------------------------------------- */

/** A STALL IS THREE WEEKS, NOT A TUESDAY: a flat trend over
    three weeks or more WHILE THE LOG SAYS THE DEFICIT IS BEING
    HELD. Both halves matter. A flat trend with nothing logged is
    a fortnight nobody wrote down. */
export const STALL_DAYS = 21;

/** What a tape measure resolves on one person, in centimetres.
    Read by `stall()` here and by `tape()` in
    `shared/insights.ts`. ONE CONSTANT: two of them is a page
    saying a waist has moved beside a page saying it has not. */
export const TAPE_RESOLUTION_CM = 1;

export type StallKind =
  /** Trend flat and the waist falling. Not a stall at all, and
      the one kind the tool can settle on its own. */
  | "recomposition"
  /** Trend flat and the learned maintenance has fallen. The
      target was right and has stopped being right. */
  | "target-drifted"
  /** Trend flat, the log unchanged, and the walking down.
      Invisible without a step count. */
  | "moved-less"
  /** Trend flat and the logged intake has not moved. The most
      common of the four, and said WITHOUT ACCUSING ANYBODY. */
  | "log-drifted"
  /** Flat and then a drop, or flat with a jump in sodium or a
      protocol change behind it. Fat left and water took its
      place. */
  | "water"
  /** None of the above fits, and that is an answer: not every
      flat month is a mistake to be corrected. */
  | "hard-part";

export interface Stall {
  /** The window read, in days, and how flat it was. */
  days: number;
  /** Kilograms a week over the window, with its interval. Flat
      means the interval SPANS ZERO. */
  rate: Range;
  /** What is most likely, and what else is consistent. `kind`
      excludes `"water"` in the type: water can never be ruled
      out and can never be chosen. See where `also` is built. */
  kind: Exclude<StallKind, "water">;
  also: StallKind[];
  /** The evidence, so a page can print the reason rather than
      the verdict. */
  waistCmChange?: number;
  burnKcalChange?: number;
  intakeKcalChange?: number;
  /** The median day of walking before the window and over it.
      Absent where either half carries no step count, which is
      silence and not a fall. */
  stepsThen?: number;
  stepsNow?: number;
  /** How much of the window has an intake logged. Under a half,
      no stall is reported at all. */
  coverage: number;
}

/** Whether the last three weeks are a stall, and which kind.
    Null for every honest reason not to say anything: not enough
    days, not enough logging, or a trend that is moving. */
export function stall(opts: {
  /** The fittable weighings, marked days already removed. */
  weights: Point[];
  /** Every day with an intake, over the same span. */
  intakes: Array<{ day: number; kcal: number }>;
  /** Waist measurements over the same span, where there are any.
      This is the one that can turn a stall into good news. */
  waists?: Array<{ day: number; cm: number }>;
  /** Today, in the same day numbers. */
  today: number;
  /** What the reader burns, where the tool has learnt it, at
      the START and the END of the window. A fall between them is
      the target having drifted. */
  burnThen?: number;
  burnNow?: number;
  /** Walking before the window and over it, from `stepShift()`
      in `shared/activity.ts`. The MEDIAN and never the mean: one
      25,000 step day in a month of 4,000s is a wedding. Absent
      is not a fall. */
  stepsThen?: number;
  stepsNow?: number;
  /** Where today falls in a cycle, where the reader has turned
      that on. A flat trend inside the luteal phase is not
      reported as a stall. */
  cycle?: CyclePlace | null;
  /** The season today falls in, where one is quiet. A flat month
      inside a monsoon, a British winter or a Ramadan is the
      calendar rather than a stall. */
  season?: Season | null;
}): Stall | null {
  /* THE LUTEAL PHASE IS NOT A STALL: the most costly false
     positive this function can produce, because the drop that
     disproves it arrives days after the reader has quit. */
  if (opts.cycle?.phase === "luteal") return null;
  /* AND NEITHER IS A QUIET SEASON, for the same reason. */
  if (opts.season?.quiet) return null;
  const from = opts.today - STALL_DAYS;
  const window = opts.weights.filter((p) => p.day >= from);
  /* Nine readings in twenty-one days is every other day, the
     least that can carry a slope worth reading. */
  if (window.length < 9) return null;
  if (window[window.length - 1].day - window[0].day < STALL_DAYS - 4) return null;

  const rate = slopePerWeek(window);
  if (!rate) return null;
  /* MOVING IS NOT STALLED. The interval has to span zero: a loss
     of 0.1 kg a week whose error bars exclude zero is a slow
     diet, not a stopped one. */
  if (rate.low > 0 || rate.high < 0) return null;

  const eaten = opts.intakes.filter((d) => d.day >= from);
  const coverage = eaten.length / STALL_DAYS;
  /* A FLAT TREND WITH NOTHING LOGGED IS NOT A STALL: the tool
     has no idea whether a deficit was held. */
  if (coverage < 0.5) return null;

  const half = from + STALL_DAYS / 2;
  const mean = (xs: number[]): number | null =>
    xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null;
  const early = mean(eaten.filter((d) => d.day < half).map((d) => d.kcal));
  const late = mean(eaten.filter((d) => d.day >= half).map((d) => d.kcal));
  const intakeKcalChange = early != null && late != null ? late - early : undefined;

  const waistWindow = (opts.waists ?? []).filter((p) => p.day >= from);
  const waistCmChange = waistWindow.length >= 2
    ? waistWindow[waistWindow.length - 1].cm - waistWindow[0].cm
    : undefined;

  const burnKcalChange = opts.burnThen != null && opts.burnNow != null
    ? opts.burnNow - opts.burnThen
    : undefined;

  const stepsChange = opts.stepsThen != null && opts.stepsNow != null
    ? opts.stepsNow - opts.stepsThen
    : null;

  /* The order is CONFIDENCE, not likelihood: recomposition is
     the only one the tool can settle on its own, and the hard
     part is what is left when nothing else fits. */
  const also: StallKind[] = [];
  let kind: Exclude<StallKind, "water"> = "hard-part";

  /* A centimetre over three weeks is what a tape measure can
     resolve on one person, so it is the threshold. */
  if (waistCmChange != null && waistCmChange <= -TAPE_RESOLUTION_CM) {
    kind = "recomposition";
  /* SECOND, BECAUSE IT IS MEASURED: a fall in walking is two
     medians off the log where a drifted target is inferred. BOTH
     TESTS, because a fifth off 2,000 steps is about 10 kcal and
     1,000 off 20,000 is not a change of habit. */
  } else if (stepsChange != null && opts.stepsThen != null
    && stepsChange <= -1000 && stepsChange <= -0.2 * opts.stepsThen) {
    kind = "moved-less";
  } else if (burnKcalChange != null && burnKcalChange <= -100) {
    kind = "target-drifted";
  } else if (intakeKcalChange != null && Math.abs(intakeKcalChange) < 100) {
    kind = "log-drifted";
  }

  if (kind !== "recomposition" && waistCmChange != null && waistCmChange < 0) {
    also.push("recomposition");
  }
  if (kind !== "target-drifted" && burnKcalChange != null && burnKcalChange < 0) {
    also.push("target-drifted");
  }
  if (kind !== "moved-less" && stepsChange != null && stepsChange < 0) {
    also.push("moved-less");
  }
  if (kind !== "log-drifted" && intakeKcalChange != null && intakeKcalChange > 0) {
    also.push("log-drifted");
  }
  /* WATER IS ALWAYS OFFERED AND NEVER CHOSEN. A reader nine days
     into a whoosh looks exactly like one who has stopped losing,
     and nothing measurable separates them until day ten, so it
     goes in `also` unconditionally and `kind` is never it. */
  also.push("water");

  return {
    days: STALL_DAYS,
    rate,
    kind,
    also,
    waistCmChange,
    burnKcalChange,
    intakeKcalChange,
    stepsThen: opts.stepsThen,
    stepsNow: opts.stepsNow,
    coverage,
  };
}

/* ---------------------------------------------------------- */
/* holding, which is a band and not a number                  */
/* ---------------------------------------------------------- */

/** The band the trend is allowed to move inside. Maintenance is
    a BAND and the tool says nothing at all while the trend is in
    it; the silence is the feature.

    The two columns are `diet_profile.band_low_kg` and
    `band_high_kg` and neither may be renamed. */
export interface MaintenanceBand {
  lowKg: number;
  highKg: number;
}

/** How wide, in kilograms: two to three, following bodyweight
    inside that because the noise does. The daily swing of one to
    two kilos is a larger share of a 55kg reader, and a band
    narrower than the noise is always being left. */
export const BAND_MIN_KG = 2;
export const BAND_MAX_KG = 3;
export const BAND_PCT_OF_WEIGHT = 3;

export const bandWidth = (weightKg: number): number =>
  Math.min(Math.max((weightKg * BAND_PCT_OF_WEIGHT) / 100, BAND_MIN_KG), BAND_MAX_KG);

/** A band centred on where the reader is, for somebody who has
    not set one: the day holding starts, the current weight IS
    the goal. Rounded to the tenth the column stores, so what is
    suggested is what is written. */
export function suggestBand(trendKg: number): MaintenanceBand {
  const half = bandWidth(trendKg) / 2;
  const tenth = (kg: number): number => Math.round(kg * 10) / 10;
  return { lowKg: tenth(trendKg - half), highKg: tenth(trendKg + half) };
}

/** Two weeks outside before anything is said at all. */
export const BAND_OUT_DAYS = 14;

export type BandState = "inside" | "above" | "below";

export interface BandWatch {
  where: BandState;
  /** The TREND, never a reading. Nothing in this tool reacts to
      one weighing. */
  trendKg: number;
  /** Kilograms past the nearer edge. Zero inside. */
  outByKg: number;
  /** How wide the band is, which is also the distance that turns
      a line into an offer. */
  widthKg: number;
  /** Days on this side, in ELAPSED days rather than in
      readings: the floor is a weight three times a week and a
      count of rows would ask for seven. The LOW end of what the
      data supports, because the trend crossed the edge somewhere
      before that weighing. */
  daysOut: number;
  /** The day the last weighing was, so a caller can say what the
      reading is as of. */
  lastDay: number;
  /** `"nothing"` is the commonest answer and the whole point of
      the phase: no message, no colour, no notification. */
  say: "nothing" | "line" | "offer";
  /** The phase to offer where one is offered: the lowest rate in
      `RATES`, in the direction that brings the trend back. */
  offer: { kind: GoalKind; ratePct: number } | null;
}

/** Where the trend sits against the band, and which of the three
    rows that is. Null for every honest reason to say nothing: no
    weighings, no band, or a trend nobody has fed for three
    weeks.

    IT DOES NOT SCOLD FOR MISSING MEALS and cannot: it reads
    weighings and never intakes. A reader holding a weight logs a
    scale reading a few times a week and nothing else. */
export function bandWatch(opts: {
  band: MaintenanceBand;
  /** The fittable weighings, marked days already removed. */
  weights: Point[];
  /** Today, in the same day numbers. */
  today: number;
}): BandWatch | null {
  const { band, today } = opts;
  const widthKg = band.highKg - band.lowKg;
  const points = [...opts.weights].sort((a, b) => a.day - b.day);
  if (!points.length || !(widthKg > 0)) return null;

  const line = trend(points);
  const now = line[line.length - 1];
  /* NOTHING IS SAID OFF A TREND NOBODY HAS FED: three weeks of
     silence is not a reading about today. */
  if (today - now.day > STALL_DAYS) return null;

  const sideOf = (kg: number): BandState =>
    kg > band.highKg ? "above" : kg < band.lowKg ? "below" : "inside";
  const where = sideOf(now.kg);
  const outByKg = where === "above" ? now.kg - band.highKg
    : where === "below" ? band.lowKg - now.kg
      : 0;

  let daysOut = 0;
  if (where !== "inside") {
    let i = line.length - 1;
    while (i > 0 && sideOf(line[i - 1].kg) === where) i -= 1;
    daysOut = now.day - line[i].day;
  }

  /* THE TWO WEEKS GATE BOTH ROWS. The offer's own test is
     distance, and the trend's half life is a week, so offering a
     deficit off three days of it is offering it off noise. */
  const say: BandWatch["say"] = where === "inside" || daysOut < BAND_OUT_DAYS
    ? "nothing"
    : outByKg > widthKg ? "offer" : "line";

  return {
    where,
    trendKg: now.kg,
    outByKg,
    widthKg,
    daysOut,
    lastDay: now.day,
    say,
    offer: say === "offer"
      ? { kind: where === "above" ? "lose" : "gain", ratePct: LOWEST_RATE_PCT }
      : null,
  };
}

/* ---------------------------------------------------------- */
/* gaining, which is week one lying the other way up          */
/* ---------------------------------------------------------- */

/** How much of the glycogen store is empty in somebody eating
    ordinarily. Not nought: this headroom is what a carbohydrate
    increase fills in the first week of a surplus. A reader
    arriving off keto or a fast hands in their own via `from`. */
const BASE_HEADROOM = 0.35;

/** Days for the store to refill: `WATER.keto`'s drain run
    backwards, and about as quick. */
const REFILL_TAU_DAYS = 2;

export interface GainWeekOne {
  /** What the scale will show. Positive is up. */
  scale: Range;
  /** What of it is new tissue. Arithmetic on a surplus, so no
      spread, and TISSUE rather than muscle: a surplus adds some
      of each and this cannot tell them apart. */
  tissue: number;
  /** The rest: glycogen, its water, and a fuller gut. */
  refill: Range;
  /** The share of the rise that is not new tissue. Needed
      BEFORE week one rather than after week two. */
  refillShare: number;
}

/** What the first week of a surplus puts on the scale, and how
    little of it is new tissue: a carbohydrate increase refills
    glycogen and puts one to two kilos on in a week containing no
    new tissue at all. `forecastChange()`'s arithmetic run
    backwards, so `from` means the same thing there.

    `forecastChange()` deliberately does not answer this:
    `WATER.gain` is zeros, so a surplus comes back with
    `fatShareKnown: false` rather than a flattering claim. */
export function gainWeekOne(opts: {
  weightKg: number;
  /** Maintenance, learned where there is one. */
  burn: number;
  /** The target intake, above it. */
  intake: number;
  /** What was running before the surplus, where the page knows
      it: how empty the store is decides how much of week one is
      refill. */
  from?: { protocol: Protocol; days: number; intake?: number } | null;
  days?: number;
}): GainWeekOne {
  const { weightKg, burn, intake, from = null, days = 7 } = opts;
  const span = Math.max(days, 0);
  const store = glycogenKg(weightKg) * (1 + GLYCOGEN_WATER_RATIO);
  const emptied = from
    ? drainedBy(from.protocol, from.days,
        from.intake === undefined ? null : cutOf(from.intake, burn))
    : 0;
  const headroom = Math.min(Math.max(emptied, BASE_HEADROOM), 1);
  const back = store * headroom * (1 - Math.exp(-span / REFILL_TAU_DAYS));

  /* The gut fills in proportion to how much more food is going
     in, and is full at `MAX_SURPLUS_KCAL`. `gutTaken()` read the
     other way. */
  const surplus = Math.max(intake - burn, 0);
  const gutShare = Math.min(surplus / MAX_SURPLUS_KCAL, 1)
    * Math.min(span / GUT_DAYS, 1);

  const refill: Range = {
    low: back * WITH_SODIUM.low + GUT_KG.low * gutShare,
    mid: back * WITH_SODIUM.mid + GUT_KG.mid * gutShare,
    high: back * WITH_SODIUM.high + GUT_KG.high * gutShare,
  };
  const tissue = (surplus * span) / KCAL_PER_KG;
  const scale: Range = {
    low: tissue + refill.low,
    mid: tissue + refill.mid,
    high: tissue + refill.high,
  };
  return {
    scale,
    tissue,
    refill,
    refillShare: scale.mid > 0 ? Math.min(refill.mid / scale.mid, 1) : 0,
  };
}

/* ---------------------------------------------------------- */
/* the oil nobody measures                                    */
/* ---------------------------------------------------------- */

/** Energy in a millilitre of cooking oil. Every common one is
    within a few per cent of this, ghee included, so the oil does
    not need naming: one question fewer. */
export const OIL_KCAL_PER_ML = 8.3;

export interface OilPerMeal {
  /** Kilocalories to add to one home-cooked meal, with the width
      of the estimate on it. */
  kcal: Range;
  /** The arithmetic, so the page can show it rather than assert
      it. */
  mlPerMeal: number;
  people: number;
  meals: number;
}

/** The household calibrated, rather than the dish.

    A curry's oil is poured, not weighed, and is invisible in the
    finished dish: two tablespoons is about 240 kcal. Across a
    week this is frequently the single largest unlogged item in
    the diet.

    The band is wide on purpose: a household does not divide its
    oil evenly, the week was not typical, and some is still in
    the pan. Plus or minus a third is honest. */
export function oilPerMeal(opts: {
  /** Millilitres the household got through in the week. */
  mlWeek?: number;
  /** How many people ate from it. */
  people?: number;
  /** Home-cooked meals in the week, across the household. Seven
      days times however many meals a day are cooked at home. */
  meals?: number;
}): OilPerMeal | null {
  const { mlWeek, people, meals } = opts;
  if (!mlWeek || !people || !meals) return null;
  if (mlWeek <= 0 || people <= 0 || meals <= 0) return null;
  /* More than five litres a week, or a hundred meals, is a typo
     or a restaurant. */
  if (mlWeek > 5000 || people > 20 || meals > 100) return null;

  const mlPerMeal = mlWeek / people / meals;
  const mid = mlPerMeal * OIL_KCAL_PER_ML;
  return {
    kcal: range(mid, mid / 3),
    mlPerMeal,
    people,
    meals,
  };
}
