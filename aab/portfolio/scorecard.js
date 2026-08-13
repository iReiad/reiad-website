/* ============================================================
   scorecard.js: the dashboard around the PD pipeline.

   scorecard.model.js does the statistics and is checked on its
   own; this turns it into something you can argue with.

   Two things are worth knowing about how it renders.

   A full refit is around two hundred milliseconds: two models,
   an encoder, a calibration and every metric. That is too slow
   for a slider that is being dragged, so the fit is memoised on
   the settings that actually change it. The decline cut-off, the
   one control a reader moves most, changes the decision and not
   the model, so it reuses the fit and responds instantly.

   The cross-validation refits everything ten times over and the
   permutation importance scores the test set once per column.
   Both are scheduled rather than run inline, and a new input
   cancels the pending pass instead of queueing behind it.

   Charts are hand-drawn inline SVG, no library, same as the rest
   of the site.
   ============================================================ */

import {
  SOURCE, SCHEMA, ROWS, CHECKS, DEFAULTS, DRIVERS, GROUPS,
  run, crossValidate, toCsv, confusion, fairness, costCurve,
  permutationImportance, byAttribute, ivBand, pointsScaling, scorePoints,
  featureValue, designMatrix, applyScaler, aucMannWhitney,
} from "/portfolio/scorecard.model.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

const dp = (v, d = 3) => (Number.isFinite(v) ? v.toFixed(d) : "–");
const pc = (v, d = 1) => (Number.isFinite(v) ? `${(v * 100).toFixed(d)}%` : "–");
const signed = (v, d = 3) =>
  Number.isFinite(v) ? `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(d)}` : "–";
const num = (v) => (Number.isFinite(v) ? n0.format(Math.round(v)) : "–");

/* ------------------------------------------------------------
   SVG helpers
   ------------------------------------------------------------ */
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};
const chart = (w, h, label) =>
  el("svg", { viewBox: `0 0 ${w} ${h}`, class: "fin-chart", role: "img", "aria-label": label });
const text = (x, y, s, cls = "chart-label", anchor = "middle") => {
  const t = el("text", { x, y, class: cls, "text-anchor": anchor });
  t.textContent = s;
  return t;
};
const path = (points, cls, extra = {}) =>
  el("path", {
    d: points.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" "),
    class: cls, fill: "none", ...extra,
  });
const td = (value, cls) => {
  const cell = document.createElement("td");
  cell.textContent = value;
  if (cls) cell.className = cls;
  return cell;
};

/* ------------------------------------------------------------
   state
   ------------------------------------------------------------ */
const state = { ...DEFAULTS };
const edited = new Set();
let lead = "logit";
let groupKey = "sex";
let applicant = 0;

/* The settings a refit depends on. The cut-off is deliberately
   not among them: it changes what is done with the model, not
   the model, so the page can respond to it in a millisecond. */
const FIT_KEYS = ["seed", "testFraction", "ridge", "nTrees", "learningRate",
  "maxDepth", "lambda", "subsample", "colsample", "useProtected", "calibrate"];
const fitKey = () => FIT_KEYS.map((k) => `${k}=${state[k]}`).join("&");

let cached = null;
let cachedKey = null;
function fit() {
  const key = fitKey();
  if (key !== cachedKey) {
    cached = run(state);
    cachedKey = key;
  }
  return cached;
}

function readUrl() {
  const q = new URLSearchParams(location.search);
  DRIVERS.forEach((d) => {
    const v = q.get(d.key);
    if (v === null) return;
    const n = Number(v);
    if (Number.isFinite(n)) { state[d.key] = n; edited.add(d.key); }
  });
  if (q.get("protected") === "0") state.useProtected = false;
  if (q.get("calibrate") === "0") state.calibrate = false;
  if (q.get("model") === "gbm") lead = "gbm";
  if (q.get("group") && GROUPS[q.get("group")]) groupKey = q.get("group");
}

function writeUrl() {
  const q = new URLSearchParams();
  edited.forEach((k) => q.set(k, String(+Number(state[k]).toFixed(6))));
  if (!state.useProtected) q.set("protected", "0");
  if (!state.calibrate) q.set("calibrate", "0");
  if (lead !== "logit") q.set("model", lead);
  if (groupKey !== "sex") q.set("group", groupKey);
  history.replaceState(null, "", `${location.pathname}${q.toString() ? `?${q}` : ""}`);
}

/* ------------------------------------------------------------
   controls
   ------------------------------------------------------------ */
const fmtDriver = (d, raw) => {
  switch (d.fmt) {
    case "int": return n0.format(raw);
    case "pct01": return `${n0.format(raw * 100)}%`;
    case "num3": return raw.toFixed(2);
    default: return n2.format(raw);
  }
};

function buildControls() {
  const host = $("#drivers");
  if (!host) return;
  const groups = [...new Set(DRIVERS.map((d) => d.group))];

  host.replaceChildren(...groups.map((group) => {
    const box = document.createElement("div");
    box.className = "driver-group";
    const h = document.createElement("h3");
    h.className = "mono";
    h.textContent = group;
    box.append(h);

    DRIVERS.filter((d) => d.group === group).forEach((d) => {
      const wrap = document.createElement("label");
      wrap.className = "driver";
      wrap.dataset.key = d.key;
      const row = document.createElement("span");
      row.className = "label-row";
      const name = document.createElement("span");
      name.textContent = d.label;
      const val = document.createElement("span");
      val.className = "val";
      row.append(name, val);
      const input = document.createElement("input");
      input.type = "range";
      input.min = String(d.min);
      input.max = String(d.max);
      input.step = String(d.step);
      input.dataset.key = d.key;
      input.setAttribute("aria-label", d.label);
      const help = document.createElement("small");
      help.textContent = d.help;
      wrap.append(row, input, help);
      box.append(wrap);
    });
    return box;
  }));

  host.addEventListener("input", (e) => {
    const key = e.target.dataset.key;
    if (!key) return;
    state[key] = Number(e.target.value);
    edited.add(key);
    render();
  });
}

function paintControls() {
  DRIVERS.forEach((d) => {
    const wrap = $(`.driver[data-key="${d.key}"]`);
    if (!wrap) return;
    const input = $("input", wrap);
    const raw = state[d.key];
    input.value = String(raw);
    const p = ((raw - d.min) / (d.max - d.min)) * 100;
    input.style.setProperty("--pct", `${Math.max(0, Math.min(100, p))}%`);
    $(".val", wrap).textContent = fmtDriver(d, raw);
    wrap.toggleAttribute("data-edited", edited.has(d.key));
  });
}

