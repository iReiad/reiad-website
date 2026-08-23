/* ============================================================
   diet/season-note.tsx: the calendar, on the page.

   `DIET.md` section 18. Every number in section 4 assumes the
   reader is the same person from week to week, and the ways they
   are not are predictable: a British December, a monsoon, a
   month of fasting. Predictable means it can be handled rather
   than absorbed as noise.

   NOTHING HERE CHANGES A SUM. `quietSeason()` is the only part
   of this that reaches arithmetic and all it does is stop
   `stall()` speaking; everything on this card is a sentence
   saying what a flat month means, which is the thing the reader
   otherwise has to hold in their own head.

   The moving dates are a table and it runs out. When the date
   asked about is past it, this says so plainly rather than
   drawing a fast in the wrong fortnight.
   ============================================================ */

"use client";

import {
  calendarKnownTo, seasonsOn,
  type Place, type SeasonId,
} from "@reiad/shared/diet";
import { T, digits } from "./lang";

/** Presentation, so it lives here rather than beside the words.
    The tokens are the same seven the page strip draws from. */
const TONE: Record<SeasonId, string> = {
  ramadan: "--violet",
  "eid-fitr": "--gold",
  "eid-adha": "--gold",
  winter: "--blue",
  christmas: "--rose",
  heat: "--gold",
  monsoon: "--teal",
  puja: "--plum",
  boishakh: "--green",
};

export function SeasonNote({ date, place }: { date: string; place: Place }) {
  const now = seasonsOn({ date, place });
  const knownTo = calendarKnownTo();
  const pastTable = knownTo != null && date > knownTo;

  /* NOTHING ON MOST DAYS, and that is the ordinary answer. A card
     that says "no season" every day of August is furniture. */
  if (!now.length && !pastTable) return null;

  return (
    <section className="dt-season" aria-labelledby="dt-season-h">
      <h2 id="dt-season-h">
        <T en="What time of year it is" bn="বছরের কোন সময়" />
      </h2>
      <p className="dt-intro">
        <T
          en="None of this changes the arithmetic. It changes what a flat month means, which is the part you would otherwise have to remember."
          bn="এতে হিসাবের কিছু বদলায় না। বদলায় স্থির একটা মাসের মানে, যেটা না থাকলে আপনাকেই মনে রাখতে হতো।"
        />
      </p>

      <ul className="dt-season-list">
        {now.map(({ season, day, of }) => (
          <li
            key={season.id}
            className="dt-season-row"
            style={{ "--accent": `var(${TONE[season.id]})` } as React.CSSProperties}
          >
            <h3 className="dt-season-name">
              <T en={season.en} bn={season.bn} />
              {season.quiet ? (
                <span className="dt-season-flag">
                  <T en="no stall reading" bn="আটকে যাওয়া বলা হবে না" />
                </span>
              ) : null}
            </h3>
            <p className="dt-season-when">
              <T
                en={of > 1 ? `Day ${day} of ${of}` : "Today"}
                bn={of > 1 ? `${digits(of, "bn")} দিনের ${digits(day, "bn")} নম্বর দিন` : "আজ"}
              />
            </p>
            {of > 1 ? (
              <div
                className="dt-season-bar"
                role="img"
                aria-label={`${day} of ${of}`}
              >
                <span style={{ inlineSize: `${Math.round((day / of) * 100)}%` }} />
              </div>
            ) : null}
            <p className="dt-said"><T en={season.readEn} bn={season.readBn} /></p>
          </li>
        ))}
      </ul>

      {pastTable ? (
        <p className="dt-why">
          <T
            en={`Ramadan, the two Eids and Durga Puja move about eleven days a year against this calendar and the day each begins is settled by sighting, so they are a table here rather than a formula. It is filled in to ${knownTo} and this date is past it, so those four are not drawn. Mark the days yourself and they still count.`}
            bn={`রমজান, দুই ঈদ আর দুর্গাপূজা এই পঞ্জিকার হিসাবে বছরে প্রায় এগারো দিন করে সরে যায়, আর কোন দিনে শুরু সেটা চাঁদ দেখে ঠিক হয়, তাই এখানে সেগুলো সূত্র নয়, তালিকা। তালিকা ${knownTo} পর্যন্ত ভরা আছে আর আজকের তারিখ তার পরে, তাই ওই চারটা আঁকা হচ্ছে না। দিনগুলো নিজে চিহ্ন দিলে সেগুলো ঠিকই গোনা হবে।`}
          />
        </p>
      ) : null}
    </section>
  );
}
