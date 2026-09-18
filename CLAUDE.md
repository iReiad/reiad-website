# reiad.co.uk, house rules

This file is what an agent reads on every turn, so it is short on
purpose. Two more files, and that is the whole of the reading:

- **`AGENTS.md` first, once per task.** Then search `MAP.md` for the feature being changed. The map is generated from the files themselves:
  every route, every file with the one sentence at the top of it, every
  storage key, the menu, the checks. It says where everything is, so a
  file is opened only to change it. Do not read the whole map.
- **`HANDBOOK.md` by heading, when a rule's reason is needed.** The
  rules with their reasons and the incidents behind them, 2,300 lines.
  **Never whole.** Search for the heading named beside the rule below.

## Punctuation: no em dashes. Ever.

Never write U+2014, in prose, code, comments, Bangla, commit messages or
PR bodies. A colon, a full stop, a pair of commas or brackets instead.
En dashes in number ranges are fine. `scripts/check-dashes.ts` reads
every tracked file. Handbook: "Punctuation".

## The hard rules

- **Nothing new is built the old way.** A page is a route under
  `next/app/`; interface is a component under `next/components/` or
  `app/src/`. No new `aab/*.html`, no new module in `aab/src/`, no new
  `functions/**/*.js`. `scripts/closed-set.json` may only get shorter.
  Handbook: "React or a route".
- **An address has no `.html`**, except an article and a school lesson,
  whose suffix is part of the slug. A route needs three things to agree:
  the directory under `next/app/`, `run_worker_first` in `wrangler.toml`
  and `NEXT_ROUTES` in `worker.js`. Handbook: "An address has no .html".
- **Convert what you touch.** A hand-written `aab/*.js` becomes
  `aab/src/*.ts`; a `functions/**/*.js` becomes `.ts`; a `<style>` block
  becomes utilities. Real types, no `any`, no `@ts-expect-error`. Update
  `MIGRATION.md` in the same commit. Handbook: "Convert what you touch".
- **Never edit a built file.** `aab/*.js` with a source in `aab/src/`,
  `aab/fallback.css`, `aab/studio/**`, `aab/content.js`, the four
  `curriculum.js`, `next/lib/school-icons.ts` and `shared/courses.data.json`
  are outputs. Edit the source and rebuild. Handbook: "Where a lesson's
  words live", under "Generated pages are generated".
- **A precached file that changed needs `VERSION` bumped in `aab/sw.js`**,
  a changelog line, and `node scripts/check-sw.ts --update`.
- **Never rename a storage key.** `learn-read`, `deutsch-read` and the
  rest are in real browsers and real accounts; renaming loses somebody's
  ticks. A new key gets a row in `shared/storage.ts`. Handbook: "What a
  reader has read".
- **Never rename an applied migration.** The filename is a database
  row. Handbook: "A migration's filename is a fact".
- **Numbers and lists come from the data.** A count is `data-count`
  over `COUNTS` in `shared/content.ts`; a list of things that exist
  elsewhere is built from the shared table. Handbook: "Numbers and
  lists come from the data".
- **A Next route loads a module through `<SiteScripts>`**, never a
  `<script type="module">` in JSX, and an inline script uses
  `dangerouslySetInnerHTML`. Handbook: "A page rendered by Next loads
  its modules through one component".
- **`shared/` edits are invisible to `next/` until the copy is
  refreshed:** `rm -rf next/node_modules/@reiad/shared && (cd next && npm
  install)`. Handbook: "What more than one runtime has to agree on".
- **Comments carry the constraint, not the story.** What will fail,
  what must not be renamed, why an order matters. One or two lines. A
  comment that names a file has to name one that exists
  (`check-pointers.ts`).
- **Bangla is the learning language, English the working one.** Plain
  Bangla, short sentences, no transliterated jargon.

## The look today, and it is not fixed

