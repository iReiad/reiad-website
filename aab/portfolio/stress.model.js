/* ============================================================
   stress.model.js: the credit stress-testing engine.

   No DOM. Numbers in, numbers out, same rule as the other three
   engines in this folder, because a function that touches the
   page cannot be checked against a value some other authority
   already agrees on. stress.test.ts does exactly that.

   ------------------------------------------------------------
   ABOUT THE PORTFOLIO, READ THIS FIRST

   The loan book shipped with this page is SYNTHETIC. It is a
   composite of what a mid-sized Bangladeshi private commercial
   bank's retail and SME book looks like in shape: the segment
   mix, the through-the-cycle default rates, the collateral
   coverage and the capital position are all in the right region,
   and none of them are any bank's filed numbers.

   The same rule governs the company in the valuation case
   studies and the index in the analysis one: publishing invented
   numbers under a real institution's name would be inventing
   that institution's record. What is real here is the method,
   and the page takes a CSV of a real book and runs the identical
   engine over it.

   ------------------------------------------------------------
   WHAT A STRESS TEST ACTUALLY HAS TO DO

   A macro scenario is a set of paths for unemployment, growth,
   rates, inflation, the exchange rate and collateral prices. A
   stress test has to turn those paths into money, and it has to
   do it through something more principled than "assume defaults
   double", which is where most of them stop.

   There are two respectable ways to make that link, and this
   page runs both, on the same book, over the same scenario.

   1 · MERTON, THROUGH THE VASICEK CONDITIONAL PD

      A borrower defaults when the value of its assets falls
      below what it owes. Write the asset return of borrower i in
      segment s as one common factor plus one idiosyncratic one:

          A_i = √ρ · Z + √(1 − ρ) · ε_i

      with Z and ε standard normal and independent. Default is
      A_i below a threshold, and the threshold that reproduces a
      long-run default rate PD is simply Φ⁻¹(PD). Conditioning on
      the common factor gives the default rate the segment runs
      at in a year whose economy was Z:

          PD(Z) = Φ[ (Φ⁻¹(PD) − √ρ · Z) / √(1 − ρ) ]

      Z is the economy: positive is a good year, negative a bad
      one, measured in standard deviations. So the whole job of
      the macro model is to turn a scenario into a Z, which is
      what factorZ() below does, and everything after that is one
      line of arithmetic that has been in the Basel framework for
      twenty years.

      That last point is worth making loudly on the page: the IRB
      capital requirement IS this formula, evaluated at the Z a
      1-in-1000 year economy would produce, Z = −Φ⁻¹(0.999) =
      −3.09. Capital and stress testing are not two models. They
      are the same model read at two different severities, which
      is why this engine computes both.

   2 · VINTAGE ANALYSIS, THROUGH THE HAZARD

      The second approach never mentions asset values. It says a
      loan's default rate depends on three things: how old it is
      (loans default on a hump-shaped seasoning curve, quiet in
      the first months, worst somewhere between one and two
      years, tailing off after), which cohort it came from (a
      book written in a boom is a worse book, and it stays worse
      for its whole life), and what the economy is doing now.

          hazard(age, vintage, t)
              = lifecycle(age) · quality(vintage) · e^(γ · s_t)

      with s_t the same macro shock index, positive when things
      are bad. Age and cohort come off the book itself; only the
      last term is a forecast.

   WHY BOTH, AND WHAT THE GAP MEANS

      The two links are calibrated to agree exactly at two
      points: at no shock at all, and at a one-standard-deviation
      shock. Everything they do after that comes from the shape
      of the link function and nothing else, a probit against a
      log. The probit convexifies harder, so the deeper the
      scenario the further apart they get.

      That gap is not a bug to be tuned away. It is the model
      risk the bank is carrying, made visible: two defensible
      methods, calibrated on the same history, disagreeing about
      the severe scenario by a number the page prints. A stress
      test that reports one number and no gap has not measured
      less uncertainty, it has just stopped showing it.

   ------------------------------------------------------------
   THE CONVENTIONS, STATED

   1. Static balance sheet. What amortises or defaults is
      replaced by new lending of the same size, which is the
      convention the EBA and the Bank of England use, and the
      reason a stress test is a test of the book rather than a
      forecast of the business. New lending enters the vintage
      ledger as a fresh cohort, so the seasoning mix stays
      realistic and tightening underwriting in a downturn is
      something the model can actually express.

   2. Lifetime PD for IFRS 9 stage 2 is the current point-in-time
      PD held flat over the remaining behavioural life. A term
      structure that reverts to the through-the-cycle rate would
      give a smaller number. Holding it flat is the conservative
      reading, and it is the one that makes the provision cliff
      visible rather than smearing it over three years.

   3. ECL is undiscounted. IFRS 9 discounts at the effective
      interest rate; over a two to five year life that is a few
      per cent of the answer, and it would add a rate to every
      segment for no gain in what the page is here to show.

   4. RWA is computed on the IRB formula even though most banks
      in Bangladesh are on the standardised approach. Under the
      standardised approach the capital ratio would move only
      through exposure and deductions, so the procyclicality this
      page is about would be invisible by construction. Both
      readings are worth having; this one is the one with
      something to say.

   5. Losses give no tax credit. Profit is taxed, a loss is not
      rebated, which is the conservative direction and roughly
      what happens to a bank that is already in trouble.
   ============================================================ */

/* ------------------------------------------------------------
   1 · The normal distribution

   Written out here rather than imported from the dissertation's
   statistics module, which has its own copy: that module ships
   forty kilobytes of transcribed fund data with it, and this
   page needs two functions. Both copies are checked against the
   same published values in their own test files.
   ------------------------------------------------------------ */

/**
 * Φ(x), the standard normal CDF, through the complementary error
 * function in Cody's rational form. Accurate to about 1e-15,
 * which matters here: the IRB formula evaluates Φ deep in the
 * tail, where a cheap approximation is wrong in the digits the
 * capital number is made of.
 */
export function normCdf(x) {
  return 0.5 * erfc(-x / Math.SQRT2);
}

function erfc(x) {
  const z = Math.abs(x);
  const t = 2 / (2 + z);
  const y = 4 * t - 2;

  /* Chebyshev coefficients for erfc(z)·e^(z²)·(2+z)/2, the
     standard Numerical Recipes set. */
  const c = [
    -1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
    -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
    4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
    1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
    6.529054439e-9, 5.059343495e-9, -9.91364156e-10,
    -2.27365122e-10, 9.6467911e-11, 2.394038e-12,
    -6.886027e-12, 8.94487e-13, 3.13092e-13,
    -1.12708e-13, 3.81e-16, 7.106e-15,
  ];

  let d = 0;
  let dd = 0;
  for (let j = c.length - 1; j > 0; j--) {
    const tmp = d;
    d = y * d - dd + c[j];
    dd = tmp;
  }
  const ans = t * Math.exp(-z * z + 0.5 * (c[0] + y * d) - dd);
  return x >= 0 ? ans : 2 - ans;
}

/**
 * Φ⁻¹(p). Acklam's rational approximation followed by one
 * Halley step against normCdf, which takes the relative error to
 * machine precision. The refinement is not decoration: the
 * capital formula uses Φ⁻¹(0.999), and Acklam alone is only good
 * to about 1e-9 there.
 */
export function normInv(p) {
  if (!(p > 0 && p < 1)) return p <= 0 ? -Infinity : Infinity;

  const a = [-3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
    1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00];
  const b = [-5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
    6.680131188771972e+01, -1.328068155288572e+01];
  const c = [-7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
    -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00];
  const d = [7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
    3.754408661907416e+00];

  const pLow = 0.02425;
  let x;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= 1 - pLow) {
    const q = p - 0.5;
    const r = q * q;
    x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q
      / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5])
      / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }

  // one Halley refinement
  const e = normCdf(x) - p;
  const u = e * Math.sqrt(2 * Math.PI) * Math.exp((x * x) / 2);
  return x - u / (1 + (x * u) / 2);
}

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/* ------------------------------------------------------------
   2 · The book
   ------------------------------------------------------------ */

export const BOOK = {
  name: "Composite private commercial bank, Bangladesh",
  short: "The book",
  unit: "BDT crore",
  asOf: "31 December 2025",
  horizonQuarters: 12,
  note: "A synthetic book, composite in shape rather than copied from any bank's filed accounts. Segment mix, default rates, collateral coverage and capital are in the region a mid-sized private commercial bank occupies.",

  cet1: 2_050,            // crore of common equity tier 1
  ppnr: 245,              // pre-provision net revenue per quarter, crore
  taxRate: 0.40,          // banks are taxed at 40% in Bangladesh
  /* Profit is not all retained. What makes the capital
     conservation buffer a buffer rather than a minimum is that
     falling into it restricts distributions, so the payout stops
     as the ratio approaches the requirement, which is the buffer
     doing the exact job it was designed for. */
  payout: 0.40,
  payoutStopsAbove: 0.010,   // above the requirement, in ratio points
  /* Basel III as Bangladesh Bank applies it: minimum CET1 of
     4.5% plus the 2.5% capital conservation buffer. Breaching
     the buffer is not insolvency, it is a distribution
     restriction, which is exactly the line a stress test is
     supposed to find. */
  requirement: 0.070,
  minimumCet1: 0.045,
};

/**
 * The segments. `kind` picks the Basel correlation function, and
 * with it the whole capital treatment, so it is not cosmetic.
 *
 * `betas` are the weights that turn standardised macro shocks
 * into one systematic factor for the segment. They sum to one,
 * which fixes the scale: a scenario in which every macro
 * variable is two standard deviations bad produces Z = −2, in
 * any segment, whatever its mix. Segments differ in WHICH
 * variables hurt them, not in how loudly a given shock speaks.
 */
