"use client";

/* Where the light is, and which way the glass leans. `@layer glow` in
   `styles/site.css` decides how any of it LOOKS; this publishes only the
   numbers, on the element under the pointer:

   | `--gx` `--gy`   | where the light is, in per cent of the box |
   | `--gpx` `--gpy` | which way the glass is leaning, -1 to 1    |
   | `--gvx` `--gvy` | how fast it is coming round                |
   | `--tx` `--ty`   | the page offset, so the weave runs on      |

   THE LIGHT IS INSTANT AND THE GLASS HAS MASS, and the two are
   deliberately not one signal: `--gx`/`--gy` is assigned straight from the
   event, `--gpx`/`--gpy` is integrated towards the pointer through a
   critically damped spring. `--gvx`/`--gvy` falls out of that and the
   specular stretches along it.

   IT CARRIES NO LIST OF WHAT GLOWS. `--glow-w` is registered with
   `@property`, `inherits: false`, initial `0px`, which makes a non-zero
   computed value the membership test: the stylesheet stays the only place
   that says which classes glow, and a class added there is found here
   without being told.

   ONE LISTENER at the document, walking up from the target: delegation
   costs one short walk per frame and sees markup built after the first
   paint, which on this site is most of it. Nothing is written from the
   handler (a 120Hz pointer outruns the screen); the frame loop writes,
   and CANCELS ITSELF once the spring has arrived, so a still pointer over
   a settled card costs no frames.

   It never writes under `prefers-reduced-motion`, and that check is here
   AS WELL AS in the stylesheet, because an inline style beats a media
   query and one write would override the pinned light on every surface.
   It never runs without hover: `/tilt.js` answers the same gesture on a
   handset. Nothing is ever cleared, so a surface relights where you left
   it, and `--glow-a` is 0 meanwhile, so a stale position is invisible.

   It publishes `data-scrolling` on the root, read here and by `/tilt.js`,
   which cannot import across the wall: while the page moves under a
   resting hand nobody is aiming at anything. */

import { useEffect } from "react";

    /** A surface with no light in it: `--glow-w`'s registered initial
        value, so every non-glowing element computes to this string. */
const DARK = "0px";

    /** How far up to look before giving up. Anything deeper than this is
        the page, and walking to <html> every frame to find that out is the
        walk not worth making. */
const REACH = 12;

    /* ---- the spring ----
       Stiffness per second squared, damping at exactly critical. Changing
       STIFFNESS alone breaks the criticality, so DAMPING is derived rather
       than typed: the pair is one decision. About 90ms to cover most of
       the distance at 170. */
const STIFFNESS = 170;
const DAMPING = 2 * Math.sqrt(STIFFNESS);

    /** Below this, in units of the -1..1 lean, the spring has arrived: a
        tenth of a pixel on a 400px card. */
const SETTLED = 0.0006;

    /** The longest step the integrator will take. A backgrounded tab hands
        back a gap of seconds, and a spring integrated over one step that
        long explodes. Clamping to two frames at 30Hz makes a long gap a
        slow arrival rather than a launch. */
const MAX_STEP = 1 / 15;

    /** Velocity, scaled for a stylesheet to multiply and clamped so a
        flick does not stretch the highlight off the card. */
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

    /** Where the light is on one box, in per cent, clamped. The walk can
        return an element the pointer is outside of, and a light at 140% is
        a light nobody can see, which reads as the effect being broken. */
function over(el: HTMLElement, clientX: number, clientY: number) {
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return null;
  return {
    x: Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)),
    y: Math.max(0, Math.min(100, ((clientY - r.top) / r.height) * 100)),
    r,
  };
}

    /** The light, the weave offset, and the lean where it is not being
        sprung: what an ancestor gets. Three springs for one pointer is
        three times the arithmetic for a difference nobody can see. */
function paint(el: HTMLElement, clientX: number, clientY: number, lean: boolean) {
  const at = over(el, clientX, clientY);
  if (!at) return null;

  el.style.setProperty("--gx", `${at.x.toFixed(1)}%`);
  el.style.setProperty("--gy", `${at.y.toFixed(1)}%`);

      /* ---- texture fluency ----
         The grain is positioned by this, so the stipple runs CONTINUOUSLY
         across the page instead of restarting at every element's origin:
         without it a page of surfaces reads as separate stickers.

         The PAGE offset, not the viewport offset, or scrolling would slide
         the texture through the material. */
  el.style.setProperty("--tx", `${-(at.r.left + scrollX).toFixed(0)}px`);
  el.style.setProperty("--ty", `${-(at.r.top + scrollY).toFixed(0)}px`);

  if (!lean) {
    el.style.setProperty("--gpx", ((at.x - 50) / 50).toFixed(3));
    el.style.setProperty("--gpy", ((at.y - 50) / 50).toFixed(3));
  }
  return { tx: (at.x - 50) / 50, ty: (at.y - 50) / 50 };
}

    /** How long after the last scroll event the page is still considered
        to be moving. Trackpad momentum arrives as events with gaps, so
        much under a tenth of a second flickers the attribute through one
        flick, and much over it keeps a stopped reader waiting. */
const SCROLL_TAIL = 140;

export function Glow() {
      /* ---- while the page is moving, nobody is aiming ----
         Its own effect, deliberately outside the three guards below: those
         ask whether there is a pointer to follow, this asks whether the
         page is under one, and `/tilt.js` wants the answer on a phone too.

         `capture: true`, because a scroll event does not bubble from an
         element that scrolls, and the wide blocks here scroll inside their
         own boxes. */
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
          /* Only when it changes: `setAttribute` with the value it already
             has still invalidates style on the root, which is the whole
             document, and a scroll fires this dozens of times a second. */
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

        /* The last element the walk resolved, against the target it was
           resolved from: a pointer crossing one button fires dozens of
           moves off the same node. Keyed on the TARGET, so moving from a
           card on to a button inside it still finds the button. */
    let fromNode: Element | null = null;
    let fromSurface: HTMLElement | null = null;

        /* The spring's whole state: where the lean is, where it is going,
           and how fast. One set, for the one surface under the pointer. */
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
              /* A NEW surface starts where the pointer already is rather
                 than travelling from the last card's lean: springing across
                 the gap would swing it from a corner it was never at. */
          const fresh = el !== sprung;
          const at = paint(el, e.clientX, e.clientY, true);
          if (at) {
            tx = at.tx; ty = at.ty;
            if (fresh) { sprung = el; px = tx; py = ty; vx = 0; vy = 0; last = now; }
          }

              /* ---- and the light reaches the glass underneath ----
                 There is no light transport in CSS, so a lit surface spills
                 on to the glass under it by telling the ancestor WHERE the
                 light is: the ancestor is hovered too, so it is already
                 lighting and only lacks the position. Without this the
                 parent lights at its own centre while the child lights
                 under the pointer, which reads as two unrelated effects.

                 Bounded to two ancestors: a chip inside a card inside a
                 pane is the deepest stack here, and an unbounded walk would
                 write on the rail and the body every frame for nothing. */
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
             two-dimensional one: the same thing for a linear force, and
             half the arithmetic. */
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

          /* THE LOOP IS WHAT STOPS, NOT THE SPRING. Leaving `sprung` set
             is what lets the next move on the same card carry on rather
             than snapping to the pointer as though the card were new. */
      if (moving) frame = requestAnimationFrame(step);
      else last = 0;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;

          /* Not a cheaper frame: no frame. The light freezes where the
             reader last aimed it and the first real move after the scroll
             picks it up. `fromNode` is dropped too, because the page has
             moved and that node is unlikely to still be under the
             pointer. */
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
