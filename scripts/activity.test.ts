/* ============================================================
   activity.test.ts: the movement arithmetic, as assertions.

       node scripts/activity.test.ts

   `shared/activity.ts` is the half of this tool that reads what
   somebody actually DID: their steps, their log, their run of
   days. `scripts/diet.test.ts` covers the body and the goal
   engine and this covers the rest, in the same style and for the
   same reason: every number here is a claim about somebody's
   week, and the ones that matter are the ones that are wrong in
   a flattering direction, because nothing on the page looks
   different when they are.

   No browser and no database. Arithmetic and a grep, so it runs
   everywhere and in CI, which is the only way a rule survives.

   ---- what this covers that reading the file would not ----

   THE TWO ERROR BARS. A step is worth a calorie figure with a
   stride length inside it, and taking the middle of each and
   multiplying is a point estimate wearing a band. Both ends are
   asserted against hand arithmetic.

   THE SIGN OF A CHANGE IN ACTIVITY. More movement subtracts from
   the weekly change, which makes a loss faster AND a gain slower.
   Written as an addition it reads correctly for one of those and
   is inverted for the other, which is a test rather than a
   comment.

   THE THIRD ANSWER. Every habit reading has `null` as well as
   true and false, and the day it loses that is the day a column
   nothing writes draws a fortnight of missed days.

   THE RUN OVER A GAP. `best` has to survive a quiet fortnight,
   because a number that can only fall is a number people stop
   looking at.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
/* By relative path rather than through `@reiad/shared`, the same
   way every other node-side test here reads these: node cannot
   strip types from a file under `node_modules`. */
import {
  FIBRE_FLOOR_G, GLASSES, GLASS_ML, HABIT_WINDOW, KCAL_PER_KG_KM,
  SLEEP_HOURS, STEPS_PER_KM, STEP_BASE_LEAST,
  habits, median, outlook, shiftIso, sooner, stepBase, stepShift,
  stepsKcal, stepsKgPerWeek,
} from "../shared/activity.ts";
import { KCAL_PER_KG, proteinFloor, slopePerWeek, type Day, type Point }
  from "../shared/diet.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const near = (what: string, got: number, want: number, tol: number): void =>
  ok(what, Math.abs(got - want) <= tol, `got ${got}, wanted ${want} +/- ${tol}`);

/* ---- 1. what a step is worth, by hand ----

   Eighty kilograms and two thousand steps, which is the worked
   example in the file's own report:

     the middle   0.45 * 80 * (2000 / 1300) = 55.4 kcal
     the low end  0.40 * 80 * (2000 / 1450) = 44.1 kcal
     the high end 0.50 * 80 * (2000 / 1200) = 66.7 kcal            */

const two = stepsKcal(2000, 80);
near("2,000 steps at 80 kg: the middle", two.mid, 55.38, 0.05);
near("2,000 steps at 80 kg: the low end", two.low, 44.14, 0.05);
near("2,000 steps at 80 kg: the high end", two.high, 66.67, 0.05);

/* THE BAND IS BUILT AT THE ENDS. Taking the mid of each range and
   calling the product the answer would put the low end at
   0.40 * 80 * (2000/1300) = 49.2 and the high at 61.5, which is a
   band a third too narrow and confident about a stride nobody
   measured. */
ok("the two ranges multiply at their ends rather than round a middle",
  two.low < 0.40 * 80 * (2000 / STEPS_PER_KM.mid)
  && two.high > 0.50 * 80 * (2000 / STEPS_PER_KM.mid),
  `got ${two.low.toFixed(1)} to ${two.high.toFixed(1)}`);

near("twice the body is twice the cost", stepsKcal(2000, 160).mid, two.mid * 2, 0.01);
near("no change in steps is no change in calories", stepsKcal(0, 80).mid, 0, 1e-9);

/* A FALL IN STEPS IS A NEGATIVE NUMBER AND THE BAND STILL RUNS
   LOW TO HIGH. The ends swap under a negative, so a range built
   without ordering comes back with its low above its high and
   every sentence drawn from it reads backwards. */
const fell = stepsKcal(-2000, 80);
ok("a fall in steps keeps low below high", fell.low <= fell.mid && fell.mid <= fell.high,
  `got ${fell.low.toFixed(1)}, ${fell.mid.toFixed(1)}, ${fell.high.toFixed(1)}`);
ok("a fall in steps is negative all the way across", fell.high < 0);
near("and it is the same size the other way", fell.mid, -two.mid, 1e-9);

/* ---- 2. the same thing as weight ---- */

