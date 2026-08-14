/* ============================================================
   stock.model.js: the engine behind the stock check.

   No DOM in this file. Everything here is a pure function of a
   plain object of numbers, which is what makes it testable: the
   whole of stock.test.mjs runs in Node with no browser.

   WHAT IT IS, AND WHAT IT ISN'T

   It scores a company against forty-odd ratios grouped into six
   pillars, weights the pillars by the kind of investor you say
   you are, applies a short list of vetoes that no score can
   argue with, and reports a verdict band.

   It is NOT a signal. It cannot see a fraud, a related-party
   loan book, a factory fire, a change of management or next
   week's news, and it says so on the page. What it does is make
   the arithmetic explicit, so that a decision is taken with the
   numbers in front of you rather than a tip from a Facebook
   group.

   UNITS

   Every money figure is in LAKH BDT, the unit DSE annual reports
   and price-sensitive statements actually use, and share counts
   are in LAKH SHARES. That makes EPS fall out clean:

       netIncome (lakh BDT) / shares (lakh) = BDT per share

   Prices, EPS, BVPS and DPS are plain BDT per share.

   THE ONE STRUCTURAL DECISION

   Metrics are a registry, not a pile of if-statements. Each one
   declares its pillar, its weight inside that pillar, how to
   compute itself, when it doesn't apply, and the anchor points
   that turn a raw number into a 0–100 score. Everything else,
   the pillar scores, the scorecard table, the "what's dragging
   this down" list, the CSV export, is a loop over that
   registry. Adding a ratio is one entry, and it appears in all
   six places at once.
   ============================================================ */

/* ============================================================
   SCORING PRIMITIVE

   A metric's raw value becomes a 0–100 score by linear
   interpolation between anchor points. Anchors are [value,
   score] pairs sorted by value; outside the ends the score
   clamps.

   Anchors, rather than thresholds, because a P/E of 14.9 and a
   P/E of 15.1 are the same company and should not fall into
   different buckets. And they read like judgement written down:
   [[0.4, 100], [1.0, 60], [2.0, 15]] on relative P/E says "40%
   of the sector is as good as it gets, in line is a pass, double
   is nearly a fail"– which is arguable, out loud, in a way a
   black box isn't.
   ============================================================ */

export function band(v, anchors) {
  if (!Number.isFinite(v)) return null;
  const a = anchors;
  if (v <= a[0][0]) return a[0][1];
  if (v >= a[a.length - 1][0]) return a[a.length - 1][1];
  for (let i = 0; i < a.length - 1; i++) {
    const [x0, y0] = a[i];
    const [x1, y1] = a[i + 1];
    if (v >= x0 && v <= x1) {
      const t = x1 === x0 ? 0 : (v - x0) / (x1 - x0);
      return y0 + t * (y1 - y0);
    }
  }
  return a[a.length - 1][1];
}

/** strong / good / fair / weak / poor: the word beside the number. */
export function grade(score) {
  if (score === null || !Number.isFinite(score)) return "na";
  if (score >= 80) return "strong";
  if (score >= 62) return "good";
  if (score >= 45) return "fair";
  if (score >= 28) return "weak";
  return "poor";
}

const div = (a, b) => (Number.isFinite(a) && Number.isFinite(b) && b !== 0 ? a / b : NaN);
const pctChange = (now, then) =>
  Number.isFinite(now) && Number.isFinite(then) && then > 0 ? ((now - then) / then) * 100 : NaN;

/** Compound annual growth over n years, only where it means
    something: you cannot take the cube root of a sign change, and
    a "CAGR" from a loss to a profit is a number with no content. */
export function cagr(now, then, years) {
  if (!Number.isFinite(now) || !Number.isFinite(then)) return NaN;
  if (now <= 0 || then <= 0 || years <= 0) return NaN;
  return ((now / then) ** (1 / years) - 1) * 100;
}

/* ============================================================
   SECTORS

   Medians are indicative: they move, and nobody publishes an
   audited "DSE pharma median P/E". They are here so the tool can
   say "expensive *relative to what*", and every one of them is
   an editable input on the page. Override them with whatever
   you can source; the scoring uses your number.

   `financial: true` changes the analysis rather than the
   benchmarks. See FINANCIAL MODE below.
   ============================================================ */

export const SECTORS = {
  pharma:      { pe: 16, pb: 2.6, roe: 15, netMargin: 13 },
  bank:        { pe: 8,  pb: 0.9, roe: 13, netMargin: 22, financial: true },
  nbfi:        { pe: 12, pb: 1.2, roe: 9,  netMargin: 15, financial: true },
  insurance:   { pe: 13, pb: 1.6, roe: 12, netMargin: 10, financial: true },
  textile:     { pe: 11, pb: 0.9, roe: 9,  netMargin: 5 },
  cement:      { pe: 15, pb: 1.8, roe: 10, netMargin: 5 },
  food:        { pe: 22, pb: 4.0, roe: 18, netMargin: 8 },
  fuel:        { pe: 11, pb: 1.5, roe: 14, netMargin: 11 },
  engineering: { pe: 17, pb: 1.9, roe: 11, netMargin: 7 },
  it:          { pe: 18, pb: 2.8, roe: 16, netMargin: 17 },
  telecom:     { pe: 14, pb: 8.0, roe: 45, netMargin: 15 },
  ceramics:    { pe: 20, pb: 1.7, roe: 8,  netMargin: 6 },
  other:       { pe: 15, pb: 1.6, roe: 12, netMargin: 8 },
};

export const isFinancialSector = (s) => SECTORS[s]?.financial === true;

/* The three headline indices, as a benchmark to price against.
   DSES is the Shariah index: it is in here because "cheap
   against the market" means something different if the only
   market you can buy is the Shariah-compliant part of it. */
export const INDICES = {
  dsex: { pe: 12.5 },
  ds30: { pe: 11.5 },
  dses: { pe: 13.5 },
};

/* ============================================================
   DEFAULT INPUTS

   The pharma archetype below. Every preset is a complete,
   internally consistent set of statements: the balance sheet
   balances, the cash flow is plausible against the income
   statement, and paid-up capital equals shares × 10 BDT face
   value, which is the DSE convention.

   They are ARCHETYPES, not companies. Publishing invented
   figures under a real listed company's name would be inventing
   that company's accounts, and anyone who checked would find
   they don't match. What is real is the method, type your own
   numbers off the annual report and every figure on the page is
   about your company.
   ============================================================ */

export const DEFAULTS = {
  /* --- market --- */
  price: 210, shares: 1200, high52: 246, low52: 168,
  ma50: 205, ma200: 198, turnover: 85, freeFloat: 38,
  category: "A", sector: "pharma", benchmark: "dsex",
  stockReturn12m: 12, indexReturn12m: 7,

  /* --- income statement, last 12 months, lakh BDT --- */
  revenue: 95000, grossProfit: 45600, ebit: 20900, depreciation: 5200,
  interestExpense: 1300, netIncome: 14800,

  /* --- balance sheet, lakh BDT --- */
  totalAssets: 132000, currentAssets: 52000, inventory: 21000, cash: 9500,
  currentLiabilities: 26000, totalDebt: 19000, equity: 92000, reserves: 80000,

  /* --- cash flow, lakh BDT --- */
  cfo: 19500, capex: 11000,

  /* --- dividend --- */
  dps: 4.5, divTax: 10, yearsPaid: 12,

  /* --- prior year: optional, powers the trend metrics and
         the Piotroski score. Left at zero, those metrics report
         "not testable" rather than scoring falsely. --- */
  revenuePrev: 84000, grossProfitPrev: 39500, netIncomePrev: 12900,
  totalAssetsPrev: 121000, currentAssetsPrev: 47500, currentLiabilitiesPrev: 25000,
  totalDebtPrev: 21000, cfoPrev: 17200, sharesPrev: 1200,
  netIncome3y: 9600,

  /* --- financial-sector extras, ignored elsewhere --- */
  car: 0, npl: 0, provisionCover: 0, costIncome: 0, adr: 0,

  /* --- benchmarks, all editable --- */
  sectorPE: 16, sectorPB: 2.6, sectorROE: 15, sectorMargin: 13,
  marketPE: 12.5, riskFree: 11.04, fdr: 8.5, inflation: 9.7,

  /* --- Shariah screen --- */
  nonCompliantIncome: 3,
};

