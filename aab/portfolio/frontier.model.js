/* frontier.model.js: portfolio construction, end to end. No DOM,
   prices in and weights and performance out, checked by
   `frontier.test.ts` against closed forms and identities.

   Everything is computed live in the browser from the daily
   prices in `frontier.data.js`: change a constraint and the
   frontier is solved again rather than looked up. The
   annualisation conventions are stated once and used
   everywhere: 252 trading days, returns scaled by 252 and
   volatility by its square root. */

import {
  COMPANIES, TICKERS, HELD, DATES_2015, PRICES_2015,
  DATES_OOS, PRICES_OOS, RISK_FREE, BENCHMARK_ANNUAL, CAPM, CHECKS,
} from "./frontier.data.js";

export {
  COMPANIES, TICKERS, HELD, DATES_2015, PRICES_2015,
  DATES_OOS, PRICES_OOS, RISK_FREE, BENCHMARK_ANNUAL, CAPM, CHECKS,
};

export const TRADING_DAYS = 252;

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const mean = (xs) => (xs.length ? sum(xs) / xs.length : NaN);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ------------------------------------------------------------
   1 · Returns and covariance
   ------------------------------------------------------------ */

/** Simple daily returns. One shorter than the price series. */
export const returnsOf = (prices) =>
  prices.slice(1).map((p, i) => p / prices[i] - 1);

/** A matrix of returns, one column per ticker, rows aligned by date. */
export function returnMatrix(prices, tickers) {
  const cols = tickers.map((t) => returnsOf(prices[t]));
  const n = cols[0]?.length ?? 0;
  return Array.from({ length: n }, (_, i) => cols.map((c) => c[i]));
}

export function stdev(xs) {
  const n = xs.length;
  if (n < 2) return NaN;
  const m = mean(xs);
  return Math.sqrt(sum(xs.map((x) => (x - m) ** 2)) / (n - 1));
}

/** Sample covariance matrix, with the n − 1 denominator. */
export function covariance(R) {
  const n = R.length;
  const p = R[0]?.length ?? 0;
  const mu = Array.from({ length: p }, (_, j) => mean(R.map((r) => r[j])));
  const S = Array.from({ length: p }, () => Array(p).fill(0));
  for (let a = 0; a < p; a++) {
    for (let b = a; b < p; b++) {
      let acc = 0;
      for (let i = 0; i < n; i++) acc += (R[i][a] - mu[a]) * (R[i][b] - mu[b]);
      S[a][b] = acc / (n - 1);
      S[b][a] = S[a][b];
    }
  }
  return S;
}

export const correlationOf = (S) =>
  S.map((row, a) => row.map((v, b) => v / Math.sqrt(S[a][a] * S[b][b])));

/**
 * Shrink the covariance matrix towards a diagonal target.
 *
 *     Σ(δ) = (1 − δ)·S + δ·diag(S)
 *
 * δ = 0 is the sample matrix, whose smallest eigenvalues are its
 * least reliable part and exactly where a minimum variance
 * objective is drawn; δ = 1 throws every correlation away.
 */
export function shrink(S, delta) {
  const d = clamp(delta, 0, 1);
  return S.map((row, a) => row.map((v, b) => (a === b ? v : (1 - d) * v)));
}

/* ------------------------------------------------------------
   2 · Portfolio arithmetic
   ------------------------------------------------------------ */
export const portfolioReturn = (w, mu) => sum(w.map((x, i) => x * mu[i]));

export function portfolioVariance(w, S) {
  let acc = 0;
  for (let a = 0; a < w.length; a++) {
    for (let b = 0; b < w.length; b++) acc += w[a] * w[b] * S[a][b];
  }
  return acc;
}

export const portfolioVol = (w, S) => Math.sqrt(Math.max(0, portfolioVariance(w, S)));

export const annualiseReturn = (daily) => daily * TRADING_DAYS;
export const annualiseVol = (daily) => daily * Math.sqrt(TRADING_DAYS);

/**
 * How much of the portfolio's risk each holding is responsible
 * for. The marginal contribution is ∂σ/∂wᵢ = (Σw)ᵢ/σ, and the
 * component contributions wᵢ·∂σ/∂wᵢ add up to σ exactly, which
 * is the property that makes them worth quoting: a weight of ten
 * per cent in the most volatile name is not ten per cent of the
 * risk, and the difference is the whole argument for looking.
 */
