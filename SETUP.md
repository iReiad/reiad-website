# Switching the dynamic half on

You've already done the hard part — the database exists. What's left is
telling the site where it is.

**Route A is already done** — the binding is committed. What's left for you is
in *"What's actually left"* at the bottom. Route B is the fallback if the
binding doesn't take.

---

## Route A — the binding lives in `wrangler.toml` (done)

Cloudflare Pages reads `wrangler.toml` on every deploy and attaches the
bindings it declares. The dashboard's *Settings → Bindings* screen does exactly
the same job by hand — so if this file is right, you never need that screen.

`wrangler.toml` now contains:

```toml
[[d1_databases]]
binding = "DB"
database_name = "reiad"
database_id = "ad23dea3-74fc-4346-8119-ab5936f1a708"
```

Verified against Cloudflare's own runtime: the config parses and the binding
resolves (`env.DB (reiad) — D1 Database`), and the 46-check API suite passes
against it.

**There is no schema step.**

The tables create themselves on the first request that needs them
(`functions/_lib/db.js` runs the migrations and caches the fact). So there's no
SQL to paste and no way to end up half-migrated.

**5. Open `https://reiad.co.uk/studio.html` and set your passphrase.**

It'll show a "Set up Studio access" screen. Whatever you type is hashed on the
server — nothing readable is stored anywhere, and the screen will tell you it's
checking server-side, which is how you know the binding worked.

---

## Route B — the dashboard, click by click

Use this if Route A doesn't take effect for any reason.

1. Cloudflare dashboard → **Workers & Pages** → your Pages project
   (`reiad-website` or whatever it's named).
2. **Settings** tab → scroll to **Bindings** → **Add** → **D1 database**.
3. Fill in exactly:
   - **Variable name**: `DB`  ← must be these two letters
   - **D1 database**: pick your database from the list
4. Save.
5. **Deployments** tab → the most recent one → **⋯** → **Retry deployment**.
   A binding only reaches a deployment that was built after it was added, which
   is the step people usually miss.
6. Then step 5 of Route A: open `/studio.html` and set your passphrase.

---

## How to tell whether it worked

Open `https://reiad.co.uk/api/auth/me` in a browser tab.

- `{"ok":true,"configured":false,"signedIn":false}` — **the database is
  connected.** Go and set your passphrase.
- `{"ok":false,"reason":"not-configured"}` — not attached yet. The binding
  isn't reaching the deployment; check the variable name is `DB`, and that
  you've deployed since adding it.
- A 404 page — Functions aren't deploying at all. Check the Pages project's
  build output directory is `aab`, and that `functions/` is at the repo root
  (it is, in this branch).

---

## While you're in there: revoke that API token

The token you pasted into the chat is account-scoped, and a chat transcript
isn't somewhere a live credential should live. It also turned out to be
unusable from my side — the environment I run in blocks all outbound network
except GitHub and package registries, which is why I couldn't use it.

Cloudflare dashboard → **My Profile** → **API Tokens** → find
`square-waterfall-a740` → **Delete**.

Same for the R2 keys (**R2** → **Manage API tokens**). Nothing on this site
uses R2, so those can go and nothing will notice.

Neither is needed for anything above — the setup is one non-secret ID in one
file.


---

## What's actually left

1. **Merge the pull request.** Cloudflare deploys `main` automatically.
2. **Open `https://reiad.co.uk/api/auth/me`** — see *How to tell whether it
   worked* above.
3. **Open `https://reiad.co.uk/studio.html`** and set your passphrase.
4. **Revoke that API token** (last section).

That's the lot.