/* ============================================================
   RATIOS

   One pass over the inputs producing every derived number the
   metrics need. Kept separate from scoring so the page can show
   a ratio without a verdict attached to it, and so the tests can
   check arithmetic and judgement independently.
   ============================================================ */

export function ratios(d) {
  const r = {};
  const fin = isFinancialSector(d.sector);
  r.isFinancial = fin;

  /* --- size --- */
  r.mcap = d.price * d.shares;                       // lakh BDT
  r.eps = div(d.netIncome, d.shares);
  r.epsPrev = div(d.netIncomePrev, d.sharesPrev || d.shares);
  r.bvps = div(d.equity, d.shares);
  r.ebitda = d.ebit + d.depreciation;
  r.netDebt = d.totalDebt - d.cash;
  r.ev = r.mcap + d.totalDebt - d.cash;
  r.fcf = d.cfo - d.capex;
  r.paidUp = d.shares * 10;                          // 10 BDT face value

  /* --- valuation --- */
  r.pe = r.eps > 0 ? div(d.price, r.eps) : NaN;
  r.pb = r.bvps > 0 ? div(d.price, r.bvps) : NaN;
  r.ps = div(r.mcap, d.revenue);
  r.evEbitda = r.ebitda > 0 ? div(r.ev, r.ebitda) : NaN;
  r.earningsYield = r.pe > 0 ? 100 / r.pe : NaN;
  r.fcfYield = div(r.fcf, r.mcap) * 100;
  r.divYield = div(d.dps, d.price) * 100;
  r.divYieldNet = r.divYield * (1 - (d.divTax || 0) / 100);

  /* Relative to the sector, which is the only way "expensive"
     means anything. A pharma company on 16× and a textile mill
     on 16× are not the same news. */
  r.peRel = div(r.pe, d.sectorPE);
  r.pbRel = div(r.pb, d.sectorPB);
  r.peVsMarket = div(r.pe, d.marketPE);

  /* --- growth --- */
  r.revGrowth = pctChange(d.revenue, d.revenuePrev);
  r.epsGrowth = pctChange(r.eps, r.epsPrev);
  r.niGrowth = pctChange(d.netIncome, d.netIncomePrev);
  r.epsCagr3y = cagr(d.netIncome, d.netIncome3y, 3);
  /* Operating cash growth, which is a harder number to manage than
     profit growth and so a better read on whether the business is
     actually getting bigger. Undefined from a negative base, you
     cannot express a recovery from cash burn as a growth rate. */
  r.cfoGrowth = d.cfoPrev > 0 ? pctChange(d.cfo, d.cfoPrev) : NaN;
  r.peg = r.pe > 0 && r.epsCagr3y > 0 ? div(r.pe, r.epsCagr3y) : NaN;

  /* --- profitability --- */
  const avgAssets = d.totalAssetsPrev > 0
    ? (d.totalAssets + d.totalAssetsPrev) / 2
    : d.totalAssets;
  r.avgAssets = avgAssets;
  r.roe = div(d.netIncome, d.equity) * 100;
  r.roa = div(d.netIncome, avgAssets) * 100;
  r.capitalEmployed = d.totalAssets - d.currentLiabilities;
  r.roce = fin ? NaN : div(d.ebit, r.capitalEmployed) * 100;
  r.grossMargin = div(d.grossProfit, d.revenue) * 100;
  r.opMargin = div(d.ebit, d.revenue) * 100;
  r.netMargin = div(d.netIncome, d.revenue) * 100;
  r.netMarginPrev = div(d.netIncomePrev, d.revenuePrev) * 100;
  r.marginTrend = r.netMargin - r.netMarginPrev;
  r.marginRel = div(r.netMargin, d.sectorMargin);
  r.roeRel = r.roe > 0 && d.sectorROE > 0 ? div(r.roe, d.sectorROE) : NaN;
  r.assetTurnover = fin ? NaN : div(d.revenue, avgAssets);

  /* DuPont: the same ROE, told as three separate stories. A 20%
     ROE built on a 3% margin and five turns of leverage is a
     different company from one built on a 20% margin and no
     debt, and the single number hides which you are holding. */
  r.dupontMargin = r.netMargin;
  r.dupontTurnover = div(d.revenue, avgAssets);
  r.dupontLeverage = div(avgAssets, d.equity);
  r.dupontRoe = (r.dupontMargin / 100) * r.dupontTurnover * r.dupontLeverage * 100;

  /* --- earnings quality --- */
  r.cashConversion = d.netIncome > 0 ? div(d.cfo, d.netIncome) : NaN;
  r.accruals = div(d.netIncome - d.cfo, avgAssets);

  /* --- balance sheet --- */
  r.debtEquity = d.equity > 0 ? div(d.totalDebt, d.equity) : NaN;
  r.netDebtEbitda = r.ebitda > 0 ? div(r.netDebt, r.ebitda) : NaN;
  r.interestCover = d.interestExpense > 0 ? div(d.ebit, d.interestExpense) : NaN;
  r.currentRatio = fin ? NaN : div(d.currentAssets, d.currentLiabilities);
  r.quickRatio = fin ? NaN : div(d.currentAssets - d.inventory, d.currentLiabilities);

  /* --- dividend --- */
  r.payout = r.eps > 0 ? div(d.dps, r.eps) * 100 : NaN;
  r.divCover = d.dps > 0 ? div(r.eps, d.dps) : NaN;
  r.divTotal = d.dps * d.shares;                     // lakh BDT
  r.fcfCoverDiv = r.divTotal > 0 ? div(r.fcf, r.divTotal) : NaN;
  r.yieldSpread = r.divYield - d.riskFree;
  r.yieldVsFdr = r.divYield - d.fdr;
  r.realYield = r.divYield - d.inflation;
  r.earningsYieldSpread = r.earningsYield - d.riskFree;

  /* --- market --- */
  const range = d.high52 - d.low52;
  r.range52 = range > 0 ? ((d.price - d.low52) / range) * 100 : NaN;
  r.vsHigh = pctChange(d.price, d.high52);
  r.vsMa50 = pctChange(d.price, d.ma50);
  r.vsMa200 = pctChange(d.price, d.ma200);
  r.maCross = div(d.ma50, d.ma200);
  r.relStrength = d.stockReturn12m - d.indexReturn12m;

  r.altmanZ = fin ? NaN : altman(d);
  const f = piotroski(d, r);
  r.fScore = f.score;
  r.fTested = f.tested;
  r.fChecks = f.checks;

  return r;
}

