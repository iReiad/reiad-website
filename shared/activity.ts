/* ============================================================
   activity.ts: what the reader's own movement is worth. `DIET.md`
   sections 19 and 11. A second file rather than more of
   `shared/diet.ts` because everything there that looks forward
   assumes an activity factor holds, and steps are the largest
   variable in what somebody burns and the one that quietly falls
   during a deficit.

   NO FUNCTION HERE RETURNS A NUMBER IT CANNOT KNOW: every figure
   is a `Range`, and the two error bars, what a kilometre costs
   per kilogram and how many steps a kilometre is, are kept apart
   until the last multiplication.

   NOTHING HERE IS A TARGET. No exercise calorie database, and
   exercise calories are never added to the target: `sooner()`
   answers what a change in activity does to the FORECAST, which
   is a different question from what somebody may eat.

   A HABIT WITH NO DATA IS NOT A FAILED HABIT. Every reading below
   has THREE answers, and `null` is the column being empty rather
   than a fortnight of noughts.

   `scripts/activity.test.ts` is the guard.
   ============================================================ */

import {
  KCAL_PER_KG, proteinFloor, projection, slopePerWeek, streak, trend,
  type Day, type Point, type Range, type Streak,
} from "./diet.ts";

/* ---------------------------------------------------------- */
/* two small things, said once                                */
/* ---------------------------------------------------------- */

/** Low to high, whichever way round they arrived. Half the
    functions here can produce a band backwards: a FALL in steps
    is a negative number of calories, so the top of the band
    becomes the bottom. */
const ordered = (a: number, b: number, mid: number): Range =>
  ({ low: Math.min(a, b), mid, high: Math.max(a, b) });

/** The MEDIAN, which is the right average for a step count: one
    25,000 step day in a month of 4,000s moves a mean by a fifth
    and moves this by nothing. */
export const median = (values: number[]): number | null => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
};

/** An ISO date, `by` days from another. UTC, which is arithmetic
    rather than a timezone decision: a date is a day and not an
    instant, and stepping it in local time is wrong by an hour
    twice a year. `shiftDate` in `next/lib/diet-api.ts` is a
    second copy and should become an import of this. */
export const shiftIso = (iso: string, by: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + by)).toISOString().slice(0, 10);
};

/* ---------------------------------------------------------- */
/* what a step is worth                                       */
/* ---------------------------------------------------------- */

/** The NET cost of walking, per kilogram carried per kilometre:
    0.40 to 0.50 kcal per kg per km for an adult at an ordinary
    pace.

    NET RATHER THAN GROSS, and the distinction is load bearing:
    resting burn is already inside the learned maintenance, so
    adding the gross cost of an hour's walking counts that hour's
    resting burn twice. Gross is roughly double. */
export const KCAL_PER_KG_KM: Range = { low: 0.40, mid: 0.45, high: 0.50 };

/** How many steps make a kilometre. A stride is personal and this
    range is most of the width of every figure below: 1,300 in the
    middle, 1,200 for a long stride and 1,450 for a short one. A
    phone's own counting error rides on top. */
export const STEPS_PER_KM: Range = { low: 1200, mid: 1300, high: 1450 };

/** What a change of `steps` a day is worth in calories, for a
    body of this weight. THE TWO RANGES MULTIPLY AT THEIR ENDS:
    the mid of each multiplied together is a point estimate
    wearing a band. */
export function stepsKcal(steps: number, weightKg: number): Range {
  const at = (perKgKm: number, perKm: number): number =>
    perKgKm * weightKg * (steps / perKm);
  return ordered(
    at(KCAL_PER_KG_KM.low, STEPS_PER_KM.high),
    at(KCAL_PER_KG_KM.high, STEPS_PER_KM.low),
    at(KCAL_PER_KG_KM.mid, STEPS_PER_KM.mid),
  );
}

