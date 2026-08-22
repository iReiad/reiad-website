/* ============================================================
   foods.ts: the portion library, for two kitchens.

   `DIET.md` §22 is the plan: no food database, a short list per
   place of what people actually eat, carrying the nutrients §15
   names where they are known and a price from §17. This file is
   that list. Nothing here renders and nothing here computes a
   day: it is the rows, and the four ways of reaching them.

   ---- the rule under all of it ----

   A GRAIN, A DAL OR A PASTA STATES ITS STATE, IN THE NAME, IN
   BOTH LANGUAGES.

   Rice roughly triples in weight when cooked, so 100 g of rice
   is either 130 kcal or 350 depending on which 100 g somebody
   meant, and `DIET.md` §14 calls that the most common single
   error in the whole of calorie counting. `raw` is the flag the
   arithmetic reads; the NAME is what the reader reads, and a row
   in scope carries both.

   IN SCOPE IS ANYTHING BOUGHT DRY AND COOKED IN WATER: rice,
   parboiled rice, both dals, pasta, oats, chickpeas, and the
   dishes made of them. `raw: false` is written out on the cooked
   side rather than left off, because a missing flag on a row
   whose dry form is also a row is the bug and not the default.

   A slice of bread, a roti and a restaurant plate carry no flag
   at all, and that is the rule holding rather than an omission:
   nobody weighs any of the three dry, so there is no second
   number for a reader to confuse the first with.

   ---- both languages, on every row ----

   `en` and `bn` are one row said twice. A Bangla reader should
   never have to read English to find out that something exists
   in their own language, and a food list is the most literal
   case of that rule the site has. A `bn` that only spells its
   `en` out in Bangla letters is not finished: use the everyday
   word where there is one, and a short gloss where there is
   not.

   ---- an id is a stored key ----

   `id` goes into a reader's log the moment they tap the row, so
   RENAMING ONE LOSES WHAT THEY LOGGED. Kebab-case, unique, and
   added rather than corrected, which is the rule the storage
   keys at the top of `CLAUDE.md` already follow. `byId` indexes
   them once, so a duplicate id would not fail: it would quietly
   shadow the row above it.

   ---- a price is a fact with a date on it ----

   `price`, `currency` and `pricedOn` are three parts of one
   fact: all three, or none of them. Every figure is a REFERENCE
   FIGURE for arithmetic, checked in August 2026, a Dhaka retail
   price in BDT or a UK supermarket own-brand price in GBP. They
   quote nobody and name no shop, and §17 is why: the moment
   this tool says where to buy something it stops being a
   calculator and starts being an advertisement.

   A row in both places therefore carries NO price, because one
   number cannot be two currencies. Where a food matters to
   §17's cost per gram of protein in both countries, it is two
   rows and each carries its own.

   ---- omit rather than guess ----

   An optional nutrient is ABSENT where the figure is not known
   for that dish, and absent is exactly what §15's coverage
   arithmetic counts. A zero reads as "none of it" and is worse
   than silence, because a confident number missing a third of
   the day is the one thing that section refuses to print.
   ============================================================ */

/** Where the reader eats, which decides the library, the
    currency and the search's ranking.

    Imported rather than declared again: `diet.ts` already says
    this, and two files spelling one vocabulary is how a place
    gets added to one of them. */
import type { Place } from "./diet.ts";
export type { Place };

/** What a row is for, as a search aid rather than a taxonomy.

    A union rather than `string[]` so a typo is a compile error:
    a tag nothing matches is a row a reader cannot find, and it
    looks exactly like a row that is simply not there. Some rows
    carry none, which is honest: a teaspoon of sugar is not a
    snack, a staple or a drink. */
export type Tag =
  | "staple" | "protein" | "veg" | "fruit" | "drink" | "snack" | "oil";

/** One thing a reader can tap, at the size they actually eat it.

    Energy is kcal, every macro is grams, and every micronutrient
    is milligrams EXCEPT `vitd`, `b12` and `folate`, which are
    micrograms, because that is how each of those three is
    labelled and stated everywhere a reader will meet it. */
export interface Portion {
  /** Stable, kebab-case, never renamed. */
  id: string;
  en: string;
  bn: string;
  /** Both, where the row is genuinely the same object in both
      kitchens. Such a row carries no price. */
  place: Place[];
  qty: number;
  unit: string;
  /** What the portion weighs, where that is a knowable thing.
      Absent on a pint and on a restaurant plate. */
  grams?: number;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fibre: number;
  /** The §15 list, in mg except the three noted above. Omitted
      rather than guessed: see the header. */
  sodium?: number;
  potassium?: number;
  calcium?: number;
  iron?: number;
  vitc?: number;
  vitd?: number;
  b12?: number;
  zinc?: number;
  folate?: number;
  /** Grams, and the reason it is here rather than in the macros
      is §15: keto raises it for most people who try it, and the
      tool tracks it as a share of total fat where the library
      knows it. */
  satfat?: number;
  /** Per portion, in `currency`, checked in `pricedOn`. All
      three or none. */
  price?: number;
  currency?: "BDT" | "GBP";
  /** The month the price was checked, `YYYY-MM`. Out of date by
      more than a few months and §17 shows the figure greyed with
      its date rather than silently. */
  pricedOn?: string;
  /** Where the composition figure came from. Every row has one:
      a number with no source is a number this tool invented. */
  source: string;
  tags?: Tag[];
  /** True where the figure is for the RAW food and false where
      it is for the cooked form of something bought dry. Absent
      where the question cannot arise, which is most rows: see
      the top of this file. */
  raw?: boolean;
}

const USDA = "USDA FoodData Central, SR Legacy";
const INFS = "Food Composition Table for Bangladesh, INFS Dhaka, 2013";
const MW = "McCance and Widdowson, 7th summary edition";
const LABEL_UK = "UK supermarket own-brand label, per 100 g";
/** A cooked dish is composition plus what went in the pan, and
    the oil is the part nobody measures: `DIET.md` §14 opens on
    it. Where a row says this, the oil is IN the figure. */
const HOME = "INFS Bangladesh FCT 2013, cooked with the oil counted in";

const BDT = "BDT" as const;
const GBP = "GBP" as const;
/** One month for the whole file, because a library priced half
    in one month and half in another is a library whose prices
    cannot be compared with each other. */
const ON = "2026-08";

/* ------------------------------------------------------------
   In both kitchens, and therefore unpriced
   ------------------------------------------------------------ */

