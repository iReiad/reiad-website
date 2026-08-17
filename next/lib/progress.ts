/* ============================================================
   progress.ts: what you have read, and where you were.

   Stored in localStorage on the reader's own device. Nothing is
   sent anywhere, nothing needs an account, and clearing browser
   data clears it. It is a bookmark, not analytics. An account
   carries it between devices and `aab/sync.js` is what does
   that; the keys below are the ones it already knows.

   ---- what this replaces, and what was wrong with it ----

   Four modules: `aab/money/progress.js`, and one each in the
   three language schools. They agreed on nothing. The money
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

    `known` is the set of ids the server just rendered a ladder
    from. Anything else is dropped, which is not tidiness: for a
    while the money school's recorder claimed every page carrying
    a `data-lesson-id`, which is ninety pages of Arabic and
    English as well as its own, and those ids are in real readers'
    storage. Filtering on read rather than migrating on write
    needs no version flag, cannot half-run, and fixes a device the
    first time it is opened. */
export function readSet(school: string, known?: Set<string>): Set<string> {
  const raw = readJSON<unknown>(READ_KEY[school] ?? `${school}-read`, []);
  if (!Array.isArray(raw)) return new Set();

  const ids = raw.filter((id): id is string => typeof id === "string");
  if (!known) return new Set(ids);

  const mine = ids.filter((id) => known.has(id));
  if (mine.length !== ids.length) writeJSON(READ_KEY[school] ?? `${school}-read`, mine);
  return new Set(mine);
}

/** Add or remove one, and say which it ended up as. */
export function toggleRead(school: string, id: string): boolean {
  const key = READ_KEY[school] ?? `${school}-read`;
  const set = readSet(school);
  const now = !set.has(id);
  if (now) set.add(id); else set.delete(id);
  writeJSON(key, [...set]);
  announce();
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
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
  };
}

export { EVENT as PROGRESS_EVENT };

/* ---------- across the four schools ---------- */

/** The four schools, in the order the rail lists them. Written
    out rather than imported from `shared/schools.js` because this
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
