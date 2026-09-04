/* frontier.js: the charts and the interaction for the
   portfolio-construction case study. `frontier.model.js` holds
   the arithmetic; everything here is recomputed from one call so
   the views cannot disagree. */

import {
  COMPANIES, HELD, TICKERS, DATES_2015, DATES_OOS, BENCHMARK_ANNUAL, CHECKS,
  DEFAULTS, DRIVERS, run, toCsv, screen, SCREEN_DEFAULTS, CAPM, capmExpected,
  annualiseReturn, annualiseVol, PRICES_OOS, PRICES_2015, returnMatrix, yearTable,
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
  asbuilt: "The fund as it was actually built: weights set so that each holding contributes the same amount of variance, which for a portfolio of ten mid-caps means the calmest names get the most money. It uses the volatilities and takes no view on returns.",
  tangency: "The highest Sharpe ratio available on the estimated frontier. It is also the point that leans hardest on the expected returns, which are the least reliable thing in the estimate.",
  minvar: "The lowest variance available under the constraints. It needs no view on returns at all, only the covariance matrix, which is the half of the estimate worth trusting.",
  equal: "The same amount in each. No estimation, no optimisation, and the benchmark that every clever method has to beat before it has earned its keep.",
  inverse: "Weights proportional to one over each holding's variance. It uses the volatilities and ignores every correlation, which is a real strategy rather than an approximation to one.",
};

function readUrl() {
  const q = new URLSearchParams(location.search);
  const s = q.get("s");
  if (s && STRATEGY_BLURB[s]) state.strategy = s;
  if (q.get("mode") === "hold") state.mode = "hold";
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
   6 · drawdown, annual
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

/* ------------------------------------------------------------
   the security market line
   ------------------------------------------------------------ */
function drawSml() {
  const host = $("#sml-chart");
  if (!host) return;
  const W = 760;
  const H = 330;
  const pad = { t: 20, r: 24, b: 40, l: 58 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  /* Required return comes off the line; realised return is the
     2015 daily mean annualised, computed here from the same
     matrix the covariance is built from, so the two halves of
     the page cannot drift apart. */
  const R = returnMatrix(PRICES_2015, TICKERS);
  const realised = TICKERS.map((_, j) =>
    annualiseReturn(R.reduce((acc, row) => acc + row[j], 0) / R.length));
  const pts = TICKERS.map((t, j) => {
    const c = COMPANIES.find((x) => x.ticker === t);
    return {
      ticker: t, beta: c.beta, required: capmExpected(c.beta),
      realised: realised[j], held: HELD.includes(t),
    };
  });

  const blo = Math.min(...pts.map((p) => p.beta), 0) - 0.2;
  const bhi = Math.max(...pts.map((p) => p.beta)) + 0.2;
  const vals = [...pts.map((p) => p.realised), ...pts.map((p) => p.required),
    capmExpected(blo), capmExpected(bhi)];
  const ylo = Math.min(...vals) - 0.06;
  const yhi = Math.max(...vals) + 0.06;
  const X = (v) => pad.l + ((v - blo) / (bhi - blo)) * iw;
  const Y = (v) => pad.t + ih - ((v - ylo) / (yhi - ylo)) * ih;

  const svg = chart(W, H, "What the security market line asks of each candidate, against what 2015 delivered");
  for (let g = 0; g <= 5; g++) {
    const v = ylo + ((yhi - ylo) * g) / 5;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
  }
  svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(0), y2: Y(0), class: "chart-zero-strong" }));
  svg.append(el("line", {
    x1: X(blo), y1: Y(capmExpected(blo)), x2: X(bhi), y2: Y(capmExpected(bhi)), class: "line-sml",
  }));
  svg.append(text(X(bhi) - 4, Y(capmExpected(bhi)) - 8, "required by CAPM", "chart-label-sm", "end"));

  /* The gap is the point of the chart, so it is drawn rather
     than left to the eye to measure. */
  pts.forEach((p) => {
    svg.append(el("line", {
      x1: X(p.beta), x2: X(p.beta), y1: Y(p.required), y2: Y(p.realised), class: "chart-stem",
    }));
  });

  /* Labels collide badly around beta 0.5, where six of the
     thirteen sit. Place each one above its dot if that box is
     free, otherwise below, otherwise further out. */
  const taken = [];
  const free = (x, y) => !taken.some((t) => Math.abs(t.x - x) < 26 && Math.abs(t.y - y) < 11);
  pts.forEach((p) => {
    const cx = X(p.beta);
    const cy = Y(p.realised);
    svg.append(el("circle", {
      cx, cy, r: p.held ? 5 : 3.4, class: p.held ? "dot-chosen" : "dot-asset",
    }));
    const y = [cy - 10, cy + 15, cy - 22, cy + 27].find((c) => free(cx, c)) ?? cy - 10;
    taken.push({ x: cx, y });
    svg.append(text(cx, y, p.ticker, p.held ? "chart-tag-held" : "chart-tag-asset"));
  });

  [-0.5, 0, 0.5, 1].forEach((b) => {
    if (b > blo && b < bhi) svg.append(text(X(b), H - 16, dp(b, 1), "chart-label"));
  });
  svg.append(text(pad.l + iw / 2, H - 3, "beta", "chart-label-sm"));
  host.replaceChildren(svg);

  const label = $("#sml-label");
  if (label) label.textContent = `risk-free ${pc(CAPM.riskFree, 2)} · market ${pc(CAPM.marketReturn, 1)}`;
  const note = $("#sml-note");
  if (note) {
    const above = pts.filter((p) => p.realised > p.required);
    const gap = Math.max(...pts.map((p) => Math.abs(p.realised - p.required)));
    note.textContent = "The dashed line is what each beta has to earn. The dots are what 2015 actually "
      + `paid, and the stem between them is the difference. ${above.length} of the ${pts.length} `
      + `candidates cleared the line that year and the widest miss either way is ${pc(gap)}, which is `
      + "far too large to read as mispricing: it is what one year of daily prices looks like when you "
      + `ask it for an expected return. ${HELD.length} of these went into the fund, and only `
      + `${pts.filter((p) => p.held && p.realised > p.required).length} of them had cleared the line in `
      + "that year, which is a fair sign that the choosing was not done on this chart. One of them, KLR, "
      + "has a negative beta, so the line asks it for less than cash and it drags the fund's whole "
      + "market sensitivity down.";
  }
}

