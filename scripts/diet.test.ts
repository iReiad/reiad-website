/* ============================================================
   diet.test.ts: the diet tool's arithmetic, as assertions.

       node scripts/diet.test.ts

   `DIET.md` is a long piece of prose and prose does not hold.
   Every number in `shared/diet.ts` is a claim about somebody's
   body, and the ones that matter most are the ones that are
   wrong in a flattering direction, because nothing about the
   page looks different when they are.

   No browser and no database: this is arithmetic and a grep, so
   it runs everywhere and in CI, which is the only way a rule
   survives.

   ---- what this covers that a formula check would not ----

   THE FLOORS. `target()` is the one function here that can
   refuse, and a clamp that stops working still returns a
   plausible number. Every bound is asserted from the wrong side.

   THE TABLE IN THE PROSE. The Asian BMI cut-offs are stated in
   `DIET.md` and again in `BMI_CUTS`, and the day those disagree
   is the day the page says one thing and the plan says another.
   This reads the file.

   THE SIGN OF THE LEARNED BURN. It is a subtraction of a signed
   delta, and written as an addition of a magnitude it comes out
   inverted for anybody gaining. Both directions are here.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
/* By relative path rather than through `@reiad/shared`, the same
   way every other node-side test here reads it: node cannot
   strip types from a file under `node_modules`. */
import {
  BMI_CUTS, ACTIVITY, RATES, KCAL_PER_KG, LEARN_AFTER_DAYS,
  TREND_HALF_LIFE_DAYS, KETO_ADAPTATION_DAYS, KETO_WEEK_ONE_KG,
  MAX_LOSS_PCT_PER_WEEK, MAX_GAIN_PCT_PER_WEEK, NO_LOSS_BELOW_BMI,
  MARKS, PROTOCOL_NAMES, UNLOGGED_SE_SHARE,
  bmi, bmiBand, whtr, whtrBand, navyFat, deurenbergFat, fatEstimate,
  ffmi, ffmiNormalised, mifflin, katch, restingBurn, estimatedBurn,
  activityFactor, trend, fit, slopePerWeek, learnedBurn, target,
  proteinFloor, projection, outsideAdaptation, floorKcal,
  toStone, stoneLabel, toFeetInches,
  glycogenKg, GLYCOGEN_WATER_RATIO, drained, drainedBy, gutTaken,
  forecastChange, settlingDays, protocolName, bandAt, hourlyArc,
  stretches, readable, weighings, learnedHere, entryHour,
  MEALS, mealAt, mealNamed, mealOf, byMeal, entriesFrom, planKept,
  type Body, type Day, type Entry, type Point, type Phase, type Protocol,
  totalFor,
  stall, STALL_DAYS, cyclePlace, cycleOverCycle, LUTEAL_DAYS,
  oilPerMeal, OIL_KCAL_PER_ML,
  TAPE_RESOLUTION_CM,
  SEASONS, seasonsOn, seasonById, quietSeason, shiftedSeason, calendarKnownTo,
  type SeasonId,
  BAND_MIN_KG, BAND_MAX_KG, BAND_OUT_DAYS, LOWEST_RATE_PCT, MAX_SURPLUS_KCAL,
  bandWidth, suggestBand, bandWatch, gainWeekOne,
  type MaintenanceBand,
} from "../shared/diet.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const near = (what: string, got: number, want: number, tol: number): void =>
  ok(what, Math.abs(got - want) <= tol, `got ${got}, wanted ${want} +/- ${tol}`);

const MAN: Body = {
  heightCm: 180, weightKg: 80, ageYears: 30, sex: "male",
  ancestry: "general", waistCm: 90, neckCm: 38,
};
const WOMAN: Body = {
  heightCm: 165, weightKg: 65, ageYears: 30, sex: "female",
  ancestry: "general", waistCm: 80, hipCm: 100, neckCm: 32,
};

/* ---- 1. BMI, and the two sets of cut-offs ---- */

near("bmi: 80kg at 180cm", bmi(80, 180), 24.69, 0.01);
near("bmi: 65kg at 165cm", bmi(65, 165), 23.88, 0.01);

ok("cuts: the general set is 25 and 30",
  BMI_CUTS.general.raised === 25 && BMI_CUTS.general.high === 30);
ok("cuts: the Asian set is 23 and 27.5",
  BMI_CUTS.asian.raised === 23 && BMI_CUTS.asian.high === 27.5);
ok("cuts: underweight is 18.5 in both",
  BMI_CUTS.general.under === 18.5 && BMI_CUTS.asian.under === 18.5);

/* The whole point of the table: the same body, two answers. */
ok("band: 24.7 is healthy on the general set", bmiBand(24.7, "general") === "healthy");
ok("band: 24.7 is raised on the Asian set", bmiBand(24.7, "asian") === "raised");
ok("band: 28 is raised on the general set", bmiBand(28, "general") === "raised");
ok("band: 28 is high on the Asian set", bmiBand(28, "asian") === "high");
ok("band: 17 is under on both",
  bmiBand(17, "general") === "under" && bmiBand(17, "asian") === "under");
/* A cut-off is the bottom of the band it names, not the top of
   the one below: exactly 23.0 is raised for an Asian reader. */
ok("band: the cut-off itself is inside the higher band",
  bmiBand(23.0, "asian") === "raised" && bmiBand(25.0, "general") === "raised");

/* ---- and the prose says the same thing ---- */

const PLAN = readFileSync(join(ROOT, "DIET.md"), "utf8");
ok("DIET.md states the Asian cut-offs this file uses",
  /\|\s*increased risk\s*\|\s*25\.0\s*\|\s*\*\*23\.0\*\*\s*\|/.test(PLAN)
  && /\|\s*high risk\s*\|\s*30\.0\s*\|\s*\*\*27\.5\*\*\s*\|/.test(PLAN),
  "the table in the plan and BMI_CUTS have drifted");
ok("DIET.md states the absolute floors this file uses",
  PLAN.includes("1200 kcal for women and 1500 for men"));
ok("DIET.md states the kcal per kg this file uses",
  PLAN.includes(String(KCAL_PER_KG)));
ok("DIET.md states the fourteen day wait",
  PLAN.includes(`${LEARN_AFTER_DAYS} days of logs`)
  || PLAN.includes("fourteen days"));

/* ---- 2. waist to height ---- */

near("whtr: 90cm at 180cm", whtr(90, 180), 0.5, 0.0001);
ok("whtr band: under 0.5 is healthy", whtrBand(0.49) === "healthy");
ok("whtr band: 0.5 itself is raised", whtrBand(0.5) === "raised");
ok("whtr band: 0.62 is high", whtrBand(0.62) === "high");
ok("whtr band: 0.38 is low", whtrBand(0.38) === "low");

/* ---- 3. body fat, and its error bars ---- */

near("navy: a man at 180/90/38", navyFat(MAN) as number, 19.82, 0.05);
near("navy: a woman at 165/80/100/32", navyFat(WOMAN) as number, 32.37, 0.05);
ok("navy: null without a neck", navyFat({ ...MAN, neckCm: undefined }) === null);
ok("navy: null for a woman without hips", navyFat({ ...WOMAN, hipCm: undefined }) === null);
ok("navy: null rather than NaN when the tape is impossible",
  navyFat({ ...MAN, waistCm: 30, neckCm: 40 }) === null,
  "a waist smaller than a neck must refuse, not return NaN");

near("deurenberg: the man", deurenbergFat({ ...MAN, waistCm: undefined }), 20.33, 0.01);
near("deurenberg: a woman reads higher than a man at the same BMI",
  deurenbergFat({ ...MAN, sex: "female" }) - deurenbergFat(MAN), 10.8, 1e-9);
near("deurenberg: the Asian correction is applied",
  deurenbergFat({ ...MAN, ancestry: "asian" }) - deurenbergFat(MAN), 3.5, 0.0001);
ok("navy does not take the ancestry correction",
  navyFat({ ...MAN, ancestry: "asian" }) === navyFat(MAN),
  "the tape measures the body; only the BMI equation inherits the bias");

const est = fatEstimate(MAN);
ok("estimate: the tape wins where there is one", est.method === "navy");
ok("estimate: no tape falls back to the equation",
  fatEstimate({ ...MAN, waistCm: undefined }).method === "deurenberg");
near("estimate: lean plus fat is the whole body", est.leanKg + est.fatKg, 80, 0.0001);
near("estimate: the range is two standard errors wide",
  est.pct.high - est.pct.low, est.se * 2, 0.0001);
ok("estimate: the tape method is the narrower of the two",
  est.se < fatEstimate({ ...MAN, waistCm: undefined }).se);

near("ffmi: 64kg lean at 180cm", ffmi(64, 180), 19.75, 0.01);
ok("ffmi: normalising raises a short frame and lowers a tall one",
  ffmiNormalised(64, 170) > ffmi(64, 170)
  && ffmiNormalised(64, 190) < ffmi(64, 190));

/* ---- 4. resting and estimated burn ---- */

near("mifflin: the man", mifflin(MAN), 1780, 0.001);
ok("mifflin: the two forms differ by 166",
  mifflin(MAN) - mifflin({ ...MAN, sex: "female" }) === 166);
near("katch: 60kg of lean mass", katch(60), 1666, 0.001);
ok("resting: katch the moment lean mass is known",
  restingBurn(MAN, 64).method === "katch");
ok("resting: mifflin without it", restingBurn(MAN).method === "mifflin");
ok("resting: a lean mass of zero is not lean mass",
  restingBurn(MAN, 0).method === "mifflin");
near("estimated: sedentary is 1.2 times resting",
  estimatedBurn(1780, activityFactor("sedentary")), 2136, 0.001);
ok("activity: the factors ascend",
  ACTIVITY.every((a, i) => i === 0 || a.factor > ACTIVITY[i - 1].factor));
ok("activity: every level is written in both languages",
  ACTIVITY.every((a) => a.en.length > 0 && a.bn.length > 0));
ok("activity: an unknown key falls back to sedentary rather than NaN",
  activityFactor("nonsense") === 1.2);

/* ---- 5. the trend ---- */

const flat: Point[] = Array.from({ length: 20 }, (_, d) => ({ day: d, kg: 80 }));
ok("trend: seeded from the first reading", trend(flat)[0].kg === 80);
ok("trend: a constant series stays constant",
  trend(flat).every((p) => Math.abs(p.kg - 80) < 1e-9));

