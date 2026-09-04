/* courses.ts: the third-party course player. Five views of one
   thing (shelf, programme, course, module summary, lesson), drawn
   from the address. A PROGRAMME is a segment of every address
   below the shelf and is deliberately NOT part of a tick's id:
   see `lessonId`. The browser draws this because the catalogue is
   admin-only and the server must not put it in a page. Ticks are
   `courses-read` like every school's, carried by `sync.js`.
   The Drive player exposes no events, so nothing here listens:
   the tick is the "Mark complete and continue" button. */
import { token, current } from "/account.js";
/* Progress: the shape every school uses. A set of ids under one
   key, a bookmark under another, and an event so anything showing
   a number redraws; `sync.js` hears that event and carries the
   tick to the account. `courses-read` is a string in real
   browsers and may not be renamed. */
const READ_KEY = "courses-read";
const LAST_KEY = "courses-last";
const ANSWER_KEY = "courses-answers";
const CHANGED = "courses:progress";
const readJSON = (key, fallback) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    }
    catch {
        return fallback;
    }
};
const writeJSON = (key, value) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        /* Private mode throws on setItem. A tick is a nicety and must
           never take the page down with it. */
    }
};
/** Everything ticked. Reading never writes, which is the bug
    `next/lib/progress.ts` documents at length: a read that prunes
    to what the caller happens to know about throws away the rest
    of the reader's year. */
function readSet() {
    const raw = readJSON(READ_KEY, []);
    if (!Array.isArray(raw))
        return new Set();
    return new Set(raw.filter((id) => typeof id === "string"));
}
function markRead(id) {
    const set = readSet();
    if (set.has(id))
        return; // no event for no change
    set.add(id);
    writeJSON(READ_KEY, [...set]);
    dispatchEvent(new CustomEvent(CHANGED));
}
function toggleRead(id) {
    const set = readSet();
    const now = !set.has(id);
    if (now)
        set.add(id);
    else
        set.delete(id);
    writeJSON(READ_KEY, [...set]);
    dispatchEvent(new CustomEvent(CHANGED));
    return now;
}
/* Quiz answers: a `set` of `<lesson id>#<question>#<option>`,
   the checkpoint shape with one more segment, carried by
   `aab/sync.js`. It records what was PICKED and never whether it
   was right: a Coursera export carries no answer key. */
const answerKey = (lesson, q, opt) => `${lesson}#${q}#${opt}`;
function readAnswers() {
    const raw = readJSON(ANSWER_KEY, []);
    if (!Array.isArray(raw))
        return new Set();
    return new Set(raw.filter((id) => typeof id === "string"));
}
/** Record one answer.

    `only` is what makes a radio a radio: for a single-answer
    question every other option of that question is cleared, so the
    stored set can never say a reader picked two things where the
    page allowed one. */
function setAnswer(lesson, q, opt, on, only) {
    const set = readAnswers();
    if (only) {
        const prefix = `${lesson}#${q}#`;
        for (const id of [...set])
            if (id.startsWith(prefix))
                set.delete(id);
    }
    const id = answerKey(lesson, q, opt);
    if (on)
        set.add(id);
    else
        set.delete(id);
    writeJSON(ANSWER_KEY, [...set]);
    dispatchEvent(new CustomEvent(CHANGED));
}
function clearAnswers(lesson) {
    const set = readAnswers();
    const prefix = `${lesson}#`;
    let touched = false;
    for (const id of [...set])
        if (id.startsWith(prefix)) {
            set.delete(id);
            touched = true;
        }
    if (!touched)
        return;
    writeJSON(ANSWER_KEY, [...set]);
    dispatchEvent(new CustomEvent(CHANGED));
}
function setLast(entry) {
    writeJSON(LAST_KEY, { ...entry, ts: Date.now() });
    dispatchEvent(new CustomEvent(CHANGED));
}
/* Where a thing lives: the same address rules as
   `shared/courses.ts`, duplicated because that is the Worker's
   package. `check-courses.ts` reads both and fails if a template
   here stops matching the one there. */
const programmeUrl = (programme) => `/skills/courses/${programme}`;
const courseUrl = (programme, course) => `/skills/courses/${programme}/${course}`;
const moduleUrl = (programme, course, mod) => `/skills/courses/${programme}/${course}/${mod}`;
const lessonUrl = (programme, course, mod, lesson) => `/skills/courses/${programme}/${course}/${mod}/${lesson}`;
/* THE ADDRESS HAS A PROGRAMME IN IT AND THE TICK DOES NOT.
   `courses-read` holds these strings in real browsers and
   `courses-answers` holds them with two more segments on the end,
   so adding a segment here would not move somebody's ticks, it
   would lose them. A course slug is unique across the whole
   catalogue, which is what makes that safe; `check-courses.ts`
   fails on a collision. */