const week = stepsKgPerWeek(2000, 80);
near("2,000 steps a day is about 0.05 kg a week", week.mid, 0.0503, 0.001);
near("its low end", week.low, 0.0401, 0.001);
near("its high end", week.high, 0.0606, 0.001);
near("and it is the calorie figure at 7,700 to the kilogram",
  week.mid, (two.mid * 7) / KCAL_PER_KG, 1e-12);

ok("the cost of a kilometre is the net figure, not the gross one",
  KCAL_PER_KG_KM.low === 0.40 && KCAL_PER_KG_KM.high === 0.50,
  "Gross is roughly double net, and resting burn is already inside"
  + " maintenance: adding the gross cost counts that hour twice.");

/* ---- 3. the outlook, which is a band and never a date ---- */

/** A steady loss with a little noise on it: 90 kg falling half a
    kilo a week, weighed daily for a fortnight. */
const falling: Point[] = Array.from({ length: 14 }, (_, i) => ({
  day: i,
  kg: 90 - (i * 0.5) / 7 + (i % 3 === 0 ? 0.15 : -0.1),
}));

const eight = outlook({ points: falling, weeks: 8 });
ok("a fortnight of weighings gives an outlook", !!eight);
if (eight) {
  ok("it points down", eight.kg.mid < eight.fromKg);
  ok("the band runs low to high", eight.kg.low < eight.kg.mid && eight.kg.mid < eight.kg.high);
  near("it starts from the trend, which is where the reader is",
    eight.fromKg, 89.4, 0.6);

  const four = outlook({ points: falling, weeks: 4 });
  ok("and the band widens with distance", !!four
    && (eight.kg.high - eight.kg.low) > (four.kg.high - four.kg.low) * 1.9,
    "Half the distance has to be about half the band, or the band is"
    + " not made of the rate's own error.");
}

/* THE ONE INPUT THAT MAKES THIS LIE. Four readings that wander:
   the fitted rate's error bar spans zero, so no number of weeks
   out of it means anything. */
const wandering: Point[] = [
  { day: 0, kg: 80.0 }, { day: 3, kg: 80.6 },
  { day: 7, kg: 79.6 }, { day: 11, kg: 80.4 },
];
const spans = slopePerWeek(wandering);
ok("the fixture really does span zero", !!spans && spans.low < 0 && spans.high > 0);
ok("an outlook refuses a rate that cannot tell loss from gain",
  outlook({ points: wandering, weeks: 8 }) === null);

ok("and it refuses two readings, which have no residual to measure",
  outlook({ points: [{ day: 0, kg: 80 }, { day: 7, kg: 79 }], weeks: 8 }) === null);

/* ---- 4. what a change in activity would do ---- */

const rate = slopePerWeek(falling);
ok("the fixture has a readable rate", !!rate);

if (rate) {
  const more = sooner({
    currentKg: 89.4, goalKg: 84, weekly: rate, steps: 2000, weightKg: 89.4,
  });
  ok("2,000 more steps a day answers", !!more);
  if (more) {
    ok("it takes weeks off rather than adding them", more.saved.mid > 0,
      `got ${more.saved.mid.toFixed(2)} weeks`);
    ok("the saving has a band, low to high",
      more.saved.low <= more.saved.mid && more.saved.mid <= more.saved.high);
    ok("the goal arrives sooner with the steps than without",
      more.after.mid < more.now.mid);

    const lots = sooner({
      currentKg: 89.4, goalKg: 84, weekly: rate, steps: 4000, weightKg: 89.4,
    });
    ok("twice the steps takes more weeks off", !!lots && lots.saved.mid > more.saved.mid);

    /* THE INTERVAL ARITHMETIC CROSSES. Subtracting the extra rate
       end for end would narrow the rate's own band on every call,
       which is the flattering direction and invisible: the page
       would simply look more certain than the weighings are. */
    ok("the extra movement does not narrow the rate's own band",
      (more.after.high - more.after.low) >= (more.now.high - more.now.low) * 0.5,
      "A band that collapses when steps are added is `slower()` written"
      + " end to end rather than crossed.");
  }

  /* THE SIGN, FROM THE OTHER SIDE. Somebody gaining is slowed by
     the same steps, so the goal moves further away and `saved`
     goes negative. Written as an addition it would read correctly
     for a loss and be inverted here. */
  const gaining: Point[] = Array.from({ length: 14 }, (_, i) => ({
    day: i, kg: 70 + (i * 0.25) / 7 + (i % 2 ? 0.05 : -0.05),
  }));
  const up = slopePerWeek(gaining);
  ok("the gaining fixture has a readable rate", !!up && up.low > 0);
  if (up) {
    const cost = sooner({
      currentKg: 70.2, goalKg: 74, weekly: up, steps: 2000, weightKg: 70.2,
    });
    ok("a gain is slowed by the same steps", !!cost && cost.saved.mid < 0,
      cost ? `got ${cost.saved.mid.toFixed(2)} weeks` : "it refused");
  }

  ok("and it refuses a rate that spans zero, exactly as the projection does",
    spans !== null && sooner({
      currentKg: 80, goalKg: 76, weekly: spans, steps: 2000, weightKg: 80,
    }) === null);
}

