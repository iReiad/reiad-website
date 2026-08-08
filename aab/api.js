/* ============================================================
   api.js — the browser's side of the dynamic layer.

   One rule governs this whole file: if the backend isn't there,
   nothing breaks. Every call returns null instead of throwing,
   and every caller has a static fallback. That means the site
   works exactly as it does today until the database is created,
   and starts doing more the moment it is — with no second
   version of the site to maintain in the meantime.
   ============================================================ */

import { whenActivated } from "/activation.js";

const JSON_HEADERS = { "Content-Type": "application/json" };

/** null means "not available" — never an exception to handle. */
export async function api(path, { method = "GET", body, timeout = 8000 } = {}) {
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
    // ours — a Worker that ran out of CPU or memory, most often.
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
let backendPromise;
export function backendReady() {
  backendPromise ??= api("auth/me").then((r) => !!r?.ok);
  return backendPromise;
}

/* ---------- reading ---------- */
export const getArticles = async () => (await api("articles"))?.articles ?? null;
export const getArticle = async (slug) => (await api(`articles/${slug}`))?.article ?? null;
export const getQuestions = async (slug) =>
  (await api(`questions?slug=${encodeURIComponent(slug)}`))?.questions ?? null;
export const search = async (q) =>
  (await api(`search?q=${encodeURIComponent(q)}`))?.results ?? null;

/* ---------- writing ---------- */
export const ask = (payload) => api("questions", { method: "POST", body: payload });
export const subscribe = (payload) => api("subscribers", { method: "POST", body: payload });
export const sendEnquiry = (payload) => api("enquiries", { method: "POST", body: payload });
export const react = (slug, kind) =>
  api("signals/react", { method: "POST", body: { slug, kind } });
export const reactions = async (slug) =>
  (await api(`signals/react?slug=${encodeURIComponent(slug)}`))?.counts ?? null;

/* ---------- admin ----------
   setup and login take a derived key, not a passphrase: the
   PBKDF2 runs in the browser because the free plan's 10ms of CPU
   per request cannot cover it. auth.js does the deriving. */
export const auth = {
  me: () => api("auth/me"),
  params: () => api("auth/params"),
  setup: (payload) => api("auth/setup", { method: "POST", body: payload }),
  login: (payload) => api("auth/login", { method: "POST", body: payload }),
  logout: () => api("auth/logout", { method: "POST" }),
};

/** Count a page view. Fire-and-forget: the reader never waits for it,
    and what's recorded is a path and a date — nothing else. */
export function countView(path = location.pathname) {
  // Don't count the author reading their own drafts, or a dev server.
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
  // Don't count a hover. Speculation rules prerender a link on hover,
  // and a prerendered page runs this file — so every view counted here
  // was really "the pointer passed over a link". See /activation.js.
  whenActivated(() =>
    api("signals/view", { method: "POST", body: { path }, timeout: 3000 })
  );
}
