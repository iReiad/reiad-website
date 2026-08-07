/* ============================================================
   hub.js — the Learn hub's extras.

   1. Progress: which terms you've read, ticked off on the cards
      and totalled at the top. Kept in localStorage, never sent
      anywhere — it's a bookmark, not analytics.
   2. An A–Z glossary of every term, English and Bangla.
   3. "যেকোনো একটা" — open a term you haven't read yet.
   ============================================================ */

import { TERMS, TERM_GROUPS } from "/content.js";

const KEY = "learn-read";

const readSet = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEY) || "[]")); }
  catch { return new Set(); }
};

/* ---------- 1. ticks + progress bar ---------- */

function paintProgress() {
  const read = readSet();

  document.querySelectorAll("a.term-card[href]").forEach((card) => {
    const slug = card.getAttribute("href").split("/").pop().replace(".html", "");
    if (read.has(slug)) card.dataset.read = "1";
    else delete card.dataset.read;
  });

  const line = document.getElementById("learn-progress");
  if (!line) return;
  const done = TERMS.filter((t) => read.has(t.slug)).length;
  line.querySelector(".track i").style.width = `${(done / TERMS.length) * 100}%`;
  line.querySelector(".count").textContent =
    done === 0
      ? `${TERMS.length}টি টার্ম — শুরু করুন যেকোনো একটা দিয়ে`
      : done === TERMS.length
        ? `সবগুলো পড়া শেষ — ${TERMS.length}/${TERMS.length} ✓`
        : `${done}/${TERMS.length} পড়া হয়েছে`;

  const reset = line.querySelector("#learn-reset");
  if (reset) reset.hidden = done === 0;
}

document.getElementById("learn-reset")?.addEventListener("click", () => {
  localStorage.removeItem(KEY);
  paintProgress();
});

/* ---------- 2. random unread term ---------- */

document.getElementById("learn-random")?.addEventListener("click", () => {
  const read = readSet();
  const pool = TERMS.filter((t) => !read.has(t.slug));
  const pick = (pool.length ? pool : TERMS)[Math.floor(Math.random() * (pool.length || TERMS.length))];
  // route it through a .term link so it opens in the pop-up reader
  const link = document.querySelector(`a.term-card[href$="${pick.slug}.html"]`);
  if (link) link.click();
  else location.href = `/learn/terms/${pick.slug}.html`;
});

/* ---------- 3. A–Z glossary ---------- */

function buildGlossary() {
  const host = document.getElementById("glossary");
  if (!host) return;

  const sorted = [...TERMS].sort((a, b) => a.en.localeCompare(b.en));
  const letters = new Map();
  sorted.forEach((t) => {
    const letter = t.en[0].toUpperCase();
    if (!letters.has(letter)) letters.set(letter, []);
    letters.get(letter).push(t);
  });

  const az = document.getElementById("az");
  if (az) {
    az.replaceChildren(
      ...[..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"].map((letter) => {
        if (!letters.has(letter)) {
          const s = document.createElement("span");
          s.textContent = letter;
          return s;
        }
        const a = document.createElement("a");
        a.href = `#az-${letter}`;
        a.textContent = letter;
        return a;
      })
    );
  }

  const rows = [];
  for (const [letter, terms] of letters) {
    const head = document.createElement("div");
    head.className = "section-label mono";
    head.id = `az-${letter}`;
    head.style.cssText = "margin:22px 0 6px;border:0;padding:0";
    head.textContent = letter;
    rows.push(head);

    terms.forEach((t) => {
      const row = document.createElement("div");
      row.className = "g-row";
      const a = document.createElement("a");
      a.className = "term bn-h";
      a.href = `/learn/terms/${t.slug}.html`;
      a.textContent = t.bn;
      const en = document.createElement("span");
      en.className = "en";
      en.textContent = `${t.en} — ${TERM_GROUPS.find((g) => g.id === t.group)?.en ?? ""}`;
      row.append(a, en);
      rows.push(row);
    });
  }
  host.replaceChildren(...rows);
}

paintProgress();
buildGlossary();

// coming back from a term page (or closing the reader) should re-tick
addEventListener("pageshow", paintProgress);
document.getElementById("reader")?.addEventListener("click", () => setTimeout(paintProgress, 50));
