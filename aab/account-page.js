/* ============================================================
   account-page.ts: the one page that is about the reader.

   Everything else on this site is about the writing. This is
   where somebody can see what signing in actually got them, set
   the few things it can act on, take a copy of all of it, and
   leave.

   It is deliberately plain about what is kept. A page that says
   "we value your privacy" and lists nothing is worth less than a
   page that lists every key and a count.

   THE RULE THIS PAGE IS BUILT AROUND

   Nothing is asked for that the site does not then use, and
   nothing is shown that the site cannot measure. Every question
   changes something the reader can point at afterwards:

     the name        appears beside anything they write
     the courses     the home page's band offers them first
     the pace        the last seven days are counted against it
     the preferences change the type on every page, immediately

   A fifth question would be a form. The reason there is no
   birthday, no country and no "how did you hear about us" is that
   nothing on this site would do anything with them.

   EVERY NUMBER COMES OUT OF THE ACCOUNT

   Which is what the rewrite of `aab/sync.js` made true in August
   2026. This page used to open by counting localStorage and then
   apologise in a footnote if the network had not answered,
   because localStorage was a real second copy that might
   disagree. It is a mirror of the account now, written by the
   exchange this page starts before it draws anything.

   The ladders are loaded on demand, four modules and 150 KB of
   them, and that is worth saying out loud rather than hiding: a
   progress bar needs a denominator, the denominator is how many
   lessons a course actually holds, and the only honest source for
   that is the curriculum. It is one page, visited rarely, and the
   import is dynamic, so no other page pays a byte for it.
   ============================================================ */
import { current, signOut, getProfile, saveProfile } from "/account.js";
import { sync, forgetOnAccount, SYNCED_KEYS } from "/sync.js";
import { listScenarios, removeScenario, listTargets, saveTarget, updateTarget, removeTarget, listLibrary, keepPage, removeLibraryRow, } from "/saved.js";
import { checkpointStats } from "/checkpoints.js";
import { COURSES } from "/content.js";
import { activeDays, daysIn, run, today } from "/streak.js";
const $ = (sel) => document.querySelector(sel);
/**
 * An element, its properties, and its children.
 *
 * A key with a hyphen in it is set as an ATTRIBUTE rather than
 * assigned as a property, and that is not a nicety: `aria-label`
 * is not a property name, so `Object.assign(node, {"aria-label":
 * x})` hangs a string off the object and the element ends up with
 * no label at all.
 */
const el = (tag, props = {}, ...kids) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
        if (value === undefined)
            continue;
        if (key.includes("-"))
            node.setAttribute(key, String(value));
        else
            node[key] = value;
    }
    node.append(...kids.filter((k) => k !== null && k !== undefined && k !== false));
    return node;
};
const say = (node, text, state) => {
    if (!node)
        return;
    node.textContent = text ?? "";
    if (state)
        node.dataset.state = state;
    else
        delete node.dataset.state;
};
/** A bar. `role="progressbar"` and a label, because a bar with no
    number in it is a picture of a fact rather than the fact. */
function meter(pct, label) {
    const n = Math.max(0, Math.min(100, Math.round(pct || 0)));
    const bar = el("span", {
        className: "meter", role: "progressbar", "aria-label": label,
        "aria-valuenow": String(n), "aria-valuemin": "0", "aria-valuemax": "100",
    }, el("i", { style: `width:${n}%` }));
    return bar;
}
/** The empty state of a list, said in a sentence rather than
    drawn as a dashed box with a shrug in it. */
