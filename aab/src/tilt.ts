/* ============================================================
   tilt.ts, cards lean very slightly towards the pointer.

   The effect, in one sentence: a card rotates a couple of
   degrees about the axis perpendicular to wherever the pointer
   is sitting on it, so the corner nearest the cursor comes
   forward and the far one goes back. Small enough to read as
   "this is a physical thing", nowhere near enough to be a toy.

   THREE DECISIONS WORTH KNOWING ABOUT

   1. It uses the `rotate` property, NOT `transform`.

      Half the cards on this site already animate `transform` on
      hover, .door lifts by 2px, the case-study panels have
      their own translate, and a tilt written as a transform
      would have had to know about every one of them and
      re-declare it. `rotate`, `translate` and `scale` are
      independent properties that compose with each other and
      with `transform`, so this can lean a card without knowing
      or caring what else is moving it.

      The cost is that `rotate` takes ONE axis-angle pair, not a
      rotateX and a rotateY. That is fine: a rotation towards a
      point is a rotation about the axis perpendicular to it,
      which is exactly one axis. See axisFor below.

   2. The perspective goes on the PARENT, because a 3D rotation
      with no perspective anywhere is an affine squash: the card
      shears instead of leaning. `perspective` is not an
      independent property, so it cannot go on the card itself
      without also claiming its `transform`; it belongs on the
      container anyway, so that neighbouring cards share one
      vanishing point rather than each having their own.

   3. Nothing is touched unless the device actually hovers and
      the reader has not asked for less motion. On a phone this
      module attaches no listeners at all, and the note above
      `initTilt` is why that is the finished state rather than a
      gap somebody should fill with the handset's own sensor.

   And one that was tried and dropped: a 2px lift to go with the
   lean. It could not be done from here. The cards in .cards and
   .bento carry the scroll-driven `reveal-up` animation, which
   animates `translate` and holds its end state with fill:both,
   and an animation's output beats an inline style, so the lift
   silently did nothing on exactly the cards the home page is
   made of. A tilt that works everywhere beats a tilt plus a lift
   that works in half the places.
   ============================================================ */

/* Every card-like thing on the site. Matched at the container so
   that one listener serves a whole grid, rather than one per
   card, a home page has fourteen of these and an Insights page
   twenty-two.

   Both lists were twice this long and half of each named markup
   that no longer exists: `.bento`, `.doorway`, `.term-grid`,
   `.skill-grid`, `#wb-continue`, `.wb-news`, `.door`,
   `.term-card`, `.wb-card`, `.skill-card`. A selector that
   matches nothing costs a reader nothing, which is exactly why
   it sat here through four rewrites of the pages it named; what
   it costs is the next person, who reads this list to find out
   what a card is on this site and gets an answer that has been
   wrong since Stage 11.

   `.deck` and its `.card` are IN the list as of the front-door
   deck, which reverses the note that used to sit here. The
   GoCard's hover lift was the reason they were out: a lift under
   a lean was two answers to one gesture. The lift is gone from
   `@layer deck` now, precisely so that every clickable card on
   the site answers the pointer the same way, and the tile the
   front page is built from (`.gate-tile`) leans with them. The
   rule in `@layer components` names the same selectors this
   does, and the two lists have to agree. */
const SCENES = [".cards", ".news-grid", ".grid-2", ".grid-3", ".path",
  ".deck"];

const CARD = [".cell", ".news-card", ".card[data-kind=\"go\"]", ".gate-tile"].join(",");

const MAX_DEG = 2.6;   // the whole effect, corner to corner

/** The one axis-angle a lean is, or null at dead centre. */
interface Axis {
  x: number;
  y: number;
  deg: number;
}

/** The rotation that leans a card towards (nx, ny), where both
    are −1…1 from the card's centre.

    A rotation "towards the pointer" tips the near edge down and
    the far edge up, which for a pointer to the right is a
    positive rotation about Y, and for a pointer below is a
    NEGATIVE one about X (screen y grows downwards). Combining
    those two into a single axis-angle: the axis is the vector
    perpendicular to the pointer direction in the card's plane,
    and the angle is how far off centre the pointer is. */
function axisFor(nx: number, ny: number): Axis | null {
  const mag = Math.min(1, Math.hypot(nx, ny));
  if (!mag) return null;
  // perpendicular to (nx, ny), with the sign that leans towards it
  return { x: ny / mag, y: nx / mag, deg: mag * MAX_DEG };
}

/** Is the page moving under the pointer right now?

    `data-scrolling` is published by `next/components/glow.tsx`,
    which is the shell's own pointer component, and it is read
    here rather than watched: this file cannot import across the
    wall into `next/`, and an attribute on the root is the channel
    the shell already uses for `data-rail`, `data-sound` and
    `data-audience`.

    A page with no shell (the two files that are not routes) never
    sets it, and the answer is a plain false, which is exactly
    what those pages want: neither has a card on it. */
