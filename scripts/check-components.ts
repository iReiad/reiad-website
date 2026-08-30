#!/usr/bin/env node
/* ============================================================
   check-components.ts: a component only updates the pages that
   use it.

       node scripts/check-components.ts
       node scripts/check-components.ts --list    where they are
       node scripts/check-components.ts --update  re-record

   ---- the problem this exists for ----

   `next/components/ui/` is where a button, a field, a chip, a
   tile and a meter are decided. Change one and every page that
   uses it changes: that part needs no help, it is what a
   component is.

   What needs help is the other half. A route that writes
   `className="btn btn-ghost"` by hand is a button this site
   cannot restyle, a field with no label wiring, a tile that
   picked its own font size. There are hundreds of them, they were
   all correct on the day they were written, and every one is a
   page the theme reaches and the component does not.

   Telling somebody to convert them does not work. This makes it
   mechanical.

   ---- a ratchet, not a wall ----

   Failing on the first occurrence would mean converting four
   hundred call sites in one change, which is not a change anybody
   can review. So the count is RECORDED, and the rule is that it
   may only go down:

     · a new page written the old way pushes a count up, and this
       fails with the component it should have used;
     · a conversion pushes it down, and `--update` records the new
       floor so it cannot come back.

   The numbers below are not targets. They are the debt, written
   down, and the only direction they move is toward zero. When one
   reaches zero the pattern is finished and the entry says so.

   ---- and no route names a colour ----

   The second half of the same idea. `--accent` is set on <html>
   from the one table in `shared/nav.ts`, and every component
   reads it, so a page wears its section's colour by doing
   nothing. A route that writes `var(--blue)` or a hex opts itself
   out of that, permanently and silently. That is a hard failure
   rather than a ratchet, because there are few of them and each
   one is a page that will not follow the theme.
   ============================================================ */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LEDGER = join(ROOT, "scripts", "component-debt.json");

const LIST = process.argv.includes("--list");
const UPDATE = process.argv.includes("--update");

/* ---------- what a component owns ----------

   `find` is matched against the source as plain text, because
   these are literal class strings rather than a shape. `use` is
   what the message tells somebody to reach for instead. `skip` is
   a line this pattern matches and the component does not cover.

   `skip` exists because of the input rule below, and the lesson
   generalises: a check that reports work which cannot be done is
   a check that gets ignored, and an ignored check is the same as
   a deleted one. */
/** A pattern a component owns: the plain text to look for, what
    to reach for instead, and a line this pattern matches that the
    component cannot cover. */
/** An opening tag from where it starts to its `>`, across as
    many lines as it takes. Capped, because a runaway scan on a
    file with an unbalanced angle bracket should read a few lines
    and stop rather than the whole file. */
function element(lines: string[], from: number, at: number): string {
  let out = lines[from].slice(at);
  for (let j = from + 1; j < Math.min(from + 12, lines.length); j += 1) {
    if (out.includes(">")) break;
    out += ` ${lines[j]}`;
  }
  return out.slice(0, out.indexOf(">") + 1 || out.length);
}

interface Owned {
  id: string;
  find: string | RegExp;
  use: string;
  skip?: RegExp;
}

