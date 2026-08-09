/* ============================================================
   desk.js — the site, answering back.

   Everything the site has collected, in one place that is not the
   editor. It used to be a strip of five tabs bolted under the
   Studio's publish buttons, which made it something you scrolled
   past on the way to writing rather than somewhere you worked.

   Five panels, and an overview that says what is actually waiting:

     · Questions   — the moderation queue, every status reachable
     · Enquiries   — the client pipeline
     · Subscribers — the list, searchable
     · What's read — page views, no visitor identity anywhere
     · Published   — what is live, and the way back into the editor

   ---- the bug this file was rebuilt around ----

   The queue only ever asked for `pending` and `published`. Anything
   archived or marked spam left the interface permanently — and the
   button that archives is labelled "Not spam, just private", which
   reads like filing something, not deleting it. A real question sat
   invisible in the database for two days. Every status is reachable
   here, and everything can be moved back.
   ============================================================ */

import { api } from "/api.js";
import { toast, copyText } from "/app.js";

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

const when = (iso) => {
  if (!iso) return "";
  const days = Math.round((Date.now() - Date.parse(iso)) / 86400_000);
  if (days === 0) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(iso).toLocaleDateString();
};

/** Anything newer than the last visit is worth pointing at. */
const SEEN_KEY = "desk-last-seen";
let lastSeen = 0;
try { lastSeen = Number(localStorage.getItem(SEEN_KEY)) || 0; } catch { /* private mode */ }
const isNew = (iso) => iso && Date.parse(iso) > lastSeen;

const markSeen = () => {
  try { localStorage.setItem(SEEN_KEY, String(Date.now())); } catch { /* fine */ }
};

/* ---------- small shared pieces ---------- */

const button = (label, onClick, className = "chip") =>
  el("button", { className, type: "button", textContent: label, onclick: onClick });

function searchBox(placeholder, onInput) {
  let timer;
  const input = el("input", { type: "search", placeholder, className: "desk-search" });
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => onInput(input.value.trim()), 250);
  });
  return input;
}

/** A row of filters that shows how many are behind each one. */
function filterRow(options, active, counts, onPick) {
  return el("div", { className: "chip-row desk-filters" },
    ...options.map(([key, label]) => {
      const n = counts?.[key];
      const b = el("button", { className: "chip", type: "button", textContent: label });
      b.setAttribute("aria-pressed", String(key === active));
      if (n) b.append(el("span", { className: "tab-count", textContent: String(n) }));
      b.addEventListener("click", () => onPick(key));
      return b;
    })
  );
}

const empty = (text) => el("p", { className: "muted", textContent: text });
const loading = () => el("p", { className: "muted mono", textContent: "Loading…" });

/* ============================================================
   Questions
   ============================================================ */

const QUESTION_FILTERS = [
  ["pending", "Waiting"],
  ["published", "Published"],
  ["archived", "Archived"],
  ["spam", "Spam"],
  ["all", "Everything"],
];

const questionState = { status: "pending", q: "" };

