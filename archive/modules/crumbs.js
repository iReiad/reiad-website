/* crumbs.ts: the path line under the header, on every page.

   Once a site has depth, a visitor who arrived from a search
   result needs to know where they are standing and what the
   parent is. The schools are four levels deep.

   The trail comes from the curriculum modules for the four
   schools, and from PAGES in /content.js for everything else. No
   page needs markup for it: app.js imports this and it puts
   itself in place, so a page nobody has touched in a year gets
   one.

   The JSON-LD copy is what puts the trail into a search result
   instead of a bare URL. */
import { STAGES, stageUrl, allLessons, findStage, } from "/money/curriculum.js";
import { STUFEN, stufeUrl, allTeile, findStufe, workbookUrl, } from "/deutsch/curriculum.js";
import { DHAPS, dhapUrl, allLessons as allDars, } from "/quran/curriculum.js";
import { TERMS, termUrl, allParts, findTerm, workbookUrl as englishBookUrl, } from "/english/curriculum.js";
import { PAGES, SITE, READS } from "/content.js";
const isBn = () => document.documentElement.lang === "bn";
/* The German pages are lang="bn" throughout, so a crumb reading
   "60 দিনের খাতা" next to Bangla prose reads as a glitch. */
const bn = (n) => String(n).replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[Number(d)]);
const HOME = () => (isBn() ? "হোম" : "Home");
const LEARN = () => (isBn() ? "শেখার লাইব্রেরি" : "Learn");
const DEUTSCH = () => (isBn() ? "জার্মান" : "Deutsch");
const QURAN = () => (isBn() ? "কুরআনের আরবি" : "Qur'anic Arabic");
const ENGLISH = () => (isBn() ? "মন থেকে ইংরেজি" : "English From The Heart");
const SKILLS = () => (isBn() ? "দক্ষতা" : "Skills");
const COURSES = () => (isBn() ? "কোর্স" : "Courses");
const sectionName = (section) => (isBn() ? section.bn : section.en);
/** The page's own name, with the site's name taken off the end.

    Every `<title>` here ends in the site name behind a separator,
    and which separator varies: a middle dot on most, a comma on
    the two reading hubs, both on the German school. So this
    strips the NAME rather than splitting on punctuation.

    Six call sites used to split on U+2014, which this site's
    house rules guarantee never appears in any of its copy, so the
    split did nothing and the whole title came through. The
    breadcrumb on a course lesson read "Home > Lesson,
    Reiad's Library". Written as an escape, it was invisible to
    the check that greps for the character.

    Two others split on the middle dot, which is right until a
    title has one in its own name.

    Falls back to the whole title, which is wrong in fewer ways
    than an empty crumb. */
const SUFFIX = new RegExp(`\\s*[,\u00b7\\u2013|-]?\\s*${SITE.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`);
const stripSite = (title) => title.replace(SUFFIX, "").trim() || title.trim();
/** The title of the piece being read.

    Off the page itself rather than out of a list: a piece is a
    row, and the trail cannot wait on a query to draw itself. The
    heading is server-rendered before this file runs and is right
    for every piece whatever store it came from. */
const pieceTitle = () => document.querySelector("main h1")?.textContent?.trim()
    || stripSite(document.title);
