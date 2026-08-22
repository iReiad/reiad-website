/* ============================================================
   /api/diet/*: food found rather than typed.

   GET /api/diet/food?q=&place=bd|uk   a search, both databases
   GET /api/diet/food/<barcode>        one packaged product
   GET /api/diet/food/status           which upstreams are on

   `DIET.md` sections 12 and 27. This is the WHOLE of the diet
   tool's Worker surface, and the split is deliberate: the
   reader's own rows are the browser's, read and written as the
   reader through PostgREST, and somebody else's database is the
   Worker's. Nothing about a reader passes through here.

   ---- public on purpose ----

   No sign-in, no bearer, no gate, and `scripts/check-admin.ts`
   names it as public with that reason. There is nothing here to
   gate: it reads two public databases and answers with rows
   already served at a public URL. Adding a sign-in would only
   mean the food search stopped working on the one page of this
   tool that needs no account.

   That is also what makes the cache safe. A search for "chicken"
   is the same search for everybody, so the answer is kept at the
   edge and shared, and there is nothing private that could leak
   into it.

   ---- a failing upstream is reported, never thrown ----

   Every response carries `sources`, saying in one word what each
   database did: answered, could not be asked, has no key, or was
   never asked because the other one answered. One down means the
   other's results, with the page able to say so. Both down is a
   502, because an empty list would read as "no such food", which
   is a different and untrue sentence.

   A response is cached only when nothing failed, at the edge and
   in the reader's browser alike. Caching a bad afternoon would
   freeze it for six hours.
   ============================================================ */

import { fail, methods, ok, str } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import { throttle } from "../../_lib/auth.ts";
import type { DbEnv } from "../../_lib/db.ts";
import {
  canReachFdc, isBarcode, lookupFdc, lookupOff, merge, queryKind,
  searchFdc, searchOff,
} from "../../_lib/food.ts";
import type { FdcEnv, FoodHit, SourceState, UpstreamAnswer } from "../../_lib/food.ts";
import { DEFAULT_PLACE } from "../../../shared/foods.ts";
import type { Place } from "../../../shared/diet.ts";

/** D1 only for the throttle, which degrades to nothing without
    it. No Supabase and no reader: see the banner. */
interface DietEnv extends DbEnv, FdcEnv {}

/** A search is worth six hours and a found product a day:
    composition changes slowly and a new row is not urgent.

    A MISS is worth ten minutes, because it is the one answer
    likely to change soon: a reader who scans something Open Food
    Facts has never seen may well be the person who adds it. */
const SEARCH_SECONDS = 6 * 60 * 60;
const FOUND_SECONDS = 24 * 60 * 60;
const MISS_SECONDS = 10 * 60;

/* Generous for a debounced search box, and the reason there is
   one at all is the reason the broker route has one: an
   anonymous relay to somebody else's service is a thing the open
   internet finds and hammers, and the two upstreams here are
   free services this site is a guest of. The cache absorbs the
   repeats; this bounds the rest. */
const PER_QUARTER_HOUR = 120;

const CACHE = "https://food-cache.invalid";

/** Two characters, because one letter is every keystroke of
    every search box in the world arriving at two free APIs. */
const MIN_QUERY = 2;

const isPlace = (value: string): value is Place => value === "bd" || value === "uk";

/** The browser knows the place before the page renders and sends
    it. The default covers a caller that did not, and it is the
    one in `shared/foods.ts`: this Worker ranked Bangladesh first
    while the picker asked for the UK, which is one reader
    getting two libraries out of one search. */
const placeFrom = (value: string): Place => (isPlace(value) ? value : DEFAULT_PLACE);

interface Sources {
  off: SourceState;
  fdc: SourceState;
}

const spoke = (sources: Sources): boolean =>
  sources.off === "ok" || sources.fdc === "ok";

const failedAny = (sources: Sources): boolean =>
  sources.off === "failed" || sources.fdc === "failed";

const sourcesOf = (off: UpstreamAnswer, fdc: UpstreamAnswer): Sources =>
  ({ off: off.state, fdc: fdc.state });

/** Both databases at once. Neither waits for the other and
    neither can take the other down: `allSettled` is not needed
    because both of these answer with a state rather than
    throwing. */
const bothFor = (env: DietEnv, query: string, place: Place) =>
  Promise.all([searchOff(query, place), searchFdc(env, query)]);

/* ---------- the edge cache ----------

   A JSON window under a synthetic URL, the way `broker.ts` and
   `news.ts` use it. The difference from the broker's is the
   whole point of this endpoint: that one is keyed by a hash of a
   reader's API key because the answer is theirs, and this one is
   keyed by the QUERY because the answer is everybody's. */

const cached = async (key: string): Promise<Response | undefined> =>
  caches.default.match(key);

