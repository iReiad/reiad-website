/* stress.model.js, described. Hand-written, and it covers ONLY
   what `stress.test.ts` imports: nothing compiles the module, so
   that file is the source of truth and a field this does not
   name may still exist there. */

/** Which Basel correlation function a segment is treated under.
    Not cosmetic: it decides the whole capital treatment. */
export type SegmentKind = "mortgage" | "retail" | "qrre" | "corporate";

/** The six macro variables, which are also the six peak shocks a
    scenario carries. */
export type MacroKey =
  | "unemployment" | "gdp" | "policyRate" | "inflation" | "fx" | "property";

/** Every assumption the page can move, which is every numeric
    field of DEFAULTS. */
export type DriverKey =
  | MacroKey
  | "quartersToPeak" | "halfLife"
  | "macroSensitivity" | "correlationScale" | "lgdDownturn"
  | "ccfStress" | "underwriting"
  | "sicrThreshold" | "sicrDispersion" | "ppnrRateBeta" | "writeOffLag";

/** The assumptions a run is made under. Every `DriverKey` is a
    number, which is what lets the sensitivity grid and the
    reverse stress build one from a computed key. */
export type Assumptions =
  & Record<DriverKey, number>
  & {
    scenario: string;
    engine: "merton" | "vintage";
    rwaBasis: "ttc" | "hybrid" | "pit";
  };

export interface Vintage {
  year: number;
  share: number;
  quality: number;
  ageMonths: number;
}

export interface Segment {
  id: string;
  name: string;
  kind: SegmentKind;
  ead: number;
  undrawn: number;
  ccf: number;
  pdTtc: number;
  lgdBase: number;
  lgdFloor: number;
  collateralCoverage: number;
  sellingCosts: number;
  secured: boolean;
  maturity: number;
  peakMonth: number;
  hazardSharpness: number;
  sicrDispersion: number;
  stage3Opening: number;
  /** Weights that turn standardised macro shocks into one
      systematic factor. They sum to one. */
  betas: Record<MacroKey, number>;
  vintages: Vintage[];
  /** Set by `parsePortfolioCsv` on a book the reader brought. */
  imported?: true;
}

export interface Book {
  name: string;
  short: string;
  unit: string;
  asOf: string;
  horizonQuarters: number;
  note: string;
  cet1: number;
  ppnr: number;
  taxRate: number;
  payout: number;
  payoutStopsAbove: number;
  requirement: number;
  minimumCet1: number;
}

export interface MacroVariable {
  key: MacroKey;
  label: string;
  short: string;
  unit: string;
  base: number;
  sd: number;
  badWhen: "up" | "down";
  axis: string;
}

export interface Scenario {
  id: string;
  label: string;
  blurb: string;
  peaks: Record<MacroKey, number>;
}

export interface Driver {
  key: DriverKey;
  label: string;
  group: string;
  fmt: string;
  min: number;
  max: number;
  step: number;
}

export declare const BOOK: Book;
export declare const SEGMENTS: Segment[];
export declare const MACRO: MacroVariable[];
export declare const DEFAULTS: Assumptions;
export declare const DRIVERS: Driver[];
export declare const SCENARIOS:
  & Record<string, Scenario>
  & { base: Scenario; adverse: Scenario; severe: Scenario };

/* ---------- the distribution, and Basel's four formulas ---------- */

export declare function normCdf(x: number): number;
export declare function normInv(p: number): number;

export declare function correlation(
  kind: SegmentKind | string,
  pd: number,
  opts?: { sizeAdjustment?: number; scale?: number },
): number;

export declare function maturityAdjustment(pd: number, maturity: number): number;

export interface CapitalArgs {
  pd: number;
  lgd: number;
  kind: SegmentKind | string;
  maturity?: number;
  sizeAdjustment?: number;
  scale?: number;
}

export declare function capitalRequirement(args: CapitalArgs): number;
export declare function riskWeight(args: CapitalArgs): number;

/* ---------- Merton, conditional on the economy ---------- */

export declare function conditionalPd(pd: number, rho: number, z: number): number;
export declare function anchorZ(pd: number, rho: number): number;
export declare function shockIndex(
  levels: Record<string, number>,
  betas: Record<string, number>,
): number;
export declare function factorZ(
  levels: Record<string, number>,
  betas: Record<string, number>,
  macroSensitivity?: number,
): number;

/* ---------- the scenario path ---------- */

export declare function shape(
  q: number,
  a: { quartersToPeak: number; halfLife: number },
): number;

export interface MacroPoint {
  q: number;
  factor: number;
  levels: Record<MacroKey, number>;
}

export declare function macroPath(a: Assumptions, horizon?: number): MacroPoint[];

/* ---------- the vintage engine ---------- */

export declare function lifecycle(
  ageMonths: number,
  seg: { peakMonth: number; hazardSharpness: number },
): number;
export declare function hazardGamma(pd: number, rho: number): number;

/* ---------- loss given default, and exposure ---------- */

export declare function lgdFromCollateral(
  coverage: number,
  costs: number,
  sigma: number,
  priceShock?: number,
): number;

/** `null` where the stated loss given default cannot be
    reproduced by any dispersion, which is why a caller has to
    look. */
export declare function calibrateLgdSigma(
  coverage: number,
  costs: number,
  lgdBase: number,
): number | null;

/** `null` for an unsecured segment: there is nothing to sell. */
export declare function lgdSigma(seg: Segment): number | null;

export declare function stressedLgd(
  seg: Segment,
  opts: { propertyLevel: number; s: number; lgdDownturn?: number },
): number;

export declare function stressedEad(
  seg: Segment,
  drawn: number,
  opts: { s: number; ccfStress?: number },
): number;

/* ---------- IFRS 9 ---------- */

