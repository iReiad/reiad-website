/* ============================================================
   _lib/broker.ts: talking to Trading 212, and keeping its keys.

   The dashboard at /tools/live never speaks to the broker
   itself, for three reasons that all point the same way. The
   browser's CSP does not allow the host and should not: an API
   key in a page is an API key in every extension and every bit
   of injected script on that page. Trading 212 does not answer
   cross-origin calls anyway. And the rate limits are per broker
   ACCOUNT, so the one place that can meter requests honestly is
   the one place they all pass through. So the Worker is the only
   caller, and this file is the whole of what it knows.

   ---- the two shapes of key ----

   Trading 212 issued single opaque keys first, sent bare in the
   Authorization header, and issues key:secret pairs now, sent as
   HTTP Basic. Both kinds are live in the wild and both work
   against the same endpoints, so the split is decided by the key
   itself: a colon means a pair, no colon means legacy. Nobody
   has to know which kind they were given.

   ---- what is stored, and how ----

   A reader's key is stored in Supabase under row-level security,
   but never as the reader typed it: the Worker seals it with
   AES-GCM under BROKER_TOKEN_KEY (a wrangler secret) before the
   row is written, and unseals it on the way to the broker. The
   row's owner can read their own row back, and what they get is
   ciphertext that only this Worker can open. Losing the database
   does not lose the keys; losing the secret only forces everyone
   to paste theirs in again.

   Without the secret, nothing stores anything: the save button
   answers not-configured and the paste-it-per-session path keeps
   working, because a feature that silently stored keys in the
   clear would be worse than one that asks twice.
   ============================================================ */

/** Which of the broker's two worlds. A reader's saved row carries
    one of these strings, so it is a union rather than a `string`:
    a typo in a column would otherwise route a live account's key
    at the demo API and answer 401. */
export type BrokerEnvName = "live" | "demo";

const BASES: Record<BrokerEnvName, string> = {
  live: "https://live.trading212.com/api/v0",
  demo: "https://demo.trading212.com/api/v0",
};

export const BROKER_ENVS: BrokerEnvName[] = ["live", "demo"];

export const isBrokerEnv = (value: unknown): value is BrokerEnvName =>
  value === "live" || value === "demo";

/** What one call to the broker came back as. `data` is `unknown`
    because it is somebody else's JSON: every reader of it narrows,
    which is the whole reason none of the shapes below is asserted. */
export interface BrokerAnswer {
  status: number;
  data: unknown;
}

/** A key with a colon is a key:secret pair (HTTP Basic); a key
    without one is the legacy kind, sent bare. */
const authHeader = (key: string): string =>
  key.includes(":") ? `Basic ${btoa(key)}` : key;

/**
 * One call to the broker. Returns { status, data } and never
 * throws on an HTTP error: 401 and 429 are answers the caller
 * has to tell apart, not exceptions.
 */
export async function t212(
  key: string, path: string, brokerEnv: string = "live",
): Promise<BrokerAnswer> {
  const base = isBrokerEnv(brokerEnv) ? BASES[brokerEnv] : BASES.live;
  let res: Response;
  try {
    res = await fetch(`${base}${path}`, {
      headers: { Authorization: authHeader(key.trim()) },
      signal: AbortSignal.timeout(12_000),
    });
  } catch {
    return { status: 0, data: null };
  }
  const data = await res.json().catch(() => null);
  return { status: res.status, data };
}

/** The broker's own error statuses, translated once so every
    route answers the same words for the same failure. A tuple
    rather than an object because both routes spread it straight
    into `fail(reason, status)`. */
export function brokerFail(status: number): [string, number] {
  if (status === 401 || status === 403) return ["bad-key", 401];
  if (status === 429) return ["rate-limited", 429];
  if (status === 0) return ["broker-unreachable", 502];
  return ["broker-error", 502];
}

/* ---------- sealing a key ----------

   AES-GCM under a key derived from the BROKER_TOKEN_KEY secret by
   SHA-256, so the secret can be any string long enough to be a
   secret rather than exactly 32 bytes of base64. The IV rides in
   front of the ciphertext; GCM authenticates, so a wrong secret
   or a tampered row fails loudly instead of decrypting to junk. */

/** The secret that seals a reader's key. Its absence is a working
    state rather than a broken one: nothing is stored, and the
    paste-it-per-session path is all there is. */
export interface SealEnv {
  BROKER_TOKEN_KEY?: string;
}

