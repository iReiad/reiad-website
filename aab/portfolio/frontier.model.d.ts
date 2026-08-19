/* ============================================================
   frontier.model.js, described.

   Hand-written, and it covers ONLY what `frontier.test.ts`
   imports, which includes the eleven names the model re-exports
   out of `frontier.data.js`. The module is plain JavaScript the
   page loads at runtime and nothing compiles it, so every
   signature below was read off that file, which is the source of
   truth; a field this does not name may still exist there.

   `app/src/types/README.md` is the same practice one directory
   along and says why it is preferred to silencing an untyped
   import.
   ============================================================ */

/* ---------- the shipped data, re-exported by the model ---------- */

export interface Company {
  ticker: string;
  name: string;
  sector: string;
  /** Debt to equity, per cent. */
  de: number;
  esg: number;
  beta: number;
  roe: number;
  roicWacc: number;
  dividendYield: number;
  pe: number;
  held: boolean;
}

export declare const COMPANIES: Company[];
/** The thirteen candidates, and the ten that were held. */
export declare const TICKERS: string[];
export declare const HELD: string[];

/** ISO dates, ascending. */
export declare const DATES_2015: string[];
export declare const DATES_OOS: string[];

/** One close per date in the matching window, by ticker. */
export declare const PRICES_2015: Record<string, number[]>;
export declare const PRICES_OOS: Record<string, number[]>;

/** By calendar year, as a string key. */
export declare const RISK_FREE: Record<string, number>;
export declare const BENCHMARK_ANNUAL: Record<string, number>;

export declare const CAPM: { riskFree: number; marketReturn: number };

/** What the extraction saw, for the test to check the shipped
    prices against. */
export declare const CHECKS: {
  days2015: number;
  daysOos: number;
  companies: number;
  held: number;
  firstDate2015: string;
  lastDate2015: string;
  firstDateOos: string;
  lastDateOos: string;
  sigma2015: Record<string, number>;
  priceSums: Record<string, number>;
};

export declare const TRADING_DAYS: number;

/* ---------- returns and covariance ---------- */

export declare function returnsOf(prices: readonly number[]): number[];
export declare function returnMatrix(
  prices: Record<string, number[]>,
  tickers: readonly string[],
): number[][];
export declare function stdev(xs: readonly number[]): number;
export declare function covariance(R: readonly number[][]): number[][];
export declare function correlationOf(S: readonly number[][]): number[][];
/** Pulls the off-diagonal terms towards zero, diagonal untouched. */
export declare function shrink(S: readonly number[][], delta: number): number[][];

export declare function portfolioReturn(
  w: readonly number[],
  mu: readonly number[],
): number;
export declare function portfolioVariance(
  w: readonly number[],
  S: readonly number[][],
): number;
export declare function portfolioVol(
  w: readonly number[],
  S: readonly number[][],
): number;

export declare function annualiseReturn(daily: number): number;
export declare function annualiseVol(daily: number): number;

export declare function riskContributions(
  w: readonly number[],
  S: readonly number[][],
): { vol: number; marginal: number[]; component: number[]; share: number[] };

/* ---------- optimisation ---------- */

/** Euclidean projection onto the capped simplex. Throws where the
    cap cannot hold weights summing to one. */
export declare function projectToSimplex(v: readonly number[], cap?: number): number[];

export interface OptimiseOptions {
  gamma?: number;
  cap?: number;
  iterations?: number;
  tol?: number;
  start?: number[] | null;
}

export declare function optimise(
  mu: readonly number[],
  S: readonly number[][],
  opts?: OptimiseOptions,
): number[];

export declare function minimumVariance(
  S: readonly number[][],
  opts?: OptimiseOptions,
): number[];

export interface FrontierPoint {
  gamma: number;
  weights: number[];
  ret: number;
  vol: number;
}

export declare function frontier(
  mu: readonly number[],
  S: readonly number[][],
  opts?: { cap?: number; points?: number; gammaLo?: number; gammaHi?: number },
): { all: FrontierPoint[]; efficient: FrontierPoint[] };

/** `null` where the frontier came back empty and there is no
    portfolio to be tangent to. */
export declare function tangency(
  mu: readonly number[],
  S: readonly number[][],
  rf: number,
  opts?: OptimiseOptions,
  precomputed?: { all: FrontierPoint[]; efficient: FrontierPoint[] } | null,
): (FrontierPoint & { sharpe: number }) | null;

