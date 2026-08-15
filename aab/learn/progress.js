/* ============================================================
   progress.js, what you've read, and where you were.

   Stored in localStorage on the reader's own device. Nothing is
   sent anywhere, nothing needs an account, and clearing browser
   data clears it. It is a bookmark, not analytics.

   Two keys:

     learn-read   ["share", "start/papers", "basics-2/sectors", …]
                  Lesson ids. Stage basics-1 uses the bare slug so
                  that ticks earned before the Learn area was
                  restructured are still there, those eighteen
                  terms were the whole hub once, and someone who
                  read them all should not be told they've read
                  nothing.

     learn-last   { id, url, bn, stage, ts }
                  The last lesson opened. Powers the resume card
                  and the auto-scroll on /learn/.

   Every write is wrapped: private mode throws on setItem, and a
   thrown tick must never take the page down with it.
   ============================================================ */

import { STAGES, stageLessons, allLessons, findStage } from "/learn/curriculum.js";
import { whenActivated } from "/activation.js";

const READ_KEY = "learn-read";
const LAST_KEY = "learn-last";

/* ------------------------------------------------------------
   read / write
   ------------------------------------------------------------ */

/* Every id this school could legitimately hold. The eighteen
   glossary terms are already in here: stage basics-1 gives them
   bare slugs as ids, which is the same decision recorded at the top
   of this file. Built once. */
let ownIds = null;
const knownIds = () => (ownIds ??= new Set(allLessons().map((l) => l.id)));

export function readSet() {
  try {
    const raw = JSON.parse(localStorage.getItem(READ_KEY) || "[]");
    if (!Array.isArray(raw)) return new Set();

    /* Anything that is not this school's is dropped on the way out.

       For a while `recordVisit` claimed every page carrying a
       `data-lesson-id`, which is 90 pages of Qur'anic Arabic and
       English as well as this school's own. Those ids are in real
       readers' storage and in their accounts now, inflating this
       ladder's percentages and making it impossible to reset.

       Filtering on read rather than migrating on write is
       deliberate: it needs no version flag, it cannot half-run, and
       it fixes a device that has not been opened for a month the
       first time it is. The set is only rewritten when something
       was actually dropped, so it costs one comparison otherwise. */
    const known = knownIds();
    const mine = raw.filter((id) => known.has(id));
    if (mine.length !== raw.length) {
      try {
        localStorage.setItem(READ_KEY, JSON.stringify(mine));
      } catch { /* private mode: the filter still applies in memory */ }
    }
    return new Set(mine);
  } catch {
    return new Set();
  }
}

function writeSet(set) {
  try {
    localStorage.setItem(READ_KEY, JSON.stringify([...set]));
  } catch {
    /* private mode: the tick is a nicety, not a feature */
  }
  announce();
}

export const isRead = (id) => readSet().has(id);

export function markRead(id) {
  if (!id) return;
  const set = readSet();
  if (set.has(id)) return; // don't churn storage or fire events for nothing
  set.add(id);
  writeSet(set);
}

export function unmarkRead(id) {
  const set = readSet();
  if (!set.delete(id)) return;
  writeSet(set);
}

export function toggleRead(id) {
  isRead(id) ? unmarkRead(id) : markRead(id);
  return isRead(id);
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
    if (!v?.id) return null;

    /* And the bookmark gets the same treatment as the set, for the
       same reason: while recordVisit was claiming other schools'
       pages, this could be pointing at an Arabic lesson, which the
       home page would then offer under "the money ladder". */
    if (!knownIds().has(v.id)) {
      try { localStorage.removeItem(LAST_KEY); } catch { /* ignore */ }
      return null;
    }
    return v;
  } catch {
    return null;
  }
}

/* ------------------------------------------------------------
   sums the hub asks for
   ------------------------------------------------------------ */

/** { done, total, live, pct, complete, started } for one stage. */
export function stageStats(stage) {
  const read = readSet();
  const lessons = stageLessons(stage);
  const live = lessons.filter((l) => l.status === "live");
  const done = live.filter((l) => read.has(l.id)).length;
  return {
    done,
    total: lessons.length,
    live: live.length,
    pct: live.length ? Math.round((done / live.length) * 100) : 0,
    complete: live.length > 0 && done === live.length,
    started: done > 0,
  };
}

/** The same, across the whole ladder. */
export function overallStats() {
  const read = readSet();
  const live = allLessons().filter((l) => l.status === "live");
  const done = live.filter((l) => read.has(l.id)).length;
  return {
    done,
    live: live.length,
    pct: live.length ? Math.round((done / live.length) * 100) : 0,
    complete: live.length > 0 && done === live.length,
  };
}

/** The first written lesson they haven't read, in ladder order. */
export function nextUp() {
  const read = readSet();
  return (
    allLessons().find((l) => l.status === "live" && !read.has(l.id)) ?? null
  );
}

/** The stage a reader is "in": where the next unread lesson is;
    if they've finished everything, the last stage they touched. */