/** The same change said as weight, per week, at `KCAL_PER_KG`:
    the standard approximation, used here for a difference between
    two forecasts rather than a reading off a scale. */
export function stepsKgPerWeek(steps: number, weightKg: number): Range {
  const kcal = stepsKcal(steps, weightKg);
  const per = (k: number): number => (k * 7) / KCAL_PER_KG;
  return { low: per(kcal.low), mid: per(kcal.mid), high: per(kcal.high) };
}

/* ---------------------------------------------------------- */
/* where the last fortnight points                            */
/* ---------------------------------------------------------- */

export interface Outlook {
  weeks: number;
  /** Where the trend is today. The trend and never a reading:
      one scale figure is a real weight plus a kilo or two of
      water, gut contents and salt. */
  fromKg: number;
  /** Where it lands, as a band that widens with distance. */
  kg: Range;
  /** The rate it was built from, with its own error bar. */
  weekly: Range;
  /** How many weighings the rate was fitted to, so the page can
      say what the band is made of rather than only how wide it
      is. */
  readings: number;
}

/** If this carries on, where does it get to. A BAND AND NEVER A
    DATE, widening the further out it is asked.

    Refuses on the same test `projection()` refuses on: a rate of
    "0.3 kg a week either way" carried forward eight weeks is a
    confident sentence out of data that cannot tell loss from
    gain. */
export function outlook(opts: { points: Point[]; weeks: number }): Outlook | null {
  const { points, weeks } = opts;
  const weekly = slopePerWeek(points);
  if (!weekly) return null;
  if (weekly.low <= 0 && weekly.high >= 0) return null;

  const line = trend(points);
  const fromKg = line[line.length - 1].kg;
  return {
    weeks,
    fromKg,
    kg: {
      low: fromKg + weekly.low * weeks,
      mid: fromKg + weekly.mid * weeks,
      high: fromKg + weekly.high * weeks,
    },
    weekly,
    readings: points.length,
  };
}

/* ---------------------------------------------------------- */
/* and what a change in activity would do to it               */
/* ---------------------------------------------------------- */

/** More movement always SUBTRACTS from the weekly change: a loss
    faster and a gain slower. Interval arithmetic, so THE ENDS
    CROSS, `[a,b] - [c,d]` is `[a-d, b-c]`; `low - low` looks
    right and narrows the band every time. */
const slower = (weekly: Range, extra: Range): Range => ({
  low: weekly.low - extra.high,
  mid: weekly.mid - extra.mid,
  high: weekly.high - extra.low,
});

export interface Sooner {
  /** Weeks to the goal at the rate the log already shows. */
  now: Range;
  /** And with the extra movement in it. */
  after: Range;
  /** The difference, in weeks. */
  saved: Range;
  /** What the extra steps are worth a day, and as weight a week.
      Both, because the sentence needs all three and computing one
      twice is how two disagree by a rounding. */
  kcal: Range;
  kgPerWeek: Range;
}

/** What `steps` more a day would do to the time to a goal. Null
    when either projection refuses: a rate whose band spans zero,
    or a change so large it takes a gain plan through zero.

    `saved` is subtracted at MATCHED ENDS rather than crossed,
    which is the one place here deliberately not interval
    arithmetic: the two projections are built from the same
    weighings, so crossing them compares two different readers. */
export function sooner(opts: {
  currentKg: number;
  goalKg: number;
  weekly: Range;
  steps: number;
  weightKg: number;
}): Sooner | null {
  const { currentKg, goalKg, weekly, steps, weightKg } = opts;
  const extra = stepsKgPerWeek(steps, weightKg);
  const now = projection({ currentKg, goalKg, weekly });
  const after = projection({ currentKg, goalKg, weekly: slower(weekly, extra) });
  if (!now || !after) return null;
  return {
    now,
    after,
    saved: ordered(now.low - after.low, now.high - after.high, now.mid - after.mid),
    kcal: stepsKcal(steps, weightKg),
    kgPerWeek: extra,
  };
}

