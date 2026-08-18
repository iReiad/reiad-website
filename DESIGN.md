# The look, and what is still wrong with it

`ARCHITECTURE.md` is where things go. This is what they look like
when they get there, and the list of what does not yet.

## The language

**Glass, not flat.** A surface is a ground, a texture, a lit top
edge and an edge colour, in that order. `--glass-bg`, `--sheen`,
`--pane-top` and `--pane-edge` are the tokens; `<Surface>` is the
component. A flat fill is what a surface looks like when one of the
four is missing, which is what every surface on this site looked
like until 18 August 2026, when `--weave` and `--sheen` turned out
to be named by the Tailwind theme and declared nowhere.

**Paper, not screen.** `--weave`, `--grain` and `--sheen` are the
three textures. Weave is a cloth for a sunk ground, grain is a
stipple for a large flat area that wants tooth, sheen is the lit
fall down the top of anything raised. All three take the page's
accent through `--tex-ink`, so the paper on a German page is
faintly blue.

**Corners are a ladder, never a number.** `--radius-xs` 5,
`--radius-sm` 12, `--radius` 18, `--radius-lg` 24, `--radius-pill`.
`check-scale.mjs` fails on a literal px radius. A row and a control
are pills; a card is `--radius`; a field is the card's, because a
box you type a paragraph into wants a corner and not a capsule.

**The page wears its section's colour.** `--accent` is set on
`<html>` from the one table in `next/lib/nav.ts`, and every
component reads it. `check-accents.mjs` fails on any rule that
names one of the seven directly. Twenty golds survive because they
mean warn, risk and not-written-yet rather than a section.

## What is still wrong, in the reader's words

Collected 18 August 2026, from screenshots of the live site. Each
is a task; the numbers are the task list.

| | |
| --- | --- |
| **#14** | The crumb row on a course page sits against the window edge. Reported first, still there. `crumbs.js` mounts into `main > .wrap` and falls back to bare `main`, which has no inset. `ui/crumbs.tsx` is written and not wired. |
| **#15** | "Mark complete & continue" and the chip beside it are different heights. One control height should govern both. |
| **#22** | "text boxes look disgusting everywhere, it should be the best looking thing here." Then: "should feel very integrated, glassy look and a paper like texture." There are at least four implementations. |
| **#25** | The audience switch belongs at the bottom of the rail, not in the top bar. The top bar should then be real navigation across every page. |
| **#26** | The account page's tab row "isn't our design language at all". It should be a `ui/tabs.tsx` the course player and the tools tab set also use. |
| | The preference cards on the account page want the glass treatment. |
| | "all around the pages, they are places slightly off." |

## Where the drift comes from

Every one of the above is the same shape of problem: a control that
exists more than once. A button is `.btn` in the stylesheet and
`<Button>` in the library and `.pv-btn` in a preview harness, and
they disagreed about their own corner radius until this was
written down. A stat is `.tile`, `.stat` and `<StatTile>`. A text
box is `ui/field.tsx`, the input rules in `@layer components`, the
Studio's own, and `textarea[data-schrift]` in the practice book.

`scripts/check-components.mjs` counts the hand-written ones and
only lets the number fall. It stood at 245 and is at 223. That
number reaching zero is what "the design is consistent" means
here, and nothing else does.
