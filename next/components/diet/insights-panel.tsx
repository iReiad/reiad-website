"use client";

/* ============================================================
   diet/insights-panel.tsx: the readings that come out of a log,
   and what the food in it cost.

   `DIET.md` sections 16 and 17. Three of section 16's readings
   were already on this page (`topSources`, `byWeekday`,
   `byHour`, in `nutrition-panel.tsx`); this is the rest of them,
   plus the money.

   ---- every sentence here is a template, so every one prints
        its arithmetic ----

   A generated sentence is a claim somebody has to be able to
   check, and a reader who cannot follow the sum will not believe
   the number. So no reading below states a figure without the
   span it was measured over, how many days of that span were
   written down, or the two numbers it was divided out of. All of
   the arithmetic is `shared/insights.ts` and none of it is here:
   this file chooses words.

   ---- and a reading with too little data says so ----

   Section 15's coverage floor, one level up. Every reading has an
   empty state that is a SENTENCE saying what it will show and
   when, out of section 9's unlock table, and never a zero,
   never a spinner and never an empty box. A zero is a claim.

   ---- money is a fact and never a judgement ----

   Section 17. Cost per gram of protein is a fact; "you spent too
   much" is not, and the price table's own voice is the one this
   matches. There are no links here, no shop and no basket: the
   moment this recommends where to buy something it stops being a
   calculator and becomes an advertisement.

   ---- two of these need no account, and they are drawn signed
        out ----

   How full a hundred calories is, and what a calorie costs, are
   facts about the portion library rather than about a reader.
   The page already teaches signed out and these belong to that
   half.
   ============================================================ */

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  activityFactor, estimatedBurn, fatEstimate, learnedHere, restingBurn,
  target, trend, weighings,
  type Body, type Day, type Entry,
} from "@reiad/shared/diet";
import {
  COVERAGE_FLOOR, NIGHTS_LEAST, SHORT_NIGHT_HOURS, adherence, afterShortNights,
  againstBudget, calibration, costByTag, loggedDays, monthsSince, per100kcal,
  proteinPrice, proteinSplit, spend, swaps, weekVsOwn,
  type Item, type SlotId, type Spend,
} from "@reiad/shared/insights";
import { DEFAULT_PLACE, byId, forPlace, type Place } from "@reiad/shared/foods";
import {
  dayNumber, saveProfile, type Profile, type Who,
} from "../../lib/diet-api";
import { ChipButton } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { T, digits, useToolLang, type ToolLang } from "./lang";

/** The library row behind an entry, or nothing.

    Nothing is the honest answer for a food typed by hand or
    pulled out of a public database: neither carries a price and
    neither is in the portion library, which is exactly the gap
    every coverage figure on this panel is measuring. */
const resolve = (sourceId: string): Item | undefined => byId(sourceId);

const MONEY: Record<string, string> = { BDT: "৳", GBP: "£" };

/** Two decimals under ten, one under a hundred, whole above it.

    The same rule `foods-panel.tsx` uses and for the same reason:
    a table that sorts by a figure and then rounds three of them
    to the same whole number is a table asking a reader to trust
    an order they cannot check. The rule is about the size of the
    number rather than about the currency. */
const money = (n: number): string =>
  n < 10 ? n.toFixed(2) : n < 100 ? n.toFixed(1) : n.toFixed(0);

/** A whole number where the figure is one, one decimal where it
    is not. `Math.round` alone turns 0.42 kg a week into nought,
    which is the difference between a reading and a blank. */
const show = (n: number): string =>
  (Math.abs(n) >= 10 ? String(Math.round(n)) : (Math.round(n * 100) / 100).toFixed(2));

/** One decimal, for a figure that is a measurement rather than a
    ratio. `show()` gives two under ten, which reads as more
    precision than a night's sleep has. */
const one = (n: number): string => n.toFixed(1);

const pct = (n: number): number => Math.round(n * 100);
/** A multiple, at one decimal. `show()` gives two under ten,
    which reads as a measurement where this is a ratio. */
const times = (n: number): string => n.toFixed(1);
const round = (n: number): number => Math.round(n);

/** The name of a slot, and the hours it covers, said once.

    The hours are printed beside the name deliberately: nothing
    turns on the boundaries being exactly these, so a reader has
    to be able to see where they were drawn. */
const SLOT_WORDS: Record<SlotId, { en: string; bn: string; hours: string }> = {
  morning: { en: "morning", bn: "সকাল", hours: "4–11" },
  midday: { en: "midday", bn: "দুপুর", hours: "11–16" },
  evening: { en: "evening", bn: "সন্ধ্যা", hours: "16–21" },
  late: { en: "late", bn: "রাত", hours: "21–4" },
};

/** What a library tag means, for the cost table. The ids are
    `Tag` in `shared/foods.ts` and the words are here because
    nothing else prints them. */
const TAG_WORDS: Record<string, { en: string; bn: string }> = {
  staple: { en: "staples", bn: "প্রধান খাবার" },
  protein: { en: "protein", bn: "প্রোটিন" },
  veg: { en: "vegetables", bn: "সবজি" },
  fruit: { en: "fruit", bn: "ফল" },
  drink: { en: "drinks", bn: "পানীয়" },
  snack: { en: "snacks", bn: "নাশতা" },
  oil: { en: "oil", bn: "তেল" },
};

/** A price with the month it was checked under it, greyed once
    it is older than section 17's few months.

    An undated price is worse than none, and a price that has
    quietly gone out of date is the same thing with a date on it
    to make it look current. `YYYY-MM` is passed through as it is
    written: a month name is a third thing to say in two
    languages. */
function Priced({ on, now, lang }: { on?: string; now: string; lang: ToolLang }) {
  const months = monthsSince(on, now);
  if (!on) return null;
  const old = months === null || months > 6;
  return (
    <span className={old ? "dt-priced dt-priced-stale" : "dt-priced"}>
      {digits(on, lang)}
    </span>
  );
}

/* ============================================================
   the panel
   ============================================================ */

export function InsightsPanel({
  w, days, entries, profile, today,
}: {
  /** Null signed out, and two of the readings below still draw:
      they are facts about the library rather than about a
      reader. */
  w: Who | null;
  days: Day[];
  entries: Entry[];
  profile: Profile | null;
  /** Today, as an ISO date, so nothing here reads a clock and
      every window is the one the caller fetched. */
  today: string;
}) {
  const place: Place = profile?.place ?? DEFAULT_PLACE;
  const month = today.slice(0, 7);

  return (
    <>
      {w ? <ProteinSpread entries={entries} /> : null}
      {w ? <Swaps entries={entries} /> : null}
      <Fullness place={place} />
      {w ? <ThisWeek days={days} today={today} /> : null}
      {w ? <AfterAShortNight days={days} profile={profile} today={today} /> : null}
      {w ? <Holding days={days} profile={profile} today={today} /> : null}
      {w ? <Calibration days={days} profile={profile} today={today} /> : null}
      {w ? (
        <Budget
          w={w} entries={entries} profile={profile} place={place} month={month}
        />
      ) : null}
      <PriceOfFood place={place} month={month} />
    </>
  );
}

/* ---- 1. how protein is spread across the day ---- */

