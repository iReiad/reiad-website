/* ============================================================
   frontier.js: the dashboard around the portfolio.

   frontier.model.js does the optimisation and is checked on its
   own; this draws it. One state object, a full re-solve on every
   change, and the same deferred pattern as the other heavy pages
   for the one view that costs more than a frame.

   Charts are hand-drawn inline SVG, no library.
   ============================================================ */

import {
  COMPANIES, HELD, TICKERS, DATES_2015, DATES_OOS, BENCHMARK_ANNUAL, CHECKS,
  DEFAULTS, DRIVERS, run, toCsv, screen, SCREEN_DEFAULTS,
  annualiseReturn, annualiseVol, backtest, performance, PRICES_OOS, equalWeight,
} from "/portfolio/frontier.model.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

const pc = (v, d = 1) => (Number.isFinite(v) ? `${(v * 100).toFixed(d)}%` : "–");
const signedPc = (v, d = 1) =>
  Number.isFinite(v) ? `${v >= 0 ? "+" : "−"}${Math.abs(v * 100).toFixed(d)}%` : "–";
const dp = (v, d = 2) => (Number.isFinite(v) ? v.toFixed(d) : "–");

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
const path = (pts, cls, extra = {}) =>
  el("path", {
    d: pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" "),
    class: cls, fill: "none", ...extra,
  });
const cell = (v, cls) => {
  const td = document.createElement("td");
  td.textContent = v;
  if (cls) td.className = cls;
  return td;
};

/* ------------------------------------------------------------
   state
   ------------------------------------------------------------ */
const state = { ...DEFAULTS };
const edited = new Set();

const STRATEGY_BLURB = {
  tangency: "The highest Sharpe ratio available on the estimated frontier. It is also the point that leans hardest on the expected returns, which are the least reliable thing in the estimate.",
  minvar: "The lowest variance available under the constraints. It needs no view on returns at all, only the covariance matrix, which is the half of the estimate worth trusting.",
  equal: "The same amount in each. No estimation, no optimisation, and the benchmark that every clever method has to beat before it has earned its keep.",
  inverse: "Weights proportional to one over each holding's variance. It uses the volatilities and ignores every correlation, which is a real strategy rather than an approximation to one.",
};

function readUrl() {
  const q = new URLSearchParams(location.search);
  const s = q.get("s");
  if (s && STRATEGY_BLURB[s]) state.strategy = s;
  if (q.get("mode") === "rebalance") state.mode = "rebalance";
  if (q.get("u") === "all") state.useAll = true;
  DRIVERS.forEach((d) => {
    const v = q.get(d.key);
    if (v === null) return;
    const n = Number(v);
    if (Number.isFinite(n)) { state[d.key] = n; edited.add(d.key); }
  });
}

function writeUrl() {
  const q = new URLSearchParams();
  q.set("s", state.strategy);
  if (state.mode !== DEFAULTS.mode) q.set("mode", state.mode);
  if (state.useAll) q.set("u", "all");
  edited.forEach((k) => q.set(k, String(+Number(state[k]).toFixed(4))));
  history.replaceState(null, "", `${location.pathname}?${q}`);
}

/* ------------------------------------------------------------
   controls
   ------------------------------------------------------------ */
