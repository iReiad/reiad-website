# reiad.co.uk, house rules

## Punctuation: no em dashes. Ever.

**Never use the em dash, U+2014, anywhere on this site.** It is not written
out anywhere in this repo on purpose: the check below greps for it, and a
rule that contains the character it bans always matches itself. Not in page copy,
not in headings, not in meta descriptions, not in Bangla, not in strings a
script writes into the DOM, not in commit messages or PR bodies.

This is not a preference about one character. A sentence that needs an em
dash is usually a sentence holding two ideas that have not been separated
properly, and the mark is doing the work that punctuation or a full stop
should be doing. Take the extra second and write it out.

What to use instead, in the order worth trying:

| The dash was doing this | Use |
| --- | --- |
| Introducing an explanation, a list, or a definition | a colon |
| Joining two clauses that could stand alone | a full stop, or a semicolon |
| Wrapping an aside mid-sentence | a pair of commas |
| Wrapping an aside that really is parenthetical | brackets |
| Tacking on an afterthought | a comma, or cut the afterthought |
| Nothing in particular (a pause for effect) | delete it and reflow the sentence |

Two dashes wrapping an aside become two commas or one pair of brackets,
never one comma and one bracket.

En dashes (U+2013) in number ranges are fine and are not affected by any of
this: `2024–26`, `৳50–100`.

The same rule applies to code comments in new work. The comments in this
repo are long and explanatory on purpose, and they read better without the
dash too.

Quick check before committing:

```sh
grep -rn $'\u2014' aab/ functions/
```

## Language

Bangla is the site's learning language, English the working one. Bangla
copy is written for a reader who should never have to read English to find
out that something exists in their own language. Keep it plain: short
sentences, everyday words, no transliterated jargon where a Bangla word
exists.

## Numbers and lists come from the data, never from a sentence

**If a page says how many of something there are, it must count them.**
Not remember them. `COUNTS` in `aab/content.js` derives every such number
from the data the site already holds, and `app.js` fills any element
carrying `data-count`:

```html
<span data-count="stages">৮</span>টা ধাপ
<span data-count="caseStudies">7</span> case studies
```

Bangla digits are used automatically inside a `[lang="bn"]` element. The
number left in the markup is the no-JavaScript fallback, so keep it
roughly right; `check-content.mjs` fails the build if it drifts.

The same rule covers lists. A list of things that exist elsewhere on the
site (case studies, articles, tools) is built from `content.js` by
`home.js` or `app.js`, and the markup in the page is a fallback, not the
source. Adding a case study should require editing `content.js` and
nothing else.

This exists because it went wrong, twice in one file. The portfolio page
listed four case studies while seven existed, and three finished pieces of
work were reachable only by typing the URL. The home page listed three of
the seven under a line naming two of the four it left out. The stock check
was described as "thirty-eight ratios" on one page, "thirty-odd" on four
others and "more than thirty-six" in Bangla, for a model that scores
forty-four. Nobody typed a wrong number. Each was right on the day it was
written, and then the thing it counted grew.

Two counts (`ratios`, `pillars`) are typed into `COUNTS` because they
belong to `tools/stock.model.js`, which `content.js` deliberately does not
import. They are asserted against that model by the check below.

A sentence that genuinely cannot hold a slot (a `<meta>` description, a
blurb inside `content.js`) goes in the `CLAIMS` table in
`check-content.mjs`, so the next data change fails a check rather than a
reader.

## The blocks an article is made of

A piece can hold a box of quick answers, a note in the margin, numbered
steps, a checklist, a row of key figures, a note, a worked example and a
scrolling table. Each one is plain HTML with a class on it, and that class
has to be in three places or it does not survive the trip:

1. a rule in `@layer article` in `aab/styles.css`,
2. `KEEP_CLASSES` in `aab/editor.js`, the browser's sanitiser,
3. `ALLOWED_CLASSES` in `functions/_lib/sanitise.js`, the server's.

`check-css.mjs` fails if the two allowlists disagree, if a class is allowed
into an article and styled nowhere, or if two cascade layers both define
one. The last of those is not hypothetical twice over: `.glance` was
already the About page's, `.steps` already the Learn hub's, and a later
layer wins on every page, not only its own.

The same three-place rule covers the photo classes: `wide`, `full`,
`frame-wide`, `frame-square`, `frame-tall`, `focus-top`, `focus-bottom`,
`lead-photo`.

## Share cards

