# Setup

Everything is configured in the repo now. **Merge, and it's done** — there is
no dashboard step left.

---

## What was actually wrong

`reiad.co.uk` is a Cloudflare **Worker with static assets**, not a Pages
project. I checked the account directly: the Worker `reiad-website` was created
on 10 July 2026, well before any of this work.

That single fact explains a run of confusing symptoms:

- **Pages Functions never ran.** Files under `functions/` are routed by path on
  Pages. Workers have no such convention — so `/api/news` has never worked,
  which is presumably why the market pulse was moved to a separate
  `market-pulse` Worker.
- **The build failed** when I added a Pages-style `wrangler.toml`: Cloudflare's
  Git integration runs `npx wrangler deploy`, which is the Workers command, and
  it needs `main` and `[assets]` — not `pages_build_output_dir`.
- **A failed build is invisible from outside**, because the previous deployment
  keeps serving. That's why merging looked like it did nothing.

## What changed

- `worker.js` — the router. Static assets are matched first; `/api/*` and
  `/insights/*` reach the Worker; everything else falls through to the assets
  binding. The endpoint handlers under `functions/` are unchanged and still
  take a Pages-shaped context, so there is one implementation of each endpoint.
- `wrangler.toml` — Workers config: `main`, `[assets]`, and the D1 binding
  **in the file**, so no dashboard binding is needed after all.

## What you do

**Merge the pull request.** That's the whole thing.

- The build should go green (`wrangler deploy` now has what it needs).
- The database is bound by the config file.
- The tables create themselves on the first request that needs them.

Then open **`https://reiad.co.uk/studio.html`** and set your passphrase.

---

## How to tell it worked

Open `https://reiad.co.uk/api/auth/me`:

| What you see | What it means |
| --- | --- |
| `{"ok":true,"configured":false,"signedIn":false}` | **Everything is up.** Go set your passphrase. |
| `{"ok":false,"reason":"not-configured"}` | Worker is running, database isn't bound — check the build log. |
| The 404 page | The deploy didn't take. Send me the build log. |

---

## Optional: Bangla headline translation

`functions/api/news.js` translates market headlines into Bangla when an `AI`
binding exists, and skips it when it doesn't. It's deliberately left out of
`wrangler.toml` because an `[ai]` binding forces `wrangler dev` into remote mode
and breaks local development.

To switch it on: **Workers & Pages → reiad-website → Settings → Bindings →
Add → Workers AI → variable name `AI`**.

Also worth knowing: now that Functions actually run, `/api/news` works, so the
separate `market-pulse` Worker may be redundant. The market pulse tries
`/api/news` first and falls back to that Worker, so both work — you can retire
it whenever you like.

---

## Worth knowing: every branch deploys to production

The build that put this live came from a *pull request branch*, not `main` —
Workers Builds is deploying every push straight to production. So pushing any
branch changes the live site.

If you'd rather branches went to preview URLs instead, that's
**non-production branch builds** in the Worker's build settings:
Workers & Pages → reiad-website → Settings → Builds → Branch control.

Also confirmed against Cloudflare's docs: `_headers` and `_redirects` in
`aab/` are supported natively on Workers with static assets, exactly as they
were on Pages — so the CSP, HSTS and cache rules still apply.

---

## Revoke that API token

The token pasted into chat is account-scoped, and a transcript is no place for
a live credential. It was never usable from my side anyway — the environment I
run in blocks all outbound network except GitHub and package registries.

- **My Profile → API Tokens →** `square-waterfall-a740` **→ Delete**
- **R2 → Manage API tokens →** delete those too; nothing here uses R2

The Cloudflare connector you added is what let me diagnose this, and it doesn't
need either of them.

---

## Local development

```sh
npx wrangler dev              # the real runtime, local D1, local assets
PORT=8787 ./test-api.sh       # 46 checks over every endpoint
node aab/check-routes.mjs     # catches redirect loops before deploying
```

The local database is a copy — nothing in `wrangler dev` touches live data.
