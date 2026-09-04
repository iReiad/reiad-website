/* ============================================================
   meadow.tsx: the front door's own ground of colour.

   Four spans and nothing else. `@layer meadow` in
   `next/styles/site.css` is the whole drawing: gradients and
   three keyframes, no canvas, no loop, and nothing here runs in
   the browser at all.

   ---- why it is not on every page, and why it is not the sky ----

   `.weather` is already a full-screen animated layer behind every
   page, and two of them competing for the same pixels is worse
   than one. This is a different depth band: the weather is the
   sky, edge to edge, with its sun, moon and cloud banks in the
   TOP of the window; this is the ground, a run of rolling arcs
   anchored to the BOTTOM edge and empty above the middle. The
   stylesheet turns its one knob down to a third under
   `html[data-weather]`, so only ever one of the two is at full
   strength.

   And it is the front door's alone. Every other page here is a
   reading column, which is the one place `@layer weather` learned
   a decoration cannot go: the reader cannot move it and cannot
   turn it off without leaving the page they are on.

   ---- it must stay a plain server component ----

   No state, no effect, no "use client": it renders the same four
   empty spans on every visit, so it costs the prerendered front
   page four elements of markup and no JavaScript.
   ============================================================ */

/** The ground behind the front door. Rendered inside
    `main.home-aura`, whose `isolation: isolate` is what keeps
    this layer's `z-index: -1` behind the page's own content
    rather than behind the page. */
export function Meadow() {
  return (
    <div className="meadow" aria-hidden="true">
      {/* Back to front, and the light is FIRST: a glow at the
          horizon is the sun on the far side of the hills, and
          painted last it would be haze in front of them. */}
      <span className="mdw-lit" />
      <span className="mdw-far" />
      <span className="mdw-mid" />
      <span className="mdw-near" />
    </div>
  );
}
