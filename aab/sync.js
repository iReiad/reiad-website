/* ============================================================
   sync.ts: progress belongs to the account.

   ---- what changed, and why the old one had to go ----

   The first version of this file treated a browser and an account
   as two equal copies of the same thing and merged them. It read
   localStorage, unioned it with the account's rows, wrote the
   result back to both, and asked a three-way question the first
   time a device met an account so that the merge could not lose
   anything. Every one of those pieces was careful and the shape
   underneath them was wrong.

   A browser is not a copy of an account. It is a machine somebody
   happens to be sitting at, and it may be a library computer, a
   phone that was handed over for five minutes, or a profile that
   was used for testing. Treating whatever it held as a claim on
   the account meant the site had to ASK before it could act, and
   a dialog in the middle of signing in is what an unanswerable
   design question looks like from the reader's side.

   So there is one record now, and it is the account. This file
   reads it, writes it, and keeps a copy of it on the device so
   that pages which have always read localStorage go on working
   without knowing any of this happened.

     signed out    nothing. No request, no listener, no storage
                   touched. Progress is this browser's, exactly as
                   it was in 2025, and no page needs an account.

     signing in    the account's rows are written onto this
                   device. What the browser held before is not
                   uploaded, not merged and not consulted. That is
                   the whole rule, and it is the one the old file
                   could not state in a sentence.

     signed in     the device is a mirror. A tick made here is a
                   change to the account and goes up; a tick made
                   on the phone comes down.

     signing out   the mirror is taken off. It was never this
                   browser's to keep, and leaving one reader's
                   ticks behind for the next person at the same
                   machine is the failure the rule above exists to
                   prevent.

   ---- two signed-in devices, which is a real case ----

   Read a lesson on the bus, tick another at a desk, and neither
   the phone nor the laptop is wrong. Nothing here is
   last-writer-wins for the things that matter, but the
   reconciliation is now between two states that both came FROM
   the account, rather than between the account and whatever a
   browser happened to hold.

   `base` is what the account said when this page last exchanged
   with it. `local` is what the device says now. The difference
   between them is what this reader actually did in this session:

     added   = local \ base        their ticks
     removed = base \ local        their untick, or a reset

   and the value written back is `(remote ∪ added) \ removed`,
   against a freshly read `remote`. A tick from another device
   inside `remote` survives; a reset here clears the account
   instead of being undone by it. The old file needed a special
   case and a timestamp per key to get the reset right, and it got
   it wrong for a year because every school's resetAll() removes a
   key rather than emptying it. There is no special case here: an
   absent key is an empty set, an empty set makes `removed` the
   whole of `base`, and the account ends up empty because that is
   what subtraction says.

   archive/TRANSITION.md, Stage 6, rewritten 17 August 2026.
   ============================================================ */
import { SUPABASE_URL, SUPABASE_KEY, token, current } from "/account.js";
const REST = `${SUPABASE_URL}/rest/v1/progress`;
const KEYS = {
    "learn-read": ["set", "learn:progress"],
    "learn-last": ["mark", "learn:progress"],
    "deutsch-read": ["set", "deutsch:progress"],
    "deutsch-days": ["set", "deutsch:progress"],
    "deutsch-last": ["mark", "deutsch:progress"],
    "deutsch-tag": ["count", "deutsch:progress"],
    "english-read": ["set", "english:progress"],
    "english-days": ["set", "english:progress"],
    "english-last": ["mark", "english:progress"],
    "english-day": ["count", "english:progress"],
    "quran-done": ["set", "quran:progress"],
    "quran-last": ["mark", "quran:progress"],
    /* Checkpoints inside a lesson: the ticks on a checklist a
       reader works through as they read. New with this rewrite, and
       a `set` like every other tick, so it needed nothing here
       except a line. See /checkpoints.js. */
    "learn-checks": ["set", "learn:progress"],
    "deutsch-checks": ["set", "deutsch:progress"],
    "english-checks": ["set", "english:progress"],
    "quran-checks": ["set", "quran:progress"],
    /* The third-party course section, /skills/courses/. A `set` of
       `<course>/<module>/<lesson>` and a bookmark, exactly like a
       school's, because a tick is a tick whoever wrote the lesson.
  
       It is here rather than left to the browser alone even though
       the whole section is admin-only and therefore always signed
       in: that is the reason it belongs here, not a reason to skip
       it. A reader who ticks forty lessons on a laptop and opens
       the course on a phone is the case this table exists for, and
       an admin has more devices than anybody. See
       `aab/src/courses.ts`. */
    "courses-read": ["set", "courses:progress"],
    "courses-last": ["mark", "courses:progress"],
    /* Which days this person turned up, from streak.js. A set for
       the obvious reason: a phone on the bus and a laptop at a desk
       are the same Tuesday, and either one alone under-counts. */
    "days-active": ["set", "streak:changed"],
    /* How this reader wants to be read to: the type size, the
       measure and which language the calculators open in. See
       /prefs.js.
  
       A `mark` rather than a `set`, and it is the one key here
       where that is not obvious. Every other value in this table
       accumulates: a tick goes from off to on and the union of two
       devices is what the person actually did. A preference does
       not accumulate, it is REPLACED, and the union of two devices'
       type sizes is not a type size. So the newer of the two wins,
       by the `ts` prefs.js writes into the value, which is exactly
       what a bookmark already needed and why the rule was there to
       be reused. */
    "reader-prefs": ["mark", "prefs:sync"],
};
/** Every key the account owns, which is every key above. */
export const SYNCED_KEYS = Object.keys(KEYS);
/* ============================================================
   localStorage, carefully
   ============================================================ */
