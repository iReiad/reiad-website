/* ============================================================
   /api/media, where the photos actually live.

   GET    /media/<key>        public: serve an image out of R2
   POST   /api/media          admin:  upload raw bytes, get a URL back
   GET    /api/media          admin:  list what's stored
   GET    /api/media/usage    admin:  what points at each key, and what
                                      nothing points at
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
import type { RouteContext } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.ts";
import { db } from "../../_lib/db.ts";
import type { DbEnv } from "../../_lib/db.ts";
import type { MediaEnv, R2Object } from "../../_lib/r2.ts";
import type {
  ArticleRow, ArticleVersionRow, SchoolLessonRow,
} from "../../../shared/rows.ts";

/** What this route binds: the bucket, and the D1 the admin guard
    reads a session out of. Both are declared where they are
    owned, `_lib/r2.ts` and `_lib/db.ts`, because other modules
    bind the same two. */
interface MediaRouteEnv extends DbEnv, MediaEnv {}

/* No SVG. It is a document format that can carry script, and this
   endpoint hands back whatever it was given with that content type. */
const TYPES: Record<string, string> = {
  "image/webp": "webp",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_BYTES = 8 * 1024 * 1024;

/* A reference as prose holds it: `/media/<slug>/<hash>.<ext>`, in an
   `<img src>` or in a `cover` column, with or without a host in
   front. Loose about the key's shape on purpose, because the match
   that matters is made against the keys the bucket really has. */
const MEDIA_REF = /\/media\/([A-Za-z0-9._~%-]+\/[A-Za-z0-9._~%-]+)/g;

/** How many stored objects the usage answer carries. Every total
    beside it counts all of them; this bounds the list alone. */
const LISTED = 500;

/* The fetch proxy is admin-only, so this is not the main line of
   defence, but a Worker sits inside Cloudflare's network and there
   is no reason for it to ever be pointed at a private address. */
const PRIVATE_HOST =
  /^(localhost$|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|\[?::1\]?$|.*\.internal$|.*\.local$)/i;

/* A miss is `undefined`, and the annotation says so: the index
   signature above answers `string` for every key, so the caller's
   `if (!ext)` is the only thing that knows better. */
const extFor = (type: unknown): string | undefined =>
  TYPES[String(type ?? "").split(";")[0].trim().toLowerCase()];
const typeFor = (key: string): string =>
  Object.keys(TYPES).find((t) => TYPES[t] === key.split(".").pop()) ?? "application/octet-stream";

/** First 16 hex characters of the SHA-256, 64 bits, which is far
    more than enough to tell one person's photo library apart. */
async function contentHash(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest, 0, 8)]
    .map((b) => b.toString(16).padStart(2, "0")).join("");
}

const safeSlug = (value: unknown): string =>
  str(value, 80).toLowerCase().replace(/[^a-z0-9-]/g, "") || "loose";

/** A key we built, and not a path someone talked us into. */
const validKey = (key: string): boolean =>
  /^[a-z0-9-]{1,80}\/[0-9a-f]{16}\.[a-z0-9]{3,4}$/.test(key);

