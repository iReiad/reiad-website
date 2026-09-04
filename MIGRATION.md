# Migration tracker

Four moves, all part-done. The rule is **convert what you touch**: any file
you edit for another reason gets converted in the same change, wired up
properly, with its checks passing. No separate "migration sprint".

**The door is shut, and `scripts/check-closed.ts` is what shuts it.**
`scripts/closed-set.json` records every file still on the old system by
name, and the list may only get shorter: converting one and running
`--update` records the shorter list, and a NEW file there fails the check
naming what to build instead. This tracker says what is left; that check
stops the total growing while somebody works through it.

```sh
node scripts/check-closed.ts --list      # what is left
node scripts/check-closed.ts --update    # after converting one
```

## 1. JavaScript to TypeScript

### Browser modules

Built from `aab/src/*.ts` to `aab/*.js` by `scripts/build-modules.ts`. The
built file is committed because the site deploys by uploading `aab/` with no
build step. **Never edit the output.**

`MODULES` in `build-modules.ts` is the done list and is read out of that
file rather than kept here. A name in a Done list that the generator has
never heard of is the failure at the top of `CLAUDE.md` happening to the
list that tracks it.

`SHARED` in the same file is the other half: `/content.js`, the four
`/<school>/curriculum.js` ladders, `/tools/stock.i18n.js`,
`/calculators.js` and `/portfolio.js` are written out of `shared/*.ts`,
because the Worker, the routes and the checks read them as TypeScript
and only the browser needs a file at a URL. Those addresses are in
`PRECACHE` in `aab/sw.js` and in the imports of eleven browser modules,
so they are fixed.

### The served modules, classified

Every module in `aab/` was asked one question: **what is this for?** Four
answers, and the answer decides where it goes rather than its size.

| | |
| --- | --- |
| **interface** | a page's own behaviour. It becomes a React component and the file goes |
| **service** | something more than one page needs at run time: the session, the mirror, storage, the API. It stays a served module, read through `runtimeModule()` |
| **shell** | what every page loads. It goes into `next/components/` piece by piece, and what is left is what a Next route genuinely cannot do |
| **infrastructure** | the service worker, which is not a module a page loads at all |

The two lists are not the same job and are not done in the same order. A
module that becomes a component does not need converting first: it is
rewritten in TSX and the `.js` deleted, which is one change rather than
two. A module that stays a **service** is the one worth converting,
because it is the one that is going to be read by TypeScript at the
other end.

**Still JavaScript:** `sw.js`, and `aab/schools/*.js`, the three-school
engine.

`sw.js` is last on purpose and to TypeScript rather than to a component:
a mistake there logs nobody out and serves stale everything.

Two of these have a permanent reason to stay a module rather than become
a component:

- `editor.js`. A `contenteditable` is a piece of the DOM the browser and
  the writer are both editing behind React's back, and `CLAUDE.md` says
  why a second copy of it is the bug.
- `courses.js`. The catalogue is admin-only, so the server must not
  render it into a page.

**What a conversion costs outside `aab/src/`,** because it is never only
the rename:

| | |
| --- | --- |
| `aab/src/tsconfig.json` | `rootDir` is the repo root, since `pieces.ts` imports `/content.js` and tsc refuses an input above `rootDir`. With it `allowImportingTsExtensions`, because `content.ts` names its four ladders by their real filenames, and `rewriteRelativeImportExtensions`, which is what makes that legal in a config that EMITS rather than one that only reads |
| `scripts/build-modules.ts` | reads that compile's output under an `aab/src/` prefix, and skips the `shared/` output it also emits: those come from their own compile, which is the one `rebase` is applied to |
| `app/src/types/` | `app.d.ts`, `auth.d.ts` and `editor.d.ts` are emitted rather than written. `EditorHandle` is exported by name from `aab/src/editor.ts` because three files under `app/src/studio/` import that type by name |
| `aab/tsconfig.test.json` | `/editor.js` and `/photo.js` point at the source rather than at a declaration, the way `/account.js` does |

