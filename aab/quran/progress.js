/* ============================================================
   progress.js, which days you have done and where you were.

   The same deal as /deutsch/progress.js and /learn/progress.js,
   and deliberately the same shape so that anyone reading one
   file understands the others. It is a separate module because
   it stores separate things under separate keys: finishing the
   German ladder should not tell you you have finished the
   Quranic Arabic one, and resetting one must never wipe another.

   Three keys, all in localStorage on the reader's own device.
   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics.

     quran-done   ["dhap-1/tin-prokar", "dhap-1/sorbonam", …]
                  days that have been opened.

     quran-last   { id, url, bn, dhap, ts }
                  the last day opened. Powers the resume card.

   ------------------------------------------------------------
   WHY THERE IS NO SEPARATE "TICKED" SET HERE

   The German school kept two things apart: Teile you had read,
   and days of the practice book you swore you had spoken out
   loud. It could, because they were different pages.

   Here the day IS the lesson, so there is only one thing to
   record, and opening it is what records it. That is the same
   rule the Learn area uses, and it is the honest one: this
   course has nothing to submit and nothing to mark. What it asks
   for, saying the words aloud, no page can verify anyway.

   Every write is wrapped: private mode throws on setItem, and a
   thrown tick must never take the page down with it.
   ============================================================ */

import { DHAPS, dhapLessons, allLessons, findDhap } from "/quran/curriculum.js";
import { whenActivated } from "/activation.js";

const DONE_KEY = "quran-done";
const LAST_KEY = "quran-last";

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

export const doneSet = () => loadSet(DONE_KEY);

export const isDone = (id) => doneSet().has(id);

export function markDone(id) {
  if (!id) return;
  const set = doneSet();
  if (set.has(id)) return; // don't churn storage or fire events for nothing
  set.add(id);
  saveSet(DONE_KEY, set);
}

export function unmarkDone(id) {
  const set = doneSet();
  if (!set.delete(id)) return;
  saveSet(DONE_KEY, set);
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

/** { done, total, live, pct, complete, started, days } for one ধাপ.

    `days` counts days rather than pages, because two of the
    lessons cover two days each and a learner counting their way
    to sixty is counting days. */
export function dhapStats(dhap) {
  const done = doneSet();
  const lessons = dhapLessons(dhap);
  const live = lessons.filter((l) => l.status === "live");
  const finished = live.filter((l) => done.has(l.id));
  return {
    done: finished.length,
    total: lessons.length,
    live: live.length,
    days: finished.reduce((n, l) => n + l.days, 0),
    totalDays: lessons.reduce((n, l) => n + l.days, 0),
    pct: live.length ? Math.round((finished.length / live.length) * 100) : 0,
    complete: live.length > 0 && finished.length === live.length,
    started: finished.length > 0,
  };
}

/** The same, across all three ধাপ. */
export function overallStats() {
  const done = doneSet();
  const live = allLessons().filter((l) => l.status === "live");
  const finished = live.filter((l) => done.has(l.id));
  return {
    done: finished.length,
    live: live.length,
    days: finished.reduce((n, l) => n + l.days, 0),
    totalDays: allLessons().reduce((n, l) => n + l.days, 0),
    pct: live.length ? Math.round((finished.length / live.length) * 100) : 0,
    complete: live.length > 0 && finished.length === live.length,
  };
}

/** The first written day they haven't done, in ladder order. */
export function nextUp() {
  const done = doneSet();
  return allLessons().find((l) => l.status === "live" && !done.has(l.id)) ?? null;
}

/** The ধাপ a learner is "in". */
export function currentDhap() {
  const next = nextUp();
  if (next) return next.dhap;
  const last = getLast();
  return (last && findDhap(last.dhap)) || DHAPS[DHAPS.length - 1];
}

/** Ladder state for a ধাপ. Nothing is ever actually locked, a
    learner may jump anywhere, and a ধাপ they haven't earned
    simply says so. */
export function dhapState(dhap) {
  const stats = dhapStats(dhap);
  if (stats.complete) return "done";
  const here = currentDhap();
  if (here?.slug === dhap.slug) return "now";
  const hereIndex = DHAPS.findIndex((d) => d.slug === here?.slug);
  const myIndex = DHAPS.findIndex((d) => d.slug === dhap.slug);
  if (myIndex === hereIndex + 1) return "next";
  return myIndex < hereIndex ? "past" : "later";
}

/* ------------------------------------------------------------
   resets
   ------------------------------------------------------------ */

export function resetAll() {
  try {
    localStorage.removeItem(DONE_KEY);
    localStorage.removeItem(LAST_KEY);
  } catch { /* ignore */ }
  announce();
}

/* ------------------------------------------------------------
   telling the page something changed
   ------------------------------------------------------------ */

const EVENT = "quran:progress";

function announce() {
  dispatchEvent(new CustomEvent(EVENT));
}

export function onProgress(fn) {
  addEventListener(EVENT, fn);
  addEventListener("storage", (e) => {
    if ([DONE_KEY, LAST_KEY].includes(e.key)) fn();
  });
  /* Coming back via the bfcache, and only then. On an ordinary
     first load the caller has already painted; a second build
     would detach the element the auto-scroll just aimed at. */
  addEventListener("pageshow", (e) => { if (e.persisted) fn(); });
}

/* ------------------------------------------------------------
   the day page's side of the deal

   Opening a day counts as doing it: the same rule both other
   schools use. A day marked data-soon is not ticked off: you
   have not read what has not been written.

   And it waits for activation. Hovering a link prerenders the
   page it points at, scripts and all, so without whenActivated
   this ticked days off as the pointer swept across a list.
   See /activation.js for the full story.
   ------------------------------------------------------------ */
export function recordVisit(root = document) {
  const article = root.querySelector("article[data-lesson-id]");
  if (!article) return null;

  const { lessonId: id, dhap, lessonTitle, soon } = article.dataset;
  if (!id || soon) return null;

  whenActivated(() => {
    markDone(id);
    setLast({
      id,
      dhap: dhap || "dhap-1",
      url: location.pathname,
      bn: lessonTitle || document.title.split(":")[0].trim(),
    });
  });
  return id;
}
