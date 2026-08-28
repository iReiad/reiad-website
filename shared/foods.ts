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

   A MEASURED ZERO IS NOT SILENCE. An oil carries no magnesium
   and no sugar, and saying so is knowledge rather than a gap:
   those rows write the nought. What may never be written is a
   nought standing in for a figure nobody looked up.

   ---- and selenium follows the soil, not the food ----

   Magnesium, iodine, selenium, sugars and water arrived after
   the rest of this library. A UK label states sugars and no
   mineral past salt, the Bangladesh FCT states moisture and not
   every mineral, and a composed home dish states whatever its
   ingredients do, so `also()` names the second table on any row
   whose own one does not carry the figure.

   SELENIUM is the one that cannot be substituted between
   countries. It is taken up from the soil, Bangladesh's soils
   are low in it and North America's are high, so an American
   figure for rice or dal would be wrong by a multiple rather
   than by a rounding. It is carried on animal foods, on the
   rows whose own table states it, and left ABSENT on the
   Bangladeshi grain, pulse and vegetable rows, which is what
   §15's coverage line then reports.

   IODINE is thinner still, and for the opposite reason: it is
   in the salt and in whatever the animal was fed. Eleven rows
   carry it and the rest do not.
   ============================================================ */

/** Where the reader eats, which decides the library, the
    currency and the search's ranking.

    Imported rather than declared again: `diet.ts` already says
    this, and two files spelling one vocabulary is how a place
    gets added to one of them. */
import type { Entry, Place } from "./diet.ts";
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
  /** The §15 list, in mg except `vitd`, `b12`, `folate`,
      `iodine` and `selenium`, which are micrograms. Omitted
      rather than guessed: see the header. */
  sodium?: number;
  potassium?: number;
  magnesium?: number;
  calcium?: number;
  iron?: number;
  vitc?: number;
  vitd?: number;
  b12?: number;
  zinc?: number;
  folate?: number;
  iodine?: number;
  selenium?: number;
  /** Grams, and the reason it is here rather than in the macros
      is §15: keto raises it for most people who try it, and the
      tool tracks it as a share of total fat where the library
      knows it. */
  satfat?: number;
  /** Grams of TOTAL sugars, which is what a table and a label
      both state. It is not the same quantity as the free sugars
      the UK's 30 g advice is about, and `nutrients.ts` says so
      where the figure is drawn rather than letting a reader
      assume the two are one number. */
  sugar?: number;
  /** Grams of water in the food itself, which is about the same
      number of millilitres. §15 logs what is DRUNK in glasses,
      and food is the other fifth to third of a day's fluid: a
      figure that counts only the glasses is a figure that is
      wrong by that much, every day. */
  water?: number;
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
const HOME = "INFS Bangladesh FCT 2013, cooked with the oil counted in;"
  + " any magnesium, iodine, selenium, sugars and water figure is composed"
  + " from the ingredients";

/** A row whose energy and macros come from one table and one of
    the newer nutrients from another. Both are named, because a
    citation that is right about half of itself is worse than
    none: a reader checking a magnesium figure against the
    Bangladesh FCT would not find it there. */