function ProteinSpread({ entries }: { entries: Entry[] }) {
  const lang = useToolLang();
  const split = useMemo(() => proteinSplit(entries), [entries]);
  const thin = split.placed === 0 || split.coverage < COVERAGE_FLOOR;

  return (
    <section aria-labelledby="dt-spread-h">
      <h2 id="dt-spread-h">
        <T en="How your protein is spread" bn="আপনার প্রোটিন কীভাবে ভাগ হয়" />
      </h2>
      <p className="dt-intro">
        <T
          en="The same total in one meal and the same total over three are not the same thing for keeping muscle, so this is the split rather than the total. No slot here is the right one."
          bn="একই পরিমাণ প্রোটিন এক বেলায় খাওয়া আর তিন বেলায় ভাগ করে খাওয়া পেশি ধরে রাখার দিক থেকে এক নয়, তাই এখানে মোট নয়, ভাগটা দেখানো হচ্ছে। এখানকার কোনো সময়ই সঠিক সময় নয়।"
        />
      </p>

      {thin ? (
        <p className="dt-hint">
          <T
            en="Half the protein you log needs a time on it and this shows where it lands across the day. The board stamps the clock on anything logged as it is eaten; a row added later carries no time and cannot be placed in a part of the day."
            bn="আপনার লেখা প্রোটিনের অন্তত অর্ধেকের সঙ্গে সময় থাকলে এটা দেখাবে দিনের কোন ভাগে সেটা পড়ছে। খাওয়ার সঙ্গে সঙ্গে লিখলে সময়টা নিজেই বসে যায়; পরে যোগ করা সারিতে সময় থাকে না, তাই সেটা দিনের কোনো ভাগে রাখা যায় না।"
          />
        </p>
      ) : (
        <>
          <ul className="dt-tag-counts">
            {split.slots.map((s) => (
              <li key={s.id}>
                <span>
                  <T en={SLOT_WORDS[s.id].en} bn={SLOT_WORDS[s.id].bn} />
                  {" "}
                  <span className="dt-cuts">{digits(SLOT_WORDS[s.id].hours, lang)}</span>
                </span>
                <span className="dt-hours-share">
                  <span className="mono">
                    <T
                      en={`${show(s.grams)} g (${pct(s.share)}%)`}
                      bn={`${digits(show(s.grams), "bn")} গ্রাম (${digits(pct(s.share), "bn")}%)`}
                    />
                  </span>
                  <span
                    className="dt-hours-bar"
                    style={{ "--share": `${pct(s.share)}%` } as CSSProperties}
                  />
                </span>
              </li>
            ))}
          </ul>
          <p className="dt-said">
            <T
              en={`${show(split.perDay)} g a day over ${split.days} logged days, and ${pct((split.slots.find((s) => s.id === "evening")?.share ?? 0) + (split.slots.find((s) => s.id === "late")?.share ?? 0))}% of it arrives after four in the afternoon.`}
              bn={`${digits(split.days, "bn")} দিনের হিসাবে দিনে ${digits(show(split.perDay), "bn")} গ্রাম, আর তার ${digits(pct((split.slots.find((s) => s.id === "evening")?.share ?? 0) + (split.slots.find((s) => s.id === "late")?.share ?? 0)), "bn")}% আসে বিকেল চারটার পরে।`}
            />
          </p>
          <p className="dt-coverage">
            <T
              en={`Split from ${pct(split.coverage)}% of the protein you logged: ${show(split.placed)} g of ${show(split.total)} g carried a time.`}
              bn={`আপনার লেখা প্রোটিনের ${digits(pct(split.coverage), "bn")}% থেকে ভাগ করা: ${digits(show(split.total), "bn")} গ্রামের মধ্যে ${digits(show(split.placed), "bn")} গ্রামের সঙ্গে সময় ছিল।`}
            />
          </p>
        </>
      )}
      <p className="dt-why">
        <T
          en="Described, not judged. A day whose protein is nearly all at dinner is a routine rather than a mistake, and the reason this is here at all is that the total on its own cannot tell the two apart."
          bn="বর্ণনা, বিচার নয়। যে দিনের প্রায় সব প্রোটিন রাতের খাবারে, সেটা ভুল নয়, একটা রুটিন, আর এটা এখানে আছে কারণ শুধু মোট সংখ্যা দিয়ে দুটোর পার্থক্য বোঝা যায় না।"
        />
      </p>
    </section>
  );
}

/* ---- 2. what a swap would do ---- */

function Swaps({ entries }: { entries: Entry[] }) {
  const lang = useToolLang();
  const rows = useMemo(() => swaps({ entries, resolve }), [entries]);
  const logged = useMemo(() => loggedDays(entries), [entries]);

  return (
    <section aria-labelledby="dt-swap-h">
      <h2 id="dt-swap-h">
        <T en="What a swap would do" bn="বদলে নিলে কী হতো" />
      </h2>
      <p className="dt-intro">
        <T
          en="Arithmetic on the things already in your own log, and nothing else. No food here is a bad food, nothing is suggested that you have not logged yourself, and there is no plan in this: it is what the sums come to."
          bn="আপনার নিজের খাতায় যা আছে কেবল তার উপর হিসাব, আর কিছু নয়। এখানে কোনো খাবারই খারাপ নয়, আপনি নিজে লেখেননি এমন কিছু বলা হয়নি, আর এটা কোনো পরিকল্পনাও নয়: শুধু যোগবিয়োগের ফল।"
        />
      </p>

      {rows.length === 0 ? (
        <p className="dt-hint">
          <T
            en="A fortnight of logging from the search, rather than typed by hand, and this shows what halving each of your three biggest items would come to over a week. A food typed by hand carries no portion, so there is nothing to halve."
            bn="দুই সপ্তাহ ধরে খুঁজে নিয়ে লিখলে, নিজে হাতে না লিখে, এটা দেখাবে আপনার সবচেয়ে বড় তিনটি জিনিসের অর্ধেক করলে সপ্তাহে কত কমত। হাতে লেখা খাবারের কোনো নির্দিষ্ট ভাগ থাকে না, তাই সেটার অর্ধেক করার কিছু নেই।"
          />
        </p>
      ) : (
        <>
          <div className="dt-table-wrap">
            <table className="dt-table">
              <caption className="sr-only">
                <T
                  en="What halving each of your biggest items would come to"
                  bn="আপনার সবচেয়ে বড় জিনিসগুলোর অর্ধেক করলে কত হতো"
                />
              </caption>
              <thead>
                <tr>
                  <th scope="col"><T en="Your food" bn="আপনার খাবার" /></th>
                  <th scope="col"><T en="A week of it" bn="সপ্তাহে যতটা" /></th>
                  <th scope="col"><T en="Half of it" bn="অর্ধেক করলে" /></th>
                  <th scope="col"><T en="The same weight of" bn="একই ওজনে বদলে" /></th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.item.id}>
                    <th scope="row">
                      {lang === "bn" ? r.item.bn : r.item.en}
                      <span className="dt-row-src">
                        <T
                          en={`${r.times} times in ${logged} logged days`}
                          bn={`${digits(logged, "bn")} দিনে ${digits(r.times, "bn")} বার`}
                        />
                      </span>
                    </th>
                    <td className="mono">
                      <T
                        en={`${round(r.kcalPerWeek)} kcal`}
                        bn={`${digits(round(r.kcalPerWeek), "bn")} ক্যালোরি`}
                      />
                    </td>
                    <td className="mono">
                      <T
                        en={`${round(r.halfPerWeek)} kcal less`}
                        bn={`${digits(round(r.halfPerWeek), "bn")} ক্যালোরি কম`}
                      />
                    </td>
                    <td>
                      {r.swap ? (
                        <>
                          <span>{lang === "bn" ? r.swap.to.bn : r.swap.to.en}</span>
                          <span className="dt-row-src mono">
                            <T
                              en={`${round(-r.swap.kcalPerWeek)} kcal less a week, ${show(r.swap.proteinPerWeek)} g protein`}
                              bn={`সপ্তাহে ${digits(round(-r.swap.kcalPerWeek), "bn")} ক্যালোরি কম, প্রোটিন ${digits(show(r.swap.proteinPerWeek), "bn")} গ্রাম`}
                            />
                          </span>
                        </>
                      ) : (
                        <span className="dt-cuts">
                          <T
                            en="nothing else of the same kind in your log"
                            bn="আপনার খাতায় একই ধরনের আর কিছু নেই"
                          />
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows[0]?.swap ? (
            <p className="dt-said">
              <T
                en={`One serving of ${rows[0].item.en} is about ${round(rows[0].swap.grams)} g, which is ${round(rows[0].swap.fromKcal)} kcal; the same weight of ${rows[0].swap.to.en} is ${round(rows[0].swap.toKcal)}. You log it about ${show(rows[0].perWeek)} times a week.`}
                bn={`${rows[0].item.bn} এক বেলায় প্রায় ${digits(round(rows[0].swap.grams), "bn")} গ্রাম, অর্থাৎ ${digits(round(rows[0].swap.fromKcal), "bn")} ক্যালোরি; একই ওজনের ${rows[0].swap.to.bn} হলো ${digits(round(rows[0].swap.toKcal), "bn")}। আপনি এটা সপ্তাহে প্রায় ${digits(show(rows[0].perWeek), "bn")} বার লেখেন।`}
              />
            </p>
          ) : null}
        </>
      )}
      <p className="dt-why">
        <T
          en="Every rate here is per day you wrote something down rather than per day on the calendar, because a month with ten days logged in it is not a month of eating nothing. Raw and cooked forms of one food are never swapped for each other: the difference between them is the cooking water."
          bn="এখানকার প্রতিটি হিসাব আপনি যেসব দিনে কিছু লিখেছেন সেই দিনগুলোর উপর, ক্যালেন্ডারের সব দিনের উপর নয়, কারণ যে মাসে দশ দিন লেখা হয়েছে সেটা না খেয়ে থাকার মাস নয়। একই খাবারের কাঁচা আর রান্না করা রূপ কখনো একটার বদলে আরেকটা দেখানো হয় না: ওদের পার্থক্যটা রান্নার পানি।"
        />
      </p>
    </section>
  );
}