export function riskContributions(w, S) {
  const vol = portfolioVol(w, S);
  const marginal = w.map((_, a) => sum(w.map((x, b) => x * S[a][b])) / (vol || 1));
  const component = w.map((x, a) => x * marginal[a]);
  return { vol, marginal, component, share: component.map((c) => c / (vol || 1)) };
}

/* 3 · Euclidean projection onto {w : Σw = 1, 0 ≤ wᵢ ≤ cap}.
   `wᵢ(λ) = clamp(vᵢ − λ, 0, cap)` and `Σwᵢ(λ)` falls
   monotonically in λ, so it is a one-dimensional root find and
   bisection is exact to machine precision. Clipping and
   renormalising instead, the common shortcut, does NOT land on
   the projection and biases every solution towards the cap. */
export function projectToSimplex(v, cap = 1) {
  const n = v.length;
  if (cap * n < 1 - 1e-12) throw new Error(`a cap of ${cap} cannot hold ${n} weights summing to one`);
  const at = (lambda) => v.map((x) => clamp(x - lambda, 0, cap));
  let lo = Math.min(...v) - 1;
  let hi = Math.max(...v);
  /* Forty-eight halvings of a range about two wide lands well
     inside double precision. A hundred, which this had first,
     doubled the cost of the whole page for no digits. */
  for (let i = 0; i < 48; i++) {
    const mid = (lo + hi) / 2;
    if (sum(at(mid)) > 1) lo = mid; else hi = mid;
  }
  const w = at((lo + hi) / 2);
  const total = sum(w);
  return total > 0 ? w.map((x) => x / total) : Array(n).fill(1 / n);
}

/* ------------------------------------------------------------
   4 · The optimiser
   ------------------------------------------------------------ */

/**
 * maximise w'μ − (γ/2)·w'Σw over the capped simplex.
 *
 * Projected gradient ascent with a step size taken from the
 * curvature, which for this objective is bounded by γ times the
 * largest eigenvalue of Σ. That is estimated cheaply by the row
 * sums (Gershgorin), which is conservative and therefore safe.
 */
export function optimise(mu, S, { gamma = 10, cap = 1, iterations = 1500, tol = 1e-11, start = null } = {}) {
  const n = mu.length;
  let w = start ? [...start] : Array(n).fill(1 / n);
  let y = [...w];
  let t = 1;
  const bound = Math.max(...S.map((row, a) => sum(row.map(Math.abs)))) || 1;
  const step = 1 / (gamma * bound + 1e-12);

  /* Projected gradient with Nesterov momentum. The plain version
     needed a few thousand iterations per point and there are a
     hundred points on this page; with momentum and a convergence
     test most of them stop inside two hundred, which is the
     difference between a page that redraws while a slider moves
     and one that takes five seconds. */
  for (let k = 0; k < iterations; k++) {
    const Sy = y.map((_, a) => {
      let acc = 0;
      for (let b = 0; b < n; b++) acc += y[b] * S[a][b];
      return acc;
    });
    const next = projectToSimplex(y.map((x, a) => x + step * (mu[a] - gamma * Sy[a])), cap);
    const tNext = (1 + Math.sqrt(1 + 4 * t * t)) / 2;
    const momentum = (t - 1) / tNext;
    y = next.map((x, a) => x + momentum * (x - w[a]));
    let moved = 0;
    for (let a = 0; a < n; a++) moved = Math.max(moved, Math.abs(next[a] - w[a]));
    w = next;
    t = tNext;
    if (moved < tol) break;
  }
  return w;
}

/** The lowest-variance portfolio available under the constraints. */
export const minimumVariance = (S, opts = {}) =>
  optimise(Array(S.length).fill(0), S, { gamma: 1, iterations: 4000, ...opts });

/**
 * The efficient frontier, traced by sweeping risk aversion.
 *
 * Each γ gives one solved optimisation, and the solution for one
 * γ is the starting point for the next, which is both faster and
 * steadier than starting from equal weights every time.
 */
