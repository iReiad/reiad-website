# reiad.co.uk, house rules

## Punctuation: no em dashes. Ever.

**Never use the em dash, U+2014, anywhere on this site.** It is not written
out anywhere in this repo on purpose: the check below greps for it, and a
rule that contains the character it bans always matches itself. Not in page
copy, not in headings, not in meta descriptions, not in Bangla, not in
strings a script writes into the DOM, not in commit messages or PR bodies.

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
never one comma and one bracket. En dashes (U+2013) in number ranges are
fine: `2024–26`, `৳50–100`. The same rule applies to code comments.

```sh
node scripts/check-dashes.ts
```

It reads every tracked file, so this file and every migration are covered,
and `check-all.ts` runs it.

## React or a route. `aab/` is closed, and it is a check now.

**Nothing new is built the old way, and that is not only about pages.**
A page is a Next.js route under `next/app/`; a piece of interface is a
component under `next/components/` or `app/src/`. Anything still built the
old way is waiting to be ported, not a pattern to copy.

What that rules out:

- a new `aab/*.html` file,
- **a new browser module in `aab/src/`**, which is the one that gets
  written by accident,
- a new page emitted as a template literal from a builder,
- a new `.js` under `functions/`,
- a second copy of chrome the shell already renders. The rail, the top
  bar and the footer are `next/components/`.

**`scripts/check-closed.ts` holds it.** The old system is recorded by name
in `scripts/closed-set.json` and the list may only get SHORTER: a
conversion removes a name and `--update` records it, a new file is not in
the list and the check fails naming what to build instead.

```sh
node scripts/check-closed.ts --list      # what is still on the old system
node scripts/check-closed.ts --update    # after converting one, record it
```

`MIGRATION.md` lists what is still on the old method. The four practice
books are routes: `next/app/[section]/[slug]/arbeitsbuch.html` and
`workbook.html`, with `aab/schools/workbook.js` loaded by the route as the
engine.

The two exceptions are `404.html` and `offline.html`: they have to answer
when the Worker, the route and the network are all unavailable, which is
exactly when a route cannot.

## An address has no `.html`, and the two files that do are not routes

A page of this site is `/about`, `/skills`, `/money/basics-1`, and every
old spelling is a 301 in `aab/_redirects`.

Three places have to agree or the address is dead, and each one fails
differently:

| | |
| --- | --- |
| the directory under `next/app/` | which IS the address |
| `run_worker_first` in `wrangler.toml` | takes it off the asset router. Missing: the router answers `404.html` and the Worker is never called |
| `NEXT_ROUTES` in `worker.js` | forwards it to the Next Worker. Missing: it falls through to a file that is not there |

The OLD spelling has to be absent from `run_worker_first`, because
`aab/_redirects` is the asset router: a path a Worker answers first never
reaches the rules file. `check-routes.ts` walks all of it and fails on a
loop or a dead end.

**Two kinds of address keep their `.html`.** An article is
`/insights/<slug>.html` and a school lesson is
`/<school>/<stage>/<lesson>.html`, where the suffix is part of a slug
rather than of a route: it is in the rows, in every link inside every
lesson body in D1, and in the `public.library` row of everybody who has
saved a piece. `/skills/courses/` keeps the old spelling for a smaller
reason: `aab/src/courses.ts` builds those four addresses a second time and
reads `location.pathname` to decide which it is on, and `check-courses.ts`
fails if the two disagree. Move both or neither.

**A layout wraps everything under it, so a section whose own page needs one
puts that page in a route group.** `/portfolio/(hub)/` and `/tools/(hub)/`
are what that looks like. `/admin/layout.tsx` plus
`/admin/research/layout.tsx` is TWO shells on one page: two rails, two top
bars, two footers, two boot scripts writing the same three attributes on
`<html>`, and `margin-left: var(--rail-w)` on two nested `.shell-col`s,
which takes 268px off the width. Both copies are `position: fixed`, so they
sit on top of each other and a screenshot shows one of each.
`check-routes.ts` counts layouts and fails on two as well as on zero.

## Convert what you touch

Three migrations are part-done and `MIGRATION.md` tracks them. **Any file
you edit for another reason gets converted in the same change**, wired up
properly, with its checks passing.

| From | To |
| --- | --- |
| a hand-written `aab/*.js` | `aab/src/*.ts`, built by `build-modules.ts` |
| a `functions/**/*.js` | `.ts`. Wrangler's esbuild type-strips with no config |
| a `<style>` block or new component markup | Tailwind utilities |

Real types, not `any` and not `@ts-expect-error`: the latter silences the
complaint without describing anything, and silences the next one too. A JS
module that has to stay JS gets a declaration in `app/src/types/`. Update
`MIGRATION.md` in the same commit.

**Never edit a built file.** `aab/*.js` that has a source in `aab/src/` is
output: editing it passes every check and is discarded by the next build.
`check-courses.ts` fails if that section writes a storage key the account
does not carry, which is what `courses-answers` cost.

**A comment that names a file has to name one that exists.**
`check-pointers.ts` reads every tracked file and fails on any `check-*`,
`build-*`, `import-*`, `export-*` or `*.test.*` name that reaches nothing.
A name that is gone ON PURPOSE goes in `GONE` in that file, keyed by the
file AND the name, with the reason. Keyed by both because
"`build-styles.mjs` is gone" is a true sentence and a NEW comment naming it
somewhere else is not.

**A file at a stable path is network first, and everything else is not.**
A Next chunk carries a content hash, so a new build is an address the cache
has never seen; a served module is in `PRECACHE`, so `check-sw.ts` fails
when its bytes change without `VERSION` moving. `/studio/app.js` is
neither, on purpose: `app/vite.config.ts` builds one file at a stable path
so `sw.js` and the route that loads it keep naming something real, and at
232 KB precaching it would cost every reader who never opens the Studio a
quarter of a megabyte. On stale-while-revalidate the cache answers and the
network refreshes for next time, which for a file that never changes name
means the Studio is ALWAYS ONE BUILD BEHIND. `STABLE_BUNDLE` in `sw.js` is
the pattern, `check-sw.ts` fails if it stops matching anything, and
`aab/sw.test.ts` installs the real worker and changes a file underneath it.

**Nothing here is `.mjs`.** `scripts/check-mjs.ts` fails on any tracked
`.mjs` or `.cjs`. A `.ts` runs under node with no build step, no loader and
no configuration, because type stripping has been on by default since
22.18.

**Renaming is half of it.** The other half is a config that typechecks the
file, and `scripts/check-types.ts` is what says the second half happened:
node strips annotations without reading them, so a `.ts` that nothing
typechecks is a `.js` wearing them, which is worse than the `.mjs` it
replaced because a reader now believes them. Every directory of node-side
TypeScript here has a config in that check's `CONFIGS` list.

One exception, in `KEPT` with its reason: Next loads
`next/postcss.config.mjs` by name and reads only `.js`, `.mjs`, `.cjs` and
`.json`, and `next/package.json` has no `"type": "module"`, so a `.js`
there would be CommonJS. An entry there has to name a LOADER; "it would be
work to convert" is debt, and debt goes in the same commit as the
conversion. The check also fails on a STALE exception.

## Comments carry the constraint, not the story

Keep what a reader needs in order not to break something: what will fail,
what must never be renamed, why an order is load-bearing, what a check
exists to catch. One or two lines.

Cut narrative, dated process notes, and reasoning that only made sense while
a decision was being taken. "This was three files and is now one" is
history, and history is what the git log is for.

The test is whether removing the comment would let somebody make a mistake.
If it would, keep it and make it shorter. If it would not, cut it.

## Ship it

Open the pull request, wait for the checks, squash merge. No second
conversation, no asking whether it should go in.

```sh
node scripts/check-all.ts      # every check and fast test, about 18s
```

**That file IS the list.** `.github/workflows/checks.yml` calls it, once
per stage, rather than keeping a second copy.

```sh
node scripts/check-all.ts --stage=checks     # or generated, or tests
``` The browser and network tests are listed under
"Before deploying" and still have to be run by hand.

**`checks.yml` runs on `push`, and that is deliberate.** `pull_request` has
stopped firing before, for opens and for pushes alike, while `push` kept
working. It is still listed so the run attaches to the pull request when
GitHub does deliver the event, and main is excluded because `deploy.yml`
calls this workflow before it uploads.

**Three green checks is not green.** `checks` is the fourth and it is the
one that matters. If a pull request is missing it, dispatch the workflow on
the branch rather than merging on an incomplete signal.

## Language

Bangla is the site's learning language, English the working one. Bangla
copy is written for a reader who should never have to read English to find
out that something exists in their own language. Keep it plain: short
sentences, everyday words, no transliterated jargon where a Bangla word
exists.

## Numbers and lists come from the data, never from a sentence

**If a page says how many of something there are, it must count them.**
`COUNTS` in `shared/content.ts` derives every such number from the data the
site already holds, and `app.js` fills any element carrying `data-count`:

```html
<span data-count="stages">৮</span>টা ধাপ
<span data-count="caseStudies">7</span> case studies
```

Bangla digits are used automatically inside a `[lang="bn"]` element. The
number left in the markup is the no-JavaScript fallback, so keep it roughly
right; `check-content.ts` fails the build if it drifts.

The same rule covers lists. A list of things that exist elsewhere (case
studies, articles, tools) is built from `shared/content.ts` or
`shared/nav.ts` by the route that draws it, and the markup is a fallback,
not the source. Adding a case study should require editing
`shared/content.ts` and nothing else. Nobody types a wrong number: each was
right on the day it was written, and then the thing it counted grew.

Two counts (`ratios`, `pillars`) are typed into `COUNTS` because they
belong to `tools/stock.model.js`, which `shared/content.ts` deliberately
does not import. They are asserted against that model by the check below.

A sentence that genuinely cannot hold a slot (a `<meta>` description, a
blurb inside `shared/content.ts`) goes in the `CLAIMS` table in
`scripts/check-content.ts`, so the next data change fails a check rather
than a reader.

## There is an app, and the data half reaches it on its own

**Anything that is DATA reaches the Android app with no app release.
Anything that is CODE needs one.**

| Added here | The app |
| --- | --- |
| a piece, a lesson, a stage, edited prose | has it, next fetch |
| a school, a tool, a case study, a term, a menu entry, a count | has it, next fetch |
| a new field on a section, a new flag on a nav item | has it, next fetch |
| a food row, a nutrient, a unit word, a portion's figures | has it, next fetch |
| a new calculator's arithmetic | needs a release |
| a new article block class, a new sanitiser class | needs a release |
| a new storage key | needs a release, and see the rule above about renaming one |

The top four rows are true because the endpoints SPREAD the tables rather
than mapping them field by field. Pick fields by hand and it looks
identical on the day it is written, then silently drops whatever somebody
adds a year later.

**Three endpoints answer the app**, split by what a reader pays for.
`/api/site` is the furniture and is fetched on every cold start.
`/api/tools` is the calculators' 366 phrases. `/api/foods` is the portion
library and the nutrient panel, 57 KB, and it has a route of its own
because a reader who never opens the diet tool should not download the food
library to see the front page.

**A nutrient added to a food row reaches the app with nothing published,
and that is a property of the app.** Nothing in `core/.../diet/Foods.kt`
names one: a `Portion` is built out of a `JsonObject` and every numeric
field that is not structural lands in a map, so the two lists that split a
scaled row (`COVERAGE_KEYS` and `MACRO_KEYS`) are sent rather than written
down twice. A Kotlin class with nineteen fields would decode the new row
perfectly and drop the new figure.

**`check-app-surface.ts` is what holds it.** Every
`export const SHOUTING_CASE` in `content.ts` and `nav.ts` is either
imported by that endpoint or named in `NOT_FOR_APP` with the reason it
stays behind, and an exemption that has gone stale fails too.

```sh
node scripts/check-app-surface.ts --list   # what the app gets, and what it does not
```

`ANDROID.md` is the app's own plan. `iReiad/reiad-android` is the app.

## The shell, and the one table the menu comes from

Every page is a rail down the left, a bar across the top and a footer. All
three are rendered on the server by `next/components/`, and all three read
**one** table: `shared/nav.ts`. Add a school there and it appears in the
rail, in the footer and on `/skills` at once. A menu said in more than one
place agrees only because somebody remembers, and an overlay drawn at
runtime does not exist for a reader with JavaScript off or for a crawler.

Three attributes on `<html>` drive the chrome, and all three are restored
**before the first paint** by the boot script in `shell.tsx`:

| | |
| --- | --- |
| `data-rail` | `open` or `closed`, the rail's width |
| `data-drawer` | `open` or `shut`, the same menu on a phone |
| `data-audience` | `learn` or `work`, which groups lead |

The attribute is the state. The buttons write it and the stylesheet
answers; nothing keeps a second copy in React, because the copy is the one
that arrives a paint late. `@layer shell` in `styles.css` is where the
rules are.

**The audience switch turns on its side when the rail folds.** A folded
rail is 76px and the switch is two halves reading "Learning / শিখতে এসেছি"
and "Hiring / কাজের খোঁজে", so it measured 173px inside a 76px column.
Folding the rail is not giving up the question, so it becomes one column
and two rows, the lozenge sliding down instead of across, with the rules
inside a `min-width: 901px` query rather than stated and then taken back in
a second block.

**Two pages are not routes and cannot be:** `404.html` and `offline.html`.
They carry `.slimbar` instead, in the same layer, and they are the whole of
`aab/*.html`. If you add a third, give it the slim bar too: `body > header`
is gone from the stylesheet and nothing will style a header you write.

## One design system, and six kinds of glass

**Every surface on this site is the same material, and three axes decide
what a given thing gets.** `@layer glow` in `next/styles/site.css` is the
whole of it, and `scripts/check-material.ts` is what stops it rotting.

| | depth | polish | clarity | standing | follows |
| --- | --- | --- | --- | --- | --- |
| `chip`    | 1   | 0.94 | 0.78 | 0.3 | yes |
| `control` | 2.2 | 0.80 | 0.70 | 0.9 | yes |
| `card`    | 5   | 0.50 | 0.50 | 1   | yes |
| `pane`    | 9   | 0.30 | 0.30 | 1   | no  |
| `plate`   | 3.4 | 0.55 | 0.28 | 1   | no  |
| `groove`  | 1.6 | 0.88 | 0.74 | 0   | no  |

**Nothing visible is authored. All of it is derived:**

```
--glow-w    = depth * 46px          how wide the light spreads
--glow-i    = clarity * 32%         how strong it is
--glow-stop = 52% + (1 - polish) * 46%   how far the falloff reaches
--depth-lit = depth * (1 + glow-a * 0.6)   the edge opens as it lights
--edge      = three inset shadows: the catch light on the near wall at
              depth-lit, the seat above it, and a 1px rim all the way round
```

**Flat on top. The thickness is at the CUT EDGE.** A wash fading down a
face is a dome, and a dome is the one thing a slab of glass does not have.
Every stop in `--lit` is doubled and every transition is hard: a hairline
rim, nothing across the face, then the seat and the catch light at the
bottom. `--depth` is a length in pixels there and drives the BOTTOM band
only.

**The rim goes all the way round, and it splits.** A cut edge of real glass
disperses, so `--polish` mixes the section's accent into it: the money
school's edge splits green and Deutsch's splits blue, and neither is a
colour anybody typed.

**The edge is a SHADOW, because a gradient is straight.** A gradient stop
is a straight line across the whole box, so on anything round the top of
the bottom band is a CHORD. An inset shadow is bounded by the border
radius, so offsetting it down with a negative spread makes the band a
crescent that hugs the bottom arc. The rim is the same primitive at zero
offset: `inset 0 0 0 1px` traces the whole silhouette, corners included.

