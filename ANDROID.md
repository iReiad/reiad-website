# The Android app, and how it gets built

Four runtimes read the same contracts today: the Worker, the
browser, the Next routes and the node checks, and `shared/` is the
treaty between them. **A native Android app is a fifth runtime
joining the same treaty, not a second product.** This says what
the app consumes, what the server has to grow (very little), and
in what order the app gets built.

Where this file and the code disagree, the code is right and this
file gets corrected.

## What "native" is for, and the two ways not to do it

**Not a wrapper.** The site is already installable: standalone
display, maskable icons and three app shortcuts are in
`aab/site.webmanifest`, and the service worker gives it offline
hubs and cached lessons. A Trusted Web Activity would ship that
with a store listing around it. The reason to build native is
everything a wrapped page cannot do well: instant cold start,
offline as a designed state rather than a cache accident, a real
video player for the courses, text that scrolls like the
platform's own, widgets, share targets, and a UI thread that never
pays for hydration.

**Not React Native.** What looks most transferable is not: the
React here is server components rendering database rows into HTML
for a stylesheet React Native cannot read, and much of the
interactivity is plain browser modules wiring served pages. Kotlin
buys no JavaScript layer between the app and the platform,
first-class widgets and media, and one runtime to maintain. **The
price is the ports** (the sync engine in `aab/src/sync.ts`, the
stock model in `aab/tools/stock.model.js`, the shapes in
`shared/`), and they are first-class work: fixture-locked, in the
risks table, never assumed.

**So: Kotlin and Jetpack Compose.** One activity, Compose
navigation, Material 3 as the substrate with this site's own
language mapped over it. Min SDK 26, target current. One Gradle
module until build times argue otherwise, packages by feature,
which is the same "one file until it hurts" judgement the
stylesheet lives by.

**And its own repository.** Everything the app consumes is public
by design, so it does not need this repo's privacy boundary, and
it should not live inside its check estate: every check here reads
every tracked file and all of them were written for a web
codebase. The app repo holds its own fixtures, refreshed by script
from the public endpoints, which is how its CI tests parity with
the site without a credential.

## The contracts that carry over unchanged

These are the site's load-bearing rules, restated as the app's.
Each one is enforced or documented in this repo already; the app
inherits them rather than negotiating them.

| Rule | What it means for the app |
| --- | --- |
| The account is the record, the device is a mirror | signing in adopts the account's rows and removes what the account lacks; nothing local is merged up; signing out takes the mirror off. `aab/src/sync.ts` is the reference implementation |
| A storage key is a fact | the app files ticks under the same strings the browser does: `learn-read`, `quran-done`, `english-day` and the rest. The list is `KEYS` in `aab/src/sync.ts` and this file deliberately does not copy it |
| The ladder is the server's, the ticks are the device's | curricula and lesson bodies come from `/api/schools/*`; whether something is read is never a server fact |
| Numbers and lists come from the data | the app renders catalogues it fetched, and hardcodes no count of anything. Its equivalent of `data-count` is a value read from the manifest endpoint below |
| The client never talks to Drive or the broker | course bytes come through `/api/courses/file/<id>?t=`, portfolio numbers through `/api/broker/*`. The Worker is the single meter for both, and that stays true with one more client in the world |
| The `profiles` read names the reader | `public.profiles` is world-readable by design, so every read the app makes carries `id=eq.<me>`, exactly as `aab/src/account.ts` does |
| Opening is not finishing | in the money school the tick is a button; in the other three schools opening a live lesson marks it (the `recordVisit` rule in `aab/schools/progress.js`). The app reproduces each school's own semantics, not a tidied average |
| A checkpoint is not a lesson | `.checklist` items tick under `<lesson id>#<n>` in `<school>-checks` and count toward no ladder |
| What a learner types is theirs | the practice books' written answers (`deutsch-schrift`, `english-write`) are device-only on the web and stay device-only in the app |

## New work reaches the app on its own, or it is a release

