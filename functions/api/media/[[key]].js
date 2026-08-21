/* ============================================================
   /api/media, where the photos actually live.

   GET    /media/<key>        public: serve an image out of R2
   POST   /api/media          admin:  upload raw bytes, get a URL back
   GET    /api/media          admin:  list what's stored
   DELETE /api/media/<key>    admin:  remove one

   ---- why this exists ----

   The Studio used to embed every photo in the article body as a
   base64 data URL. That is a lovely trick for a downloadable file
   and a bad one for a database: base64 costs a third more than the
   bytes it encodes, D1 caps a value at 2 MB, and the body was being
   silently truncated at 400,000 characters on the way in. Two
   photos was enough to lose the end of a piece.

   It is also the thing that makes importing from Notion possible at
   all. Notion hands out signed S3 links that expire in about an
   hour, so an imported photo has to be copied somewhere permanent
   in the same breath, or the article quietly breaks by tea time.

   ---- keys ----

   A key is `<slug>/<content-hash>.<ext>`. Hashing the bytes means
   uploading the same photo twice writes it once, and that a URL can
   never point at different bytes later, which is what lets the
   response say `immutable` and mean it.
   ============================================================ */

import { fail, methods, notConfigured, ok, str } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.ts";

/* No SVG. It is a document format that can carry script, and this
   endpoint hands back whatever it was given with that content type. */
const TYPES = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_BYTES = 8 * 1024 * 1024;

/* The fetch proxy is admin-only, so this is not the main line of
   defence, but a Worker sits inside Cloudflare's network and there
   is no reason for it to ever be pointed at a private address. */
const PRIVATE_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|.*\.internal$|.*\.local$)/i;

const extFor = (type) => TYPES[String(type ?? "").split(";")[0].trim().toLowerCase()];
const typeFor = (key) =>
  Object.keys(TYPES).find((t) => TYPES[t] === key.split(".").pop()) ?? "application/octet-stream";

/** First 16 hex characters of the SHA-256, 64 bits, which is far
    more than enough to tell one person's photo library apart. */
async function contentHash(buffer) {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest, 0, 8)]
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

const safeSlug = (value) =>
  str(value, 80).toLowerCase().replace(/[^a-z0-9-]/g, "") || "loose";

/** A key we built, and not a path someone talked us into. */
const validKey = (key) => /^[a-z0-9-]{1,80}\/[0-9a-f]{16}\.[a-z0-9]{3,4}$/.test(key);

export async function onRequest(context) {
  const { request, env, params } = context;
  const key = (params.key ?? []).join("/");
  const url = new URL(request.url);

  const bucket = env.MEDIA;
  if (!bucket) return notConfigured();

  return methods(request, {
    /* ---------------- serve, list, or fetch ---------------- */
    GET: async () => {
      /* A photo pasted from Google Docs, or any web page, arrives as
         a cross-origin URL. The browser cannot re-host it: fetching
         it to resize is blocked by CORS, so the upload failed and the
         article kept an image hotlinked to somebody else's server,
         which will rot without warning.

         This hands the bytes back same-origin so the Studio's own
         resize-and-re-encode pipeline can run on them. It is
         admin-only, for the same reason the Notion proxy is: an open
         image proxy on someone else's domain is a gift to whoever
         finds it. */
      if (key === "fetch") {
        const guard = await requireAdmin(context);
        if (guard) return guard;

        const target = url.searchParams.get("u");
        if (!target) return fail("url-required");

        let parsed;
        try { parsed = new URL(target); } catch { return fail("bad-url"); }
        if (parsed.protocol !== "https:") return fail("https-only", 400);
        if (PRIVATE_HOST.test(parsed.hostname)) {
          return fail("host-not-allowed", 403, { host: parsed.hostname });
        }

        const upstream = await fetch(parsed.toString(), { redirect: "follow" });
        if (!upstream.ok) return fail("unavailable", upstream.status);

        const type = upstream.headers.get("Content-Type") ?? "";
        if (!type.startsWith("image/")) return fail("not-an-image", 415, { type });

        const size = Number(upstream.headers.get("Content-Length") ?? 0);
        if (size > MAX_BYTES) return fail("too-large", 413, { size, limit: MAX_BYTES });

        return new Response(upstream.body, {
          headers: {
            "Content-Type": type,
            "X-Content-Type-Options": "nosniff",
            "Cache-Control": "private, max-age=300",
          },
        });
      }

      // No key: the admin's inventory, not a public index.
      if (!key) {
        const guard = await requireAdmin(context);
        if (guard) return guard;

        const listing = await bucket.list({
          prefix: str(url.searchParams.get("slug"), 80), limit: 500,
        });
        return ok({
          media: listing.objects.map((o) => ({
            key: o.key, url: `/media/${o.key}`, size: o.size, uploaded: o.uploaded,
          })),
          bytes: listing.objects.reduce((n, o) => n + o.size, 0),
        });
      }

      if (!validKey(key)) return fail("not-found", 404);

      const object = await bucket.get(key);
      if (!object) return fail("not-found", 404);

      return new Response(object.body, {
        headers: {
          "Content-Type": object.httpMetadata?.contentType || typeFor(key),
          "Content-Length": String(object.size),
          "X-Content-Type-Options": "nosniff",
          // The key is a hash of the bytes, so these bytes are the
          // only ones this URL will ever have.
          "Cache-Control": "public, max-age=31536000, immutable",
          ETag: object.httpEtag,
        },
      });
    },

    /* ---------------- upload ---------------- */
    POST: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;

      const ext = extFor(request.headers.get("Content-Type"));
      if (!ext) return fail("unsupported-type", 415, { accepts: Object.keys(TYPES) });

      const buffer = await request.arrayBuffer();
      if (!buffer.byteLength) return fail("empty-body");
      if (buffer.byteLength > MAX_BYTES) {
        return fail("too-large", 413, { size: buffer.byteLength, limit: MAX_BYTES });
      }

      const slug = safeSlug(url.searchParams.get("slug"));
      const newKey = `${slug}/${await contentHash(buffer)}.${ext}`;

      // Same bytes, same key: the write is already done.
      const already = await bucket.head(newKey);
      if (!already) {
        await bucket.put(newKey, buffer, {
          httpMetadata: {
            contentType: request.headers.get("Content-Type").split(";")[0].trim(),
            cacheControl: "public, max-age=31536000, immutable",
          },
        });
      }

      return ok({
        key: newKey,
        url: `/media/${newKey}`,
        size: buffer.byteLength,
        deduplicated: !!already,
      });
    },

    /* ---------------- remove ---------------- */
    DELETE: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      if (!validKey(key)) return fail("not-found", 404);
      await bucket.delete(key);
      return ok({ deleted: key });
    },
  });
}
