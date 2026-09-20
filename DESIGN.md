## Playful shared surfaces, September 2026

The homepage's tactile direction now carries through the shared design system. Subject, tool and portfolio entrances have accent-tinted light and a raised edge. Public school hubs have a decorative book emblem built from the subject's existing icon. Navigation cards use striped rails, tilted icon tiles and small label shadows; information cards remain still. Portfolio chart panels have a soft accent glow. Progress retains its real values and adds a striped fill, while the current stage and completed-stage labels are easier to distinguish.

The treatment follows each section's shared accent and existing light/dark tokens. Small-screen emblems shrink, hover is pointer-only, and reduced-motion settings suppress added movement. No external assets, scripts, dependencies or storage changes are introduced. Long-form lesson text and calculator logic retain their existing layout and behavior.

## Playful learning shelf, September 2026

The homepage welcome now uses a deep violet ground, a mint action and a lavender heading. A tactile subject shelf takes its colours from the shared navigation and its bar heights and lesson counts from the actual curricula. Stripes, tilted free labels and raised icon tiles bring the reference image into the library without inventing performance scores. Each bar links directly to its public subject. The starting guide remains below the welcome, and course discovery keeps its search and filters.

Hover lifts are brief and disabled for reduced motion. The illustration requires no client JavaScript, external images or new dependencies. Course card icons reuse the raised tile treatment. Reading pages keep their existing palette and typography.

## Learner discovery refresh, September 2026

The learning entrance now leads with a Bangla welcome, an explicit three-step starting guide and public subject discovery. Subject cards reuse the navigation table, offer bilingual search and goal filters, show real lesson totals, and keep free access visible. Existing account progress remains the source of truth. Private third-party courses stay gated.

The shared corner scale is now 6/10/16/24px, and paper uses a cool neutral hue. Solid subject-colour card headers and a green welcome panel make browsing more energetic. Reading typography, subject identities and dark mode remain available. No new dependencies, storage keys, or external images are required.

# The look, and what is still wrong with it

`ARCHITECTURE.md` is where things go. This is what they look like
when they get there, and the list of what does not yet.

**None of this is fixed.** It describes today's look so a change
is made on purpose rather than by drift. A better idea is welcome:
change the tokens at the top of `next/styles/site.css`, keep to one
scale, keep the contrast, keep a class meaning one thing, and then
rewrite this file to say what the look is now.

## The language

**Plain.** A surface is a ground and an edge: `--panel` or
`--paper-sunk`, `--hairline` round it, one of the corner tokens.
`<Surface>` is the component. Nothing blurs, nothing is textured,
nothing turns towards the pointer and nothing animates because the
reader scrolled. The bar, a menu and the palette float on
`--shadow`; a card under the pointer takes `--shadow-lift` and a
firmer border; everything else sits flat on the page.
`scripts/check-plain.ts` lists a blur, a perspective, a
view-driven animation or a `data-glow`, so one that comes back
comes back on purpose; it fails nothing.

**Paper, by colour alone.** The page carries a trace of the
section's accent through `--paper`, `--panel` and `--hairline`, so
the paper on a German page is faintly blue without a texture
saying so.

**Corners are a ladder, never a number, and the shape is square.**
`--radius-xs` 2, `--radius-sm` 3, `--radius` 4, `--radius-lg` 6.
`check-scale.ts` fails on a literal px radius. There is no pill: a
control and a row take `--radius-sm`, a card `--radius`, a field the
card's. A bullet, a slider's thumb and a ring are drawn at `50%`
because they are dots, not corners.

**Type is a book's.** Literata for the running text and the headings,
with optical sizing on; Inter on anything you press or type into; the
mono on labels. Bangla is Noto Serif Bengali in both roles.

**A strip of choices is one bar.** `.tabs` is a panel with a hairline
round it and the choices flat inside; the chosen one is the accent
solid. The bar holds still and the chosen panel drops in under it
(`[data-enter]`, one keyframe), whichever page's strip it is.

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

## Navigation and first impressions, September 2026

The homepage keeps both audience routes visible: Learn in Bangla and
Hire me / View my work. The rail puts its audience switch above the menu,
with native expandable Learning, Tools and Work groups. The current
section starts open; the other groups remain available by keyboard and
without JavaScript. Reading and Account stay directly accessible.

Secondary text has stronger contrast in both themes. Bangla rail labels,
form labels and hints use larger existing type steps; common labels and
buttons use sentence case with less letter spacing. Portfolio cards lead
with the question and takeaway, then contribution and method. Enquiries
include optional type and deadline fields, with guidance for each audience.
