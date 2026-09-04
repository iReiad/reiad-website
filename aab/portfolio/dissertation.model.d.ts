/* dissertation.model.js, described. Hand-written, and it covers
   ONLY what `dissertation.test.ts` imports: nothing compiles the
   module, so that file is the source of truth and a change there
   is a change here. */

export declare function lgamma(x: number): number;
export declare function incBeta(x: number, a: number, b: number): number;
export declare function normCdf(z: number): number;
export declare function tCdf(t: number, df: number): number;
export declare function tTwoTail(t: number, df: number): number;
export declare function tQuantile(p: number, df: number): number;
export declare function nctCdf(t: number, df: number, delta: number): number;

/** Welch's unequal-variance two-sample t-test. */
export declare function welch(args: {
  m1: number; s1: number; n1: number;
  m2: number; s2: number; n2: number;
}): { diff: number; se: number; t: number; df: number; p: number };

export declare function power(args: {
  n1: number; n2: number; sd1: number; sd2: number;
  delta: number; alpha?: number;
}): number;

export declare function minDetectable(args: {
  n1: number; n2: number; sd1: number; sd2: number;
  alpha?: number; target?: number;
}): number;

export declare function rebase(series: readonly number[], base?: number): number[];
export declare function underwater(levels: readonly number[]): number[];
export declare function maxDrawdown(levels: readonly number[]): number;
export declare function cagrMonthly(levels: readonly number[]): number;
export declare function volMonthly(levels: readonly number[]): number;
export declare function quantileSorted(sorted: readonly number[], p: number): number;

/** Tukey box-plot statistics. `null` for a sample with no finite
    value in it, which is why a caller has to look. */
export declare function boxStats(values: readonly number[]): {
  n: number; min: number; max: number;
  q1: number; med: number; q3: number; iqr: number; mean: number;
  whiskerLo: number; whiskerHi: number;
  outliers: number[];
  sd: number;
} | null;

/** A histogram as the data module ships one: counts at a fixed
    width from `lo`, with the tails held outside the bins. */
export interface Histogram {
  lo: number;
  width: number;
  bins: number[];
}

export declare function rebin(
  hist: Histogram,
  opts?: { factor?: number; lo?: number; hi?: number },
): Array<{ from: number; to: number; mid: number; count: number }>;

/** "2018-01" plus `i` months, in the same spelling. */
export declare function monthKey(startYm: string, i: number): string;
