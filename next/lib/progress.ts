/* ============================================================
   progress.ts: what you have read, and where you were.

   Stored in localStorage on the reader's own device. Nothing is
   sent anywhere, nothing needs an account, and clearing browser
   data clears it. It is a bookmark, not analytics. An account
   carries it between devices and `aab/sync.js` is what does
   that; the keys below are the ones it already knows.

   ---- what this replaces, and what was wrong with it ----

   Four modules: `archive/shell-2026/progress.js`, and one each in
   the three language schools. They agreed on nothing. The money
   school stored a set under `learn-read` and a bookmark under
   `learn-last`; the Qur'anic Arabic school called its set
   `quran-done`; the German and English schools kept a set, a day
   count and a "highest reached" number each. Every one of them
   read a `curriculum.js` in the browser to find out which ids
   were real.

   Three things were broken in the money school's, and they are
   the reason this is a rewrite rather than a port:

   1. **The starter guide could not be ticked.** Its eight steps
      were accordion sections of the hub, not pages, so nothing
      ever called `markLessonRead()` for them. Eight of the
      school's ninety-one lessons were unreachable by the thing
      counting them, and the percentage on the hub was therefore
      wrong for every reader who had done them. They are pages
      now, which is the other half of this change.

   2. **The filter needed the curriculum in the browser.** Ids
      that were not the school's were dropped on read, against a
      list imported from `curriculum.js`. So the check only ran
      where that module had been loaded, and the module was
      loaded because of the check.

   3. **The bookmark could point at a page that no longer
      existed.** It stored a URL, and a lesson that moved took
      the bookmark with it.

   Here the valid ids come from the server, out of the same rows
   the ladder was rendered from, and the bookmark's key is the id.
   It carries an address as well, and that address is a hint: any
   page inside a school recomputes the URL from the rows it just
   read, and only the front door, which reads no ladder at all,
   falls back to the stored one.
   ============================================================ */

import { cue, type Cue } from "./sound.ts";

/** Where each school keeps its set.

    These are storage keys, not identifiers, and the difference is
    the whole of this table. The money school moved from /learn/ to
    /money/ on 17 August 2026 and its key did NOT move with it: it
    is still `learn-read`, because that string is what is in real
    browsers and in real accounts today, and `CLAUDE.md` says the
    plain truth about renaming one, that it does not move somebody's
    ticks, it loses them. `aab/sync.js` maps the same names on to
    `learn:progress` in Supabase, and it needed no change either.

    So the odd-looking line below is the deliberate one: the school
    is `money` and the key it reads is `learn-read`. A reader who
    had done forty lessons before the move has done forty after
    it. */
const READ_KEY: Record<string, string> = {
  money: "learn-read",
  deutsch: "deutsch-read",
  english: "english-read",
  quran: "quran-done",
};

const LAST_KEY: Record<string, string> = {
  money: "learn-last",
  deutsch: "deutsch-last",
  english: "english-last",
  quran: "quran-last",
};

export interface Bookmark {
  /** What the ticks are filed under, and the only field anything
      decides anything by. */
  id: string;
  title: string;
  stage: string;
  /** A hint, and labelled one on purpose. Everything inside a
      school recomputes the address from the rows it just
      rendered, because a lesson can move and an id cannot. The
      one place that cannot do that is the front door, which shows
      "carry on where you left off" across four schools and reads
      none of their ladders: it uses this. */
  url?: string;
  ts: number;
}

const readJSON = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

const writeJSON = (key: string, value: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* Private mode throws on setItem. A tick is a nicety and must
       never take the page down with it. */
  }
};

/** Everything this school has been ticked for.

    READING NEVER WRITES. That sentence is the whole of this
    function and it is here because the previous version did.

    It took a `known` set, the ids the server had just rendered a
    ladder from, dropped anything else, and wrote the survivors
    back, on the theory that a device would heal itself the first
    time it was opened. The theory needed `known` to be the
    school's COMPLETE set of ids, and not one caller passed that:

      <LessonTick>   passed `[id]`, the one lesson on screen
      <CardTick>     passed `[id]`, the one card
      <LadderMeter>  passed one stage's lessons, once per rung
      <Resume>       passed the ladder it was given

    So opening any lesson in the money school pruned that reader's
    ticks down to that single lesson and saved it. Forty finished
    lessons became zero, silently, and with an account the empty
    set went up to the account and out to their other devices,
    because a device is a mirror and this looked exactly like
    somebody un-ticking thirty-nine lessons by hand. The school
    hub was worse: it draws one meter per stage, so the stages
    took turns overwriting each other and whichever rendered last
    was all that was left.

    Nothing needs the filtering. Every consumer already intersects
    this set with its own list of ids, `read.has(id)`, so a
    foreign id left in storage is inert: it cannot inflate a
    count, because no count is `set.size`. A few stale bytes are
    worth nothing and a reader's year of ticks is worth a great
    deal, so the trade is not close.

    If those stale ids ever do need clearing out, it is a
    deliberate one-shot against a list that is known to be
    complete, not a side effect of drawing a percentage. */
export function readSet(school: string): Set<string> {
  const raw = readJSON<unknown>(READ_KEY[school] ?? `${school}-read`, []);
  if (!Array.isArray(raw)) return new Set();
  return new Set(raw.filter((id): id is string => typeof id === "string"));
}

/** Add or remove one, and say which it ended up as.

    `sound` is which cue a tick makes, and it is an argument
    because only the CALLER knows what just happened: ticking the
    last lesson of a stage finished a stage, and that is a
    different sentence from finishing a lesson. Null for anywhere
    that ticks without the reader pressing anything. */
