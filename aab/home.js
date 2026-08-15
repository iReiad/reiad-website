/* ============================================================
   home.js: the part of the home page that knows who you are.

   Everything else on / is the same for everybody. This is the
   band that isn't: where you stopped reading, what else you had
   open, and one headline from the market pulse.

   All three are read off this device: the two schools' own
   bookmarks (/learn/progress.js, /deutsch/progress.js), the
   trail in /recent.js, and the pulse cache in /news.js. Nothing
   is fetched to build it except the news, and that is allowed to
   fail silently: a home page must not wait on a wire.

   THE RULE THIS FILE IS BUILT AROUND

   A first-time visitor sees none of it. Not an empty state, not
   a "nothing here yet"– the whole section stays `hidden`. An
   empty "continue where you left off" is worse than no offer at
   all, because it tells someone who has never been here that the
   site has lost their place. Each of the three parts is shown
   only when it has something in it, and the section itself only
   when at least one of them does.
   ============================================================ */

import { SKILLS, PAGES, ARTICLES, liveArticles, COUNTS, findCourse } from "/content.js";
import { findStage, stageLessons } from "/learn/curriculum.js";
import {
  getLast as learnLast, readSet as learnRead, nextUp as learnNext,
  overallStats as learnStats,
} from "/learn/progress.js";
import { findStufe, stufeTeile } from "/deutsch/curriculum.js";
import {
  getLast as deutschLast, overallStats as deutschStats,
  readSet as deutschRead, nextUp as deutschNext,
} from "/deutsch/progress.js";
import { findDhap, dhapLessons } from "/quran/curriculum.js";
import {
  getLast as quranLast, doneSet as quranDone, nextUp as quranNext,
  overallStats as quranStats,
} from "/quran/progress.js";
import { findTerm, termParts } from "/english/curriculum.js";
import {
  getLast as englishLast, readSet as englishRead, nextUp as englishNext,
  overallStats as englishStats,
} from "/english/progress.js";
import { readRecent } from "/recent.js";
import { current, cachedProfile } from "/account.js";
import { icon } from "/learn/icons.js";
import { el, cached, loadNews, newsCard, openNews, relTime } from "/news.js";
import { tiltIn } from "/tilt.js";

const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);

const section = document.getElementById("welcome-back");

/* ------------------------------------------------------------
   1. CONTINUE

   Each school is asked the same two questions, where were you,
   and what is next, and the answers are sorted by when they
   last happened. Two cards at most: a reader doing German in the
   evenings and the money ladder at weekends is one person with
   two places to be, and picking one for them would be wrong.
   ------------------------------------------------------------ */

/** The money ladder's answer, or null. */
function learnResume() {
  let last;
  try { last = learnLast(); } catch { return null; }
  if (!last?.url) return null;

  /* The next lesson OF THEIR OWN STAGE, not the earliest gap in
     the whole ladder: the same rule the Learn hub's own resume
     card uses, and for the same reason: being sent back to an
     unread starter step reads as the site losing your place. */
  const stage = findStage(last.stage);
  const read = learnRead();
  const inStage = stage
    ? stageLessons(stage).find((l) => l.status === "live" && !read.has(l.id))
    : null;
  const target = inStage ?? learnNext() ?? { url: last.url, bn: last.bn };

  let stats = { pct: 0 };
  try { stats = learnStats(); } catch { /* ignore */ }

  return {
    ts: last.ts ?? 0,
    icon: stage?.icon ?? "seed",
    where: stage ? `${stage.kicker} · ${stage.bn}` : "শেখার লাইব্রেরি",
    title: target.bn || last.bn || "পরের লেখা",
    url: target.url,
    pct: stats.pct,
    cta: "পড়া চালিয়ে যান →",
  };
}

/** German's answer, or null. Same rule as the ladder above: the
    next unwritten-off Teil of the Stufe they were IN, so that a
    learner three Stufen deep is not sent back to lesson one. */
function deutschResume() {
  let last;
  try { last = deutschLast(); } catch { return null; }
  if (!last?.url) return null;

  const stufe = findStufe(last.stufe);
  const read = deutschRead();
  const inStufe = stufe
    ? stufeTeile(stufe).find((t) => t.status === "live" && !read.has(t.id))
    : null;
  const target = inStufe ?? deutschNext() ?? { url: last.url, bn: last.bn };

  let stats = { pct: 0 };
  try { stats = deutschStats(); } catch { /* ignore */ }

  return {
    ts: last.ts ?? 0,
    icon: SKILLS.find((s) => s.slug === "deutsch")?.icon ?? "book",
    where: "জার্মান · Deutsch",
    title: target.bn || last.bn || "পরের Teil",
    url: target.url,
    pct: stats.pct,
    cta: "চালিয়ে যান →",
  };
}

