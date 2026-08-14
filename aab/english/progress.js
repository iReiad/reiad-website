/* ============================================================
   progress.js, what you've read, which days you've done, and
   where you were.

   The same deal as /deutsch/progress.js, /quran/progress.js and
   /learn/progress.js, and deliberately the same shape so that
   anyone reading one file understands the others. It is a
   separate module because it stores separate things under
   separate keys: finishing the German ladder should not tell you
   you have finished English, and resetting one must never wipe
   another.

   Four keys, all in localStorage on the reader's own device.
   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics.

     english-read   ["term-1/word-order", "term-1/am-is-are", …]
                    parts that have been opened.

     english-days   ["term-1/day-1", "term-1/day-2", …]
                    days of the practice book ticked off. A day is
                    NOT ticked by opening it, you tick it
                    yourself, when you have actually spoken it out
                    loud. That is the one promise the book makes,
                    so the page cannot make it for you.

     english-last   { id, url, bn, term, ts }
                    the last part opened. Powers the resume card.

     english-day    the day number the workbook was last left on,
                    so returning to it tomorrow opens tomorrow.

   Every write is wrapped: private mode throws on setItem, and a
   thrown tick must never take the page down with it.
   ============================================================ */

import { TERMS, termParts, allParts, findTerm, dayId } from "/english/curriculum.js";
import { whenActivated } from "/activation.js";

const READ_KEY = "english-read";
const DAYS_KEY = "english-days";
const LAST_KEY = "english-last";
const DAY_KEY = "english-day";

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

export const isDayDone = (term, n) => daySet().has(dayId(term, n));

export function toggleDay(term, n) {
  const id = dayId(term, n);
  const set = daySet();
  if (!set.delete(id)) set.add(id);
  saveSet(DAYS_KEY, set);
  return set.has(id);
}

/** { done, total, pct, complete, next } for a term's practice book. */
export function dayStats(term) {
  const total = term.workbook?.days ?? 0;
  if (!total) return { done: 0, total: 0, pct: 0, complete: false, next: 1 };
  const set = daySet();
  let done = 0;
  let next = total;
  let foundNext = false;
  for (let n = 1; n <= total; n++) {
    if (set.has(dayId(term, n))) {
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

    One book today, and the sum is written this way anyway: the
    hub should not have to be edited on the day Term Two grows
    one, and a learner should never be told they have finished
    the practice because the only book counted was the first. */
export function allDayStats() {
  const books = TERMS.filter((t) => t.workbook?.days);
  const done = books.reduce((n, t) => n + dayStats(t).done, 0);
  const total = books.reduce((n, t) => n + t.workbook.days, 0);
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
  return TERMS.find(
    (t) => t.workbook?.days && t.status === "live" && dayStats(t).done < t.workbook.days
  ) ?? null;
}

/** Where the workbook was last left, so tomorrow opens tomorrow. */
export function setLastDay(n) {
  try { localStorage.setItem(DAY_KEY, String(n)); } catch { /* ignore */ }
}

export function getLastDay() {
  try {
    const n = Number(localStorage.getItem(DAY_KEY));
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

/** { done, total, live, pct, complete, started } for one term. */
export function termStats(term) {
  const read = readSet();
  const parts = termParts(term);
  const live = parts.filter((p) => p.status === "live");
  const done = live.filter((p) => read.has(p.id)).length;
  return {
    done,
    total: parts.length,
    live: live.length,
    pct: live.length ? Math.round((done / live.length) * 100) : 0,
    complete: live.length > 0 && done === live.length,
    started: done > 0,
  };
}

/** The same, across both terms. */
export function overallStats() {
  const read = readSet();
  const live = allParts().filter((p) => p.status === "live");
  const done = live.filter((p) => read.has(p.id)).length;
  return {
    done,
    live: live.length,
    pct: live.length ? Math.round((done / live.length) * 100) : 0,
    complete: live.length > 0 && done === live.length,
  };
}

/** The first written part they haven't read, in ladder order. */
export function nextUp() {
  const read = readSet();
  return allParts().find((p) => p.status === "live" && !read.has(p.id)) ?? null;
}

/** The term a learner is "in". */
export function currentTerm() {
  const next = nextUp();
  if (next) return next.term;
  const last = getLast();
  return (last && findTerm(last.term)) || TERMS[TERMS.length - 1];
}

/** Ladder state for a term. Nothing is ever actually locked, a
    learner may jump anywhere, and a term they haven't earned
    simply says so. */
export function termState(term) {
  const stats = termStats(term);
  if (stats.complete) return "done";
  const here = currentTerm();
  if (here?.slug === term.slug) return "now";
  const hereIndex = TERMS.findIndex((t) => t.slug === here?.slug);
  const myIndex = TERMS.findIndex((t) => t.slug === term.slug);
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
    localStorage.removeItem(DAY_KEY);
  } catch { /* ignore */ }
  announce();
}

/* ------------------------------------------------------------
   telling the page something changed
   ------------------------------------------------------------ */

const EVENT = "english:progress";

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
   the part page's side of the deal

   Opening a part counts as reading it: the same rule all three
   other schools use. A part marked data-soon is not ticked off:
   you have not read what has not been written.

   And it waits for activation. Hovering a link prerenders the
   page it points at, scripts and all, so without whenActivated
   this ticked parts off as the pointer swept across a list.
   See /activation.js for the full story.
   ------------------------------------------------------------ */
export function recordVisit(root = document) {
  const article = root.querySelector("article[data-part-id]");
  if (!article) return null;

  const { partId: id, term, partTitle, soon } = article.dataset;
  if (!id || soon) return null;

  whenActivated(() => {
    markRead(id);
    setLast({
      id,
      term: term || "term-1",
      url: location.pathname,
      bn: partTitle || document.title.split(":")[0].trim(),
    });
  });
  return id;
}
