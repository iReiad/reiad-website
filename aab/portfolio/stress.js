/* ============================================================
   stress.js: the dashboard around the stress test.

   Same split as the other case studies. stress.model.js holds
   the arithmetic and is checked on its own by stress.test.ts;
   this turns it into something you can argue with.

   ------------------------------------------------------------
   ONE THING IS DIFFERENT HERE, AND IT IS WORTH EXPLAINING

   The other pages recompute everything on every input event.
   This one cannot: a full run is three milliseconds, but the
   sensitivity grid is twenty-five runs, the reverse stress test
   is forty, and the tornado is eight. Doing all of that between
   two frames of a dragged slider drops the frame.

   So the render is in two halves. The headline run, the tiles,
   the tables and every chart that comes from one run go through
   immediately. The three expensive views are scheduled, and a
   new input cancels the pending one rather than queueing behind
   it. Drag a slider and the page keeps up; let go and the grid
   catches up a moment later, marked as stale while it does.

   Charts are hand-drawn inline SVG, no library, same as
   everywhere else on this site: they inherit the theme's
   colours, they are a few hundred bytes each, and they print.
   ============================================================ */

import {
  BOOK, SEGMENTS, MACRO, SCENARIOS, DEFAULTS, DRIVERS,
  run, sensitivity, tornado, reverseStress, vintageCurves,
  correlation, anchorZ, lgdFromCollateral, lgdSigma, riskWeight,
  parsePortfolioCsv, bookFor, toCsv,
} from "/portfolio/stress.model.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

const crore = (v) => (Number.isFinite(v) ? n0.format(Math.round(v)) : "–");
/* Percentages are written with a fixed number of decimals rather
   than through Intl, which drops trailing zeros: a capital ratio
   printed as "7%" beside a requirement printed as "7.0%" reads
   as two different numbers. The guard is for a rounded value of
   minus zero, which is a real thing a headroom of −0.4bp does. */
const pc = (v, d = 1) => {
  if (!Number.isFinite(v)) return "–";
  const out = (v * 100).toFixed(d);
  return `${Number(out) === 0 ? (0).toFixed(d) : out}%`;
};
const pp = (v, d = 1) => (Number.isFinite(v) ? `${(d === 2 ? n2 : n1).format(v)}` : "–");
const signedBps = (v) =>
  Number.isFinite(v) ? `${v >= 0 ? "+" : "−"}${n0.format(Math.abs(Math.round(v)))} bps` : "–";
const sigma = (v) => (Number.isFinite(v) ? `${n2.format(v)}σ` : "–");
const oneIn = (v) =>
  !Number.isFinite(v) ? "no shock at all"
    : v > 5000 ? "rarer than one year in five thousand"
      : `about one year in ${n0.format(Math.round(v))}`;

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

/* ------------------------------------------------------------
   state
   ------------------------------------------------------------ */
const state = { ...DEFAULTS };
const edited = new Set();
let segments = SEGMENTS;
let book = BOOK;
let lastGrid = null;
let vintageSegment = "home";

function readUrl() {
  const q = new URLSearchParams(location.search);
  const s = q.get("s");
  if (s && SCENARIOS[s]) applyScenario(s);
  if (q.get("engine") === "vintage") state.engine = "vintage";
  const basis = q.get("rwa");
  if (basis === "ttc" || basis === "pit" || basis === "hybrid") state.rwaBasis = basis;
  if (q.get("seg") && SEGMENTS.some((x) => x.id === q.get("seg"))) vintageSegment = q.get("seg");
  DRIVERS.forEach((d) => {
    const v = q.get(d.key);
    if (v === null) return;
    const num = Number(v);
    if (Number.isFinite(num)) { state[d.key] = num; edited.add(d.key); }
  });
}

function writeUrl() {
  const q = new URLSearchParams();
  q.set("s", state.scenario);
  if (state.engine !== DEFAULTS.engine) q.set("engine", state.engine);
  if (state.rwaBasis !== DEFAULTS.rwaBasis) q.set("rwa", state.rwaBasis);
  if (vintageSegment !== "home") q.set("seg", vintageSegment);
  edited.forEach((k) => q.set(k, String(+state[k].toFixed(6))));
  history.replaceState(null, "", `${location.pathname}?${q}`);
}

/** Load one of the named scenarios into the sliders. */
function applyScenario(id) {
  const sc = SCENARIOS[id];
  if (!sc) return;
  state.scenario = id;
  MACRO.forEach((m) => {
    state[m.key] = sc.peaks[m.key] ?? 0;
    edited.delete(m.key);
  });
}

/* Moving a macro slider means this is no longer one of the three
   named scenarios, and saying so is more honest than leaving the
   Adverse button lit under a path nobody published. */
function markCustom(key) {
  if (MACRO.some((m) => m.key === key)) state.scenario = "custom";
}

/* ------------------------------------------------------------
   controls
   ------------------------------------------------------------ */
const fmtDriver = (d, raw) => {
  switch (d.fmt) {
    case "pp": return `${raw >= 0 ? "+" : "−"}${n1.format(Math.abs(raw))}pp`;
    case "pct": return `${raw >= 0 ? "+" : "−"}${n1.format(Math.abs(raw))}%`;
    case "pct01": return `${n0.format(raw * 100)}%`;
    case "q": return `${n0.format(raw)}Q`;
    default: return `${n2.format(raw)}×`;
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
    markCustom(key);
    render();
  });
}

function paintControls() {
  DRIVERS.forEach((d) => {
    const wrap = $(`.driver[data-key="${d.key}"]`);
    if (!wrap) return;
    const input = $("input", wrap);
    const val = $(".val", wrap);
    const raw = state[d.key];
    input.value = String(raw);
    const p = ((raw - d.min) / (d.max - d.min)) * 100;
    input.style.setProperty("--pct", `${Math.max(0, Math.min(100, p))}%`);
    val.textContent = fmtDriver(d, raw);
    wrap.toggleAttribute("data-edited", edited.has(d.key));
    /* The underwriting response is the one input only the vintage
       engine can see. Dimmed rather than hidden, so it never
       disappears from under the pointer. */
    wrap.toggleAttribute("data-inactive",
      d.key === "underwriting" && state.engine !== "vintage");
  });
}

