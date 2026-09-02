/* ============================================================
   research.ts: what the Research Studio's rows are made of.

   `RESEARCH.md` is the plan. This is the half of it that more
   than one runtime has to say the same way: the vocabularies a
   row may hold (which are CHECK constraints in the migration),
   the shape of a source record, and the four pieces of
   arithmetic every importer and every page needs: which columns
   a CSL record fills, what its citation key is, what its
   duplicate hash is, and how its authors are said in one line.

   ---- CSL-JSON is the record ----

   A source is stored as the Citation Style Language's JSON,
   whole, because that is what every citation processor reads,
   what Zotero exports, and what Crossref maps to in twenty
   lines. The columns beside it (`title`, `year`, `authors`,
   `doi`) are COPIES for listing and searching, filled from the
   record on every write by `fieldsOf()` below, and never edited
   on their own.

   ---- every vocabulary is written once ----

   `SOURCE_TYPES`, `NOTE_KINDS`, `TASK_LANES` and the rest are
   the constraints the migration carries, and the type of each is
   derived from the constant so a value added here is in the
   union by construction. `check-rows.ts`'s rule, one table along.
   ============================================================ */

import type { ArtSubject } from "./art.ts";

/** One phrase, twice. The studio is written in both languages
    the way the diet tool is, and every label a reader sees is one
    of these. */
export interface Word { en: string; bn: string }

/** The seven colours the rail already themes six schools with,
    by token name. A room, a source type and a project each wear
    one. Never a value: `check-accents.ts` fails on a rule naming
    a colour, and a token is what lets the same word be right in
    both themes. */
export const TONES = ["green", "teal", "blue", "violet", "plum", "rose", "gold"] as const;
export type Tone = typeof TONES[number];
export const toneVar = (tone: Tone): string => `var(--${tone})`;

/* ============================================================
   What a source is
   ============================================================ */

export interface SourceType {
  id: string;
  /** The CSL type this maps to, which is what a style file
      switches on. */
  csl: string;
  tone: Tone;
  /** The drawing its card wears, out of the twelve. */
  art: ArtSubject;
  name: Word;
}

/** Nineteen kinds of source, because a source is not always a
    paper. A case has a neutral citation, a verse has a surah and
    an ayah, a fatwa has a board and a date, and a dataset has a
    version and an access date. Each has a CSL type so a style can
    render it, and its own colour so a list reads as the kinds of
    thing it holds. */
export const SOURCE_TYPES: SourceType[] = [
  { id: "article", csl: "article-journal", tone: "green", art: "book",
    name: { en: "Journal article", bn: "জার্নাল আর্টিকেল" } },
  { id: "preprint", csl: "article", tone: "green", art: "sheets",
    name: { en: "Working paper or preprint", bn: "ওয়ার্কিং পেপার" } },
  { id: "book", csl: "book", tone: "plum", art: "book",
    name: { en: "Book", bn: "বই" } },
  { id: "chapter", csl: "chapter", tone: "plum", art: "book",
    name: { en: "Book chapter", bn: "বইয়ের অধ্যায়" } },
  { id: "thesis", csl: "thesis", tone: "violet", art: "sheets",
    name: { en: "Thesis", bn: "থিসিস" } },
  { id: "report", csl: "report", tone: "blue", art: "sheets",
    name: { en: "Report", bn: "রিপোর্ট" } },
  { id: "conference", csl: "paper-conference", tone: "green", art: "sheets",
    name: { en: "Conference paper", bn: "কনফারেন্স পেপার" } },
  { id: "case", csl: "legal_case", tone: "rose", art: "arch",
    name: { en: "Case", bn: "মামলা" } },
  { id: "statute", csl: "legislation", tone: "rose", art: "arch",
    name: { en: "Statute", bn: "আইন" } },
  { id: "standard", csl: "standard", tone: "teal", art: "sheets",
    name: { en: "Standard", bn: "স্ট্যান্ডার্ড" } },
  { id: "fatwa", csl: "document", tone: "teal", art: "arch",
    name: { en: "Fatwa or ruling", bn: "ফতোয়া" } },
  { id: "quran", csl: "book", tone: "teal", art: "arch",
    name: { en: "Qur'an", bn: "কুরআন" } },
  { id: "hadith", csl: "book", tone: "teal", art: "arch",
    name: { en: "Hadith", bn: "হাদিস" } },
  { id: "dataset", csl: "dataset", tone: "blue", art: "chart",
    name: { en: "Dataset", bn: "ডেটাসেট" } },
  { id: "web", csl: "webpage", tone: "gold", art: "bubbles",
    name: { en: "Web page", bn: "ওয়েব পেজ" } },
  { id: "interview", csl: "interview", tone: "green", art: "ridge",
    name: { en: "Interview", bn: "সাক্ষাৎকার" } },
  { id: "software", csl: "software", tone: "gold", art: "gauge",
    name: { en: "Software", bn: "সফটওয়্যার" } },
  { id: "video", csl: "motion_picture", tone: "gold", art: "bubbles",
    name: { en: "Video", bn: "ভিডিও" } },
  { id: "speech", csl: "speech", tone: "gold", art: "bubbles",
    name: { en: "Talk or lecture", bn: "বক্তৃতা" } },
  { id: "personal", csl: "personal_communication", tone: "gold", art: "cards",
    name: { en: "Personal communication", bn: "ব্যক্তিগত যোগাযোগ" } },
];

