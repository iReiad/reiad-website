"use client";

/* ============================================================
   diet/foods-panel.tsx: the portion library, and what it costs.

   `DIET.md` section 17, and section 14's oil calibration, which
   is asked for once a month at the foot of this page.

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

import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_PLACE, FOODS, forPlace, type Place, type Portion,
} from "@reiad/shared/foods";
import { ChipButton } from "../ui/chip";
import { T, digits, useToolLang } from "./lang";
import { Field } from "../ui/field";
import { oilPerMeal } from "@reiad/shared/diet";
import {
  getProfile, saveProfile, who, type Profile, type Who,
} from "../../lib/diet-api";

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
        <p className="dt-intro">
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
        <p className="dt-intro">
          <T
            en={`${FOODS.length} portions across both places. Every rice, dal and pasta row says whether it is cooked or dry: rice roughly triples in weight when cooked, and that is the most common single error in calorie counting.`}
            bn={`দুই জায়গা মিলিয়ে ${digits(FOODS.length, "bn")}টি ভাগ। প্রতিটি ভাত, ডাল আর পাস্তার সারিতে লেখা আছে সেটা রান্না করা না কাঁচা: রান্না হলে চালের ওজন প্রায় তিন গুণ হয়, আর ক্যালোরি গোনার সবচেয়ে সাধারণ ভুলটাই এটা।`}
          />
        </p>
        <Field
          id="dt-lib-q" type="search" value={q} hideLabel
          onChange={(e) => setQ(e.target.value)}
          label={<T en="Search the library" bn="তালিকায় খুঁজুন" />}
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

      <Oil />
    </div>
  );
}

/** THE OIL NOBODY MEASURES.

    `DIET.md` section 14. A curry's oil is poured, not weighed,
    and it is invisible in the finished dish. Across a week of
    home cooking it is frequently the single largest unlogged
    item in the entire diet, larger than any snack anybody feels
    guilty about, and it is why the gap between an estimated
    maintenance and a learned one is 20 to 30 percent.

    ONE QUESTION, ONCE A MONTH, and the bottle comes with its own
    scale printed on the side. The arithmetic is shown rather
    than asserted: a figure a reader cannot check is a figure
    they will not believe, and this one is going into their log.

    It lives here rather than on the log form because it is a
    fact about a kitchen rather than about a meal, and it is
    asked once for a month of them. */
