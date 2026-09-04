/* sync.ts: progress belongs to the account, and the browser is a
   mirror. Four states, and they are the whole contract:

     signed out    nothing. No request, no listener, no storage
                   touched. Progress is this browser's.
     signing in    the account's rows are written on to this
                   device. What the browser held is not merged
                   and never uploaded.
     signed in     a tick here goes up, a tick on the phone
                   comes down.
     signing out   the mirror comes off, so the next person at
                   this machine does not inherit somebody's ticks.

   Two signed-in devices are the one merge left. `base` is what
   the account said at the last exchange, so `added = local \ base`
   and `removed = base \ local`, and the value written back is
   `(remote ∪ added) \ removed`. There is no special case for a
   reset: every school's `resetAll()` REMOVES a key rather than
   emptying it, an absent key is an empty set, and subtraction
   takes the account down with it. */
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
    /* /skills/courses/: a `set` of `<course>/<module>/<lesson>` and
       a bookmark, exactly like a school's. Admin-only is a reason
       to carry it, not to skip it: an admin has the most devices. */
    "courses-read": ["set", "courses:progress"],
    "courses-last": ["mark", "courses:progress"],
    /* Quiz answers: `<course>/<module>/<lesson>#<question>#<option>`.
       A `set`, like a checkpoint, and never a score: the course
       exports carry no answer key. See functions/_lib/quiz.ts. */
    "courses-answers": ["set", "courses:progress"],
    /* Which days this person turned up, from streak.js. A set: a
       phone and a laptop are the same Tuesday, and either alone
       under-counts. */
    "days-active": ["set", "streak:changed"],
    /* How this reader wants to be read to. See /prefs.js. A `mark`
       rather than a `set`, because a preference is REPLACED rather
       than accumulated and the union of two devices' type sizes is
       not a type size. The newer wins, by the `ts` prefs.js writes. */
    "reader-prefs": ["mark", "prefs:sync"],
    /* The reader's front page: an ordered list of
       `"<widget>:<size>"` out of `shared/widgets.ts`. A `mark` for
       the reason above: the union of two boards holds everything
       either ever had, so a widget removed on a phone comes back
       off the laptop, for ever, with nothing looking broken. */
    "home-board": ["mark", "board:sync"],
    /* Two MAPS, `{ <id>: { ts, ... } }`, and neither is a `mark`: a
       mark takes the newer WHOLE object, so a phone that read one
       article would throw away every position a laptop recorded.
       `merge` reconciles entry by entry on each entry's own `ts`. */
    "where-read": ["merge", "read:where"],
    "tools-used": ["merge", "tools:used"],
    /* What a learner typed into a practice book: the one thing they
       AUTHOR in the four schools. `merge`, and the stored shape
       stays `{ <day>: "the text" }`, which is what is in real
       browsers. `stamp()` says what dates a plain entry.
       `scripts/check-storage.ts` fails if either stops travelling. */
    "deutsch-schrift": ["merge", "deutsch:progress"],
    "english-write": ["merge", "english:progress"],
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
/** The one written later. A value cleared on this device (a
    reset) stays cleared and says so with null.

    Presence is "an object is there", not "it has an id":
    `reader-prefs` has a `ts` and no id, and testing for a field
    only bookmarks carry would make every preference change look
    like an empty value and clear the account's copy. */
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
/** A map of stamped entries, reconciled entry by entry: `mark`
    one level down. `ts` at the top level is the map's own stamp
    and is skipped by name, so AN ENTRY MAY NEVER BE CALLED `ts`.
    `where-read` keys on a URL and `tools-used` on a tool id. */
function reconcileMerge(base, mine, remote) {
    const was = there(base) ? base : {};
    const now = there(mine) ? mine : {};
    const theirs = there(remote) ? remote : {};
    const out = {};
    for (const id of new Set([...Object.keys(theirs), ...Object.keys(now)])) {
        if (id === "ts")
            continue;
        if (id in was && !(id in now))
            continue; // removed here
        const a = now[id];
        const b = theirs[id];
        if (a === undefined) {
            out[id] = b;
            continue;
        }
        if (b === undefined) {
            out[id] = a;
            continue;
        }
        out[id] = stamp(b, theirs) > stamp(a, now) ? b : a;
    }
    return Object.keys(out).length ? out : null;
}
/** When an entry was written. An entry with its own `ts` answers
    for itself; A PLAIN VALUE FALLS BACK TO THE MAP'S OWN STAMP,
    which is what carries the practice books without rewriting a
    shape that holds a learner's sentences. The cost is the one
    case where the same day was written on two devices: the
    tiebreak is then which device wrote last about anything. */