/* ---------------------------------------------------------- */
/* the reader's own step count, and the stall that is not one */
/* ---------------------------------------------------------- */

/** Eight weeks, which is long enough that a fortnight of walking
    less shows up against it rather than moving it. */
export const STEP_BASE_DAYS = 56;

/** And the fewest days it may be read from. Under this the mark
    is `null` and the panel says what it is waiting for. */
export const STEP_BASE_LEAST = 7;

export interface StepBase {
  /** The reader's own middle day, in steps. NOT a borrowed ten
      thousand, which is a number from a 1960s pedometer
      advertisement and has never been a clinical target. */
  median: number;
  days: number;
  from: string;
}

export function stepBase(
  days: Day[], todayISO: string,
  back = STEP_BASE_DAYS, least = STEP_BASE_LEAST,
): StepBase | null {
  const from = shiftIso(todayISO, -(back - 1));
  const counts = days
    .filter((d) => d.date >= from && d.date <= todayISO && d.steps != null)
    .map((d) => d.steps as number);
  if (counts.length < least) return null;
  const mid = median(counts);
  return mid == null ? null : { median: mid, days: counts.length, from };
}

export interface StepShift {
  /** The middle day of the last window, and of the one before it.
      Null where that window carries no step count at all, which
      is silence rather than zero. */
  now: number | null;
  before: number | null;
  of: number;
  nowDays: number;
  beforeDays: number;
}

/** Steps over one window against the window before it. Two
    numbers and no verdict, and BOTH HALVES ARE THE SAME LENGTH,
    so a quiet fortnight makes a smaller number rather than a
    broken chain. */
export function stepShift(days: Day[], todayISO: string, window = 14): StepShift {
  const between = (from: string, to: string): number[] => days
    .filter((d) => d.date >= from && d.date <= to && d.steps != null)
    .map((d) => d.steps as number);

  const recent = between(shiftIso(todayISO, -(window - 1)), todayISO);
  const older = between(shiftIso(todayISO, -(window * 2 - 1)), shiftIso(todayISO, -window));
  return {
    now: median(recent),
    before: median(older),
    of: window,
    nowDays: recent.length,
    beforeDays: older.length,
  };
}

/* ---------------------------------------------------------- */
/* the habits, which are all read off columns already logged  */
/* ---------------------------------------------------------- */

/** Seven daily things, and every one is a column of `diet_days`
    something already writes. THAT IS THE TEST: if the site cannot
    measure a thing out of what it already holds, the bar is a
    decoration. An eighth habit names its column first. */
export type HabitId =
  | "weighed" | "logged" | "protein" | "fibre" | "water" | "steps" | "sleep";

/** Why a habit has no mark, when it has none. `lean` wants the
    tape or a body fat estimate; `history` wants more days with a
    step count. Both are things a reader can act on. */
export type HabitNeeds = null | "lean" | "history";

/** What one day says about one habit. THREE ANSWERS RATHER THAN
    TWO: `null` is the column carrying nothing and must not become
    `false`, or a field nothing writes yet draws as a fortnight of
    missed nights. */
type Reading = (d: Day) => boolean | null;

export interface Habit {
  id: HabitId;
  /** The number a day had to reach, in the column's own unit.
      Null for the two that are only showing up, and null with
      `needs` set where it cannot be worked out yet. */
  mark: number | null;
  needs: HabitNeeds;
  /** Over the WHOLE history: the current run, the best there has
      ever been, and the total. Never a percentage of a target,
      and `best` because a number that can only fall is one people
      stop looking at. */
  run: Streak;
  /** In the last `of` days: how many held, and how many carry the
      reading at all. `read` of zero is nothing to read, not a
      habit nobody kept. */
  held: number;
  read: number;
  of: number;
}

/** A glass, as the log form counts them: it adds and removes 250
    ml a tap, so a habit counting anything else would be counting
    a different thing from the button. */
