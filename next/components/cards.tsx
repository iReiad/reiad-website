/* ============================================================
   cards.tsx: a piece, as a card on its section's index.

   Two shapes, because the site has two. Insights draws
   `.sample-card`, which is a tag, a headline, a standfirst and a
   line of metadata. The two Bangla sections draw `.read-card`,
   which adds the little drawing and puts its metadata in three
   columns. Both are rules that already exist in `styles.css`, and
   the class names here are the ones `aab/app.js` and
   `archive/reads.js` put on the nodes they build, because a port that
   also restyles the page cannot be judged.

   ---- what changes, and it is the point of the exercise ----

   These were built in the browser, from a list fetched after the
   page had already painted. A reader with no JavaScript, and every
   crawler that does not run any, saw an empty box with a
   hand-written fallback list inside it that somebody had to
   remember to update. Rendered here, the cards are in the HTML the
   server sends, and the fallback list has nothing left to be a
   fallback for.
   ============================================================ */

import type { Piece } from "../lib/pieces";
import { Chip } from "./ui/chip";

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

/* The drawings, verbatim out of `aab/money/icons.js`, for the
   three names a reading section uses.

   Copied rather than imported, and that is not laziness: it is a
   browser module served from `aab/`, and Turbopack refuses to
   resolve above `next/`, which is the same wall `shared/` exists
   to get round. Promoting an icon set to a shared package for
   three paths would be the larger mistake.

   Each string is the inside of the `<svg>` exactly as `icon()`
   writes it, so that `scripts/check-next.ts` can hold the two
   copies together: it renders each name out of icons.js and fails
   if the result is not in this file, character for character.
   That is why they are strings set as HTML rather than JSX. */
const ICON_INNER: Record<string, string> = {
  cart: `<path d="M3 4h2.2l2.3 10.4a1.5 1.5 0 0 0 1.5 1.2h7.7a1.5 1.5 0 0 0 1.5-1.2L20 7H6"/><circle cx="10" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/>`,
  book: `<path d="M4 4.5A1.5 1.5 0 0 1 5.5 3H19v15H5.5A1.5 1.5 0 0 0 4 19.5Z"/><path d="M4 19.5A1.5 1.5 0 0 1 5.5 21H19v-3"/><path d="M8 7.5h7"/><path d="M8 11h5"/>`,
  compass: `<circle cx="12" cy="12" r="8.5"/><path d="M14.8 9.2l-1.9 4.6-4.7 1.9 1.9-4.6 4.7-1.9Z"/>`,
};

function Art({ name }: { name: string }) {
  return (
    <svg className="art" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
         aria-hidden="true"
         dangerouslySetInnerHTML={{ __html: ICON_INNER[name] ?? "" }} />
  );
}

/** The English card, as `initArticleCards()` in app.js builds it.

    `hidden` is the topic filter's, and it is a prop rather than an
    attribute a script reads off the card: the chosen topic is one
    piece of state in `topic-filter.tsx` and this is one of the two
    things drawn from it. The card carried a `data-topics` list for
    `archive/modules/hub.js` to match against, and nothing needs it
    now that the component filtering these has the rows. */
export function SampleCard({ piece, hidden }: { piece: Piece; hidden?: boolean }) {
  const meta = [dateLabel(piece), piece.minutes ? `${piece.minutes} min read` : ""]
    .filter(Boolean).join(" · ");

  return (
    <a className="cell sample-card" href={piece.url} hidden={hidden}
       style={{ textDecoration: "none", color: "inherit" }}>
      <Chip>{piece.tag}</Chip>
      <h3>{piece.title}</h3>
      <p>{piece.dek}</p>
      <span className="more">{meta ? `${meta}  →` : "Read →"}</span>
    </a>
  );
}

/* `SoonCard` was here too, and that is the whole reason this note
   is: a second export of the same name, with the same defending
   comment copied into both files, rendering different markup.
   `deck.tsx` has the one, `.cell sample-card placeholder` is not
   a card the deck draws, and a reader who reached for the wrong
   import got a card that looked nothing like its neighbours. */

/** The Bangla card, as `pieceCard()` in reads.js builds it. */
export function ReadCard({ piece, icon }: { piece: Piece; icon: string }) {
  return (
    <a className="cell read-card" href={piece.url} data-piece={piece.slug}>
      <span className="read-art"><Art name={icon} /></span>
      <Chip>{piece.tag}</Chip>
      <h3 className="bn-h">{piece.title}</h3>
      <p>{piece.dek}</p>
      {piece.topics.length ? (
        <span className="topic-tags">
          {piece.topics.map((topic) => (
            <span className="topic-tag mono" key={topic}>{topic}</span>
          ))}
        </span>
      ) : null}
      <span className="read-meta mono">
        <span>{dateLabel(piece)}</span>
        <span>{bn(piece.minutes)} মিনিট পড়া</span>
        <span className="more">পড়ুন →</span>
      </span>
    </a>
  );
}
