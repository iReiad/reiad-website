/* ============================================================
   functions/api/place.ts, served at /api/place

   A town by name: "Sylhet" in, a short list of names and
   coordinates out, for the research lab's climate series, whose
   dataset needs a point on the map that a reader would rather
   type than be found at.

   ---- the browser never talks to the service ----

   The same rule the broker follows, and for the same two reasons.
   `connect-src` in `shared/headers.ts` and `aab/_headers` is
   `'self'`, so a fetch to another host would be blocked before it
   left the page; and one caller is the only place that can cache
   honestly, so the same twenty queries answer almost everybody.
   `scripts/check-csp.ts` scans every string in `aab/` and `next/`
   and would rightly fail on this hostname appearing in either.

   ---- coarse on purpose ----

   Two decimal places is about a kilometre, which is the resolution
   of the climate model anyway (`functions/_lib/climate.ts` rounds
   the same way) and far less than enough to find a house. Nothing
   about the reader is stored: a request carries a name and gets
   a list back.
   ============================================================ */

import { fail, json, type RouteContext } from "../_lib/http.ts";

/** Open-Meteo's place index. No key, no account, CC-BY. Named
    here and nowhere else. */
const PLACES = "https://geocoding-api.open-meteo.com/v1/search";

/** A day at the edge, because a town does not move. */
const PLACE_EDGE = 86400;

/** A coordinate rounded to two places, or null for anything that
    is not a finite number in range. */
function coord(raw: string | null, limit: number): number | null {
  if (!raw) return null;
  const n = Number(raw);
  if (!Number.isFinite(n) || Math.abs(n) > limit) return null;
  return Math.round(n * 100) / 100;
}

/** A place, as the lab lists it: enough to tell two Cambridges
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

/** Country and region, joined, with the empty ones dropped. */
function whereOf(row: Record<string, unknown>): string {
  return [row.admin1, row.country]
    .map((part) => String(part ?? "").trim())
    .filter(Boolean)
    .join(", ");
}

export const onRequestGet = async (
  context: RouteContext,
): Promise<Response> => {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") ?? "").trim().slice(0, 80);
  /* Two letters, because one letter is every place in the index
     and the honest answer to it is not a list of ten. */
  if (q.length < 2) return json({ ok: true, places: [] as Place[] });

  const key = new Request(
    `https://place.internal/?q=${encodeURIComponent(q.toLowerCase())}`,
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
};

export const onRequest = onRequestGet;
