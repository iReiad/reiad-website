/* ============================================================
   The one thing on the front page a reader can use.

   Every other band on this page is something to READ or somewhere
   to GO. A stranger deciding in eight seconds whether a site about
   money in Bangla is worth their evening is better answered by one
   line of its own arithmetic than by any sentence, and this site
   has the arithmetic: `compounding` in `shared/calculators.ts`,
   the same model `/tools` runs, with its own tests.

   ---- nothing here is typed, and nothing here is a promise ----

   The five answers are computed by calling `compounding.run()`,
   at build time, on the server. A figure typed into a front page
   is the failure CLAUDE.md opens with, and it is worse here than
   anywhere: a wrong number under a heading about money is the one
   mistake this site cannot make. The rate and the horizon are
   stated on screen, and the line under it says in the reader's own
   language that this is a calculation rather than a guarantee.

   ---- and it has no JavaScript in it ----

   Five radios, five answers, and the stylesheet shows the one
   whose radio is checked through the sibling combinator. Not
   `:has()` and not a script: `~` has worked in every browser for
   twenty years, the page is prerendered, and an interactive that
   needs hydration to answer is an interactive that is dead for
   the length of the hydration.

   That also means there is no state to keep, no storage key to
   describe in `shared/storage.ts`, and nothing for `sync.ts` to
   carry. What a reader tapped here is not something they MADE.
   ============================================================ */

import { compounding } from "@reiad/shared/calculators";
import { fmtTk } from "@reiad/shared/tool-strings";
import { bnNum } from "@reiad/shared/schools";
import { ChipLabel } from "../ui/chip";

/** What a reader might put aside in a month, in the steps
    somebody actually thinks in.

    Five, because a groove of five chips is one line on a phone
    and the range from a thousand to twenty thousand covers the
    reader this school is written for. */
const MONTHLY = [1_000, 2_000, 5_000, 10_000, 20_000];

/** The one in the middle, which is what a reader sees before
    they touch anything and what a reader with no CSS sees. */
const DEFAULT = 5_000;

const RATE = 10;
const YEARS = 20;

const answer = (monthly: number) => {
  const v = compounding.run({
    start: 0, monthly, rate: RATE, years: YEARS,
  }).values;
  return {
    monthly,
    final: fmtTk(v.final ?? 0, "bn", 0),
    paid: fmtTk(v.paid ?? 0, "bn", 0),
    growth: fmtTk(v.growth ?? 0, "bn", 0),
  };
};

export function Reckoner() {
  const rows = MONTHLY.map(answer);

  return (
    <section className="reckoner" aria-labelledby="rk-q" lang="bn">
      {/* THE RADIOS COME FIRST, and they are siblings of the
          answers rather than ancestors of them: `~` only reaches
          forwards along one level, which is the whole mechanism.
          They are off screen but not `display: none`, so they
          stay focusable and the group is still a radio group. */}
      {rows.map((row) => (
        <input
          key={row.monthly}
          className="rk-in" type="radio" name="rk"
          id={`rk-${row.monthly}`}
          defaultChecked={row.monthly === DEFAULT}
          aria-label={`মাসে ${fmtTk(row.monthly, "bn", 0)}`}
        />
      ))}

      <div className="rk-ask">
        <p className="rk-q" id="rk-q">মাসে কত টাকা রাখতে পারবেন?</p>
        <div className="rk-chips">
          {rows.map((row) => (
            <ChipLabel key={row.monthly} htmlFor={`rk-${row.monthly}`}>
              {fmtTk(row.monthly, "bn", 0)}
            </ChipLabel>
          ))}
        </div>
      </div>

      <div className="rk-out">
        {rows.map((row) => (
          <p className="rk-a" data-rk={row.monthly} key={row.monthly}>
            <span className="rk-lead">{bnNum(YEARS)} বছরে দাঁড়ায়</span>
            <b className="rk-fig">{row.final}</b>
            <span className="rk-sub">
              নিজের জমা {row.paid}, বাকি {row.growth} সুদে-আসলে বেড়ে।
            </span>
          </p>
        ))}
      </div>

      <p className="rk-note">
        {/* Bangla numerals, through the site's own converter. A
            Latin numeral inside a Bangla sentence is the one thing
            a reader of this school notices first. */}
        বছরে {bnNum(RATE)}% রিটার্ন ধরে, {bnNum(YEARS)} বছর। এটা একটা হিসাব,
        কোনো নিশ্চয়তা নয়।{" "}
        <a href="/tools#compounding">নিজের সংখ্যা বসিয়ে দেখুন →</a>
      </p>
    </section>
  );
}
