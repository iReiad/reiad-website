/* ============================================================
   The front page is a board the reader arranges.

   ---- what was wrong with it ----

   The home page was a list of places to go, and so was the app's:
   a door, then a card per school, then a card per tool. Every
   card said the same thing in the same voice, which is "here is
   a link", and none of them said anything a reader did not
   already know. A page like that is a menu, and a menu is what
   you read once.

   Everything worth putting there was already being computed
   somewhere else: how far through a school somebody is, what
   they were reading, what today's log comes to, which target is
   moving, what was published this week. It was all one page
   deeper.

   ---- the split, and it is CLAUDE.md's own ----

   **This catalogue is DATA. A widget's drawing is CODE.**

   So the list below reaches the Android app with no release: a
   widget renamed here is renamed on a phone at the next fetch,
   and one taken off the list disappears from the picker without
   anybody publishing anything. What a widget DRAWS is a
   component on each side, which is why a new entry here needs a
   release on the side that has not got its renderer yet, and why
   both sides SKIP a kind they cannot draw rather than leaving a
   hole. A blank rectangle with a title on it is worse than a
   board with one fewer thing on it.

   That is the same contract the article block classes have: the
   class is allowed in three places, and a class nothing styles
   is caught rather than shipped.

   ---- nothing here is invented ----

   Every kind is a reading this site already takes. That is
   deliberate and it is the test a new one has to pass: if the
   figure does not exist anywhere else, the widget is a feature
   wearing a widget's clothes, and it should be built as a
   feature first and put on the board second.
   ============================================================ */

/** How wide a widget runs. Two, because a phone is one column
    wide and anything finer is a grid nobody can drag on.

    `full` is the row. `half` is half of it, and two halves sit
    side by side; on a narrow phone a half still runs the full
    width, because 160dp of glass with a number in it is not
    legible and pretending otherwise is how a dashboard becomes
    decoration. */
export type WidgetSize = "half" | "full";

/** What has to be true before a widget has anything to say.

    A widget that needs an account says so, so the picker can put
    it under a line explaining that rather than offering it and
    then drawing "sign in" where a figure should be. */
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
   The catalogue.

   Ordered as the picker shows them: what a reader came back for
   first, what they are working on second, what is new third, and
   the places to go last, because a link is the least interesting
   thing a board can hold and it is what the old page was made
   entirely of.
   ------------------------------------------------------------ */

export const WIDGETS: readonly WidgetKind[] = [
  {
    id: "continue",
    bn: "যেখানে ছিলেন", en: "Where you left off",
    note: "যে পাঠটা শেষ করেননি, সেটাতে এক টোকায় ফিরে যান।",
    sizes: ["full"], needs: "school", icon: "book",
  },
  {
    id: "progress",
    bn: "কতটা হলো", en: "How far you are",
    note: "প্রতিটা স্কুলে কত পাঠ পড়া হয়েছে, একটা করে বৃত্তে।",
    sizes: ["full", "half"], needs: "school", icon: "gauge",
  },
  {
    id: "streak",
    bn: "যে দিনগুলো এসেছেন", en: "A year of days",
    note: "এক বছরের প্রতিটা দিন, যেদিন কিছু করেছেন সেদিন ভরাট। "
      + "কোনো আগুন নেই, কিছু লাল হয় না।",
    sizes: ["full"], needs: "account", icon: "calendar",
  },
  {
    id: "diet",
    bn: "আজকের খাওয়া", en: "Today's log",
    note: "আজ যা লেখা হয়েছে তার যোগফল, আর যেটা ঠিক করেছেন তার পাশে।",
    sizes: ["full", "half"], needs: "account", icon: "leaf",
  },
  {
    id: "routine",
    bn: "আজকের রুটিন", en: "Today's routine",
    note: "আজকের কাজগুলো, আর কয়টা টিক পড়েছে।",
    sizes: ["full"], needs: "account", icon: "calendar",
  },
  {
    id: "target",
    bn: "লক্ষ্য", en: "A target",
    note: "যে লক্ষ্যটা চলছে, তার বার সহ।",
    sizes: ["full", "half"], needs: "account", icon: "gauge",
  },
  {
    id: "library",
    bn: "পরে পড়ব", en: "Saved to read",
    note: "যেগুলো রেখে দিয়েছেন, সবচেয়ে নতুনটা আগে।",
    sizes: ["full"], needs: "account", icon: "keep",
  },
  {
    id: "pulse",
    bn: "নতুন লেখা", en: "Latest writing",
    note: "সবচেয়ে নতুন লেখাগুলো, একটার পর একটা।",
    sizes: ["full"], icon: "pen",
  },
  {
    id: "market",
    bn: "বাজারের খবর", en: "Market pulse",
    note: "আজকের শিরোনামগুলো, একেকটা একেকটা ঘরে।",
    sizes: ["full"], needs: "network", icon: "spark",
  },
  {
    id: "stock",
    bn: "শেয়ার যাচাই", en: "Stock check",
    note: "একটা টিকার লিখুন, রায়টা এখানেই।",
    sizes: ["full", "half"], icon: "gauge",
  },
  {
    id: "schools",
    bn: "যা যা শেখানো হয়", en: "The schools",
    note: "ছয়টা স্কুল, একেকটা তার নিজের রঙে।",
    sizes: ["full"], icon: "skills",
  },
  {
    id: "tools",
    bn: "যন্ত্রপাতি", en: "The tools",
    note: "ক্যালকুলেটর, রুটিন, খাদ্য আর বাকিগুলো।",
    sizes: ["full"], icon: "calculator",
  },
];

/** What a reader who has arranged nothing gets.

    Data rather than a constant in two renderers, for the reason
    the top of this file gives and for one more: this is the
    first screen of the app and of the site, so it is the one
    layout that is worth being able to change without waiting for
    anybody to install anything.

    The door is not on it, because the door is not a widget: it
    is the page saying who it is, and a board with no heading on
    it is a settings screen. */
export const HOME_DEFAULT: readonly string[] = [
  "continue:full",
  "progress:full",
  "pulse:full",
  "market:full",
  "schools:full",
  "tools:full",
];

/** One thing on the board: which kind, and how wide. */
export interface Placed {
  readonly id: string;
  readonly size: WidgetSize;
}

const SIZES: readonly WidgetSize[] = ["half", "full"];

/** `"progress:half"` as a pair, or null.

    Written as one string because that is what a synced key holds
    and because a layout has to survive a round trip through a
    version of this site that is older than the widget somebody
    added on their phone. An unreadable entry is DROPPED rather
    than being an error: a reader whose board came back one card
    short can add it again, and one whose board would not load at
    all has lost the page. */
export function parsePlaced(entry: string, known: Iterable<string>): Placed | null {
  const [id, size] = entry.split(":");
  const ids = new Set(known);
  if (!ids.has(id)) return null;
  const wide = SIZES.includes(size as WidgetSize) ? (size as WidgetSize) : null;
  if (!wide) return null;
  return { id, size: wide };
}

/** A stored layout as a list of placings, with anything this
    build cannot draw left out.

    `drawable` is what the CALLER can render, which is not the
    same as what the catalogue holds: the site and the app run
    different releases, and the whole reason the catalogue is
    data is that one of them will be ahead. */
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
