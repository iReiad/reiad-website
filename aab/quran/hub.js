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

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/* ============================================================
   the ladder
   ============================================================ */

/** A little ring showing a ধাপ's progress. Same drawing as the
    other two schools', deliberately: three schools, one visual
    language. */
function ring(pct) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("viewBox", "0 0 36 36");
  svg.setAttribute("class", "ring");
  svg.setAttribute("aria-hidden", "true");
  svg.innerHTML =
    `<circle class="ring-track" cx="18" cy="18" r="${r}" fill="none" stroke-width="3"/>` +
    `<circle class="ring-fill" cx="18" cy="18" r="${r}" fill="none" stroke-width="3"` +
    ` stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - pct / 100)}"` +
    ` transform="rotate(-90 18 18)" stroke-linecap="round"/>`;
  return svg;
}

const STATE_LABEL = {
  done: "শেষ",
  now: "এখানে আছেন",
  next: "পরবর্তী",
  past: "এড়িয়ে গেছেন",
  later: "পরে",
};

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
    host.hidden = true;
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

  host.hidden = false;
  host.className = "resume";
  host.textContent = "";
  host.append(
    el("span", { className: "resume-art", innerHTML: icon(target.art) }),
    el("div", { className: "resume-text" },
      el("span", { className: "mono resume-label", textContent: target.label }),
      el("strong", { className: "bn-h", textContent: target.title }),
      el("span", { className: "resume-where", textContent: target.where })
    ),
    el("div", { className: "resume-actions" },
      el("a", { className: "btn btn-solid", href: target.url, textContent: "চালিয়ে যান →" }),
      el("span", { className: "mono resume-pct", textContent: `${bn(target.pct)}%` })
    )
  );
}

/* ============================================================
   the bar at the top
   ============================================================ */

function paintProgress() {
  const line = document.getElementById("quran-progress");
  if (!line) return;

  const all = overallStats();
  line.querySelector(".track i").style.width = `${all.pct}%`;
  line.querySelector(".count").textContent =
    `${bn(all.days)}/${bn(all.totalDays)} দিন হয়েছে`;

  const reset = document.getElementById("quran-reset");
  if (reset) reset.hidden = all.done === 0;
}

function wireReset() {
  const reset = document.getElementById("quran-reset");
  if (!reset) return;
  reset.addEventListener("click", () => {
    if (!confirm("সব দিনের হিসাব মুছে যাবে। ঠিক আছে?")) return;
    resetAll();
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
wireReset();
onProgress(repaint);
