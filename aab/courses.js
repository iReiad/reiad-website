/* ============================================================
   courses.ts: the third-party course player.

   Four pages, one module, because they are four views of one
   thing and the reader moves between them constantly: a
   catalogue, a course, a module summary and a lesson. Which one
   is drawn comes from the address, so there is no per-page entry
   point to keep in step with the routes.

   ---- why the browser draws this and the server does not ----

   Every other ladder on this site is server-rendered, and the
   rule in `CLAUDE.md` is that the ladder is the server's and the
   ticks are the browser's. This section is the one place that
   cannot be: the catalogue is one person's private Drive folder
   and it is admin-only, so the server must not put it in a page.
   The Worker checks `isAdmin()` and answers `/api/courses`; this
   fetches it. See the head of `functions/api/courses/[[route]].ts`.

   The ticks are still the browser's, filed under `courses-read`
   like every other school's, and `sync.js` carries them to the
   account. That half did not change.

   ---- the video, and the thing this deliberately does not do ----

   A lesson's video is a Drive `/preview` iframe. The Drive player
   exposes NO events to the page that embeds it: no play, no
   pause, no ended, no postMessage worth listening to. So nothing
   here listens. There is no timer pretending to know how much
   has been watched, and no heuristic marking a lesson done
   because ninety seconds passed.

   What there is instead is a button. "Mark complete and
   continue" saves the tick and goes to the next lesson, and the
   last lesson of a module goes to the module's summary. A reader
   who skims a video and presses it has finished the lesson,
   because they said so, which is the only honest signal
   available and is the same rule the six schools already use:
   opening is not finishing.
   ============================================================ */
import { token, current } from "/account.js";
/* ============================================================
   Progress

   The same shape every school uses: a set of ids under one key,
   a bookmark under another, and an event so that anything on the
   page showing a number redraws. `sync.js` listens for that same
   event and is what carries a tick to the account.

   The key is `courses-read` and it is new, so unlike the six
   schools there is no history to preserve. It is still written
   out here rather than derived from anything, because the rule
   in `CLAUDE.md` about storage keys is that they are strings in
   real browsers, and the day this one has history is the day
   somebody would otherwise be tempted to rename it.
   ============================================================ */
const READ_KEY = "courses-read";
const LAST_KEY = "courses-last";
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
function setLast(entry) {
    writeJSON(LAST_KEY, { ...entry, ts: Date.now() });
    dispatchEvent(new CustomEvent(CHANGED));
}
/* ============================================================
   Where a thing lives

   The same four functions as `shared/courses.ts`, and the check
   holds them to being the same. They are duplicated rather than
   imported for the reason the types above are: this file is the
   browser's and that one is the Worker's package.
   ============================================================ */
const courseUrl = (course) => `/skills/courses/${course}/index.html`;
const moduleUrl = (course, mod) => `/skills/courses/${course}/${mod}/index.html`;
const lessonUrl = (course, mod, lesson) => `/skills/courses/${course}/${mod}/${lesson}.html`;
const lessonId = (course, mod, lesson) => `${course}/${mod}/${lesson}`;
const fileUrl = (drive) => `/api/courses/file/${drive}`;
const driveUrl = (drive) => `https://drive.google.com/file/d/${drive}/view`;
const laddered = (course) => course.modules.flatMap((mod) => mod.lessons.map((lesson) => ({
    ...lesson,
    module: mod.slug,
    moduleTitle: mod.title,
    id: lessonId(course.slug, mod.slug, lesson.slug),
    url: lessonUrl(course.slug, mod.slug, lesson.slug),
})));
/** The first lesson with no tick, which is where "start" and
    "continue" both point.

    The bookmark is where the reader WAS; what they want is where
    to go next, and those are the same only until they finish the
    lesson they were on. So: the first unticked lesson at or after
    the bookmark, and failing that the first unticked lesson at
    all. Null when the course is finished, which the caller says
    out loud rather than sending somebody back to lesson one. */
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
/* ============================================================
   The sidebar

   Every module and every lesson of the course, a tick on the ones
   that are done, the current one marked, and a percentage per
   module. It is a `<details>` per module so a course with 250
   lessons in it is navigable on a phone, and the module the
   reader is in is the one that starts open.
   ============================================================ */
