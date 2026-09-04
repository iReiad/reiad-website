/* dsex.model.js: the statistics engine. No DOM, numbers in and
   numbers out, so every function is checkable against a
   hand-computable case rather than against itself.

   THE SERIES SHIPPED WITH THIS PAGE IS SIMULATED and is nowhere
   presented as the Dhaka Stock Exchange's own history:
   publishing invented numbers under a real index's name would be
   inventing that index's record. What is real is the METHOD, and
   the page takes a CSV of actual prices and runs the identical
   analysis over it. The simulation is SEEDED, so every visitor
   and every test run sees the same numbers. */

export const TRADING_DAYS = 252;

/* ------------------------------------------------------------
   Small helpers, all total functions on arrays of numbers
   ------------------------------------------------------------ */
export const mean = (xs) =>
  xs.length ? xs.reduce((s, x) => s + x, 0) / xs.length : NaN;

export function stdev(xs, sample = true) {
  const n = xs.length;
  if (n < (sample ? 2 : 1)) return NaN;
  const m = mean(xs);
  const ss = xs.reduce((s, x) => s + (x - m) ** 2, 0);
  return Math.sqrt(ss / (n - (sample ? 1 : 0)));
}

/** Linear-interpolated quantile on an ALREADY SORTED array. */
export function quantileSorted(sorted, p) {
  const n = sorted.length;
  if (!n) return NaN;
  if (p <= 0) return sorted[0];
  if (p >= 1) return sorted[n - 1];
  const i = (n - 1) * p;
  const lo = Math.floor(i);
  const hi = Math.ceil(i);
  return lo === hi ? sorted[lo] : sorted[lo] + (i - lo) * (sorted[hi] - sorted[lo]);
}

export const quantile = (xs, p) => quantileSorted([...xs].sort((a, b) => a - b), p);

/** Fisher-Pearson skewness (the moment estimator, not adjusted). */
export function skewness(xs) {
  const n = xs.length;
  if (n < 3) return NaN;
  const m = mean(xs);
  const s = stdev(xs, false);
  if (!s) return NaN;
  return xs.reduce((acc, x) => acc + ((x - m) / s) ** 3, 0) / n;
}

/** EXCESS kurtosis, 0 for a normal distribution, positive for fat tails. */
export function excessKurtosis(xs) {
  const n = xs.length;
  if (n < 4) return NaN;
  const m = mean(xs);
  const s = stdev(xs, false);
  if (!s) return NaN;
  return xs.reduce((acc, x) => acc + ((x - m) / s) ** 4, 0) / n - 3;
}

/** Autocorrelation at a lag. Used to show volatility clustering. */
export function autocorr(xs, lag = 1) {
  const n = xs.length;
  if (n <= lag + 1) return NaN;
  const m = mean(xs);
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    den += (xs[i] - m) ** 2;
    if (i >= lag) num += (xs[i] - m) * (xs[i - lag] - m);
  }
  return den ? num / den : NaN;
}

/* ------------------------------------------------------------
   Returns
   ------------------------------------------------------------ */

/** Simple returns: p_t / p_{t-1} − 1. One shorter than prices. */
export const simpleReturns = (prices) =>
  prices.slice(1).map((p, i) => (prices[i] ? p / prices[i] - 1 : NaN));

/** Log returns. Additive over time, which is why volatility uses them. */
export const logReturns = (prices) =>
  prices.slice(1).map((p, i) => (prices[i] > 0 && p > 0 ? Math.log(p / prices[i]) : NaN));

/** Annualised volatility from periodic returns: sd × √periods. */
export const annualisedVol = (rets, ppy = TRADING_DAYS) => stdev(rets) * Math.sqrt(ppy);

/**
 * Rolling annualised volatility.
 * Index i of the result aligns with returns[i], and the first
 * (window − 1) entries are NaN rather than a shorter window,
 * silently computing a 3-day "30-day vol" at the start of a series
 * is how misleading charts get made.
 */