/* Two more of the same, so the band knows every school rather than
   the two that existed when it was written. A learner three ধাপ
   into the Qur'an school was being offered German. */
function quranResume() {
  let last;
  try { last = quranLast(); } catch { return null; }
  if (!last?.url) return null;

  const dhap = findDhap(last.dhap);
  const done = quranDone();
  const inDhap = dhap
    ? dhapLessons(dhap).find((d) => d.status === "live" && !done.has(d.id))
    : null;
  const target = inDhap ?? quranNext() ?? { url: last.url, bn: last.bn };

  let stats = { pct: 0 };
  try { stats = quranStats(); } catch { /* ignore */ }

  return {
    ts: last.ts ?? 0,
    icon: SKILLS.find((sk) => sk.slug === "quran")?.icon ?? "book",
    where: "কুরআনের আরবি · Qur'anic Arabic",
    title: target.bn || last.bn || "পরের দিন",
    url: target.url,
    pct: stats.pct,
    cta: "চালিয়ে যান →",
  };
}

function englishResume() {
  let last;
  try { last = englishLast(); } catch { return null; }
  if (!last?.url) return null;

  const term = findTerm(last.term);
  const read = englishRead();
  const inTerm = term
    ? termParts(term).find((p) => p.status === "live" && !read.has(p.id))
    : null;
  const target = inTerm ?? englishNext() ?? { url: last.url, bn: last.bn };

  let stats = { pct: 0 };
  try { stats = englishStats(); } catch { /* ignore */ }

  return {
    ts: last.ts ?? 0,
    icon: SKILLS.find((sk) => sk.slug === "english")?.icon ?? "book",
    where: "মন থেকে ইংরেজি · English",
    title: target.bn || last.bn || "পরের পার্ট",
    url: target.url,
    pct: stats.pct,
    cta: "চালিয়ে যান →",
  };
}

function continueCard(r) {
  return el("a", { className: "wb-card", href: r.url },
    el("span", { className: "wb-art", innerHTML: icon(r.icon) }),
    el("span", { className: "wb-where mono", textContent: r.where }),
    el("strong", { className: "bn-h", textContent: r.title }),
    el("span", { className: "wb-bar", role: "img",
      ariaLabel: `${r.pct}% পড়া হয়েছে` },
      el("i", { style: `width:${r.pct}%` })
    ),
    el("span", { className: "more", textContent: `${bn(r.pct)}% · ${r.cta}` })
  );
}

/**
 * Which courses this reader said they were here for.
 *
 * Read off this device, never fetched. The profile is remembered
 * by account.js precisely so that this can be answered before the
 * page paints: the band it decides is the first thing on the
 * page, and a page that rearranges itself a second after loading
 * is worse than one that guessed. Signed out, or on a device that
 * has not seen the account yet, the answer is "none", and the
 * band falls back to ordering by when things last happened.
 */
const following = () => {
  const said = cachedProfile()?.following;
  return Array.isArray(said) ? said : [];
};

/* The four courses, by the id they are known by everywhere else:
   in localStorage, in sync.js, and in the `following` column. */
const RESUME = {
  learn: learnResume,
  deutsch: deutschResume,
  quran: quranResume,
  english: englishResume,
};

const FIRST_LESSON = {
  learn: learnNext,
  deutsch: deutschNext,
  quran: quranNext,
  english: englishNext,
};

const STATS = {
  learn: learnStats,
  deutsch: deutschStats,
  quran: quranStats,
  english: englishStats,
};

/**
 * A card for a course somebody said they were here for, when that
 * course has no bookmark to resume from. `nextUp()` is the first
 * lesson they have not read, which on an untouched course is
 * lesson one and on a half-read one is the right place anyway.
 *
 * This is the whole reason the question is asked on the account
 * page. A band that can only react to what has been read has
 * nothing at all to say to somebody who decided this morning to
 * start German, which is the moment they most needed a way in.
 *
 * The word on the button is decided by the course's own progress
 * rather than by the missing bookmark. Those come apart more
 * often than you would think: a bookmark is one key and the read
 * set is another, and somebody whose first sync brought back the
 * ticks from an old phone has read eleven lessons here and been
 * nowhere. Telling them to "start" a course they are a third of
 * the way through is the site failing to recognise them.
 */
