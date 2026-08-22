"use client";

/* ============================================================
   diet/foods-panel.tsx: the portion library, and what it costs.

   `DIET.md` sections 18 and 21.

   ---- why a price table is on a diet tool at all ----

   This is a personal finance site. It teaches money in Bangla,
   it has a school called টাকা ও শেয়ার, and it holds a portfolio
   tool and a stock model. A diet tool here that never mentioned
   money would be the one place on the site where the obvious
   question does not get asked.

   COST PER GRAM OF PROTEIN is the number that changes behaviour.
   Protein is the expensive macronutrient and the one with a
   floor, so "what is the cheapest protein I will actually eat"
   is a real optimisation with a real answer, and the answer is
   different in Dhaka and in Manchester.

   ---- a price is a fact with a date on it ----

   An undated price is worse than none. Every row carries the
   month it was checked and anything older is drawn with its date
   rather than silently.

   ---- and no shop, ever ----

   No links, no affiliate, no basket. These are reference figures
   for arithmetic. The moment this recommends where to buy
   something it stops being a calculator and becomes an
   advertisement.
   ============================================================ */

import { useMemo, useState } from "react";
import {
  DEFAULT_PLACE, FOODS, forPlace, type Place, type Portion,
} from "@reiad/shared/foods";
import { ChipButton } from "../ui/chip";
import { T, digits, useToolLang } from "./lang";

const MONEY: Record<string, string> = { BDT: "৳", GBP: "£" };

/** Cost per 100 g of protein, which is the comparison worth
    making. A row with no price or no protein is not in it: an
    infinity in a sorted table is a row pretending to be the
    cheapest. */
const perProtein = (f: Portion): number | null =>
  f.price != null && f.protein > 0 ? (f.price / f.protein) * 100 : null;

/** PRECISION FOLLOWS THE MEASUREMENT, NEVER THE FLOAT, and here
    it also has to follow the CURRENCY.

    Cost per 100 g of protein lands between one and three pounds
    in Britain and between fifty and three hundred taka in
    Bangladesh. Rounding both to whole units made three different
    foods all read "£1" in a table that had just sorted them by
    that exact number: a table that sorts by a figure and then
    hides the figure is a table telling the reader to trust an
    order they cannot check.

    Two decimals under ten, one under a hundred, whole above it.
    The rule is about the size of the number rather than about
    the currency, so a third currency needs nothing added. */
const money = (n: number): string =>
  n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : n.toFixed(0);

/** The month a price was checked, drawn WITH the price and never
    instead of it.

    An undated price is worse than none, which is section 17 and
    the header above, and this panel drew none of them for its
    first two releases: the rows carried `pricedOn` and the table
    printed a figure with nothing to date it. `YYYY-MM` is passed
    through as it is written rather than made into a month name,
    because a month name is a third thing to say in two
    languages. */
const Priced = ({ on, lang }: { on?: string; lang: "en" | "bn" }) =>
  (on ? <span className="dt-priced">{digits(on, lang)}</span> : null);

