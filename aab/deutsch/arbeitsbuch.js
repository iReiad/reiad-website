/* ============================================================
   arbeitsbuch.js, turns the printed workbook into a daily one.

   One file, three books: thirty days for Stufe 1, sixty for
   Stufe 2, ninety for Stufe 3. Nothing here counts them. The day
   list is read off the page, so a longer book is simply a longer
   page and this file never learns how long.

   The page ships every day as complete static HTML. With
   JavaScript off it is exactly the book it came from: pages you
   scroll, with real <textarea>s you can type into and a browser
   you can print from. Nothing below is required for the page to
   be usable.

   What this adds, in order of how much it matters:

     1. ONE DAY AT A TIME. A whole book on screen at once is a
        wall; it was always meant to be opened at today's page.
        So every other day is hidden and a small nav walks
        between them, with an escape hatch that puts them all
        back, because someone revising, searching with Ctrl+F,
        or printing wants the whole book.

     2. WHAT YOU WROTE IS STILL THERE TOMORROW. Every box is
        keyed and kept in localStorage. This is the difference
        between a worksheet and a workbook: you can look back at
        what you wrote on day 4 and see that you have moved.

     3. THE ANSWERS STAY SHUT until asked for. The book's own
        rule, check ONLY after trying, is a rule the page can
        actually enforce, where paper could only request it.

     4. THE TRACKER. Ticked by hand, never by arriving: the
        promise of the book is that you spoke it out loud, and
        no page can verify that but you.

   Everything is stored on this device only. Nothing is sent
   anywhere, and there is nothing to log in to.
   ============================================================ */

import { findStufe } from "/deutsch/curriculum.js";
import {
  daySet, toggleDay, dayStats, setLastDay, getLastDay, onProgress,
} from "/deutsch/progress.js";

/* Note what is NOT imported: arbeitsbuch.data.js. Every word of
   every day is already in the markup, that is what makes the
   no-JavaScript fallback a real workbook, so pulling the same
   text down a second time as a module would buy nothing but a
   slower page. It would also now mean shipping all three books
   to read one. The day list below is read off the DOM. */

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const hero = document.querySelector(".buch-hero[data-buch]");
const stufe = hero && findStufe(hero.dataset.buch);
const book = document.getElementById("tage");
/* init() is called at the BOTTOM of this file, not here.
   Function declarations hoist; the consts they read do not, so
   calling it from up here threw "Cannot access 'nav' before
   initialization" and took the whole page's scripting with it. */

/* ------------------------------------------------------------
   what the learner typed

   One object, one key, written on a debounce. Typing eight
   sentences fires a hundred input events and localStorage is
   synchronous, writing on every keystroke is how a cheap phone
   starts dropping characters.
   ------------------------------------------------------------ */

const SCHRIFT_KEY = "deutsch-schrift";
let writeTimer = null;

/* Box keys are namespaced by Stufe: "stufe-2/tag-1-tausche-1".
   The first book shipped before there was a second one and wrote
   them bare, as "tag-1-tausche-1", which now means day 1 of every
   book would open showing whatever was written on day 1 of Stufe
   1. Everything bare in storage was written in Stufe 1, because
   for as long as bare keys were written it was the only book, so
   the rename is safe and needs no guesswork.

   This runs once: after the rewrite there are no bare keys left
   to match. It is deliberately not a version flag, because a
   learner with two devices and one old backup would need it to
   run again on the device that has not seen it yet. */
function migrate(schrift) {
  const bare = Object.keys(schrift).filter((k) => /^(tag-|huete-)/.test(k));
  if (!bare.length) return schrift;
  bare.forEach((k) => {
    const moved = `stufe-1/${k}`;
    /* Never overwrite: if this device has already written in the
       namespaced box, that is the newer text and it wins. */
    if (!(moved in schrift)) schrift[moved] = schrift[k];
    delete schrift[k];
  });
  try {
    localStorage.setItem(SCHRIFT_KEY, JSON.stringify(schrift));
  } catch { /* private mode, or full: the text is still on screen */ }
  return schrift;
}

function loadSchrift() {
  try {
    const raw = JSON.parse(localStorage.getItem(SCHRIFT_KEY) || "{}");
    return raw && typeof raw === "object" ? migrate(raw) : {};
  } catch {
    return {};
  }
}

function saveSchrift(schrift) {
  clearTimeout(writeTimer);
  writeTimer = setTimeout(() => {
    try {
      localStorage.setItem(SCHRIFT_KEY, JSON.stringify(schrift));
    } catch {
      /* Quota, or private mode. The text is still on screen and
         still typed into; losing the copy is not worth an alert
         in the middle of a practice session. */
    }
  }, 400);
}

/* A textarea that grows with what is in it, so eight sentences
   read back as eight sentences rather than eight slots.

   The overflow/resize switch matters: the boxes ship as ordinary
   scrollable, resizable textareas so that with scripts off they
   are still usable. Autosizing only works if nothing can scroll
   inside them, so this takes that over the moment it runs, and
   only then. */
