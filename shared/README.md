# shared/

The handful of things that more than one runtime has to agree on.

There are three renderers of this site now: the Worker in
`worker.js` plus `functions/`, the browser in `aab/`, and the
Next.js route in `next/`. Anything all of them must say the same
way lives here, and nowhere else.

Today that is thirty-three files and two directories, and
`check-types.ts` fails if one of them is not described below.
That check exists because this line said six while nine were
here: `nav.ts` and `routine.ts` arrived in two changes that had
no reason to open this file, which is how every stale tracker in
this repository got written.

- **`content.ts`** the site's own manifest: `SITE`, `SECTIONS`,
  `SKILLS`, `TOOLS`, `PAGES`, `COUNTS` and the palette's index.
  Every number this site says about itself is derived here rather
  than typed into a sentence, which is the rule `check-content.ts`
  enforces. It has an output: see below.

- **`csl/`** the citation styles the writing desk renders with, each
  vendored as a string by `scripts/import-csl.ts` and loaded when a
  document asks for it, plus the en-GB locale and the registry that
  says which cite in footnotes. RESEARCH.md section 16.
- **`curricula/`** the four schools' ladders, one file each:
  every stage, section and lesson of `/money/`, `/deutsch/`,
  `/quran/` and `/english/`, with the helpers each school spells
  in its own vocabulary. They are what `content.ts` counts and
  what `import-schools.ts` writes into D1, and they have outputs
  too: see below.

- **`art.ts`** which of the twelve drawings a thing wears, and in
  what colour. `nav.ts` names one for the twenty things the rail
  lists; this DERIVES one for the two hundred that are rows, out
  of the tag, the topics and the section a row already carries, so
  a piece published next year arrives with a picture and nobody
  has to remember anything. It also owns the vocabulary: `nav.ts`
  and `next/components/card-art.tsx` both take `ArtSubject` from
  here rather than writing the twelve out again.

- **`art-svg.ts`** the twelve drawings themselves and the six
  walls they stand against, as the inside of an `<svg>`. Strings
  rather than JSX for the reason `next/lib/school-icons.ts` holds
  strings: markup that something other than React has to be able
  to read. They were 747 lines inside `card-art.tsx` and
  `aab/src/share-card.ts` could not reach them, so a card pasted
  into a chat carried the room with nothing standing in it.
  **Not compiled into `aab/`**, unlike the eight below: it is
  34 KB and nobody needs it except whoever is drawing a card,
  which is one admin at publish time. `GET /api/admin/art` hands
  it over instead, behind `isAdmin()` like the rest of that
  route.

- **`art-of.ts`** the same decision with the rail's two tables
  already handed to it: which subject the rail names for a
  section, and what colour that section is. `art.ts` deliberately
  imports nothing, because `nav.ts` takes the vocabulary from it
  and a value import back would be a cycle, so somebody has to do
  the passing in. This is that, once, for everybody. It was
  `next/lib/art.ts` and reachable only by the Next Worker, which
  was fine until the share card needed the same answer out of the
  Worker: a card is drawn in a browser, from a Vite bundle that
  cannot import `shared/` at all.

- **`look.ts`** the per-section table. What mount a piece is
  served at, the class on its body, the card it falls back to, how
  "8 min read" is written, and the line at its foot. Plus
  `headFacts()`, which is every fact the head of an article page
  states: both renderers build their tags from it, which is what
  makes "the two agree" a thing a test can check rather than a
  thing a comment can ask for.

- **`headers.ts`** the security headers. `aab/_headers` is read by
  Cloudflare's static asset server and applies to files in `aab/`;
  a response built by a Worker is not a file, so it gets none of
  them unless it says so. `scripts/check-headers.ts` fails if this
  list and `_headers` stop agreeing.

- **`schools.ts`** the four curricula, read out of D1 in the shape
  the site already speaks, plus the ladder's arithmetic: a lesson's
  URL, its progress id, its label.

- **`lesson.ts`** what an interactive part of a money school
  lesson is: the eleven block kinds, the `{ bn, en }` pair every
  string in one is said as, the mount markers a body carries and
  the splitter that reads them, and the validator both
  `check-money.ts` and the Studio run. `MONEY.md` is the whole
  argument.