**Which means the material owns `box-shadow`, and that is only safe because
of `--surface-shadow`.** A later layer REPLACES box-shadow, which would
otherwise take fourteen focus rings and thirteen hover lifts with it. 44
rules set the token instead, the material's list ends
`var(--surface-shadow, 0 0 transparent)`, and a ring sits BESIDE the edge.

**`0 0 transparent`, never `none`.** A `none` is legal only as the whole of
box-shadow, so `var(--edge), none` is invalid at computed value time and
falls back to the initial value, which IS `none`: the edge vanishes from
every surface with no shadow of its own.

**And the edge opens as the thing leans towards you.** `--glow-a` is
already the "the pointer is on this" number, registered so it animates, on
the 190-in/820-out curve, so `--depth-lit` rides it and there is no second
piece of state: a card's edge goes from 5.7px to 9.2px. A plate and a
groove never raise it, because neither leans.

`box-shadow` is deliberately NOT in the material's transition list. The
edge is computed from a registered property that already animates, and
transitioning it as well starts a fresh transition on each of those frames.

**Three of the four describe the glass. `--standing` describes the
situation.** A lone button has to look pressable because nothing else says
it is; a row in a list does not, because the LIST is the affordance. The
block naming those classes is in `@layer glow` and its test is one
question: **would this ever be the only one of its kind on the page?**
Standing also drives the lit top edge, so it is what "flat top" means:
standing 0 is flat, a chip at 0.3 is a hint of a bevel, a pane at 1 is a
real one.

**The light comes up in 190ms and goes out in 820ms.** One property does
both, because a transition reads its duration from the state it is going
TO.

**Three of the six follow the pointer and three hold still**, and the still
ones say so with `--follows: 0` **on their class block**. Not with
`--glow-w: 0`, which the derived formula overrides at equal specificity,
and not on `[data-glow="pane"]`, which reaches almost nothing because the
material is applied by class. Both mistakes shipped, as 156px of moving
light on a `.stat` and 220px each on `.rail` and `.topbar`.

**INTERACTIVITY decides whether the light follows, not whether a thing is
in the system.** Everything is in it. A statistic is never pressed, so it
is a `plate`: the same weave, the same lit edge, a still light in the
corner. `--glow-w: 0` says that, and it is also what stops `glow.tsx`
tracking it, because a non-zero spread is the module's membership test.

**FUNCTION and SIZE both land on `--depth`**: a small piece of glass
carries a tight bright spot and a thick one diffuses it wide.

**As a surface gets thicker it must get less polished and less clear.**
`check-material.ts` asserts that ordering and names both kinds when it
breaks.

**A GROOVE is the sixth, and it is the inverse of the other five.** Not a
thinner plate: a channel cut IN, so the light runs the other way up, the
near wall in shadow and the far wall catching it. `--standing: 0` says it
in the system's own words. A segmented control is one too, so
`.audience-switch` is the groove and `.audience-slider` is a `control`.

**A class in the wrong list is the one way to get this wrong**, and the
test is not what a thing looks like. It is what happens when you press it:
a chip latches, a control acts, a card takes you in, a pane holds other
things, a plate is read, a groove is filled.

```sh
node scripts/check-material.ts          # every pressable class is placed
node scripts/check-material.ts --list   # what is on the system
```

It asks nine questions:

- **Is anything pressable off the system?** The first material reached 1 of
  203 surface-like classes, because it was scoped to an attribute only
  components carry.
- **Is anything SURFACE-SHAPED off the system?** Nobody presses a progress
  bar. A surface here is a class whose own rule gives it a ground AND an
  edge. Nested blocks are stripped first, innermost outwards: counting a
  `& .track { background }` reported 57 surfaces where there were 39.
- **Would the material take a surface's own gradient away?** A later layer
  REPLACES `background-image`. `--surface-image` is the way through and
  this fails on a class that does not use it.
- **Is the ladder still a ladder?** Thicker must mean less polished and
  less clear. `plate` and `groove` are skipped because their spread is
  zero.
- **Does a kind name a class that exists?** A kind can name a class the
  stylesheet has never had and read as though it covered something.
- **Is anything given a kind and never painted?** The taxonomy is three
  genuinely different lists: the paint rule is everything, the hover rule
  is only what follows the pointer, each kind block is one kind. A class
  can get four numbers and be left out of the paint rule.
- **Would the material take a surface's own SHADOW away?** What it loses is
  its hover lift and its focus ring. `--surface-shadow` is the way through
  and this fails on a listed class that sets the shorthand instead.
- **Is an exemption stale?** `NOT_A_SURFACE` holds the rows of controls and
  `NOT_GLASS` holds the marks, the grid cells, the fills and the text
  fields, both keyed by class with the reason, and both fail when the class
  is gone.

**`NOT_GLASS` has four arguments in it and they are different.** A MARK is
not a surface: a bevel on a nine pixel dot is detail nobody can resolve. A
CELL IN A GRID belongs to the grid: a year of days is 365 of them. A FILL
is what is IN a groove, so its own cut edge draws a channel inside a
channel. And a TEXT FIELD answers differently: its affordance is the caret
and the focus ring, and a lit resting rim on a box you type into is a box
that looks like a button.

### A material layer may set the light and nothing else

`@layer glow` names a hundred classes other layers define, and it has to:
the material is a property of what a thing IS, so it cuts across every
layer the way a theme does. What makes it the exception is that it CANNOT
do the damage the rule guards against, and `check-css.ts` proves that
rather than trusting it: `MATERIAL_PROPS` is the list, and it is short.

**`position` was on that list for one draft and that is why the list is
worth having.** A later layer saying `relative` overrides `fixed` on
`.rail` and on `.topbar`, dropping both into the flow and pushing every
page thirteen hundred pixels down. Position is geometry, so are
`isolation`, `z-index` and `display`, and none of them is the light.

### Eleven finishes, and a cast pattern is light and shadow

`data-glass` on `<html>`. The material above is what a surface IS; this is
what it is MADE of, and the reader chooses it on `/account` with every one
drawn beside its name.

Nine are cast glass and the names are the trade's own: **reeding is a run
of convex ridges and fluting is a run of concave channels**, so a reed is
lit on the flank NEAREST the light and a flute on the wall FURTHEST from
it. Backwards, a pattern reads as a printed stripe rather than as moulded
glass.

**Every one of them is two colours: a white at a low alpha and a black at a
low alpha.** Nothing names a hue, which is what lets one definition serve
both themes and all seven accents. Naming `--accent` freezes it at the
declaration site; a bump on green glass is green because the ground is.

**How much of it a reader sees is a knob, and it had to be.** It cannot
ride on `--depth`: **a custom property's computed value is the specified
value with `var()` ALREADY SUBSTITUTED, on the element the declaration is
on**, and `--glass-grain` names `--tex-hi` names `--tex-k` names
`--depth`, all four declared on `:root` where depth is 0, so it computes to
the same number on every surface. Declaring the chain on `*` is the way
through and costs tens of thousands of `color-mix` calls on a long page.
`--tex-strength` is the reader's knob instead.

**The paper is paper.** Three things at three scales: a wove TOOTH, which
is amorphous, out of five stipples at pitches sharing no factor, which is
the snow's trick in `@layer weather`; LAID LINES, fine and in one
direction, at a tenth of the strength; and FORMATION, the cloudiness a
sheet has from the way the pulp fell, at three hundred times the pitch of
the tooth. Five square grids at coprime WIDTHS still put every blob in a
row, because the vertical rhythm is the same in all five.

**A finish is three files and `check-glass.ts` holds them.** `GLASSES` in
`aab/src/prefs.ts`, a `[data-glass="<id>"]` block in `site.css`, and the
whitelist in the boot script. The third is the worst to get wrong: the
panel offers it, the stylesheet draws it, and the choice survives exactly
until the next page load, when the boot script writes `frost` over it.

**The trailing `auto` in the material's `background-size` is the LIGHT.** A
size list shorter than the image list repeats from the start, so a
nine-layer texture with nine sizes leaves the glow with the first stipple's
7x11 tile and the whole light becomes a 7px dot repeated across the
surface.

## Two kinds of card, and a reader can tell them apart

One card doing five jobs means the only way to find out which of them takes
you somewhere is to move the mouse. `@layer deck` has two, and
`components/deck.tsx` is the markup:

- **`<GoCard>`**, `data-kind="go"`. It takes you somewhere or does
  something. An accent rail down the left edge, an arrow that slides on
  hover, a lift, and the action written out at the bottom. It is an `<a>`.
- **`<InfoCard>`**, `data-kind="info"`. It tells you something and it is
  the end of the road. Dashed edge, quieter ground, no arrow, no lift. It
  is a `<div>`.

Neither can be the other by accident, which is the whole point of them
being two components rather than one with a prop. `<SoonCard>` is the third
state: promised and not written, a `div` for the same reason a chip that
goes nowhere is not a link.

## A card wears a scene, and the scene is made of tokens

`next/components/card-art.tsx` holds twelve SUBJECTS: coins, a chart,
sheets, a book, a pan, ridges, flashcards, an arch, bubbles, a gauge, a
calendar, a plate. `shared/nav.ts` names which subject each school, tool
and desk wears, so the board, `/skills` and the tools hub draw the same
picture for the same thing out of one table, and the Android app is sent it
like every other field.

**They are markup, not rasters.** A raster cannot answer a theme: light and
dark would mean two files each kept in step by hand, plus a build step, a
browser, a stamp file and 300 KB of binaries.

### A scene is a room, not a picture

Ten layers, back to front, each a different KIND of thing rather than the
same wash at another opacity:

| | |
| --- | --- |
| `art-sky` | the ground and the horizon |
| `art-weave` | the tooth of the material, a stipple |
| `art-halo` | the bloom the subject throws behind it |
| `art-rays` | shafts of light from the top left |
| `art-far` | the MOTIF: what is behind this subject |
| `art-floor` | the plane it all stands on |
| `art-stage` | the subject, and its reflection |
| `art-near` | motes in front of it, out of focus |
| `art-spec` | the highlight crossing the glass |
| `art-veil` | the corners going down |

They live inside `.art-space`, not inside the frame, and that is
load-bearing: the frame CLIPS, a clip flattens, and the room has to turn
inside something that is not turning.

**Six motifs, not twelve.** A motif is about the KIND of thing a subject
is: money and bubbles both belong in a field of orbits, a ridge and a plate
both sit against strata. Twelve would be twelve more drawings to keep in
step for a layer rendered at 62% opacity behind a 1.1px blur.

**`<Scene>` takes a drawing rather than owning one.** The seven case
studies each carry a sparkline describing that model.

**Three sizes, and each changes ONE number.** `band`, `tile`, `panel`. The
layers, the depths and the drawing are identical; `--art-throw` is what
differs, because a subject that slides 26px inside an 84px thumbnail slides
off its own floor.

### At night a thing is lit; on paper a thing is printed

A palette is not enough. Light ADDS: a glowing edge over black is brighter
than the black. Ink SUBTRACTS: nothing on paper is brighter than the paper,
so a bloom over white is invisible and the only way to say "this is in
front" is a cast shadow.

| | |
| --- | --- |
| `--art-bloom` / `--art-cast` | the glow and the shadow, each transparent in the theme it is not for, so one filter list says both |
| `--art-haze` | what a receding tone fades INTO: the dark at night, a warm grey on paper, because fading to white on white is fading into nothing |
| `--art-sink` / `--art-shade` | the ground, and it is a tinted PLATE on paper. Nine per cent of an accent over near-white is white |
| `--art-corner` | the vignette, which goes towards the accent on paper because a printed plate is darker at its edges from ink rather than from falloff |

**Which end a tone mixes towards is the rest of the trick.** A tone that
has to be SEEN mixes towards `--ink`. A tone that has to RECEDE mixes
towards `--art-haze`. Mix the wrong way and every drawing comes out as pale
as the paper.

**It is `.artwork`, not `.art`.** `.art` has been the icon beside a step's
name since the schools were written, at 1.6em square, in `@layer money`.
Taking the name makes every drawing on the front page 27 pixels wide.

**And a modifier handed to `<CardArt>` has to be two classes deep or
declared after `.artwork`.** One class declared first loses to `.artwork`'s
`position: relative` and 16:9 ratio, which draws a 540px stamp in the top
left corner of a card two thirds empty.

### The light is instant and the glass has weight

`glow.tsx` publishes two signals and they are deliberately not the same
signal.

`--gx`/`--gy` is WHERE THE LIGHT IS and is assigned from the event: a lamp
over a table is over the table the instant you move it.

`--gpx`/`--gpy` is HOW THE GLASS IS LEANING and is INTEGRATED towards the
pointer through a critically damped spring, because a sheet of glass has
weight. `DAMPING` is exactly `2 * sqrt(STIFFNESS)`, the one value at which
it arrives as fast as it can without crossing: softer drags, stiffer
wobbles. The loop cancels itself once the error and the velocity are both
under a threshold nobody can see, so a still pointer over a settled card
costs no frames.

`--gvx`/`--gvy` comes free out of that, and the specular stretches along
it.

**The strength is `--art-a`, registered `inherits: true`**, because
`--glow-a` is `inherits: false` and a layer inside a drawing reads 0 from
it for ever. Only the strength animates, never `translate` itself, or the
picture lags the hand.

**The event records and the frame writes.** `pointermove` fires as fast as
the pointer reports, a 1000Hz mouse reports sixteen times per frame, and a
screen draws once, so reading a box out of the layout and writing a
rotation back per EVENT is sixteen forced layouts and sixteen style writes
per frame for one picture. The rectangle is read inside the frame rather
than cached, because a cached box has to be invalidated by scrolling,
resizing, a font arriving and anything that reflows a grid.

**And both stand down while the page is scrolling.** `data-scrolling` on
the root, published by `glow.tsx` and read by `tilt.js`, which cannot
import across the wall. A reader scrolling with the pointer over the cards
is making ONE gesture, and it is asked for at the one moment a reader can
feel every dropped frame. Measured over a 3150px scroll with the pointer
moving:

| | before | after |
| --- | --- | --- |
| lean writes | 252 | 2 |
| light passes | 301 | 3 |
| style recalculations | 1340 | 30 |
| style recalculation | 260ms | 3ms |

With the page held still the same stroke still writes 265 leans and 301
light passes, which is the control that says the effect was fixed rather
than turned off.

## A photograph stands in a room too

**A photograph gets a room with no markup.** A figure comes out of the
database as `<figure class="..."><img><figcaption>`, through two
sanitisers, in three hundred stored bodies. There is nowhere to put a
layer. So the room is the two pseudo-elements a figure already has:
`::before` is the ground it stands on, `::after` is the glass in front, and
the photo is the stage between them.

**A figure is a GRID and all three are in cell one.** The ground and the
glass have to cover the photograph and not the caption, and positioning
them against the figure puts the words on a green plate. A pseudo-element
is a grid item, so the picture, the ground and the glass share row one and
the caption is row two: the row is exactly as tall as the picture, whatever
shape the camera made it. `figure.duo` opts out, because two photographs
side by side are a comparison rather than a thing on a plinth.

**The depth comes from the READER, not the pointer.** A photograph is read
rather than pressed, which here means a `plate` and a still light, and half
the readers of a long piece are on a phone. So the three layers move at
three speeds as the reader scrolls past, which is
`animation-timeline: view()`, runs on the compositor and needs no
JavaScript.

**`check-relief.ts` asks a fourth question**: every scroll-driven animation
has to sit inside a `prefers-reduced-motion: no-preference` block, or be
named in `TIED_TO_SCROLL` with the reason it IS the scroll rather than a
decoration of it. Two are: a bar that fills as the page moves is a
scrollbar, and a fade at the end of an overflowing row is an affordance
saying there is more.

It walks the stylesheet FORWARDS keeping a stack of what is open. Looking
backwards for the nearest guard is wrong: a guard that has already closed
is still the nearest one behind.

