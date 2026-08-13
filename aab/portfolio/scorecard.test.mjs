#!/usr/bin/env node
/* ============================================================
   scorecard.test.mjs, checks on the PD modelling pipeline.

       node aab/portfolio/scorecard.test.mjs

   A model that is wrong does not crash. It returns a number,
   the number looks reasonable, and nothing anywhere says
   otherwise. This file is the only thing standing between that
   and the page, so nothing here checks a function against
   itself.

   Where an outside authority has a closed form, that is the
   test. Logistic regression on a single binary predictor has to
   return the log odds ratio of the two-by-two table, exactly,
   and its standard error has to be Woolf's formula, exactly.
   The area under the ROC curve is computed three separate ways
   here, by trapezoid, by the Mann-Whitney statistic and through
   DeLong's structural components, and all three have to agree.
   A boosted tree's leaf value has to be the closed-form
   minimiser of the penalised objective it claims to minimise.
   ============================================================ */

import {
  normCdf, twoSided, sigmoid, rng, shuffle, solve, invert,
  fitLogistic, fitScaler, applyScaler, stratifiedSplit, stratifiedFolds,
  buildFeatures, designMatrix, labels, featureValue,
  binEdges, binOf, woeTable, informationValues, ivBand,
  fitBinner, applyBinner, fitGbm, GBM_DEFAULTS,
  logLoss, brier, roc, aucMannWhitney, precisionRecall, aucStandardError, delong,
  confusion, costCurve, calibration, fitPlatt, liftTable,
  pointsScaling, scorePoints, permutationImportance, byAttribute, partialDependence,
  fairness, GROUPS, run, crossValidate, toCsv,
  ROWS, SCHEMA, SOURCE, CHECKS, FEATURES, TARGET, DEFAULTS, DRIVERS,
} from "./scorecard.model.js";

let pass = 0;
const failures = [];
const ok = (name, cond) => {
  if (cond) pass++; else failures.push(name);
};
const close = (name, got, want, tol) =>
  ok(`${name} (got ${got}, want ${want})`, Math.abs(got - want) <= tol);

const sum = (xs) => xs.reduce((a, b) => a + b, 0);
const mean = (xs) => sum(xs) / xs.length;

/* ---------- 1 · the shipped data is the data that was downloaded ----------
   scorecard.fetch.mjs computed these totals from the file it
   pulled off the UCI archive. Recomputing them from the rows in
   the repository is what makes the provenance claim checkable
   rather than decorative: a conversion that dropped a column,
   shifted a level or truncated the file moves at least one of
   them. */
ok("one thousand applications", ROWS.length === CHECKS.rows && ROWS.length === 1000);
ok("three hundred of them went bad",
  ROWS.filter((r) => r[TARGET] === 1).length === CHECKS.bad && CHECKS.bad === 300);
ok("and seven hundred did not", ROWS.filter((r) => r[TARGET] === 0).length === CHECKS.good);
ok("every row has twenty attributes and a label",
  ROWS.every((r) => r.length === SCHEMA.length + 1));
ok("the label is zero or one", ROWS.every((r) => r[TARGET] === 0 || r[TARGET] === 1));
ok("nothing is missing", ROWS.every((r) => r.every((v) => Number.isFinite(v))));

SCHEMA.forEach((col, j) => {
  if (col.type === "num") {
    const v = ROWS.map((r) => r[j]);
    close(`${col.key}: the column sums to what the conversion saw`,
      sum(v), CHECKS.numericSums[col.key], 1e-9);
    ok(`${col.key}: and stays inside the range it saw`,
      Math.min(...v) === CHECKS.numericRanges[col.key][0]
      && Math.max(...v) === CHECKS.numericRanges[col.key][1]);
  } else {
    const counts = col.levels.map((_, k) => ROWS.filter((r) => r[j] === k).length);
    ok(`${col.key}: every level count matches the conversion`,
      counts.every((c, k) => c === CHECKS.levelCounts[col.key][k]));
    ok(`${col.key}: every value is a level that exists`,
      ROWS.every((r) => r[j] >= 0 && r[j] < col.levels.length));
  }
});
/* The documentation lists two categories the data never uses,
   and is itself unsure about one of them: its note on the
   vacation code reads "(vacation - does not exist?)". */
