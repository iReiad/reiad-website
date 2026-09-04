/* ============================================================
   The board a reader arranged, in the browser.

   `shared/widgets.ts` is the catalogue and the parse; this is the
   half that touches a real device. Kept apart for the same reason
   progress is: `shared/` is read by node, by a Worker and by the
   Android app, and none of them has a `localStorage`.

   ---- the key ----

   `home-board`, and `aab/src/sync.ts` carries it as a `mark`
   beside `reader-prefs`. **A `mark`, not a `set`, and the wrong
   rule here would be silent**: a board is REPLACED, not
   accumulated, so the union of two devices' boards holds
   everything either of them ever had. A widget taken off on a
   phone would come back off the laptop, and again, and again,
   and nothing would look broken.

   The value is `{ board: string[], ts: number }`, because `mark`
   reconciles on a `ts` inside the value. A record written without
   a fresh one loses the exchange.

   ---- and null is not empty ----

   No key at all means the reader has never arranged anything, and
   they get the site's own default. An EMPTY list means they took
   everything off, and filling that back in would be the page
   overruling them. `layoutOf` in `shared/widgets.ts` is where
   that distinction lives, and both callers hand it the same
   thing.
   ============================================================ */

import { keepUndrawn, layoutOf, storedOf, type Placed } from "@reiad/shared/widgets";

export const BOARD_KEY = "home-board";

/** The same-tab event. `storage` only fires in OTHER tabs, so a
    change made here has to say so itself. */
const EVENT = "board:changed";

interface Record_ {
  board: string[];
  ts: number;
}

/** What is stored, or null for "never arranged".

    Anything unreadable is null rather than an error. A reader
    whose board came back as the default can arrange it again; one
    whose front page threw has lost the page. */
export function stored(): string[] | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(BOARD_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record_;
    if (!Array.isArray(parsed?.board)) return null;
    return parsed.board.filter((entry): entry is string => typeof entry === "string");
  } catch {
    return null;
  }
}

/** The board as placings, with anything this build cannot draw
    left out. `drawable` is the caller's, because the site and the
    app run different releases and one of them will be ahead. */
export function board(drawable: Iterable<string>, fallback?: readonly string[]): Placed[] {
  const saved = stored();
  return layoutOf(saved ?? (fallback ? [...fallback] : null), drawable);
}

/** Write it, stamped, and tell this tab.

    `drawable` is what the CALLER can render, and passing it is
    what stops this from deleting the rest of the reader's board:
    see `withUndrawn`. It is optional so that a caller which
    genuinely holds the whole catalogue can leave it out, and
    absent means "everything here is everything there is". */
export function save(placed: readonly Placed[], drawable?: Iterable<string>): void {
  if (typeof localStorage === "undefined") return;
  try {
    /* `keepUndrawn` is `shared/widgets.ts`'s, because both
       renderers can make this mistake and only one of them is in
       this repository. */
    const board = drawable
      ? keepUndrawn(stored(), storedOf(placed), drawable)
      : storedOf(placed);
    const value: Record_ = { board, ts: Date.now() };
    localStorage.setItem(BOARD_KEY, JSON.stringify(value));
  } catch {
    /* A browser with storage turned off still gets a working
       page, drawn from the default, and arranging it simply does
       not persist. That is a worse experience than the one
       intended and a better one than a front page that throws. */
  }
  announce();
}

/** Back to the site's own default, which is REMOVING the key
    rather than writing an empty list: the next read then says
    "never arranged" and the default answers. */
export function reset(): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(BOARD_KEY);
  } catch { /* as above */ }
  announce();
}

function announce(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(EVENT));
}

/** The three things that change a board under a page's feet.

    The third is the one that is easy to leave out and the one
    that matters for a signed-in reader: `aab/sync.js` writes the
    account's rows straight into localStorage, which fires neither
    of the other two, because `storage` only fires in OTHER tabs.
    Without it the front page is drawn against what storage held
    BEFORE the exchange, and stays there. */
export function subscribe(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  document.addEventListener("sync:done", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
    document.removeEventListener("sync:done", fn);
  };
}

export { EVENT as BOARD_EVENT };
