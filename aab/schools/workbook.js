/* ============================================================
   schools/workbook.js: a practice book, made daily.

   The German book and the English book were 388 lines each and
   the diff between them was nouns. `schools/progress.js` and
   `schools/hub.js` already made that argument for the three
   schools' ladders; this is the same argument for their books.

   ---- what was actually wrong ----

   Two things, and the second is worse than the first.

   The English module keyed on a vocabulary the page does not
   have. It looked for `.wb-day`, `[data-wb-write]`,
   `[data-wb-done]`, `[data-wb-today]`; `components/workbook.tsx`
   renders both books with the German one, `.buch-tag`,
   `data-schrift`, `data-fertig`. So on the English book nothing
   saved, nothing revealed an answer and nothing ticked.

   And the German module did not run at all. Both files open with

       const book = document.getElementById("tage");
       ...
       const articles = [...book.querySelectorAll(".buch-tag[data-tag]")];

   at the top level, and the route that replaced the generated
   page has no element with that id. `book` was null, the second
   line threw, and the module died before its first function ran.
   Both books rendered perfectly and neither did anything: no
   writing kept, no day at a time, no answers, no ticks.

   That is the failure `CLAUDE.md` opens on. A port is finished
   when it does what the thing it replaced did, and these two
   looked finished from the outside for as long as nobody typed
   in a box and came back.

   ---- what a school passes in ----

   The DOM vocabulary is FIXED, because one component renders
   both books. What differs is a storage key, a curriculum, and
   two words. `aab/schools/workbook.test.ts` asserts the keys by
   name: `deutsch-schrift` and `english-write` are in real
   browsers, and the rule at the top of "What a reader has read"
   is why renaming one loses somebody's work rather than moving
   it.
   ============================================================ */

/** Bangla numerals, so a counter is not half in one script.

    Built from code points rather than typed, for the reason
    `shared/schools.ts` gives at length: a port of the same
    function retyped the literal and produced the DEVANAGARI
    digits, which look close enough in a diff to survive review
    and put every number on a Bangla page into the wrong script. */
const BN_DIGITS = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");
const bn = (n) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

/** Day titles go back in through innerHTML, and a Teil called
    `a < b` would end its own option early. */
const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/**
 * @param {object} school
 * @param {string} school.writeKey    localStorage key for what was typed.
 *   Spelled the way it has always been spelled: see the note above.
 * @param {(slug: string) => object} school.findStage  the school's own
 *   curriculum lookup, `findStufe` or `findTerm`.
 * @param {object} school.progress    the school's `progress.js`.
 * @param {(stage: object, n: number) => string} school.dayId  what a
 *   day's tick is FILED UNDER, from the school's own
 *   `curriculum.js`. Not built here, and that is the whole reason
 *   it is an argument: English files a day as `term-1/day-3` and
 *   German as `stufe-1/tag-3`, both are in real browsers, and
 *   this file built the German shape for both. The English ticks
 *   were written correctly by `toggleDay` and then looked for
 *   under a name nothing had ever used, so a day could be ticked
 *   and came back unticked. `workbook.test.ts` is what found
 *   that, and it is the rule at the top of "Three schools, one
 *   engine": every key is passed in by the school, spelled the
 *   way it has always been spelled.
 * @param {(schrift: object) => object} [school.migrate]  a one-off
 *   rename of storage keys. The German school has one; a school
 *   that shipped namespaced from the start does not.
 * @param {string} [school.allDoneWord]  the word before the day
 *   number in "all done, now day N". German says "Tag".
 */
