/* ============================================================
   crumbs.js: the path line under the header, on every page.

   The thing shopping sites do, and the reason they do it: once a
   site has depth, a visitor who arrived from a search result has
   no idea where they are standing. A breadcrumb answers that in
   one line, and, more usefully, gives them the parent to climb
   to. The Learn area is now four levels deep, so this stopped
   being decoration.

   How the trail is worked out:
     · /learn/** is read from the curriculum, so a lesson knows
       its stage and a stage knows the school. Rename a stage in
       curriculum.js and every crumb follows.
     · everything else comes from PAGES in /content.js, plus the
       article title on an insights page.

   No page needs any markup for this. app.js imports the module
   and it puts itself in place: the same trick the menu uses, so
   that a page nobody has touched in a year still gets it.

   The JSON-LD copy is what puts the trail into Google's result
   snippet instead of a bare URL.
   ============================================================ */

import {
  STAGES, stageUrl, allLessons, findStage,
} from "/learn/curriculum.js";
import {
  STUFEN, stufeUrl, allTeile, findStufe, workbookUrl,
} from "/deutsch/curriculum.js";
import { PAGES, SITE, liveArticles } from "/content.js";

const isBn = () => document.documentElement.lang === "bn";
/* The German pages are lang="bn" throughout, so a crumb reading
   "60 দিনের খাতা" next to Bangla prose reads as a glitch. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[d]);
const HOME = () => (isBn() ? "হোম" : "Home");
const LEARN = () => (isBn() ? "শেখার লাইব্রেরি" : "Learn");
const DEUTSCH = () => (isBn() ? "জার্মান" : "Deutsch");
const SKILLS = () => (isBn() ? "দক্ষতা" : "Skills");

/** Normalise the URL Pages might serve us: /learn, /learn/ and
    /learn/index.html are all the same place. */
function normalise(path) {
  let p = path.replace(/\/+$/, "");
  if (!p) return "/index.html";
  if (!/\.[a-z0-9]+$/i.test(p)) {
    // extensionless: either a folder index or a stripped .html
    const isFolder =
      STAGES.some((s) => `/learn/${s.slug}` === p) ||
      STUFEN.some((s) => `/deutsch/${s.slug}` === p) ||
      p === "/learn" || p === "/deutsch" || p === "/tools" || p === "/skills";
    return isFolder ? `${p}/index.html` : `${p}.html`;
  }
  return p;
}

/** [{ name, url }] from the root down to, but not including,
    the current page, which is added by the caller as plain text. */
