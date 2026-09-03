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

/** One stored object, as far as anything here reads one.
    `uploaded` is a Date and is only ever serialised: both listings
    that read it (the media inventory and the snapshot status) hand
    it straight to JSON.stringify. */
export interface R2Object {
  key: string;
  size: number;
  httpEtag: string;
  uploaded: Date;
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
  /** `range` answers a slice of the object: pdf.js reads a large
      file a chunk at a time and a player seeks. Without it every
      seek is the whole file again. */
  get(
    key: string,
    options?: { range?: { offset: number; length?: number } | { suffix: number } },
  ): Promise<R2ObjectBody | null>;
  head(key: string): Promise<R2Object | null>;
  /** `cursor` and `truncated` are how a listing longer than one
      page is read to the end. R2 answers at most 1000 keys, and the
      media panel's headline is a TOTAL: a caller that ignored these
      would print a number that is quietly wrong on the day the
      bucket outgrows one page, with nothing to see. */
  list(options?: { prefix?: string; limit?: number; cursor?: string }):
    Promise<{ objects: R2Object[]; truncated?: boolean; cursor?: string }>;
  delete(key: string): Promise<void>;
}

/** The binding is called MEDIA and it holds two unrelated things:
    every photo on the site, and the nightly database snapshot under
    `backups/`. One bucket, two jobs, which is why the name does not
    say either. */
export interface MediaEnv {
  MEDIA?: R2Bucket;
}
