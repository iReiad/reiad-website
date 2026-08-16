/* ============================================================
   piece.ts: what is in the editor, and what it will become.

   One type for the thing being written, one function that turns
   it into the record the database stores, and the small pile of
   facts that differ between the three sections it can go to.

   The body is not in here. It lives in the contenteditable, which
   is the one piece of this page React does not own, and it is
   read out of the editor at the moment it is needed. Keeping a
   copy in state would mean two answers to "what does the article
   say", and the stale one would be the one that got published.
   ============================================================ */

import { dropUntouchedCaptions, readingStats, sanitize, slugify } from "/editor.js";
import { findSection, pieceUrl } from "/content.js";
import { coverFromDocument, type Cover } from "/share-card.js";

/** The fields, as the writer sees them. */
export interface Fields {
  title: string;
  dek: string;
  slug: string;
  date: string;
  lang: string;
  section: string;
}

/** What the piece is tied to, which is not a field and is not
    typed. `slug` is set once a piece has been saved to the
    database and is what tells a republish from a first publish:
    without it, editing a live article and pressing publish would
    look exactly like a slug collision. */
export interface Tied {
  draftId: string | null;
  slug: string | null;
  /* The section the piece is published in, which is not always
     the one the picker is showing: changing the picker on an open
     piece is a request to move it, and until it is saved the live
     URL is still the old one. */
  section: string | null;
  notionPageId: string | null;
}

export const blankFields = (): Fields => ({
  title: "", dek: "", slug: "", date: new Date().toISOString().slice(0, 10),
  lang: "en", section: "insights",
});

export const blankTied = (): Tied =>
  ({ draftId: null, slug: null, section: null, notionPageId: null });

/** Everything the preview, the pre-flight panel and the publish
    all need, derived rather than stored. */
export interface Meta extends Fields {
  tag: string;
  topics: string[];
  body: string;
  words: number;
  photos: number;
  minutes: number;
}

export function metaOf(fields: Fields, topics: string[], html: string): Meta {
  const title = fields.title.trim() || "Untitled article";
  const lang = fields.lang;
  const body = dropUntouchedCaptions(sanitize(html));

  return {
    ...fields,
    title,
    dek: fields.dek.trim(),
    /* The line above the headline, made of the topics rather than
       typed a second time. Three is what fits on a card. */
    tag: topics.slice(0, 3).join(" · ") || (lang === "bn" ? "লেখা" : "Note"),
    /* Slugified even when typed by hand. It used to be taken raw,
       so "German Alphabets" stayed "German Alphabets" here and in
       the index entry while the server quietly stored
       "germanalphabets": two different answers to what the URL is,
       and the one that got pasted into content.js was the broken
       one. */
    slug: slugify(fields.slug.trim() || title),
    date: fields.date || new Date().toISOString().slice(0, 10),
    topics: [...topics],
    body,
    ...readingStats(body),
  };
}

/* ============================================================
   What changes about a finished page when it is going somewhere
   other than Insights.

   The three sections share a shell and differ in five small ways,
   so they are described once here rather than with a conditional
   at each of the five places.

   `note` is the line at the foot of a piece. Insights carries a
   financial disclaimer because it is about money; a piece about
   onions carrying one would be comic, and a piece about visas
   needs a different disclaimer entirely, not the same one.
   ============================================================ */

export const PAGE_STYLE: Record<string, { og: string }> = {
  insights: { og: "/og/insights.png" },
  cooking: { og: "/og/cooking.png" },
  travel: { og: "/og/travel.png" },
};

export const styleFor = (m: { section: string }) => PAGE_STYLE[m.section] ?? PAGE_STYLE.insights;

/** The public URL a piece will have, in whichever section. */
export const urlFor = (m: { section: string; slug: string }) =>
  pieceUrl(findSection(m.section), m.slug);

/** A piece with no picture of its own falls back to the card its
    section has. Which section that is is a Studio question, which
    is why share-card.js does not answer it. */
export const withDefault = (pick: Cover, m: { section: string }): Cover =>
  (pick.own ? pick : { ...pick, src: styleFor(m).og, focus: "centre" });

/** The image a social card would use, and which part of it to
    keep: the lead photo if one is marked, otherwise the first
    photo, otherwise the section's default card. Data URLs are
    fine here: this is a preview, and the same picture becomes a
    /media path on publish. */
export function coverFor(m: Meta): Cover {
  const doc = new DOMParser().parseFromString(m.body, "text/html");
  return withDefault(coverFromDocument(doc), m);
}

/** Only a path this site serves can be stored as the cover; a
    data URL is still waiting to be uploaded, and the default is
    not worth recording. Mirrors safeCover() on the server. */
export const storableCover = (src: string) => (/^\/media\//.test(src ?? "") ? src : "");

/** The topics inside a label. The older pieces carry their label
    as one string with middle dots in it, which is exactly the
    list this field holds, written the old way. */
export const topicsFromTag = (tag: unknown): string[] =>
  String(tag ?? "").split(/[·•|,]/).map((t) => t.trim()).filter(Boolean);

export const MAX_TOPICS = 6;
