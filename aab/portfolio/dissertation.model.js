/* dissertation.model.js: the statistics engine behind the
   Islamic-vs-conventional fund case study. No DOM, numbers in
   and numbers out, checked by `dissertation.test.ts`.

   The NONCENTRAL t is what makes an honest power calculation
   possible on a sample of three: with two degrees of freedom the
   t distribution is nothing like normal, and the point of the
   exercise is to be truthful about what three funds can detect. */

/* ------------------------------------------------------------
   1 · distribution functions
   ------------------------------------------------------------ */

/** Lanczos approximation to log Γ(x), x > 0. */
export function lgamma(x) {
  const g = [
    676.5203681218851, -1259.1392167224028, 771.32342877765313,
    -176.61502916214059, 12.507343278686905, -0.13857109526572012,
    9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) {
    // reflection, so the series is only ever used where it converges
    return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
  }
  const z = x - 1;
  let a = 0.99999999999980993;
  for (let i = 0; i < g.length; i++) a += g[i] / (z + i + 1);
  const t = z + g.length - 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(a);
}

/** Continued fraction for the incomplete beta (Lentz's method). */
function betacf(a, b, x) {
  const FPMIN = 1e-300;
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < FPMIN) d = FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < FPMIN) d = FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < FPMIN) c = FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-16) break;
  }
  return h;
}

/** Regularised incomplete beta I_x(a, b). */
export function incBeta(x, a, b) {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lbeta = lgamma(a + b) - lgamma(a) - lgamma(b);
  const front = Math.exp(lbeta + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2)
    ? (front * betacf(a, b, x)) / a
    : 1 - (front * betacf(b, a, 1 - x)) / b;
}

/** Standard normal CDF, via the complementary error function. */
export function normCdf(z) {
  return 0.5 * erfc(-z / Math.SQRT2);
}

/** erfc to ~1e-15, the Numerical Recipes rational approximation. */
export function erfc(x) {
  const z = Math.abs(x);
  const t = 2 / (2 + z);
  const ty = 4 * t - 2;
  const cof = [
    -1.3026537197817094, 6.4196979235649026e-1, 1.9476473204185836e-2,
    -9.561514786808631e-3, -9.46595344482036e-4, 3.66839497852761e-4,
    4.2523324806907e-5, -2.0278578112534e-5, -1.624290004647e-6,
    1.303655835580e-6, 1.5626441722e-8, -8.5238095915e-8,
    6.529054439e-9, 5.059343495e-9, -9.91364156e-10, -2.27365122e-10,
    9.6467911e-11, 2.394038e-12, -6.886027e-12, 8.94487e-13,
    3.13092e-13, -1.12708e-13, 3.81e-16, 7.106e-15,
  ];
  let d = 0;
  let dd = 0;
  for (let j = cof.length - 1; j > 0; j--) {
    const tmp = d;
    d = ty * d - dd + cof[j];
    dd = tmp;
  }
  const ans = t * Math.exp(-z * z + 0.5 * (cof[0] + ty * d) - dd);
  return x >= 0 ? ans : 2 - ans;
}

/** CDF of Student's t with df degrees of freedom. */
export function tCdf(t, df) {
  if (!Number.isFinite(t)) return t > 0 ? 1 : 0;
  if (df <= 0) return NaN;
  const x = df / (df + t * t);
  const p = 0.5 * incBeta(x, df / 2, 0.5);
  return t > 0 ? 1 - p : p;
}

/** Two-tailed p-value for a t statistic. */
export const tTwoTail = (t, df) => 2 * (1 - tCdf(Math.abs(t), df));

/** Inverse CDF of Student's t, by bisection on tCdf. */
export function tQuantile(p, df) {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  let lo = -400;
  let hi = 400;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid; else hi = mid;
  }
  return (lo + hi) / 2;
}

/* ------------------------------------------------------------
   The noncentral t CDF, Lenth (1989), AS 243.

   P(T ≤ t) where T follows a noncentral t with `df` degrees of
   freedom and noncentrality δ. This is what turns "the study
   found nothing" into "the study could not have found anything
   smaller than X", which is a completely different sentence.
   ------------------------------------------------------------ */
