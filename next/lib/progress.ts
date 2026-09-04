/* What you have read, and where you were. localStorage on the reader's
   own device: a bookmark, not analytics. An account carries it between
   devices and `aab/sync.js` does that, using the keys below.

   The valid ids come from the SERVER, out of the same rows the ladder was
   rendered from, so nothing reads a `curriculum.js` in the browser. The
   bookmark's key is the id and the address beside it is a hint: any page
   inside a school recomputes the URL from the rows it just read, and only
   the front door, which reads no ladder, falls back to the stored one. */

import { cue, type Cue } from "./sound.ts";

    /** Where each school keeps its set. These are STORAGE KEYS, not
        identifiers, and the difference is the whole of this table: the
        money school sits at /money/ and its key is still `learn-read`,
        because that string is what is in real browsers and real accounts.
        Renaming one does not move somebody's ticks, it loses them.
        `aab/sync.js` maps the same names on to `learn:progress`. */
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

    /** Which key a school's ticks are under, and which its bookmark is
        under. Exported because `components/progress.tsx` needs the same
        answer, and a copy of the mapping is the one place it cannot be got
        right: `${school}-read` asks for `money-read`, and there has never
        been such a key. Nothing fails. The ticks are written correctly
        under `learn-read` and every component that DRAWS one reads an
        empty string, so the button never lights, every meter reads nought
        per cent and "where you left off" always offers lesson one.

        One vocabulary, one place: `check-rows.ts` enforces the same rule
        for the database. */
export const readKeyOf = (school: string): string =>
  READ_KEY[school] ?? `${school}-read`;

export const lastKeyOf = (school: string): string =>
  LAST_KEY[school] ?? `${school}-last`;

export interface Bookmark {
  /** What the ticks are filed under, and the only field anything
      decides anything by. */
  id: string;
  title: string;
  stage: string;
      /** A hint, and labelled one on purpose: everything inside a school
          recomputes the address from the rows it just rendered, because a
          lesson can move and an id cannot. The front door reads no
          ladders, so it uses this. */
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

        READING NEVER WRITES, and that sentence is the whole of this
        function. A version that pruned unknown ids on read needed its
        `known` argument to be the school's COMPLETE set, and no caller
        passes that: `<LessonTick>` and `<CardTick>` pass one id,
        `<LadderMeter>` passes one stage's. So opening any lesson pruned
        that reader's ticks down to it and saved the result, and with an
        account the empty set went up and out to their other devices,
        looking exactly like somebody un-ticking by hand.

        Nothing needs the filtering: every consumer intersects this set
        with its own ids, `read.has(id)`, so a foreign id is inert and no
        count is `set.size`. Clearing stale ids is a deliberate one-shot
        against a list known to be complete, never a side effect of drawing
        a percentage. */
export function readSet(school: string): Set<string> {
  const raw = readJSON<unknown>(READ_KEY[school] ?? `${school}-read`, []);
  if (!Array.isArray(raw)) return new Set();
  return new Set(raw.filter((id): id is string => typeof id === "string"));
}

    /** Add or remove one, and say which it ended up as. `sound` is an
        argument because only the CALLER knows what just happened: ticking
        the last lesson of a stage finished a stage, which is a different
        sentence. Null wherever the reader pressed nothing. */
export function toggleRead(
  school: string, id: string, sound: Cue | null = "lesson",
): boolean {
  const key = READ_KEY[school] ?? `${school}-read`;
  const set = readSet(school);
  const now = !set.has(id);
  if (now) set.add(id); else set.delete(id);
  writeJSON(key, [...set]);
  announce();
      /* Only on the way ON: un-ticking is a correction, and a correction
         that sounds like an achievement is a site congratulating somebody
         for changing their mind. */
  if (now && sound) cue(sound);
  return now;
}

    /** Tick one, and do nothing if it is already ticked: churning storage
        fires a change event for no change, and everything listening
        redraws. */
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
       A checkpoint is one thing done inside a lesson, stored under
       `<school>-checks` since before this school's progress was React, and
       `aab/sync.js` carries all four keys: nothing here invents a key.

       The ids do not collide because they are a segment longer: a
       checklist item is `<lesson>#<n>` and a drill step is
       `<lesson>#<mount>#<n>`, and `checkpointStats()` splits on the first
       `#` either way. */

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
      /* Both events, because two different things are listening: the React
         meters hear `reiad:progress`, and `aab/checkpoints.js` and the
         account page's counters hear the school's own event. A tick that
         updated one of the two is a page whose numbers disagree. */
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

    /** One event, on `window`, for every component showing a number that
        just moved. `storage` only fires in OTHER tabs, so a page with a
        tick button and a meter needs this or the meter is right everywhere
        except where the button was pressed. */
export function announce() {
  try { window.dispatchEvent(new CustomEvent(EVENT)); } catch { /* SSR */ }
}

export function subscribe(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
      /* And when the account's rows land on the device. `aab/sync.js`
         writes the mirror straight into localStorage, which fires neither
         of the two above, so for a signed-in reader every meter is drawn
         against what storage held BEFORE the exchange and stays there.

         Invisible most of the time, because the exchange usually finishes
         before the first paint, and visible on a page that fetches
         something of its own first: `/account` drew a course target at
         "0 of 60" beside a bar of the same school reading "2 of 60". */
  document.addEventListener("sync:done", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
    document.removeEventListener("sync:done", fn);
  };
}

export { EVENT as PROGRESS_EVENT };

/* ---------- across the four schools ---------- */