/* ---- 3. how full a hundred calories is ---- */

function Fullness({ place }: { place: Place }) {
  const lang = useToolLang();
  const [by, setBy] = useState<"protein" | "fibre">("protein");
  const [where, setWhere] = useState<Place>(place);
  useEffect(() => { setWhere(place); }, [place]);
  const rows = useMemo(() => per100kcal(forPlace(where), by, 8), [where, by]);

  return (
    <section aria-labelledby="dt-full-h">
      <h2 id="dt-full-h">
        <T en="How full a hundred calories is" bn="একশো ক্যালোরি কতটা ভরায়" />
      </h2>
      <p className="dt-intro">
        <T
          en="Protein and fibre per 100 kcal, for the library of the place you eat in. It ranks foods by how long they hold you without calling any of them bad, and it is the honest form of every good food and bad food list ever written."
          bn="আপনি যেখানে খান সেই তালিকার প্রতিটি খাবারে প্রতি ১০০ ক্যালোরিতে কত প্রোটিন আর আঁশ। কোনটা কতক্ষণ পেট ভরিয়ে রাখে সেই হিসাবে সাজানো, কোনোটাকে খারাপ না বলে, আর ভালো খাবার আর খারাপ খাবারের যত তালিকা লেখা হয়েছে তার সৎ রূপটা এটাই।"
        />
      </p>
      <div
        className="dt-tags" role="group"
        aria-label={lang === "bn" ? "কী দিয়ে সাজানো" : "Sorted by what"}
      >
        <ChipButton pressed={by === "protein"} onClick={() => setBy("protein")}>
          <T en="By protein" bn="প্রোটিন অনুসারে" />
        </ChipButton>
        <ChipButton pressed={by === "fibre"} onClick={() => setBy("fibre")}>
          <T en="By fibre" bn="আঁশ অনুসারে" />
        </ChipButton>
        <ChipButton pressed={where === "bd"} onClick={() => setWhere("bd")}>
          <T en="Bangladesh" bn="বাংলাদেশ" />
        </ChipButton>
        <ChipButton pressed={where === "uk"} onClick={() => setWhere("uk")}>
          <T en="The UK" bn="যুক্তরাজ্য" />
        </ChipButton>
      </div>
      <div className="dt-table-wrap">
        <table className="dt-table">
          <caption className="sr-only">
            <T
              en="Protein and fibre for every hundred calories"
              bn="প্রতি একশো ক্যালোরিতে প্রোটিন আর আঁশ"
            />
          </caption>
          <thead>
            <tr>
              <th scope="col"><T en="Food" bn="খাবার" /></th>
              <th scope="col"><T en="Protein per 100 kcal" bn="প্রতি ১০০ ক্যালোরিতে প্রোটিন" /></th>
              <th scope="col"><T en="Fibre per 100 kcal" bn="প্রতি ১০০ ক্যালোরিতে আঁশ" /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.item.id}>
                <th scope="row">{lang === "bn" ? r.item.bn : r.item.en}</th>
                <td className="mono">
                  <T
                    en={`${r.protein.toFixed(1)} g`}
                    bn={`${digits(r.protein.toFixed(1), "bn")} গ্রাম`}
                  />
                </td>
                <td className="mono">
                  <T
                    en={`${r.fibre.toFixed(1)} g`}
                    bn={`${digits(r.fibre.toFixed(1), "bn")} গ্রাম`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="dt-why">
        <T
          en="A property of the food and not a score: nothing is added up, nothing is out of a hundred and nothing here says what to eat. A food low on both columns is a food that gives you its calories quickly, which is sometimes exactly what somebody wants."
          bn="এটা খাবারের একটা বৈশিষ্ট্য, কোনো নম্বর নয়: কিছু যোগ করা হয়নি, কিছুই একশোতে দেওয়া হয়নি, আর কী খাবেন তা এখানে বলা নেই। দুই ঘরেই কম মানে সেই খাবার তাড়াতাড়ি ক্যালোরি দেয়, যা কখনো কখনো ঠিক সেটাই যা কারো দরকার।"
        />
      </p>
    </section>
  );
}

/* ---- 4. this week against the reader's own average ---- */

function ThisWeek({ days, today }: { days: Day[]; today: string }) {
  const mine = useMemo(
    () => weekVsOwn({ days, dayOf: dayNumber, today: dayNumber(today) }),
    [days, today],
  );

  return (
    <section aria-labelledby="dt-week-own-h">
      <h2 id="dt-week-own-h">
        <T en="This week, against your own average" bn="এই সপ্তাহ, আপনার নিজের গড়ের সঙ্গে" />
      </h2>
      {mine === null ? (
        <p className="dt-hint">
          <T
            en="Four logged days this week and ten before them, and this compares the two. It is never a comparison with anybody else: there is no leaderboard here and no cohort, because what somebody else eats is not evidence about you."
            bn="এই সপ্তাহে চার দিন আর তার আগে দশ দিন লেখা থাকলে এটা দুটোর তুলনা করবে। এটা কখনোই অন্য কারো সঙ্গে তুলনা নয়: এখানে কোনো তালিকা নেই, কোনো দলও নেই, কারণ অন্য কেউ কী খায় সেটা আপনার সম্পর্কে কোনো প্রমাণ নয়।"
          />
        </p>
      ) : (
        <>
          <div className="dt-figure dt-figure-lead">
            <h3><T en="This week" bn="এই সপ্তাহ" /></h3>
            <p className="dt-value">
              <T
                en={`${mine.diff >= 0 ? "+" : ""}${round(mine.diff)} kcal a day`}
                bn={`দিনে ${mine.diff >= 0 ? "+" : ""}${digits(round(mine.diff), "bn")} ক্যালোরি`}
              />
            </p>
            <p className="dt-said">
              <T
                en={`${round(mine.weekMean)} kcal a day across ${mine.weekDays} logged days this week, against ${round(mine.beforeMean)} across the ${mine.beforeDays} days you logged in the ${mine.span} days before it. That is ${Math.abs(pct(mine.pct))}% ${mine.pct >= 0 ? "above" : "below"} your own average.`}
                bn={`এই সপ্তাহে ${digits(mine.weekDays, "bn")} দিনে দিনে ${digits(round(mine.weekMean), "bn")} ক্যালোরি, আর তার আগের ${digits(mine.span, "bn")} দিনের মধ্যে যে ${digits(mine.beforeDays, "bn")} দিন লিখেছেন সেখানে ${digits(round(mine.beforeMean), "bn")}। অর্থাৎ আপনার নিজের গড়ের চেয়ে ${digits(Math.abs(pct(mine.pct)), "bn")}% ${mine.pct >= 0 ? "উপরে" : "নিচে"}।`}
              />
            </p>
          </div>
          <p className="dt-why">
            <T
              en="A week above your own average is a fact about a week and not about you. Weeks move: a wedding, a fast, a fortnight of travel and a cold all show up here, which is why this is one line rather than a verdict."
              bn="নিজের গড়ের চেয়ে বেশি একটা সপ্তাহ সেই সপ্তাহের কথা বলে, আপনার কথা নয়। সপ্তাহ বদলায়: বিয়ের অনুষ্ঠান, রোজা, দুই সপ্তাহের সফর বা একটা ঠান্ডা, সবই এখানে দেখা যায়, তাই এটা একটা লাইন, কোনো রায় নয়।"
            />
          </p>
        </>
      )}
    </section>
  );
}

/* ---- 4b. days after a short night ---- */

