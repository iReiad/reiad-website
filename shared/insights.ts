/* ============================================================
   shared/insights.ts: the readings a log earns. Section 16's,
   section 17's money, section 18's one sleep reading and
   section 19's two about movement.

   `DIET.md` sections 16, 17, 18 and 19. `shared/diet.ts` already
   holds three of section 16's readings (`topSources`,
   `byWeekday`, `byHour`) and `shared/activity.ts` holds the step
   arithmetic; every one of them is imported rather than written
   again: nothing in this file recomputes a total, an hour, a
   slope or a median step count.

   ---- the rule every function here obeys ----

   **A templated sentence is a sentence somebody has to be able
   to check.** So no function here returns a verdict. Each one
   returns the FIGURES the sentence is made of, including the
   span it was measured over and how many days of that span were
   written down, and the panel prints the arithmetic beside the
   answer. A reader who cannot follow the sum will not believe
   the number, and they are right not to.

   **An insight with too little data says so and draws nothing.**
   That is section 15's coverage floor applied one level up:
   every function that can be short of data returns `null` or
   carries its own coverage, and a caller that gets `null` prints
   a sentence about what it will show and when. A zero is not an
   empty state.

   **A correlation is described, never explained.** Nothing here
   returns a cause. "Your heavier days are usually Fridays" is a
   fact; "Fridays are ruining your progress" is a judgement, and
   the same rule covers money: cost per gram of protein is a
   fact, "you spent too much" is not.

   ---- why the library comes in as an argument ----

   `Item` below is the shape this file needs of a portion, and
   `shared/foods.ts` is not imported. A `Portion` satisfies
   `Item` structurally, so the panel hands rows straight in, and
   the test hands in four made-up rows instead of depending on
   the real library staying the shape a test was written
   against.

   ---- and no clock ----

   `weighings()` in `shared/diet.ts` says why and this file
   follows it: a caller owns the origin and hands in `dayOf` and
   `today`. A file that reads a clock is a file whose tests pass
   in one timezone.

   `scripts/insights.test.ts` is the guard.
   ============================================================ */

import {
  COVERAGE_FLOOR, KCAL_PER_KG, STALL_DAYS, entryHour, slopePerWeek,
  type Day, type Entry, type Point, type Range,
} from "./diet.ts";
import {
  SLEEP_HOURS, STEP_BASE_LEAST, shiftIso, stepShift, stepsKcal,
} from "./activity.ts";

/** One row of the portion library, as this file needs it.

    A `Portion` from `shared/foods.ts` satisfies this without a
    cast or an adapter. `raw` is here for one reason and it is
    not decoration: see `swaps()`. */
export interface Item {
  id: string;
  en: string;
  bn: string;
  kcal: number;
  protein: number;
  fibre: number;
  /** What one portion weighs, where the row says. A row with no
      weight cannot be compared with another by weight, which is
      the only honest way to compare two portions of different
      size. */
  grams?: number;
  price?: number;
  currency?: "BDT" | "GBP";
  /** `YYYY-MM`. A price is a fact with a date on it. */
  pricedOn?: string;
  tags?: readonly string[];
  /** True where the figure is for the raw food. */
  raw?: boolean;
}

/** What resolves an entry's `source_id` to a library row.
    Undefined for anything logged from a public database or typed
    by hand, which is exactly the gap every coverage figure here
    is measuring. */
export type Resolve = (sourceId: string) => Item | undefined;

const mean = (xs: number[]): number =>
  (xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : 0);

/** The middle value, which is what a claim about a typical row
    should be made of. A mean over a library is one expensive row
    away from being a sentence about that row. */
const median = (xs: number[]): number => {
  if (!xs.length) return 0;
  const sorted = [...xs].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
};

/** Whole days from one ISO date to another. Arithmetic on two
    dates rather than a clock, which is the rule at the top: the
    caller still owns every origin and this owns none. */
const daysBetween = (from: string, to: string): number =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);

/** What was actually eaten. A planned row is next week's dinner
    dated ahead, and counting it is a log that reports a meal
    nobody has had yet. Every function here starts with this, the
    same way `totalFor()` does. */
const eaten = (entries: Entry[]): Entry[] => entries.filter((e) => !e.planned);

/** How many days a set of entries covers, counted as DISTINCT
    DATES WRITTEN DOWN rather than as the width of the window.

    A reader who logged ten days out of a hundred and twenty has
    a rate per logged day; dividing by a hundred and twenty would
    report a habit ten times smaller than the one they have. Every
    "a week" figure in this file is per logged day times seven,
    and the count is printed beside it. */
export const loggedDays = (entries: Entry[]): number =>
  new Set(eaten(entries).map((e) => e.date)).size;

/* ------------------------------------------------------------
   1. How protein is spread across the day
   ------------------------------------------------------------ */

export type SlotId = "morning" | "midday" | "evening" | "late";

/** Four slots rather than three meals, because this tool logs a
    clock and not a meal name for most rows: `at_time` is the
    column and `entryHour()` reads it. The boundaries are the
    ordinary shape of a day in both places and nothing turns on
    them being exactly these, which is why the panel prints the
    hours beside the names. */
export const SLOTS: ReadonlyArray<{ id: SlotId; from: number; to: number }> = [
  { id: "morning", from: 4, to: 11 },
  { id: "midday", from: 11, to: 16 },
  { id: "evening", from: 16, to: 21 },
  /* Wraps midnight, which is why this is a function below rather
     than a range test written out four times. */
  { id: "late", from: 21, to: 4 },
];

export const slotOf = (hour: number): SlotId => {
  if (hour >= 4 && hour < 11) return "morning";
  if (hour >= 11 && hour < 16) return "midday";
  if (hour >= 16 && hour < 21) return "evening";
  return "late";
};