export function toggleRead(
  school: string, id: string, sound: Cue | null = "lesson",
): boolean {
  const key = READ_KEY[school] ?? `${school}-read`;
  const set = readSet(school);
  const now = !set.has(id);
  if (now) set.add(id); else set.delete(id);
  writeJSON(key, [...set]);
  announce();
  /* Only on the way ON. Un-ticking something is a correction, and
     a correction that sounds like an achievement is a site
     congratulating somebody for changing their mind. */
  if (now && sound) cue(sound);
  return now;
}

/** Tick one, and do nothing if it is already ticked: churning
    storage fires a change event for no change, and everything
    listening redraws. */
export function markRead(school: string, id: string) {
  const set = readSet(school);
  if (set.has(id)) return;
  set.add(id);
  writeJSON(READ_KEY[school] ?? `${school}-read`, [...set]);
  announce();
}

export function setLast(school: string, entry: Omit<Bookmark, "ts">) {
  if (!entry.id) return;
  writeJSON(LAST_KEY[school] ?? `${school}-last`, { ...entry, ts: Date.now() });
  announce();
}

export function getLast(school: string, known?: Set<string>): Bookmark | null {
  const value = readJSON<Bookmark | null>(LAST_KEY[school] ?? `${school}-last`, null);
  if (!value?.id) return null;
  if (known && !known.has(value.id)) return null;
  return value;
}

/* ---------- the ticks INSIDE a lesson ----------

   A lesson's own tick is about the whole page. A checkpoint is
   one thing done inside it, and `aab/checkpoints.js` has stored
   those under `<school>-checks` since before this school's
   progress was React. `aab/sync.js` carries all four keys, so
   nothing here invents a storage key: a `drill` block writes the
   same set the checklists in the prose write.

   The ids do not collide, because they are a segment longer. A
   checklist item is `<lesson>#<n>` and a drill step is
   `<lesson>#<mount>#<n>`, and `checkpointStats()` splits on the
   first `#` either way, so the account page counts both without
   knowing there are two kinds. */

const CHECK_KEY: Record<string, string> = {
  money: "learn-checks",
  deutsch: "deutsch-checks",
  english: "english-checks",
  quran: "quran-checks",
};

export function checkSet(school: string): Set<string> {
  const raw = readJSON<unknown>(CHECK_KEY[school] ?? `${school}-checks`, []);
  if (!Array.isArray(raw)) return new Set();
  return new Set(raw.filter((id): id is string => typeof id === "string"));
}

/** Add or remove one checkpoint, and say which it ended up as. */
export function toggleCheck(school: string, id: string): boolean {
  const key = CHECK_KEY[school] ?? `${school}-checks`;
  const set = checkSet(school);
  const now = !set.has(id);
  if (now) set.add(id); else set.delete(id);
  writeJSON(key, [...set]);
  /* Both events, because two different things are listening. The
     React meters hear `reiad:progress`; `aab/checkpoints.js` and
     the account page's own counters hear the school's own event,
     which is what that module has dispatched since it was
     written. A tick that updated one of the two would be a page
     whose numbers disagree with each other. */
  announce();
  try {
    document.dispatchEvent(
      new CustomEvent(`${school === "money" ? "learn" : school}:progress`));
  } catch { /* SSR */ }
  if (now) cue("tick");
  return now;
}

/* ---------- telling the page something changed ---------- */

const EVENT = "reiad:progress";

/** One event, on `window`, for every component showing a number
    that just moved. `storage` only fires in OTHER tabs, so a page
    with a tick button and a meter on it needs this as well or the
    meter is right everywhere except where the button was pressed. */
export function announce() {
  try { window.dispatchEvent(new CustomEvent(EVENT)); } catch { /* SSR */ }
}

export function subscribe(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  /* And when the account's rows land on the device.

     `aab/sync.js` writes the mirror straight into localStorage,
     which fires neither of the two above: `storage` only fires in
     OTHER tabs, and `announce()` is only called by the functions
     in this file. So for a signed-in reader every meter on the
     page was drawn against whatever storage held BEFORE the
     exchange, and stayed there.

     It looked fine most of the time, because the exchange usually
     finishes before the first paint, and it looked broken on
     exactly the pages that fetch something of their own first:
     `/account` drew a course target at "0 of 60" beside a
     bar of the same school reading "2 of 60". Two answers to one
     question, on one screen. */
  document.addEventListener("sync:done", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
    document.removeEventListener("sync:done", fn);
  };
}

export { EVENT as PROGRESS_EVENT };

/* ---------- across the four schools ---------- */

/** The four schools, in the order the rail lists them. Written
    out rather than imported from `shared/schools.ts` because this
    file is the browser's and that one is the Worker's; the check
    that they agree is that both are four names long and this list
    is only ever read to look four keys up. */
export const SCHOOLS = ["money", "deutsch", "quran", "english"];

/** The most recent bookmark of any school, for the front door.

    Whichever school was opened last is the one a reader is in the
    middle of, and asking them to remember which is asking them to
    do the one thing the bookmark exists to stop. */
export function latest(): (Bookmark & { school: string }) | null {
  let best: (Bookmark & { school: string }) | null = null;
  for (const school of SCHOOLS) {
    const mark = getLast(school);
    if (mark?.url && (!best || mark.ts > best.ts)) best = { ...mark, school };
  }
  return best;
}
