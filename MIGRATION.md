# Migration tracker

Four moves, all part-done. The rule is **convert what you touch**: any file
you edit for another reason gets converted in the same change, wired up
properly, with its checks passing. No separate "migration sprint".

Updated 19 August 2026.

## 1. JavaScript to TypeScript

### Browser modules

Built from `aab/src/*.ts` to `aab/*.js` by `scripts/build-modules.ts`. The
built file is committed because the site deploys by uploading `aab/` with no
build step.

**Done (14):** `account-page` `api` `checkpoints` `courses` `crumbs` `keep`
`photo` `prefs` `saved` `share-card` `signin` `sync` `tools/live`
`tools/tools`

### The 31 served modules, classified

Every module in `aab/` read, and asked one question: **what is this
for?** Four answers, and the answer decides where it goes rather than
its size.

| | |
| --- | --- |
| **interface** | a page's own behaviour. It becomes a React component and the file goes |
| **service** | something more than one page needs at run time: the session, the mirror, storage, the API. It stays a served module, read through `runtimeModule()` |
| **shell** | what every page loads. It goes into `next/components/` piece by piece, and what is left of it is what a Next route genuinely cannot do |
| **infrastructure** | the service worker, which is not a module a page loads at all |

`loads` is how many routes name it in `SiteScripts`; `imports` is how
many other modules import it. A file with neither is either dead or
loaded by something not counted here, and both were worth checking.

| File | Lines | | Verdict |
| --- | ---: | --- | --- |
| `sw.js` | 1628 | | **infrastructure.** Convert last, and to TypeScript rather than to a component. A mistake here logs nobody out and serves stale everything |
| `courses.js` | 999 | ts | **interface.** All four pages of `/skills/courses/`. The largest single conversion left |
| `editor.js` | 952 | | **service, permanently.** A `contenteditable` is a piece of the DOM the browser and the writer are both editing behind React's back. `CLAUDE.md` says why a second copy is the bug |
| `content.js` | 826 | | **service**, and the one that unblocks the most. `COUNTS`, `PAGES` and `SECTIONS` are read by ten modules and by three checks that run in node. It wants to be `shared/`, not a component |
| `app.js` | 605 | | **shell.** Eight jobs; the theme and the boot are already `shell.tsx`'s. What is left that a route cannot do: the palette, the shortcut sheet, speculation rules and the service-worker registration |
| `sync.js` | 513 | ts | **service.** The account is the record and this is the mirror. Nothing about it is a page |
| `account.js` | 417 | | **service.** The session. Eighteen importers, more than anything else here |
| `crumbs.js` | 351 | ts | **interface**, and half converted: `<Crumbs>` exists and only the course pages use it. The other 250 pages still get their trail from here |
| `signin.js` | 347 | ts | **interface.** The account menu, which is a `popover` |
| `tilt.js` | 282 | | **interface.** A pointer effect on cards |
| `audience.js` | 281 | | **shell.** The learn/work switch, whose markup is already `sidebar.tsx`'s |
| `news.js` | 246 | | **interface.** The headline card and the mini window, shared by `pulse.js` and `about.js` |
| `saved.js` | 240 | ts | **service.** Scenarios, targets and the library |
| `keep.js` | 220 | ts | **interface.** The Save and Add a note under a byline |
| `comments.js` | 219 | | **interface.** The thread under a piece |
| `auth.js` | 216 | | **service.** The Studio's gate |
| `checkpoints.js` | 209 | ts | **service.** The ticks inside a lesson, filed under a school's own key |
| `account-page.js` | 203 | ts | **shell**, and finished: four jobs left and the section above says why each stays |
| `engage.js` | 186 | | **interface.** Reactions and reader questions |
| `prefs.js` | 181 | ts | **service.** Applied before the first paint by `shell.tsx`, carried by `sync.ts` |
| `read-aloud.js` | 150 | | **interface.** The speech control on a piece |
| `photo.js` | 144 | ts | **service.** Decoding a pasted photo. Never a fetch: `CLAUDE.md` says what that cost |
| `about.js` | 144 | | **interface.** A tally and a research window. The tally wants server rendering, which needs `content.js` in `shared/` first |
| `api.js` | 133 | ts | **service.** Every endpoint this site has |
| `share-card.js` | 123 | ts | **service.** Draws the 1200×630 JPEG a pasted link shows |
| `streak.js` | 122 | | **service.** `days-active`, which four things count |
| `pieces.js` | 116 | | **service**, and smaller than it was: see below |
| `hub.js` | 97 | | **interface.** The filter row on the three reading hubs |
| `pulse.js` | 83 | | **interface.** The market pulse on the Insights hub. Not `pulse-card.tsx`, which is the home page's card of WRITING: two things with one name |
| `activation.js` | 61 | | **service.** Whether the dynamic layer is reachable |
| `auth-config.js` | 35 | | **service.** One constant the gate reads |

