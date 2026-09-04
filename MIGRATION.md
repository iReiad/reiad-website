# Migration tracker

Four moves, all part-done. The rule is **convert what you touch**: any file
you edit for another reason gets converted in the same change, wired up
properly, with its checks passing. No separate "migration sprint".

Updated 19 August 2026.

**The door is shut, and `scripts/check-closed.ts` is what shuts it.**
`scripts/closed-set.json` records every file still on the old system by
name, and the list may only get shorter: converting one and running
`--update` records the shorter list, and a NEW file there fails the check
naming what to build instead. This tracker says what is left; that check
stops the total growing while somebody works through it.

```sh
node scripts/check-closed.ts --list      # the 106 that are left
node scripts/check-closed.ts --update    # after converting one
```

## 1. JavaScript to TypeScript

### Browser modules

Built from `aab/src/*.ts` to `aab/*.js` by `scripts/build-modules.ts`. The
built file is committed because the site deploys by uploading `aab/` with no
build step.

**Done (22), which is every served module except `sw`:**
`account` `account-page` `activation` `api` `app` `audience` `auth`
`auth-config` `checkpoints` `courses` `editor` `photo` `pieces`
`prefs` `saved` `share-card` `signin` `streak` `sync` `tilt`
`tools/live` `tools/tools`

That list is `MODULES` in `build-modules.ts`, read out of it rather
than remembered. It said fourteen until 19 August 2026 and one of the
fourteen was `crumbs`, which this generator has never built: that
module is a component now and both halves of it are in
`archive/modules/`. A name in a Done list that the thing doing the
work has never heard of is the failure at the top of `CLAUDE.md`
happening to the list that tracks it.

