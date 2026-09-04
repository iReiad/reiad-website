# The admin panel

A plan, in the shape `ROUTINE.md` is in: the constraints first,
then what each panel shows and where every number comes from,
then what it deliberately will not do, then the order to build it.

**Stages 1 to 6 of §6 are built.** People (§3 D) and the research
desk (§7) are what is left.

## 0. The rule this whole plan is under

**An admin panel is the one page on a site where a wrong number is
expensive.** It is what somebody looks at before deciding whether
something is broken, so the rule at the top of `CLAUDE.md` binds
hardest here: **if it says how many of something there are, it
counts them.** Nothing on this page is a figure typed into a
sentence, and nothing is a figure cached at a build.

Second: a page that renders is not a page that works. Every panel
below gets a line in `next/admin.test.ts` saying what it must be
able to do.

## 1. Two credentials, and "together" does not mean "either"

There are two admin credentials on this site and they are **not
two ways of proving the same thing**. They authorise different
data, held in different places, reachable only by different means.

| | the passphrase | the account |
| --- | --- | --- |
| what it is | `functions/_lib/auth.ts`: PBKDF2-SHA256 in the browser, a verifier in D1, a session cookie | `functions/_lib/admins.ts`: a reader id in `ADMIN_READERS` or in `public.admins` |
| what it opens | the site's own content in D1 and R2 | the reader's own rows in Supabase, under RLS |
| how it is checked | `requireAdmin(context)` | `isAdmin(env, request, readerId)` |
| endpoints | `auth` `articles` `media` `subscribers` `notion` `signals` `comments` `questions` `enquiries` `backup` | `courses` `broker` `routine` `comments` |

**Neither can stand in for the other, and that is a fact about the
storage rather than a policy.** A passphrase session cannot read a
row out of Supabase, because row-level security answers the
reader's own JWT and a cookie is not one. An account bearer cannot
write an article, because D1 has no notion of a Supabase reader.

So "available through my admin account and the passphrase
together" resolves to:

> **One panel, two credentials, and each panel appears when the
> credential it needs is present.** Holding both shows the whole
> thing. Holding one shows the half that credential can honestly
> reach, and says plainly what the other half needs.

`comments` is the one endpoint that consults both, and it consults
them for **different questions**. The passphrase decides whether a
stranger's comment goes live; the account decides whether the
admin's own comment skips the queue. Same endpoint, two powers,
neither substitutable.

### What the panel must never do

**Never mint one credential from the other.** A "sign in with your
account to unlock the Studio" button would make the passphrase
pointless, and a "hold the passphrase to read anybody's rows"
route would be a service-role key by another name. This project
holds no service-role key and this panel is not a reason to start.

**Never show a locked panel as an empty one.** A panel that needs
the passphrase and does not have it says so, with the one thing to
press. An empty list where a credential is missing is the failure
the desk's browser test was written for: it looks exactly like a
working panel with nothing in it.

## 2. Where it lives

`/admin`, as a Next route under `next/app/(site)/admin/`, with a
`layout.tsx` mounting the shell. That last clause is not
boilerplate: a route without one renders as bare HTML with no
stylesheet, and `check-routes.ts` fails on it.

`unlisted: true` in `shared/nav.ts`, exactly as
`/skills/courses/` is. The entry is in the one table so the menu
is still said once, the rail and the footer skip it, and a link in
the footer to a page that answers 403 is a promise the site cannot
keep.

**It absorbed `/desk` rather than sitting beside it.** Two admin
pages is two places to look, and the second one is always the
stale one.

`/desk` is retired and `aab/_redirects` sends all four spellings
of the address to `/admin` with a 301. The address is a rule
rather than a route now, so it is absent from `run_worker_first`
in `wrangler.toml` and from `NEXT_ROUTES` in `worker.js`: a path
either of those claims never reaches the rules file.

`next/components/ui/tab-panels.tsx` is the arrangement, the same
one `/account` uses: the fragment chooses, `replaceState` rather
than assigning `location.hash`, arrows and Home and End on a
roving tabindex, and nothing hides until the first effect has run.

## 3. The panels

Grouped by the credential each needs. Every number names where it
comes from, because a number with no source is the thing this file
opened by banning.

### A. Needs neither: the front page of the panel

**Health.** The one panel that answers "is anything broken",
drawn from things the site already publishes.