export declare function stage2Share(
  ratio: number,
  threshold: number,
  dispersion: number,
): number;
export declare function lifetimePd(annualPd: number, years: number): number;

/* ---------- the roll-forward ---------- */

/** One quarter of one segment. */
export interface SegmentQuarter {
  q: number;
  s: number;
  z: number;
  pd: number;
  pdMerton: number;
  pdVintage: number;
  pdVintageLink: number;
  mix: number;
  lgd: number;
  ratio: number;
  performing: number;
  stage3: number;
  ecl: number;
  charge: number;
  writeOff: number;
  rwa: number;
  k: number;
  share2: number;
  cumulativeLoss: number;
}

export interface SegmentRun {
  seg: Segment;
  rho: number;
  gamma: number;
  z0: number;
  openingEcl: number;
  quarters: SegmentQuarter[];
}

export declare function runSegment(
  seg: Segment,
  path: MacroPoint[],
  a: Assumptions,
): SegmentRun;

/** One quarter of the whole book. The first entry of `quarters`
    is the opening position rather than a period, so the four
    fields that describe a period's profit are absent from it. */
export interface Quarter {
  q: number;
  z: number;
  s: number;
  pd: number;
  pdMerton: number;
  pdVintage: number;
  pdVintageLink: number;
  lgd: number;
  loss: number;
  defaults: number;
  performing: number;
  stage1: number;
  stage2: number;
  stage3: number;
  ecl: number;
  charge: number;
  ppnr: number;
  writeOff: number;
  rwa: number;
  cet1: number;
  ratio: number;
  cumulativeLoss: number;
  levels: Record<MacroKey, number>;
  preTax?: number;
  postTax?: number;
  dividend?: number;
}

export interface Attribution {
  totalBps: number;
  fromCapital: number;
  fromRwa: number;
}

export interface EngineGap {
  q: number;
  shock: number;
  merton: number;
  vintage: number;
  link: number;
  linkGap: number;
  mixGap: number;
  ratio: number;
  mixRatio: number;
}

export interface RunResult {
  path: MacroPoint[];
  runs: SegmentRun[];
  quarters: Quarter[];
  segments: Segment[];
  book: Book;
  openingRwa: number;
  openingRatio: number;
  totalEad: number;
  trough: Quarter;
  peakLoss: Quarter;
  worstShock: number;
  worstZ: number;
  returnPeriod: number;
  absoluteReturnPeriod: number;
  capitalZ: number;
  cumulativeLoss: number;
  lossRate: number;
  headroom: number;
  shortfall: number;
  passes: boolean;
  breachesMinimum: boolean;
  attribution: Attribution;
  engineGap: EngineGap;
}

export declare function run(
  a?: Assumptions,
  segments?: Segment[],
  book?: Book,
): RunResult;

export declare function attribution(
  openingRatio: number,
  openingCet1: number,
  openingRwa: number,
  q: { ratio: number; cet1: number; rwa: number },
): Attribution;

/* ---------- the vintage curves ---------- */

export interface VintageCurve {
  label: string;
  quality: number;
  asOfAge: number;
  points: Array<{ age: number; cum: number; projected: boolean }>;
}

export declare function vintageCurves(
  seg: Segment,
  path: MacroPoint[],
  a: Assumptions,
): VintageCurve[];

/* ---------- reverse stress ---------- */

/** The search reached its ceiling without breaking the bank, so
    there is no multiple to read. */
export interface ReverseStressNotFound {
  found: false;
  max: number;
  worst: RunResult;
}

export interface ReverseStressFound {
  found: true;
  multiple: number;
  result: RunResult;
  /** Set where the book was already below the requirement with
      no scenario at all, in which case there is nothing to state
      in unemployment either. */
  alreadyBreached?: true;
  unemployment?: number;
  worstShock?: number;
  worstZ?: number;
  returnPeriod?: number;
}

export type ReverseStress = ReverseStressNotFound | ReverseStressFound;

export declare function reverseStress(
  a: Assumptions,
  segments?: Segment[],
  book?: Book,
  opts?: { max?: number; iterations?: number },
): ReverseStress;

/* ---------- which variable does the damage ---------- */

export interface TornadoBar {
  key: MacroKey;
  label: string;
  shock: number;
  loss: number;
  marginal: number;
  ratio: number;
  cet1Cost: number;
}

export interface Tornado {
  bars: TornadoBar[];
  baseline: number;
  together: number;
  sumOfParts: number;
  interaction: number;
}

export declare function tornado(
  a: Assumptions,
  segments?: Segment[],
  book?: Book,
): Tornado;

/* ---------- the sensitivity grid ---------- */

export declare function ladder(centre: number, step: number, count?: number): number[];

export interface SensitivityCell {
  row: number;
  col: number;
  ratio: number;
  loss: number;
  passes: boolean;
}

export interface Sensitivity {
  rowKey: DriverKey;
  colKey: DriverKey;
  rows: number[];
  cols: number[];
  cells: SensitivityCell[][];
  base: { row: number; col: number };
  min: number;
  max: number;
}

export declare function sensitivity(
  a: Assumptions,
  opts?: {
    rowKey?: DriverKey;
    rowStep?: number;
    colKey?: DriverKey;
    colStep?: number;
    size?: number;
  },
  segments?: Segment[],
  book?: Book,
): Sensitivity;

/* ---------- bring your own book, and take one away ---------- */

export declare function parsePortfolioCsv(text: string): {
  segments: Segment[];
  errors: string[];
};

export declare function bookFor(
  segments: Segment[],
  a?: Assumptions,
  template?: Book,
): Book;

export declare function toCsv(
  a: Assumptions,
  segments?: Segment[],
  book?: Book,
): string;
