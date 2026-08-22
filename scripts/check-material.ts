#!/usr/bin/env node
/* ============================================================
   check-material.ts: one design system, all around.

       node scripts/check-material.ts
       node scripts/check-material.ts --list   what is on it

   ---- what this is for ----

   `@layer glow` is the material: every button, chip, card and
   pane carries a light that follows the pointer, and four lists
   in that layer say which kind of glass each class is.

   Lists rot. The first version of the material reached exactly
   ONE of the 203 surface-like classes in this stylesheet, because
   it was scoped to an attribute that only components carry, and
   nothing failed. A design system nothing enforces is a design
   system that describes the day it was written.

   So this asks two questions, and both are about the WHOLE
   stylesheet rather than about the material layer alone.

   1. IS ANYTHING INTERACTIVE MISSING FROM THE SYSTEM?

      A class whose rule carries `:hover`, `:focus-visible`,
      `aria-pressed` or `cursor: pointer` is a thing a reader
      presses. It belongs to one of the four kinds, or it is in
      `NOT_A_SURFACE` here with the reason. There is no third
      option, and that is the whole point: the next control
      somebody writes fails this until it has been placed.

   2. WOULD THE MATERIAL TAKE A SURFACE'S OWN GRADIENT AWAY?

      A later cascade layer REPLACES a background-image rather
      than merging with one. So a class that is in a list AND
      paints its own gradient loses it silently: the page still
      renders, the element still has a background colour, and the
      thing that vanished is a wash nobody will think to look for.

      `--surface-image` is the way through, and this fails on a
      listed class that paints a gradient without setting it.
   ============================================================ */

import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CSS = readFileSync(join(ROOT, "next", "styles", "site.css"), "utf8");
const LIST = process.argv.includes("--list");

/* ---------- interactive, and deliberately not on the material ----------

   Keyed by class AND carrying a reason, for the same reason
   `GONE` in `check-pointers.ts` is keyed by two things: "this is
   a container" is a true sentence about several of them, and a
   NEW one is not covered by somebody else's entry.

   Most of these are ROWS of controls rather than controls. They
   match the interactivity test because a descendant hovers, and
   lighting the row instead of the thing in it is the one way this
   system reads as broken rather than absent. */
/* ---------- a modifier on a class that IS placed ----------

   `.btn-solid` is never rendered without `.btn`, so it inherits
   the kind rather than needing one. Keyed to its BASE rather
   than listed as an exception, so that taking `.btn` off the
   material fails all five of these instead of passing quietly. */
const VARIANT_OF = new Map<string, string>([
  ["btn-solid", "btn"],
  ["btn-soft", "btn"],
  ["btn-ghost", "btn"],
  ["btn-quiet", "btn"],
  ["btn-on-accent", "btn"],
  ["res-live", "res"],
  /* The chip's three tones. Never rendered without `.chip`: they
     are colour and nothing else, which is why they are variants
     rather than kinds. */
  ["chip-accent", "chip"],
  ["chip-warn", "chip"],
  ["chip-danger", "chip"],
]);

