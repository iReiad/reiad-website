"use client";

/* ============================================================
   diet/summary-panel.tsx: the page you take to a doctor.

   `DIET.md` section 25.

   A GP appointment in the UK is ten minutes. A consultation in
   Dhaka is often shorter and frequently the first time anybody
   has seen this person's numbers over time. In both cases the
   patient arrives with a memory and leaves with a guess.

   This is the least glamorous thing in the tool and plausibly
   the most useful. It is also nearly free: every number on it
   already exists, and the whole page is a layout and a print
   stylesheet.

   ---- it never leaves the reader's control ----

   No email, no share link, no upload, no "send to your doctor".
   A print dialogue and a page. If they want a file, the account's
   export already makes one, and that is a decision the reader
   takes rather than one this page takes for them.

   ---- and the first line says what it is ----

   Produced by a calculator from SELF-REPORTED data. A sheet of
   numbers in a clinical-looking layout will be read as a
   clinical record unless it says otherwise at the top, and the
   people most likely to misread it are the ones handing it over.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import {
  bmi, bmiBand, fatEstimate, learnedHere, weighings, restingBurn, slopePerWeek,
  trend, whtr, type Body, type Day, type Point,
} from "@reiad/shared/diet";
import {
  getDays, getLabs, getProfile, isoDate, shiftDate, dayNumber, who,
  type Lab, type Profile, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { T, digits, useToolLang } from "./lang";
import { BAND_WORDS, CUTS_WORDS, MARKERS, SEX_WORDS, medWords } from "./words";
import { Invite } from "./invite";

/** A row of the sheet. `value` is a string because every one of
    them is already formatted to its own precision by the time it
    gets here, and a number would invite this component to round
    it a second time. */
function Row({ label, value, note, words }: {
  label: React.ReactNode;
  value: React.ReactNode;
  note?: React.ReactNode;
  /** A row whose value is words rather than a figure. The mono
      face is for numbers a clinician compares down a column; a
      sentence set in it reads as a code. */
  words?: boolean;
}) {
  return (
    <div className="dt-sum-row">
      <span className="dt-sum-label">{label}</span>
      <span className={words ? "dt-sum-value" : "dt-sum-value mono"}>{value}</span>
      {note ? <span className="dt-sum-note">{note}</span> : null}
    </div>
  );
}

