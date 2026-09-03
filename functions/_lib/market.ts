/* ============================================================
   functions/_lib/market.ts: daily market series through the
   Worker. RESEARCH.md section 14.

   Alpha Vantage, by symbol, with the site's key, cached a day in
   D1 beside the scholar cache. The browser never calls the
   service: `connect-src` is 'self' and one caller is the only
   place that can meter a key honestly. Without a key the lab
   says the service is off rather than failing oddly.
   ============================================================ */

import { cached, DAY, getJSON, type ScholarEnv } from "./scholar.ts";

export interface MarketEnv extends ScholarEnv { ALPHA_VANTAGE_KEY?: string }

export const canMarket = (env: MarketEnv): boolean => Boolean(env.ALPHA_VANTAGE_KEY);

export interface Bar { date: string; open: number; high: number; low: number; close: number; volume: number }
export interface Series { symbol: string; source: string; fetched: string; bars: Bar[] }

const SYMBOL = /^[A-Z0-9.\-^]{1,16}$/i;

/** The daily series, oldest first. `full` is twenty years; the
    default is the last hundred days, which is what the free plan
    answers quickly. */
export async function dailySeries(env: MarketEnv, symbol: string, full = false): Promise<Series | null> {
  if (!canMarket(env) || !SYMBOL.test(symbol)) return null;
  const sym = symbol.toUpperCase();
  return cached<Series>(env, `market:daily:${sym}:${full ? "full" : "compact"}`, DAY, async () => {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${encodeURIComponent(sym)}&outputsize=${full ? "full" : "compact"}&apikey=${env.ALPHA_VANTAGE_KEY}`;
    const data = await getJSON(url) as Record<string, unknown>;
    const series = data["Time Series (Daily)"] as Record<string, Record<string, string>> | undefined;
    if (!series) return null;
    const bars: Bar[] = Object.entries(series).map(([date, v]) => ({
      date, open: Number(v["1. open"]), high: Number(v["2. high"]), low: Number(v["3. low"]), close: Number(v["4. close"]), volume: Number(v["5. volume"]),
    })).sort((a, b) => a.date.localeCompare(b.date));
    return { symbol: sym, source: "Alpha Vantage", fetched: new Date().toISOString(), bars };
  });
}

/** The same series as CSV text, which is what a dataset is. */
export const seriesCsv = (s: Series): string =>
  ["date,open,high,low,close,volume", ...s.bars.map((b) => `${b.date},${b.open},${b.high},${b.low},${b.close},${b.volume}`)].join("\n") + "\n";
