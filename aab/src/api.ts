/* api.ts: the browser's side of the dynamic layer. Every call
   answers null rather than throwing and every caller has a static
   fallback, so the site works with no backend at all. `api()`
   answers `unknown` rather than `any` so the named calls below
   have to narrow it. Edit this; `aab/api.js` beside it is built,
   and `build-modules.ts --check` fails if the output is edited. */

import { whenActivated } from "/activation.js";

const JSON_HEADERS = { "Content-Type": "application/json" };

/** What every endpoint on this site answers with, at minimum.

    `_lib/http.ts` writes `{ ok: true, ... }` or
    `{ ok: false, reason }`, and `status` is added below so a
    caller can tell a 404 from a 400 without a second argument. */
export interface ApiReply {
  ok?: boolean;
  reason?: string;
  status?: number;
  [key: string]: unknown;
}

/** How many of each reaction a piece has. */
export type Counts = Record<string, number>;

export interface ApiOptions {
  method?: string;
  body?: unknown;
  timeout?: number;
}

/** null means "not available", never an exception to handle. */
export async function api(
  path: string, { method = "GET", body, timeout = 8000 }: ApiOptions = {},
): Promise<ApiReply | null> {
  try {
    const res = await fetch(`/api/${path}`, {
      method,
      headers: body ? JSON_HEADERS : undefined,
      body: body ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      signal: AbortSignal.timeout(timeout),
    });

    // 503 not-configured is the expected answer on a site whose
    // database hasn't been created yet. Treat it as "no backend".
    if (res.status === 503) return null;

    const data = await res.json().catch(() => null);

    // A reply that isn't JSON is Cloudflare's own error page, not
    // ours, a Worker that ran out of CPU or memory, most often.
    // Returning null here would report it as "no backend", which is
    // how a 30ms password hash spent a while looking like a network
    // fault. Say what it actually was instead.
    if (!data) return { ok: false, reason: "server-error", status: res.status };

    return { ...data, status: res.status };
  } catch {
    return null;
  }
}

/** Is the dynamic layer live? Asked once per page, then cached. */
let backendPromise: Promise<boolean> | undefined;
export function backendReady(): Promise<boolean> {
  backendPromise ??= api("auth/me").then((r) => !!r?.ok);
  return backendPromise;
}

/* ---------- reading ---------- */
/* Asked for by the cards and by the Ctrl+K index, which are on
   different code paths and often the same page. Cached for the life
   of the page so that is one request, not two. */
let articlesPromise: Promise<unknown[] | null> | undefined;
export const getArticles = (): Promise<unknown[] | null> => {
  articlesPromise ??= api("articles").then((r) => (r?.articles as unknown[]) ?? null);
  return articlesPromise;
};
export const getArticle = async (slug: string): Promise<unknown | null> =>
  (await api(`articles/${slug}`))?.article ?? null;
export const getQuestions = async (slug: string): Promise<unknown[] | null> =>
  ((await api(`questions?slug=${encodeURIComponent(slug)}`))?.questions as unknown[]) ?? null;
export const search = async (q: string): Promise<unknown[] | null> =>
  ((await api(`search?q=${encodeURIComponent(q)}`))?.results as unknown[]) ?? null;

/* ---------- writing ---------- */
export const ask = (payload: unknown) => api("questions", { method: "POST", body: payload });
export const subscribe = (payload: unknown) =>
  api("subscribers", { method: "POST", body: payload });
export const sendEnquiry = (payload: unknown) =>
  api("enquiries", { method: "POST", body: payload });
export const react = (slug: string, kind: string) =>
  api("signals/react", { method: "POST", body: { slug, kind } });
export const reactions = async (slug: string): Promise<Counts | null> =>
  ((await api(`signals/react?slug=${encodeURIComponent(slug)}`))?.counts as Counts) ?? null;

/* ---------- media ----------
   Photos go up as raw bytes, not JSON: base64 would cost a third
   more on the wire for no reason, and the endpoint wants the
   content type in the header anyway. So this one can't go through
   api() above, which stringifies everything it's handed. */
export async function uploadMedia(
  blob: Blob, slug: string,
): Promise<{ url?: string } | null> {
  try {
    const res = await fetch(`/api/media?slug=${encodeURIComponent(slug)}`, {
      method: "POST",
      headers: { "Content-Type": blob.type },
      body: blob,
      credentials: "same-origin",
      signal: AbortSignal.timeout(60_000),
    });
    if (res.status === 503) return null;
    return await res.json().catch(() => null);
  } catch {
    return null;
  }
}

export const listMedia = (slug = ""): Promise<ApiReply | null> =>
  api(`media${slug ? `?slug=${encodeURIComponent(slug)}` : ""}`);

/* ---------- Notion ----------
   Importing a page fetches its whole block tree and can re-fetch
   for nested lists and tables, so it gets a long timeout. */
export const notion = {
  status: () => api("notion/status"),
  pages: (q = "") =>
    api(`notion/pages${q ? `?q=${encodeURIComponent(q)}` : ""}`, { timeout: 20_000 }),
  page: (id: string) => api(`notion/pages/${encodeURIComponent(id)}`, { timeout: 45_000 }),
};

/* ---------- admin ----------
   setup and login take a derived key, not a passphrase: the
   PBKDF2 runs in the browser because the free plan's 10ms of CPU
   per request cannot cover it. auth.js does the deriving. */
export const auth = {
  me: () => api("auth/me"),
  params: () => api("auth/params"),
  setup: (payload: unknown) => api("auth/setup", { method: "POST", body: payload }),
  login: (payload: unknown) => api("auth/login", { method: "POST", body: payload }),
  logout: () => api("auth/logout", { method: "POST" }),
};

/** Count a page view. Fire-and-forget: the reader never waits for it,
    and what's recorded is a path and a date, nothing else. */
export function countView(path: string = location.pathname): void {
  // Don't count the author reading their own drafts, or a dev server.
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
  // Don't count a hover. Speculation rules prerender a link on hover,
  // and a prerendered page runs this file, so every view counted here
  // was really "the pointer passed over a link". See /activation.js.
  whenActivated(() =>
    api("signals/view", { method: "POST", body: { path }, timeout: 3000 })
  );
}
