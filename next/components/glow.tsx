"use client";

/* ============================================================
   glow.tsx: where the light is, and which way the glass leans.

   Every button, chip, card and pane on this site carries a light
   inside it, and the light follows the pointer. `@layer glow` in
   `styles/site.css` is the whole of what that LOOKS like; this
   component is the numbers it needs and nothing else.

   The contract is a handful of custom properties on the element
   under the pointer. That is deliberately the smallest thing that
   could work: the stylesheet decides how wide the light spreads,
   how bright it is, what a chip gets against what a card gets,
   and how it fades. Move any of that here and a designer has to
   read TypeScript to change a radius.

   | `--gx` `--gy`   | where the light is, in per cent of the box |
   | `--gpx` `--gpy` | which way the glass is leaning, -1 to 1    |
   | `--gvx` `--gvy` | how fast it is coming round                |
   | `--tx` `--ty`   | the page offset, so the weave runs on      |

   ---- the light is instant, the glass has mass ----

   The first pair and the second are deliberately not the same
   signal, and the split is the whole reason this file grew a
   loop.

   A light does not lag. Move a lamp over a table and it is over
   the table in the same instant, so `--gx`/`--gy` is assigned
   from the event: no smoothing, no easing, nothing between the
   pointer and the highlight.

   A sheet of glass has weight. It takes a moment to come round
   and it settles rather than snapping, so `--gpx`/`--gpy` is
   INTEGRATED towards the pointer through a critically damped
   spring. `DAMPING` is exactly `2 * Math.sqrt(STIFFNESS)`, which
   is the one value at which a spring arrives as fast as it can
   without crossing the target: softer and the picture drags
   behind the hand, stiffer and it wobbles, and a wobble reads as
   a bug rather than as weight.

   That gives the third pair away for nothing. `--gvx`/`--gvy` is
   how fast the lean is changing, and the specular band in
   `@layer relief` stretches along it, which is what a real
   highlight does when the light crosses a surface faster than the
   surface can answer.

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

   ---- and the loop stops ----

   `pointermove` fires as fast as the pointer reports, which on a
   120Hz trackpad is faster than the screen, so nothing is written
   from the handler: it records the event and the frame loop does
   the writing. The loop then keeps running while the spring is
   still travelling and CANCELS ITSELF once the error and the
   velocity are both under a threshold nobody can see. A still
   pointer over a settled card costs no frames at all.

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

   ---- and it publishes one fact for everybody else ----

   `data-scrolling` on the root, for as long as the page is
   moving. It is here because this is the shell's pointer
   component and the fact is about the pointer: while the page
   moves under a resting hand, nobody is aiming at anything, and
   every light and every lean computed in that moment is computed
   from a position that changed because the page moved.

   Read by this file, by `/tilt.js`, which cannot import across
   the wall and reads the attribute instead, and available to the
   stylesheet. The attribute is the state, which is the same
   arrangement `data-rail` and `data-sound` already are.
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

/* ---- the spring ----

   Stiffness in units of "per second squared", damping at exactly
   critical. Changing STIFFNESS alone breaks the criticality, so
   DAMPING is derived rather than typed: the pair is one decision.

   About 90ms to cover most of the distance at 170, which is
   quick enough that nobody experiences it as lag and slow enough
   that the glass reads as glass rather than as a cursor. */
const STIFFNESS = 170;
const DAMPING = 2 * Math.sqrt(STIFFNESS);

/** Below this, in units of the -1..1 lean, the spring has
    arrived. A tenth of a pixel on a 400px card, which is under
    the smallest thing a screen can draw. */
const SETTLED = 0.0006;

/** The longest step the integrator will take. A backgrounded tab
    hands back a gap of seconds, and a spring integrated over one
    step that long explodes: the position overshoots by orders of
    magnitude and the card flies off. Clamping to two frames at
    30Hz makes a long gap a slow arrival rather than a launch. */
const MAX_STEP = 1 / 15;

/** Velocity, scaled into something a stylesheet can multiply and
    clamped so a flick across the screen does not stretch the
    highlight off the card. */
