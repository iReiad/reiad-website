/* ============================================================
   art.ts: which drawing a thing wears, and in what colour.

   `shared/nav.ts` names a subject for the twenty things the rail
   lists. It cannot answer for the two hundred that are ROWS, so
   this DERIVES one out of what the row already carries: otherwise
   the newest thing on the site is always the one with no picture.

   IT IS A DECISION, NOT A RANDOM. The same piece must get the
   same drawing on the front page, on its hub, in the palette and
   after a rebuild, so the hash is a plain FNV-1a over a stable
   string and NOTHING in it may be a date, a count or a position
   in a list.

   In order: a tag or topic that NAMES a subject wins outright;
   then the DESK's own pool; then the hash, out of the six that
   suit prose.

   The colour is the section's own `MOSTLY`, which is high on
   purpose: eight colours is a fruit bowl and one colour is a
   spreadsheet. Green is the fallback and so is absent from
   `TURN`: listing it would make the variation invisible.
   ============================================================ */

/** The twelve drawings, and THE list of them.
    `next/components/card-art.tsx` holds the markup and
    `shared/nav.ts` names one per rail entry; both take the
    vocabulary from here, so a thirteenth is one edit. */
export const ART_SUBJECTS = [
  "chart", "coins", "sheets", "book", "pan", "ridge",
  "cards", "arch", "bubbles", "gauge", "calendar", "plate",
] as const;

export type ArtSubject = typeof ART_SUBJECTS[number];

/** What a word in a tag, a topic or a title means. Both
    languages, or every Bangla piece falls back. Matched as a
    substring on a lowercased haystack. */
const MEANS: Array<[ArtSubject, string[]]> = [
  ["chart", ["market", "stock", "share", "equity", "index", "trade", "price",
             "বাজার", "শেয়ার", "দাম", "সূচক"]],
  ["coins", ["money", "saving", "budget", "cost", "salary", "cash", "fund",
             "invest", "টাকা", "সঞ্চয়", "খরচ", "বিনিয়োগ", "বাজেট"]],
  ["sheets", ["model", "spreadsheet", "valuation", "dcf", "statement",
              "forecast", "case study", "মডেল", "হিসাব"]],
  ["gauge", ["ratio", "score", "check", "rating", "risk", "audit",
             "যাচাই", "ঝুঁকি"]],
  ["pan", ["recipe", "cook", "kitchen", "food", "meal",
           "রান্না", "রেসিপি", "খাবার"]],
  ["plate", ["diet", "nutrition", "calorie", "weight", "health",
             "ওজন", "পুষ্টি", "খাদ্য", "স্বাস্থ্য"]],
  ["ridge", ["travel", "trip", "route", "journey", "city", "mountain",
             "ভ্রমণ", "শহর", "পাহাড়"]],
  ["cards", ["german", "deutsch", "vocabulary", "word", "grammar", "flashcard",
             "জার্মান", "শব্দ"]],
  ["arch", ["quran", "arabic", "surah", "tajwid", "কুরআন", "আরবি", "সূরা"]],
  ["bubbles", ["english", "speaking", "conversation", "listening", "phrase",
               "ইংরেজি", "কথা"]],
  ["calendar", ["routine", "habit", "plan", "schedule", "day", "week",
                "রুটিন", "অভ্যাস", "পরিকল্পনা"]],
  ["book", ["essay", "note", "guide", "reading", "insight", "লেখা", "পড়া"]],
];

/** What a piece of writing gets when nothing else decided. Six of
    the twelve: the four school subjects are deliberately out, so
    an article about interest rates cannot wear the Quranic
    arch. */
const PROSE: ArtSubject[] = ["book", "sheets", "chart", "coins", "ridge", "gauge"];

/** WHAT A DESK'S PIECES ARE ALLOWED TO LOOK LIKE, with the desk's
    own subject repeated to weight it.

    A POOL rather than the desk's subject flat, which makes a hub
    of twenty pieces twenty copies of one drawing; and a pool
    rather than a free hash, which would put a candlestick chart
    on a recipe. Every entry is a picture that would be fine on
    that desk, and the weighting keeps the desk recognisable. */
const POOLS: Record<string, ArtSubject[]> = {
  cooking: ["pan", "pan", "pan", "plate", "pan", "book"],
  travel: ["ridge", "ridge", "ridge", "arch", "ridge", "book"],
  insights: ["book", "sheets", "chart", "coins", "gauge", "book"],
  money: ["coins", "coins", "chart", "sheets", "coins", "gauge"],
  deutsch: ["cards", "cards", "book", "cards", "bubbles", "cards"],
  english: ["bubbles", "bubbles", "cards", "bubbles", "book", "bubbles"],
  quran: ["arch", "arch", "book", "arch", "cards", "arch"],
};

