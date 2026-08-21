/* ============================================================
   /api/notion, write in Notion, publish here.

   GET /api/notion/status              is this switched on?
   GET /api/notion/pages?q=&db=        admin: what can I import?
   GET /api/notion/pages/<id>          admin: one page, as article HTML
   GET /api/notion/asset?u=<url>       admin: proxy one Notion image

   The conversion itself lives in _lib/notion.js, which is pure and
   tested. What's left here is the HTTP: who's allowed, what the
   errors mean, and the image proxy.

   ---- the proxy, and why it is gated ----

   Notion serves uploaded files from S3 on signed URLs that expire in
   about an hour, so an imported photo cannot keep the URL it arrived
   with; a piece published on Monday would lose its pictures before
   Tuesday. Imported images therefore point here, same-origin, and
   the Studio re-hosts them to /media before anything is published.

   It requires the admin session, because an open image proxy on
   someone else's domain is a gift to whoever finds it.

   ---- the token ----

   NOTION_TOKEN is an internal integration token. Without it every
   route here answers "not configured" and the Studio never shows the
   button, which is the bargain the rest of the dynamic layer makes.
   ============================================================ */

import { fail, methods, notConfigured, ok, str } from "../../_lib/http.ts";
import { requireAdmin } from "../../_lib/auth.ts";
import { db } from "../../_lib/db.ts";
import { syncFromNotion } from "../../_lib/sync.js";
import {
  client, convert, fetchBlocks, normaliseId, pageTitle, proxyURL, readFields,
} from "../../_lib/notion.js";

/* Where a Notion file can legitimately come from. */
const ASSET_HOSTS =
  /(^|\.)((notion\.so)|(notion-static\.com)|(amazonaws\.com)|(notion\.site))$/i;

export async function onRequest(context) {
  const { request, env, params } = context;
  const route = params.route ?? [];
  const url = new URL(request.url);
  const head = route[0] ?? "";
  const token = env.NOTION_TOKEN;

  // "Is this available?" has to answer even when it isn't: that is
  // how the Studio decides whether to show the button at all.
  if (head === "status") {
    return methods(request, {
      GET: async () => {
        const guard = await requireAdmin(context);
        if (guard) return guard;
        return ok({ configured: !!token, media: !!env.MEDIA });
      },
    });
  }

  if (!token) return notConfigured();
  const notion = client(token);
  const origin = env.SITE_ORIGIN || url.origin;

  /* The same pass the Cron trigger runs, on demand. Useful when you
     have just finished something in Notion and don't want to wait
     for the next quarter hour. */
  if (head === "sync") {
    return methods(request, {
      POST: async () => {
        const guard = await requireAdmin(context);
        if (guard) return guard;
        const d1 = await db(env);
        if (!d1) return notConfigured();
        return ok(await syncFromNotion(env, d1, {
          origin,
          force: url.searchParams.get("force") === "1",
        }));
      },
    });
  }

  return methods(request, {
    GET: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;

      try {
        /* ---------- proxy one image ---------- */
        if (head === "asset") {
          const target = url.searchParams.get("u");
          if (!target) return fail("url-required");

          let parsed;
          try { parsed = new URL(target); } catch { return fail("bad-url"); }
          if (parsed.protocol !== "https:" || !ASSET_HOSTS.test(parsed.hostname)) {
            return fail("host-not-allowed", 403, { host: parsed.hostname });
          }

          const upstream = await fetch(parsed.toString());
          if (!upstream.ok) return fail("asset-unavailable", upstream.status);

          const type = upstream.headers.get("Content-Type") ?? "";
          if (!type.startsWith("image/")) return fail("not-an-image", 415, { type });

          return new Response(upstream.body, {
            headers: {
              "Content-Type": type,
              "X-Content-Type-Options": "nosniff",
              // The signed URL behind this expires within the hour,
              // so there is nothing here worth keeping for long.
              "Cache-Control": "private, max-age=300",
            },
          });
        }

        /* ---------- what can I import? ---------- */
        if (head === "pages" && route.length === 1) {
          const q = str(url.searchParams.get("q"), 100);
          const dbId = normaliseId(url.searchParams.get("db"));

          const result = dbId
            ? await notion(`/databases/${dbId}/query`, {
                method: "POST", body: { page_size: 40 },
              })
            : await notion(`/search`, {
                method: "POST",
                body: {
                  ...(q ? { query: q } : {}),
                  filter: { property: "object", value: "page" },
                  sort: { direction: "descending", timestamp: "last_edited_time" },
                  page_size: 40,
                },
              });

          const pages = (result.results ?? [])
            .filter((p) => p.object === "page")
            .map((p) => ({
              id: p.id,
              title: pageTitle(p) || "Untitled",
              edited: p.last_edited_time,
              icon: p.icon?.emoji ?? "",
            }));

          return ok({ pages });
        }

        /* ---------- one page, converted ---------- */
        if (head === "pages" && route.length === 2) {
          const id = normaliseId(route[1]);
          if (!id) return fail("bad-page-id");

          const page = await notion(`/pages/${id}`);
          const state = { fetches: 0, truncated: false };
          const blocks = await fetchBlocks(notion, id, state);
          const html = await convert(blocks, { notion, origin, state });

          const f = readFields(page.properties);
          const cover = page.cover?.file?.url || page.cover?.external?.url || "";

          return ok({
            page: {
              id: page.id,
              url: page.url,
              title: f.title || "Untitled",
              dek: f.dek || "",
              tag: f.tag || "",
              topics: f.topics,
              slug: f.slug,
              lang: f.lang,
              date: f.date || String(page.created_time ?? "").slice(0, 10),
              status: String(f.status || "").toLowerCase(),
              body: html,
              cover: cover ? proxyURL(origin, cover) : "",
              edited: page.last_edited_time,
            },
            // Say so, rather than hand back a short article and let
            // it look finished.
            truncated: state.truncated,
          });
        }

        return fail("not-found", 404);
      } catch (err) {
        if (err.status === 401) {
          return fail("notion-unauthorised", 401, {
            message: "NOTION_TOKEN was rejected. Check the integration still exists.",
          });
        }
        if (err.status === 403) {
          // Notion answers 403 when the token is valid but the
          // integration lacks the capability being used, reading
          // content, most often, which is off by default on an
          // integration created for something else.
          return fail("notion-forbidden", 403, {
            message: "Notion refused the request. Check the integration has "
              + "read access under Capabilities, and that it is connected to "
              + "the page.",
          });
        }
        if (err.status === 404) {
          return fail("notion-not-shared", 404, {
            message: "Notion can't see that page. Open it in Notion, then "
              + "Connections → add the integration.",
          });
        }
        if (err.status === 429) {
          return fail("notion-rate-limited", 429, {
            message: "Notion is throttling. Try again shortly.",
          });
        }
        console.error("notion", err?.stack ?? err);
        // Carrying the upstream status through matters: without it a
        // network-level refusal between here and Notion is
        // indistinguishable from Notion itself saying no, and the two
        // have completely different fixes.
        return fail("notion-error", 502, {
          upstream: err?.status ?? null,
          message: String(err?.message ?? err),
        });
      }
    },
  });
}