**And five from `shared/`:** `/content.js` and the four
`/<school>/curriculum.js` ladders are written by the same
generator out of `shared/content.ts` and `shared/curricula/*.ts`,
because the Worker, the routes and the checks read them as
TypeScript and only the browser needs a file at a URL. `SHARED` in
`build-modules.ts` is those five entries and the four specifiers
it rebases.

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
| `editor.js` | 952 | ts | **service, permanently.** A `contenteditable` is a piece of the DOM the browser and the writer are both editing behind React's back. `CLAUDE.md` says why a second copy is the bug. Converting it found a live one: every row of the figure toolbar that needs a `<figure>` answered `null` for a bare pasted `<img>`, and `replaceChildren` turns a null into the STRING "null", so that photo's toolbar read "null null null Alt Remove". The nulls are filtered now. `exec()` also passed `null` as `execCommand`'s value, which WebIDL turns into the string "null"; it passes `undefined` |
| `content.js` | 826 | ✔ | **service**, and done: `shared/content.ts` is the manifest and `build-modules.ts` writes `/content.js` from it. The one module built out of `shared/` rather than `aab/src/`, because the Worker and the checks read the source and only the browser needs a file at a URL |
| `app.js` | 605 | ts | **shell.** Eight jobs; the theme and the boot are already `shell.tsx`'s. What is left that a route cannot do: the palette, the shortcut sheet, speculation rules and the service-worker registration. `noUnusedLocals` found six bindings imported from `/content.js` and never read: `PAGES` `TOOLS` `STAGES` `STUFEN` `stufeUrl` `SITE`. It also carried the last pointer `check-pointers.ts` excused, and that entry is out of `GONE` with it: the comment names `check-content.ts` now |
| `sync.js` | 513 | ts | **service.** The account is the record and this is the mirror. Nothing about it is a page |
| `account.js` | 417 | ts | **service.** The session. Eighteen importers, more than anything else here. Converted with the change that brought the Google picture through, and it took TWO hand-written declarations with it: `aab/src/types/` and `app/src/types/` each described this file and they disagreed about what `saveProfile` answers |
| `crumbs.js` | 351 | ✔ | **interface**, and done: `next/lib/crumbs.ts` builds the trail out of `shared/nav.ts` and the top bar draws it, JSON-LD included. The module is in `archive/modules/` |
| `signin.js` | 347 | ts | **interface.** The account menu, which is a `popover` |
| `tilt.js` | 246 | ts | **interface.** A pointer effect on cards, and only where there is a pointer. The device-orientation half that leaned cards on a phone is gone: the perspective it needed is declared inside the hover query, so a handset got a shear rather than a lean, and paid a forced layout per card per sensor frame for it |
| `audience.js` | 281 | ts | **shell.** The learn/work switch, whose markup is already `sidebar.tsx`'s. Deriving its two unions from its two vocabularies found three comparisons against `"money"`, which this module has never stored: the audience is `learn` or `work`, in `AUDIENCES` in `nav.ts`, in the boot script and in the stylesheet. So `data-track` was never set on any page, the footer's switcher could not take a recruiter back to the library and reloaded on a value it had just dropped, and the track switcher was hidden everywhere. The same `"money"` is still in the boot scripts of `404.html` and `offline.html` |
| `news.js` | 246 | ✔ | **interface**, and done: `components/news.tsx` and `components/market-pulse.tsx`, with the FLIP both mini windows share in `next/lib/flip.ts`. It outlived the pulse port by a day because `about.js` imported `el` and `flip` from it; archiving that page's window archived this. The module is in `archive/modules/`, and it is the one entry here whose last step is somebody else's file: `/news.js` is still in `PRECACHE` in `aab/sw.js`, which is a line, a comment above it and a `VERSION` bump |
| `saved.js` | 240 | ts | **service.** Scenarios, targets and the library |
| `keep.js` | 220 | ✔ | **interface**, and done: `components/keep.tsx`, rendered by the piece route and the lesson route. The module read the address, the title and the kind back out of the DOM it had just been rendered into; all three are props now, and the address is the canonical one, so a page reached at both of its two forms is still one row. The module is in `archive/modules/` |
| `comments.js` | 219 | ✔ | **interface**, and done: `components/comments.tsx`. The module is in `archive/modules/` and the first precached entry to leave this list rather than change |
| `auth.js` | 216 | ts | **service.** The Studio's gate. Converted clean. The block it prints to the console on a deployment with no database named `auth-config.js`, which is the built file: pasting there passes every check and is discarded by the next build, so it names `aab/src/auth-config.ts` |
| `checkpoints.js` | 209 | ts | **service.** The ticks inside a lesson, filed under a school's own key |
| `account-page.js` | 203 | ts | **shell**, and finished: four jobs left and the section above says why each stays |
| `engage.js` | 186 | ✔ | **interface**, and done: `components/engage.tsx`. It counted every insights view a second time |
| `prefs.js` | 181 | ts | **service.** Applied before the first paint by `shell.tsx`, carried by `sync.ts` |
| `read-aloud.js` | 150 | ✔ | **interface**, and done: `components/read-aloud.tsx`. It built a toolbar with `createElement` and appended a `<style>` to the head, which is the pair of things `components/scripts.tsx` exists to stop. The module is in `archive/modules/` |
| `photo.js` | 144 | ts | **service.** Decoding a pasted photo. Never a fetch: `CLAUDE.md` says what that cost |
| `about.js` | 107 | ✔ | **interface**, and done: `components/research.tsx`, with the words as a prop from the route because they are that page's copy. The `<template data-detail>` the module cloned had been rendered EMPTY since the page became a route, so every window opened on nothing; a port is finished when it does what the thing it replaced did. The module is in `archive/modules/` |
| `api.js` | 133 | ts | **service.** Every endpoint this site has |
| `share-card.js` | 123 | ts | **service.** Draws the 1200×630 JPEG a pasted link shows |
| `streak.js` | 122 | ts | **service.** `days-active`, which four things count. Two hand-written declarations described it and they disagreed: `aab/src/types/` said `markToday(): void` where it answers whether the day was new, and `app/src/types/` made `daysIn`'s argument required where it has a default. Both are gone, and this is the module that emptied `aab/src/types/` |
| `pieces.js` | 116 | ts | **service**, and smaller than it was: see below. The first module in `aab/src/` to import `/content.js`, which is why that config's `rootDir` is the repo root and `build-modules.ts` reads its output under a prefix. Converted clean otherwise |
| `hub.js` | 97 | ✔ | **interface**, and done: `components/topic-filter.tsx` and `components/subscribe.tsx`. Two things under one name, and the Insights hub was the only page loading either. The module is in `archive/modules/` |
| `pulse.js` | 83 | ✔ | **interface**, and done: `components/market-pulse.tsx` over `components/news.tsx`. Still not `pulse-card.tsx`, which is the home page's card of WRITING: two things with one name, and neither was renamed. The module is in `archive/modules/` |
| `activation.js` | 61 | ts | **service.** Whether the dynamic layer is reachable. It declares `document.prerendering` globally, because Chrome ships it and the DOM library does not, and reads `activationStart` off `unknown` rather than through `instanceof PerformanceNavigationTiming`, which would throw on a browser old enough not to have the constructor |
| `auth-config.js` | 35 | ts | **service.** One constant the gate reads. Converted clean. Not `as const`: the block below the comment is meant to be replaced wholesale by the one the setup screen prints |

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
second table: a list of filenames with their line counts beside the
same filenames with their line counts is the failure at the top of
`CLAUDE.md`, in a file about migrations. The `Lines` column is the
survey's own count and is not kept in step with `wc -l`: it is what
decided the ordering, and the file it names is a source in `aab/src/`
now for everything marked `ts`.