const nothing = (text) => el("p", { className: "acct-empty" }, text);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
const when = (iso) => {
    const d = new Date(iso);
    return Number.isNaN(d.valueOf())
        ? ""
        : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
/* ============================================================
   What this account keeps, counted rather than described
   ============================================================ */
const PACES = [
    { id: "daily", label: "Every day", note: "or as near as life allows" },
    { id: "often", label: "Most days", note: "four or five a week" },
    { id: "sometimes", label: "When I can", note: "no particular rhythm" },
];
const PACE_TARGET = { daily: 7, often: 5, sometimes: 0 };
const KEPT = [
    { key: "learn-read", course: "money", one: "lesson read", many: "lessons read" },
    { key: "learn-checks", course: "money", one: "checkpoint ticked", many: "checkpoints ticked" },
    { key: "learn-last", course: "money", single: true },
    { key: "deutsch-read", course: "deutsch", one: "part read", many: "parts read" },
    { key: "deutsch-days", course: "deutsch", one: "practice day done", many: "practice days done" },
    { key: "deutsch-checks", course: "deutsch", one: "checkpoint ticked", many: "checkpoints ticked" },
    { key: "english-read", course: "english", one: "part read", many: "parts read" },
    { key: "english-days", course: "english", one: "practice day done", many: "practice days done" },
    { key: "english-checks", course: "english", one: "checkpoint ticked", many: "checkpoints ticked" },
    { key: "quran-done", course: "quran", one: "day done", many: "days done" },
    { key: "quran-checks", course: "quran", one: "checkpoint ticked", many: "checkpoints ticked" },
];
const readLocal = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? undefined : JSON.parse(raw);
    }
    catch {
        return undefined;
    }
};
function countOf(entry) {
    const value = readLocal(entry.key);
    if (value === undefined || value === null)
        return 0;
    if (entry.single)
        return value.id ? 1 : 0;
    return Array.isArray(value) ? value.length : 0;
}
const startedCourses = () => new Set(KEPT.filter((entry) => countOf(entry) > 0).map((entry) => entry.course));
const courseName = (id) => {
    const course = COURSES.find((c) => c.id === id);
    return course ? `${course.bn} · ${course.en}` : id;
};
function paintKept() {
    const host = $("#account-kept");
    if (!host)
        return;
    /* One card per course, not per key, because "German: 14 parts,
       9 practice days" is a sentence and four rows of storage keys
       is an audit log. */
    const byCourse = new Map();
    for (const entry of KEPT) {
        const count = countOf(entry);
        if (!count)
            continue;
        if (!byCourse.has(entry.course))
            byCourse.set(entry.course, []);
        byCourse.get(entry.course).push(entry.single ? "where you were" : plural(count, entry.one, entry.many));
    }
    if (!byCourse.size) {
        host.replaceChildren(nothing("Nothing yet. Open a lesson and tick it off, and it will appear here "
            + "and on your other devices."));
        return;
    }
    host.replaceChildren(...[...byCourse].map(([id, bits]) => el("div", { className: "cell" }, el("h3", { className: "bn-h", textContent: courseName(id) }), el("p", { textContent: bits.join(" · ") }))));
}
/* ============================================================
   THE YEAR

   A day a week for a year is 52 squares and a day every day is
   365, and the difference between those two is the only thing
   this drawing is for. It is `days-active`, which streak.js has
   written since long before accounts and which sync.js carries as
   a union, so it is the true set of days across every device
   rather than whichever one synced last.

   WHAT IT IS NOT. There is no flame, nothing turns red, no square
   is a reproach and nothing here counts down. streak.js says the
   same thing at greater length and means it: a count of days is a
   fact somebody asked for, and a count of days with a threat
   attached is a different product.
   ============================================================ */
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function paintHeat() {
    const host = $("#account-heat");
    if (!host)
        return;
    const days = new Set(activeDays());
    /* Fifty-three weeks back to the Sunday before, so the grid is
       whole columns and today is in the last one. A partial first
       column is the thing that makes one of these look broken. */
    const end = new Date();
    end.setHours(12, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - 364);
    start.setDate(start.getDate() - start.getDay());
    const grid = el("div", { className: "heat-grid", role: "img",
        "aria-label": `${days.size} days with something on them in the last year` });
    const months = el("div", { className: "heat-months", "aria-hidden": "true" });
    let seen = -1;
    for (let cursor = new Date(start); cursor <= end; cursor.setDate(cursor.getDate() + 7)) {
        const week = el("div", { className: "heat-week" });
        /* The month label goes above the week that contains the
           first of it, which is how the eye reads these: the label
           marks where a month starts rather than sitting over its
           middle. */
        const month = cursor.getMonth();
        const shows = month !== seen;
        if (shows)
            seen = month;
        months.append(el("span", { className: "heat-month",
            textContent: shows ? MONTHS[month] : "" }));
        for (let d = 0; d < 7; d++) {
            const day = new Date(cursor);
            day.setDate(day.getDate() + d);
            if (day > end) {
                week.append(el("i", { className: "heat-cell", "data-off": "" }));
                continue;
            }
            const key = today(day);
            week.append(el("i", {
                className: "heat-cell",
                "data-on": days.has(key) ? "" : undefined,
                "data-today": key === today() ? "" : undefined,
                title: `${day.toLocaleDateString("en-GB", { day: "numeric", month: "long" })}: ${days.has(key) ? "you were here" : "nothing"}`,
            }));
        }
        grid.append(week);
    }
    host.replaceChildren(months, grid);
}
/** The three numbers above the fold. Facts, and no more than
    facts: this line never turns red and never counts down. */