export function rollingVol(rets, window = 60, ppy = TRADING_DAYS) {
  const out = new Array(rets.length).fill(NaN);
  if (window < 2) return out;
  for (let i = window - 1; i < rets.length; i++) {
    out[i] = stdev(rets.slice(i - window + 1, i + 1)) * Math.sqrt(ppy);
  }
  return out;
}

/** Compound annual growth rate between the ends of a price series. */
export function cagr(prices, years) {
  if (prices.length < 2 || !(years > 0)) return NaN;
  const first = prices[0];
  const last = prices[prices.length - 1];
  if (!(first > 0) || !(last > 0)) return NaN;
  return (last / first) ** (1 / years) - 1;
}

/* ------------------------------------------------------------
   Drawdowns

   A drawdown is how far below the previous peak you are. It is
   the number that actually describes the experience of holding
   something, volatility is a statistic, a drawdown is a year of
   your life.
   ------------------------------------------------------------ */

/** Drawdown at each point: price / running peak − 1, so ≤ 0. */
export function drawdownSeries(prices) {
  let peak = -Infinity;
  return prices.map((p) => {
    if (p > peak) peak = p;
    return peak > 0 ? p / peak - 1 : 0;
  });
}

export const maxDrawdown = (prices) => Math.min(...drawdownSeries(prices), 0);

/**
 * Distinct drawdown episodes, deepest first.
 *
 * An episode runs from the peak, through the trough, to the day the
 * index first regains that peak. An episode still underwater at the
 * end of the data is returned with recovered:false, reporting it as
 * though it had ended would understate exactly the risk this whole
 * page is about.
 */
export function drawdownEpisodes(prices, dates, top = 5) {
  const episodes = [];
  let peak = prices[0];
  let peakIndex = 0;
  let trough = prices[0];
  let troughIndex = 0;
  let inDrawdown = false;

  for (let i = 1; i < prices.length; i++) {
    const p = prices[i];
    if (p >= peak) {
      if (inDrawdown) {
        episodes.push({
          peakIndex, troughIndex, recoveryIndex: i,
          peak, trough,
          depth: trough / peak - 1,
          recovered: true,
        });
        inDrawdown = false;
      }
      peak = p;
      peakIndex = i;
      trough = p;
      troughIndex = i;
    } else {
      inDrawdown = true;
      if (p < trough) { trough = p; troughIndex = i; }
    }
  }
  if (inDrawdown) {
    episodes.push({
      peakIndex, troughIndex, recoveryIndex: null,
      peak, trough,
      depth: trough / peak - 1,
      recovered: false,
    });
  }

  return episodes
    .sort((a, b) => a.depth - b.depth)
    .slice(0, top)
    .map((e) => ({
      ...e,
      peakDate: dates?.[e.peakIndex] ?? null,
      troughDate: dates?.[e.troughIndex] ?? null,
      recoveryDate: e.recoveryIndex === null ? null : dates?.[e.recoveryIndex] ?? null,
      declineDays: e.troughIndex - e.peakIndex,
      recoveryDays: e.recoveryIndex === null ? null : e.recoveryIndex - e.troughIndex,
      totalDays: (e.recoveryIndex ?? prices.length - 1) - e.peakIndex,
    }));
}

/* Holding periods: for a horizon of k trading days, every
   OVERLAPPING window of that length. Overlapping deliberately,
   because the question is "if I had started on any given day".
   They are not independent samples and this is not a
   significance test. */
