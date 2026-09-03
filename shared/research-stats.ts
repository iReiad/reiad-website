/* ============================================================
   shared/research-stats.ts: the lab's first tier of statistics,
   in TypeScript, so it runs in every browser and in node.
   RESEARCH.md section 14 and the campaign's additions in 36.

   Every function here is pure and takes plain arrays, because a
   regression that is nearly right is worse than none:
   scripts/research-stats.test.ts holds each one to a closed form
   or a hand-computed answer to four decimals. Nothing here reads
   a file or a row; the lab hands columns in and gets a fit out.

   Standard errors: `classical`, `HC0`, `HC1` (which is what Stata's
   `robust` gives), `HC3`, and clustered by a group id with Stata's
   small-sample factor G/(G-1) times (n-1)/(n-k), with the t test on
   G-1 degrees of freedom, so a table here says what a table from
   Stata says.
   ============================================================ */

export type Matrix = number[][];

/* ---------- linear algebra, small and dense ---------- */

export const transpose = (A: Matrix): Matrix => (A[0] ?? []).map((_c, j) => A.map((row) => row[j]));

export function multiply(A: Matrix, B: Matrix): Matrix {
  const out: Matrix = [];
  for (let i = 0; i < A.length; i++) {
    const row: number[] = new Array<number>(B[0].length).fill(0);
    for (let k = 0; k < B.length; k++) {
      const a = A[i][k];
      if (a === 0) continue;
      const b = B[k];
      for (let j = 0; j < b.length; j++) row[j] += a * b[j];
    }
    out.push(row);
  }
  return out;
}

/** X'X and X'y in one pass over the rows. */
export function crossProducts(X: Matrix, y: number[]): { xtx: Matrix; xty: number[] } {
  const k = X[0].length;
  const xtx: Matrix = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  const xty = new Array<number>(k).fill(0);
  for (let i = 0; i < X.length; i++) {
    const r = X[i];
    for (let a = 0; a < k; a++) {
      xty[a] += r[a] * y[i];
      for (let b = a; b < k; b++) xtx[a][b] += r[a] * r[b];
    }
  }
  for (let a = 0; a < k; a++) for (let b = 0; b < a; b++) xtx[a][b] = xtx[b][a];
  return { xtx, xty };
}

/** Gauss-Jordan with partial pivoting. Throws on a singular
    matrix, which is a collinear design and has to be said rather
    than answered with garbage. */
export function inverse(A: Matrix): Matrix {
  const n = A.length;
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_v, j) => (i === j ? 1 : 0))]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    if (Math.abs(M[p][c]) < 1e-12) throw new Error("singular");
    [M[c], M[p]] = [M[p], M[c]];
    const d = M[c][c];
    for (let j = 0; j < 2 * n; j++) M[c][j] /= d;
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) M[r][j] -= f * M[c][j];
    }
  }
  return M.map((row) => row.slice(n));
}

export const solve = (A: Matrix, b: number[]): number[] => multiply(inverse(A), b.map((v) => [v])).map((r) => r[0]);

/* ---------- distributions ---------- */

/** ln Γ(x), Lanczos. */
export function lnGamma(x: number): number {
  const c = [76.18009172947146, -86.50532032941677, 24.01409824083091, -1.231739572450155, 0.1208650973866179e-2, -0.5395239384953e-5];
  let y = x;
  const t = x + 5.5 - (x + 0.5) * Math.log(x + 5.5);
  let s = 1.000000000190015;
  for (const v of c) s += v / ++y;
  return -t + Math.log(2.5066282746310005 * s / x);
}

function betacf(a: number, b: number, x: number): number {
  const TINY = 1e-300;
  const qab = a + b, qap = a + 1, qam = a - 1;
  let c = 1, d = 1 - qab * x / qap;
  if (Math.abs(d) < TINY) d = TINY;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 300; m++) {
    const m2 = 2 * m;
    let aa = m * (b - m) * x / ((qam + m2) * (a + m2));
    d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d; h *= d * c;
    aa = -(a + m) * (qab + m) * x / ((a + m2) * (qap + m2));
    d = 1 + aa * d; if (Math.abs(d) < TINY) d = TINY;
    c = 1 + aa / c; if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-14) break;
  }
  return h;
}

/** The regularised incomplete beta I_x(a, b). */
export function incompleteBeta(a: number, b: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(lnGamma(a + b) - lnGamma(a) - lnGamma(b) + a * Math.log(x) + b * Math.log(1 - x));
  return x < (a + 1) / (a + b + 2) ? bt * betacf(a, b, x) / a : 1 - bt * betacf(b, a, 1 - x) / b;
}

