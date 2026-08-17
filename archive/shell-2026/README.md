# The shell that was, August 2026

Eight modules, retired in one change: the money school stopped being
the site's second half and became one entry in the skills list, and
the header bar that had carried that split became a rail down the
left of every page.

Kept rather than deleted for the reason `archive/README.md` gives:
somebody has to be able to check that the replacement really does
what these did.

| File | What it was | What does it now |
| --- | --- | --- |
| `hub.js` | `/learn/index.html`: the ladder, the resume card, the progress rings, the contents index, all drawn in the browser | `next/components/school-hub.tsx`, rendered on the server from the rows |
| `stage.js` | the bar and the "continue" button on `/learn/<stage>/index.html` | `LadderMeter` and `Resume` in `next/components/progress.tsx` |
| `contents.js` | the filter and the ticks on `/learn/contents.html` | `next/components/school-contents.tsx` |
| `progress.js` | the money school's ticks and bookmark, read against `curriculum.js` in the browser | `next/lib/progress.ts`, read against the ids the route rendered |
| `progress.test.mjs` | 20 checks of the above | the ids it guarded are the server's now; the storage keys it pinned are unchanged and named in `progress.ts` |
| `skills.js` | drew the cards on `/skills/index.html` after paint, from `SKILLS` in `content.js` | the route renders them from `next/lib/nav.ts` |
| `home.js` | the home page's welcome-back panel, recent list, news strip, feature and case cards | the front door is one screen and does not scroll; the one piece of it worth keeping is `next/components/door.tsx` |
| `recent.js` | recorded every page visited, for the home page's "recently read" list | nothing. That list is gone with the panel that held it |

Three things left `aab/app.js` in the same change and are in its git
history rather than here, because none of them was a file of its
own: `buildMenu()` and `initMenu()`, the overlay menu; `skillsPanel()`
and `initSkillsNav()`, the hover panel under the header's "Skills"
link; and `initHeaderHeight()`, which measured a header that no
longer exists.

## What did not move

`aab/learn/learn.js` stayed. It is the modal term reader, the thing
that makes a `.term` link open the glossary in a panel instead of
navigating away, and it has nothing to do with the hub it happened
to be named after. `aab/learn/curriculum.js` and
`aab/learn/icons.js` stayed too: forty files in `aab/` still import
one of the four curricula, and the icons are the source
`scripts/build-school-icons.mjs` copies into `next/`.
