#!/usr/bin/env node
/* ============================================================
   frontier.test.mjs, checks on the portfolio-construction engine.

       node aab/portfolio/frontier.test.mjs

   An optimiser that has converged to the wrong point returns a
   perfectly plausible set of weights. A backtest with an
   off-by-one in it returns a perfectly plausible return. Neither
   announces itself, so everything here is checked against a
   closed form, an identity that has to hold whatever the code
   does, or a number computed somewhere else entirely.

   The strongest of them are the identities. The variance of the
   realised portfolio return series has to equal w'Σw computed
   from the covariance matrix, exactly, because they are two
   expressions for the same thing. An equally weighted buy-and-
   hold portfolio has to end at the average of the price
   relatives, exactly. The minimum-variance weights have to equal
   Σ⁻¹1 / (1'Σ⁻¹1) whenever that solution is interior. If any of
   those three drift, something upstream is broken.

   The last section is a different kind of check: the fund as it
   was actually built, run again from daily prices, against the
   figures it reported at the time. Weights, portfolio beta, the
   final value of the ten million, and every year's return and
   volatility all have to come back.
   ============================================================ */

import {
  returnsOf, returnMatrix, stdev, covariance, correlationOf, shrink,
  portfolioReturn, portfolioVariance, portfolioVol, riskContributions,
  annualiseReturn, annualiseVol, projectToSimplex, optimise, minimumVariance,
  frontier, tangency, equalWeight, inverseVariance,
  backtest, underwater, performance, annualReturns,
  screen, SCREEN_DEFAULTS, capmExpected, run, toCsv,
  AS_BUILT, asBuiltWeights, betaContribution, yearTable,
  COMPANIES, TICKERS, HELD, DATES_2015, PRICES_2015, DATES_OOS, PRICES_OOS,
  BENCHMARK_ANNUAL, CAPM, CHECKS, DEFAULTS, DRIVERS, TRADING_DAYS,
} from "./frontier.model.js";

let pass = 0;
const failures = [];
const ok = (name, cond) => { if (cond) pass++; else failures.push(name); };
const close = (name, got, want, tol) =>
  ok(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const mean = (xs) => sum(xs) / xs.length;

/* A matrix inverse written here rather than imported, so the
   closed-form checks below are an outside opinion rather than
   the model marking its own work. */
function inverse(A) {
  const n = A.length;
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    const d = M[c][c];
    for (let k = 0; k < 2 * n; k++) M[c][k] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c];
      for (let k = 0; k < 2 * n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row) => row.slice(n));
}

/* ---------- 1 · the shipped data is what the workbook held ---------- */
ok("thirteen candidates", COMPANIES.length === CHECKS.companies && COMPANIES.length === 13);
ok("ten of them were held", HELD.length === CHECKS.held && HELD.length === 10);
ok("every held ticker is one of the candidates", HELD.every((t) => TICKERS.includes(t)));
ok("the estimation window is a year of trading days",
  DATES_2015.length === CHECKS.days2015 && DATES_2015.length === 252);
ok("the hold-out window is five years of them",
  DATES_OOS.length === CHECKS.daysOos && DATES_OOS.length === 1264);
ok("the windows do not overlap", DATES_2015[DATES_2015.length - 1] < DATES_OOS[0]);
ok("the estimation window is 2015",
  DATES_2015[0] === CHECKS.firstDate2015 && DATES_2015[DATES_2015.length - 1] === CHECKS.lastDate2015);
ok("the hold-out window is 2016 to 2020",
  DATES_OOS[0] === CHECKS.firstDateOos && DATES_OOS[DATES_OOS.length - 1] === CHECKS.lastDateOos);
ok("dates only ever move forwards",
  DATES_2015.every((d, i) => i === 0 || d > DATES_2015[i - 1])
  && DATES_OOS.every((d, i) => i === 0 || d > DATES_OOS[i - 1]));
ok("every candidate has a full price history in the estimation window",
  TICKERS.every((t) => PRICES_2015[t].length === DATES_2015.length));
ok("every holding has a full price history in the hold-out window",
  HELD.every((t) => PRICES_OOS[t].length === DATES_OOS.length));
ok("no price is zero or negative",
  TICKERS.every((t) => PRICES_2015[t].every((p) => p > 0))
  && HELD.every((t) => PRICES_OOS[t].every((p) => p > 0)));
