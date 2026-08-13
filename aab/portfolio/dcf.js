/* ============================================================
   dcf.js: the dashboard around the valuation.

   Same split as the three-statement model: dcf.model.js holds
   the arithmetic and is tested on its own; this turns it into
   something you can argue with. One state object, a full
   recompute on every change, no partial updates.
   ============================================================ */

import {
  COMPANY, SCENARIOS, EQUITY, DEFAULTS, DRIVERS,
  wacc, costOfEquity, value, sensitivity, toCsv, isPercentDriver,
} from "/portfolio/dcf.model.js";

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];

const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

const lakh = (v) => (Number.isFinite(v) ? n0.format(Math.round(v)) : "–");
const pc = (v) => (Number.isFinite(v) ? `${n1.format(v * 100)}%` : "–");
const pc2 = (v) => (Number.isFinite(v) ? `${n2.format(v * 100)}%` : "–");
const mult = (v) => (Number.isFinite(v) ? `${n1.format(v)}×` : "–");
const bdt = (v) => (Number.isFinite(v) ? n2.format(v) : "–");
const signed = (v) =>
  Number.isFinite(v) ? `${v >= 0 ? "+" : ""}${n1.format(v * 100)}%` : "–";
const acc = (v) => {
  if (!Number.isFinite(v)) return "–";
  const r = Math.round(v) || 0;
  return r < 0 ? `(${n0.format(Math.abs(r))})` : n0.format(r);
};

/* ------------------------------------------------------------
   state
   ------------------------------------------------------------ */
const state = { ...DEFAULTS, axis: "terminalGrowth" };
const edited = new Set();

function readUrl() {
  const q = new URLSearchParams(location.search);
  const s = q.get("s");
  if (s && SCENARIOS[s]) state.scenario = s;
  if (q.get("tv") === "multiple" || q.get("tv") === "gordon") state.tvMethod = q.get("tv");
  if (q.get("mid") === "1") state.midYear = true;
  if (q.get("axis") === "exitMultiple") state.axis = "exitMultiple";
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
  q.set("tv", state.tvMethod);
  if (state.midYear) q.set("mid", "1");
  if (state.axis !== "terminalGrowth") q.set("axis", state.axis);
  edited.forEach((k) => q.set(k, String(+state[k].toFixed(6))));
  history.replaceState(null, "", `${location.pathname}?${q}`);
}

/* ------------------------------------------------------------
   controls
   ------------------------------------------------------------ */
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
      input.setAttribute("aria-label", `${d.label} (${d.unit})`);

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
    const val = $(".val", wrap);
    const raw = state[d.key];
    input.value = String(raw);
    const p = ((raw - d.min) / (d.max - d.min)) * 100;
    input.style.setProperty("--pct", `${Math.max(0, Math.min(100, p))}%`);
    val.textContent = isPercentDriver(d.key)
      ? `${n1.format(raw * 100)}%`
      : `${n2.format(raw)}${d.unit === "×" ? "×" : ""}`;
    wrap.toggleAttribute("data-edited", edited.has(d.key));
    // the driver that isn't in play is dimmed rather than hidden,
    // switching method should not make a control vanish from under
    // the reader's cursor
    const inactive =
      (d.key === "terminalGrowth" && state.tvMethod === "multiple") ||
      (d.key === "exitMultiple" && state.tvMethod === "gordon");
    wrap.toggleAttribute("data-inactive", inactive);
  });
}

/* ------------------------------------------------------------
   the free cash flow build
   ------------------------------------------------------------ */
const FCF_ROWS = [
  ["EBIT", (r) => r.ebit],
  ["Less: tax on EBIT", (r) => -(r.ebit - r.nopat), true],
  ["NOPAT", (r) => r.nopat, false, true],
  ["Add: depreciation & amortisation", (r) => r.da],
  ["Less: capital expenditure", (r) => -r.capex, true],
  ["Less: increase in working capital", (r) => -r.deltaNwc, true],
  ["Unlevered free cash flow", (r) => r.fcf, false, true],
  ["Discount factor", (r) => r.discountFactor, false, false, true],
  ["Present value", (r) => r.pv, false, true],
];