const lessonId = (course, mod, lesson) => `${course}/${mod}/${lesson}`;
const fileUrl = (drive) => `/api/courses/file/${drive}`;
const captionsUrl = (drive) => `/api/courses/captions/${drive}`;
const driveUrl = (drive) => `https://drive.google.com/file/d/${drive}/view`;
const laddered = (programme, course) => course.modules.flatMap((mod) => mod.lessons.map((lesson) => ({
    ...lesson,
    module: mod.slug,
    moduleTitle: mod.title,
    /* The id has no programme in it and the url does. */
    id: lessonId(course.slug, mod.slug, lesson.slug),
    url: lessonUrl(programme, course.slug, mod.slug, lesson.slug),
})));
/** The first lesson with no tick, which is where "start" and
    "continue" both point: the first unticked lesson at or after
    the bookmark, failing that the first unticked lesson at all.
    Null when the course is finished, which the caller says out
    loud rather than sending somebody back to lesson one. */
function nextUp(rungs, read) {
    const mark = readJSON(LAST_KEY, null);
    const at = mark ? rungs.findIndex((r) => r.id === mark.id) : -1;
    const after = at === -1 ? [] : rungs.slice(at);
    return after.find((r) => !read.has(r.id))
        ?? rungs.find((r) => !read.has(r.id))
        ?? null;
}
async function api(path) {
    const access = await token();
    if (!access) {
        return { ok: false, status: 401, data: null, message: "Not signed in." };
    }
    try {
        const res = await fetch(`/api/courses${path}`, {
            headers: { Authorization: `Bearer ${access}` },
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
            return {
                ok: false,
                status: res.status,
                data: null,
                message: body?.message ?? `That did not load (${res.status}).`,
            };
        }
        return { ok: true, status: res.status, data: body, message: "" };
    }
    catch {
        /* A network failure, not a permission one, and the difference
           matters to somebody deciding whether to sign in again. */
        return { ok: false, status: 0, data: null, message: "Could not reach the server." };
    }
}
function el(tag, attrs = {}, kids = []) {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(attrs)) {
        if (value === null || value === false)
            continue;
        if (value === true)
            node.setAttribute(key, "");
        else
            node.setAttribute(key, String(value));
    }
    for (const kid of kids) {
        if (kid === null || kid === undefined || kid === false)
            continue;
        node.append(typeof kid === "string" ? document.createTextNode(kid) : kid);
    }
    return node;
}
const pct = (done, total) => total > 0 ? Math.round((done / total) * 100) : 0;
/** A number and the thing it counts, pluralised. Every number on
    a card comes through here from the row the API sent, never
    from a sentence somebody typed. */
const count = (n, thing) => `${n} ${thing}${n === 1 ? "" : "s"}`;
/** What a card says it holds. `lead` is the programme's course
    count, which a course row has nothing to say in place of. */
const totals = (row, lead) => (lead ? `${lead}, ` : "")
    + `${count(row.modules, "module")}, ${count(row.lessons, "lesson")}`
    + (row.videos ? `, ${row.videos} with video` : "")
    + (row.pending ? `. ${row.pending} not imported yet` : "");
/** How many of the reader's ticks belong to these courses.

    A tick is `<course>/<module>/<lesson>` and carries no
    programme, so a programme is counted by the slugs of the
    courses in it. See `lessonId`. */
const doneIn = (read, courses) => {
    const slugs = new Set(courses.map((c) => c.slug));
    return [...read].filter((id) => slugs.has(id.split("/")[0])).length;
};
/** The bar, with its number beside it. The same markup
    `@layer deck`'s `.meter` already styles, so this section
    borrows the site's bar rather than drawing a second one. */
function meter(done, total, label) {
    const value = pct(done, total);
    const said = label ?? `${done} / ${total}`;
    return el("div", { class: "meter-line" }, [
        el("span", {
            class: "meter",
            role: "progressbar",
            "aria-valuenow": value,
            "aria-valuemin": 0,
            "aria-valuemax": 100,
            "aria-label": said,
        }, [el("i", { style: `width:${value}%` })]),
        el("span", { class: "mono" }, [said]),
    ]);
}
/** What kind of thing a lesson is, as a word. Shown because a
    reader deciding whether they have twenty minutes needs to know
    whether this is a video or a quiz before they open it. */
const KIND_WORD = {
    video: "Video",
    reading: "Reading",
    quiz: "Quiz",
    exam: "Challenge",
    file: "File",
};
/* The sidebar: a `<details>` per module, so a course with 250
   lessons is navigable on a phone, and the module the reader is
   in is the one that starts open. */
