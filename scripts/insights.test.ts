/* ============================================================
   insights.test.ts: section 16's readings and section 17's
   money, as assertions.

       node scripts/insights.test.ts

   No browser and no database: this is arithmetic, so it runs
   everywhere and in CI, which is the only way a rule survives.

   ---- what this covers that reading the code would not ----

   THE SENTENCES ARE TEMPLATES WITH NUMBERS IN THEM, and a
   template is right on the day it is written. Every figure a
   sentence on the insights panel prints comes out of one of
   these functions, so this is where "half the rice, at the rate
   you log it, is about 210 kcal a week" is held to being true.

   THE FLOORS. Every reading here can be short of data and every
   one of them has to say so rather than drawing a zero. Each is
   asserted from the wrong side: one day under the floor returns
   null, one day over it returns a figure.

   THE CIRCLE. `calibration()` compares what the EQUATIONS
   predicted against what the trend did. Fed a maintenance figure
   that was itself derived from the trend it would return one,
   every time, for everybody, and the page would print a
   flattering nonsense that nothing about it looks wrong. There
   is a check below that the number moves when the estimate does.

   THE RAW AGAINST COOKED TRAP. The biggest "saving" any swap
   finder will discover in a Bangladeshi log is raw rice against
   cooked rice, which is the cooking water printed as advice.

   AND SECTION 17'S TWO PRICED CLAIMS, against the real price
   table. One of them held and one of them did not, which is the
   argument for asserting a sentence rather than writing it: a
   staple calorie really is about a third of a protein calorie in
   both tables, and "protein costs more per gram of protein" is
   NOT a fact about the protein group, because dal is tagged both
   and rice carries protein. What is true is the spread inside
   the group, and that is what the panel prints.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
/* By relative path rather than through `@reiad/shared`, the same
   way every other node-side test here reads it: node cannot
   strip types from a file under `node_modules`. */
import {
  CALIBRATE_AFTER_DAYS, COVERAGE_FLOOR, HELD_BAND, MEASURES,
  MIN_CALIBRATION_GAP, SHORT_NIGHT_HOURS, SLOTS, STALE_MONTHS, TAPE_SPAN_DAYS,
  adherence, afterShortNights, againstBudget, calibration, costByTag, isStale,
  loggedDays, monthsSince, movement, per100kcal, portionsOf, proteinSplit,
  slotOf, spend, proteinPrice, swaps, tape, weekVsOwn,
  type Item,
} from "../shared/insights.ts";
import {
  KCAL_PER_KG, STALL_DAYS, trend, type Day, type Entry, type Point,
} from "../shared/diet.ts";
import { FOODS, type Portion } from "../shared/foods.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const near = (what: string, got: number, want: number, tol: number): void =>
  ok(what, Math.abs(got - want) <= tol, `got ${got}, wanted ${want} +/- ${tol}`);

/* ---- the fixture library ----

   Made up rather than taken out of `shared/foods.ts`, so that a
   price checked again next month cannot turn a test about
   arithmetic red. The one section that DOES read the real
   library is section 17's claim at the foot of this file, which
   is a claim about that library and nothing else. */
const RICE: Item = {
  id: "rice", en: "cooked rice, 1 cup", bn: "ভাত, ১ কাপ",
  kcal: 200, protein: 4, fibre: 0.6, grams: 160,
  price: 12, currency: "BDT", pricedOn: "2026-08", tags: ["staple"], raw: false,
};
const RICE_RAW: Item = {
  id: "rice-raw", en: "raw rice, 100 g", bn: "চাল, ১০০ গ্রাম",
  kcal: 360, protein: 7, fibre: 1.3, grams: 100,
  price: 8, currency: "BDT", pricedOn: "2026-08", tags: ["staple"], raw: true,
};
const ROTI: Item = {
  id: "roti", en: "roti, 1", bn: "রুটি, ১টা",
  kcal: 120, protein: 3, fibre: 1.8, grams: 100,
  price: 10, currency: "BDT", pricedOn: "2026-08", tags: ["staple"], raw: false,
};
const EGG: Item = {
  id: "egg", en: "egg, 1", bn: "ডিম, ১টা",
  kcal: 70, protein: 6, fibre: 0, grams: 50,
  price: 14, currency: "BDT", pricedOn: "2026-08", tags: ["protein"],
};
/* Priced in the other currency, and therefore not addable to any
   of the four above. */
const OATS: Item = {
  id: "oats", en: "porridge oats, 40 g", bn: "ওটস, ৪০ গ্রাম",
  kcal: 150, protein: 5, fibre: 4, grams: 40,
  price: 0.18, currency: "GBP", pricedOn: "2019-01", tags: ["staple"],
};
const LIBRARY = [RICE, RICE_RAW, ROTI, EGG, OATS];
const resolve = (id: string): Item | undefined => LIBRARY.find((i) => i.id === id);

const day = (n: number): string => {
  const at = new Date(Date.UTC(2026, 0, 1 + n));
  return at.toISOString().slice(0, 10);
};
const dayOf = (iso: string): number => Math.round(
  (Date.UTC(
    Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)),
  ) - Date.UTC(2026, 0, 1)) / 86400000,
);