| | |
| --- | --- |
| the two Workers | `check-live.ts` asks the service binding and the second Worker's scripts. The panel asks the same two questions live. |
| the last deploy | the commit `/version.json` carries, against `origin/main` |
| the crons | `wrangler.toml` declares `*/15 * * * *` and `17 3 * * *`; `check-crons.ts` already fails on one the Worker stopped listening for. This shows the last time each actually ran, out of a row the cron writes. |
| the service worker | `VERSION` in `aab/sw.js`, against what a browser is holding |
| the database | one `select 1` against D1 and one against Supabase, with the round trip |

Nothing here is private, which is why it needs no credential: it
is what a reader could infer from the site being up. **The panel
has to be useful on the day the credential is the thing that is
broken.**

### B. Needs the passphrase: the site's own content

These are the desk's nine, plus what the desk never had.

1. **Overview.** Drafts, live pieces, unanswered questions,
   unapproved comments, unread enquiries, each a count of rows and
   each a link into the panel that holds them.
2. **Published.** Every piece in D1: search, filter by section,
   sort by date or by views. Actions: unpublish, edit in the
   Studio, redraw the share card, which is the one that matters
   because `aab/share-card.js` flags any piece whose cover is
   still a raw photo.
3. **Comments.** The moderation queue. Approve, reject, delete,
   and see the thread a comment is in. `functions/api/comments`
   already answers all four.
4. **Questions** and **Enquiries.** Reader questions and the
   contact form. Answer, archive, mark read.
5. **Subscribers.** The list, the confirmed count, and an export.
   Nothing else: there is no mailing tool on this site and this
   panel is not the place to grow one.
6. **Media.** R2. What is stored, how big, what references it, and
   **what nothing references**, which is the panel the desk never
   had and the one that would actually recover space.
7. **Schools.** Every lesson across the four ladders, out of D1.
   Which stages have empty bodies, which lessons no stage
   declares, which links inside a lesson body are dead.
   `check-schools.ts` compares the ladders; this shows the prose.
8. **Backups.** When the nightly R2 backup last ran, how big it
   was, and the last commit of `content/articles.backup.json`.
   Restoring stays a command line: `scripts/restore.ts` prints SQL
   to read before running, and a button that runs it is a button
   with one catastrophic outcome.
9. **History.** What changed and when, which the desk has.

### C. Needs the account: what is scoped to a reader

10. **Courses.** The third-party catalogue, counted out of
    `shared/courses.data.json` rather than typed. Whether Drive is
    reachable (`canReachDrive()`), which ids fail to open, and
    which lessons have a video with no captions. The section is
    already behind `isAdmin()`; this is the panel that says
    whether it works.
11. **Live portfolio.** The broker panel that already exists on
    `/tools/live`, moved here: the key behind the public feed, the
    switches deciding what a stranger sees, and the site account
    unsanitised.
12. **Routine templates.** The private ones, which
    `/api/routine/templates` already serves behind `isAdmin()`.
    Add one, edit one, retire one.

### D. Needs both, and says so

13. **People.** The only panel that genuinely needs the two
    credentials at once, and the reason the "together" question
    has a real answer rather than a tidy one.

    A person here is a Supabase account (`profiles`, and whether
    `public.admins` holds them) **and** a set of D1 rows written
    under their name (comments, questions, enquiries). Neither
    store knows about the other, so joining them needs a reader
    bearer for the first and a passphrase session for the second:
    this panel appears only when both are held, and with one it
    says which is missing.

    What it shows: who has an account, when they last turned up
    (`days-active`), what they have saved, and their comments. What
    it deliberately does **not** show is anybody's progress, notes,
    targets or routine. Those are theirs. RLS already makes them
    unreadable from here and the panel must not read as though a
    service-role key would be an improvement.

## 4. What it deliberately will not have

- **No analytics beyond what the site already counts.** `countView`
  exists and its number is honest. A funnel, a session recording
  or a per-reader trail would be a new kind of data collected for
  the first time to fill a panel, which is backwards.
- **No destructive one-click.** Delete a comment, yes. Drop a
  table, restore a backup, or erase an account: those stay in SQL
  where they can be read first.
- **No second copy of any list.** Every count comes from
  `shared/content.ts`, `shared/courses.ts`, `shared/schools.ts` or
  a live query. If a panel wants a number nothing counts yet, the
  fix is to make something count it.
- **No writing to Supabase as anybody but the reader.** No
  service-role key. Not for this.
- **No notifications.** There are none on this site and there will
  not be any; `/account` already says so to readers and the same
  holds here.

## 5. The checks this needs, before the panels

