/* ============================================================
   headers.ts: the security headers, for responses this code
   builds itself.

   `aab/_headers` is read by Cloudflare's STATIC ASSET SERVER, so
   none of it reaches a response a Worker builds: without this
   such a page is served with no CSP, no X-Frame-Options and no
   HSTS beside an identical-looking file that has all three, and
   it renders the same either way.

   `scripts/check-headers.ts` fails if this list and the `/*`
   block in `aab/_headers` stop agreeing, and fails on a handler
   that builds a response without going through here.
   ============================================================ */

export const SECURITY_HEADERS = {
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  /* geolocation is (self) and MUST NOT be (). An empty allowlist
     is not "ask the reader": it is the page telling the browser
     not to have the API, so no prompt ever appears,
     getCurrentPosition fails at once with PERMISSION_DENIED, and
     granting location in site settings changes nothing. */
  "Permissions-Policy":
    "geolocation=(self), camera=(), microphone=(), payment=(), interest-cohort=(), "
    + "publickey-credentials-get=(self), publickey-credentials-create=(self)",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
  "Content-Security-Policy":
    "default-src 'self'; "
    + "script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'; "
    + "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
    + "font-src 'self' https://fonts.gstatic.com; "
    /* One third-party image host, and one picture: the avatar
       Google hands over with a sign-in. Public bytes needing no
       credential, so added rather than proxied. The tag carries
       `referrerpolicy="no-referrer"`. */
    + "img-src 'self' data: https://lh3.googleusercontent.com; "
    + "connect-src 'self' https://api.web3forms.com "
    + "https://market-pulse.i-reiad.workers.dev https://wvjarqnnmkkuxyrndtya.supabase.co; "
    /* Media is this origin's: the Worker streams a lesson's bytes
       from /api/courses/file/. `frame-src drive.google.com` is
       deliberately absent, because a private Drive file cannot be
       framed cross-site at all. */
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
