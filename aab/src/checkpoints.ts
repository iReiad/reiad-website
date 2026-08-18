/* ============================================================
   checkpoints.ts: the ticks inside a lesson, rather than on it.

   A school lesson already has one tick, and it is about the whole
   page: "I have read this". That is the right unit for a ladder
   and the wrong one for what is actually inside several of these
   lessons, which is a checklist. Open an account at a broker, get
   a BO number, keep six months of statements: five things a
   reader does over a fortnight, in a lesson they will come back
   to four times, and until now the page could not remember which
   three of them were done.

   ---- it invents nothing ----

   `.checklist` is an article block that has existed since the
   Studio was written. It is styled in `@layer article`, allowed
   in `KEEP_CLASSES` in `aab/editor.js` and in `ALLOWED_CLASSES`
   in `functions/_lib/sanitise.ts`, and there are checklists in
   real lessons today. So this adds no class, changes no lesson
   body and asks nothing of whoever writes the next one: every
   checklist in a school lesson becomes a set of checkpoints, and
   a checklist in an article that is not a lesson stays a
   checklist, because there is nothing to file the ticks under.

   ---- what a checkpoint is called ----

     <lesson id>#<n>

   The lesson's own id, which is what its ticks are already filed
   under, and the item's position in the lesson. Position rather
   than text: the text is prose and prose gets edited, and a
   checkpoint that forgets itself because a typo was fixed is
   worse than one that stays put when a line is reworded. The
   trade is the other way round when an item is INSERTED in the
   middle, which shifts everything below it by one, and that is
   the honest cost of not storing a copy of the sentence. It is
   the smaller cost: an insert is rare, a typo is not.

   They are stored under `<school>-checks` and travel with the
   account like every other tick. `aab/sync.js` carries the four
   keys and `next/lib/progress.ts` never sees them: a checkpoint
   is not a lesson and must not count towards a ladder.

   ---- and it runs after hydration ----

   Loaded through `next/components/scripts.tsx` like every other
   module a route loads, for the reason that file is entirely
   about. It rewrites part of a lesson body React has just
   adopted; running before hydration would have React put every
   one of these back.
   ============================================================ */

/* The storage key prefix each school files its ticks under. Not
   the school's own name, and `learn` is the reason: the money
   school moved to /money/ in August 2026 and its keys did not
   move with it, because a key is a string in real browsers and in
   real accounts rather than an identifier. CLAUDE.md, "What a
   reader has read". */
const PREFIX: Record<string, string> = {
  money: "learn",
  deutsch: "deutsch",
  english: "english",
  quran: "quran",
};

/** Which school a lesson page belongs to. The route writes it
    onto the article; the four generated practice books do not
    have checklists and are not lessons, so they need nothing. */
const schoolOf = (article: Element): string => article.getAttribute("data-school") ?? "";

/** The lesson's own id, under whichever attribute its school
    spells it. Four names for one thing, and they are four because
    each school's pages have carried its own since long before
    there was a route rendering them. */
const ID_ATTRS = ["data-lesson-id", "data-teil-id", "data-part-id"];

const idOf = (article: Element): string => {
  for (const attr of ID_ATTRS) {
    const value = article.getAttribute(attr);
    if (value) return value;
  }
  return "";
};

/* ============================================================
   Storage, wrapped the way every other progress store here is
   ============================================================ */

const load = (key: string): Set<string> => {
  try {
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();       // private mode, or somebody else's data
  }
};

const store = (key: string, set: Set<string>, event: string): void => {
  try {
    localStorage.setItem(key, JSON.stringify([...set]));
  } catch {
    /* Private mode. The tick still shows for this page: what is
       lost is remembering it, and that is not worth an error. */
  }
  dispatchEvent(new CustomEvent(event));
};

/* ============================================================
   The public half, which the account page reads
   ============================================================ */

/** Every checkpoint ticked in one school. */
export function checkpointsOf(school: string): Set<string> {
  const prefix = PREFIX[school];
  return prefix ? load(`${prefix}-checks`) : new Set();
}

