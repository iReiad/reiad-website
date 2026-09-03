/* ============================================================
   research.test.ts: the Research Studio's arithmetic, as
   assertions.

       node scripts/research.test.ts

   No browser and no database. The citation key, the duplicate
   hash, what the capture box decides a line is, the two parsers
   both ways, and Crossref's shape into CSL. Each is a thing a
   page renders perfectly when it is wrong: a key that changed
   under a draft, a duplicate that was let in, a BibTeX author
   split at the wrong "and".
   ============================================================ */

import {
  authorsLine, captureShape, citeKey, fieldsOf, hashOf, normaliseDoi, normaliseIsbn,
  parseAuthors, referenceLine, typeOfCsl, yearOf, SOURCE_TYPES,
} from "../shared/research.ts";
import type { CslItem } from "../shared/research.ts";
import {
  bibEntries, bibNames, detectFormat, fromBibtex, fromRis, parseAny, toBibtex, toRis, unlatex,
} from "../shared/research-bib.ts";
import { cslFromCrossref } from "../functions/_lib/scholar.ts";

let passed = 0;
const failures: string[] = [];
const ok = (what: string, cond: unknown, detail = ""): void => {
  if (cond) { passed += 1; return; }
  failures.push(detail ? `${what}\n      ${detail}` : what);
};
const eq = (what: string, got: unknown, want: unknown): void =>
  ok(what, JSON.stringify(got) === JSON.stringify(want), `got ${JSON.stringify(got)}, wanted ${JSON.stringify(want)}`);

/* ---------- the record's arithmetic ---------- */

const bashar: CslItem = {
  type: "article-journal",
  title: "Empirical Evidence of CAPM and Fama French 3 factor model at Cement Industry of DSE",
  author: [{ family: "Bashar", given: "Syeda Mahrufa" }, { family: "Islam", given: "Rafiq" }],
  issued: { "date-parts": [[2020, 3]] },
  "container-title": "Journal of Business Administration",
  volume: "41", issue: "1", page: "1-20", DOI: "10.1234/JBA.2020.001",
};

eq("the year comes out of issued", yearOf(bashar), 2020);
eq("a raw date still yields a year", yearOf({ type: "book", issued: { raw: "Spring 1998" } }), 1998);
eq("two authors are joined with an ampersand", authorsLine(bashar), "Bashar & Islam");
eq("four authors are the first et al.", authorsLine({ type: "book", author: [{ family: "A" }, { family: "B" }, { family: "C" }, { family: "D" }] }), "A et al.");
eq("the citation key is author, year, first real word", citeKey(bashar), "bashar2020empirical");
eq("a taken key gains a letter", citeKey(bashar, new Set(["bashar2020empirical"])), "bashar2020empiricala");
eq("a key with no author is anon", citeKey({ type: "report", title: "Annual report", issued: { "date-parts": [[2024]] } }), "anon2024annual");
eq("a DOI is lowercased and stripped of its trailing stop",
  normaliseDoi("See https://doi.org/10.1016/J.JBANKFIN.2020.105874."), "10.1016/j.jbankfin.2020.105874");
eq("no DOI is null", normaliseDoi("nothing here"), null);
eq("an ISBN loses its hyphens", normaliseIsbn("978-0-19-955716-4"), "9780199557164");
eq("a ten-digit ISBN with an X survives", normaliseIsbn("0-19-955716-X"), "019955716X");
eq("the hash drops stop words and case", hashOf("The Impact of Macroeconomic Variables on Stock Market Performance", 2024),
  hashOf("impact macroeconomic variables stock market performance", 2024));
ok("the hash keeps the year apart", hashOf("A paper", 2020) !== hashOf("A paper", 2021));
{
  const f = fieldsOf(bashar);
  eq("fieldsOf fills the type", f.type, "article");
  eq("fieldsOf lowercases the DOI", f.doi, "10.1234/jba.2020.001");
  eq("fieldsOf fills the authors line", f.authors, "Bashar & Islam");
  eq("an untitled record is said so", fieldsOf({ type: "book" }).title, "(untitled)");
}
eq("legal_case is a case", typeOfCsl("legal_case"), "case");
eq("an unknown CSL type is filed as a report", typeOfCsl("song-lyrics"), "report");
eq("a family-given line parses", parseAuthors("Bashar, Syeda Mahrufa; Afrin, Tasneema"),
  [{ family: "Bashar", given: "Syeda Mahrufa" }, { family: "Afrin", given: "Tasneema" }]);
