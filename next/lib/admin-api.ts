/* ============================================================
   lib/admin-api.ts: the passphrase half's endpoints, once.

   Every call here goes to a route gated by `requireAdmin()` in
   `functions/_lib/auth.ts`, which is the session cookie the Studio
   sets. The cookie is httpOnly, so nothing in the browser can read
   it and nothing here tries: the fetch carries it because it is
   same-origin, and a 401 is how a panel finds out it is not held.

   `null` on a network failure, and the reply on anything the
   endpoint answered, INCLUDING a refusal. The two are different
   and every caller tells them apart: an endpoint that said no is
   working, and one that did not answer is not.
   ============================================================ */

export interface Reply {
  ok?: boolean;
  reason?: string;
  status: number;
}

export interface AdminFetch<T> extends Reply {
  data: T | null;
}

/** One call. The status comes back on the object rather than as a
    throw, because 401 is an answer this half of the panel is
    written around. */
export async function adminCall<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<AdminFetch<T>> {
  try {
    const res = await fetch(`/api/${path}`, {
      method: options.method ?? "GET",
      headers: options.body
        ? { "Content-Type": "application/json", accept: "application/json" }
        : { accept: "application/json" },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const data = await res.json().catch(() => null) as (T & Reply) | null;
    return { status: res.status, ok: res.ok && data?.ok !== false, data };
  } catch {
    /* Status 0 is "the request never landed", which is the one
       state the caller must not read as a refusal. */
    return { status: 0, ok: false, data: null };
  }
}

/** 401 is the passphrase, 403 a session without the right. Both
    read the same to somebody looking at a panel, and neither is an
    error worth painting red. */
export const isLocked = (r: Reply): boolean => r.status === 401 || r.status === 403;