## Everything drawn ON a surface stands off it

`@layer relief` is the same idea one order of magnitude down. A card's
scene throws 26 pixels; a search button's icon throws two. Same light, same
pointer, same curve.

**`--lift` is not `--glow-a`**: it is a plain custom property set on any
hovered ancestor, so it inherits, and the figure multiplies the pointer by
it. Nothing transitions on the ancestor: a `transition` in a later layer
REPLACES the list underneath, so one on `:where(a, button)` would take the
hover colour off every link on the site. The figure owns its own
transition.

**A relief layer may move a thing and may never lay it out**, which is how
it earns the right to name classes other layers define. So `check-css.ts`
knows about both kinds, and the one word this layer may never say is
`transform`: `translate`, `rotate` and `scale` COMPOSE with whatever
transform the owning layer set, and `transform` replaces it. One line of it
naming `.art-floor` would stand every floor on this site back up with every
rule still reading correctly.

**The sign is what makes it one system.** `--gpx` is a VIEW direction, so a
scene slides each layer by MINUS its depth, and a figure standing off a
surface obeys the same arithmetic. The shadow then goes the other way from
the figure, because `drop-shadow` offsets from the ELEMENT and the gap
opening up between a thing and its shadow is the only cue saying it is
above the page.

```sh
node scripts/check-relief.ts --list   # what lifts
```

Three questions: does every name in the list reach a class; does everything
that lifts also STOP for a reader who asked for no motion; and is anything
in both the scene and the relief, which would move it twice against one
pointer.

## The front page is five bands, and the last one is the reader's

`next/app/(home)/page.tsx`. Every band is a lead and a set behind it, so
the page has a hierarchy rather than six bands of equal weight, and the
order answers the three questions somebody arriving has: what is this, is
it any good, where do I start.

| | |
| --- | --- |
| the door | who this is, what is here, and two ways in |
| the reckoner | one line of the site's own compounding model |
| the library | six courses, each wearing its own drawing |
| the work | seven case studies, each with its chart |
| the writing | the newest pieces |
| the tools | six things a reader can use today |
| the board | the reader's own, and only when they have one |

**A BOARD IS A READER'S, SO A STRANGER HAS NONE.** Three things make it
theirs and any one is enough: a lesson opened, a lesson ticked, or a board
they arranged. Until then the section is an invitation rather than an empty
one. A board drawn for everybody was 73 per cent of the laptop page, and
its lists of schools and tools 61 per cent of the phone page, which is the
rail drawn a second time on a page that already has one.

**`DRAWABLE` in `home/board.tsx` is four of the catalogue's twelve, and
what went is what the PAGE draws better.** They stay in
`shared/widgets.ts`, so the Android app keeps them: that split is the whole
reason `layoutOf` takes the drawable list as an argument. **A build that
cannot draw a kind must not delete it**, which is what `keepUndrawn` is
for.

**The audience switch moves a DOOR.** `DOOR.ways` is a pair of buttons per
audience, all three server-rendered and chosen by `data-hl` before the
first paint, exactly as the headline is.

**`DOOR.facts` is the ledger, and its five rows go to five different
places.** A list of exactly five whose whole job is to be five ways in
cannot spend two of them on `/skills`.

**`COUNTS.lessons` is the money school's and `COUNTS.libraryLessons` is all
four ladders.** Printing the first under the word পাঠ understates the
library by 144, and no check can see it: the check verifies that a slot
carries the number its key holds, never that the key means what the label
says.

**`/` is a prerendered file and must stay one.** `force-dynamic` makes
every visit to the most-hit page a Worker render, and takes
`next/interactive.test.ts` down with it silently: that harness serves
`.next/server/app/index.html` from disk and SKIPS when the file is not
there, so 217 checks covering every calculator report nothing at all. A
test that skips is not a pass. The writing band fetches, and what it draws
first is a real door to `/insights` rather than a skeleton.

### The reckoner, and why it has no JavaScript in it

`next/components/home/reckoner.tsx`. Five radios, five answers, and the
stylesheet shows the one whose radio is checked through the sibling
combinator. Not `:has()` and not a script: the page is prerendered, and an
interactive that needs hydration to answer is dead for the length of the
hydration.

**Nothing in it is typed.** The five answers are `compounding.run()` called
on the server, the same model `/tools` runs: a wrong number under a heading
about money is the one mistake this site cannot make. The line under them
says, in the reader's own language, that it is a calculation rather than a
guarantee.

It has no storage key, so there is no row for `shared/storage.ts` and
nothing for `sync.ts` to carry: what a reader tapped there is not something
they MADE.

## One thing is one card

A school, a piece of writing, a lesson: one row must not be three shapes
depending on which page a reader is standing on. All of them are
`<GoCard>`. A list of things that exist elsewhere is built from the shared
table, and so is the CARD that draws one. A new kind of card is a second
answer to a question `deck.tsx` has already answered.

`art` puts a scene across the top of one; `cover` puts a photograph there
instead, for a piece that has its own. Never both: two pictures on one card
is two answers to the same question.

**A card in a DECK gets a scene; a rung in a LADDER gets the relief.** A
lesson card, a ladder row and a market headline are rows of a list, and
thirty 16:9 scenes down a stage page is the cage the plate was invented to
stop. They get the light and the depth on their own icon instead.

## A row that is not in the rail still gets a picture

`shared/nav.ts` names a subject for the twenty things the rail lists. It
cannot answer for the two hundred that are rows. Choosing one each by hand
means the newest thing on the site is always the one without a picture.

`shared/art.ts` DERIVES one, out of the tag, the topics and the section a
row already carries, plus a hash of its id. In order: a tag that names a
subject wins outright, then the desk's own POOL, then prose. A pool rather
than the desk's subject flat, because falling straight through makes a hub
of twenty pieces twenty copies of one drawing.

The colour is the section's own two times in three, and one of six others
otherwise. High on purpose: a hub whose cards are eight colours is a fruit
bowl and a hub whose cards are all one colour is a spreadsheet.

**The hash needs its finaliser and the reads need the top bits.** FNV-1a
avalanches badly in its LOW bits and every use here is a `% n` against a
small n: fourteen consecutive slugs picked index 0 or 5 out of a pool of
six. The xorshift-multiply finaliser spreads entropy downwards; `frac()`
then reads the top bits, which moved "two in three" from a measured 72 per
cent to 66.

## The site says a few things out loud

`next/lib/sound.ts`, and there is no audio file in this repository. Every
cue is synthesised: a few oscillators, an envelope and a low-pass. A
committed `.mp3` cannot be diffed, has to be fetched, has to be licensed,
and would be the second binary asset on a site that deliberately has none.

**Every note is a degree of a D major pentatonic**, which is why two cues
firing at once cannot sound wrong: there is no semitone in the scale, so no
interval available clashes. `HZ` is that scale and nothing may play a
frequency outside it.

| | |
| --- | --- |
| `press` | a button. The one a reader hears hundreds of times, so a tenth of the others |
| `tick` | a checkpoint inside a lesson |
| `lesson` | a lesson finished: the triad, rising |
| `stage` | a whole stage, with the root held under it |
| `next` / `prev` | a page turned, as a glide |
| `saved` | a setting kept |
| `refused` | the only one that falls |

Three things keep it from being annoying, and all three are load-bearing:
the master gain is low and a press is a tenth of a finish; every cue is
under 400ms; and the attack is 6ms with a long release, because a square
edge on either end is a click.

**The context is built inside the first cue and never before.** An
AudioContext made at import time starts suspended under every autoplay
policy, so the first cue is silently dropped; building it inside the first
cue means the first cue IS the gesture.

**`data-sound` on `<html>` is the switch**, set before the first paint by
the boot script and kept by `aab/src/prefs.ts`, so asking "is this allowed"
inside a click handler is a string comparison rather than a JSON parse out
of localStorage. It is ON by default: nothing can fire on a page load
anyway.

Anything under `next/` calls `cue()`. Anything that cannot import across
the wall dispatches `reiad:sound` on the document, and
`next/components/sound.tsx` listens. An element carrying `data-cue="next"`
fires that cue when pressed, which is how a server-rendered prev/next link
asks for one without a handler.

**A cue on a LINK is cut short and that is why they are 110ms.** A link
navigates, the document is torn down, and every scheduled note goes with
it.

## The reader's own sky, behind the page

`next/components/weather.tsx` and `functions/api/weather.ts`.

**The browser never talks to the weather service.** The same rule the
broker follows and for the same two reasons: `connect-src` is `'self'`, so
the fetch would be blocked before it left the page, and one caller is the
only place that can cache honestly. `check-csp.ts` scans every string in
`aab/` and `next/` and would fail on that hostname appearing in either.

**Two decimal places, rounded in both places.** About a kilometre: enough
to know whether it is raining, nowhere near enough to find a house. Doing
it in the browser AND in the Worker is one place too few doing it, given
that a coordinate is the most personal thing this site handles. It is also
what makes the edge cache work.

**`Permissions-Policy: geolocation` must be `(self)`, never `()`.** An
empty allowlist is not "ask the reader": it is the page telling the browser
not to have the API. No prompt appears, `getCurrentPosition` fails at once
with PERMISSION_DENIED, and a reader who grants location in their own
browser settings is told on reload that their browser said no. It is in two
header lists that `check-headers.ts` keeps in step.

**Two ways in, and the second is not a fallback.** A browser can refuse, a
desktop can have no radio, a work laptop can have it off three levels up,
and a reader can simply prefer to say where they are.
`/api/weather/place?q=` searches Open-Meteo's place index through the same
Worker for the same two reasons, and a chosen town is kept under the same
key with a name on it. `askForPlace()` answers with four states rather than
a boolean, so a policy failure is distinguishable from a person saying no.

**`weather-place` is deliberately not synced.** Every other key
`aab/sync.js` carries is something the reader MADE. Where somebody is
standing is not that, and a phone in Dhaka and a laptop in Brighton are two
places.

Seven skies, because seven is what can be told apart behind a page of
prose, and the Worker does that reduction from the WMO codes so the drawing
never sees a number. `@layer weather` is the whole of the drawing:
gradients and keyframes, no canvas, no loop, and `display: none` when there
is no weather.

**It is BEHIND the page, at `z-index: -1`, and two facts elsewhere hold
that up.** Nothing gives `<html>` a background, so body's `--paper`
propagates to the canvas and body paints no box of its own; and nothing
gives body a stacking context. Give it either and the weather VANISHES on
a page that renders perfectly. `.home-aura` is the same arrangement one
element down.

**Five layers: the wash, three depths, and the light.** Two of anything is
a sheet rather than a sky. `wx-far`, `wx-mid` and `wx-near` are the same
weather at three distances, the near one always larger, faster and softer
at the edges. THE SOFTNESS IS IN THE GRADIENT STOP AND NEVER IN A `filter`:
everything that moves here moves a background, so a blur on one of those
layers is a whole window re-blurred every frame. `fog` is the exception and
keeps its blurs, because a fog bank slides on `translate` and a translated
raster is not redrawn.

**A drop is an ellipse and the slant is on the layer.** A repeating stripe
under a mask cut ACROSS it moves while the mask does not, so a drop appears
and disappears at the same place on the screen for ever. It is a tiled
radial gradient, with a head and a tail, on a layer carrying the wind angle
as its own `rotate`. That is why the fall is `background-position` rather
than `translate`: a background is positioned in the element's OWN rotated
space, so moving it down by exactly one tile height is a drop falling along
its own line.

**A cloud tile is as tall as the layer.** Only the width tiles. A tile
620px tall repeats DOWN the page, so a bank drawn in the top quarter is
drawn again under the reader's feet: the `100%` in each cloud's
`background-size` is what fixes that. A cloud is a cluster of puffs rather
than one wide ellipse, because a 220 by 44 gradient is a smear whatever its
falloff.

**The wash and the light are placed against the WINDOW; the three depths
are 24 per cent bigger than it.** The depths need the overscan because they
rotate and slide. The other two must not have it: a gradient is positioned
inside its own element, so a sun at `87% 4%` of an oversized layer is a sun
off the top right corner.

**Nothing flashes.** `storm` would ordinarily be lightning and deliberately
is not: a bright frame on a dark page is a seizure risk. It is heavier,
steeper rain and a slow eight-second bloom.

**Three tilings at coprime sizes is what makes snow snow**, and they are
the three depths rather than three images on one layer. One tiled dot is
wallpaper: the eye finds the lattice in about a second, and periods sharing
no factor line up again only past the far side of any screen.

**Stars are drawn where they can be seen**, which is `--wx-star` and a dark
page: there is no colour that reads as a star against paper, so a light
theme at midnight gets the blue wash and no dots. Turning off the twinkle
alone leaves the dots there.

**A reader who asked for contrast has asked for the opposite of this**, so
the honest answer to `prefers-contrast: more` or
`prefers-reduced-transparency: reduce` is no sky at all.
`prefers-reduced-motion` keeps the sky and stops the movement.

**`--wx-a` on `.weather` is the one knob.** Every opacity in the layer is a
fraction of it.

## What a reader has read

`next/lib/progress.ts`, and the storage keys in it are the ones already in
real browsers and in real accounts: `learn-read`, `deutsch-read`,
`english-read`, `quran-done`, plus a `-last` bookmark each, and a `-checks`
set each since checkpoints. **Do not rename one.** `aab/sync.js` maps the
same names, and changing a key does not move somebody's ticks, it loses
them.

**The ladder is the server's and the ticks are the browser's.** Every id,
title and URL a progress component works with comes down as a prop from the
route that read the rows. It decides one thing per lesson, whether there is
a tick, and it renders nothing at all on the server. A lesson that is not a
page must still be tickable, and a bookmark stores an id rather than a URL,
so a lesson that moves does not take the bookmark with it.

Opening is not finishing. A visit moves the bookmark; the tick is a button
the reader presses.

**Anything drawing a number out of those keys subscribes, and `subscribe()`
listens for three things.** The same-tab event, the cross-tab `storage`
event, and `sync:done`. The third is the one that matters for a signed-in
reader: `aab/sync.js` writes the account's rows straight into localStorage,
which fires neither of the other two, because `storage` only fires in OTHER
tabs. Without it every meter is drawn against what storage held BEFORE the
exchange, and stays there. A component that reads one of these keys ONCE,
on mount, has the same bug whether or not it also redraws.

### The money school's ticks were written and never drawn

`readKeyOf` and `lastKeyOf` are exported from `next/lib/progress.ts` and
there is one copy of the mapping. A component keeping its own copy and
asking for `${school}-read` asks for `money-read` on the money school, and
there has never been such a key: the school moved from `/learn/` to
`/money/` and its key deliberately did not.

Every component that DREW a tick then reads an empty string: no tick button
lights up, every meter reads nought per cent, "where you left off" always
offers lesson one. `next/progress.test.ts` covers the store and the store
was right; `aab/schools/progress.test.ts` reaches the three schools whose
tick is a served module, not this one. `next/tracking.test.ts` presses the
button.

### One table says what a browser is holding

`shared/storage.ts`, and `scripts/check-storage.ts` is what stops it
rotting. Grepping for `localStorage` is archaeology rather than a
description.

Every row says what the thing is in a sentence a reader could read, which
of seven kinds it is, and whether it leaves the machine. The kinds are
about the READER: something they DID, something they MADE, something they
CHOSE, a fact about this machine, a credential, a cache, or something left
over. Those answers decide whether it should sync, whether erasing an
account should take it, and whether it is worth keeping at all.

The check asks four questions, and the third is the expensive one: **a row
that says it syncs and is not in `KEYS` in `aab/src/sync.ts` is a promise
the account page makes and the account does not keep.** The reader finds
out on their second device, and nothing anywhere says so. The first two it
found were `deutsch-schrift` and `english-write`, which hold the sentences
a learner types into the practice books.