export function nctCdf(t, df, delta) {
  if (t < 0) return 1 - nctCdf(-t, df, -delta);

  const errmax = 1e-12;
  const itrmax = 1000;
  const x = (t * t) / (t * t + df);
  if (x <= 0) return normCdf(-delta);

  const lambda = delta * delta;
  let p = 0.5 * Math.exp(-0.5 * lambda);
  let q = Math.sqrt(2 / Math.PI) * p * delta;
  let s = 0.5 - p;
  if (s < 1e-14) s = 0; // δ tiny: the series is already exhausted

  let a = 0.5;
  const b = 0.5 * df;
  const rxb = (1 - x) ** b;
  const albeta = lgamma(a) + lgamma(b) - lgamma(a + b);

  let xodd = incBeta(x, a, b);
  let godd = 2 * rxb * Math.exp(a * Math.log(x) - albeta);
  let xeven = 1 - rxb;
  let geven = b * x * rxb;

  let sum = p * xodd + q * xeven;

  for (let it = 1; it <= itrmax; it++) {
    a += 1;
    xodd -= godd;
    xeven -= geven;
    godd *= (x * (a + b - 1)) / a;
    geven *= (x * (a + b - 0.5)) / (a + 0.5);
    p *= lambda / (2 * it);
    q *= lambda / (2 * it + 1);
    s -= p;
    sum += p * xodd + q * xeven;
    const errbd = 2 * s * (xodd - godd);
    if (Math.abs(errbd) < errmax) break;
  }
  return Math.min(1, Math.max(0, sum + normCdf(-delta)));
}

/* ------------------------------------------------------------
   2 · tests and power
   ------------------------------------------------------------ */

/**
 * Welch's unequal-variance two-sample t-test: the test the
 * dissertation ran on every fund-level metric.
 * Returns the difference (group 1 − group 2), its standard error,
 * the t statistic, the Welch–Satterthwaite df and the two-tailed p.
 */
export function welch({ m1, s1, n1, m2, s2, n2 }) {
  const v1 = (s1 * s1) / n1;
  const v2 = (s2 * s2) / n2;
  const se = Math.sqrt(v1 + v2);
  const diff = m1 - m2;
  const df =
    (v1 + v2) ** 2 / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1));
  const t = diff / se;
  return { diff, se, t, df, p: tTwoTail(t, df) };
}

/**
 * Power of a two-sided two-sample t-test to detect a true mean
 * difference of `delta`, using the noncentral t, not a normal
 * approximation, because at n₁ = 3 the two differ enormously.
 */
export function power({ n1, n2, sd1, sd2, delta, alpha = 0.05 }) {
  if (n1 < 2 || n2 < 2) return NaN;
  const v1 = (sd1 * sd1) / n1;
  const v2 = (sd2 * sd2) / n2;
  const se = Math.sqrt(v1 + v2);
  if (!(se > 0)) return NaN;
  const df =
    (v1 + v2) ** 2 / ((v1 * v1) / (n1 - 1) + (v2 * v2) / (n2 - 1));
  const crit = tQuantile(1 - alpha / 2, df);
  const ncp = Math.abs(delta) / se;
  // both rejection tails, though the far one is negligible here
  return 1 - nctCdf(crit, df, ncp) + nctCdf(-crit, df, ncp);
}

/**
 * The inverse question, and the one worth asking of a null
 * result: what is the SMALLEST true difference this design would
 * have caught, `target` of the time? Bisection on power().
 */
