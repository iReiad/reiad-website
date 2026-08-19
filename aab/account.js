/* ============================================================
   account.ts: who a reader is.

   NOT auth.js. That one guards the Studio and the desk, it is a
   cookie set by this site's own Worker, and there is exactly one
   person it will ever let in. This is the other thing entirely:
   ordinary readers, signing in to keep their progress and to leave
   a comment with a name on it. The two never meet, and neither
   grants anything the other does.

   ---- why there is no Supabase client library here ----

   The official one is about forty kilobytes and would have to be
   fetched from a CDN or bundled, and this site has no build step
   on a reading page and loads no third-party JavaScript there.
   What it does for us is three POSTs and a redirect, which is
   what this file is. If that stops being true, if refresh
   rotation or MFA or anything else grows teeth, this is the
   moment to reconsider, and the whole surface is the six
   functions below.

   ---- what a session is ----

   Supabase hands back an access token (a JWT, short-lived) and a
   refresh token (long-lived). Both go in localStorage, which is
   where the official client puts them too. The access token is
   what a request to our own Worker will carry later, so the Worker
   can verify it against Supabase's public keys without ever
   holding a password or a secret.

   ---- it was two declarations before it was one module ----

   `aab/src/types/account.d.ts` and `app/src/types/account.d.ts`
   both described this file, by hand, and they disagreed: one said
   `saveProfile` answers a boolean and the other a `Profile`, and
   the code answers a boolean. A declaration that is wrong is
   worse than none, because the compiler then agrees with the
   mistake. Both are gone. This file emits the second, and
   `aab/src/tsconfig.json` maps `/account.js` at the source.

   archive/TRANSITION.md, Stage 5 and Stage 13.
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
    }
    catch {
        return null; // private mode, disabled storage: not fatal
    }
}
function write(next) {
    session = next;
    try {
        if (next)
            localStorage.setItem(STORE, JSON.stringify(next));
        else
            localStorage.removeItem(STORE);
    }
    catch { /* the session simply does not survive the tab */ }
    document.dispatchEvent(new CustomEvent("account:changed", { detail: next }));
}
/**
 * One reader out of one Supabase user record, and the ONLY place
 * that mapping is written.
 *
 * It was written three times, in `readToken`, in `shape` and in
 * `refreshUser`, and they agreed because somebody remembered.
 * That is the failure the top of `CLAUDE.md` is about, and it bit
 * the moment a fourth field was wanted: the picture Google sends
 * would have reached two of the three paths, so it would have
 * appeared after a `/user` call and vanished on the next reload.
 */
