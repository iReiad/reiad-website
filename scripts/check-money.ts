#!/usr/bin/env node
/* ============================================================
   check-money.ts: is the money school still the thing MONEY.md
   describes?

       node scripts/check-money.ts
       node scripts/check-money.ts --list    the ladder, with stars

   It asks eight questions, and every one of them is a way a
   lesson can be wrong while the page renders perfectly, which is
   the failure mode this whole repository keeps returning to.

     1. Does every live lesson say how much it matters?
     2. Does `needs` point backwards, at lessons that exist?
     3. Do the two bodies mount the same blocks in the same
        order? They must, because `lesson/body.tsx` walks the two
        lists together.
     4. Does every mount have a block, and every block a mount?
     5. Is every block a kind that exists, with the fields that
        kind needs, naming a lab model that is implemented?
     6. Is a mount a top level element of its body? One inside a
        list is split out of the list and the list closes early.
     7. Does every class used in a body survive both sanitisers?
        A class that does not is a block that arrives plain.
     8. Is a written lesson actually written? A stub that renders
        is worse than a lesson marked `soon`, because a reader
        follows the link.

   ---- what it reads ----

   The ladder in `shared/curricula/money.ts` and the prose in
   `scripts/money/`, which is what SEEDED the rows. It does not
   read the database, deliberately: this runs on a laptop with no
   network, like every other check here. `check-schools.ts`
   already compares the ladder against the committed snapshot,
   which is the question about what is really in D1.
   ============================================================ */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { STAGES, stageLessons } from "../shared/curricula/money.ts";
import { FIGURE_SHAPES } from "../shared/lesson.ts";
import { LAB_IDS } from "../shared/lesson-labs.ts";
import { problemsIn, readWritten } from "./seed-money.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LIST = process.argv.includes("--list");

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(`  x ${line}`);
  detail.forEach((d) => console.error(`        ${d}`));
};

const written = await readWritten();

/* ---------- 1 to 5, which the seeder already knows how to ask ----------

   Written once, in `seed-money.ts`, and called from both. A seed
   that writes a broken lesson has already written it, so the
   validation has to be there; a check that kept its own copy of
   the same questions is the two-descriptions problem this file
   is about not having. */
for (const line of problemsIn(written)) fail(line);

/* ---------- 6. a mount is a top level element ----------

   `splitBody()` cuts the body string at the marker and hands the
   pieces to `dangerouslySetInnerHTML`. A mount inside a `<ul>`
   would put the list's opening tag in one piece and its closing
   tag in another, so the browser closes the list early and the
   rest of it becomes a second list after the block. It renders,
   and it renders wrong. */
const MOUNT_LINE = /<div\s+(?:class="mount"|data-mount=)/;
for (const [stage, lessons] of Object.entries(written)) {
  for (const [slug, content] of Object.entries(lessons)) {
    for (const [lang, body] of [["bn", content.bn], ["en", content.en]] as const) {
      const depth = { at: 0 };
      /* A tag walk rather than a DOM parse, because node has no
         DOM and pulling one in for this would be a dependency
         for one question. Only the block containers count: an
         `<em>` open across a mount is not possible in a body
         these files write, and the ones that are, a list, a
         table, a figure, a blockquote, a div, are all here. */
      const CONTAINER = /<(\/?)(ul|ol|li|table|thead|tbody|tr|figure|blockquote|div)\b[^>]*>/g;
      for (const m of body.matchAll(CONTAINER)) {
        const isMount = MOUNT_LINE.test(body.slice(m.index, (m.index ?? 0) + 40));
        if (isMount) {
          if (depth.at > 0) {
            fail(`${stage}/${slug} (${lang}): a mount sits inside ${depth.at} open element(s)`,
              "A mount is a top level element of a body. `splitBody()` cuts the",
              "string there, so a list holding one closes early and the rest of it",
              "becomes a second list under the block.");
          }
          continue;
        }
        depth.at += m[1] === "/" ? -1 : 1;
      }
    }
  }
}

