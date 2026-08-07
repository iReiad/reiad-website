/* ============================================================
   api.js — the browser's side of the dynamic layer.

   One rule governs this whole file: if the backend isn't there,
   nothing breaks. Every call returns null instead of throwing,
   and every caller has a static fallback. That means the site
   works exactly as it does today until the database is created,
   and starts doing more the moment it is — with no second
   version of the site to maintain in the meantime.
   ============================================================ */

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
    if (!data) return null;
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

/* ---------- admin ---------- */
export const auth = {
  me: () => api("auth/me"),
  setup: (password) => api("auth/setup", { method: "POST", body: { password } }),
  login: (password) => api("auth/login", { method: "POST", body: { password } }),
  logout: () => api("auth/logout", { method: "POST" }),
};

/** Count a page view. Fire-and-forget: the reader never waits for it,
    and what's recorded is a path and a date — nothing else. */
export function countView(path = location.pathname) {
  // Don't count the author reading their own drafts, or a dev server.
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
  api("signals/view", { method: "POST", body: { path }, timeout: 3000 });
}
