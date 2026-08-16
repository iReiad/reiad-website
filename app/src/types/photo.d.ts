/* `/photo.js`, moving a photo out of an article body and into R2.
   See ./README.md.

   A photo is read out of the editor by decoding, never by
   fetching. `fetch()` on a `data:` URL is governed by
   `connect-src`, not `img-src`, and this site's policy allows
   `data:` under `img-src` only: a pasted photo displayed
   perfectly and every attempt to upload one was blocked before it
   left the browser, silently, for weeks. Do not "simplify" this
   module back to a fetch, and do not reimplement it here. */

export function isHosted(src: string): boolean;

/** Every photo in `html` uploaded, and the html rewritten to point
    at where they landed. `uploaded` is how many actually moved: a
    zero means nothing reached R2 and the caller should stop. */
export function hostPhotosIn(
  html: string,
  slug: string,
  upload: (blob: Blob, slug: string) => Promise<{ url?: string } | null>,
): Promise<{ html: string; uploaded: number }>;