export function frontier(mu, S, { cap = 1, points = 40, gammaLo = 0.5, gammaHi = 4000 } = {}) {
  const out = [];
  let warm = null;
  for (let i = 0; i < points; i++) {
    const gamma = gammaHi * (gammaLo / gammaHi) ** (i / (points - 1));
    const w = optimise(mu, S, { gamma, cap, start: warm });
    warm = w;
    out.push({
      gamma,
      weights: w,
      ret: annualiseReturn(portfolioReturn(w, mu)),
      vol: annualiseVol(portfolioVol(w, S)),
    });
  }
  /* Sweeping γ can return points that are dominated by their own
     neighbours when the solver stops a hair short of convergence.
     A frontier is by definition the upper envelope, so anything
     dominated is dropped rather than drawn. */
  const sorted = [...out].sort((a, b) => a.vol - b.vol);
  const efficient = [];
  let best = -Infinity;
  for (const p of sorted) {
    if (p.ret > best + 1e-12) { efficient.push(p); best = p.ret; }
  }
  return { all: sorted, efficient };
}

/** The portfolio on the frontier with the highest Sharpe ratio. */
export function tangency(mu, S, rf, opts = {}, precomputed = null) {
  const f = precomputed ?? frontier(mu, S, { points: 60, ...opts });
  let best = null;
  for (const p of f.efficient) {
    const sharpe = (p.ret - rf) / p.vol;
    if (!best || sharpe > best.sharpe) best = { ...p, sharpe };
  }
  /* One local refinement around the best γ, because the sweep is
     logarithmic and the maximum usually sits between two of its
     steps. */
  if (best) {
    for (let g = best.gamma / 2; g <= best.gamma * 2; g *= 1.1) {
      const w = optimise(mu, S, { gamma: g, iterations: 4000, start: best.weights, ...opts });
      const ret = annualiseReturn(portfolioReturn(w, mu));
      const vol = annualiseVol(portfolioVol(w, S));
      const sharpe = (ret - rf) / vol;
      if (sharpe > best.sharpe) best = { gamma: g, weights: w, ret, vol, sharpe };
    }
  }
  return best;
}

/** Equal weight, the reference every allocation is measured against. */
export const equalWeight = (n) => Array(n).fill(1 / n);

/**
 * The allocation the fund was built on:
 *
 *     minimise Σ wᵢ²σᵢ²   subject to   Σ wᵢ = 1
 *
 * A risk-based weighting asking for no view on expected returns.
 * It has a closed form, wᵢ ∝ 1/σᵢ², which is what says the
 * original Solver run converged to the true optimum rather than
 * to a nearby point that looked settled.
 */
export function inverseVariance(S) {
  const inv = S.map((row, a) => 1 / row[a]);
  const total = sum(inv);
  return inv.map((v) => v / total);
}

/**
 * The weights the fund actually held, kept as the fixed vector
 * that was used rather than recomputed: these are the numbers
 * the money was in. `inverseVariance()` above reproduces them to
 * within a hundredth of a point, which `frontier.test.ts`
 * checks.
 */
export const AS_BUILT = {
  BAG: 0.1761, CWK: 0.1533, FRAS: 0.0937, BOWL: 0.0853, IGG: 0.1669,
  KLR: 0.1095, PAY: 0.0764, PLUS: 0.0136, ROR: 0.0802, TEP: 0.0450,
};

export const asBuiltWeights = (tickers) => {
  const w = tickers.map((t) => AS_BUILT[t] ?? 0);
  const total = sum(w);
  return total > 0 ? w.map((x) => x / total) : equalWeight(tickers.length);
};

/** Portfolio beta, and what each holding contributes to it. */
export function betaContribution(weights, tickers, companies = COMPANIES) {
  const rows = tickers.map((t, i) => {
    const c = companies.find((x) => x.ticker === t);
    const beta = c ? c.beta : NaN;
    return { ticker: t, weight: weights[i], beta, contribution: weights[i] * beta };
  });
  return { rows, portfolio: sum(rows.map((r) => r.contribution)) };
}

/* ------------------------------------------------------------
   5 · Testing the weights on years the optimiser never saw
   ------------------------------------------------------------ */

/**
 * @param {number[]} w        weights, in ticker order
 * @param {object} prices     ticker → price series
 * @param {string[]} tickers
 * @param {"rebalance"|"hold"} mode
 *
 * The two modes are different STRATEGIES: "rebalance" holds the
 * weights constant, so it sells what rose and buys what fell;
 * "hold" buys once and lets the weights drift. Over five years
 * the gap is worth several points of return.
 */