function sidebar(programme, course, here, open) {
    const read = readSet();
    const nav = el("nav", {
        class: "course-rail",
        "aria-label": `${course.title}: modules and lessons`,
    });
    nav.append(el("a", { class: "course-rail-top", href: courseUrl(programme, course.slug) }, [
        el("span", { class: "mono" }, [`Course ${course.n}`]),
        el("strong", {}, [course.title]),
    ]));
    for (const mod of course.modules) {
        const ids = mod.lessons.map((l) => lessonId(course.slug, mod.slug, l.slug));
        const done = ids.filter((id) => read.has(id)).length;
        /* Which modules are open is the reader's, not the page's. On
           the first draw it is the one they are in; on a redraw after
           a tick it is whatever they had opened by hand, or the rail
           would fold up under them every time they finished a lesson. */
        const isOpen = open ? open.has(mod.slug) : (here ? here.module === mod.slug : false);
        const box = el("details", { class: "course-mod", open: isOpen }, [
            el("summary", {}, [
                el("span", { class: "course-mod-n mono" }, [String(mod.n)]),
                el("span", { class: "course-mod-name" }, [mod.title]),
                el("span", { class: "course-mod-pct mono" }, [
                    mod.pending ? "not imported" : `${pct(done, ids.length)}%`,
                ]),
            ]),
        ]);
        if (mod.pending) {
            box.append(el("p", { class: "course-empty" }, [
                "This module's lessons have not been imported yet.",
            ]));
        }
        else {
            box.append(meter(done, ids.length));
            let section = "";
            const list = el("ol", { class: "course-lessons" });
            mod.lessons.forEach((lesson, i) => {
                if (lesson.section && lesson.section !== section) {
                    section = lesson.section;
                    list.append(el("li", { class: "course-section mono" }, [section]));
                }
                const id = ids[i];
                const isHere = here?.id === id;
                list.append(el("li", { class: "course-lesson", "data-here": isHere }, [
                    el("a", {
                        href: lessonUrl(programme, course.slug, mod.slug, lesson.slug),
                        "data-done": read.has(id),
                        "aria-current": isHere ? "page" : null,
                    }, [
                        el("span", { class: "course-tick", "aria-hidden": "true" }, [
                            read.has(id) ? "✓" : "",
                        ]),
                        el("span", { class: "course-lesson-name" }, [lesson.title]),
                        el("span", { class: "course-lesson-kind mono" }, [
                            KIND_WORD[lesson.kind] ?? lesson.kind,
                        ]),
                    ]),
                ]));
            });
            box.append(list);
        }
        nav.append(box);
    }
    return nav;
}
/* ============================================================
   The five views
   ============================================================ */
/** One card on the shelf: a certificate and what is in it. */
function programmeCard(programme, read) {
    const done = doneIn(read, programme.courses);
    return el("a", {
        class: "card course-card",
        "data-kind": "go",
        href: programmeUrl(programme.slug),
        "data-done": programme.lessons > 0 && done >= programme.lessons,
    }, [
        el("div", { class: "card-top" }, [
            el("span", { class: "card-chip mono" }, [`Programme ${programme.n}`]),
        ]),
        el("h3", { class: "card-title" }, [programme.title]),
        el("p", { class: "card-dek" }, [
            totals(programme, count(programme.courses.length, "course")),
        ]),
        meter(done, programme.lessons),
        el("span", { class: "card-go" }, [done ? "Carry on" : "Open the programme"]),
    ]);
}
/** One course of a programme, on the programme's page. */
function courseCard(programme, course, read) {
    const done = doneIn(read, [course]);
    return el("a", {
        class: "card course-card",
        "data-kind": "go",
        href: courseUrl(programme, course.slug),
        "data-done": course.lessons > 0 && done >= course.lessons,
    }, [
        el("div", { class: "card-top" }, [
            el("span", { class: "card-chip mono" }, [`Course ${course.n}`]),
        ]),
        el("h3", { class: "card-title" }, [course.title]),
        el("p", { class: "card-dek" }, [totals(course)]),
        meter(done, course.lessons),
        el("span", { class: "card-go" }, [done ? "Carry on" : "Open the course"]),
    ]);
}
/** `/skills/courses`

    The shelf. Programmes rather than courses: the eight were
    always the eight of one certificate, and a flat list had
    nothing to say about which belonged to which. */
function drawCatalogue(root, programmes) {
    const read = readSet();
    const courses = programmes.reduce((n, p) => n + p.courses.length, 0);
    root.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, ["কোর্স · Courses"]),
        el("h1", {}, ["Third-party courses"]),
        el("p", { class: "hub-lede" }, [
            `${count(programmes.length, "programme")}, ${count(courses, "course")}, `
                + "kept here for one person's own study. "
                + "The material is somebody else's and none of it is published: "
                + "every page in this section is behind the admin check.",
        ]),
    ]));
    const deck = el("div", { class: "deck deck-2" });
    for (const programme of programmes)
        deck.append(programmeCard(programme, read));
    root.append(deck);
}
/** `/skills/courses/<programme>`

    One certificate: what it adds up to, and its courses in the
    order they are meant to be taken. Drawn from the shelf's own
    payload, because there is no endpoint for one programme and
    the whole shelf is smaller than one course. */
function drawProgramme(root, programme) {
    name(programme.title);
    const read = readSet();
    const done = doneIn(read, programme.courses);
    root.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, [
            el("a", { href: "/skills/courses" }, ["Courses"]),
            ` · Programme ${programme.n}`,
        ]),
        el("h1", {}, [programme.title]),
        el("p", { class: "hub-lede" }, [
            totals(programme, count(programme.courses.length, "course")),
        ]),
        el("div", { class: "hub-progress" }, [
            meter(done, programme.lessons, `${done} of ${programme.lessons} lessons done`),
        ]),
    ]));
    const deck = el("div", { class: "deck deck-2" });
    for (const course of programme.courses) {
        deck.append(courseCard(programme.slug, course, read));
    }
    root.append(deck);
}
/** `/skills/courses/<programme>/<course>`

    The deep link is the point of this page. A reader coming back
    to a course wants the lesson they have not done, not a table
    of contents they have to read to find it. */
