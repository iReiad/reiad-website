/* scorecard.model.js: the probability-of-default pipeline. No
   DOM, data in and fitted models and metrics out, checked by
   `scorecard.test.ts`. Nothing is precomputed: the split, the
   encoding, both models, the cross-validation and every metric
   are fitted live in the browser, which is why the seed is a
   slider.

   THE PIPELINE ORDER IS LOAD-BEARING. Split FIRST; the bin
   edges, the standardisation constants, the weight-of-evidence
   tables and the calibration are all learned on the training
   rows only and applied to the test rows. Fit any of them on all
   the data and the test AUC comes out higher than the model
   deserves, silently. */

import { ROWS, SCHEMA, SOURCE, CHECKS } from "./scorecard.data.js";

export { ROWS, SCHEMA, SOURCE, CHECKS };

/* ------------------------------------------------------------
   1 · Small numerical helpers

   normCdf is written out here rather than imported from the
   stress-testing engine next door, which has its own copy: that
   module ships a loan book with it, and this one needs one
   function. Both copies are checked against the same published
   quantiles in their own test files.
   ------------------------------------------------------------ */

/** Φ(x), through the complementary error function. */
export function normCdf(x) {
  return 0.5 * erfc(-x / Math.SQRT2);
}

function erfc(x) {
  const z = Math.abs(x);
  const t = 2 / (2 + z);
  const y = 4 * t - 2;
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

/** Two-sided p-value for a standard normal statistic. */
export const twoSided = (z) => 2 * (1 - normCdf(Math.abs(z)));

export const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const mean = (xs) => (xs.length ? sum(xs) / xs.length : NaN);

/**
 * A seeded generator, so that every visitor sees the same split
 * and every test run sees the same numbers. mulberry32: small,
 * fast, and good enough for shuffling rows, which is the only
 * thing randomness is used for here.
 */
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Fisher-Yates, in place, with a supplied generator. */
export function shuffle(xs, rand) {
  for (let i = xs.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [xs[i], xs[j]] = [xs[j], xs[i]];
  }
  return xs;
}

/* 2 · Features. Every categorical level becomes a binary column
   except the levels that never occur, which are a parameter with
   no evidence behind them. The logistic model ALSO drops one
   level per attribute as its reference: with every level present
   the dummies sum to one, which is the intercept, and the design
   matrix is singular. Trees are given the full set. */

export const TARGET = SCHEMA.length;

export function buildFeatures(schema = SCHEMA, rows = ROWS) {
  const features = [];
  schema.forEach((col, j) => {
    if (col.type === "num") {
      features.push({
        key: col.key, name: col.name, short: col.short, unit: col.unit,
        kind: "num", column: j, protectedAttr: !!col.protected,
      });
      return;
    }
    const counts = col.levels.map((_, k) => rows.reduce((t, r) => t + (r[j] === k ? 1 : 0), 0));
    /* The reference level is the most common one, which is the
       convention that makes a scorecard readable: every other
       level is quoted against the typical applicant rather than
       against whatever happened to be listed first. */
    const reference = counts.indexOf(Math.max(...counts));
    col.levels.forEach(([code, label], k) => {
      if (counts[k] === 0) return;
      features.push({
        key: `${col.key}=${code}`,
        name: `${col.name}: ${label}`,
        short: `${col.short}: ${label}`,
        kind: "dummy", column: j, level: k, code, label,
        attribute: col.key, attributeName: col.name, attributeShort: col.short,
        isReference: k === reference,
        protectedAttr: !!col.protected,
        n: counts[k],
      });
    });
  });
  return features;
}

export const FEATURES = buildFeatures();

/** The raw value of one feature for one row. */
export const featureValue = (f, row) =>
  f.kind === "num" ? row[f.column] : (row[f.column] === f.level ? 1 : 0);

/** A dense matrix of every feature, in FEATURES order. */
export function designMatrix(rows, features = FEATURES) {
  return rows.map((r) => features.map((f) => featureValue(f, r)));
}

export const labels = (rows) => rows.map((r) => r[TARGET]);

/* ------------------------------------------------------------
   3 · Splitting

   Stratified, so the 30% default rate is the same in both
   halves. On a sample this small an unstratified split can hand
   the test set five percentage points more defaults than the
   training set, which moves every metric on the page.
   ------------------------------------------------------------ */
export function stratifiedSplit(rows, { testFraction = 0.3, seed = 7 } = {}) {
  const rand = rng(seed);
  const byClass = [[], []];
  rows.forEach((r, i) => byClass[r[TARGET]].push(i));
  const train = [];
  const test = [];
  byClass.forEach((idx) => {
    const shuffled = shuffle([...idx], rand);
    const cut = Math.round(shuffled.length * testFraction);
    test.push(...shuffled.slice(0, cut));
    train.push(...shuffled.slice(cut));
  });
  train.sort((a, b) => a - b);
  test.sort((a, b) => a - b);
  return { train: train.map((i) => rows[i]), test: test.map((i) => rows[i]), trainIdx: train, testIdx: test };
}

/** k stratified folds of the supplied rows. */
export function stratifiedFolds(rows, { k = 5, seed = 7 } = {}) {
  const rand = rng(seed);
  const folds = Array.from({ length: k }, () => []);
  [0, 1].forEach((cls) => {
    const idx = shuffle(rows.map((r, i) => [r, i]).filter(([r]) => r[TARGET] === cls).map(([, i]) => i), rand);
    idx.forEach((i, n) => folds[n % k].push(i));
  });
  return folds.map((f) => f.sort((a, b) => a - b).map((i) => rows[i]));
}

/* ------------------------------------------------------------
   4 · Standardisation, learned on the training rows only
   ------------------------------------------------------------ */
export function fitScaler(X) {
  const n = X.length;
  const p = X[0]?.length ?? 0;
  const mu = Array(p).fill(0);
  const sd = Array(p).fill(1);
  for (let j = 0; j < p; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += X[i][j];
    mu[j] = s / n;
    let v = 0;
    for (let i = 0; i < n; i++) v += (X[i][j] - mu[j]) ** 2;
    sd[j] = Math.sqrt(v / Math.max(1, n - 1)) || 1;
  }
  return { mu, sd };
}

export const applyScaler = (X, { mu, sd }) =>
  X.map((row) => row.map((v, j) => (v - mu[j]) / sd[j]));

/* 5 · Weight of evidence and information value.

       WOE = ln( share of goods / share of bads )
       IV  = Σ (share of goods − share of bads) · WOE

   Both are computed on the TRAINING rows only: an information
   value computed on everything is the leak that decides which
   attributes go into the model. */

/** Quantile cut points for a numeric column, from the training rows. */
export function binEdges(values, bins = 5) {
  const sorted = [...values].sort((a, b) => a - b);
  const edges = [];
  for (let i = 1; i < bins; i++) {
    const q = sorted[Math.floor((i / bins) * sorted.length)];
    if (edges[edges.length - 1] !== q) edges.push(q);
  }
  return edges;
}

export const binOf = (v, edges) => {
  let i = 0;
  while (i < edges.length && v >= edges[i]) i++;
  return i;
};

/**
 * Weight of evidence per group of one attribute, plus its
 * information value. The 0.5 is the Haldane-Anscombe correction:
 * without it one empty cell takes the information value to
 * infinity.
 */
export function woeTable(groups, { correction = 0.5 } = {}) {
  const totalBad = sum(groups.map((g) => g.filter((r) => r[TARGET] === 1).length));
  const totalGood = sum(groups.map((g) => g.filter((r) => r[TARGET] === 0).length));
  let iv = 0;
  const table = groups.map((g) => {
    const bad = g.filter((r) => r[TARGET] === 1).length;
    const good = g.length - bad;
    const pGood = (good + correction) / (totalGood + correction * groups.length);
    const pBad = (bad + correction) / (totalBad + correction * groups.length);
    const woe = Math.log(pGood / pBad);
    const contribution = (pGood - pBad) * woe;
    iv += contribution;
    return { n: g.length, good, bad, badRate: g.length ? bad / g.length : NaN, pGood, pBad, woe, contribution };
  });
  return { table, iv };
}

/** Information value of every attribute, numerics binned by quantile. */
export function informationValues(trainRows, { bins = 5, schema = SCHEMA } = {}) {
  return schema.map((col, j) => {
    let groups;
    let labelsOut;
    if (col.type === "num") {
      const edges = binEdges(trainRows.map((r) => r[j]), bins);
      groups = Array.from({ length: edges.length + 1 }, () => []);
      trainRows.forEach((r) => groups[binOf(r[j], edges)].push(r));
      labelsOut = groups.map((_, i) =>
        i === 0 ? `under ${edges[0]}`
          : i === edges.length ? `${edges[edges.length - 1]} and over`
            : `${edges[i - 1]} to ${edges[i]}`);
    } else {
      groups = col.levels.map(() => []);
      trainRows.forEach((r) => groups[r[j]].push(r));
      const keep = groups.map((g, i) => [g, i]).filter(([g]) => g.length > 0);
      labelsOut = keep.map(([, i]) => col.levels[i][1]);
      groups = keep.map(([g]) => g);
    }
    const { table, iv } = woeTable(groups);
    return {
      key: col.key, name: col.name, short: col.short, type: col.type,
      protectedAttr: !!col.protected,
      iv, bands: table.map((t, i) => ({ ...t, label: labelsOut[i] })),
    };
  }).sort((a, b) => b.iv - a.iv);
}

/** The industry's reading of an information value. */
export const ivBand = (iv) =>
  iv < 0.02 ? "no use" : iv < 0.1 ? "weak" : iv < 0.3 ? "medium" : iv < 0.5 ? "strong" : "suspiciously strong";

/* 6 · Logistic regression by IRLS: Newton's method on the
   penalised log-likelihood, each step solving
   (XᵀWX + 2λI) β = XᵀW z by Gaussian elimination with partial
   pivoting.
   THE RIDGE PENALTY IS NOT DECORATION: under complete separation
   the unpenalised likelihood is maximised by sending a
   coefficient to infinity, and the fit does not fail, it returns
   a meaningless number with an enormous standard error. */

/** Solve A x = b by Gaussian elimination with partial pivoting. */
export function solve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) continue;
    [M[col], M[pivot]] = [M[pivot], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      if (!f) continue;
      for (let c = col; c <= n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row, i) => (Math.abs(row[i]) < 1e-12 ? 0 : row[n] / row[i]));
}