function fit(area) {
  if (area.style.overflow !== "hidden") {
    area.style.overflow = "hidden";
    area.style.resize = "none";
  }
  area.style.height = "auto";
  area.style.height = `${area.scrollHeight}px`;
}

function wireWriting() {
  const schrift = loadSchrift();
  const areas = document.querySelectorAll("textarea[data-schrift]");

  areas.forEach((area) => {
    const saved = schrift[area.dataset.schrift];
    if (saved) area.value = saved;
    fit(area);
  });

  book.addEventListener("input", onInput);
  document.querySelector(".hut-sammlung")?.addEventListener("input", onInput);

  function onInput(e) {
    const area = e.target.closest("textarea[data-schrift]");
    if (!area) return;
    fit(area);
    const value = area.value;
    if (value) schrift[area.dataset.schrift] = value;
    else delete schrift[area.dataset.schrift];
    saveSchrift(schrift);
  }
}

/* ------------------------------------------------------------
   one day at a time
   ------------------------------------------------------------ */

const articles = [...book.querySelectorAll(".buch-tag[data-tag]")];

/** { n, title } for every day, read off the page itself. */
const days = articles.map((a) => ({
  n: Number(a.dataset.tag),
  title: a.querySelector(".tag-kopf h2")?.textContent.trim() ?? "",
}));

const FIRST = days.length ? days[0].n : 1;
const LAST = days.length ? days[days.length - 1].n : 1;
let current = FIRST;
let showAll = false;

function clamp(n) {
  return Math.min(LAST, Math.max(FIRST, Number(n) || FIRST));
}