const ate = (
  n: number, item: Item, portions: number, at?: string,
): Entry => ({
  date: day(n),
  label: item.en,
  atTime: at,
  kcal: item.kcal * portions,
  macros: { protein: item.protein * portions, fibre: item.fibre * portions },
  micros: { sodium: 1 },
  source: "library",
  sourceId: item.id,
});

/* ---- 1. how protein is spread across the day ---- */

const spreadEntries: Entry[] = [
  ate(0, EGG, 1, "08:00"),
  ate(0, RICE, 1, "13:30"),
  ate(0, EGG, 3, "20:15"),
  ate(1, EGG, 1, "07:45"),
  ate(1, EGG, 3, "19:00"),
];
const split = proteinSplit(spreadEntries);

near("protein split: two days of it", split.days, 2, 0);
near("protein split: the total is every gram with a protein figure",
  split.total, 6 + 4 + 18 + 6 + 18, 0.001);
near("protein split: the morning is one egg on each of two days",
  split.slots.find((s) => s.id === "morning")?.grams ?? -1, 12, 0.001);
near("protein split: the evening is three eggs on each of two days",
  split.slots.find((s) => s.id === "evening")?.grams ?? -1, 36, 0.001);
ok("protein split: the evening is the peak, which is the reading",
  split.peak === "evening");
near("protein split: and it is 69% of the placed protein",
  split.slots.find((s) => s.id === "evening")?.share ?? -1, 36 / 52, 0.001);
near("protein split: a mean of 26 g a day", split.perDay, 52 / 2, 0.001);

/* THE COVERAGE, which is the sentence under the split. A row
   with no clock cannot be placed in a slot, and a split drawn
   from half the protein is a split about half a day. */
const untimed = proteinSplit([...spreadEntries, ate(0, EGG, 10)]);
ok("protein split: an entry with no time is in the total and in no slot",
  untimed.total > untimed.placed);
near("protein split: which is what coverage says",
  untimed.coverage, 52 / 112, 0.001);
ok("protein split: and under the floor a caller has something to test",
  untimed.coverage < COVERAGE_FLOOR);

ok("protein split: nothing logged is a zero coverage rather than a throw",
  proteinSplit([]).coverage === 0 && proteinSplit([]).peak === null);

/* A planned row is next week's dinner dated ahead. */
const planned = proteinSplit([...spreadEntries,
  { ...ate(2, EGG, 10, "12:00"), planned: true }]);
near("protein split: a planned row is not a meal anybody has had",
  planned.total, split.total, 0.001);

ok("slots: four of them, and the last one wraps midnight",
  SLOTS.length === 4 && slotOf(23) === "late" && slotOf(2) === "late");
ok("slots: the boundaries are the ones the panel prints",
  slotOf(4) === "morning" && slotOf(10) === "morning"
  && slotOf(11) === "midday" && slotOf(15) === "midday"
  && slotOf(16) === "evening" && slotOf(20) === "evening"
  && slotOf(21) === "late" && slotOf(3) === "late");

/* ---- 2. what a swap would do ---- */

near("portions: an entry is the row's own portion times a factor",
  portionsOf(ate(0, RICE, 2.5), RICE) ?? -1, 2.5, 0.001);
ok("portions: a row with no energy cannot be scaled by energy",
  portionsOf(ate(0, RICE, 1), { ...RICE, kcal: 0 }) === null);
ok("portions: nor can an entry with none",
  portionsOf({ date: day(0), label: "a guess" }, RICE) === null);

/* Seven days, rice twice a day and one roti, so the rate is a
   fact about the log rather than about the window. */
const swapEntries: Entry[] = [];
for (let n = 0; n < 7; n += 1) {
  swapEntries.push(ate(n, RICE, 1, "13:00"));
  swapEntries.push(ate(n, RICE, 1, "20:00"));
  swapEntries.push(ate(n, ROTI, 1, "08:00"));
}
const swapped = swaps({ entries: swapEntries, resolve });

near("swaps: seven days written down", loggedDays(swapEntries), 7, 0);
ok("swaps: rice leads, because halving it is the bigger figure",
  swapped[0].item.id === "rice");
near("swaps: fourteen loggings", swapped[0].times, 14, 0);
near("swaps: which is fourteen times a week", swapped[0].perWeek, 14, 0.001);
near("swaps: 2800 kcal a week", swapped[0].kcalPerWeek, 2800, 0.001);
near("swaps: and half of it is 1400", swapped[0].halfPerWeek, 1400, 0.001);

ok("swaps: the exchange is roti, which is the only other staple logged",
  swapped[0].swap?.to.id === "roti");
near("swaps: at the weight of one logging of rice", swapped[0].swap?.grams ?? -1, 160, 0.001);
near("swaps: which is 200 kcal of rice", swapped[0].swap?.fromKcal ?? -1, 200, 0.001);
near("swaps: against 192 of roti at the same weight",
  swapped[0].swap?.toKcal ?? -1, 120 * 1.6, 0.001);
