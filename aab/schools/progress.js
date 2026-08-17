/* ============================================================
   schools/progress.js: what a learner has read, which days they
   have done, and where they were. Once, for every school that
   keeps that in the browser.

   ---- why this file exists ----

   Three schools kept the same program three times. deutsch,
   english and quran each had a progress.js of their own, 316,
   318 and 236 lines, and the diff between the first two was
   nouns: `stufe` against `term`, `teile` against `parts`. Every
   one of them wrapped localStorage the same way, counted live
   lessons the same way, worked out "the stage you are in" the
   same way and fired the same three listeners. A fix to one was
   a fix somebody had to remember to make twice more, and the
   ladder-state function is subtle enough that nobody would have
   noticed the day they drifted.

   The money school never had one of these: its ticks are React,
   in `next/lib/progress.ts`, because its pages are routes. These
   three still need a browser module because their practice books
   are generated static HTML, so this is the browser's half and
   that file is the server's. They agree about one thing only,
   and it is the thing that matters: THE STORAGE KEYS. Those are
   in real browsers and in real accounts, `aab/sync.js` maps them,
   and renaming one does not move somebody's ticks, it loses them.
   So every key a school used before this file existed is passed
   in by that school, spelled exactly as it was.

   ---- what a school hands in ----

   A ladder, the four key names, and the words its pages use. What
   it gets back is the same API it had, under generic names its
   own module renames on the way out, so nothing that imports
   `stufeStats` or `dhapState` had to change.

   Nothing is sent anywhere, nothing needs an account, and
   clearing browser data clears it. It is a bookmark, not
   analytics. Every write is wrapped: private mode throws on
   setItem, and a thrown tick must never take the page down.
   ============================================================ */

import { whenActivated } from "/activation.js";

/**
 * @param {object} config
 * @param {string} config.event        the CustomEvent name, "deutsch:progress"
 * @param {object} config.keys         { read, last, days?, tag? } localStorage names
 * @param {Array}  config.stages       the ladder, in order
 * @param {Function} config.lessonsOf  (stage) => lessons of that stage
 * @param {Function} config.allLessons () => every lesson, in ladder order
 * @param {Function} config.findStage  (slug) => stage
 * @param {Function} [config.dayId]    (stage, n) => a practice book day's id
 * @param {string} config.stageKey     the property naming a lesson's stage
 * @param {Function} [config.weigh]    (lesson) => how much it counts for,
 *                                 where a school counts in something
 *                                 other than pages
 * @param {object} config.attr         dataset names: { id, stage, title }
 * @param {string} config.titleSplit   what document.title is cut on
 * @param {string} config.defaultStage the stage a lesson with none belongs to
 */
