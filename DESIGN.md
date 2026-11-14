# Punk carnival, November 2026

The whole interface now uses the selected punk-carnival direction: acid yellow, hot pink, cobalt, mint and orange; dark ink; hard offset shadows; rippled frames, torn paper, scribbled controls and jagged badges. This replaces the soft, rounded clubhouse as the current design. The earlier notes below are historical.

## One edge system across the site

Four SVG border-image recipes draw wave, tear, scribble and burst edges. They are data assets in the shared stylesheet, use nine-slice borders to keep edge detail at different sizes, and never mask or intercept content. The shared Surface component exposes an optional edge variant while retaining its material and accent behavior. The structural corner tokens are zero: a plain rounded box is no longer the interface's default.

The header, sidebar, audience switch, footer, menus, cards, forms, tabs, toolbars, badges, native check/radio controls, slider thumbs, and shared tool panels use the same visual vocabulary. Borders remain in their owning cascade layers. Utility-authored account panels and browser-generated controls inherit the recipes too. The homepage adds a torn slogan strip and a jagged curiosity sticker; they are decorative and hidden from assistive technology.

## Disorder outside, readable work inside

The approved boundary is wild framing with readable content. Bengali shaping, body paragraphs, equations, tables, charts and editable text retain stable orientation and sufficient contrast. Native control semantics, account permissions, private-course gates and stored progress remain unchanged. Staggered cards and tilted stickers use deterministic CSS, not randomness.

The page has a light halftone ground; high-intensity panels carry stripes and contrasting paper frames. Small controls remain aligned with their actual hit areas, and the fixed header and drawer retain their layout coordinates. No new dependency, external illustration, continuous animation or scroll effect is introduced. Reduced motion suppresses interaction movement; forced-color mode restores native controls and plain high-contrast edges.

## Validation contract

The new palette has explicit contrast pairs in the existing color checker, in both themes. Browser regression coverage checks framed controls for hit testing, visible keyboard focus, stable content interiors, responsive overflow and reduced motion. Review the main learning, tools, account, portfolio, routine, diet, research, contact and fallback surfaces in both themes at phone, tablet and desktop sizes. Build the production Worker, regenerate affected fallback output, bump the service-worker cache, and verify the deployed build before calling the rollout complete.

# Learning clubhouse, November 2026

The site should feel like an invitation to try something, especially for a young Bengali reader arriving on a phone. Warm paper, an inky violet welcome, lime actions, generous corners and tactile subject tiles replace the muted dashboard feel. This is a shared visual system across learning, tools, portfolio, account and static fallback pages, not a separate homepage skin.

## Research and decisions

Reviewed on 14 November 2026:

- [Duolingo design](https://design.duolingo.com/): approachable learning, recognizable visual identity and deliberate interaction craft. Adopt a clear action hierarchy and physical button feedback, without copying its mascot or branding.
- [Headspace](https://www.headspace.com/): welcoming language and topic-led discovery make a broad library feel approachable. Use reassuring copy, rounded shapes and subject-colored entry points.
- [Brilliant](https://brilliant.org/): its current homepage emphasizes visual interaction, clear starting points and learning by doing. Keep real course data and functioning tools central rather than adding decorative metrics or invented rewards.
- [WCAG: animation from interactions](https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html): eliminate unnecessary motion and honor user preferences. Limit movement to brief pointer interactions and suppress it with reduced motion.

These are qualitative design references, not evidence of a measured conversion lift for this site. Forum opinions are not a substitute for checking the actual Bengali learning journey.

## Implementation plan and scope

1. Keep the existing shared navigation, public course data, access gates and progress keys. Change presentation without changing the curriculum, calculator math, account semantics or private catalog visibility.
2. Revise the shared corner scale to 8/14/24/36px and warm the paper hue. Retain the seven subject accents, light/dark surface hierarchy and readable color pairs.
3. Make primary, secondary and filter buttons feel pressable with stronger edges, a short raised shadow and a settled pressed state. Preserve keyboard outlines, disabled states and tap targets.
4. Rebuild the welcome as a violet invitation beside a two-by-two subject playground. Each tile links to a real public school and carries its actual lesson count. Decorative marks are hidden from assistive technology.
5. Carry the direction into navigation, subject cards, course hubs, tool entrances, portfolio cards, footer and shared forms. Keep long-form reading type and dense calculator/data layouts usable.
6. Check mobile and desktop layouts, light and dark themes, keyboard navigation, search/filter reset, reduced motion, subject navigation and calculator interaction. Run repository checks, regenerate fallback CSS and retire the previous service-worker cache.
7. Build the production application, inspect the complete diff, push a PR, wait for required checks and merge only when green. Verify the public deployment before reporting completion.

## Acceptance criteria

The first screen has an obvious learning action and a recognizable visual identity. Every subject remains discoverable, cards and buttons look related across routes, mobile has no horizontal page overflow, dark mode stays readable and reduced-motion readers get stable controls. Real progress, account access and calculator behavior continue to work. No new runtime dependency, remote image or client animation library is required.

The previous design notes below record earlier decisions; the corner scale and shared treatments above describe the current direction.

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