The rule, and it is worth stating before the phases because
everything after it depends on the answer: **the app reads the
same tables the site reads, so anything that is DATA reaches it
with no app release, and anything that is CODE needs one.**

| Added to the site | The app |
| --- | --- |
| a piece, a lesson, a stage, edited prose | has it, next fetch |
| a school, a tool, a case study, a term, a menu entry, a count | has it, next fetch |
| a section's new field, a nav item's new flag | has it, next fetch |
| a new calculator's arithmetic | needs a release |
| a new article block class, a new sanitiser class | needs a release |
| a new storage key or sync rule | needs a release, and a migration of nothing |

The first two rows are true because of one decision in
`functions/api/site.ts`: it SPREADS the tables rather than mapping
them field by field. Hand-picked fields look identical on the day
they are written and silently drop whatever somebody adds a year
later. `scripts/site-api.test.ts` walks the source objects and
fails if a field stops surviving the trip.

What keeps the release-needing list short is pushing work into the
data half wherever it will go: a lesson is prose in a row, not a
screen; a school is a table entry, not a module.

**So the obligation runs both ways.** Anything added to those
tables IS published at `/api/site` the moment it is added, which
is why the endpoint filters a `private` page, an `unlisted` menu
entry and the course catalogue, and why the test asserts each one
by name.

## What the site already serves an app

Verified against `worker.js`, `functions/api/` and the browser
modules. The reader-facing API is JSON, bearer-authenticated where
it needs to be, and deliberately CORS-free, which costs a native
client nothing: there is no preflight outside a browser, no
endpoint checks Origin, and the only cookie on the whole API
belongs to the Studio's passphrase session, which the app never
touches.

| Surface | What it gives |
| --- | --- |
| `GET /api/schools`, `/<school>`, `/<school>/<stage>`, `/<school>/<stage>/<lesson>` | the four curricula and every lesson body, public JSON, sanitised HTML in `lesson.body` |
| `GET /api/articles`, `/api/articles/<slug>` | the pieces: list without bodies, one with, public |
| `GET /api/comments?slug=`, `POST /api/comments` | threads public, posting behind the reader's bearer, one level of replies, everything moderated |
| `GET /api/questions?slug=`, `POST /api/questions`, `POST /api/signals/react` | the Q&A and the three reactions |
| `GET /api/search?q=` | server-side body search over live pieces (currently no browser caller; the app becomes its first) |
| `GET /api/news` | the market pulse board, public, cached 30 minutes |
| `GET /api/broker/public`, `/me`, `/live`, `/history`, `PUT/DELETE /api/broker/key` | the live portfolio, three audiences, keys sealed server-side or carried per-session in `x-broker-key` |
| `GET /api/courses/*` | the third-party course player's whole surface: catalogue behind admin, media behind 30-minute single-file tickets, `Range` forwarded, captions converted to WebVTT |
| `GET /api/routine/templates` plus Supabase direct | the routine tool |
| Supabase `auth/v1` and `rest/v1` | sign-in (magic link and Google), `progress`, `profiles`, `library`, `targets`, `scenarios`, `routines`, `routine_entries`, all behind RLS; the browser already does this with plain fetch and no client library, so the app can too |
| `/media/<key>` | every photo, immutable for a year |

Identity is one mechanism everywhere: the Supabase access token as
`Authorization: Bearer`, verified by the Worker against the
project's JWKS in `functions/_lib/reader.ts`. Admin is `isAdmin()`
against the same token.

## What the server grows, and it is small

Four things, three of them one-line-shaped. Nothing else in this
plan touches the site.

1. **A JSON manifest endpoint. Done.** `functions/api/site.ts`
   answers `GET /api/site`: the site, the menu, the accents, the
   sections, the tools, the skills, the term groups, the public
   pages and the counts, serialised out of `shared/content.ts`
   and `shared/nav.ts` at request time. It asks for half an hour
   of caching and does not get it: something at the edge answers
   `/api/*` with `no-store`, which the head of that file
   measures, so this costs one fetch a launch. The browser gets
   the same tables as an ES module at `/content.js` and does not
   call this, so it is in `SERVER_ONLY` in `scripts/check-api.ts`
   and in `PUBLIC` in `scripts/check-admin.ts`, each with the
   reason written out. `scripts/site-api.test.ts` is the guard.