eq("a given-family line parses", parseAuthors("Avijit Mallik"), [{ family: "Mallik", given: "Avijit" }]);
ok("the reference line carries the journal, the volume and the DOI",
  /Bashar, S\. M\.,.*\(2020\)\..*Journal of Business Administration, 41\(1\), 1-20\..*doi\.org\/10\.1234/.test(referenceLine(bashar)),
  referenceLine(bashar));
ok("every source type has both names and one of the seven tones",
  SOURCE_TYPES.every((t) => t.name.en && t.name.bn && ["green", "teal", "blue", "violet", "plum", "rose", "gold"].includes(t.tone)));

/* ---------- what the capture box decides ---------- */

eq("todo is a task", captureShape("todo read chapter 4"), "todo");
eq("a DOI anywhere is a DOI", captureShape("look at 10.1257/aer.20180279 later"), "doi");
eq("a link is a url", captureShape("https://www.ssrn.com/abstract=123"), "url");
eq("an ISBN alone is an isbn", captureShape("978-0-19-955716-4"), "isbn");
eq("an @ entry is BibTeX", captureShape("@article{x, title={y}}"), "bibtex");
eq("TY is RIS", captureShape("TY  - JOUR\nTI  - x\nER  - "), "ris");
eq("a sentence is a note", captureShape("What if herding is seasonal?"), "note");
eq("a number that is not an ISBN is a note", captureShape("42"), "note");

/* ---------- BibTeX ---------- */

const BIB = `@article{afrin2023herding,
  title = {Cross-Sectional Herding Behavior in {Dhaka} Stock Exchange: A Case of Behavioral Finance},
  author = {Afrin, Tasneema and M{\\"u}ller, Hans and {World Bank}},
  journal = {Journal of Business Administration},
  year = 2023,
  volume = {44},
  number = {2},
  pages = {12--34},
  doi = {10.5555/jba.2023.002},
  abstract = {We test for herding \\& find none.}
}

@phdthesis{ashfaq2020islamic,
  title={Islamic banking in Germany},
  author={Ashfaq, Muhammad},
  school={University of T{\\"u}bingen},
  year={2020}
}
@comment{ignored}
`;

{
  const entries = bibEntries(BIB);
  eq("two entries are read and the comment is skipped", entries.length, 2);
  eq("the key is kept", entries[0].key, "afrin2023herding");
  const items = fromBibtex(BIB);
  eq("an article is an article-journal", items[0].type, "article-journal");
  eq("braces are stripped from the title", items[0].title, "Cross-Sectional Herding Behavior in Dhaka Stock Exchange: A Case of Behavioral Finance");
  eq("three authors, one of them an institution",
    items[0].author, [{ family: "Afrin", given: "Tasneema" }, { family: "Müller", given: "Hans" }, { literal: "World Bank" }]);
  eq("pages get an en dash", items[0].page, "12–34");
  eq("number is the issue", items[0].issue, "2");
  eq("the escaped ampersand is an ampersand", items[0].abstract, "We test for herding & find none.");
  eq("a phdthesis is a thesis with its school as publisher", [items[1].type, items[1].publisher], ["thesis", "University of Tübingen"]);
  const back = toBibtex(items[0], "afrin2023herding");
  ok("BibTeX round-trips its type and key", back.startsWith("@article{afrin2023herding,"), back.slice(0, 40));
  ok("and its pages as two hyphens", back.includes("pages = {12--34}"), back);
  const again = fromBibtex(back)[0];
  eq("and parses back to the same authors", again.author, items[0].author);
  eq("and the same title", again.title, items[0].title);
}
eq("bibNames splits only on a bare and", bibNames("Andersen, Hans and {Sand and Sea Ltd}"), [{ family: "Andersen", given: "Hans" }, { literal: "Sand and Sea Ltd" }]);
eq("unlatex knows an umlaut in both spellings", [unlatex('{\\"o}'), unlatex('\\"{o}')], ["ö", "ö"]);
eq("unlatex leaves an unknown command's text", unlatex("\\emph{stress}"), "stress");

/* ---------- RIS ---------- */

