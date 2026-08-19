/* ============================================================
   headers.ts: the security headers, for responses this code
   builds itself.

   ---- the hole this closes ----

   `aab/_headers` is read by Cloudflare's static asset server. It
   sets the frame policy, the sniffing policy, HSTS and the whole
   Content-Security-Policy on every file in `aab/`.

   A response the Worker builds is not a static asset, so none of
   it applies. Which means every article published through the
   Studio, the ones rendered from D1 by `functions/insights/`, has
   been served with no CSP, no X-Frame-Options and no HSTS, while
   the identical-looking article next to it, still a committed
   file, had all three. Nothing looked wrong: the page renders the
   same either way, and the difference is only visible in the
   response headers.

   So the same headers are declared here and attached by hand, and
   `scripts/check-headers.ts` fails if this list and the `/*`
   block in `aab/_headers` stop agreeing. One of them being edited
   alone is exactly how this happened.

   Stage 10 makes it matter twice over: a page rendered by the
   Next.js Worker is not a static asset either, and "the same page
   as the Worker produced" has to include the headers it came with.
   ============================================================ */

export const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy":
    "geolocation=(), camera=(), microphone=(), payment=(), interest-cohort=(), "
    + "publickey-credentials-get=(self), publickey-credentials-create=(self)",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; "
    + "script-src 'self' 'unsafe-inline'; "
    + "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    + "font-src 'self' https://fonts.gstatic.com; "
    /* One third-party image host, and one picture: the avatar
       Google hands over with a sign-in. It is added rather than
       proxied because these bytes are public, need no credential
       and are the reader's own picture on the reader's own
       account page, which is none of the things that made the
       course section route Drive through the Worker. The tag
       carries `referrerpolicy="no-referrer"`, so the host is not
       told which page it is on. */
    + "img-src 'self' data: https://lh3.googleusercontent.com; "
    + "connect-src 'self' https://api.web3forms.com "
    + "https://market-pulse.i-reiad.workers.dev https://wvjarqnnmkkuxyrndtya.supabase.co; "
    /* Media is this origin's, which is the whole of the course
       section's video story: the Worker streams a lesson's bytes
       from /api/courses/file/, so there is no third-party frame
       and no third-party media. There was a `frame-src` for
       drive.google.com here and it is deliberately gone: a
       private Drive file cannot be framed cross-site at all. */
    + "media-src 'self'; "
    + "form-action 'self' https://api.web3forms.com; "
    + "frame-ancestors 'none'; "
    + "base-uri 'self'; "
    + "object-src 'none'",
};

export interface HtmlResponseOptions {
  cache?: string;
  status?: number;
}

export function htmlResponse(
  body: string,
  { cache, status = 200 }: HtmlResponseOptions = {}
): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...SECURITY_HEADERS,
      ...(cache ? { "Cache-Control": cache } : {}),
    },
  });
}

export const securityEntries = (): Array<[string, string]> => Object.entries(SECURITY_HEADERS);