- **`lesson-labs.ts`** the arithmetic behind every `lab` block,
  under a named model, and the ranges and defaults of its own
  sliders. A block names a model and a model is code, for the
  reason `CLAUDE.md` gives about a calculator needing a release:
  a formula stored in a database row is code where nothing
  typechecks it.

- **`rows.ts`** what a row of this database actually is. The set of
  values each status column may hold, written once as a constant
  with the type derived from it, so a status added to one is added
  to the other by construction.

- **`courses.ts`** the third-party course catalogue's types,
  counts and addresses, over the generated `courses.data.json`.
  It is not in the `exports` map and must not be imported for its
  VALUES from `next/`: the catalogue is somebody else's course and
  a bundle carrying it would be publishing it. `check-courses.ts`
  fails on that import.

- **`nav.ts`** the one table the menu comes from. A school added
  there appears in the rail, in the footer and on `/skills` at
  once, and `unlisted` is how a section stays out of both menus
  while still being said once.

- **`diet-words.ts`** the diet tool's own readouts, in both
  languages. Its own table rather than a corner of
  `tool-strings.ts`, because `stringKeys` in the stock fixture is
  "every phrase the stock check can render" and a diet phrase in
  that list makes the app's assertion weaker for both tools.

- **`heads.ts`** what a hub page says about itself: the eyebrow,
  the headline and the lede of the pages that are a list of
  things rather than a piece of writing. Copy is data, so the
  Android app draws these hubs with the site's own words instead
  of a bare title. A number in a lede is a SLOT filled from
  `COUNTS`, never typed, which is the rule at the top of
  `CLAUDE.md`.

- **`research.ts`** what the Research Studio's rows are made of:
  the vocabularies every table's CHECK constraint carries (source
  types with a colour and a CSL type each, note kinds, lanes,
  question kinds and states, project kinds), the shape of a CSL
  record, and the four pieces of arithmetic every importer needs:
  which columns a record fills, its citation key, its duplicate
  hash, and its authors in one line. `RESEARCH.md` is the plan
  and `scripts/research.test.ts` holds the arithmetic.

- **`research-write.ts`** the writing desk's arithmetic over the
  article HTML a document is: the citation chips, the outline, the
  counts in both scripts, Markdown and LaTeX out, the claims audit
  and the self-overlap check, every one pure so the research test
  holds it. RESEARCH.md section 16.
- **`research-review.ts`** the review room's stages, frames and
  appraisal templates, and PRISMA 2020 derived from the records by
  stage and reason. RESEARCH.md section 13.
- **`research-stats.ts`** the lab's first tier of statistics in
  TypeScript: descriptives, the tests, OLS with classical, HC and
  clustered errors, logit and probit, panels, differences in
  differences, instruments, survey means, the finance helpers and
  the agricultural arithmetic, each held to a closed form by
  scripts/research-stats.test.ts. RESEARCH.md sections 14 and 36.
- **`research-lab.ts`** what the lab does that is not a statistic:
  a delimited file read with its types inferred, the importers that
  know a DSE or an Alpha Vantage file by its columns, the four
  sanity checks, a fit as an APA table, and a chart as SVG text.
  RESEARCH.md section 14.
- **`research-field.ts`** the field room's vocabulary and arithmetic:
  a transcript's segments out of pasted text or the model's answer,
  the code matrices derived from the codings, and a survey's
  questions and answers as a table. RESEARCH.md section 15.
- **`research-tools.ts`** the workshop's arithmetic: sample sizes and
  power, effect sizes, p and CI both ways, the which-test tree, dates
  with the tabular Islamic calendar, words in both scripts,
  abbreviations, readability as facts, a grid to four table
  syntaxes, Boolean strings per database, a question from a frame,
  spaced repetition and a seeded random. RESEARCH.md section 19.
- **`research-assist.ts`** the assistant's tasks, its system
  prompt, the grounding of an answer against the library's keys,
  the chunking the semantic search indexes, the cost of a call at
  the published prices, and the prompt library's placeholders.
  RESEARCH.md sections 21 and 36.