export interface ProteinSplit {
  slots: Array<{ id: SlotId; grams: number; share: number }>;
  /** Grams of protein on rows that carry an hour, and grams on
      every row. The first over the second is `coverage`, and it
      is the number the panel prints under the split: a split
      drawn from half the protein is a split about half a day. */
  placed: number;
  total: number;
  coverage: number;
  /** Distinct dates written down, and the mean protein a day
      over them. */
  days: number;
  perDay: number;
  /** The biggest slot, or null where nothing could be placed. */
  peak: SlotId | null;
}

/** Total protein hit with most of it at dinner is not the same
    as the same total spread over three meals, and this is the
    split. It is descriptive: no slot is the right one. */
export function proteinSplit(entries: Entry[]): ProteinSplit {
  const rows = eaten(entries);
  const grams: Record<SlotId, number> = { morning: 0, midday: 0, evening: 0, late: 0 };
  let placed = 0;
  let total = 0;

  for (const e of rows) {
    const p = e.macros?.protein ?? 0;
    if (!(p > 0)) continue;
    total += p;
    const hour = entryHour(e);
    if (hour === null) continue;
    grams[slotOf(hour)] += p;
    placed += p;
  }

  const days = new Set(rows.map((e) => e.date)).size;
  const slots = SLOTS.map((s) => ({
    id: s.id,
    grams: grams[s.id],
    share: placed > 0 ? grams[s.id] / placed : 0,
  }));
  const top = [...slots].sort((a, b) => b.grams - a.grams)[0];

  return {
    slots,
    placed,
    total,
    coverage: total > 0 ? placed / total : 0,
    days,
    perDay: days > 0 ? total / days : 0,
    peak: top && top.grams > 0 ? top.id : null,
  };
}

/* ------------------------------------------------------------
   2. What a swap would do
   ------------------------------------------------------------ */

/** How many of a row's own portions one entry was.

    The ENERGY RATIO, because `scaleTo()` in `shared/foods.ts`
    scales every figure on a row by one factor and `kcal` is the
    figure every entry carries. Reading `qty` and `unit` back
    instead would be a second copy of that function's basis rule,
    and the two would disagree the first time a unit was added.

    Null rather than one, where the row states no energy or the
    entry does: a portion count invented for a zero is a price
    and a saving invented with it. */
export const portionsOf = (e: Entry, item: Item): number | null => {
  if (!(item.kcal > 0)) return null;
  const kcal = e.kcal;
  if (kcal == null || !(kcal > 0)) return null;
  return kcal / item.kcal;
};

export interface Swap {
  item: Item;
  /** Times it was logged, and times a week on the days that were
      written down. */
  times: number;
  perWeek: number;
  /** The mean size of one logging, in the row's own portions. */
  meanPortions: number;
  /** What it contributes a week, and what half of it would come
      to. Both at the rate it is already logged. */
  kcalPerWeek: number;
  halfPerWeek: number;
  /** The one other food ALREADY IN THIS LOG, sharing a tag,
      weighed, at a lower energy for the same weight. Absent
      where there is none, which is honest rather than empty. */
  swap?: {
    to: Item;
    /** The weight one logging of `item` comes to. Both figures
        below are at that weight, which is the only comparison
        that is not an argument about portion sizes. */
    grams: number;
    fromKcal: number;
    toKcal: number;
    /** Signed, over a week. Negative is less. */
    kcalPerWeek: number;
    proteinPerWeek: number;
  };
}

/** From the portion library only, and arithmetic only. It never
    suggests a different cuisine, never says a food is bad, and
    never proposes anything not already in the reader's own log:
    both halves of every row below came out of `entries`.

    Ordered by what halving would come to, because that is the
    figure the reader is being shown. */
export function swaps(opts: {
  entries: Entry[];
  resolve: Resolve;
  /** How many rows to return. Three, because section 16 says the
      answer is almost always three items. */
  n?: number;
}): Swap[] {
  const { entries, resolve, n = 3 } = opts;
  const rows = eaten(entries);
  const days = new Set(rows.map((e) => e.date)).size;
  if (!days) return [];

  interface Seen { item: Item; times: number; portions: number; kcal: number }
  const by = new Map<string, Seen>();
  for (const e of rows) {
    if (!e.sourceId) continue;
    const item = resolve(e.sourceId);
    if (!item) continue;
    const portions = portionsOf(e, item);
    if (portions === null) continue;
    const seen = by.get(item.id) ?? { item, times: 0, portions: 0, kcal: 0 };
    seen.times += 1;
    seen.portions += portions;
    seen.kcal += e.kcal ?? 0;
    by.set(item.id, seen);
  }

  const inLog = [...by.values()].map((s) => s.item);
  const density = (i: Item): number | null =>
    (i.grams != null && i.grams > 0 && i.kcal > 0 ? i.kcal / i.grams : null);

  const out: Swap[] = [];
  for (const seen of by.values()) {
    const perWeek = (seen.times / days) * 7;
    const kcalPerWeek = (seen.kcal / days) * 7;
    const meanPortions = seen.portions / seen.times;
    const row: Swap = {
      item: seen.item,
      times: seen.times,
      perWeek,
      meanPortions,
      kcalPerWeek,
      halfPerWeek: kcalPerWeek / 2,
    };

    const mine = density(seen.item);
    if (mine !== null && seen.item.grams != null) {
      const grams = seen.item.grams * meanPortions;
      /* RAW AGAINST COOKED IS NOT A SWAP, and without this line
         it is the swap this function finds first. A hundred
         grams of raw rice is 365 kcal and a hundred grams of
         cooked rice is about 130, so the biggest "saving" in
         any Bangladeshi log is the cooking water, printed as
         advice. Both rows are staples, both are weighed, and
         the arithmetic is impeccable. */
      const candidates = inLog.filter((other) => {
        if (other.id === seen.item.id) return false;
        if (Boolean(other.raw) !== Boolean(seen.item.raw)) return false;
        const theirs = density(other);
        if (theirs === null || theirs >= mine) return false;
        return (other.tags ?? []).some((t) => (seen.item.tags ?? []).includes(t));
      });
      const to = candidates.sort(
        (a, b) => (density(a) as number) - (density(b) as number),
      )[0];
      if (to) {
        const fromKcal = mine * grams;
        const toKcal = (density(to) as number) * grams;
        const gramsRatio = grams / (to.grams as number);
        row.swap = {
          to,
          grams,
          fromKcal,
          toKcal,
          kcalPerWeek: (toKcal - fromKcal) * perWeek,
          proteinPerWeek:
            (to.protein * gramsRatio - seen.item.protein * meanPortions) * perWeek,
        };
      }
    }
    out.push(row);
  }

  return out.sort((a, b) => b.halfPerWeek - a.halfPerWeek).slice(0, n);
}