Each one exists because the failure it catches is invisible.

- **`scripts/check-admin.ts`.** Every endpoint under
  `functions/api/` is gated by `requireAdmin`, by `isAdmin`, or is
  deliberately public and named in a list with its reason. It
  exists because adding a route and forgetting the gate produces a
  working endpoint, and the only symptom is that it works for
  everybody.
- **`scripts/admin.test.ts`.** The parts of this plan that can be
  broken silently, written down: the route has a layout and is
  noindex and unlisted, the health endpoint returns no secret's
  value, the panel mints neither credential from the other and
  keeps no second admin list, and a missing credential names what
  it would open rather than drawing an empty list, which is the
  rule the desk's browser test was written for.

  Node rather than a browser, and deliberately: every claim there
  is a claim about SOURCE, and all of it is true of a page that
  renders perfectly. The browser half is `next/admin.test.ts`.

  It also asserts that **every path this file names exists**,
  which is `check-pointers.ts` again, said a second time for the
  one file most likely to name something ahead of itself.
- The component debt ledger. Every panel is built from
  `next/components/ui/`, so `check-components.ts` does not move.

## 6. Build order

Each stage ships and merges on its own. Nothing here needs the
stage after it.

| | | |
| --- | --- | --- |
| 1 | the route, the shell, the two sign-ins, Health | a page that is useful before any panel exists. **Done** |
| 2 | `check-admin.ts` | before there are more endpoints to forget. **Done** |
| 3 | Courses, Live portfolio, Routine templates | the account half. **Done** |
| 4 | Comments, Questions, Enquiries | the passphrase half. **Done** |
| 5 | Published, Subscribers, History | the rest of the desk, and `/desk` retires. **Done** |
| 6 | Media, Schools, Backups | the three the desk never had. **Done** |
| 7 | People | last, because it is the only one needing both |
| 8 | the research desk | not a panel, and see below |


### What the stages left undone on purpose

**Routine templates are read-only.** Adding, editing and retiring
one needs PUT and DELETE that `/api/routine/templates` does not
answer. **The broker's levers stay on `/tools/live`** until they
can move with their tests: a second write path against a broker
nobody wants to call from a test is how a site ends up with two
that disagree. Both say so on the page.

`/api/courses/status` is the only endpoint the account half added:
it counts the catalogue in the WORKER and returns totals, because
`next/` may not import the value half of `shared/courses.ts` and a
bundle carrying it would look identical. `check-courses.ts` guards
that, and it blanks comments before grepping, because it was
failing on the sentence explaining the rule.

Five things are on the page and not yet asserted in
`next/admin.test.ts`: the anonymous asker, the reply marked as a
reply, Reopen on a closed enquiry, the draft's own pill, and the
History dialog naming its piece.

### Two endpoints, each a branch of a route that existed

`GET /api/media/usage` is the join §3 B 6 asks for: every key in
the bucket against every `/media/` reference in an article body, a
`cover`, an earlier version of a body, and a lesson. **One question
in the Worker rather than two fetches compared in the browser**,
because two answers taken a second apart disagree about a photo
uploaded between them, and this is the panel whose one button
deletes bytes. The nightly snapshots share that bucket and are
counted apart, so they can never appear in a list headed "nothing
points at this". Deleting one unreferenced object, named and
confirmed, is the only write on any of the three panels: §4 allows
that shape and it is `DELETE /api/media/<key>`.

`GET /api/schools/audit` is the prose half of §3 B 7: what is
unwritten, what no stage or section declares, and where a link
inside a lesson body points. It decides a link against the rows
and returns everything outside them as **undecided** rather than
guessing: the route table is not in the database, and
`check-routes.ts` walks the rest. Three answers, not two, because
an old spelling like `/money/index.html` still answers through a
301 in `aab/_redirects` and calling that dead would be wrong.

**The last clause of §3 B 8 has no endpoint and cannot have one.**
The last commit of `content/articles.backup.json` is a fact about
git: the Worker cannot see the repository, the file is not served,
and the deploy carries one commit for the whole site rather than a
date per file. The panel says so in a sentence and draws no row.


## 7. The research desk, which went into the studio

`/admin/research` is not a route here. It is the Research Studio,
at `/tools/research`, and `RESEARCH.md` is the whole of it. Two of
the desk's ideas are that plan's own rules: a save is one write
and cannot half-succeed, and nothing is typed that could have been
picked. Its threads are rows of `research_questions` and the old
address is a 301 in `aab/_redirects`.