export const SOURCE_TYPE_IDS = SOURCE_TYPES.map((t) => t.id);
export type SourceTypeId = typeof SOURCE_TYPES[number]["id"];

export const sourceType = (id: string): SourceType =>
  SOURCE_TYPES.find((t) => t.id === id) ?? SOURCE_TYPES[0];

/** What a CSL type is filed as here. Two CSL types map to one
    id where the distinction is the style's rather than the
    reader's, and anything unknown is a `document`, which is what
    `fatwa` renders as and the honest answer for a shape nobody
    has named yet. */
export function typeOfCsl(csl: string | undefined): string {
  const exact = SOURCE_TYPES.find((t) => t.csl === csl && t.id !== "quran" && t.id !== "hadith");
  if (exact) return exact.id;
  switch (csl) {
    case "manuscript": return "preprint";
    case "post": case "post-weblog": return "web";
    case "entry-encyclopedia": case "entry-dictionary": return "chapter";
    case "bill": case "regulation": case "treaty": return "statute";
    case "hearing": return "case";
    case "graphic": case "figure": case "map": return "web";
    case "broadcast": return "video";
    case "song": return "speech";
    default: return "report";
  }
}

/** How far a source has been read. The queue and the meters
    read it; a citation chip moves it to `cited`. */
export const SOURCE_STATUSES = ["unread", "skimmed", "read", "annotated", "cited"] as const;
export type SourceStatus = typeof SOURCE_STATUSES[number];

/** Where a record came from. Printed on the source page as the
    provenance line, so a record typed by hand says so. */
export const SOURCE_VIAS = [
  "doi", "isbn", "url", "search", "bibtex", "ris", "csl", "zotero",
  "pdf", "manual", "review", "desk",
] as const;
export type SourceVia = typeof SOURCE_VIAS[number];

/* ============================================================
   The other vocabularies
   ============================================================ */

export const NOTE_KINDS = [
  "capture", "literature", "permanent", "daily", "meeting", "memo",
  "transcript", "prompt", "assistant",
] as const;
export type NoteKind = typeof NOTE_KINDS[number];

export const NOTE_KIND_NAMES: Record<NoteKind, Word> = {
  capture: { en: "Capture", bn: "টুকরো" },
  literature: { en: "Literature note", bn: "পড়ার নোট" },
  permanent: { en: "Permanent note", bn: "স্থায়ী নোট" },
  daily: { en: "Daily log", bn: "দৈনিক খাতা" },
  meeting: { en: "Meeting", bn: "মিটিং" },
  memo: { en: "Memo", bn: "মেমো" },
  transcript: { en: "Transcript", bn: "ট্রান্সক্রিপ্ট" },
  prompt: { en: "Prompt", bn: "প্রম্পট" },
  assistant: { en: "Assistant", bn: "সহকারী" },
};

export const TASK_LANES = ["later", "week", "today", "waiting", "done"] as const;
export type TaskLane = typeof TASK_LANES[number];

export const LANE_NAMES: Record<TaskLane, Word> = {
  later: { en: "Later", bn: "পরে" },
  week: { en: "This week", bn: "এই সপ্তাহে" },
  today: { en: "Today", bn: "আজ" },
  waiting: { en: "Waiting on", bn: "অপেক্ষায়" },
  done: { en: "Done", bn: "হয়ে গেছে" },
};

export const QUESTION_KINDS = ["question", "hypothesis", "claim", "variable"] as const;
export type QuestionKind = typeof QUESTION_KINDS[number];