function drawCourse(root, programme, holder, course) {
    name(course.title);
    const rungs = laddered(programme, course);
    const read = readSet();
    const done = rungs.filter((r) => read.has(r.id)).length;
    const next = nextUp(rungs, read);
    root.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, [
            /* The certificate's own name, which came with the course.
               The level word is the failure path, for an older Worker
               that sends no `programme`: a title made out of the slug
               would print a second, different name beside the trail's,
               which fetched the real one. */
            el("a", { href: programmeUrl(programme) }, [holder?.title ?? "Programme"]),
            ` · Course ${course.n}`,
        ]),
        el("h1", {}, [course.title]),
        el("div", { class: "hub-progress" }, [
            meter(done, rungs.length, `${done} of ${rungs.length} lessons done`),
        ]),
    ]));
    if (next) {
        root.append(el("a", { class: "card resume", "data-kind": "go", href: next.url }, [
            el("span", { class: "card-chip mono" }, [
                done ? "Carry on where you left off" : "Start here",
            ]),
            el("h3", { class: "card-title" }, [next.title]),
            el("p", { class: "card-dek" }, [`${next.moduleTitle} · ${next.section}`]),
            el("span", { class: "card-go" }, ["Open this lesson"]),
        ]));
    }
    else if (rungs.length) {
        root.append(el("p", { class: "course-finished" }, [
            "Every lesson in this course is ticked.",
        ]));
    }
    const list = el("div", { class: "course-modules" });
    for (const mod of course.modules) {
        const ids = mod.lessons.map((l) => lessonId(course.slug, mod.slug, l.slug));
        const modDone = ids.filter((id) => read.has(id)).length;
        const first = mod.lessons.find((l) => !read.has(lessonId(course.slug, mod.slug, l.slug)))
            ?? mod.lessons[0];
        list.append(el("div", { class: "card", "data-kind": mod.pending ? "soon" : "go" }, [
            el("div", { class: "card-top" }, [
                el("span", { class: "card-chip mono" }, [`Module ${mod.n}`]),
            ]),
            el("h3", { class: "card-title" }, [
                mod.pending ? mod.title : el("a", {
                    href: first ? lessonUrl(programme, course.slug, mod.slug, first.slug)
                        : moduleUrl(programme, course.slug, mod.slug),
                }, [mod.title]),
            ]),
            mod.pending
                ? el("p", { class: "card-dek" }, ["Not imported yet."])
                : el("p", { class: "card-dek" }, [count(mod.lessons.length, "lesson")]),
            mod.pending ? null : meter(modDone, ids.length),
            mod.pending ? null : el("a", {
                class: "course-mod-link mono",
                href: moduleUrl(programme, course.slug, mod.slug),
            }, ["Module summary"]),
        ]));
    }
    root.append(list);
}
/** `/skills/courses/<programme>/<course>/<module>`

    Where the last lesson of a module lands. It is a stopping
    place: what was in the module, what is ticked, and the way on
    to the next one. */
