/* ============================================================
   hub.js: the Quranic Arabic school's front page, made live.

   The page itself already explains the course, lists what the
   three ধাপ are for, and links to ধাপ ১. This file adds the one
   thing a static page cannot know: where this particular learner
   is standing.

     1. THE LADDER, built from curriculum.js so that renaming a
        ধাপ there renames it here, in the menu, in the
        breadcrumbs and in the sitemap at the same time.
     2. THE RESUME CARD, which is the whole point of a course you
        do for half an hour a night. Nobody should have to
        remember which day they stopped at.
     3. THE OVERALL BAR, counted in days rather than pages,
        because the course counts in days from its first slide to
        its last and promises sixty of them.

   With JavaScript off, the ladder falls back to the static list
   of ধাপ already in the markup and every link still works.
   ============================================================ */

import {
  DHAPS, dhapLessons, dhapUrl, dhapMinutes, dhapDays,
} from "/quran/curriculum.js";
import {
  doneSet, dhapStats, dhapState, overallStats, nextUp, resetAll, onProgress,
} from "/quran/progress.js";
import { icon } from "/quran/icons.js";
import {
  bn, el, ring, STATE_LABEL, paintResume, paintBar, wireReset,
} from "/schools/hub.js";


/* ============================================================
   the ladder
   ============================================================ */


function dhapRow(dhap) {
  const stats = dhapStats(dhap);
  const state = dhapState(dhap);
  const lessons = dhapLessons(dhap);

  const details = el("details", { className: "rung" });
  details.dataset.state = state;
  details.dataset.dhap = dhap.slug;
  details.open = state === "now";

  const summary = el("summary");
  summary.append(
    el("span", { className: "rung-art", innerHTML: icon(dhap.icon) }),
    el("span", { className: "rung-head" },
      el("span", { className: "rung-kicker mono", textContent: dhap.kicker }),
      el("span", { className: "rung-title bn-h", textContent: dhap.bn },
        el("span", { className: "ar-sub", lang: "ar", dir: "rtl", textContent: dhap.ar })),
      el("span", { className: "rung-who", textContent: dhap.who })
    ),
    el("span", { className: "rung-state" },
      el("span", { className: "state-pill mono", textContent: STATE_LABEL[state] }),
      ring(stats.pct),
      el("span", { className: "rung-count mono",
        textContent: `${bn(stats.days)}/${bn(stats.totalDays)}` })
    )
  );
  details.append(summary);

  const body = el("div", { className: "rung-body" });
  body.append(el("p", { className: "rung-blurb", textContent: dhap.blurb }));

  /* What a learner will be able to DO. On a course like this it
     is the only promise worth printing. */
  body.append(el("p", { className: "rung-can" },
    el("span", { className: "mono", textContent: "শেষে " }),
    document.createTextNode(dhap.can)
  ));

  /* Segment names and counts, not sixty day titles. Each ধাপ has
     a page of its own that lists them properly. */
  const done = doneSet();
  const list = el("ul", { className: "rung-sections" });
  dhap.sections.forEach((section) => {
    const here = lessons.filter((l) => l.section.id === section.id);
    const did = here.filter((l) => l.status === "live" && done.has(l.id)).length;
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
    el("a", { className: "btn btn-solid", href: dhapUrl(dhap),
      textContent: stats.started && !stats.complete ? "চালিয়ে যান →" : "এই ধাপ খুলুন →" })
  );
  foot.append(el("span", { className: "mono rung-time",
    textContent:
      `${bn(dhapDays(dhap))} দিন · রোজ ${bn(dhap.minutes[0])}–${bn(dhap.minutes[1])} মিনিট · ` +
      `প্রায় ${bn(dhapMinutes(dhap))} মিনিট পড়া` }));
  body.append(foot);

  details.append(body);
  return details;
}

function buildLadder() {
  const host = document.getElementById("dhap-list");
  if (!host) return;
  host.textContent = "";
  DHAPS.forEach((dhap) => host.append(dhapRow(dhap)));
}

/* ============================================================
   where you were
   ============================================================ */

function buildResume() {
  const host = document.getElementById("resume");
  if (!host) return;

  const next = nextUp();
  const all = overallStats();

  /* Nothing done: a first-time visitor should see a clean start,
     not an empty box telling them they have done nothing. */
  if (!all.done) {
    paintResume(host, null, icon);
    return;
  }

  const target = next
    ? {
        label: "যেখানে ছিলেন",
        title: next.bn,
        where: `${next.dhap.kicker} · ${next.label}`,
        url: next.url,
        art: next.icon ?? next.dhap.icon,
        pct: dhapStats(next.dhap).pct,
      }
    /* Sixty days done. There is nothing left to resume, and the
       course's own last page says so: the habit now is to open
       the Quran and hunt for words you know. Send them back to
       the first day rather than pretending there is a next one. */
    : {
        label: "ষাট দিনই শেষ ✓",
        title: "আবার শুরু থেকে",
        where: `${DHAPS[0].kicker} · ${DHAPS[0].bn}`,
        url: dhapUrl(DHAPS[0]),
        art: "open-book",
        pct: 100,
      };

  paintResume(host, target, icon);
}

/* ============================================================
   the bar at the top
   ============================================================ */

function paintProgress() {
  const all = overallStats();
  paintBar("quran", {
    pct: all.pct,
    count: `${bn(all.days)}/${bn(all.totalDays)} দিন হয়েছে`,
    anything: all.done > 0,
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
wireReset("quran", "সব দিনের হিসাব মুছে যাবে। ঠিক আছে?", resetAll);
onProgress(repaint);