/** The regularised lower incomplete gamma P(a, x). */
export function incompleteGamma(a: number, x: number): number {
  if (x <= 0) return 0;
  const gln = lnGamma(a);
  if (x < a + 1) {
    let ap = a, sum = 1 / a, del = sum;
    for (let n = 0; n < 500; n++) {
      ap += 1; del *= x / ap; sum += del;
      if (Math.abs(del) < Math.abs(sum) * 3e-14) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - gln);
  }
  const TINY = 1e-300;
  let b = x + 1 - a, c = 1 / TINY, d = 1 / b, h = d;
  for (let i = 1; i <= 500; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b; if (Math.abs(d) < TINY) d = TINY;
    c = b + an / c; if (Math.abs(c) < TINY) c = TINY;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-14) break;
  }
  return 1 - Math.exp(-x + a * Math.log(x) - gln) * h;
}

export const normalCdf = (z: number): number => {
  /* erfc by Chebyshev fit, |error| < 1.2e-7 everywhere. */
  const t = 1 / (1 + 0.5 * Math.abs(z) / Math.SQRT2);
  const x = Math.abs(z) / Math.SQRT2;
  const r = t * Math.exp(-x * x - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 + t * (0.27886807
    + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
  return z >= 0 ? 1 - r / 2 : r / 2;
};

/** Φ⁻¹, Acklam's rational approximation refined by one Newton step. */
export function normalInv(p: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239];
  const b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1];
  const c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  let x: number;
  if (p < 0.02425) {
    const q = Math.sqrt(-2 * Math.log(p));
    x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p > 1 - 0.02425) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else {
    const q = p - 0.5, r = q * q;
    x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const e = normalCdf(x) - p;
  return x - e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2);
}

export const tCdf = (t: number, df: number): number => {
  const x = df / (df + t * t);
  const p = 0.5 * incompleteBeta(df / 2, 0.5, x);
  return t >= 0 ? 1 - p : p;
};
export const tTwoSided = (t: number, df: number): number => (Number.isFinite(df) && df > 0 ? 2 * (1 - tCdf(Math.abs(t), df)) : 2 * (1 - normalCdf(Math.abs(t))));
export const fCdf = (f: number, df1: number, df2: number): number => (f <= 0 ? 0 : 1 - incompleteBeta(df2 / 2, df1 / 2, df2 / (df2 + df1 * f)));
export const chi2Cdf = (x: number, df: number): number => incompleteGamma(df / 2, x / 2);

/* ---------- descriptives ---------- */

export interface Describe { n: number; missing: number; mean: number; sd: number; min: number; q1: number; median: number; q3: number; max: number; skew: number; kurtosis: number }

export const clean = (xs: (number | null | undefined)[]): number[] => xs.filter((v): v is number => typeof v === "number" && Number.isFinite(v));

export function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return NaN;
  const pos = (sorted.length - 1) * q;
  const lo = Math.floor(pos), hi = Math.ceil(pos);
  return sorted[lo] + (sorted[hi] - sorted[lo]) * (pos - lo);
}

export const mean = (xs: number[]): number => xs.reduce((a, b) => a + b, 0) / xs.length;
export const variance = (xs: number[]): number => {
  const m = mean(xs);
  return xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1);
};
export const sd = (xs: number[]): number => Math.sqrt(variance(xs));

export function describe(raw: (number | null | undefined)[]): Describe {
  const xs = clean(raw);
  const s = [...xs].sort((a, b) => a - b);
  const n = xs.length;
  const m = mean(xs), v = variance(xs), d = Math.sqrt(v);
  const m3 = xs.reduce((a, b) => a + (b - m) ** 3, 0) / n;
  const m4 = xs.reduce((a, b) => a + (b - m) ** 4, 0) / n;
  const pv = xs.reduce((a, b) => a + (b - m) ** 2, 0) / n;
  return {
    n, missing: raw.length - n, mean: m, sd: d, min: s[0], q1: quantile(s, 0.25), median: quantile(s, 0.5), q3: quantile(s, 0.75), max: s[n - 1],
    skew: pv ? m3 / pv ** 1.5 : 0, kurtosis: pv ? m4 / pv ** 2 - 3 : 0,
  };
}

export function correlation(cols: number[][]): Matrix {
  const k = cols.length;
  const out: Matrix = Array.from({ length: k }, () => new Array<number>(k).fill(1));
  for (let a = 0; a < k; a++) for (let b = a + 1; b < k; b++) {
    const x = cols[a], y = cols[b];
    const mx = mean(x), my = mean(y);
    let sxy = 0, sxx = 0, syy = 0;
    for (let i = 0; i < x.length; i++) { sxy += (x[i] - mx) * (y[i] - my); sxx += (x[i] - mx) ** 2; syy += (y[i] - my) ** 2; }
    out[a][b] = out[b][a] = sxx && syy ? sxy / Math.sqrt(sxx * syy) : 0;
  }
  return out;
}

const ranks = (xs: number[]): number[] => {
  const order = xs.map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
  const r = new Array<number>(xs.length);
  for (let i = 0; i < order.length;) {
    let j = i;
    while (j + 1 < order.length && order[j + 1].v === order[i].v) j++;
    const avg = (i + j) / 2 + 1;
    for (let k = i; k <= j; k++) r[order[k].i] = avg;
    i = j + 1;
  }
  return r;
};

