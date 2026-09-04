/* checkpoints.ts: the ticks INSIDE a lesson, as against the one
   tick on it. It invents no markup: `.checklist` is already an
   article block in `@layer article` and in both sanitisers, so
   every checklist in a school lesson becomes checkpoints and one
   anywhere else stays a list. A checkpoint is `<lesson id>#<n>`,
   by POSITION rather than text, filed under `<school>-checks` and
   carried by `sync.js`. It never counts towards a ladder. It runs
   after hydration, loaded through `next/components/scripts.tsx`. */
/* The storage key prefix each school files its ticks under. Not
   the school's own name, and `learn` is the reason: the money
   school moved to /money/ in August 2026 and its keys did not
   move with it, because a key is a string in real browsers and in
   real accounts rather than an identifier. CLAUDE.md, "What a
   reader has read". */
const PREFIX = {
    money: "learn",
    deutsch: "deutsch",
    english: "english",
    quran: "quran",
};
/** Which school a lesson page belongs to. The route writes it
    onto the article; the four generated practice books do not
    have checklists and are not lessons, so they need nothing. */
const schoolOf = (article) => article.getAttribute("data-school") ?? "";
/** The lesson's own id, under whichever attribute its school
    spells it. Four names for one thing, and they are four because
    each school's pages have carried its own since long before
    there was a route rendering them. */
const ID_ATTRS = ["data-lesson-id", "data-teil-id", "data-part-id"];
const idOf = (article) => {
    for (const attr of ID_ATTRS) {
        const value = article.getAttribute(attr);
        if (value)
            return value;
    }
    return "";
};
/* ============================================================
   Storage, wrapped the way every other progress store here is
   ============================================================ */
const load = (key) => {
    try {
        const raw = JSON.parse(localStorage.getItem(key) || "[]");
        return new Set(Array.isArray(raw) ? raw : []);
    }
    catch {
        return new Set(); // private mode, or somebody else's data
    }
};
const store = (key, set, event) => {
    try {
        localStorage.setItem(key, JSON.stringify([...set]));
    }
    catch {
        /* Private mode. The tick still shows for this page: what is
           lost is remembering it, and that is not worth an error. */
    }
    dispatchEvent(new CustomEvent(event));
};
/* ============================================================
   The public half, which the account page reads
   ============================================================ */
/** Every checkpoint ticked in one school. */
export function checkpointsOf(school) {
    const prefix = PREFIX[school];
    return prefix ? load(`${prefix}-checks`) : new Set();
}
export function checkpointStats(school) {
    const done = checkpointsOf(school);
    const lessons = new Set([...done].map((id) => id.split("#")[0]));
    return { done: done.size, lessons: lessons.size };
}
/* ============================================================
   The page half
   ============================================================ */
/**
 * Turn every checklist item in this lesson into a checkpoint: a
 * button wrapping what was there, rather than a checkbox, which
 * cannot carry the tick the stylesheet already draws for
 * `.checklist li`. `aria-pressed` says the state out loud;
 * `data-done` is what the stylesheet answers.
 */
function wire(article, school, lessonId) {
    const prefix = PREFIX[school];
    if (!prefix)
        return 0;
    const key = `${prefix}-checks`;
    const event = `${school === "money" ? "learn" : school}:progress`;
    const items = article.querySelectorAll(".checklist > li");
    if (!items.length)
        return 0;
    let done = load(key);
    /* One counter above the list, so a reader who has come back to
       a lesson can see at a glance what is left without reading
       five lines to find out. */
    const painters = [];
    items.forEach((li, n) => {
        const id = `${lessonId}#${n}`;
        /* The item's own content moves inside the button, so the
           whole line is the target: a tick mark you have to hit
           exactly is a tick mark nobody uses on a phone. */
        const button = document.createElement("button");
        button.type = "button";
        button.className = "checkpoint";
        button.setAttribute("aria-pressed", String(done.has(id)));
        while (li.firstChild)
            button.append(li.firstChild);
        li.append(button);
        li.classList.add("has-checkpoint");
        const paint = () => {
            const on = done.has(id);
            li.toggleAttribute("data-done", on);
            button.setAttribute("aria-pressed", String(on));
        };
        paint();
        painters.push(paint);
        button.addEventListener("click", () => {
            done = load(key); // another tab, or a sync
            if (!done.delete(id))
                done.add(id);
            store(key, done, event);
            painters.forEach((f) => f());
            count();
        });
    });
    const tally = document.createElement("p");
    tally.className = "checkpoint-count mono";
    items[0].parentElement?.before(tally);
    function count() {
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
export function initCheckpoints(root = document) {
    const article = root.querySelector("article[data-school]");
    if (!article || article.hasAttribute("data-soon"))
        return 0;
    const school = schoolOf(article);
    const lessonId = idOf(article);
    if (!school || !lessonId)
        return 0;
    return wire(article, school, lessonId);
}
/* Runs on import, because a lesson page loads this module for no
   other reason. It is a no-op anywhere else, including on the
   account page, which imports `checkpointStats` out of this file
   and has no `article[data-school]` on it to find. */
initCheckpoints();
