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
| Editing a published piece, in place | Studio → Open… → Edit |
| Editing the older file-based articles | Studio → Open… → Written as files |
| Going back to an earlier version | desk → Published → History |
| Notion edits appearing on their own | every 15 minutes, if the page says it's ready |
| Writing in Notion and publishing from here | Studio → Import from Notion |
| Photos stored in R2, not in the article | automatic, on publish |
| Pre-flight checks before anything goes out | Studio → 3 · Publish it |
| Previewing the card and the shared link | Studio → preview → Card / Share |
| Per-article social image, from the lead photo | automatic, on publish |
| Reader questions, moderated | bottom of every article; queue on the desk |
| Reactions (helpful / confusing / go deeper) | bottom of every article |
| Subscriber list, confirmed opt-in, CSV export | Insights page; list on the desk |
| Client enquiry pipeline (new → replied → closed) | contact form; pipeline on the desk |
| Page analytics that can't identify anyone | `/desk.html` → What's read |
| Full-text search across article bodies | `/api/search` |

### Writing in Notion

Set `NOTION_TOKEN` (`npx wrangler secret put NOTION_TOKEN`, from an
integration at [notion.so/my-integrations](https://notion.so/my-integrations))
and the Studio grows an **Import from Notion** button. Share a page with the
integration — Notion's own Connections menu, per page — then search for it,
import it, and publish. Without the token the button never appears.

The conversion is deliberately lossy: Notion has infinite block types and this
site has about twenty tags, so a callout becomes the site's `note` box, a
divider an `<hr>`, a table the scrollable wrapper, and a synced block full of
database views becomes nothing at all. What comes out is already the small set
of tags `functions/_lib/sanitise.js` allows, which is the only set that
survives the write anyway.

A page that is a row in a Notion database can carry the rest of the article's
fields in its columns. Name them any of these and they're picked up:

| Field | Column names it answers to |
| --- | --- |
| Standfirst | Dek, Standfirst, Summary, Description, Subtitle, Excerpt |
| Label | Tag, Label, Category, Section, Topic |
| File name | Slug, URL, Path, Filename |
| Date | Date, Published, Publish date, Published at |
| Language | Lang, Language — anything starting "bn"/"bangla"/"bengali" is Bangla |
| Topics | Topics, Tags, Keywords (a multi-select, or one comma-separated string) |

Once imported, the piece stays linked to its Notion page: **Re-sync from
Notion** pulls the current version back over the body, so Notion can stay the
place the writing happens.

**Photos are the part worth understanding.** Notion serves uploaded files from
S3 on signed URLs that expire in about an hour, so an imported photo cannot
keep the URL it arrived with — the article would lose its pictures within the
day. Imported images therefore point at `/api/notion/asset`, an admin-only
same-origin proxy, and publishing re-encodes each one to WebP and uploads it
to `/media`. By the time anything is public, no Notion URL is left in it.

### Letting Notion publish itself

A Cron trigger (`wrangler.toml`, every fifteen minutes) checks every article
that came from Notion and pulls it in again if the page has changed. Edit in
Notion, and the site catches up on its own.

**It will not publish something you are still writing.** Give the page a
`Status` column and the sync only runs when it says one of *live, published,
publish, ready, done, complete*. Anything else — *drafting*, *idea*, empty
after having been set — and the page is left alone however often it changes. A
page with no Status column at all syncs freely, so add one the moment a piece
matters.

Three other things it refuses to do, all for the same reason (a sync that runs
unattended must never be the thing that damages an article):

- a page that converts to nothing leaves the article alone, because that is
  almost always the integration having lost access rather than a piece that
  became empty
- a change that renders identically updates only the timestamp
- every overwrite keeps the body it replaced, exactly as publishing does

"As I type" is not on offer and would not be wanted: Notion does not push per
keystroke, and the middle of an unfinished sentence should not be live.
`POST /api/notion/sync` runs the same pass immediately if fifteen minutes is
too long to wait.

Photos are the one compromise here. A Worker has no canvas, so the scheduled
sync cannot resize or re-encode: it copies images to `/media` at whatever size
Notion holds them, skipping anything over 8 MB. Importing through the Studio
still runs the full resize-and-WebP pipeline, so a piece you import by hand is
lighter than one that syncs itself.

## Where an article lives

There are two ways to publish, and the difference is worth knowing because
only one of them asks anything of you.

### The database — the normal way

Press **Publish to the site**. The article is a row in D1, served by
`functions/insights/[slug].js`, and it is live immediately. Nothing to copy,
no file to move, no commit.

Everything that has to know about it finds out on its own:

| What | How it finds out |
| --- | --- |
| The Insights page and the home page | `app.js` asks `/api/articles`, which wins over `content.js` |
| Ctrl+K search | same list, merged into the index on every page |
| `/feed.xml` and `/sitemap.xml` | `functions/feeds/[kind].js` merges the database into the generated file |
| Reactions and reader questions | attach themselves to any `/insights/…` page |

### Files — the fallback

The route from before the database: download the page, drop it in
`aab/insights/`, paste an entry into the `ARTICLES` list in `content.js`,
commit. That entry is what puts it on the Insights page, in Ctrl+K, in the
feed and in the sitemap — for a **file**. It has nothing to do with database
articles, and the Studio folds those buttons away under *Publish as files
instead* when there is a database to publish to.

Two older pieces still live this way. `Open… → Written as files` loads one
into the editor; publishing it moves it to the database, because
`worker.js` prefers a row over a file for the same slug. The file stays put
as the fallback.

### Slugs

A slug becomes a URL, so it can only be lowercase letters, digits and
hyphens — `worker.js` matches `[a-z0-9-]+` and nothing else resolves. The
Studio tidies the file-name box for you when you leave it, and
`check-routes.mjs` fails the build on an entry that could never work.

That check exists because of a real one: an entry with the slug
`"German Alphabets"` reached `feed.xml` and `sitemap.xml`, putting a URL with
a raw space in front of search engines. The Studio had taken the field
exactly as typed while the server quietly stored `germanalphabets`, so the
index entry you copied and the URL that worked disagreed. Both halves of that
are fixed.

### What the Studio cannot edit

The Learn lessons and term pages are generated from `curriculum.js` and
`lessons/*.js` by `build-lessons.mjs` and committed. About, Portfolio, Tools
and the rest are hand-written. All of it lives in git, and a Worker cannot
commit — so those are edited in the repository, not in the Studio.

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

## The German school

`/deutsch/` is the site's **second school**, and it is deliberately a
separate mount rather than another stage of `/learn/`. The Learn area is
about money in Bangladesh — risk labels, brokers, a starter guide about
opening a BO account. Nothing in that vocabulary belongs next to
Akkusativ, and someone looking for one should never have to scroll past
the other.

It is the same machinery, though: the same ladder, the same lesson cards,
the same tick-in-your-own-browser progress, so anyone who has used the
Learn area already knows how to use this one.

| Stufe | | What it covers |
| --- | --- | --- |
| Stufe 1 | একদম শুরু থেকে · Der Anfang | Sounds, verb-in-seat-two, `sein`/`haben`, der·die·das, the endings machine, `nicht`/`kein`, questions, the sentence bracket, numbers, real-life sentence banks — **14 Teile, all written** |
| Stufe 2 | কারক ও অতীত · Die Fälle | Accusative, dative, prepositions, possessives, `Perfekt`, separable verbs, plurals — *outline live, text to come* |
| Stufe 3 | কারণ, তুলনা ও গল্প · Die Verbindung | `weil`/`dass`/`wenn`, relative clauses, adjective endings, comparatives, future — *outline live* |
| Stufe 4 | মুক্তভাবে বলা · Frei sprechen | `Konjunktiv II`, passive, opinion and argument, formal letters, the exams — *outline live* |

**`aab/deutsch/curriculum.js` is the one file you edit**, exactly as
`learn/curriculum.js` is for the Learn area. Stufen → sections → Teile,
plus each Stufe's practice book.

### The practice book

Each Stufe has a thirty-day workbook — one page a day: a pattern, five
model lines, eight sentences of the learner's own, six translations with
a hidden answer key, and one true paragraph. Stufe 1's is live at
`/deutsch/stufe-1/arbeitsbuch.html`.

All thirty days are written into that **one page**, in full. With
JavaScript on it becomes a day-at-a-time book with a tracker, boxes that
remember what was typed, and answers that stay shut until asked for. With
JavaScript off it is the printable workbook it came from. It is one page
and not thirty because a practice book is not thirty articles — it is one
thing you bookmark on the first evening and open every evening after.

`aab/deutsch/arbeitsbuch.data.js` holds the days and is read by the
generator only; the browser never downloads it, because every word is
already in the markup.

### Adding or editing a Teil

1. Add it to its Stufe in **`aab/deutsch/curriculum.js`**.
2. Write the body in **`aab/deutsch/content/<stufe>.js`**, keyed by slug.
   (Skip this and it ships as a proper "আসছে" page, not a 404.)
3. `node aab/deutsch/build-deutsch.mjs` — writes the Stufe pages, the Teil
   pages and the practice book.
4. `node aab/build-meta.mjs && node aab/check-routes.mjs`.

### Progress

Separate keys from the Learn area (`deutsch-read`, `deutsch-days`,
`deutsch-last`, `deutsch-schrift`), so finishing the money ladder never
claims you finished German and resetting one never wipes the other.
Reading a Teil ticks it off by opening it; **a practice day is only ticked
by hand** — the book's promise is that you said it out loud, and no page
can verify that but the learner.

## Two front doors

A recruiter and a Bangladeshi reader learning about savings want opposite
halves of this site, so the home page asks once and remembers
(`aab/audience.js`). The choice reorders the header nav, the overlay menu
and the search ranking — it never hides anything, and the footer switch
flips it back on any page.

## Testing

```sh
npx wrangler dev                    # the real Cloudflare runtime, local D1 and R2
./test-api.sh                       # 108 checks over every endpoint
node functions/_lib/notion.test.mjs # 74 checks on the Notion → HTML conversion
node aab/studio.test.mjs            # 67 checks driving the editor in a browser
node aab/check-routes.mjs           # catches redirect loops before deploying
node aab/check-sw.mjs               # did a precached file change without a VERSION bump?
node aab/portfolio/dissertation.test.mjs   # 141 checks on the statistics engine
node aab/learn/build-lessons.mjs    # regenerate the Learn pages
```

`test-api.sh` is idempotent — run it as often as you like against the same
local database. That is why its publish call passes `overwrite: true`: a
second run is, by definition, republishing a slug that already exists, and
the endpoint refuses to do that silently.

`studio.test.mjs` needs Playwright and skips itself with a note if it isn't
installed, the same optional-tool arrangement as `build-og.mjs`. It serves
`aab/` itself, so there is no server to start first. The editor is the one
part of the site that cannot be checked by reading it: that suite found the
browser sanitiser quietly destroying note boxes, and the markdown shortcuts
doing nothing on the first line of every new article.

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
| `aab/styles.css` | The whole design system in `@layer`s, in cascade order: tokens → base → layout → components → menu → tools → article → studio → work → learn → deutsch → check → about → utilities |
| `aab/app.js` | Theme, overlay menu, Ctrl+K palette, keyboard shortcuts, prerender rules, article cards, service-worker registration |
| `aab/content.js` | **The one file you edit to publish.** Articles, Bangla terms, tools, pages |
| `aab/api.js` | Browser side of the dynamic layer — returns null instead of throwing when there's no backend |
| `aab/auth.js`, `auth-config.js` | The Studio's gate: server session when available, browser-side fallback |
| `aab/desk.html`, `desk.js` | The desk — questions, enquiries, subscribers, what's read, what's live |
| `aab/engage.js` | Reactions and reader Q&A; attaches itself to any article page |
| `worker.js` | **The entry point.** Routes `/api/*` and `/insights/:slug` to `functions/`, and hands everything else to the static assets |
| `functions/` | The request handlers, written in the Pages Functions shape (`onRequest`, `context.params`, `context.next()`). `worker.js` maps them to paths |
| `functions/_lib/` | Database, HTTP helpers, server-side auth, server-side HTML sanitiser |
| `functions/_lib/notion.js` | Notion's block tree → this site's HTML. Pure, so `notion.test.mjs` can check it without a token or a network |
| `functions/api/media/` | Photos in R2. Keys are content hashes, which is what lets them be served `immutable` |
| `functions/api/notion/` | Listing and importing Notion pages, plus the image proxy |
| `aab/schema.sql` | The database. Also applied automatically on first request |
| `setup.sh` | One-time Cloudflare setup |
| `test-api.sh` | 52 end-to-end API checks |
| `aab/studio.html`, `studio.js` | The Article Studio |
| `aab/studio.test.mjs` | The Studio driven in a real browser. Optional, needs Playwright, serves `aab/` itself |
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
| `aab/deutsch/curriculum.js` | **The one file you edit for German.** Four Stufen, their sections and Teile, and each Stufe's practice book |
| `aab/deutsch/index.html` | The school hub — hand-written, because "how this works" lives in it |
| `aab/deutsch/hub.js` | The hub's live layer: the four-Stufe ladder, the resume card, the two progress bars |
| `aab/deutsch/progress.js` | The only file that touches German progress in `localStorage` — its own keys, separate from Learn |
| `aab/deutsch/content/` | Teil text, one module per Stufe |
| `aab/deutsch/arbeitsbuch.data.js` | The thirty days of Stufe 1. Read by the generator only — the browser never downloads it |
| `aab/deutsch/arbeitsbuch.js` | Turns the printed workbook into a daily one: one day at a time, saved writing, hidden answers, the tracker |
| `aab/deutsch/build-deutsch.mjs` | Writes the Stufe pages, the Teil pages and the practice book. Not a build step |
| `aab/deutsch/icons.js`, `stufe.js`, `teil.js` | The German marks; ticks on a Stufe page; the one line a Teil page needs |
| `aab/pulse.js` | The auto-updating market-news list |
| `aab/sw.js` | Service worker — offline reading, never stale articles |
| `functions/api/news.js` | Serves `/api/news` — the market-pulse feed |
| `aab/_headers`, `_redirects` | Cloudflare security headers, CSP and redirects |
| `aab/check-routes.mjs` | **Run before deploying.** Walks every URL through the routing rules and fails on loops, dead ends, broken links, and article slugs that could never resolve |
| `functions/_lib/sync.js` | The scheduled Notion pull, and the rules that stop it publishing something half-written |
| `aab/build-meta.mjs` | Regenerates `feed.xml`, `sitemap.xml`, `robots.txt` |
| `aab/build-og.mjs` | Re-renders the social share images in `og/` (needs Playwright) |
| `aab/portfolio/` | The four case studies. Each is a page, a DOM-free engine (`*.model.js`) and its charts (`*.js`) |
| `aab/portfolio/dissertation.*` | The MSc dissertation case study: transcribed tables and extracted series in `.data.js`, Welch/noncentral-t statistics in `.model.js`, and `.test.mjs` to check them |

## Keyboard

`Ctrl/Cmd K` or `/` search · `M` menu · `T` theme · `?` shortcuts ·
`G` then `H`/`L`/`D`/`I`/`T` to jump to Home, Learn, Deutsch, Insights or Tools.

**Inside the Studio's editor** those give way to writing: `/` opens the block
menu, `Ctrl/Cmd K` makes a link rather than opening search, `Ctrl/Cmd S`
saves the draft and `Ctrl/Cmd Enter` publishes. Markdown works as you type —
`##`, `###`, `-`, `1.`, `>` and `---`.

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