export function holdingPeriod(prices, days) {
  if (days < 1 || prices.length <= days) {
    return { days, count: 0, positive: NaN, best: NaN, worst: NaN,
      median: NaN, mean: NaN, p05: NaN, p95: NaN, returns: [] };
  }
  const rets = [];
  for (let i = 0; i + days < prices.length; i++) {
    const a = prices[i];
    const b = prices[i + days];
    if (a > 0) rets.push(b / a - 1);
  }
  const sorted = [...rets].sort((x, y) => x - y);
  return {
    days,
    count: rets.length,
    positive: rets.filter((r) => r > 0).length / rets.length,
    best: sorted[sorted.length - 1],
    worst: sorted[0],
    median: quantileSorted(sorted, 0.5),
    mean: mean(rets),
    p05: quantileSorted(sorted, 0.05),
    p95: quantileSorted(sorted, 0.95),
    returns: rets,
  };
}

/** The same, swept across a ladder of horizons: the money chart. */
export const holdingPeriodCurve = (prices, horizons) =>
  horizons.map((h) => holdingPeriod(prices, h.days)).map((s, i) => ({
    ...s, label: horizons[i].label,
  }));

export const HORIZONS = [
  { label: "1 day", days: 1 },
  { label: "1 week", days: 5 },
  { label: "1 month", days: 21 },
  { label: "3 months", days: 63 },
  { label: "6 months", days: 126 },
  { label: "1 year", days: 252 },
  { label: "2 years", days: 504 },
  { label: "3 years", days: 756 },
  { label: "5 years", days: 1260 },
];

/* ------------------------------------------------------------
   Tail risk
   ------------------------------------------------------------ */

/** Historical VaR: the loss exceeded (1−conf) of the time. Returned
    as a negative number, because it is a loss. */
export const historicalVar = (rets, conf = 0.95) => quantile(rets, 1 - conf);

/** Expected shortfall: the average loss GIVEN you are past the VaR.
    The number that matters, because VaR says nothing about how bad
    the bad days are once you are in them. */
export function expectedShortfall(rets, conf = 0.95) {
  const cutoff = historicalVar(rets, conf);
  const tail = rets.filter((r) => r <= cutoff);
  return tail.length ? mean(tail) : NaN;
}

/* ------------------------------------------------------------
   Distribution, and how far it is from normal
   ------------------------------------------------------------ */
export function histogram(rets, bins = 41) {
  const lo = Math.min(...rets);
  const hi = Math.max(...rets);
  const span = hi - lo || 1;
  const width = span / bins;
  const counts = new Array(bins).fill(0);
  rets.forEach((r) => {
    const i = Math.min(bins - 1, Math.max(0, Math.floor((r - lo) / width)));
    counts[i]++;
  });
  const m = mean(rets);
  const s = stdev(rets);
  return counts.map((count, i) => {
    const from = lo + i * width;
    const to = from + width;
    const mid = (from + to) / 2;
    // the normal curve with the same mean and sd, scaled to counts
    const density = s
      ? (1 / (s * Math.sqrt(2 * Math.PI))) * Math.exp(-((mid - m) ** 2) / (2 * s * s))
      : 0;
    return { from, to, mid, count, normal: density * width * rets.length };
  });
}

/** How many days moved more than n standard deviations, against how
    many a normal distribution would have produced. This is the single
    clearest way to show fat tails to someone who isn't a statistician. */
export function tailCounts(rets, sigmas = [3, 4, 5]) {
  const m = mean(rets);
  const s = stdev(rets);
  // normal two-tailed probability, via an erf approximation
  const erf = (x) => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x));
    const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t
      - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y;
  };
  return sigmas.map((k) => {
    const actual = rets.filter((r) => Math.abs(r - m) > k * s).length;
    const pTwoTail = 2 * (1 - 0.5 * (1 + erf((k) / Math.SQRT2)));
    return { sigma: k, actual, expected: pTwoTail * rets.length };
  });
}

/* ------------------------------------------------------------
   Calendar years
   ------------------------------------------------------------ */
