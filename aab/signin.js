/* ============================================================
   signin.ts: the button in the corner, and the menu behind it.

   ---- what this replaces, and why ----

   A `<dialog>` opened with `showModal()`. Pressing the account
   button dimmed the whole site, took the focus, and put a 400px
   card in the middle of the screen holding either a sign-in form
   or a name and two buttons. That is the right furniture for a
   decision the page cannot continue without, and wrong for every
   one of the things it was actually being used for: seeing which
   account you are on, going to your reading list, signing out.
   None of those is modal. All of them are a menu.

   So it is a menu. It hangs off the button on a laptop, it comes
   up from the bottom edge on a phone, Escape closes it, clicking
   anywhere else closes it, and the page behind it is never dimmed
   or frozen. The one thing that IS modal in feel, the sign-in
   form itself, is the same panel: it is still a small amount of
   typing that belongs next to the button that asked for it, and a
   reader who opens it by accident should be able to dismiss it by
   looking away.

   ---- the rule this file has to keep ----

   From archive/TRANSITION.md: nothing on the site requires an
   account. Signed out, this is one word in a corner and every
   page reads exactly as it did. Signed in, it is a name and a way
   into what the account holds.

   ---- where it is mounted ----

   `.top-tools` is the little group at the right end of the bar,
   and it is the same class on both bars this site has: the top
   bar every React page renders, and the slim bar the four
   practice books and the two error pages carry. The menu itself
   is appended to `<body>` and positioned against the button,
   which is what lets it escape the bar's `overflow` and its
   stacking context without either of them having to know.
   ============================================================ */
import { initAccount, current, sendLink, signInWithGoogle, signOut, arrivalError, getProfile, cachedProfile, } from "/account.js";
import { startSync } from "/sync.js";
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
/** First letter of a name, for the button when signed in. */
const initial = (name) => (name ?? "?").trim().charAt(0).toUpperCase() || "?";
/** The reader's picture, over the initial rather than instead of
    it, and the same in the bar as in the menu.

    `referrerPolicy` because the provider hosting the picture has
    no business being told which page of this site it is on, and
    an `error` handler because an avatar URL outlives nothing:
    Google rotates them, and a broken image in a circle is worse
    than the letter that was already there. */
function picture(user) {
    if (!user.avatar)
        return null;
    const img = el("img", {
        src: user.avatar, alt: "", decoding: "async",
        referrerPolicy: "no-referrer",
    });
    img.addEventListener("error", () => img.remove());
    return img;
}
/* ============================================================
   Where the menu goes, and who is responsible for it

   ---- the platform does the hard half ----

   The menu is a `popover`. That is not a nicety: `popover="auto"`
   is the browser's own answer to exactly this widget, and it
   brings four behaviours that were previously four hand-written
   listeners each with its own edge case.

     the top layer      it paints above everything, with no
                        z-index and without caring that the top
                        bar has a stacking context of its own.
     light dismiss      a click anywhere else closes it, including
                        a click inside a cross-origin iframe or on
                        the scrollbar, which a `pointerdown`
                        listener on `document` does not catch.
     Escape             handled, and correctly nested if anything
                        else is ever open above it.
     focus              moved in on open and RETURNED to the
                        button on close, which is the part
                        hand-written menus almost always get
                        wrong and which a keyboard reader feels
                        immediately.

   So this file listens for `toggle` to keep `aria-expanded` and
   the page's own attribute honest, and does not implement any of
   the four.

   ---- and the placement, in two ways ----

   CSS anchor positioning is the right answer and is not yet
   everywhere. Where it exists, `position-anchor` and
   `position-area` in the stylesheet put the menu under the button
   and keep it there through a scroll, with no JavaScript running
   at all. Where it does not, the two custom properties written
   below are the fallback, and the listeners that maintain them
   are added ONLY in that case: a browser that can do this
   natively should not be paying for a scroll handler.

   The phone case is neither. Below 640px the menu is a sheet
   against the bottom edge, decided by a media query, because a
   dropdown hanging off a 36px button is not what a thumb wants.
   ============================================================ */
const ANCHORED = CSS.supports?.("anchor-name: --a") ?? false;
function place(menu, button) {
    if (ANCHORED)
        return;
    const box = button.getBoundingClientRect();
    /* Right-aligned to the button, because the button is at the
       right end of the bar and a menu that opened leftwards from
       there would run off the screen on a narrow laptop. */
    menu.style.setProperty("--menu-top", `${Math.round(box.bottom + 8)}px`);
    menu.style.setProperty("--menu-right", `${Math.round(Math.max(8, window.innerWidth - box.right))}px`);
}
/* ============================================================
   The panel, in its two faces
   ============================================================ */
