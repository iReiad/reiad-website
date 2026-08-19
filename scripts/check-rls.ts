#!/usr/bin/env node
/* ============================================================
   check-rls.ts: every table in Supabase is somebody's, and the
   ones that are not say so out loud.

       node scripts/check-rls.ts

   THE BUG THIS EXISTS FOR, and it shipped.

   `public.profiles` is readable by anyone, deliberately: a comment
   shows its author's name to somebody who is not signed in.
   `getProfile()` then read it with no `id=eq.<me>` filter, so
   PostgREST answered with whichever row the planner reached first
   out of the WHOLE table, and the account page drew a stranger's
   name, courses and pace as the reader's own. #159 has the whole
   story.

   The filter was the fix. This is the other half: making the
   PROPERTY that made it dangerous impossible to acquire by
   accident. A table whose select policy is `using (true)` is a
   table where a missing filter is a leak rather than a
   redundancy, and there is exactly one of those and it is written
   down below with its reason.

   ---- and the failure that costs more than a leak ----

   A `create table` with no `enable row level security` after it.
   Postgres does not warn, the site works perfectly, every check
   passes, and the table is world readable and world writable
   through the publishable key that is in the browser on every
   page. It is one forgotten line and there is no symptom.

   That is the whole argument for this being a check rather than a
   habit: the routine tables landed with four policies each
   because somebody was paying attention on the day, and the fifth
   table somebody adds at midnight will not be.

   ---- what it deliberately does not do ----

   It does not connect to anything. It reads
   `supabase/migrations/`, which is the only description of this
   database that a laptop with no network and CI with no
   credentials can both see. The live behaviour was proved by
   hand against the real database with real JWT claims, and
   `ROUTINE.md` records the four queries; what cannot be proved
   by hand every time is that nobody has since added a table and
   forgotten the line.
   ============================================================ */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = join(ROOT, "supabase", "migrations");

/** Tables whose select policy really is `using (true)`, each with
    the reason it is not a mistake.

    An entry here is a claim that everything in the table is
    public, and it is the strongest claim in this file: it means a
    read of that table without a filter returns other people's
    rows and looks exactly like a read that worked. Anything added
    here needs the same sentence `profiles` has. */
const PUBLIC_ON_PURPOSE: Record<string, string> = {
  profiles:
    "A comment shows its author's name to somebody who is not signed in, and "
    + "the name is the whole of what the table holds. Every read of it carries "
    + "id=eq.<me> anyway: see getProfile() in aab/src/account.ts and #159.",
};

/** Tables that deliberately have no policy for one of the four
    verbs, each with the reason. Keyed by `<table>.<verb>`. */
const NO_POLICY_ON_PURPOSE: Record<string, string> = {
  "profiles.delete":
    "Deleting the account in auth.users takes the profile with it through the "
    + "cascade, which is the only way a profile should ever disappear.",
  "profiles.insert":
    "handle_new_user() inserts it, security definer, when the account is made.",
  "admins.insert": "Granted only in SQL. No browser token may mint an admin.",
  "admins.update": "Same.",
  "admins.delete": "Same.",
  "routine_templates.insert-site":
    "owner_id is null is a template the site ships, inserted by a migration, "
    + "so no combination of browser tokens can mint one.",
};

const files = readdirSync(DIR).filter((f) => f.endsWith(".sql")).sort();
const sql = files.map((f) => readFileSync(join(DIR, f), "utf8")).join("\n");

/* Comments out first. Every table name and policy in this file is
   discussed in prose above the statement that makes it, and a
   regex that cannot tell the two apart reports a table as having
   a policy because a paragraph mentioned one. */
const code = sql.replace(/^\s*--.*$/gm, "");

const tables = [...code.matchAll(/create table (?:if not exists )?public\.([a-z_]+)/g)]
  .map((m) => m[1]);
const unique = [...new Set(tables)].sort();

let failures = 0;
const fail = (line: string, ...detail: string[]): void => {
  failures += 1;
  console.error(line);
  for (const d of detail) console.error(`        ${d}`);
};

const VERBS = ["select", "insert", "update", "delete"] as const;

for (const table of unique) {
  /* ---- 1. row-level security is on ---- */
  const armed = new RegExp(
    `alter table public\\.${table} enable row level security`,
  ).test(code);
  if (!armed) {
    fail(`OPEN     public.${table} has no "enable row level security"`,
      "Postgres does not warn, the site works perfectly, every other check",
      "passes, and the table is readable AND writable by anyone holding the",
      "publishable key, which is in the browser on every page of this site.");
    continue;
  }

  /* ---- 2. it has a policy for each verb, or says why not ---- */
  const policies = [...code.matchAll(
    new RegExp(`create policy\\s+"([^"]+)"\\s*\\n?\\s*on public\\.${table} for (\\w+)([\\s\\S]*?)(?=\\n\\s*\\n|drop policy|create |alter |$)`, "g"),
  )];
  const byVerb = new Map<string, string>();
  for (const p of policies) byVerb.set(p[2], p[3]);

  for (const verb of VERBS) {
    if (byVerb.has(verb)) continue;
    if (`${table}.${verb}` in NO_POLICY_ON_PURPOSE) continue;
    fail(`NO ${verb.toUpperCase().padEnd(6)} public.${table} has row-level security on and no ${verb} policy`,
      "RLS with no policy denies everything, so this fails closed rather than",
      "open. It is still a table nobody can use. Add the policy, or add",
      `"${table}.${verb}" to NO_POLICY_ON_PURPOSE in this file with the reason.`);
  }

  /* ---- 3. and the one that shipped as a bug ---- */
  const select = byVerb.get("select") ?? "";
  const wideOpen = /using\s*\(\s*true\s*\)/.test(select);
  const explained = table in PUBLIC_ON_PURPOSE;

  if (wideOpen && !explained) {
    fail(`PUBLIC   public.${table} is readable by anyone: its select policy is using (true)`,
      "That makes a read with no filter return other people's rows, and look",
      "exactly like a read that worked. It is how the account page came to draw",
      "a stranger's profile for a fortnight while 117 checks passed (#159).",
      "If it really is public, add it to PUBLIC_ON_PURPOSE with the reason.");
  }
  if (!wideOpen && explained) {
    fail(`STALE    public.${table} is in PUBLIC_ON_PURPOSE and is not public any more`,
      "An exception describing nothing reads as a live constraint to the next",
      "person. Take it out of the table in this file.");
  }
}

/* A named exception for a table that no longer exists is the same
   failure `check-pointers.ts` and `check-mjs.ts` both guard, and
   it is worth guarding here for the reason those two give: a
   stale line costs nothing until somebody believes it. */
for (const named of Object.keys(PUBLIC_ON_PURPOSE)) {
  if (!unique.includes(named)) {
    fail(`GONE     PUBLIC_ON_PURPOSE names public.${named}, which no migration creates`);
  }
}
for (const key of Object.keys(NO_POLICY_ON_PURPOSE)) {
  const table = key.split(".")[0];
  if (!unique.includes(table)) {
    fail(`GONE     NO_POLICY_ON_PURPOSE names public.${table}, which no migration creates`);
  }
}

console.log(
  failures
    ? `\n${failures} problem(s) with row-level security: fix before deploying.`
    : `rls: ${unique.length} table(s), every one armed, `
      + `${Object.keys(PUBLIC_ON_PURPOSE).length} readable by anyone on purpose.`,
);
process.exit(failures ? 1 : 0);