const BOTH: Portion[] = [
  {
    id: "rice-white-cooked-cup",
    en: "cooked white rice, 1 cup",
    bn: "ভাত (রান্না করা), ১ কাপ",
    place: ["bd", "uk"], qty: 1, unit: "cup", grams: 158,
    kcal: 205, protein: 4.3, carbs: 44.5, fat: 0.4, fibre: 0.6,
    sodium: 2, potassium: 55, iron: 1.9, zinc: 0.8, folate: 92,
    source: USDA, tags: ["staple"], raw: false,
  },
  {
    id: "rice-white-raw-100g",
    en: "raw white rice, 100 g (dry, before cooking)",
    bn: "চাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd", "uk"], qty: 100, unit: "g", grams: 100,
    kcal: 365, protein: 7.1, carbs: 80.0, fat: 0.7, fibre: 1.3,
    sodium: 5, potassium: 115, iron: 4.3, zinc: 1.1, folate: 231,
    source: USDA, tags: ["staple"], raw: true,
  },
  {
    id: "dal-masoor-raw-100g",
    en: "raw masoor dal (red lentils), 100 g (dry)",
    bn: "মসুর ডাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd", "uk"], qty: 100, unit: "g", grams: 100,
    kcal: 352, protein: 24.6, carbs: 63.0, fat: 1.1, fibre: 10.7,
    sodium: 6, potassium: 677, calcium: 35, iron: 6.5, zinc: 3.3, folate: 479,
    source: USDA, tags: ["protein", "staple"], raw: true,
  },
  {
    id: "chickpeas-cooked-cup",
    en: "cooked chickpeas (chola), 1 cup",
    bn: "ছোলা (সিদ্ধ করা), ১ কাপ",
    place: ["bd", "uk"], qty: 1, unit: "cup", grams: 164,
    kcal: 269, protein: 14.5, carbs: 45.0, fat: 4.2, fibre: 12.5,
    sodium: 11, potassium: 477, calcium: 80, iron: 4.7, zinc: 2.5, folate: 282,
    source: USDA, tags: ["protein"], raw: false,
  },
  {
    id: "potato-boiled-medium",
    en: "boiled potato, 1 medium",
    bn: "আলু সিদ্ধ, ১টা মাঝারি",
    place: ["bd", "uk"], qty: 1, unit: "piece", grams: 150,
    kcal: 130, protein: 2.8, carbs: 30.0, fat: 0.2, fibre: 2.7,
    sodium: 8, potassium: 500, iron: 0.5, vitc: 11, folate: 15,
    source: USDA, tags: ["staple", "veg"],
  },
  {
    id: "yoghurt-plain-cup",
    en: "plain yoghurt (tok doi), 1 cup",
    bn: "টক দই, ১ কাপ",
    place: ["bd", "uk"], qty: 1, unit: "cup", grams: 200,
    kcal: 122, protein: 7.0, carbs: 9.4, fat: 6.5, fibre: 0,
    sodium: 92, potassium: 310, calcium: 240, b12: 0.75, zinc: 1.2,
    satfat: 4.2,
    source: USDA, tags: ["protein", "drink"],
  },
  {
    id: "tea-black-sugar",
    en: "black tea with 2 teaspoons of sugar, 1 cup",
    bn: "চিনি দেওয়া রং চা, ১ কাপ",
    place: ["bd", "uk"], qty: 1, unit: "cup", grams: 240,
    kcal: 34, protein: 0, carbs: 8.4, fat: 0, fibre: 0,
    sodium: 5, potassium: 88,
    source: `${USDA}, tea plus the sugar counted in`, tags: ["drink"],
  },
  {
    id: "sugar-tsp",
    en: "sugar, 1 teaspoon",
    bn: "চিনি, ১ চা চামচ",
    place: ["bd", "uk"], qty: 1, unit: "teaspoon", grams: 4,
    kcal: 16, protein: 0, carbs: 4.2, fat: 0, fibre: 0,
    source: USDA,
  },
  {
    id: "salt-iodised-tsp",
    en: "iodised salt, 1 teaspoon",
    bn: "আয়োডিনযুক্ত লবণ, ১ চা চামচ",
    place: ["bd", "uk"], qty: 1, unit: "teaspoon", grams: 6,
    kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0,
    sodium: 2325,
    /* Here for the sodium, and for the line in §15 that a low
       sodium push can quietly take Bangladesh's main source of
       iodine with it. */
    source: USDA,
  },
];

/* ------------------------------------------------------------
   Bangladesh: rice, and the things eaten with it
   ------------------------------------------------------------ */