**Still JS (1):** `sw`.

That is `ls aab/*.js` minus what `aab/src/` and `shared/` build, and it
is counted rather than remembered: `comments`, `engage`, `hub` and
`read-aloud` were all still on this list after they had been archived,
which is a tracker being wrong about itself.

`sw.js` is last on purpose and the reason is in the table above: a
mistake there logs nobody out and serves stale everything.

The two lists are not the same job and are not done in the same order.
A module that becomes a component does not need converting first: it
is rewritten in TSX and the `.js` is archived, which is one change
rather than two. A module that stays a **service** is the one worth
converting, because it is the one that is going to be read by
TypeScript at the other end.

Also `aab/schools/*.js`, the three-school engine. The four
`aab/*/curriculum.js` are off this list: they are generated from
`shared/curricula/*.ts` now, like `content.js`.

**What converting the last nine cost outside `aab/src/`,** because a
conversion is never only the rename:

| | |
| --- | --- |
| `aab/src/tsconfig.json` | `rootDir` is the repo root, since `pieces.ts` imports `/content.js` and tsc refuses an input above `rootDir`. With it `allowImportingTsExtensions`, because `content.ts` names its four ladders by their real filenames, and `rewriteRelativeImportExtensions`, which is what makes that legal in a config that EMITS rather than one that only reads |
| `scripts/build-modules.ts` | reads this compile's output under an `aab/src/` prefix, for the same reason, and skips the `shared/` output it now also emits: those five come from their own compile, which is the one `rebase` is applied to |
| `aab/src/types/` | gone. Both declarations it held described modules that describe themselves now |
| `app/src/types/` | `app.d.ts`, `auth.d.ts` and `editor.d.ts` are emitted rather than written. `EditorHandle` is exported by name from `aab/src/editor.ts` because three files under `app/src/studio/` import that type by name |
| `aab/tsconfig.test.json` | `/editor.js` and `/photo.js` point at the source rather than at a declaration, the way `/account.js` already did |
| `scripts/check-pointers.ts` | one entry fewer in `GONE`. `app.js` named `check-content.ts` by the extension it had before `scripts/` converted, and the exemption existed only because editing a precached module costs every returning reader a refetch of the whole shell. Converting the module was that day |

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

**Done: all of it.** Every file in `scripts/` is TypeScript, and
`checkJs` is on, so a `.js` appearing there again is a failing
check rather than a thing somebody notices later.

It went in four chunks: the four generators and both libraries
under `scripts/lib/`, then the sixteen checks and the runner
`check-all`, then the seven `*.test` files and `export-schools`
`import-courses` `import-schools` `preview` `restore`
`school-source` `schools-snapshot`, then the five that were never
`.mjs` at all: `check-content` `check-csp` `check-css`
`check-routes` `check-sw`. `sqlite-d1` was written along the way.

Seven things came out of it that were not the types, and the
previous count of them was wrong too.

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

`scripts/check-routes.ts` and `aab/.assetsignore` widened to `.ts`
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