export function FoodsPanel() {
  const lang = useToolLang();
  /* One default, in `shared/foods.ts`. This panel and the
     picker asked for the UK while the Worker ranked
     Bangladesh first, which is one reader getting two
     libraries out of one tool. */
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const all = forPlace(place);
    const needle = q.trim().toLowerCase();
    return needle
      ? all.filter((f) => f.en.toLowerCase().includes(needle) || f.bn.includes(q.trim()))
      : all;
  }, [place, q]);

  const protein = useMemo(() => forPlace(place)
    .map((f) => ({ f, per: perProtein(f) }))
    .filter((r): r is { f: Portion; per: number } => r.per !== null)
    .sort((a, b) => a.per - b.per)
    .slice(0, 8), [place]);

  return (
    <div className="dt-foods">
      <div className="dt-tags" role="group"
           aria-label={lang === "bn" ? "কোন তালিকা" : "Which library"}>
        <ChipButton pressed={place === "bd"} onClick={() => setPlace("bd")}>
          <T en="Bangladesh" bn="বাংলাদেশ" />
        </ChipButton>
        <ChipButton pressed={place === "uk"} onClick={() => setPlace("uk")}>
          <T en="The UK" bn="যুক্তরাজ্য" />
        </ChipButton>
      </div>

      <section aria-labelledby="dt-prot-h">
        <h2 id="dt-prot-h">
          <T
            en="The cheapest protein you will actually eat"
            bn="যে প্রোটিন আপনি সত্যিই খাবেন, সবচেয়ে সস্তা"
          />
        </h2>
        <p className="dt-hint">
          <T
            en="Per 100 g of protein. This is the number that changes behaviour: protein is the expensive macronutrient and the one with a floor, so it is a real optimisation with a real answer."
            bn="প্রতি ১০০ গ্রাম প্রোটিনের দাম। এই সংখ্যাটাই আচরণ বদলায়: প্রোটিনই দামি অংশ আর এরই একটা সর্বনিম্ন আছে, তাই এটা সত্যিকারের একটা হিসাব যার সত্যিকারের উত্তর আছে।"
          />
        </p>
        <div className="dt-table-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th scope="col"><T en="Food" bn="খাবার" /></th>
                <th scope="col"><T en="Per 100 g protein" bn="প্রতি ১০০ গ্রাম প্রোটিন" /></th>
                <th scope="col"><T en="In one portion" bn="এক ভাগে" /></th>
              </tr>
            </thead>
            <tbody>
              {protein.map(({ f, per }) => (
                <tr key={f.id}>
                  <th scope="row">
                    {lang === "bn" ? f.bn : f.en}
                    <span className="dt-row-src">{f.source}</span>
                  </th>
                  <td className="mono">
                    {MONEY[f.currency ?? ""] ?? ""}{digits(money(per), lang)}
                    <Priced on={f.pricedOn} lang={lang} />
                  </td>
                  <td className="mono">{digits(f.protein.toFixed(1), lang)} g</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="dt-why">
          <T
            en="Reference figures for arithmetic, checked in August 2026, naming no shop. There are no links here and there will not be: the moment this recommends where to buy something it stops being a calculator."
            bn="হিসাবের জন্য রেফারেন্স সংখ্যা, ২০২৬ সালের অগাস্টে যাচাই করা, কোনো দোকানের নাম নেই। এখানে কোনো লিংক নেই আর থাকবেও না: কোথা থেকে কিনবেন তা বলতে শুরু করলেই এটা আর ক্যালকুলেটর থাকে না।"
          />
        </p>
      </section>

      <section aria-labelledby="dt-lib-h">
        <h2 id="dt-lib-h"><T en="The library" bn="তালিকা" /></h2>
        <p className="dt-hint">
          <T
            en={`${FOODS.length} portions across both places. Every rice, dal and pasta row says whether it is cooked or dry: rice roughly triples in weight when cooked, and that is the most common single error in calorie counting.`}
            bn={`দুই জায়গা মিলিয়ে ${digits(FOODS.length, "bn")}টি ভাগ। প্রতিটি ভাত, ডাল আর পাস্তার সারিতে লেখা আছে সেটা রান্না করা না কাঁচা: রান্না হলে চালের ওজন প্রায় তিন গুণ হয়, আর ক্যালোরি গোনার সবচেয়ে সাধারণ ভুলটাই এটা।`}
          />
        </p>
        <input
          className="dt-picker-box" type="search" value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label={lang === "bn" ? "তালিকায় খুঁজুন" : "Search the library"}
          placeholder={lang === "bn" ? "খুঁজুন" : "Search"}
        />
        <div className="dt-table-wrap">
          <table className="dt-table">
            <caption className="sr-only">
              <T en="Every portion in this library" bn="এই তালিকার সব ভাগ" />
            </caption>
            <thead>
              <tr>
                <th scope="col"><T en="Portion" bn="ভাগ" /></th>
                <th scope="col">kcal</th>
                <th scope="col"><T en="Protein" bn="প্রোটিন" /></th>
                <th scope="col"><T en="Fibre" bn="আঁশ" /></th>
                <th scope="col">
                  <T en="Price, and when it was checked" bn="দাম, আর কবে যাচাই করা" />
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((f) => (
                <tr key={f.id}>
                  <th scope="row">
                    {lang === "bn" ? f.bn : f.en}
                    {/* WHERE THE FIGURE CAME FROM, on every row.
                        A number with no source is a number this
                        tool invented, which is the rule the rows
                        themselves are written under. */}
                    <span className="dt-row-src">{f.source}</span>
                  </th>
                  <td className="mono">{digits(f.kcal, lang)}</td>
                  <td className="mono">{digits(f.protein.toFixed(1), lang)}</td>
                  <td className="mono">{digits(f.fibre.toFixed(1), lang)}</td>
                  <td className="mono">
                    {f.price != null
                      ? `${MONEY[f.currency ?? ""] ?? ""}${digits(money(f.price), lang)}`
                      : "-"}
                    <Priced on={f.pricedOn} lang={lang} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {rows.length === 0 ? (
          <p className="dt-hint">
            <T
              en="Nothing matches. The library is small on purpose: it holds the things people actually eat in one of the two places, and everything else is searched or typed."
              bn="কিছু মেলেনি। তালিকাটা ইচ্ছে করেই ছোট: দুই জায়গার মধ্যে একটিতে মানুষ যা সত্যিই খায় সেগুলোই আছে, বাকি সব খুঁজে বা লিখে নিতে হয়।"
            />
          </p>
        ) : null}
      </section>
    </div>
  );
}
