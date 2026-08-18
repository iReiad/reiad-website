# Migration tracker

Four moves, all part-done. The rule is **convert what you touch**: any file
you edit for another reason gets converted in the same change, wired up
properly, with its checks passing. No separate "migration sprint".

Updated 18 August 2026.

## 1. JavaScript to TypeScript

### Browser modules

Built from `aab/src/*.ts` to `aab/*.js` by `scripts/build-modules.mjs`. The
built file is committed because the site deploys by uploading `aab/` with no
build step.

**Done (13):** `account-page` `api` `checkpoints` `courses` `crumbs` `keep`
`photo` `prefs` `saved` `share-card` `signin` `sync` `tools/live`

**Left (20),** largest first:

| File | Lines | Notes |
| --- | ---: | --- |
| `sw.js` | 1211 | service worker. Convert last: it is precached and a mistake logs nobody out but serves stale everything |
| `editor.js` | 953 | the contenteditable. Two Studios import it |
| `content.js` | 825 | menu, palette, `COUNTS`. Imported by checks that run in node |
| `app.js` | 649 | theme, palette, prerender, service-worker registration |
| `account.js` | 418 | Supabase session. `token()` is imported by most of `aab/src/` |
| `tilt.js` | 283 | |
| `audience.js` | 282 | |
| `news.js` | 247 | |
| `comments.js` | 220 | |
| `auth.js` | 217 | the Studio's gate |
| `engage.js` | 187 | |
| `read-aloud.js` | 151 | |
| `about.js` | 145 | |
| `streak.js` | 123 | writes `days-active` |
| `pieces.js` | 121 | |
| `hub.js` | 98 | |
| `pulse.js` | 84 | |
| `contact-form.js` | 65 | |
| `activation.js` | 62 | |
| `auth-config.js` | 36 | |

Also `aab/schools/*.js` (the three-school engine) and `aab/*/curriculum.js`.

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

**Done:** `/account.html`.

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