export function backtest(w, prices, tickers, { mode = "hold" } = {}) {
  const n = prices[tickers[0]].length;
  const nav = [1];
  if (mode === "rebalance") {
    for (let i = 1; i < n; i++) {
      const r = sum(tickers.map((t, k) => w[k] * (prices[t][i] / prices[t][i - 1] - 1)));
      nav.push(nav[i - 1] * (1 + r));
    }
  } else {
    const units = tickers.map((t, k) => w[k] / prices[t][0]);
    for (let i = 1; i < n; i++) {
      nav.push(sum(tickers.map((t, k) => units[k] * prices[t][i])));
    }
  }
  return nav;
}

/** Peak-to-trough, at every point along the path. */
export function underwater(nav) {
  let peak = -Infinity;
  return nav.map((v) => {
    peak = Math.max(peak, v);
    return v / peak - 1;
  });
}

export function performance(nav, dates, { riskFree = 0.005 } = {}) {
  const daily = nav.slice(1).map((v, i) => v / nav[i] - 1);
  const years = (new Date(dates[dates.length - 1]) - new Date(dates[0])) / (365.25 * 24 * 3600 * 1000);
  const cumulative = nav[nav.length - 1] - 1;
  const cagr = nav[nav.length - 1] ** (1 / years) - 1;
  const vol = annualiseVol(stdev(daily));
  const down = daily.filter((r) => r < 0);
  const downside = annualiseVol(Math.sqrt(mean(down.map((r) => r * r))));
  const dd = underwater(nav);
  const maxDrawdown = Math.min(...dd);
  return {
    cumulative, cagr, vol, years,
    sharpe: (cagr - riskFree) / vol,
    sortino: (cagr - riskFree) / downside,
    maxDrawdown,
    calmar: maxDrawdown < 0 ? cagr / -maxDrawdown : NaN,
    best: Math.max(...daily),
    worst: Math.min(...daily),
    hitRate: daily.filter((r) => r > 0).length / daily.length,
  };
}

/** Calendar-year returns from a NAV path. */
export function annualReturns(nav, dates) {
  const years = [...new Set(dates.map((d) => d.slice(0, 4)))];
  return years.map((y) => {
    const idx = dates.map((d, i) => [d, i]).filter(([d]) => d.slice(0, 4) === y).map(([, i]) => i);
    const from = idx[0] === 0 ? 0 : idx[0] - 1;
    const to = idx[idx.length - 1];
    return { year: Number(y), ret: nav[to] / nav[from] - 1 };
  });
}

/**
 * The measures a fund is reported on, year by year.
 *
 *     α       = Rp − [rf + βp(Rm − rf)]
 *     Sharpe  = (Rp − rf) / σp        risk as total volatility
 *     Treynor = (Rp − rf) / βp        risk as market exposure only
 *
 * Both ratios are quoted because for a fund run at a low beta
 * they say quite different things.
 */
export function yearTable(nav, dates, portfolioBeta, {
  benchmark = BENCHMARK_ANNUAL, riskFree = RISK_FREE,
} = {}) {
  const years = annualReturns(nav, dates);
  return years.map(({ year, ret }) => {
    const idx = dates.map((d, i) => [d, i]).filter(([d]) => d.slice(0, 4) === String(year)).map(([, i]) => i);
    const daily = idx.slice(1).map((i) => nav[i] / nav[i - 1] - 1);
    const rf = riskFree[year] ?? riskFree[String(year)] ?? 0.005;
    const rm = benchmark[year] ?? benchmark[String(year)];
    const vol = annualiseVol(stdev(daily));
    return {
      year, ret, benchmark: rm, riskFree: rf, vol,
      alpha: Number.isFinite(rm) ? ret - (rf + portfolioBeta * (rm - rf)) : NaN,
      sharpe: (ret - rf) / vol,
      treynor: portfolioBeta ? (ret - rf) / portfolioBeta : NaN,
      beatIndex: Number.isFinite(rm) ? ret > rm : null,
    };
  });
}

/* ------------------------------------------------------------
   6 · The screen
   ------------------------------------------------------------ */
export const SCREEN_DEFAULTS = {
  maxDebtEquity: 33,      // per cent, the AAOIFI-style leverage limit
  maxEsg: 70,             // the sustainability laggard cut, on the source's 0 to 100 scale
  minRoe: 10,
  minRoicWacc: 1,
};

/**
 * The fundamental screen, applied to whatever candidates are
 * passed in. The debt limit is the binding one: on a strict
 * reading almost nothing on a UK mid-cap list survives a 33%
 * debt-to-equity test, which is why the page shows the count at
 * each step rather than only the survivors.
 */
