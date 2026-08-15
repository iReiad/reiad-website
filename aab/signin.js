/* ============================================================
   signin.js: the one button, and the panel behind it.

   Every page's header ends with the same three buttons, written
   into fifty-odd HTML files and three generators. Rather than edit
   all of them, this puts a fourth one in beside them at runtime,
   which is how the menu and the search buttons already work.

   The rule this file has to keep, from TRANSITION.md: nothing on
   the site requires an account. Signed out, this is one word in a
   corner and every page reads exactly as it did before. Signed in,
   it is a name and a way to leave.

   TRANSITION.md, Stage 5.
   ============================================================ */

import {
  initAccount, current, sendLink, signInWithGoogle, signOut, arrivalError,
} from "/account.js";
import { startSync } from "/sync.js";

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/** First letter of a name, for the button when signed in. */
const initial = (name) => (name ?? "?").trim().charAt(0).toUpperCase() || "?";

let dialog;

/* One note, whichever face the panel is showing. It carries the
   "check your email" line and anything a provider came back
   complaining about, and it used to live inside the signed-out
   form: signing in while already signed in put the account panel
   over the top of it and the complaint was never seen. */
const note = document.createElement("p");
note.className = "signin-note";
note.id = "signin-note";

function say(text, state) {
  note.textContent = text ?? "";
  if (state) note.dataset.state = state;
  else delete note.dataset.state;
}

/* ============================================================
   The panel
   ============================================================ */

function buildDialog(body) {
  const email = el("input", {
    type: "email", id: "signin-email", required: true,
    placeholder: "you@example.com", autocomplete: "email",
  });

  const form = el("form", { className: "signin-form", noValidate: true },
    el("label", { htmlFor: "signin-email", textContent: "Your email" }),
    email,
    el("button", { className: "btn btn-solid", type: "submit", textContent: "Email me a link" })
  );

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
    } catch (err) {
      say(err.message || "Could not send that. Try again in a minute.", "warn");
    } finally {
      button.disabled = false;
      button.textContent = "Email me a link";
    }
  });

  const google = el("button", {
    className: "btn btn-ghost signin-google", type: "button",
    textContent: "Continue with Google",
    onclick: () => signInWithGoogle(),
  });

  if (body) {
    const shell = el("dialog", { className: "signin", id: "signin-sheet" }, body);
    body.append(note);
    document.body.append(shell);
    return shell;
  }

  dialog = el("dialog", { className: "signin", id: "signin-sheet" },
    el("div", { className: "signin-body" },
      el("span", { className: "mono signin-kicker", textContent: "Reiad's Library" }),
      el("h2", { textContent: "Sign in" }),
      el("p", { className: "signin-why" },
        "So your place in a course follows you from a phone to a laptop, "
        + "and so a comment has a name on it. Everything on this site is "
        + "readable without an account, and stays that way."),
      google,
      el("span", { className: "signin-or mono", textContent: "or" }),
      form,
      note,
      el("button", {
        className: "btn btn-ghost signin-close", type: "button",
        textContent: "Not now", onclick: () => dialog.close(),
      })
    )
  );

  document.body.append(dialog);
  return dialog;
}

/** The panel, when it is a name rather than a form. */
function buildAccountPanel(user) {
  return el("div", { className: "signin-body" },
    el("span", { className: "mono signin-kicker", textContent: "Signed in" }),
    el("h2", { textContent: user.name || "Reader" }),
    user.email ? el("p", { className: "signin-why", textContent: user.email }) : null,
    el("a", {
      className: "btn btn-solid", href: "/account.html", textContent: "Your account",
    }),
    el("button", {
      className: "btn btn-ghost", type: "button", textContent: "Sign out",
      onclick: async () => { await signOut(); dialog.close(); },
    }),
    el("button", {
      className: "btn btn-ghost signin-close", type: "button",
      textContent: "Close", onclick: () => dialog.close(),
    })
  );
}

function openPanel() {
  const user = current();

  /* Rebuilt each time rather than toggled: the two faces share
     nothing but the note, and a panel that remembers the last
     person who was signed in is a bug waiting to be filed. */
  if (dialog) dialog.remove();
  dialog = user ? buildDialog(buildAccountPanel(user)) : buildDialog();
  dialog.showModal();
}

/* ============================================================
   The button in the header
   ============================================================ */

function paintButton(button) {
  const user = current();
  button.textContent = user ? initial(user.name) : "Sign in";
  button.dataset.signedIn = String(!!user);
  button.setAttribute("aria-label", user
    ? `Signed in as ${user.name}. Open your account.`
    : "Sign in to Reiad's Library");
  button.title = button.getAttribute("aria-label");
}

export async function initSignIn() {
  const header = document.querySelector(".header-inner");
  if (!header) return;

  const button = el("button", { className: "icon-btn account-btn", type: "button" });
  button.addEventListener("click", openPanel);

  /* After the theme toggle, which is the last thing in the row, so
     the header's order does not change for anyone used to it. */
  header.append(button);
  paintButton(button);

  document.addEventListener("account:changed", () => paintButton(button));

  /* Last, and deliberately not awaited by anything above: a reader
     who never signs in must not wait on a network call to see a
     header. */
  /* Synchronous: it reads the session out of the URL or out of
     this device and returns. Nothing here waits on a network. */
  initAccount();
  paintButton(button);

  /* And if somebody is signed in, their progress catches up with
     them. Signed out this returns immediately and makes no
     request. */
  startSync();

  /* Landing back from a provider with something to say deserves the
     panel opened, not a silent page. It is shown whichever face the
     panel wears, because a failed sign-in while already signed in
     is still worth reading. */
  if (arrivalError) {
    say(arrivalError, "warn");
    openPanel();
  }
}
