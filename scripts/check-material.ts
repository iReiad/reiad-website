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
  ["chip-row", "a row of chips. The chips light, the row does not."],
  ["seg", "a segmented control's frame. Its buttons are `.chip`."],
  ["segmented", "the other segmented frame, whose buttons are its own."],
  ["driver-group", "a row of `.driver` sliders."],
  ["preview-controls", "a toolbar of buttons."],
  ["fig-bar", "the figure toolbar, which is a row of icon buttons."],
  ["more-menu", "a menu's frame. Its items are `.acc-item`."],
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
  ["move-field", "the same."],
  ["topic-field", "the same."],
  ["paste-area", "a textarea. Same reason."],
  ["timeline", "a list with hoverable entries."],
  ["admin-row", "a row in a table."],
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

/* ---------- 1. interactive and unplaced ---------- */

const interactive = new Map<string, string>();
const paintsGradient = new Map<string, string>();
const setsSurfaceImage = new Set<string>();

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
  const own = body.replace(/&::[a-z-]+\s*\{[^{}]*\}/g, "");
  const gradient = /background(-image)?:[^;]*gradient\(/.test(own);
  const token = /--surface-image\s*:/.test(body);
  for (const part of sel.split(",")) {
    const m = part.trim().match(/^\.([a-z][a-z0-9-]*)$/);
    if (!m) continue;
    const cls = m[1];
    if (acts && !interactive.has(cls)) interactive.set(cls, layer);
    if (gradient && !paintsGradient.has(cls)) paintsGradient.set(cls, layer);
    if (token) setsSurfaceImage.add(cls);
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

/* ---------- 3. a stale exemption ---------- */

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

console.log(
  bad
    ? `\nmaterial: ${bad} problem(s).`
    : `material: ${placed.size} class(es) on the design system, `
      + `${interactive.size} interactive, none unplaced.`,
);
process.exit(bad ? 1 : 0);
