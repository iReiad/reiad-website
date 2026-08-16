/* `/api.js`, the site's HTTP client. See ./README.md.

   `api()` is deliberately declared as returning `unknown`: what
   comes back differs per endpoint, and `app/src/api.ts` is where
   that is written down, one named call at a time. Typing it here
   as `any` would let every one of those named calls lie. */

export function api(
  path: string,
  options?: { method?: string; body?: unknown; timeout?: number },
): Promise<unknown>;

/** Put a blob in R2 and get back where it landed. Multipart, so it
    is the one call that does not go through `api()`. */
export function uploadMedia(blob: Blob, slug: string): Promise<{ url?: string } | null>;
