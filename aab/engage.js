/* ============================================================
   engage.js — what a reader can do besides read.

   Attaches itself to any article page: reactions, and a
   moderated question box with the answered questions above it.
   Nothing is hard-coded per article and no page markup changes,
   so every piece written from now on — and every one already
   published — gets this for free.

   If the backend isn't there, this adds nothing and says nothing.
   ============================================================ */

import { ask, backendReady, countView, getQuestions, react, reactions } from "/api.js";

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/** Which article are we on? Static pages carry it in the path. */
function currentSlug() {
  const m = location.pathname.match(/\/insights\/([a-z0-9-]+)(?:\.html)?$/i);
  if (m && m[1] !== "_template") return m[1];
  return document.querySelector("article[data-slug]")?.dataset.slug ?? null;
}

/* ============================================================
   Reactions
   ============================================================ */

const REACTIONS = [
  { kind: "helpful", label: "This helped", icon: "✓" },
  { kind: "confusing", label: "Lost me somewhere", icon: "?" },
  { kind: "more", label: "Go deeper on this", icon: "+" },
];

function reactionBlock(slug, counts) {
  const key = `reacted:${slug}`;
  const already = localStorage.getItem(key);

  const row = el("div", { className: "react-row" });
  REACTIONS.forEach(({ kind, label, icon }) => {
    const button = el("button", { className: "react", type: "button" },
      el("span", { className: "ic", textContent: icon }),
      el("span", { textContent: label }),
      el("b", { textContent: counts?.[kind] ? String(counts[kind]) : "" })
    );
    button.dataset.kind = kind;
    if (already === kind) button.setAttribute("aria-pressed", "true");

    button.addEventListener("click", async () => {
      if (localStorage.getItem(key)) return;      // one per reader, per piece
      localStorage.setItem(key, kind);
      button.setAttribute("aria-pressed", "true");
      const result = await react(slug, kind);
      if (result?.counts) {
        row.querySelectorAll(".react").forEach((b) => {
          b.querySelector("b").textContent = result.counts[b.dataset.kind] ?? "";
        });
      }
    });
    row.append(button);
  });

  return el("div", { className: "engage-block" },
    el("span", { className: "mono section-label", textContent: "Was this any use?" }),
    row,
    el("p", { className: "muted", style: "font-size:0.84rem;margin-top:10px" },
      "Anonymous — it records a number and nothing about you.")
  );
}

/* ============================================================
   Questions
   ============================================================ */

function answeredList(questions) {
  if (!questions?.length) return null;

  return el("div", { className: "qa-list" },
    ...questions.map((q) =>
      el("article", { className: "qa" },
        el("p", { className: "q" },
          el("span", { className: "mono who", textContent: q.name?.trim() || "A reader" }),
          el("span", { textContent: q.body })
        ),
        q.answer ? el("div", { className: "a" },
          el("span", { className: "mono who", textContent: "Rony" }),
          el("p", { textContent: q.answer })
        ) : null
      )
    )
  );
}

function askBox(slug) {
  const status = el("p", { className: "gate-msg mono", role: "status" });

  const form = el("form", { className: "ask-form" },
    el("label", {},
      el("span", { textContent: "Your question" }),
      el("textarea", {
        name: "body", rows: 3, required: true,
        placeholder: "Ask about anything in this piece — if it's a good question it usually means the writing wasn't clear enough.",
      })
    ),
    el("div", { className: "field-row" },
      el("label", {},
        el("span", { textContent: "Name (optional)" }),
        el("input", { type: "text", name: "name", placeholder: "Shown if I publish the answer" })
      ),
      el("label", {},
        el("span", { textContent: "Email (optional)" }),
        el("input", { type: "email", name: "email", placeholder: "Only so I can reply — never shown" })
      )
    ),
    // Honeypot: invisible to people, irresistible to bots.
    el("input", {
      type: "text", name: "website", tabIndex: -1, autocomplete: "off",
      style: "position:absolute;left:-9999px", ariaHidden: "true",
    }),
    el("button", { className: "btn btn-solid", type: "submit", textContent: "Send it" }),
    status
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (String(data.body).trim().length < 10) {
      status.textContent = "A bit more detail and I can actually answer it.";
      status.className = "gate-msg mono err";
      return;
    }
    status.textContent = "Sending…";
    status.className = "gate-msg mono";

    const result = await ask({ ...data, slug });
    if (result?.ok) {
      form.replaceChildren(
        el("p", { className: "verdict" },
          "Got it. I read every one of these. If it's a question other people will "
          + "have, the answer appears on this page — otherwise you'll get an email, "
          + "if you left one.")
      );
    } else {
      status.textContent = "That didn't send. Email i@reiad.co.uk instead?";
      status.className = "gate-msg mono err";
    }
  });

  return el("div", { className: "engage-block" },
    el("span", { className: "mono section-label", textContent: "Ask about this piece" }),
    form
  );
}

/* ============================================================
   Go
   ============================================================ */

(async () => {
  countView();

  const slug = currentSlug();
  const article = document.querySelector("article.article, .wrap.article");
  if (!slug || !article) return;
  if (!(await backendReady())) return;   // static site: add nothing

  const [counts, questions] = await Promise.all([reactions(slug), getQuestions(slug)]);

  const host = el("section", { className: "engage" });
  host.append(reactionBlock(slug, counts));

  const answered = answeredList(questions);
  if (answered) {
    host.append(el("div", { className: "engage-block" },
      el("span", { className: "mono section-label", textContent: "Questions readers asked" }),
      answered));
  }
  host.append(askBox(slug));

  // Before the prev/next cards if they exist, otherwise at the end.
  const before = article.querySelector(".prev-next");
  before ? before.before(host) : article.append(host);
})();
