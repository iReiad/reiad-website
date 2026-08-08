/* ============================================================
   three-statement.model.js — the engine.

   A real three-statement model: an income statement, a balance
   sheet and a cash flow statement that are LINKED, so that a
   change to one assumption flows through all three and the
   balance sheet still balances afterwards. That last part is the
   whole discipline — a model whose balance check is a hardcoded
   zero is a spreadsheet with three tabs, not a model.

   No DOM in this file, on purpose. The maths is testable on its
   own (see the balance-check test), and the page in
   three-statement.html is only a way of looking at it.

   ------------------------------------------------------------
   HOW THE THREE STATEMENTS LINK

     income statement → net income
       → balance sheet: retained earnings
       → cash flow:     top line of operating cash flow

     working capital days → AR / inventory / AP on the balance
       sheet, and the CHANGE in them is a cash flow item

     capex → PP&E on the balance sheet, and depreciation flows
       back into the income statement next year

     debt schedule → interest expense on the income statement,
       repayments in financing cash flow

     everything → cash, which is the balance sheet's plug from
       the bottom of the cash flow statement

   ------------------------------------------------------------
   WHY THE BALANCE CHECK IS ALWAYS ZERO (unless you break it)

   Write A for assets and L+E for liabilities plus equity. For any
   forecast year t, substituting the roll-forwards above gives

     A(t) − LE(t) = A(t−1) − LE(t−1)

   — the difference is carried, not created. So if the OPENING
   balance sheet balances, every forecast year balances, whatever
   the assumptions. That makes the check a genuine test: if it
   ever prints a non-zero, either the opening balance sheet the
   user typed doesn't balance, or this file has a bug. It is not
   decoration.

   ------------------------------------------------------------
   THE TWO SIMPLIFICATIONS, STATED

   1. Interest is charged on OPENING debt, not on an average or a
      closing balance. Charging it on closing debt makes interest
      depend on cash, which depends on interest — the classic
      circular reference. Real models resolve that with iterative
      calculation; here the opening-balance convention keeps it
      deterministic and is a normal convention in practice.

   2. The revolver funds any shortfall below the minimum cash
      balance, and its interest is likewise charged on the opening
      balance. It is a cash sweep, not a covenant model.

   Both are the kind of thing worth being explicit about, because
   a model that hides its conventions can't be checked.
   ============================================================ */

/* ------------------------------------------------------------
   The company.

   A representative Bangladeshi listed manufacturer — cement and
   building materials, the profile of a mid-cap on the DSE main
   board. The figures are illustrative and internally consistent,
   NOT the filed accounts of any real company: publishing invented
   numbers under a real company's name would be inventing that
   company's financial records. Everything is in BDT lakh.
   ------------------------------------------------------------ */
export const COMPANY = {
  name: "Padma Cement & Building Materials PLC",
  short: "Padma Cement",
  ticker: "PADMACEM",
  note: "Illustrative composite of a DSE-listed mid-cap manufacturer. Not a real company's accounts.",
  unit: "BDT lakh",
  baseYear: "FY24A",
  years: ["FY25E", "FY26E", "FY27E", "FY28E", "FY29E"],
};

/** The last reported year — the model's starting point. */
export const ACTUALS = {
  revenue: 48500,
  grossMargin: 0.271,
  opexPct: 0.128,
  da: 2180,
  interest: 1240,
  taxRate: 0.225,

  // opening balance sheet (this set balances — see BALANCE below)
  cash: 3120,
  ar: 7980,
  inventory: 8850,
  ppe: 32400,
  ap: 6420,
  debt: 18600,
  revolver: 0,
  // assets 52,350 − payables 6,420 − term debt 18,600 = 27,330.
  // This has to tie exactly: an opening balance sheet that is out by
  // any amount hands that same error to every forecast year, and the
  // balance check would then be measuring the typo rather than the
  // model. openingCheck() below asserts it.
  equity: 27330,
};

/* Sanity: the opening balance sheet must balance, or every
   forecast year inherits the error. Exported so the page can
   show it rather than quietly hiding it. */