2. **`/.well-known/assetlinks.json`. Written.**
   `aab/.well-known/assetlinks.json` names the package and carries
   the debug key's fingerprint. Nothing else claims the path:
   `run_worker_first` does not list it, no route matches it, and
   `aab/.assetsignore` does not cover it. A dot-directory IS
   uploaded, measured with `npx wrangler@4 deploy --dry-run`,
   which prints the asset-manifest size: adding a second file
   inside `aab/.well-known/` moved it and removing it put it back.

   **The package is `uk.co.reiad.library`**: the domain backwards,
   then the site's own name. It is a permanent identifier, so it
   is decided once, here, rather than at the first `gradle init`.

   **The fingerprint in it is the DEBUG key's**, from
   `keystore/debug.keystore` in the app repository, committed,
   with the password every Android debug keystore has had:
   `android`, alias `androiddebugkey`. That is not a credential
   leaking: a debug key cannot sign a Play release and authorises
   nothing beyond saying "this APK and the last one are the same
   app". It is committed because Android generates a debug
   keystore PER MACHINE, so an APK built in CI and one built on a
   laptop are signed differently and Android refuses to install
   either over the other, and because an app link verifies against
   ONE fingerprint.

   **A release key does not go in the repository.** It lives in CI
   as a secret and its fingerprint is a second line in the array,
   which takes several so an app link verifies for the sideloaded
   build and the store build alike. **Make that release keystore
   once and back it up.** The same package can never be signed by
   another key, so losing it means an installed app cannot be
   updated, only uninstalled and replaced, and every reader loses
   what the device was holding.

3. **One Supabase dashboard entry.** The project's auth
   configuration is not in the database and not in the tooling, so
   no migration, no script and no API call here reaches it. One
   value to add to the auth allowlist:
   **`uk.co.reiad.library://auth`**. Done on 22 August 2026.

   **A custom scheme rather than an App Link, and the reason is
   the dependency it removes.** The site's flow is the implicit
   one: `GET /auth/v1/authorize?provider=google&redirect_to=...`,
   with the tokens coming back in the fragment of whatever
   `redirect_to` names. An `https://reiad.co.uk/...` redirect
   would make signing in wait on a verified App Link, which waits
   on a fingerprint, which waits on a Play Console account. A
   scheme the app declares needs none of that. The https redirect
   can be added beside it later; two entries are allowed.

   The app opens the authorize URL in a Custom Tab, catches the
   redirect, and stores the session; `aab/src/account.ts` is the
   contract for everything after that: refresh 60 seconds early,
   treat a refresh that fails as signed out (locally, with no
   request), and never let a failed user lookup downgrade a live
   session.
4. **Push, only when it is wanted, and it is a real project.**
   Nothing push-shaped exists today: no listener in `aab/sw.js`,
   no subscription table, no mail provider behind the subscriber
   flow. Notifications mean a device-token table, a sender in the
   Worker, and a decision about what is worth interrupting
   somebody for. That is phase 7 if it is anything, and the app is
   whole without it.

## The two things a repository cannot do

Everything else in this plan is decided here, written here, or
checked here. Both of these are done, and neither gated phase 1,
which is signed out:

| | What |
| --- | --- |
| Supabase | `uk.co.reiad.library://auth` under Authentication, URL Configuration |
| assetlinks | the debug key's fingerprint, with the key committed at `keystore/debug.keystore` in the app repository. A release key adds a second line |

**They are independent of each other, deliberately.** The custom
scheme keeps sign-in off the fingerprint's critical path: the
second row is a nicety about how links behave, not a gate on the
account.