function starterCard(id) {
  const course = findCourse(id);
  const next = FIRST_LESSON[id]?.();
  if (!course || !next?.url) return null;

  let pct = 0;
  try { pct = STATS[id]?.()?.pct ?? 0; } catch { /* a course with no store yet */ }

  return {
    id,
    ts: 0,                          // never beats a real bookmark
    icon: course.icon ?? "seed",
    where: `${course.bn} · ${course.en}`,
    title: next.bn || next.label || course.en,
    url: next.url,
    pct,
    cta: pct > 0 ? "চালিয়ে যান →" : "শুরু করুন →",
  };
}

/**
 * The band's cards.
 *
 * Order: what they said they are here for, then how recently they
 * were there. Followed first matters because the two are not the
 * same question. Somebody doing German every morning and dipping
 * into the money ladder once a fortnight should be offered German
 * first on the morning after the fortnightly dip, and by recency
 * alone they would not be.
 *
 * At most three: a band offering four things to continue is a
 * menu, not a nudge.
 */
function buildContinue(following = []) {
  const host = document.getElementById("wb-continue");
  if (!host) return false;

  const going = Object.entries(RESUME)
    .map(([id, resume]) => { const card = resume(); return card && { ...card, id }; })
    .filter(Boolean);

  const already = new Set(going.map((c) => c.id));
  const waiting = following
    .filter((id) => !already.has(id))
    .map(starterCard)
    .filter(Boolean);

  const followed = new Set(following);
  const cards = [...going, ...waiting]
    .sort((a, b) =>
      (followed.has(b.id) ? 1 : 0) - (followed.has(a.id) ? 1 : 0)
      || b.ts - a.ts)
    .slice(0, 3);

  if (!cards.length) { host.hidden = true; return false; }
  host.hidden = false;
  host.replaceChildren(...cards.map(continueCard));
  tiltIn(host);
  return true;
}

/* ------------------------------------------------------------
   2. RECENTLY VIEWED

   Deliberately small and deliberately plain: this is a way back
   to something, not a second navigation. Anything already
   offered by the continue cards above is dropped, so the band
   never says the same thing twice.
   ------------------------------------------------------------ */

/* Latin, deliberately. These are set in the site's mono face at
   0.6rem and uppercased, which is a treatment Bangla neither needs
   nor survives, "শব্দ" at that size in a fallback font is a smudge
   where "TERM" is a word. The titles beside them stay in whatever
   language the page was written in. */
const KIND_LABEL = {
  learn: "Learn", term: "Term", deutsch: "Deutsch", skill: "Skills",
  tool: "Tool", article: "Insights", case: "Case study", page: "Page",
};

function buildRecent(skipUrls) {
  const host = document.getElementById("wb-recent");
  if (!host) return false;

  const items = readRecent()
    .filter((r) => !skipUrls.has(r.url))
    .slice(0, 4);
  if (!items.length) { host.hidden = true; return false; }

  host.hidden = false;
  host.replaceChildren(
    el("span", { className: "wb-side-label mono", textContent: "Recently viewed" }),
    el("ul", { className: "wb-recent-list" },
      ...items.map((r) =>
        el("li", {},
          el("a", { href: r.url },
            el("span", {
              className: r.lang === "bn" ? "wb-recent-t bn-h" : "wb-recent-t",
              textContent: r.title,
            }),
            el("span", { className: "wb-recent-k mono",
              textContent: KIND_LABEL[r.kind] ?? "Page" })
          )
        )
      )
    )
  );
  return true;
}

/* ------------------------------------------------------------
   3. ONE HEADLINE

   The same card and the same mini window the Insights page
   uses, so a story opened here and a story opened there are the
   same object. Which one shows rotates: the pulse holds up to
   ten and a home page that always leads with the same story is
   a home page that stops being read.

   The cache is tried first and painted immediately, a headline
   from twenty minutes ago is worth more on screen now than a
   fresh one after a spinner, and the wire refreshes it if it
   answers. If neither has anything, the slot stays hidden.
   ------------------------------------------------------------ */

/** Rotates on the half-hour, which is also the feed's own cache
    window, so the card changes about as often as the data does. */
const rotate = (items) =>
  items[Math.floor(Date.now() / (30 * 60 * 1000)) % items.length];

function paintNews(data) {
  const host = document.getElementById("wb-news");
  if (!host || !data?.items?.length) return false;

  const it = rotate(data.items);
  host.hidden = false;
  host.replaceChildren(
    el("span", { className: "wb-side-label mono" },
      "Market pulse",
      el("a", { className: "wb-side-more", href: "/insights.html", textContent: "all →" })
    ),
    newsCard(it, openNews),
    el("span", { className: "wb-news-time mono",
      textContent: data.updated ? `Updated ${relTime(data.updated)}` : "" })
  );
  tiltIn(host);
  return true;
}