export const openingCheck = (a = ACTUALS) =>
  a.cash + a.ar + a.inventory + a.ppe - (a.ap + a.debt + a.revolver + a.equity);

/* ------------------------------------------------------------
   Scenarios — bundles of assumptions, not separate models.
   ------------------------------------------------------------ */
export const SCENARIOS = {
  base: {
    id: "base",
    label: "Base",
    blurb: "Demand grows with construction activity; input costs and the taka stay where they are.",
    revenueGrowth: 0.085,
    grossMargin: 0.271,
    opexPct: 0.128,
    capexPct: 0.062,
    depRate: 0.085,
    taxRate: 0.225,
    dso: 60,
    dio: 78,
    dpo: 48,
    interestRate: 0.115,
    revolverRate: 0.135,
    debtRepayment: 2400,
    dividendPayout: 0.30,
    minCash: 2000,
  },
  upside: {
    id: "upside",
    label: "Upside",
    blurb: "Public infrastructure spending lands, the new kiln runs at rate, and clinker prices ease.",
    revenueGrowth: 0.142,
    grossMargin: 0.298,
    opexPct: 0.121,
    capexPct: 0.071,
    depRate: 0.085,
    taxRate: 0.225,
    dso: 54,
    dio: 70,
    dpo: 52,
    interestRate: 0.108,
    revolverRate: 0.130,
    debtRepayment: 3200,
    dividendPayout: 0.35,
    minCash: 2000,
  },
  downside: {
    id: "downside",
    label: "Downside",
    blurb: "Construction stalls, the taka weakens against the dollar, and imported clinker costs more.",
    revenueGrowth: 0.021,
    grossMargin: 0.232,
    opexPct: 0.139,
    capexPct: 0.045,
    depRate: 0.085,
    taxRate: 0.225,
    dso: 72,
    dio: 92,
    dpo: 40,
    interestRate: 0.128,
    revolverRate: 0.155,
    debtRepayment: 1600,
    dividendPayout: 0.10,
    minCash: 2000,
  },
};

/** Metadata for every editable assumption: how to show it, and
    the range a slider is allowed to move it through. Keeping this
    beside the maths means the UI can't drift from the model. */
export const DRIVERS = [
  { key: "revenueGrowth", label: "Revenue growth", group: "Growth & margin",
    unit: "%", min: -0.15, max: 0.35, step: 0.001,
    help: "Year-on-year growth applied to the prior year's revenue." },
  { key: "grossMargin", label: "Gross margin", group: "Growth & margin",
    unit: "%", min: 0.10, max: 0.45, step: 0.001,
    help: "Revenue less cost of sales. The single biggest lever in this model." },
  { key: "opexPct", label: "Operating costs", group: "Growth & margin",
    unit: "% of revenue", min: 0.05, max: 0.25, step: 0.001,
    help: "Selling, general and administrative costs, held as a share of revenue." },

  { key: "capexPct", label: "Capex", group: "Capital & depreciation",
    unit: "% of revenue", min: 0, max: 0.20, step: 0.001,
    help: "Cash spent on plant. Adds to PP&E, and to depreciation from the next year." },
  { key: "depRate", label: "Depreciation rate", group: "Capital & depreciation",
    unit: "% of opening PP&E", min: 0.03, max: 0.20, step: 0.001,
    help: "Charged on the opening net book value: a reducing-balance convention." },

  { key: "dso", label: "Receivable days", group: "Working capital",
    unit: "days", min: 20, max: 120, step: 1,
    help: "How long customers take to pay. Every extra day is cash out of the business." },
  { key: "dio", label: "Inventory days", group: "Working capital",
    unit: "days", min: 20, max: 150, step: 1,
    help: "How long stock sits before it is sold, on cost of sales." },
  { key: "dpo", label: "Payable days", group: "Working capital",
    unit: "days", min: 15, max: 120, step: 1,
    help: "How long the company takes to pay suppliers. Stretching it is a cash source, up to a point." },

  { key: "interestRate", label: "Interest rate on term debt", group: "Financing",
    unit: "%", min: 0.04, max: 0.22, step: 0.001,
    help: "Charged on the opening balance, so the model stays free of circular references." },
  { key: "revolverRate", label: "Revolver rate", group: "Financing",
    unit: "%", min: 0.05, max: 0.25, step: 0.001,
    help: "The cost of the short-term facility that funds any cash shortfall." },
  { key: "debtRepayment", label: "Term debt repayment", group: "Financing",
    unit: "lakh/yr", min: 0, max: 6000, step: 100,
    help: "Scheduled amortisation each year, until the balance reaches zero." },
  { key: "dividendPayout", label: "Dividend payout", group: "Financing",
    unit: "% of net income", min: 0, max: 0.9, step: 0.01,
    help: "Paid out of the year's profit. Reduces both cash and retained earnings." },
  { key: "minCash", label: "Minimum cash", group: "Financing",
    unit: "lakh", min: 0, max: 8000, step: 100,
    help: "The balance the company will not go below; the revolver funds the gap." },

  { key: "taxRate", label: "Tax rate", group: "Tax",
    unit: "%", min: 0, max: 0.45, step: 0.005,
    help: "Applied to profit before tax. No losses are carried forward in this version." },
];

