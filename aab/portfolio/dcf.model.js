/* ============================================================
   dcf.model.js — a discounted cash flow valuation.

   No DOM here, same as three-statement.model.js. The page is a
   way of looking at this; this is the thing being looked at.

   ------------------------------------------------------------
   IT SITS ON TOP OF THE OPERATING MODEL

   The cash flows are not a second set of invented numbers. They
   are derived from the three-statement model in this same
   folder, which means the DCF inherits a forecast whose balance
   sheet balances — and switching the operating scenario changes
   the valuation, because it changes the cash flows.

   That is how it works in practice, and it is the part most
   spreadsheet DCFs get wrong: a valuation tab with hardcoded
   EBITDA that no longer agrees with the model two tabs to the
   left.

   ------------------------------------------------------------
   WHAT IS ACTUALLY COMPUTED

     unlevered free cash flow
       = EBIT × (1 − tax) + D&A − capex − increase in working capital

     Unlevered — before financing. Interest is deliberately NOT
     deducted: the cost of debt is already inside the discount
     rate, and subtracting it here as well would double-count it.
     This gives enterprise value, from which net debt is bridged
     out to reach equity value.

     WACC
       cost of equity = risk-free + beta × equity risk premium
                        + country risk premium
       WACC = wₑ × cost of equity + w_d × cost of debt × (1 − tax)

     terminal value, either
       Gordon growth   TV = FCFₙ × (1 + g) / (WACC − g)
       exit multiple   TV = EBITDAₙ × multiple

     Both are offered because they answer different objections,
     and each one implies the other: a Gordon TV can be quoted as
     the exit multiple it amounts to, and an exit-multiple TV can
     be quoted as the perpetuity growth it assumes. Those two
     cross-checks are computed and shown, because a terminal
     value that implies 7% growth forever should be visible as
     such rather than buried.

   ------------------------------------------------------------
   THE CONVENTIONS, STATED

   1. Mid-year discounting is optional and off by default. Cash
      arrives through the year rather than all on the last day, so
      mid-year is the more defensible convention; year-end is the
      more common one. The toggle exists because reviewers ask.

   2. When mid-year is on, the explicit forecast is discounted at
      t − 0.5 but the terminal value is discounted at full year n.
      The terminal value is a lump sum standing at the end of the
      forecast, not a flow through it.

   3. Gordon growth requires WACC > g. Where it isn't, the model
      returns a flagged invalid result rather than a number — a
      negative denominator produces a confidently wrong valuation,
      which is worse than no valuation.
   ============================================================ */

/* Relative, not root-absolute: this module is imported both by the
   browser from /portfolio/ and from the filesystem by the test
   runner. "./three-statement.model.js" resolves correctly in both;
   "/portfolio/…" would point at the filesystem root under Node. */
import {
  COMPANY, ACTUALS, SCENARIOS, run as runOperating,
} from "./three-statement.model.js";

export { COMPANY, SCENARIOS };

/* ------------------------------------------------------------
   The equity story — shares, price, and what bridges EV to equity
   ------------------------------------------------------------ */
export const EQUITY = {
  // in lakh, to match the operating model's unit
  sharesOutstanding: 550,
  marketPrice: 23.8,      // BDT per share
  minorities: 0,
  associates: 0,
  note: "Share count and market price are illustrative, consistent with the composite company in the operating model.",
};

/** Net debt at the valuation date, from the last reported balance sheet. */
export const openingNetDebt = (a = ACTUALS) => a.debt + a.revolver - a.cash;

/* ------------------------------------------------------------
   Assumptions
   ------------------------------------------------------------ */
export const DEFAULTS = {
  scenario: "base",

  // WACC build-up
  riskFree: 0.088,        // long BD government yield
  erp: 0.055,             // mature-market equity risk premium
  /* Zero by default, and that is a deliberate modelling choice
     rather than an omission. The risk-free rate above is a BDT
     government yield, which ALREADY prices Bangladesh sovereign
     risk. Adding a country premium on top charges for the same
     risk twice — it cut roughly 40% off the valuation here before
     it was spotted. Build from a local risk-free with no CRP, or
     from a US risk-free with one; never both. The slider stays so
     the second approach is available. */
  crp: 0,
  beta: 1.05,
  costOfDebt: 0.115,
  taxRate: 0.225,
  debtWeight: 0.35,       // target capital structure, not today's

  // terminal value
  tvMethod: "gordon",     // "gordon" | "multiple"
  terminalGrowth: 0.045,
  exitMultiple: 6.5,

  midYear: false,
};

