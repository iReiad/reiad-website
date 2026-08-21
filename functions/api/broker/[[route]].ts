/* ============================================================
   /api/broker/*: the live portfolio, proxied and metered.

   GET  /api/broker/public     the site's own portfolio, sanitised
                               to percentages. No sign-in, cached.
   GET  /api/broker/me         who am I here: admin or not, key
                               saved or not, what is configured.
   PUT  /api/broker/key        validate a reader's Trading 212 key
   DELETE /api/broker/key      against the broker, seal it, keep it.
   GET  /api/broker/live       the signed-in reader's own account
                               summary and positions.
   GET  /api/broker/history    their dividends, filled orders and
                               transactions, one page of each.

   And the admin's half, each answering 403 to anybody else:

   GET  /api/broker/site       the site portfolio, unsanitised,
                               plus the public view settings.
   POST /api/broker/refresh    drop the cached snapshot and fetch
                               a fresh one now.
   PUT  /api/broker/view       what the public page is allowed to
                               show.
   PUT  /api/broker/site-key   the key behind the public page,
   DELETE /api/broker/site-key sealed into D1 settings. A
                               T212_PUBLIC_TOKEN wrangler secret
                               wins over the stored one where both
                               exist.

   Every route that reads the broker does it through one seam,
   `_lib/broker.ts`, and every reader-facing route works the same
   two ways: with the key saved to the account, or with a key the
   browser holds for the session and sends per request in the
   `x-broker-key` header, which this endpoint uses and forgets.

   Sign-in is required for everything personal, including the
   per-session path. Not because the proxy could leak anything
   (a key only ever reaches the account it belongs to), but
   because an anonymous relay to a third party is a thing the
   open internet finds and hammers, and the throttle table keys
   nicer off a person than off the world's proxies.
   ============================================================ */

import { db, setting, setSetting } from "../../_lib/db.ts";
import type { D1Database, DbEnv } from "../../_lib/db.ts";
import { body, fail, methods, notConfigured, ok, str, nowISO } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import { throttle } from "../../_lib/auth.ts";
import { readerFrom } from "../../_lib/reader.ts";
import type { ReaderEnv } from "../../_lib/reader.ts";
import { isAdmin } from "../../_lib/admins.ts";
import type { AdminEnv } from "../../_lib/admins.ts";
import {
  DEFAULT_VIEW, brokerFail, cacheGet, cachePut, canSeal,
  deleteKeyRow, hashOf, isBrokerEnv, publicView, saveKeyRow, savedKeyRow,
  seal, t212, unseal,
} from "../../_lib/broker.ts";
import type {
  BrokerAnswer, BrokerEnvName, BrokerSnapshot, BrokerStoreEnv, SealEnv, ViewSettings,
} from "../../_lib/broker.ts";

/** Everything this route binds. Five interfaces because five
    separate things are being reached: D1, the sealing secret, the
    Supabase row store, the reader's identity, and the admin list.
    They overlap on the two Supabase fields and that is fine; what
    they do not do is add up to one object called "the env". */
interface BrokerRouteEnv extends DbEnv, SealEnv, BrokerStoreEnv, ReaderEnv, AdminEnv {
  /** A key set as a wrangler secret, which wins over a stored one. */
  T212_PUBLIC_TOKEN?: string;
}

/** The key behind the public page, wherever it came from. */
interface SiteKey {
  key: string;
  env: BrokerEnvName;
  source: "secret" | "saved";
}

/** A snapshot as it is stored: the broker's two answers with the
    moment they were taken. `at` is not optional here, unlike on
    `BrokerSnapshot`, because staleness is measured from it. */
interface StoredSnapshot extends BrokerSnapshot {
  at: string;
}

/** Either a snapshot or the reason there is not one. A union,
    because `{ error }` and a snapshot share no field and an
    interface with both optional would let a caller read neither. */
type SnapshotResult = StoredSnapshot | { error: [string, number] };

const failed = (r: SnapshotResult): r is { error: [string, number] } => "error" in r;

/** The broker's summary answers a `currency`, and `data` is
    `unknown` because it is somebody else's JSON. Narrowed once,
    for the two places that label a key with it. */