The picture a pasted link shows is drawn, not borrowed. `aab/share-card.js`
makes a 1200×630 JPEG from the piece's lead photo, cropped around the part
the writer marked, and that is what `cover` holds and `og:image` points at.
It is a JPEG because the scrapers behind WhatsApp, Facebook and LinkedIn
will not read the WebP every photo here is stored as: pointing them at the
photo itself is how a piece with a picture ends up sharing as the default
card. The desk flags any piece whose cover is still a raw photo and can
draw the missing card in place.

**A photo is read out of the editor by decoding, never by fetching.**
`fetch()` on a `data:` URL is governed by `connect-src`, not `img-src`,
and this site's policy allows `data:` under `img-src` only. So a pasted
photo displays perfectly and every attempt to upload one was blocked
before it left the browser, silently, for weeks: R2 stayed empty, every
`cover` stayed empty, and every shared link showed the default card.
`aab/photo.js` decodes instead, and `aab/studio-publish.test.mjs` drives
a real publish under the policy read out of `_headers` and fails if that
regresses. Do not "simplify" it back to a fetch.

## Archiving a page, rather than deleting it

A page that has been replaced goes to `archive/`, not to the bin.
It leaves `aab/`, which is the whole of what taking it off the
site means, and it stays readable by whoever has to check that its
replacement really does what it did.

Two conditions, both literal: **nothing serves it and nothing
imports it.** So before the move, follow every reference: a
`PAGES` entry in `content.js`, the prerender rules in `app.js`,
the `Disallow` block `build-meta.mjs` writes, the `PRIVATE` set in
`build-og.mjs`, any test that drives the page, and any link in
`app/src/**`. Add a line to `_redirects` for the old URL. If a
test was the only thing checking a module the page happened to
host, repoint the test rather than losing it: `aab/studio.test.mjs`
is 68 checks of `aab/editor.js` and it survived `studio.html` by
being pointed at `/studio/`.

`archive/README.md` has the reasoning and the table of what
replaced what.

## Before deploying

Run the checks. They are fast and each one exists because something
shipped broken once:

```sh
node aab/check-routes.mjs   # redirect loops, dead links, bad article slugs
node aab/check-css.mjs      # a school's layer styling the whole site, and a
                            # block class that means two things at once
node aab/check-sw.mjs       # a precached file changed without a VERSION bump
node aab/check-content.mjs  # a page that has stopped counting the site correctly
node aab/check-csp.mjs      # code calling a host the browser is not allowed to reach
node scripts/check-crons.mjs # a scheduled job the Worker is no longer listening for
node scripts/check-pieces.mjs # a written piece nothing on the site links to
node scripts/check-headers.mjs # a page a Worker built, served with no CSP
node scripts/check-schools.mjs # a ladder the browser and the builders disagree about
node scripts/check-rows.mjs # a description of the database that has stopped
                            # being true, or a handler keeping its own copy
                            # of a vocabulary
node scripts/build-school-icons.mjs --check   # a school drawing next/ copied
node scripts/build-school-hubs.mjs --check    # a school page next/ copied
node scripts/check-next.mjs # a copy inside next/ that has drifted from the
                            # thing it was copied from
```

`check-pieces.mjs --live` also asks the database and prints where every
piece actually lives, which is the one question `TRANSITION.md` Stage 3
turns on.

And when anything under `functions/` or `scripts/` changed:

```sh
node scripts/restore.test.mjs      # a backup that would not restore
node scripts/reader.test.mjs       # somebody posting as somebody else
node scripts/comments.test.mjs     # a comment appearing without approval
node scripts/snapshot.test.mjs     # a nightly snapshot that leaks, or that throws
                                   # at 03:17 where nobody is watching
node aab/studio-publish.test.mjs   # a photo that never reaches R2, under the
                                   # real CSP (needs Playwright, skips without)
node aab/sync.test.mjs             # resetting, and meeting an account for the
                                   # first time (needs a server on :8899)
node aab/studio.test.mjs           # the editor, end to end (68 checks)
node functions/_lib/notion.test.mjs
node scripts/schools.test.mjs        # a curriculum that lost a field, a lesson
                                     # body that changed, or a ladder that came
                                     # back in the wrong order (32 checks)
node scripts/schools-api.test.mjs    # a school readable by anyone, writable by
                                     # somebody else, half-written, or a lesson
                                     # edited into existence (43 checks)
                                     # Both page-comparing checks are archived
                                     # now: schools-build.test.mjs compared the
                                     # database against the files, and
                                     # check-schools-built.mjs compared the
                                     # builders against the committed pages.
                                     # There are no committed pages. What asks
                                     # that question now is next/parity.test.mjs,
                                     # against the route.
```

