#!/usr/bin/env node
/* ============================================================
   dissertation.test.ts, checks on the statistics engine.

       node aab/portfolio/dissertation.test.ts

   The engine on the dissertation case-study page does real
   inference: Welch t-tests, and power calculations through the
   noncentral t distribution. Those are easy to get subtly wrong
   and impossible to eyeball, so every routine is checked here
   against a value some other authority already agrees on,
   textbook t-tables, Cohen's sample-size tables, and the
   arithmetic identities the functions have to satisfy.

   None of these tests check a function against itself.
   ============================================================ */

import {
  lgamma, incBeta, normCdf, tCdf, tTwoTail, tQuantile, nctCdf,
  welch, power, minDetectable, rebase, underwater, maxDrawdown,
  boxStats, quantileSorted, rebin, cagrMonthly, volMonthly, monthKey,
} from "./dissertation.model.js";

import {
  UKX, MIGB, DD_CONVENTIONAL, DD_ISLAMIC, FUND_SD,
  EXCESS_HIST, EXCESS_STATS, SAMPLE, UNIVARIATE, REGRESSIONS, MDD, IVOL,
} from "./dissertation.data.js";

let pass = 0;
const failures: string[] = [];

const ok = (name: string, cond: boolean): void => {
  if (cond) pass++; else failures.push(name);
};
const close = (name: string, got: number, want: number, tol: number): void =>
  ok(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);

/* ---------- 1 · gamma and beta ---------- */
close("lgamma(1) = 0", lgamma(1), 0, 1e-12);
close("lgamma(5) = ln 24", lgamma(5), Math.log(24), 1e-10);
close("lgamma(0.5) = ln √π", lgamma(0.5), Math.log(Math.sqrt(Math.PI)), 1e-10);
close("incBeta(0.5, 1, 1) = 0.5", incBeta(0.5, 1, 1), 0.5, 1e-12);
close("incBeta(0.5, 2, 2) = 0.5", incBeta(0.5, 2, 2), 0.5, 1e-12);
close("incBeta(0.25, 2, 3), closed form", incBeta(0.25, 2, 3),
  1 - (1 - 0.25) ** 3 * (1 + 3 * 0.25), 1e-12);

/* ---------- 2 · the normal ---------- */
close("Φ(0) = 0.5", normCdf(0), 0.5, 1e-12);
close("Φ(1.959964) = 0.975", normCdf(1.959963985), 0.975, 1e-9);
close("Φ(-2.326348) = 0.01", normCdf(-2.326347874), 0.01, 1e-9);
close("Φ(3) = 0.99865", normCdf(3), 0.998650102, 1e-9);

/* ---------- 3 · Student's t, against printed tables ---------- */
close("t CDF(0, df=5) = 0.5", tCdf(0, 5), 0.5, 1e-12);
close("t₀.₉₇₅(1) = 12.706", tQuantile(0.975, 1), 12.7062047, 1e-5);
close("t₀.₉₇₅(10) = 2.228", tQuantile(0.975, 10), 2.2281389, 1e-6);
close("t₀.₉₇₅(30) = 2.042", tQuantile(0.975, 30), 2.0422725, 1e-6);
close("t₀.₉₉₅(20) = 2.845", tQuantile(0.995, 20), 2.8453398, 1e-6);
close("t₀.₉₅(2) = 2.920", tQuantile(0.95, 2), 2.9199856, 1e-6);
close("large df → normal", tQuantile(0.975, 5_000_000), 1.959964, 1e-4);
close("two-tail p at t=2.228, df=10", tTwoTail(2.2281389, 10), 0.05, 1e-7);
ok("t CDF is monotone", tCdf(1, 8) > tCdf(0.5, 8) && tCdf(0.5, 8) > tCdf(0, 8));

/* ---------- 4 · the noncentral t ----------
   With δ = 0 it must collapse to the central t, and its own
   symmetry identity must hold. Then the real check: Cohen's
   classic sample sizes for 80% power. */
close("nct(δ=0) = central t", nctCdf(1.5, 12, 0), tCdf(1.5, 12), 1e-10);
close("nct(δ=0) = central t, negative", nctCdf(-2.1, 7, 0), tCdf(-2.1, 7), 1e-10);
close("nct symmetry", nctCdf(1.3, 9, 0.8), 1 - nctCdf(-1.3, 9, -0.8), 1e-12);
ok("nct shifts right with δ", nctCdf(2, 20, 1) < nctCdf(2, 20, 0));

