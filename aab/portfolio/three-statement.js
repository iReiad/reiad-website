/* three-statement.js: the dashboard around the model. Every
   control writes into one `state` object, the model is re-run
   from scratch and everything repaints. No partial update and no
   caching: the model runs in well under a millisecond, and one
   code path that always rebuilds cannot disagree with itself. */

import {
  COMPANY, ACTUALS, SCENARIOS, DRIVERS, run, toCsv, openingCheck,
  isPercentDriver,
} from "/portfolio/three-statement.model.js";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ------------------------------------------------------------
   formatting
   ------------------------------------------------------------ */
const n0 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 0 });
const n1 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 1 });
const n2 = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });

const lakh = (v) => (Number.isFinite(v) ? n0.format(v) : "–");
const pc = (v) => (Number.isFinite(v) ? `${n1.format(v * 100)}%` : "–");
const x = (v) => (Number.isFinite(v) ? `${n2.format(v)}×` : "–");

/** Accounting style: negatives in brackets, which is what a
    reviewer of a model expects to see. */
const acc = (v) => {
  if (!Number.isFinite(v)) return "–";
  // `|| 0` collapses negative zero. Rows shown as an outflow are
  // negated for display, so a genuine zero became -0 and Intl
  // dutifully printed "-0"– which in a financial statement looks
  // like a defect rather than a nil balance.
  const r = Math.round(v) || 0;
  return r < 0 ? `(${n0.format(Math.abs(r))})` : n0.format(r);
};

const driverValue = (d, raw) =>
  isPercentDriver(d.key) ? `${n1.format(raw * 100)}%` : n0.format(raw);

/* ------------------------------------------------------------
   state, and the URL that carries it
   ------------------------------------------------------------ */
const state = {
  scenario: "base",
  overrides: {},     // only what the reader has actually moved
};

const assumptions = () => ({ ...SCENARIOS[state.scenario], ...state.overrides });

function readUrl() {
  const q = new URLSearchParams(location.search);
  const s = q.get("s");
  if (s && SCENARIOS[s]) state.scenario = s;
  DRIVERS.forEach((d) => {
    const v = q.get(d.key);
    if (v === null) return;
    const num = Number(v);
    if (Number.isFinite(num)) state.overrides[d.key] = num;
  });
}

function writeUrl() {
  const q = new URLSearchParams();
  q.set("s", state.scenario);
  // only the edits, a clean scenario stays a clean, short link
  Object.entries(state.overrides).forEach(([k, v]) => q.set(k, String(+v.toFixed(6))));
  history.replaceState(null, "", `${location.pathname}?${q}`);
}

/* ------------------------------------------------------------
   charts, inline SVG, themed by currentColor and the tokens
   ------------------------------------------------------------ */
