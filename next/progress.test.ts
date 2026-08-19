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

if (failures.length) {
  console.error(`\nprogress: ${failures.length} failed of ${passed + failures.length}`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`\nprogress: ${passed} checks, and reading a page never costs a reader a tick.`);