export const GLASS_ML = 250;

/** Eight, and a CONVENTION rather than a requirement: water is
    logged, not calculated, so this is an argument to be changed
    and the page says whose number it is. */
export const GLASSES = 8;

/** The low end of the fibre reference, 25 to 30 g a day.
    `WATCHED` in `next/components/diet/nutrition-panel.tsx` states
    the same pair and should read this constant. */
export const FIBRE_FLOOR_G = 25;

/** Seven hours: a line a night is either above or not. Nothing
    here ranks a night or scores a week. */
export const SLEEP_HOURS = 7;

/** A fortnight, which is the window everything else in this tool
    reads over. */
export const HABIT_WINDOW = 14;

export function habits(opts: {
  days: Day[];
  todayISO: string;
  window?: number;
  /** For the protein floor, out of `fatEstimate()`. Absent and
      the protein habit says what it is waiting for rather than
      guessing at a floor. */
  leanKg?: number;
  ratePct?: number;
  fibreG?: number;
  glasses?: number;
  sleepHours?: number;
}): Habit[] {
  const {
    days, todayISO, window = HABIT_WINDOW,
    leanKg, ratePct = 0.5,
    fibreG = FIBRE_FLOOR_G, glasses = GLASSES, sleepHours = SLEEP_HOURS,
  } = opts;

  const base = stepBase(days, todayISO);
  /* The FLOOR rather than the middle of the band: a habit is a
     line to be over rather than a range to sit in. */
  const protein = leanKg != null && leanKg > 0
    ? proteinFloor(leanKg, ratePct).low : null;
  const water = glasses * GLASS_ML;

  const kinds: Array<{
    id: HabitId; mark: number | null; needs: HabitNeeds; read: Reading;
  }> = [
    { id: "weighed", mark: null, needs: null, read: (d) => d.weightKg != null },
    { id: "logged", mark: null, needs: null, read: (d) => (d.kcal ?? 0) > 0 },
    {
      id: "protein", mark: protein, needs: protein == null ? "lean" : null,
      read: (d) => (protein == null || d.proteinG == null
        ? null : d.proteinG >= protein),
    },
    {
      id: "fibre", mark: fibreG, needs: null,
      read: (d) => (d.fibreG == null ? null : d.fibreG >= fibreG),
    },
    {
      id: "water", mark: water, needs: null,
      read: (d) => (d.waterMl == null ? null : d.waterMl >= water),
    },
    {
      id: "steps", mark: base?.median ?? null,
      needs: base ? null : "history",
      read: (d) => (base == null || d.steps == null ? null : d.steps >= base.median),
    },
    {
      id: "sleep", mark: sleepHours, needs: null,
      read: (d) => (d.sleepHours == null ? null : d.sleepHours >= sleepHours),
    },
  ];

  /* THE WINDOW IS WALKED BY DATE AND THE RUN BY ROW, which are
     different sets: a date with no row is a day nobody weighed
     and nobody logged. Counting the window over the rows reports
     "5 of the last 14" as "5 of 5". */
  const at = new Map(days.map((d) => [d.date, d]));
  const span: Day[] = [];
  for (let i = 0; i < window; i += 1) {
    const date = shiftIso(todayISO, -i);
    span.push(at.get(date) ?? { date });
  }

  return kinds.map(({ id, mark, needs, read }) => {
    const answers = span.map(read);
    /* `streak()` decides a day is in the run when SOMETHING is on
       it, so a held day is handed over as a day with a note: the
       field is this file saying "this day counts" in that
       function's own vocabulary. */
    const held = days.filter((d) => read(d) === true)
      .map((d) => ({ date: d.date, note: "." }));
    return {
      id,
      mark,
      needs,
      run: streak(held, todayISO),
      held: answers.filter((a) => a === true).length,
      read: answers.filter((a) => a !== null).length,
      of: window,
    };
  });
}
