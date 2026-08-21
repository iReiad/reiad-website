/* ============================================================
   _lib/workers.d.ts: the Worker runtime globals node does not have.

   This is NOT a description of a JavaScript module. Those are what
   `notion.d.ts` was and why it went: a module that has converted
   describes itself. This declares two GLOBALS the workerd runtime
   provides and `@types/node` does not, which is a thing no module
   here can say about itself.

   There is no `@cloudflare/workers-types` in this install on
   purpose. It declares several hundred shapes for the four this
   repository touches, and a dependency describing a runtime is one
   more thing to keep in step with the runtime.

   Widen these when a caller needs a field, and only then.
   ============================================================ */

/** The edge cache. `caches.default` is Cloudflare's own addition to
    the Cache API: the shared cache in front of every Worker, which
    the standard `caches.open(name)` is not.

    Two callers, and both use it the same way: a JSON window under a
    synthetic https URL, put with a `Cache-Control` that decides how
    long it lives. `broker.ts` caches a reader's own portfolio for a
    minute; `news.ts` caches a headline sweep. Neither is a store:
    a miss must always be answerable by asking upstream again. */
interface WorkerCache {
  match(request: Request | string): Promise<Response | undefined>;
  put(request: Request | string, response: Response): Promise<void>;
  delete(request: Request | string): Promise<boolean>;
}

declare const caches: {
  default: WorkerCache;
  open(name: string): Promise<WorkerCache>;
};
