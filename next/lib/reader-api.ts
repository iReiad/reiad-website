/* ============================================================
   lib/reader-api.ts: the account half's endpoints, once.

   `admin-api.ts` is this file's twin and does the same job for
   the passphrase. The split is not tidiness: they are different
   credentials proving different things to different stores, and
   `components/admin/panel.tsx` opens with the reason at length.

   ---- the bug this exists for ----

   `readerFrom()` in `functions/_lib/reader.ts` reads ONE thing:
   an `Authorization: Bearer <jwt>` header. No header, no reader.
   No reader, and `isAdmin()` returns false before it consults
   either list.

   Four of the five callers on /admin used a plain `fetch`. So the
   Worker saw an anonymous request, `isAdmin()` said no, and:

   - `/api/routine/templates` answered an empty list, which is
     what it answers a non-admin BY DESIGN, so the account gate
     read "Not held" for the real admin on every device;
   - the courses, live-portfolio and routine panels each drew
     their own not-an-admin state, correctly, from an answer that
     was never going to be anything else.

   Nothing looked broken anywhere. Every panel was doing exactly
   what it should with the answer it got, and the answer was
   wrong before it left the browser.

   `people-panel.tsx` was the one that worked, because it happened
   to need a bearer for Supabase anyway and so wrote one out by
   hand. One correct copy and four wrong ones is what a missing
   shared seam looks like from the inside.

   ---- so: one place, and it is this one ----

   The token comes from `/account.js`, which is the only thing
   that holds a session, and it is fetched per call rather than
   cached: `token()` refreshes an access token that is about to
   expire, and a copy kept here would be the stale one.
   ============================================================ */

import { runtimeModule } from "../components/account/runtime";

type AccountModule = typeof import("/account.js");

export interface ReaderFetch<T> {
  /** 0 means the request never landed, exactly as in
      `admin-api.ts`. `signedOut` is not that, and not a refusal
      either: there was nobody to ask on behalf of. */
  status: number;
  ok: boolean;
  signedOut: boolean;
  data: T | null;
}

/** One call, carrying the reader's own bearer.

    Signed out is an ANSWER and not an error, because it is the
    common case on a page anybody can open: the caller draws "sign
    in" rather than "something went wrong". */
export async function readerCall<T>(
  path: string,
  options: { method?: string; body?: unknown } = {},
): Promise<ReaderFetch<T>> {
  try {
    const acc = await runtimeModule<AccountModule>("/account.js");
    if (!acc.current()) return { status: 0, ok: false, signedOut: true, data: null };

    const bearer = await acc.token();
    if (!bearer) return { status: 0, ok: false, signedOut: true, data: null };

    const res = await fetch(`/api/${path}`, {
      method: options.method ?? "GET",
      headers: {
        Authorization: `Bearer ${bearer}`,
        accept: "application/json",
        ...(options.body ? { "Content-Type": "application/json" } : {}),
      },
      body: options.body === undefined ? undefined : JSON.stringify(options.body),
    });
    const data = await res.json().catch(() => null) as (T & { ok?: boolean }) | null;
    return { status: res.status, ok: res.ok && data?.ok !== false, signedOut: false, data };
  } catch {
    /* `/account.js` is an `aab/` asset the Worker serves, so it is
       absent under a bare `next start` and can be absent for a
       moment on a bad connection. Either way the honest answer is
       that the request never landed. */
    return { status: 0, ok: false, signedOut: false, data: null };
  }
}