export async function onRequest(
  context: RouteContext<MediaRouteEnv, { key?: string[] }>,
): Promise<Response> {
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

        let parsed: URL;
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

      /* ---- what nothing references ----

         ADMIN.md §3 B 6 asks Media for four things and this is the
         fourth: the keys no article body, no `cover` and no lesson
         body points at. It is a join between the bucket listing and
         D1, and it is made HERE rather than across two fetches in a
         panel. Two answers taken a second apart can disagree: a
         photo uploaded between them reads as referenced by nothing,
         and this is the panel whose buttons delete bytes.

         Generous on purpose about what counts as a reference. It
         reads drafts as well as live pieces, and `article_versions`
         too: a photo only an earlier body names comes back the
         moment somebody restores that version, so an unreferenced
         list that missed it would be a list that loses a picture. */
      if (key === "usage") {
        const guard = await requireAdmin(context);
        if (guard) return guard;

        const d1 = await db(env);
        if (!d1) return notConfigured();

        /* The whole bucket, page by page. `list()` answers at most
           1000 keys and every number below is a total, so a single
           page would be a count that goes quietly wrong on the day
           the bucket outgrows one. The ceiling here is real and is
           reported rather than hidden. */
        const objects: R2Object[] = [];
        let cursor: string | undefined;
        let more = true;
        for (let page = 0; page < 20 && more; page += 1) {
          const listed = await bucket.list({ limit: 1000, cursor });
          objects.push(...listed.objects);
          more = Boolean(listed.truncated && listed.cursor);
          cursor = listed.cursor;
        }

        /* Only the rows that could hold one. `LIKE` is as far as
           SQLite goes here and it is a filter rather than the
           match: what a body holds is prose and what the bucket
           holds is keys, so the two are compared below, key by
           key, against what is really stored. */
        const [articles, versions, lessons] = await Promise.all([
          d1.prepare(
            `SELECT slug, section, status, cover, body FROM articles
              WHERE body LIKE '%/media/%' OR cover LIKE '%/media/%'`
          ).all<Pick<ArticleRow, "slug" | "section" | "status" | "cover" | "body">>(),
          d1.prepare(
            `SELECT slug, saved_at, cover, body FROM article_versions
              WHERE body LIKE '%/media/%' OR cover LIKE '%/media/%'`
          ).all<Pick<ArticleVersionRow, "slug" | "saved_at" | "cover" | "body">>(),
          d1.prepare(
            `SELECT school, stage, slug, body FROM school_lessons
              WHERE body LIKE '%/media/%'`
          ).all<Pick<SchoolLessonRow, "school" | "stage" | "slug" | "body">>(),
        ]);

        const where = new Map<string, string[]>();
        const note = (text: string | null, place: string): void => {
          for (const found of String(text ?? "").matchAll(MEDIA_REF)) {
            const at = where.get(found[1]);
            if (!at) where.set(found[1], [place]);
            else if (!at.includes(place)) at.push(place);
          }
        };

        for (const a of articles.results ?? []) {
          note(a.body, `${a.section}/${a.slug}${a.status === "live" ? "" : " (a draft)"}`);
          note(a.cover, `${a.section}/${a.slug}, as its share card`);
        }
        for (const v of versions.results ?? []) {
          note(v.body, `${v.slug}, saved ${String(v.saved_at).slice(0, 10)}`);
          note(v.cover, `${v.slug}, an earlier share card`);
        }
        for (const l of lessons.results ?? []) {
          note(l.body, `${l.school}/${l.stage}/${l.slug}`);
        }

        /* The nightly snapshots share this bucket and are not
           photos. Counting them as unreferenced would put the
           database's own backups at the top of a list headed
           "delete these to recover space". */
        const snaps = objects.filter((o) => o.key.startsWith("backups/"));
        const media = objects
          .filter((o) => !o.key.startsWith("backups/"))
          .map((o) => {
            const places = where.get(o.key) ?? [];
            return {
              key: o.key,
              url: `/media/${o.key}`,
              size: o.size,
              uploaded: o.uploaded,
              refs: places.length,
              where: places.slice(0, 3),
              /* Whether the DELETE below would take it, decided by
                 the predicate that route uses. A delete button on a
                 key that route refuses is a button that fails. */
              removable: validKey(o.key),
            };
          })
          /* Unreferenced first, and biggest first within that,
             which is the order somebody recovering space reads in. */
          .sort((a, b) =>
            (a.refs === 0 ? 0 : 1) - (b.refs === 0 ? 0 : 1) || b.size - a.size);

        const loose = media.filter((m) => m.refs === 0);

        return ok({
          media: media.slice(0, LISTED),
          listed: Math.min(media.length, LISTED),
          count: media.length,
          bytes: media.reduce((n, m) => n + m.size, 0),
          unreferenced: loose.length,
          unreferencedBytes: loose.reduce((n, m) => n + m.size, 0),
          snapshots: { count: snaps.length, bytes: snaps.reduce((n, o) => n + o.size, 0) },
          /* What "nothing references it" was decided against, so a
             panel can say it rather than asking a reader to take
             the word "nothing" on trust. */
          scanned: {
            articles: (articles.results ?? []).length,
            versions: (versions.results ?? []).length,
            lessons: (lessons.results ?? []).length,
          },
          truncated: more,
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

      /* One read, and it is used twice: to choose the extension,
         and to store the type. `.get()` answers `string | null`,
         and the second read was written as though it could not. */
      const sent = request.headers.get("Content-Type") ?? "";
      const ext = extFor(sent);
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
            contentType: sent.split(";")[0].trim(),
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
