/* ============================================================
   dsex.js — the charts and the interaction.

   Six views over one series, all recomputed from the same
   analyse() call so they can never disagree with each other:

     1. the index, with drawdown episodes shaded
     2. rolling volatility, window on a slider
     3. the underwater curve
     4. the return distribution against a normal curve
     5. holding-period outcomes by horizon — the money chart
     6. a calendar-year table

   Charts are hand-drawn inline SVG. No library: they inherit the
   theme's colours, they are a few hundred bytes each, and the
   site already draws its own charts everywhere else.
   ============================================================ */

import {
  analyse, simulate, parseCsv, toCsv, HORIZONS, holdingPeriod,
} from "/portfolio/dsex.model.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });
const pc = (v, d = 1) =>
  Number.isFinite(v) ? `${(d === 1 ? n1 : n2).format(v * 100)}%` : "—";
const signedPc = (v) =>
  Number.isFinite(v) ? `${v >= 0 ? "+" : ""}${n1.format(v * 100)}%` : "—";
const num = (v) => (Number.isFinite(v) ? n0.format(v) : "—");

const fmtDate = (d) =>
  d ? new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB",
    { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" }) : "—";

/* ------------------------------------------------------------
   SVG helpers
   ------------------------------------------------------------ */
const NS = "http://www.w3.org/2000/svg";
const el = (tag, attrs = {}) => {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  return n;
};
function chart(w, h, label) {
  const svg = el("svg", {
    viewBox: `0 0 ${w} ${h}`, class: "fin-chart", role: "img", "aria-label": label,
  });
  return svg;
}
const text = (x, y, s, cls = "chart-label", anchor = "middle") => {
  const t = el("text", { x, y, class: cls, "text-anchor": anchor });
  t.textContent = s;
  return t;
};

/* Year ticks, at most `max` of them, taken from the date array. */
function yearTicks(dates, max = 8) {
  const seen = new Map();
  dates.forEach((d, i) => {
    const y = d.slice(0, 4);
    if (!seen.has(y)) seen.set(y, i);
  });
  const years = [...seen.entries()];
  const stride = Math.max(1, Math.ceil(years.length / max));
  return years.filter((_, i) => i % stride === 0);
}

/* ------------------------------------------------------------
   1. the index, with the worst drawdowns shaded
   ------------------------------------------------------------ */
function drawIndex(host, a, { log = false } = {}) {
  const W = 760;
  const H = 260;
  const pad = { t: 12, r: 8, b: 24, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const vals = log ? a.prices.map(Math.log) : a.prices;
  const lo = Math.min(...vals);
  const hi = Math.max(...vals);
  const span = hi - lo || 1;
  const X = (i) => pad.l + (i / (a.prices.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / span) * ih;

  const svg = chart(W, H, "Index level over time");

  // shade the drawdown episodes, deepest first
  a.episodes.slice(0, 3).forEach((e) => {
    const x1 = X(e.peakIndex);
    const x2 = X(e.recoveryIndex ?? a.prices.length - 1);
    svg.append(el("rect", {
      x: x1, y: pad.t, width: Math.max(1, x2 - x1), height: ih, class: "dd-band",
    }));
  });

  // gridlines + axis labels
  for (let g = 0; g <= 4; g++) {
    const v = lo + (span * g) / 4;
    const y = Y(v);
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: y, y2: y, class: "chart-grid" }));
    svg.append(text(pad.l - 6, y + 3,
      log ? n0.format(Math.exp(v)) : n0.format(v), "chart-label", "end"));
  }

  const d = vals.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  svg.append(el("path", { d, class: "line-index", fill: "none" }));

  yearTicks(a.dates).forEach(([y, i]) =>
    svg.append(text(X(i), H - 7, y, "chart-label")));

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   2. rolling volatility
   ------------------------------------------------------------ */
function drawVol(host, a) {
  const W = 760;
  const H = 200;
  const pad = { t: 12, r: 8, b: 24, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const vals = a.rollingVol;
  const finite = vals.filter(Number.isFinite);
  const hi = Math.max(...finite) * 1.05 || 1;
  const X = (i) => pad.l + (i / (vals.length - 1)) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, `${a.volWindow}-day rolling annualised volatility`);

  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, `${Math.round(v * 100)}%`, "chart-label", "end"));
  }

  // the full-period average, for a sense of what "high" means here
  const avg = finite.reduce((s, x) => s + x, 0) / finite.length;
  svg.append(el("line", {
    x1: pad.l, x2: W - pad.r, y1: Y(avg), y2: Y(avg), class: "chart-mean",
  }));
  svg.append(text(W - pad.r - 2, Y(avg) - 5,
    `average ${pc(avg)}`, "chart-value", "end"));

  let d = "";
  let started = false;
  vals.forEach((v, i) => {
    if (!Number.isFinite(v)) return;
    d += `${started ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`;
    started = true;
  });
  svg.append(el("path", { d, class: "line-vol", fill: "none" }));

  // the returns array is one shorter than prices, so shift the ticks
  yearTicks(a.dates.slice(1)).forEach(([y, i]) =>
    svg.append(text(X(i), H - 7, y, "chart-label")));

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   3. underwater
   ------------------------------------------------------------ */