function person(u) {
    if (!u?.id)
        return null;
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
 * THIS IS NOT VERIFICATION, and the difference matters. A JWT is a
 * signed statement, and checking that signature is the server's
 * job: our Worker will do it against Supabase's public keys before
 * it trusts a single byte. This only reads a token that Supabase
 * handed to this browser seconds ago, to put a name in a corner.
 * Nothing is authorised on the strength of it.
 *
 * It exists because the alternative was asking the network who you
 * are before the header could say. On a good connection that is a
 * blink. On a phone in Dhaka, behind a service worker precaching
 * sixty files, it was thirty-one seconds of a page that looked
 * like the sign-in had failed. It had not.
 */
function readToken(access) {
    try {
        const payload = access.split(".")[1];
        const json = decodeURIComponent(atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
            .split("")
            .map((c) => `%${c.charCodeAt(0).toString(16).padStart(2, "0")}`)
            .join(""));
        const claims = JSON.parse(json);
        if (!claims.sub)
            return null;
        return {
            user: person({ ...claims, id: claims.sub }),
            // The token's own expiry, which is the truth, rather than the
            // expires_in we were told beside it.
            expires_at: claims.exp ? claims.exp * 1000 : null,
        };
    }
    catch {
        return null; // not a JWT we can read: fall back to asking
    }
}
/** What the token endpoint returns, in the shape we keep it. */
function shape(data) {
    const read = readToken(data.access_token);
    return {
        access_token: data.access_token,
        refresh_token: data.refresh_token,
        expires_at: read?.expires_at ?? Date.now() + (Number(data.expires_in) || 3600) * 1000,
        user: person(data.user) ?? read?.user ?? null,
    };
}
async function post(path, body, bearer) {
    const res = await fetch(`${AUTH}/${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_KEY,
            ...(bearer ? { Authorization: `Bearer ${bearer}` } : {}),
        },
        body: JSON.stringify(body ?? {}),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok)
        throw new Error(data.msg || data.error_description || data.message || "auth-failed");
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
/** Whatever went wrong on the way back, kept for the panel to
    show. Silently doing nothing is the one response to a failed
    sign-in that leaves somebody clicking the same button again. */
export let arrivalError = null;
function collectFromHash() {
    const hash = location.hash.slice(1);
    if (!hash)
        return false;
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
    if (!access || !refresh)
        return false;
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
    if (!session)
        return null;
    if (Date.now() < session.expires_at - EARLY)
        return session.access_token;
    // One refresh at a time, however many callers ask at once.
    refreshing ??= post("token?grant_type=refresh_token", {
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
export const current = () => session?.user ?? null;
/** Ask Supabase who this token belongs to, and remember the answer. */
export async function refreshUser() {
    const access = await token();
    if (!access)
        return null;
    try {
        const res = await fetch(`${AUTH}/user`, {
            headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${access}` },
        });
        if (!res.ok)
            throw new Error(String(res.status));
        const user = await res.json();
        /* A REFRESH NEVER DOWNGRADES. `person()` answers null for a
           record with no `id`, and writing that null over a session
           that already had a reader in it signs them out of a page
           they were signed in to: `current()` goes null, `saveProfile`
           throws "Not signed in.", and sync stops pushing ticks
           without saying anything.
    
           That is not hypothetical and it is not a test artifact.
           This function returned a user built field by field until 19
           August 2026, so an unusable answer produced an object with
           undefined fields, which is wrong but truthy. Factoring the
           three copies into `person()` made the same answer produce
           null, and `aab/sync.test.ts` went from 27 passing to four
           failures and an uncaught throw within the hour.
    
           So an answer this cannot read leaves the session alone, the
           same as a network error one line below. There is exactly
           one thing that ends a session on purpose, and it is
           `signOut()`. */
        const fresh = person(user);
        if (session && fresh)
            write({ ...session, user: fresh });
        return current();
    }
    catch {
        return current();
    }
}
/** Sign out here. Telling Supabase is best effort: if the network
    is gone, the session still has to disappear from this device. */
export async function signOut() {
    const access = session?.access_token;
    write(null);
    // The remembered profile belongs to the session, and goes with it.
    cacheProfile(null);
    document.dispatchEvent(new CustomEvent("profile:changed", { detail: null }));
    if (!access)
        return;
    try {
        await post("logout", {}, access);
    }
    catch { /* already gone */ }
}
/* ============================================================
   The profile row

   The one thing this site stores about a person beyond what
   Supabase needs to sign them in: the name shown beside anything
   they write. Row-level security means these two calls can only
   ever read and write the caller's own row, whatever this file
   asks for.
   ============================================================ */