export function calendarYears(dates, prices) {
  const byYear = new Map();
  dates.forEach((d, i) => {
    const y = new Date(d).getUTCFullYear();
    if (!byYear.has(y)) byYear.set(y, { first: i, last: i });
    else byYear.get(y).last = i;
  });
  return [...byYear.entries()].map(([year, { first, last }]) => {
    // measure from the last close of the previous year where possible
    const openIndex = first > 0 ? first - 1 : first;
    const from = prices[openIndex];
    const to = prices[last];
    const slice = prices.slice(openIndex, last + 1);
    return {
      year,
      return: from > 0 ? to / from - 1 : NaN,
      vol: annualisedVol(logReturns(slice)),
      maxDrawdown: maxDrawdown(slice),
      days: last - first + 1,
    };
  });
}

/* ------------------------------------------------------------
   The whole analysis, in one call
   ------------------------------------------------------------ */
export function analyse(series, { volWindow = 60 } = {}) {
  const { dates, prices } = series;
  const rets = logReturns(prices);
  const simple = simpleReturns(prices);
  const dd = drawdownSeries(prices);
  const years = (new Date(dates[dates.length - 1]) - new Date(dates[0]))
    / (365.25 * 24 * 3600 * 1000);

  return {
    dates, prices,
    returns: rets,
    simpleReturns: simple,
    rollingVol: rollingVol(rets, volWindow),
    volWindow,
    drawdown: dd,
    episodes: drawdownEpisodes(prices, dates, 5),
    horizons: holdingPeriodCurve(prices, HORIZONS),
    histogram: histogram(simple),
    tails: tailCounts(simple),
    calendar: calendarYears(dates, prices),
    stats: {
      years,
      first: prices[0],
      last: prices[prices.length - 1],
      totalReturn: prices[0] > 0 ? prices[prices.length - 1] / prices[0] - 1 : NaN,
      cagr: cagr(prices, years),
      vol: annualisedVol(rets),
      maxDrawdown: Math.min(...dd, 0),
      bestDay: Math.max(...simple),
      worstDay: Math.min(...simple),
      skew: skewness(simple),
      kurtosis: excessKurtosis(simple),
      var95: historicalVar(simple, 0.95),
      es95: expectedShortfall(simple, 0.95),
      var99: historicalVar(simple, 0.99),
      es99: expectedShortfall(simple, 0.99),
      // volatility clustering: |r| is autocorrelated even when r is not
      acReturns: autocorr(simple, 1),
      acAbsReturns: autocorr(simple.map(Math.abs), 1),
      positiveDays: simple.filter((r) => r > 0).length / simple.length,
      observations: prices.length,
    },
  };
}

/* The simulated series. DETERMINISTIC, so every visitor and
   every test sees the same numbers. Built to have the three
   properties this analysis needs: volatility clustering
   (GARCH(1,1)), fat tails (a jump component) and long drawdowns.
   Calibrated to be PLAUSIBLE for a frontier equity index, never
   to reproduce a particular one. */