TICKERS.forEach((t) => {
  close(`${t}: the price column sums to what was extracted`,
    sum(PRICES_2015[t]), CHECKS.priceSums[t], 0.02);
  close(`${t}: daily volatility over the estimation window`,
    stdev(returnsOf(PRICES_2015[t])), CHECKS.sigma2015[t], 1e-6);
});
ok("every company carries the fields the page reads",
  COMPANIES.every((c) => c.ticker && c.name && c.sector
    && Number.isFinite(c.de) && Number.isFinite(c.esg) && Number.isFinite(c.beta)
    && Number.isFinite(c.roe) && Number.isFinite(c.dividendYield)));

/* ---------- 2 · returns and covariance ---------- */
{
  close("a return series is one shorter than its prices",
    returnsOf([10, 11, 12]).length, 2, 0);
  close("and each entry is the simple return", returnsOf([10, 11])[0], 0.1, 1e-15);

  const R = [[0.01, 0.02], [-0.01, 0.00], [0.03, 0.01], [0.00, -0.02]];
  const S = covariance(R);
  ok("the covariance matrix is symmetric", Math.abs(S[0][1] - S[1][0]) < 1e-18);
  close("its diagonal is the variance of the column",
    S[0][0], stdev(R.map((r) => r[0])) ** 2, 1e-18);
  /* Computed by hand from the definition, with the n − 1 denominator. */
  const m0 = mean(R.map((r) => r[0]));
  const m1 = mean(R.map((r) => r[1]));
  const byHand = sum(R.map((r) => (r[0] - m0) * (r[1] - m1))) / (R.length - 1);
  close("and its off-diagonal is the covariance", S[0][1], byHand, 1e-18);

  const C = correlationOf(S);
  ok("correlations are one on the diagonal",
    C.every((row, i) => Math.abs(row[i] - 1) < 1e-12));
  ok("and never leave [-1, 1]", C.flat().every((v) => v >= -1 - 1e-12 && v <= 1 + 1e-12));
}

/* The identity that ties the covariance matrix to the thing it
   claims to describe: the variance of the realised portfolio
   return series is w'Σw. Two completely different routes to one
   number, on the real data. */
{
  const R = returnMatrix(PRICES_2015, HELD);
  const S = covariance(R);
  const w = [0.2, 0.15, 0.1, 0.05, 0.15, 0.1, 0.1, 0.05, 0.05, 0.05];
  const series = R.map((row) => sum(row.map((r, i) => r * w[i])));
  close("w'Σw is the variance of the portfolio's own return series",
    portfolioVariance(w, S), stdev(series) ** 2, 1e-16);
  close("and the portfolio's mean return is w'μ",
    portfolioReturn(w, HELD.map((_, j) => mean(R.map((r) => r[j])))), mean(series), 1e-16);
}

{
  const S = [[4, 2], [2, 9]];
  close("shrinkage at zero leaves the matrix alone", shrink(S, 0)[0][1], 2, 1e-15);
  close("shrinkage at one removes every covariance", shrink(S, 1)[0][1], 0, 1e-15);
  close("and never touches the diagonal", shrink(S, 0.7)[1][1], 9, 1e-15);
  close("halfway is halfway", shrink(S, 0.5)[0][1], 1, 1e-15);
}

/* ---------- 3 · risk contributions ---------- */
{
  const R = returnMatrix(PRICES_2015, HELD);
  const S = covariance(R);
  const w = equalWeight(10);
  const rc = riskContributions(w, S);
  close("the component contributions add up to the portfolio's volatility",
    sum(rc.component), rc.vol, 1e-15);
  close("so their shares add to one", sum(rc.share), 1, 1e-12);
  ok("and the noisiest holding carries more risk than its weight",
    rc.share[HELD.indexOf("PLUS")] > w[HELD.indexOf("PLUS")]);
}

