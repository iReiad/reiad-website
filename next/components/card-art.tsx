/* ============================================================
   card-art.tsx: the picture a card wears.

   ---- one drawing, both themes ----

   These were twenty-five committed WebP files, and a raster
   cannot answer a theme: light and dark would have meant two of
   everything, kept in step by hand for ever. Every colour here is
   instead a MIX of the card's own `--accent` with `--panel` and
   `--ink`, which are the two tokens that already flip. So one
   drawing is dark glass on a dark ground at night and inked glass
   on paper by day, and a school that changes colour in
   `shared/nav.ts` changes colour here with nothing regenerated.

   That also took a build step, a browser, a stamp file and 300 KB
   of binaries out of the repository. A drawing is markup now, so
   it is diffable, it is crisp at any density, and it costs one
   paint rather than one fetch.

   ---- and it moves ----

   A scene is layers at different DEPTHS. `glow.tsx` already
   publishes the pointer's position over a surface as `--gpx` and
   `--gpy`, normalised to -1..1, so each layer translates against
   them by its own depth and the picture opens into a box rather
   than sitting flat on one.

   Both are multiplied by `--glow-a`, which is the material's own
   "the pointer is here" number: it is registered, it animates on
   the 190-in/820-out curve, and it is 0 at rest. So the parallax
   arrives with the light and eases back out behind it, with no
   second listener, no second piece of state, and no motion at all
   for a reader who has asked for none.

   ---- what belongs here ----

   A drawing is about a SUBJECT rather than about a page: the
   coins are money wherever money appears. `shared/nav.ts` names
   which subject each school, tool and desk wears, so the board,
   `/skills`, `/tools` and the reading hubs all draw the same card
   for the same thing from one table.
   ============================================================ */

import type { ReactNode } from "react";
import { ART_MOTIFS, ART_SUBJECTS_SVG, MOTIF_OF, type Motif }
  from "@reiad/shared/art-svg";
import type { ArtSubject } from "@reiad/shared/art";

/* Every subject stands on y = 300 of a 520 by 400 stage, which is
   what lets one frame hold any of them: the horizon and the
   reflection below are drawn against that line.

   THE DRAWINGS ARE NOT IN THIS FILE ANY MORE. They were 747 lines
   of JSX here and `aab/src/share-card.ts` could not reach them,
   so a card pasted into a chat carried the room with nothing
   standing in it. They are strings in `shared/art-svg.ts` now,
   for the reason `next/lib/school-icons.ts` holds strings: markup
   that something other than React has to be able to read. */
export { ART_SUBJECTS } from "@reiad/shared/art";
export type { ArtSubject };
export { MOTIF_OF };

/* ============================================================
   WHAT IS BEHIND THE SUBJECT

   Six motifs, not twelve. A drawing needs something behind it or
   it is a sticker on a gradient, but that something is about the
   KIND of thing the subject is rather than about the subject
   itself: money and bubbles both belong in a field of orbits, a
   ridge and a plate both sit against strata, and three of the
   four paper subjects share one wall of ruled edges.

   Twelve would have been twelve more drawings to keep in step for
   a layer rendered at 62% opacity behind a 1.1px blur, which is
   the definition of detail nobody can resolve. They carry no
   gradients, deliberately: an id in here would collide with the
   subject's own the moment both are on one page.
   ============================================================ */
/** How big the frame is, which decides one number and no others.

    `band` is the 16:9 strip across the top of a card and is the
    ordinary case. `tile` is the little square on a compact row.
    `panel` is the featured card, where the picture is beside the
    words rather than above them.

    The layers, the depths and the drawing are identical in all
    three. What changes is `--art-throw`, because a subject that
    slides 26px inside an 84px thumbnail slides off its own
    floor. */
export type ArtSize = "band" | "tile" | "panel";

/** THE ROOM, with anything at all standing in it.

    Ten layers, and the order is the order they are in the room.
    They are all inside `.art-space` rather than being children of
    the frame, because the frame CLIPS and a clip flattens: the
    room has to turn inside something that is not turning, or
    there is nothing for it to turn against.

    `children` is the subject, rendered TWICE: once mirrored about
    the line every subject stands on, faded and blurred, which is
    the whole of what puts it on a floor rather than in the air.
    Rendered rather than cloned, because a clone of a node with a
    key is a second node with the same key and React says so.

    It takes a drawing rather than owning one so that a card with
    a picture of its OWN can stand in the same room: the seven
    case studies each carry a sparkline describing that model,
    which is a better picture than any of the twelve, and it
    belongs in a room like everything else.

    `aria-hidden`, always: the card's own title says what it is,
    and a drawing of a book beside the word "Insights" read out
    twice is a screen reader saying everything twice. */
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
            {/* `dangerouslySetInnerHTML`, which for markup that
                is not React's is the ordinary way and is what
                `icons.tsx` already does. The drawings are strings
                in `shared/art-svg.ts` because the share card has
                to build a standalone SVG out of the same ones,
                and two copies of a drawing is the failure
                CLAUDE.md opens with. */}
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