function paintTiles(pace) {
    const host = $("#account-tiles");
    if (!host)
        return;
    const week = daysIn(7);
    const streak = run();
    const read = KEPT.filter((k) => !k.single && !k.key.endsWith("-checks"))
        .reduce((n, k) => n + countOf(k), 0);
    const checks = KEPT.filter((k) => k.key.endsWith("-checks"))
        .reduce((n, k) => n + countOf(k), 0);
    const tile = (n, label) => el("div", { className: "acct-tile" }, el("strong", { className: "mono", textContent: String(n) }), el("span", { textContent: label }));
    host.replaceChildren(tile(read, read === 1 ? "chapter finished" : "chapters finished"), tile(checks, checks === 1 ? "checkpoint ticked" : "checkpoints ticked"), tile(activeDays().length, "days here"), tile(streak, streak === 1 ? "day in a row" : "days in a row"));
    const line = $("#account-week");
    if (!line)
        return;
    const bits = [week === 1
            ? "One of the last seven days had something on it."
            : `${week} of the last seven days had something on them.`];
    const target = PACE_TARGET[pace] ?? 0;
    if (target && week >= target)
        bits.push("That is the pace you set.");
    else if (target)
        bits.push(`You said you were aiming for ${pace === "daily" ? "every day" : "most days"}.`);
    line.textContent = bits.join(" ");
}
function paintFace() {
    const user = current();
    const face = $("#account-face");
    if (face)
        face.textContent = (user?.name ?? "?").trim().charAt(0).toUpperCase() || "?";
}
const LADDERS = {
    money: { load: () => import("/money/curriculum.js"), all: (m) => m.allLessons(), key: "learn-read" },
    deutsch: { load: () => import("/deutsch/curriculum.js"), all: (m) => m.allTeile(), key: "deutsch-read" },
    quran: { load: () => import("/quran/curriculum.js"), all: (m) => m.allLessons(), key: "quran-done" },
    english: { load: () => import("/english/curriculum.js"), all: (m) => m.allParts(), key: "english-read" },
};
const LAST_KEY = {
    money: "learn-last", deutsch: "deutsch-last",
    quran: "quran-last", english: "english-last",
};
let ladders = null;
async function loadLadders() {
    if (ladders)
        return ladders;
    const entries = await Promise.all(Object.entries(LADDERS).map(async ([id, spec]) => {
        try {
            const mod = await spec.load();
            return [id, spec.all(mod).map((l) => ({
                    id: l.id, url: l.url, title: String(l.bn ?? l.en ?? l.id),
                    live: (l.status ?? "live") === "live",
                }))];
        }
        catch (err) {
            /* A ladder that will not load is a bar this page cannot
               honestly draw, so it does not draw one. */
            console.warn("account: could not read the ladder for", id, err);
            return [id, []];
        }
    }));
    ladders = new Map(entries);
    return ladders;
}
function standing(course, lessons) {
    const read = new Set(readLocal(LADDERS[course].key) ?? []);
    const live = lessons.filter((l) => l.live);
    const done = live.filter((l) => read.has(l.id));
    /* Where they were, and where to go, which are the same thing
       only until the lesson they were on is finished. Same rule the
       school hubs use, and for the same reason: a resume card that
       sends you back to something you have already ticked is a card
       nobody presses twice. */
    const mark = readLocal(LAST_KEY[course]);
    const at = mark?.id ? live.findIndex((l) => l.id === mark.id) : -1;
    const next = at === -1
        ? live.find((l) => !read.has(l.id))
        : live.slice(at).find((l) => !read.has(l.id)) ?? live.find((l) => !read.has(l.id));
    return {
        done: done.length,
        total: live.length,
        pct: live.length ? (done.length / live.length) * 100 : 0,
        next: next ?? null,
        checks: checkpointStats(course),
        touched: done.length > 0 || Boolean(mark?.id),
    };
}
function ladderRow(course, lessons) {
    const s = standing(course, lessons);
    const name = courseName(course);
    const line = s.checks.done
        ? `${s.done} of ${s.total} chapters · ${plural(s.checks.done, "checkpoint", "checkpoints")}`
            + ` ticked in ${plural(s.checks.lessons, "lesson", "lessons")}`
        : `${s.done} of ${s.total} chapters`;
    return el("div", { className: "ladder-row", "data-started": s.touched ? "" : undefined }, el("div", { className: "ladder-head" }, el("h3", { className: "bn-h", textContent: name }), el("span", { className: "ladder-pct mono", textContent: `${Math.round(s.pct)}%` })), meter(s.pct, `${name}: ${s.done} of ${s.total} chapters finished`), el("p", { className: "ladder-line", textContent: line }), s.next
        ? el("a", { className: "ladder-go", href: s.next.url }, el("span", { className: "mono", textContent: s.touched ? "Carry on" : "Start" }), el("strong", { className: "bn-h", textContent: s.next.title }))
        : el("p", { className: "ladder-line", textContent: s.total ? "Every written chapter is finished." : "Nothing written here yet." }));
}
async function paintPaths() {
    const host = $("#account-paths");
    if (!host)
        return;
    const all = await loadLadders();
    /* Followed first, then anything with progress in it, then the
       rest. A reader who has said they are learning German should
       not scroll past three courses they have never opened to find
       out how German is going. */
    const following = new Set(profile?.following ?? []);
    const started = startedCourses();
    const rank = (id) => (following.has(id) ? 0 : started.has(id) ? 1 : 2);
    const rows = [...all.keys()]
        .filter((id) => (all.get(id) ?? []).length)
        .sort((a, b) => rank(a) - rank(b))
        .map((id) => ladderRow(id, all.get(id)));
    host.replaceChildren(...(rows.length
        ? rows
        : [nothing("No course ladders could be read just now.")]));
}
/* ============================================================
   THE LIBRARY: kept pages, and notes

   One table, two lists, because `saved` and `note` are two facts
   about one row. The migration says why at length. Here it means
   a page can appear in both lists, which is correct: keeping
   something and writing on it are different acts.
   ============================================================ */