const isPct = (d) => d.unit === "%" || d.unit.startsWith("% ");
export const driverFor = (key) => DRIVERS.find((d) => d.key === key);
export const isPercentDriver = (key) => {
  const d = driverFor(key);
  return d ? isPct(d) : false;
};

/* ------------------------------------------------------------
   The model
   ------------------------------------------------------------ */

/**
 * Run the model.
 * @param {object} a  assumptions (a scenario, possibly edited)
 * @param {object} open  opening balance sheet + last actual year
 * @param {number} years  how many years to forecast
 * @returns {{years: object[], base: object, meta: object}}
 */
export function run(a, open = ACTUALS, years = COMPANY.years.length) {
  const rows = [];

  // The base year, restated in the same shape as a forecast year so
  // the tables can render actual and forecast columns identically.
  const baseRevenue = open.revenue;
  const baseCogs = baseRevenue * (1 - open.grossMargin);
  let prev = {
    label: COMPANY.baseYear,
    actual: true,
    revenue: baseRevenue,
    cogs: baseCogs,
    grossProfit: baseRevenue - baseCogs,
    opex: baseRevenue * open.opexPct,
    ebitda: baseRevenue - baseCogs - baseRevenue * open.opexPct,
    da: open.da,
    ebit: baseRevenue - baseCogs - baseRevenue * open.opexPct - open.da,
    interest: open.interest,
    revolverInterest: 0,
    ebt: baseRevenue - baseCogs - baseRevenue * open.opexPct - open.da - open.interest,
    tax: 0,
    netIncome: 0,

    cash: open.cash,
    ar: open.ar,
    inventory: open.inventory,
    ppe: open.ppe,
    ap: open.ap,
    debt: open.debt,
    revolver: open.revolver,
    equity: open.equity,

    capex: 0,
    dividends: 0,
    deltaNwc: 0,
    cfo: 0,
    cfi: 0,
    cff: 0,
    netChangeInCash: 0,
    revolverDraw: 0,
    revolverRepay: 0,
  };
  prev.tax = Math.max(0, prev.ebt) * open.taxRate;
  prev.netIncome = prev.ebt - prev.tax;
  prev.nwc = prev.ar + prev.inventory - prev.ap;
  prev.assets = prev.cash + prev.ar + prev.inventory + prev.ppe;
  prev.liabEquity = prev.ap + prev.debt + prev.revolver + prev.equity;
  prev.check = prev.assets - prev.liabEquity;
  rows.push(prev);

  for (let i = 0; i < years; i++) {
    const y = {};
    y.label = COMPANY.years[i] ?? `FY${30 + i}E`;
    y.actual = false;

    /* ---------- income statement ---------- */
    y.revenue = prev.revenue * (1 + a.revenueGrowth);
    y.cogs = y.revenue * (1 - a.grossMargin);
    y.grossProfit = y.revenue - y.cogs;
    y.opex = y.revenue * a.opexPct;
    y.ebitda = y.grossProfit - y.opex;

    // depreciation on the OPENING net book value
    y.da = prev.ppe * a.depRate;
    y.ebit = y.ebitda - y.da;

    // interest on OPENING balances — see the note at the top
    y.interest = prev.debt * a.interestRate;
    y.revolverInterest = prev.revolver * a.revolverRate;
    y.ebt = y.ebit - y.interest - y.revolverInterest;
    y.tax = Math.max(0, y.ebt) * a.taxRate;
    y.netIncome = y.ebt - y.tax;

    /* ---------- working capital ---------- */
    y.ar = (y.revenue * a.dso) / 365;
    y.inventory = (y.cogs * a.dio) / 365;
    y.ap = (y.cogs * a.dpo) / 365;
    y.nwc = y.ar + y.inventory - y.ap;
    y.deltaNwc = y.nwc - prev.nwc;

    /* ---------- cash flow ---------- */
    y.capex = y.revenue * a.capexPct;
    y.dividends = Math.max(0, y.netIncome) * a.dividendPayout;
    // repay only what is left outstanding
    y.debtRepayment = Math.min(a.debtRepayment, prev.debt);

    y.cfo = y.netIncome + y.da - y.deltaNwc;
    y.cfi = -y.capex;
    y.cffBeforeRevolver = -y.debtRepayment - y.dividends;

    const cashBefore = prev.cash + y.cfo + y.cfi + y.cffBeforeRevolver;

    /* ---------- the revolver ----------
       Below the minimum, draw enough to reach it. Above it, sweep the
       surplus against anything outstanding. */
    if (cashBefore < a.minCash) {
      y.revolverDraw = a.minCash - cashBefore;
      y.revolverRepay = 0;
    } else {
      y.revolverDraw = 0;
      y.revolverRepay = Math.min(prev.revolver, cashBefore - a.minCash);
    }
    y.revolver = prev.revolver + y.revolverDraw - y.revolverRepay;
    y.cff = y.cffBeforeRevolver + y.revolverDraw - y.revolverRepay;
    y.netChangeInCash = y.cfo + y.cfi + y.cff;
    y.cash = prev.cash + y.netChangeInCash;

    /* ---------- balance sheet ---------- */
    y.ppe = prev.ppe + y.capex - y.da;
    y.debt = prev.debt - y.debtRepayment;
    y.equity = prev.equity + y.netIncome - y.dividends;

    y.assets = y.cash + y.ar + y.inventory + y.ppe;
    y.liabEquity = y.ap + y.debt + y.revolver + y.equity;
    y.check = y.assets - y.liabEquity;

    /* ---------- derived ---------- */
    y.netDebt = y.debt + y.revolver - y.cash;
    y.fcf = y.cfo + y.cfi;
    y.grossMarginPct = y.revenue ? y.grossProfit / y.revenue : 0;
    y.ebitdaMarginPct = y.revenue ? y.ebitda / y.revenue : 0;
    y.netMarginPct = y.revenue ? y.netIncome / y.revenue : 0;
    y.roe = y.equity ? y.netIncome / y.equity : 0;
    y.netDebtEbitda = y.ebitda ? y.netDebt / y.ebitda : 0;
    y.interestCover = (y.interest + y.revolverInterest)
      ? y.ebit / (y.interest + y.revolverInterest) : 0;

    rows.push(y);
    prev = y;
  }

  // base-year derived figures, for a like-for-like first column
  const b = rows[0];
  b.netDebt = b.debt + b.revolver - b.cash;
  b.fcf = 0;
  b.grossMarginPct = b.grossProfit / b.revenue;
  b.ebitdaMarginPct = b.ebitda / b.revenue;
  b.netMarginPct = b.netIncome / b.revenue;
  b.roe = b.equity ? b.netIncome / b.equity : 0;
  b.netDebtEbitda = b.ebitda ? b.netDebt / b.ebitda : 0;
  b.interestCover = b.interest ? b.ebit / b.interest : 0;

  const forecast = rows.slice(1);
  const last = rows[rows.length - 1];
  const n = forecast.length;

  return {
    rows,
    base: b,
    forecast,
    meta: {
      revenueCagr: n && b.revenue > 0
        ? (last.revenue / b.revenue) ** (1 / n) - 1 : 0,
      exitEbitdaMargin: last.ebitdaMarginPct,
      exitNetDebtEbitda: last.netDebtEbitda,
      cumulativeFcf: forecast.reduce((s, y) => s + y.fcf, 0),
      minCashInPlan: Math.min(...forecast.map((y) => y.cash)),
      peakRevolver: Math.max(0, ...forecast.map((y) => y.revolver)),
      // the number that says whether the model is sound
      worstCheck: Math.max(...rows.map((y) => Math.abs(y.check))),
      everNegativeEquity: forecast.some((y) => y.equity < 0),
    },
  };
}

