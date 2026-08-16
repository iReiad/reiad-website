# Where the writing lives, and where it is going

A working document, not a proposal. It answers one question that
came up in August 2026 (do articles go to the database, or to
GitHub?), sets out the four moves that follow from the answer, and
then keeps score.

**How to use this file.** Every stage below has a status. When a
stage lands, change its status, add a dated entry to the log at the
bottom saying what actually happened, and move anything that went
wrong into *Issues*. Do not delete a finished stage: the point of
this file is that in six months it says what was done and why, not
just what is left. Keep the house rules while editing it: no em
dashes, and no number that a script could have counted.

---

## 1. The answer: both, unevenly

An article on this site can exist in two forms, and today it can be
in either one, or in both.

**As a file.** `aab/insights/<slug>.html`, `aab/cooking/<slug>.html`
or `aab/travel/<slug>.html`, committed to git, plus an entry in the
matching list in `aab/content.js`. This is how every piece written
before the Studio exists, and how all three of the live pieces exist
today. It is also what the Studio's "Download the page" button
produces.

**As a row.** A record in the D1 `articles` table, written by the
Studio's Publish button, rendered on request by
`functions/insights/[slug].js`. Its photos live in R2 under
`/media/`, and its share card is drawn at publish time.

**Which one answers a URL.** The row, if there is one.
`worker.js` sends every `/insights|cooking|travel/<slug>` request to
the renderer; the renderer looks the slug up in D1 and, if it finds
a live row whose section matches the mount, renders it. If there is
no row, no database, or the row belongs to another section, it calls
`context.next()` and the committed file is served instead. A reader
cannot tell the difference: the two paths are twins on purpose, and
the comment at the top of that file says so.

**The uneven part, which is the actual problem.** The URL works
either way. The things that *point at* the URL mostly do not:

| What | Reads D1 | Reads content.js |
| --- | --- | --- |
| The article URL itself | yes, first | yes, as fallback |
| `sitemap.xml`, `feed.xml` | yes, merged | yes |
| `/insights.html` cards | yes, merged | yes, as fallback |
| Ctrl+K palette | yes, merged at runtime | yes |
| `/api/search` | yes | yes |
| `/cooking/` and `/travel/` hubs | yes, merged | yes, as fallback |
| The count above each hub's list | counts what it drew | fallback in the markup |
| The home page rotation | yes, merged | yes, as fallback |
| The menu | yes, merged | drawn first, then redrawn |

**As of Stage 1 that table is all yes**, and the paragraph that
used to be here said the opposite: a piece published through the
Studio into the kitchen was readable at its URL, in the sitemap and
in search, and invisible on the kitchen's own index, which is the
one page a reader would use to find it. Three separate places built
the link as `/insights/<slug>.html` whatever section the piece was
in, which is a card pointing at a 404.

It was not a bug that crept in. It is what a half-finished
migration looks like from the inside, and closing it is what made
everything after Stage 1 possible.

---

## 2. What we are aiming at

Four moves now, not two. The order matters, and it is not the order
they were asked for.

**Move A: the database becomes the only home for a piece.** One
article, one row, one place to change it. `content.js` stops being a
list of articles and goes back to being what it is good at: the
site's structure, the tools, the case studies.

**Move B: readers get accounts.** Sign in, and the progress that
three schools already track follows you from a laptop to a phone.
Comments become something a person owns rather than an anonymous
form. Nothing about the site requires an account: every page reads
exactly as it does today for someone who never signs in, and that
is a rule rather than an aspiration.

**Move C: the schools' content moves into a database too.** The
curricula are JavaScript files today, and the 246 pages are
generated from them. Moving the lessons into tables means a lesson
can be fixed without a rebuild and a deploy, and it is what makes
the Studio able to edit a lesson the way it edits an article.

**Move D: the site is rendered by React, on Next.js, and the HTML
files go.** Component by component, route by route, with the
current Worker still serving everything that has not moved.

**The end state, decided 16 August 2026, said plainly.** This is a
full transition, not a coexistence. When it is finished there is
no page of this site served as a committed `.html` file. Every
route renders from Next.js; every piece of prose lives in a
database; everything that is structure rather than prose lives in
a module the route imports. A file is deleted only after what was
in it is somewhere better, and "somewhere better" is one of three
places: a row, a module, or a component. Nothing is deleted
because it was in the way.

That is 283 HTML files today: 251 generated by the four school
builders, and 32 written by hand. The number is here so that
progress against it is countable rather than a feeling, and
`Stage 11` is where it is counted down.

**What that does not mean.** It does not mean rewriting a page's
design while porting it, which is the rule at the top of Stage 9
and it holds to the last file: `styles.css` stays the design
system and React renders the same class names into the same
layers. It does not mean putting code in a database, which is
still the line section 2b draws. And it does not mean a reading
page becomes an app: a page of prose is server-rendered and
complete before any JavaScript runs, whatever renders it.

**Why this order.** A becomes B's foundation: comments hang off
pieces, and until one function can answer "what pieces are there",
anything built on top inherits the split. C is the largest and the
least urgent, because those pages work. D is last because a Next.js
page needs its content from somewhere, and if the content is
already an API by then, the framework change is only a change of
renderer, which is small and reversible. Done the other way round,
the two migrations become one migration, and that is the kind that
runs for a year and gets abandoned halfway with the site in two
pieces.

### Where each thing lives

Two databases, and one sentence that decides between them.

**D1, at the edge, holds what a reader reads.** Articles, their
bodies, their photos in R2 beside them. It is already there, it is
in the same process as the Worker, and a reading page must not wait
on a round trip to another provider to render.

**Supabase holds who a reader is and what they did.** Users,
sessions, progress and comments. It is
Postgres with real auth attached: magic links, Google, sessions,
row-level security. Writing that by hand in a Worker is a month of
work and a permanent security liability.

The rule, for anything added later: **if a signed-out reader needs
it to render the page, it goes in D1. If it belongs to a person, it
goes in Supabase.** The two never join in a query. A page that
needs both fetches the piece from D1 and the person's relationship
to it from Supabase, in parallel, and the second one failing is a
page without a progress tick, not a broken page.

The cost of this is honest and worth writing down: a second
provider, a second dashboard, a second bill, and roughly 100 to 200
milliseconds on an authenticated request from the edge to Mumbai.
The project is in `ap-south-1`, which is the closest region to
Dhaka, and every one of those requests is for something a
signed-out reader never asks for.

**One honest note.** The site is currently fast because it has
almost no JavaScript on a reading page and no build step for its
core. Next.js will not make it faster; at best it stays level. What
it buys is a component model, real routing, and a way of working
that other people already know. That is a real reason, but it is a
maintainability trade and not a performance one, and it is written
down here so nobody re-litigates it later on the wrong grounds. The
staging below is built so that every stage is useful on its own and
the whole thing can be stopped at the end of any of them without
leaving a mess.

---

## 2b. What moves, and what deliberately does not

The question this section answers: **"it's not just the articles, all
the lessons in learn or skills need porting too, right? And what about
tools and projects?"**

Partly. And for two of the four, the answer is a clear no, which is
worth writing down before anyone spends a month doing it.

### What this section is not about, and it matters more since 16 August

This section answers **where a thing's content lives**. It never
answered **what renders the page**, and the two were easy to read as
one sentence while the answer to the second was always "a committed
HTML file".

Since the end state in section 2 was decided, they have to be kept
apart deliberately, because the answers are now different:

> Every page on this site ends up rendered by Next.js. Only some of
> what is on those pages ends up in a database.

So a calculator's page becomes a React route while
`stock.model.js` stays exactly what it is: a module, in the
repository, with its tests, imported by the route that renders it.
A case study's page becomes a React route while its `.data.js`
stays a file that 1,931 lines of tests still pin on every commit.
Nothing below is reversed by the decision. What is reversed is the
assumption underneath it, that a thing which stays in the
repository also stays an HTML file.

### The rule

> **If it changes because you wrote something, it belongs in a
> database. If it changes because somebody changed the code, it belongs
> in the repository, with its tests.**

The seam in section 1 decides *which* database. This one decides
whether a thing should be in one at all. They are different questions
and conflating them is how a project ends up storing JavaScript in
Postgres.

### The four bodies of content, judged against it

| | What it is | Where it goes | Why |
| --- | --- | --- | --- |
| **Articles** | prose you write | **D1** | Already moving. Stages 1 to 4. |
| **Curricula** | prose you write, in a fixed structure | **D1, later** | Stage 8. Real, but the payoff is small and the work is not. |
| **Calculators** | code | **stays in the repo** | It is a program. See below. |
| **Case studies** | code plus fixed research data | **stays in the repo** | Same, and more so. |

### Why the calculators do not move

`aab/tools/stock.model.js` scores forty-four ratios. `compounding`,
`emi`, `inflation`, `position` and `sanchayapatra` are pure functions
over a handful of inputs.

None of that is content. A database can hold the *numbers a program
uses*; it cannot hold the program, and the only way to make it look
like it can is to store code and evaluate it, which turns every write
to that table into remote code execution on this site. There is no
version of that which is safe enough to be worth the convenience.

What could reasonably move later, and is not urgent:

- **thresholds and weights**, so the stock model can be retuned without
  a deploy. This is a real want. It is also the one that changes the
  answers the tool gives, so it needs the model's tests to run against
  the stored values before they take effect, and that machinery is
  larger than the problem.
- **saved calculations**, per reader. That is a person's, so by section
  1 it is Supabase, not D1. It needs accounts, which now exist.

### Why the case studies do not move

`dissertation`, `stress`, `scorecard` and `frontier` are `.model.js`
files with `.data.js` beside them, and **1,931 lines of tests pinning
their numbers**. The data is transcribed tables from a finished
dissertation and extracted series that do not change. Moving them into
a database would take numbers that are currently verified on every
commit and put them somewhere no test can see, in exchange for the
ability to edit figures that must not be edited.

These are the strongest argument in the repository for leaving
something alone. They are portfolio pieces: their whole value is that
the numbers are right and provably unchanged.

### Why the curricula are worth moving, but not yet

Four `curriculum.js` files, about 153 KB, driving 251 generated pages.
The data already drives the pages: a build step reads the curriculum
and writes the HTML, so the structure is not the problem.

What moving them buys is one thing: **editing a lesson without a
deploy.** That is worth a lot for an article, which is written once and
corrected often, and much less for a curriculum, which is designed once
and then mostly stays put.

What it costs is a schema that has to hold stages, sections, lessons,
workbook days and two languages, plus the build step rewritten to read
from D1, plus a fallback for when it cannot. That is not free, and
nothing a reader does is blocked by not having it.

So Stage 8 stays where it is in the order: after comments, and after
React has been proven somewhere that does not matter.

### The safety rule that applies to all of it

**Nothing on this list moves without the page still rendering when the
database is unavailable.** For articles that is already true: the
committed file answers when there is no row. Any move of a curriculum
has to keep the same property, which in practice means the build step
keeps emitting static pages and the database becomes the *source* for
that build rather than a thing a reader waits on.

A reader on a bad connection in Dhaka must never be the person who
finds out the database is down.

---

## 3. Rules for every stage

1. **No URL ever breaks.** Not one. `check-routes.mjs` runs before
   every merge, and anything that moves gets a redirect.
2. **Every stage ships green.** All five checks pass, the em dash
   grep is empty, `VERSION` is bumped if a precached file changed.
3. **Every stage is revertible on its own.** No stage may depend on
   the next one having landed.
4. **The fallback stays until the new path has been live for two
   weeks.** Files stay in the repository after D1 takes over their
   URL, until we have watched it work.
5. **Nothing lives in exactly one place.** The moment the database
   is the source of truth, it needs a backup that is not the
   database. See Stage 2.
6. **One stage at a time, and the site stays shippable between
   them.** No branch lives longer than a week.
7. **Nothing on the site requires an account.** Every page reads for
   a signed-out stranger exactly as it does today. An account adds
   a tick, a comment and a name; it never gates a paragraph.
8. **Supabase failing is a smaller page, not a broken one.** Every
   call to it is wrapped, and every feature it powers degrades to
   what the site does now.

---

## 4. The stages

### Stage 0 · Know what is there
**Status: done, August 2026.** This section of this document is the
deliverable.

Counted at the time of writing: 3 live pieces as files, one in each
section (`dse-basics`, `onions`, `uk-visit-visa`), 3 more listed as
`soon` and not written, 7 case studies, 246 generated school pages,
one orphaned file (see I9), and an unknown number of D1 rows. Run
these to refresh the numbers:

```sh
ls aab/insights/*.html aab/cooking/*.html aab/travel/*.html
npx wrangler d1 execute reiad --remote \
  --command "SELECT section, status, COUNT(*) FROM articles GROUP BY 1, 2"
```

---

### Stage 1 · Every list reads the database
**Status: done, 15 August 2026.** Took one sitting.

Fix the table in section 1 so that every row says "yes". Nothing
moves yet, no file is deleted, and no page changes for a reader.
This is preparation, and it is the stage that makes the rest safe.

- One module, `aab/pieces.js`, that returns the merged list: D1 rows
  where there are D1 rows, `content.js` entries where there are not,
  deduplicated by slug, with the section attached. Everything that
  currently lists articles calls it: `reads.js`, `app.js`,
  `home.js`, the palette.
- Links come from `pieceUrl(section, slug)`, never from a template
  literal. The three places that hardcode `/insights/` today are
  `app.js` (cards and palette) and `functions/api/search.js`.
- `COUNTS.cooking`, `COUNTS.travel` and any count of articles become
  async, or the pages holding them count what they rendered. The
  no-JavaScript fallback number in the markup stays as it is.

**Done when:** a row inserted into D1 by hand appears on its hub,
in the palette, in the counts and on the home page, without touching
`content.js`. **Rollback:** the module falls back to `content.js` on
any API failure, which is what it does anyway.

**What actually happened.** `aab/pieces.js` is the module, and it
turned out smaller than expected because `getArticles()` in api.js
already cached its promise, so several lists on one page share one
request. Two things were not in the plan:

- The overlay menu is built synchronously, so pressing M always
  opens something. It draws from `content.js`, then redraws its two
  "Latest writing" entries when the database answers.
- The hub count is no longer taken from `COUNTS` at all. The hub
  counts the cards it just drew, which is the only number that
  cannot drift from what is on the screen.

---

### Stage 2 · The database gets a backup that is not the database
**Status: done, 15 August 2026.** Size: one sitting.