A declaration file is a promise about code nothing checks, and it stops
being needed the moment the code checks itself. `aab/src/types/` is empty
for that reason and `_lib/notion.d.ts` went with the module it described.

### The checks and the generators

**Done: all of `scripts/`.** `checkJs` is on, so a `.js` appearing there
again is a failing check rather than a thing somebody notices later.

**IT IS THE RENAME THAT IS THE TRAP.** Stripping is not checking. A `.ts`
file nothing typechecks is a `.js` file wearing annotations, and it is
worse than the `.mjs` was, because a reader believes them. So
`scripts/tsconfig.json` and `scripts/check-types.ts` landed with the first
chunk, and that check is in `check-all.ts`: a file is not converted until
it typechecks under `strict`.

`scripts/check-routes.ts` and `aab/.assetsignore` widened to `.ts` before
any file in `aab/` converted, rather than after: a `.ts` test beside the
others would otherwise be published at its own public URL, and the rule
that catches that only knew `.mjs`.

Three defects the conversion turned up, each of which is a shape to
watch for rather than a fixed bug:

- **A check reporting on a smaller set than it claims.** `check-next.ts`
  read `group.icon` and `group.links` off a `NavGroup`, which has never
  had either, so its loop added nothing while it printed a confident
  count.
- **A vocabulary conflated with another under one name.** `kindOf()` in
  `lib/coursera.ts` answered `"file"`, and no file in a Coursera export
  is ever one. A LESSON is one of five kinds and a FILE is one of seven;
  `LessonKind` in `shared/courses.ts` is imported rather than written out
  a second time.
- **A vocabulary copied four times.** The D1 binding over `node:sqlite`
  was twelve lines in four files and they had already drifted: two
  narrowed what they bound and two passed values through, and
  `node:sqlite` throws on an `undefined` where D1 stores NULL, so a
  handler that binds an absent field failed in a test and worked in
  production. `scripts/sqlite-d1.ts` is the one copy.

`.github/workflows/checks.yml` kept its own copy of the check list until
that sweep, and calls `check-all.ts --stage=<name>` now, once per step, so
the steps stay separate in the interface and the list stays in one place.

### The stale-pointer sweep, and the check that ended it

**Twenty-five names in this repository resolved to nothing.** A stale
pointer costs nothing until somebody follows it, so nothing fails and
nobody notices, which is exactly why they survive.

`scripts/check-pointers.ts` is what stops the twenty-sixth. It reads every
tracked file and fails on any `check-*`, `build-*`, `import-*`, `export-*`
or `*.test.*` name that reaches no file, with `GONE` for the ones named as
gone on purpose, keyed by the file AND the name so that a NEW mention
somewhere else still fails.

The names it found, kept here because naming them is what the exemptions
are for:

- `scripts/check-modules.mjs`, which has never existed under any
  extension, and `check-css.mjs` in ten places, `check-icons.mjs`, and
  `aab/check-routes.mjs`, which `SETUP.md` gave as an instruction to run
  and which was wrong in the directory AND the extension.
- `scripts/build-styles.mjs` and the `aab/tailwind.css` it wrote, both
  deleted for a compiler Next already has, still named as live three days
  later. `check-accents.ts` printed `aab/styles.css` in three of its
  messages after that file became `next/styles/site.css`: the check read
  the right file and told you to edit the wrong one.
- `aab/deutsch/build-deutsch.mjs` and `build-english.mjs`, given as
  commands for regenerating practice books that had become routes in
  #129.
- `check-workbook.mjs`, which never existed and which two files named.
  Following each up gave opposite answers, and that is the reason this
  one is worth remembering: `schriftKey()` **was** held all along, by
  `aab/schools/workbook.test.ts`, so the guarantee was real and the
  pointer named the wrong file, which is the worse of the two. But
  `dayCount()` was **not** held, and nothing compared `workbook.days` in
  a `curriculum.js` against the days in the book, which is a learner told
  they are on day 30 of 60 in a book that has 90. `check-next.ts` holds
  it now.

