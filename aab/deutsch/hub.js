/* ============================================================
   hub.js: the German school's front page, made live.

   The page itself already explains the course, lists what the
   four Stufen are for, and links to Stufe 1 and to the practice
   book. This file adds the one thing a static page cannot know:
   where this particular learner is standing.

     1. THE LADDER, built from curriculum.js so that renaming a
        Stufe there renames it here, in the menu, in the
        breadcrumbs and in the sitemap at the same time.
     2. THE RESUME CARD, which is the whole point of a course you
        do for an hour a night. Nobody should have to remember
        which Teil they stopped at.
     3. THE OVERALL BAR, Teile read and days practised, side by
        side, because reading fourteen chapters and doing zero
        days is not progress, and the page should say so.

   With JavaScript off, the ladder falls back to the static list
   of Stufen already in the markup and every link still works.
   ============================================================ */

import {
  STUFEN, stufeTeile, stufeUrl, stufeMinutes, workbookUrl,
} from "/deutsch/curriculum.js";
import {
  readSet, stufeStats, stufeState, dayStats, overallStats,
  nextUp, resetAll, onProgress,
} from "/deutsch/progress.js";
import { icon } from "/deutsch/icons.js";

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/* ============================================================
   the ladder
   ============================================================ */

/** A little ring showing a Stufe's progress. Same drawing as the
    Learn hub's, deliberately: two schools, one visual language. */
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

