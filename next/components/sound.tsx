"use client";

/* ============================================================
   sound.tsx: the one listener that lets anything ask for a cue.

   `lib/sound.ts` is the synth. This is how the rest of the site
   reaches it, and it is deliberately two mechanisms and no more:

     a component imports `cue()` and calls it, which is what
     everything under `next/` does;

     anything else dispatches `reiad:sound` on the document with
     the cue's name in `detail`, which is how a module in `aab/`
     asks, since it cannot import across the wall.

   ---- and one delegated listener for the quiet one ----

   A press is the cue a reader hears hundreds of times and the one
   nothing would ever remember to fire by hand, so it is
   delegated: one listener at the document, on `pointerdown`
   rather than `click`, because a sound that arrives on the way
   down is a sound that happened when the finger did.

   Anything that fires a cue of its OWN is skipped, by
   `[data-cue]` or by being inside something that carries it: a
   tick button that said both would be a press and a fanfare a
   frame apart.

   ---- what it cannot do ----

   A press on a LINK is not delegated, and the reason is worth
   writing down rather than rediscovering. A link navigates, the
   document is torn down, and every scheduled note goes with it,
   so the cue is a click rather than a note. `next` and `prev` are
   fired anyway by the article footer, because those two are 110ms
   and short enough to land, and because on a client-side
   navigation they play in full.
   ============================================================ */

import { useEffect } from "react";
import { cue, CUES, SOUND_EVENT, type Cue } from "../lib/sound";

export function Sound() {
  useEffect(() => {
    const asked = (e: Event) => {
      const name = (e as CustomEvent).detail;
      if (typeof name === "string") cue(name as Cue);
    };

    const pressed = (e: PointerEvent) => {
      const node = e.target instanceof Element ? e.target : null;
      if (!node) return;

      /* ANYTHING THAT NAMES ITS OWN CUE WINS, and that is the one
         hook the rest of the site needs: a prev/next link, a day
         in a practice book, a tab in the account strip. An
         attribute rather than a handler because most of them are
         rendered on the server, and a server component cannot
         hold one. */
      const named = node.closest("[data-cue]");
      if (named) {
        const want = named.getAttribute("data-cue") ?? "";
        if (want in CUES) cue(want as Cue);
        return;
      }

      /* Otherwise: a button, or something acting as one. Not a
         link, for the reason above. Not an input either, because
         typing is not pressing. */
      if (!node.closest("button, [role=\"button\"], summary")) return;
      cue("press");
    };

    document.addEventListener(SOUND_EVENT, asked);
    document.addEventListener("pointerdown", pressed, { passive: true });
    return () => {
      document.removeEventListener(SOUND_EVENT, asked);
      document.removeEventListener("pointerdown", pressed);
    };
  }, []);

  return null;
}
