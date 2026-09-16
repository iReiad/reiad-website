/* ============================================================
   check-prefs.ts: a preference is written out twice, and the
   two copies have to say the same thing.

   `aab/src/prefs.ts` holds the tables the account panel draws
   its chips from. The boot script in `next/components/shell.tsx`
   runs before the first paint and cannot import them, so it
   carries its own copy of the two that change layout: the type
   scale and the measure. A value edited in one file and not the
   other is a preference that applies when the reader presses the
   chip and is written over by the old value on the next page
   load. A preference that will not stick is a preference a
   reader stops trusting, and nothing else ever says so.

   It was not hypothetical. `MEASURES` stopped being a width and
   became a multiplier one week, which is an edit in both files,
   and only one of the two had a check on it.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string): string => readFileSync(join(ROOT, p), "utf8");

/** id to value, out of one `export const NAME = [...]` in
    `prefs.ts`, reading whichever field carries the value. Read as
    text rather than imported, because `aab/src/prefs.ts` reaches
    for `document` at its top level and this check has none. */
function table(name: string, field: string): Record<string, string> {
  const src = read("aab/src/prefs.ts");
  const block = new RegExp(`export const ${name} = \\[([\\s\\S]*?)\\] as const`)
    .exec(src)?.[1];
  if (!block) throw new Error(`could not find ${name} in aab/src/prefs.ts`);
  const out: Record<string, string> = {};
  for (const row of block.split("},")) {
    const id = /id:\s*"([^"]+)"/.exec(row)?.[1];
    const value = new RegExp(`${field}:\\s*"([^"]+)"`).exec(row)?.[1];
    if (id && value) out[id] = value;
  }
  return out;
}

/** The same map out of the boot script, found by the custom
    property it is written into rather than by position, because
    the lines move. The literal is the `var x = {...}[p.something];`
    immediately above the line that uses it, so it is the LAST one
    before that line rather than the first. */
function bootTable(prop: string): Record<string, string> {
  const src = read("next/components/shell.tsx");
  const at = src.indexOf(`d.style.setProperty("${prop}"`);
  if (at < 0) throw new Error(`the boot script never sets ${prop}`);
  const before = src.slice(0, at);
  const all = [...before.matchAll(/\{([^{}]*)\}\s*\[p\.[a-z]+\]/g)];
  const literal = all.at(-1)?.[1];
  if (!literal) throw new Error(`could not find the table the boot script reads for ${prop}`);
  const out: Record<string, string> = {};
  for (const [, key, quoted, value] of literal.matchAll(
    /(?:([a-z][a-z-]*)|"([^"]+)"):\s*"([^"]+)"/g)) {
    out[key ?? quoted] = value;
  }
  return out;
}

const VALUES: Array<[string, string, string]> = [
  ["SCALES", "size", "--read-scale"],
  ["MEASURES", "wide", "--read-wide"],
];

const failures: string[] = [];

for (const [name, field, prop] of VALUES) {
  const panel = table(name, field);
  const boot = bootTable(prop);
  for (const id of [...new Set([...Object.keys(panel), ...Object.keys(boot)])].sort()) {
    if (!(id in boot)) {
      failures.push(`   ${name}.${id} is offered by the panel and unknown to the boot`
        + `\n        script, so choosing it lasts until the next page load`);
    } else if (!(id in panel)) {
      failures.push(`   ${name}.${id} is in the boot script and not in the panel`
        + "\n        (aab/src/prefs.ts), so nothing can ever choose it");
    } else if (panel[id] !== boot[id]) {
      failures.push(`   ${name}.${id} is "${panel[id]}" in the panel and "${boot[id]}" in`
        + `\n        the boot script, which writes ${prop}. The page would arrive at one`
        + "\n        value and change to the other on the press.");
    }
  }
}

/* And the two tables the boot script does NOT carry, because
   neither changes layout before the first paint: a check that the
   panel still offers them at all, so a rename in `prefs.ts` fails
   here rather than as a panel with a row missing. */
for (const name of ["THEMES", "LANGS", "DEPTHS"]) {
  if (Object.keys(table(name, "label")).length === 0) {
    failures.push(`   ${name} in aab/src/prefs.ts is empty or gone, and the panel draws a row from it`);
  }
}

if (failures.length) {
  console.error(`prefs: ${failures.length} setting(s) are not said the same in every place:\n`);
  for (const f of failures) console.error(f);
  console.error("\nA preference is the panel's chip and the boot script's table. One");
  console.error("missing from the boot script is a choice that will not survive the");
  console.error("next page load, which nothing else would ever tell you.");
  process.exit(1);
}

console.log(`prefs: ${VALUES.length} tables of values said the same in the panel `
  + "and in the boot script, and 3 more the panel draws from.");