let library = [];
function keptRow(row, { showNote }) {
    const drop = el("button", {
        className: "btn btn-ghost btn-small", type: "button",
        textContent: showNote ? "Delete the note" : "Remove",
    });
    drop.addEventListener("click", async () => {
        if (showNote && !confirm(`Delete your note on "${row.title || "this page"}"?`))
            return;
        drop.disabled = true;
        try {
            /* Taking a note off a page that is also on the reading list
               must not take the page off the list, and vice versa. So
               one control clears one column and the trigger in the
               migration removes the row once both have gone. */
            if (showNote)
                await keepPage({ url: row.url, title: row.title, kind: row.kind, note: "" });
            else if (row.note)
                await keepPage({ url: row.url, title: row.title, kind: row.kind, saved: false });
            else
                await removeLibraryRow(row.id);
            await paintLibrary();
        }
        catch (err) {
            say($("#exit-note"), err.message, "warn");
            drop.disabled = false;
        }
    });
    return el("article", { className: "kept-row" }, el("div", { className: "kept-body" }, el("span", { className: "kept-kind mono",
        textContent: row.kind === "lesson" ? "Lesson" : "Piece" }), el("h3", {}, el("a", { href: row.url, textContent: row.title || row.url })), showNote
        /* The note as the reader typed it, in a `<p>` with
           `white-space: pre-wrap`, and never as HTML. Nothing on
           this site renders a note as markup and nothing should:
           it is the one field here whose author and whose reader
           are the same person, which is exactly the case where
           nobody would notice it being used against them. */
        ? el("p", { className: "kept-note", textContent: row.note })
        : null, el("p", { className: "kept-when mono", textContent: when(row.updated_at) })), el("div", { className: "kept-actions" }, el("a", { className: "btn btn-ghost btn-small", href: row.url, textContent: "Open" }), drop));
}
async function paintLibrary() {
    library = await listLibrary();
    const list = $("#account-kept-list");
    if (list) {
        const kept = library.filter((r) => r.saved);
        list.replaceChildren(...(kept.length
            ? kept.map((r) => keptRow(r, { showNote: false }))
            : [nothing("Nothing kept yet. On any piece or lesson there is a Save "
                    + "button under the title, and what you save lands here.")]));
    }
    const notes = $("#account-notes");
    if (notes) {
        const written = library.filter((r) => r.note);
        notes.replaceChildren(...(written.length
            ? written.map((r) => keptRow(r, { showNote: true }))
            : [nothing("Nothing written yet. Every piece and every lesson has an "
                    + "\"Add a note\" button under the title.")]));
    }
}
/* ============================================================
   TARGETS
   ============================================================ */
