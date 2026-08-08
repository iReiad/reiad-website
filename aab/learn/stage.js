/* ============================================================
   stage.js — the small live layer on a stage's contents page.

   The page itself is complete static HTML: every lesson is
   listed, described and linked before this file runs. All this
   adds is the reader's own position within it —

     1. ticks on the lessons already read
     2. the progress bar and its count
     3. the top button becoming "চালিয়ে যান" and pointing at the
        first unread lesson rather than always lesson one

   With JavaScript off, none of that appears and the page is
   still a working contents page. That is the intended fallback,
   not a degraded one.
   ============================================================ */

import { findStage, stageLessons } from "/learn/curriculum.js";
import { readSet, stageStats, onProgress } from "/learn/progress.js";

/* Bangla numerals, so a counter on a Bangla page doesn't read
   half in one script and half in another. Same helper as hub.js. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const hero = document.querySelector(".stage-hero[data-stage]");
const stage = hero && findStage(hero.dataset.stage);
if (stage) paintAll();

function paintAll() {
  const read = readSet();
  const lessons = stageLessons(stage);

  /* ---------- 1. ticks ---------- */
  document.querySelectorAll(".lesson-card[data-lesson-id]").forEach((card) => {
    card.toggleAttribute("data-read", read.has(card.dataset.lessonId));
  });

  /* ---------- 2. the bar ---------- */
  const stats = stageStats(stage);
  const bar = document.querySelector(`[data-stage-progress="${stage.slug}"]`);
  if (bar) {
    bar.querySelector(".track i").style.width = `${stats.pct}%`;
    bar.querySelector(".count").textContent = stats.done === 0
      ? `${bn(stats.live)}টি লেখা — এখনো শুরু হয়নি`
      : stats.complete
        ? `এই ধাপ শেষ ✓ ${bn(stats.done)}/${bn(stats.live)}`
        : `${bn(stats.done)}/${bn(stats.live)} পড়া হয়েছে`;
    bar.dataset.state = stats.complete ? "done" : stats.started ? "going" : "new";
  }

  /* ---------- 3. the button ---------- */
  const button = document.querySelector(`[data-stage-continue="${stage.slug}"]`);
  if (button) {
    const next = lessons.find((l) => l.status === "live" && !read.has(l.id));
    if (!next) {
      // Finished. Send them on rather than back to lesson one.
      button.href = "/learn/index.html#ladder";
      button.textContent = "পরের ধাপে যান →";
    } else if (stats.started) {
      button.href = next.url;
      button.textContent = `চালিয়ে যান — ${next.bn} →`;
    } else {
      button.href = next.url;
      button.textContent = "শুরু করুন →";
    }
  }
}

onProgress(paintAll);