export const spearman = (x: number[], y: number[]): number => correlation([ranks(x), ranks(y)])[0][1];

/* ---------- tests ---------- */

export interface TTest { t: number; df: number; p: number; meanA: number; meanB: number; diff: number; se: number; ci: [number, number] }

/** Welch's t, which is what a reader should use unless they have a
    reason, and the paired version when asked. */
export function tTest(a: number[], b: number[], paired = false): TTest {
  if (paired) {
    const d = a.map((v, i) => v - b[i]);
    const m = mean(d), s = sd(d) / Math.sqrt(d.length), df = d.length - 1;
    const t = m / s;
    return { t, df, p: tTwoSided(t, df), meanA: mean(a), meanB: mean(b), diff: m, se: s, ci: [m - tInv(0.975, df) * s, m + tInv(0.975, df) * s] };
  }
  const va = variance(a) / a.length, vb = variance(b) / b.length;
  const se = Math.sqrt(va + vb);
  const df = (va + vb) ** 2 / (va ** 2 / (a.length - 1) + vb ** 2 / (b.length - 1));
  const diff = mean(a) - mean(b);
  const t = diff / se;
  return { t, df, p: tTwoSided(t, df), meanA: mean(a), meanB: mean(b), diff, se, ci: [diff - tInv(0.975, df) * se, diff + tInv(0.975, df) * se] };
}

/** t quantile by bisection on the CDF: fast enough for a
    confidence interval and exact to the CDF it inverts. */
export function tInv(p: number, df: number): number {
  let lo = -200, hi = 200;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (tCdf(mid, df) < p) lo = mid; else hi = mid;
    if (hi - lo < 1e-10) break;
  }
  return (lo + hi) / 2;
}

export interface Anova { f: number; df1: number; df2: number; p: number; means: number[]; ssBetween: number; ssWithin: number }

export function anova(groups: number[][]): Anova {
  const all = groups.flat();
  const grand = mean(all);
  const means = groups.map(mean);
  const ssB = groups.reduce((s, g, i) => s + g.length * (means[i] - grand) ** 2, 0);
  const ssW = groups.reduce((s, g, i) => s + g.reduce((a, v) => a + (v - means[i]) ** 2, 0), 0);
  const df1 = groups.length - 1, df2 = all.length - groups.length;
  const f = (ssB / df1) / (ssW / df2);
  return { f, df1, df2, p: 1 - fCdf(f, df1, df2), means, ssBetween: ssB, ssWithin: ssW };
}

export interface ChiSquare { chi2: number; df: number; p: number; expected: Matrix }

export function chiSquare(table: Matrix): ChiSquare {
  const rows = table.map((r) => r.reduce((a, b) => a + b, 0));
  const cols = table[0].map((_c, j) => table.reduce((a, r) => a + r[j], 0));
  const n = rows.reduce((a, b) => a + b, 0);
  const expected = table.map((r, i) => r.map((_v, j) => rows[i] * cols[j] / n));
  let chi2 = 0;
  table.forEach((r, i) => r.forEach((v, j) => { chi2 += (v - expected[i][j]) ** 2 / expected[i][j]; }));
  const df = (table.length - 1) * (table[0].length - 1);
  return { chi2, df, p: 1 - chi2Cdf(chi2, df), expected };
}

export interface MannWhitney { u: number; z: number; p: number }

export function mannWhitney(a: number[], b: number[]): MannWhitney {
  const r = ranks([...a, ...b]);
  const ra = r.slice(0, a.length).reduce((x, y) => x + y, 0);
  const u = ra - a.length * (a.length + 1) / 2;
  const mu = a.length * b.length / 2;
  const sigma = Math.sqrt(a.length * b.length * (a.length + b.length + 1) / 12);
  const z = (u - mu) / sigma;
  return { u, z, p: 2 * (1 - normalCdf(Math.abs(z))) };
}

/* ---------- OLS, and the standard errors that go with it ---------- */

export type Robust = "classical" | "HC0" | "HC1" | "HC3" | "cluster";

export interface Fit {
  names: string[];
  coef: number[];
  se: number[];
  t: number[];
  p: number[];
  n: number;
  k: number;
  df: number;
  r2: number;
  adjR2: number;
  sigma: number;
  robust: Robust;
  clusters?: number;
  residuals: number[];
  fitted: number[];
  fStat?: number;
  extra?: Record<string, number>;
}

export interface OlsOptions { intercept?: boolean; robust?: Robust; cluster?: (string | number)[]; dfResidual?: number; weights?: number[] }

/** Ordinary least squares over rows of X. The design gets a
    column of ones first unless told not to, and the answer's
    `names` line up with `coef`. */