/* Cohen (1988): for a two-sided test at α = .05 and 80% power you
   need about 64 per group at d = 0.5, 26 at d = 0.8, 394 at d = 0.2. */
close("power: n=64/group, d=0.5", power({ n1: 64, n2: 64, sd1: 1, sd2: 1, delta: 0.5 }), 0.80, 0.01);
close("power: n=26/group, d=0.8", power({ n1: 26, n2: 26, sd1: 1, sd2: 1, delta: 0.8 }), 0.80, 0.02);
close("power: n=394/group, d=0.2", power({ n1: 394, n2: 394, sd1: 1, sd2: 1, delta: 0.2 }), 0.80, 0.01);
close("power at δ=0 is α", power({ n1: 30, n2: 30, sd1: 1, sd2: 1, delta: 0 }), 0.05, 1e-6);
ok("power rises with n", power({ n1: 40, n2: 40, sd1: 1, sd2: 1, delta: 0.5 }) >
  power({ n1: 20, n2: 20, sd1: 1, sd2: 1, delta: 0.5 }));
ok("power rises with effect", power({ n1: 20, n2: 20, sd1: 1, sd2: 1, delta: 1 }) >
  power({ n1: 20, n2: 20, sd1: 1, sd2: 1, delta: 0.5 }));

/* minDetectable is power() inverted, so it has to round-trip. */
{
  const mde = minDetectable({ n1: 64, n2: 64, sd1: 1, sd2: 1 });
  close("MDE round-trips to 80% power", power({ n1: 64, n2: 64, sd1: 1, sd2: 1, delta: mde }), 0.8, 1e-4);
  close("MDE at n=64/group ≈ d 0.5", mde, 0.5, 0.02);
  ok("MDE falls as n grows",
    minDetectable({ n1: 200, n2: 200, sd1: 1, sd2: 1 }) <
    minDetectable({ n1: 20, n2: 20, sd1: 1, sd2: 1 }));
}

/* ---------- 5 · Welch's test ----------
   The worked example from Welch's own literature: two samples
   with equal n and equal sd must reproduce the pooled t-test. */
{
  const w = welch({ m1: 10, s1: 2, n1: 25, m2: 8, s2: 2, n2: 25 });
  close("Welch t on balanced equal-variance data", w.t, 2 / (2 * Math.sqrt(2 / 25)), 1e-12);
  close("Welch df on balanced equal-variance data", w.df, 48, 1e-9);
  ok("Welch p is two-tailed and small", w.p < 0.01);
  const same = welch({ m1: 5, s1: 1, n1: 10, m2: 5, s2: 3, n2: 40 });
  close("no difference → p = 1", same.p, 1, 1e-12);
}

/* ---------- 6 · series helpers ---------- */
close("rebase pins the first point", rebase([50, 75, 100])[0], 100, 1e-12);
close("rebase scales the rest", rebase([50, 75, 100])[2], 200, 1e-12);
{
  const dd = underwater([100, 120, 90, 96, 130]);
  close("underwater at a new peak is 0", dd[1], 0, 1e-12);
  close("underwater 120 → 90 is -25%", dd[2], -0.25, 1e-12);
  close("max drawdown of that path", maxDrawdown([100, 120, 90, 96, 130]), -0.25, 1e-12);
  close("a monotone series never draws down", maxDrawdown([1, 2, 3, 4]), 0, 1e-12);
}
close("quantile: median of 1..5", quantileSorted([1, 2, 3, 4, 5], 0.5), 3, 1e-12);
close("quantile interpolates", quantileSorted([1, 2, 3, 4], 0.5), 2.5, 1e-12);
{
  const b = boxStats([1, 2, 3, 4, 5, 6, 7, 8, 9, 100]);
  /* boxStats answers null for a sample with nothing finite in it,
     which this is not, and a null here would be the bug. */
  if (!b) throw new Error("boxStats returned nothing for a sample of ten");
  close("box median", b.med, 5.5, 1e-12);
  ok("box finds the outlier", b.outliers.length === 1 && b.outliers[0] === 100);
  ok("whisker stops inside the fence", b.whiskerHi === 9);
}
close("CAGR of a doubling over 12 months", cagrMonthly([100, 200]), Math.pow(2, 12) - 1, 1e-6);
close("a flat series has no volatility", volMonthly([100, 100, 100, 100]), 0, 1e-12);
ok("monthKey walks the calendar", monthKey("2018-01", 13) === "2019-02");

