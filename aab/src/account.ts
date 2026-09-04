/* account.ts: who a reader is. Ordinary readers signing in to
   keep progress and to comment. NOT `auth.ts`, which guards the
   Studio with this site's own Worker cookie and grants nothing
   here. No Supabase client library on purpose: three POSTs and a
   redirect, and a reading page loads no third-party JavaScript.
   Edit this; `aab/account.js` beside it is built. */

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

/* ------------------------------------------------------------
   what a reader, a session and a profile are
   ------------------------------------------------------------ */

/** Who a reader is, as far as this device knows. */
export interface Reader {
  id: string;
  email: string;
  name: string;
  /** Their picture, if the provider they signed in with gave one.
      Empty for an email sign-in, which is most of them, so
      anything drawing it needs the initial as its other half. */
  avatar: string;
}

/** What Supabase hands back, in the shape this file keeps it. */
export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: Reader | null;
}

/** The one thing this site stores about a person beyond what
    Supabase needs to sign them in.

    The field names are the COLUMNS, spelled as Supabase returns
    them: `display_name` is not `name` and `following` is not
    `courses`. `PROFILE_FIELDS` below is the list. */
export interface Profile {
  display_name?: string | null;
  /** The school ids this reader said they were learning. */
  following?: string[] | null;
  pace?: string | null;
  /** When they answered the three settings questions, or null if
      they have not. Set on the first save whether or not anything
      was ticked, so the page stops asking. */
  setup_at?: string | null;
  [key: string]: unknown;
}

/** The half of a Supabase user record this file reads. Everything
    is optional because it arrives over a wire: the `/user`
    endpoint, the token exchange and the access token's own claims
    all carry this shape and none of them promises a field. */
interface SupabaseUser {
  id?: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    picture?: string;
  };
}

let session: Session | null = read();
let refreshing: Promise<string | null> | null = null;

/* ============================================================
   The session, kept on this device
   ============================================================ */

function read(): Session | null {
  try {
    const raw = localStorage.getItem(STORE);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;      // private mode, disabled storage: not fatal
  }
}

function write(next: Session | null): void {
  session = next;
  try {
    if (next) localStorage.setItem(STORE, JSON.stringify(next));
    else localStorage.removeItem(STORE);
  } catch { /* the session simply does not survive the tab */ }
  document.dispatchEvent(new CustomEvent("account:changed", { detail: next }));
}

/**
 * One reader out of one Supabase user record, and the ONLY place
 * that mapping is written: three copies agreed because somebody
 * remembered, and a fourth field reached two of the three.
 */
function person(u: SupabaseUser | null | undefined): Reader | null {
  if (!u?.id) return null;
  const meta = u.user_metadata ?? {};
  const email = u.email ?? "";
  return {
    id: u.id,
    email,
    name: meta.full_name ?? meta.name ?? email.split("@")[0],
    /* Google spells it `avatar_url` through Supabase and
       `picture` in the raw OIDC claims, and which one arrives
       depends on the endpoint. Both, rather than picking. */
    avatar: meta.avatar_url ?? meta.picture ?? "",
  };
}

/**
 * Read the name, email and picture out of the access token.
 *
 * THIS IS NOT VERIFICATION. Checking the signature is the
 * Worker's job, against Supabase's public keys. This reads a
 * token Supabase handed this browser seconds ago to put a name in
 * a corner, and NOTHING is authorised on the strength of it. It
 * exists so the header does not have to wait on the network.
 */
function readToken(access: string): { user: Reader | null; expires_at: number | null } | null {
  try {
    const payload = access.split(".")[1];
    const json = decodeURIComponent(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
        .split("")
        .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
        .join("")
    );
    const claims = JSON.parse(json) as SupabaseUser & { sub?: string; exp?: number };
    if (!claims.sub) return null;
    return {
      user: person({ ...claims, id: claims.sub }),
      // The token's own expiry, which is the truth, rather than the
      // expires_in we were told beside it.
      expires_at: claims.exp ? claims.exp * 1000 : null,
    };
  } catch {
    return null;      // not a JWT we can read: fall back to asking
  }
}

/** What the token endpoint answers with. */
interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in?: number | string;
  user?: SupabaseUser;
}

/** What the token endpoint returns, in the shape we keep it. */
function shape(data: TokenResponse): Session {
  const read = readToken(data.access_token);
  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: read?.expires_at ?? Date.now() + (Number(data.expires_in) || 3600) * 1000,
    user: person(data.user) ?? read?.user ?? null,
  };
}

interface AuthError {
  msg?: string;
  error_description?: string;
  message?: string;
}