const NOT_A_SURFACE = new Map<string, string>([
  ["social", "a <ul> whose <a> children ARE the pills. The hover is on them, "
             + "not on the list, and the material on the list drew a rectangle "
             + "round the whole group inside the card that already holds it."],
  ["chip-row", "a row of chips. The chips light, the row does not."],
  ["seg", "a segmented control's frame. Its buttons are `.chip`."],
  ["segmented", "the other segmented frame, whose buttons are its own."],
  ["driver-group", "a row of `.driver` sliders."],
  ["preview-controls", "a toolbar of buttons."],
  ["fig-bar", "the figure toolbar, which is a row of icon buttons."],
  ["reader-bar", "the reader panel's bar, holding two icon buttons."],
  ["tool-inputs", "a form's frame."],
  ["prev-next", "a pager. The two links in it are `.btn`."],
  ["page-toc", "a table of contents, whose entries are links in prose."],
  ["fin-table", "a table with hoverable rows. A lit table row is a lit row."],
  ["ref-details", "a `<details>`, whose summary is the control."],
  ["csv-file-label", "the label IS the control and is `<ButtonLabel>` now, which"
    + " carries data-glow. The class is only its cursor."],
  ["grid-cell", "a sensitivity heatmap cell. It paints its own"
    + " repeating-linear-gradient when invalid, and it is a table cell rather"
    + " than something anybody presses."],
  ["crumbs", "the trail's row. `.crumb-step` is the control in it."],
  ["contact-form", "a form, whose fields and button are the controls."],
  ["signin-form", "the same."],
  ["subscribe-form", "the same."],
  ["save-scenario-row", "a row holding a field and a button."],
  ["faq", "a list of `<details>`."],
  ["soft", "a text colour used on hover inside other things."],
  ["kept-body", "the body of a `.kept-row`, which is the surface."],
  ["desk-search", "a field. Fields are `<Field>` and have their own focus ring."],
  ["notion-search", "the same."],
  ["topic-field", "the same."],
  ["paste-area", "a textarea. Same reason."],
  ["timeline", "a list with hoverable entries."],
  ["comment-box", "a form."],
  ["news-window", "the research window's frame."],
  ["palette-foot", "the palette's footer, holding hints."],
  ["shortcut-list", "a list of key hints, which are not pressable."],
  ["toast", "a message that appears and goes. Nothing presses it."],
  ["signin", "the sign-in panel's frame."],
  ["account-btn", "the account button in the bar, which renders `.top-btn`."],
  ["audience-switch", "the switch's frame. `.audience-opt` is the control."],
  ["tree-stages", "a list. `.tree-link` is the control."],
  ["reader-skeleton", "a loading placeholder."],
  ["skip", "the skip link, which is invisible until focused and must stay so."],
  ["versus", "a comparison table."],
  ["live-key-grid", "a grid of fields."],
  ["live-remember", "a checkbox row."],
]);

/* ---------- reading the stylesheet ---------- */