const also = (base: string, what: string): string => `${base}; ${what} from ${USDA}`;

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
    magnesium: 19, selenium: 11.9, sugar: 0.1, water: 108,
    source: USDA, tags: ["staple"], raw: false,
  },
  {
    id: "rice-white-raw-100g",
    en: "raw white rice, 100 g (dry, before cooking)",
    bn: "চাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd", "uk"], qty: 100, unit: "g", grams: 100,
    kcal: 365, protein: 7.1, carbs: 80.0, fat: 0.7, fibre: 1.3,
    sodium: 5, potassium: 115, iron: 4.3, zinc: 1.1, folate: 231,
    magnesium: 25, selenium: 15.1, sugar: 0.1, water: 11.6,
    source: USDA, tags: ["staple"], raw: true,
  },
  {
    id: "dal-masoor-raw-100g",
    en: "raw masoor dal (red lentils), 100 g (dry)",
    bn: "মসুর ডাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd", "uk"], qty: 100, unit: "g", grams: 100,
    kcal: 352, protein: 24.6, carbs: 63.0, fat: 1.1, fibre: 10.7,
    sodium: 6, potassium: 677, calcium: 35, iron: 6.5, zinc: 3.3, folate: 479,
    magnesium: 47, vitc: 4.5, selenium: 8.3, sugar: 2.0, water: 8.3,
    source: USDA, tags: ["protein", "staple"], raw: true,
  },
  {
    id: "chickpeas-cooked-cup",
    en: "cooked chickpeas (chola), 1 cup",
    bn: "ছোলা (সিদ্ধ করা), ১ কাপ",
    place: ["bd", "uk"], qty: 1, unit: "cup", grams: 164,
    kcal: 269, protein: 14.5, carbs: 45.0, fat: 4.2, fibre: 12.5,
    sodium: 11, potassium: 477, calcium: 80, iron: 4.7, zinc: 2.5, folate: 282,
    magnesium: 79, vitc: 2.1, selenium: 6.1, sugar: 7.9, water: 99,
    source: USDA, tags: ["protein"], raw: false,
  },
  {
    id: "potato-boiled-medium",
    en: "boiled potato, 1 medium",
    bn: "আলু সিদ্ধ, ১টা মাঝারি",
    place: ["bd", "uk"], qty: 1, unit: "piece", grams: 150,
    kcal: 130, protein: 2.8, carbs: 30.0, fat: 0.2, fibre: 2.7,
    sodium: 8, potassium: 500, iron: 0.5, vitc: 11, folate: 15,
    magnesium: 30, zinc: 0.4, selenium: 0.5, sugar: 1.3, water: 116,
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
    magnesium: 24, selenium: 4.4, sugar: 9.3, water: 176,
    source: USDA, tags: ["protein", "drink"],
  },
  {
    id: "tea-black-sugar",
    en: "black tea with 2 teaspoons of sugar, 1 cup",
    bn: "চিনি দেওয়া রং চা, ১ কাপ",
    place: ["bd", "uk"], qty: 1, unit: "cup", grams: 240,
    kcal: 34, protein: 0, carbs: 8.4, fat: 0, fibre: 0,
    sodium: 5, potassium: 88,
    magnesium: 7, sugar: 8.4, water: 231,
    source: `${USDA}, tea plus the sugar counted in`, tags: ["drink"],
  },
  {
    id: "sugar-tsp",
    en: "sugar, 1 teaspoon",
    bn: "চিনি, ১ চা চামচ",
    place: ["bd", "uk"], qty: 1, unit: "teaspoon", grams: 4,
    kcal: 16, protein: 0, carbs: 4.2, fat: 0, fibre: 0,
    magnesium: 0, sugar: 4.0, water: 0,
    source: USDA,
  },
  {
    id: "salt-iodised-tsp",
    en: "iodised salt, 1 teaspoon",
    bn: "আয়োডিনযুক্ত লবণ, ১ চা চামচ",
    place: ["bd", "uk"], qty: 1, unit: "teaspoon", grams: 6,
    kcal: 0, protein: 0, carbs: 0, fat: 0, fibre: 0,
    sodium: 2325,
    magnesium: 0, iodine: 120, sugar: 0, water: 0,
    /* Here for the sodium, and for the line in §15 that a low
       sodium push can quietly take Bangladesh's main source of
       iodine with it. */
    source: `${USDA}; iodine at Bangladesh's 20 mg/kg household standard,`
      + " before cooking losses",
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
    magnesium: 16, sugar: 0.2, water: 112,
    price: 11, currency: BDT, pricedOn: ON,
    /* Most of what is actually eaten in Bangladesh. Lower
       glycaemic response than polished white rice and much the
       same energy, which is `DIET.md` §14: relevant to somebody
       managing blood sugar, irrelevant to the calorie total. */
    source: also(INFS, "magnesium, sugars and water"), tags: ["staple"], raw: false,
  },
  {
    id: "rice-parboiled-raw-100g",
    en: "raw parboiled rice (siddho chal), 100 g (dry)",
    bn: "সিদ্ধ চাল (কাঁচা, রান্নার আগে), ১০০ গ্রাম",
    place: ["bd"], qty: 100, unit: "g", grams: 100,
    kcal: 370, protein: 7.5, carbs: 81.0, fat: 1.0, fibre: 1.8,
    sodium: 4, potassium: 155, iron: 3.4, zinc: 1.2, folate: 110,
    magnesium: 27, sugar: 0.3, water: 10.5,
    price: 7, currency: BDT, pricedOn: ON,
    source: also(INFS, "magnesium, sugars and water"), tags: ["staple"], raw: true,
  },
  {
    id: "panta-bhat-cup",
    en: "panta bhat (cooked rice soaked in water overnight), 1 cup",
    bn: "পান্তা ভাত (রান্না করা ভাত সারা রাত পানিতে ভেজানো), ১ কাপ",
    place: ["bd"], qty: 1, unit: "cup", grams: 200,
    kcal: 195, protein: 4.2, carbs: 42.0, fat: 0.4, fibre: 0.8,
    sodium: 3, potassium: 70, iron: 2.2, zinc: 0.9,
    magnesium: 18, sugar: 0.1, water: 152,
    price: 10, currency: BDT, pricedOn: ON,
    /* Rice cooled and left overnight forms resistant starch,
       which lowers available energy SLIGHTLY. `DIET.md` §14 says
       the second half of that sentence as loudly as the first,
       so the figure here is the cooked rice's and not a
       discount. */
    source: also(INFS, "magnesium, sugars and water"), tags: ["staple"], raw: false,
  },
  {
    id: "khichuri-plate",
    en: "khichuri (cooked), 1 plate",
    bn: "খিচুড়ি (রান্না করা), ১ প্লেট",
    place: ["bd"], qty: 1, unit: "plate", grams: 300,
    kcal: 430, protein: 13.0, carbs: 62.0, fat: 14.0, fibre: 5.5,
    sodium: 620, potassium: 420, iron: 3.6, zinc: 1.8, folate: 130,
    satfat: 3.0,
    magnesium: 60, sugar: 1.5, water: 195,
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
    magnesium: 20, sugar: 0.5, water: 16,
    price: 8, currency: BDT, pricedOn: ON,
    source: also(INFS, "magnesium, sugars and water"), tags: ["staple"],
  },
  {
    id: "paratha",
    en: "paratha (fried), 1 piece",
    bn: "পরোটা (তেলে ভাজা), ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 60,
    kcal: 226, protein: 4.1, carbs: 27.0, fat: 11.5, fibre: 2.6,
    sodium: 160, potassium: 105, iron: 1.5, zinc: 0.7,
    satfat: 3.5,
    magnesium: 22, sugar: 0.6, water: 18,
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
    magnesium: 6, sugar: 0.2, water: 7,
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
    magnesium: 22, sugar: 1.0, water: 106,
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
    magnesium: 3, sugar: 0.1, water: 0.6,
    price: 4, currency: BDT, pricedOn: ON,
    source: also(INFS, "magnesium, sugars and water"), tags: ["staple", "snack"],
  },
  {
    id: "chira-30g",
    en: "raw chira (flattened rice), 30 g (dry)",
    bn: "চিড়া (কাঁচা, ভেজানোর আগে), ৩০ গ্রাম",
    place: ["bd"], qty: 30, unit: "g", grams: 30,
    kcal: 105, protein: 2.1, carbs: 23.0, fat: 0.3, fibre: 1.2,
    iron: 6.2, zinc: 0.4,
    magnesium: 8, sugar: 0.2, water: 3.6,
    price: 5, currency: BDT, pricedOn: ON,
    source: also(INFS, "magnesium, sugars and water"), tags: ["staple", "snack"], raw: true,
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
    magnesium: 30, sugar: 0.8, water: 170,
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
    magnesium: 34, sugar: 0.9, water: 168,
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
    magnesium: 189, vitc: 4.8, selenium: 8.2, sugar: 6.6, water: 9.1,
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
    magnesium: 23, selenium: 27, sugar: 0.5, water: 45,
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
    magnesium: 21, selenium: 15, sugar: 0.5, water: 47,
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
    magnesium: 24, selenium: 17, sugar: 0.3, water: 34,
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
    magnesium: 30, iodine: 33, selenium: 30, sugar: 0.5, water: 52,
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
    magnesium: 25, selenium: 18, sugar: 1.5, water: 66,
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
    magnesium: 20, selenium: 14, sugar: 1.2, water: 58,
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
    magnesium: 5, selenium: 15.4, sugar: 0.6, water: 37,
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
    magnesium: 5, selenium: 15, sugar: 0.4, water: 33,
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
    magnesium: 33, zinc: 0.5, sugar: 1.5, water: 105,
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
    magnesium: 55, zinc: 0.9, sugar: 0.6, water: 85,
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
    magnesium: 80, zinc: 0.8, sugar: 0.5, water: 85,
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
    magnesium: 13, zinc: 0.2, sugar: 3.5, water: 88,
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
    magnesium: 30, zinc: 0.6, sugar: 4.0, water: 115,
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
    magnesium: 17, zinc: 0.3, sugar: 3.0, water: 128,
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
    magnesium: 17, zinc: 0.8, sugar: 1.0, water: 78,
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
    magnesium: 27, zinc: 0.2, selenium: 1.0, sugar: 12.2, water: 74.9,
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
    magnesium: 20, zinc: 0.2, selenium: 1.2, sugar: 27.3, water: 167,
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
    magnesium: 44, zinc: 0.6, selenium: 0.9, sugar: 28.6, water: 110,
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
    magnesium: 30, zinc: 0.1, selenium: 0.9, sugar: 11.3, water: 128,
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
    magnesium: 22, zinc: 0.2, selenium: 0.6, sugar: 8.9, water: 80.8,
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
    magnesium: 14, sugar: 12.0, water: 176,
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
    magnesium: 26, selenium: 9, sugar: 11.5, water: 210,
    price: 30, currency: BDT, pricedOn: ON,
    source: also(INFS, "magnesium, selenium, sugars and water"),
    tags: ["drink", "protein"],
  },
  {
    id: "milk-powder-bd",
    en: "full cream milk powder, 2 tablespoons",
    bn: "গুঁড়া দুধ (ফুল ক্রিম), ২ টেবিল চামচ",
    place: ["bd"], qty: 2, unit: "tablespoon", grams: 20,
    kcal: 100, protein: 5.2, carbs: 8.0, fat: 5.4, fibre: 0,
    sodium: 75, potassium: 250, calcium: 190, b12: 0.6, zinc: 0.7,
    satfat: 3.4,
    magnesium: 17, sugar: 7.7, water: 0.5,
    price: 20, currency: BDT, pricedOn: ON,
    /* One of §17's cheap Bangladeshi proteins, which is the
       whole reason it is a row rather than free entry. */
    source: also("Dhaka retail pack label, per 100 g", "magnesium, sugars and water"),
    tags: ["protein", "drink"],
  },
  {
    id: "mishti-roshogolla",
    en: "mishti (roshogolla), 1 piece",
    bn: "মিষ্টি (রসগোল্লা), ১টা",
    place: ["bd"], qty: 1, unit: "piece", grams: 40,
    kcal: 150, protein: 3.0, carbs: 25.0, fat: 4.5, fibre: 0,
    sodium: 40, calcium: 70, satfat: 2.8,
    magnesium: 4, sugar: 22.0, water: 12,
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
    magnesium: 12, sugar: 21.0, water: 70,
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
    magnesium: 15, sugar: 1.0, water: 22,
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
    magnesium: 12, sugar: 0.9, water: 18,
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
    magnesium: 0, sugar: 0, water: 0,
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
    magnesium: 0, sugar: 0, water: 0,
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
    magnesium: 0, sugar: 0, water: 0,
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
    magnesium: 24, selenium: 2.2, sugar: 1.0, water: 13.8,
    price: 0.09, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium, selenium and water"), tags: ["staple"],
  },
  {
    id: "bread-white-slice",
    en: "white bread, 1 medium slice",
    bn: "সাদা পাউরুটি, ১ স্লাইস",
    place: ["uk"], qty: 1, unit: "slice", grams: 36,
    kcal: 88, protein: 2.9, carbs: 17.0, fat: 0.6, fibre: 1.0,
    sodium: 160, potassium: 45, calcium: 60, iron: 0.6, folate: 20,
    magnesium: 9, zinc: 0.2, selenium: 2.2, sugar: 1.2, water: 13.4,
    price: 0.06, currency: GBP, pricedOn: ON,
    /* UK white flour is fortified with calcium and iron by law,
       which is why those two are higher here than the wholemeal
       row a reader would expect to beat it. */
    source: also(LABEL_UK, "magnesium, zinc, selenium and water"), tags: ["staple"],
  },
  {
    id: "oats-raw-40g",
    en: "raw porridge oats, 40 g (dry)",
    bn: "ওটস (কাঁচা, রান্নার আগে), ৪০ গ্রাম",
    place: ["uk"], qty: 40, unit: "g", grams: 40,
    kcal: 150, protein: 4.4, carbs: 24.0, fat: 3.2, fibre: 3.6,
    sodium: 2, potassium: 145, calcium: 21, iron: 1.6, zinc: 1.2,
    folate: 14,
    magnesium: 44, selenium: 3.2, sugar: 0.4, water: 3.3,
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
    magnesium: 66, iodine: 60, selenium: 5, sugar: 9.8, water: 230,
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
    magnesium: 46, sugar: 1.7, water: 2.5,
    price: 0.14, currency: GBP, pricedOn: ON,
    /* Fortified, which is the point of the row: the iron, folate
       and B12 here are added rather than the wheat's. */
    source: also(LABEL_UK, "magnesium and water"), tags: ["staple"],
  },
  {
    id: "pasta-dry-75g",
    en: "raw pasta, 75 g (dry, before cooking)",
    bn: "পাস্তা (কাঁচা, রান্নার আগে), ৭৫ গ্রাম",
    place: ["uk"], qty: 75, unit: "g", grams: 75,
    kcal: 265, protein: 9.2, carbs: 53.0, fat: 1.1, fibre: 2.4,
    sodium: 5, potassium: 170, iron: 1.1, zinc: 1.0, folate: 13,
    magnesium: 38, sugar: 2.4, water: 7.3,
    price: 0.11, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium and water"), tags: ["staple"], raw: true,
  },
  {
    id: "pasta-cooked-cup",
    en: "cooked pasta, 1 cup",
    bn: "পাস্তা (রান্না করা), ১ কাপ",
    place: ["uk"], qty: 1, unit: "cup", grams: 140,
    kcal: 220, protein: 8.1, carbs: 43.0, fat: 1.3, fibre: 2.5,
    sodium: 6, potassium: 60, iron: 0.9, zinc: 0.8, folate: 10,
    magnesium: 31, sugar: 2.0, water: 92,
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
    magnesium: 45, selenium: 33, sugar: 0, water: 98,
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
    magnesium: 29, selenium: 20, sugar: 0, water: 76,
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
    magnesium: 36, iodine: 11, selenium: 87, sugar: 0, water: 81,
    price: 1.00, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium, selenium and water") + `, iodine from ${MW}`,
    tags: ["protein"],
  },
  {
    id: "mackerel-tin",
    en: "tinned mackerel in tomato sauce, 1 tin",
    bn: "টিনের ম্যাকারেল মাছ (টমেটো সসে), ১ টিন",
    place: ["uk"], qty: 1, unit: "tin", grams: 125,
    kcal: 230, protein: 20.0, carbs: 3.0, fat: 15.0, fibre: 0.5,
    sodium: 480, potassium: 320, calcium: 55, iron: 1.2, vitd: 8.0,
    b12: 9.0, satfat: 3.4,
    magnesium: 35, zinc: 1.1, iodine: 25, selenium: 40, sugar: 3.0, water: 81,
    price: 1.10, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium, zinc, selenium and water") + `, iodine from ${MW}`,
    tags: ["protein"],
  },
  {
    id: "salmon-fillet-uk",
    en: "cooked salmon fillet, 1 (130 g)",
    bn: "স্যামন মাছ (রান্না করা), ১৩০ গ্রাম",
    place: ["uk"], qty: 1, unit: "piece", grams: 130,
    kcal: 260, protein: 32.0, carbs: 0, fat: 14.0, fibre: 0,
    sodium: 90, potassium: 480, calcium: 15, iron: 0.5, zinc: 0.6,
    vitd: 12.0, b12: 4.5, satfat: 2.8,
    magnesium: 38, iodine: 18, selenium: 29, sugar: 0, water: 81,
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
    magnesium: 62, selenium: 4, sugar: 11.8, water: 145,
    price: 0.35, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium, selenium and water"), tags: ["protein"],
  },
  {
    id: "egg-boiled-uk",
    en: "boiled egg, 1 medium",
    bn: "ডিম সিদ্ধ, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 50,
    kcal: 78, protein: 6.3, carbs: 0.6, fat: 5.3, fibre: 0,
    sodium: 62, potassium: 63, calcium: 25, iron: 0.6, zinc: 0.5,
    vitd: 1.1, b12: 0.56, folate: 22, satfat: 1.6,
    magnesium: 5, iodine: 26, selenium: 15.4, sugar: 0.6, water: 37,
    price: 0.28, currency: GBP, pricedOn: ON,
    source: `${USDA}; iodine from ${MW}`, tags: ["protein"],
  },
  {
    id: "egg-fried-uk",
    en: "fried egg, 1 medium",
    bn: "ডিম ভাজা, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 55,
    kcal: 120, protein: 6.5, carbs: 0.6, fat: 10.0, fibre: 0,
    sodium: 140, potassium: 65, calcium: 25, iron: 0.6, zinc: 0.5,
    vitd: 1.1, b12: 0.56, satfat: 2.3,
    magnesium: 5, iodine: 26, selenium: 15, sugar: 0.4, water: 33,
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
    magnesium: 8, iodine: 9, selenium: 3.6, sugar: 0, water: 11,
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
    magnesium: 17, iodine: 45, selenium: 3, sugar: 6.0, water: 128,
    price: 0.50, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium, selenium and water") + `, iodine from ${MW}`,
    tags: ["protein"],
  },
  {
    id: "milk-semi-skimmed-cup",
    en: "semi-skimmed milk, 1 cup",
    bn: "আধা-ননিতোলা দুধ, ১ কাপ",
    place: ["uk"], qty: 1, unit: "cup", grams: 250,
    kcal: 123, protein: 8.7, carbs: 12.4, fat: 4.3, fibre: 0,
    sodium: 110, potassium: 400, calcium: 300, b12: 2.3, zinc: 1.0,
    satfat: 2.7,
    magnesium: 28, iodine: 75, selenium: 3, sugar: 11.8, water: 225,
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
    sugar: 5.0,
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
    magnesium: 34, sugar: 3.4, water: 528,
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
    magnesium: 18, sugar: 8.5, water: 205,
    price: 3.30, currency: GBP, pricedOn: ON,
    source: also("UK coffee chain label, whole milk", "magnesium, sugars and water"),
    tags: ["drink"],
  },
  {
    id: "olive-oil-tbsp",
    en: "olive oil, 1 tablespoon",
    bn: "অলিভ অয়েল, ১ টেবিল চামচ",
    place: ["uk"], qty: 1, unit: "tablespoon", grams: 13.5,
    kcal: 119, protein: 0, carbs: 0, fat: 13.5, fibre: 0,
    satfat: 1.9,
    magnesium: 0, sugar: 0, water: 0,
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
    magnesium: 25, selenium: 0.7, sugar: 1.5, water: 0.3,
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
    magnesium: 10, zinc: 0.4, selenium: 0.8, sugar: 1.0, water: 73,
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
    magnesium: 48, zinc: 0.6, selenium: 2, sugar: 1.8, water: 125,
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
    magnesium: 38, zinc: 0.5, sugar: 0.8, water: 90,
    price: 0.45, currency: GBP, pricedOn: ON,
    source: also(LABEL_UK, "magnesium, zinc and water"), tags: ["staple", "snack"],
  },
  {
    id: "apple-uk",
    en: "apple, 1 medium",
    bn: "আপেল, ১টা মাঝারি",
    place: ["uk"], qty: 1, unit: "piece", grams: 150,
    kcal: 78, protein: 0.4, carbs: 20.0, fat: 0.2, fibre: 3.6,
    sodium: 2, potassium: 160, calcium: 9, vitc: 7, folate: 5,
    magnesium: 8, zinc: 0.1, selenium: 0, sugar: 15.6, water: 128,
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
    magnesium: 27, zinc: 0.2, selenium: 1.0, sugar: 12.2, water: 74.9,
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
  "sodium", "potassium", "magnesium", "calcium", "iron", "zinc",
  "iodine", "selenium", "vitc", "vitd", "b12", "folate",
  "satfat", "sugar", "water",
] as const satisfies readonly (keyof Portion)[];