export const QUESTION_KIND_NAMES: Record<QuestionKind, Word> = {
  question: { en: "Question", bn: "প্রশ্ন" },
  hypothesis: { en: "Hypothesis", bn: "অনুমান" },
  claim: { en: "Claim", bn: "দাবি" },
  variable: { en: "Variable", bn: "চলক" },
};

/** The desk's three states, carried over unchanged. */
export const QUESTION_STATES = ["open", "parked", "answered"] as const;
export type QuestionState = typeof QUESTION_STATES[number];

export const EVIDENCE_STANCES = ["supports", "contradicts", "method", "context"] as const;
export type EvidenceStance = typeof EVIDENCE_STANCES[number];

export const PROJECT_KINDS = [
  "degree", "paper", "book", "application", "review", "replication", "other",
] as const;
export type ProjectKind = typeof PROJECT_KINDS[number];

export const PROJECT_KIND_NAMES: Record<ProjectKind, Word> = {
  degree: { en: "A degree", bn: "ডিগ্রি" },
  paper: { en: "A paper", bn: "পেপার" },
  book: { en: "A book", bn: "বই" },
  application: { en: "An application", bn: "আবেদন" },
  review: { en: "A review", bn: "রিভিউ" },
  replication: { en: "A replication", bn: "রেপ্লিকেশন" },
  other: { en: "Something else", bn: "অন্য কিছু" },
};

export const PROJECT_STATES = ["active", "paused", "done", "archived"] as const;
export type ProjectState = typeof PROJECT_STATES[number];

/** Per-item state on a reading list. `not found` is the
    campaign's rule made into a value: a paper that cannot be
    found leaves the list rather than being cited from memory. */
export const LIST_ITEM_STATES = ["to-find", "saved", "not-found"] as const;
export type ListItemState = typeof LIST_ITEM_STATES[number];

/* ============================================================
   CSL-JSON, as far as this site reads it
   ============================================================ */

export interface CslName {
  family?: string;
  given?: string;
  literal?: string;
}

export interface CslDate {
  "date-parts"?: number[][];
  raw?: string;
  literal?: string;
}

/** A record. The index signature is for the fields a style may
    read and this site does not (`original-date`, `event`,
    `jurisdiction`): they are kept, never dropped, and `unknown`
    rather than `any` so a page has to look before it reads one. */
export interface CslItem {
  id?: string;
  type: string;
  title?: string;
  author?: CslName[];
  editor?: CslName[];
  issued?: CslDate;
  accessed?: CslDate;
  "container-title"?: string;
  "collection-title"?: string;
  publisher?: string;
  "publisher-place"?: string;
  volume?: string;
  issue?: string;
  page?: string;
  edition?: string;
  number?: string;
  genre?: string;
  DOI?: string;
  ISBN?: string;
  ISSN?: string;
  URL?: string;
  abstract?: string;
  language?: string;
  note?: string;
  keyword?: string;
  [field: string]: unknown;
}

/** The columns beside `csl`, filled from it. */
export interface SourceFields {
  type: string;
  title: string;
  year: number | null;
  authors: string;
  doi: string | null;
  isbn: string | null;
  url: string | null;
  abstract: string | null;
  hash: string;
}

/** The year, out of `issued`. */
export function yearOf(csl: CslItem): number | null {
  const parts = csl.issued?.["date-parts"]?.[0];
  if (parts && Number.isFinite(parts[0])) return Number(parts[0]);
  const raw = csl.issued?.raw ?? csl.issued?.literal;
  const m = raw ? /\b(1[5-9]\d\d|20\d\d)\b/.exec(raw) : null;
  return m ? Number(m[1]) : null;
}

const nameOf = (n: CslName): string =>
  n.literal ?? [n.family, n.given].filter(Boolean).join(", ") ?? "";

/** The first three names, family only, the way a list shows
    them: "Bashar, Afrin & Mallik", or "Bashar et al." past three. */
export function authorsLine(csl: CslItem): string {
  const names = (csl.author?.length ? csl.author : csl.editor) ?? [];
  const short = names.map((n) => n.family ?? n.literal ?? n.given ?? "").filter(Boolean);
  if (!short.length) return "";
  if (short.length === 1) return short[0];
  if (short.length === 2) return `${short[0]} & ${short[1]}`;
  if (short.length === 3) return `${short[0]}, ${short[1]} & ${short[2]}`;
  return `${short[0]} et al.`;
}

/** The DOI inside anything: a bare DOI, a doi.org URL, a
    `doi:` prefix, or a DOI pasted with a full stop after it. */
