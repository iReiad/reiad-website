/* ============================================================
   contents.js — the live layer on /learn/contents.html.

   The page ships as a complete list in the HTML; this only adds
   the reader's own marks on top of it:

     1. a ✓ against everything already read
     2. a filter that hides rows, and the sections and stages that
        end up empty
     3. a per-stage tally that reflects what THEY have read, not
        just what has been written

   With scripts off you get the full index, unticked and
   unfiltered — which is exactly what an index should be.
   ============================================================ */

import { readSet, onProgress } from "/learn/progress.js";
import { STAGES, stageLessons } from "/learn/curriculum.js";

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* ---------- 1 + 3. ticks and tallies ---------- */
function paint() {
  const read = readSet();

  document.querySelectorAll("[data-lesson-id]").forEach((row) => {
    row.toggleAttribute("data-read", read.has(row.dataset.lessonId));
  });

  // the number on each stage heading becomes "read / written"
  STAGES.forEach((stage) => {
    const host = document.querySelector(`#c-${stage.slug} .contents-tally`);
    if (!host) return;
    const live = stageLessons(stage).filter((l) => l.status === "live");
    const done = live.filter((l) => read.has(l.id)).length;
    host.textContent = `${bn(done)}/${bn(live.length)}`;
    host.dataset.state = done === 0 ? "new" : done === live.length ? "done" : "going";
  });
}

/* ---------- 2. filter ---------- */
function initFilter() {
  const input = document.getElementById("contents-filter");
  const readout = document.getElementById("contents-count");
  if (!input) return;

  const run = () => {
    const q = input.value.trim().toLowerCase();
    let hits = 0;

    document.querySelectorAll(".contents-row, .g-row").forEach((row) => {
      const match = !q || row.textContent.toLowerCase().includes(q);
      row.hidden = !match;
      if (match && q) hits++;
    });

    // don't leave a section heading standing over nothing
    document.querySelectorAll(".contents-section").forEach((sec) => {
      sec.hidden = q && ![...sec.querySelectorAll(".contents-row")].some((r) => !r.hidden);
    });
    document.querySelectorAll(".contents-stage").forEach((stage) => {
      stage.hidden = q && ![...stage.querySelectorAll(".contents-row")].some((r) => !r.hidden);
    });

    if (readout) {
      readout.hidden = !q;
      readout.textContent = q
        ? hits ? `${bn(hits)}টি মিল পাওয়া গেছে` : "কিছু পাওয়া যায়নি: অন্য শব্দে চেষ্টা করুন"
        : "";
    }
  };

  input.addEventListener("input", run);
}

paint();
initFilter();
onProgress(paint);
