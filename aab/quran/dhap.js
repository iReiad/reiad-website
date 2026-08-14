/* ============================================================
   dhap.js: the small live layer on a ধাপ's contents page.

   The page itself is complete static HTML: every day is listed,
   described and linked before this file runs. All this adds is
   the learner's own position within it,

     1. ticks on the days already done
     2. the progress bar and its count, in days rather than pages
     3. the top button becoming "চালিয়ে যান" and pointing at the
        first day not yet done rather than always at day one

   With JavaScript off none of that appears and the page is still
   a working contents page. That is the intended fallback, not a
   degraded one.
   ============================================================ */

import { findDhap, dhapLessons } from "/quran/curriculum.js";
import { doneSet, dhapStats, onProgress } from "/quran/progress.js";

/* Bangla numerals, so a counter on a Bangla page doesn't read
   half in one script and half in another. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const hero = document.querySelector(".dhap-hero[data-dhap]");
const dhap = hero && findDhap(hero.dataset.dhap);
if (dhap) paintAll();

function paintAll() {
  const done = doneSet();
  const stats = dhapStats(dhap);

  /* ---------- 1. ticks on the cards ---------- */
  document.querySelectorAll("[data-lesson-id]").forEach((card) => {
    card.toggleAttribute("data-done", done.has(card.dataset.lessonId));
  });

  /* ---------- 2. the bar ---------- */
  const bar = document.querySelector("[data-dhap-progress]");
  if (bar) {
    bar.querySelector(".track i").style.width = `${stats.pct}%`;
    /* Days, not pages. The course counts in days from its first
       slide to its last, and a learner who has done four lessons
       covering five days has done five days. */
    bar.querySelector(".count").textContent = stats.done === 0
      ? `${bn(stats.totalDays)} দিন, এখনো শুরু হয়নি`
      : stats.complete
        ? `${bn(stats.totalDays)} দিনই শেষ ✓`
        : `${bn(stats.days)}/${bn(stats.totalDays)} দিন হয়েছে`;
    bar.dataset.state = stats.complete ? "done" : stats.done ? "going" : "new";
  }

  /* ---------- 3. the top button ---------- */
  const button = document.querySelector("[data-dhap-continue]");
  if (!button) return;
  const lessons = dhapLessons(dhap);
  const next = lessons.find((l) => l.status === "live" && !done.has(l.id));

  if (!next) {
    /* Everything done. Send them back through it rather than
       nowhere: this course is built on repetition and says so. */
    button.href = lessons[0].url;
    button.textContent = "আবার শুরু থেকে →";
    return;
  }
  button.href = next.url;
  button.textContent = stats.started
    ? `চালিয়ে যান: ${next.label} →`
    : "শুরু করুন →";
}

onProgress(paintAll);
