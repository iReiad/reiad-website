"use client";

/* ============================================================
   glow.tsx: where the light is.

   Every button, chip, card and pane on this site carries a light
   inside it, and the light follows the pointer. `@layer glow` in
   `styles/site.css` is the whole of what that LOOKS like; this
   component is the two numbers it needs and nothing else.

   The contract is two custom properties on the element under the
   pointer, `--gx` and `--gy`, both percentages of its own box.
   That is deliberately the smallest thing that could work: the
   stylesheet decides how wide the light spreads, how bright it
   is, what a chip gets against what a card gets, and how it
   fades. Move any of that here and a designer has to read
   TypeScript to change a radius.

   ---- it does not carry a list of what glows ----

   This is the part worth reading. There are around sixty class
   names on the glowing side of the design language, and most of
   them are still classes rather than components: 251 lesson
   cards are built in a loop by a browser module. A copy of that
   list here would be a second place to say it and a second place
   for it to go stale, which is the failure CLAUDE.md opens with.

   So it ASKS THE STYLESHEET. `--glow-w` is registered with
   `@property`, `inherits: false` and an initial value of `0px`,
   which makes it a membership test: an element whose computed
   `--glow-w` is not zero is a glowing surface, and the stylesheet
   remains the only place that says which ones are. Add a class
   to the list in `@layer glow` and this finds it without being
   told.

   ---- one listener, not one per element ----

   Registering a listener on each surface is hundreds of closures
   and hundreds of registrations to tear down, and it cannot see
   a surface that arrives later, which on this site is most of
   them: the market board, the palette, the account panels and
   every progress ring are built after the first paint.

   So it listens once, at the document, and walks up from the
   target. Delegation costs one short walk per frame and knows
   about markup that did not exist when it mounted.

   ---- and one write per frame ----

   `pointermove` fires as fast as the pointer reports, which on a
   120Hz trackpad is faster than the screen. Writing an inline
   style on each one is a style recalculation the browser then
   throws away. The handler stores the event and a single rAF
   does the write.

   ---- what it deliberately does not do ----

   It never writes when the reader has asked for less motion, and
   that check is HERE as well as in the stylesheet, because an
   inline style beats a media query: `@layer glow` pins the light
   to the centre under `prefers-reduced-motion`, and one write
   from this file would override it on every surface. Either
   place alone can be undone by the other, so both say it.

   It never runs on a device with no hover. A phone has no
   pointer to follow, the light would sit wherever the last tap
   was, and `/tilt.js` already answers the same gesture there
   with the handset's own orientation.

   Nothing is ever cleared. A surface keeps the last position the
   pointer had on it, which is exactly where its light was when
   it faded out, so returning to it lights the place you left
   rather than the middle. `--glow-a` is 0 for the whole time a
   surface is not hovered, so a stale position is invisible.
   ============================================================ */

import { useEffect } from "react";

/** A surface with no light in it. `--glow-w` is registered with
    this as its initial value, so every element that is not a
    glowing surface computes to exactly this string. */
const DARK = "0px";

/** How far up to look before giving up. A control is a handful
    of elements deep inside its surface; anything deeper than
    this is the page, and walking to <html> on every frame to
    find that out is the walk not worth making. */
const REACH = 12;

function surfaceAt(target: Element | null): HTMLElement | null {
  let el: Element | null = target;
  for (let i = 0; el && i < REACH; i += 1) {
    if (el instanceof HTMLElement) {
      const w = getComputedStyle(el).getPropertyValue("--glow-w").trim();
      if (w && w !== DARK) return el;
    }
    el = el.parentElement;
  }
  return null;
}