const KINDS = [
    { id: "course", label: "Finish a course", note: "measured by your own ticks" },
    { id: "habit", label: "Turn up n days a week", note: "measured by the days you were here" },
    { id: "metric", label: "Reach a number", note: "a figure you keep and update yourself" },
];
let targets = [];
/** Where a target's progress comes from, per kind. Two of the
    three read what the reader has actually done; the third reads
    a number they typed, because this site cannot see their
    portfolio and pretending otherwise would be a bar that means
    nothing. */
async function measure(target) {
    if (target.kind === "course") {
        const all = await loadLadders();
        const s = standing(target.subject, all.get(target.subject) ?? []);
        return { at: s.done, of: Number(target.target) || s.total || 1, unit: "chapters" };
    }
    if (target.kind === "habit") {
        return { at: daysIn(7), of: Number(target.target) || 7, unit: "days this week" };
    }
    return {
        at: Number(target.reached) || 0,
        of: Number(target.target) || 1,
        unit: target.unit || "",
    };
}
async function targetRow(target) {
    const { at, of, unit } = await measure(target);
    const pct = of ? (at / of) * 100 : 0;
    const finished = Boolean(target.done_at) || pct >= 100;
    const numbers = `${at} of ${of}${unit ? ` ${unit}` : ""}`;
    const actions = el("div", { className: "target-actions" });
    /* A number this site cannot see is a number the reader keeps,
       so the one control it gets is the one that updates it. */
    if (target.kind === "metric") {
        const field = el("input", {
            type: "number", step: "any", min: "0", className: "target-input",
            value: String(target.reached ?? 0), "aria-label": `Where ${target.label} is now`,
        });
        const update = el("button", { className: "btn btn-ghost btn-small", type: "button",
            textContent: "Update" });
        update.addEventListener("click", async () => {
            update.disabled = true;
            try {
                await updateTarget(target.id, { reached: Number(field.value) || 0 });
                await paintTargets();
            }
            catch (err) {
                say($("#target-note"), err.message, "warn");
                update.disabled = false;
            }
        });
        actions.append(field, update);
    }
    const done = el("button", { className: "btn btn-ghost btn-small", type: "button",
        textContent: target.done_at ? "Reopen" : "Mark done" });
    done.addEventListener("click", async () => {
        done.disabled = true;
        try {
            await updateTarget(target.id, { done_at: target.done_at ? null : new Date().toISOString() });
            await paintTargets();
        }
        catch (err) {
            say($("#target-note"), err.message, "warn");
            done.disabled = false;
        }
    });
    const drop = el("button", { className: "btn btn-ghost btn-small", type: "button",
        textContent: "Remove" });
    drop.addEventListener("click", async () => {
        if (!confirm(`Remove "${target.label}"?`))
            return;
        drop.disabled = true;
        try {
            await removeTarget(target.id);
            await paintTargets();
        }
        catch (err) {
            say($("#target-note"), err.message, "warn");
            drop.disabled = false;
        }
    });
    actions.append(done, drop);
    return el("div", { className: "target", "data-done": finished ? "" : undefined }, el("div", { className: "target-head" }, el("h3", { textContent: target.label }), el("span", { className: "target-pct mono",
        textContent: `${Math.round(Math.min(pct, 100))}%` })), meter(pct, `${target.label}: ${numbers}`), el("p", { className: "target-line", textContent: finished ? `${numbers}. Done.` : numbers }), actions);
}
async function paintTargets() {
    const host = $("#account-targets");
    if (!host)
        return;
    targets = await listTargets();
    host.replaceChildren(...(targets.length
        ? await Promise.all(targets.map(targetRow))
        : [nothing("Nothing set. A target is a sentence with a number in it: finish "
                + "the money ladder, read on four days a week, get a portfolio yield to "
                + "six per cent.")]));
}
function buildKinds() {
    const host = $("#target-kind");
    if (!host)
        return;
    host.replaceChildren(...KINDS.map((kind, n) => el("label", { className: "choice choice-pace", htmlFor: `kind-${kind.id}` }, el("input", { type: "radio", name: "target-kind", id: `kind-${kind.id}`,
        value: kind.id, checked: n === 0, onchange: buildFields }), el("span", { className: "choice-body" }, el("strong", { textContent: kind.label }), el("small", { textContent: kind.note })))));
}
const chosenKind = () => $("#target-kind input:checked")?.value ?? "course";
/** The fields, which differ per kind, because a course target has
    nothing to type and a metric has four things. One form that
    changes rather than three forms: three would be three save
    handlers and three places for a label to drift. */