export function currentStage() {
  const next = nextUp();
  if (next) return next.stage;
  const last = getLast();
  return (last && findStage(last.stage)) || STAGES[STAGES.length - 1];
}

/** Ladder state for a stage: done / now / next / locked-ish.
    Nothing is ever actually locked, a reader may jump anywhere,
    and a stage they haven't earned simply says so. */
export function stageState(stage) {
  const stats = stageStats(stage);
  if (stats.complete) return "done";
  const here = currentStage();
  if (here?.slug === stage.slug) return "now";
  const hereIndex = STAGES.findIndex((s) => s.slug === here?.slug);
  const myIndex = STAGES.findIndex((s) => s.slug === stage.slug);
  if (myIndex === hereIndex + 1) return "next";
  return myIndex < hereIndex ? "past" : "later";
}

/* ------------------------------------------------------------
   resets
   ------------------------------------------------------------ */

export function resetAll() {
  try {
    localStorage.removeItem(READ_KEY);
    localStorage.removeItem(LAST_KEY);
  } catch { /* ignore */ }
  announce();
}

export function resetStage(stage) {
  const ids = new Set(stageLessons(stage).map((l) => l.id));
  const set = readSet();
  let changed = false;
  ids.forEach((id) => { if (set.delete(id)) changed = true; });
  if (changed) writeSet(set);
}

/* ------------------------------------------------------------
   telling the page something changed

   The hub paints ticks, rings and the resume card from the same
   numbers in several places. Rather than have each of them poll,
   anything that writes fires one event and everything repaints.
   `storage` covers the second tab; this covers this one, which
   `storage` deliberately does not.
   ------------------------------------------------------------ */

const EVENT = "learn:progress";

function announce() {
  dispatchEvent(new CustomEvent(EVENT));
}

export function onProgress(fn) {
  addEventListener(EVENT, fn);
  addEventListener("storage", (e) => {
    if (e.key === READ_KEY || e.key === LAST_KEY) fn();
  });
  /* Coming back via the bfcache, and ONLY then.

     `pageshow` also fires on an ordinary first load, where it made
     the hub rebuild itself milliseconds after it had just been
     built. That second build was pure waste, and worse: it detached
     the element the auto-scroll had just aimed at, so whether the
     scroll landed came down to which finished first. On a normal
     load the caller has already painted; there is nothing to redo. */
  addEventListener("pageshow", (e) => { if (e.persisted) fn(); });
}

/* ------------------------------------------------------------
   the lesson page's side of the deal

   Opening a lesson counts as reading it: the rule the eighteen
   term pages have always used, now applied to every stage.

   Two shapes are accepted, because the original term pages are
   not regenerated and must keep working exactly as they are:

     data-lesson-id  generated lesson pages carry the full id
     data-slug       the eighteen terms carry a bare slug, which
                     IS their id (basics-1 ids are bare slugs, see
                     lessonId() in curriculum.js)

   An unwritten lesson marked data-soon is not ticked off, you
   have not read what has not been written.

   And it waits for activation. Hovering a link prerenders the
   page it points at, scripts and all, so without whenActivated
   this ticked lessons off as the pointer swept across a list,
   see /activation.js for the full story.
   ------------------------------------------------------------ */
export function recordVisit(root = document) {
  /* `[data-stage]` IS THE POINT, and leaving it out was a real bug.

     app.js calls this on every page of the site, so the selector is
     the only thing deciding which pages belong to this school. It
     used to be `article[data-lesson-id]`, and the Qur'an school's
     lessons (59 pages) and the English school's parts (31) carry
     `data-lesson-id` too, with `data-dhap` and `data-term` beside
     it. So every one of them marked itself as a money-ladder
     lesson: `dhap-1/tin-prokar` sat in `learn-read`, the ladder's
     percentages counted pages from other schools, and the bookmark
     could point the home page's "money ladder" card at an Arabic
     lesson.

     Worst of all, it made this school impossible to reset. Clear it
     on the hub, open any Qur'an or English lesson, and one was back
     in the set. No number of presses could win, because the reset
     and the thing undoing it were on different pages.

     Only /learn/ writes `data-stage`, and only /learn/terms/ writes
     `data-slug`; German uses `data-teil-id` and never matched. */
  const article = root.querySelector(
    "article[data-lesson-id][data-stage], article.term-article[data-slug]"
  );
  if (!article) return null;

  const { lessonId: full, slug, stage, lessonTitle, soon } = article.dataset;
  const id = full || slug;
  if (!id || soon) return null;

  whenActivated(() => {
    markRead(id);
    setLast({
      id,
      /* A term page has no stage, and the ladder's own starter
         stage is the honest home for it. This default used to
         cover for the selector above letting other schools in,
         which is how a Qur'an lesson ended up bookmarked as
         "basics-1". */
      stage: stage || "basics-1",
      url: location.pathname,
      bn: lessonTitle || document.title.split("–")[0].trim(),
    });
  });
  return id;
}
