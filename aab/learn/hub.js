/* ============================================================
   hub.js — everything live on /learn/.

   The page is already complete before this file runs: the eight
   starter steps are written into the HTML and every link works.
   What this adds is the reader's own position in it —

     1. icons dropped into their slots
     2. the starter steps: ticks, "step done", auto-advance
     3. the ladder, built from curriculum.js
     4. the resume card, and the scroll to where they were
     5. the overall progress line
     6. the filter box, across the steps and the ladder

   The full contents index and the A–Z glossary used to be built
   here too. They are now static HTML on /learn/contents.html —
   together they were more than half the height of this page.

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

  /* What's inside, as section names and counts — not ninety lesson
     titles. Each stage has a page of its own that lists its lessons
     properly; repeating that here made the hub enormous and gave the
     reader two places to read the same thing. The exception is the
     starter guide, whose "lessons" are the accordion steps further up
     this very page, so those stay clickable. */
  const read = readSet();
  if (isStarter) {
    const list = el("ul", { className: "rung-lessons" });
    lessons.forEach((lesson) => {
      const li = el("li");
      if (read.has(lesson.id)) li.dataset.read = "1";
      li.append(
        el("a", { href: lesson.url, className: "step-jump", textContent: lesson.bn }),
        el("span", { className: "rung-lesson-min mono", textContent: `${bn(lesson.minutes)} মি` })
      );
      list.append(li);
    });
    body.append(el("div", { className: "rung-section" }, list));
  } else {
    const summaryList = el("ul", { className: "rung-sections" });
    stage.sections.forEach((section) => {
      const inSection = lessons.filter((l) => l.section.id === section.id);
      const doneHere = inSection.filter(
        (l) => l.status === "live" && read.has(l.id)
      ).length;
      summaryList.append(
        el("li", {},
          el("span", { className: "rung-section-name", textContent: section.bn }),
          el("span", { className: "rung-section-count mono",
            textContent: `${bn(doneHere)}/${bn(inSection.length)}` })
        )
      );
    });
    body.append(summaryList);
  }

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
    ladder above them, their own place under the cursor.

    Getting this to feel right took more care than it looks. Four
    things had to be handled or it lands in the wrong place:

      · a back/forward navigation already has a scroll position the
        reader expects to be returned to. Overriding it is the
        rudest thing this function could do, so it doesn't.
      · fonts. Bangla webfonts land after first paint and reflow
        everything below them, so a scroll measured before
        document.fonts.ready ends up hundreds of pixels off.
      · block:"center" on a rung taller than the viewport centres
        on the middle of a big box and looks arbitrary. "start"
        with scroll-margin puts the heading where a heading goes.
      · if the target is already on screen there is nothing to fix,
        and moving the page anyway just feels like a twitch. */
function scrollToPlace(stage) {
  if (location.hash) return;              // an explicit anchor wins
  if (!stage) return;
  if (!getLast()) return;                 // first-timers stay at the top

  // the browser is restoring a position from history — leave it alone
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav?.type === "back_forward") return;

  /* Look the target up INSIDE go(), never before it.

     buildLadder() rebuilds the whole ladder with replaceChildren, so
     any rung captured earlier is detached by the time this runs — and
     a detached element reports getBoundingClientRect().top === 0 and
     ignores scrollIntoView entirely. That is what made the scroll
     "sometimes work": it was racing a repaint, and whether it landed
     depended on which of the two won. Re-querying can't lose that
     race, however many times the ladder is rebuilt. */
  const find = () =>
    stage.inline
      ? document.querySelector(".step:not([data-read])") ?? document.getElementById("starter")
      : document.querySelector(`.rung[data-stage="${stage.slug}"]`);

  if (!find()) return;

  const go = () => {
    const target = find();
    if (!target || !target.isConnected) return;
    const box = target.getBoundingClientRect();
    const onScreen = box.top >= 0 && box.top < innerHeight * 0.6;
    if (onScreen) return;
    target.scrollIntoView({
      behavior: prefersReduce() ? "auto" : "smooth",
      block: "start",
    });
  };

  // wait for the webfonts, but never hang on them
  Promise.race([
    document.fonts?.ready ?? Promise.resolve(),
    new Promise((r) => setTimeout(r, 1200)),
  ]).then(() => requestAnimationFrame(go));
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
    { items: () => document.querySelectorAll(".step") },
    { items: () => document.querySelectorAll(".rung") },
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

    document.querySelectorAll("section:not(.no-filter)").forEach((section) => {
      if (!q) { section.hidden = false; return; }
      const holders = section.querySelectorAll(".step, .rung");
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
   go
   ============================================================ */
let placeOnFirstPaint = null;

function repaint() {
  paintSteps();
  buildLadder();
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