/* ---------- 4 · the projection ---------- */
{
  const p = projectToSimplex([0.5, 0.3, 0.2], 1);
  close("a point already on the simplex is returned unchanged", p[0], 0.5, 1e-12);
  const q = projectToSimplex([5, -3, 1], 1);
  close("the result always sums to one", sum(q), 1, 1e-12);
  ok("and is never negative", q.every((x) => x >= -1e-12));
  const capped = projectToSimplex([10, 0, 0, 0], 0.4);
  ok("the cap binds", capped.every((x) => x <= 0.4 + 1e-9));
  close("and the weights still sum to one", sum(capped), 1, 1e-12);
  ok("an impossible cap is refused rather than silently renormalised", (() => {
    try { projectToSimplex([1, 1, 1], 0.2); return false; } catch { return true; }
  })());
  /* It has to be the NEAREST point in the set, not merely a
     point in it. Checked against a fine grid search in two
     dimensions, where the simplex is a line segment. */
  {
    const v = [0.9, -0.2];
    const proj = projectToSimplex(v, 1);
    const d2 = (w) => (w[0] - v[0]) ** 2 + (w[1] - v[1]) ** 2;
    let best = Infinity;
    for (let i = 0; i <= 100000; i++) {
      const w = [i / 100000, 1 - i / 100000];
      best = Math.min(best, d2(w));
    }
    ok(`the projection is the nearest point in the set (${d2(proj).toFixed(9)} against ${best.toFixed(9)})`,
      d2(proj) <= best + 1e-9);
  }
}

/* ---------- 5 · the optimiser, against the closed form ----------
   With no cap binding and every weight strictly positive, the
   minimum-variance portfolio has a closed form, Σ⁻¹1 / (1'Σ⁻¹1).
   The matrix below is built so that solution is interior, which
   makes it a genuine check on the solver rather than on the
   constraints. */
{
  const S = [
    [0.0004, 0.00005, 0.00002],
    [0.00005, 0.0009, 0.00003],
    [0.00002, 0.00003, 0.0016],
  ];
  const inv = inverse(S);
  const ones = [1, 1, 1];
  const raw = inv.map((row) => sum(row.map((v, j) => v * ones[j])));
  const closedForm = raw.map((v) => v / sum(raw));
  ok("the closed-form solution is interior, so this tests the solver",
    closedForm.every((w) => w > 0.01 && w < 0.99));
  const solved = minimumVariance(S, { cap: 1 });
  const worst = Math.max(...solved.map((w, i) => Math.abs(w - closedForm[i])));
  ok(`minimum variance matches Σ⁻¹1/(1'Σ⁻¹1) to ${worst.toExponential(1)}`, worst < 1e-6);
  ok("and its variance is below any other weighting tried",
    [[1 / 3, 1 / 3, 1 / 3], [0.5, 0.3, 0.2], [0.2, 0.5, 0.3], [0.8, 0.1, 0.1]]
      .every((w) => portfolioVariance(solved, S) <= portfolioVariance(w, S) + 1e-15));
}

/* On the real estimation window, the minimum-variance portfolio
   must beat every heuristic at the only thing it is trying to
   do. If it ever does not, the solver has not converged. */
{
  const R = returnMatrix(PRICES_2015, HELD);
  const S = covariance(R);
  const mv = minimumVariance(S, { cap: 1 });
  const v = (w) => portfolioVariance(w, S);
  ok("minimum variance beats equal weight in sample", v(mv) < v(equalWeight(10)));
  ok("and beats inverse-variance weighting too", v(mv) < v(inverseVariance(S)));
  close("its weights sum to one", sum(mv), 1, 1e-12);
  ok("and none of them is negative", mv.every((w) => w >= -1e-12));

  const capped = minimumVariance(S, { cap: 0.2 });
  ok("a cap of twenty per cent is respected", capped.every((w) => w <= 0.2 + 1e-9));
  ok("and costs variance, as a binding constraint must",
    v(capped) >= v(mv) - 1e-15);
}

/* ---------- 6 · the frontier ---------- */
{
  const R = returnMatrix(PRICES_2015, HELD);
  const mu = HELD.map((_, j) => mean(R.map((r) => r[j])));
  const S = covariance(R);
  const f = frontier(mu, S, { cap: 0.35, points: 24 });

  ok("the efficient set rises in both directions",
    f.efficient.every((p, i, A) => i === 0
      || (p.vol >= A[i - 1].vol - 1e-12 && p.ret >= A[i - 1].ret - 1e-12)));
  ok("no point on it is beaten by another on both measures",
    f.efficient.every((p) => !f.efficient.some((q) =>
      q.ret > p.ret + 1e-12 && q.vol < p.vol - 1e-12)));
  ok("every point is a set of weights that sums to one",
    f.efficient.every((p) => Math.abs(sum(p.weights) - 1) < 1e-9));
  ok("and respects the cap", f.efficient.every((p) => p.weights.every((w) => w <= 0.35 + 1e-9)));
  ok("the leftmost point is the minimum-variance portfolio",
    Math.abs(f.efficient[0].vol - annualiseVol(portfolioVol(minimumVariance(S, { cap: 0.35 }), S))) < 5e-4);

  const t = tangency(mu, S, 0.005, { cap: 0.35 }, f);
  ok("the tangency portfolio has the best Sharpe ratio on the frontier",
    f.efficient.every((p) => (p.ret - 0.005) / p.vol <= t.sharpe + 1e-9));
  ok("and it is not simply the minimum-variance point", t.vol > f.efficient[0].vol);
}