/* ============================================================
   4. THE PARTS OF THIS PAGE THAT DESCRIBE THE SITE

   Three blocks of the home page were lists of things that exist
   elsewhere, typed out by hand: the case studies, the featured
   article and the piece being written next.

   THE BUG THESE EXIST FOR

   Three case studies were added to the site. The home page went
   on showing the same three it had always shown, under a
   trailing line that named two of the four it was leaving out,
   because that line was a sentence in index.html and a sentence
   does not know that files appeared beside it. The portfolio
   page had the same fault at the same time, and between them
   they made four finished pieces of work invisible to anyone who
   did not already know the URLs.

   So none of it is typed any more. Each block is rebuilt from
   content.js, which is the file you edit when you publish
   something, and the markup left behind in index.html is the
   fallback a reader with no JavaScript gets.

   ROTATION. The case studies and the "writing next" card show a
   slice of a longer list, and which slice moves on a daily
   cycle. That is not decoration: a home page that shows the same
   three of seven forever is a home page where four pieces of
   work are permanently second-class. Daily, not per-visit, so
   that the page is stable while you are reading it and the
   prerendered copy in the speculation cache is never a different
   page from the one you land on.
   ============================================================ */

const DAY = 24 * 60 * 60 * 1000;

/** `count` items from `items`, starting at a point that advances
    once per `period`. Wraps, so the window is always full. */
function window_(items, count, period = DAY) {
  if (items.length <= count) return items;
  const start = Math.floor(Date.now() / period) % items.length;
  return Array.from({ length: count }, (_, i) => items[(start + i) % items.length]);
}

const caseStudies = () => PAGES.filter((p) => p.group === "case" && !p.private);

/* ---------- the case studies you can open ---------- */
function buildCases() {
  const host = document.getElementById("home-cases");
  if (!host) return;

  const all = caseStudies();
  if (!all.length) return;                 // nothing to say, keep the fallback
  const shown = window_(all, 3);

  host.replaceChildren(
    ...shown.map((p, i) =>
      el("a", { className: "big-link", href: p.url },
        el("span", { className: "num", textContent: String(i + 1).padStart(2, "0") }),
        el("span", { className: "t", textContent: p.short ?? p.title }),
        el("span", { className: "go", textContent: "→" }),
        el("span", { className: "d", textContent: p.blurb })
      )
    )
  );

  /* The line under the list counts what is not on it rather than
     naming a couple of them, which is the version that went out
     of date. */
  const rest = all.length - shown.length;
  const link = document.getElementById("home-cases-rest");
  if (link && rest > 0) {
    link.textContent = `${rest} more case ${rest === 1 ? "study" : "studies"}, and how a project runs →`;
  }
}

/* ---------- the featured piece ---------- */
function buildFeature() {
  const host = document.getElementById("home-feature");
  const latest = liveArticles()[0];
  if (!host || !latest) return;            // nothing published, keep the fallback

  host.replaceChildren(
    el("span", { className: "tag mono", textContent: `Featured · ${latest.tag}` }),
    el("h2", { textContent: latest.title, lang: latest.lang }),
    el("p", { textContent: latest.dek, lang: latest.lang }),
    el("a", {
      className: "more", href: `/insights/${latest.slug}.html`,
      textContent: "Read it →",
    })
  );
  if (latest.lang === "bn") host.querySelector("h2")?.classList.add("bn-h");
}

/* ---------- what is being written next ---------- */
function buildNext() {
  const host = document.getElementById("home-next");
  if (!host) return;

  /* Bangla only, and that is the point of the card rather than a
     limitation of it. This is the learner's half of the home
     page, it is marked lang="bn", and it is set in the Bangla
     serif: an English headline dropped into it would be a
     English sentence in a Bangla card in a Bangla typeface,
     which is exactly the thing this site exists to stop doing.
     Everything queued in English is already on the Insights
     page, one tap away, in the language it was written in. */
  const soon = ARTICLES.filter((a) => a.status === "soon" && a.lang === "bn");
  if (!soon.length) {
    /* Nothing queued in Bangla. Rather than leave a card
       advertising a piece that has since been published, or one
       written in the other language, the slot becomes a plain
       pointer at everything written so far. */
    host.replaceChildren(
      el("span", { className: "tag mono", textContent: "সব লেখা" }),
      el("h3", { className: "bn-h", textContent: `${bn(COUNTS.articles)}টা লেখা প্রকাশিত` }),
      el("p", { textContent: "নতুন লেখা এলে এখানেই আসবে।" }),
      el("a", { className: "more", href: "/insights.html", textContent: "সব লেখা →" })
    );
    return;
  }

  const [next] = window_(soon, 1);
  host.replaceChildren(
    el("span", { className: "tag mono", textContent: "লেখা হচ্ছে" }),
    el("h3", { className: "bn-h", textContent: next.title, lang: next.lang }),
    el("p", { textContent: next.dek, lang: next.lang }),
    el("a", { className: "more", href: "/insights.html", textContent: "সব লেখা →" })
  );
}