**Nineteen files named a file that does not exist.** `share-card.ts`
sent a reader to `scripts/check-modules.mjs`, which has never
existed under any extension, and `courses.ts` and `sw.js` to
`check-csp.ts` and `check-css.ts`, which are `.js`. Then
`README.md` told anybody regenerating the site to run
`scripts/build-styles.mjs`, and this file said `aab/tailwind.css`
was built by it, three days after both were deleted for a compiler
Next already has. `cards.tsx` named `check-icons.mjs` where the
check is `check-next.ts`, and `written.tsx` named
`build-school-hubs.mjs`, which is in `archive/schools-builders/`.

Converting `scripts/` is what made them visible, and the shape they
share is worth naming: **a stale pointer costs nothing until
somebody follows it,** so nothing fails and nobody notices. Most
were in the comments this repository writes at length on purpose,
which is the argument for the length rather than against it: the
ones that said only what a thing was for stayed true.

`scripts/check-pointers.ts` is what stops the twentieth. It reads
every tracked file outside `archive/` and fails on any `check-*`,
`build-*`, `import-*`, `export-*` or `*.test.*` name that reaches
no file, with `GONE` for the ones that are named as gone on
purpose, keyed by the file AND the name so that a NEW mention
somewhere else still fails. It caught two things while being
written: itself, twice, because it resolved names against the git
index and a file that has been written and not committed exists;
and the sentence in `CLAUDE.md` that explains the rule, which uses
a deleted filename as its example and now has an entry saying so.

The chunk before it scanned for the rest of them rather than
waiting to trip over one. Every tracked file, every string shaped like a
`check-*`, `build-*`, `import-*`, `export-*` or `*.test.*` of ours,
against whether that file exists: **25 names resolved to nothing.**
Twelve were a rename nobody followed, `check-css.mjs` in ten places
among them, and `SETUP.md` had `node aab/check-routes.mjs`, wrong
in the directory AND the extension, as an instruction to run.

Two were worse than a stale pointer, and they were worse in
different ways. `next/lib/workbook.ts` and
`next/components/workbook.tsx` both named a `check-workbook.mjs`
that has never existed under any extension. Following each one up
gave opposite answers:

- the component's `schriftKey()` **was** held, all along, by
  `aab/schools/workbook.test.ts`, which renders the real
  component into a DOM, types into a box and asserts the writing
  came back under `area.dataset.schrift`. The guarantee was real
  and the pointer named the wrong file, which is the worse of the
  two: the next person follows it, finds nothing, and concludes
  there is no guarantee.
- `dayCount()` was **not** held. `curriculum.js` declares
  `workbook.days` because the hub draws a progress bar from it and
  must not pull five thousand lines of days down to count them,
  and nothing compared the declaration to the days. That is a
  learner told they are on day 30 of 60 in a book that has 90.
  `check-next.ts` holds it now, as the third copy inside `next/`
  that it watches.

Two are deliberately left, and the reason is the service worker:
`aab/app.js` and `aab/tools/stock.model.js` are precached, so
editing a comment in one costs every returning visitor a refetch
of the whole 50-file shell. They are free to fix on the day those
modules become TypeScript, and that is when they will be.
`aab/content.js` and the two `curriculum.js` modules were the
other three and have had that day: all three are generated now,
and their comments are `shared/`'s.

And `check-accents.ts` printed `aab/styles.css` in three of its
messages, which moved to `next/styles/site.css` on 18 August 2026:
the check reads the right file and told you to go and edit the
wrong one.

**CLAUDE.md described a site that no longer exists**, in four
places, and one of them was a command. It said to run
`node aab/deutsch/build-deutsch.mjs` and `build-english.mjs` to
regenerate the practice books; both files were deleted when #129
made the books routes, and they are not even in `archive/`. It also
called the four books "the last real pages", said "six pages are
not routes and cannot be", and gave the wrong reason for the three
schools still needing a browser module. `aab/*.html` is `404.html`
and `offline.html` and nothing else.