function buildControls() {
  const host = $("#drivers");
  if (!host) return;
  host.replaceChildren(...DRIVERS.map((d) => {
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
    return wrap;
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
    $(".val", wrap).textContent = d.key === "riskFree" ? pc(raw, 2) : pc(raw, 0);
    wrap.toggleAttribute("data-edited", edited.has(d.key));
  });
}

/* ------------------------------------------------------------
   1 · the frontier
   ------------------------------------------------------------ */
function drawFrontier(r) {
  const host = $("#frontier-chart");
  if (!host) return;
  const W = 380;
  const H = 330;
  const pad = { t: 16, r: 16, b: 38, l: 50 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const assets = r.tickers.map((t, i) => ({
    t,
    vol: annualiseVol(Math.sqrt(r.S[i][i])),
    ret: annualiseReturn(r.mu[i]),
  }));
  const named = ["minvar", "tangency", "equal", "inverse"].map((k) => ({ k, ...r.points[k] }));
  const xs = [...r.frontier.efficient.map((p) => p.vol), ...assets.map((a) => a.vol)];
  const ys = [...r.frontier.efficient.map((p) => p.ret), ...assets.map((a) => a.ret)];
  const xlo = 0;
  const xhi = Math.max(...xs) * 1.08;
  const ylo = Math.min(...ys, 0) * 1.15;
  const yhi = Math.max(...ys) * 1.12;
  const X = (v) => pad.l + ((v - xlo) / (xhi - xlo)) * iw;
  const Y = (v) => pad.t + ih - ((v - ylo) / (yhi - ylo)) * ih;

  const svg = chart(W, H, "The efficient frontier estimated on the 2015 window");
  for (let g = 0; g <= 4; g++) {
    const v = ylo + ((yhi - ylo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
  }
  for (let g = 0; g <= 4; g++) {
    const v = xlo + ((xhi - xlo) * g) / 4;
    svg.append(text(X(v), H - 20, pc(v, 0), "chart-label"));
  }
  if (ylo < 0) svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(0), y2: Y(0), class: "chart-zero-strong" }));

  // the individual holdings
  assets.forEach((a) => {
    svg.append(el("circle", { cx: X(a.vol), cy: Y(a.ret), r: 3, class: "dot-asset" }));
    svg.append(text(X(a.vol), Y(a.ret) - 7, a.t, "chart-tag-asset"));
  });

  svg.append(path(r.frontier.efficient.map((p) => [X(p.vol), Y(p.ret)]), "line-frontier"));

  named.forEach((p) => {
    const isChosen = p.k === state.strategy;
    svg.append(el("circle", {
      cx: X(p.vol), cy: Y(p.ret), r: isChosen ? 6 : 4,
      class: isChosen ? "dot-chosen" : "dot-named",
    }));
  });
  const chosen = r.points.chosen;
  svg.append(text(X(chosen.vol), Y(chosen.ret) + 16, "held", "chart-tag-held"));

  svg.append(text(pad.l + iw / 2, H - 4, "annualised volatility", "chart-label-sm"));
  host.replaceChildren(svg);

  const note = $("#frontier-note");
  if (note) {
    note.textContent = `The chosen portfolio sits at ${pc(chosen.vol)} volatility for `
      + `${pc(chosen.ret)} expected return, a Sharpe of ${dp(chosen.sharpe)}, all measured on the year `
      + `it was estimated from. Equal weight sits at ${pc(r.points.equal.vol)} and `
      + `${pc(r.points.equal.ret)}. Those are the numbers the optimisation is entitled to claim; `
      + "everything below is what happened next.";
  }
}

/* ------------------------------------------------------------
   2 · the hold-out path
   ------------------------------------------------------------ */
function drawNav(r) {
  const host = $("#nav-chart");
  if (!host) return;
  const W = 380;
  const H = 330;
  const pad = { t: 16, r: 14, b: 34, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const series = [["chosen", r.holdout.chosen.nav], ["equal", r.holdout.equal.nav]];
  const all = series.flatMap(([, s]) => s);
  const lo = Math.min(...all) * 0.98;
  const hi = Math.max(...all) * 1.02;
  const X = (i) => pad.l + (i / (DATES_OOS.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / (hi - lo)) * ih;

  const svg = chart(W, H, "Portfolio value over the hold-out window");
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, `£${dp(v * 10, 1)}m`, "chart-label", "end"));
  }
  svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(1), y2: Y(1), class: "chart-crit" }));
  series.forEach(([k, s]) => {
    svg.append(path(s.map((v, i) => [X(i), Y(v)]), `line-${k}`));
  });
  [2016, 2018, 2020].forEach((y) => {
    const i = DATES_OOS.findIndex((d) => d.startsWith(String(y)));
    if (i >= 0) svg.append(text(X(i), H - 8, String(y), "chart-label"));
  });
  host.replaceChildren(svg);

  const note = $("#nav-note");
  if (note) {
    const c = r.holdout.chosen.performance;
    const e = r.holdout.equal.performance;
    note.textContent = `£10m becomes £${dp(r.holdout.chosen.nav[r.holdout.chosen.nav.length - 1] * 10, 2)}m `
      + `on the chosen weights and £${dp(r.holdout.equal.nav[r.holdout.equal.nav.length - 1] * 10, 2)}m on equal weights. `
      + `Realised volatility was ${pc(c.vol)} against ${pc(e.vol)}, so the optimisation `
      + `${c.vol < e.vol ? "did deliver the calmer ride it promised" : "did not deliver the calmer ride it promised"}.`;
  }
}