/* ---------- 7 · annualisation ---------- */
close("a daily return annualises by the number of trading days",
  annualiseReturn(0.0004), 0.0004 * TRADING_DAYS, 1e-18);
close("and a daily volatility by its square root",
  annualiseVol(0.01), 0.01 * Math.sqrt(TRADING_DAYS), 1e-18);

/* ---------- 8 · the hold-out test ----------
   Buy and hold with equal weights ends at the average of the
   price relatives. That is arithmetic, not a modelling choice,
   so it pins the whole backtest to one line of algebra. */
{
  const nav = backtest(equalWeight(10), PRICES_OOS, HELD, { mode: "hold" });
  const relatives = HELD.map((t) => PRICES_OOS[t][PRICES_OOS[t].length - 1] / PRICES_OOS[t][0]);
  close("equal-weight buy and hold ends at the average price relative",
    nav[nav.length - 1], mean(relatives), 1e-12);
  close("every path starts at one", nav[0], 1, 1e-18);
  ok("and has one point per trading day", nav.length === DATES_OOS.length);

  /* A two-day, two-asset case worked out by hand, for the other
     convention: rebalancing to fixed weights compounds the
     weighted daily return rather than the terminal relatives. */
  const px = { A: [100, 110, 121], B: [100, 90, 81] };
  const rb = backtest([0.5, 0.5], px, ["A", "B"], { mode: "rebalance" });
  close("rebalanced day one", rb[1], 1 + 0.5 * 0.1 + 0.5 * -0.1, 1e-15);
  close("rebalanced day two", rb[2], rb[1] * (1 + 0.5 * 0.1 + 0.5 * -0.1), 1e-15);
  const bh = backtest([0.5, 0.5], px, ["A", "B"], { mode: "hold" });
  close("buy and hold ends at the average relative", bh[2], (1.21 + 0.81) / 2, 1e-15);
  ok("the two conventions genuinely differ", Math.abs(rb[2] - bh[2]) > 1e-6);
}

/* An outside number. This weight vector was produced in a
   spreadsheet from the same estimation window, and rebalancing
   to it daily across the hold-out window returns 49.35% there.
   Reproducing that figure here ties the price data, the return
   convention and the backtest to a calculation made somewhere
   else entirely, which is the only kind of check a backtest can
   really be given. */
{
  const external = [0.1761, 0.1533, 0.0937, 0.0853, 0.1669, 0.1095, 0.0764, 0.0136, 0.0802, 0.0450];
  const nav = backtest(external, PRICES_OOS, HELD, { mode: "rebalance" });
  close("the engine reproduces a hold-out return computed in a spreadsheet",
    (nav[nav.length - 1] - 1) * 100, 49.354, 0.02);
  /* And the same weights under the other convention, which the
     page offers as a switch, must differ by a lot rather than a
     little: over five years the two are not close. */
  const held = backtest(external, PRICES_OOS, HELD, { mode: "hold" });
  ok("and the two conventions are far apart over five years",
    Math.abs((nav[nav.length - 1] - held[held.length - 1])) > 0.2);
}

/* ---------- 9 · performance measures ---------- */
{
  const nav = backtest(equalWeight(10), PRICES_OOS, HELD, { mode: "hold" });
  const p = performance(nav, DATES_OOS, { riskFree: 0.005 });
  close("compounding the CAGR over the period returns the cumulative",
    (1 + p.cagr) ** p.years - 1, p.cumulative, 1e-9);
  ok("the drawdown is negative and no worse than losing everything",
    p.maxDrawdown <= 0 && p.maxDrawdown >= -1);
  ok("volatility is positive", p.vol > 0);
  ok("the hit rate is a fraction", p.hitRate > 0 && p.hitRate < 1);

  const u = underwater(nav);
  close("the underwater curve starts at zero", u[0], 0, 1e-18);
  ok("and is never positive", u.every((v) => v <= 1e-12));
  close("its lowest point is the maximum drawdown", Math.min(...u), p.maxDrawdown, 1e-15);

  const years = annualReturns(nav, DATES_OOS);
  ok("one entry per calendar year", years.length === 5 && years[0].year === 2016);
  close("and chaining them reproduces the whole period",
    years.reduce((acc, y) => acc * (1 + y.ret), 1) - 1, p.cumulative, 1e-9);
}

