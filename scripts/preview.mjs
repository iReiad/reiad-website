#!/usr/bin/env node
/* ============================================================
   preview.mjs: every surface this site has, on one page.

       node scripts/preview.mjs           write it
       node scripts/preview.mjs --serve   and serve it on :4321

   ---- why this exists ----

   A theme change touches 344 rules and there was no way to look
   at the result short of deploying it. That is how a change that
   inverted every card on the site, making a panel darker than the
   page it sits on, shipped: every check passed, because every
   check measured contrast and none of them measured whether a
   raised surface was still raised.

   This loads the REAL stylesheets, not a copy, and renders one of
   everything against them: the surfaces, the accents in all seven
   sections, the buttons, the fields, the chips, the tiles. Both
   themes, side by side.

   It is not a test. It is the thing you look at before believing
   a check that says nothing is wrong.
   ============================================================ */

import { readFileSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "aab", "preview.html");

const SECTIONS = [
  ["money", "var(--green)"], ["deutsch", "var(--blue)"], ["quran", "var(--teal)"],
  ["english", "var(--violet)"], ["cooking", "var(--rose)"], ["travel", "var(--plum)"],
  ["tools", "var(--gold)"],
];

const swatches = SECTIONS.map(([name, colour]) => `
  <div class="pv-sec" style="--accent: ${colour}">
    <div class="pv-card">
      <span class="pv-label">${name}</span>
      <p class="pv-body">A card on this page, tinted by its own section.</p>
      <div class="pv-row">
        <button class="pv-btn pv-solid">Solid</button>
        <button class="pv-btn pv-soft">Soft</button>
        <button class="pv-btn pv-ghost">Ghost</button>
      </div>
      <div class="pv-row">
        <span class="pv-chip">chip</span>
        <input class="pv-input" value="a text box" readonly>
      </div>
      <div class="pv-sunk">a sunk ground, woven</div>
      <div class="pv-meter"><i style="width:62%"></i></div>
    </div>
  </div>`).join("\n");

const page = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Surfaces</title>
<link rel="stylesheet" href="/styles.css">
<link rel="stylesheet" href="/tailwind.css">
<style>
  /* The harness's own furniture only. Nothing here styles a
     surface: every surface below is drawn by the real tokens. */
  body { margin: 0; padding: 24px; background: var(--paper); color: var(--ink); }
  .pv-grid { display: grid; gap: 18px; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
  .pv-sec { display: grid; gap: 8px; }
  .pv-card {
    background: var(--panel); background-image: var(--sheen);
    border: 1px solid var(--pane-edge); border-radius: var(--radius);
    box-shadow: inset 0 1px 0 var(--pane-top), var(--shadow);
    padding: 14px; display: grid; gap: 10px;
  }
  .pv-label { font: 600 var(--t-1)/1 var(--font-mono); text-transform: uppercase;
              letter-spacing: .07em; color: var(--ink-soft); }
  .pv-body { margin: 0; font-size: var(--t-2); color: var(--ink); }
  .pv-row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
  .pv-btn { font: 500 var(--t-2)/1 inherit; padding: 9px 14px;
            border-radius: var(--radius-sm); border: 1px solid transparent; cursor: pointer; }
  .pv-solid { background: var(--accent-strong); color: var(--accent-ink); box-shadow: var(--shadow); }
  .pv-soft  { background: var(--accent-soft); color: var(--accent); border-color: var(--accent-line); }
  .pv-ghost { background: var(--panel); color: var(--ink); border-color: var(--pane-edge); }
  .pv-chip { font: 500 var(--t-1)/1 var(--font-mono); text-transform: uppercase;
             padding: 6px 10px; border-radius: 999px;
             background: var(--accent-soft); color: var(--accent); border: 1px solid var(--accent-line); }
  .pv-input { flex: 1; min-width: 120px; font: var(--t-2)/1.4 inherit; padding: 9px 12px;
              background: var(--panel); color: var(--ink);
              border: 1px solid var(--pane-edge); border-radius: var(--radius-sm); }
  .pv-sunk { background: var(--paper-sunk); background-image: var(--weave);
             border: 1px solid var(--hairline); border-radius: var(--radius-sm);
             padding: 12px; font-size: var(--t-1); color: var(--ink-soft); }
  .pv-meter { height: 10px; border-radius: 999px; overflow: hidden;
              background: var(--paper-sunk); border: 1px solid var(--hairline); }
  .pv-meter i { display: block; height: 100%; background: var(--accent-strong); }
  h1 { font-size: var(--t-5); margin: 0 0 4px; }
  .pv-note { color: var(--ink-soft); font-size: var(--t-2); margin: 0 0 18px; }
</style>
</head>
<body>
  <h1>Surfaces</h1>
  <p class="pv-note">The real stylesheets, one of everything, seven sections.
     Switch your system theme to see the other half.</p>
  <div class="pv-grid">
${swatches}
  </div>
</body>
</html>
`;

writeFileSync(OUT, page);
console.log(`preview: aab/preview.html, ${SECTIONS.length} sections.`);

if (process.argv.includes("--serve")) {
  const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript" };
  createServer((req, res) => {
    const path = req.url === "/" ? "/preview.html" : req.url.split("?")[0];
    try {
      const body = readFileSync(join(ROOT, "aab", path));
      const ext = path.slice(path.lastIndexOf("."));
      res.writeHead(200, { "Content-Type": types[ext] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(404).end("no");
    }
  }).listen(4321, () => console.log("serving on http://localhost:4321"));
}