async function post<T = Record<string, unknown>>(
  path: string, body?: unknown, bearer?: string,
): Promise<T> {
  const res = await fetch(`${AUTH}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SUPABASE_KEY,
      ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
    },
    body: JSON.stringify(body ?? {}),
  });
  const data = await res.json().catch(() => ({})) as T & AuthError;
  if (!res.ok) throw new Error(data.msg || data.error_description || data.message || "auth-failed");
  return data;
}

/* ============================================================
   Coming back from a sign-in
   ============================================================ */

/**
 * Supabase returns the tokens in the URL FRAGMENT rather than the
 * query string, because a fragment is never sent to a server and
 * so cannot end up in a log. It is taken out of the address bar
 * immediately, so a copied link carries no working session.
 */
/** Whatever went wrong on the way back, kept for the panel to
    show. Silently doing nothing is the one response to a failed
    sign-in that leaves somebody clicking the same button again. */
export let arrivalError: string | null = null;

function collectFromHash(): boolean {
  const hash = location.hash.slice(1);
  if (!hash) return false;
  const params = new URLSearchParams(hash);

  const failed = params.get("error") || params.get("error_code");
  if (failed) {
    arrivalError = params.get("error_description")?.replace(/\+/g, " ")
      || "That sign-in did not go through.";
    history.replaceState(null, "", location.pathname + location.search);
    return false;
  }

  const access = params.get("access_token");
  const refresh = params.get("refresh_token");
  if (!access || !refresh) return false;

  /* The token says who this is, so the header can be right on the
     first frame rather than after a round trip. */
  const read = readToken(access);
  write({
    access_token: access,
    refresh_token: refresh,
    expires_at: read?.expires_at
      ?? Date.now() + (Number(params.get("expires_in")) || 3600) * 1000,
    user: read?.user ?? null,
  });
  history.replaceState(null, "", location.pathname + location.search);
  return true;
}

/* ============================================================
   The six things this file does
   ============================================================ */

/** Send a sign-in link. Nothing is created until the link is used. */
export async function sendLink(email: string): Promise<void> {
  const redirect = encodeURIComponent(location.origin + location.pathname);
  await fetch(`${AUTH}/otp?redirect_to=${redirect}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: SUPABASE_KEY },
    body: JSON.stringify({ email, create_user: true }),
  }).then(async (res) => {
    if (!res.ok) {
      const data = await res.json().catch(() => ({})) as AuthError;
      throw new Error(data.msg || data.error_description || "Could not send the link.");
    }
  });
}

/** Hand off to Google. Comes back to this page with a fragment. */
export function signInWithGoogle(): void {
  const redirect = encodeURIComponent(location.origin + location.pathname);
  location.href = `${AUTH}/authorize?provider=google&redirect_to=${redirect}`;
}

/** A valid access token, refreshed if it is about to expire.
    Null when nobody is signed in, which is the common case and not
    an error anywhere. */
export async function token(): Promise<string | null> {
  if (!session) return null;
  if (Date.now() < session.expires_at - EARLY) return session.access_token;

  // One refresh at a time, however many callers ask at once.
  refreshing ??= post<TokenResponse>("token?grant_type=refresh_token", {
    refresh_token: session.refresh_token,
  })
    .then((data) => {
      write(shape(data));
      return session?.access_token ?? null;
    })
    .catch(() => { write(null); return null; })
    .finally(() => { refreshing = null; });

  return refreshing;
}

/** Who is signed in, as far as this device knows. Synchronous, so
    a header can be drawn without waiting for anything. */
export const current = (): Reader | null => session?.user ?? null;

/** Ask Supabase who this token belongs to, and remember the answer. */
export async function refreshUser(): Promise<Reader | null> {
  const access = await token();
  if (!access) return null;
  try {
    const res = await fetch(`${AUTH}/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${access}` },
    });
    if (!res.ok) throw new Error(String(res.status));
    const user = await res.json() as SupabaseUser;
    /* A REFRESH NEVER DOWNGRADES. Writing `person()`'s null over
       a live session signs the reader out of a page they were
       signed in to: `current()` goes null, `saveProfile` throws
       and sync stops pushing ticks, silently. An answer this
       cannot read leaves the session alone, like a network error
       below. `signOut()` is the only thing that ends a session. */
    const fresh = person(user);
    if (session && fresh) write({ ...session, user: fresh });
    return current();
  } catch {
    return current();
  }
}

/** Sign out here. Telling Supabase is best effort: if the network
    is gone, the session still has to disappear from this device. */