- **`research-graph.ts`** the atlas's arithmetic: a deterministic
  force layout for the graph, the argument map and the gap matrix
  as cells, the literature timeline as dots. RESEARCH.md 8 and 18.
- **`research-plan.ts`** the planner's kinds of event and states of
  a submission, the week's boundaries, and an iCalendar file written
  out of a list of events for a calendar that reads the studio's
  dates. RESEARCH.md section 17.
- **`research-bib.ts`** BibTeX and RIS, read into CSL-JSON and
  written back out of it, so an export from any reference manager
  drops on the library and the library leaves as either. Written
  rather than depended on: a parser this size can be read in one
  sitting, and `citation-js` is a megabyte the writing desk will
  want in stage 4 and the library does not need to import a file.

- **`research-words.ts`** the studio's own phrases in both
  languages, beside `diet-words.ts` for that file's reason, and
  in `shared/` because the Android app will draw the same rooms.

- **`widgets.ts`** the catalogue of what the front page can be
  made of, and the layout a reader who has arranged nothing gets.
  The catalogue is DATA, so a widget renamed here is renamed on a
  phone at the next fetch; a widget's DRAWING is code on each
  side, so both sides SKIP a kind they cannot draw rather than
  leaving a blank rectangle with a title on it. `layoutOf()` is
  the parse, and it drops what it cannot read rather than
  failing: a board one card short is recoverable and a board that
  will not load is not.

- **`profile.ts`** the two vocabularies an account answers with:
  how often somebody means to practise, and the three kinds of
  target. Both are a CHECK constraint in Postgres and both were
  written out a second time in a React component, which is what
  `check-rows.ts` section 2 already exists for one table along.
  There is a third reader now: a pace added here reaches the
  Android app with no release, because `functions/api/site.ts`
  serves it like every other table.

- **`routine.ts`** what a routine is, plus `done()`, the tool's
  only arithmetic. Four places want that sum and four copies is
  four chances for one of them to count leisure, which is the day
  somebody can fail at watching television.

- **`diet.ts`** the diet tool's arithmetic: BMI on both sets of
  cut-offs, waist to height, the two body fat estimates with
  their error bars, Mifflin and Katch, the time weighted trend,
  the learned maintenance, and `target()`, which is the one
  function here that can refuse. Every estimate comes back as a
  range rather than a number, so a caller cannot take the point
  value without having been handed its width. `DIET.md` is the
  plan and `scripts/diet.test.ts` is what holds the two together.

- **`insights.ts`** the readings `DIET.md` section 16 asks for
  and the money arithmetic section 17 asks for, over what
  `diet.ts` already computes rather than recomputing any of it.
  The rule every function here obeys: a templated sentence is a
  sentence somebody has to be able to check, so none of them
  returns a verdict. Each returns the FIGURES a sentence is made
  of, with the span it was measured over and how much of that
  span was written down, and the panel prints the arithmetic
  beside the answer. A reader who cannot follow the sum will not
  believe the number, and they are right not to.

- **`csv.ts`** a file somebody exported from another app, read.
  A parser, a guess at what each column is with HOW SURE it is,
  and a preview that commits nothing. `DIET.md` section 26: an
  importer that guesses silently fills a year of somebody's
  history with the wrong column and they find out in March, so
  the two rules here are that an ambiguous date is REFUSED
  rather than picked (03/04 is either), and that a row whose
  width does not match its header is dropped rather than
  shifted. It is here rather than in the browser because it is
  arithmetic over text with no DOM in it, and a parser that can
  only be exercised by clicking is a parser nobody exercises:
  `scripts/csv.test.ts` is what exercises it.

- **`bundle.ts`** the other direction: a copy this site wrote,
  read back. `DIET.md` section 26 calls the importer reading the
  exporter's format "the only real test of whether an export is
  honest", and until this file existed a reader could take their
  whole account away and bring none of it back. It brings back
  `diet_days` and `diet_entries` and NAMES the other four, and
  the reason is the schema's rather than a preference: those two
  are the tables carrying an `origin` column, which is the only
  thing that lets a bad import be undone in one go.
  `scripts/bundle.test.ts` reads that column list out of the
  migration rather than repeating it, and reads the exporter's
  own table list out of `aab/src/account-page.ts`, so a seventh
  table cannot appear at one end and go unnoticed at the other.
  It carries neither the file's `user_id` nor its row ids: the
  first is refused by row level security and reports a successful
  import of nothing, and the second resurrects deleted rows.

