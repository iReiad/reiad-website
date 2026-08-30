#!/usr/bin/env node
/* ============================================================
   hub.test.ts: the three school hubs, built against the markup
   a reader actually gets.

       node aab/schools/hub.test.ts

   `schools/hub.js` took the four identical halves out of three
   hub scripts: the progress ring, the resume card, the bar at
   the top and the reset button. `progress.test.ts` next door
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

   `aab/tsconfig.test.json` is what typechecks the annotations
   below, and `scripts/check-types.ts` runs it.
   ============================================================ */

import { registerHooks } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const AAB = join(ROOT, "aab");

let parseHTML: typeof import("linkedom").parseHTML;
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
   about eighty milliseconds.

   Bare specifiers, resolved from the root, where `linkedom` is
   and for the same reason: the workflow runs `npm ci` at the root
   and nowhere else. Reaching into `next/node_modules` worked on a
   laptop and failed on the runner, which is the shape of mistake
   the root package.json was created to stop. */
const { build } = await import("esbuild");

/* The renderer is bundled WITH the component, and that is not
   tidiness either: the result is imported as a `data:` URL, and a
   data module cannot resolve a bare specifier, so anything left
   external throws at import rather than at build. One bundle, one
   React, nothing to resolve at run time.

   `resolveDir` is `next/`, so the component's neighbours resolve
   beside it and react resolves by walking up to the root, which
   is where the checks' own copy lives. */
const bundled = await build({
  stdin: {
    contents: `export { SchoolHubPage } from "./components/school-hub-page";
               export { renderToStaticMarkup } from "react-dom/server.browser";`,
    resolveDir: join(ROOT, "next"),
    loader: "ts",
  },
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  mainFields: ["module", "main"],
  conditions: ["import", "default"],
  jsx: "automatic",
  /* `@reiad/shared` IS INSTALLED IN `next/` AND NOWHERE ELSE.

     `next/.npmrc` sets `install-links=true` so npm copies the
     package in rather than symlinking, and CI runs `npm ci` at
     the root and nowhere else, so `next/node_modules` does not
     exist on a runner. This bundle resolved it on a laptop that
     had run `npm install` in `next/` and could not on the
     machine that matters, which is the shape of failure the root
     package.json was created to stop one level up.

     An alias rather than a second install: a `file:` dependency
     is copied by version, so a root copy would go stale the
     first time `shared/` changed and this test would be checking
     yesterday's table. Pointing at the source cannot. */
  alias: { "@reiad/shared": join(ROOT, "shared") },
  logLevel: "silent",
});

/** The two exports that bundle carries. It is imported from a
    `data:` URL, which is not a specifier tsc can resolve, so this
    is the file's own claim about it: the component the route
    renders, and the renderer that turns it into markup. */
interface HubBundle {
  SchoolHubPage: (props: { school: string }) => unknown;
  renderToStaticMarkup: (node: unknown) => string;
}

const mod: HubBundle = await import(
  `data:text/javascript;base64,${Buffer.from(bundled.outputFiles[0].text).toString("base64")}`);

const bodies: Record<string, string> = Object.fromEntries(
  ["deutsch", "english", "quran"].map((school) =>
    [school, mod.renderToStaticMarkup(mod.SchoolHubPage({ school }))]));

let bad = 0;
const ok = (n: string, c: unknown, d = ""): void => { console.log(`${c ? "  ok " : "FAIL"}  ${n}${c ? "" : "   " + d}`); if (!c) bad++; };

/** An element the markup is asserted to carry one line above, or
    the one export of three a school answers to. A missing one is a
    broken harness rather than a failing check, so it throws
    saying which. */
function need<T>(found: T | null | undefined, what: string): T {
  if (found == null) throw new Error(`no ${what}`);
  return found;
}

/** What a school's own progress module is called on to do here.
    Fetched from a computed address, so tsc resolves none of it:
    the two pairs are the words each school uses for the same
    thing. */
interface SchoolProgress {
  markRead?: (id: string) => void;
  markDone?: (id: string) => void;
  resetAll: () => void;
}

/** And its ladder, under whichever of the three names it carries. */
interface SchoolCurriculum {
  allTeile?: () => Array<{ id: string; status?: string }>;
  allParts?: () => Array<{ id: string; status?: string }>;
  allLessons?: () => Array<{ id: string; status?: string }>;
}

