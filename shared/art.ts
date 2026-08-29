/* ============================================================
   art.ts: which drawing a thing wears, and in what colour.

   `shared/nav.ts` names a subject for every school, tool and desk,
   which answers the question for the ~20 things the rail lists. It
   cannot answer it for the 200 that are rows: a piece written next
   month, a lesson inside a stage, a headline off the market feed.
   Somebody would have to choose a picture for each one, which
   means the newest thing on the site is always the one without a
   picture.

   So this DERIVES one. Every input is something the row already
   carries, so a piece published a year from now arrives with a
   drawing and a colour and nobody has to remember anything. That
   is the rule at the top of CLAUDE.md, one level along: a list of
   things that exist elsewhere is built from the data, and so is
   the CARD that draws one.

   ---- it is a decision, not a random ----

   The same piece must get the same drawing on the front page, on
   its hub, in the search palette and after a rebuild, or the site
   flickers between two pictures of the same thing. So the hash is
   a plain FNV-1a over a stable string, written out here rather
   than imported, and NOTHING in it may be a date, a count, or a
   position in a list: a piece that moves down its hub keeps its
   picture.

   ---- what actually decides ----

   In order, and the order is the point:

     1. the piece SAYS what it is about. A tag or a topic that
        names a subject wins outright, because a recipe should
        get the pan whatever else is true of it.
     2. its DESK has a subject. A piece with no useful tag on the
        travel desk gets the ridge.
     3. the hash picks, out of the six that suit prose.

   ---- and the colour ----

   The section's own colour, most of the time. `MOSTLY` is how
   often, and it is high on purpose: a hub whose cards are eight
   different colours is a fruit bowl, and a hub whose cards are
   all one colour is a spreadsheet. Roughly two in three keeps the
   section legible as a colour while giving a page enough variety
   to look like a place rather than a table.

   Green is what a thing falls back to and green is the site's
   own, so it stays the colour this site is, which is the whole
   reason `TURN` does not include it: adding it to the list of
   variations would make the variation invisible half the time.
   ============================================================ */

/** The twelve drawings, and THE list of them.

    `next/components/card-art.tsx` holds the markup and
    `shared/nav.ts` names one per rail entry; both take the
    vocabulary from here rather than writing it out again. It was
    written out twice for one release, and a thirteenth subject
    would have had to be added in three places with nothing
    failing if it were added in two. */
export const ART_SUBJECTS = [
  "chart", "coins", "sheets", "book", "pan", "ridge",
  "cards", "arch", "bubbles", "gauge", "calendar", "plate",
] as const;

export type ArtSubject = typeof ART_SUBJECTS[number];

/** What a word in a tag, a topic or a title means.

    Both languages, because a Bangla piece is tagged in Bangla and
    a picture chosen off an English word only would leave every
    Bangla piece on the fallback. Matched as a substring on a
    lowercased haystack, so `বিনিয়োগ` inside a longer word still
    counts. */
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
    the twelve, and the four school subjects are deliberately not
    among them: an English article about interest rates should
    never come out wearing the Quranic arch. */
const PROSE: ArtSubject[] = ["book", "sheets", "chart", "coins", "ridge", "gauge"];

/** WHAT A DESK'S PIECES ARE ALLOWED TO LOOK LIKE, with the desk's
    own subject repeated to weight it.

    Falling straight through to the desk's subject was the first
    version and it made a hub of twenty pieces twenty copies of
    one drawing, which is worse than no drawing: a list where
    every picture is identical is a list where the pictures carry
    no information at all and cost twenty paints to say so.

    A pool rather than a free hash, because the hash on its own
    would put a candlestick chart on a recipe. Every entry in a
    pool is a picture that would be FINE on that desk, and the
    weighting is what keeps the desk recognisable: three in six
    kitchen pieces wear the pan. */
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
    values, so a theme change moves them with everything else.
    Green is absent on purpose: it is what the section falls back
    to, so listing it here would make two thirds of the variation
    invisible. */
const TURN = ["teal", "blue", "violet", "plum", "rose", "gold"];

/** How often a card keeps its section's own colour, out of 100. */
const MOSTLY = 66;

/** FNV-1a, 32 bit, AND A FINALISER, which is not optional here.

    `>>> 0` after each multiply keeps it in 32 bits: without it the
    value drifts into the range where a double stops being exact
    and the same slug hashes differently on different engines,
    which is the one thing this must never do.

    THE THREE LINES AFTER THE LOOP ARE THE BUG THIS FUNCTION WAS
    WRITTEN WITHOUT. FNV-1a avalanches badly in its LOW bits, and
    every use here is a `% n` against a small n, which reads
    exactly those bits. Fourteen consecutive slugs picked index 0
    or 5 out of a pool of six, so a hub of fourteen pieces drew
    fourteen copies of one picture and the pool looked wrong. The
    xorshift-multiply finaliser (the lowbias32 constants) spreads
    the entropy down into the bits that are actually consulted;
    without it this is a hash of the last character. */
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
    MODULO and is the second half of the same bug.

    `h % 6` and `h % 100` both read the low end of the number, and
    the low end is where a 32-bit hash is weakest even after a
    finaliser: two in three came out as the section's own colour
    where two in three was asked for, and it measured 72 per cent
    over four thousand slugs, which is thirty times the noise.
    Dividing by 2^32 reads the TOP bits, which are the strongest,
    and it measures 66. */
const frac = (h: number) => h / 4294967296;

/** One of `n`, evenly. */
const pick = (h: number, n: number) => Math.floor(frac(h) * n);

/** What the site knows about a thing that wants a picture.

    Every field is optional and the function answers with any
    subset, including none of them, because two of the callers
    (a market headline, a search result) have a title and nothing
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

    Passed in rather than imported so this file stays free of
    `nav.ts`: the rail imports the TYPE from here, and a circular
    import between the two would be a real one. */
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