const RIS = `TY  - JOUR
AU  - Khan, A. T. M. Jakaria
AU  - Saha, Swarup
TI  - Impact of Macroeconomic Variables on Stock Market Performance
JO  - Journal of Business Administration
PY  - 2024/06/01
VL  - 45
IS  - 1
SP  - 55
EP  - 78
DO  - 10.5555/jba.2024.001
KW  - Dhaka
KW  - ARDL
ER  -

TY  - BOOK
AU  - Hassan, M. Kabir
TI  - Islamic Finance
PB  - Edward Elgar
CY  - Cheltenham
PY  - 2019
SN  - 9781784716073
ER  - `;

{
  const items = fromRis(RIS);
  eq("two RIS records are read", items.length, 2);
  eq("JOUR is an article-journal", items[0].type, "article-journal");
  eq("the date splits into parts", items[0].issued, { "date-parts": [[2024, 6, 1]] });
  eq("SP and EP make a page range", items[0].page, "55–78");
  eq("keywords are joined", items[0].keyword, "Dhaka, ARDL");
  eq("a book's SN is its ISBN", items[1].ISBN, "9781784716073");
  eq("CY is the place", items[1]["publisher-place"], "Cheltenham");
  const back = toRis(items[0], "khan2024impact");
  ok("RIS round-trips", back.startsWith("TY  - JOUR\nID  - khan2024impact\nTI  - Impact"), back.slice(0, 60));
  eq("and parses back to the same pages", fromRis(back)[0].page, items[0].page);
}

/* ---------- any of them ---------- */

eq("BibTeX is detected", detectFormat(BIB), "bibtex");
eq("RIS is detected", detectFormat(RIS), "ris");
eq("CSL-JSON is detected", detectFormat('[{"type":"book","title":"x"}]'), "csl");
eq("prose is unknown", detectFormat("hello there"), "unknown");
eq("parseAny answers nothing for prose", parseAny("hello there").items.length, 0);
eq("parseAny reads a single CSL object", parseAny('{"type":"book","title":"x"}').items.length, 1);

/* ---------- Crossref into CSL ---------- */

{
  const csl = cslFromCrossref({
    DOI: "10.1016/J.JBANKFIN.2020.105874", type: "journal-article",
    title: ["Herding in frontier markets"], subtitle: ["Evidence from Dhaka"],
    author: [{ given: "Tasneema", family: "Afrin" }, { name: "Bangladesh Bank" }],
    issued: { "date-parts": [[2020, 11]] },
    "container-title": ["Journal of Banking & Finance"], volume: "120", page: "105874",
    ISSN: ["0378-4266"], abstract: "<jats:p>We find <jats:italic>some</jats:italic> herding.</jats:p>",
    "update-to": [{ type: "retraction", DOI: "10.1016/x", updated: { "date-time": "2021-01-01T00:00:00Z" } }],
  });
  eq("a journal-article is an article-journal", csl.type, "article-journal");
  eq("the subtitle joins the title", csl.title, "Herding in frontier markets: Evidence from Dhaka");
  eq("an organisation author is literal", csl.author?.[1], { literal: "Bangladesh Bank" });
  eq("the DOI is lowercased", csl.DOI, "10.1016/j.jbankfin.2020.105874");
  eq("JATS is stripped from the abstract", csl.abstract, "We find some herding.");
  eq("the container is the first title", csl["container-title"], "Journal of Banking & Finance");
}

/* ---------- the reading room: where a highlight is ---------- */

