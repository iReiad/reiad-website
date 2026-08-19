# reiad.co.uk, house rules

## Punctuation: no em dashes. Ever.

**Never use the em dash, U+2014, anywhere on this site.** It is not written
out anywhere in this repo on purpose: the check below greps for it, and a
rule that contains the character it bans always matches itself. Not in page copy,
not in headings, not in meta descriptions, not in Bangla, not in strings a
script writes into the DOM, not in commit messages or PR bodies.

This is not a preference about one character. A sentence that needs an em
dash is usually a sentence holding two ideas that have not been separated
properly, and the mark is doing the work that punctuation or a full stop
should be doing. Take the extra second and write it out.

What to use instead, in the order worth trying:

| The dash was doing this | Use |
| --- | --- |
| Introducing an explanation, a list, or a definition | a colon |
| Joining two clauses that could stand alone | a full stop, or a semicolon |
| Wrapping an aside mid-sentence | a pair of commas |
| Wrapping an aside that really is parenthetical | brackets |
| Tacking on an afterthought | a comma, or cut the afterthought |
| Nothing in particular (a pause for effect) | delete it and reflow the sentence |

Two dashes wrapping an aside become two commas or one pair of brackets,
never one comma and one bracket.

En dashes (U+2013) in number ranges are fine and are not affected by any of
this: `2024–26`, `৳50–100`.

The same rule applies to code comments in new work. The comments in this
repo are long and explanatory on purpose, and they read better without the
dash too.

Quick check before committing:

```sh
grep -rn $'\u2014' aab/ functions/
```

## React or a route. Never new hand-written HTML.

**Nothing new is built as a hand-written or string-generated HTML page.**
A page is a Next.js route under `next/app/`; a piece of interface is a
component under `next/components/` or `app/src/`. That is the target for
everything, and anything still built the old way is a thing waiting to be
ported rather than a pattern to copy.

What that rules out, concretely:

- a new `aab/*.html` file,
- a new page emitted as a template literal from a `build-*.mjs`,
- a second copy of chrome the shell already renders. The rail, the top
  bar and the footer are `next/components/`, and a page that draws its own
  is a page that will drift from the other 250.

`MIGRATION.md` lists what is still on the old method. The four practice
books were the last real pages and are routes as of #129:
`next/app/[section]/[slug]/arbeitsbuch.html` and `workbook.html`, with
`aab/schools/workbook.js` loaded by the route as the engine. The two
builders that emitted them from a template literal are gone, not
archived.

The two exceptions are `404.html` and `offline.html`, and they are
exceptions on purpose: they have to answer when the Worker, the route and
the network are all unavailable, which is exactly when a route cannot.

## Convert what you touch

Three migrations are part-done and `MIGRATION.md` tracks them. The rule is
not a sprint: **any file you edit for another reason gets converted in the
same change**, wired up properly, with its checks passing.

| From | To |
| --- | --- |
| a hand-written `aab/*.js` | `aab/src/*.ts`, built by `build-modules.ts` |
| a `functions/**/*.js` | `.ts`. Wrangler's esbuild type-strips with no config |
| a `<style>` block or new component markup | Tailwind utilities |

Real types, not `any` and not `@ts-expect-error`: the latter silences the
complaint without describing anything, and silences the next one too. A JS
module that has to stay JS gets a declaration in `app/src/types/`.

Update `MIGRATION.md` in the same commit. A tracker that is right on the day
it was written is the failure this file opens with.

**Never edit a built file.** `aab/*.js` that has a source in `aab/src/` is
output. Editing it looks like it works, passes every check, and is discarded
by the next build. That happened to `courses-answers` in `sync.js`: the key
was added to the output, the next `build-modules` run dropped it, and quiz
answers saved on one device and reached no other. `check-courses.ts` now
fails if this section writes a storage key the account does not carry.

**A comment that names a file has to name one that exists.**
`check-pointers.ts` reads every tracked file outside `archive/` and
fails on any `check-*`, `build-*`, `import-*`, `export-*` or
`*.test.*` name that reaches nothing. It exists because converting
`scripts/` to TypeScript turned up twenty-five such names in one
sweep, two of which promised a check nobody had ever written. A
stale pointer costs nothing until somebody follows it, which is
precisely why they survive.

A name that is gone ON PURPOSE goes in `GONE` in that file, keyed
by the file AND the name, with the reason. Keyed by both because
"`build-styles.mjs` is gone" is a true sentence and a NEW comment
naming it somewhere else is not.

**Nothing new here is `.mjs`.** `next/` had five test files with
that extension and they are the reason a sixth kept getting
written: the neighbours are the pattern, and a pattern that is
waiting to be ported is not one to copy. A `.ts` runs under node
with no build step, and `next build` typechecks everything in
`next/tsconfig.json`, so the build is what holds a file here to
its own annotations. There is nothing to trade.

## Comments carry the constraint, not the story

Keep what a reader needs in order not to break something: what will fail,
what must never be renamed, why an order is load-bearing, what a check
exists to catch. One or two lines.

Cut narrative, dated process notes, and reasoning that only made sense while
a decision was being taken. "This was three files and is now one" is
history; `archive/` is where history goes.

The test is whether removing the comment would let somebody make a mistake.
If it would, keep it and make it shorter. If it would not, cut it.

## Ship it

Open the pull request, wait for the checks, squash merge. No second
conversation, no asking whether it should go in.

```sh
node scripts/check-all.ts      # every check and fast test, about 18s
```

**That file IS the list.** `.github/workflows/checks.yml` calls it, once
per stage, rather than keeping a second copy: it kept one until 19
August 2026 and the copy went stale the first time a generator was
renamed, which is the failure at the top of this file happening to
the thing that catches that failure.

```sh
node scripts/check-all.ts --stage=checks     # or generated, or tests
``` The browser and network tests are listed under
"Before deploying" and still have to be run by hand.

**`checks.yml` runs on `push`, and that is deliberate.** On 18 August 2026
`pull_request` stopped firing it, for opens and for pushes alike, while
`push` kept working: `live-check.yml` runs on push and never missed one. Two
pull requests sat with three green checks and no `checks` run, which is the
one that runs the tests. `pull_request` is still listed so the run attaches
to the pull request when GitHub does deliver the event, and main is excluded
because `deploy.yml` calls this workflow before it uploads.

**Three green checks is not green.** `checks` is the fourth and it is the one
that matters. If a pull request is missing it, dispatch the workflow on the
branch rather than merging on an incomplete signal.

## Language

Bangla is the site's learning language, English the working one. Bangla
copy is written for a reader who should never have to read English to find
out that something exists in their own language. Keep it plain: short
sentences, everyday words, no transliterated jargon where a Bangla word
exists.

## Numbers and lists come from the data, never from a sentence

**If a page says how many of something there are, it must count them.**
Not remember them. `COUNTS` in `shared/content.ts` derives every such number
from the data the site already holds, and `app.js` fills any element
carrying `data-count`:

```html
<span data-count="stages">৮</span>টা ধাপ
<span data-count="caseStudies">7</span> case studies
```

Bangla digits are used automatically inside a `[lang="bn"]` element. The
number left in the markup is the no-JavaScript fallback, so keep it
roughly right; `check-content.ts` fails the build if it drifts.

The same rule covers lists. A list of things that exist elsewhere on the
site (case studies, articles, tools) is built from `shared/content.ts` by
`home.js` or `app.js`, and the markup in the page is a fallback, not the
source. Adding a case study should require editing `shared/content.ts`
and nothing else.

This exists because it went wrong, twice in one file. The portfolio page
listed four case studies while seven existed, and three finished pieces of
work were reachable only by typing the URL. The home page listed three of
the seven under a line naming two of the four it left out. The stock check
was described as "thirty-eight ratios" on one page, "thirty-odd" on four
others and "more than thirty-six" in Bangla, for a model that scores
forty-four. Nobody typed a wrong number. Each was right on the day it was
written, and then the thing it counted grew.

Two counts (`ratios`, `pillars`) are typed into `COUNTS` because they
belong to `tools/stock.model.js`, which `shared/content.ts` deliberately
does not import. They are asserted against that model by the check below.

A sentence that genuinely cannot hold a slot (a `<meta>` description, a
blurb inside `shared/content.ts`) goes in the `CLAIMS` table in
`scripts/check-content.ts`, so the next data change fails a check rather than a
reader.

## The shell, and the one table the menu comes from

Every page of this site is a rail down the left, a bar across the
top and a footer. All three are rendered on the server by
`next/components/`, and all three read **one** table:
`next/lib/nav.ts`. Add a school there and it appears in the rail,
in the footer and on `/skills/index.html` at once.

That is not tidiness. The menu used to be said in four places: the
seven links written into every page's header, `buildMenu()` in
`aab/app.js` which drew the overlay at runtime, the `SKILLS` list
in `content.ts`, and the footer. They agreed because somebody
remembered, which is the failure this file opens with, one level up
from counting. The overlay also did not exist for a reader with
JavaScript off, or for a crawler.

