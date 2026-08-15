/* ============================================================
   sync.js: the same learner on a phone and on a laptop.

   Four schools keep what you have read in localStorage, and have
   since before there were accounts. That is still where they read
   and write it: this file copies those keys up to the account and
   back, and touches nothing else. None of the four progress
   modules knows it exists, which is the point. They each announce
   their changes on the window already, so there is nothing to
   rewire and nothing new to keep in step.

   Signed out, this file does nothing at all. No request, no
   storage, no listener that matters. Progress works exactly as it
   did in 2025, on this device, for anyone who never signs in.

   ---- merging, and why nothing is ever lost ----

   Two devices holding two versions of the same key is the normal
   case, not the exception: read a lesson on the bus, tick another
   at a desk, and neither copy is wrong. So there is no
   "last writer wins" here for the things that matter.

     a set of ids     union. A tick only ever goes from off to on,
                      so the union of two devices is exactly what
                      the person actually did.
     a bookmark       the newer of the two, by the timestamp it
                      already carries.
     a day counter    the higher number. You do not un-reach day
                      eleven of a thirty day book.

   The one exception is deliberate erasure: emptying a set here,
   more recently than the account was touched, replaces the account
   copy rather than merging with it, or "forget my progress" would
   quietly undo itself on the next page.

   TRANSITION.md, Stage 6.
   ============================================================ */

import { SUPABASE_URL, SUPABASE_KEY, token, current } from "/account.js";

const REST = `${SUPABASE_URL}/rest/v1/progress`;

/* Which keys travel, how two copies are reconciled, and which
   school to tell when one changes underneath it. */
const KEYS = {
  "learn-read": ["union", "learn:progress"],
  "learn-last": ["newest", "learn:progress"],
  "deutsch-read": ["union", "deutsch:progress"],
  "deutsch-days": ["union", "deutsch:progress"],
  "deutsch-last": ["newest", "deutsch:progress"],
  "deutsch-tag": ["highest", "deutsch:progress"],
  "english-read": ["union", "english:progress"],
  "english-days": ["union", "english:progress"],
  "english-last": ["newest", "english:progress"],
  "english-day": ["highest", "english:progress"],
  "quran-done": ["union", "quran:progress"],
  "quran-last": ["newest", "quran:progress"],
};

/* When each key was last written on this device. Kept so an empty
   set can be told apart from a set that was never filled in. */
const CLOCK = "sync-clock";

/* ============================================================
   localStorage, carefully
   ============================================================ */

const read = (key) => {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;      // not JSON, or storage is off
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;          // private mode: syncing is a nicety
  }
};

const clock = () => read(CLOCK) ?? {};
const touch = (keys) => {
  const now = Date.now();
  const map = clock();
  keys.forEach((key) => { map[key] = now; });
  write(CLOCK, map);
};

/* ============================================================
   Merging
   ============================================================ */

const asArray = (v) => (Array.isArray(v) ? v : []);

/** Both, with duplicates removed and order made stable. */
const union = (mine, theirs) => [...new Set([...asArray(theirs), ...asArray(mine)])];

/** The one written later. Bookmarks carry their own timestamp. */
const newest = (mine, theirs, mineAt, theirsAt) => {
  const a = Number(mine?.ts) || mineAt || 0;
  const b = Number(theirs?.ts) || theirsAt || 0;
  if (mine === undefined) return theirs;
  if (theirs === undefined) return mine;
  return b > a ? theirs : mine;
};

/** The further of the two through a book. */
const highest = (mine, theirs) => {
  const a = Number(mine) || 0;
  const b = Number(theirs) || 0;
  return String(Math.max(a, b) || "");
};

/**
 * One key, reconciled.
 *
 * `mineAt` is when this device last wrote it, `theirsAt` when the
 * account row was last touched. They only decide anything for the
 * two rules that cannot merge, and for the erasure case below.
 */
function reconcile(rule, mine, theirs, mineAt, theirsAt) {
  if (rule === "union") {
    // Emptied here, and more recently than the account: that is
    // somebody clearing their progress, not an empty first visit.
    if (Array.isArray(mine) && mine.length === 0 && mineAt > theirsAt) return [];
    return union(mine, theirs);
  }
  if (rule === "highest") return highest(mine, theirs);
  return newest(mine, theirs, mineAt, theirsAt);
}

/* ============================================================
   The account end
   ============================================================ */