function drawModule(root, programme, course, mod) {
    name(`${mod.title} · ${course.title}`);
    const read = readSet();
    const ids = mod.lessons.map((l) => lessonId(course.slug, mod.slug, l.slug));
    const done = ids.filter((id) => read.has(id)).length;
    const at = course.modules.findIndex((m) => m.slug === mod.slug);
    const after = course.modules.slice(at + 1).find((m) => !m.pending && m.lessons.length);
    root.append(sidebar(programme, course, null));
    const main = el("div", { class: "course-body" });
    main.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, [
            el("a", { href: courseUrl(programme, course.slug) }, [course.title]),
            ` · Module ${mod.n}`,
        ]),
        el("h1", {}, [mod.title]),
        el("div", { class: "hub-progress" }, [
            meter(done, ids.length, `${done} of ${ids.length} done`),
        ]),
    ]));
    if (done === ids.length && ids.length) {
        main.append(el("p", { class: "course-finished" }, ["Module finished."]));
    }
    const list = el("ol", { class: "course-summary-list" });
    let section = "";
    mod.lessons.forEach((lesson, i) => {
        if (lesson.section && lesson.section !== section) {
            section = lesson.section;
            list.append(el("li", { class: "course-section mono" }, [section]));
        }
        list.append(el("li", { "data-done": read.has(ids[i]) }, [
            el("a", { href: lessonUrl(programme, course.slug, mod.slug, lesson.slug) }, [
                el("span", { class: "course-tick", "aria-hidden": "true" }, [
                    read.has(ids[i]) ? "✓" : "",
                ]),
                el("span", { class: "course-lesson-name" }, [lesson.title]),
                el("span", { class: "course-lesson-kind mono" }, [
                    KIND_WORD[lesson.kind] ?? lesson.kind,
                ]),
            ]),
        ]));
    });
    main.append(list);
    main.append(el("nav", { class: "prev-next", "aria-label": "Modules" }, [
        el("a", { href: courseUrl(programme, course.slug) }, [
            el("span", { class: "mono" }, ["Back to"]),
            el("strong", {}, [course.title]),
        ]),
        after ? el("a", { href: moduleUrl(programme, course.slug, after.slug) }, [
            el("span", { class: "mono" }, ["Next module"]),
            el("strong", {}, [after.title]),
        ]) : null,
    ]));
    root.append(main);
}
/** `/skills/courses/<programme>/<course>/<module>/<lesson>` */
function drawLesson(root, programme, course, mod, lesson) {
    const rungs = laddered(programme, course);
    const id = lessonId(course.slug, mod.slug, lesson.slug);
    const here = rungs.find((r) => r.id === id) ?? null;
    const at = rungs.findIndex((r) => r.id === id);
    /* Opening moves the bookmark and nothing else. The tick is the
       button below, for the reason at the top of this file. */
    setLast({
        id, title: lesson.title,
        url: lessonUrl(programme, course.slug, mod.slug, lesson.slug),
    });
    /* The route's own title is generic, because the server renders
       nothing in this section: it cannot say which lesson this is
       without putting the catalogue in the page. So the browser
       says it, once it knows, in the tab and in the last crumb.
       Before this, both read "Lesson". */
    name(lesson.title);
    root.append(sidebar(programme, course, here));
    const main = el("article", { class: "course-body course-lesson-page" });
    main.append(el("span", { class: "eyebrow mono" }, [
        el("a", { href: courseUrl(programme, course.slug) }, [course.title]),
        " · ",
        el("a", { href: moduleUrl(programme, course.slug, mod.slug) }, [mod.title]),
        lesson.section ? ` · ${lesson.section}` : "",
    ]));
    main.append(el("h1", {}, [lesson.title]));
    main.append(el("p", { class: "lesson-meta mono" }, [
        `${KIND_WORD[lesson.kind] ?? lesson.kind} · lesson ${lesson.position} of ${mod.lessons.length}`,
    ]));
    /* A real `<video>` from this origin, never a Drive iframe: a
       private Drive file in a cross-site frame gets no Drive cookie
       in a modern browser, so Drive answers "Unable to load video".
       The Worker holds the credential and streams the bytes. */
    if (lesson.video) {
        const box = el("div", { class: "course-video" }, [
            el("p", { class: "course-waiting" }, ["Loading the video…"]),
        ]);
        main.append(box);
        void mountVideo(box, lesson.video, lesson.captions, lesson.title);
    }
    /* A reading, a quiz or a challenge is a saved Coursera page,
       fetched, sanitised by the Worker and rendered HERE rather
       than linked out to Drive's viewer. */
    for (const kind of ["reading", "quiz", "exam"]) {
        const drive = lesson[kind];
        if (!drive)
            continue;
        const box = el("div", { class: "course-reading" }, [
            el("p", { class: "course-waiting" }, [`Loading the ${KIND_WORD[kind].toLowerCase()}…`]),
        ]);
        main.append(box);
        /* A quiz and an exam are the same file shape and neither is a
           reading: every option in one lives inside a `<form>`, which
           the sanitiser deletes whole. They go through the parser
           instead, and `mountQuiz` falls back to the reading renderer
           if the file turns out not to be a quiz. */
        if (kind === "reading")
            void mountReading(box, drive, kind);
        else
            void mountQuiz(box, drive, kind, id);
    }
    if (!lesson.video && !lesson.reading && !lesson.quiz && !lesson.exam) {
        main.append(el("p", { class: "course-empty" }, [
            "This lesson has no file against it in the catalogue.",
        ]));
    }
    /* ---- what came with it ---- */
    const extras = [];
    if (lesson.transcript)
        extras.push(fileRow("Transcript", "txt", lesson.transcript));
    for (const file of lesson.files)
        extras.push(fileRow(file.name, file.ext, file.drive));
    if (extras.length) {
        main.append(el("div", { class: "course-files" }, [
            el("h2", { class: "mono" }, ["Files"]),
            el("ul", {}, extras),
        ]));
    }
    /* ---- the button ---- */
    const nextRung = at === -1 ? null : rungs[at + 1] ?? null;
    /* The last lesson of a module goes to that module's summary,
       not to the next module's first lesson: finishing a module is
       a moment, and being dropped straight into week four is how a
       reader loses track of what they have done. */
    const onward = nextRung && nextRung.module === mod.slug
        ? nextRung.url
        : moduleUrl(programme, course.slug, mod.slug);
    const done = () => readSet().has(id);
    const tick = el("button", {
        class: "tick-btn",
        type: "button",
        "data-done": done(),
        "aria-pressed": String(done()),
    }, [done() ? "Completed" : "Not completed"]);
    tick.addEventListener("click", () => {
        const now = toggleRead(id);
        tick.textContent = now ? "Completed" : "Not completed";
        tick.setAttribute("aria-pressed", String(now));
        if (now)
            tick.setAttribute("data-done", "");
        else
            tick.removeAttribute("data-done");
        refreshRail(programme, course, here);
    });
    const go = el("button", { class: "btn btn-solid course-continue", type: "button" }, [
        nextRung && nextRung.module === mod.slug
            ? "Mark complete & continue"
            : "Mark complete & finish the module",
    ]);
    go.addEventListener("click", () => {
        markRead(id);
        location.href = onward;
    });
    main.append(el("div", { class: "course-actions" }, [go, tick]));
    main.append(el("nav", { class: "prev-next", "aria-label": "Lessons" }, [
        at > 0 ? el("a", { href: rungs[at - 1].url }, [
            el("span", { class: "mono" }, ["Previous"]),
            el("strong", {}, [rungs[at - 1].title]),
        ]) : null,
        nextRung ? el("a", { href: nextRung.url }, [
            el("span", { class: "mono" }, ["Next"]),
            el("strong", {}, [nextRung.title]),
        ]) : null,
    ]));
    root.append(main);
}
/* A lesson's content goes through this site, never through
   Drive: see the top of `functions/_lib/drive.ts`. */