export function createProgress(config) {
  const {
    event, keys, stages, lessonsOf, allLessons, findStage,
    dayId, stageKey, weigh, attr, titleSplit, defaultStage,
  } = config;

  /* ----------------------------------------------------------
     read / write
     ---------------------------------------------------------- */

  const announce = () => dispatchEvent(new CustomEvent(event));

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

  const readSet = () => loadSet(keys.read);
  const daySet = () => (keys.days ? loadSet(keys.days) : new Set());

  const isRead = (id) => readSet().has(id);

  function markRead(id) {
    if (!id) return;
    const set = readSet();
    if (set.has(id)) return; // don't churn storage or fire events for nothing
    set.add(id);
    saveSet(keys.read, set);
  }

  function unmarkRead(id) {
    const set = readSet();
    if (!set.delete(id)) return;
    saveSet(keys.read, set);
  }

  /* ----------------------------------------------------------
     the practice book's days

     Ticked by hand, never by arriving: a day is done when you
     have actually spoken it out loud, and that is the one
     promise a practice book makes, so the page cannot make it
     for you. Schools with no book pass no `days` key and every
     function here answers an empty book.
     ---------------------------------------------------------- */

  const isDayDone = (stage, n) => daySet().has(dayId(stage, n));

  function toggleDay(stage, n) {
    const id = dayId(stage, n);
    const set = daySet();
    if (!set.delete(id)) set.add(id);
    saveSet(keys.days, set);
    return set.has(id);
  }

  /** { done, total, pct, complete, next } for one stage's book. */
  function dayStats(stage) {
    const total = stage.workbook?.days ?? 0;
    if (!total) return { done: 0, total: 0, pct: 0, next: 1 };
    const set = daySet();
    let done = 0;
    let next = total;
    let foundNext = false;
    for (let n = 1; n <= total; n++) {
      if (set.has(dayId(stage, n))) {
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
      /* The first day not yet ticked, where "today's page" points.
         When every day is done it points at the last one rather
         than at nothing, so the button always goes somewhere. */
      next: foundNext ? next : total,
    };
  }

  /** Every practice book added together, for the hub's one bar.

      Showing only the first book's thirty days would tell a
      learner halfway through the second that they had finished
      the practice. */
  function allDayStats() {
    const books = stages.filter((s) => s.workbook?.days);
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
  const nextBook = () => stages.find(
    (s) => s.workbook?.days && s.status === "live"
      && dayStats(s).done < s.workbook.days,
  ) ?? null;

  /** Where the book was last left, so tomorrow opens tomorrow. */
  function setLastDay(n) {
    try { localStorage.setItem(keys.tag, String(n)); } catch { /* ignore */ }
  }

  function getLastDay() {
    try {
      const n = Number(localStorage.getItem(keys.tag));
      return Number.isInteger(n) && n > 0 ? n : null;
    } catch {
      return null;
    }
  }

  /* ----------------------------------------------------------
     where they were
     ---------------------------------------------------------- */

  function setLast(entry) {
    if (!entry?.id) return;
    try {
      localStorage.setItem(keys.last, JSON.stringify({ ...entry, ts: Date.now() }));
    } catch { /* ignore */ }
  }

  function getLast() {
    try {
      const v = JSON.parse(localStorage.getItem(keys.last) || "null");
      return v && v.id ? v : null;
    } catch {
      return null;
    }
  }

  /* ----------------------------------------------------------
     sums the hub asks for

     `weighted` is the count in whatever unit the school counts
     in. Three of the four count pages and weigh every lesson 1,
     so it equals `done`; the Quranic Arabic school counts days
     and two of its lessons cover two, which is why the number
     exists at all rather than being assumed.
     ---------------------------------------------------------- */

  const sum = (lessons, f) => lessons.reduce((n, l) => n + f(l), 0);

  const tally = (lessons, read) => {
    const live = lessons.filter((l) => l.status === "live");
    const finished = live.filter((l) => read.has(l.id));
    return {
      done: finished.length,
      total: lessons.length,
      live: live.length,
      pct: live.length ? Math.round((finished.length / live.length) * 100) : 0,
      complete: live.length > 0 && finished.length === live.length,
      started: finished.length > 0,
      /* Only where a school asked for it. A school that counts
         pages has no use for a second count of the same thing,
         and an unasked-for key on an object three hubs read is
         how a shared function starts telling people things they
         did not ask about. */
      ...(weigh ? { weighted: sum(finished, weigh), weightedTotal: sum(lessons, weigh) } : {}),
    };
  };

  /** { done, total, live, pct, complete, started } for one stage,
      plus the weighted pair where the school counts in something
      other than pages. */
  const stageStats = (stage) => tally(lessonsOf(stage), readSet());

  /** The same, across the whole ladder. `total` and `started` are
      dropped: a ladder is never partly written and "have they
      started" is a question about a stage. */
  const overallStats = () => {
    const { total, started, ...rest } = tally(allLessons(), readSet());
    return rest;
  };

  /** The first written lesson they haven't read, in ladder order. */
  function nextUp() {
    const read = readSet();
    return allLessons().find((l) => l.status === "live" && !read.has(l.id)) ?? null;
  }

  /** The stage a learner is "in". */
  function currentStage() {
    const next = nextUp();
    if (next) return next[stageKey];
    const last = getLast();
    return (last && findStage(last[stageKey])) || stages[stages.length - 1];
  }

  /** Ladder state for a stage. Nothing is ever actually locked, a
      learner may jump anywhere, and a stage they haven't earned
      simply says so. */
  function stageState(stage) {
    if (stageStats(stage).complete) return "done";
    const here = currentStage();
    if (here?.slug === stage.slug) return "now";
    const hereIndex = stages.findIndex((s) => s.slug === here?.slug);
    const myIndex = stages.findIndex((s) => s.slug === stage.slug);
    if (myIndex === hereIndex + 1) return "next";
    return myIndex < hereIndex ? "past" : "later";
  }

  /* ----------------------------------------------------------
     resets
     ---------------------------------------------------------- */

  function resetAll() {
    try {
      Object.values(keys).forEach((key) => localStorage.removeItem(key));
    } catch { /* ignore */ }
    announce();
  }

  /* ----------------------------------------------------------
     telling the page something changed
     ---------------------------------------------------------- */

  function onProgress(fn) {
    addEventListener(event, fn);
    const watched = [keys.read, keys.days, keys.last].filter(Boolean);
    addEventListener("storage", (e) => {
      if (watched.includes(e.key)) fn();
    });
    /* Coming back via the bfcache, and only then. On an ordinary
       first load the caller has already painted; a second build
       would detach the element the auto-scroll just aimed at. */
    addEventListener("pageshow", (e) => { if (e.persisted) fn(); });
  }

  /* ----------------------------------------------------------
     the lesson page's side of the deal

     Opening a lesson counts as reading it. A lesson marked
     data-soon is not ticked off: you have not read what has not
     been written.

     And it waits for activation. Hovering a link prerenders the
     page it points at, scripts and all, so without whenActivated
     this ticked lessons off as the pointer swept across a list.
     See /activation.js for the full story.
     ---------------------------------------------------------- */

  function recordVisit(root = document) {
    const article = root.querySelector(`article[${attr.id}]`);
    if (!article) return null;

    const prop = (name) => article.getAttribute(name);
    const id = prop(attr.id);
    if (!id || article.hasAttribute("data-soon")) return null;

    whenActivated(() => {
      markRead(id);
      setLast({
        id,
        [stageKey]: prop(attr.stage) || defaultStage,
        url: location.pathname,
        bn: prop(attr.title) || document.title.split(titleSplit)[0].trim(),
      });
    });
    return id;
  }

  return {
    readSet, daySet, isRead, markRead, unmarkRead,
    isDayDone, toggleDay, dayStats, allDayStats, nextBook,
    setLastDay, getLastDay,
    setLast, getLast,
    stageStats, overallStats, nextUp, currentStage, stageState,
    resetAll, onProgress, recordVisit,
  };
}
