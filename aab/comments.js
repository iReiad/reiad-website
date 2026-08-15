/* ============================================================
   comments.js: the thread under a piece.

   Three states, and the quiet one matters most:

     signed out    the thread, and a line saying what signing in
                   would let you do. Never a wall: every comment
                   already approved is readable by anybody, which
                   is rule 7 in TRANSITION.md.
     signed in     the same, plus a box.
     just posted   a note saying it is waiting to be approved,
                   because a comment that vanishes on submit looks
                   exactly like a comment that failed.

   ---- nothing here is HTML ----

   Every comment is written with textContent. Not "sanitised",
   never parsed: a body is text on the way in, text in the column,
   and text on the way out. Every injection bug this site has had
   came from parsing something.

   ---- and it is allowed to not exist ----

   The whole module is loaded lazily by the article page and every
   failure is swallowed. A piece with a broken comment thread is a
   piece that reads perfectly and has no thread, which is what
   rule 8 asks for.

   TRANSITION.md, Stage 7.
   ============================================================ */

import { token, current } from "/account.js";

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

const when = (iso) => {
  const then = Date.parse(iso);
  if (!Number.isFinite(then)) return "";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(then).toLocaleDateString("en-GB",
    { day: "numeric", month: "short", year: "numeric" });
};

/** The initial in the little circle, which is all the avatar there is. */
const initial = (name) => (String(name).trim()[0] ?? "?").toUpperCase();

/* ============================================================
   Drawing one
   ============================================================ */

function commentCard(c, { onReply } = {}) {
  return el("li", { className: "comment" },
    el("span", { className: "comment-who" },
      el("span", { className: "comment-mark", textContent: initial(c.author_name) }),
      el("strong", { textContent: c.author_name || "Reader" }),
      el("span", { className: "mono comment-when", textContent: when(c.created_at) })
    ),
    // textContent, always. See the note at the top of this file.
    el("p", { className: "comment-body", textContent: c.body }),
    onReply
      ? el("button", { className: "link-btn comment-reply", type: "button",
                       textContent: "Reply", onclick: () => onReply(c) })
      : null,
    c.replies?.length
      ? el("ul", { className: "comment-replies" },
          ...c.replies.map((r) => commentCard(r)))
      : null
  );
}

/* ============================================================
   The whole thread
   ============================================================ */

export async function mountComments(host, { slug, section = "insights" } = {}) {
  if (!host || !slug) return;

  const list = el("ul", { className: "comment-list" });
  const note = el("p", { className: "signin-note comment-note" });
  const box = el("textarea", {
    className: "comment-box", rows: 3, maxLength: 4000,
    placeholder: "Say something useful.",
  });

  let replyingTo = null;
  const replyLine = el("p", { className: "comment-replying", hidden: true });

  const say = (text, state) => {
    note.textContent = text ?? "";
    if (state) note.dataset.state = state; else delete note.dataset.state;
  };

  const setReply = (c) => {
    replyingTo = c;
    replyLine.hidden = !c;
    if (c) {
      replyLine.replaceChildren(
        `Replying to ${c.author_name || "Reader"}. `,
        el("button", { className: "link-btn", type: "button", textContent: "Cancel",
                       onclick: () => setReply(null) })
      );
      box.focus();
    }
  };

  async function draw() {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      const rows = data?.comments ?? [];

      if (!rows.length) {
        list.replaceChildren(el("li", { className: "comment-empty muted",
          textContent: "No comments yet." }));
        return;
      }
      list.replaceChildren(...rows.map((c) => commentCard(c, { onReply: setReply })));
    } catch {
      /* A thread that will not load is not an error worth shouting
         about on somebody's reading page. */
      list.replaceChildren();
    }
  }

  const send = el("button", { className: "btn btn-solid", type: "submit", textContent: "Post" });

  const form = el("form", { className: "comment-form", hidden: true },
    replyLine, box,
    el("div", { className: "comment-actions" }, send,
      el("span", { className: "mono comment-rule",
        textContent: "Every comment is read before it appears." })
    )
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = box.value.trim();
    if (text.length < 2) { say("There is nothing to post yet.", "warn"); return; }

    send.disabled = true;
    try {
      const access = await token();
      if (!access) { say("Your session has expired. Sign in again.", "warn"); return; }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          slug, section, body: text,
          parent_id: replyingTo?.id ?? null,
        }),
      });
      const data = await res.json().catch(() => null);

      if (data?.ok) {
        box.value = "";
        setReply(null);
        /* Said plainly, because a comment that disappears on submit
           looks exactly like one that failed to send. */
        say("Thank you. It is waiting to be read, and will appear once it is approved.", "ok");
        return;
      }
      if (data?.reason === "sign-in-required" || data?.reason === "bad-token") {
        say("Your session has expired. Sign in again and it will work.", "warn");
        return;
      }
      if (data?.reason === "too-many") {
        say("That is a lot of comments in a short time. Try again shortly.", "warn");
        return;
      }
      say("That did not send. Try again in a moment.", "warn");
    } catch {
      say("That did not send. Try again in a moment.", "warn");
    } finally {
      send.disabled = false;
    }
  });

  const invite = el("p", { className: "comment-invite" });

  function paintWho() {
    const who = current();
    form.hidden = !who;
    invite.hidden = !!who;
    if (!who) {
      invite.replaceChildren(
        el("button", { className: "link-btn", type: "button", textContent: "Sign in",
                       onclick: () => document.querySelector(".account-btn")?.click() }),
        " to join in. Everything already here is readable without an account."
      );
    }
  }

  host.replaceChildren(
    el("h2", { className: "comment-title", textContent: "Comments" }),
    list, invite, form, note
  );

  paintWho();
  document.addEventListener("account:changed", paintWho);
  await draw();
}