- **`activity.ts`** the diet tool's other half of the same
  arithmetic: what a step is worth to a body of a given weight,
  where the last fortnight of weighings points, and the seven
  daily habits, each read off a column `diet_days` already
  carries rather than off a form. Two rules a reader has to keep:
  nothing here is ever added to a target, because `DIET.md`
  section 19 is firm that exercise calories are not an allowance,
  and every reading has `null` as well as true and false, because
  a column nothing writes has to come back as silence rather than
  as a fortnight of missed days. `scripts/activity.test.ts` is
  the guard.

- **`foods.ts`** the diet tool's portion library: the things
  people actually eat in Bangladesh and in the UK, each row said
  in both languages, with the nutrients that tool tracks where
  they are known and a price carrying the month it was checked.
  Data, four lookups, and the arithmetic that scales a found food
  to the amount that was eaten. Two rules a
  reader has to keep: an `id` is written into somebody's log, so
  renaming one loses what they logged, and every rice, dal and
  pasta row states whether the figure is for the raw food or the
  cooked, in the name, in both languages.

- **`tool-strings.ts`** every word the calculators say, in both
  languages: 366 phrases keyed by name, plus the five formatters
  that print a number in Bengali or Latin digits. It was
  `aab/tools/stock.i18n.js` until the Android app needed it, and
  the browser still fetches it at that exact address, compiled
  there by `build-modules.ts`, because `sw.js` precaches the name.
  `functions/api/tools.ts` serves the same table to the app, which
  is the whole reason it moved: **an edited Bangla sentence
  reaches a phone with no app release.** The formatters are the
  other half of that and go the other way, being code rather than
  data. Both halves of a phrase are required by the type, so a key
  added with only English compiles nowhere.

- **`calculators.ts`** the five calculators' arithmetic:
  compounding, sanchayapatra against FDR, inflation, loan EMI and
  position sizing. It was inline in `aab/src/tools/tools.ts`,
  tangled with the DOM that drew it, and three runtimes read it
  now. **Nothing in it is prose and nothing in it is a format:** a
  calculator returns numbers BY NAME and the key of a sentence,
  and both the browser and the app fill that sentence's
  `{placeholders}` from those numbers, printing each the way
  `FORMATS` says. `check-calculators.ts` is what holds the two
  halves together, and the thing it catches is a placeholder with
  no number behind it, in one language, on one branch.

- **`portfolio.ts`** what a broker's JSON means: the five figures
  at the top of the live dashboard, one holding's weight and gain,
  and a year of dividends bucketed by month with the empty months
  in it. `/api/broker/live` hands back Trading 212's own answer
  unchanged, so this is the layer that reads it, and every field
  is read defensively because every field belongs to somebody
  else: a broker that renames one must not take a public page
  down. `unrealizedProfitLoss` is spelt the American way at the
  source and is not ours to correct. **The public view is not
  here:** a stranger gets percentages, and that stripping happens
  on the server, because a client that filters is a client that
  has already been sent the thing it is hiding.

## TypeScript, and nothing compiled beside it

These are `.ts` files and there is no `.js` next to them, no build
script in this directory and nothing to keep in step. Both
consumers compile them:

- **Next** through `transpilePackages: ["@reiad/shared"]` in
  `next/next.config.ts`, which it needs because the package
  resolves inside `node_modules` and Next does not compile
  TypeScript it finds there.
- **the Worker** through wrangler's own esbuild, which compiles a
  `.ts` import when it bundles `worker.js` with no configuration
  at all.

`package.json` therefore exports the `.ts` files directly.

It was briefly the other way around, and the other way around is
worth not going back to: each module was compiled to a committed
`.js` and `.d.ts` beside its own source, which is three files
where there is one, plus a build script, plus a check to catch
somebody editing the output instead of the input. All of that
existed to serve a compile step that neither runtime needs, since
both of them already have a compiler.

## The five with an output, and the extension in their imports

