/* ============================================================
   _lib/r2.ts: what an R2 bucket is, said once.

   There is no `@cloudflare/workers-types` in this install and there
   is deliberately not going to be one: the Worker's runtime shapes
   that this repository actually touches are five methods, and a
   dependency that declares four hundred is a dependency to keep in
   step for the sake of five.

   So it is declared structurally, and it is declared HERE rather
   than beside whichever module needed it first. That is the same
   rule `check-rows.ts` enforces for the database: one vocabulary,
   one place. Three modules bind MEDIA (the nightly snapshot, the
   Notion sync's photo copy, and the media endpoint), and three
   copies of this interface would be three that drift, each one
   correct about the calls its own module happens to make and silent
   about the rest.

   Widen it when a caller needs a field, and only then. An
   interface that describes more of R2 than this repository uses is
   an interface nothing checks.
   ============================================================ */

/** What R2 stores about the bytes, and hands back with them.
    `cacheControl` is here because every writer sets it: these keys
    are content hashes, so the bytes behind one never change. */
export interface R2HttpMetadata {
  contentType?: string;
  cacheControl?: string;
}

/** One stored object, as far as anything here reads one. */
export interface R2Object {
  key: string;
  size: number;
  httpEtag: string;
  httpMetadata?: R2HttpMetadata;
}

/** An object with its bytes still attached. `get()` answers this
    and `head()` answers the object alone, which is the whole
    difference between them and the reason the upload path can ask
    "is this already stored" without transferring anything. */
export interface R2ObjectBody extends R2Object {
  body: ReadableStream;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface R2Bucket {
  put(
    key: string,
    value: string | ArrayBuffer | Uint8Array,
    options?: {
      httpMetadata?: R2HttpMetadata;
      customMetadata?: Record<string, string>;
    },
  ): Promise<R2Object | null>;
  get(key: string): Promise<R2ObjectBody | null>;
  head(key: string): Promise<R2Object | null>;
  list(options?: { prefix?: string; limit?: number }): Promise<{ objects: R2Object[] }>;
  delete(key: string): Promise<void>;
}

/** The binding is called MEDIA and it holds two unrelated things:
    every photo on the site, and the nightly database snapshot under
    `backups/`. One bucket, two jobs, which is why the name does not
    say either. */
export interface MediaEnv {
  MEDIA?: R2Bucket;
}