```sh
node scripts/check-storage.ts --list   # what is held, and what travels
```

### A map needs its own rule, and `mark` is not it

`where-read`, `tools-used` and the two practice books are maps of entries
rather than one value. A `mark` takes the newer WHOLE object, so a phone
that read one article throws away every position a laptop recorded.

`merge` reconciles entry by entry. An entry that carries its own `ts`
answers for itself; **an entry that is a plain value falls back to the
map's own stamp**, which is what lets the practice books be carried without
rewriting a value that has somebody's sentences in it. The fallback costs
the one case where the same day was written on two devices, where the
tiebreak is which device wrote last about anything. Every other case is
exact.

### Where in a piece, and it is not a scroll offset

`next/lib/progress.ts` and `next/components/where.tsx`. A tick says a
lesson is finished and a bookmark says which lesson was open last; neither
says the thing a reader wants on a two thousand word piece read over three
evenings.

**Not an offset.** That number is a fact about a window: it moves with the
type size, the measure, a photograph's height and any edit to the prose.
What is stored is the INDEX of a block, the first forty characters of it,
and how many blocks there were. The signature is what survives an edit: a
rewritten piece gives up rather than sending somebody to the wrong
paragraph, and a single inserted paragraph is looked for either side of the
index.

**It never jumps on its own.** One quiet control, in the `.piece-tools` row
that already exists, and only when there is somewhere to go.

Three ways of getting it wrong all render a button, which is why
`next/tracking.test.ts` is written as what a reader would notice:

- a way back to somewhere already on screen,
- a way back to the end of a piece they finished. **"The last block is
  above the line" is not the test for finishing**: at maximum scroll the
  last paragraph sits near the bottom of the window and can never rise to a
  line a third of the way down, so a reader who read to the end keeps a
  position at about ninety per cent. The bottom of the document is the
  test,
- a way back to the wrong paragraph.

**Forwards-only belongs to the component, not to the store.** Only
something that knows what a visit is can tell scrolling back up to check a
figure from opening the page again tomorrow to reread it. A guard in the
store that compares the signature as well as the index never fires, because
the signature is of the block AT that index and changes on every step.

### Which tools, and never how many times

`tools-used` is a timestamp per calculator, recorded by the shell wherever
the page's rail key is in `TOOL_KEYS`, which is derived from
`shared/nav.ts`. So a sixth tool is recorded by being added to that table.

**A timestamp and not a count.** A count cannot be reconciled between two
devices without a per-device log: a phone that says five and a laptop that
says five are either ten openings or the same five seen twice.

### Progress belongs to the account, and the browser is a mirror

`aab/sync.js`, and the whole of it is one sentence: **the account is the
record, and nothing is ever pulled out of the browser into it.**

| | |
| --- | --- |
| signed out | nothing. No request, no listener that fires, no storage touched. Progress is this browser's and every page still works. |
| signing in | the account's rows are written on to the device, and any synced key the account does not have is removed. What the browser held first is not merged and not uploaded. |
| signed in | the device is a mirror. A tick here goes up; a tick on the phone comes down. |
| signing out | the mirror comes off, so the next person at the same machine does not inherit somebody's ticks. |

A browser is not a copy of an account: it may be a library machine or a
phone handed over for five minutes, and the site cannot tell. Merging the
two forces a dialog asking once per account per browser what should happen
to what was already there.

Two signed-in devices still need reconciling and that is the one merge
left. `base` is what the account said at the last exchange, so
`local \ base` is what this reader did and `base \ local` is what they
undid, and the value written back is `(remote ∪ added) \ removed`. There is
no special case for a reset: every school's `resetAll()` REMOVES a key
rather than emptying it, an absent key is an empty set, and subtraction
takes the account down with it.

`aab/sync.test.ts` is the guard, 36 checks in a real browser against a
routed Supabase, and it drives `/404.html` because that is one of the two
pages still served as a file.

**It starts its own server, and that is the whole reason it is worth
anything.** A test that asks for a server on :8899 and exits 0 when there
is none skips on every machine where nobody read that line. A test that
needs a server started by hand is a test that does not run.

### One table is readable by anyone, so its read names the reader

`public.profiles` is the only table here whose select policy is
`using (true)`, and that is deliberate: a comment shows its author's name
to somebody who is not signed in, and the name is the whole of what the
table holds. Every other table is `auth.uid() = user_id`, so a read with no
filter returns your own rows and nothing else.

**That makes `profiles` the one read where the filter is load bearing
rather than a second lock.** `getProfile()` asking for
`profiles?select=...&limit=1` gets whichever row the planner reached first
out of the whole table. With one account that is always the right one. With
two it is worse than a coin toss: a non-HOT update moves a row to the end
of the heap, so SAVING your profile is what makes the next read return
somebody else's, and `setup_at` coming back null puts the setup form back.
`saveProfile` carries `id=eq.<me>` even though the policy already makes it
impossible to touch anyone else's row.

`next/account.test.ts` is the guard. **A fixture that is more forgiving
than the thing it stands in for is not a test**: a fake answering every GET
on `profiles` with the reader's own row passes 117 checks against a page
drawing the wrong person. It holds a second row now and returns it first
when the filter is missing.

### The two things an account holds that are not a tick

`aab/saved.js`, and two tables in
`supabase/migrations/20260817120000_scenarios_targets.sql`, both behind the
same row-level security `progress` has.

- **`scenarios`** is a filled-in calculator under a name. The stock check
  stores its own query string, which is the format it has shared analyses
  in since it was written, so opening a saved check is a link rather than a
  restore and there is one encoder.
- **`targets`** is a goal with a number on it, and the three kinds are
  three sources of progress that already existed: a `course` reads the
  reader's ticks, a `habit` reads `days-active`, and a `metric` is a number
  this site cannot see, so the reader types it in. **A fourth kind has to
  pass that test**: if the site cannot measure it out of something it
  already holds, the bar would be a decoration.

Neither has a local copy. Progress has one because four schools have read
localStorage since before there were accounts and a reader with no account
still gets all of it. Nothing here works signed out.

### The Research Studio, which replaced the desk

`/tools/research`, and `RESEARCH.md` is the plan: seventeen rooms in one
pages table, `research_*` tables in Supabase under the same row-level
security everything above has, the outside world reached only through
`functions/api/research/`, and a check of its own. Two of that plan's
rules: a save is one write and cannot half-succeed, and nothing is typed
that could have been picked.

**Every row is the reader's own and the browser is the caller.**
`next/lib/research-api.ts` reads and writes PostgREST with the reader's own
bearer, exactly as the diet tool does, and every write it makes is a line
in `research_activity`, written by the one function every write passes
through so nothing can forget to log itself. A patch carries the
`updated_at` it last saw, and zero rows changed is shown as a conflict
rather than silently won.

**CSL-JSON is the record.** A source is stored whole in that shape and the
columns beside it are copies filled by `fieldsOf()` in
`shared/research.ts` on every write, so every citation style is a rendering
rather than a migration. A citation key is made once and never regenerated.

**The keyboard is `f`, `n`, `j`, `k` and `c`, and `/` is still the site's.**
`next/components/research/keys.ts` refuses to bind one of the site's own at
bind time, because a shortcut that collides does the other thing.

### What else an account is for

Five things, and each one had to pass the same test the three settings
questions pass: it changes something the reader can point at.

- **A reading list and notes.** `next/components/keep.tsx` puts a Save and
  an Add a note under the byline of every piece and every lesson, and
  `public.library` is **one row per person per page**, with `saved` and
  `note` as two columns of it. A trigger removes the row once both have
  gone, so the list can be counted rather than filtered.
- **Reading preferences.** `aab/src/prefs.ts`: the type size, the measure,
  the theme and which language the calculators open in. **Every option
  draws itself**, out of the same tokens the site is made of, because a row
  of chips reading "Frost", "Paper", "Thin reed", "Linear ridge" is a
  reader being asked to imagine eleven materials from their names.
  `next/components/account/pref-swatch.tsx` is the drawing and it names no
  finish: `[data-finish]` in `@layer tokens` is what lets a swatch wear a
  material the document is not wearing, so a finish added tomorrow draws
  here without that file learning about it. A swatch is a WINDOW rather
  than a square, because half of what a finish does is to what is behind it
  and a blur is only visible on an edge.
  **`@layer glow` sets `--glass-grain: none` on every descendant of a
  surface**, so a chip is a surface and eleven swatches inside eleven chips
  are eleven identical rectangles. `:not([data-finish])` is the one
  exception and it is this panel's.
  **`savePrefs` SPREADS.** Naming fields by hand drops whatever arrives
  later: `texture` applied to the page and was gone on the next load, with
  the panel saying Strong and `readPrefs` coming back with Normal. Same
  rule as `/api/site` one floor up. Applied before the first paint by the
  boot script in `next/components/shell.tsx`, carried between devices by
  `sync.ts` under `reader-prefs`, and the language one writes `tool-lang`,
  which the stock check has read since long before accounts. One choice,
  one key.
- **A year of days**, drawn from `days-active` on the account page. No
  flame, nothing red, nothing counting down.
- **Take a copy of everything.** One JSON file with everything the account
  holds in it. Leaving should be as easy as arriving.
- **Erase everything**, which means the account and the mirror.

`next/account.test.ts` is the guard: 168 checks in a real browser against a
routed Supabase.

#### Those two buttons are lists, and a list goes stale

**Every table a reader owns goes into BOTH halves in the commit that
creates it.** `DIET.md` section 30 said that in prose, and the prose was
there and it was broken anyway. Four of the reader's own tables were in
neither button:

| | |
| --- | --- |
| `routines` | the shape of somebody's week |
| `routine_entries` | a year of what they actually did with it |
| `routine_templates` | the ones they made, as against the ones the site ships |
| `broker_tokens` | their broker key |

Both buttons worked, the copy downloaded, the erase reported success, and
what came back was five sixths of an account. **An export that is silently
short and a complete one look identical**, which is why this is a check
now:

```sh
node scripts/check-account.ts --list   # what leaving carries, and what it does not
```

It reads the migrations for what a reader owns rather than being told,
taking `user_id` OR `owner_id` referencing `auth.users`, because the same
fact spelled differently is how the templates table slipped out. It reads
the two halves of `aab/src/account-page.ts` **separately**:
`"broker_tokens"` is named in both, so grepping the whole file says nothing
on the commit that takes it out of one. And where a carrier is a list, it
reads what is IN the list, because `PAGE.includes("MINE_TABLES")` is true
whatever that list holds.

**A table not erased says so, in one sentence, keyed by the table.** There
is one: `profiles`. The display name is what puts an author beside a
comment that is already published, and erasing it would leave those
comments attributed to nobody rather than removing them. A comment lives in
D1 behind the moderation queue and is not this button's to delete.

**And the confirm has to keep naming what goes.** A reader pressing OK
agreed to that sentence rather than to a list in a source file, so the
check fails if the erase clears something the sentence does not mention.

### One section on screen

`/account` is one section on screen at a time. Neither this paragraph nor
`next/account.test.ts` counts the sections: the test names them and asserts
the strip and the panels are the same set.
`next/components/ui/tab-panels.tsx` is the calculators' arrangement in
React, and the four decisions in it are the four that make a
`role="tablist"` honest:

| | |
| --- | --- |
| the fragment chooses | a link from the account menu straight to `#reading-list` opens that panel rather than scrolling to it, and `hashchange` keeps that true |
| `replaceState`, never `location.hash =` | assigning pushes an entry per press, so Back walks the strip, and it scrolls the panel under the sticky bar every time |
| arrows, Home and End | with a roving tabindex, so the strip is one tab stop |
| **nothing hides until it has run** | the panels render open and the first effect closes them. Hiding in CSS alone is a page that shows one section and seven buttons that do nothing |

The strip is `.topbar` again: the same pill, the same glass, the same edge
and shadow, one `--top-gap` below it and inside the page's own column.

`[data-panels="on"]` is how the stylesheet knows a section is the only one
on screen, so it drops the `--step` leading that separates sections on a
long page. `body[data-tool-tabs="on"]` is the calculators saying the same
thing one level down.

**The panels are built on the server and handed over as a prop.** A client
component's children are serialised into the payload rather than
re-rendered in the browser, so making the strip interactive does not make
eight sections of markup the browser's job.

### The account menu is a popover, not a dialog

`aab/src/signin.ts`. `showModal()` dims the site and takes the focus for
"which account am I on" and "go to my reading list", neither of which is a
decision the page cannot continue without.

`popover="auto"` brings the top layer, light dismiss, Escape and the focus
return, so this file implements none of the four. CSS anchor positioning
places it where the browser has it, and the two custom properties are the
fallback where it does not, with the scroll listener added **only** in that
case. Below 640px it is a sheet against the bottom edge, decided by a media
query.

### Checkpoints, which are the ticks inside a lesson

`aab/checkpoints.js`. A lesson's own tick is about the whole page; a
checklist inside the prose is five things a reader does over a fortnight.

It **invents no markup**. `.checklist` is an article block that has been in
`@layer article` and in both sanitisers since the Studio was written, so
every checklist in a school lesson becomes a set of checkpoints and a
checklist anywhere else stays a list. A checkpoint is `<lesson id>#<n>`,
filed under `<school>-checks` and carried by `sync.js` like every other
tick. Position rather than text, because prose gets edited and a checkpoint
that forgot itself over a fixed typo is worse than one that stays put when
a line is reworded.

It is **not** counted towards a ladder anywhere: a checkpoint is not a
lesson.

### Three schools, one engine

`aab/schools/progress.js` is the browser's half of that, and
`aab/schools/hub.js` is the drawing around it. Both are shared by the
German, English and Quranic Arabic schools.

What a school still owns is its ladder, its words and its ladder row: a
Stufe shows sections and a book, a ধাপ shows days, a term shows neither,
and folding those three into a config would be a bigger knot than three
readable copies. A row is drawn by the school; everything around it is
shared.

Two tests cover different halves. `aab/schools/progress.test.ts` is the
arithmetic and the keys; `aab/schools/hub.test.ts` is the drawing, and it
builds all three hubs in a real DOM against the markup out of
`next/lib/school-hubs.ts`, because a hub that renders and is not finished
looks exactly like one that is.

**The practice books are the same arrangement.**
`aab/schools/workbook.js` is one engine, and
`aab/schools/workbook.test.ts` is what says it works: a book that keys on
`.wb-day` and `[data-wb-write]` where the component renders `.buch-tag` and
`data-schrift` saves nothing and ticks nothing, and a top-level
`document.getElementById("tage")` on a route with no such element throws
before the first function runs. Both render perfectly.

**Every storage key is passed in by the school, spelled the way it has
always been spelled.** That is the whole reason the engine takes them as an
argument rather than deriving them from the school's name: `english-day` is
not `english-tag`. `aab/schools/progress.test.ts` asserts all ten by name.

That covers the ID SHAPES too. A day's tick is `term-1/day-3` in English
and `stufe-1/tag-3` in German, both from the school's own `curriculum.js`,
so `dayId` is an argument like every other key: build one shape for both
and a day can be ticked and come back unticked.

The money school is not a caller. Its ticks are `next/lib/progress.ts`,
because its pages are routes. These three still need a browser module for a
different reason: a practice book is a page a learner TYPES INTO, and what
they type is theirs and the browser's. The book is a route and
`workbook-body.tsx` loads the engine through `SiteScripts`.

## A piece is a page, not a console

**The measure is a LENGTH and the setting counts WORDS.** `ch` is the
advance width of the "0" glyph, a fact about a font rather than about a
script, and this site is written in two. Measured in a browser against the
site's own rows, `66ch` is 671px, and 671px holds a median of 116 Bengali
characters and 18 words where the English half got 78 characters and 13.