/* ------------------------------------------------------------
   3. How full a hundred calories is
   ------------------------------------------------------------ */

export interface Fullness {
  item: Item;
  /** Grams per 100 kcal. */
  protein: number;
  fibre: number;
}

/** A descriptive property that ranks foods by how long they hold
    you without ever calling one of them bad, and it is the
    honest form of every "good food, bad food" list ever written.

    It needs no log and no account: it is a fact about the
    library. */
export function per100kcal(
  items: Item[], by: "protein" | "fibre" = "protein", n = 8,
): Fullness[] {
  return items
    .filter((i) => i.kcal > 0)
    .map((i) => ({
      item: i,
      protein: (i.protein / i.kcal) * 100,
      fibre: (i.fibre / i.kcal) * 100,
    }))
    .sort((a, b) => b[by] - a[by])
    .slice(0, n);
}

/* ------------------------------------------------------------
   4. This week against the reader's own average
   ------------------------------------------------------------ */

export interface WeekVsOwn {
  weekDays: number;
  weekMean: number;
  beforeDays: number;
  beforeMean: number;
  /** The week minus the average before it. Positive is above. */
  diff: number;
  /** The same as a share of the average before it. */
  pct: number;
  /** The width of what it was compared against, in days. */
  span: number;
}

/** Never against anybody else's. There is no leaderboard and no
    cohort, so the comparison is the reader's own earlier days
    and the panel says which ones.

    Null under either floor, because a week of two logged days
    against a fortnight of three is arithmetic on noise. */
export function weekVsOwn(opts: {
  days: Day[];
  dayOf: (iso: string) => number;
  today: number;
  minWeek?: number;
  minBefore?: number;
}): WeekVsOwn | null {
  const { days, dayOf, today, minWeek = 4, minBefore = 10 } = opts;
  const week: number[] = [];
  const before: number[] = [];
  let first = today;

  for (const d of days) {
    if (d.kcal == null || !(d.kcal > 0)) continue;
    const day = dayOf(d.date);
    if (day > today) continue;
    first = Math.min(first, day);
    if (day > today - 7) week.push(d.kcal);
    else before.push(d.kcal);
  }

  if (week.length < minWeek || before.length < minBefore) return null;
  const weekMean = mean(week);
  const beforeMean = mean(before);
  return {
    weekDays: week.length,
    weekMean,
    beforeDays: before.length,
    beforeMean,
    diff: weekMean - beforeMean,
    pct: beforeMean > 0 ? (weekMean - beforeMean) / beforeMean : 0,
    span: today - 7 - first + 1,
  };
}

/* ------------------------------------------------------------
   5. Adherence against the trend
   ------------------------------------------------------------ */

/** Either side of the target, in kcal a day, before a week stops
    counting as held. A hundred rather than nothing, because no
    week's mean lands on a target exactly and a band of zero puts
    every week in the same group. */
export const HELD_BAND = 100;

export type Adhered = "under" | "held" | "over";

export interface AdherenceWeek {
  from: number;
  to: number;
  logged: number;
  meanKcal: number;
  /** Mean minus target. Positive is over. */
  gap: number;
  where: Adhered;
  /** What the trend did across the block, in kg. Negative is
      loss. Null where the trend has no reading at both ends of
      it, which is a week the reader did not weigh. */
  trendKg: number | null;
  trendDays: number;
}

export interface AdherenceGroup {
  weeks: number;
  meanKcal: number;
  meanGap: number;
  /** Weighted by the days each week's trend actually spanned,
      rather than a mean of ratios: a block whose two weighings
      are four days apart is not worth the same as one spanning
      seven. Null where no week in the group had a trend. */
  kgPerWeek: number | null;
}

export interface Adherence {
  weeks: AdherenceWeek[];
  groups: Record<Adhered, AdherenceGroup>;
  band: number;
  targetKcal: number;
  /** Two groups with two weeks each is the least this can be
      read from. Below it the panel prints the table and not the
      comparison. */
  comparable: boolean;
}

/** The one place the log and the weight meet: weeks where the
    target was held, plotted against what the trend did. That is
    the evidence for whether the target is right.

    Null under three usable weeks, because two points make a line
    through anything. */