/** The colours a card can turn to, as token names rather than
    values, so a theme change moves them too. Green is absent on
    purpose: it is the fallback. */
const TURN = ["teal", "blue", "violet", "plum", "rose", "gold"];

/** How often a card keeps its section's own colour, out of 100. */
const MOSTLY = 66;

/** FNV-1a, 32 bit, AND A FINALISER, which is not optional here.

    `>>> 0` after each multiply keeps it in 32 bits, or the value
    drifts out of exact-double range and the same slug hashes
    differently on different engines.

    THE THREE LINES AFTER THE LOOP ARE NOT DECORATION. FNV-1a
    avalanches badly in its LOW bits and every use here is a `% n`
    against a small n, which reads exactly those bits: without the
    xorshift-multiply finaliser, fourteen consecutive slugs pick
    index 0 or 5 out of a pool of six. */
function hash(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i += 1) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  h ^= h >>> 16; h = Math.imul(h, 0x7feb352d) >>> 0;
  h ^= h >>> 15; h = Math.imul(h, 0x846ca68b) >>> 0;
  h ^= h >>> 16;
  return h >>> 0;
}

/** A hash as a fraction of one, WHICH IS NOT THE SAME AS A
    MODULO. `h % 100` reads the low end, where a 32-bit hash is
    weakest even after a finaliser: "two in three" measured 72 per
    cent over four thousand slugs. Dividing by 2^32 reads the TOP
    bits and measures 66. */
const frac = (h: number) => h / 4294967296;

/** One of `n`, evenly. */
const pick = (h: number, n: number) => Math.floor(frac(h) * n);

/** What the site knows about a thing that wants a picture. Every
    field is optional and any subset answers, because a market
    headline and a search result have a title and nothing
    else. */
export interface ArtSource {
  /** A stable identifier: a slug, a lesson id, a URL. This is
      what the hash reads, so it must not change when the row is
      edited. A title would move the picture on a typo fix. */
  id?: string | null;
  /** The rail key of where it lives: `insights`, `cooking`,
      `money`. Decides the colour and is the second-choice
      subject. */
  section?: string | null;
  /** Anything the writer said it was about. */
  tags?: Array<string | null | undefined> | null;
  /** The headline, read only for keywords and only after the
      tags, because a title is prose and prose is noisy. */
  title?: string | null;
}

/** The subject named for a rail key, if the rail names one.
    PASSED IN rather than imported: `nav.ts` imports the type from
    here, so importing it back would be a real cycle. */
export type SubjectOfSection = (key: string) => ArtSubject | undefined;

function fromWords(haystack: string): ArtSubject | undefined {
  for (const [subject, words] of MEANS) {
    for (const word of words) if (haystack.includes(word)) return subject;
  }
  return undefined;
}

/** Which of the twelve this thing wears. */
export function subjectFor(src: ArtSource, of?: SubjectOfSection): ArtSubject {
  const tags = (src.tags ?? []).filter(Boolean).join(" ").toLowerCase();
  const said = fromWords(tags) ?? fromWords((src.title ?? "").toLowerCase());
  if (said) return said;

  /* The desk's pool where it has one, the desk's own subject
     where the rail names one and this file does not pool it, and
     prose where neither. */
  const pool = (src.section && POOLS[src.section]) || undefined;
  if (pool) return pool[pick(hash(src.id || src.title || ""), pool.length)];

  const desk = src.section && of ? of(src.section) : undefined;
  if (desk) return desk;

  return PROSE[pick(hash(src.id || src.title || ""), PROSE.length)];
}

/** Which colour, as a `var(...)` string a style attribute can
    carry. `base` is the section's own, out of `accentFor`; null
    where the rail does not list it, which is when this falls all
    the way back to the site's own green. */
export function accentTurn(src: ArtSource, base: string | null): string {
  const seed = hash(`${src.id || src.title || ""}#${src.section || ""}`);
  if (base && frac(seed) * 100 < MOSTLY) return base;
  return `var(--${TURN[pick(hash(`turn:${src.id || src.title || ""}`), TURN.length)]})`;
}

/** Both answers at once, which is what every caller wants. */
export function artFor(
  src: ArtSource, base: string | null, of?: SubjectOfSection,
): { subject: ArtSubject; accent: string } {
  return { subject: subjectFor(src, of), accent: accentTurn(src, base) };
}