/** What the last crumb says when nothing better is known. */
const hereTitle = () => stripSite(document.title);
function normalise(path) {
    let p = path.replace(/\/+$/, "");
    if (!p)
        return "/index.html";
    if (!/\.[a-z0-9]+$/i.test(p)) {
        // extensionless: either a folder index or a stripped .html
        const isFolder = STAGES.some((s) => `/money/${s.slug}` === p) ||
            STUFEN.some((s) => `/deutsch/${s.slug}` === p) ||
            DHAPS.some((d) => `/quran/${d.slug}` === p) ||
            TERMS.some((t) => `/english/${t.slug}` === p) ||
            p === "/money" || p === "/deutsch" || p === "/quran" ||
            p === "/english" || p === "/cooking" || p === "/travel" ||
            p === "/tools" || p === "/skills";
        return isFolder ? `${p}/index.html` : `${p}.html`;
    }
    return p;
}
function trailFor(path) {
    const p = normalise(path);
    const crumbs = [{ name: HOME(), url: "/index.html" }];
    /* ---------- the Learn area ---------- */
    if (p.startsWith("/money/")) {
        if (p === "/money/index.html")
            return { crumbs, here: LEARN() };
        crumbs.push({ name: LEARN(), url: "/money/index.html" });
        // a stage index: /money/basics-2/index.html
        const stageHere = STAGES.find((s) => p === `/money/${s.slug}/index.html`);
        if (stageHere)
            return { crumbs, here: `${stageHere.kicker} · ${stageHere.bn}` };
        // a lesson
        /* `?.stage` rather than an assertion: a rung the curriculum
           built without its stage is a broken rung, and the honest
           answer is the shorter trail rather than a thrown error that
           costs the reader the crumb entirely. Same at the three
           schools below. */
        const lesson = allLessons().find((l) => l.url === p);
        if (lesson?.stage) {
            crumbs.push({
                name: `${lesson.stage.kicker} · ${lesson.stage.bn}`,
                url: stageUrl(lesson.stage),
            });
            return { crumbs, here: lesson.bn ?? hereTitle() };
        }
        // an unlisted page under /money/terms/, still give it its stage
        if (p.startsWith("/money/terms/")) {
            const stage = findStage("basics-1");
            if (stage)
                crumbs.push({ name: `${stage.kicker} · ${stage.bn}`, url: stageUrl(stage) });
            return { crumbs, here: hereTitle() };
        }
        return { crumbs, here: hereTitle() };
    }
    /* ---------- the skills index ---------- */
    if (p === "/skills/index.html")
        return { crumbs, here: SKILLS() };
    /* ---------- the third-party course section ----------
  
       This file must NEVER import the catalogue. It is admin-only,
       and a browser module carrying it would publish the thing the
       whole section exists to keep private, on every page that
       loads the crumb. So the trail stops at Skills > Courses and
       the last crumb is whatever the page calls itself.
  
       The route's own title is generic, because the server renders
       nothing here. `courses.ts` calls `setHere()` below with the
       real lesson name once it has fetched it. */
    if (p.startsWith("/skills/courses/")) {
        crumbs.push({ name: SKILLS(), url: "/skills/index.html" });
        if (p === "/skills/courses/index.html")
            return { crumbs, here: COURSES() };
        crumbs.push({ name: COURSES(), url: "/skills/courses/index.html" });
        return { crumbs, here: hereTitle() };
    }
    /* ---------- the Quranic Arabic school ----------
       Same shape as the German trail below, and for the same
       reason: it sits under Skills, so a day is
       Home > Skills > কুরআনের আরবি > ধাপ ১ > the day. */
    if (p.startsWith("/quran/")) {
        crumbs.push({ name: SKILLS(), url: "/skills/index.html" });
        if (p === "/quran/index.html")
            return { crumbs, here: QURAN() };
        crumbs.push({ name: QURAN(), url: "/quran/index.html" });
        const dhapHere = DHAPS.find((d) => p === dhapUrl(d));
        if (dhapHere)
            return { crumbs, here: `${dhapHere.kicker} · ${dhapHere.bn}` };
        const dars = allDars().find((l) => l.url === p);
        if (dars?.dhap) {
            crumbs.push({
                name: `${dars.dhap.kicker} · ${dars.dhap.bn}`,
                url: dhapUrl(dars.dhap),
            });
            return { crumbs, here: dars.bn ?? hereTitle() };
        }
        return { crumbs, here: QURAN() };
    }
    /* ---------- the reading sections ----------
       The kitchen and the travel desk are not schools, but they hang
       off Skills the same way the schools do, so a piece is
       Home > Skills > রান্নাঘর > the piece. One branch covers both,
       and covers the next one without being edited. */
    const read = READS.find((section) => p.startsWith(section.mount));
    if (read) {
        crumbs.push({ name: SKILLS(), url: "/skills/index.html" });
        if (p === read.hub)
            return { crumbs, here: sectionName(read) };
        crumbs.push({ name: sectionName(read), url: read.hub });
        return { crumbs, here: pieceTitle() };
    }
    /* ---------- the English school ----------
       Same shape again: it sits under Skills, so a part is
       Home > Skills > মন থেকে ইংরেজি > টার্ম ১ > the part. */
    if (p.startsWith("/english/")) {
        crumbs.push({ name: SKILLS(), url: "/skills/index.html" });
        if (p === "/english/index.html")
            return { crumbs, here: ENGLISH() };
        crumbs.push({ name: ENGLISH(), url: "/english/index.html" });
        const termHere = TERMS.find((t) => p === termUrl(t));
        if (termHere)
            return { crumbs, here: `${termHere.kicker} · ${termHere.bn}` };
        // the practice book, which hangs off its term rather than off a part
        const bookTerm = TERMS.find((t) => englishBookUrl(t) === p);
        if (bookTerm?.workbook) {
            crumbs.push({
                name: `${bookTerm.kicker} · ${bookTerm.bn}`,
                url: termUrl(bookTerm),
            });
            return { crumbs, here: `${bn(bookTerm.workbook.days)} দিনের খাতা` };
        }
        const part = allParts().find((x) => x.url === p);
        if (part?.term) {
            crumbs.push({
                name: `${part.term.kicker} · ${part.term.bn}`,
                url: termUrl(part.term),
            });
            return { crumbs, here: part.bn ?? hereTitle() };
        }
        // anything else under /english/, still give it the school
        const term = findTerm(p.split("/")[2]);
        if (term)
            crumbs.push({ name: `${term.kicker} · ${term.bn}`, url: termUrl(term) });
        return { crumbs, here: hereTitle() };
    }
    /* ---------- the German school ----------
       German sits under Skills now, so the trail says so: a Teil is
       Home › Skills › Deutsch › Stufe 1 › the Teil. */
    if (p.startsWith("/deutsch/")) {
        crumbs.push({ name: SKILLS(), url: "/skills/index.html" });
        if (p === "/deutsch/index.html")
            return { crumbs, here: DEUTSCH() };
        crumbs.push({ name: DEUTSCH(), url: "/deutsch/index.html" });
        // a Stufe index: /deutsch/stufe-2/index.html
        const stufeHere = STUFEN.find((s) => p === `/deutsch/${s.slug}/index.html`);
        if (stufeHere)
            return { crumbs, here: `${stufeHere.kicker} · ${stufeHere.bn}` };
        // the practice book, which hangs off its Stufe rather than off a Teil
        const bookStufe = STUFEN.find((s) => workbookUrl(s) === p);
        if (bookStufe?.workbook) {
            crumbs.push({
                name: `${bookStufe.kicker} · ${bookStufe.bn}`,
                url: stufeUrl(bookStufe),
            });
            return { crumbs, here: `${bn(bookStufe.workbook.days)} দিনের খাতা` };
        }
        // a Teil
        const teil = allTeile().find((t) => t.url === p);
        if (teil?.stufe) {
            crumbs.push({
                name: `${teil.stufe.kicker} · ${teil.stufe.bn}`,
                url: stufeUrl(teil.stufe),
            });
            return { crumbs, here: teil.bn ?? hereTitle() };
        }
        // anything else under /deutsch/, still give it the school
        const slug = p.split("/")[2];
        const stufe = findStufe(slug);
        if (stufe)
            crumbs.push({ name: `${stufe.kicker} · ${stufe.bn}`, url: stufeUrl(stufe) });
        return { crumbs, here: hereTitle() };
    }
    /* ---------- the advanced tools, which have their own pages ---------- */
    if (p.startsWith("/tools/") && p !== "/tools/index.html") {
        crumbs.push({ name: isBn() ? "টুল" : "Tools", url: "/tools/index.html" });
        return { crumbs, here: hereTitle() };
    }
    /* ---------- portfolio case studies ---------- */
    if (p.startsWith("/portfolio/")) {
        crumbs.push({ name: "Portfolio", url: "/portfolio.html" });
        return { crumbs, here: hereTitle() };
    }
    /* ---------- insights ---------- */
    if (p.startsWith("/insights/")) {
        crumbs.push({ name: "Insights", url: "/insights.html" });
        return { crumbs, here: pieceTitle() };
    }
    /* ---------- everything else, from PAGES ---------- */
    const page = PAGES.find((x) => x.url === p);
    if (page)
        return { crumbs, here: stripSite(page.title) };
    return { crumbs, here: hereTitle() };
}
/* ------------------------------------------------------------
   render
   ------------------------------------------------------------ */