const stamp = (entry, map) => (there(entry) ? Number(entry.ts) : NaN) || Number(map.ts) || 0;
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
    if (rule === "merge")
        return reconcileMerge(base, mine, remote);
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

   `base` is the account as this page last saw it. It lived only
   in memory first, on the argument that a fresh load has had no
   conversation and should adopt, and the Android app shipped the
   same argument and paid for it the same day: adopt REPLACES the
   device's marks with the account's copy, so any change made
   between a load and the first exchange, or after a failed one,
   was quietly un-done. On the site the window is one page-load
   race wide, which is why it was never reported here first; it
   is the same eater.

   So the base is STORED, keyed to the account's own id: a fresh
   load resumes the conversation it recorded, and only an account
   this browser has never recorded adopts. The stored key is not
   in `KEYS`, so it can never be synced, and `clearMirror()`
   removes it with everything else.
   ============================================================ */
let base = null; // null before the first exchange
let who = null; // the account `base` belongs to
const BASE_STORE = "sync-base";
/** The recorded conversation, if it is this account's. */
function loadBase(userId) {
    if (base)
        return;
    try {
        const raw = localStorage.getItem(BASE_STORE);
        if (!raw)
            return;
        const held = JSON.parse(raw);
        if (held.who !== userId || !held.keys)
            return;
        base = new Map(Object.entries(held.keys).filter(([key]) => key in KEYS));
        who = userId;
    }
    catch {
        /* An unreadable record is no record. */
    }
}
/** Record it, after the exchange has actually completed: a base
    written before the push lands would claim the account holds
    rows it refused, and they would never be sent again. */
function keepBase(userId) {
    who = userId;
    try {
        const keys = {};
        base?.forEach((value, key) => { keys[key] = value; });
        localStorage.setItem(BASE_STORE, JSON.stringify({ who: userId, keys }));
    }
    catch {
        /* Storage full or blocked: the in-memory copy still serves
           this page, and the next load adopts, which is the old
           behaviour rather than a new failure. */
    }
}
/** Take the mirror off this device. Called when the session ends,
    when a different person signs in on the same browser, and when
    the account is emptied. Announces, because a hub with a
    progress ring on it is looking at storage that just moved.

    TWO ANNOUNCEMENTS, because two families listen: the school
    events the browser modules have always heard, and `sync:done`,
    which `subscribe()` in `next/lib/progress.ts` hears and every
    React component that counts a key sits behind. */
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
    try {
        localStorage.removeItem(BASE_STORE);
    }
    catch { /* gone is gone */ }
    schools.forEach((event) => dispatchEvent(new CustomEvent(event)));
    document.dispatchEvent(new CustomEvent("sync:done", {
        detail: { adopted: false, kept: 0, sent: 0 },
    }));
}
/**
 * Write the account's rows onto this device, and drop anything
 * the account does not have.
 *
 * THE RULE THE FILE EXISTS FOR. Nothing local is read or
 * uploaded here, and a key this browser holds that the account
 * does not is removed rather than pushed.
 *
 * `pre` is not an exception to it: those are the ticks made while
 * this request was in flight, by the person who is signed in.
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
        /* A map is reconciled rather than replaced: taking `during`
           whole would throw away every entry the account holds that
           this device has not seen. `pre` is the base the rule wants. */
        else if (rule === "merge")
            next = reconcileMerge(pre.get(key), mine, theirs) ?? undefined;
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
            loadBase(user.id);
            const before = new Map(SYNCED_KEYS.map((key) => [key, read(key)]));
            const remote = await fetchRows(head);
            if (!base) {
                adopt(remote, before);
                keepBase(user.id);
                document.dispatchEvent(new CustomEvent("sync:done", {
                    detail: { adopted: true, kept: remote.size, sent: 0 },
                }));
                return true;
            }
            const schools = new Set();
            const toPush = [];
            const next = new Map(base);
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
                /* Into the NEXT conversation, not into `base`: writing
                   base before the push lands would record rows the
                   account may be about to refuse as if it held them, and
                   a refused row recorded as delivered is a row that is
                   never sent again. */
                next.set(key, merged);
            }
            await sendRows(head, toPush);
            base = next;
            keepBase(user.id);
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
            /* A failed exchange KEEPS the base. Dropping it made the
               next exchange an adopt, and adopt eats whatever the
               reader did in between: a flaky network became the same
               eater by another door. The last completed exchange is
               still the truth about what this reader did since, and
               everything un-pushed is still local-since-base, so it
               goes up whole next time. */
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