async function renderQueue(host) {
  const { status, q } = questionState;
  const query = new URLSearchParams({ status, ...(q ? { q } : {}) });
  const data = await api(`questions?${query}`);
  const rows = data?.questions ?? [];
  const counts = data?.counts ?? {};

  const redraw = () => renderQueue(host);

  const card = (item) => {
    const answer = el("textarea", {
      className: "admin-answer", rows: 3,
      placeholder: "Your answer. It appears under the question on the article page.",
      value: item.answer ?? "",
    });

    const act = async (next) => {
      const res = await api(`questions/${item.id}`, {
        method: "PATCH", body: { answer: answer.value, status: next },
      });
      if (res?.ok) { toast(next === "published" ? "Published" : `Moved to ${next}`); redraw(); }
      else toast("That didn't save");
    };

    const remove = async () => {
      if (!confirm("Delete this permanently? Archiving keeps it and hides it.")) return;
      const res = await api(`questions/${item.id}`, { method: "DELETE" });
      if (res?.ok) { toast("Deleted"); redraw(); } else toast("That didn't delete");
    };

    /* Every status can reach every other one. The point is that
       nothing here is a one-way door. */
    const actions = [
      item.status !== "published"
        ? button("Answer & publish", () => act("published"), "btn btn-solid")
        : button("Unpublish", () => act("pending"), "btn btn-ghost"),
      item.status !== "archived" ? button("Archive", () => act("archived"), "btn btn-ghost") : null,
      item.status !== "spam" ? button("Spam", () => act("spam"), "btn btn-ghost") : null,
      item.status !== "pending"
        ? button("Back to waiting", () => act("pending"), "btn btn-ghost") : null,
      button("Delete", remove, "btn btn-ghost"),
    ];

    return el("div", { className: `admin-row status-${item.status}` },
      el("div", { className: "admin-meta mono" },
        isNew(item.created_at) ? el("span", { className: "pill pill-new", textContent: "new" }) : null,
        el("span", { className: "pill", textContent: item.status }),
        el("span", { textContent: item.slug ? `on ${item.slug}` : "general" }),
        el("span", { textContent: item.name || "anonymous" }),
        el("span", { textContent: when(item.created_at) }),
        item.email ? el("a", { href: `mailto:${item.email}`, textContent: item.email }) : null
      ),
      el("p", { className: "admin-q", textContent: item.body }),
      answer,
      el("div", { className: "row-flex" }, ...actions.filter(Boolean))
    );
  };

  host.replaceChildren(
    filterRow(QUESTION_FILTERS, status, counts, (key) => {
      questionState.status = key;
      redraw();
    }),
    searchBox("Search questions, names, articles", (value) => {
      questionState.q = value;
      redraw();
    }),
    el("p", { className: "admin-count mono", textContent:
      rows.length
        ? `${rows.length} ${status === "all" ? "in total" : status}`
        : q ? "Nothing matches that." : "Nothing here." }),
    ...rows.map(card)
  );
}

/* ============================================================
   Enquiries
   ============================================================ */

const ENQUIRY_FILTERS = [["new", "New"], ["replied", "Replied"], ["closed", "Closed"], ["all", "Everything"]];
const enquiryState = { status: "new", q: "" };

async function renderEnquiries(host) {
  const all = (await api("enquiries"))?.enquiries ?? [];
  const { status, q } = enquiryState;
  const needle = q.toLowerCase();

  const counts = all.reduce((acc, e) => ({ ...acc, [e.status]: (acc[e.status] ?? 0) + 1 }), {});
  counts.all = all.length;

  const rows = all
    .filter((e) => status === "all" || e.status === status)
    .filter((e) => !needle
      || `${e.name} ${e.email} ${e.message} ${e.kind}`.toLowerCase().includes(needle));

  const redraw = () => renderEnquiries(host);

  const card = (item) => {
    const notes = el("textarea", {
      className: "admin-answer", rows: 2, placeholder: "Private notes", value: item.notes ?? "",
    });
    const save = async (next) => {
      const res = await api(`enquiries/${item.id}`, {
        method: "PATCH", body: { status: next, notes: notes.value },
      });
      if (res?.ok) { toast(`Marked ${next}`); redraw(); } else toast("That didn't save");
    };

    return el("div", { className: `admin-row status-${item.status}` },
      el("div", { className: "admin-meta mono" },
        isNew(item.created_at) ? el("span", { className: "pill pill-new", textContent: "new" }) : null,
        el("span", { className: "pill", textContent: item.kind }),
        el("span", { textContent: item.name || "—" }),
        el("a", { href: `mailto:${item.email}`, textContent: item.email }),
        el("span", { textContent: when(item.created_at) })
      ),
      el("p", { className: "admin-q", textContent: item.message }),
      notes,
      el("div", { className: "row-flex" },
        el("a", { className: "btn btn-solid",
          href: `mailto:${item.email}?subject=${encodeURIComponent("Re: your message via reiad.co.uk")}`,
          textContent: "Reply by email" }),
        item.status !== "replied" ? button("Mark replied", () => save("replied"), "btn btn-ghost") : null,
        item.status !== "closed" ? button("Close", () => save("closed"), "btn btn-ghost") : null,
        item.status !== "new" ? button("Reopen", () => save("new"), "btn btn-ghost") : null,
        button("Save notes", () => save(item.status), "btn btn-ghost")
      )
    );
  };

  host.replaceChildren(
    filterRow(ENQUIRY_FILTERS, status, counts, (key) => { enquiryState.status = key; redraw(); }),
    searchBox("Search names, addresses, messages", (value) => { enquiryState.q = value; redraw(); }),
    el("p", { className: "admin-count mono", textContent:
      rows.length ? `${rows.length} shown` : "Nothing here." }),
    ...rows.map(card)
  );
}