export function normaliseDoi(text: string | null | undefined): string | null {
  if (!text) return null;
  const m = /10\.\d{4,9}\/[^\s"'<>]+/i.exec(text);
  if (!m) return null;
  return m[0].replace(/[.,;:)\]]+$/, "").toLowerCase();
}

/** Ten or thirteen digits, with or without hyphens, an X at the
    end of a ten allowed. Returns the digits only. */
export function normaliseIsbn(text: string | null | undefined): string | null {
  if (!text) return null;
  const digits = text.replace(/[-\s]/g, "").toUpperCase();
  const m = /(?:97[89])?\d{9}[\dX]/.exec(digits);
  return m ? m[0] : null;
}

/** A title reduced to what two records of the same paper would
    share: lowercased, punctuation and stop words gone, plus the
    year. Two records with one hash are offered as a merge; two
    with one DOI are refused outright. */
export function hashOf(title: string | undefined, year: number | null): string {
  const STOP = new Set(["a", "an", "the", "of", "in", "on", "and", "or", "for", "to",
    "from", "with", "by", "at", "is", "are", "its", "vs", "versus"]);
  const words = (title ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9ঀ-৿\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w && !STOP.has(w));
  return `${words.join("-")}|${year ?? ""}`;
}

/** `authorYEARword`: the first author's family name, the year,
    and the first real word of the title, lowercased and ASCII.
    Made once when a row is created and never regenerated:
    `RESEARCH.md` section 9 says why a key that moved is a
    citation that broke. `taken` is what makes it unique, by a
    letter. */
export function citeKey(csl: CslItem, taken: Set<string> = new Set()): string {
  const ascii = (s: string): string =>
    s.normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/gi, "").toLowerCase();
  const first = csl.author?.[0] ?? csl.editor?.[0];
  const who = ascii(first?.family ?? first?.literal ?? "anon") || "anon";
  const year = yearOf(csl) ?? "nd";
  const STOP = new Set(["a", "an", "the", "of", "in", "on", "and", "or", "for", "to", "is"]);
  const word = (csl.title ?? "")
    .split(/\s+/)
    .map(ascii)
    .find((w) => w.length > 2 && !STOP.has(w)) ?? "untitled";
  const base = `${who}${year}${word}`;
  if (!taken.has(base)) return base;
  for (let i = 0; i < 26; i += 1) {
    const candidate = `${base}${String.fromCharCode(97 + i)}`;
    if (!taken.has(candidate)) return candidate;
  }
  return `${base}${Date.now().toString(36)}`;
}

/** The columns a record fills. Every writer calls this and no
    writer sets a column by hand, so the copies beside `csl`
    cannot come to disagree with it. */
export function fieldsOf(csl: CslItem): SourceFields {
  const year = yearOf(csl);
  return {
    type: typeOfCsl(csl.type),
    title: (csl.title ?? "").trim() || "(untitled)",
    year,
    authors: authorsLine(csl),
    doi: normaliseDoi(csl.DOI),
    isbn: normaliseIsbn(csl.ISBN),
    url: csl.URL?.trim() || null,
    abstract: csl.abstract?.trim() || null,
    hash: hashOf(csl.title, year),
  };
}

/** "Family, Given; Family, Given" into names, which is the one
    place a person types authors by hand. A name with no comma is
    taken as "Given Family". */
export function parseAuthors(line: string): CslName[] {
  return line.split(/;|\band\b/).map((s) => s.trim()).filter(Boolean).map((s) => {
    if (s.includes(",")) {
      const [family, given] = s.split(",").map((p) => p.trim());
      return given ? { family, given } : { family };
    }
    const parts = s.split(/\s+/);
    if (parts.length === 1) return { literal: s };
    return { family: parts[parts.length - 1], given: parts.slice(0, -1).join(" ") };
  });
}

export const authorsText = (names: CslName[] | undefined): string =>
  (names ?? []).map(nameOf).join("; ");

/** One reference line, APA-shaped, for the list and the source
    page until citeproc lands in stage 4. Deliberately plain: it
    is a readable line, not a style. */
