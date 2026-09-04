/* The picture a card wears.

   ONE DRAWING, BOTH THEMES: every colour is a MIX of the card's own
   `--accent` with `--panel` and `--ink`, the two tokens that flip, so a
   school that changes colour in `shared/nav.ts` changes colour here with
   nothing regenerated. A raster would have meant two of everything kept
   in step by hand.

   AND IT MOVES: `glow.tsx` publishes the pointer over a surface as
   `--gpx`/`--gpy`, so each layer translates against them by its own
   depth. Both are multiplied by `--glow-a`, the material's registered
   "the pointer is here" number, so the parallax arrives with the light
   and eases out behind it, with no second listener and no motion at all
   for a reader who has asked for none.

   A drawing is about a SUBJECT rather than a page, and `shared/nav.ts`
   names which subject each school, tool and desk wears, so every hub
   draws the same card for the same thing from one table. */

import type { ReactNode } from "react";
import { ART_MOTIFS, ART_SUBJECTS_SVG, MOTIF_OF, type Motif }
  from "@reiad/shared/art-svg";
import type { ArtSubject } from "@reiad/shared/art";

    /* Every subject stands on y = 300 of a 520 by 400 stage, which is what
       lets one frame hold any of them: the horizon and the reflection are
       drawn against that line.

       THE DRAWINGS ARE NOT IN THIS FILE. They are strings in
       `shared/art-svg.ts`, because `aab/src/share-card.ts` has to read
       them too and cannot reach JSX. */
export { ART_SUBJECTS } from "@reiad/shared/art";
export type { ArtSubject };
export { MOTIF_OF };

    /* ---- what is behind the subject ----
       Six motifs, not twelve: the motif is about the KIND of thing the
       subject is, so money and bubbles both belong in a field of orbits.
       Twelve would be twelve more drawings to keep in step for a layer
       rendered at 62% opacity behind a 1.1px blur.

       They carry no gradients, deliberately: an id in here would collide
       with the subject's own the moment both are on one page. */
    /** How big the frame is, which decides one number and no others. The
        layers, the depths and the drawing are identical in all three; what
        changes is `--art-throw`, because a subject that slides 26px inside
        an 84px thumbnail slides off its own floor. */
export type ArtSize = "band" | "tile" | "panel";

    /** THE ROOM, with anything at all standing in it. Ten layers, in the
        order they are in the room, all inside `.art-space` rather than
        children of the frame: the frame CLIPS and a clip flattens, so the
        room has to turn inside something that is not turning.

        `children` is the subject, rendered TWICE: once mirrored about the
        line every subject stands on, faded and blurred, which is what puts
        it on a floor rather than in the air. Rendered rather than cloned,
        because a clone of a node with a key is a second node with the same
        key and React says so.

        It takes a drawing rather than owning one, so a card with a picture
        of its own can stand in the same room. `aria-hidden`, always: the
        card's own title says what it is. */
export function Scene({ motif, size = "band", className, children }: {
  motif: Motif; size?: ArtSize; className?: string; children: ReactNode;
}) {
  return (
    <span className={["artwork", className].filter(Boolean).join(" ")}
          data-size={size === "band" ? undefined : size} aria-hidden="true">
      <span className="art-space">
        <span className="art-sky" />
        <span className="art-weave" />
        <span className="art-halo" />
        <span className="art-rays" />
        <span className="art-far">
          <svg className="art-svg" viewBox="0 0 520 400" fill="none">
                {/* `dangerouslySetInnerHTML`, which for markup that is not
                    React's is the ordinary way and is what `icons.tsx`
                    already does. The drawings are strings in
                    `shared/art-svg.ts` because the share card builds a
                    standalone SVG out of the same ones. */}
            <g dangerouslySetInnerHTML={{ __html: ART_MOTIFS[motif] }} />
          </svg>
        </span>
        <span className="art-floor" />
        <span className="art-stage">
          <span className="art-copy art-echo">{children}</span>
          <span className="art-copy art-real">{children}</span>
        </span>
        <span className="art-near" />
        <span className="art-spec" />
        <span className="art-veil" />
      </span>
    </span>
  );
}

/** The room with one of the twelve standing in it, which is what
    almost every card wants. */
export function CardArt({ subject, className, size = "band" }: {
  subject: ArtSubject; className?: string; size?: ArtSize;
}) {
  return (
    <Scene motif={MOTIF_OF[subject]} size={size}
           className={[`art-of-${subject}`, className].filter(Boolean).join(" ")}>
      <svg className="art-svg" viewBox="0 0 520 400" fill="none"
           dangerouslySetInnerHTML={{ __html: ART_SUBJECTS_SVG[subject] }} />
    </Scene>
  );
}