function Oil() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [said, setSaid] = useState<"" | "saved" | "failed">("");

  useEffect(() => {
    let alive = true;
    void who().then(async (me) => {
      if (!alive) return;
      setW(me);
      setAnswered(true);
      if (!me) return;
      const p = await getProfile(me);
      if (alive) setProfile(p);
    });
    return () => { alive = false; };
  }, []);

  const set = async (patch: Profile): Promise<void> => {
    if (!w) return;
    const before = profile;
    setProfile((p) => ({ ...(p ?? {}), ...patch }));
    const ok = await saveProfile(w, { ...(profile ?? {}), ...patch });
    if (!ok) setProfile(before);
    setSaid(ok ? "saved" : "failed");
    window.setTimeout(() => setSaid(""), ok ? 1600 : 4000);
  };

  const per = oilPerMeal({
    mlWeek: profile?.oil_ml_week,
    people: profile?.oil_people,
    meals: profile?.oil_meals,
  });

  return (
    <section aria-labelledby="dt-oil-h">
      <h2 id="dt-oil-h"><T en="The oil nobody measures" bn="যে তেল কেউ মাপে না" /></h2>
      <p className="dt-intro">
        <T
          en="A curry's oil is poured, not weighed, and it is invisible in the finished dish. Two tablespoons is about 250 kcal and it is routine to use more, so across a week of home cooking this is often the single largest unlogged thing in a diet, larger than any snack anybody feels guilty about."
          bn="তরকারির তেল ঢালা হয়, মাপা হয় না, আর রান্না শেষে সেটা চোখে পড়ে না। দুই টেবিল চামচ প্রায় ২৫০ ক্যালোরি, আর এর বেশি ব্যবহার করাই স্বাভাবিক, তাই এক সপ্তাহের ঘরের রান্নায় খাবারের হিসাবে না লেখা জিনিসের মধ্যে এটাই প্রায়ই সবচেয়ে বড়, যেকোনো নাশতার চেয়েও বড়, যেটা নিয়ে মানুষ অপরাধবোধে ভোগে।"
        />
      </p>

      {answered && !w ? (
        <p className="dt-hint">
          <T
            en="This one is kept on your account, because it is a fact about a kitchen rather than about a meal and it is asked once a month rather than once a day."
            bn="এটা আপনার অ্যাকাউন্টে রাখা হয়, কারণ এটা কোনো এক বেলার নয়, রান্নাঘরের একটা তথ্য, আর মাসে একবার জিজ্ঞেস করা হয়, রোজ নয়।"
          />
        </p>
      ) : null}

      {answered && w ? (
        <>
          <div className="dt-oil-form">
            <Field
              id="dt-oil-ml" type="number" inputMode="numeric" min={0} max={5000} step="50"
              label={<T en="Oil this household used this week, ml" bn="এই সপ্তাহে ঘরে যত তেল লেগেছে, মিলি" />}
              hint={(
                <T
                  en="Off the bottle. A one litre bottle two thirds gone is about 650."
                  bn="বোতল দেখে বলুন। এক লিটারের বোতলের দুই তৃতীয়াংশ শেষ হলে প্রায় ৬৫০।"
                />
              )}
              value={profile?.oil_ml_week ? String(profile.oil_ml_week) : ""}
              onChange={(e) => void set({ oil_ml_week: Number(e.target.value) || undefined })}
            />
            <Field
              id="dt-oil-people" type="number" inputMode="numeric" min={1} max={20}
              label={<T en="How many people ate from it" bn="কতজন খেয়েছেন" />}
              value={profile?.oil_people ? String(profile.oil_people) : ""}
              onChange={(e) => void set({ oil_people: Number(e.target.value) || undefined })}
            />
            <Field
              id="dt-oil-meals" type="number" inputMode="numeric" min={1} max={100}
              label={<T en="Home-cooked meals in the week" bn="সপ্তাহে ঘরে রান্না কত বেলা" />}
              hint={(
                <T
                  en="Across the household. Two a day for seven days is fourteen."
                  bn="পুরো পরিবারের জন্য। দিনে দুবেলা করে সাত দিনে চোদ্দ।"
                />
              )}
              value={profile?.oil_meals ? String(profile.oil_meals) : ""}
              onChange={(e) => void set({ oil_meals: Number(e.target.value) || undefined })}
            />
            <span className="dt-save" data-state={said || "idle"}
                  role="status" aria-live="polite">
              {said === "failed"
                ? <T en="Not saved. Nothing changed." bn="জমা হয়নি। কিছুই বদলায়নি।" />
                : said === "saved" ? <T en="Saved" bn="জমা হয়েছে" /> : null}
            </span>
          </div>

          {per ? (
            <div className="dt-figure dt-figure-lead">
              <h3><T en="Per home-cooked meal" bn="ঘরে রান্না প্রতি বেলায়" /></h3>
              <p className="dt-value">
                <T en={`about ${Math.round(per.kcal.mid)} kcal`}
                   bn={`প্রায় ${digits(Math.round(per.kcal.mid), "bn")} ক্যালোরি`} />
              </p>
              <p className="dt-said">
                <T
                  en={`${profile?.oil_ml_week} ml of oil, ${per.people} people, ${per.meals} meals: about ${per.mlPerMeal.toFixed(1)} ml each, somewhere between ${Math.round(per.kcal.low)} and ${Math.round(per.kcal.high)} kcal.`}
                  bn={`${digits(profile?.oil_ml_week ?? 0, "bn")} মিলি তেল, ${digits(per.people, "bn")} জন, ${digits(per.meals, "bn")} বেলা: জনপ্রতি প্রায় ${digits(per.mlPerMeal.toFixed(1), "bn")} মিলি, অর্থাৎ ${digits(Math.round(per.kcal.low), "bn")} থেকে ${digits(Math.round(per.kcal.high), "bn")} ক্যালোরির মধ্যে।`}
                />
              </p>
              <p className="dt-why">
                <T
                  en="An estimate, and a wide one: a household does not divide its oil evenly, the week may not have been typical, and some of it is still in the pan. It is enormously better than the zero that was there before, which is the number a log carries when nobody measures the oil."
                  bn="এটা একটা আন্দাজ, আর সীমাটা চওড়া: পরিবারে তেল সমান ভাগে যায় না, সপ্তাহটা স্বাভাবিক নাও হতে পারে, আর কিছু তেল কড়াইতেই থেকে যায়। তবু আগে যে শূন্য ছিল তার চেয়ে এটা অনেক ভালো, আর কেউ তেল না মাপলে খাতায় ওই শূন্যটাই থাকে।"
                />
              </p>
            </div>
          ) : (
            <p className="dt-hint">
              <T
                en="All three, and this works out what to add to a home-cooked meal, with the arithmetic shown."
                bn="তিনটিই দিলে ঘরের রান্না এক বেলায় কত যোগ করতে হবে তা বেরিয়ে আসবে, আর হিসাবটাও দেখানো হবে।"
              />
            </p>
          )}
        </>
      ) : null}
    </section>
  );
}