export type CoverageKey = (typeof COVERAGE_KEYS)[number];

/* ------------------------------------------------------------
   What is watched, what to aim for, and whose figure that is
   ------------------------------------------------------------ */

/** Which shelf a nutrient sits on, so nineteen figures can be
    found rather than scanned. A wall of nineteen is worse than
    a wall of five: the reader came for ONE of them. */
export type NutrientGroup = "macro" | "mineral" | "vitamin" | "other";

export const NUTRIENT_GROUPS: Array<{ id: NutrientGroup; en: string; bn: string }> = [
  { id: "macro", en: "The macros", bn: "বড় পুষ্টি" },
  { id: "mineral", en: "Minerals", bn: "খনিজ" },
  { id: "vitamin", en: "Vitamins", bn: "ভিটামিন" },
  { id: "other", en: "Water", bn: "পানি" },
];

/** One nutrient the panel draws, with the range to aim for and
    whose range it is.

    A RANGE WITH NO POPULATION ON IT IS A RANGE A READER CANNOT
    ARGUE WITH, and several of these differ between the UK, the
    WHO and the US by more than a rounding: vitamin C is 40 mg
    in one and 90 in another for the same adult. So `refEn` and
    `refBn` say whose figure it is, and where the panels
    genuinely disagree the copy says so rather than picking a
    side quietly. */
