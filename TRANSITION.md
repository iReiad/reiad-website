# Where the writing lives, and where it is going

A working document, not a proposal. It answers one question that
came up in August 2026 (do articles go to the database, or to
GitHub?), sets out two moves that follow from the answer, and then
keeps score.

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
| `/cooking/` and `/travel/` hubs | **no** | yes, only |
| `COUNTS`, so every `data-count` slot | **no** | yes, only |
| The home page rotation | **no** | yes, only |
| The menu | **no** | yes, only |

So a piece published through the Studio into the kitchen today is
readable at its URL, in the sitemap and in search, and invisible on
the kitchen's own index, which is the one page a reader would use to
find it. Three of the four merges also hardcode `/insights/<slug>.html`
as the link, which is wrong for a piece in either Bangla section.

This is not a bug that crept in. It is what a half-finished
migration looks like from the inside, and it is the reason for
Stage 1 below.

---

## 2. What we are aiming at

Two moves. They are independent, and the order matters.

**Move A: the database becomes the only home for a piece.** One
article, one row, one place to change it. `content.js` stops being a
list of articles and goes back to being what it is good at: the
site's structure, the schools, the tools, the case studies.

**Move B: the site is rendered by React, on Next.js.** Component by
component, route by route, with the current Worker still serving
everything that has not moved.

**A comes first, and not for tidiness.** A Next.js page needs its
content from somewhere. If the content is already an API by then,
the framework change is only a change of renderer, which is a small
and reversible thing. If it is not, the two migrations become one
migration, and that is the kind that runs for a year and gets
abandoned halfway with the site in two pieces.

**One honest note before the plan.** The site is currently fast
because it has almost no JavaScript on a reading page and no build
step for its core. Next.js will not make it faster; at best it stays
level. What it buys is a component model, real routing, and a way of
working that other people already know. That is a real reason, but
it is worth writing down that this is a maintainability trade and
not a performance one, so nobody re-litigates it later on the wrong
grounds. The staging below is built so that every stage is useful on
its own and the whole thing can be stopped at the end of any of them
without leaving a mess.

---

## 3. Rules for every stage

1. **No URL ever breaks.** Not one. `check-routes.mjs` runs before
   every merge, and anything that moves gets a redirect.
2. **Every stage ships green.** All four checks pass, the em dash
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
**Status: not started.** Size: two or three sittings.

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

### Stage 5 · React, where nobody can see it
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

### Stage 6 · Next.js takes one public route
**Status: not started.** Size: a week.

Only after Stage 5 has proved the toolchain on something private.

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

### Stage 7 · The rest, one route at a time
**Status: not started.** Size: months, at whatever pace suits.

In rough order of how much they would gain, and how little they
would hurt if a step went wrong:

1. `/cooking/`, `/travel/` and `/insights.html`, the three hubs,
   which are lists of the same shape and would become one component.
2. `/portfolio.html` and the case studies, which are the most
   component-shaped pages on the site.
3. The home page.
4. Everything else, and only if there is a reason.

**What is not moving, on purpose.** The three schools, 246 pages
generated from `curriculum.js` files by their own builders. They are
compiled once, served as files, precached for offline, and contain
no state. Rendering them through React would cost a build step and
buy nothing. If they ever move it will be because the curriculum
data moved into the database, which is not on this plan.

---

## 5. Status board

| Stage | What | Status |
| --- | --- | --- |
| 0 | Inventory and this document | done, Aug 2026 |
| 1 | Every list reads the database | not started |
| 2 | Backup out of the database | not started |
| 3 | The file pieces move in | not started |
| 4 | The Studio stops writing files | not started |
| 5 | React in the Studio and the desk | not started |
| 6 | Next.js takes the article route | not started |
| 7 | The rest, one route at a time | not started |

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

**I2. The two Bangla hubs cannot see the database at all.**
`reads.js` builds its cards from `section.pieces()`, which is
`content.js` and nothing else. A piece published through the Studio
into the kitchen is invisible on `/cooking/`. Fixed by Stage 1.

**I3. `COUNTS` counts the manifest, not the site.** `COUNTS.cooking`
and `COUNTS.travel` count `content.js` entries, so the moment a
piece exists only in D1 the hub says one number and shows another.
This breaks the counting rule in CLAUDE.md, which exists precisely
because that went wrong twice before. Fixed by Stage 1.

**I4. `/insights.html` merges every live row, whatever its
section.** `getArticles()` returns all of them and the card list
does not filter, so a kitchen piece would appear on the Insights
index. Fixed by Stage 1.

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

**Not a big-bang rewrite in a branch.** The one thing that reliably
kills a migration like this is a long-lived branch that has to be
merged all at once. Every stage here ships to production on its own.

---

## 8. Log

Append only. Newest first. One entry per landed stage or per
decision worth remembering.

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
