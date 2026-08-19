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
      module attaches no listeners at all.

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
  ".deck", ".gate-deck"];

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

function attach(scene: HTMLElement): void {
  if (scene.dataset.tiltScene) return;
  scene.dataset.tiltScene = "on";
  scene.classList.add("tilt-scene");

  let held: HTMLElement | null = null;

  const clear = (card: HTMLElement | null) => {
    if (card) card.style.removeProperty("rotate");
  };

  scene.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
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
  }, { passive: true });

  /* Leaving the grid unwinds whatever was leaning. Without this a
     card keeps its lean for as long as the page is open, which
     reads as a rendering fault rather than as a gesture. */
  scene.addEventListener("pointerleave", () => { clear(held); held = null; });
}

/* ============================================================
   THE SAME GESTURE ON A PHONE

   A phone has no pointer to lean towards, so the cards there
   were flat. It does know which way it is being held, and a
   reader tilting the handset is making the same gesture with
   the whole device that a pointer makes across a card, so the
   cards lean towards the same place: wherever the top of the
   screen is pointing.

   WHY THIS IS SAFE TO SHIP, IN ORDER

   1. It never asks for anything. iOS 13 and later require an
      explicit DeviceOrientationEvent.requestPermission() from
      inside a user gesture, and a site that opens with a
      permission prompt for a decoration deserves the answer it
      gets. So this listens, and on iOS it simply never hears
      anything. That is the intended outcome, not a bug to fix
      later.

   2. It gives up if nothing arrives. Desktop browsers, locked
      orientation, permission never granted, a device with no
      accelerometer: if no event lands within three seconds the
      listener is removed and the module is inert for the rest of
      the page's life.

   3. It costs one rAF per frame at most, and only while the
      handset is actually moving. The sensor fires at up to 60Hz;
      writing to the DOM on every one of those would be the whole
      frame budget on a cheap Android, which is the phone most of
      this site's readers have. The handler stores two numbers,
      one rAF applies them, and the cards it touches are the ones
      on screen.

   4. It is deliberately smaller than the pointer version: 1.4
      degrees against 2.6. A pointer tilt answers a deliberate
      movement over one card. This answers the ordinary sway of
      holding a phone, and the same angle that reads as a lean
      under a cursor reads as a wobble in the hand.

   5. Every guard the pointer version has, this has too:
      prefers-reduced-motion, and never on a device that hovers.
   ============================================================ */

/** Every card, expressed as a child of every scene.

    `> :is(CARD)` rather than the `> *` this used to be, and the
    change is what let the deck join SCENES: a deck holds info
    cards and a front-door deck holds a wrapper column, and "any
    child of a scene" would have leaned a paragraph card and a
    layout `<aside>` along with the doors. Only the things a
    pointer would tilt sway in the hand. */
const CARDS_IN_SCENES = SCENES.map((sel) => `${sel} > :is(${CARD})`).join(",");

const PHONE_DEG = 1.4;     // half the pointer tilt, and for a reason
const PHONE_RANGE = 26;    // degrees of handset tilt for the full lean
const GIVE_UP_MS = 3000;   // no event by then: this device cannot do it

let phoneStarted = false;

function initPhoneTilt(): void {
  if (phoneStarted) return;
  phoneStarted = true;

  if (matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof DeviceOrientationEvent === "undefined") return;

  let frame = 0;
  let heard = false;
  let beta: number | null = null;    // front-to-back, degrees
  let gamma: number | null = null;   // left-to-right, degrees
  /** How the handset was held when we started. */
  let base: { beta: number; gamma: number } | null = null;

  const apply = () => {
    frame = 0;
    /* Unreachable: nothing schedules this until onOrient has set
       all three. Written out because the alternative is asserting
       they are set, and an assertion stops being true the day
       something else calls this. */
    if (beta === null || gamma === null || base === null) return;
    /* `SCENES.join(",") + " > *"` would have bound the child
       combinator to the LAST selector in the list only, which is
       how this shipped broken the first time: one scene tilted
       and the other twelve did not. Build the descendant list
       properly. */
    const cards = document.querySelectorAll<HTMLElement>(CARDS_IN_SCENES);
    if (!cards.length) return;

    /* Normalised to -1…1 the same way the pointer version reads a
       position across a card, so both ends of this module speak
       the same language to axisFor. */
    const nx = clamp((gamma - base.gamma) / PHONE_RANGE);
    const ny = clamp((beta - base.beta) / PHONE_RANGE);
    const a = axisFor(nx, ny);

    for (const card of cards) {
      /* Only what is on screen. A long page has forty of these
         and thirty-eight of them are nowhere near the reader. */
      const r = card.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || !r.width) {
        card.style.removeProperty("rotate");
        continue;
      }
      if (!a) card.style.removeProperty("rotate");
      else card.style.rotate =
        `${a.x.toFixed(3)} ${a.y.toFixed(3)} 0 ${(a.deg * PHONE_DEG / MAX_DEG).toFixed(2)}deg`;
    }
  };

  const onOrient = (e: DeviceOrientationEvent) => {
    if (e.beta == null || e.gamma == null) return;
    heard = true;
    beta = e.beta;
    gamma = e.gamma;
    /* The first reading is the rest position. Someone reading in
       bed holds a phone at sixty degrees and is not tilting it;
       measuring from where they started means the cards are level
       when the handset is still, whatever "still" happens to be. */
    base ??= { beta, gamma };
    if (!frame) frame = requestAnimationFrame(apply);
  };

  addEventListener("deviceorientation", onOrient, { passive: true });

  setTimeout(() => {
    if (heard) {
      // Scenes need the perspective the pointer version's class carries.
      document.querySelectorAll(SCENES.join(",")).forEach((s) => s.classList.add("tilt-scene"));
      return;
    }
    removeEventListener("deviceorientation", onOrient);
  }, GIVE_UP_MS);
}

const clamp = (n: number) => Math.max(-1, Math.min(1, n));

export function initTilt(): void {
  /* The phone half first, because it is the one that has to
     decide whether this device can do it at all. */
  initPhoneTilt();

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