And when anything under `app/src/` changed, after rebuilding.
`playwright` is a devDependency of `app/`, and it does not bring
a browser with it: point `CHROMIUM_PATH` at one, or run
`npx playwright install chromium`. Without either, both files say
so and skip, which is not a pass:

```sh
node app/desk.test.mjs             # a panel that renders and is not finished
                                   # (75 checks, needs Playwright and a browser)
node app/studio.test.mjs           # the React Studio's chrome, end to end
                                   # (78 checks, needs Playwright and a browser)
```

And when anything under `next/` or `shared/` changed, after
`cd next && npx opennextjs-cloudflare build`:

```sh
node next/parity.test.mjs          # the Next.js route saying something the
                                   # Worker's own renderer does not, and a
                                   # reading hub that has stopped agreeing with
                                   # the database
                                   # (114 checks, needs the build, skips without)
```

It really does run in a container, as of 16 August 2026, and the
reason it looked as though it did not is worth knowing: it gave up
on any line matching `Error: `, and `wrangler dev` prints exactly
that, harmlessly, wherever there is no outbound network. It then
started forty seconds later. A skip now says which of the three
ways it failed to start happened, and a skip is never silent.

## After deploying

One check describes what is live rather than what is committed, so
it belongs after the upload and not before it:

```sh
node scripts/check-live.mjs        # the service binding, the second Worker's
                                   # own scripts, and the pieces that fall
                                   # through to a file
node scripts/check-preview.mjs --preview <branch-preview-url>
                                   # does the Next Worker's branch preview
                                   # render what the live site renders
```

`check-preview.mjs` is how a Stage 11 route gets verified before
anything forwards a reader to it. The two Workers deploy
separately and Cloudflare gives `reiad-next` a branch preview URL
on every push, with the real database binding, so a route can be
written, pushed and asked real questions while `NEXT_ROUTES` in
`worker.js` still sends nobody there. The URL is in the Cloudflare
bot's comment on the pull request.

It exists because `next/parity.test.mjs` is the better test and
does not run everywhere: it needs `wrangler dev` on workerd, and
somewhere without it this is the only thing holding a route to
anything. Reach for the parity test first; reach for this when
that is not available, and always to catch a deployed regression
a local test cannot see, because it asks the live site and the
live database rather than a fixture.

It runs itself on every push, in `.github/workflows/live-check.yml`,
because the two things it is really watching are settings on a
deployed Worker rather than lines in this repository, and an article
renders perfectly with both of them broken.

If a precached file changed, bump `VERSION` in `aab/sw.js`, add a line to
the changelog at the top of that file saying what changed and why it needs
the bump, then run `node aab/check-sw.mjs --update`.

## Backups

The database has two, and the split between them is about who can read
the result, not about size.

The repository is private as of 15 August 2026, and **that changes
nothing about what may go in git.** Visibility is one click and
retroactive in neither direction: going private unpublishes nothing
already fetched or forked, and going public later publishes the whole
history at once. A rule that holds only while a checkbox holds is not a
rule.

`content/articles.backup.json` is committed nightly by
`.github/workflows/backup.yml` and holds **live articles only**. Every
byte of it is already served at a public URL. Drafts, reader questions,
subscriber emails, the admin password hash and any identifier of a
system outside this site are deliberately absent, and
`functions/_lib/backup.js` says why at length. Do not widen that
`SELECT` without reading it.

Everything else goes nightly into R2 under `backups/`, written by the
Worker's own cron, kept a fortnight. Not public, same provider as the
thing it is backing up, which is a weaker guarantee and is written down
as one.

To restore, read the SQL before you run it:

```sh
node scripts/restore.mjs content/articles.backup.json > restore.sql
npx wrangler d1 execute reiad --local  --file=restore.sql   # practise
npx wrangler d1 execute reiad --remote --file=restore.sql
```

## Where a lesson's words live

In D1, and in one committed export of it. The
`aab/<school>/content/<stage>.js` modules are gone from `aab/`
as of 16 August 2026: they are in `archive/schools/`, off the
site, and they were being uploaded and served at addresses nobody
had asked for in months.

A lesson is written at `/studio/?lessons`, which saves one row
through `PUT /api/schools/<school>/<stage>/<lesson>`. **As of
Stage 11.7 that is the whole of it**: the route reads the row, so
saving in the Studio changes the page. There is nothing to
rebuild and nothing to commit, which is what the whole stage was
for.

The snapshot is still worth refreshing, because two checks and
every test read it and it is the schools' committed backup:

```sh
npx wrangler d1 export reiad --remote --output schools.db
node scripts/export-schools.mjs --db schools.db   # content/schools.backup.json
```

