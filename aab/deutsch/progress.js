/* ============================================================
   progress.js, what you've read, which days you've done, and
   where you were.

   The same deal as /money/progress.js, and deliberately the same
   shape so that anyone reading one file understands the other.
   It is a separate module because it stores separate things
   under separate keys: finishing the money ladder should not
   tell you you have finished German, and resetting one must
   never wipe the other.

   Four keys, all in localStorage on the reader's own device.
   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics.

     deutsch-read   ["stufe-1/laute", "stufe-1/sein", …]
                    Teile that have been opened.

     deutsch-days   ["stufe-1/tag-1", "stufe-1/tag-2", …]
                    Days of the practice book ticked off. A day
                    is NOT ticked by opening it, you tick it
                    yourself, when you have actually spoken it
                    out loud. That is the one promise the book
                    makes, so the page cannot make it for you.

     deutsch-last   { id, url, bn, stufe, ts }
                    The last Teil opened. Powers the resume card.

     deutsch-tag    the day number the workbook was last left on,
                    so returning to it tomorrow opens tomorrow.

   Every write is wrapped: private mode throws on setItem, and a
   thrown tick must never take the page down with it.
   ============================================================ */

import { STUFEN, stufeTeile, allTeile, findStufe, dayId } from "/deutsch/curriculum.js";
import { whenActivated } from "/activation.js";

const READ_KEY = "deutsch-read";
const DAYS_KEY = "deutsch-days";
const LAST_KEY = "deutsch-last";
const TAG_KEY = "deutsch-tag";

/* ------------------------------------------------------------
   read / write
   ------------------------------------------------------------ */

function loadSet(key) {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

function saveSet(key, set) {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* private mode: the tick is a nicety, not a feature */
  }
  announce();
}

export const readSet = () => loadSet(READ_KEY);
export const daySet = () => loadSet(DAYS_KEY);

export const isRead = (id) => readSet().has(id);

export function markRead(id) {
  if (!id) return;
  const set = readSet();
  if (set.has(id)) return; // don't churn storage or fire events for nothing
  set.add(id);
  saveSet(READ_KEY, set);
}

export function unmarkRead(id) {
  const set = readSet();
  if (!set.delete(id)) return;
  saveSet(READ_KEY, set);
}

/* ------------------------------------------------------------
   the thirty days

   Ticked by hand, never by arriving. See the note at the top.
   ------------------------------------------------------------ */

export const isDayDone = (stufe, n) => daySet().has(dayId(stufe, n));

export function toggleDay(stufe, n) {
  const id = dayId(stufe, n);
  const set = daySet();
  if (!set.delete(id)) set.add(id);
  saveSet(DAYS_KEY, set);
  return set.has(id);
}

/** { done, total, pct, streakFrom } for a Stufe's practice book. */
export function dayStats(stufe) {
  const total = stufe.workbook?.days ?? 0;
  if (!total) return { done: 0, total: 0, pct: 0, next: 1 };
  const set = daySet();
  let done = 0;
  let next = total;
  let foundNext = false;
  for (let n = 1; n <= total; n++) {
    if (set.has(dayId(stufe, n))) {
      done++;
    } else if (!foundNext) {
      next = n;
      foundNext = true;
    }
  }
  return {
    done,
    total,
    pct: Math.round((done / total) * 100),
    complete: done === total,
    /* The first day not yet ticked, where "আজকের পাতা" points.
       When every day is done it points at the last one rather
       than at nothing, so the button always goes somewhere. */
    next: foundNext ? next : total,
  };
}

/** Every practice book added together, for the hub's one bar.

    Three books now, of thirty, sixty and ninety days, and Stufe 4
    has none. Showing only Stufe 1's thirty would tell a learner
    halfway through Stufe 2 that they had finished the practice. */
export function allDayStats() {
  const books = STUFEN.filter((s) => s.workbook?.days);
  const done = books.reduce((n, s) => n + dayStats(s).done, 0);
  const total = books.reduce((n, s) => n + s.workbook.days, 0);
  return {
    done,
    total,
    pct: total ? Math.round((done / total) * 100) : 0,
    complete: total > 0 && done === total,
  };
}

/** The first book with days still to do, in ladder order.

    This is the practice worth offering: the one quietly being
    skipped. Null when every book is finished. */
export function nextBook() {
  return STUFEN.find(
    (s) => s.workbook?.days && s.status === "live" && dayStats(s).done < s.workbook.days
  ) ?? null;
}

/** Where the workbook was last left, so tomorrow opens tomorrow. */
export function setLastDay(n) {
  try { localStorage.setItem(TAG_KEY, String(n)); } catch { /* ignore */ }
}

