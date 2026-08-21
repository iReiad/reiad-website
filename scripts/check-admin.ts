#!/usr/bin/env node
/* ============================================================
   check-admin.ts: every endpoint is gated, or is public on
   purpose and says why.

       node scripts/check-admin.ts

   ---- the failure this exists for ----

   Adding a route under `functions/api/` and forgetting the gate
   produces a working endpoint. It answers, it returns the right
   shape, every other check passes, and the only symptom is that
   it works for everybody. There is no error to see and no page
   that looks wrong, which is why this is a check rather than a
   habit.

   ---- two gates, and they are not interchangeable ----

   `requireAdmin()` in `functions/_lib/auth.ts` is the Studio
   passphrase: a session cookie over D1, and it opens the site's
   own content.

   `isAdmin()` in `functions/_lib/admins.ts` is a signed-in
   reader holding extra rights, and it opens rows in Supabase
   that row-level security answers with the reader's own JWT.

   A file may use either or both. `ADMIN.md` §1 is why neither
   can stand in for the other, and `functions/api/comments` is
   the one file that uses both, for two different questions.

   ---- what this does NOT check ----

   That the gate is on the right METHOD. Most endpoints here are
   mixed on purpose: a GET that anybody may make and a POST only
   an admin may. Deciding which verbs need which gate is a
   judgement per endpoint, and a check that guessed would be
   wrong often enough to be turned off. What this catches is the
   file that mentions neither gate anywhere, which is a different
   and much more mechanical claim.
   ============================================================ */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const API = join(ROOT, "functions", "api");

/* ---------- public on purpose ----------

   Keyed by path AND carrying a reason, for the same reason
   `GONE` in `check-pointers.ts` is keyed by two things: "this
   endpoint is public" is a true sentence about several of them
   and a NEW ungated one is not covered by somebody else's
   entry. */
const PUBLIC: Record<string, string> = {
  "admin/[[route]].ts":
    "health, and it is the one panel that has to work on the day the "
    + "credential is what is broken. It answers booleans and shapes, never "
    + "values: see the head of that file.",
  "news.ts":
    "the market board on the Insights hub. Public headlines, raced from two "
    + "public endpoints, cached at the edge.",
  "search.ts":
    "the palette. It searches what is already published, which is what a "
    + "crawler reads anyway.",
};

const files: string[] = [];
const walk = (dir: string): void => {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else if (/\.(js|ts)$/.test(name) && !/\.test\.[a-z]+$/.test(name)) files.push(full);
  }
};
walk(API);
files.sort();

let bad = 0;
const seen = new Set<string>();

for (const full of files) {
  const rel = relative(API, full).split("\\").join("/");
  const src = readFileSync(full, "utf8");
  const gated = /\b(requireAdmin|isAdmin)\s*\(/.test(src);

  if (gated) {
    if (PUBLIC[rel]) {
      bad += 1;
      seen.add(rel);
      console.error(`\n  x functions/api/${rel} is listed as public and gates itself.`);
      console.error("        Take it out of PUBLIC in this file: an exception that is not");
      console.error("        one is the stale entry the list is keyed by path to avoid.");
    }
    continue;
  }

  if (PUBLIC[rel]) { seen.add(rel); continue; }

  bad += 1;
  console.error(`\n  x functions/api/${rel} mentions neither gate.`);
  console.error("        requireAdmin() is the Studio passphrase, isAdmin() is a reader");
  console.error("        holding extra rights, and ADMIN.md §1 says why neither can stand");
  console.error("        in for the other. If this endpoint really is public, add it to");
  console.error("        PUBLIC in scripts/check-admin.ts with the reason.");
}

/* A stale exception is the other half, for the reason above. */
for (const rel of Object.keys(PUBLIC)) {
  if (seen.has(rel)) continue;
  bad += 1;
  console.error(`\n  x PUBLIC names functions/api/${rel}, which is not there.`);
  console.error("        Remove the entry. A list of exceptions nobody prunes stops being");
  console.error("        a description of anything.");
}

console.log(
  bad
    ? `\nadmin: ${bad} problem(s).`
    : `admin: ${files.length} endpoint file(s), ${Object.keys(PUBLIC).length} public on purpose.`,
);
process.exit(bad ? 1 : 0);