**Why there is a file at all, now that no page is built from it.**
Three reasons, and none of them is the pages any more. It is the
schools' half of the nightly backup, on the same footing as
`content/articles.backup.json`. It is what `check-schools.mjs`
compares the four `curriculum.js` modules against. And it is the
only copy of the lesson prose that a check running on a laptop
with no network can read, which is how `check-css.mjs` knows that
`.shobdo-list` and thirty-one other rules are styling something
real.

It is safe on the same grounds as ever: every byte of it is
already served at a public URL. It carries no timestamp,
deliberately, so that identical content is identical bytes and
the git log answers "did the prose change" rather than "was this
refreshed".

**The pages are gone as of 16 August 2026, and so is half of
this.** TRANSITION.md Stage 11.7: 247 of the 251 school pages are
Next.js routes rendered from the rows, and the four practice books
are what is left. So there is no committed page to compare a build
against, `check-schools-built.mjs` is in `archive/schools-builders/`
beside the two builders whose whole output it watched, and
`next/parity.test.mjs` asks that question against the route
instead.

`check-schools.mjs` stays and does two things: it compares the
ladder in `curriculum.js` against the ladder in the snapshot, and
it computes every lesson's URL, progress id and label both through
`shared/schools.js` and through the school's own `curriculum.js`
and fails on any pair that disagree.

**The ladder is still `curriculum.js`,** and still read by the
browser: forty files import from one of the four, and Stage 11.7
is what replaces them. So two files describe the same four
schools, and `check-schools.mjs` fails if they stop agreeing about
which lessons exist, in what order, in which section. Titles and
prose are not compared: those are the Studio's now.

**A stage's `base` says where its pages go, not whether anybody
can write them.** `basics-1` carries a `base` of `/learn/terms/`
because its eighteen term pages were published there for a year
before this school had a builder, and their URLs do not move. They
are written from the rows like everything else; the builder just
writes them to that address.

**One stage really is not editable, and the reason is the
sanitiser rather than the builder.** `start` is `inline`: its
eight steps are accordion sections of the hand-written hub at
`/learn/`. They are also not article prose. Each carries a
two-column "what you do / what others do" split, a risk badge and
a call-to-action, using the classes `split`, `do`, `others`,
`warn`, `bn-h` and `btn`, none of which is in the article
allowlist. Put one through `sanitiseHTML()` and `term` and `ex`
survive while the rest go: the layout collapses into a run of
paragraphs.

Widening the allowlist would not fix it. Those classes belong to
the starter guide's own layer, and `check-css.mjs` fails a class
two layers both define. So the eight rows keep empty bodies and
the Studio says where the text actually lives.

Generated pages are generated. Edit the source, never the output:

```sh
node aab/deutsch/build-deutsch.mjs   # the three German practice books
node aab/english/build-english.mjs   # the English practice book
node scripts/build-school-icons.mjs  # next/lib/school-icons.ts from aab/*/icons.js
node scripts/build-school-hubs.mjs   # next/lib/school-hubs.ts from the four hubs
node aab/build-meta.mjs              # feed.xml, sitemap.xml, robots.txt

cd app && npm run build             # aab/desk/**   from app/src/** (React)
                                    # aab/studio/** from app/src/studio/**
```

`app/` is the React workspace: Vite, React and TypeScript, building to
`aab/desk/` and `aab/studio/`. Two pages, two builds, one file each at a
stable path, because `sw.js` and the HTML shells name real paths and a
hashed chunk would fight them. `npm run build` runs both; `TARGET` picks
one. **Its output is committed**, for the same reason every
generated page here is: the site deploys by uploading `aab/`, with no
build step in CI, and adding one would mean a build command in a
dashboard that cannot be seen from the repository. So the rule is the
rule: edit `app/src/**`, run the build, commit both.

The stylesheet is not part of it. `aab/styles.css` stays the design
system and React renders the same class names into the same `@layer`
rules. No CSS-in-JS, no Tailwind, no second design system: a port that
also redesigns the page cannot be judged.

Neither are the site's own modules. `/app.js`, `/api.js`, `/auth.js`,
`/content.js`, `/share-card.js`, `/photo.js` and `/editor.js` are left
external by `vite.config.ts` and imported at runtime, so the desk shares one copy
of each with every other page instead of carrying a second that can
drift. They are plain JavaScript, so each one is described by a
declaration in `app/src/types/` that `tsconfig.json` maps the runtime
path to. Do not answer an untyped import with a `@ts-expect-error`:
that silences the complaint without describing anything, and it
silences the next complaint too.

## What more than one runtime has to agree on

