/* ============================================================
   tilt.js, cards lean very slightly towards the pointer.

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
   twenty-two. */
const SCENES = [
  ".bento", ".cards", ".doorway", ".door-pair", ".news-grid",
  ".term-grid", ".grid-2", ".grid-3", ".skill-grid", "#wb-continue",
  ".wb-news", ".path",
];

const CARD = [
  ".cell", ".door", ".news-card", ".term-card", ".wb-card", ".skill-card",
].join(",");

const MAX_DEG = 2.6;   // the whole effect, corner to corner

/** The rotation that leans a card towards (nx, ny), where both
    are −1…1 from the card's centre.

    A rotation "towards the pointer" tips the near edge down and
    the far edge up, which for a pointer to the right is a
    positive rotation about Y, and for a pointer below is a
    NEGATIVE one about X (screen y grows downwards). Combining
    those two into a single axis-angle: the axis is the vector
    perpendicular to the pointer direction in the card's plane,
    and the angle is how far off centre the pointer is. */
function axisFor(nx, ny) {
  const mag = Math.min(1, Math.hypot(nx, ny));
  if (!mag) return null;
  // perpendicular to (nx, ny), with the sign that leans towards it
  return { x: ny / mag, y: nx / mag, deg: mag * MAX_DEG };
}

function attach(scene) {
  if (scene.dataset.tiltScene) return;
  scene.dataset.tiltScene = "on";
  scene.classList.add("tilt-scene");

  let held = null;

  const clear = (card) => {
    if (card) card.style.removeProperty("rotate");
  };

  scene.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const card = e.target.closest(CARD);
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

export function initTilt() {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  document.querySelectorAll(SCENES.join(",")).forEach(attach);
}

/** For content built after load, the Insights grid, the home
    page's news slot, so a card that arrives late tilts too. */
export function tiltIn(root) {
  if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (!root) return;
  if (root.matches?.(SCENES.join(","))) attach(root);
  root.querySelectorAll?.(SCENES.join(",")).forEach(attach);
}