export const SEGMENTS = [
  {
    id: "home", name: "Home loans", kind: "mortgage",
    ead: 4_200, undrawn: 0, ccf: 0,
    pdTtc: 0.011, lgdBase: 0.20, lgdFloor: 0.10,
    collateralCoverage: 1.55, sellingCosts: 0.18, secured: true, collateralBeta: 1.0,
    maturity: 5, amortQuarterly: 0.030, lifeYears: 5,
    peakMonth: 34, hazardSharpness: 1.5,
    sicrDispersion: 0.55, stage3Opening: 0.021,
    betas: { unemployment: 0.34, gdp: 0.14, policyRate: 0.20, inflation: 0.08, fx: 0.04, property: 0.20 },
    vintages: [
      { year: 2020, share: 0.09, quality: 0.90, ageMonths: 66 },
      { year: 2021, share: 0.13, quality: 1.00, ageMonths: 54 },
      { year: 2022, share: 0.19, quality: 1.28, ageMonths: 42 },
      { year: 2023, share: 0.22, quality: 1.18, ageMonths: 30 },
      { year: 2024, share: 0.21, quality: 1.02, ageMonths: 18 },
      { year: 2025, share: 0.16, quality: 0.94, ageMonths: 6 },
    ],
    blurb: "Long, secured, and the slowest to go wrong. Collateral is what makes the loss small; a property price fall is what takes that away.",
  },
  {
    id: "auto", name: "Auto loans", kind: "retail",
    ead: 1_150, undrawn: 0, ccf: 0,
    pdTtc: 0.026, lgdBase: 0.42, lgdFloor: 0.25,
    collateralCoverage: 0.95, sellingCosts: 0.25, secured: true, collateralBeta: 0.45,
    maturity: 3, amortQuarterly: 0.075, lifeYears: 3,
    peakMonth: 18, hazardSharpness: 1.8,
    sicrDispersion: 0.58, stage3Opening: 0.030,
    betas: { unemployment: 0.44, gdp: 0.18, policyRate: 0.16, inflation: 0.14, fx: 0.08, property: 0 },
    blurb: "Secured on an asset that loses value faster than the loan amortises for the first two years, which is where the loss given default comes from.",
    vintages: [
      { year: 2022, share: 0.14, quality: 1.22, ageMonths: 42 },
      { year: 2023, share: 0.24, quality: 1.14, ageMonths: 30 },
      { year: 2024, share: 0.32, quality: 1.03, ageMonths: 18 },
      { year: 2025, share: 0.30, quality: 0.95, ageMonths: 6 },
    ],
  },
  {
    id: "personal", name: "Personal loans", kind: "retail",
    ead: 1_850, undrawn: 0, ccf: 0,
    pdTtc: 0.048, lgdBase: 0.72, lgdFloor: 0.55,
    collateralCoverage: 0, sellingCosts: 0, secured: false,
    lgdElasticity: 0.16,
    maturity: 3, amortQuarterly: 0.085, lifeYears: 3,
    peakMonth: 15, hazardSharpness: 2.0,
    sicrDispersion: 0.62, stage3Opening: 0.045,
    betas: { unemployment: 0.52, gdp: 0.16, policyRate: 0.12, inflation: 0.18, fx: 0.02, property: 0 },
    blurb: "Unsecured, salary-dependent, and the first thing that breaks when employment does. Nothing to sell, so the loss given default moves only with how many borrowers cure.",
    vintages: [
      { year: 2022, share: 0.11, quality: 1.30, ageMonths: 42 },
      { year: 2023, share: 0.22, quality: 1.16, ageMonths: 30 },
      { year: 2024, share: 0.34, quality: 1.04, ageMonths: 18 },
      { year: 2025, share: 0.33, quality: 0.96, ageMonths: 6 },
    ],
  },
  {
    id: "card", name: "Credit cards", kind: "qrre",
    ead: 620, undrawn: 980, ccf: 0.40,
    pdTtc: 0.062, lgdBase: 0.78, lgdFloor: 0.62,
    collateralCoverage: 0, sellingCosts: 0, secured: false,
    lgdElasticity: 0.12,
    maturity: 1, amortQuarterly: 0.14, lifeYears: 2,
    peakMonth: 12, hazardSharpness: 2.2,
    sicrDispersion: 0.66, stage3Opening: 0.052,
    betas: { unemployment: 0.50, gdp: 0.14, policyRate: 0.10, inflation: 0.24, fx: 0.02, property: 0 },
    blurb: "The exposure is not the balance. A borrower in trouble draws the limit down before defaulting, which is what the credit conversion factor is for and why it rises under stress.",
    vintages: [
      { year: 2022, share: 0.18, quality: 1.24, ageMonths: 42 },
      { year: 2023, share: 0.24, quality: 1.12, ageMonths: 30 },
      { year: 2024, share: 0.30, quality: 1.02, ageMonths: 18 },
      { year: 2025, share: 0.28, quality: 0.97, ageMonths: 6 },
    ],
  },
  {
    id: "smeterm", name: "SME term loans", kind: "corporate",
    ead: 3_400, undrawn: 0, ccf: 0,
    pdTtc: 0.038, lgdBase: 0.40, lgdFloor: 0.22,
    collateralCoverage: 1.10, sellingCosts: 0.28, secured: true, collateralBeta: 0.90,
    sizeAdjustment: 0.04,
    maturity: 3, amortQuarterly: 0.055, lifeYears: 4,
    peakMonth: 24, hazardSharpness: 1.6,
    sicrDispersion: 0.60, stage3Opening: 0.068,
    betas: { unemployment: 0.16, gdp: 0.34, policyRate: 0.22, inflation: 0.12, fx: 0.10, property: 0.06 },
    blurb: "Growth-sensitive and rate-sensitive at once. Collateral is real but slow, and it is usually property, so the recovery falls at the same time as the default rate rises.",
    vintages: [
      { year: 2021, share: 0.10, quality: 0.98, ageMonths: 54 },
      { year: 2022, share: 0.20, quality: 1.26, ageMonths: 42 },
      { year: 2023, share: 0.26, quality: 1.15, ageMonths: 30 },
      { year: 2024, share: 0.25, quality: 1.02, ageMonths: 18 },
      { year: 2025, share: 0.19, quality: 0.95, ageMonths: 6 },
    ],
  },
  {
    id: "smewc", name: "SME working capital", kind: "corporate",
    ead: 2_100, undrawn: 1_300, ccf: 0.50,
    pdTtc: 0.044, lgdBase: 0.46, lgdFloor: 0.28,
    collateralCoverage: 0.85, sellingCosts: 0.28, secured: true, collateralBeta: 0.80,
    sizeAdjustment: 0.04,
    maturity: 1, amortQuarterly: 0.12, lifeYears: 2,
    peakMonth: 15, hazardSharpness: 1.9,
    sicrDispersion: 0.63, stage3Opening: 0.074,
    betas: { unemployment: 0.14, gdp: 0.32, policyRate: 0.24, inflation: 0.14, fx: 0.14, property: 0.02 },
    blurb: "Revolving, short, and rolled over rather than repaid. The limit is drawn hardest exactly when the borrower is least able to repay it.",
    vintages: [
      { year: 2023, share: 0.28, quality: 1.14, ageMonths: 30 },
      { year: 2024, share: 0.36, quality: 1.03, ageMonths: 18 },
      { year: 2025, share: 0.36, quality: 0.96, ageMonths: 6 },
    ],
  },
  {
    id: "corp", name: "Corporate", kind: "corporate",
    ead: 5_600, undrawn: 1_400, ccf: 0.35,
    pdTtc: 0.022, lgdBase: 0.38, lgdFloor: 0.20,
    collateralCoverage: 1.00, sellingCosts: 0.25, secured: true, collateralBeta: 0.80,
    sizeAdjustment: 0,
    maturity: 4, amortQuarterly: 0.045, lifeYears: 5,
    peakMonth: 28, hazardSharpness: 1.4,
    sicrDispersion: 0.52, stage3Opening: 0.058,
    betas: { unemployment: 0.10, gdp: 0.36, policyRate: 0.18, inflation: 0.10, fx: 0.22, property: 0.04 },
    blurb: "Large names, importers among them, so the exchange rate matters more here than anywhere else on the book. Fewer borrowers, which means the correlation is higher, not lower.",
    vintages: [
      { year: 2021, share: 0.12, quality: 0.96, ageMonths: 54 },
      { year: 2022, share: 0.18, quality: 1.20, ageMonths: 42 },
      { year: 2023, share: 0.24, quality: 1.12, ageMonths: 30 },
      { year: 2024, share: 0.26, quality: 1.02, ageMonths: 18 },
      { year: 2025, share: 0.20, quality: 0.94, ageMonths: 6 },
    ],
  },
];

/* ------------------------------------------------------------
   3 · The macro variables

   `sd` is the standard deviation of the variable's year-on-year
   change over a long run, which is what makes a shock expressed
   in its own units comparable to one in another variable's. It
   is the denominator of every standardisation in this file, so a
   scenario is always readable as "how many sigma is this".
   ------------------------------------------------------------ */