ok("the two documented but unused levels are still the same two",
  CHECKS.emptyLevels.join() === "purpose:A47,personal:A95");
ok("the cost matrix is the one the documentation states",
  SOURCE.costMatrix.falseGood === 5 && SOURCE.costMatrix.falseBad === 1);

/* ---------- 2 · features ---------- */
ok("no feature is built on a level with no applicants in it",
  FEATURES.every((f) => f.kind === "num" || f.n > 0));
ok("one reference level per categorical attribute",
  [...new Set(FEATURES.filter((f) => f.kind === "dummy").map((f) => f.attribute))]
    .every((attr) => FEATURES.filter((f) => f.attribute === attr && f.isReference).length === 1));
ok("the reference is the most common level of its attribute",
  [...new Set(FEATURES.filter((f) => f.kind === "dummy").map((f) => f.attribute))]
    .every((attr) => {
      const levels = FEATURES.filter((f) => f.attribute === attr);
      const ref = levels.find((f) => f.isReference);
      return levels.every((f) => f.n <= ref.n);
    }));
ok("the seven numeric attributes come through as numbers",
  FEATURES.filter((f) => f.kind === "num").length === 7);
ok("the protected attributes are flagged",
  ["personal", "age", "foreign"].every((k) =>
    FEATURES.some((f) => (f.attribute ?? f.key) === k && f.protectedAttr)));
{
  const X = designMatrix(ROWS.slice(0, 5));
  ok("the design matrix is one column per feature", X.every((r) => r.length === FEATURES.length));
  ok("dummies are zero or one",
    X.every((row) => FEATURES.every((f, j) => f.kind === "num" || row[j] === 0 || row[j] === 1)));
  ok("exactly one dummy per attribute is hot",
    [...new Set(FEATURES.filter((f) => f.kind === "dummy").map((f) => f.attribute))]
      .every((attr) => X.every((row) =>
        sum(FEATURES.map((f, j) => (f.attribute === attr ? row[j] : 0))) === 1)));
}

/* ---------- 3 · linear algebra ---------- */
{
  const A = [[4, 1, 2], [1, 3, 0], [2, 0, 5]];
  const x = solve(A, [13, 7, 19]);
  const back = A.map((row) => sum(row.map((v, j) => v * x[j])));
  ok("solve returns a vector that satisfies the system",
    back.every((v, i) => Math.abs(v - [13, 7, 19][i]) < 1e-9));
  const inv = invert(A);
  const I = A.map((row, i) => inv[0].map((_, j) => sum(row.map((v, k) => v * inv[k][j]))));
  ok("invert returns the inverse",
    I.every((row, i) => row.every((v, j) => Math.abs(v - (i === j ? 1 : 0)) < 1e-9)));
}

/* ---------- 4 · logistic regression, against a closed form ----------
   With one binary predictor the maximum likelihood estimate is
   not iterative at all: the slope is the log odds ratio of the
   two-by-two table and the intercept is the log odds of the
   reference cell. Both exactly. And the standard error of that
   slope is Woolf's formula, √(1/a + 1/b + 1/c + 1/d), which is a
   direct check on the inverse Hessian rather than on the fit. */
{
  const a = 30;  // x=1, y=1
  const b = 70;  // x=1, y=0
  const c = 10;  // x=0, y=1
  const d = 90;  // x=0, y=0
  const X = [];
  const y = [];
  const add = (xv, yv, times) => { for (let i = 0; i < times; i++) { X.push([xv]); y.push(yv); } };
  add(1, 1, a); add(1, 0, b); add(0, 1, c); add(0, 0, d);

  const fit = fitLogistic(X, y, { ridge: 0, tol: 1e-12, maxIter: 60 });
  const logOddsRatio = Math.log((a * d) / (b * c));
  close("the slope is the log odds ratio, exactly", fit.beta[1], logOddsRatio, 1e-9);
  close("the intercept is the log odds of the reference cell", fit.beta[0], Math.log(c / d), 1e-9);
  close("the standard error is Woolf's formula",
    fit.se[1], Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d), 1e-9);
  ok("it converged", fit.converged);
  /* The score equations: at the maximum, the gradient of the
     log-likelihood is zero in every direction. */
  const mu = fit.predict(X);
  close("the residuals sum to zero (intercept score equation)",
    sum(y.map((yi, i) => yi - mu[i])), 0, 1e-8);
  close("and are orthogonal to the predictor (slope score equation)",
    sum(y.map((yi, i) => (yi - mu[i]) * X[i][0])), 0, 1e-8);
}