/** Invert a symmetric positive definite matrix, for the standard errors. */
export function invert(A) {
  const n = A.length;
  const M = A.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let pivot = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[pivot][col])) pivot = r;
    }
    if (Math.abs(M[pivot][col]) < 1e-12) continue;
    [M[col], M[pivot]] = [M[pivot], M[col]];
    const d = M[col][col];
    for (let c = 0; c < 2 * n; c++) M[col][c] /= d;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const f = M[r][col];
      if (!f) continue;
      for (let c = 0; c < 2 * n; c++) M[r][c] -= f * M[col][c];
    }
  }
  return M.map((row) => row.slice(n));
}

/**
 * @param {number[][]} X  rows of features, WITHOUT an intercept column
 * @param {number[]}   y  0 or 1
 */
export function fitLogistic(X, y, { ridge = 1, maxIter = 40, tol = 1e-9 } = {}) {
  const n = X.length;
  const p = (X[0]?.length ?? 0) + 1;
  const design = X.map((row) => [1, ...row]);
  let beta = Array(p).fill(0);
  /* The intercept starts at the sample log odds, which is where
     it would land anyway, and saves an iteration or two. */
  const base = mean(y);
  beta[0] = Math.log(clamp(base, 1e-6, 1 - 1e-6) / (1 - clamp(base, 1e-6, 1 - 1e-6)));

  let iterations = 0;
  let converged = false;
  let logLik = -Infinity;
  let hessian = null;

  for (let it = 0; it < maxIter; it++) {
    iterations = it + 1;
    const eta = design.map((row) => row.reduce((s, v, j) => s + v * beta[j], 0));
    const mu = eta.map(sigmoid);
    const w = mu.map((m) => Math.max(m * (1 - m), 1e-9));

    // XᵀWX + 2λI, and Xᵀ(y − μ) − 2λβ
    const H = Array.from({ length: p }, () => Array(p).fill(0));
    const g = Array(p).fill(0);
    for (let i = 0; i < n; i++) {
      const row = design[i];
      const wi = w[i];
      const ri = y[i] - mu[i];
      for (let a = 0; a < p; a++) {
        g[a] += row[a] * ri;
        const wr = wi * row[a];
        for (let b = a; b < p; b++) H[a][b] += wr * row[b];
      }
    }
    for (let a = 0; a < p; a++) {
      for (let b = 0; b < a; b++) H[a][b] = H[b][a];
    }
    /* The intercept is not penalised. Shrinking it towards zero
       would be shrinking the portfolio's own default rate
       towards a coin flip, which is not what a ridge is for. */
    for (let a = 1; a < p; a++) { H[a][a] += 2 * ridge; g[a] -= 2 * ridge * beta[a]; }

    const step = solve(H, g);
    let moved = 0;
    for (let a = 0; a < p; a++) { beta[a] += step[a]; moved = Math.max(moved, Math.abs(step[a])); }
    hessian = H;

    const ll = sum(design.map((row, i) => {
      const e = row.reduce((s, v, j) => s + v * beta[j], 0);
      return y[i] * e - Math.log(1 + Math.exp(e));
    }));
    logLik = ll;
    if (moved < tol) { converged = true; break; }
  }

  const cov = invert(hessian);
  const se = beta.map((_, j) => Math.sqrt(Math.max(0, cov[j][j])));
  const z = beta.map((b, j) => (se[j] > 0 ? b / se[j] : NaN));

  return {
    beta,
    intercept: beta[0],
    coefficients: beta.slice(1),
    se, z,
    p: z.map(twoSided),
    logLik, iterations, converged, ridge,
    aic: 2 * p - 2 * logLik,
    predict: (Xnew) => Xnew.map((row) =>
      sigmoid(beta[0] + row.reduce((s, v, j) => s + v * beta[j + 1], 0))),
  };
}