export declare function equalWeight(n: number): number[];
export declare function inverseVariance(S: readonly number[][]): number[];

/** The weights the money was actually in, by ticker. */
export declare const AS_BUILT: Record<string, number>;
/** Those weights in the order asked for, renormalised. A ticker
    the fund never held gets nothing. */
export declare function asBuiltWeights(tickers: readonly string[]): number[];

export declare function betaContribution(
  weights: readonly number[],
  tickers: readonly string[],
  companies?: readonly Company[],
): {
  rows: Array<{ ticker: string; weight: number; beta: number; contribution: number }>;
  portfolio: number;
};

/* ---------- the hold-out ---------- */

export declare function backtest(
  w: readonly number[],
  prices: Record<string, number[]>,
  tickers: readonly string[],
  opts?: { mode?: "hold" | "rebalance" },
): number[];

export declare function underwater(nav: readonly number[]): number[];

export interface Performance {
  cumulative: number;
  cagr: number;
  vol: number;
  years: number;
  sharpe: number;
  sortino: number;
  maxDrawdown: number;
  calmar: number;
  best: number;
  worst: number;
  hitRate: number;
}

export declare function performance(
  nav: readonly number[],
  dates: readonly string[],
  opts?: { riskFree?: number },
): Performance;

export declare function annualReturns(
  nav: readonly number[],
  dates: readonly string[],
): Array<{ year: number; ret: number }>;

export interface YearRow {
  year: number;
  ret: number;
  benchmark: number;
  riskFree: number;
  vol: number;
  alpha: number;
  sharpe: number;
  treynor: number;
  /** `null` where the year has no benchmark to be beaten. */
  beatIndex: boolean | null;
}

export declare function yearTable(
  nav: readonly number[],
  dates: readonly string[],
  portfolioBeta: number,
  opts?: {
    benchmark?: Record<string, number>;
    riskFree?: Record<string, number>;
  },
): YearRow[];

/* ---------- the screen ---------- */

export interface ScreenRules {
  maxDebtEquity: number;
  maxEsg: number;
  minRoe: number;
  minRoicWacc: number;
}

export declare const SCREEN_DEFAULTS: ScreenRules;

export declare function screen(
  companies: readonly Company[],
  rules?: ScreenRules,
): Array<Company & { fails: string[]; passes: boolean }>;

export declare function capmExpected(
  beta: number,
  capm?: { riskFree: number; marketReturn: number },
): number;

/* ---------- the whole pipeline ---------- */

export interface Assumptions {
  cap: number;
  shrinkage: number;
  strategy: "asbuilt" | "minvar" | "tangency" | "equal" | "inverse";
  mode: "hold" | "rebalance";
  riskFree: number;
  useAll: boolean;
}

export declare const DEFAULTS: Assumptions;

export declare const DRIVERS: Array<{
  key: string;
  label: string;
  fmt: string;
  min: number;
  max: number;
  step: number;
  help: string;
}>;

export interface PortfolioPoint {
  weights: number[];
  ret: number;
  vol: number;
  sharpe: number;
}

export interface HoldoutPath {
  nav: number[];
  underwater: number[];
  performance: Performance;
  annual: Array<{ year: number; ret: number }>;
}

export interface RunResult {
  tickers: string[];
  testable: string[];
  mu: number[];
  sample: number[][];
  S: number[][];
  correlation: number[][];
  frontier: { all: FrontierPoint[]; efficient: FrontierPoint[] };
  /** Keyed by strategy: minvar, tangency, equal, inverse,
      asbuilt and chosen. */
  points: Record<string, PortfolioPoint>;
  weights: number[];
  risk: { vol: number; marginal: number[]; component: number[]; share: number[] };
  /** Keyed by strategy: chosen, asbuilt, equal and minvar. */
  holdout: Record<string, HoldoutPath>;
  beta: {
    rows: Array<{ ticker: string; weight: number; beta: number; contribution: number }>;
    portfolio: number;
  };
  benchmark: Record<string, number>;
  /** The frontier drawn on the years the optimiser never saw. */
  realised: {
    mu: number[];
    S: number[][];
    frontier: { all: FrontierPoint[]; efficient: FrontierPoint[] };
    chosen: { ret: number; vol: number };
    equal: { ret: number; vol: number };
  };
}

export declare function run(a?: Assumptions): RunResult;
export declare function toCsv(a?: Assumptions): string;
