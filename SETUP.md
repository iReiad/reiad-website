# Deploying, and switching the dynamic half on

The database exists and is wired up. This file is about the other half of the
story: **what this project actually is on Cloudflare**, because that was wrong
for a while and it broke every automatic build.

---

## What this is

A **Worker with static assets**. Not a Pages project — there is no Pages
project in the account, and `wrangler pages deploy` will tell you so.

- everything in `aab/` is uploaded as static assets and served directly
- `worker.js` is the entry point, and routes `/api/*` and `/insights/:slug`
  to the handlers in `functions/`
- `wrangler.toml` declares the assets directory, the `ASSETS` binding and the
  D1 database

The deploy command is therefore:

```sh
npx wrangler deploy
```

### The gap that broke CI

For a while the live Worker was built from a `worker.js` that existed only on
a laptop. It was never committed, so:

- `npx wrangler deploy` in CI failed with *"Missing entry-point to Worker
  script or to assets directory"* — the repo had no `main` and no `[assets]`
- `npx wrangler pages deploy` failed with *"The Pages project does not
  exist"* — because it genuinely doesn't

Both files are in the repository now, so a clone of this repo deploys the site
that is actually running. If you ever see either error again, that is the thing
that has drifted.

---

## Build settings

**Workers & Pages → `reiad-website` → Settings → Build**

| Field | Value |
| --- | --- |
| Deploy command | `npx wrangler deploy` |
| Build command | *(empty — there is no build step)* |

If there is a separate **non-production branch deploy command**, the same
command works there, or `npx wrangler versions upload` if you want branch
builds to upload without going live.

### The API token

The build's token needs **Account → Workers Scripts → Edit**. It does *not*
need Cloudflare Pages permissions, and if you added those while chasing the
`pages deploy` errors, they can come back off.

---

## The D1 binding

`wrangler.toml` declares it, and `wrangler deploy` attaches it — there is
nothing to click:

```toml
[[d1_databases]]
binding = "DB"
database_name = "reiad"
database_id = "ad23dea3-74fc-4346-8119-ab5936f1a708"
```

The ID is not a secret; it names a database, it does not open one.

**There is no schema step.** The tables create themselves on the first request
that needs them (`functions/_lib/db.js` runs the migrations and caches the
fact), so there is no SQL to paste and no way to end up half-migrated.

If you ever need to attach it by hand instead: **Settings → Bindings → Add →
D1 database**, variable name `DB`. A binding only reaches a deployment created
after it was added, which is the step people miss.

---

## The R2 bucket

Article photos live in R2 rather than inside the article body, because a
base64 data URL costs a third more than the bytes it encodes and D1 caps a
single value at 2 MB. `wrangler.toml` declares the binding:

```toml
[[r2_buckets]]
binding = "MEDIA"
bucket_name = "reiad-media"
```

**Unlike the database, this one has to exist before the first deploy** —
`wrangler deploy` stops with an error if the bucket is missing rather than
creating it:

```sh
npx wrangler r2 bucket create reiad-media
```

(`./setup.sh` does this as step 4.) Without the binding, `/api/media` answers
`not-configured` and the Studio falls back to embedding photos in the page,
exactly as it did before.

`/media/*` is in `run_worker_first`, and it has to be. Nothing in `aab/`
matches that prefix, and with `not_found_handling` set the asset router
answers an unmatched path with `404.html` **without invoking the Worker** — so
leaving it out means every published photo 404s while the upload appears to
have worked.

---

## Notion (optional)

Write in Notion, publish from the Studio. It needs a secret, not a binding:

```sh
npx wrangler secret put NOTION_TOKEN
```

Create the integration at [notion.so/my-integrations](https://notion.so/my-integrations),
then open each page or database you write in and add it under **Connections**.
Notion shares nothing with an integration by default, so a page you haven't
connected is invisible to the import and comes back as `notion-not-shared`.

Without the secret every `/api/notion/*` route answers `not-configured` and
the Studio never shows the button.

---

## How to tell whether it worked

Open `https://reiad.co.uk/api/auth/me`.

| What you see | What it means |
| --- | --- |
| `{"ok":true,"configured":false,"signedIn":false}` | Connected, no passphrase set yet. Go and set one. |
| `{"ok":true,"configured":true,...}` | Connected and claimed. Sign in. |
| `{"ok":false,"reason":"not-configured"}` | The `DB` binding isn't reaching the deployment. |
| A 404 page | The Worker isn't routing at all — check `main = "worker.js"` in `wrangler.toml`. |

---

## Setting the Studio passphrase

Open `https://reiad.co.uk/studio.html`. You'll get a "Set up Studio access"
screen.

What you type is stretched **in your browser** — PBKDF2-SHA256, 210,000
iterations — and never sent. The server stores a hash of the result. It has to
work this way: a Worker on the free plan gets 10ms of CPU per request and those
iterations cost about 30ms, so doing it server-side got every attempt killed
mid-request. `functions/_lib/auth.js` explains the trade-off in full.

Your first page load after a deploy may still come from the service worker's
cache. A second load picks up the new version.

---

## Testing before you push

```sh
npx wrangler dev                     # the real runtime, local D1 and R2
./test-api.sh                        # 108 checks over every endpoint
node functions/_lib/notion.test.mjs  # 74 checks on the Notion conversion
node aab/studio.test.mjs             # 67 browser checks (needs Playwright)
node aab/check-routes.mjs            # catches redirect loops
node aab/check-sw.mjs                # precached file changed without a VERSION bump?
```

---

## Housekeeping: that API token

The account-scoped token pasted into a chat earlier (`square-waterfall-a740`)
should be deleted if it hasn't been already — **My Profile → API Tokens**. A
chat transcript is not somewhere a live credential should live. The build needs
only its own token with Workers Scripts: Edit.

The same rule caught `NOTION_TOKEN` once: an integration token was pasted into
a chat to get the import working. Rotate anything that has been through a
transcript — **notion.so/my-integrations → the integration → Secrets →
Rotate** — then `npx wrangler secret put NOTION_TOKEN` with the new value.

R2 **is** used now, for article photos (see above). The Worker reaches the
bucket through the `MEDIA` binding, not through an access key, so there are
still no R2 keys that need to exist. If any were created while setting this
up, they can go: **R2 → Manage API tokens**.
