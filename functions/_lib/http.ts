/* _lib/http.ts: the small conveniences every endpoint wants.

   An underscore-prefixed name under functions/ is not routed, so
   this is a module rather than a URL. */

/** The Pages Functions context, as `worker.js` rebuilds it.

    Nothing here has run on Pages Functions since Stage 10:
    `worker.js` is one Worker that routes by prefix and hands every
    handler an object of this shape. The name is kept because every
    handler's parameter is called `context` and the shape is the one
    Pages documented, so a reader arriving from that documentation
    is not misled by the difference.

    `Env` is a type parameter rather than one union of every binding
    this site has, and that is the point of it: a handler needing D1
    and a handler needing R2 are two different contracts, and a
    single type listing all of them as optional would describe
    neither. Each route names what it binds.

    `next()` is the fall-through to a static asset, which is what
    these handlers have always taken it to mean. */
export interface RouteContext<
  Env = unknown,
  Params = Record<string, string | string[] | undefined>,
> {
  request: Request;
  env: Env;
  params: Params;
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
  next(): Promise<Response>;
  data: Record<string, unknown>;
}

export type JSONValue =
  | string | number | boolean | null
  | JSONValue[] | { [key: string]: JSONValue };

const SECURITY: Record<string, string> = {
  "Content-Type": "application/json; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Cache-Control": "no-store",
  // The API is same-origin only. No CORS headers on purpose:
  // nothing else should be calling this.
};

export const json = (
  data: unknown, status = 200, headers: Record<string, string> = {},
): Response =>
  new Response(JSON.stringify(data), { status, headers: { ...SECURITY, ...headers } });

/* `headers` is how Set-Cookie reaches the browser. Dropping it
   gives a login that reports success and issues no session. */
/** `object` rather than `Record<string, unknown>`, which it was.
    The second requires an INDEX SIGNATURE, which an interface does
    not have, so every handler answering a declared shape (a sync
    report, a row, a snapshot) had to cast on the way through the
    commonest helper in this file. A cast at every call site is a
    cast nobody reads. All this needs is something `ok: true` can
    be spread on to. */
export const ok = (
  data: object = {}, headers: Record<string, string> = {},
): Response => json({ ok: true, ...data }, 200, headers);

export const fail = (
  reason: string, status = 400, extra: Record<string, unknown> = {},
): Response => json({ ok: false, reason, ...extra }, status);

/** No database binding yet. Said plainly so the front end falls
    back to its static behaviour rather than erroring. */
export const notConfigured = (): Response =>
  fail("not-configured", 503, {
    message: "This site's database isn't connected yet. See wrangler.toml.",
  });

/** Parse a JSON body without throwing on nonsense. */
export async function body(request: Request): Promise<Record<string, unknown>> {
  try {
    const data = await request.json() as unknown;
    return data && typeof data === "object" ? data as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

/** Trim, cap and coerce to string. Every field from the outside
    goes through this before it reaches SQL. */
export const str = (value: unknown, max = 2000): string =>
  String(value ?? "").trim().slice(0, max);

export const isEmail = (value: unknown): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value ?? "").trim());

export const nowISO = (): string => new Date().toISOString();
export const today = (): string => nowISO().slice(0, 10);

export type Handlers = Record<string, () => Response | Promise<Response>>;

/** Route only the methods an endpoint actually implements. */
export function methods(request: Request, handlers: Handlers): Response | Promise<Response> {
  const handler = handlers[request.method];
  if (handler) return handler();
  return json(
    { ok: false, reason: "method-not-allowed" },
    405,
    { Allow: Object.keys(handlers).join(", ") }
  );
}