function buildFcfTable(v) {
  const host = $("#fcf-table");
  if (!host) return;
  const table = document.createElement("table");
  table.className = "fin-table";

  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  hr.append(document.createElement("th"));
  v.rows.forEach((r) => {
    const th = document.createElement("th");
    th.textContent = r.label;
    th.className = "col-forecast";
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);

  const tbody = document.createElement("tbody");
  FCF_ROWS.forEach(([label, fn, , bold, isFactor]) => {
    const tr = document.createElement("tr");
    if (bold) tr.classList.add("is-total", "has-rule");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = label;
    tr.append(th);
    v.rows.forEach((r) => {
      const td = document.createElement("td");
      const raw = fn(r);
      td.textContent = isFactor ? n2.format(raw) : acc(raw);
      if (!isFactor && raw < 0) td.classList.add("is-negative");
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);
}

/* ------------------------------------------------------------
   the EV → equity bridge, as a waterfall
   ------------------------------------------------------------ */
function buildBridge(v) {
  const host = $("#bridge");
  if (!host) return;

  const steps = [
    { label: "PV of forecast", value: v.pvExplicit, kind: "add" },
    { label: "PV of terminal value", value: v.pvTerminal, kind: "add" },
    { label: "Enterprise value", value: v.ev, kind: "total" },
    { label: "Less: net debt", value: -v.netDebt, kind: "sub" },
    { label: "Equity value", value: v.equityValue, kind: "total" },
  ];
  const max = Math.max(...steps.map((s) => Math.abs(s.value)), 1);

  host.replaceChildren(...steps.map((s) => {
    const row = document.createElement("div");
    row.className = "bridge-row";
    row.dataset.kind = s.kind;

    const label = document.createElement("span");
    label.className = "bridge-label";
    label.textContent = s.label;

    const track = document.createElement("span");
    track.className = "bridge-track";
    const bar = document.createElement("i");
    bar.style.width = `${(Math.abs(s.value) / max) * 100}%`;
    track.append(bar);

    const num = document.createElement("span");
    num.className = "bridge-value mono";
    num.textContent = acc(s.value);

    row.append(label, track, num);
    return row;
  }));
}

/* ------------------------------------------------------------
   the two-way sensitivity table

   The thing a reviewer looks at first, so it gets the most care:
   a heatmap, the live cell ringed, and every cell clickable to
   adopt those assumptions.
   ------------------------------------------------------------ */
function buildGrid(grid) {
  const host = $("#sensitivity");
  if (!host) return;

  const axisLabel = grid.axis === "terminalGrowth" ? "Terminal growth" : "Exit EV/EBITDA";
  const fmtCol = (c) => (grid.axis === "terminalGrowth" ? pc(c) : mult(c));

  const table = document.createElement("table");
  table.className = "fin-table grid-table";

  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  const corner = document.createElement("th");
  corner.innerHTML = `WACC <span aria-hidden="true">↓</span> / ${axisLabel} <span aria-hidden="true">→</span>`;
  hr.append(corner);
  grid.cols.forEach((c) => {
    const th = document.createElement("th");
    th.textContent = fmtCol(c);
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
    th.textContent = pc(grid.waccs[i]);
    tr.append(th);

    row.forEach((cell, j) => {
      const td = document.createElement("td");
      td.className = "grid-cell";
      if (i === grid.base.row && j === grid.base.col) td.dataset.base = "1";

      if (!cell.valid) {
        td.textContent = "n/a";
        td.dataset.invalid = "1";
        td.title = "Terminal growth is at or above the discount rate; there is no finite value here.";
      } else {
        td.textContent = bdt(cell.perShare);
        // heat: 0 at the cheapest cell, 1 at the dearest
        const t = (cell.perShare - grid.min) / span;
        td.style.setProperty("--heat", t.toFixed(3));
        td.dataset.side = cell.perShare >= EQUITY.marketPrice ? "up" : "down";
        td.tabIndex = 0;
        td.dataset.wacc = String(cell.wacc);
        td.dataset.col = String(cell.col);
        td.title = `${bdt(cell.perShare)} BDT: ${signed(cell.upside)} vs market`;
      }
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);
}

/* Clicking a cell adopts it. WACC is an output of the build-up, so
   it can't be set directly, instead the risk-free rate is shifted
   by the difference, which is the honest way to say "what if the
   discount rate were this". */
function adoptCell(td, grid) {
  if (!td || td.dataset.invalid) return;
  const targetWacc = Number(td.dataset.wacc);
  const col = Number(td.dataset.col);
  const delta = targetWacc - wacc(state);
  state.riskFree = +(state.riskFree + delta / (1 - state.debtWeight)).toFixed(6);
  edited.add("riskFree");
  state[grid.axis] = col;
  edited.add(grid.axis);
  state.tvMethod = grid.axis === "terminalGrowth" ? "gordon" : "multiple";
  render();
}

/* ------------------------------------------------------------
   render
   ------------------------------------------------------------ */
function render() {
  const v = value(state);
  const grid = sensitivity(state, { axis: state.axis });

  paintControls();
  writeUrl();

  $$(".scenario").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.scenario === state.scenario)));
  $$("[data-tv]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.tv === state.tvMethod)));
  $$("[data-axis]").forEach((b) =>
    b.setAttribute("aria-pressed", String(b.dataset.axis === state.axis)));
  const midBtn = $("#mid-year");
  if (midBtn) midBtn.setAttribute("aria-pressed", String(state.midYear));

  const blurb = $("#scenario-blurb");
  if (blurb) blurb.textContent = SCENARIOS[state.scenario].blurb;

  const reset = $("#reset-drivers");
  if (reset) {
    reset.hidden = edited.size === 0;
    reset.textContent = `Reset ${edited.size} edited input${edited.size === 1 ? "" : "s"}`;
  }

  /* ---------- the verdict ---------- */
  const verdict = $("#verdict");
  if (verdict) {
    if (!v.tvValid) {
      verdict.dataset.state = "bad";
      $(".verdict-value", verdict).textContent = "–";
      $(".verdict-detail", verdict).textContent =
        `Terminal growth of ${pc(v.growth)} is at or above the ${pc2(v.wacc)} discount rate. ` +
        "A perpetuity growing faster than it is discounted has no finite value; this is refused rather than approximated.";
    } else {
      verdict.dataset.state = v.upside >= 0 ? "up" : "down";
      $(".verdict-value", verdict).textContent = `${bdt(v.perShare)} BDT`;
      $(".verdict-detail", verdict).textContent =
        `against a ${bdt(v.marketPrice)} market price: ${signed(v.upside)}. ` +
        `${pc(v.terminalShare)} of the enterprise value sits in the terminal value.`;
    }
  }

  /* ---------- tiles ---------- */
  const tiles = {
    wacc: pc2(v.wacc),
    ke: pc2(v.costOfEquity),
    ev: lakh(v.ev),
    equity: lakh(v.equityValue),
    terminal: pc(v.terminalShare),
    entry: mult(v.evEbitdaEntry),
  };
  Object.entries(tiles).forEach(([k, val]) => {
    const el = $(`[data-tile="${k}"] .tile-value`);
    if (el) el.textContent = val;
  });

  const tShare = $('[data-tile="terminal"]');
  if (tShare) tShare.dataset.tone =
    v.terminalShare > 0.8 ? "bad" : v.terminalShare > 0.7 ? "warn" : "good";

  /* ---------- the cross-check between the two methods ---------- */
  const cross = $("#cross-check");
  if (cross) {
    if (!v.tvValid) {
      cross.hidden = true;
    } else {
      cross.hidden = false;
      cross.textContent = state.tvMethod === "gordon"
        ? `That terminal value amounts to ${mult(v.impliedExitMultiple)} EV/EBITDA on the final forecast year. If that multiple looks wrong for this business, the growth assumption is wrong.`
        : `That exit multiple implies ${pc(v.impliedGrowth)} growth in perpetuity. If that looks wrong beside long-run nominal GDP, the multiple is wrong.`;
    }
  }

  buildFcfTable(v);
  buildBridge(v);
  buildGrid(grid);

  const gridNote = $("#grid-note");
  if (gridNote) {
    gridNote.textContent = grid.axis === "terminalGrowth"
      ? `Value per share in BDT, valued on Gordon growth. Green is above the ${bdt(EQUITY.marketPrice)} market price, amber below it. Click any cell to adopt it.`
      : `Value per share in BDT, valued on an exit multiple. Green is above the ${bdt(EQUITY.marketPrice)} market price, amber below it. Click any cell to adopt it.`;
  }

  // clicking / keyboard on the grid
  const host = $("#sensitivity");
  if (host && !host.dataset.wired) {
    host.dataset.wired = "1";
    host.addEventListener("click", (e) => adoptCell(e.target.closest(".grid-cell"), lastGrid));
    host.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const td = e.target.closest(".grid-cell");
      if (!td) return;
      e.preventDefault();
      adoptCell(td, lastGrid);
    });
  }
  lastGrid = grid;
  return v;
}

let lastGrid = null;

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  if (!$("#dcf")) return;

  $("#co-name") && ($("#co-name").textContent = COMPANY.name);
  $("#co-note") && ($("#co-note").textContent = `${COMPANY.note} ${EQUITY.note}`);
  $("#co-unit") && ($("#co-unit").textContent =
    `Figures in ${COMPANY.unit}; per-share in BDT · ${lakh(EQUITY.sharesOutstanding)} lakh shares`);

  buildControls();
  readUrl();

  $$(".scenario").forEach((b) => b.addEventListener("click", () => {
    state.scenario = b.dataset.scenario;
    render();
  }));
  $$("[data-tv]").forEach((b) => b.addEventListener("click", () => {
    state.tvMethod = b.dataset.tv;
    render();
  }));
  $$("[data-axis]").forEach((b) => b.addEventListener("click", () => {
    state.axis = b.dataset.axis;
    render();
  }));
  $("#mid-year")?.addEventListener("click", () => {
    state.midYear = !state.midYear;
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
    a.download = `${COMPANY.ticker}-dcf-${state.scenario}.csv`;
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
