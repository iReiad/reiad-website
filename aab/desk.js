/* ============================================================
   desk.js: the site, answering back.

   Everything the site has collected, in one place that is not the
   editor. It used to be a strip of five tabs bolted under the
   Studio's publish buttons, which made it something you scrolled
   past on the way to writing rather than somewhere you worked.

   Five panels, and an overview that says what is actually waiting:

     · Questions, the moderation queue, every status reachable
     · Enquiries, the client pipeline
     · Subscribers, the list, searchable
     · What's read, page views, no visitor identity anywhere
     · Published, what is live, and the way back into the editor

   ---- the bug this file was rebuilt around ----

   The queue only ever asked for `pending` and `published`. Anything
   archived or marked spam left the interface permanently, and the
   button that archives is labelled "Not spam, just private", which
   reads like filing something, not deleting it. A real question sat
   invisible in the database for two days. Every status is reachable
   here, and everything can be moved back.
   ============================================================ */

import { api, uploadMedia } from "/api.js";
import { toast, copyText } from "/app.js";
import { SECTIONS, findSection, pieceUrl } from "/content.js";
import { shareCardBlob, coverFromHTML, cardSlug, isDrawnCard } from "/share-card.js";

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

/* ---------- searching, without the box eating what you typed ----------

   THE BUG THIS SHAPE EXISTS FOR

   Every panel here redraws itself by replacing its whole contents,
   and the search box is part of those contents. So a quarter of a
   second after the first letter, the box the letter was typed into
   was thrown away and a fresh, empty, unfocused one took its place.
   Searching worked exactly one character at a time, and it looked
   like the page was fighting the keyboard, which it was.

   The box is handed its current value on every draw, and `paint`
   below puts the caret back if that is where it was. */
function searchBox(placeholder, onInput, value = "") {
  let timer;
  const input = el("input", { type: "search", placeholder, className: "desk-search", value });
  input.addEventListener("input", () => {
    clearTimeout(timer);
    timer = setTimeout(() => onInput(input.value.trim()), 250);
  });
  return input;
}

