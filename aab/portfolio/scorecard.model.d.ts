/* scorecard.model.js, described. Hand-written, and it covers
   ONLY what `scorecard.test.ts` imports, including the four names
   the model re-exports out of `scorecard.data.js`. Nothing
   compiles the module, so that file is the source of truth and a
   field this does not name may still exist there. */

/** One application: twenty attributes in SCHEMA order, then the
    label at `TARGET`, which is 1 if the loan went bad. */
export type Row = number[];

/* ---------- the shipped data, re-exported by the model ---------- */

export interface NumericColumn {
  key: string;
  name: string;
  short: string;
  type: "num";
  unit?: string;
  protected?: true;
}

export interface CategoricalColumn {
  key: string;
  name: string;
  short: string;
  type: "cat";
  protected?: true;
  /** `[code, label]`, the source's own codes in the source's
      order. A converted row carries the index into this. */
  levels: Array<[string, string]>;
}

export type Column = NumericColumn | CategoricalColumn;

export declare const ROWS: Row[];
export declare const SCHEMA: Column[];

export declare const SOURCE: {
  name: string;
  author: string;
  year: number;
  publisher: string;
  doi: string;
  url: string;
  licence: string;
  md5: string;
  fetched: string;
  /** The dataset's own: a bad loan approved costs five times a
      good applicant turned away. */
  costMatrix: { falseGood: number; falseBad: number };
};

/** What the conversion saw, for the test to check the rows
    against. */
export declare const CHECKS: {
  rows: number;
  bad: number;
  good: number;
  numericSums: Record<string, number>;
  numericRanges: Record<string, [number, number]>;
  levelCounts: Record<string, number[]>;
  emptyLevels: string[];
};

/* ---------- the numbers behind the p-values ---------- */

export declare function normCdf(x: number): number;
export declare function twoSided(z: number): number;
export declare function sigmoid(x: number): number;

/** A seeded generator, so every fit on this page is repeatable. */
export declare function rng(seed: number): () => number;
export declare function shuffle<T>(xs: T[], rand: () => number): T[];

/* ---------- features ---------- */

export interface NumericFeature {
  key: string;
  name: string;
  short: string;
  unit?: string;
  kind: "num";
  column: number;
  protectedAttr: boolean;
  level?: undefined;
  code?: undefined;
  label?: undefined;
  attribute?: undefined;
  attributeName?: undefined;
  attributeShort?: undefined;
  isReference?: undefined;
  n?: undefined;
}

export interface DummyFeature {
  key: string;
  name: string;
  short: string;
  kind: "dummy";
  column: number;
  level: number;
  code: string;
  label: string;
  attribute: string;
  attributeName: string;
  attributeShort: string;
  /** The most common level of the attribute, which is the one
      every other level is quoted against. */
  isReference: boolean;
  protectedAttr: boolean;
  /** How many rows carry this level. Never zero: a level with no
      applicants in it gets no feature. */
  n: number;
}

export type Feature = NumericFeature | DummyFeature;

export declare const TARGET: number;
export declare const FEATURES: Feature[];

export declare function buildFeatures(schema?: Column[], rows?: Row[]): Feature[];
export declare function featureValue(f: Feature, row: Row): number;
export declare function designMatrix(rows: Row[], features?: Feature[]): number[][];
export declare function labels(rows: Row[]): number[];

/* ---------- splitting and scaling ---------- */

export declare function stratifiedSplit(
  rows: Row[],
  opts?: { testFraction?: number; seed?: number },
): { train: Row[]; test: Row[]; trainIdx: number[]; testIdx: number[] };

export declare function stratifiedFolds(
  rows: Row[],
  opts?: { k?: number; seed?: number },
): Row[][];

export interface Scaler {
  mu: number[];
  sd: number[];
}

export declare function fitScaler(X: number[][]): Scaler;
export declare function applyScaler(X: number[][], scaler: Scaler): number[][];

/* ---------- weight of evidence ---------- */

export declare function binEdges(values: readonly number[], bins?: number): number[];
export declare function binOf(v: number, edges: readonly number[]): number;

export interface WoeRow {
  n: number;
  good: number;
  bad: number;
  badRate: number;
  pGood: number;
  pBad: number;
  woe: number;
  contribution: number;
}

export declare function woeTable(
  groups: Row[][],
  opts?: { correction?: number },
): { table: WoeRow[]; iv: number };