export function referenceLine(csl: CslItem): string {
  const names = (csl.author?.length ? csl.author : csl.editor) ?? [];
  const who = names.slice(0, 6).map((n) => {
    const initials = (n.given ?? "").split(/[\s-]+/).filter(Boolean)
      .map((g) => `${g[0].toUpperCase()}.`).join(" ");
    return n.literal ?? [n.family, initials].filter(Boolean).join(", ");
  }).join(", ") + (names.length > 6 ? ", et al." : "");
  const year = yearOf(csl);
  const bits: string[] = [];
  if (who) bits.push(who);
  bits.push(`(${year ?? "n.d."}).`);
  if (csl.title) bits.push(`${csl.title}.`);
  const where: string[] = [];
  if (csl["container-title"]) where.push(csl["container-title"]);
  if (csl.volume) where.push(csl.issue ? `${csl.volume}(${csl.issue})` : csl.volume);
  if (csl.page) where.push(csl.page);
  if (where.length) bits.push(`${where.join(", ")}.`);
  else if (csl.publisher) bits.push(`${csl.publisher}.`);
  if (csl.DOI) bits.push(`https://doi.org/${csl.DOI}`);
  else if (csl.URL) bits.push(csl.URL);
  return bits.join(" ");
}

/* ============================================================
   What the board's capture box decides a line is
   ============================================================ */

export type CaptureShape = "doi" | "isbn" | "url" | "bibtex" | "ris" | "csl" | "todo" | "note";

/** By shape, before anything is saved, so the box can say what
    it decided. A line starting `todo` is a task; a DOI anywhere
    in the line is a source; an ISBN needs the word or the shape
    alone; a URL is a capture of a page; `@` opens BibTeX and
    `TY  -` opens RIS. */
