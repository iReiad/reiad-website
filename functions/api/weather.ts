/* ============================================================
   functions/api/weather.ts, served at /api/weather

   What the sky is doing where the reader is, so the page can put
   a little of it on the glass. `next/components/weather.tsx` is
   the drawing; this is the one place that knows there is a
   weather service at all.

   ---- the browser never talks to the service ----

   The same rule the broker follows, and for the same two reasons.
   `connect-src` in `shared/headers.ts` and `aab/_headers` is
   `'self'`, so a fetch to another host would be blocked before it
   left the page; and one caller is the only place that can cache
   honestly, so a thousand readers in Dhaka are one request every
   fifteen minutes rather than a thousand.

   `scripts/check-csp.ts` scans every string in `aab/` and `next/`
   and would rightly fail on this hostname appearing in either.
   It lives here and nowhere else.

   ---- coarse on purpose ----

   Two decimal places is about a kilometre, which is far more than
   enough to know whether it is raining and far less than enough
   to find a house. The rounding is done HERE as well as in the
   browser, because a coordinate is the most personal thing this
   site ever handles and one of the two places doing it is one
   place too few. It is also what makes the cache work: everybody
   within a kilometre shares an entry.

   Nothing about the reader is stored. There is no row, no log and
   no account involved: a request carries two numbers and gets a
   weather code back.

   ---- and a reader can type a place instead ----

   `/api/weather/place?q=` is the second half, and it exists for
   the reader whose browser will not hand over a coordinate: a
   locked-down phone, a desktop with the permission denied at the
   operating system, a library machine, or somebody who simply
   would rather say where they are than be found. It searches
   Open-Meteo's geocoding index and answers with names and
   coordinates, already rounded to the same two places.

   It is on this file rather than a route of its own because it is
   the same service, and the sentence at the top of this comment,
   that one file knows there is a weather service at all, is worth
   more than a tidier route table.
   ============================================================ */

import { fail, json, type RouteContext } from "../_lib/http.ts";

/** Open-Meteo. No key, no account, and the licence is CC-BY,
    which the appearance panel credits in one line. */
const SERVICE = "https://api.open-meteo.com/v1/forecast";

/** The same project's place index, which is what turns "Sylhet"
    into two numbers. A separate host, and both of them are named
    here and nowhere else. */
const PLACES = "https://geocoding-api.open-meteo.com/v1/search";

/** Fifteen minutes at the edge. Weather does not change faster
    than that in any way a page could honestly draw. */
const EDGE = 900;

/** A day, for a place name, because a town does not move and the
    same twenty queries answer almost everybody. */
const PLACE_EDGE = 86400;

/** What the drawing understands. Seven of them, because seven is
    what can be told apart on a page at 40% opacity: a reader
    cannot see the difference between light and moderate drizzle
    and would be misled by a page claiming to know. */
export type Sky =
  | "clear" | "cloud" | "fog" | "drizzle" | "rain" | "snow" | "storm";

/** WMO code to sky, which is the whole of the translation.

    Written as ranges rather than a 100-entry map because that is
    what the standard is: 51/53/55 are three intensities of one
    thing and this site draws one drizzle. */
function skyOf(code: number): Sky {
  if (code >= 95) return "storm";
  if (code >= 85) return "snow";
  if (code >= 80) return "rain";
  if (code >= 71) return "snow";
  if (code >= 66) return "snow";
  if (code >= 61) return "rain";
  if (code >= 56) return "drizzle";
  if (code >= 51) return "drizzle";
  if (code >= 45) return "fog";
  if (code >= 2) return "cloud";
  return "clear";
}

/** A coordinate, or null. Null for anything that is not a finite
    number in range, which includes the two strings a caller is
    most likely to send by accident: "undefined" and "". */
function coord(raw: string | null, limit: number): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null;
  /* Two decimal places, to the same precision the browser sends,
     so this and the cache key agree with each other. */
  return Math.round(n * 100) / 100;
}

/** A place, as the panel draws it: enough to tell two Cambridges
    apart and nothing more. `id` is the coordinate pair, because
    Open-Meteo's own id is its key rather than ours and a React
    list wants something stable. */