/**
 * The answer, kept where it is worth keeping.
 *
 * A DEGRADED answer is not cached anywhere, and that is two
 * decisions rather than one: it does not go into the edge cache,
 * and it does not carry a `max-age` that would leave it sitting
 * in the reader's own browser for six hours either. Caching a
 * bad afternoon freezes it, and nothing would tell the reader
 * that the half empty list in front of them is a search that
 * half failed hours ago.
 */
function answer(
  context: RouteContext<DietEnv, { route?: string[] }>,
  key: string, data: object, seconds: number, sources: Sources,
): Response {
  if (failedAny(sources)) return ok(data);
  const res = ok(data, { "Cache-Control": `public, max-age=${seconds}` });
  context.waitUntil(caches.default.put(key, res.clone()));
  return res;
}

/* ============================================================ */

export async function onRequest(
  context: RouteContext<DietEnv, { route?: string[] }>,
): Promise<Response> {
  const { request, env, params } = context;
  const parts = params.route ?? [];

  if (parts[0] !== "food") return fail("no-such-route", 404);

  /* Before the barcode branch, and unambiguous: a barcode is
     digits, so no product can be called "status". */
  if (parts[1] === "status" && parts.length === 2) {
    return methods(request, {
      /* What is CONFIGURED, not what is up this second. Open
         Food Facts needs no key and is never unconfigured;
         FoodData Central without its secret is a section that
         says it is not connected rather than one that fails
         oddly, which is the arrangement `_lib/drive.ts` already
         uses. An upstream that is DOWN is reported per request
         in `sources`, which is the only place that can honestly
         say so. */
      GET: () => ok({ off: true, fdc: canReachFdc(env) }),
    });
  }

  if (parts.length === 2) {
    const code = str(parts[1], 20);
    return methods(request, { GET: () => byBarcode(context, code) });
  }

  if (parts.length === 1) {
    return methods(request, { GET: () => bySearch(context) });
  }

  return fail("no-such-route", 404);
}

/* ---------- the search ---------- */

async function bySearch(
  context: RouteContext<DietEnv, { route?: string[] }>,
): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);

  /* Lowercased and collapsed once, so that "Chicken  Breast" and
     "chicken breast" are one entry in the cache and one request
     upstream. Both databases are case insensitive. */
  const query = str(url.searchParams.get("q") ?? "", 80).toLowerCase().replace(/\s+/g, " ");
  if (query.length < MIN_QUERY) {
    return fail("short-query", 400, { message: "Two characters or more." });
  }
  const place = placeFrom(str(url.searchParams.get("place") ?? "", 4));

  const key = `${CACHE}/search/${place}/${encodeURIComponent(query)}`;
  const hit = await cached(key);
  if (hit) return hit;

  if (await throttle(context, "diet-food", PER_QUARTER_HOUR, 15)) {
    return fail("too-many", 429);
  }

  const [off, fdc] = await bothFor(env, query, place);
  const sources = sourcesOf(off, fdc);
  if (!spoke(sources)) {
    return fail("upstreams-unreachable", 502, { sources });
  }

  const results: FoodHit[] = merge(off.hits, fdc.hits, queryKind(query));
  return answer(context, key, { results, sources }, SEARCH_SECONDS, sources);
}

/* ---------- one barcode ---------- */

async function byBarcode(
  context: RouteContext<DietEnv, { route?: string[] }>,
  code: string,
): Promise<Response> {
  const { env } = context;
  if (!isBarcode(code)) {
    return fail("bad-barcode", 400, { message: "Eight to fourteen digits." });
  }

  const key = `${CACHE}/barcode/${code}`;
  const hit = await cached(key);
  if (hit) return hit;

  if (await throttle(context, "diet-food", PER_QUARTER_HOUR, 15)) {
    return fail("too-many", 429);
  }

  /* Open Food Facts first and alone where it answers: it is the
     one of the two keyed on barcodes. FoodData Central is asked
     only when that came back with nothing, because it matches a
     barcode through its SEARCH endpoint rather than holding one,
     and a second request for a product already found would be a
     request nobody needed. `skipped` is what that is called in
     the answer, because a source that was never asked cannot
     honestly be reported as one that agreed. */
  const off = await lookupOff(code);
  const fdc: UpstreamAnswer = off.hits.length
    ? { state: "skipped", hits: [] }
    : await lookupFdc(env, code);

  const sources = sourcesOf(off, fdc);
  if (!spoke(sources)) {
    return fail("upstreams-unreachable", 502, { sources });
  }

  const result: FoodHit | null = off.hits[0] ?? fdc.hits[0] ?? null;
  return answer(
    context, key, { result, sources },
    result ? FOUND_SECONDS : MISS_SECONDS, sources,
  );
}
