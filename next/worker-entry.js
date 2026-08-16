/* ============================================================
   worker-entry.js: the Next.js Worker, made self-sufficient.

   ---- what this is working around ----

   `@opennextjs/cloudflare` writes `.open-next/worker.js`, and that
   file never touches the ASSETS binding: it assumes Cloudflare's
   asset router runs in front of it and answers `/_next/static/...`
   before the Worker is ever called. That assumption holds when a
   request arrives at this Worker over a route.

   It does not hold when the request arrives over a service
   binding. A service binding calls a Worker's `fetch` handler
   directly and skips everything in front of it, asset router
   included. So the front Worker forwarding `/_next/static/x.js`
   here reached code with no idea what to do with the path, and the
   answer was a 500.

   Which is worse than it sounds, because the page still reads. The
   article is server-rendered and complete; the only symptoms are a
   console full of errors, a React that never hydrates, and six
   wasted requests per view. Nothing about a page of prose would
   have shown it. The first interactive route in Stage 11 would
   have been the thing that broke, a long way from the cause.

   So the paths the asset router would have answered are answered
   here instead, and this Worker now behaves the same whichever way
   it is reached.
   ============================================================ */

import openNext, {
  DOQueueHandler, DOShardedTagCache, BucketCachePurge,
} from "./.open-next/worker.js";

/* Re-exported unchanged. They are Durable Object classes OpenNext
   declares for its caches, and a Worker whose entry point does not
   export them fails to deploy. */
export { DOQueueHandler, DOShardedTagCache, BucketCachePurge };

/** Everything under here is a file in .open-next/assets, content
    hashed and immutable. Nothing else is: a page is the framework's
    to render. */
const IS_ASSET = /^\/_next\/static\//;

export default {
  async fetch(request, env, ctx) {
    if (IS_ASSET.test(new URL(request.url).pathname)) {
      return env.ASSETS.fetch(request);
    }
    return openNext.fetch(request, env, ctx);
  },
};
