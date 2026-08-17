/* ============================================================
   recent.js: the last few pages this reader actually opened.

   The two schools already remember where you were: /learn/ and
   /deutsch/ each keep a "last lesson" bookmark and a set of
   ticks. What neither of them can answer is the question the
   home page needs to ask, "what were you looking at?"– because
   a reader's evening is rarely one school. It is a lesson, then
   a calculator, then an article, then the stock check.

   So this is a small, dumb, school-agnostic trail: title, url,
   kind, timestamp. Newest first, deduped by url, capped at TEN,
   stored on the device and never sent anywhere. It is a history
   list, not analytics: the same deal as the progress stores,
   and it is cleared by clearing browser data.

   WHAT IS DELIBERATELY NOT IN HERE

     · the home page itself. "You were recently at the page you
       are standing on" is noise.
     · the Studio, and anything else marked `private`– an admin
       screen has no business turning up in a public list.
     · a page that is only being prerendered. app.js prerenders
       the link under your pointer, scripts and all, so without
       whenActivated this would fill with pages nobody opened.
       That exact bug is why /activation.js exists; read the note
       at the top of it.
   ============================================================ */

import { whenActivated } from "/activation.js";

const KEY = "recent";
const MAX = 10;

/* Anything matching one of these is never recorded. */
const SKIP = [/^\/index\.html$/, /^\/$/, /^\/studio/, /^\/offline/, /^\/404/];

/** What kind of thing a URL is, for the icon and the label. */
function kindOf(path) {
  if (path.startsWith("/learn/terms/")) return "term";
  if (path.startsWith("/learn/")) return "learn";
  if (path.startsWith("/deutsch/")) return "deutsch";
  if (path.startsWith("/skills")) return "skill";
  if (path.startsWith("/tools/")) return "tool";
  if (path.startsWith("/insights/")) return "article";
  if (path.startsWith("/portfolio/")) return "case";
  return "page";
}

export function readRecent() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((r) => r && r.url && r.title) : [];
  } catch {
    return [];
  }
}

function write(list) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX)));
  } catch { /* private mode, or full: a history list is a nicety */ }
  dispatchEvent(new CustomEvent("recent:change"));
}

export function clearRecent() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  dispatchEvent(new CustomEvent("recent:change"));
}

/** The title to show: the page's own words, not the <title> tag's
    site suffix. Lesson and Teil pages already publish a clean one
    in a data attribute, which is the Bangla name; everything else
    gets the first segment of the document title. */
function titleOf() {
  const article = document.querySelector(
    "article[data-lesson-title], article[data-teil-title]"
  );
  const named = article?.dataset.lessonTitle || article?.dataset.teilTitle;
  if (named) return named;

  const h1 = document.querySelector("main h1")?.textContent?.trim();
  if (h1 && h1.length <= 80) return h1;

  return document.title.split(/[·:|]/)[0].trim();
}

/** Record this page. Called once, from app.js, on every page. */
export function recordPage() {
  const path = location.pathname.replace(/\/$/, "/index.html") || "/index.html";
  if (SKIP.some((re) => re.test(path))) return;

  whenActivated(() => {
    const title = titleOf();
    if (!title) return;

    const entry = {
      url: path + location.hash,
      title,
      kind: kindOf(path),
      lang: document.documentElement.lang === "bn" ? "bn" : "en",
      ts: Date.now(),
    };

    // Same page twice in a row is one visit, with the newer time.
    const rest = readRecent().filter((r) => r.url !== entry.url);
    write([entry, ...rest]);
  });
}