Three attributes on `<html>` drive the chrome, and all three are
restored **before the first paint** by the boot script in
`shell.tsx`:

| | |
| --- | --- |
| `data-rail` | `open` or `closed`, the rail's width |
| `data-drawer` | `open` or `shut`, the same menu on a phone |
| `data-audience` | `learn` or `work`, which groups lead |

The attribute is the state. The buttons write it and the stylesheet
answers; nothing keeps a second copy in React, because the copy is
the one that arrives a paint late. `@layer shell` in `styles.css`
is where the rules are.

**Two pages are not routes and cannot be:** `404.html` and
`offline.html`, which have to answer when the Worker, the route and
the network are all unavailable, which is exactly when a route
cannot. They carry `.slimbar` instead, in the same layer, and they
are the whole of `aab/*.html` now. It was six until #129 ported the
four practice books. If you add a third, give it the slim bar too:
`body > header` is gone from the stylesheet and nothing will style
a header you write.

## Two kinds of card, and a reader can tell them apart

`.cell` was one card doing five jobs: a link to an article, a
statistic, a paragraph about a service, a calculator, and a heading
with bullets under it. All five looked the same, so the only way to
find out which of them would take you somewhere was to move the
mouse.

`@layer deck` has two, and `components/deck.tsx` is the markup:

- **`<GoCard>`**, `data-kind="go"`. It takes you somewhere or does
  something. An accent rail down the left edge, an arrow that
  slides on hover, a lift, and the action written out at the
  bottom. It is an `<a>`.
- **`<InfoCard>`**, `data-kind="info"`. It tells you something and
  it is the end of the road. Dashed edge, quieter ground, no
  arrow, no lift. It is a `<div>`.

Neither can be the other by accident, which is the whole point of
them being two components rather than one with a prop.
`<SoonCard>` is the third state: a thing that has been promised and
not written, which is a `div` for the same reason a chip that goes
nowhere is not a link.

## What a reader has read

`next/lib/progress.ts`, and the storage keys in it are the ones
already in real browsers and in real accounts: `learn-read`,
`deutsch-read`, `english-read`, `quran-done`, plus a `-last`
bookmark each, and a `-checks` set each since checkpoints. **Do
not rename one.** `aab/sync.js` maps the same names, and changing
a key does not move somebody's ticks, it loses them.

The rule the rewrite turned on: **the ladder is the server's and
the ticks are the browser's.** Every id, title and URL a progress
component works with comes down as a prop from the route that read
the rows. It decides one thing per lesson, whether there is a tick,
and it renders nothing at all on the server, because what a reader
has read is not a fact the server has.

Three things were wrong with the money school's old module and are
worth not repeating: a lesson that was not a page could never be
ticked, so the percentage was wrong for anybody who had read one;
the "is this id real" filter needed `curriculum.js` in the browser,
and the module was loaded because of the filter; and the bookmark
stored a URL, so a lesson that moved took the bookmark with it.

Opening is not finishing. A visit moves the bookmark; the tick is a
button the reader presses.

**Anything drawing a number out of those keys subscribes, and
`subscribe()` listens for three things.** The same-tab event, the
cross-tab `storage` event, and `sync:done`. The third is the one
that is easy to leave out and it is the one that matters for a
signed-in reader: `aab/sync.js` writes the account's rows straight
into localStorage, which fires neither of the other two, because
`storage` only fires in OTHER tabs. Without it every meter on the
page is drawn against what storage held BEFORE the exchange, and
stays there.

That is invisible almost always, because the exchange usually
finishes before the first paint. It showed up on the one page that
fetches something of its own first: `/account.html` drew a course
target at "0 of 60" beside a bar of the same school reading
"9 of 60". A component that reads one of these keys ONCE, on mount,
has the same bug whether or not it also redraws.

### Progress belongs to the account, and the browser is a mirror

`aab/sync.js`, rewritten 17 August 2026, and the whole of it is
one sentence: **the account is the record, and nothing is ever
pulled out of the browser into it.**

| | |
| --- | --- |
| signed out | nothing. No request, no listener that fires, no storage touched. Progress is this browser's and every page still works. |
| signing in | the account's rows are written on to the device, and any synced key the account does not have is removed. What the browser held first is not merged and not uploaded. |
| signed in | the device is a mirror. A tick here goes up; a tick on the phone comes down. |
| signing out | the mirror comes off, so the next person at the same machine does not inherit somebody's ticks. |

The version before this treated a browser and an account as two
equal copies and merged them, which forced it to ASK, once per
account per browser, what should happen to what was already
there. `archive/first-sync.js` is that dialog. A browser is not a
copy of an account: it may be a library machine or a phone that
was handed over for five minutes, and the site cannot tell.

Two signed-in devices still need reconciling and that is the one
merge left. `base` is what the account said at the last exchange,
so `local \ base` is what this reader did and `base \ local` is
what they undid, and the value written back is
`(remote ∪ added) \ removed`. There is no special case for a
reset: every school's `resetAll()` REMOVES a key rather than
emptying it, an absent key is an empty set, and subtraction takes
the account down with it. The old file needed a timestamp per key
to get that right and got it wrong for a year.

`aab/sync.test.mjs` is the guard, 27 checks in a real browser
against a routed Supabase, and it drives `/404.html` because that
is one of the six pages still served as a file.

### The two things an account holds that are not a tick

`aab/saved.js`, and two tables in
`supabase/migrations/20260817120000_scenarios_targets.sql`, both
behind the same row-level security `progress` has.

- **`scenarios`** is a filled-in calculator under a name. The
  stock check stores its own query string, which is the format it
  has shared analyses in since it was written, so opening a saved
  check is a link rather than a restore and there is one encoder.
- **`targets`** is a goal with a number on it, and the three
  kinds are three sources of progress that already existed: a
  `course` reads the reader's ticks, a `habit` reads
  `days-active`, and a `metric` is a number this site cannot see,
  so the reader types it in. **A fourth kind has to pass that
  test**: if the site cannot measure it out of something it
  already holds, the bar would be a decoration.

Neither has a local copy, and that is deliberate rather than an
omission. Progress has one because four schools have read
localStorage since before there were accounts and a reader with
no account still gets all of it. Nothing here has that history
and nothing here works signed out, so a second copy would be a
second record to keep in step for nobody's benefit.

### What else an account is for

Five things, and each one had to pass the same test the three
settings questions pass: it changes something the reader can point
at.

- **A reading list and notes.** `aab/src/keep.ts` puts a Save and
  an Add a note under the byline of every piece and every lesson,
  and `public.library` is **one row per person per page**, with
  `saved` and `note` as two columns of it. They are two facts
  about one thing rather than two things, and a trigger removes
  the row once both have gone, so the list can be counted rather
  than filtered.
- **Reading preferences.** `aab/src/prefs.ts`: the type size, the
  measure, the theme and which language the calculators open in.
  Applied before the first paint by the boot script in
  `next/components/shell.tsx`, carried between devices by
  `sync.ts` under `reader-prefs`, and the language one writes
  `tool-lang`, which the stock check has read since long before
  accounts. One choice, one key.
- **A year of days**, drawn from `days-active` on the account
  page. No flame, nothing red, nothing counting down.
- **Take a copy of everything.** One JSON file with the progress,
  the library, the targets, the scenarios and the profile in it.
  Leaving should be as easy as arriving.
- **Erase everything**, which means the account and the mirror.

`next/account.test.mjs` is the guard: 128 checks in a real browser
against a routed Supabase.

### Eight sections, one on screen

`/account.html` was one long page with a strip of links down
it, and reaching the last of eight sections was eight screens
of scrolling. `next/components/ui/tab-panels.tsx` is the
calculators' arrangement in React, and the four decisions in
it are the four that make a `role="tablist"` honest:

| | |
| --- | --- |
| the fragment chooses | a link from the account menu straight to `#reading-list` opens that panel rather than scrolling to it, and `hashchange` keeps that true |
| `replaceState`, never `location.hash =` | assigning pushes an entry per press, so Back walks the strip, and it scrolls the panel under the sticky bar every time |
| arrows, Home and End | with a roving tabindex, so the strip is one tab stop |
| **nothing hides until it has run** | the panels render open and the first effect closes them. Hiding in CSS alone is a page that shows one section and seven buttons that do nothing |

The strip is `.topbar` again: the same pill, the same glass,
the same edge and shadow, one `--top-gap` below it and inside
the page's own column. A reader who has learnt that the thing
floating at the top is the site's controls reads a second
floating thing as this page's.

`[data-panels="on"]` is how the stylesheet knows a section is
the only one on screen, so it drops the `--step` leading that
separates sections on a long page. `body[data-tool-tabs="on"]`
is the calculators saying the same thing one level down.