export function adherence(opts: {
  days: Day[];
  trend: Point[];
  dayOf: (iso: string) => number;
  today: number;
  targetKcal: number;
  band?: number;
  minLogged?: number;
  minWeeks?: number;
}): Adherence | null {
  const {
    days, trend, dayOf, today, targetKcal,
    band = HELD_BAND, minLogged = 4, minWeeks = 3,
  } = opts;
  if (!(targetKcal > 0)) return null;

  const intake = new Map<number, number>();
  let earliest = today;
  for (const d of days) {
    if (d.kcal == null || !(d.kcal > 0)) continue;
    const day = dayOf(d.date);
    if (day > today) continue;
    intake.set(day, d.kcal);
    earliest = Math.min(earliest, day);
  }

  const line = [...trend].sort((a, b) => a.day - b.day);
  const weeks: AdherenceWeek[] = [];

  /* Whole seven-day blocks counted BACK FROM TODAY, so the block
     a reader is in the middle of is not compared with six that
     are finished. */
  for (let to = today; to - 6 >= earliest; to -= 7) {
    const from = to - 6;
    const kcals: number[] = [];
    for (let day = from; day <= to; day += 1) {
      const k = intake.get(day);
      if (k != null) kcals.push(k);
    }
    if (kcals.length < minLogged) continue;

    const inside = line.filter((p) => p.day >= from && p.day <= to);
    const trendKg = inside.length >= 2
      ? inside[inside.length - 1].kg - inside[0].kg
      : null;
    const trendDays = inside.length >= 2
      ? inside[inside.length - 1].day - inside[0].day
      : 0;

    const meanKcal = mean(kcals);
    const gap = meanKcal - targetKcal;
    weeks.push({
      from,
      to,
      logged: kcals.length,
      meanKcal,
      gap,
      where: gap > band ? "over" : gap < -band ? "under" : "held",
      /* A block whose two weighings are one day apart says
         nothing about a week, and dividing by it says something
         loud. */
      trendKg: trendDays >= 3 ? trendKg : null,
      trendDays: trendDays >= 3 ? trendDays : 0,
    });
  }

  if (weeks.length < minWeeks) return null;

  const groupOf = (where: Adhered): AdherenceGroup => {
    const mine = weeks.filter((w) => w.where === where);
    const withTrend = mine.filter((w) => w.trendKg !== null);
    const kg = withTrend.reduce((s, w) => s + (w.trendKg as number), 0);
    const span = withTrend.reduce((s, w) => s + w.trendDays, 0);
    return {
      weeks: mine.length,
      meanKcal: mean(mine.map((w) => w.meanKcal)),
      meanGap: mean(mine.map((w) => w.gap)),
      kgPerWeek: span > 0 ? (kg / span) * 7 : null,
    };
  };

  const groups = {
    under: groupOf("under"),
    held: groupOf("held"),
    over: groupOf("over"),
  };
  const readable = ([groups.under, groups.held, groups.over] as AdherenceGroup[])
    .filter((g) => g.weeks >= 2 && g.kgPerWeek !== null);

  return {
    weeks,
    groups,
    band,
    targetKcal,
    comparable: readable.length >= 2,
  };
}

/* ------------------------------------------------------------
   6. What this reader's own deficit actually does
   ------------------------------------------------------------ */

/** A month before a calibration constant is offered at all.
    `learnedBurn()` will answer after a fortnight, which is the
    right floor for a maintenance figure and the wrong one for a
    ratio of two rates: the second is a division, and a division
    by a fortnight of water weight is a number with a decimal
    point and no content. */
export const CALIBRATE_AFTER_DAYS = 28;

/** Below this, in kcal a day, the gap is not distinguishable
    from eating at maintenance, and dividing by it produces a
    ratio that swings from three to minus three on one biscuit. */
export const MIN_CALIBRATION_GAP = 150;

export interface Calibration {
  days: number;
  logged: number;
  meanIntake: number;
  /** What the equations say this body burns, worked out from
      height, weight, age and an activity answer, and NOT from
      any of the weight readings below. That independence is the
      whole of what makes this a calibration rather than a
      circle: `learnedBurn()` derives maintenance FROM the trend,
      so checking a prediction made with it against the trend
      would return one, every time, for everybody. */
  estimatedBurn: number;
  /** Estimated burn minus mean intake. Positive is a deficit. */
  gap: number;
  /** The gap in kg a week, at 7700 kcal per kg. Positive is
      loss. */
  predictedKgPerWeek: number;
  /** What the trend actually did, same sign. */
  observedKgPerWeek: number;
  /** Observed over predicted, or null where the gap is too small
      to divide by. */
  ratio: number | null;
}

/** "The last time you held about 500 under, the trend fell 0.4
    kg a week, not the 0.5 the arithmetic predicted." That is a
    personal calibration constant, and it is better than any
    equation because it is measured on the only body in question.

    WHAT THE GAP IS MADE OF IS NOT KNOWABLE FROM HERE, and this
    returns no opinion about it. Under-logging, a wrong activity
    answer and adaptive thermogenesis all move it the same way
    and this figure holds all three at once, which is the same
    thing `learnedBurn()` says about itself. */
export function calibration(opts: {
  learned: { days: number; logged: number; meanIntake: number; trendKgPerWeek: number } | null;
  estimatedBurn: number;
  minDays?: number;
  minGap?: number;
}): Calibration | null {
  const {
    learned, estimatedBurn,
    minDays = CALIBRATE_AFTER_DAYS, minGap = MIN_CALIBRATION_GAP,
  } = opts;
  if (!learned || !(estimatedBurn > 0)) return null;
  if (learned.days < minDays) return null;

  const gap = estimatedBurn - learned.meanIntake;
  const predictedKgPerWeek = (gap * 7) / KCAL_PER_KG;
  const observedKgPerWeek = -learned.trendKgPerWeek;

  return {
    days: learned.days,
    logged: learned.logged,
    meanIntake: learned.meanIntake,
    estimatedBurn,
    gap,
    predictedKgPerWeek,
    observedKgPerWeek,
    ratio: Math.abs(gap) >= minGap ? observedKgPerWeek / predictedKgPerWeek : null,
  };
}