const REST = `${SUPABASE_URL}/rest/v1`;
async function restHeaders() {
    const access = await token();
    if (!access)
        return null;
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
/* The last profile seen, kept on this device.

   The home page needs to know which courses somebody follows
   BEFORE it draws anything, and a home page must not wait on a
   wire. Waiting on this one would be worse than most: the band it
   decides is the first thing on the page, so the whole page would
   visibly rearrange itself a second after it loaded.

   So the answer is remembered, and the copy in Postgres is what
   corrects it. Nothing here is private in a way the session next
   to it is not: it is a name, three or four course ids, and a
   word for how often. It goes when the session goes. */
const PROFILE_STORE = "reiad-profile";
/** What this device last knew, without asking anyone. */
export function cachedProfile() {
    try {
        const raw = localStorage.getItem(PROFILE_STORE);
        return raw ? JSON.parse(raw) : null;
    }
    catch {
        return null;
    }
}
function cacheProfile(row) {
    try {
        if (row)
            localStorage.setItem(PROFILE_STORE, JSON.stringify(row));
        else
            localStorage.removeItem(PROFILE_STORE);
    }
    catch { /* private mode: everything still works, just slower */ }
}
/**
 * This reader's profile, out of Postgres.
 *
 * THE FILTER IS THE WHOLE FUNCTION, and it was missing.
 *
 * `profiles` is the ONE table on this project whose select policy
 * is `using (true)`, and deliberately: a comment shows its
 * author's name to people who are not signed in. Every other
 * table is `auth.uid() = user_id`, so an unfiltered read there
 * returns your own rows and nothing else, which is why this was
 * the only call that could go wrong and did.
 *
 * Without `id=eq.<me>`, PostgREST returned whichever row the
 * planner reached first out of the whole table. With one account
 * that was always the right one. With two it was a coin toss, and
 * worse than a coin toss: a non-HOT update moves a row to the end
 * of the heap, so SAVING your profile was the thing that made the
 * next read return somebody else's. The account page painted
 * their answers as yours, `setup_at` came back null so the setup
 * form reappeared, and pressing Save again wrote the right row and
 * guaranteed the same wrong read. "It saves and goes back to how
 * it was", forever, by construction.
 *
 * It cached that row as this device's profile too, and
 * `saveProfile` merges its patch on to the cache, so the next
 * partial save could have written another person's answers into
 * your row.
 *
 * The irony is worth keeping: `saveProfile` below carries
 * `id=eq.<me>` and explains at length that it does so even though
 * the policy makes it unnecessary. Here the policy genuinely does
 * not protect you, and there was no filter at all.
 */
export async function getProfile() {
    const head = await restHeaders();
    const who = current();
    if (!head || !who)
        return null;
    try {
        const res = await fetch(`${REST}/profiles?id=eq.${encodeURIComponent(who.id)}`
            + `&select=${PROFILE_FIELDS}&limit=1`, { headers: head });
        if (!res.ok)
            throw new Error(String(res.status));
        const [row] = await res.json();
        if (row) {
            cacheProfile(row);
            document.dispatchEvent(new CustomEvent("profile:changed", { detail: row }));
        }
        return row ?? null;
    }
    catch (err) {
        console.warn("profile read failed", err);
        return cachedProfile();
    }
}
/**
 * Write some of the profile. Takes the same column names the row
 * came back with, and writes only the ones it was given.
 *
 * The row filter is `id=eq.<me>` even though the policy already
 * makes it impossible to touch anyone else's: without a filter,
 * PostgREST would send an UPDATE across the whole table, and the
 * only thing standing between that and everybody's profile would
 * be the policy. Two locks on a door that is never meant to open.
 */
export async function saveProfile(patch) {
    const head = await restHeaders();
    const who = current();
    const now = session;
    if (!head || !who || !now)
        throw new Error("Not signed in.");
    const res = await fetch(`${REST}/profiles?id=eq.${encodeURIComponent(who.id)}`, {
        method: "PATCH",
        headers: { ...head, Prefer: "return=minimal" },
        body: JSON.stringify(patch),
    });
    if (!res.ok)
        throw new Error(`Could not save that (${res.status}).`);
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
export const setDisplayName = (name) => saveProfile({ display_name: name });
/**
 * Called once by signin.js. Synchronous on purpose: it picks up a
 * redirect, reads who the reader is out of the token, and returns.
 * Anything that needs the network happens after, in the background,
 * and tells the page through the account:changed event.
 *
 * This used to await the /user call, which meant the header could
 * not say who you were until Supabase answered. Behind a service
 * worker precaching sixty files that was half a minute of looking
 * signed out while being signed in.
 */
export function initAccount() {
    collectFromHash();
    /* Only when the token could not be read, which should not
       happen, and as a quiet refresh of the name and the picture
       Google gave us. A session written before this file carried a
       picture has a `user` with no `avatar` on it, so that second
       reason is not hypothetical: it is every reader signed in
       before today. */
    if (session && (!session.user || session.user.avatar === undefined))
        refreshUser();
    return current();
}