/** `DIET.md` section 18, and the whole of what an hours field
    earns: one plain observation of the kind section 16 allows.

    IT IS OFFSET BY A DAY AND THE PAGE SAYS SO. Short sleep
    raises the hormone that makes somebody hungry and lowers the
    one that says they have had enough, and the appetite that
    follows lands the day AFTER. A panel comparing a night with
    the same date's eating would be reading the wrong pair and
    would look entirely correct, so what is compared is written
    out for the reader rather than left in the arithmetic.

    And it stops there. No score, no grade for a night, and no
    target for one: section 18 is explicit that this is never
    turned into a sleep score. */
function AfterAShortNight({
  days, profile, today,
}: { days: Day[]; profile: Profile | null; today: string }) {
  const at = dayNumber(today);
  const engine = useMemo(() => bodyAndTarget(days, profile, at), [days, profile, at]);
  const nights = useMemo(
    () => afterShortNights({ days, targetKcal: engine?.kcal }),
    [days, engine],
  );

  return (
    <section aria-labelledby="dt-sleep-h">
      <h2 id="dt-sleep-h">
        <T en="Days after a short night" bn="কম ঘুমের পরের দিনগুলো" />
      </h2>
      <p className="dt-intro">
        <T
          en="A night here is set against what you ate the day after it rather than the same day, because the appetite that follows a short night arrives the following day. What is below is two averages out of your own log: no cause is claimed between them, nothing is scored, and no night is graded."
          bn="এখানে একটা রাতের ঘুমের পাশে রাখা হয় তার পরের দিন আপনি কী খেয়েছেন, ওই দিনের খাওয়া নয়, কারণ কম ঘুমের পর ক্ষুধা বাড়ে তার পরের দিন। নিচে আপনার নিজের খাতা থেকে নেওয়া দুটো গড়: এদের মধ্যে কারণ আর ফলের কোনো দাবি করা হয়নি, কিছুতে নম্বর দেওয়া হয়নি, আর কোনো রাতকে ভালো বা খারাপ বলা হয়নি।"
        />
      </p>

      {nights === null ? (
        <p className="dt-hint">
          <T
            en={`${NIGHTS_LEAST} days after a night under ${SHORT_NIGHT_HOURS} hours and ${NIGHTS_LEAST} after a longer one, and this fills in. Hours are not on the log form yet: a sheet you bring in on the import page can carry them, and a night with nothing written down the day after is not a pair.`}
            bn={`${digits(SHORT_NIGHT_HOURS, "bn")} ঘণ্টার কম ঘুমের পরে ${digits(NIGHTS_LEAST, "bn")} দিন আর তার বেশি ঘুমের পরে ${digits(NIGHTS_LEAST, "bn")} দিন লেখা থাকলে এটা ভরে উঠবে। খাতার ফর্মে এখনো ঘণ্টার ঘর নেই: আমদানির পাতায় আনা একটা শিটে ঘণ্টা থাকতে পারে, আর যে রাতের পরের দিন কিছুই লেখা নেই সেটা জোড়া হয় না।`}
          />
        </p>
      ) : (
        <>
          <ul className="dt-tag-counts">
            <li>
              <span>
                <T
                  en={`After a night under ${nights.short} hours`}
                  bn={`${digits(nights.short, "bn")} ঘণ্টার কম ঘুমের পরের দিন`}
                />
                <span className="dt-row-src">
                  <T
                    en={`${nights.afterShort.days} days`}
                    bn={`${digits(nights.afterShort.days, "bn")} দিন`}
                  />
                </span>
              </span>
              <span className="mono">
                <T
                  en={`${round(nights.afterShort.meanKcal)} kcal a day`}
                  bn={`দিনে ${digits(round(nights.afterShort.meanKcal), "bn")} ক্যালোরি`}
                />
              </span>
            </li>
            <li>
              <span>
                <T en="After every other night" bn="বাকি সব রাতের পরের দিন" />
                <span className="dt-row-src">
                  <T
                    en={`${nights.afterRest.days} days`}
                    bn={`${digits(nights.afterRest.days, "bn")} দিন`}
                  />
                </span>
              </span>
              <span className="mono">
                <T
                  en={`${round(nights.afterRest.meanKcal)} kcal a day`}
                  bn={`দিনে ${digits(round(nights.afterRest.meanKcal), "bn")} ক্যালোরি`}
                />
              </span>
            </li>
          </ul>

          <p className="dt-said">
            <T
              en={`${round(nights.afterShort.meanKcal)} kcal a day on the ${nights.afterShort.days} days that followed a night under ${nights.short} hours, against ${round(nights.afterRest.meanKcal)} on the ${nights.afterRest.days} days that followed a longer one. That is ${round(Math.abs(nights.diff))} kcal ${nights.diff >= 0 ? "more" : "less"} a day.`}
              bn={`${digits(nights.short, "bn")} ঘণ্টার কম ঘুমের পরের ${digits(nights.afterShort.days, "bn")} দিনে দিনে ${digits(round(nights.afterShort.meanKcal), "bn")} ক্যালোরি, আর তার বেশি ঘুমের পরের ${digits(nights.afterRest.days, "bn")} দিনে ${digits(round(nights.afterRest.meanKcal), "bn")}। অর্থাৎ দিনে ${digits(round(Math.abs(nights.diff)), "bn")} ক্যালোরি ${nights.diff >= 0 ? "বেশি" : "কম"}।`}
            />
          </p>

          {nights.targetKcal === null || nights.overTarget === null
            || nights.restOverTarget === null ? (
              <p className="dt-hint">
                <T
                  en="A target on the goal page puts these two beside it as well as beside each other, which is the sentence the plan asks for."
                  bn="লক্ষ্যের পাতায় একটা লক্ষ্য দিলে এই দুটো কেবল একে অন্যের পাশে নয়, লক্ষ্যের পাশেও বসবে, আর পরিকল্পনায় ঠিক সেই কথাটাই চাওয়া হয়েছে।"
                />
              </p>
            ) : (
              <p className="dt-said">
                <T
                  en={`Against your own target of ${round(nights.targetKcal)} a day, the days after a short night sit ${round(Math.abs(nights.overTarget))} ${nights.overTarget >= 0 ? "above" : "below"} it and the rest ${round(Math.abs(nights.restOverTarget))} ${nights.restOverTarget >= 0 ? "above" : "below"}.`}
                  bn={`দিনে ${digits(round(nights.targetKcal), "bn")} ক্যালোরির নিজের লক্ষ্যের সাপেক্ষে, কম ঘুমের পরের দিনগুলো তার ${digits(round(Math.abs(nights.overTarget)), "bn")} ${nights.overTarget >= 0 ? "উপরে" : "নিচে"}, আর বাকিগুলো ${digits(round(Math.abs(nights.restOverTarget)), "bn")} ${nights.restOverTarget >= 0 ? "উপরে" : "নিচে"}।`}
                />
              </p>
            )}

          <p className="dt-coverage">
            <T
              en={`${nights.nights} of your rows carry an hours figure and ${nights.pairs} of those have a day with food written down after them, between ${nights.from} and ${nights.to}, which is ${nights.span} days. Your own middle night over them is ${one(nights.medianHours)} hours.`}
              bn={`আপনার ${digits(nights.nights, "bn")}টি সারিতে ঘুমের ঘণ্টা লেখা আছে, তার ${digits(nights.pairs, "bn")}টির পরের দিনে খাবারও লেখা আছে, ${digits(nights.from, "bn")} থেকে ${digits(nights.to, "bn")} পর্যন্ত, অর্থাৎ ${digits(nights.span, "bn")} দিনে। ওই রাতগুলোর মধ্যে আপনার মাঝারি রাত ${digits(one(nights.medianHours), "bn")} ঘণ্টার।`}
            />
          </p>
        </>
      )}

      <p className="dt-why">
        <T
          en="Described and not explained. Short sleep raises the hormone that makes you hungry and lowers the one that says you have had enough, and that is why the comparison is offset by a day; whether it is what your own two numbers are made of is not something a log can say. There is no sleep score here, no grade for a night, and no target for one either."
          bn="এটা বর্ণনা, ব্যাখ্যা নয়। কম ঘুমে ক্ষুধা বাড়ানোর হরমোন বাড়ে আর পেট ভরার সংকেত দেওয়া হরমোন কমে, আর সেজন্যই তুলনাটা একদিন সরিয়ে করা হয়; আপনার নিজের এই দুটো সংখ্যা সত্যিই তাই দিয়ে তৈরি কি না, সেটা খাতা বলতে পারে না। এখানে ঘুমের কোনো নম্বর নেই, কোনো রাতকে ভালো বা খারাপ বলা হয়নি, আর ঘুমের কোনো লক্ষ্যও নেই।"
        />
      </p>
    </section>
  );
}