    /** The four schools, in the order the rail lists them. Written out
        rather than imported from `shared/schools.ts` because this file is
        the browser's and that one is the Worker's; this list is only ever
        read to look four keys up. */
export const SCHOOLS = ["money", "deutsch", "quran", "english"];

    /** The most recent bookmark of any school, for the front door.
        Whichever school was opened last is the one a reader is in the
        middle of, and asking them which is asking them to do the one thing
        the bookmark exists to stop. */
export function latest(): (Bookmark & { school: string }) | null {
  let best: (Bookmark & { school: string }) | null = null;
  for (const school of SCHOOLS) {
    const mark = getLast(school);
    if (mark?.url && (!best || mark.ts > best.ts)) best = { ...mark, school };
  }
  return best;
}

    /* ---------- where in a piece, and which tools ----------
       NOT A SCROLL OFFSET: that number is a fact about a window and moves
       with the type size, the measure, a photograph's height and any edit
       to the prose. What is stored is an INDEX into the blocks, a
       signature of the block's first few words, and how many blocks there
       were. The signature is what survives an edit: a rewritten piece
       throws the position away rather than sending somebody to the wrong
       paragraph.

       It is a MAP, one entry per page each with its own `ts`, so `merge`
       in `aab/src/sync.ts` reconciles it entry by entry: a `mark` would
       take the newer whole map, and a phone that read one article would
       throw away every position a laptop had. */

const WHERE_KEY = "where-read";
const TOOLS_KEY = "tools-used";

    /** How many pages' positions to keep. Every entry is about eighty
        bytes and goes up to the account with the rest, so the oldest are
        dropped: nobody returns to a piece they abandoned two hundred
        pieces ago and expects the site to have remembered. */
const KEEP_PLACES = 200;

export interface Place {
  /** Which block, counting the ones `blocksOf()` selects. */
  i: number;
  /** How many there were, so a piece that has changed length can
      be spotted without reading it. */
  of: number;
      /** The first few words of that block, normalised. The index alone is
          a promise the prose has not been edited. */
  sig: string;
  ts: number;
}

const places = (): Record<string, Place> => {
  const raw = readJSON<Record<string, unknown>>(WHERE_KEY, {});
  const out: Record<string, Place> = {};
  for (const [url, v] of Object.entries(raw)) {
    if (url === "ts" || v === null || typeof v !== "object") continue;
    const p = v as Partial<Place>;
    if (typeof p.i === "number" && typeof p.ts === "number") {
      out[url] = { i: p.i, of: Number(p.of) || 0, sig: String(p.sig ?? ""), ts: p.ts };
    }
  }
  return out;
};

/** Where the reader had got to in one page, or null. */
export const whereRead = (url: string): Place | null => places()[url] ?? null;

/** Every position, for the account page. */
export const everywhereRead = (): Record<string, Place> => places();

    /** Record how far into a page the reader has got. A plain write: the
        last thing said about a page is what that page's position is.

        FORWARDS-ONLY IS THE CALLER'S JOB, because only the caller knows
        what a visit is: scrolling back up to check a figure has not
        un-read the page, and opening it again tomorrow has.
        `components/where.tsx` keeps the furthest block of the visit and
        only calls this when it moves. A guard here compared the SIGNATURE
        as well as the index, and the signature is of the block AT that
        index, so it changed on every step and never fired. */
export function markWhere(url: string, place: Omit<Place, "ts">): void {
  const all = places();
  all[url] = { ...place, ts: Date.now() };

  const urls = Object.keys(all);
  if (urls.length > KEEP_PLACES) {
    urls.sort((a, b) => all[b].ts - all[a].ts);
    for (const old of urls.slice(KEEP_PLACES)) delete all[old];
  }
      /* The map's own stamp, which `merge` skips as an entry and `mark`
         would have used, so a map written here is the same shape as every
         other synced value. */
  writeJSON(WHERE_KEY, { ...all, ts: Date.now() });
  announce();
}

/** Forget one page, which is what finishing it means. */
export function forgetWhere(url: string): void {
  const all = places();
  if (!(url in all)) return;
  delete all[url];
  writeJSON(WHERE_KEY, { ...all, ts: Date.now() });
  announce();
}

    /* ---------- which tools this reader actually uses ----------
       A timestamp per tool, and NOT A COUNT: a count cannot be reconciled
       between two devices without a per-device log, since a phone saying
       five and a laptop saying five are either ten openings or the same
       five seen twice. The site knows when you last opened the diet tool
       and does not pretend to know how often. */

export const toolsUsed = (): Record<string, number> => {
  const raw = readJSON<Record<string, unknown>>(TOOLS_KEY, {});
  const out: Record<string, number> = {};
  for (const [id, v] of Object.entries(raw)) {
    if (id === "ts") continue;
    const ts = Number((v as { ts?: unknown } | null)?.ts);
    if (Number.isFinite(ts)) out[id] = ts;
  }
  return out;
};

export function markToolUsed(id: string): void {
  const raw = readJSON<Record<string, unknown>>(TOOLS_KEY, {});
  const now = Date.now();
  writeJSON(TOOLS_KEY, { ...raw, [id]: { ts: now }, ts: now });
  announce();
}
