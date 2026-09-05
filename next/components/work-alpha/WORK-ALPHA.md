# Work-Alpha: wire the finished app into reiad.co.uk

This file is the whole brief. Read it, then read `CLAUDE.md` for the house
rules, then do everything below without asking. Finished means: the pull
request is open, every check in `node scripts/check-all.ts` is green, and
it is merged.

## What already exists (do not redesign it)

`next/components/work-alpha/` holds a finished, tested, standalone app:

| file | what it is |
| --- | --- |
| `plan.json` | the month plan: 8 days, 41 tasks, 7 goals, 7 prompts, two tracks. Data, never code |
| `engine.js` | the whole interface. `WorkAlpha.mount(root, plan, storage)` draws everything from `plan.json` and one state object. No framework, no build |
| `style.css` | the stylesheet. Every class is prefixed `wa-`, every colour is a token on `.wa` |
| `index.html` | the standalone page, for opening the app with no site around it |
| `Work-Alpha-Plan.md`, `Work-Alpha-Plan.xlsx` | the same plan as a document and a workbook, for the reader's Drive |

It has been smoke-tested in jsdom (every page renders, ticking a task
persists, the detail sheet opens) and screenshotted in Chromium. **Do not
rewrite it in React.** The engine is plain DOM on purpose: the detail sheet,
the editable grids and the timer all mutate the document, which a React
render would undo. Convert it to TypeScript (below), keep every behaviour.

## The one rule that decides everything: the page is the OWNER'S only

Work-Alpha is a private control room, not a tool for readers. Three locks:

1. **The route** `/work-alpha` calls `isAdmin()` from
   `functions/_lib/admins.ts` (the ONLY place that may decide) and renders
   `notFound()` for anybody else. Not a 403 with a message: a stranger must
   not learn the page exists.
2. **The rail** shows the entry only to the owner. `shared/nav.ts` is the one
   table the menu comes from; add the entry there with `unlisted: true` (the
   flag `/skills/courses/` already uses) so the footer and `/skills` skip it,
   AND add an `ownerOnly: true` field. Then make the rail component in
   `next/components/` draw an `ownerOnly` entry only when the request's reader
   passes `isAdmin()`. If the rail is rendered without a reader in scope,
   pass the answer down from the layout as a prop; do not fetch it in the
   browser, because a link that appears a paint late is a link that flashes.
3. **The data** lives in Supabase under row-level security, so even a bug in
   the first two locks exposes nothing.

`check-admin.ts` has to see the gate on the API endpoint; `check-routes.ts`
has to see the route in all three places (directory, `run_worker_first`,
`NEXT_ROUTES`); `check-app-surface.ts` needs `WORK_ALPHA` in `NOT_FOR_APP`
with the reason "owner-only, not a reader feature".

## Storage: the account is the record, the browser is a mirror

One table, one row per reader, the state object as JSON:

```sql
-- supabase/migrations/<timestamp>_work_alpha.sql
create table public.work_alpha_state (
  user_id    uuid primary key references auth.users on delete cascade,
  state      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.work_alpha_state enable row level security;
create policy "own row" on public.work_alpha_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
```

Stamp the file with the real timestamp of when you apply it, never a rounded
one (CLAUDE.md, "A migration's filename is a fact"). Add the table to BOTH
halves of `aab/src/account-page.ts` (take a copy, erase) so
`check-account.ts` passes, and to `check-rls.ts`'s expectations if it lists
tables by name.

The engine takes a `storage` object: `{ load(): Promise<object|null>,
save(state): Promise<void> }`. Write `next/components/work-alpha/storage.ts`
that talks to PostgREST with the reader's own bearer exactly the way
`next/lib/research-api.ts` does (read that file first and copy its pattern:
same client, same headers, same error shape):

- `load`: `GET work_alpha_state?select=state&user_id=eq.<me>`; return
  `row.state` or `null`.
- `save`: `POST work_alpha_state` with `Prefer: resolution=merge-duplicates`
  and `{ user_id, state, updated_at: now }`. The engine already debounces
  saves by 250 ms.
