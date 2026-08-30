/* ============================================================
   check-glass.ts: a finish is three places, and each way of
   getting it wrong is silent in a different way.

   `data-glass` on <html> is the reader's choice of what every
   translucent surface on this site is made of, and three files
   have to agree about what the choices are:

     aab/src/prefs.ts          GLASSES, what the panel offers
     next/styles/site.css      a [data-glass="<id>"] block, what
                               the browser actually draws
     next/components/shell.tsx the whitelist in the boot script,
                               which runs before the first paint

   OFFERED AND NOT DRAWN is a chip a reader presses that changes
   the attribute and nothing else: the page looks broken in a way
   that reads as the site being slow.

   DRAWN AND NOT OFFERED is work nobody can reach.

   MISSING FROM THE BOOT SCRIPT is the worst of the three,
   because the panel offers it, the stylesheet draws it, and the
   choice survives exactly until the next page load, when the
   boot script does not recognise it and writes `frost` over it.
   A preference that will not stick is a preference a reader
   stops trusting, and nothing anywhere says so.

   The boot script cannot import the table. It is a string that
   runs before any module has loaded, which is the whole reason
   it exists. So the second copy is deliberate and this is what
   holds it.

   ---- and the five tables beside it ----

   `data-glass` was not the only thing that boot script copies.
   It also carries SCALES, MEASURES, BLURS, VEILS and TEXTURES,
   fifteen values in all, and until 30 August 2026 nothing held
   any of them: a value edited in `prefs.ts` and not here is a
   preference that applies when the reader presses the chip and
   is written over by the old one on the next page load. That is
   the third failure above, exactly, for five more settings.

   It was not hypothetical either. `MEASURES` stopped being a
   width and became a multiplier the same week, which is an edit
   in three files, and only one of the three had a check on it.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string): string => readFileSync(join(ROOT, p), "utf8");

/** The table the panel draws from. Read as text rather than
    imported, because `aab/src/prefs.ts` reaches for `document` at
    its top level and this check has none. */
function offered(): string[] {
  const src = read("aab/src/prefs.ts");
  const block = src.match(/export const GLASSES = \[([\s\S]*?)\] as const/)?.[1];
  if (!block) throw new Error("could not find GLASSES in aab/src/prefs.ts");
  return [...block.matchAll(/\{\s*id:\s*"([^"]+)"/g)].map((m) => m[1]);
}

/** Every finish the stylesheet has a block for. The selector has
    to start on `:root` and carry only the one attribute: the
    brightness overrides pair `[data-theme]` with `[data-glass]`
    and are not a definition of anything.

    A comma is allowed after it and is not optional to allow for:
    every finish block also names `[data-finish="<id>"]`, so that
    a swatch in the appearance panel can wear a finish the
    document is not wearing. */
function drawn(): string[] {
  const css = read("next/styles/site.css");
  const out = new Set<string>();
  for (const [, id] of css.matchAll(/:root\[data-glass="([a-z-]+)"\]\s*[,{]/g)) {
    out.add(id);
  }
  return [...out];
}

/** The whitelist inside the boot script's string. Keys are bare
    where they are identifiers and quoted where a hyphen makes
    them not, which is why both shapes are matched. */
function booted(): string[] {
  const src = read("next/components/shell.tsx");
  const start = src.indexOf('d.setAttribute("data-glass"');
  if (start < 0) throw new Error("could not find the data-glass line in shell.tsx");
  const stop = src.indexOf('[p.glass]', start);
  if (stop < 0) throw new Error("could not find the boot whitelist in shell.tsx");
  const block = src.slice(start, stop);
  return [...block.matchAll(/(?:"([a-z-]+)"|\b([a-z][a-z-]*))\s*:\s*1/g)]
    .map((m) => m[1] ?? m[2]);
}

const lists = {
  "aab/src/prefs.ts (GLASSES)": offered(),
  "next/styles/site.css ([data-glass])": drawn(),
  "next/components/shell.tsx (the boot whitelist)": booted(),
};

/* ============================================================
   THE FIVE TABLES OF VALUES

   Each is a `{ id: value }` map written out twice: once as a
   table in `prefs.ts` that the panel draws chips from, and once
   as an object literal in the boot script's string. The pair has
   to agree on every id AND on every value, because the boot
   script is what runs first: a value only the panel knows is
   applied on the press and gone on the next page load.
   ============================================================ */

/** id to value, out of one `export const NAME = [...]` in
    `prefs.ts`, reading whichever field carries the value. */
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
    the lines move. */
function bootTable(prop: string): Record<string, string> {
  const src = read("next/components/shell.tsx");
  const at = src.indexOf(`d.style.setProperty("${prop}"`);
  if (at < 0) throw new Error(`the boot script never sets ${prop}`);
  /* The literal is the `var x = {...}[p.something];` immediately
     above the line that uses it, so it is the LAST one before
     that line rather than the first. Anchoring the regex at the
     end and letting it be greedy does not do that: `exec` scans
     from the left and returns the earliest start that can match,
     which handed every table the type scale's values and made
     the check report three failures about a file that was
     right. */
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
  ["BLURS", "amount", "--glass-amount"],
  ["VEILS", "alpha", "--glass-veil"],
  ["TEXTURES", "amount", "--tex-strength"],
];

const names = Object.keys(lists);
const all = [...new Set(Object.values(lists).flat())].sort();
const failures: string[] = [];

for (const id of all) {
  const missing = names.filter((n) => !lists[n as keyof typeof lists].includes(id));
  if (missing.length) {
    failures.push(`   ${id}\n        missing from ${missing.join("\n                     ")}`);
  }
}

/* And a duplicate, which is how a rename leaves the old id
   behind: the panel offers two chips that look the same and one
   of them is dead. */
for (const [name, list] of Object.entries(lists)) {
  const seen = new Set<string>();
  for (const id of list) {
    if (seen.has(id)) failures.push(`   ${id} is listed twice in ${name}`);
    seen.add(id);
  }
}

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

if (failures.length) {
  console.error(`glass: ${failures.length} setting(s) are not said the same in every place:\n`);
  for (const f of failures) console.error(f);
  console.error("\nA finish is the panel's chip, the stylesheet's block and the boot");
  console.error("script's whitelist. Offered and not drawn is a chip that does");
  console.error("nothing; drawn and not offered is work nobody can reach; and one");
  console.error("missing from the boot script is a choice that will not survive the");
  console.error("next page load, which nothing else would ever tell you.");
  process.exit(1);
}

console.log(`glass: ${all.length} finish(es), each offered, drawn and restored `
  + `before the first paint, and ${VALUES.length} tables of values `
  + "said the same in the panel and in the boot script.");
