# Setup

Two separate things, in order. **Step 1 is required** — until it's done, the
site is still serving the old version. Step 2 is optional and can wait.

---

## 1. Get the deploy working again  ✅ fixed in this branch

**What went wrong:** I added a `wrangler.toml` to the repo root. That file
changes how Cloudflare builds a Pages project — it switches to running a
*deploy command*, and the one it defaults to is `npx wrangler deploy`, which is
the **Workers** command, not the Pages one. It fails with:

```
✘ [ERROR] Missing entry-point to Worker script or to assets directory
```

The build fails, the deployment never happens, and the site quietly stays on
the previous version. That's why merging appeared to do nothing.

**The fix, already in this branch:** the file is now `wrangler.example.toml`, a
name Cloudflare doesn't look for. Pages goes back to the plain Git build that
has always worked. Local development copies it to `wrangler.toml`, which is
git-ignored.

**What you do:** merge this branch. The deploy should go green.

### If it still fails

Then your project also has a deploy command saved in its settings, and it needs
clearing:

1. Cloudflare dashboard → **Workers & Pages** → your project
2. **Settings** → **Build** (or *Builds & deployments*)
3. **Deploy command** — clear it, or set it to exactly:
   `npx wrangler pages deploy aab`
4. **Build command** — should be empty
5. **Build output directory** — should be `aab`
6. Save, then **Deployments** → latest → **⋯** → **Retry deployment**

Send me the build log if it's still unhappy.

---

## 2. Connect the database  (optional — the site is complete without it)

This switches on one-click publishing, reader questions, the subscriber list,
the enquiry pipeline and the stats. Skip it and everything else works exactly
as it does now.

Because `wrangler.toml` can't live in the repo (see above), the binding is a
dashboard setting. It's one screen:

1. Cloudflare dashboard → **Workers & Pages** → your project
2. **Settings** tab → scroll to **Bindings** → **Add**
3. Choose **D1 database**
4. Fill in exactly:
   - **Variable name**: `DB`  ← these two letters, nothing else
   - **D1 database**: `reiad` (id `ad23dea3-74fc-4346-8119-ab5936f1a708`)
5. **Save**
6. **Deployments** tab → most recent → **⋯** → **Retry deployment**

Step 6 is the one people miss: a binding only reaches deployments built *after*
it was added.

**There is no schema step.** The tables create themselves on the first request
that needs them (`functions/_lib/db.js`), so there's no SQL to paste and no way
to end up half-migrated.

---

## How to tell whether it worked

Open `https://reiad.co.uk/api/auth/me` in a browser tab.

| What you see | What it means |
| --- | --- |
| `{"ok":true,"configured":false,"signedIn":false}` | **Database connected.** Go to `/studio.html` and set your passphrase. |
| `{"ok":false,"reason":"not-configured"}` | Functions are running, database isn't attached. Check the variable name is `DB`, and that you redeployed after adding it. |
| The 404 page | Functions aren't deploying. Check build output directory is `aab`, and that `functions/` is at the repo root (it is, in this branch). |

Then open `https://reiad.co.uk/studio.html`. The fine print on the lock screen
says which mode it's in — "checked on the server" means the whole chain works.

---

## 3. Revoke that API token

The token pasted into chat is account-scoped and a transcript is no place for a
live credential. It also turned out to be unusable from my side: the
environment I run in blocks all outbound network except GitHub and package
registries, so `api.cloudflare.com` was refused before the request left.

- **My Profile** → **API Tokens** → `square-waterfall-a740` → **Delete**
- **R2** → **Manage API tokens** → delete those too; nothing here uses R2

Nothing above needs either of them.

---

## Local development

```sh
cp wrangler.example.toml wrangler.toml   # git-ignored; do not commit it
npx wrangler pages dev                   # real Cloudflare runtime, local D1
PORT=8788 ./test-api.sh                  # 46 checks over every endpoint
node aab/check-routes.mjs                # catches redirect loops before deploy
```

The local database is a copy — nothing you do in `pages dev` touches live data.