function buildFields() {
    const host = $("#target-fields");
    if (!host)
        return;
    const kind = chosenKind();
    const field = (label, input) => el("label", { className: "target-field" }, el("span", { textContent: label }), input);
    if (kind === "course") {
        host.replaceChildren(field("Which course", el("select", { id: "target-subject" }, ...COURSES.map((c) => el("option", { value: c.id, textContent: `${c.bn} · ${c.en}` })))));
        return;
    }
    if (kind === "habit") {
        host.replaceChildren(field("Days a week", el("input", { type: "number", id: "target-number", min: "1", max: "7", value: "4" })));
        return;
    }
    host.replaceChildren(field("What you are tracking", el("input", { type: "text", id: "target-label", maxLength: 80,
        placeholder: "Portfolio dividend yield" })), field("Where it is now", el("input", { type: "number", id: "target-now", step: "any", min: "0", value: "0" })), field("Where you want it", el("input", { type: "number", id: "target-number", step: "any", min: "0", value: "0" })), field("Unit", el("input", { type: "text", id: "target-unit", maxLength: 20, placeholder: "%" })));
}
/** What the form is asking for. Throws a sentence rather than
    returning null, so the one place that shows a complaint is the
    one place that catches it. */
function readTargetForm() {
    const kind = chosenKind();
    if (kind === "course") {
        const subject = $("#target-subject")?.value ?? "";
        const course = COURSES.find((c) => c.id === subject);
        if (!course)
            throw new Error("Pick a course.");
        return { kind, subject, label: `Finish ${course.en}`, target: 0, unit: "chapters" };
    }
    if (kind === "habit") {
        const n = Number($("#target-number")?.value);
        if (!(n >= 1 && n <= 7))
            throw new Error("Somewhere between one and seven days.");
        return { kind, subject: "week", label: `Read on ${n} days a week`, target: n, unit: "days" };
    }
    const label = ($("#target-label")?.value ?? "").trim();
    const goal = Number($("#target-number")?.value);
    if (!label)
        throw new Error("Say what you are tracking.");
    if (!(goal > 0))
        throw new Error("A target needs a number greater than nothing.");
    return {
        kind, subject: label.slice(0, 60), label, target: goal,
        reached: Number($("#target-now")?.value) || 0,
        unit: ($("#target-unit")?.value ?? "").trim(),
    };
}
/* ============================================================
   SAVED SCENARIOS
   ============================================================ */
/* The saved scenarios were painted here and are
   `components/account/saved.tsx` now. */
/* ============================================================
   READING PREFERENCES

   Four rows of chips. They apply on press rather than on save,
   because every one of them is visible on this page as it
   changes: a Save button between the reader and the type size
   would be a Save button between them and the only feedback the
   control has.
   ============================================================ */
/* The four reading preferences were painted here and are
   `components/account/prefs.tsx` now. They were the simplest
   section on the page and they are the pattern the rest follow:
   a client component that reads this site's own module at run
   time, rather than DOM built in a loop. */
/* ============================================================
   THE THREE SETTINGS QUESTIONS
   ============================================================ */
function buildCourses(chosen, started) {
    const host = $("#account-courses");
    if (!host)
        return;
    host.replaceChildren(...COURSES.map((course) => {
        const id = `course-${course.id}`;
        return el("label", { className: "choice", htmlFor: id }, el("input", { type: "checkbox", id, value: course.id, checked: chosen.has(course.id) }), el("span", { className: "choice-body" }, el("strong", { className: "bn-h", textContent: `${course.bn} · ${course.en}` }), 
        /* Said out loud, because a box that is already ticked
           without explanation reads as a default somebody chose
           for you. */
        started.has(course.id)
            ? el("small", { textContent: "you have already started this" })
            : el("small", { textContent: course.blurb ?? "" })));
    }));
}
function buildPace(chosen) {
    const host = $("#account-pace");
    if (!host)
        return;
    host.replaceChildren(...PACES.map((pace) => {
        const id = `pace-${pace.id}`;
        return el("label", { className: "choice choice-pace", htmlFor: id }, el("input", { type: "radio", name: "pace", id, value: pace.id, checked: chosen === pace.id }), el("span", { className: "choice-body" }, el("strong", { textContent: pace.label }), el("small", { textContent: pace.note })));
    }));
}
const chosenCourses = () => [...document.querySelectorAll("#account-courses input:checked")]
    .map((b) => b.value);