`content.ts` and the four ladders have one more consumer. The
BROWSER reads the manifest at `/content.js` and a ladder at
`/money/curriculum.js` or one of its three siblings, five URLs
`sw.js` precaches by name and fourteen browser modules import. It
cannot reach this directory, so `scripts/build-modules.ts`
compiles those five into `aab/` the same way it compiles
`aab/src/*.ts`, rebasing the four specifiers `content.ts` reaches
a ladder by. Edit the source; the output is checked against it by
`node scripts/build-modules.ts --check`.

Imports inside this directory carry the `.ts` extension, because
node reads these files with no build step and resolves the real
filename. Every config that sees one therefore sets
`allowImportingTsExtensions`, and `scripts/tsconfig.shared.json`,
which is the one that compiles them, pairs it with
`rewriteRelativeImportExtensions`: that is what turns the
specifier back into a `.js` a browser can fetch.

`tsconfig.json` here emits nothing. It is for
`npx tsc -p shared/tsconfig.json`, which answers "does this
directory typecheck on its own" without waiting on either
consumer's build.

## Why it is a package

`next/` reaches it as `@reiad/shared`, a `file:` dependency.
A relative import up and out of `next/` is the obvious way and does
not work: Turbopack refuses to resolve above its own root, and
moving the root up moves Next's file-tracing root with it, which
breaks the OpenNext build in a way that reads like a Next 16
incompatibility and is nothing of the sort.

`next/.npmrc` sets `install-links=true` so npm copies this
directory into `next/node_modules` rather than symlinking it:
Turbopack resolves a symlink to its real path and then refuses it
for being outside the root. The copy is made by `npm install` and
is not committed, so there is still one source for each of these
files.

The Worker imports them by relative path, because esbuild has no
such restriction.

## Editing one of these, and the copy that does not notice

**A change here does not reach `next/` until the copy is deleted.**
Not until `npm install` is re-run: npm keys a `file:` dependency by
its version, sees `1.0.0` already installed, and leaves the stale
copy alone however much the contents changed. So the sequence is:

```sh
rm -rf next/node_modules/@reiad/shared && (cd next && npm install)
```

This is worth the two commands because the failure is silent and
expensive. A typo in `bnNum` put every Bangla numeral on the site
into Devanagari, `০১২৩` becoming `०१२३`. It was fixed here, the
Next build was re-run, and the route kept serving the wrong digits,
because the build was compiling a copy made before the fix. What
caught it was `next/parity.test.ts`, which renders the route and
compares it against the page it replaced; nothing else would have,
and the digits are similar enough to survive a glance at a diff.

The Worker never has this problem. It imports by relative path, so
it reads the file that is actually here.

- **`storage.ts`** everything this site keeps in a browser, in one
  table: the key, what it is in a sentence a reader could read,
  which of seven kinds it belongs to, and whether it leaves the
  machine. Thirty-eight keys had accumulated across fourteen files
  and the only way to find out what was held was to grep for
  `localStorage`, which is archaeology rather than a description.
  `check-storage.ts` reads the code and this table and fails when
  they disagree in either direction, including on a row whose
  `syncs` does not match `KEYS` in `aab/src/sync.ts`. That last
  one matters most: a key that says it syncs and is not in that
  table is a promise the account page makes and the account does
  not keep. Three runtimes read it, which is why it is here: the
  check under node, the account page's own panel, and the
  comparison against `sync.ts`.

- **`lesson-grids.ts`** the sheets a reader types into, which is
  the twelfth block kind and the first where a reader puts a
  number IN rather than choosing between numbers somebody else
  wrote. A cell is `given`, `input` or `calc`, and a `calc` names
  other cells and one operation out of six rather than carrying an
  expression: an expression has to be parsed, and a parser that
  takes arithmetic out of a database row is an evaluator with a
  database in front of it. The same object serves a profit and
  loss account and a German verb's six forms, because both are a
  table with holes in it and a rule for what belongs in each hole,
  which is what let the three language schools have an interactive
  at all. Here rather than in the component for the reason the
  labs are: the Android app renders the same rows and a sheet
  whose arithmetic lived in React would be a sheet the app could
  not compute.
