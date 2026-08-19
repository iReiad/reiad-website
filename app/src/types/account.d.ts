/* `/account.js`: who is signed in, and the profile row that goes
   with them. Served at that path and imported at runtime, so this
   describes it rather than compiling it. `app/src/types/README.md`
   says why the whole folder exists.

   The field names below are the COLUMNS, spelled as Supabase
   returns them. `display_name` is not `name` and `following` is
   not `courses`: this file said the second of each for one
   commit, and a declaration that renames a column is worse than
   no declaration, because the compiler then agrees with the
   mistake. `PROFILE_FIELDS` in `aab/account.js` is the list. */

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

export interface Reader {
  id: string;
  email?: string | null;
  name?: string | null;
  [key: string]: unknown;
}

/** The signed-in reader, or null. SYNCHRONOUS: it reads the
    session this module already holds and asks nobody. */
export function current(): Reader | null;

/** Ends the session and takes the mirror off this device. */
export function signOut(): Promise<void>;

/** What this device last knew about the profile, without asking
    anyone. Written by `getProfile()` and `saveProfile()`, and
    cleared on sign-out. */
export function cachedProfile(): Profile | null;

/** The row from the account. Dispatches `profile:changed` on
    `document` with the row as its detail, which is how anything
    drawing part of the profile hears about it without fetching
    the row a second time. */
export function getProfile(): Promise<Profile | null>;
export function saveProfile(patch: Partial<Profile>): Promise<Profile | null>;
