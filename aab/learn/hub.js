/* ============================================================
   hub.js — everything live on /learn/.

   The page is already complete before this file runs: the eight
   starter steps are written into the HTML, the glossary sections
   exist, and every link works. What this adds is the reader's own
   position in it —

     1. icons dropped into their slots
     2. the starter steps: ticks, "step done", auto-advance
     3. the ladder, built from curriculum.js
     4. the full contents index, same source
     5. the resume card, and the scroll to where they were
     6. the overall progress line
     7. the filter box, across all of the above
     8. the A–Z glossary of stage-1 terms

   Everything reads from /learn/curriculum.js and writes through
   /learn/progress.js, so there is exactly one place to change a
   stage's name and exactly one place that touches storage.
   ============================================================ */

import {
  STAGES, findStage, stageLessons, allLessons, stageUrl,
  stageMinutes,
} from "/learn/curriculum.js";
import {
  readSet, markRead, stageStats, overallStats, stageState,
  nextUp, currentStage, getLast, setLast, resetAll, onProgress,
} from "/learn/progress.js";
import { icon, iconEl } from "/learn/icons.js";

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter((k) => k !== null && k !== undefined && k !== false));
  return node;
};

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

/* ============================================================
   1. ICONS — fill every [data-icon] slot
   ============================================================ */
function paintIcons(root = document) {
  root.querySelectorAll("[data-icon]:empty").forEach((slot) => {
    const art = iconEl(slot.dataset.icon);
    if (art) slot.append(art);
  });
}

/* ============================================================
   2. THE STARTER STEPS
   ============================================================ */
const steps = [...document.querySelectorAll(".step[data-lesson-id]")];

function stepFooters() {
  steps.forEach((step, i) => {
    const body = step.querySelector(".step-body");
    if (!body || body.querySelector(".step-foot")) return;

    const next = steps[i + 1];

    const done = el("button", {
      type: "button",
      className: "btn btn-solid step-done",
      textContent: "এই ধাপ শেষ ✓",
    });
    done.addEventListener("click", () => {
      markRead(step.dataset.lessonId);
      if (next) openStep(next, { scroll: true });
      else step.open = false;
    });

    const skip = next
      ? el("button", {
          type: "button",
          className: "btn btn-ghost step-skip",
          textContent: "পরের ধাপ →",
        })
      : null;
    skip?.addEventListener("click", () => openStep(next, { scroll: true }));

    body.append(el("div", { className: "step-foot" }, done, skip));
  });
}

/** Open one step, close the rest, and bring it into view.
    Only one step open at a time: eight open accordions is a wall
    of text, and the reader loses the sense of a sequence. */
function openStep(step, { scroll = false } = {}) {
  steps.forEach((s) => { s.open = s === step; });
  if (scroll) {
    // let the browser finish the open animation before measuring
    requestAnimationFrame(() =>
      step.scrollIntoView({ behavior: prefersReduce() ? "auto" : "smooth", block: "start" })
    );
  }
}

const prefersReduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

function wireSteps() {
  steps.forEach((step) => {
    step.addEventListener("toggle", () => {
      if (!step.open) return;
      // opening a step is reading it, the same rule term pages use
      markRead(step.dataset.lessonId);
      setLast({
        id: step.dataset.lessonId,
        stage: "start",
        url: `/learn/index.html#${step.id}`,
        bn: step.querySelector(".step-title")?.textContent.trim() ?? "",
      });
      // keep the others shut without fighting the user's click
      steps.forEach((s) => { if (s !== step) s.open = false; });
    });
  });
}

function paintSteps() {
  const read = readSet();
  let firstUnread = null;
  steps.forEach((step) => {
    const done = read.has(step.dataset.lessonId);
    step.toggleAttribute("data-read", done);
    if (!done && !firstUnread) firstUnread = step;
  });

  const count = document.getElementById("starter-count");
  if (count) {
    const done = steps.filter((s) => read.has(s.dataset.lessonId)).length;
    count.textContent =
      done === 0
        ? `${bn(steps.length)}টি ধাপ · এখনো শুরু হয়নি`
        : done === steps.length
          ? `হাতেখড়ি শেষ ✓ ${bn(done)}/${bn(steps.length)}`
          : `${bn(done)}/${bn(steps.length)} ধাপ শেষ · পরেরটা: ${firstUnread?.querySelector(".step-title")?.textContent.trim() ?? ""}`;
  }
}