export interface Nutrient {
  /** A `COVERAGE_KEYS` name, or one of the four macros a
      `DayTotal` totals at the top level. */
  key: string;
  group: NutrientGroup;
  /** Where the figure is in a day's total. A macro is a
      top-level number and everything else is in `micros`;
      `water` is BOTH, because the glasses are logged and the
      water in the food is estimated. */
  reads: "total" | "micros" | "both";
  /** Both languages, because a Bangla figure carrying an
      English unit is a figure said in one language. */
  unit: string;
  unitBn: string;
  /** BOTH ENDS ARE OPTIONAL ON PURPOSE. `low` alone is a floor,
      `high` alone is a ceiling, and NEITHER is a nutrient with
      no single right amount: carbohydrate and fat are chosen
      rather than prescribed, and printing a range for them
      would tell a reader on keto they were failing at
      something they had decided to do. */
  low?: number;
  high?: number;
  en: string;
  bn: string;
  /** Why this reader is being shown it, in one sentence. */
  whyEn: string;
  whyBn: string;
  /** Whose reference intake the range is. */
  refEn: string;
  refBn: string;
}

/**
 * The nineteen, in the order they are drawn.
 *
 * Ordered inside each group by what actually goes wrong for
 * this tool's two readerships rather than alphabetically or by
 * how much of it a body holds. Iron leads the minerals because
 * anaemia among women in Bangladesh is the largest single
 * nutrition problem this tool's reader is likely to have; the
 * keto three follow together because `DIET.md` §7 names them
 * together and a reader who has just started keto is looking
 * for all three at once.
 *
 * Carbohydrate and fat come last among the macros and carry no
 * range, which is the honest shape: they are the split the
 * reader chose.
 */