**There were four copies of the D1 binding over `node:sqlite`,**
and typing them is what showed it: `schools-snapshot.ts`,
`school-source.ts`, `comments.test.ts` and `schools-api.test.ts`
each carried the same twelve lines. They had already drifted. Two
narrowed what they bound and two passed values straight through,
and node:sqlite throws on an `undefined` where D1 stores NULL, so a
handler that binds an absent field failed in a test and worked in
production. `scripts/sqlite-d1.ts` is the one copy, and it is the
interface the Worker really hands a handler rather than a stub
written to be convenient.

### next/

The routes and components were always TypeScript. What was not is
the node-side files beside them, and they are the reason the debt
kept growing: five `.mjs` test files are five neighbours to copy,
and the first thing written after `scripts/` finished was a sixth
and a seventh.

**Done (12):** `comments.test.ts` `article.test.ts` `dev-worker.ts`
`insights-hub.test.ts` `read-aloud.test.ts` `market-pulse.test.ts`
`hydrate-fixture.ts` `research.test.ts` `parity.test.ts`
`interactive.test.ts` `account.test.ts` `progress.test.ts`.

Five of those are new rather than converted, and the harness is
the point of them. `hydrate-fixture.ts` renders one component the
way a route renders it, serves that markup with a script that
hydrates it, and opens a browser on the result. Both dynamic routes
are `force-dynamic`, so `interactive.test.ts` cannot serve either
and the only other way in is `dev-worker.ts`, which is the whole
OpenNext build on workerd. Both are excluded from
`next/tsconfig.json` and checked by `tsconfig.test.json`, for the
reason written beside that line.

**Left (0).** `postcss.config.mjs` is not one: a PostCSS config is
read by the tool, not by us.

`next/tsconfig.test.json` is what holds these to their types, and
its `include` already covers `*.test.ts`, so a rename puts a file
under `strict` the moment it lands. `scripts/check-types.ts` runs
that config. The four converted last needed real types for the
same three things each time: the playwright import, which is the
`.mjs` path at runtime and the `playwright` types through `paths`;
a `JSON.parse` result, narrowed rather than asserted; and the
argument handed to `page.evaluate`, which is a tuple and is
inferred as a union without one.

### Worker

`functions/` is compiled by wrangler's esbuild, which type-strips with no
configuration, so a `.ts` there needs nothing but the rename and real types.

**Done (11):** `_lib/drive.ts` `_lib/ticket.ts` `_lib/quiz.ts`
`_lib/http.ts` `_lib/sanitise.ts` `_lib/admins.ts` `_lib/db.ts`
`_lib/input.ts` `_lib/reader.ts` `_lib/auth.ts`
`api/courses/[[route]].ts`

**Left (20):** `_lib/` (`notion` 380, `broker` 277, `backup` 223,
`sync` 210) and the 16 handlers under `functions/api/`,
`functions/feeds/`, `functions/insights/`.

**`functions/tsconfig.json` is what makes any of it count.** Wrangler's
esbuild reads no tsconfig, so a `.ts` here typechecked nowhere until
that file existed, and a `.ts` nothing checks is a `.js` wearing types.
`scripts/check-types.ts` runs it: 6 configs became 7.

`allowJs` is ON in it and that is the setting with a date on it. Every
file that converts is checked from that moment; the last conversion is
what turns it off. Leaving it on afterwards would let an untyped `.js`
back in silently.

**What a D1 binding is, said once.** There is no
`@cloudflare/workers-types` here and adding one to type six methods
would be a dependency the Worker's build does not need, so `db.ts`
declares the shape structurally and exports it. Nothing else describes
D1 a second time, which is the rule `check-rows.ts` already enforces for
the database's vocabulary.

**`insights/[slug].js` was edited and NOT converted**, which is the one
exception "convert what you touch" has taken so far and it is worth the
line. Ten files name it by path, two of them `aab/share-card.js` and its
source: that module is precached, so a comment changed in it is a
`VERSION` bump in `aab/sw.js` and a refetch of the whole shell for every
returning reader. It is free on the day `share-card` or `sw` is next
edited for its own reasons, and that is when it should go.

Converting `sanitise` broke `check-css.ts`, which read `ALLOWED_CLASSES` with
a regex that had no room for `: Set<string>` between the name and the `=`.
The check was right to fail and its parser now reads both forms. Expect the
same from any check that greps a source file.