**The panels are built on the server and handed over as a
prop.** A client component's children are serialised into the
payload rather than re-rendered in the browser, so making the
strip interactive does not make eight sections of markup the
browser's job.

### The account menu is a popover, not a dialog

`aab/src/signin.ts`. It was `showModal()`, which dimmed the site
and took the focus for "which account am I on" and "go to my
reading list", neither of which is a decision the page cannot
continue without.

`popover="auto"` brings the top layer, light dismiss, Escape and
the focus return, so this file implements none of the four. CSS
anchor positioning places it where the browser has it, and the
two custom properties are the fallback where it does not, with
the scroll listener added **only** in that case. Below 640px it is
a sheet against the bottom edge, decided by a media query.

### Checkpoints, which are the ticks inside a lesson

`aab/checkpoints.js`. A lesson's own tick is about the whole page
and is the right unit for a ladder; a checklist inside the prose
is five things a reader does over a fortnight, and the page could
not remember which three were done.

It **invents no markup**. `.checklist` is an article block that
has been in `@layer article` and in both sanitisers since the
Studio was written, so every checklist in a school lesson becomes
a set of checkpoints and a checklist anywhere else stays a list.
A checkpoint is `<lesson id>#<n>`, filed under `<school>-checks`
and carried by `sync.js` like every other tick. Position rather
than text, because prose gets edited and a checkpoint that forgot
itself over a fixed typo is worse than one that stays put when a
line is reworded.

It is **not** counted towards a ladder anywhere: a checkpoint is
not a lesson.

### Three schools, one engine

`aab/schools/progress.js` is the browser's half of that, and
`aab/schools/hub.js` is the drawing around it. Both are shared by
the German, English and Quranic Arabic schools, which is a change
from three copies of each.

The copies were not a variant of one another. `deutsch/progress.js`
and `english/progress.js` were 316 and 318 lines whose diff was
nouns, `stufe` against `term`, and `quran/progress.js` was the same
program minus the practice book. Three hubs drew the same progress
ring from three copies of the same twelve lines. A fix to one was a
fix somebody had to remember to make twice more.

What a school still owns is its ladder, its words and its ladder
row: a Stufe shows sections and a book, a ধাপ shows days, a term
shows neither, and folding those three into a config would be a
bigger knot than three readable copies. A row is drawn by the
school; everything around it is shared.

Two tests cover it, and they cover different halves.
`aab/schools/progress.test.mjs` is the arithmetic and the keys;
`aab/schools/hub.test.mjs` is the drawing, and it builds all three
hubs in a real DOM against the markup out of `next/lib/school-hubs.ts`,
because a hub that renders and is not finished looks exactly like
one that is.

**The practice books are the same arrangement.**
`aab/schools/workbook.js` is one engine where there were two
388-line modules whose diff was nouns, and both of them were
broken: the English one keyed on `.wb-day` and `[data-wb-write]`
where the component renders `.buch-tag` and `data-schrift`, so
nothing saved and nothing ticked, and the German one dereferenced
`document.getElementById("tage")` at its top level on a route that
had no such element, so it threw before its first function ran.
Both pages rendered perfectly. `aab/schools/workbook.test.mjs` is
what says they do not any more.

**Every storage key is passed in by the school, spelled the way it
has always been spelled.** That is not decoration, it is the whole
reason the engine takes them as an argument rather than deriving
them from the school's name: `english-day` is not `english-tag`,
and the rule at the top of this section is why. `aab/schools/progress.test.mjs`
asserts all ten of them by name.

That covers the ID SHAPES too, and it had to. A day's tick is
`term-1/day-3` in English and `stufe-1/tag-3` in German, both from
the school's own `curriculum.js`, and the shared book engine built
the German shape for both when it was first written. `toggleDay`
wrote the English ticks correctly and the tracker looked for them
under a name nothing had ever used, so a day could be ticked and
came back unticked. `dayId` is an argument now, like every other
key.

The money school is not a caller. Its ticks are `next/lib/progress.ts`,
because its pages are routes. These three still need a browser module
for a different reason: a practice book is a page a learner TYPES INTO,
and what they type is theirs and the browser's, which is the same rule
the ladder and the ticks follow. The book is a route now and
`workbook-body.tsx` loads the engine through `SiteScripts`.

## The blocks an article is made of

A piece can hold a box of quick answers, a note in the margin, numbered
steps, a checklist, a row of key figures, a note, a worked example and a
scrolling table. Each one is plain HTML with a class on it, and that class
has to be in three places or it does not survive the trip:

1. a rule in `@layer article` in `aab/styles.css`,
2. `KEEP_CLASSES` in `aab/editor.js`, the browser's sanitiser,
3. `ALLOWED_CLASSES` in `functions/_lib/sanitise.js`, the server's.

`check-css.ts` fails if the two allowlists disagree, if a class is allowed
into an article and styled nowhere, or if two cascade layers both define
one. The last of those is not hypothetical twice over: `.glance` was
already the About page's, `.steps` already the Learn hub's, and a later
layer wins on every page, not only its own.

The same three-place rule covers the photo classes: `wide`, `full`,
`frame-wide`, `frame-square`, `frame-tall`, `focus-top`, `focus-bottom`,
`lead-photo`.

## Share cards

The picture a pasted link shows is drawn, not borrowed. `aab/share-card.js`
makes a 1200×630 JPEG from the piece's lead photo, cropped around the part
the writer marked, and that is what `cover` holds and `og:image` points at.
It is a JPEG because the scrapers behind WhatsApp, Facebook and LinkedIn
will not read the WebP every photo here is stored as: pointing them at the
photo itself is how a piece with a picture ends up sharing as the default
card. The desk flags any piece whose cover is still a raw photo and can
draw the missing card in place.

**A photo is read out of the editor by decoding, never by fetching.**
`fetch()` on a `data:` URL is governed by `connect-src`, not `img-src`,
and this site's policy allows `data:` under `img-src` only. So a pasted
photo displays perfectly and every attempt to upload one was blocked
before it left the browser, silently, for weeks: R2 stayed empty, every
`cover` stayed empty, and every shared link showed the default card.
`aab/photo.js` decodes instead, and `aab/studio-publish.test.mjs` drives
a real publish under the policy read out of `_headers` and fails if that
regresses. Do not "simplify" it back to a fetch.

## What is served, and what is only in the clone

`[assets] directory = "./aab"` means every file in `aab/` is
uploaded and answers at its own public URL. Every file: the five
`check-*.mjs`, the seven `*.test.mjs`, both school builders, the
TypeScript that four served modules are compiled from and
`schema.sql` were all live, about 300 KB of them, at addresses
like `/check-routes.ts`.

`aab/.assetsignore` is what stops that. Nothing in them was secret
and none of it was reachable from a link, which is exactly why it
sat there: a file nobody meant to publish is a file nobody thinks
about before changing.

Add a check or a test beside the others and it starts being
published the moment it is committed, so `scripts/check-routes.ts` reads
that file and fails on any path matching a build-or-test shape
that no rule covers.

## Archiving a page, rather than deleting it

A page that has been replaced goes to `archive/`, not to the bin.
It leaves `aab/`, which is the whole of what taking it off the
site means, and it stays readable by whoever has to check that its
replacement really does what it did.

Two conditions, both literal: **nothing serves it and nothing
imports it.** So before the move, follow every reference: a
`PAGES` entry in `shared/content.ts`, the prerender rules in `app.js`,
the `Disallow` block `build-meta.mjs` writes, the `PRIVATE` set in
`build-og.mjs`, any test that drives the page, and any link in
`app/src/**`. Add a line to `_redirects` for the old URL. If a
test was the only thing checking a module the page happened to
host, repoint the test rather than losing it: `aab/studio.test.mjs`
is 68 checks of `aab/editor.js` and it survived `studio.html` by
being pointed at `/studio/`.

`archive/README.md` has the reasoning and the table of what
replaced what.

## Before deploying

Run the checks. They are fast and each one exists because something
shipped broken once.

**CI runs them too, on the pull request.** `.github/workflows/checks.yml`
is the list, and `deploy.yml` calls it rather than keeping a second
copy, so the upload happens only if it passed. That is a change: the
checks used to live inside `deploy.yml` alone, which fires on a push
to main, so they ran AFTER the merge. A pull request that broke one
showed a green tick, because the only thing answering on a branch was
`live-check.yml`, and on a branch that asks the live site how the LAST
deploy is doing.

Running them here first is still worth it. CI tells you on a pull
request; a laptop tells you before you have written the commit
message, and the four that need a browser or a build do not run in CI
at all:

```sh
node scripts/check-routes.ts # redirect loops, dead links in routes as well
                            # as in files, a live article whose slug cannot be a
                            # URL, and a check or a test published as a page
node scripts/check-css.ts   # a school's layer styling the whole site, a block
                            # class that means two things at once, and a rule
                            # that styles nothing on the site at all
node scripts/check-sw.ts    # a precached file changed without a VERSION bump,
                            # or a precached module whose import is not precached
node scripts/check-content.ts # a page that has stopped counting the site
                            # correctly
node scripts/check-csp.ts   # code calling a host the browser is not allowed to
                            # reach, from a route as well as from a module
node scripts/check-contrast.ts # an accent that has drifted under the WCAG
                            # threshold for the size it is set at
node scripts/check-scale.ts # a fifty-first font size
node scripts/check-prefixes.ts # a hand-written vendor prefix, which DELETES the
                            # standard property it is written beside
node scripts/check-selfref.ts # a custom property set to itself, which is nothing
                            # on that element and everything inside it
node scripts/check-jsx-space.ts # a sentence running into the link inside it,
                            # because JSX ate the line break before the element
node scripts/check-crons.ts # a scheduled job the Worker is no longer listening for
node scripts/check-pieces.ts # a written piece nothing on the site links to
node scripts/check-headers.ts # a page a Worker built, served with no CSP
node scripts/check-schools.ts # a ladder the browser and the builders disagree about
node scripts/check-rows.ts # a description of the database that has stopped
                            # being true, or a handler keeping its own copy
                            # of a vocabulary
node scripts/check-courses.ts # a Drive id that is not one, the private course
                            # catalogue leaking into a public bundle, or the
                            # Worker and the browser disagreeing about where
                            # a lesson lives
node scripts/check-api.ts  # the browser asking for an endpoint the Worker
                            # stopped routing, which breaks nothing and
                            # quietly switches a feature off
node scripts/build-modules.ts --check # a served module edited in its built
                                       # form rather than in aab/src/
node scripts/build-fallback.ts --check # /fallback.css, which the two pages that
                                       # are files link, no longer matching the
                                       # stylesheet it is drawn from
node scripts/check-types.ts  # scripts/ that node strips the types out of
                            # without ever reading them, and a .js
                            # reappearing in a directory that has none
node scripts/check-pointers.ts # a comment sending a reader to a file that
                            # does not exist
node scripts/build-school-icons.ts --check   # a school drawing next/ copied
node scripts/build-stamp.ts --check  # aab/desk/** and aab/studio/** built from
                            # an app/src/ that is not the one committed beside
                            # them
node scripts/check-next.ts # a copy inside next/ that has drifted from the
                            # thing it was copied from
```

`check-pieces.ts --live` also asks the database and prints where every
piece actually lives, which is the one question `archive/TRANSITION.md` Stage 3
turns on.

And when anything under `functions/` or `scripts/` changed:

```sh
node scripts/restore.test.ts       # a backup that would not restore
node scripts/reader.test.ts        # somebody posting as somebody else
node scripts/comments.test.ts      # a comment appearing without approval
node scripts/input.test.ts         # a rule that stopped rejecting, in the one
                                   # place three endpoints read (36 checks)
node scripts/snapshot.test.ts      # a nightly snapshot that leaks, or that throws
                                   # at 03:17 where nobody is watching
node aab/studio-publish.test.mjs   # a photo that never reaches R2, under the
                                   # real CSP (needs Playwright, skips without)
node next/account.test.mjs        # the account's five features, the popover
                                  # menu and the Save under a byline
                                  # (128 checks, needs the Next build and a
                                  # browser, skips without)
node aab/sync.test.mjs             # a browser's own progress getting into an
                                   # account, resetting, signing out, and two
                                   # signed-in devices (27 checks, needs a
                                   # server on :8899 and Playwright)
node aab/studio.test.mjs           # the editor, end to end (68 checks)
node next/progress.test.mjs         # a page that costs a reader their ticks just
                                   # by being read (23 checks, no browser)
node next/comments.test.ts        # a comment body that stopped being text, a reply
                                   # two levels deep, or a thread that draws itself
                                   # signed in on the server (28 checks, no browser)
node next/insights-hub.test.ts     # the Insights hub's own two: a topic chip that
                                   # presses and hides nothing, and an email box
                                   # offered where there is no database to put an
                                   # address in (46 checks, needs Playwright and a
                                   # browser, skips without)
node next/read-aloud.test.ts       # the speech control on a piece: what it reads,
                                   # what it steps over, what it marks, and whether
                                   # Stop stops (51 checks, needs Playwright and a
                                   # browser, skips without)
node next/market-pulse.test.ts     # the Insights hub's board of headlines: two
                                   # endpoints raced, the device as the last resort,
                                   # a square per story and a window that grows out
                                   # of the one that was pressed (91 checks, needs
                                   # Playwright and a browser, skips without)
node aab/schools/progress.test.mjs  # a school's ticks filed under a key that is
                                   # not the one in somebody's browser, and the
                                   # three schools' shared engine (119 checks)
node aab/courses.test.mjs          # the third-party course player: the sidebar, the
                                   # ticks, the per-module bars, mark-complete-and-
                                   # continue, the deep link, and the timers it must
                                   # never grow (74 checks, needs linkedom)
node aab/schools/workbook.test.mjs # a practice book that renders and does nothing:
                                   # the day walker, what was typed, the answers,
                                   # the tick, and the storage key each is filed
                                   # under (40 checks, needs linkedom)
node aab/schools/hub.test.mjs      # a school hub that renders and is not finished:
                                   # the ladder, the ring, the bar and the resume
                                   # card, built against the markup the route
                                   # serves (57 checks, needs linkedom, skips
                                   # without)
node functions/_lib/notion.test.mjs
node functions/_lib/drive.test.mjs   # a JWT Google would refuse, and a pass that
                                     # opens more than the one file it names
node functions/_lib/quiz.test.mjs    # a quiz rendered with its questions and none
                                     # of its answers, which looks finished
node scripts/schools.test.ts         # a curriculum that lost a field, a lesson
                                     # body that changed, or a ladder that came
                                     # back in the wrong order (32 checks)
node scripts/schools-api.test.ts     # a school readable by anyone, writable by
                                     # somebody else, half-written, or a lesson
                                     # edited into existence (43 checks)
                                     # Both page-comparing checks are archived
                                     # now: schools-build.test.mjs compared the
                                     # database against the files, and
                                     # check-schools-built.mjs compared the
                                     # builders against the committed pages.
                                     # There are no committed pages. What asks
                                     # that question now is next/parity.test.mjs,
                                     # against the route.
```

And when anything under `app/src/` changed, after rebuilding.
`playwright` is a devDependency of `app/`, and it does not bring
a browser with it: point `CHROMIUM_PATH` at one, or run
`npx playwright install chromium`. Without either, both files say
so and skip, which is not a pass:

```sh
node app/desk.test.mjs             # a panel that renders and is not finished
                                   # (75 checks, needs Playwright and a browser)
node app/studio.test.mjs           # the React Studio's chrome, end to end
                                   # (78 checks, needs Playwright and a browser)
```

And when anything under `next/` or `shared/` changed, after
`cd next && npx opennextjs-cloudflare build`:

```sh
node next/parity.test.mjs          # the Next.js route saying something the
                                   # Worker's own renderer does not, and a
                                   # reading hub that has stopped agreeing with
                                   # the database
                                   # (114 checks, needs the build, skips without)
node scripts/check-types.ts        # and again here, because it SKIPS the browser
                                   # tests' config where next/node_modules is
                                   # absent, which is every CI runner
node next/article.test.ts          # the article page, on the real Worker with a
                                   # real database: the thread filling, a comment
                                   # body that stopped being text, and anything
                                   # hydrating wrongly on the one kind of route
                                   # nothing else can reach (27 checks, needs the
                                   # OpenNext build and a browser, skips without)
node next/interactive.test.mjs     # a calculator that renders and computes
                                   # nothing, because hydration undid it, and a
                                   # contact form that looks sent and reached
                                   # nobody (80 checks, needs `npx next build`
                                   # and a browser, skips without)
```

It really does run in a container, as of 16 August 2026, and the
reason it looked as though it did not is worth knowing: it gave up
on any line matching `Error: `, and `wrangler dev` prints exactly
that, harmlessly, wherever there is no outbound network. It then
started forty seconds later. A skip now says which of the three
ways it failed to start happened, and a skip is never silent.

## After deploying

One check describes what is live rather than what is committed, so
it belongs after the upload and not before it:

```sh
node scripts/check-live.ts        # the service binding, the second Worker's
                                   # own scripts, and the pieces that fall
                                   # through to a file
node scripts/check-preview.ts --preview <branch-preview-url>
                                   # does the Next Worker's branch preview
                                   # render what the live site renders
```