near("swaps: 112 kcal a week less, signed",
  swapped[0].swap?.kcalPerWeek ?? 0, (192 - 200) * 14, 0.01);
near("swaps: and the protein change is printed rather than judged",
  swapped[0].swap?.proteinPerWeek ?? 0, (3 * 1.6 - 4) * 14, 0.01);

/* THE TRAP. Raw rice is in the library, is a staple, is weighed,
   and is 360 kcal against cooked rice's 125 for the same weight.
   Offer it and the tool has printed the cooking water as advice. */
const withRaw = swaps({
  entries: [...swapEntries, ate(0, RICE_RAW, 1, "18:00")], resolve,
});
const rawRow = withRaw.find((s) => s.item.id === "rice-raw");
ok("swaps: raw rice is a row of its own", rawRow !== undefined);
ok("swaps: and it is never exchanged for the cooked form of itself",
  rawRow?.swap === undefined,
  `it offered ${rawRow?.swap?.to.id ?? "nothing"}`);
ok("swaps: nor is cooked rice exchanged for the raw form",
  withRaw.find((s) => s.item.id === "rice")?.swap?.to.id === "roti");

/* NOTHING THAT IS NOT ALREADY IN THE LOG. Egg is in the library
   and in nobody's log here, so it cannot be proposed. */
ok("swaps: an egg is in the library and not in this log, so it is not offered",
  swapped.every((s) => s.item.id !== "egg" && s.swap?.to.id !== "egg"));

/* And a tag has to match, so a staple is never swapped for a
   protein row: that would be a suggestion about a diet rather
   than arithmetic on two weights. */
const eggy = swaps({ entries: [...swapEntries, ate(0, EGG, 1, "09:00")], resolve });
ok("swaps: a staple is not exchanged for a protein row",
  eggy.find((s) => s.item.id === "rice")?.swap?.to.id === "roti");

ok("swaps: three of them, because the answer is almost always three items",
  swaps({ entries: swapEntries, resolve }).length <= 3);
ok("swaps: an empty log is an empty list rather than a throw",
  swaps({ entries: [], resolve }).length === 0);
ok("swaps: a row logged free hand resolves to nothing and is skipped",
  swaps({ entries: [{ date: day(0), label: "a plate of something", kcal: 700 }], resolve })
    .length === 0);

/* ---- 3. how full a hundred calories is ---- */

const full = per100kcal(LIBRARY, "protein", 5);
ok("per 100 kcal: the egg leads on protein", full[0].item.id === "egg");
near("per 100 kcal: 6 g of protein in 70 kcal is 8.6 g per hundred",
  full[0].protein, (6 / 70) * 100, 0.001);
ok("per 100 kcal: the order is descending",
  full.every((f, i) => i === 0 || full[i - 1].protein >= f.protein));

const fibrous = per100kcal(LIBRARY, "fibre", 5);
ok("per 100 kcal: sorted by fibre it is a different list",
  fibrous[0].item.id !== full[0].item.id);
near("per 100 kcal: oats, 4 g of fibre in 150 kcal",
  fibrous[0].fibre, (4 / 150) * 100, 0.001);
ok("per 100 kcal: a row with no energy cannot be divided by it",
  per100kcal([{ ...RICE, kcal: 0 }], "protein").length === 0);

/* ---- 4. this week against the reader's own average ---- */

const owned: Day[] = [];
for (let n = 0; n < 28; n += 1) owned.push({ date: day(n), kcal: n >= 21 ? 2200 : 1900 });
const mine = weekVsOwn({ days: owned, dayOf, today: 27 });

ok("this week: it reads", mine !== null);
near("this week: seven days in it", mine?.weekDays ?? -1, 7, 0);
near("this week: twenty-one before it", mine?.beforeDays ?? -1, 21, 0);
near("this week: 2200 against 1900", mine?.diff ?? 0, 300, 0.001);
near("this week: which is 15.8% above the reader's own average",
  mine?.pct ?? 0, 300 / 1900, 0.0001);
near("this week: measured over the twenty-one days before it",
  mine?.span ?? -1, 21, 0);

ok("this week: four logged days is the floor and three is under it",
  weekVsOwn({
    days: owned.filter((d) => dayOf(d.date) < 21 || dayOf(d.date) > 24),
    dayOf, today: 27,
  }) === null);
ok("this week: and ten days to compare against, or there is nothing to compare",
  weekVsOwn({ days: owned.slice(18), dayOf, today: 27 }) === null);
ok("this week: a day with no intake is not a day",
  weekVsOwn({ days: [], dayOf, today: 27 }) === null);

/* ---- 5. adherence against the trend ---- */

/* Six whole weeks. The first three are held at the target and
   the last three run 400 over it, and the weight falls faster in
   the first three, which is what a target being right looks
   like. */
const adhereDays: Day[] = [];
const points: Point[] = [];
let kg = 80;
for (let n = 0; n <= 41; n += 1) {
  const over = n >= 21;
  adhereDays.push({ date: day(n), kcal: over ? 2300 : 1900, weightKg: kg });
  points.push({ day: n, kg });
  kg -= over ? 0.02 : 0.08;
}
const held = adherence({
  days: adhereDays, trend: trend(points), dayOf, today: 41, targetKcal: 1900,
});