export declare function informationValues(
  trainRows: Row[],
  opts?: { bins?: number; schema?: Column[] },
): Array<{
  key: string;
  name: string;
  short: string;
  type: "num" | "cat";
  protectedAttr: boolean;
  iv: number;
  bands: Array<WoeRow & { label: string }>;
}>;

export declare function ivBand(iv: number): string;

/* ---------- linear algebra and logistic regression ---------- */

export declare function solve(A: number[][], b: number[]): number[];
export declare function invert(A: number[][]): number[][];

export interface LogisticFit {
  beta: number[];
  intercept: number;
  coefficients: number[];
  se: number[];
  z: number[];
  p: number[];
  logLik: number;
  iterations: number;
  converged: boolean;
  ridge: number;
  aic: number;
  predict(Xnew: number[][]): number[];
}

export declare function fitLogistic(
  X: number[][],
  y: number[],
  opts?: { ridge?: number; maxIter?: number; tol?: number },
): LogisticFit;

/* ---------- gradient boosting ---------- */

export declare function fitBinner(X: number[][], maxBins?: number): number[][];
export declare function applyBinner(X: number[][], edges: number[][]): number[][];

export interface GbmOptions {
  nTrees: number;
  learningRate: number;
  maxDepth: number;
  minChildWeight: number;
  lambda: number;
  gamma: number;
  subsample: number;
  colsample: number;
  maxBins: number;
  seed: number;
}

export declare const GBM_DEFAULTS: GbmOptions;

/** A node starts as a leaf and gains the five split fields when
    it is split, so those five are absent on a leaf. */
export interface GbmNode {
  leaf: boolean;
  value: number;
  n: number;
  G: number;
  H: number;
  feature?: number;
  bin?: number;
  gain?: number;
  left?: number;
  right?: number;
}

export interface GbmTree {
  nodes: GbmNode[];
  root: number;
}

export interface GbmFit {
  trees: GbmTree[];
  edges: number[][];
  base0: number;
  options: GbmOptions;
  history: Array<{ tree: number; train: number; watch?: number }>;
  gains: number[];
  bestIteration: number;
  raw(Xnew: number[][]): number[];
  predict(Xnew: number[][]): number[];
  /** Exact per-feature attribution for one row: the parts sum to
      the prediction. */
  explain(row: number[]): { base: number; contributions: number[] };
}

export declare function fitGbm(
  X: number[][],
  y: number[],
  opts?: Partial<GbmOptions>,
  watch?: { X: number[][]; y: number[] } | null,
): GbmFit;

/* ---------- metrics ---------- */

export declare function logLoss(y: number[], p: number[]): number;
export declare function brier(y: number[], p: number[]): number;

export declare function roc(y: number[], score: number[]): {
  points: Array<{ fpr: number; tpr: number; threshold: number }>;
  auc: number;
  nPos: number;
  nNeg: number;
  ks: number;
};

export declare function aucMannWhitney(y: number[], score: number[]): number;

export declare function precisionRecall(y: number[], score: number[]): {
  points: Array<{ recall: number; precision: number }>;
  averagePrecision: number;
  baseline: number;
};

export declare function aucStandardError(auc: number, nPos: number, nNeg: number): number;

/** Where one class is empty there is nothing to compare, so the
    answer is these three fields and no comparison. */
export interface DelongDegenerate {
  difference: number;
  z: number;
  p: number;
  se?: undefined;
}

export interface DelongComparison {
  aucA: number;
  aucB: number;
  difference: number;
  se: number;
  z: number;
  p: number;
  ci: [number, number];
  correlation: number;
}

export type Delong = DelongDegenerate | DelongComparison;

export declare function delong(y: number[], scoreA: number[], scoreB: number[]): Delong;

/* ---------- thresholds, costs and lift ---------- */

export interface Confusion {
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  threshold: number;
  accuracy: number;
  precision: number;
  recall: number;
  specificity: number;
  approvalRate: number;
  cost: number;
  costPerApplicant: number;
}

export declare function confusion(
  y: number[],
  p: number[],
  threshold: number,
  cost?: { falseGood: number; falseBad: number },
): Confusion;

export interface CostPoint {
  threshold: number;
  cost: number;
  costPerApplicant: number;
  approvalRate: number;
}

export declare function costCurve(
  y: number[],
  p: number[],
  cost?: { falseGood: number; falseBad: number },
  steps?: number,
): { points: CostPoint[]; best: CostPoint };

export interface Calibration {
  bins: Array<{ n: number; predicted: number; observed: number; lo: number; hi: number }>;
  reliability: number;
  resolution: number;
  uncertainty: number;
  brier: number;
  decomposed: number;
}