const bare = CSS.replace(/\/\*[\s\S]*?\*\//g, "");

/** Every top-level rule of a layer, as [layer, selector, body]. */
function rules(): Array<[string, string, string]> {
  const out: Array<[string, string, string]> = [];
  for (const m of bare.matchAll(/@layer ([a-z]+)\s*\{/g)) {
    const layer = m[1];
    let depth = 0;
    let end = m.index! + m[0].length - 1;
    for (let i = end; i < bare.length; i += 1) {
      if (bare[i] === "{") depth += 1;
      else if (bare[i] === "}") { depth -= 1; if (!depth) { end = i; break; } }
    }
    const body = bare.slice(m.index! + m[0].length, end);
    let d = 0;
    let open = 0;
    let prev = 0;
    for (let i = 0; i < body.length; i += 1) {
      if (body[i] === "{") { if (!d) open = i; d += 1; }
      else if (body[i] === "}") {
        d -= 1;
        if (d) continue;
        const sel = body.slice(prev, open).trim();
        prev = i + 1;
        if (sel && !sel.startsWith("@")) out.push([layer, sel, body.slice(open + 1, i)]);
      }
    }
  }
  return out;
}

const all = rules();

/* The four lists, read out of the material layer rather than
   restated here. A second copy of the taxonomy in the file that
   checks it would be the drift this whole check exists to stop. */
const placed = new Set<string>();
for (const [layer, sel] of all) {
  if (layer !== "glow") continue;
  for (const m of sel.matchAll(/\.([a-z][a-z0-9-]*)/g)) placed.add(m[1]);
}

let bad = 0;

/* ---------- surface-shaped, and deliberately not glass ----------

   Question 7 asks whether anything with a ground and an edge is off
   the material. These are the answers that are "no, and here is
   why". Four reasons, and each one is a different argument:

   A MARK IS NOT A SURFACE. An icon disc, a tick, a flag, a live
   dot: a thing the size of a full stop, drawn to be read at a
   glance. A cut edge and a bottom bevel on a 14 pixel circle is
   detail nobody can resolve and a compositing cost per instance.

   A CELL IN A GRID IS THE GRID'S. A heat map is sixty cells in a
   block and a correlation matrix is a hundred. Glass on each is the
   cage the rail already taught us about, one order of magnitude
   worse: the BLOCK is the surface and the cells are its contents.

   A FILL IS WHAT IS IN A GROOVE, not another groove. It sits inside
   one, at the accent, and giving it its own cut edge would draw a
   channel inside a channel.

   A TEXT FIELD ANSWERS DIFFERENTLY. Its affordance is the caret and
   the focus ring, and a lit resting rim on a box you type into is a
   box that looks like a button. The element-level `input`,
   `select` and `textarea` rules are not classes and are not on the
   material either, so these three would be the exception rather
   than the rule. */

const NOT_GLASS = new Map<string, string>([
  /* A MARK, ten pixels tall and fourteen of them in a row: a
     bevel on one is detail nobody can resolve, and the strip
     reads as a calendar rather than as fourteen small panes. */
  ["dt-strip-day", "a mark: 10px tall, fourteen in a row, and a cut edge on one is invisible"],
  ["acc-ico",             "a mark: the account menu's 20px icon disc"],
  ["rail-ico",            "a mark: the rail's per-school icon disc"],
  ["acc-avatar",          "a mark: a round profile picture, and a bevel on a photo is a frame"],
  ["id-mark",             "a mark: the About page's initial, drawn at text size"],
  ["flag-mark",           "a mark: a stock check flag, red or amber, read at a glance"],
  ["palette-search-mark", "a mark: the highlight on a matched substring in the palette"],
  ["card-tick",           "a mark: the done tick in the corner of a lesson card"],
  ["gt-disc",             "a mark: the gate tile's icon disc"],
  ["gt-live",             "a mark: the gate tile's live dot"],

  ["heat-cell",  "a cell: one square of a year of days, and there are 365"],
  ["conf-cell",  "a cell: one square of a correlation matrix"],
  ["macro-cell", "a cell: one square of the macro grid"],
  ["glance",     "the grid, not a surface: its 1px gaps ARE the hairline it paints, "
                 + "and the material under them would show through as a wash. Its cells "
                 + "are .glance-item and they are plates."],

  ["rng-fill",      "a fill: the accent inside .rng-track"],
  ["fv-band",       "a fill: the band inside .fv-track"],
  ["live-fill",     "a fill: the accent inside .live-bar"],
  ["live-col-fill", "a fill: the accent inside a live column"],

  ["comment-box", "a text field: the caret is the affordance"],
  ["desk-search", "a text field: the caret is the affordance"],
  ["topic-field", "a text field: cursor is text, not pointer"],
  ["field-select", "not a surface: it sets font-family and nothing else, and was "
                   + "reported only because a nested block inside it has a ground"],
  ["fig-bar",      "not a surface: padding and a max-width, no ground of its own. "
                   + "The glass under it is .studio-pane."],
  ["drawer-back",  "the scrim behind the drawer on a phone. It is the absence of a "
                   + "surface, dimming everything so one pane reads as the only one."],
  ["stat-lead",    "a tone on .stat, which is a plate. Colour and nothing else."],

  ["ad-dot",              "a mark: a 9px status dot in the admin list"],
  ["comment-mark",        "a mark: the 26px initial beside a comment"],
  ["gate-mark",           "a text highlight, drawn as a gradient under one phrase. "
                          + "Glass on a run of words is a box around a word."],
  ["read-aloud-highlight", "a text highlight: the sentence being spoken"],
  ["chinho",              "an inline symbol in Qur'anic prose, padded by five pixels"],
  ["skeleton",            "the ABSENCE of content: a shimmer standing in for a row "
                          + "that has not arrived. A lit edge on it would promise a "
                          + "surface that is about to be replaced."],
  ["field-num",           "a text field: the caret is the affordance"],
  ["social",              "a <ul>, not a surface. Its <a> children ARE the pills, and "
                          + "putting the material on the list drew a rectangle round the "
                          + "whole group, sitting inside the card that already holds it. "
                          + "A wrapper whose children are the things is layout, like "
                          + ".chips."],
]);

/* ---------- 1. interactive and unplaced ---------- */

const interactive = new Map<string, string>();
const paintsGradient = new Map<string, string>();
const setsSurfaceImage = new Set<string>();
const castsShadow = new Map<string, string>();
const setsSurfaceShadow = new Set<string>();

for (const [layer, sel, body] of all) {
  if (layer === "glow") continue;
  const acts = /:hover|:focus-visible|aria-pressed|cursor:\s*pointer/.test(body)
    || /:hover|aria-pressed/.test(sel);
  /* A gradient inside `&::before` belongs to a pseudo-element,
     which `@layer glow` never touches: it sets background-image
     on the element itself. `.id-card` draws graph paper that way
     and was reported until this stripped them. A nested STATE
     block (`&:hover`) is left in, because a later layer does win
     over one of those. */
  /* A DESCENDANT block is somebody else's: `& .tracker-tag { box-shadow }`
     inside `.tracker` styles the tag, and reading it as the tracker's
     reported a surface whose shadow the material was never going to touch.
     A STATE block (`&:hover`, `&.btn-solid`) is the same subject and stays,
     because a later layer does win over one of those. Innermost first,
     repeatedly, so a block inside a block comes out too. */
  let own = body, before = "";
  while (own !== before) {
    before = own;
    own = own.replace(/&(?:::[a-z-]+|\s+[^{}]*?)\s*\{[^{}]*\}/g, "");
  }
  const gradient = /background(-image)?:[^;]*gradient\(/.test(own);
  const token = /--surface-image\s*:/.test(body);
  const shadow = /(^|[;{\s])box-shadow\s*:\s*(?!none)/.test(own);
  const shadowToken = /--surface-shadow\s*:/.test(body);
  for (const part of sel.split(",")) {
    const m = part.trim().match(/^\.([a-z][a-z0-9-]*)$/);
    if (!m) continue;
    const cls = m[1];
    if (acts && !interactive.has(cls)) interactive.set(cls, layer);
    if (gradient && !paintsGradient.has(cls)) paintsGradient.set(cls, layer);
    if (token) setsSurfaceImage.add(cls);
    if (shadow && !castsShadow.has(cls)) castsShadow.set(cls, layer);
    if (shadowToken) setsSurfaceShadow.add(cls);
  }
}

if (LIST) {
  console.log(`\n${placed.size} class(es) on the material, ${NOT_A_SURFACE.size} deliberately not.\n`);
  for (const cls of [...placed].sort()) console.log(`  .${cls}`);
  process.exit(0);
}

for (const [cls, layer] of [...interactive].sort()) {
  if (placed.has(cls) || NOT_A_SURFACE.has(cls)) continue;
  const base = VARIANT_OF.get(cls);
  if (base && placed.has(base)) continue;
  if (base) {
    bad += 1;
    console.error(`\n  x .${cls} is a variant of .${base}, which is on no kind.`);
    console.error("        Place the base, or take this out of VARIANT_OF in this file.");
    continue;
  }
  bad += 1;
  console.error(`\n  x .${cls} (@layer ${layer}) is pressable and is on no kind.`);
  console.error("        Put it in one of the four lists in @layer glow: chip if it");
  console.error("        latches, control if it acts, card if it takes you in, pane if");
  console.error("        it holds other things. If it is a ROW of controls rather than a");
  console.error("        control, add it to NOT_A_SURFACE in this file with the reason.");
}

/* ---------- 2. a listed class whose gradient would vanish ---------- */

for (const [cls, layer] of [...paintsGradient].sort()) {
  if (!placed.has(cls) || setsSurfaceImage.has(cls)) continue;
  bad += 1;
  console.error(`\n  x .${cls} (@layer ${layer}) paints a gradient and is on the material.`);
  console.error("        @layer glow comes later and REPLACES background-image rather than");
  console.error("        merging with it, so that gradient is gone and the page still");
  console.error("        renders. Move it into --surface-image in its own rule:");
  console.error(`            --surface-image: <the gradient>;`);
  console.error("            background-image: var(--surface-image);");
}

/* ---------- 2b. would the material take a surface's own SHADOW away? ----

   The same trap as the gradient, one property along, and worse.
   The material sets box-shadow to draw the edge, a later layer
   REPLACES rather than merges, and what a surface loses is not a
   decorative wash: it is its hover lift and its focus ring.
   Fourteen focus rings and thirteen lifts were one careless
   declaration away from vanishing, and a focus ring that is gone
   is an accessibility failure nobody can see in a screenshot.

   `--surface-shadow` is the way through: the material's list ends
   `var(--surface-shadow, none)`, so a lift composes with the edge
   rather than replacing it, and a focus ring now sits BESIDE the
   edge rather than instead of it.

   A rule that groups a material class with one that is not gets
   BOTH, deliberately: the token for the surface, the shorthand for
   the class the material never paints. */

for (const [cls, layer] of [...castsShadow].sort()) {
  if (!placed.has(cls) || setsSurfaceShadow.has(cls)) continue;
  bad += 1;
  console.error(`\n  x .${cls} (@layer ${layer}) sets box-shadow and is on the material.`);
  console.error("        @layer glow comes later and sets box-shadow to draw the edge, so");
  console.error("        that shadow is gone: if it was a hover lift the card stops");
  console.error("        lifting, and if it was a focus ring the control stops showing");
  console.error("        focus at all. Move it into --surface-shadow in its own rule:");
  console.error("            --surface-shadow: <the shadow>;");
}

/* ---------- 3. the ladder is a ladder ----------

   The five kinds are a physical progression, not five rows
   somebody tuned: as a surface gets THICKER it should get less
   polished and less clear, because that is what more material
   does to a light. Read down the polish column and the system is
   there in one line.

   A sixth kind, or a retune of one, that breaks the ordering
   breaks the idea rather than one number, and it is invisible:
   every value is plausible on its own. So the order is asserted
   rather than remembered. `plate` is excluded because it does not
   follow the pointer, so its depth is describing a still light
   and is not on the same scale. */
{
  const kinds: Array<[string, number, number, number]> = [];
  for (const [layer, sel, body] of all) {
    if (layer !== "glow") continue;
    const d = /--depth:\s*([\d.]+)/.exec(body);
    const p = /--polish:\s*([\d.]+)/.exec(body);
    const c = /--clarity:\s*([\d.]+)/.exec(body);
    if (!d || !p || !c) continue;
    /* The kinds whose light HOLDS STILL are out of the ordering:
       a plate and a pane are placed by what they are for rather
       than by how far a moving light carries in them.

       `--follows: 0` is how that is said. It was `--glow-w: 0`
       written beside each of their depths, and the derived size
       formula later in the same layer overrode both at equal
       specificity, so neither ever held still: a `.stat`
       measured 156px of moving light. The formula multiplies by
       this factor now, so there is one place that decides. */
    if (/--follows:\s*0/.test(body)) continue;
    const name = (/\.([a-z][a-z0-9-]*)/.exec(sel) ?? [, "?"])[1];
    kinds.push([name, Number(d[1]), Number(p[1]), Number(c[1])]);
  }

  /* THREE, not four. A pane joined the still kinds when the
     flare was finally fixed on the class block rather than on
     the attribute, so what is left on the ordering is the chip,
     the control and the card: the three you press. */
  if (kinds.length < 3) {
    bad += 1;
    console.error(`\n  x only ${kinds.length} following kind(s) found in @layer glow, expected 3.`);
    console.error("        Each is a rule setting --depth, --polish and --clarity. If a kind");
    console.error("        was renamed or removed, this is where it shows.");
  } else {
    const sorted = [...kinds].sort((a, b) => a[1] - b[1]);
    for (let i = 1; i < sorted.length; i += 1) {
      const [an, , ap, ac] = sorted[i - 1];
      const [bn, , bp, bc] = sorted[i];
      if (ap > bp && ac > bc) continue;
      bad += 1;
      console.error(`\n  x .${bn} is thicker than .${an} and is not less polished and less clear.`);
      console.error(`        .${an}: polish ${ap}, clarity ${ac}`);
      console.error(`        .${bn}: polish ${bp}, clarity ${bc}`);
      console.error("        More material scatters more light and passes less of it. A kind");
      console.error("        that breaks that is a row of plausible numbers with no idea in it.");
    }
  }
}

/* ---------- 4. a stale exemption ---------- */

for (const [cls, why] of NOT_A_SURFACE) {
  /* Stale means GONE, not "no longer matches the interactivity
     test". Several of these are rows whose hover lives on a
     descendant selector rather than on a bare rule, which is
     exactly why they needed an entry: they read as interactive to
     a person and not to a regex. The honest staleness test is
     whether the stylesheet still has the class at all. */
  if (new RegExp(`\\.${cls}[\\s,{:.)>~+]`).test(bare)) continue;
  bad += 1;
  console.error(`\n  x NOT_A_SURFACE names .${cls}, which the stylesheet no longer has.`);
  console.error(`        Reason on file: ${why}`);
  console.error("        Remove the entry. A list of exceptions nobody prunes stops being");
  console.error("        a description of anything.");
}

/* ---------- 5. a name in a kind list that reaches nothing ----------

   `.prog-track` was in the groove's list for one commit. It is not
   a class this stylesheet has, nothing failed, and the kind read as
   though it covered a surface that does not exist. That is the
   stale pointer `check-pointers.ts` catches in comments, happening
   inside the design system itself. */

{
  const outside = all.filter(([layer]) => layer !== "glow");
  for (const cls of [...placed].sort()) {
    const real = outside.some(([, sel]) =>
      new RegExp(`\\.${cls}(?![a-z0-9-])`).test(sel));
    if (real) continue;
    bad += 1;
    console.error(`\n  x @layer glow names .${cls}, which no other layer defines.`);
    console.error("        A kind that covers a class the stylesheet does not have is a");
    console.error("        promise about a surface nobody can see. Remove the name, or");
    console.error("        write the rule it was meant for.");
  }
}

/* ---------- 6. placed on a kind and never painted ----------

   The taxonomy is said in three lists and they are genuinely
   different sets: the paint rule is every class on the system, the
   hover rule is only the four that follow the pointer, and each
   kind block is one kind. So a class can be given a --depth by its
   kind and left out of the paint rule, in which case it carries
   four numbers and no background-image, and looks exactly like a
   surface nobody got round to.

   The paint rule is the one that sets background-image from --spec.
   Everything with a kind has to be in it. */

{
  const painted = new Set<string>();
  for (const [layer, sel, body] of all) {
    if (layer !== "glow") continue;
    if (!/background-image:\s*\n?\s*var\(--spec/.test(body)) continue;
    for (const m of sel.matchAll(/\.([a-z][a-z0-9-]*)/g)) painted.add(m[1]);
  }
  if (!painted.size) {
    bad += 1;
    console.error("\n  x no paint rule found in @layer glow.");
    console.error("        It is the rule whose background-image starts var(--spec). If it");
    console.error("        was renamed, this check has stopped meaning anything.");
  } else {
    const kinded = new Set<string>();
    for (const [layer, sel, body] of all) {
      if (layer !== "glow") continue;
      if (!/--depth:\s*[\d.]+/.test(body)) continue;
      for (const m of sel.matchAll(/\.([a-z][a-z0-9-]*)/g)) kinded.add(m[1]);
    }
    for (const cls of [...kinded].sort()) {
      if (painted.has(cls)) continue;
      bad += 1;
      console.error(`\n  x .${cls} is given a kind and is not in the paint rule.`);
      console.error("        It carries --depth, --polish, --clarity and --standing, and no");
      console.error("        background-image, so it has the numbers of a surface and none");
      console.error("        of the light. Add it to the rule that sets var(--spec).");
    }
  }
}

/* ---------- 7. surface-shaped and off the system ----------

   Question 1 asks whether anything INTERACTIVE is missing, and for
   a year that was the whole of it. It let a progress track sit at
   --depth: 0 on four schools' pages while every other surface
   around it was glass, because nobody presses a progress bar and
   the check could not see it.

   A surface here is a class whose own rule gives it both a ground
   and an edge: a background that is not `none`, plus a border, a
   radius or a shadow. That is the shape a reader reads as a piece
   of the material whether or not they ever touch it.

   NESTED BLOCKS ARE STRIPPED FIRST, all of them. A rule saying
   `& .track { background: ... }` is describing a descendant, and
   counting it made every bare flex wrapper on the site look like a
   surface: the first run of this reported 57 where there were 39. */

{
  const shaped = new Map<string, string>();
  for (const [layer, sel, body] of all) {
    if (layer === "glow") continue;
    /* Innermost-first, repeatedly, because one pass leaves the
       outer half of a nested block behind and a rule with two
       nested blocks keeps the second. `.contact-form` and
       `.signin-form` are flex wrappers whose FIELDS carry the
       ground, and a single pass reported both. */
    let own = body, prev = "";
    while (own !== prev) { prev = own; own = own.replace(/&[^{}]*\{[^{}]*\}/g, ""); }
    const ground = /(^|[;{\s])background(-color|-image)?\s*:\s*(?!none|transparent|inherit|0)/.test(own);
    const edge = /(^|[;{\s])(border(-[a-z]+)?\s*:\s*(?!0|none)|border-radius\s*:|box-shadow\s*:\s*(?!none))/.test(own);
    if (!ground || !edge) continue;
    for (const part of sel.split(",")) {
      const m = part.trim().match(/^\.([a-z][a-z0-9-]*)$/);
      if (m && !shaped.has(m[1])) shaped.set(m[1], layer);
    }
  }
  for (const [cls, layer] of [...shaped].sort()) {
    if (placed.has(cls) || NOT_GLASS.has(cls)) continue;
    const base = VARIANT_OF.get(cls);
    if (base && placed.has(base)) continue;
    bad += 1;
    console.error(`\n  x .${cls} (@layer ${layer}) has a ground and an edge and is on no kind.`);
    console.error("        It will read as the one flat rectangle on a page of glass, which");
    console.error("        is what the plate was invented to stop. Put it on a kind, or add");
    console.error("        it to NOT_GLASS in this file with the reason it is not.");
  }
}

/* ---------- 8. a stale NOT_GLASS entry ---------- */

for (const [cls, why] of NOT_GLASS) {
  if (new RegExp(`\\.${cls}[\\s,{:.)>~+]`).test(bare)) continue;
  bad += 1;
  console.error(`\n  x NOT_GLASS names .${cls}, which the stylesheet no longer has.`);
  console.error(`        Reason on file: ${why}`);
}

/* ---------- 9. does a still kind say so where it is applied? ----------

   THE BUG THIS EXISTS FOR, THREE TIMES OVER.

   A kind that holds still is written `--follows: 0`, and the
   derived size formula multiplies by it. Two ways to get that
   wrong, and both shipped:

   1. `--glow-w: 0px` beside the depth. The formula is LATER in
      the same layer at the same specificity, so it wins, and the
      surface goes on throwing light while the comment above it
      says it does not. The plate had this for as long as the
      formula existed and a `.stat` measured 156px. The groove
      had it too and was missed when the plate was fixed: every
      track, meter and segmented control carried 73.6px.

   2. `--follows: 0` on `[data-glow="pane"]` instead of on the
      class block. THE MATERIAL IS APPLIED BY CLASS. That
      attribute only carries the light's size for the handful of
      components that set it directly, so a rule there reaches
      almost nothing: `.rail` and `.topbar` measured 220px each,
      through two releases, after the flare had been reported
      twice and declared fixed once.

   Neither is visible in a diff and neither fails anything else:
   the page renders, the colours are right, and the only symptom
   is a light that follows the pointer across something nobody
   presses. So the question is asked here instead. */

const STILL: Array<{ member: string; kind: string; why: string }> = [
  { member: "topbar", kind: "pane",
    why: "a pane is what you read INSIDE, and a 220px light sweeping across a "
      + "nine millimetre sheet under somebody's prose is the flare this was "
      + "reported as twice" },
  { member: "tile", kind: "plate",
    why: "read, never pressed: the same weave and lit edge, and a still light "
      + "in the corner" },
  { member: "track", kind: "groove",
    why: "five pixels tall, so a light following the pointer in one is a light "
      + "nobody can see chasing a target nobody aims at" },
];

for (const { member, kind, why } of STILL) {
  const block = all.find(([layer, sel, body]) =>
    layer === "glow"
    && /--depth:\s*[\d.]/.test(body)
    && new RegExp(`\\.${member}[\\s,)]`).test(sel));

  if (!block) {
    bad += 1;
    console.error(`\n  x STILL names .${member} for the ${kind}, and no kind block lists it.`);
    console.error("        Either the class was renamed, or the kind was. Point this at a");
    console.error(`        class the ${kind}'s own block lists.`);
    console.error(`        Reason on file: ${why}`);
    continue;
  }

  const [, , body] = block;
  if (/--glow-w:\s*0/.test(body)) {
    bad += 1;
    console.error(`\n  x the ${kind} holds still with --glow-w: 0, which does nothing.`);
    console.error("        The derived size formula later in @layer glow has the same");
    console.error("        specificity and wins. Write --follows: 0 instead: the formula");
    console.error("        multiplies by it, so there is one place that decides.");
    continue;
  }

  if (!/--follows:\s*0/.test(body)) {
    bad += 1;
    console.error(`\n  x the ${kind} is meant to hold still and its CLASS block does not say so.`);
    console.error(`        Add --follows: 0 to the block listing .${member}. Putting it on`);
    console.error(`        [data-glow="${kind}"] instead reaches almost nothing: the material`);
    console.error("        is applied by class, and that attribute only carries the light's");
    console.error("        size for components that set it directly.");
    console.error(`        Why it holds still: ${why}`);
  }
}

console.log(
  bad
    ? `\nmaterial: ${bad} problem(s).`
    : `material: ${placed.size} class(es) on the design system, `
      + `${interactive.size} interactive, none unplaced.`,
);
process.exit(bad ? 1 : 0);
