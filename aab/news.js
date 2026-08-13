/* ============================================================
   news.js: the market pulse, as a thing you can look at.

   Headlines are external text. Every value goes in through
   textContent; nothing from the feed ever touches innerHTML.

   This module owns three things that both the Insights page and
   the home page need, and neither should own twice:

     1. FETCHING.  Two endpoints, raced, first usable answer
        wins: /api/news (the handler in functions/api/news.js)
        and the same job running as a standalone Worker. Racing
        them means the page doesn't care which one is currently
        deployed and doesn't wait out a timeout on the one that
        isn't. Degrades to the last successful fetch kept on the
        device, labelled with when it was.

     2. THE CARD.  A square, because a grid of squares reads as a
        board of stories where a list of rules reads as a table
        of contents, and because the thing being scanned here is
        the headline, not the ordering.

     3. THE MINI WINDOW.  A card opens into a <dialog> rather
        than straight out to the publisher, so that a reader can
        see the standfirst, the source and the time and then
        decide. The window grows out of the card it came from,
        a real FLIP, measured from the card's own rectangle, so
        it is obvious which of twelve squares you just opened.
        Under prefers-reduced-motion it simply appears.

   Every link out is rel="noopener" and marked data-no-prerender:
   prerendering someone else's site on hover is not ours to do.
   ============================================================ */

const ENDPOINTS = [
  "/api/news",
  "https://market-pulse.i-reiad.workers.dev/",
];

const TIMEOUT_MS = 5000;
const CACHE_KEY = "pulse-cache";
const CACHE_MAX_AGE = 24 * 3600 * 1000;   // a day-old headline is still context

export const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

/* "3 hours ago", in the reader's own locale */
const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
export function relTime(iso) {
  if (!iso) return "";
  const mins = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (!Number.isFinite(mins)) return "";
  if (mins < 60) return rtf.format(-mins, "minute");
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return rtf.format(-hrs, "hour");
  return rtf.format(-Math.round(hrs / 24), "day");
}

/* ------------------------------------------------------------
   fetching
   ------------------------------------------------------------ */

async function fetchOne(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  if (!data?.items?.length) throw new Error("empty");
  return data;
}

function cache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch { /* storage full or blocked; the cache is a bonus */ }
}

export function cached() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (!raw || Date.now() - raw.at > CACHE_MAX_AGE) return null;
    return raw;
  } catch { return null; }
}

/**
 * { data, staleFrom }, staleFrom set when this came off the device
 * rather than off the wire. Throws only when there is neither.
 */
export async function loadNews() {
  try {
    const data = await Promise.any(ENDPOINTS.map(fetchOne));
    cache(data);
    return { data, staleFrom: null };
  } catch {
    const stale = cached();
    if (stale) return { data: stale.data, staleFrom: stale.at };
    throw new Error("unreachable");
  }
}

/* ------------------------------------------------------------
   the card
   ------------------------------------------------------------ */

const regionLabel = (it) => (it.region === "BD" ? "Bangladesh" : "Global");

/** One square. `onOpen` gets (item, card): see openNews below. */
export function newsCard(it, onOpen) {
  const card = el("button", { type: "button", className: "news-card" });
  card.dataset.region = it.region === "BD" ? "bd" : "global";

  const time = el("time", { textContent: relTime(it.published) });
  if (it.published) time.dateTime = it.published;

  card.append(
    el("span", { className: "news-card-top" },
      el("span", {
        className: `pill ${it.region === "BD" ? "pill-bd" : "pill-global"}`,
        textContent: regionLabel(it),
      }),
      time
    ),
    el("span", {
      className: it.title_bn ? "news-card-title nt-bn" : "news-card-title",
      textContent: it.title_bn || it.title,
    }),
    /* The first line or two of the publisher's standfirst. A square
       with a two-line headline in it is mostly paper, and a card
       that shows nothing beyond its own title gives a reader no
       reason to open it. The rest is in the window. */
    it.summary ? el("span", { className: "news-card-sum", textContent: it.summary }) : null,
    el("span", { className: "news-card-foot" },
      el("span", { className: "mono news-card-src", textContent: it.source ?? "" }),
      /* An arrow and not a word. "আরও →" was 55px of a 209px row,
         and the only way to fit it beside "The Business Standard"
         was to take the last five letters off the publisher's
         name, on every card that named them. */
      el("span", { className: "news-card-go", ariaHidden: "true", textContent: "→" })
    )
  );

  card.addEventListener("click", () => onOpen(it, card));
  return card;
}

