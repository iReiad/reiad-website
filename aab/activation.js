/* ============================================================
   activation.js, don't act on a page nobody has opened yet.

   THE BUG THIS EXISTS TO PREVENT

   app.js injects speculation rules with eagerness "moderate",
   which tells the browser to PRERENDER a link when the pointer
   hovers it. That is a real speed win, the click is instant,
   but a prerendered page is not a preview. It is the page,
   fully loaded, with its scripts running, sharing this origin's
   localStorage. It simply isn't visible yet.

   So every side effect a page performs on load fires while the
   reader is merely moving the mouse across a list of links:

     · /money/progress.js ticked lessons off as read, so the hub
       filled with ✓ marks for lessons nobody had opened, and the
       "resume where you were" card pointed at wherever the
       pointer had last drifted.
     · /api.js counted a page view, inflating the numbers with
       hovers.

   It only ever happened on a laptop. Phones don't hover, which
   is exactly why the bug survived testing.

   THE RULE

   Reading the DOM during prerender is fine. Anything a reader
   would recognise as "I did that"– writing progress, counting
   a view, recording a position, waits for activation.

   whenActivated(fn) runs fn now on a normally loaded page, or
   at the moment a prerendered page is actually shown.
   ============================================================ */

/** True while this document is a prerender nobody has opened. */
export const isPrerendering = () =>
  // Chrome ships document.prerendering; everywhere else this is
  // undefined and the page is by definition already visible.
  document.prerendering === true;

/** True if this document was EVER prerendered, even if it is now
    activated. Useful for one-shot work that ran too early. */
export const wasPrerendered = () =>
  performance.getEntriesByType("navigation")[0]?.activationStart > 0;

/**
 * Run fn once the page is really being looked at.
 *
 * On an ordinary navigation that is immediately. On a prerender
 * it is when the reader clicks the link that was prerendered,
 * which may be never, in which case fn never runs, which is the
 * entire point.
 */
export function whenActivated(fn) {
  if (!isPrerendering()) {
    fn();
    return;
  }
  document.addEventListener("prerenderingchange", () => fn(), { once: true });
}