const BD: Portion[] = [
  {
    id: "rice-parboiled-cooked-cup",
    en: "cooked parboiled rice (siddho chal), 1 cup",
    bn: "সিদ্ধ চালের ভাত (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 155,
    kcal: 194, protein: 4.5, carbs: 41.0, fat: 0.5, fibre: 1.4,
    sodium: 2, potassium: 84, iron: 1.5, zinc: 0.9, folate: 60,
    price: 11, currency: BDT, pricedOn: ON,
    /* Most of what is actually eaten in Bangladesh. Lower
       glycaemic response than polished white rice and much the
       same energy, which is `DIET.md` §14: relevant to somebody
       managing blood sugar, irrelevant to the calorie total. */
    source: INFS, tags: ["staple"], raw: false,
  },
  {
    id: "rice-parboiled-raw-100g",
    en: "raw parboiled rice (siddho chal), 100 g (dry)",
    bn: "সিদ্ধ চাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd"], qty: 100, unit: "g", grams: 100,
    kcal: 370, protein: 7.5, carbs: 81.0, fat: 1.0, fibre: 1.8,
    sodium: 4, potassium: 155, iron: 3.4, zinc: 1.2, folate: 110,
    price: 7, currency: BDT, pricedOn: ON,
    source: INFS, tags: ["staple"], raw: true,
  },
  {
    id: "panta-bhat-cup",
    en: "panta bhat (cooked rice soaked in water overnight), 1 cup",
    bn: "পান্তা ভাত (রান্না করা ভাত সারা রাত পানিতে ভেজানো), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 200,
    kcal: 195, protein: 4.2, carbs: 42.0, fat: 0.4, fibre: 0.8,
    sodium: 3, potassium: 70, iron: 2.2, zinc: 0.9,
    price: 10, currency: BDT, pricedOn: ON,
    /* Rice cooled and left overnight forms resistant starch,
       which lowers available energy SLIGHTLY. `DIET.md` §14 says
       the second half of that sentence as loudly as the first,
       so the figure here is the cooked rice's and not a
       discount. */
    source: INFS, tags: ["staple"], raw: false,
  },
  {
    id: "khichuri-plate",
    en: "khichuri (cooked), 1 plate",
    bn: "খিচুড়ি (রান্না করা), ১ প্লেট",
    place: ["bd"], qty: 1, unit: "plate", grams: 300,
    kcal: 430, protein: 13.0, carbs: 62.0, fat: 14.0, fibre: 5.5,
    sodium: 620, potassium: 420, iron: 3.6, zinc: 1.8, folate: 130,
    satfat: 3.0,
    price: 60, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["staple", "protein"], raw: false,
  },
  {
    id: "roti-atta",
    en: "roti (atta, made), 1 piece",
    bn: "রুটি (আটার, বানানো), ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 50,
    kcal: 124, protein: 3.7, carbs: 22.0, fat: 1.9, fibre: 3.1,
    sodium: 90, potassium: 110, iron: 1.4, zinc: 0.7, folate: 14,
    price: 8, currency: BDT, pricedOn: ON,
    source: INFS, tags: ["staple"],
  },
  {
    id: "paratha",
    en: "paratha (fried), 1 piece",
    bn: "পরোটা (তেলে ভাজা), ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 60,
    kcal: 226, protein: 4.1, carbs: 27.0, fat: 11.5, fibre: 2.6,
    sodium: 160, potassium: 105, iron: 1.5, zinc: 0.7,
    satfat: 3.5,
    price: 15, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["staple"],
  },
  {
    id: "luchi",
    en: "luchi (deep fried), 1 piece",
    bn: "লুচি (ডুবো তেলে ভাজা), ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 30,
    kcal: 138, protein: 2.2, carbs: 15.0, fat: 7.5, fibre: 0.6,
    sodium: 105, satfat: 2.3,
    price: 10, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["staple"],
  },
  {
    id: "polao-cup",
    en: "polao (cooked), 1 cup",
    bn: "পোলাও (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 180,
    kcal: 310, protein: 6.0, carbs: 46.0, fat: 11.0, fibre: 1.2,
    sodium: 480, potassium: 90, iron: 1.6, satfat: 4.5,
    price: 45, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["staple"], raw: false,
  },
  {
    id: "biryani-plate",
    en: "kacchi biryani, 1 restaurant plate",
    bn: "কাচ্চি বিরিয়ানি, ১ প্লেট (রেস্টুরেন্টের)",
    place: ["bd"], qty: 1, unit: "plate",
    kcal: 900, protein: 33.0, carbs: 96.0, fat: 42.0, fibre: 3.0,
    sodium: 1500, potassium: 520, iron: 3.8, zinc: 4.0, b12: 1.6,
    satfat: 15.0,
    price: 350, currency: BDT, pricedOn: ON,
    /* A restaurant plate is not knowable and this is a midpoint,
       not a measurement: `DIET.md` §14 puts the plate between 700
       and 1,100 kcal and says anybody quoting 863 is reading a
       number a website invented. Logged as a range, the midpoint
       into the total and the width into the day's confidence. */
    source: "restaurant plate, midpoint of the range at DIET.md §14",
    tags: ["staple", "protein"],
  },
  {
    id: "muri-cup",
    en: "muri (puffed rice), 1 cup",
    bn: "মুড়ি, ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 15,
    kcal: 58, protein: 1.0, carbs: 13.0, fat: 0.1, fibre: 0.3,
    sodium: 55, iron: 0.6,
    price: 4, currency: BDT, pricedOn: ON,
    source: INFS, tags: ["staple", "snack"],
  },
  {
    id: "chira-30g",
    en: "raw chira (flattened rice), 30 g (dry)",
    bn: "চিড়া (কাঁচা, ভেজানোর আগে), ৩০ গ্রাম",
    place: ["bd"], qty: 30, unit: "g", grams: 30,
    kcal: 105, protein: 2.1, carbs: 23.0, fat: 0.3, fibre: 1.2,
    iron: 6.2, zinc: 0.4,
    price: 5, currency: BDT, pricedOn: ON,
    source: INFS, tags: ["staple", "snack"], raw: true,
  },
  {
    id: "jhalmuri-cup",
    en: "jhalmuri, 1 cup",
    bn: "ঝালমুড়ি, ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 50,
    kcal: 190, protein: 4.0, carbs: 26.0, fat: 8.0, fibre: 1.8,
    sodium: 380, potassium: 130, iron: 1.4,
    price: 20, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["snack"],
  },

  /* ---- dal, both states of each ---- */
  {
    id: "dal-masoor-cooked-bowl",
    en: "cooked masoor dal (thin, home style), 1 bowl",
    bn: "মসুর ডাল (রান্না করা, পাতলা), ১ বাটি",
    place: ["bd"], qty: 1, unit: "bowl", grams: 200,
    kcal: 140, protein: 7.5, carbs: 17.0, fat: 4.5, fibre: 5.0,
    sodium: 300, potassium: 300, calcium: 24, iron: 2.6, zinc: 1.1,
    folate: 120, satfat: 0.8,
    price: 15, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"], raw: false,
  },
  {
    id: "dal-mug-cooked-bowl",
    en: "cooked mug dal, 1 bowl",
    bn: "মুগ ডাল (রান্না করা), ১ বাটি",
    place: ["bd"], qty: 1, unit: "bowl", grams: 200,
    kcal: 150, protein: 8.5, carbs: 19.0, fat: 4.5, fibre: 5.5,
    sodium: 300, potassium: 330, calcium: 28, iron: 2.2, zinc: 1.0,
    folate: 155, satfat: 0.8,
    price: 18, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"], raw: false,
  },
  {
    id: "dal-mug-raw-100g",
    en: "raw mug dal, 100 g (dry)",
    bn: "মুগ ডাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd"], qty: 100, unit: "g", grams: 100,
    kcal: 347, protein: 23.9, carbs: 62.6, fat: 1.2, fibre: 16.3,
    sodium: 15, potassium: 1246, calcium: 132, iron: 6.7, zinc: 2.7,
    folate: 625,
    price: 14, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["protein", "staple"], raw: true,
  },

  /* ---- fish, meat and egg ---- */
  {
    id: "ilish-piece",
    en: "ilish (hilsa) curry, 1 piece",
    bn: "ইলিশ মাছ (রান্না করা), ১ টুকরা",
    place: ["bd"], qty: 1, unit: "piece", grams: 75,
    kcal: 245, protein: 16.0, carbs: 1.0, fat: 20.0, fibre: 0,
    sodium: 320, potassium: 240, calcium: 55, iron: 1.4, zinc: 0.9,
    vitd: 4.5, b12: 3.5, satfat: 5.5,
    price: 180, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"],
  },
  {
    id: "rui-piece",
    en: "rui curry, 1 piece",
    bn: "রুই মাছ (রান্না করা), ১ টুকরা",
    place: ["bd"], qty: 1, unit: "piece", grams: 75,
    kcal: 150, protein: 15.0, carbs: 1.0, fat: 9.5, fibre: 0,
    sodium: 290, potassium: 230, calcium: 45, iron: 1.0, zinc: 0.8,
    b12: 1.8, satfat: 2.2,
    price: 60, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"],
  },
  {
    id: "small-fish-bowl",
    en: "small fish (mola or kachki, cooked whole), 1 small bowl",
    bn: "ছোট মাছ (মলা বা কাচকি, কাঁটাসহ রান্না করা), ১ ছোট বাটি",
    place: ["bd"], qty: 1, unit: "bowl", grams: 60,
    kcal: 110, protein: 11.5, carbs: 1.0, fat: 6.5, fibre: 0,
    sodium: 260, potassium: 190, calcium: 480, iron: 3.5, zinc: 1.6,
    b12: 2.0, satfat: 1.8,
    price: 35, currency: BDT, pricedOn: ON,
    /* Eaten with the bones, which is where the calcium is, and
       why this row is not interchangeable with a fillet. */
    source: HOME, tags: ["protein"],
  },
  {
    id: "chingri-bowl",
    en: "chingri (prawn) curry, 1 small bowl",
    bn: "চিংড়ি (রান্না করা), ১ ছোট বাটি",
    place: ["bd"], qty: 1, unit: "bowl", grams: 80,
    kcal: 150, protein: 15.0, carbs: 2.0, fat: 9.0, fibre: 0,
    sodium: 420, potassium: 180, calcium: 60, iron: 1.5, zinc: 1.2,
    b12: 1.1, satfat: 2.0,
    price: 90, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"],
  },
  {
    id: "chicken-curry-piece",
    en: "chicken curry, 1 piece with gravy",
    bn: "মুরগির মাংস (রান্না করা), ১ টুকরা ঝোলসহ",
    place: ["bd"], qty: 1, unit: "piece", grams: 100,
    kcal: 195, protein: 18.0, carbs: 3.0, fat: 12.5, fibre: 0.5,
    sodium: 520, potassium: 240, iron: 1.2, zinc: 1.5, b12: 0.4,
    satfat: 3.2,
    price: 70, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"],
  },
  {
    id: "beef-curry-piece",
    en: "beef curry, 1 piece with gravy",
    bn: "গরুর মাংস (রান্না করা), ১ টুকরা ঝোলসহ",
    place: ["bd"], qty: 1, unit: "piece", grams: 100,
    kcal: 265, protein: 19.0, carbs: 2.0, fat: 20.0, fibre: 0.4,
    sodium: 540, potassium: 250, iron: 2.6, zinc: 4.5, b12: 2.2,
    satfat: 7.5,
    price: 120, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"],
  },
  {
    id: "egg-boiled-bd",
    en: "boiled egg, 1",
    bn: "ডিম সিদ্ধ, ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 50,
    kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fibre: 0,
    sodium: 62, potassium: 63, calcium: 25, iron: 0.6, zinc: 0.5,
    vitd: 1.1, b12: 0.56, folate: 22, satfat: 1.6,
    price: 13, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["protein"],
  },
  {
    id: "egg-fried-bd",
    en: "fried egg, 1",
    bn: "ডিম ভাজা, ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 55,
    kcal: 130, protein: 6.5, carbs: 0.6, fat: 11.0, fibre: 0,
    sodium: 160, potassium: 65, calcium: 25, iron: 0.6, zinc: 0.5,
    vitd: 1.1, b12: 0.56, satfat: 2.5,
    price: 16, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["protein"],
  },

  /* ---- vegetables ---- */
  {
    id: "alu-bhaji-cup",
    en: "alu bhaji (potato, cooked with oil), 1 cup",
    bn: "আলু ভাজি (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 150,
    kcal: 210, protein: 3.0, carbs: 30.0, fat: 9.0, fibre: 2.8,
    sodium: 400, potassium: 480, iron: 0.9, vitc: 9,
    satfat: 1.5,
    price: 20, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["staple", "veg"],
  },
  {
    id: "lal-shak-cup",
    en: "lal shak (red amaranth, cooked), 1 cup",
    bn: "লাল শাক (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 100,
    kcal: 70, protein: 3.0, carbs: 5.0, fat: 4.5, fibre: 2.5,
    sodium: 210, potassium: 480, calcium: 200, iron: 3.5, vitc: 25,
    folate: 85, satfat: 0.8,
    price: 12, currency: BDT, pricedOn: ON,
    /* Non-haem iron, so §15's pairing applies: it roughly doubles
       with vitamin C at the same meal, and tea with the meal
       works the other way. */
    source: HOME, tags: ["veg"],
  },
  {
    id: "palong-shak-cup",
    en: "palong shak (spinach, cooked), 1 cup",
    bn: "পালং শাক (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 100,
    kcal: 62, protein: 3.2, carbs: 4.0, fat: 4.0, fibre: 2.4,
    sodium: 200, potassium: 470, calcium: 135, iron: 3.0, vitc: 10,
    folate: 145, satfat: 0.7,
    price: 12, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["veg"],
  },
  {
    id: "begun-bhaji-cup",
    en: "begun bhaji (aubergine, cooked), 1 cup",
    bn: "বেগুন ভাজি (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 120,
    kcal: 135, protein: 2.0, carbs: 10.0, fat: 9.0, fibre: 3.2,
    sodium: 300, potassium: 250, iron: 0.5, vitc: 3, satfat: 1.5,
    price: 18, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["veg"],
  },
  {
    id: "mixed-veg-curry-cup",
    en: "mixed vegetable curry (sobji), 1 cup",
    bn: "মিশ্র সবজি (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 150,
    kcal: 130, protein: 3.0, carbs: 14.0, fat: 7.0, fibre: 4.0,
    sodium: 380, potassium: 400, calcium: 55, iron: 1.4, vitc: 22,
    folate: 55, satfat: 1.2,
    price: 25, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["veg"],
  },
  {
    id: "lau-curry-cup",
    en: "lau (bottle gourd) curry, 1 cup",
    bn: "লাউ (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 150,
    kcal: 70, protein: 1.2, carbs: 7.0, fat: 4.5, fibre: 1.5,
    sodium: 300, potassium: 220, calcium: 30, iron: 0.4, vitc: 8,
    satfat: 0.8,
    price: 15, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["veg"],
  },
  {
    id: "korola-bhaji-cup",
    en: "korola bhaji (bitter gourd, cooked), 1 cup",
    bn: "করলা ভাজি (রান্না করা), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 100,
    kcal: 95, protein: 1.8, carbs: 8.0, fat: 6.0, fibre: 2.6,
    sodium: 260, potassium: 300, calcium: 20, iron: 0.8, vitc: 60,
    folate: 60, satfat: 1.0,
    price: 18, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["veg"],
  },

  /* ---- fruit ---- */
  {
    id: "banana-bd",
    en: "banana, 1 medium",
    bn: "কলা, ১টা মাঝারি",
    place: ["bd"], qty: 1, unit: "piece", grams: 100,
    kcal: 89, protein: 1.1, carbs: 23.0, fat: 0.3, fibre: 2.6,
    sodium: 1, potassium: 358, calcium: 5, iron: 0.3, vitc: 8.7,
    folate: 20,
    price: 12, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },
  {
    id: "mango-bd",
    en: "mango, 1 medium",
    bn: "আম, ১টা মাঝারি",
    place: ["bd"], qty: 1, unit: "piece", grams: 200,
    kcal: 120, protein: 1.6, carbs: 30.0, fat: 0.8, fibre: 3.2,
    sodium: 2, potassium: 336, calcium: 22, iron: 0.3, vitc: 73,
    folate: 86,
    price: 50, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },
  {
    id: "jackfruit-cup",
    en: "kathal (jackfruit), 1 cup of bulbs",
    bn: "কাঁঠাল, ১ কাপ কোয়া",
    place: ["bd"], qty: 1, unit: "cup", grams: 150,
    kcal: 143, protein: 2.6, carbs: 35.0, fat: 1.0, fibre: 2.3,
    sodium: 3, potassium: 670, calcium: 36, iron: 0.9, vitc: 20,
    folate: 36,
    price: 40, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },
  {
    id: "papaya-cup",
    en: "pepe (papaya), 1 cup",
    bn: "পেঁপে, ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 145,
    kcal: 62, protein: 1.0, carbs: 16.0, fat: 0.4, fibre: 2.5,
    sodium: 12, potassium: 264, calcium: 29, iron: 0.4, vitc: 88,
    folate: 53,
    price: 20, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },
  {
    id: "guava-bd",
    en: "peyara (guava), 1 medium",
    bn: "পেয়ারা, ১টা মাঝারি",
    place: ["bd"], qty: 1, unit: "piece", grams: 100,
    kcal: 68, protein: 2.6, carbs: 14.0, fat: 1.0, fibre: 5.4,
    sodium: 2, potassium: 417, calcium: 18, iron: 0.3, vitc: 228,
    folate: 49,
    price: 15, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },

  /* ---- what is drunk, and what is eaten standing up ---- */
  {
    id: "dudh-cha-cup",
    en: "milk tea (dudh cha), 1 cup",
    bn: "দুধ চা, ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 200,
    kcal: 95, protein: 2.5, carbs: 13.0, fat: 3.5, fibre: 0,
    sodium: 35, potassium: 130, calcium: 90, b12: 0.3, satfat: 2.1,
    price: 12, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["drink"],
  },
  {
    id: "dudh-cup",
    en: "cow's milk (full fat), 1 cup",
    bn: "দুধ (গরুর, ফুল ক্রিম), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 240,
    kcal: 155, protein: 8.0, carbs: 12.0, fat: 8.5, fibre: 0,
    sodium: 105, potassium: 350, calcium: 290, b12: 1.1, zinc: 1.0,
    vitd: 2.6, satfat: 5.0,
    price: 30, currency: BDT, pricedOn: ON,
    source: INFS, tags: ["drink", "protein"],
  },
  {
    id: "milk-powder-bd",
    en: "full cream milk powder, 2 tablespoons",
    bn: "গুঁড়া দুধ (ফুল ক্রিম), ২ টেবিল চামচ",
    place: ["bd"], qty: 2, unit: "tablespoon", grams: 20,
    kcal: 100, protein: 5.2, carbs: 8.0, fat: 5.4, fibre: 0,
    sodium: 75, potassium: 250, calcium: 190, b12: 0.6, zinc: 0.7,
    satfat: 3.4,
    price: 20, currency: BDT, pricedOn: ON,
    /* One of §17's cheap Bangladeshi proteins, which is the
       whole reason it is a row rather than free entry. */
    source: "Dhaka retail pack label, per 100 g",
    tags: ["protein", "drink"],
  },
  {
    id: "mishti-roshogolla",
    en: "mishti (roshogolla), 1 piece",
    bn: "মিষ্টি (রসগোল্লা), ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 40,
    kcal: 150, protein: 3.0, carbs: 25.0, fat: 4.5, fibre: 0,
    sodium: 40, calcium: 70, satfat: 2.8,
    price: 25, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["snack"],
  },
  {
    id: "misti-doi-cup",
    en: "misti doi (sweet yoghurt), 1 cup",
    bn: "মিষ্টি দই, ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 100,
    kcal: 145, protein: 4.0, carbs: 24.0, fat: 3.8, fibre: 0,
    sodium: 50, potassium: 160, calcium: 130, b12: 0.3, satfat: 2.4,
    price: 40, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["snack"],
  },
  {
    id: "singara",
    en: "singara, 1 piece",
    bn: "সিঙ্গাড়া, ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 60,
    kcal: 195, protein: 3.5, carbs: 22.0, fat: 10.5, fibre: 2.0,
    sodium: 320, potassium: 190, iron: 0.9, satfat: 3.0,
    price: 12, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["snack"],
  },
  {
    id: "samosa-bd",
    en: "samosa, 1 piece",
    bn: "সমুচা, ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 50,
    kcal: 175, protein: 3.2, carbs: 19.0, fat: 9.5, fibre: 1.6,
    sodium: 300, potassium: 150, iron: 0.8, satfat: 2.8,
    price: 12, currency: BDT, pricedOn: ON,
    source: HOME, tags: ["snack"],
  },

  /* ---- the oil nobody measures, and the rest of the fat ---- */
  {
    id: "oil-soyabean-tbsp",
    en: "soyabean cooking oil, 1 tablespoon",
    bn: "সয়াবিন তেল, ১ টেবিল চামচ",
    place: ["bd"], qty: 1, unit: "tablespoon", grams: 14,
    kcal: 124, protein: 0, carbs: 0, fat: 14.0, fibre: 0,
    satfat: 2.2,
    price: 3, currency: BDT, pricedOn: ON,
    /* Two tablespoons is about 240 kcal and it is routine to use
       more. `DIET.md` §14 calls this the single largest unlogged
       item in a week of home cooking, which is why the tool
       calibrates the household's bottle rather than the dish. */
    source: USDA, tags: ["oil"],
  },
  {
    id: "oil-mustard-tbsp",
    en: "mustard oil, 1 tablespoon",
    bn: "সরিষার তেল, ১ টেবিল চামচ",
    place: ["bd"], qty: 1, unit: "tablespoon", grams: 14,
    kcal: 124, protein: 0, carbs: 0, fat: 14.0, fibre: 0,
    satfat: 1.6,
    price: 4, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["oil"],
  },
  {
    id: "ghee-tbsp",
    en: "ghee, 1 tablespoon",
    bn: "ঘি, ১ টেবিল চামচ",
    place: ["bd"], qty: 1, unit: "tablespoon", grams: 13,
    kcal: 115, protein: 0, carbs: 0, fat: 13.0, fibre: 0,
    vitd: 0.2, satfat: 8.1,
    price: 20, currency: BDT, pricedOn: ON,
    source: USDA, tags: ["oil"],
  },
];