`check-preview.ts` is how a Stage 11 route gets verified before
anything forwards a reader to it. The two Workers deploy
separately and Cloudflare gives `reiad-next` a branch preview URL
on every push, with the real database binding, so a route can be
written, pushed and asked real questions while `NEXT_ROUTES` in
`worker.js` still sends nobody there. The URL is in the Cloudflare
bot's comment on the pull request.

It exists because `next/parity.test.mjs` is the better test and
does not run everywhere: it needs `wrangler dev` on workerd, and
somewhere without it this is the only thing holding a route to
anything. Reach for the parity test first; reach for this when
that is not available, and always to catch a deployed regression
a local test cannot see, because it asks the live site and the
live database rather than a fixture.

It runs itself on every push, in `.github/workflows/live-check.yml`,
because the two things it is really watching are settings on a
deployed Worker rather than lines in this repository, and an article
renders perfectly with both of them broken.

If a precached file changed, bump `VERSION` in `aab/sw.js`, add a line to
the changelog at the top of that file saying what changed and why it needs
the bump, then run `node scripts/check-sw.ts --update`.

## A migration's filename is a fact, not a label

`supabase/migrations/` is read by the Supabase GitHub integration,
which compares the versions in those filenames against the
versions recorded in `supabase_migrations.schema_migrations` and
applies anything it has not seen. So the number in front of a
migration is not decoration: it is the primary key of a row in the
database, and renaming a file after it has run tells the
integration that a migration it has never applied has appeared.

**Never rename a migration that has been applied**, and never
round its timestamp to something tidier. If a migration was
applied out of band, through the dashboard or through the Supabase
MCP, the version it was stamped with is the version the file must
carry, however ugly.

That is not hypothetical. Two migrations were applied that way and
then written into the repository under hand-rounded names:

| the file said | the database recorded |
| --- | --- |
| `20260817180000_lock_trigger_functions.sql` | `20260817181442` |
| `20260818090000_broker_admins.sql` | `20260818030907` |

The integration saw two migrations it had not applied, and one of
them sorted BEFORE the last one it had, which is an out-of-order
insert and something it refuses outright. The Supabase branch went
to `MIGRATIONS_FAILED` and stayed there, red on every commit to
main from 15 August onwards.

Nothing was broken by it and that is the point: the project stayed
`ACTIVE_HEALTHY`, every table was correct, the site never noticed,
and the only symptom was a red tick next to a check most people
would read as somebody else's. The SQL was fine. The filenames
were the bug.

Both files now carry the versions the database recorded. To check
that the two still agree:

```sh
# what ran, and when it was stamped
select version, name from supabase_migrations.schema_migrations order by version;
ls supabase/migrations/
```

## Backups

The database has two, and the split between them is about who can read
the result, not about size.

The repository is private as of 15 August 2026, and **that changes
nothing about what may go in git.** Visibility is one click and
retroactive in neither direction: going private unpublishes nothing
already fetched or forked, and going public later publishes the whole
history at once. A rule that holds only while a checkbox holds is not a
rule.

`content/articles.backup.json` is committed nightly by
`.github/workflows/backup.yml` and holds **live articles only**. Every
byte of it is already served at a public URL. Drafts, reader questions,
subscriber emails, the admin password hash and any identifier of a
system outside this site are deliberately absent, and
`functions/_lib/backup.js` says why at length. Do not widen that
`SELECT` without reading it.

Everything else goes nightly into R2 under `backups/`, written by the
Worker's own cron, kept a fortnight. Not public, same provider as the
thing it is backing up, which is a weaker guarantee and is written down
as one.

To restore, read the SQL before you run it:

```sh
node scripts/restore.ts content/articles.backup.json > restore.sql
npx wrangler d1 execute reiad --local  --file=restore.sql   # practise
npx wrangler d1 execute reiad --remote --file=restore.sql
```

## Where a lesson's words live

In D1, and in one committed export of it. The
`aab/<school>/content/<stage>.js` modules are gone from `aab/`
as of 16 August 2026: they are in `archive/schools/`, off the
site, and they were being uploaded and served at addresses nobody
had asked for in months.

A lesson is written at `/studio/?lessons`, which saves one row
through `PUT /api/schools/<school>/<stage>/<lesson>`. **As of
Stage 11.7 that is the whole of it**: the route reads the row, so
saving in the Studio changes the page. There is nothing to
rebuild and nothing to commit, which is what the whole stage was
for.

The snapshot is still worth refreshing, because two checks and
every test read it and it is the schools' committed backup:

```sh
npx wrangler d1 export reiad --remote --output schools.db
node scripts/export-schools.ts --db schools.db   # content/schools.backup.json
```

**Why there is a file at all, now that no page is built from it.**
Three reasons, and none of them is the pages any more. It is the
schools' half of the nightly backup, on the same footing as
`content/articles.backup.json`. It is what `check-schools.ts`
compares the four ladders against. And it is the
only copy of the lesson prose that a check running on a laptop
with no network can read, which is how `check-css.ts` knows that
`.shobdo-list` and thirty-one other rules are styling something
real.

It is safe on the same grounds as ever: every byte of it is
already served at a public URL. It carries no timestamp,
deliberately, so that identical content is identical bytes and
the git log answers "did the prose change" rather than "was this
refreshed".

**The pages are gone as of 16 August 2026, and so is half of
this.** archive/TRANSITION.md Stage 11.7: 247 of the 251 school pages became
Next.js routes rendered from the rows, and the four practice books
followed in #129, so all 251 are routes. There is no committed page
to compare a build against, `check-schools-built.mjs` is in
`archive/schools-builders/` beside the two builders whose whole
output it watched, and `next/parity.test.mjs` asks that question
against the route instead.

`check-schools.ts` stays and does two things: it compares the
ladder in `shared/curricula/<school>.ts` against the ladder in the
snapshot, and it computes every lesson's URL, progress id and
label both through `shared/schools.ts` and through the school's
own file, and fails on any pair that disagree.

**The ladder is `shared/curricula/<school>.ts`,** as of 19 August
2026, and the browser still reads it: eleven modules import
`/deutsch/curriculum.js` or one of its three siblings, which
`scripts/build-modules.ts` writes from those four sources the same
way it writes `/content.js`. So two files describe the same four
schools, and `check-schools.ts` fails if they stop agreeing about
which lessons exist, in what order, in which section. Titles and
prose are not compared: those are the Studio's now.

**A stage's `base` says where its pages go, not whether anybody
can write them.** `basics-1` carries a `base` of `/learn/terms/`
because its eighteen term pages were published there for a year
before this school had a builder, and their URLs do not move. They
are written from the rows like everything else; the builder just
writes them to that address.

**Every stage is editable, as of 17 August 2026.** `start` was
`inline` until then: its eight steps were accordion sections of
the hand-written hub at `/learn/`, and they were not article prose
either. Each carried a two-column "what you do / what others do"
split, a risk badge and a call-to-action, using the classes
`split`, `do`, `others`, `warn`, `bn-h` and `btn`, none of which is
in the article allowlist, and widening the allowlist would not have
fixed it: those classes belonged to the starter guide's own layer
and `check-css.ts` fails a class two layers both define.

They were rewritten into the article's own vocabulary instead. The
split became a `checklist` and a `side-note`, the warnings became
`note` boxes, the risk badge moved into the lesson's `meta` where
the card draws it, and the call-to-action went because the page
already has a prev/next pair. Eight rows that had sat with empty
bodies since Stage 8 have prose in them, and `/learn/start/` is
eight pages like every other stage.

No stage on this site is `inline` now, and the branch is gone from
both ladders, `shared/schools.ts` and `shared/curricula/money.ts`.

Generated pages are generated. Edit the source, never the output:

```sh
node scripts/build-modules.ts       # aab/share-card.js and aab/api.js from aab/src/,
                                    # and aab/content.js plus the four
                                    # aab/*/curriculum.js from shared/
node scripts/build-fallback.ts     # aab/fallback.css from next/styles/site.css
node scripts/build-school-icons.ts  # next/lib/school-icons.ts from aab/*/icons.js
node aab/build-meta.mjs              # feed.xml, sitemap.xml, robots.txt

cd app && npm run build             # aab/desk/**   from app/src/** (React)
                                    # aab/studio/** from app/src/studio/**
                                    # and app/build-stamp.json, which is what
                                    # holds the two to their own source
```

`app/` is the React workspace: Vite, React and TypeScript, building to
`aab/desk/` and `aab/studio/`. Two pages, two builds, one file each at a
stable path, because `sw.js` and the HTML shells name real paths and a
hashed chunk would fight them. `npm run build` runs both; `TARGET` picks
one. **Its output is committed**, for the same reason every
generated page here is: the site deploys by uploading `aab/`, with no
build step in CI, and adding one would mean a build command in a
dashboard that cannot be seen from the repository. So the rule is the
rule: edit `app/src/**`, run the build, commit both.