/* ------------------------------------------------------------
   7. What food costs
   ------------------------------------------------------------ */

/** Out of date by more than this and the figure is shown greyed
    with its date, not silently. Six months is section 17's "more
    than a few months", written down once so the panel and the
    test read the same number. */
export const STALE_MONTHS = 6;

/** Whole months between two `YYYY-MM` stamps, or null where
    either is not one. Null rather than nought: an unparseable
    date is not a fresh price, and treating it as one is how an
    undated figure gets drawn as a dated one. */
export function monthsSince(pricedOn: string | undefined, now: string): number | null {
  const at = /^(\d{4})-(\d{2})$/.exec(pricedOn ?? "");
  const to = /^(\d{4})-(\d{2})$/.exec(now);
  if (!at || !to) return null;
  return (Number(to[1]) - Number(at[1])) * 12 + (Number(to[2]) - Number(at[2]));
}

export const isStale = (pricedOn: string | undefined, now: string): boolean => {
  const months = monthsSince(pricedOn, now);
  return months === null || months > STALE_MONTHS;
};

export interface Spend {
  /** Distinct dates written down in the window. */
  days: number;
  /** What the priced part of the log came to, in `currency`. */
  cost: number;
  currency: "BDT" | "GBP";
  /** The share of the window's ENERGY that carried a price, on
      the same footing as section 15's coverage: a cost worked
      out from a third of the food is a cost about a third of the
      food, and the panel prints the share rather than the total
      alone. Under `COVERAGE_FLOOR` it draws nothing. */
  coverage: number;
  kcalPriced: number;
  kcalAll: number;
  proteinPriced: number;
  /** The three ratios, over the priced part only. Section 17:
      the interesting reading is the ratio and not the total. */
  perDay: number;
  per1000Kcal: number;
  per100gProtein: number | null;
  /** Ids of priced rows in this log whose price is older than
      `STALE_MONTHS`, so the panel can grey them with their date
      rather than passing them off. */
  stale: string[];
}

/** What the log cost, from the library's own prices.

    ONE CURRENCY AT A TIME. A row priced in taka and a row priced
    in pounds cannot be added, so a row in the other currency is
    not counted and falls into the uncovered share, which is
    where a reader can see it. Converting them would put an
    exchange rate into a diet tool, and an undated rate is worse
    than an undated price. */
export function spend(opts: {
  entries: Entry[];
  resolve: Resolve;
  currency: "BDT" | "GBP";
  /** `YYYY-MM`, for the staleness of a price and nothing else. */
  now: string;
}): Spend {
  const { entries, resolve, currency, now } = opts;
  const rows = eaten(entries);
  let cost = 0;
  let kcalPriced = 0;
  let kcalAll = 0;
  let proteinPriced = 0;
  const stale = new Set<string>();

  for (const e of rows) {
    kcalAll += e.kcal ?? 0;
    if (!e.sourceId) continue;
    const item = resolve(e.sourceId);
    if (!item || item.price == null || item.currency !== currency) continue;
    const portions = portionsOf(e, item);
    if (portions === null) continue;
    cost += item.price * portions;
    kcalPriced += e.kcal ?? 0;
    proteinPriced += item.protein * portions;
    if (isStale(item.pricedOn, now)) stale.add(item.id);
  }

  const days = new Set(rows.map((e) => e.date)).size;
  return {
    days,
    cost,
    currency,
    coverage: kcalAll > 0 ? kcalPriced / kcalAll : 0,
    kcalPriced,
    kcalAll,
    proteinPriced,
    perDay: days > 0 ? cost / days : 0,
    per1000Kcal: kcalPriced > 0 ? (cost / kcalPriced) * 1000 : 0,
    per100gProtein: proteinPriced > 0 ? (cost / proteinPriced) * 100 : null,
    stale: [...stale],
  };
}

export interface AgainstBudget {
  weekly: number;
  perDay: number;
  /** The priced part of the log, per logged day. */
  spentPerDay: number;
  /** Spent minus budget, per day. Positive is above. */
  diffPerDay: number;
  /** What the WHOLE log would come to a day if the part with no
      price cost the same per calorie as the part with one.

      A projection, and the panel labels it as one. It is here
      because a budget covers all the food and `spentPerDay`
      covers the priced share, so comparing those two directly
      would report a reader as under budget by exactly the amount
      this site does not have a price for. */
  wholeLogPerDay: number | null;
}

/** Spend against intake, which is the one thing section 17 asks
    a food budget to do. It is never a judgement: this returns
    two numbers and their difference, and no word for the
    difference. */
export function againstBudget(s: Spend, weekly: number): AgainstBudget | null {
  if (!(weekly > 0) || s.days === 0) return null;
  const perDay = weekly / 7;
  return {
    weekly,
    perDay,
    spentPerDay: s.perDay,
    diffPerDay: s.perDay - perDay,
    wholeLogPerDay: s.coverage > 0 ? s.perDay / s.coverage : null,
  };
}

/** The `subject` a `metric` target carries when its number is
    measured out of the food log rather than typed in by the
    reader.

    Section 30, and it is NOT a fourth kind: a food budget is the
    third kind gaining a source, which is exactly what a weight
    goal does the moment `diet_days` exists. It is in the
    `subject` column of rows that already exist, so never rename
    it. */
export const FOOD_BUDGET = "diet:food-budget";

export interface BudgetTarget {
  /** What the reader is aiming to spend in a week, in the
      target's own currency. */
  weekly: number;
  /** What the week came to, PROJECTED OVER THE WHOLE LOG.
      Never a bill, and every caller has to say so: the priced
      share alone is short by exactly the food this site has no
      price for, which would report every reader as under. */
  spentWeek: number;
  /** Signed. Negative is under the budget. */
  diffWeek: number;
  /** The share of the log's ENERGY the figure was drawn from.
      In the returned shape rather than left on `Spend` so that
      nothing can print `spentWeek` without it. */
  coverage: number;
}