for (const school of ["deutsch", "english", "quran"]) {
  console.log(`\n--- ${school} ---`);
  const body = bodies[school];
  if (!body) { ok(`${school}: markup found in school-hubs.ts`, false); continue; }

  const { window, document } = parseHTML(`<!doctype html><html><body>${body}</body></html>`);
  const store = new Map<string, string>();
  const listeners = new Map<string, Array<(e: Event) => void>>();
  Object.assign(globalThis, {
    window, document,
    localStorage: {
      getItem: (k: string) => (store.has(k) ? store.get(k) : null),
      setItem: (k: string, v: unknown) => store.set(k, String(v)),
      removeItem: (k: string) => store.delete(k),
    },
    addEventListener: (t: string, f: (e: Event) => void) => listeners.set(t, [...(listeners.get(t) ?? []), f]),
    dispatchEvent: (e: Event) => { (listeners.get(e.type) ?? []).forEach((f) => f(e)); return true; },
    CustomEvent: window.CustomEvent,
    confirm: () => true,
    location: { pathname: `/${school}/index.html` },
  });

  const errors: string[] = [];
  try {
    await import(`/${school}/hub.js?${Math.random()}`);
  } catch (e) { errors.push(String(e)); }
  ok(`${school}: hub.js ran without throwing`, errors.length === 0, errors[0]);
  if (errors.length) continue;

  const rungs = [...document.querySelectorAll("details.rung")];
  ok(`${school}: the ladder built its rungs (${rungs.length})`, rungs.length > 0);

  /* `span.progress-ring > svg`, which is `<Ring>` in
     components/deck.tsx node for node. It was `svg.ring` with the
     rotation on a transform attribute, and that shape existed only
     because two layers both defined `.ring` and the school's copy
     lost. One shape now, and the rotation is the stylesheet's in
     both places.

     `progress-ring` rather than `ring` because `ring` is a Tailwind
     utility, and this test is what says the rename reached the
     module as well as the component. */
  const rings = document.querySelectorAll("span.progress-ring > svg").length;
  ok(`${school}: the shared ring drew one per rung (${rings})`, rings === rungs.length && rings > 0);

  const fills = [...document.querySelectorAll("span.progress-ring > svg circle.ring-fill")];
  /* `.every()` on an empty list is true, so the count is asserted
     first. This check passed for three schools while the selector
     above it was returning nothing at all. */
  ok(`${school}: every ring has a real circumference`,
    fills.length === rungs.length
    && fills.every((c) => Number(c.getAttribute("stroke-dasharray")) > 0));

  const states = rungs.map((r) => r.getAttribute("data-state"));
  ok(`${school}: exactly one rung is "now"`, states.filter((s) => s === "now").length === 1, states.join(","));
  ok(`${school}: every state is one the stylesheet knows`,
    states.every((s) => ["done", "now", "next", "past", "later"].includes(s ?? "")), states.join(","));

  const pills = [...document.querySelectorAll(".state-pill")].map((e) => (e.textContent ?? "").trim());
  ok(`${school}: every rung is labelled in Bangla`,
    pills.length === rungs.length && pills.every(Boolean), pills.join(","));

  const counts = [...document.querySelectorAll(".rung-count")].map((e) => e.textContent ?? "");
  ok(`${school}: rung counts are in Bangla numerals`,
    counts.length > 0 && counts.every((c) => /^[০-৯]+\/[০-৯]+$/.test(c)), counts.slice(0, 3).join(" "));

  const bar = document.getElementById(`${school}-progress`);
  ok(`${school}: the top bar was filled`, Boolean(bar?.querySelector(".count")?.textContent?.trim()),
    String(bar?.querySelector(".count")?.textContent));
  ok(`${school}: the bar's fill has a width`,
    /^\d+%$/.test(bar?.querySelector<HTMLElement>(".track i")?.style?.width ?? ""),
    String(bar?.querySelector<HTMLElement>(".track i")?.style?.width));

  ok(`${school}: reset is hidden with nothing to reset`,
    document.getElementById(`${school}-reset`)?.hidden === true);
  ok(`${school}: the resume card is hidden for a first-time reader`,
    document.getElementById("resume")?.hidden === true);

  /* And it is the painter hiding it, not the markup. The route
     ships `<div id="resume" hidden>`, so the assertion above
     passes whether or not paintResume ever runs: it did, on a
     version of this file that had lost the branch entirely. */
  need(document.getElementById("resume"), "#resume").hidden = false;

  /* Now read something, and see the page answer. */
  const P: SchoolProgress = await import(`/${school}/progress.js`);
  const cur: SchoolCurriculum = await import(`/${school}/curriculum.js`);
  const all = need(cur.allTeile ?? cur.allParts ?? cur.allLessons, "a ladder")();
  const live = all.filter((l) => l.status === "live");
  need(P.markRead ?? P.markDone, "a mark function")(live[0].id);

  ok(`${school}: the resume card appears once something is read`,
    document.getElementById("resume")?.hidden === false);
  ok(`${school}: and names what to resume`,
    Boolean(document.querySelector("#resume .resume-label")?.textContent?.trim()),
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
      .every((e) => /^০\//.test(e.textContent ?? "")),
    [...document.querySelectorAll(".rung-count")].map((e) => e.textContent).join(" "));
}

console.log(bad ? `\n${bad} failed` : "\nAll three hubs build their ladder, ring, bar and resume card.");
process.exit(bad ? 1 : 0);