/* ---- 5. adherence against the trend ---- */

function Holding({
  days, profile, today,
}: { days: Day[]; profile: Profile | null; today: string }) {
  const at = dayNumber(today);
  const engine = useMemo(() => bodyAndTarget(days, profile, at), [days, profile, at]);

  const held = useMemo(() => {
    if (!engine) return null;
    const w = weighings({ days, dayOf: dayNumber, today: at });
    return adherence({
      days, trend: trend(w.drawn), dayOf: dayNumber, today: at,
      targetKcal: engine.kcal,
    });
  }, [days, engine, at]);

  const groups = held
    ? ([["under", held.groups.under], ["held", held.groups.held],
      ["over", held.groups.over]] as const).filter(
      (g) => g[1].weeks > 0)
    : [];

  return (
    <section aria-labelledby="dt-hold-h">
      <h2 id="dt-hold-h">
        <T
          en="Holding the target, and what the trend did"
          bn="লক্ষ্য ধরে রাখা, আর ওজনের ধারা কী করল"
        />
      </h2>
      <p className="dt-intro">
        <T
          en="The one place your log and your weight meet. Weeks where the target was held, beside what the trend did in those weeks, which is the evidence for whether the target is the right one."
          bn="এখানেই আপনার খাতা আর আপনার ওজন এক জায়গায় আসে। যেসব সপ্তাহে লক্ষ্য ধরে রাখা গেছে, তার পাশে ওই সপ্তাহগুলোয় ওজনের ধারা কী করেছে, আর এটাই বলে দেয় লক্ষ্যটা ঠিক কি না।"
        />
      </p>

      {held === null ? (
        <p className="dt-hint">
          <T
            en="Three whole weeks with at least four logged days each, a target set on the goal page, and a weighing at each end of a week. Then this fills in. Two weeks would be two points, and two points make a line through anything."
            bn="অন্তত চার দিন করে লেখা তিনটি পুরো সপ্তাহ, লক্ষ্যের পাতায় ঠিক করা একটা লক্ষ্য, আর সপ্তাহের দুই প্রান্তে ওজন মাপা। তাহলেই এটা ভরে উঠবে। দুই সপ্তাহ মানে দুটি বিন্দু, আর দুটি বিন্দু দিয়ে যেকোনো দিকে রেখা টানা যায়।"
          />
        </p>
      ) : (
        <>
          <ul className="dt-tag-counts">
            {groups.map(([id, g]) => (
              <li key={id}>
                <span>
                  {id === "held" ? (
                    <T
                      en={`within ${held.band} kcal of the target`}
                      bn={`লক্ষ্যের ${digits(held.band, "bn")} ক্যালোরির মধ্যে`}
                    />
                  ) : id === "over" ? (
                    <T en="over the target" bn="লক্ষ্যের উপরে" />
                  ) : (
                    <T en="under the target" bn="লক্ষ্যের নিচে" />
                  )}
                  <span className="dt-row-src">
                    <T
                      en={`${g.weeks} week${g.weeks === 1 ? "" : "s"}, ${round(g.meanKcal)} kcal a day`}
                      bn={`${digits(g.weeks, "bn")} সপ্তাহ, দিনে ${digits(round(g.meanKcal), "bn")} ক্যালোরি`}
                    />
                  </span>
                </span>
                <span className="mono">
                  {g.kgPerWeek === null ? (
                    <T en="not weighed" bn="ওজন নেওয়া হয়নি" />
                  ) : (
                    <T
                      en={`${show(g.kgPerWeek)} kg a week`}
                      bn={`সপ্তাহে ${digits(show(g.kgPerWeek), "bn")} কেজি`}
                    />
                  )}
                </span>
              </li>
            ))}
          </ul>
          <p className="dt-said">
            <T
              en={`Measured over ${held.weeks.length} whole weeks against a target of ${round(held.targetKcal)} kcal a day, in blocks of seven counted back from today, and only weeks with at least four days written down.`}
              bn={`দিনে ${digits(round(held.targetKcal), "bn")} ক্যালোরির লক্ষ্যের সাপেক্ষে ${digits(held.weeks.length, "bn")}টি পুরো সপ্তাহের হিসাব, আজ থেকে পিছিয়ে সাত দিনের ভাগে, আর কেবল সেই সপ্তাহগুলো যেগুলোয় অন্তত চার দিন লেখা আছে।`}
            />
          </p>
          {held.comparable ? null : (
            <p className="dt-hint">
              <T
                en="Not enough weeks in two of the groups to compare them yet, so the rows above are what there is rather than a finding. Two weeks in each is the least this can be read from."
                bn="তুলনা করার মতো যথেষ্ট সপ্তাহ এখনো দুটি দলে জমেনি, তাই উপরের সারিগুলো যা আছে তাই, কোনো সিদ্ধান্ত নয়। প্রতিটি দলে অন্তত দুই সপ্তাহ লাগবে।"
              />
            </p>
          )}
          <p className="dt-why">
            <T
              en="A rate here is the change in the trend across a week divided by the days it actually spanned, so a week weighed twice four days apart is not counted as a whole one. Nothing about this says a week was good or bad: it says what the arithmetic came to."
              bn="এখানে হারটা হলো এক সপ্তাহে ওজনের ধারার পরিবর্তনকে যত দিনের ব্যবধানে মাপা হয়েছে তা দিয়ে ভাগ করা, তাই চার দিনের ব্যবধানে দুবার মাপা সপ্তাহকে পুরো সপ্তাহ ধরা হয় না। কোন সপ্তাহ ভালো বা খারাপ, এটা তা বলে না: শুধু হিসাবটা কী দাঁড়াল তাই বলে।"
            />
          </p>
        </>
      )}
    </section>
  );
}

/* ---- 6. what this reader's own deficit actually does ---- */