/** A food budget, measured, which is what makes it a target of
    the account's rather than a number the reader keeps typing
    back in.

    Null where it cannot be measured honestly: no budget, no
    logged day, or under section 15's coverage floor. A caller
    that gets null draws NO BAR, because a bar drawn from a
    figure this site cannot stand behind looks exactly like one
    it can. */
export function budgetTarget(s: Spend, weekly: number): BudgetTarget | null {
  const against = againstBudget(s, weekly);
  if (!against || against.wholeLogPerDay === null) return null;
  if (s.coverage < COVERAGE_FLOOR) return null;
  const spentWeek = against.wholeLogPerDay * 7;
  return { weekly, spentWeek, diffWeek: spentWeek - weekly, coverage: s.coverage };
}

export interface TagCost {
  tag: string;
  rows: number;
  /** The MIDDLE row of the group rather than the mean of it. */
  per1000Kcal: number;
  per100gProtein: number | null;
}

/** What a kind of food costs per calorie and per gram of
    protein, out of the library rather than out of a log.

    This is what puts a figure on the two sentences section 17
    says should carry one: keto costs more per calorie, and a
    higher protein target costs more unless it is met from dal,
    eggs and small fish. Both are arithmetic on a price table,
    both are descriptive, and neither names a shop. */
export function costByTag(items: Item[], currency: "BDT" | "GBP"): TagCost[] {
  const by = new Map<string, { energy: number[]; protein: number[] }>();
  for (const i of items) {
    if (i.price == null || i.currency !== currency || !(i.kcal > 0)) continue;
    for (const tag of i.tags ?? []) {
      const seen = by.get(tag) ?? { energy: [], protein: [] };
      seen.energy.push((i.price / i.kcal) * 1000);
      if (i.protein > 0) seen.protein.push((i.price / i.protein) * 100);
      by.set(tag, seen);
    }
  }
  return [...by.entries()]
    .map(([tag, seen]) => ({
      tag,
      rows: seen.energy.length,
      per1000Kcal: median(seen.energy),
      per100gProtein: seen.protein.length ? median(seen.protein) : null,
    }))
    .sort((a, b) => a.per1000Kcal - b.per1000Kcal);
}

export interface ProteinPrice {
  rows: number;
  /** The cheapest row per 100 g of protein in this library, and
      what it costs. Almost always a pulse, an egg or a small
      fish, which is what section 17 says and what makes "the
      cheapest protein you will actually eat" a real question. */
  cheapest: Item;
  cheapestPer100g: number;
  medianPer100g: number;
  /** How many times the cheapest row the middle one is. THE
      SPREAD IS THE READING: a higher protein target costs more,
      and how much more is a choice rather than a fact. */
  times: number;
}

/** What meeting a protein floor costs, at the cheap end of a
    library and in the middle of it.

    The other of section 17's two priced recommendations. It says
    nothing about which row to eat: the cheapest row in a table
    is not the one somebody will actually eat, which is the whole
    reason that phrase is in the plan. */
export function proteinPrice(items: Item[], currency: "BDT" | "GBP"): ProteinPrice | null {
  const rows = items
    .filter((i) => i.price != null && i.currency === currency && i.protein > 0)
    .map((i) => ({ item: i, per: ((i.price as number) / i.protein) * 100 }))
    .sort((a, b) => a.per - b.per);
  if (rows.length < 3) return null;
  const middle = median(rows.map((r) => r.per));
  return {
    rows: rows.length,
    cheapest: rows[0].item,
    cheapestPer100g: rows[0].per,
    medianPer100g: middle,
    times: rows[0].per > 0 ? middle / rows[0].per : 0,
  };
}

/* ------------------------------------------------------------
   8. Days after a short night
   ------------------------------------------------------------ */

/** The line a night is under, in hours. `SLEEP_HOURS` in
    `shared/activity.ts` draws the habit row against the same
    seven and is imported rather than restated: two numbers for
    one line is a page calling a night short beside a row calling
    it long. */
export const SHORT_NIGHT_HOURS = SLEEP_HOURS;

/** The fewest pairs on each side of the line. Five, because a
    mean of two days is a sentence about two days, and both
    counts are printed beside the answer whatever they are. */
export const NIGHTS_LEAST = 5;

export interface AfterSleep {
  /** The line a night was under, and the reader's own middle
      night, so "short" can be read against their own nights
      rather than only against the line. */
  short: number;
  medianHours: number;
  /** Rows carrying an hours figure, and how many of those also
      carry food. A day with hours on it and nothing eaten
      written down is not a pair. */
  nights: number;
  pairs: number;
  /** The first and last row that made a pair, and the days
      between them inclusive. */
  from: string;
  to: string;
  span: number;
  /** The two groups: days after a night under the line, and days
      after every other night. */
  afterShort: { days: number; meanKcal: number };
  afterRest: { days: number; meanKcal: number };
  /** After a short night minus after the rest. Positive is more. */
  diff: number;
  /** Section 18's sentence is "days after short nights average so
      much above target", and these are the figures it is made
      of. Null where the caller has no target, which is every
      reader who has not answered the goal page. */
  targetKcal: number | null;
  overTarget: number | null;
  restOverTarget: number | null;
}