const OWNED: Owned[] = [
  /* Two of these will never reach zero and should not: the CSV
     pickers on two case studies are a `<label>` wrapping a hidden
     file input, styled as a button. `<Button>` is a button and
     `<ButtonLink>` is an anchor, and a third that renders a label
     would be the "one component with a tag prop" mistake this
     library exists to avoid. */
  { id: "button", find: 'className="btn', use: "<Button> or <ButtonLink> from ui/button" },
  { id: "icon-button", find: "icon-btn", use: "<Button kind=\"quiet\"> from ui/button" },
  { id: "section-label", find: 'className="section-label mono"', use: "<SectionLabel> from ui/label" },
  { id: "chip", find: 'className="tag mono"', use: "<Chip> from ui/chip" },
  /* `className="chip` and not `className="chip` with anything
     after it, because two of the names that start that way are
     ROWS rather than chips: `.chips` is a flex list and
     `.chip-row` is a group a browser module fills. Both used to
     draw their own pill and both stopped on 20 August 2026, so
     what is inside them is `<Chip>` and the row is layout.

     A check that reports work which cannot be done is a check
     that gets ignored, which is what `skip` exists for one line
     down and what this was doing to nine call sites. */
  {
    id: "chip-class",
    find: 'className="chip"',
    use: "<Chip> from ui/chip, or <ChipButton> if it is pressed",
  },
  { id: "stat-tile", find: 'className="tile"', use: "<StatTile> from ui/stat" },
  /* Only the boxes a person types words into.

     This counted every `<input>` and stood at 37, of which 29
     were things `<Field>` cannot be: 22 range sliders on the
     calculators, three hidden Web3Forms fields, two honeypots and
     two file pickers. A slider is not a text box and a honeypot
     must never be a labelled field, so a check demanding they be
     converted was asking for the site to be made worse.

     `--radius-range` and the rest of what a slider looks like are
     the stylesheet's; `@layer base` styles the text boxes on
     `:is(input:not([type="range"], …), textarea, select)`, which
     is the same list as this one and for the same reason. */
  /* The five left are calculator inputs, and they are the awkward
     ones rather than the forgotten ones. Each sits inside a
     `<label>` that also holds a live value readout the tool's
     browser module writes into, and each is found by `id` by that
     module. `<Field>` renders its own label, so converting one is
     a change to the markup a module reaches into as well as to
     the field, which is a different job from this ledger's.

     `skip` is line-based, which is why the honeypot in
     `subscribe.tsx` counted for months: its `className` had
     wrapped on to the next line and the pattern never saw it. The
     class is back on the first line rather than the pattern made
     cleverer, because the comment above it already says never to
     convert it and a reader should see both at once.

     AND THE FINDER HAD THE SAME BLIND SPOT, WORSE. It was the
     string `"<input "`, with a trailing space, so every one of
     these written with its attributes starting on the next line
     was invisible: the ledger read 5 and 0 while the tree held
     14 and 5. It is a pattern that also matches an end of line
     now, and `skip` reads the whole opening tag rather than the
     first line of it, so a multi-line checkbox is still skipped.
     The nine it turned up outside this file's own subject are
     recorded rather than converted: the ratchet only ever lets a
     count fall, so recording a true number is what makes them
     reachable. */
  {
    id: "input",
    find: /<input(?=[\s>]|$)/,
    /* AND ONE THAT IS NAMED BY SOMETHING ELSE ON THE PAGE.

       `<Field>` exists so that a box is never unlabelled, and a
       cell of a table already has a name: its row header. Wiring
       `aria-labelledby` at that header is a stronger association
       than a `<label>` beside it, and adding a hidden label as
       well would announce the same words twice. So the escape
       hatch is the attribute that does the job rather than a file
       name: anything claiming it has to point at an id, which is
       a claim somebody can check. */
    skip: /type="(?:range|checkbox|radio|hidden|file|submit|button)"|honeypot|aria-labelledby/,
    use: "<Field> from ui/field",
  },
  { id: "textarea", find: /<textarea(?=[\s>]|$)/, use: "<TextArea> from ui/field" },
];

/* A colour a route names for itself. `--accent` and the tokens
   derived from it are the point and are allowed; a specific one
   is the opt-out.

   Two things it took a bug each to get right.

   The FAMILY SUFFIX counts. `var(--green-soft)` slipped past a
   rule that only looked for `var(--green)`, and it was on the
   account page's header gradient. That token had been removed
   with the sweep to `--accent-soft`, so the header computed to
   nothing at all and the page lost its wash. A colour named for a
   section is the same mistake whichever shade is asked for.

   A HEX IS SIX DIGITS OR EIGHT, not three. `#dcf` is three hex
   digits and it is the anchor a skip link points at, which this
   flagged on a route that names no colour at all. Nothing here
   writes a short hex, so the narrower rule loses nothing and
   stops the check crying wolf, which is how a check gets switched
   off. */
const NAMED_COLOUR =
  /var\(--(green|teal|blue|violet|plum|rose|gold)(?:-[a-z]+)?\)|#[0-9a-f]{6}(?:[0-9a-f]{2})?\b|\brgb\(|\boklch\(/i;

/* Two ways of naming a colour that are the design rather than an
   escape from it.

   `accent=` HANDS a colour to something, which is the whole API:
   a card on the skills page wears the German blue by being given
   it, and everything inside that card then follows. It is the
   opposite of opting out.

   `theme-color` is the browser's own chrome, in a meta tag, and
   it is one fixed brand colour on purpose: the strip above the
   page should not change as a reader moves between sections. */
const EXEMPT = [
  /\baccent\s*[=:]/,
  /"--accent"[^:]*:/,
  /theme-color/,
];

/* ---------- the files this rule covers ----------

   Routes and components, minus `ui/` itself, which is where these
   patterns are SUPPOSED to be: a button component contains the
   only `<button>` on the list. `icons.tsx` is exempt for the
   colour rule for the same kind of reason: a drawing is allowed
   to be a drawing. */