/* ------------------------------------------------------------
   Export
   ------------------------------------------------------------ */

const CSV_ROWS = [
  ["INCOME STATEMENT", null],
  ["Revenue", "revenue"],
  ["Cost of sales", "cogs", true],
  ["Gross profit", "grossProfit"],
  ["Operating costs", "opex", true],
  ["EBITDA", "ebitda"],
  ["Depreciation & amortisation", "da", true],
  ["EBIT", "ebit"],
  ["Interest: term debt", "interest", true],
  ["Interest: revolver", "revolverInterest", true],
  ["Profit before tax", "ebt"],
  ["Tax", "tax", true],
  ["Net income", "netIncome"],
  ["", null],
  ["BALANCE SHEET", null],
  ["Cash", "cash"],
  ["Trade receivables", "ar"],
  ["Inventory", "inventory"],
  ["Property, plant & equipment", "ppe"],
  ["Total assets", "assets"],
  ["Trade payables", "ap"],
  ["Term debt", "debt"],
  ["Revolver", "revolver"],
  ["Shareholders' equity", "equity"],
  ["Total liabilities & equity", "liabEquity"],
  ["Balance check", "check"],
  ["", null],
  ["CASH FLOW", null],
  ["Net income", "netIncome"],
  ["Depreciation & amortisation", "da"],
  ["Change in working capital", "deltaNwc", true],
  ["Cash from operations", "cfo"],
  ["Capital expenditure", "capex", true],
  ["Cash from investing", "cfi"],
  ["Debt repayment", "debtRepayment", true],
  ["Dividends paid", "dividends", true],
  ["Revolver draw / (repay)", null, false, (y) => y.revolverDraw - y.revolverRepay],
  ["Cash from financing", "cff"],
  ["Net change in cash", "netChangeInCash"],
  ["Closing cash", "cash"],
];

