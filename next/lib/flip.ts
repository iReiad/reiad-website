/* ============================================================
   flip.ts: a window that grows out of the thing it was opened
   from.

   Two mini windows on this site open this way and have to keep
   opening the same way: the story window on the Insights hub
   (`components/news.tsx`) and the research window on the About
   page (`components/research.tsx`). An animation only one of
   them got would make the two feel like different sites.

   It lives here rather than in either component because the
   About page has nothing to do with headlines: importing it out
   of `news.tsx` would put the feed, the card and the race into
   that page's bundle to borrow twelve lines of animation. That
   import is exactly what `archive/modules/about.js` did to
   `/news.js`, and it is why `news.js` could not be archived until
   the research window became a component.
   ============================================================ */

/** The site's own opening: long enough to be followed, short
    enough not to be waited on. */
const DURATION = 320;
const EASING = "cubic-bezier(0.2, 0.7, 0.2, 1)";

/**
 * Grow `win` out of `from`.
 *
 * `win` is a dialog that is ALREADY OPEN: both rectangles have to
 * be measured after `showModal()`, or the window has no size to
 * animate from and there is nothing to scale between.
 *
 * Three ways it does nothing, all deliberate: no element to grow
 * out of, a reader who asked for less motion, and a browser
 * without the Web Animations API.
 */
export function flip(win: HTMLElement, from: HTMLElement | null): void {
  if (!from) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof win.animate !== "function") return;

  const a = from.getBoundingClientRect();
  const b = win.getBoundingClientRect();
  if (!b.width || !b.height) return;

  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);

  win.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) `
          + `scale(${a.width / b.width}, ${a.height / b.height})`,
        opacity: 0.4,
      },
      { transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
    ],
    { duration: DURATION, easing: EASING },
  );
}
