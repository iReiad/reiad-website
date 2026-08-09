/* ============================================================
   admin.js — the Studio's back office.

   Four things the site can now tell you that it never could:
     · which questions readers are waiting on
     · who has subscribed
     · which enquiries are still unanswered
     · which pieces people actually read

   All of it behind the server-side session, so none of it is
   decided in the browser.
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

/* ============================================================
   Questions — the moderation queue
   ============================================================ */

async function renderQueue(host) {
  const pending = (await api("questions?status=pending"))?.questions ?? [];
  const published = (await api("questions?status=published"))?.questions ?? [];

  const card = (q, isPending) => {
    const answer = el("textarea", {
      className: "admin-answer", rows: 3,
      placeholder: "Your answer. It appears under the question on the article page.",
      value: q.answer ?? "",
    });

    const act = async (status) => {
      const res = await api(`questions/${q.id}`, {
        method: "PATCH",
        body: { answer: answer.value, status },
      });
      if (res?.ok) { toast(status === "published" ? "Published" : `Marked ${status}`); renderQueue(host); }
      else toast("That didn't save");
    };

    return el("div", { className: "admin-row" },
      el("div", { className: "admin-meta mono" },
        el("span", { textContent: q.slug ? `on ${q.slug}` : "general" }),
        el("span", { textContent: " · " }),
        el("span", { textContent: q.name || "anonymous" }),
        el("span", { textContent: " · " }),
        el("span", { textContent: when(q.created_at) }),
        q.email ? el("a", { href: `mailto:${q.email}`, textContent: q.email }) : null
      ),
      el("p", { className: "admin-q", textContent: q.body }),
      answer,
      el("div", { className: "row-flex" },
        el("button", { className: "btn btn-solid", textContent: "Answer & publish",
                       onclick: () => act("published") }),
        isPending
          ? el("button", { className: "btn btn-ghost", textContent: "Not spam, just private",
                           onclick: () => act("archived") })
          : el("button", { className: "btn btn-ghost", textContent: "Unpublish",
                           onclick: () => act("pending") }),
        el("button", { className: "btn btn-ghost", textContent: "Spam",
                       onclick: () => act("spam") })
      )
    );
  };

  host.replaceChildren(
    el("p", { className: "admin-count mono", textContent:
      pending.length ? `${pending.length} waiting on you` : "Nothing waiting: inbox zero." }),
    ...pending.map((q) => card(q, true)),
    published.length
      ? el("details", { className: "faq" },
          el("summary", { textContent: `Published answers (${published.length})` }),
          ...published.map((q) => card(q, false)))
      : null
  );
}

/* ============================================================
   Subscribers
   ============================================================ */

async function renderSubscribers(host) {
  const data = await api("subscribers");
  const rows = data?.subscribers ?? [];
  const counts = data?.counts ?? {};

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
    el("div", { className: "row-flex", style: "margin:16px 0" },
      el("a", { className: "btn btn-ghost", href: "/api/subscribers/export",
                textContent: "Download CSV" })
    ),
    el("div", { className: "admin-table" },
      ...rows.slice(0, 100).map((s) =>
        el("div", { className: "admin-line" },
          el("span", { textContent: s.email }),
          el("span", { className: "mono", textContent: s.status }),
          el("span", { className: "mono muted", textContent: when(s.created_at) })
        ))
    ),
    rows.length ? null : el("p", { className: "muted", textContent:
      "Nobody yet. The sign-up box is on the Insights page." })
  );
}

/* ============================================================
   Enquiries — the client pipeline
   ============================================================ */

async function renderEnquiries(host) {
  const rows = (await api("enquiries"))?.enquiries ?? [];

  const card = (e) => {
    const notes = el("textarea", {
      className: "admin-answer", rows: 2, placeholder: "Private notes", value: e.notes ?? "",
    });
    const save = async (status) => {
      const res = await api(`enquiries/${e.id}`, {
        method: "PATCH", body: { status, notes: notes.value },
      });
      if (res?.ok) { toast(`Marked ${status}`); renderEnquiries(host); }
    };

    return el("div", { className: `admin-row status-${e.status}` },
      el("div", { className: "admin-meta mono" },
        el("span", { className: "pill", textContent: e.kind }),
        el("span", { textContent: e.name || "—" }),
        el("a", { href: `mailto:${e.email}`, textContent: e.email }),
        el("span", { textContent: when(e.created_at) })
      ),
      el("p", { className: "admin-q", textContent: e.message }),
      notes,
      el("div", { className: "row-flex" },
        el("a", { className: "btn btn-solid",
                  href: `mailto:${e.email}?subject=${encodeURIComponent("Re: your message via reiad.co.uk")}`,
                  textContent: "Reply by email" }),
        el("button", { className: "btn btn-ghost", textContent: "Mark replied",
                       onclick: () => save("replied") }),
        el("button", { className: "btn btn-ghost", textContent: "Close",
                       onclick: () => save("closed") })
      )
    );
  };

  const newOnes = rows.filter((e) => e.status === "new");
  host.replaceChildren(
    el("p", { className: "admin-count mono", textContent:
      newOnes.length ? `${newOnes.length} new` : "Nothing new." }),
    ...rows.map(card)
  );
}