const SVG = "http://www.w3.org/2000/svg";
const svgEl = (tag, attrs = {}) => {
  const el = document.createElementNS(SVG, tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
};

/** Grouped bars: revenue with EBITDA overlaid, year by year. */
function barChart(host, rows, { w = 620, h = 220 } = {}) {
  const pad = { t: 14, r: 10, b: 26, l: 10 };
  const max = Math.max(...rows.map((r) => r.revenue)) * 1.1 || 1;
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;
  const band = innerW / rows.length;
  const bw = Math.min(46, band * 0.52);

  const svg = svgEl("svg", {
    viewBox: `0 0 ${w} ${h}`, class: "fin-chart", role: "img",
    "aria-label": "Revenue and EBITDA by year",
  });

  rows.forEach((r, i) => {
    const cx = pad.l + band * i + band / 2;
    const revH = (r.revenue / max) * innerH;
    const ebH = (Math.max(0, r.ebitda) / max) * innerH;

    /* EBITDA is drawn as the solid lower segment of the revenue bar,
       at full width, rather than as a narrower bar in front of it.
       EBITDA *is* a share of revenue, around 14% here, so as a
       separate inset bar it rendered as a stub and looked like a
       rendering fault. As a segment it reads correctly at a glance:
       this much of the top line survives to EBITDA. */
    svg.append(svgEl("rect", {
      x: cx - bw / 2, y: pad.t + innerH - revH, width: bw, height: Math.max(0, revH),
      rx: 3, class: "bar-revenue",
    }));
    svg.append(svgEl("rect", {
      x: cx - bw / 2, y: pad.t + innerH - ebH,
      width: bw, height: Math.max(0, ebH), rx: 3, class: "bar-ebitda",
    }));

    // the margin, printed above each bar: the number people want
    const pctLabel = svgEl("text", {
      x: cx, y: pad.t + innerH - revH - 5, "text-anchor": "middle", class: "chart-value",
    });
    pctLabel.textContent = `${(r.ebitdaMarginPct * 100).toFixed(0)}%`;
    svg.append(pctLabel);

    const label = svgEl("text", {
      x: cx, y: h - 8, "text-anchor": "middle", class: "chart-label",
    });
    label.textContent = r.label.replace(/^FY/, "");
    svg.append(label);
  });

  host.replaceChildren(svg);
}

/** Two lines: closing cash, and net debt. */
function lineChart(host, rows, { w = 620, h = 220 } = {}) {
  const pad = { t: 14, r: 10, b: 26, l: 10 };
  const innerW = w - pad.l - pad.r;
  const innerH = h - pad.t - pad.b;

  const values = rows.flatMap((r) => [r.cash, r.netDebt]);
  const lo = Math.min(0, ...values);
  const hi = Math.max(...values, 1);
  const span = hi - lo || 1;

  const xAt = (i) => pad.l + (innerW / Math.max(1, rows.length - 1)) * i;
  const yAt = (v) => pad.t + innerH - ((v - lo) / span) * innerH;

  const svg = svgEl("svg", {
    viewBox: `0 0 ${w} ${h}`, class: "fin-chart", role: "img",
    "aria-label": "Closing cash and net debt by year",
  });

  // zero line, when zero is inside the range
  if (lo < 0 && hi > 0) {
    svg.append(svgEl("line", {
      x1: pad.l, x2: w - pad.r, y1: yAt(0), y2: yAt(0), class: "chart-zero",
    }));
  }

  const path = (key, cls) => {
    const d = rows.map((r, i) => `${i ? "L" : "M"}${xAt(i)},${yAt(r[key])}`).join(" ");
    svg.append(svgEl("path", { d, class: cls, fill: "none" }));
    rows.forEach((r, i) => {
      svg.append(svgEl("circle", { cx: xAt(i), cy: yAt(r[key]), r: 3, class: cls + "-dot" }));
    });
  };
  path("netDebt", "line-netdebt");
  path("cash", "line-cash");

  rows.forEach((r, i) => {
    const label = svgEl("text", {
      x: xAt(i), y: h - 8, "text-anchor": "middle", class: "chart-label",
    });
    label.textContent = r.label.replace(/^FY/, "");
    svg.append(label);
  });

  host.replaceChildren(svg);
}

/* ------------------------------------------------------------
   tables
   ------------------------------------------------------------ */

/* [label, key, {negate, bold, rule, pct, note}] */
const IS_ROWS = [
  ["Revenue", "revenue", { bold: true }],
  ["Cost of sales", "cogs", { negate: true }],
  ["Gross profit", "grossProfit", { rule: true }],
  ["Operating costs", "opex", { negate: true }],
  ["EBITDA", "ebitda", { bold: true, rule: true }],
  ["Depreciation & amortisation", "da", { negate: true }],
  ["EBIT", "ebit", { rule: true }],
  ["Interest: term debt", "interest", { negate: true }],
  ["Interest: revolver", "revolverInterest", { negate: true }],
  ["Profit before tax", "ebt", { rule: true }],
  ["Tax", "tax", { negate: true }],
  ["Net income", "netIncome", { bold: true, rule: true }],
];

const BS_ROWS = [
  ["Cash & equivalents", "cash"],
  ["Trade receivables", "ar"],
  ["Inventory", "inventory"],
  ["Property, plant & equipment", "ppe"],
  ["Total assets", "assets", { bold: true, rule: true }],
  ["Trade payables", "ap"],
  ["Term debt", "debt"],
  ["Revolver", "revolver"],
  ["Shareholders' equity", "equity"],
  ["Total liabilities & equity", "liabEquity", { bold: true, rule: true }],
];

const CF_ROWS = [
  ["Net income", "netIncome"],
  ["Depreciation & amortisation", "da"],
  ["Change in working capital", "deltaNwc", { negate: true }],
  ["Cash from operations", "cfo", { bold: true, rule: true }],
  ["Capital expenditure", "capex", { negate: true }],
  ["Cash from investing", "cfi", { bold: true, rule: true }],
  ["Term debt repayment", "debtRepayment", { negate: true }],
  ["Dividends paid", "dividends", { negate: true }],
  ["Revolver draw / (repayment)", "_revolverNet"],
  ["Cash from financing", "cff", { bold: true, rule: true }],
  ["Net change in cash", "netChangeInCash", { bold: true }],
  ["Closing cash", "cash", { bold: true, rule: true }],
];

function buildTable(host, spec, rows) {
  const table = document.createElement("table");
  table.className = "fin-table";

  const thead = document.createElement("thead");
  const hr = document.createElement("tr");
  hr.append(document.createElement("th"));
  rows.forEach((r) => {
    const th = document.createElement("th");
    th.textContent = r.label;
    th.className = r.actual ? "col-actual" : "col-forecast";
    hr.append(th);
  });
  thead.append(hr);
  table.append(thead);

  const tbody = document.createElement("tbody");
  spec.forEach(([label, key, opts = {}]) => {
    const tr = document.createElement("tr");
    if (opts.bold) tr.classList.add("is-total");
    if (opts.rule) tr.classList.add("has-rule");

    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = label;
    tr.append(th);

    rows.forEach((r) => {
      const td = document.createElement("td");
      let v = key === "_revolverNet"
        ? (r.revolverDraw ?? 0) - (r.revolverRepay ?? 0)
        : r[key];
      if (r.actual && (key === "_revolverNet" || CF_ONLY.has(key))) v = NaN;
      td.textContent = acc(opts.negate ? -v : v);
      if (Number.isFinite(v) && (opts.negate ? -v : v) < 0) td.classList.add("is-negative");
      tr.append(td);
    });

    tbody.append(tr);
  });
  table.append(tbody);
  host.replaceChildren(table);
}

/* Cash flow lines that don't exist for the last reported year: the
   model starts from its balance sheet, not from a prior-year flow. */
const CF_ONLY = new Set([
  "deltaNwc", "cfo", "capex", "cfi", "debtRepayment", "dividends",
  "cff", "netChangeInCash",
]);

/* ------------------------------------------------------------
   controls
   ------------------------------------------------------------ */
function buildControls() {
  const host = $("#drivers");
  if (!host) return;

  const groups = [...new Set(DRIVERS.map((d) => d.group))];
  host.replaceChildren(
    ...groups.map((group) => {
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
    })
  );

  host.addEventListener("input", (e) => {
    const key = e.target.dataset.key;
    if (!key) return;
    state.overrides[key] = Number(e.target.value);
    render();
  });
}

function paintControls(a) {
  DRIVERS.forEach((d) => {
    const wrap = $(`.driver[data-key="${d.key}"]`);
    if (!wrap) return;
    const input = $("input", wrap);
    const val = $(".val", wrap);
    const raw = a[d.key];
    input.value = String(raw);
    // the slider fill, same trick the calculators use
    const pct = ((raw - d.min) / (d.max - d.min)) * 100;
    input.style.setProperty("--pct", `${Math.max(0, Math.min(100, pct))}%`);
    val.textContent = `${driverValue(d, raw)} ${d.unit.replace(/^%\s*/, "")}`.trim();
    wrap.toggleAttribute("data-edited", d.key in state.overrides);
  });
}

/* ------------------------------------------------------------
   render
   ------------------------------------------------------------ */
function render() {
  const a = assumptions();
  const result = run(a);

  paintControls(a);
  writeUrl();

  // scenario buttons
  $$(".scenario").forEach((b) => {
    b.setAttribute("aria-pressed", String(b.dataset.scenario === state.scenario));
  });
  const blurb = $("#scenario-blurb");
  if (blurb) blurb.textContent = SCENARIOS[state.scenario].blurb;

  const edited = Object.keys(state.overrides).length;
  const resetBtn = $("#reset-drivers");
  if (resetBtn) {
    resetBtn.hidden = edited === 0;
    resetBtn.textContent = `Reset ${edited} edited assumption${edited === 1 ? "" : "s"}`;
  }

  /* ---------- the balance check ----------
     The most important thing on the page. It is computed, never
     asserted: if the model is wrong, this says so. */
  const check = $("#balance-check");
  if (check) {
    const worst = result.meta.worstCheck;
    const good = worst < 0.5;
    check.dataset.state = good ? "ok" : "bad";
    $(".check-verdict", check).textContent = good
      ? "Balance sheet balances"
      : "Balance sheet does not balance";
    $(".check-detail", check).textContent = good
      ? `Assets − (liabilities + equity) = 0 in all ${result.rows.length} years, to within ${worst.toExponential(1)} lakh of floating-point noise.`
      : `Largest difference ${lakh(worst)} lakh. The opening balance sheet must tie before any forecast year can.`;
  }

  /* ---------- KPI tiles ---------- */
  const last = result.rows[result.rows.length - 1];
  const tiles = {
    cagr: pc(result.meta.revenueCagr),
    ebitda: pc(result.meta.exitEbitdaMargin),
    leverage: x(result.meta.exitNetDebtEbitda),
    fcf: lakh(result.meta.cumulativeFcf),
    roe: pc(last.roe),
    cover: x(last.interestCover),
  };
  Object.entries(tiles).forEach(([k, v]) => {
    const el = $(`[data-tile="${k}"] .tile-value`);
    if (el) el.textContent = v;
  });

  const lever = $('[data-tile="leverage"]');
  if (lever) lever.dataset.tone =
    result.meta.exitNetDebtEbitda > 3 ? "bad"
    : result.meta.exitNetDebtEbitda > 2 ? "warn" : "good";

  const revolverNote = $("#revolver-note");
  if (revolverNote) {
    const peak = result.meta.peakRevolver;
    revolverNote.hidden = peak <= 0.5;
    revolverNote.textContent = peak > 0.5
      ? `This plan needs the revolver: it peaks at ${lakh(peak)} lakh. Cash never falls below the ${lakh(a.minCash)} lakh minimum because the facility funds the gap, and the interest on it is charged back through the income statement.`
      : "";
  }

  /* ---------- statements ---------- */
  buildTable($("#is-table"), IS_ROWS, result.rows);
  buildTable($("#bs-table"), BS_ROWS, result.rows);
  buildTable($("#cf-table"), CF_ROWS, result.rows);

  /* ---------- charts ---------- */
  barChart($("#chart-revenue"), result.rows);
  lineChart($("#chart-cash"), result.rows);

  return result;
}

/* ------------------------------------------------------------
   wiring
   ------------------------------------------------------------ */
function init() {
  const root = $("#model");
  if (!root) return;

  // the company header
  $("#co-name") && ($("#co-name").textContent = COMPANY.name);
  $("#co-note") && ($("#co-note").textContent = COMPANY.note);
  $("#co-unit") && ($("#co-unit").textContent = `All figures in ${COMPANY.unit}`);

  const opening = openingCheck();
  const openNote = $("#opening-check");
  if (openNote) {
    openNote.textContent = Math.abs(opening) < 1e-9
      ? "The opening balance sheet ties exactly, so every forecast year inherits a balanced starting point."
      : `The opening balance sheet is out by ${lakh(opening)} lakh.`;
  }

  buildControls();
  readUrl();

  $$(".scenario").forEach((b) =>
    b.addEventListener("click", () => {
      state.scenario = b.dataset.scenario;
      // a scenario is a fresh set of assumptions, not a layer on the old edits
      state.overrides = {};
      render();
    })
  );

  $("#reset-drivers")?.addEventListener("click", () => {
    state.overrides = {};
    render();
  });

  $("#download-csv")?.addEventListener("click", () => {
    const a = assumptions();
    const csv = toCsv(run(a), a);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${COMPANY.ticker}-three-statement-${state.scenario}.csv`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  $("#copy-link")?.addEventListener("click", async (e) => {
    try {
      await navigator.clipboard.writeText(location.href);
      const b = e.currentTarget;
      const was = b.textContent;
      b.textContent = "Link copied";
      setTimeout(() => (b.textContent = was), 1800);
    } catch { /* clipboard blocked; the URL bar already has it */ }
  });

  render();
}

init();