/* ============================================================
   ALTMAN Z: the emerging-market variant

   The original 1968 Z-score was fitted on US manufacturers and
   leans on a market-value term that behaves badly on a thin
   market. Altman's Z'' drops it for book values and adds a +3.25
   constant so scores on emerging markets sit on the same scale
   as a US rating. That is the version here, and its thresholds
   are 5.85 (safe) and 4.35 (grey) rather than the 2.6/1.1 you
   will find quoted for the original.

   It does not apply to banks at all, a bank's balance sheet is
   supposed to look like a distressed manufacturer's, so the
   financial mode drops it and scores capital adequacy instead.
   ============================================================ */

export function altman(d) {
  const ta = d.totalAssets;
  if (!(ta > 0)) return NaN;
  const liabilities = ta - d.equity;
  if (!(liabilities > 0)) return NaN;
  const x1 = (d.currentAssets - d.currentLiabilities) / ta;
  const x2 = d.reserves / ta;                        // retained earnings proxy
  const x3 = d.ebit / ta;
  const x4 = d.equity / liabilities;
  return 3.25 + 6.56 * x1 + 3.26 * x2 + 6.72 * x3 + 1.05 * x4;
}

/* ============================================================
   PIOTROSKI F-SCORE

   Nine yes/no tests of whether the business got better or worse
   over the year. Its value is that none of the nine is about the
   price: it is a question about the company, asked nine times,
   and a cheap stock that passes eight of them is a very
   different proposition from a cheap stock that passes two.

   Tests needing last year's figures are SKIPPED, not failed,
   when those inputs are blank. A skipped test would otherwise
   read as a failure, and the score would punish you for not
   having typed something in.
   ============================================================ */

export function piotroski(d, r) {
  const checks = [];
  const has = (x) => Number.isFinite(x) && x !== 0;
  const avgAssets = r.avgAssets;
  const roaNow = div(d.netIncome, avgAssets);
  const roaPrev = has(d.totalAssetsPrev) ? div(d.netIncomePrev, d.totalAssetsPrev) : NaN;

  const add = (id, pass, testable = true) =>
    checks.push({ id, pass: testable ? Boolean(pass) : null, testable });

  add("profit", d.netIncome > 0);
  add("cfo", d.cfo > 0);
  add("roaUp", roaNow > roaPrev, Number.isFinite(roaPrev));
  add("accrual", d.cfo > d.netIncome);
  add("leverage",
    div(d.totalDebt, d.totalAssets) < div(d.totalDebtPrev, d.totalAssetsPrev),
    has(d.totalDebtPrev) && has(d.totalAssetsPrev));
  add("liquidity",
    div(d.currentAssets, d.currentLiabilities) > div(d.currentAssetsPrev, d.currentLiabilitiesPrev),
    has(d.currentAssetsPrev) && has(d.currentLiabilitiesPrev));
  add("dilution", d.shares <= d.sharesPrev, has(d.sharesPrev));
  add("margin",
    div(d.grossProfit, d.revenue) > div(d.grossProfitPrev, d.revenuePrev),
    has(d.grossProfitPrev) && has(d.revenuePrev));
  add("turnover",
    div(d.revenue, avgAssets) > div(d.revenuePrev, d.totalAssetsPrev),
    has(d.revenuePrev) && has(d.totalAssetsPrev));

  const testable = checks.filter((c) => c.testable);
  return {
    checks,
    tested: testable.length,
    score: testable.filter((c) => c.pass).length,
  };
}

/* ============================================================
   THE METRIC REGISTRY

   `w` is the weight inside its own pillar, not across the page.
   `na` returning true means "this ratio has no meaning here"–
   the metric is dropped and its weight is redistributed across
   the rest of the pillar, rather than scoring zero. A bank with
   no current ratio must not be marked down for it.

   `fmt` is a hint for the display layer: how to print the raw
   number. `hi` says which direction is good, for the arrow
   beside it.
   ============================================================ */