/* ============================================================
   Subscribers
   ============================================================ */

const subscriberState = { q: "", shown: 50 };

async function renderSubscribers(host) {
  const data = await api("subscribers");
  const all = data?.subscribers ?? [];
  const counts = data?.counts ?? {};
  const needle = subscriberState.q.toLowerCase();

  const rows = all.filter((s) => !needle || s.email.toLowerCase().includes(needle));
  const page = rows.slice(0, subscriberState.shown);

  host.replaceChildren(
    el("div", { className: "stat-row" },
      el("div", { className: "stat stat-lead" },
        el("span", { className: "k", textContent: "Confirmed" }),
        el("span", { className: "v", textContent: String(counts.confirmed ?? 0) })),
      el("div", { className: "stat" },
        el("span", { className: "k", textContent: "Awaiting confirmation" }),
        el("span", { className: "v", textContent: String(counts.pending ?? 0) })),
      el("div", { className: "stat" },
        el("span", { className: "k", textContent: "All time" }),
        el("span", { className: "v", textContent: String(counts.total ?? 0) }))
    ),
    searchBox("Search addresses", (value) => {
      subscriberState.q = value;
      subscriberState.shown = 50;
      renderSubscribers(host);
    }),
    el("div", { className: "row-flex", style: "margin:16px 0" },
      el("a", { className: "btn btn-ghost", href: "/api/subscribers/export",
                textContent: "Download CSV" })
    ),
    el("div", { className: "admin-table" },
      ...page.map((s) =>
        el("div", { className: "admin-line" },
          el("span", { textContent: s.email }),
          el("span", { className: "mono", textContent: s.status }),
          el("span", { className: "mono muted", textContent: when(s.created_at) })
        ))
    ),
    // The list used to stop at 100 with nothing to say it had.
    rows.length > page.length
      ? button(`Show ${Math.min(50, rows.length - page.length)} more of ${rows.length}`,
          () => { subscriberState.shown += 50; renderSubscribers(host); }, "btn btn-ghost")
      : null,
    rows.length ? null : empty(subscriberState.q
      ? "No address matches that."
      : "Nobody yet. The sign-up box is on the Insights page.")
  );
}

/* ============================================================
   What's read
   ============================================================ */

function sparkline(daily) {
  if (!daily?.length) return null;
  const max = Math.max(...daily.map((d) => d.views), 1);
  const W = 600, H = 90;
  const points = daily.map((d, i) =>
    `${(i / Math.max(1, daily.length - 1)) * W},${H - (d.views / max) * (H - 10)}`);
  return el("div", { className: "chart-box" },
    Object.assign(document.createElement("div"), {
      innerHTML: `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" role="img"
        aria-label="Views per day"><polyline points="${points.join(" ")}" fill="none"
        stroke="var(--green)" stroke-width="2" stroke-linejoin="round"/></svg>`,
    })
  );
}

const statsState = { days: 30 };