export const DRIVERS = [
  { key: "riskFree", label: "Risk-free rate", group: "Cost of equity",
    unit: "%", min: 0.02, max: 0.16, step: 0.001,
    help: "Long-dated Bangladesh government yield — the return for taking no equity risk." },
  { key: "erp", label: "Equity risk premium", group: "Cost of equity",
    unit: "%", min: 0.02, max: 0.12, step: 0.001,
    help: "What equities must pay above the risk-free rate in a mature market." },
  { key: "crp", label: "Country risk premium", group: "Cost of equity",
    unit: "%", min: 0, max: 0.10, step: 0.001,
    help: "Leave at zero when the risk-free above is a BDT government yield — that yield already prices Bangladesh risk, and adding a premium on top counts it twice. Use it only when building from a US risk-free rate." },
  { key: "beta", label: "Beta", group: "Cost of equity",
    unit: "×", min: 0.4, max: 2.0, step: 0.01,
    help: "How much this share moves relative to the market. Above 1 means more." },

  { key: "costOfDebt", label: "Cost of debt", group: "Capital structure",
    unit: "%", min: 0.03, max: 0.22, step: 0.001,
    help: "Pre-tax borrowing rate. The tax shield is applied inside the WACC." },
  { key: "debtWeight", label: "Debt weight", group: "Capital structure",
    unit: "% of capital", min: 0, max: 0.75, step: 0.01,
    help: "Target capital structure — what the company is financed with over the long run, not necessarily today." },
  { key: "taxRate", label: "Tax rate", group: "Capital structure",
    unit: "%", min: 0, max: 0.45, step: 0.005,
    help: "Used both to unlever the cash flows and to tax-shield the cost of debt." },

  { key: "terminalGrowth", label: "Terminal growth", group: "Terminal value",
    unit: "%", min: -0.02, max: 0.09, step: 0.001,
    help: "Growth assumed forever after the forecast. It cannot exceed the WACC, and above long-run nominal GDP it is a claim the company outgrows the economy indefinitely." },
  { key: "exitMultiple", label: "Exit EV/EBITDA", group: "Terminal value",
    unit: "×", min: 2, max: 16, step: 0.1,
    help: "What the business is worth at the end of the forecast, as a multiple of that year's EBITDA." },
];

const PERCENT_UNITS = new Set(["%", "% of capital"]);
export const isPercentDriver = (key) => {
  const d = DRIVERS.find((x) => x.key === key);
  return d ? PERCENT_UNITS.has(d.unit) : false;
};

/* ------------------------------------------------------------
   WACC
   ------------------------------------------------------------ */
export function costOfEquity(a) {
  return a.riskFree + a.beta * a.erp + a.crp;
}

export function wacc(a) {
  const wd = Math.min(1, Math.max(0, a.debtWeight));
  const we = 1 - wd;
  return we * costOfEquity(a) + wd * a.costOfDebt * (1 - a.taxRate);
}

/* ------------------------------------------------------------
   Cash flows, from the operating model
   ------------------------------------------------------------ */

/**
 * Unlevered free cash flow for each forecast year.
 * Interest is not deducted — see the note at the top.
 */
export function cashFlows(scenarioId = "base", taxRate = DEFAULTS.taxRate) {
  const op = runOperating(SCENARIOS[scenarioId] ?? SCENARIOS.base);
  return op.forecast.map((y, i) => {
    const nopat = y.ebit * (1 - taxRate);
    const fcf = nopat + y.da - y.capex - y.deltaNwc;
    return {
      label: y.label,
      t: i + 1,
      revenue: y.revenue,
      ebitda: y.ebitda,
      ebit: y.ebit,
      nopat,
      da: y.da,
      capex: y.capex,
      deltaNwc: y.deltaNwc,
      fcf,
    };
  });
}

/* ------------------------------------------------------------
   Terminal value, and the cross-checks between the two methods
   ------------------------------------------------------------ */

/** Gordon growth terminal value. Invalid unless WACC > g. */
export function gordonTv(fcfN, w, g) {
  if (!(w > g)) return { value: NaN, valid: false };
  return { value: (fcfN * (1 + g)) / (w - g), valid: true };
}

/** The perpetuity growth a given terminal value implies. */
export const impliedGrowth = (tv, fcfN, w) =>
  tv + fcfN === 0 ? NaN : (tv * w - fcfN) / (fcfN + tv);