/* ------------------------------------------------------------
   3 · the screen
   ------------------------------------------------------------ */
function buildScreenTable() {
  const host = $("#screen-table");
  if (!host || host.dataset.built) return;
  host.dataset.built = "1";
  const rows = screen(COMPANIES, SCREEN_DEFAULTS);
  const table = document.createElement("table");
  table.className = "fin-table";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Company", "Sector", "Debt/equity", "ESG", "ROE", "ROIC/WACC", "Beta", "Yield", "Held"]
    .forEach((h, i) => {
      const th = document.createElement("th");
      th.textContent = h;
      if (i) th.className = "col-forecast";
      hr.append(th);
    });
  thead.append(hr);
  table.append(thead);
  const tbody = document.createElement("tbody");
  rows.forEach((c) => {
    const tr = document.createElement("tr");
    if (!c.held) tr.classList.add("is-dropped");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = `${c.name} (${c.ticker})`;
    tr.append(th);
    tr.append(cell(c.sector, "cell-prose"));
    tr.append(cell(dp(c.de, 1), c.de > SCREEN_DEFAULTS.maxDebtEquity ? "is-negative" : ""));
    tr.append(cell(dp(c.esg, 2)));
    tr.append(cell(dp(c.roe, 1), c.roe < SCREEN_DEFAULTS.minRoe ? "is-negative" : ""));
    tr.append(cell(dp(c.roicWacc, 2)));
    tr.append(cell(dp(c.beta, 2)));
    tr.append(cell(pc(c.dividendYield)));
    tr.append(cell(c.held ? "yes" : "no", c.held ? "is-positive" : ""));
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);

  const note = $("#screen-note");
  if (note) {
    const heavy = rows.filter((c) => c.de > SCREEN_DEFAULTS.maxDebtEquity).length;
    note.textContent = `Thirteen candidates reached this table, of which ten were held. `
      + `${heavy} of the thirteen carry debt above a third of equity, which is worth saying plainly: `
      + "on a strict reading of that rule almost nothing on a mid-cap list survives, and a screen that "
      + "was applied strictly at every step would have returned an empty portfolio rather than this one.";
  }
}

/* ------------------------------------------------------------
   4 · risk and return scatter, correlations
   ------------------------------------------------------------ */
function drawScatter(r) {
  const host = $("#scatter-chart");
  if (!host) return;
  const W = 370;
  const H = 250;
  const pad = { t: 14, r: 14, b: 34, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const pts = r.tickers.map((t, i) => ({
    t, vol: annualiseVol(Math.sqrt(r.S[i][i])), ret: annualiseReturn(r.mu[i]),
  }));
  const xhi = Math.max(...pts.map((p) => p.vol)) * 1.1;
  const ylo = Math.min(...pts.map((p) => p.ret), 0) * 1.15;
  const yhi = Math.max(...pts.map((p) => p.ret)) * 1.15;
  const X = (v) => pad.l + (v / xhi) * iw;
  const Y = (v) => pad.t + ih - ((v - ylo) / (yhi - ylo)) * ih;

  const svg = chart(W, H, "Risk and return of each holding over the estimation window");
  for (let g = 0; g <= 4; g++) {
    const v = ylo + ((yhi - ylo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
  }
  svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(0), y2: Y(0), class: "chart-zero-strong" }));
  pts.forEach((p) => {
    svg.append(el("circle", { cx: X(p.vol), cy: Y(p.ret), r: 3.4, class: "dot-asset" }));
    svg.append(text(X(p.vol), Y(p.ret) - 7, p.t, "chart-tag-asset"));
  });
  [0.2, 0.4, 0.6].forEach((v) => { if (v < xhi) svg.append(text(X(v), H - 8, pc(v, 0), "chart-label")); });
  svg.append(text(pad.l + iw / 2, H - 0.5, "annualised volatility", "chart-label-sm"));
  host.replaceChildren(svg);
}

function drawCorrelation(r) {
  const host = $("#corr-chart");
  if (!host) return;
  const n = r.tickers.length;
  const size = 22;
  const pad = { t: 30, l: 46 };
  const W = 370;
  const H = pad.t + n * size + 12;
  const scale = Math.min(1, (W - pad.l - 8) / (n * size));
  const svg = chart(W, H, "Correlation matrix over the estimation window");
  const g = el("g", { transform: `translate(${pad.l},${pad.t}) scale(${scale})` });
  r.correlation.forEach((row, i) => {
    row.forEach((v, j) => {
      const rect = el("rect", {
        x: j * size, y: i * size, width: size - 1, height: size - 1,
        class: v >= 0 ? "corr-pos" : "corr-neg",
      });
      rect.style.setProperty("--v", Math.abs(v).toFixed(3));
      const title = document.createElementNS(NS, "title");
      title.textContent = `${r.tickers[i]} and ${r.tickers[j]}: ${dp(v)}`;
      rect.append(title);
      g.append(rect);
    });
    g.append(text(-6, i * size + size / 2 + 3, r.tickers[i], "chart-tag-asset", "end"));
  });
  svg.append(g);
  r.tickers.forEach((t, j) => {
    svg.append(text(pad.l + (j * size + size / 2) * scale, pad.t - 8, t, "chart-tag-asset"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   5 · weights and risk
   ------------------------------------------------------------ */
function buildWeightsTable(r) {
  const host = $("#weights-table");
  if (!host) return;
  const table = document.createElement("table");
  table.className = "fin-table";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Holding", "Weight", "Vol (2015)", "Expected return", "Share of risk", "Hold-out return"]
    .forEach((h, i) => {
      const th = document.createElement("th");
      th.textContent = h;
      if (i) th.className = "col-forecast";
      hr.append(th);
    });
  thead.append(hr);
  table.append(thead);
  const tbody = document.createElement("tbody");
  r.tickers.forEach((t, i) => {
    const c = COMPANIES.find((x) => x.ticker === t);
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = `${c ? c.name : t} (${t})`;
    tr.append(th);
    tr.append(cell(pc(r.weights[i]), r.weights[i] >= state.cap - 1e-6 ? "is-capped" : ""));
    tr.append(cell(pc(annualiseVol(Math.sqrt(r.S[i][i])))));
    tr.append(cell(signedPc(annualiseReturn(r.mu[i]))));
    tr.append(cell(pc(r.risk.share[i])));
    const px = PRICES_OOS[t];
    tr.append(cell(px ? signedPc(px[px.length - 1] / px[0] - 1) : "not held"));
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);

  const note = $("#weights-note");
  if (note) {
    const atCap = r.weights.filter((w) => w >= state.cap - 1e-6).length;
    const zero = r.weights.filter((w) => w < 0.005).length;
    note.textContent = atCap || zero
      ? `${atCap} holding${atCap === 1 ? " sits" : "s sit"} at the cap and ${zero} `
        + `${zero === 1 ? "gets" : "get"} nothing at all. That is what a mean-variance optimiser does `
        + "when it is handed estimates it believes: it goes to the corners. The cap is the only thing "
        + "standing between this portfolio and three holdings."
      : "No holding is at the cap and none is excluded, which is unusual for an unconstrained "
        + "optimisation on estimated inputs and is mostly the shrinkage dial doing its job.";
  }
}

function drawRisk(r) {
  const host = $("#risk-chart");
  if (!host) return;
  const W = 760;
  const n = r.tickers.length;
  const rowH = 26;
  const H = n * rowH + 34;
  const pad = { t: 22, r: 60, b: 12, l: 150 };
  const iw = W - pad.l - pad.r;
  const max = Math.max(...r.weights, ...r.risk.share, 0.05) * 1.05;

  const svg = chart(W, H, "Weight against share of risk for each holding");
  svg.append(text(pad.l, pad.t - 8, "share of the money, and share of the volatility", "chart-label-sm", "start"));
  r.tickers.forEach((t, i) => {
    const y = pad.t + i * rowH;
    svg.append(el("rect", {
      x: pad.l, y: y + 2, width: Math.max(1, (r.weights[i] / max) * iw), height: rowH / 2 - 3,
      class: "bar-weight",
    }));
    svg.append(el("rect", {
      x: pad.l, y: y + rowH / 2, width: Math.max(1, (r.risk.share[i] / max) * iw), height: rowH / 2 - 3,
      class: "bar-risk",
    }));
    svg.append(text(pad.l - 8, y + rowH / 2 + 2, t, "chart-row-label", "end"));
    svg.append(text(pad.l + (Math.max(r.weights[i], r.risk.share[i]) / max) * iw + 6,
      y + rowH / 2 + 2, `${pc(r.weights[i], 0)} · ${pc(r.risk.share[i], 0)}`, "chart-coef", "start"));
  });
  host.replaceChildren(svg);

  const note = $("#risk-note");
  if (note) {
    let worst = 0;
    r.tickers.forEach((t, i) => {
      if (r.risk.share[i] - r.weights[i] > r.risk.share[worst] - r.weights[worst]) worst = i;
    });
    note.textContent = `${r.tickers[worst]} takes ${pc(r.weights[worst], 0)} of the money and `
      + `${pc(r.risk.share[worst], 0)} of the risk. The two columns add to one hundred per cent `
      + "separately, and the gap between them for any holding is the reason risk budgeting exists "
      + "as a discipline distinct from choosing weights.";
  }
}

/* ------------------------------------------------------------
   6 · drawdown, annual, hindsight, rebalancing
   ------------------------------------------------------------ */
function drawDrawdown(r) {
  const host = $("#dd-chart");
  if (!host) return;
  const W = 370;
  const H = 230;
  const pad = { t: 14, r: 12, b: 30, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const u = r.holdout.chosen.underwater;
  const ue = r.holdout.equal.underwater;
  const lo = Math.min(...u, ...ue) * 1.05;
  const X = (i) => pad.l + (i / (u.length - 1)) * iw;
  const Y = (v) => pad.t + ((v - 0) / (lo - 0)) * ih;

  const svg = chart(W, H, "Drawdown through the hold-out window");
  for (let g = 0; g <= 4; g++) {
    const v = (lo * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
  }
  svg.append(el("path", {
    d: [...u.map((v, i) => [X(i), Y(v)]), [X(u.length - 1), Y(0)], [X(0), Y(0)]]
      .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z",
    class: "area-underwater",
  }));
  svg.append(path(ue.map((v, i) => [X(i), Y(v)]), "line-equal"));
  [2016, 2018, 2020].forEach((y) => {
    const i = DATES_OOS.findIndex((d) => d.startsWith(String(y)));
    if (i >= 0) svg.append(text(X(i), H - 8, String(y), "chart-label"));
  });
  host.replaceChildren(svg);
}

function drawAnnual(r) {
  const host = $("#annual-chart");
  if (!host) return;
  const years = r.holdout.chosen.annual;
  const W = 370;
  const H = 230;
  const pad = { t: 16, r: 12, b: 30, l: 44 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const vals = years.flatMap((y) => [y.ret, BENCHMARK_ANNUAL[y.year] ?? 0]);
  const lo = Math.min(...vals, 0) * 1.15;
  const hi = Math.max(...vals) * 1.15;
  const X = (i) => pad.l + ((i + 0.5) / years.length) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / (hi - lo)) * ih;
  const bw = (iw / years.length) * 0.32;

  const svg = chart(W, H, "Calendar-year returns against the index");
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
  }
  svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(0), y2: Y(0), class: "chart-zero-strong" }));
  years.forEach((y, i) => {
    const b = BENCHMARK_ANNUAL[y.year];
    svg.append(el("rect", {
      x: X(i) - bw - 1, y: Math.min(Y(y.ret), Y(0)), width: bw,
      height: Math.abs(Y(y.ret) - Y(0)), class: "bar-chosen",
    }));
    if (Number.isFinite(b)) {
      svg.append(el("rect", {
        x: X(i) + 1, y: Math.min(Y(b), Y(0)), width: bw,
        height: Math.abs(Y(b) - Y(0)), class: "bar-bench",
      }));
    }
    svg.append(text(X(i), H - 8, String(y.year), "chart-label"));
  });
  host.replaceChildren(svg);
}

function drawHindsight(r) {
  const host = $("#hindsight-chart");
  if (!host) return;
  const W = 760;
  const H = 300;
  const half = W / 2;
  const pad = { t: 30, b: 36, l: 52, r: 18 };
  const iw = half - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const panels = [
    { title: "estimated on 2015", front: r.frontier.efficient, chosen: r.points.chosen, equal: r.points.equal, x0: 0 },
    { title: "what 2016 to 2020 offered", front: r.realised.frontier.efficient, chosen: r.realised.chosen, equal: r.realised.equal, x0: half },
  ];
  const allV = panels.flatMap((p) => [...p.front.map((q) => q.vol), p.chosen.vol, p.equal.vol]);
  const allR = panels.flatMap((p) => [...p.front.map((q) => q.ret), p.chosen.ret, p.equal.ret]);
  const xhi = Math.max(...allV) * 1.08;
  const ylo = Math.min(...allR, 0) * 1.15;
  const yhi = Math.max(...allR) * 1.12;

  const svg = chart(W, H, "The estimated frontier against the frontier that was actually available");
  panels.forEach((p) => {
    const X = (v) => p.x0 + pad.l + (v / xhi) * iw;
    const Y = (v) => pad.t + ih - ((v - ylo) / (yhi - ylo)) * ih;
    svg.append(text(p.x0 + pad.l, pad.t - 12, p.title, "chart-label-sm", "start"));
    for (let g = 0; g <= 4; g++) {
      const v = ylo + ((yhi - ylo) * g) / 4;
      svg.append(el("line", { x1: p.x0 + pad.l, x2: p.x0 + half - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
      if (p.x0 === 0) svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
    }
    svg.append(el("line", { x1: p.x0 + pad.l, x2: p.x0 + half - pad.r, y1: Y(0), y2: Y(0), class: "chart-zero-strong" }));
    svg.append(path(p.front.map((q) => [X(q.vol), Y(q.ret)]), "line-frontier"));
    svg.append(el("circle", { cx: X(p.equal.vol), cy: Y(p.equal.ret), r: 4.5, class: "dot-equal" }));
    svg.append(el("circle", { cx: X(p.chosen.vol), cy: Y(p.chosen.ret), r: 6, class: "dot-chosen" }));
    [0.1, 0.2, 0.3].forEach((v) => {
      if (v < xhi) svg.append(text(X(v), H - 16, pc(v, 0), "chart-label"));
    });
    svg.append(text(p.x0 + pad.l + iw / 2, H - 2, "annualised volatility", "chart-label-sm"));
  });
  host.replaceChildren(svg);

  const note = $("#hindsight-note");
  if (note) {
    const gapVol = r.realised.chosen.vol - r.points.chosen.vol;
    note.textContent = `The estimate said ${pc(r.points.chosen.vol)} volatility; the five years that `
      + `followed delivered ${pc(r.realised.chosen.vol)}, ${gapVol > 0 ? "more" : "less"} by `
      + `${pc(Math.abs(gapVol))}. On the right, the large dot is where the chosen weights actually `
      + "landed and the curve is the best that was available with hindsight. The distance between "
      + "them is the cost of estimating fifty-five numbers from a single year, and no amount of care "
      + "in the optimisation closes it.";
  }
}

function drawRebalance(r) {
  const host = $("#rebal-chart");
  if (!host) return;
  const testable = r.testable;
  const w = r.tickers.map((t, i) => (testable.includes(t) ? r.weights[i] : 0));
  const total = w.reduce((a, b) => a + b, 0);
  const renorm = testable.map((t) => w[r.tickers.indexOf(t)] / (total || 1));
  const hold = backtest(renorm, PRICES_OOS, testable, { mode: "hold" });
  const rebal = backtest(renorm, PRICES_OOS, testable, { mode: "rebalance" });

  const W = 760;
  const H = 260;
  const pad = { t: 16, r: 66, b: 30, l: 52 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;
  const all = [...hold, ...rebal];
  const lo = Math.min(...all) * 0.98;
  const hi = Math.max(...all) * 1.02;
  const X = (i) => pad.l + (i / (hold.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / (hi - lo)) * ih;

  const svg = chart(W, H, "Buy and hold against rebalancing, same weights");
  for (let g = 0; g <= 4; g++) {
    const v = lo + ((hi - lo) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, `£${dp(v * 10, 1)}m`, "chart-label", "end"));
  }
  svg.append(path(hold.map((v, i) => [X(i), Y(v)]), "line-hold"));
  svg.append(path(rebal.map((v, i) => [X(i), Y(v)]), "line-rebal"));
  svg.append(text(W - pad.r + 4, Y(hold[hold.length - 1]) + 3, "buy and hold", "chart-label-sm", "start"));
  svg.append(text(W - pad.r + 4, Y(rebal[rebal.length - 1]) + 3, "rebalanced", "chart-label-sm", "start"));
  [2016, 2018, 2020].forEach((y) => {
    const i = DATES_OOS.findIndex((d) => d.startsWith(String(y)));
    if (i >= 0) svg.append(text(X(i), H - 8, String(y), "chart-label"));
  });
  host.replaceChildren(svg);

  const label = $("#rebal-label");
  if (label) label.textContent = `${state.strategy === "equal" ? "equal weights" : "the chosen weights"}, both conventions`;
  const note = $("#rebal-note");
  if (note) {
    const gap = rebal[rebal.length - 1] - hold[hold.length - 1];
    note.textContent = `The same weights end at £${dp(hold[hold.length - 1] * 10, 2)}m held and `
      + `£${dp(rebal[rebal.length - 1] * 10, 2)}m rebalanced, a difference of `
      + `${pc(Math.abs(gap / hold[hold.length - 1]))} of the final value. `
      + "Individually these holdings are far more volatile than the portfolio is, and rebalancing "
      + "harvests that gap; buy and hold lets the winners run instead. Neither is right, but "
      + "reporting one while describing the other is how a backtest ends up meaning nothing.";
  }
}

/* ------------------------------------------------------------
   render
   ------------------------------------------------------------ */
function render() {
  const r = run(state);
  paintControls();
  writeUrl();

  $$("[data-strategy]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.strategy === state.strategy)));
  $$("[data-mode]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.mode === state.mode)));
  $$("[data-universe]").forEach((b) =>
    b.setAttribute("aria-pressed", String((b.dataset.universe === "all") === state.useAll)));

  const blurb = $("#strategy-blurb");
  if (blurb) blurb.textContent = STRATEGY_BLURB[state.strategy];

  const reset = $("#reset-drivers");
  if (reset) {
    reset.hidden = edited.size === 0;
    reset.textContent = `Reset ${edited.size} edited input${edited.size === 1 ? "" : "s"}`;
  }

  const c = r.holdout.chosen.performance;
  const e = r.holdout.equal.performance;
  const gap = c.cumulative - e.cumulative;

  const verdict = $("#verdict");
  if (verdict) {
    verdict.dataset.state = gap >= 0 ? "up" : "down";
    $(".verdict-value", verdict).textContent = signedPc(gap);
    $(".verdict-detail", verdict).textContent = gap >= 0
      ? `The chosen weights returned ${pc(c.cumulative)} against ${pc(e.cumulative)} for equal weight, `
        + `at ${pc(c.vol)} volatility against ${pc(e.vol)}. On this window the optimisation earned its keep.`
      : `The chosen weights returned ${pc(c.cumulative)} against ${pc(e.cumulative)} for equal weight, `
        + `at ${pc(c.vol)} volatility against ${pc(e.vol)}. Estimating a covariance matrix from one year `
        + "and optimising against it did not beat putting the same amount in each, which is the most "
        + "reliably reproduced result in the portfolio-choice literature and is worth meeting once in person.";
  }

  const tiles = {
    ret: pc(c.cumulative),
    cagr: pc(c.cagr),
    vol: pc(c.vol),
    sharpe: dp(c.sharpe),
    dd: pc(c.maxDrawdown),
    concentration: pc(Math.max(...r.weights)),
  };
  Object.entries(tiles).forEach(([k, v]) => {
    const node = $(`[data-tile="${k}"] .tile-value`);
    if (node) node.textContent = v;
  });
  const expected = $("#vol-expected");
  if (expected) expected.textContent = pc(r.points.chosen.vol);
  const ddTile = $('[data-tile="dd"]');
  if (ddTile) ddTile.dataset.tone = c.maxDrawdown < -0.35 ? "bad" : c.maxDrawdown < -0.25 ? "warn" : "good";
  const volTile = $('[data-tile="vol"]');
  if (volTile) volTile.dataset.tone = c.vol > r.points.chosen.vol * 1.15 ? "warn" : "good";

  drawFrontier(r);
  drawNav(r);
  buildScreenTable();
  drawScatter(r);
  drawCorrelation(r);
  buildWeightsTable(r);
  drawRisk(r);
  drawDrawdown(r);
  drawAnnual(r);
  drawHindsight(r);
  drawRebalance(r);
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#fund")) return;

  const title = $("#fund-title");
  if (title) title.textContent = "Ten FTSE 250 holdings, screened and optimised";
  const meta = $("#fund-meta");
  if (meta) {
    meta.textContent = `estimated on ${DATES_2015.length} trading days of 2015 · held through `
      + `${DATES_OOS.length} days to 2020 · £10m at the start`;
  }
  const note = $("#fund-note");
  if (note) {
    note.textContent = `${CHECKS.companies} candidates survived the fundamental screen and ${CHECKS.held} were held. `
      + "Prices are daily closes in pence. Everything on this page is computed in your browser from "
      + "those prices: the covariance matrix, the frontier, the weights and the five-year test.";
  }
  const attribution = $("#attribution");
  if (attribution) {
    attribution.textContent = "Prices and company fundamentals were collected from a Bloomberg terminal "
      + "and cross-checked against Yahoo Finance. This is a demonstration of method on ten UK mid-cap "
      + "shares over one historical window. It is not a recommendation, not a live strategy, and not "
      + "advice; past performance of a backtest is worth less than past performance of a real fund, "
      + "which is already worth very little.";
  }

  buildControls();
  readUrl();

  $$("[data-strategy]").forEach((b) => b.addEventListener("click", () => {
    state.strategy = b.dataset.strategy;
    render();
  }));
  $$("[data-mode]").forEach((b) => b.addEventListener("click", () => {
    state.mode = b.dataset.mode;
    render();
  }));
  $$("[data-universe]").forEach((b) => b.addEventListener("click", () => {
    state.useAll = b.dataset.universe === "all";
    render();
  }));
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
    a.download = `portfolio-${state.strategy}.csv`;
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
        entries.forEach((x) => {
          const a = links.get(x.target.id);
          if (a && x.isIntersecting) {
            links.forEach((y) => y.removeAttribute("aria-current"));
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