/* 7 · Gradient boosting: second-order boosting on the logistic
   loss over pre-binned features. The exact minimiser over a leaf
   is −G/(H+λ) with value −½G²/(H+λ), and subtracting the
   parent's from the children's gives the split gain below. */

/** Pre-bin every column, on the training rows, exactly once. */
export function fitBinner(X, maxBins = 32) {
  const p = X[0]?.length ?? 0;
  const edges = [];
  for (let j = 0; j < p; j++) {
    const vals = X.map((r) => r[j]);
    const distinct = [...new Set(vals)].sort((a, b) => a - b);
    if (distinct.length <= maxBins) {
      // one bin per value: exact splits, which is what a dummy needs
      edges.push(distinct.slice(1).map((v, i) => (v + distinct[i]) / 2));
    } else {
      edges.push(binEdges(vals, maxBins));
    }
  }
  return edges;
}

export const applyBinner = (X, edges) =>
  X.map((row) => row.map((v, j) => binOf(v, edges[j])));

/**
 * One regression tree on the gradients and hessians, grown
 * depth-wise.
 *
 * FLAT TYPED ARRAYS rather than arrays of objects: this is the
 * only hot loop on the page, refitted on every slider move and
 * five times over for the cross-validation, and the readable
 * version with map and filter inside was forty times slower.
 */
function growTree(binned, nBinsPer, n, p, grad, hess, rowIdx, {
  maxDepth, minChildWeight, lambda, gamma, colsample, rand,
}) {
  const nodes = [];
  const maxBins = Math.max(...nBinsPer, 1);
  const histG = new Float64Array(maxBins);
  const histH = new Float64Array(maxBins);

  const build = (rows, depth) => {
    let G = 0;
    let H = 0;
    for (let k = 0; k < rows.length; k++) { G += grad[rows[k]]; H += hess[rows[k]]; }

    const self = nodes.length;
    nodes.push({ leaf: true, value: -G / (H + lambda), n: rows.length, G, H });

    if (depth >= maxDepth || rows.length < 2 || H <= minChildWeight) return self;

    const parentScore = (G * G) / (H + lambda);
    let bestGain = 0;
    let bestFeature = -1;
    let bestBin = -1;

    for (let j = 0; j < p; j++) {
      const nBins = nBinsPer[j];
      if (nBins < 2) continue;
      if (colsample < 1 && rand() >= colsample) continue;

      histG.fill(0, 0, nBins);
      histH.fill(0, 0, nBins);
      /* binned is column-major, so this walks one contiguous run
         of memory per feature. Row-major looked more natural and
         was three times slower: every read jumped sixty columns. */
      const base = j * n;
      for (let k = 0; k < rows.length; k++) {
        const i = rows[k];
        const b = binned[base + i];
        histG[b] += grad[i];
        histH[b] += hess[i];
      }

      let gl = 0;
      let hl = 0;
      for (let b = 0; b < nBins - 1; b++) {
        gl += histG[b];
        hl += histH[b];
        const gr = G - gl;
        const hr = H - hl;
        if (hl <= minChildWeight || hr <= minChildWeight) continue;
        const gain = 0.5 * ((gl * gl) / (hl + lambda) + (gr * gr) / (hr + lambda) - parentScore) - gamma;
        if (gain > bestGain) { bestGain = gain; bestFeature = j; bestBin = b; }
      }
    }

    if (bestFeature < 0) return self;

    const left = [];
    const right = [];
    for (let k = 0; k < rows.length; k++) {
      const i = rows[k];
      if (binned[bestFeature * n + i] <= bestBin) left.push(i); else right.push(i);
    }
    if (!left.length || !right.length) return self;

    const node = nodes[self];
    node.leaf = false;
    node.feature = bestFeature;
    node.bin = bestBin;
    node.gain = bestGain;
    node.left = build(left, depth + 1);
    node.right = build(right, depth + 1);
    return self;
  };

  return { nodes, root: build(rowIdx, 0) };
}

const treePredictOne = (tree, binned, row, n) => {
  let i = tree.root;
  while (!tree.nodes[i].leaf) {
    const node = tree.nodes[i];
    i = binned[node.feature * n + row] <= node.bin ? node.left : node.right;
  }
  return tree.nodes[i].value;
};

export const GBM_DEFAULTS = {
  nTrees: 120,
  learningRate: 0.08,
  maxDepth: 3,
  minChildWeight: 1,
  lambda: 1,
  gamma: 0,
  subsample: 0.9,
  colsample: 0.8,
  maxBins: 32,
  seed: 7,
};

/**
 * @param {number[][]} X training features
 * @param {number[]}   y 0/1
 * @param {object} opts  GBM_DEFAULTS shape
 * @param {object} watch optional {X, y} to score each iteration,
 *        which draws the learning curve. It MUST be a validation
 *        slice of the TRAINING data: scoring the test set every
 *        iteration and choosing the tree count from it is how a
 *        test set stops being one.
 */
