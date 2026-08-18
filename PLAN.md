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

93 hand-written call sites in routes, all convertible today:
50 `.tile`, 16 `.stat`, 27 `.cell`.

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

## Phase 3. The English practice book, which does not work

`components/workbook.tsx` renders both books with the German
vocabulary: `.buch-tag`, `data-antwort`, `data-schrift`.
`aab/english/workbook.js` keys on `.wb-day`, `data-wb-answers`,
`data-answers`. So on the English book nothing saves, nothing
reveals an answer and nothing ticks. It renders, and it is not
finished.

One component needs one module, taking its storage keys as
arguments the way `schools/progress.js` already does.
`english-write` and `deutsch-schrift` are in real browsers and
must not be renamed.

## Phase 4. Audit each check, then move it

The method at the top, applied to the rest. Biggest first, one per
change, because each will surface something: none of them have
been read since 250 pages moved out from under them.

`check-css` (558) · `check-routes` (260) · `check-csp` (157) ·
`check-sw` (143) · then the nine tests.

They move to `scripts/` as they are audited, which is also when
they can lose the `.mjs` extension: the root declares
`"type": "module"`, so `.js` behaves identically there. Inside
`aab/` the extension is load-bearing, because `.assetsignore`
matches `check-*.mjs` and `*.test.mjs` and those patterns are the
only thing stopping the tools from being served at public URLs.
Moving them out is what retires that question.

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
