/* ============================================================
   about.js: the two things on the About page that must not be
   typed by hand.

   1. THE TALLY. The page claims a number of lessons, stages,
      calculators and models. Written as literals, those go stale
      the first time a stage is added and nobody remembers the
      About page exists, and a page whose own arithmetic is out of
      date is a poor advertisement for someone who models for a
      living. They come from COUNTS in content.js, which counts
      the data rather than remembering it.

   2. THE RESEARCH WINDOW. Each research card became a case study
      you can open and drive. The cards did not say so for a
      while: they described the work in the past tense and led
      nowhere, while the interactive version of the same work sat
      two clicks away in the portfolio. Now a card opens a mini
      window, the same one the market-pulse cards open on the
      Insights page, and the window is the way into the case
      study.
   ============================================================ */

import { COUNTS, PAGES } from "/content.js";
import { el, flip } from "/news.js";

/* ------------------------------------------------------------
   1. the tally
   ------------------------------------------------------------ */
const set = (key, value) => {
  const node = document.querySelector(`[data-tally="${key}"]`);
  if (node) node.textContent = value;
};

try {
  /* Lessons WRITTEN, not lessons planned. This used to count
     allLessons(), which includes everything still marked "soon",
     so the About page advertised 89 while the home page, counting
     the same library properly, said 60. The two pages were
     describing the same shelf. */
  set("lessons", COUNTS.lessons);
  set("stages", COUNTS.stages);
  set("tools", COUNTS.calculators);

  /* "Models" means the things you can open and drive: the case
     studies plus the stock check. They are the pages tagged
     `case` or `tool` in the manifest, which is the same tagging
     the menu and the palette group by, so publishing another one
     updates this line without anyone editing it. */
  set("models", PAGES.filter((p) => !p.private
    && (p.group === "case" || p.group === "tool")).length);
} catch {
  /* The dashes already in the markup are the fallback: a failed
     count leaves a tidy page, not a page full of NaN. */
}

/* ------------------------------------------------------------
   2. the research window

   Same component as the news window, deliberately. Two mini
   windows on one site that opened differently would be two
   things to learn, and this one is doing the same job: a card
   too small for the whole story, and a story that ends somewhere
   else.

   PROGRESSIVE ENHANCEMENT. With no JavaScript the cards stay
   exactly what they were, plus a plain link to the case study
   added below, so the research still leads somewhere. The window
   is an upgrade on that, never a replacement for it.
   ------------------------------------------------------------ */
const cards = [...document.querySelectorAll(".res[data-case]")];

if (cards.length) {
  let win;

  const build = () => {
    const d = el("dialog", { className: "news-window res-window", id: "res-window" });
    d.setAttribute("aria-label", "Research");
    d.innerHTML = `
      <div class="news-window-bar">
        <span class="news-window-meta mono"></span>
        <button class="icon-btn push" type="button" data-close aria-label="Close">✕ Esc</button>
      </div>
      <div class="news-window-body">
        <h2 class="news-window-title"></h2>
        <div class="res-window-detail"></div>
      </div>
      <div class="news-window-foot">
        <a class="btn btn-solid" data-case-link></a>
        <a class="btn btn-ghost" href="/portfolio.html">All the case studies</a>
      </div>`;
    document.body.append(d);
    d.querySelector("[data-close]").addEventListener("click", () => d.close());
    d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
    return d;
  };

  const open = (card) => {
    win ??= build();

    win.querySelector(".news-window-meta").textContent =
      card.querySelector(".res-tag")?.textContent ?? "Research";
    win.querySelector(".news-window-title").textContent =
      card.querySelector("h3")?.textContent ?? "";

    /* The detail lives in a <template> in the markup, so it is
       page copy that happens to be shown in a window, rather than
       a second copy of the page kept in a script. */
    const detail = win.querySelector(".res-window-detail");
    const source = card.querySelector("template[data-detail]");
    detail.replaceChildren(
      source
        ? source.content.cloneNode(true)
        : el("p", { textContent: card.querySelector("p")?.textContent ?? "" })
    );

    const out = win.querySelector("[data-case-link]");
    out.href = card.dataset.case;
    out.textContent = `${card.dataset.caseLabel ?? "Open the case study"} →`;

    win.showModal();
    flip(win, card);
  };

  for (const card of cards) {
    /* The card becomes the button rather than growing one: a
       button inside a card leaves most of the card unclickable,
       which on a phone is most of the target. role and tabindex
       rather than a real <button>, because the card holds an <h3>
       and a <template> and a button may not contain a heading. */
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.classList.add("res-live");

    card.addEventListener("click", () => open(card));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(card); }
    });

    /* The no-JavaScript link is replaced by the card's own
       behaviour, so it is removed here rather than left as a
       second way in that says the same thing twice. */
    card.querySelector(".res-fallback")?.remove();
  }
}