async function renderStats(host) {
  const [data, articles] = await Promise.all([
    api(`signals/stats?days=${statsState.days}`),
    api("articles?all=1"),
  ]);

  if (!data?.ok) {
    host.replaceChildren(empty("No figures yet."));
    return;
  }

  // A path is not a headline. Joining the two makes the list legible
  // without the database ever having to know about it.
  const titles = new Map(
    (articles?.articles ?? []).map((a) => [`/insights/${a.slug}.html`, a.title])
  );
  const name = (path) => titles.get(path) ?? titles.get(`${path}.html`) ?? path;

  host.replaceChildren(
    filterRow([[7, "7 days"], [30, "30 days"], [90, "90 days"]].map(([k, l]) => [String(k), l]),
      String(statsState.days), null,
      (key) => { statsState.days = Number(key); renderStats(host); }),
    el("div", { className: "stat-row" },
      el("div", { className: "stat stat-lead" },
        el("span", { className: "k", textContent: `Views, ${statsState.days} days` }),
        el("span", { className: "v", textContent: String(data.total ?? 0) })),
      el("div", { className: "stat" },
        el("span", { className: "k", textContent: "Pages seen" }),
        el("span", { className: "v", textContent: String(data.top?.length ?? 0) }))
    ),
    sparkline(data.daily),
    el("span", { className: "mono section-label", style: "margin-top:22px",
                 textContent: "Most read" }),
    el("div", { className: "admin-table" },
      ...(data.top ?? []).map((row) =>
        el("div", { className: "admin-line" },
          el("a", { href: row.path, textContent: name(row.path) }),
          el("span", { className: "mono muted", textContent: row.path }),
          el("span", { className: "mono", textContent: String(row.views) })
        ))
    ),
    (data.reactions ?? []).length
      ? el("div", {},
          el("span", { className: "mono section-label", style: "margin-top:22px",
                       textContent: "Reactions" }),
          el("div", { className: "admin-table" },
            ...data.reactions.map((r) =>
              el("div", { className: "admin-line" },
                el("span", { textContent: r.slug }),
                el("span", { className: "mono", textContent: r.kind }),
                el("span", { className: "mono", textContent: String(r.count) })))))
      : null,
    el("p", { className: "tool-note", style: "margin-top:20px", textContent:
      "A path, a date and a number, that is the entire record. No cookies, no "
      + "visitor identity, nothing shared with anyone." })
  );
}

/* ============================================================
   Published
   ============================================================ */

const articleState = { q: "" };

async function renderArticles(host) {
  const all = (await api("articles?all=1"))?.articles ?? [];
  const needle = articleState.q.toLowerCase();
  const rows = all.filter((a) => !needle
    || `${a.title} ${a.slug} ${a.tag}`.toLowerCase().includes(needle));

  const redraw = () => renderArticles(host);

  host.replaceChildren(
    searchBox("Search titles and file names", (value) => { articleState.q = value; redraw(); }),
    el("p", { className: "admin-count mono", textContent:
      all.length ? `${rows.length} of ${all.length} in the database`
                 : "Nothing published through the Studio yet." }),
    el("div", { className: "admin-table" },
      ...rows.map((a) =>
        el("div", { className: "admin-line" },
          el("a", { href: `/insights/${a.slug}.html`, textContent: a.title }),
          el("span", { className: "mono", textContent: a.status }),
          el("span", { className: "mono muted", textContent: when(a.updated_at) }),
          // Straight back into the editor with it loaded.
          el("a", { className: "chip", href: `/studio.html?edit=${encodeURIComponent(a.slug)}`,
                    textContent: "Edit" }),
          button(a.status === "live" ? "Unpublish" : "Publish", async () => {
            await api(`articles/${a.slug}`, { method: "PATCH",
              body: { status: a.status === "live" ? "draft" : "live" } });
            redraw();
          }),
          button("Copy link",
            () => copyText(`${location.origin}/insights/${a.slug}.html`, "Link copied")),
          button("Delete", async () => {
            if (!confirm(`Delete "${a.title}" from the database? This cannot be undone.`)) return;
            const res = await api(`articles/${a.slug}`, { method: "DELETE" });
            if (res?.ok) { toast("Deleted"); redraw(); } else toast("That didn't delete");
          })
        ))
    )
  );
}

/* ============================================================
   The overview — what actually needs you
   ============================================================ */