## The app itself

### One store of ticks, the same names

Progress lives in a small key-value store (DataStore) whose keys
are the site's storage keys, spelled identically, holding the same
JSON shapes: sets as string arrays, bookmarks as `{id, title,
stage, url?, ts}` objects, counts as strings. **Modelling this
"properly" in a relational schema is renaming a storage key, one
level up:** the strings and shapes are the sync contract with
`public.progress`, where the row key IS the localStorage key. Room
appears where there is genuinely relational local data: the
content cache, not the ticks.

Device-only keys stay device-only: `theme`, `audience`,
`tool-lang`, the workbook writings. The app keeps them under the
same names for its own sanity, not because anything syncs them.

### The sync engine, ported not reinterpreted

The app ports `aab/src/sync.ts`'s behaviour, not its
architecture. The contract, in the file's own terms: rules `set`,
`mark` and `count` per key; adopt on sign-in (the account's rows
overwrite the device, keys the account lacks are removed, nothing
local is uploaded, except ticks made while the fetch was in
flight); steady state is a three-way merge per key against a
`base` snapshot, sets as `(remote ∪ added) \ removed`, marks as
newest-`ts` wins, counts as max-wins unless this device went
backwards; any failed exchange drops `base` rather than trusting
half a conversation; a different account on the same device clears
the mirror first. Reset needs no special case because an absent
key is an empty set.

The triggers map one to one: the web syncs on a debounced key
change, on `visibilitychange`, on `pagehide` and on sign-in; the
app syncs on a debounced change, on foreground, on background (via
WorkManager so a killed process still sends its last tick) and on
sign-in. The push is the same PostgREST upsert with
`on_conflict=user_id,key` and no `user_id` in the body, because
the column defaults to `auth.uid()` and the client cannot name
whose rows it writes.

`aab/sync.test.ts` covers signing in, resetting, signing out, two
devices and the refresh regression; the app's sync tests reproduce
that list case for case before the engine is called done.

### Rendering a body: a closed vocabulary, so no WebView

A lesson or article body is sanitised HTML with a closed grammar:
the tag and class allowlists in `functions/_lib/sanitise.ts`,
about two dozen tags and twenty-one classes, guarded by checks so
they cannot grow silently. Closed grammar means a native renderer
is finite work: parse once into a block list, render blocks as
composables. Headings, paragraphs and inline marks become styled
text; `at-a-glance`, `side-note`, `note`, `ex`, `step-list`,
`figures` and the photo classes become the components the
stylesheet already describes; tables scroll horizontally inside
their own container; `checklist` items become checkpoint buttons
wired to `<school>-checks`, which is behaviour a WebView could
never have given cleanly. An unknown shape renders as plain
styled text rather than crashing, and the parser logs it, because
the allowlists changing is the one way this goes stale.

The engine renders article prose and lesson prose alike; it is
one module, for the reason `aab/editor.js` is one module on the
web: two renderers that disagree is the class of bug the
three-place rule exists for.

**The allowlist is a floor, not a promise.**
`/money/basics-1/share` carries a `<b>` in its stored body, which
the server's tag list does not include: the browser's sanitiser
renames `B` to `STRONG` on the way in and some prose predates or
bypassed that. So the renderer maps the synonyms the editor maps
(`b` to `strong`, `i` and `u` to `em`, a heading above `h3` down
to one) and renders anything it still does not know as plain
styled text, logged. A parser trusting the documented list would
have dropped a word's emphasis on day one, silently.

### Media, speech, and the platform's own things

- **Course video is Media3/ExoPlayer** over the ticket URLs. The
  server already forwards `Range` and answers `HEAD`, which is
  exactly what a seeking player needs; captions load as WebVTT
  from the captions endpoint with their own ticket. The two rules
  the web player lives by carry over: no player events ever mark a
  lesson (the button does), and tickets are re-requested when they
  expire mid-sitting.
