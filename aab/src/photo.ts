/* photo.ts: turning whatever an <img> points at into bytes this
   site can store. Both Studios and the desk use it.
   A `data:` URL is DECODED here, never fetched: `fetch()` on one
   is governed by connect-src rather than img-src, so every
   read-back was blocked silently, R2 stayed empty and every
   shared link showed the default card. Do not "simplify" it back
   to a fetch: `aab/studio-publish.test.ts` drives a real publish
   under the real policy. Edit this; `aab/photo.js` is built. */

/** px on the long side: plenty for a blog, and it caps the bytes. */
export const MAX_EDGE = 1600;
export const QUALITY = 0.82;

export const isDataUrl = (src: string | null | undefined): boolean =>
  /^data:/i.test(src ?? "");

/** Is this photo on somebody else's server? */
export const isOffSite = (src: string | null | undefined): boolean =>
  /^https?:\/\//i.test(src ?? "");

/** Already ours, so there is nothing to do with it. */
export const isHosted = (src: string | null | undefined): boolean =>
  /^\/media\//.test(src ?? "");

/**
 * A URL the browser is actually allowed to read the bytes of.
 *
 * A same-origin path is fine. A cross-origin one is not: fetching
 * it to resize is blocked by CORS, which used to mean the upload
 * failed and the article silently kept an image hotlinked to a
 * server we do not control. Those go through /api/media/fetch,
 * which hands the bytes back same-origin.
 */
export const fetchableSrc = (src: string): string =>
  isOffSite(src) ? `/api/media/fetch?u=${encodeURIComponent(src)}` : src;

/** A data: URL as a Blob, without a network request. See above. */
export function dataUrlToBlob(src: string): Blob {
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
export async function photoBytes(src: string): Promise<Blob> {
  if (isDataUrl(src)) return dataUrlToBlob(src);
  const res = await fetch(fetchableSrc(src), { credentials: "same-origin" });
  if (!res.ok) throw new Error(String(res.status));
  return res.blob();
}

/** Resized and re-encoded, so a phone photo does not arrive at 6 MB. */
/** A photo, resized, with the size it ended up. */
export interface Encoded {
  blob: Blob;
  width: number;
  height: number;
}

export async function encodeImage(source: ImageBitmapSource): Promise<Encoded> {
  const bitmap = await createImageBitmap(source);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = new OffscreenCanvas(w, h);
  /* Non-null rather than a guard: getContext("2d") on a canvas
     this code just made returns null only if a context of another
     kind was already taken on it. */
  const ctx = canvas.getContext("2d")!;
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
/** What `uploadMedia` in `/api.js` hands back. Declared here as a
    parameter rather than imported, because this module is handed
    the uploader rather than reaching for it: the Studio and the
    desk pass their own, and a test can pass one that fails. */
export type Upload = (
  blob: Blob, slug: string,
) => Promise<{ url?: string; reason?: string } | null>;

export interface Hosted {
  html: string;
  uploaded: number;
  failed: number;
}

export async function hostPhotosIn(
  html: string,
  slug: string,
  uploadMedia: Upload,
  onProgress?: (done: number, total: number) => void,
): Promise<Hosted> {
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
        /* Non-null, and the filter above is the proof: `pending`
           holds only images whose `src` is a non-empty string.
           A `?? ""` here would read as caution and would be the
           one line in this file that the compiler added to it. */
        await photoBytes(img.getAttribute("src")!)
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