Two pointers are deliberately left: `aab/app.js` and
`aab/tools/stock.model.js` are precached, so editing a comment in one
costs every returning visitor a refetch of the whole shell. They are free
to fix on the day those modules become TypeScript.

### next/

The routes and components were always TypeScript. What was not is the
node-side files beside them, and they are the reason the debt kept
growing: five `.mjs` test files are five neighbours to copy.

**Left (0).** `postcss.config.mjs` is not one: a PostCSS config is read by
the tool, not by us, and Next reads only `.js`, `.mjs`, `.cjs` and
`.json` for it.

`next/tsconfig.test.json` is what holds these to their types, and its
`include` already covers `*.test.ts`, so a rename puts a file under
`strict` the moment it lands. `scripts/check-types.ts` runs that config.

`hydrate-fixture.ts` renders one component the way a route renders it,
serves that markup with a script that hydrates it, and opens a browser on
the result. Both dynamic routes are `force-dynamic`, so
`interactive.test.ts` cannot serve either and the only other way in is
`dev-worker.ts`, which is the whole OpenNext build on workerd. Both are
excluded from `next/tsconfig.json` and checked by `tsconfig.test.json`.

### Worker

**Done: all of `functions/`.** Wrangler's esbuild type-strips with no
configuration, so a `.ts` there needs nothing but the rename and real
types.

**`functions/tsconfig.json` is what makes any of it count.** Wrangler's
esbuild reads no tsconfig, so a `.ts` here typechecked nowhere until that
file existed. `scripts/check-types.ts` runs it, and
`functions/tsconfig.test.json` holds the tests under `_lib/` to theirs, on
the root install, so it runs in CI as well.

**What a D1 binding is, said once.** There is no
`@cloudflare/workers-types` here and adding one to type six methods would
be a dependency the Worker's build does not need, so `_lib/db.ts` declares
the shape structurally and exports it. `_lib/r2.ts` is the same for the
bucket, after `backup.ts` and `sync.ts` had declared it separately and
disagreed about `head()`.

Converting `sanitise` broke `check-css.ts`, which read `ALLOWED_CLASSES`
with a regex that had no room for `: Set<string>` between the name and the
`=`. Expect the same from any check that greps a source file.

### app/

One file, and it is a browser test: `studio.test.ts`. There is no
JavaScript and no `.mjs` left in this workspace.

It is NOT in `app/tsconfig.json`, and that is the point of the second
config rather than an oversight. That one is the BUILD, run by `tsc -b`
before Vite with an `include` of `src`, so a test in it would hold the
Studio's own build to Playwright being installed.
`app/tsconfig.test.json` is the second config, `check-types.ts` runs it,
and where `app/node_modules` is absent it skips and says which directory
to install in.

### shared/

Already all TypeScript, and `shared/README.md` describes every file in
it: `check-types.ts` fails on one that does not.

## 2. Stylesheet to Tailwind

Tailwind is compiled by Next through `@tailwindcss/postcss`.
`next/styles/tailwind.css` is the theme and the utilities and
`globals.css` imports it; there is no build step and no committed output.
`@theme` maps the site's own tokens, so `bg-panel` means `var(--panel)` in
both themes.

**Done:** `/account`, and the component library under
`next/components/ui/`.

That library is the mechanism for the rest of it. Each component replaces
a pattern the routes were writing out by hand:

| | replaces | written by hand |
| --- | --- | ---: |
| `button.tsx` | `.btn` `.btn-solid` `.btn-ghost` `.icon-btn` `.top-btn` | 37 |
| `field.tsx` | an input styled in 11 places, 5 setting focus by hand | 11 |
| `surface.tsx` | `.card` `.cell` `.tile` `.chart-card` grounds | 50+ |
| `chip.tsx` | `.chip` `.tag` | 46 |
| `stat.tsx` | `.tile` + `.tile-value` | 50 |
| `note.tsx` | hand-coloured aside boxes, empty states | |
| `label.tsx` | `.section-label mono` `.eyebrow` | 43 |
| `meter.tsx` | five separate progress bars | 5 |

