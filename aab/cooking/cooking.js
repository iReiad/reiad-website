/* ============================================================
   cooking.js: the kitchen index, made live.

   The page already lists what is here in plain markup, which is
   what a search engine reads and what someone with JavaScript
   off gets. This file replaces that list with the same pieces
   drawn as cards, from the COOKING array in /content.js.

   There is no progress store here and there should not be. The
   three language schools track what you have read because they
   are ladders and the next rung matters. A piece about onions is
   not a rung: you read it, you cook, you come back to it in
   March when you have forgotten which end is the root. Ticking
   it off would be pretending this is a course.

   Adding a piece is one entry in COOKING and nothing else: it
   reaches this page, the Ctrl+K palette, the overlay menu and
   the sitemap from there.
   ============================================================ */

import { COOKING, cookingUrl, formatDate } from "/content.js";
import { icon } from "/learn/icons.js";
import { tiltIn } from "/tilt.js";

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/* Bangla dates, because the rest of the card is Bangla. The site
   already knows how to write one; all this does is ask for the
   Bangla locale rather than the English one. */
const dateBn = (iso) => formatDate(iso, "bn");

function pieceCard(c) {
  const soon = c.status === "soon";
  const card = el(soon ? "div" : "a", {
    className: `cell kitchen-card${soon ? " placeholder" : ""}`,
  });
  card.dataset.piece = c.slug;
  if (!soon) card.href = cookingUrl(c);

  card.append(
    el("span", { className: "kitchen-art", innerHTML: icon(c.icon ?? "cart") }),
    el("span", { className: "tag mono", textContent: soon ? "আসছে · soon" : c.tag }),
    el("h3", { className: "bn-h", textContent: c.bn }),
    el("span", { className: "kitchen-en mono", lang: "en", textContent: c.en }),
    el("p", { textContent: c.dek }),
  );

  card.append(
    soon
      ? el("span", { className: "more kitchen-note", textContent: c.note ?? "লেখা হচ্ছে।" })
      : el("span", { className: "kitchen-meta mono" },
          el("span", { textContent: dateBn(c.date) }),
          el("span", { textContent: `${bn(c.minutes)} মিনিট পড়া` }),
          el("span", { className: "more", textContent: "পড়ুন →" })
        )
  );

  return card;
}

function buildList() {
  const host = document.getElementById("kitchen-list");
  if (!host) return;
  /* Newest first, and the ones still being written last, so the
     page opens on something you can actually read. */
  const order = [...COOKING].sort((a, b) => {
    const soon = (x) => (x.status === "soon" ? 1 : 0);
    return soon(a) - soon(b) || (b.date || "").localeCompare(a.date || "");
  });
  host.replaceChildren(...order.map(pieceCard));
  tiltIn(host);
}

buildList();
