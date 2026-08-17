/* `/account.js`, described just enough for the modules that have
   moved.

   archive/TRANSITION.md Stage 13. A module in `aab/src/` imports its
   neighbours by the path the browser fetches them from,
   `/account.js` and not `../account.js`, because that is what
   ends up in the emitted file and what the browser has to
   resolve. TypeScript needs a claim about that path, and
   `aab/src/tsconfig.json` maps it here.

   This is a file waiting its turn, like `activation.d.ts` beside
   it. When `account.js` moves to `aab/src/` it emits its own
   declaration and this one is deleted in the same commit.

   Only what the moved modules actually import is described. A
   declaration that guessed at the rest of the file would be a
   claim nobody checked, which is worse than no claim: the whole
   argument for these files rather than `@ts-expect-error` is
   that they SAY something, and something wrong is not better
   than silence. */

/** Who a reader is, as far as this device knows. */
export interface Reader {
  id: string;
  email: string;
  name: string;
}

/** Public by design. The publishable key grants nothing on its
    own: every table it can reach is behind row-level security. */
export const SUPABASE_URL: string;
export const SUPABASE_KEY: string;

/** A valid access token, refreshed if it is about to expire.
    Null when nobody is signed in, which is the common case and
    not an error anywhere. */
export function token(): Promise<string | null>;

/** Who is signed in. Synchronous, so a header can be drawn
    without waiting for anything. */
export function current(): Reader | null;

export function signOut(): Promise<void>;
export function sendLink(email: string): Promise<void>;
export function signInWithGoogle(): void;
export function initAccount(): Reader | null;
export function refreshUser(): Promise<Reader | null>;
export const arrivalError: string | null;

/** The one thing this site stores about a person beyond what
    Supabase needs to sign them in. */
export interface Profile {
  display_name: string;
  following: string[];
  pace: string;
  setup_at: string | null;
}

export function getProfile(): Promise<Profile | null>;
export function cachedProfile(): Profile | null;
export function saveProfile(patch: Partial<Profile>): Promise<boolean>;
export function setDisplayName(name: string): Promise<boolean>;