None of them names a colour: `accent-*` resolves to whatever `--accent` is
on the nearest container. A page converted to use them is themed by being
converted.

The stylesheet's own tokens moved first, which is what makes the rest
cheap: `--panel` and `--hairline` are `color-mix()` expressions carrying a
trace of `--accent`, so 75 surfaces and 269 borders follow the page's
colour without any of them being edited.

Three things stay in `next/styles/site.css` permanently, and the split is
the point:

- **anything an article carries.** `tw` sits below `article` in the layer
  order. An article's body is HTML in a database and Tailwind's compiler
  cannot see it.
- **CSS with no utility.** The popover menu is `@starting-style`,
  `::backdrop`, `:popover-open` and anchor positioning.
- **DOM built in a loop.** A class name inside `createElement` is only
  found by the scanner because `aab/*.js` is a source. That makes it
  work, not readable.

So the target is JSX and route markup, not the whole stylesheet.

## 3. Hand-written HTML to routes

**Nothing new is built as a hand-written or string-generated page.** A
page is a Next.js route; a piece of interface is a component. See
`CLAUDE.md`.

**Done: every page.** The four practice books were the last, in #129:
`next/app/[section]/[slug]/arbeitsbuch/` and `workbook/`, with
`aab/schools/workbook.js` loaded by the route as the engine. The two
builders that emitted them from a template literal are gone.

**Done: `/account`.** The route was rendered by Next from the day it was
ported and every section of it was still DRAWN by `/account-page.js`,
which is the shape this whole tracker is about: correct HTML with a
browser module building the contents of it in a loop. Nine sections are
components under `next/components/account/` now. What is left in
`aab/src/account-page.ts` is four jobs, and each is there for a reason
rather than because it has not been got to:

| | |
| --- | --- |
| which half of the page shows | signed in or not is a token in this browser, and both halves ship hidden |
| the exchange | `sync()` writes the account's rows on to the device, and every component redraws on the `sync:done` it fires. Something has to start it once |
| take a copy | one button, one blob, and it needs the whole account at once, which no single component has |
| leaving | sign out, and erase everything |

Three things came out of that port that are not about where code lives,
and all three are rules now:

**The ladder each bar counts against comes down from the ROUTE**, out of
`next/lib/school-ladders.ts`, which `scripts/build-school-tree.ts`
generates from `content/schools.backup.json`. The page used to import all
four schools' `curriculum.js` in the browser to find the denominator, 150
KB of modules for 20 KB of facts. **The ladder is the server's and the
ticks are the browser's.**

**`subscribe()` in `progress.ts` hears `sync:done`**, and `clearMirror()`
in `sync.ts` fires it. `aab/sync.js` writes the account's rows straight
into localStorage, which fires neither the same-tab event nor `storage`,
so for a signed-in reader every meter on every page was drawn against
what storage held BEFORE the exchange and stayed there. It looked right
most of the time, because the exchange usually finishes before the first
paint, and wrong on the one page that fetches something of its own first:
a course target reading "0 of 60" beside a bar of the same school reading
"9 of 60".

**The table it reads is `nav.ts`.** `COURSES` in `content.js` held the
money school twice, once written out by hand under a name it stopped
using when it moved to `/money/` and once through `SKILLS`: two
checkboxes with one `id`, a duplicate in the target form's menu, and a
bar labelled with the old name.

**Not moving:** `404.html` and `offline.html`. They have to answer when
the Worker, the route and the network are all unavailable, which is
exactly when a route cannot.

## 4. Prose

Comments and docs carry the constraint, not the story. Keep: what breaks,
what must not be renamed, why an order is load-bearing, what a check is
for. Cut: narrative, dated process notes, and reasoning that only made
sense while a decision was being made.

**Left:** the file headers across `aab/` and `functions/`, most of which
run 30 to 70 lines.