**Nothing held anybody to the second half of that until 19 August
2026.** `aab/desk/app.js` and `aab/studio/app.js` were last built at
#105 while `app/src/**` changed in #143, #147 and #149, so the desk
and the Studio served a build from before `accentStyle` existed, for
four pull requests, and every check passed: a stale generated file
looks exactly like a correct one. `scripts/build-stamp.ts` hashes the
sources and `npm run build` writes the hash, so the day they part
company a check fails. It hashes the SOURCES rather than the output,
because Vite's output is not reproducible across versions and the
thing that actually goes wrong is that nobody re-ran the build.

The stylesheet was not part of it, and now partly is. `aab/styles.css`
is still the design system: the rule that a port must not also be a
redesign held for every page ported in stages 9 to 12, which is what
made those ports judgeable.

**The stylesheet is `next/styles/` as of 18 August 2026.**
`site.css` is the design system, `tailwind.css` is the theme and
the utilities, and `globals.css` imports them in that order, which
is where the cascade order lives: it was two `<link>` tags in
`shell.tsx` whose sequence was the whole of it. `shell.tsx`
imports the one file and Next emits a hashed stylesheet, so
nothing is served at `/styles.css` any more.

`aab/fallback.css` is that stylesheet with its comments removed,
for `404.html` and `offline.html`, which cannot link a name that
carries a content hash. `scripts/build-fallback.ts` writes it and
`check-next.ts` fails if it has drifted.

**Tailwind is live as of 17 August 2026, on one page.** Stage 14 set
the arrangement up and deliberately left it unused so the first
conversion would be a change to one component. `/account.html` is
that component, because its markup is almost entirely layout.
`@theme` in `aab/src/styles/tailwind.css` names the site's own
tokens, so `bg-panel` means `var(--panel)` in both themes.

Three things stay in the stylesheet and the split is the point:

| | |
| --- | --- |
| anything an article carries | `tw` sits BELOW `article`, permanently. An article's body is HTML in a database and Tailwind's compiler cannot see it. |
| CSS with no utility | the popover menu is `@starting-style`, `::backdrop`, `:popover-open` and anchor positioning. Arbitrary values would be longer than the rule. |
| DOM built in a loop | a class name inside `createElement` is found by the scanner only because `aab/*.js` is a source. That makes it work, not readable. |

JSX gets utilities; everything else keeps a class.

Neither are the site's own modules. `/app.js`, `/api.js`, `/auth.js`,
`/content.js`, `/share-card.js`, `/photo.js` and `/editor.js` are left
external by `vite.config.ts` and imported at runtime, so the desk shares one copy
of each with every other page instead of carrying a second that can
drift. Most are plain JavaScript, so each is described by a
declaration in `app/src/types/` that `tsconfig.json` maps the runtime
path to; `/content.js` is TypeScript, so the mapping points at
`shared/content.ts` itself and there is no declaration to keep in
step. Do not answer an untyped import with a `@ts-expect-error`:
that silences the complaint without describing anything, and it
silences the next complaint too.

## What more than one runtime has to agree on

`shared/` is for anything the Worker, the browser and the Next.js
route must all say the same way. Six files and a directory:
`content.ts`, the site's own manifest and every number the site
states about itself; `curricula/`, the four schools' ladders, one
file each; `look.ts`, the per-section table and the head facts
every article page states; `headers.ts`, the security headers a
response has to carry when it was not served as a static file;
`schools.ts`, the same four curricula read out of D1, plus the
ladder's arithmetic; `rows.ts`, what a row of this database is;
and `courses.ts`, the third-party catalogue, which is the one
`next/` may not import for its values.

**Five of them have an output, and it is one argument.** The
browser reads the manifest at `/content.js` and a ladder at
`/money/curriculum.js` or one of its three siblings, five URLs
`sw.js` precaches by name, and it cannot reach `shared/`, so
`scripts/build-modules.ts` compiles those five into `aab/` beside
the modules it builds out of `aab/src/`. Edit the source, never
the output.

**An import inside `shared/` carries the `.ts` extension**, because
node reads these files with no build step and resolves the real
filename. Every tsconfig that sees one sets
`allowImportingTsExtensions`, and `scripts/tsconfig.shared.json`,
the one that compiles them, pairs it with
`rewriteRelativeImportExtensions` so the browser gets a `.js` it
can fetch.

**They are TypeScript, and nothing is compiled beside them.** Both
consumers have a compiler and use it: Next through
`transpilePackages` in `next/next.config.ts`, needed because the
package resolves inside `node_modules` and Next will not compile
TypeScript it finds there, and the Worker through wrangler's own
esbuild, which needs no configuration at all. Plain `node` reads
them too, which is what the checks under `scripts/` rely on: type
stripping has been on by default since Node 22.18.

It was briefly the other way round and that is worth not repeating.
The four were compiled to committed `.js` and `.d.ts` beside their
own source, which is twelve files where there are four, plus a
build script, plus a check to catch somebody editing the output
instead of the input, all of it serving a compile step that no
runtime here needed.

It is an npm package (`@reiad/shared`) because `next/` cannot import
by relative path out of its own directory: Turbopack refuses to
resolve above its root, and moving the root moves Next's file-tracing
root with it, which breaks the OpenNext build. `next/.npmrc` sets
`install-links=true` so npm copies it in rather than symlinking, for
the same reason. The Worker imports the files directly; esbuild has
no such restriction.

**That copy does not notice that you edited one.** npm keys a
`file:` dependency by its version, so `npm install` leaves a stale
copy in place however much the contents changed, and `next build`
compiles the old code without a word. Delete it first:

```sh
rm -rf next/node_modules/@reiad/shared && (cd next && npm install)
```

A typo in `bnNum` put every Bangla numeral into Devanagari, `০১২৩`
becoming `०१२३`. It was fixed, the build was re-run, and the route
went on serving the wrong digits from the copy. `next/parity.test.mjs`
is what caught it. `shared/README.md` says all of this again where
somebody editing those files will see it.

**A response a Worker builds is not a static asset**, so `aab/_headers`
does not apply to it. Every article rendered from the database was
served with no Content-Security-Policy, no HSTS and no
`X-Frame-Options` for as long as that route existed, beside
file-based articles that had all three, and the page renders the
same either way. Anything that returns HTML from a Worker goes
through `htmlResponse()` in `shared/headers.ts`, and
`check-headers.ts` fails if that list and `_headers` drift.

**It also fails on a handler that does not call it**, which the
list comparison alone could never see. The subscription confirm
page built its own `new Response` with a Content-Type and nothing
else, so a reader arriving from their email got none of the six,
while the check reported the two lists in perfect agreement.

**And a Worker-built page links `/fallback.css`, never
`/styles.css`.** Nothing has been served at the second since
Stage A: the stylesheet is Next's and carries a content hash,
which a response a Worker builds cannot know. Both pages that
link one by name were still asking for the old address, so both
were unstyled, and the only thing in the repository that knew was
one check in `next/parity.test.mjs` that had been failing for so
long it read as furniture.

## The writing surface is one module

`aab/editor.js` is the contenteditable: the sanitiser, the block list,
the markdown input rules, the slash menu, the figure toolbar and the
caret work under all of it. Both Studios import it, `createEditor({
root, onChange, lang, toast, pickPhoto })`, and the root element is
handed in rather than looked up so importing it does not import a page.

**Do not copy any of it into a component.** A `contenteditable` is a
piece of the DOM the browser and the writer are both editing behind
React's back; rendering it from state replaces the node the caret is in
on every keystroke. React owns the chrome around it and nothing inside
it. Two sanitisers that disagree is the bug the three-place rule above
already exists for, and a second copy of this file is how you get one.

**A port is finished when it does what the thing it replaced did, not
when it renders.** Those two look identical from the outside, which is
how the first React desk shipped as three thin panels missing the
search boxes, the filter counts and most of the actions. So the list of
what the old page did is written down as a test:
`app/desk.test.mjs` drives the built page in a browser against routed
API fixtures, and every check in it is a feature `aab/desk.js` had.
Anything ported out of `aab/*.js` gets the same treatment before it is
called done.

That includes the `<head>`. A change to canonical links, Open Graph tags
or the webfont link has to go into `page()` inside both builders, or the
two schools drift away from the rest of the site one deploy at a time.

## A page rendered by Next loads its modules through one component

**Never write `<script type="module" src="...">` into a Next route.**
`next/components/scripts.tsx` is how a page loads one, and the reason
is not tidiness. A module script in the body is deferred, so it runs
after the document is parsed and BEFORE React hydrates; hydration is
React adopting the server's HTML, and it undoes anything the module
wrote into it. The module runs, the page goes back to how it shipped,
and the console says `Minified React error #418`.

That is not a hypothetical either. Every calculator on this site was
blank for a day: the compounding tool computed the right number, wrote
it in, and had it replaced with the placeholder dash, and the same
happened to the stock check's verdict and to five of the seven case
studies. Nothing here could see it, because every other check reads
HTML and the HTML was correct.