export function ols(y: number[], X: Matrix, names: string[], o: OlsOptions = {}): Fit {
  const intercept = o.intercept !== false;
  const D = X.map((r) => (intercept ? [1, ...r] : [...r]));
  const labels = intercept ? ["(Intercept)", ...names] : [...names];
  const n = D.length, k = D[0].length;
  const wts = o.weights;
  const Dw = wts ? D.map((r, i) => r.map((v) => v * Math.sqrt(wts[i]))) : D;
  const yw = wts ? y.map((v, i) => v * Math.sqrt(wts[i])) : y;
  const { xtx, xty } = crossProducts(Dw, yw);
  const inv = inverse(xtx);
  const coef = multiply(inv, xty.map((v) => [v])).map((r) => r[0]);
  const fitted = D.map((r) => r.reduce((s, v, j) => s + v * coef[j], 0));
  const residuals = y.map((v, i) => v - fitted[i]);
  const df = o.dfResidual ?? n - k;
  const wr = wts ? residuals.map((e, i) => e * Math.sqrt(wts[i])) : residuals;
  const ssr = wr.reduce((s, e) => s + e * e, 0);
  const sigma2 = ssr / df;
  const robust: Robust = o.robust ?? (o.cluster ? "cluster" : "classical");
  let V: Matrix;
  let clusters: number | undefined;
  if (robust === "classical") {
    V = inv.map((r) => r.map((v) => v * sigma2));
  } else if (robust === "cluster") {
    if (!o.cluster) throw new Error("cluster ids needed");
    const groups = new Map<string | number, number[]>();
    o.cluster.forEach((g, i) => { groups.set(g, [...(groups.get(g) ?? []), i]); });
    clusters = groups.size;
    const meat: Matrix = Array.from({ length: k }, () => new Array<number>(k).fill(0));
    for (const idx of groups.values()) {
      const s = new Array<number>(k).fill(0);
      for (const i of idx) for (let a = 0; a < k; a++) s[a] += Dw[i][a] * wr[i];
      for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) meat[a][b] += s[a] * s[b];
    }
    const G = clusters;
    const adj = (G / (G - 1)) * ((n - 1) / (n - k));
    V = multiply(multiply(inv, meat), inv).map((r) => r.map((v) => v * adj));
  } else {
    const h = robust === "HC3" ? Dw.map((r) => r.reduce((s, v, a) => s + v * r.reduce((t, u, b) => t + inv[a][b] * u, 0), 0)) : null;
    const meat: Matrix = Array.from({ length: k }, () => new Array<number>(k).fill(0));
    for (let i = 0; i < n; i++) {
      const e2 = h ? (wr[i] / (1 - h[i])) ** 2 : wr[i] ** 2;
      for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) meat[a][b] += e2 * Dw[i][a] * Dw[i][b];
    }
    const adj = robust === "HC1" ? n / (n - k) : 1;
    V = multiply(multiply(inv, meat), inv).map((r) => r.map((v) => v * adj));
  }
  const se = V.map((r, i) => Math.sqrt(Math.max(r[i], 0)));
  const t = coef.map((c, i) => c / se[i]);
  const tdf = robust === "cluster" && clusters ? clusters - 1 : df;
  const p = t.map((v) => tTwoSided(v, tdf));
  const ym = mean(y);
  const sst = intercept ? y.reduce((s, v) => s + (v - ym) ** 2, 0) : y.reduce((s, v) => s + v * v, 0);
  const r2 = sst ? 1 - residuals.reduce((s, e) => s + e * e, 0) / sst : 0;
  const adjR2 = 1 - (1 - r2) * (n - 1) / df;
  const slopes = intercept ? k - 1 : k;
  const fStat = slopes > 0 && r2 < 1 ? (r2 / slopes) / ((1 - r2) / df) : undefined;
  return { names: labels, coef, se, t, p, n, k, df: tdf, r2, adjR2, sigma: Math.sqrt(sigma2), robust, clusters, residuals, fitted, fStat };
}

/* ---------- logit and probit, by Newton's method ---------- */

export interface GlmFit extends Fit { link: "logit" | "probit"; logLik: number; iterations: number; pseudoR2: number }

const phi = (z: number): number => Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);

