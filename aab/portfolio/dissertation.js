/* dissertation.js: nine exhibits over one piece of research.
   Charts are hand-drawn inline SVG, like everywhere else here:
   they inherit the theme's colours and need no library. */

import {
  UNIVARIATE, REGRESSIONS, SPEC_ORDER, FACTORS, IVOL, MDD, SAMPLE,
  EVIDENCE, FINDING_LABELS, REFERENCES, STUDY,
  UKX, UKX_FROM, MIGB, MIGB_FROM,
  DD_CONVENTIONAL, DD_ISLAMIC, DD_FROM,
  FUND_SD, EXCESS_HIST, EXCESS_STATS,
} from "/portfolio/dissertation.data.js";

import {
  welch, power, minDetectable, stars, rebase, boxStats, tQuantile,
  rebin, normalOverlay, monthLabel, cagrMonthly, volMonthly, maxDrawdown,
} from "/portfolio/dissertation.model.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

const num = (v, d = 4) =>
  Number.isFinite(v) ? v.toFixed(d) : "–";
const pc = (v, d = 1) =>
  Number.isFinite(v) ? `${(v * 100).toFixed(d)}%` : "–";
const signedPc = (v, d = 1) =>
  Number.isFinite(v) ? `${v >= 0 ? "+" : ""}${(v * 100).toFixed(d)}%` : "–";

/** p-values: exact where it matters, scientific where it doesn't. */
function fmtP(p) {
  if (!Number.isFinite(p)) return "–";
  if (p === 0 || p < 1e-16) return "< 1e-16";
  if (p < 0.001) return p.toExponential(2).replace("e-", " × 10⁻");
  return p.toFixed(4);
}

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
const line = (x1, y1, x2, y2, cls) =>
  el("line", { x1, y1, x2, y2, class: cls });

/** Year ticks from a monthly series that starts at `from`. */
function monthTicks(from, count, max = 8) {
  const [y0, m0] = from.split("-").map(Number);
  const out = [];
  for (let i = 0; i < count; i++) {
    const total = m0 - 1 + i;
    if (total % 12 === 0) out.push([String(y0 + Math.floor(total / 12)), i]);
  }
  const stride = Math.max(1, Math.ceil(out.length / max));
  return out.filter((_, i) => i % stride === 0);
}

/* ------------------------------------------------------------
   1 · the two indices over the sample window
   ------------------------------------------------------------ */