/* ============================================================
   3. THE LADDER
   ============================================================ */

/** A little ring showing a stage's progress. SVG rather than a
    bar because at this size a ring reads as "how far round" at a
    glance, and it survives being 34px on a phone. */
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

function stageRow(stage) {
  const stats = stageStats(stage);
  const state = stageState(stage);
  const lessons = stageLessons(stage);
  const isStarter = Boolean(stage.inline);
  const href = isStarter ? "#starter" : stageUrl(stage);

  const details = el("details", { className: "rung" });
  details.dataset.state = state;
  details.dataset.stage = stage.slug;
  if (stage.status === "soon") details.dataset.soon = "1";
  // the stage they're on opens itself; the rest stay shut
  details.open = state === "now";

  const summary = el("summary");
  summary.append(
    el("span", { className: "rung-art", innerHTML: icon(stage.icon) }),
    el("span", { className: "rung-head" },
      el("span", { className: "rung-kicker mono", textContent: stage.kicker }),
      el("span", { className: "rung-title bn-h", textContent: stage.bn },
        el("span", { className: "en-sub", textContent: stage.en })),
      el("span", { className: "rung-who", textContent: stage.who })
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
  body.append(el("p", { className: "rung-blurb", textContent: stage.blurb }));

  if (stage.status === "soon") {
    body.append(el("p", { className: "rung-soon mono",
      textContent: "এই ধাপের লেখাগুলো এখনো তৈরি হচ্ছে — কাঠামোটা দেখে নিতে পারেন।" }));
  }

  // the sections inside, with their lessons
  const read = readSet();
  stage.sections.forEach((section) => {
    const list = el("ul", { className: "rung-lessons" });
    section.lessons.forEach((raw) => {
      const lesson = lessons.find(
        (l) => l.slug === raw.slug && l.section.id === section.id
      );
      const li = el("li");
      if (read.has(lesson.id)) li.dataset.read = "1";
      if (lesson.status !== "live") li.dataset.soon = "1";
      li.append(
        el("a", {
          href: lesson.url,
          className: isStarter ? "step-jump" : "",
          textContent: lesson.bn,
        }),
        el("span", { className: "rung-lesson-min mono",
          textContent: lesson.status === "live" ? `${bn(lesson.minutes)} মি` : "আসছে" })
      );
      list.append(li);
    });
    body.append(
      el("div", { className: "rung-section" },
        el("h4", { className: "mono", textContent: `${section.bn} · ${section.en}` }),
        list)
    );
  });

  body.append(
    el("div", { className: "rung-foot" },
      el("a", { className: "btn btn-solid", href,
        textContent: stats.started && !stats.complete ? "চালিয়ে যান →" : "এই ধাপ খুলুন →" }),
      el("span", { className: "mono rung-time",
        textContent: `প্রায় ${bn(stageMinutes(stage))} মিনিট · ${bn(lessons.length)}টি লেখা` })
    )
  );

  details.append(body);
  return details;
}

function buildLadder() {
  const host = document.getElementById("ladder-list");
  if (!host) return;
  host.replaceChildren(...STAGES.map(stageRow));
}

/* ============================================================
   4. FULL CONTENTS INDEX
   ============================================================ */
function buildContents() {
  const host = document.getElementById("contents-index");
  if (!host) return;
  const read = readSet();

  host.replaceChildren(
    ...STAGES.map((stage) => {
      const rows = stageLessons(stage).map((lesson) => {
        const row = el("li", { className: "contents-row" });
        if (read.has(lesson.id)) row.dataset.read = "1";
        if (lesson.status !== "live") row.dataset.soon = "1";
        row.append(
          el("a", { href: lesson.url, className: "bn-h", textContent: lesson.bn }),
          el("span", { className: "contents-en", textContent: lesson.en }),
          el("span", { className: "contents-sec mono", textContent: lesson.section.bn })
        );
        return row;
      });

      return el("div", { className: "contents-stage" },
        el("h3", { className: "bn-h" },
          el("span", { className: "contents-art", innerHTML: icon(stage.icon) }),
          document.createTextNode(`${stage.kicker} · ${stage.bn}`)),
        el("ul", { className: "contents-list" }, ...rows)
      );
    })
  );
}

/* ============================================================
   5. THE RESUME CARD, AND THE SCROLL
   ============================================================ */
function buildResume() {
  const host = document.getElementById("resume");
  if (!host) return null;

  const last = getLast();
  const stats = overallStats();

  // Nothing read yet: no card. A first visit should look like a
  // clean start, not like a system with an empty slot in it.
  if (!last && stats.done === 0) {
    host.hidden = true;
    return null;
  }

  /* "Where you were" has to mean the stage they were actually in,
     not the earliest gap in the whole ladder. A reader who dipped
     into stage 2 and then came back should be offered the next
     lesson OF STAGE 2 — being sent back to an unread starter step
     reads as though the site lost their place. Only when their own
     stage is finished do we fall through to the global next. */
  const lastStage = findStage(last?.stage);
  const read = readSet();
  const inStage = lastStage
    ? stageLessons(lastStage).find((l) => l.status === "live" && !read.has(l.id))
    : null;

  const target =
    inStage ??
    nextUp() ??
    (last ? { url: last.url, bn: last.bn, stage: last.stage } : null);
  if (!target) { host.hidden = true; return null; }

  // the card names one stage, and it is the target's own
  const stage = findStage(target.stage?.slug ?? target.stage) ?? lastStage ?? currentStage();

  host.hidden = false;
  host.className = "resume";
  host.replaceChildren(
    el("span", { className: "resume-art", innerHTML: icon(stage?.icon ?? "seed") }),
    el("div", { className: "resume-text" },
      el("span", { className: "mono resume-label",
        textContent: stats.complete ? "সব পড়া শেষ" : "যেখানে ছিলেন সেখান থেকে" }),
      el("strong", { className: "bn-h", textContent: target.bn || "পরের লেখা" }),
      el("span", { className: "resume-where",
        textContent: stage ? `${stage.kicker} · ${stage.bn}` : "" })
    ),
    el("div", { className: "resume-actions" },
      el("a", { className: "btn btn-solid", href: target.url,
        textContent: stats.complete ? "আবার দেখুন →" : "পড়া চালিয়ে যান →" }),
      el("span", { className: "mono resume-pct",
        textContent: `${bn(stats.pct)}% শেষ` })
    )
  );
  return stage;
}

/** Bring a returning reader down to the stage they're on.

    Deliberately a scroll and not a redirect: the map is the point
    of this page, and someone who tapped "Learn" may well have
    wanted to browse rather than resume. They get both — the whole
    ladder above them, their own place under the cursor. */
function scrollToPlace(stage) {
  if (location.hash) return;              // an explicit anchor wins
  if (!stage) return;
  if (!getLast()) return;                 // first-timers stay at the top

  const target =
    stage.inline
      ? document.querySelector(".step:not([data-read])") ?? document.getElementById("starter")
      : document.querySelector(`.rung[data-stage="${stage.slug}"]`);
  if (!target) return;

  requestAnimationFrame(() => {
    target.scrollIntoView({
      behavior: prefersReduce() ? "auto" : "smooth",
      block: "center",
    });
  });
}

/* ============================================================
   6. OVERALL PROGRESS LINE
   ============================================================ */
function paintProgress() {
  const line = document.getElementById("learn-progress");
  if (!line) return;
  const stats = overallStats();
  line.querySelector(".track i").style.width = `${stats.pct}%`;
  line.querySelector(".count").textContent =
    stats.done === 0
      ? `${bn(stats.live)}টি লেখা — শুরু করুন হাতেখড়ি দিয়ে`
      : stats.complete
        ? `সবগুলো পড়া শেষ — ${bn(stats.done)}/${bn(stats.live)} ✓`
        : `${bn(stats.done)}/${bn(stats.live)} পড়া হয়েছে`;

  const reset = document.getElementById("learn-reset");
  if (reset) reset.hidden = stats.done === 0;
}

document.getElementById("learn-reset")?.addEventListener("click", () => {
  if (!confirm("আপনার পড়ার সব টিক চিহ্ন মুছে যাবে। নিশ্চিত?")) return;
  resetAll();
});

/* ============================================================
   7. THE FILTER BOX
   Searches the steps, the ladder, the contents index and the
   glossary at once, and says how many it found. Sections marked
   .no-filter (the doors, the FAQ) are never hidden — hiding the
   help while someone is searching is the wrong way round.
   ============================================================ */
function initFilter() {
  const input = document.getElementById("term-filter");
  const readout = document.getElementById("filter-count");
  if (!input) return;

  const groups = [
    { items: () => document.querySelectorAll(".step"), container: "#steps" },
    { items: () => document.querySelectorAll(".rung"), container: "#ladder-list" },
    { items: () => document.querySelectorAll(".contents-row"), container: null },
    { items: () => document.querySelectorAll(".g-row"), container: null },
  ];

  const run = () => {
    const q = input.value.trim().toLowerCase();
    let hits = 0;

    groups.forEach((group) => {
      group.items().forEach((item) => {
        const match = !q || item.textContent.toLowerCase().includes(q);
        item.hidden = !match;
        if (match && q) hits++;
      });
    });

    // an empty stage block in the contents index shouldn't leave
    // its heading floating on its own
    document.querySelectorAll(".contents-stage").forEach((block) => {
      block.hidden = q
        ? ![...block.querySelectorAll(".contents-row")].some((r) => !r.hidden)
        : false;
    });

    document.querySelectorAll("section:not(.no-filter)").forEach((section) => {
      if (!q) { section.hidden = false; return; }
      const holders = section.querySelectorAll(
        ".step, .rung, .contents-row, .g-row"
      );
      section.hidden = holders.length > 0 && ![...holders].some((h) => !h.hidden);
    });

    if (readout) {
      readout.hidden = !q;
      readout.textContent = q
        ? hits
          ? `${bn(hits)}টি মিল পাওয়া গেছে`
          : "কিছু পাওয়া যায়নি — অন্য শব্দে চেষ্টা করুন"
        : "";
    }
  };

  input.addEventListener("input", run);
}

/* ============================================================
   8. A–Z GLOSSARY (stage 1's eighteen terms)
   ============================================================ */
function buildGlossary() {
  const host = document.getElementById("glossary");
  const az = document.getElementById("az");
  if (!host) return;

  const stage = findStage("basics-1");
  if (!stage) return;
  const terms = stageLessons(stage);
  const read = readSet();

  const sorted = [...terms].sort((a, b) => a.en.localeCompare(b.en));
  const letters = new Map();
  sorted.forEach((t) => {
    const letter = t.en[0].toUpperCase();
    if (!letters.has(letter)) letters.set(letter, []);
    letters.get(letter).push(t);
  });

  if (az) {
    az.replaceChildren(
      ...[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) =>
        letters.has(letter)
          ? el("a", { href: `#az-${letter}`, textContent: letter })
          : el("span", { textContent: letter })
      )
    );
  }

  const rows = [];
  for (const [letter, group] of letters) {
    rows.push(el("div", {
      className: "section-label mono", id: `az-${letter}`,
      textContent: letter,
      style: "margin:22px 0 6px;border:0;padding:0",
    }));
    group.forEach((t) => {
      const row = el("div", { className: "g-row" });
      if (read.has(t.id)) row.dataset.read = "1";
      row.append(
        el("a", { className: "term bn-h", href: t.url, textContent: t.bn }),
        el("span", { className: "en", textContent: `${t.en} — ${t.section.en}` })
      );
      rows.push(row);
    });
  }
  host.replaceChildren(...rows);
}

/* ============================================================
   go
   ============================================================ */
let placeOnFirstPaint = null;

function repaint() {
  paintSteps();
  buildLadder();
  buildContents();
  buildGlossary();
  paintProgress();
  placeOnFirstPaint = buildResume() ?? currentStage();
  paintIcons();
}

paintIcons();
stepFooters();
wireSteps();
initFilter();
repaint();

// The first paint decides where to send them. Later repaints — a tick
// landing, a step opening — must never scroll the page again: moving
// the ground under someone's finger is how you lose them.
scrollToPlace(placeOnFirstPaint);

onProgress(repaint);

/* Clicking a starter step in the ladder should open that step here
   rather than jumping to a bare anchor with everything collapsed. */
document.addEventListener("click", (e) => {
  const jump = e.target.closest("a.step-jump");
  if (!jump) return;
  const id = new URL(jump.href, location.origin).hash.slice(1);
  const step = id && document.getElementById(id);
  if (!step) return;
  e.preventDefault();
  openStep(step, { scroll: true });
});

/* Arriving with #step-… in the URL (a shared link, or the "next
   step" button on a stage page) should open that step. */
function openFromHash() {
  const id = location.hash.slice(1);
  if (!id.startsWith("step-")) return;
  const step = document.getElementById(id);
  if (step) openStep(step, { scroll: true });
}
openFromHash();
addEventListener("hashchange", openFromHash);