export const MACRO = [
  { key: "unemployment", label: "Unemployment rate", short: "Unemployment",
    unit: "pp", base: 4.9, sd: 1.0, badWhen: "up", axis: "%",
    help: "The level, not the change. Retail default rates follow this more closely than they follow anything else on the list." },
  { key: "gdp", label: "Real GDP growth", short: "GDP growth",
    unit: "pp", base: 5.8, sd: 2.0, badWhen: "down", axis: "%",
    help: "Year on year. What SME and corporate borrowers actually service their loans out of." },
  { key: "policyRate", label: "Policy rate", short: "Policy rate",
    unit: "pp", base: 10.0, sd: 1.8, badWhen: "up", axis: "%",
    help: "Hurts twice: floating-rate borrowers pay more, and the bank's own funding reprices faster than its assets." },
  { key: "inflation", label: "Inflation", short: "Inflation",
    unit: "pp", base: 8.5, sd: 2.5, badWhen: "up", axis: "%",
    help: "Squeezes the household budget a personal loan is repaid out of, before it touches anything else." },
  { key: "fx", label: "Taka depreciation", short: "FX",
    unit: "%", base: 0, sd: 7.0, badWhen: "up", axis: "%",
    help: "Cumulative against the dollar since the start date. Importers carry it directly; everyone else gets it through inflation." },
  { key: "property", label: "Collateral prices", short: "Collateral",
    unit: "%", base: 0, sd: 9.0, badWhen: "down", axis: "%",
    help: "Cumulative change in the property price index since the start date. Does not touch the default rate here, it touches what is recovered afterwards." },
];

export const MACRO_BY_KEY = Object.fromEntries(MACRO.map((m) => [m.key, m]));

/* ------------------------------------------------------------
   4 · Scenarios

   A scenario is six peak shocks and a shape. The shape is a ramp
   to the peak and then a decay back towards the starting point,
   which is what a supervisory scenario looks like and, more
   importantly, is why the worst quarter for capital is not the
   worst quarter for the economy: provisions are taken on the
   forward view, so they peak early, while the capital ratio
   troughs later, once they have been paid for.
   ------------------------------------------------------------ */
export const SCENARIOS = {
  base: {
    id: "base", label: "Base",
    blurb: "The macro path continues as it is. Nothing here is a forecast; it is the line the other two are measured against.",
    peaks: { unemployment: 0, gdp: 0, policyRate: 0, inflation: 0, fx: 0, property: 0 },
  },
  adverse: {
    id: "adverse", label: "Adverse",
    blurb: "A recession of the kind that arrives every decade or so: growth stalls, the taka slides, the central bank defends it with rates, and unemployment follows with a lag.",
    peaks: { unemployment: 1.6, gdp: -3.4, policyRate: 2.4, inflation: 3.2, fx: 11, property: -14 },
  },
  severe: {
    id: "severe", label: "Severely adverse",
    blurb: "The supervisory scenario: a balance-of-payments squeeze and a domestic recession at once, with collateral repricing hard. Deliberately harsher than anything in the recent record, which is the point of it.",
    peaks: { unemployment: 2.2, gdp: -4.6, policyRate: 3.6, inflation: 5.0, fx: 16, property: -21 },
  },
};

/* ------------------------------------------------------------
   5 · Assumptions the page can move
   ------------------------------------------------------------ */
export const DEFAULTS = {
  scenario: "adverse",
  engine: "merton",          // "merton" | "vintage"
  rwaBasis: "hybrid",        // "ttc" | "hybrid" | "pit"

  // the shape of the path
  quartersToPeak: 5,
  halfLife: 6,

  // the peaks, seeded from the chosen scenario on load
  unemployment: 1.6,
  gdp: -3.4,
  policyRate: 2.4,
  inflation: 3.2,
  fx: 11,
  property: -14,

  // transmission
  macroSensitivity: 1.0,
  correlationScale: 1.0,
  lgdDownturn: 1.0,
  ccfStress: 0.25,
  underwriting: 0.35,

  // accounting and capital
  sicrThreshold: 2.0,
  sicrDispersion: 1.0,
  ppnrRateBeta: -0.05,
  writeOffLag: 4,
};

export const DRIVERS = [
  { key: "unemployment", label: "Unemployment, peak rise", group: "The scenario",
    fmt: "pp", min: 0, max: 8, step: 0.1,
    help: "Percentage points above the 4.9% starting level, at the worst quarter." },
  { key: "gdp", label: "GDP growth, trough", group: "The scenario",
    fmt: "pp", min: -12, max: 3, step: 0.1,
    help: "Percentage points off the 5.8% starting rate. Negative is a slowdown; below −5.8 is an outright contraction." },
  { key: "policyRate", label: "Policy rate, peak rise", group: "The scenario",
    fmt: "pp", min: -2, max: 8, step: 0.1,
    help: "Percentage points above the 10% starting level." },
  { key: "inflation", label: "Inflation, peak rise", group: "The scenario",
    fmt: "pp", min: -2, max: 12, step: 0.1,
    help: "Percentage points above the 8.5% starting level." },
  { key: "fx", label: "Taka depreciation", group: "The scenario",
    fmt: "pct", min: 0, max: 45, step: 0.5,
    help: "Cumulative depreciation against the dollar at the worst quarter." },
  { key: "property", label: "Collateral prices", group: "The scenario",
    fmt: "pct", min: -50, max: 15, step: 0.5,
    help: "Cumulative change in the property price index. This one drives recoveries, not defaults." },

  { key: "quartersToPeak", label: "Quarters to the peak", group: "The path",
    fmt: "q", min: 1, max: 10, step: 1,
    help: "How long the shock takes to arrive. Everything ramps to its peak over this many quarters." },
  { key: "halfLife", label: "Recovery half-life", group: "The path",
    fmt: "q", min: 1, max: 16, step: 1,
    help: "Quarters for the shock to halve after the peak. A long half-life is what turns a shock into a recession." },

  { key: "macroSensitivity", label: "Macro-to-credit transmission", group: "Transmission",
    fmt: "x", min: 0, max: 2.5, step: 0.05,
    help: "Multiplies the systematic factor the scenario produces. This is the single most uncertain number in any stress test, which is the argument for showing it as a dial rather than burying it." },
  { key: "correlationScale", label: "Asset correlation", group: "Transmission",
    fmt: "x", min: 0.4, max: 2, step: 0.05,
    help: "Scales the Basel correlations. Higher correlation means the same shock puts more of the book in trouble at once, and it raises the capital requirement as well as the losses." },
  { key: "lgdDownturn", label: "Downturn LGD effect", group: "Transmission",
    fmt: "x", min: 0, max: 2.5, step: 0.05,
    help: "Scales the loss given default response: collateral values for the secured book, cure rates for the unsecured. At zero, loss given default is a constant, which is the assumption a stress test most often gets wrong." },
  { key: "ccfStress", label: "Drawdown under stress", group: "Transmission",
    fmt: "pct01", min: 0, max: 0.8, step: 0.01,
    help: "How much further a revolving line is drawn per standard deviation of shock, before default. Applies to cards, working capital and corporate limits." },
  { key: "underwriting", label: "Underwriting response", group: "Transmission",
    fmt: "x", min: 0, max: 1.5, step: 0.05,
    help: "How much tighter new lending gets per standard deviation of shock. Only the vintage engine can see this, because only it knows which cohort a loan came from." },

  { key: "sicrThreshold", label: "SICR trigger", group: "Accounting & capital",
    fmt: "x", min: 1.2, max: 5, step: 0.1,
    help: "How far a loan's probability of default has to rise, relative to origination, before it moves to stage 2 and starts carrying a lifetime loss allowance." },
  { key: "sicrDispersion", label: "Spread of that trigger", group: "Accounting & capital",
    fmt: "x", min: 0.4, max: 2, step: 0.05,
    help: "Scales how differently individual loans deteriorate. Tighter spread means the book crosses the trigger together, which is what makes the provision charge a cliff rather than a slope." },
  { key: "ppnrRateBeta", label: "Earnings sensitivity to rates", group: "Accounting & capital",
    fmt: "x", min: -0.2, max: 0.1, step: 0.005,
    help: "Change in pre-provision revenue per percentage point of policy rate. Negative because deposits reprice faster than loans do. Earnings are the first line of defence; a stress test that ignores them overstates the damage." },
  { key: "writeOffLag", label: "Write-off lag", group: "Accounting & capital",
    fmt: "q", min: 1, max: 12, step: 1,
    help: "Quarters a defaulted exposure sits in stage 3 before it leaves the balance sheet. It changes the shape of the provision line without changing the total loss." },
];

export const DRIVER_BY_KEY = Object.fromEntries(DRIVERS.map((d) => [d.key, d]));

/* ------------------------------------------------------------
   6 · Basel: correlation, maturity, capital

   These four functions are the published IRB formulas, and the
   test file checks them against the illustrative risk weights
   BCBS printed alongside them. They are here rather than in the
   stress machinery because the capital requirement is the same
   model as the stress test, read at a fixed 99.9th percentile.
   ------------------------------------------------------------ */

/** Basel's asset correlation, by exposure class. */
export function correlation(kind, pd, { sizeAdjustment = 0, scale = 1 } = {}) {
  let rho;
  if (kind === "mortgage") {
    rho = 0.15;
  } else if (kind === "qrre") {
    rho = 0.04;
  } else if (kind === "retail") {
    const w = (1 - Math.exp(-35 * pd)) / (1 - Math.exp(-35));
    rho = 0.03 * w + 0.16 * (1 - w);
  } else {
    const w = (1 - Math.exp(-50 * pd)) / (1 - Math.exp(-50));
    rho = 0.12 * w + 0.24 * (1 - w) - sizeAdjustment;
  }
  return clamp(rho * scale, 0.001, 0.999);
}

/** The maturity adjustment, corporate exposures only. */
export function maturityAdjustment(pd, maturity) {
  const b = (0.11852 - 0.05478 * Math.log(pd)) ** 2;
  return (1 + (maturity - 2.5) * b) / (1 - 1.5 * b);
}