/* ------------------------------------------------------------
   the segment table
   ------------------------------------------------------------ */
const KIND_LABEL = {
  mortgage: "Mortgage", retail: "Other retail",
  qrre: "Revolving retail", corporate: "Corporate",
};

function buildBookTable(r) {
  const host = $("#book-table");
  if (!host) return;
  const table = document.createElement("table");
  table.className = "fin-table";

  const head = ["Segment", "Basel class", "Exposure", "Undrawn", "PD", "LGD", "ρ",
    "Risk weight", "Stressed PD", "Stressed LGD", "3yr loss"];
  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  head.forEach((h, i) => {
    const th = document.createElement("th");
    th.textContent = h;
    if (i > 1) th.className = "col-forecast";
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);

  const tbody = document.createElement("tbody");
  const worst = r.trough.q - 1;
  r.runs.forEach((seg) => {
    const s = seg.seg;
    const q = seg.quarters[worst];
    const peak = seg.quarters.reduce((w, x) => (x.pd > w.pd ? x : w), seg.quarters[0]);
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = s.name;
    tr.append(th);
    [
      KIND_LABEL[s.kind] ?? s.kind,
      crore(s.ead),
      s.undrawn ? crore(s.undrawn) : "–",
      pc(s.pdTtc, 2),
      pc(s.lgdBase),
      n2.format(seg.rho),
      pc(riskWeight({
        pd: s.pdTtc, lgd: s.lgdBase, kind: s.kind, maturity: s.maturity,
        sizeAdjustment: s.sizeAdjustment ?? 0, scale: state.correlationScale,
      })),
      pc(peak.pd, 2),
      pc(peak.lgd),
      crore(seg.quarters[seg.quarters.length - 1].cumulativeLoss),
    ].forEach((v, i) => {
      const td = document.createElement("td");
      td.textContent = v;
      if (i === 0) td.className = "cell-prose";
      tr.append(td);
    });
    tbody.append(tr);
  });

  const total = document.createElement("tr");
  total.className = "is-total has-rule";
  const th = document.createElement("th");
  th.scope = "row";
  th.textContent = "The book";
  total.append(th);
  const last = r.quarters[r.quarters.length - 1];
  const peakQ = r.quarters.reduce((w, x) => (x.pd > w.pd ? x : w), r.quarters[0]);
  [
    "", crore(r.totalEad), crore(segments.reduce((t, s) => t + (s.undrawn ?? 0), 0)),
    pc(r.quarters[0].pd, 2), pc(r.quarters[0].lgd), "",
    pc(r.openingRwa / r.totalEad),
    pc(peakQ.pd, 2), pc(peakQ.lgd), crore(last.cumulativeLoss),
  ].forEach((v) => {
    const td = document.createElement("td");
    td.textContent = v;
    total.append(td);
  });
  tbody.append(total);

  table.append(tbody);
  host.replaceChildren(table);
}

/* ------------------------------------------------------------
   1 · the capital path
   ------------------------------------------------------------ */
function drawCapital(r) {
  const host = $("#capital-chart");
  if (!host) return;
  const W = 760;
  const H = 260;
  const pad = { t: 14, r: 54, b: 26, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const vals = r.quarters.map((q) => q.ratio);
  const hi = Math.max(...vals, book.requirement) * 1.08;
  const lo = Math.min(...vals, book.minimumCet1, 0) * 1.05;
  const span = hi - lo || 1;
  const X = (i) => pad.l + (i / (r.quarters.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - lo) / span) * ih;

  const svg = chart(W, H, "Common equity tier 1 ratio through the scenario");

  for (let g = 0; g <= 4; g++) {
    const v = lo + (span * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, `${n0.format(v * 100)}%`, "chart-label", "end"));
  }

  // the shortfall, shaded, before the line so the line sits on top
  const below = r.quarters
    .map((q, i) => [i, q])
    .filter(([, q]) => q.ratio < book.requirement);
  if (below.length) {
    const top = Y(book.requirement);
    below.forEach(([i, q]) => {
      const x = X(i);
      const w = Math.max(2, iw / (r.quarters.length - 1) * 0.7);
      svg.append(el("rect", {
        x: x - w / 2, y: top, width: w, height: Math.max(0, Y(q.ratio) - top),
        class: "shortfall-band",
      }));
    });
  }

  [
    [book.requirement, "Requirement 7.0%", "chart-req"],
    [book.minimumCet1, "Minimum 4.5%", "chart-min"],
  ].forEach(([v, label, cls]) => {
    if (v < lo || v > hi) return;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: cls }));
    svg.append(text(W - pad.r + 4, Y(v) + 3, label, "chart-label-sm", "start"));
  });

  svg.append(path(r.quarters.map((q, i) => [X(i), Y(q.ratio)]), "line-capital"));
  r.quarters.forEach((q, i) => {
    svg.append(el("circle", {
      cx: X(i), cy: Y(q.ratio), r: q.q === r.trough.q ? 4 : 2.2,
      class: q.q === r.trough.q ? "dot-trough" : "dot-capital",
    }));
  });
  svg.append(text(X(r.trough.q), Y(r.trough.ratio) - 12, pc(r.trough.ratio, 2), "chart-value"));

  r.quarters.forEach((q, i) => {
    if (i % 2) return;
    svg.append(text(X(i), H - 8, i === 0 ? "now" : `Q${q.q}`, "chart-label"));
  });

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   2 · the scenario, as six small charts
   ------------------------------------------------------------ */