export function screen(companies, rules = SCREEN_DEFAULTS) {
  return companies.map((c) => {
    const fails = [];
    if (c.de > rules.maxDebtEquity) fails.push("leverage");
    if (c.esg * 10 > rules.maxEsg) fails.push("ESG");
    if (c.roe < rules.minRoe) fails.push("return on equity");
    if (c.roicWacc < rules.minRoicWacc) fails.push("ROIC below WACC");
    return { ...c, fails, passes: fails.length === 0 };
  });
}

/** Expected return from the security market line, at the screening date. */
export const capmExpected = (beta, { riskFree, marketReturn } = CAPM) =>
  riskFree + beta * (marketReturn - riskFree);

/* ------------------------------------------------------------
   7 · The whole thing
   ------------------------------------------------------------ */
export const DEFAULTS = {
  cap: 0.35,
  shrinkage: 0,
  /* The fund as it was built and held. The other four are
     comparisons, offered because the frontier chart marks them
     anyway and a reader is entitled to ask what the alternatives
     would have done. */
  strategy: "asbuilt",      // "asbuilt" | "minvar" | "tangency" | "equal"
  /* Weights held constant, which is how the fund was run and
     reported: the alternative, buying once and never trading, is
     a different strategy and is offered as one. */
  mode: "rebalance",        // "rebalance" | "hold"
  riskFree: 0.005,
  useAll: false,            // optimise over all thirteen candidates, or only the ten held
};

export const DRIVERS = [
  { key: "cap", label: "Maximum weight", fmt: "pct01", min: 0.1, max: 1, step: 0.05,
    help: "No holding may exceed this share. Without a cap, a mean-variance optimiser on ten assets routinely puts half the fund in one name, which is a statement about the estimation error rather than about the company." },
  { key: "shrinkage", label: "Covariance shrinkage", fmt: "pct01", min: 0, max: 1, step: 0.05,
    help: "Pulls the off-diagonal terms towards zero. Ten assets means fifty-five parameters estimated from 252 days, and the optimiser leans hardest on the least reliable of them." },
  { key: "riskFree", label: "Risk-free rate", fmt: "pct01", min: 0, max: 0.06, step: 0.0025,
    help: "Used for the tangency portfolio and every Sharpe ratio on the page. UK three-month bills paid well under one per cent through this period." },
];

/**
 * Estimate on the 2015 window, choose weights, then test them on
 * 2016 to 2020 without ever looking at those years first.
 */