{
  const { anchorOf, findAnchor, ownsKey, extOfType, extOfName, fileKey, fileKind, FILE_TYPES, HIGHLIGHT_MEANINGS } =
    await import("../shared/research.ts");
  const page = "Weather shocks reduce farm income by 12 per cent\non average (Table 3). The effect is larger for\nrainfed plots. Weather shocks reduce farm income for tenants too.";
  const a = anchorOf(page, page.indexOf("larger for"), page.indexOf("larger for") + "larger for\nrainfed plots".length);
  eq("an anchor is the quote and thirty characters either side",
    [a.quote, a.prefix.length <= 30, a.suffix.length <= 30], ["larger for\nrainfed plots", true, true]);
  const back = findAnchor(page, a);
  ok("and the quote finds itself", back !== null && page.slice(back.start, back.end) === a.quote,
    JSON.stringify(back));
  const twice = findAnchor(page, { quote: "Weather shocks reduce farm income", prefix: "rainfed plots. ", suffix: " for tenants" });
  ok("a phrase a paper uses twice lands on the one that was marked, by its neighbours",
    twice !== null && twice.start === page.lastIndexOf("Weather shocks reduce farm income"), JSON.stringify(twice));
  const first = findAnchor(page, { quote: "Weather shocks reduce farm income", prefix: "", suffix: " by 12" });
  ok("and on the first when the suffix says so", first !== null && first.start === 0, JSON.stringify(first));
  const wrapped = findAnchor(page, { quote: "larger for rainfed plots", prefix: "", suffix: "" });
  ok("a selection made across a line break finds text the layer broke differently",
    wrapped !== null && page.slice(wrapped.start, wrapped.end) === "larger for\nrainfed plots", JSON.stringify(wrapped));
  eq("a quote that is not on the page is null rather than a guess", findAnchor(page, { quote: "irrigation", prefix: "", suffix: "" }), null);
  eq("an empty quote anchors nothing", findAnchor(page, { quote: "  ", prefix: "", suffix: "" }), null);

  const me = "0b3f1d4e-8a7b-4c6d-9e2f-1a2b3c4d5e6f";
  const hash = "a".repeat(64);
  const key = fileKey(me, hash, "pdf");
  eq("a file key is the reader's prefix, the hash and the extension", key, `research/${me}/${hash}.pdf`);
  ok("and the reader owns it", ownsKey(me, key));
  ok("and nobody else does", !ownsKey("1b3f1d4e-8a7b-4c6d-9e2f-1a2b3c4d5e6f", key));
  ok("a key with a path in it is not a key", !ownsKey(me, `research/${me}/../other/${hash}.pdf`));
  eq("the extension for a type the Worker accepts", [extOfType("application/pdf"), extOfType("image/jpeg; charset=binary"), extOfType("text/x-python")], ["pdf", "jpg", null]);
  eq("and for a name, where the browser sent nothing useful", [extOfName("panel.parquet"), extOfName("talk.M4A"), extOfName("notes.docx")], ["parquet", "m4a", null]);
  eq("what kind of thing each is", ["pdf", "html", "mp3", "csv", "png"].map(fileKind), ["pdf", "html", "audio", "data", "image"]);
  ok("every accepted type has an extension and the other way round", Object.keys(FILE_TYPES).every((ext) => extOfType(FILE_TYPES[ext]) === ext));
  eq("five meanings, in the order of the keys", [...HIGHLIGHT_MEANINGS], ["claim", "evidence", "method", "quote", "question"]);
}


/* ---------- finding: one list out of several ---------- */

{
  const { merge, openalexHit } = await import("../functions/_lib/scholar-search.ts");
  const mk = (from: string, title: string, doi: string | null, extra: Record<string, unknown> = {}) => ({
    csl: { type: "article-journal", title, DOI: doi ?? undefined }, doi, title, year: 2020, authors: "A", venue: "", type: "article-journal",
    abstract: "", url: null, oa: null, cited: null, from: [from], openalex: null,
    hash: title.toLowerCase().replace(/\W/g, "") + "2020", ...extra,
  });
  const merged = merge([
    [mk("openalex", "Weather shocks", "10.1/a", { cited: 40 }), mk("openalex", "Only here", null, { year: 2024 })],
    [mk("crossref", "Weather shocks", "10.1/A", { abstract: "Long." }), mk("crossref", "Cited more", "10.1/b", { cited: 400 })],
    [mk("arxiv", "Only here", null, { year: 2024 })],
  ]);
  eq("the same DOI in two cases is one row", merged.filter((h) => h.doi?.toLowerCase() === "10.1/a").length, 1);
  const ws = merged.find((h) => h.title === "Weather shocks");
  ok("which says both indexes had it", ws?.from.join(",") === "openalex,crossref", ws?.from.join(","));
  ok("and keeps the fuller record", ws?.abstract === "Long." && ws?.cited === 40);
  const only = merged.find((h) => h.title === "Only here");
  ok("a work with no DOI is merged by its hash", only?.from.length === 2, only?.from.join(","));
  eq("ranked by how many indexes had it, then by citations", merged.map((h) => h.title), ["Weather shocks", "Only here", "Cited more"]);
  const h = openalexHit({
    id: "https://openalex.org/W1", doi: "https://doi.org/10.5/x", title: "T", publication_year: 2019, type: "article",
    authorships: [{ author: { display_name: "Michael Carter" } }], cited_by_count: 7,
    open_access: { is_oa: true, oa_url: "https://x/pdf" },
    abstract_inverted_index: { The: [0], effect: [1], is: [2], large: [3] },
  });
  ok("an OpenAlex work becomes a hit with its abstract put back in order",
    h.abstract === "The effect is large" && h.openalex === "W1" && h.oa?.url === "https://x/pdf" && h.cited === 7, JSON.stringify(h));
}