export interface Place {
  id: string;
  name: string;
  where: string;
  lat: number;
  lon: number;
}

/** Country and region, joined, with the empty ones dropped. Two
    towns called Cambridge are told apart by this line and by
    nothing else on the row. */
function whereOf(row: Record<string, unknown>): string {
  return [row.admin1, row.country]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

/** Search the place index. Cached at the edge for a day: a place
    name does not move, and the same handful of queries answer
    almost every reader. */
async function searchPlaces(
  context: RouteContext, query: string,
): Promise<Response> {
  const q = query.trim().slice(0, 80);
  /* Two letters, because one letter is every place in the index
     and the honest answer to it is not a list of ten. */
  if (q.length < 2) return json({ ok: true, places: [] as Place[] });

  const key = new Request(
    `https://weather.internal/place?q=${encodeURIComponent(q.toLowerCase())}`,
    { method: "GET" });
  const cache = caches.default;
  const hit = await cache.match(key);
  if (hit) return hit;

  let body: Response;
  try {
    const res = await fetch(
      `${PLACES}?name=${encodeURIComponent(q)}&count=8&language=en&format=json`,
      { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return fail("no-answer", 502);

    const data = await res.json() as {
      results?: Array<Record<string, unknown>>;
    };
    const places: Place[] = (data.results ?? [])
      .map((row) => {
        const lat = coord(String(row.latitude ?? ""), 90);
        const lon = coord(String(row.longitude ?? ""), 180);
        const name = String(row.name ?? "").trim();
        if (lat === null || lon === null || !name) return null;
        return { id: `${lat},${lon}`, name, where: whereOf(row), lat, lon };
      })
      .filter((row): row is Place => row !== null)
      .slice(0, 6);

    body = json({ ok: true, places }, 200,
      { "Cache-Control": `public, max-age=${PLACE_EDGE}` });
  } catch {
    return fail("no-answer", 502);
  }

  context.waitUntil(cache.put(key, body.clone()));
  return body;
}

export const onRequestGet = async (
  context: RouteContext,
): Promise<Response> => {
  const url = new URL(context.request.url);

  /* One prefix, two jobs. The route table hands this handler
     everything under /api/weather, so the path is what says which
     of the two a request is. */
  if (url.pathname.replace(/\/+$/, "").endsWith("/place")) {
    return await searchPlaces(context, url.searchParams.get("q") ?? "");
  }

  const lat = coord(url.searchParams.get("lat"), 90);
  const lon = coord(url.searchParams.get("lon"), 180);
  if (lat === null || lon === null) return fail("bad-place", 400);

  /* The cache key is the ROUNDED pair rather than the request, so
     two readers a hundred metres apart share one entry and a
     caller who sent six decimal places cannot make a key of their
     own. */
  const key = new Request(
    `https://weather.internal/?lat=${lat}&lon=${lon}`, { method: "GET" });
  const cache = caches.default;

  const hit = await cache.match(key);
  if (hit) return hit;

  let body: Response;
  try {
    const res = await fetch(
      `${SERVICE}?latitude=${lat}&longitude=${lon}`
      + "&current=weather_code,is_day,wind_speed_10m,temperature_2m",
      { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return fail("no-answer", 502);

    const data = await res.json() as {
      current?: {
        weather_code?: number; is_day?: number;
        wind_speed_10m?: number; temperature_2m?: number;
      };
    };
    const now = data.current ?? {};
    const code = Number(now.weather_code ?? 0);

    body = json({
      ok: true,
      sky: skyOf(Number.isFinite(code) ? code : 0),
      day: now.is_day !== 0,
      /* Rounded, because a page that says 27 and a page that says
         27.3 are the same page and the second one is pretending. */
      wind: Math.round(Number(now.wind_speed_10m ?? 0)),
      temp: Math.round(Number(now.temperature_2m ?? 0)),
    }, 200, { "Cache-Control": `public, max-age=${EDGE}` });
  } catch {
    return fail("no-answer", 502);
  }

  context.waitUntil(cache.put(key, body.clone()));
  return body;
};

export const onRequest = onRequestGet;