export function fitGbm(X, y, opts = {}, watch = null) {
  const o = { ...GBM_DEFAULTS, ...opts };
  const rand = rng(o.seed);
  const n = X.length;
  const p = X[0]?.length ?? 0;

  const edges = fitBinner(X, o.maxBins);
  const nBinsPer = edges.map((e) => e.length + 1);
  const flatten = (rows) => {
    const out = new Int32Array(rows.length * p);
    for (let j = 0; j < p; j++) {
      const base = j * rows.length;
      const e = edges[j];
      for (let i = 0; i < rows.length; i++) out[base + i] = binOf(rows[i][j], e);
    }
    return out;
  };
  const binned = flatten(X);
  const watchBinned = watch ? flatten(watch.X) : null;

  const base = clamp(mean(y), 1e-6, 1 - 1e-6);
  const base0 = Math.log(base / (1 - base));

  const f = new Float64Array(n).fill(base0);
  const fWatch = watch ? new Float64Array(watch.X.length).fill(base0) : null;
  /* The gradient of the logistic loss with respect to the log
     odds is p − y, and the hessian is p(1 − p). The sign matters
     more than it looks: with y − p here instead, every leaf
     value comes out backwards and the ensemble climbs the loss
     it is supposed to be descending. It does not error, it just
     returns a model with no skill, which is how it survived the
     first draft of this file. */
  const grad = new Float64Array(n);
  const hess = new Float64Array(n);

  const trees = [];
  const history = [];
  const gains = new Float64Array(p);
  const allRows = Array.from({ length: n }, (_, i) => i);

  for (let t = 0; t < o.nTrees; t++) {
    for (let i = 0; i < n; i++) {
      const pi = sigmoid(f[i]);
      grad[i] = pi - y[i];
      hess[i] = Math.max(pi * (1 - pi), 1e-6);
    }

    let rows = allRows;
    if (o.subsample < 1) {
      rows = allRows.filter(() => rand() < o.subsample);
      if (!rows.length) rows = allRows;
    }

    const tree = growTree(binned, nBinsPer, n, p, grad, hess, rows, {
      maxDepth: o.maxDepth, minChildWeight: o.minChildWeight,
      lambda: o.lambda, gamma: o.gamma, colsample: o.colsample, rand,
    });
    tree.nodes.forEach((node) => { if (!node.leaf) gains[node.feature] += node.gain; });
    trees.push(tree);

    for (let i = 0; i < n; i++) f[i] += o.learningRate * treePredictOne(tree, binned, i, n);
    /* The learning curve costs a pass over both sets per tree, so
       it is only kept when something is watching. The model that
       ships is refitted without it. */
    if (watch) {
      const nw = watch.X.length;
      for (let i = 0; i < nw; i++) {
        fWatch[i] += o.learningRate * treePredictOne(tree, watchBinned, i, nw);
      }
      history.push({
        tree: t + 1,
        train: logLoss(y, [...f].map(sigmoid)),
        watch: logLoss(watch.y, [...fWatch].map(sigmoid)),
      });
    }
  }

  const raw = (Xnew, upTo = trees.length) => {
    const b = flatten(Xnew);
    const out = new Array(Xnew.length);
    for (let i = 0; i < Xnew.length; i++) {
      let s = base0;
      for (let t = 0; t < upTo; t++) s += o.learningRate * treePredictOne(trees[t], b, i, Xnew.length);
      out[i] = s;
    }
    return out;
  };

  const bestByWatch = watch && history.length
    ? history.reduce((best, h) => (h.watch < best.watch ? h : best), history[0])
    : null;

  return {
    trees, edges, base0, options: o, history,
    gains: [...gains],
    bestIteration: bestByWatch ? bestByWatch.tree : o.nTrees,
    raw,
    predict: (Xnew) => raw(Xnew).map(sigmoid),
    /* Exact per-feature attribution for one prediction: walk each
       tree and give every split the change in node value it
       caused. For an additive ensemble this approximates nothing,
       the parts sum to the prediction, which the test file
       checks. */
    explain: (row) => {
      const b = flatten([row]);
      const out = Array(p).fill(0);
      /* The base is not just the ensemble's starting log odds. It
         is that plus what every tree says before it has asked any
         question, which is the value at its root. Leaving those
         out was the first version of this, and the contributions
         then failed to add up to the prediction by exactly the
         sum of the root values, which is the kind of error that
         is invisible in a chart and obvious in a test. */
      let base = base0;
      for (const tree of trees) {
        let i = tree.root;
        base += o.learningRate * tree.nodes[i].value;
        while (!tree.nodes[i].leaf) {
          const node = tree.nodes[i];
          const next = b[node.feature] <= node.bin ? node.left : node.right;
          out[node.feature] += o.learningRate * (tree.nodes[next].value - node.value);
          i = next;
        }
      }
      return { base, contributions: out };
    },
  };
}

/* ------------------------------------------------------------
   8 · Metrics
   ------------------------------------------------------------ */

export const logLoss = (y, p) =>
  -mean(y.map((yi, i) => {
    const pi = clamp(p[i], 1e-12, 1 - 1e-12);
    return yi * Math.log(pi) + (1 - yi) * Math.log(1 - pi);
  }));

export const brier = (y, p) => mean(y.map((yi, i) => (p[i] - yi) ** 2));

/**
 * The ROC curve and the area under it, computed TWO ways on
 * purpose: the trapezoid rule is drawn, the Mann-Whitney
 * statistic is reported, and the test file checks they agree,
 * which is a real check on the curve.
 */
export function roc(y, score) {
  const pairs = y.map((yi, i) => ({ y: yi, s: score[i] })).sort((a, b) => b.s - a.s);
  const nPos = y.reduce((t, v) => t + v, 0);
  const nNeg = y.length - nPos;
  const points = [{ fpr: 0, tpr: 0, threshold: Infinity }];
  let tp = 0;
  let fp = 0;
  for (let i = 0; i < pairs.length; i++) {
    tp += pairs[i].y;
    fp += 1 - pairs[i].y;
    // only emit a point where the score actually changes, or the
    // curve gains a vertex per tied observation
    if (i + 1 < pairs.length && pairs[i + 1].s === pairs[i].s) continue;
    points.push({ fpr: nNeg ? fp / nNeg : 0, tpr: nPos ? tp / nPos : 0, threshold: pairs[i].s });
  }
  let area = 0;
  for (let i = 1; i < points.length; i++) {
    area += (points[i].fpr - points[i - 1].fpr) * (points[i].tpr + points[i - 1].tpr) / 2;
  }
  return { points, auc: area, nPos, nNeg, ks: Math.max(...points.map((p) => p.tpr - p.fpr)) };
}

/** AUC as the Mann-Whitney U statistic, ties counted as half. */
export function aucMannWhitney(y, score) {
  const pos = score.filter((_, i) => y[i] === 1);
  const neg = score.filter((_, i) => y[i] === 0);
  if (!pos.length || !neg.length) return NaN;
  let u = 0;
  for (const a of pos) for (const b of neg) u += a > b ? 1 : a === b ? 0.5 : 0;
  return u / (pos.length * neg.length);
}

/** Precision-recall curve and average precision. */
export function precisionRecall(y, score) {
  const pairs = y.map((yi, i) => ({ y: yi, s: score[i] })).sort((a, b) => b.s - a.s);
  const nPos = y.reduce((t, v) => t + v, 0);
  const points = [];
  let tp = 0;
  let fp = 0;
  let ap = 0;
  let prevRecall = 0;
  pairs.forEach((pt) => {
    tp += pt.y;
    fp += 1 - pt.y;
    const recall = nPos ? tp / nPos : 0;
    const precision = tp + fp ? tp / (tp + fp) : 1;
    ap += (recall - prevRecall) * precision;
    prevRecall = recall;
    points.push({ recall, precision });
  });
  return { points, averagePrecision: ap, baseline: nPos / y.length };
}