- **Read-aloud is Android's TextToSpeech**, reading the same
  elements the web control reads and skipping the same furniture,
  with the Bangla-aware voice choice the web makes.
- **Deep links**: the app registers the site's own address shapes,
  `/insights/<slug>.html`, `/<school>/<stage>/<lesson>.html`, the
  hubs and the tools, so a shared link opens in the app once
  assetlinks is live. The app's internal navigation uses the same
  addresses as route arguments, which keeps one URL vocabulary
  across site and app.
- **Widgets and shortcuts**, late and cheap: a continue-reading
  widget off the bookmark keys, a year-of-days widget off
  `days-active`, and app shortcuts mirroring the three the PWA
  manifest already declares.

### The design language, mapped rather than imitated

The stylesheet is the specification: tokens first
(`next/styles/site.css` declares them all), then the six glass
kinds in `@layer glow`, and `DESIGN.md` for the sentences. The
mapping is mechanical where it matters:

- **Colour**: the oklch token pairs (light and dark) resolve to
  Compose colours at build time in the app repo, from a small
  script reading the published stylesheet, so a retuned accent on
  the site is a rebuild rather than a hand-edit. Per-section
  accents follow the nav table, as the site's `--accent` does.
- **Type**: Spectral, IBM Plex Sans and Mono, Noto Sans and Serif
  Bengali, Caveat, via Compose's Google Fonts provider with
  bundled fallbacks; the nine-step scale and the looser Bangla
  leading are a Typography object. Bangla-first labelling (Bangla
  line with the English sub, or the reverse in chrome) is a
  composable, written once.
- **Shape and metrics**: the radius ladder (5, 12, 18, 24, pill)
  and the 44px tap height become the Shapes and minimum touch
  target; the spacing ramp becomes the spacing constants.
- **The material**: cards, chips, panes, plates and grooves become
  a surface modifier with the same four numbers per kind. The lit
  edge and rim are drawn strokes; the pointer glow becomes a
  touch-position glow with the same asymmetry, in fast and out
  slow, because the asymmetry is most of what reads as material.
  Blur (the frost) uses RenderEffect where the device offers it
  and falls back to the solid fills, which is precisely the
  site's own `plain` fallback, so the degraded look is already
  designed.
- **Motion**: the duration set (0.16 to 0.45s, the 1.35s shimmer)
  and the tilt-on-device-orientation the site already does on
  phones, honouring the platform's reduced-motion setting the way
  the site honours the media query.

What is not attempted: pixel parity with the web. The app matches
the tokens, the voice and the affordances; it lays out like an
Android app.

### Offline is a state, not a cache accident

The service worker's offline story is "what you visited, plus the
hubs". The app is allowed to want things: the content cache stores
every curriculum and every lesson body of the schools a reader
follows (a bounded, known corpus), the recent pieces list, and
whatever was opened. Everything renders from the cache first and
revalidates behind, ticks work offline because they are local
writes, and sync catches up when the network returns. **The one
deliberate refusal carries over: headlines are never served stale
silently**; the pulse board says when it is showing yesterday.

## The order

Same shape as `PLAN.md`: ordered, and each phase makes the next
one smaller. A phase is done when its parity tests pass against
fixtures pulled from the live public API, and, for anything with
progress in it, when the storage keys it writes are asserted by
name the way `aab/schools/progress.test.ts` asserts them on the
web.

**Phase 0. The contracts, on the server.** The manifest endpoint,
the assetlinks file, the Supabase redirect entry. The only phase
that touches this repo, and it is small enough to be one pull
request. Everything after this happens in the app repo against a
live, sufficient API.

**Phase 1. Reading.** App shell (nav drawer or rail by width, the
audience orderings, theme), the four school hubs, ladders and
lesson pages, the three reading hubs and the article page, the
native body renderer, the content cache, local ticks with each
school's own semantics, checkpoints, bookmarks, the money
glossary (its term pages are basics-1 lessons and arrive through
the same API; the in-prose term links open in place, as they do
on the web), and the home screen: the door's ledger and its pair
of buttons per audience, both of which come down inside `DOOR` in
`/api/site`, plus the board's own cards, continue and pulse. There
is no featured card any more: it answered the audience switch with
one tile two screens down, and the switch moves the door's buttons
instead. No account yet: the site's own rule that everything
works signed out makes phase 1 shippable alone, and it is the
biggest phase because the renderer and the design system land
here.