export const NUTRIENTS: Nutrient[] = [
  /* ---- the macros ---- */
  {
    key: "protein", group: "macro", reads: "total", unit: "g", unitBn: "গ্রাম",
    low: 50, high: 110, en: "Protein", bn: "প্রোটিন",
    whyEn: "In a deficit this is what decides whether the weight coming off is fat or muscle, and it is worth spreading across the day rather than putting most of it at dinner.",
    whyBn: "ঘাটতির সময় এটাই ঠিক করে যে যে ওজন কমছে তা চর্বি না পেশি, আর দিনভর ভাগ করে খাওয়াই ভালো, রাতের খাবারে বেশিরভাগটা নয়।",
    refEn: "50 g is the reference on a UK label for an average adult. In a deficit this tool asks for more and works your own floor out from your weight.",
    refBn: "যুক্তরাজ্যের মোড়কে গড় প্রাপ্তবয়স্কের জন্য ৫০ গ্রাম লেখা থাকে। ঘাটতিতে এই টুল আরও বেশি চায়, আর আপনার ওজন থেকে আপনার নিজের তলাটা হিসাব করে।",
  },
  {
    key: "fibre", group: "macro", reads: "total", unit: "g", unitBn: "গ্রাম",
    low: 25, high: 30, en: "Fibre", bn: "আঁশ",
    whyEn: "Low on almost every deficit and very low on keto, and it is the single thing most likely to make somebody feel unwell without knowing why.",
    whyBn: "প্রায় প্রতিটি ঘাটতিতেই কম, আর কিটোতে খুবই কম, আর কারণ না বুঝেই খারাপ লাগার পেছনে সবচেয়ে বড় কারণ এটাই।",
    refEn: "The UK's SACN asks adults for 30 g a day, and the UK average is about twenty.",
    refBn: "যুক্তরাজ্যের SACN প্রাপ্তবয়স্কদের দিনে ৩০ গ্রাম চায়, আর সেখানকার গড় প্রায় বিশ।",
  },
  {
    key: "satfat", group: "macro", reads: "micros", unit: "g", unitBn: "গ্রাম",
    high: 20, en: "Saturated fat", bn: "স্যাচুরেটেড চর্বি",
    whyEn: "Keto raises this for most people who try it, and what that then does to a blood test varies enormously between individuals. This tool takes no side: it counts the grams, shows the share of your total fat, and puts a lipid panel on the health page so the answer for you can be a measurement rather than an argument on the internet.",
    whyBn: "যারা কিটো করেন তাদের বেশিরভাগের এটা বাড়ে, আর তাতে রক্তের পরীক্ষায় কী হয় সেটা একেকজনের একেক রকম। এই টুল কোনো পক্ষ নেয় না: গ্রাম গোনে, মোট চর্বির কত ভাগ সেটা দেখায়, আর স্বাস্থ্য পাতায় রক্তের চর্বির পরীক্ষা রাখে, যাতে আপনার উত্তরটা ইন্টারনেটের তর্ক নয়, একটা মাপ হয়।",
    refEn: "The UK's label reference is 20 g for an average adult, and SACN asks for under a tenth of the day's energy, which comes to about the same number.",
    refBn: "যুক্তরাজ্যের মোড়কে গড় প্রাপ্তবয়স্কের জন্য ২০ গ্রাম, আর SACN চায় দিনের শক্তির দশ ভাগের কম, যা প্রায় একই সংখ্যা।",
  },
  {
    key: "sugar", group: "macro", reads: "micros", unit: "g", unitBn: "গ্রাম",
    high: 90, en: "Sugars", bn: "চিনি",
    whyEn: "This is TOTAL sugars, so it counts the sugar in fruit and in milk along with the two spoons in the tea. The UK's advice to stay under 30 g is about free sugars only, and no food table can separate the two, so the figure here is not the one that advice is about.",
    whyBn: "এটা মোট চিনি, তাই ফলের আর দুধের চিনিও এখানে গোনা হয়, চায়ের দুই চামচের সঙ্গে। যুক্তরাজ্যে ৩০ গ্রামের নিচে থাকার যে পরামর্শ, সেটা শুধু আলাদা করে মেশানো চিনির কথা, আর কোনো খাদ্যতালিকা দুটোকে আলাদা করতে পারে না, তাই এই সংখ্যাটা সেই পরামর্শের সংখ্যা নয়।",
    refEn: "90 g is the UK label reference for total sugars for an average adult. The 30 g free-sugar limit is a different quantity and this cannot measure it.",
    refBn: "গড় প্রাপ্তবয়স্কের জন্য যুক্তরাজ্যের মোড়কে মোট চিনির হিসাব ৯০ গ্রাম। আলাদা চিনির ৩০ গ্রামের সীমাটা অন্য জিনিস, আর এটা সেটা মাপতে পারে না।",
  },
  {
    key: "carbs", group: "macro", reads: "total", unit: "g", unitBn: "গ্রাম",
    en: "Carbohydrate", bn: "শর্করা",
    whyEn: "The one figure here with no range, because it is the one you choose: a mixed day runs at 225 to 300 g and a keto day sits under 50 g on purpose, and neither of those is a shortfall. Take the fibre off it and what is left is what your body can actually break down.",
    whyBn: "এখানে একমাত্র সংখ্যা যার কোনো সীমা নেই, কারণ এটা আপনি নিজে বেছে নেন: সাধারণ খাবারে দিনে ২২৫ থেকে ৩০০ গ্রাম, আর কিটোতে ইচ্ছে করেই ৫০ গ্রামের নিচে, আর এর কোনোটাই ঘাটতি নয়। আঁশটা বাদ দিলে যা থাকে সেটাই শরীর ভাঙতে পারে।",
    refEn: "No single reference, on purpose. A UK label uses 260 g for an average adult; a keto day is meant to be a fifth of that.",
    refBn: "ইচ্ছে করেই একটাও নির্দিষ্ট হিসাব নেই। যুক্তরাজ্যের মোড়কে গড় প্রাপ্তবয়স্কের জন্য ২৬০ গ্রাম; কিটোর দিন তার পাঁচ ভাগের এক ভাগ হওয়ার কথা।",
  },
  {
    key: "fat", group: "macro", reads: "total", unit: "g", unitBn: "গ্রাম",
    en: "Fat", bn: "চর্বি",
    whyEn: "Chosen rather than prescribed, like the carbohydrate above it. What is worth reading is the split: how much of this is the saturated fat two lines up.",
    whyBn: "উপরের শর্করার মতোই, এটাও নিজের বেছে নেওয়া। পড়ার মতো জিনিসটা হলো ভাগটা: এর কতটুকু দুই লাইন উপরের স্যাচুরেটেড চর্বি।",
    refEn: "No single reference. A UK label uses 70 g for an average adult, and a very low carbohydrate day sits well above that by design.",
    refBn: "কোনো নির্দিষ্ট হিসাব নেই। যুক্তরাজ্যের মোড়কে গড় প্রাপ্তবয়স্কের জন্য ৭০ গ্রাম, আর খুব কম শর্করার দিন ইচ্ছে করেই তার অনেক উপরে থাকে।",
  },

  /* ---- the minerals ---- */
  {
    key: "iron", group: "mineral", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 8, high: 18, en: "Iron", bn: "আয়রন",
    whyEn: "Anaemia is common among women in Bangladesh, and a deficit with less red meat in it makes that worse. Vitamin C at the same meal roughly doubles what gets absorbed from plants; tea with the meal works the other way.",
    whyBn: "বাংলাদেশে নারীদের মধ্যে রক্তস্বল্পতা সাধারণ, আর কম লাল মাংসসহ ঘাটতি সেটা বাড়ায়। একই বেলায় ভিটামিন সি থাকলে উদ্ভিদ থেকে শোষণ প্রায় দ্বিগুণ হয়; খাবারের সঙ্গে চা উল্টোটা করে।",
    refEn: "The UK RNI is 8.7 mg for men and for women past the menopause, and 14.8 mg for women who are menstruating. The US sets 8 and 18.",
    refBn: "যুক্তরাজ্যের হিসাব পুরুষ ও মাসিক বন্ধ হওয়া নারীর জন্য ৮.৭ মিলিগ্রাম, আর মাসিক হয় এমন নারীর জন্য ১৪.৮। যুক্তরাষ্ট্র বলে ৮ ও ১৮।",
  },
  {
    key: "sodium", group: "mineral", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 1500, high: 2300, en: "Sodium", bn: "সোডিয়াম",
    whyEn: "The one a very low carb diet strips fastest, and the one a Bangladeshi diet is most likely to be high in already. Cutting it also cuts the iodine, because iodised salt is where nearly all of that comes from.",
    whyBn: "খুব কম শর্করার খাবারে এটাই সবচেয়ে দ্রুত কমে, আবার বাংলাদেশি খাবারে এটাই বেশি থাকার সম্ভাবনা সবচেয়ে বেশি। এটা কমালে আয়োডিনও কমে, কারণ আয়োডিনের প্রায় পুরোটাই আসে আয়োডিনযুক্ত লবণ থেকে।",
    refEn: "1,500 mg is about what a body needs. The WHO asks adults to stay under 2,000, which is 5 g of salt; the UK's 6 g of salt is 2,400.",
    refBn: "শরীরের দরকার প্রায় ১,৫০০ মিলিগ্রাম। বিশ্ব স্বাস্থ্য সংস্থা বলে ২,০০০-এর নিচে থাকতে, যা ৫ গ্রাম লবণ; যুক্তরাজ্যের ৬ গ্রাম লবণ মানে ২,৪০০।",
  },
  {
    key: "potassium", group: "mineral", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 3000, high: 4000, en: "Potassium", bn: "পটাশিয়াম",
    whyEn: "One of the keto three, and one of the first to go when carbohydrate does. Dal, potato, banana and green leaves are where most of a day's worth is.",
    whyBn: "কিটোর তিনটির একটি, আর শর্করা কমলে সবার আগে যেগুলো কমে তার একটি। ডাল, আলু, কলা আর শাকপাতায় দিনের বেশিরভাগটা থাকে।",
    refEn: "The UK RNI is 3,500 mg for adults and the WHO asks for at least 3,510.",
    refBn: "যুক্তরাজ্যের হিসাব প্রাপ্তবয়স্কের জন্য ৩,৫০০ মিলিগ্রাম, আর বিশ্ব স্বাস্থ্য সংস্থা চায় অন্তত ৩,৫১০।",
  },
  {
    key: "magnesium", group: "mineral", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 270, high: 300, en: "Magnesium", bn: "ম্যাগনেসিয়াম",
    whyEn: "The third of the keto three, and the one behind cramp at night in the second week. A day built on polished rice carries much less of it than the same calories out of dal, whole wheat and green leaves.",
    whyBn: "কিটোর তিনটির তৃতীয়টি, আর দ্বিতীয় সপ্তাহে রাতে পায়ে টান ধরার পেছনে সাধারণত এটাই। সাদা চালের ভাতে গড়া দিনে এটা অনেক কম থাকে, একই ক্যালোরি ডাল, আটা আর শাক থেকে এলে যতটা থাকত তার তুলনায়।",
    refEn: "The UK RNI is 270 mg for women and 300 mg for men. The US sets it higher, at 310 and 400, and that gap is a real disagreement about how much a body holds on to.",
    refBn: "যুক্তরাজ্যের হিসাব নারীর জন্য ২৭০ মিলিগ্রাম, পুরুষের জন্য ৩০০। যুক্তরাষ্ট্র আরও বেশি বলে, ৩১০ আর ৪০০, আর এই ফারাকটা সত্যিকারের মতভেদ।",
  },
  {
    key: "calcium", group: "mineral", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 700, high: 1000, en: "Calcium", bn: "ক্যালসিয়াম",
    whyEn: "Worth watching on any restricted diet, and it travels with vitamin D. Small fish eaten with the bones is the cheapest source there is in Bangladesh, and it beats a glass of milk.",
    whyBn: "যেকোনো সীমিত খাবারে খেয়াল রাখার মতো, আর এটা ভিটামিন ডির সঙ্গে চলে। কাঁটাসহ ছোট মাছ বাংলাদেশে সবচেয়ে সস্তা উৎস, আর এক গ্লাস দুধের চেয়েও ভালো।",
    refEn: "The UK RNI is 700 mg for adults. The WHO and the US both set 1,000, and the gap between them is disagreement rather than rounding.",
    refBn: "যুক্তরাজ্যের হিসাব প্রাপ্তবয়স্কের জন্য ৭০০ মিলিগ্রাম। বিশ্ব স্বাস্থ্য সংস্থা আর যুক্তরাষ্ট্র দুটোই বলে ১,০০০, আর এই ফারাকটা মতভেদ, হিসাবের গোলমাল নয়।",
  },
  {
    key: "zinc", group: "mineral", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 7, high: 11, en: "Zinc", bn: "জিঙ্ক",
    whyEn: "It falls on almost any restricted diet, and a day of rice and dal gives up less of it than the number suggests: the phytate in grains and pulses binds zinc and cuts how much of it gets in. Soaking, sprouting and fermenting all work against that, which is part of why panta bhat is not only rice.",
    whyBn: "প্রায় যেকোনো সীমিত খাবারেই কমে, আর ভাত-ডালের দিনে সংখ্যাটা যা বলে তার চেয়ে কম শরীরে ঢোকে: শস্য আর ডালের ফাইটেট জিঙ্ক আটকে রাখে। ভেজানো, অঙ্কুরিত করা আর গাঁজানো এর উল্টোটা করে, আর পান্তা ভাত শুধু ভাত নয় তার একটা কারণ এটাই।",
    refEn: "The UK RNI is 7 mg for women and 9.5 mg for men; the US sets 8 and 11. On a mostly plant diet the WHO advises aiming above either.",
    refBn: "যুক্তরাজ্যের হিসাব নারীর জন্য ৭ মিলিগ্রাম, পুরুষের জন্য ৯.৫; যুক্তরাষ্ট্র বলে ৮ আর ১১। বেশিরভাগ উদ্ভিদের খাবারে বিশ্ব স্বাস্থ্য সংস্থা দুটোর চেয়েও বেশি লক্ষ্য রাখতে বলে।",
  },
  {
    key: "iodine", group: "mineral", reads: "micros", unit: "µg", unitBn: "মাইক্রোগ্রাম",
    low: 140, high: 150, en: "Iodine", bn: "আয়োডিন",
    whyEn: "In Bangladesh the salt is where nearly all of it comes from, so bringing sodium down can quietly take the iodine with it. This is the thinnest data in the whole list: eleven of the eighty-three portions in this library carry a figure and the rest honestly do not.",
    whyBn: "বাংলাদেশে এর প্রায় পুরোটাই আসে লবণ থেকে, তাই সোডিয়াম কমাতে গেলে আয়োডিনও চুপচাপ কমে যায়। এই তালিকার সবচেয়ে দুর্বল তথ্য এটাই: এখানকার তিরাশিটা খাবারের এগারোটায় সংখ্যা আছে, বাকিগুলোয় সত্যিই নেই।",
    refEn: "The UK RNI is 140 µg for adults and the WHO asks for 150. A teaspoon of salt at Bangladesh's own standard carries about 120 before cooking.",
    refBn: "যুক্তরাজ্যের হিসাব প্রাপ্তবয়স্কের জন্য ১৪০ মাইক্রোগ্রাম, বিশ্ব স্বাস্থ্য সংস্থা চায় ১৫০। বাংলাদেশের নিজের মান অনুযায়ী এক চা চামচ লবণে রান্নার আগে প্রায় ১২০ থাকে।",
  },
  {
    key: "selenium", group: "mineral", reads: "micros", unit: "µg", unitBn: "মাইক্রোগ্রাম",
    low: 55, high: 75, en: "Selenium", bn: "সেলেনিয়াম",
    whyEn: "It is taken up from the soil rather than made by the plant, and Bangladesh's soils are low in it where North America's are high, so an American figure for rice or dal would be wrong by a multiple rather than by a rounding. The grain, pulse and vegetable rows here are left blank for that reason instead of being filled in from another country's ground.",
    whyBn: "গাছ এটা বানায় না, মাটি থেকে নেয়, আর বাংলাদেশের মাটিতে এটা কম যেখানে উত্তর আমেরিকার মাটিতে বেশি, তাই ভাত বা ডালের জন্য আমেরিকার সংখ্যা কয়েক গুণ ভুল হতো। সেই কারণেই এখানকার শস্য, ডাল আর সবজির ঘরগুলো খালি রাখা হয়েছে, অন্য দেশের মাটি থেকে ভরা হয়নি।",
    refEn: "The UK RNI is 60 µg for women and 75 µg for men. The US sets 55 for both.",
    refBn: "যুক্তরাজ্যের হিসাব নারীর জন্য ৬০ মাইক্রোগ্রাম, পুরুষের জন্য ৭৫। যুক্তরাষ্ট্র দুজনের জন্যই বলে ৫৫।",
  },

  /* ---- the vitamins ---- */
  {
    key: "vitd", group: "vitamin", reads: "micros", unit: "µg", unitBn: "মাইক্রোগ্রাম",
    low: 10, en: "Vitamin D", bn: "ভিটামিন ডি",
    whyEn: "From October to March there is not enough sun in the UK to make any, and the NHS advises everybody to take 10 µg a day through those months. In Bangladesh the sun is not the problem: indoor work and covering clothing can be, and being short of it is common there too.",
    whyBn: "অক্টোবর থেকে মার্চ পর্যন্ত যুক্তরাজ্যে এটা বানানোর মতো রোদ থাকে না, আর NHS ওই মাসগুলোয় সবাইকে দিনে ১০ মাইক্রোগ্রাম খেতে বলে। বাংলাদেশে রোদ সমস্যা নয়: ঘরের ভেতরের কাজ আর ঢাকা পোশাক হতে পারে, আর সেখানেও এর ঘাটতি সাধারণ।",
    refEn: "The UK asks everybody for 10 µg a day. Food alone rarely reaches it: oily fish, egg yolk and fortified spreads are most of what there is.",
    refBn: "যুক্তরাজ্য সবার জন্যই দিনে ১০ মাইক্রোগ্রাম চায়। শুধু খাবার থেকে সেটা কমই হয়: তৈলাক্ত মাছ, ডিমের কুসুম আর ভিটামিন মেশানো খাবারই যা আছে।",
  },
  {
    key: "b12", group: "vitamin", reads: "micros", unit: "µg", unitBn: "মাইক্রোগ্রাম",
    low: 1.5, high: 2.4, en: "Vitamin B12", bn: "ভিটামিন বি১২",
    whyEn: "There is none at all in any plant food, so a vegetarian day gets it from milk, yoghurt and egg and a vegan day gets it from fortified food or a tablet or from nowhere. The liver holds years of it, which is why running short is usually found late.",
    whyBn: "কোনো উদ্ভিদের খাবারে এটা একদমই নেই, তাই নিরামিষের দিনে এটা আসে দুধ, দই আর ডিম থেকে, আর ভেগানের দিনে ভিটামিন মেশানো খাবার বা বড়ি থেকে, নয়তো কোথাও থেকেই না। লিভারে কয়েক বছরের মজুত থাকে, তাই ঘাটতি সাধারণত দেরিতে ধরা পড়ে।",
    refEn: "The UK RNI is 1.5 µg and the US sets 2.4. Europe's panel says 4. That spread is a real disagreement about how much of it is absorbed.",
    refBn: "যুক্তরাজ্যের হিসাব ১.৫ মাইক্রোগ্রাম, যুক্তরাষ্ট্র বলে ২.৪, ইউরোপ বলে ৪। এই ফারাকটা সত্যিকারের মতভেদ, কতটুকু শরীরে ঢোকে তা নিয়ে।",
  },
  {
    key: "folate", group: "vitamin", reads: "micros", unit: "µg", unitBn: "মাইক্রোগ্রাম",
    low: 200, high: 400, en: "Folate", bn: "ফোলেট",
    whyEn: "It falls on restricted diets, and it is the one here that has to be met BEFORE it matters: anybody who might become pregnant is advised 400 µg a day well in advance, because what it prevents happens in the first few weeks. Dal, shak and green leaves are the everyday sources.",
    whyBn: "সীমিত খাবারে এটা কমে, আর এই তালিকায় একমাত্র এটাই দরকার পড়ার আগেই পূরণ করতে হয়: যাদের গর্ভধারণের সম্ভাবনা আছে তাদের অনেক আগে থেকেই দিনে ৪০০ মাইক্রোগ্রাম নিতে বলা হয়, কারণ এটা যা ঠেকায় তা প্রথম কয়েক সপ্তাহেই ঘটে। ডাল, শাক আর সবুজ পাতা রোজকার উৎস।",
    refEn: "The UK RNI is 200 µg for adults; the WHO and the US ask 400, and 400 as a supplement for anybody who might become pregnant.",
    refBn: "যুক্তরাজ্যের হিসাব প্রাপ্তবয়স্কের জন্য ২০০ মাইক্রোগ্রাম; বিশ্ব স্বাস্থ্য সংস্থা আর যুক্তরাষ্ট্র চায় ৪০০, আর গর্ভধারণের সম্ভাবনা থাকলে বড়ি হিসেবে ৪০০।",
  },
  {
    key: "vitc", group: "vitamin", reads: "micros", unit: "mg", unitBn: "মিলিগ্রাম",
    low: 40, high: 90, en: "Vitamin C", bn: "ভিটামিন সি",
    whyEn: "Here as much for the iron as for itself: the iron in dal, shak and rice is the kind a body absorbs badly, and vitamin C at the same meal roughly doubles what gets in. A guava or a squeeze of lemon on the plate is worth more than a tablet between meals.",
    whyBn: "নিজের জন্য যতটা, আয়রনের জন্যও ততটাই এখানে: ডাল, শাক আর ভাতের আয়রন শরীর ভালো শোষণ করতে পারে না, আর একই বেলায় ভিটামিন সি থাকলে শোষণ প্রায় দ্বিগুণ হয়। প্লেটে একটা পেয়ারা বা একটু লেবু, দুই বেলার মাঝে একটা বড়ির চেয়ে বেশি কাজে দেয়।",
    refEn: "The UK RNI is 40 mg, the WHO 45, and the US 75 for women and 90 for men. It is the widest disagreement in this table.",
    refBn: "যুক্তরাজ্যের হিসাব ৪০ মিলিগ্রাম, বিশ্ব স্বাস্থ্য সংস্থার ৪৫, আর যুক্তরাষ্ট্রের নারীর জন্য ৭৫, পুরুষের জন্য ৯০। এই তালিকার সবচেয়ে বড় মতভেদ এটাই।",
  },

  /* ---- and the one that is drunk ---- */
  {
    key: "water", group: "other", reads: "both", unit: "ml", unitBn: "মিলিলিটার",
    low: 2000, high: 2500, en: "Water", bn: "পানি",
    whyEn: "This counts the glasses you tapped AND the water in what you ate, which is a fifth to a third of most days: a figure drawn from the glasses alone is wrong by that much every day. Tea and coffee count, and so does a pint, which is more generous than your kidneys are. On a very low carbohydrate day you need more of it, and more salt with it.",
    whyBn: "এখানে আপনার লেখা গ্লাসের সঙ্গে খাবারের ভেতরের পানিও গোনা হয়, যা বেশিরভাগ দিনের পাঁচ ভাগের এক থেকে তিন ভাগের এক: শুধু গ্লাস গুনলে হিসাবটা রোজ ততটাই কম হয়। চা আর কফি গোনা হয়, বিয়ারও, যেটা আপনার কিডনির চেয়ে উদার হিসাব। খুব কম শর্করার দিনে এর দরকার বাড়ে, আর সঙ্গে লবণেরও।",
    refEn: "Europe's EFSA puts total water at about 2 litres a day for women and 2.5 for men, from drinks and food together, in a temperate climate. Dhaka in June is not a temperate climate.",
    refBn: "ইউরোপের EFSA বলে মোট পানি দিনে নারীর জন্য প্রায় ২ লিটার, পুরুষের জন্য ২.৫, পানীয় আর খাবার মিলিয়ে, নাতিশীতোষ্ণ আবহাওয়ায়। জুন মাসের ঢাকা নাতিশীতোষ্ণ নয়।",
  },
];