/**
 * Hanley and McNeil (1982), the standard error of an AUC from a
 * single sample. Published, and the reason the page can say
 * whether a difference between two models means anything.
 */
export function aucStandardError(auc, nPos, nNeg) {
  const q1 = auc / (2 - auc);
  const q2 = (2 * auc * auc) / (1 + auc);
  const v = (auc * (1 - auc) + (nPos - 1) * (q1 - auc * auc) + (nNeg - 1) * (q2 - auc * auc))
    / (nPos * nNeg);
  return Math.sqrt(Math.max(0, v));
}

/**
 * DeLong's test for two AUCs measured on the SAME applicants.
 * Two models scored on one test set are not independent
 * measurements, so comparing them with independent standard
 * errors finds nothing significant, ever. Implemented over all
 * (bad, good) pairs rather than through the rank shortcut,
 * because at this size the direct form is checkable.
 */
export function delong(y, scoreA, scoreB) {
  const posIdx = y.map((v, i) => [v, i]).filter(([v]) => v === 1).map(([, i]) => i);
  const negIdx = y.map((v, i) => [v, i]).filter(([v]) => v === 0).map(([, i]) => i);
  const m = posIdx.length;
  const n = negIdx.length;
  if (!m || !n) return { difference: NaN, z: NaN, p: NaN };

  const psi = (a, b) => (a > b ? 1 : a === b ? 0.5 : 0);
  const components = (score) => {
    const v10 = posIdx.map((i) => mean(negIdx.map((j) => psi(score[i], score[j]))));
    const v01 = negIdx.map((j) => mean(posIdx.map((i) => psi(score[i], score[j]))));
    return { v10, v01, auc: mean(v10) };
  };

  const A = components(scoreA);
  const B = components(scoreB);
  const cov = (x, y2) => {
    const mx = mean(x);
    const my = mean(y2);
    return sum(x.map((v, i) => (v - mx) * (y2[i] - my))) / Math.max(1, x.length - 1);
  };

  const s10 = [[cov(A.v10, A.v10), cov(A.v10, B.v10)], [cov(B.v10, A.v10), cov(B.v10, B.v10)]];
  const s01 = [[cov(A.v01, A.v01), cov(A.v01, B.v01)], [cov(B.v01, A.v01), cov(B.v01, B.v01)]];
  const s = [[s10[0][0] / m + s01[0][0] / n, s10[0][1] / m + s01[0][1] / n],
    [s10[1][0] / m + s01[1][0] / n, s10[1][1] / m + s01[1][1] / n]];

  const variance = s[0][0] + s[1][1] - 2 * s[0][1];
  const difference = A.auc - B.auc;
  const z = variance > 0 ? difference / Math.sqrt(variance) : 0;
  const half = 1.959963985 * Math.sqrt(Math.max(0, variance));
  return {
    aucA: A.auc, aucB: B.auc, difference,
    se: Math.sqrt(Math.max(0, variance)),
    z, p: variance > 0 ? twoSided(z) : 1,
    ci: [difference - half, difference + half],
    correlation: Math.sqrt(s[0][0] * s[1][1]) > 0
      ? s[0][1] / Math.sqrt(s[0][0] * s[1][1]) : NaN,
  };
}

/** The confusion matrix at a cut-off, and what it costs. */
export function confusion(y, p, threshold, cost = SOURCE.costMatrix) {
  let tp = 0;
  let fp = 0;
  let tn = 0;
  let fn = 0;
  y.forEach((yi, i) => {
    const flagged = p[i] >= threshold;   // flagged as likely to default
    if (yi === 1 && flagged) tp++;
    else if (yi === 1) fn++;
    else if (flagged) fp++;
    else tn++;
  });
  const n = y.length;
  return {
    tp, fp, tn, fn, threshold,
    accuracy: (tp + tn) / n,
    precision: tp + fp ? tp / (tp + fp) : NaN,
    recall: tp + fn ? tp / (tp + fn) : NaN,
    specificity: tn + fp ? tn / (tn + fp) : NaN,
    approvalRate: (tn + fn) / n,
    /* fn is a bad loan that was approved, which the dataset
       prices at five; fp is a good applicant turned away, priced
       at one. */
    cost: fn * cost.falseGood + fp * cost.falseBad,
    costPerApplicant: (fn * cost.falseGood + fp * cost.falseBad) / n,
  };
}

/** Expected cost across every cut-off, and the one that minimises it. */
export function costCurve(y, p, cost = SOURCE.costMatrix, steps = 101) {
  const points = Array.from({ length: steps }, (_, i) => {
    const t = i / (steps - 1);
    const c = confusion(y, p, t, cost);
    return { threshold: t, cost: c.cost, costPerApplicant: c.costPerApplicant, approvalRate: c.approvalRate };
  });
  const best = points.reduce((b, x) => (x.cost < b.cost ? x : b), points[0]);
  return { points, best };
}

/**
 * Calibration in equal-count buckets, plus the Murphy
 * decomposition of the Brier score:
 *
 *     Brier = reliability − resolution + uncertainty
 *
 * Reliability is how far the buckets sit from the diagonal, and
 * it is the only one of the three a recalibration can change.
 * The identity holds exactly, which the test file checks.
 */
export function calibration(y, p, buckets = 10) {
  const order = p.map((v, i) => i).sort((a, b) => p[a] - p[b]);
  const size = Math.floor(order.length / buckets);
  const bins = [];
  for (let b = 0; b < buckets; b++) {
    const from = b * size;
    const to = b === buckets - 1 ? order.length : (b + 1) * size;
    const idx = order.slice(from, to);
    if (!idx.length) continue;
    bins.push({
      n: idx.length,
      predicted: mean(idx.map((i) => p[i])),
      observed: mean(idx.map((i) => y[i])),
      lo: p[idx[0]], hi: p[idx[idx.length - 1]],
    });
  }
  const base = mean(y);
  const n = y.length;
  const reliability = sum(bins.map((b) => (b.n / n) * (b.predicted - b.observed) ** 2));
  const resolution = sum(bins.map((b) => (b.n / n) * (b.observed - base) ** 2));
  const uncertainty = base * (1 - base);
  return {
    bins, reliability, resolution, uncertainty,
    brier: brier(y, p),
    decomposed: reliability - resolution + uncertainty,
  };
}

/**
 * Platt scaling: a one-variable logistic regression of the
 * outcome on the model's own log odds, fitted on held-out rows.
 *
 * It cannot change the ranking, so AUC, Gini and KS are
 * untouched by construction. What it changes is whether the
 * number the model prints is a probability, which is the whole
 * difference between a classifier and a PD model.
 */
