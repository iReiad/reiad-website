/* ============================================================
   pulse.js — the Insights page's market pulse.

   The fetching, the card and the mini window all live in
   /news.js now, because the home page shows one of these too and
   two copies of a headline renderer is one copy too many. What
   is left here is the page-specific part: the grid, the skeleton
   while it loads, and what to say when the feed can't be reached.

   Degrading, in order:
     1. live data
     2. the last successful fetch, kept on the device, labelled
        with when it was
     3. a compact note with links straight to the sources, and a
        retry button

   The section is never allowed to become a dead apology at the
   top of the page — if it can't be useful it gets out of the way.
   ============================================================ */

import { el, loadNews, newsCard, openNews, relTime } from "/news.js";
import { tiltIn } from "/tilt.js";

const box = document.getElementById("pulse");

function skeletons(n = 8) {
  const wrap = el("div", { className: "news-grid" });
  wrap.setAttribute("aria-hidden", "true");
  for (let i = 0; i < n; i++) wrap.append(el("div", { className: "news-card skeleton" }));
  return wrap;
}

function render(data, staleFrom) {
  const grid = el("div", { className: "news-grid" });
  data.items.forEach((it) => grid.append(newsCard(it, openNews)));

  const note = el("p", { className: "pulse-updated mono" });
  note.textContent = staleFrom
    ? `Offline: showing the last update, from ${relTime(new Date(staleFrom).toISOString())}`
    : `Updated ${relTime(data.updated)} · tap a card for a little more`;

  box.replaceChildren(grid, note);
  tiltIn(grid);   // the grid arrives long after initTilt has run
}

/** Can't reach it and nothing cached: stay small, stay useful. */
function fallback() {
  const retry = el("button", { className: "chip", type: "button", textContent: "Try again" });
  retry.addEventListener("click", () => load(true));

  box.replaceChildren(
    el("p", { className: "pulse-fallback" },
      "The live feed isn't reachable right now. The sources it pulls from are ",
      el("a", { href: "https://www.tbsnews.net/economy", rel: "noopener", target: "_blank",
                textContent: "The Business Standard" }),
      " and ",
      el("a", { href: "https://www.bbc.co.uk/news/business", rel: "noopener", target: "_blank",
                textContent: "BBC Business" }),
      ", both worth reading directly."
    ),
    el("div", { className: "row-flex" }, retry)
  );
}

async function load(isRetry = false) {
  if (!box) return;
  box.replaceChildren(skeletons());

  try {
    const { data, staleFrom } = await loadNews();
    render(data, staleFrom);
  } catch {
    // One quiet second chance — a first load during a flaky moment
    // shouldn't condemn the section for the whole visit.
    if (!isRetry) {
      setTimeout(() => load(true), 2500);
      return;
    }
    fallback();
  }
}

load();
