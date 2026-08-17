/* ============================================================
   keep.ts: keep this page, and write in the margin of it.

   Two controls in one row, under the byline of a piece and under
   the meta line of a lesson. They are the same row on both
   because they are the same two questions, and a reader who
   learned them on an article should not have to find them again
   in a school.

   ---- it is an account feature and it says so by not being
        there ----

   Signed out, this appends nothing. Not a greyed-out button, not
   a "sign in to save" prompt: nothing. Every other part of this
   site works without an account and the ones that cannot are
   quiet about it rather than advertising. A reader who has never
   signed in has no idea this exists, which is the correct amount
   of nagging, and the moment they do sign in the row appears on
   the page they are already reading.

   ---- one row per page, two facts about it ----

   `saved` and `note` are columns of the same row, so both buttons
   write through `keepPage()` in `/saved.js` and both read the
   same state back. The alternative, two endpoints, is how a page
   ends up saved-but-note-lost when somebody taps both quickly.

   ---- and it runs after hydration ----

   Loaded through `next/components/scripts.tsx`, like every module
   a route loads, for the reason that file is entirely about: it
   appends nodes to markup React has just adopted, and running
   before hydration would have React remove every one of them.
   ============================================================ */
import { current } from "/account.js";
import { libraryRow, keepPage } from "/saved.js";
function subject() {
    const piece = document.querySelector("article.article[data-slug]");
    if (piece) {
        return {
            kind: "piece",
            title: document.querySelector("article.article h1")?.textContent?.trim()
                ?? document.title.split("·")[0].trim(),
        };
    }
    const lesson = document.querySelector("article[data-school]");
    if (lesson && !lesson.hasAttribute("data-soon")) {
        return {
            kind: "lesson",
            /* The lesson's own title attribute rather than the heading:
               the heading carries an inline SVG and, in three of the
               four schools, a second line in another language. */
            title: lesson.getAttribute("data-lesson-title")
                ?? lesson.getAttribute("data-teil-title")
                ?? lesson.getAttribute("data-part-title")
                ?? document.querySelector("article h1")?.textContent?.trim()
                ?? "",
        };
    }
    return null;
}
/** Where the row goes: under whichever line ends the page's
    preamble. Both are the last thing before the prose starts. */
const anchor = () => document.querySelector("article .byline")
    ?? document.querySelector("article .lesson-meta")
    ?? null;
/* ============================================================
   The row
   ============================================================ */
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
    node.append(...kids.filter((k) => Boolean(k)));
    return node;
};
/* Drawn rather than fetched, for the reason every icon on this
   site is: an SVG in a file is a request, and these two are
   twenty characters each. */
const ICON = {
    keep: "M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z",
    note: "M4 4h16v11H9l-5 4V4z",
};
const icon = (name) => {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", ICON[name]);
    svg.append(path);
    return svg;
};
export function initKeep(root = document) {
    if (!current())
        return null;
    /* Once per page. The module runs this on import and the
       `account:changed` handler at the foot of this file runs it
       again after clearing what was there, so the only way to reach
       this twice is to call it twice, and a page with two Save
       buttons on it, each holding its own idea of whether the page
       is kept, is worse than one that quietly does nothing the
       second time. */
    if (document.querySelector(".keep-bar"))
        return null;
    const what = subject();
    const where = anchor();
    if (!what || !where)
        return null;
    const url = location.pathname;
    /* What the account says about this page. Nothing is drawn until
       it answers, because a Save button that says "Save" for a
       second and then flips to "Kept" is a button that has told the
       reader something false. */
    let row = null;
    const keepBtn = el("button", {
        className: "keep-btn", type: "button", "aria-pressed": "false",
    }, icon("keep"), el("span", { className: "keep-word", textContent: "Save" }));
    const noteBtn = el("button", {
        className: "keep-btn", type: "button", "aria-expanded": "false",
    }, icon("note"), el("span", { className: "keep-word", textContent: "Add a note" }));
    const say = el("span", { className: "keep-said", role: "status" });
    const bar = el("div", { className: "keep-bar", hidden: true }, keepBtn, noteBtn, say);
    /* The note itself, under the row and closed until asked for.
       A textarea rather than a contenteditable: this is a margin
       note, not writing, and `aab/editor.js` exists for the other
       thing. Nothing here is rendered as HTML anywhere. */
    const field = el("textarea", {
        className: "keep-note", rows: 5, maxLength: 20000,
        placeholder: "For your eyes only. Nobody else can read this.",
        "aria-label": "Your note on this page",
    });
    const saveNote = el("button", {
        className: "btn btn-solid btn-small", type: "button", textContent: "Save the note",
    });
    const noteSaid = el("span", { className: "keep-said", role: "status" });
    const panel = el("div", { className: "keep-panel", hidden: true }, field, el("div", { className: "keep-panel-actions" }, saveNote, noteSaid));
    const paint = () => {
        const kept = Boolean(row?.saved);
        const has = Boolean(row?.note);
        keepBtn.setAttribute("aria-pressed", String(kept));
        keepBtn.toggleAttribute("data-on", kept);
        keepBtn.querySelector(".keep-word").textContent = kept ? "Kept" : "Save";
        noteBtn.toggleAttribute("data-on", has);
        noteBtn.querySelector(".keep-word").textContent = has ? "Your note" : "Add a note";
    };
    const write = async (patch, tell, note) => {
        tell.textContent = "";
        try {
            row = await keepPage({ url, title: what.title, kind: what.kind, ...patch });
            /* The trigger in the migration deletes a row that has
               emptied itself, and PostgREST hands back what it wrote
               rather than what survived, so an unsave that removed the
               row comes back looking saved. Reading the flags out of
               the patch rather than the answer is what keeps the button
               honest. */
            if (patch.saved === false && !(row?.note))
                row = null;
            paint();
            tell.textContent = note;
            setTimeout(() => { tell.textContent = ""; }, 2600);
        }
        catch (err) {
            tell.textContent = err.message || "That did not save.";
        }
    };
    keepBtn.addEventListener("click", () => {
        const next = !row?.saved;
        write({ saved: next }, say, next ? "Kept. It is on your reading list." : "Taken off your list.");
    });
    noteBtn.addEventListener("click", () => {
        const open = panel.hidden;
        panel.hidden = !open;
        noteBtn.setAttribute("aria-expanded", String(open));
        if (open)
            field.focus();
    });
    saveNote.addEventListener("click", () => {
        const text = field.value.trim();
        /* Emptying the box is how a note is deleted, and it says so
           rather than silently keeping an empty one. */
        write({ note: text }, noteSaid, text ? "Saved." : "Note removed.");
    });
    where.after(bar, panel);
    libraryRow(url).then((found) => {
        row = found;
        if (found?.note)
            field.value = found.note;
        paint();
        bar.hidden = false;
    }).catch(() => {
        /* The account could not be reached. The row stays hidden
           rather than showing two buttons that will fail: an unusable
           control is worse than none, because a reader presses it. */
    });
    void root;
    return bar;
}
/* Runs on import, because a reading page loads this module for no
   other reason, and does nothing at all when nobody is signed in
   or when the page is neither a piece nor a lesson. */
initKeep();
/* Signing in on the page you are reading should put the row
   there, and signing out should take it away, without a reload.
   Rebuilt rather than toggled: the row's whole content is the
   account's answer about this page, and there is none to show
   when there is no account. */
document.addEventListener("account:changed", () => {
    document.querySelectorAll(".keep-bar, .keep-panel").forEach((n) => n.remove());
    initKeep();
});