/** Replace a panel's contents, keeping the caret where it was. */
function paint(host, ...nodes) {
  const typing = document.activeElement?.classList?.contains("desk-search");
  host.replaceChildren(...nodes);
  if (!typing) return;
  const box = host.querySelector(".desk-search");
  if (!box) return;
  box.focus();
  box.setSelectionRange(box.value.length, box.value.length);
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

  paint(host,
    filterRow(QUESTION_FILTERS, status, counts, (key) => {
      questionState.status = key;
      redraw();
    }),
    searchBox("Search questions, names, articles", (value) => {
      questionState.q = value;
      redraw();
    }, q),
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
        el("span", { textContent: item.name || "–" }),
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

  paint(host,
    filterRow(ENQUIRY_FILTERS, status, counts, (key) => { enquiryState.status = key; redraw(); }),
    searchBox("Search names, addresses, messages", (value) => { enquiryState.q = value; redraw(); }, q),
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

  paint(host,
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
    }, subscriberState.q),
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
    (articles?.articles ?? []).map((a) => [pieceUrl(findSection(a.section), a.slug), a.title])
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

const articleState = { q: "", section: "all" };

const SECTION_FILTERS = [["all", "Everywhere"],
  ...SECTIONS.map((sec) => [sec.id, sec.id === "insights" ? sec.en : sec.bn])];

/** What a pasted link will show, when that is worth saying.

    Nothing for the two good cases: a card the Studio drew (a JPEG),
    or no cover at all, which falls back to the section's own card.
    A raw photo is worth flagging, because every photo on this site
    is a WebP and the scrapers behind WhatsApp, Facebook and
    LinkedIn will not read one: those pieces show the fallback until
    they are published again, which is what draws the card. */
const coverWarning = (article) =>
  article.cover && !isDrawnCard(article.cover) ? "photo, not a card" : null;

/** Draw the missing card, here, without opening the editor.

    The piece is already published and its photos are already on
    /media: everything the card needs is a fetch away, so making
    someone reopen the piece and publish it again to fix a picture
    would be busywork with a chance of changing something else. */
async function drawCard(article, onDone) {
  const full = (await api(`articles/${encodeURIComponent(article.slug)}`))?.article;
  const pick = coverFromHTML(full?.body ?? "");
  if (!pick.own || !/^\/media\//.test(pick.src)) {
    toast("No hosted photo in that piece, so the section's card is the right one.");
    return;
  }

  toast("Drawing the card…");
  try {
    const stored = await uploadMedia(await shareCardBlob(pick), cardSlug(article.slug));
    if (!stored?.url) throw new Error("upload-failed");
    const res = await api(`articles/${encodeURIComponent(article.slug)}`, {
      method: "PATCH", body: { cover: stored.url },
    });
    if (!res?.ok) throw new Error(res?.reason ?? "save-failed");
    toast(`Card drawn from the ${pick.lead ? "lead" : "first"} photo.`);
    onDone();
  } catch (err) {
    console.warn("share card failed", err);
    toast("Couldn't draw the card.");
  }
}

/** Move a piece to another section.

    This is the one control on this page that changes a URL. The
    server refuses to serve a piece at a mount that is not its own,
    so the move is complete the moment it saves: the old URL stops
    answering and the new one starts. That is also why it asks first
    when the piece is live, and does not when it is a draft. */
function moveControl(article, onDone) {
  const wrap = el("label", { className: "move-field" },
    el("span", { className: "mono", textContent: "Move to" }));

  const select = el("select", { className: "move-select" });
  select.append(...SECTIONS.map((sec) =>
    Object.assign(document.createElement("option"), {
      value: sec.id,
      textContent: sec.id === "insights" ? sec.en : `${sec.bn} · ${sec.en}`,
      selected: sec.id === findSection(article.section).id,
    })));

  select.addEventListener("change", async () => {
    const from = findSection(article.section);
    const to = findSection(select.value);
    if (to.id === from.id) return;

    if (article.status === "live") {
      const ok = confirm(
        `Move "${article.title}" from ${from.en} to ${to.en}?\n\n`
        + `It is live, so its address changes from ${pieceUrl(from, article.slug)} `
        + `to ${pieceUrl(to, article.slug)}. Any link already shared will stop working.`
      );
      if (!ok) { select.value = from.id; return; }
    }

    select.disabled = true;
    const res = await api(`articles/${article.slug}`, {
      method: "PATCH", body: { section: to.id },
    });
    select.disabled = false;

    if (res?.ok) {
      toast(`Moved to ${to.en}: ${pieceUrl(to, article.slug)}`);
      onDone();
    } else {
      select.value = from.id;
      toast("That didn't move.");
    }
  });

  wrap.append(select);
  return wrap;
}

async function renderArticles(host) {
  const all = (await api("articles?all=1"))?.articles ?? [];
  const needle = articleState.q.toLowerCase();
  const rows = all
    .filter((a) => articleState.section === "all"
      || findSection(a.section).id === articleState.section)
    .filter((a) => !needle
      || `${a.title} ${a.slug} ${a.tag} ${(a.topics ?? []).join(" ")}`
          .toLowerCase().includes(needle));

  const redraw = () => renderArticles(host);

  /* How many are in each section, so the filter says what is behind
     it rather than making you click to find out. */
  const counts = all.reduce((acc, a) => {
    const id = findSection(a.section).id;
    return { ...acc, [id]: (acc[id] ?? 0) + 1, all: (acc.all ?? 0) + 1 };
  }, {});

  paint(host,
    filterRow(SECTION_FILTERS, articleState.section, counts, (key) => {
      articleState.section = key;
      redraw();
    }),
    searchBox("Search titles, file names and topics", (value) => {
      articleState.q = value;
      redraw();
    }, articleState.q),
    el("p", { className: "admin-count mono", textContent:
      all.length ? `${rows.length} of ${all.length} in the database`
                 : "Nothing published through the Studio yet." }),
    el("div", { className: "admin-table" },
      ...rows.map((a) => {
        const sec = findSection(a.section);
        return el("div", { className: `admin-line article-line status-${a.status}` },
          el("a", { className: "article-title", href: pieceUrl(sec, a.slug),
                    textContent: a.title }),
          el("span", { className: "line-facts" },
            el("span", { className: `pill section-pill section-${sec.id}`,
                         textContent: sec.id === "insights" ? sec.en : sec.bn }),
            el("span", { className: "pill", textContent: a.status }),
            coverWarning(a)
              ? el("span", {
                  className: "pill pill-warn",
                  textContent: coverWarning(a),
                  title: "Its social card is the photo itself, in a format "
                    + "WhatsApp, Facebook and LinkedIn will not read. Draw card fixes it.",
                })
              : null,
            (a.topics ?? []).length
              ? el("span", { className: "line-topics" },
                  ...a.topics.slice(0, 3).map((t) =>
                    el("span", { className: "topic-tag mono", textContent: t })))
              : null,
            el("span", { className: "mono muted", textContent: when(a.updated_at) })
          ),
          el("span", { className: "line-actions" },
            // Straight back into the editor with it loaded.
            el("a", { className: "chip", href: `/studio.html?edit=${encodeURIComponent(a.slug)}`,
                      textContent: "Edit" }),
            button(a.status === "live" ? "Unpublish" : "Publish", async () => {
              await api(`articles/${a.slug}`, { method: "PATCH",
                body: { status: a.status === "live" ? "draft" : "live" } });
              redraw();
            }),
            button("History", () => showHistory(a, redraw)),
            coverWarning(a) ? button("Draw card", () => drawCard(a, redraw)) : null,
            button("Copy link",
              () => copyText(`${location.origin}${pieceUrl(sec, a.slug)}`, "Link copied")),
            button("Delete", async () => {
              if (!confirm(`Delete "${a.title}" from the database? This cannot be undone.`)) return;
              const res = await api(`articles/${a.slug}`, { method: "DELETE" });
              if (res?.ok) { toast("Deleted"); redraw(); } else toast("That didn't delete");
            }),
            moveControl(a, redraw)
          )
        );
      })
    )
  );
}

/* ============================================================
   History

   Publishing replaces an article in place. Every overwrite now keeps
   the body it replaced, twenty deep, so a republish you regret has
   somewhere to go back to. Restoring is itself an overwrite and is
   snapshotted too, going back never costs you the newer version.
   ============================================================ */

async function showHistory(article, onDone) {
  const sheet = document.getElementById("history-sheet");
  const body = document.getElementById("history-body");
  document.getElementById("history-title").textContent = `History: ${article.title}`;
  body.replaceChildren(loading());
  sheet.showModal();

  const versions = (await api(`articles/${article.slug}/versions`))?.versions ?? [];

  if (!versions.length) {
    body.replaceChildren(empty(
      "Nothing yet. A version is kept each time this article is overwritten, "
      + "so the first one appears the next time you republish it."));
    return;
  }

  body.replaceChildren(
    el("p", { className: "admin-count mono", textContent:
      `${versions.length} earlier version${versions.length === 1 ? "" : "s"}, newest first` }),
    el("div", { className: "admin-table" },
      ...versions.map((v) =>
        el("div", { className: "admin-line" },
          el("span", { textContent: v.title || "(untitled)" }),
          el("span", { className: "mono muted", textContent: new Date(v.saved_at).toLocaleString() }),
          el("span", { className: "mono muted", textContent: `${Math.round((v.size ?? 0) / 1024)} KB` }),
          button("Restore", async () => {
            if (!confirm(`Put this version of "${article.title}" back?\n\n`
              + "What is live now is kept in the history too, so this can be undone.")) return;
            const res = await api(`articles/${article.slug}/versions`, {
              method: "POST", body: { id: v.id },
            });
            if (res?.ok) { toast("Restored"); sheet.close(); onDone?.(); }
            else toast("That didn't restore");
          })
        ))
    )
  );
}

/* ============================================================
   The overview, what actually needs you
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