ok("adherence: six whole weeks", held?.weeks.length === 6);
near("adherence: three of them held", held?.groups.held.weeks ?? -1, 3, 0);
near("adherence: and three ran over", held?.groups.over.weeks ?? -1, 3, 0);
near("adherence: 400 over, which is the mean gap", held?.groups.over.meanGap ?? 0, 400, 0.001);
ok("adherence: the held weeks fell faster, which is the whole reading",
  (held?.groups.held.kgPerWeek ?? 0) < (held?.groups.over.kgPerWeek ?? 0));
ok("adherence: two groups of two weeks makes it comparable", held?.comparable === true);
near("adherence: the band is a hundred either side", held?.band ?? -1, HELD_BAND, 0);

/* A week's mean within the band is held, not over. */
const edge = adherence({
  days: adhereDays.map((d) => ({ ...d, kcal: 1990 })),
  trend: trend(points), dayOf, today: 41, targetKcal: 1900,
});
ok("adherence: ninety over is still held", edge?.groups.held.weeks === 6);

/* THE FLOORS. Two weeks is two points, and two points make a
   line through anything. */
ok("adherence: under three usable weeks it says nothing",
  adherence({
    days: adhereDays.slice(28), trend: trend(points), dayOf, today: 41, targetKcal: 1900,
  }) === null);
/* Three logged days in every block, aligned to the blocks the
   function counts back from today rather than to the calendar. */
const thin = adhereDays.filter((d) => (41 - dayOf(d.date)) % 7 < 3);
ok("adherence: a week with three logged days is not a week",
  adherence({ days: thin, trend: trend(points), dayOf, today: 41, targetKcal: 1900 })
    === null);
ok("adherence: no target is no reading, rather than a target of nought",
  adherence({
    days: adhereDays, trend: trend(points), dayOf, today: 41, targetKcal: 0,
  }) === null);

/* A week nobody weighed in has no trend, and it is still a week:
   its intake is real and its rate is unknown, which is two
   different facts. */
const unweighed = adherence({
  days: adhereDays, trend: trend(points.filter((p) => p.day < 21)),
  dayOf, today: 41, targetKcal: 1900,
});
ok("adherence: a week with no weighing keeps its intake and loses its rate",
  unweighed?.weeks.filter((w) => w.trendKg === null).length === 3);
ok("adherence: and the group it is in reports no rate at all",
  unweighed?.groups.over.kgPerWeek === null);
ok("adherence: which makes the comparison unavailable rather than wrong",
  unweighed?.comparable === false);

/* ---- 6. what this reader's own deficit actually does ---- */

const cal = calibration({
  learned: { days: 42, logged: 40, meanIntake: 1900, trendKgPerWeek: -0.35 },
  estimatedBurn: 2400,
});
ok("calibration: it reads", cal !== null);
near("calibration: a gap of 500 a day", cal?.gap ?? 0, 500, 0.001);
near("calibration: which the arithmetic puts at 0.45 kg a week",
  cal?.predictedKgPerWeek ?? 0, (500 * 7) / KCAL_PER_KG, 0.0001);
near("calibration: against 0.35 measured", cal?.observedKgPerWeek ?? 0, 0.35, 0.0001);
near("calibration: about three quarters of what was predicted",
  cal?.ratio ?? 0, 0.35 / ((500 * 7) / KCAL_PER_KG), 0.001);

/* NOT A CIRCLE. Fed a maintenance figure derived from the trend
   the ratio would be one for everybody, so the number has to
   move when the ESTIMATE moves and the measurement does not. */
const higher = calibration({
  learned: { days: 42, logged: 40, meanIntake: 1900, trendKgPerWeek: -0.35 },
  estimatedBurn: 2700,
});
ok("calibration: a bigger estimated burn predicts more and measures the same",
  (higher?.ratio ?? 9) < (cal?.ratio ?? 0));

ok("calibration: a month before it is offered at all",
  calibration({
    learned: { days: CALIBRATE_AFTER_DAYS - 1, logged: 20, meanIntake: 1900, trendKgPerWeek: -0.35 },
    estimatedBurn: 2400,
  }) === null);
ok("calibration: nothing learned is nothing to calibrate",
  calibration({ learned: null, estimatedBurn: 2400 }) === null);
ok("calibration: and no estimate is not a burn of nought",
  calibration({
    learned: { days: 42, logged: 40, meanIntake: 1900, trendKgPerWeek: -0.35 },
    estimatedBurn: 0,
  }) === null);

/* A gap too small to divide by. The figures are still printed;
   the ratio is not, because it swings on one biscuit. */
const flat = calibration({
  learned: { days: 42, logged: 40, meanIntake: 2350, trendKgPerWeek: -0.02 },
  estimatedBurn: 2400,
});
ok("calibration: eating at maintenance has figures and no ratio",
  flat !== null && flat.ratio === null && Math.abs(flat.gap) < MIN_CALIBRATION_GAP);

/* Gaining is the other direction and the signs have to survive
   it: a surplus predicts a gain, and a gain is a negative
   observed loss. */
