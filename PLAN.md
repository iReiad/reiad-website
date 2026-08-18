# The plan

Ordered, and the order is the point: each phase makes the next one
smaller. `ARCHITECTURE.md` says where things end up and `DESIGN.md`
says what they look like. This says what happens next and how.

## The method, which applies to every phase

Proven on `check-content.mjs` on 18 August 2026, and it found a
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

`/deutsch/stufe-1/arbeitsbuch.html` matches a `NEXT_ROUTES`
pattern and `next/app/[section]/[slug]/arbeitsbuch.html/page.tsx`
answers it, so the file is never reached. Verify with one fetch
per URL before deleting, not after.

## Phase 1. The visible defects

The oldest debts. Some were reported in the first round of
screenshots and are still there, which is why they come before
anything structural.

1. **The breadcrumb.** `ui/crumbs.tsx` is written and unwired.
   `aab/src/crumbs.ts` guesses three things from `location.pathname`
   and `document.title`, and gets the mount point wrong on the
   course pages: it targets `main > .wrap`, falls back to bare
   `main`, and the course shell has no wrap, so the trail sits
   against the window edge. A route knows its own trail. Wire it,
   leave the module for `404.html` and `offline.html`.
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

`scripts/check-components.mjs` records the count and only lets it
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

`aab/schools/workbook.test.mjs`, 40 checks, drives both books
against the route's own markup.

## Phase 4. Audit each check, then move it

The method at the top, applied to the rest. Biggest first, one per
change, because each will surface something: none of them have
been read since 250 pages moved out from under them.

`check-routes` (260) **done** · `check-csp` (157) **done** ·
`check-css` (558) · `check-sw` (143) · then the nine tests.

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

`/about.html`, `/money/index.html`, `/deutsch/stufe-1/anfang.html`.
Those are the addresses of FILES, and there have been no files
behind them since Stage 11.7. A Next route serves `/about` and
`/money/` and needs no extension, and the extension is the last
visible piece of the old system on a reader's screen.

**It is not a rename.** 251 of those addresses are live, shared
and indexed, and the rule this repository runs on is that a URL
somebody shared does not move. So every old address gets a
permanent 301 and keeps answering forever:

| | |
| --- | --- |
| the route folders under `next/app/` | `about.html/page.tsx` becomes `about/page.tsx` |
| `NEXT_ROUTES` in `worker.js` | the patterns match the extension today |
| `run_worker_first` in `wrangler.toml` | same |
| `next/lib/nav.ts` | sixteen hrefs, and it is the one table |
| `stageUrl`, `lessonUrl`, `stageBase` in `shared/schools.ts` | which is where 251 of them are computed |
| every `<a href>` in a lesson body | in D1, so one UPDATE and a re-export |
| the canonicals, `sitemap.xml`, `feed.xml`, `og:url` | `build-meta.mjs` writes these |
| `aab/_redirects` | one line per old address |
| `check-routes.mjs` | a new rule: no internal link ends in `.html` |

Two things make this safe to leave until here. It touches nothing
structural, so it can happen at any point without changing what
any other phase does. And `check-routes.mjs` already walks every
link on the site, so the rule that proves it finished is nine
lines in a check that exists.

**`404.html` and `offline.html` keep theirs**, for the reason they
are exceptions to everything else: they are files, and a file has
an extension.

## Phase 6. Rebuild the two builders the Next way

The only place "from scratch" is right, because the framework has
a better idiom than a custom script:

| now | becomes |
| --- | --- |
| `build-og.mjs`, 418 lines | `opengraph-image.tsx`, which also retires the 2.1 MB `og/` directory |
| `build-meta.mjs`, 161 lines | `sitemap.ts`, `robots.ts`, and a route handler for the feed |

---

## What is not in here, deliberately

**Renaming every `.mjs` at once.** Forty of the seventy are safe
today and it would be one mechanical change, but it would touch
five workflow files and every doc while saying nothing about the
site. The ones that matter move in Phase 4 anyway, and the four in
`next/` stay `.mjs` for a real reason: that package is not typed
as a module, so `.js` there would be CommonJS and every import
would fail.