/** The model as CSV — the thing a reviewer opens in Excel. */
export function toCsv(result, assumptions) {
  const esc = (v) =>
    typeof v === "string" && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const lines = [];

  lines.push([`${COMPANY.name}: three-statement model`].map(esc).join(","));
  lines.push([COMPANY.note].map(esc).join(","));
  lines.push([`All figures in ${COMPANY.unit}`].map(esc).join(","));
  lines.push("");

  lines.push(["ASSUMPTIONS"].join(","));
  DRIVERS.forEach((d) => {
    const raw = assumptions[d.key];
    const v = isPct(d) ? `${(raw * 100).toFixed(2)}%` : raw;
    lines.push([d.label, d.unit, v].map(esc).join(","));
  });
  lines.push("");

  const header = ["", ...result.rows.map((y) => y.label)];
  lines.push(header.map(esc).join(","));

  CSV_ROWS.forEach(([label, key, negate, fn]) => {
    if (!key && !fn) { lines.push([label].map(esc).join(",")); return; }
    const cells = result.rows.map((y) => {
      const v = fn ? fn(y) : y[key];
      if (!Number.isFinite(v)) return "";
      return (negate ? -v : v).toFixed(1);
    });
    lines.push([label, ...cells].map(esc).join(","));
  });

  return lines.join("\n");
}
