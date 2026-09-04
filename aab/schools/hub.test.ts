#!/usr/bin/env node
/* hub.test.ts: the three school hubs, against the markup a
   reader actually gets.

       node aab/schools/hub.test.ts

   `progress.test.ts` covers the arithmetic; this covers the
   drawing, which is the half a reader sees. A port is finished
   when it does what the thing it replaced did, not when it
   renders, and those two look identical from the outside.

   The markup is RENDERED from `components/school-hub-page.tsx`
   rather than read off disk: a test that read a string would go
   on passing against markup nothing serves.

   No browser and no network: `linkedom` is the DOM, storage and
   events are stubbed, and the markup is rendered in process.
   Without linkedom it says so and SKIPS, which is not a pass.
   `aab/tsconfig.test.json` typechecks the annotations below and
   `scripts/check-types.ts` runs it. */

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

/* The hub bodies, rendered from the component the route uses.
   Node strips types but cannot transform JSX, so the component
   is bundled first. Bare specifiers resolve FROM THE ROOT, where
   `linkedom` is: CI runs `npm ci` at the root and nowhere else,
   so reaching into `next/node_modules` works on a laptop and
   fails on the runner. */
const { build } = await import("esbuild");

/* The renderer is bundled WITH the component: the result is
   imported as a `data:` URL, and a data module cannot resolve a
   bare specifier, so anything left external throws at import.
   `resolveDir` is `next/`, so the component's neighbours resolve
   beside it and react resolves by walking up to the root. */
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
  /* `@reiad/shared` IS INSTALLED IN `next/` AND NOWHERE ELSE,
     and `next/node_modules` does not exist on a CI runner. An
     ALIAS rather than a second install: a `file:` dependency is
     copied by version, so a root copy would go stale the first
     time `shared/` changed and this test would be checking
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
     components/deck.tsx node for node, with the rotation in the
     stylesheet. `progress-ring` rather than `ring`, which is a
     Tailwind utility, and this is what says the rename reached
     the module as well as the component. */
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