export function getLastDay() {
  try {
    const n = Number(localStorage.getItem(TAG_KEY));
    return Number.isInteger(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   where they were
   ------------------------------------------------------------ */

export function setLast(entry) {
  if (!entry?.id) return;
  try {
    localStorage.setItem(LAST_KEY, JSON.stringify({ ...entry, ts: Date.now() }));
  } catch { /* ignore */ }
}

export function getLast() {
  try {
    const v = JSON.parse(localStorage.getItem(LAST_KEY) || "null");
    return v && v.id ? v : null;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   sums the hub asks for
   ------------------------------------------------------------ */

/** { done, total, live, pct, complete, started } for one Stufe. */
export function stufeStats(stufe) {
  const read = readSet();
  const teile = stufeTeile(stufe);
  const live = teile.filter((t) => t.status === "live");
  const done = live.filter((t) => read.has(t.id)).length;
  return {
    done,
    total: teile.length,
    live: live.length,
    pct: live.length ? Math.round((done / live.length) * 100) : 0,
    complete: live.length > 0 && done === live.length,
    started: done > 0,
  };
}

/** The same, across all four Stufen. */
export function overallStats() {
  const read = readSet();
  const live = allTeile().filter((t) => t.status === "live");
  const done = live.filter((t) => read.has(t.id)).length;
  return {
    done,
    live: live.length,
    pct: live.length ? Math.round((done / live.length) * 100) : 0,
    complete: live.length > 0 && done === live.length,
  };
}

/** The first written Teil they haven't read, in ladder order. */
export function nextUp() {
  const read = readSet();
  return allTeile().find((t) => t.status === "live" && !read.has(t.id)) ?? null;
}

/** The Stufe a learner is "in". */
export function currentStufe() {
  const next = nextUp();
  if (next) return next.stufe;
  const last = getLast();
  return (last && findStufe(last.stufe)) || STUFEN[STUFEN.length - 1];
}

/** Ladder state for a Stufe. Nothing is ever actually locked,
    a learner may jump anywhere, and a Stufe they haven't earned
    simply says so. */
export function stufeState(stufe) {
  const stats = stufeStats(stufe);
  if (stats.complete) return "done";
  const here = currentStufe();
  if (here?.slug === stufe.slug) return "now";
  const hereIndex = STUFEN.findIndex((s) => s.slug === here?.slug);
  const myIndex = STUFEN.findIndex((s) => s.slug === stufe.slug);
  if (myIndex === hereIndex + 1) return "next";
  return myIndex < hereIndex ? "past" : "later";
}

/* ------------------------------------------------------------
   resets
   ------------------------------------------------------------ */

export function resetAll() {
  try {
    localStorage.removeItem(READ_KEY);
    localStorage.removeItem(DAYS_KEY);
    localStorage.removeItem(LAST_KEY);
    localStorage.removeItem(TAG_KEY);
  } catch { /* ignore */ }
  announce();
}

/* ------------------------------------------------------------
   telling the page something changed
   ------------------------------------------------------------ */

const EVENT = "deutsch:progress";

function announce() {
  dispatchEvent(new CustomEvent(EVENT));
}

export function onProgress(fn) {
  addEventListener(EVENT, fn);
  addEventListener("storage", (e) => {
    if ([READ_KEY, DAYS_KEY, LAST_KEY].includes(e.key)) fn();
  });
  /* Coming back via the bfcache, and only then. On an ordinary
     first load the caller has already painted; a second build
     would detach the element the auto-scroll just aimed at. */
  addEventListener("pageshow", (e) => { if (e.persisted) fn(); });
}

/* ------------------------------------------------------------
   the Teil page's side of the deal

   Opening a Teil counts as reading it: the same rule the Learn
   area uses. An unwritten Teil marked data-soon is not ticked
   off: you have not read what has not been written.

   And it waits for activation. Hovering a link prerenders the
   page it points at, scripts and all, so without whenActivated
   this ticked Teile off as the pointer swept across a list.
   See /activation.js for the full story.
   ------------------------------------------------------------ */
export function recordVisit(root = document) {
  const article = root.querySelector("article[data-teil-id]");
  if (!article) return null;

  const { teilId: id, stufe, teilTitle, soon } = article.dataset;
  if (!id || soon) return null;

  whenActivated(() => {
    markRead(id);
    setLast({
      id,
      stufe: stufe || "stufe-1",
      url: location.pathname,
      bn: teilTitle || document.title.split("–")[0].trim(),
    });
  });
  return id;
}