const step: Point[] = [{ day: 0, kg: 80 }, ...Array.from(
  { length: 40 }, (_, i) => ({ day: i + 1, kg: 79 }))];
const stepped = trend(step);
ok("trend: a step is approached rather than followed",
  stepped[1].kg > 79.85 && stepped[1].kg < 80,
  `one day after a 1kg step the trend is ${stepped[1].kg}`);
near("trend: one half life covers half the gap",
  trend([{ day: 0, kg: 80 }, { day: TREND_HALF_LIFE_DAYS, kg: 78 }])[1].kg, 79, 0.0001);
ok("trend: the gap between readings is what weights them, not the row",
  trend([{ day: 0, kg: 80 }, { day: 14, kg: 78 }])[1].kg
  < trend([{ day: 0, kg: 80 }, { day: 1, kg: 78 }])[1].kg,
  "a fortnight's gap must move the trend further than a day's");
ok("trend: readings out of order are sorted first",
  trend([{ day: 5, kg: 79 }, { day: 0, kg: 80 }])[0].day === 0);

/* ---- 6. the fit, and the rate ---- */

const line: Point[] = Array.from({ length: 29 }, (_, d) => ({ day: d, kg: 80 - (0.5 / 7) * d }));
const f = fit(line);
ok("fit: three points are the minimum", fit(line.slice(0, 2)) === null);
near("fit: a perfect line gives its own slope", (f as { slope: number }).slope, -0.5 / 7, 1e-12);
near("fit: and no residual", (f as { se: number }).se, 0, 1e-9);
ok("fit: null when every reading is on the same day",
  fit([{ day: 3, kg: 80 }, { day: 3, kg: 79 }, { day: 3, kg: 78 }]) === null);

const rate = slopePerWeek(line);
near("rate: half a kilo a week", (rate as { mid: number }).mid, -0.5, 1e-9);
ok("rate: the band brackets the estimate",
  (rate as { low: number }).low <= (rate as { mid: number }).mid
  && (rate as { mid: number }).mid <= (rate as { high: number }).high);

/* THE BIAS THIS FILE EXISTS FOR. An exponentially weighted
   average lags by about 1.44 half lives, so a rate read off its
   endpoints understates a real loss by roughly a third on a
   month of data, in the flattering direction. */
const emaLine = trend(line);
const emaRate = ((emaLine[emaLine.length - 1].kg - emaLine[0].kg) / 28) * 7;
ok("rate: the regression has no lag where the trend's endpoints do",
  Math.abs((rate as { mid: number }).mid + 0.5) < 1e-9 && emaRate > -0.42,
  `endpoints of the trend give ${emaRate.toFixed(3)} kg/week against a true -0.5`);

/* ---- 7. the learned burn ---- */

const intakes = Array.from({ length: 29 }, (_, d) => ({ day: d, kcal: 2000 }));
ok("learned: nothing before a fortnight",
  learnedBurn(line.slice(0, 10), intakes.slice(0, 10)) === null);
ok("learned: nothing from two weighings",
  learnedBurn([line[0], line[28]], intakes) === null,
  "a slope needs a residual before it can carry an error bar");

const L = learnedBurn(line, intakes);
near("learned: eat 2000, lose half a kilo a week, burn 2550",
  (L as { kcal: { mid: number } }).kcal.mid, 2550, 0.5);
near("learned: and it reports the rate it used",
  (L as { trendKgPerWeek: number }).trendKgPerWeek, -0.5, 1e-9);
ok("learned: it reports how much of the window was logged",
  (L as { logged: number }).logged === 29 && (L as { days: number }).days === 28);

/* The sign, from the other side. Somebody gaining on 2000 a day
   burns LESS than 2000, and a formula written as an addition of
   a magnitude returns 2550 here too. */
const gaining = line.map((p) => ({ day: p.day, kg: 80 + (0.5 / 7) * p.day }));
near("learned: gaining on the same intake burns less, not more",
  (learnedBurn(gaining, intakes) as { kcal: { mid: number } }).kcal.mid, 1450, 0.5);

/* A patchier log has to widen the band rather than narrow it. */
const noisy = line.map((p, i) => ({ day: p.day, kg: p.kg + (i % 2 ? 0.6 : -0.6) }));
const wide = learnedBurn(noisy, intakes);
ok("learned: noise widens the band",
  (wide as { kcal: { high: number; low: number } }).kcal.high
    - (wide as { kcal: { high: number; low: number } }).kcal.low
  > (L as { kcal: { high: number; low: number } }).kcal.high
    - (L as { kcal: { high: number; low: number } }).kcal.low);

/* ---- 8. the goal engine, and every floor from the wrong side ---- */

const base = { body: MAN, maintenance: 2550, restingKcal: 1780 } as const;

const maintain = target({ ...base, kind: "maintain", ratePct: 0.5 });
ok("target: maintain is maintenance", maintain.kcal === 2550 && maintain.offset === 0);

const steady = target({ ...base, kind: "lose", ratePct: 0.5 });
near("target: half a percent a week off 80kg is 440 a day",
  steady.offset, -440, 1);
ok("target: a deliverable rate hits no floor", steady.floors.length === 0);

const capped = target({ ...base, kind: "lose", ratePct: 3 });
ok("target: the rate ceiling holds", capped.floors.includes("rate"));
ok("target: and every other bound it hit is reported too",
  capped.floors.includes("resting"),
  "a 3% rate on this body is capped AND then floored, and both matter");
ok("target: and the ceiling is the documented one",
  MAX_LOSS_PCT_PER_WEEK === 1.0 && MAX_GAIN_PCT_PER_WEEK === 0.5);

/* A small person on a large requested rate is where the floors
   actually bite, which is exactly the reader they exist for. */
const small: Body = { ...WOMAN, weightKg: 50, heightCm: 160 };
const pushed = target({
  body: small, maintenance: 1600, restingKcal: 1300, kind: "lose", ratePct: 1,
});
ok("target: never below resting burn", pushed.kcal >= 1300);
ok("target: and it says which bound it hit", pushed.floors.length > 0);
const floored = target({
  body: small, maintenance: 1400, restingKcal: 1100, kind: "lose", ratePct: 1,
});
ok("target: the absolute floor for a woman is 1200",
  floored.kcal >= 1200 && floorKcal("female") === 1200);
ok("target: and 1500 for a man", floorKcal("male") === 1500);
ok("target: the absolute floor is named when it is the binding one",
  floored.floors.includes("absolute") || floored.floors.includes("resting"));

const thin = target({
  body: { ...small, weightKg: 44 }, maintenance: 1500, restingKcal: 1200,
  kind: "lose", ratePct: 0.5,
});
ok("target: no loss goal under BMI 18.5",
  thin.floors.length === 1 && thin.floors[0] === "underweight" && thin.offset === 0);
ok("target: and the threshold is the documented one", NO_LOSS_BELOW_BMI === 18.5);

const gain = target({ ...base, kind: "gain", ratePct: 0.25 });
ok("target: gaining adds", gain.offset > 0);
ok("target: gaining is not floored by a deficit rule", gain.floors.length === 0);

/* ---- 9. the protein floor ---- */

const p = proteinFloor(64, 0.25);
near("protein: the floor is 1.6 g per kg of lean mass", p.low, 102.4, 0.01);
ok("protein: a deeper deficit asks for more",
  proteinFloor(64, 1.0).mid > proteinFloor(64, 0.25).mid);
near("protein: and never more than 2.2", proteinFloor(64, 5).mid, 64 * 2.2, 0.01);
ok("protein: the floor is the floor at any rate",
  proteinFloor(64, 0.1).low === proteinFloor(64, 1.0).low);

/* ---- 10. the projection ---- */

const weeks = projection({ currentKg: 80, goalKg: 75, weekly: { low: -0.7, mid: -0.5, high: -0.3 } });
ok("projection: a band, not a date", weeks !== null && weeks.low < weeks.high);
near("projection: the fastest case is the fastest",
  (weeks as { low: number }).low, 5 / 0.7, 0.01);
ok("projection: null when the trend is going the wrong way",
  projection({ currentKg: 80, goalKg: 75, weekly: { low: 0.1, mid: 0.3, high: 0.5 } }) === null);
ok("projection: null when the band spans flat",
  projection({ currentKg: 80, goalKg: 75, weekly: { low: -0.3, mid: 0, high: 0.3 } }) === null,
  "a slope whose error bar contains zero cannot date anything");
ok("projection: a hand-built range with a zero mid does not divide by it",
  Number.isFinite(projection({
    currentKg: 80, goalKg: 75, weekly: { low: -0.7, mid: 0, high: -0.3 },
  })?.mid ?? Infinity),
  "-Infinity weeks would render as a number");
ok("projection: already there is zero weeks",
  projection({ currentKg: 75, goalKg: 75, weekly: { low: -0.7, mid: -0.5, high: -0.3 } })?.mid === 0);

/* ---- 11. keto's water ---- */

ok("keto: the adaptation window is a fortnight", KETO_ADAPTATION_DAYS === 14);
ok("keto: week one is one and a half to two kilos",
  KETO_WEEK_ONE_KG.low === 1.5 && KETO_WEEK_ONE_KG.high === 2.0);
const phase = Array.from({ length: 40 }, (_, d) => ({ day: d, kg: 80 }));
const kept = outsideAdaptation(phase, 5);
ok("keto: the window is excluded from the fit",
  kept.length === 40 - KETO_ADAPTATION_DAYS
  && !kept.some((q) => q.day >= 5 && q.day < 19));
ok("keto: and everything before it is kept",
  kept.filter((q) => q.day < 5).length === 5);

/* ---- 12. the units half the readers use ---- */

const st = toStone(78);
ok("stone: 78kg is 12 st 4 lb", st.st === 12 && Math.round(st.lb) === 4);
ok("stone: written out, never as a decimal",
  stoneLabel(78) === "12 st 4 lb" && !stoneLabel(78).includes("."));
const ft = toFeetInches(180);
ok("feet: 180cm is 5 ft 11 in", ft.ft === 5 && Math.round(ft.inch) === 11);
near("stone: round trips", toStone(80).st * 14 + toStone(80).lb, 80 / 0.45359237, 0.05);

/* ---- 13. the rate table itself ---- */

ok("rates: three of them, in order",
  RATES.length === 3 && RATES.every((r, i) => i === 0 || r.low >= RATES[i - 1].low));
ok("rates: none exceeds the ceiling",
  RATES.every((r) => r.high <= MAX_LOSS_PCT_PER_WEEK));