const VMAX = 6;

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

/** Where the light is on one box, in per cent, clamped.

    The walk can return an element the pointer is outside of: a
    card with a negative margin on a child, or a control caught
    mid-transition. A light at 140% is a light nobody can see,
    which reads as the effect being broken rather than as the
    edge case it is. */
function over(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return {
    x: Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)),
    y: Math.max(0, Math.min(100, ((clientY - r.top) / r.height) * 100)),
    r,
  };
}

/** The light, the weave offset, and the lean where the lean is
    not being sprung. Everything except the spring, in other
    words, which is what an ancestor gets: two cards deep is not
    where anybody is looking, and three springs to integrate for
    one pointer is three times the arithmetic for a difference
    nobody can see. */
function paint(el: HTMLElement, clientX: number, clientY: number, lean: boolean) {
  const at = over(el, clientX, clientY);
  if (!at) return null;

  el.style.setProperty("--gx", `${at.x.toFixed(1)}%`);
  el.style.setProperty("--gy", `${at.y.toFixed(1)}%`);

  /* ---- texture fluency ----

     The grain is positioned by this, so the stipple runs
     CONTINUOUSLY across the page instead of restarting at every
     element's own origin. Without it a card and the pane behind
     it have textures that do not line up, and a page of surfaces
     reads as separate stickers rather than as pieces cut from
     one sheet of glass.

     The page offset, not the viewport offset: scrolling must not
     slide the texture through the material. `scrollX/Y` is what
     makes it the document's coordinate space. */
  el.style.setProperty("--tx", `${-(at.r.left + scrollX).toFixed(0)}px`);
  el.style.setProperty("--ty", `${-(at.r.top + scrollY).toFixed(0)}px`);

  if (!lean) {
    el.style.setProperty("--gpx", ((at.x - 50) / 50).toFixed(3));
    el.style.setProperty("--gpy", ((at.y - 50) / 50).toFixed(3));
  }
  return { tx: (at.x - 50) / 50, ty: (at.y - 50) / 50 };
}

/** How long after the last scroll event the page is still
    considered to be moving. Momentum on a trackpad arrives as a
    run of events with gaps, so a value under about a tenth of a
    second flickers the attribute on and off through one flick;
    much over it and a reader who has stopped waits to be
    answered. */
const SCROLL_TAIL = 140;

