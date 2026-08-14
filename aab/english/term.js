/* ============================================================
   term.js: the small live layer on a term's contents page.

   The page itself is complete static HTML: every part is listed,
   described and linked before this file runs. All this adds is
   the learner's own position within it,

     1. ticks on the parts already read
     2. the progress bar and its count
     3. the top button becoming "চালিয়ে যান" and pointing at the
        first part not yet read rather than always at part one
     4. the practice book's own count, on the band above the
        parts, so a learner can see how many days are behind them
        without opening the book

   With JavaScript off none of that appears and the page is still
   a working contents page. That is the intended fallback, not a
   degraded one.
   ============================================================ */

import { findTerm, termParts } from "/english/curriculum.js";
import { readSet, termStats, dayStats, onProgress } from "/english/progress.js";

/* Bangla numerals, so a counter on a Bangla page doesn't read
   half in one script and half in another. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const hero = document.querySelector(".term-hero[data-term]");
const term = hero && findTerm(hero.dataset.term);
if (term) paintAll();

function paintAll() {
  const read = readSet();
  const stats = termStats(term);

  /* ---------- 1. ticks on the cards ---------- */
  document.querySelectorAll("[data-part-id]").forEach((card) => {
    card.toggleAttribute("data-done", read.has(card.dataset.partId));
  });

  /* ---------- 2. the bar ---------- */
  const bar = document.querySelector("[data-term-progress]");
  if (bar) {
    bar.querySelector(".track i").style.width = `${stats.pct}%`;
    bar.querySelector(".count").textContent = stats.done === 0
      ? `${bn(stats.live)}টা পর্ব, এখনো শুরু হয়নি`
      : stats.complete
        ? `${bn(stats.live)}টা পর্বই পড়া হয়েছে ✓`
        : `${bn(stats.done)}/${bn(stats.live)}টা পর্ব পড়া হয়েছে`;
    bar.dataset.state = stats.complete ? "done" : stats.done ? "going" : "new";
  }

  /* ---------- 3. the practice book's line ---------- */
  const cta = document.querySelector("[data-workbook-cta]");
  if (cta && term.workbook) {
    const days = dayStats(term);
    cta.textContent = days.done === 0
      ? "খাতা খুলুন →"
      : days.complete
        ? `${bn(days.total)} দিনই শেষ ✓`
        : `আজকের পাতা: দিন ${bn(days.next)} →`;
  }

  /* ---------- 4. the top button ---------- */
  const button = document.querySelector("[data-term-continue]");
  if (!button) return;
  const parts = termParts(term);
  const next = parts.find((p) => p.status === "live" && !read.has(p.id));

  if (!next) {
    /* Everything read. Send them back through it rather than
       nowhere: this course is built on repetition and says so on
       its own first slide. */
    button.href = parts[0].url;
    button.textContent = "আবার শুরু থেকে →";
    return;
  }
  button.href = next.url;
  button.textContent = stats.started
    ? `চালিয়ে যান: ${next.label} →`
    : "শুরু করুন →";
}

onProgress(paintAll);
