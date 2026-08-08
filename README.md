# reiad.co.uk

A static site with a dynamic half. Every file in `aab/` is served as-is — no
framework, no build step, no dependencies — and a Worker over a D1 database
adds publishing, reader questions, subscribers, enquiries and analytics on
top.

**The two halves are one site.** Every dynamic feature checks whether the
database is connected and falls back to the static behaviour if it isn't. So
the site works today, unchanged, and each feature switches on the moment you
run `./setup.sh` — there is no second version to maintain in between.

## Turning the dynamic half on

**See [SETUP.md](SETUP.md).** Short version: paste your D1 database ID into
`wrangler.toml`, commit, then open `/studio.html` and set a passphrase. The
tables create themselves — there's no schema step, and no dashboard binding to
click, because `wrangler.toml` declares it.

`./setup.sh` does the same thing from a terminal if you'd rather (it also
creates the database, if you haven't).

Then **writing a piece and pressing "Publish to the site" puts it live
immediately** — no file to move, no commit, no push.

## What the dynamic half gives you

| Feature | Where |
| --- | --- |
| One-click publishing | `/studio.html` → Publish |
| Reader questions, moderated | bottom of every article; queue in the Studio |
| Reactions (helpful / confusing / go deeper) | bottom of every article |
| Subscriber list, confirmed opt-in, CSV export | Insights page; list in the Studio |
| Client enquiry pipeline (new → replied → closed) | contact form; pipeline in the Studio |
| Page analytics that can't identify anyone | Studio → What's read |
| Full-text search across article bodies | `/api/search` |

## The Learn area

`/learn/` is a course, not a glossary: eight stages from "I have never
invested" to research level, in Bangla.

| Stage | | What it covers |
| --- | --- | --- |
| ধাপ ০ | হাতেখড়ি · Starter Guide | Eight steps to actually start investing in Bangladesh. Lives **inline on `/learn/`** — a first-timer shouldn't have to navigate anywhere to be told what to do first. |
| ধাপ ১ | ভিত্তি · শব্দগুলো শিখুন | The original eighteen terms, still at `/learn/terms/*.html` |
| ধাপ ২ | ভিত্তি · বাজারটা পড়তে শিখুন | Why prices move, when to buy/sell/hold, sectors, institutions, live apps |
| ধাপ ৩ | ভিত্তি · নিজে যাচাই করুন | Finding data in Bangladesh, reading the three statements, deciding |
| ধাপ ৪–৬ | মাঝারি ১–৩ | Coursework, dissertation, working in the market — *structure live, text being written* |
| ধাপ ৭ | গবেষণা স্তর | Research level — *structure live, text being written* |

**`aab/learn/curriculum.js` is the one file you edit.** It holds the whole
tree — schools → stages → sections → lessons. The hub, the stage pages, the
breadcrumbs, the menu, the Ctrl+K palette and the sitemap all read from it,
so renaming a stage there renames it everywhere at once.

### Adding or editing a lesson

1. Add the lesson to its stage in **`aab/learn/curriculum.js`**.
2. Write the body in **`aab/learn/lessons/<stage>.js`**, keyed by slug.
   (Skip this and the lesson ships as a proper "আসছে" page rather than a
   404 — a listed thing is always somewhere you can go.)
3. `node aab/learn/build-lessons.mjs` — writes the stage and lesson pages.
4. `node aab/build-meta.mjs && node aab/check-routes.mjs`.

Generated pages are committed as ordinary static files; the site never
depends on the generator having been run. The starter guide's eight steps
are the exception — they are hand-written in `aab/learn/index.html`, since
they *are* that page.

### Reading progress

Kept in `localStorage` on the reader's own device, never sent anywhere, no
account. Opening a lesson ticks it off; returning to `/learn/` shows a
resume card and scrolls to the stage they were in. `aab/learn/progress.js`
is the only file that touches that storage.

## Two front doors

A recruiter and a Bangladeshi reader learning about savings want opposite
halves of this site, so the home page asks once and remembers
(`aab/audience.js`). The choice reorders the header nav, the overlay menu
and the search ranking — it never hides anything, and the footer switch
flips it back on any page.

## Testing

```sh
npx wrangler dev                    # the real Cloudflare runtime, local D1
./test-api.sh                       # 52 checks over every endpoint
node aab/check-routes.mjs           # catches redirect loops before deploying
node aab/check-sw.mjs               # did a precached file change without a VERSION bump?
node aab/portfolio/dissertation.test.mjs   # 141 checks on the statistics engine
node aab/learn/build-lessons.mjs    # regenerate the Learn pages
```

## Publishing an article — the manual way

This still works, and is the fallback when the database isn't connected.

1. Open **`/studio.html`** and unlock it (see *Studio access* below).
2. Paste the article (from Word, Google Docs, Notion, anywhere). Paste or drag
   in the photos — they get resized to 1600px and re-encoded as WebP, which
   also strips the location data phones hide in JPEGs.
3. **Download the page** → put the `.html` file in `aab/insights/`.
   (Photos are embedded in the file. If the size meter goes gold or red,
   use **Download .zip** instead and unzip page + `photos/` into `insights/`.)
4. **Get the index entry** → paste that block at the top of the `ARTICLES`
   list in `aab/content.js`. That single entry is what puts the card on the
   Insights page, the piece in Ctrl+K search, and the item in the RSS feed.
5. Run `node aab/build-meta.mjs` to refresh the feed and sitemap.
6. Commit and push.

Prefer writing HTML by hand? Copy `aab/insights/_template.html` — it produces
the identical layout and documents every piece you might need.

## Studio access

`/studio.html` is gated, and how strong that gate is depends on whether the
database is connected.

