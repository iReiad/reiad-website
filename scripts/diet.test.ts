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
  bmi, bmiBand, whtr, whtrBand, navyFat, deurenbergFat, fatEstimate,
  ffmi, ffmiNormalised, mifflin, katch, restingBurn, estimatedBurn,
  activityFactor, trend, fit, slopePerWeek, learnedBurn, target,
  proteinFloor, projection, outsideAdaptation, floorKcal,
  toStone, stoneLabel, toFeetInches,
  type Body, type Point,
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

/* ---- 14. and no em dash reached the plan ---- */

ok("DIET.md carries no em dash", !PLAN.includes("—"));
ok("shared/diet.ts carries no em dash",
  !readFileSync(join(ROOT, "shared", "diet.ts"), "utf8").includes("—"));

/* ------------------------------------------------------------ */

if (failures.length) {
  console.error(`\ndiet: ${failures.length} of ${passed + failures.length} failed\n`);
  failures.forEach((line) => console.error(`  x ${line}`));
  process.exit(1);
}
console.log(`diet: ${passed} checks passed`);