function drawUnderwater(host, a) {
  const W = 760;
  const H = 190;
  const pad = { t: 12, r: 8, b: 24, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const worst = Math.min(...a.drawdown, -0.01);
  const X = (i) => pad.l + (i / (a.drawdown.length - 1)) * iw;
  const Y = (v) => pad.t + (v / worst) * ih;

  const svg = chart(W, H, "Drawdown from the previous peak");

  for (let g = 0; g <= 4; g++) {
    const v = (worst * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, `${Math.round(v * 100)}%`, "chart-label", "end"));
  }

  const top = a.drawdown.map((v, i) => `${i ? "L" : "M"}${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(" ");
  svg.append(el("path", {
    d: `${top} L${X(a.drawdown.length - 1).toFixed(1)},${Y(0)} L${X(0)},${Y(0)} Z`,
    class: "area-underwater",
  }));
  svg.append(el("path", { d: top, class: "line-underwater", fill: "none" }));

  yearTicks(a.dates).forEach(([y, i]) =>
    svg.append(text(X(i), H - 7, y, "chart-label")));

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   4. the distribution, against a normal with the same mean and sd
   ------------------------------------------------------------ */
function drawHistogram(host, a) {
  const W = 760;
  const H = 230;
  const pad = { t: 12, r: 8, b: 26, l: 40 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const bins = a.histogram;
  const hi = Math.max(...bins.map((b) => Math.max(b.count, b.normal))) || 1;
  const bw = iw / bins.length;
  const X = (i) => pad.l + i * bw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Distribution of daily returns against a normal curve");

  bins.forEach((b, i) => {
    svg.append(el("rect", {
      x: X(i) + 0.5, y: Y(b.count), width: Math.max(1, bw - 1),
      height: Math.max(0, pad.t + ih - Y(b.count)), class: "bar-hist",
    }));
  });

  const d = bins.map((b, i) =>
    `${i ? "L" : "M"}${(X(i) + bw / 2).toFixed(1)},${Y(b.normal).toFixed(1)}`).join(" ");
  svg.append(el("path", { d, class: "line-normal", fill: "none" }));

  // x labels at the extremes and the middle
  [0, Math.floor(bins.length / 2), bins.length - 1].forEach((i) =>
    svg.append(text(X(i) + bw / 2, H - 8, pc(bins[i].mid, 1), "chart-label")));

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   5. holding periods — the chart the whole page is for
   ------------------------------------------------------------ */
function drawHorizons(host, a) {
  const W = 760;
  const H = 250;
  const pad = { t: 16, r: 8, b: 40, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const rows = a.horizons.filter((h) => h.count > 0);
  const band = iw / rows.length;
  const bw = Math.min(48, band * 0.6);

  const svg = chart(W, H, "Share of holding periods that ended positive, by horizon");

  for (let g = 0; g <= 4; g++) {
    const v = g / 4;
    const y = pad.t + ih - v * ih;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: y, y2: y, class: "chart-grid" }));
    svg.append(text(pad.l - 6, y + 3, `${Math.round(v * 100)}%`, "chart-label", "end"));
  }

  // the break-even line: above this, most start dates made money
  const halfY = pad.t + ih - 0.5 * ih;
  svg.append(el("line", {
    x1: pad.l, x2: W - pad.r, y1: halfY, y2: halfY, class: "chart-mean",
  }));

  rows.forEach((h, i) => {
    const cx = pad.l + band * i + band / 2;
    const barH = h.positive * ih;
    svg.append(el("rect", {
      x: cx - bw / 2, y: pad.t + ih - barH, width: bw, height: Math.max(0, barH),
      rx: 3, class: "bar-horizon",
    }));
    svg.append(text(cx, pad.t + ih - barH - 5, `${Math.round(h.positive * 100)}%`, "chart-value"));
    svg.append(text(cx, H - 22, h.label, "chart-label"));
    svg.append(text(cx, H - 9, `worst ${signedPc(h.worst)}`, "chart-label-sm"));
  });

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   tables
   ------------------------------------------------------------ */
function drawEpisodes(host, a) {
  const table = document.createElement("table");
  table.className = "fin-table";
  table.innerHTML =
    "<thead><tr><th>Peak</th><th>Trough</th><th>Depth</th>" +
    "<th>Peak→trough</th><th>Recovery</th><th>Time to recover</th></tr></thead>";
  const tb = document.createElement("tbody");
  a.episodes.forEach((e) => {
    const tr = document.createElement("tr");
    const cells = [
      fmtDate(e.peakDate),
      fmtDate(e.troughDate),
      pc(e.depth),
      `${num(e.declineDays)} days`,
      e.recovered ? fmtDate(e.recoveryDate) : "still underwater",
      e.recovered ? `${num(e.recoveryDays)} days` : "—",
    ];
    cells.forEach((c, i) => {
      const td = document.createElement("td");
      td.textContent = c;
      if (i === 2) td.classList.add("is-negative");
      if (!e.recovered && i === 4) td.classList.add("is-negative");
      tr.append(td);
    });
    tb.append(tr);
  });
  table.append(tb);
  host.replaceChildren(table);
}

function drawCalendar(host, a) {
  const table = document.createElement("table");
  table.className = "fin-table";
  table.innerHTML =
    "<thead><tr><th>Year</th><th>Return</th><th>Volatility</th><th>Worst drawdown</th></tr></thead>";
  const tb = document.createElement("tbody");
  a.calendar.forEach((y) => {
    const tr = document.createElement("tr");
    [[y.year, ""], [signedPc(y.return), y.return < 0 ? "is-negative" : "is-positive"],
     [pc(y.vol), ""], [pc(y.maxDrawdown), "is-negative"]].forEach(([v, cls]) => {
      const td = document.createElement("td");
      td.textContent = v;
      if (cls) td.classList.add(cls);
      tr.append(td);
    });
    tb.append(tr);
  });
  table.append(tb);
  host.replaceChildren(table);
}

function drawTails(host, a) {
  const table = document.createElement("table");
  table.className = "fin-table";
  table.innerHTML =
    "<thead><tr><th>Move</th><th>Days that happened</th>" +
    "<th>Days a normal distribution predicts</th><th>Ratio</th></tr></thead>";
  const tb = document.createElement("tbody");
  a.tails.forEach((t) => {
    const tr = document.createElement("tr");
    const ratio = t.expected > 0 ? t.actual / t.expected : Infinity;
    [`beyond ${t.sigma}σ`, num(t.actual), n1.format(t.expected),
     t.expected > 0.05 ? `${n1.format(ratio)}×` : "—"].forEach((v, i) => {
      const td = document.createElement("td");
      td.textContent = v;
      if (i === 3 && ratio > 2) td.classList.add("is-negative");
      tr.append(td);
    });
    tb.append(tr);
  });
  table.append(tb);
  host.replaceChildren(table);
}

/* ------------------------------------------------------------
   state + render
   ------------------------------------------------------------ */
const state = { series: null, volWindow: 60, log: false, horizonDays: 252 };

function render() {
  const a = analyse(state.series, { volWindow: state.volWindow });
  const s = a.stats;

  // header
  $("#series-name") && ($("#series-name").textContent = state.series.name);
  $("#series-note") && ($("#series-note").textContent = state.series.note);
  $("#series-range") && ($("#series-range").textContent =
    `${fmtDate(a.dates[0])} → ${fmtDate(a.dates[a.dates.length - 1])} · ${num(s.observations)} observations`);

  const banner = $("#sim-banner");
  if (banner) banner.hidden = !state.series.simulated;

  // tiles
  const tiles = {
    cagr: signedPc(s.cagr),
    vol: pc(s.vol),
    mdd: pc(s.maxDrawdown),
    best: signedPc(s.bestDay),
    worst: signedPc(s.worstDay),
    kurt: n2.format(s.kurtosis),
  };
  Object.entries(tiles).forEach(([k, v]) => {
    const t = $(`[data-tile="${k}"] .tile-value`);
    if (t) t.textContent = v;
  });
  const mddTile = $('[data-tile="mdd"]');
  if (mddTile) mddTile.dataset.tone = s.maxDrawdown < -0.4 ? "bad" : s.maxDrawdown < -0.2 ? "warn" : "good";

  // charts
  drawIndex($("#chart-index"), a, { log: state.log });
  drawVol($("#chart-vol"), a);
  drawUnderwater($("#chart-underwater"), a);
  drawHistogram($("#chart-hist"), a);
  drawHorizons($("#chart-horizons"), a);
  drawEpisodes($("#table-episodes"), a);
  drawCalendar($("#table-calendar"), a);
  drawTails($("#table-tails"), a);

  // the volatility readout
  $("#vol-window-value") && ($("#vol-window-value").textContent = `${state.volWindow} days`);
  const live = a.rollingVol.filter(Number.isFinite);
  $("#vol-readout") && ($("#vol-readout").textContent =
    `Over this series the ${state.volWindow}-day figure ranged from ${pc(Math.min(...live))} to ` +
    `${pc(Math.max(...live))}. A single annualised number: ${pc(s.vol)} here: hides all of that.`);

  // the holding-period explorer
  const hp = holdingPeriod(a.prices, state.horizonDays);
  const label = HORIZONS.find((h) => h.days === state.horizonDays)?.label
    ?? `${state.horizonDays} days`;
  $("#hp-label") && ($("#hp-label").textContent = label);
  const hpOut = {
    hppos: pc(hp.positive),
    hpworst: signedPc(hp.worst),
    hpmed: signedPc(hp.median),
    hpbest: signedPc(hp.best),
  };
  Object.entries(hpOut).forEach(([k, v]) => {
    const t = $(`[data-tile="${k}"] .tile-value`);
    if (t) t.textContent = v;
  });
  $("#hp-readout") && ($("#hp-readout").textContent =
    `Of the ${num(hp.count)} times you could have started a ${label.toLowerCase()} hold and seen it through, ` +
    `${pc(hp.positive)} ended up. The worst finished ${signedPc(hp.worst)}; the best ${signedPc(hp.best)}. ` +
    `Nine times in ten the outcome landed between ${signedPc(hp.p05)} and ${signedPc(hp.p95)}.`);

  // tail risk prose
  $("#tail-readout") && ($("#tail-readout").textContent =
    `On the worst 5% of days this series fell more than ${pc(Math.abs(s.var95))}; ` +
    `averaged across those days the fall was ${pc(Math.abs(s.es95))}. ` +
    `At the 1% tail those become ${pc(Math.abs(s.var99))} and ${pc(Math.abs(s.es99))}. ` +
    `Excess kurtosis of ${n2.format(s.kurtosis)} means the extremes are far more common than a bell curve allows, ` +
    `which is why value-at-risk alone is not a risk system.`);

  $("#cluster-readout") && ($("#cluster-readout").textContent =
    `Returns themselves are barely autocorrelated (${n2.format(s.acReturns)} at one day's lag): yesterday's direction ` +
    `says almost nothing about today's. But the SIZE of the move is: |return| autocorrelates at ${n2.format(s.acAbsReturns)}. ` +
    `Violent days cluster with violent days. That is why volatility is forecastable when direction is not.`);

  return a;
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#dsex")) return;
  state.series = simulate();

  $("#vol-window")?.addEventListener("input", (e) => {
    state.volWindow = Number(e.target.value);
    const i = e.target;
    i.style.setProperty("--pct",
      `${((i.value - i.min) / (i.max - i.min)) * 100}%`);
    render();
  });

  $("#log-scale")?.addEventListener("click", (e) => {
    state.log = !state.log;
    e.currentTarget.setAttribute("aria-pressed", String(state.log));
    render();
  });

  $$("[data-horizon]").forEach((b) => b.addEventListener("click", () => {
    state.horizonDays = Number(b.dataset.horizon);
    $$("[data-horizon]").forEach((x) =>
      x.setAttribute("aria-pressed", String(x === b)));
    render();
  }));

  /* ---------- CSV import ---------- */
  const drop = $("#csv-drop");
  const status = $("#csv-status");

  const load = (textContent) => {
    const { series, errors } = parseCsv(textContent);
    if (series.prices.length < 30) {
      status.dataset.state = "bad";
      status.textContent =
        `Only ${series.prices.length} usable rows found: this analysis needs at least 30. ` +
        `Expected two columns: a date and a closing level.` +
        (errors.length ? ` First problem: ${errors[0]}` : "");
      return;
    }
    state.series = series;
    status.dataset.state = "ok";
    status.textContent =
      `Loaded ${num(series.prices.length)} rows, ${fmtDate(series.dates[0])} to ` +
      `${fmtDate(series.dates[series.dates.length - 1])}.` +
      (errors.length ? ` ${errors.length} row(s) skipped.` : "") +
      " Nothing was uploaded; this ran in your browser.";
    render();
  };

  $("#csv-file")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (file) load(await file.text());
  });

  /* Any paste with more than one row gets parsed. The first version
     gated on a character count, which meant a short paste did nothing
     at all AND left the previous "loaded fine" message sitting above
     it — so a reader who pasted four rows was told their earlier file
     was still in use. Silence is the wrong answer to bad input. */
  $("#csv-paste")?.addEventListener("input", (e) => {
    const value = e.target.value;
    if (!value.trim()) {
      if (status) { status.dataset.state = ""; status.textContent = ""; }
      return;
    }
    if (value.trim().split(/\r?\n/).filter(Boolean).length >= 2) load(value);
  });

  if (drop) {
    ["dragover", "dragenter"].forEach((ev) =>
      drop.addEventListener(ev, (e) => { e.preventDefault(); drop.dataset.over = "1"; }));
    ["dragleave", "drop"].forEach((ev) =>
      drop.addEventListener(ev, () => delete drop.dataset.over));
    drop.addEventListener("drop", async (e) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file) load(await file.text());
    });
  }

  $("#use-sim")?.addEventListener("click", () => {
    state.series = simulate();
    if (status) { status.dataset.state = ""; status.textContent = ""; }
    const paste = $("#csv-paste");
    if (paste) paste.value = "";
    render();
  });

  $("#download-csv")?.addEventListener("click", () => {
    const a = analyse(state.series, { volWindow: state.volWindow });
    const blob = new Blob([toCsv(a, state.series)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${state.series.short}-analysis.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  render();
}

init();
