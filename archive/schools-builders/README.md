# The school builders, and the check that watched them

TRANSITION.md Stage 11.7, 16 August 2026.

## What is in here

| File | What it wrote | Why it is here |
| --- | --- | --- |
| `build-lessons.mjs` | `/learn/<stage>/index.html`, `/learn/<stage>/<slug>.html`, `/learn/contents.html` | Every page it wrote is a Next.js route now, rendered from the rows the Studio writes. |
| `build-quran.mjs` | `/quran/<dhap>/index.html`, `/quran/<dhap>/<slug>.html` | The same. |
| `check-schools-built.mjs` | nothing; it rebuilt all four schools into a temporary directory and compared 229 pages against the ones committed in `aab/` | There are no committed pages left to compare. |

`build-deutsch.mjs` and `build-english.mjs` are **not** here. They are
still in `aab/`, cut down to the one thing they still write: the
practice books. A book is thirty, sixty or ninety days written out in
full, it is the same for every reader, and none of it is in the
database, so it is still a file and still generated.

## Why the check goes rather than being fixed

`check-schools-built.mjs` asked one question: does what the builders
write from the snapshot match what is committed in `aab/`? That was the
right question for as long as a lesson was a file, and it caught exactly
what it was written for: a generated page edited by hand, and a snapshot
refreshed without a rebuild.

Both of those failures need a committed page to happen to. There is not
one. The question it asked is now asked by `next/parity.test.mjs`, which
compares the route against the page the builder used to write, and by
`check-schools.mjs`, which compares the ladder in `curriculum.js` against
the ladder in the snapshot.

## What still watches the schools

- `scripts/check-schools.mjs`: the four `curriculum.js` modules and the
  snapshot describe the same ladder, and `shared/schools.js` and those
  modules compute the same URL, id and label for all 233 lessons.
- `scripts/check-next.mjs`: the 103 drawings and the five hand-written
  pages copied into `next/` still match what `aab/` has.
- `next/parity.test.mjs`: a lesson, a stage's ladder and the five
  hand-written pages each say what the page they replaced said.
- `aab/check-css.mjs`: reads the lesson prose out of
  `content/schools.backup.json` now, because that is where it is.