/** mulberry32, small, fast, and identical everywhere. */
export function rng(seed) {
  let a = seed >>> 0;
  return function next() {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Box–Muller, drawing one standard normal per call. */
function normal(next) {
  let u = 0;
  let v = 0;
  while (u === 0) u = next();
  while (v === 0) v = next();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export const SIM = {
  name: "Simulated frontier equity index",
  short: "SIM-IDX",
  note: "A simulated series with DSEX-like statistical behaviour, volatility clustering, fat tails and multi-year drawdowns. It is NOT the Dhaka Stock Exchange's index history and is not presented as such. Load a CSV of real prices to run the same analysis on actual data.",
  seed: 424242,
  startDate: "2011-01-02",
  startLevel: 4200,
  days: 3600,
};

export function simulate(opts = {}) {
  const cfg = { ...SIM, ...opts };
  const next = rng(cfg.seed);

  // GARCH(1,1) on daily log returns
  const omega = 0.0000042;
  const alpha = 0.10;
  const beta = 0.87;
  let variance = omega / (1 - alpha - beta);

  /* A slow-moving drift, so the series has genuine bull and bear
     phases rather than one uniform grind.

     `mu` is the LOG drift, and the −variance/2 correction below
     makes that true: without it, exponentiating a mean-zero shock
     adds half the variance back as drift, and the first calibration
     of this series lost 6.9% a year as a result, which quietly
     inverted the entire holding-period lesson, since holding a
     falling asset for longer is worse, not better. */
  const phase = (i) => {
    const t = i / cfg.days;
    return 0.00064                                          // ≈ 17%/yr before drag
         + 0.00042 * Math.sin(2 * Math.PI * (t * 2.3 + 0.15))
         - (t > 0.20 && t < 0.33 ? 0.0011 : 0);             // the slow-burn bear
  };

  const dates = [];
  const prices = [];
  let level = cfg.startLevel;
  const day = new Date(`${cfg.startDate}T00:00:00Z`);

  for (let i = 0; i < cfg.days; i++) {
    // weekends off, Bangladesh trades Sunday to Thursday, so
    // Friday and Saturday are the closed days
    do {
      day.setUTCDate(day.getUTCDate() + (i === 0 ? 0 : 1));
    } while (day.getUTCDay() === 5 || day.getUTCDay() === 6);

    const shock = normal(next);
    variance = omega + alpha * (variance * shock * shock) + beta * variance;
    let r = phase(i) - variance / 2 + Math.sqrt(variance) * shock;

    // jumps: rare, large, and asymmetric, crashes are sharper than rallies
    if (next() < 0.005) r += (next() < 0.56 ? -1 : 1) * (0.015 + next() * 0.035);

    level *= Math.exp(r);
    dates.push(day.toISOString().slice(0, 10));
    prices.push(Number(level.toFixed(2)));
  }

  return { name: cfg.name, short: cfg.short, note: cfg.note, dates, prices, simulated: true };
}

/* ============================================================
   CSV import, so the same analysis runs on real data
   ============================================================ */

/**
 * Parse a two-column CSV of date,close. Tolerant of the shapes DSE
 * and most exports actually produce: a header or none, extra
 * columns, thousands separators, DD/MM/YYYY or ISO dates.
 *
 * Returns { series, errors } rather than throwing, a bad row
 * should cost you that row, not the whole file.
 */
export function parseCsv(text, { dateCol = 0, priceCol = 1 } = {}) {
  const errors = [];
  const rows = String(text).split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const dates = [];
  const prices = [];

  rows.forEach((line, i) => {
    const cells = splitRow(line);
    if (cells.length <= Math.max(dateCol, priceCol)) {
      errors.push(`Line ${i + 1}: needs at least ${Math.max(dateCol, priceCol) + 1} columns`);
      return;
    }
    const rawDate = cells[dateCol];
    const rawPrice = cells[priceCol].replace(/,/g, "");
    const price = Number(rawPrice);
    const date = normaliseDate(rawDate);

    if (!date || !Number.isFinite(price) || price <= 0) {
      // the header row lands here, which is expected, not an error
      if (i > 0) errors.push(`Line ${i + 1}: couldn't read "${rawDate}" / "${cells[priceCol]}"`);
      return;
    }
    dates.push(date);
    prices.push(price);
  });

  // oldest first, whichever way the file was ordered
  const order = dates.map((d, i) => i).sort((a, b) => dates[a] < dates[b] ? -1 : 1);
  const series = {
    name: "Imported series",
    short: "CSV",
    note: "Your own data, analysed in the browser. Nothing is uploaded anywhere.",
    dates: order.map((i) => dates[i]),
    prices: order.map((i) => prices[i]),
    simulated: false,
  };
  return { series, errors };
}

/**
 * Split one CSV row, RESPECTING QUOTES. A naive split on
 * /[,;\t]/ turns `2024-01-02,"6,180.10"` into 6, a silent 1000×
 * error that every statistic downstream still renders as a
 * number.
 */
export function splitRow(line) {
  const cells = [];
  let cur = "";
  let quoted = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      // a doubled quote inside a quoted field is a literal quote
      if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
      else quoted = !quoted;
      continue;
    }
    if (!quoted && (ch === "," || ch === ";" || ch === "\t")) {
      cells.push(cur.trim());
      cur = "";
      continue;
    }
    cur += ch;
  }
  cells.push(cur.trim());
  return cells;
}

/** ISO, DD/MM/YYYY and DD-MM-YYYY all normalise to YYYY-MM-DD. */
export function normaliseDate(s) {
  const t = String(s).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10);
  const m = t.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  if (m) {
    const [, d, mo, y] = m;
    return `${y}-${mo.padStart(2, "0")}-${d.padStart(2, "0")}`;
  }
  const parsed = Date.parse(t);
  return Number.isFinite(parsed) ? new Date(parsed).toISOString().slice(0, 10) : null;
}