export const METRICS = [
  /* ---------------- VALUATION ---------------- */
  { id: "peRel", pillar: "value", w: 3, fmt: "x", hi: false,
    get: (r) => r.peRel, raw: (r) => r.pe,
    na: (r) => !Number.isFinite(r.peRel),
    anchors: [[0.4, 100], [0.7, 85], [1.0, 60], [1.4, 35], [2.0, 15], [3.0, 0]] },

  { id: "pbRel", pillar: "value", w: 2, fmt: "x", hi: false,
    get: (r) => r.pbRel, raw: (r) => r.pb,
    na: (r) => !Number.isFinite(r.pbRel),
    anchors: [[0.4, 100], [0.7, 85], [1.0, 60], [1.5, 35], [2.5, 12], [4.0, 0]] },

  { id: "evEbitda", pillar: "value", w: 2, fmt: "x", hi: false,
    get: (r) => r.evEbitda,
    na: (r) => r.isFinancial || !Number.isFinite(r.evEbitda) || r.evEbitda < 0,
    anchors: [[3, 100], [5, 85], [8, 60], [12, 32], [18, 10], [25, 0]] },

  { id: "earningsYieldSpread", pillar: "value", w: 3, fmt: "pp", hi: true,
    get: (r) => r.earningsYieldSpread,
    na: (r) => !Number.isFinite(r.earningsYieldSpread),
    anchors: [[-8, 0], [-3, 20], [0, 45], [3, 70], [8, 92], [14, 100]] },

  { id: "fcfYield", pillar: "value", w: 2, fmt: "%", hi: true,
    get: (r) => r.fcfYield,
    na: (r) => !Number.isFinite(r.fcfYield),
    anchors: [[-5, 0], [0, 25], [3, 50], [6, 75], [10, 92], [15, 100]] },

  { id: "peg", pillar: "value", w: 2, fmt: "x", hi: false,
    get: (r) => r.peg,
    na: (r) => !Number.isFinite(r.peg),
    anchors: [[0.4, 100], [0.8, 85], [1.2, 65], [2.0, 35], [3.0, 12], [5.0, 0]] },

  /* Cheap against its own sector and cheap against the market are
     different questions, and on the DSE they come apart often,
     whole sectors get bid up together, so a company can look fair
     next to its peers and expensive next to everything else. This
     is what the index picker at the top of the panel feeds. */
  { id: "peVsMarket", pillar: "value", w: 1, fmt: "x", hi: false,
    get: (r) => r.peVsMarket, raw: (r) => r.pe,
    na: (r) => !Number.isFinite(r.peVsMarket),
    anchors: [[0.5, 100], [0.8, 82], [1.0, 62], [1.5, 35], [2.2, 12], [3.5, 0]] },

  { id: "ps", pillar: "value", w: 1, fmt: "x", hi: false,
    get: (r) => r.ps,
    na: (r) => r.isFinancial || !Number.isFinite(r.ps),
    anchors: [[0.3, 100], [0.8, 78], [1.5, 58], [3, 32], [6, 10], [10, 0]] },

  /* ---------------- QUALITY ---------------- */
  { id: "roe", pillar: "quality", w: 3, fmt: "%", hi: true,
    get: (r) => r.roe,
    na: (r) => !Number.isFinite(r.roe),
    anchors: [[-10, 0], [0, 8], [8, 25], [12, 45], [18, 70], [25, 90], [35, 100]] },

  { id: "roce", pillar: "quality", w: 2, fmt: "%", hi: true,
    get: (r) => r.roce,
    na: (r) => !Number.isFinite(r.roce),
    anchors: [[-5, 0], [0, 8], [6, 20], [10, 45], [15, 70], [22, 90], [30, 100]] },

  { id: "marginRel", pillar: "quality", w: 2, fmt: "x", hi: true,
    get: (r) => r.marginRel, raw: (r) => r.netMargin,
    na: (r) => !Number.isFinite(r.marginRel) || r.netMargin < 0,
    anchors: [[0.3, 10], [0.6, 30], [1.0, 60], [1.4, 80], [2.0, 100]] },

  { id: "roeRel", pillar: "quality", w: 2, fmt: "x", hi: true,
    get: (r) => r.roeRel, raw: (r) => r.roe,
    na: (r) => !Number.isFinite(r.roeRel),
    anchors: [[0.4, 10], [0.7, 32], [1.0, 60], [1.4, 82], [2.0, 100]] },

  { id: "grossMargin", pillar: "quality", w: 1, fmt: "%", hi: true,
    get: (r) => r.grossMargin,
    na: (r) => r.isFinancial || !Number.isFinite(r.grossMargin),
    anchors: [[0, 0], [5, 12], [15, 30], [25, 55], [40, 80], [55, 100]] },

  { id: "cashConversion", pillar: "quality", w: 3, fmt: "x", hi: true,
    get: (r) => r.cashConversion,
    na: (r) => !Number.isFinite(r.cashConversion),
    anchors: [[-0.5, 0], [0, 8], [0.4, 20], [0.7, 45], [1.0, 70], [1.3, 90], [2.0, 100]] },

  { id: "accruals", pillar: "quality", w: 2, fmt: "x", hi: false,
    get: (r) => r.accruals,
    na: (r) => !Number.isFinite(r.accruals),
    anchors: [[-0.05, 100], [0, 85], [0.03, 60], [0.07, 35], [0.12, 10], [0.2, 0]] },

  { id: "assetTurnover", pillar: "quality", w: 1, fmt: "x", hi: true,
    get: (r) => r.assetTurnover,
    na: (r) => !Number.isFinite(r.assetTurnover),
    anchors: [[0.1, 10], [0.4, 35], [0.7, 55], [1.0, 75], [1.5, 95], [2.5, 100]] },

  /* ---------------- GROWTH ---------------- */
  { id: "revGrowth", pillar: "growth", w: 3, fmt: "%", hi: true,
    get: (r) => r.revGrowth,
    na: (r) => !Number.isFinite(r.revGrowth),
    anchors: [[-15, 0], [-5, 18], [0, 32], [8, 55], [15, 75], [25, 92], [40, 100]] },

  { id: "niGrowth", pillar: "growth", w: 3, fmt: "%", hi: true,
    get: (r) => r.niGrowth,
    na: (r) => !Number.isFinite(r.niGrowth),
    anchors: [[-30, 0], [-10, 18], [0, 35], [10, 60], [20, 80], [35, 95], [60, 100]] },

  { id: "epsCagr3y", pillar: "growth", w: 3, fmt: "%", hi: true,
    get: (r) => r.epsCagr3y,
    na: (r) => !Number.isFinite(r.epsCagr3y),
    anchors: [[-15, 0], [-5, 15], [0, 30], [10, 60], [18, 82], [30, 100]] },

  { id: "cfoGrowth", pillar: "growth", w: 2, fmt: "%", hi: true,
    get: (r) => r.cfoGrowth,
    na: (r) => !Number.isFinite(r.cfoGrowth),
    anchors: [[-40, 0], [-15, 20], [0, 38], [10, 62], [25, 85], [50, 100]] },

  { id: "marginTrend", pillar: "growth", w: 2, fmt: "pp", hi: true,
    get: (r) => r.marginTrend,
    na: (r) => !Number.isFinite(r.marginTrend),
    anchors: [[-6, 0], [-4, 12], [-1, 32], [0, 50], [1, 70], [3, 90], [6, 100]] },

  /* ---------------- FINANCIAL HEALTH ----------------
     Everything below is non-financial only, and the financial
     block after it takes over for banks, NBFIs and insurers. */
  { id: "debtEquity", pillar: "health", w: 3, fmt: "x", hi: false,
    get: (r) => r.debtEquity,
    na: (r) => r.isFinancial || !Number.isFinite(r.debtEquity),
    anchors: [[0, 100], [0.3, 85], [0.6, 65], [1.0, 45], [1.8, 20], [3.0, 0]] },

  { id: "netDebtEbitda", pillar: "health", w: 3, fmt: "x", hi: false,
    get: (r) => r.netDebtEbitda,
    na: (r) => r.isFinancial || !Number.isFinite(r.netDebtEbitda),
    anchors: [[-1, 100], [0, 92], [1, 78], [2, 60], [3.5, 35], [5, 12], [7, 0]] },

  { id: "interestCover", pillar: "health", w: 3, fmt: "x", hi: true,
    get: (r) => r.interestCover,
    na: (r) => r.isFinancial || !Number.isFinite(r.interestCover),
    anchors: [[0, 0], [1, 10], [2, 30], [4, 60], [8, 85], [15, 100]] },

  /* Non-monotone on purpose: a current ratio of 5 is not five
     times as healthy as 1, it is cash sitting idle or stock that
     will not move. The anchors rise then fall. */
  { id: "currentRatio", pillar: "health", w: 2, fmt: "x", hi: true,
    get: (r) => r.currentRatio,
    na: (r) => !Number.isFinite(r.currentRatio),
    anchors: [[0.5, 10], [1.0, 35], [1.5, 70], [2.0, 90], [3.0, 85], [5.0, 60]] },

  { id: "quickRatio", pillar: "health", w: 2, fmt: "x", hi: true,
    get: (r) => r.quickRatio,
    na: (r) => !Number.isFinite(r.quickRatio),
    anchors: [[0.3, 5], [0.7, 35], [1.0, 65], [1.5, 88], [2.5, 100]] },

  { id: "altmanZ", pillar: "health", w: 3, fmt: "n", hi: true,
    get: (r) => r.altmanZ,
    na: (r) => !Number.isFinite(r.altmanZ),
    anchors: [[0, 0], [2, 8], [4.35, 25], [5.85, 60], [7.5, 85], [10, 100]] },

  { id: "fScore", pillar: "health", w: 2, fmt: "n", hi: true,
    get: (r) => (r.fTested >= 5 ? (r.fScore / r.fTested) * 9 : NaN),
    raw: (r) => r.fScore,
    na: (r) => r.fTested < 5,
    anchors: [[0, 0], [3, 18], [5, 45], [7, 78], [8, 92], [9, 100]] },

  /* ---------------- FINANCIAL MODE ----------------
     Banks and NBFIs are the largest block on the DSE by market
     value, and a generic screener gets every one of them wrong:
     deposits look like debt, so D/E reads 8×; there is no
     EBITDA; the current ratio is meaningless; Altman marks a
     perfectly sound bank as distressed. These five replace them
     and are the ratios a bank is actually supervised on. */
  { id: "car", pillar: "health", w: 3, fmt: "%", hi: true,
    get: (r, d) => (d.car > 0 ? d.car : NaN),
    na: (r, d) => !r.isFinancial || !(d.car > 0),
    anchors: [[6, 0], [8, 12], [10, 30], [12.5, 60], [15, 85], [18, 100]] },

  { id: "npl", pillar: "health", w: 3, fmt: "%", hi: false,
    get: (r, d) => (d.npl > 0 ? d.npl : NaN),
    na: (r, d) => !r.isFinancial || !(d.npl > 0),
    anchors: [[1, 100], [3, 80], [5, 58], [8, 32], [12, 10], [20, 0]] },

  { id: "provisionCover", pillar: "health", w: 2, fmt: "%", hi: true,
    get: (r, d) => (d.provisionCover > 0 ? d.provisionCover : NaN),
    na: (r, d) => !r.isFinancial || !(d.provisionCover > 0),
    anchors: [[30, 0], [60, 30], [80, 55], [100, 80], [130, 100]] },

  { id: "costIncome", pillar: "health", w: 2, fmt: "%", hi: false,
    get: (r, d) => (d.costIncome > 0 ? d.costIncome : NaN),
    na: (r, d) => !r.isFinancial || !(d.costIncome > 0),
    anchors: [[30, 100], [40, 82], [50, 60], [60, 38], [70, 15], [85, 0]] },

  { id: "adr", pillar: "health", w: 2, fmt: "%", hi: false,
    get: (r, d) => (d.adr > 0 ? d.adr : NaN),
    na: (r, d) => !r.isFinancial || !(d.adr > 0),
    anchors: [[65, 95], [75, 88], [82, 70], [87, 50], [92, 20], [100, 0]] },

  /* ---------------- INCOME ----------------
     The weights here were rebalanced after the pillar was caught
     rewarding companies for barely paying. Cover ratios saturate:
     a token 1% dividend is trivially covered and scored 100 on
     both divCover and fcfCoverDiv, which between them outvoted
     the yield itself, so a 0.95% yield scored 62 and a 2.14%
     yield scored 65, which is nonsense on a pillar whose entire
     question is "is this worth holding for the income".

     Yield now carries the pillar and the cover ratios qualify it.
     The shape that produces is the right one: raising a dividend
     helps while it stays affordable, and stops helping at the
     point it outruns free cash flow. */
  { id: "yieldSpread", pillar: "income", w: 6, fmt: "pp", hi: true,
    get: (r) => r.yieldSpread,
    na: (r) => !Number.isFinite(r.yieldSpread),
    anchors: [[-11, 0], [-6, 18], [-3, 35], [0, 60], [2, 80], [5, 100]] },

  { id: "payout", pillar: "income", w: 2, fmt: "%", hi: true,
    get: (r) => r.payout,
    na: (r) => !Number.isFinite(r.payout),
    anchors: [[0, 20], [20, 55], [40, 85], [60, 90], [80, 65], [100, 30], [130, 0]] },

  { id: "divCover", pillar: "income", w: 2, fmt: "x", hi: true,
    get: (r) => r.divCover,
    na: (r) => !Number.isFinite(r.divCover),
    anchors: [[0.5, 0], [0.8, 5], [1.0, 30], [1.3, 55], [1.8, 80], [2.5, 95], [4, 100]] },

  { id: "fcfCoverDiv", pillar: "income", w: 2, fmt: "x", hi: true,
    get: (r) => r.fcfCoverDiv,
    na: (r) => !Number.isFinite(r.fcfCoverDiv),
    anchors: [[-1, 0], [0, 12], [0.5, 30], [1.0, 60], [1.5, 82], [2.5, 100]] },

  { id: "divYears", pillar: "income", w: 1, fmt: "n", hi: true,
    get: (r, d) => d.yearsPaid,
    na: (r, d) => !Number.isFinite(d.yearsPaid),
    anchors: [[0, 0], [1, 20], [3, 50], [5, 72], [8, 90], [12, 100]] },

  /* ---------------- MOMENTUM & MARKET ---------------- */
  { id: "range52", pillar: "momentum", w: 2, fmt: "%", hi: true,
    get: (r) => r.range52,
    na: (r) => !Number.isFinite(r.range52),
    anchors: [[0, 25], [20, 45], [50, 65], [75, 85], [95, 75], [100, 60]] },

  { id: "vsMa200", pillar: "momentum", w: 3, fmt: "%", hi: true,
    get: (r) => r.vsMa200,
    na: (r) => !Number.isFinite(r.vsMa200),
    anchors: [[-40, 5], [-20, 25], [-5, 50], [5, 75], [20, 90], [50, 70]] },

  { id: "maCross", pillar: "momentum", w: 2, fmt: "x", hi: true,
    get: (r) => r.maCross,
    na: (r) => !Number.isFinite(r.maCross),
    anchors: [[0.85, 10], [0.95, 35], [1.0, 55], [1.05, 80], [1.2, 95]] },

  { id: "relStrength", pillar: "momentum", w: 3, fmt: "pp", hi: true,
    get: (r) => r.relStrength,
    na: (r) => !Number.isFinite(r.relStrength),
    anchors: [[-40, 5], [-20, 25], [0, 55], [15, 80], [40, 100]] },

  { id: "liquidity", pillar: "momentum", w: 3, fmt: "lakh", hi: true,
    get: (r, d) => d.turnover,
    na: (r, d) => !Number.isFinite(d.turnover),
    anchors: [[0, 0], [1, 5], [5, 25], [20, 55], [60, 80], [200, 100]] },

  { id: "freeFloat", pillar: "momentum", w: 2, fmt: "%", hi: true,
    get: (r, d) => d.freeFloat,
    na: (r, d) => !Number.isFinite(d.freeFloat),
    anchors: [[5, 0], [10, 5], [20, 30], [30, 55], [45, 80], [60, 95], [80, 100]] },
];