/* ------------------------------------------------------------
   The UK: a slice, a tin, a meal deal and a pint
   ------------------------------------------------------------ */

const UK: Portion[] = [
  {
    id: "bread-wholemeal-slice",
    en: "wholemeal bread, 1 medium slice",
    bn: "আটার পাউরুটি, ১ স্লাইস",
    place: ["uk"], qty: 1, unit: "slice", grams: 36,
    kcal: 82, protein: 3.4, carbs: 13.8, fat: 0.9, fibre: 2.5,
    sodium: 150, potassium: 90, calcium: 40, iron: 0.9, zinc: 0.6,
    folate: 15,
    price: 0.09, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["staple"],
  },
  {
    id: "bread-white-slice",
    en: "white bread, 1 medium slice",
    bn: "সাদা পাউরুটি, ১ স্লাইস",
    place: ["uk"], qty: 1, unit: "slice", grams: 36,
    kcal: 88, protein: 2.9, carbs: 17.0, fat: 0.6, fibre: 1.0,
    sodium: 160, potassium: 45, calcium: 60, iron: 0.6, folate: 20,
    price: 0.06, currency: GBP, pricedOn: ON,
    /* UK white flour is fortified with calcium and iron by law,
       which is why those two are higher here than the wholemeal
       row a reader would expect to beat it. */
    source: LABEL_UK, tags: ["staple"],
  },
  {
    id: "oats-raw-40g",
    en: "raw porridge oats, 40 g (dry)",
    bn: "ওটস (কাঁচা, রান্নার আগে), ৪০ গ্রাম",
    place: ["uk"], qty: 40, unit: "g", grams: 40,
    kcal: 150, protein: 4.4, carbs: 24.0, fat: 3.2, fibre: 3.6,
    sodium: 2, potassium: 145, calcium: 21, iron: 1.6, zinc: 1.2,
    folate: 14,
    price: 0.06, currency: GBP, pricedOn: ON,
    source: MW, tags: ["staple"], raw: true,
  },
  {
    id: "porridge-milk-bowl",
    en: "cooked porridge made with semi-skimmed milk, 1 bowl",
    bn: "ওটসের পরিজ (দুধ দিয়ে রান্না করা), ১ বাটি",
    place: ["uk"], qty: 1, unit: "bowl", grams: 280,
    kcal: 248, protein: 11.4, carbs: 34.0, fat: 6.6, fibre: 3.6,
    sodium: 80, potassium: 460, calcium: 260, b12: 1.8, zinc: 2.2,
    satfat: 3.0,
    price: 0.19, currency: GBP, pricedOn: ON,
    source: `${MW}, 40 g of oats and 200 ml of milk`,
    tags: ["staple"], raw: false,
  },
  {
    id: "weetabix-two",
    en: "Weetabix, 2 biscuits",
    bn: "উইটাবিক্স (গমের বিস্কুট), ২টা",
    place: ["uk"], qty: 2, unit: "biscuit", grams: 38,
    kcal: 136, protein: 4.5, carbs: 26.0, fat: 0.7, fibre: 3.8,
    sodium: 100, potassium: 130, iron: 4.5, zinc: 1.9, folate: 100,
    b12: 0.6,
    price: 0.14, currency: GBP, pricedOn: ON,
    /* Fortified, which is the point of the row: the iron, folate
       and B12 here are added rather than the wheat's. */
    source: LABEL_UK, tags: ["staple"],
  },
  {
    id: "pasta-dry-75g",
    en: "raw pasta, 75 g (dry, before cooking)",
    bn: "পাস্তা (কাঁচা, রান্নার আগে), ৭৫ গ্রাম",
    place: ["uk"], qty: 75, unit: "g", grams: 75,
    kcal: 265, protein: 9.2, carbs: 53.0, fat: 1.1, fibre: 2.4,
    sodium: 5, potassium: 170, iron: 1.1, zinc: 1.0, folate: 13,
    price: 0.11, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["staple"], raw: true,
  },
  {
    id: "pasta-cooked-cup",
    en: "cooked pasta, 1 cup",
    bn: "পাস্তা (রান্না করা), ১ কাপ",
    place: ["uk"], qty: 1, unit: "cup", grams: 140,
    kcal: 220, protein: 8.1, carbs: 43.0, fat: 1.3, fibre: 2.5,
    sodium: 6, potassium: 60, iron: 0.9, zinc: 0.8, folate: 10,
    price: 0.08, currency: GBP, pricedOn: ON,
    source: MW, tags: ["staple"], raw: false,
  },
  {
    id: "chicken-breast-uk",
    en: "cooked chicken breast, 1 skinless (150 g)",
    bn: "মুরগির বুকের মাংস (চামড়া ছাড়া, রান্না করা), ১৫০ গ্রাম",
    place: ["uk"], qty: 1, unit: "piece", grams: 150,
    kcal: 248, protein: 46.5, carbs: 0, fat: 5.4, fibre: 0,
    sodium: 110, potassium: 380, iron: 1.4, zinc: 1.4, b12: 0.5,
    satfat: 1.5,
    price: 1.80, currency: GBP, pricedOn: ON,
    source: MW, tags: ["protein"],
  },
  {
    id: "chicken-thigh-uk",
    en: "cooked chicken thigh, 2 skinless (120 g)",
    bn: "মুরগির রানের মাংস (চামড়া ছাড়া, রান্না করা), ১২০ গ্রাম",
    place: ["uk"], qty: 2, unit: "piece", grams: 120,
    kcal: 220, protein: 30.0, carbs: 0, fat: 11.0, fibre: 0,
    sodium: 105, potassium: 300, iron: 1.3, zinc: 2.6, b12: 0.6,
    satfat: 3.1,
    price: 0.75, currency: GBP, pricedOn: ON,
    /* One of §17's cheap UK proteins, and the reason the cost per
       gram of protein table is worth having: it beats the breast
       above on price and loses on protein. */
    source: MW, tags: ["protein"],
  },
  {
    id: "tuna-tin",
    en: "tinned tuna in spring water, 1 tin (drained)",
    bn: "টিনের টুনা মাছ (পানিতে), ১ টিন",
    place: ["uk"], qty: 1, unit: "tin", grams: 112,
    kcal: 120, protein: 26.5, carbs: 0, fat: 0.8, fibre: 0,
    sodium: 350, potassium: 260, iron: 1.1, zinc: 0.6, vitd: 1.5,
    b12: 2.5,
    price: 1.00, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["protein"],
  },
  {
    id: "mackerel-tin",
    en: "tinned mackerel in tomato sauce, 1 tin",
    bn: "টিনের ম্যাকারেল মাছ (টমেটো সসে), ১ টিন",
    place: ["uk"], qty: 1, unit: "tin", grams: 125,
    kcal: 230, protein: 20.0, carbs: 3.0, fat: 15.0, fibre: 0.5,
    sodium: 480, potassium: 320, calcium: 55, iron: 1.2, vitd: 8.0,
    b12: 9.0, satfat: 3.4,
    price: 1.10, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["protein"],
  },
  {
    id: "salmon-fillet-uk",
    en: "cooked salmon fillet, 1 (130 g)",
    bn: "স্যামন মাছ (রান্না করা), ১৩০ গ্রাম",
    place: ["uk"], qty: 1, unit: "piece", grams: 130,
    kcal: 260, protein: 32.0, carbs: 0, fat: 14.0, fibre: 0,
    sodium: 90, potassium: 480, calcium: 15, iron: 0.5, zinc: 0.6,
    vitd: 12.0, b12: 4.5, satfat: 2.8,
    price: 3.00, currency: GBP, pricedOn: ON,
    /* One of the few real dietary sources of vitamin D, which
       §15 says the UK winter genuinely runs short of. */
    source: MW, tags: ["protein"],
  },
  {
    id: "baked-beans-half-tin",
    en: "baked beans in tomato sauce, half a tin",
    bn: "বেকড বিনস (টমেটো সসে), আধা টিন",
    place: ["uk"], qty: 0.5, unit: "tin", grams: 200,
    kcal: 155, protein: 9.6, carbs: 26.0, fat: 0.4, fibre: 7.6,
    sodium: 500, potassium: 600, calcium: 90, iron: 2.8, zinc: 1.2,
    folate: 46,
    price: 0.35, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["protein"],
  },
  {
    id: "egg-boiled-uk",
    en: "boiled egg, 1 medium",
    bn: "ডিম সিদ্ধ, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 50,
    kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fibre: 0,
    sodium: 62, potassium: 63, calcium: 25, iron: 0.6, zinc: 0.5,
    vitd: 1.1, b12: 0.56, folate: 22, satfat: 1.6,
    price: 0.28, currency: GBP, pricedOn: ON,
    source: USDA, tags: ["protein"],
  },
  {
    id: "egg-fried-uk",
    en: "fried egg, 1 medium",
    bn: "ডিম ভাজা, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 55,
    kcal: 120, protein: 6.5, carbs: 0.6, fat: 10.0, fibre: 0,
    sodium: 140, potassium: 65, calcium: 25, iron: 0.6, zinc: 0.5,
    vitd: 1.1, b12: 0.56, satfat: 2.3,
    price: 0.31, currency: GBP, pricedOn: ON,
    source: MW, tags: ["protein"],
  },
  {
    id: "cheddar-30g",
    en: "cheddar, 30 g",
    bn: "চেডার পনির, ৩০ গ্রাম",
    place: ["uk"], qty: 30, unit: "g", grams: 30,
    kcal: 124, protein: 7.6, carbs: 0.1, fat: 10.3, fibre: 0,
    sodium: 190, potassium: 30, calcium: 220, zinc: 1.2, b12: 0.3,
    satfat: 6.5,
    price: 0.28, currency: GBP, pricedOn: ON,
    source: MW, tags: ["protein"],
  },
  {
    id: "greek-yoghurt-pot",
    en: "Greek style yoghurt (0% fat), 1 pot (150 g)",
    bn: "গ্রিক দই (চর্বি ছাড়া), ১ পট (১৫০ গ্রাম)",
    place: ["uk"], qty: 1, unit: "pot", grams: 150,
    kcal: 97, protein: 15.0, carbs: 6.0, fat: 0.6, fibre: 0,
    sodium: 60, potassium: 210, calcium: 170, b12: 0.7, zinc: 0.9,
    satfat: 0.4,
    price: 0.50, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["protein"],
  },
  {
    id: "milk-semi-skimmed-cup",
    en: "semi-skimmed milk, 1 cup",
    bn: "আধা-ননিতোলা দুধ, ১ কাপ",
    place: ["uk"], qty: 1, unit: "cup", grams: 250,
    kcal: 123, protein: 8.7, carbs: 12.4, fat: 4.3, fibre: 0,
    sodium: 110, potassium: 400, calcium: 300, b12: 2.3, zinc: 1.0,
    satfat: 2.7,
    price: 0.16, currency: GBP, pricedOn: ON,
    source: MW, tags: ["drink", "protein"],
  },
  {
    id: "meal-deal-sandwich",
    en: "meal deal sandwich, 1 pack",
    bn: "দোকানের প্যাকেট স্যান্ডউইচ, ১টা",
    place: ["uk"], qty: 1, unit: "pack", grams: 200,
    kcal: 430, protein: 24.0, carbs: 42.0, fat: 19.0, fibre: 4.0,
    sodium: 1100, potassium: 300, calcium: 120, iron: 2.0,
    satfat: 6.0,
    price: 2.75, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["staple", "protein"],
  },
  {
    id: "meal-deal-whole",
    en: "supermarket meal deal: sandwich, crisps and a drink",
    bn: "সুপারমার্কেটের মিল ডিল: স্যান্ডউইচ, চিপস ও একটা পানীয়",
    place: ["uk"], qty: 1, unit: "meal",
    kcal: 800, protein: 28.0, carbs: 92.0, fat: 34.0, fibre: 5.0,
    sodium: 1600, potassium: 450, calcium: 140, iron: 2.4,
    satfat: 10.0,
    price: 3.90, currency: GBP, pricedOn: ON,
    /* The whole thing rather than the sandwich, because the
       crisps and the drink are what a reader stops counting. */
    source: "three UK supermarket labels added together",
    tags: ["staple", "snack"],
  },
  {
    id: "lager-pint",
    en: "lager (about 4% ABV), 1 pint",
    bn: "লাগার বিয়ার (প্রায় ৪% অ্যালকোহল), ১ পাইন্ট",
    place: ["uk"], qty: 1, unit: "pint",
    kcal: 190, protein: 1.4, carbs: 15.0, fat: 0, fibre: 0,
    sodium: 12, potassium: 150,
    price: 5.20, currency: GBP, pricedOn: ON,
    /* The macros do not add up to the energy here and cannot:
       most of a pint's calories are the alcohol, which is a
       fourth energy source at about 7 kcal a gram and is not a
       carbohydrate. Anything summing macros to check a total
       has to know that. */
    source: MW, tags: ["drink"],
  },
  {
    id: "flat-white",
    en: "flat white, 1 regular",
    bn: "ফ্ল্যাট হোয়াইট কফি, ১ কাপ (মাঝারি)",
    place: ["uk"], qty: 1, unit: "cup", grams: 230,
    kcal: 120, protein: 6.3, carbs: 9.0, fat: 6.5, fibre: 0,
    sodium: 80, potassium: 290, calcium: 230, b12: 1.2, satfat: 4.0,
    price: 3.30, currency: GBP, pricedOn: ON,
    source: "UK coffee chain label, whole milk", tags: ["drink"],
  },
  {
    id: "olive-oil-tbsp",
    en: "olive oil, 1 tablespoon",
    bn: "অলিভ অয়েল, ১ টেবিল চামচ",
    place: ["uk"], qty: 1, unit: "tablespoon", grams: 13.5,
    kcal: 119, protein: 0, carbs: 0, fat: 13.5, fibre: 0,
    satfat: 1.9,
    price: 0.09, currency: GBP, pricedOn: ON,
    source: USDA, tags: ["oil"],
  },
  {
    id: "peanut-butter-tbsp",
    en: "peanut butter, 1 tablespoon",
    bn: "পিনাট বাটার (চীনাবাদামের মাখন), ১ টেবিল চামচ",
    place: ["uk"], qty: 1, unit: "tablespoon", grams: 16,
    kcal: 95, protein: 4.0, carbs: 3.2, fat: 8.0, fibre: 1.0,
    sodium: 75, potassium: 120, calcium: 8, iron: 0.3, zinc: 0.5,
    folate: 14, satfat: 1.6,
    price: 0.10, currency: GBP, pricedOn: ON,
    source: USDA, tags: ["protein"],
  },
  {
    id: "broccoli-cooked-80g",
    en: "cooked broccoli, 80 g (one portion)",
    bn: "ব্রকলি (রান্না করা), ৮০ গ্রাম",
    place: ["uk"], qty: 80, unit: "g", grams: 80,
    kcal: 28, protein: 2.4, carbs: 3.0, fat: 0.4, fibre: 2.2,
    sodium: 26, potassium: 250, calcium: 32, iron: 0.5, vitc: 55,
    folate: 50,
    price: 0.24, currency: GBP, pricedOn: ON,
    source: MW, tags: ["veg"],
  },
  {
    id: "potato-jacket-uk",
    en: "baked jacket potato, 1 large",
    bn: "জ্যাকেট পটেটো (আলু, ওভেনে বেক করা), ১টা বড়",
    place: ["uk"], qty: 1, unit: "piece", grams: 200,
    kcal: 190, protein: 4.4, carbs: 42.0, fat: 0.3, fibre: 4.4,
    sodium: 16, potassium: 900, calcium: 20, iron: 1.0, vitc: 18,
    folate: 38,
    price: 0.45, currency: GBP, pricedOn: ON,
    source: MW, tags: ["staple", "veg"],
  },
  {
    id: "chips-oven-uk",
    en: "oven chips, 1 portion",
    bn: "ওভেন চিপস (আলুর), ১ প্লেট",
    place: ["uk"], qty: 1, unit: "portion", grams: 150,
    kcal: 240, protein: 3.5, carbs: 40.0, fat: 7.5, fibre: 3.5,
    sodium: 60, potassium: 640, iron: 0.8, vitc: 8, satfat: 0.9,
    price: 0.45, currency: GBP, pricedOn: ON,
    source: LABEL_UK, tags: ["staple", "snack"],
  },
  {
    id: "apple-uk",
    en: "apple, 1 medium",
    bn: "আপেল, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 150,
    kcal: 78, protein: 0.4, carbs: 20.0, fat: 0.2, fibre: 3.6,
    sodium: 2, potassium: 160, calcium: 9, vitc: 7, folate: 5,
    price: 0.35, currency: GBP, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },
  {
    id: "banana-uk",
    en: "banana, 1 medium",
    bn: "কলা, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 100,
    kcal: 89, protein: 1.1, carbs: 23.0, fat: 0.3, fibre: 2.6,
    sodium: 1, potassium: 358, calcium: 5, iron: 0.3, vitc: 8.7,
    folate: 20,
    price: 0.18, currency: GBP, pricedOn: ON,
    source: USDA, tags: ["fruit"],
  },
];