The same rule catches two smaller shapes of it:

- An inline script written as `<script>{js}</script>` in JSX ships as
  an empty tag. React drops the children of a `<script>`. Use
  `dangerouslySetInnerHTML`, which for this one tag is the ordinary
  way and not a shortcut.
- A `<style>` or any other node a script adds to the document before
  hydration is a node React removes. Render it instead.

An element a pre-paint inline script deliberately rewrites, the home
page's headline being the only one, carries `suppressHydrationWarning`
so React leaves it alone.

`next/interactive.test.mjs` drives the built pages in a real browser
and fails if any of this comes back.

## The money school lives at /money/

It was `/learn/` from the day it existed, because it *was* the
learning half of the site: one school, and "learn" named the idea
rather than the subject. There are six schools now and it is one of
them, so it sits at `/money/` beside `/deutsch/`, `/quran/` and
`/english/`, under the name it teaches: টাকা ও শেয়ার.

Moved on 17 August 2026, and moved properly: the school id in D1,
the folder `aab/money/`, the cascade layer `@layer money`, the
route patterns in `worker.js`, `run_worker_first` in
`wrangler.toml`, and every link in every lesson body. **No
redirect.** The old addresses are gone, which is what a move is.

**One thing did not move, and it must not.** The storage keys.
Progress is still filed under `learn-read` and `learn-last`, and
`aab/sync.js` still maps them to `learn:progress`. Those strings
are in real browsers and in real accounts, and the rule at the top
of "What a reader has read" is the whole reason: renaming a key
does not move somebody's ticks, it loses them. `next/lib/progress.ts`
maps the school `money` on to the key `learn-read` deliberately,
and says so where it does it.

## Third-party courses, which are nobody's to publish

`/skills/courses/`, and it is the one section of this site that
breaks the rule every other section follows. Everywhere else **the
ladder is the server's**: the route reads the rows and renders
them, and a crawler is welcome to the result. Here the server
renders nothing.

The reason is what the content is. These are not lessons written
here. They are one person's own copy of a bought course, sitting
in a private Google Drive folder, and this repository holds a
CATALOGUE of it and not a byte of the material: which courses,
which modules, which lessons, and the Drive id behind each one.
Publishing that catalogue would be redistributing somebody else's
course, so the pages are empty and the catalogue is behind
`isAdmin()`.

| | |
| --- | --- |
| `shared/courses.data.json` | the catalogue. **Generated.** 8 courses, 43 modules, 794 lessons, 1629 Drive ids |
| `scripts/import-courses.ts` | what generates it, out of Drive |
| `scripts/fixtures/course-crawl/` | the Drive listing it is built from, so CI can rebuild it with no credential |
| `shared/courses.ts` | the types, the counts and every address |
| `functions/api/courses/` | the only thing that ever sends it |
| `functions/_lib/drive.ts` | the one place this site reads Drive |
| `functions/_lib/ticket.ts` | a signed pass, because `<video>` sends no header |
| `functions/_lib/quiz.ts` | a Coursera quiz export, read into questions |
| `functions/_lib/drive.test.mjs` | the JWT really is a signature, and the pass opens one file |
| `aab/src/courses.ts` | the browser's half: all four pages |
| `next/app/(site)/skills/courses/` | four shells with nothing in them |

**Do not import the value half of `shared/courses.ts` from
anything under `next/`.** A page that did would put the whole
catalogue into a JavaScript bundle anybody can fetch, and the page
would look identical. `import type` is fine and is erased before
bundling. `check-courses.ts` fails on the other kind.

**The catalogue is generated and must stay generated.** It is a
list of things that exist elsewhere, which is the rule at the top
of this file: a hand-edited copy is right on the day it is typed
and wrong the first time the Drive folder changes.