/* ---------- the writing desk's arithmetic ---------- */

{
  const W = await import("../shared/research-write.ts");
  const chip = W.chipHtml({ key: "bashar2020bank", locator: "14" }, "(Bashar, 2020, p. 14)");
  eq("a chip carries its key and locator in the href", W.chipOf("#cite=bashar2020bank&loc=14"), { key: "bashar2020bank", locator: "14", label: undefined, suppress: false });
  const html = `<h2>Findings</h2><p>Provisions rose by 12% in Q2 ${chip}.</p><p>The effect is significant.</p><p>Banks lend.<sup><a class="fn-ref" href="#fn-2">2</a></sup> And borrow.<sup><a class="fn-ref" href="#fn-1">1</a></sup></p><h3>Method</h3><p>We use panel data.</p><ol class="fn"><li>First note ${W.chipHtml({ key: "rahman2021weather" }, "Rahman 2021")}</li><li>Second note</li></ol>`;
  eq("every chip in order", W.keysCited(html), ["bashar2020bank", "rahman2021weather"]);
  const outline = W.outlineOf(html);
  eq("the outline is the headings with the words under each", outline.map((h) => [h.level, h.text, h.words > 0]), [[2, "Findings", true], [3, "Method", true]]);
  eq("words in both scripts", [W.countWords("The rain in Spain"), W.countWords("আমি ভাত খাই। তুমি কি খাবে?"), W.countWords("Bank-level data, 2,400 households")], [4, 6, 5]);
  const renumbered = W.renumber(html);
  ok("footnote markers are renumbered by position and the notes follow", /href="#fn-1">1<\/a>.*href="#fn-2">2<\/a>/.test(renumbered) && /<ol class="fn"><li>Second note<\/li><li>First note/.test(renumbered), renumbered.slice(-160));
  const md = W.toMarkdown(html, "Chapter 3");
  ok("Markdown carries Pandoc citations and footnotes", md.includes("[@bashar2020bank, p. 14]") && md.includes("Banks lend.[^2]") && md.includes("[^1]: First note [@rahman2021weather]") && md.startsWith("# Chapter 3\n\n## Findings"), md);
  const tex = W.toLatex(html);
  ok("LaTeX carries \\cite with the page and a footnote", tex.includes("\\cite[p.~14]{bashar2020bank}") && tex.includes("\\footnote{Second note}") && tex.includes("\\section{Findings}") && tex.includes("12\\%"), tex);
  const claims = W.claimsOf(html);
  eq("the claims audit lists the numbers and the claim words, and whether a chip sits in the sentence",
    claims.map((c) => [c.why, c.cited]), [["number", true], ["claim", false]]);
  const over = W.overlapsOf("we estimate the effect of rainfall shocks on farm income using panel data from households and find a large fall",
    [{ name: "Rahman 2021", text: "We estimate the effect of rainfall shocks on farm income using panel data from 2,400 households across four divisions." }]);
  ok("an unquoted run of eight words shared with a source is found", over.length === 1 && over[0].words >= 12 && over[0].with === "Rahman 2021", JSON.stringify(over));
  eq("and a short coincidence is not", W.overlapsOf("panel data from households", [{ name: "x", text: "panel data from households" }]), []);
}

/* ---------- the planner: a calendar out ---------- */

{
  const { toIcs, weekStart, minutesBetween } = await import("../shared/research-plan.ts");
  const ics = toIcs([
    { id: "e-1", title: "Proposal due", starts: "2026-10-01T00:00:00Z", all_day: true, kind: "deadline", updated_at: "2026-09-02T10:00:00Z" },
    { id: "e-2", title: "Supervision; agenda: data, chapter 3", starts: "2026-09-08T09:30:00Z", ends: "2026-09-08T10:30:00Z", all_day: false, kind: "meeting", place: "Room 4.12, Lincoln" },
  ]);
  ok("a calendar file has the shape a subscriber reads", ics.startsWith("BEGIN:VCALENDAR\r\nVERSION:2.0") && ics.trimEnd().endsWith("END:VCALENDAR"), ics.slice(0, 80));
  ok("an all-day event is a DATE that ends the day after", ics.includes("DTSTART;VALUE=DATE:20261001") && ics.includes("DTEND;VALUE=DATE:20261002"), ics);
  ok("a timed one carries both instants in UTC", ics.includes("DTSTART:20260908T093000Z") && ics.includes("DTEND:20260908T103000Z"));
  ok("a semicolon in a title is escaped, as the format asks", ics.includes("SUMMARY:Supervision\; agenda: data\\, chapter 3 (meeting)"), ics);
  ok("and the kind is in the summary, the place in the location", ics.includes("(deadline)") && ics.includes("LOCATION:Room 4.12\\, Lincoln"));
  ok("no line is over 75 octets", ics.split("\r\n").every((l) => Buffer.byteLength(l) <= 75));
  eq("a week starts on Monday", weekStart(new Date(2026, 8, 2)), "2026-08-31");
  eq("and Sunday belongs to the week before it", weekStart(new Date(2026, 8, 6)), "2026-08-31");
  eq("minutes between two instants, never negative", [minutesBetween("2026-09-02T10:00:00Z", "2026-09-02T10:25:30Z"), minutesBetween("2026-09-02T10:00:00Z", "2026-09-02T09:00:00Z")], [26, 0]);
}