**With D1 connected — a real login.** The passphrase is stretched in the
browser (PBKDF2-SHA256, 210,000 iterations) and never sent; the server stores
and compares a fast hash of the derived key, in constant time. The session is a
token stored server-side as a hash, handed to the browser as an HttpOnly,
SameSite=Strict cookie that page JavaScript cannot read. Every admin endpoint
re-checks it, wrong guesses are rate-limited, and you can revoke every session
at once. Set the passphrase by visiting `/studio.html` after setup.

The stretching runs in the browser for a blunt reason: a Worker on the free
plan gets 10ms of CPU per request and 210,000 iterations costs about 30ms, so
doing it server-side got every login killed mid-request. Moving it costs
nothing in strength — stealing the database still leaves an attacker running
210,000 iterations per guess — and `functions/_lib/auth.js` explains the
trade-off in full.

**Without D1 — the old browser-side gate.** It keeps the tool away from
passers-by and out of search results, and it is not cryptographic protection of
anything, because a static site has no server to ask. The lock screen says
which mode it's in.

## Files

| Path | What it is |
| --- | --- |
| `aab/styles.css` | The whole design system in nine `@layer`s: tokens → base → layout → components → menu → tools → article → studio → utilities |
| `aab/app.js` | Theme, overlay menu, Ctrl+K palette, keyboard shortcuts, prerender rules, article cards, service-worker registration |
| `aab/content.js` | **The one file you edit to publish.** Articles, Bangla terms, tools, pages |
| `aab/api.js` | Browser side of the dynamic layer — returns null instead of throwing when there's no backend |
| `aab/auth.js`, `auth-config.js` | The Studio's gate: server session when available, browser-side fallback |
| `aab/admin.js` | The dashboard — questions, subscribers, enquiries, stats |
| `aab/engage.js` | Reactions and reader Q&A; attaches itself to any article page |
| `worker.js` | **The entry point.** Routes `/api/*` and `/insights/:slug` to `functions/`, and hands everything else to the static assets |
| `functions/` | The request handlers, written in the Pages Functions shape (`onRequest`, `context.params`, `context.next()`). `worker.js` maps them to paths |
| `functions/_lib/` | Database, HTTP helpers, server-side auth, server-side HTML sanitiser |
| `aab/schema.sql` | The database. Also applied automatically on first request |
| `setup.sh` | One-time Cloudflare setup |
| `test-api.sh` | 52 end-to-end API checks |
| `aab/studio.html`, `studio.js` | The Article Studio |
| `aab/tools/` | The five calculators |
| `aab/crumbs.js` | The path line on every page, built from the curriculum and `PAGES`, plus its `BreadcrumbList` JSON-LD |
| `aab/audience.js` | The two front doors — learner or recruiter — and what the answer reorders |
| `aab/learn/curriculum.js` | **The one file you edit for Learn.** Every stage, section and lesson |
| `aab/learn/index.html` | The hub — hand-written, because the eight starter steps live in it |
| `aab/learn/hub.js` | The hub's live layer: steps, ladder, contents index, resume card, filter |
| `aab/learn/progress.js` | The only file that touches reading progress in `localStorage` |
| `aab/learn/icons.js` | The stroke icons every step and stage is remembered by |
| `aab/learn/stage.js` | Ticks and the "continue" button on a stage's contents page |
| `aab/learn/lessons/` | Lesson text, one module per stage |
| `aab/learn/build-lessons.mjs` | Writes the stage and lesson pages. Not a build step — run it and commit what it writes |
| `aab/learn/terms/` | The original eighteen term pages, at the URLs they were published on |
| `aab/pulse.js` | The auto-updating market-news list |
| `aab/sw.js` | Service worker — offline reading, never stale articles |
| `functions/api/news.js` | Serves `/api/news` — the market-pulse feed |
| `aab/_headers`, `_redirects` | Cloudflare security headers, CSP and redirects |
| `aab/check-routes.mjs` | **Run before deploying.** Walks every URL through the routing rules and fails on loops, dead ends and broken links |
| `aab/build-meta.mjs` | Regenerates `feed.xml`, `sitemap.xml`, `robots.txt` |
| `aab/build-og.mjs` | Re-renders the social share images in `og/` (needs Playwright) |
| `aab/portfolio/` | The four case studies. Each is a page, a DOM-free engine (`*.model.js`) and its charts (`*.js`) |
| `aab/portfolio/dissertation.*` | The MSc dissertation case study: transcribed tables and extracted series in `.data.js`, Welch/noncentral-t statistics in `.model.js`, and `.test.mjs` to check them |

## Keyboard

`Ctrl/Cmd K` or `/` search · `M` menu · `T` theme · `?` shortcuts ·
`G` then `H`/`L`/`I`/`T` to jump to Home, Learn, Insights or Tools.

## Local preview

The site uses root-absolute URLs and ES modules, so `file://` won't work:

```sh
cd aab && python3 -m http.server 8000
```

Then open <http://localhost:8000>. `_headers` and `_redirects` are Cloudflare
features that do nothing locally, so before pushing anything that touches them:

```sh
node aab/check-routes.mjs
```

That emulates the routing and catches redirect loops, which are otherwise
invisible until the site is live and a page simply refuses to load.

**Never add "pretty URL" rules to `_redirects`.** Static assets already serve
`/about.html` at `/about` and redirect the `.html` form to it; a rule pointing
the other way is an infinite loop.

## Theme

`<html data-theme="dark|light">` forces a theme; no attribute means "follow the
OS". The colours are defined once with `light-dark()` in `styles.css` — there
is no separate dark stylesheet to keep in sync.
