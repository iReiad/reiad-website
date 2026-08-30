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

if (failures.length) {
  console.error(`glass: ${failures.length} finish(es) are not in all three places:\n`);
  for (const f of failures) console.error(f);
  console.error("\nA finish is the panel's chip, the stylesheet's block and the boot");
  console.error("script's whitelist. Offered and not drawn is a chip that does");
  console.error("nothing; drawn and not offered is work nobody can reach; and one");
  console.error("missing from the boot script is a choice that will not survive the");
  console.error("next page load, which nothing else would ever tell you.");
  process.exit(1);
}

console.log(`glass: ${all.length} finish(es), each offered, drawn and restored `
  + "before the first paint.");