export declare function calibration(y: number[], p: number[], buckets?: number): Calibration;

export declare function fitPlatt(scoresRaw: number[], y: number[]): {
  a: number;
  b: number;
  apply(raw: number[]): number[];
};

export declare function liftTable(y: number[], p: number[], bands?: number): Array<{
  band: number;
  n: number;
  bad: number;
  badRate: number;
  lift: number;
  cumulativeBadShare: number;
  cumulativeShare: number;
}>;

/* ---------- scorecard points ---------- */

export declare function pointsScaling(
  opts?: { target: number; targetOdds: number; pdo: number },
): { factor: number; offset: number };

export declare function scorePoints(
  fit: LogisticFit,
  xRow: number[],
  scaling?: { factor: number; offset: number },
): { per: number[]; total: number };

/* ---------- importance and partial dependence ---------- */

export interface Importance {
  feature: Feature | { key: string; short: string };
  key: string;
  name: string;
  drop: number;
}

export declare function permutationImportance(
  predict: (X: number[][]) => number[],
  X: number[][],
  y: number[],
  opts?: {
    repeats?: number;
    seed?: number;
    features?: Array<Feature | { key: string; short: string }>;
  },
): Importance[];

export declare function byAttribute(importances: Importance[]): Array<{
  key: string;
  name: string;
  drop: number;
  protectedAttr: boolean;
}>;

export declare function partialDependence(
  predict: (X: number[][]) => number[],
  X: number[][],
  j: number,
  opts?: { grid?: number },
): Array<{ value: number; prediction: number }>;

/* ---------- fair lending ---------- */

export declare const GROUPS: Record<string, {
  name: string;
  column: number;
  of(row: Row): string;
  levels: string[];
}>;

export declare function fairness(
  rows: Row[],
  p: number[],
  threshold: number,
  groupKey?: string,
): {
  group: string;
  stats: Array<{
    level: string;
    n: number;
    approvalRate: number;
    badRate: number;
    meanScore: number;
    auc: number;
  }>;
  ratio: number;
  passesFourFifths: boolean;
};

/* ---------- the whole pipeline ---------- */

export type Assumptions = GbmOptions & {
  seed: number;
  testFraction: number;
  ridge: number;
  threshold: number;
  useProtected: boolean;
  calibrate: boolean;
  folds: number;
  ivBins: number;
};

export declare const DEFAULTS: Assumptions;

export declare const DRIVERS: Array<{
  key: string;
  label: string;
  group: string;
  fmt: string;
  min: number;
  max: number;
  step: number;
  help: string;
}>;

export interface Metrics {
  auc: number;
  gini: number;
  ks: number;
  logLoss: number;
  brier: number;
  se: number;
}

export interface RunResult {
  features: Feature[];
  logitCols: number[];
  scaler: Scaler;
  train: Row[];
  test: Row[];
  inner: { train: Row[]; test: Row[]; trainIdx: number[]; testIdx: number[] };
  Xall: number[][];
  Xtest: number[][];
  yAll: number[];
  yTest: number[];
  logit: LogisticFit;
  gbm: GbmFit;
  gbmWatch: GbmFit;
  platt: { a: number; b: number; apply(raw: number[]): number[] } | null;
  scores: {
    logit: { train: number[]; test: number[] };
    gbm: { train: number[]; test: number[]; uncalibrated: number[] };
  };
  metrics: {
    logit: Metrics;
    gbm: Metrics;
    /** Fitted rows rather than unseen ones, so only the AUC. */
    logitTrain: { auc: number };
    gbmTrain: { auc: number };
  };
  compare: Delong;
  calibration: { gbm: Calibration; uncalibrated: Calibration; logit: Calibration };
  confusion: { logit: Confusion; gbm: Confusion };
  baseRate: number;
}

export declare function run(a?: Assumptions, rows?: Row[]): RunResult;

export declare function crossValidate(
  a?: Assumptions,
  rows?: Row[],
  opts?: { k?: number; repeats?: number },
): {
  k: number;
  repeats: number;
  n: number;
  logit: { mean: number; sd: number; values: number[] };
  gbm: { mean: number; sd: number; values: number[] };
  difference: {
    mean: number;
    sd: number;
    se: number;
    values: number[];
    ci: [number, number];
    wins: number;
  };
};

export declare function toCsv(a?: Assumptions, rows?: Row[]): string;