/** The EV/EBITDA a given terminal value amounts to. */
export const impliedExitMultiple = (tv, ebitdaN) =>
  ebitdaN ? tv / ebitdaN : NaN;

/* ------------------------------------------------------------
   The valuation
   ------------------------------------------------------------ */

/**
 * @param {object} a assumptions
 * @param {object} over  { wacc, terminalGrowth, exitMultiple } — used by
 *        the sensitivity grid, which varies these directly rather than
 *        working backwards through the WACC build-up.
 */
export function value(a, over = {}) {
  const w = over.wacc ?? wacc(a);
  const g = over.terminalGrowth ?? a.terminalGrowth;
  const mult = over.exitMultiple ?? a.exitMultiple;

  const flows = cashFlows(a.scenario, a.taxRate);
  const n = flows.length;
  const lastYear = flows[n - 1];

  // discount factors
  const rows = flows.map((f) => {
    const t = a.midYear ? f.t - 0.5 : f.t;
    const df = 1 / (1 + w) ** t;
    return { ...f, discountFactor: df, pv: f.fcf * df };
  });

  const pvExplicit = rows.reduce((s, r) => s + r.pv, 0);

  // terminal value — a lump sum at the end of year n, so always
  // discounted at the full n even when the flows use mid-year
  const tvDf = 1 / (1 + w) ** n;

  let tv;
  let tvValid = true;
  if (a.tvMethod === "multiple") {
    tv = lastYear.ebitda * mult;
  } else {
    const gv = gordonTv(lastYear.fcf, w, g);
    tv = gv.value;
    tvValid = gv.valid;
  }

  const pvTerminal = tv * tvDf;
  const ev = pvExplicit + pvTerminal;

  const netDebt = openingNetDebt();
  const equityValue = ev - netDebt - EQUITY.minorities + EQUITY.associates;
  const perShare = EQUITY.sharesOutstanding
    ? equityValue / EQUITY.sharesOutstanding : NaN;

  return {
    wacc: w,
    costOfEquity: costOfEquity(a),
    growth: g,
    exitMultiple: mult,
    rows,
    pvExplicit,
    tv,
    tvValid,
    pvTerminal,
    ev,
    netDebt,
    equityValue,
    perShare,
    marketPrice: EQUITY.marketPrice,
    upside: EQUITY.marketPrice ? perShare / EQUITY.marketPrice - 1 : NaN,
    terminalShare: ev ? pvTerminal / ev : NaN,

    // the two cross-checks
    impliedExitMultiple: impliedExitMultiple(tv, lastYear.ebitda),
    impliedGrowth: impliedGrowth(tv, lastYear.fcf, w),

    // implied multiples at the DCF value, for a sanity read
    evEbitdaEntry: flows[0].ebitda ? ev / flows[0].ebitda : NaN,
    lastYear,
  };
}

/* ------------------------------------------------------------
   Two-way sensitivity

   The table everyone turns to first. Rows are WACC, columns are
   either terminal growth or the exit multiple, and every cell is
   a full revaluation rather than an interpolation.
   ------------------------------------------------------------ */

/** A symmetric ladder of `count` steps around `centre`. */
export function ladder(centre, step, count = 5) {
  const half = Math.floor(count / 2);
  return Array.from({ length: count }, (_, i) => centre + (i - half) * step);
}

/**
 * @param {"terminalGrowth"|"exitMultiple"} axis  what the columns vary
 * @returns {{waccs, cols, cells, base:{row,col}}}
 */
export function sensitivity(a, {
  axis = "terminalGrowth",
  waccStep = 0.005,
  colStep = axis === "terminalGrowth" ? 0.005 : 0.5,
  size = 5,
} = {}) {
  const centreWacc = wacc(a);
  const waccs = ladder(centreWacc, waccStep, size);
  const centreCol = axis === "terminalGrowth" ? a.terminalGrowth : a.exitMultiple;
  const cols = ladder(centreCol, colStep, size);

  // the grid always values with the method the axis belongs to,
  // so a growth axis can't silently be read against a multiple TV
  const forMethod = { ...a, tvMethod: axis === "terminalGrowth" ? "gordon" : "multiple" };

  const cells = waccs.map((w) =>
    cols.map((c) => {
      const v = value(forMethod, { wacc: w, [axis]: c });
      return {
        wacc: w,
        col: c,
        perShare: v.perShare,
        // Gordon needs WACC > g; anything else is not a valuation
        valid: v.tvValid && Number.isFinite(v.perShare) && v.perShare > 0,
        upside: v.upside,
      };
    })
  );

  const mid = Math.floor(size / 2);
  const finite = cells.flat().filter((c) => c.valid).map((c) => c.perShare);

  return {
    axis,
    waccs,
    cols,
    cells,
    base: { row: mid, col: mid },
    min: finite.length ? Math.min(...finite) : NaN,
    max: finite.length ? Math.max(...finite) : NaN,
  };
}

