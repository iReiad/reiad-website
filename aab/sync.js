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

   archive/TRANSITION.md, Stage 6.
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

  /* Which days this person turned up, from streak.js. A union for
     the obvious reason: a phone on the bus and a laptop at a desk
     are the same Tuesday, and either one alone under-counts. */
  "days-active": ["union", "streak:changed"],
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

/** Take a key away, as the schools' own reset does. */
const forget = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
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
  /* CLEARED HERE, MORE RECENTLY THAN THE ACCOUNT WAS TOUCHED.
     That is somebody pressing "reset", not an empty first visit,
     and the difference is `mineAt`: a device that never had the
     key has no clock entry, so mineAt is 0 and this never fires.

     `mine === undefined` has to count as cleared, and that is the
     bug this comment exists for. Every school's resetAll() does
     `localStorage.removeItem(key)` rather than writing an empty
     array, so after a reset `mine` is undefined, not []. The guard
     tested only for [], so the union ran, the account's copy came
     straight back, and the answer to "reset my progress" while
     signed in was that nothing happened. */
  const cleared = mine === undefined
    || (Array.isArray(mine) && mine.length === 0);

  if (rule === "union") {
    if (cleared && mineAt > theirsAt) return [];
    return union(mine, theirs);
  }
  if (rule === "highest") {
    if (cleared && mineAt > theirsAt) return "";
    return highest(mine, theirs);
  }
  // A bookmark, cleared here on purpose, stays cleared.
  if (cleared && mineAt > theirsAt) return null;
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
   Meeting an account for the first time on this device

   Every sync after the first is a merge, and a merge is right:
   two devices holding two versions of the same key is the normal
   case, and neither copy is wrong.

   The FIRST one is a different question, and answering it as a
   merge was wrong. Signing in on a browser that already had
   progress silently pushed that progress into the account, for
   ever, with nothing said and no way to tell it apart afterwards.
   That is fine when it was you reading as a guest on your own
   laptop. It is not fine on a borrowed phone, on a browser you
   were testing with, or on a new account that should start new,
   and those are exactly the cases where it cannot be undone.

   So the first contact between a device and an account is a
   question rather than an assumption, asked once, and only when
   there is genuinely something to lose: this device has progress
   AND the account already has its own. Anything else needs no
   question, because nothing can be lost by merging with nothing.

   The answer is remembered per account id, so signing out and
   back in does not ask again, and a second account on the same
   browser is its own first contact.
   ============================================================ */

const SEEN = "sync-accounts";

const seenAccounts = () => {
  const list = read(SEEN);
  return Array.isArray(list) ? list : [];
};

const rememberAccount = (id) => {
  const list = seenAccounts();
  if (!list.includes(id)) write(SEEN, [...list, id]);
};

/** Does this device hold progress of its own? */
function deviceHasProgress() {
  return Object.keys(KEYS).some((key) => {
    if (key === "days-active") return false;   // a by-product, not a decision
    const value = read(key);
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  });
}

/**
 * Take this device's progress off, so the account's is adopted.
 *
 * THE CLOCK IS CLEARED TOO, and that is the whole subtlety. An
 * empty key with a RECENT clock entry means "somebody pressed
 * reset", and reconcile() propagates that to the account, which is
 * correct for a reset and catastrophic here: answering "use my
 * account's" would clear the device and then clear the account to
 * match it, losing exactly what the reader asked to keep. Removing
 * the clock entry says the opposite thing, "this device has never
 * had an opinion about this key", so the account's copy wins the
 * merge that follows.
 */
function adoptAccount() {
  const map = clock();
  for (const key of Object.keys(KEYS)) {
    forget(key);
    delete map[key];
  }
  write(CLOCK, map);

  /* AND IT DOES NOT ANNOUNCE. Telling the schools here would be
     the obvious courtesy and is a loop: each school's listener in
     startSync() calls touch(), which writes the clock entries this
     function just deleted, so the very next pass reads an empty
     key with a fresh timestamp, decides it was a deliberate reset
     and clears the account to match. Answering "use my account's"
     would empty the account instead of adopting it.

     Nothing is lost by staying quiet. The merge immediately after
     this writes the account's values in and announces exactly the
     schools whose keys actually changed. */
}

/**
 * Ask, once, what should happen to what is already on this device.
 *
 * Returns "merge", "account" or "device". A reader who dismisses
 * the question gets "account", which is the answer that changes
 * nothing about the account: the cautious default belongs on the
 * side of the shared thing, not the local one.
 */
async function askFirstContact(counts) {
  const { openChoice } = await import("/first-sync.js");
  return openChoice(counts);
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

      let theirs = await fetchRows(head);

      /* First contact, and only when something could be lost. See
         the long note above: everything after this is a merge, and
         a merge is right; the first one is a question. */
      const who = current()?.id;
      if (who && !seenAccounts().includes(who)) {
        const accountHas = [...theirs.keys()].some((k) => k !== "days-active");
        if (accountHas && deviceHasProgress()) {
          const answer = await askFirstContact({
            account: theirs.size,
            device: Object.keys(KEYS).filter((k) => read(k) !== undefined).length,
          });
          if (answer === "device") {
            /* Keep this browser's, so the account is replaced. The
               push below does it: every key is written from here. */
            const now = Date.now();
            const map = clock();
            Object.keys(KEYS).forEach((k) => { map[k] = now; });
            write(CLOCK, map);
            theirs = new Map();
          } else if (answer !== "merge") {
            // "account": this device starts from what the account has.
            adoptAccount();
          }
        }
        rememberAccount(who);
      }

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
          /* A cleared bookmark is removed rather than written as
             the string "null", so the school reads it back as
             absent, which is what it was before it was ever set. */
          const stored = merged === null ? forget(key) : write(key, merged);
          if (stored) changedSchools.add(event);
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