const gaining = calibration({
  learned: { days: 42, logged: 40, meanIntake: 3000, trendKgPerWeek: 0.2 },
  estimatedBurn: 2400,
});
ok("calibration: a surplus predicts a gain rather than an inverted loss",
  (gaining?.predictedKgPerWeek ?? 0) < 0 && (gaining?.observedKgPerWeek ?? 0) < 0);
ok("calibration: and the ratio stays positive, because both point the same way",
  (gaining?.ratio ?? -1) > 0);

/* ---- 7. a price is a fact with a date on it ---- */

near("prices: six months is more than a few", STALE_MONTHS, 6, 0);
near("prices: months between two stamps", monthsSince("2026-02", "2026-08") ?? -1, 6, 0);
near("prices: and across a year boundary", monthsSince("2025-11", "2026-03") ?? -1, 4, 0);
ok("prices: six months old is not stale yet", !isStale("2026-02", "2026-08"));
ok("prices: seven is", isStale("2026-01", "2026-08"));
ok("prices: an undated price is worse than none, so it is stale",
  isStale(undefined, "2026-08") && monthsSince(undefined, "2026-08") === null);
ok("prices: and so is one this file cannot read", isStale("August", "2026-08"));

/* ---- 8. what the log cost ---- */

/* Four days: rice twice a day, one egg a day, and one plate of
   something with no price on it at all. */
const costEntries: Entry[] = [];
for (let n = 0; n < 4; n += 1) {
  costEntries.push(ate(n, RICE, 1, "13:00"));
  costEntries.push(ate(n, RICE, 1, "20:00"));
  costEntries.push(ate(n, EGG, 2, "08:00"));
  costEntries.push({ date: day(n), label: "a plate at work", kcal: 600 });
}
const bill = spend({ entries: costEntries, resolve, currency: "BDT", now: "2026-08" });

near("cost: four days", bill.days, 4, 0);
near("cost: 24 taka of rice and 28 of egg a day, over four days",
  bill.cost, 4 * (12 * 2 + 14 * 2), 0.001);
near("cost: 52 taka a day", bill.perDay, 52, 0.001);
near("cost: 540 kcal of it priced against 1140 logged",
  bill.coverage, (200 * 2 + 70 * 2) / (200 * 2 + 70 * 2 + 600), 0.0001);
near("cost: 96 taka per thousand calories",
  bill.per1000Kcal, (52 / 540) * 1000, 0.01);
near("cost: and 20 g of protein a day", bill.proteinPriced, 4 * (4 * 2 + 6 * 2), 0.001);
near("cost: which is 260 taka per hundred grams of it",
  bill.per100gProtein ?? 0, (208 / 80) * 100, 0.01);
ok("cost: nothing in this log is stale", bill.stale.length === 0);

/* ONE CURRENCY AT A TIME. A row priced in pounds is not added to
   a bill in taka, and it falls into the uncovered share where a
   reader can see it rather than being converted silently. */
const mixed = spend({
  entries: [...costEntries, ate(0, OATS, 1, "07:00")], resolve, currency: "BDT", now: "2026-08",
});
near("cost: a pound-priced row adds nothing to a taka bill", mixed.cost, bill.cost, 0.001);
ok("cost: and it lowers the coverage rather than disappearing",
  mixed.coverage < bill.coverage);

const sterling = spend({
  entries: [ate(0, OATS, 1, "07:00")], resolve, currency: "GBP", now: "2026-08",
});
near("cost: the same row in its own currency is 18p", sterling.cost, 0.18, 0.0001);
ok("cost: priced in January 2019, so it is drawn with its date",
  sterling.stale.includes("oats"));

ok("cost: a log with nothing priced is a zero coverage rather than a divide",
  spend({
    entries: [{ date: day(0), label: "a guess", kcal: 500 }], resolve,
    currency: "BDT", now: "2026-08",
  }).per1000Kcal === 0);
ok("cost: and no protein means no cost per gram of it, rather than infinity",
  spend({ entries: [], resolve, currency: "BDT", now: "2026-08" })
    .per100gProtein === null);

/* ---- 9. a budget, which is never a judgement ---- */

const against = againstBudget(bill, 490);
near("budget: 490 a week is 70 a day", against?.perDay ?? -1, 70, 0.001);
near("budget: against 52 spent on priced food", against?.spentPerDay ?? -1, 52, 0.001);
near("budget: 18 under, signed", against?.diffPerDay ?? 0, -18, 0.001);
/* THE PROJECTION, and it is the reason a raw comparison would be
   wrong: 52 taka is what the priced 47% of the log came to, and
   a budget covers the other 53% too. */
near("budget: scaled to the whole log it is 110 a day",
  against?.wholeLogPerDay ?? 0, 52 / bill.coverage, 0.01);
ok("budget: which is above the budget where the priced share alone was under",
  (against?.wholeLogPerDay ?? 0) > (against?.perDay ?? 0));
ok("budget: no budget is no reading", againstBudget(bill, 0) === null);
ok("budget: and no logged day is nothing to divide by",
  againstBudget(spend({ entries: [], resolve, currency: "BDT", now: "2026-08" }), 490)
    === null);