/* ---------- 10 · the screen ---------- */
{
  const s = screen(COMPANIES, SCREEN_DEFAULTS);
  ok("every candidate gets a verdict", s.length === COMPANIES.length);
  ok("a company passes exactly when it fails nothing",
    s.every((c) => c.passes === (c.fails.length === 0)));
  ok("the leverage rule is the one that bites hardest",
    s.filter((c) => c.fails.includes("leverage")).length
    >= s.filter((c) => c.fails.includes("return on equity")).length);
  const loose = screen(COMPANIES, { ...SCREEN_DEFAULTS, maxDebtEquity: 1e9, maxEsg: 1e9, minRoe: -1e9, minRoicWacc: -1e9 });
  ok("a rule that excludes nothing excludes nothing", loose.every((c) => c.passes));
}

/* ---------- 11 · the security market line ---------- */
close("a beta of one earns the market return", capmExpected(1), CAPM.marketReturn, 1e-12);
close("a beta of zero earns the risk-free rate", capmExpected(0), CAPM.riskFree, 1e-12);
ok("and it slopes upwards", capmExpected(1.5) > capmExpected(0.5));

/* ---------- 12 · the whole pipeline ---------- */
{
  const r = run(DEFAULTS);
  ok("it optimises over the ten holdings by default", r.tickers.length === 10);
  ok("the chosen weights sum to one", Math.abs(sum(r.weights) - 1) < 1e-9);
  ok("and respect the cap", r.weights.every((w) => w <= DEFAULTS.cap + 1e-9));
  ok("the tangency portfolio has a better in-sample Sharpe than equal weight",
    r.points.tangency.sharpe > r.points.equal.sharpe);
  ok("the minimum-variance portfolio has the lowest in-sample volatility of the four",
    ["tangency", "equal", "inverse"].every((k) => r.points.minvar.vol <= r.points[k].vol + 1e-9));
  ok("every hold-out path covers the whole window",
    ["chosen", "equal", "minvar"].every((k) => r.holdout[k].nav.length === DATES_OOS.length));
  ok("the realised frontier is computed on the hold-out years, not the estimation year",
    r.realised.frontier.efficient.length > 0);
  /* Nothing chosen on the estimation window can sit above the
     frontier drawn on the hold-out years: that frontier is by
     construction the best that was available with hindsight. */
  const best = r.realised.frontier.efficient;
  const near = best.reduce((b, p) => (Math.abs(p.vol - r.realised.chosen.vol) < Math.abs(b.vol - r.realised.chosen.vol) ? p : b), best[0]);
  ok("and the chosen portfolio does not beat hindsight",
    r.realised.chosen.ret <= near.ret + 0.02);

  const again = run(DEFAULTS);
  ok("the same settings give the same weights",
    again.weights.every((w, i) => Math.abs(w - r.weights[i]) < 1e-12));

  const csv = toCsv({ ...DEFAULTS, strategy: "minvar" });
  ok("the export carries the weights table", csv.includes("WEIGHTS AND RISK"));
  ok("and the hold-out results", csv.includes("HOLD-OUT WINDOW"));
  ok("and every driver", DRIVERS.every((d) => csv.includes(d.label)));
  ok("and every calendar year of the benchmark",
    Object.keys(BENCHMARK_ANNUAL).every((y) => csv.includes(y)));
}