function pageScrolling(): boolean {
  return document.documentElement.hasAttribute("data-scrolling");
}

function attach(scene: HTMLElement): void {
  if (scene.dataset.tiltScene) return;
  scene.dataset.tiltScene = "on";
  scene.classList.add("tilt-scene");

  let held: HTMLElement | null = null;

  const clear = (card: HTMLElement | null) => {
    if (card) card.style.removeProperty("rotate");
  };

  /* ---- the event records, the frame writes ----

     This file predates `glow.tsx` and never got that file's
     rule, which its header states at length: `pointermove` fires
     as fast as the pointer reports, and a 1000Hz mouse reports
     sixteen times per frame. Every one of those events used to
     read this card's box out of the layout and write a rotation
     back into it, so a single sweep across the front page was
     sixteen forced layouts and sixteen style writes per frame, on
     the main thread, for one picture the screen can only draw
     once.

     Now the event does one thing, which is to remember itself,
     and the frame does the reading and the writing exactly once
     however many events arrived. The rectangle is read inside
     that frame rather than cached, because a cached box has to be
     invalidated by scrolling, by resizing, by a font arriving and
     by anything that reflows the grid, and one read per frame is
     cheaper than getting that list wrong. */
  let pending: PointerEvent | null = null;
  let frame = 0;

  const write = () => {
    frame = 0;
    const e = pending;
    pending = null;
    if (!e) return;

    const card = e.target instanceof Element ? e.target.closest<HTMLElement>(CARD) : null;
    if (card !== held) { clear(held); held = card; }
    if (!card || !scene.contains(card)) return;

    const r = card.getBoundingClientRect();
    if (!r.width || !r.height) return;

    const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
    const a = axisFor(nx, ny);
    if (!a) return;

    card.style.rotate = `${a.x.toFixed(3)} ${a.y.toFixed(3)} 0 ${a.deg.toFixed(2)}deg`;
  };

  scene.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;

    /* ---- and it stands down while the page is moving ----

       A reader scrolling with the pointer resting over the cards
       is making one gesture, not two. Every lean computed during
       a scroll is computed from a position that changed because
       the PAGE moved, so it is a lean nobody asked for, and it is
       asked for at the one moment the browser most needs the main
       thread: a scroll is the one interaction a reader can feel
       every dropped frame of.

       So nothing is scheduled at all. Not a cheaper frame, no
       frame: the lean freezes where it was, and the next real
       pointer move after the scroll picks it up. */
    if (pageScrolling()) return;

    pending = e;
    if (!frame) frame = requestAnimationFrame(write);
  }, { passive: true });

  /* Leaving the grid unwinds whatever was leaning. Without this a
     card keeps its lean for as long as the page is open, which
     reads as a rendering fault rather than as a gesture. */
  scene.addEventListener("pointerleave", () => {
    if (frame) { cancelAnimationFrame(frame); frame = 0; }
    pending = null;
    clear(held);
    held = null;
  });
}

/* ============================================================
   AND NOT ON A PHONE, WHICH IS A DECISION RATHER THAN A GAP

   There was a second half here that read `deviceorientation` and
   leaned every card on screen towards wherever the handset was
   pointing. It was removed on 4 September 2026 and must not come
   back in that shape, because it could not work and was not free.

   It could not work: `.tilt-scene { perspective: 1100px }` is
   declared inside `@media (hover: hover) and (pointer: fine)` in
   `@layer components`, so on a phone there is no perspective
   anywhere, and a 3D rotation with no perspective is an affine
   squash. The cards sheared rather than leaned, by 1.4 degrees,
   which is under what anybody can see on a handset in the hand.

   It was not free: a sensor reporting at up to 60Hz, and every
   frame of it a document-wide `querySelectorAll` plus a
   `getBoundingClientRect` per card to decide which were on
   screen. That is a forced layout per card per frame on the main
   thread of the cheap Android most of this site's readers hold,
   for a picture none of them could see.

   A lean answers a pointer aimed at one card. The ordinary sway
   of holding a phone is not that gesture, and matching it would
   need the perspective moved out of the hover query, which is a
   redesign rather than a fix.
   ============================================================ */

export function initTilt(): void {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll<HTMLElement>(SCENES.join(",")).forEach(attach);
}

/** For content built after load, the Insights grid, the home
    page's news slot, so a card that arrives late tilts too. */
export function tiltIn(root: Element | null | undefined): void {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!root) return;
  if (root instanceof HTMLElement && root.matches?.(SCENES.join(","))) attach(root);
  root.querySelectorAll?.<HTMLElement>(SCENES.join(",")).forEach(attach);
}
