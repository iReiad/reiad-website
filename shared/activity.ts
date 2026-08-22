/* ============================================================
   activity.ts: what the reader's own movement is worth, and
   where their own log points.

   `DIET.md` sections 19 and 11. `shared/diet.ts` is the body, the
   trend and the goal engine; this is the half that reads
   MOVEMENT, and it is a second file rather than more of the first
   for one reason. Everything in `diet.ts` that looks forward runs
   off a maintenance figure which assumes an activity factor
   holds, and section 19 says plainly that it does not: steps are
   the largest variable in what somebody burns and the one that
   quietly falls during a deficit.

   ---- the rules it inherits, and one it adds ----

   NO FUNCTION HERE RETURNS A NUMBER IT CANNOT KNOW. Every figure
   comes back as a `Range`, the same shape `diet.ts` returns, and
   the two error bars are kept apart until the last
   multiplication: what a kilometre of walking costs per kilogram,
   and how many steps a kilometre is. The second is where "a step
   count from a phone is itself an estimate" is written down, and
   it is most of the width of everything below.

   NOTHING HERE IS A TARGET, and that is the rule this file adds.
   Section 19: "No exercise calorie database, and exercise
   calories are never added to the target." What `sooner()`
   answers is what a change in activity would do to the FORECAST,
   which is a different question from what somebody may eat, and
   the page drawing it has to say so in those words.

   IT COUNTS SHOWING UP. `habits()` hands its run of days to
   `streak()` rather than counting one of its own, because that
   function already carries the argument for why a run counts days
   rather than targets met, and why `best` has to sit beside
   `current`.

   AND A HABIT WITH NO DATA IS NOT A FAILED HABIT. Every reading
   below has three answers rather than two, and the third one is
   the point: `null` is the column being empty, which is a
   sentence saying there is nothing to read yet, never a fortnight
   of noughts.

   `scripts/activity.test.ts` is the guard.
   ============================================================ */

import {
  KCAL_PER_KG, proteinFloor, projection, slopePerWeek, streak, trend,
  type Day, type Point, type Range, type Streak,
} from "./diet.ts";

/* ---------------------------------------------------------- */
/* two small things, said once                                */
/* ---------------------------------------------------------- */

/** Low to high, whichever way round they arrived.

    A `Range` whose `low` sits above its `high` is a band drawn
    backwards, and half the functions here can produce one: a FALL
    in steps is a negative number of calories, so the end that was
    the top of the band becomes the bottom of it. */
const ordered = (a: number, b: number, mid: number): Range =>
  ({ low: Math.min(a, b), mid, high: Math.max(a, b) });

/** The middle of a list, which is the right average for a step
    count. One twenty-five thousand step day in a month of four
    thousands moves a mean by a fifth and moves this by nothing,
    and that day is a wedding rather than a change of habit. */
export const median = (values: number[]): number | null => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const half = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[half] : (sorted[half - 1] + sorted[half]) / 2;
};

/** An ISO date, `by` days from another.

    UTC, which is arithmetic rather than a timezone decision:
    `2026-08-22` is a day and not an instant, and stepping it in
    local time is wrong by an hour twice a year. `shiftDate` in
    `next/lib/diet-api.ts` is the same three lines and should
    become an import of this one the next time that file is
    opened, for the reason the top of CLAUDE.md gives about a
    second copy. */
export const shiftIso = (iso: string, by: number): string => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + by)).toISOString().slice(0, 10);
};

/* ---------------------------------------------------------- */
/* what a step is worth                                       */
/* ---------------------------------------------------------- */

/** The net cost of walking, per kilogram carried per kilometre.

    0.40 to 0.50 kcal per kg per km is where the measured cost of
    walking sits for an adult at an ordinary pace, and it is the
    same figure said the other common way round, 0.04 to 0.05 kcal
    per kg per hundred metres.

    NET RATHER THAN GROSS, and the distinction is load bearing.
    Resting burn is already in `restingBurn()` and already inside
    the learned maintenance, so adding the gross cost of an hour's
    walking on top of a whole day's maintenance counts that hour's
    resting burn twice. Gross is roughly double this, which is
    exactly the size of error section 19 warns about in published
    exercise figures. */
export const KCAL_PER_KG_KM: Range = { low: 0.40, mid: 0.45, high: 0.50 };

/** How many steps make a kilometre.

    A stride is personal, and this range is most of the width of
    every figure below: 1,300 is the middle for an adult walking,
    a long stride is nearer 1,200 and a short one nearer 1,450. A
    phone's own counting error rides on top of it, which is why
    the page says out loud that a step count is an estimate rather
    than a measurement. */
export const STEPS_PER_KM: Range = { low: 1200, mid: 1300, high: 1450 };

/** What a change of `steps` a day is worth in calories, for a
    body of this weight.

    THE TWO RANGES MULTIPLY AT THEIR ENDS. The cheapest kilometre
    and the shortest stride together are the low end, and taking
    the mid of each and calling the product the answer would be a
    point estimate wearing a band. */
export function stepsKcal(steps: number, weightKg: number): Range {
  const at = (perKgKm: number, perKm: number): number =>
    perKgKm * weightKg * (steps / perKm);
  return ordered(
    at(KCAL_PER_KG_KM.low, STEPS_PER_KM.high),
    at(KCAL_PER_KG_KM.high, STEPS_PER_KM.low),
    at(KCAL_PER_KG_KM.mid, STEPS_PER_KM.mid),
  );
}

/** The same change said as weight, per week, at `KCAL_PER_KG`.

    Which is the standard approximation and is right for fat and
    wrong for water, exactly as it is everywhere else in this
    tool. It is used here for a difference between two forecasts
    rather than for a reading off a scale, which is the use it
    survives. */
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