/* One note, whichever face the menu is showing. It carries the
   "check your email" line and anything a provider came back
   complaining about, and it used to live inside the signed-out
   form: signing in while already signed in put the account panel
   over the top of it and the complaint was never seen. */
const note = el("p", { className: "signin-note", id: "signin-note" });
function say(text, state) {
    note.textContent = text ?? "";
    if (state)
        note.dataset.state = state;
    else
        delete note.dataset.state;
}
const DESTINATIONS = [
    { href: "/account.html", icon: "person", label: "Your account",
        note: "everything below, in one page" },
    { href: "/account.html#reading-list", icon: "keep", label: "Reading list",
        note: "what you kept for later" },
    { href: "/account.html#notes", icon: "note", label: "Your notes",
        note: "what you wrote in the margin" },
    { href: "/account.html#targets", icon: "target", label: "Targets",
        note: "what you are aiming for" },
    { href: "/account.html#scenarios", icon: "chart", label: "Saved scenarios",
        note: "filled-in calculators" },
    { href: "/account.html#preferences", icon: "sliders", label: "Reading preferences",
        note: "type size, width, theme" },
];
/* Drawn rather than fetched, like every other icon on this site.
   One path each, at 24px, stroked. */
const PATHS = {
    person: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
    keep: "M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z",
    note: "M4 4h16v11H9l-5 4V4z",
    target: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zm0-5a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
    chart: "M4 20V10m5 10V4m5 16v-7m5 7V8",
    sliders: "M4 7h10M18 7h2M4 17h4M12 17h8M16 4v6M8 14v6",
    out: "M15 4h3a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3M10 8l-4 4 4 4M6 12h9",
};
function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "1.6");
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");
    svg.setAttribute("aria-hidden", "true");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", PATHS[name]);
    svg.append(path);
    return svg;
}
const item = ({ href, icon: name, label, note: sub }) => el("a", { className: "acc-item", href, role: "menuitem" }, el("span", { className: "acc-ico" }, icon(name)), el("span", { className: "acc-text" }, el("strong", { textContent: label }), el("small", { textContent: sub })));
/** Signed in: who, then where to. */
function accountFace(user) {
    const out = el("button", {
        className: "acc-item acc-out", type: "button", role: "menuitem",
    }, el("span", { className: "acc-ico" }, icon("out")), el("span", { className: "acc-text" }, el("strong", { textContent: "Sign out" }), el("small", { textContent: "on this device only" })));
    out.addEventListener("click", async () => {
        close();
        await signOut();
    });
    return el("div", { className: "acc-body" }, el("div", { className: "acc-who" }, el("span", { className: "acc-avatar", "aria-hidden": "true" }, initial(user.name), picture(user)), el("span", { className: "acc-who-text" }, el("strong", { textContent: user.name || "Reader" }), user.email ? el("small", { textContent: user.email }) : null)), el("div", { className: "acc-list", role: "menu" }, ...DESTINATIONS.map(item), el("span", { className: "acc-rule", role: "separator" }), out), note);
}
/** Signed out: why, then two ways in. */
function signInFace() {
    const email = el("input", {
        type: "email", id: "signin-email", required: true,
        placeholder: "you@example.com", autocomplete: "email",
    });
    const form = el("form", { className: "signin-form", noValidate: true }, el("label", { htmlFor: "signin-email", textContent: "Your email" }), email, el("button", { className: "btn btn-solid", type: "submit",
        textContent: "Email me a link" }));
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const address = email.value.trim();
        if (!address || !address.includes("@")) {
            say("That does not look like an email address.", "warn");
            return;
        }
        const button = form.querySelector("button");
        button.disabled = true;
        button.textContent = "Sending…";
        try {
            await sendLink(address);
            say("Sent. Open the link in the email, on this device or any other. "
                + "It signs you in and expires after an hour.", "ok");
            form.hidden = true;
        }
        catch (err) {
            say(err.message || "Could not send that. Try again in a minute.", "warn");
        }
        finally {
            button.disabled = false;
            button.textContent = "Email me a link";
        }
    });
    return el("div", { className: "acc-body acc-body-in" }, el("span", { className: "signin-kicker mono", textContent: "Reiad's Library" }), el("h2", { textContent: "Sign in" }), el("p", { className: "signin-why" }, "So your place in a course, what you have kept and what you have "
        + "written follow you from a phone to a laptop. Everything on this "
        + "site is readable without an account, and stays that way."), el("button", {
        className: "btn btn-ghost signin-google", type: "button",
        textContent: "Continue with Google",
        onclick: () => signInWithGoogle(),
    }), el("span", { className: "signin-or mono", textContent: "or" }), form, note);
}
/* ============================================================
   Opening and closing

   One element, rebuilt on every open rather than toggled: the two
   faces share nothing but the note, and a menu that remembers the
   last person who was signed in is a bug waiting to be filed.
   ============================================================ */
