# shared/

The handful of things that more than one runtime has to agree on.

There are three renderers of this site now: the Worker in
`worker.js` plus `functions/`, the browser in `aab/`, and the
Next.js route in `next/`. Anything all of them must say the same
way lives here, and nowhere else.

Today that is two files:

- **`look.js`** the per-section table. What mount a piece is
  served at, the class on its body, the card it falls back to, how
  "8 min read" is written, and the line at its foot. Plus
  `headFacts()`, which is every fact the head of an article page
  states: both renderers build their tags from it, which is what
  makes "the two agree" a thing a test can check rather than a
  thing a comment can ask for.

- **`headers.js`** the security headers. `aab/_headers` is read by
  Cloudflare's static asset server and applies to files in `aab/`;
  a response built by a Worker is not a file, so it gets none of
  them unless it says so. `scripts/check-headers.mjs` fails if this
  list and `_headers` stop agreeing.

## Why it is a package

`next/` reaches it as `@reiad/shared`, a `file:` dependency.
A relative import up and out of `next/` is the obvious way and does
not work: Turbopack refuses to resolve above its own root, and
moving the root up moves Next's file-tracing root with it, which
breaks the OpenNext build in a way that reads like a Next 16
incompatibility and is nothing of the sort.

`next/.npmrc` sets `install-links=true` so npm copies this
directory into `next/node_modules` rather than symlinking it:
Turbopack resolves a symlink to its real path and then refuses it
for being outside the root. The copy is made by `npm install` and
is not committed, so there is still one source for each of these
files.

The Worker imports them by relative path, because esbuild has no
such restriction.
