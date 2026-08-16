/* `/auth.js`, the gate. See ./README.md. */

/** Show the gate, and resolve once the owner is through it.
    `server` is false when there is no D1 behind the site, which is
    the one case where the desk has nothing it could show. */
export function requireOwner(root: HTMLElement): Promise<{ server?: boolean } | null>;