export const PILLARS = ["value", "quality", "growth", "health", "income", "momentum"];

/* ============================================================
   INVESTOR PRESETS

   The same company is a buy for one person and a pass for
   another, and pretending otherwise is the central dishonesty
   of every "stock rating" ever published. So the weights are
   yours. An income investor who does not care about momentum
   sets it to zero and the verdict moves.
   ============================================================ */

export const WEIGHT_PRESETS = {
  balanced: { value: 20, quality: 20, growth: 15, health: 20, income: 15, momentum: 10 },
  value:    { value: 30, quality: 20, growth: 5,  health: 25, income: 10, momentum: 10 },
  growth:   { value: 10, quality: 20, growth: 35, health: 15, income: 0,  momentum: 20 },
  income:   { value: 15, quality: 15, growth: 5,  health: 25, income: 35, momentum: 5 },
};

/* ============================================================
   SCORING
   ============================================================ */

export function scoreMetrics(d, r) {
  return METRICS.map((m) => {
    const na = m.na ? m.na(r, d) : false;
    const value = na ? NaN : m.get(r, d);
    const score = na ? null : band(value, m.anchors);
    return {
      id: m.id, pillar: m.pillar, w: m.w, fmt: m.fmt, hi: m.hi,
      value,
      raw: m.raw ? m.raw(r, d) : value,
      score: score === null || !Number.isFinite(score) ? null : score,
      grade: grade(score),
      na: na || score === null || !Number.isFinite(score),
    };
  });
}

/** Pillar score = weighted mean of the metrics that apply.
    A pillar with nothing applicable returns null, and the
    composite redistributes its weight rather than scoring it 0. */
export function scorePillars(scored) {
  const out = {};
  for (const p of PILLARS) {
    const live = scored.filter((s) => s.pillar === p && !s.na);
    const wsum = live.reduce((a, s) => a + s.w, 0);
    out[p] = wsum > 0
      ? { score: live.reduce((a, s) => a + s.score * s.w, 0) / wsum, n: live.length, of: scored.filter((s) => s.pillar === p).length }
      : { score: null, n: 0, of: scored.filter((s) => s.pillar === p).length };
  }
  return out;
}

