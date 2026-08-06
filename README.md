# reiad.co.uk

A static site — no framework, no build step, no dependencies. Every file in
`aab/` is served as-is. Edit, commit, push, done.

## Publishing an article

1. Open **`/studio.html`** in your browser.
2. Paste the article (from Word, Google Docs, Notion, anywhere). Paste or drag
   in the photos — they get resized to 1600px and re-encoded as WebP, which
   also strips the location data phones hide in JPEGs.
3. **Download the page** → put the `.html` file in `aab/insights/`.
   (Photos are embedded in the file. If the size meter goes gold or red,
   use **Download .zip** instead and unzip page + `photos/` into `insights/`.)
4. **Get the index entry** → paste that block at the top of the `ARTICLES`
   list in `aab/content.js`. That single entry is what puts the card on the
   Insights page and the article into Ctrl+K search.
5. Commit and push.

Nothing in the Studio is uploaded anywhere; it all runs in your browser, and
drafts autosave to IndexedDB so a closed tab costs you nothing.

Prefer writing HTML by hand? Copy `aab/insights/_template.html` — it produces
the identical layout and documents every piece you might need (photos, wide
photos, side-by-side photos, tables, callouts).

## Files

| Path | What it is |
| --- | --- |
| `aab/styles.css` | The whole design system, in `@layer`s: tokens → base → layout → components → article → studio → utilities |
| `aab/app.js` | Theme, Ctrl+K palette, kinetic headline, prerender rules, Insights cards |
| `aab/content.js` | **The one file you edit to publish.** Articles, Bangla terms, pages |
| `aab/pulse.js` | The auto-updating market-news list on the Insights page |
| `aab/studio.html` / `studio.js` | The Article Studio |
| `aab/learn/` | The Bangla Learn hub and its pop-up term reader |
| `aab/functions/api/news.js` | Cloudflare Pages Function serving `/api/news` |

## Local preview

The site uses root-absolute URLs and ES modules, so `file://` won't work:

```sh
cd aab && python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Theme

`<html data-theme="dark|light">` forces a theme; no attribute means "follow the
OS". The colours are defined once with `light-dark()` in `styles.css` — there
is no separate dark stylesheet to keep in sync.