**Done: `contact-form.js`**, 64 lines, the first one moved.
`components/contact-form.tsx` renders the `<form>` around markup the
route still writes, so the third of its three ways still works: with
no JavaScript at all the form POSTs to Web3Forms on its own. That
matters more here than anywhere else on the site, because this is the
page a reader with a broken script is using to reach a person.

**And what the survey found dead.** `initArticleCards()` in `app.js`
filled `#article-cards`, and nothing renders that id: the hubs draw
their own cards on the server from `next/lib/hub.ts` and the home page
has `<FeaturedCard>`, `<ContinueCard>` and `<PulseCard>`. The only two
documents left carrying it are in `archive/`, which nothing serves. It
took `piecesIn` and `filePieces` off `pieces.js` with it, and four
imports off `app.js`. `allPieces()` stays: it feeds the palette, which
is on every page.

### Which of them are still JavaScript

The `ts` column above is the whole answer, and it is deliberately not a
second table: a list of nineteen filenames with their line counts beside
the same nineteen filenames with their line counts is the failure at the
top of `CLAUDE.md`, in a file about migrations.

**Still JS (19):** `about` `app` `account` `activation` `audience`
`auth` `auth-config` `comments` `content` `editor` `engage` `hub`
`news` `pieces` `pulse` `read-aloud` `streak` `sw` `tilt`

The two lists are not the same job and are not done in the same order.
A module that becomes a component does not need converting first: it
is rewritten in TSX and the `.js` is archived, which is one change
rather than two. A module that stays a **service** is the one worth
converting, because it is the one that is going to be read by
TypeScript at the other end.

Also `aab/schools/*.js` (the three-school engine) and `aab/*/curriculum.js`.

### The checks and the generators

`scripts/` was 35 files of `.mjs`, which is JavaScript with a
different extension. Node has stripped TypeScript types on its own
since 22.18, so `node scripts/check-css.ts` runs with no build step,
no loader and no configuration: converting is a rename plus the
types.

**IT IS THE RENAME THAT IS THE TRAP.** Stripping is not checking. A
`.ts` file nothing typechecks is a `.js` file wearing annotations,
and it is worse than the `.mjs` was, because a reader believes them.
So `scripts/tsconfig.json` and `scripts/check-types.ts` landed with
the first chunk, and that check is in `check-all.ts`: a file is not
converted until it typechecks under `strict`.

**Done (22):** the four generators, both libraries under
`scripts/lib/`, and every one of the sixteen checks plus the runner
`check-all`.

**Left (13):** the seven `*.test.mjs`, and `export-schools`
`import-courses` `import-schools` `preview` `restore`
`school-source` `schools-snapshot`.

Four things came out of it that were not the types.

`kindOf()` in `lib/coursera.ts` returned `"file"`, and no file in a
Coursera export is ever a `file`: `splitName()` answers `attachment`
for one. Two vocabularies with four words in common, conflated under
one name, and the arrow between them was a function whose return
type nothing checked. A LESSON is one of five kinds and a FILE is
one of seven; `LessonKind` in `shared/courses.ts` is imported now
rather than written out a second time.

And `.github/workflows/checks.yml` kept its own copy of the check
list. Renaming four generators updated `check-all.ts` and every
document that named them, and not the workflow, so CI would have
failed on files that no longer existed for a rename that was
correct. It calls `check-all.ts --stage=<name>` now, once per step,
so the steps stay separate in the interface and the list stays in
one place.