/** A pass for one file, good for half an hour. `<video src>` adds
    no header this code controls, so the permission travels in the
    URL as a signed ticket naming ONE file rather than as the
    session token. See `functions/_lib/ticket.ts`. The whole answer
    comes back because the reason a pass was refused is the only
    useful thing on the page when one is. */
const ticketFor = (drive) => api(`/ticket/${drive}`);
/** Name the TAB. This section renders nothing on the server, so
    the title says "Lesson" until the catalogue comes down. The
    trail is `next/components/courses/trail.tsx` and must not be
    renamed from here: a crumb holds a separator, a popover and a
    label, and one text node replaces all three. */
function name(title) {
    const clean = String(title ?? "").trim();
    if (!clean)
        return;
    document.title = `${clean} · Reiad's Library`;
}
function saySo(box, message) {
    box.replaceChildren(el("p", { class: "course-empty" }, [message]));
}
async function mountVideo(box, drive, captions, title) {
    const answer = await ticketFor(drive);
    if (!answer.ok || !answer.data) {
        /* The SERVER's own reason, not a general one: a missing
           Google credential is a sentence the Worker already sends,
           and "try reloading" was never going to fix it. */
        saySo(box, answer.message || "That video could not be opened.");
        return;
    }
    const url = answer.data.url;
    /* `preload="metadata"` rather than `auto`: a lesson video is
       tens of megabytes and a reader who opened the page to read
       the transcript should not pay for all of it. Metadata is
       enough for the duration and the scrub bar. */
    const video = el("video", {
        src: url,
        controls: true,
        preload: "metadata",
        playsinline: true,
        title,
    });
    box.replaceChildren(video);
    /* Captions after the player: they need a pass of their own and
       waiting for it would hold up the video. A `<track>` appended
       later is picked up, because the browser loads it when the
       reader turns captions on rather than when it appears. */
    if (captions)
        void mountCaptions(video, captions);
}
/** The subtitles, once their own pass has been minted.

    Separate from the video's pass and not reusing it: a ticket
    names ONE file, which is the property that makes it safe to put
    in a URL, and a second file needs a second ticket rather than a
    wider one. */
async function mountCaptions(video, drive) {
    const answer = await api(`/ticket/${drive}`);
    if (!answer.ok || !answer.data)
        return;
    /* The ticket names the file; the address says what is done to
       it on the way. `captionsUrl` is the SubRip-to-WebVTT route,
       because no browser reads SubRip in a `<track>`.
       Read with a pattern rather than `new URL`, which needs a base:
       `check-csp.ts` reads every host named here and is right to
       refuse one invented to satisfy a constructor. */
    const pass = /[?&]t=([^&]*)/.exec(answer.data.url)?.[1] ?? "";
    if (!pass)
        return;
    video.append(el("track", {
        kind: "captions",
        src: `${captionsUrl(drive)}?t=${pass}`,
        srclang: "en",
        label: "English",
        default: true,
    }));
}
/** A quiz. The inputs are built HERE out of the option strings
    the Worker parsed, so none of Coursera's own markup reaches
    this page. No submit button and no score: the export carries
    no answer key, so this records what was picked and says so. */
