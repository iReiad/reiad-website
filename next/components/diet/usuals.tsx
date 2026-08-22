"use client";

/* ============================================================
   diet/usuals.tsx: the two buttons that decide whether anybody
   keeps a food log at all.

   `DIET.md` section 13. Copy yesterday is the most pressed
   button in any food diary and it is usually right. Your usuals
   is the other half: most people eat the same forty things, so
   anything logged three times should be one tap, and the ones
   eaten around this hour should be at the top, because
   breakfast at eight in the morning should offer breakfast.

   ---- worked out, never asked for ----

   Nothing here asks the reader to curate a list. The ranking is
   COUNTED out of the log, which is the rule at the top of
   `CLAUDE.md`: a page that says how many of something there are
   counts them rather than remembering them. `usualsFrom()` in
   `next/lib/recipes.ts` is that count and one sort, and
   `next/recipes.test.ts` asserts both.

   ---- a copy is a copy ----

   Every row written here carries its own numbers, exactly as it
   did the day it was first logged. Nothing points at anything,
   so correcting a portion size next week does not rewrite last
   week, and a public database changing its mind about a biscuit
   cannot reach into somebody's history.

   ---- and the clock is read after the first paint ----

   The hour has to come from an effect. The server has no idea
   what time it is where the reader is, so reading it during
   render would put one order in the HTML and another in the
   browser, which is React error #418 and the day every
   calculator on this site went blank.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import type { Entry } from "@reiad/shared/diet";
import { portionWords } from "@reiad/shared/foods";
import { USUAL_AT, copyOf, usualsFrom } from "../../lib/recipes";
import {
  addEntry, clockTime, getEntries, isoDate, shiftDate, who, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { T, TBlock, digits, useToolLang } from "./lang";

/** How far back the count reads. Two months is enough for a
    pattern and short enough that a thing somebody stopped eating
    in the spring stops being offered. */
const WINDOW = 60;

/** The six at the top. Section 13's own number, and the reason
    it is six rather than everything: a one-tap list you have to
    read is not one tap. */
const OFFERED = 6;

const amountOf = (e: Entry, lang: "en" | "bn"): string =>
  e.qty === undefined || !e.unit
    ? ""
    : portionWords(digits(e.qty, lang), e.unit, lang);

const nameOf = (e: Entry, lang: "en" | "bn"): string =>
  (lang === "bn" ? e.labelBn : undefined) ?? e.label;

