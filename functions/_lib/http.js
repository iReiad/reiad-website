/* ============================================================
   _lib/http.js: the small conveniences every endpoint wants.

   Anything under functions/ whose name starts with an underscore
   is not routed, so this is a plain module, not a URL.
   ============================================================ */

const SECURITY = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
  // The API is same-origin only. No CORS headers on purpose:
  // nothing else should be calling this.
};

export const json = (data, status = 200, headers = {}) =>
  new Response(JSON.stringify(data), { status, headers: { ...SECURITY, ...headers } });

/* The headers argument matters: this is how Set-Cookie reaches the
   browser. It was missing once, and the effect was a login that
   reported success and silently issued no session at all. */
export const ok = (data = {}, headers = {}) => json({ ok: true, ...data }, 200, headers);

export const fail = (reason, status = 400, extra = {}) =>
  json({ ok: false, reason, ...extra }, status);

/** The database isn't bound yet, say so plainly so the front end
    can fall back to its static behaviour instead of erroring. */
export const notConfigured = () =>
  fail("not-configured", 503, {
    message: "This site's database isn't connected yet. See wrangler.toml.",
  });

/** Parse a JSON body without throwing on nonsense. */
export async function body(request) {
  try {
    const data = await request.json();
    return data && typeof data === "object" ? data : {};
  } catch {
    return {};
  }
}

/** Trim, cap and coerce to string: every field from the outside
    goes through this before it reaches SQL. */
export const str = (value, max = 2000) =>
  String(value ?? "").trim().slice(0, max);

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? "").trim());

export const nowISO = () => new Date().toISOString();
export const today = () => nowISO().slice(0, 10);

/** Route only the methods an endpoint actually implements. */
export function methods(request, handlers) {
  const handler = handlers[request.method];
  if (handler) return handler();
  return json(
    { ok: false, reason: "method-not-allowed" },
    405,
    { Allow: Object.keys(handlers).join(", ") }
  );
}