async function aesKey(secret: string): Promise<CryptoKey> {
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey(
    "raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

const toB64 = (bytes: ArrayBuffer | Uint8Array): string =>
  btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromB64 = (s: string): Uint8Array<ArrayBuffer> =>
  Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export const canSeal = (env: SealEnv): boolean => Boolean(env.BROKER_TOKEN_KEY);

/** Callers check `canSeal` first, which is what makes the secret a
    `string` here rather than a branch inside every one of these. */
export async function seal(env: SealEnv, plain: string): Promise<string> {
  const key = await aesKey(env.BROKER_TOKEN_KEY ?? "");
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const cipher = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv }, key, new TextEncoder().encode(plain));
  const out = new Uint8Array(iv.length + cipher.byteLength);
  out.set(iv);
  out.set(new Uint8Array(cipher), iv.length);
  return toB64(out);
}

/** Null on any failure: a row sealed under a rotated secret is a
    row the reader has to replace, not a crash. */
export async function unseal(env: SealEnv, sealed: string): Promise<string | null> {
  try {
    const key = await aesKey(env.BROKER_TOKEN_KEY ?? "");
    const bytes = fromB64(sealed);
    const plain = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: bytes.slice(0, 12) }, key, bytes.slice(12));
    return new TextDecoder().decode(plain);
  } catch {
    return null;
  }
}

/* ---------- the reader's saved key, in Supabase ----------

   The Worker holds no service key, deliberately, so it reads and
   writes broker_tokens the only way it can: as the reader, with
   the same bearer token that proved who they are. Row-level
   security does the scoping, and there is no code path that
   could touch another reader's row because there is no
   credential that could. */

/** Supabase, read and written AS THE READER. No service key is
    held anywhere in this Worker and this table is not a reason to
    start: row-level security does the scoping, and there is no
    credential here that could reach another reader's row. */
export interface BrokerStoreEnv {
  SUPABASE_URL?: string;
  SUPABASE_KEY?: string;
}

/** One row of `public.broker_tokens`, as the four columns the
    select below names. `cipher` is what `unseal` opens; nothing
    else in this repository ever sees the key in the clear. */
export interface SavedKeyRow {
  cipher: string;
  label?: string;
  env?: BrokerEnvName;
  updated_at?: string;
}

const REST_HEADERS = (env: BrokerStoreEnv, bearer: string): Record<string, string> => ({
  apikey: env.SUPABASE_KEY ?? "",
  Authorization: bearer,
  "Content-Type": "application/json",
});

const bearerOf = (request: Request): string =>
  request.headers.get("Authorization") ?? "";

export async function savedKeyRow(
  env: BrokerStoreEnv, request: Request,
): Promise<SavedKeyRow | null> {
  if (!env.SUPABASE_KEY) return null;
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/broker_tokens`
      + `?select=cipher,label,env,updated_at&limit=1`,
    { headers: REST_HEADERS(env, bearerOf(request)) });
  if (!res.ok) return null;
  const rows = await res.json().catch(() => null) as SavedKeyRow[] | null;
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

export async function saveKeyRow(
  env: BrokerStoreEnv, request: Request, row: Record<string, unknown>,
): Promise<boolean> {
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/broker_tokens?on_conflict=user_id`,
    {
      method: "POST",
      headers: {
        ...REST_HEADERS(env, bearerOf(request)),
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify(row),
    });
  return res.ok;
}