/* ------------------------------------------------------------
   composition: weights, and what each contributes to beta
   ------------------------------------------------------------ */
function drawWeightsChart(r) {
  const host = $("#weights-chart");
  if (!host) return;
  const W = 370;
  const rowH = 22;
  const H = r.tickers.length * rowH + 24;
  const pad = { t: 12, r: 54, b: 8, l: 62 };
  const iw = W - pad.l - pad.r;
  const max = Math.max(...r.weights) * 1.05;
  const svg = chart(W, H, "Weight of each holding");
  r.tickers.forEach((t, i) => {
    const y = pad.t + i * rowH;
    svg.append(el("rect", {
      x: pad.l, y: y + 3, width: Math.max(1, (r.weights[i] / max) * iw), height: rowH - 9,
      class: "bar-weight",
    }));
    svg.append(text(pad.l - 8, y + rowH / 2 + 1, t, "chart-row-label", "end"));
    svg.append(text(pad.l + (r.weights[i] / max) * iw + 6, y + rowH / 2 + 1,
      pc(r.weights[i]), "chart-coef", "start"));
  });
  host.replaceChildren(svg);
}

function drawBeta(r) {
  const host = $("#beta-chart");
  if (!host) return;
  const rows = r.beta.rows;
  const W = 370;
  const rowH = 22;
  const H = rows.length * rowH + 24;
  const pad = { t: 12, r: 54, b: 8, l: 62 };
  const iw = W - pad.l - pad.r;
  const max = Math.max(...rows.map((x) => Math.abs(x.contribution))) * 1.1;
  const X = (v) => pad.l + ((v + max) / (2 * max)) * iw;
  const svg = chart(W, H, "Beta contribution of each holding");
  svg.append(el("line", { x1: X(0), x2: X(0), y1: pad.t, y2: H - pad.b, class: "chart-zero-strong" }));
  rows.forEach((x, i) => {
    const y = pad.t + i * rowH;
    svg.append(el("rect", {
      x: Math.min(X(0), X(x.contribution)), y: y + 3,
      width: Math.max(1, Math.abs(X(x.contribution) - X(0))), height: rowH - 9,
      class: x.contribution < 0 ? "bar-negbeta" : "bar-risk",
    }));
    svg.append(text(pad.l - 8, y + rowH / 2 + 1, x.ticker, "chart-row-label", "end"));
    svg.append(text(W - pad.r + 4, y + rowH / 2 + 1, dp(x.contribution), "chart-coef", "start"));
  });
  host.replaceChildren(svg);

  const note = $("#beta-note");
  if (note) {
    const neg = rows.filter((x) => x.beta < 0).map((x) => x.ticker);
    note.textContent = `The contributions add to ${dp(r.beta.portfolio)}, so the fund carries about `
      + `${Math.round(r.beta.portfolio * 100)}% of the market's sensitivity. `
      + (neg.length
        ? `${neg.join(" and ")} contributes negatively, which is what pulls the total below the average of its parts.`
        : "No holding contributes negatively at these weights.");
  }
}