/**
 * The IRB capital requirement K, as a fraction of exposure.
 *
 * K = LGD · Φ[(Φ⁻¹(PD) + √ρ · Φ⁻¹(0.999)) / √(1 − ρ)] − PD · LGD
 *
 * The first term is the conditional expected loss in a 1-in-1000
 * year economy; the second is the expected loss that provisions
 * are already supposed to cover. Capital is for the difference,
 * which is the whole idea and is worth reading twice.
 */
export function capitalRequirement({ pd, lgd, kind, maturity = 2.5, sizeAdjustment = 0, scale = 1 }) {
  const floored = Math.max(pd, 0.0003);   // the Basel PD floor of 3bp
  const rho = correlation(kind, floored, { sizeAdjustment, scale });
  const conditional = conditionalPd(floored, rho, -normInv(0.999));
  const k = lgd * conditional - floored * lgd;
  const ma = kind === "corporate" ? maturityAdjustment(floored, maturity) : 1;
  return Math.max(0, k * ma);
}

/** The risk weight: capital requirement scaled to an 8% ratio. */
export const riskWeight = (args) => capitalRequirement(args) * 12.5;

/* ------------------------------------------------------------
   7 · Merton, conditional on the economy
   ------------------------------------------------------------ */

/**
 * The Vasicek conditional default rate.
 *
 *   PD(Z) = Φ[(Φ⁻¹(PD) − √ρ · Z) / √(1 − ρ)]
 *
 * Z is the systematic factor in standard deviations, positive
 * for a good year. At Z = 0 it returns PD unchanged, which is
 * the identity the whole calibration rests on.
 */
export function conditionalPd(pd, rho, z) {
  if (!(pd > 0)) return 0;
  if (pd >= 1) return 1;
  const r = clamp(rho, 0, 0.9999);
  return normCdf((threshold(pd) - Math.sqrt(r) * z) / Math.sqrt(1 - r));
}

/* Φ⁻¹(PD) is the default threshold, and it is evaluated tens of
   thousands of times per sensitivity grid for a handful of
   distinct PDs. Remembering it is the difference between a grid
   that redraws while a slider is moving and one that does not. */
const thresholds = new Map();
function threshold(pd) {
  let t = thresholds.get(pd);
  if (t === undefined) {
    t = normInv(pd);
    if (thresholds.size > 5000) thresholds.clear();
    thresholds.set(pd, t);
  }
  return t;
}

/**
 * The value of the systematic factor at which the conditional
 * default rate equals the long-run average one.
 *
 * This is not zero, and the reason is worth a paragraph because
 * getting it wrong quietly moves every number on the page.
 *
 * PD(Z) is the default rate in a year whose economy was Z. The
 * through-the-cycle PD a bank quotes is the AVERAGE of that over
 * the cycle, and the average of a convex function is not the
 * function of the average. Default rates are right-skewed: a
 * handful of terrible years pull the mean up above the typical
 * year. So the year that actually produces the long-run average
 * default rate is already a mildly bad one:
 *
 *     Z₀ = Φ⁻¹(PD) · (1 − √(1 − ρ)) / √ρ
 *
 * which for these segments lands between −0.3 and −0.6. Set the
 * starting point at Z = 0 instead and the base scenario shows
 * the book running well below its own long-run default rate,
 * releasing provisions in a year where nothing has happened.
 * That was the first version of this model, and the base case
 * printing a profit release is what gave it away.
 */
export function anchorZ(pd, rho) {
  const r = clamp(rho, 1e-9, 0.9999);
  return (normInv(pd) * (1 - Math.sqrt(1 - r))) / Math.sqrt(r);
}

/**
 * The scenario as one number per segment.
 *
 * Each macro variable's deviation from its starting level is
 * divided by its own standard deviation and signed so that
 * positive is bad. The segment's betas, which sum to one,
 * weight them into a single shock index s. Z is minus that,
 * scaled by the transmission dial.
 */
export function shockIndex(levels, betas) {
  let s = 0;
  for (const m of MACRO) {
    const beta = betas[m.key] ?? 0;
    if (!beta) continue;
    const dev = (levels[m.key] - m.base) / m.sd;
    s += beta * (m.badWhen === "down" ? -dev : dev);
  }
  return s;
}

export const factorZ = (levels, betas, macroSensitivity = 1) =>
  -macroSensitivity * shockIndex(levels, betas);

/* ------------------------------------------------------------
   8 · The scenario path
   ------------------------------------------------------------ */

/**
 * The shape of every shock through time: a linear ramp to 1 at
 * the peak quarter, then an exponential decay back towards zero.
 * Quarter 0 is the starting point, where nothing has happened
 * yet, which is why every path begins at exactly the base level.
 */
export function shape(q, { quartersToPeak, halfLife }) {
  if (q <= 0) return 0;
  if (q <= quartersToPeak) return q / quartersToPeak;
  return 0.5 ** ((q - quartersToPeak) / halfLife);
}

/** Levels for every macro variable, quarter 0 through the horizon. */
export function macroPath(a, horizon = BOOK.horizonQuarters) {
  const out = [];
  for (let q = 0; q <= horizon; q++) {
    const f = shape(q, a);
    const levels = {};
    for (const m of MACRO) levels[m.key] = m.base + (a[m.key] ?? 0) * f;
    out.push({ q, factor: f, levels });
  }
  return out;
}

/* ------------------------------------------------------------
   9 · The vintage engine

   lifecycle(age) is a hump: quiet at first, worst at peakMonth,
   tailing off after. Written so that its value AT the peak is
   exactly 1, which makes the curve readable, and normalised
   against the book's own age mix so that with no shock at all
   the segment reproduces its through-the-cycle default rate.
   Without that normalisation the vintage engine would answer a
   different question from the Merton one at quarter zero, and
   the comparison between them would be meaningless.
   ------------------------------------------------------------ */

export function lifecycle(ageMonths, { peakMonth, hazardSharpness }) {
  if (ageMonths <= 0) return 0;
  const r = ageMonths / peakMonth;
  return r ** hazardSharpness * Math.exp(hazardSharpness * (1 - r));
}

/**
 * The multiplier that turns a shock index into a hazard, chosen
 * so the two engines agree exactly at a one-sigma shock:
 *
 *     e^(γ · 1) = PD_merton(Z = −1) / PD
 *
 * Two calibration points fixed (no shock, and one sigma) leaves
 * the divergence at three sigma to be a consequence of the link
 * functions rather than of a parameter nobody can observe.
 */
export function hazardGamma(pd, rho) {
  const at1 = conditionalPd(pd, rho, anchorZ(pd, rho) - 1);
  return Math.log(at1 / pd);
}

/* ------------------------------------------------------------
   10 · Loss given default and exposure at default under stress
   ------------------------------------------------------------ */

/**
 * Loss given default on a secured book is a put option.
 *
 * A lender that can seize collateral worth C against an exposure
 * of 1 loses max(0, 1 − C·(1 − selling costs)). That is the
 * payoff of a put struck at the exposure, and the loss given
 * default of the segment is its expected value across borrowers
 * whose collateral coverage varies. Take that coverage as
 * lognormal, with mean the segment's average coverage, and the
 * expectation is Black's formula:
 *
 *     LGD = Φ(−d₂) − F · Φ(−d₁)
 *     d₁  = (ln F + σ²/2) / σ,   d₂ = d₁ − σ
 *
 * with F the mean net collateral coverage and σ the dispersion
 * of it across the segment.
 *
 * This is the part of the model most stress tests do not have,
 * and the reason to have it is the shape rather than the level.
 * A well-secured book has a low delta: the first few per cent
 * off collateral prices cost almost nothing, because the cushion
 * absorbs them. Keep going and the delta rises, and the loss
 * given default accelerates into exactly the quarter the default
 * rate is peaking. Holding loss given default constant through a
 * stress test is holding an option's value fixed while its
 * underlying moves, and it understates the tail every time.
 *
 * σ is not a free parameter: it is solved, once per segment, so
 * that the formula reproduces that segment's stated loss given
 * default when collateral prices have not moved at all. The
 * shipped LGD is therefore preserved exactly, and only the
 * response to the scenario comes out of the option.
 *
 * Unsecured segments have nothing to sell. Theirs moves with the
 * shock through cure rates, which is a smaller effect and a
 * simpler one.
 */
export function lgdFromCollateral(coverage, costs, sigma, priceShock = 0) {
  const f = coverage * (1 - costs) * (1 + priceShock);
  if (!(f > 0)) return 1;
  if (!(sigma > 0)) return clamp(1 - Math.min(1, f), 0, 1);
  const d1 = (Math.log(f) + (sigma * sigma) / 2) / sigma;
  const d2 = d1 - sigma;
  return clamp(normCdf(-d2) - f * normCdf(-d1), 0, 1);
}

/**
 * Solve for the dispersion that reproduces a segment's stated
 * loss given default with collateral prices unchanged. Bisection
 * rather than anything cleverer: the function is monotone in σ,
 * this runs once per segment, and a closed form does not exist.
 */
