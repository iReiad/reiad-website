/* ============================================================
   dissertation.data.js, described.

   Hand-written, and it covers ONLY what `dissertation.test.ts`
   imports: the module is plain JavaScript the page loads at
   runtime, and nothing compiles it. Every shape below was read
   off that file, which is the source of truth.

   `app/src/types/README.md` is the same practice one directory
   along and says why it is preferred to silencing an untyped
   import.
   ============================================================ */

/** FTSE 100 monthly close, 91 months from `UKX_FROM`. */
export declare const UKX: number[];
/** MIGB monthly close, 90 months, one month later. */
export declare const MIGB: number[];

/** Drawdown from the running peak, as a negative fraction. The
    Islamic series starts a month later, so its first entry is
    `null` rather than a zero nobody measured. */
export declare const DD_CONVENTIONAL: number[];
export declare const DD_ISLAMIC: Array<number | null>;

/** One residual standard error per fund, sorted ascending. */
export declare const FUND_SD: number[];

export declare const EXCESS_HIST: {
  lo: number;
  width: number;
  bins: number[];
  below: number[];
  above: number[];
};

export declare const EXCESS_STATS: {
  n: number;
  mean: number;
  sd: number;
  skew: number;
  exkurt: number;
  min: number;
  max: number;
  /** Keyed by the quantile as it is written, "0.001" to "0.999". */
  q: Record<string, number>;
};

export declare const SAMPLE: {
  months: number;
  excessRows: number;
  funds: { islamic: number; conventional: number; total: number; [key: string]: number };
  observations: { islamic: number; conventional: number; total: number; [key: string]: number };
};

export declare const UNIVARIATE: Array<{
  key: string;
  label: string;
  islamic: number;
  conventional: number;
  p: number;
}>;

/** One estimated coefficient, with its 95% interval. */
export interface Coefficient {
  name: string;
  label: string;
  b: number;
  se: number;
  t: number;
  p: number;
  lo: number;
  hi: number;
}

export interface Regression {
  key: string;
  label: string;
  n: number;
  r2: number;
  adjR2: number;
  coefs: Coefficient[];
}

/** Keyed by specification. `pooled` is the one carrying the
    Islamic dummy, which is the whole research question. */
export declare const REGRESSIONS: Record<string, Regression> & { pooled: Regression };

export declare const IVOL: {
  islamic: { n: number; mean: number; median: number; sd: number };
  conventional: { n: number; mean: number; median: number; sd: number };
  diff: number;
  p: number;
};

export declare const MDD: {
  islamic: number;
  conventional: number;
  p: number;
};
