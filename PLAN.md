# The plan

Ordered, and the order is the point: each phase makes the next one
smaller. `ARCHITECTURE.md` says where things end up and `DESIGN.md`
says what they look like. This says what happens next and how.

## The method, which applies to every phase

1. **Read what it claims.** These files state, in their own
   headers, the bug they exist for. That is the breakdown; it is
   already written.
2. **Test each claim.** Is the subject still there? A check
   written when the site was files walks `aab/**.html` and finds
   one slot where there are six.
3. **Prove the hole before fixing it.** Break the thing, watch it
   NOT fire. Setting `data-count="ratios"` to 99, for a model that
   scores 44, left `check-content.ts` reporting "every count agrees
   with the data". This step is what separates a found bug from an
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

## Phase 0. Delete what is already dead  **done**

`aab/deutsch/build-deutsch.mjs` and `aab/english/build-english.mjs`
are gone with the four `arbeitsbuch.html` / `workbook.html` files
they emitted, 2.2 MB shadowed by the routes that answer those
addresses. Verify a shadowed file with one fetch per URL before
deleting it, not after.

## Phase 1. The visible defects

The oldest debts, and they come before anything structural. The
numbers in `DESIGN.md` are the same list.

1. **The lesson footer.** "Mark complete and continue" and the
   status chip are different heights and share no baseline. One
   control height governs both.
2. **The text boxes.** "It should be the best looking thing here."
   Four implementations today: `ui/field.tsx`, the input rules in
   `@layer components`, the Studio's own, and
   `textarea[data-schrift]` in the practice book. One component,
   glass, paper texture, a real focus ring.
3. **The header and the rail.** The audience switch moves to the
   bottom of the rail. The top bar becomes navigation across every
   page, which is what a bar that wide should be doing.
4. **The course player's tab set** becomes `ui/tabs.tsx`. The
   account page and the tools hub are on it already; three tab
   sets is how they drifted in the first place.

## Phase 2. The component sweep

`scripts/component-debt.json` is the ledger and
`scripts/check-components.ts` only lets its total fall. Zero is
what "the design is consistent" means here. What is left is
`input` and `textarea`.

Two rules the first attempt was reverted for:

- **`.tile-value` and `data-tile` are a contract.** Six modules
  under `aab/portfolio/` find their figures with
  `[data-tile="x"] .tile-value` and write into them. `<StatTile>`
  has to emit both or every model on the site stops filling in.
- **Do not rewrite the wrapper.** An auto-close heuristic for
  `.tiles` mangled a file. Convert the leaves, leave the container.

The portfolio page's `work-card` and `svc-card` are deliberately
not converted: they carry a bespoke SVG where a deck card has an
icon tile, so they are a third component rather than a conversion,
and a port must not also be a redesign.

## Phase 3. The practice books  **done**

`aab/schools/workbook.js` is one engine where there were two, on
the arrangement `aab/schools/progress.js` already had: the DOM
vocabulary is fixed because one component draws both books, and
what a school passes in is its storage key, its curriculum, its
`dayId` and two words.

**`dayId` is an argument, and that is the part to not undo.**
English files a day as `term-1/day-3` and German as
`stufe-1/tag-3`. The engine built the German shape for both, so
English ticks were written correctly by `toggleDay` and looked for
under a name nothing had ever used.

`aab/schools/workbook.test.ts` drives both books against the
route's own markup.

## Phase 4. Audit each check, then move it  **done**

All five audited: `check-routes`, `check-css`, `check-csp`,
`check-sw`, `check-content`. No check is served any more.

What the audits found is one shape repeated, and it is the thing
to look for in the next check anybody reads: **a check whose
subject moved out from under it still passes.**