function render() {
    // The home page is the root, a trail with one item is noise.
    const path = normalise(location.pathname);
    if (path === "/index.html")
        return;
    const host = document.querySelector("main > .wrap") || document.querySelector("main");
    if (!host)
        return;
    if (host.querySelector(".crumbs"))
        return; // already there (a static page may ship its own)
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
    /* Named, so `setHere` rewrites this one rather than whichever
       block of structured data a page happened to ship first. */
    ld.dataset.crumbs = "";
    ld.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items,
    });
    document.head.append(ld);
}
/** Rename the last crumb, for a page whose own name arrives after
    this ran.

    The course section is the only caller and the reason is in the
    branch above: its pages are shells, so the title the server
    sent is generic and the real one comes down with the
    catalogue. Rewrites the JSON-LD copy too, or the trail a
    crawler reads would disagree with the trail on the page. */
export function setHere(name) {
    const text = String(name ?? "").trim();
    if (!text)
        return;
    const last = document.querySelector('.crumbs li[aria-current="page"]');
    if (last)
        last.textContent = text;
    const ld = document.querySelector('script[type="application/ld+json"][data-crumbs]');
    if (!ld)
        return;
    try {
        const data = JSON.parse(ld.textContent ?? "{}");
        const items = data.itemListElement ?? [];
        if (!items.length)
            return;
        items[items.length - 1].name = text;
        ld.textContent = JSON.stringify(data);
    }
    catch {
        /* A crumb is a nicety and must never take the page down. */
    }
}
export function initCrumbs() {
    try {
        render();
    }
    catch {
        /* a missing crumb must never cost anyone the page itself */
    }
}
