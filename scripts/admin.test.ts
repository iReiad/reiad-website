#!/usr/bin/env node
/* ============================================================
   admin.test.ts: the admin panel's constraints, as assertions.

       node scripts/admin.test.ts

   `ADMIN.md` is a plan, and a plan is prose. These are the parts
   of it that can be broken silently, written down so that
   breaking one fails rather than being noticed a month later by
   somebody reading the file again.

   ---- why node and not a browser ----

   Everything here is a claim about SOURCE: which gate a file
   mentions, what a route's metadata says, whether the health
   endpoint returns a value it should not. A browser test would
   run in fewer places and would not catch any of it, because all
   of it is true of a page that renders perfectly.

   The browser half is what `app/desk.test.ts` already is for the
   desk, and it moves across panel by panel as ADMIN.md §6 stage
   5 moves them.
   ============================================================ */

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p: string): string => readFileSync(join(ROOT, p), "utf8");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};

/* ============================================================
   1. The route exists, and is not published
   ============================================================ */
console.log("\nthe route");
{
  const page = "next/app/(site)/admin/page.tsx";
  const layout = "next/app/(site)/admin/layout.tsx";

  ok("there is a page", existsSync(join(ROOT, page)));
  /* The one that shipped broken: /tools/routine had no layout for
     four pull requests, so it rendered with no stylesheet and no
     shell. `check-routes.ts` fails on it now and this says it
     again for the page it matters most on. */
  ok("and a layout, which is where the stylesheet comes from",
    existsSync(join(ROOT, layout)));

  const src = read(page);
  ok("it is noindex", /robots:\s*\{[^}]*index:\s*false/.test(src),
    "an admin page in the index is a 403 promised to a crawler");

  const nav = read("next/lib/nav.ts");
  const entry = nav.slice(nav.indexOf('href: "/admin"') - 200,
    nav.indexOf('href: "/admin"') + 200);
  ok("and unlisted in the one nav table", /unlisted:\s*true/.test(entry),
    "a link in the rail to a page a reader cannot open is the promise "
    + "`unlisted` exists to avoid");
}

/* ============================================================
   2. Health answers no values, only booleans and shapes
   ============================================================ */
console.log("\nhealth gives nothing away");
{
  const src = read("functions/api/admin/[[route]].ts");

  /* The rule the endpoint's own header sets. These are the four
     names whose VALUES would be a leak, and the test is that each
     appears only inside a Boolean() or a length. */
  for (const secret of ["SUPABASE_KEY", "GOOGLE_SA_KEY", "GOOGLE_SA_EMAIL",
    "BROKER_TOKEN_KEY"]) {
    const uses = src.split("\n")
      .filter((l) => l.includes(`env.${secret}`) && !l.trim().startsWith("*"));
    const leaked = uses.filter((l) =>
      !/Boolean\(|&&|\?|apikey:/.test(l));
    ok(`${secret} is asked about and never returned`, leaked.length === 0,
      leaked.join(" | "));
  }

  ok("it is a GET and nothing else", /methods\(request,\s*\{\s*GET:/.test(src));
  ok("and any other route under /api/admin is a 404",
    /route !== "health"/.test(src));
}

/* ============================================================
   3. Neither credential is ever minted from the other
   ============================================================ */
console.log("\nthe two credentials stay two");
{
  const panel = read("next/components/admin/panel.tsx");

  /* The browser must never be able to turn one into the other.
     `_lib/auth.js` writes the passphrase session and lives in the
     Worker; a component importing anything that mints one would
     be the failure ADMIN.md §1 names first. */
  ok("the panel mints no session",
    !/setAdminKey|createSession|sessionCookie/.test(panel));
  /* And it never asks for a service-role key, which this project
     does not hold and which this panel is not a reason to start
     holding. */
  ok("and asks for no service role",
    !/service_role|SERVICE_ROLE/.test(panel));

  /* It learns the account half by asking for something only an
     admin gets, rather than by keeping a second list: isAdmin()
     is the Worker's answer and a copy here would be the drift
     _lib/admins.ts exists to stop. */
  ok("it keeps no second admin list",
    !/ADMIN_READERS|public\.admins/.test(panel));
  ok("and asks the Worker instead",
    panel.includes("/api/routine/templates") || panel.includes("/api/admin"));
}

/* ============================================================
   4. A locked panel says so
   ============================================================ */
console.log("\nnothing locked looks empty");
{
  const panel = read("next/components/admin/panel.tsx");
  const health = read("next/components/admin/health.tsx");

  /* The rule app/desk.test.ts was written for: an empty list
     where a credential is missing looks exactly like a working
     panel with nothing in it. */
  ok("a missing credential names what it would open",
    /Not held\. It would open/.test(panel));
  ok("and offers the one thing to press",
    /Sign in at the Studio/.test(panel) && /Sign in to your account/.test(panel));

  ok("a Worker that does not answer is said, not drawn as nothing",
    /no answer from/.test(health));

  /* Three states and not two. "Not configured" painted as
     "broken" sends somebody looking for a fault that is a
     setting. */
  ok("the dot has three states",
    /"up"/.test(health) && /"down"/.test(health) && /"unset"/.test(health));
}

/* ============================================================
   5. ADMIN.md names files that exist, or does not name them
   ============================================================ */
console.log("\nthe plan points somewhere");
{
  /* `check-pointers.ts` already enforces this across every
     tracked file, and it caught this very plan naming two files
     that had not been written. It is asserted again here because
     ADMIN.md is the file most likely to name something ahead of
     itself, being a plan. */
  const plan = read("ADMIN.md");
  const named = [...plan.matchAll(/`((?:scripts|next|app|functions)\/[\w./[\]-]+)`/g)]
    .map((m) => m[1]);
  const missing = [...new Set(named)].filter((p) => !existsSync(join(ROOT, p)));
  ok("every path it names exists", missing.length === 0, missing.join(", "));
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