Today the repository is the backup: every article is a file in git,
with history. The moment D1 is the source of truth, that stops being
true, and `article_versions` does not count, because it lives in the
same database.

This shipped in a different shape from the one planned here, for
one reason that was not noticed when the plan was written: **the
repository is public.** So "reads every row and writes it into the
repository" would have committed drafts, reader questions,
subscriber email addresses and the admin password hash to a public
git history, where deleting them does not delete them.

What landed instead is two backups, split by who can read the
result:

- **`content/articles.backup.json`, committed nightly by
  `.github/workflows/backup.yml`.** Live articles only, and only
  the columns already served at a public URL, so the file publishes
  nothing that was not published. It needs no secret: Actions
  issues its own `GITHUB_TOKEN`, and the endpoint it reads
  (`GET /api/backup/articles`) is public precisely because its
  contents are. The workflow refuses to commit a file that is the
  wrong format, holds a non-live row, is over a megabyte, or has
  lost more than half the articles it had yesterday.
- **A nightly R2 snapshot of every table worth keeping**, written
  by the Worker's own cron at 03:17, kept a fortnight. This is
  where drafts, questions, subscribers, enquiries and settings
  live. Same provider as the database, which is a weaker guarantee
  than off-provider and is written down as one: it protects against
  a bad query, a dropped table or a bad deploy, not against losing
  the Cloudflare account.

`sessions` and `throttle` are in neither, by name rather than by
omission, so that adding a table by copying a line cannot pick one
of them up.

The restore path is `scripts/restore.mjs`, which reads a backup and
writes SQL to stdout and does nothing else: no credential, no
connection, nothing it can delete on its own. Upsert by default, so
restoring over a live database brings the backed-up rows back and
leaves anything newer alone; `--replace` empties each table first
and says so on stderr before it does.

**Done:** `scripts/restore.test.mjs` builds a real SQLite database
with this site's schema, fills it, backs it up, restores it into an
empty one and compares every row. Twenty-six checks, including the
ones that matter most: no draft, no reader email, no password hash
and no Notion page id in the public backup; an apostrophe, a
backslash, a newline and Bangla in one body surviving the round
trip; and a restore over a database that has moved on keeping the
newer row.

`scripts/check-crons.mjs` is new and exists because the two cron
strings live in two files that have to be identical, with nothing
to enforce it. When they drift the job simply stops running and
nothing says so.

**Rollback:** delete the workflow file and the second entry in
`crons`.

---

### Stage 3 · The file pieces move into the database
**Status: every piece is now a row (15 August 2026).** The files
stay until 29 August, per rule 4. Size: one sitting, plus two weeks
of watching.

`dse-basics` was published through the Studio at 19:33 on 15 August,
which was the last one. `node scripts/check-pieces.mjs --live` now
reports every listed piece as having a database row, and lists the
three files that are shadowed by one and can be deleted after the
fortnight.

Surveyed properly on 15 August 2026, and it is far smaller than
this stage assumed. `node scripts/check-pieces.mjs --live` prints
the state of every piece across both stores:

| Piece | Where it lives |
| --- | --- |
| `insights/article-2026-08-12-aaoifi-intro` | database |
| `insights/article-quran-2026-08-10` | database |
| `insights/tiny-experiments` | database |
| `cooking/onions` | both, row wins |
| `travel/uk-visit-visa` | both, row wins |
| `insights/dse-basics` | **file only** |
| `insights/dsex` | a 1.6KB redirect stub, not an article |

So the migration is one piece, `dse-basics`, and two files that are
already shadowed by a row and can be deleted a fortnight after
those rows went live.

`insights/dsex.html` is not a piece at all: it is a stub left
behind when the term moved to `/learn/terms/dsex`, and
`_redirects` sends both of its URLs there. `check-pieces.mjs`
knows the difference, which is why it does not flag it.

**What needs a human:** publishing `dse-basics` writes to the
database, which needs the admin session. One click, from the desk
or at `/studio.html?file=insights:dse-basics`, then Publish. The
desk's own action on a committed file now reads **Import** rather
than Edit and is drawn in gold, because "Edit" on the last
file-only piece on the site does not tell anyone that pressing it
finishes a migration.

The Studio can already read a committed page back into the editor
(`?file=<section>:<slug>`), which is exactly the importer this
needs.

- Open each live piece in the Studio and publish it.
  The row takes over the URL the moment it saves. **One left.**
- Check each URL, its share card, its hub card, its feed entry and
  its sitemap line.
- Leave the files in place. They are now dead code that happens to
  be a fallback.
- Two weeks later, delete the files and their `content.js` entries
  in one commit, and drop the article lists from `content.js`
  entirely if Stage 1 has made them unused. `check-pieces.mjs`
  lists exactly which files those are.

**Done when:** `SELECT COUNT(*) FROM articles WHERE status='live'`
matches what the hubs show, and `aab/insights/`, `aab/cooking/` and
`aab/travel/` hold only their `index.html` and the template.
**Rollback:** unpublish the row and the file answers again, with no
deploy.

---

### Stage 4 · The Studio stops offering to write files
**Status: done, 15 August 2026.** Size: one sitting.

Once Stage 3 is done, "Download the page", "Download .zip" and "Get
the index entry" describe a workflow that no longer exists. They
are also the last thing keeping the page builder in `studio.js`,
which is a second renderer for articles and has drifted from the
server's twice already.

The two bullets this stage was written with pulled against each
other: keeping the export tools as a no-database fallback means
keeping `buildPage()`, and keeping `buildPage()` means keeping the
second renderer, which was the actual problem.

It resolves once you notice the fallback had already been built
twice over, by other stages:

- **Drafts are in IndexedDB.** Nothing a writer types is lost when
  the database is unreachable, with or without a download button.
- **Stage 2 is the portability story.** Every live article's body
  is committed nightly to `content/articles.backup.json`, and
  `scripts/restore.mjs` turns it back into SQL. That is a far
  better answer to "get my writing out" than a button that
  rebuilds one page.

So the tools went, and `buildPage()`, `indexEntry()`, the ZIP
writer and `externalisePhotos()` went with them: **309 lines of
`studio.js`**, and the second renderer with it.

What replaced them is one honest sentence. With no database the
Studio says so, and says the draft is safe on this device, rather
than showing an editor with no way out.

Two things fixed on the way, both found by the deletions:

- The **page-weight meter** measured a whole rendered page against
  2 MB. What the server actually caps is the *body*, at 1 MB. It
  was the wrong number against the wrong limit, and read
  comfortably while the real cap was already in sight.
- `socialCoverURL()` still accepted `/insights/photos/`, a path
  only the ZIP export ever wrote and nothing has ever served. It
  could only have produced an `og:image` pointing at a 404.

**Done:** publishing is the only path a signed-in writer sees, and
`functions/insights/[slug].js` is the only place that builds an
article page. `aab/studio.test.mjs` asserts the absence of all five
removed controls and of `buildPage` itself, so they cannot come
back quietly.

---

### Stage 5 · Accounts, and nothing else changes
**Status: done, 15 August 2026.** Took one sitting.

Sign in, sign out, and a name in the corner. No feature depends on
it yet, which is exactly why it is a good first step: it can be
live and doing nothing while it is watched.

- Supabase Auth, magic link and Google. The project is
  `ap-south-1`, and Google needs an OAuth client, which is the one
  thing that has to be done in a browser by hand.
- Every schema change is a file in `supabase/migrations/`, applied
  by the GitHub integration when the pull request merges. Nothing
  is typed into the dashboard's SQL editor: a table that exists
  only because someone ran a query once is a table nobody can
  recreate.
- `aab/account.js`, a small module: sign in, sign out, who am I.
  The Supabase client is loaded only on the pages that need it, so
  a reading page still ships no extra JavaScript.
- A `profiles` table keyed to `auth.users`, holding a display name
  and nothing else. Row-level security on from the first migration,
  not added later.
- The header grows one item, and it says "Sign in" until you do.

**The rule this stage sets:** nothing on the site requires an
account. Every page reads exactly as it does now for someone who
never signs in. **Done when:** signing in on a phone and a laptop
gives the same account. **Rollback:** hide the header item; the
tables sit there costing nothing.

**What actually happened.** The one decision worth recording is
that there is no Supabase client library in here. The official one
is around forty kilobytes and would need a CDN or a bundler, and
this site has neither; what it does for us is three POSTs and a
redirect, which is what `aab/account.js` is. If refresh rotation or
MFA ever grows teeth, that is the moment to reconsider, and the
whole surface to replace is six exported functions.

Two smaller ones. The tokens come back in the URL fragment rather
than the query string, because a fragment is never sent to a server
and so cannot end up in a log; `account.js` takes it out of the
address bar immediately, so a screenshot of the page does not carry
a working session. And the button is appended to the header at
runtime, the way the menu and search buttons already are, rather
than by editing the header in fifty files and three generators.

---

### Stage 6 · Progress follows the account
**Status: done, 15 August 2026.** Took one sitting.

Three schools already track progress, in `localStorage`, per
browser. It is the feature that most obviously wants an account:
the same person on a phone and a laptop is currently two learners
who have each read half a course.

- A `progress` table: user, course, unit, state, timestamps.
- `learn/progress.js` keeps writing to `localStorage` exactly as it
  does. When signed in it also syncs, last-write-wins per unit,
  which is the right resolution for a tick that only ever goes from
  off to on.
- First sign-in offers to take the progress already in this browser
  with it.

**Done when:** ticking a lesson on a phone shows it ticked on a
laptop, and signing out leaves the local progress alone.
**Rollback:** stop syncing; `localStorage` is still the source.

**What actually happened.** None of the four progress modules was
touched. They each already announce their changes on the window and
each already keeps its state in a known localStorage key, so
`aab/sync.js` carries those keys and nothing else. That is the
whole reason this took one sitting rather than four.

The merge rules matter more than the plumbing, and "last write
wins" is wrong for every one of them:

| What | Rule | Why |
| --- | --- | --- |
| a set of ids | union | a tick only goes from off to on |
| a bookmark | the newer `ts` | it already carries one |
| a day counter | the higher number | you do not un-reach day eleven |

The one exception is deliberate erasure: a set emptied on this
device more recently than the account was touched replaces the
account copy instead of merging with it, or "forget my progress"
would quietly undo itself on the next page.

`/account.html` came with it, which is Stage 5 finally having
something to show: the name beside your comments, what the account
actually keeps counted rather than described, and two ways out.

---

### Stage 7 · Comments, moderated, grown from Questions
**Status: done, 15 August 2026.** Size: three or four sittings.

The piece that was not in the plan and turned out to be the
foundation: **`functions/_lib/reader.js`, which verifies the
reader's Supabase token on the server.** `aab/account.js` reads a
token to put a name in a header and says in capitals that this is
not verification. This is the other half. Without it `author_id`
is whatever the poster typed, and a comment system where anyone
can post as anyone is worse than no comment system.

It checks the signature against the project's published keys
(ES256, which is what this project signs with), refuses `alg:
none`, refuses a token from another issuer, refuses an unknown
key id rather than trying every key, and takes the algorithm from
the key rather than from the token's own header. Twenty-one
checks in `scripts/reader.test.mjs`, most of them attacks, all
against real WebCrypto with real signatures.

The comment itself lives in **D1, not Supabase**, which is the
seam in section 1 doing its job: a thread has to render for a
signed-out stranger with Supabase unreachable. `author_name` is
copied into the row at the time of writing so that it can.

A comment is text, never HTML: stored as text, returned as text,
written with `textContent`. There is no sanitiser in the path to
get wrong.

The Questions system is already a moderated queue with a desk panel
and per-article threads. Comments are the same shape with an author
attached, so this grows what is there rather than adding a second
system beside it.

- Signing in is required to comment, and every comment waits for
  approval, including from a signed-in reader. That is the answer
  given in August 2026 and it is the safe end of the range: it can
  be loosened later without anybody noticing, and tightening it
  after spam arrives is a worse day.
- One thread per piece, one level of replies, no more.
- The desk's Questions panel becomes the moderation queue for both,
  with the author's account shown where it exists.
- Everything already asked and answered keeps working and keeps its
  place under its article.

**Done:** a signed-in reader can comment; it appears for nobody
until approved from the desk's new Comments panel; the questions
queue beside it is untouched. `scripts/comments.test.mjs` proves
the two rules that matter against real SQLite and real signatures:
naming somebody else in the request body does not change who the
author is, and `status: "live"` in the body does not publish
anything.

**Rollback:** stop accepting new comments; the old queue is
untouched.

---

### Stage 8 · The schools' content into the database
**Status: steps 1 to 3 done, 16 August 2026. Step 4 is what is
left.** Size: weeks. The largest thing on this list.

All four builders can read the database, and every one of the 229
pages they write comes out byte-identical either way: quran 61,
deutsch 63, english 33, learn 72.
`scripts/schools-build.test.mjs` is that diff, and it is the whole
acceptance test for this stage.

The schema is in `aab/schema.sql` and in `functions/_lib/db.js`,
three tables; `scripts/import-schools.mjs` reads the four
curricula and their prose and writes the rows as SQL; and
`scripts/schools.test.mjs` proves the round trip against real
SQLite, 30 checks, field by field: **17 stages, 61 sections, 233
lessons, 178 of them written, every body byte-identical.**

The site can read those rows through `/api/schools`, and no page
does yet. The builders are still on the files, which is what is
left of step 3.

**Two things the round trip caught, both of which would have been
silent.** The first importer assumed every school called a lesson
a `lesson`, and two of them do not: `/deutsch/` says `teile` and
`/english/` says `parts`, each in the vocabulary of the thing it
teaches. It imported 17 stages, 61 sections and **zero lessons**
for those two without complaining, and a check that counted what
it found would have agreed with it. The second was the query:
ordering lessons by their stage's slug puts the money school's
ladder in alphabetical order, which is advanced, basics-1, ...,
start. Three schools have slugs that happen to sort correctly. A
reader of the fourth would have met the pages in the wrong order.

To load them:

```sh
node scripts/import-schools.mjs > schools.sql
npx wrangler d1 execute reiad --local  --file=schools.sql   # practise
npx wrangler d1 execute reiad --remote --file=schools.sql
```