async function mountQuiz(box, drive, kind, lesson) {
    const answer = await api(`/quiz/${drive}`);
    if (!answer.ok || !answer.data) {
        saySo(box, answer.message || "That quiz could not be opened.");
        return;
    }
    /* Not a quiz after all, or one in a shape the parser does not
       know. Render it as a page rather than as nothing: unreadable
       is worse than plain. */
    if (!answer.data.parsed) {
        const body = el("div", { class: "course-page" });
        body.innerHTML = answer.data.html;
        box.replaceChildren(body, originalLink(drive, kind));
        return;
    }
    const chosen = readAnswers();
    const form = el("div", { class: "course-quiz" });
    for (const q of answer.data.questions) {
        const prompt = el("div", { class: "course-page" });
        prompt.innerHTML = q.prompt;
        const field = el("fieldset", { class: "quiz-q" }, [
            el("legend", {}, [
                `Question ${q.n}`,
                q.multiple ? el("span", { class: "quiz-hint" }, [" select all that apply"]) : null,
            ]),
            prompt,
        ]);
        const list = el("ul", { class: "quiz-options" });
        q.options.forEach((text, opt) => {
            const input = el("input", {
                type: q.multiple ? "checkbox" : "radio",
                /* One name per question, so the browser enforces
                   single-select for a radio group without this code
                   having to. Scoped by lesson because two quizzes could
                   otherwise share a group across a redraw. */
                name: `q-${lesson}-${q.n}`,
            });
            /* The PROPERTY, not the attribute. `checked=""` in the markup
               is `defaultChecked`: it says what the control resets to,
               not what it currently is. Setting the attribute alone
               restored an answer that a form reset would have shown and
               a reader never saw. */
            input.checked = chosen.has(answerKey(lesson, q.n, opt));
            input.addEventListener("change", () => {
                setAnswer(lesson, q.n, opt, input.checked, !q.multiple);
            });
            list.append(el("li", {}, [el("label", { class: "quiz-option" }, [input, ` ${text}`])]));
        });
        field.append(list);
        form.append(field);
    }
    /* Said once, at the bottom, rather than beside every question.
       A reader is owed the truth about what this does and does not
       do, and the honest version is short. */
    const note = el("p", { class: "course-quiz-note" }, [
        "Your answers save as you go, on this device and to your account. ",
        "This course's files carry no answer key, so nothing here is marked right or wrong.",
    ]);
    const reset = el("button", { type: "button", class: "quiz-reset" }, ["Clear my answers"]);
    reset.addEventListener("click", () => {
        clearAnswers(lesson);
        for (const input of form.querySelectorAll("input")) {
            input.checked = false;
        }
    });
    box.replaceChildren(form, note, reset, originalLink(drive, kind));
}
/** The quiet way back to the file this was built from. */
const originalLink = (drive, kind) => el("p", { class: "course-original mono" }, [
    el("a", { href: driveUrl(drive), target: "_blank", rel: "noopener" }, [`Open the original ${kind} in Drive`]),
]);
async function mountReading(box, drive, kind) {
    const answer = await api(`/reading/${drive}`);
    if (!answer.ok || !answer.data) {
        saySo(box, answer.message || "That page could not be opened.");
        return;
    }
    const body = el("div", { class: "course-page" });
    /* The Worker has already run this through the same sanitiser
       the Studio uses on an article, which drops script, style,
       iframe and the rest outright. What arrives is words and
       structure. */
    body.innerHTML = answer.data.html;
    box.replaceChildren(body, originalLink(drive, kind));
}
/** One row of the Files list.

    A link rather than a button, so it can be opened in a new tab
    and copied like any other, but its address is minted on the
    click: a ticket lasts half an hour and a page left open all
    afternoon would otherwise offer a set of dead links. */
function fileRow(name, ext, drive) {
    const link = el("a", { href: fileUrl(drive), target: "_blank", rel: "noopener" }, [name]);
    link.addEventListener("click", (event) => {
        event.preventDefault();
        void ticketFor(drive).then((answer) => {
            if (answer.ok && answer.data) {
                window.open(answer.data.url, "_blank", "noopener");
                return;
            }
            /* The server's reason, for the same argument as `mountVideo`:
               "could not be opened" is true of every failure and useful
               for none of them. */
            link.after(el("span", { class: "course-empty" }, [` ${answer.message || "could not be opened"}`]));
        });
    });
    return el("li", {}, [link, el("span", { class: "mono" }, [ext])]);
}
/** Redraw the rail after a tick, so the sidebar's ticks and bars
    agree with the button that was just pressed. Cheap: a course
    is a few hundred nodes and this happens on a click. */
function refreshRail(programme, course, here) {
    const rail = document.querySelector(".course-rail");
    if (!rail)
        return;
    /* Every box in document order, so the index really is the
       module's index. Selecting only the open ones and indexing
       THAT list would map the second open module onto the second
       module, which is the same list only when nothing is shut. */
    const open = new Set([...rail.querySelectorAll("details.course-mod")]
        .map((box, i) => (box.hasAttribute("open") ? course.modules[i]?.slug : null))
        .filter((slug) => Boolean(slug)));
    rail.replaceWith(sidebar(programme, course, here, open));
}
/** Read the address rather than being told by the page.

    The five routes are shells with no data in them, so there is
    nothing for a shell to tell this module that the URL does not
    already say, and a `data-` attribute per route would be a
    sixth place that knows what a course address looks like. */