function trailFor(path) {
  const p = normalise(path);
  const crumbs = [{ name: HOME(), url: "/index.html" }];

  /* ---------- the Learn area ---------- */
  if (p.startsWith("/learn/")) {
    if (p === "/learn/index.html") return { crumbs, here: LEARN() };

    crumbs.push({ name: LEARN(), url: "/learn/index.html" });

    // a stage index: /learn/basics-2/index.html
    const stageHere = STAGES.find((s) => p === `/learn/${s.slug}/index.html`);
    if (stageHere) return { crumbs, here: `${stageHere.kicker} · ${stageHere.bn}` };

    // a lesson
    const lesson = allLessons().find((l) => l.url === p);
    if (lesson) {
      crumbs.push({
        name: `${lesson.stage.kicker} · ${lesson.stage.bn}`,
        url: stageUrl(lesson.stage),
      });
      return { crumbs, here: lesson.bn };
    }

    // an unlisted page under /learn/terms/, still give it its stage
    if (p.startsWith("/learn/terms/")) {
      const stage = findStage("basics-1");
      if (stage) crumbs.push({ name: `${stage.kicker} · ${stage.bn}`, url: stageUrl(stage) });
      return { crumbs, here: document.title.split("\u2014")[0].trim() };
    }
    return { crumbs, here: document.title.split("\u2014")[0].trim() };
  }

  /* ---------- the skills index ---------- */
  if (p === "/skills/index.html") return { crumbs, here: SKILLS() };

  /* ---------- the German school ----------
     German sits under Skills now, so the trail says so: a Teil is
     Home › Skills › Deutsch › Stufe 1 › the Teil. */
  if (p.startsWith("/deutsch/")) {
    crumbs.push({ name: SKILLS(), url: "/skills/index.html" });
    if (p === "/deutsch/index.html") return { crumbs, here: DEUTSCH() };

    crumbs.push({ name: DEUTSCH(), url: "/deutsch/index.html" });

    // a Stufe index: /deutsch/stufe-2/index.html
    const stufeHere = STUFEN.find((s) => p === `/deutsch/${s.slug}/index.html`);
    if (stufeHere) return { crumbs, here: `${stufeHere.kicker} · ${stufeHere.bn}` };

    // the practice book, which hangs off its Stufe rather than off a Teil
    const bookStufe = STUFEN.find((s) => workbookUrl(s) === p);
    if (bookStufe) {
      crumbs.push({
        name: `${bookStufe.kicker} · ${bookStufe.bn}`,
        url: stufeUrl(bookStufe),
      });
      return { crumbs, here: `${bn(bookStufe.workbook.days)} দিনের খাতা` };
    }

    // a Teil
    const teil = allTeile().find((t) => t.url === p);
    if (teil) {
      crumbs.push({
        name: `${teil.stufe.kicker} · ${teil.stufe.bn}`,
        url: stufeUrl(teil.stufe),
      });
      return { crumbs, here: teil.bn };
    }

    // anything else under /deutsch/, still give it the school
    const slug = p.split("/")[2];
    const stufe = findStufe(slug);
    if (stufe) crumbs.push({ name: `${stufe.kicker} · ${stufe.bn}`, url: stufeUrl(stufe) });
    return { crumbs, here: document.title.split("·")[0].trim() };
  }

  /* ---------- the advanced tools, which have their own pages ---------- */
  if (p.startsWith("/tools/") && p !== "/tools/index.html") {
    crumbs.push({ name: isBn() ? "টুল" : "Tools", url: "/tools/index.html" });
    return { crumbs, here: document.title.split("\u2014")[0].trim() };
  }

  /* ---------- portfolio case studies ---------- */
  if (p.startsWith("/portfolio/")) {
    crumbs.push({ name: "Portfolio", url: "/portfolio.html" });
    return { crumbs, here: document.title.split("\u2014")[0].trim() };
  }

  /* ---------- insights ---------- */
  if (p.startsWith("/insights/")) {
    crumbs.push({ name: "Insights", url: "/insights.html" });
    const slug = p.replace("/insights/", "").replace(".html", "");
    const article = liveArticles().find((a) => a.slug === slug);
    return { crumbs, here: article?.title ?? document.title.split("\u2014")[0].trim() };
  }

  /* ---------- everything else, from PAGES ---------- */
  const page = PAGES.find((x) => x.url === p);
  if (page) return { crumbs, here: page.title.split("\u2014")[0].trim() };

  return { crumbs, here: document.title.split("\u2014")[0].trim() };
}

/* ------------------------------------------------------------
   render
   ------------------------------------------------------------ */

function render() {
  // The home page is the root, a trail with one item is noise.
  const path = normalise(location.pathname);
  if (path === "/index.html") return;

  const host = document.querySelector("main > .wrap") || document.querySelector("main");
  if (!host) return;
  if (host.querySelector(".crumbs")) return; // already there (a static page may ship its own)

  const { crumbs, here } = trailFor(location.pathname);

  const nav = document.createElement("nav");
  nav.className = "crumbs";
  nav.setAttribute("aria-label", isBn() ? "পথ" : "Breadcrumb");

  const ol = document.createElement("ol");
  crumbs.forEach((c) => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = c.url;
    a.textContent = c.name;
    li.append(a);
    ol.append(li);
  });

  const last = document.createElement("li");
  last.setAttribute("aria-current", "page");
  last.textContent = here;
  ol.append(last);

  nav.append(ol);
  host.prepend(nav);

  /* ---------- the machine-readable copy ---------- */
  const items = [...crumbs, { name: here, url: path }].map((c, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: c.name,
    item: `${SITE.origin}${c.url}`,
  }));

  const ld = document.createElement("script");
  ld.type = "application/ld+json";
  ld.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items,
  });
  document.head.append(ld);
}

export function initCrumbs() {
  try {
    render();
  } catch {
    /* a missing crumb must never cost anyone the page itself */
  }
}