function show(n, { scroll = false, writeHash = true } = {}) {
  current = clamp(n);
  if (!showAll) {
    articles.forEach((a) => {
      a.hidden = Number(a.dataset.tag) !== current;
    });
  }
  setLastDay(current);
  paintNav();
  paintTracker();
  /* The hash is the shareable, bookmarkable address of a day.
     replaceState rather than location.hash so walking through
     the book does not fill the back button with thirty entries
     the learner then has to press their way out of.

     writeHash is false for the very first paint, and that is not
     a detail: changing the fragment, even through replaceState,
     makes the browser run its scroll-to-fragment step, and with
     the site's `scroll-behavior: smooth` that showed up as the
     page sliding 1,800px down on its own the moment it loaded,
     past the hero and the tracker, for no reason the learner
     could see. The hash starts being written the moment they
     actually turn a page. */
  if (writeHash) history.replaceState(null, "", `#tag-${current}`);
  if (scroll) {
    document.getElementById(`tag-${current}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  /* A textarea sized while hidden measures zero, so a day that
     was never on screen opens with collapsed boxes. */
  document.getElementById(`tag-${current}`)
    ?.querySelectorAll("textarea[data-schrift]").forEach(fit);
}

/* ------------------------------------------------------------
   the walker above the days
   ------------------------------------------------------------ */

const nav = document.querySelector("[data-tag-nav]");

/* Day titles come off the page, and the page is generated from
   arbeitsbuch.data.js, but they are still going back in through
   innerHTML, and a Teil called `a < b` would end the option early.
   Escaping costs one line and removes the question. */
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

function buildNav() {
  if (!nav) return;
  nav.hidden = false;
  nav.innerHTML = `
    <button type="button" class="btn btn-ghost" data-go="prev">← আগের দিন</button>
    <label class="tag-waehler">
      <span class="mono">দিন</span>
      <select aria-label="দিন বেছে নিন">
        ${days.map((d) => `<option value="${d.n}">${bn(d.n)} · ${esc(d.title)}</option>`).join("")}
      </select>
    </label>
    <button type="button" class="btn btn-ghost" data-go="next">পরের দিন →</button>
    <button type="button" class="btn btn-ghost push" data-go="all" aria-pressed="false">সব দিন একসাথে</button>
  `;

  nav.addEventListener("click", (e) => {
    const go = e.target.closest("[data-go]")?.dataset.go;
    if (!go) return;
    if (go === "prev") show(current - 1, { scroll: true });
    if (go === "next") show(current + 1, { scroll: true });
    if (go === "all") toggleAll();
  });

  nav.querySelector("select").addEventListener("change", (e) => {
    show(e.target.value, { scroll: true });
  });
}

function toggleAll() {
  showAll = !showAll;
  const button = nav?.querySelector('[data-go="all"]');
  if (button) {
    button.setAttribute("aria-pressed", String(showAll));
    button.textContent = showAll ? "একটা করে দেখুন" : "সব দিন একসাথে";
  }
  if (showAll) {
    articles.forEach((a) => {
      a.hidden = false;
      a.querySelectorAll("textarea[data-schrift]").forEach(fit);
    });
    /* Without this the tracker keeps one square ringed as "the day
       you are on" while all thirty are on screen, a highlight
       pointing at nothing in particular. */
    paintTracker();
  } else {
    show(current);
  }
}

function paintNav() {
  if (!nav) return;
  nav.querySelector('[data-go="prev"]').disabled = current === FIRST;
  nav.querySelector('[data-go="next"]').disabled = current === LAST;
  const select = nav.querySelector("select");
  if (select) select.value = String(current);
}

/* ------------------------------------------------------------
   the tracker, the bar, and the day's own tick
   ------------------------------------------------------------ */

function paintTracker() {
  const done = daySet();
  document.querySelectorAll("[data-tracker]").forEach((chip) => {
    const n = Number(chip.dataset.tracker);
    chip.toggleAttribute("data-done", done.has(`${stufe.slug}/tag-${n}`));
    chip.toggleAttribute("data-current", n === current && !showAll);
  });

  const stats = dayStats(stufe);
  const bar = document.querySelector("[data-buch-fortschritt]");
  if (bar) {
    bar.querySelector(".track i").style.width = `${stats.pct}%`;
    bar.querySelector(".count").textContent = stats.done === 0
      ? `${bn(stats.total)} দিন, এখনো শুরু হয়নি`
      : stats.complete
        ? `${bn(stats.total)} দিনই শেষ ✓, এবার Tag ${bn(stats.total + 1)}`
        : `${bn(stats.done)}/${bn(stats.total)} দিন হয়েছে`;
    bar.dataset.state = stats.complete ? "done" : stats.done ? "going" : "new";
  }

  const heute = document.querySelector("[data-buch-heute]");
  if (heute) {
    heute.setAttribute("href", `#tag-${stats.next}`);
    heute.textContent = stats.done === 0
      ? "দিন ১ থেকে শুরু করুন →"
      : stats.complete
        ? "খাতাটা আরেকবার দেখুন →"
        : `আজকের পাতা: দিন ${bn(stats.next)} →`;
  }

  document.querySelectorAll("[data-fertig]").forEach((button) => {
    const n = Number(button.dataset.fertig);
    const isDone = done.has(`${stufe.slug}/tag-${n}`);
    button.textContent = isDone ? "✓ এই দিনটা হয়েছে" : "আজকের পাতা শেষ ✓";
    button.classList.toggle("btn-solid", !isDone);
    button.classList.toggle("btn-ghost", isDone);
    button.setAttribute("aria-pressed", String(isDone));
  });
}

function wireTicks() {
  book.addEventListener("click", (e) => {
    const fertig = e.target.closest("[data-fertig]");
    if (fertig) {
      const n = Number(fertig.dataset.fertig);
      const nowDone = toggleDay(stufe, n);
      paintTracker();
      /* Ticking a day off and being left staring at the same
         page is an odd place to end an evening. Move on, but
         only forwards, and only when the tick went on. */
      if (nowDone && n === current && n < LAST) {
        setTimeout(() => show(n + 1, { scroll: true }), 450);
      }
      return;
    }

    const antwort = e.target.closest("[data-antwort]");
    if (antwort) {
      const article = antwort.closest(".buch-tag");
      const open = article.toggleAttribute("data-antworten");
      antwort.setAttribute("aria-expanded", String(open));
      antwort.textContent = open ? "উত্তর লুকান" : "উত্তর দেখুন";
    }
  });

  document.querySelector(".tracker")?.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-tracker]");
    if (!chip) return;
    e.preventDefault();
    if (showAll) toggleAll();
    show(chip.dataset.tracker, { scroll: true });
  });
}

/* ------------------------------------------------------------
   which day to open with

   A hash wins, because it is an address someone chose. Failing
   that, the day they were last on: the book should open where
   they left it, the way a real one falls open at the bookmark.
   Failing that, day one.
   ------------------------------------------------------------ */

function openingDay() {
  const fromHash = /^#tag-(\d+)$/.exec(location.hash)?.[1];
  if (fromHash) return { day: clamp(fromHash), fromHash: true };
  const last = getLastDay();
  if (last) return { day: clamp(last), fromHash: false };
  return { day: FIRST, fromHash: false };
}

function init() {
  wireWriting();
  buildNav();
  wireTicks();

  /* Arriving at /…/arbeitsbuch.html#tag-9 the browser scrolls to
     day 9 while all thirty are still in the page. A moment later
     twenty-nine of them are hidden, the document collapses to a
     fraction of its height, and that scroll position now points
     at something else entirely. So when the day came from the
     URL, put the learner back on it after the collapse. */
  const opening = openingDay();
  show(opening.day, { writeHash: false, scroll: opening.fromHash });

  addEventListener("hashchange", () => {
    const n = /^#tag-(\d+)$/.exec(location.hash)?.[1];
    if (n) show(n, { scroll: true });
  });

  /* The tracker and the bar are drawn from the same numbers in
     three places. Rather than have each poll, anything that
     writes fires one event and everything repaints, including
     a second tab left open on the same book. */
  onProgress(paintTracker);
}

if (stufe && book) init();
