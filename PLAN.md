# The plan

Ordered, and the order is the point: each phase makes the next one
smaller. `ARCHITECTURE.md` says where things end up and `DESIGN.md`
says what they look like. This says what happens next and how.

## The method, which applies to every phase

Proven on `check-content.ts` on 18 August 2026, and it found a
real hole in twenty minutes.

1. **Read what it claims.** These files state, in their own
   headers, the bug they exist for. That is the breakdown; it is
   already written.
2. **Test each claim.** Is the subject still there? Four of
   `check-content`'s five claims were current. The fifth walked
   `aab/**.html` for `[data-count]` slots, and the pages had moved
   to routes: one slot where it looked, six where they were.
3. **Prove the hole before fixing it.** Break the thing, watch it
   NOT fire. Setting `data-count="ratios"` to 99, for a model that
   scores 44, left the check reporting "every count agrees with
   the data". This step is what separates a found bug from an
   assumed one.
4. **Fix, then red-then-green.** Break it again, watch it fail,
   put it back, watch it pass.

**Do not rewrite what can be corrected.** `check-content` needed
nine lines. A rewrite would have cost hours and lost the CLAIMS
table, the Bangla-digit handling and the case-study reachability
rule, all still correct. The value is in the reading.

**Nothing moves without step 3.** A check that quietly stops
catching things looks exactly like a check that passes, which is
the failure this whole repository is built around.

---

## Phase 0. Delete what is already dead

Free, verifiable, and it shrinks every later phase.

| | |
| --- | --- |
| `aab/deutsch/build-deutsch.mjs`, `aab/english/build-english.mjs` | 1,473 lines that build four HTML files |
| the four `arbeitsbuch.html` / `workbook.html` files | 2.2 MB, shadowed by the routes since Stage 11.7 |
| the comment in `wrangler.toml` saying "The four practice books are files still" | it stopped being true when the routes landed |

`/deutsch/stufe-1/arbeitsbuch` matches a `NEXT_ROUTES` pattern
and `next/app/[section]/[slug]/arbeitsbuch/page.tsx` answers it,
so the file is never reached. Verify with one fetch
per URL before deleting, not after.

## Phase 1. The visible defects

The oldest debts. Some were reported in the first round of
screenshots and are still there, which is why they come before
anything structural.

1. **The breadcrumb. Done.** `shell.tsx` draws `ui/crumbs.tsx` in
   the top bar, from the trail `next/lib/crumbs.ts` reads out of
   `shared/nav.ts`, so a route knows its own trail rather than
   guessing three things off `location.pathname` and
   `document.title` and getting the mount point wrong on the
   course pages. The module was to stay for `404.html` and
   `offline.html`; it went instead, and neither page has a trail
   at all.
2. **The lesson footer.** "Mark complete and continue" and the
   status chip are different heights and share no baseline. One
   control height governs both.
3. **The text boxes.** "It should be the best looking thing here."
   Four implementations today: `ui/field.tsx`, the input rules in
   `@layer components`, the Studio's own, and
   `textarea[data-schrift]` in the practice book. One component,
   glass, paper texture, a real focus ring.
4. **The header and the rail.** The audience switch moves to the
   bottom of the rail. The top bar becomes navigation across every
   page, which is what a bar that wide should be doing.
5. **The account tab bar**, which is not the design language. It
   becomes `ui/tabs.tsx`, shared with the course player and the
   tools tab set, because three tab sets is how they drifted.

## Phase 2. The component sweep

**The `.stat` count in the first version of this was wrong.** It
came from a grep for `className="stat`, which matches
`.statement`, the section wrapper on the case studies, and there
is no `.stat` on this site at all. 50 `.tile` and 27 `.cell` were
right.

Done: the 50 tiles are `<StatTile>` and the 13 plain cells are
`<GoCard>` or `<InfoCard>`. What is left of the 27 is the
portfolio page's own two kinds, `work-card` and `svc-card`, which
carry a bespoke SVG where a deck card has an icon tile. Those are
a third component rather than a conversion, and a port must not
also be a redesign.

The rest of the ledger in `scripts/component-debt.json` is the
real remaining sweep: `section-label` 43, `button` 42, `input`
37, `chip` 26, `chip-class` 21.

Two things learned from the first attempt, which was reverted:

- **`.tile-value` and `data-tile` are a contract.** Six modules
  under `aab/portfolio/` find their figures with
  `[data-tile="x"] .tile-value` and write into them. `<StatTile>`
  has to emit both or every model on the site stops filling in.
- **Do not rewrite the wrapper.** An auto-close heuristic for
  `.tiles` mangled a file. Convert the leaves, leave the container.

`scripts/check-components.ts` records the count and only lets it
fall. 245 at the start, 223 now, and zero is what "the design is
consistent" means here.

## Phase 3. The practice books, which did not work