/** If this carries on, where does it get to.

    A BAND AND NEVER A DATE. The band is the rate's own error bar
    multiplied by the distance, so it widens the further out it is
    asked, which is the honest shape: the arithmetic cannot get
    more certain about April than about next week.

    It refuses on the same test `projection()` refuses on, and for
    the same reason: a rate of "0.3 kg a week either way" is a
    rate that has not been measured, and carrying it forward eight
    weeks produces a confident sentence out of data that cannot
    tell loss from gain. `slopePerWeek()` returns null under three
    readings, which is the other refusal and needs no code here. */
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

/** More movement always SUBTRACTS from the weekly change, and the
    direction is the same whichever way the reader is going: it
    makes a loss faster and a gain slower.

    Interval arithmetic, so the ends cross: `[a,b] - [c,d]` is
    `[a-d, b-c]`. Writing it as `low - low` looks right and
    narrows the band every time, which is the flattering
    direction. */
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
      Both are here because the sentence needs all three numbers
      and computing one of them twice is how two of them disagree
      by a rounding. */
  kcal: Range;
  kgPerWeek: Range;
}

/** What `steps` more a day would do to the time to a goal.

    Null when either projection refuses, which covers the two
    cases worth refusing: a rate whose band spans zero, and a
    change so large it takes a gain plan through zero and out the
    other side. Both are the arithmetic saying it cannot answer,
    and a page that filled either in with a number would be making
    one up.

    `saved` is subtracted at MATCHED ENDS rather than crossed,
    which is the one place here that is deliberately not interval
    arithmetic: the two projections are built from the same
    weighings, so the honest reading is "at the optimistic end of
    your own rate it is this many weeks, and at the pessimistic
    end this many". Crossing them would report the optimistic end
    of one against the pessimistic end of the other, which is a
    comparison of two different readers. */
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

/** And the fewest days it may be read from. Under this the
    habit's mark is `null` and the panel says what it is waiting
    for: a middle drawn from three days is a number about three
    days. */
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

/** Steps over one window against the window before it.

    This is the whole of section 19's stall: "Your trend is flat
    and your log has not changed. Your steps have fallen from
    about 8,000 a day to about 4,500 over the same three weeks."
    Two numbers and no verdict, the shape `changed()` in
    `shared/routine.ts` already uses, and for the same reason:
    both halves are the same length, so a quiet fortnight makes a
    smaller number rather than a broken chain. */
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

/** Seven daily things, and every one of them is a column of
    `diet_days` that something already writes.

    THAT IS THE TEST AND IT IS NOT NEGOTIABLE. `DIET.md` section
    30 sets it for a target and it holds here: if the site cannot
    measure a thing out of something it already holds, the bar
    would be a decoration. So there is no new form, no checklist
    to tick, and an eighth habit has to name the column it is read
    from before it is an eighth habit. */
export type HabitId =
  | "weighed" | "logged" | "protein" | "fibre" | "water" | "steps" | "sleep";

/** Why a habit has no mark, when it has none. `lean` wants the
    tape or a body fat estimate; `history` wants more days with a
    step count in them. Both are things a reader can do something
    about, which is why they are told apart. */
export type HabitNeeds = null | "lean" | "history";

/** What one day says about one habit.

    THREE ANSWERS RATHER THAN TWO. `null` is the column carrying
    nothing that day, and it must not become `false`: `sleep_hours`
    is a column nothing writes yet, so a two-valued reading would
    draw a fortnight of missed nights for a field that has never
    been offered. */
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
      and `best` is here because a number that can only fall is a
      number people stop looking at. */
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

/** Eight of them, and it is a CONVENTION rather than a
    requirement. Section 15 has water "logged, not calculated",
    which is the tool declining to compute somebody's need, so the
    number here is offered as an argument to be changed and the
    page says whose number it is. */
export const GLASSES = 8;

/** The low end of section 15's fibre reference, 25 to 30 g a day.
    `WATCHED` in `next/components/diet/nutrition-panel.tsx` states
    the same pair, and that table should read this constant the
    next time it is opened. */
export const FIBRE_FLOOR_G = 25;

/** Seven hours. Section 18 has one optional field, hours, and is
    firm that it is "never turned into a sleep score", so this is
    a line a night is either above or not, and nothing here ranks
    a night or scores a week. */
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
  /* The FLOOR rather than the middle of the band: `proteinFloor()`
     returns 1.6 g per kg of lean mass at its low end and up to
     2.2 at its high, and a habit is a line to be over rather than
     a range to sit in. */
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

  /* THE WINDOW IS WALKED BY DATE AND THE RUN BY ROW, and they are
     genuinely different sets. A date with no row at all is a day
     the reader did not weigh and did not log, which is a `false`
     for those two and a `null` for the five that need a column;
     a run, on the other hand, can only ever be made of days that
     exist. Counting the window over the rows instead reported
     "5 of the last 14" as "5 of 5" for anybody with nine days
     missing, which is the flattering direction. */
  const at = new Map(days.map((d) => [d.date, d]));
  const span: Day[] = [];
  for (let i = 0; i < window; i += 1) {
    const date = shiftIso(todayISO, -i);
    span.push(at.get(date) ?? { date });
  }

  return kinds.map(({ id, mark, needs, read }) => {
    const answers = span.map(read);
    /* `streak()` decides a day is in the run when SOMETHING is on
       it, so a held day is handed over as a day with a note. What
       is being counted is the dates; the field is how this file
       says "this day counts" in that function's own vocabulary,
       and reimplementing the run to avoid it would lose the
       argument written above `streak()` about what a run is for. */
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
