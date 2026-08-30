# The money school

`/money/`, টাকা ও শেয়ার. What this file is for: the school is the
largest single body of writing on this site and the one place where
the shape of the thing and the shape of the code have to agree
lesson by lesson. `CLAUDE.md` says how the site is built; this says
how the school is built, and it is the file to read before adding a
পর্যায়, a lesson or a block.

## Two words that were used for one thing

**A পর্যায় is a stage. A ধাপ is a step.** They were both ধাপ until
28 August 2026, so `ধাপ ২` was a stage and `আটটা ধাপ` inside
হাতেখড়ি was eight steps of one lesson, in the same school, on
pages that link to each other. A reader who had done "ধাপ ৩" could
not say which of the two they meant, and neither could the prose.

Every stage kicker is `পর্যায় N` now. A ধাপ is what a reader does
inside a lesson: an ordered thing with a first and a last. Nothing
else may be called either.

The stage SLUGS did not move and must not: `start`, `basics-1`,
`basics-2`, `basics-3` are in `learn-read` in real browsers and in
`public.progress` in real accounts, and the rule at the top of
"What a reader has read" in `CLAUDE.md` is the whole reason.

## The ladder, and what "developing over another" means

Four stages are written, 0 to 3, and they are one line rather than
four collections. Every lesson names what it needs in
`meta.needs`, as lesson ids, and `check-money.ts` fails on a
`needs` that points forward, at nothing, or at a lesson in a later
stage. So the ladder is a directed graph the checks can walk
rather than an order somebody remembered.

| | | |
| --- | --- | --- |
| পর্যায় ০ | `start` | হাতেখড়ি. Why, what for, how much risk, then the eight steps that end with money actually invested |
| পর্যায় ১ | `basics-1` | শব্দগুলো শিখুন. The vocabulary, at `/money/terms/`, one page per word |
| পর্যায় ২ | `basics-2` | বাজারটা পড়তে শিখুন. Why prices move, what exists, who runs it, how to read the screen |
| পর্যায় ৩ | `basics-3` | নিজে যাচাই করুন. Where the data is, how to read the statements, how to reach a decision and write it down |

Stages 4 and up (`inter-1`, `inter-2`, `inter-3`, `advanced`) are
in the ladder, marked `soon`, and deliberately not written yet.

**`/money/terms/` is not a mistake.** `basics-1` carries a `base`
because its pages were the site's glossary for a year before the
school had a stage, and its progress ids are bare slugs for the
same reason: `share`, not `basics-1/share`. Both are in
`shared/schools.ts` as a named branch and in
`shared/curricula/money.ts` beside it, and `check-schools.ts`
computes each one twice and fails if the two spellings part.

## A lesson is two bodies, some blocks and a number of stars

Four columns of `school_lessons` carry a lesson now, not two:

| | |
| --- | --- |
| `body` | the Bangla prose. The learning language, and the one a reader gets with JavaScript off |
| `body_en` | the same lesson in English. Not a translation of the sentences: the same lesson, said the way somebody would say it in English |
| `blocks` | JSON. The interactive and drawn parts, said once and shown in both languages |
| `meta.stars` | 1 to 5, how much this lesson matters |

**`body_en` and `blocks` are columns rather than `meta` because of
one query.** `stagesOf()` reads `meta` for every lesson of a school
to draw a ladder, and a ladder page does not need a second body: 28
English lessons in `meta` would be a third of a megabyte on a page
that shows titles. Columns are not selected there and are selected
by `lessonOf()`, which is the one place a lesson's words are
wanted.

`meta.stars` IS in `meta`, because the ladder wants it: a card says
how much a lesson matters before a reader opens it.

### Both languages ship, and the stylesheet chooses

The same arrangement `next/components/diet/lang.tsx` explains at
length, for the same reason: a component that read the preference
and returned one language would render Bangla on the server and
English in the browser, which is React error #418 and a page that
discards itself. So both bodies are in the markup and
`@layer lesson` shows one, keyed on `data-read-lang`.

**`data-read-lang` is set from `tool-lang`, which is the key the
calculators have written since before there were accounts, and it
defaults the other way.** A calculator with no preference stored
opens in English; a LESSON with no preference stored opens in
Bangla, because Bangla is what this school teaches in. One key,
two defaults, and both of them are the honest answer for the thing
they open:

```js
d.setAttribute("data-read-lang", l === "en" ? "en" : "bn");
```

`null` and `"bn"` both give Bangla. Only an explicit English
choice gives English.

### The two bodies must have the same blocks in the same order

A block is mounted from the prose with an empty div:

```html
<div class="mount" data-mount="pe-lab"></div>
```

`lesson/body.tsx` splits each body on those markers and
interleaves the blocks between the pieces, so a block is rendered
ONCE and the prose around it twice. That only works if both bodies
carry the same mount ids in the same order, and
`check-money.ts` fails when they do not rather than letting a
block vanish in one language.

A mount is always a top level element of the body. One inside a
`<ul>` would be split out of its list and the list would close
early.

## The blocks

`shared/lesson.ts` holds the types and the validator;
`next/components/lesson/` holds the rendering, one file per kind.
Every string a reader sees is `{ bn, en }`, so a block says
itself in both languages from one definition.