export function minDetectable({ n1, n2, sd1, sd2, alpha = 0.05, target = 0.8 }) {
  let lo = 0;
  let hi = 10 * Math.max(sd1, sd2, 1e-6);
  if (power({ n1, n2, sd1, sd2, delta: hi, alpha }) < target) return Infinity;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (power({ n1, n2, sd1, sd2, delta: mid, alpha }) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

/** Significance stars at a chosen threshold family. */
export function stars(p) {
  if (p < 0.01) return "***";
  if (p < 0.05) return "**";
  if (p < 0.1) return "*";
  return "";
}

/** Does a confidence interval at level `conf` exclude zero? */
export function excludesZero(b, se, df, conf = 0.95) {
  const q = tQuantile(1 - (1 - conf) / 2, df);
  const lo = b - q * se;
  const hi = b + q * se;
  return { lo, hi, excludes: lo > 0 || hi < 0 };
}

/* ------------------------------------------------------------
   3 · series helpers
   ------------------------------------------------------------ */

/** Rebase a level series so its first point equals `base`. */
export function rebase(series, base = 100) {
  const first = series.find((v) => Number.isFinite(v) && v !== 0);
  if (!first) return series.map(() => NaN);
  return series.map((v) => (Number.isFinite(v) ? (v / first) * base : NaN));
}

/** Drawdown from the running peak, as a negative fraction. */
export function underwater(levels) {
  let peak = -Infinity;
  return levels.map((v) => {
    if (!Number.isFinite(v)) return NaN;
    if (v > peak) peak = v;
    return peak > 0 ? v / peak - 1 : 0;
  });
}

export const maxDrawdown = (levels) => {
  const dd = underwater(levels).filter(Number.isFinite);
  return dd.length ? Math.min(...dd) : NaN;
};

/** Compound growth over a level series, annualised by months. */
export function cagrMonthly(levels) {
  const clean = levels.filter(Number.isFinite);
  if (clean.length < 2) return NaN;
  const months = clean.length - 1;
  return (clean[clean.length - 1] / clean[0]) ** (12 / months) - 1;
}

/** Annualised volatility from a monthly level series. */
export function volMonthly(levels) {
  const clean = levels.filter(Number.isFinite);
  const r = [];
  for (let i = 1; i < clean.length; i++) r.push(clean[i] / clean[i - 1] - 1);
  if (r.length < 2) return NaN;
  const m = r.reduce((s, x) => s + x, 0) / r.length;
  const ss = r.reduce((s, x) => s + (x - m) ** 2, 0) / (r.length - 1);
  return Math.sqrt(ss) * Math.sqrt(12);
}

/** Linear-interpolated quantile on an already sorted array. */
export function quantileSorted(sorted, p) {
  const n = sorted.length;
  if (!n) return NaN;
  if (p <= 0) return sorted[0];
  if (p >= 1) return sorted[n - 1];
  const i = (n - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (i - lo) * (sorted[hi] - sorted[lo]);
}

/**
 * Tukey box-plot statistics: quartiles, the 1.5×IQR fences, the
 * whisker ends (the most extreme points still inside the fences)
 * and the outliers beyond them.
 */
export function boxStats(values) {
  const s = [...values].filter(Number.isFinite).sort((a, b) => a - b);
  if (!s.length) return null;
  const q1 = quantileSorted(s, 0.25);
  const med = quantileSorted(s, 0.5);
  const q3 = quantileSorted(s, 0.75);
  const iqr = q3 - q1;
  const loFence = q1 - 1.5 * iqr;
  const hiFence = q3 + 1.5 * iqr;
  const inside = s.filter((v) => v >= loFence && v <= hiFence);
  const mean = s.reduce((a, b) => a + b, 0) / s.length;
  return {
    n: s.length,
    min: s[0],
    max: s[s.length - 1],
    q1, med, q3, iqr, mean,
    whiskerLo: inside.length ? inside[0] : s[0],
    whiskerHi: inside.length ? inside[inside.length - 1] : s[s.length - 1],
    outliers: s.filter((v) => v < loFence || v > hiFence),
    sd: Math.sqrt(
      s.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, s.length - 1)
    ),
  };
}

/**
 * Coarsen the shipped histogram by an integer factor, and clip it
 * to a window. The bins arrive at 0.5pp resolution over the
 * excess-return column; anything wider is a re-sum of those,
 * never a re-estimate.
 */
export function rebin(hist, { factor = 1, lo = -Infinity, hi = Infinity } = {}) {
  const out = [];
  for (let i = 0; i < hist.bins.length; i += factor) {
    let count = 0;
    for (let j = i; j < Math.min(i + factor, hist.bins.length); j++) count += hist.bins[j];
    const from = hist.lo + i * hist.width;
    const to = from + factor * hist.width;
    if (to <= lo || from >= hi) continue;
    out.push({ from, to, mid: (from + to) / 2, count });
  }
  return out;
}

/** A normal curve with the same mean and sd, scaled to the bins. */
export function normalOverlay(bins, { mean, sd, n }) {
  if (!bins.length) return [];
  const w = bins[0].to - bins[0].from;
  return bins.map((b) => ({
    mid: b.mid,
    count:
      (n * w * Math.exp(-((b.mid - mean) ** 2) / (2 * sd * sd))) /
      (sd * Math.sqrt(2 * Math.PI)),
  }));
}

/** Month index → "Jan 2018" style label. */
export function monthLabel(startYm, i) {
  const [y, m] = startYm.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + i, 1));
  return d.toLocaleDateString("en-GB", { month: "short", year: "numeric", timeZone: "UTC" });
}

export function monthKey(startYm, i) {
  const [y, m] = startYm.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + i, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}