async function headers() {
  const access = await token();
  if (!access) return null;
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${access}`,
    "Content-Type": "application/json",
  };
}

async function fetchRows(head) {
  const res = await fetch(`${REST}?select=key,value,updated_at`, { headers: head });
  if (!res.ok) throw new Error(`pull ${res.status}`);
  const rows = await res.json();
  return new Map(rows.map((row) => [row.key, row]));
}

/** Upsert, which is what `merge-duplicates` means here. user_id is
    filled in by the column default from the token, so this browser
    never names whose rows it is writing. */
async function sendRows(head, rows) {
  if (!rows.length) return;
  const res = await fetch(`${REST}?on_conflict=user_id,key`, {
    method: "POST",
    headers: { ...head, Prefer: "resolution=merge-duplicates,return=minimal" },
    body: JSON.stringify(rows),
  });
  if (!res.ok) throw new Error(`push ${res.status}`);
}

/* ============================================================
   The whole job
   ============================================================ */

let running = null;
let pending = false;

/**
 * Pull, merge, write back locally, push whatever differs.
 *
 * Runs at most one at a time; a request to sync while one is in
 * flight sets a flag and runs once more afterwards, so a burst of
 * ticks costs two round trips rather than ten.
 */
export function sync() {
  if (!current()) return Promise.resolve(false);
  if (running) { pending = true; return running; }

  running = (async () => {
    try {
      const head = await headers();
      if (!head) return false;

      const theirs = await fetchRows(head);
      const times = clock();
      const changedSchools = new Set();
      const toPush = [];

      for (const [key, [rule, event]] of Object.entries(KEYS)) {
        const mine = read(key);
        const row = theirs.get(key);
        const theirValue = row?.value ?? undefined;

        // Neither side has anything to say about this key.
        if (mine === undefined && theirValue === undefined) continue;

        const merged = reconcile(
          rule, mine, theirValue,
          times[key] ?? 0,
          row ? Date.parse(row.updated_at) : 0
        );

        const mineJson = JSON.stringify(mine ?? null);
        const mergedJson = JSON.stringify(merged ?? null);

        if (mergedJson !== mineJson && merged !== undefined) {
          if (write(key, merged)) changedSchools.add(event);
        }
        if (mergedJson !== JSON.stringify(theirValue ?? null)) {
          toPush.push({ key, value: merged ?? null });
        }
      }

      await sendRows(head, toPush);

      /* Tell the school its own storage moved underneath it, using
         the event it already listens to. Without this a tick
         arriving from another device does not appear until the
         next page load. */
      changedSchools.forEach((event) => dispatchEvent(new CustomEvent(event)));

      document.dispatchEvent(new CustomEvent("sync:done", {
        detail: { pulled: theirs.size, pushed: toPush.length },
      }));
      return true;
    } catch (err) {
      // A failed sync is a device that is still perfectly usable.
      console.warn("progress sync failed", err);
      return false;
    } finally {
      running = null;
      if (pending) { pending = false; sync(); }
    }
  })();

  return running;
}

/** Take everything off the account. The local copy is left alone:
    clearing this device is what the schools' own reset does. */
export async function forgetOnAccount() {
  const head = await headers();
  if (!head) return false;
  const res = await fetch(`${REST}?key=neq.`, { method: "DELETE", headers: head });
  return res.ok;
}

/* ============================================================
   Wiring
   ============================================================ */

let wired = false;

/** Called by signin.js once it knows whether anyone is signed in. */
export function startSync() {
  if (!current()) return;

  if (!wired) {
    wired = true;

    /* Each school announces its own changes already. Recording the
       time here is what lets an emptied set be told from an empty
       one later. */
    for (const [key, [, event]] of Object.entries(KEYS)) {
      addEventListener(event, () => {
        touch(Object.keys(KEYS).filter((k) => KEYS[k][1] === event));
        schedule();
      }, { passive: true });
      void key;
    }

    // Another tab, same person.
    addEventListener("storage", (e) => {
      if (e.key && e.key in KEYS) { touch([e.key]); schedule(); }
    });

    // Leaving the page is the last chance to send a tick.
    addEventListener("pagehide", () => { if (current()) sync(); });
    document.addEventListener("account:changed", () => { if (current()) sync(); });
  }

  sync();
}

/* Ticks arrive in bursts: opening a lesson marks it read and moves
   the bookmark in the same breath. One sync a few seconds later
   carries both. */
let timer;
function schedule() {
  clearTimeout(timer);
  timer = setTimeout(sync, 2500);
}