function drawIndices(host, { rebased }) {
  const W = 760;
  const H = 260;
  const pad = { t: 14, r: 54, b: 26, l: 50 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  // MIGB starts a month later; pad it so both sit on one time axis
  const a = rebased ? rebase(UKX) : UKX;
  const bRaw = rebased ? rebase(MIGB) : MIGB;
  const b = [null, ...bRaw];

  const all = [...a, ...b].filter((v) => Number.isFinite(v));
  const lo = rebased ? Math.min(...all) : 0;
  const hi = Math.max(...all);
  const span = hi - lo || 1;
  const X = (i) => pad.l + (i / (UKX.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / span) * ih;

  const svg = chart(W, H, "FTSE 100 and the Islamic index over the sample window");

  for (let g = 0; g <= 4; g++) {
    const v = lo + (span * g) / 4;
    svg.append(line(pad.l, Y(v), W - pad.r, Y(v), "chart-grid"));
    svg.append(text(pad.l - 6, Y(v) + 3, n0.format(v), "chart-label", "end"));
  }

  const path = (vals, cls) => {
    let d = "";
    let started = false;
    vals.forEach((v, i) => {
      if (!Number.isFinite(v)) return;
      d += `${started ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`;
      started = true;
    });
    if (d) svg.append(el("path", { d, class: cls, fill: "none" }));
  };
  path(a, "line-conventional");
  path(b, "line-islamic");

  // end labels, so the chart reads without a legend lookup
  const lastA = a[a.length - 1];
  const lastB = b[b.length - 1];
  svg.append(text(W - pad.r + 4, Y(lastA) + 3, "FTSE 100", "chart-tag-conv", "start"));
  svg.append(text(W - pad.r + 4, Y(lastB) + 3, "Islamic", "chart-tag-isl", "start"));

  monthTicks(UKX_FROM, UKX.length).forEach(([y, i]) =>
    svg.append(text(X(i), H - 8, y, "chart-label")));

  // COVID, marked once: it is the only event both series share
  const covid = 26; // March 2020, counting from Jan 2018
  svg.append(line(X(covid), pad.t, X(covid), pad.t + ih, "chart-event"));
  svg.append(text(X(covid) + 4, pad.t + 10, "Mar 2020", "chart-label-sm", "start"));

  host.replaceChildren(svg);

  const stat = (arr) =>
    `${signedPc(cagrMonthly(arr))} a year · ${pc(volMonthly(arr))} volatility · ${pc(maxDrawdown(arr))} worst fall`;
  const note = $("#index-readout");
  if (note) {
    note.textContent =
      `Over the same 91 months the FTSE 100 returned ${stat(UKX)}. ` +
      `The Islamic index returned ${stat(MIGB)}. ` +
      `Both are the benchmark environment the funds were operating in, not the funds themselves.`;
  }
}

/* ------------------------------------------------------------
   2 · the sample, drawn as what it is
   ------------------------------------------------------------ */
function drawSample(host) {
  const total = SAMPLE.funds.total;
  const cols = 20;
  const rows = Math.ceil(total / cols);
  const r = 5;
  const gap = 15;
  const W = cols * gap + 20;
  const H = rows * gap + 26;

  const svg = chart(W, H, `${total} funds, of which ${SAMPLE.funds.islamic} are Shariah-compliant`);
  for (let i = 0; i < total; i++) {
    const isIslamic = i < SAMPLE.funds.islamic;
    svg.append(el("circle", {
      cx: 12 + (i % cols) * gap,
      cy: 12 + Math.floor(i / cols) * gap,
      r: isIslamic ? r + 1.5 : r,
      class: isIslamic ? "dot-islamic" : "dot-conventional",
    }));
  }
  svg.append(text(12, H - 4,
    `${SAMPLE.funds.islamic} Islamic  ·  ${SAMPLE.funds.conventional} conventional`,
    "chart-label", "start"));
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   3 · the excess-return column
   ------------------------------------------------------------ */
function drawExcess(host, { logScale, factor }) {
  const W = 760;
  const H = 250;
  const pad = { t: 14, r: 10, b: 30, l: 52 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const bins = rebin(EXCESS_HIST, { factor });
  const normal = normalOverlay(bins, {
    mean: EXCESS_STATS.mean, sd: EXCESS_STATS.sd, n: EXCESS_STATS.n,
  });

  const raw = Math.max(...bins.map((b) => b.count), ...normal.map((b) => b.count));
  const scale = (v) => (logScale ? Math.log10(1 + v) : v);
  const hi = scale(raw) || 1;

  const X = (v) => pad.l + ((v - bins[0].from) / (bins[bins.length - 1].to - bins[0].from)) * iw;
  const Y = (v) => pad.t + ih - (scale(v) / hi) * ih;

  const svg = chart(W, H, "Distribution of monthly fund excess returns");

  for (let g = 0; g <= 4; g++) {
    const y = pad.t + ih - (ih * g) / 4;
    const v = logScale ? 10 ** ((hi * g) / 4) - 1 : (raw * g) / 4;
    svg.append(line(pad.l, y, W - pad.r, y, "chart-grid"));
    svg.append(text(pad.l - 6, y + 3, n0.format(v), "chart-label", "end"));
  }

  const bw = X(bins[0].to) - X(bins[0].from);
  bins.forEach((b) => {
    if (!b.count) return;
    svg.append(el("rect", {
      x: X(b.from) + 0.5, y: Y(b.count),
      width: Math.max(1, bw - 1),
      height: Math.max(0, pad.t + ih - Y(b.count)),
      class: "bar-hist",
    }));
  });

  const d = normal
    .filter((p) => p.count > 0.02)
    .map((p, i) => `${i ? "L" : "M"}${X(p.mid).toFixed(1)},${Y(p.count).toFixed(1)}`)
    .join(" ");
  if (d) svg.append(el("path", { d, class: "line-normal", fill: "none" }));

  // zero, and the sample mean: the gap between them is the story
  svg.append(line(X(0), pad.t, X(0), pad.t + ih, "chart-event"));
  svg.append(text(X(0) + 4, pad.t + 10, "zero", "chart-label-sm", "start"));
  svg.append(line(X(EXCESS_STATS.mean), pad.t, X(EXCESS_STATS.mean), pad.t + ih, "chart-mean"));
  svg.append(text(X(EXCESS_STATS.mean) - 4, pad.t + 10, "mean", "chart-label-sm", "end"));

  [-0.3, -0.2, -0.1, 0, 0.1, 0.2].forEach((v) => {
    if (v < bins[0].from || v > bins[bins.length - 1].to) return;
    svg.append(text(X(v), H - 10, `${(v * 100).toFixed(0)}%`, "chart-label"));
  });

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   4 · the univariate comparison, as dumbbells
   ------------------------------------------------------------ */
function drawDumbbells(host, alpha) {
  const W = 760;
  const rowH = 56;
  const pad = { t: 10, r: 118, b: 14, l: 200 };
  const H = pad.t + pad.b + UNIVARIATE.length * rowH;
  const iw = W - pad.l - pad.r;

  const svg = chart(W, H, "Islamic and conventional group means, with p-values");

  UNIVARIATE.forEach((row, i) => {
    const cy = pad.t + i * rowH + rowH / 2 - 6;
    // each metric gets its own axis: the scales have nothing in common
    const lo = Math.min(row.islamic, row.conventional);
    const hi = Math.max(row.islamic, row.conventional);
    const padding = Math.max((hi - lo) * 1.6, Math.abs(hi) * 0.04, 1e-6);
    const from = lo - padding;
    const to = hi + padding;
    const X = (v) => pad.l + ((v - from) / (to - from)) * iw;

    svg.append(text(pad.l - 12, cy + 4, row.label, "chart-row-label", "end"));
    svg.append(line(pad.l, cy, pad.l + iw, cy, "chart-grid"));
    svg.append(line(X(row.conventional), cy, X(row.islamic), cy, "dumbbell-link"));
    svg.append(el("circle", { cx: X(row.conventional), cy, r: 6, class: "dot-conventional" }));
    svg.append(el("circle", { cx: X(row.islamic), cy, r: 6, class: "dot-islamic" }));

    svg.append(text(X(row.conventional), cy + 20, num(row.conventional, row.dp), "chart-label-conv"));
    svg.append(text(X(row.islamic), cy - 12, num(row.islamic, row.dp), "chart-label-isl"));

    const sig = row.p < alpha;
    svg.append(text(W - pad.r + 10, cy + 4,
      `p = ${row.p.toFixed(4)}`, sig ? "chart-p-sig" : "chart-p", "start"));
    svg.append(text(W - pad.r + 10, cy + 17,
      sig ? "different" : "not distinguishable", "chart-label-sm", "start"));
  });

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   5 · the factor loadings, as a forest plot
   ------------------------------------------------------------ */
const STYLE_ROWS = ["alpha", "smb", "hml", "rmw", "cma", "mom", "islamic"];

function drawForest(host, { spec, alpha, tView }) {
  const model = REGRESSIONS[spec];
  const rows = STYLE_ROWS
    .map((name) => model.coefs.find((c) => c.name === name))
    .filter(Boolean);

  const W = 760;
  const rowH = 42;
  const pad = { t: 26, r: 150, b: 28, l: 170 };
  const H = pad.t + pad.b + rows.length * rowH;
  const iw = W - pad.l - pad.r;

  /* t-view puts everything on one scale a reader already knows;
     coefficient view keeps the units the model was estimated in.
     Dividing the coefficient interval by its own standard error
     is what turns b ± t*·se into t ± t*, so the two views are the
     same interval seen twice. */
  const tCrit = tQuantile(0.975, model.dfDen);
  const value = (c) => (tView ? c.t : c.b);
  const bounds = (c) => (tView ? [c.t - tCrit, c.t + tCrit] : [c.lo, c.hi]);

  const extent = Math.max(
    ...rows.flatMap((c) => bounds(c).map(Math.abs)),
    tView ? 3 : 0.002
  ) * 1.12;
  const X = (v) => pad.l + ((v + extent) / (2 * extent)) * iw;

  const svg = chart(W, H, `Factor loadings, ${model.label}`);

  // the reference lines: zero always, plus the critical t values
  if (tView) {
    [-2.576, -1.96, 1.96, 2.576].forEach((t) => {
      svg.append(line(X(t), pad.t - 8, X(t), H - pad.b + 4, "chart-crit"));
      svg.append(text(X(t), pad.t - 12, t > 0 ? `+${t}` : `${t}`, "chart-label-sm"));
    });
  }
  svg.append(line(X(0), pad.t - 8, X(0), H - pad.b + 4, "chart-zero-strong"));
  svg.append(text(X(0), pad.t - 12, tView ? "0" : "no effect", "chart-label-sm"));

  rows.forEach((c, i) => {
    const cy = pad.t + i * rowH + rowH / 2;
    const [lo, hi] = bounds(c);
    const sig = c.p < alpha;
    const isDummy = c.name === "islamic";

    svg.append(text(pad.l - 12, cy + 4, c.label, "chart-row-label", "end"));
    if (isDummy) {
      svg.append(el("rect", {
        x: pad.l - 166, y: cy - rowH / 2 + 2, width: W - 20, height: rowH - 4,
        class: "forest-focus", rx: 4,
      }));
    }
    svg.append(line(X(lo), cy, X(hi), cy, sig ? "ci-sig" : "ci-null"));
    [lo, hi].forEach((v) => svg.append(line(X(v), cy - 4, X(v), cy + 4, sig ? "ci-sig" : "ci-null")));
    svg.append(el("circle", {
      cx: X(value(c)), cy, r: isDummy ? 6 : 5,
      class: sig ? "dot-sig" : "dot-null",
    }));

    svg.append(text(W - pad.r + 12, cy + 1,
      tView ? `t = ${n2.format(c.t)}` : c.b.toFixed(6), "chart-coef", "start"));
    svg.append(text(W - pad.r + 12, cy + 14,
      `p ${c.p < 0.0001 ? "< 0.0001" : `= ${c.p.toFixed(4)}`}${stars(c.p)}`,
      sig ? "chart-p-sig" : "chart-p", "start"));
  });

  host.replaceChildren(svg);

  const blurb = $("#forest-blurb");
  if (blurb) blurb.textContent = model.blurb;

  const fit = $("#forest-fit");
  if (fit) {
    fit.innerHTML = "";
    const items = [
      ["Observations", n0.format(model.n)],
      ["R²", model.r2.toFixed(4)],
      ["Adjusted R²", model.adjR2.toFixed(4)],
      ["RMSE", model.rmse.toFixed(5)],
      ["F", n0.format(model.f)],
      ["Model p", model.fp === 0 ? "< 0.001" : fmtP(model.fp)],
    ];
    items.forEach(([k, v]) => {
      const d = document.createElement("div");
      d.className = "tile";
      d.innerHTML = `<span class="mono">${k}</span><strong class="tile-value">${v}</strong>`;
      fit.append(d);
    });
  }

  const survivors = rows.filter((c) => c.p < alpha).length;
  const note = $("#forest-readout");
  if (note) {
    note.textContent =
      `At a ${(alpha * 100).toFixed(0)}% threshold, ${survivors} of the ${rows.length} ` +
      `non-market coefficients in this specification are distinguishable from zero. ` +
      (spec === "pooled"
        ? "The Islamic dummy is not one of them, and it is the one the study was built to test."
        : spec === "islamic"
          ? "With 264 observations the intervals are wide enough that most factors cannot be pinned down at all."
          : "With 19,313 observations almost everything reaches significance, which is a statement about sample size as much as about economics.");
  }
}

/* ------------------------------------------------------------
   6 · market beta across specifications
   ------------------------------------------------------------ */
function drawBeta(host) {
  const rows = SPEC_ORDER.map((k) => ({
    label: REGRESSIONS[k].label,
    c: REGRESSIONS[k].coefs.find((x) => x.name === "mktrf"),
  }));

  const W = 760;
  const rowH = 46;
  const pad = { t: 24, r: 130, b: 26, l: 190 };
  const H = pad.t + pad.b + rows.length * rowH;
  const iw = W - pad.l - pad.r;

  const lo = Math.min(...rows.map((r) => r.c.lo)) - 0.01;
  const hi = Math.max(...rows.map((r) => r.c.hi)) + 0.01;
  const X = (v) => pad.l + ((v - lo) / (hi - lo)) * iw;

  const svg = chart(W, H, "Market beta and its confidence interval, by specification");

  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    svg.append(line(X(v), pad.t - 6, X(v), H - pad.b + 2, "chart-grid"));
    svg.append(text(X(v), H - pad.b + 14, v.toFixed(3), "chart-label"));
  }

  rows.forEach((r, i) => {
    const cy = pad.t + i * rowH + rowH / 2 - 4;
    svg.append(text(pad.l - 12, cy + 4, r.label, "chart-row-label", "end"));
    svg.append(line(X(r.c.lo), cy, X(r.c.hi), cy, "ci-sig"));
    [r.c.lo, r.c.hi].forEach((v) => svg.append(line(X(v), cy - 5, X(v), cy + 5, "ci-sig")));
    svg.append(el("circle", { cx: X(r.c.b), cy, r: 5.5, class: "dot-sig" }));
    svg.append(text(W - pad.r + 12, cy + 4, r.c.b.toFixed(6), "chart-coef", "start"));
  });

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   7 · the two group drawdown curves
   ------------------------------------------------------------ */
function drawDrawdown(host, { showDiff }) {
  const W = 760;
  const H = 280;
  const pad = { t: 16, r: 12, b: 30, l: 50 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const n = DD_CONVENTIONAL.length;

  const diff = DD_ISLAMIC.map((v, i) =>
    (v === null || DD_CONVENTIONAL[i] === null) ? null : v - DD_CONVENTIONAL[i]);

  const shown = showDiff ? [diff] : [DD_CONVENTIONAL, DD_ISLAMIC];
  const flat = shown.flat().filter((v) => v !== null);
  const lo = Math.min(...flat, showDiff ? -0.02 : -0.05);
  const hi = Math.max(...flat, 0);
  const X = (i) => pad.l + (i / (n - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / (hi - lo)) * ih;

  const svg = chart(W, H, showDiff
    ? "Islamic minus conventional average drawdown"
    : "Average drawdown from the previous peak, by fund type");

  for (let g = 0; g <= 5; g++) {
    const v = lo + ((hi - lo) * g) / 5;
    svg.append(line(pad.l, Y(v), W - pad.r, Y(v), "chart-grid"));
    svg.append(text(pad.l - 6, Y(v) + 3, `${(v * 100).toFixed(0)}%`, "chart-label", "end"));
  }
  if (lo < 0 && hi >= 0) svg.append(line(pad.l, Y(0), W - pad.r, Y(0), "chart-zero-strong"));

  const path = (vals, cls, fill) => {
    let d = "";
    let started = false;
    vals.forEach((v, i) => {
      if (v === null) return;
      d += `${started ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`;
      started = true;
    });
    if (!d) return;
    if (fill) {
      const first = vals.findIndex((v) => v !== null);
      svg.append(el("path", {
        d: `${d} L${X(n - 1).toFixed(1)},${Y(0)} L${X(first).toFixed(1)},${Y(0)} Z`,
        class: fill,
      }));
    }
    svg.append(el("path", { d, class: cls, fill: "none" }));
  };

  if (showDiff) {
    path(diff, "line-diff", "area-diff");
  } else {
    path(DD_CONVENTIONAL, "line-conventional", "area-conventional");
    path(DD_ISLAMIC, "line-islamic", null);
  }

  monthTicks(DD_FROM, n).forEach(([y, i]) =>
    svg.append(text(X(i), H - 8, y, "chart-label")));

  host.replaceChildren(svg);

  const worstC = Math.min(...DD_CONVENTIONAL.filter((v) => v !== null));
  const worstI = Math.min(...DD_ISLAMIC.filter((v) => v !== null));
  const iBetter = diff.filter((v) => v !== null && v > 0).length;
  const shownMonths = diff.filter((v) => v !== null).length;
  const note = $("#dd-readout");
  if (note) {
    note.textContent =
      `The deepest point on the conventional average is ${pc(worstC)}; on the Islamic average, ${pc(worstI)}. ` +
      `Across the ${shownMonths} months where both series exist, the Islamic average sits closer to its peak ` +
      `in ${iBetter} of them (${pc(iBetter / shownMonths, 0)}). ` +
      `These are group averages, so they smooth away exactly the fund-level dispersion the t-test needs, ` +
      `which is why the picture looks more decisive than the statistics are.`;
  }
}

/* ------------------------------------------------------------
   8 · the cross-section of fund volatility
   ------------------------------------------------------------ */
function drawVolStrip(host, { logScale }) {
  const W = 760;
  const H = 190;
  const pad = { t: 44, r: 16, b: 40, l: 16 };
  const iw = W - pad.l - pad.r;

  const b = boxStats(FUND_SD);
  const lo = logScale ? Math.log10(Math.min(...FUND_SD)) : 0;
  const hi = logScale ? Math.log10(Math.max(...FUND_SD)) : Math.max(...FUND_SD);
  const T = (v) => (logScale ? Math.log10(v) : v);
  const X = (v) => pad.l + ((T(v) - lo) / (hi - lo)) * iw;

  const svg = chart(W, H, "Every fund's monthly return standard deviation");
  const cy = pad.t + 26;

  // axis
  const ticks = logScale
    ? [0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5]
    : [0, 0.1, 0.2, 0.3, 0.4, 0.5];
  ticks.forEach((v) => {
    if (T(v) < lo || T(v) > hi) return;
    svg.append(line(X(v), pad.t - 8, X(v), H - pad.b + 6, "chart-grid"));
    svg.append(text(X(v), H - pad.b + 20, `${(v * 100).toFixed(v < 0.01 ? 1 : 0)}%`, "chart-label"));
  });

  // box and whiskers
  svg.append(line(X(b.whiskerLo), cy, X(b.q1), cy, "box-whisker"));
  svg.append(line(X(b.q3), cy, X(b.whiskerHi), cy, "box-whisker"));
  svg.append(el("rect", {
    x: X(b.q1), y: cy - 13, width: Math.max(1, X(b.q3) - X(b.q1)), height: 26,
    class: "box-body", rx: 2,
  }));
  svg.append(line(X(b.med), cy - 13, X(b.med), cy + 13, "box-median"));

  // every fund, jittered off the box so the density is visible
  FUND_SD.forEach((v, i) => {
    svg.append(el("circle", {
      cx: X(v), cy: cy + 26 + ((i * 7) % 5) * 3.2,
      r: 1.9,
      class: b.outliers.includes(v) ? "strip-outlier" : "strip-dot",
    }));
  });

  // the two group means from Table 1, on the same axis
  [["Conventional mean", 0.0367, "mark-conv"], ["Islamic mean", 0.0356, "mark-isl"]].forEach(
    ([label, v, cls], i) => {
      svg.append(line(X(v), pad.t - 26, X(v), cy + 40, cls));
      svg.append(text(X(v) + (i ? -5 : 5), pad.t - 30 + i * 13,
        label, "chart-label-sm", i ? "end" : "start"));
    }
  );

  host.replaceChildren(svg);

  const note = $("#strip-readout");
  if (note) {
    note.textContent =
      `Median ${pc(b.med, 2)}, interquartile range ${pc(b.q1, 2)} to ${pc(b.q3, 2)}, ` +
      `and ${b.outliers.length} funds beyond the 1.5×IQR fence: the furthest at ${pc(b.max, 1)} a month. ` +
      `Both group means land in the crowd near ${pc(0.036, 1)}. ` +
      `A single fund at ${pc(b.max, 1)} monthly volatility is not an equity fund behaving badly; ` +
      `it is a NAV series with a discontinuity in it, and it is the same fund that carries ` +
      `the ${num(IVOL.conventional.max, 3)} idiosyncratic volatility in Table 5.`;
  }
}

/* ------------------------------------------------------------
   9 · the evidence map
   ------------------------------------------------------------ */
function drawEvidence(host, { filter }) {
  const rows = EVIDENCE
    .filter((r) => filter === "all" || r.finding === filter)
    .sort((a, b) => a.year - b.year);

  const table = document.createElement("table");
  table.className = "fin-table evidence-table";
  table.innerHTML =
    "<thead><tr><th>Study</th><th>Market</th><th>Level</th>" +
    "<th>Focus</th><th>What it found</th></tr></thead>";
  const tb = document.createElement("tbody");

  rows.forEach((r) => {
    const tr = document.createElement("tr");
    if (r.self) tr.classList.add("is-self");
    const cells = [
      `${r.study} (${r.year})`, r.market, r.level, r.focus, r.note,
    ];
    cells.forEach((c, i) => {
      const td = document.createElement(i === 0 ? "th" : "td");
      td.textContent = c;
      if (i === 4) {
        td.classList.add("evidence-note");
        td.dataset.finding = r.finding;
      }
      tr.append(td);
    });
    tb.append(tr);
  });
  table.append(tb);
  host.replaceChildren(table);

  const count = $("#evidence-count");
  if (count) {
    count.textContent = filter === "all"
      ? `${rows.length} studies`
      : `${rows.length} of ${EVIDENCE.length} studies`;
  }
}

function drawEvidenceBar(host) {
  const order = ["better", "same", "mixed", "worse", "n/a"];
  const counts = order.map((k) => ({
    k, n: EVIDENCE.filter((r) => r.finding === k).length,
  })).filter((d) => d.n);

  const W = 760;
  const H = 46;
  const pad = { l: 4, r: 4, t: 16 };
  const total = counts.reduce((s, d) => s + d.n, 0);
  const iw = W - pad.l - pad.r;

  /* The count sits above its band rather than inside it: a label
     printed on top of a filled bar has to survive five different
     fills in two themes, and one of them is always going to lose.
     The names go in an HTML key underneath, where they can wrap:
     the two narrowest bands are 2 studies wide and SVG text has no
     way to fit "Depends on the specification" into 60 pixels. */
  const svg = chart(W, H, "How the literature splits");
  let x = pad.l;
  counts.forEach((d) => {
    const w = (d.n / total) * iw;
    svg.append(text(x + w / 2, pad.t - 4, String(d.n), "chart-count"));
    svg.append(el("rect", {
      x, y: pad.t + 2, width: Math.max(1, w - 2), height: 22, rx: 3,
      class: `finding-${d.k.replace("/", "")}`,
    }));
    x += w;
  });
  host.replaceChildren(svg);

  const key = $("#evidence-legend");
  if (key) {
    key.replaceChildren(...counts.map((d) => {
      const li = document.createElement("li");
      li.innerHTML =
        `<i class="key finding-key-${d.k.replace("/", "")}"></i>${FINDING_LABELS[d.k]} · ${d.n}`;
      return li;
    }));
  }
}

/* ------------------------------------------------------------
   10 · the power curve
   ------------------------------------------------------------ */
const POWER_N = [3, 4, 5, 6, 8, 10, 14, 20, 30, 45, 65, 90, 120];

function drawPower(host, { sd, alpha }) {
  const W = 760;
  const H = 260;
  const pad = { t: 18, r: 16, b: 40, l: 56 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const pts = POWER_N.map((n) => ({
    n,
    mde: minDetectable({ n1: n, n2: SAMPLE.funds.conventional, sd1: sd, sd2: sd, alpha }),
  }));
  const hi = Math.max(...pts.map((p) => p.mde), Math.abs(MDD.islamic - MDD.conventional) * 2);
  const X = (n) => pad.l + (Math.log(n / 3) / Math.log(120 / 3)) * iw;
  const Y = (v) => pad.t + ih - (Math.min(v, hi) / hi) * ih;

  const svg = chart(W, H, "Smallest detectable difference in maximum drawdown, by number of Islamic funds");

  for (let g = 0; g <= 5; g++) {
    const v = (hi * g) / 5;
    svg.append(line(pad.l, Y(v), W - pad.r, Y(v), "chart-grid"));
    svg.append(text(pad.l - 6, Y(v) + 3, `${(v * 100).toFixed(0)}pp`, "chart-label", "end"));
  }

  const observed = Math.abs(MDD.islamic - MDD.conventional);
  svg.append(line(pad.l, Y(observed), W - pad.r, Y(observed), "chart-mean"));
  svg.append(text(pad.l + 6, Y(observed) - 6,
    `the gap actually observed, ${(observed * 100).toFixed(1)}pp`, "chart-value", "start"));

  const d = pts.map((p, i) => `${i ? "L" : "M"}${X(p.n).toFixed(1)},${Y(p.mde).toFixed(1)}`).join(" ");
  svg.append(el("path", { d, class: "line-power", fill: "none" }));

  pts.forEach((p) => {
    if (![3, 5, 10, 20, 45, 120].includes(p.n)) return;
    svg.append(el("circle", { cx: X(p.n), cy: Y(p.mde), r: 3.5, class: "dot-power" }));
    svg.append(text(X(p.n), H - 24, String(p.n), "chart-label"));
  });

  // where the study actually stood
  svg.append(el("circle", { cx: X(3), cy: Y(pts[0].mde), r: 6.5, class: "dot-islamic" }));
  svg.append(text(X(3) + 10, Y(pts[0].mde) + 4, "this study", "chart-tag-isl", "start"));
  svg.append(text(pad.l + iw / 2, H - 8, "Number of Islamic funds in the sample", "chart-label"));

  host.replaceChildren(svg);
}

function renderPower() {
  const sd = state.powerSd;
  const alpha = state.alpha;
  const nConv = SAMPLE.funds.conventional;
  const observed = Math.abs(MDD.islamic - MDD.conventional);

  drawPower($("#chart-power"), { sd, alpha });

  const mde = minDetectable({ n1: SAMPLE.funds.islamic, n2: nConv, sd1: sd, sd2: sd, alpha });
  const pw = power({ n1: SAMPLE.funds.islamic, n2: nConv, sd1: sd, sd2: sd, delta: observed, alpha });

  let needed = null;
  for (let n = 3; n <= 400; n++) {
    if (power({ n1: n, n2: nConv, sd1: sd, sd2: sd, delta: observed, alpha }) >= 0.8) { needed = n; break; }
  }

  const out = {
    "power-mde": `${(mde * 100).toFixed(1)}pp`,
    "power-detect": `${(pw * 100).toFixed(0)}%`,
    "power-needed": needed ? `${needed} funds` : "> 400 funds",
  };
  Object.entries(out).forEach(([k, v]) => {
    const t = $(`[data-tile="${k}"] .tile-value`);
    if (t) t.textContent = v;
  });

  const sdOut = $("#power-sd-value");
  if (sdOut) sdOut.textContent = `${(sd * 100).toFixed(0)}pp`;

  const note = $("#power-readout");
  if (note) {
    note.textContent =
      `With three Shariah-compliant funds against ${n0.format(nConv)} conventional ones, and a cross-fund ` +
      `spread of ${(sd * 100).toFixed(0)} percentage points in maximum drawdown, the smallest difference this ` +
      `design could have found four times in five is ${(mde * 100).toFixed(1)} percentage points. ` +
      `The difference it actually observed was ${(observed * 100).toFixed(1)}. ` +
      `The chance of catching a real gap that size was ${(pw * 100).toFixed(0)}%: ` +
      `about the same as a coin that lands heads ${(pw * 100).toFixed(0)} times in a hundred. ` +
      (needed
        ? `Detecting it reliably would have taken roughly ${needed} Islamic funds. The UK market offered three.`
        : `No realistic number of funds in this market would have settled it.`);
  }
}

/* ------------------------------------------------------------
   the IVOL test, re-run live
   ------------------------------------------------------------ */
function renderIvol() {
  const w = welch({
    m1: IVOL.islamic.mean, s1: IVOL.islamic.sd, n1: IVOL.islamic.n,
    m2: IVOL.conventional.mean, s2: IVOL.conventional.sd, n2: IVOL.conventional.n,
  });

  const host = $("#ivol-table");
  if (host) {
    const table = document.createElement("table");
    table.className = "fin-table";
    table.innerHTML =
      "<thead><tr><th>Idiosyncratic volatility</th><th>Islamic</th>" +
      "<th>Conventional</th><th>Difference</th></tr></thead>";
    const tb = document.createElement("tbody");
    const rows = [
      ["Funds", String(IVOL.islamic.n), String(IVOL.conventional.n), ""],
      ["Mean", num(IVOL.islamic.mean, 5), num(IVOL.conventional.mean, 5), num(IVOL.diff, 5)],
      ["Median", num(IVOL.islamic.median, 5), num(IVOL.conventional.median, 5), ""],
      ["Spread across funds (σ)", num(IVOL.islamic.sd, 5), num(IVOL.conventional.sd, 5), ""],
      ["Lowest", num(IVOL.islamic.min, 5), num(IVOL.conventional.min, 5), ""],
      ["Highest", num(IVOL.islamic.max, 5), num(IVOL.conventional.max, 5), ""],
    ];
    rows.forEach(([k, a, b, c]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = k;
      tr.append(th);
      [a, b, c].forEach((v) => {
        const td = document.createElement("td");
        td.textContent = v;
        tr.append(td);
      });
      tb.append(tr);
    });
    table.append(tb);
    host.replaceChildren(table);
  }

  const note = $("#ivol-readout");
  if (note) {
    note.innerHTML =
      `The dissertation reports p = <strong>${IVOL.p.toFixed(6)}</strong>. Feeding the two group means, ` +
      `their spreads and their fund counts into this page's own Welch routine returns ` +
      `t = ${n2.format(w.t)} on ${n2.format(w.df)} degrees of freedom and ` +
      `p = <strong>${w.p.toFixed(6)}</strong>: the same number to four decimal places, ` +
      `computed by different code from the printed summary statistics. ` +
      `Two degrees of freedom is the tell: with three funds, the precision of this comparison is set ` +
      `almost entirely by how much those three differ from each other. The other 217 barely enter it.`;
  }

  const mdeIvol = minDetectable({
    n1: IVOL.islamic.n, n2: IVOL.conventional.n,
    sd1: IVOL.islamic.sd, sd2: IVOL.conventional.sd,
  });
  const note2 = $("#ivol-mde");
  if (note2) {
    note2.textContent =
      `Run the same arithmetic forwards: at 80% power the smallest gap in idiosyncratic volatility ` +
      `this comparison could have detected is ${num(mdeIvol, 4)} a month, larger than the average level ` +
      `of idiosyncratic volatility itself (${num(IVOL.conventional.mean, 4)}). ` +
      `The test was not capable of finding any difference an investor would care about. ` +
      `"No significant difference" here means "no measurement", not "no difference".`;
  }
}

/* ------------------------------------------------------------
   the references list
   ------------------------------------------------------------ */
function renderReferences() {
  const host = $("#reference-list");
  if (!host) return;
  const ol = document.createElement("ol");
  ol.className = "ref-list";
  REFERENCES.forEach((r) => {
    const li = document.createElement("li");
    li.textContent = r;
    ol.append(li);
  });
  host.replaceChildren(ol);
  const count = $("#reference-count");
  if (count) count.textContent = `${REFERENCES.length} works cited on this page`;
}

/* ------------------------------------------------------------
   the factor glossary
   ------------------------------------------------------------ */
function renderFactors() {
  const host = $("#factor-list");
  if (!host) return;
  host.innerHTML = "";
  FACTORS.forEach((f) => {
    const row = document.createElement("div");
    row.className = "row";
    row.innerHTML =
      `<span class="k mono">${f.short} · ${f.full}</span><span class="v">${f.what}</span>`;
    host.append(row);
  });
}

/* ------------------------------------------------------------
   the "on this page" rail
   ------------------------------------------------------------ */
function buildToc() {
  const host = $("#page-toc");
  if (!host) return;
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
  host.replaceChildren(list);

  if (!("IntersectionObserver" in window)) return;
  const links = new Map($$("a", host).map((a) => [a.getAttribute("href").slice(1), a]));
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

/* ------------------------------------------------------------
   state + render
   ------------------------------------------------------------ */
const state = {
  rebased: true,
  spec: "pooled",
  alpha: 0.05,
  tView: false,
  showDiff: false,
  logHist: true,
  histFactor: 2,
  logStrip: true,
  evidence: "all",
  powerSd: 0.15,
};

function render() {
  drawIndices($("#chart-indices"), { rebased: state.rebased });
  drawSample($("#chart-sample"));
  drawExcess($("#chart-excess"), { logScale: state.logHist, factor: state.histFactor });
  drawDumbbells($("#chart-dumbbells"), state.alpha);
  drawForest($("#chart-forest"), { spec: state.spec, alpha: state.alpha, tView: state.tView });
  drawBeta($("#chart-beta"));
  drawDrawdown($("#chart-drawdown"), { showDiff: state.showDiff });
  drawVolStrip($("#chart-strip"), { logScale: state.logStrip });
  drawEvidence($("#evidence-table"), { filter: state.evidence });
  drawEvidenceBar($("#chart-evidence"));
  renderPower();
  renderIvol();

  const a = $("#alpha-value");
  if (a) a.textContent = `${(state.alpha * 100).toFixed(0)}%`;
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#dissertation")) return;

  renderFactors();
  renderReferences();
  buildToc();

  $("#rebase-toggle")?.addEventListener("click", (e) => {
    state.rebased = !state.rebased;
    e.currentTarget.setAttribute("aria-pressed", String(state.rebased));
    drawIndices($("#chart-indices"), { rebased: state.rebased });
  });

  $$("[data-spec]").forEach((b) => b.addEventListener("click", () => {
    state.spec = b.dataset.spec;
    $$("[data-spec]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    drawForest($("#chart-forest"), state);
  }));

  $("#t-view")?.addEventListener("click", (e) => {
    state.tView = !state.tView;
    e.currentTarget.setAttribute("aria-pressed", String(state.tView));
    drawForest($("#chart-forest"), state);
  });

  $$("[data-alpha]").forEach((b) => b.addEventListener("click", () => {
    state.alpha = Number(b.dataset.alpha);
    $$("[data-alpha]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));

  $("#dd-diff")?.addEventListener("click", (e) => {
    state.showDiff = !state.showDiff;
    e.currentTarget.setAttribute("aria-pressed", String(state.showDiff));
    drawDrawdown($("#chart-drawdown"), { showDiff: state.showDiff });
  });

  $("#hist-log")?.addEventListener("click", (e) => {
    state.logHist = !state.logHist;
    e.currentTarget.setAttribute("aria-pressed", String(state.logHist));
    drawExcess($("#chart-excess"), { logScale: state.logHist, factor: state.histFactor });
  });

  $("#hist-width")?.addEventListener("input", (e) => {
    state.histFactor = Number(e.target.value);
    const i = e.target;
    i.style.setProperty("--pct", `${((i.value - i.min) / (i.max - i.min)) * 100}%`);
    const out = $("#hist-width-value");
    if (out) out.textContent = `${(state.histFactor * EXCESS_HIST.width * 100).toFixed(1)}pp bins`;
    drawExcess($("#chart-excess"), { logScale: state.logHist, factor: state.histFactor });
  });

  $("#strip-log")?.addEventListener("click", (e) => {
    state.logStrip = !state.logStrip;
    e.currentTarget.setAttribute("aria-pressed", String(state.logStrip));
    drawVolStrip($("#chart-strip"), { logScale: state.logStrip });
  });

  $$("[data-finding]").forEach((b) => b.addEventListener("click", () => {
    state.evidence = b.dataset.finding;
    $$("[data-finding]").forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
    drawEvidence($("#evidence-table"), { filter: state.evidence });
  }));

  $("#power-sd")?.addEventListener("input", (e) => {
    state.powerSd = Number(e.target.value) / 100;
    const i = e.target;
    i.style.setProperty("--pct", `${((i.value - i.min) / (i.max - i.min)) * 100}%`);
    renderPower();
  });

  // the sample facts, straight from the data module
  const facts = {
    "fact-funds": n0.format(SAMPLE.funds.total),
    "fact-islamic": String(SAMPLE.funds.islamic),
    "fact-obs": n0.format(SAMPLE.observations.total),
    "fact-months": String(SAMPLE.months),
  };
  Object.entries(facts).forEach(([k, v]) => {
    const t = $(`[data-tile="${k}"] .tile-value`);
    if (t) t.textContent = v;
  });

  const sourceHost = $("#source-table");
  if (sourceHost) {
    const table = document.createElement("table");
    table.className = "fin-table";
    table.innerHTML = "<thead><tr><th>What</th><th>Where from</th><th>Detail</th></tr></thead>";
    const tb = document.createElement("tbody");
    SAMPLE.sources.forEach(([a, b, c]) => {
      const tr = document.createElement("tr");
      const th = document.createElement("th");
      th.textContent = a;
      tr.append(th);
      [b, c].forEach((v) => {
        const td = document.createElement("td");
        td.textContent = v;
        td.classList.add("cell-prose");
        tr.append(td);
      });
      tb.append(tr);
    });
    table.append(tb);
    sourceHost.replaceChildren(table);
  }

  const title = $("#study-meta");
  if (title) {
    title.textContent =
      `${STUDY.degree} · ${STUDY.institution} · ${STUDY.words} words · ` +
      `sample ${monthLabel(STUDY.sampleStart, 0)} → ${monthLabel(STUDY.sampleEnd, 0)}`;
  }

  render();
}

init();
