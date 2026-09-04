/* ============================================================
   The front page is a board the reader arranges.

   THIS CATALOGUE IS DATA. A WIDGET'S DRAWING IS CODE. So a widget
   renamed here is renamed on a phone at the next fetch, and one
   taken off the list leaves the picker with nothing published.
   What a widget DRAWS is a component on each side, so both sides
   SKIP a kind they cannot draw rather than leaving a hole: a
   blank rectangle with a title on it is worse than a board with
   one fewer thing on it.

   NOTHING HERE IS INVENTED. Every kind is a reading this site
   already takes, and that is the test a new one has to pass: a
   figure that exists nowhere else is a feature wearing a widget's
   clothes.
   ============================================================ */

/** How much room a widget takes, in a phone home screen's own
    three steps. `small` is half the row and roughly square,
    `wide` is the row at a reading's height, `tall` is the row
    with room for a LIST in it. A kind draws differently at each
    size it offers, which makes this a size rather than a stretch.

    `half` AND `full` ARE STILL READ, FOR EVER. They are inside
    real accounts under `home-board`, so `parsePlaced` reads them
    as `small` and `wide` on the way in and `storedOf` never
    writes them back. Removing them breaks nothing visibly: it
    quietly empties the board of everybody who arranged one before
    the rename. */
export type WidgetSize = "small" | "wide" | "tall";

/** What has to be true before a widget has anything to say, so
    the picker can say so rather than offering one that draws
    "sign in" where a figure should be. */
export type WidgetNeeds = "account" | "school" | "network";

export interface WidgetKind {
  readonly id: string;
  /** Its name on the board and in the picker, both languages. */
  readonly bn: string;
  readonly en: string;
  /** One Bangla line: what it shows. This is what a reader reads
      in the picker before adding it, so it says what they will
      SEE rather than what it is called. */
  readonly note: string;
  /** The sizes it can be. First is what it gets when added. */
  readonly sizes: readonly WidgetSize[];
  readonly needs?: WidgetNeeds;
  /** The icon it wears, from the same set as everything else. */
  readonly icon: string;
}

/* ------------------------------------------------------------
   The catalogue, ordered as the picker shows them: what a reader
   came back for, what they are working on, what is new, and the
   places to go last.
   ------------------------------------------------------------ */

export const WIDGETS: readonly WidgetKind[] = [
  {
    id: "continue",
    bn: "যেখানে ছিলেন", en: "Where you left off",
    note: "যে পাঠটা শেষ করেননি, সেটাতে এক টোকায় ফিরে যান।",
    sizes: ["wide"], needs: "school", icon: "book",
  },
  {
    id: "progress",
    bn: "কতটা হলো", en: "How far you are",
    note: "প্রতিটা স্কুলে কত পাঠ পড়া হয়েছে, একটা করে বৃত্তে।",
    sizes: ["wide", "small", "tall"], needs: "school", icon: "gauge",
  },
  {
    id: "streak",
    bn: "যে দিনগুলো এসেছেন", en: "A year of days",
    note: "এক বছরের প্রতিটা দিন, যেদিন কিছু করেছেন সেদিন ভরাট। "
      + "কোনো আগুন নেই, কিছু লাল হয় না।",
    sizes: ["wide"], needs: "account", icon: "calendar",
  },
  {
    id: "diet",
    bn: "আজকের খাওয়া", en: "Today's log",
    note: "আজ যা লেখা হয়েছে তার যোগফল, আর যেটা ঠিক করেছেন তার পাশে।",
    sizes: ["wide", "small"], needs: "account", icon: "leaf",
  },
  {
    id: "routine",
    bn: "আজকের রুটিন", en: "Today's routine",
    note: "আজকের কাজগুলো, আর কয়টা টিক পড়েছে।",
    sizes: ["wide", "tall"], needs: "account", icon: "calendar",
  },
  {
    id: "target",
    bn: "লক্ষ্য", en: "A target",
    note: "যে লক্ষ্যটা চলছে, তার বার সহ।",
    sizes: ["wide", "small"], needs: "account", icon: "gauge",
  },
  {
    id: "library",
    bn: "পরে পড়ব", en: "Saved to read",
    note: "যেগুলো রেখে দিয়েছেন, সবচেয়ে নতুনটা আগে।",
    sizes: ["wide", "tall"], needs: "account", icon: "keep",
  },
  {
    id: "pulse",
    bn: "নতুন লেখা", en: "Latest writing",
    note: "সবচেয়ে নতুন লেখাগুলো, একটার পর একটা।",
    sizes: ["tall", "wide"], icon: "pen",
  },
  {
    id: "market",
    bn: "বাজারের খবর", en: "Market pulse",
    note: "আজকের শিরোনামগুলো, একেকটা একেকটা ঘরে।",
    sizes: ["tall", "wide"], needs: "network", icon: "spark",
  },
  {
    id: "stock",
    bn: "শেয়ার যাচাই", en: "Stock check",
    note: "একটা টিকার লিখুন, রায়টা এখানেই।",
    sizes: ["wide", "small"], icon: "gauge",
  },
  {
    id: "schools",
    bn: "যা যা শেখানো হয়", en: "The schools",
    note: "ছয়টা স্কুল, একেকটা তার নিজের রঙে।",
    sizes: ["tall", "wide"], icon: "skills",
  },
  {
    id: "tools",
    bn: "যন্ত্রপাতি", en: "The tools",
    note: "ক্যালকুলেটর, রুটিন, খাদ্য আর বাকিগুলো।",
    sizes: ["wide", "tall"], icon: "calculator",
  },
];