/* ---- 5. the middle of a list, and the date arithmetic ---- */

ok("median: an odd list is its middle", median([1, 9, 3]) === 3);
ok("median: an even list is the mean of the two middles", median([1, 3, 5, 9]) === 4);
ok("median: nothing at all is null rather than zero", median([]) === null);
ok("median: one enormous day does not move it",
  median([4000, 4200, 3900, 4100, 25000]) === 4100);

ok("shiftIso: back over a month boundary", shiftIso("2026-03-01", -1) === "2026-02-28");
ok("shiftIso: forward over a year boundary", shiftIso("2026-12-31", 1) === "2027-01-01");
ok("shiftIso: a leap day is a day", shiftIso("2028-02-28", 1) === "2028-02-29");

/* ---- 6. the reader's own step count ---- */

const day = (i: number): string => shiftIso("2026-08-22", -i);

/** Fourteen days at about eight thousand, then a fortnight at
    about four and a half: section 19's stall, as data. */
const walked: Day[] = [
  ...Array.from({ length: 14 }, (_, i) => ({
    date: day(i + 14), steps: 8000 + (i % 3) * 200,
  })),
  ...Array.from({ length: 14 }, (_, i) => ({
    date: day(i), steps: 4500 + (i % 3) * 150,
  })),
];

const base = stepBase(walked, "2026-08-22");
ok("a step base needs days and these have them", !!base);
ok("the base is the reader's own middle rather than a borrowed ten thousand",
  !!base && base.median > 4000 && base.median < 9000 && base.median !== 10000,
  base ? `got ${base.median}` : "");

ok("under seven days there is no base to read",
  stepBase(walked.slice(-3), "2026-08-22") === null);
ok("and the fewest is written down rather than typed into the function",
  STEP_BASE_LEAST === 7);

const shift = stepShift(walked, "2026-08-22");
near("steps now", shift.now ?? 0, 4650, 200);
near("steps in the fortnight before", shift.before ?? 0, 8200, 300);
ok("both halves are the same length, so a quiet fortnight is a smaller"
  + " number rather than a broken chain", shift.of === 14);

const nothingWalked = stepShift([{ date: "2026-08-22", weightKg: 80 }], "2026-08-22");
ok("no step count at all is null rather than zero",
  nothingWalked.now === null && nothingWalked.before === null);

/* ---- 7. the habits ---- */

const LEAN = 60;
const floor = proteinFloor(LEAN, 0.5).low;

/** A fortnight: weighed on twelve of them, food logged on nine,
    protein over the floor on six, no sleep and no water anywhere,
    because those are the columns nothing writes yet. */
const fortnight: Day[] = Array.from({ length: 14 }, (_, i) => ({
  date: day(i),
  weightKg: i % 5 === 4 ? undefined : 80 - i * 0.05,
  kcal: i < 9 ? 1900 : undefined,
  proteinG: i < 9 ? (i < 6 ? floor + 10 : floor - 20) : undefined,
  steps: 5000 + (i % 4) * 400,
}));

const read = habits({ days: fortnight, todayISO: "2026-08-22", leanKg: LEAN });
const of = (id: string) => read.find((h) => h.id === id);

ok("seven habits and no eighth", read.length === 7);
ok("the window is a fortnight", read.every((h) => h.of === HABIT_WINDOW));

const weighed = of("weighed");
ok("weighed: twelve of the last fourteen", weighed?.held === 12,
  `got ${weighed?.held}`);
ok("weighed: every day of the window is readable, because a day with no"
  + " row at all is a day nobody weighed", weighed?.read === 14);

const logged = of("logged");
ok("logged: nine of the last fourteen", logged?.held === 9, `got ${logged?.held}`);

const protein = of("protein");
ok("protein: the mark is the floor out of proteinFloor()",
  protein?.mark === floor, `got ${protein?.mark}, wanted ${floor}`);
ok("protein: six days over it", protein?.held === 6, `got ${protein?.held}`);
ok("protein: only the nine days with a figure are read at all",
  protein?.read === 9, `got ${protein?.read}`);

