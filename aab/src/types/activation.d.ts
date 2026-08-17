/* `/activation.js`, described just enough for the modules that
   have moved.

   archive/TRANSITION.md Stage 13. A module in `aab/src/` imports its
   neighbours by the path the browser fetches them from,
   `/activation.js` and not `../activation.js`, because that is
   what ends up in the emitted file and what the browser has to
   resolve. TypeScript needs a claim about that path, and
   `aab/src/tsconfig.json` maps it here.

   This is a file waiting its turn. When `activation.js` moves to
   `aab/src/` it emits its own declaration and this one is deleted
   in the same commit, exactly as `app/src/types/` empties one
   file at a time. */

/** Run something once the page is really being looked at.

    Speculation rules prerender a link on hover, and a prerendered
    page runs every module on it, so anything that counts or
    records has to wait for this or it counts a pointer passing
    over a link. */
export function whenActivated(fn: () => void): void;