/* ============================================================
   Stats
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

async function renderStats(host) {
  const data = await api("signals/stats?days=30");
  if (!data?.ok) {
    host.replaceChildren(el("p", { className: "muted", textContent: "No figures yet." }));
    return;
  }

  host.replaceChildren(
    el("div", { className: "stat-row" },
      el("div", { className: "stat stat-lead" },
        el("span", { className: "k", textContent: "Views, 30 days" }),
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
          el("a", { href: row.path, textContent: row.path }),
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
   Published articles
   ============================================================ */

async function renderArticles(host) {
  const rows = (await api("articles?all=1"))?.articles ?? [];

  host.replaceChildren(
    el("p", { className: "admin-count mono", textContent:
      rows.length ? `${rows.length} in the database` : "Nothing published through the Studio yet." }),
    el("div", { className: "admin-table" },
      ...rows.map((a) =>
        el("div", { className: "admin-line" },
          el("a", { href: `/insights/${a.slug}.html`, textContent: a.title }),
          el("span", { className: "mono", textContent: a.status }),
          el("span", { className: "mono muted", textContent: when(a.updated_at) }),
          el("button", { className: "chip", textContent: a.status === "live" ? "Unpublish" : "Publish",
            onclick: async () => {
              await api(`articles/${a.slug}`, { method: "PATCH",
                body: { status: a.status === "live" ? "draft" : "live" } });
              renderArticles(host);
            } }),
          el("button", { className: "chip", textContent: "Copy link",
            onclick: () => copyText(`${location.origin}/insights/${a.slug}.html`, "Link copied") })
        ))
    )
  );
}

/* ============================================================
   Tabs
   ============================================================ */

const PANELS = {
  queue: { label: "Questions", render: renderQueue },
  articles: { label: "Published", render: renderArticles },
  stats: { label: "What's read", render: renderStats },
  enquiries: { label: "Enquiries", render: renderEnquiries },
  subscribers: { label: "Subscribers", render: renderSubscribers },
};

/** What is actually waiting, so the tabs can say so without being
    clicked. Only the two things that represent someone waiting on a
    reply get a number; the rest are just places to look. */
async function waiting() {
  const [questions, enquiries] = await Promise.all([
    api("questions?status=pending"),
    api("enquiries"),
  ]);
  return {
    queue: (questions?.questions ?? []).length,
    enquiries: (enquiries?.enquiries ?? []).filter((e) => e.status === "new").length,
  };
}

export function mountDashboard(root) {
  /* This said role="tablist" while the buttons used aria-pressed,
     which describes a row of toggle buttons — so a screen reader was
     told to expect tabs and then handed something else, with no
     indication of which panel each one controlled. Proper tabs:
     aria-selected, aria-controls, a labelled panel, and the arrow-key
     behaviour the role implies. */
  const tabs = el("div", {
    className: "chip-row", role: "tablist", "aria-label": "Dashboard sections",
  });
  const panel = el("div", { className: "admin-panel", role: "tabpanel", tabIndex: 0 });

  const keys = Object.keys(PANELS);
  const buttons = new Map();

  const show = (key, { focus = false } = {}) => {
    for (const [k, b] of buttons) {
      const on = k === key;
      b.setAttribute("aria-selected", String(on));
      // Roving tabindex: one stop for the whole group, then arrows.
      b.tabIndex = on ? 0 : -1;
    }
    panel.setAttribute("aria-labelledby", `tab-${key}`);
    panel.replaceChildren(el("p", { className: "muted mono", textContent: "Loading…" }));
    PANELS[key].render(panel);
    if (focus) buttons.get(key)?.focus();
  };

  keys.forEach((key) => {
    const b = el("button", {
      className: "chip", type: "button", id: `tab-${key}`,
      textContent: PANELS[key].label,
    });
    b.setAttribute("role", "tab");
    b.setAttribute("aria-controls", "admin-panel");
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

  panel.id = "admin-panel";
  root.replaceChildren(tabs, panel);
  show("queue");

  // Badges arrive when they arrive; the dashboard is usable meanwhile.
  waiting().then((counts) => {
    for (const [key, n] of Object.entries(counts)) {
      if (!n) continue;
      const b = buttons.get(key);
      if (b) b.append(el("span", { className: "tab-count", textContent: String(n) }));
    }
  });
}