export function initWorkbook(school) {
  const {
    writeKey, findStage, progress, dayId, migrate, allDoneWord = "দিন",
  } = school;
  const {
    daySet, toggleDay, dayStats, setLastDay, getLastDay, onProgress,
  } = progress;

  const hero = document.querySelector(".buch-hero[data-buch]");
  const book = document.getElementById("tage");
  const stage = hero && findStage(hero.dataset.buch);

  /* Nothing to do, and saying so beats throwing. A page that is
     not a practice book loads this module through no fault of
     its own the day somebody adds it to a shared script list. */
  if (!hero || !book || !stage) return;

  /* ---------- what the learner typed ----------

     One object, one key, written on a debounce: typing eight
     sentences fires a hundred input events, and localStorage is
     synchronous, so writing on every keystroke is how a cheap
     phone starts dropping characters. */
  let writeTimer = null;

  function loadWriting() {
    try {
      const raw = JSON.parse(localStorage.getItem(writeKey) || "{}");
      if (!raw || typeof raw !== "object") return {};
      return migrate ? migrate(raw, writeKey) : raw;
    } catch {
      return {};
    }
  }

  function saveWriting(written) {
    clearTimeout(writeTimer);
    writeTimer = setTimeout(() => {
      try {
        localStorage.setItem(writeKey, JSON.stringify(written));
      } catch {
        /* Quota, or private mode. The text is still on screen and
           still typed into; losing the copy is not worth an alert
           in the middle of a practice session. */
      }
    }, 400);
  }

  /* A textarea that grows with what is in it, so eight sentences
     read back as eight sentences rather than eight slots.

     The overflow/resize switch matters: the boxes ship as
     ordinary scrollable, resizable textareas so that with scripts
     off they are still usable. Autosizing only works if nothing
     can scroll inside them, so this takes that over the moment it
     runs, and only then. */
  function fit(area) {
    if (area.style.overflow !== "hidden") {
      area.style.overflow = "hidden";
      area.style.resize = "none";
    }
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`;
  }

  function wireWriting() {
    const written = loadWriting();

    document.querySelectorAll("textarea[data-schrift]").forEach((area) => {
      const saved = written[area.dataset.schrift];
      if (saved) area.value = saved;
      fit(area);
    });

    const onInput = (e) => {
      const area = e.target.closest("textarea[data-schrift]");
      if (!area) return;
      fit(area);
      if (area.value) written[area.dataset.schrift] = area.value;
      else delete written[area.dataset.schrift];
      saveWriting(written);
    };

    book.addEventListener("input", onInput);
    document.querySelector(".hut-sammlung")?.addEventListener("input", onInput);
  }

  /* ---------- one day at a time ---------- */

  const articles = [...book.querySelectorAll(".buch-tag[data-tag]")];
  const days = articles.map((a) => ({
    n: Number(a.dataset.tag),
    title: a.querySelector(".tag-kopf h2")?.textContent.trim() ?? "",
  }));

  const FIRST = days.length ? days[0].n : 1;
  const LAST = days.length ? days[days.length - 1].n : 1;
  let current = FIRST;
  let showAll = false;

  const clamp = (n) => Math.min(LAST, Math.max(FIRST, Number(n) || FIRST));

  function show(n, { scroll = false, writeHash = true } = {}) {
    current = clamp(n);
    if (!showAll) {
      articles.forEach((a) => { a.hidden = Number(a.dataset.tag) !== current; });
    }
    setLastDay(current);
    paintNav();
    paintTracker();
    /* replaceState rather than location.hash, so walking through
       the book does not fill the back button with thirty entries
       the learner has to press their way out of.

       `writeHash` is false for the very first paint, and that is
       not a detail: changing the fragment, even through
       replaceState, makes the browser run its scroll-to-fragment
       step, and with this site's `scroll-behavior: smooth` that
       showed up as the page sliding 1,800px down on its own the
       moment it loaded. The hash starts being written the moment
       they actually turn a page. */
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

  /* ---------- the walker above the days ---------- */

  const nav = document.querySelector("[data-tag-nav]");

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
      /* Without this the tracker keeps one square ringed as "the
         day you are on" while all thirty are on screen, a
         highlight pointing at nothing in particular. */
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

  /* ---------- the tracker, the bar, and the day's own tick ---------- */

  function paintTracker() {
    const done = daySet();

    document.querySelectorAll("[data-tracker]").forEach((chip) => {
      const n = Number(chip.dataset.tracker);
      chip.toggleAttribute("data-done", done.has(dayId(stage, n)));
      chip.toggleAttribute("data-current", n === current && !showAll);
    });

    const stats = dayStats(stage);
    const bar = document.querySelector("[data-buch-fortschritt]");
    if (bar) {
      bar.querySelector(".track i").style.width = `${stats.pct}%`;
      bar.querySelector(".count").textContent = stats.done === 0
        ? `${bn(stats.total)} দিন, এখনো শুরু হয়নি`
        : stats.complete
          ? `${bn(stats.total)} দিনই শেষ ✓, এবার ${allDoneWord} ${bn(stats.total + 1)}`
          : `${bn(stats.done)}/${bn(stats.total)} দিন হয়েছে`;
      bar.dataset.state = stats.complete ? "done" : stats.done ? "going" : "new";
    }

    const today = document.querySelector("[data-buch-heute]");
    if (today) {
      today.setAttribute("href", `#tag-${stats.next}`);
      today.textContent = stats.done === 0
        ? "দিন ১ থেকে শুরু করুন →"
        : stats.complete
          ? "খাতাটা আরেকবার দেখুন →"
          : `আজকের পাতা: দিন ${bn(stats.next)} →`;
    }

    document.querySelectorAll("[data-fertig]").forEach((button) => {
      const n = Number(button.dataset.fertig);
      const isDone = done.has(dayId(stage, n));
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
        const nowDone = toggleDay(stage, n);
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

  /* ---------- which day to open with ----------

     A hash wins, because it is an address somebody chose. Failing
     that, the day they were last on: the book should open where
     they left it, the way a real one falls open at the bookmark.
     Failing that, day one. */
  function openingDay() {
    const fromHash = /^#tag-(\d+)$/.exec(location.hash)?.[1];
    if (fromHash) return { day: clamp(fromHash), fromHash: true };
    const last = getLastDay();
    if (last) return { day: clamp(last), fromHash: false };
    return { day: FIRST, fromHash: false };
  }

  wireWriting();
  buildNav();
  wireTicks();

  const opening = openingDay();
  show(opening.day, { scroll: opening.fromHash, writeHash: false });

  /* Another device ticked a day off: repaint rather than reload. */
  onProgress?.(() => paintTracker());
}
