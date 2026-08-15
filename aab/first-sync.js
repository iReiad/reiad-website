/* ============================================================
   first-sync.js: the one question signing in is allowed to ask.

   Loaded lazily by sync.js, and only in the case that actually
   needs deciding: this browser already has progress in it, AND
   the account already has its own. Everything else merges
   silently, because merging with nothing cannot lose anything.

   Why it is a question at all is in the long note in sync.js. The
   short version: signing in used to push whatever was in the
   browser into the account, permanently, with nothing said. That
   is right on your own laptop and wrong on a borrowed phone, and
   the site cannot tell those apart. The person can.

   Three answers, and the wording says what each one COSTS rather
   than what it does, because "merge" and "replace" are the same
   word to most people until something has gone.
   ============================================================ */

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/**
 * Ask, and resolve with "merge", "account" or "device".
 *
 * Dismissing it resolves "account": the cautious default belongs
 * on the side of the shared thing. Closing a dialog you did not
 * understand should never be the action that changes what is
 * stored for every one of your devices.
 */
export function openChoice({ account = 0, device = 0 } = {}) {
  return new Promise((resolve) => {
    let answered = null;

    const pick = (value) => {
      answered = value;
      dialog.close();
    };

    const choice = (value, title, cost) =>
      el("button", { className: "first-sync-choice", type: "button",
                     onclick: () => pick(value) },
        el("strong", { textContent: title }),
        el("small", { textContent: cost })
      );

    const dialog = el("dialog", { className: "first-sync" },
      el("div", { className: "first-sync-body" },
        el("span", { className: "eyebrow mono", textContent: "Signing in" }),
        el("h2", { textContent: "This browser already has progress in it." }),
        el("p", { className: "measure", textContent:
          `Your account has ${account} thing${account === 1 ? "" : "s"} saved, `
          + `and this browser has ${device}. What should happen to the ones here?` }),

        el("div", { className: "first-sync-choices" },
          choice("merge", "Keep both",
            "Everything ticked in either place stays ticked. Nothing is lost."),
          choice("account", "Use my account's",
            "What is on this browser is dropped. Your other devices are untouched."),
          choice("device", "Use this browser's",
            "The account is replaced by what is here. Progress from your other devices is lost.")
        ),

        el("p", { className: "first-sync-note", textContent:
          "Asked once for this account on this browser. After this, the two "
          + "just stay in step." })
      )
    );

    dialog.addEventListener("close", () => {
      dialog.remove();
      resolve(answered ?? "account");
    });

    document.body.append(dialog);
    dialog.showModal();
  });
}