function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) {
      if (name === "node_modules" || name === ".next") continue;
      walk(path, out);
    } else if (/\.tsx$/.test(name)) {
      out.push(path);
    }
  }
  return out;
}

const files = [...walk(join(ROOT, "next", "app")), ...walk(join(ROOT, "next", "components"))]
  .filter((f) => !f.includes(`${"components"}/ui/`))
  .sort();

/* ---------- count ---------- */

/** How many hand-written call sites each pattern still has. */
const counts: Record<string, number> =
  Object.fromEntries(OWNED.map((o) => [o.id, 0]));

/** And where each one is, as `<file>:<line>`, for `--list`. */
const where: Record<string, string[]> =
  Object.fromEntries(OWNED.map((o) => [o.id, []]));

/** Where a route names a colour instead of reading `--accent`. */
const colours: string[] = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  const lines = src.split("\n");
  let inComment = false;

  lines.forEach((line, i) => {
    /* Prose is not code, and this used to be BELOW the loop over
       OWNED rather than above it, so that loop read comments. It
       is a substring search, so a comment saying why a control
       stopped being `.icon-btn` counted as one more `.icon-btn`,
       and the ratchet went up for a line explaining that it had
       gone down. The comments here are long and explanatory on
       purpose, which makes that certain rather than unlucky.

       One of them also mentions React error #418, which is a hex
       as far as a regex is concerned. */
    if (inComment) {
      if (line.includes("*/")) inComment = false;
      return;
    }
    if (/^\s*(\/\/|\*)/.test(line)) return;
    if (/\/\*/.test(line) && !/\*\//.test(line)) { inComment = true; return; }

    const code = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "");

    for (const owned of OWNED) {
      const at = typeof owned.find === "string"
        ? code.indexOf(owned.find)
        : code.search(owned.find);
      if (at < 0) continue;
      /* SKIP READS THE ELEMENT, NOT THE LINE. Both halves of this
         were line-based and both were blind the same way: a
         `<input` whose attributes begin on the next line matched
         nothing, and eight of them sat uncounted in one tool
         while the ledger read 5 and the check passed. Widening
         `find` alone would then count a multi-line checkbox that
         `skip` can no longer see. */
      if (owned.skip?.test(element(lines, i, at))) continue;
      counts[owned.id] += 1;
      where[owned.id].push(`${rel}:${i + 1}`);
    }

    if (!NAMED_COLOUR.test(code)) return;
    if (EXEMPT.some((re) => re.test(code))) return;

    colours.push(`${rel}:${i + 1}  ${code.trim().slice(0, 78)}`);
  });
}

/* ---------- compare against the ledger ---------- */

/** What was recorded last time, per pattern. The ratchet: this
    check fails when a count goes UP, never when it goes down. */
let ledger: Record<string, number> = {};
try {
  ledger = JSON.parse(readFileSync(LEDGER, "utf8")) as Record<string, number>;
} catch {
  ledger = {};
}

if (UPDATE) {
  writeFileSync(LEDGER, `${JSON.stringify(counts, null, 2)}\n`);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  console.log(`component debt recorded: ${total} hand-written call site(s).`);
  process.exit(0);
}

if (LIST) {
  for (const owned of OWNED) {
    if (!where[owned.id].length) continue;
    console.log(`\n${owned.id} (${counts[owned.id]}) -> ${owned.use}`);
    for (const at of where[owned.id]) console.log(`  ${at}`);
  }
  process.exit(0);
}

const problems: string[] = [];

for (const owned of OWNED) {
  const was = ledger[owned.id];
  const now = counts[owned.id];

  if (was === undefined) {
    problems.push(`${owned.id} is not in the ledger. Run --update to record it.`);
    continue;
  }
  if (now > was) {
    problems.push(
      `${owned.id}: ${now} hand-written, was ${was}.\n`
      + `        Something new was written the old way. Use ${owned.use}.\n`
      + `        --list shows every one.`);
  }
}

for (const at of colours) {
  problems.push(
    `a route names a colour: ${at}\n`
    + "        Everything reads var(--accent), which <html> sets from the one\n"
    + "        table in shared/nav.ts. A named colour is a page that stops\n"
    + "        following its own section.");
}

/* ---------- say it ---------- */

const total = Object.values(counts).reduce((a, b) => a + b, 0);
const before = Object.values(ledger).reduce((a, b) => a + b, 0);

if (problems.length) {
  console.error(`components: ${problems.length} problem(s).\n`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

const moved = before - total;
console.log(
  `components: ${total} call site(s) still hand-written`
  + (moved > 0 ? `, ${moved} fewer than recorded. Run --update to hold the gain.` : ".")
  + (total === 0 ? " Nothing left to convert." : ""));
