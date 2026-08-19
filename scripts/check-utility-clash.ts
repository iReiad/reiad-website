#!/usr/bin/env node
/* ============================================================
   check-utility-clash.ts: a class this site styles must not also
   be a class Tailwind generates.

       node scripts/check-utility-clash.ts

   WHAT WENT WRONG, TWICE.

   `--radius-sm: var(--radius-sm)` was the first: Tailwind owns
   the `--radius-*` namespace and so did this site, and every
   corner on the site came out square. `tailwind.css` says so at
   length and fixed it by clearing the namespace and renaming.
   `check-selfref.ts` is the guard on that half.

   `.ring` was the second and is the same shape one level over, on
   the CLASS namespace rather than the token one. `ring` is a
   Tailwind utility, `box-shadow: 0 0 0 1px`, and this site used
   `.ring` for the progress ring on four school hubs. Layer order
   could not save it: the site's rule never sets `box-shadow`, so
   there was nothing to win, and every ring wore a 1px square
   exactly 44px across. It is `.progress-ring` now.

   That is the property worth stating, because it is the one that
   makes this class of bug survive review: a clash does NOT need
   the two rules to set the same property. It needs only that
   Tailwind sets one the site's rule does not, and then no cascade
   layer, no specificity and no ordering can take it back off.

   ---- why it compiles rather than reading a committed file ----

   Tailwind emits a utility only when its scanner finds the name
   in a source, so "is this name a Tailwind utility" cannot be
   answered from a list: it is answered by what the compiler
   actually emits for THIS repository. So this compiles
   `next/styles/globals.css` with the Tailwind CLI, which is the
   same engine Next runs, and compares the two halves of the
   result: `@layer tw` against every layer that is the site's own.

   The CLI rather than the Next build because it needs no build,
   takes half a second, and therefore runs in CI, where a check
   that skips is a check that never runs. `--minify` because it
   drops the comments, and the comments in `site.css` are long,
   explanatory and full of class names being discussed.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLI = join(ROOT, "node_modules", ".bin", "tailwindcss");
const ENTRY = join(ROOT, "next", "styles", "globals.css");

if (!existsSync(CLI)) {
  console.error("utility clash: @tailwindcss/cli is not installed, so there is\n"
    + "               nothing to compile. Run `npm ci` at the repository root.");
  process.exit(1);
}

/* `-o -` writes to stdout. The compile is about half a second and
   nothing is written to disk, so this cannot leave a stale file
   behind for the next check to read. */
const css = execFileSync(CLI, ["-i", ENTRY, "-o", "-", "--minify"], {
  cwd: ROOT,
  encoding: "utf8",
  maxBuffer: 32 * 1024 * 1024,
  stdio: ["ignore", "pipe", "ignore"],
});

/** Every `@layer <name>{...}` block, by name and concatenated,
    with nesting handled: `@layer tw` holds `@media` blocks of its
    own and several layers are opened more than once. */
function layers(src: string): Map<string, string> {
  const out = new Map<string, string>();
  for (const m of src.matchAll(/@layer\s+([a-z-]+)\s*\{/g)) {
    let depth = 1;
    let i = m.index + m[0].length;
    const from = i;
    while (i < src.length && depth > 0) {
      if (src[i] === "{") depth += 1;
      else if (src[i] === "}") depth -= 1;
      i += 1;
    }
    out.set(m[1], (out.get(m[1]) ?? "") + src.slice(from, i - 1));
  }
  return out;
}

/** The class names a block styles ON THEIR OWN, which is what a
    collision is: `.ring` against `.ring`, and not `.ring svg` or
    `.card .ring`, neither of which a bare utility can be. */
function bareClasses(block: string): Set<string> {
  const out = new Set<string>();
  const rule = /(^|[{}])\s*((?:\.[\w\\:[\]().%/-]+\s*,\s*)*\.[\w\\:[\]().%/-]+)\s*\{/g;
  for (const m of block.matchAll(rule)) {
    for (const sel of m[2].split(",")) {
      const one = sel.trim();
      if (/^\.[A-Za-z][\w-]*$/.test(one)) out.add(one.slice(1));
    }
  }
  return out;
}

const blocks = layers(css);
const tw = bareClasses(blocks.get("tw") ?? "");

/* Every layer that is not Tailwind's. `base` is its reset and
   `properties` its `@property` fallbacks; both are emitted, not
   written here, so a name in either is not the site claiming it.
   Everything else in the file was written in `site.css`. */
const THEIRS = new Set(["tw", "base", "properties"]);
const mine = new Set<string>();
for (const [name, block] of blocks) {
  if (THEIRS.has(name)) continue;
  for (const c of bareClasses(block)) mine.add(c);
}

const clash = [...mine].filter((c) => tw.has(c)).sort();

if (clash.length) {
  console.error(`${clash.length} class(es) this site styles are also Tailwind utilities:\n`);
  for (const c of clash) console.error(`  .${c}`);
  console.error("\nA clash does not need the two rules to set the same property. It needs\n"
    + "only that Tailwind sets one the site's rule does not, and then nothing\n"
    + "takes it back off: not specificity, not layer order. `.ring` drew a 1px\n"
    + "square around every progress ring on the site and every check passed.\n"
    + "Rename the site's class, the way `--radius-*` was renamed when the same\n"
    + "thing happened one level down on a token namespace.\n");
  process.exit(1);
}

console.log(`utility clash: ${mine.size} class(es) styled by this site,`
  + ` ${tw.size} utility class(es) emitted, and none of them is both.`);
