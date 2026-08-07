# reiad.co.uk

A Cloudflare **Worker with static assets**. Every file in `aab/` is served
straight from the edge — no framework, no build step, no dependencies — and
`worker.js` routes `/api/*` to handlers backed by a D1 database, adding
publishing, reader questions, subscribers, enquiries and analytics on top.

Not a Pages project, which matters: Pages routes files under `functions/` by
path and Workers do not, so `worker.js` is the router. See
[SETUP.md](SETUP.md).

**The two halves are one site.** Every dynamic feature checks whether the
database is connected and falls back to the static behaviour if it isn't. So
the site works today, unchanged, and each feature switches on the moment you
run `./setup.sh` — there is no second version to maintain in between.

## Turning the dynamic half on

Nothing to do — the D1 binding is in `wrangler.toml` and the tables create
themselves on first use. Merge, then open `/studio.html` and set a passphrase.

Then **writing a piece and pressing "Publish to the site" puts it live
immediately** — no file to move, no commit, no push.

## What the dynamic half gives you

| Feature | Where |
| --- | --- |
| One-click publishing | `/studio.html` → Publish |
| Reader questions, moderated | bottom of every article; queue in the Studio |
| Reactions (helpful / confusing / go deeper) | bottom of every article |
| Subscriber list, confirmed opt-in, CSV export | Insights page; list in the Studio |
| Client enquiry pipeline (new → replied → closed) | contact form; pipeline in the Studio |
| Page analytics that can't identify anyone | Studio → What's read |
| Full-text search across article bodies | `/api/search` |

## Testing

```sh
npx wrangler dev              # the real runtime, local D1, local assets
PORT=8787 ./test-api.sh       # 46 checks over every endpoint
node aab/check-routes.mjs     # catches redirect loops before deploying
```

## Publishing an article — the manual way

This still works, and is the fallback when the database isn't connected.

1. Open **`/studio.html`** and unlock it (see *Studio access* below).
2. Paste the article (from Word, Google Docs, Notion, anywhere). Paste or drag
   in the photos — they get resized to 1600px and re-encoded as WebP, which
   also strips the location data phones hide in JPEGs.
3. **Download the page** → put the `.html` file in `aab/insights/`.
   (Photos are embedded in the file. If the size meter goes gold or red,
   use **Download .zip** instead and unzip page + `photos/` into `insights/`.)
4. **Get the index entry** → paste that block at the top of the `ARTICLES`
   list in `aab/content.js`. That single entry is what puts the card on the
   Insights page, the piece in Ctrl+K search, and the item in the RSS feed.
5. Run `node aab/build-meta.mjs` to refresh the feed and sitemap.
6. Commit and push.

Prefer writing HTML by hand? Copy `aab/insights/_template.html` — it produces
the identical layout and documents every piece you might need.

## Studio access

`/studio.html` is gated, and how strong that gate is depends on whether the
database is connected.

**With D1 connected — a real login.** The passphrase is checked on the server
against a PBKDF2-SHA256 hash (210,000 iterations, constant-time comparison).
The session is a token stored server-side as a hash, handed to the browser as
an HttpOnly, SameSite=Strict cookie that page JavaScript cannot read. Every
admin endpoint re-checks it, wrong guesses are rate-limited, and you can revoke
every session at once. Set the passphrase by visiting `/studio.html` after
setup.

**Without D1 — the old browser-side gate.** It keeps the tool away from
passers-by and out of search results, and it is not cryptographic protection of
anything, because a static site has no server to ask. The lock screen says
which mode it's in.

## Files

| Path | What it is |
| --- | --- |
| `aab/styles.css` | The whole design system in nine `@layer`s: tokens → base → layout → components → menu → tools → article → studio → utilities |
| `aab/app.js` | Theme, overlay menu, Ctrl+K palette, keyboard shortcuts, prerender rules, article cards, service-worker registration |
| `aab/content.js` | **The one file you edit to publish.** Articles, Bangla terms, tools, pages |
| `aab/api.js` | Browser side of the dynamic layer — returns null instead of throwing when there's no backend |
| `aab/auth.js`, `auth-config.js` | The Studio's gate: server session when available, browser-side fallback |
| `aab/admin.js` | The dashboard — questions, subscribers, enquiries, stats |
| `aab/engage.js` | Reactions and reader Q&A; attaches itself to any article page |
| `functions/` | The endpoint handlers. Named for their Pages heritage and still take a Pages-shaped context, but dispatched by `worker.js` |
| `functions/_lib/` | Database, HTTP helpers, server-side auth, server-side HTML sanitiser |
| `aab/schema.sql` | The database. Also applied automatically on first request |
| `worker.js` | **The router.** Static assets first, then `/api/*` and `/insights/*`, then the assets binding |
| `wrangler.toml` | Workers config: entry point, assets directory, D1 binding |
| `test-api.sh` | 46 end-to-end API checks |
| `aab/studio.html`, `studio.js` | The Article Studio |
| `aab/tools/` | The five calculators |
| `aab/learn/` | The Bangla Learn hub, its pop-up term reader and reading progress |
| `aab/pulse.js` | The auto-updating market-news list |
| `aab/sw.js` | Service worker — offline reading, never stale articles |
| `functions/api/news.js` | Serves `/api/news` — the market-pulse feed |
| `aab/_headers`, `_redirects` | Cloudflare security headers, CSP and redirects |
| `aab/check-routes.mjs` | **Run before deploying.** Walks every URL through Cloudflare Pages' routing rules and fails on loops, dead ends and broken links |
| `aab/build-meta.mjs` | Regenerates `feed.xml`, `sitemap.xml`, `robots.txt` |
| `aab/build-og.mjs` | Re-renders the social share images in `og/` (needs Playwright) |

## Keyboard

`Ctrl/Cmd K` or `/` search · `M` menu · `T` theme · `?` shortcuts ·
`G` then `H`/`L`/`I`/`T` to jump to Home, Learn, Insights or Tools.

## Local preview

The site uses root-absolute URLs and ES modules, so `file://` won't work:

```sh
cd aab && python3 -m http.server 8000
```

Then open <http://localhost:8000>. `_headers` and `_redirects` are Cloudflare
features that do nothing locally, so before pushing anything that touches them:

```sh
node aab/check-routes.mjs
```

That emulates Pages' routing and catches redirect loops, which are otherwise
invisible until the site is live and a page simply refuses to load.

**Never add "pretty URL" rules to `_redirects`.** Pages already serves
`/about.html` at `/about` and redirects the `.html` form to it; a rule pointing
the other way is an infinite loop.

## Theme

`<html data-theme="dark|light">` forces a theme; no attribute means "follow the
OS". The colours are defined once with `light-dark()` in `styles.css` — there
is no separate dark stylesheet to keep in sync.