/** By key, because the panel draws them in group order and a
    scan of nineteen per figure is a scan per figure. */
const BY_KEY: Map<string, Nutrient> = new Map(NUTRIENTS.map((n) => [n.key, n]));

export const nutrient = (key: string): Nutrient | undefined => BY_KEY.get(key);

/* ------------------------------------------------------------
   Where the reader eats, said once
   ------------------------------------------------------------ */

/** The place a caller assumes when nobody has said.

    ONE constant because three callers with three defaults is
    three different libraries leading for one reader: the Worker
    ranked Bangladesh first while the picker and the price table
    asked for the UK, so a reader in Dhaka typing "dal" waited on
    a British list. `bd` because this site's reader is in
    Bangladesh unless they say otherwise. */
export const DEFAULT_PLACE: Place = "bd";

/* ------------------------------------------------------------
   A barcode is digits, said once
   ------------------------------------------------------------ */

/** The digits of a barcode, or nothing. EAN-8, UPC-A, EAN-13,
    GTIN-14, with spaces and hyphens taken off first because that
    is how a number read off a packet gets typed.

    Here rather than in the Worker's `_lib/food.ts` because the
    browser has to decide the same thing before it asks, and a
    browser module may not import that file at all: it writes out
    both upstream hostnames and `check-csp.ts` scans every string
    under `next/`. */
