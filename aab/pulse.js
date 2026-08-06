/* ============================================================
   pulse.js — the auto-updating market news list.

   Headlines are external text, so every value goes in through
   textContent. Nothing from the feed ever touches innerHTML.

   ENDPOINTS: the first one that answers wins. /api/news is the
   Cloudflare Pages Function in /functions/api/news.js; the
   workers.dev address is the same job running as a standalone
   Worker. Keeping both means the page survives either being the
   live one. (The old code fetched the workers.dev host without
   a scheme, which the browser read as a *relative* path — so
   the pulse could never load. That's the bug this fixes.)
   ============================================================ */

const ENDPOINTS = [
  "/api/news",
  "https://market-pulse.i-reiad.workers.dev/",
];

const TIMEOUT_MS = 6000;

const box = document.getElementById("pulse");

/* "3 hr ago", in the reader's own locale */
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

function skeletons(n = 5) {
  const wrap = document.createElement("div");
  wrap.className = "news-list";
  wrap.setAttribute("aria-hidden", "true");
  for (let i = 0; i < n; i++) {
    const row = document.createElement("div");
    row.className = "skeleton";
    wrap.append(row);
  }
  return wrap;
}

function newsItem(it) {
  const a = document.createElement("a");
  a.className = "news-item";
  a.href = it.url;
  a.target = "_blank";
  a.rel = "noopener";
  // an external link shouldn't be prerendered by the speculation rules
  a.dataset.noPrerender = "";

  const title = document.createElement("div");
  title.className = it.title_bn ? "nt nt-bn" : "nt";
  title.textContent = it.title_bn || it.title;
  a.append(title);

  if (it.title_bn) {
    const en = document.createElement("div");
    en.className = "nt-en";
    en.textContent = it.title;
    a.append(en);
  }

  const meta = document.createElement("div");
  meta.className = "news-meta";

  const pill = document.createElement("span");
  pill.className = `pill ${it.region === "BD" ? "pill-bd" : "pill-global"}`;
  pill.textContent = it.region === "BD" ? "Bangladesh" : "Global";

  const source = document.createElement("span");
  source.textContent = it.source ?? "";

  const time = document.createElement("time");
  if (it.published) time.dateTime = it.published;
  time.textContent = relTime(it.published);

  meta.append(pill, source, time);

  if (it.title_bn) {
    const auto = document.createElement("span");
    auto.textContent = "স্বয়ংক্রিয় অনুবাদ";
    meta.append(auto);
  }

  a.append(meta);
  return a;
}

async function fetchFirst(urls) {
  for (const url of urls) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(TIMEOUT_MS) });
      if (!res.ok) continue;
      const data = await res.json();
      if (data?.items?.length) return data;
    } catch {
      /* try the next endpoint */
    }
  }
  throw new Error("no endpoint answered");
}

function fail() {
  const p = document.createElement("p");
  p.className = "pulse-fallback";
  p.textContent = "Market pulse is taking a break — try refreshing in a minute.";
  box.replaceChildren(p);
}

if (box) {
  box.replaceChildren(skeletons());

  try {
    const data = await fetchFirst(ENDPOINTS);

    const list = document.createElement("div");
    list.className = "news-list";
    data.items.forEach((it) => list.append(newsItem(it)));

    const updated = document.createElement("p");
    updated.className = "pulse-updated mono";
    updated.textContent = `Updated ${relTime(data.updated)}`;

    box.replaceChildren(list, updated);
  } catch {
    fail();
  }
}