/** Section 18's one sleep reading, and the whole of what an
    hours field earns.

    A ROW'S HOURS ARE THE NIGHT THAT ENDED ON THAT ROW'S
    MORNING, so they pair with that row's OWN intake. Short
    sleep raises ghrelin and lowers leptin overnight and what it
    moves is the day that follows the night: the reader woke from
    it that morning and ate their way through that day, which is
    this row.

    Three things settle that and they point the same way.
    `weightKg` on a row is that morning's weighing, so the whole
    row hangs off one morning and its sleep has to mean the same
    night or the row means two things at once. Every importer
    agrees: Apple Health, Fitbit and Oura all date a night to the
    morning it ended, and `shared/csv.ts` maps `sleep`, `hours
    slept` and `time asleep` out of exactly those. And a form
    reads "last night", which is that same night again, so a
    typed row and an imported row agree by construction rather
    than by anybody remembering.

    OFFSET IT BY A DAY IN EITHER DIRECTION AND IT IS MEASURING
    THE WRONG PAIR while looking entirely correct, which is why
    the convention is written here, asserted from both sides in
    `scripts/insights.test.ts`, and printed on the panel.

    It returns two means and no word for the difference between
    them: section 16's rule, and section 18 is explicit that this
    is never turned into a sleep score. */
export function afterShortNights(opts: {
  days: Day[];
  /** The day's target, where the page has one. */
  targetKcal?: number;
  short?: number;
  least?: number;
}): AfterSleep | null {
  const {
    days, targetKcal, short = SHORT_NIGHT_HOURS, least = NIGHTS_LEAST,
  } = opts;

  const hours: number[] = [];
  const pairs: Array<{ date: string; hours: number; kcal: number }> = [];
  for (const d of days) {
    if (d.sleepHours == null) continue;
    hours.push(d.sleepHours);
    if (d.kcal == null || !(d.kcal > 0)) continue;
    pairs.push({ date: d.date, hours: d.sleepHours, kcal: d.kcal });
  }

  const under = pairs.filter((p) => p.hours < short);
  const rest = pairs.filter((p) => p.hours >= short);
  if (under.length < least || rest.length < least) return null;

  const shortMean = mean(under.map((p) => p.kcal));
  const restMean = mean(rest.map((p) => p.kcal));
  const dates = pairs.map((p) => p.date).sort();
  const first = dates[0];
  const last = dates[dates.length - 1];
  const target = targetKcal != null && targetKcal > 0 ? targetKcal : null;

  return {
    short,
    medianHours: median(hours),
    nights: hours.length,
    pairs: pairs.length,
    from: first,
    to: last,
    span: daysBetween(first, last) + 1,
    afterShort: { days: under.length, meanKcal: shortMean },
    afterRest: { days: rest.length, meanKcal: restMean },
    diff: shortMean - restMean,
    targetKcal: target,
    overTarget: target === null ? null : shortMean - target,
    restOverTarget: target === null ? null : restMean - target,
  };
}

/* ------------------------------------------------------------
   9. What moved, over the window a stall is read over
   ------------------------------------------------------------ */

export interface Movement {
  /** The window, in days, with the window of the same length
      before it, and the date the near one opens on. */
  days: number;
  from: string;
  /** The middle day of each half in steps, with how many days of
      each carried a count. Null where a half carries none. */
  now: number | null;
  before: number | null;
  nowDays: number;
  beforeDays: number;
  /** Now minus before, and the same as a share of before. */
  change: number | null;
  changePct: number | null;
  /** What that change is worth in energy a day, at the weight
      handed in. A band, and most of its width is the stride
      length: `STEPS_PER_KM` in `shared/activity.ts` says so.
      Null with no weight, because what a walk costs depends on
      the body doing it. */
  kcal: Range | null;
  /** What the trend did across the near window: kg a week with
      its own interval, and whether that interval spans zero,
      which is `stall()`'s own test for flat. Null under three
      weighings, which is `slopePerWeek()`'s refusal. */
  rate: Range | null;
  flat: boolean;
  weighings: number;
  /** What was logged over each window, as a mean a day, with the
      days each was drawn from. */
  intakeNow: number | null;
  intakeBefore: number | null;
  intakeDays: number;
  intakeBeforeDays: number;
  intakeChange: number | null;
}

/** Section 19's fourth stall, as three facts rather than as a
    verdict: "your trend is flat and your log has not changed,
    and your steps have fallen from about 8,000 a day to about
    4,500 over the same three weeks."

    The point is the SAME WINDOW. `stepShift()` already compares
    one window of walking against the one before it and
    `slopePerWeek()` already fits a rate; what is invisible
    without putting them side by side is movement falling quietly
    during a deficit, which is most of what adaptive
    thermogenesis is in practice and the easiest of the four
    stalls to answer.

    NOTHING HERE CONCLUDES. `flat` is a statement about an
    interval, not about a reader, and no field says what caused
    what. */
