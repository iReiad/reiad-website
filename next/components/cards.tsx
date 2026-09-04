/* ============================================================
   cards.tsx: a piece of writing, as a card.

   ONE CARD, not two. Insights drew `.cell sample-card` and the two
   Bangla desks drew `.cell read-card`, which were two different
   objects for the same thing: the same row, on two pages, in two
   shapes, and neither of them the `<GoCard>` the front page drew
   that piece with. A reader who met an article on the board and
   again on its hub met two different sites.

   Both are `<GoCard>` now, which is the card this site draws
   everything with. The two shapes had one real difference between
   them and it is kept: the Bangla desks count in Bangla digits and
   say "পড়ুন", and that is a property of the PIECE's language
   rather than of the page it is listed on, so it is read off the
   row instead of being passed in by the hub.

   ---- the picture ----

   Its own cover where the Studio drew one, and a drawing derived
   from the row where it did not. Nothing is chosen by hand and
   nothing has to be: `shared/art.ts` reads the tag, the topics and
   the section, so a piece published next year arrives with a
   picture and a colour of its own.
   ============================================================ */

import type { Piece } from "../lib/pieces";
import { artOf } from "../lib/art";
import { GoCard } from "./deck";

/** Bangla digits, for the two sections that count in them. The
    same substitution `reads.js` does, and the reason it is a
    substitution rather than a locale format is that these are
    counts inside a sentence, not dates. */
export const bn = (n: number | string) =>
  String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);

/** The date under a card, in the piece's own language. Kept to
    what `formatDate()` in content.js produces for the two cases
    that reach a card: a full date, or nothing at all. */
const dateLabel = (piece: Piece) =>
  piece.date
    ? new Intl.DateTimeFormat(piece.lang === "bn" ? "bn-BD" : "en-GB", {
        day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
      }).format(new Date(`${piece.date}T00:00:00Z`))
    : "";

/* The same shape `safeCover` on the server enforces before a
   cover is stored, checked again because the value becomes a
   request. A card should never be the thing that makes an odd
   one. */
const coverOf = (piece: Piece): string | undefined =>
  /^\/(media|og)\/[A-Za-z0-9._/-]+$/.test(piece.cover ?? "")
    ? (piece.cover as string) : undefined;

/** One piece, as the card this site draws a piece with.

    `hidden` is the topic filter's, and it is a prop rather than an
    attribute a script reads off the card: the chosen topic is one
    piece of state in `topic-filter.tsx` and this is one of the two
    things drawn from it. */
export function PieceCard({ piece, icon, hidden }: {
  piece: Piece; icon?: string; hidden?: boolean;
}) {
  const bangla = piece.lang === "bn";
  const cover = coverOf(piece);
  const art = artOf({
    id: piece.slug, section: piece.section,
    tags: [piece.tag, ...piece.topics], title: piece.title,
  });

  return (
    <GoCard
      href={piece.url} hidden={hidden}
      /* The piece's own photograph first, a drawing of what it is
         about second. Never both: two pictures on one card is two
         answers to the same question. */
      cover={cover}
      art={cover ? undefined : art.subject}
      accent={art.accent}
      icon={icon}
      chip={piece.tag}
      title={piece.title}
      /* Always said, never left to the document. A piece in
         English on a page whose `<html lang>` is Bangla is read
         with Bengali phonology by anything listening, and offered
         for machine translation by the browser. */
      lang={piece.lang || "en"}
      dek={piece.dek}
      go={bangla ? "পড়ুন" : "Read"}
    >
      {piece.topics.length ? (
        <span className="topic-tags">
          {piece.topics.map((topic) => (
            <span className="topic-tag mono" key={topic}>{topic}</span>
          ))}
        </span>
      ) : null}
      <span className="card-meta mono">
        <span>{dateLabel(piece)}</span>
        <span>{bangla ? `${bn(piece.minutes)} মিনিট পড়া` : `${piece.minutes} min read`}</span>
      </span>
    </GoCard>
  );
}

/* `SoonCard` was here too, and that is the whole reason this note
   is: a second export of the same name, with the same defending
   comment copied into both files, rendering different markup.
   `deck.tsx` has the one, `.cell sample-card placeholder` is not
   a card the deck draws, and a reader who reached for the wrong
   import got a card that looked nothing like its neighbours. */