export function Usuals() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [going, setGoing] = useState<Record<string, "going" | "done" | "failed">>({});
  const [copying, setCopying] = useState<"" | "going" | "done" | "failed">("");

  /* Undefined until an effect has run. See the header: the hour
     cannot be read during render. */
  const [hour, setHour] = useState<number | undefined>(undefined);
  useEffect(() => { setHour(new Date().getHours()); }, []);

  const today = isoDate();
  const yesterday = shiftDate(today, -1);

  useEffect(() => {
    let live = true;
    const paint = (): void => {
      void who().then((me) => { if (live) { setW(me); setAnswered(true); } });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { live = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let live = true;
    /* ONE QUERY for both halves of this page. Yesterday is a
       filter over the same rows rather than a second request:
       the window already covers it and a second round trip for
       one day is a second thing that can fail. */
    void getEntries(w, shiftDate(today, -WINDOW)).then((found) => {
      if (!live) return;
      setEntries(found);
      setLoaded(true);
    });
    return () => { live = false; };
  }, [w, today]);

  const usuals = useMemo(
    () => usualsFrom(entries, hour).slice(0, OFFERED),
    [entries, hour],
  );
  const lastNight = useMemo(
    () => entries.filter((e) => e.date === yesterday && !e.planned),
    [entries, yesterday],
  );

  const again = async (row: Entry, key: string): Promise<void> => {
    if (!w) return;
    setGoing((state) => ({ ...state, [key]: "going" }));
    /* Copied on to today at THIS hour rather than at the hour it
       was eaten before, because the reader is logging it now. */
    const copy = { ...copyOf([row], today)[0], atTime: clockTime() };
    const wrote = await addEntry(w, copy);
    setGoing((state) => ({ ...state, [key]: wrote ? "done" : "failed" }));
    if (wrote) setEntries((all) => [...all, { ...copy, id: wrote.id }]);
  };

  const copyYesterday = async (): Promise<void> => {
    if (!w || !lastNight.length) return;
    setCopying("going");
    const rows = copyOf(lastNight, today);
    const wrote = await Promise.all(rows.map((row) => addEntry(w, row)));
    const landed = wrote.filter((r): r is Entry => r !== null);
    setEntries((all) => [...all, ...landed]);
    setCopying(landed.length === rows.length ? "done" : "failed");
  };

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  if (!w) {
    return (
      <p className="dt-invite">
        <T
          en="Your usuals are worked out from what you have logged, so they need an account to be worked out from."
          bn="আপনার নিয়মিত খাবারগুলো আপনার লেখা খাতা থেকেই বের করা হয়, তাই হিসাব করার জন্য একটা অ্যাকাউন্ট লাগে।"
        />
      </p>
    );
  }

  return (
    <div className="dt-usuals">
      <section className="dt-usual-set" aria-labelledby="dt-usual-h">
        <h2 id="dt-usual-h"><T en="Your usuals" bn="আপনি যা নিয়মিত খান" /></h2>

        {!loaded ? (
          <p className="dt-intro">
            <T en="Counting what you log most." bn="আপনি সবচেয়ে বেশি যা লেখেন তা গোনা হচ্ছে।" />
          </p>
        ) : null}

        {loaded && !usuals.length ? (
          <p className="dt-hint">
            <T
              en={`Nothing yet. Anything logged ${USUAL_AT} times turns up here as one tap, and the ones you eat around this time of day come first.`}
              bn={`এখনো কিছু নেই। যা ${digits(USUAL_AT, "bn")} বার লেখা হয়েছে তা এখানে এক চাপে চলে আসে, আর দিনের এই সময়ে যেগুলো খান সেগুলো আগে থাকে।`}
            />
          </p>
        ) : null}

        <ul className="dt-usual-list">
          {usuals.map((u) => (
            <li key={u.key}>
              <button
                type="button" className="dt-hit"
                disabled={going[u.key] === "going"}
                onClick={() => void again(u.last, u.key)}
              >
                <span className="dt-hit-name">
                  {nameOf(u.last, lang)}
                  <span className="dt-hit-por">{amountOf(u.last, lang)}</span>
                </span>
                <span className="dt-hit-kcal mono">
                  {u.last.kcal === undefined ? "" : digits(Math.round(u.last.kcal), lang)}
                </span>
                <span className="dt-hit-src">
                  <T
                    en={`${u.times} times${u.atThisTime ? ", around now" : ""}`}
                    bn={`${digits(u.times, "bn")} বার${u.atThisTime ? ", এই সময়ে" : ""}`}
                  />
                </span>
              </button>
              {going[u.key] === "done" ? (
                <span className="dt-hint">
                  <T en="Logged." bn="লেখা হয়েছে।" />
                </span>
              ) : null}
              {going[u.key] === "failed" ? (
                <span className="dt-hint">
                  <T en="Not saved yet." bn="এখনো জমা হয়নি।" />
                </span>
              ) : null}
            </li>
          ))}
        </ul>

        {usuals.length ? (
          <p className="dt-why">
            <T
              en="Counted out of your own log over the last two months, not a list you have to keep. One tap writes it again on to today, with its own numbers."
              bn="গত দুই মাসে আপনার নিজের খাতা থেকে গোনা, আপনার রাখা কোনো তালিকা নয়। এক চাপে সেটা আজকের দিনে আবার লেখা হয়, নিজের সংখ্যাগুলো নিয়েই।"
            />
          </p>
        ) : null}
      </section>

      <section className="dt-yesterday" aria-labelledby="dt-yest-h">
        <h2 id="dt-yest-h"><T en="Yesterday again" bn="গতকালেরটাই আবার" /></h2>

        {loaded && !lastNight.length ? (
          <p className="dt-intro">
            <T
              en="Nothing was logged yesterday, so there is nothing to copy. It is the most pressed button in any food diary once there is."
              bn="গতকাল কিছু লেখা হয়নি, তাই কপি করার কিছু নেই। একবার লেখা শুরু হলে যেকোনো খাবারের খাতায় এই বোতামটাই সবচেয়ে বেশি চাপা পড়ে।"
            />
          </p>
        ) : null}

        {lastNight.length ? (
          <>
            <ul className="dt-eaten-list">
              {lastNight.map((row, at) => {
                const key = `y-${row.id ?? at}`;
                return (
                  <li key={key}>
                    <span>{nameOf(row, lang)}</span>
                    <span className="dt-hit-por">{amountOf(row, lang)}</span>
                    <span className="mono">
                      {row.kcal === undefined ? "" : digits(Math.round(row.kcal), lang)}
                    </span>
                    <Button
                      size="sm"
                      disabled={going[key] === "going"}
                      onClick={() => void again(row, key)}
                    >
                      <T en="Just this" bn="শুধু এটা" />
                    </Button>
                  </li>
                );
              })}
            </ul>

            <div className="dt-measure-row">
              <Button
                kind="solid"
                disabled={copying === "going"}
                onClick={() => void copyYesterday()}
              >
                <T en="Copy the lot on to today" bn="পুরোটা আজকের দিনে তুলুন" />
              </Button>
              {copying === "done" ? (
                <span className="dt-hint">
                  <T en="Copied. Change anything that was different." bn="তোলা হয়েছে। যা আলাদা ছিল বদলে নিন।" />
                </span>
              ) : null}
              {copying === "failed" ? (
                <span className="dt-hint">
                  <T
                    en="Some of it did not save. The rest goes up when the connection comes back."
                    bn="কিছু অংশ জমা হয়নি। সংযোগ ফিরলে বাকিটা চলে যাবে।"
                  />
                </span>
              ) : null}
            </div>
          </>
        ) : null}

        <TBlock
          en={<p className="dt-why">Copying does not point at yesterday: each row
            is written again with its own figures, so correcting a portion today
            leaves yesterday alone.</p>}
          bn={<p className="dt-why">কপি করা মানে গতকালের দিকে দেখিয়ে দেওয়া নয়:
            প্রতিটা সারি নিজের সংখ্যাসহ আবার লেখা হয়, তাই আজ কোনো ভাগ ঠিক করলে
            গতকালেরটা যেমন ছিল তেমনই থাকে।</p>}
        />
      </section>
    </div>
  );
}