export function movement(opts: {
  days: Day[];
  todayISO: string;
  /** The fittable weighings, marked days already removed, in the
      caller's own day numbers, with the function that made them.
      The weighings and not the trend, for the reason
      `slopePerWeek()` gives: an average lags and would
      understate a real loss. */
  weights: Point[];
  dayOf: (iso: string) => number;
  /** The trend's weight today, for the energy band. */
  weightKg?: number;
  window?: number;
  least?: number;
}): Movement | null {
  const {
    days, todayISO, weights, dayOf, weightKg,
    window = STALL_DAYS, least = STEP_BASE_LEAST,
  } = opts;

  const walked = stepShift(days, todayISO, window);
  /* The same floor `stepBase()` reads a middle day under. A
     median from three days is a number about three days, and
     comparing two of those is a difference between two of them. */
  if (walked.nowDays < least || walked.beforeDays < least) return null;

  const from = shiftIso(todayISO, -(window - 1));
  const eatenIn = (a: string, b: string): number[] => days
    .filter((d) => d.date >= a && d.date <= b && d.kcal != null && (d.kcal as number) > 0)
    .map((d) => d.kcal as number);
  const nowKcal = eatenIn(from, todayISO);
  const beforeKcal = eatenIn(shiftIso(todayISO, -(window * 2 - 1)), shiftIso(todayISO, -window));

  const inside = weights.filter((p) => p.day >= dayOf(from) && p.day <= dayOf(todayISO));
  const rate = slopePerWeek(inside);
  const change = walked.now != null && walked.before != null
    ? walked.now - walked.before
    : null;

  return {
    days: window,
    from,
    now: walked.now,
    before: walked.before,
    nowDays: walked.nowDays,
    beforeDays: walked.beforeDays,
    change,
    changePct: change != null && walked.before ? change / walked.before : null,
    kcal: change != null && weightKg != null && weightKg > 0
      ? stepsKcal(change, weightKg)
      : null,
    rate,
    flat: rate != null && rate.low <= 0 && rate.high >= 0,
    weighings: inside.length,
    intakeNow: nowKcal.length ? mean(nowKcal) : null,
    intakeBefore: beforeKcal.length ? mean(beforeKcal) : null,
    intakeDays: nowKcal.length,
    intakeBeforeDays: beforeKcal.length,
    intakeChange: nowKcal.length && beforeKcal.length
      ? mean(nowKcal) - mean(beforeKcal)
      : null,
  };
}

/* ------------------------------------------------------------
   10. The tape, beside the scale
   ------------------------------------------------------------ */

export type MeasureId = "waist" | "hip" | "chest" | "thigh" | "arm" | "neck";

/** Every site a day row can carry, and how to read one off it. A
    TABLE RATHER THAN SIX BRANCHES, so a seventh site is a line
    here and nothing else. Three of the six have no form offering
    them yet, and a site with fewer than two readings is simply
    absent rather than drawn empty. */
export const MEASURES: ReadonlyArray<{
  id: MeasureId; of: (d: Day) => number | undefined;
}> = [
  { id: "waist", of: (d) => d.waistCm },
  { id: "hip", of: (d) => d.hipCm },
  { id: "chest", of: (d) => d.chestCm },
  { id: "thigh", of: (d) => d.thighCm },
  { id: "arm", of: (d) => d.armCm },
  { id: "neck", of: (d) => d.neckCm },
];

/** What a tape measure resolves on one person, in centimetres.
    Under it the number is the measuring rather than the body.
    `stall()` uses the same centimetre as its recomposition
    threshold and should read this constant the next time
    `shared/diet.ts` is opened. */
export const TAPE_RESOLUTION_CM = 1;

/** Four weeks, which is section 19's own example and the width a
    centimetre is worth reading over. */
export const TAPE_SPAN_DAYS = 28;

/** And the least two readings of one site may be apart. A
    centimetre three days apart is a tape held tighter. */
export const TAPE_LEAST_DAYS = 14;

export interface TapeSite {
  id: MeasureId;
  first: number;
  last: number;
  /** Last minus first. Negative is down. */
  change: number;
  /** Days between those two readings, and how many readings the
      site carried in the span. */
  days: number;
  readings: number;
  /** Whether the change is larger than what a tape resolves. */
  read: boolean;
}

export interface Tape {
  /** The span asked for, in days. */
  span: number;
  sites: TapeSite[];
  /** What the trend did across the same span, in kg, and how
      many trend points said so. Null under two, which is a span
      the reader did not weigh. */
  kg: number | null;
  weighings: number;
}

/** The tape beside the scale, which is section 19's reading that
    justifies the whole measurement set.

    A flat weight with a falling waist is a change in what the
    weight is made of rather than a stall, and it is the one kind
    the tool can settle on its own. `stall()` already returns
    that as a kind and only INSIDE a detected stall: three flat
    weeks, nine weighings and half the days logged. This is the
    same two facts side by side whether or not one was detected,
    because a reader who is not stalled still cannot see this out
    of a weight.

    Two numbers per site and no word for the pair. */
export function tape(opts: {
  days: Day[];
  /** The trend and never two readings off a scale: one weighing
      is real weight plus a kilo or two of water, gut contents
      and salt. */
  trend: Point[];
  dayOf: (iso: string) => number;
  today: number;
  span?: number;
  least?: number;
}): Tape | null {
  const {
    days, trend, dayOf, today, span = TAPE_SPAN_DAYS, least = TAPE_LEAST_DAYS,
  } = opts;
  const from = today - span + 1;

  const sites: TapeSite[] = [];
  for (const site of MEASURES) {
    const rows = days
      .map((d) => ({ day: dayOf(d.date), cm: site.of(d) }))
      .filter((r): r is { day: number; cm: number } => r.cm != null)
      .filter((r) => r.day >= from && r.day <= today)
      .sort((a, b) => a.day - b.day);
    if (rows.length < 2) continue;
    const first = rows[0];
    const last = rows[rows.length - 1];
    const apart = last.day - first.day;
    if (apart < least) continue;
    sites.push({
      id: site.id,
      first: first.cm,
      last: last.cm,
      change: last.cm - first.cm,
      days: apart,
      readings: rows.length,
      read: Math.abs(last.cm - first.cm) >= TAPE_RESOLUTION_CM,
    });
  }
  if (!sites.length) return null;

  const line = trend.filter((p) => p.day >= from && p.day <= today)
    .sort((a, b) => a.day - b.day);
  return {
    span,
    sites,
    kg: line.length >= 2 ? line[line.length - 1].kg - line[0].kg : null,
    weighings: line.length,
  };
}

/** Section 15's floor, re-exported so a panel reading an
    insight's coverage and a panel reading a nutrient's coverage
    cannot end up testing against two different halves. */
export { COVERAGE_FLOOR };
