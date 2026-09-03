/* ============================================================
   functions/_lib/climate.ts: daily weather at a point, past
   years, through the Worker. RESEARCH.md section 36, "climate
   for a place".

   Open-Meteo's archive, no key, CC-BY. The browser never calls
   it: `connect-src` is 'self', and `scripts/check-csp.ts` fails
   on this hostname anywhere under next/ or aab/. The answer is
   rows a dataset can be made of, so degree days and rainfall
   shocks run on a saved series like on any upload.

   Two decimal places on the coordinate, here as well as in the
   browser, for the reason functions/api/weather.ts gives: about
   a kilometre, which is the resolution of the model anyway, and
   it is what lets two readers share one cache entry. `coord` is
   that file's rule written a second time because it is not
   exported from there.
   ============================================================ */

const ARCHIVE = "https://archive-api.open-meteo.com/v1/archive";

/** A day at the edge. A past year does not change. */
const EDGE = 86400;

/** The archive starts in 1940; a span longer than twenty years is
    a download rather than a query and the row cap below holds. */
const FIRST = "1940-01-01";
const MAX_DAYS = 366 * 20;

/** Twenty a minute is a person trying a few places; more is a
    script using this site as a relay to somebody else's server. */
export const CLIMATE_A_MINUTE = 20;

export interface ClimateQuery { lat: number; lon: number; from: string; to: string }

export interface ClimateSeries {
  lat: number;
  lon: number;
  from: string;
  to: string;
  source: string;
  licence: string;
  fetched: string;
  columns: string[];
  units: Record<string, string>;
  rows: (string | number | null)[][];
}

/** A coordinate rounded to two places, or null for anything that
    is not a finite number in range. Agrees with weather.ts. */
export function coord(raw: string | null, limit: number): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null;
  return Math.round(n * 100) / 100;
}

const DAY = /^\d{4}-\d{2}-\d{2}$/;

const dayOf = (raw: string | null): string | null => {
  if (!raw || !DAY.test(raw)) return null;
  const t = Date.parse(`${raw}T00:00:00Z`);
  return Number.isFinite(t) && new Date(t).toISOString().slice(0, 10) === raw ? raw : null;
};

/** The four query parameters checked: a pair in range, two real
    days in order, inside the archive and under the span cap. */
export function climateQuery(params: URLSearchParams): ClimateQuery | null {
  const lat = coord(params.get("lat"), 90);
  const lon = coord(params.get("lon"), 180);
  const from = dayOf(params.get("from"));
  const to = dayOf(params.get("to"));
  if (lat === null || lon === null || !from || !to) return null;
  if (from < FIRST || to < from || to > new Date().toISOString().slice(0, 10)) return null;
  if ((Date.parse(to) - Date.parse(from)) / 86400000 > MAX_DAYS) return null;
  return { lat, lon, from, to };
}

export const COLUMNS = ["date", "tmax", "tmin", "tmean", "rain"];
export const UNITS: Record<string, string> = { tmax: "°C", tmin: "°C", tmean: "°C", rain: "mm" };

const num = (v: unknown): number | null => (typeof v === "number" && Number.isFinite(v) ? v : null);

/** The daily series, cached at the edge for a day under the
    rounded query, so a caller sending six decimal places cannot
    make a key of their own. Null where the service did not
    answer. */
export async function dailyClimate(
  context: { waitUntil(promise: Promise<unknown>): void }, q: ClimateQuery,
): Promise<ClimateSeries | null> {
  const key = new Request(`https://climate.internal/?lat=${q.lat}&lon=${q.lon}&from=${q.from}&to=${q.to}`, { method: "GET" });
  const cache = caches.default;
  const hit = await cache.match(key);
  if (hit) return await hit.json() as ClimateSeries;
  let series: ClimateSeries;
  try {
    const res = await fetch(
      `${ARCHIVE}?latitude=${q.lat}&longitude=${q.lon}&start_date=${q.from}&end_date=${q.to}`
      + "&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean,precipitation_sum&timezone=UTC",
      { signal: AbortSignal.timeout(12000) });
    if (!res.ok) return null;
    const data = await res.json() as {
      daily?: { time?: string[]; temperature_2m_max?: unknown[]; temperature_2m_min?: unknown[]; temperature_2m_mean?: unknown[]; precipitation_sum?: unknown[] };
    };
    const d = data.daily;
    if (!d?.time?.length) return null;
    const rows = d.time.map((date, i) => [date, num(d.temperature_2m_max?.[i]), num(d.temperature_2m_min?.[i]), num(d.temperature_2m_mean?.[i]), num(d.precipitation_sum?.[i])]);
    series = { ...q, source: "Open-Meteo", licence: "CC-BY 4.0", fetched: new Date().toISOString(), columns: COLUMNS, units: UNITS, rows };
  } catch {
    return null;
  }
  context.waitUntil(cache.put(key, new Response(JSON.stringify(series), { headers: { "content-type": "application/json", "Cache-Control": `public, max-age=${EDGE}` } })));
  return series;
}

/** The same series as CSV text, which is what a dataset is. */
export const climateCsv = (s: ClimateSeries): string =>
  [s.columns.join(","), ...s.rows.map((r) => r.map((v) => (v === null ? "" : String(v))).join(","))].join("\n") + "\n";
