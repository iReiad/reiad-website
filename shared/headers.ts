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
   `scripts/check-headers.mjs` fails if this list and the `/*`
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
    + "img-src 'self' data:; "
    + "connect-src 'self' https://api.web3forms.com "
    + "https://market-pulse.i-reiad.workers.dev https://wvjarqnnmkkuxyrndtya.supabase.co; "
    /* The one thing this site frames: a Drive video on
       /skills/courses/. Without it `default-src 'self'` refuses
       the iframe and the lesson page shows an empty box. It is
       not `frame-ancestors`, three lines down, which is the
       opposite direction and still 'none'. */
    + "frame-src https://drive.google.com; "
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