/* ---------- 7. a class in a body survives both sanitisers ----------

   The server's allowlist is the one that decides, and a class it
   drops is a callout that arrives as a paragraph. Read out of
   `functions/_lib/sanitise.ts` rather than copied, for the
   reason `check-css.ts` gives about a check with its own copy of
   the design. */
const allowed = (() => {
  const src = readFileSync(join(ROOT, "functions/_lib/sanitise.ts"), "utf8");
  const block = src.match(/ALLOWED_CLASSES\s*(?::[^=]+)?=\s*new Set\(\[([\s\S]*?)\]\)/);
  return new Set(block ? [...block[1].matchAll(/"([a-z][\w-]*)"/g)].map((m) => m[1]) : []);
})();

if (!allowed.size) {
  fail("cannot read ALLOWED_CLASSES out of functions/_lib/sanitise.ts",
    "This check has stopped meaning anything until that is fixed.");
} else {
  const seen = new Map<string, string>();
  for (const [stage, lessons] of Object.entries(written)) {
    for (const [slug, content] of Object.entries(lessons)) {
      for (const body of [content.bn, content.en]) {
        for (const m of body.matchAll(/class="([^"]+)"/g)) {
          for (const cls of m[1].split(/\s+/)) {
            if (!allowed.has(cls) && !seen.has(cls)) seen.set(cls, `${stage}/${slug}`);
          }
        }
      }
    }
  }
  for (const [cls, where] of seen) {
    fail(`${where}: uses class "${cls}", which the server's sanitiser strips`,
      "Add it to ALLOWED_CLASSES and KEEP_CLASSES and style it, or use one of",
      `the ${allowed.size} that already exist.`);
  }
}

/* ---------- 8. a written lesson is actually written ----------

   The floor is deliberately generous rather than a target: it is
   there to catch a placeholder, not to police length. What
   MONEY.md asks for is much longer than this and no check can
   ask for interesting. */
const FLOOR = 2500;
for (const [stage, lessons] of Object.entries(written)) {
  for (const [slug, content] of Object.entries(lessons)) {
    for (const [lang, body] of [["bn", content.bn], ["en", content.en]] as const) {
      const text = body.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
      if (text.length < FLOOR) {
        fail(`${stage}/${slug} (${lang}): ${text.length} characters of prose, under ${FLOOR}`,
          "A stub that renders is worse than a lesson marked `soon`, because a",
          "reader follows the link and finds a paragraph where a lesson was promised.");
      }
    }
  }
}

/* ---------- the listing ---------- */

if (LIST) {
  for (const stage of STAGES) {
    const lessons = stageLessons(stage);
    console.log(`\n${stage.kicker} · ${stage.bn}  (${stage.slug})`);
    for (const lesson of lessons) {
      const content = written[stage.slug]?.[lesson.slug];
      const stars = "*".repeat(Number(lesson.stars ?? 0)).padEnd(5, " ");
      const size = content
        ? `${String(Math.round(content.bn.length / 100) / 10)}k bn / ${String(Math.round(content.en.length / 100) / 10)}k en`
        : lesson.status === "live" ? "NOT WRITTEN" : "soon";
      const blocks = content ? `${Object.keys(content.blocks).length} block(s)` : "";
      console.log(`  ${stars} ${lesson.id.padEnd(34)} ${size.padEnd(20)} ${blocks}`);
    }
  }
}

/* ---------- the tally ---------- */

const total = STAGES.flatMap(stageLessons);
const live = total.filter((l) => l.status === "live");
const done = live.filter((l) => written[l.stage.slug]?.[l.slug]);

if (failures) {
  console.error(`\nmoney: ${failures} problem(s).`);
  process.exit(1);
}

console.log(`money: ${done.length} of ${live.length} live lesson(s) written in two languages, `
  + `${Object.values(written).flatMap((s) => Object.values(s)).reduce((a, c) => a + Object.keys(c.blocks).length, 0)} block(s) `
  + `across ${FIGURE_SHAPES.length} figure shapes and ${LAB_IDS.length} lab models.`);