| kind | what a reader does |
| --- | --- |
| `quiz` | answers, and is told why each option is right or wrong |
| `order` | drags six things into the order they happen in |
| `match` | pairs a word with what it means |
| `bins` | drops things into two or three buckets |
| `lab` | moves sliders and watches a number and a chart move |
| `chart` | reads a figure and hovers a point |
| `figure` | reads a drawing: a flow, a stack, a matrix, a scale, a cycle, a timeline, or callouts over a mock screen |
| `reveal` | commits to a guess, then sees the answer |
| `compare` | reads two or three things side by side |
| `spot` | finds what is wrong in an excerpt |
| `drill` | does something outside the page and ticks it off |

**A LINE has points and a BAR has bands, and one scale was doing
both.** `x(i)` spreads `i` from the left edge to the right edge,
which is what a line drawn through points wants and is wrong for a
bar: centring a bar on a point puts a third of the first band left
of the axis and a third of the last band past the drawing. With
`overflow: visible` on the plot, which is there so a stroke at the
top is not sliced in half, that is a bar painted outside its own
chart, over whatever is beside it. Measured against the committed
snapshot: 22 charts, by up to 107 pixels on a laptop. `band(i)` is
the second scale and bars use it.

The left half of it was hidden by a `Math.max(0, left)` that
pinned the first bar to the axis and left its width alone, so that
bar was the right size in the wrong place, which is the shape of
thing that gets read as a design decision.

`next/lesson.test.ts` asks this of every block kind and of every
block in the snapshot, at 360px and at 1280px, and it MEASURES
PAINT rather than scroll: an SVG's visible overflow is ink, and
ink does not widen a scroll container, so a `scrollWidth`
comparison passed against all 107 of those pixels.

**`lab` is the only kind that computes**, and its arithmetic is in
`shared/lesson-labs.ts` under a named model, never in the block's
JSON. A formula in a database row is code in a place nothing
typechecks, and the rule in `CLAUDE.md` about a calculator's
arithmetic needing an app release is the same rule: the model is
code, the inputs are data.

**`figure` is how a lesson gets a picture.** Photographs of a
market teach nothing; a drawing of what happens between pressing
Buy and the share landing in a BO account teaches the lesson. So
figures are drawn from data by `lesson/figure.tsx` rather than
uploaded, which also means every one of them is right in both
themes, scales to a phone, and can be read by a screen reader from
the same data that draws it.

**A block is data, so it reaches the Android app with no release.
A new KIND is code and needs one.** That is the table in
`CLAUDE.md`, one level down.

## Where the words come from, and where they live

In D1, like every other lesson on this site, written through
`/studio/?lessons` and read by the route. `scripts/money/` holds
what SEEDED those rows and is not a second copy anything reads:
nothing imports it at runtime, no builder reads it, and a
correction typed there changes nothing until it is seeded again.
It is kept for the reason `archive/schools/` is kept: whoever has
to check the replacement needs to be able to read the original.

```sh
node scripts/seed-money.ts --check          # validate, touch nothing
node scripts/seed-money.ts --out money.sql  # the rows, as SQL
node scripts/seed-money.ts --snapshot       # refresh content/schools.backup.json
```

`--out` and never a `>` redirect, for the reason
`import-schools.ts` gives at length: the shell creates the file
before node runs, and an empty file imports perfectly.
`--out-dir` writes the same SQL in numbered chunks instead, each
a whole number of lessons, for applying it through the HTTP API,
which has a request limit where wrangler does not.

**The file ends in three DELETEs and the order is the point.**
The upserts alone leave a rung behind for every lesson that has
been renamed or dropped: `basics-2` held twenty-one lessons under
the old ladder and holds twenty-five different ones under this
one, so without the prune that stage would draw forty-odd. It
runs last, after every upsert, because a run that stops halfway
should leave a ladder with too much on it rather than too little.

**Seeding it is a workflow, not a terminal.**
`.github/workflows/seed-money.yml`, dispatched by hand, and the
sibling of `import-schools.yml` for exactly the reasons the note
at the top of that file gives: the two commands have failed twice
here for reasons that had nothing to do with the SQL. It
validates, refuses a file with too few queries in it, writes, and
then asks the database what is in it, because a tick on a job
that wrote nothing is what wasted those two attempts.

## The checks

```sh
node scripts/check-money.ts    # everything below
```

- every lesson has stars, and they are 1 to 5
- every lesson has both bodies, and neither is a stub
- both bodies mount the same blocks in the same order
- every mount has a block and every block is mounted
- every block is a kind that exists, with the fields that kind needs
- every `lab` names a model `shared/lesson-labs.ts` implements
- every `figure` names a shape `lesson/figure.tsx` draws
- `meta.needs` points backwards, at lessons that exist
- every class used in a body survives both sanitisers
- a mount is a top level element
- no block's words hold markup, because a block is rendered as text

`check-schools.ts` already fails if the ladder and the snapshot
disagree about which lessons exist. `check-css.ts` already fails
if a class is allowed into a body and styled nowhere. Neither
needed changing for this.
