/* ============================================================
   hub.js: the English school's front page, made live.

   The page itself already explains the course, lists what the
   two terms are for, and links to টার্ম ১. This file adds the
   one thing a static page cannot know: where this particular
   learner is standing.

     1. THE LADDER, built from curriculum.js so that renaming a
        term there renames it here, in the menu, in the
        breadcrumbs and in the sitemap at the same time.
     2. THE RESUME CARD, which is the whole point of a course you
        do for an hour a night. Nobody should have to remember
        which part they stopped at.
     3. THE OVERALL BAR, counted in parts, and the practice
        book's own count beside it, because a learner can be
        halfway through the reading and nowhere in the writing.

   With JavaScript off, the ladder falls back to the static list
   of terms already in the markup and every link still works.
   ============================================================ */

import {
  TERMS, termParts, termUrl, termMinutes, workbookUrl,
} from "/english/curriculum.js";
import {
  readSet, termStats, termState, overallStats, allDayStats, nextUp,
  resetAll, onProgress,
} from "/english/progress.js";
import { icon } from "/english/icons.js";
import {
  bn, el, ring, STATE_LABEL, paintResume, paintBar, wireReset,
} from "/schools/hub.js";


/* ============================================================
   the ladder
   ============================================================ */


function termRow(term) {
  const stats = termStats(term);
  const state = termState(term);
  const parts = termParts(term);

  const details = el("details", { className: "rung" });
  details.dataset.state = state;
  details.dataset.term = term.slug;
  details.open = state === "now";

  const summary = el("summary");
  summary.append(
    el("span", { className: "rung-art", innerHTML: icon(term.icon) }),
    el("span", { className: "rung-head" },
      el("span", { className: "rung-kicker mono", textContent: term.kicker }),
      el("span", { className: "rung-title bn-h", textContent: term.bn },
        el("span", { className: "en-sub", lang: "en", textContent: term.en })),
      el("span", { className: "rung-who", textContent: term.who })
    ),
    el("span", { className: "rung-state" },
      el("span", { className: "state-pill mono", textContent: STATE_LABEL[state] }),
      ring(stats.pct),
      el("span", { className: "rung-count mono",
        textContent: `${bn(stats.done)}/${bn(stats.live)}` })
    )
  );
  details.append(summary);

  const body = el("div", { className: "rung-body" });
  body.append(el("p", { className: "rung-blurb", textContent: term.blurb }));

  /* What a learner will be able to DO. On a spoken-language
     course it is the only promise worth printing. */
  body.append(el("p", { className: "rung-can" },
    el("span", { className: "mono", textContent: "শেষে " }),
    document.createTextNode(term.can)
  ));

  /* Section names and counts, not thirty part titles. Each term
     has a page of its own that lists them properly. */
  const read = readSet();
  const list = el("ul", { className: "rung-sections" });
  term.sections.forEach((section) => {
    const here = parts.filter((p) => p.section.id === section.id);
    const did = here.filter((p) => p.status === "live" && read.has(p.id)).length;
    list.append(
      el("li", {},
        el("span", { className: "rung-section-name", textContent: section.bn }),
        el("span", { className: "rung-section-count mono",
          textContent: `${bn(did)}/${bn(here.length)}` })
      )
    );
  });
  body.append(list);

  const foot = el("div", { className: "rung-foot" },
    el("a", { className: "btn btn-solid", href: termUrl(term),
      textContent: stats.started && !stats.complete ? "চালিয়ে যান →" : "এই টার্ম খুলুন →" })
  );
  const book = workbookUrl(term);
  if (book) {
    foot.append(el("a", { className: "btn btn-ghost", href: book,
      textContent: `${bn(term.workbook.days)} দিনের খাতা` }));
  }
  foot.append(el("span", { className: "mono rung-time",
    textContent:
      `${bn(parts.length)}টি পর্ব · রোজ ${bn(term.minutes[0])}–${bn(term.minutes[1])} মিনিট · ` +
      `প্রায় ${bn(termMinutes(term))} মিনিট পড়া` }));
  body.append(foot);

  details.append(body);
  return details;
}

function buildLadder() {
  const host = document.getElementById("term-list");
  if (!host) return;
  host.textContent = "";
  TERMS.forEach((term) => host.append(termRow(term)));
}

/* ============================================================
   where you were
   ============================================================ */

function buildResume() {
  const host = document.getElementById("resume");
  if (!host) return;

  const next = nextUp();
  const all = overallStats();

  /* Nothing read: a first-time visitor should see a clean start,
     not an empty box telling them they have done nothing. */
  if (!all.done) {
    paintResume(host, null, icon);
    return;
  }

  const target = next
    ? {
        label: "যেখানে ছিলেন",
        title: next.bn,
        where: `${next.term.kicker} · ${next.label}`,
        url: next.url,
        art: next.icon ?? next.term.icon,
        pct: termStats(next.term).pct,
      }
    /* Both terms read. There is nothing left to resume, and the
       course's own last slide says what happens next: stop
       translating, start speaking. Send them to the practice
       book rather than pretending there is another part. */
    : {
        label: "সব পর্ব পড়া হয়েছে ✓",
        title: "রোজকার অনুশীলনে ফিরুন",
        where: `${TERMS[0].kicker} · ${bn(TERMS[0].workbook?.days ?? 30)} দিনের খাতা`,
        url: workbookUrl(TERMS[0]) ?? termUrl(TERMS[0]),
        art: "pen",
        pct: 100,
      };

  paintResume(host, target, icon);
}

/* ============================================================
   the bar at the top
   ============================================================ */

function paintProgress() {
  const all = overallStats();
  const days = allDayStats();
  paintBar("english", {
    pct: all.pct,
    count: `${bn(all.done)}/${bn(all.live)}টি পর্ব পড়া · ${bn(days.done)}/${bn(days.total)} দিনের অনুশীলন`,
    anything: all.done > 0 || days.done > 0,
  });
}

/* ============================================================
   go
   ============================================================ */

function repaint() {
  buildLadder();
  buildResume();
  paintProgress();
}

repaint();
wireReset("english", "পড়া পর্ব আর খাতার দিনের হিসাব মুছে যাবে। আপনার লেখা থেকে যাবে। ঠিক আছে?", resetAll);
onProgress(repaint);