const chosenPace = () => $("#account-pace input:checked")?.value ?? "";
/* ============================================================
   TAKING A COPY

   Everything, in one file, readable in a text editor. Not an
   export button that produces something only this site can read:
   the whole argument for an account on a site like this one is
   that leaving is as easy as arriving.

   It is assembled in the browser out of what this page has
   already fetched plus the mirror, rather than by asking the
   server for a bundle, because there is no server here that could
   assemble one: Supabase answers tables and the Worker never sees
   a reader's rows at all.
   ============================================================ */
async function exportEverything() {
    const button = $("#account-export");
    const note = $("#exit-note");
    button.disabled = true;
    say(note, "Gathering it up…");
    try {
        const [scenarios, allTargets, rows] = await Promise.all([
            listScenarios(), listTargets(), listLibrary(),
        ]);
        const progress = {};
        for (const key of SYNCED_KEYS) {
            const value = readLocal(key);
            if (value !== undefined)
                progress[key] = value;
        }
        const bundle = {
            what: "Everything Reiad's Library holds for this account.",
            taken: new Date().toISOString(),
            account: { name: current()?.name ?? "", email: current()?.email ?? "" },
            profile,
            progress,
            library: rows,
            targets: allTargets,
            scenarios,
        };
        /* A blob and an object URL, revoked immediately after the
           click: a data: URL of the same thing would be governed by
           the page's own navigation policy and is capped at a few
           megabytes in some browsers, and this bundle has no ceiling
           anybody has measured. */
        const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = el("a", { href: url, download: `reiad-library-${today()}.json` });
        document.body.append(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        say(note, "Downloaded. It is yours: nothing about that file is sent anywhere.", "ok");
    }
    catch (err) {
        say(note, err.message || "That did not work.", "warn");
    }
    finally {
        button.disabled = false;
    }
}
/* ============================================================
   The page, in its two states
   ============================================================ */
function paintIdentity() {
    const user = current();
    $("#account-out").hidden = !!user;
    $("#account-in").hidden = !user;
    if (!user)
        return;
    $("#account-hello").textContent = user.name ? `Hello, ${user.name}.` : "Hello.";
    $("#account-email").textContent = user.email ?? "";
    const field = $("#account-name");
    if (field && !field.value)
        field.value = user.name ?? "";
    paintFace();
    paintKept();
}
/** Setup asks; settings tells. Same form either way. */
function frame(isSetup) {
    say($("#settings-label"), isSetup ? "Set up your account" : "Your settings");
    $("#settings-intro").textContent = isSetup
        ? "Three things, and none of them required. Some of it is filled in "
            + "already from what this account knows. Change what is wrong, tick "
            + "what you are about to start, and this becomes your settings page."
        : "Three things, none of them required. You can change any of them "
            + "whenever you like.";
    $("#settings-skip").hidden = !isSetup;
    $("#settings-form").dataset.mode = isSetup ? "setup" : "settings";
}
let profile = null;
async function boot() {
    paintIdentity();
    if (!current())
        return;
    buildKinds();
    buildFields();
    /* The exchange first, and everything else after it.
  
       This is the one ordering decision on the page and it is the
       opposite of the old one. This page used to draw from
       localStorage immediately and correct itself when the network
       answered, because localStorage was a separate record that
       might be ahead of the account. It is the account's mirror
       now, so drawing before the exchange would be drawing the last
       visit's numbers and then moving them. */
    say($("#account-synced"), "Reading your account…");
    const done = await sync();
    say($("#account-synced"), done
        ? "Up to date with your other devices, as of a moment ago."
        : "Could not reach your account just now, so this is the last copy this "
            + "device saw.");
    const started = startedCourses();
    buildCourses(started, started);
    buildPace("");
    paintKept();
    paintHeat();
    paintTiles("");
    /* The profile row is what counts. The token carries whatever
       Google said at sign-in, which may be older. */
    profile = await getProfile();
    if (profile) {
        const field = $("#account-name");
        if (profile.display_name && field)
            field.value = profile.display_name;
        /* Union, not replacement. Somebody who follows German and has
           just started English should see both ticked. */
        const following = new Set([...(profile.following ?? []), ...started]);
        buildCourses(following, started);
        buildPace(profile.pace ?? "");
        frame(!profile.setup_at);
        paintTiles(profile.pace ?? "");
    }
    else {
        frame(false);
    }
    /* Four sections that each talk to the account, in parallel,
       because none is waiting on any other and one at a time would
       be four round trips end to end. */
    await Promise.all([paintPaths(), paintTargets(), paintLibrary()]);
}
/* ---------- saving ---------- */
async function save(patch, note) {
    const button = $("#settings-form button[type=submit]");
    button.disabled = true;
    try {
        await saveProfile(patch);
        /* The row as the account now has it. `profile` can still be
           null here, on the one path where a reader saves before the
           profile fetch has answered, and spreading null is an empty
           object rather than a crash: the next `getProfile()` fills
           in whatever this did not carry. */
        profile = { ...(profile ?? {}), ...patch };
        say($("#settings-note"), note, "ok");
        paintIdentity();
        paintTiles(profile?.pace ?? "");
        frame(false);
        return true;
    }
    catch (err) {
        say($("#settings-note"), err.message || "That did not save.", "warn");
        return false;
    }
    finally {
        button.disabled = false;
    }
}
$("#settings-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = $("#account-name").value.trim();
    if (!name) {
        say($("#settings-note"), "A name cannot be empty.", "warn");
        return;
    }
    const saved = await save({
        display_name: name,
        following: chosenCourses(),
        pace: chosenPace(),
        /* Answered, so stop asking. Set on the first save whether or
           not anything was ticked: somebody who saves a name and
           nothing else has still been through setup. */
        setup_at: new Date().toISOString(),
    }, "Saved.");
    // The order of the ladders follows `following`.
    if (saved)
        paintPaths();
});
/* "Not now" is a real answer and is recorded as one. Without this
   it would ask again on every visit, which is how a polite
   question becomes nagging. */
