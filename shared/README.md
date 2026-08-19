# shared/

The handful of things that more than one runtime has to agree on.

There are three renderers of this site now: the Worker in
`worker.js` plus `functions/`, the browser in `aab/`, and the
Next.js route in `next/`. Anything all of them must say the same
way lives here, and nowhere else.

Today that is four files:

- **`look.ts`** the per-section table. What mount a piece is
  served at, the class on its body, the card it falls back to, how
  "8 min read" is written, and the line at its foot. Plus
  `headFacts()`, which is every fact the head of an article page
  states: both renderers build their tags from it, which is what
  makes "the two agree" a thing a test can check rather than a
  thing a comment can ask for.

- **`headers.ts`** the security headers. `aab/_headers` is read by
  Cloudflare's static asset server and applies to files in `aab/`;
  a response built by a Worker is not a file, so it gets none of
  them unless it says so. `scripts/check-headers.ts` fails if this
  list and `_headers` stop agreeing.

- **`schools.ts`** the four curricula, read out of D1 in the shape
  the site already speaks, plus the ladder's arithmetic: a lesson's
  URL, its progress id, its label.

- **`rows.ts`** what a row of this database actually is. The set of
  values each status column may hold, written once as a constant
  with the type derived from it, so a status added to one is added
  to the other by construction.

## TypeScript, and nothing compiled beside it

These are `.ts` files and there is no `.js` next to them, no build
script in this directory and nothing to keep in step. Both
consumers compile them:

- **Next** through `transpilePackages: ["@reiad/shared"]` in
  `next/next.config.ts`, which it needs because the package
  resolves inside `node_modules` and Next does not compile
  TypeScript it finds there.
- **the Worker** through wrangler's own esbuild, which compiles a
  `.ts` import when it bundles `worker.js` with no configuration
  at all.

`package.json` therefore exports the `.ts` files directly.

It was briefly the other way around, and the other way around is
worth not going back to: the four modules were compiled to
committed `.js` and `.d.ts` beside their own source, which made
twelve files where there are four, plus a build script, plus a
check to catch somebody editing the output instead of the input.
All of that existed to serve a compile step that neither runtime
needs, since both of them already have a compiler.

`tsconfig.json` here emits nothing. It is for
`npx tsc -p shared/tsconfig.json`, which answers "does this
directory typecheck on its own" without waiting on either
consumer's build.

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

## Editing one of these, and the copy that does not notice

**A change here does not reach `next/` until the copy is deleted.**
Not until `npm install` is re-run: npm keys a `file:` dependency by
its version, sees `1.0.0` already installed, and leaves the stale
copy alone however much the contents changed. So the sequence is:

```sh
rm -rf next/node_modules/@reiad/shared && (cd next && npm install)
```

This is worth the two commands because the failure is silent and
expensive. A typo in `bnNum` put every Bangla numeral on the site
into Devanagari, `০১২৩` becoming `०१२३`. It was fixed here, the
Next build was re-run, and the route kept serving the wrong digits,
because the build was compiling a copy made before the fix. What
caught it was `next/parity.test.mjs`, which renders the route and
compares it against the page it replaced; nothing else would have,
and the digits are similar enough to survive a glance at a diff.

The Worker never has this problem. It imports by relative path, so
it reads the file that is actually here.