function stufeRow(stufe) {
  const stats = stufeStats(stufe);
  const state = stufeState(stufe);
  const teile = stufeTeile(stufe);

  const details = el("details", { className: "rung" });
  details.dataset.state = state;
  details.dataset.stufe = stufe.slug;
  if (stufe.status === "soon") details.dataset.soon = "1";
  details.open = state === "now";

  const summary = el("summary");
  summary.append(
    el("span", { className: "rung-art", innerHTML: icon(stufe.icon) }),
    el("span", { className: "rung-head" },
      el("span", { className: "rung-kicker mono", textContent: stufe.kicker }),
      el("span", { className: "rung-title bn-h", textContent: stufe.bn },
        el("span", { className: "en-sub", lang: "de", textContent: stufe.de })),
      el("span", { className: "rung-who", textContent: stufe.who })
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
  body.append(el("p", { className: "rung-blurb", textContent: stufe.blurb }));

  /* What a learner will be able to DO. On a language course this
     is the only promise worth printing, and it is the sentence
     that decides whether someone starts tonight or "later". */
  body.append(el("p", { className: "rung-can" },
    el("span", { className: "mono", textContent: "শেষে " }),
    document.createTextNode(stufe.can)
  ));

  if (stufe.status === "soon") {
    body.append(el("p", { className: "rung-soon mono",
      textContent: "এই স্তরের পাঠগুলো এখনো তৈরি হচ্ছে: কাঠামোটা দেখে নিতে পারেন।" }));
  }

  /* Section names and counts, not fourteen Teil titles. Each
     Stufe has a page of its own that lists them properly. */
  const read = readSet();
  const list = el("ul", { className: "rung-sections" });
  stufe.sections.forEach((section) => {
    const here = teile.filter((t) => t.section.id === section.id);
    const done = here.filter((t) => t.status === "live" && read.has(t.id)).length;
    list.append(
      el("li", {},
        el("span", { className: "rung-section-name", textContent: section.bn }),
        el("span", { className: "rung-section-count mono",
          textContent: `${bn(done)}/${bn(here.length)}` })
      )
    );
  });
  body.append(list);

  const foot = el("div", { className: "rung-foot" },
    el("a", { className: "btn btn-solid", href: stufeUrl(stufe),
      textContent: stats.started && !stats.complete ? "চালিয়ে যান →" : "এই স্তর খুলুন →" })
  );
  const book = workbookUrl(stufe);
  if (book && stufe.status === "live") {
    const days = dayStats(stufe);
    foot.append(el("a", { className: "btn btn-ghost", href: book,
      textContent: days.done
        ? `খাতা: দিন ${bn(days.next)} →`
        : `${bn(days.total)} দিনের খাতা →` }));
  }
  foot.append(el("span", { className: "mono rung-time",
    textContent: `প্রায় ${bn(stufeMinutes(stufe))} মিনিট পড়া · ${bn(teile.length)}টি পাঠ` }));
  body.append(foot);

  details.append(body);
  return details;
}

function buildLadder() {
  const host = document.getElementById("leiter-list");
  if (!host) return;
  host.textContent = "";
  STUFEN.forEach((stufe) => host.append(stufeRow(stufe)));
}

/* ============================================================
   where you were
   ============================================================ */

function buildResume() {
  const host = document.getElementById("resume");
  if (!host) return;

  const next = nextUp();
  const stufe1 = STUFEN[0];
  const days = dayStats(stufe1);

  /* Nothing read and no day ticked: a first-time visitor should
     see a clean start, not an empty box telling them they have
     done nothing.

     The test is progress itself, not the bookmark. Keying it on
     `last` meant a learner who had read five Teile but whose
     deutsch-last had gone, a half-cleared storage, a second
     device, a key that changed, was shown no way back in at all,
     with a ladder full of ticks right underneath saying otherwise. */
  if (!readSet().size && !days.done) {
    host.hidden = true;
    return;
  }

  /* Two things can be resumed and they are not the same thing:
     the reading and the daily practice. Whichever is further
     behind is the one worth offering, because that is the one
     quietly being skipped, and on a language course it is
     almost always the practice.

     "Further behind" used to be spelled `days.done <= 3`, which
     is not that at all: it meant the card stopped offering
     practice on the fourth day and pointed at reading from then
     on, however far the practice had fallen behind. Compare the
     two percentages instead, which is what the sentence above
     always claimed it did. */
  const practiceBehind =
    days.done < days.total && (!next || days.pct <= overallStats().pct);

  const target = practiceBehind
    ? {
        label: "আজকের অনুশীলন",
        title: `দিন ${bn(days.next)}`,
        where: `${stufe1.kicker} · ৩০ দিনের খাতা`,
        url: `${workbookUrl(stufe1)}#tag-${days.next}`,
        art: "pen",
        pct: days.pct,
      }
    : next
      ? {
          label: "যেখানে ছিলেন",
          title: next.bn,
          where: `${next.stufe.kicker} · ${next.section.bn}`,
          url: next.url,
          art: next.icon ?? next.stufe.icon,
          pct: stufeStats(next.stufe).pct,
        }
      /* Read everything and done all thirty days. There is nothing
         left to resume, so say so rather than pretending there is
         one more thing, and send them back through the book,
         which is the only honest next step until Stufe 2. */
      : {
          label: days.complete ? "Stufe ১ শেষ ✓" : "সব পাঠ পড়া শেষ",
          title: "৩০ দিনের খাতা",
          where: `${stufe1.kicker} · রোজকার অনুশীলন`,
          url: workbookUrl(stufe1),
          art: "pen",
          pct: days.pct,
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
   the two bars at the top
   ============================================================ */

function paintProgress() {
  const line = document.getElementById("deutsch-progress");
  if (!line) return;

  const teile = overallStats();
  const days = dayStats(STUFEN[0]);

  line.querySelector(".track i").style.width = `${teile.pct}%`;
  line.querySelector(".count").textContent =
    `${bn(teile.done)}/${bn(teile.live)} পাঠ পড়া · ${bn(days.done)}/${bn(days.total)} দিন অনুশীলন`;

  const reset = document.getElementById("deutsch-reset");
  if (reset) reset.hidden = teile.done === 0 && days.done === 0;
}

function wireReset() {
  const reset = document.getElementById("deutsch-reset");
  if (!reset) return;
  reset.addEventListener("click", () => {
    if (!confirm("সব টিক আর দিনের হিসাব মুছে যাবে। আপনার লেখা কথাগুলো থাকবে। ঠিক আছে?")) return;
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