`shared/` is for anything the Worker, the browser and the Next.js
route must all say the same way. Two files today: `look.js`, the
per-section table and the head facts every article page states, and
`headers.js`, the security headers a response has to carry when it
was not served as a static file.

It is an npm package (`@reiad/shared`) because `next/` cannot import
by relative path out of its own directory: Turbopack refuses to
resolve above its root, and moving the root moves Next's file-tracing
root with it, which breaks the OpenNext build. `next/.npmrc` sets
`install-links=true` so npm copies it in rather than symlinking, for
the same reason. `shared/README.md` says all of this again where
somebody editing it will see it. The Worker imports the files
directly; esbuild has no such restriction.

**A response a Worker builds is not a static asset**, so `aab/_headers`
does not apply to it. Every article rendered from the database was
served with no Content-Security-Policy, no HSTS and no
`X-Frame-Options` for as long as that route existed, beside
file-based articles that had all three, and the page renders the
same either way. Anything that returns HTML from a Worker goes
through `htmlResponse()` in `shared/headers.js`, and
`check-headers.mjs` fails if that list and `_headers` drift.

## The writing surface is one module

`aab/editor.js` is the contenteditable: the sanitiser, the block list,
the markdown input rules, the slash menu, the figure toolbar and the
caret work under all of it. Both Studios import it, `createEditor({
root, onChange, lang, toast, pickPhoto })`, and the root element is
handed in rather than looked up so importing it does not import a page.

**Do not copy any of it into a component.** A `contenteditable` is a
piece of the DOM the browser and the writer are both editing behind
React's back; rendering it from state replaces the node the caret is in
on every keystroke. React owns the chrome around it and nothing inside
it. Two sanitisers that disagree is the bug the three-place rule above
already exists for, and a second copy of this file is how you get one.

**A port is finished when it does what the thing it replaced did, not
when it renders.** Those two look identical from the outside, which is
how the first React desk shipped as three thin panels missing the
search boxes, the filter counts and most of the actions. So the list of
what the old page did is written down as a test:
`app/desk.test.mjs` drives the built page in a browser against routed
API fixtures, and every check in it is a feature `aab/desk.js` had.
Anything ported out of `aab/*.js` gets the same treatment before it is
called done.

That includes the `<head>`. A change to canonical links, Open Graph tags
or the webfont link has to go into `page()` inside both builders, or the
two schools drift away from the rest of the site one deploy at a time.

## Publishing a new case study

The failure this list exists for is a finished case study that nobody can
reach. In order:

1. Write the page into `aab/portfolio/`.
2. Add it to `PAGES` in `content.js` with `group: "case"`, plus `kind`
   (`model`, `analysis` or `research`) and a `short` title. That one entry
   puts it in the menu, the Ctrl+K palette, the sitemap, the home page
   rotation and the portfolio count.
3. Add its card to `portfolio.html`.
4. `node aab/check-content.mjs` fails until steps 2 and 3 are both done.

## Where an article lives, and where it is going

Both places, for now: a committed HTML file plus an entry in
`content.js`, or a row in D1 written by the Studio. The row wins at
the URL and the file is the fallback. Which lists can see which is
uneven, and the plan for closing that, moving the writing into the
database and then moving the site onto React and Next.js one route
at a time, is in `TRANSITION.md`.

That file is a log as well as a plan. Anything that lands against a
stage in it gets its status changed and a dated entry at the
bottom, in the same commit as the work.

## Before opening a pull request

Check whether anything else is already in flight. Two open pull requests
had added three case studies to the same files a redesign was rewriting;
the redesign was branched off `main` and would have dropped all three on
merge. Look at the open PRs, not just `main`.

## Merging: do it, do not ask

Finished work ships without a second conversation. Open the pull
request, wait for the checks, and merge it as soon as they are green.
Squash merge, so `main` keeps one commit per change with the pull
request number on the end, the way every entry in the log already
reads. There is no need to come back and ask whether it should go in:
the decision that mattered was made when the work was asked for.

This rule leans on the section above rather than replacing it, and the
lean is the whole point. Merging without asking is only safe while
every check still runs first:

- all four checks in **Before deploying** pass,
- anything that touched a precached file bumped `VERSION` in
  `aab/sw.js` and re-ran `check-sw.mjs --update`,
- generated pages were regenerated from their source, not edited,
- and `grep -rn $'\u2014' aab/ functions/` comes back empty.

A red check is a reason to fix it, or to say plainly what is broken
and why it is not fixable here. It is never a reason to merge anyway,
and "the user said merge automatically" does not turn a failing check
into a passing one.