function Calibration({
  days, profile, today,
}: { days: Day[]; profile: Profile | null; today: string }) {
  const at = dayNumber(today);
  const engine = useMemo(() => bodyAndTarget(days, profile, at), [days, profile, at]);

  const cal = useMemo(() => {
    if (!engine) return null;
    const w = weighings({ days, dayOf: dayNumber, today: at });
    const learned = learnedHere({
      weights: w.fittable,
      intakes: days.filter((d) => d.kcal != null)
        .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
      today: at,
    });
    return calibration({ learned, estimatedBurn: engine.estimated });
  }, [days, engine, at]);

  return (
    <section aria-labelledby="dt-cal-h">
      <h2 id="dt-cal-h">
        <T
          en="What your own deficit actually does"
          bn="আপনার নিজের ঘাটতি আসলে কী করে"
        />
      </h2>
      {cal === null ? (
        <p className="dt-hint">
          <T
            en="A month of weighings and a month of logging, and this says what a gap of a given size actually does to your trend, rather than what the equation says it should. It is measured on the only body in question, which makes it better than any formula on this site."
            bn="এক মাসের ওজন আর এক মাসের খাবার লেখা থাকলে এটা বলবে একটা নির্দিষ্ট ঘাটতি আপনার ওজনের ধারায় আসলে কী করে, সূত্র যা বলে তা নয়। এটা একমাত্র যে শরীরটার কথা হচ্ছে তার উপরেই মাপা, তাই এই সাইটের যেকোনো সূত্রের চেয়ে এটা ভালো।"
          />
        </p>
      ) : (
        <>
          <div className="dt-figure dt-figure-lead">
            <h3><T en="Predicted, against measured" bn="সূত্রের হিসাব, আর যা মাপা হলো" /></h3>
            <p className="dt-value">
              <T
                en={`${show(Math.abs(cal.observedKgPerWeek))} kg a week`}
                bn={`সপ্তাহে ${digits(show(Math.abs(cal.observedKgPerWeek)), "bn")} কেজি`}
              />
            </p>
            <p className="dt-said">
              <T
                en={`Over ${cal.days} days you averaged ${round(cal.meanIntake)} kcal on the ${cal.logged} days you wrote down, against an estimated burn of ${round(cal.estimatedBurn)}. That gap of ${round(Math.abs(cal.gap))} a day works out at ${show(Math.abs(cal.predictedKgPerWeek))} kg a week on the arithmetic, and your trend moved ${show(Math.abs(cal.observedKgPerWeek))}.`}
                bn={`${digits(cal.days, "bn")} দিনের মধ্যে যে ${digits(cal.logged, "bn")} দিন লিখেছেন সেখানে গড়ে দিনে ${digits(round(cal.meanIntake), "bn")} ক্যালোরি, আর সূত্রের হিসাবে খরচ প্রায় ${digits(round(cal.estimatedBurn), "bn")}। দিনে ${digits(round(Math.abs(cal.gap)), "bn")} ক্যালোরির এই ফারাক হিসাবমতে সপ্তাহে ${digits(show(Math.abs(cal.predictedKgPerWeek)), "bn")} কেজি, আর আপনার ধারা সরেছে ${digits(show(Math.abs(cal.observedKgPerWeek)), "bn")}।`}
              />
            </p>
            {cal.ratio === null ? (
              <p className="dt-coverage">
                <T
                  en="The gap is too small to divide by, so there is no ratio here. Near maintenance one biscuit moves it from three to minus three, and a figure that does that is not a constant."
                  bn="ফারাকটা এত কম যে তা দিয়ে ভাগ করা যায় না, তাই এখানে কোনো অনুপাত নেই। খরচের কাছাকাছি খেলে একটা বিস্কুটেই সেটা তিন থেকে বিয়োগ তিনে চলে যায়, আর যে সংখ্যা তা করে সেটা ধ্রুবক নয়।"
                />
              </p>
            ) : (
              <p className="dt-coverage">
                <T
                  en={`Which is ${Math.round(cal.ratio * 100)}% of what the equation predicted: ${show(Math.abs(cal.observedKgPerWeek))} divided by ${show(Math.abs(cal.predictedKgPerWeek))}.`}
                  bn={`অর্থাৎ সূত্র যা বলেছিল তার ${digits(Math.round(cal.ratio * 100), "bn")}%: ${digits(show(Math.abs(cal.observedKgPerWeek)), "bn")} ভাগ ${digits(show(Math.abs(cal.predictedKgPerWeek)), "bn")}।`}
                />
              </p>
            )}
          </div>
          <p className="dt-why">
            <T
              en="What the difference is made of is not knowable from here, and this does not guess. Food that was eaten and not written down, an activity answer that is a little generous, and a body that has quietly turned its own burn down all move this number the same way, and it holds all three at once."
              bn="এই ফারাকটা কী দিয়ে তৈরি তা এখান থেকে জানা যায় না, আর এটা অনুমানও করে না। খেয়েছেন অথচ লেখেননি এমন খাবার, একটু বাড়িয়ে দেওয়া চলাফেরার উত্তর, আর নিজে থেকেই খরচ কমিয়ে ফেলা শরীর, তিনটেই সংখ্যাটাকে একদিকে সরায়, আর এই সংখ্যাটা তিনটেকেই একসঙ্গে ধরে রাখে।"
            />
          </p>
          <p className="dt-why">
            <T
              en="The burn it is compared against comes out of your height, weight, age and activity answer and never out of your weighings, which is what makes this a calibration rather than a circle. Compared against a burn learned from the trend it would come to a hundred percent for everybody, every time."
              bn="যে খরচের সঙ্গে তুলনা করা হচ্ছে সেটা আসে আপনার উচ্চতা, ওজন, বয়স আর চলাফেরার উত্তর থেকে, আপনার ওজন মাপা থেকে নয়, আর এটাই একে বৃত্ত না বানিয়ে একটা যাচাই বানায়। ওজনের ধারা থেকে শেখা খরচের সঙ্গে তুলনা করলে এটা সবার জন্য, প্রতিবার, একশো শতাংশ হতো।"
            />
          </p>
        </>
      )}
    </section>
  );
}

/* ============================================================
   section 17: what food costs
   ============================================================ */