export function whereAmI(path) {
    const parts = path.replace(/^\/skills\/courses\/?/, "").split("/").filter(Boolean);
    const [programme, course, mod, lesson] = parts;
    /* THE SEGMENT COUNT DECIDES: one is a programme, two a course,
       three a module, four a lesson. The `index.html` clauses still
       answer an address from before task #28.
       Read here rather than redirected in `aab/_redirects`, which
       is a public asset: a rule per course slug there would publish
       the catalogue this section keeps unpublished.
       AN ADDRESS FROM BEFORE THE PROGRAMME cannot be read here: it
       has one segment fewer and nothing saying so. `start()` is
       where a course bookmark of that shape is moved. */
    if (!parts.length || programme === "index.html")
        return { view: "catalogue" };
    if (parts.length === 1)
        return { view: "programme", programme };
    if (parts.length === 2 && course === "index.html") {
        return { view: "programme", programme };
    }
    if (parts.length === 2)
        return { view: "course", programme, course };
    if (parts.length === 3 && mod === "index.html") {
        return { view: "course", programme, course };
    }
    if (parts.length === 3)
        return { view: "module", programme, course, module: mod };
    if (parts.length === 4 && lesson === "index.html") {
        return { view: "module", programme, course, module: mod };
    }
    if (parts.length === 4) {
        return {
            view: "lesson",
            programme,
            course,
            module: mod,
            lesson: lesson.replace(/\.html$/i, ""),
        };
    }
    return null;
}
/* ============================================================
   Saying why nothing is here
   ============================================================ */
function note(root, title, body, action) {
    root.replaceChildren(el("div", { class: "course-note" }, [
        el("h1", {}, [title]),
        el("p", {}, [body]),
        action ?? null,
    ]));
}
/* ============================================================
   Start
   ============================================================ */
export async function start(root) {
    const where = whereAmI(location.pathname);
    if (!where) {
        note(root, "Not a page here", "That address is not a programme, a course, a module or a lesson.");
        return;
    }
    if (!current()) {
        note(root, "This section is private", "It holds one person's own copy of a third-party course, so it is not published. "
            + "Sign in to open it.", el("a", { class: "btn btn-solid", href: "/account" }, ["Sign in"]));
        return;
    }
    /* The shelf answers both of the top two views. There is no
       endpoint for one programme: the whole shelf is a title and
       five numbers per certificate, which is less than one course's
       ladder. */
    if (where.view === "catalogue" || where.view === "programme") {
        const answer = await api("");
        if (!answer.ok || !answer.data)
            return refuse(root, answer);
        const programmes = answer.data.courses;
        root.replaceChildren();
        if (where.view === "catalogue")
            return drawCatalogue(root, programmes);
        const programme = programmes.find((p) => p.slug === where.programme);
        if (!programme) {
            /* A course bookmark from before the programme segment. The
               shelf has already arrived and names every course under
               its programme, so this is answered with no second request.
               `replace`, not `href`: a bookmark that moved should not
               leave the dead address in the history for Back. */
            const holder = programmes.find((p) => p.courses.some((c) => c.slug === where.programme));
            if (holder) {
                location.replace(courseUrl(holder.slug, where.programme));
                return;
            }
            note(root, "No such programme", `Nothing in this catalogue is called “${where.programme}”.`);
            return;
        }
        return drawProgramme(root, programme);
    }
    /* A course is named the way its address names it: the programme
       and then the course. The answer carries the programme's own
       name beside the course, which is the only place a page below
       the shelf can learn it without fetching the shelf. */
    const answer = await api(`/${where.programme}/${where.course}`);
    if (!answer.ok || !answer.data)
        return refuse(root, answer);
    const course = answer.data.course;
    const holder = answer.data.programme ?? null;
    root.replaceChildren();
    if (where.view === "course") {
        return drawCourse(root, where.programme, holder, course);
    }
    const mod = course.modules.find((m) => m.slug === where.module);
    if (!mod) {
        note(root, "No such module", `${course.title} has no module called “${where.module}”.`);
        return;
    }
    if (where.view === "module")
        return drawModule(root, where.programme, course, mod);
    const lesson = mod.lessons.find((l) => l.slug === where.lesson);
    if (!lesson) {
        note(root, "No such lesson", `${mod.title} has no lesson called “${where.lesson}”.`);
        return;
    }
    drawLesson(root, where.programme, course, mod, lesson);
}
/** 401 and 403 are different sentences, and a page that gives one
    answer to both offers a sign-in button to somebody who is
    already signed in. */
function refuse(root, answer) {
    if (answer.status === 403) {
        note(root, "Not yours", "This section is one person's own copy of a third-party course. It is not published.");
        return;
    }
    if (answer.status === 401) {
        note(root, "Signed out", "Your session has expired. Sign in again to carry on.", el("a", { class: "btn btn-solid", href: "/account" }, ["Sign in"]));
        return;
    }
    note(root, "That did not load", answer.message);
}
/* The entry point, guarded on `document` existing at all.

   Not defensive programming for its own sake: `courses.test.ts`
   imports this module to reach `whereAmI()` before it has built a
   DOM, and a module that throws on import cannot be tested by the
   thing that would catch it throwing. In a browser the guard is
   always true. */
if (typeof document !== "undefined") {
    const root = document.getElementById("course-app");
    if (root)
        void start(root);
}