export function Glow() {
  useEffect(() => {
    if (!window.matchMedia) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending: PointerEvent | null = null;
    let frame = 0;
    /* The last element the walk resolved, against the target it
       resolved it from. A pointer crossing one button fires
       dozens of moves off the same node, and this turns all but
       the first into no work at all. Keyed on the TARGET rather
       than on the surface, so moving from a card on to a button
       inside it still finds the button. */
    let fromNode: Element | null = null;
    let fromSurface: HTMLElement | null = null;

    const draw = () => {
      frame = 0;
      const e = pending;
      pending = null;
      if (!e) return;

      const node = e.target instanceof Element ? e.target : null;
      if (node !== fromNode) {
        fromNode = node;
        fromSurface = surfaceAt(node);
      }
      const el = fromSurface;
      if (!el) return;

      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;

      /* Clamped, because the walk can return an element the
         pointer is outside of: a card with a negative margin on
         a child, or a control mid-transition. A light at 140% is
         a light nobody can see, which reads as the effect being
         broken rather than as the edge case it is. */
      const x = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.clientY - r.top) / r.height) * 100));

      el.style.setProperty("--gx", `${x.toFixed(1)}%`);
      el.style.setProperty("--gy", `${y.toFixed(1)}%`);

      /* ---- and the same position again, signed and unitless ----

         `--gx` and `--gy` are percentages, which is what a gradient
         needs and what a box-shadow offset cannot use: CSS has no way
         to turn a percentage into a length. The material's edge is a
         box-shadow, so it needs the pointer as a NUMBER it can
         multiply by a pixel.

         -1 to 1 from the centre, which is also the axis `tilt.ts`
         leans the card on. That is the whole point: a card tilted so
         its bottom right comes towards you should show its thickness
         THERE, and an edge that opens by the same amount all the way
         round is a card that got brighter rather than one that
         turned. */
      el.style.setProperty("--gpx", ((x - 50) / 50).toFixed(3));
      el.style.setProperty("--gpy", ((y - 50) / 50).toFixed(3));

      /* ---- texture fluency ----

         The grain is positioned by this, so the stipple runs
         CONTINUOUSLY across the page instead of restarting at
         every element's own origin. Without it a card and the
         pane behind it have textures that do not line up, and a
         page of surfaces reads as separate stickers rather than
         as pieces cut from one sheet of glass.

         The page offset, not the viewport offset: scrolling must
         not slide the texture through the material. `scrollX/Y`
         is what makes it the document's coordinate space. */
      el.style.setProperty("--tx", `${-(r.left + scrollX).toFixed(0)}px`);
      el.style.setProperty("--ty", `${-(r.top + scrollY).toFixed(0)}px`);

      /* ---- and the light reaches the glass underneath ----

         A lit surface sitting on another glass surface spills on
         to it, which is the one thing in the reference the site
         had none of. There is no light transport in CSS, so this
         is done by telling the ancestor WHERE the light is: it is
         hovered too (the pointer is inside it), so it is already
         lighting, and all it lacks is the position.

         Without this the parent lights at its own centre while
         the child lights under the pointer, which reads as two
         unrelated effects rather than one light in a stack of
         glass.

         Bounded to two ancestors. A chip inside a card inside a
         pane is the deepest stack this site builds, and an
         unbounded walk would write on the rail and the body on
         every frame for nothing. */
      let up: HTMLElement | null = el.parentElement;
      for (let n = 0; up && n < 2; n += 1) {
        const over = surfaceAt(up);
        if (!over) break;
        const o = over.getBoundingClientRect();
        if (o.width && o.height) {
          over.style.setProperty("--gx",
            `${Math.max(0, Math.min(100, ((e.clientX - o.left) / o.width) * 100)).toFixed(1)}%`);
          over.style.setProperty("--gy",
            `${Math.max(0, Math.min(100, ((e.clientY - o.top) / o.height) * 100)).toFixed(1)}%`);
          over.style.setProperty("--tx", `${-(o.left + scrollX).toFixed(0)}px`);
          over.style.setProperty("--ty", `${-(o.top + scrollY).toFixed(0)}px`);
        }
        up = over.parentElement;
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      pending = e;
      if (!frame) frame = requestAnimationFrame(draw);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