So `--measure-base` is a length, `html[lang="bn"]` carries its own, and the
reader's three steps are a MULTIPLIER (`--read-wide`) so one control moves
both scripts and the boot script needs no idea which page it is on.

| | Latin | Bangla |
| --- | --- | --- |
| `--measure-base` | 34rem | 26rem |
| words a line, measured | 11 | 11 |

The note beside each step says words, because words is the thing
Bringhurst's 45-to-75 was always a proxy for and the only number that means
the same in both scripts. Bengali letters are narrow and tall where Latin
is wide and short, 0.36em against 0.5em across and 0.64em of ink against an
x-height of 0.475em, which is why the two bases differ and also why Bangla
is NOT set larger: at one size it already carries more ink than Latin
lowercase.

**`next/reading.test.ts` measures all six combinations against real rows**,
in a real browser, off the line boxes themselves.

**The column is centred, and it is the WRAP that is capped.** Capping the
paragraphs inside a 1080px box sits every line hard against the left of
four hundred empty pixels. `:has()` rather than a class on the two routes,
so a third page that renders a column of prose is a page without anybody
coming here.

**A table and a photograph are not prose and leave the column.**
`--read-out` for a wide figure and a table, capped at 1080; the uncapped
`--read-edge` for a full-bleed photograph, which means edge to edge.

**`100vw` is the WINDOW and the page is not.** `figure.full` at
`width: 100vw` with a `50% - 50vw` margin runs 131px under the rail on a
desktop and puts 143px of horizontal scroll on every article that has one.
Both tokens subtract `--rail-w`, and `:root { --rail-w: 0px }` inside the
phone media query is part of that fix: the rail is a drawer below 900px and
the token otherwise goes on reading 268px, which `.shell-col` and `.topbar`
each hide by overriding their own use of it.

`100vw` still includes a scrollbar that the page does not, so
`main:has(:is(.article, .term-article))` carries `overflow-x: clip` and the
few pixels of overhang are clipped rather than scrolled. `clip` and never
`hidden`: hidden makes a scroll container, which gives the page a second
scrollport and breaks `position: sticky` inside it.

### The reading hush

A hub is a place to choose and its fourteen destinations are the point. A
piece is one column of prose: measured, fourteen focusable things sat
between the top of an article and its first sentence.

So the furniture goes quiet once the reader is past the heading and comes
back the moment they reach for it. Nothing moves, nothing is removed,
nothing leaves the tab order, and no layout changes.

**It is the scroll POSITION, not a timer.** A "they have stopped scrolling"
tail flashes the rail on and off with every wheel notch. It is
`animation-timeline: scroll()`: no listener, no rAF, no state, and nothing
at all while the page is still. `check-relief.ts` knows it by name in
`TIED_TO_SCROLL`, like the progress bar.

**Two numbers, because an animation beats a plain declaration.**
`:hover { opacity: 1 }` over an animated opacity does nothing. `--hush` is
animated and `--awake` is not, they multiply, and neither ever contests the
other.

**The noise is the COLOUR, not the words.** Twelve destinations each with a
filled lozenge in its section's hue is a row of traffic lights down the
edge of a page of prose. The marks come down by 0.55 and the panel by 0.2,
which is a stronger hush and a better contrast ratio at once: measured on
the rendered pixels of a nav label, an even fade reaches 4.82:1 in light at
0.35 and 3.82:1 at 0.42, and 4.5:1 is the line. At 0.2 the label sits at
7.9:1. `reading.test.ts` re-measures both themes.

**`:focus-within` is not optional.** Nothing in a rail can be reached by
hovering a pointer that is not there, and a rail that stays dim under a
focus ring is unreadable to anybody tabbing through the site.
`prefers-contrast: more` and `prefers-reduced-transparency: reduce` switch
the whole thing off.

### And the small things that were wrong

- **The separator belongs to the thing in front of it.** A byline of
  `<span>` items with `<span class="dot">` between them wraps with a dot
  hanging off the end. It is an `::after` on every child but the last, so
  it wraps as one piece by construction.
- **One row of tools, not two bands.** `.piece-tools` holds `<Keep>` and
  `<ReadAloud>` on the byline's own line.
- **The speed slider only exists while it is speaking.** Nobody knows a
  voice is too fast until they have heard it.
- **A paragraph gap of 15px under a Bangla line-height of 1.9 is 0.49lh**,
  LESS space than there is between two lines of the same paragraph. It is
  `0.78lh`, said in `lh` so it stays right in both scripts and at all three
  type sizes.
- **A heading has to be findable at speed.** 1.35em on a 16px body is a
  paragraph in bold.

## A lesson has twelve kinds of block, and one of them answers back

`shared/lesson.ts` names them and `next/components/lesson/block.tsx` is the
registry. Eleven of the twelve have the reader CHOOSING: an option, an
order, a bucket, a slider. The twelfth has them typing.

### A sheet, which is a table with holes in it

`shared/lesson-grids.ts`. A cell is `given`, `input` or `calc`. A grid of
`input` cells carrying `expectSay` is a drill and a grid of `calc` cells is
a spreadsheet, and **they are the same object because they are the same
thing**: a table with holes in it and a rule for what belongs in each hole.

That is what let the three language schools have an interactive at all.
Measured before this: 81 of the money school's 110 lessons carry a block,
and **deutsch, english and quran carry nought between them**, because a
multiple-choice question was the only thing a language lesson could hold.

**A `calc` names cells and one operation out of six.** Not an expression
string: an expression has to be parsed, and a parser that takes arithmetic
out of a database row is an evaluator with a database in front of it.

**Two passes rather than a toposort**, and the second one is tested even
though all six sheets would answer without it: a model is a table somebody
writes, so a total ABOVE the things it totals is a thing somebody will
write.

**`fmt` is per cell as well as per sheet.** A profit and loss account is in
taka down to its last row, which is a margin in per cent. One format for
the whole table writes that row as `15`.

**A cell is named by its row header**, not by a label of its own. `<Field>`
is this site's answer to an unlabelled box and it is the wrong answer
inside a table: `aria-labelledby` at the `<th scope="row">` is a stronger
association than a `<label>` beside the box, and a hidden label as well
would announce the same words twice. `check-components.ts` skips an input
carrying that attribute.

**And `@layer lesson` resets the header casing.** `@layer article` sets
every `th` in a table to uppercase mono, which is right for a column of
figures in prose and wrong for a row label that is a word in another
language: it renders the German present tense as ICH, DU, ER, and `ich` is
lowercase in German.

**A table inside a block does not break the column.** The full-width rule
added for a table in prose reaches this one too and paints a sheet three
hundred pixels past its own card on both sides. `:not(.ls-block *)` is the
exclusion: a block is a card, and a table inside one that leaves the column
leaves the card.

### Two curves that cross

`supply-demand` in `shared/lesson-labs.ts` is the first model that plots
two lines against each other rather than one thing over time, because a
price is not a number somebody sets: it is where two willingnesses meet.

The x axis is PRICE and the two series are quantities, which is the
transpose of a textbook. A textbook puts price up the side because it is
drawing a mathematical relation; a reader who has never seen one reads a
chart left to right.

**The crossing is solved, not read off the chart**: `run` walks the price
axis and interpolates where the gap changes sign, so the number under the
drawing is the answer TO the drawing rather than a second calculation that
could disagree with it. And **no market is a quantity of nought, not a
price of nought**: a market can report a price of 40 with nothing changing
hands.

## The blocks an article is made of

A piece can hold a box of quick answers, a note in the margin, numbered
steps, a checklist, a row of key figures, a note, a worked example and a
scrolling table. Each one is plain HTML with a class on it, and that class
has to be in three places or it does not survive the trip:

1. a rule in `@layer article` in `next/styles/site.css`,
2. `KEEP_CLASSES` in `aab/editor.js`, the browser's sanitiser,
3. `ALLOWED_CLASSES` in `functions/_lib/sanitise.ts`, the server's.

`check-css.ts` fails if the two allowlists disagree, if a class is allowed
into an article and styled nowhere, or if two cascade layers both define
one. The last is not hypothetical: `.glance` was already the About page's,
`.steps` already the Learn hub's, and a later layer wins on every page.

The same three-place rule covers the photo classes: `wide`, `full`,
`frame-wide`, `frame-square`, `frame-tall`, `focus-top`, `focus-bottom`,
`lead-photo`.

## Share cards

The picture a pasted link shows is drawn, not borrowed. `aab/share-card.js`
makes a 1200×630 JPEG and that is what `cover` holds and `og:image` points
at.

**It is drawn as this site rather than as a photograph.** A card arriving
in a chat should look like the place it came from before anybody reads the
title.

**So it is THE ROOM**, the same ten layers `card-art.tsx` puts behind every
card here, in the same order, then the card's own furniture on top: the
scrim that seats the words, the accent rail every `<GoCard>` carries, the
hairline rim, the kicker in the mono face and the title in the serif.

**The twelve drawings are `shared/art-svg.ts` and are strings**, because
the share card cannot reach JSX inside `card-art.tsx`. Same reason
`next/lib/school-icons.ts` holds strings: markup that something other than
React has to read.

**They are NOT compiled into `aab/`.** 34 KB, and nobody needs them but
whoever is publishing. `GET /api/admin/art` hands them over behind
`isAdmin()`, with the SUBJECT this piece wears in the same answer when the
caller says what the piece is, because `shared/art.ts` is the one place
that decides and a Vite bundle cannot import it.

**A drawing is rasterised through an `<img>`, never `createImageBitmap` on
the blob.** Chrome answers `InvalidStateError: The source image could not
be decoded`: an SVG is a document rather than a bitmap format. The nine
`--art-*` tokens are SUBSTITUTED into the string before it is parsed rather
than declared in a `<style>` inside it, and `check-art.ts` fails on a tenth
token: unresolved, it is left as literal text and an SVG rasteriser paints
it BLACK.

The piece's own photo, where there is one, is what all of that stands on,
so every piece can have a card rather than falling back to the section's
standing one.

**And every lesson.** All 251 otherwise fall back to their stage's standing
card. A lesson's is `meta.card`, written by
`PUT /api/schools/<school>/<stage>/<lesson>`, which MERGES that one key
rather than replacing the object: the Studio's lesson editor sends no meta
at all, so a replacement would be `{}` and would take the English title,
the blurb, the icon and the day range with it.

**No two cards are the same, and it is not a random number.** Eleven
numbers come out of the piece's own id, through the hash `shared/art.ts`
picks the subject and the colour with: where the light falls, how high the
horizon is, how hard the floor converges, where the halo sits, how the wall
behind is offset and scaled, where the motes are. Derived rather than
random because a card has to be the same card every time it is drawn, or
republishing a piece moves the picture under a link somebody has already
shared. None of them changes what the card IS.

**The Pictures panel on `/admin` is the queue.** Nothing can draw a card on
the server: a card is a canvas, a canvas is a browser, and both Workers
here have neither. `GET /api/admin/cards` answers with what has none,
oldest first, and the desk draws them one at a time in the tab and sends
each back. Closed it stops where it was, and the next visit carries on,
because the queue is whatever the database still answers with. That it
needs the tab open is said in the panel's own copy.

**It is always the dark one, and that is not a shortcut.** A JPEG in
somebody's chat window cannot answer the theme. The palette is READ with
`<html>` held at dark for the length of one synchronous style read, so the
cards follow the tokens and a change to the site's greens reaches them
without anybody remembering that file.

**The accent comes out of the rail.** `shared/nav.ts` is the one place a
section's colour is written down, the rail renders every section with that
colour inline on the link, and the page doing the publishing has a rail on
it. Putting `nav.ts` on the wire to carry a hue would cost a served module,
a precache entry and a service worker bump.

It is a JPEG because the scrapers behind WhatsApp, Facebook and LinkedIn
will not read the WebP every photo here is stored as: pointing them at the
photo itself is how a piece with a picture ends up sharing as the default
card. The Published panel on `/admin` flags any piece whose cover is still
a raw photo and can draw the missing card in place.

**A photo is read out of the editor by decoding, never by fetching.**
`fetch()` on a `data:` URL is governed by `connect-src`, not `img-src`, and
this site's policy allows `data:` under `img-src` only, so every upload is
blocked before it leaves the browser, silently: R2 stays empty, every
`cover` stays empty, and every shared link shows the default card.
`aab/photo.js` decodes instead, and `aab/studio-publish.test.ts` drives a
real publish under the policy read out of `_headers`. Do not "simplify" it
back to a fetch.

## What is served, and what is only in the clone

`[assets] directory = "./aab"` means every file in `aab/` is uploaded and
answers at its own public URL: checks, tests, both school builders, the
TypeScript served modules are compiled from and `schema.sql` were all live,
about 300 KB of them, at addresses like `/check-routes.ts`.

`aab/.assetsignore` is what stops that. A file nobody meant to publish is a
file nobody thinks about before changing.

Add a check or a test beside the others and it starts being published the
moment it is committed, so `scripts/check-routes.ts` reads that file and
fails on any path matching a build-or-test shape that no rule covers.

## Retiring a page

A page that has been replaced is deleted, and the git log is where it stays
readable.

Two conditions, both literal: **nothing serves it and nothing imports it.**
So before it goes, follow every reference: a `PAGES` entry in
`shared/content.ts`, the prerender rules in `app.js`, the `Disallow` block
`build-meta.ts` writes, the `PRIVATE` set in `build-og.ts`, any test that
drives the page, and any link in `app/src/**`. Add a line to `_redirects`
for the old URL, and delete the share card `build-og.ts` was drawing for
it. If a test was the only thing checking a module the page happened to
host, repoint the test rather than losing it.

**Repointing at a second page is not repointing.** `aab/studio.test.ts` was
68 checks of `aab/editor.js` and it survived `studio.html` by being aimed
at `/studio/`, which stopped existing too when the Studio's shell became a
route. It spent that time failing on a 404 rather than on the module it was
written for. It is `aab/editor.test.ts` now, it mounts `createEditor()`
into a shell it writes itself, and an address cannot go stale under it. A
test whose subject is a module gets the module's name and its own surface.

## An address that was live stays live, and a directory is an address

A page that moves leaves a rule in `_redirects` behind it. That covers the
spelling somebody typed into a link and not the spelling Cloudflare served.

`html_handling` serves `deutsch/index.html` at `/deutsch/`, WITH the slash.
So the directory form was the canonical address of every page that was an
`index.html`: what the old sitemap resolved to, what a crawler indexed, and
what a reader who bookmarked one has. Dropping `.html` from every address
and writing a 301 for `/deutsch/index.html` left `/deutsch/` matching no
route pattern at all: twenty-one addresses 404ed, four school hubs and
seventeen stage ladders, while every internal link worked, because nothing
on this site links the directory form.

Two things hold it now, and they are deliberately not a list of twenty-one
paths:

- **`bare()` in `worker.js`**, which takes one trailing slash off the path
  before the route table is consulted. A route added next week gets this
  without knowing about it; the request is forwarded unchanged, so Next
  answers with its own 308 to the canonical form.
- **`check-routes.ts`**, which reads `_redirects` for the answer rather
  than being told it. A rule whose source ends `/index.html` IS the
  statement that the page was a directory.

**`nextOwns()` is exported from `worker.js` for the same reason.** Four
checks each keeping their own copy of `NEXT_ROUTES.some(...)` is fine while
the answer is one line and stops being fine the moment the line grows a
`bare()`: the Worker starts forwarding `/deutsch/` and four checks go on
reporting on a site that does not exist.

## Before deploying

Run the checks. They are fast and each one exists because something shipped
broken once.

**CI runs them too, on the pull request.** `.github/workflows/checks.yml`
is the list, and `deploy.yml` calls it rather than keeping a second copy,
so the upload happens only if it passed. A laptop tells you before you have
written the commit message, and the four that need a browser or a build do
not run in CI at all:

