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
     `_lib/auth.ts` writes the passphrase session and lives in the
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

/* ============================================================
   Stage 3: the account half

   Three panels, all of which already had their endpoint. Every
   claim here is about SOURCE and every one of them is true of a
   page that renders perfectly, which is why this file is node
   rather than a browser.
   ============================================================ */
{
  const courses = read("next/components/admin/courses-panel.tsx");
  const live = read("next/components/admin/live-panel.tsx");
  const routine = read("next/components/admin/routine-panel.tsx");
  const shell = read("next/components/admin/panel.tsx");

  /* The rule `check-courses.ts` enforces, asserted here too because
     this is the panel most likely to want the catalogue: a value
     import would put 1,629 Drive ids in a public bundle and the
     page would look identical. */
  ok("the courses panel imports no catalogue values",
    !/^import\s+(?!type\b)[^;]*@reiad\/shared\/courses/m.test(courses));
  ok("it reads the counts from the Worker instead",
    courses.includes("/api/courses/status"));

  /* ADMIN.md §5: a missing credential names what it would open
     rather than drawing an empty list. That is the rule
     `app/desk.test.ts` was written for, and an empty panel is
     indistinguishable from a broken one. */
  for (const [name, src] of [
    ["courses", courses], ["live", live], ["routine", routine],
  ] as const) {
    ok(`the ${name} panel says what a missing credential would open`,
      /denied/.test(src) && /admin|sign in|Sign in/.test(src));
  }

  /* An empty list from /api/routine/templates means "not an admin"
     AND "an admin with nothing", so the panel has to tell them
     apart by whether there is a reader at all. */
  ok("the routine panel tells an empty list from a refusal",
    routine.includes("signedout") && routine.includes("denied"));

  /* The levers that WRITE stay on /tools/live for now, and the
     panel says so. Two write paths is how a site ends up with two
     that disagree. */
  ok("the live panel keeps one write path and names it",
    live.includes("/tools/live") && !/method:\s*["']P(UT|OST)["']/.test(live));

  ok("the shell mounts all three behind the account credential",
    /account \?/.test(shell)
    && shell.includes("<CoursesPanel />")
    && shell.includes("<LivePanel />")
    && shell.includes("<RoutineTemplatesPanel />"));

  /* The panel that has to work on the day a credential is broken
     cannot be the panel that throws when one is missing. */
  ok("the shell degrades rather than throwing when /account.js is absent",
    /\} catch \{/.test(shell));
}

/* ============================================================
   6. Stages 4 and 5: the passphrase half

   Every claim here is one that a panel rendering perfectly would
   still break. The browser half is app/desk.test.ts, which is
   still pointed at /desk because /desk is still served: these
   panels are not a replacement until they have been driven, and
   that is the one thing this file cannot assert.
   ============================================================ */
{
  console.log("\n  the passphrase half");

  const engine = read("next/components/admin/queue.tsx");
  const specs = read("next/components/admin/queues.tsx");
  const pieces = read("next/components/admin/pieces-panel.tsx");
  const subs = read("next/components/admin/subscribers-panel.tsx");
  const overview = read("next/components/admin/overview-panel.tsx");
  const shell = read("next/components/admin/panel.tsx");
  const desk = read("app/src/Published.tsx");

  /* ADMIN.md's second rule, in the one place all three queues get
     it from. 401 is the passphrase and 403 a session without the
     right; a panel that read either as "no rows" would look
     exactly like a working one. */
  ok("the queue engine tells a refusal from an empty list",
    /401/.test(engine) && /403/.test(engine)
    && engine.includes('"locked"') && /spec\.empty/.test(engine));

  /* An action changes a status, and a status is what the filter
     filters on: a row edited in place stays in a queue it is no
     longer in, which reads as a button that did nothing. */
  ok("and refetches after an action rather than editing in place",
    /await load\(\)/.test(engine) && !/setRows\(\(/.test(engine));

  /* Three specs, one engine. A fourth queue should be an object. */
  for (const q of ["Comments", "Questions", "Enquiries"]) {
    ok(`${q} is a spec rather than a component`,
      specs.includes(`title: "${q}"`) && specs.includes("AdminQueue"));
  }

  /* `?status=published` takes /api/questions down its PUBLIC
     branch: no email, no counts, and no 401 for somebody without
     the passphrase. Offering it as a filter would quietly show
     the reader's list inside the admin panel. */
  ok("the questions queue does not offer the filter that is public",
    !/id: "published"/.test(specs));

  /* Every action the desk had. A port is finished when it does
     what the thing it replaced did, not when it renders, and
     those two look identical from here. */
  for (const action of [
    "Unpublish", "Publish", "History", "Draw card", "Copy link", "Delete", "Move to",
  ]) {
    ok(`Published keeps "${action}"`, pieces.includes(action),
      `app/src/Published.tsx has it and the port does not`);
  }
  ok("and the desk it was ported from still has them too", desk.includes("Draw card"),
    "if this fails the comparison above has stopped meaning anything");

  /* Restoring is itself an overwrite and is snapshotted, which is
     the sentence that makes the button pressable. */
  ok("History says that going back is undoable",
    /can be undone/.test(pieces));

  /* ADMIN.md B 5: "there is no mailing tool on this site and this
     panel is not the place to grow one". */
  /* Asserted as a fact about the CALLS rather than about the
     words: the panel's own prose says "nothing may send to that
     state", which a search for "send" would fail on. What would
     make this a mailing tool is a write. */
  ok("Subscribers offers an export and makes no write",
    /subscribers\/export/.test(subs)
    && !/method:\s*["'](?:POST|PUT|PATCH|DELETE)["']/.test(subs));

  /* Numbers come from the data. A count typed into this panel is
     the failure CLAUDE.md opens with. */
  ok("Waiting counts rather than remembering",
    /adminCall/.test(overview) && !/\b(?:drafts|comments|questions):\s*\d+/.test(overview));

  ok("the shell mounts the passphrase half",
    ["<OverviewPanel />", "<PiecesPanel />", "<CommentsPanel />",
     "<QuestionsPanel />", "<EnquiriesPanel />", "<SubscribersPanel />"]
      .every((tag) => shell.includes(tag)));

  /* Stage 5 is not finished until /desk goes to archive/, and the
     panel must not claim otherwise while it is still served. */
  /* The route, not the built bundle: `aab/desk/app.js` is what
     the route LOADS, and it would still be sitting there the day
     the page stopped being served. */
  const deskServed = existsSync(join(ROOT, "next/app/(site)/desk/page.tsx"));
  ok(deskServed
    ? "the panel admits /desk is still served"
    : "/desk has retired and the panel no longer points at it",
    deskServed ? shell.includes("/desk") : !shell.includes("/desk"));
}

console.log(`\n${passed} checks passed`);
if (failures.length) {
  console.log(`${failures.length} failed:\n`);
  for (const f of failures) console.log(`  x ${f}`);
  process.exit(1);
}
