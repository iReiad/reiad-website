#!/usr/bin/env node
/* ============================================================
   check-components.mjs: a component only updates the pages that
   use it.

       node scripts/check-components.mjs
       node scripts/check-components.mjs --list    where they are
       node scripts/check-components.mjs --update  re-record

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
   from the one table in `next/lib/nav.ts`, and every component
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
   what the message tells somebody to reach for instead. */
const OWNED = [
  { id: "button", find: 'className="btn', use: "<Button> or <ButtonLink> from ui/button" },
  { id: "icon-button", find: "icon-btn", use: "<Button kind=\"quiet\"> from ui/button" },
  { id: "section-label", find: 'className="section-label mono"', use: "<SectionLabel> from ui/label" },
  { id: "chip", find: 'className="tag mono"', use: "<Chip> from ui/chip" },
  { id: "chip-class", find: 'className="chip', use: "<Chip> from ui/chip" },
  { id: "stat-tile", find: 'className="tile"', use: "<StatTile> from ui/stat" },
  { id: "input", find: "<input ", use: "<Field> from ui/field" },
  { id: "textarea", find: "<textarea ", use: "<TextArea> from ui/field" },
];

/* A colour a route names for itself. `--accent` and the tokens
   derived from it are the point and are allowed; a specific one
   is the opt-out. */
/* Six digits or eight, not three.

   `#dcf` is three hex digits and it is the anchor a skip link
   points at, which this flagged as a hex colour on a route that
   names no colour at all. Nothing in this repository writes a
   short hex, so the narrower rule loses nothing and stops the
   check crying wolf, which is the way a check gets switched off. */
const NAMED_COLOUR =
  /var\(--(green|teal|blue|violet|plum|rose|gold)\b(?!-)|#[0-9a-f]{6}(?:[0-9a-f]{2})?\b|\brgb\(|\boklch\(/i;

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
function walk(dir, out = []) {
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

const counts = Object.fromEntries(OWNED.map((o) => [o.id, 0]));
const where = Object.fromEntries(OWNED.map((o) => [o.id, []]));
const colours = [];

for (const file of files) {
  const src = readFileSync(file, "utf8");
  const rel = relative(ROOT, file);
  let inComment = false;

  src.split("\n").forEach((line, i) => {
    for (const owned of OWNED) {
      if (!line.includes(owned.find)) continue;
      counts[owned.id] += 1;
      where[owned.id].push(`${rel}:${i + 1}`);
    }

    /* Prose is not code. The comments in this repository are long
       and explanatory, and one of them mentions React error #418,
       which is a hex as far as a regex is concerned. */
    if (inComment) {
      if (line.includes("*/")) inComment = false;
      return;
    }
    if (/^\s*(\/\/|\*)/.test(line)) return;
    if (/\/\*/.test(line) && !/\*\//.test(line)) { inComment = true; return; }

    const code = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/, "");
    if (!NAMED_COLOUR.test(code)) return;
    if (EXEMPT.some((re) => re.test(code))) return;

    colours.push(`${rel}:${i + 1}  ${code.trim().slice(0, 78)}`);
  });
}

/* ---------- compare against the ledger ---------- */

let ledger = {};
try {
  ledger = JSON.parse(readFileSync(LEDGER, "utf8"));
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

const problems = [];

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
    + "        table in next/lib/nav.ts. A named colour is a page that stops\n"
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
