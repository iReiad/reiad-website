/* ============================================================
   portfolio.ts: what a broker's JSON means.

   `/api/broker/live` hands back Trading 212's own answer,
   unchanged: a summary object and an array of positions. Turning
   that into a dashboard is a dozen small derivations, and they
   were inline in `aab/src/tools/live.ts`, tangled with the DOM
   that displayed them. Two runtimes need them now.

   ---- why so much of this is defensive ----

   Every field here belongs to somebody else. A broker that
   renames one, or starts sending a string where a number was,
   must not take a public page down: `num()` answers nought
   rather than NaN or a throw, and the page shows a nought where
   it cannot show a figure.

   `unrealizedProfitLoss` is spelt the American way at the source
   and is not ours to correct. Renaming it here would mean reading
   a field that does not exist, which under the rule above reads
   as nought, on every holding, silently.

   ---- and what is NOT here ----

   The public view. A stranger gets percentages and no cash
   figures, and that stripping happens on the SERVER, in
   `functions/_lib/broker.ts`, because a client that filters is a
   client that has already been sent the thing it is hiding.
   ============================================================ */
/* ---------- reading somebody else's JSON ---------- */
const obj = (v) => (v && typeof v === "object" ? v : {});
const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : 0);
const str = (v) => (typeof v === "string" ? v : "");
/** A percentage of something, or nought where the something is
    nought. Never Infinity: a holding bought for nothing would
    otherwise render as an infinite gain. */
export const pctOf = (part, whole) => (whole > 0 ? (part / whole) * 100 : 0);
export function totalsOf(summary) {
    const s = obj(summary);
    const inv = obj(s.investments);
    const cash = obj(s.cash);
    const cost = num(inv.totalCost);
    const unrealised = num(inv.unrealizedProfitLoss);
    return {
        currency: str(s.currency) || "GBP",
        total: num(s.totalValue),
        invested: num(inv.currentValue),
        cost,
        unrealised,
        unrealisedPct: pctOf(unrealised, cost),
        realised: num(inv.realizedProfitLoss),
        freeCash: num(cash.availableToTrade),
        inPies: num(cash.inPies),
    };
}
export function holdingsOf(positions, invested) {
    const rows = (Array.isArray(positions) ? positions : []).map((raw) => {
        const p = obj(raw);
        const w = obj(p.walletImpact);
        const instrument = obj(p.instrument);
        const cost = num(w.totalCost);
        const gain = num(w.unrealizedProfitLoss);
        const value = num(w.currentValue);
        return {
            name: str(instrument.name).slice(0, 60),
            ticker: str(instrument.ticker).split("_")[0],
            currency: str(instrument.currency),
            quantity: num(p.quantity),
            averagePaid: num(p.averagePricePaid),
            price: num(p.currentPrice),
            value,
            cost,
            gain,
            gainPct: pctOf(gain, cost),
            weightPct: pctOf(value, invested),
            barPct: 0,
        };
    });
    /* Biggest first. The broker answers in its own order, and a
       list of holdings that reshuffles between refreshes looks
       like trades that never happened. */
    rows.sort((a, b) => b.value - a.value);
    const largest = rows[0]?.value ?? 0;
    for (const row of rows) {
        row.barPct = largest > 0 ? Math.max(2, (row.value / largest) * 100) : 0;
    }
    return rows;
}
/**
 * The last twelve months of dividends, oldest first, including
 * the months with none in them.
 *
 * The empty ones are the point. A chart of only the months that
 * paid is a chart with no gaps in it, which is exactly the wrong
 * impression: a portfolio paying twice a year should LOOK like a
 * portfolio paying twice a year.
 *
 * `now` is an argument rather than a call to the clock, so this
 * can be tested and so the two implementations bucket against the
 * same month rather than against whatever each machine thinks the
 * date is.
 */
export function dividendMonths(items, now, span = 12) {
    const paid = new Map();
    for (const raw of (Array.isArray(items) ? items : [])) {
        const d = obj(raw);
        const month = str(d.paidOn).slice(0, 7);
        if (month.length !== 7)
            continue;
        paid.set(month, (paid.get(month) ?? 0) + num(d.amount));
    }
    const out = [];
    for (let back = span - 1; back >= 0; back -= 1) {
        /* Built from the year and month rather than by subtracting
           days: the 31st of March minus one month is a date that does
           not exist, and every language answers differently. */
        const y = now.getUTCFullYear();
        const m = now.getUTCMonth() - back;
        const at = new Date(Date.UTC(y, m, 1));
        const key = `${at.getUTCFullYear()}-${String(at.getUTCMonth() + 1).padStart(2, "0")}`;
        out.push({ key, amount: paid.get(key) ?? 0 });
    }
    return out;
}
/** What those twelve months came to, which is the honest headline
    for a dividend chart: the tallest column means nothing without
    it. */
export const dividendTotal = (months) => months.reduce((a, m) => a + m.amount, 0);