/* The ridge does what a ridge does, and the intercept is spared. */
{
  const rand = rng(3);
  const X = Array.from({ length: 200 }, () => [rand() * 2 - 1, rand() * 2 - 1]);
  const y = X.map(([x1]) => (x1 + (rand() - 0.5) > 0 ? 1 : 0));
  const loose = fitLogistic(X, y, { ridge: 0.001 });
  const tight = fitLogistic(X, y, { ridge: 50 });
  ok("a bigger ridge shrinks the slopes",
    Math.abs(tight.beta[1]) < Math.abs(loose.beta[1]));
  ok("and never makes them cross zero",
    Math.sign(tight.beta[1]) === Math.sign(loose.beta[1]));
}
/* Complete separation: unpenalised, the likelihood is maximised
   at infinity, and the fit has to return something finite once a
   ridge is on rather than a coefficient of 40 with a standard
   error of 4,000. */
{
  const X = [[0], [0], [0], [1], [1], [1]];
  const y = [0, 0, 0, 1, 1, 1];
  const free = fitLogistic(X, y, { ridge: 0, maxIter: 25 });
  const ridged = fitLogistic(X, y, { ridge: 1 });
  ok("separation sends the unpenalised coefficient off to infinity", Math.abs(free.beta[1]) > 8);
  ok("and the ridge brings it back to something finite",
    Number.isFinite(ridged.beta[1]) && Math.abs(ridged.beta[1]) < 8);
}

/* ---------- 5 · scaling and splitting ---------- */
{
  const X = [[1, 10], [2, 20], [3, 30], [4, 40]];
  const s = fitScaler(X);
  const Z = applyScaler(X, s);
  close("the scaled column has mean zero", mean(Z.map((r) => r[0])), 0, 1e-12);
  const sd = Math.sqrt(sum(Z.map((r) => r[0] ** 2)) / (Z.length - 1));
  close("and unit standard deviation", sd, 1, 1e-12);
}
{
  const { train, test, trainIdx, testIdx } = stratifiedSplit(ROWS, { testFraction: 0.3, seed: 5 });
  ok("the split covers every row once", train.length + test.length === ROWS.length);
  ok("and the halves do not overlap",
    new Set([...trainIdx, ...testIdx]).size === ROWS.length);
  const rate = (rows) => rows.filter((r) => r[TARGET] === 1).length / rows.length;
  close("the default rate survives the split, in train", rate(train), 0.3, 0.005);
  close("and in test", rate(test), 0.3, 0.005);
  const again = stratifiedSplit(ROWS, { testFraction: 0.3, seed: 5 });
  ok("the same seed gives the same split", again.testIdx.join() === testIdx.join());
  const other = stratifiedSplit(ROWS, { testFraction: 0.3, seed: 6 });
  ok("a different seed gives a different one", other.testIdx.join() !== testIdx.join());
}
{
  const folds = stratifiedFolds(ROWS, { k: 5, seed: 2 });
  ok("five folds", folds.length === 5);
  ok("that partition the data", sum(folds.map((f) => f.length)) === ROWS.length);
  ok("each carrying its share of defaults",
    folds.every((f) => Math.abs(f.filter((r) => r[TARGET] === 1).length / f.length - 0.3) < 0.03));
}