/* ============================================================
   Export
   ============================================================ */
export function toCsv(a, series) {
  const esc = (s) => (typeof s === "string" && /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  const L = [];
  L.push([series.name].map(esc).join(","));
  L.push([series.note].map(esc).join(","));
  L.push("");

  L.push(["SUMMARY"].join(","));
  const s = a.stats;
  [
    ["Observations", s.observations],
    ["Years", s.years.toFixed(2)],
    ["Total return %", (s.totalReturn * 100).toFixed(2)],
    ["CAGR %", (s.cagr * 100).toFixed(2)],
    ["Annualised volatility %", (s.vol * 100).toFixed(2)],
    ["Maximum drawdown %", (s.maxDrawdown * 100).toFixed(2)],
    ["Best day %", (s.bestDay * 100).toFixed(2)],
    ["Worst day %", (s.worstDay * 100).toFixed(2)],
    ["Positive days %", (s.positiveDays * 100).toFixed(2)],
    ["Skewness", s.skew.toFixed(3)],
    ["Excess kurtosis", s.kurtosis.toFixed(3)],
    ["Daily VaR 95% (loss)", (s.var95 * 100).toFixed(2)],
    ["Daily expected shortfall 95%", (s.es95 * 100).toFixed(2)],
    ["Daily VaR 99% (loss)", (s.var99 * 100).toFixed(2)],
    ["Daily expected shortfall 99%", (s.es99 * 100).toFixed(2)],
    ["Autocorrelation of returns (lag 1)", s.acReturns.toFixed(3)],
    ["Autocorrelation of |returns| (lag 1)", s.acAbsReturns.toFixed(3)],
  ].forEach((r) => L.push(r.map(esc).join(",")));
  L.push("");

  L.push(["DRAWDOWN EPISODES", "Peak", "Trough", "Recovered", "Depth %",
    "Days peak→trough", "Days trough→recovery"].map(esc).join(","));
  a.episodes.forEach((e) => L.push([
    "", e.peakDate, e.troughDate, e.recoveryDate ?? "still underwater",
    (e.depth * 100).toFixed(2), e.declineDays, e.recoveryDays ?? "",
  ].map(esc).join(",")));
  L.push("");

  L.push(["HOLDING PERIOD", "Windows", "Positive %", "Worst %", "5th pct %",
    "Median %", "95th pct %", "Best %"].map(esc).join(","));
  a.horizons.forEach((h) => L.push([
    h.label, h.count,
    (h.positive * 100).toFixed(1), (h.worst * 100).toFixed(1),
    (h.p05 * 100).toFixed(1), (h.median * 100).toFixed(1),
    (h.p95 * 100).toFixed(1), (h.best * 100).toFixed(1),
  ].map(esc).join(",")));
  L.push("");

  L.push(["CALENDAR YEAR", "Return %", "Volatility %", "Max drawdown %"].map(esc).join(","));
  a.calendar.forEach((y) => L.push([
    y.year, (y.return * 100).toFixed(2), (y.vol * 100).toFixed(2),
    (y.maxDrawdown * 100).toFixed(2),
  ].map(esc).join(",")));

  return L.join("\n");
}