/* ---------- 7 · the shipped data is what it claims to be ---------- */
ok("FTSE series covers 91 months", UKX.length === SAMPLE.months);
ok("Islamic index series covers 90 months", MIGB.length === 90);
ok("both drawdown series cover 91 months",
  DD_CONVENTIONAL.length === 91 && DD_ISLAMIC.length === 91);
ok("the conventional drawdown series starts at a peak", DD_CONVENTIONAL[0] === 0);
ok("the Islamic drawdown series starts a month later",
  DD_ISLAMIC[0] === null && DD_ISLAMIC[1] === 0);
ok("no drawdown is positive",
  [...DD_CONVENTIONAL, ...DD_ISLAMIC].every((v) => v === null || v <= 1e-12));
ok("216 fund-level volatilities", FUND_SD.length === 216);
ok("fund volatilities are sorted and positive",
  FUND_SD.every((v, i) => v > 0 && (i === 0 || v >= FUND_SD[i - 1])));

{
  const total = EXCESS_HIST.bins.reduce((a, b) => a + b, 0)
    + EXCESS_HIST.below.length + EXCESS_HIST.above.length;
  ok(`histogram accounts for all ${SAMPLE.excessRows} rows`, total === SAMPLE.excessRows);
  ok("histogram rebins without losing anything",
    rebin(EXCESS_HIST, { factor: 5 }).reduce((a, b) => a + b.count, 0)
    === EXCESS_HIST.bins.reduce((a, b) => a + b, 0));
  ok("the stats block agrees on the row count", EXCESS_STATS.n === SAMPLE.excessRows);
  ok("the median sits inside the histogram window",
    EXCESS_STATS.q["0.5"] > EXCESS_HIST.lo);
}

/* ---------- 8 · the transcribed tables are internally consistent ---------- */
ok("sample adds up",
  SAMPLE.observations.islamic + SAMPLE.observations.conventional
  === SAMPLE.observations.total);
ok("fund counts add up",
  SAMPLE.funds.islamic + SAMPLE.funds.conventional === SAMPLE.funds.total);
ok("every univariate p-value is above 0.05", UNIVARIATE.every((r) => r.p > 0.05));
/* The document rounds the difference to six places, so this
   agrees to the last printed digit rather than exactly. */
ok("the IVOL difference matches its two means",
  Math.abs((IVOL.islamic.mean - IVOL.conventional.mean) - IVOL.diff) < 1e-5);
ok("the drawdown result is the only near-miss", MDD.p > 0.05 && MDD.p < 0.1);

for (const key of Object.keys(REGRESSIONS)) {
  const m = REGRESSIONS[key];
  ok(`${key}: N matches the sample table`,
    m.n === (key === "pooled" ? SAMPLE.observations.total
      : SAMPLE.observations[key]));
  ok(`${key}: adjusted R² ≤ R²`, m.adjR2 <= m.r2);
  for (const c of m.coefs) {
    ok(`${key}/${c.name}: t = b / se`, Math.abs(c.b / c.se - c.t) < 0.02 * Math.abs(c.t) + 1e-3);
    ok(`${key}/${c.name}: the CI brackets the estimate`, c.lo < c.b && c.b < c.hi);
    ok(`${key}/${c.name}: p and the CI agree about zero`,
      (c.p < 0.05) === (c.lo > 0 || c.hi < 0));
  }
}

/* The claim the whole page rests on: the Islamic dummy's interval
   contains zero, and the difference is not significant. */
{
  const d = REGRESSIONS.pooled.coefs.find((c) => c.name === "islamic");
  if (!d) throw new Error("the pooled regression has no islamic coefficient");
  ok("the Islamic dummy's 95% interval contains zero", d.lo < 0 && d.hi > 0);
  ok("the Islamic dummy is insignificant at 10%", d.p > 0.1);
}

/* ---------- report ---------- */
const total = pass + failures.length;
if (failures.length) {
  console.error(`✗ ${failures.length} of ${total} checks failed:\n`);
  failures.forEach((f) => console.error(`   · ${f}`));
  process.exit(1);
}
console.log(`✓ all ${total} checks passed`);