/* ---- 10. section 17's own claim, against the real table ---- */

/* The library, not the fixture. The two sentences the panel puts
   a figure on are true because of what is in `shared/foods.ts`
   rather than because somebody wrote them down, and the day the
   price table stops supporting one is the day the page has to
   stop saying it. */
const real: Item[] = FOODS as Portion[];
for (const [place, currency] of [["Bangladesh", "BDT"], ["the UK", "GBP"]] as const) {
  const byTag = costByTag(real, currency);
  const staple = byTag.find((t) => t.tag === "staple");
  const protein = byTag.find((t) => t.tag === "protein");
  ok(`cost by tag: ${place} has both a staple and a protein group`,
    staple !== undefined && protein !== undefined);
  /* Section 7 and section 17: a very low carbohydrate way of
     eating costs more per calorie, and this is the figure. */
  ok(`cost by tag: in ${place} a staple calorie is the cheaper one`,
    (staple?.per1000Kcal ?? 9e9) < (protein?.per1000Kcal ?? 0),
    `staple ${staple?.per1000Kcal.toFixed(2)} vs protein ${protein?.per1000Kcal.toFixed(2)}`);
  ok(`cost by tag: every group in ${place} says how many rows it is`,
    byTag.every((t) => t.rows > 0));

  /* AND THE OTHER ONE IS NOT WHAT IT LOOKS LIKE. "Protein costs
     more" is not a fact about the protein GROUP: dal is tagged
     both, and rice carries protein, so the middle protein row is
     within a rounding of the middle staple row per gram of
     protein in both tables. What is true, and what makes the
     table worth having, is the SPREAD inside it. */
  const p = proteinPrice(real, currency);
  ok(`protein price: ${place} has enough priced rows to read`, p !== null);
  ok(`protein price: in ${place} the middle row is several times the cheapest`,
    (p?.times ?? 0) > 3,
    `cheapest ${p?.cheapestPer100g.toFixed(2)}, middle ${p?.medianPer100g.toFixed(2)}`);
  ok(`protein price: and the cheapest row in ${place} is a real food`,
    (p?.cheapest.en ?? "").length > 0 && (p?.cheapest.bn ?? "").length > 0);
}

ok("protein price: three priced rows before it is offered at all",
  proteinPrice([RICE, EGG], "BDT") === null);
near("protein price: 10, 20 and 90 per 100 g has a middle of 20 and a spread of two",
  proteinPrice([
    { ...RICE, id: "a", protein: 10, price: 1 },
    { ...RICE, id: "b", protein: 5, price: 1 },
    { ...RICE, id: "c", protein: 10, price: 9 },
  ], "BDT")?.times ?? 0, 2, 0.001);

ok("cost by tag: the two currencies are never added together",
  costByTag(LIBRARY, "GBP").every((t) => t.rows === 1));

/* The middle row rather than the mean of it, so one expensive
   row cannot become the sentence. */
const skewed: Item[] = [
  { ...RICE, id: "a", price: 10 }, { ...RICE, id: "b", price: 20 },
  { ...RICE, id: "c", price: 30 }, { ...RICE, id: "d", price: 900 },
];
near("cost by tag: four rows at 10, 20, 30 and 900 have a middle of 25",
  costByTag(skewed, "BDT")[0].per1000Kcal, (25 / 200) * 1000, 0.001);

/* ---- 8. days after a short night ----

   THE OFFSET IS THE WHOLE READING. A night is paired with the
   NEXT row's intake, because short sleep raises ghrelin and
   lowers leptin overnight and the appetite it moves is the
   following day's. This fixture is built so that the wrong
   pairing comes out with the opposite sign rather than with a
   smaller one: a reading off by a day would still look entirely
   correct on a page. */

const slept: Day[] = [];
for (let n = 0; n < 20; n += 1) {
  slept.push({
    date: day(n),
    /* Five hours on the even nights, eight on the odd ones. */
    sleepHours: n % 2 === 0 ? 5 : 8,
    /* And 2400 on the odd days, which are the days AFTER a short
       night, against 2000 on the even ones. */
    kcal: n % 2 === 0 ? 2000 : 2400,
  });
}
const nights = afterShortNights({ days: slept, targetKcal: 2100 });

ok("after a short night: it reads", nights !== null);
near("after a short night: ten days follow one", nights?.afterShort.days ?? -1, 10, 0);
near("after a short night: nine follow a longer one, because the last has no day after it",
  nights?.afterRest.days ?? -1, 9, 0);
near("after a short night: 2400 kcal on those days",
  nights?.afterShort.meanKcal ?? 0, 2400, 0.001);
near("after a short night: 2000 after a longer one",
  nights?.afterRest.meanKcal ?? 0, 2000, 0.001);
near("after a short night: which is 400 more", nights?.diff ?? 0, 400, 0.001);
ok("after a short night: and the WRONG pairing would be 400 less, not 400 more",
  (nights?.diff ?? 0) > 0,
  "pairing a night with the same row's intake gives -400 on this fixture");