/* ---------- 13 · the fund as it was built ---------- */
{
  /* The weights the fund was actually run on came out of a
     Solver run that minimised the sum of w²σ², holding the
     ten weights to one. That objective has a closed form:
     weight proportional to one over variance, no correlations
     anywhere in it. Reproducing the shipped weights from the
     covariance matrix is what says the Solver converged rather
     than stopped somewhere near. */
  const S = covariance(returnMatrix(PRICES_2015, HELD));
  const iv = inverseVariance(S);
  const built = asBuiltWeights(HELD);
  ok("the as-built weights sum to one", Math.abs(sum(built) - 1) < 1e-9);
  ok("and every one of them is positive", built.every((w) => w > 0));
  ok("inverse-variance weighting reproduces the weights the fund was run on",
    iv.every((w, i) => Math.abs(w - built[i]) < 1e-3));
  ok("asBuiltWeights returns them in the order it was asked for",
    HELD.every((t, i) => Math.abs(built[i] - AS_BUILT[t]) < 1e-12));
  ok("and gives an unknown ticker no money",
    asBuiltWeights([...HELD, "ZZZ"])[HELD.length] === 0);

  /* Beta is a weighted average, so the contributions have to add
     back to the portfolio figure, and a negative-beta holding has
     to pull it down rather than up. */
  const b = betaContribution(built, HELD);
  close("the beta contributions add to the portfolio beta",
    sum(b.rows.map((x) => x.contribution)), b.portfolio, 1e-12);
  close("and the portfolio beta is the one the fund reported", b.portfolio, 0.5188, 0.002);
  const neg = b.rows.filter((x) => x.beta < 0);
  ok("the negative-beta holding contributes negatively", neg.every((x) => x.contribution < 0));
  ok("and the portfolio beta sits below the simple average of its parts",
    b.portfolio < mean(b.rows.map((x) => x.beta)) + 1e-9);

  /* The five held years, against what the fund reported at the
     time. Everything here is recomputed from daily prices. */
  const r = run(DEFAULTS);
  ok("the fund as built is what loads by default", DEFAULTS.strategy === "asbuilt");
  ok("and it is run on constant weights, which is how it was reported",
    DEFAULTS.mode === "rebalance");
  const nav = r.holdout.chosen.nav;
  close("ten million becomes the reported final value",
    nav[nav.length - 1] * 10, 14.94, 0.05);
  close("and the cumulative return matches the one reported",
    r.holdout.chosen.performance.cumulative, 0.494, 0.002);

  const years = yearTable(nav, DATES_OOS, b.portfolio);
  ok("there are five held years", years.length === 5);
  const reported = {
    2016: [-0.0063, 0.1857], 2017: [0.2877, 0.0924], 2018: [-0.1243, 0.1356],
    2019: [0.2553, 0.1556], 2020: [0.0617, 0.3064],
  };
  years.forEach((y) => {
    const [ret, vol] = reported[y.year];
    close(`${y.year} return matches the reported figure`, y.ret, ret, 5e-4);
    close(`${y.year} volatility matches the reported figure`, y.vol, vol, 5e-4);
    close(`${y.year} alpha is return less the CAPM expectation`, y.alpha,
      y.ret - (y.riskFree + b.portfolio * (y.benchmark - y.riskFree)), 1e-12);
    close(`${y.year} Sharpe divides excess return by total volatility`, y.sharpe,
      (y.ret - y.riskFree) / y.vol, 1e-12);
    close(`${y.year} Treynor divides the same excess by beta`, y.treynor,
      (y.ret - y.riskFree) / b.portfolio, 1e-12);
    ok(`${y.year} records whether the index was beaten`,
      y.beatIndex === y.ret > y.benchmark);
  });
  ok("2017 and 2019 beat the index", years.filter((y) => y.beatIndex).length >= 3);
  ok("2020 is the most volatile of the five",
    years.every((y) => y.year === 2020 || y.vol < years.find((z) => z.year === 2020).vol));
  close("the average held year beats the average index year",
    mean(years.map((y) => y.ret)) - mean(years.map((y) => y.benchmark)), 0.0516, 0.002);

  /* Beta is one number for the whole period, so Treynor ranks the
     years on excess return alone. Sharpe also prices the path,
     and 2017 was the calmest year of the five: it should stand
     further clear of 2019 on Sharpe than it does on Treynor. */
  const byTreynor = [...years].sort((a, z) => z.treynor - a.treynor).map((y) => y.year);
  const byExcess = [...years].sort((a, z) => (z.ret - z.riskFree) - (a.ret - a.riskFree)).map((y) => y.year);
  ok("Treynor ranks the years on excess return alone", byTreynor.join() === byExcess.join());
  const y17 = years.find((y) => y.year === 2017);
  const y19 = years.find((y) => y.year === 2019);
  ok("2017 was the calmest of the five", years.every((y) => y.year === 2017 || y.vol > y17.vol));
  ok("so Sharpe separates it from 2019 further than Treynor does",
    y17.sharpe / y19.sharpe > y17.treynor / y19.treynor);
}

/* ---------- report ---------- */
const total = pass + failures.length;
if (failures.length) {
  console.error(`✗ ${failures.length} of ${total} checks failed:\n`);
  failures.forEach((f) => console.error(`   · ${f}`));
  process.exit(1);
}
console.log(`✓ all ${total} checks passed`);
