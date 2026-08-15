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

import { initAccount, current, sendLink, signInWithGoogle, signOut } from "/account.js";

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/** First letter of a name, for the button when signed in. */
const initial = (name) => (name ?? "?").trim().charAt(0).toUpperCase() || "?";

let dialog;

/* ============================================================
   The panel
   ============================================================ */

function buildDialog() {
  const email = el("input", {
    type: "email", id: "signin-email", required: true,
    placeholder: "you@example.com", autocomplete: "email",
  });
  const note = el("p", { className: "signin-note", id: "signin-note" });

  const form = el("form", { className: "signin-form", noValidate: true },
    el("label", { htmlFor: "signin-email", textContent: "Your email" }),
    email,
    el("button", { className: "btn btn-solid", type: "submit", textContent: "Email me a link" })
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const address = email.value.trim();
    if (!address || !address.includes("@")) {
      note.textContent = "That does not look like an email address.";
      note.dataset.state = "warn";
      return;
    }
    const button = form.querySelector("button");
    button.disabled = true;
    button.textContent = "Sending…";
    try {
      await sendLink(address);
      note.dataset.state = "ok";
      note.textContent = `Sent. Open the link in the email, on this device or any other. `
        + "It signs you in and expires after an hour.";
      form.hidden = true;
    } catch (err) {
      note.dataset.state = "warn";
      note.textContent = err.message || "Could not send that. Try again in a minute.";
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
  dialog ??= buildDialog();
  const user = current();
  if (user) dialog.replaceChildren(buildAccountPanel(user));
  else if (!dialog.querySelector(".signin-form")) {
    // Coming back from a signed-in state: rebuild the form.
    dialog.remove();
    dialog = buildDialog();
  }
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
  await initAccount();
  paintButton(button);
}