near("after a short night: 300 above a target of 2100",
  nights?.overTarget ?? 0, 300, 0.001);
near("after a short night: and the rest sit 100 under it",
  nights?.restOverTarget ?? 0, -100, 0.001);
near("after a short night: twenty rows carry hours", nights?.nights ?? -1, 20, 0);
near("after a short night: nineteen of them are pairs", nights?.pairs ?? -1, 19, 0);
near("after a short night: the middle night is 6.5 hours",
  nights?.medianHours ?? 0, 6.5, 0.001);
ok("after a short night: the span is printed as dates and as days",
  nights?.from === day(0) && nights?.to === day(18) && nights?.span === 19);
near("after a short night: the line is seven hours", nights?.short ?? -1, SHORT_NIGHT_HOURS, 0);

ok("after a short night: no target handed in is a null rather than a zero",
  afterShortNights({ days: slept })?.overTarget === null);

/* A night with nothing logged the next day is not a pair, which
   is the difference between a night nobody wrote a dinner after
   and a night after which nothing was eaten. */
const unpaired = afterShortNights({
  days: slept.map((d) => (d.date === day(1) ? { date: d.date, sleepHours: d.sleepHours } : d)),
});
near("after a short night: a night whose next day has no food is dropped",
  unpaired?.afterShort.days ?? -1, 9, 0);

ok("after a short night: five on each side is the floor and four is under it",
  afterShortNights({ days: slept.slice(0, 8) }) === null);
ok("after a short night: a log with no hours at all draws nothing",
  afterShortNights({ days: owned }) === null);

/* ---- 9. what moved, over the window a stall is read over ---- */

const moved: Day[] = [];
const stillWeights: Point[] = [];
for (let n = 0; n < 42; n += 1) {
  moved.push({ date: day(n), steps: n < 21 ? 8000 : 4500, kcal: 2000, weightKg: 80 });
  stillWeights.push({ day: n, kg: 80 });
}
const walk = movement({
  days: moved, todayISO: day(41), weights: stillWeights, dayOf, weightKg: 80,
});

ok("movement: it reads", walk !== null);
near("movement: three weeks, which is the window a stall is read over",
  walk?.days ?? -1, STALL_DAYS, 0);
near("movement: the middle day of the near window is 4500", walk?.now ?? -1, 4500, 0);
near("movement: and of the one before it 8000", walk?.before ?? -1, 8000, 0);
near("movement: a fall of 3500 a day", walk?.change ?? 0, -3500, 0.001);
near("movement: which is 44% of it", walk?.changePct ?? 0, -3500 / 8000, 0.0001);
near("movement: 21 days of each carried a count", walk?.nowDays ?? -1, 21, 0);
near("movement: and 21 before them", walk?.beforeDays ?? -1, 21, 0);

/* The energy is a BAND, and most of its width is the stride
   length rather than the walking. */
ok("movement: the fall is worth about 77 to 117 kcal a day at 80 kg",
  Math.abs((walk?.kcal?.high ?? 0) + 77.2) < 0.5 && Math.abs((walk?.kcal?.low ?? 0) + 116.7) < 0.5,
  `got ${walk?.kcal?.low.toFixed(1)} to ${walk?.kcal?.high.toFixed(1)}`);
ok("movement: with no weight there is no body to walk, so no band",
  movement({ days: moved, todayISO: day(41), weights: stillWeights, dayOf })?.kcal === null);

/* And the two facts that make the sentence worth printing. */
ok("movement: the trend's interval spans zero, which is flat", walk?.flat === true);
near("movement: fitted to 21 weighings", walk?.weighings ?? -1, 21, 0);
near("movement: the log has not moved", walk?.intakeChange ?? 9e9, 0, 0.001);
near("movement: 2000 a day over 21 logged days", walk?.intakeNow ?? 0, 2000, 0.001);
near("movement: and 2000 over the 21 before", walk?.intakeBefore ?? 0, 2000, 0.001);
ok("movement: the near window opens three weeks back", walk?.from === day(21));

/* A rate that can tell a loss from a gain is not flat, and
   saying otherwise would be this tool's worst mistake. */
const falling: Point[] = stillWeights.map((p) => ({ day: p.day, kg: 80 - p.day * 0.07 }));
ok("movement: a trend that is moving is not reported as flat",
  movement({ days: moved, todayISO: day(41), weights: falling, dayOf })?.flat === false);

ok("movement: seven days with a count in each window is the floor",
  movement({
    days: moved.map((d, i) => (i > 23 ? { ...d, steps: undefined } : d)),
    todayISO: day(41), weights: stillWeights, dayOf,
  }) === null);
ok("movement: a log with no steps at all draws nothing",
  movement({
    days: moved.map((d) => ({ ...d, steps: undefined })),
    todayISO: day(41), weights: stillWeights, dayOf,
  }) === null);

/* ---- 10. the tape, beside the scale ---- */