function Budget({
  w, entries, profile, place, month,
}: {
  w: Who;
  entries: Entry[];
  profile: Profile | null;
  place: Place;
  month: string;
}) {
  const lang = useToolLang();
  const [saved, setSaved] = useState<Profile | null>(null);
  const [said, setSaid] = useState<"" | "saved" | "failed">("");
  const p = saved ?? profile;

  const currency: "BDT" | "GBP" = (p?.budget_currency === "GBP" || p?.budget_currency === "BDT")
    ? p.budget_currency
    : (place === "uk" ? "GBP" : "BDT");
  const sign = MONEY[currency];

  const bill: Spend = useMemo(
    () => spend({ entries, resolve, currency, now: month }),
    [entries, currency, month],
  );
  const against = useMemo(
    () => againstBudget(bill, p?.food_budget ?? 0),
    [bill, p],
  );

  const set = async (patch: Profile): Promise<void> => {
    const next = { ...(p ?? {}), ...patch };
    const before = p;
    setSaved(next);
    const ok = await saveProfile(w, next);
    if (!ok) setSaved(before);
    setSaid(ok ? "saved" : "failed");
    window.setTimeout(() => setSaid(""), ok ? 1600 : 4000);
  };

  const thin = bill.days === 0 || bill.coverage < COVERAGE_FLOOR;

  return (
    <section aria-labelledby="dt-budget-h">
      <h2 id="dt-budget-h">
        <T en="What your food cost" bn="আপনার খাবারের খরচ কত হলো" />
      </h2>
      <p className="dt-intro">
        <T
          en="This is a personal finance site, so the obvious question gets asked here rather than nowhere. A budget is a budget like any other, and what this does with yours is plot the spend against the eating: the interesting reading is not the total but the ratio."
          bn="এটা টাকাপয়সা নিয়ে লেখা একটা সাইট, তাই স্বাভাবিক প্রশ্নটা এখানেই করা হয়, কোথাও না করে। বাজেট আর দশটা বাজেটের মতোই, আর আপনার বাজেট দিয়ে এটা যা করে তা হলো খরচের সঙ্গে খাওয়ার হিসাব মেলানো: আসল কথা মোট টাকা নয়, অনুপাতটা।"
        />
      </p>

      <div className="dt-budget-form">
        <Field
          id="dt-budget" type="number" inputMode="numeric" min={0} max={200000} step="10"
          label={<T en="Your food budget for a week" bn="সপ্তাহে খাবারের বাজেট" />}
          hint={(
            <T
              en="What you mean to spend on food in a week. It is kept on your account and it is never compared with anybody else's."
              bn="এক সপ্তাহে খাবারের পিছনে যত খরচ করতে চান। এটা আপনার অ্যাকাউন্টে থাকে আর কখনো অন্য কারো সঙ্গে মেলানো হয় না।"
            />
          )}
          value={p?.food_budget ? String(p.food_budget) : ""}
          onChange={(e) => void set({ food_budget: Number(e.target.value) || undefined })}
        />
        <Select
          id="dt-budget-cur"
          label={<T en="In which money" bn="কোন মুদ্রায়" />}
          value={currency}
          onChange={(e) => void set({ budget_currency: e.target.value })}
        >
          <option value="BDT">{lang === "bn" ? "৳ টাকা" : "BDT, taka"}</option>
          <option value="GBP">{lang === "bn" ? "£ পাউন্ড" : "GBP, pounds"}</option>
        </Select>
        <span
          className="dt-save" data-state={said || "idle"}
          role="status" aria-live="polite"
        >
          {said === "failed"
            ? <T en="Not saved. Nothing changed." bn="জমা হয়নি। কিছুই বদলায়নি।" />
            : said === "saved" ? <T en="Saved" bn="জমা হয়েছে" /> : null}
        </span>
      </div>

      {thin ? (
        <p className="dt-hint">
          <T
            en="Half of what you log needs a price on it before any of this can be read. A price comes with a food chosen from the library; a food typed by hand, and a food out of a public database, carry none, and a cost worked out from a third of the food would be a cost about a third of the food."
            bn="এসব পড়ার আগে আপনার লেখা খাবারের অন্তত অর্ধেকের দাম জানা থাকতে হবে। তালিকা থেকে বেছে নেওয়া খাবারের সঙ্গে দাম আসে; হাতে লেখা খাবার বা বাইরের তথ্যভান্ডার থেকে নেওয়া খাবারের সঙ্গে আসে না, আর খাবারের এক তৃতীয়াংশ থেকে বের করা খরচ ওই এক তৃতীয়াংশেরই খরচ।"
          />
        </p>
      ) : (
        <>
          <div className="dt-readout">
            <h3 className="dt-readout-h">
              <T
                en="Over the food this site has a price for"
                bn="যে খাবারের দাম এই সাইট জানে, তার উপর"
              />
            </h3>
            <div className="dt-figure">
              <h3><T en="A day" bn="দিনে" /></h3>
              <p className="dt-value">{sign}{digits(money(bill.perDay), lang)}</p>
              <p className="dt-said">
                <T
                  en={`${sign}${money(bill.cost)} across ${bill.days} logged days`}
                  bn={`${digits(bill.days, "bn")} দিনে মোট ${sign}${digits(money(bill.cost), "bn")}`}
                />
              </p>
            </div>
            <div className="dt-figure">
              <h3><T en="Per 1000 kcal" bn="প্রতি ১০০০ ক্যালোরিতে" /></h3>
              <p className="dt-value">{sign}{digits(money(bill.per1000Kcal), lang)}</p>
              <p className="dt-said">
                <T
                  en={`${sign}${money(bill.cost)} for ${round(bill.kcalPriced)} kcal`}
                  bn={`${digits(round(bill.kcalPriced), "bn")} ক্যালোরির জন্য ${sign}${digits(money(bill.cost), "bn")}`}
                />
              </p>
            </div>
            <div className="dt-figure">
              <h3><T en="Per 100 g of protein" bn="প্রতি ১০০ গ্রাম প্রোটিনে" /></h3>
              <p className="dt-value">
                {bill.per100gProtein === null
                  ? <T en="not known" bn="জানা নেই" />
                  : `${sign}${digits(money(bill.per100gProtein), lang)}`}
              </p>
              <p className="dt-said">
                <T
                  en={`from ${round(bill.proteinPriced)} g of protein in the priced food`}
                  bn={`দাম জানা খাবারে ${digits(round(bill.proteinPriced), "bn")} গ্রাম প্রোটিন থেকে`}
                />
              </p>
            </div>
            <p className="dt-readout-foot">
              <T
                en={`Computed from ${pct(bill.coverage)}% of what you logged, by energy: ${round(bill.kcalPriced)} kcal of ${round(bill.kcalAll)}. A row priced in the other money is not added in and falls into the rest, because an exchange rate in a diet tool would be a fact with no date on it.`}
                bn={`আপনার লেখা খাবারের ${digits(pct(bill.coverage), "bn")}% থেকে হিসাব করা, ক্যালোরির হিসাবে: ${digits(round(bill.kcalAll), "bn")} ক্যালোরির মধ্যে ${digits(round(bill.kcalPriced), "bn")}। অন্য মুদ্রায় দাম দেওয়া সারি এতে যোগ হয় না, বাকির মধ্যে পড়ে, কারণ ডায়েটের হিসাবে বিনিময় হার বসানো মানে তারিখহীন একটা তথ্য বসানো।`}
              />
            </p>
          </div>

          {against === null ? (
            <p className="dt-hint">
              <T
                en="Put a weekly budget in the box above and this compares the two. Nothing about that comparison is a judgement: it is your number and your log, and neither of them is graded."
                bn="উপরের ঘরে সপ্তাহের বাজেট লিখলে এটা দুটোর তুলনা দেখাবে। ওই তুলনায় বিচারের কিছু নেই: সংখ্যাটা আপনার, খাতাটাও আপনার, আর কোনোটাকেই নম্বর দেওয়া হয় না।"
              />
            </p>
          ) : (
            <div className="dt-figure dt-figure-lead">
              <h3><T en="Against your budget" bn="আপনার বাজেটের সঙ্গে" /></h3>
              <p className="dt-value">
                {sign}{digits(money(against.perDay), lang)}
              </p>
              <p className="dt-said">
                <T
                  en={`${sign}${money(against.weekly)} a week is ${sign}${money(against.perDay)} a day. The food this site has a price for came to ${sign}${money(against.spentPerDay)} a day.`}
                  bn={`সপ্তাহে ${sign}${digits(money(against.weekly), "bn")} মানে দিনে ${sign}${digits(money(against.perDay), "bn")}। এই সাইট যে খাবারের দাম জানে সেটা দিনে দাঁড়াল ${sign}${digits(money(against.spentPerDay), "bn")}।`}
                />
              </p>
              {against.wholeLogPerDay === null ? null : (
                <p className="dt-coverage">
                  <T
                    en={`If the rest of your food costs what the priced part does per calorie, the whole log is about ${sign}${money(against.wholeLogPerDay)} a day. That is a projection and not a bill: it scales ${sign}${money(against.spentPerDay)} up by the ${pct(bill.coverage)}% it was drawn from.`}
                    bn={`বাকি খাবারের ক্যালোরিপ্রতি দাম যদি দাম জানা অংশের মতোই হয়, তবে পুরো খাতাটা দিনে প্রায় ${sign}${digits(money(against.wholeLogPerDay), "bn")}। এটা কোনো বিল নয়, একটা অনুমান: ${sign}${digits(money(against.spentPerDay), "bn")} কে যে ${digits(pct(bill.coverage), "bn")}% থেকে নেওয়া হয়েছে সেই অনুপাতে বাড়ানো হয়েছে।`}
                  />
                </p>
              )}
            </div>
          )}

          {bill.stale.length ? (
            <p className="dt-hint">
              <T
                en={`${bill.stale.length} of the foods in this sum carry a price checked more than six months ago, and they are drawn with their date rather than passed off as current. A price is a fact with a date on it and an undated one is worse than none.`}
                bn={`এই হিসাবের ${digits(bill.stale.length, "bn")}টি খাবারের দাম ছয় মাসের বেশি পুরনো, আর সেগুলো তারিখসহ দেখানো হয়েছে, নতুন বলে চালানো হয়নি। দামের সঙ্গে তারিখ থাকে, আর তারিখহীন দাম কোনো দামের চেয়েও খারাপ।`}
              />
            </p>
          ) : null}
        </>
      )}
      <p className="dt-why">
        <T
          en="No shop, no link and no basket, here or anywhere in this tool. These are reference figures for arithmetic, and money on this page is a fact rather than a verdict: what a gram of protein costs you is a number, and whether you spent too much is not this site's to say."
          bn="কোনো দোকান নেই, কোনো লিংক নেই, কোনো বাজারের তালিকাও নেই, এখানে বা এই টুলের কোথাও। এগুলো হিসাব করার জন্য রেফারেন্স সংখ্যা, আর এই পাতায় টাকা একটা তথ্য, কোনো রায় নয়: এক গ্রাম প্রোটিনে আপনার কত খরচ হলো সেটা একটা সংখ্যা, আর আপনি বেশি খরচ করেছেন কি না সেটা এই সাইটের বলার কথা নয়।"
        />
      </p>
    </section>
  );
}

/* ---- what a calorie costs, out of the library ---- */

