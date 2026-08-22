#!/usr/bin/env node
/* ============================================================
   check-dashes.ts: has an em dash got in?

       node scripts/check-dashes.ts

   The top of `CLAUDE.md` bans one character everywhere on this
   site, and explains that the character is not written out
   anywhere in this repository on purpose: a rule that contains
   the character it bans always matches itself.

   ---- why this is a script and not a line in the workflow ----

   It was a line in the workflow, which made it the one rule in
   `checks.yml` that `check-all.ts` did not run. That file is
   supposed to BE the list, and this was the exception, so a
   laptop could not catch what CI would fail on. It caught
   `scripts/diet.test.ts`, whose own assertion that no em dash
   exists was written with one in it, on a commit where every
   local check passed.

   The character is built from its code point below rather than
   typed, for the reason above.

   ---- what it reads ----

   Every tracked file outside `archive/`, which is frozen history
   and not a source. Wider than the grep it replaces, which named
   six directories and therefore said nothing about `DIET.md`,
   `README.md` or a migration.
   ============================================================ */

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/** U+2014, built rather than written, so this file does not fail
    itself the way the rule in `CLAUDE.md` describes. */
const EM = String.fromCharCode(0x2014);

/** A file allowed to carry one, and why. Keyed by path, with a
    reason, because "it is probably fine" is how a list stops
    meaning anything.

    A generated file only qualifies if NOTHING HERE WRITES IT: a
    generator of ours that emitted one would be a bug to fix in
    the generator, not an entry here. */
const ALLOWED: Array<{ file: string; why: string }> = [
  {
    file: "next/AGENTS.md",
    why: "written and re-added by `next dev` itself; the note at the top of "
      + "next/AGENTS.md names the generator. Nothing here writes it, and "
      + "deleting the line only re-creates the uncommitted change.",
  },
];

const SKIP = new Set(ALLOWED.map((a) => a.file));

/** Anything whose bytes are not prose. A JPEG containing 0x2014
    by coincidence is not a punctuation decision. */
const BINARY = /\.(png|jpe?g|webp|gif|ico|woff2?|ttf|otf|pdf|zip|db|mp4|wasm)$/i;

const tracked = execFileSync("git", ["ls-files"], { cwd: ROOT, encoding: "utf8" })
  .split("\n")
  .filter(Boolean)
  .filter((f) => !f.startsWith("archive/") && !SKIP.has(f) && !BINARY.test(f));

const found: string[] = [];
for (const file of tracked) {
  let text: string;
  try { text = readFileSync(join(ROOT, file), "utf8"); } catch { continue; }
  if (!text.includes(EM)) continue;
  text.split("\n").forEach((line, i) => {
    if (line.includes(EM)) found.push(`${file}:${i + 1}: ${line.trim().slice(0, 90)}`);
  });
}

if (found.length) {
  console.error(`${found.length} em dash(es):\n`);
  for (const line of found) console.error(`   ${line}`);
  console.error("\nThe top of CLAUDE.md has the table of what to use instead. A"
    + " sentence that\nneeds one is usually two ideas that have not been"
    + " separated properly.\n\nIf a file must carry one, add it to ALLOWED in"
    + " this check with the reason.\n");
  process.exit(1);
}

console.log(`dashes: none in ${tracked.length} tracked file(s),`
  + ` ${ALLOWED.length} allowed by name.`);