/** How many checkpoints this school holds ticks for, and in how
    many lessons. The account page says both, because "nine
    checkpoints" and "nine checkpoints across three lessons" are
    different facts and the second is the one worth reading. */
export interface CheckpointStats {
  /** How many checkpoints this school holds ticks for. */
  done: number;
  /** In how many distinct lessons. */
  lessons: number;
}

export function checkpointStats(school: string): CheckpointStats {
  const done = checkpointsOf(school);
  const lessons = new Set([...done].map((id) => id.split("#")[0]));
  return { done: done.size, lessons: lessons.size };
}

/* ============================================================
   The page half
   ============================================================ */

/**
 * Turn every checklist item in this lesson into a checkpoint.
 *
 * The markup an item becomes is a button wrapping what was
 * already there, and it is a button rather than a checkbox
 * because a checkbox inside prose inherits form styling from
 * nowhere in particular and cannot carry the tick mark the
 * stylesheet already draws for `.checklist li`. `aria-pressed`
 * says the state out loud; `data-done` is what the stylesheet
 * answers.
 */
function wire(article: Element, school: string, lessonId: string): number {
  const prefix = PREFIX[school];
  if (!prefix) return 0;

  const key = `${prefix}-checks`;
  const event = `${school === "money" ? "learn" : school}:progress`;
  const items = article.querySelectorAll<HTMLLIElement>(".checklist > li");
  if (!items.length) return 0;

  let done = load(key);

  /* One counter above the list, so a reader who has come back to
     a lesson can see at a glance what is left without reading
     five lines to find out. */
  const painters: Array<() => void> = [];

  items.forEach((li, n) => {
    const id = `${lessonId}#${n}`;

    /* The item's own content moves inside the button, so the
       whole line is the target: a tick mark you have to hit
       exactly is a tick mark nobody uses on a phone. */
    const button = document.createElement("button");
    button.type = "button";
    button.className = "checkpoint";
    button.setAttribute("aria-pressed", String(done.has(id)));
    while (li.firstChild) button.append(li.firstChild);
    li.append(button);
    li.classList.add("has-checkpoint");

    const paint = (): void => {
      const on = done.has(id);
      li.toggleAttribute("data-done", on);
      button.setAttribute("aria-pressed", String(on));
    };
    paint();
    painters.push(paint);

    button.addEventListener("click", () => {
      done = load(key);                     // another tab, or a sync
      if (!done.delete(id)) done.add(id);
      store(key, done, event);
      painters.forEach((f) => f());
      count();
    });
  });

  const tally = document.createElement("p");
  tally.className = "checkpoint-count mono";
  items[0].parentElement?.before(tally);

  function count(): void {
    const n = [...done].filter((id) => id.startsWith(`${lessonId}#`)).length;
    tally.textContent = n
      ? `${n} / ${items.length} done`
      : `${items.length} to do`;
    tally.dataset.state = n === items.length ? "all" : n ? "some" : "none";
  }
  count();

  /* A tick made on the phone, arriving here through sync.js while
     the page is open. The school's own event is the one every
     other progress display on this site already listens to. */
  addEventListener(event, () => {
    done = load(key);
    painters.forEach((f) => f());
    count();
  }, { passive: true });

  return items.length;
}

/** Every lesson on the page, which is one or none. */
export function initCheckpoints(root: ParentNode = document): number {
  const article = root.querySelector("article[data-school]");
  if (!article || article.hasAttribute("data-soon")) return 0;

  const school = schoolOf(article);
  const lessonId = idOf(article);
  if (!school || !lessonId) return 0;

  return wire(article, school, lessonId);
}

/* Runs on import, because a lesson page loads this module for no
   other reason. It is a no-op anywhere else, including on the
   account page, which imports `checkpointStats` out of this file
   and has no `article[data-school]` on it to find. */
initCheckpoints();
