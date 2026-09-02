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

if (failures.length) {
  console.error(`research: ${failures.length} failed, ${passed} passed`);
  for (const f of failures) console.error(`  x ${f}`);
  process.exit(1);
}
console.log(`research: ${passed} checks passed`);
