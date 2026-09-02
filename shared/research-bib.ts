/* ============================================================
   research-bib.ts: BibTeX and RIS, read and written.

   Every reference manager exports one of these two, and Google
   Scholar's "Cite" hands out the first. Both are read into
   CSL-JSON here and written back out of it, so an export from
   Mendeley, EndNote, Scholar or Zotero drops on the library and
   becomes rows, and the library leaves as either.

   Written rather than depended on: `citation-js` does this and
   is a megabyte with citeproc behind it, which the writing desk
   will want in stage 4 and the library does not need to import
   a file. A parser this size can be read in one sitting and its
   tests are in `scripts/research.test.ts`.

   ---- what it deliberately does not do ----

   It does not render LaTeX. A handful of accent commands are
   unescaped (`{\"o}` is ö) because they are in half of every
   economist's BibTeX, and anything else stays as typed, which a
   reader corrects on the source page. Nothing here throws: a
   malformed entry is skipped and the rest are kept, because a
   two-thousand-entry export with one broken line is two
   thousand sources, not none.
   ============================================================ */

import type { CslItem, CslName } from "./research.ts";

/* ============================================================
   BibTeX
   ============================================================ */

const BIB_TYPES: Record<string, string> = {
  article: "article-journal",
  book: "book",
  booklet: "book",
  inbook: "chapter",
  incollection: "chapter",
  inproceedings: "paper-conference",
  conference: "paper-conference",
  proceedings: "book",
  phdthesis: "thesis",
  mastersthesis: "thesis",
  techreport: "report",
  unpublished: "manuscript",
  manual: "report",
  misc: "document",
  online: "webpage",
  electronic: "webpage",
  www: "webpage",
  dataset: "dataset",
  software: "software",
  legislation: "legislation",
  jurisdiction: "legal_case",
  standard: "standard",
  thesis: "thesis",
};

const CSL_TO_BIB: Record<string, string> = {
  "article-journal": "article",
  article: "misc",
  book: "book",
  chapter: "incollection",
  "paper-conference": "inproceedings",
  thesis: "phdthesis",
  report: "techreport",
  manuscript: "unpublished",
  webpage: "misc",
  dataset: "misc",
  software: "misc",
  legislation: "misc",
  legal_case: "misc",
  standard: "misc",
  document: "misc",
};

/** The accents an economist's BibTeX actually contains. */
const ACCENTS: Record<string, Record<string, string>> = {
  '"': { a: "ä", e: "ë", i: "ï", o: "ö", u: "ü", A: "Ä", O: "Ö", U: "Ü", y: "ÿ" },
  "'": { a: "á", e: "é", i: "í", o: "ó", u: "ú", y: "ý", A: "Á", E: "É", I: "Í", O: "Ó", U: "Ú", c: "ć", n: "ń", s: "ś", z: "ź" },
  "`": { a: "à", e: "è", i: "ì", o: "ò", u: "ù", A: "À", E: "È", O: "Ò" },
  "^": { a: "â", e: "ê", i: "î", o: "ô", u: "û", A: "Â", E: "Ê", O: "Ô" },
  "~": { a: "ã", n: "ñ", o: "õ", A: "Ã", N: "Ñ", O: "Õ" },
  c: { c: "ç", C: "Ç", s: "ş", S: "Ş" },
  v: { c: "č", s: "š", z: "ž", C: "Č", S: "Š", Z: "Ž", r: "ř", e: "ě" },
  H: { o: "ő", u: "ű" },
  ".": { z: "ż", I: "İ" },
  k: { a: "ą", e: "ę" },
  u: { a: "ă", g: "ğ" },
  "=": { a: "ā", e: "ē", i: "ī", o: "ō", u: "ū" },
};

/** Strip the braces and unescape the accents. `{\"o}`, `\"{o}`
    and `\"o` are all ö; `--` is an en dash; `\&` is an ampersand;
    a lone brace pair is protection and goes. */