const read = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? undefined : JSON.parse(raw);
    }
    catch {
        return undefined; // not JSON, or storage is off
    }
};
const write = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
    }
    catch {
        return false; // private mode: the mirror is a nicety
    }
};
const forget = (key) => {
    try {
        localStorage.removeItem(key);
        return true;
    }
    catch {
        return false;
    }
};
/* ============================================================
   The three shapes

   Each takes what the account said last time this page spoke to
   it, what this device says now, and what the account says at
   this moment, and returns what both should hold.
   ============================================================ */
const list = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string") : []);
/** (remote ∪ added) \ removed, with the order made stable. */
function reconcileSet(base, mine, remote) {
    const was = new Set(list(base));
    const now = new Set(list(mine));
    const theirs = new Set(list(remote));
    for (const id of now)
        if (!was.has(id))
            theirs.add(id); // added here
    for (const id of was)
        if (!now.has(id))
            theirs.delete(id); // removed here
    return [...theirs];
}
/** The one written later. Both sides carry their own timestamp,
    so there is nothing to infer, and a value cleared on this
    device (a reset) stays cleared and says so with null.

    Presence is "an object is there", not "it has an id". That is
    a widening rather than a looseness: this rule started out
    serving bookmarks alone, which always carry an `id`, and it
    now also serves `reader-prefs`, which carries a `ts` and a
    handful of settings and no id at all. Testing for a field only
    one of the two shapes has would have made every preference
    change look like an empty value and clear the account's copy. */
const there = (v) => v !== null && v !== undefined && typeof v === "object" && !Array.isArray(v);
function reconcileMark(base, mine, remote) {
    if (there(base) && !there(mine))
        return null; // cleared here
    if (!there(mine))
        return there(remote) ? remote : null;
    if (!there(remote))
        return mine;
    return (Number(remote.ts) || 0) > (Number(mine.ts) || 0) ? remote : mine;
}
/** The further of the two through a practice book, unless this
    device went backwards, which only a reset does. */
function reconcileCount(base, mine, remote) {
    const was = Number(base) || 0;
    const now = Number(mine) || 0;
    const theirs = Number(remote) || 0;
    if (now < was)
        return now ? String(now) : ""; // reset, or a step back
    return String(Math.max(now, theirs) || "");
}
function reconcile(rule, base, mine, remote) {
    if (rule === "set")
        return reconcileSet(base, mine, remote);
    if (rule === "count")
        return reconcileCount(base, mine, remote);
    return reconcileMark(base, mine, remote);
}
/** What a key holds when nothing holds it, so that "the account
    has nothing" and "this device has nothing" are one answer. */