async function renderOverview(host, go) {
  const [questions, enquiries, subscribers, stats] = await Promise.all([
    api("questions?status=pending"),
    api("enquiries"),
    api("subscribers"),
    api("signals/stats?days=30"),
  ]);

  const waitingQuestions = (questions?.questions ?? []).length;
  const newEnquiries = (enquiries?.enquiries ?? []).filter((e) => e.status === "new").length;

  const tile = (label, value, panel, urgent = false) => {
    const node = el("button", {
      className: `desk-tile${urgent && value ? " urgent" : ""}`, type: "button",
      onclick: () => go(panel),
    },
      el("span", { className: "k mono", textContent: label }),
      el("span", { className: "v", textContent: String(value) })
    );
    return node;
  };

  const nothing = !waitingQuestions && !newEnquiries;

  host.replaceChildren(
    el("div", { className: "desk-tiles" },
      tile("Questions waiting", waitingQuestions, "queue", true),
      tile("New enquiries", newEnquiries, "enquiries", true),
      tile("Confirmed subscribers", subscribers?.counts?.confirmed ?? 0, "subscribers"),
      tile("Views, 30 days", stats?.total ?? 0, "stats")
    ),
    el("p", { className: "muted", style: "margin-top:14px", textContent: nothing
      ? "Nothing is waiting on you."
      : "The tiles above are clickable." })
  );
}

/* ============================================================
   Mount
   ============================================================ */

const PANELS = {
  queue: { label: "Questions", render: renderQueue },
  enquiries: { label: "Enquiries", render: renderEnquiries },
  subscribers: { label: "Subscribers", render: renderSubscribers },
  stats: { label: "What's read", render: renderStats },
  articles: { label: "Published", render: renderArticles },
};

export function mountDesk(root, overviewHost) {
  /* Real tabs: aria-selected rather than aria-pressed, each one
     naming the panel it controls, and the arrow-key movement the
     role implies. */
  const tabs = el("div", {
    className: "chip-row", role: "tablist", "aria-label": "What the site collected",
  });
  const panel = el("div", { className: "admin-panel", id: "desk-panel", role: "tabpanel", tabIndex: 0 });

  const keys = Object.keys(PANELS);
  const buttons = new Map();

  const show = (key, { focus = false } = {}) => {
    if (!PANELS[key]) key = "queue";
    for (const [k, b] of buttons) {
      const on = k === key;
      b.setAttribute("aria-selected", String(on));
      b.tabIndex = on ? 0 : -1;          // roving tabindex
    }
    panel.setAttribute("aria-labelledby", `desk-tab-${key}`);
    panel.replaceChildren(loading());
    PANELS[key].render(panel);
    if (focus) buttons.get(key)?.focus();
    // Deep-linkable, so a bookmark can land on the queue.
    if (location.hash.slice(1) !== key) history.replaceState(null, "", `#${key}`);
  };

  keys.forEach((key) => {
    const b = el("button", {
      className: "chip", type: "button", id: `desk-tab-${key}`,
      textContent: PANELS[key].label,
    });
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "desk-panel");
    b.dataset.key = key;
    b.addEventListener("click", () => show(key));
    buttons.set(key, b);
    tabs.append(b);
  });

  tabs.addEventListener("keydown", (e) => {
    const step = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" }[e.key];
    if (step === undefined) return;
    e.preventDefault();
    const at = keys.indexOf(e.target.dataset.key);
    const next = step === "first" ? 0
      : step === "last" ? keys.length - 1
      : (at + step + keys.length) % keys.length;
    show(keys[next], { focus: true });
  });

  root.replaceChildren(tabs, panel);

  if (overviewHost) renderOverview(overviewHost, show);
  show(location.hash.slice(1) || "queue");

  // Badges on the two tabs that mean a person is waiting for a reply.
  Promise.all([api("questions?status=pending"), api("enquiries")]).then(([q, e]) => {
    const counts = {
      queue: (q?.questions ?? []).length,
      enquiries: (e?.enquiries ?? []).filter((row) => row.status === "new").length,
    };
    for (const [key, n] of Object.entries(counts)) {
      if (n) buttons.get(key)?.append(el("span", { className: "tab-count", textContent: String(n) }));
    }
  });

  // Whatever was new this visit stops being new on the next one.
  addEventListener("pagehide", markSeen, { once: true });
}