**Phase 2. The account.** Sign-in (Custom Tab, both providers),
the session store, the sync engine and its test suite, the account
screen: overview and year of days, course bars, reading list and
notes (`public.library`, one row per page, the upsert that never
sends an empty note over a written one), targets, scenarios,
preferences (the same `reader-prefs` shape), export a copy, erase
everything, sign out. The profile settings with the filtered read.

**Phase 3. The tools.** The five calculators and the stock check,
ported to Kotlin against fixture outputs captured from
`aab/tools/stock.model.js` so the two implementations are held
together by tests rather than by intention; shareable state (the
same query-string encoding, so a link from the app opens on the
site and back); saved scenarios; the live portfolio over
`/api/broker/*` with the sealed-key and per-session flows, and
the broker key never stored unsealed anywhere on the device.

**Phase 4. Conversation and pulse.** Comments (read, post, the
one-level reply rule), questions and reactions, the market pulse
board with its honesty-about-staleness, search (the local index
the palette builds, backed by `/api/search` for body text), the
subscribe flow, and the two work-facing pages: about as a native
screen, contact as a native form posting to `/api/enquiries`.

**Phase 5. Practice and speech.** The practice books natively: day
walker, typed answers autosaved under the device-only keys, answer
reveal, day ticks with the per-school id shapes (`tag-` against
`day-`) that once bit the web, trackers and resume. Read-aloud.
The routine tool, which is the largest single screen set outside
phase 1.

**Phase 6. The admin's phone.** The courses player (Media3,
tickets, captions, quizzes that mark nothing, the same
`courses-*` keys), gated by the same `isAdmin()` answer the site
uses; nothing course-shaped ships in the binary, the catalogue
arrives only over the authenticated API, which is the same rule
`scripts/check-courses.ts` enforces on the web bundle.

**How it is installed.** An APK, signed by the author's own key,
carried to the handset, until the app is worth publishing. What
sideloading costs, each worth knowing rather than discovering: the
device has to be told to allow the install, nothing updates itself
so every build is carried over by hand, and an https link will not
open the app until that key's fingerprint is in the assetlinks
array. None of the three touches sign-in, which is on a scheme the
app declares.

**Phase 6.5, when it is worth publishing.** Play: the same
keystore if it is kept, the data-safety form (what the app holds
is the session, the ticks and, if saved, a sealed broker key
reference; there is no analytics SDK, matching a site that has
none), staged rollout.

**Phase 7, only if wanted. Notifications**, per the section above.

## What deliberately does not move

**The writing side.** The Studio, the editor, the share-card
drawer, the Notion import, the moderation queues, subscriber
administration. The editor is one module precisely because a
`contenteditable` cannot be safely duplicated, and an Android
re-implementation would be a third sanitiser and a second editor.
An admin who needs it on a phone has the site.

**The portfolio case studies.** Each is an interactive model built
for a desk and a hiring audience, and their audience is not
holding a phone. The app's portfolio screen renders the cards
natively and opens a model in the browser, which is one intent.

Also not moving: the feeds (a feed reader already reads them), the
break-glass article renderer, and the PWA itself, which keeps
working for everybody who is not on Android.

## Tests, the same discipline

The failure this repository is built around is the thing that
renders and does not work, and a fresh codebase does not get a
pass on it:

- Every ported behaviour lands with the list of what the web
  version does written as tests first: the sync engine's case
  list, the workbook's key shapes, the stock model's outputs, the
  sanitised-body renderer against every block class.
