/* ============================================================
   photo.js: turning whatever an <img> is pointing at into bytes
   this site can store.

   Two surfaces need this and used to have only one copy of it.
   The Studio needs it on publish, to move pasted photos out of
   the article body and into R2. The desk needs it to repair a
   piece that was published while that was broken, without making
   somebody reopen the editor.

   ---- the data: URL case, which is the whole point ----

   A photo pasted into the editor is held as a `data:` URL until
   publish. Reading it back with fetch() looks obviously correct
   and is silently forbidden: **fetching a `data:` URL is governed
   by connect-src, not by img-src.** This site's policy says
   `img-src 'self' data:`, so a pasted photo DISPLAYS perfectly,
   and connect-src never mentioned `data:`, so every read-back was
   blocked before it left the browser:

     Refused to connect to 'data:image/webp;base64,...' because it
     violates the following Content Security Policy directive

   The caller caught that, counted a failed upload and left the
   photo embedded, which is the designed fallback and looks like
   nothing at all going wrong. The symptoms appeared three removes
   away: R2 stayed empty, every article's `cover` stayed empty, and
   so every link shared to WhatsApp or LinkedIn showed the site's
   default card instead of the piece's own photo.

   So a data: URL is decoded here rather than fetched. Adding
   `data:` to connect-src would also work and is the wrong fix:
   this needs no network at all, and a policy should not be
   widened to permit a request that never had to be made.

   `aab/studio-publish.test.mjs` drives a real publish under the
   real policy, read out of `_headers`, and fails loudly if this
   regresses.
   ============================================================ */

/** px on the long side: plenty for a blog, and it caps the bytes. */
export const MAX_EDGE = 1600;
export const QUALITY = 0.82;

export const isDataUrl = (src) => /^data:/i.test(src ?? "");

/** Is this photo on somebody else's server? */
export const isOffSite = (src) => /^https?:\/\//i.test(src ?? "");

/** Already ours, so there is nothing to do with it. */
export const isHosted = (src) => /^\/media\//.test(src ?? "");

/**
 * A URL the browser is actually allowed to read the bytes of.
 *
 * A same-origin path is fine. A cross-origin one is not: fetching
 * it to resize is blocked by CORS, which used to mean the upload
 * failed and the article silently kept an image hotlinked to a
 * server we do not control. Those go through /api/media/fetch,
 * which hands the bytes back same-origin.
 */
export const fetchableSrc = (src) =>
  isOffSite(src) ? `/api/media/fetch?u=${encodeURIComponent(src)}` : src;

/** A data: URL as a Blob, without a network request. See above. */
export function dataUrlToBlob(src) {
  const comma = String(src).indexOf(",");
  const head = String(src).slice(0, comma);
  const body = String(src).slice(comma + 1);
  const type = head.match(/^data:([^;,]+)/)?.[1] ?? "application/octet-stream";

  if (!/;base64/i.test(head)) {
    // Percent-encoded text rather than base64. Rare for a photo.
    return new Blob([decodeURIComponent(body)], { type });
  }

  const binary = atob(body);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type });
}

/** The bytes of one photo, by whichever route its src allows. */
export async function photoBytes(src) {
  if (isDataUrl(src)) return dataUrlToBlob(src);
  const res = await fetch(fetchableSrc(src), { credentials: "same-origin" });
  if (!res.ok) throw new Error(String(res.status));
  return res.blob();
}

/** Resized and re-encoded, so a phone photo does not arrive at 6 MB. */
export async function encodeImage(source) {
  const bitmap = await createImageBitmap(source);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  let blob = await canvas.convertToBlob({ type: "image/webp", quality: QUALITY });
  // Safari used to hand back a PNG here; JPEG is the safer second choice.
  if (blob.type !== "image/webp") {
    blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.85 });
  }
  return { blob, width: w, height: h };
}

/**
 * Move every photo in a body out to /media, and hand back the
 * rewritten HTML.
 *
 * A photo that will not upload is LEFT WHERE IT IS and counted.
 * Dropping a picture out of somebody's article because a request
 * failed would be a far worse bug than the one this file is about.
 */
export async function hostPhotosIn(html, slug, uploadMedia, onProgress) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  const pending = [...doc.querySelectorAll("img")].filter((img) => {
    const src = img.getAttribute("src") ?? "";
    return src && !isHosted(src);
  });

  if (!pending.length) return { html, uploaded: 0, failed: 0 };

  let uploaded = 0;
  let failed = 0;

  for (const [i, img] of pending.entries()) {
    onProgress?.(i + 1, pending.length);
    try {
      const { blob, width, height } = await encodeImage(
        await photoBytes(img.getAttribute("src"))
      );
      const stored = await uploadMedia(blob, slug);
      if (!stored?.url) throw new Error(stored?.reason ?? "upload-failed");

      img.setAttribute("src", stored.url);
      img.setAttribute("width", String(width));
      img.setAttribute("height", String(height));
      img.setAttribute("loading", "lazy");
      img.setAttribute("decoding", "async");
      uploaded += 1;
    } catch (err) {
      console.warn("photo upload failed", err);
      failed += 1;
    }
  }

  return { html: doc.body.innerHTML, uploaded, failed };
}