/* ---------- the planner: the Gantt's layout ---------- */

{
  const { ganttLayout, GANTT } = await import("../shared/research-plan.ts");
  const now = new Date("2026-09-03T12:00:00Z");
  const rows = [
    { id: "t-1", title: "Draft chapter 3", start: "2026-08-20T09:00:00Z", end: "2026-09-30", group: "Thesis", tone: "var(--blue)", kind: "task" as const },
    { id: "t-2", title: "Clean the panel", start: "2026-09-01T09:00:00Z", end: "2026-09-10", group: "", tone: "var(--blue)", kind: "task" as const },
    { id: "e-1", title: "Conference", start: "2026-11-02T00:00:00Z", end: "2026-11-04T00:00:00Z", group: "Thesis", tone: "var(--violet)", kind: "event" as const },
    { id: "e-2", title: "Backwards", start: "2026-10-05T00:00:00Z", end: "2026-10-01T00:00:00Z", group: "Aside", tone: "var(--gold)", kind: "event" as const },
  ];
  const g = ganttLayout(rows, { now, width: 1000 });
  eq("the axis runs from the first month touched to the month after the last", [g.from, g.to], ["2026-08-01", "2026-12-01"]);
  eq("one label a month", g.months.map((m) => m.month), [7, 8, 9, 10]);
  eq("named projects first in alphabetical order, the unnamed rows last", g.groups.map((x) => x.name), ["Aside", "Thesis", ""]);
  eq("and every group knows how many bars it holds", g.groups.map((x) => x.count), [1, 2, 1]);
  eq("bars inside a group are in order of start", g.bars.filter((b) => b.group === "Thesis").map((b) => b.id), ["t-1", "e-1"]);
  ok("every bar runs left to right and sits inside the box", g.bars.every((b) => b.x2 > b.x1 && b.x1 >= 0 && b.x2 <= 1000 && b.y >= GANTT.top), JSON.stringify(g.bars.map((b) => [b.id, b.x1, b.x2])));
  const dayWidth = 1000 / 122;
  ok("an end before its start is one day wide rather than a bar running backwards", (() => { const b = g.bars.find((x) => x.id === "e-2")!; return b.x2 > b.x1 && b.x2 - b.x1 <= dayWidth + 0.001; })());
  ok("the present is a line inside the box", g.nowX !== null && g.nowX > 0 && g.nowX < 1000, String(g.nowX));
  ok("a bar that began before the present starts left of the line", (() => { const b = g.bars.find((x) => x.id === "t-2")!; return b.x1 < (g.nowX ?? 0); })());
  eq("the rows stack: a heading a group and a row a bar", g.height, GANTT.top + 3 * GANTT.head + 4 * GANTT.row + 8);
  const same = ganttLayout(rows, { now, width: 1000 });
  eq("the same rows draw the same picture", same.bars.map((b) => [b.x1, b.x2, b.y]), g.bars.map((b) => [b.x1, b.x2, b.y]));
  const empty = ganttLayout([], { now });
  eq("no rows is no bars and the present month alone", [empty.bars.length, empty.groups.length, empty.months.length, empty.from], [0, 0, 1, "2026-09-01"]);
  const past = ganttLayout([rows[1]], { now: new Date("2027-03-01T00:00:00Z") });
  ok("a picture entirely in the past still has the present on it", past.nowX !== null && past.months.length === 7, `${past.nowX} ${past.months.length}`);
  eq("a row whose date cannot be read is left out rather than drawn at nought", ganttLayout([{ ...rows[0], end: "soon" }], { now }).bars.length, 0);
}