/** What a reader who has arranged nothing gets. Data rather than
    a constant in two renderers, because it is the first screen of
    both the app and the site.

    The door is not on it: the door is the page saying who it is,
    and a board with no heading is a settings screen. */
export const HOME_DEFAULT: readonly string[] = [
  "continue:wide",
  "progress:wide",
  "pulse:tall",
  "market:tall",
  /* Full width, both: at half a board a deck of picture tiles is
     one column six schools tall, and across the whole board it is
     four to a row and reads as a shelf. */
  "schools:tall",
  "tools:tall",
];

/** One thing on the board: which kind, and how wide. */
export interface Placed {
  readonly id: string;
  readonly size: WidgetSize;
}

const SIZES: readonly WidgetSize[] = ["small", "wide", "tall"];

/** The first two sizes, as real boards spell them. Read for
    ever, written never: see the note on `WidgetSize`. */
const SIZE_ALIASES: Record<string, WidgetSize> = { half: "small", full: "wide" };

/** `"progress:half"` as a pair, or null. One string, because
    that is what the synced key holds and a layout has to survive
    a round trip through an older build. AN UNREADABLE ENTRY IS
    DROPPED rather than being an error: a board one card short can
    be fixed, a board that will not load cannot. */
export function parsePlaced(entry: string, known: Iterable<string>): Placed | null {
  const [id, size] = entry.split(":");
  const ids = new Set(known);
  if (!ids.has(id)) return null;
  const named = SIZE_ALIASES[size]
    ?? (SIZES.includes(size as WidgetSize) ? (size as WidgetSize) : null);
  if (!named) return null;
  return { id, size: named };
}

/** A stored layout as a list of placings, with anything this
    build cannot draw left out. `drawable` is what the CALLER can
    render, which is not what the catalogue holds: the site and
    the app run different releases. */
export function layoutOf(
  stored: readonly string[] | null | undefined,
  drawable: Iterable<string>,
): Placed[] {
  const entries = stored?.length ? stored : HOME_DEFAULT;
  const seen = new Set<string>();
  const out: Placed[] = [];
  for (const entry of entries) {
    const placed = parsePlaced(entry, drawable);
    /* One of each. Two copies of the same widget is a board with
       the same number on it twice, and there is no reading here
       whose second copy says anything the first does not. */
    if (!placed || seen.has(placed.id)) continue;
    seen.add(placed.id);
    out.push(placed);
  }
  return out;
}

/** The placings back as a stored layout. */
export function storedOf(placed: readonly Placed[]): string[] {
  return placed.map((p) => `${p.id}:${p.size}`);
}

/** Everything the stored board holds that THIS build could not
    draw, put back where it was.

    `layoutOf` drops a kind it cannot render, which is right, and
    A BUILD THAT CANNOT DRAW A KIND MUST NOT DELETE IT: the site
    draws four of the twelve and the app draws more, so saving
    without this takes a phone's widgets out of the account.

    A DRAWABLE KIND MISSING FROM THE LAYOUT IS A DECISION: the
    reader could see it and took it off, so it stays off. Only
    what this build never showed them comes back, at the index it
    held, clamped. */
export function keepUndrawn(
  previous: readonly string[] | null | undefined,
  next: readonly string[],
  drawable: Iterable<string>,
): string[] {
  const out = [...next];
  if (!previous?.length) return out;
  const can = new Set(drawable);
  const idOf = (entry: string) => entry.split(":")[0];
  previous.forEach((entry, at) => {
    const id = idOf(entry);
    if (can.has(id) || out.some((e) => idOf(e) === id)) return;
    out.splice(Math.min(at, out.length), 0, entry);
  });
  return out;
}
