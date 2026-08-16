/* ============================================================
   open-next.config.ts

   The defaults, deliberately. @opennextjs/cloudflare's incremental
   cache, tag cache and queue all have Cloudflare-backed options
   (KV, D1, Durable Objects) and none of them earns its keep here:
   this app serves one route, that route is server-rendered per
   request from D1, and the article is already cached at the edge
   for a minute by the Cache-Control the response carries.

   Adding a second cache in front of a one-minute cache would give
   this site two answers to "how stale can an article be" and one
   more thing to invalidate on publish.
   ============================================================ */

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig();