export function glm(y: number[], X: Matrix, names: string[], link: "logit" | "probit" = "logit"): GlmFit {
  const D = X.map((r) => [1, ...r]);
  const labels = ["(Intercept)", ...names];
  const n = D.length, k = D[0].length;
  let beta = new Array<number>(k).fill(0);
  const p0 = mean(y);
  beta[0] = link === "logit" ? Math.log(p0 / (1 - p0)) : normalInv(p0);
  let ll = -Infinity, it = 0;
  let info: Matrix = [];
  for (it = 1; it <= 50; it++) {
    const score = new Array<number>(k).fill(0);
    info = Array.from({ length: k }, () => new Array<number>(k).fill(0));
    let llNew = 0;
    for (let i = 0; i < n; i++) {
      const eta = D[i].reduce((s, v, j) => s + v * beta[j], 0);
      let mu: number, w: number, g: number;
      if (link === "logit") {
        mu = 1 / (1 + Math.exp(-eta));
        w = mu * (1 - mu);
        g = y[i] - mu;
      } else {
        mu = Math.min(Math.max(normalCdf(eta), 1e-10), 1 - 1e-10);
        const d = phi(eta);
        w = d * d / (mu * (1 - mu));
        g = (y[i] - mu) * d / (mu * (1 - mu));
      }
      llNew += y[i] * Math.log(mu) + (1 - y[i]) * Math.log(1 - mu);
      for (let a = 0; a < k; a++) {
        score[a] += D[i][a] * g;
        for (let b = 0; b < k; b++) info[a][b] += w * D[i][a] * D[i][b];
      }
    }
    const step = solve(info, score);
    beta = beta.map((b, j) => b + step[j]);
    if (Math.abs(llNew - ll) < 1e-10) { ll = llNew; break; }
    ll = llNew;
  }
  const V = inverse(info);
  const se = V.map((r, i) => Math.sqrt(r[i]));
  const t = beta.map((b, i) => b / se[i]);
  const p = t.map((z) => 2 * (1 - normalCdf(Math.abs(z))));
  const fitted = D.map((r) => { const eta = r.reduce((s, v, j) => s + v * beta[j], 0); return link === "logit" ? 1 / (1 + Math.exp(-eta)) : normalCdf(eta); });
  const ll0 = n * (p0 * Math.log(p0) + (1 - p0) * Math.log(1 - p0));
  return {
    names: labels, coef: beta, se, t, p, n, k, df: n - k, r2: 1 - ll / ll0, adjR2: 1 - ll / ll0, sigma: NaN, robust: "classical",
    residuals: y.map((v, i) => v - fitted[i]), fitted, link, logLik: ll, iterations: it, pseudoR2: 1 - ll / ll0,
  };
}

/* ---------- panels, differences, instruments, surveys ---------- */

const demean = (v: number[], by: (string | number)[]): number[] => {
  const sums = new Map<string | number, { s: number; n: number }>();
  by.forEach((g, i) => { const c = sums.get(g) ?? { s: 0, n: 0 }; c.s += v[i]; c.n += 1; sums.set(g, c); });
  return v.map((x, i) => { const c = sums.get(by[i])!; return x - c.s / c.n; });
};

/** Fixed effects by the within transformation: every column
    demeaned by entity, and by time as well when asked (iterated,
    because the panel need not be balanced). Standard errors
    clustered by entity unless told otherwise, and the residual
    degrees of freedom charged for the absorbed effects, as
    `reghdfe` and `fixest` do. */
export function panelFE(y: number[], X: Matrix, names: string[], entity: (string | number)[], o: { time?: (string | number)[]; robust?: Robust } = {}): Fit {
  const cols = transpose(X);
  const sweep = (v: number[]): number[] => {
    let out = demean(v, entity);
    if (o.time) {
      for (let i = 0; i < 50; i++) {
        const next = demean(demean(out, o.time), entity);
        const change = Math.max(...next.map((a, j) => Math.abs(a - out[j])));
        out = next;
        if (change < 1e-12) break;
      }
    }
    return out;
  };
  const yd = sweep(y);
  const Xd = transpose(cols.map(sweep));
  const G = new Set(entity).size;
  const T = o.time ? new Set(o.time).size : 0;
  const absorbed = G + (T ? T - 1 : 0);
  const robust = o.robust ?? "cluster";
  const fit = ols(yd, Xd, names, { intercept: false, robust, cluster: robust === "cluster" ? entity : undefined, dfResidual: y.length - X[0].length - absorbed });
  fit.extra = { entities: G, periods: T, absorbed };
  return fit;
}

/** Difference in differences: the interaction's coefficient is the
    estimate, and the design is saturated so it equals the four
    means' double difference exactly when there are no controls. */
export function did(y: number[], treat: number[], post: number[], controls: Matrix = [], names: string[] = [], o: OlsOptions = {}): Fit {
  const X = y.map((_v, i) => [treat[i], post[i], treat[i] * post[i], ...(controls[i] ?? [])]);
  return ols(y, X, ["treat", "post", "treat:post", ...names], o);
}

/** An event study: a dummy for each relative period in the window
    except the reference, interacted with treatment, plus the
    entity and period fixed effects. */
export function eventStudy(y: number[], treat: number[], rel: number[], entity: (string | number)[], window: [number, number], ref = -1): { fit: Fit; periods: number[] } {
  const periods: number[] = [];
  for (let t = window[0]; t <= window[1]; t++) if (t !== ref) periods.push(t);
  const X = y.map((_v, i) => periods.map((t) => (treat[i] && rel[i] === t ? 1 : 0)));
  const fit = panelFE(y, X, periods.map((t) => `t${t >= 0 ? "+" : ""}${t}`), entity, { time: rel });
  return { fit, periods };
}

/** Two-stage least squares. `X` holds the endogenous columns first,
    then the exogenous; `Z` the excluded instruments. Residuals are
    from the structural equation, never from the fitted regressors,
    which is the mistake a by-hand second stage makes. */
