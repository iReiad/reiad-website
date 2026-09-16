# The look, and what is still wrong with it

`ARCHITECTURE.md` is where things go. This is what they look like
when they get there, and the list of what does not yet.

## The language

**Plain.** A surface is a ground and an edge: `--panel` or
`--paper-sunk`, `--hairline` round it, one of the corner tokens.
`<Surface>` is the component. Nothing blurs, nothing is textured,
nothing turns towards the pointer and nothing animates because the
reader scrolled. The bar, a menu and the palette float on
`--shadow`; a card under the pointer takes `--shadow-lift` and a
firmer border; everything else sits flat on the page.
`scripts/check-plain.ts` fails a blur, a perspective, a
view-driven animation or a `data-glow` coming back.

**Paper, by colour alone.** The page carries a trace of the
section's accent through `--paper`, `--panel` and `--hairline`, so
the paper on a German page is faintly blue without a texture
saying so.

**Corners are a ladder, never a number.** `--radius-xs` 5,
`--radius-sm` 12, `--radius` 18, `--radius-lg` 24, `--radius-pill`.
`check-scale.ts` fails on a literal px radius. A row and a control
are pills; a card is `--radius`; a field is the card's, because a
box you type a paragraph into wants a corner and not a capsule.

**The page wears its section's colour.** `--accent` is set on
`<html>` from the one table in `shared/nav.ts`, and every
component reads it. `check-accents.ts` fails on any rule that
names one of the seven directly. Twenty golds survive because they
mean warn, risk and not-written-yet rather than a section.

## What is still wrong, in the reader's words

Each is a task and the numbers are the task list. A number is
never reused, so a task that is done is struck off rather than
renumbered.

| | |
| --- | --- |
| **#15** | "Mark complete & continue" and the chip beside it are different heights. One control height should govern both. |
| **#22** | "text boxes look disgusting everywhere, it should be the best looking thing here." There are at least four implementations, and the plain design wants one: a panel, a pane edge, a real focus ring. |
| **#25** | The audience switch belongs at the bottom of the rail, not in the top bar. The top bar should then be real navigation across every page. |
| **#26** | The course player still has no tab set on `ui/tabs.tsx`. The account page and the tools hub are on it. |
| | "all around the pages, they are places slightly off." |

## Where the drift comes from

Every one of the above is the same shape of problem: a control
that exists more than once, and the copies disagree about their
own corner radius. A button is `.btn`, `<Button>` and `.pv-btn`.
A stat is `.tile`, `.stat` and `<StatTile>`. A text box is
`ui/field.tsx`, the input rules in `@layer components`, the
Studio's own, and `textarea[data-schrift]` in the practice book.

`scripts/check-components.ts` counts the hand-written ones and
only lets the number fall. It is at 16. That number reaching zero
is what "the design is consistent" means here, and nothing else
does.