/* ---------- the atlas: a layout that is the same every time ---------- */

{
  const { layout, argumentMap, gapMatrix, timeline } = await import("../shared/research-graph.ts");
  const nodes = [{ id: "s-1", kind: "source", label: "A" }, { id: "s-2", kind: "source", label: "B" }, { id: "q-1", kind: "question", label: "Q" }, { id: "n-1", kind: "note", label: "N" }];
  const edges = [{ from: "q-1", to: "s-1" }, { from: "q-1", to: "s-2" }, { from: "n-1", to: "s-1" }];
  const a = layout(nodes, edges);
  const b = layout(nodes, edges);
  eq("the same rows draw the same picture", a.map((p) => [p.x, p.y]), b.map((p) => [p.x, p.y]));
  ok("every node is inside the box", a.every((p) => p.x >= 30 && p.x <= 970 && p.y >= 30 && p.y <= 670));
  const d = (x: string, y: string) => { const p = a.find((n) => n.id === x)!; const q = a.find((n) => n.id === y)!; return Math.hypot(p.x - q.x, p.y - q.y); };
  ok("a linked pair sits closer than an unlinked one", d("q-1", "s-1") < d("n-1", "s-2"), `${d("q-1", "s-1")} vs ${d("n-1", "s-2")}`);
  eq("no nodes, no picture", layout([], []), []);
  const cells = argumentMap([{ id: "q-1", body: { evidence: [{ source_id: "s-1", stance: "supports" }, { source_id: "s-1", stance: "method" }, { source_id: "gone", stance: "supports" }] } }], [{ id: "s-1" }, { id: "s-2" }]);
  eq("the argument map marks where a source speaks to a question, and forgets a source that is gone", cells, [{ row: "q-1", col: "s-1", marks: ["supports", "method"] }]);
  const gaps = gapMatrix([{ id: "s-1", tags: ["banks", "bd"] }, { id: "s-2", tags: ["banks"] }]);
  eq("the gap matrix is tags by sources and counts the empty cells", [gaps.tags, gaps.gaps], [["banks", "bd"], 1]);
  const tl = timeline([{ id: "s-1", year: 2019, type: "article-journal", tags: ["banks"], title: "A" }, { id: "s-2", year: 2021, type: "book", tags: [], title: "B" }, { id: "s-3", year: null, type: "book", tags: [], title: "C" }], ["banks"]);
  eq("the timeline is one dot a dated source, in the lane of its tag", [tl.years, tl.dots.map((x) => x.lane), tl.lanes], [[2019, 2021], ["banks", "other"], ["banks", "other"]]);
}

/* ---------- the review room: PRISMA out of the rows ---------- */

{
  const { prisma, duplicatesOf, appraisalScore, APPRAISALS } = await import("../shared/research-review.ts");
  const p = prisma([
    { database: "openalex", stage: "deduplicated" },
    { database: "openalex", stage: "excluded", reason: "E1" },
    { database: "crossref", stage: "excluded", reason: "E2", record: { fullText: true } },
    { database: "crossref", stage: "excluded", reason: "E2", record: { fullText: true } },
    { database: "openalex", stage: "included" },
    { database: "openalex", stage: "fulltext" },
    { database: "arxiv", stage: "title" },
  ]);
  eq("PRISMA counts what was found, by database", [p.identified, p.byDatabase], [7, { openalex: 4, crossref: 2, arxiv: 1 }]);
  eq("duplicates come off before screening", [p.duplicates, p.screened], [1, 6]);
  eq("exclusions at title are one box and at full text another, by reason", [p.excludedAtTitle, p.excludedAtFullText, p.byReason], [1, 2, { E2: 2 }]);
  eq("what reached full text is the sum of what was assessed there", [p.soughtFullText, p.included], [4, 1]);
  eq("a record still waiting is pending, not anything else", p.pending, { title: 1, fulltext: 1 });
  eq("a record found twice is one record, the later one the duplicate", duplicatesOf([
    { id: "a", doi: "10.1/X", hash: "h1", created_at: "2026-09-01" }, { id: "b", doi: "10.1/x", hash: "h2", created_at: "2026-09-02" },
    { id: "c", doi: null, hash: "h3", created_at: "2026-09-03" }, { id: "d", doi: null, hash: "h3", created_at: "2026-09-04" },
  ]), ["b", "d"]);
  eq("an appraisal's score counts yes as one and unclear as a half", appraisalScore({ "0": "yes", "1": "unclear", "2": "no" }, APPRAISALS.econ.questions), 1.5);
}