ok("rates: every one is written in both languages",
  RATES.every((r) => r.en.length > 0 && r.bn.length > 0));

/* ---- 14. changing protocol mid-flight ----

   The case this whole block exists for, and it is a real one
   somebody asked: three days of keto, then two days of a
   complete fast. Every naive tool reads that as 0.8kg a day and
   projects a goal weight inside a month. */

near("glycogen: about 440g at 80kg", glycogenKg(80), 0.44, 0.001);
ok("glycogen: it scales with the body, rather than being a fixed 450g",
  glycogenKg(55) < glycogenKg(110) && Math.abs(glycogenKg(110) - 2 * glycogenKg(55)) < 1e-9,
  "a fixed store is a third too high for a 55kg reader");
ok("glycogen: three grams of water per gram", GLYCOGEN_WATER_RATIO === 3);

ok("drain: a complete fast empties faster than very low carb",
  drained("fast", 1) > drained("keto", 1));
ok("drain: and it is a curve rather than a line",
  drained("keto", 1) > drained("keto", 4) - drained("keto", 3),
  "most of the store goes in the first two days and the tail takes a week");
/* THE TABLE HAS TO BE TOTAL. It held four protocols and the nine
   missing ones were forecast as taking no water off at all, so
   an ordinary deficit's drop came back 100% fat. An absent row
   read as a measured zero. */
ok("drain: an ordinary deficit lowers the store rather than emptying it",
  drained("standard", 30) > 0.4 && drained("standard", 30) < 0.7,
  `${drained("standard", 30).toFixed(2)}: eating less lowers glycogen, it does not clear it`);
ok("drain: and it never reaches as far as very low carb does",
  drained("standard", 30) < drained("keto", 30));
ok("drain: what is not a deficit drains nothing at all",
  drained("maintain", 30) === 0 && drained("gain", 30) === 0
  && drained("break", 30) === 0,
  "a surplus refills the store; it does not empty it");
ok("drain: an ordinary deficit's water follows how much less is eaten",
  drainedBy("standard", 7, 0.1) < drainedBy("standard", 7, 0.3)
  && drainedBy("standard", 7, 0.4) === drained("standard", 7),
  "half the cut cannot take the same water off");
ok("drain: an unknown depth of cut claims no drain at all",
  drainedBy("standard", 30, null) === 0,
  "credited water makes the NEXT drop look realer than it is, which is the flattering way round");
ok("drain: keto and a fast do not scale with the cut, because their water is the carbohydrate",
  drainedBy("keto", 3, 0.05) === drained("keto", 3)
  && drainedBy("fast", 2, null) === drained("fast", 2));
ok("gut: only a complete fast empties it, and over about two days",
  gutTaken("fast", 2, 1) === 1 && gutTaken("fast", 1, 1) === 0.5
  && gutTaken("keto", 7, 1) === 0);
ok("gut: an ordinary deficit lowers it, because there is less food in it",
  gutTaken("standard", 7, 0.4) > 0 && gutTaken("standard", 7, 0.4) < 1);
ok("protocols: every one is written in both languages and named once",
  PROTOCOL_NAMES.length === 13
  && PROTOCOL_NAMES.every((p) => p.en.length > 0 && p.bn.length > 0)
  && new Set(PROTOCOL_NAMES.map((p) => p.id)).size === 13);
ok("protocols: an unknown id does not come back undefined",
  protocolName("keto").bn === "কিটো");

const KETO3 = forecastChange({
  from: null, to: "keto", days: 3, weightKg: 80, burn: 2500, intake: 2000,
});
ok("keto week one: the scale falls further than the fat does",
  KETO3.scale.mid < KETO3.fat,
  `scale ${KETO3.scale.mid.toFixed(2)}, fat ${KETO3.fat.toFixed(2)}`);
near("keto week one: the fat is just the deficit", KETO3.fat, -(500 * 3) / 7700, 1e-9);
ok("keto week one: and barely any of the drop is fat",
  KETO3.fatShare < 0.2,
  `${Math.round(KETO3.fatShare * 100)}% of a three day keto drop being fat would be wrong`);

/* THE STACKING CASE. The second protocol finds the store already
   two thirds empty, so it cannot take that water off twice. */
const FAST2 = forecastChange({
  from: { protocol: "keto", days: 3 }, to: "fast", days: 2,
  weightKg: 80, burn: 2500, intake: 0,
});
const FAST2_FRESH = forecastChange({
  from: null, to: "fast", days: 2, weightKg: 80, burn: 2500, intake: 0,
});
ok("stacking: a fast after three days of keto sheds less water than a fresh one",
  FAST2.water.mid < FAST2_FRESH.water.mid,
  `${FAST2.water.mid.toFixed(2)} against ${FAST2_FRESH.water.mid.toFixed(2)}: `
  + "two water-losing protocols do not take the same water off twice");
near("stacking: but exactly the same fat, because that is the deficit",
  FAST2.fat, FAST2_FRESH.fat, 1e-9);
ok("stacking: a complete fast empties the gut and keto does not",
  FAST2.water.mid > 0.8,
  "two days with nothing going in is a kilogram of food that is simply not there");
ok("fast: a third of the drop is fat, not none of it",
  FAST2.fatShare > 0.25 && FAST2.fatShare < 0.5,
  `${Math.round(FAST2.fatShare * 100)}%`);

const fiveDayScale = KETO3.scale.mid + FAST2.scale.mid;
const fiveDayFat = KETO3.fat + FAST2.fat;
ok("five days of both: the scale says about three and a half kilos",
  fiveDayScale < -3 && fiveDayScale > -4.5, fiveDayScale.toFixed(2));
ok("five days of both: and about a fifth to a quarter of it is fat",
  Math.abs(fiveDayFat / fiveDayScale) > 0.15 && Math.abs(fiveDayFat / fiveDayScale) < 0.35,
  `${Math.round(Math.abs(fiveDayFat / fiveDayScale) * 100)}%: `
  + "a tool that projected from the scale here would promise a goal inside a month");

ok("the rebound is the whole of what was drained, and it comes back",
  FAST2.rebound.mid > 1.5,
  "a reader who eats normally after this watches two to three kilos return in days");
ok("and the rebound is not counted as a gain",
  FAST2.rebound.low > 0 && FAST2.rebound.mid > Math.abs(FAST2.fat),
  "it is larger than everything that was actually lost");

ok("settling: keto is the fortnight section 7 already names",
  settlingDays("keto") === KETO_ADAPTATION_DAYS);
ok("settling: a fast is slower to read than it is to act",
  settlingDays("fast") >= 7);
ok("settling: an ordinary deficit needs none", settlingDays("standard") === 0);

/* ---- and no slope ever crosses a boundary ---- */

const PHASES: Phase[] = [
  { protocol: "keto", startDay: 0 },
  { protocol: "fast", startDay: 3 },
  { protocol: "keto", startDay: 5 },
];
const SPANS = stretches(PHASES, 40);
ok("stretches: one per phase", SPANS.length === 3);
ok("stretches: three days of keto is not readable, it is still settling",
  SPANS[0].readable === false && SPANS[0].why === "settling");
ok("stretches: two days of fasting is not readable either",
  SPANS[1].readable === false);
ok("stretches: and the long stretch after it is, once its window has passed",
  SPANS[2].readable === true && SPANS[2].from === 5 + KETO_ADAPTATION_DAYS,
  JSON.stringify(SPANS[2]));

const RUN: Point[] = Array.from({ length: 41 }, (_, d) => ({ day: d, kg: 80 - d * 0.05 }));
const KEPT = readable(RUN, PHASES, 40);
ok("readable: nothing from inside a settling window is fitted",
  KEPT.every((p) => p.day >= 5 + KETO_ADAPTATION_DAYS),
  `earliest kept is day ${KEPT[0]?.day}`);
ok("readable: and the rest of the run is kept", KEPT.length === 41 - (5 + KETO_ADAPTATION_DAYS));
ok("readable: a run with no readable stretch fits nothing at all",
  readable(RUN, [{ protocol: "fast", startDay: 0 }], 4).length === 0,
  "an empty answer is the honest one; a slope here would be invented");

/* ---- 15. the ordinary deficit, which is what most readers do ----

   The panel printed "of which about 100% is fat" for it, one
   line above a paragraph saying that nothing moving on the first
   day is fat. Neither sentence was written wrongly: the water
   table had four rows and this protocol was not one of them, so
   an absent row was read as a measurement of nothing. */

const B80 = { weightKg: 80, burn: 2500 } as const;
const PLAIN7 = forecastChange({ from: null, to: "standard", days: 7, ...B80, intake: 2000 });
const PLAIN1 = forecastChange({ from: null, to: "standard", days: 1, ...B80, intake: 2000 });

ok("ordinary deficit: most of the first week is not fat",
  PLAIN7.fatShare < 0.5,
  `${Math.round(PLAIN7.fatShare * 100)}% of the first week being fat contradicts the arc on the same page`);
ok("ordinary deficit: and day one is nearly none of it",
  PLAIN1.fatShare < 0.25,
  `${Math.round(PLAIN1.fatShare * 100)}%: "gut contents and sodium" is what the page says beside this`);
ok("ordinary deficit: the scale falls the 1 to 3 kg the plan states",
  -PLAIN7.scale.mid > 1 && -PLAIN7.scale.mid < 3, PLAIN7.scale.mid.toFixed(2));
near("ordinary deficit: and the fat in it is exactly the deficit",
  PLAIN7.fat, -(500 * 7) / KCAL_PER_KG, 1e-9);
ok("DIET.md states the first week this now forecasts",
  PLAN.includes("often 1 to 3 kg, and most of it is not fat"),
  "the arc table in the plan and the water model have drifted");
ok("ordinary deficit: the share holds whatever the depth of the cut",
  Math.abs(PLAIN7.fatShare
    - forecastChange({ from: null, to: "standard", days: 7, ...B80, intake: 1500 }).fatShare) < 0.02,
  "a deeper cut takes proportionally more water with it, so the share is stable");
ok("ordinary deficit: eating at maintenance moves nothing at all",
  forecastChange({ from: null, to: "standard", days: 7, ...B80, intake: 2500 }).water.mid === 0,
  "water follows the cut, so no cut is no water");

/* And the other half of it: refusing, where the model has no
   water term to divide by. */