```sh
node scripts/check-routes.ts # redirect loops, dead links in routes as well
                            # as in files, a live article whose slug cannot be a
                            # URL, a check or a test published as a page, a
                            # redirect pointing at a practice book no stage
                            # declares, a page that was a directory losing its
                            # directory address, a route whose dynamicParams
                            # is false, and a page inside TWO shell layouts
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
node scripts/check-utility-clash.ts # a class this site styles that Tailwind also
                            # generates, which no layer order can win back
node scripts/check-closed.ts # a new file on the old system: a browser module in
                            # aab/src/, a hand-written page, a functions/*.js
node scripts/check-material.ts # a pressable class on none of the five kinds, or
                            # one whose own gradient the material would erase
node scripts/check-glass.ts # a finish the panel offers and the stylesheet cannot
                            # draw, or one the boot script throws away before the
                            # first paint, so the choice never survives a reload
node scripts/check-relief.ts # a figure that lifts and never stops for a reader
                            # who asked for no motion, a relief on a class no
                            # layer defines, and a scene layer moved twice
node scripts/check-admin.ts # an endpoint under functions/api/ gated by neither
                            # requireAdmin nor isAdmin and not named as public,
                            # or a file open in part whose gate has quietly gone
node scripts/check-mjs.ts   # a .mjs, which is a file nothing typechecks and the
                            # reason the next one gets written
node scripts/check-dashes.ts # the one character this file opens by banning,
                            # in any tracked file
node scripts/check-diet.ts # a diet page that prints a target with no medical
                            # advice line, a floor written into a sentence
                            # rather than drawn from the constant, a BMI band
                            # read without the reader's ancestry, a portion row
                            # with no source or state, and a generated sentence
                            # that judges the reader
node scripts/check-art.ts   # a drawing naming a colour token the share card
                            # cannot substitute, which a card paints black, or a
                            # subject standing against a wall nobody drew
node scripts/check-icons.ts # an icon name that resolves to nothing, so the page
                            # draws a correctly sized empty svg
node scripts/check-jsx-space.ts # a sentence running into the link inside it,
                            # because JSX ate the line break before the element
node scripts/check-jsx-nesting.ts # a paragraph holding a block element, which
                            # the parser rearranges, so React refuses the
                            # server's markup and re-renders the whole page
node scripts/check-crons.ts # a scheduled job the Worker is no longer listening for
node scripts/check-pieces.ts # a written piece nothing on the site links to
node scripts/check-headers.ts # a page a Worker built, served with no CSP
node scripts/check-schools.ts # a ladder the browser and the builders disagree about
node scripts/check-money.ts # a money school lesson whose two languages mount
                            # different blocks, a block naming a kind or a lab
                            # model that does not exist, a mount inside a list
                            # that closes the list early, a lesson with no
                            # stars, a `needs` pointing forwards, and a lesson
                            # that renders as a stub
node scripts/check-rows.ts # a description of the database that has stopped
                            # being true, or a handler keeping its own copy
                            # of a vocabulary
node scripts/check-account.ts # a table this account holds that leaving does not
                            # carry: absent from "take a copy of everything", or
                            # left behind by "erase everything"
node scripts/check-migrations.ts # SQL the runner will refuse: a generated
                            # column calling a stable function, which fails the
                            # whole migration at 42P17 while every check that
                            # reads the file rather than the database passes
node scripts/check-rls.ts  # a Supabase table created with no row-level
                            # security on it, which has no symptom at all, or
                            # a second table readable by anyone
node scripts/check-courses.ts # a Drive id that is not one, the private course
                            # catalogue leaking into a public bundle, the Worker
                            # and the browser disagreeing about where a lesson
                            # lives, or a tick id that gained the segment the
                            # address gained
node scripts/check-api.ts  # the browser asking for an endpoint the Worker
                            # stopped routing, which quietly switches a
                            # feature off
node scripts/check-storage.ts # a key kept in a browser that nothing describes,
                            # a row that says it syncs where the account has
                            # never heard of it, and anything a reader did, made
                            # or chose that does not travel between devices
node scripts/check-app-surface.ts # a table this site holds that the Android
                            # app never hears about, which leaves a feature
                            # missing where nobody can see it is missing
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
node scripts/build-stamp.ts --check  # aab/studio/** built from an app/src/
                            # that is not the one committed beside it
node scripts/check-next.ts # a copy inside next/ that has drifted from the
                            # thing it was copied from
```

`check-pieces.ts --live` also asks the database and prints where every
piece actually lives.

And when anything under `functions/` or `scripts/` changed:

```sh
node scripts/restore.test.ts       # a backup that would not restore
node scripts/reader.test.ts        # somebody posting as somebody else
node scripts/comments.test.ts      # a comment appearing without approval
node scripts/input.test.ts         # a rule that stopped rejecting, in the one
                                   # place three endpoints read (36 checks)
node scripts/snapshot.test.ts      # a nightly snapshot that leaks, or that
                                   # throws at 03:17 where nobody is watching
node aab/studio-publish.test.ts    # a photo that never reaches R2, under the
                                   # real CSP (39 checks, needs Playwright and
                                   # a browser, skips without)
node next/account.test.ts          # the account's five features, the popover
                                   # menu, the Save under a byline, and the
                                   # panel that says what this browser holds,
                                   # under the real CSP (190 checks, needs the
                                   # Next build and a browser, skips without)
node aab/sync.test.ts              # a browser's own progress getting into an
                                   # account, resetting, signing out, two
                                   # signed-in devices, a map reconciled entry
                                   # by entry, and a refresh that signs somebody
                                   # out by accident (50 checks, needs
                                   # Playwright and a browser; starts its own
                                   # server)
node aab/sw.test.ts                # a bundle at a stable path served a build
                                   # behind, with the real worker installed
                                   # (6 checks, needs Playwright and a browser,
                                   # skips without; starts its own server)
node aab/editor.test.ts            # the sanitiser, the markdown rules, the
                                   # slash menu, the figure toolbar and the
                                   # paste, under the real CSP (172 checks,
                                   # needs Playwright and a browser, skips
                                   # without)
node next/routine-day.test.ts      # a day that renders and does not mark, an
                                   # empty day showing a nought, or a task taken
                                   # off the list being deleted rather than
                                   # archived (53 checks, needs the Next build
                                   # and a browser, skips without)
node next/research-studio.test.ts  # the Research Studio end to end: capture,
                                   # library, the PDF reader and its anchored
                                   # highlights, the review room and PRISMA, the
                                   # lab's DuckDB and OLS, the field room, the
                                   # workshop's thirty tools, the assistant's
                                   # stream and costs, and the methods room
                                   # (246 checks, needs the Next build and a
                                   # browser, skips without)
node next/progress.test.ts         # a page that costs a reader their ticks just
                                   # by being read, where in a piece they had
                                   # got to, and which tools they use
                                   # (41 checks, no browser)
node next/tracking.test.ts         # a way back to somewhere already on screen,
                                   # to the end of a finished piece, or to the
                                   # wrong paragraph; and the money school's own
                                   # tick (28 checks, needs Playwright and a
                                   # browser, skips without)
node next/comments.test.ts         # a comment body that stopped being text, a
                                   # reply two levels deep, or a thread that
                                   # draws itself signed in on the server
                                   # (28 checks, no browser)
node next/insights-hub.test.ts     # a topic chip that presses and hides
                                   # nothing, and an email box offered where
                                   # there is no database to put an address in
                                   # (46 checks, needs Playwright and a browser,
                                   # skips without)
node next/read-aloud.test.ts       # what the speech control reads, what it
                                   # steps over, what it marks, and whether Stop
                                   # stops (53 checks, needs Playwright and a
                                   # browser, skips without)
node next/reading.test.ts          # every number this site states about its own
                                   # typography, measured against its own prose
                                   # in both scripts: the measure, the column,
                                   # a full-bleed figure, and the hush
                                   # (52 checks, needs Playwright and a browser,
                                   # skips without)
node next/market-pulse.test.ts     # two endpoints raced, the device as the last
                                   # resort, a square per story and a window
                                   # that grows out of the one that was pressed
                                   # (91 checks, needs Playwright and a browser,
                                   # skips without)
node next/keep.test.ts             # the Save and the note under a byline:
                                   # nothing signed out, nothing until the
                                   # account has answered, and neither control
                                   # writing over the other's column of the one
                                   # row (109 checks, needs Playwright and a
                                   # browser, skips without)
node next/lesson.test.ts           # every kind of lesson block, every shape a
                                   # figure takes, every model behind a lab and
                                   # every sheet, hydrated one page at a time
                                   # (474 checks, needs Playwright and a
                                   # browser, skips without)
node aab/schools/progress.test.ts  # a school's ticks filed under a key that is
                                   # not the one in somebody's browser, and the
                                   # three schools' shared engine (119 checks)
node aab/courses.test.ts           # the course player: the shelf, the sidebar,
                                   # the ticks, the per-module bars, mark-
                                   # complete-and-continue, the deep link, an
                                   # old course bookmark, and the timers it must
                                   # never grow. Its fixture is two programmes
                                   # (155 checks, needs linkedom)
node aab/schools/workbook.test.ts  # a practice book that renders and does
                                   # nothing: the day walker, what was typed,
                                   # the answers, the tick, and the storage key
                                   # each is filed under (40 checks, needs
                                   # linkedom)
node aab/schools/hub.test.ts       # a school hub that renders and is not
                                   # finished: the ladder, the ring, the bar and
                                   # the resume card (57 checks, needs linkedom,
                                   # skips without)
node functions/_lib/notion.test.ts
node functions/_lib/drive.test.ts  # a JWT Google would refuse, and a pass that
                                   # opens more than the one file it names
node functions/_lib/quiz.test.ts   # a quiz rendered with its questions and none
                                   # of its answers, which looks finished
node scripts/schools.test.ts       # a curriculum that lost a field, a lesson
                                   # body that changed, or a ladder that came
                                   # back in the wrong order (32 checks)
node scripts/schools-api.test.ts   # a school readable by anyone, writable by
                                   # somebody else, half-written, or a lesson
                                   # edited into existence (43 checks)
```

And when anything under `app/src/` changed, after rebuilding. `playwright`
is a devDependency of `app/`, and it does not bring a browser with it:
point `CHROMIUM_PATH` at one, or run `npx playwright install chromium`.
Without either, the file says so and skips, which is not a pass:

```sh
node app/studio.test.ts           # the React Studio's chrome, end to end, and the
                                   # pre-flight rules about a photo: no alt text,
                                   # or hosted on somebody else's server
                                   # (83 checks, needs Playwright and a browser)
node scripts/check-types.ts        # and again here, because it has a config of
                                   # its own and it SKIPS where app/node_modules
                                   # is absent, which is every CI runner
```

And when anything under `next/` or `shared/` changed, after
`cd next && npx opennextjs-cloudflare build`:

```sh
node scripts/check-worker-size.ts  # the Next Worker over Cloudflare's 3 MiB,
                                   # which is a deploy that fails with every
                                   # check green and one line in a dashboard
node next/parity.test.ts           # the Next.js route saying something the
                                   # Worker's own renderer does not, and a
                                   # reading hub that has stopped agreeing with
                                   # the database (114 checks, needs the build,
                                   # skips without)
node scripts/check-types.ts        # and again here, because it SKIPS the browser
                                   # tests' config where next/node_modules is
                                   # absent, which is every CI runner
node next/article.test.ts          # the article page, on the real Worker with a
                                   # real database: the thread filling, a comment
                                   # body that stopped being text, and anything
                                   # hydrating wrongly (27 checks, needs the
                                   # OpenNext build and a browser, skips without)
node next/interactive.test.ts      # a calculator that renders and computes
                                   # nothing because hydration undid it, a
                                   # contact form that looks sent and reached
                                   # nobody, and the stock check's two ways in:
                                   # eleven fields or eighty-five (217 checks,
                                   # needs `npx next build` and a browser, skips
                                   # without)
```

It really does run in a container: it gave up on any line matching
`Error: `, and `wrangler dev` prints exactly that, harmlessly, wherever
there is no outbound network, then starts forty seconds later. A skip now
says which of the three ways it failed to start happened, and a skip is
never silent.

## After deploying

One check describes what is live rather than what is committed, so it
belongs after the upload and not before it:

```sh
node scripts/check-live.ts        # the service binding, the second Worker's
                                   # own scripts, and the pieces that fall
                                   # through to a file
node scripts/check-preview.ts --preview <branch-preview-url>
                                   # does the Next Worker's branch preview
                                   # render what the live site renders
```

`check-preview.ts` is how a route gets verified before anything forwards a
reader to it. The two Workers deploy separately and Cloudflare gives
`reiad-next` a branch preview URL on every push, with the real database
binding, so a route can be written, pushed and asked real questions while
`NEXT_ROUTES` in `worker.js` still sends nobody there. The URL is in the
Cloudflare bot's comment on the pull request.

`next/parity.test.ts` is the better test and does not run everywhere: it
needs `wrangler dev` on workerd. Reach for the parity test first; reach for
this when that is not available, and always to catch a deployed regression
a local test cannot see, because it asks the live site and the live
database rather than a fixture.

It runs itself on every push, in `.github/workflows/live-check.yml`,
because the two things it is really watching are settings on a deployed
Worker rather than lines in this repository, and an article renders
perfectly with both of them broken.

If a precached file changed, bump `VERSION` in `aab/sw.js`, add a line to
the changelog at the top of that file saying what changed and why it needs
the bump, then run `node scripts/check-sw.ts --update`.

## A migration's filename is a fact, not a label

`supabase/migrations/` is read by the Supabase GitHub integration, which
compares the versions in those filenames against the versions recorded in
`supabase_migrations.schema_migrations` and applies anything it has not
seen. The number in front of a migration is the primary key of a row in the
database, and renaming a file after it has run tells the integration that a
migration it has never applied has appeared.

**Never rename a migration that has been applied**, and never round its
timestamp to something tidier. If a migration was applied out of band,
through the dashboard or through the Supabase MCP, the version it was
stamped with is the version the file must carry, however ugly.

Two migrations were applied that way and then written into the repository
under hand-rounded names:

| the file said | the database recorded |
| --- | --- |
| `20260817180000_lock_trigger_functions.sql` | `20260817181442` |
| `20260818090000_broker_admins.sql` | `20260818030907` |

One of them sorted BEFORE the last migration the integration had applied,
which is an out-of-order insert and something it refuses outright: the
Supabase branch went to `MIGRATIONS_FAILED` and stayed there while the
project stayed `ACTIVE_HEALTHY` and every table was correct. The SQL was
fine. The filenames were the bug.

Both files now carry the versions the database recorded. To check that the
two still agree:

```sh
# what ran, and when it was stamped
select version, name from supabase_migrations.schema_migrations order by version;
ls supabase/migrations/
```

## Backups

The database has two, and the split between them is about who can read the
result, not about size.

The repository is private, and **that changes nothing about what may go in
git.** Visibility is one click and retroactive in neither direction: going
private unpublishes nothing already fetched or forked, and going public
later publishes the whole history at once. A rule that holds only while a
checkbox holds is not a rule.

`content/articles.backup.json` is committed nightly by
`.github/workflows/backup.yml` and holds **live articles only**. Every byte
of it is already served at a public URL. Drafts, reader questions,
subscriber emails, the admin password hash and any identifier of a system
outside this site are deliberately absent, and `functions/_lib/backup.ts`
says why at length. Do not widen that `SELECT` without reading it.

Everything else goes nightly into R2 under `backups/`, written by the
Worker's own cron, kept a fortnight. Not public, same provider as the thing
it is backing up, which is a weaker guarantee and is written down as one.

