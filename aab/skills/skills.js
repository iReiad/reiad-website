/* ============================================================
   skills.js — the Skills index, made live.

   The page already lists what is here in plain markup, which is
   what a search engine reads and what someone with JavaScript
   off gets. This file replaces that list with the same schools
   drawn as cards, and adds the one thing a static page cannot
   know: how far this particular reader already got.

   Everything comes from the SKILLS list in /content.js. Adding a
   school there puts it in the header dropdown, the overlay menu,
   the search index and on this page at once — there is no second
   list to keep in step, only the fallback <ul> in the markup.

   Progress is read from the school's own store. German is the
   only one with a store so far, so it is the only one that shows
   a bar; the rest say what still has to be written instead of
   showing an empty one, which would read as a broken feature
   rather than as an honest "not yet".
   ============================================================ */

import { SKILLS, skillUrl } from "/content.js";
import { icon } from "/learn/icons.js";
import { tiltIn } from "/tilt.js";
import {
  overallStats as deutschStats, getLast as deutschLast,
} from "/deutsch/progress.js";

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/** What a school knows about itself, where it knows anything. */
function progressFor(slug) {
  if (slug !== "deutsch") return null;
  try {
    const stats = deutschStats();
    if (!stats.live) return null;
    return { pct: stats.pct, done: stats.done, total: stats.live };
  } catch {
    return null;
  }
}

function skillCard(s) {
  const soon = s.status === "soon";
  const card = el(soon ? "div" : "a", {
    className: `cell skill-card${soon ? " placeholder" : ""}`,
  });
  card.dataset.skill = s.slug;
  if (!soon) card.href = skillUrl(s);

  card.append(
    el("span", { className: "skill-art", innerHTML: icon(s.icon) }),
    el("span", { className: "tag mono", textContent: soon ? "আসছে · soon" : "এখনই পড়া যায়" }),
    el("h3", { className: "bn-h", textContent: s.bn }),
    el("span", { className: "skill-en mono", textContent: s.en }),
    el("p", { textContent: s.blurb }),
  );

  const stats = progressFor(s.slug);
  if (stats) {
    card.append(
      el("span", { className: "skill-bar", role: "img",
        ariaLabel: `${stats.pct}% পড়া হয়েছে` },
        el("i", { style: `width:${stats.pct}%` })
      ),
      el("span", { className: "more",
        textContent: stats.done
          ? `${bn(stats.done)}/${bn(stats.total)} পড়া · চালিয়ে যান →`
          : "শুরু করুন →" })
    );
  } else if (soon) {
    card.append(el("span", { className: "more skill-note", textContent: s.note ?? "" }));
  } else {
    card.append(el("span", { className: "more", textContent: "শুরু করুন →" }));
  }

  return card;
}

function buildGrid() {
  const host = document.getElementById("skill-grid");
  if (!host) return;
  host.replaceChildren(...SKILLS.map(skillCard));
  tiltIn(host);
}

/* ------------------------------------------------------------
   the resume card

   Only ever built when there is genuinely somewhere to go back
   to. A first visit should look like a clean start, not like a
   system with an empty slot in it.
   ------------------------------------------------------------ */
function buildResume() {
  const host = document.getElementById("resume");
  if (!host) return;

  let last = null;
  try { last = deutschLast(); } catch { /* private mode */ }
  if (!last?.url) { host.hidden = true; return; }

  const school = SKILLS.find((s) => s.slug === "deutsch");
  host.hidden = false;
  host.className = "resume";
  host.replaceChildren(
    el("span", { className: "resume-art", innerHTML: icon(school?.icon ?? "book") }),
    el("div", { className: "resume-text" },
      el("span", { className: "mono resume-label", textContent: "যেখানে ছিলেন সেখান থেকে" }),
      el("strong", { className: "bn-h", textContent: last.bn || "পরের পাঠ" }),
      el("span", { className: "resume-where", textContent: school?.bn ?? "" })
    ),
    el("div", { className: "resume-actions" },
      el("a", { className: "btn btn-solid", href: last.url, textContent: "চালিয়ে যান →" })
    )
  );
}

buildGrid();
buildResume();