/** The whole library, in one array, because the search ranks
    across both places rather than filtering to one. `forPlace`
    is the filter, and §22's rule that only one place's list is
    ever DOWNLOADED is the route's job rather than this file's. */
export const FOODS: Portion[] = [...BOTH, ...BD, ...UK];

/* ------------------------------------------------------------
   Reaching a row
   ------------------------------------------------------------ */

/** Everything a reader in that place can tap, in file order.
    A row listing both places is in both answers. */
export const forPlace = (place: Place): Portion[] =>
  FOODS.filter((f) => f.place.includes(place));

/** Built once, because `byId` is called per logged item and a
    scan of the whole library per row is a scan per row. A
    duplicate id would not fail here: the later row would simply
    never be reachable, which is why ids are unique by hand. */
const INDEX: Map<string, Portion> = new Map(FOODS.map((f) => [f.id, f]));

export const byId = (id: string): Portion | undefined => INDEX.get(id);

/**
 * Rows matching `q` in English, in Bangla or in a tag, with the
 * reader's own place first.
 *
 * The other place's rows are still returned, and last. A
 * Bangladeshi reader in Manchester eats both lists, and a search
 * that hid the half they did not tick would look like a library
 * that has never heard of dal.
 *
 * Ranked, not scored: available here beats not, and a name that
 * STARTS with what was typed beats one that merely contains it,
 * so "rice" opens on the rice rather than on the jasmine tea
 * that mentions it. Ties keep file order, which is the order
 * these were written in and is therefore stable.
 */