**Done, and it was worse than this said.** The English book was
the one reported: `components/workbook.tsx` renders both books
with the German vocabulary, `.buch-tag`, `data-schrift`,
`data-antwort`, and `aab/english/workbook.js` keyed on `.wb-day`,
`data-wb-write`, `data-wb-done`. Nothing saved, nothing revealed
an answer, nothing ticked.

The German book did not run at all, which nothing had noticed.
Both modules opened with

    const book = document.getElementById("tage");
    const articles = [...book.querySelectorAll(".buch-tag[data-tag]")];

at the top level, and the route that replaced the generated page
had no element with that id. `book` was null and the second line
threw before the first function ran.

`aab/schools/workbook.js` is one engine, on the arrangement
`schools/progress.js` already had: the DOM vocabulary is fixed
because one component draws both books, and what a school passes
in is its storage key, its curriculum, its `dayId` and two words.
776 lines became 450.

`dayId` is an argument for a reason found by the test written
with it: English files a day as `term-1/day-3` and German as
`stufe-1/tag-3`. The engine built the German shape for both, so
the English ticks were written correctly by `toggleDay` and
looked for under a name nothing had ever used.

`aab/schools/workbook.test.ts`, 40 checks, drives both books
against the route's own markup.

## Phase 4. Audit each check, then move it

The method at the top, applied to the rest. Biggest first, one per
change, because each will surface something: none of them have
been read since 250 pages moved out from under them.

All five **done**: `check-routes` (260), `check-css` (558),
`check-csp` (157), `check-sw` (143), `check-content` (audited
earlier the same day). No check is served any more.

**What the first audit found.** Five claims in its header, three
still true and two that had quietly stopped being:

| | |
| --- | --- |
| dead links | it walked every `.html` under `aab/`, which was the whole site when it was written and is three files now. A link to a page that does not exist, added to a route, passed. It reads `next/app` and `next/components` too, and went from 53 targets to 72. |
| bad article slugs | it read `liveArticles()` from `content.js`, which holds none since the writing became rows, so the loop ran over an empty list. It reads `content/articles.backup.json`, which is the nightly export of the live rows and covers what the write path cannot: a slug that arrived by a migration or by hand. |
| redirect loops | current |
| overlapping `run_worker_first` | current |
| a check or a test published as a page | current |

Each was proved before being fixed and again after, the way the
method says.

**`check-csp` had one hole and it was the same one.** It walked
`aab/` and `app/src`, which was every line of browser code when it
was written. A `fetch()` to a host `connect-src` does not allow,
added to a Next component, passed; the same line in `aab/app.js`
failed. It reads `next/app` and `next/components` now, and not
`next/lib`, which is the database reads and runs on the Worker.

Widening it surfaced six hosts the routes name and nothing had
accounted for: four profile links on the About page and the two
webfont preconnects. Each has a reason in `NOT_FETCHED` now, which
is the discipline that list exists for. The webfonts were in it
once and left when the Studio was archived, under a note saying
they would come back the day something named them again.

**`check-sw` was current on all four of its claims**, and the
audit found what it does not ask rather than what has stopped
being true: nothing held a precached module's static imports to
being precached too. `app.js` imports `pieces.js` and the note
beside that entry says why it must be in the list, which meant
the reasoning was written down and applied by hand. It went wrong
again on 18 August 2026, in the commit that made both practice
books work: the callers stayed precached and the engine they
became four lines over was not.

Static imports only. `signin.js` is imported lazily inside a try,
and the entry above it says an offline visit without it is a page
with no sign-in button rather than a broken one.

**`check-css` was current on every claim it makes**, which was
worth establishing rather than assuming: it already walks
`next/app`, `next/components` and `next/lib`, and reads the
schools' prose out of the snapshot, both added when the pages
became rows. All four claims were shown to fire.

So again the finding was what it does not ask: a rule with a
class of its own that no markup in this repository carries. That
is how 236 lines went dead without anybody noticing, and they
were found by hand rather than by anything here. Seven survived
and are gone; the count is a ratchet at zero.

Its test is deliberately broader than the leak check's `usedIn()`
next door. That one looks only in a class attribute, which is
right for asking whether a school's rule is anchored by a class
the school's pages carry. For "is this rule dead" any mention
counts, because half the site writes
`className={plain ? "art" : "art stage-art"}`: a pattern anchored
to the quotes called two live classes dead on the first run.

### The tests

Audited on the two questions that matter for a test rather than
for a check, and both came back clean.

**Does it run, or does it skip and look like a pass?** Every test
in `check-all.ts` runs. Every test that needs a browser or a
build says so and exits, loudly: `studio`, `studio-publish`, the
desk's and the Studio's own. `interactive` and `account` find a
browser here and run.

