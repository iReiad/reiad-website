# Reiad's Library

reiad.co.uk. A Cloudflare Worker serving static assets from `aab/`, plus a
second Worker (`reiad-next`) rendering the Next.js routes, over D1 for content
and Supabase for reader accounts.

## Run it

```sh
npm install
npx wrangler dev                 # the main Worker, on :8787
cd next && npm run dev           # the Next routes, on :3000
```

## Layout

| Path | What |
| --- | --- |
| `aab/` | everything served as a file: the stylesheet, the browser modules, the practice books |
| `aab/src/` | TypeScript sources for the browser modules. **Edit these, not the built `aab/*.js`** |
| `app/src/` | the React workspace (Vite) building to `aab/desk/` and `aab/studio/` |
| `next/` | the Next.js routes: articles, schools, tools |
| `functions/` | request handlers for `/api/*`, in the Pages Functions shape |
| `shared/` | what the Worker, the browser and Next must all agree on |
| `scripts/` | the checks and the builders |
| `supabase/migrations/` | accounts, progress, library, targets |
| `archive/` | replaced pages and modules, kept readable |

## Before you commit

```sh
node scripts/check-all.mjs       # every check, in order
```

Generated output is generated. Edit the source and rebuild:

```sh
node scripts/build-modules.mjs        # aab/*.js from aab/src/
node scripts/build-styles.mjs         # aab/tailwind.css
node scripts/build-school-icons.mjs   # next/lib/school-icons.ts
cd app && npm run build               # aab/desk/, aab/studio/
```

## The rules that will bite you

- **No em dashes anywhere.** The check is in `CLAUDE.md`, which does not
  write the character out either: a rule containing the thing it bans
  always matches itself.
- **Never rename a storage key.** `learn-read`, `courses-read` and the rest are
  in real browsers and real accounts. Renaming one loses somebody's progress.
- **Never rename an applied migration.** The version in the filename is a
  primary key in `supabase_migrations.schema_migrations`.
- **Counts come from the data**, never from a sentence. See `COUNTS` in
  `aab/content.js`.

`CLAUDE.md` is the working reference: why each rule exists and what breaks
without it. `SETUP.md` is first-time setup. `MIGRATION.md` tracks the move to
TypeScript and Tailwind.
