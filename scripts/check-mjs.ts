#!/usr/bin/env node
/* ============================================================
   check-mjs.ts: nothing here is `.mjs`.

       node scripts/check-mjs.ts

   THE RULE, AND WHY IT IS A CHECK RATHER THAN A PARAGRAPH.

   `CLAUDE.md` has said "nothing new here is .mjs" since the
   stylesheet moved into Next, and it kept being written anyway.
   The file says why in the sentence that matters: the neighbours
   are the pattern. Somebody adding a test opens the one beside
   it, sees `.mjs`, and writes a sixth. A rule that lives only in
   prose is a rule enforced by whoever last read the prose.

   There is nothing to trade for keeping one. A `.ts` runs under
   node with no build step, no loader and no configuration, since
   type stripping went on by default in 22.18. What it buys is a
   file something can typecheck, and every directory here now has
   a config that does: `scripts/tsconfig.json`,
   `next/tsconfig.test.json` and the ones beside them.

   RENAMING IS HALF OF IT. `scripts/check-types.ts` is the other
   half, and its header is worth reading before converting
   anything: node strips annotations without reading them, so a
   `.ts` that nothing typechecks is a `.js` file wearing them, and
   that is strictly worse than the `.mjs` it replaced because a
   reader now believes them.

   ---- what this reads ----

   Tracked files, out of git, rather than a directory walk.
   `node_modules`, build output and anything ignored are
   therefore out by construction rather than by a list somebody
   maintains. `archive/` is out because it is history: those files
   are not on the site and are not a pattern to copy.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The exceptions, each with the reason it cannot be a `.ts`.
    Keyed by path so that "postcss.config.mjs is allowed" cannot
    quietly become true for a second one somewhere else.

    An entry here has to name a LOADER that will not read another
    extension. "It would be work to convert" is not a reason: that
    is debt, and debt goes in the same commit as the conversion. */
const KEPT: Record<string, string> = {
  "next/postcss.config.mjs":
    "Next loads its PostCSS config by name and reads only .js, .mjs, .cjs "
    + "and .json. There is no .ts form of this file to write.",
};

const tracked = execFileSync("git", ["ls-files", "-z"], { cwd: ROOT, encoding: "utf8" })
  .split("\0")
  .filter(Boolean);

const found = tracked.filter((f) => /\.(mjs|cjs)$/.test(f) && !f.startsWith("archive/"));
const unexplained = found.filter((f) => !(f in KEPT));

/* An exception that has been converted is a line describing
   nothing, and the next reader takes it for a live constraint.
   Same rule `check-pointers.ts` applies to its own GONE table. */
const stale = Object.keys(KEPT).filter((f) => !found.includes(f));

if (stale.length) {
  console.error(`${stale.length} exception(s) name a file that is not there:\n`);
  for (const f of stale) console.error(`   ${f}`);
  console.error("\nRemove them from KEPT in this file. An exception for a file that"
    + " no longer\nexists reads as a live constraint to the next person.\n");
  process.exit(1);
}

if (unexplained.length) {
  console.error(`${unexplained.length} file(s) are .mjs or .cjs:\n`);
  for (const f of unexplained) console.error(`   ${f}`);
  console.error("\nEverything here is TypeScript. Node strips the types with no build"
    + " step, so\nthere is nothing to trade for keeping one, and a directory of .mjs"
    + " is why the\nnext one gets written.\n\n"
    + "Renaming is half of it. The file needs real types and a tsconfig that"
    + " checks\nthem, or it is a .js wearing annotations: see the header of"
    + " scripts/check-types.ts.\n\n"
    + "If a loader genuinely reads no other extension, add it to KEPT in this file"
    + "\nwith that reason.\n");
  process.exit(1);
}

const kept = Object.keys(KEPT).length;
console.log(`mjs: none of ${tracked.length} tracked file(s), `
  + `beyond ${kept} a loader will not read any other way.`);