export const barcodeOf = (typed: string): string | undefined => {
  const digits = typed.replace(/[\s-]/g, "");
  return /^\d{8,14}$/.test(digits) ? digits : undefined;
};

export const isBarcode = (typed: string): boolean => barcodeOf(typed) !== undefined;

/* ------------------------------------------------------------
   Saying a portion out loud
   ------------------------------------------------------------ */

export interface UnitWord {
  en: string;
  /** The English plural, written out rather than derived,
      because deriving it gives "2 gs". */
  ens: string;
  bn: string;
  /** Bangla counts with the numeral attached: `২টা`, never
      `২ টা`. */
  tight?: true;
}

/** Every unit any row here is measured in, in both languages.

    A unit is half of what a figure is FOR, so a portion a Bangla
    reader is shown an English word inside is a portion said in
    one language. `food.test.ts` fails on a unit in `FOODS` with
    no entry here, which is what stops a new row quietly
    introducing one. */
export const UNIT_WORDS: Record<string, UnitWord> = {
  biscuit: { en: "biscuit", ens: "biscuits", bn: "টা", tight: true },
  bowl: { en: "bowl", ens: "bowls", bn: "বাটি" },
  cup: { en: "cup", ens: "cups", bn: "কাপ" },
  g: { en: "g", ens: "g", bn: "গ্রাম" },
  meal: { en: "meal", ens: "meals", bn: "বেলা" },
  pack: { en: "pack", ens: "packs", bn: "প্যাকেট" },
  piece: { en: "piece", ens: "pieces", bn: "টা", tight: true },
  pint: { en: "pint", ens: "pints", bn: "পাইন্ট" },
  plate: { en: "plate", ens: "plates", bn: "প্লেট" },
  portion: { en: "portion", ens: "portions", bn: "ভাগ" },
  pot: { en: "pot", ens: "pots", bn: "পট" },
  slice: { en: "slice", ens: "slices", bn: "স্লাইস" },
  tablespoon: { en: "tablespoon", ens: "tablespoons", bn: "টেবিল চামচ" },
  teaspoon: { en: "teaspoon", ens: "teaspoons", bn: "চা চামচ" },
  tin: { en: "tin", ens: "tins", bn: "টিন" },
};