export function unlatex(s: string): string {
  let out = s;
  out = out.replace(/\\([\"'`^~cvHku=.])\{?\\?([A-Za-z])\}?/g, (m, acc: string, ch: string) =>
    ACCENTS[acc]?.[ch] ?? m);
  out = out.replace(/\{\\([\"'`^~cvHku=.])([A-Za-z])\}/g, (m, acc: string, ch: string) =>
    ACCENTS[acc]?.[ch] ?? m);
  out = out.replace(/\\(ss|ae|oe|AE|OE|o|O|l|L|i)\b\{?\}?/g, (m, w: string) => ({
    ss: "ß", ae: "æ", oe: "œ", AE: "Æ", OE: "Œ", o: "ø", O: "Ø", l: "ł", L: "Ł", i: "ı",
  }[w] ?? m));
  out = out.replace(/\\&/g, "&").replace(/\\%/g, "%").replace(/\\_/g, "_").replace(/\\\$/g, "$");
  out = out.replace(/\\(emph|textit|textbf|url)\{([^}]*)\}/g, "$2");
  out = out.replace(/---/g, "\u2014").replace(/--/g, "\u2013");
  out = out.replace(/[{}]/g, "");
  out = out.replace(/~/g, " ");
  return out.replace(/\s+/g, " ").trim();
}

/** "Family, Given and Given Family and {Some Org}" into names. */
export function bibNames(value: string): CslName[] {
  const parts: string[] = [];
  let depth = 0;
  let cur = "";
  const lower = value;
  for (let i = 0; i < lower.length; i += 1) {
    const ch = lower[i];
    if (ch === "{") depth += 1;
    if (ch === "}") depth -= 1;
    if (depth === 0 && /\s/.test(ch) && lower.slice(i + 1, i + 5).toLowerCase() === "and " ) {
      parts.push(cur);
      cur = "";
      i += 4;
      continue;
    }
    cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts.map((p) => p.trim()).filter(Boolean).map((p) => {
    if (/^\{.*\}$/.test(p.trim())) return { literal: unlatex(p) };
    if (p.includes(",")) {
      const [family, ...rest] = p.split(",");
      const given = rest.join(",").trim();
      return given ? { family: unlatex(family), given: unlatex(given) } : { family: unlatex(family) };
    }
    const words = unlatex(p).split(/\s+/);
    if (words.length === 1) return { family: words[0] };
    return { family: words[words.length - 1], given: words.slice(0, -1).join(" ") };
  });
}

interface BibEntry { type: string; key: string; fields: Record<string, string> }

/** Every entry in a BibTeX file, as raw fields. Braces balance
    across lines, `@comment` and `@preamble` are skipped, and
    `@string` is not expanded, which is the one thing a reader
    might notice: a month written as `jan` stays `jan`. */
export function bibEntries(text: string): BibEntry[] {
  const out: BibEntry[] = [];
  const src = text.replace(/\r\n?/g, "\n");
  let i = 0;
  while (i < src.length) {
    const at = src.indexOf("@", i);
    if (at < 0) break;
    const head = /^@([A-Za-z]+)\s*[{(]/.exec(src.slice(at));
    if (!head) { i = at + 1; continue; }
    const type = head[1].toLowerCase();
    let j = at + head[0].length;
    let depth = 1;
    let bodyStart = j;
    while (j < src.length && depth > 0) {
      const ch = src[j];
      if (ch === "{") depth += 1;
      else if (ch === "}") depth -= 1;
      else if (ch === ")" && depth === 1 && head[0].endsWith("(")) depth = 0;
      j += 1;
    }
    const body = src.slice(bodyStart, j - 1);
    i = j;
    if (["comment", "preamble", "string"].includes(type)) continue;
    const comma = body.indexOf(",");
    const key = (comma < 0 ? body : body.slice(0, comma)).trim();
    const fields: Record<string, string> = {};
    let rest = comma < 0 ? "" : body.slice(comma + 1);
    while (rest.trim()) {
      const m = /^\s*([A-Za-z_][\w-]*)\s*=\s*/.exec(rest);
      if (!m) break;
      rest = rest.slice(m[0].length);
      let value = "";
      if (rest[0] === "{") {
        let d = 0;
        let k = 0;
        for (; k < rest.length; k += 1) {
          if (rest[k] === "{") d += 1;
          else if (rest[k] === "}") { d -= 1; if (d === 0) break; }
        }
        value = rest.slice(1, k);
        rest = rest.slice(k + 1);
      } else if (rest[0] === '"') {
        let k = 1;
        while (k < rest.length && !(rest[k] === '"' && rest[k - 1] !== "\\")) k += 1;
        value = rest.slice(1, k);
        rest = rest.slice(k + 1);
      } else {
        const bare = /^[^,\n]+/.exec(rest);
        value = (bare?.[0] ?? "").trim();
        rest = rest.slice(bare?.[0].length ?? 0);
      }
      fields[m[1].toLowerCase()] = value.replace(/\s+/g, " ").trim();
      rest = rest.replace(/^\s*,/, "");
    }
    out.push({ type, key, fields });
  }
  return out;
}

const dateOf = (year?: string, month?: string): CslItem["issued"] | undefined => {
  const y = year ? /(\d{4})/.exec(year)?.[1] : undefined;
  if (!y) return year ? { raw: year } : undefined;
  const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  const mi = month ? MONTHS.indexOf(month.slice(0, 3).toLowerCase()) : -1;
  const mn = month && /^\d+$/.test(month) ? Number(month) : mi >= 0 ? mi + 1 : undefined;
  return { "date-parts": [mn ? [Number(y), mn] : [Number(y)]] };
};

/** BibTeX to CSL-JSON, one item per entry. */
export function fromBibtex(text: string): CslItem[] {
  return bibEntries(text).map(({ type, key, fields: f }) => {
    const item: CslItem = { id: key, type: BIB_TYPES[type] ?? "document" };
    if (f.title) item.title = unlatex(f.title);
    if (f.author) item.author = bibNames(f.author);
    if (f.editor) item.editor = bibNames(f.editor);
    const issued = dateOf(f.year ?? f.date, f.month);
    if (issued) item.issued = issued;
    const container = f.journal ?? f.journaltitle ?? f.booktitle;
    if (container) item["container-title"] = unlatex(container);
    if (f.series) item["collection-title"] = unlatex(f.series);
    const publisher = f.publisher ?? f.institution ?? f.school ?? f.organization ?? f.howpublished;
    if (publisher) item.publisher = unlatex(publisher);
    if (f.address) item["publisher-place"] = unlatex(f.address);
    if (f.volume) item.volume = f.volume;
    if (f.number) item.issue = f.number;
    if (f.pages) item.page = unlatex(f.pages).replace(/\s*[\u2013-]+\s*/g, "\u2013");
    if (f.edition) item.edition = f.edition;
    if (f.type) item.genre = unlatex(f.type);
    if (f.doi) item.DOI = f.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
    if (f.isbn) item.ISBN = f.isbn;
    if (f.issn) item.ISSN = f.issn;
    if (f.url) item.URL = f.url;
    if (f.abstract) item.abstract = unlatex(f.abstract);
    if (f.keywords) item.keyword = unlatex(f.keywords);
    if (f.note) item.note = unlatex(f.note);
    if (f.language) item.language = f.language;
    if (item.type === "document" && item.URL) item.type = "webpage";
    return item;
  });
}

const bibEscape = (s: string): string =>
  s.replace(/([&%$#_])/g, "\\$1").replace(/[{}]/g, "");

const bibNameOut = (n: CslName): string =>
  n.literal ? `{${bibEscape(n.literal)}}`
    : n.given ? `${bibEscape(n.family ?? "")}, ${bibEscape(n.given)}` : bibEscape(n.family ?? "");

/** CSL-JSON to BibTeX. `key` is the citation key the row holds. */
export function toBibtex(item: CslItem, key: string): string {
  const type = CSL_TO_BIB[item.type] ?? "misc";
  const f: [string, string][] = [];
  if (item.title) f.push(["title", `{${bibEscape(item.title)}}`]);
  if (item.author?.length) f.push(["author", item.author.map(bibNameOut).join(" and ")]);
  if (item.editor?.length) f.push(["editor", item.editor.map(bibNameOut).join(" and ")]);
  const parts = item.issued?.["date-parts"]?.[0];
  if (parts?.[0]) f.push(["year", String(parts[0])]);
  if (parts?.[1]) f.push(["month", String(parts[1])]);
  const container = item["container-title"];
  if (container) f.push([type === "article" ? "journal" : "booktitle", bibEscape(container)]);
  if (item["collection-title"]) f.push(["series", bibEscape(item["collection-title"])]);
  if (item.publisher) {
    const field = type === "phdthesis" ? "school" : type === "techreport" ? "institution" : "publisher";
    f.push([field, bibEscape(item.publisher)]);
  }
  if (item["publisher-place"]) f.push(["address", bibEscape(item["publisher-place"])]);
  if (item.volume) f.push(["volume", item.volume]);
  if (item.issue) f.push(["number", item.issue]);
  if (item.page) f.push(["pages", item.page.replace(/\u2013/g, "--")]);
  if (item.edition) f.push(["edition", item.edition]);
  if (item.DOI) f.push(["doi", item.DOI]);
  if (item.ISBN) f.push(["isbn", item.ISBN]);
  if (item.ISSN) f.push(["issn", item.ISSN]);
  if (item.URL) f.push(["url", item.URL]);
  if (item.abstract) f.push(["abstract", bibEscape(item.abstract)]);
  if (item.keyword) f.push(["keywords", bibEscape(item.keyword)]);
  const lines = f.map(([k, v]) => `  ${k} = {${v}},`);
  return `@${type}{${key},\n${lines.join("\n")}\n}`;
}

/* ============================================================
   RIS
   ============================================================ */

const RIS_TYPES: Record<string, string> = {
  JOUR: "article-journal", EJOUR: "article-journal", MGZN: "article-magazine",
  NEWS: "article-newspaper", BOOK: "book", EBOOK: "book", EDBOOK: "book",
  CHAP: "chapter", ECHAP: "chapter", CONF: "paper-conference", CPAPER: "paper-conference",
  THES: "thesis", RPRT: "report", UNPB: "manuscript", MANSCPT: "manuscript",
  ELEC: "webpage", WEB: "webpage", BLOG: "post-weblog", GEN: "document",
  DATA: "dataset", COMP: "software", CASE: "legal_case", STAT: "legislation",
  STAND: "standard", VIDEO: "motion_picture", INPR: "article-journal",
};

/* The FIRST RIS tag that maps to a CSL type is the one written
   back: JOUR before INPR, BOOK before EBOOK. Built with a
   first-wins loop, because `Object.fromEntries` keeps the LAST
   and wrote every article out as INPR for one test run. */
const CSL_TO_RIS: Record<string, string> = {};
for (const [ris, csl] of Object.entries(RIS_TYPES)) {
  if (!(csl in CSL_TO_RIS)) CSL_TO_RIS[csl] = ris;
}

const risName = (s: string): CslName => {
  const t = s.trim();
  if (t.includes(",")) {
    const [family, given] = t.split(",").map((p) => p.trim());
    return given ? { family, given } : { family };
  }
  const words = t.split(/\s+/);
  return words.length > 1 ? { family: words[words.length - 1], given: words.slice(0, -1).join(" ") } : { literal: t };
};

/** RIS to CSL-JSON, one item per `ER`. */
export function fromRis(text: string): CslItem[] {
  const out: CslItem[] = [];
  let cur: Record<string, string[]> | null = null;
  for (const raw of text.replace(/\r\n?/g, "\n").split("\n")) {
    const m = /^([A-Z][A-Z0-9])\s{2}-\s?(.*)$/.exec(raw);
    if (!m) continue;
    const [, tag, value] = m;
    if (tag === "TY") { cur = { TY: [value.trim()] }; continue; }
    if (!cur) continue;
    if (tag === "ER") {
      out.push(risItem(cur));
      cur = null;
      continue;
    }
    (cur[tag] ??= []).push(value.trim());
  }
  if (cur) out.push(risItem(cur));
  return out;
}

function risItem(f: Record<string, string[]>): CslItem {
  const one = (...tags: string[]): string | undefined => {
    for (const t of tags) if (f[t]?.[0]) return f[t][0];
    return undefined;
  };
  const item: CslItem = { type: RIS_TYPES[f.TY?.[0] ?? "GEN"] ?? "document" };
  const title = one("TI", "T1");
  if (title) item.title = title;
  const authors = [...(f.AU ?? []), ...(f.A1 ?? [])];
  if (authors.length) item.author = authors.map(risName);
  const editors = [...(f.ED ?? []), ...(f.A2 ?? [])];
  if (editors.length && item.type !== "article-journal") item.editor = editors.map(risName);
  const date = one("PY", "Y1", "DA");
  if (date) {
    const [y, mo, d] = date.split("/").map((p) => Number(p)).filter((n) => Number.isFinite(n) && n > 0);
    item.issued = y ? { "date-parts": [[y, mo, d].filter(Boolean) as number[]] } : { raw: date };
  }
  const container = one("T2", "JO", "JF", "JA", "BT");
  if (container) item["container-title"] = container;
  if (one("T3")) item["collection-title"] = one("T3");
  if (one("PB")) item.publisher = one("PB");
  if (one("CY")) item["publisher-place"] = one("CY");
  if (one("VL")) item.volume = one("VL");
  if (one("IS")) item.issue = one("IS");
  const sp = one("SP");
  const ep = one("EP");
  if (sp) item.page = ep && ep !== sp ? `${sp}\u2013${ep}` : sp;
  if (one("ET")) item.edition = one("ET");
  if (one("DO")) item.DOI = one("DO");
  if (one("SN")) {
    const sn = one("SN") as string;
    if (item.type === "book" || item.type === "chapter") item.ISBN = sn; else item.ISSN = sn;
  }
  if (one("UR")) item.URL = one("UR");
  if (one("AB", "N2")) item.abstract = one("AB", "N2");
  if (f.KW?.length) item.keyword = f.KW.join(", ");
  if (one("N1")) item.note = one("N1");
  if (one("LA")) item.language = one("LA");
  if (one("ID")) item.id = one("ID");
  return item;
}

/** CSL-JSON to RIS. */
export function toRis(item: CslItem, key?: string): string {
  const lines: string[] = [`TY  - ${CSL_TO_RIS[item.type] ?? "GEN"}`];
  const add = (tag: string, v?: string): void => { if (v) lines.push(`${tag}  - ${v}`); };
  if (key) add("ID", key);
  add("TI", item.title);
  for (const n of item.author ?? []) add("AU", n.literal ?? [n.family, n.given].filter(Boolean).join(", "));
  for (const n of item.editor ?? []) add("ED", n.literal ?? [n.family, n.given].filter(Boolean).join(", "));
  const parts = item.issued?.["date-parts"]?.[0];
  if (parts?.[0]) add("PY", `${parts[0]}${parts[1] ? `/${String(parts[1]).padStart(2, "0")}` : ""}${parts[2] ? `/${String(parts[2]).padStart(2, "0")}` : ""}`);
  add("T2", item["container-title"]);
  add("T3", item["collection-title"]);
  add("PB", item.publisher);
  add("CY", item["publisher-place"]);
  add("VL", item.volume);
  add("IS", item.issue);
  if (item.page) {
    const [sp, ep] = item.page.split(/\u2013|-/);
    add("SP", sp?.trim());
    add("EP", ep?.trim());
  }
  add("ET", item.edition);
  add("DO", item.DOI);
  add("SN", item.ISBN ?? item.ISSN);
  add("UR", item.URL);
  add("AB", item.abstract);
  for (const kw of (item.keyword ?? "").split(",").map((s) => s.trim()).filter(Boolean)) add("KW", kw);
  add("N1", item.note);
  add("LA", item.language);
  lines.push("ER  - ");
  return lines.join("\n");
}

/* ============================================================
   Any of them
   ============================================================ */

/** What a pasted or dropped text is. */
export function detectFormat(text: string): "bibtex" | "ris" | "csl" | "unknown" {
  const t = text.trim();
  if (/^@[A-Za-z]+\s*[{(]/m.test(t)) return "bibtex";
  if (/^TY\s{2}-\s/m.test(t)) return "ris";
  if (/^[[{]/.test(t)) {
    try {
      const parsed = JSON.parse(t) as unknown;
      const list = Array.isArray(parsed) ? parsed : [parsed];
      if (list.every((x) => x && typeof x === "object" && "type" in (x as object))) return "csl";
    } catch { /* fall through */ }
  }
  return "unknown";
}

/** Whatever it is, as CSL items. An unknown text gives none,
    which the page reports rather than guessing. */
export function parseAny(text: string): { format: string; items: CslItem[] } {
  const format = detectFormat(text);
  if (format === "bibtex") return { format, items: fromBibtex(text) };
  if (format === "ris") return { format, items: fromRis(text) };
  if (format === "csl") {
    const parsed = JSON.parse(text.trim()) as CslItem | CslItem[];
    return { format, items: Array.isArray(parsed) ? parsed : [parsed] };
  }
  return { format, items: [] };
}
