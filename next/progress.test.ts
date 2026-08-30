#!/usr/bin/env node
/* ============================================================
   progress.test.ts: the money school's ticks.

       node next/progress.test.ts

   No browser and no build: the module is `localStorage` and
   arithmetic, so a shim is enough and this can run beside the
   other checks rather than only where Playwright does.

   ---- what it is really guarding ----

   One thing above all: READING NEVER WRITES.

   `readSet` used to take the ids the caller had on screen, treat
   anything else in storage as foreign, and save the survivors. It
   needed that list to be the school's complete set, and not one
   caller passed that: a lesson page passed one id, a card passed
   one id, and the school hub passed one stage's lessons, once per
   stage. So opening a lesson pruned a reader's ticks to that
   lesson, and the hub let its stages take turns overwriting each
   other.

   Nothing caught it. Every existing check reads HTML or runs the
   OTHER three schools' engine, which never had the fault, and the
   percentage a reader saw was correct right up until the moment
   it was wrong for good. With an account the empty set then went
   up, because a device is a mirror and this was indistinguishable
   from somebody un-ticking forty lessons by hand.

   The first block below is that bug, written as the thing a
   reader would notice.
   ============================================================ */

/* A module, said out loud. Nothing imports this file and every
   import in it is dynamic, so there is no module syntax for node
   or for tsc to find, and the top-level `await` below is only
   legal in a module. It survives type stripping, which an
   `import type` would not. */
export {};

/* ---------- the smallest browser that will do ----------

   Two globals rather than three: `CustomEvent` is node's own and
   has been since node 19, so `announce()` builds a real one.
   `window` is a real `EventTarget` for the same reason, which is
   also why it is installed rather than assigned: the DOM type of
   `window` is `Window & typeof globalThis`, and a cast to that
   would claim a browser this is not. */

const store = new Map<string, string>();

const storage: Storage = {
  get length() { return store.size; },
  key: (i) => [...store.keys()][i] ?? null,
  getItem: (k) => store.get(k) ?? null,
  setItem: (k, v) => { store.set(k, String(v)); },
  removeItem: (k) => { store.delete(k); },
  clear: () => { store.clear(); },
};
globalThis.localStorage = storage;
Object.defineProperty(globalThis, "window", {
  value: new EventTarget(), writable: true, configurable: true,
});

const P = await import("./lib/progress.ts");

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed++; console.log(`  ok   ${what}`); }
  else { failures.push(`${what}${detail ? `: ${detail}` : ""}`); console.log(`  FAIL ${what}   ${detail}`); }
};
const reset = () => store.clear();

/** What a key holds, narrowed rather than asserted: `JSON.parse`
    promises nothing about what it found, and an absent key and a
    key full of rubbish are the same answer here because they are
    the same answer to the module. */
const storedIds = (key: string): string[] => {
  const value: unknown = JSON.parse(store.get(key) ?? "null");
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
};

/** A bookmark, of which only the id decides anything. */
const storedMark = (key: string): { id: string } | null => {
  const value: unknown = JSON.parse(store.get(key) ?? "null");
  if (typeof value !== "object" || value === null || !("id" in value)) return null;
  const id: unknown = value.id;
  return typeof id === "string" ? { id } : null;
};

/* ============================================================
   1. Reading a page must not cost a reader their ticks
   ============================================================ */
console.log("\n--- reading never writes ---");
{
  reset();
  const forty = Array.from({ length: 40 }, (_, i) => `basics-1/l${i + 1}`);
  store.set("learn-read", JSON.stringify(forty));

  /* What a lesson page does: it wants to know about ONE lesson. */
  const set = P.readSet("money");
  ok("a lesson page still sees all forty ticks", set.size === 40, `saw ${set.size}`);
  ok("and storage is untouched by having been read",
    storedIds("learn-read").length === 40, `${storedIds("learn-read").length} left`);

  /* What the hub does: one meter per stage, several times over. */
  for (let i = 0; i < 8; i++) P.readSet("money");
  ok("eight stage meters in a row leave all forty",
    storedIds("learn-read").length === 40, `${storedIds("learn-read").length} left`);

  /* An id from another school, left by an old bug, is inert
     rather than something to go and delete. */
  reset();
  store.set("learn-read", JSON.stringify(["basics-1/l1", "deutsch/stufe-1/teil-2"]));
  const mixed = P.readSet("money");
  ok("a foreign id is returned rather than deleted", mixed.size === 2);
  ok("and a count that asks about its own ids ignores it",
    ["basics-1/l1"].filter((id) => mixed.has(id)).length === 1);
}

