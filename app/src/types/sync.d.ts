/** Every key the account owns, which is every key above. */
export declare const SYNCED_KEYS: string[];
/**
 * Read the account, reconcile, write both ends.
 *
 * Runs at most one at a time; asking while one is in flight sets
 * a flag and runs once more afterwards, so a burst of ticks costs
 * two round trips rather than ten.
 */
export declare function sync(): Promise<boolean>;
/** Take everything off the account, and off this device with it.
    The two are one record now, so emptying one and leaving the
    other would put them straight back next time. */
export declare function forgetOnAccount(): Promise<boolean>;
/** Called by signin.js once it knows whether anyone is signed in.

    The listeners go on whether or not anybody is, so that signing
    in halfway through a page adopts without a reload, and every
    one of them is a no-op signed out: `schedule()` returns at its
    first line and `sync()` returns false at its own. A reader who
    never signs in makes no request, stores nothing new and is
    read from by nobody, which is what "no feature on this site
    requires an account" has to cost. */
export declare function startSync(): void;
