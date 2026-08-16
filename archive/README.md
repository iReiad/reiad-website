# archive

Pages this site used to serve, kept because they are the record of
what the thing that replaced them had to do, and deleted from the
deploy because two of anything is how the two drift apart.

**Nothing in here is uploaded.** The site deploys by uploading
`aab/`, so a file that has moved out of that directory is off the
site the moment the next deploy runs. `_redirects` sends the old
addresses to the new ones, so a bookmark or an old link still
lands somewhere sensible rather than on the 404 page.

**Nothing in here is imported, either.** If a module in `aab/`
still needed one of these files, the file would not be in here;
that is the test for whether something is ready to be archived,
and it is worth applying literally rather than generously.

## What is here, and what replaced it

| File | Replaced by | When |
| --- | --- | --- |
| `studio.html`, `studio.js` | `aab/studio/`, built from `app/src/studio/**` | 16 August 2026 |
| `desk.html`, `desk.js` | `aab/desk/`, built from `app/src/**` | 16 August 2026 |

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
