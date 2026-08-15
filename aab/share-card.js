/* ============================================================
   share-card.js: the picture a pasted link shows.

   THE BUG THIS FILE EXISTS FOR

   A photo in an article showed up on the Studio's share preview
   and then, on the published piece, WhatsApp and LinkedIn drew the
   site's default card instead. Nothing was wrong with the tag. The
   photo was a WebP, because every photo here is re-encoded to WebP
   on the way in, and the scrapers behind Facebook, WhatsApp and
   LinkedIn will not read one: they ask for the image, fail, and
   fall back to whatever else they can find.

   The other half of the problem is shape. A card is 1200x630. A
   photo is whatever the camera made it, and a portrait photo in a
   landscape slot gets cropped by whoever is drawing the card, in
   whichever direction they feel like.

   So the card is drawn here, once, when a piece is published: a
   real 1200x630 JPEG, cropped around the part of the photo the
   writer said to keep, uploaded like any other photo and stored as
   the article's cover.

   It lives in its own file because two places need it. The Studio
   draws one on publish; the desk draws one for a piece published
   before any of this existed, without making anyone open the
   editor to fix a picture.
   ============================================================ */

export const SHARE_W = 1200;
export const SHARE_H = 630;

/** Which part of the photo to keep when the crop throws some away.
    The same three values the figure toolbar sets as a class. */
const OFFSET = {
  top: () => 0,
  bottom: (h) => SHARE_H - h,
  centre: (h) => (SHARE_H - h) / 2,
};

/**
 * Draw the card.
 *
 * @param {{src: string, focus: string}} pick  the photo, and which
 *        part of it matters. `src` has to be a path this site
 *        serves: the bytes are read back through fetch, so a data:
 *        URL works too, but somebody else's URL will not.
 * @returns {Promise<Blob>} a 1200x630 JPEG.
 */
export async function shareCardBlob({ src, focus = "centre" }) {
  const res = await fetch(src, { credentials: "same-origin" });
  if (!res.ok) throw new Error(String(res.status));

  const bitmap = await createImageBitmap(await res.blob());
  const canvas = new OffscreenCanvas(SHARE_W, SHARE_H);
  const ctx = canvas.getContext("2d");

  // Cover, not contain: a card with letterboxing down the sides
  // looks like a mistake, and every platform crops to fill anyway.
  const scale = Math.max(SHARE_W / bitmap.width, SHARE_H / bitmap.height);
  const w = bitmap.width * scale;
  const h = bitmap.height * scale;
  ctx.drawImage(bitmap, (SHARE_W - w) / 2, (OFFSET[focus] ?? OFFSET.centre)(h), w, h);
  bitmap.close();

  // JPEG deliberately. This is the one image on the site that is
  // fetched by something other than a browser.
  return canvas.convertToBlob({ type: "image/jpeg", quality: 0.86 });
}

/**
 * The photo a card should be made from, out of an article body.
 *
 * The lead photo if one is marked, otherwise the first photo,
 * otherwise nothing, and the caller decides what nothing means: in
 * the Studio it means the section's own card.
 */
export function coverFromDocument(doc) {
  const marked = doc.querySelector("figure.lead-photo img, img.lead-photo");
  const img = marked ?? doc.querySelector("img");
  const src = img?.getAttribute("src") ?? "";
  const figure = img?.closest("figure");
  const focus = figure?.classList.contains("focus-top") ? "top"
    : figure?.classList.contains("focus-bottom") ? "bottom"
    : "centre";
  return { src, focus, own: !!src, lead: !!marked };
}

export const coverFromHTML = (html) =>
  coverFromDocument(new DOMParser().parseFromString(String(html ?? ""), "text/html"));

/** Where a drawn card is kept, so one can be told from a raw photo
    long after it was made. uploadMedia() puts it under this slug. */
export const cardSlug = (slug) => `${slug}-card`;

/** Is this cover a card this code drew? Anything else is a photo
    of unknown shape, in a format half the scrapers refuse. */
export const isDrawnCard = (url) =>
  /^\/media\/[a-z0-9-]*-card\/[0-9a-f]+\.jpg$/.test(url ?? "");

/* What to say about the image in the tags. Twinned with cardShape()
   in functions/insights/[slug].js, which has to say the same thing
   about a stored cover without a DOM to look at.

   Only two kinds of image are known to be 1200x630: a section's own
   card, and one drawn above. Declaring those dimensions for a photo
   of unknown shape is a lie that some platforms lay out around, so
   the tags are simply left off. */
const IMAGE_TYPES = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  webp: "image/webp", avif: "image/avif", gif: "image/gif",
};

export const cardShape = (url) => ({
  type: IMAGE_TYPES[String(url ?? "").split(".").pop().toLowerCase()] ?? "image/png",
  sized: /^(https:\/\/reiad\.co\.uk)?\/og\/[a-z0-9-]+\.png$/.test(url ?? "")
    || isDrawnCard(String(url ?? "").replace("https://reiad.co.uk", "")),
});