function drawMacro(r) {
  const host = $("#macro-charts");
  if (!host) return;

  host.replaceChildren(...MACRO.map((m) => {
    const W = 230;
    const H = 96;
    const pad = { t: 16, r: 6, b: 16, l: 30 };
    const iw = W - pad.l - pad.r;
    const ih = H - pad.t - pad.b;
    const vals = r.path.map((p) => p.levels[m.key]);
    const hi = Math.max(...vals, m.base);
    const lo = Math.min(...vals, m.base);
    const padSpan = (hi - lo) * 0.25 || Math.max(0.5, Math.abs(m.base) * 0.05);
    const top = hi + padSpan;
    const bottom = lo - padSpan;
    const span = top - bottom || 1;
    const X = (i) => pad.l + (i / (vals.length - 1)) * iw;
    const Y = (v) => pad.t + ih - ((v - bottom) / span) * ih;

    const svg = chart(W, H, `${m.label} through the scenario`);
    svg.append(el("line", {
      x1: pad.l, x2: W - pad.r, y1: Y(m.base), y2: Y(m.base), class: "chart-base-line",
    }));
    svg.append(text(pad.l - 4, Y(top) + 8, pp(top), "chart-label-sm", "end"));
    svg.append(text(pad.l - 4, Y(bottom), pp(bottom), "chart-label-sm", "end"));
    svg.append(path(vals.map((v, i) => [X(i), Y(v)]), "line-macro"));

    const end = vals[vals.length - 1];
    const worst = m.badWhen === "down" ? Math.min(...vals) : Math.max(...vals);
    svg.append(el("circle", { cx: X(vals.indexOf(worst)), cy: Y(worst), r: 2.6, class: "dot-macro" }));
    svg.append(text(pad.l, 11, m.short, "chart-row-label", "start"));
    svg.append(text(W - pad.r, 11,
      `${worst >= m.base ? "+" : "−"}${n1.format(Math.abs(worst - m.base))}${m.unit}`,
      "chart-tag-worst", "end"));

    const fig = document.createElement("figure");
    fig.className = "macro-cell";
    fig.append(svg);
    const cap = document.createElement("figcaption");
    cap.className = "mono";
    cap.textContent = `${m.label}: ${pp(end, 1)}${m.unit === "pp" ? "%" : "%"} at the end`;
    cap.title = m.help;
    fig.append(cap);
    return fig;
  }));
}

/* ------------------------------------------------------------
   3 · default rates by segment
   ------------------------------------------------------------ */