/* ------------------------------------------------------------
   the year table, and the two years worth reading
   ------------------------------------------------------------ */
function buildYearsTable(years, equalPerf) {
  const host = $("#years-table");
  if (!host) return;
  const table = document.createElement("table");
  table.className = "fin-table";
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  ["Year", "Portfolio", "FTSE 250", "Alpha", "Volatility", "Sharpe", "Treynor"].forEach((h, i) => {
    const th = document.createElement("th");
    th.textContent = h;
    if (i) th.className = "col-forecast";
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);

  const tbody = document.createElement("tbody");
  years.forEach((y) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = String(y.year);
    tr.append(th);
    tr.append(cell(signedPc(y.ret), y.ret < 0 ? "is-negative" : ""));
    tr.append(cell(signedPc(y.benchmark)));
    tr.append(cell(signedPc(y.alpha), y.alpha > 0 ? "is-positive" : "is-negative"));
    tr.append(cell(pc(y.vol)));
    tr.append(cell(dp(y.sharpe)));
    tr.append(cell(dp(y.treynor)));
    tbody.append(tr);
  });
  const m = (f) => years.reduce((a, y) => a + f(y), 0) / years.length;
  const avg = document.createElement("tr");
  avg.className = "is-total has-rule";
  const th = document.createElement("th");
  th.scope = "row";
  th.textContent = "Average";
  avg.append(th);
  avg.append(cell(signedPc(m((y) => y.ret))));
  avg.append(cell(signedPc(m((y) => y.benchmark ?? 0))));
  avg.append(cell(signedPc(m((y) => y.alpha))));
  avg.append(cell(pc(m((y) => y.vol))));
  avg.append(cell(""));
  avg.append(cell(""));
  tbody.append(avg);
  table.append(tbody);
  host.replaceChildren(table);

  const note = $("#years-note");
  if (note) {
    const beat = years.filter((y) => y.beatIndex).length;
    note.textContent = `The fund beat the index in ${beat} of the ${years.length} years and averaged `
      + `${pc(m((y) => y.ret))} against ${pc(m((y) => y.benchmark ?? 0))}. `
      + `Weighting the same ten holdings equally would have returned ${pc(equalPerf.cumulative)} over the `
      + "whole period, which is the comparison worth keeping in view: at ten holdings, which ten they are "
      + "matters more than how they are weighted.";
  }
}

