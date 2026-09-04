/* tilt.ts: cards lean very slightly towards the pointer.

   It uses `rotate`, NOT `transform`: half the cards here already
   animate `transform` on hover, and `rotate`/`translate`/`scale`
   compose with it rather than replacing it. The cost is one
   axis-angle pair, which is all a rotation towards a point needs:
   see `axisFor`.
   The perspective goes on the PARENT. With none anywhere a 3D
   rotation is an affine squash, and `perspective` is not an
   independent property, so on the card it would claim the card's
   `transform`. Nothing is touched on a device that cannot hover
   or for a reader who asked for less motion. */
/* Every card-like thing on the site, matched at the CONTAINER so
   one listener serves a whole grid. A selector here that matches
   nothing costs nothing and quietly makes this list a wrong
   answer to "what is a card on this site", so keep it true.
   `@layer components` names the same selectors and the two lists
   have to agree. A card in this list must not also have a hover
   lift: a lift under a lean is two answers to one gesture. */
const SCENES = [".cards", ".news-grid", ".grid-2", ".grid-3", ".path",
    ".deck"];
const CARD = [".cell", ".news-card", ".card[data-kind=\"go\"]", ".gate-tile"].join(",");
const MAX_DEG = 2.6; // the whole effect, corner to corner
/** The rotation that leans a card towards (nx, ny), both −1…1
    from the card's centre. The axis is the vector perpendicular
    to the pointer direction in the card's plane and the angle is
    how far off centre it is; screen y grows downwards, which is
    where the signs come from. */
function axisFor(nx, ny) {
    const mag = Math.min(1, Math.hypot(nx, ny));
    if (!mag)
        return null;
    // perpendicular to (nx, ny), with the sign that leans towards it
    return { x: ny / mag, y: nx / mag, deg: mag * MAX_DEG };
}
/** Is the page moving under the pointer right now?
    `data-scrolling` is published by `next/components/glow.tsx`
    and READ here rather than watched: this file cannot import
    across the wall into `next/`. A page with no shell never sets
    it and gets a plain false, which is right: it has no cards. */
function pageScrolling() {
    return document.documentElement.hasAttribute("data-scrolling");
}
function attach(scene) {
    if (scene.dataset.tiltScene)
        return;
    scene.dataset.tiltScene = "on";
    scene.classList.add("tilt-scene");
    let held = null;
    const clear = (card) => {
        if (card)
            card.style.removeProperty("rotate");
    };
    /* THE EVENT RECORDS AND THE FRAME WRITES. `pointermove` fires
       as fast as the pointer reports and a 1000Hz mouse reports
       sixteen times per frame, so reading the box and writing the
       rotation per event is sixteen forced layouts a frame. The
       rectangle is read inside the frame rather than cached,
       because a cached box has to be invalidated by scrolling, a
       resize, a font arriving and anything that reflows a grid. */
    let pending = null;
    let frame = 0;
    const write = () => {
        frame = 0;
        const e = pending;
        pending = null;
        if (!e)
            return;
        const card = e.target instanceof Element ? e.target.closest(CARD) : null;
        if (card !== held) {
            clear(held);
            held = card;
        }
        if (!card || !scene.contains(card))
            return;
        const r = card.getBoundingClientRect();
        if (!r.width || !r.height)
            return;
        const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
        const a = axisFor(nx, ny);
        if (!a)
            return;
        card.style.rotate = `${a.x.toFixed(3)} ${a.y.toFixed(3)} 0 ${a.deg.toFixed(2)}deg`;
    };
    scene.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch")
            return;
        /* It stands down while the page is moving: every lean
           computed during a scroll comes from a position that changed
           because the PAGE moved, at the one moment a reader can feel
           every dropped frame. Not a cheaper frame, NO frame. */
        if (pageScrolling())
            return;
        pending = e;
        if (!frame)
            frame = requestAnimationFrame(write);
    }, { passive: true });
    /* Leaving the grid unwinds whatever was leaning. Without this a
       card keeps its lean for as long as the page is open, which
       reads as a rendering fault rather than as a gesture. */
    scene.addEventListener("pointerleave", () => {
        if (frame) {
            cancelAnimationFrame(frame);
            frame = 0;
        }
        pending = null;
        clear(held);
        held = null;
    });
}
/* AND NOT ON A PHONE, WHICH IS A DECISION RATHER THAN A GAP. A
   `deviceorientation` half must not come back in that shape.
   It cannot work: `.tilt-scene { perspective: 1100px }` sits
   inside `@media (hover: hover) and (pointer: fine)`, so on a
   phone there is no perspective anywhere and a 3D rotation with
   none is an affine squash. The cards sheared by 1.4 degrees.
   And it is not free: a 60Hz sensor, with a document-wide
   `querySelectorAll` and a `getBoundingClientRect` per card each
   frame, on the cheap Android most of this site's readers hold.
   Matching the sway of a held phone would need the perspective
   moved out of the hover query, which is a redesign. */
export function initTilt() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches)
        return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    document.querySelectorAll(SCENES.join(",")).forEach(attach);
}
/** For content built after load, the Insights grid, the home
    page's news slot, so a card that arrives late tilts too. */
export function tiltIn(root) {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches)
        return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches)
        return;
    if (!root)
        return;
    if (root instanceof HTMLElement && root.matches?.(SCENES.join(",")))
        attach(root);
    root.querySelectorAll?.(SCENES.join(",")).forEach(attach);
}