**Check the number wrangler prints.** The script says how many
queries the file holds and wrangler says how many it processed. If
those disagree, nothing was written, whatever the tick at the end
says. That is not a hypothetical: the first run of this import
uploaded 914 KB, printed **"Processed 0 queries"** and
"Executed 0 queries in 2.01ms", and returned success. The rows
were quoted as ordinary SQL strings, so a lesson body's newlines
put 311 statements across 10,002 lines, and D1's import reads
statements line by line. It could not see one of them. Every value
is a hex literal now, so each statement is one line of ASCII
whatever is inside it, and `schools.test.mjs` executes the
generated file rather than building rows of its own.

#### Step 3: the door is built, and the files are not the source any more

The fork that was written here on 16 August has been taken rather
than left standing, because a plan with a decision still in it is
a plan somebody has to re-take.

**What was in the way.** `curriculum.js` is not a data file. Its
helpers close over its own array: `totalDays()` reduces over the
module-level `DHAPS`, and `stageLessons()`, `dhapCount()` and
`lessonUrl()` do the same in the other three schools. **Forty
files import from one of the four curricula**, and only four are
builders: `content.js` builds the Ctrl+K palette, `crumbs.js` the
breadcrumbs, `home.js` the front page, `build-meta.mjs` the
sitemap, `sw.js` the precache list, and each school's `hub.js` and
`progress.js` its ladder. Handing a builder a different array
reaches none of them.

**What was built instead of arguing with that.** The database gets
its own door, and the door is the thing every future reader uses:

- `shared/schools.js` reads the three tables and hands back the
  same shape the files export, with each school's own fields
  spread back out of `meta` and its lessons under the key that
  school uses for them: `lessons` for /learn/ and /quran/, `teile`
  for /deutsch/, `parts` for /english/. It is in `shared/` because
  the Worker, the Next route and the tests all need to say it the
  same way, which is what that directory is for.
- `functions/api/schools/` serves it: the ladder, a stage's
  lessons, one lesson with its text, and an admin `PUT` that
  writes a whole school in one batch.
- `scripts/schools-api.test.mjs` drives that endpoint against real
  SQLite, 24 checks: ladder order rather than alphabetical, a
  lesson at its `.html` address, an unwritten lesson as a row with
  an empty body rather than a 404, a stranger refused, and a
  payload naming two schools refused before it can half-write one.

**The browser keeps reading the file, on purpose.** A page that
draws a ladder cannot wait on a query to know what the ladder is,
and `curriculum.js` is offline-safe and synchronous. So the file
stays exactly where it is until Stage 11.7 replaces the pages that
read it. That is the same arrangement as every other part of this
transition: the file is the fallback until the route that replaces
it exists.

**Step 3 is done, and the diff is empty.** Every builder takes its
ladder and its prose from `scripts/school-source.mjs`, which reads
the files by default and the database when `SCHOOL_DB` names one.
`scripts/schools-build.test.mjs` imports the four curricula into a
temporary SQLite database with the real schema, runs each builder
twice into two temporary directories, and compares every file:
**229 pages, byte-identical, all four schools.**

Three small things made that possible and are worth knowing:

- **Nearly every helper in a `curriculum.js` was already pure.**
  `dhapLessons(dhap)` reads what it is handed; so do
  `stufeTeile`, `termParts` and `stageLessons`. Only
  `allLessons()`, `totalDays()`, `findDhap()` and `findByPath()`
  closed over the module's own array, and they take it as an
  argument now, defaulting to the module's. No existing caller can
  tell.
- **A builder gets a D1 interface over `node:sqlite`**, so
  `shared/schools.js` is the same code in the builder, the Worker
  and the Next route. A generator has to work with no network and
  no Worker, and this is how it does.
- **An unwritten lesson is left out of the bodies map** rather
  than written in as an empty string. A missing key is what
  `content/<stage>.js` means by "not written yet" and it is what
  makes the builders draw an "আসছে" page. An empty string would
  have produced a page with an empty article in it, and that is
  exactly the class of difference this diff exists to catch.

**What is left is step 4:** the rows become the source, the files
are retired to `archive/`, and the Studio grows a lesson editor.
That waits on the import having actually been run against the live
database, because the day the files stop being the source is the
day the rows have to be there.

---

### Stage 9 · React, where nobody can see it
**Status: done, 16 August 2026.** The desk at `/desk/`, all six
panels; the Studio at `/studio/`, everything the old page did. The
two old pages are in `archive/` as of the same day, out of the
deploy, with `_redirects` sending their URLs to the new ones.
Size: a week, spread out.

**What let them be archived**, rather than the date arriving: the
React Studio was driven through a real publish under the site's
own Content-Security-Policy, and a pasted photo reached R2 and
came back as a drawn share card. That is
`aab/studio-publish.test.mjs`, the test written for the bug where
none of that happened and nothing said so. Doing the same thing
the old page did, in the way that failed before, is what "used in
anger" was standing in for.

The toolchain exists and is proved: `app/` is Vite plus React plus
TypeScript, building to `aab/desk/`, and the result runs under the
site's real Content-Security-Policy with no CSP violations, no
page errors, and the site's own stylesheet applying unchanged.

**The output is committed**, and that is a decision worth
recording rather than apologising for. This site deploys by
uploading `aab/`; there is no build step in CI, and the build
command lives in a Cloudflare dashboard that cannot be seen from
the repository. Committing the bundle needs none of that, is one
`git revert` from gone, and is exactly what this repository
already does with `aab/learn/**` and the other three schools. The
rule is unchanged: edit the source, run the build, commit both.

Five things the port bought, none of them visual:

- **The API's shapes are written down.** `app/src/api.ts` names
  what a comment, a question and an article actually are. Before
  this they were known only by reading SQL in `functions/`, and
  each desk panel rediscovered them by hand.
- **A stale reply cannot paint.** `useRows` knows whether the
  request it is finishing is still the current one. The old desk
  had the same pattern written four times and got this wrong in
  all four: a slow answer for one filter could overwrite a fast
  answer for another.
- **A half-typed answer survives a redraw.** The questions panel
  keeps it in component state; the old one kept it in a
  `<textarea>` the panel owned and lost it on any repaint.
- **The site's own modules are described, not silenced.**
  `app/src/types/` declares `/content.js`, `/share-card.js`,
  `/photo.js` and the rest, and `tsconfig.json` maps the runtime
  path to the declaration. The first version put a
  `@ts-expect-error` above each import, which suppresses the
  complaint without describing anything: `pieceUrl(slug, section)`,
  arguments the wrong way round, would have compiled.
- **The desk has a browser test.** `app/desk.test.mjs`, 75 checks,
  every one of them a thing `desk.js` did. See the log entry for
  16 August: it is the only reason the second half of this stage
  can be called finished rather than assumed to be.

The first React in this repository should be somewhere a mistake
costs nothing: no reader, no search engine, no share card. That is
the Studio and the desk, both private, both `noindex`, and both
already the most complicated code on the site by a distance.
`studio.js` is over two thousand lines of imperative DOM work with
its own state model, which is precisely what a component tree is
for.

- A `app/` directory, Vite plus React plus TypeScript, building to
  `aab/studio/` and `aab/desk/`. No framework yet: a plain SPA
  behind the existing auth gate.
- The API layer is already there and already typed by its own
  shape (`aab/api.js`), so the port is UI only.
- The stylesheet stays exactly as it is. React renders the same
  class names into the same `@layer studio` rules. This is the
  single most important constraint of this stage: no CSS-in-JS, no
  Tailwind, no second design system.
- The old `studio.html` stays at its URL until the new one has done
  a real publish. Then it is deleted.