Refreshing it needs a Drive OAuth **access token**. A private file
will not open for an API key, and not for a service account
either unless the folder has been shared with it. Ask for the
narrowest scope that works, `drive.metadata.readonly`, which
cannot read file content at all: this script reads `id`, `name`
and `mimeType` and never opens a file. Get one either from
[the OAuth playground](https://developers.google.com/oauthplayground)
or, with no third-party client involved, from gcloud:

```sh
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/drive.metadata.readonly
export GOOGLE_OAUTH_TOKEN=$(gcloud auth application-default print-access-token)

node scripts/import-courses.ts --drive <folderId> \
  --dump scripts/fixtures/course-crawl
node scripts/import-courses.ts --crawl scripts/fixtures/course-crawl --check
```

**Always pass `--dump` on a `--drive` run.** It writes the Drive
listing back out beside the catalogue, and that listing is the only
reason CI can rebuild the catalogue without a credential. Refresh
one without the other and the next `--check` fails on a drift that
is really a stale fixture.

Export it rather than passing `--token`: an argument goes into the
shell history and a token is a bearer credential for the hour it
lives. Nothing is written until the whole walk succeeds, so a
token that expires halfway leaves the committed catalogue alone.
The head of `import-courses.ts` says all of this again where
somebody running it will see it.

**The browser never talks to Drive. The Worker does.** That is
the second version of this section and the first one was wrong in
a way worth writing down, because it looked right and shipped.

It handed Drive file ids to the page: a `/preview` iframe for a
video, a link for a reading. Neither can work for a PRIVATE file.
Drive has to know who is asking, and inside a cross-site iframe it
cannot, because browsers block or partition third-party cookies
now. Drive sees an anonymous request for something that is not
public and answers "Unable to load video". Nothing is broken: not
the embed, not the file, not the CSP. The mechanism only ever
worked for files shared by a link, and these deliberately are not.

So `functions/_lib/drive.ts` holds one credential and serves the
bytes from this origin, where there is no third party to block:

| | |
| --- | --- |
| `GET /api/courses/ticket/<id>` | a signed pass for one file, thirty minutes |
| `GET /api/courses/file/<id>?t=` | those bytes, streamed, `Range` forwarded |
| `GET /api/courses/reading/<id>` | that page, sanitised, rendered in the lesson |
| `GET /api/courses/quiz/<id>` | that quiz, as questions rather than markup |
| `GET /api/courses/captions/<id>?t=` | the `.srt` beside the video, as WebVTT |

**Two locks on the file route, and the second is the one that
matters.** `isAdmin()` is the first. On its own it would leave a
proxy that fetches any Drive id it is handed, which is a read-only
window onto the whole of somebody's Drive resting entirely on one
check. So `isCourseFile()` refuses any id the catalogue does not
name, before a credential is even loaded.

**`<video src>` sends no `Authorization` header**, which is why
there is a ticket at all. The alternatives were a bearer token in
a query string, which puts a long-lived credential in history and
in every proxy log, or a cookie, which is a third way of being
signed in on a site that already has two. A ticket names one file,
expires, and grants nothing else. Its key is derived from
`GOOGLE_CLIENT_SECRET` rather than being a fourth secret to
manage, with domain separation so it signs tickets and nothing
else.

**Still no player events.** A `<video>` element would happily
report `ended`, and using it would still be guessing that somebody
who left a tab open has learnt something. A lesson is complete
when the reader presses "Mark complete & continue", and the last
lesson of a module goes to the module summary rather than into the
next module. `aab/courses.test.mjs` asserts the absence as well as
the presence.

**A transcript and captions are two files and two jobs.** Every
video in this catalogue ships with a `.en.txt` and a `.en.srt`
beside it. The first is prose and is offered as a link, for
reading instead of watching. The second is the same words with
timings on them, which is the only thing a `<track>` can use.

`coursera.mjs` classified both correctly from the first import and
`import-courses.ts` carried only the transcript, so for a while
every lesson had a player with a captions button that turned
nothing on. The lesson looked finished, which is the failure mode
this whole file keeps returning to.

No browser reads SubRip in a `<track>`, so the Worker converts:
`toVTT()` in the endpoint adds the `WEBVTT` header and moves the
decimal point, and does it only inside a timecode, because
captions are prose and a blanket comma replace turns "first, we
will" into "first. we will" in every subtitle on the site. The
track carries its own ticket, minted for the captions file rather
than shared with the video's, because a ticket naming ONE file is
the property that makes it safe to put in a URL.

`media-src 'self'` already covers a `<track>`, so the CSP did not
change.

**A quiz is parsed, never sanitised into shape.** Every option in
a Coursera quiz lives inside a `<form>`, and `sanitiseHTML()` drops
`form` WHOLE, contents and all. That is right for an article and it
deleted every answer here: the page showed "Question 2", a rule,
"Question 3", a rule, and looked finished.

The fix was not to widen the allowlist, which would let a form into
every article on the site to serve one page that is not an article.
`functions/_lib/quiz.ts` reads the structure FIRST and sanitises
only the prompt it hands on, so what crosses the wire is data: a
prompt, whether it is pick-one or select-all, and a list of option
strings. **The browser builds its own inputs from that**, which is
also how no foreign `<input>` ever reaches the page. An export in a
shape the parser does not know falls back to the reading renderer,
because unreadable is worse than plain.

**It cannot mark anything, and it says so.** The export carries no
answer key: no `checked`, no `correct`, nothing. Coursera marks on
its own server and what was downloaded is the paper, not the
marking scheme. So the page records what the reader picked and
prints one line saying nothing is marked right or wrong. A tick
next to a wrong answer would be worse than no tick.
`quiz.test.mjs` asserts the absence of a score as well as the
presence of the options.

Answers are `courses-answers`, a `set` of
`<course>/<module>/<lesson>#<question>#<option>` beside the ticks
in `aab/sync.js`. That is the checkpoint shape with one segment
more, and a `set` for the same reason. A pick-one question clears
its other options on change, so the store can never say a reader
chose two things where the page allowed one.

**Answering is still not finishing.** The lesson's tick is the
button, exactly as it is for a video.

**`ID_FIELDS` in `shared/courses.ts` is the list of lesson fields
holding a Drive id**, and it is exported because more than one
thing walks it. `check-courses.ts` kept its own copy, and the day
`captions` was added it went on reporting every id well formed
while never looking at 298 of them. One vocabulary, one place: the
rule `check-rows.ts` already enforces for the database.

**The credential is a SERVICE ACCOUNT, and that is not a
convenience.** Two wrangler secrets, and the site works without
them: every caller checks `canReachDrive()` and the page says the
section is not connected rather than failing oddly.

```sh
npx wrangler secret put GOOGLE_SA_EMAIL   # ...@....iam.gserviceaccount.com
npx wrangler secret put GOOGLE_SA_KEY     # private_key from its JSON key file
```

Then **share the Drive folder with that address**, as Viewer, the
same way you would share it with a person. That sharing IS the
grant: a service account owns no files, so it can see exactly what
has been shared with it and nothing else.

This was a user OAuth refresh token first and that was wrong twice
over. It could not be obtained: `drive.readonly` is a RESTRICTED
scope, so an app using it needs a security assessment before
Google lets it out of "Testing", and refresh tokens issued in
Testing expire after seven days. The section would have worked for
a week and then quietly stopped. And it was far too much power: a
user refresh token with that scope reads the WHOLE of a person's
Drive, every document and every photo, where this needs one
folder. If the service account's key leaks, what leaks is a folder
of somebody else's course.

That is also what makes `isCourseFile()` a second lock rather than
the only real one.

The scope is still `drive.readonly`: read, never write.
`drive.metadata.readonly`, which `import-courses.ts` uses, is not
enough here, because it deliberately cannot read file content.

`functions/_lib/drive.test.mjs` generates a throwaway RSA key and
verifies the signed assertion against its public half, because
every way of getting the JWT wrong comes back from Google as
`invalid_grant`, which is also what it says when a clock is wrong
or a key has been deleted. Without that test the first guess is
always the credential and never the code.

**The CSP swapped a line.** `frame-src https://drive.google.com`
is gone with the iframe it existed for, and `media-src 'self'` is
in its place in both `aab/_headers` and `shared/headers.ts`.
`default-src` would already cover same-origin media; it is written
out because it is the line somebody would otherwise widen back to
drive.google.com the next time a video looks broken.
`frame-ancestors` is unchanged and still `'none'`.

**Progress is a tick like any other.** `courses-read` and
`courses-last`, a set of `<course>/<module>/<lesson>` ids and a
bookmark, in `aab/sync.js` beside the six schools' keys and
carried to `public.progress` in Supabase under the same row-level
security. The section needs an account anyway, which is the
argument FOR putting the keys in that table rather than against
it: one person with an admin account has more devices than
anybody.

**Nothing in the rail or the footer links to it.** `unlisted` in
`next/lib/nav.ts` is that flag, and it exists so the menu can
still be said once: the entry is in the one table like everything
else, the two menus skip it, and `/skills/index.html` gives it a
card of its own under a heading that says it is not published. A
link in the footer to a page that answers 403 is a promise the
site cannot keep.

## The live portfolio, and who is an admin

`/tools/live.html` shows one real Trading 212 account, live, three
ways. A stranger gets the site's own portfolio in percentages: a
weight and a return teach a lesson, a balance only says how much
money somebody else has. A signed-in reader who connects their own
API key gets the same dashboard over their own account, in full. An
admin gets the levers: the key behind the public feed, the switches
that decide what a stranger's list shows, and the site account
unsanitised.

**The browser never speaks to the broker.** `aab/tools/live.js`
calls `/api/broker/*` and nothing else; the Worker
(`functions/api/broker/[[route]].js` over `functions/_lib/broker.js`)
is the only caller of `live.trading212.com`, which is why
`connect-src` did not change. The broker's rate limits are per
ACCOUNT, so the one place that can meter requests honestly is the
one place they all pass through: the public snapshot lives in D1
`settings` and refreshes at most every five minutes, a reader's own
numbers cache at the edge for one minute and their history for ten.
Do not add a second caller, and do not write the broker's hostname
into anything under `aab/` or `next/`: `scripts/check-csp.ts` scans
every string in both and will rightly fail it.

**A key is stored sealed or not at all.** `PUT /api/broker/key`
proves a key against the broker, seals it with AES-GCM under the
`BROKER_TOKEN_KEY` wrangler secret, and writes it to
`public.broker_tokens` in Supabase AS THE READER, forwarding their
own bearer: this project holds no service-role key and this table is
not a reason to start. The row's owner can read their row back and
learns ciphertext. Without the secret, nothing is stored and the
paste-it-per-session path (the `x-broker-key` header, sessionStorage
in the tab) is all there is. The public feed's key is the
`T212_PUBLIC_TOKEN` secret, or one an admin sets from the dashboard,
sealed into D1 `settings` the same way; the secret wins where both
exist.

**Admin is a reader id in two records, either is enough.**
`ADMIN_READERS` in `wrangler.toml` is the half that works with
nothing else set up; `public.admins` in Supabase is the durable one,
granted only in SQL, with a select policy that shows a reader their
own row and no write policies at all, so no combination of browser
tokens can mint an admin. `functions/_lib/admins.js` asks both and
is the ONLY place that asks: anything that wants to know goes
through `isAdmin()`. What an admin currently gets: the dashboard's
admin panel, the full site account, and their comments go live
without the moderation queue (their name is on the site; approving
themselves was a button with one possible answer). A new privilege
belongs behind the same function, not behind a second list.

## Publishing a new case study

The failure this list exists for is a finished case study that nobody can
reach. In order:

1. Write the page into `aab/portfolio/`.
2. Add it to `PAGES` in `shared/content.ts` with `group: "case"`, plus `kind`
   (`model`, `analysis` or `research`) and a `short` title. That one entry
   puts it in the menu, the Ctrl+K palette, the sitemap, the home page
   rotation and the portfolio count.
3. Add its card to `portfolio.html`.
4. `node scripts/check-content.ts` fails until steps 2 and 3 are both done.

## Where an article lives

In D1, written through the Studio, and rendered by a Next.js route.
There is no file half any more and no fallback to one:
`shared/content.ts` holds the menu, the palette and the site's own
furniture, and the writing is rows.

`archive/TRANSITION.md` is how it got there, and it is **history
rather than a plan**. It ran from the 15th to the 17th of August
2026 and every stage in it has landed or been dropped. Read it for
why something is the way it is; do not read it for what the site
looks like, because the addresses and file names in it are the ones
that were true on the day each entry was written. This file is the
current description, and this file is the one kept true.

## Before opening a pull request

Check whether anything else is already in flight. Two open pull requests
had added three case studies to the same files a redesign was rewriting;
the redesign was branched off `main` and would have dropped all three on
merge. Look at the open PRs, not just `main`.

## Merging: do it, do not ask

Finished work ships without a second conversation. Open the pull
request, wait for the checks, and merge it as soon as they are green.
Squash merge, so `main` keeps one commit per change with the pull
request number on the end, the way every entry in the log already
reads. There is no need to come back and ask whether it should go in:
the decision that mattered was made when the work was asked for.

This rule leans on the section above rather than replacing it, and the
lean is the whole point. Merging without asking is only safe while
every check still runs first:

- all four checks in **Before deploying** pass,
- anything that touched a precached file bumped `VERSION` in
  `aab/sw.js` and re-ran `scripts/check-sw.ts --update`,
- generated pages were regenerated from their source, not edited,
- and `grep -rn $'\u2014' aab/ functions/` comes back empty.

A red check is a reason to fix it, or to say plainly what is broken
and why it is not fixable here. It is never a reason to merge anyway,
and "the user said merge automatically" does not turn a failing check
into a passing one.