`scripts/check-routes.js` and `aab/.assetsignore` widened to `.ts`
before any file in `aab/` converts, rather than after: a `.ts` test
beside the others would otherwise be published at its own public
URL, and the rule that catches that only knew `.mjs`.

**`check-next.ts` was checking none of the rail's icons.** It walks
`NAV` collecting the names a card asks for, and it read
`group.icon` and `group.links`. A `NavGroup` has never had either:
it has a label, an accent and `items`. So `group.links ?? []` was
an empty array on every group and the loop added nothing, while the
check went on printing "all 16 names a card asks for come back with
a drawing in them". It is 24 now, and all 24 do resolve, so nothing
was broken; the check was reporting on a smaller set than it
claimed, which is the harder failure to see.

**Three files named a file that does not exist.** `share-card.ts`
sent a reader to `scripts/check-modules.mjs`, which has never
existed under any extension, and `courses.ts` and `sw.js` to
`check-csp.mjs` and `check-css.mjs`, which are `.js`. Converting
`scripts/` is what made them visible.

And `check-accents.ts` printed `aab/styles.css` in three of its
messages, which moved to `next/styles/site.css` on 18 August 2026:
the check reads the right file and told you to go and edit the
wrong one.

### Worker

`functions/` is compiled by wrangler's esbuild, which type-strips with no
configuration, so a `.ts` there needs nothing but the rename and real types.

**Done (6):** `_lib/drive.ts` `_lib/ticket.ts` `_lib/quiz.ts`
`_lib/http.ts` `_lib/sanitise.ts` `api/courses/[[route]].ts`

**Left (25):** `_lib/` (`notion` 380, `broker` 277, `auth` 264, `backup` 223,
`sync` 210, `reader` 192, `input` 172, `db` 163, `admins` 58) and the 16
handlers under `functions/api/`, `functions/feeds/`, `functions/insights/`.

`_lib/db.js` is the remaining one nearly everything imports, so it is next.

Converting `sanitise` broke `check-css.mjs`, which read `ALLOWED_CLASSES` with
a regex that had no room for `: Set<string>` between the name and the `=`.
The check was right to fail and its parser now reads both forms. Expect the
same from any check that greps a source file.

### Shared

`shared/` is already all TypeScript.

### The declarations are the slow part

`aab/src/types/` is what a converted module leans on, and it was
written thin: `curriculum.d.ts` described four exports where `crumbs`
needed fifteen, and `content.d.ts` had no `SITE`, `PAGES` or `READS` at
all. Both are filled in now, so the next conversion of anything that
reads a ladder or the site's own furniture starts with real types
rather than with this work.

## 2. Stylesheet to Tailwind

`aab/tailwind.css` is built from `aab/src/styles/` by
`scripts/build-styles.mjs`. `@theme` maps the site's own tokens, so
`bg-panel` means `var(--panel)` in both themes.

**Done:** `/account.html`, and the component library under
`next/components/ui/`.

That library is the mechanism for the rest of it. Eight components, each
replacing a pattern the routes were writing out by hand:

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
colour without any of them being edited. A component converted to Tailwind
inherits the same thing through `@theme`.

Three things stay in `aab/styles.css` permanently, and the split is the point:

- **anything an article carries.** `tw` sits below `article` in the layer
  order. An article's body is HTML in a database and Tailwind's compiler
  cannot see it.
- **CSS with no utility.** The popover menu is `@starting-style`,
  `::backdrop`, `:popover-open` and anchor positioning.
- **DOM built in a loop.** A class name inside `createElement` is only found
  by the scanner because `aab/*.js` is a source. That makes it work, not
  readable.

So the target is JSX and route markup, not the whole stylesheet.

## 3. Hand-written HTML to routes

**Nothing new is built as a hand-written or string-generated page.** A page
is a Next.js route; a piece of interface is a component. See CLAUDE.md.

**In flight:** the German book is a route (`arbeitsbuch.html`), sharing
`components/workbook.tsx` with a data shape that already covers both schools.