/* THE THIRD ANSWER, AND THE WHOLE REASON IT EXISTS. `sleep_hours`
   is a column nothing writes, so it must come back as silence.
   A two-valued reading draws fourteen missed nights for a field
   that has never been offered to anybody. */
const sleep = of("sleep");
ok("sleep: nothing to read rather than a fortnight of missed nights",
  sleep?.read === 0 && sleep?.held === 0);
ok("sleep: and it still knows what it would be looking for",
  sleep?.mark === SLEEP_HOURS && sleep?.needs === null);

const water = of("water");
ok("water: nothing logged is nothing read", water?.read === 0);
ok("water: the mark is the glasses the log form counts in",
  water?.mark === GLASSES * GLASS_ML);

const fibre = of("fibre");
ok("fibre: the mark is section 15's reference floor", fibre?.mark === FIBRE_FLOOR_G);

/* WITHOUT LEAN MASS THERE IS NO FLOOR, and the habit says what it
   is waiting for rather than inventing one out of bodyweight. */
const noBody = habits({ days: fortnight, todayISO: "2026-08-22" });
const noFloor = noBody.find((h) => h.id === "protein");
ok("protein: no lean mass, no mark", noFloor?.mark === null && noFloor?.needs === "lean");
ok("protein: and nothing is read, rather than everything failing",
  noFloor?.read === 0 && noFloor?.held === 0);

/* AND WITHOUT ENOUGH STEP DAYS THERE IS NO MEDIAN. Three days is
   a number about three days. */
const thin = habits({
  days: fortnight.slice(0, 3), todayISO: "2026-08-22", leanKg: LEAN,
});
const thinSteps = thin.find((h) => h.id === "steps");
ok("steps: too little history, so no mark and a reason",
  thinSteps?.mark === null && thinSteps?.needs === "history");

const steps = of("steps");
ok("steps: with history the mark is the reader's own median",
  steps?.mark === stepBase(fortnight, "2026-08-22")?.median);

/* ---- 8. the run, which counts showing up ---- */

/** Weighed for five days in July, nothing for a fortnight, then
    two days now. The current run is two and the best is five, and
    the best is what must not fall. */
const gapped: Day[] = [
  ...Array.from({ length: 5 }, (_, i) => ({ date: day(30 + i), weightKg: 80 })),
  { date: day(1), weightKg: 79 },
  { date: day(0), weightKg: 79 },
];
const overGap = habits({ days: gapped, todayISO: "2026-08-22" });
const runs = overGap.find((h) => h.id === "weighed");
ok("the run: today and yesterday are the current two", runs?.run.current === 2,
  `got ${runs?.run.current}`);
ok("the run: a quiet fortnight does not take the best away",
  runs?.run.best === 5, `got ${runs?.run.best}`);
ok("the run: the total counts every day there has ever been",
  runs?.run.total === 7, `got ${runs?.run.total}`);
ok("the run: and the window count is only the last fourteen",
  runs?.held === 2, `got ${runs?.held}`);

/* NOTHING AT ALL IS NOT A FAILED HABIT. Every count is zero and
   nothing about that shape says a target was missed. */
const empty = habits({ days: [], todayISO: "2026-08-22" });
ok("no days at all: every habit is silent rather than failed",
  empty.length === 7
  && empty.every((h) => h.run.current === 0 && h.run.best === 0 && h.held === 0));
ok("no days at all: the two that are only showing up still read the window,"
  + " because a day with no row is a day nobody weighed",
  empty.filter((h) => h.read === 14).length === 2);

/* ---- 9. and the rule the file is written under ---- */

const source = readFileSync(join(ROOT, "shared", "activity.ts"), "utf8");
ok("nothing here calls target(): exercise calories are never added to one",
  !/\btarget\s*\(/.test(source.replace(/\/\*[\s\S]*?\*\//g, " ")),
  "DIET.md section 19 is firm about this, and the way it gets broken is"
  + " somebody adding a burn to a day's allowance rather than to a forecast.");

/* Whitespace flattened, because both of these sentences wrap in
   the file and a check that reads prose has to read it the way it
   is written rather than the way it would fit on one line. */
const plan = readFileSync(join(ROOT, "DIET.md"), "utf8").replace(/\s+/g, " ");
ok("DIET.md section 19 still says exercise calories are never added",
  plan.includes("exercise calories are never added to the target"),
  "The rule and the code are attached by this assertion. If the sentence"
  + " moved, move this with it rather than deleting it.");
ok("DIET.md section 19 still has the step count as an input",
  /a \*\*step count is an input\*\*/.test(plan));

/* ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\nactivity: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`activity: ${passed} checks passed`);
