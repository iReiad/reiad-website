# reiad.co.uk — notes for whoever works on this next

Read this before changing anything infrastructural. Most of it was learned the
expensive way: by breaking the live site and then working out why.

## What this is

A **Cloudflare Worker with static assets** — *not* a Pages project, however much
it looks like one.

- Worker name: `reiad-website` (created 10 July 2026)
- Static files: `aab/`, served straight from the edge
- Entry point: `worker.js` at the repo root
- Database: D1, `reiad` (`ad23dea3-74fc-4346-8119-ab5936f1a708`), bound as `DB`
- Second Worker: `market-pulse`, serving the news feed (now redundant — see below)

## The five things that will bite you

**1. It is Workers, not Pages.** Pages routes files under `functions/` by their
path. Workers does not. `worker.js` is the router and dispatches to those
handlers explicitly. Adding a file to `functions/` does nothing until it is
wired up there. This is why `/api/news` never worked for months.

**2. `wrangler.toml` must be a Workers config.** The Git build runs
`npx wrangler deploy`, which needs `main` and `[assets]`. A Pages-style
`pages_build_output_dir` fails the build with *"Missing entry-point to Worker
script or to assets directory"*.

**3. A failed build is silent.** The previous deployment keeps serving, so the
site looks fine and your change simply isn't there. Always check the build
status after pushing — do not infer success from the site loading.

**4. Never add "pretty URL" rules to `_redirects`.** Cloudflare already serves
`/about.html` at `/about` and redirects the `.html` form to it. A rule pointing
the other way is an infinite loop, and the page becomes completely unreachable
in every browser. `node aab/check-routes.mjs` catches this before deploying —
run it after touching `_redirects`.

**5. `not_found_handling = "404-page"` answers asset misses before the Worker
runs.** Any path that must reach the Worker needs to be in `run_worker_first`.
That is why `/insights/*` is listed there: without it, articles published to the
database 404 despite existing.

## Every push deploys to production

Workers Builds is deploying **every branch**, not just `main`. Pushing anything
changes the live site. If that's not wanted, it's *Settings → Builds → Branch
control* in the Worker.

## Before you push

```sh
node aab/check-routes.mjs     # redirect loops, dead links
npx wrangler dev              # the real runtime, local D1, local assets
PORT=8787 ./test-api.sh       # 46 checks over every endpoint
```

The local D1 is a copy. Nothing in `wrangler dev` touches live data.

## Design rules the code follows

- **Everything degrades.** Each API endpoint checks whether `DB` is bound and
  returns `not-configured`; the front end then falls back to its static
  behaviour. There is one site, not two.
- **Migrations run themselves** on the first request that needs them
  (`functions/_lib/db.js`). There is no schema step and no half-migrated state.
- **Sanitise on the server too.** The Studio cleans pasted HTML in the browser,
  which protects the person pasting. `functions/_lib/sanitise.js` is what
  protects the site.
- **Analytics store a path, a date and a count.** No cookies, no visitor
  identity, no third party. Keep it that way — the site's own colophon makes
  this promise to readers in public.
- **Say what isn't known.** Several pages state their assumptions and limits
  explicitly. That is the editorial voice, not filler; don't quietly drop it.

## Agent tooling

The Cloudflare **Developer Platform** connector is the useful one — it gives
docs search, Workers inspection and D1 queries against the live account. It is
what diagnosed the Pages-versus-Workers confusion above.

Worth adding if you're debugging production: Cloudflare's **observability** MCP
server (`https://observability.mcp.cloudflare.com/mcp`) for Worker logs and
exceptions. Connectors are added in the Claude UI, not in this repo.