- Keep a localStorage mirror under the key `work-alpha` so a save that
  fails offline is not lost: write it before the network call, and on `load`
  prefer the newer of the two by `updated_at` (add `updated_at` to the state
  object in `save`). Add the row to `shared/storage.ts`: kind "made", syncs
  "yes, through its own table", and put it in `NOT_SYNCED_BY_SYNC_TS` or the
  equivalent exemption with the reason "carried by work_alpha_state, not by
  sync.ts", so `check-storage.ts` passes.

## The route

`next/app/(site)/work-alpha/page.tsx` (or wherever the `/tools` hub's route
group puts a single page under the shell; match `/tools/research`, which is
the closest thing on the site):

```tsx
import { notFound } from "next/navigation";
// server: read the reader, ask isAdmin(), notFound() otherwise
// then render <WorkAlphaMount /> inside the ordinary shell
```

`next/components/work-alpha/mount.tsx` is a client component:

```tsx
"use client";
import { useEffect, useRef } from "react";
import { mount } from "./engine";
import plan from "./plan.json";
import { supabaseStorage } from "./storage";
import "./style.css";
export function WorkAlphaMount() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { if (ref.current) void mount(ref.current, plan, supabaseStorage()); }, []);
  return <div ref={ref} className="wa-host" />;
}
```

Rules from CLAUDE.md that this touches:

- The module is loaded by a component, never by a `<script>` tag in a route.
- The stylesheet goes through the Next import so it is hashed. Do not paste
  it into `site.css`, and do not put it in `aab/`.
- The page carries its own `<title>` and meta through the route's metadata
  export, like every other route.
- `run_worker_first` in `wrangler.toml` and `NEXT_ROUTES` in `worker.js`
  both get `/work-alpha`. `check-routes.ts` fails until they agree.
- No em dash anywhere, including in comments and the PR body. The three
  files are already clean; keep them that way. Run `check-dashes.ts`.
- `.wa` sets its own background. Inside the shell, the page column gets the
  graph-paper ground; the rail and top bar stay the site's. If `.wa`'s
  `min-height: 100vh` fights the shell's `.shell-col`, drop it to `auto`.
  If the site's `--paper`/`--ink` tokens are meant to win, set them on
  `.wa` from the site's own variables (`--paper: var(--paper)` will not do;
  read `@layer tokens` for the real names). The material system
  (`check-material.ts`) will ask about `.wa-btn`, `.wa-tab`, `.wa-card`,
  `.wa-mini`, `.wa-check`: give them the kinds the check asks for (`control`
  for buttons and tabs, `card` for `.wa-card`, `chip` for `.wa-check`) or
  list them in `NOT_GLASS` with the reason "self-contained tool stylesheet,
  prefixed wa-". Either passes; do not leave the check red.

## TypeScript conversion of engine.js

Rename to `engine.ts`. It is one IIFE assigning `global.WorkAlpha`; unwrap
it into named exports `mount`, `freshState`, `localStorageAdapter`. Type the
plan with an interface derived from `plan.json` (`Plan`, `Day`, `Task`,
`Goal`, `Prompt`, `Track`) and the state with `WorkAlphaState`. The `h()`
helper takes `(tag: keyof HTMLElementTagNameMap, attrs: Record<string,
unknown> | null, ...kids: Kid[])`. No `any`, no `@ts-expect-error`
(CLAUDE.md). The `Audio` placeholder line can go: replace `tick` with a call
to `cue("tick")` from `next/lib/sound.ts` when a task is ticked and
`cue("stage")` when a goal is met, which is what the site's other ticks do.

Keep behaviour identical. The smoke test below must still pass.

## Test

Add `next/work-alpha.test.ts` in the style of `next/keep.test.ts` (read it
first). It must assert, in a real browser against the built route:

- signed out: `/work-alpha` is a 404 and the rail has no Work-Alpha entry;
- signed in as a non-admin: same;
- signed in as an admin: the page renders 7 flags, 12 tabs, the current day's
  tasks; ticking a task writes a row to `work_alpha_state` and survives a
  reload; opening a task shows the "Do exactly this" list; every tab renders
  at least five nodes.

Port the jsdom smoke test as well (it is in this PR's description) as the
no-browser half.

## The pull request

Title: `Work-Alpha: the owner's research control room`. Body: what it is,
the three locks, the table, the checks run. Squash merge when `checks` is
green. Do not ask whether to merge.
