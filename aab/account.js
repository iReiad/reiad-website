/* ============================================================
   account.js: who a reader is.

   NOT auth.js. That one guards the Studio and the desk, it is a
   cookie set by this site's own Worker, and there is exactly one
   person it will ever let in. This is the other thing entirely:
   ordinary readers, signing in to keep their progress and to leave
   a comment with a name on it. The two never meet, and neither
   grants anything the other does.

   ---- why there is no Supabase client library here ----

   The official one is about forty kilobytes and would have to be
   fetched from a CDN or bundled, and this site has no build step
   and loads no third-party JavaScript on a reading page. What it
   does for us is three POSTs and a redirect, which is what this
   file is. If that stops being true, if refresh rotation or MFA or
   anything else grows teeth, this is the moment to reconsider,
   and the whole surface is the six functions below.

   ---- what a session is ----

   Supabase hands back an access token (a JWT, short-lived) and a
   refresh token (long-lived). Both go in localStorage, which is
   where the official client puts them too. The access token is
   what a request to our own Worker will carry later, so the Worker
   can verify it against Supabase's public keys without ever
   holding a password or a secret.

   TRANSITION.md, Stage 5.
   ============================================================ */

/* Public by design, both of them. The publishable key identifies
   the project and grants nothing on its own: every table it can
   reach is behind row-level security. The key that does grant
   things is the service role key, which is not here, is not in the
   repository, and has no reason ever to be. */
export const SUPABASE_URL = "https://wvjarqnnmkkuxyrndtya.supabase.co";
export const SUPABASE_KEY = "sb_publishable_lvckv69CrjRyF1_urwDrCQ_PWoTH3UW";

const STORE = "reiad-session";
const AUTH = `${SUPABASE_URL}/auth/v1`;

/* Refresh a minute before the token actually expires. A token that
   expires mid-request is a request that fails for no reason the
   reader could understand. */
const EARLY = 60_000;

let session = read();
let refreshing = null;

/* ============================================================
   The session, kept on this device
   ============================================================ */

function read() {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;      // private mode, disabled storage: not fatal
  }
}

function write(next) {
  session = next;
  try {
    if (next) localStorage.setItem(STORE, JSON.stringify(next));
    else localStorage.removeItem(STORE);
  } catch { /* the session simply does not survive the tab */ }
  document.dispatchEvent(new CustomEvent("account:changed", { detail: next }));
}

/** What Supabase hands back, in the shape we keep it. */
const shape = (data) => ({
  access_token: data.access_token,
  refresh_token: data.refresh_token,
  expires_at: Date.now() + (Number(data.expires_in) || 3600) * 1000,
  user: {
    id: data.user?.id,
    email: data.user?.email,
    name: data.user?.user_metadata?.full_name
      ?? data.user?.user_metadata?.name
      ?? (data.user?.email ?? "").split("@")[0],
  },
});

async function post(path, body, token) {
  const res = await fetch(`${AUTH}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.msg || data.error_description || data.message || "auth-failed");
  return data;
}

/* ============================================================
   Coming back from a sign-in
   ============================================================ */

/**
 * Supabase sends the reader back to whatever page they started on,
 * with the tokens in the URL fragment. The fragment is used rather
 * than the query string on purpose: a fragment is never sent to a
 * server, so the token cannot end up in a log.
 *
 * It is taken out of the address bar immediately, so a copied link
 * or a screenshot does not carry a working session in it.
 */
function collectFromHash() {
  if (!location.hash.includes("access_token=")) return false;

  const params = new URLSearchParams(location.hash.slice(1));
  const access = params.get("access_token");
  const refresh = params.get("refresh_token");
  if (!access || !refresh) return false;

  write({
    access_token: access,
    refresh_token: refresh,
    expires_at: Date.now() + (Number(params.get("expires_in")) || 3600) * 1000,
    user: null,           // filled in by the /user call below
  });
  history.replaceState(null, "", location.pathname + location.search);
  return true;
}

/* ============================================================
   The six things this file does
   ============================================================ */

/** Send a sign-in link. Nothing is created until the link is used. */
export async function sendLink(email) {
  const redirect = encodeURIComponent(location.origin + location.pathname);
  await fetch(`${AUTH}/otp?redirect_to=${redirect}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ email, create_user: true }),
  }).then(async (res) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.msg || data.error_description || "Could not send the link.");
    }
  });
}

/** Hand off to Google. Comes back to this page with a fragment. */
export function signInWithGoogle() {
  const redirect = encodeURIComponent(location.origin + location.pathname);
  location.href = `${AUTH}/authorize?provider=google&redirect_to=${redirect}`;
}

/** A valid access token, refreshed if it is about to expire.
    Null when nobody is signed in, which is the common case and not
    an error anywhere. */
export async function token() {
  if (!session) return null;
  if (Date.now() < session.expires_at - EARLY) return session.access_token;

  // One refresh at a time, however many callers ask at once.
  refreshing ??= post("token?grant_type=refresh_token", {
    refresh_token: session.refresh_token,
  })
    .then((data) => { write(shape(data)); return session.access_token; })
    .catch(() => { write(null); return null; })
    .finally(() => { refreshing = null; });

  return refreshing;
}

/** Who is signed in, as far as this device knows. Synchronous, so
    a header can be drawn without waiting for anything. */
export const current = () => session?.user ?? null;

/** Ask Supabase who this token belongs to, and remember the answer. */
export async function refreshUser() {
  const access = await token();
  if (!access) return null;
  try {
    const res = await fetch(`${AUTH}/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${access}` },
    });
    if (!res.ok) throw new Error(String(res.status));
    const user = await res.json();
    write({
      ...session,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name ?? user.user_metadata?.name
          ?? (user.email ?? "").split("@")[0],
      },
    });
    return session.user;
  } catch {
    return session?.user ?? null;
  }
}

/** Sign out here. Telling Supabase is best effort: if the network
    is gone, the session still has to disappear from this device. */
export async function signOut() {
  const access = session?.access_token;
  write(null);
  if (!access) return;
  try { await post("logout", {}, access); } catch { /* already gone */ }
}

/** Called once by app.js. Picks up a redirect if this page is one,
    and fills in who the reader is if a session survived. */
export async function initAccount() {
  const arrived = collectFromHash();
  if (session && (!session.user || arrived)) await refreshUser();
  return current();
}
