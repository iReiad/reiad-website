#!/usr/bin/env node
/* ============================================================
   hub.test.mjs: the three school hubs, built against the markup
   a reader actually gets.

       node aab/schools/hub.test.mjs

   `schools/hub.js` took the four identical halves out of three
   hub scripts: the progress ring, the resume card, the bar at
   the top and the reset button. `progress.test.mjs` next door
   covers the arithmetic; nothing covered the drawing, and the
   drawing is the half a reader sees.

   The house rule this answers is in CLAUDE.md: a port is
   finished when it does what the thing it replaced did, not when
   it renders, and those two look identical from the outside. So
   this loads each school's real hub.js against the real hub
   markup, and asks what a reader would ask. Is there a
   ladder. Does every rung have a ring, a state and a count. Does
   the bar say anything. Is the resume card hidden before there
   is anything to resume and there afterwards.

   ---- where the markup comes from ----

   `components/school-hub-page.tsx`, rendered here rather than
   read off disk. The three hubs were an HTML string each until
   they became components, and a test that kept reading the
   string would have gone on passing against markup nothing
   serves. Rendering the component is the only way this stays a
   test of what a reader gets.

   It is a plain synchronous component on purpose: its content is
   a file in this repository rather than a row, so nothing here
   awaits and `renderToStaticMarkup` is enough.

   No browser and no network: `linkedom` is a DOM, the twenty
   lines of storage and events the modules touch are stubbed, and
   the markup is rendered in process. It runs in about a second.

   Without linkedom installed it says so and skips, which is not
   a pass. `npm install` at the root is the whole of the fix.
   ============================================================ */

import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const AAB = join(ROOT, "aab");

let parseHTML;
try {
  ({ parseHTML } = await import("linkedom"));
} catch {
  console.log("\nSKIPPED: linkedom is not installed, so there is no DOM to");
  console.log("build these hubs in. This is NOT a pass.\n");
  console.log("  npm install\n");
  process.exit(0);
}

registerHooks({
  resolve(spec, ctx, next) {
    if (spec.startsWith("/") && !spec.startsWith(ROOT)) {
      const [path, query] = spec.split("?");
      const url = pathToFileURL(join(AAB, path)).href + (query ? `?${query}` : "");
      return { url, shortCircuit: true };
    }
    return next(spec, ctx);
  },
});

/* The hub bodies, rendered from the component the route uses, so
   this is the markup a reader actually gets.

   Node strips TypeScript types on its own but cannot transform
   JSX, so the component is bundled first. esbuild does it in
   about eighty milliseconds and it is already here: it is what
   wrangler and Next both build with. React and react-dom live in
   `next/`, which is its own npm workspace, so the bundle resolves
   from there rather than from this file. */
const { build } = await import(
  pathToFileURL(join(ROOT, "next/node_modules/esbuild/lib/main.js")).href);

const bundled = await build({
  entryPoints: [join(ROOT, "next/components/school-hub-page.tsx")],
  bundle: true,
  write: false,
  format: "esm",
  platform: "node",
  jsx: "automatic",
  absWorkingDir: join(ROOT, "next"),
  logLevel: "silent",
});

const mod = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

const { renderToStaticMarkup } = await import(
  pathToFileURL(join(ROOT, "next/node_modules/react-dom/server.browser.js")).href);

const bodies = Object.fromEntries(
  ["deutsch", "english", "quran"].map((school) =>
    [school, renderToStaticMarkup(mod.SchoolHubPage({ school }))]));

let bad = 0;
const ok = (n, c, d = "") => { console.log(`${c ? "  ok " : "FAIL"}  ${n}${c ? "" : "   " + d}`); if (!c) bad++; };

