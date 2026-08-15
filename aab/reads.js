/* ============================================================
   reads.js: the index of a reading section, made live.

   One file for both Bangla sections, /cooking/ and /travel/, and
   for whichever one comes after them. The hub page says which
   section it is by putting the id on the host element:

       <div class="cards grid-2" id="piece-list" data-section="travel">

   and everything else comes from SECTIONS in /content.js. That is
   the whole reason this file is not two files: the kitchen and the
   travel desk hold the same shape of thing, so a card written
   twice would drift twice.

   The page already lists what is here in plain markup, which is
   what a search engine reads and what someone with JavaScript off
   gets. This replaces that list with the same pieces drawn as
   cards.

   There is no progress store here and there should not be. The
   three language schools track what you have read because they are
   ladders and the next rung matters. A piece about onions is not a
   rung: you read it, you cook, you come back to it in March when
   you have forgotten which end is the root. Ticking it off would
   be pretending this is a course.
   ============================================================ */

import { findSection, pieceUrl, formatDate } from "/content.js";
import { icon } from "/learn/icons.js";
import { tiltIn } from "/tilt.js";

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/* The icon a piece shows. Its own if it asked for one, otherwise
   the section's, so a new piece looks like it belongs before
   anyone has chosen a drawing for it. */
const ICONS = { cooking: "cart", travel: "compass", insights: "book" };

function pieceCard(piece, section) {
  const soon = piece.status === "soon";
  const card = el(soon ? "div" : "a", {
    className: `cell read-card${soon ? " placeholder" : ""}`,
  });
  card.dataset.piece = piece.slug;
  if (!soon) card.href = pieceUrl(section, piece.slug);

  card.append(
    el("span", { className: "read-art", innerHTML: icon(piece.icon ?? ICONS[section.id] ?? "book") }),
    el("span", { className: "tag mono", textContent: soon ? "আসছে · soon" : piece.tag }),
    el("h3", { className: "bn-h", textContent: piece.title }),
    piece.en ? el("span", { className: "read-en mono", lang: "en", textContent: piece.en }) : null,
    el("p", { textContent: piece.dek }),
  );

  /* Topics, when a piece has them. They are not links: there is no
     filtered view to send anyone to yet, and a chip that looks like
     a link and does nothing is worse than a chip that is plainly a
     label. */
  if (piece.topics?.length) {
    card.append(
      el("span", { className: "topic-tags" },
        ...piece.topics.map((t) =>
          el("span", { className: "topic-tag mono", textContent: t })))
    );
  }

  card.append(
    soon
      ? el("span", { className: "more read-note", textContent: piece.note ?? "লেখা হচ্ছে।" })
      : el("span", { className: "read-meta mono" },
          el("span", { textContent: formatDate(piece.date, piece.lang ?? section.lang) }),
          el("span", { textContent: `${bn(piece.minutes)} মিনিট পড়া` }),
          el("span", { className: "more", textContent: "পড়ুন →" })
        )
  );

  return card;
}

function build() {
  const host = document.getElementById("piece-list");
  if (!host) return;
  const section = findSection(host.dataset.section);

  /* Newest first, and the ones still being written last, so the
     page opens on something you can actually read. */
  const order = [...section.pieces()].sort((a, b) => {
    const soon = (x) => (x.status === "soon" ? 1 : 0);
    return soon(a) - soon(b) || (b.date || "").localeCompare(a.date || "");
  });

  host.replaceChildren(...order.map((p) => pieceCard(p, section)));
  tiltIn(host);
}

build();