/* ------------------------------------------------------------
   go
   ------------------------------------------------------------ */

function reveal() {
  if (!section) return;
  const any = [...section.querySelectorAll("#wb-continue, #wb-recent, #wb-news")]
    .some((n) => !n.hidden);
  section.hidden = !any;
}

/* The heading has to describe what is actually underneath it. A
   band holding one news card should not be titled "pick up where
   you left off"– there is nothing to pick up. */
function relabel(hasContinue, hasRecent) {
  const label = document.getElementById("welcome-label");
  if (!label) return;
  label.textContent = hasContinue
    ? "Pick up where you left off"
    : hasRecent
      ? "Where you were"
      : "Since you were last here";
}

/* ------------------------------------------------------------
   Whose page is this?

   The home page opens by explaining who I am and what the site is
   for, which is exactly right for somebody who has never been
   here. For somebody who is nine lessons into the ladder it is a
   page about a stranger, sitting on top of the one thing they came
   back for.

   So the band moves above the hero when there is something in it.
   Not a different page and not a redirect: the same page, in the
   order that suits whoever is reading it. A first visit is
   untouched, because on a first visit the band is empty and stays
   where it was.
   ------------------------------------------------------------ */
function putReaderFirst() {
  const hero = document.querySelector("main .hero");
  if (!hero || !section || section.hidden) return;
  if (hero.compareDocumentPosition(section) & Node.DOCUMENT_POSITION_PRECEDING) return;
  hero.before(section);
  section.dataset.first = "true";
}

/** A name, when there is one, and an offer when there is not.

    Somebody with progress on this device and no account is one
    cleared browser away from losing it, and has no idea. This is
    the only place the site says so, once, next to the thing at
    risk. */
function greet(hasContinue) {
  const label = document.getElementById("welcome-label");
  const note = document.getElementById("welcome-note");
  if (!label) return;

  const who = current();
  if (who?.name) {
    label.textContent = hasContinue
      ? `Welcome back, ${who.name.split(" ")[0]}`
      : `Hello, ${who.name.split(" ")[0]}`;
  }

  if (!note) return;
  if (who) {
    note.hidden = true;
    return;
  }
  // Only worth saying to somebody who has something to lose.
  note.hidden = !hasContinue;
  note.replaceChildren(
    "Your place is saved on this device only. ",
    el("button", {
      className: "link-btn", type: "button", textContent: "Sign in",
      onclick: () => document.querySelector(".account-btn")?.click(),
    }),
    " to carry it to your phone."
  );
}

/* A tick that arrives from another device changes what "pick up
   where you left off" should say, so the band is rebuilt when the
   sync reports it moved something. */
let wired = false;
function watchForSync() {
  if (wired) return;
  wired = true;
  document.addEventListener("sync:done", () => build());
  document.addEventListener("account:changed", () => build());
  /* Ticking a course on the account page changes what this band
     should offer, and the account page is one click away. */
  document.addEventListener("profile:changed", () => build());
}

function build() {
  if (!section) return;
  watchForSync();

  const hasContinue = buildContinue(following());

  // Don't offer in the sidebar what the big card already offers.
  const offered = new Set(
    [...section.querySelectorAll("#wb-continue a")].map((a) =>
      a.getAttribute("href")
    )
  );
  const hasRecent = buildRecent(offered);

  relabel(hasContinue, hasRecent);
  reveal();
  putReaderFirst();
  greet(hasContinue);
}

build();

/* These three are not about the visitor, so they run for
   everyone, first time or hundredth. */
buildCases();
buildFeature();
buildNext();

/* The news is the one part that can arrive over a wire, so it
   paints itself and re-reveals rather than holding the rest up.

   The cache goes on screen first and unconditionally: a headline
   from twenty minutes ago is worth more now than a fresh one
   after a spinner, and the home page must never wait on a fetch.
   The wire then replaces it if it answers. */
const stale = cached();
if (stale?.data && paintNews(stale.data)) reveal();

loadNews()
  .then(({ data }) => { if (paintNews(data)) reveal(); })
  .catch(() => { /* no pulse today; the band carries on without it */ });