const currencyOf = (data: unknown): string => {
  const currency = (data as { currency?: unknown } | null)?.currency;
  return typeof currency === "string" ? currency : "";
};

/** One page of history, or null where the broker refused it. Null
    and an empty list are different answers and the dashboard draws
    them differently: nothing yet, against could not ask. */
const itemsOf = (answer: BrokerAnswer): unknown[] | null => {
  if (answer.status !== 200) return null;
  const items = (answer.data as { items?: unknown } | null)?.items;
  return Array.isArray(items) ? items : [];
};

/* The snapshot behind the public page is refreshed at most this
   often. The broker allows one summary call every five seconds;
   five minutes is two orders of magnitude inside that, and a
   public page does not need to tick. */
const SNAPSHOT_SECONDS = 300;

/* A reader's own numbers: fresh within a minute, history within
   ten. Both far inside the published per-account limits even with
   two devices open. */
const LIVE_SECONDS = 60;
const HISTORY_SECONDS = 600;

const SNAPSHOT_KEY = "broker-snapshot";
const SITE_KEY_KEY = "broker-site-key";
const VIEW_KEY = "broker-view";

const safeEnv = (value: unknown): BrokerEnvName =>
  (isBrokerEnv(value) ? value : "live");

/* ---------- the site's own key ---------- */

async function siteKey(
  env: BrokerRouteEnv, d1: D1Database | null,
): Promise<SiteKey | null> {
  if (env.T212_PUBLIC_TOKEN) {
    return { key: env.T212_PUBLIC_TOKEN, env: "live", source: "secret" };
  }
  if (!d1 || !canSeal(env)) return null;
  const row = await setting(d1, SITE_KEY_KEY);
  if (!row) return null;
  const stored = JSON.parse(row) as { cipher?: string; env?: unknown };
  if (!stored.cipher) return null;
  const key = await unseal(env, stored.cipher);
  return key ? { key, env: safeEnv(stored.env), source: "saved" } : null;
}

/* ---------- the site snapshot ---------- */

async function fetchSnapshot(sk: { key: string; env: BrokerEnvName }): Promise<SnapshotResult> {
  const summary = await t212(sk.key, "/equity/account/summary", sk.env);
  if (summary.status !== 200) return { error: brokerFail(summary.status) };
  const positions = await t212(sk.key, "/equity/positions", sk.env);
  if (positions.status !== 200) return { error: brokerFail(positions.status) };
  return {
    at: nowISO(),
    summary: summary.data,
    positions: positions.data,
  };
}

/** The stored snapshot, refreshed when stale. Stale is served
    while the refresh runs in the background, because a public
    page would rather be five minutes old than slow, and a broker
    hiccup should never take the page down. */
async function snapshot(
  env: BrokerRouteEnv, d1: D1Database,
  waitUntil: (promise: Promise<unknown>) => void,
  { force = false }: { force?: boolean } = {},
): Promise<StoredSnapshot | null> {
  const raw = await setting(d1, SNAPSHOT_KEY);
  const held = raw ? JSON.parse(raw) as StoredSnapshot : null;
  const age = held ? Date.now() - Date.parse(held.at) : Infinity;

  if (held && !force && age < SNAPSHOT_SECONDS * 1000) return held;

  const sk = await siteKey(env, d1);
  if (!sk) return held;

  const refresh = async (): Promise<StoredSnapshot | null> => {
    const fresh = await fetchSnapshot(sk);
    if (failed(fresh)) return null;
    await setSetting(d1, SNAPSHOT_KEY, JSON.stringify(fresh));
    return fresh;
  };

  if (held && !force) {
    waitUntil(refresh());
    return held;
  }
  return (await refresh()) ?? held;
}

async function viewConfig(d1: D1Database | null): Promise<typeof DEFAULT_VIEW> {
  const raw = d1 ? await setting(d1, VIEW_KEY) : null;
  return { ...DEFAULT_VIEW, ...(raw ? JSON.parse(raw) as ViewSettings : {}) };
}

/* ---------- a reader's key, from either place ---------- */

/** A reader's key, from the header they pasted it into or from
    their account. `stale` is the third answer and not an error: a
    row sealed under a rotated secret is one they have to save
    again, which the dashboard says in those words. */
type ReaderKey =
  | { stale?: false; key: string; env: BrokerEnvName; saved: boolean }
  | { stale: true };