export function fitPlatt(scoresRaw, y) {
  const fit = fitLogistic(scoresRaw.map((s) => [s]), y, { ridge: 1e-6 });
  return {
    a: fit.beta[1], b: fit.beta[0],
    apply: (raw) => raw.map((s) => sigmoid(fit.beta[0] + fit.beta[1] * s)),
  };
}

/** The lift table: applicants sorted worst first, cut into bands. */
export function liftTable(y, p, bands = 10) {
  const order = p.map((v, i) => i).sort((a, b) => p[b] - p[a]);
  const size = Math.floor(order.length / bands);
  const totalBad = sum(y);
  let cumBad = 0;
  let cumN = 0;
  const base = totalBad / y.length;
  return Array.from({ length: bands }, (_, b) => {
    const from = b * size;
    const to = b === bands - 1 ? order.length : (b + 1) * size;
    const idx = order.slice(from, to);
    const bad = sum(idx.map((i) => y[i]));
    cumBad += bad;
    cumN += idx.length;
    return {
      band: b + 1, n: idx.length, bad,
      badRate: bad / idx.length,
      lift: bad / idx.length / base,
      cumulativeBadShare: cumBad / totalBad,
      cumulativeShare: cumN / y.length,
    };
  });
}

/* 9 · Scorecard points, on a scale where the odds double every
   PDO points:

       factor = PDO / ln 2
       offset = target − factor · ln(target odds)
       score  = offset + factor · ln(odds of being good)

   The test file checks the two properties that matter: the parts
   add to the total, and doubling the odds moves the score by
   exactly the PDO. */
export const POINTS = { target: 600, targetOdds: 50, pdo: 20 };

export function pointsScaling({ target, targetOdds, pdo } = POINTS) {
  const factor = pdo / Math.LN2;
  return { factor, offset: target - factor * Math.log(targetOdds) };
}

/**
 * Points per feature for one applicant, plus the total.
 * @param {object} fit    a fitLogistic result
 * @param {number[]} xRow the applicant's standardised features
 */
export function scorePoints(fit, xRow, scaling = pointsScaling()) {
  const k = xRow.length;
  const { factor, offset } = scaling;
  /* The score is built from the odds of being GOOD, so every
     sign flips: a coefficient that raises the probability of
     default lowers the points. */
  const per = xRow.map((v, j) => -factor * fit.beta[j + 1] * v - (factor * fit.beta[0]) / k + offset / k);
  return { per, total: sum(per) };
}

/* ------------------------------------------------------------
   10 · Permutation importance

   Refitting is not required and would answer a different
   question. Shuffling one column of the test set and measuring
   how much AUC falls asks what the fitted model is leaning on,
   which is the question a model reviewer asks.
   ------------------------------------------------------------ */
export function permutationImportance(predict, X, y, { repeats = 3, seed = 11, features = FEATURES } = {}) {
  const baseAuc = aucMannWhitney(y, predict(X));
  const rand = rng(seed);
  return features.map((f, j) => {
    let drop = 0;
    for (let r = 0; r < repeats; r++) {
      const col = shuffle(X.map((row) => row[j]), rand);
      const permuted = X.map((row, i) => {
        const copy = [...row];
        copy[j] = col[i];
        return copy;
      });
      drop += baseAuc - aucMannWhitney(y, predict(permuted));
    }
    return { feature: f, key: f.key, name: f.short ?? f.name, drop: drop / repeats };
  }).sort((a, b) => b.drop - a.drop);
}

/** Importance rolled up from one-hot columns to the attribute they came from. */
export function byAttribute(importances) {
  const out = new Map();
  importances.forEach((imp) => {
    const key = imp.feature.attribute ?? imp.feature.key;
    const name = imp.feature.attributeShort ?? imp.feature.short ?? imp.feature.name;
    const prev = out.get(key) ?? { key, name, drop: 0, protectedAttr: !!imp.feature.protectedAttr };
    prev.drop += imp.drop;
    out.set(key, prev);
  });
  return [...out.values()].sort((a, b) => b.drop - a.drop);
}

/** Partial dependence of the prediction on one numeric feature. */
export function partialDependence(predict, X, j, { grid = 12 } = {}) {
  const vals = X.map((r) => r[j]);
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  return Array.from({ length: grid }, (_, g) => {
    const v = lo + ((hi - lo) * g) / (grid - 1);
    const swapped = X.map((row) => {
      const copy = [...row];
      copy[j] = v;
      return copy;
    });
    return { value: v, prediction: mean(predict(swapped)) };
  });
}

/* ------------------------------------------------------------
   11 · The whole pipeline
   ------------------------------------------------------------ */

export const DEFAULTS = {
  seed: 7,
  testFraction: 0.3,
  ridge: 1.0,
  threshold: 0.5,
  useProtected: true,
  calibrate: true,
  folds: 5,
  ivBins: 5,
  ...GBM_DEFAULTS,
};

export const DRIVERS = [
  { key: "seed", label: "Split seed", group: "The split", fmt: "int", min: 1, max: 60, step: 1,
    help: "Which applicants land in the test set. Nothing about the models changes when this moves, only which 300 people they are measured on, and that is the point of putting it first." },
  { key: "testFraction", label: "Test share", group: "The split", fmt: "pct01", min: 0.15, max: 0.5, step: 0.05,
    help: "A bigger test set measures better and trains worse. With 1,000 rows there is no setting that does both." },
  { key: "ridge", label: "Ridge penalty", group: "The scorecard", fmt: "num", min: 0, max: 20, step: 0.5,
    help: "Shrinks the coefficients towards zero. At zero, a category where every applicant defaulted sends its coefficient to infinity, which is called complete separation and looks exactly like a very confident model." },
  { key: "nTrees", label: "Trees", group: "The boosted model", fmt: "int", min: 5, max: 400, step: 5,
    help: "Each one fits the errors of the ones before it. More is not better past the point where the validation curve turns up." },
  { key: "learningRate", label: "Learning rate", group: "The boosted model", fmt: "num3", min: 0.01, max: 0.5, step: 0.01,
    help: "How much of each tree is kept. Lower needs more trees and generalises better, which is the whole trade in one slider." },
  { key: "maxDepth", label: "Tree depth", group: "The boosted model", fmt: "int", min: 1, max: 8, step: 1,
    help: "Depth 1 is a stump and can only add up single effects. Depth 3 can express a three-way interaction, which is what a tree model is for." },
  { key: "lambda", label: "Leaf penalty", group: "The boosted model", fmt: "num", min: 0, max: 20, step: 0.5,
    help: "L2 on the leaf values. It shrinks leaves fitted from a handful of applicants harder than leaves fitted from many." },
  { key: "subsample", label: "Row sampling", group: "The boosted model", fmt: "pct01", min: 0.4, max: 1, step: 0.05,
    help: "The share of applicants each tree sees." },
  { key: "colsample", label: "Feature sampling", group: "The boosted model", fmt: "pct01", min: 0.2, max: 1, step: 0.05,
    help: "The share of columns each split may consider. Decorrelates the trees, which matters more than it sounds." },
  { key: "threshold", label: "Decline cut-off", group: "The decision", fmt: "pct01", min: 0.02, max: 0.9, step: 0.01,
    help: "Above this estimated probability of default, decline. Everything a bank actually cares about is downstream of this number, and no amount of AUC chooses it for you." },
];

