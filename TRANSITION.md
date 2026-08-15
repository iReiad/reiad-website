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

**Move D: the site is rendered by React, on Next.js.** Component by
component, route by route, with the current Worker still serving
everything that has not moved.

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
sessions, progress, comments, and later the curricula. It is
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
**Status: not started.** Size: one sitting.

Today the repository is the backup: every article is a file in git,
with history. The moment D1 is the source of truth, that stops being
true, and `article_versions` does not count, because it lives in the
same database.

- A Routine, nightly, that reads every row and writes
  `content/articles.backup.json` into the repository through the
  GitHub API. Bodies included. It is a machine-written file and
  nobody edits it.
- A restore path, written down and tested once: a script that reads
  that file back into D1.

**Done when:** the backup file exists, is under a megabyte, and a
restore into a scratch database has been run once and produced the
same rows. **Rollback:** delete the Routine.

---

### Stage 3 · The file pieces move into the database
**Status: not started.** Size: one sitting, plus two weeks of
watching.

The Studio can already read a committed page back into the editor
(`?file=<section>:<slug>`), which is exactly the importer this
needs.

- Open each live piece in the Studio and publish it.
  The row takes over the URL the moment it saves.
- Check each URL, its share card, its hub card, its feed entry and
  its sitemap line.
- Leave the files in place. They are now dead code that happens to
  be a fallback.
- Two weeks later, delete the files and their `content.js` entries
  in one commit, and drop the article lists from `content.js`
  entirely if Stage 1 has made them unused.

**Done when:** `SELECT COUNT(*) FROM articles WHERE status='live'`
matches what the hubs show, and `aab/insights/`, `aab/cooking/` and
`aab/travel/` hold only their `index.html` and the template.
**Rollback:** unpublish the row and the file answers again, with no
deploy.

---

### Stage 4 · The Studio stops offering to write files
**Status: not started.** Size: one sitting.

Once Stage 3 is done, "Download the page", "Download .zip" and "Get
the index entry" describe a workflow that no longer exists. They
are also the last thing keeping the page builder in `studio.js`,
which is a second renderer for articles and has drifted from the
server's twice already.

- Fold the file tools away behind a "there is no database" branch,
  where they belong: the Studio should still work as an export tool
  if D1 is ever unavailable.
- Delete `buildPage()` from `studio.js` once nothing calls it, and
  with it one of the two places that decide what an article page
  looks like.

**Done when:** publishing is the only path a signed-in writer sees,
and the renderer in `functions/insights/[slug].js` is the only place
that builds an article page.

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
**Status: not started.** Size: two sittings.

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

---

### Stage 7 · Comments, moderated, grown from Questions
**Status: not started.** Size: three or four sittings.

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

**Done when:** a signed-in reader can comment, it appears for
nobody until approved from the desk, and the existing questions are
still there. **Rollback:** stop accepting new comments; the old
queue is untouched.

---

### Stage 8 · The schools' content into the database
**Status: not started.** Size: weeks. The largest thing on this
list.

Four curricula in JavaScript files, 246 pages generated from them,
and a builder each. The goal is that a lesson can be corrected
without a rebuild, and that the Studio can edit one.

Done in this order, because each step is safe on its own:

1. Tables in Supabase that hold what a `curriculum.js` holds:
   course, unit, lesson, and the blocks inside a lesson.
2. An importer that reads the existing files and writes the rows.
   Run it, compare the output, change nothing else. The files stay
   the source of truth while the tables are checked against them.
3. The builders read from the database instead of the files, and
   the generated pages come out byte-identical. That is the test.
4. Only then, the files are retired and the Studio grows a lesson
   editor.

**Why it is not first, whatever anyone would prefer.** Those pages
work today and no reader is waiting on this. A migration with no
user-visible payoff should be the one that runs when everything
else is calm. **Done when:** a lesson edited in the database
appears on its page after a rebuild, and every other page is
byte-identical to what the files produced.

---

### Stage 9 · React, where nobody can see it
**Status: not started.** Size: a week, spread out.

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

**Done when:** a piece can be written, given photos, previewed,
pre-flighted and published from the React Studio, and the old files
are gone. **Rollback:** the old page is one revert away for as long
as it exists.

---

### Stage 10 · Next.js takes one public route
**Status: not started.** Size: a week.

Only after Stage 9 has proved the toolchain on something private.

- Next.js App Router, deployed to Cloudflare Workers through
  `@opennextjs/cloudflare`, in the same repository, behind the same
  domain.
- The current Worker stays in front and keeps every path except an
  allowlist. The allowlist starts with exactly one entry:
  `/insights/<slug>`, the article route, which by then reads
  entirely from D1 and has no static twin left.
- Server components only, no client JavaScript on a reading page,
  because that is the current bar and dropping below it is not
  acceptable.
- `styles.css` is imported whole. It stays one file.

**Done when:** an article renders through Next.js, its share card,
its structured data and its canonical link are byte-identical to
what the Worker produced, and Lighthouse has not moved.
**Rollback:** remove the path from the allowlist. One line.

---

### Stage 11 · The rest, one route at a time
**Status: not started.** Size: months, at whatever pace suits.

In rough order of how much they would gain, and how little they
would hurt if a step went wrong:

1. `/cooking/`, `/travel/` and `/insights.html`, the three hubs,
   which are lists of the same shape and would become one component.
2. `/portfolio.html` and the case studies, which are the most
   component-shaped pages on the site.
3. The home page.
4. Everything else, and only if there is a reason.

**The schools come last, and only as far as Stage 8 took them.**
The 246 generated pages are compiled once, served as files,
precached for offline and hold no state. Rendering them through
React would cost a build step and buy nothing. Once their content
is in Supabase (Stage 8) the pages can stay generated, and probably
should.

---

## 5. Status board

| Stage | What | Status |
| --- | --- | --- |
| 0 | Inventory and this document | done, Aug 2026 |
| 1 | Every list reads the database | done, 15 Aug 2026 |
| 2 | Backup out of the database | not started |
| 3 | The file pieces move in | not started |
| 4 | The Studio stops writing files | not started |
| 5 | Accounts, and nothing else changes | done, 15 Aug 2026 |
| 6 | Progress follows the account | not started |
| 7 | Comments, moderated, grown from Questions | not started |
| 8 | The schools' content into the database | not started |
| 9 | React in the Studio and the desk | not started |
| 10 | Next.js takes the article route | not started |
| 11 | The rest, one route at a time | not started |

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