/* ---------- the review room: a second screener ---------- */

{
  const { agreement, verdictA, verdictB } = await import("../shared/research-review.ts");
  /** A's title verdict is "fulltext" (still going) for an include and
      "excluded" with no fullText flag for an exclude; B is the same
      shape one column along. */
  const rec = (a: "include" | "exclude", b: "include" | "exclude") => ({
    stage: a === "include" ? "fulltext" : "excluded",
    decision2: b === "include" ? "fulltext" : "excluded",
    record: { fullText: a === "exclude" ? false : undefined, fullText2: b === "exclude" ? false : undefined },
  });
  eq("A's title verdict on a record still going is include, and exclude once excluded there", [verdictA(rec("include", "include"), "title"), verdictA(rec("exclude", "include"), "title")], ["include", "exclude"]);
  eq("B reads the same way off decision2", [verdictB(rec("include", "exclude"), "title"), verdictB(rec("include", "include"), "title")], ["exclude", "include"]);
  eq("neither has a full text verdict while the record has not reached full text", [verdictA(rec("include", "include"), "fulltext"), verdictB(rec("include", "include"), "fulltext")], [null, null]);
  eq("an undecided record has no verdict at all", [verdictA({ stage: "found" }, "title"), verdictB({ stage: "found", decision2: null }, "title")], [null, null]);

  // A textbook 2x2 confusion matrix (Landis & Koch's own shape): 20
  // records both screeners include, 5 only A includes, 10 only B
  // includes, 15 both exclude. By hand: n = 50, agreed = 35, po =
  // 35/50 = 0.7. A includes 25/50 = 0.5 of the time, excludes the
  // other half; B includes 30/50 = 0.6, excludes 20/50 = 0.4. Chance
  // agreement pe = 0.5*0.6 + 0.5*0.4 = 0.5. kappa = (po - pe) / (1 - pe)
  // = (0.7 - 0.5) / 0.5 = 0.4.
  const sample = [
    ...Array.from({ length: 20 }, () => rec("include", "include")),
    ...Array.from({ length: 5 }, () => rec("include", "exclude")),
    ...Array.from({ length: 10 }, () => rec("exclude", "include")),
    ...Array.from({ length: 15 }, () => rec("exclude", "exclude")),
  ];
  const agr = agreement(sample, "title");
  ok(
    "Cohen's kappa on the textbook 2x2: n=50, agreed=35, kappa=0.4",
    agr.n === 50 && agr.agreed === 35 && Math.abs((agr.k ?? NaN) - 0.4) < 1e-9,
    `got n=${agr.n} agreed=${agr.agreed} k=${agr.k}`,
  );
  eq("the disagreements are exactly the off-diagonal records, 5 plus 10", agr.disagreed.length, 15);
  eq("no record decided by both is null, not a divide by zero", agreement([{ stage: "found", decision2: null }], "title"), { k: null, n: 0, agreed: 0, disagreed: [] });
  const bothAlwaysInclude = Array.from({ length: 5 }, () => rec("include", "include"));
  eq("both screeners in one category the whole time is full agreement, not 0/0", agreement(bothAlwaysInclude, "title"), { k: 1, n: 5, agreed: 5, disagreed: [] });
}

/* ---------- the review room: extraction filled from the reading ---------- */

{
  const { fillFromCards } = await import("../shared/research-review.ts");
  const filled = fillFromCards(
    { sample: "", finding: "already typed" },
    ["sample", "method", "effect size"],
    [{ n: "412", method: "RCT" }, { number: "0.34", unit: "SD" }],
  );
  eq(
    "empty cells fill from the cards, the first card to answer wins, and a number carries its unit",
    filled,
    { sample: "412", finding: "already typed", method: "RCT", "effect size": "0.34 SD" },
  );
  eq("a cell somebody typed is never written over", fillFromCards({ sample: "200 patients" }, ["sample"], [{ n: "999" }]).sample, "200 patients");
  eq("a column matching no card field, and a card with nothing for it, are both left empty", fillFromCards({}, ["country"], [{ method: "RCT" }]), {});
}

if (failures.length) {
  console.error(`research: ${failures.length} failed, ${passed} passed`);
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}
console.log(`research: ${passed} checks passed`);