**The three tests under `_lib/` converted on 19 August 2026**, and the
rename was the smaller half of it. Nothing in `functions/` typechecks by
default: wrangler's esbuild reads no tsconfig at all, so a `.ts` here is
annotations nothing reads. `functions/tsconfig.test.json` is what holds
them to theirs and `check-types.ts` runs it, on the root install, so it
runs in CI as well.

`_lib/notion.d.ts` went on 21 August 2026, with the module it
described. It was six exports of `notion.js` hand-written beside it so
`notion.test.ts` could import them; a module that has converted
describes itself, so the interfaces are in `notion.ts` and there is
one file where there were two. That is the end state `aab/src/types/`
is heading for as well: a declaration file is a promise about code
nothing checks, and it stops being needed the moment the code checks
itself.

**`_lib/` is entirely TypeScript as of 21 August 2026** except
`broker.js`. `r2.ts` came out of that sweep: `backup.ts` had declared
an R2 bucket for itself, `sync.ts` needed the same interface plus
`head()`, and two structural declarations of one runtime object are
two that drift. One vocabulary, one place, the rule `check-rows.ts`
already holds the database to.

### app/

One file, and it is a browser test: `studio.test.ts`, converted on 19
August 2026. `desk.test.ts` was the other and went to
`archive/desk-react/` on 21 August 2026 with the page it drove. There
is no JavaScript and no `.mjs` left in this workspace.

It is NOT in `app/tsconfig.json`, and that is the point of the second
config rather than an oversight. That one is the BUILD, run by `tsc -b`
before Vite with an `include` of `src`, so a test in it would hold the
Studio's own build to Playwright being installed. That is the mistake
`next/tsconfig.test.json` was split out for after it failed a deploy. `app/tsconfig.test.json` is the second config, `check-types.ts`
runs it, and where `app/node_modules` is absent it skips and says which
directory to install in.

### Shared

`shared/` is already all TypeScript. It is six files and
`curricula/`, which is four more: the schools' ladders joined it on
19 August 2026, and with them `content.ts` went into the `exports`
map, because the reach into `aab/` that kept it out was the four
imports those ladders answered.

Five of the ten have an output under `aab/`, and it is the same
argument each time: the browser cannot reach this directory and
`/content.js`, `/money/curriculum.js` and its three siblings are
URLs `sw.js` precaches by name.

The first thing that reads the manifest from a route is the About
page's tally, which was four dashes and a browser module.

### The declarations are the slow part

`aab/src/types/` is what a converted module leans on, and it was
written thin: `curriculum.d.ts` described four exports where `crumbs`
needed fifteen, and `content.d.ts` had no `SITE`, `PAGES` or `READS`
at all.

All three are gone now, because a module that becomes TypeScript
needs no description of it: `aab/src/tsconfig.json`,
`app/tsconfig.json` and `next/tsconfig.json` map `/content.js` on
to `shared/content.ts`, and the first of them maps
`/<school>/curriculum.js` on to `shared/curricula/<school>.ts`.
The hand-written ladder declaration was wrong as well as
duplicated: it had `uebung` as a `{ slug, days }` where every
Stufe that carries one carries a sentence. That is the end state
for every file in those two directories.

## 2. Stylesheet to Tailwind

Tailwind is compiled by Next, through `@tailwindcss/postcss`.
`next/styles/tailwind.css` is the theme and the utilities and
`globals.css` imports it; there is no build step and no committed
output. `@theme` maps the site's own tokens, so `bg-panel` means
`var(--panel)` in both themes.

**Done:** `/account`, and the component library under
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

Three things stay in `next/styles/site.css` permanently, and the split is the point:

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

**Done: `/account`.** The route was rendered by Next from the day
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
the two practice-book builders, which are gone with the books they
emitted (#129). They
are the last real pages on the old method, and being on it is why they
carry `.slimbar` and lose the rail. Porting them to routes gives them the
rail, the drawer, the audience switch and the accent for free, and deletes
two builders.

They are precached, and the service worker already precaches six rendered
routes, so offline is not the obstacle it looks like.

`htmlAttrs()` in `shared/nav.ts` is a stopgap that gives the generated
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
