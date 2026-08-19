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
export declare function getProfile(): Promise<Profile | null>;
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
export declare function saveProfile(patch: Partial<Profile>): Promise<boolean>;
export declare const setDisplayName: (name: string) => Promise<boolean>;
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
export declare function initAccount(): Reader | null;