function PriceOfFood({ place, month }: { place: Place; month: string }) {
  const lang = useToolLang();
  const [where, setWhere] = useState<Place>(place);
  useEffect(() => { setWhere(place); }, [place]);
  const currency: "BDT" | "GBP" = where === "uk" ? "GBP" : "BDT";
  const sign = MONEY[currency];

  const rows = useMemo(() => costByTag(forPlace(where), currency), [where, currency]);
  const protein = useMemo(() => proteinPrice(forPlace(where), currency), [where, currency]);
  /* WHEN, OUT OF THE ROWS RATHER THAN TYPED HERE. The library is
     priced a whole month at a time on purpose, so this is one
     value; taking the OLDEST is what keeps that honest if it ever
     stops being. */
  const checked = useMemo(() => [...forPlace(where)]
    .map((f) => f.pricedOn)
    .filter((m): m is string => Boolean(m))
    .sort()[0], [where]);
  const staple = rows.find((r) => r.tag === "staple");
  const meat = rows.find((r) => r.tag === "protein");

  /* THE MULTIPLE IN THE OTHER TABLE, COMPUTED RATHER THAN
     WRITTEN. Section 17 says keto costs substantially more in
     Bangladesh than in Britain, and whether that is still true is
     a fact about two price tables rather than about a sentence.
     So the page works both out and prints them, and a price
     checked again next month changes what it says. */
  const elsewhere = useMemo(() => {
    const other: Place = where === "uk" ? "bd" : "uk";
    const by = costByTag(forPlace(other), other === "uk" ? "GBP" : "BDT");
    const a = by.find((r) => r.tag === "staple");
    const b = by.find((r) => r.tag === "protein");
    return a && b && a.per1000Kcal > 0 ? b.per1000Kcal / a.per1000Kcal : null;
  }, [where]);

  return (
    <section aria-labelledby="dt-price-h">
      <h2 id="dt-price-h">
        <T en="What a calorie costs" bn="এক ক্যালোরির দাম কত" />
      </h2>
      <p className="dt-intro">
        <T
          en="Two of this tool's own suggestions have a price attached and should be honest about it. This is that price, out of the library rather than out of anybody's log, so it needs no account to read."
          bn="এই টুলের নিজের দুটি পরামর্শের সঙ্গে দাম জড়িয়ে আছে, আর সেটা খোলাখুলি বলা দরকার। এই দামটা তালিকা থেকে আসে, কারো খাতা থেকে নয়, তাই এটা পড়তে কোনো অ্যাকাউন্ট লাগে না।"
        />
      </p>
      <div
        className="dt-tags" role="group"
        aria-label={lang === "bn" ? "কোন তালিকা" : "Which library"}
      >
        <ChipButton pressed={where === "bd"} onClick={() => setWhere("bd")}>
          <T en="Bangladesh" bn="বাংলাদেশ" />
        </ChipButton>
        <ChipButton pressed={where === "uk"} onClick={() => setWhere("uk")}>
          <T en="The UK" bn="যুক্তরাজ্য" />
        </ChipButton>
      </div>

      <div className="dt-table-wrap">
        <table className="dt-table">
          <caption className="sr-only">
            <T
              en="What a thousand calories costs, by kind of food"
              bn="খাবারের ধরন অনুযায়ী এক হাজার ক্যালোরির দাম"
            />
          </caption>
          <thead>
            <tr>
              <th scope="col"><T en="Kind of food" bn="খাবারের ধরন" /></th>
              <th scope="col"><T en="Per 1000 kcal" bn="প্রতি ১০০০ ক্যালোরিতে" /></th>
              <th scope="col"><T en="Per 100 g protein" bn="প্রতি ১০০ গ্রাম প্রোটিনে" /></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.tag}>
                <th scope="row">
                  <T
                    en={TAG_WORDS[r.tag]?.en ?? r.tag}
                    bn={TAG_WORDS[r.tag]?.bn ?? r.tag}
                  />
                  <span className="dt-row-src">
                    <T
                      en={`the middle of ${r.rows} priced rows`}
                      bn={`দাম জানা ${digits(r.rows, "bn")}টি সারির মাঝেরটা`}
                    />
                  </span>
                </th>
                <td className="mono">{sign}{digits(money(r.per1000Kcal), lang)}</td>
                <td className="mono">
                  {r.per100gProtein === null
                    ? "-"
                    : `${sign}${digits(money(r.per100gProtein), lang)}`}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {staple && meat ? (
        <p className="dt-said">
          <T
            en={`A staple calorie is a fraction of a protein one: ${sign}${money(staple.per1000Kcal)} per 1000 kcal against ${sign}${money(meat.per1000Kcal)} for the middle protein row, about ${times(meat.per1000Kcal / staple.per1000Kcal)} times. That is the figure behind the line that a very low carbohydrate way of eating costs more.${elsewhere === null ? "" : ` In the other table the same multiple is ${times(elsewhere)}, so on these prices it is not a heavier tax in one place than in the other.`}`}
            bn={`প্রধান খাবারের ক্যালোরি প্রোটিনের ক্যালোরির একটা ভগ্নাংশ: প্রতি ১০০০ ক্যালোরিতে ${sign}${digits(money(staple.per1000Kcal), "bn")}, আর প্রোটিনের মাঝের সারিতে ${sign}${digits(money(meat.per1000Kcal), "bn")}, অর্থাৎ প্রায় ${digits(times(meat.per1000Kcal / staple.per1000Kcal), "bn")} গুণ। খুব কম শর্করার খাওয়া বেশি খরচের, এই কথার পিছনের সংখ্যা এটাই।${elsewhere === null ? "" : ` অন্য তালিকায় একই গুণটা ${digits(times(elsewhere), "bn")}, অর্থাৎ এই দামে কোনো এক জায়গায় বাড়তি বোঝা পড়ছে না।`}`}
          />
        </p>
      ) : null}

      {protein ? (
        <p className="dt-said">
          <T
            en={`Protein is where the spread is: ${sign}${money(protein.cheapestPer100g)} per 100 g of it at the cheap end, ${protein.cheapest.en}, against ${sign}${money(protein.medianPer100g)} for the middle of the ${protein.rows} priced rows that carry protein, about ${times(protein.times)} times. A higher protein target costs more, and how much more is a choice rather than a fact.`}
            bn={`ফারাকটা প্রোটিনেই: সবচেয়ে সস্তা দিকে প্রতি ১০০ গ্রাম প্রোটিনে ${sign}${digits(money(protein.cheapestPer100g), "bn")}, অর্থাৎ ${protein.cheapest.bn}, আর প্রোটিন আছে এমন দাম জানা ${digits(protein.rows, "bn")}টি সারির মাঝেরটায় ${sign}${digits(money(protein.medianPer100g), "bn")}, প্রায় ${digits(times(protein.times), "bn")} গুণ। বেশি প্রোটিনের লক্ষ্য বেশি খরচের, আর কতটা বেশি সেটা তথ্য নয়, আপনার বেছে নেওয়া।`}
          />
        </p>
      ) : null}

      <p className="dt-said">
        <T en="Prices checked" bn="দাম যাচাই করা হয়েছে" />
        <Priced on={checked} now={month} lang={lang} />
      </p>
      <p className="dt-why">
        <T
          en="The middle row of each group rather than the average of it, because one expensive row would otherwise become the sentence. A food can be in two groups: dal is counted as a staple and as a protein, and that is why the two columns do not separate as cleanly as the two words do."
          bn="প্রতিটি দলের গড় নয়, মাঝের সারিটা নেওয়া হয়েছে, কারণ নইলে একটা দামি সারিই পুরো কথাটা হয়ে যেত। একটা খাবার দুই দলেই থাকতে পারে: ডালকে প্রধান খাবার আর প্রোটিন, দুটোই ধরা হয়েছে, আর এ কারণেই কথা দুটো যত আলাদা, দুই ঘরের সংখ্যা তত আলাদা হয় না।"
        />
      </p>
    </section>
  );
}

/* ============================================================
   the one assembly two of the readings above share
   ============================================================ */

/** The body, the estimated burn and the day's target, assembled
    the way `goal-panel.tsx` assembles them.

    Null where the profile has not answered enough to build a
    body, which is the same condition every other page of this
    tool refuses on: there is no default height and no default
    age, because a target built on one is a number about
    somebody else. */
function bodyAndTarget(days: Day[], profile: Profile | null, today: number) {
  const points = days.filter((d) => d.weightKg != null)
    .map((d) => ({ day: dayNumber(d.date), kg: d.weightKg as number }))
    .sort((a, b) => b.day - a.day);
  const latest = points[0];
  if (!profile?.height_cm || !profile.birth_year || !latest) return null;

  const body: Body = {
    heightCm: profile.height_cm,
    weightKg: latest.kg,
    ageYears: new Date().getUTCFullYear() - profile.birth_year,
    sex: profile.sex ?? "male",
    ancestry: profile.ancestry ?? "general",
    waistCm: [...days].reverse().find((d) => d.waistCm != null)?.waistCm,
    neckCm: [...days].reverse().find((d) => d.neckCm != null)?.neckCm,
    hipCm: [...days].reverse().find((d) => d.hipCm != null)?.hipCm,
  };

  const fat = fatEstimate(body);
  const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);
  /* THE ESTIMATE AND NOT THE LEARNED FIGURE, deliberately, and
     the calibration above is the reason: a burn learned from the
     trend cannot be used to predict the trend. `today` is here
     so a caller cannot pass a window that ends in the future. */
  const estimated = estimatedBurn(rest.kcal, activityFactor(profile.activity ?? "sedentary"));
  const t = target({
    body,
    maintenance: estimated,
    restingKcal: rest.kcal,
    kind: profile.goal_kind ?? "maintain",
    ratePct: profile.goal_rate ?? 0.5,
  });
  return { estimated, kcal: t.kcal };
}