const taped: Day[] = [
  { date: day(14), waistCm: 94 },
  { date: day(20), armCm: 33 },
  { date: day(30), neckCm: 38 },
  { date: day(38), hipCm: 100 },
  { date: day(41), waistCm: 91, armCm: 33.4, hipCm: 99 },
];
const flatTrend: Point[] = [];
for (let n = 14; n <= 41; n += 1) flatTrend.push({ day: n, kg: 80 });
const measured = tape({ days: taped, trend: flatTrend, dayOf, today: 41 });

ok("tape: it reads", measured !== null);
near("tape: four weeks of it", measured?.span ?? -1, TAPE_SPAN_DAYS, 0);
const waistSite = measured?.sites.find((s) => s.id === "waist");
near("tape: the waist is 3 cm down", waistSite?.change ?? 0, -3, 0.001);
near("tape: over 27 days", waistSite?.days ?? -1, 27, 0);
ok("tape: and 3 cm is more than a tape measure can invent", waistSite?.read === true);
ok("tape: an arm 0.4 cm up is drawn and is not called a change",
  measured?.sites.find((s) => s.id === "arm")?.read === false);
ok("tape: a hip measured twice three days apart is not a fortnight",
  measured?.sites.every((s) => s.id !== "hip") === true);
ok("tape: a neck measured once is not a pair",
  measured?.sites.every((s) => s.id !== "neck") === true);
near("tape: the trend has not moved over the same four weeks", measured?.kg ?? 9e9, 0, 0.001);
near("tape: out of 28 trend points", measured?.weighings ?? -1, 28, 0);

ok("tape: with no weighings the trend says nothing rather than nought",
  tape({ days: taped, trend: [], dayOf, today: 41 })?.kg === null);
ok("tape: no site with two readings a fortnight apart draws nothing",
  tape({ days: [{ date: day(40), waistCm: 94 }, { date: day(41), waistCm: 91 }],
    trend: flatTrend, dayOf, today: 41 }) === null);
ok("tape: six sites, and the three with no form yet are simply absent",
  MEASURES.length === 6
  && MEASURES.every((m) => m.of({ date: day(0) }) === undefined));

/* ---- 11. and the plan says these things ---- */

const plan = readFileSync(join(ROOT, "DIET.md"), "utf8");
/* WHITESPACE COLLAPSED, because DIET.md is wrapped prose and
   every sentence worth asserting here runs across a line break.
   Reading it raw makes half of these pass for the wrong
   reason. */
const oneLine = (s: string): string => s.replace(/\s+/g, " ");
const sixteen = oneLine(plan.split("## 16. Food insights")[1]?.split("\n## 17.")[0] ?? "");
const seventeen = oneLine(plan.split("## 17. What food costs")[1]?.split("\n## 18.")[0] ?? "");

ok("DIET.md still has a section 16 to read", sixteen.length > 500);
ok("section 16 still asks for the protein split", /How protein is spread/.test(sixteen));
ok("section 16 still asks what a swap would do", /What a swap would do/.test(sixteen));
ok("section 16 still asks for protein and fibre per 100 kcal",
  /per 100 kcal/.test(sixteen));
ok("section 16 still compares a week to the reader's own average",
  /never to anybody else's/i.test(sixteen));
ok("section 16 still asks for adherence against the trend",
  /Adherence against the trend/.test(sixteen));
ok("section 16 still asks what this reader's own deficit does",
  /personal calibration constant/.test(sixteen));
ok("section 16 still says a correlation is described and never explained",
  /described, never explained/.test(sixteen));

ok("section 17 still asks for a weekly food budget",
  /weekly food budget/.test(seventeen));
ok("section 17 still asks for spend plotted against intake",
  /plots spend against intake/.test(seventeen));
ok("section 17 still says a price is a fact with a date on it",
  /a price is a fact with a date on it/.test(seventeen));
ok("section 17 still refuses a shop",
  /No affiliate links, no product recommendations/.test(seventeen));

const eighteen = oneLine(plan.split("## 18. The body has a calendar")[1]
  ?.split("\n## 19.")[0] ?? "");
const nineteen = oneLine(plan.split("## 19. Movement,")[1]?.split("\n## 20.")[0] ?? "");

ok("DIET.md still has a section 18 to read", eighteen.length > 500);
ok("section 18 still asks for one optional field, hours",
  /One optional field, hours/.test(eighteen));
/* THE OFFSET, read out of the plan rather than remembered. A
   reading that pairs a night with the same day's intake is off
   by one and looks entirely correct. */
ok("section 18 still says the days AFTER short nights are the ones read",
  /days after short nights average so much above target/.test(eighteen));
ok("section 18 still refuses a sleep score",
  /never turned into a sleep score/.test(eighteen));

ok("DIET.md still has a section 19 to read", nineteen.length > 500);
ok("section 19 still makes a step count an input",
  /step count is an input/.test(nineteen));
ok("section 19 still names the stall that is a fall in walking",
  /Your steps[\s>]*have fallen from about 8,000 a day to about 4,500/.test(nineteen));
ok("section 19 still says the tape is what settles recomposition",
  /it has the tape/.test(nineteen));
ok("section 19 still refuses an exercise calorie database",
  /No exercise calorie database/.test(nineteen));

/* ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\ninsights: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`insights: ${passed} checks passed`);