/**
 * Fit everything, on one split, and return every number the page
 * shows. Deterministic given the assumptions.
 */
export function run(a = DEFAULTS, rows = ROWS) {
  const features = FEATURES.filter((f) => a.useProtected || !f.protectedAttr);
  const logitCols = features.map((f, j) => [f, j]).filter(([f]) => !f.isReference).map(([, j]) => j);

  const { train, test } = stratifiedSplit(rows, { testFraction: a.testFraction, seed: a.seed });

  /* A slice of the TRAINING rows, held back to watch the boosting
     curve and to fit the calibration. The test set is not touched
     by anything that chooses a setting. */
  const inner = stratifiedSplit(train, { testFraction: 0.25, seed: a.seed + 1000 });

  const Xall = designMatrix(train, features);
  const Xtest = designMatrix(test, features);
  const Xfit = designMatrix(inner.train, features);
  const Xval = designMatrix(inner.test, features);
  const yAll = labels(train);
  const yTest = labels(test);
  const yFit = labels(inner.train);
  const yVal = labels(inner.test);

  // ---- the scorecard ----
  const scaler = fitScaler(Xall.map((r) => logitCols.map((j) => r[j])));
  const pick = (X) => applyScaler(X.map((r) => logitCols.map((j) => r[j])), scaler);
  const logit = fitLogistic(pick(Xall), yAll, { ridge: a.ridge });
  const logitTrain = logit.predict(pick(Xall));
  const logitTest = logit.predict(pick(Xtest));

  // ---- the boosted model ----
  const gbm = fitGbm(Xfit, yFit, a, { X: Xval, y: yVal });
  /* Refit on all the training rows once the shape of the model
     has been settled on the inner split, which is the usual
     order and worth stating: the validation slice chooses
     settings, the full training set fits the model that ships. */
  const gbmFull = fitGbm(Xall, yAll, a);
  const gbmTrain = gbmFull.predict(Xall);
  const gbmTestRaw = gbmFull.raw(Xtest);
  let gbmTest = gbmTestRaw.map(sigmoid);

  /* CALIBRATION ON SCORES FROM A MODEL THAT NEVER SAW THESE
     ROWS. In-sample boosted scores are almost separable, so a
     mapping fitted on them learns a slope suited to a model that
     already knows the answer, and the only sign of it is that
     the Brier score gets worse. */
  const platt = fitPlatt(gbm.raw(Xval), yVal);
  const gbmTestCalibrated = platt.apply(gbmTestRaw);
  const uncalibrated = gbmTest;
  if (a.calibrate) gbmTest = gbmTestCalibrated;

  // ---- metrics ----
  const rocLogit = roc(yTest, logitTest);
  const rocGbm = roc(yTest, gbmTest);
  const compare = delong(yTest, gbmTest, logitTest);

  const metrics = (y, p, curve) => ({
    auc: curve.auc,
    gini: 2 * curve.auc - 1,
    ks: curve.ks,
    logLoss: logLoss(y, p),
    brier: brier(y, p),
    se: aucStandardError(curve.auc, curve.nPos, curve.nNeg),
  });

  return {
    features, logitCols, scaler,
    train, test, inner,
    Xall, Xtest, yAll, yTest,
    logit,
    gbm: gbmFull,
    gbmWatch: gbm,
    platt,
    scores: {
      logit: { train: logitTrain, test: logitTest },
      gbm: { train: gbmTrain, test: gbmTest, uncalibrated },
    },
    roc: { logit: rocLogit, gbm: rocGbm },
    pr: { logit: precisionRecall(yTest, logitTest), gbm: precisionRecall(yTest, gbmTest) },
    metrics: {
      logit: metrics(yTest, logitTest, rocLogit),
      gbm: metrics(yTest, gbmTest, rocGbm),
      logitTrain: { auc: aucMannWhitney(yAll, logitTrain) },
      gbmTrain: { auc: aucMannWhitney(yAll, gbmTrain) },
    },
    compare,
    calibration: {
      gbm: calibration(yTest, gbmTest),
      uncalibrated: calibration(yTest, uncalibrated),
      logit: calibration(yTest, logitTest),
    },
    confusion: {
      logit: confusion(yTest, logitTest, a.threshold),
      gbm: confusion(yTest, gbmTest, a.threshold),
    },
    cost: { logit: costCurve(yTest, logitTest), gbm: costCurve(yTest, gbmTest) },
    lift: { logit: liftTable(yTest, logitTest), gbm: liftTable(yTest, gbmTest) },
    iv: informationValues(train, { bins: a.ivBins }),
    baseRate: mean(yTest),
  };
}

/* ------------------------------------------------------------
   12 · Cross-validation

   The number that decides whether the comparison above was a
   result or a coin. Repeated stratified k-fold, both models,
   every fold fitted from scratch including the encoder.
   ------------------------------------------------------------ */
export function crossValidate(a = DEFAULTS, rows = ROWS, { k = 5, repeats = 2 } = {}) {
  const features = FEATURES.filter((f) => a.useProtected || !f.protectedAttr);
  const logitCols = features.map((f, j) => [f, j]).filter(([f]) => !f.isReference).map(([, j]) => j);
  const logitAucs = [];
  const gbmAucs = [];
  const diffs = [];

  for (let r = 0; r < repeats; r++) {
    const folds = stratifiedFolds(rows, { k, seed: a.seed + r * 97 });
    for (let f = 0; f < k; f++) {
      const hold = folds[f];
      const trainRows = folds.filter((_, i) => i !== f).flat();
      const Xtr = designMatrix(trainRows, features);
      const Xho = designMatrix(hold, features);
      const ytr = labels(trainRows);
      const yho = labels(hold);

      const scaler = fitScaler(Xtr.map((row) => logitCols.map((j) => row[j])));
      const pick = (X) => applyScaler(X.map((row) => logitCols.map((j) => row[j])), scaler);
      const lg = fitLogistic(pick(Xtr), ytr, { ridge: a.ridge });
      const gb = fitGbm(Xtr, ytr, a);

      const la = aucMannWhitney(yho, lg.predict(pick(Xho)));
      const ga = aucMannWhitney(yho, gb.predict(Xho));
      logitAucs.push(la);
      gbmAucs.push(ga);
      diffs.push(ga - la);
    }
  }

  const sd = (xs) => {
    const m = mean(xs);
    return Math.sqrt(sum(xs.map((x) => (x - m) ** 2)) / Math.max(1, xs.length - 1));
  };
  const n = diffs.length;
  const meanDiff = mean(diffs);
  const seDiff = sd(diffs) / Math.sqrt(n);
  return {
    k, repeats, n,
    logit: { mean: mean(logitAucs), sd: sd(logitAucs), values: logitAucs },
    gbm: { mean: mean(gbmAucs), sd: sd(gbmAucs), values: gbmAucs },
    difference: { mean: meanDiff, sd: sd(diffs), se: seDiff, values: diffs,
      ci: [meanDiff - 1.96 * seDiff, meanDiff + 1.96 * seDiff],
      wins: diffs.filter((d) => d > 0).length },
  };
}

