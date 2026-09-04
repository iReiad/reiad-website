export declare const SUPABASE_URL = "https://wvjarqnnmkkuxyrndtya.supabase.co";
export declare const SUPABASE_KEY = "sb_publishable_lvckv69CrjRyF1_urwDrCQ_PWoTH3UW";
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
/**
 * Supabase returns the tokens in the URL FRAGMENT rather than the
 * query string, because a fragment is never sent to a server and
 * so cannot end up in a log. It is taken out of the address bar
 * immediately, so a copied link carries no working session.
 */
/** Whatever went wrong on the way back, kept for the panel to
    show. Silently doing nothing is the one response to a failed
    sign-in that leaves somebody clicking the same button again. */
export declare let arrivalError: string | null;
/** Send a sign-in link. Nothing is created until the link is used. */
export declare function sendLink(email: string): Promise<void>;
/** Hand off to Google. Comes back to this page with a fragment. */
export declare function signInWithGoogle(): void;
/** A valid access token, refreshed if it is about to expire.
    Null when nobody is signed in, which is the common case and not
    an error anywhere. */
export declare function token(): Promise<string | null>;
/** Who is signed in, as far as this device knows. Synchronous, so
    a header can be drawn without waiting for anything. */
export declare const current: () => Reader | null;
/** Ask Supabase who this token belongs to, and remember the answer. */
export declare function refreshUser(): Promise<Reader | null>;
/** Sign out here. Telling Supabase is best effort: if the network
    is gone, the session still has to disappear from this device. */
export declare function signOut(): Promise<void>;
/** What this device last knew, without asking anyone. */
export declare function cachedProfile(): Profile | null;
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
export declare function getProfile(): Promise<Profile | null>;
/**
 * Write some of the profile, only the columns it was given.
 *
 * `id=eq.<me>` even though the policy already makes it impossible
 * to touch anyone else's: without a filter PostgREST sends an
 * UPDATE across the whole table and the policy is the only thing
 * standing in front of everybody's profile.
 */
export declare function saveProfile(patch: Partial<Profile>): Promise<boolean>;
export declare const setDisplayName: (name: string) => Promise<boolean>;
/**
 * Called once by signin.js. SYNCHRONOUS on purpose: it picks up a
 * redirect, reads who the reader is out of the token and returns.
 * Anything needing the network happens after and tells the page
 * through `account:changed`. Awaiting `/user` here is half a
 * minute of looking signed out while being signed in.
 */
export declare function initAccount(): Reader | null;