/* ------------------------------------------------------------
   1 · ROC
   ------------------------------------------------------------ */
function drawRoc(r) {
  const host = $("#roc-chart");
  if (!host) return;
  const W = 380;
  const H = 320;
  const pad = { t: 12, r: 12, b: 34, l: 42 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const X = (v) => pad.l + v * iw;
  const Y = (v) => pad.t + ih - v * ih;

  const svg = chart(W, H, "ROC curves for both models");
  for (let g = 0; g <= 4; g++) {
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(g / 4), y2: Y(g / 4), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(g / 4) + 3, `${g * 25}%`, "chart-label", "end"));
    svg.append(text(X(g / 4), H - 14, `${g * 25}%`, "chart-label"));
  }
  svg.append(el("line", { x1: X(0), y1: Y(0), x2: X(1), y2: Y(1), class: "chart-diagonal" }));

  [["logit", r.roc.logit], ["gbm", r.roc.gbm]].forEach(([k, curve]) => {
    svg.append(path(curve.points.map((p) => [X(p.fpr), Y(p.tpr)]), `line-${k}`));
  });

  svg.append(text(pad.l + iw / 2, H - 2, "share of good applicants declined", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#roc-note");
  if (note) {
    note.textContent = `Scorecard ${dp(r.metrics.logit.auc)}, boosted ${dp(r.metrics.gbm.auc)}. `
      + `The standard error of an AUC on ${r.roc.logit.nPos} defaults and ${r.roc.logit.nNeg} survivors is about `
      + `${dp(r.metrics.logit.se, 3)}, which is the width of the whole argument below.`;
  }
}

/* ------------------------------------------------------------
   2 · where the models disagree
   ------------------------------------------------------------ */
function drawScatter(r) {
  const host = $("#scatter-chart");
  if (!host) return;
  const W = 380;
  const H = 320;
  const pad = { t: 12, r: 12, b: 34, l: 42 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const hi = Math.max(...r.scores.logit.test, ...r.scores.gbm.test, 0.6);
  const X = (v) => pad.l + (v / hi) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Scorecard against boosted score, one dot per applicant");
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
    svg.append(text(X(v), H - 14, pc(v, 0), "chart-label"));
  }
  svg.append(el("line", { x1: X(0), y1: Y(0), x2: X(hi), y2: Y(hi), class: "chart-diagonal" }));

  const t = state.threshold;
  if (t < hi) {
    svg.append(el("line", { x1: X(t), x2: X(t), y1: pad.t, y2: pad.t + ih, class: "chart-crit" }));
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(t), y2: Y(t), class: "chart-crit" }));
  }

  r.yTest.forEach((y, i) => {
    svg.append(el("circle", {
      cx: X(r.scores.logit.test[i]), cy: Y(r.scores.gbm.test[i]), r: 2.6,
      class: y === 1 ? "dot-bad" : "dot-good",
    }));
  });

  svg.append(text(pad.l + iw / 2, H - 2, "scorecard PD", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#scatter-note");
  if (note) {
    const disagree = r.yTest.filter((_, i) =>
      (r.scores.logit.test[i] >= t) !== (r.scores.gbm.test[i] >= t)).length;
    note.textContent = `${disagree} of ${r.yTest.length} applicants land on opposite sides of the cut-off. `
      + "Red is an applicant who defaulted. The two models are strongly correlated, which is why "
      + "comparing them needs a paired test rather than two separate confidence intervals.";
  }
}

/* ------------------------------------------------------------
   3 · information value
   ------------------------------------------------------------ */
function drawIv(r) {
  const host = $("#iv-chart");
  if (!host) return;
  const rows = r.iv.slice(0, 12);
  const W = 760;
  const rowH = 22;
  const H = rows.length * rowH + 34;
  const pad = { t: 16, r: 96, b: 12, l: 190 };
  const iw = W - pad.l - pad.r;
  const max = Math.max(...rows.map((x) => x.iv), 0.1);

  const svg = chart(W, H, "Information value by attribute");
  [0.02, 0.1, 0.3, 0.5].forEach((v) => {
    if (v > max) return;
    const x = pad.l + (v / max) * iw;
    svg.append(el("line", { x1: x, x2: x, y1: pad.t - 6, y2: H - pad.b, class: "chart-crit" }));
    svg.append(text(x, pad.t - 8, String(v), "chart-label-sm"));
  });

  rows.forEach((x, i) => {
    const y = pad.t + i * rowH;
    svg.append(el("rect", {
      x: pad.l, y: y + 4, width: Math.max(1, (x.iv / max) * iw), height: rowH - 10,
      class: x.protectedAttr ? "bar-iv-protected" : "bar-iv",
    }));
    svg.append(text(pad.l - 8, y + rowH / 2 + 2,
      x.short + (x.protectedAttr ? " ◆" : ""), "chart-row-label", "end"));
    svg.append(text(pad.l + (x.iv / max) * iw + 6, y + rowH / 2 + 2,
      `${dp(x.iv)} · ${ivBand(x.iv)}`, "chart-coef", "start"));
  });
  host.replaceChildren(svg);

  const note = $("#iv-note");
  if (note) {
    const top = r.iv[0];
    const prot = r.iv.filter((x) => x.protectedAttr);
    note.textContent = `${top.short} alone reaches ${dp(top.iv)}, which the rule of thumb calls `
      + `${ivBand(top.iv)}: a third of applicants have no checking account at all, and that group `
      + `defaults at a very different rate from the rest. The three attributes marked ◆ are protected `
      + `characteristics, and between them they carry ${dp(prot.reduce((t, x) => t + x.iv, 0))} of information value.`;
  }
}

/* ------------------------------------------------------------
   4 · coefficients
   ------------------------------------------------------------ */
function drawCoefficients(r) {
  const host = $("#coef-chart");
  if (!host) return;
  const terms = r.logitCols.map((col, j) => ({
    name: r.features[col].short ?? r.features[col].name,
    protectedAttr: r.features[col].protectedAttr,
    beta: r.logit.beta[j + 1],
    se: r.logit.se[j + 1],
    p: r.logit.p[j + 1],
  })).sort((a, b) => Math.abs(b.beta / b.se) - Math.abs(a.beta / a.se)).slice(0, 14);

  const W = 760;
  const rowH = 22;
  const H = terms.length * rowH + 40;
  const pad = { t: 20, r: 78, b: 16, l: 250 };
  const iw = W - pad.l - pad.r;
  const max = Math.max(...terms.map((t) => Math.abs(t.beta) + 1.96 * t.se), 0.2);
  const X = (v) => pad.l + ((v + max) / (2 * max)) * iw;

  const svg = chart(W, H, "Scorecard coefficients with confidence intervals");
  svg.append(el("line", { x1: X(0), x2: X(0), y1: pad.t - 6, y2: H - pad.b, class: "chart-zero-strong" }));
  svg.append(text(X(0), pad.t - 9, "no effect", "chart-label-sm"));
  svg.append(text(pad.l, pad.t - 9, "lowers the risk", "chart-label-sm", "start"));
  svg.append(text(W - pad.r, pad.t - 9, "raises it", "chart-label-sm", "end"));

  terms.forEach((t, i) => {
    const y = pad.t + i * rowH + rowH / 2;
    const sig = t.p < 0.05;
    svg.append(el("line", {
      x1: X(t.beta - 1.96 * t.se), x2: X(t.beta + 1.96 * t.se), y1: y, y2: y,
      class: sig ? "ci-sig" : "ci-null",
    }));
    svg.append(el("circle", { cx: X(t.beta), cy: y, r: 3.4, class: sig ? "dot-sig" : "dot-null" }));
    svg.append(text(pad.l - 10, y + 3,
      t.name + (t.protectedAttr ? " ◆" : ""), "chart-row-label", "end"));
    svg.append(text(W - pad.r + 6, y + 3, signed(t.beta, 2), "chart-coef", "start"));
  });
  host.replaceChildren(svg);

  const note = $("#coef-note");
  if (note) {
    const sig = r.logit.p.slice(1).filter((p) => p < 0.05).length;
    note.textContent = `${sig} of ${r.logitCols.length} terms are significant at 5%. `
      + "Filled means the interval misses zero. On 700 training rows most levels of most attributes "
      + "cannot be told apart from their reference, which is the honest state of a scorecard fitted "
      + "to a sample this size and an argument for coarser categories rather than more of them.";
  }
}

/* ------------------------------------------------------------
   5 · the learning curve
   ------------------------------------------------------------ */
function drawCurve(r) {
  const host = $("#curve-chart");
  if (!host) return;
  const h = r.gbmWatch.history;
  if (!h.length) return;
  const W = 760;
  const H = 240;
  const pad = { t: 14, r: 60, b: 28, l: 52 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const all = h.flatMap((x) => [x.train, x.watch]).filter(Number.isFinite);
  const lo = Math.min(...all) * 0.96;
  const hi = Math.max(...all) * 1.02;
  const X = (i) => pad.l + (i / Math.max(1, h.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / (hi - lo || 1)) * ih;

  const svg = chart(W, H, "Log loss against the number of trees");
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, dp(v, 2), "chart-label", "end"));
  }
  svg.append(path(h.map((x, i) => [X(i), Y(x.train)]), "line-train"));
  svg.append(path(h.map((x, i) => [X(i), Y(x.watch)]), "line-valid"));

  const best = r.gbmWatch.bestIteration;
  svg.append(el("line", { x1: X(best - 1), x2: X(best - 1), y1: pad.t, y2: pad.t + ih, class: "chart-event" }));
  svg.append(text(X(best - 1), pad.t + 10, `best at ${best}`, "chart-label-sm",
    best > h.length * 0.7 ? "end" : "start"));

  [0, Math.floor(h.length / 2), h.length - 1].forEach((i) =>
    svg.append(text(X(i), H - 8, String(h[i].tree), "chart-label")));
  svg.append(text(pad.l + iw / 2, H - 0.5, "trees", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#curve-note");
  if (note) {
    const last = h[h.length - 1];
    note.textContent = last.watch > h[Math.max(0, best - 1)].watch + 0.005
      ? `The held-out curve bottoms out at ${best} trees and rises after it: past that point every `
        + `extra tree is fitting the training rows and nothing else. You are currently running ${h.length}.`
      : `The held-out curve is still falling at ${h.length} trees, so this model has not yet started `
        + "to overfit. The gap between the two lines is the part it has memorised.";
  }
}

/* ------------------------------------------------------------
   6 · DeLong, and the folds
   ------------------------------------------------------------ */
function drawDelong(r) {
  const host = $("#delong-chart");
  if (!host) return;
  const c = r.compare;

  /* Two panels in one figure, and the comparison between them is
     the point. Above: each model's AUC with its own interval,
     which overlap so heavily that separately they say nothing.
     Below: the difference measured on the same applicants, whose
     interval is far narrower because the two models agree about
     the easy cases and only differ on the hard ones. Anyone who
     compares two models by checking whether their intervals
     overlap is reading the top panel and ignoring the bottom. */
  const W = 370;
  const H = 240;
  const pad = { t: 30, r: 20, b: 34, l: 96 };
  const iw = W - pad.l - pad.r;

  const aucs = [
    { name: "Scorecard", auc: r.metrics.logit.auc, se: r.metrics.logit.se, cls: "logit" },
    { name: "Boosted", auc: r.metrics.gbm.auc, se: r.metrics.gbm.se, cls: "gbm" },
  ];
  const lo = Math.min(...aucs.map((a) => a.auc - 2 * a.se)) - 0.01;
  const hi = Math.max(...aucs.map((a) => a.auc + 2 * a.se)) + 0.01;
  const X = (v) => pad.l + ((v - lo) / (hi - lo)) * iw;

  const svg = chart(W, H, "Each model's AUC, and the paired difference between them");
  svg.append(text(pad.l, pad.t - 14, "each on its own", "chart-label-sm", "start"));
  aucs.forEach((a, i) => {
    const y = pad.t + i * 26;
    svg.append(el("line", { x1: X(a.auc - 1.96 * a.se), x2: X(a.auc + 1.96 * a.se), y1: y, y2: y,
      class: "ci-null" }));
    svg.append(el("circle", { cx: X(a.auc), cy: y, r: 4, class: `dot-${a.cls}` }));
    svg.append(text(pad.l - 10, y + 3, a.name, "chart-row-label", "end"));
    svg.append(text(X(a.auc), y - 9, dp(a.auc), "chart-coef"));
  });
  [lo + 0.01, (lo + hi) / 2, hi - 0.01].forEach((v) =>
    svg.append(text(X(v), pad.t + 66, dp(v, 2), "chart-label")));

  const mid = pad.t + 80;
  svg.append(el("line", { x1: 12, x2: W - 12, y1: mid, y2: mid, class: "chart-grid" }));

  const span = Math.max(0.06, Math.abs(c.ci[0]), Math.abs(c.ci[1])) * 1.2;
  const Xd = (v) => pad.l + ((v + span) / (2 * span)) * iw;
  const y = mid + 46;
  svg.append(text(pad.l, mid + 18, "paired, same applicants", "chart-label-sm", "start"));
  svg.append(el("line", { x1: Xd(0), x2: Xd(0), y1: mid + 24, y2: H - pad.b + 2, class: "chart-zero-strong" }));
  svg.append(el("line", { x1: Xd(c.ci[0]), x2: Xd(c.ci[1]), y1: y, y2: y,
    class: c.p < 0.05 ? "ci-sig" : "ci-null" }));
  svg.append(el("circle", { cx: Xd(c.difference), cy: y, r: 4.5,
    class: c.p < 0.05 ? "dot-sig" : "dot-null" }));
  svg.append(text(pad.l - 10, y + 3, "Difference", "chart-row-label", "end"));
  svg.append(text(Xd(c.difference), y - 10, signed(c.difference), "chart-coef"));
  [-span, 0, span].forEach((v) =>
    svg.append(text(Xd(v), H - 12, signed(v, 2), "chart-label")));
  host.replaceChildren(svg);

  const note = $("#delong-note");
  if (note) {
    const naive = Math.sqrt(r.metrics.logit.se ** 2 + r.metrics.gbm.se ** 2);
    note.textContent = (c.p < 0.05
      ? `The difference is ${signed(c.difference)}, 95% interval ${signed(c.ci[0])} to ${signed(c.ci[1])}, p = ${dp(c.p)}. On this split that is real. `
      : `The difference is ${signed(c.difference)}, 95% interval ${signed(c.ci[0])} to ${signed(c.ci[1])}, p = ${dp(c.p)}. The interval contains zero, so this split cannot separate them. `)
      + `The two sets of scores correlate at ${dp(c.correlation, 2)}, which is why the paired standard error `
      + `is ${dp(c.se, 3)} rather than the ${dp(naive, 3)} you get by treating the two AUCs as independent.`;
  }
}

function drawCv(cv) {
  const host = $("#cv-chart");
  if (!host || !cv) return;
  const W = 370;
  const H = 240;
  const pad = { t: 18, r: 16, b: 34, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const all = [...cv.logit.values, ...cv.gbm.values];
  const lo = Math.min(...all) - 0.02;
  const hi = Math.max(...all) + 0.02;
  const X = (i) => pad.l + ((i + 0.5) / cv.n) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / (hi - lo || 1)) * ih;

  const svg = chart(W, H, "Cross-validated AUC by fold");
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, dp(v, 2), "chart-label", "end"));
  }
  cv.logit.values.forEach((v, i) => {
    svg.append(el("line", { x1: X(i), x2: X(i), y1: Y(v), y2: Y(cv.gbm.values[i]), class: "dumbbell-link" }));
    svg.append(el("circle", { cx: X(i), cy: Y(v), r: 3.6, class: "dot-logit" }));
    svg.append(el("circle", { cx: X(i), cy: Y(cv.gbm.values[i]), r: 3.6, class: "dot-gbm" }));
    svg.append(text(X(i), H - 14, String(i + 1), "chart-label"));
  });
  svg.append(text(pad.l + iw / 2, H - 2, "fold", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#cv-note");
  if (note) {
    note.textContent = `Scorecard ${dp(cv.logit.mean)} ± ${dp(cv.logit.sd)}, boosted ${dp(cv.gbm.mean)} ± ${dp(cv.gbm.sd)}. `
      + `The boosted model wins ${cv.difference.wins} of ${cv.n} folds, by ${signed(cv.difference.mean)} on average, `
      + `and the spread across folds is ${dp(cv.gbm.sd)}, which is ${
        Math.abs(cv.difference.mean) < cv.gbm.sd ? "larger than the gap it is trying to measure" : "smaller than the gap"}.`;
  }
}

/* ------------------------------------------------------------
   7 · score distributions
   ------------------------------------------------------------ */
function drawDistribution(r) {
  const host = $("#dist-chart");
  if (!host) return;
  const scores = lead === "gbm" ? r.scores.gbm.test : r.scores.logit.test;
  const W = 760;
  const H = 200;
  const pad = { t: 14, r: 14, b: 30, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const bins = 20;
  const hi = Math.max(...scores, 0.8);
  const counts = [Array(bins).fill(0), Array(bins).fill(0)];
  scores.forEach((s, i) => {
    const b = Math.min(bins - 1, Math.floor((s / hi) * bins));
    counts[r.yTest[i]][b]++;
  });
  const totals = [counts[0].reduce((a, b) => a + b, 0), counts[1].reduce((a, b) => a + b, 0)];
  const share = counts.map((c, k) => c.map((v) => v / (totals[k] || 1)));
  const max = Math.max(...share.flat());
  const X = (b) => pad.l + (b / bins) * iw;
  const Y = (v) => pad.t + ih - (v / max) * ih;

  const svg = chart(W, H, "Score distribution by outcome");
  [0, 1].forEach((k) => {
    share[k].forEach((v, b) => {
      svg.append(el("rect", {
        x: X(b) + (k ? (iw / bins) / 2 : 0), y: Y(v),
        width: (iw / bins) / 2 - 1, height: Math.max(0, pad.t + ih - Y(v)),
        class: k ? "bar-bad" : "bar-good",
      }));
    });
  });
  const t = state.threshold;
  if (t < hi) {
    svg.append(el("line", { x1: pad.l + (t / hi) * iw, x2: pad.l + (t / hi) * iw,
      y1: pad.t, y2: pad.t + ih, class: "chart-crit" }));
    svg.append(text(pad.l + (t / hi) * iw, pad.t + 9, "cut-off", "chart-label-sm", "start"));
  }
  [0, 0.25, 0.5, 0.75, 1].forEach((f) =>
    svg.append(text(pad.l + f * iw, H - 12, pc(f * hi, 0), "chart-label")));
  svg.append(text(pad.l + iw / 2, H - 1, "estimated probability of default", "chart-label-sm"));
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   8 · cost, confusion, lift
   ------------------------------------------------------------ */
function drawCost(r) {
  const host = $("#cost-chart");
  if (!host) return;
  const W = 370;
  const H = 240;
  const pad = { t: 14, r: 14, b: 32, l: 48 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const curves = [["logit", r.cost.logit], ["gbm", r.cost.gbm]];
  const all = curves.flatMap(([, c]) => c.points.map((p) => p.costPerApplicant));
  const hi = Math.max(...all) * 1.05;
  const X = (v) => pad.l + v * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Expected cost against the cut-off");
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, dp(v, 2), "chart-label", "end"));
  }
  svg.append(el("line", { x1: X(1 / 6), x2: X(1 / 6), y1: pad.t, y2: pad.t + ih, class: "chart-crit" }));
  svg.append(text(X(1 / 6), pad.t + 9, "1/6", "chart-label-sm", "start"));

  curves.forEach(([k, c]) => {
    svg.append(path(c.points.map((p) => [X(p.threshold), Y(p.costPerApplicant)]), `line-${k}`));
    svg.append(el("circle", { cx: X(c.best.threshold), cy: Y(c.best.costPerApplicant), r: 3.4,
      class: `dot-${k}` }));
  });
  svg.append(el("line", { x1: X(state.threshold), x2: X(state.threshold),
    y1: pad.t, y2: pad.t + ih, class: "mark-scenario" }));

  [0, 0.25, 0.5, 0.75, 1].forEach((f) =>
    svg.append(text(X(f), H - 12, pc(f, 0), "chart-label")));
  svg.append(text(pad.l + iw / 2, H - 1, "decline above this PD", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#cost-note");
  if (note) {
    const best = lead === "gbm" ? r.cost.gbm.best : r.cost.logit.best;
    note.textContent = `The cheapest cut-off for the ${lead === "gbm" ? "boosted model" : "scorecard"} `
      + `on these applicants is ${pc(best.threshold, 0)}, against the ${pc(1 / 6, 1)} the cost matrix implies. `
      + "The curve is nearly flat around its minimum, which is why an empirical optimum found on 300 "
      + "applicants wanders and why the arithmetic is the better guide.";
  }
}

function drawConfusion(r, conf) {
  const host = $("#confusion");
  if (!host) return;
  const cells = [
    { label: "Approved, and repaid", v: conf.tn, tone: "good" },
    { label: "Declined, would have repaid", v: conf.fp, tone: "warn" },
    { label: "Approved, and defaulted", v: conf.fn, tone: "bad" },
    { label: "Declined, would have defaulted", v: conf.tp, tone: "good" },
  ];
  host.replaceChildren(...cells.map((c) => {
    const box = document.createElement("div");
    box.className = "conf-cell";
    box.dataset.tone = c.tone;
    const n = document.createElement("strong");
    n.textContent = num(c.v);
    const l = document.createElement("span");
    l.textContent = c.label;
    box.append(n, l);
    return box;
  }));

  const label = $("#conf-label");
  if (label) label.textContent = `${lead === "gbm" ? "boosted" : "scorecard"}, cut-off ${pc(state.threshold, 0)}`;
  const note = $("#conf-note");
  if (note) {
    note.textContent = `${num(conf.fn)} bad loans approved at 5 apiece and ${num(conf.fp)} good applicants `
      + `turned away at 1 gives ${num(conf.cost)}, or ${dp(conf.costPerApplicant, 2)} per applicant. `
      + `Approving everybody would cost ${num(r.yTest.filter((y) => y === 1).length * 5)}; `
      + `declining everybody, ${num(r.yTest.filter((y) => y === 0).length)}.`;
  }
}

function buildLift(r) {
  const host = $("#lift-table");
  if (!host) return;
  const rows = lead === "gbm" ? r.lift.gbm : r.lift.logit;
  const table = document.createElement("table");
  table.className = "fin-table";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Band", "Applicants", "Defaults", "Default rate", "Lift", "Defaults caught"].forEach((h, i) => {
    const th = document.createElement("th");
    th.textContent = h;
    if (i) th.className = "col-forecast";
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);
  const tbody = document.createElement("tbody");
  rows.forEach((b) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = `${b.band}${b.band === 1 ? " (worst)" : b.band === rows.length ? " (best)" : ""}`;
    tr.append(th);
    [num(b.n), num(b.bad), pc(b.badRate, 0), `${dp(b.lift, 2)}×`, pc(b.cumulativeBadShare, 0)]
      .forEach((v) => tr.append(td(v)));
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);
}

/* ------------------------------------------------------------
   9 · calibration
   ------------------------------------------------------------ */
function drawCalibration(r) {
  const host = $("#calib-chart");
  if (!host) return;
  const W = 760;
  const H = 300;
  const pad = { t: 14, r: 16, b: 34, l: 50 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const sets = [
    ["uncalibrated", r.calibration.uncalibrated, "line-uncal", "dot-uncal"],
    ["calibrated", r.calibration.gbm, "line-cal", "dot-cal"],
  ];
  const hi = Math.max(0.6, ...sets.flatMap(([, c]) => c.bins.flatMap((b) => [b.predicted, b.observed])));
  const X = (v) => pad.l + (v / hi) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Reliability diagram");
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
    svg.append(text(X(v), H - 14, pc(v, 0), "chart-label"));
  }
  svg.append(el("line", { x1: X(0), y1: Y(0), x2: X(hi), y2: Y(hi), class: "chart-diagonal" }));

  sets.forEach(([, c, lineCls, dotCls]) => {
    svg.append(path(c.bins.map((b) => [X(b.predicted), Y(b.observed)]), lineCls));
    c.bins.forEach((b) =>
      svg.append(el("circle", { cx: X(b.predicted), cy: Y(b.observed), r: 3.2, class: dotCls })));
  });

  svg.append(text(pad.l + iw / 2, H - 2, "what the model said", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#calib-note");
  if (note) {
    const c = r.calibration;
    note.textContent = `Reliability, the part of the Brier score that measures distance from the `
      + `diagonal, falls from ${dp(c.uncalibrated.reliability, 4)} to ${dp(c.gbm.reliability, 4)} once the `
      + `mapping is applied, and the Brier score from ${dp(c.uncalibrated.brier)} to ${dp(c.gbm.brier)}. `
      + `AUC does not move at all, because nobody changed places. The scorecard needs none of this: `
      + `fitted by maximum likelihood on the log odds, it comes out calibrated, at ${dp(c.logit.reliability, 4)}.`;
  }
}

/* ------------------------------------------------------------
   10 · explaining one applicant
   ------------------------------------------------------------ */
function buildApplicantBar(r) {
  const host = $("#applicant-bar");
  if (!host || host.dataset.built) return;
  host.dataset.built = "1";
  const mk = (label, fn) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = label;
    b.addEventListener("click", () => {
      const f = fit();
      const idx = fn(f);
      if (idx >= 0) { applicant = idx; render(); }
    });
    return b;
  };
  host.replaceChildren(
    mk("The riskiest applicant", (f) =>
      f.scores.logit.test.indexOf(Math.max(...f.scores.logit.test))),
    mk("The safest", (f) => f.scores.logit.test.indexOf(Math.min(...f.scores.logit.test))),
    mk("Where the models disagree most", (f) => {
      let best = 0;
      let gap = -1;
      f.scores.logit.test.forEach((v, i) => {
        const d = Math.abs(v - f.scores.gbm.test[i]);
        if (d > gap) { gap = d; best = i; }
      });
      return best;
    }),
    mk("A default the models missed", (f) => {
      let best = -1;
      let low = 2;
      f.yTest.forEach((y, i) => {
        if (y === 1 && f.scores.logit.test[i] < low) { low = f.scores.logit.test[i]; best = i; }
      });
      return best;
    }),
    mk("Someone else", () => Math.floor(Math.random() * 300)),
  );
}

/* Attribute names run to forty characters and the label column
   is a hundred and seventy pixels wide, so they are trimmed to
   what fits and the full name goes in a title the pointer can
   find. Letting them overflow put "l account, or credits
   elsewhere" on the page, which is worse than an ellipsis. */
const fitLabel = (s, max = 26) => (s.length <= max ? s : `${s.slice(0, max - 1)}…`);

function drawContributions(host, rows, { unit }) {
  if (!host) return;
  const W = 370;
  const rowH = 20;
  const H = rows.length * rowH + 42;
  const pad = { t: 26, r: 60, b: 8, l: 176 };
  const iw = W - pad.l - pad.r;
  const max = Math.max(...rows.map((x) => Math.abs(x.value)), 1e-9);
  const X = (v) => pad.l + ((v + max) / (2 * max)) * iw;

  const svg = chart(W, H, "Contributions to this applicant's score");
  svg.append(el("line", { x1: X(0), x2: X(0), y1: pad.t - 8, y2: H - pad.b, class: "chart-zero-strong" }));
  svg.append(text(pad.l, pad.t - 12, "safer", "chart-label-sm", "start"));
  svg.append(text(W - pad.r, pad.t - 12, "riskier", "chart-label-sm", "end"));

  rows.forEach((x, i) => {
    const y = pad.t + i * rowH;
    const w = Math.abs(X(x.value) - X(0));
    svg.append(el("rect", {
      x: Math.min(X(0), X(x.value)), y: y + 3, width: Math.max(1, w), height: rowH - 8,
      class: x.value > 0 ? "bar-worse" : "bar-better",
    }));
    const label = text(pad.l - 8, y + rowH / 2 + 2, fitLabel(x.name), "chart-row-label", "end");
    const title = document.createElementNS(NS, "title");
    title.textContent = x.name;
    label.append(title);
    svg.append(label);
    svg.append(text(W - pad.r + 5, y + rowH / 2 + 2,
      unit === "points" ? signed(-x.value, 0) : signed(x.value, 2), "chart-coef", "start"));
  });
  host.replaceChildren(svg);
}

function drawExplanations(r) {
  const idx = Math.min(applicant, r.test.length - 1);
  const row = r.test[idx];
  const scaling = pointsScaling();

  // the scorecard, in points
  const xScaled = applyScaler([r.logitCols.map((j) => featureValue(r.features[j], row))], r.scaler)[0];
  const pts = scorePoints(r.logit, xScaled, scaling);
  const logitRows = r.logitCols.map((col, j) => ({
    name: r.features[col].short ?? r.features[col].name,
    value: -(pts.per[j] - scaling.offset / r.logitCols.length),
    raw: featureValue(r.features[col], row),
  })).filter((x) => Math.abs(x.value) > 0.5)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 8);
  drawContributions($("#explain-logit"), logitRows, { unit: "points" });

  // the boosted model, in log odds
  const xRaw = r.features.map((f) => featureValue(f, row));
  const ex = r.gbm.explain(xRaw);
  const gbmRows = ex.contributions.map((v, j) => ({
    name: r.features[j].short ?? r.features[j].name, value: v,
  })).filter((x) => Math.abs(x.value) > 1e-6)
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value)).slice(0, 8);
  drawContributions($("#explain-gbm"), gbmRows, { unit: "logodds" });

  const pLogit = r.scores.logit.test[idx];
  const pGbm = r.scores.gbm.test[idx];
  const outcome = r.yTest[idx] === 1 ? "defaulted" : "repaid";
  const lab = $("#applicant-logit");
  if (lab) lab.textContent = `PD ${pc(pLogit, 1)} · score ${num(pts.total)} points`;
  const lab2 = $("#applicant-gbm");
  if (lab2) lab2.textContent = `PD ${pc(pGbm, 1)}`;

  const note = $("#explain-note");
  if (note) {
    note.textContent = `Applicant ${idx + 1} of ${r.test.length} in the held-out set, and this one ${outcome}. `
      + `The scorecard says ${pc(pLogit, 1)}, the boosted model ${pc(pGbm, 1)}, and at your cut-off of `
      + `${pc(state.threshold, 0)} they would be ${pLogit >= state.threshold ? "declined" : "approved"} and `
      + `${pGbm >= state.threshold ? "declined" : "approved"} respectively. `
      + "The scorecard's bars are points off a 600-point score; the boosted model's are log odds. Both sets "
      + "add up exactly to their model's answer, which is what makes them reasons rather than illustrations.";
  }
}