To restore, read the SQL before you run it:

```sh
node scripts/restore.ts content/articles.backup.json > restore.sql
npx wrangler d1 execute reiad --local  --file=restore.sql   # practise
npx wrangler d1 execute reiad --remote --file=restore.sql
```

## Where a lesson's words live

In D1, and in one committed export of it. A lesson is written at
`/studio/?lessons`, which saves one row through
`PUT /api/schools/<school>/<stage>/<lesson>`, and the route reads the row,
so saving in the Studio changes the page. There is nothing to rebuild and
nothing to commit.

The snapshot is still worth refreshing, because two checks and every test
read it and it is the schools' committed backup:

```sh
npx wrangler d1 export reiad --remote --output schools.db
node scripts/export-schools.ts --db schools.db   # content/schools.backup.json
```

**Why there is a file at all, now that no page is built from it.** It is
the schools' half of the nightly backup, on the same footing as
`content/articles.backup.json`; it is what `check-schools.ts` compares the
four ladders against; and it is the only copy of the lesson prose a check
running on a laptop with no network can read, which is how `check-css.ts`
knows that `.shobdo-list` and thirty-one other rules style something real.

It is safe on the same grounds as ever: every byte of it is already served
at a public URL. It carries no timestamp, deliberately, so that identical
content is identical bytes and the git log answers "did the prose change".

All 251 school pages are Next.js routes rendered from the rows. There is no
committed page to compare a build against, so `next/parity.test.ts` asks
that question against the route.

`check-schools.ts` does two things: it compares the ladder in
`shared/curricula/<school>.ts` against the ladder in the snapshot, and it
computes every lesson's URL, progress id and label both through
`shared/schools.ts` and through the school's own file, failing on any pair
that disagree.

**The ladder is `shared/curricula/<school>.ts`,** and the browser still
reads it: eleven modules import `/deutsch/curriculum.js` or one of its
three siblings, which `scripts/build-modules.ts` writes from those four
sources the same way it writes `/content.js`. So two files describe the
same four schools, and `check-schools.ts` fails if they stop agreeing about
which lessons exist, in what order, in which section. Titles and prose are
not compared: those are the Studio's.

**A stage's `base` says where its pages go, not whether anybody can write
them.** `basics-1` carries a `base` of `/money/terms/` because its eighteen
term pages were the glossary before this school had a builder, and they
keep the terms shape of address. They are written from the rows like
everything else.

**Every stage is editable.** No stage is `inline`, and the branch is gone
from both ladders, `shared/schools.ts` and `shared/curricula/money.ts`. A
lesson is written in the article's own vocabulary: a `checklist`, a
`side-note`, a `note` box, the lesson's `meta`. Classes belonging to a
section's own layer are not an option, because `check-css.ts` fails a class
two layers both define, and widening the article allowlist to admit
`split`, `do`, `others`, `warn`, `bn-h` and `btn` would take them into
every article on the site.

Generated pages are generated. Edit the source, never the output:

```sh
node scripts/build-modules.ts       # aab/share-card.js and aab/api.js from aab/src/,
                                    # and aab/content.js plus the four
                                    # aab/*/curriculum.js from shared/
node scripts/build-fallback.ts     # aab/fallback.css from next/styles/site.css
node scripts/build-school-icons.ts  # next/lib/school-icons.ts from aab/*/icons.js
node scripts/build-meta.ts              # feed.xml, sitemap.xml, robots.txt

cd app && npm run build             # aab/studio/** from app/src/studio/**
                                    # and app/build-stamp.json, which is what
                                    # holds it to its own source
```

`app/` is the React workspace: Vite, React and TypeScript, building to
`aab/studio/`. One file at a stable path, because `sw.js` and the route
that loads it name real paths and a hashed chunk would fight them; `TARGET`
in `app/vite.config.ts` is still a table so that a second page is a line
rather than a rewrite. **Its output is committed**, for the same reason
every generated page here is: the site deploys by uploading `aab/`, with no
build step in CI. So the rule is the rule: edit `app/src/**`, run the
build, commit both.

**A stale generated file looks exactly like a correct one**, which is what
`scripts/build-stamp.ts` is for: it hashes the sources and `npm run build`
writes the hash, so the day they part company a check fails. It hashes the
SOURCES rather than the output, because Vite's output is not reproducible
across versions and the thing that goes wrong is that nobody re-ran the
build.

**The stylesheet is `next/styles/`.** `site.css` is the design system,
`tailwind.css` is the theme and the utilities, and `globals.css` imports
them in that order, which is where the cascade order lives. `shell.tsx`
imports the one file and Next emits a hashed stylesheet, so nothing is
served at `/styles.css` any more. A port must not also be a redesign.

`aab/fallback.css` is that stylesheet with its comments removed, for
`404.html` and `offline.html`, which cannot link a name that carries a
content hash. `scripts/build-fallback.ts` writes it and `check-next.ts`
fails if it has drifted.

**Tailwind is live, on one page.** `/account`, because its markup is almost
entirely layout. `@theme` in `next/styles/tailwind.css` names the site's
own tokens, so `bg-panel` means `var(--panel)` in both themes.

Three things stay in the stylesheet and the split is the point:

| | |
| --- | --- |
| anything an article carries | `tw` sits BELOW `article`, permanently. An article's body is HTML in a database and Tailwind's compiler cannot see it. |
| CSS with no utility | the popover menu is `@starting-style`, `::backdrop`, `:popover-open` and anchor positioning. Arbitrary values would be longer than the rule. |
| DOM built in a loop | a class name inside `createElement` is found by the scanner only because `aab/*.js` is a source. That makes it work, not readable. |

JSX gets utilities; everything else keeps a class.

Neither are the site's own modules. `/app.js`, `/api.js`, `/auth.js`,
`/content.js`, `/share-card.js`, `/photo.js` and `/editor.js` are left
external by `vite.config.ts` and imported at runtime, so the Studio shares
one copy of each with every other page instead of carrying a second that
can drift. Most are plain JavaScript, so each is described by a declaration
in `app/src/types/` that `tsconfig.json` maps the runtime path to;
`/content.js` is TypeScript, so the mapping points at `shared/content.ts`
itself. Do not answer an untyped import with a `@ts-expect-error`.

## What more than one runtime has to agree on

`shared/` is for anything the Worker, the browser and the Next.js route
must all say the same way. Twenty files and a directory, and
`check-types.ts` fails on one that `shared/README.md` does not describe:
`content.ts`, the site's own manifest and every number the site states
about itself; `curricula/`, the four schools' ladders, one file each;
`look.ts`, the per-section table and the head facts every article page
states; `headers.ts`, the security headers a response has to carry when it
was not served as a static file; `schools.ts`, the same four curricula read
out of D1, plus the ladder's arithmetic; `rows.ts`, what a row of this
database is; `nav.ts`, the one table the whole menu comes from; `art.ts`,
which of the twelve drawings a thing wears and in what colour, derived for
the two hundred rows the rail does not list and owning the vocabulary both
`nav.ts` and `card-art.tsx` take it from; `routine.ts`, what a routine's
bands and tasks are and the templates the site ships; `courses.ts`, the
third-party catalogue, which is the one `next/` may not import for its
values; `diet.ts`, the diet tool's arithmetic, where every estimate comes
back as a range so a caller cannot take a point value without its width;
and `foods.ts`, that tool's portion library for Bangladesh and the UK,
where every row is said in both languages, an `id` is a key already in
somebody's log, and every rice, dal and pasta row says in its name whether
the figure is for the raw food or the cooked.

**`nav.ts` lives here because three runtimes read it**: four checks import
it from node, a migration comment quotes its school ids because Postgres
cannot import it, and `/api/site` serves it to the Android app. The count
above has gone stale before.

**Five of them have an output, and it is one argument.** The browser reads
the manifest at `/content.js` and a ladder at `/money/curriculum.js` or one
of its three siblings, five URLs `sw.js` precaches by name, and it cannot
reach `shared/`, so `scripts/build-modules.ts` compiles those five into
`aab/`. Edit the source, never the output.

**An import inside `shared/` carries the `.ts` extension**, because node
reads these files with no build step and resolves the real filename. Every
tsconfig that sees one sets `allowImportingTsExtensions`, and
`scripts/tsconfig.shared.json`, the one that compiles them, pairs it with
`rewriteRelativeImportExtensions` so the browser gets a `.js` it can fetch.

**They are TypeScript, and nothing is compiled beside them.** Both
consumers have a compiler and use it: Next through `transpilePackages` in
`next/next.config.ts`, needed because the package resolves inside
`node_modules` and Next will not compile TypeScript it finds there, and the
Worker through wrangler's own esbuild, which needs no configuration. Plain
`node` reads them too, which is what the checks under `scripts/` rely on.

It is an npm package (`@reiad/shared`) because `next/` cannot import by
relative path out of its own directory: Turbopack refuses to resolve above
its root, and moving the root moves Next's file-tracing root with it, which
breaks the OpenNext build. `next/.npmrc` sets `install-links=true` so npm
copies it in rather than symlinking, for the same reason. The Worker
imports the files directly; esbuild has no such restriction.

**That copy does not notice that you edited one.** npm keys a `file:`
dependency by its version, so `npm install` leaves a stale copy in place
however much the contents changed, and `next build` compiles the old code
without a word. Delete it first:

```sh
rm -rf next/node_modules/@reiad/shared && (cd next && npm install)
```

A fix re-run against the stale copy is not a fix: a typo in `bnNum` put
every Bangla numeral into Devanagari, `০১২৩` becoming `०१२३`, and the route
went on serving the wrong digits after the fix and the rebuild.
`next/parity.test.ts` caught it. `shared/README.md` says all of this again
where somebody editing those files will see it.

**A response a Worker builds is not a static asset**, so `aab/_headers`
does not apply to it: a page rendered from the database is served with no
Content-Security-Policy, no HSTS and no `X-Frame-Options` beside file-based
pages that have all three, and renders the same either way. Anything that
returns HTML from a Worker goes through `htmlResponse()` in
`shared/headers.ts`, and `check-headers.ts` fails if that list and
`_headers` drift.

**It also fails on a handler that does not call it**, which the list
comparison alone could never see: a `new Response` built with a
Content-Type and nothing else carries none of the six while the two lists
are in perfect agreement.

**And a Worker-built page links `/fallback.css`, never `/styles.css`.**
Nothing is served at the second: the stylesheet is Next's and carries a
content hash, which a response a Worker builds cannot know.

## The writing surface is one module

`aab/editor.js` is the contenteditable: the sanitiser, the block list, the
markdown input rules, the slash menu, the figure toolbar and the caret work
under all of it. Both Studios import it,
`createEditor({ root, onChange, lang, toast, pickPhoto })`, and the root
element is handed in rather than looked up so importing it does not import
a page.

**Do not copy any of it into a component.** A `contenteditable` is a piece
of the DOM the browser and the writer are both editing behind React's back;
rendering it from state replaces the node the caret is in on every
keystroke. React owns the chrome around it and nothing inside it. Two
sanitisers that disagree is the bug the three-place rule above already
exists for.

**A port is finished when it does what the thing it replaced did, not when
it renders.** So the list of what the old page did is written down as a
test: the desk's 76 checks are in `next/admin.test.ts`, every one of them a
feature the page it replaced had. Anything ported out of `aab/*.js` gets
the same treatment before it is called done.

That includes the `<head>`. A change to canonical links, Open Graph tags or
the webfont link has to go into `page()` inside both builders, or the two
schools drift away from the rest of the site one deploy at a time.

## A page rendered by Next loads its modules through one component

**Never write `<script type="module" src="...">` into a Next route.**
`next/components/scripts.tsx` is how a page loads one. A module script in
the body is deferred, so it runs after the document is parsed and BEFORE
React hydrates; hydration is React adopting the server's HTML, and it
undoes anything the module wrote into it. The module runs, the page goes
back to how it shipped, and the console says `Minified React error #418`.
Every calculator on this site was blank for a day that way, and every other
check reads HTML, which was correct.

The same rule catches two smaller shapes of it:

- An inline script written as `<script>{js}</script>` in JSX ships as an
  empty tag. React drops the children of a `<script>`. Use
  `dangerouslySetInnerHTML`, which for this one tag is the ordinary way.
- A `<style>` or any other node a script adds to the document before
  hydration is a node React removes. Render it instead.

An element a pre-paint inline script deliberately rewrites, the home page's
headline being the only one, carries `suppressHydrationWarning` so React
leaves it alone.

`next/interactive.test.ts` drives the built pages in a real browser and
fails if any of this comes back.

## The money school lives at /money/

It sits at `/money/` beside `/deutsch/`, `/quran/` and `/english/`, under
the name it teaches: টাকা ও শেয়ার. The move took the school id in D1, the
folder `aab/money/`, the cascade layer `@layer money`, the route patterns
in `worker.js`, `run_worker_first` in `wrangler.toml`, and every link in
every lesson body. **No redirect.** The old addresses are gone, which is
what a move is.

**One thing did not move, and it must not.** The storage keys. Progress is
still filed under `learn-read` and `learn-last`, and `aab/sync.js` still
maps them to `learn:progress`. Those strings are in real browsers and in
real accounts: renaming a key does not move somebody's ticks, it loses
them. `next/lib/progress.ts` maps the school `money` on to the key
`learn-read` deliberately, and says so where it does it.

## Third-party courses, which are nobody's to publish

`/skills/courses/`, and it is the one section of this site that breaks the
rule every other section follows. Everywhere else **the ladder is the
server's**: the route reads the rows and renders them, and a crawler is
welcome to the result. Here the server renders nothing.

These are not lessons written here. They are one person's own copy of a
bought course, sitting in a private Google Drive folder, and this
repository holds a CATALOGUE of it and not a byte of the material: which
programmes, which courses, which modules, which lessons, and the Drive id
behind each one. Publishing that catalogue would be redistributing somebody
else's course, so the pages are empty and the catalogue is behind
`isAdmin()`.

## A programme is a folder, and the eight were never eight courses

The eight courses listed flat are the eight of the **Google Data Analytics
certificate**, and a second certificate would have sat beside them with
nothing saying which belonged to which.

So there is a level above a course. A programme is a Drive folder holding a
run of courses meant to be taken in order, it holds no file of its own, and
the address is one segment longer:

| | |
| --- | --- |
| `/skills/courses` | the shelf of programmes |
| `/skills/courses/<programme>` | one certificate, its courses |
| `/skills/courses/<programme>/<course>` | one course, its modules |
| `/skills/courses/<programme>/<course>/<module>` | one module |
| `/skills/courses/<programme>/<course>/<module>/<lesson>` | one lesson |

**The importer decides structurally, not by name.** A course's child
folders are modules and a module is `NN_something`; a programme's child
folders are courses and a course is `N. Something`. Both conventions are
Coursera's own. Where the Drive root holds courses directly, which is what
it holds today, **the root itself is the programme**. A part-moved Drive
works too, so a new certificate can be added by making a folder and
dragging things into it.

**The crawl records the root folder's own name**, in a row of `tree.tsv`
with an empty parent. Listing a folder's children never says what the
folder is called, and the only honest source is the folder.

**THE ADDRESS GAINED A SEGMENT AND THE TICK DID NOT.** `lessonId` is still
`<course>/<module>/<lesson>`, because `courses-read` holds those strings in
real browsers and `courses-answers` holds them with two more on the end.
Renaming one does not move somebody's ticks, it loses them, and a programme
is a fact about where a course is FILED. The price is that a course slug
has to be unique across the whole catalogue and not only inside its
programme, or two certificates each holding a "Foundations" would share one
set of ticks; `check-courses.ts` fails on a collision, and the fix is
renaming a Drive folder.

