/* ============================================================
   _lib/broker.js: talking to Trading 212, and keeping its keys.

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

const BASES = {
  live: "https://live.trading212.com/api/v0",
  demo: "https://demo.trading212.com/api/v0",
};

export const BROKER_ENVS = ["live", "demo"];

/** A key with a colon is a key:secret pair (HTTP Basic); a key
    without one is the legacy kind, sent bare. */
const authHeader = (key) =>
  key.includes(":") ? `Basic ${btoa(key)}` : key;

/**
 * One call to the broker. Returns { status, data } and never
 * throws on an HTTP error: 401 and 429 are answers the caller
 * has to tell apart, not exceptions.
 */
export async function t212(key, path, brokerEnv = "live") {
  const base = BASES[brokerEnv] ?? BASES.live;
  let res;
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
    route answers the same words for the same failure. */
export function brokerFail(status) {
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

async function aesKey(secret) {
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(secret));
  return crypto.subtle.importKey(
    "raw", digest, { name: "AES-GCM" }, false, ["encrypt", "decrypt"]);
}

const toB64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

export const canSeal = (env) => Boolean(env.BROKER_TOKEN_KEY);

export async function seal(env, plain) {
  const key = await aesKey(env.BROKER_TOKEN_KEY);
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
export async function unseal(env, sealed) {
  try {
    const key = await aesKey(env.BROKER_TOKEN_KEY);
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

const REST_HEADERS = (env, bearer) => ({
  apikey: env.SUPABASE_KEY,
  Authorization: bearer,
  "Content-Type": "application/json",
});

const bearerOf = (request) => request.headers.get("Authorization") ?? "";

export async function savedKeyRow(env, request) {
  if (!env.SUPABASE_KEY) return null;
  const res = await fetch(
    `${env.SUPABASE_URL}/rest/v1/broker_tokens`
      + `?select=cipher,label,env,updated_at&limit=1`,
    { headers: REST_HEADERS(env, bearerOf(request)) });
  if (!res.ok) return null;
  const rows = await res.json().catch(() => null);
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

export async function saveKeyRow(env, request, row) {
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

export async function deleteKeyRow(env, request, readerId) {
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

const pct = (part, whole) =>
  whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0;

/** "AAPL_US_EQ" is an internal id; "AAPL" is what a reader
    recognises. */
const displayTicker = (ticker) => String(ticker ?? "").split("_")[0];

export function publicView(snapshot, view) {
  const v = { ...DEFAULT_VIEW, ...(view ?? {}) };
  const summary = snapshot.summary ?? {};
  const positions = Array.isArray(snapshot.positions) ? snapshot.positions : [];

  const invested = summary.investments?.currentValue ?? 0;
  const cost = summary.investments?.totalCost ?? 0;
  const unrealised = summary.investments?.unrealizedProfitLoss ?? 0;
  const total = summary.totalValue ?? 0;

  const out = {
    at: snapshot.at,
    count: positions.length,
    investedPct: pct(invested, total),
    cashPct: total > 0 ? Math.round((100 - (invested / total) * 100) * 10) / 10 : 0,
    returnPct: pct(unrealised, cost),
    holdings: null,
  };

  if (v.holdings) {
    const rows = positions
      .map((p, i) => {
        const value = p.walletImpact?.currentValue ?? 0;
        const paid = p.walletImpact?.totalCost ?? 0;
        const gain = p.walletImpact?.unrealizedProfitLoss ?? 0;
        return {
          name: v.names ? String(p.instrument?.name ?? "").slice(0, 60) : `Holding ${i + 1}`,
          ticker: v.names ? displayTicker(p.instrument?.ticker) : "",
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

export async function cacheGet(name) {
  const hit = await caches.default.match(`https://broker-cache.invalid/${name}`);
  if (!hit) return null;
  return hit.json().catch(() => null);
}

export async function cachePut(name, data, seconds, waitUntil) {
  const stored = new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `max-age=${seconds}`,
    },
  });
  waitUntil(caches.default.put(`https://broker-cache.invalid/${name}`, stored));
}

export async function hashOf(text) {
  const digest = await crypto.subtle.digest(
    "SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