/* 13 · Fair lending. The dataset ships sex, age and
   foreign-worker status. Dropping them is necessary and nothing
   like sufficient, because a model with fifty other columns
   rebuilds what it can, so the page measures both halves: what
   accuracy costs, and what disparity survives. */
export const GROUPS = {
  sex: {
    name: "Sex, as the dataset records it",
    column: SCHEMA.findIndex((c) => c.key === "personal"),
    of: (row) => ([1].includes(row[SCHEMA.findIndex((c) => c.key === "personal")]) ? "female" : "male"),
    levels: ["female", "male"],
  },
  age: {
    name: "Age, split at 30",
    column: SCHEMA.findIndex((c) => c.key === "age"),
    of: (row) => (row[SCHEMA.findIndex((c) => c.key === "age")] < 30 ? "under 30" : "30 and over"),
    levels: ["under 30", "30 and over"],
  },
  foreign: {
    name: "Foreign worker",
    column: SCHEMA.findIndex((c) => c.key === "foreign"),
    of: (row) => (row[SCHEMA.findIndex((c) => c.key === "foreign")] === 0 ? "foreign worker" : "not"),
    levels: ["foreign worker", "not"],
  },
};

/**
 * Approval rates by group at a cut-off, and the ratio between
 * them: the four-fifths rule, which is a screening test rather
 * than a legal standard, but is the one every model review
 * starts from.
 */
export function fairness(rows, p, threshold, groupKey = "sex") {
  const g = GROUPS[groupKey];
  const stats = g.levels.map((level) => {
    const idx = rows.map((r, i) => [r, i]).filter(([r]) => g.of(r) === level).map(([, i]) => i);
    const approved = idx.filter((i) => p[i] < threshold).length;
    const bad = idx.filter((i) => rows[i][TARGET] === 1).length;
    const scores = idx.map((i) => p[i]);
    const ys = idx.map((i) => rows[i][TARGET]);
    return {
      level, n: idx.length,
      approvalRate: idx.length ? approved / idx.length : NaN,
      badRate: idx.length ? bad / idx.length : NaN,
      meanScore: mean(scores),
      auc: aucMannWhitney(ys, scores),
    };
  });
  const rates = stats.map((s) => s.approvalRate).filter(Number.isFinite);
  const ratio = rates.length === 2 ? Math.min(...rates) / Math.max(...rates) : NaN;
  return { group: g.name, stats, ratio, passesFourFifths: ratio >= 0.8 };
}

/* ------------------------------------------------------------
   14 · CSV
   ------------------------------------------------------------ */
export function toCsv(a = DEFAULTS, rows = ROWS) {
  const r = run(a, rows);
  const esc = (s) =>
    typeof s === "string" && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  const L = [];
  const row = (...cells) => L.push(cells.map(esc).join(","));
  const f = (v, d = 4) => (Number.isFinite(v) ? v.toFixed(d) : "");

  row(`Probability of default: ${SOURCE.name}`);
  row(`${SOURCE.author} (${SOURCE.year}), ${SOURCE.publisher}, ${SOURCE.licence}`);
  row(SOURCE.url);
  row("");

  row("SETTINGS");
  DRIVERS.forEach((d) => row(d.label, f(a[d.key], 4)));
  row("Protected attributes included", a.useProtected ? "yes" : "no");
  row("Boosted scores recalibrated", a.calibrate ? "yes" : "no");
  row("");

  row("TEST-SET PERFORMANCE", "Scorecard", "Boosted");
  [["AUC", "auc"], ["Gini", "gini"], ["KS", "ks"], ["Log loss", "logLoss"], ["Brier", "brier"]]
    .forEach(([label, key]) => row(label, f(r.metrics.logit[key]), f(r.metrics.gbm[key])));
  row("AUC standard error", f(r.metrics.logit.se), f(r.metrics.gbm.se));
  row("");

  row("DELONG TEST, BOOSTED MINUS SCORECARD");
  row("Difference in AUC", f(r.compare.difference));
  row("Standard error of the difference", f(r.compare.se));
  row("95% interval", f(r.compare.ci[0]), f(r.compare.ci[1]));
  row("z", f(r.compare.z, 3));
  row("p", f(r.compare.p, 4));
  row("Correlation between the two", f(r.compare.correlation, 3));
  row("");

  row("AT THE CHOSEN CUT-OFF", f(a.threshold, 3));
  row("", "Scorecard", "Boosted");
  [["Approval rate", "approvalRate"], ["Accuracy", "accuracy"], ["Precision", "precision"],
    ["Recall", "recall"], ["Cost per applicant", "costPerApplicant"]]
    .forEach(([label, key]) => row(label, f(r.confusion.logit[key]), f(r.confusion.gbm[key])));
  row("Cheapest cut-off", f(r.cost.logit.best.threshold, 3), f(r.cost.gbm.best.threshold, 3));
  row("");

  row("INFORMATION VALUE, TRAINING ROWS");
  row("Attribute", "IV", "Reading");
  r.iv.forEach((x) => row(x.name, f(x.iv, 4), ivBand(x.iv)));
  row("");

  row("SCORECARD COEFFICIENTS");
  row("Term", "Coefficient", "Standard error", "z", "p");
  row("(intercept)", f(r.logit.beta[0]), f(r.logit.se[0]), f(r.logit.z[0], 3), f(r.logit.p[0], 4));
  r.logitCols.forEach((col, j) =>
    row(r.features[col].name, f(r.logit.beta[j + 1]), f(r.logit.se[j + 1]),
      f(r.logit.z[j + 1], 3), f(r.logit.p[j + 1], 4)));

  return L.join("\n");
}