const emptyFor = (rule) => (rule === "set" ? [] : rule === "count" ? "" : null);
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
async function headers() {
    const access = await token();
    if (!access)
        return null;
    return {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
    };
}
/** Every row this account holds, as key → value. */
async function fetchRows(head) {
    const res = await fetch(`${REST}?select=key,value`, { headers: head });
    if (!res.ok)
        throw new Error(`pull ${res.status}`);
    const rows = (await res.json());
    return new Map(rows.map((row) => [row.key, row.value]));
}
/** Upsert. `user_id` is filled in by the column default from the
    token, so this browser never names whose rows it is writing:
    it cannot get that wrong and it cannot be talked into getting
    it wrong. */
async function sendRows(head, rows) {
    if (!rows.length)
        return;
    const res = await fetch(`${REST}?on_conflict=user_id,key`, {
        method: "POST",
        headers: { ...head, Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify(rows),
    });
    if (!res.ok)
        throw new Error(`push ${res.status}`);
}
/* ============================================================
   The mirror

   `base` is the account as this page last saw it. It lives in
   memory rather than in storage on purpose: it is a statement
   about this page's conversation with the account, and a page
   that has not had that conversation yet has no business having
   an opinion. A fresh load starts with nothing and adopts.
   ============================================================ */
let base = null; // null before adopting
let who = null; // the account `base` belongs to
/** Take the mirror off this device. Called when the session ends
    and when the account is emptied. Announces, because a hub with
    a progress ring on it is looking at storage that just moved. */
function clearMirror() {
    const schools = new Set();
    for (const [key, [, event]] of Object.entries(KEYS)) {
        if (read(key) === undefined)
            continue;
        forget(key);
        schools.add(event);
    }
    base = null;
    who = null;
    schools.forEach((event) => dispatchEvent(new CustomEvent(event)));
}
/**
 * Write the account's rows onto this device, and drop anything
 * the account does not have.
 *
 * THIS IS THE RULE THE FILE EXISTS FOR. Nothing local is read
 * here, nothing local is uploaded here, and a key this browser
 * holds that the account does not is removed rather than pushed.
 * Signing in on a machine that already had progress in it shows
 * you your account, which is the only thing signing in has ever
 * been able to honestly promise.
 *
 * `pre` is the one exception and it is not an exception to the
 * rule: it is the ticks made in the second or two this request
 * was in flight, on a page the reader is already using. Those
 * were made by the person who is signed in, after they signed in,
 * so they are theirs and they go up with the next push.
 */
function adopt(remote, pre) {
    const schools = new Set();
    for (const [key, [rule, event]] of Object.entries(KEYS)) {
        const theirs = remote.has(key) ? remote.get(key) : undefined;
        const mine = read(key);
        /* Anything that arrived while the fetch was in the air. For a
           set that is the ids added since; for the other two shapes a
           change during one round trip is simply kept. */
        const during = rule === "set"
            ? list(mine).filter((id) => !list(pre.get(key)).includes(id))
            : same(mine, pre.get(key)) ? null : mine;
        let next;
        if (rule === "set")
            next = [...new Set([...list(theirs), ...list(during)])];
        else if (during !== null && during !== undefined)
            next = during;
        else
            next = theirs;
        if (next === undefined || same(next, emptyFor(rule))) {
            if (mine !== undefined) {
                forget(key);
                schools.add(event);
            }
            continue;
        }
        if (!same(next, mine) && write(key, next))
            schools.add(event);
    }
    base = new Map(Object.keys(KEYS).map((key) => [key, remote.has(key) ? remote.get(key) : emptyFor(KEYS[key][0])]));
    schools.forEach((event) => dispatchEvent(new CustomEvent(event)));
}
/* ============================================================
   One exchange
   ============================================================ */
let running = null;
let pending = false;
/**
 * Read the account, reconcile, write both ends.
 *
 * Runs at most one at a time; asking while one is in flight sets
 * a flag and runs once more afterwards, so a burst of ticks costs
 * two round trips rather than ten.
 */
export function sync() {
    const user = current();
    if (!user)
        return Promise.resolve(false);
    if (running) {
        pending = true;
        return running;
    }
    running = (async () => {
        try {
            const head = await headers();
            if (!head)
                return false;
            /* A different person on the same browser is a different
               record. Nothing of the last one's is carried over, and
               nothing of it is uploaded to this one. */
            if (who && who !== user.id)
                clearMirror();
            const before = new Map(SYNCED_KEYS.map((key) => [key, read(key)]));
            const remote = await fetchRows(head);
            if (!base) {
                adopt(remote, before);
                who = user.id;
                document.dispatchEvent(new CustomEvent("sync:done", {
                    detail: { adopted: true, kept: remote.size, sent: 0 },
                }));
                return true;
            }
            const schools = new Set();
            const toPush = [];
            for (const [key, [rule, event]] of Object.entries(KEYS)) {
                const was = base.has(key) ? base.get(key) : emptyFor(rule);
                const mine = read(key) ?? emptyFor(rule);
                const theirs = remote.has(key) ? remote.get(key) : emptyFor(rule);
                // Nobody has ever said anything about this key.
                if (same(was, emptyFor(rule)) && same(mine, emptyFor(rule))
                    && same(theirs, emptyFor(rule)))
                    continue;
                const merged = reconcile(rule, was, mine, theirs);
                if (!same(merged, mine)) {
                    /* A cleared bookmark is removed rather than written as
                       the string "null", so the school reads it back as
                       absent, which is what it was before it was ever set. */
                    const stored = same(merged, emptyFor(rule)) && rule !== "set"
                        ? forget(key)
                        : write(key, merged);
                    if (stored)
                        schools.add(event);
                }
                if (!same(merged, theirs))
                    toPush.push({ key, value: merged ?? null });
                base.set(key, merged);
            }
            await sendRows(head, toPush);
            /* Tell the school its own storage moved underneath it, using
               the event it already listens to. Without this a tick made
               on another device does not appear until the next load. */
            schools.forEach((event) => dispatchEvent(new CustomEvent(event)));
            document.dispatchEvent(new CustomEvent("sync:done", {
                detail: { adopted: false, kept: remote.size, sent: toPush.length },
            }));
            return true;
        }
        catch (err) {
            /* A failed exchange is a device that is still perfectly
               usable, and a `base` that must not be trusted afterwards:
               half a conversation is not a record of one. */
            base = null;
            console.warn("progress sync failed", err);
            return false;
        }
        finally {
            running = null;
            if (pending) {
                pending = false;
                sync();
            }
        }
    })();
    return running;
}
/** Take everything off the account, and off this device with it.
    The two are one record now, so emptying one and leaving the
    other would put them straight back next time. */
export async function forgetOnAccount() {
    const head = await headers();
    if (!head)
        return false;
    const res = await fetch(`${REST}?key=neq.`, { method: "DELETE", headers: head });
    if (!res.ok)
        return false;
    clearMirror();
    return true;
}
/* ============================================================
   Wiring
   ============================================================ */
let wired = false;
/** Called by signin.js once it knows whether anyone is signed in.

    The listeners go on whether or not anybody is, so that signing
    in halfway through a page adopts without a reload, and every
    one of them is a no-op signed out: `schedule()` returns at its
    first line and `sync()` returns false at its own. A reader who
    never signs in makes no request, stores nothing new and is
    read from by nobody, which is what "no feature on this site
    requires an account" has to cost. */
export function startSync() {
    if (!wired) {
        wired = true;
        /* Each school announces its own changes already, so there is
           nothing to rewire in any of them. */
        for (const event of new Set(Object.values(KEYS).map(([, e]) => e))) {
            addEventListener(event, schedule, { passive: true });
        }
        // Another tab, same person, same account.
        addEventListener("storage", (e) => {
            if (e.key && e.key in KEYS)
                schedule();
        });
        // Leaving the page is the last chance to send a tick.
        addEventListener("pagehide", () => { if (current())
            sync(); });
        /* Coming back to a tab that has been open since this morning.
           The account may have moved on another device, and a hub
           showing yesterday's ring is the thing an account was for. */
        document.addEventListener("visibilitychange", () => {
            if (!document.hidden && current())
                sync();
        });
        /* Signing in adopts; signing out takes the mirror off. Both
           arrive here as the same event, and which one it is is the
           detail. */
        document.addEventListener("account:changed", (e) => {
            if (e.detail)
                sync();
            else
                clearMirror();
        });
    }
    if (current())
        sync();
}
/* Ticks arrive in bursts: opening a lesson moves the bookmark and
   ticking a checkpoint follows a second later. One exchange a few
   seconds afterwards carries both. */
let timer;
function schedule() {
    if (!current())
        return;
    clearTimeout(timer);
    timer = setTimeout(sync, 2500);
}