function sidebar(course, here, open) {
    const read = readSet();
    const nav = el("nav", {
        class: "course-rail",
        "aria-label": `${course.title}: modules and lessons`,
    });
    nav.append(el("a", { class: "course-rail-top", href: courseUrl(course.slug) }, [
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
                        href: lessonUrl(course.slug, mod.slug, lesson.slug),
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
   The four views
   ============================================================ */
/** `/skills/courses/index.html` */
function drawCatalogue(root, courses) {
    const read = readSet();
    root.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, ["কোর্স · Courses"]),
        el("h1", {}, ["Third-party courses"]),
        el("p", { class: "hub-lede" }, [
            `${courses.length} courses, kept here for one person's own study. `
                + "The material is somebody else's and none of it is published: "
                + "every page in this section is behind the admin check.",
        ]),
    ]));
    const deck = el("div", { class: "deck deck-2" });
    for (const course of courses) {
        /* Counted from the ticks rather than stored, which is the rule
           at the top of `CLAUDE.md`: a number about a list is counted
           from the list. */
        const done = [...read].filter((id) => id.startsWith(`${course.slug}/`)).length;
        const card = el("a", {
            class: "card course-card",
            "data-kind": "go",
            href: courseUrl(course.slug),
            "data-done": course.lessons > 0 && done >= course.lessons,
        }, [
            el("div", { class: "card-top" }, [
                el("span", { class: "card-chip mono" }, [`Course ${course.n}`]),
            ]),
            el("h3", { class: "card-title" }, [course.title]),
            el("p", { class: "card-dek" }, [
                `${course.modules} modules, ${course.lessons} lessons`
                    + (course.videos ? `, ${course.videos} with video` : "")
                    + (course.pending ? `. ${course.pending} not imported yet` : ""),
            ]),
            meter(done, course.lessons),
            el("span", { class: "card-go" }, [done ? "Carry on" : "Open the course"]),
        ]);
        deck.append(card);
    }
    root.append(deck);
}
/** `/skills/courses/<course>/index.html`

    The deep link is the point of this page. A reader coming back
    to a course wants the lesson they have not done, not a table
    of contents they have to read to find it. */
function drawCourse(root, course) {
    const rungs = laddered(course);
    const read = readSet();
    const done = rungs.filter((r) => read.has(r.id)).length;
    const next = nextUp(rungs, read);
    root.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, [
            el("a", { href: "/skills/courses/index.html" }, ["Courses"]),
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
                    href: first ? lessonUrl(course.slug, mod.slug, first.slug)
                        : moduleUrl(course.slug, mod.slug),
                }, [mod.title]),
            ]),
            mod.pending
                ? el("p", { class: "card-dek" }, ["Not imported yet."])
                : el("p", { class: "card-dek" }, [`${mod.lessons.length} lessons`]),
            mod.pending ? null : meter(modDone, ids.length),
            mod.pending ? null : el("a", {
                class: "course-mod-link mono",
                href: moduleUrl(course.slug, mod.slug),
            }, ["Module summary"]),
        ]));
    }
    root.append(list);
}
/** `/skills/courses/<course>/<module>/index.html`

    Where the last lesson of a module lands. It is a stopping
    place: what was in the module, what is ticked, and the way on
    to the next one. */
