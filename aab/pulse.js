/* ============================================================
   pulse.js — the auto-updating market news list.

   Headlines are external text, so every value goes in through
   textContent. Nothing from the feed ever touches innerHTML.

   ENDPOINTS: both are raced, and the first one to answer with
   usable data wins. /api/news is the Cloudflare Pages Function
   in /functions/api/news.js; the workers.dev address is the same
   job running as a standalone Worker. Racing them means the page
   doesn't care which one is currently deployed, and doesn't wait
   out a timeout on the one that isn't.

   Degrading, in order:
     1. live data
     2. the last successful fetch, kept on the device, labelled
        with when it was
     3. a compact note with links straight to the sources, and a
        retry button

   The section is never allowed to become a dead apology at the
   top of the page — if it can't be useful it gets out of the way.
   ============================================================ */

const ENDPOINTS = [
  "/api/news",
  "https://market-pulse.i-reiad.workers.dev/",
];

const TIMEOUT_MS = 5000;
const CACHE_KEY = "pulse-cache";
const CACHE_MAX_AGE = 24 * 3600 * 1000;   // a day-old headline is still context

const box = document.getElementById("pulse");

/* "3 hours ago", in the reader's own locale */
const rtf = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
function relTime(iso) {
  if (!iso) return "";
  const mins = Math.round((Date.now() - Date.parse(iso)) / 60000);
  if (!Number.isFinite(mins)) return "";
  if (mins < 60) return rtf.format(-mins, "minute");
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return rtf.format(-hrs, "hour");
  return rtf.format(-Math.round(hrs / 24), "day");
}

const el = (tag, props = {}, ...kids) => {
  const node = Object.assign(document.createElement(tag), props);
  node.append(...kids.filter(Boolean));
  return node;
};

function skeletons(n = 5) {
  const wrap = el("div", { className: "news-list" });
  wrap.setAttribute("aria-hidden", "true");
  for (let i = 0; i < n; i++) wrap.append(el("div", { className: "skeleton" }));
  return wrap;
}

function newsItem(it) {
  const a = el("a", { className: "news-item", href: it.url, target: "_blank", rel: "noopener" });
  a.dataset.noPrerender = "";   // don't prerender someone else's site

  a.append(el("div", {
    className: it.title_bn ? "nt nt-bn" : "nt",
    textContent: it.title_bn || it.title,
  }));
  if (it.title_bn) a.append(el("div", { className: "nt-en", textContent: it.title }));

  const time = el("time", { textContent: relTime(it.published) });
  if (it.published) time.dateTime = it.published;

  a.append(el("div", { className: "news-meta" },
    el("span", {
      className: `pill ${it.region === "BD" ? "pill-bd" : "pill-global"}`,
      textContent: it.region === "BD" ? "Bangladesh" : "Global",
    }),
    el("span", { textContent: it.source ?? "" }),
    time,
    it.title_bn ? el("span", { textContent: "স্বয়ংক্রিয় অনুবাদ" }) : null
  ));
  return a;
}

/* ---------- fetching ---------- */

async function fetchOne(url) {
  const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
  if (!res.ok) throw new Error(String(res.status));
  const data = await res.json();
  if (!data?.items?.length) throw new Error("empty");
  return data;
}

/** Whichever endpoint answers first with usable data. */
const fetchAny = () => Promise.any(ENDPOINTS.map(fetchOne));

function cache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data }));
  } catch { /* storage full or blocked; the cache is a bonus */ }
}

function cached() {
  try {
    const raw = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (!raw || Date.now() - raw.at > CACHE_MAX_AGE) return null;
    return raw;
  } catch { return null; }
}

/* ---------- rendering ---------- */

function render(data, staleFrom) {
  const list = el("div", { className: "news-list" });
  data.items.forEach((it) => list.append(newsItem(it)));

  const note = el("p", { className: "pulse-updated mono" });
  note.textContent = staleFrom
    ? `Offline — showing the last update, from ${relTime(new Date(staleFrom).toISOString())}`
    : `Updated ${relTime(data.updated)}`;

  box.replaceChildren(list, note);
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
      " — both worth reading directly."
    ),
    el("div", { className: "row-flex" }, retry)
  );
}

/* ---------- go ---------- */

async function load(isRetry = false) {
  if (!box) return;
  box.replaceChildren(skeletons());

  try {
    const data = await fetchAny();
    cache(data);
    render(data);
  } catch {
    const stale = cached();
    if (stale) {
      render(stale.data, stale.at);
      return;
    }
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