function drawPd(r) {
  const host = $("#pd-chart");
  if (!host) return;
  const W = 760;
  const H = 280;
  const pad = { t: 12, r: 128, b: 26, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const all = r.runs.flatMap((s) => s.quarters.map((q) => q.pd));
  const hi = Math.max(...all) * 1.08 || 0.1;
  const X = (i) => pad.l + (i / r.runs[0].quarters.length) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Point-in-time default rate by segment");
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v), "chart-label", "end"));
  }

  const ends = [];
  r.runs.forEach((seg, i) => {
    const pts = [[X(0), Y(seg.seg.pdTtc)], ...seg.quarters.map((q, j) => [X(j + 1), Y(q.pd)])];
    svg.append(path(pts, "line-seg", { "data-seg": i % 7 }));
    ends.push({ y: Y(seg.quarters[seg.quarters.length - 1].pd), name: seg.seg.name, i });
  });

  // labels at the right edge, nudged apart so they never overlap
  ends.sort((a, b) => a.y - b.y);
  let prev = -99;
  ends.forEach((e) => {
    const y = Math.max(e.y, prev + 12);
    prev = y;
    const t = text(W - pad.r + 6, y + 3, e.name, "chart-seg-label", "start");
    t.setAttribute("data-seg", e.i % 7);
    svg.append(t);
  });

  r.quarters.forEach((q, i) => {
    if (i % 2) return;
    svg.append(text(X(i), H - 8, i === 0 ? "now" : `Q${q.q}`, "chart-label"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   4 · vintage curves
   ------------------------------------------------------------ */
function buildVintagePicker() {
  const host = $("#vintage-picker");
  if (!host || host.dataset.built) return;
  host.dataset.built = "1";
  host.replaceChildren(...SEGMENTS.map((s) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.dataset.vseg = s.id;
    b.textContent = s.name;
    b.addEventListener("click", () => { vintageSegment = s.id; render(); });
    return b;
  }));
}

function drawVintage(r) {
  const host = $("#vintage-chart");
  if (!host) return;
  const seg = segments.find((s) => s.id === vintageSegment) ?? segments[0];
  $$("[data-vseg]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.vseg === seg.id)));
  const label = $("#vintage-seg-label");
  if (label) label.textContent = `${seg.name}, one line per origination year`;

  const curves = vintageCurves(seg, r.path, state);
  const W = 760;
  const H = 280;
  const pad = { t: 12, r: 58, b: 30, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const maxAge = Math.max(...curves.map((c) => c.points[c.points.length - 1].age));
  const hi = Math.max(...curves.flatMap((c) => c.points.map((p) => p.cum))) * 1.1 || 0.05;
  const X = (a) => pad.l + (a / maxAge) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, `Cumulative default rate by months on book, ${seg.name}`);
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v), "chart-label", "end"));
  }

  const ends = [];
  curves.forEach((c, i) => {
    const solid = c.points.filter((p) => !p.projected);
    const dashed = c.points.filter((p, j) => p.projected || j === solid.length - 1);
    if (solid.length > 1) {
      svg.append(path(solid.map((p) => [X(p.age), Y(p.cum)]), "line-vintage", { "data-v": i % 7 }));
    }
    if (dashed.length > 1) {
      svg.append(path(dashed.map((p) => [X(p.age), Y(p.cum)]), "line-vintage is-projected",
        { "data-v": i % 7 }));
    }
    const last = c.points[c.points.length - 1];
    ends.push({ x: X(last.age), y: Y(last.cum), label: c.label, i });
  });

  /* The cohorts finish at different ages but similar heights, so
     the labels have to be nudged apart or the two worst vintages
     print on top of each other. */
  ends.sort((a, b) => a.y - b.y);
  let prevY = -99;
  ends.forEach((e) => {
    const y = Math.max(e.y, prevY + 11);
    prevY = y;
    const t = text(e.x + 5, y + 3, e.label, "chart-seg-label", "start");
    t.setAttribute("data-v", e.i % 7);
    svg.append(t);
  });

  for (let a = 0; a <= maxAge; a += 12) {
    svg.append(text(X(a), H - 10, String(a), "chart-label"));
  }
  svg.append(text(pad.l + iw / 2, H - 1, "months on book", "chart-label-sm"));
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   5 · the two engines
   ------------------------------------------------------------ */
function drawEngines(r) {
  const host = $("#engine-chart");
  if (!host) return;
  const W = 760;
  const H = 240;
  const pad = { t: 12, r: 12, b: 26, l: 46 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const qs = r.quarters;
  const hi = Math.max(...qs.map((q) => Math.max(q.pdMerton, q.pdVintageLink))) * 1.12 || 0.1;
  const X = (i) => pad.l + (i / (qs.length - 1)) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Portfolio default rate under both engines");
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v), "chart-label", "end"));
  }

  // the gap, shaded: this is the thing the chart is here to show
  const band = [
    ...qs.map((q, i) => [X(i), Y(q.pdMerton)]),
    ...qs.map((q, i) => [X(qs.length - 1 - i), Y(qs[qs.length - 1 - i].pdVintageLink)]),
  ];
  svg.append(el("path", {
    d: band.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z",
    class: "engine-gap",
  }));

  svg.append(path(qs.map((q, i) => [X(i), Y(q.pdMerton)]), "line-merton"));
  svg.append(path(qs.map((q, i) => [X(i), Y(q.pdVintageLink)]), "line-vintage-engine"));

  qs.forEach((q, i) => {
    if (i % 2) return;
    svg.append(text(X(i), H - 8, i === 0 ? "now" : `Q${q.q}`, "chart-label"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   6 · loss given default, as the option it is
   ------------------------------------------------------------ */
function drawLgd(r) {
  const host = $("#lgd-chart");
  if (!host) return;
  const W = 370;
  const H = 220;
  const pad = { t: 12, r: 12, b: 30, l: 42 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const secured = segments.filter((s) => lgdSigma(s) !== null).slice(0, 4);
  const shocks = Array.from({ length: 41 }, (_, i) => -0.5 + i * 0.0125);
  const curves = secured.map((s) => ({
    seg: s,
    pts: shocks.map((sh) => [sh, lgdFromCollateral(s.collateralCoverage, s.sellingCosts,
      lgdSigma(s), sh * (s.collateralBeta ?? 1))]),
  }));
  const hi = Math.max(...curves.flatMap((c) => c.pts.map((p) => p[1]))) * 1.08 || 1;
  const X = (sh) => pad.l + ((sh + 0.5) / 0.55) * iw;
  const Y = (v) => pad.t + ih - (v / hi) * ih;

  const svg = chart(W, H, "Loss given default against collateral prices");
  for (let g = 0; g <= 4; g++) {
    const v = (hi * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, pc(v, 0), "chart-label", "end"));
  }

  const now = Math.min(...r.path.map((p) => p.levels.property)) / 100;
  svg.append(el("line", { x1: X(now), x2: X(now), y1: pad.t, y2: pad.t + ih, class: "chart-event" }));
  svg.append(text(X(now), pad.t + 9, "this scenario", "chart-label-sm",
    now < -0.25 ? "start" : "end"));

  curves.forEach((c, i) => {
    svg.append(path(c.pts.map((p) => [X(p[0]), Y(p[1])]), "line-seg", { "data-seg": i % 7 }));
    const at = c.pts.find((p) => p[0] >= now) ?? c.pts[0];
    svg.append(el("circle", { cx: X(at[0]), cy: Y(at[1]), r: 3, class: "dot-seg", "data-seg": i % 7 }));
  });

  [-0.4, -0.2, 0].forEach((sh) =>
    svg.append(text(X(sh), H - 10, `${n0.format(sh * 100)}%`, "chart-label")));
  svg.append(text(pad.l + iw / 2, H - 1, "collateral prices", "chart-label-sm"));
  host.replaceChildren(svg);
}

/** PD and LGD indexed to their starting level, on one pair of axes. */
function drawWhammy(r) {
  const host = $("#whammy-chart");
  if (!host) return;
  const W = 370;
  const H = 220;
  const pad = { t: 12, r: 12, b: 30, l: 42 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const qs = r.quarters;
  const pd0 = qs[0].pd;
  const lgd0 = qs[0].lgd;
  const idxPd = qs.map((q) => q.pd / pd0);
  const idxLgd = qs.map((q) => q.lgd / lgd0);
  const idxEl = qs.map((q, i) => idxPd[i] * idxLgd[i]);
  const hi = Math.max(...idxEl) * 1.1 || 2;
  const X = (i) => pad.l + (i / (qs.length - 1)) * iw;
  const Y = (v) => pad.t + ih - ((v - 1) / (hi - 1 || 1)) * ih;

  const svg = chart(W, H, "Default rate and loss given default, indexed");
  for (let g = 0; g <= 4; g++) {
    const v = 1 + ((hi - 1) * g) / 4;
    svg.append(el("line", { x1: pad.l, x2: W - pad.r, y1: Y(v), y2: Y(v), class: "chart-grid" }));
    svg.append(text(pad.l - 6, Y(v) + 3, `${n1.format(v)}×`, "chart-label", "end"));
  }
  svg.append(path(qs.map((q, i) => [X(i), Y(idxEl[i])]), "line-el"));
  svg.append(path(qs.map((q, i) => [X(i), Y(idxPd[i])]), "line-merton"));
  svg.append(path(qs.map((q, i) => [X(i), Y(idxLgd[i])]), "line-lgd"));

  const peak = idxEl.indexOf(Math.max(...idxEl));
  svg.append(text(X(peak), Y(idxEl[peak]) - 8, `expected loss ${n1.format(idxEl[peak])}×`,
    "chart-value", peak > qs.length - 4 ? "end" : "middle"));
  svg.append(text(X(qs.length - 1), Y(idxPd[qs.length - 1]) + 12, "default rate", "chart-label-sm", "end"));
  svg.append(text(X(qs.length - 1), Y(idxLgd[qs.length - 1]) + 12, "loss given default", "chart-label-sm", "end"));

  qs.forEach((q, i) => {
    if (i % 3) return;
    svg.append(text(X(i), H - 10, i === 0 ? "now" : `Q${q.q}`, "chart-label"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   7 · IFRS 9 staging
   ------------------------------------------------------------ */
function drawStages(r) {
  const host = $("#stage-chart");
  if (!host) return;
  const W = 760;
  const H = 280;
  const pad = { t: 14, r: 54, b: 26, l: 52 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const qs = r.quarters;
  const total = Math.max(...qs.map((q) => q.stage1 + q.stage2 + q.stage3));
  const X = (i) => pad.l + (i / (qs.length - 1)) * iw;
  const Y = (v) => pad.t + ih - (v / total) * ih;

  const svg = chart(W, H, "Exposure by IFRS 9 stage, with the allowance");

  const layers = [
    ["stage1", (q) => [0, q.stage1]],
    ["stage2", (q) => [q.stage1, q.stage1 + q.stage2]],
    ["stage3", (q) => [q.stage1 + q.stage2, q.stage1 + q.stage2 + q.stage3]],
  ];
  layers.forEach(([name, band]) => {
    const upper = qs.map((q, i) => [X(i), Y(band(q)[1])]);
    const lower = qs.map((q, i) => [X(qs.length - 1 - i), Y(band(qs[qs.length - 1 - i])[0])]);
    svg.append(el("path", {
      d: [...upper, ...lower].map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
        .join(" ") + " Z",
      class: `area-${name}`,
    }));
  });

  for (let g = 0; g <= 4; g++) {
    const v = (total * g) / 4;
    svg.append(text(pad.l - 6, Y(v) + 3, n0.format(v), "chart-label", "end"));
  }

  // the allowance, on its own scale, over the top
  const eclHi = Math.max(...qs.map((q) => q.ecl ?? 0)) * 1.25 || 1;
  const Ye = (v) => pad.t + ih - (v / eclHi) * ih;
  svg.append(path(qs.map((q, i) => [X(i), Ye(q.ecl ?? 0)]), "line-ecl"));
  const endEcl = qs[qs.length - 1].ecl ?? 0;
  svg.append(text(W - pad.r - 4, Ye(endEcl) - 8, "allowance", "chart-label-sm", "end"));
  /* The allowance runs on its own scale up the right-hand edge.
     Its own end label sits above the line, so the tick nearest
     that height is dropped rather than printed underneath it. */
  for (let g = 1; g <= 4; g++) {
    const v = (eclHi * g) / 4;
    if (Math.abs(Ye(v) - Ye(endEcl)) < 12) continue;
    svg.append(text(W - pad.r + 4, Ye(v) + 3, n0.format(v), "chart-label-sm", "start"));
  }

  qs.forEach((q, i) => {
    if (i % 2) return;
    svg.append(text(X(i), H - 8, i === 0 ? "now" : `Q${q.q}`, "chart-label"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   8 · the severity axis, and the attribution
   ------------------------------------------------------------ */
function drawSeverity(r) {
  const host = $("#severity-chart");
  if (!host) return;
  const W = 370;
  const H = 200;
  const pad = { t: 20, r: 12, b: 30, l: 12 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const lo = -4;
  const hi = 3;
  const X = (z) => pad.l + ((z - lo) / (hi - lo)) * iw;
  const dens = (z) => Math.exp(-(z * z) / 2) / Math.sqrt(2 * Math.PI);
  const peak = dens(0);
  const Y = (d) => pad.t + ih - (d / peak) * ih;

  const svg = chart(W, H, "Where this scenario sits against the capital rule");
  const pts = Array.from({ length: 141 }, (_, i) => {
    const z = lo + (i / 140) * (hi - lo);
    return [X(z), Y(dens(z))];
  });
  svg.append(el("path", {
    d: [...pts, [X(hi), Y(0)], [X(lo), Y(0)]]
      .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z",
    class: "density-body",
  }));

  const tail = pts.filter((p, i) => lo + (i / 140) * (hi - lo) <= r.worstZ);
  if (tail.length > 1) {
    svg.append(el("path", {
      d: [...tail, [tail[tail.length - 1][0], Y(0)], [X(lo), Y(0)]]
        .map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z",
      class: "density-tail",
    }));
  }

  /* Two marks that are often within a few tenths of each other,
     so they get their own heights rather than their own guesses
     about which way to align. */
  [
    [r.worstZ, "this scenario", "mark-scenario", pad.t - 10, "start"],
    [r.capitalZ, "the capital rule", "mark-capital", pad.t + 4, "start"],
  ].forEach(([z, label, cls, labelY, anchor]) => {
    const x = X(Math.max(lo, Math.min(hi, z)));
    svg.append(el("line", { x1: x, x2: x, y1: pad.t - 6, y2: Y(0), class: cls }));
    svg.append(text(x + 3, labelY, label, "chart-label-sm", anchor));
  });

  [-3, -2, -1, 0, 1].forEach((z) =>
    svg.append(text(X(z), H - 12, `${z}σ`, "chart-label")));
  svg.append(text(pad.l + iw / 2, H - 1, "the economy, in standard deviations", "chart-label-sm"));
  host.replaceChildren(svg);
}

function drawAttribution(r) {
  const host = $("#attrib-chart");
  if (!host) return;
  const W = 370;
  const H = 200;
  const pad = { t: 24, r: 74, b: 26, l: 130 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const rows = [
    { label: "Losses and provisions", v: r.attribution.fromCapital },
    { label: "Risk weights rising", v: r.attribution.fromRwa },
    { label: "Total", v: r.attribution.totalBps, total: true },
  ];
  const max = Math.max(...rows.map((x) => Math.abs(x.v)), 1);
  const X = (v) => pad.l + (Math.abs(v) / max) * iw;
  const bandH = ih / rows.length;

  const svg = chart(W, H, "Why the capital ratio moved");
  rows.forEach((row, i) => {
    const y = pad.t + i * bandH + bandH * 0.22;
    const h = bandH * 0.5;
    svg.append(el("rect", {
      x: pad.l, y, width: Math.max(1, X(row.v) - pad.l), height: h,
      class: row.total ? "attrib-total" : row.v < 0 ? "attrib-bad" : "attrib-good",
    }));
    svg.append(text(pad.l - 8, y + h / 2 + 4, row.label, "chart-row-label", "end"));
    svg.append(text(X(row.v) + 6, y + h / 2 + 4, signedBps(row.v), "chart-coef", "start"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   9 · the tornado
   ------------------------------------------------------------ */
function drawTornado(t) {
  const host = $("#tornado-chart");
  if (!host) return;
  const W = 370;
  const H = 240;
  const pad = { t: 14, r: 46, b: 22, l: 96 };
  const iw = W - pad.l - pad.r;
  const ih = H - pad.t - pad.b;

  const max = Math.max(...t.bars.map((b) => b.marginal), 1);
  const bandH = ih / t.bars.length;
  const svg = chart(W, H, "Cumulative loss from one macro variable at a time");

  t.bars.forEach((b, i) => {
    const y = pad.t + i * bandH + bandH * 0.2;
    const h = bandH * 0.6;
    svg.append(el("rect", {
      x: pad.l, y, width: Math.max(1, (b.marginal / max) * iw), height: h, class: "bar-tornado",
    }));
    svg.append(text(pad.l - 8, y + h / 2 + 4, b.label, "chart-row-label", "end"));
    svg.append(text(pad.l + (b.marginal / max) * iw + 5, y + h / 2 + 4,
      crore(b.marginal), "chart-coef", "start"));
  });
  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   10 · the sensitivity grid
   ------------------------------------------------------------ */
function buildGrid(grid) {
  const host = $("#sensitivity");
  if (!host) return;
  const table = document.createElement("table");
  table.className = "fin-table grid-table";

  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  const corner = document.createElement("th");
  corner.innerHTML = 'Unemployment <span aria-hidden="true">↓</span> / transmission <span aria-hidden="true">→</span>';
  hr.append(corner);
  grid.cols.forEach((c) => {
    const th = document.createElement("th");
    th.textContent = `${n2.format(c)}×`;
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);

  const span = grid.max - grid.min || 1;
  const tbody = document.createElement("tbody");
  grid.cells.forEach((row, i) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = `+${n1.format(grid.rows[i])}pp`;
    tr.append(th);
    row.forEach((cell, j) => {
      const td = document.createElement("td");
      td.className = "grid-cell";
      if (i === grid.base.row && j === grid.base.col) td.dataset.base = "1";
      td.textContent = pc(cell.ratio, 1);
      td.style.setProperty("--heat", ((cell.ratio - grid.min) / span).toFixed(3));
      td.dataset.side = cell.passes ? "up" : "down";
      td.tabIndex = 0;
      td.dataset.row = String(cell.row);
      td.dataset.col = String(cell.col);
      td.title = `${pc(cell.ratio, 2)} at the trough, ${cell.passes ? "above" : "below"} the requirement`;
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);
}

function adoptCell(td, grid) {
  if (!td || !grid) return;
  state[grid.rowKey] = Number(td.dataset.row);
  state[grid.colKey] = Number(td.dataset.col);
  edited.add(grid.rowKey);
  edited.add(grid.colKey);
  markCustom(grid.rowKey);
  render();
}

/* ------------------------------------------------------------
   the page contents
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
   render: the immediate half
   ------------------------------------------------------------ */
function render() {
  const r = run(state, segments, book);

  paintControls();
  writeUrl();

  $$(".scenario").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.scenario === state.scenario)));
  $$("[data-engine]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.engine === state.engine)));
  $$("[data-basis]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.basis === state.rwaBasis)));

  const blurb = $("#scenario-blurb");
  if (blurb) {
    blurb.textContent = state.scenario === "custom"
      ? "Your own path. The named scenarios are one click away, and this one is in the URL."
      : SCENARIOS[state.scenario].blurb;
  }

  const reset = $("#reset-drivers");
  if (reset) {
    reset.hidden = edited.size === 0;
    reset.textContent = `Reset ${edited.size} edited input${edited.size === 1 ? "" : "s"}`;
  }

  /* ---------- the verdict ---------- */
  const verdict = $("#verdict");
  if (verdict) {
    const breach = book.requirement - r.trough.ratio;
    verdict.dataset.state = r.breachesMinimum ? "bad" : r.passes ? "up" : "down";
    $(".verdict-value", verdict).textContent = pc(r.trough.ratio, 2);
    $(".verdict-detail", verdict).textContent = r.passes
      ? `at Q${r.trough.q}, ${signedBps(r.headroom * 10000)} above the ${pc(book.requirement, 1)} requirement, from ${pc(r.openingRatio, 2)} today. The book absorbs this scenario without a capital action.`
      : r.breachesMinimum
        ? `at Q${r.trough.q}, ${signedBps(-breach * 10000)} through the ${pc(book.requirement, 1)} requirement and below the ${pc(book.minimumCet1, 1)} minimum itself. A shortfall of ${crore(r.shortfall)} crore, which is a recapitalisation rather than a restriction.`
        : `at Q${r.trough.q}, ${signedBps(-breach * 10000)} through the ${pc(book.requirement, 1)} requirement but still ${signedBps((r.trough.ratio - book.minimumCet1) * 10000)} above the ${pc(book.minimumCet1, 1)} minimum. That is a breach of the buffer, so it stops distributions rather than threatening solvency.`;
  }

  /* ---------- tiles ---------- */
  const peakQ = r.quarters.reduce((w, x) => (x.pd > w.pd ? x : w), r.quarters[0]);
  const peakCharge = Math.max(...r.quarters.map((q) => q.charge));
  const peakStage2 = Math.max(...r.quarters.slice(1).map((q) => q.stage2 / q.performing));
  const tiles = {
    severity: sigma(r.worstShock),
    pd: pc(peakQ.pd, 2),
    loss: pc(r.lossRate, 2),
    charge: crore(peakCharge),
    stage2: pc(peakStage2, 0),
    headroom: signedBps(r.headroom * 10000),
  };
  Object.entries(tiles).forEach(([k, v]) => {
    const node = $(`[data-tile="${k}"] .tile-value`);
    if (node) node.textContent = v;
  });
  const pdBase = $("#tile-pd-base");
  if (pdBase) pdBase.textContent = pc(r.quarters[0].pd, 2);
  const headTile = $('[data-tile="headroom"]');
  if (headTile) headTile.dataset.tone = r.passes ? "good" : r.breachesMinimum ? "bad" : "warn";
  const sevTile = $('[data-tile="severity"]');
  if (sevTile) sevTile.dataset.tone = r.worstShock > 2 ? "bad" : r.worstShock > 1 ? "warn" : "good";

  /* ---------- notes ---------- */
  const capNote = $("#capital-note");
  if (capNote) {
    capNote.textContent = `The scenario is ${sigma(r.worstShock)} at its worst, which is ${oneIn(r.returnPeriod)}. `
      + `The ratio troughs at Q${r.trough.q}, ${r.trough.q > 5 ? "after" : "around"} the worst quarter for the economy, `
      + "because provisions are taken on the forward view and have to be paid for before the ratio can recover.";
  }

  const anchor = $("#anchor-value");
  if (anchor) {
    const home = segments[0];
    anchor.textContent = `Z = ${n2.format(anchorZ(home.pdTtc, correlation(home.kind, home.pdTtc)))}`;
  }

  const pdNote = $("#pd-note");
  if (pdNote) {
    const worstSeg = r.runs.reduce((w, s) => {
      const m = Math.max(...s.quarters.map((q) => q.pd / s.seg.pdTtc));
      return m > w.m ? { m, s } : w;
    }, { m: 0, s: r.runs[0] });
    pdNote.textContent = `${worstSeg.s.seg.name} multiplies hardest, by ${n1.format(worstSeg.m)}× at the peak. `
      + "The multiple is not the same across segments even under one shared shock: a low starting default rate "
      + "sits further into the tail of the normal distribution, so the same move in the economy multiplies it more.";
  }

  const engineNote = $("#engine-note");
  const engineCallout = $("#engine-callout");
  const g = r.engineGap;
  if (engineNote) {
    engineNote.textContent = Math.abs(g.ratio - 1) < 0.005
      ? "At this severity the two engines agree, which is what the calibration guarantees near a one-sigma shock."
      : `At the worst quarter the Merton engine says ${pc(g.merton, 2)} and the hazard model ${pc(g.link, 2)}, `
        + `a difference of ${pc(Math.abs(g.linkGap), 2)} on the same book, in the same quarter, on the same scenario.`;
  }
  if (engineCallout) {
    engineCallout.textContent =
      `The link functions differ by ${n0.format(Math.abs(g.ratio - 1) * 100)}% at this severity, and that is model risk: `
      + "two defensible methods, calibrated on the same history, disagreeing about the same scenario. "
      + `Separately, the vintage engine sees something the Merton one cannot: the book re-lends as it amortises, so it gets younger, `
      + `and young loans have not reached the top of their seasoning curve. That takes another ${n0.format(Math.abs(1 - g.mixRatio) * 100)}% off the hazard model's answer, `
      + "which is a real effect and a separate argument from the first one.";
  }

  const stageNote = $("#stage-note");
  if (stageNote) {
    const peak = r.quarters.reduce((w, x) => (x.stage2 > w.stage2 ? x : w), r.quarters[0]);
    stageNote.textContent = `Stage 2 peaks at ${pc(peak.stage2 / peak.performing, 0)} of the performing book in Q${peak.q}, `
      + `taking the allowance to ${crore(peak.ecl)} crore from ${crore(r.quarters[0].ecl)} today. `
      + (peak.stage2 / peak.performing > 0.6
        ? "A stage 2 population that size is itself a finding: at that point the significant-increase test has stopped discriminating between loans and is simply reporting the weather."
        : "The charge arrives before the losses do, which is the whole design of the standard and the reason a stress test on an IFRS 9 balance sheet front-loads.");
  }

  const attribNote = $("#attrib-note");
  if (attribNote) {
    const a = r.attribution;
    const rwaShare = Math.abs(a.fromRwa) / (Math.abs(a.fromCapital) + Math.abs(a.fromRwa) || 1);
    attribNote.textContent = a.totalBps >= 0
      ? "The ratio does not fall in this scenario."
      : `${n0.format(rwaShare * 100)}% of the fall is not losses at all. It is the same loans, still performing, `
        + "being measured as riskier by a formula whose inputs moved.";
  }

  const basisNote = $("#basis-note");
  if (basisNote) {
    const other = ["ttc", "hybrid", "pit"].filter((b) => b !== state.rwaBasis);
    const alt = other.map((b) => {
      const t = run({ ...state, rwaBasis: b }, segments, book).trough.ratio;
      return `${b === "ttc" ? "long-run" : b === "pit" ? "point in time" : "hybrid"} ${pc(t, 2)}`;
    }).join(", ");
    basisNote.textContent = `On this book and this scenario: ${state.rwaBasis === "ttc" ? "long-run" : state.rwaBasis === "pit" ? "point in time" : "hybrid"} ${pc(r.trough.ratio, 2)} at the trough, against ${alt}. Same losses in all three.`;
  }

  const sevNote = $("#severity-note");
  if (sevNote) {
    sevNote.textContent = `This scenario puts the economy at ${n2.format(r.worstZ)} standard deviations at its worst. `
      + `The capital requirement is calibrated at −3.09, so the rule is asking the book to survive something `
      + `${Number.isFinite(r.absoluteReturnPeriod) ? `${n0.format(Math.round(1000 / r.absoluteReturnPeriod))} times rarer` : "considerably rarer"} than this.`;
  }

  buildBookTable(r);
  drawCapital(r);
  drawMacro(r);
  drawPd(r);
  drawVintage(r);
  drawEngines(r);
  drawLgd(r);
  drawWhammy(r);
  drawStages(r);
  drawSeverity(r);
  drawAttribution(r);

  scheduleHeavy();
  return r;
}

/* ------------------------------------------------------------
   render: the expensive half

   The grid, the tornado and the reverse stress test are seventy
   odd full runs of the model between them. They are scheduled
   rather than run inline, and a new input cancels the pending
   pass instead of queueing behind it.
   ------------------------------------------------------------ */
let pending = null;
const idle = window.requestIdleCallback
  ? (fn) => window.requestIdleCallback(fn, { timeout: 400 })
  : (fn) => setTimeout(fn, 60);
const cancelIdle = window.cancelIdleCallback
  ? (id) => window.cancelIdleCallback(id)
  : (id) => clearTimeout(id);

function scheduleHeavy() {
  if (pending !== null) cancelIdle(pending);
  $("#sensitivity")?.setAttribute("data-stale", "1");
  $("#tornado-chart")?.setAttribute("data-stale", "1");
  pending = idle(() => {
    pending = null;
    renderHeavy();
  });
}

function renderHeavy() {
  const grid = sensitivity(state, {}, segments, book);
  lastGrid = grid;
  buildGrid(grid);
  $("#sensitivity")?.removeAttribute("data-stale");

  const t = tornado(state, segments, book);
  drawTornado(t);
  $("#tornado-chart")?.removeAttribute("data-stale");

  const tNote = $("#tornado-note");
  if (tNote) {
    tNote.textContent = t.interaction > 0
      ? `The bars add to ${crore(t.sumOfParts)} crore, but all six together cost ${crore(t.together)}. `
        + `The missing ${crore(t.interaction)} is the interaction: losses are convex in the shock, so variables arriving together cost more than the same variables arriving one at a time. `
        + "It is the reason a stress test cannot be assembled out of single-factor sensitivities."
      : "Each bar moves one variable and leaves the others where they started.";
  }

  const rev = reverseStress(state, segments, book);
  const card = $("#reverse");
  if (card) {
    if (!rev.found) {
      card.dataset.state = "up";
      $(".verdict-value", card).textContent = "not inside six times this scenario";
      $(".verdict-detail", card).textContent =
        "Nothing up to six times the severity of the current path takes the ratio through the requirement. "
        + "At that point the scenario has stopped being an economy and the answer stops meaning anything, so the search says so instead of returning its own edge.";
    } else if (rev.alreadyBreached) {
      card.dataset.state = "bad";
      $(".verdict-value", card).textContent = "already through";
      $(".verdict-detail", card).textContent =
        "The book breaches the requirement with no macro shock at all, on these transmission and accounting assumptions.";
    } else {
      card.dataset.state = rev.multiple < 1 ? "down" : "up";
      $(".verdict-value", card).textContent = `${n2.format(rev.multiple)}× this scenario`;
      $(".verdict-detail", card).textContent =
        `which is unemployment rising ${n1.format(rev.unemployment)} points rather than ${n1.format(state.unemployment)}, `
        + `with everything else scaled to match: a shock of ${sigma(rev.worstShock)}, ${oneIn(rev.returnPeriod)}. `
        + (rev.multiple < 1
          ? "Less than the scenario above, which means the current path already breaks it."
          : "More than the scenario above, so this book has that much room before the requirement binds.");
    }
  }
}

/* ------------------------------------------------------------
   bring your own book
   ------------------------------------------------------------ */
function loadCsv(text) {
  const status = $("#csv-status");
  const { segments: parsed, errors } = parsePortfolioCsv(text);
  if (!parsed.length) {
    if (status) {
      status.dataset.state = "bad";
      status.textContent = errors.slice(0, 3).join(" · ");
    }
    return;
  }
  segments = parsed;
  book = bookFor(parsed, state);
  vintageSegment = parsed[0].id;
  if (status) {
    status.dataset.state = errors.length ? "warn" : "good";
    status.textContent = `${parsed.length} segments, ${crore(parsed.reduce((t, s) => t + s.ead, 0))} crore. `
      + "Capital is scaled to open on the same ratio as the shipped book, since a CSV of exposures cannot know your balance sheet. "
      + (errors.length ? `${errors.length} line(s) skipped: ${errors[0]}` : "");
  }
  $("#csv-reset").hidden = false;
  const name = $("#co-name");
  if (name) name.textContent = "Imported book";
  render();
}

function resetCsv() {
  segments = SEGMENTS;
  book = BOOK;
  vintageSegment = "home";
  const status = $("#csv-status");
  if (status) { status.textContent = ""; delete status.dataset.state; }
  $("#csv-reset").hidden = true;
  $("#csv-paste").value = "";
  const name = $("#co-name");
  if (name) name.textContent = BOOK.name;
  render();
}

function wireCsv() {
  const drop = $("#csv-drop");
  if (!drop) return;
  $("#csv-file")?.addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (file) loadCsv(await file.text());
  });
  $("#csv-paste")?.addEventListener("input", (e) => {
    const v = e.target.value.trim();
    if (v.split(/\r?\n/).length >= 2) loadCsv(v);
  });
  $("#csv-reset")?.addEventListener("click", resetCsv);
  ["dragover", "dragenter"].forEach((ev) =>
    drop.addEventListener(ev, (e) => { e.preventDefault(); drop.dataset.over = "1"; }));
  ["dragleave", "drop"].forEach((ev) =>
    drop.addEventListener(ev, () => delete drop.dataset.over));
  drop.addEventListener("drop", async (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file) loadCsv(await file.text());
  });
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#stress")) return;

  $("#co-name") && ($("#co-name").textContent = BOOK.name);
  $("#co-note") && ($("#co-note").textContent = BOOK.note);
  $("#co-unit") && ($("#co-unit").textContent =
    `${crore(SEGMENTS.reduce((t, s) => t + s.ead, 0))} crore across seven segments · as at ${BOOK.asOf} · twelve quarters`);

  buildControls();
  buildVintagePicker();
  buildToc();
  wireCsv();
  readUrl();

  $$(".scenario").forEach((b) => b.addEventListener("click", () => {
    applyScenario(b.dataset.scenario);
    render();
  }));
  $$("[data-engine]").forEach((b) => b.addEventListener("click", () => {
    state.engine = b.dataset.engine;
    render();
  }));
  $$("[data-basis]").forEach((b) => b.addEventListener("click", () => {
    state.rwaBasis = b.dataset.basis;
    render();
  }));
  $("#reset-drivers")?.addEventListener("click", () => {
    DRIVERS.forEach((d) => { state[d.key] = DEFAULTS[d.key]; });
    edited.clear();
    state.scenario = DEFAULTS.scenario;
    applyScenario(DEFAULTS.scenario);
    render();
  });

  const gridHost = $("#sensitivity");
  gridHost?.addEventListener("click", (e) => adoptCell(e.target.closest(".grid-cell"), lastGrid));
  gridHost?.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const td = e.target.closest(".grid-cell");
    if (!td) return;
    e.preventDefault();
    adoptCell(td, lastGrid);
  });

  $("#download-csv")?.addEventListener("click", () => {
    const blob = new Blob([toCsv(state, segments, book)], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `stress-test-${state.scenario}.csv`;
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

  render();
}

init();
