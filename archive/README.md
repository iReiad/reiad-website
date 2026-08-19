# archive

Pages this site used to serve, kept because they are the record of
what the thing that replaced them had to do, and deleted from the
deploy because two of anything is how the two drift apart.

**Nothing in here is uploaded.** The site deploys by uploading
`aab/`, so a file that has moved out of that directory is off the
site the moment the next deploy runs. `_redirects` sends the old
addresses to the new ones, so a bookmark or an old link still
lands somewhere sensible rather than on the 404 page.

**Nothing in `aab/` imports any of it, either.** If a module the
site ships still needed one of these files, the file would not be
in here; that is the test for whether something is ready to be
archived, and it is worth applying literally rather than
generously.

**A test may, and two do.** That is not a loophole in the rule
above, it is the point of keeping any of this readable. The reason
an archived thing is kept rather than deleted is so that whoever
has to check the replacement really does what it replaced can read
both, and a check that reads both is the most useful form that
takes. `scripts/schools.test.mjs` reads the archived lesson prose
and proves the rows in the database still say what those files
said. Nothing about that reaches a reader, a page or a deploy.

The line worth holding is the one about the site, not the one
about the word "import": a file in here must not be able to change
what anybody is served.

## What is here, and what replaced it

| File | Replaced by | When |
| --- | --- | --- |
| `studio.html`, `studio.js` | `aab/studio/`, built from `app/src/studio/**` | 16 August 2026 |
| `desk.html`, `desk.js` | `aab/desk/`, built from `app/src/**` | 16 August 2026 |
| `schools/<school>/*.js` | `content/schools.backup.json`, exported from D1 | 16 August 2026 |
| `schools-build.test.mjs` | `scripts/check-schools-built.mjs` | 16 August 2026 |
| `work.html`, `services.html` | `_redirects`, which forwards both to `/portfolio` | 16 August 2026 |
| `insights.html`, `cooking-index.html`, `travel-index.html`, `reads.js` | Next.js routes, rendered from D1 | 16 August 2026 |
| `pieces/*.html` | rows in D1, rendered by the Next.js article route | 16 August 2026 |
| `about.html`, `contact.html` | Next.js routes at the same addresses | 16 August 2026 |
| `colophon.html` | nothing: `_redirects` sends it to `/about` | 16 August 2026 |
| `skills-index.html`, `account.html` | Next.js routes at the same addresses | 16 August 2026 |
| `tools-index.html`, `tools-stock.html` | Next.js routes at the same addresses | 16 August 2026 |
| `portfolio.html`, `portfolio/*.html` | Next.js routes at the same addresses | 16 August 2026 |
| `index.html` | a Next.js route at `/`, which its canonical link always named | 16 August 2026 |
| `shells/*.html` | Next.js routes; Vite stopped emitting a page | 16 August 2026 |
| `first-sync.js` | nothing: `aab/sync.js` no longer has a question to ask | 17 August 2026 |
| `crumbs.js`, `crumbs.ts` | `next/lib/crumbs.ts`, out of `lib/nav.ts`, drawn in the top bar | 19 August 2026 |

`work.html` and `services.html` were early placeholders that still
carried template text ("[Your Name]", "hello@yourdomain.com"), kept
afterwards as HTML forwards to `portfolio.html` so old links and
search results would not break. They stopped doing that job a while
ago without anybody noticing: `_redirects` sends `/work.html`,
`/work`, `/services.html` and `/services` to `/portfolio` with a
301, and that rule is consulted BEFORE the asset router, so the
files themselves have been unreachable ever since. Their
`<meta http-equiv="refresh">` has not run for a reader in months.

Checked before moving them, because "unreachable" is a claim about
a deployed site rather than about a repository: all four URLs were
asked for on reiad.co.uk and all four answered 301 to
`/portfolio`. Nothing links to them, and they are in no `PAGES`
entry, no sitemap, and no precache list. TRANSITION.md Stage 11.8.

The three reading hubs are the first pages here whose **URL did
not move**. `/insights.html`, `/cooking/index.html` and
`/travel/index.html` answer exactly as before; what changed is
what answers them. They are listed in `run_worker_first` in
`wrangler.toml`, so the asset router never looks for a file, and
the Next.js Worker renders the same page from the database that
the file used to render from a fetch after paint. The two Bangla
files are here under flattened names because two `index.html` in
one directory is one file: what they were is in the table above
and in the git history either way.

`shells/` is four files for two pages. `desk-src.html` and
`studio-src.html` are what Vite built from, and
`desk-index.html` and `studio-index.html` are what it wrote:
the same shell, hand-written, then generated. Both addresses are
Next.js routes now and `vite.config.ts` takes a `.tsx` entry, so
the build emits `app.js` and nothing else. The apps inside those
shells are still the Vite bundles, and stay so until the site
modules they import can be reached from `next/`. TRANSITION.md
Stage 11.6.

`portfolio/` is the seven case studies and the index that lists
them. Only the pages are here: every `.model.js`, `.data.js` and
`.test.mjs` is still in `aab/portfolio/`, imported by the same
scripts at the same addresses, with 1,931 lines of tests running
on every commit. That is section 2b's rule about the case
studies, taken literally: their whole value is that the figures
are right and provably unchanged, so the numbers were the last
thing the port was allowed to touch, and it did not.

`colophon.html` is the one page here that was not replaced. It
described how this site is built, and its own copy said "0 build
steps", "0 runtime dependencies, npm packages or frameworks" and
"no framework, no templating, no generator". Stages 9 to 11 made
every one of those false: there is a build, there are packages,
and the pages are React components on Next.js. A page about how
something is built cannot be ported into the thing that
falsified it, and rewriting it would have made it a page about
how the site used to be built, which is what this directory is
for. `/about` answers the question it was answering, and both of
its addresses redirect there.