export function tsls(y: number[], endog: Matrix, exog: Matrix, instruments: Matrix, names: { endog: string[]; exog: string[] }, o: { robust?: Robust } = {}): Fit & { firstStageF: number[] } {
  const n = y.length;
  const Z = y.map((_v, i) => [1, ...(exog[i] ?? []), ...instruments[i]]);
  const X = y.map((_v, i) => [1, ...endog[i], ...(exog[i] ?? [])]);
  const zz = inverse(crossProducts(Z, new Array<number>(n).fill(0)).xtx);
  const firstStageF: number[] = [];
  const Xhat = X.map((r) => [...r]);
  for (let j = 1; j <= endog[0].length; j++) {
    const col = X.map((r) => r[j]);
    const b = multiply(zz, crossProducts(Z, col).xty.map((v) => [v])).map((r) => r[0]);
    const fitted = Z.map((r) => r.reduce((s, v, a) => s + v * b[a], 0));
    fitted.forEach((v, i) => { Xhat[i][j] = v; });
    const restricted = ols(col, exog.map((r) => [...r]), names.exog);
    const ssrR = restricted.residuals.reduce((s, e) => s + e * e, 0);
    const ssrU = col.reduce((s, v, i) => s + (v - fitted[i]) ** 2, 0);
    const q = instruments[0].length;
    firstStageF.push(((ssrR - ssrU) / q) / (ssrU / (n - Z[0].length)));
  }
  const { xtx } = crossProducts(Xhat, y);
  const inv = inverse(xtx);
  const xhy = Xhat.reduce((s, r, i) => s.map((v, a) => v + r[a] * y[i]), new Array<number>(X[0].length).fill(0));
  const coef = multiply(inv, xhy.map((v) => [v])).map((r) => r[0]);
  const fitted = X.map((r) => r.reduce((s, v, j) => s + v * coef[j], 0));
  const residuals = y.map((v, i) => v - fitted[i]);
  const k = X[0].length, df = n - k;
  const sigma2 = residuals.reduce((s, e) => s + e * e, 0) / df;
  let V: Matrix;
  if (o.robust && o.robust !== "classical") {
    const meat: Matrix = Array.from({ length: k }, () => new Array<number>(k).fill(0));
    for (let i = 0; i < n; i++) for (let a = 0; a < k; a++) for (let b = 0; b < k; b++) meat[a][b] += residuals[i] ** 2 * Xhat[i][a] * Xhat[i][b];
    V = multiply(multiply(inv, meat), inv).map((r) => r.map((v) => v * (o.robust === "HC1" ? n / df : 1)));
  } else V = inv.map((r) => r.map((v) => v * sigma2));
  const se = V.map((r, i) => Math.sqrt(r[i]));
  const t = coef.map((c, i) => c / se[i]);
  const ym = mean(y);
  const sst = y.reduce((s, v) => s + (v - ym) ** 2, 0);
  const r2 = 1 - residuals.reduce((s, e) => s + e * e, 0) / sst;
  return { names: ["(Intercept)", ...names.endog, ...names.exog], coef, se, t, p: t.map((v) => tTwoSided(v, df)), n, k, df, r2, adjR2: 1 - (1 - r2) * (n - 1) / df, sigma: Math.sqrt(sigma2), robust: o.robust ?? "classical", residuals, fitted, firstStageF };
}

export interface SurveyMean { mean: number; se: number; n: number; sumWeights: number }

/** A design-based mean: Taylor linearisation over strata and
    primary sampling units, which is what LSMS's own design columns
    are for. With no strata or clusters it is the weighted mean with
    the usual linearised standard error. */
export function surveyMean(x: number[], weights: number[], design: { strata?: (string | number)[]; psu?: (string | number)[] } = {}): SurveyMean {
  const W = weights.reduce((a, b) => a + b, 0);
  const m = x.reduce((s, v, i) => s + v * weights[i], 0) / W;
  const z = x.map((v, i) => weights[i] * (v - m) / W);
  const strata = design.strata ?? x.map(() => 0);
  const psu = design.psu ?? x.map((_v, i) => i);
  const byStratum = new Map<string | number, Map<string | number, number>>();
  x.forEach((_v, i) => {
    const s = byStratum.get(strata[i]) ?? new Map<string | number, number>();
    s.set(psu[i], (s.get(psu[i]) ?? 0) + z[i]);
    byStratum.set(strata[i], s);
  });
  let v = 0;
  for (const s of byStratum.values()) {
    const totals = [...s.values()];
    const nh = totals.length;
    if (nh < 2) continue;
    const mh = mean(totals);
    v += (nh / (nh - 1)) * totals.reduce((a, t) => a + (t - mh) ** 2, 0);
  }
  return { mean: m, se: Math.sqrt(v), n: x.length, sumWeights: W };
}

/** A survey-weighted regression: weighted least squares with the
    errors clustered by primary sampling unit. */