/* ------------------------------------------------------------
   CSV
   ------------------------------------------------------------ */
export function toCsv(a) {
  const v = value(a);
  const grid = sensitivity(a, { axis: a.tvMethod === "multiple" ? "exitMultiple" : "terminalGrowth" });
  const esc = (s) =>
    typeof s === "string" && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  const L = [];

  L.push([`${COMPANY.name} — discounted cash flow`].map(esc).join(","));
  L.push([COMPANY.note].map(esc).join(","));
  L.push([EQUITY.note].map(esc).join(","));
  L.push([`All figures in ${COMPANY.unit} unless marked per share`].map(esc).join(","));
  L.push("");

  L.push(["ASSUMPTIONS"].join(","));
  L.push(["Operating scenario", SCENARIOS[a.scenario]?.label ?? a.scenario].map(esc).join(","));
  DRIVERS.forEach((d) => {
    const raw = a[d.key];
    L.push([d.label, d.unit,
      PERCENT_UNITS.has(d.unit) ? `${(raw * 100).toFixed(2)}%` : raw].map(esc).join(","));
  });
  L.push(["Terminal value method", a.tvMethod === "multiple" ? "Exit EV/EBITDA" : "Gordon growth"].map(esc).join(","));
  L.push(["Mid-year discounting", a.midYear ? "Yes" : "No"].join(","));
  L.push(["Cost of equity", `${(v.costOfEquity * 100).toFixed(2)}%`].map(esc).join(","));
  L.push(["WACC", `${(v.wacc * 100).toFixed(2)}%`].map(esc).join(","));
  L.push("");

  L.push(["FREE CASH FLOW", ...v.rows.map((r) => r.label)].map(esc).join(","));
  const line = (label, fn) =>
    L.push([label, ...v.rows.map((r) => fn(r).toFixed(1))].map(esc).join(","));
  line("EBIT", (r) => r.ebit);
  line("NOPAT", (r) => r.nopat);
  line("Depreciation & amortisation", (r) => r.da);
  line("Capital expenditure", (r) => -r.capex);
  line("Increase in working capital", (r) => -r.deltaNwc);
  line("Unlevered free cash flow", (r) => r.fcf);
  line("Discount factor", (r) => r.discountFactor);
  line("Present value", (r) => r.pv);
  L.push("");

  L.push(["VALUATION"].join(","));
  [
    ["PV of forecast cash flows", v.pvExplicit],
    ["Terminal value", v.tv],
    ["PV of terminal value", v.pvTerminal],
    ["Terminal value as % of EV", v.terminalShare * 100],
    ["Enterprise value", v.ev],
    ["Less: net debt", -v.netDebt],
    ["Equity value", v.equityValue],
    ["Shares outstanding (lakh)", EQUITY.sharesOutstanding],
    ["Value per share (BDT)", v.perShare],
    ["Market price (BDT)", v.marketPrice],
    ["Upside %", v.upside * 100],
    ["Implied exit EV/EBITDA", v.impliedExitMultiple],
    ["Implied perpetuity growth %", v.impliedGrowth * 100],
  ].forEach(([k, n]) => L.push([k, Number.isFinite(n) ? n.toFixed(2) : ""].map(esc).join(",")));
  L.push("");

  const axisName = grid.axis === "terminalGrowth" ? "Terminal growth" : "Exit EV/EBITDA";
  L.push([`SENSITIVITY — value per share (BDT): WACC vs ${axisName}`].map(esc).join(","));
  L.push(["WACC \\ " + axisName, ...grid.cols.map((c) =>
    grid.axis === "terminalGrowth" ? `${(c * 100).toFixed(1)}%` : `${c.toFixed(1)}x`)]
    .map(esc).join(","));
  grid.cells.forEach((row, i) => {
    L.push([`${(grid.waccs[i] * 100).toFixed(1)}%`,
      ...row.map((c) => (c.valid ? c.perShare.toFixed(2) : "n/a"))].map(esc).join(","));
  });

  return L.join("\n");
}