const GAINING = forecastChange({ from: null, to: "gain", days: 14, ...B80, intake: 2800 });
ok("a gain gets no fat share, because a surplus refills the store this cannot see",
  GAINING.fatShareKnown === false && GAINING.scale.mid > 0);
ok("and every protocol the panel offers does get one",
  (["keto", "fast", "standard"] as Protocol[]).every((p) =>
    forecastChange({ from: null, to: p, days: 3, ...B80, intake: p === "fast" ? 0 : 2000 })
      .fatShareKnown),
  "a protocol a reader can pick and cannot be answered about is a control that does nothing");
ok("nothing moving is not the same as nothing known",
  forecastChange({ from: null, to: "maintain", days: 7, ...B80, intake: 2500 }).fatShareKnown,
  "none of a movement of zero is fat, and that is an answer rather than a refusal");

/* ---- 16. a marked day is drawn and fitted to nothing ---- */

const dayOf = (iso: string): number =>
  Math.round(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)) / 86400000);

const LOGGED: Day[] = [
  { date: "2026-08-03", weightKg: 79.6 },
  { date: "2026-08-01", weightKg: 80.0 },
  { date: "2026-08-02", weightKg: 79.8, marks: ["ill"] },
  { date: "2026-08-04", kcal: 2000 },
];
const WEIGH = weighings({ days: LOGGED, dayOf });
ok("marks: a marked day is drawn", WEIGH.drawn.length === 3);
ok("marks: and is fitted to nothing",
  WEIGH.fittable.length === 2 && !WEIGH.fittable.some((p) => p.kg === 79.8),
  "a fortnight of fever water in the slope is a rate nobody is running");
ok("marks: and is handed back, so a chart can tick it",
  WEIGH.marked.length === 1 && WEIGH.marked[0].kg === 79.8,
  "excluded from the fit is not hidden from the reader");
ok("marks: a day with no weighing on it is neither",
  WEIGH.drawn.length + 1 === LOGGED.length);
ok("marks: and the readings come back in day order whatever order they arrived in",
  WEIGH.drawn.map((p) => p.kg).join() === "80,79.8,79.6");
ok("marks: every mark is written in both languages",
  MARKS.every((m) => m.en.length > 0 && m.bn.length > 0));

const SETTLING: Day[] = Array.from({ length: 20 }, (_, i) => ({
  date: `2026-08-${String(i + 1).padStart(2, "0")}`,
  weightKg: 80 - i * 0.05,
}));
const WITH_PHASE = weighings({
  days: SETTLING,
  dayOf,
  phases: [{ protocol: "keto", startDay: dayOf("2026-08-01") }],
  today: dayOf("2026-08-20"),
});
ok("marks: a settling window is drawn and not fitted, on the same footing",
  WITH_PHASE.drawn.length === 20 && WITH_PHASE.fittable.length < 20
  && WITH_PHASE.fittable.every((p) => p.day >= dayOf("2026-08-01") + KETO_ADAPTATION_DAYS));

/* ---- 17. and the learned maintenance never spans a boundary ----

   The panel got the slope right, with `readable()`, and then
   handed the raw run to the one calculation the plan singles
   out. A window with a complete fast in it is a window whose
   weight change is a step in body water. */

const STACKED: Point[] = Array.from({ length: 46 }, (_, d) => ({
  day: d, kg: 80 - 0.05 * d - (d >= 25 ? 2 : 0),
}));
const STACKED_IN = STACKED.map((p) => ({
  day: p.day, kcal: p.day >= 25 && p.day < 27 ? 0 : 2000,
}));
const STACKED_PH: Phase[] = [
  { protocol: "keto", startDay: 0 },
  { protocol: "fast", startDay: 25 },
  { protocol: "standard", startDay: 27 },
];
const HERE = learnedHere({
  weights: STACKED, intakes: STACKED_IN, phases: STACKED_PH, today: 45,
});
const WHOLE = learnedBurn(STACKED, STACKED_IN);
ok("learned: the window is the stretch the reader is in, not the run",
  HERE?.from === 27 && HERE?.days === 18 && HERE?.protocol === "standard",
  JSON.stringify({ from: HERE?.from, days: HERE?.days }));
near("learned: 2000 a day and 0.35 kg a week off is a burn of 2385",
  (HERE as { kcal: { mid: number } }).kcal.mid, 2385, 1);
ok("learned: the whole run says something else, because two days of it were water",
  (WHOLE as { kcal: { mid: number } }).kcal.mid - (HERE as { kcal: { mid: number } }).kcal.mid > 200,
  `${Math.round((WHOLE as { kcal: { mid: number } }).kcal.mid)} against ${Math.round((HERE as { kcal: { mid: number } }).kcal.mid)}`);
ok("learned: and the run's answer is the flattering one, as usual",
  (WHOLE as { kcal: { mid: number } }).kcal.mid > (HERE as { kcal: { mid: number } }).kcal.mid,
  "a maintenance that is too high sets a target that is too high");
ok("learned: with no phases there is no boundary and the whole run is the window",
  learnedHere({ weights: STACKED, intakes: STACKED_IN, today: 45 })?.protocol === null);
ok("learned: and nothing at all rather than a window that spans the change",
  learnedHere({
    weights: STACKED, intakes: STACKED_IN, today: 26,
    phases: [{ protocol: "keto", startDay: 0 }, { protocol: "fast", startDay: 25 }],
  }) === null,
  "no stretch here is both readable and a fortnight long, and the honest answer is that "
  + "there is not one yet rather than the whole run's");

/* ---- 18. and the band widens when the log is patchy ---- */

const FULL_LOG = learnedBurn(noisy, line.map((q) => ({ day: q.day, kcal: 2000 })));
const PATCHY = learnedBurn(noisy, [
  { day: 3, kcal: 2000 }, { day: 14, kcal: 2000 }, { day: 25, kcal: 2000 },
]);
const widthOf = (l: { kcal: { low: number; high: number } } | null): number =>
  (l ? l.kcal.high - l.kcal.low : NaN);
ok("learned: three logged days in a month is a visibly wider band than a full month",
  widthOf(PATCHY) > 2 * widthOf(FULL_LOG),
  `${Math.round(widthOf(PATCHY))} against ${Math.round(widthOf(FULL_LOG))}: `
  + "the same variance in three identical days measured nothing about the other twenty-six");
near("learned: and the middle is unmoved, because the mean is the same",
  (PATCHY as { kcal: { mid: number } }).kcal.mid,
  (FULL_LOG as { kcal: { mid: number } }).kcal.mid, 1e-9);
ok("learned: the widening is the plan's own under-recording figure",
  UNLOGGED_SE_SHARE >= 0.2 && UNLOGGED_SE_SHARE <= 0.3);
ok("DIET.md states the under-recording that widening is built on",
  PLAN.includes("20 to 30 percent"));

/* ---- 19. what an entry says about when it was eaten ---- */

ok("hour: the clock column first", entryHour({ atTime: "07:30", meal: "breakfast" }) === 7);
ok("hour: and the rows that carry a clock where a meal name goes",
  entryHour({ meal: "19:05" }) === 19,
  "there are real rows in that shape and dropping the fallback empties the by-hour reading");
ok("hour: null rather than noon when the row does not say",
  entryHour({ meal: "lunch" }) === null && entryHour({}) === null,
  "a silent midday puts somebody's breakfast in the middle of the afternoon");
ok("hour: and a clock that is not one is not an hour",
  entryHour({ atTime: "31:00" }) === null && entryHour({ atTime: "7" }) === null);

/* ---- 19b. which meal of the day it was, and a plan for it ----

   `DIET.md` section 13. `diet_entries.meal` has no CHECK
   constraint, so `MEALS` is the only statement of what may be in
   it, and `diet_entries.planned` is the whole of the week's
   plan: the same rows dated ahead, so a plan becomes a log by
   clearing one flag rather than by writing a second row. */

ok("meals: four of them, every hour of the clock inside exactly one",
  MEALS.length === 4
  && [...Array(24).keys()].map((h) => mealAt(h).id)
    .every((id) => MEALS.some((m) => m.id === id)),
  MEALS.map((m) => `${m.id} ${m.from}-${m.to}`).join(", "));
ok("meals: and each one is named in both languages",
  MEALS.every((m) => m.en.trim() !== "" && /[\u0980-\u09FF]/.test(m.bn)));
ok("meals: the late one wraps round midnight rather than ending at it",
  mealAt(22).id === "late" && mealAt(2).id === "late",
  "a window that stops at 23:59 leaves the small hours in no meal at all");
ok("meals: eight in the morning is breakfast, one in the afternoon is lunch",
  mealAt(8).id === "breakfast" && mealAt(13).id === "lunch" && mealAt(19).id === "dinner");

ok("meals: an unknown name is not a meal",
  mealNamed("elevenses") === null && mealNamed(undefined) === null);
ok("meals: the column leads",
  mealOf({ meal: "dinner", atTime: "08:00" })?.id === "dinner",
  "a reader who says which meal it was has said it, whatever the clock reads");
ok("meals: a row carrying a CLOCK where a name goes falls through to the hour",
  mealOf({ meal: "19:05" })?.id === "dinner",
  'those rows are real, and a raw e.meal would group them under a heading reading "19:05"');
ok("meals: and a row that says neither is placed nowhere",
  mealOf({}) === null,
  "putting it under breakfast would be the tool inventing where somebody's dinner went");

const aDay: Entry[] = [
  { date: "2026-08-22", label: "egg", kcal: 80, atTime: "08:10" },
  { date: "2026-08-22", label: "ruti", kcal: 120, atTime: "08:12" },
  { date: "2026-08-22", label: "rice", kcal: 400, meal: "lunch" },
  { date: "2026-08-22", label: "fish", kcal: 300, planned: true, meal: "dinner" },
  { date: "2026-08-22", label: "something", kcal: 50 },
];

const grouped = byMeal(aDay);
ok("byMeal: the planned row is not in what was eaten",
  grouped.every((g) => g.entries.every((e) => !e.planned)));
ok("byMeal: breakfast holds the two logged at eight",
  grouped[0].meal?.id === "breakfast" && grouped[0].entries.length === 2
  && grouped[0].total.kcal === 200);
ok("byMeal: an empty meal is left out rather than drawn as a nought",
  grouped.every((g) => g.entries.length > 0)
  && !grouped.some((g) => g.meal?.id === "late"));
ok("byMeal: and a row nothing can place is its own group at the end",
  grouped[grouped.length - 1].meal === null
  && grouped[grouped.length - 1].entries.length === 1);