export function composite(pillars, weights) {
  let num = 0;
  let den = 0;
  for (const p of PILLARS) {
    const s = pillars[p]?.score;
    const w = weights[p] ?? 0;
    if (s === null || !Number.isFinite(s) || w <= 0) continue;
    num += s * w;
    den += w;
  }
  return den > 0 ? num / den : null;
}

/* ============================================================
   VETOES AND FLAGS

   A veto is a fact that no amount of cheapness redeems, and it
   overrides the composite outright. There are only three,
   deliberately: negative equity, Z category, and a company
   losing money AND burning cash at the same time. Everything
   else that looks bad is a flag, loud, listed, explained, but
   left for you to weigh.

   The reason for the short list is that vetoes are where a tool
   like this does real damage if it is trigger-happy. Plenty of
   good companies have one terrible ratio.
   ============================================================ */

export function checkFlags(d, r) {
  const flags = [];
  const push = (id, level, vars = {}) => flags.push({ id, level, vars });

  /* --- vetoes --- */
  if (d.category === "Z") push("vetoZ", "veto");
  if (d.equity <= 0) push("vetoEquity", "veto", { equity: d.equity });
  if (r.eps <= 0 && d.cfo <= 0) push("vetoBurn", "veto", { eps: r.eps, cfo: d.cfo });

  /* --- serious --- */
  if (r.eps <= 0 && d.cfo > 0) push("loss", "bad", { eps: r.eps });
  if (Number.isFinite(r.interestCover) && r.interestCover < 1)
    push("cannotCoverInterest", "bad", { cover: r.interestCover });
  if (d.netIncome > 0 && d.cfo < 0) push("profitNoCash", "bad", { cfo: d.cfo });
  if (Number.isFinite(r.netDebtEbitda) && r.netDebtEbitda > 5)
    push("debtHeavy", "bad", { x: r.netDebtEbitda });
  if (Number.isFinite(r.altmanZ) && r.altmanZ < 4.35)
    push("altmanDistress", "bad", { z: r.altmanZ });
  if (r.isFinancial && d.npl > 8) push("nplHigh", "bad", { npl: d.npl });

  /* --- worth knowing --- */
  if (Number.isFinite(r.payout) && r.payout > 100) push("payoutOver", "warn", { payout: r.payout });
  if (Number.isFinite(r.accruals) && r.accruals > 0.1) push("accrualGap", "warn", { a: r.accruals });
  if (d.freeFloat > 0 && d.freeFloat < 15) push("thinFloat", "warn", { f: d.freeFloat });
  if (d.turnover > 0 && d.turnover < 5) push("illiquid", "warn", { t: d.turnover });
  if (Number.isFinite(r.pb) && r.pb > 3 && Number.isFinite(r.roe) && r.roe < d.riskFree)
    push("payingForNothing", "warn", { pb: r.pb, roe: r.roe });
  if (Number.isFinite(r.vsMa200) && r.vsMa200 < -30) push("fallingKnife", "warn", { x: r.vsMa200 });
  if (d.yearsPaid === 0) push("noDividend", "warn");
  if (d.category === "B") push("categoryB", "warn");
  if (d.category === "N") push("categoryN", "info");
  if (Number.isFinite(r.fcfCoverDiv) && r.fcfCoverDiv < 1 && d.dps > 0)
    push("dividendFromDebt", "warn", { x: r.fcfCoverDiv });

  return flags;
}

/* ============================================================
   COMBINED SIGNALS

   The patterns worth naming are the ones no single ratio shows.
   A low P/E on its own is not information; a low P/E next to
   falling earnings and rising debt is the whole story, and it
   has a name. Each pattern below fires only when every one of
   its conditions holds.
   ============================================================ */

export function signals(d, r, pillars) {
  const out = [];
  const fire = (id, tone) => out.push({ id, tone });
  const fin = Number.isFinite;

  const cheapPE = fin(r.peRel) && r.peRel < 0.8;
  const shrinking = fin(r.niGrowth) && r.niGrowth < -5;
  const levered = fin(r.netDebtEbitda) && r.netDebtEbitda > 3;

  if (cheapPE && shrinking && levered) fire("cheapForReason", "bad");

  if (fin(r.roe) && r.roe > 18 && fin(r.debtEquity) && r.debtEquity < 0.6
      && fin(r.peRel) && r.peRel <= 1.05) fire("qualityFairPrice", "good");

  if (fin(r.pb) && r.pb < 0.8 && fin(r.roe) && r.roe < d.riskFree && d.dps === 0)
    fire("valueTrap", "bad");

  if (fin(r.payout) && r.payout > 90 && fin(r.divCover) && r.divCover < 1.2)
    fire("dividendAtRisk", "bad");

  if (fin(r.peg) && r.peg > 2.5 && fin(r.peRel) && r.peRel > 1.4)
    fire("growthPricedIn", "warn");

  if (fin(r.altmanZ) && r.altmanZ < 4.35 && fin(r.interestCover) && r.interestCover < 2)
    fire("balanceSheetStress", "bad");

  if (fin(r.cashConversion) && r.cashConversion < 0.6 && fin(r.accruals) && r.accruals > 0.06)
    fire("earningsQualityGap", "bad");

  if (d.freeFloat > 0 && d.freeFloat < 20 && d.turnover > 0 && d.turnover < 15)
    fire("thinlyTraded", "warn");

  if (fin(r.fScore) && r.fTested >= 7 && r.fScore >= 7 && fin(r.pb) && r.pb < 1.2)
    fire("turnaround", "good");

  if (fin(r.earningsYieldSpread) && r.earningsYieldSpread > 0
      && fin(r.yieldSpread) && r.yieldSpread > 0) fire("beatsSafe", "good");

  if (fin(r.divYield) && r.divYield < d.fdr && fin(r.earningsYield) && r.earningsYield < d.riskFree)
    fire("losesToSafe", "warn");

  if (fin(r.range52) && r.range52 > 80 && pillars.value?.score !== null
      && pillars.value?.score < 35) fire("momentumVsFundamentals", "warn");

  if (fin(r.vsMa200) && r.vsMa200 < -25 && fin(r.fScore) && r.fTested >= 7 && r.fScore <= 3)
    fire("fallingWithReason", "bad");

  if (fin(r.assetTurnover) && r.assetTurnover < 0.5 && fin(r.netMargin) && r.netMargin < 6
      && d.capex > d.cfo * 0.6) fire("capitalHungry", "warn");

  if (fin(r.roe) && r.roe > 15 && fin(r.dupontLeverage) && r.dupontLeverage > 3)
    fire("borrowedReturn", "warn");

  return out;
}

/* ============================================================
   FAIR VALUE, TRIANGULATED

   Four anchors, none of them authoritative, deliberately shown
   as a range rather than a single number. A DCF on this page
   would be false precision: that lives in the portfolio, where
   there is room to build the WACC properly. What is useful here
   is the spread: when all four land above the price you have
   something worth a second look, and when they scatter across a
   4× range the honest answer is "this cannot be valued from
   these inputs".
   ============================================================ */