Still to do: nothing in this stage but deleting the two old pages,
once the new ones have been used in anger. The desk is done,
including the panels
that were held back the first time round (enquiries, subscribers,
what's read) and the Published panel's write actions, which were
held back on the grounds that they are where a port going wrong
costs something. That reasoning did not survive contact with the
result: a Published panel that could not draw a share card was not
a safer half of a panel, it was a page that sent you to the old
desk to finish the job. Drawing a card, moving a piece, restoring
a version and deleting a row are all here, and the browser test
drives every one of them.

**Done when:** a piece can be written, given photos, previewed,
pre-flighted and published from the React Studio, and the old files
are gone. **Rollback:** the old page is one revert away for as long
as it exists, and `/desk.html` is untouched.

---

### Stage 10 · Next.js takes one public route
**Status: on, and serving, with seven worksteps left of the eight
below. 16 August 2026.** The second Worker is deployed, the service binding is in
place, and an article at `/insights/<slug>.html` is rendered by
Next on the live site. That is not inferred from the
configuration: `scripts/check-live.mjs` asks reiad.co.uk and gets
back a page carrying Next's own chunks, the six security headers,
the canonical link, the drawn share card and the comment thread,
and one of those chunks comes back as JavaScript rather than as
this site's 404 page. The last of those is the one thing the note
below says cannot be proved from here, and it is proved now, from
CI, which can reach the site.

Lighthouse moved, which the "done when" did not allow for; the
number and the reasoning are below. The worksteps that remain are
under **Still to do**, and one of them is a test article live on
the public site.

- Next.js App Router, deployed to Cloudflare Workers through
  `@opennextjs/cloudflare`, in the same repository, behind the same
  domain.
- The current Worker stays in front and keeps every path except an
  allowlist. The allowlist starts with exactly one entry:
  `/insights/<slug>`, the article route, which by then reads
  entirely from D1 and has no static twin left.
- Server components only. ~~No client JavaScript on a reading
  page, because that is the current bar and dropping below it is
  not acceptable.~~ **Amended 16 August 2026, after measuring it:
  see the decision below.** There is no "use client" in the app and
  there should never be one on a reading page, but the App Router
  ships its own runtime regardless and that has been accepted.
- `styles.css` is imported whole. It stays one file.

**Done when:** an article renders through Next.js, its share card,
its structured data and its canonical link are byte-identical to
what the Worker produced, and Lighthouse has not moved.
**Rollback:** remove the path from the allowlist. One line.

**Three of those four are met. Lighthouse moved.** Measured on 16
August 2026, both renderers serving the same row from the same
local database, with Next's scripts actually being served:

| | the Worker | Next |
| --- | --- | --- |
| Performance | 74 | **64** |
| Total blocking time | 44 ms | **182 ms** |
| Largest contentful paint | 2817 ms | **3671 ms** |
| Transferred | 218 KB | **356 KB** |
| of which script | 134 KB | **270 KB** |
| Accessibility / Best practices / SEO | 96 / 96 / 100 | 96 / 96 / 100 |

That is the accepted 170 KB, priced in the units the acceptance
criterion was written in: ten Lighthouse points and four times the
blocking time. It does not reopen the decision, which was taken
knowing the bundle size. It says what the bundle size buys, and it
is recorded rather than smoothed over so the next person does not
have to rediscover it.

One measurement was wrong first, and how it was wrong is worth
keeping. The first run scored Next at **87**, better than the
Worker, because it was measuring a page whose six scripts were all
answering 404: none of them was downloaded, parsed or executed. A
performance score taken from a broken page flatters it.

---

#### What is built, and what it proved

`next/` is the App Router app: one route, `/[section]/[slug]`,
reading the same D1 database through the same binding, rendering
from `shared/look.js`, which is the table the Worker's own
renderer reads. `next/parity.test.mjs` starts the built Worker on
workerd with a local D1, asks it for an article, and compares what
comes back against `functions/insights/[slug].js` for the same
row: 42 checks, and they pass.

**"Byte-identical" had to become something checkable.** Two of the
three the sentence names can be exactly that and are compared as
strings: the canonical link and the structured data. The third
cannot. React decides attribute order and self-closing, so it
writes `<meta content="…" property="og:title"/>` where a template
string writes `<meta property="og:title" content="…">`, and it
writes `&#x27;` for an apostrophe. Both parse to the same thing.
So the bar is: every fact identical, checked one tag at a time,
and the article's own HTML identical as a string. That is what the
sentence was protecting.

#### Two things it found on the way

**Every article rendered from the database has been served without
a Content-Security-Policy.** `aab/_headers` is read by
Cloudflare's static asset server; a response a Worker builds is
not a static asset, so it gets none of it. A file-based article
had a CSP, HSTS and `X-Frame-Options`; the identical-looking
database one beside it had none of the three, and the page renders
the same either way, which is why it lasted. Fixed:
`shared/headers.js` holds the list, both renderers attach it, and
`scripts/check-headers.mjs` fails if it and `_headers` drift.

**Every article rendered from the database has been asking for a
truncated webfont URL.** The `FONTS` constant in
`functions/insights/[slug].js` literally ended
`&family=Noto+Seri[...]` in the source. Google Fonts answers a
malformed `css2?` request with a 400, so the whole stylesheet
failed: Spectral, both IBM Plex faces and both Noto Bengali faces
all fell back, on every piece published through the Studio. A
Bangla piece was reading in the system serif. Found by diffing the
Worker's rendered output before and after moving the table out,
which is the only reason it was ever going to be found: nothing
about the page looks broken unless you know what it should look
like.

#### The decision, and what it cost

**The App Router ships its own JavaScript to a reading page and
there is no supported way to stop it.** Six chunks, a React
runtime and a router, hydrating a tree with no interactivity in
it. The bullet above forbade that, and it was written before
anybody had measured it. Measured:

| | raw | gzipped |
| --- | --- | --- |
| A reading page before (`app.js`, `content.js`, `read-aloud.js`) | 94 KB | 31 KB |
| What Next adds | 566 KB | 170 KB |

Three ways out were put up: accept it; use the Pages Router for
reading pages, where `unstable_runtimeJS: false` removes all of
it; or leave the reading pages on the Worker, since a page of
prose gains least from React.

**Taken, 16 August 2026: accept it.** The site is going to grow a
lot, and being on Next.js is worth more than the kilobytes. The
alternative that reached zero was two routers in one app, with the
public half of the site resting on a flag that has carried an
`unstable_` prefix for years and a router the framework has
stopped investing in. That is a worse bet over the life of this
site than 170 KB.

What that costs, said plainly rather than waved through:

- Every reader downloads and parses about 170 KB that does nothing
  on an article. On the connection a reader in Dhaka actually has,
  that is real.
- It does not block the first paint and it is not a correctness
  problem: the page is complete HTML before any of it runs, and
  the parity test checks that the article is readable with none of
  it executed.
- The service worker caches it stale-while-revalidate like every
  other same-origin asset, and Next's chunk names are
  content-hashed, so a returning reader pays it once.
- `next/parity.test.mjs` holds it as a budget and fails if it
  grows. Accepted is not unwatched: the number that gets worse
  quietly is the one a dependency drags up six months from now.

#### The three that would have broken on switch-on

Four articles are still committed HTML rather than rows:
`dse-basics`, `dsex`, `onions`, `uk-visit-visa`. Today
`functions/insights/[slug].js` calls `context.next()` when D1 has
no row and the asset router serves the file.

The Next.js Worker cannot do that. It is a different Worker with no
ASSETS binding of its own, so all it can say is 404, and
forwarding the whole article prefix to it would have taken those
four pieces off the site the moment the service binding was added:
every link, every share, every search result. `fromNext()` in
`worker.js` treats a 404 from there as exactly what `context.next()`
means here, and falls back to the file. The parity test holds Next
to that contract from the other side, naming `dse-basics` and
`dsex` rather than describing the category. `dsex` is the sharper
case: it carries a 301 to `/learn/terms/dsex` in `_redirects` that
only fires if Next declines it.

**And every article would have 404ed at its own address.** Every
URL on this site ends in `.html`: `pieceUrl()` builds
`/insights/<slug>.html`, and that is the canonical link, the
sitemap entry, every internal link and everything anybody has
shared. The slug guard in `next/lib/article.ts` ran before the
suffix was stripped, and a dot is not in `[a-z0-9-]`, so every one
of them answered 404. The extensionless form worked, which is the
only reason the first parity test passed: it asked for the one
shape this site never produces. The test now asks for the real
address, the bare one, and a shouty-cased section, because
`worker.js` forwards all three.

**And Next's own JavaScript would have 404ed.** `.open-next/assets`
holds the scripts a rendered page asks for under `/_next/static/`,
and nothing in `aab/` matches that path, so the asset router
answered every one with `404.html`: six requests per view, 7.5 KB
of the 404 page each. The article still read, because it is
server-rendered and complete, so the only symptoms were a console
full of errors and a React that never hydrated. Neither shows on a
page of prose. The first interactive route in Stage 11 would have
been the thing that broke, a long way from the cause.

The obvious fix is to forward `/_next/*` over the service binding
too, and it does not work on its own: OpenNext's generated worker
never touches its ASSETS binding, because it assumes Cloudflare's
asset router runs in front of it, and **a service binding calls a
Worker's fetch handler and skips everything in front of it**.
`next/worker-entry.js` wraps the generated worker and answers
`/_next/static/` from ASSETS itself, so the Worker behaves the same
whichever way it is reached.

That wrapper is proved by running the same code as a primary
Worker, where the identical `env.ASSETS.fetch()` returns the file.
`wrangler dev` does not serve assets for an *auxiliary* worker, so
the combined local run still answers 500 for those paths, and that
is a limitation of the dev server rather than of the arrangement.
It is the one thing in this stage that cannot be proved from here,
which makes it the first thing to check after switching on: open
one `/_next/static/chunks/*.js` URL and see JavaScript rather than
a page.

#### And two things a human had to do, both done 16 August 2026

Both landed the same afternoon: `reiad-next` was deployed at
07:41 UTC, the front Worker at 07:39 UTC with the binding in it,
and the live check above is what says the pair actually works
rather than merely existing. The deployed code was read back out
of both Workers to be sure the account is running what this
repository holds: the front one carries `NEXT_ROUTES` and
`goesToNext()`, the second one carries `IS_ASSET` from
`worker-entry.js` and the `.html` strip in `article.ts`.

They are kept below because the next person setting this up from
an empty account has to do them again, in this order.

1. **Create the second Worker.** `next/wrangler.jsonc` deploys as
   `reiad-next`, with its own build (`npm run deploy` in `next/`).
   It cannot be deployed from here: it needs Cloudflare
   credentials, and the deploy command for the main Worker lives
   in a dashboard this repository cannot see.
2. **Add the service binding.** The front Worker reaches the
   second one through `env.NEXT`, which needs this in
   `wrangler.toml`, after the second Worker exists:

   ```toml
   [[services]]
   binding = "NEXT"
   service = "reiad-next"
   ```

   Until both are true, `goesToNext()` in `worker.js` is false for
   every path and the site behaves exactly as it does today. The
   allowlist is already filled, so the route turns on by itself the
   moment the binding lands, and the rollback is deleting the
   binding or emptying `NEXT_ROUTES`.

#### Still to do

Found by auditing the switched-on stage against the live site on
16 August 2026, rather than against the plan. The order is by what
a reader would notice first.

**10.1 A test article is live on the public site.** The row
`insights/test-react-article`, titled "Test Article", body "It's a test",
published at 04:40 UTC on 16 August while the React Studio was
being driven. It is a `live` row, so every list that reads the
database has it: the sitemap, the feed, the Insights hub, the home
page rotation and the Ctrl+K palette. It is also what the next
nightly `backup.yml` run will commit into
`content/articles.backup.json`, which is the file that is meant to
be restorable. Set the row to `draft` or delete it from the desk's
Published panel. *Done when* the sitemap no longer lists it and
`scripts/check-live.mjs` counts one piece fewer.

**10.2 The repository still says four pieces are files, and three
of them are rows.** `dse-basics`, `onions` and `uk-visit-visa` were
all written into D1 on 15 August, so the only piece
`fromNext()` actually catches today is `dsex`, which is a redirect
stub `_redirects` covers anyway. The fallback is the right shape
and stays; what is wrong is everything that describes it. The long
comment in `worker.js`, the named list in `next/parity.test.mjs`,
and the prose under **The three that would have broken on
switch-on** all name four pieces that no longer exist in that
state. `aab/insights/dse-basics.html` is now a twin nobody is
served: the row says three minutes where the file says five, and a
reader gets the row. *Done when* `node scripts/check-pieces.mjs
--live` and those three descriptions agree, and Stage 3 has either
deleted the file or said why it stays.

**10.3 Nothing runs the checks.** The only workflow this
repository had was the nightly backup. The eight `check-*.mjs`,
the eight server tests and `next/parity.test.mjs`, 49 checks that
exist precisely to catch a Stage 10 regression, are all run by
hand, and `Merging: do it, do not ask` in `CLAUDE.md` leans its
whole weight on them having been run. `live-check.yml` is the
first CI that is not the backup, and it only asks the deployed
site. *Done when* a workflow runs the offline checks on every
push, and the parity test when anything under `next/` or
`shared/` changes.

**10.4 The house checklist did not mention either Stage 10 test.
Done, 16 August 2026.** `CLAUDE.md`'s **Before deploying** list
named eight checks and its second list eight tests, and
`next/parity.test.mjs`, the 49 checks that exist to catch exactly
this stage regressing, was in neither. It has its own block now,
under the condition that should trigger it: anything under `next/`
or `shared/` changing. `scripts/check-live.mjs` belonged in
neither, because it describes what is deployed rather than what is
committed, so it has a heading of its own that says after.

**10.5 The second Worker answers at its own address.**
`next/wrangler.jsonc` does not set `workers_dev`, and the default
is on, so `reiad-next` is also reachable at
`reiad-next.<subdomain>.workers.dev`, where it renders the same
articles with a canonical link pointing at reiad.co.uk, no
`/media/` photos (it has no R2 binding, and that path is the front
Worker's) and none of `_redirects`. Two addresses for one piece is
the thing `getArticle()` already refuses across two mounts, and it
is worth refusing here too. The front Worker has the same setting
and the same issue, which predates this stage. *Done when*
`workers_dev` and `preview_urls` are off in both configurations
and neither hostname answers.

**10.6 Lighthouse was measured on a local pair, never on the live
one.** The table under this stage came from two local runs against
a local database, which was the only thing possible at the time.
The live pair can be measured now, and the two numbers that
matter, transferred bytes and blocking time, are the ones a reader
in Dhaka actually pays. *Done when* the live numbers sit beside
the local ones in that table, marked as which is which.

**10.7 The parity test can skip for the wrong reason.** Its
readiness loop treats any log line matching `Error: ` as a failed
start, and `wrangler dev` prints exactly that, harmlessly, in a
sandbox with no outbound network: it cannot fetch the `Request.cf`
object and says so with a stack. The test then prints "wrangler
dev did not start, so the parity check is skipped" and exits 0.
Optional is fine; indistinguishable from passing is not. *Done
when* the detector matches only real startup failures, and the
skip line says which of the two happened.

**10.8 An article view is two Worker invocations now, and nothing
priced that.** The front Worker runs, matches the allowlist and
calls the second one over the binding. It never leaves Cloudflare
and it is not a network hop, but it is two billable invocations
where there was one, on the most-read kind of page on the site.
Not a bug and not urgent: written down so that the first surprising
invoice has an explanation waiting for it. *Done when* the number
has been looked at once, after a week of real traffic.

---

### Stage 11 · Every remaining route, until no page is a file
**Status: not started.** Size: months, at whatever pace suits.

Stage 10 moved one route and proved the machinery: an allowlist in
`worker.js`, a service binding, a fallback for anything the second
Worker does not have, and a parity test that holds the new
renderer to what the old one said. Everything below is that same
move, repeated, with the allowlist growing one entry at a time.

**Done when `find aab -name '*.html' | wc -l` returns 0**, or
returns only files whose reason for existing is written down here
and is not "we have not got to it". It was 283 when this was
written and it is 281: `studio.html` and `desk.html` went to
`archive/` with Stage 9's last open item. Each step below says
what it deletes, and the step is not finished while its files are
still in the repository.

**A file leaves `aab/` for `archive/`, it is not deleted.** The
directory is out of the deploy and out of every import, which is
the whole of what "gone from the site" means here, and it keeps
the thing the replacement was measured against. `archive/README.md`
has the rule: something is archived when nothing serves it and
nothing imports it, and never before.

**The order is by risk, not by appetite.** A step near the top
being wrong costs a reading page for a few minutes; a step near
the bottom being wrong costs the schools, offline, or the ability
to publish.

**11.1 The three reading hubs.** `/insights.html`, `/cooking/` and
`/travel/`. Three lists of the same shape, already reading the
database through the API, and the reason they are first is that
they are one component pretending to be three pages. *Deletes* 3
files. *Needs* nothing that does not exist.

**11.2 The other two article mounts.** `/cooking/<slug>` and
`/travel/<slug>` join `/insights/<slug>` in `NEXT_ROUTES`, which
is the entry Stage 10 deliberately did not make. *Deletes* what is
left of `aab/insights/`, `aab/cooking/` and `aab/travel/`, which
is the last of the file pieces. *Needs* Stage 3 to have finished
retiring them, and workstep 10.2 to have said out loud which ones
are still files.

**11.3 The portfolio and the seven case studies.** The most
component-shaped pages on the site, and the ones where the rule
above earns its keep: every `.model.js` and `.data.js` stays where
it is, imported by the route, with its tests running on every
commit exactly as now. What moves is the page around the numbers,
not the numbers. *Deletes* 8 files. *Needs* the chart and table
markup lifted into components without touching a class name.

**11.4 The tools.** `/tools/` and the calculators. This is the
first place a `"use client"` is correct rather than a mistake: a
calculator is an input, a number and a recalculation, which is the
thing React is for, and it is the opposite of the reading page
Stage 10 argued about. The models stay modules. *Deletes* 2 files.
*Needs* a decision on whether the stock check's forty-four ratios
render on the server first, and `COUNTS` in `content.js` still
counting them.

**11.5 The remaining hand-written pages.** The home page,
`/about`, `/contact`, `/colophon`, `/account`, `/skills`.
*Deletes* 6 files. *Needs* the home page's rotation and the
palette to keep reading `content.js`, which by then is structure
only.

**11.6 The desk and the Studio.** Two React apps today, built by
Vite into `aab/desk/` and `aab/studio/` behind a hand-written HTML
shell each. Under Next they are routes in the same app: one build
instead of three, and `vite.config.ts`'s list of externals stops
being a thing that can drift. *Deletes* the two shells and the
second build. The two pages these replaced are already gone: they
went to `archive/` on 16 August 2026, which was Stage 9's last
open item and not this step. *Needs* `app/desk.test.mjs` and `app/studio.test.mjs`
repointed at the new addresses, because those two files are the
written-down list of what the old pages did.

**11.7 The four schools.** 251 of the 283 files: learn 91,
deutsch 64, quran 62, english 34. The builders stop writing HTML
and become the thing that seeds the database Stage 8 creates; the
route renders a lesson from it. This is the largest deletion in
the project and the one that has to go last, because it is the
only one that can take offline reading with it. *Deletes* 251
files. *Needs* Stage 8, and the offline answer below.

**11.8 What is left, and why.** The steps above account for 279
of the 283. The other four are `404.html`, `offline.html`,
`work.html` and `services.html`.

The last two are already dead and nobody has noticed: `_redirects`
sends `/work.html` and `/services.html` to `/portfolio` before the
asset router is consulted, so the files have been unreachable
since that rule was written. They can go at any point, and the
only reason to wait is to check nothing else reaches them first.

The first two are asked for by something that is not a route:
`not_found_handling` in `wrangler.toml` names `404.html`, and
`sw.js` serves `offline.html` when the network is gone. Whether
they stay files or become Next routes with a copy the service
worker keeps is a real decision and not a leftover, and it gets
written here when it is taken.

#### The three things that can go wrong across all of it

**Offline.** `sw.js` precaches 68 files today and a school page is
one of them. A page rendered by a Worker can still be cached, but
it is cached after it is first fetched rather than at install, so
the reader who loses their connection between lessons is the one
who finds out. Any step that moves a precached page has to say
what the service worker does instead, and `check-sw.mjs` has to
keep passing.

**Weight.** Stage 10 accepted 170 KB of framework on a reading
page once. It is accepted once, not once per stage: the chunk
budget in `next/parity.test.mjs` is the mechanism, and every route
that moves gets held to a budget in the same way, so that the
total goes up because somebody decided it should rather than
because six routes each added a little.

**Headers.** Every page a Worker builds needs `SECURITY_HEADERS`
attached by hand, because `aab/_headers` only applies to files.
The more pages stop being files, the more of the site depends on
`middleware.ts` and `htmlResponse()` being right, and on
`check-headers.mjs` catching the two lists drifting apart. The day
the last file goes, `_headers` covers nothing that matters and
that is the day to be most careful about it.

---

### Stage 12 · The backend, typed and in one shape
**Status: not started.** Size: weeks. Runs alongside Stage 11
rather than after it.

Twenty-two files under `functions/`, 1,842 lines, all plain
JavaScript, each one a Pages Functions handler that `worker.js`
now rebuilds a fake context for. They work. What they are not is
one thing: there is no shared idea of a request, a response, an
error, or who is asking, and every handler re-derives all four.

**What is actually wrong, before anything is moved.**

- **Nothing is typed.** A row read out of D1 is `any` on the way
  out and stays `any` all the way to the page. `shared/look.js`
  has an `Article` type that only the Next route benefits from,
  and the Worker's own handlers cannot see it.
- **The context is a reconstruction.** `worker.js` builds
  `{ request, env, params, next, waitUntil }` by hand because the
  handlers were written for Pages Functions, a thing this site no
  longer deploys as. That shim is the only reason they run.
- **Validation is per handler.** Each one reads its own body,
  checks its own fields and writes its own error shape. The
  comments handler and the questions handler are the same handler
  with different nouns, and they disagree about what a bad request
  looks like.
- **`api.js` in the browser knows every path by string.** A route
  renamed on the server is caught by a reader, not by a check.

**Where it goes.** One typed API, in TypeScript, sharing its
types with the pages that call it, in `shared/` where the Worker,
the browser and Next can all reach them. In order:

1. **The types first, and only the types.** `Article`,
  `Comment`, `Question`, `Subscriber`, `Enquiry`, each one written
  once and imported everywhere, including by the handlers that
  still return `any` today. Nothing moves; things start being
  described.
2. **One request pipeline.** Parse, validate, authorise, handle,
  respond, with a single error shape and a single place that
  decides what a 400 looks like. The handlers become the middle
  of that sandwich rather than the whole of it.
3. **The handlers become route handlers.** A Next.js route handler
  under `next/app/api/**` is the same function with the shim
  removed, and it is where this ends up for anything the site's
  own pages call. The order follows Stage 11: an API moves when
  the page that calls it moves, so the two halves are never a
  version apart.
4. **`api.js` stops knowing strings.** One typed client, generated
  from or checked against the same definitions, so a renamed route
  is a build error.

**What stays a separate Worker, and why.** Not everything belongs
in the app. `market-pulse` is a scheduled job that talks to an
exchange and answers one question; the nightly backup and the
Notion sync are crons that must run whether or not anybody is
reading. Those are services, and a service that has its own
schedule, its own failure mode and its own rate limit is better
off with its own deployment. The test for splitting one out is
that it has a reason of its own to fail, and not that it feels
tidier.

**Done when:** no handler under `functions/` is untyped, one
pipeline decides what a bad request looks like, `api.js` cannot
name a route that does not exist, and the shim in `worker.js` has
nothing left to shim.

**Rollback:** each handler moves on its own, and the one before it
is still there.

---

### Stage 13 · The last JavaScript
**Status: not started.** Size: continuous, and mostly a
by-product.

The language mix is the honest measure of how far this has got.
On 16 August 2026 GitHub reads this repository as 61% HTML, 33%
JavaScript, 3% CSS and 2% TypeScript. Two thirds of that is the
compiler's output rather than anybody's writing: 251 generated
school pages and two Vite bundles. `.gitattributes` now says which
files those are, so the bar measures the source, and that is a
labelling fix and not progress. The progress is below.

**What actually moves the number, in the order it happens.**

1. **Stage 11 deletes HTML.** 281 files, each one moving into a
   route and a database row. This is the whole of the first bar.
2. **Stage 12 types the backend.** 22 files, 1,842 lines, from
   `.js` to `.ts`.
3. **The browser modules convert as their pages move.** This is
   the part with a rule attached, because getting it wrong wastes
   weeks: **a module that Stage 11 is going to delete is not
   converted.** It is rewritten as a component when its route
   moves, and converting it first would be paying for the same
   file twice.

**What survives Stage 11 and therefore has to be converted
properly**, rather than deleted: `editor.js`, `api.js`,
`content.js`, `auth.js`, `share-card.js`, `photo.js`, `sw.js` and
what is left of `app.js`. They are the site's own modules, they
are already imported by the React apps through hand-written
declarations in `app/src/types/`, and those declarations are the
list of what to convert. A declaration file is a description of
something untyped; deleting the description by typing the thing
is the point.

**One that does not convert, and it is deliberate.** `sw.js` is
served to the browser as a service worker at a fixed path and is
not built by anything. It becomes TypeScript only if the site
grows a build step that emits it at that same path, and adding a
build step to make a language bar move is the wrong reason.

**Done when:** the modules above are `.ts`, `app/src/types/` is
empty because nothing needs describing from outside, and the bar
reads mostly TypeScript because that is mostly what the
repository is.

---

## 5. Status board

| Stage | What | Status |
| --- | --- | --- |
| 0 | Inventory and this document | done, Aug 2026 |
| 1 | Every list reads the database | done, 15 Aug 2026 |
| 2 | Backup out of the database | done, 15 Aug 2026 |
| 3 | The file pieces move in | rows done 15 Aug 2026, files stay a fortnight |
| 4 | The Studio stops writing files | done, 15 Aug 2026 |
| 5 | Accounts, and nothing else changes | done, 15 Aug 2026 |
| 6 | Progress follows the account | done, 15 Aug 2026 |
| 7 | Comments, moderated, grown from Questions | done, 15 Aug 2026 |
| 8 | The schools' content into the database | steps 1 to 3 done 16 Aug 2026, 229 pages byte-identical from D1 |
| 9 | React in the Studio and the desk | done 16 Aug 2026, old pages archived |
| 10 | Next.js takes the article route | on and serving 16 Aug 2026, seven worksteps open |
| 11 | Every remaining route, until no page is a file | not started, 281 files to go |
| 12 | The backend, typed and in one shape | not started |
| 13 | The last JavaScript | not started |

---

## 6. Issues, in detail

Open issues found while writing this document. Each one is a real
thing in the code today, not a hypothetical.

**I1. Three places link to `/insights/<slug>.html` regardless of
section.** `renderArticleCards()` and `addToSearchIndex()` in
`aab/app.js`, and `functions/api/search.js`. A kitchen or travel
piece published to D1 gets a card and a search result pointing at a
URL that 404s. Nothing has hit this yet only because every published
piece so far is either in Insights or exists as a file with a
`content.js` entry. Fixed by Stage 1; worth fixing sooner if a piece
is published to a Bangla section before Stage 1 lands.

**Fixed in Stage 1**, 15 August 2026.

**I2. The two Bangla hubs cannot see the database at all.**
`reads.js` builds its cards from `section.pieces()`, which is
`content.js` and nothing else. A piece published through the Studio
into the kitchen is invisible on `/cooking/`. Fixed by Stage 1.

**Fixed in Stage 1**, 15 August 2026.

**I3. `COUNTS` counts the manifest, not the site.** `COUNTS.cooking`
and `COUNTS.travel` count `content.js` entries, so the moment a
piece exists only in D1 the hub says one number and shows another.
This breaks the counting rule in CLAUDE.md, which exists precisely
because that went wrong twice before. Fixed by Stage 1.

**Fixed in Stage 1**, 15 August 2026, by counting the cards drawn
rather than by making `COUNTS` asynchronous.

**I4. `/insights.html` merges every live row, whatever its
section.** `getArticles()` returns all of them and the card list
does not filter, so a kitchen piece would appear on the Insights
index. Fixed by Stage 1.

**Fixed in Stage 1**, 15 August 2026.

**I5. Two renderers for one article page.** `buildPage()` in
`studio.js` and `render()` in `functions/insights/[slug].js` build
the same page from the same fields, and the comment at the top of
the second one asks you to change both. They have drifted twice:
once on the nav links, once on the Open Graph tags. Resolved by
Stage 4, which deletes the first.

**I6. The service worker precaches article files by name.** The
precache list in `aab/sw.js` names `/cooking/onions.html` and
`/travel/uk-visit-visa.html`. Stage 3 deletes those files, so that
stage has to remove them from the list and bump `VERSION` in the
same commit, or `check-sw.mjs` will fail and, worse, returning
readers will hold a cached copy of a page that no longer exists.
A D1 article is network-first HTML and needs no precache entry.

**I7. D1 is a single point of failure for the writing.** Today an
article is in git, with history, on every machine that has cloned
the repository. After Stage 3 it is one row in one database in one
account. `article_versions` keeps twenty bodies per slug, in the
same database, which protects against a bad edit and not against
anything else. Stage 2 exists for this and must land before Stage 3,
not after.

**I8. Nothing reviews an article any more.** A file piece goes
through a pull request, which is a diff someone can read. A
published row goes live the moment Publish is pressed. That is the
point of the Studio and it is also a real loss. Not solved by this
plan; worth deciding later whether the desk should grow a "changed
since last published" view.

**I11. The site refused to talk to Supabase, 15 August 2026.** The
magic link came back "Failed to fetch" from the live site, with the
auth API healthy, CORS correct and no request ever arriving.
`connect-src` in `aab/_headers` lists the hosts this site's
JavaScript may talk to, and Supabase was not on it, so the browser
blocked every request before it left. Google sign-in still worked,
because a redirect is a navigation rather than a fetch, which made
it look like an outage somewhere else entirely.

Fixed by adding the host. The lasting part is `check-csp.mjs`,
which fails if browser code names a host the policy does not allow,
or if the list of deliberate exceptions grows an entry that matches
nothing. It catches the original bug on a clean checkout, which was
the test. **The lesson: a policy this repository sets on itself can
break a feature in a way that looks like somebody else's fault, so
it needs a check like everything else here.**

**I10. Sign-in worked and looked broken, 15 August 2026.** The
first live Google sign-in created the account, wrote the session
and came back to the site, and the header went on saying "Sign in"
for thirty-one seconds. Two causes, both mine, both now fixed:
`initSignIn()` was imported on the last line of `app.js`, behind
the service worker registering and precaching sixty-one files, and
even once it ran it asked `/auth/v1/user` who the reader was before
it would paint a name.

The header now reads the name out of the access token, which is a
signed statement the browser already holds, so it is right on the
first frame with no network at all. The import moved ahead of the
service worker. **The lesson worth keeping: anything a reader looks
at immediately after an action must not wait on a round trip, and
"it works, just slowly" is indistinguishable from "it is broken"
to the person looking at it.**

A third thing came out of the same hour: a sign-in that comes back
refused put nothing on the screen at all, because the code only
looked for tokens in the fragment and ignored an `error` in it.
The panel now opens and says what the provider said.

**I12. Two Workers nobody in this repository knew about, one of
which could write to the live database. Closed 16 August 2026.** Asked to check the
connections on 16 August 2026, and the account holds five Workers:
`reiad-website`, `reiad-next` and `market-pulse`, which are all
accounted for, plus **`reiad-web`** and **`reiad-api`**, both
deployed on 14 August and mentioned nowhere in this repository.

Their code was read back to identify them. `reiad-api` is a bundle
of this site's own `functions/api/**` from that day, including
`functions/_lib/db.js` and its `MIGRATIONS`, so it is a second
copy of the API running two-day-old code, with whatever bindings
it was deployed with. `reiad-web` is an OpenNext bundle, an
earlier attempt at what `reiad-next` is now. Both are from the
window `wrangler.toml` describes at the top of itself, when the
live Worker was built from a `worker.js` that only existed on
somebody's laptop.

A stale copy of an API is not harmless the way a stale copy of a
page is. If `reiad-api` still has the `DB` binding it was deployed
with, it is a write path into the production database, running
code that predates the reader-identity work in Stage 5 and the
comment moderation in Stage 7, reachable at its own `workers.dev`
address by anybody who guesses the name. Nothing in this
repository would notice, because as far as this repository is
concerned it does not exist.

**Done, 16 August 2026.** Both were deleted. The account holds
`reiad-website`, `reiad-next` and `market-pulse`, and nothing else
that can reach the database. Workstep 10.5 is the same question
asked of the Workers that are supposed to be there, and is still
open.

**I9. `aab/insights/dsex.html` is an orphan.** It has no entry in
`ARTICLES`, nothing on the site links to it, and its own canonical
link points at `/learn/terms/dsex.html`. It is a leftover from when
the glossary lived under `/insights/`. It costs nothing today and
it will confuse whoever runs Stage 3, so delete it then, with a
redirect to the term page in case anything out in the world still
holds the URL.

---

## 7. Decisions, and what was turned down

**Next.js on Cloudflare through `@opennextjs/cloudflare`, not
Pages or Vercel.** The site is a Worker with D1 and R2 bound to it.
Anything that moves hosting moves the database, the media and the
auth cookie with it, and that is a different and much larger
change.

**React in the Studio first, not on a reading page.** The Studio is
private, has no SEO surface, and is the code that would benefit
most. A reading page is the opposite on all three counts.

**Not Tailwind, not CSS-in-JS, not a component library.**
`styles.css` is one file with an explicit layer order and a check
that guards it. Introducing a second styling system alongside it
would double every visual decision for the length of the migration,
which could be years.

**Supabase for people, D1 for writing. Decided August 2026.**
Cloudflare could hold all of it, and hand-rolling auth in a Worker
is the part that would have gone wrong: magic links, Google, session
rotation and row-level security are a month of work and a permanent
liability. Articles stay in D1 because a reading page must not wait
on another provider to render. The seam is one sentence, in section
2, and it is worth keeping sharp.

**Sign in with a magic link or Google. Decided August 2026.**
Passwords are switched off at the start and can be turned on in the
Supabase dashboard later without a code change, which is the whole
argument for letting Supabase own this.

**Every comment is approved before anyone sees it, including from a
signed-in reader. Decided August 2026.** It is the strict end of
the range on purpose: loosening it later is a settings change
nobody notices, and tightening it after the spam arrives is a bad
week.

**Schema changes are migrations in this repository, not queries in
a dashboard. Decided August 2026,** once the Supabase GitHub
integration was connected. It means the database has the same
history as the code, a schema change is reviewable in a pull
request, and a fresh Supabase project can be rebuilt from the
repository. It also answers part of I8: a comment cannot be
reviewed before it is posted, but the shape of the table it lands
in can be.

**Not a big-bang rewrite in a branch.** The one thing that reliably
kills a migration like this is a long-lived branch that has to be
merged all at once. Every stage here ships to production on its own.

---

## 8. What needs a human, and when

Everything else on this list can be done from here. These cannot,
and each one blocks the stage it sits under.

**Done, 15 August 2026:** the Google OAuth client and the site URL
were set up in the browser. The first real sign-in is what confirms
them; until somebody signs in on `reiad.co.uk` neither has been
proved, and the two ways they usually fail are listed with the log
entry below.

**Before Stage 5 (accounts):**

1. **A Google OAuth client.** In the Google Cloud console: create an
   OAuth client of type Web, and give it the callback
   `https://wvjarqnnmkkuxyrndtya.supabase.co/auth/v1/callback`. Then
   paste the client ID and secret into the Supabase dashboard under
   Authentication, Sign In, Google. Two fields, one console, and it
   is the only part of sign-in that cannot be scripted.
2. **The site URL in Supabase.** Authentication, URL Configuration:
   site URL `https://reiad.co.uk`, and a redirect URL for it.
   Without this a magic link sent from the live site comes back to
   localhost.
3. **A real email sender, eventually.** Supabase's built-in mailer
   is rate limited and is for testing. Resend or Amazon SES, added
   under Authentication, Emails, once more than a handful of people
   are signing in. Not a blocker on day one.

**Not needed, and worth saying so.** No Cloudflare secret is
required for accounts. The Supabase project URL and its publishable
key are designed to be public and can sit in the repository like
any other configuration; the Worker verifies a signed-in reader by
checking the token's signature against the project's public keys,
so the service role key never leaves the dashboard and is never
put anywhere near this site.

The project this refers to is `wvjarqnnmkkuxyrndtya`,
`https://wvjarqnnmkkuxyrndtya.supabase.co`, in `ap-south-1`, which
is the closest Supabase region to Dhaka.

---

## 9. Log

Append only. Newest first. One entry per landed stage or per
decision worth remembering.

### 2026-08-16 · The import wrote nothing, successfully
The first real run of the schools import uploaded 914 KB and
reported "Processed 0 queries. Executed 0 queries in 2.01ms",
with a success table under it. The database was untouched and
nothing in the output said anything was wrong.

**The file was the problem, and the test could not see it.** Every
value was quoted as an ordinary SQL string, which is correct SQL.
A lesson body is HTML with newlines in it, so a single INSERT ran
to hundreds of lines: 311 statements over 10,002 lines.
`wrangler d1 execute --file` hands the file to D1's import, which
reads statements line by line, and a statement that does not end
on its own line is not a statement it can see.

**`schools.test.mjs` passed the whole time**, because it inserted
the rows with prepared statements. It proved the data and never
the file, and the file is the only part anybody actually runs.
That is the same shape as the parity test that once asked for the
one URL this site never produces: a test that exercises a path
nobody takes agrees with itself.

Fixed in three places, because one of them alone would let it come
back:

- every value is a hex literal now, `CAST(x'...' AS TEXT)`, which
  cannot contain a quote, a newline or a semicolon. 314 statements,
  317 lines, twice the bytes, and each statement is one line of
  ASCII whatever Bangla, Arabic or HTML is inside it.
- `toSql()` throws if a statement it built spans more than one
  line, so the property is asserted where it is created.
- `schools.test.mjs` executes the generated file as text and
  checks both that every statement ends on its own line and that
  nothing opens a transaction, which D1's import also refuses.

And the script now prints how many queries the file holds, so the
number wrangler reports has something to be checked against. A
silent zero is the only failure mode this import has.

**The two orphan Workers are gone**, confirmed from the account:
`reiad-api` and `reiad-web` are deleted, leaving `reiad-website`,
`reiad-next` and `market-pulse`. Issue I12 is closed.

### 2026-08-16 · Step 3 is done: 229 pages, built from the database, identical
All four builders can read the rows, and every page they write
comes out byte-identical to the page the files write: quran 61,
deutsch 63, english 33, learn 72.

**The test is the deliverable.**
`scripts/schools-build.test.mjs` imports the four curricula into a
temporary SQLite database with the real schema, runs each builder
twice into two temporary directories, once from the files and once
from the database, and compares every file as a string. Nothing
touches `aab/`, and the run that fails prints the first differing
line of the first differing page, because "23 pages differ" tells
you nothing about what to fix.

This is the only kind of check worth having here. A ladder that
comes back in the wrong order still renders a page. A lesson whose
`blurb` was dropped still renders a page. A ধাপ whose Arabic title
went missing renders in Bangla, correctly, with one line gone.
None of those is an error and all of them are a diff.

**What made it small.** Nearly every helper in a `curriculum.js`
was already a pure function of what it is handed:
`dhapLessons(dhap)` reads `dhap.sections`, and `stufeTeile`,
`termParts` and `stageLessons` do the same. Only four closed over
the module's own array, and those take it as an argument now with
the module's as the default, which no existing caller can see.

**And one detail that would have failed the diff on every school.**
A lesson nobody has written yet is a missing key in
`content/<stage>.js`, not an empty string, and that is what makes
a builder draw an "আসছে" page. The row for it has an empty body,
so the database reader leaves it out of the bodies map rather than
handing back `""`. The other way round produces a page with an
empty article in it: a real page, a valid build, and the wrong
site.

**What is left is step 4**, and it is gated on something outside
this repository: the files stop being the source and go to
`archive/` only once the import has actually been run against the
live database. The tables are there and empty. One command fills
them.

### 2026-08-16 · The schools have a database door, and the fork is closed
Told plainly that a fork written into a plan is not an answer, so
it was taken rather than left standing.

**The tables are created on the live database.** `school_stages`,
`school_sections` and `school_lessons` exist on `reiad` now, not
only in the migration file. They are empty until somebody runs the
one command that fills them, and that command needs Cloudflare
credentials this session does not have:

```sh
node scripts/import-schools.mjs > schools.sql
npx wrangler d1 execute reiad --remote --file=schools.sql
```

**And the door they are read through is built and tested.**
`shared/schools.js` hands back the shape the files export, out of
`shared/` because the Worker, the Next route and the tests all
have to say it identically. `functions/api/schools/` serves the
ladder, a stage, one lesson with its text, and an admin `PUT` that
writes a whole school in one batch.
`scripts/schools-api.test.mjs` drives it against real SQLite: 24
checks, including a ladder that comes back in ladder order rather
than alphabetical, a lesson answering at its `.html` address, an
unwritten lesson as a row with an empty body rather than a 404, a
stranger refused, and a payload naming two schools refused before
it can half-write one.

**Why the browser keeps reading `curriculum.js`.** A page that
draws a ladder cannot wait on a query to know what the ladder is,
and that file is synchronous and works offline. Forty files import
from one of the four curricula and only four are builders. So the
file stays until Stage 11.7 replaces the pages that read it, which
is the same arrangement as every other part of this transition:
the file is the fallback until the route that replaces it exists.

**The write side replaces a school rather than merging it.** While
the files are still the source these tables are a copy, and a copy
that half-updates is worse than one rewritten: the lesson that
quietly kept its old text is the failure this whole stage is
arranged around. It is one `batch()`, so the delete and the
inserts are one transaction and a failure halfway cannot leave a
school with no lessons in it.

### 2026-08-16 · Stage 8 begins: the four curricula are rows now
Asked which to build next and told: the schools. Steps 1 and 2 of
Stage 8 are done and step 3 is deliberately not.

**Three tables, one importer, one test.** `school_stages`,
`school_sections` and `school_lessons`, in `aab/schema.sql` and in
the self-applying migrations in `functions/_lib/db.js`.
`scripts/import-schools.mjs` reads all four curricula and their
prose and writes the rows as SQL. `scripts/schools.test.mjs` runs
that SQL against real SQLite through `node:sqlite`, reads it back
and compares it to the files field by field: 17 stages, 61
sections, 233 lessons, 178 of them written, every body identical
as a string.

**Nothing reads the rows.** The files are still the source of
truth and the builders still read them, so today this changes
nothing a reader could see. That order is the point: the
dangerous version of this migration is the one where the schema,
the importer and the readers all land together and the first
person to notice a lost paragraph is somebody reading a lesson.

**Why there is a `meta` column.** The four schools are genuinely
different and were written that way deliberately. `/learn/` has
stages and sections, `/deutsch/` has Stufen and Teile and a thirty
day Arbeitsbuch, `/quran/` makes the day itself the lesson and
carries Arabic beside every Bangla line, `/english/` has terms and
parts. Flattening that into one wide table would have lost fields
or invented forty. So the columns are what every school has and
what a query actually needs, `meta` is that school's own fields as
JSON, and the round trip is what makes a JSON column safe rather
than lazy.

**Two silent failures, caught by comparing values rather than
counting rows.** The first importer assumed every school called a
lesson a `lesson`. Two do not: `teile` in German, `parts` in
English. It imported both of those schools with zero lessons and
said nothing, and a check that counted what it found would have
passed. Then the read query: ordering lessons by their stage's
slug sorts the money school's ladder alphabetically, which is
advanced, basics-1, ..., start. The other three schools have slugs
that happen to sort correctly, so it would have looked right three
times out of four. Both are now checks.

### 2026-08-16 · The old Studio and desk are archived, and the plan grows two stages
Four questions arrived together: are the shells Next yet, why are
the old admin pages still there, which database do the schools go
in, and why does GitHub still read this repository as HTML and
JavaScript. They have one answer between them, which is that the
transition had been adding things without removing any.

**`studio.html`, `studio.js`, `desk.html` and `desk.js` are in
`archive/`.** Out of `aab/`, so out of the deploy; `_redirects`
sends both URLs to the React pages. The directory is not a
graveyard: `archive/README.md` says what replaced each file, and
the rule for putting something in it is that nothing serves it and
nothing imports it.

**What made that safe was running the test the bug was written
for.** `aab/studio-publish.test.mjs` drives a real publish under
the site's own Content-Security-Policy, and it now drives the
React Studio: a pasted photo reached R2, came back as a
`/media/...` path, and a 1200x630 JPEG card was drawn and
uploaded beside it. That is the exact path that was silently
broken for weeks, so doing it once through the new page is worth
more than the date on the calendar that Stage 9 was waiting for.

**And the editor kept its net.** `aab/studio.test.mjs` was 70
checks against the old page, and `app/studio.test.mjs` says in its
own header that it does not repeat them. Archiving the page those
70 checks were hosted on would have quietly deleted the only
coverage `aab/editor.js` has, and editor.js is the one part of
this site that cannot be checked by reading it. So the file was
repointed at `/studio/` instead: 68 checks pass there, and the two
that did not follow were chrome rather than editor, and are
already asserted in `app/studio.test.mjs`.

**The schools go in D1, and the document had said both.** Section
2 sent the curricula to Supabase, section 2b's table sent them to
D1, and Stage 8 step 1 said Supabase. Settled by the rule the
document already had: a lesson is read by people who have never
signed in, so it is D1, at the edge, beside the articles. Progress
stays in Supabase because it belongs to a person. The alternative
costs a round trip to Mumbai before a beginner's lesson page can
send its first byte.

**Two new stages, from two questions.** Stage 12 is the backend:
22 files and 1,842 lines under `functions/`, none of them typed,
each re-deriving its own idea of a request, running on a Pages
Functions context that `worker.js` rebuilds by hand for a thing
this site no longer deploys as. Stage 13 is the JavaScript itself,
with the rule that stops it wasting weeks: a module Stage 11 is
going to delete does not get converted, it gets rewritten as a
component when its route moves.

**The language bar, honestly.** It read 61% HTML and 33%
JavaScript. Most of that is output: 251 generated school pages and
two Vite bundles, all committed on purpose because this site
deploys without a build step. `.gitattributes` now marks them
generated, and the archive vendored, so the bar measures what
somebody wrote. That is labelling, not progress, and it is written
down as labelling. The progress is Stage 11 deleting the files.

**Connections, checked while there.** D1 answers and holds seven
live articles. Supabase is `ACTIVE_HEALTHY` in `ap-south-1` with
`profiles` and `progress`, RLS on both, two real profiles and
eight rows of progress, which means readers have actually signed
in and the writes are landing. R2 answers, and the live check now
fetches the share card it finds on the page rather than trusting
the tag. What is not fine is in the issues list as I12: two
Workers from 14 August that nothing here mentions, one of them a
stale copy of this site's own API.

### 2026-08-16 · The transition is a full one, and the HTML goes
Asked directly, and worth writing at the top of the plan rather
than in the log alone: this ends with no page of this site served
as a committed HTML file. Everything renders through Next.js and
React. Prose ends up in a database, structure ends up in a module
a route imports, and a file is deleted once what was in it is in
one of those two places, never before.

The document had been hedging. Stage 11 said "everything else, and
only if there is a reason", and its note on the schools said
rendering them through React "would cost a build step and buy
nothing". That was an honest read of the trade at the time and it
is not the decision, so it is gone rather than quietly left
standing next to a plan that contradicts it.

**Section 2b is not reversed, and the reason is worth keeping.**
It says a calculator and a case study stay in the repository with
their tests, and that still holds: a database cannot hold a
program, and 1,931 lines of tests pinning a dissertation's numbers
are the strongest argument in this repository for leaving
something alone. What that section never actually answered was who
*renders* the page, because while everything was a file the
question did not exist. It exists now, and the two answers are
different: every page is rendered by Next, only some of what is on
it lives in a database. `stock.model.js` stays a module and gets
imported by the route that draws it.

**The endpoint is countable.** 283 HTML files today: 251 generated
by the four school builders, 32 written by hand. Stage 11 is now
eight steps, ordered by what a mistake costs rather than by
appetite, and each one names the files it deletes. It also names
the three things that can go wrong across all of them: offline,
because `sw.js` precaches 68 files and a Worker-rendered page is
cached after it is first fetched rather than at install; weight,
because Stage 10 accepted 170 KB once and not once per stage; and
headers, because `aab/_headers` only applies to files and the day
the last file goes it covers nothing.

Two files in that count are already dead: `_redirects` sends
`/work.html` and `/services.html` to `/portfolio` before the asset
router is consulted, so nothing has been able to reach either of
them since that rule was written.

### 2026-08-16 · Stage 10 is on, and audited against the live site
The second Worker was deployed and the service binding added, both
by hand, and this is the first audit of the stage that asked the
site rather than the plan. `reiad-next` at 07:41 UTC, the front
Worker at 07:39 with `[[services]]` in `wrangler.toml`. The
deployed code was read back out of both to be sure the account is
running what this repository holds, and it is: `NEXT_ROUTES` and
`goesToNext()` in one, `IS_ASSET` and the `.html` strip in the
other.

**It works, and the part that could not be proved from here is
proved now.** `/insights/<slug>.html` comes back rendered by Next,
with the six security headers, the one minute cache line, the
canonical link, the drawn share card and the comment thread on it,
and one of its `/_next/static/chunks/*.js` comes back as
JavaScript rather than as this site's 404 page. That last one is
the wrapper in `next/worker-entry.js` doing its job, and it is the
thing the stage note said `wrangler dev` cannot show, because it
does not serve assets for an auxiliary worker. The way through was
to ask from somewhere that can reach the site: 25 checks in
`scripts/check-live.mjs`, run by `live-check.yml` on every push.
`dsex` still reaches its 301, an unknown slug is still a 404, the
kitchen is still the Worker's, and all seven pieces in the sitemap
answer 200.

**Then the audit found eight things, and the first one is a test
article on the public site.** `insights/test-react-article`,
titled "Test Article", body "It's a test", published at 04:40 that
morning while the React Studio was being driven, and `live`. Every
list that reads the database has it, and tomorrow's backup commit
would have written it into `content/articles.backup.json`. Nothing
in this repository could have caught it: the pages that count
themselves count what is there, and a real row that should not
exist is not a counting problem.

**And the repository is now wrong about the four file pieces.**
`dse-basics`, `onions` and `uk-visit-visa` all became rows on 15
August, so the only piece `fromNext()` catches today is `dsex`.
The fallback is still the right shape and stays; the long comment
in `worker.js`, the named list in the parity test and the prose
under **The three that would have broken on switch-on** all
describe a world that moved on under them. That is the same class
of mistake as the counts in `CLAUDE.md`: right on the day it was
written, and nothing rechecks it.

The rest, with what each is done when, is under **Still to do** in
the stage. Two are worth naming here: nothing in CI runs the
checks this repository leans on when it merges without asking, and
the second Worker also answers on its own `workers.dev` address,
which is a second public copy of every article. One is fixed
already: `CLAUDE.md` never mentioned `next/parity.test.mjs` at
all, and now names it, plus the new live check under a heading
that says after deploying rather than before.

### 2026-08-16 · Auditing Stage 10 against its own plan, line by line
Asked whether every item had really been done, and three had not.

**The allowlist was wider than the plan.** It said "exactly one
entry: /insights/<slug>" and it held the ARTICLE regex, which is
all three reading mounts. Every piece in the kitchen and on the
travel desk is a committed file, so those two mounts were a Worker
hop in front of pieces the database has never heard of. Narrowed
to the one the plan names.

**Lighthouse had never been run**, and it is half the acceptance
criterion. It moved: 74 to 64, blocking time 44 ms to 182 ms. The
table is under the stage. The first run said 87, better than the
Worker, because every one of Next's scripts was answering 404 and
none of them was being parsed. A performance score from a broken
page flatters it, which is worth remembering the next time a
number comes back better than expected.

**And the static twin clause was never met.** The plan wanted the
article route reading entirely from D1 with no file left before it
moved. Four files remain, and `fromNext()` works around that
rather than satisfying it. Written down here rather than quietly
treated as done: Stage 3 owns those files, and its own note says
they stay a fortnight.

Two more things came out of the audit, and both would have broken
the site the day the binding was added.

**Every article would have 404ed at its own address.** Every URL
on this site ends in `.html`, and the slug guard ran before the
suffix was stripped. The extensionless form worked, which is why
the parity test passed: it asked for the one shape the site never
produces. A test that asks for a URL nothing links to is not a
test of the URL.

**And every one of Next's own scripts would have 404ed.** They
live under `/_next/static/`, nothing in `aab/` matches, so the
asset router answered each with the 404 page. Forwarding that
prefix over the service binding does not fix it, because OpenNext's
worker never touches its ASSETS binding and a service binding
skips the asset router in front of a Worker.
`next/worker-entry.js` wraps the generated worker and serves those
paths itself.

The parity test is 49 checks now, up from 42.

### 2026-08-16 · The 170 KB was measured, and taken
Stage 10's plan forbade client JavaScript on a reading page. The
App Router ships 170 KB gzipped of runtime and router to every
page whatever the tree contains, and there is no switch. Measured
against the 31 KB the site's own scripts weigh, put up with three
ways out, and decided: accept it, because the site is going to
grow a lot and one framework is worth more than the kilobytes. The
alternative that reached zero rested the public half of the site
on an `unstable_` flag in a router the framework has stopped
investing in.

The cost is written down under the stage rather than smoothed
over, and the parity test holds it as a budget, so the number that
gets worse quietly is caught rather than discovered.

**And a bug that had not happened yet.** Filling the allowlist
meant `worker.js` forwarding the whole article prefix to a Worker
that has no ASSETS binding, so all it can answer for a piece it
does not have is 404. Four articles on this site are still
committed HTML: `dse-basics`, `dsex`, `onions`, `uk-visit-visa`.
They would have gone off the site the moment the service binding
was added, with every link to them, and nothing in the repository
would have said so. `fromNext()` treats a 404 from there as what
`context.next()` means here, and the parity test holds the Next
route to answering 404 both for an unknown slug and for a piece
asked for at the wrong mount.

The allowlist is filled now. `env.NEXT` does not exist yet, so
nothing is forwarded and the site is unchanged; the route turns on
by itself when the binding lands.

Next: the two dashboard steps in section 8, then Stage 11.

### 2026-08-16 · Stage 10 is built, and it found two live bugs
The Next.js route exists, renders an article from D1, and agrees
with the Worker's own renderer on every fact it states: 42 checks
in `next/parity.test.mjs`, driving the built Worker on workerd
against a local database. Nothing is switched on. `NEXT_ROUTES` in
`worker.js` is an empty array and the site behaves exactly as it
did.

**Two things were already broken, and both were found by the
discipline rather than by looking.**

Moving the per-section table out of `functions/insights/[slug].js`
should change nothing, so the first thing written was a diff of
the rendered page before and after. It came back with one line
different, and the line was the webfont URL: the constant in the
old file literally ended `&family=Noto+Seri[...]`. A malformed
`css2?` request gets a 400 for the whole stylesheet, so every
article published through the Studio has been rendering in the
fallback faces, both Bangla ones included. Nothing about the page
looks broken unless you know what it is meant to look like.

The second came from asking what headers a page from a second
Worker would carry. `aab/_headers` is read by Cloudflare's static
asset server, and a response a Worker builds is not a static
asset: every database-rendered article has been served with no
Content-Security-Policy, no HSTS and no `X-Frame-Options`, beside
file-based articles that had all three. `shared/headers.js` holds
the list now, both renderers attach it, and
`scripts/check-headers.mjs` fails when it and `_headers` drift.

**The thing the plan asked for that Next cannot give.** "Server
components only, no client JavaScript on a reading page" is not
available in the App Router: it ships a runtime and a router to
every page and there is no switch. The parity test measures it as
a budget rather than waving it through, and the three ways out are
written up against the stage. That decision is open, and it is why
nothing is switched on.

**And two things need a human**, both in the stage: the second
Worker has to be created, and the service binding added to
`wrangler.toml`. Neither can happen from here.

One note for whoever picks this up: `shared/` is a `file:` package
because a relative import out of `next/` does not work. Turbopack
refuses to resolve above its root; moving the root moves Next's
file-tracing root with it, and the OpenNext build then fails on a
missing `pages-manifest.json`, which reads exactly like a Next 16
incompatibility and is nothing of the sort. `install-links=true`
in `next/.npmrc` is the other half: npm's default is a symlink and
Turbopack resolves symlinks to their real path before refusing
them.

Next: the decision above, then the two dashboard steps.

### 2026-08-16 · The Studio, in React, and the editor became a module
The hard half of Stage 9. `aab/studio.js` was 2,464 lines: a
contenteditable with a sanitiser, a slash menu, markdown rules and
a figure toolbar, plus the fields, the preview, the meters, the
pre-flight panel, the sheets, the drafts and the publish.

**The decision that made it tractable was not a React one.** Those
two halves are different kinds of thing. The second is a function
of state and is exactly what a component tree is for. The first is
a piece of the DOM that the browser and the writer are both
editing behind React's back, and rendering it from state means
replacing the node the caret is sitting in on every keystroke.

So the writing surface came out first, into `aab/editor.js`, and
both Studios import it. That is a refactor of a working file with
five known bugs written into its comments, which is the sort of
thing that goes wrong quietly, so it went in as its own commit
with `aab/studio.test.mjs` green at all 70 checks and the publish
test driving a real photo to R2 under the real CSP. The seam is
the root element: `studio.js` reached for `#editor` at module
scope, so importing any part of it imported a page.

What React owns now: the fields, the segmented section picker, the
topic chips, the three previews, the weight meter, pre-flight, the
Open and Notion sheets, the drafts in IndexedDB and the publish.
What it does not own: one `<div contenteditable>`, rendered once,
empty, and handed to `createEditor()`.

**One thing is better rather than the same.** The old file
recomputed `meta()` at eleven call sites and had to remember to;
here it is a `useMemo` of the fields, the topics and a counter
that says the body moved, and the preview, the meters, the
pre-flight panel and the publish payload are all functions of it.
The counter is the only unusual thing in the file and it is the
honest way to say "something React does not own has changed".

`app/studio.test.mjs`, 86 checks, in two passes: without a
database, where the Studio has always run as a local editor and
says so, and with one, where publishing, the desk count, the
Notion button and the slug-collision block appear. It caught three
things: the topic box keeps what was typed when a topic is refused
(deliberate, and it means Backspace is editing text rather than
reaching the chips), a fixture keyed on the path alone answered
`articles` for `articles?all=1` and made four real features look
missing, and Vite resolves a relative `outDir` against the project
root, which put the Studio's build inside `app/`.

Next: Stage 10, which is the first public route, and the first
place any of this can be seen by a reader.

### 2026-08-16 · The React desk is finished, and it was shipped half-done
Six panels, at parity with `desk.js` and past it in four places.
The entry below this one called the desk "up at /desk/" after
three panels. It was up. It was not a desk.

**What was actually wrong.** The three panels that existed were
drawn with `admin-line`, the compact row class the article list
uses, rather than `admin-row` with its `admin-meta` header, its
`admin-q` serif body and its `btn btn-solid` actions. Questions had
lost the search box, the per-status counts, the "new" pill and
three of its five actions. There were no tiles, no tab badges, and
half the panels were missing outright. Every one of those is a
class name or a control that already existed in `styles.css` and
in `desk.js`, so none of it was hard. It was skipped, and then
described as a stage in progress rather than as a page that had
been made worse.

The lesson is not "port more carefully". It is that a port is the
one kind of change where **"it renders" and "it is finished" look
identical from the outside**, and the only way to tell them apart
is a list of what the old thing did.

**So there is one now.** `app/desk.test.mjs`, 75 checks, driving
the built page in a real browser against fixtures, with the API
routed rather than mocked. Every check is a feature `desk.js` had:
the mailto on an asker's address, the anonymous asker named as one,
"Everything" reaching an archived question, the filters carrying
their counts, the tiles that go gold only when somebody is waiting,
the CSV link, the sparkline, the file pieces listed beside the
rows, the warning pill on a piece with no share card, the History
dialog opening as a modal. It caught three real bugs while being
written, one of them mine and two of them design:

- opening a second More panel closed both, because closing the
  first fires its own toggle event a moment later and a naive
  handler answers that by clearing the slug just set,
- an open More panel had no way to close except finding its
  summary again, so Escape and a click outside now close it,
- and the fixture for a drawn share card was the wrong shape,
  which the panel correctly flagged. A card is
  `/media/<slug>-card/<hash>.jpg`; anything else is a photo.

**Four things it now does that the old desk did not.** Most read
names a path instead of printing it, by asking `searchIndex()`
first and the database second, so a tool or a lesson at the top of
the table reads as a title rather than as a server log. Comments
are searchable. Enquiries say how many are behind every filter,
not just the one you are looking at. And switching tabs unmounts
the panel you left, so a half-written answer cannot reappear
inside somebody's private note.

**Nothing new was styled.** Every class rendered here already
existed. That was the constraint at the top of this stage and it
held: the diff to `styles.css` is empty.

Next: the Studio, which is the part of this stage that is actually
hard, and which now has a worked example of what "finished" has to
mean before it starts.

### 2026-08-15 · Stage 9 begun: React is on the site, at /desk/
The first React in this repository, on the page where a mistake
costs least: private, `noindex`, no reader, no share card.

The decision that took the longest was not React. It was that this
site has **no build step at all** and no `package.json`, deploys by
uploading `aab/`, and has its build command in a Cloudflare
dashboard that cannot be seen or changed from the repository. So a
bundler that must run in CI would have meant asking for a
configuration change nobody could verify from here.

Committing the output solves it and is not a compromise: every
school on this site is already generated and committed, and
CLAUDE.md's rule for them is exactly the rule for this one. It also
keeps the whole stage one `git revert` from gone.

Proved rather than assumed: the built page runs under the real CSP
with **no violations and no page errors**, the site's own
`styles.css` applies to it unchanged, and it looks like the rest of
the site because it renders the same class names. `/app.js`,
`/api.js` and `/auth.js` are left external and imported at runtime,
so the desk shares one copy of the site's furniture rather than
carrying a second.

The auth gate was deliberately **not** ported. It is the thing
keeping this page private, it already works, and Stage 9 is a UI
port. React mounts after `requireOwner()` resolves.

`check-csp.mjs` needed a change and it is the interesting kind: it
found `https://react.dev` inside the bundle, which React puts in
its error messages and never fetches. Skipping the bundle would
have lost the guarantee, so it walks `app/src` instead. The check
now reads the source a fetch would be written in rather than the
library it ends up beside.

Next: the Studio, which is the part of this stage that is actually
hard.

### 2026-08-15 · Stage 7 done, and the piece that was not in the plan
Comments. Signed in to write, nothing visible until approved,
one level of replies, moderated from the desk beside the questions
queue it grew from.

The plan described the queue and the UI and said nothing about the
part that turned out to be the foundation: **the server has to
prove who the reader is.** The browser sends a Supabase access
token, and a JWT's payload is readable by anyone who can read a
URL, so an endpoint that trusts `sub` without checking the
signature is an endpoint where anybody posts as anybody by typing
a different id into a string. There is no partial version of that.

`functions/_lib/reader.js` verifies against the project's
published keys. The interesting part is what it refuses: `alg:
none`, a signature from the wrong key, a payload swapped under a
good signature, an expired token, one from another issuer, an
unknown key id (refused rather than tried against every key), and
an HS256 token when no secret is configured. The algorithm comes
from the KEY, never from the token's own header, which is the
other half of that family of attacks. Twenty-one checks, real
WebCrypto throughout, because a stubbed signature check tests
nothing.

Two design notes worth keeping:

**The comment lives in D1, not Supabase**, even though it belongs
to a person, because a signed-out stranger has to be able to read
the thread with Supabase unreachable. `author_name` is copied into
the row at the time of writing so the page never needs to join
across the seam. That is section 1's rule working exactly as
written.

**A comment is text and never HTML.** Stored as text, returned as
text, drawn with `textContent` on both the article page and the
desk. Every injection bug this site has had came from parsing
something, and this parses nothing, so there is no sanitiser here
to get wrong later.

Next: Stage 8, the schools' content into the database, which
section 2b argues is real but low-priority.

### 2026-08-15 · Stage 4 done, and a test suite that had stopped testing
The Studio no longer offers to publish as files. `buildPage()`, the
ZIP writer, `indexEntry()` and `externalisePhotos()` are gone, and
309 lines of `studio.js` with them. The second renderer for an
article, which had drifted from the server's twice, no longer
exists.

The stage as written pulled against itself: keep the export tools
as a no-database fallback and you keep `buildPage()`, which is the
thing the stage exists to delete. It resolves once you notice the
fallback was already built twice by other stages. Drafts live in
IndexedDB, so nothing is lost when the database is unreachable, and
Stage 2 commits every live body to git nightly with a tested
restore path, which is a much better answer to "get my writing out"
than a button that rebuilds one page. **Stage 2 is what made Stage
4 safe.**

**And the bigger find: `aab/studio.test.mjs` had been failing for
weeks and nobody knew.** Sixty-seven checks that never ran to the
end. Three separate stale selectors, each left behind by an earlier
change: `#f-tag` became `#f-topics` when multi-tagging landed, the
pre-flight warning stopped saying "label" at the same time, and the
photo toolbar's chip was shortened from "Alt text" to "Alt" in the
redesign. Every one of them a test asserting against a UI that had
moved on.

That is almost certainly part of why the photo bug survived: the
suite that would have exercised a publish was dying two hundred
lines earlier. It runs again, at 70 checks, and it now asserts the
absence of everything Stage 4 removed.

Worth keeping as a rule: a test suite nobody runs is not neutral,
it is a false sense of cover. All three browser suites take
`CHROMIUM_PATH` now, so they run anywhere.

Next: Stage 7, comments.

### 2026-08-15 · Three reader-reported bugs, and what is NOT moving
Three things were reported and none of them was found by reading
code. All three are recorded here because each is a class of bug
this project will meet again.

**Photos never reached R2, and one CSP token was why.** Reading a
pasted photo back out of the editor was `fetch()` on a `data:` URL,
which is governed by `connect-src`, not by `img-src`. The policy
allowed `data:` under `img-src`, so photos displayed perfectly, and
every upload was refused before it left the browser. The failure was
caught, counted and swallowed by the designed fallback, so the
symptoms appeared three removes away: an empty bucket, an empty
`cover` on every article, and every shared link showing the site's
default card.

It reproduces only under the real policy, and a local
`python -m http.server` sends none, which is why it survived every
test. `aab/studio-publish.test.mjs` now serves `aab/` with the CSP
read out of `_headers` and drives a real publish through a real
browser. This is the second CSP bug on this site in a week; both
were silent, both were a missing token, and both cost more to find
than to fix.

**Resetting progress did nothing while signed in.** Every school's
`resetAll()` removes its key rather than emptying it, and the guard
in `reconcile()` only recognised `[]`. So `undefined` fell through
to the union and the account's copy came straight back.

**Signing in took whatever the browser happened to hold.** The first
sync between a device and an account was a merge, like every sync
after it. That is right for two of your own devices and wrong for a
borrowed phone or a new account, and it could not be undone. It
asks now, once, and only when both sides hold something.

Writing that fix produced two more bugs of the same shape, both
caught by the test before shipping: "use my account's" cleared the
device and then cleared the *account* to match it, because an empty
key with a fresh clock entry is exactly how a deliberate reset
looks; and once that was fixed it did it again, because announcing
the change ran the schools' own listeners, which call `touch()`,
which rewrote the clock entries the fix had just deleted.

**And section 2b is new**, because the question "do the lessons and
tools need porting too?" had no answer in this document. The short
version: articles yes, curricula eventually, and the calculators and
case studies **never**. They are code with 1,931 lines of tests
pinning their numbers, and a database can hold the numbers a program
uses but not the program.

Next: Stage 7, comments.

### 2026-08-15 · Stage 3 surveyed, and it is one piece
Nobody could say where the site's writing actually lived. Not from
this file, not from `content.js`, and not from the desk: finding
out meant fetching five URLs by hand and comparing them to a
directory listing, which is how a stage gets called done from a
feeling.

`scripts/check-pieces.mjs` answers it. Offline it is a gate: every
`.html` in a section directory has to be listed in `content.js`,
redirected in `_redirects`, or the template, because a file that is
none of those is reachable only by typing its URL and updated
never. That is the failure in CLAUDE.md about lists coming from the
data, and it has happened here twice. With `--live` it adds the
database half and prints what is left.

The answer: five pieces in the database, two of them also still
files, one piece file-only (`dse-basics`), and one thing that
looked like a piece and is not. `insights/dsex.html` is a 1.6KB
stub left behind when that term moved to `/learn/terms/dsex`;
`_redirects` has sent both its URLs there for months. The check
knows the difference, so it does not flag it and nobody has to
remember why it is there.

So Stage 3 is one click, and it is a click I cannot make:
publishing writes to the database and needs the admin session.
What I could do was make the click findable. The desk's action on
a committed file said "Edit", which is true and useless: pressing
it on the last file-only piece on the site finishes a migration,
and nothing said so. It says **Import** now, in gold, and the
count line above the list says how many are left to import rather
than only how many exist.

The two shadowed files (`cooking/onions.html`,
`travel/uk-visit-visa.html`) stay where they are. Rule 4 of this
document says the fallback stays until the new path has been live
a fortnight, and the check lists them so that fortnight does not
have to be remembered.

Next: the click, then Stage 4.

### 2026-08-15 · Stage 2 done, and the plan had a hole in it
The database has a backup that is not the database.

The hole: this stage was planned as "a nightly Routine writes every
row into the repository", and **the repository is public**. Written
as planned, the first run would have committed drafts, readers'
names and email addresses, subscriber tokens and the admin password
hash into a public git history, where deleting a file does not
delete it. Nothing had shipped, so nothing leaked, but the plan
said to do it.

So the backup is split by who can read it rather than by what is
convenient. `content/articles.backup.json` gets live articles and
only the columns already served at a public URL. Everything else
goes to R2. The reasoning is at the top of
`functions/_lib/backup.js`, at length, because the next person to
add a table to that list will read that file and not this one.

Two smaller decisions worth keeping:

The public endpoint needs no credential, which is what makes the
whole thing need no human setup: GitHub Actions issues its own
token, and `GET /api/backup/articles` returns what a crawler could
already read. The `WHERE status = 'live'` clause is the only thing
standing between that and a leak, and it is tested by name.

The restore script writes SQL to stdout and stops. It holds no
credential and cannot delete anything by itself. Running it is a
separate, visible step, and the default is upsert, so a restore
over a live database cannot lose a row written since the backup
unless you ask for `--replace`, which says what it is about to do
first.

Two bugs found before they shipped. `*/15` inside a block comment
closes the comment, so the first draft of `worker.js` did not
parse. And the two cron strings live in two files with nothing
making them agree, which fails silently by simply never running the
job, so `scripts/check-crons.mjs` now fails the build on drift; it
was tested by breaking it.

Next: Stage 3, the file pieces move into the database.

### 2026-08-15 · An account can be set up, and the home page listens to it
Three things landed together, and they are one thing really: an
account that knows nothing about the person holding it can only
hold their progress, and holding progress was already done.

`/account.html` now asks three questions, once, the first time
somebody lands on it after signing in. A name, which courses they
are here for, and how often they mean to practise. It is the same
form afterwards, relabelled as settings, because two forms would
have been two save handlers and two places for the wording of a
course name to drift.

Every answer arrives filled in from what the device already knows:
a reader who has read three English parts finds English ticked and
told, in words, that it is ticked because they have already started
it. The setup card is there to confirm what the site knows and to
catch the one thing it cannot know, which is what they are about to
start.

Each question had to earn its place, and the rule was that it must
change something the reader can point at afterwards:

- the name appears beside anything they write,
- the courses are offered first by the home page's band, and a
  followed course with nothing read yet is offered as a way in,
- the pace is what the last seven days are counted against.

There is no birthday, no country and no "how did you hear about
us", because nothing on this site would do anything with them.

`aab/streak.js` is new and small: the four courses record WHAT has
been read and none of them records WHEN, and "how am I doing" turns
out to be a question about days. It keeps one list of dates, adds
today when any course announces progress, and rides the same sync
as everything else as a union, so a phone and a laptop give the
true set of days rather than whichever synced last. There is no
flame and no "don't lose your streak": this site has no
notifications and is not getting any.

`COURSES` in `content.js` is the fourth list of the same four ids
collapsed into one. It had been written out by hand in the home
page's band, in `sync.js`, in the account page's counts and in the
setup options.

The profile is remembered on the device, in `reiad-profile`, and
that is not an optimisation. The home page's band is the first
thing on the page, and a page that decides its own running order a
second after it loads is worse than one that guessed. So the
remembered copy answers immediately and Postgres corrects it.

Two things the browser test caught that reading would not have. A
course followed but not bookmarked was being offered as "start"
even when the device had read a third of it, because a bookmark and
a read-set are two different keys and they come apart; the word on
the button is decided by the course's own progress now. And the
page said "1 parts read".

Next: Stage 7, comments. Stages 2 to 4 are still not started and
are still the right things to leave: they move where the writing
lives, and nothing a reader does depends on that yet.

### 2026-08-15 · Stage 6 done, and the account has a page
Progress follows the account now. `aab/sync.js` carries the twelve
localStorage keys the four schools already write, merging rather
than overwriting: sets union, bookmarks take the newer timestamp,
day counters take the higher number. Nothing about the four
progress modules changed, because each one already announces its
own changes and each already stores its state under a known key.

`/account.html` is the page Stage 5 was missing: the display name,
what the account keeps counted rather than described, sign out, and
"forget my progress" which empties the account and leaves the
device alone.

Verified against two devices holding different progress: the union
was correct, the higher day won, the newer bookmark won, and only
the keys that actually differed were pushed.

One mistake worth recording, because it nearly shipped: an edit to
`account.js` was applied with a `str.replace` whose anchor no
longer matched, so it silently did nothing and the account page
imported a function that did not exist. The browser test caught it
in seconds. Every scripted edit in this repository asserts that its
anchor matched exactly once; that one did not, and that is the only
reason it got as far as it did.

Next: the home page, which still opens with who I am rather than
with what a returning reader was doing.

### 2026-08-15 · Stage 5 fixed on first contact with a real reader
The first live sign-in worked and looked like it had failed. The
Supabase logs told the story exactly: `/callback` at 13:29:49, then
`/user` at 13:30:20 returning 200. Thirty-one seconds of a header
saying "Sign in" to somebody who was already signed in. Written up
as I10; the short version is that identity now comes out of the
token rather than out of a round trip, and the sign-in import no
longer queues behind the service worker precaching the site.

Also confirmed that day: the Supabase GitHub integration does apply
migrations on merge. The `profiles` table and its trigger were
there, and the first Google account got its profile row without
anybody running anything by hand. The "Supabase Preview" check
reporting "skipped" on the pull request is about preview branches,
which are off, and is not a sign that migrations were not applied.

### 2026-08-15 · Stage 5 done, readers can sign in
`aab/account.js` talks to Supabase Auth over plain fetch, with no
client library, and `aab/signin.js` puts one button in the header
that says "Sign in" until somebody does and shows their initial
after. The migration in `supabase/migrations/` creates `profiles`
with row-level security on from the first line and a trigger that
gives every new reader a profile row, so the first thing a new
account meets is not a comment box that cannot say who they are.

Nothing else changed. No page requires an account, no reading page
loads a byte more than it did unless the reader clicks the button,
and `signin.js` is imported lazily and its failure is caught, so a
Supabase outage is a header without a button.

Verified in a browser against a stubbed Supabase: signed out the
button says "Sign in"; the magic link posts to `/auth/v1/otp` with
the right `redirect_to`; the Google round trip lands back with
tokens in the fragment, stores the session, cleans the address bar
and turns the button into an initial; it survives a reload; signing
out clears the device.

**What is not proved yet, and how it will fail if it is wrong.**
The live sign-in. Two things are worth knowing before trying it:
if Google says "Access blocked: this app is not verified", the
OAuth consent screen was never published, and publishing it fixes
it without any review from Google for plain email and profile
scopes. If the magic link arrives and lands on `localhost`, the
site URL in Supabase did not save.

Next: Stage 6, progress that follows the account, which is the
first thing an account is actually for.

### 2026-08-15 · Stage 1 done, and the plan grew from two moves to four
Reader accounts, progress that follows a person, moderated comments
and the schools' content in a database were added to the scope, so
this file now plans four moves rather than two. The decisions taken
that day are in section 7: Supabase for people and D1 for writing,
magic link and Google to sign in, and every comment approved before
anyone sees it.

Stage 1 landed the same day. `aab/pieces.js` answers "what has been
written" once, from both stores, and `app.js`, `reads.js`,
`functions/api/search.js` and the two card hosts all ask it. I1 to
I4 are fixed and were verified in a browser against a database row
that exists in no file: it appears on the kitchen hub, in the count
above it, in the menu and in the palette, each time at
`/cooking/<slug>.html`, and it does not appear on the Insights
index.

One thing worth remembering: the first attempt put the menu's
redraw in `initMenu()` while the function that draws a menu entry
lives in `buildMenu()`, so it threw twice per page load and left
the menu on the manifest. The browser test caught it, which is the
argument for having written the test before the commit.

Next: Stage 5, accounts. Stages 2 to 4 move the writing itself and
can wait; accounts unblock progress and comments, which is what was
actually asked for. Two things are needed from a human before it
can land, both in section 9.

### 2026-08-15 · Stage 0 done
Wrote this file. Established that articles currently live in both
places, that the URL resolves correctly either way, and that four
of the nine things which point at an article still read only
`content.js`. Recorded nine issues, four of which (I1 to I4) are
live bugs waiting for a piece to be published into a Bangla section
through the Studio. Nothing in the site changed.

Next: Stage 1, and specifically `aab/pieces.js`, because every other
stage is easier once one function answers the question "what pieces
does this site have".