ok("byMeal: the planned side is the same grouping over the other flag",
  byMeal(aDay, "planned").length === 1
  && byMeal(aDay, "planned")[0].meal?.id === "dinner");

ok("totals: a day's total still excludes what was only planned",
  totalFor(aDay).kcal === 650);
ok("totals: and the planned side totals only the planned rows",
  totalFor(aDay, "planned").kcal === 300,
  "a plan counted as eaten is the flattering error this tool is arranged against");

const week = planKept([
  ...aDay,
  { date: "2026-08-23", label: "dal", kcal: 200, planned: true },
  { date: "2026-08-24", label: "tea", kcal: 40 },
]);
ok("plan: only days something was planned for appear",
  week.map((d) => d.date).join(",") === "2026-08-22,2026-08-23",
  "a day nobody planned is not a day the plan was broken on");
ok("plan: it reports two figures and no verdict",
  week[0].planned === 300 && week[0].eaten === 650
  && !("kept" in week[0]) && !("score" in week[0]),
  "section 13: the difference is a reading rather than a scolding");
ok("plan: and what is still waiting is a count of rows",
  week[0].left === 1 && week[1].left === 1);

/* A saved meal's parts come out of a `jsonb` column, so every
   field arrives as `unknown`. The band is the one that matters:
   a part can be a plate somebody else cooked, and dropping its
   width would make the day claim a precision it does not have. */
const stored = entriesFrom([
  { label: "kacchi", kcal: 900, estLow: 700, estHigh: 1100, source: "free" },
  { label: "tea", kcal: "not a number", macros: { protein: 1, carbs: "x" } },
  { label: "   ", kcal: 100 },
  "not an object",
  null,
]);
ok("parts: a row with no label is not a row", stored.length === 2);
ok("parts: the band survives the trip",
  stored[0].estLow === 700 && stored[0].estHigh === 1100);
ok("parts: a figure that is not one is absent rather than NaN",
  stored[1].kcal === undefined && stored[1].macros?.carbs === undefined
  && stored[1].macros?.protein === 1);
ok("parts: and nothing carries an id, so a meal logged twice is two entries",
  stored.every((p) => !("id" in p) || p.id === undefined));

/* ---- 20. and the panels use all of it ----

   Every fix above is arithmetic that already existed once. The
   stacking was written, tested and passed `from: null` by the
   one page that could reach it, which is why these four are
   greps rather than sums. */

/* Comments stripped first. Every one of these lines is written
   out in the prose above the code that fixed it, so a grep over
   the whole file would pass on the paragraph describing the bug
   and fail to notice the bug coming back. */
const code = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
const EXPECT = code(readFileSync(
  join(ROOT, "next", "components", "diet", "expect-panel.tsx"), "utf8"));
const TREND = code(readFileSync(
  join(ROOT, "next", "components", "diet", "trend-panel.tsx"), "utf8"));

ok("panel: the forecast is handed what was running before it",
  !/from:\s*null/.test(EXPECT),
  "the stacking arithmetic is the difference between a forecast and an encouragement");
ok("panel: and the fat share is printed only where it is known",
  EXPECT.includes("fatShareKnown"));
ok("panel: the week's total is read off the end of the arc rather than a signed minimum",
  !EXPECT.includes("Math.min(...arc"),
  '"about -5.2 kg down" is a minus sign inside a sentence that already says which way');
ok("panel: and the settling window says the same thing in both languages",
  !EXPECT.includes('|| "no"'),
  "one half read \"no days after it ends\" while the other rendered a nought");
ok("panel: the trend's maintenance is measured inside one stretch",
  TREND.includes("learnedHere") && !TREND.includes("learnedBurn"));
ok("panel: and both panels take their points from the one splitter",
  TREND.includes("weighings(") && EXPECT.includes("weighings("));

/* ---- 21. and no em dash reached the plan ----

   BUILT FROM ITS CODE POINT, NEVER TYPED. The first version of
   these two lines wrote the character out, so a test asserting
   that no em dash exists was itself an em dash in `scripts/`,
   and CI failed on the assertion rather than on what it was
   asserting about. That is the exact failure the top of
   `CLAUDE.md` describes, happening to the thing meant to catch
   it. `scripts/check-dashes.ts` covers the whole tree now; these
   two stay because this file's subject is the plan and the
   module. */
const EM = String.fromCharCode(0x2014);
ok("DIET.md carries no em dash", !PLAN.includes(EM));
ok("shared/diet.ts carries no em dash",
  !readFileSync(join(ROOT, "shared", "diet.ts"), "utf8").includes(EM));

/* ------------------------------------------------------------
   coverage is per nutrient, because one key is not five

   A crowdsourced row may carry sodium and nothing else. Counting
   an entry as covered because `micros` has ANY key took a day
   made of one of those to 100%, and the panel then printed
   "computed from 100% of today's food" above four nutrients
   reading "not known". A confident number missing most of the
   day is the failure this whole file is arranged around, and it
   ran in the flattering direction.
   ------------------------------------------------------------ */

const oneSided = totalFor([
  { date: "2026-08-22", label: "a plate", kcal: 700, micros: { sodium: 900 } },
  { date: "2026-08-22", label: "rice", kcal: 300, micros: { sodium: 3, iron: 1.9 } },
]);

ok("the day's own coverage still counts any composition",
  oneSided.coverage === 1);
ok("sodium is known across the whole day",
  oneSided.microCoverage.sodium === 1);
ok("iron is known across three tenths of it, not all of it",
  Math.abs((oneSided.microCoverage.iron ?? 0) - 0.3) < 1e-9);
ok("a nutrient nothing carries is absent rather than zero",
  !("calcium" in oneSided.microCoverage));

const nothingLogged = totalFor([]);
ok("an empty day divides by no zero",
  nothingLogged.coverage === 0 && Object.keys(nothingLogged.microCoverage).length === 0);

const freeOnly = totalFor([{ date: "2026-08-22", label: "a guess", kcal: 500 }]);
ok("free entry leaves every nutrient uncovered",
  freeOnly.coverage === 0 && Object.keys(freeOnly.microCoverage).length === 0);

/* ---- the keto page's live clock, and the three numbers on it ----

   `next/components/diet/keto-panel.tsx` draws a reader's own
   position on the arc `hourlyArc()` already returns, so what is
   asserted here is what that page says out loud: an 80kg reader
   on keto, at hour 6, at hour 30 and on day 5, against a
   maintenance of 2,500 and 500 under it.

   THE FAT SHARE HAS TO CLIMB. It is the column the whole page
   exists for, and a version that started high would be telling
   somebody their first two days were fat, which is the one thing
   keto's first fortnight is not. */

const clockAt = (hours: number) => forecastChange({
  from: null, to: "keto", days: hours / 24, weightKg: 80, burn: 2500, intake: 2000,
});
const H6 = clockAt(6);
const H30 = clockAt(30);
const D5 = clockAt(120);

near("clock: hour 6 of keto is about a quarter of a kilo", H6.scale.mid, -0.25, 0.03);
near("clock: hour 30 is about a kilo", H30.scale.mid, -1.02, 0.05);
near("clock: day 5 is about two and a fifth", D5.scale.mid, -2.18, 0.06);

ok("clock: a kilo off the scale at hour 30 is under a tenth of a kilo of fat",
  Math.abs(H30.fat) < 0.1 && Math.abs(H30.scale.mid) > 0.7,
  `scale ${H30.scale.mid.toFixed(2)}, fat ${H30.fat.toFixed(3)}`);

ok("clock: and the share of the drop that is fat climbs all week",
  H6.fatShare < H30.fatShare && H30.fatShare < D5.fatShare,
  `${(H6.fatShare * 100).toFixed(0)}%, ${(H30.fatShare * 100).toFixed(0)}%, `
  + `${(D5.fatShare * 100).toFixed(0)}%`);

ok("clock: every one of the three may print that share",
  H6.fatShareKnown && H30.fatShareKnown && D5.fatShareKnown);

ok("clock: nothing the scale showed at hour 6 was mostly fat",
  H6.fatShare < 0.1, `${(H6.fatShare * 100).toFixed(0)}%`);

/* AND THE PAGE IS NOT A SECOND MODEL. The clock calls
   `forecastChange()` at the hour the reader is at; the table on
   the expect page calls `hourlyArc()`. Both have to answer the
   same thing at the same hour or two pages of this tool disagree
   about the same body on the same day. */
const arc6 = hourlyArc(
  { from: null, to: "keto", days: 7, weightKg: 80, burn: 2500, intake: 2000 }, 6,
).find((p) => p.hour === 6);
near("clock: and it agrees with the arc the expect page draws",
  arc6?.scale.mid ?? 0, H6.scale.mid, 1e-9);

/* The bands the clock reads its sentence out of, and the one
   state it has to have words for: past the end of the first week
   there is no band at all, and a page that printed nothing there
   would go blank on day eight. */
ok("clock: hour 6 is in the first band and the next one opens at 24",
  bandAt("keto", 6).now?.from === 0 && bandAt("keto", 6).next?.from === 24);
ok("clock: hour 30 is the band where the bulk of the water goes",
  bandAt("keto", 30).now?.from === 24);
ok("clock: day 5 is the last band of the week and nothing follows it",
  bandAt("keto", 120).now?.from === 120 && bandAt("keto", 120).next === null);
ok("clock: and after the first week there is no band, which the page says in words",
  bandAt("keto", 200).now === null && bandAt("keto", 200).next === null);

/* The adaptation window, which is the other half of the same
   page: five days into a keto phase there is no rate to print,
   and the honest answer is that there is not one yet. */
const started = 100;
const fortnight: Point[] = Array.from({ length: 6 }, (_, i) =>
  ({ day: started + i, kg: 80 - i * 0.3 }));
const ketoPhase: Phase[] = [{ protocol: "keto", startDay: started }];
ok("clock: five days into keto no slope may be fitted at all",
  readable(fortnight, ketoPhase, started + 5).length === 0);
ok("clock: and every one of those weighings is inside the window",
  outsideAdaptation(fortnight, started).length === 0);

/* ---- the keto page's own numbers, against the prose ----

   Section 7 states three amounts and this is the section most
   likely to hurt somebody if it is wrong: the sodium note is
   actively wrong for two groups of people, and the sentence
   saying so has to be beside the numbers rather than in a footer.
   The numbers are read out of DIET.md rather than retyped, for
   the reason the cut-off table above is. */