Today: plain surfaces (a colour, a hairline and a corner), square with
the edge taken off (four corner rungs, no pill), set like a book
(Literata for text and headings, Inter on controls, the mono on labels,
Noto Serif Bengali for Bangla), one tab bar (`.tabs`, a contained strip
whose chosen tab is the accent solid; the bar holds still and the panel
drops in on `[data-enter]`), two kinds of card (`<GoCard>`, `<InfoCard>`),
and a page wears its section's colour from `shared/nav.ts`.

**A new style is welcome.** Nothing above is a rule; it is a description
of what is there. A model with a better idea changes the tokens at the
top of `next/styles/site.css` and says what it did in `DESIGN.md`. What
the checks hold is not taste: `check-contrast.ts` (readable at its
size), `check-scale.ts` (one scale, however it is set), `check-accents.ts`
(a section's colour comes from the one table), `check-css.ts` (a class
means one thing), `check-components.ts` (a control exists once). Change
a token's value freely; do not add a fifty-first size beside the scale.
`scripts/check-plain.ts` is a list of what costs paint time, run by
hand, and it fails nothing.

## Working economically

The checks exist because each caught something that shipped broken, and
they are fast. What is slow is running the browser suites for a change
that could not have touched them. So:

```sh
node scripts/check-all.ts --changed     # only the checks whose inputs changed, against origin/main
node scripts/check-all.ts               # everything, about 18s: run this once before the PR
```

| you touched | run, beyond `--changed` |
| --- | --- |
| only `.md` files | nothing else |
| `next/styles/` | `node scripts/build-fallback.ts`, then `--changed` |
| a calculator or `aab/src/tools/` | `node next/interactive.test.ts` (needs `npx next build` and a browser) |
| a lesson block, a lab or a sheet | `node next/lesson.test.ts` |
| `next/lib/progress.ts` or a tick | `node next/tracking.test.ts` |
| `aab/src/sync.ts` or `saved.js` | `node aab/sync.test.ts` (starts its own server) |
| `aab/editor.js` or the Studio | `node aab/editor.test.ts`, `node app/studio.test.ts` after `cd app && npm run build` |
| `/account` | `node next/account.test.ts` |
| `functions/` | the `scripts/*.test.ts` for that endpoint, and `check-admin`, `check-headers`, `check-api` run under `--changed` |
| `next/components/research/` | `node next/research-studio.test.ts` |
| `shared/` | refresh the copy (above), then `--changed` |

Every browser test skips out loud when it cannot run; a skip is not a
pass, and it is not a reason to run the others. The full list, with what
each one guards, is in the handbook under "Before deploying". CI runs
every check on every push, so a scoped local run never lowers the bar.

While working: `MAP.md` says what a file is for, so open one only to
change it, and read its relevant lines rather than the whole file.
Search the handbook by heading rather than reading it. Do not re-run a
check whose inputs have not changed since it last passed. `MAP.md` is
rebuilt by `node scripts/build-map.ts` and the generated stage fails
when it is stale, so a new file needs the one-line `name.ts: purpose`
header the map is built from.

## Ship it, and merge it yourself

Open the pull request, wait for the checks, mark it ready and squash
merge it. **Nobody is asked and nobody is waited for**: a green pull
request that sits is work that is not shipped. Three green checks is not
green: `checks` is the fourth and the one that matters. A red check is a
reason to fix and push again, never to merge anyway. Before opening,
look at the open pull requests, not just `main`. The deploy runs from
`main` on its own. Handbook: "Ship it", "Before opening a pull request",
"Merging".

## Where things are

| | |
| --- | --- |
| `MAP.md` | where everything is, generated: read first |
| `ARCHITECTURE.md` | where things go |
| `DESIGN.md` | what they look like today, and what is still wrong |
| `HANDBOOK.md` | every rule with its reason, by heading |
| `MIGRATION.md` | what is still on the old system |
| `ANDROID.md`, `DIET.md`, `MONEY.md`, `RESEARCH.md`, `ROUTINE.md` | one plan each |
| `shared/README.md` | the twenty files three runtimes agree on |
| `scripts/check-all.ts` | the list of checks, and the only list |