export function search(q: string, place: Place): Portion[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return forPlace(place);

  const hits: Array<{ item: Portion; rank: number; at: number }> = [];
  FOODS.forEach((item, at) => {
    let best = -1;
    for (const field of [item.en, item.bn, ...(item.tags ?? [])]) {
      const found = field.toLowerCase().indexOf(needle);
      if (found < 0) continue;
      best = best < 0 ? found : Math.min(best, found);
    }
    if (best < 0) return;
    const here = item.place.includes(place) ? 0 : 2;
    hits.push({ item, rank: here + (best === 0 ? 0 : 1), at });
  });

  return hits
    .sort((a, b) => a.rank - b.rank || a.at - b.at)
    .map((h) => h.item);
}

/**
 * The nutrients §15's coverage arithmetic counts, and the whole
 * of them.
 *
 * "Iron: about 9 mg, from 62% of today's food" is the sentence
 * this list exists for: the denominator is every logged item and
 * the numerator is the ones whose row carries the key, so a key
 * that is not on this list is a nutrient nobody is told the
 * coverage of.
 *
 * `satisfies` rather than an annotation, so a key misspelled
 * here fails to compile instead of quietly covering nothing.
 * Protein, carbs, fat and fibre are absent on purpose: they are
 * required on every row, so their coverage is always the whole
 * of what was logged with a row at all.
 */
export const COVERAGE_KEYS = [
  "sodium", "potassium", "calcium", "iron",
  "vitc", "vitd", "b12", "zinc", "folate", "satfat",
] as const satisfies readonly (keyof Portion)[];

export type CoverageKey = (typeof COVERAGE_KEYS)[number];