export function Glow() {
  /* ---- while the page is moving, nobody is aiming ----

     Its own effect, and deliberately outside the three guards
     below. Those are about whether there is a pointer to follow;
     this is about whether the page is under one, and a phone
     wants the answer too: `/tilt.js` answers a handset's
     orientation there and should stand down mid-scroll for the
     same reason.

     `capture: true` because a scroll event does not bubble from
     an element that scrolls. The wide blocks on this site scroll
     inside their own boxes, and a chart being dragged sideways is
     as much a scroll as the page going down. */
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    let on = false;

    const stop = () => {
      timer = 0;
      on = false;
      root.removeAttribute("data-scrolling");
    };

    const start = () => {
      /* Only when it changes. `setAttribute` with the value it
         already has still invalidates style on the root, which on
         this site is the whole document, and a scroll fires this
         handler dozens of times a second. */
      if (!on) { on = true; root.setAttribute("data-scrolling", ""); }
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(stop, SCROLL_TAIL);
    };

    addEventListener("scroll", start, { passive: true, capture: true });
    return () => {
      removeEventListener("scroll", start, { capture: true });
      if (timer) clearTimeout(timer);
      stop();
    };
  }, []);

  useEffect(() => {
    if (!window.matchMedia) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let pending: PointerEvent | null = null;
    let frame = 0;
    let last = 0;

    /* The last element the walk resolved, against the target it
       resolved it from. A pointer crossing one button fires
       dozens of moves off the same node, and this turns all but
       the first into no work at all. Keyed on the TARGET rather
       than on the surface, so moving from a card on to a button
       inside it still finds the button. */
    let fromNode: Element | null = null;
    let fromSurface: HTMLElement | null = null;

    /* The spring's whole state: where the lean is now, where it
       is going, and how fast it is travelling. One set, for the
       one surface under the pointer. */
    let sprung: HTMLElement | null = null;
    let px = 0, py = 0, vx = 0, vy = 0, tx = 0, ty = 0;

    const step = (now: number) => {
      frame = 0;

      const e = pending;
      pending = null;

      if (e) {
        const node = e.target instanceof Element ? e.target : null;
        if (node !== fromNode) {
          fromNode = node;
          fromSurface = surfaceAt(node);
        }
        const el = fromSurface;
        if (el) {
          /* A NEW surface starts where the pointer already is
             rather than travelling there from the last card's
             lean. Springing across the gap between two cards
             would swing the new one from a corner it was never
             at, which looks like the picture catching up rather
             than like the card answering. */
          const fresh = el !== sprung;
          const at = paint(el, e.clientX, e.clientY, true);
          if (at) {
            tx = at.tx; ty = at.ty;
            if (fresh) { sprung = el; px = tx; py = ty; vx = 0; vy = 0; last = now; }
          }

          /* ---- and the light reaches the glass underneath ----

             A lit surface sitting on another glass surface spills
             on to it, which is the one thing in the reference the
             site had none of. There is no light transport in CSS,
             so this is done by telling the ancestor WHERE the
             light is: it is hovered too (the pointer is inside
             it), so it is already lighting, and all it lacks is
             the position.

             Without this the parent lights at its own centre
             while the child lights under the pointer, which reads
             as two unrelated effects rather than as one light in
             a stack of glass.

             Bounded to two ancestors. A chip inside a card inside
             a pane is the deepest stack this site builds, and an
             unbounded walk would write on the rail and the body
             on every frame for nothing. */
          let up: HTMLElement | null = el.parentElement;
          for (let n = 0; up && n < 2; n += 1) {
            const outer = surfaceAt(up);
            if (!outer) break;
            paint(outer, e.clientX, e.clientY, false);
            up = outer.parentElement;
          }
        }
      }

      if (!sprung) return;

      const dt = Math.min(MAX_STEP, last ? (now - last) / 1000 : 1 / 60);
      last = now;

      /* Two independent one-dimensional springs rather than one
         two-dimensional one, which is the same thing for a
         linear force and half the arithmetic. */
      vx += (-STIFFNESS * (px - tx) - DAMPING * vx) * dt;
      vy += (-STIFFNESS * (py - ty) - DAMPING * vy) * dt;
      px += vx * dt;
      py += vy * dt;

      sprung.style.setProperty("--gpx", px.toFixed(4));
      sprung.style.setProperty("--gpy", py.toFixed(4));
      sprung.style.setProperty("--gvx",
        Math.max(-1, Math.min(1, vx / VMAX)).toFixed(3));
      sprung.style.setProperty("--gvy",
        Math.max(-1, Math.min(1, vy / VMAX)).toFixed(3));

      const moving =
        Math.abs(px - tx) > SETTLED || Math.abs(py - ty) > SETTLED
        || Math.abs(vx) > SETTLED * 60 || Math.abs(vy) > SETTLED * 60;

      /* THE LOOP IS WHAT STOPS, NOT THE SPRING. Leaving `sprung`
         set is what lets the next pointer move on the same card
         carry on from where this one finished, rather than
         snapping to the pointer as though the card were new. */
      if (moving) frame = requestAnimationFrame(step);
      else last = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

      /* Not a cheaper frame: no frame. See the note at the top
         about `data-scrolling`. The light freezes where it was,
         which is where the reader last aimed it, and the first
         real move after the scroll picks it up.

         `fromNode` is dropped as well, because the page has moved
         and the node the walk last resolved is very unlikely to
         still be the one under the pointer. */
      if (document.documentElement.hasAttribute("data-scrolling")) {
        pending = null;
        fromNode = null;
        return;
      }

      pending = e;
      if (!frame) frame = requestAnimationFrame(step);
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