It also fails on the edit itself, which is the likelier one to be made:
`lessonId()` and `lessonUrl()` sit four lines apart in `shared/courses.ts`
and one of them takes a programme, so making the other match reads as
tidying. It is the single most expensive edit anybody can make to this
section, because every tick already filed is orphaned rather than moved,
and every page still renders.

| | |
| --- | --- |
| `shared/courses.data.json` | the catalogue. **Generated.** 1 programme, 8 courses, 43 modules, 794 lessons, 1,629 Drive ids |
| `scripts/import-courses.ts` | what generates it, out of Drive |
| `scripts/fixtures/course-crawl/` | the Drive listing it is built from, so CI can rebuild it with no credential |
| `shared/courses.ts` | the types, the counts and every address |
| `functions/api/courses/` | the only thing that ever sends it |
| `functions/_lib/drive.ts` | the one place this site reads Drive |
| `functions/_lib/ticket.ts` | a signed pass, because `<video>` sends no header |
| `functions/_lib/quiz.ts` | a Coursera quiz export, read into questions |
| `functions/_lib/drive.test.ts` | the JWT really is a signature, and the pass opens one file |
| `aab/src/courses.ts` | the browser's half: all five pages |
| `next/app/(site)/skills/courses/` | five shells with nothing in them |

**Do not import the value half of `shared/courses.ts` from anything under
`next/`.** A page that did would put the whole catalogue into a JavaScript
bundle anybody can fetch, and the page would look identical. `import type`
is fine and is erased before bundling. `check-courses.ts` fails on the
other kind.

**The catalogue is generated and must stay generated.** A hand-edited copy
is right on the day it is typed and wrong the first time the Drive folder
changes.

Refreshing it needs a Drive OAuth **access token**. A private file will not
open for an API key, and not for a service account either unless the folder
has been shared with it. Ask for the narrowest scope that works,
`drive.metadata.readonly`, which cannot read file content at all: this
script reads `id`, `name` and `mimeType` and never opens a file. Get one
either from
[the OAuth playground](https://developers.google.com/oauthplayground) or,
with no third-party client involved, from gcloud:

```sh
gcloud auth application-default login \
  --scopes=https://www.googleapis.com/auth/drive.metadata.readonly
export GOOGLE_OAUTH_TOKEN=$(gcloud auth application-default print-access-token)

node scripts/import-courses.ts --drive <folderId> \
  --dump scripts/fixtures/course-crawl
node scripts/import-courses.ts --crawl scripts/fixtures/course-crawl --check
```

**Always pass `--dump` on a `--drive` run.** It writes the Drive listing
back out beside the catalogue, and that listing is the only reason CI can
rebuild the catalogue without a credential. Refresh one without the other
and the next `--check` fails on a drift that is really a stale fixture.

Export it rather than passing `--token`: an argument goes into the shell
history and a token is a bearer credential for the hour it lives. Nothing
is written until the whole walk succeeds, so a token that expires halfway
leaves the committed catalogue alone. The head of `import-courses.ts` says
all of this again where somebody running it will see it.

**The browser never talks to Drive. The Worker does.** Handing Drive file
ids to the page cannot work for a PRIVATE file: Drive has to know who is
asking, and inside a cross-site iframe it cannot, because browsers block or
partition third-party cookies now. Drive sees an anonymous request for
something that is not public and answers "Unable to load video". Nothing is
broken: not the embed, not the file, not the CSP. That mechanism only ever
worked for files shared by a link, and these deliberately are not.

So `functions/_lib/drive.ts` holds one credential and serves the bytes from
this origin, where there is no third party to block:

| | |
| --- | --- |
| `GET /api/courses/ticket/<id>` | a signed pass for one file, thirty minutes |
| `GET /api/courses/file/<id>?t=` | those bytes, streamed, `Range` forwarded |
| `GET /api/courses/reading/<id>` | that page, sanitised, rendered in the lesson |
| `GET /api/courses/quiz/<id>` | that quiz, as questions rather than markup |
| `GET /api/courses/captions/<id>?t=` | the `.srt` beside the video, as WebVTT |

**Two locks on the file route, and the second is the one that matters.**
`isAdmin()` is the first. On its own it would leave a proxy that fetches
any Drive id it is handed, which is a read-only window onto the whole of
somebody's Drive resting on one check. So `isCourseFile()` refuses any id
the catalogue does not name, before a credential is even loaded.

**`<video src>` sends no `Authorization` header**, which is why there is a
ticket at all. The alternatives were a bearer token in a query string,
which puts a long-lived credential in history and in every proxy log, or a
cookie, which is a third way of being signed in on a site that already has
two. A ticket names one file, expires, and grants nothing else. Its key is
derived from `GOOGLE_SA_KEY` rather than being a fourth secret to manage,
with domain separation so it signs tickets and nothing else.

**Still no player events.** A `<video>` element would happily report
`ended`, and using it would still be guessing that somebody who left a tab
open has learnt something. A lesson is complete when the reader presses
"Mark complete & continue", and the last lesson of a module goes to the
module summary rather than into the next module. `aab/courses.test.ts`
asserts the absence as well as the presence.

**A transcript and captions are two files and two jobs.** Every video ships
with a `.en.txt` and a `.en.srt` beside it. The first is prose and is
offered as a link, for reading instead of watching. The second is the same
words with timings on them, which is the only thing a `<track>` can use.
`coursera.mjs` classified both correctly from the first import, and
carrying only the transcript leaves every lesson with a captions button
that turns nothing on.

No browser reads SubRip in a `<track>`, so the Worker converts: `toVTT()`
in the endpoint adds the `WEBVTT` header and moves the decimal point, and
does it only inside a timecode, because captions are prose and a blanket
comma replace turns "first, we will" into "first. we will" in every
subtitle on the site. The track carries its own ticket, minted for the
captions file rather than shared with the video's, because a ticket naming
ONE file is the property that makes it safe to put in a URL.

`media-src 'self'` already covers a `<track>`, so the CSP did not change.

**A quiz is parsed, never sanitised into shape.** Every option in a
Coursera quiz lives inside a `<form>`, and `sanitiseHTML()` drops `form`
WHOLE, contents and all. That is right for an article and it deletes every
answer here, leaving a page of prompts and rules that looks finished.

The fix was not to widen the allowlist, which would let a form into every
article on the site to serve one page that is not an article.
`functions/_lib/quiz.ts` reads the structure FIRST and sanitises only the
prompt it hands on, so what crosses the wire is data: a prompt, whether it
is pick-one or select-all, and a list of option strings. **The browser
builds its own inputs from that**, which is also how no foreign `<input>`
ever reaches the page. An export in a shape the parser does not know falls
back to the reading renderer, because unreadable is worse than plain.

**It cannot mark anything, and it says so.** The export carries no answer
key: no `checked`, no `correct`, nothing. Coursera marks on its own server
and what was downloaded is the paper, not the marking scheme. So the page
records what the reader picked and prints one line saying nothing is marked
right or wrong. `quiz.test.ts` asserts the absence of a score as well as
the presence of the options.

Answers are `courses-answers`, a `set` of
`<course>/<module>/<lesson>#<question>#<option>` beside the ticks in
`aab/sync.js`. That is the checkpoint shape with one segment more, and a
`set` for the same reason. A pick-one question clears its other options on
change, so the store can never say a reader chose two things where the page
allowed one.

**Answering is still not finishing.** The lesson's tick is the button,
exactly as it is for a video.

**`ID_FIELDS` in `shared/courses.ts` is the list of lesson fields holding a
Drive id**, and it is exported because more than one thing walks it. A
second copy in `check-courses.ts` went on reporting every id well formed
while never looking at the 298 that `captions` added. One vocabulary, one
place: the rule `check-rows.ts` already enforces for the database.

**The credential is a SERVICE ACCOUNT, and that is not a convenience.** Two
wrangler secrets, and the site works without them: every caller checks
`canReachDrive()` and the page says the section is not connected rather
than failing oddly.

```sh
npx wrangler secret put GOOGLE_SA_EMAIL   # ...@....iam.gserviceaccount.com
npx wrangler secret put GOOGLE_SA_KEY     # private_key from its JSON key file
```

Then **share the Drive folder with that address**, as Viewer, the same way
you would share it with a person. That sharing IS the grant: a service
account owns no files, so it can see exactly what has been shared with it
and nothing else.

A user OAuth refresh token is wrong twice over. It cannot be obtained:
`drive.readonly` is a RESTRICTED scope, so an app using it needs a security
assessment before Google lets it out of "Testing", and refresh tokens
issued in Testing expire after seven days. And it is far too much power: a
user refresh token with that scope reads the WHOLE of a person's Drive,
where this needs one folder. If the service account's key leaks, what leaks
is a folder of somebody else's course. That is also what makes
`isCourseFile()` a second lock rather than the only real one.

The scope is still `drive.readonly`: read, never write.
`drive.metadata.readonly`, which `import-courses.ts` uses, is not enough
here, because it deliberately cannot read file content.

`functions/_lib/drive.test.ts` generates a throwaway RSA key and verifies
the signed assertion against its public half, because every way of getting
the JWT wrong comes back from Google as `invalid_grant`, which is also what
it says when a clock is wrong or a key has been deleted.

**The CSP swapped a line.** `frame-src https://drive.google.com` is gone
with the iframe it existed for, and `media-src 'self'` is in its place in
both `aab/_headers` and `shared/headers.ts`. `default-src` would already
cover same-origin media; it is written out because it is the line somebody
would otherwise widen back to drive.google.com the next time a video looks
broken. `frame-ancestors` is unchanged and still `'none'`.

**Progress is a tick like any other.** `courses-read` and `courses-last`, a
set of `<course>/<module>/<lesson>` ids and a bookmark, in `aab/sync.js`
beside the six schools' keys and carried to `public.progress` in Supabase
under the same row-level security.

**Nothing in the rail or the footer links to it.** `unlisted` in
`shared/nav.ts` is that flag, and it exists so the menu can still be said
once: the entry is in the one table like everything else, the two menus
skip it, and `/skills` gives it a card of its own under a heading that says
it is not published. A link in the footer to a page that answers 403 is a
promise the site cannot keep.

## A calculator has two readers, and one of them was not served

The stock check reads **eighty-five inputs across eight groups**, which is
right for somebody with the statements open and a wall for somebody holding
one share and one question.

`reader-prefs.depth` is the switch, `quick` by default, and the model does
not change: the same eighty-five values are read either way, and what
changes is how many of them a reader is asked to type. `quick: true` on
thirteen entries in `FIELDS` is the whole of it, and they are the ones the
six pillars are most sensitive to.

**The page says which half of the answer is theirs.** Everything left out
keeps the sector's typical figure, which is what the example presets
already load, so a quick check is a real check against an assumed
background rather than a different model. `depth.quickNote` says exactly
that, because a score computed partly from somebody else's numbers has to
say so.

It lives in `reader-prefs` rather than in the calculator's own storage
because it is a choice about how the site behaves, and because that makes
it travel with the account. `tool-depth` is the calculator's own spelling
of it, written by `prefs.ts` alone, so `stock.js` needs a string comparison
rather than a JSON parse before its first render: exactly the arrangement
`tool-lang` already has.

### An analysis is about a company, and the URL is what says so

`name` and `ticker` are two strings in `DEFAULTS` that nothing in
`analyse()` reads. They are in that object because **`DEFAULTS` is the list
the URL encoder walks**, and a field outside it is a field a shared link
drops.

What they buy is everything downstream: the verdict says which company it
is about, the save box offers that name instead of an empty one, and
`/tools/live` can find the check somebody did on a holding by its ticker.

### A holding is a question, and the check is where it is answered

Every row of the live portfolio is a link, carrying the name, the ticker
and the price.

**Not the quantity.** `shares` in the stock check is the company's shares
OUTSTANDING and a reader's holding is not that, and a field filled in with
the wrong meaning is worse than an empty one.

**And the check comes back.** `checksDone()` reads the reader's saved
scenarios and pulls the ticker out of each one's stored query, so a holding
that has been checked carries that verdict beside it and the link reopens
the check rather than starting a new one. Out of the query rather than out
of a column, because that query IS the analysis: one encoder, and a
scenario saved before this existed has no ticker in it and matches nothing,
which is the right answer rather than a migration.

**The benchmarks are Dhaka's**, and a holding may be listed anywhere. Every
one of them is an input the reader can change.

## The live portfolio, and who is an admin

`/tools/live` shows one real Trading 212 account, live, three ways. A
stranger gets the site's own portfolio in percentages: a weight and a
return teach a lesson, a balance only says how much money somebody else
has. A signed-in reader who connects their own API key gets the same
dashboard over their own account, in full. An admin gets the levers: the
key behind the public feed, the switches that decide what a stranger's list
shows, and the site account unsanitised.

**The browser never speaks to the broker.** `aab/tools/live.js` calls
`/api/broker/*` and nothing else; the Worker
(`functions/api/broker/[[route]].ts` over `functions/_lib/broker.ts`) is
the only caller of `live.trading212.com`, which is why `connect-src` did
not change. The broker's rate limits are per ACCOUNT, so the one place that
can meter requests honestly is the one place they all pass through: the
public snapshot lives in D1 `settings` and refreshes at most every five
minutes, a reader's own numbers cache at the edge for one minute and their
history for ten. Do not add a second caller, and do not write the broker's
hostname into anything under `aab/` or `next/`: `scripts/check-csp.ts`
scans every string in both and will rightly fail it.

**A key is stored sealed or not at all.** `PUT /api/broker/key` proves a
key against the broker, seals it with AES-GCM under the `BROKER_TOKEN_KEY`
wrangler secret, and writes it to `public.broker_tokens` in Supabase AS THE
READER, forwarding their own bearer: this project holds no service-role key
and this table is not a reason to start. The row's owner can read their row
back and learns ciphertext. Without the secret, nothing is stored and the
paste-it-per-session path (the `x-broker-key` header, sessionStorage in the
tab) is all there is. The public feed's key is the `T212_PUBLIC_TOKEN`
secret, or one an admin sets from the dashboard, sealed into D1 `settings`
the same way; the secret wins where both exist.

**Admin is a reader id in two records, either is enough.** `ADMIN_READERS`
in `wrangler.toml` is the half that works with nothing else set up;
`public.admins` in Supabase is the durable one, granted only in SQL, with a
select policy that shows a reader their own row and no write policies at
all, so no combination of browser tokens can mint an admin.
`functions/_lib/admins.ts` asks both and is the ONLY place that asks:
anything that wants to know goes through `isAdmin()`. What an admin
currently gets: the dashboard's admin panel, the full site account, and
their comments go live without the moderation queue. A new privilege
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

In D1, written through the Studio, and rendered by a Next.js route. There
is no file half any more and no fallback to one: `shared/content.ts` holds
the menu, the palette and the site's own furniture, and the writing is
rows.

## Before opening a pull request

Check whether anything else is already in flight. Two open pull requests
had added three case studies to the same files a redesign was rewriting;
the redesign was branched off `main` and would have dropped all three on
merge. Look at the open PRs, not just `main`.

## Merging: do it, do not ask

Finished work ships without a second conversation. Open the pull request,
wait for the checks, and merge it as soon as they are green. Squash merge,
so `main` keeps one commit per change with the pull request number on the
end. There is no need to come back and ask whether it should go in.

Merging without asking is only safe while every check still runs first:

- all four checks in **Before deploying** pass,
- anything that touched a precached file bumped `VERSION` in
  `aab/sw.js` and re-ran `scripts/check-sw.ts --update`,
- generated pages were regenerated from their source, not edited,
- and `scripts/check-dashes.ts` passes, which `check-all.ts`
  already runs.

A red check is a reason to fix it, or to say plainly what is broken and why
it is not fixable here. It is never a reason to merge anyway, and "the user
said merge automatically" does not turn a failing check into a passing one.