const KETO_PAGE = readFileSync(
  join(ROOT, "next/components/diet/keto-panel.tsx"), "utf8");
const PAGE = KETO_PAGE.replace(/\s+/g, " ");
const PROSE = PLAN.replace(/\s+/g, " ");

const salts = PROSE.match(
  /Sodium roughly (\d+) to (\d+) g a day, potassium (\d+) to (\d+) g, magnesium (\d+) to (\d+) mg/,
);
ok("DIET.md still states the keto three", !!salts,
  "section 7 is where the page reads them from.");
if (salts) {
  ok(`the keto page states sodium as ${salts[1]} to ${salts[2]} g a day`,
    PAGE.includes(`${salts[1]} to ${salts[2]} g a day`));
  ok(`the keto page states potassium as ${salts[3]} to ${salts[4]} g a day`,
    PAGE.includes(`${salts[3]} to ${salts[4]} g a day`));
  ok(`the keto page states magnesium as ${salts[5]} to ${salts[6]} mg a day`,
    PAGE.includes(`${salts[5]} to ${salts[6]} mg a day`));
}

ok("the keto page warns about blood pressure medicine and kidney disease, beside the numbers",
  /blood pressure/.test(PAGE) && /kidney disease/.test(PAGE),
  "section 7: for those two groups this advice is actively wrong.");
ok("and it carries the medical advice line in both languages",
  PAGE.includes("general education and not medical advice")
  && PAGE.includes("চিকিৎসা পরামর্শ নয়"));
ok("and it names the one interaction that has to be settled before starting",
  /insulin or a sulfonylurea/.test(PAGE) && /BEFORE/.test(PAGE));

/* Every row of that table is said twice or a Bangla reader meets
   a blank where an amount should be. `check-diet.ts` asks this of
   every `<T>`; a table of strings is not a `<T>`. */
const halves = ["en", "bn", "muchEn", "muchBn", "whyEn", "whyBn", "fromEn", "fromBn"]
  .map((k) => (KETO_PAGE.match(new RegExp(`\\b${k}:`, "g")) ?? []).length);
ok("the keto page says all three of them twice over",
  new Set(halves).size === 1 && halves[0] >= 3, halves.join(", "));

const carbs = PROSE.match(/Net carbs typically under (\d+) to (\d+) g/);
ok("DIET.md still states the net carb range", !!carbs);
if (carbs) {
  ok(`the keto page draws both marks, ${carbs[1]} g and ${carbs[2]} g`,
    PAGE.includes(`const TIGHT = ${carbs[1]};`)
    && PAGE.includes(`const LOOSE = ${carbs[2]};`),
    "Section 7 calls the limit individual, so the page draws both rather than"
    + " inventing one.");
}

const meter = PROSE.match(/blood ketone log, ([\d.]+) to ([\d.]+) mmol/);
ok("DIET.md still states what a blood meter reads", !!meter);
if (meter) {
  ok(`the keto page states ${meter[1]} to ${meter[2]} mmol/L`,
    PAGE.includes(`const KETONE_LOW = ${meter[1]};`)
    && PAGE.includes(`const KETONE_HIGH = ${meter[2]};`));
}

ok("the keto page says a ketone level is not how fast fat is going, where the field is",
  /says nothing at all about how fast fat is being lost/.test(PAGE),
  "Section 7: not a score, and said where the field is rather than in a help"
  + " article.");
ok("and it says urine strips stop being reliable rather than letting somebody chase a colour",
  /Urine strips get unreliable after adaptation/.test(PAGE));

/* ------------------------------------------------------------
   a stall is three weeks, not a Tuesday

   The dangerous mistake here is the FALSE POSITIVE. A reader who
   is told they have stalled and has not is the commonest reason
   people stop, so most of these assert that nothing is reported.
   ------------------------------------------------------------ */

const TODAY = 1000;
/** A run of weighings, one every other day, at a given rate. */
const run = (kgStart: number, perWeek: number, noise = 0) =>
  Array.from({ length: 11 }, (_, i) => {
    const day = TODAY - STALL_DAYS + i * 2;
    return {
      day,
      kg: kgStart + (perWeek / 7) * (i * 2) + (noise ? (i % 2 ? noise : -noise) : 0),
    };
  });
const fed = (kcal: number, from = TODAY - STALL_DAYS) =>
  Array.from({ length: 18 }, (_, i) => ({ day: from + i, kcal }));

ok("a moving trend is not a stall, however slow",
  stall({ weights: run(80, -0.25), intakes: fed(1800), today: TODAY }) === null);

ok("a flat trend with nothing logged is not a stall, it is three weeks nobody wrote down",
  stall({ weights: run(80, 0, 0.2), intakes: [], today: TODAY }) === null);

ok("and half a window of logging is the floor",
  stall({
    weights: run(80, 0, 0.2),
    intakes: fed(1800).slice(0, 8),
    today: TODAY,
  }) === null);

ok("a fortnight is not three weeks",
  stall({
    weights: run(80, 0, 0.2).filter((p) => p.day > TODAY - 14),
    intakes: fed(1800),
    today: TODAY,
  }) === null);

const flatRun = stall({ weights: run(80, 0, 0.2), intakes: fed(1800), today: TODAY });
ok("three flat weeks with the deficit logged IS a stall", flatRun !== null);
ok("and its rate spans zero, which is what flat means",
  flatRun !== null && flatRun.rate.low <= 0 && flatRun.rate.high >= 0);

/* The one kind the tool can settle on its own. */
const recomp = stall({
  weights: run(80, 0, 0.2),
  intakes: fed(1800),
  waists: [{ day: TODAY - STALL_DAYS, cm: 92 }, { day: TODAY, cm: 90.5 }],
  today: TODAY,
});
ok("a waist falling through a flat trend is recomposition, not a stall",
  recomp?.kind === "recomposition");

const drifted = stall({
  weights: run(80, 0, 0.2),
  intakes: fed(1800),
  today: TODAY,
  burnThen: 2500,
  burnNow: 2280,
});
ok("a learned burn that has fallen is the target having drifted",
  drifted?.kind === "target-drifted");

const logDrift = stall({ weights: run(80, 0, 0.2), intakes: fed(1800), today: TODAY });
ok("an intake that has not moved on paper is the log having drifted",
  logDrift?.kind === "log-drifted");

ok("water is always offered, because a whoosh looks like a stall until day ten",
  logDrift !== null && logDrift.also.includes("water"));

/* Section 4: a tool that always has an answer is making some of
   them up. */
const hard = stall({
  weights: run(80, 0, 0.2),
  intakes: [...fed(1600, TODAY - STALL_DAYS).slice(0, 9),
    ...fed(2000, TODAY - 9).slice(0, 9)],
  today: TODAY,
});
ok("and where nothing fits, the honest answer is that this is a hard part",
  hard?.kind === "hard-part");

/* ------------------------------------------------------------
   the body has a calendar

   The costly mistake here is reporting a stall in the second
   half of a cycle. It arrives on a schedule, it arrives for half
   the population, and the drop that disproves it arrives a few
   days after the reader has already quit.
   ------------------------------------------------------------ */

ok("no start date is nothing to say",
  cyclePlace({ day: 100 }) === null);
ok("and a length outside 21 to 35 is refused rather than drawn",
  cyclePlace({ day: 100, startDay: 90, length: 60 }) === null);
ok("a day before the start is nothing to say",
  cyclePlace({ day: 80, startDay: 90 }) === null);

ok("day zero is the start",
  cyclePlace({ day: 90, startDay: 90 })?.day === 0);
ok("and it wraps at the length",
  cyclePlace({ day: 90 + 28, startDay: 90 })?.day === 0);
ok("the first half is follicular",
  cyclePlace({ day: 95, startDay: 90 })?.phase === "follicular");
ok("and the last fourteen days are luteal",
  cyclePlace({ day: 90 + 28 - LUTEAL_DAYS, startDay: 90 })?.phase === "luteal"
  && cyclePlace({ day: 90 + 27, startDay: 90 })?.phase === "luteal");
ok("on a 35 day cycle the luteal phase is still the last fourteen",
  cyclePlace({ day: 90 + 20, startDay: 90, length: 35 })?.phase === "follicular"
  && cyclePlace({ day: 90 + 21, startDay: 90, length: 35 })?.phase === "luteal");

/* The whole reason any of this exists. */
ok("a flat trend inside the luteal phase is NOT reported as a stall",
  stall({
    weights: run(80, 0, 0.2),
    intakes: fed(1800),
    today: TODAY,
    cycle: cyclePlace({ day: TODAY, startDay: TODAY - 20 }),
  }) === null);

ok("and the same three weeks outside it still are",
  stall({
    weights: run(80, 0, 0.2),
    intakes: fed(1800),
    today: TODAY,
    cycle: cyclePlace({ day: TODAY, startDay: TODAY - 3 }),
  }) !== null);

/* Cycle to cycle is the comparison that removes the artefact. */
const cyc = (kgStart: number, perCycle: number, cycles: number) =>
  Array.from({ length: cycles * 7 }, (_, i) => {
    const day = 900 + Math.floor(i / 7) * 28 + (i % 7) * 4;
    return { day, kg: kgStart + perCycle * Math.floor(i / 7) + (i % 2 ? 0.6 : -0.6) };
  });

ok("one cycle is not a comparison",
  cycleOverCycle({ weights: cyc(80, -1, 1), startDay: 900, today: 990 }) === null);

const over = cycleOverCycle({ weights: cyc(80, -1, 3), startDay: 900, today: 990 });
ok("three cycles give a rate per cycle", over?.cycles === 3);
ok("and the water cancels, because both sides of the subtraction hold it",
  over !== null && Math.abs(over.kgPerCycle - -1) < 0.2);

/* ------------------------------------------------------------
   the oil nobody measures

   Section 14: across a week of home cooking this is frequently
   the single largest unlogged item in the entire diet. The band
   is wide on purpose, and a narrow figure here would be the
   flattering-direction error in reverse.
   ------------------------------------------------------------ */

ok("a missing answer is nothing to say",
  oilPerMeal({ mlWeek: 750, people: 4 }) === null);
ok("and a zero is not an answer either",
  oilPerMeal({ mlWeek: 750, people: 0, meals: 21 }) === null);
ok("a household getting through five litres a week is a typo or a restaurant",
  oilPerMeal({ mlWeek: 6000, people: 4, meals: 21 }) === null);

