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
to the Next Worker instead.

So a Next route renders HTML that links to `/styles.css`,
`/tailwind.css` and about twenty browser modules, **all of which
are files in `aab/`, served by the other Worker.** That is the
answer to "why is Tailwind in `aab/`": `aab/` is the only directory
anything is served from.

### What actually pins it there

Not habit. `aab/sw.js` precaches twelve files **by exact path**:

```
/offline.html  /styles.css  /tailwind.css  /app.js  /content.js
/api.js  /pieces.js  /signin.js  /account.js  /sync.js
/account-page.js  /streak.js
```

A service worker cannot precache a hashed filename it has not been
told about, and Next hashes everything it bundles. Every move below
has to answer that before it can happen, which is why the order
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
    nav.ts                 the one table
    db/                    D1 and Supabase reads
  styles/
    tokens.css             palette, scales, the @layer declaration
    article.css            what an article body may carry
    globals.css            imports the above, then Tailwind
  scripts/                 the modules that must run after hydration
  public/                  favicon, manifest, og/, feeds

functions/                 the API. 28 handlers, TypeScript
shared/                    what more than one runtime must agree on

aab/                       sw.js, 404.html, offline.html, fallback.css
```

`aab/` ends at four files. Not zero, and the four are the point:
they have to answer when the Worker, the route and the network are
all unavailable, which is exactly when a route cannot.

## The order, and why each step is where it is

### Stage A. The stylesheet moves into Next

The one the question was about, and the one everything else is
easier after.

`next/styles/globals.css` imports the tokens, the article layer and
Tailwind in that order, and the root layout imports it. Next emits
one hashed stylesheet and the `<link>` in `shell.tsx` goes away.

The layer order gets **easier**, not harder. Today it depends on
`styles.css` loading before `tailwind.css`, enforced by a comment
in `shell.tsx` and nothing else. As one import list it is a
sequence of lines in one file.

What has to be answered first: `aab/fallback.css`, a small
hand-written stylesheet for `404.html` and `offline.html`, which
cannot use a hashed asset. It carries the tokens and the type, and
nothing else. `sw.js` precaches that instead of the two big ones.

| moves | to |
| --- | --- |
| `aab/src/styles/tailwind.css` | `next/styles/globals.css` |
| the `@layer tokens` block | `next/styles/tokens.css` |
| the `@layer article` block | `next/styles/article.css` |
| the rest of `aab/styles.css` | `next/styles/`, split by layer |

### Stage B. The browser modules

Thirty-two at the top level of `aab/`, twenty of which a route
loads through `<SiteScripts>`. Each is one of three things and the
answer differs:

- **A component in disguise.** It renders markup the server could
  have rendered. `crumbs.js` is the clearest: it reads
  `location.pathname` and `document.title` to rebuild a trail the
  route already knows, and it guesses its own mount point wrongly
  on the course pages. These become components and the module is
  deleted.
- **Genuinely post-hydration.** A `contenteditable`, a chart drawn
  from a broker's numbers, a player. These stay modules, move to
  `next/scripts/`, and Next serves them.
- **Already shared.** `sync.js`, `api.js`, `account.js` are
  imported by the Studio and the desk as well. These are the last
  to move, and they move to `shared/` rather than into either app.

Fourteen of the thirty-two have TypeScript sources in `aab/src/`
already. The other eighteen get converted as they move, which is
the rule this repository already runs on.

### Stage C. The two remaining old-system pages

- **The account page** is a file whose entire body is built in the
  browser by `aab/src/account-page.ts`, 950 lines of it. That is
  why nothing on it uses a component. It becomes a route tree.
- **The Studio and the desk** are a separate Vite workspace
  (`app/`) with their own buttons, inputs and pills. They keep
  their build (a Studio is an app, not a page) but import
  `next/components/ui`, which is plain React with no Next imports
  and needs none.

### Stage D. `aab/` becomes what it says

Four files, plus `og/` and the feeds under `next/public/`. The
`[assets]` directory is renamed to `public/` at the root, because
by then that is what it is.

## Two rules that do not change

**An article body is HTML in a database.** Tailwind's compiler
cannot see it, so `@layer article` stays hand-written CSS above the
utilities, permanently. Stage A moves the file; it does not change
this.

**A storage key is a fact about somebody's browser.** `learn-read`,
`deutsch-schrift`, `courses-answers` and the rest are in real
accounts. Nothing in this plan renames one.

## What this is not

It is not a rewrite. Every stage above leaves the site working, and
each one is small enough to review. The reason to write the whole
shape down is that the stages only make sense against it: moving a
stylesheet is a chore on its own and the first step of something on
this page.
