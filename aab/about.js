/* ============================================================
   about.js: the research window on the About page.

   Each research card became a case study you can open and drive.
   The cards did not say so for a while: they described the work
   in the past tense and led nowhere, while the interactive
   version of the same work sat two clicks away in the portfolio.
   Now a card opens a mini window, the same one the market-pulse
   cards open on the Insights page, and the window is the way into
   the case study.

   The tally under the glance was this file's too, out of COUNTS.
   It is the route's now, rendered on the server, so a reader with
   no JavaScript gets the numbers instead of four dashes.
   ============================================================ */

import { el, flip } from "/news.js";

/* ------------------------------------------------------------
   the research window

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