/* The plan's own worked example: 750 ml, four people, twenty-one
   meals, about 160 kcal of oil per meal. */
const oil = oilPerMeal({ mlWeek: 750, people: 4, meals: 21 });
ok("750 ml across four people and twenty-one meals is about 8.9 ml a meal",
  oil !== null && Math.abs(oil.mlPerMeal - 8.93) < 0.05);
ok("which is about 74 kcal, and the plan's 160 was for a smaller household",
  oil !== null && Math.abs(oil.kcal.mid - 74) < 2);
ok("the band is plus or minus a third, because a household does not divide oil evenly",
  oil !== null && Math.abs(oil.kcal.high - oil.kcal.mid * (4 / 3)) < 0.5);
ok("and it never reads as zero, which is the number it replaces",
  oil !== null && oil.kcal.low > 0);

/* Two tablespoons is about 30 ml, which the plan puts at 240
   kcal: this constant has to agree with that. */
ok("two tablespoons of oil is about 240 kcal, as section 14 says",
  Math.abs(30 * OIL_KCAL_PER_ML - 249) < 12);

/* ------------------------------------------------------------
   the calendar, which changes what a flat month means

   Section 18. None of this is arithmetic and all of it decides
   what the arithmetic MEANS, so the failure mode is a page that
   draws a fast in the wrong fortnight or calls a British
   December an emergency. Both look completely normal.
   ------------------------------------------------------------ */

const on = (date: string, place: "bd" | "uk"): SeasonId[] =>
  seasonsOn({ date, place }).map((s) => s.season.id);

ok("most of the year is no season at all, and that is the ordinary answer",
  on("2026-08-05", "uk").length === 0);

/* Ramadan 2026 runs 18 February to 19 March, give or take the
   sighting. Inside, on the edges, and outside. */
ok("Ramadan is on in the middle of it", on("2026-03-05", "bd").includes("ramadan"));
ok("and on its first day", on("2026-02-18", "bd").includes("ramadan"));
ok("and on its last", on("2026-03-19", "bd").includes("ramadan"));
ok("and not the day before it starts", !on("2026-02-17", "bd").includes("ramadan"));
ok("and not the day after it ends", !on("2026-03-20", "bd").includes("ramadan"));

/* A FAST IS KEPT IN LONDON TOO. The seasons split by place and
   this is the one that must not: a Bangladeshi reader in the UK
   is the reader this whole tool was written for. */
ok("Ramadan is drawn in the UK as well as in Bangladesh",
  on("2026-03-05", "uk").includes("ramadan"));
ok("but the monsoon is not", !on("2026-07-04", "uk").includes("monsoon"));
ok("and a British winter is not drawn in Dhaka",
  !on("2025-12-25", "bd").includes("winter"));

/* THE WRAP. Two of the fixed seasons cross the new year, and a
   range whose end sorts before its start is the whole of what
   says so. Getting this wrong hides Christmas on 1 January and
   the British winter for the whole of January and February. */
ok("Christmas is on, on Christmas Day", on("2025-12-25", "uk").includes("christmas"));
ok("and still on, on New Year's Day", on("2026-01-01", "uk").includes("christmas"));
ok("and off on the third of January", !on("2026-01-03", "uk").includes("christmas"));
ok("the British winter runs through January",
  on("2026-01-20", "uk").includes("winter"));
ok("and through February", on("2026-02-20", "uk").includes("winter"));
ok("and is off in March", !on("2026-03-20", "uk").includes("winter"));

/* Two at once is normal and the shape has to allow it. */
const yule = on("2025-12-25", "uk");
ok("Christmas falls inside the British winter, so both are on",
  yule.includes("winter") && yule.includes("christmas"));
ok("and Pohela Boishakh falls inside the summer heat",
  on("2026-04-14", "bd").includes("heat") && on("2026-04-14", "bd").includes("boishakh"));

/* The day count is what a page prints, and off-by-one here
   reads as a fast that started yesterday. */
const ramadanNow = seasonsOn({ date: "2026-02-18", place: "bd" })
  .find((s) => s.season.id === "ramadan");
ok("the first day of a season is day one, not day zero", ramadanNow?.day === 1);
ok("and Ramadan 2026 is thirty days long", ramadanNow?.of === 30);

/* THE TABLE RUNS OUT, AND THAT IS THE DESIGN. A lunar date
   cannot be computed here and extrapolating one would put a
   fast a fortnight out within a few years. */
ok("past the end of the table there is no Ramadan rather than a guessed one",
  !on("2031-03-01", "bd").includes("ramadan"));
ok("and the page can find out how far the table goes",
  calendarKnownTo("ramadan") === "2030-02-03");
ok("with no id it is the earliest of them, because 'known to' has to mean all",
  calendarKnownTo() === "2028-09-28");
ok("a fixed season still answers past the moving table",
  on("2031-07-04", "bd").includes("monsoon"));

/* The two fields that reach code. */
ok("a monsoon month is quiet, so a flat trend inside it is not a stall",
  quietSeason({ date: "2026-07-04", place: "bd" })?.id === "monsoon");
ok("and the summer heat is not, because appetite falling is a fall and not a flat",
  quietSeason({ date: "2026-05-01", place: "bd" }) === null);
ok("Ramadan is the one that moves the eating window",
  shiftedSeason({ date: "2026-03-05", place: "uk" })?.id === "ramadan");
ok("and nothing else is, because nothing else changes when a day is eaten",
  SEASONS.filter((s) => s.shifted).length === 1);

/* A quiet season suppresses a stall exactly as the luteal phase
   does, and for the same reason: it arrives on a schedule. */
const flatMonsoon: Point[] = Array.from({ length: 21 }, (_, i) => ({ day: i, kg: 80 + (i % 2) * 0.1 }));
const ateMonsoon = Array.from({ length: 21 }, (_, i) => ({ day: i, kcal: 2000 }));
ok("three flat weeks with a full log is a stall in an ordinary month",
  stall({ weights: flatMonsoon, intakes: ateMonsoon, today: 20 }) !== null);
ok("and the same three weeks inside a monsoon is not",
  stall({
    weights: flatMonsoon, intakes: ateMonsoon, today: 20,
    season: quietSeason({ date: "2026-07-04", place: "bd" }),
  }) === null);
ok("but a season that is not quiet does not suppress it",
  stall({
    weights: flatMonsoon, intakes: ateMonsoon, today: 20,
    season: seasonById("boishakh"),
  }) !== null);

/* Copy, not decoration: a season with no sentence in one of the
   two languages is a card that renders half empty. */
for (const s of SEASONS) {
  ok(`${s.id} has a name and a sentence in both languages`,
    !!s.en && !!s.bn && s.readEn.length > 20 && s.readBn.length > 20);
  ok(`${s.id} is drawn somewhere`, s.where.length > 0);
  ok(`${s.id} can be looked up by its own id`, seasonById(s.id)?.id === s.id);
}
ok("an id nothing declares is null rather than a throw",
  seasonById("harvest" as SeasonId) === null);

/* ---- 22. holding, which is the phase every diet ends in ----

   `DIET.md` section 6. The rule that is easiest to break here is
   the FIRST row of the table, because it asks for nothing to
   happen: a band that speaks while the trend is inside it looks
   like a working feature and is the failure. Every row is
   asserted from the wrong side.

   A reader here logs a weight three times a week and nothing
   else, so every case below is built at that density. A watch
   that needs daily rows is a watch that has quietly moved the
   floor section 6 sets. */

const BAND: MaintenanceBand = { lowKg: 71.3, highKg: 73.5 };

/** Three weighings a week, which is section 6's stated floor. */
const thrice = (upTo: number, kg: (day: number) => number): Point[] => {
  const out: Point[] = [];
  for (let d = 0; d <= upTo; d += 1) {
    if (d % 7 === 0 || d % 7 === 2 || d % 7 === 4) out.push({ day: d, kg: kg(d) });
  }
  return out;
};

ok("band: the suggested width is section 6's two to three kilos",
  bandWidth(55) >= BAND_MIN_KG && bandWidth(130) <= BAND_MAX_KG
  && BAND_MIN_KG === 2 && BAND_MAX_KG === 3);
ok("band: and it is wider for a bigger person, because the noise is",
  bandWidth(110) > bandWidth(60),
  "an ordinary day's swing is a smaller share of a heavier body");
ok("band: DIET.md says the same two to three",
  /two to three kilos wide/.test(PLAN));

const suggested = suggestBand(72.4);
near("band: a suggestion is centred on where the reader is",
  (suggested.lowKg + suggested.highKg) / 2, 72.4, 0.06);
ok("band: and is rounded to the tenth the column stores",
  [suggested.lowKg, suggested.highKg]
    .every((kg) => Math.abs(kg * 10 - Math.round(kg * 10)) < 1e-9),
  "band_low_kg is numeric(5,1), so a suggestion with more digits is not what gets saved");

/* ROW ONE, AND IT IS THE ONE THAT MATTERS. Inside the band the
   tool says nothing: no message, no colour, no offer. */
const holding = bandWatch({
  band: BAND, weights: thrice(90, (d) => 72.4 + Math.sin(d) * 0.4), today: 90,
});
ok("band: inside it, the tool says nothing at all",
  holding?.where === "inside" && holding.say === "nothing" && holding.offer === null,
  "row one of section 6's table is the whole point of the phase");
ok("band: and it is reading the trend rather than a reading",
  bandWatch({
    band: BAND,
    weights: [...thrice(88, () => 72.4), { day: 90, kg: 75.9 }],
    today: 90,
  })?.where === "inside",
  "one salty Tuesday is not two weeks outside a band");

/* ROW TWO. Two weeks outside, and not before. */
const outUnderTwoWeeks = bandWatch({
  band: BAND, weights: thrice(90, (d) => 72.4 + Math.max(d - 62, 0) * 0.12), today: 90,
});
ok("band: outside, but not for two weeks yet, is still nothing",
  outUnderTwoWeeks?.where === "above" && outUnderTwoWeeks.say === "nothing"
  && outUnderTwoWeeks.daysOut < BAND_OUT_DAYS);

const creeping = bandWatch({
  band: BAND, weights: thrice(90, (d) => 72.4 + d * 0.024), today: 90,
});
ok("band: two weeks outside is one line and nothing more",
  creeping?.where === "above" && creeping.say === "line" && creeping.offer === null,
  "row two offers no phase: it states a fact and puts the burn beside it");