export async function signOut(): Promise<void> {
  const access = session?.access_token;
  write(null);
  // The remembered profile belongs to the session, and goes with it.
  cacheProfile(null);
  document.dispatchEvent(new CustomEvent("profile:changed", { detail: null }));
  if (!access) return;
  try { await post("logout", {}, access); } catch { /* already gone */ }
}

/* The profile row: the one thing stored about a person beyond
   what Supabase needs to sign them in. */

const REST = `${SUPABASE_URL}/rest/v1`;

async function restHeaders(): Promise<Record<string, string> | null> {
  const access = await token();
  if (!access) return null;
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };
}

/* Every column the site reads. Named rather than `*`, so that a
   column added to the table for some other reason does not start
   arriving in the browser without anyone deciding it should. */
const PROFILE_FIELDS = "display_name,following,pace,setup_at";

/* The last profile seen, kept on this device, because the home
   page decides its first band on it and must not wait on a wire.
   Postgres corrects it, and it goes when the session goes. */
const PROFILE_STORE = "reiad-profile";

/** What this device last knew, without asking anyone. */
export function cachedProfile(): Profile | null {
  try {
    const raw = localStorage.getItem(PROFILE_STORE);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

function cacheProfile(row: Profile | null): void {
  try {
    if (row) localStorage.setItem(PROFILE_STORE, JSON.stringify(row));
    else localStorage.removeItem(PROFILE_STORE);
  } catch { /* private mode: everything still works, just slower */ }
}

/**
 * This reader's profile, out of Postgres.
 *
 * THE FILTER IS THE WHOLE FUNCTION. `profiles` is the ONE table
 * here whose select policy is `using (true)`, because a comment
 * shows its author's name to somebody signed out. Without
 * `id=eq.<me>` PostgREST answers with whichever row the planner
 * reaches first, and a non-HOT update moves a row to the end of
 * the heap, so SAVING your profile is what makes the next read
 * return somebody else's. Never remove it.
 */
export async function getProfile(): Promise<Profile | null> {
  const head = await restHeaders();
  const who = current();
  if (!head || !who) return null;
  try {
    const res = await fetch(
      `${REST}/profiles?id=eq.${encodeURIComponent(who.id)}`
      + `&select=${PROFILE_FIELDS}&limit=1`,
      { headers: head },
    );
    if (!res.ok) throw new Error(String(res.status));
    const [row] = await res.json() as Profile[];
    if (row) {
      cacheProfile(row);
      document.dispatchEvent(new CustomEvent("profile:changed", { detail: row }));
    }
    return row ?? null;
  } catch (err) {
    console.warn("profile read failed", err);
    return cachedProfile();
  }
}

/**
 * Write some of the profile, only the columns it was given.
 *
 * `id=eq.<me>` even though the policy already makes it impossible
 * to touch anyone else's: without a filter PostgREST sends an
 * UPDATE across the whole table and the policy is the only thing
 * standing in front of everybody's profile.
 */
export async function saveProfile(patch: Partial<Profile>): Promise<boolean> {
  const head = await restHeaders();
  const who = current();
  const now = session;
  if (!head || !who || !now) throw new Error("Not signed in.");

  const res = await fetch(`${REST}/profiles?id=eq.${encodeURIComponent(who.id)}`, {
    method: "PATCH",
    headers: { ...head, Prefer: "return=minimal" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Could not save that (${res.status}).`);

  /* The header shows the name, so a change to it lands now rather
     than on the next page load. */
  if (typeof patch.display_name === "string") {
    write({ ...now, user: { ...who, name: patch.display_name } });
  }
  const next = { ...(cachedProfile() ?? {}), ...patch };
  cacheProfile(next);
  document.dispatchEvent(new CustomEvent("profile:changed", { detail: next }));
  return true;
}

export const setDisplayName = (name: string): Promise<boolean> =>
  saveProfile({ display_name: name });

/**
 * Called once by signin.js. SYNCHRONOUS on purpose: it picks up a
 * redirect, reads who the reader is out of the token and returns.
 * Anything needing the network happens after and tells the page
 * through `account:changed`. Awaiting `/user` here is half a
 * minute of looking signed out while being signed in.
 */
export function initAccount(): Reader | null {
  collectFromHash();

  /* Only when the token could not be read, which should not
     happen, and as a quiet refresh of the name and the picture
     Google gave us. A session written before this file carried a
     picture has a `user` with no `avatar` on it, so that second
     reason is not hypothetical: it is every reader signed in
     before today. */
  if (session && (!session.user || session.user.avatar === undefined)) refreshUser();

  return current();
}