export const surveyOls = (y: number[], X: Matrix, names: string[], weights: number[], psu?: (string | number)[]): Fit =>
  ols(y, X, names, { weights, robust: psu ? "cluster" : "HC1", cluster: psu });

/* ---------- finance ---------- */

export const returns = (prices: number[], log = false): number[] =>
  prices.slice(1).map((p, i) => (log ? Math.log(p / prices[i]) : p / prices[i] - 1));

export function capm(r: number[], rm: number[], rf: number[] | number = 0): Fit {
  const rfAt = (i: number): number => (typeof rf === "number" ? rf : rf[i]);
  return ols(r.map((v, i) => v - rfAt(i)), rm.map((v, i) => [v - rfAt(i)]), ["market"]);
}

export const sharpe = (r: number[], rf = 0, periods = 252): number => ((mean(r) - rf) / sd(r)) * Math.sqrt(periods);

export function sortino(r: number[], rf = 0, periods = 252): number {
  const downside = Math.sqrt(r.reduce((s, v) => s + Math.min(v - rf, 0) ** 2, 0) / r.length);
  return ((mean(r) - rf) / downside) * Math.sqrt(periods);
}

/** Excess returns on factor series: three, five or whatever the
    reader uploaded. */
export const factorRegression = (excess: number[], factors: Matrix, names: string[], robust: Robust = "HC1"): Fit => ols(excess, factors, names, { robust });

export interface FamaMacBeth { lambda: number[]; se: number[]; t: number[]; names: string[]; periods: number; betas: Matrix }

/** Two passes: a time-series beta per asset on the factors, then a
    cross-section per period of returns on those betas, and the
    average of the period estimates with the Fama-MacBeth standard
    error, which is the standard deviation of the estimates over
    root T. `R` is T by N, `F` is T by K. */
export function famaMacBeth(R: Matrix, F: Matrix, names: string[]): FamaMacBeth {
  const T = R.length, N = R[0].length;
  const betas: Matrix = [];
  for (let j = 0; j < N; j++) betas.push(ols(R.map((r) => r[j]), F, names).coef.slice(1));
  const lambdas: Matrix = [];
  for (let t = 0; t < T; t++) lambdas.push(ols(R[t], betas, names).coef);
  const cols = transpose(lambdas);
  const lambda = cols.map(mean);
  const se = cols.map((c) => (T > 1 ? sd(c) / Math.sqrt(T) : 0));
  return { lambda, se, t: lambda.map((l, i) => (se[i] ? l / se[i] : Infinity)), names: ["(Intercept)", ...names], periods: T, betas };
}

export interface Csad { csad: number[]; fit: Fit }

/** Chang, Cheng and Khorana's herding regression: the cross-
    sectional absolute deviation each period on the market return's
    absolute value and its square. A negative square says herding. */
export function csad(R: Matrix, rm: number[]): Csad {
  const series = R.map((row, t) => row.reduce((s, v) => s + Math.abs(v - rm[t]), 0) / row.length);
  const fit = ols(series, rm.map((v) => [Math.abs(v), v * v]), ["|Rm|", "Rm²"], { robust: "HC1" });
  return { csad: series, fit };
}

export interface EventStudyReturns { alpha: number; beta: number; ar: number[]; car: number; days: number[]; se: number; t: number }

/** A market-model event study: the model estimated over the
    estimation window, abnormal returns over the event window, and
    the cumulative abnormal return with a t against the estimation
    window's residual variance. */
export function eventStudyReturns(r: number[], rm: number[], event: number, estimation: [number, number], window: [number, number]): EventStudyReturns {
  const est = [] as number[], estM = [] as number[];
  for (let d = estimation[0]; d <= estimation[1]; d++) { const i = event + d; if (i >= 0 && i < r.length) { est.push(r[i]); estM.push(rm[i]); } }
  const fit = ols(est, estM.map((v) => [v]), ["market"]);
  const [alpha, beta] = fit.coef;
  const days: number[] = [], ar: number[] = [];
  for (let d = window[0]; d <= window[1]; d++) { const i = event + d; if (i >= 0 && i < r.length) { days.push(d); ar.push(r[i] - alpha - beta * rm[i]); } }
  const car = ar.reduce((a, b) => a + b, 0);
  const se = fit.sigma * Math.sqrt(ar.length);
  return { alpha, beta, ar, car, days, se, t: se ? car / se : 0 };
}

export const historicalVaR = (r: number[], level = 0.95): number => -quantile([...r].sort((a, b) => a - b), 1 - level);

export const expectedShortfall = (r: number[], level = 0.95): number => {
  const s = [...r].sort((a, b) => a - b);
  const cut = -historicalVaR(r, level);
  const tail = s.filter((v) => v <= cut);
  return tail.length ? -mean(tail) : NaN;
};

export interface Adf { statistic: number; lags: number; critical: { "1%": number; "5%": number; "10%": number }; stationary: boolean; trend: "n" | "c" | "ct" }

