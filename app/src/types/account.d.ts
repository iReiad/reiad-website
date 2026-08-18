/* `/account.js`: who is signed in, and the profile row that goes
   with them. Served at that path and imported at runtime, so this
   describes it rather than compiling it. `app/src/types/README.md`
   says why the whole folder exists. */

export interface Profile {
  name?: string | null;
  courses?: string[] | null;
  pace?: string | null;
  [key: string]: unknown;
}

export interface Reader {
  id: string;
  email?: string | null;
  [key: string]: unknown;
}

/** The signed-in reader, or null. */
export function current(): Promise<Reader | null>;

/** Ends the session and takes the mirror off this device. */
export function signOut(): Promise<void>;

export function getProfile(): Promise<Profile | null>;
export function saveProfile(patch: Partial<Profile>): Promise<Profile | null>;