export function calibrateLgdSigma(coverage, costs, lgdBase) {
  const floor = Math.max(0, 1 - coverage * (1 - costs));
  if (!(lgdBase > floor) || lgdBase >= 1) return null;
  let lo = 1e-4;
  let hi = 6;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (lgdFromCollateral(coverage, costs, mid) < lgdBase) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/* One solve per segment, kept for the life of the page. The key
   is the segment object itself, so an imported book gets its own
   entry rather than inheriting the template's. */
const sigmaCache = new WeakMap();
export function lgdSigma(seg) {
  if (sigmaCache.has(seg)) return sigmaCache.get(seg);
  const sigma = seg.secured && seg.collateralCoverage > 0
    ? calibrateLgdSigma(seg.collateralCoverage, seg.sellingCosts, seg.lgdBase)
    : null;
  sigmaCache.set(seg, sigma);
  return sigma;
}

export function stressedLgd(seg, { propertyLevel, s, lgdDownturn = 1 }) {
  const sigma = lgdSigma(seg);
  if (sigma !== null) {
    /* collateralBeta is how much of the collateral price index a
       given segment's security actually shares. A house is the
       index; a car is not, and pretending a vehicle book reprices
       with the property market would be borrowing a correlation
       that is not there. */
    const shock = (propertyLevel / 100) * (seg.collateralBeta ?? 1) * lgdDownturn;
    return clamp(lgdFromCollateral(seg.collateralCoverage, seg.sellingCosts, sigma, shock),
      seg.lgdFloor, 1);
  }
  const lift = 1 + (seg.lgdElasticity ?? 0.12) * lgdDownturn * Math.max(0, s);
  return clamp(seg.lgdBase * lift, seg.lgdFloor, 1);
}

/**
 * Exposure at default for a revolving line: the drawn balance
 * plus a share of the limit that is still free. The share rises
 * with the shock, because a borrower heading for default draws
 * what is available first.
 */
export function stressedEad(seg, drawn, { s, ccfStress = 0.25 }) {
  if (!seg.undrawn) return drawn;
  const ccf = clamp(seg.ccf + ccfStress * Math.max(0, s), 0, 1);
  /* The limits shrink with the performing book they belong to,
     measured against the performing balance the segment opened
     with rather than its gross exposure, or a book that is five
     per cent in default would start life with five per cent less
     commitment than it has. */
  const opening = seg.ead * (1 - seg.stage3Opening);
  const scale = opening > 0 ? drawn / opening : 1;
  return drawn + ccf * seg.undrawn * scale;
}

/* ------------------------------------------------------------
   11 · IFRS 9 staging

   The share of a segment in stage 2 is not assumed, it is
   derived. Individual loans deteriorate by different amounts
   around the segment average; take the spread as lognormal and
   the share that has crossed a "PD has risen k times" trigger
   is one evaluation of Φ:

       stage 2 share = Φ[(ln R − ln k) / σ]

   with R the segment's average PD deterioration. At R = 1 that
   gives the quiet-times stage 2 population; at R = k, half the
   book is in stage 2 at once. That is the provision cliff, and
   it falls out of the arithmetic rather than being asserted.
   ------------------------------------------------------------ */
export function stage2Share(ratio, threshold, dispersion) {
  if (!(ratio > 0) || !(dispersion > 0)) return 0;
  return clamp(normCdf((Math.log(ratio) - Math.log(threshold)) / dispersion), 0, 1);
}

/** Lifetime PD from one annual rate held flat. Used for the opening book. */
export const lifetimePd = (annualPd, years) =>
  1 - (1 - clamp(annualPd, 0, 0.9999)) ** Math.max(0, years);

/**
 * Lifetime PD along the scenario, which is what IFRS 9 actually
 * asks for: the probability of default over the remaining life,
 * given today's view of the future.
 *
 * Two conventions are stated rather than buried. The scenario is
 * used for as far as it runs, which is the "reasonable and
 * supportable" period the standard talks about. Beyond it the
 * rate reverts to the through-the-cycle one rather than staying
 * at its stressed level, because assuming a recession lasts
 * forever is not prudence, it is a different forecast.
 *
 * The alternative, holding today's stressed rate flat for five
 * years, was what this did first. It roughly doubled the peak
 * provision charge, which is worth knowing: most of what looks
 * like a stress result in an IFRS 9 model is really an artefact
 * of how the lifetime PD is extended.
 */
function lifetimePdForward(seg, path, a, t, ctx) {
  const horizon = path.length - 1;
  const steps = Math.max(1, Math.round(seg.lifeYears * 4));
  let survival = 1;
  for (let k = 0; k < steps; k++) {
    const idx = t + k;
    const s = idx <= horizon
      ? shockIndex(path[idx].levels, seg.betas) * a.macroSensitivity
      : 0;
    const annual = a.engine === "vintage"
      ? clamp(ctx.mix * seg.pdTtc * Math.exp(ctx.gamma * s), 0, 0.999)
      : conditionalPd(seg.pdTtc, ctx.rho, ctx.z0 - s);
    survival *= (1 - annual) ** 0.25;
  }
  return 1 - survival;
}

/* ------------------------------------------------------------
   12 · The roll-forward

   One quarter-by-quarter loop per segment. Both engines go
   through it; they differ only in the line that sets the point
   in time default rate, which is exactly the comparison the page
   is trying to make.
   ------------------------------------------------------------ */

function openingLedger(seg, ead) {
  const vs = seg.vintages ?? [{ year: 2024, share: 1, quality: 1, ageMonths: 18 }];
  const total = vs.reduce((t, v) => t + v.share, 0) || 1;
  return vs.map((v) => ({
    label: String(v.year),
    ageMonths: v.ageMonths,
    quality: v.quality,
    balance: (ead * v.share) / total,
    originated: (ead * v.share) / total,
    defaults: 0,
    isNew: false,
  }));
}

/** Hazard-weighted average of the ledger, in through-the-cycle units. */
function ledgerHazard(ledger, seg) {
  let num = 0;
  let den = 0;
  for (const c of ledger) {
    if (c.balance <= 0) continue;
    num += c.balance * lifecycle(c.ageMonths, seg) * c.quality;
    den += c.balance;
  }
  return den ? num / den : 0;
}

/**
 * Run one segment over the scenario.
 *
 * @param {object} seg      a segment from SEGMENTS, or a CSV import
 * @param {Array}  path     the macro path from macroPath()
 * @param {object} a        the assumptions
 * @returns {{quarters:Array, ledger:Array, rho:number, gamma:number}}
 */
export function runSegment(seg, path, a) {
  const rho = correlation(seg.kind, seg.pdTtc, {
    sizeAdjustment: seg.sizeAdjustment ?? 0,
    scale: a.correlationScale,
  });
  const gamma = hazardGamma(seg.pdTtc, rho);

  const z0 = anchorZ(seg.pdTtc, rho);

  const ledger = openingLedger(seg, seg.ead * (1 - seg.stage3Opening));
  /* The normalising constant that makes the vintage engine agree
     with the through-the-cycle rate on the opening book. */
  const hazard0 = ledgerHazard(ledger, seg) || 1;

  const quarters = [];
  let performing = seg.ead * (1 - seg.stage3Opening);
  let stage3 = seg.ead * seg.stage3Opening;
  const defaultQueue = [];
  let cumulativeLoss = 0;
  let cumulativeDefaults = 0;

  /* The opening allowance, on the quiet-times numbers. The first
     quarter's charge is measured against this rather than against
     zero, or the whole existing balance sheet would arrive as a
     loss in the first quarter of the scenario. */
  const openingShare2 = stage2Share(1, a.sicrThreshold, seg.sicrDispersion * a.sicrDispersion);
  const openingEcl = performing * (1 - openingShare2) * seg.pdTtc * seg.lgdBase
    + performing * openingShare2 * lifetimePd(seg.pdTtc, seg.lifeYears) * seg.lgdBase
    + stage3 * seg.lgdBase;
  let prevEcl = openingEcl;

  for (let q = 1; q <= path.length - 1; q++) {
    const { levels } = path[q];
    const s = shockIndex(levels, seg.betas) * a.macroSensitivity;
    const z = z0 - s;

    /* ---- the one line the two engines disagree about ----
       Three numbers, not two, because the vintage engine differs
       from the Merton one for two separate reasons and they are
       worth telling apart. pdVintageLink is the pure link
       function, the log against the probit, on an unchanged age
       mix. pdVintage is that same number once the book's actual
       seasoning and cohort quality are applied. The difference
       between the two is the mix effect, and the page reports
       both rather than one gap that quietly contains both. */
    const pdMerton = conditionalPd(seg.pdTtc, rho, z);
    const pdVintageLink = seg.pdTtc * Math.exp(gamma * s);
    const mix = ledgerHazard(ledger, seg) / hazard0;
    const pdVintage = mix * pdVintageLink;
    const pd = clamp(a.engine === "vintage" ? pdVintage : pdMerton, 0, 0.999);

    const lgd = stressedLgd(seg, { propertyLevel: levels.property, s, lgdDownturn: a.lgdDownturn });
    const eadAtDefault = stressedEad(seg, performing, { s, ccfStress: a.ccfStress });
    const eadMultiplier = performing > 0 ? eadAtDefault / performing : 1;

    const pdQuarter = 1 - (1 - pd) ** 0.25;

    /* Defaults are spread over the cohorts by their own hazards,
       then scaled so the segment total is whatever the engine in
       force says it is. That keeps the vintage chart honest under
       both engines rather than only under one. */
    const weights = ledger.map((c) => c.balance * lifecycle(c.ageMonths, seg) * c.quality);
    const weightSum = weights.reduce((t, w) => t + w, 0);
    const defaults = performing * pdQuarter;
    ledger.forEach((c, i) => {
      const share = weightSum > 0 ? weights[i] / weightSum : 0;
      const d = defaults * share;
      c.balance = Math.max(0, c.balance - d);
      c.defaults += d;
    });

    const defaultedExposure = defaults * eadMultiplier;
    const loss = defaultedExposure * lgd;
    cumulativeLoss += loss;
    cumulativeDefaults += defaultedExposure;

    performing -= defaults;
    stage3 += defaultedExposure;
    defaultQueue.push(defaultedExposure);

    // ---- write-offs leave the balance sheet, provided for ----
    let writeOff = 0;
    if (defaultQueue.length > a.writeOffLag) {
      writeOff = defaultQueue.shift();
      stage3 = Math.max(0, stage3 - writeOff);
    }

    /* ---- static balance sheet ----
       What amortised and what left the book as a write-off is
       re-lent, at the underwriting standard the scenario has
       pushed the bank to. Defaults are NOT replaced: a defaulted
       loan is still on the balance sheet, in stage 3, until it is
       written off. So performing plus stage 3 is constant, which
       is what "static balance sheet" means and why a stress test
       is a test of the book rather than a forecast of the
       business. Only the vintage engine can see the underwriting
       response, which is one of the honest arguments for keeping
       a second engine at all. */
    let amortised = 0;
    ledger.forEach((c) => {
      const a0 = c.balance * seg.amortQuarterly;
      c.balance -= a0;
      c.ageMonths += 3;
      amortised += a0;
    });
    const newLending = amortised + writeOff;
    if (newLending > 0) {
      ledger.push({
        label: `Q${q}`,
        ageMonths: 1.5,
        quality: Math.max(0.5, 1 - a.underwriting * Math.max(0, s)),
        balance: newLending,
        originated: newLending,
        defaults: 0,
        isNew: true,
      });
    }
    performing = ledger.reduce((t, c) => t + c.balance, 0);

    // ---- IFRS 9 ----
    const ratio = pd / seg.pdTtc;
    const share2 = stage2Share(ratio, a.sicrThreshold, seg.sicrDispersion * a.sicrDispersion);
    const stage2 = performing * share2;
    const stage1 = performing - stage2;
    const ltPd = lifetimePdForward(seg, path, a, q, { rho, gamma, mix, z0 });
    const ecl = stage1 * pd * lgd + stage2 * ltPd * lgd + stage3 * lgd;
    /* The identity every provision line has to satisfy: what goes
       through the profit and loss account is the movement in the
       allowance plus what was written off against it. */
    const charge = ecl - prevEcl + writeOff * lgd;
    prevEcl = ecl;

    /* ---- capital ----
       Which PD goes into the risk weight is a real argument, not
       a detail, and it decides most of the answer.

       Basel's IRB probabilities of default are meant to be
       long-run averages, so on a strict reading the risk weight
       should not move with the cycle at all: only the downturn
       loss given default should. Run it that way ("ttc") and the
       capital ratio falls purely because of losses.

       In practice ratings migrate, so measured PDs do rise in a
       downturn, and risk weights with them. Run it fully point
       in time ("pit") and the same loans, unchanged, consume
       half as much capital again, which is the procyclicality
       supervisors have been arguing about since 2009.

       The default sits between the two, which is roughly where
       a real rating system lands, and the page offers all three
       because the gap between them is a result rather than an
       assumption. */
    const rwaPd = a.rwaBasis === "ttc" ? seg.pdTtc
      : a.rwaBasis === "pit" ? pd
        : Math.sqrt(seg.pdTtc * pd);
    const k = capitalRequirement({
      pd: rwaPd, lgd, kind: seg.kind, maturity: seg.maturity,
      sizeAdjustment: seg.sizeAdjustment ?? 0, scale: a.correlationScale,
    });
    const rwa = k * 12.5 * (performing + stage3);

    quarters.push({
      q, s, z, pd, pdMerton, pdVintage, pdVintageLink, mix, lgd, ratio,
      eadMultiplier, defaults: defaultedExposure, loss,
      performing, stage1, stage2, stage3, share2,
      ecl, charge, writeOff, rwa, k, rwaPd,
      cumulativeLoss, cumulativeDefaults,
    });
  }

  return { seg, rho, gamma, z0, openingEcl, quarters, ledger };
}

/* ------------------------------------------------------------
   12b · The vintage curves themselves

   The chart every credit analyst asks for first: cumulative
   default rate against months on book, one line per origination
   cohort. Solid to today, dashed after, so the projection is
   never mistaken for the record.

   The historical half is not a second data source. It is the
   same seasoning curve and the same cohort quality the engine
   uses, integrated over the months the cohort has already lived
   through, which is the only internally consistent thing to draw:
   a page that showed one curve for history and a different model
   for the projection would have a join in it that means nothing.
   ------------------------------------------------------------ */
export function vintageCurves(seg, path, a) {
  const rho = correlation(seg.kind, seg.pdTtc, {
    sizeAdjustment: seg.sizeAdjustment ?? 0, scale: a.correlationScale,
  });
  const gamma = hazardGamma(seg.pdTtc, rho);
  const hazard0 = ledgerHazard(openingLedger(seg, seg.ead), seg) || 1;
  const horizon = path.length - 1;

  return (seg.vintages ?? []).map((v) => {
    const points = [{ age: 0, cum: 0, projected: false }];
    let survival = 1;
    let cum = 0;
    const lastAge = v.ageMonths + 3 * horizon;

    for (let age = 0; age < lastAge; age += 3) {
      const annual = (seg.pdTtc * lifecycle(age + 1.5, seg) * v.quality) / hazard0;
      /* Before the as-of date the economy is the one that
         happened, which this model represents as no shock at all.
         After it, the scenario. */
      let mult = 1;
      if (age >= v.ageMonths) {
        /* Inside the scenario, the scenario. Past the end of it,
           back to normal, the same reversion the lifetime PD
           uses, and for the same reason: extending a recession
           past the horizon of the scenario is not conservatism,
           it is a different scenario that nobody stated. */
        const q = Math.round((age - v.ageMonths) / 3) + 1;
        if (q <= horizon) {
          mult = Math.exp(gamma * shockIndex(path[q].levels, seg.betas) * a.macroSensitivity);
        }
      }
      const qRate = 1 - (1 - clamp(annual * mult, 0, 0.999)) ** 0.25;
      cum += survival * qRate;
      survival *= 1 - qRate;
      points.push({ age: age + 3, cum, projected: age >= v.ageMonths });
    }
    return { label: String(v.year), quality: v.quality, asOfAge: v.ageMonths, points };
  });
}

/* ------------------------------------------------------------
   13 · The whole book
   ------------------------------------------------------------ */

/**
 * Run every segment, add them up, and take the capital ratio
 * through the horizon.
 *
 * @param {object} a         assumptions, DEFAULTS shape
 * @param {Array}  segments  the book, so a CSV import can replace it
 */
export function run(a = DEFAULTS, segments = SEGMENTS, book = BOOK) {
  const path = macroPath(a, book.horizonQuarters);
  const runs = segments.map((seg) => runSegment(seg, path, a));

  const totalEad = segments.reduce((t, s) => t + s.ead, 0);

  // the opening position, quarter 0
  const openingRwa = segments.reduce((t, s) => t + capitalRequirement({
    pd: s.pdTtc, lgd: s.lgdBase, kind: s.kind, maturity: s.maturity,
    sizeAdjustment: s.sizeAdjustment ?? 0, scale: a.correlationScale,
  }) * 12.5 * s.ead, 0);

  let cet1 = book.cet1;
  const openingStage3 = segments.reduce((t, s) => t + s.ead * s.stage3Opening, 0);
  const openingPerforming = segments.reduce((t, s) => t + s.ead * (1 - s.stage3Opening), 0);
  const openingEcl = runs.reduce((t, r) => t + r.openingEcl, 0);
  const openingStage2 = segments.reduce((t, s) => t + s.ead * (1 - s.stage3Opening)
    * stage2Share(1, a.sicrThreshold, s.sicrDispersion * a.sicrDispersion), 0);

  const quarters = [{
    q: 0, pd: weighted(segments, (s) => s.pdTtc), lgd: weighted(segments, (s) => s.lgdBase),
    pdMerton: weighted(segments, (s) => s.pdTtc), pdVintage: weighted(segments, (s) => s.pdTtc),
    pdVintageLink: weighted(segments, (s) => s.pdTtc),
    z: 0, s: 0, loss: 0, defaults: 0, charge: 0, ppnr: book.ppnr, writeOff: 0,
    ecl: openingEcl,
    stage2: openingStage2, stage1: openingPerforming - openingStage2, stage3: openingStage3,
    performing: openingPerforming,
    rwa: openingRwa, cet1, ratio: cet1 / openingRwa, cumulativeLoss: 0,
    levels: path[0].levels,
  }];

  for (let i = 0; i < book.horizonQuarters; i++) {
    const slice = runs.map((r) => r.quarters[i]);
    const sum = (fn) => slice.reduce((t, x) => t + fn(x), 0);
    const ead = sum((x) => x.performing + x.stage3) || 1;

    const levels = path[i + 1].levels;
    const rateShock = levels.policyRate - MACRO_BY_KEY.policyRate.base;
    const ppnr = Math.max(0, book.ppnr * (1 + a.ppnrRateBeta * rateShock));

    const charge = sum((x) => x.charge);
    const preTax = ppnr - charge;
    /* A loss earns no tax rebate here. That is the conservative
       direction, and it is roughly what happens to a bank that is
       already in trouble. */
    const postTax = preTax > 0 ? preTax * (1 - book.taxRate) : preTax;

    const rwa = sum((x) => x.rwa);
    const headroomNow = (rwa > 0 ? cet1 / rwa : 0) - book.requirement;
    const dividend = postTax > 0 && headroomNow > book.payoutStopsAbove
      ? postTax * book.payout : 0;
    cet1 += postTax - dividend;
    quarters.push({
      q: i + 1,
      levels,
      z: slice.reduce((t, x, j) => t + x.z * (runs[j].seg.ead / totalEad), 0),
      s: slice.reduce((t, x, j) => t + x.s * (runs[j].seg.ead / totalEad), 0),
      pd: sum((x) => x.pd * (x.performing + x.stage3)) / ead,
      pdMerton: sum((x) => x.pdMerton * (x.performing + x.stage3)) / ead,
      pdVintage: sum((x) => x.pdVintage * (x.performing + x.stage3)) / ead,
      pdVintageLink: sum((x) => x.pdVintageLink * (x.performing + x.stage3)) / ead,
      lgd: sum((x) => x.lgd * (x.performing + x.stage3)) / ead,
      loss: sum((x) => x.loss),
      defaults: sum((x) => x.defaults),
      performing: sum((x) => x.performing),
      stage1: sum((x) => x.stage1),
      stage2: sum((x) => x.stage2),
      stage3: sum((x) => x.stage3),
      ecl: sum((x) => x.ecl),
      charge, ppnr, preTax, postTax, dividend,
      writeOff: sum((x) => x.writeOff),
      rwa, cet1, ratio: rwa > 0 ? cet1 / rwa : NaN,
      cumulativeLoss: sum((x) => x.cumulativeLoss),
      bySegment: slice.map((x, j) => ({ id: runs[j].seg.id, ...x })),
    });
  }

  // ---- the answer ----
  const trough = quarters.slice(1).reduce((worst, x) => (x.ratio < worst.ratio ? x : worst), quarters[1]);
  const peakLoss = quarters.slice(1).reduce((worst, x) => (x.loss > worst.loss ? x : worst), quarters[1]);
  const worstZ = Math.min(...quarters.slice(1).map((x) => x.z));
  const worstShock = Math.max(...quarters.slice(1).map((x) => x.s));
  const cumulativeLoss = quarters[quarters.length - 1].cumulativeLoss;

  return {
    path, runs, quarters, segments, book,
    openingRwa,
    openingRatio: book.cet1 / openingRwa,
    totalEad,
    trough,
    peakLoss,
    /* Two severities, and they are not the same number.
       `worstShock` is how far the scenario is from today, in
       standard deviations, which is what a reader means by "how
       bad is this". `worstZ` is where that leaves the economy on
       the absolute scale the capital formula uses, where the
       requirement is set at Z = −3.09. Reporting one as the
       other is the commonest way a stress test's severity gets
       overstated in the write-up. */
    worstShock,
    worstZ,
    returnPeriod: worstShock > 0 ? 1 / normCdf(-worstShock) : Infinity,
    absoluteReturnPeriod: 1 / normCdf(worstZ),
    capitalZ: -normInv(0.999),
    cumulativeLoss,
    lossRate: cumulativeLoss / totalEad,
    headroom: trough.ratio - book.requirement,
    shortfall: Math.max(0, (book.requirement - trough.ratio) * trough.rwa),
    passes: trough.ratio >= book.requirement,
    breachesMinimum: trough.ratio < book.minimumCet1,
    attribution: attribution(book.cet1 / openingRwa, book.cet1, openingRwa, trough),
    /* The gap between the two engines at the worst quarter, which
       is the number this page exists to put on the table. */
    engineGap: gapAtWorst(quarters),
  };
}

const weighted = (segments, fn) => {
  const total = segments.reduce((t, s) => t + s.ead, 0) || 1;
  return segments.reduce((t, s) => t + fn(s) * s.ead, 0) / total;
};

/**
 * The two engines at the quarter where the economy is worst,
 * with the difference between them split into the part that is
 * the link function and the part that is the book getting
 * younger as it re-lends.
 */
function gapAtWorst(quarters) {
  const worst = quarters.slice(1).reduce((w, x) => (x.s > w.s ? x : w), quarters[1]);
  return {
    q: worst.q,
    shock: worst.s,
    merton: worst.pdMerton,
    vintage: worst.pdVintage,
    link: worst.pdVintageLink,
    linkGap: worst.pdMerton - worst.pdVintageLink,
    mixGap: worst.pdVintage - worst.pdVintageLink,
    /* Like for like: the probit link against the log link, on the
       same age mix. This is the model risk. */
    ratio: worst.pdVintageLink ? worst.pdMerton / worst.pdVintageLink : NaN,
    /* And separately, what the vintage engine can see and the
       other cannot: a book that re-lends is a book that is
       getting younger, and young loans have not reached the top
       of their seasoning curve yet. */
    mixRatio: worst.pdVintageLink ? worst.pdVintage / worst.pdVintageLink : NaN,
  };
}

/**
 * Why the capital ratio moved: losses, or the same loans being
 * measured as riskier.
 *
 * A ratio is a fraction, so the two effects multiply rather than
 * add and cannot be split by subtraction without an arbitrary
 * interaction term left over. In logs they are exactly additive,
 * so the split is done there and then converted back to the
 * basis points the ratio actually moved. It adds up by
 * construction, which a subtraction-based attribution does not.
 */
export function attribution(openingRatio, openingCet1, openingRwa, q) {
  const totalBps = (q.ratio - openingRatio) * 10000;
  const lnCapital = Math.log(q.cet1 / openingCet1);
  const lnRwa = -Math.log(q.rwa / openingRwa);
  const lnTotal = lnCapital + lnRwa;
  if (!Number.isFinite(lnTotal) || Math.abs(lnTotal) < 1e-12) {
    return { totalBps, fromCapital: 0, fromRwa: 0 };
  }
  return {
    totalBps,
    fromCapital: (totalBps * lnCapital) / lnTotal,
    fromRwa: (totalBps * lnRwa) / lnTotal,
  };
}

/* ------------------------------------------------------------
   14 · Reverse stress testing

   The regulator's question is not "what happens in this
   scenario". It is "what scenario breaks us". Bisect on a
   multiplier applied to every peak shock until the capital ratio
   sits exactly on the requirement, then report that multiple in
   the units someone can argue with: percentage points of
   unemployment, and how often an economy that bad turns up.
   ------------------------------------------------------------ */
export function reverseStress(a, segments = SEGMENTS, book = BOOK, { max = 6, iterations = 40 } = {}) {
  const at = (mult) => {
    const scaled = { ...a };
    for (const m of MACRO) scaled[m.key] = (a[m.key] ?? 0) * mult;
    return run(scaled, segments, book);
  };

  const worst = at(max);
  if (worst.trough.ratio > book.requirement) {
    return { found: false, max, worst };
  }
  const mild = at(0);
  if (mild.trough.ratio < book.requirement) {
    return { found: true, multiple: 0, result: mild, alreadyBreached: true };
  }

  let lo = 0;
  let hi = max;
  for (let i = 0; i < iterations; i++) {
    const mid = (lo + hi) / 2;
    if (at(mid).trough.ratio < book.requirement) hi = mid; else lo = mid;
  }
  const multiple = (lo + hi) / 2;
  const result = at(multiple);
  return {
    found: true,
    multiple,
    result,
    unemployment: (a.unemployment ?? 0) * multiple,
    worstShock: result.worstShock,
    worstZ: result.worstZ,
    returnPeriod: result.worstShock > 0 ? 1 / normCdf(-result.worstShock) : Infinity,
  };
}

/* ------------------------------------------------------------
   15 · Which variable is doing the damage

   One macro variable at a time, everything else at base. The
   parts will not add up to the whole, and that is the finding
   rather than an error: the loss function is convex, so shocks
   arriving together cost more than the same shocks arriving one
   at a time. The page says so next to the chart.
   ------------------------------------------------------------ */
export function tornado(a, segments = SEGMENTS, book = BOOK) {
  const full = run(a, segments, book);
  const zero = { ...a };
  for (const m of MACRO) zero[m.key] = 0;
  const none = run(zero, segments, book);

  const bars = MACRO.map((m) => {
    const one = { ...zero, [m.key]: a[m.key] ?? 0 };
    const r = run(one, segments, book);
    return {
      key: m.key,
      label: m.short,
      shock: a[m.key] ?? 0,
      loss: r.cumulativeLoss,
      marginal: r.cumulativeLoss - none.cumulativeLoss,
      ratio: r.trough.ratio,
      cet1Cost: none.trough.ratio - r.trough.ratio,
    };
  }).sort((x, y) => y.marginal - x.marginal);

  const sumOfParts = bars.reduce((t, b) => t + b.marginal, 0);
  return {
    bars,
    baseline: none.cumulativeLoss,
    together: full.cumulativeLoss - none.cumulativeLoss,
    sumOfParts,
    interaction: (full.cumulativeLoss - none.cumulativeLoss) - sumOfParts,
  };
}

/* ------------------------------------------------------------
   16 · Two-way sensitivity

   Rows are the unemployment peak, columns the transmission dial,
   cells the trough capital ratio. Every cell is a complete run
   of the model over twelve quarters and seven segments, not an
   interpolation, same rule as the valuation grid in the DCF.
   ------------------------------------------------------------ */
export function ladder(centre, step, count = 5) {
  const half = Math.floor(count / 2);
  return Array.from({ length: count }, (_, i) => centre + (i - half) * step);
}

export function sensitivity(a, {
  rowKey = "unemployment", rowStep = 1.0,
  colKey = "macroSensitivity", colStep = 0.25,
  size = 5,
} = {}, segments = SEGMENTS, book = BOOK) {
  const rows = ladder(a[rowKey], rowStep, size).map((v) => Math.max(0, +v.toFixed(4)));
  const cols = ladder(a[colKey], colStep, size).map((v) => Math.max(0, +v.toFixed(4)));

  const cells = rows.map((r) =>
    cols.map((c) => {
      const res = run({ ...a, [rowKey]: r, [colKey]: c }, segments, book);
      return {
        row: r, col: c,
        ratio: res.trough.ratio,
        loss: res.cumulativeLoss,
        passes: res.trough.ratio >= book.requirement,
      };
    })
  );

  const mid = Math.floor(size / 2);
  const finite = cells.flat().map((c) => c.ratio).filter(Number.isFinite);
  return {
    rowKey, colKey, rows, cols, cells,
    base: { row: mid, col: mid },
    min: finite.length ? Math.min(...finite) : NaN,
    max: finite.length ? Math.max(...finite) : NaN,
  };
}

/* ------------------------------------------------------------
   17 · Bring your own book

   Five columns, in this order or with a header row naming them:
   segment, exposure, PD, LGD, kind. Everything else, the macro
   betas, the correlation, the seasoning curve, the vintage mix,
   is taken from the shipped segment of the same kind, because a
   bank that can export those has no need of this page.
   ------------------------------------------------------------ */
const KIND_ALIASES = {
  mortgage: "mortgage", home: "mortgage", housing: "mortgage", "home loan": "mortgage",
  retail: "retail", personal: "retail", auto: "retail", consumer: "retail",
  qrre: "qrre", card: "qrre", "credit card": "qrre", revolving: "qrre",
  corporate: "corporate", corp: "corporate", sme: "corporate", business: "corporate",
  commercial: "corporate", wholesale: "corporate",
};

const TEMPLATE_FOR_KIND = {
  mortgage: "home", retail: "personal", qrre: "card", corporate: "smeterm",
};

function splitRow(line) {
  const out = [];
  let cur = "";
  let quoted = false;
  for (const ch of line) {
    if (ch === '"') { quoted = !quoted; continue; }
    if (!quoted && (ch === "," || ch === ";" || ch === "\t")) { out.push(cur.trim()); cur = ""; continue; }
    cur += ch;
  }
  out.push(cur.trim());
  return out;
}

/** A rate given as either 0.048 or "4.8%" or "4.8". */
function readRate(raw) {
  const text = String(raw).trim();
  const pct = text.endsWith("%");
  const n = Number(text.replace(/[%,]/g, ""));
  if (!Number.isFinite(n)) return NaN;
  if (pct) return n / 100;
  return n > 1 ? n / 100 : n;
}

export function parsePortfolioCsv(text) {
  const errors = [];
  const lines = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const segments = [];

  lines.forEach((line, i) => {
    const cells = splitRow(line);
    if (cells.length < 4) {
      if (i > 0) errors.push(`Line ${i + 1}: needs at least four columns`);
      return;
    }
    const [name, eadRaw, pdRaw, lgdRaw, kindRaw = "", undrawnRaw = ""] = cells;
    const ead = Number(String(eadRaw).replace(/,/g, ""));
    const pd = readRate(pdRaw);
    const lgd = readRate(lgdRaw);

    if (!name || !Number.isFinite(ead) || ead <= 0 || !Number.isFinite(pd) || !Number.isFinite(lgd)) {
      // the header row lands here, which is expected rather than an error
      if (i > 0) errors.push(`Line ${i + 1}: could not read "${name}"`);
      return;
    }
    if (pd <= 0 || pd >= 1) { errors.push(`Line ${i + 1}: a PD of ${pdRaw} is not a probability`); return; }
    if (lgd <= 0 || lgd > 1) { errors.push(`Line ${i + 1}: an LGD of ${lgdRaw} is not a fraction`); return; }

    const kind = KIND_ALIASES[String(kindRaw).toLowerCase().trim()] ?? "corporate";
    const template = SEGMENTS.find((s) => s.id === TEMPLATE_FOR_KIND[kind]);
    const undrawn = Number(String(undrawnRaw).replace(/,/g, ""));

    segments.push({
      ...template,
      id: `csv-${segments.length}`,
      name,
      kind,
      ead,
      undrawn: Number.isFinite(undrawn) && undrawn > 0 ? undrawn : 0,
      pdTtc: pd,
      lgdBase: lgd,
      lgdFloor: Math.min(template.lgdFloor, lgd * 0.6),
      imported: true,
      blurb: `Imported: ${name}, mapped to the ${kind} treatment.`,
    });
  });

  if (!segments.length) errors.push("No usable rows. Columns are: name, exposure, PD, LGD, kind.");
  return { segments, errors };
}

/**
 * Capital scales with the book, so an imported book of a
 * different size needs a capital base of its own or every ratio
 * is nonsense. Hold the opening capital ratio at the shipped
 * book's, which is the only assumption available that does not
 * require the reader to type their balance sheet in.
 */
export function bookFor(segments, a = DEFAULTS, template = BOOK) {
  if (!segments.some((s) => s.imported)) return template;
  const rwa = segments.reduce((t, s) => t + capitalRequirement({
    pd: s.pdTtc, lgd: s.lgdBase, kind: s.kind, maturity: s.maturity,
    sizeAdjustment: s.sizeAdjustment ?? 0, scale: a.correlationScale,
  }) * 12.5 * s.ead, 0);
  const openingRatio = template.cet1 / SEGMENTS.reduce((t, s) => t + capitalRequirement({
    pd: s.pdTtc, lgd: s.lgdBase, kind: s.kind, maturity: s.maturity,
    sizeAdjustment: s.sizeAdjustment ?? 0, scale: a.correlationScale,
  }) * 12.5 * s.ead, 0);
  const ead = segments.reduce((t, s) => t + s.ead, 0);
  const shippedEad = SEGMENTS.reduce((t, s) => t + s.ead, 0);
  return {
    ...template,
    name: "Imported book",
    cet1: rwa * openingRatio,
    ppnr: template.ppnr * (ead / shippedEad),
    imported: true,
  };
}

/* ------------------------------------------------------------
   18 · CSV out
   ------------------------------------------------------------ */
export function toCsv(a, segments = SEGMENTS, book = BOOK) {
  const r = run(a, segments, book);
  const esc = (s) =>
    typeof s === "string" && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  const L = [];
  const row = (...cells) => L.push(cells.map(esc).join(","));
  const f = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "");

  row(`${book.name}: credit stress test`);
  row(book.note);
  row(`All figures in ${book.unit} unless marked`);
  row(`Engine: ${a.engine === "vintage" ? "vintage hazard" : "Merton / Vasicek conditional PD"}`);
  row(`Risk weights on: ${a.rwaBasis} PDs`);
  row("");

  row("SCENARIO");
  row("Variable", "Start", ...r.path.slice(1).map((p) => `Q${p.q}`));
  MACRO.forEach((m) => row(m.label, f(m.base), ...r.path.slice(1).map((p) => f(p.levels[m.key]))));
  row("");

  row("ASSUMPTIONS");
  DRIVERS.forEach((d) => row(d.label, f(a[d.key], 3)));
  row("");

  row("PORTFOLIO, QUARTER BY QUARTER");
  row("Quarter", "Systematic factor Z", "PD %", "LGD %", "Loss", "Provision charge",
    "Stage 2 %", "ECL stock", "RWA", "CET1", "CET1 ratio %");
  r.quarters.forEach((q) => row(
    q.q === 0 ? "Opening" : `Q${q.q}`,
    f(q.z, 2), f(q.pd * 100, 3), f(q.lgd * 100, 2), f(q.loss, 1), f(q.charge, 1),
    q.stage2 === null ? "" : f((q.stage2 / (q.performing || 1)) * 100, 1),
    q.ecl === null ? "" : f(q.ecl, 1),
    f(q.rwa, 0), f(q.cet1, 0), f(q.ratio * 100, 2)));
  row("");

  row("BY SEGMENT, WORST QUARTER FOR THE CAPITAL RATIO", `Q${r.trough.q}`);
  row("Segment", "Exposure", "TTC PD %", "Stressed PD %", "Stressed LGD %",
    "Cumulative loss", "Stage 2 %", "Risk weight %");
  r.runs.forEach((seg) => {
    const q = seg.quarters[r.trough.q - 1];
    row(seg.seg.name, f(seg.seg.ead, 0), f(seg.seg.pdTtc * 100, 2), f(q.pd * 100, 2),
      f(q.lgd * 100, 1), f(q.cumulativeLoss, 1), f(q.share2 * 100, 1), f(q.k * 12.5 * 100, 1));
  });
  row("");

  row("RESULT");
  row("Cumulative three-year loss", f(r.cumulativeLoss, 0));
  row("Loss rate, % of exposure", f(r.lossRate * 100, 2));
  row("Opening CET1 ratio %", f(r.openingRatio * 100, 2));
  row("Trough CET1 ratio %", f(r.trough.ratio * 100, 2));
  row("Trough quarter", `Q${r.trough.q}`);
  row("Requirement %", f(book.requirement * 100, 2));
  row("Headroom, bps", f(r.headroom * 10000, 0));
  row("Capital shortfall", f(r.shortfall, 0));
  row("Worst shock, standard deviations", f(r.worstShock, 2));
  row("Implied return period, years", Number.isFinite(r.returnPeriod) ? f(r.returnPeriod, 0) : "");
  row("Worst systematic factor Z, absolute scale", f(r.worstZ, 2));
  row("The capital formula's Z", f(r.capitalZ, 2));
  row("Fall in the ratio from losses, bps", f(r.attribution.fromCapital, 0));
  row("Fall in the ratio from RWA, bps", f(r.attribution.fromRwa, 0));

  return L.join("\n");
}