/* ============================================================
   2. The keys, which are the one thing that must never move
   ============================================================ */
console.log("\n--- the storage keys ---");
{
  reset();
  P.markRead("money", "basics-1/l1");
  ok("the money school writes `learn-read`, not `money-read`",
    storedIds("learn-read").length === 1 && store.get("money-read") === undefined);

  reset();
  P.markRead("quran", "dhap-1/dars-1");
  ok("the Qur'anic Arabic school writes `quran-done`",
    storedIds("quran-done").length === 1);

  const pairs: Array<[school: string, key: string]> = [
    ["deutsch", "deutsch-read"], ["english", "english-read"]];
  for (const [school, key] of pairs) {
    reset();
    P.markRead(school, "x/y");
    ok(`the ${school} school writes \`${key}\``, storedIds(key).length === 1);
  }

  reset();
  P.setLast("money", { id: "a", title: "t", stage: "s", url: "/money/a/" });
  ok("the money school's bookmark is `learn-last`", storedMark("learn-last")?.id === "a");
}

/* ============================================================
   3. Ticking
   ============================================================ */
console.log("\n--- ticking ---");
{
  reset();
  ok("toggling on reports on", P.toggleRead("money", "a") === true);
  ok("and is stored", P.readSet("money").has("a"));
  ok("toggling off reports off", P.toggleRead("money", "a") === false);
  ok("and is gone", !P.readSet("money").has("a"));

  reset();
  P.markRead("money", "a");
  const first = store.get("learn-read");
  P.markRead("money", "a");
  ok("marking an already-marked lesson changes nothing",
    store.get("learn-read") === first);

  reset();
  store.set("learn-read", JSON.stringify("not an array"));
  ok("rubbish in storage reads as nothing rather than throwing",
    P.readSet("money").size === 0);
}

/* ============================================================
   4. The bookmark, which is an id and not an address
   ============================================================ */
console.log("\n--- the bookmark ---");
{
  reset();
  P.setLast("money", { id: "a", title: "A", stage: "s", url: "/money/a/" });
  ok("a bookmark comes back", P.getLast("money")?.id === "a");
  ok("a bookmark for a lesson that still exists is offered",
    P.getLast("money", new Set(["a"]))?.id === "a");
  /* A lesson that was withdrawn: the bookmark points at nothing,
     and offering it would send a reader to a 404. */
  ok("a bookmark for a lesson that no longer exists is not",
    P.getLast("money", new Set(["b"])) === null);

  reset();
  P.setLast("money", { id: "", title: "", stage: "", url: "" });
  ok("an empty id is not a bookmark", P.getLast("money") === null);
}

/* ============================================================
   5. The front door, which asks all four schools at once
   ============================================================ */
console.log("\n--- across the schools ---");
{
  reset();
  /* Two visits, minutes apart, which is what this actually is. The
     clock is driven rather than real because `Date.now()` twice in
     a row is the same millisecond, and then the winner is decided
     by the order of the SCHOOLS list instead of by recency, which
     is not a thing worth asserting either way. */
  const realNow = Date.now;
  let clock = 1_700_000_000_000;
  Date.now = () => clock;
  P.setLast("money", { id: "m", title: "M", stage: "s", url: "/money/m/" });
  clock += 5 * 60_000;
  P.setLast("deutsch", { id: "d", title: "D", stage: "s", url: "/deutsch/d/" });
  Date.now = realNow;

  const best = P.latest();
  ok("the most recent school is the one offered", best?.school === "deutsch", best?.school);
  ok("and it carries the address the front door needs", !!best?.url);

  reset();
  ok("a reader who has never started is offered nothing", P.latest() === null);
}