/**
 * The portion a figure is for: "2 biscuits", "২টা".
 *
 * `qty` arrives in the language's own numerals already, so this
 * stays free of `bnNum` and of every other digit conversion.
 *
 * An unknown unit falls back to the token itself, because a
 * portion reading "1 sachet" is readable and one reading "1" is
 * a number with nothing under it. The fallback is for a row out
 * of a public database rather than for this library: a unit here
 * with no word fails the test.
 */
export function portionWords(
  qty: number | string, unit: string, lang: "en" | "bn",
): string {
  const word = UNIT_WORDS[unit];
  if (!word) return `${qty} ${unit}`;
  if (lang === "bn") return `${qty}${word.tight ? "" : " "}${word.bn}`;
  return `${qty} ${Number(qty) === 1 ? word.en : word.ens}`;
}

/* ------------------------------------------------------------
   What was actually eaten, which is never what was found
   ------------------------------------------------------------ */

/** Rounded on the way out: a float artefact on a page
    ("0.21000000000000002 g") makes a tool look broken. */
const round = (value: number, places: number): number => {
  const scale = 10 ** places;
  return Math.round(value * scale) / scale;
};

/** The nutrients a row states, and the portion it states them
    for. A `Portion` above satisfies this and so does a hit out
    of either public database, which is the point: the
    arithmetic below has one input shape and cannot be given a
    per-100 g row and a per-cup row to add up. */
export interface Stated extends Partial<Record<CoverageKey, number>> {
  qty: number;
  unit: string;
  grams?: number;
  kcal: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fibre?: number;
}

/** How much of it went in: a number, in the row's own unit or in
    grams. */
export interface Ate {
  n: number;
  unit: string;
}

export interface ScaledPortion {
  kcal: number;
  /** Only the macros the row states. An absent one is absent
      here too, and a zero somebody measured is kept, because
      presence is the question and a zero is a figure. */
  macros: Record<string, number>;
  /** The §15 coverage list, and only the keys the row carries.
      `totalFor()` counts an entry with ANY key here as covered,
      so a key invented with a nought in it buys the day coverage
      the log does not have. */
  micros: Record<string, number>;
  /** What the row's own portion was multiplied by. */
  factor: number;
  /** What that weighs, where the row says what its portion
      weighs. */
  grams?: number;
}

/** The four a `DayTotal` holds at the top level, and the ones
    `scaleTo` puts in `macros` rather than in `micros`.

    EXPORTED because it is a vocabulary and the Android app has
    to split a scaled row the same way this file does. It reached
    the phone by being derived from `NUTRIENTS`, which was right
    on the day it was written and would part company the moment a
    fifth `reads: "total"` row arrived: this file would go on
    scaling four and the app would scale five. `/api/foods` sends
    it, so there is one list. */
export const MACRO_KEYS = ["protein", "carbs", "fat", "fibre"] as const;

/**
 * The row at the amount that was actually eaten, or `null`.
 *
 * NULL IS A REFUSAL AND IT IS THE POINT. A log wrong in the
 * flattering direction is the failure this tool is built around,
 * and a found food is stated per 100 g or per cup with no idea
 * what was on the plate. So an amount that cannot be turned into
 * a factor honestly (not a positive number, or grams asked of a
 * row that never says what it weighs) logs NOTHING, rather than
 * logging the row's own portion and hoping.
 *
 * EVERY nutrient is scaled by the one factor. Scaling the
 * calories alone is how a log ends up with a day of 2,400 kcal
 * and 40 g of protein in it.
 */
export function scaleTo(row: Stated, ate: Ate): ScaledPortion | null {
  const n = round(ate.n, 2);
  if (!Number.isFinite(n) || n <= 0) return null;

  /* The basis is what the row's figures are FOR: its own `qty`
     where the reader answered in its own unit, and its weight
     where they answered in grams. A row with no weight cannot
     answer a question in grams, and inventing one is the error
     this returns null for. */
  const basis = ate.unit === row.unit ? row.qty
    : ate.unit === "g" ? row.grams
      : undefined;
  if (basis === undefined || !(basis > 0)) return null;

  const factor = n / basis;
  const at = (value: number | undefined): number | undefined =>
    (value === undefined ? undefined : round(value * factor, 2));

  const macros: Record<string, number> = {};
  for (const key of MACRO_KEYS) {
    const value = at(row[key]);
    if (value !== undefined) macros[key] = value;
  }

  const micros: Record<string, number> = {};
  for (const key of COVERAGE_KEYS) {
    const value = at(row[key]);
    if (value !== undefined) micros[key] = value;
  }

  return {
    /* One decimal, which is what `diet_entries.kcal` holds. A
       figure the column would round is a row saying one thing
       and storing another. */
    kcal: round(row.kcal * factor, 1),
    macros,
    micros,
    factor,
    grams: row.grams === undefined ? undefined : round(row.grams * factor, 1),
  };
}

/** A food from any of the three sources, ready to be copied into
    a log row.

    `en` and `bn` are the row's name in each language, and a
    source that has only one of them sets `en` and leaves `bn`
    off: an English database is not a translation waiting to
    happen. Deliberately NOT called `source`, because a
    `Portion`'s own `source` is its citation ("USDA FoodData
    Central, SR Legacy") and an entry's is the word for where it
    came from. */
export interface FoundFood extends Stated {
  en: string;
  bn?: string;
}

/**
 * What the log stores, or `null` where `scaleTo` refused.
 *
 * `qty` is rounded to two places before anything is scaled by
 * it, because `diet_entries.qty` is `numeric(9,2)`: a row that
 * scaled by 1.333 and stored 1.33 is a row whose own numbers do
 * not follow from each other.
 *
 * BOTH NAMES ARE WRITTEN. `label` is the English and `labelBn`
 * the Bangla, always in that order whichever language the reader
 * has on: a Bangla name in the English column is a log that
 * turns to Bangla when the tool is switched to English and
 * cannot be switched back.
 */
export function loggedFrom(
  food: FoundFood, ate: Ate, from: { source: string; sourceId?: string },
): Omit<Entry, "date"> | null {
  const scaled = scaleTo(food, ate);
  if (!scaled) return null;
  return {
    label: food.en,
    labelBn: food.bn,
    qty: round(ate.n, 2),
    unit: ate.unit,
    kcal: scaled.kcal,
    macros: Object.keys(scaled.macros).length ? scaled.macros : undefined,
    micros: Object.keys(scaled.micros).length ? scaled.micros : undefined,
    source: from.source,
    sourceId: from.sourceId,
  };
}