async function readerKey(
  env: BrokerRouteEnv, request: Request,
): Promise<ReaderKey | null> {
  const pasted = str(request.headers.get("x-broker-key") ?? "", 200);
  if (pasted) {
    return { key: pasted, env: safeEnv(request.headers.get("x-broker-env")), saved: false };
  }
  if (!canSeal(env)) return null;
  const row = await savedKeyRow(env, request);
  if (!row) return null;
  const key = await unseal(env, row.cipher);
  return key ? { key, env: safeEnv(row.env), saved: true } : { stale: true };
}

/* ============================================================ */

export async function onRequest(
  context: RouteContext<BrokerRouteEnv, { route?: string[] }>,
): Promise<Response> {
  const { request, env, params } = context;
  const route = (params.route ?? []).join("/");
  const d1 = await db(env);

  /* The one route a stranger may call. */
  if (route === "public" || route === "") {
    return methods(request, {
      GET: async () => {
        if (!d1) return notConfigured();
        const held = await snapshot(env, d1, context.waitUntil);
        if (!held) return fail("not-configured", 503, {
          message: "No site key is set. An admin can add one on the dashboard.",
        });
        return ok({ portfolio: publicView(held, await viewConfig(d1)) });
      },
    });
  }

  /* Everything below is somebody signed in. */
  let reader: Awaited<ReturnType<typeof readerFrom>>;
  try {
    reader = await readerFrom(request, env);
  } catch (err) {
    return fail("bad-token", 401, {
      message: String(err instanceof Error ? err.message : err),
    });
  }
  if (!reader) return fail("sign-in-required", 401);

  const admin = await isAdmin(env, request, reader.id);

  switch (route) {
    case "me":
      return methods(request, {
        GET: async () => {
          const row = canSeal(env) ? await savedKeyRow(env, request) : null;
          return ok({
            admin,
            sealing: canSeal(env),
            saved: row
              ? { label: row.label, env: safeEnv(row.env), updatedAt: row.updated_at }
              : null,
            publicConfigured: Boolean(await siteKey(env, d1)),
          });
        },
      });

    case "key":
      return methods(request, {
        PUT: async () => {
          if (await throttle(context, "broker-write", 20, 60)) {
            return fail("too-many", 429);
          }
          if (!canSeal(env)) return fail("not-configured", 503, {
            message: "Saving keys is off until BROKER_TOKEN_KEY is set. "
              + "You can still use a key for this session only.",
          });
          const input = await body(request);
          const key = str(input.key, 200);
          const brokerEnv = safeEnv(input.env);
          if (key.length < 16) return fail("bad-key", 400);

          /* Proven against the broker before it is kept: a saved
             key that never worked is a dashboard that fails next
             week for no visible reason. */
          const probe = await t212(key, "/equity/account/summary", brokerEnv);
          if (probe.status !== 200) {
            const [reason, status] = brokerFail(probe.status);
            return fail(reason, status);
          }

          const stored = await saveKeyRow(env, request, {
            cipher: await seal(env, key),
            label: str(input.label, 40) || `Trading 212 (${currencyOf(probe.data) || "?"})`,
            env: brokerEnv,
          });
          if (!stored) return fail("not-saved", 502);
          return ok({ currency: currencyOf(probe.data) });
        },
        DELETE: async () => {
          const gone = await deleteKeyRow(env, request, reader.id);
          return gone ? ok({}) : fail("not-deleted", 502);
        },
      });

    case "live":
      return methods(request, {
        GET: async () => {
          if (await throttle(context, "broker-read", 120, 15)) {
            return fail("too-many", 429);
          }
          const rk = await readerKey(env, request);
          if (!rk) return fail("no-key", 428);
          if (rk.stale) return fail("stale-key", 428, {
            message: "The saved key cannot be opened any more. Save it again.",
          });

          const name = await hashOf(`${rk.key}|${rk.env}|live`);
          const held = await cacheGet(name);
          if (held) return ok({ account: held, cached: true });

          const summary = await t212(rk.key, "/equity/account/summary", rk.env);
          if (summary.status !== 200) {
            const [reason, status] = brokerFail(summary.status);
            return fail(reason, status);
          }
          const positions = await t212(rk.key, "/equity/positions", rk.env);
          if (positions.status !== 200) {
            const [reason, status] = brokerFail(positions.status);
            return fail(reason, status);
          }
          const account = {
            at: nowISO(),
            summary: summary.data,
            positions: positions.data,
          };
          await cachePut(name, account, LIVE_SECONDS, context.waitUntil);
          return ok({ account });
        },
      });

    case "history":
      return methods(request, {
        GET: async () => {
          if (await throttle(context, "broker-read", 120, 15)) {
            return fail("too-many", 429);
          }
          const rk = await readerKey(env, request);
          if (!rk || rk.stale) return fail("no-key", 428);

          const name = await hashOf(`${rk.key}|${rk.env}|history`);
          const held = await cacheGet(name);
          if (held) return ok({ history: held, cached: true });

          /* One page of each, largest the broker allows. Three
             calls against three separate six-a-minute limits. */
          const [dividends, orders, transactions] = await Promise.all([
            t212(rk.key, "/equity/history/dividends?limit=50", rk.env),
            t212(rk.key, "/equity/history/orders?limit=50", rk.env),
            t212(rk.key, "/equity/history/transactions?limit=50", rk.env),
          ]);
          const history = {
            at: nowISO(),
            dividends: itemsOf(dividends),
            orders: itemsOf(orders),
            transactions: itemsOf(transactions),
          };
          await cachePut(name, history, HISTORY_SECONDS, context.waitUntil);
          return ok({ history });
        },
      });

    default:
      break;
  }

  /* ---------- the admin's half ---------- */

  if (!admin) return fail("admins-only", 403);

  switch (route) {
    case "site":
      return methods(request, {
        GET: async () => {
          if (!d1) return notConfigured();
          const held = await snapshot(env, d1, context.waitUntil);
          const sk = await siteKey(env, d1);
          return ok({
            snapshot: held ?? null,
            view: await viewConfig(d1),
            source: sk?.source ?? null,
          });
        },
      });

    case "refresh":
      return methods(request, {
        POST: async () => {
          if (!d1) return notConfigured();
          const held = await snapshot(env, d1, context.waitUntil, { force: true });
          if (!held) return fail("not-configured", 503);
          return ok({ at: held.at });
        },
      });

    case "view":
      return methods(request, {
        PUT: async () => {
          if (!d1) return notConfigured();
          const input = await body(request);
          const view = {
            holdings: Boolean(input.holdings ?? DEFAULT_VIEW.holdings),
            names: Boolean(input.names ?? DEFAULT_VIEW.names),
            returns: Boolean(input.returns ?? DEFAULT_VIEW.returns),
            max: Math.max(1, Math.min(100, Number(input.max) || DEFAULT_VIEW.max)),
          };
          await setSetting(d1, VIEW_KEY, JSON.stringify(view));
          return ok({ view });
        },
      });

    case "site-key":
      return methods(request, {
        PUT: async () => {
          if (!d1) return notConfigured();
          if (!canSeal(env)) return fail("not-configured", 503, {
            message: "Set BROKER_TOKEN_KEY first: the site key is only ever stored sealed.",
          });
          const input = await body(request);
          const key = str(input.key, 200);
          const brokerEnv = safeEnv(input.env);
          if (key.length < 16) return fail("bad-key", 400);

          const probe = await t212(key, "/equity/account/summary", brokerEnv);
          if (probe.status !== 200) {
            const [reason, status] = brokerFail(probe.status);
            return fail(reason, status);
          }
          await setSetting(d1, SITE_KEY_KEY, JSON.stringify({
            cipher: await seal(env, key),
            env: brokerEnv,
          }));
          /* The old snapshot came from the old key. */
          const fresh = await fetchSnapshot({ key, env: brokerEnv });
          await setSetting(d1, SNAPSHOT_KEY, failed(fresh) ? "" : JSON.stringify(fresh));
          return ok({ currency: currencyOf(probe.data) });
        },
        DELETE: async () => {
          if (!d1) return notConfigured();
          await setSetting(d1, SITE_KEY_KEY, "");
          await setSetting(d1, SNAPSHOT_KEY, "");
          return ok({});
        },
      });

    default:
      return fail("no-such-route", 404);
  }
}