/** Augmented Dickey-Fuller: Δy on y lagged, the chosen
    deterministics and `lags` lagged differences; MacKinnon's
    asymptotic critical values. */
export function adf(y: number[], lags = 1, trend: "n" | "c" | "ct" = "c"): Adf {
  const dy = y.slice(1).map((v, i) => v - y[i]);
  const rows: Matrix = [], dep: number[] = [];
  for (let t = lags; t < dy.length; t++) {
    const row = [y[t]];
    if (trend === "ct") row.push(t);
    for (let l = 1; l <= lags; l++) row.push(dy[t - l]);
    rows.push(row);
    dep.push(dy[t]);
  }
  const fit = ols(dep, rows, ["level", ...(trend === "ct" ? ["trend"] : []), ...Array.from({ length: lags }, (_v, i) => `Δ${i + 1}`)], { intercept: trend !== "n" });
  const at = trend === "n" ? 0 : 1;
  const statistic = fit.t[at];
  const critical = trend === "ct" ? { "1%": -3.96, "5%": -3.41, "10%": -3.12 } : trend === "c" ? { "1%": -3.43, "5%": -2.86, "10%": -2.57 } : { "1%": -2.58, "5%": -1.95, "10%": -1.62 };
  return { statistic, lags, critical, stationary: statistic < critical["5%"], trend };
}

/* ---------- agriculture and climate ---------- */

/** Growing degree days from daily maxima and minima, above a base
    and capped where a crop stops responding. */
export const degreeDays = (tmax: number[], tmin: number[], base = 10, cap = 30): number[] =>
  tmax.map((hi, i) => Math.max(0, Math.min((hi + tmin[i]) / 2, cap) - base));

export interface Shock { anomaly: number[]; z: number[]; mean: number; sd: number }

/** A rainfall shock as the standardised anomaly of each season
    against the series, the shape a regression takes it in. */
export function rainfallShock(seasons: number[]): Shock {
  const m = mean(seasons), s = sd(seasons);
  return { anomaly: seasons.map((v) => v - m), z: seasons.map((v) => (s ? (v - m) / s : 0)), mean: m, sd: s };
}

export interface IndexInsurance {
  payouts: number[];
  expectedPayout: number;
  fairPremium: number;
  loadedPremium: number;
  basisCorrelation: number | null;
  missedLosses: number;
  falsePayouts: number;
}

/** A weather index contract: a linear payout between a trigger and
    an exit, the fair premium as the expected payout, a loaded
    premium, and basis risk against a loss series where one is
    known: the correlation, the seasons with a loss and no payout,
    and the seasons paid with no loss. */
export function indexInsurance(index: number[], contract: { trigger: number; exit: number; maxPayout: number; loading?: number }, losses?: number[]): IndexInsurance {
  const { trigger, exit, maxPayout } = contract;
  const payouts = index.map((v) => (v >= trigger ? 0 : v <= exit ? maxPayout : maxPayout * (trigger - v) / (trigger - exit)));
  const expectedPayout = mean(payouts);
  const loaded = expectedPayout * (contract.loading ?? 1.25);
  let basisCorrelation: number | null = null, missedLosses = 0, falsePayouts = 0;
  if (losses) {
    basisCorrelation = sd(payouts) && sd(losses) ? correlation([payouts, losses])[0][1] : null;
    losses.forEach((l, i) => { if (l > 0 && payouts[i] === 0) missedLosses += 1; if (l === 0 && payouts[i] > 0) falsePayouts += 1; });
  }
  return { payouts, expectedPayout, fairPremium: expectedPayout, loadedPremium: loaded, basisCorrelation, missedLosses, falsePayouts };
}

export interface MeanVariance { name: string; mean: number; sd: number; cv: number; min: number }

export const meanVariance = (options: { name: string; outcomes: number[] }[]): MeanVariance[] =>
  options.map((o) => ({ name: o.name, mean: mean(o.outcomes), sd: sd(o.outcomes), cv: sd(o.outcomes) / mean(o.outcomes), min: Math.min(...o.outcomes) }));

export interface Dominance { first: boolean; second: boolean }

/** Whether `a` dominates `b`: first order if a's CDF is never above
    b's, second order if the integrated CDF is never above. */
export function stochasticDominance(a: number[], b: number[]): Dominance {
  const grid = [...new Set([...a, ...b])].sort((x, y) => x - y);
  const cdf = (xs: number[], v: number): number => xs.filter((x) => x <= v).length / xs.length;
  let first = true, second = true, ia = 0, ib = 0;
  for (let i = 0; i < grid.length; i++) {
    const fa = cdf(a, grid[i]), fb = cdf(b, grid[i]);
    if (fa > fb + 1e-12) first = false;
    if (i < grid.length - 1) {
      const w = grid[i + 1] - grid[i];
      ia += fa * w; ib += fb * w;
      if (ia > ib + 1e-12) second = false;
    }
  }
  return { first, second: first || second };
}
