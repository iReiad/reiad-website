/* ============================================================
   stufe.js: the small live layer on a Stufe's contents page.

   The page itself is complete static HTML: every Teil is listed,
   described and linked before this file runs. All this adds is
   the learner's own position within it,

     1. ticks on the Teile already read
     2. the progress bar and its count
     3. the top button becoming "চালিয়ে যান" and pointing at the
        first unread Teil rather than always at Teil one
     4. the practice book's card saying which day is next

   With JavaScript off none of that appears and the page is still
   a working contents page. That is the intended fallback, not a
   degraded one.
   ============================================================ */

import { findStufe, stufeTeile } from "/deutsch/curriculum.js";
import { readSet, stufeStats, dayStats, onProgress } from "/deutsch/progress.js";

/* Bangla numerals, so a counter on a Bangla page doesn't read
   half in one script and half in another. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const hero = document.querySelector(".stufe-hero[data-stufe]");
const stufe = hero && findStufe(hero.dataset.stufe);
if (stufe) paintAll();

function paintAll() {
  const read = readSet();
  const teile = stufeTeile(stufe);

  /* ---------- 1. ticks ---------- */
  document.querySelectorAll(".lesson-card[data-teil-id]").forEach((card) => {
    card.toggleAttribute("data-read", read.has(card.dataset.teilId));
  });

  /* ---------- 2. the bar ---------- */
  const stats = stufeStats(stufe);
  const bar = document.querySelector(`[data-stufe-progress="${stufe.slug}"]`);
  if (bar) {
    bar.querySelector(".track i").style.width = `${stats.pct}%`;
    bar.querySelector(".count").textContent = stats.done === 0
      ? `${bn(stats.live)}টি পাঠ, এখনো শুরু হয়নি`
      : stats.complete
        ? `সব পাঠ পড়া হয়েছে ✓ ${bn(stats.done)}/${bn(stats.live)}`
        : `${bn(stats.done)}/${bn(stats.live)} পড়া হয়েছে`;
    bar.dataset.state = stats.complete ? "done" : stats.started ? "going" : "new";
  }

  /* ---------- 3. the button ---------- */
  const button = document.querySelector(`[data-stufe-continue="${stufe.slug}"]`);
  if (button) {
    const next = teile.find((t) => t.status === "live" && !read.has(t.id));
    if (!next) {
      /* Finished reading. The next thing is not another Teil, it
         is the practice book: so send them there rather than
         back to Teil one. */
      const book = document.querySelector(`[data-workbook="${stufe.slug}"]`);
      if (book) {
        button.href = book.getAttribute("href");
        button.textContent = "অনুশীলন শুরু করুন →";
      } else {
        button.href = "/deutsch/index.html#leiter";
        button.textContent = "পরের স্তরে যান →";
      }
    } else if (stats.started) {
      button.href = next.url;
      button.textContent = `চালিয়ে যান: ${next.bn} →`;
    } else {
      button.href = next.url;
      button.textContent = "শুরু করুন →";
    }
  }

  /* ---------- 4. the practice book's card ---------- */
  const cta = document.querySelector("[data-workbook-cta]");
  if (cta && stufe.workbook) {
    const days = dayStats(stufe);
    cta.textContent = days.done === 0
      ? "খাতা খুলুন →"
      : days.complete
        ? `৩০ দিনই শেষ ✓`
        : `দিন ${bn(days.next)} খুলুন → (${bn(days.done)}/${bn(days.total)})`;
  }
}

onProgress(paintAll);