/* ------------------------------------------------------------
   the mini window

   One dialog, built once and reused, because twelve dialogs in
   the DOM to show one at a time is twelve dialogs to keep in
   step. showModal() gives us the focus trap, the backdrop and
   Escape for free.
   ------------------------------------------------------------ */

let dialog;

function buildDialog() {
  const d = el("dialog", { className: "news-window", id: "news-window" });
  d.setAttribute("aria-label", "Story");
  d.innerHTML = `
    <div class="news-window-bar">
      <span class="news-window-meta mono"></span>
      <button class="icon-btn push" type="button" data-close aria-label="Close">✕ Esc</button>
    </div>
    <div class="news-window-body">
      <h2 class="news-window-title"></h2>
      <p class="news-window-en" hidden></p>
      <p class="news-window-sum"></p>
      <p class="news-window-note mono"></p>
    </div>
    <div class="news-window-foot">
      <a class="btn btn-solid" target="_blank" rel="noopener" data-no-prerender>Read it at the source →</a>
      <a class="btn btn-ghost" href="/insights.html">All the headlines</a>
    </div>`;
  document.body.append(d);
  d.querySelector("[data-close]").addEventListener("click", () => d.close());
  d.addEventListener("click", (e) => { if (e.target === d) d.close(); });
  return d;
}

/** Grow the window out of the card it came from. */
function flip(from) {
  if (!from) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (typeof dialog.animate !== "function") return;

  const a = from.getBoundingClientRect();
  const b = dialog.getBoundingClientRect();
  if (!b.width || !b.height) return;

  const dx = a.left + a.width / 2 - (b.left + b.width / 2);
  const dy = a.top + a.height / 2 - (b.top + b.height / 2);

  dialog.animate(
    [
      {
        transform: `translate(${dx}px, ${dy}px) scale(${a.width / b.width}, ${a.height / b.height})`,
        opacity: 0.4,
      },
      { transform: "translate(0, 0) scale(1, 1)", opacity: 1 },
    ],
    { duration: 320, easing: "cubic-bezier(0.2, 0.7, 0.2, 1)" }
  );
}

/** Open the mini window on one story, growing it out of `from`. */
export function openNews(it, from) {
  dialog ??= buildDialog();

  const bn = Boolean(it.title_bn);
  const title = dialog.querySelector(".news-window-title");
  title.textContent = it.title_bn || it.title;
  title.classList.toggle("nt-bn", bn);

  const en = dialog.querySelector(".news-window-en");
  en.textContent = it.title;
  en.hidden = !bn;

  const summary = dialog.querySelector(".news-window-sum");
  summary.textContent = it.summary || "";
  summary.hidden = !it.summary;

  dialog.querySelector(".news-window-meta").textContent =
    [regionLabel(it), it.source, relTime(it.published)].filter(Boolean).join("  ·  ");

  dialog.querySelector(".news-window-note").textContent = bn
    ? "শিরোনামের বাংলা রূপ স্বয়ংক্রিয় অনুবাদ। পুরো খবরটা মূল সূত্রে।"
    : "Selected automatically, and summarised from the publisher's own standfirst. The full story is at the source.";

  const out = dialog.querySelector(".news-window-foot a");
  out.href = it.url;
  out.textContent = it.source ? `Read it at ${it.source} →` : "Read it at the source →";

  dialog.showModal();
  flip(from);
}
