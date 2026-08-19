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
import { listScenarios, removeScenario, listTargets, removeTarget, listLibrary, removeLibraryRow, } from "/saved.js";
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
/** The empty state of a list, said in a sentence rather than
    drawn as a dashed box with a shrug in it. */
const nothing = (text) => el("p", { className: "acct-empty" }, text);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
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
/* ============================================================
   THE LADDERS

   Painted here and `components/account/paths.tsx` now, and the
   change is not only where the code lives. This file imported all
   four schools' `curriculum.js` at run time, 150 KB of them, to
   find out how many lessons a bar was counting against. The route
   hands the ladder down instead, out of
   `next/lib/school-ladders.ts`, which is the rule
   `next/lib/progress.ts` states: the ladder is the server's and
   the ticks are the browser's.

   `startedCourses()` below stays, because the settings form still
   ticks the courses a reader has already opened.
   ============================================================ */
/* ============================================================
   THE LIBRARY: kept pages, and notes

   One table, two lists, because `saved` and `note` are two facts
   about one row. The migration says why at length. Here it means
   a page can appear in both lists, which is correct: keeping
   something and writing on it are different acts.
   ============================================================ */
/* The reading list and the notes were painted here and are
   `components/account/library.tsx` now, one component for both
   because they are two columns of one row.

   The module-level `library` went with them. It looked like
   "take a copy of everything" still needed it and it did not:
   that function calls `listLibrary()` itself and reads its own
   local. The compiler is what said so. */
/* ============================================================
   TARGETS

   The list, the three kinds, the measuring and the form are
   `components/account/targets.tsx` now. They were a painter and a
   submit handler that knew each other only by element id; adding
   a target repaints the list, which is one piece of state and so
   is one component.

   Erasing everything still removes them, below, and it reads the
   rows itself rather than keeping a module-level copy of what the
   list last drew.
   ============================================================ */
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
    /* Nothing is repainted after this and nothing needs to be. The
       order of the ladders follows `following`, and
       `components/account/paths.tsx` hears about a change through
       `profile:changed`, which `saveProfile` dispatches on a save
       that worked. */
    await save({
        display_name: name,
        following: chosenCourses(),
        pace: chosenPace(),
        /* Answered, so stop asking. Set on the first save whether or
           not anything was ticked: somebody who saves a name and
           nothing else has still been through setup. */
        setup_at: new Date().toISOString(),
    }, "Saved.");
});
/* "Not now" is a real answer and is recorded as one. Without this
   it would ask again on every visit, which is how a polite
   question becomes nagging. */
$("#settings-skip")?.addEventListener("click", async () => {
    await save({ setup_at: new Date().toISOString() }, "Fine. Everything above is here whenever you want it.");
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
            /* Read rather than remembered. This file used to keep the
               array the targets list had last drawn; the list is a
               component now and this is the only caller, so it asks. */
            ...(await listTargets()).map((t) => removeTarget(t.id)),
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
});
document.addEventListener("account:changed", () => {
    paintIdentity();
    if (current())
        boot();
});
boot();