export function SummaryPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [labs, setLabs] = useState<Lab[]>([]);
  const [span, setSpan] = useState(90);

  const today = isoDate();

  useEffect(() => {
    let alive = true;
    const paint = () => { void who().then((f) => { if (alive) { setW(f); setAnswered(true); } }); };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    void Promise.all([getProfile(w), getDays(w, shiftDate(today, -365)), getLabs(w)])
      .then(([p, d, l]) => { if (alive) { setProfile(p); setDays(d); setLabs(l); } });
    return () => { alive = false; };
  }, [w, today]);

  const from = shiftDate(today, -span);
  const inSpan = useMemo(() => days.filter((d) => d.date >= from), [days, from]);

  /* THE SHEET IS THE ONE PAGE A CLINICIAN READS, so it must not
     be the page where a marked day bends a rate or where a BMI
     is worked out from a different weight than the trend beside
     it printed. Both were true: it printed "Now, trend 81.2 kg"
     and a BMI from 82.6. */
  const scale = useMemo(
    () => weighings({ days: inSpan, dayOf: dayNumber, today: dayNumber(today) }),
    [inSpan, today],
  );
  const points: Point[] = scale.drawn;
  const line = useMemo(() => trend(points), [points]);
  const rate = useMemo(() => slopePerWeek(scale.fittable), [scale]);

  const body: Body | null = useMemo(() => {
    const now = line.length ? line[line.length - 1] : null;
    if (!profile?.height_cm || !profile.birth_year || !now) return null;
    return {
      heightCm: profile.height_cm,
      weightKg: now.kg,
      ageYears: new Date().getFullYear() - profile.birth_year,
      sex: profile.sex ?? "male",
      ancestry: profile.ancestry ?? "general",
      waistCm: [...inSpan].reverse().find((d) => d.waistCm != null)?.waistCm,
      neckCm: [...inSpan].reverse().find((d) => d.neckCm != null)?.neckCm,
      hipCm: [...inSpan].reverse().find((d) => d.hipCm != null)?.hipCm,
    };
  }, [profile, line, inSpan]);

  const learned = useMemo(() => learnedHere({
    weights: scale.fittable,
    intakes: inSpan.filter((d) => d.kcal != null)
      .map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
    today: dayNumber(today),
  }), [scale, inSpan, today]);

  const intakes = inSpan.filter((d) => d.kcal != null).map((d) => d.kcal as number);
  const meanIntake = intakes.length
    ? Math.round(intakes.reduce((a, b) => a + b, 0) / intakes.length) : null;

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return (
      <Invite
        en="This sheet is built from your own rows, which live on your account."
        bn="এই কাগজটা আপনার নিজের তথ্য থেকে তৈরি, যা আপনার অ্যাকাউন্টে থাকে।"
        shows={[
          { en: "One printable page: weight and intake, the body, the clinic figures, and the medicines.",
            bn: "ছাপার মতো এক পাতা: ওজন আর খাওয়া, শরীর, ডাক্তারের মাপ, আর ওষুধ।" },
          { en: "Dates on every figure and the width of every estimate beside it.",
            bn: "প্রতিটা সংখ্যার সঙ্গে তারিখ, আর প্রতিটা আন্দাজের পাশে তার ভুলের সীমা।" },
          { en: "Which equation produced each number, so nothing on it has to be taken on trust.",
            bn: "কোন সূত্র থেকে কোন সংখ্যা এসেছে, যাতে কিছুই বিশ্বাস করে নিতে না হয়।" },
        ]}
      />
    );
  }

  const fat = body ? fatEstimate(body) : null;
  const rest = body ? restingBurn(body, fat?.method === "navy" ? fat.leanKg : undefined) : null;
  const value = body ? bmi(body.weightKg, body.heightCm) : null;

  return (
    <div className="dt-summary">
      <div className="dt-sum-controls">
        <div className="dt-tags" role="group" aria-label={lang === "bn" ? "কত দিন আগে থেকে" : "How far back"}>
          {[90, 180, 365].map((n) => (
            <ChipButton key={n} pressed={span === n} onClick={() => setSpan(n)}>
              <T en={`${n} days`} bn={`${digits(n, "bn")} দিন`} />
            </ChipButton>
          ))}
        </div>
        <Button kind="solid" onClick={() => window.print()}>
          <T en="Print" bn="প্রিন্ট" />
        </Button>
      </div>

      <article className="dt-sheet">
        {/* THE FIRST LINE SAYS WHAT THIS IS. A sheet of numbers
            in a clinical-looking layout will be read as a
            clinical record unless it says otherwise at the top. */}
        <p className="dt-sheet-what">
          <T
            en="Produced by a calculator from self-reported measurements. It is not a clinical record and none of it has been verified by anybody."
            bn="নিজের দেওয়া মাপ থেকে একটা ক্যালকুলেটর এটি বানিয়েছে। এটি কোনো চিকিৎসা নথি নয় আর এর কিছুই কেউ যাচাই করেনি।"
          />
        </p>

        <h2 className="dt-sheet-title"><T en="Weight and intake" bn="ওজন আর খাওয়া" /></h2>
        <p className="dt-sheet-when">
          <T
            en={`${from} to ${today}, ${inSpan.length} days with something logged`}
            bn={`${from} থেকে ${today}, ${digits(inSpan.length, "bn")} দিনে কিছু না কিছু লেখা`}
          />
        </p>

        <section className="dt-sum-block">
          <h3><T en="Who" bn="কে" /></h3>
          {/* NOT A TOKEN, IN EITHER LANGUAGE. This page is the one
              thing here that gets handed to a stranger, and it
              printed `raised`, `male form` and `glp1, insulin,
              steroid` on it. `words.ts` is where the readable
              spelling of each of those already lives. */}
          {profile?.birth_year
            ? <Row label={<T en="Age" bn="বয়স" />}
                   value={String(new Date().getFullYear() - profile.birth_year)} />
            : null}
          {profile?.height_cm
            ? <Row label={<T en="Height" bn="উচ্চতা" />} value={`${profile.height_cm} cm`} /> : null}
          {profile?.sex
            ? <Row label={<T en="Equations used" bn="যে সূত্র ব্যবহার হয়েছে" />}
                   words value={<T en={SEX_WORDS[profile.sex].en} bn={SEX_WORDS[profile.sex].bn} />} /> : null}
          {profile?.ancestry
            ? <Row label={<T en="BMI cut-offs" bn="বিএমআই সীমা" />}
                   words value={<T en={CUTS_WORDS[profile.ancestry].en} bn={CUTS_WORDS[profile.ancestry].bn} />} /> : null}
        </section>

        <section className="dt-sum-block">
          <h3><T en="Weight" bn="ওজন" /></h3>
          {line.length
            ? (
              <>
                <Row label={<T en="At the start" bn="শুরুতে" />}
                     value={`${line[0].kg.toFixed(1)} kg`} />
                <Row label={<T en="Now, trend" bn="এখন, ধারা" />}
                     value={`${line[line.length - 1].kg.toFixed(1)} kg`} />
                {rate ? (
                  <Row
                    label={<T en="Rate" bn="হার" />}
                    value={`${rate.mid >= 0 ? "+" : ""}${rate.mid.toFixed(2)} kg/week`}
                    note={<T en={`95% interval ${rate.low.toFixed(2)} to ${rate.high.toFixed(2)}`}
                             bn={`৯৫% সীমা ${digits(rate.low.toFixed(2), "bn")} থেকে ${digits(rate.high.toFixed(2), "bn")}`} />}
                  />
                ) : null}
                <Row label={<T en="Weighings" bn="যতবার ওজন" />} value={String(points.length)} />
              </>
            )
            : <p className="dt-why"><T en="No weighings in this range." bn="এই সময়ে কোনো ওজন লেখা নেই।" /></p>}
        </section>

        {body && fat && value !== null ? (
          <section className="dt-sum-block">
            <h3><T en="The body" bn="শরীর" /></h3>
            {body.waistCm ? (
              <>
                <Row label={<T en="Waist" bn="কোমর" />} value={`${body.waistCm} cm`} />
                <Row
                  label={<T en="Waist to height" bn="কোমর ও উচ্চতা" />}
                  value={whtr(body.waistCm, body.heightCm).toFixed(2)}
                  note={<T en="under 0.5 is the mark aimed at" bn="লক্ষ্য ০.৫ এর নিচে" />}
                />
              </>
            ) : null}
            <Row
              label="BMI"
              value={value.toFixed(1)}
              note={<T en={BAND_WORDS[bmiBand(value, body.ancestry)].en}
                       bn={BAND_WORDS[bmiBand(value, body.ancestry)].bn} />}
            />
            <Row
              label={<T en="Body fat" bn="শরীরের চর্বি" />}
              value={`${Math.round(fat.pct.low)} to ${Math.round(fat.pct.high)}%`}
              note={<T
                en={fat.method === "navy" ? "tape method, SE about 3 to 4 points"
                  : "estimated from BMI, SE about 5 points"}
                bn={fat.method === "navy" ? "ফিতার পদ্ধতি, ভুল প্রায় ৩ থেকে ৪ পয়েন্ট"
                  : "বিএমআই থেকে আন্দাজ, ভুল প্রায় ৫ পয়েন্ট"}
              />}
            />
            <Row label={<T en="Lean mass" bn="চর্বি ছাড়া ভর" />} value={`${fat.leanKg.toFixed(1)} kg`} />
          </section>
        ) : null}

        <section className="dt-sum-block">
          <h3><T en="Intake and energy" bn="খাওয়া আর শক্তি" /></h3>
          {meanIntake !== null
            ? <Row label={<T en="Mean logged intake" bn="লেখা খাওয়ার গড়" />}
                   value={`${meanIntake} kcal/day`}
                   note={<T en={`over ${intakes.length} logged days`}
                            bn={`${digits(intakes.length, "bn")} দিনের হিসাবে`} />} />
            : null}
          {rest
            ? <Row label={<T en="Resting burn, estimated" bn="বিশ্রামে খরচ, আন্দাজ" />}
                   value={`${Math.round(rest.kcal / 10) * 10} kcal`}
                   note={rest.method === "katch" ? "Katch-McArdle" : "Mifflin-St Jeor"} />
            : null}
          {learned
            ? <Row label={<T en="Daily burn, measured" bn="দিনের খরচ, মাপা" />}
                   value={`${Math.round(learned.kcal.mid / 10) * 10} kcal`}
                   note={<T
                     en={`from intake and trend over ${learned.days} days; 95% interval ${Math.round(learned.kcal.low)} to ${Math.round(learned.kcal.high)}`}
                     bn={`${digits(learned.days, "bn")} দিনের খাওয়া আর ধারা থেকে; ৯৫% সীমা ${digits(Math.round(learned.kcal.low), "bn")} থেকে ${digits(Math.round(learned.kcal.high), "bn")}`}
                   />} />
            : null}
        </section>

        {/* SECTION 25'S MISSING BLOCK. The sheet had five of its
            six and this is the one a clinician would look at
            first: the only figures on the page that somebody
            else measured. Every one carries its own date and the
            range it was read against, because a number without
            either is a number they will have to ask about. */}
        {labs.length ? (
          <section className="dt-sum-block">
            <h3><T en="From a clinic" bn="ক্লিনিক থেকে" /></h3>
            {MARKERS.map((m) => {
              const rows = labs.filter((l) => l.marker === m.id);
              if (!rows.length) return null;
              const last = rows[rows.length - 1];
              const first = rows[0];
              return (
                <Row
                  key={m.id}
                  label={<T en={m.en} bn={m.bn} />}
                  value={`${last.value} ${last.unit}`}
                  note={(
                    <T
                      en={`${last.takenOn}`
                        + `${rows.length > 1 ? `, from ${first.value} on ${first.takenOn}` : ""}`
                        + `${last.refLow != null || last.refHigh != null
                          ? `; range ${last.refLow ?? ""}${last.refLow != null && last.refHigh != null ? " to " : ""}${last.refHigh ?? ""}` : ""}`
                        + `${last.note ? `; ${last.note}` : ""}`}
                      bn={`${last.takenOn}`
                        + `${rows.length > 1 ? `, ${first.takenOn} তারিখে ছিল ${digits(first.value, "bn")}` : ""}`
                        + `${last.refLow != null || last.refHigh != null
                          ? `; সীমা ${last.refLow != null ? digits(last.refLow, "bn") : ""}${last.refLow != null && last.refHigh != null ? " থেকে " : ""}${last.refHigh != null ? digits(last.refHigh, "bn") : ""}` : ""}`
                        + `${last.note ? `; ${last.note}` : ""}`}
                    />
                  )}
                />
              );
            })}
          </section>
        ) : null}

        {profile?.meds?.length ? (
          <section className="dt-sum-block">
            <h3><T en="Reported medicines" bn="যে ওষুধ জানানো হয়েছে" /></h3>
            <ul className="dt-sum-meds">
              {profile.meds.map((id) => (
                <li key={id}><T en={medWords(id).en} bn={medWords(id).bn} /></li>
              ))}
            </ul>
          </section>
        ) : null}

        <p className="dt-sheet-foot">
          <T
            en="Every figure with an interval beside it is an estimate and the interval is its width. Body fat and daily burn are both estimates. Nothing here is a diagnosis."
            bn="যে সংখ্যার পাশে একটা সীমা আছে সেটি আন্দাজ, আর সীমাটাই তার প্রশস্ততা। শরীরের চর্বি আর দিনের খরচ, দুটোই আন্দাজ। এখানকার কিছুই রোগ নির্ণয় নয়।"
          />
        </p>
      </article>
    </div>
  );
}