/* ------------------------------------------------------------
   11 · fairness
   ------------------------------------------------------------ */
function buildGroupPicker() {
  const host = $("#group-picker");
  if (!host || host.dataset.built) return;
  host.dataset.built = "1";
  host.replaceChildren(...Object.entries(GROUPS).map(([key, g]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.group = key;
    b.textContent = g.name;
    b.addEventListener("click", () => { groupKey = key; render(); });
    return b;
  }));
}

function drawFairness(r) {
  const host = $("#fair-chart");
  if (!host) return;
  $$("[data-group]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.group === groupKey)));

  const scores = lead === "gbm" ? r.scores.gbm.test : r.scores.logit.test;
  const f = fairness(r.test, scores, state.threshold, groupKey);
  const label = $("#fair-label");
  if (label) label.textContent = f.group;

  const W = 760;
  const rowH = 42;
  const pad = { t: 18, r: 150, b: 14, l: 150 };
  const H = pad.t + f.stats.length * rowH + pad.b;
  const iw = W - pad.l - pad.r;

  const svg = chart(W, H, "Approval rate by group");
  f.stats.forEach((s, i) => {
    const y = pad.t + i * rowH;
    svg.append(el("rect", {
      x: pad.l, y: y + 6, width: Math.max(1, s.approvalRate * iw), height: rowH - 20,
      class: "bar-approval",
    }));
    svg.append(text(pad.l - 8, y + (rowH - 8) / 2, `${s.level}`, "chart-row-label", "end"));
    svg.append(text(pad.l - 8, y + (rowH - 8) / 2 + 13, `${s.n} applicants`, "chart-label-sm", "end"));
    svg.append(text(pad.l + s.approvalRate * iw + 6, y + (rowH - 8) / 2 + 4,
      `${pc(s.approvalRate, 0)} approved · ${pc(s.badRate, 0)} defaulted`, "chart-coef", "start"));
  });
  host.replaceChildren(svg);

  const note = $("#fair-note");
  if (note) {
    note.textContent = `The lower approval rate is ${dp(f.ratio, 2)} of the higher, which `
      + `${f.passesFourFifths ? "clears" : "fails"} the four-fifths screen. `
      + `Observed default rates in these groups are ${f.stats.map((s) => pc(s.badRate, 0)).join(" and ")}, `
      + `so part of the gap is risk and part of it may not be. `
      + (state.useProtected
        ? "The model is currently allowed to use the protected attributes: turn that off in the inputs and watch how little moves."
        : "The protected attributes are currently excluded, and the gap that remains is what the other fifty columns rebuilt on their own.");
  }
}

/* ------------------------------------------------------------
   12 · tables and facts
   ------------------------------------------------------------ */
function buildDataFacts() {
  const host = $("#data-facts");
  if (!host || host.dataset.built) return;
  host.dataset.built = "1";
  const facts = [
    ["Applications", `${num(CHECKS.rows)}, of which ${num(CHECKS.bad)} went bad: a ${pc(CHECKS.bad / CHECKS.rows, 0)} default rate that no real book has, and a sign this is a teaching set rather than a portfolio.`],
    ["Attributes", `${SCHEMA.length}: ${SCHEMA.filter((c) => c.type === "num").length} numeric, ${SCHEMA.filter((c) => c.type === "cat").length} categorical, becoming ${designMatrix([ROWS[0]])[0].length} columns once encoded.`],
    ["Missing values", "None, which is itself unusual enough to be worth saying out loud. Real applications arrive with holes in them, and how those holes are filled is often worth more accuracy than the choice of model."],
    ["Documented but absent", `The codebook lists a loan purpose of "vacation" and a personal status of "female, single". Neither appears in a single row, so neither gets a column. The source is itself unsure about the first, its note reads "(vacation - does not exist?)".`],
    ["Currency and era", "Deutsche Marks, collected before 1994. The amounts, the thresholds and the attitudes to credit are all of their time."],
    ["Cost matrix", `Shipped with the data: lending to a bad applicant costs ${SOURCE.costMatrix.falseGood}, turning away a good one costs ${SOURCE.costMatrix.falseBad}. It is the only reason this page can talk about the cut-off as arithmetic rather than taste.`],
  ];
  host.replaceChildren(...facts.map(([k, v]) => {
    const row = document.createElement("div");
    row.className = "row";
    const key = document.createElement("span");
    key.className = "k mono";
    key.textContent = k;
    const val = document.createElement("span");
    val.className = "v";
    val.textContent = v;
    row.append(key, val);
    return row;
  }));
}

function buildPointsTable(r) {
  const host = $("#points-table");
  if (!host) return;
  const scaling = pointsScaling();
  const terms = r.logitCols.map((col, j) => ({
    feature: r.features[col],
    beta: r.logit.beta[j + 1],
    se: r.logit.se[j + 1],
    p: r.logit.p[j + 1],
    /* Points per standard deviation for a numeric column, and
       for a dummy the points of having it rather than the
       reference level. Both come out of the same scaling. */
    points: -scaling.factor * r.logit.beta[j + 1] / (r.scaler.sd[j] || 1)
      * (r.features[col].kind === "num" ? r.scaler.sd[j] : 1),
  })).sort((a, b) => Math.abs(b.beta / b.se) - Math.abs(a.beta / a.se)).slice(0, 12);

  const table = document.createElement("table");
  table.className = "fin-table";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Term", "Coefficient", "Std error", "z", "p", "Points"].forEach((h, i) => {
    const th = document.createElement("th");
    th.textContent = h;
    if (i) th.className = "col-forecast";
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);
  const tbody = document.createElement("tbody");
  terms.forEach((t) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = (t.feature.short ?? t.feature.name) + (t.feature.protectedAttr ? " ◆" : "");
    tr.append(th);
    [signed(t.beta, 3), dp(t.se, 3), dp(t.beta / t.se, 2), dp(t.p, 3), signed(t.points, 0)]
      .forEach((v, i) => tr.append(td(v, i === 3 && t.p < 0.05 ? "is-positive" : undefined)));
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);
}