- `check-routes` walked every `.html` under `aab/`, which was the
  whole site when it was written and is two files now, so a dead
  link added to a route passed. It reads `next/app` and
  `next/components` too. Its article-slug loop read
  `liveArticles()` out of `content.js`, which holds none since the
  writing became rows, so it ran over an empty list; it reads
  `content/articles.backup.json`, which covers what the write path
  cannot: a slug that arrived by a migration or by hand.
- `check-csp` walked `aab/` and `app/src`, so a `fetch()` to a
  disallowed host passed in a Next component and failed in
  `aab/app.js`. It reads `next/app` and `next/components` now, and
  not `next/lib`, which is the database reads and runs on the
  Worker. Every host a route names has a reason in `NOT_FETCHED`.
- `check-sw` was current on all four claims, and the audit found
  what it did not ask: **nothing held a precached module's static
  imports to being precached too.** It went wrong again the day
  both practice books were fixed, the callers staying precached
  and the engine they became four lines over not. Static imports
  only: `signin.js` is imported lazily inside a try, and an
  offline visit without it is a page with no sign-in button rather
  than a broken one.
- `check-css` was current on every claim, so again the finding was
  what it did not ask: a rule with a class of its own that no
  markup in this repository carries. 236 lines had gone dead. The
  count is a ratchet at zero.

Its dead-rule test is deliberately broader than the leak check's
`usedIn()` next door. That one looks only in a class attribute,
which is right for asking whether a school's rule is anchored by a
class the school's pages carry. For "is this rule dead" any
mention counts, because half the site writes
`className={plain ? "art" : "art stage-art"}`: a pattern anchored
to the quotes called two live classes dead on the first run.

**A test belongs beside the thing it tests**, so a test moves when
its subject does and not before. Moving them first would be files
pointing back into a directory they had just left.

## Phase 5. Off `aab/`

`ARCHITECTURE.md` has the detail. In order:

- **A. The stylesheet into Next. Done.**
- **B. The browser modules**, classified three ways: a component
  in disguise, genuinely post-hydration, or shared with the
  Studio.
- **C. The account page**, whose whole body is built in the
  browser by `aab/src/account-page.ts`. That is why nothing on it
  uses a component.
- **D. The Studio**, importing `next/components/ui` rather than
  keeping its own controls.

## Phase 5.5. Drop `.html` from every address  **done**

Every route directory under `next/app/` lost its `.html`, and
every address that was live before it is a 301 in
`aab/_redirects`, one line each.

**Two things the plan said and got wrong, so do not redo them:**

An `<a href>` in a lesson body must NOT be rewritten in D1. An
article's address and a school lesson's address KEEP their
`.html`, because there the suffix is part of a slug rather than
part of a route: it is in the rows, in every link inside every
lesson body, and in the `public.library` row of everybody who has
saved a piece. The redirects are not a safety net for the bodies,
they are what the bodies run on.

And there is no rule in `check-routes.ts` saying no internal link
ends in `.html`: it would fail on every article and every lesson
on the site. What proves this finished is what was already there.
`check-routes.ts` traces every source in `_redirects` to whatever
finally answers it, and `next/parity.test.ts` asks the real Worker
for each address.

`/skills/courses/` is the one section that TOLERATES its old
addresses rather than redirecting them: 845 of them are generated
out of a Drive folder, so a rule each would go stale the first
time that folder changed. `shared/courses.ts` says so beside
`lessonOf`.

What had to move together, which is the list to reuse for any
future address change:

| | |
| --- | --- |
| the route folders under `next/app/` | `about.html/page.tsx` became `about/page.tsx`; four of them needed a `(hub)` route group, because a layout moved up a level would have wrapped its siblings |
| `next/app/[section]/[slug]/index.html/` | merged into the article's own `page.tsx`, which dispatches on `isSchool()`: a stage's ladder and an article share one address shape |
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
| `scripts/build-og.ts` | `opengraph-image.tsx`, which also retires the 1.9 MB `aab/og/` directory |
| `scripts/build-meta.ts` | `sitemap.ts`, `robots.ts`, and a route handler for the feed |