export function run(a = DEFAULTS) {
  const tickers = a.useAll ? TICKERS : HELD;
  const R = returnMatrix(PRICES_2015, tickers);
  const muDaily = tickers.map((_, j) => mean(R.map((r) => r[j])));
  const sample = covariance(R);
  const S = shrink(sample, a.shrinkage);

  const opts = { cap: a.cap };
  const front = frontier(muDaily, S, opts);
  const mv = minimumVariance(S, opts);
  const tan = tangency(muDaily, S, a.riskFree, opts, front);
  const eq = equalWeight(tickers.length);
  const iv = inverseVariance(S);

  const built = asBuiltWeights(tickers);
  const chosen = {
    asbuilt: built,
    minvar: mv,
    tangency: tan ? tan.weights : mv,
    equal: eq,
    inverse: iv,
  }[a.strategy] ?? built;

  const point = (w) => ({
    weights: w,
    ret: annualiseReturn(portfolioReturn(w, muDaily)),
    vol: annualiseVol(portfolioVol(w, S)),
    sharpe: (annualiseReturn(portfolioReturn(w, muDaily)) - a.riskFree)
      / annualiseVol(portfolioVol(w, S)),
  });

  /* ---- the hold-out ----
     Only the ten that were actually held have prices after 2015,
     so a portfolio chosen over all thirteen is tested on the
     subset it can be tested on, with its weights renormalised.
     The page says so rather than quietly dropping the rest. */
  const testable = tickers.filter((t) => PRICES_OOS[t]);
  const map = testable.map((t) => tickers.indexOf(t));
  const renorm = (w) => {
    const part = map.map((i) => w[i]);
    const total = sum(part);
    return total > 0 ? part.map((x) => x / total) : equalWeight(part.length);
  };

  const build = (w) => {
    const nav = backtest(renorm(w), PRICES_OOS, testable, { mode: a.mode });
    return {
      nav,
      underwater: underwater(nav),
      performance: performance(nav, DATES_OOS, { riskFree: a.riskFree }),
      annual: annualReturns(nav, DATES_OOS),
    };
  };

  const out = {
    tickers, testable,
    mu: muDaily,
    sample, S,
    correlation: correlationOf(S),
    frontier: front,
    points: {
      minvar: point(mv),
      tangency: point(tan ? tan.weights : mv),
      equal: point(eq),
      inverse: point(iv),
      asbuilt: point(built),
      chosen: point(chosen),
    },
    weights: chosen,
    risk: riskContributions(chosen, S),
    holdout: {
      chosen: build(chosen),
      asbuilt: build(built),
      equal: build(eq),
      minvar: build(mv),
    },
    beta: betaContribution(chosen, tickers),
    benchmark: BENCHMARK_ANNUAL,
  };

  /* The frontier drawn on the years the optimiser never saw. The
     2015 choice is plotted on it, and the distance between that
     point and the realised frontier is the part of this exercise
     that no amount of in-sample optimisation can close. */
  const Ro = returnMatrix(PRICES_OOS, testable);
  const muO = testable.map((_, j) => mean(Ro.map((r) => r[j])));
  const So = covariance(Ro);
  out.realised = {
    mu: muO, S: So,
    frontier: frontier(muO, So, { cap: a.cap, points: 30 }),
    chosen: {
      ret: annualiseReturn(portfolioReturn(renorm(chosen), muO)),
      vol: annualiseVol(portfolioVol(renorm(chosen), So)),
    },
    equal: {
      ret: annualiseReturn(portfolioReturn(equalWeight(testable.length), muO)),
      vol: annualiseVol(portfolioVol(equalWeight(testable.length), So)),
    },
  };

  return out;
}

/* ------------------------------------------------------------
   8 · CSV
   ------------------------------------------------------------ */
export function toCsv(a = DEFAULTS) {
  const r = run(a);
  const esc = (s) => (typeof s === "string" && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const L = [];
  const row = (...c) => L.push(c.map(esc).join(","));
  const f = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : "");

  row("Screened FTSE 250 portfolio: construction and hold-out test");
  row(`Estimation window ${DATES_2015[0]} to ${DATES_2015[DATES_2015.length - 1]}`);
  row(`Hold-out window ${DATES_OOS[0]} to ${DATES_OOS[DATES_OOS.length - 1]}`);
  row("");

  row("SETTINGS");
  DRIVERS.forEach((d) => row(d.label, f(a[d.key])));
  row("Strategy", a.strategy);
  row("Rebalancing", a.mode === "hold" ? "buy and hold" : "weights held constant");
  row("");

  row("WEIGHTS AND RISK");
  row("Ticker", "Name", "Weight", "Daily vol 2015", "Share of portfolio risk");
  r.tickers.forEach((t, i) => {
    const c = COMPANIES.find((x) => x.ticker === t);
    row(t, c ? c.name : t, f(r.weights[i]), f(Math.sqrt(r.S[i][i]), 5), f(r.risk.share[i]));
  });
  row("");

  row("ESTIMATION WINDOW, ANNUALISED");
  ["chosen", "minvar", "tangency", "equal", "inverse"].forEach((k) => {
    row(k, "return", f(r.points[k].ret), "volatility", f(r.points[k].vol), "Sharpe", f(r.points[k].sharpe));
  });
  row("");

  row("HOLD-OUT WINDOW");
  row("", "Chosen", "Equal weight", "Minimum variance");
  const p = (k) => r.holdout[k].performance;
  [["Cumulative", "cumulative"], ["CAGR", "cagr"], ["Volatility", "vol"],
    ["Sharpe", "sharpe"], ["Sortino", "sortino"], ["Max drawdown", "maxDrawdown"]]
    .forEach(([label, key]) => row(label, f(p("chosen")[key]), f(p("equal")[key]), f(p("minvar")[key])));
  row("");

  row("CALENDAR YEARS");
  row("Year", "Chosen", "Equal weight", "FTSE 250");
  r.holdout.chosen.annual.forEach((x, i) =>
    row(x.year, f(x.ret), f(r.holdout.equal.annual[i].ret), f(BENCHMARK_ANNUAL[x.year] ?? NaN)));

  return L.join("\n");
}