/* ---------- 6 · weight of evidence and information value ---------- */
{
  /* A predictor that says nothing has an information value of
     zero; one that says everything has a large one. Both are
     computed from the definition rather than from the model. */
  const rand = rng(9);
  const useless = Array.from({ length: 400 }, () => {
    const row = Array(SCHEMA.length + 1).fill(0);
    row[TARGET] = rand() < 0.3 ? 1 : 0;
    return row;
  });
  const half = Math.floor(useless.length / 2);
  const { iv: ivNull } = woeTable([useless.slice(0, half), useless.slice(half)]);
  ok(`a coin-flip grouping has almost no information value (${ivNull.toFixed(4)})`, ivNull < 0.02);

  const good = useless.filter((r) => r[TARGET] === 0);
  const bad = useless.filter((r) => r[TARGET] === 1);
  const { iv: ivPerfect, table } = woeTable([good, bad]);
  ok(`a grouping that is the answer has a huge one (${ivPerfect.toFixed(2)})`, ivPerfect > 3);
  ok("and no cell is infinite, thanks to the correction",
    table.every((t) => Number.isFinite(t.woe)));
  ok("information value is never negative", ivNull >= 0 && ivPerfect >= 0);
}
{
  const iv = informationValues(ROWS);
  ok("one information value per attribute", iv.length === SCHEMA.length);
  ok("sorted, strongest first", iv.every((x, i) => i === 0 || x.iv <= iv[i - 1].iv));
  /* The checking-account status is the dominant predictor in
     this dataset and has been in every published analysis of it
     since 1994. If it ever stops being first, something upstream
     has broken. */
  ok("checking account status is the strongest attribute", iv[0].key === "checking");
  ok("its bands cover every training row",
    iv.every((x) => sum(x.bands.map((b) => b.n)) === ROWS.length));
  ok("the bands quote the right band names", ivBand(0.01) === "no use" && ivBand(0.2) === "medium");
}
{
  const edges = binEdges([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5);
  ok("quantile edges split into the requested number of bins", edges.length === 4);
  ok("binOf lands values in order",
    binOf(1, edges) === 0 && binOf(10, edges) === 4
    && binOf(5, edges) >= binOf(3, edges));
}

/* ---------- 7 · the area under the curve, three ways ---------- */
{
  const y = [1, 0, 1, 0, 1, 0, 1, 0];
  const perfect = [9, 1, 8, 2, 7, 3, 6, 4];
  close("a perfect ranking scores 1", roc(y, perfect).auc, 1, 1e-12);
  close("and the Mann-Whitney statistic agrees", aucMannWhitney(y, perfect), 1, 1e-12);
  const reversed = perfect.map((v) => -v);
  close("a reversed ranking scores 0", roc(y, reversed).auc, 0, 1e-12);
  const flat = y.map(() => 0.3);
  close("a constant score is a coin flip", aucMannWhitney(y, flat), 0.5, 1e-12);
  close("and the curve agrees with it", roc(y, flat).auc, 0.5, 1e-12);

  const rand = rng(4);
  const ys = Array.from({ length: 300 }, () => (rand() < 0.35 ? 1 : 0));
  const sc = ys.map((yi) => yi * 0.6 + rand());
  close("trapezoid and Mann-Whitney are the same number",
    roc(ys, sc).auc, aucMannWhitney(ys, sc), 1e-12);
  close("AUC is unmoved by any increasing transform of the score",
    aucMannWhitney(ys, sc.map((s) => Math.exp(3 * s))), aucMannWhitney(ys, sc), 1e-12);
  const r = roc(ys, sc);
  ok("the curve starts at the origin and ends at the corner",
    r.points[0].fpr === 0 && r.points[0].tpr === 0
    && Math.abs(r.points[r.points.length - 1].fpr - 1) < 1e-12
    && Math.abs(r.points[r.points.length - 1].tpr - 1) < 1e-12);
  ok("the curve only ever moves up and to the right",
    r.points.every((p, i) => i === 0
      || (p.fpr >= r.points[i - 1].fpr - 1e-12 && p.tpr >= r.points[i - 1].tpr - 1e-12)));
  close("KS is the widest gap between the two rates",
    r.ks, Math.max(...r.points.map((p) => p.tpr - p.fpr)), 1e-12);
  ok("KS is a fraction", r.ks >= 0 && r.ks <= 1);

  const pr = precisionRecall(ys, sc);
  close("average precision beats the base rate", Math.sign(pr.averagePrecision - pr.baseline), 1, 0);
  close("the base rate is the share of defaults", pr.baseline, mean(ys), 1e-12);
}

/* ---------- 8 · standard errors and DeLong ---------- */
{
  ok("the standard error of an AUC falls as the sample grows",
    aucStandardError(0.75, 300, 700) < aucStandardError(0.75, 30, 70));
  ok("and is largest for a coin flip",
    aucStandardError(0.5, 100, 100) > aucStandardError(0.95, 100, 100));
  /* On this dataset's own test set size, roughly ninety defaults
     against two hundred and ten survivors, the standard error of
     an AUC around 0.78 is about three points. That single number
     is the reason the page cross-validates rather than declaring
     a winner from one split. */
  const se = aucStandardError(0.78, 90, 210);
  ok(`the standard error at this sample size is around 0.03 (${se.toFixed(3)})`,
    se > 0.02 && se < 0.04);
}
{
  const rand = rng(21);
  const y = Array.from({ length: 400 }, () => (rand() < 0.3 ? 1 : 0));
  const a = y.map((yi) => yi * 0.8 + rand());
  const b = y.map((yi) => yi * 0.3 + rand());

  const same = delong(y, a, a);
  close("a model against itself differs by exactly nothing", same.difference, 0, 1e-12);
  ok("with no uncertainty about it", same.se < 1e-12 && same.p === 1);
  ok("and a correlation of one with itself", Math.abs(same.correlation - 1) < 1e-9);

  const test = delong(y, a, b);
  /* DeLong reaches the AUC through structural components, which
     is a different route from both the trapezoid and the
     Mann-Whitney count. All three landing on the same number is a
     real check on all three. */
  close("DeLong's AUC agrees with Mann-Whitney, model A",
    test.aucA, aucMannWhitney(y, a), 1e-12);
  close("and with the trapezoid, model B", test.aucB, roc(y, b).auc, 1e-12);
  ok("a clearly better model wins significantly", test.difference > 0 && test.p < 0.01);
  ok("the interval brackets the difference",
    test.ci[0] < test.difference && test.difference < test.ci[1]);
  ok("two models scored on the same people are correlated",
    test.correlation > 0 && test.correlation < 1);
  /* The point of using DeLong at all: treating the two AUCs as
     independent inflates the standard error of their difference,
     because it throws away the fact that they agree about the
     easy cases. */
  const naive = Math.sqrt(aucStandardError(test.aucA, 120, 280) ** 2
    + aucStandardError(test.aucB, 120, 280) ** 2);
  ok("and pairing them beats treating them as independent", test.se < naive);
}

/* ---------- 9 · thresholds, costs and lift ---------- */
{
  const y = [1, 1, 0, 0, 1, 0, 0, 0, 1, 0];
  const p = [0.9, 0.8, 0.7, 0.6, 0.55, 0.4, 0.3, 0.2, 0.15, 0.05];
  const c = confusion(y, p, 0.5);
  ok("the four cells account for everyone", c.tp + c.fp + c.tn + c.fn === y.length);
  ok("the counts are the ones you get by hand",
    c.tp === 3 && c.fp === 2 && c.fn === 1 && c.tn === 4);
  close("cost is five per bad loan approved plus one per good applicant lost",
    c.cost, 1 * 5 + 2 * 1, 1e-12);
  close("approval rate is everyone below the cut-off", c.approvalRate, 5 / 10, 1e-12);
  const strict = confusion(y, p, 0.01);
  ok("a cut-off at zero declines everybody", strict.approvalRate === 0);
  const loose = confusion(y, p, 1.01);
  ok("and one at one approves everybody", loose.approvalRate === 1);
}
{
  /* On a perfectly calibrated score, the cost-minimising cut-off
     is the cost ratio itself: decline when the expected loss
     from lending, p·5, exceeds the expected loss from declining,
     (1−p)·1, which is p above 1/6.

     Built deterministically rather than sampled. The cost curve
     is very flat near its minimum, its second derivative is 6,
     so with sampled outcomes the empirical minimum wanders a
     few points either side of the true one and the test measures
     the sampler rather than the function. Here each probability
     carries exactly its own share of defaults, so the curve is
     the expectation and the minimum is where the algebra says. */
  const p = [];
  const y = [];
  for (let g = 0; g < 200; g++) {
    const pi = (g + 0.5) / 200;
    const nBad = Math.round(100 * pi);
    for (let i = 0; i < 100; i++) { p.push(pi); y.push(i < nBad ? 1 : 0); }
  }
  const { best } = costCurve(y, p, { falseGood: 5, falseBad: 1 });
  close(`the cheapest cut-off is the cost ratio (${best.threshold})`, best.threshold, 1 / 6, 0.011);
}
{
  const rand = rng(31);
  const y = Array.from({ length: 500 }, () => (rand() < 0.3 ? 1 : 0));
  const p = y.map((yi) => yi * 0.5 + rand());
  const table = liftTable(y, p);
  ok("ten bands", table.length === 10);
  ok("that between them hold every default",
    Math.abs(table[table.length - 1].cumulativeBadShare - 1) < 1e-9);
  ok("the worst band lifts above one", table[0].lift > 1);
  ok("cumulative capture only rises",
    table.every((b, i) => i === 0 || b.cumulativeBadShare >= table[i - 1].cumulativeBadShare));
}

/* ---------- 10 · calibration ----------
   The Murphy decomposition is exact when every forecast in a
   bucket is the same number, so it is checked on a score that
   takes three distinct values, where the identity has to hold to
   machine precision rather than approximately. */
{
  const y = [];
  const p = [];
  const push = (prob, nBad, nGood) => {
    for (let i = 0; i < nBad; i++) { y.push(1); p.push(prob); }
    for (let i = 0; i < nGood; i++) { y.push(0); p.push(prob); }
  };
  push(0.1, 10, 90); push(0.5, 50, 50); push(0.9, 80, 20);
  const cal = calibration(y, p, 3);
  close("Brier decomposes into reliability, resolution and uncertainty",
    cal.decomposed, cal.brier, 1e-12);
  ok("three buckets, holding everyone", sum(cal.bins.map((b) => b.n)) === y.length);
  ok("a perfectly calibrated forecast has almost no reliability term",
    calibration([1, 0, 0, 0, 1, 0, 0, 0], [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25], 2)
      .reliability < 1e-9);
}
{
  /* Platt scaling cannot reorder anybody, so it cannot change
     AUC. What it changes is whether the number means what it
     says, which is the entire difference between a classifier
     and a PD model. */
  const rand = rng(13);
  const y = Array.from({ length: 800 }, () => (rand() < 0.25 ? 1 : 0));
  const raw = y.map((yi) => yi * 1.6 + (rand() - 0.5) * 3 + 4);   // shifted, so badly calibrated
  const before = raw.map(sigmoid);
  const platt = fitPlatt(raw, y);
  const after = platt.apply(raw);
  close("the ranking is untouched, so AUC is untouched",
    aucMannWhitney(y, after), aucMannWhitney(y, before), 1e-12);
  ok("the calibrated scores are closer to the truth",
    brier(y, after) < brier(y, before));
  ok("and their average matches the base rate",
    Math.abs(mean(after) - mean(y)) < 0.02);
}

/* ---------- 11 · gradient boosting ---------- */
{
  const rand = rng(5);
  const X = Array.from({ length: 400 }, () => [rand() * 10, rand() * 10]);
  const y = X.map(([a, b]) => (a > 5 && b > 5 ? 1 : 0));

  const flat = fitGbm(X, y, { nTrees: 30, learningRate: 0, seed: 1 });
  const preds = flat.predict(X);
  ok("a learning rate of zero leaves the base rate alone",
    preds.every((p) => Math.abs(p - mean(y)) < 1e-9));

  const fit = fitGbm(X, y, { nTrees: 60, learningRate: 0.2, maxDepth: 2, subsample: 1, colsample: 1, seed: 1 },
    { X, y });
  ok("the training loss falls at every step",
    fit.history.every((h, i) => i === 0 || h.train <= fit.history[i - 1].train + 1e-12));
  ok("it learns an interaction two stumps could not",
    aucMannWhitney(y, fit.predict(X)) > 0.98);
  ok("every prediction is a probability",
    fit.predict(X).every((p) => p > 0 && p < 1));

  const same = fitGbm(X, y, { nTrees: 20, seed: 1 });
  const again = fitGbm(X, y, { nTrees: 20, seed: 1 });
  ok("the same seed gives the same model",
    same.predict(X).every((p, i) => p === again.predict(X)[i]));
  const other = fitGbm(X, y, { nTrees: 20, seed: 2, subsample: 0.5 });
  ok("a different seed changes which rows each tree saw",
    other.predict(X).some((p, i) => p !== same.predict(X)[i]));

  /* The attribution is exact for an additive ensemble, so the
     contributions plus the base have to reproduce the raw score
     for the applicant, to the last decimal. */
  const row = X[7];
  const e = fit.explain(row);
  close("the per-feature contributions add up to the prediction",
    e.base + sum(e.contributions), fit.raw([row])[0], 1e-9);
}
{
  /* The leaf value the algorithm claims to use, checked against
     the closed form it comes from. With one feature, one split
     and depth 1, the leaf holding a set of rows must be
     −ΣG/(ΣH+λ), where G and H are the gradient and hessian of
     the logistic loss at the base score. */
  const X = [[0], [0], [0], [0], [1], [1], [1], [1]];
  const y = [0, 0, 0, 1, 1, 1, 1, 0];
  const lambda = 1;
  const fit = fitGbm(X, y, {
    nTrees: 1, learningRate: 1, maxDepth: 1, lambda,
    subsample: 1, colsample: 1, minChildWeight: 0, seed: 1,
  });
  const base = mean(y);
  const p0 = base;
  const gLeft = sum([0, 1, 2, 3].map((i) => p0 - y[i]));
  const hLeft = 4 * p0 * (1 - p0);
  const expected = -gLeft / (hLeft + lambda);
  const tree = fit.trees[0];
  const leftLeaf = tree.nodes[tree.nodes[tree.root].left];
  close("the leaf value is the closed-form minimiser", leftLeaf.value, expected, 1e-9);
  ok("the stump split on the only feature there is", tree.nodes[tree.root].feature === 0);
}
{
  const X = [[1], [2], [3], [4], [5], [6]];
  const edges = fitBinner(X, 32);
  ok("few distinct values get one bin each", edges[0].length === 5);
  const binnedRows = applyBinner(X, edges);
  ok("and the bins keep the order", binnedRows.map((r) => r[0]).join() === "0,1,2,3,4,5");
}

/* ---------- 12 · scorecard points ---------- */
{
  const { factor, offset } = pointsScaling({ target: 600, targetOdds: 50, pdo: 20 });
  const scoreOf = (odds) => offset + factor * Math.log(odds);
  close("the target odds sit on the target score", scoreOf(50), 600, 1e-9);
  close("doubling the odds adds exactly one PDO", scoreOf(100) - scoreOf(50), 20, 1e-12);
  close("and halving them takes one off", scoreOf(25) - scoreOf(50), -20, 1e-12);

  const fit = fitLogistic([[0], [1], [0], [1], [1], [0]], [0, 1, 0, 1, 1, 0], { ridge: 1 });
  const pts = scorePoints(fit, [1]);
  close("the points of the parts add to the total", sum(pts.per), pts.total, 1e-12);
  const p = fit.predict([[1]])[0];
  close("and the total is the score the model's odds imply",
    pts.total, offset + factor * Math.log((1 - p) / p), 1e-9);
}

/* ---------- 13 · importance and partial dependence ---------- */
{
  const rand = rng(8);
  const X = Array.from({ length: 300 }, () => [rand(), rand()]);
  const y = X.map(([a]) => (a > 0.5 ? 1 : 0));
  const fit = fitGbm(X, y, { nTrees: 40, maxDepth: 2, seed: 3, subsample: 1, colsample: 1 });
  const features = [{ key: "signal", short: "signal" }, { key: "noise", short: "noise" }];
  const imp = permutationImportance((Z) => fit.predict(Z), X, y, { repeats: 2, features });
  ok("permutation importance finds the column that carries the signal",
    imp[0].key === "signal" && imp[0].drop > imp[1].drop);
  ok("and the noise column is worth almost nothing", Math.abs(imp[1].drop) < 0.05);

  const pdp = partialDependence((Z) => fit.predict(Z), X, 0, { grid: 8 });
  ok("partial dependence rises with the feature that drives the outcome",
    pdp[pdp.length - 1].prediction > pdp[0].prediction);
  ok("and is evaluated across the observed range",
    pdp[0].value <= Math.min(...X.map((r) => r[0])) + 1e-9);
}

/* ---------- 14 · fairness ---------- */
{
  const r = run({ ...DEFAULTS, nTrees: 30 });
  const f = fairness(r.test, r.scores.logit.test, 0.5, "sex");
  ok("every applicant lands in one of the two groups",
    sum(f.stats.map((s) => s.n)) === r.test.length);
  ok("approval rates are fractions",
    f.stats.every((s) => s.approvalRate >= 0 && s.approvalRate <= 1));
  ok("the ratio is the smaller rate over the larger", f.ratio <= 1 + 1e-12);
  ok("and the four-fifths reading agrees with it", f.passesFourFifths === (f.ratio >= 0.8));

  const without = run({ ...DEFAULTS, nTrees: 30, useProtected: false });
  ok("dropping the protected attributes removes their columns",
    without.features.every((x) => !x.protectedAttr)
    && without.features.length < r.features.length);
  ok("and the model still works without them", without.metrics.logit.auc > 0.6);
}

/* ---------- 15 · the pipeline end to end ---------- */
{
  const r = run(DEFAULTS);
  ok("the split is seventy thirty", r.train.length === 700 && r.test.length === 300);
  ok("both models beat a coin flip on unseen applicants",
    r.metrics.logit.auc > 0.7 && r.metrics.gbm.auc > 0.7);
  ok("both do better on the rows they were fitted on",
    r.metrics.logitTrain.auc > r.metrics.logit.auc
    && r.metrics.gbmTrain.auc > r.metrics.gbm.auc);
  ok("the boosted model overfits harder than the scorecard",
    r.metrics.gbmTrain.auc - r.metrics.gbm.auc > r.metrics.logitTrain.auc - r.metrics.logit.auc);
  close("Gini is twice the AUC less one", r.metrics.logit.gini, 2 * r.metrics.logit.auc - 1, 1e-12);
  ok("recalibration improves the boosted model's reliability",
    r.calibration.gbm.reliability < r.calibration.uncalibrated.reliability);
  ok("and cannot have changed its ranking",
    Math.abs(aucMannWhitney(r.yTest, r.scores.gbm.test)
      - aucMannWhitney(r.yTest, r.scores.gbm.uncalibrated)) < 1e-12);
  ok("the test rows never appear in training",
    !r.test.some((t) => r.train.includes(t)));
  ok("the inner validation slice comes out of the training rows only",
    r.inner.test.every((row) => r.train.includes(row)));

  const again = run(DEFAULTS);
  ok("the same settings give the same answer, exactly",
    again.metrics.gbm.auc === r.metrics.gbm.auc
    && again.metrics.logit.auc === r.metrics.logit.auc);

  const csv = toCsv({ ...DEFAULTS, nTrees: 20 });
  ok("the export names the source and its licence",
    csv.includes(SOURCE.name) && csv.includes("CC BY 4.0"));
  ok("and carries the DeLong comparison", csv.includes("DELONG TEST, BOOSTED MINUS SCORECARD"));
  ok("and every driver", DRIVERS.every((d) => csv.includes(d.label)));
}

/* The claim the page is built to make: on a thousand rows, the
   difference between the two models is smaller than the noise in
   measuring it. Checked here rather than asserted in the copy,
   because if the data or the models ever changed enough for it
   to stop being true, the page would go on saying it. */
{
  const cv = crossValidate({ ...DEFAULTS, nTrees: 60 }, ROWS, { k: 5, repeats: 1 });
  ok("cross-validation returns one number per fold", cv.n === 5);
  ok("both models land in the range this dataset is known for",
    cv.logit.mean > 0.72 && cv.logit.mean < 0.84
    && cv.gbm.mean > 0.72 && cv.gbm.mean < 0.84);
  ok(`the gap between them is smaller than the spread across folds `
    + `(${cv.difference.mean.toFixed(3)} against ${cv.gbm.sd.toFixed(3)})`,
    Math.abs(cv.difference.mean) < cv.gbm.sd);
  ok("and the scorecard wins at least one fold",
    cv.difference.values.some((d) => d < 0));
}

/* ---------- 16 · the numbers behind the p-values ---------- */
close("Φ(0) = 0.5", normCdf(0), 0.5, 1e-14);
close("Φ(1.959964) = 0.975", normCdf(1.959963985), 0.975, 1e-10);
close("a z of 1.96 is a p of 0.05", twoSided(1.959963985), 0.05, 1e-9);
close("a z of zero is a p of one", twoSided(0), 1, 1e-14);
close("sigmoid(0) is a half", sigmoid(0), 0.5, 1e-15);

/* ---------- report ---------- */
const total = pass + failures.length;
if (failures.length) {
  console.error(`✗ ${failures.length} of ${total} checks failed:\n`);
  failures.forEach((f) => console.error(`   · ${f}`));
  process.exit(1);
}
console.log(`✓ all ${total} checks passed`);
