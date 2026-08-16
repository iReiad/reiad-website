/* ============================================================
   headers.js: the security headers, for responses this code
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

/** Everything `aab/_headers` sends with every file in `aab/`.

    Kept as an object rather than a Headers instance so it can be
    compared, spread and read by a check that has no DOM. */
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
    + "form-action 'self' https://api.web3forms.com; "
    + "frame-ancestors 'none'; "
    + "base-uri 'self'; "
    + "object-src 'none'",
};

/** An HTML response with the headers a static page would have had.

    `cache` is passed rather than assumed: an article is cached for
    a minute at the edge, and a page that has just been published
    should not be. */
export function htmlResponse(body, { cache, status = 200 } = {}) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      ...SECURITY_HEADERS,
      ...(cache ? { "Cache-Control": cache } : {}),
    },
  });
}

/** The same set, as plain entries, for anything that builds its
    own Response and only wants the security half. */
export const securityEntries = () => Object.entries(SECURITY_HEADERS);