/* ------------------------------------------------------------
   render
   ------------------------------------------------------------ */
function render() {
  const r = fit();
  paintControls();
  writeUrl();

  $$("[data-model]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.model === lead)));
  $("#use-protected")?.setAttribute("aria-pressed", String(state.useProtected));
  $("#use-protected") && ($("#use-protected").textContent = state.useProtected ? "Included" : "Excluded");
  $("#calibrate")?.setAttribute("aria-pressed", String(state.calibrate));
  $("#calibrate") && ($("#calibrate").textContent = state.calibrate ? "Recalibrated" : "Raw");

  const blurb = $("#model-blurb");
  if (blurb) {
    blurb.textContent = lead === "logit"
      ? "The scorecard leads: the tables, the lift bands and the decision below are its numbers."
      : "The boosted model leads: same tables, its numbers.";
  }

  const reset = $("#reset-drivers");
  if (reset) {
    reset.hidden = edited.size === 0;
    reset.textContent = `Reset ${edited.size} edited input${edited.size === 1 ? "" : "s"}`;
  }

  /* Threshold-dependent numbers are recomputed here rather than
     inside the fit, which is what lets the cut-off slider run at
     sixty frames a second while the models stay put. */
  const scores = lead === "gbm" ? r.scores.gbm.test : r.scores.logit.test;
  const conf = confusion(r.yTest, scores, state.threshold);

  const c = r.compare;
  const verdict = $("#verdict");
  if (verdict) {
    const inconclusive = c.ci[0] < 0 && c.ci[1] > 0;
    verdict.dataset.state = inconclusive ? "down" : c.difference > 0 ? "up" : "bad";
    $(".verdict-value", verdict).textContent = signed(c.difference);
    $(".verdict-detail", verdict).textContent = inconclusive
      ? `95% interval ${signed(c.ci[0])} to ${signed(c.ci[1])}, p = ${dp(c.p)}. The interval contains zero: `
        + `on ${r.test.length} held-out applicants this split cannot tell the two models apart. `
        + "Drag the split seed and watch which one is ahead change."
      : `95% interval ${signed(c.ci[0])} to ${signed(c.ci[1])}, p = ${dp(c.p)}. `
        + `On this split the ${c.difference > 0 ? "boosted model" : "scorecard"} is genuinely ahead. `
        + "The folds below are the check on whether that survives a different split.";
  }

  const tiles = {
    "auc-logit": dp(r.metrics.logit.auc),
    "auc-gbm": dp(r.metrics.gbm.auc),
    ks: dp(lead === "gbm" ? r.metrics.gbm.ks : r.metrics.logit.ks),
    cost: dp(conf.costPerApplicant, 2),
    approval: pc(conf.approvalRate, 0),
    brier: dp(lead === "gbm" ? r.metrics.gbm.brier : r.metrics.logit.brier),
  };
  Object.entries(tiles).forEach(([k, v]) => {
    const node = $(`[data-tile="${k}"] .tile-value`);
    if (node) node.textContent = v;
  });
  const testN = $("#test-n");
  if (testN) testN.textContent = num(r.test.length);
  const better = r.metrics.gbm.auc > r.metrics.logit.auc ? "auc-gbm" : "auc-logit";
  $$("[data-tile^='auc-']").forEach((t) =>
    t.dataset.tone = t.dataset.tile === better ? "good" : "");

  drawRoc(r);
  drawScatter(r);
  drawIv(r);
  drawCoefficients(r);
  buildPointsTable(r);
  drawCurve(r);
  drawDelong(r);
  drawDistribution(r);
  drawCost(r);
  drawConfusion(r, conf);
  buildLift(r);
  drawCalibration(r);
  drawExplanations(r);
  drawFairness(r);

  const power = $("#power-note");
  if (power) {
    power.textContent = `A thousand rows, three hundred of them defaults, measured on a test set of `
      + `${r.test.length}. The standard error of a single AUC here is about ${dp(r.metrics.logit.se, 3)}, `
      + `and the paired standard error of the difference between the two models is ${dp(c.se, 3)}. `
      + `To call a difference of ${dp(Math.abs(c.difference))} significant at that precision you would need `
      + `roughly ${num(Math.ceil((1.96 * c.se / Math.max(1e-6, Math.abs(c.difference))) ** 2 * r.test.length))} `
      + "held-out applicants rather than " + num(r.test.length) + ". That is the whole finding, and it is "
      + "why the answer to \"which model is better\" on a dataset this size is usually \"the one you can explain\".";
  }

  scheduleHeavy();
}

/* ------------------------------------------------------------
   the expensive half
   ------------------------------------------------------------ */
let pending = null;
const idle = window.requestIdleCallback
  ? (fn) => window.requestIdleCallback(fn, { timeout: 600 })
  : (fn) => setTimeout(fn, 80);
const cancelIdle = window.cancelIdleCallback
  ? (id) => window.cancelIdleCallback(id)
  : (id) => clearTimeout(id);

let cvKey = null;
function scheduleHeavy() {
  if (pending !== null) cancelIdle(pending);
  if (cvKey === fitKey()) return;
  $("#cv-chart")?.setAttribute("data-stale", "1");
  pending = idle(() => {
    pending = null;
    const key = fitKey();
    const cv = crossValidate(state, undefined, { k: 5, repeats: 1 });
    cvKey = key;
    drawCv(cv);
    $("#cv-chart")?.removeAttribute("data-stale");
  });
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#pd")) return;

  const name = $("#data-name");
  if (name) name.textContent = SOURCE.name;
  const meta = $("#data-meta");
  if (meta) {
    meta.textContent = `${num(CHECKS.rows)} applications · ${SCHEMA.length} attributes · `
      + `${pc(CHECKS.bad / CHECKS.rows, 0)} bad · ${SOURCE.licence}`;
  }
  const note = $("#data-note");
  if (note) {
    note.textContent = `${SOURCE.author} (${SOURCE.year}), ${SOURCE.name}, ${SOURCE.publisher}. `
      + "Downloaded by a script in this repository, checksummed, and checked against column totals "
      + "by the test file. Everything on this page is fitted in your browser from that file.";
  }
  const attribution = $("#attribution");
  if (attribution) {
    attribution.textContent = `Data: ${SOURCE.author} (${SOURCE.year}). ${SOURCE.name}. `
      + `${SOURCE.publisher}, ${SOURCE.doi}, licensed ${SOURCE.licence}. `
      + "This page is a demonstration of method on a public teaching dataset from before 1994. It is not "
      + "a credit policy, not a model anyone should lend against, and not advice. What transfers is the "
      + "pipeline: the same steps, the same tests and the same questions, on a book that is actually yours.";
  }

  buildControls();
  buildDataFacts();
  buildGroupPicker();
  buildApplicantBar();
  readUrl();

  $$("[data-model]").forEach((b) => b.addEventListener("click", () => {
    lead = b.dataset.model;
    render();
  }));
  $("#use-protected")?.addEventListener("click", () => {
    state.useProtected = !state.useProtected;
    render();
  });
  $("#calibrate")?.addEventListener("click", () => {
    state.calibrate = !state.calibrate;
    render();
  });
  $("#reset-drivers")?.addEventListener("click", () => {
    DRIVERS.forEach((d) => { state[d.key] = DEFAULTS[d.key]; });
    edited.clear();
    render();
  });

  $("#download-csv")?.addEventListener("click", () => {
    const blob = new Blob([toCsv(state)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pd-model-seed-${state.seed}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $("#copy-link")?.addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(location.href);
      const b = e.currentTarget;
      const was = b.textContent;
      b.textContent = "Link copied";
      setTimeout(() => (b.textContent = was), 1800);
    } catch { /* the URL bar already has it */ }
  });

  const toc = $("#page-toc");
  if (toc) {
    const marks = $$("[data-toc]");
    const list = document.createElement("ol");
    marks.forEach((m) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${m.id}`;
      a.textContent = m.dataset.toc;
      li.append(a);
      list.append(li);
    });
    toc.replaceChildren(list);
    if ("IntersectionObserver" in window) {
      const links = new Map($$("a", toc).map((a) => [a.getAttribute("href").slice(1), a]));
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const a = links.get(e.target.id);
          if (a && e.isIntersecting) {
            links.forEach((x) => x.removeAttribute("aria-current"));
            a.setAttribute("aria-current", "true");
          }
        });
      }, { rootMargin: "-20% 0px -70% 0px" });
      marks.forEach((m) => io.observe(m));
    }
  }

  render();
}

init();