export function fairValue(d, r) {
  const anchors = [];
  const req = Math.max(d.riskFree + 3, 8) / 100;      // required return, roughly

  if (r.eps > 0 && d.sectorPE > 0)
    anchors.push({ id: "sectorPe", value: r.eps * d.sectorPE });

  if (r.bvps > 0 && d.sectorPB > 0)
    anchors.push({ id: "sectorPb", value: r.bvps * d.sectorPB });

  /* Graham's number: sqrt(22.5 × EPS × BVPS), which is just
     "P/E × P/B should not exceed 22.5" rearranged. Old, blunt,
     and still a useful floor-ish reference for a defensive buyer. */
  if (r.eps > 0 && r.bvps > 0)
    anchors.push({ id: "graham", value: Math.sqrt(22.5 * r.eps * r.bvps) });

  /* Gordon growth on the dividend, only where the company pays
     one and the growth assumption stays below the discount rate.
     Growth is capped well under `req`– a payer growing at the
     discount rate produces an infinite value, which is a maths
     artefact, not a valuation. */
  if (d.dps > 0) {
    const g = Math.min(Math.max((r.epsCagr3y || 0) / 100, 0), req - 0.02);
    if (req - g > 0.01) anchors.push({ id: "ddm", value: (d.dps * (1 + g)) / (req - g) });
  }

  /* Earnings power: capitalise this year's EPS at the required
     return and assume no growth at all. The most pessimistic of
     the four, and the one that asks "what if nothing improves". */
  if (r.eps > 0) anchors.push({ id: "earningsPower", value: r.eps / req });

  const values = anchors.map((a) => a.value).filter((v) => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (values.length === 0) {
    return { anchors, low: NaN, mid: NaN, high: NaN, marginOfSafety: NaN, spread: NaN };
  }
  const mid = values.length % 2
    ? values[(values.length - 1) / 2]
    : (values[values.length / 2 - 1] + values[values.length / 2]) / 2;

  return {
    anchors,
    low: values[0],
    mid,
    high: values[values.length - 1],
    marginOfSafety: ((mid - d.price) / mid) * 100,
    spread: values[values.length - 1] / values[0],
  };
}

/* ============================================================
   SHARIAH SCREEN

   The DSES exists and a large number of Bangladeshi investors
   will only buy from it, so a tool that ignores the question is
   ignoring them. These are the AAOIFI-style ratio screens as
   commonly applied; the business-activity screen is a judgement
   nobody's arithmetic can make, so it is stated as a question
   rather than answered.
   ============================================================ */

export function shariahScreen(d, r) {
  const tests = [];
  const t = (id, value, limit, pass) => tests.push({ id, value, limit, pass });

  const debtRatio = div(d.totalDebt, r.mcap || d.totalAssets) * 100;
  const cashRatio = div(d.cash, r.mcap || d.totalAssets) * 100;
  const income = d.nonCompliantIncome;

  t("debt", debtRatio, 33, debtRatio < 33);
  t("cash", cashRatio, 33, cashRatio < 33);
  t("income", income, 5, income < 5);

  return {
    tests,
    pass: tests.every((x) => x.pass),
    tested: tests.length,
  };
}

/* ============================================================
   THE VERDICT
   ============================================================ */

export const BANDS = [
  { id: "buy",        min: 75 },
  { id: "accumulate", min: 62 },
  { id: "hold",       min: 48 },
  { id: "trim",       min: 35 },
  { id: "avoid",      min: -Infinity },
];

export const bandFor = (score) =>
  score === null || !Number.isFinite(score)
    ? BANDS[BANDS.length - 1]
    : BANDS.find((b) => score >= b.min);

/** The score needed to reach the next band up, and the one
    below which it drops, so the page can say how much room
    there is either side rather than presenting a verdict as
    though it were solid. */
export function bandEdges(score) {
  const i = BANDS.findIndex((b) => score >= b.min);
  return {
    up: i > 0 ? BANDS[i - 1].min : null,
    down: BANDS[i].min === -Infinity ? null : BANDS[i].min,
  };
}

/* ============================================================
   WHAT'S DRAGGING IT DOWN

   For each metric: how many points of the final composite are
   being left on the table by it. That is its weight in the
   composite multiplied by the distance from 100. Sorted, it is
   the shortest honest answer to "what would have to change".
   ============================================================ */

export function drags(scored, pillars, weights, limit = 6) {
  const wsum = PILLARS.reduce(
    (a, p) => a + (pillars[p]?.score !== null && weights[p] > 0 ? weights[p] : 0), 0);
  if (wsum === 0) return [];

  const out = [];
  for (const p of PILLARS) {
    if (pillars[p]?.score === null || !(weights[p] > 0)) continue;
    const live = scored.filter((s) => s.pillar === p && !s.na);
    const inner = live.reduce((a, s) => a + s.w, 0);
    if (inner === 0) continue;
    for (const s of live) {
      /* share of the final composite this one metric controls */
      const share = (weights[p] / wsum) * (s.w / inner);
      out.push({ id: s.id, pillar: p, score: s.score, cost: share * (100 - s.score), share });
    }
  }
  return out.sort((a, b) => b.cost - a.cost).slice(0, limit);
}

/* ============================================================
   THE WHOLE THING
   ============================================================ */

/* ============================================================
   THE PRICE CEILING

   A plain weighted mean cannot answer the question this page
   asks. Valuation is one pillar of six, so on balanced weights
   it controls about a fifth of the score, and tripling the
   share price of the default company moved the total from 69 to
   62 and left the verdict reading "worth accumulating". The
   valuation pillar had collapsed from 46 to 15, exactly as it
   should; it simply could not drag a mean far enough.

   That is fatal for a tool whose entire question is whether to
   buy AT THIS PRICE. Price is the one variable the reader
   controls, and a tool insensitive to it is worse than no tool.

   So the verdict is capped by the valuation pillar. Not a veto,
   the score is still shown and still honest, but a good
   business bought badly is a bad investment, and no quality
   score should be able to argue otherwise. The cap is stated on
   the page whenever it bites, so it is never a silent
   correction.
   ============================================================ */

const CAP_HOLD = 30;
const CAP_ACCUMULATE = 42;

export function priceCap(pillars) {
  const v = pillars.value?.score;
  if (v === null || !Number.isFinite(v)) return null;
  if (v < CAP_HOLD) return "hold";
  if (v < CAP_ACCUMULATE) return "accumulate";
  return null;
}

const bandRank = (id) => BANDS.findIndex((b) => b.id === id);

export function analyse(input, weights = WEIGHT_PRESETS.balanced) {
  const d = { ...DEFAULTS, ...input };
  const r = ratios(d);
  const scored = scoreMetrics(d, r);
  const pillars = scorePillars(scored);
  const score = composite(pillars, weights);
  const flags = checkFlags(d, r);
  const veto = flags.find((f) => f.level === "veto") ?? null;

  const earned = bandFor(score);
  const cap = veto ? null : priceCap(pillars);
  const capped = cap !== null && bandRank(cap) > bandRank(earned.id);
  const verdict = veto
    ? BANDS[BANDS.length - 1]
    : capped ? BANDS[bandRank(cap)] : earned;

  return {
    d, r, scored, pillars,
    score,
    verdict,
    earned,
    capped,
    vetoed: Boolean(veto),
    veto,
    edges: score === null ? { up: null, down: null } : bandEdges(score),
    flags,
    signals: signals(d, r, pillars),
    fair: fairValue(d, r),
    shariah: shariahScreen(d, r),
    drags: drags(scored, pillars, weights),
  };
}

/* ============================================================
   PRESETS, seven archetypes, not seven companies.

   Each is internally consistent: assets = liabilities + equity,
   paid-up capital = shares × 10, and the cash flow is plausible
   against the profit. They exist to show what each verdict looks
   like, including the ones the tool should refuse.
   ============================================================ */

export const PRESETS = [
  {
    id: "pharma",
    input: {},                                        // DEFAULTS is this one
  },
  {
    id: "textile",
    input: {
      sector: "textile", category: "A",
      price: 32, shares: 900, high52: 47, low52: 29, ma50: 34, ma200: 38,
      turnover: 22, freeFloat: 31, stockReturn12m: -24, indexReturn12m: 7,
      revenue: 68000, grossProfit: 11900, ebit: 8200, depreciation: 3900,
      interestExpense: 3300, netIncome: 3800,
      totalAssets: 96000, currentAssets: 41000, inventory: 19500, cash: 2100,
      currentLiabilities: 31000, totalDebt: 44000, equity: 36000, reserves: 27000,
      cfo: 7600, capex: 6800,
      dps: 1.0, yearsPaid: 4,
      revenuePrev: 71000, grossProfitPrev: 13100, netIncomePrev: 4600,
      totalAssetsPrev: 94000, currentAssetsPrev: 40000, currentLiabilitiesPrev: 29000,
      totalDebtPrev: 42000, cfoPrev: 8900, sharesPrev: 900, netIncome3y: 5900,
      sectorPE: 11, sectorPB: 0.9, sectorROE: 9, sectorMargin: 5,
    },
  },
  {
    id: "bank",
    input: {
      sector: "bank", category: "A",
      price: 27, shares: 6500, high52: 31, low52: 22, ma50: 26.4, ma200: 25.1,
      turnover: 140, freeFloat: 44, stockReturn12m: 9, indexReturn12m: 7,
      revenue: 62000, grossProfit: 0, ebit: 26000, depreciation: 1800,
      interestExpense: 34000, netIncome: 18500,
      totalAssets: 1450000, currentAssets: 0, inventory: 0, cash: 96000,
      currentLiabilities: 0, totalDebt: 95000, equity: 128000, reserves: 63000,
      cfo: 21000, capex: 2400,
      dps: 1.8, yearsPaid: 15,
      revenuePrev: 56000, grossProfitPrev: 0, netIncomePrev: 16400,
      totalAssetsPrev: 1330000, currentAssetsPrev: 0, currentLiabilitiesPrev: 0,
      totalDebtPrev: 92000, cfoPrev: 19000, sharesPrev: 6500, netIncome3y: 13900,
      car: 14.2, npl: 4.1, provisionCover: 92, costIncome: 42, adr: 82,
      sectorPE: 8, sectorPB: 0.9, sectorROE: 13, sectorMargin: 22,
      benchmark: "ds30", marketPE: 11.5,
    },
  },
  {
    id: "cement",
    input: {
      sector: "cement", category: "B",
      price: 46, shares: 1500, high52: 79, low52: 43, ma50: 49, ma200: 58,
      turnover: 18, freeFloat: 26, stockReturn12m: -38, indexReturn12m: 7,
      revenue: 74000, grossProfit: 8900, ebit: 2400, depreciation: 6100,
      interestExpense: 6900, netIncome: -3900,
      totalAssets: 118000, currentAssets: 29000, inventory: 12000, cash: 1100,
      currentLiabilities: 41000, totalDebt: 62000, equity: 31000, reserves: 16000,
      cfo: 2900, capex: 5200,
      dps: 0, yearsPaid: 0,
      revenuePrev: 81000, grossProfitPrev: 11300, netIncomePrev: -1200,
      totalAssetsPrev: 121000, currentAssetsPrev: 31000, currentLiabilitiesPrev: 38000,
      totalDebtPrev: 58000, cfoPrev: 4100, sharesPrev: 1500, netIncome3y: 2900,
      sectorPE: 15, sectorPB: 1.8, sectorROE: 10, sectorMargin: 5,
    },
  },
  {
    id: "power",
    input: {
      sector: "fuel", category: "A",
      price: 58, shares: 2200, high52: 66, low52: 51, ma50: 57, ma200: 59,
      turnover: 45, freeFloat: 33, stockReturn12m: 4, indexReturn12m: 7,
      revenue: 118000, grossProfit: 27000, ebit: 21500, depreciation: 8400,
      interestExpense: 2900, netIncome: 14300,
      totalAssets: 176000, currentAssets: 61000, inventory: 8000, cash: 24000,
      currentLiabilities: 34000, totalDebt: 33000, equity: 96000, reserves: 74000,
      cfo: 22800, capex: 9600,
      dps: 5.0, yearsPaid: 14,
      revenuePrev: 112000, grossProfitPrev: 25300, netIncomePrev: 13600,
      totalAssetsPrev: 169000, currentAssetsPrev: 57000, currentLiabilitiesPrev: 33000,
      totalDebtPrev: 36000, cfoPrev: 21500, sharesPrev: 2200, netIncome3y: 11900,
      sectorPE: 11, sectorPB: 1.5, sectorROE: 14, sectorMargin: 11,
    },
  },
  {
    id: "it",
    input: {
      sector: "it", category: "A",
      price: 96, shares: 320, high52: 112, low52: 61, ma50: 92, ma200: 81,
      turnover: 6, freeFloat: 18, stockReturn12m: 41, indexReturn12m: 7,
      revenue: 9400, grossProfit: 4900, ebit: 2600, depreciation: 480,
      interestExpense: 190, netIncome: 1850,
      totalAssets: 13400, currentAssets: 8600, inventory: 300, cash: 3100,
      currentLiabilities: 3200, totalDebt: 1700, equity: 8900, reserves: 5700,
      cfo: 2200, capex: 900,
      dps: 1.5, yearsPaid: 5,
      revenuePrev: 7100, grossProfitPrev: 3600, netIncomePrev: 1290,
      totalAssetsPrev: 11200, currentAssetsPrev: 6900, currentLiabilitiesPrev: 2900,
      totalDebtPrev: 1900, cfoPrev: 1700, sharesPrev: 320, netIncome3y: 820,
      sectorPE: 18, sectorPB: 2.8, sectorROE: 16, sectorMargin: 17,
    },
  },
  {
    id: "shell",
    input: {
      sector: "other", category: "Z",
      price: 11, shares: 780, high52: 19, low52: 9, ma50: 12, ma200: 15,
      turnover: 9, freeFloat: 41, stockReturn12m: -31, indexReturn12m: 7,
      revenue: 2100, grossProfit: 120, ebit: -640, depreciation: 520,
      interestExpense: 1150, netIncome: -1900,
      totalAssets: 9800, currentAssets: 3100, inventory: 1900, cash: 40,
      currentLiabilities: 8700, totalDebt: 9200, equity: -2400, reserves: -10200,
      cfo: -480, capex: 60,
      dps: 0, yearsPaid: 0,
      revenuePrev: 3400, grossProfitPrev: 410, netIncomePrev: -1100,
      totalAssetsPrev: 10900, currentAssetsPrev: 3600, currentLiabilitiesPrev: 8100,
      totalDebtPrev: 8800, cfoPrev: -260, sharesPrev: 780, netIncome3y: 210,
      sectorPE: 15, sectorPB: 1.6, sectorROE: 12, sectorMargin: 8,
    },
  },
];

export const presetInput = (id) => {
  const p = PRESETS.find((x) => x.id === id);
  return p ? { ...DEFAULTS, ...p.input } : { ...DEFAULTS };
};