`pieces/` is every piece of writing this site ever kept as a
file: `dse-basics`, `onions` and `uk-visit-visa`, the `dsex` stub
and the `_template.html` the Studio was written against. All three
pieces were published into D1 on 15 August and the rows have
answered their URLs ever since, so the files were a fallback
nothing reached. `dsex` is not a piece at all: `_redirects` sends
both of its addresses to `/learn/terms/dsex`, and has since before
this. Their entries in `content.js` went in the same commit, which
is what Stage 3 asked for. TRANSITION.md Stage 11.2.

`first-sync.js` is the only module here that was archived because
the question it asked stopped being a question. It was a modal
with three answers, shown once per account per browser, asking
what should happen to the progress a device already held when
somebody signed in on it. The three answers were "keep both",
"use my account's" and "use this browser's", and the dialog
existed because `aab/sync.js` merged a browser and an account as
two equal copies of one thing and could not tell a laptop from a
borrowed phone.

The account is the record now. Signing in writes the account's
rows onto the device and uploads nothing that was there first, so
there is one answer and the site does not have to ask for it. The
file is kept because the three-way merge it fronted is the thing
the rewrite has to be checked against, and because the wording of
those three choices is a good record of how hard the old shape
was to explain. `.first-sync*` went out of `styles.css` in the
same commit.

`reads.js` drew the cards on both of those pages and has nothing
left to draw. `.read-en`, `.read-note` and `.read-fallback` went
out of `styles.css` in the same commit, which `check-css.mjs`
found on its own the moment the pages holding them left `aab/`.
TRANSITION.md Stage 11.1.

`schools/` is the four schools' lesson prose: eleven modules that
were `aab/<school>/content/<stage>.js` and `aab/learn/lessons/*.js`.
They were the source a builder read until the prose moved into D1,
and they were also being uploaded and served at addresses like
`/quran/content/dhap-1.js`, which nothing had asked for in months.
A lesson is written at `/studio/?lessons` now and reaches a page
through `content/schools.backup.json`. `scripts/check-schools.mjs`
fails if the ladder in those archived files ever stops matching
the ladder in the snapshot.

`schools-build.test.mjs` proved the migration: 229 pages, built
from those files and from the database, byte-identical. It is in
here because it had an expiry date built into it. It compares the
database against the files, and the first lesson edited in the
Studio makes them differ on purpose, so the test would start
failing while being entirely right, which is the kind of failing
test everybody learns to ignore.
`scripts/check-schools-built.mjs` asks the question that does not
expire: are the committed pages the ones the current data builds?

`studio.js` was 2,464 lines of imperative DOM work and it carried
the writing surface inside it. That part did not go into the
archive: it came out into `aab/editor.js`, which both Studios
import and which `aab/studio.test.mjs` still drives, 68 checks of
it, against the page that survived. The rest of the file is here.

## Why keep them at all

Two reasons, and neither is sentiment.

The first is that a port is finished when it does what the thing
it replaced did, and the list of what the old thing did is easiest
to check against the old thing. `app/desk.test.mjs` and
`app/studio.test.mjs` are that list written down, 76 and 86 checks,
and they were written by reading these files.

The second is that the history is in git either way, but a
deleted file is only findable by somebody who already knows it
existed. A directory is findable by somebody who does not.

## When something else lands here

TRANSITION.md Stage 11 moves the rest of this site's pages to
Next.js, one route at a time, and each step ends with its files
here rather than in `aab/`. The rule for putting something in is
the one at the top: it is archived when nothing serves it and
nothing imports it, and never before.

## The schools' pages, 16 August 2026

TRANSITION.md Stage 11.7. `schools-pages/` holds 247 of the 251 HTML
files the four schools were made of, and `schools-builders/` holds the
two generators whose whole output they were, plus the check that
compared the two and the generator that lifted the hand-written pages
into `next/`.

| What was here | What answers now |
| --- | --- |
| `/learn/<stage>/<slug>.html` and the other three schools' lesson pages, 229 of them | `next/app/[section]/[slug]/[lesson]/`, from the `school_lessons` rows |
| `/learn/<stage>/index.html` and the other 16 stage ladders | `next/app/[section]/[slug]/index.html/`, counted from those rows |
| `/learn/index.html`, `/deutsch/index.html`, `/quran/index.html`, `/english/index.html` | `next/app/[section]/index.html/`, from `next/lib/school-hubs.ts` |
| `/learn/contents.html` | `next/app/[section]/contents.html/`, from the same |
| `aab/learn/build-lessons.mjs`, `aab/quran/build-quran.mjs` | nothing: the pages they wrote are rendered on request |
| `scripts/check-schools-built.mjs` | `next/parity.test.mjs`, against the route rather than against a file |
| `scripts/build-school-hubs.mjs` | nothing: the copy it made is the original now |

**Four school pages are NOT here**, and they are still in `aab/`:
`/deutsch/stufe-<1,2,3>/arbeitsbuch.html` and
`/english/term-1/workbook.html`. A practice book is thirty, sixty or
ninety days written out in full, it is the same for every reader, and
none of it is in the database. `build-deutsch.mjs` and
`build-english.mjs` are still in `aab/` too, cut down to writing only
those.

**These pages are still read, by a test.** `next/parity.test.mjs`
compares what the route renders against what the page here says, fact
by fact, and the lesson prose byte for byte. That is what this
directory is for, said in the first paragraph of this file: a
replacement is checkable against the thing it replaced. When these are
eventually pruned, those checks lose their other side and should be
deleted rather than weakened.