**Has its subject moved out from under it?** No. `courses` is
about `aab/src/courses.ts`, `studio` about `aab/editor.js`,
`sync` about `aab/sync.js`, and the schools' three about
`aab/schools/`. Each subject is still where the test looks.

Which is why the tests do NOT move yet. A test belongs beside the
thing it tests, so they move when their subjects do, in Phase 5's
Stage B. Moving them first would be five files pointing back into
a directory they had just left.

They move to `scripts/` as they are audited, which is also when
they can lose the `.mjs` extension: the root declares
`"type": "module"`, so `.js` behaves identically there. Inside
`aab/` the extension is load-bearing, because `.assetsignore`
matches `check-*.mjs` and that pattern is the only thing stopping
the tools being served at public URLs. Moving them out is what
retires that question rather than guarding it.

## Phase 5. Off `aab/`

`ARCHITECTURE.md` has the detail. In order:

- **A. The stylesheet into Next.** Blocked on a small
  `aab/fallback.css` first, because `404.html` and `offline.html`
  are files and cannot use a hashed asset, and `sw.js` precaches
  `/styles.css` and `/tailwind.css` by exact path.
- **B. The 32 browser modules**, classified three ways: a
  component in disguise, genuinely post-hydration, or shared with
  the Studio.
- **C. The account page**, whose whole body is built in the
  browser by 950 lines of `account-page.ts`. That is why nothing
  on it uses a component.
- **D. The Studio and the desk**, importing `next/components/ui`
  rather than keeping their own controls.

## Phase 5.5. Drop `.html` from every address

**Done, and two lines of the plan below were wrong.** Every route
directory under `next/app/` lost its `.html`: `/about`, `/skills`,
`/money/basics-1`, `/deutsch/stufe-1/arbeitsbuch`. Every address
that was live before it is a 301 in `aab/_redirects`, one line
each, and that file is now the description of the mechanism.

The plan said every `<a href>` in a lesson body would be rewritten
in D1 with one UPDATE. It was not, and it must not be: an
article's address and a school lesson's address KEEP their
`.html`, because there the suffix is part of a slug rather than
part of a route. It is in the rows, in every link inside every
lesson body, and in the `public.library` row of everybody who has
saved a piece. So the redirects are not a safety net for the
bodies, they are what the bodies run on.

The plan also wanted a new rule in `check-routes.ts`: no internal
link ends in `.html`. That rule would fail on every article and
every lesson on the site. What proves this finished instead is
what was already there: `check-routes.ts` traces every source in
`_redirects` to whatever finally answers it, and
`next/parity.test.ts` asks the real Worker for each address.

`/skills/courses/` is the one section that TOLERATES its old
addresses rather than redirecting them: 845 of them are generated
out of a Drive folder, so a rule each would go stale the first
time that folder changed. `shared/courses.ts` says so beside
`lessonOf`.

| | |
| --- | --- |
| the route folders under `next/app/` | `about.html/page.tsx` became `about/page.tsx`; four of them needed a `(hub)` route group, because a layout moved up a level would have wrapped its siblings |
| `next/app/[section]/[slug]/index.html/` | merged into the article's own `page.tsx`, which dispatches on `isSchool()`: a stage's ladder and an article now share one address shape |
| `NEXT_ROUTES` in `worker.js` | the patterns lost the extension |
| `run_worker_first` in `wrangler.toml` | same, and `/money/*` replaced `/money/*/*` because a two-segment ladder cannot be named without a star |
| `shared/nav.ts` | sixteen hrefs, and it is the one table |
| `stageUrl` and `workbookUrl` in `shared/schools.ts` and the four `shared/curricula/` | where the school addresses are computed |
| the canonicals, `sitemap.xml`, `feed.xml`, `og:url`, the JSON-LD | `build-meta.ts` and `shared/look.ts` |
| `robots.txt` | `Disallow: /studio/` stopped covering `/studio` the moment the trailing slash left the address |
| `aab/_redirects` | one line per old address |

**`404.html` and `offline.html` keep theirs**, for the reason they
are exceptions to everything else: they are files, and a file has
an extension.

## Phase 6. Rebuild the two builders the Next way

The only place "from scratch" is right, because the framework has
a better idiom than a custom script:

| now | becomes |
| --- | --- |
| `build-og.ts`, 418 lines | `opengraph-image.tsx`, which also retires the 2.1 MB `og/` directory |
| `build-meta.ts`, 161 lines | `sitemap.ts`, `robots.ts`, and a route handler for the feed |

---

## What is not in here, deliberately

**Renaming every `.mjs` at once.** Forty of the seventy are safe
today and it would be one mechanical change, but it would touch
five workflow files and every doc while saying nothing about the
site. The ones that matter move in Phase 4 anyway, and the four in
`next/` stay `.mjs` for a real reason: that package is not typed
as a module, so `.js` there would be CommonJS and every import
would fail.