console.log("\n--- how far into a piece ---");
{
  reset();
  const A = "/insights/one.html";
  const B = "/insights/two.html";

  ok("a page nobody has read has no position", P.whereRead(A) === null);

  P.markWhere(A, { i: 4, of: 30, sig: "the first words" });
  ok("a position is kept", P.whereRead(A)?.i === 4, String(P.whereRead(A)?.i));

  /* THE LAST THING SAID IS THE POSITION. Forwards-only belongs to
     the caller, because only the caller knows what one visit is:
     `components/where.tsx` keeps the furthest block of this visit
     and only calls in when it moves, and opening the page again
     tomorrow to reread it legitimately starts lower down. A guard
     here compared the signature too, which is of the block at
     that index and therefore changes on every step, so it never
     fired and the first thing it let through was a reader
     arriving at the top of a piece and losing their half-way
     position to the first paragraph. */
  P.markWhere(A, { i: 9, of: 30, sig: "further in" });
  ok("carrying on moves it", P.whereRead(A)?.i === 9);
  P.markWhere(A, { i: 3, of: 26, sig: "different words entirely" });
  ok("and a reread starts again where the reader is",
    P.whereRead(A)?.i === 3, String(P.whereRead(A)?.i));
  ok("the signature travels with it, because the index alone is a guess",
    P.whereRead(A)?.sig === "different words entirely");

  P.markWhere(B, { i: 1, of: 12, sig: "another piece" });
  ok("one page's position is not another's", P.whereRead(A)?.i === 3 && P.whereRead(B)?.i === 1);
  ok("and both are listed", Object.keys(P.everywhereRead()).length === 2);

  P.forgetWhere(A);
  ok("finishing a piece forgets it", P.whereRead(A) === null);
  ok("and leaves the others alone", P.whereRead(B)?.i === 1);
  P.forgetWhere("/never-read");
  ok("forgetting a page that was never read is nothing", P.whereRead(B)?.i === 1);

  /* THE MAP DOES NOT GROW FOR EVER. Every entry goes up to the
     account with the rest, so the oldest are dropped rather than
     kept: nobody returns to a piece they abandoned two hundred
     pieces ago and expects to be remembered. */
  reset();
  const realNow = Date.now;
  let clock = 1_700_000_000_000;
  Date.now = () => clock;
  for (let n = 0; n < 240; n += 1) {
    clock += 1000;
    P.markWhere(`/insights/p${n}.html`, { i: 3, of: 20, sig: `p${n}` });
  }
  Date.now = realNow;
  const all = P.everywhereRead();
  ok("the oldest positions are dropped", Object.keys(all).length === 200,
    String(Object.keys(all).length));
  ok("and the newest is kept", !!all["/insights/p239.html"]);
  ok("while the oldest is gone", !all["/insights/p0.html"]);
}

console.log("\n--- which tools ---");
{
  reset();
  ok("nothing used yet", Object.keys(P.toolsUsed()).length === 0);
  P.markToolUsed("stock");
  P.markToolUsed("diet");
  ok("both are remembered", Object.keys(P.toolsUsed()).sort().join() === "diet,stock");
  ok("and each carries when", P.toolsUsed().stock > 0);

  /* A TIMESTAMP AND NEVER A COUNT: two devices each saying five
     are either ten openings or the same five seen twice, and
     nothing in the value can tell them apart. Opening a tool
     twice is one fact, not two. */
  const first = P.toolsUsed().stock;
  P.markToolUsed("stock");
  ok("opening it again is still one entry", Object.keys(P.toolsUsed()).length === 2);
  ok("and moves the time rather than a count", P.toolsUsed().stock >= first);
}

if (failures.length) {
  console.error(`\nprogress: ${failures.length} failed of ${passed + failures.length}`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nprogress: ${passed} checks, and reading a page never costs a reader a tick.`);
