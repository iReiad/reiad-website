# Where things go, and where they are going

Two Workers serve this site and one of them is holding the other's
furniture. This is the target shape and the order of the moves.

`MIGRATION.md` tracks what has moved. This says what "moved" means.

## What is true today

```
                    reiad.co.uk
                         │
              ┌──────────┴──────────┐
              │  reiad-website      │   worker.js, the front door
              │  (the main Worker)  │
              └──────────┬──────────┘
                         │
        ┌────────────────┼─────────────────┐
        │                │                 │
   functions/         aab/            reiad-next
   the API        every static file    the Next.js Worker
   28 handlers    7.8 MB, 65 at the    30 routes, reached by
                  top level            service binding
```

The main Worker is the front door. `[assets] directory = "./aab"`
means every file in `aab/` answers at its own public URL, and
`NEXT_ROUTES` in `worker.js` is the list of addresses it forwards
to the Next Worker instead. A Next route's HTML still links about
twenty browser modules that are files in `aab/`, served by the
other Worker: `aab/` is the only directory anything is served
from.

### What pins a file there

`aab/sw.js` precaches by **exact path**, and a service worker
cannot precache a hashed filename it has not been told about.
Next hashes everything it bundles, so every move below has to
answer `PRECACHE` before it can happen. That is why the order
matters more than the destination.

## The target

```
next/
  app/                     routes, and nothing but routes
    (site)/                the public pages
    [section]/             the schools and the reading desks
    api/                   nothing: the API stays in functions/
  components/
    ui/                    the design system: Button, Field, Card,
                           Band, Chip, Meter, Stat, Note, Crumbs
    chrome/                shell, rail, topbar, footer, drawer
    article/               what a written piece is made of
    school/                hub, ladder, lesson, workbook
    course/                the third-party player
  lib/                     data access and pure helpers
    db/                    D1 and Supabase reads
  styles/
    tokens.css             palette, scales, the @layer declaration
    article.css            what an article body may carry
    globals.css            imports the above, then Tailwind
  scripts/                 the modules that must run after hydration
  public/                  favicon, manifest, og/, feeds

functions/                 the API. 28 handlers, TypeScript
shared/                    what more than one runtime must agree on
                           nav.ts, the one table, is here: four
                           runtimes read it and next/ was three
                           of them

aab/                       sw.js, 404.html, offline.html, fallback.css
```

`aab/` ends at four files, and `fallback.css` is the one that
already arrived. Not zero, and the four are the point: they have
to answer when the Worker, the route and the network are all
unavailable, which is exactly when a route cannot.

## The order, and why each step is where it is

### Stage A. The stylesheet moves into Next  **done**

Done on 18 August 2026.

| moved | to |
| --- | --- |
| `aab/styles.css` | `next/styles/site.css` |
| `aab/src/styles/tailwind.css` | `next/styles/tailwind.css` |
| the two `<link>` tags | one `@import` list in `next/styles/globals.css` |
| `aab/tailwind.css`, built and committed | nothing: Next compiles it |

Tailwind is compiled by Next through `@tailwindcss/postcss`.
`scripts/build-styles.mjs` is gone with the committed output it
wrote: a build step and a check guarding somebody editing that
output, for a compiler the framework already has.

`next/styles/globals.css` imports the tokens, the article layer
and Tailwind in that order, and the root layout imports it. The
cascade order is that import list; it used to be two `<link>`
tags kept in sequence by a comment.

`aab/fallback.css` is what unblocked the stage: the whole
stylesheet with its comments removed, 248 KB against the 416
those two file-served pages loaded before, precached in place of
the two big ones. `scripts/build-fallback.ts` says why a subset
was wrong four times over.

Splitting `site.css` into a file per layer is worth doing and is
not this stage.

### Stage B. The browser modules

Twenty-five at the top level of `aab/`, most of which a route
loads through `<SiteScripts>`. Each is one of three things and the
answer differs:

- **A component in disguise.** It renders markup the server could
  have rendered. These become components and the module is
  deleted, which is what happened to the crumb trail:
  `next/components/ui/crumbs.tsx` is what draws it now.
- **Genuinely post-hydration.** A `contenteditable`, a chart drawn
  from a broker's numbers, a player. These stay modules, move to
  `next/scripts/`, and Next serves them.
- **Already shared.** `sync.js`, `api.js`, `account.js` are
  imported by the Studio as well. These are the last to move, and
  they move to `shared/` rather than into the app.

Anything without a TypeScript source in `aab/src/` gets converted
as it moves, which is the rule this repository already runs on.

### Stage C. The two remaining old-system pages

- **The account page** is a file whose entire body is built in the
  browser by `aab/src/account-page.ts`, 950 lines of it. That is
  why nothing on it uses a component. It becomes a route tree.
- **The Studio** is a separate Vite workspace (`app/`) with its
  own buttons, inputs and pills. It keeps its build (a Studio is an
  app, not a page) but imports `next/components/ui`, which is plain
  React with no Next imports and needs none.

### Stage D. `aab/` becomes what it says

Four files, plus `og/` and the feeds under `next/public/`. The
`[assets]` directory is renamed to `public/` at the root, because
by then that is what it is.

## Two rules that do not change

**An article body is HTML in a database.** Tailwind's compiler
cannot see it, so `@layer article` stays hand-written CSS above the
utilities, permanently.

**A storage key is a fact about somebody's browser.** `learn-read`,
`deutsch-schrift`, `courses-answers` and the rest are in real
accounts. Nothing in this plan renames one.
