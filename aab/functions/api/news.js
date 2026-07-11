/* ============================================================
   functions/api/news.js — Cloudflare Pages Function
   Served automatically at /api/news (the /functions folder maps
   to URL routes). Fetches trusted RSS feeds server-side, keeps
   only market-relevant stories via keyword scoring, dedupes,
   and caches the result at Cloudflare's edge for 30 minutes.
   No servers to run, no keys, deploys with every git push.
   ============================================================ */

const FEEDS = [
  { url: "https://www.tbsnews.net/economy/rss.xml",
    source: "The Business Standard", region: "BD" },
  { url: "https://www.tbsnews.net/international/business/rss.xml",
    source: "TBS World+Biz", region: "Global" },
  { url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    source: "BBC Business", region: "Global" },
];

/* Importance filter: a story must hit these keywords to appear.
   Weights are rough editorial judgment — tune freely. */
const KEYWORDS = [
  // strongly Bangladesh-market relevant
  ["dse", 3], ["dsex", 3], ["cse", 2], ["bsec", 3], ["dhaka stock", 3],
  ["stock market", 3], ["share market", 3], ["bangladesh bank", 3],
  ["sanchayapatra", 3], ["savings certificate", 3], ["ipo", 2], ["taka", 2],
  // market-moving macro
  ["interest rate", 2], ["monetary policy", 2], ["inflation", 2],
  ["central bank", 2], ["federal reserve", 2], ["fed ", 2], ["rate cut", 2],
  ["rate hike", 2], ["bond", 2], ["treasury", 2], ["exchange rate", 2],
  ["remittance", 2], ["stocks", 2], ["shares", 2], ["wall street", 2],
  ["mutual fund", 2], ["imf", 2], ["recession", 2],
  // general finance
  ["market", 1], ["bank", 1], ["economy", 1], ["investor", 1], ["gdp", 1],
  ["oil", 1], ["gold", 1], ["dollar", 1], ["tariff", 1], ["budget", 1],
  ["tax", 1], ["export", 1], ["trade", 1],
];

const MIN_SCORE = 2;        // below this = not important enough
const MAX_PER_SOURCE = 4;   // keep the mix diverse
const MAX_ITEMS = 10;
const CACHE_SECONDS = 1800; // 30 minutes

function decode(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

function pick(chunk, tag) {
  const m = chunk.match(new RegExp("<" + tag + "[^>]*>([\\s\\S]*?)</" + tag + ">", "i"));
  return m ? decode(m[1]) : "";
}

function parseFeed(xml, feed) {
  const out = [];
  const chunks = xml.split(/<item[\s>]/i).slice(1, 31); // up to 30 items
  for (const c of chunks) {
    const title = pick(c, "title");
    const link = pick(c, "link");
    const pubDate = pick(c, "pubDate");
    const desc = pick(c, "description").slice(0, 300); // scoring only, never output
    if (!title || !link) continue;
    const ts = Date.parse(pubDate);
    out.push({
      title, url: link,
      source: feed.source, region: feed.region,
      published: Number.isFinite(ts) ? new Date(ts).toISOString() : null,
      _ts: Number.isFinite(ts) ? ts : 0,
      _text: (title + " " + desc).toLowerCase(),
    });
  }
  return out;
}

function score(item) {
  let s = 0;
  for (const [kw, w] of KEYWORDS) if (item._text.includes(kw)) s += w;
  // freshness: small boost under 24h, penalty past 4 days
  const age = Date.now() - item._ts;
  if (item._ts && age < 24 * 3600e3) s += 1;
  if (item._ts && age > 96 * 3600e3) s -= 2;
  return s;
}

export async function onRequestGet(context) {
  const cache = caches.default;
  const cacheKey = new Request(new URL("/api/news", context.request.url));
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  const results = await Promise.allSettled(
    FEEDS.map(async (f) => {
      const r = await fetch(f.url, {
        headers: { "User-Agent": "reiad.co.uk market-pulse (personal site)" },
        cf: { cacheTtl: CACHE_SECONDS },
      });
      if (!r.ok) throw new Error(f.url + " " + r.status);
      return parseFeed(await r.text(), f);
    })
  );

  let items = results.flatMap((r) => (r.status === "fulfilled" ? r.value : []));

  // score, filter, sort
  items = items
    .map((it) => ({ ...it, _score: score(it) }))
    .filter((it) => it._score >= MIN_SCORE)
    .sort((a, b) => b._score - a._score || b._ts - a._ts);

  // dedupe near-identical titles + cap per source
  const seen = new Set();
  const perSource = {};
  const picked = [];
  for (const it of items) {
    const key = it.title.toLowerCase().replace(/[^a-z0-9\u0980-\u09FF]+/g, " ").slice(0, 60);
    if (seen.has(key)) continue;
    perSource[it.source] = (perSource[it.source] || 0) + 1;
    if (perSource[it.source] > MAX_PER_SOURCE) continue;
    seen.add(key);
    picked.push({ title: it.title, url: it.url, source: it.source,
                  region: it.region, published: it.published });
    if (picked.length >= MAX_ITEMS) break;
  }

  // Bangla summaries via Cloudflare Workers AI (free tier).
  // Defensive: if the AI binding isn't configured, skip silently and
  // serve English-only — the pulse must never break over a nice-to-have.
  if (context.env && context.env.AI) {
    await Promise.allSettled(picked.map(async (it) => {
      try {
        const r = await context.env.AI.run("@cf/meta/m2m100-1.2b", {
          text: it.title, source_lang: "english", target_lang: "bengali",
        });
        if (r && r.translated_text) it.title_bn = r.translated_text.trim();
      } catch (e) { /* leave this item English-only */ }
    }));
  }

  const body = JSON.stringify({
    updated: new Date().toISOString(),
    count: picked.length,
    items: picked,
  });
  const res = new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=" + CACHE_SECONDS,
    },
  });
  context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
}