**Done: `/account.html`.** The route was rendered by Next from the day
it was ported and every section of it was still DRAWN by
`/account-page.js`, which is the shape this whole tracker is about:
correct HTML with a browser module building the contents of it in a
loop.

Nine sections are components under `next/components/account/` now, and
`aab/src/account-page.ts` is 1155 lines down to 226. What is left is
four jobs, and each is there for a reason rather than because it has
not been got to:

| | |
| --- | --- |
| which half of the page shows | signed in or not is a token in this browser, and both halves ship hidden |
| the exchange | `sync()` writes the account's rows on to the device, and every component redraws on the `sync:done` it fires. Something has to start it once |
| take a copy | one button, one blob, and it needs the whole account at once, which no single component has |
| leaving | sign out, and erase everything |

Four things came out of it that are not about where code lives.

**The ladder each bar counts against comes down from the ROUTE**, out
of `next/lib/school-ladders.ts`, which `scripts/build-school-tree.ts`
generates from `content/schools.backup.json`. The page used to import
all four schools' `curriculum.js` in the browser to find the
denominator, 150 KB of modules for 20 KB of facts, and it is the exact
thing `next/lib/progress.ts` is written against: **the ladder is the
server's and the ticks are the browser's.**

**`subscribe()` in `progress.ts` now hears `sync:done`**, and so does
`clearMirror()` in `sync.ts` now fire it. `aab/sync.js` writes the
account's rows straight into localStorage, which fires neither the
same-tab event nor `storage`, so for a signed-in reader every meter on
every page was drawn against what storage held BEFORE the exchange and
stayed there. It looked right most of the time, because the exchange
usually finishes before the first paint. It looked wrong on the one
page that fetches something of its own first: a course target reading
"0 of 60" beside a bar of the same school reading "9 of 60".

**Eight sections, one on screen.** `components/ui/tab-panels.tsx` is
the calculators' arrangement in React: the fragment chooses the panel,
`replaceState` carries which, and a link from the account menu straight
to `#reading-list` opens that panel rather than scrolling to it. The
strip is `.topbar` again, the same pill and the same glass, one gap
below it. Nothing is hidden until the component has run, so a reader
with no JavaScript gets the long page rather than one section and seven
buttons that do nothing.

**And the table it reads is `nav.ts`.** `COURSES` in `content.js` held
the money school twice, once written out by hand under a name it
stopped using when it moved to `/money/` and once through `SKILLS`: two
checkboxes with one `id`, a duplicate in the target form's menu, and a
bar labelled with the old name.

**The English book is blocked on a decision, not on work.** The two books are
the same page structurally and two different designs visually: German uses
`buch-tag`, `tag-teil`, `muster` in `@layer deutsch`; English uses `wb-day`,
`wb-block`, `wb-field` in `@layer english`. One component cannot serve both
until somebody decides they should look the same. Unifying them is a
redesign and wants saying out loud rather than doing halfway through a port.

**Left:** the English book, generated as a template literal by
`aab/deutsch/build-deutsch.mjs` and `aab/english/build-english.mjs`. They
are the last real pages on the old method, and being on it is why they
carry `.slimbar` and lose the rail. Porting them to routes gives them the
rail, the drawer, the audience switch and the accent for free, and deletes
two builders.

They are precached, and the service worker already precaches six rendered
routes, so offline is not the obstacle it looks like.

`htmlAttrs()` in `next/lib/nav.ts` is a stopgap that gives the generated
books the right accent until they are routes. It goes when they do.

**Not moving:** `404.html` and `offline.html`. They have to answer when the
Worker, the route and the network are all unavailable, which is exactly
when a route cannot.

## 4. Prose

Comments and docs carry the constraint, not the story. Keep: what breaks, what
must not be renamed, why an order is load-bearing, what a check is for. Cut:
narrative, dated process notes, and reasoning that only made sense while a
decision was being made.

**Done:** `README.md` 514 to 62 lines.

**Left:** `CLAUDE.md` (1336), and the file headers across `aab/` and
`functions/`, most of which run 30 to 70 lines.

`archive/TRANSITION.md` (5158) is history and is not loaded by anything. Leave
it.