function drawModule(root, course, mod) {
    const read = readSet();
    const ids = mod.lessons.map((l) => lessonId(course.slug, mod.slug, l.slug));
    const done = ids.filter((id) => read.has(id)).length;
    const at = course.modules.findIndex((m) => m.slug === mod.slug);
    const after = course.modules.slice(at + 1).find((m) => !m.pending && m.lessons.length);
    root.append(sidebar(course, null));
    const main = el("div", { class: "course-body" });
    main.append(el("header", { class: "hub-hero" }, [
        el("span", { class: "hub-eyebrow mono" }, [
            el("a", { href: courseUrl(course.slug) }, [course.title]),
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
            el("a", { href: lessonUrl(course.slug, mod.slug, lesson.slug) }, [
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
        el("a", { href: courseUrl(course.slug) }, [
            el("span", { class: "mono" }, ["Back to"]),
            el("strong", {}, [course.title]),
        ]),
        after ? el("a", { href: moduleUrl(course.slug, after.slug) }, [
            el("span", { class: "mono" }, ["Next module"]),
            el("strong", {}, [after.title]),
        ]) : null,
    ]));
    root.append(main);
}
/** `/skills/courses/<course>/<module>/<lesson>.html` */
function drawLesson(root, course, mod, lesson) {
    const rungs = laddered(course);
    const id = lessonId(course.slug, mod.slug, lesson.slug);
    const here = rungs.find((r) => r.id === id) ?? null;
    const at = rungs.findIndex((r) => r.id === id);
    /* Opening moves the bookmark and nothing else. The tick is the
       button below, for the reason at the top of this file. */
    setLast({ id, title: lesson.title, url: lessonUrl(course.slug, mod.slug, lesson.slug) });
    root.append(sidebar(course, here));
    const main = el("article", { class: "course-body course-lesson-page" });
    main.append(el("span", { class: "eyebrow mono" }, [
        el("a", { href: courseUrl(course.slug) }, [course.title]),
        " · ",
        el("a", { href: moduleUrl(course.slug, mod.slug) }, [mod.title]),
        lesson.section ? ` · ${lesson.section}` : "",
    ]));
    main.append(el("h1", {}, [lesson.title]));
    main.append(el("p", { class: "lesson-meta mono" }, [
        `${KIND_WORD[lesson.kind] ?? lesson.kind} · lesson ${lesson.position} of ${mod.lessons.length}`,
    ]));
    /* ---- the player ----
  
       A real `<video>`, served from this site's own origin, and not
       a Drive iframe. The iframe is what the first version had and
       it could never have worked: a private Drive file inside a
       cross-site frame gets no Drive cookie in a modern browser, so
       Drive sees an anonymous request for something that is not
       public and answers "Unable to load video". The Worker holds
       the credential now and streams the bytes from here, where
       there is no third party to be blocked. */
    if (lesson.video) {
        const box = el("div", { class: "course-video" }, [
            el("p", { class: "course-waiting" }, ["Loading the video…"]),
        ]);
        main.append(box);
        void mountVideo(box, lesson.video, lesson.title);
    }
    /* A reading, a quiz or a challenge is a saved Coursera page. It
       is fetched, sanitised by the Worker and rendered HERE.
  
       The first version made it a button out to Drive's viewer, on
       the reasoning that framing somebody else's document would be
       this site pretending to have written it. That is a publishing
       argument and this section is not published: it is one
       person's own study, behind the admin check. A course you
       cannot read on the page is not a course. */
    for (const kind of ["reading", "quiz", "exam"]) {
        const drive = lesson[kind];
        if (!drive)
            continue;
        const box = el("div", { class: "course-reading" }, [
            el("p", { class: "course-waiting" }, [`Loading the ${KIND_WORD[kind].toLowerCase()}…`]),
        ]);
        main.append(box);
        void mountReading(box, drive, kind);
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
        : moduleUrl(course.slug, mod.slug);
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
        refreshRail(course, here);
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
/* ============================================================
   Fetching a lesson's own content

   All three go through this site, never through Drive, for the
   reason at the top of `functions/_lib/drive.ts`.
   ============================================================ */
/** A pass for one file, good for half an hour.

    `<video src>` is the browser fetching a URL on its own, with
    no header this code can add, so the permission has to travel
    in the URL. `functions/_lib/ticket.ts` is why that is a signed
    ticket naming one file rather than the session token. */
async function ticketFor(drive) {
    const answer = await api(`/ticket/${drive}`);
    return answer.ok && answer.data ? answer.data.url : null;
}
function saySo(box, message) {
    box.replaceChildren(el("p", { class: "course-empty" }, [message]));
}
async function mountVideo(box, drive, title) {
    const url = await ticketFor(drive);
    if (!url) {
        saySo(box, "That video could not be opened. If you have just signed in, reload.");
        return;
    }
    /* `preload="metadata"` rather than `auto`: a lesson video is
       tens of megabytes and a reader who opened the page to read
       the transcript should not pay for all of it. Metadata is
       enough for the duration and the scrub bar. */
    box.replaceChildren(el("video", {
        src: url,
        controls: true,
        preload: "metadata",
        playsinline: true,
        title,
    }));
}
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
    box.replaceChildren(body, el("p", { class: "course-original mono" }, [
        el("a", { href: driveUrl(drive), target: "_blank", rel: "noopener" }, [`Open the original ${kind} in Drive`]),
    ]));
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
        void ticketFor(drive).then((url) => {
            if (url)
                window.open(url, "_blank", "noopener");
            else
                link.after(el("span", { class: "course-empty" }, [" could not be opened"]));
        });
    });
    return el("li", {}, [link, el("span", { class: "mono" }, [ext])]);
}
/** Redraw the rail after a tick, so the sidebar's ticks and bars
    agree with the button that was just pressed. Cheap: a course
    is a few hundred nodes and this happens on a click. */
function refreshRail(course, here) {
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
    rail.replaceWith(sidebar(course, here, open));
}
/** Read the address rather than being told by the page.

    The four routes are shells with no data in them, so there is
    nothing for a shell to tell this module that the URL does not
    already say, and a `data-` attribute per route would be a
    fifth place that knows what a course address looks like. */
export function whereAmI(path) {
    const parts = path.replace(/^\/skills\/courses\/?/, "").split("/").filter(Boolean);
    if (!parts.length || parts[0] === "index.html")
        return { view: "catalogue" };
    if (parts.length === 2 && parts[1] === "index.html") {
        return { view: "course", course: parts[0] };
    }
    if (parts.length === 3 && parts[2] === "index.html") {
        return { view: "module", course: parts[0], module: parts[1] };
    }
    if (parts.length === 3) {
        return {
            view: "lesson",
            course: parts[0],
            module: parts[1],
            lesson: parts[2].replace(/\.html$/i, ""),
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
        note(root, "Not a page here", "That address is not a course, a module or a lesson.");
        return;
    }
    if (!current()) {
        note(root, "This section is private", "It holds one person's own copy of a third-party course, so it is not published. "
            + "Sign in to open it.", el("a", { class: "btn btn-solid", href: "/account.html" }, ["Sign in"]));
        return;
    }
    if (where.view === "catalogue") {
        const answer = await api("");
        if (!answer.ok || !answer.data)
            return refuse(root, answer);
        root.replaceChildren();
        drawCatalogue(root, answer.data.courses);
        return;
    }
    const answer = await api(`/${where.course}`);
    if (!answer.ok || !answer.data)
        return refuse(root, answer);
    const course = answer.data.course;
    root.replaceChildren();
    if (where.view === "course")
        return drawCourse(root, course);
    const mod = course.modules.find((m) => m.slug === where.module);
    if (!mod) {
        note(root, "No such module", `${course.title} has no module called “${where.module}”.`);
        return;
    }
    if (where.view === "module")
        return drawModule(root, course, mod);
    const lesson = mod.lessons.find((l) => l.slug === where.lesson);
    if (!lesson) {
        note(root, "No such lesson", `${mod.title} has no lesson called “${where.lesson}”.`);
        return;
    }
    drawLesson(root, course, mod, lesson);
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
        note(root, "Signed out", "Your session has expired. Sign in again to carry on.", el("a", { class: "btn btn-solid", href: "/account.html" }, ["Sign in"]));
        return;
    }
    note(root, "That did not load", answer.message);
}
/* The entry point, guarded on `document` existing at all.

   Not defensive programming for its own sake: `courses.test.mjs`
   imports this module to reach `whereAmI()` before it has built a
   DOM, and a module that throws on import cannot be tested by the
   thing that would catch it throwing. In a browser the guard is
   always true. */
if (typeof document !== "undefined") {
    const root = document.getElementById("course-app");
    if (root)
        void start(root);
}