function writeScenarios(years, r) {
  const y2017 = years.find((y) => y.year === 2017);
  const y2020 = years.find((y) => y.year === 2020);
  const a = $("#scenario-2017");
  if (a && y2017) {
    a.textContent = `The mid-cap index rose ${pc(y2017.benchmark)} and the fund returned `
      + `${pc(y2017.ret)}, at a beta of ${dp(r.beta.portfolio)}. Market exposure alone would have earned `
      + `about ${pc(CAPM.riskFree + r.beta.portfolio * (y2017.benchmark - CAPM.riskFree))}, so most of the `
      + `rest is stock selection: ${signedPc(y2017.alpha)} of alpha, at the lowest volatility of the five `
      + `years, ${pc(y2017.vol)}, for a Sharpe of ${dp(y2017.sharpe)}.`;
  }
  const b = $("#scenario-2020");
  if (b && y2020) {
    b.textContent = `The index fell ${pc(Math.abs(y2020.benchmark))} across the year and the fund still `
      + `returned ${signedPc(y2020.ret)}, but the path was violent: volatility reached ${pc(y2020.vol)}, `
      + `twice any other year here, and the deepest drawdown of the whole period, `
      + `${pc(r.holdout.chosen.performance.maxDrawdown)}, arrived inside a few weeks in February and March. `
      + "Holding low-beta names did not prevent that, because in those weeks almost everything fell together.";
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
  const years = yearTable(r.holdout.chosen.nav, DATES_OOS, r.beta.portfolio);
  const finalNav = r.holdout.chosen.nav[r.holdout.chosen.nav.length - 1] * 10;
  const avg = years.reduce((a, y) => a + y.ret, 0) / years.length;
  const avgBench = years.reduce((a, y) => a + (y.benchmark ?? 0), 0) / years.length;
  const benchCum = years.reduce((a, y) => a * (1 + (y.benchmark ?? 0)), 1) - 1;
  const beat = years.filter((y) => y.beatIndex).length;

  const verdict = $("#verdict");
  if (verdict) {
    verdict.dataset.state = c.cumulative >= 0 ? "up" : "down";
    $(".verdict-value", verdict).textContent = `\u00a3${dp(finalNav, 2)}m`;
    $(".verdict-detail", verdict).textContent =
      `\u00a310m put into these ten holdings at the start of 2016 and rebalanced back to the same `
      + `weights finished at \u00a3${dp(finalNav, 2)}m, a cumulative ${signedPc(c.cumulative)} against `
      + `${signedPc(benchCum)} for the FTSE 250 compounded over the same years. It beat `
      + `the index in ${beat} of the ${years.length} years, at a beta of ${dp(r.beta.portfolio)}, so a little `
      + "over half the market's sensitivity. The deepest hole along the way was "
      + `${pc(c.maxDrawdown)}, in the spring of 2020.`;
  }

  const tiles = {
    ret: signedPc(c.cumulative),
    cagr: pc(c.cagr),
    beta: dp(r.beta.portfolio),
    sharpe: dp(c.sharpe),
    dd: pc(c.maxDrawdown),
    vsindex: `${signedPc(avg)} v ${signedPc(avgBench)}`,
  };
  Object.entries(tiles).forEach(([k, v]) => {
    const node = $(`[data-tile="${k}"] .tile-value`);
    if (node) node.textContent = v;
  });
  const ddTile = $('[data-tile="dd"]');
  if (ddTile) ddTile.dataset.tone = c.maxDrawdown < -0.35 ? "bad" : c.maxDrawdown < -0.25 ? "warn" : "good";
  const vsTile = $('[data-tile="vsindex"]');
  if (vsTile) vsTile.dataset.tone = avg > avgBench ? "good" : "warn";

  drawFrontier(r);
  drawNav(r);
  buildScreenTable();
  drawScatter(r);
  drawCorrelation(r);
  buildWeightsTable(r);
  drawRisk(r);
  drawDrawdown(r);
  drawAnnual(r);
  drawSml();
  drawWeightsChart(r);
  drawBeta(r);
  buildYearsTable(years, r.holdout.equal.performance);
  writeScenarios(years, r);
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#fund")) return;

  const title = $("#fund-title");
  if (title) title.textContent = "The fund as it was built, reproduced from daily closes";
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