- Parity fixtures come from the public API and the two committed
  backups (`content/schools.backup.json`,
  `content/articles.backup.json` are already the site's own
  fixture convention), refreshed by a script, so app CI runs with
  no credential.
- Storage keys are asserted by name, in one test, so a rename
  fails loudly instead of losing somebody's ticks.
- A screenshot suite for the design system in both themes, because
  a token mapping that drifts looks exactly like one that has not.

## Risks, named

| Risk | The handling |
| --- | --- |
| oklch to sRGB conversion drift | tokens resolved by one script, checked by the screenshot suite, never hand-copied |
| Blur cost on cheap devices | the site's own `plain` material is the designed fallback |
| The implicit auth flow needs the fragment to survive the redirect | App Links deliver fragments; verified in phase 2's first week, with the custom-scheme fallback ready |
| Dot-directory asset upload for assetlinks | verified on a deploy before anything depends on it |
| The sanitiser vocabulary grows and the renderer lags | the app's parser logs unknown shapes and renders them as plain text; a periodic fixture refresh turns silence into a failing test |
| Two implementations of the stock model | fixture-locked, and the model file is small and stable |
| Course content on a personal device | same boundary as the web: nothing in the binary, API behind admin, tickets name one file for thirty minutes |

## Starting the build

**Phase 0 is done in this repository**: `functions/api/site.ts`,
`aab/.well-known/assetlinks.json`, and the Supabase auth
allowlist entry. What is left of it is the release fingerprint,
which gates nothing.

**The app repository.** Suggested name `reiad-android`. Kotlin,
one module. The dependency list, chosen to stay short: the
Compose BOM with Material 3 and Navigation, Room, DataStore,
Ktor client with kotlinx serialisation (one HTTP stack, not
two), Coil for images, Media3 for the player, WorkManager for
sync, Browser for the Custom Tab. Nothing else until a phase
demands it.

**What the building session reads first, from this repository:**

| File | What it is to the app |
| --- | --- |
| this file | the plan |
| `CLAUDE.md` | the rules, above all "What a reader has read" |
| `aab/src/sync.ts` | the sync contract and the key list |
| `aab/src/account.ts` | the auth flows and the session shape |
| `functions/_lib/sanitise.ts` | the whole grammar a body can hold |
| `shared/schools.ts` and `shared/curricula/` | ladder shapes, id and address arithmetic |
| `next/lib/progress.ts` | tick semantics and the money mapping |
| `next/styles/site.css` | every design token and the six kinds |
| `shared/look.ts` | the fonts, the sections, the head facts |
| `content/schools.backup.json` | the first parity fixture |

**The first slice of phase 1, in order:** fetch
`/api/schools/money` and render the ladder; fetch one lesson and
render its body through the block parser; wire the tick (a
button, `learn-read`); then the same for `deutsch`, where opening
marks; then the pieces list and one piece. Each step lands with
its parity test against the fixtures before the next starts. The
design tokens arrive with the first screen rather than after it:
a ladder drawn in framework defaults is a port that is also a
redesign, which is the thing the site's own ports never allowed
themselves.

**What proves phase 1 done:** every hub, ladder, lesson and piece
renders offline after one online visit; ticks and bookmarks
survive process death; the fixture suite passes against a fresh
pull of the public API; and the storage keys the app writes are
asserted by name in one test.

## What is not in here, deliberately

**iOS.** Everything above is the Android plan; the contracts
section is the part an iOS plan would share, and writing both at
once would have made this one vaguer.

**Kotlin Multiplatform.** Sharing logic between an app and a
TypeScript site is not on offer; sharing it with a future iOS app
is real but speculative, and the sync engine is the only piece
worth it. Revisit if iOS becomes a plan.

**A local-first database of everything.** The app caches what a
reader follows and opens. Mirroring the whole site would make the
first sync a download nobody asked for and every schema change a
migration; the corpus that must work offline (the followed
schools) is bounded and small.

**Server-driven UI, feature flags, A/B anything.** The site does
not experiment on its readers and the app does not start.