export function captureShape(text: string): CaptureShape {
  const t = text.trim();
  if (/^todo\b/i.test(t)) return "todo";
  if (/^@[a-z]+\s*\{/i.test(t)) return "bibtex";
  if (/^TY\s{2}-\s/m.test(t)) return "ris";
  if (/^\s*[[{]/.test(t) && /"type"\s*:/.test(t)) return "csl";
  if (normaliseDoi(t)) return "doi";
  if (/^https?:\/\//i.test(t)) return "url";
  if (/^(isbn[:\s]*)?[\d-]{10,17}X?$/i.test(t) && normaliseIsbn(t)) return "isbn";
  return "note";
}

/* ============================================================
   The reading room (RESEARCH.md section 11)
   ============================================================ */

/** Five meanings a highlight can carry, five colours, five keys.
    The migration says the same list as a CHECK constraint and
    `scripts/check-research.ts` holds the two to each other. */
export const HIGHLIGHT_MEANINGS = ["claim", "evidence", "method", "quote", "question"] as const;
export type HighlightMeaning = typeof HIGHLIGHT_MEANINGS[number];

export const MEANING_NAMES: Record<HighlightMeaning, Word> = {
  claim: { en: "Claim", bn: "দাবি" },
  evidence: { en: "Evidence", bn: "প্রমাণ" },
  method: { en: "Method", bn: "পদ্ধতি" },
  quote: { en: "Quote", bn: "উদ্ধৃতি" },
  question: { en: "Question", bn: "প্রশ্ন" },
};

export const MEANING_TONES: Record<HighlightMeaning, Tone> = {
  claim: "gold", evidence: "green", method: "blue", quote: "violet", question: "rose",
};

/** What a file in the reading room may be, by the extension its
    R2 key ends in, and the one MIME type the Worker accepts for
    it. Short on purpose: a type not here is refused before the
    bucket is asked. */
export const FILE_TYPES: Record<string, string> = {
  pdf: "application/pdf",
  html: "text/html",
  webm: "audio/webm",
  m4a: "audio/mp4",
  mp3: "audio/mpeg",
  wav: "audio/wav",
  csv: "text/csv",
  tsv: "text/tab-separated-values",
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  parquet: "application/vnd.apache.parquet",
  json: "application/json",
  png: "image/png",
  jpg: "image/jpeg",
};

/** The extension for a MIME type the Worker was sent, or null. */
export const extOfType = (type: string): string | null => {
  const bare = type.split(";")[0].trim().toLowerCase();
  if (bare === "image/jpg") return "jpg";
  return Object.keys(FILE_TYPES).find((ext) => FILE_TYPES[ext] === bare) ?? null;
};

/** The extension a browser file has, when its MIME type is
    missing or generic, which it is for `.parquet` and often for
    `.m4a`. */
export const extOfName = (name: string): string | null => {
  const ext = name.toLowerCase().split(".").pop() ?? "";
  if (ext === "jpeg") return "jpg";
  if (ext === "htm") return "html";
  return ext in FILE_TYPES ? ext : null;
};

export type FileKind = "pdf" | "html" | "audio" | "data" | "image";

export const fileKind = (ext: string): FileKind =>
  ext === "pdf" ? "pdf"
    : ext === "html" ? "html"
      : ["webm", "m4a", "mp3", "wav"].includes(ext) ? "audio"
        : ["png", "jpg"].includes(ext) ? "image"
          : "data";

/** One file a source carries, in `research_sources.files`. `page`
    is where the reader got to, kept on the row so it follows the
    account. */
export interface SourceFile {
  key: string;
  kind: FileKind;
  ext: string;
  size: number;
  name?: string;
  pages?: number;
  page?: number;
  added?: string;
}

/** 100 MB a file, 5 GB a reader. RESEARCH.md section 23 says why
    those two numbers. */
export const FILE_CAP = 100 * 1024 * 1024;
export const FILE_QUOTA = 5 * 1024 * 1024 * 1024;

/** `research/<user id>/<sha256 of the bytes>.<ext>`: the same
    bytes uploaded twice are stored once, and a key can never point
    at different bytes. */
export const fileKey = (userId: string, hash: string, ext: string): string =>
  `research/${userId}/${hash}.${ext}`;

/** Is this key under this reader's prefix? Asked BEFORE the bucket
    is, which is the course section's second lock. */
export const ownsKey = (userId: string, key: string): boolean =>
  /^research\/[0-9a-f-]{36}\/[0-9a-f]{64}\.[a-z0-9]{2,7}$/.test(key) && key.startsWith(`research/${userId}/`);

export const fileSize = (bytes: number): string =>
  bytes < 1024 ? `${bytes} B`
    : bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(0)} KB`
      : bytes < 1024 * 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;

/* ---------- where a highlight is ----------

   A highlight is anchored to TEXT, not to pixels: the quote, and
   thirty characters either side of it, which is the W3C Web
   Annotation model's TextQuoteSelector. The rectangles beside it
   in the row are a cache for drawing; when they are missing or
   wrong (a re-OCRed file, another edition), the quote finds
   itself. `findAnchor` is that search, and it is written against
   whitespace-normalised text because a PDF's text layer breaks
   lines where the page does and a browser's selection does not. */

export interface TextAnchor { quote: string; prefix: string; suffix: string }

export const ANCHOR_CONTEXT = 30;

/** The anchor for a range of `text`. */
export function anchorOf(text: string, start: number, end: number): TextAnchor {
  return {
    quote: text.slice(start, end),
    prefix: text.slice(Math.max(0, start - ANCHOR_CONTEXT), start),
    suffix: text.slice(end, end + ANCHOR_CONTEXT),
  };
}

/** `text` with runs of whitespace as one space, and for each
    character of the result, the index it came from. */
function squash(text: string): { flat: string; at: number[] } {
  let flat = "";
  const at: number[] = [];
  let space = false;
  for (let i = 0; i < text.length; i += 1) {
    const c = text[i];
    if (/\s/.test(c)) {
      if (!space && flat.length) { flat += " "; at.push(i); }
      space = true;
    } else {
      flat += c;
      at.push(i);
      space = false;
    }
  }
  return { flat, at };
}

/** Where the anchor's quote is in `text`, as offsets into `text`,
    or null when it is not there. Every occurrence of the quote is
    scored by how much of the prefix and the suffix agree, so a
    phrase a paper uses twice lands on the one that was marked. */
export function findAnchor(text: string, a: TextAnchor): { start: number; end: number } | null {
  const quote = squash(a.quote).flat.trim();
  if (!quote) return null;
  const { flat, at } = squash(text);
  const prefix = squash(a.prefix).flat;
  const suffix = squash(a.suffix).flat;
  let best: { start: number; score: number } | null = null;
  let from = 0;
  for (;;) {
    const i = flat.indexOf(quote, from);
    if (i < 0) break;
    let score = 0;
    const before = flat.slice(Math.max(0, i - prefix.length), i);
    for (let k = 1; k <= Math.min(before.length, prefix.length); k += 1) {
      if (before[before.length - k] === prefix[prefix.length - k]) score += 1; else break;
    }
    const after = flat.slice(i + quote.length, i + quote.length + suffix.length);
    for (let k = 0; k < Math.min(after.length, suffix.length); k += 1) {
      if (after[k] === suffix[k]) score += 1; else break;
    }
    if (!best || score > best.score) best = { start: i, score };
    from = i + 1;
  }
  if (!best) return null;
  const start = at[best.start];
  const last = at[best.start + quote.length - 1];
  return { start, end: last + 1 };
}
