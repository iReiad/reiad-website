# reiad.co.uk

A static site — no framework, no build step, no dependencies. Every file in
`aab/` is served as-is. Edit, commit, push, done.

## Publishing an article

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

`/studio.html` is gated. On first visit it shows a setup screen: choose a
passphrase and it hands you a block to paste over `AUTH` in
`aab/auth-config.js`, then commit that. After that the Studio asks for the
passphrase, and offers to add a **passkey** so future unlocks are Face ID /
Touch ID / Windows Hello instead.

The passphrase is never stored — only a PBKDF2-SHA256 hash at 600,000
iterations. But be clear about what this is: a static site has no server, so
the check runs in the visitor's browser. It keeps the tool private from anyone
who wanders in and out of search results; it is not cryptographic protection.
Don't put anything confidential behind it.

## Files

| Path | What it is |
| --- | --- |
| `aab/styles.css` | The whole design system in nine `@layer`s: tokens → base → layout → components → menu → tools → article → studio → utilities |
| `aab/app.js` | Theme, overlay menu, Ctrl+K palette, keyboard shortcuts, prerender rules, article cards, service-worker registration |
| `aab/content.js` | **The one file you edit to publish.** Articles, Bangla terms, tools, pages |
| `aab/auth.js`, `auth-config.js` | The Studio's passkey / passphrase gate |
| `aab/studio.html`, `studio.js` | The Article Studio |
| `aab/tools/` | The five calculators |
| `aab/learn/` | The Bangla Learn hub, its pop-up term reader and reading progress |
| `aab/pulse.js` | The auto-updating market-news list |
| `aab/sw.js` | Service worker — offline reading, never stale articles |
| `aab/functions/api/news.js` | Cloudflare Pages Function serving `/api/news` |
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