export async function deleteKeyRow(
  env: BrokerStoreEnv, request: Request, readerId: string,
): Promise<boolean> {
  /* The filter names the row RLS would have scoped anyway, on the
     same belt-and-braces grounds account.js filters its own
     profile updates. */
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/broker_tokens?user_id=eq.${readerId}`,
    { method: "DELETE", headers: REST_HEADERS(env, bearerOf(request)) });
  return res.ok;
}

/* ---------- the public view ----------

   The site's own portfolio, with every absolute number removed.
   Percentages only: a weight, a return, a split between cash and
   holdings. Weights are shares of the same whole, so nothing here
   can be worked backwards into a balance. What the list shows is
   the admin's choice, stored under `broker-view` in settings. */

/** What is stored: the moment it was taken, and the broker's two
    answers exactly as they arrived.

    `summary` and `positions` are `unknown` ON PURPOSE and must
    stay so. They are somebody else's JSON, they carry a great deal
    more than the six numbers `publicView` reads, and the admin
    dashboard is served the whole of them: narrowing here into the
    fields this file happens to use would silently drop the rest on
    the way through storage. The narrowing belongs at the one place
    that reads a number out, which is `publicView` below. */
export interface BrokerSnapshot {
  at?: string;
  summary?: unknown;
  positions?: unknown;
}

/** What an admin has decided a stranger may see, stored under
    `broker-view` in settings. Partial because a stored row written
    before a field existed is a row that has to keep working. */
export type ViewSettings = Partial<typeof DEFAULT_VIEW>;

/** One line of the public list. `returnPct` is null where the admin
    has switched returns off, which is not the same as a return of
    zero and is why it is not folded into a number. */
export interface PublicHolding {
  name: string;
  ticker: string;
  weightPct: number;
  returnPct: number | null;
}

/** The site's own portfolio with every absolute number gone.
    `holdings` is null where the admin has switched the list off. */
export interface PublicPortfolio {
  at?: string;
  count: number;
  investedPct: number;
  cashPct: number;
  returnPct: number;
  holdings: PublicHolding[] | null;
}

export const DEFAULT_VIEW = {
  /* Show the holdings list at all. */
  holdings: true,
  /* Name the instruments, or number them. */
  names: true,
  /* Show each holding's own return percentage. */
  returns: true,
  /* At most this many rows, largest first. */
  max: 30,
};

const pct = (part: number, whole: number): number =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;

/** "AAPL_US_EQ" is an internal id; "AAPL" is what a reader
    recognises. */
const displayTicker = (ticker: unknown): string =>
  String(ticker ?? "").split("_")[0];

/* Reading somebody else's JSON, one field at a time. A field that
   stops being sent, or arrives as a string, becomes 0 rather than
   NaN or a throw: this is a public page and a broker that changes
   a name must not take it down. The names are Trading 212's,
   including `unrealizedProfitLoss`, spelt the American way at the
   source and not ours to correct. */
const obj = (value: unknown): Record<string, unknown> =>
  (value && typeof value === "object" ? value as Record<string, unknown> : {});
const num = (value: unknown): number =>
  (typeof value === "number" && Number.isFinite(value) ? value : 0);

export function publicView(
  snapshot: BrokerSnapshot, view: ViewSettings | null | undefined,
): PublicPortfolio {
  const v = { ...DEFAULT_VIEW, ...(view ?? {}) };
  const summary = obj(snapshot.summary);
  const positions = Array.isArray(snapshot.positions) ? snapshot.positions : [];
  const investments = obj(summary.investments);

  const invested = num(investments.currentValue);
  const cost = num(investments.totalCost);
  const unrealised = num(investments.unrealizedProfitLoss);
  const total = num(summary.totalValue);

  const out: PublicPortfolio = {
    at: snapshot.at,
    count: positions.length,
    investedPct: pct(invested, total),
    cashPct: total > 0 ? Math.round((100 - (invested / total) * 100) * 10) / 10 : 0,
    returnPct: pct(unrealised, cost),
    holdings: null,
  };

  if (v.holdings) {
    const rows = positions
      .map((position, i) => {
        const wallet = obj(obj(position).walletImpact);
        const instrument = obj(obj(position).instrument);
        const value = num(wallet.currentValue);
        const paid = num(wallet.totalCost);
        const gain = num(wallet.unrealizedProfitLoss);
        return {
          name: v.names ? String(instrument.name ?? "").slice(0, 60) : `Holding ${i + 1}`,
          ticker: v.names ? displayTicker(instrument.ticker) : "",
          weightPct: pct(value, invested),
          returnPct: v.returns ? pct(gain, paid) : null,
        };
      })
      .sort((a, b) => b.weightPct - a.weightPct)
      .slice(0, Math.max(1, Math.min(100, v.max)));
    /* Numbered holdings are numbered by size, not by whatever
       order the broker answered in, or the numbers change between
       refreshes and look like trades that never happened. */
    if (!v.names) rows.forEach((r, i) => { r.name = `Holding ${i + 1}`; });
    out.holdings = rows;
  }

  return out;
}

/* ---------- edge cache for a signed-in reader's own data ----------

   Keyed by a hash of the KEY rather than of the reader, so
   changing the key is what empties the cache, and two devices on
   one account share a window. Sixty seconds for the live numbers
   and ten minutes for history is far inside every limit the
   broker publishes, and fresh enough that nobody watching a
   portfolio can tell the difference. */

export async function cacheGet(name: string): Promise<unknown> {
  const hit = await caches.default.match(`https://broker-cache.invalid/${name}`);
  if (!hit) return null;
  return hit.json().catch(() => null);
}

export async function cachePut(
  name: string, data: unknown, seconds: number,
  waitUntil: (promise: Promise<unknown>) => void,
): Promise<void> {
  const stored = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `max-age=${seconds}`,
    },
  });
  waitUntil(caches.default.put(`https://broker-cache.invalid/${name}`, stored));
}

export async function hashOf(text: string): Promise<string> {
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
