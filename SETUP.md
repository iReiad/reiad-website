# Switching the dynamic half on

You've already done the hard part — the database exists. What's left is
telling the site where it is.

There are two routes. **Route A is one line in one file and no dashboard at
all**, and it's the one worth taking.

---

## Route A — the binding lives in `wrangler.toml` (recommended)

Cloudflare Pages reads `wrangler.toml` on every deploy and attaches the
bindings it declares. The dashboard's *Settings → Bindings* screen does exactly
the same job by hand — so if this file is right, you never need that screen.

**1. Get the database ID**

Cloudflare dashboard → **Storage & Databases** → **D1 SQL Database** → click
your database. The **Database ID** is on that page: a UUID like
`1a2b3c4d-5e6f-7890-abcd-ef1234567890`.

It is not a secret. It names a database; it doesn't open one. Only an
authenticated request from your own account can touch it.

**2. Put it in `wrangler.toml`**

Find this block near the bottom and remove the `# ` from the last four lines,
then paste your ID in:

```toml
[[d1_databases]]
binding = "DB"
database_name = "reiad"
database_id = "1a2b3c4d-5e6f-7890-abcd-ef1234567890"
```

The `binding = "DB"` line must stay exactly as it is — that's the name the code
looks for.

**3. Commit and push.**

That's the whole thing. The next deploy has a database attached.

**4. There is no schema step.**

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