ok("band: and it is two weeks, not a fortnight of readings",
  BAND_OUT_DAYS === 14 && (creeping?.daysOut ?? 0) >= BAND_OUT_DAYS,
  "at three weighings a week a count of rows would ask for over a month");

/* ROW THREE. A full band's width outside, and the offer is the
   gentlest rate in the table, in the direction that brings the
   trend back. */
const wayOut = bandWatch({
  band: BAND, weights: thrice(120, (d) => 72.4 + d * 0.06), today: 120,
});
ok("band: further out than the band is wide offers a phase",
  wayOut?.say === "offer" && wayOut.outByKg > wayOut.widthKg);
ok("band: and the phase offered is the lowest rate in the table",
  wayOut?.offer?.ratePct === LOWEST_RATE_PCT && LOWEST_RATE_PCT === 0.25
  && LOWEST_RATE_PCT === Math.min(...RATES.map((r) => r.low)),
  "section 6 says the lowest, and RATES is where that number lives");
ok("band: above the band, the phase offered loses",
  wayOut?.offer?.kind === "lose");

const wayUnder = bandWatch({
  band: BAND, weights: thrice(120, (d) => 72.4 - d * 0.06), today: 120,
});
ok("band: and below it, the phase offered GAINS",
  wayUnder?.where === "below" && wayUnder.offer?.kind === "gain"
  && wayUnder.offer.ratePct === LOWEST_RATE_PCT,
  "a band can be left downwards, and offering a deficit there would be the tool"
  + " reading its own table one way only");

/* Null is the ordinary answer, and every reason for it is
   honest rather than a failure. */
ok("band: no weighings at all is null, not a verdict",
  bandWatch({ band: BAND, weights: [], today: 90 }) === null);
ok("band: a band of zero width is null rather than always outside",
  bandWatch({
    band: { lowKg: 72, highKg: 72 }, weights: thrice(90, () => 72.4), today: 90,
  }) === null);
ok("band: and a trend nobody has fed for three weeks says nothing",
  bandWatch({
    band: BAND, weights: thrice(120, (d) => 72.4 + d * 0.06), today: 120 + STALL_DAYS + 1,
  }) === null,
  "offering a deficit off a month-old reading is inventing a problem out of"
  + " missing data, which is the same rule stall() already follows");

/* ---- 23. gaining, which is the engine run backwards ----

   Section 6. Two things are asserted from the wrong side: the
   ceiling, because a surplus that quietly grows on a heavy
   reader is the bulk this section refuses by name, and week
   one, because it lies in this direction too and the reader who
   is not told reads a refilled store as fat. */

ok("gain: the rate ceiling is half a percent and DIET.md says so",
  MAX_GAIN_PCT_PER_WEEK === 0.5
  && /0\.25 to 0\.5% of bodyweight per week/.test(PLAN));
ok("gain: only the gentle rate is offerable while gaining",
  RATES.filter((r) => r.high <= MAX_GAIN_PCT_PER_WEEK).length === 1);
ok("gain: DIET.md states the surplus ceiling this file uses",
  PLAN.includes(`above roughly ${MAX_SURPLUS_KCAL} kcal`));

/* THE RATE IS A PROXY AND STOPS BEING ONE ON A LARGE READER.
   Half a percent of 130kg is 715 kcal a day, which is the
   thousand-calorie bulk section 6 refuses. */
const big: Body = { ...MAN, weightKg: 130 };
const bulk = target({
  body: big, maintenance: 3000, restingKcal: 2100, kind: "gain", ratePct: 0.5,
});
ok("gain: the surplus is capped in kilocalories, not only as a rate",
  bulk.offset === MAX_SURPLUS_KCAL && bulk.floors.includes("surplus"),
  "a percentage of bodyweight drifts above 500 kcal past about 100kg");
ok("gain: and the delivered rate is reported after the cap, not before",
  bulk.ratePct < 0.5 && bulk.ratePct > 0,
  "a silent clamp is a lie of omission on the way up as well as down");
const modest = target({ ...base, kind: "gain", ratePct: 0.5 });
ok("gain: a surplus under the ceiling is untouched",
  modest.floors.length === 0 && modest.offset < MAX_SURPLUS_KCAL);

/* WEEK ONE LIES IN THIS DIRECTION TOO. An 80kg reader on a
   330 kcal surplus: about 0.3kg of tissue and a kilo or so of
   refilled glycogen, its water and a fuller gut. */
const wk1 = gainWeekOne({ weightKg: 80, burn: 2500, intake: 2830 });
near("gain: the surplus alone is the tissue, and nothing else is",
  wk1.tissue, (330 * 7) / KCAL_PER_KG, 0.001);
ok("gain: week one puts one to two kilos on the scale",
  wk1.scale.low >= 1 && wk1.scale.low <= 2 && wk1.scale.high >= 1.5,
  "section 6 states one to two kilos in a week containing no new tissue");
ok("gain: DIET.md states the same one to two kilos",
  /one to two\s+kilos on the scale in a week/.test(PLAN),
  "the plan wraps that sentence, so the whitespace is the flexible part");
ok("gain: and most of that week is not new tissue",
  wk1.refillShare > 0.6 && wk1.refillShare < 1,
  "a reader who reads a refilled store as fat quits in week two");
ok("gain: the scale band is the tissue plus the refill band, both ends",
  Math.abs(wk1.scale.low - (wk1.tissue + wk1.refill.low)) < 1e-9
  && Math.abs(wk1.scale.high - (wk1.tissue + wk1.refill.high)) < 1e-9);

const offKeto = gainWeekOne({
  weightKg: 80, burn: 2500, intake: 2830, from: { protocol: "keto", days: 30 },
});
ok("gain: arriving off keto puts back more than arriving off ordinary eating",
  offKeto.refill.mid > wk1.refill.mid,
  "an empty store has more to refill, which is section 7 read the other way up");
ok("gain: and none of that extra is counted as tissue",
  Math.abs(offKeto.tissue - wk1.tissue) < 1e-9);

const bigger = gainWeekOne({ weightKg: 80, burn: 2500, intake: 3000 });
ok("gain: a larger surplus is more tissue",
  bigger.tissue > wk1.tissue);
ok("gain: day nought is nothing at all, rather than a week's worth",
  gainWeekOne({ weightKg: 80, burn: 2500, intake: 2830, days: 0 }).scale.mid === 0);
ok("gain: eating at maintenance is not a gain",
  gainWeekOne({ weightKg: 80, burn: 2500, intake: 2500 }).tissue === 0);
ok("gain: the refill share is never the whole of it and never nothing",
  [wk1, offKeto, bigger].every((g) => g.refillShare > 0 && g.refillShare <= 1));

/* And the water table still refuses to answer this question,
   which is why `gainWeekOne` exists at all. */
ok("gain: forecastChange still declines to split a surplus on its own",
  forecastChange({
    from: null, to: "gain", days: 7, weightKg: 80, burn: 2500, intake: 2830,
  }).fatShareKnown === false,
  "WATER.gain is zeros on purpose: calling a rise 100% fat is a claim about"
  + " the one thing that model cannot see");

/* ------------------------------------------------------------
   the fourth stall: walking less

   Section 19. The moving nobody plans is the largest variable in
   what anybody burns and it falls quietly during a deficit, so a
   flat three weeks with an unchanged log is reported as the log
   drifting, which is the tool accusing somebody of creeping
   portions when what happened is that they stopped walking.

   BOTH TESTS OR NEITHER, and that is what these assert. A fifth
   off 2,000 steps is 400 steps and about ten kilocalories, which
   is not a stall; a thousand off 20,000 is not a change of habit
   either.
   ------------------------------------------------------------ */

const flatWeights: Point[] = Array.from({ length: 21 }, (_, i) => ({ day: i, kg: 82 + (i % 2) * 0.1 }));
const steadyIntake = Array.from({ length: 21 }, (_, i) => ({ day: i, kcal: 2100 }));
const stalledWith = (extra: Record<string, number | undefined>) =>
  stall({ weights: flatWeights, intakes: steadyIntake, today: 20, ...extra });

ok("8,000 steps down to 4,500 is a fall in walking, not a log that drifted",
  stalledWith({ stepsThen: 8000, stepsNow: 4500 })?.kind === "moved-less");
ok("and the page gets both medians, because the sentence names both",
  stalledWith({ stepsThen: 8000, stepsNow: 4500 })?.stepsThen === 8000
  && stalledWith({ stepsThen: 8000, stepsNow: 4500 })?.stepsNow === 4500);

ok("a fifth off two thousand steps is four hundred steps and is not a stall",
  stalledWith({ stepsThen: 2000, stepsNow: 1600 })?.kind !== "moved-less");
ok("and a thousand off twenty thousand is not a change of habit either",
  stalledWith({ stepsThen: 20000, stepsNow: 19000 })?.kind !== "moved-less");

ok("walking MORE is never this kind",
  stalledWith({ stepsThen: 4500, stepsNow: 8000 })?.kind !== "moved-less");
ok("and a reader who logs no steps at all gets silence rather than a fall",
  stalledWith({})?.kind !== "moved-less");
ok("one half of the pair is not a comparison",
  stalledWith({ stepsThen: 8000 })?.kind !== "moved-less");

/* THE ORDER IS THE ORDER OF CONFIDENCE. A waist falling is
   measured on the reader; a fall in walking is measured off the
   log; a drifted target is a burn this tool inferred. */
ok("a falling waist still wins, because it is the one the tool can settle",
  stall({
    weights: flatWeights, intakes: steadyIntake, today: 20,
    waists: [{ day: 0, cm: 92 }, { day: 20, cm: 89 }],
    stepsThen: 8000, stepsNow: 4500,
  })?.kind === "recomposition");
ok("but the fall in walking is still offered underneath it",
  stall({
    weights: flatWeights, intakes: steadyIntake, today: 20,
    waists: [{ day: 0, cm: 92 }, { day: 20, cm: 89 }],
    stepsThen: 8000, stepsNow: 4500,
  })?.also.includes("moved-less") === true);
ok("and it beats a drifted target, which is inferred rather than counted",
  stalledWith({ stepsThen: 8000, stepsNow: 4500, burnThen: 2600, burnNow: 2400 })?.kind === "moved-less");

/* One centimetre, said once. */
ok("the tape's resolution is one constant rather than two that can disagree",
  TAPE_RESOLUTION_CM === 1);

/* ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\ndiet: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`diet: ${passed} checks passed`);