$("#settings-skip")?.addEventListener("click", async () => {
    await save({ setup_at: new Date().toISOString() }, "Fine. Everything above is here whenever you want it.");
});
$("#target-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = e.currentTarget
        .querySelector("button[type=submit]");
    button.disabled = true;
    try {
        await saveTarget(readTargetForm());
        say($("#target-note"), "Added.", "ok");
        buildFields();
        const more = $("#target-more");
        if (more)
            more.open = false;
        await paintTargets();
    }
    catch (err) {
        say($("#target-note"), err.message || "That did not save.", "warn");
    }
    finally {
        button.disabled = false;
    }
});
/* ---------- leaving ---------- */
$("#account-signin")?.addEventListener("click", () => {
    document.querySelector(".account-btn")?.click();
});
$("#account-export")?.addEventListener("click", exportEverything);
$("#account-signout")?.addEventListener("click", async () => {
    await signOut();
    paintIdentity();
});
$("#account-forget")?.addEventListener("click", async () => {
    const note = $("#exit-note");
    if (!confirm("Erase everything this account has saved?\n\n"
        + "Your position, your checkpoints, your reading list, your notes, your "
        + "targets and your saved scenarios. This cannot be undone."))
        return;
    const button = $("#account-forget");
    button.disabled = true;
    say(note, "Erasing…");
    let gone = await forgetOnAccount();
    try {
        await Promise.all([
            ...targets.map((t) => removeTarget(t.id)),
            ...(await listScenarios()).map((s) => removeScenario(s.id)),
            ...(await listLibrary()).map((r) => removeLibraryRow(r.id)),
        ]);
    }
    catch (err) {
        console.warn("account: could not remove everything", err);
        gone = false;
    }
    say(note, gone
        ? "Erased. Nothing of yours is stored on this account or on this device."
        : "Some of that did not work. Reload and try again.", gone ? "ok" : "warn");
    /* The sections this file no longer draws hear about it here.
  
       `components/account/` reads the same rows and cannot know
       that a button in this file has just emptied them. The same
       channel `account:changed` below already uses, for the same
       reason: an event is the right way for two things that do not
       import each other to agree, and it goes away with this file
       when the last section moves. */
    document.dispatchEvent(new CustomEvent("account:refresh"));
    button.disabled = false;
    paintKept();
    paintHeat();
    paintTiles(profile?.pace ?? "");
    await Promise.all([paintPaths(), paintTargets(), paintLibrary()]);
});
document.addEventListener("account:changed", () => {
    paintIdentity();
    if (current())
        boot();
});
boot();