let menu = null;
let anchor = null;
const reposition = () => { if (menu && anchor)
    place(menu, anchor); };
function close() {
    /* `hidePopover` rather than removing the node, so the browser
       runs its own close: the top layer is released, the focus goes
       back to the button, and the `toggle` handler below does the
       tidying in one place whoever asked for the close. */
    if (menu?.isConnected)
        menu.hidePopover();
}
function open(button) {
    if (menu) {
        close();
        return;
    }
    const user = current();
    say(null);
    menu = el("div", {
        className: "acc-menu",
        popover: "auto",
        id: "account-menu",
        "data-face": user ? "account" : "signin",
    }, user ? accountFace(user) : signInFace());
    document.body.append(menu);
    anchor = button;
    /* One `toggle` handler for both directions, which is what makes
       a light dismiss and a click on the button leave the page in
       the same state. Anything that closes this menu, including the
       Escape key nobody here listens for, comes through here. */
    menu.addEventListener("toggle", (e) => {
        const open = e.newState === "open";
        button.setAttribute("aria-expanded", String(open));
        /* So the stylesheet can lock the page behind a bottom sheet on
           a phone, where a menu covering half the screen over a page
           that still scrolls is a page that scrolls under your thumb. */
        document.documentElement.toggleAttribute("data-acc-menu", open);
        if (open) {
            if (!ANCHORED) {
                addEventListener("resize", reposition);
                /* Capturing, because the thing that scrolls is the column
                   inside the shell rather than the window on some pages. */
                addEventListener("scroll", reposition, true);
            }
            return;
        }
        removeEventListener("resize", reposition);
        removeEventListener("scroll", reposition, true);
        menu?.remove();
        menu = null;
    });
    place(menu, button);
    menu.showPopover();
    /* The first thing in it, so a keyboard reader lands inside the
       menu rather than tabbing the page to reach it. The browser
       focuses the popover itself; this moves one step further in,
       and `preventScroll` stops focusing the top of a bottom sheet
       from jumping the page behind it. */
    menu.querySelector("a, button, input")?.focus({ preventScroll: true });
}
/* A link inside the menu is a navigation, and a popover that
   stayed open across it would reopen itself on the page it went
   to. Everything else that closes this menu is the browser's. */
document.addEventListener("click", (e) => {
    if (menu && e.target?.closest?.(".acc-item[href]"))
        close();
});
/* ============================================================
   The button in the bar
   ============================================================ */
function paintButton(button) {
    const user = current();
    button.replaceChildren(user ? initial(user.name) : "Sign in");
    if (user) {
        const face = picture(user);
        if (face)
            button.append(face);
    }
    button.dataset.signedIn = String(!!user);
    button.setAttribute("aria-label", user
        ? `Signed in as ${user.name}. Open your account menu.`
        : "Sign in to Reiad's Library");
    button.title = button.getAttribute("aria-label") ?? "";
}
export async function initSignIn() {
    const bar = document.querySelector(".top-tools");
    if (!bar)
        return;
    const button = el("button", {
        className: "icon-btn account-btn", type: "button",
        "aria-haspopup": "menu", "aria-expanded": "false",
    });
    button.addEventListener("click", () => open(button));
    /* After the theme toggle, which is the last thing in the row, so
       the order does not change for anyone used to it. */
    bar.append(button);
    paintButton(button);
    document.addEventListener("account:changed", () => {
        paintButton(button);
        /* The menu is about who is signed in, so it cannot survive
           that changing underneath it. */
        close();
    });
    /* Synchronous: it reads the session out of the URL or out of
       this device and returns. Nothing here waits on a network. */
    initAccount();
    paintButton(button);
    /* And if somebody is signed in, their progress catches up with
       them. Signed out this makes no request. */
    startSync();
    /* The profile is remembered on this device so the home page can
       read it without waiting, and it is refreshed here rather than
       on every page: `following` and `pace` change on one page, and
       asking Postgres for them on every article would be a request
       per page view to learn something that changes twice a year. */
    if (current() && !cachedProfile())
        getProfile().catch(() => { });
    /* Landing back from a provider with something to say deserves
       the menu opened, not a silent page. */
    if (arrivalError) {
        open(button);
        say(arrivalError, "warn");
    }
}