for (const school of ["deutsch", "english", "quran"]) {
  console.log(`\n--- ${school} ---`);
  const body = bodies[school];
  if (!body) { ok(`${school}: markup found in school-hubs.ts`, false); continue; }

  const { window, document } = parseHTML(`<!doctype html><html><body>${body}</body></html>`);
  const store = new Map();
  const listeners = new Map();
  Object.assign(globalThis, {
    window, document,
    localStorage: {
      getItem: (k) => (store.has(k) ? store.get(k) : null),
      setItem: (k, v) => store.set(k, String(v)),
      removeItem: (k) => store.delete(k),
    },
    addEventListener: (t, f) => listeners.set(t, [...(listeners.get(t) ?? []), f]),
    dispatchEvent: (e) => { (listeners.get(e.type) ?? []).forEach((f) => f(e)); return true; },
    CustomEvent: window.CustomEvent,
    confirm: () => true,
    location: { pathname: `/${school}/index.html` },
  });

  const errors = [];
  try {
    await import(`/${school}/hub.js?${Math.random()}`);
  } catch (e) { errors.push(String(e)); }
  ok(`${school}: hub.js ran without throwing`, errors.length === 0, errors[0]);
  if (errors.length) continue;

  const rungs = [...document.querySelectorAll("details.rung")];
  ok(`${school}: the ladder built its rungs (${rungs.length})`, rungs.length > 0);

  /* `span.ring > svg`, which is `<Ring>` in components/deck.tsx node
     for node. It was `svg.ring` with the rotation on a transform
     attribute, and that shape existed only because two layers both
     defined `.ring` and the school's copy lost: `.ring svg` does not
     match an SVG that is itself the `.ring`, so the schools' ring was
     never rotated twice by accident. One shape now, and the rotation
     is the stylesheet's in both places. */
  const rings = document.querySelectorAll("span.ring > svg").length;
  ok(`${school}: the shared ring drew one per rung (${rings})`, rings === rungs.length && rings > 0);

  const fills = [...document.querySelectorAll("span.ring > svg circle.ring-fill")];
  /* `.every()` on an empty list is true, so the count is asserted
     first. This check passed for three schools while the selector
     above it was returning nothing at all. */
  ok(`${school}: every ring has a real circumference`,
    fills.length === rungs.length
    && fills.every((c) => Number(c.getAttribute("stroke-dasharray")) > 0));

  const states = rungs.map((r) => r.getAttribute("data-state"));
  ok(`${school}: exactly one rung is "now"`, states.filter((s) => s === "now").length === 1, states.join(","));
  ok(`${school}: every state is one the stylesheet knows`,
    states.every((s) => ["done", "now", "next", "past", "later"].includes(s)), states.join(","));

  const pills = [...document.querySelectorAll(".state-pill")].map((e) => e.textContent.trim());
  ok(`${school}: every rung is labelled in Bangla`,
    pills.length === rungs.length && pills.every(Boolean), pills.join(","));

  const counts = [...document.querySelectorAll(".rung-count")].map((e) => e.textContent);
  ok(`${school}: rung counts are in Bangla numerals`,
    counts.length > 0 && counts.every((c) => /^[০-৯]+\/[০-৯]+$/.test(c)), counts.slice(0, 3).join(" "));

  const bar = document.getElementById(`${school}-progress`);
  ok(`${school}: the top bar was filled`, Boolean(bar?.querySelector(".count")?.textContent.trim()),
    String(bar?.querySelector(".count")?.textContent));
  ok(`${school}: the bar's fill has a width`,
    /^\d+%$/.test(bar?.querySelector(".track i")?.style?.width ?? ""),
    String(bar?.querySelector(".track i")?.style?.width));

  ok(`${school}: reset is hidden with nothing to reset`,
    document.getElementById(`${school}-reset`)?.hidden === true);
  ok(`${school}: the resume card is hidden for a first-time reader`,
    document.getElementById("resume")?.hidden === true);

  /* And it is the painter hiding it, not the markup. The route
     ships `<div id="resume" hidden>`, so the assertion above
     passes whether or not paintResume ever runs: it did, on a
     version of this file that had lost the branch entirely. */
  document.getElementById("resume").hidden = false;

  /* Now read something, and see the page answer. */
  const P = await import(`/${school}/progress.js`);
  const cur = await import(`/${school}/curriculum.js`);
  const all = (cur.allTeile ?? cur.allParts ?? cur.allLessons)();
  const live = all.filter((l) => l.status === "live");
  (P.markRead ?? P.markDone)(live[0].id);

  ok(`${school}: the resume card appears once something is read`,
    document.getElementById("resume")?.hidden === false);
  ok(`${school}: and names what to resume`,
    Boolean(document.querySelector("#resume .resume-label")?.textContent.trim()),
    String(document.querySelector("#resume .resume-label")?.textContent));
  ok(`${school}: with somewhere to go`,
    Boolean(document.querySelector("#resume a.btn")?.getAttribute("href")),
    String(document.querySelector("#resume a.btn")?.getAttribute("href")));
  ok(`${school}: and a percentage in Bangla`,
    /^[০-৯]+%$/.test(document.querySelector("#resume .resume-pct")?.textContent ?? ""),
    String(document.querySelector("#resume .resume-pct")?.textContent));
  ok(`${school}: reset is offered now there is something to reset`,
    document.getElementById(`${school}-reset`)?.hidden === false);

  /* And back again. Resetting is the other direction through the
     same two painters, and it is the direction a first-time
     reader never exercises. */
  P.resetAll();
  ok(`${school}: resetting hides the resume card again`,
    document.getElementById("resume")?.hidden === true);
  ok(`${school}: and takes the reset button away with it`,
    document.getElementById(`${school}-reset`)?.hidden === true);
  ok(`${school}: and empties the ladder's counts`,
    [...document.querySelectorAll(".rung-count")]
      .every((e) => /^০\//.test(e.textContent)),
    [...document.querySelectorAll(".rung-count")].map((e) => e.textContent).join(" "));
}

console.log(bad ? `\n${bad} failed` : "\nAll three hubs build their ladder, ring, bar and resume card.");
process.exit(bad ? 1 : 0);
