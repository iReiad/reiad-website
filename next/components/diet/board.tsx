"use client";

/* ============================================================
   diet/board.tsx: today. The log on the left, the board on the
   upper right.

   `DIET.md` sections 11 and 24. This page has two jobs that pull
   in opposite directions: DOING (log a weight, log a meal) and
   READING (how is this going). One column cannot serve both, so
   on a wide screen the log is on the left because it is what the
   reader came to do, and the board is a rail on the upper right
   because it is what they came to see and it is the first thing
   in the eye's path on the way to the log.

   ---- everything here is client-filled, and that is the rule ----

   The same arrangement as `/account`, `/tools/live` and
   `/tools/routine`, for the same reason: what this page shows is
   one person's own private rows, read with their own token out
   of their own localStorage. The server has neither, and HTML it
   rendered would be one reader's day cached at an address every
   reader shares.

   So the server renders the frame and this fills it. Signed out
   it draws a short invitation rather than an empty shell: a
   redirect would lose the address somebody was sent, and a blank
   page looks broken.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  UNLOCKS, dayPace, streak, totalFor, trend, slopePerWeek, learnedBurn,
  restingBurn, estimatedBurn, activityFactor, target, fatEstimate,
  proteinFloor, whtr, bmi,
  type Body, type Day, type Entry, type Point,
} from "@reiad/shared/diet";
import {
  who, getDays, saveDay, getEntries, addEntry, removeEntry, getProfile,
  isoDate, clockTime, shiftDate, dayNumber, pendingCount,
  type Profile, type Who,
} from "../../lib/diet-api";
import { ButtonLink } from "../ui/button";
import { T, digits, useToolLang } from "./lang";
import { Ring, Spark, Strip, Waiting, Widget } from "./widgets";
import { LogForm } from "./log-form";

/** How far back the board reads. A year is 365 rows, which is
    one request and nothing to paginate, and it is what the
    streak's `best` and the year page both need. */
const WINDOW = 365;

export function DietBoard() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [days, setDays] = useState<Day[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [saving, setSaving] = useState<"idle" | "saving" | "saved" | "queued">("idle");
  /* THE ROWS HAVE TO BE BACK BEFORE ANYTHING MAY BE WRITTEN.
     `saveDay` is a merge-upsert of a whole row and `fromDay()`
     writes an explicit null for every field the object lacks, so
     a write built on `day === undefined` because the fetch had
     not landed yet erased this morning's weight, the tags and
     the note. On a slow connection that is one tap on "A glass".
     The form is disabled until this is true. */
  const [loaded, setLoaded] = useState(false);

  /* WHICH DAY IS BEING LOGGED, which is today until the reader
     says otherwise. A log that can only ever be written for the
     current date cannot record the evening somebody was
     travelling, and section 13's copy-yesterday has nowhere to
     put its copy. */
  const [today, setToday] = useState(() => isoDate());

  /* The real one, which is what caps the date box and what the
     heading compares against. Recomputed on every render rather
     than held: a tab left open across midnight would otherwise
     go on calling yesterday today. */
  const realToday = isoDate();

  /* Who is signed in, and staying up to date with it: signing in
     on this page should fill it without a reload. `account:changed`
     is the event the rest of the site already listens for. */
  useEffect(() => {
    let alive = true;
    const paint = () => { void who().then((found) => {
      if (!alive) return;
      setW(found);
      setAnswered(true);
    }); };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) { setDays([]); setEntries([]); setProfile(null); setLoaded(false); return; }
    let alive = true;
    /* Anchored on the CURRENT date rather than on the day being
       edited, so moving the date back a week does not refetch
       and does not narrow the window the trend is drawn over. */
    const from = shiftDate(isoDate(), -WINDOW);
    void Promise.all([getProfile(w), getDays(w, from), getEntries(w, from)])
      .then(([p, d, e]) => {
        if (!alive) return;
        setProfile(p);
        setDays(d);
        setEntries(e);
        setLoaded(true);
      });
    return () => { alive = false; };
  }, [w]);

  const day = days.find((d) => d.date === today);
  const todayEntries = useMemo(
    () => entries.filter((e) => e.date === today), [entries, today],
  );

  /* The hour, refreshed on a timer so the pace below moves with
     the day rather than with the last render. A minute is fine:
     nothing here changes faster than that, and a second would be
     a re-render a second for a number that shows hours. */
  const [hourNow, setHourNow] = useState(() => new Date().getHours());
  useEffect(() => {
    const tick = window.setInterval(() => setHourNow(new Date().getHours()), 60000);
    return () => window.clearInterval(tick);
  }, []);
  const totals = useMemo(() => totalFor(todayEntries), [todayEntries]);
  const run = useMemo(() => streak(days, today), [days, today]);

  /* The trend, and the rate, off the weighings alone. `trend()`
     is the line a page draws; `slopePerWeek()` fits the
     READINGS, and the comment on it says why an average's
     endpoints cannot be used for a rate. */
  const points: Point[] = useMemo(
    () => days.filter((d) => d.weightKg != null)
      .map((d) => ({ day: dayNumber(d.date), kg: d.weightKg as number })),
    [days],
  );
  const line = useMemo(() => trend(points), [points]);
  const rate = useMemo(() => slopePerWeek(points), [points]);

  /* THE TREND, NOT THE NEWEST READING. `shared/diet.ts` opens
     with "NOTHING READS A SINGLE WEIGHT" and this read one: a
     kilo of Saturday's salt moved the target by about 100 kcal
     and the BMI band by 0.3, and the doctor's sheet printed a
     trend of 81.2 beside a BMI worked out from 82.6. `trend()`
     returns the line, and its last point is what the reader
     weighs. */
  const body: Body | null = useMemo(() => {
    const now = line.length ? line[line.length - 1] : null;
    if (!profile?.height_cm || !profile.birth_year || !now) return null;
    return {
      heightCm: profile.height_cm,
      weightKg: now.kg,
      ageYears: new Date().getFullYear() - profile.birth_year,
      sex: profile.sex ?? "male",
      ancestry: profile.ancestry ?? "general",
      waistCm: [...days].reverse().find((d) => d.waistCm != null)?.waistCm,
      neckCm: [...days].reverse().find((d) => d.neckCm != null)?.neckCm,
      hipCm: [...days].reverse().find((d) => d.hipCm != null)?.hipCm,
    };
  }, [profile, line, days]);

  const learned = useMemo(() => learnedBurn(
    points,
    days.filter((d) => d.kcal != null).map((d) => ({ day: dayNumber(d.date), kcal: d.kcal as number })),
  ), [points, days]);

  const burn = useMemo(() => {
    if (!body) return null;
    const fat = fatEstimate(body);
    const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);
    return {
      resting: rest.kcal,
      lean: fat.leanKg,
      maintenance: learned?.kcal.mid
        ?? estimatedBurn(rest.kcal, activityFactor(profile?.activity ?? "sedentary")),
      learned: !!learned,
    };
  }, [body, learned, profile]);

  /* WHERE TODAY IS GOING, from the reader's OWN distribution of
     intake across the day rather than an assumed one. `dayPace()`
     says at length why: if three quarters of your calories
     usually land after six, then 900 at lunchtime is not most of
     the day, and a tool that implied it was would be telling
     somebody they had failed by one o'clock. */
  const pace = useMemo(() => {
    /* `at_time` first, and the old spelling second: rows written
       before section 11 was fixed carry the clock in `meal`, and
       dropping the fallback would take their hour off them. */
    const at = (e: Entry): number => {
      const h = /^(\d{1,2}):/.exec(e.atTime ?? e.meal ?? "");
      return h ? Number(h[1]) : 12;
    };
    return dayPace({
      history: entries.filter((e) => e.date !== today).map((e) => ({ hour: at(e), kcal: e.kcal ?? 0 })),
      today: todayEntries.map((e) => ({ hour: at(e), kcal: e.kcal ?? 0 })),
      hourNow,
    });
  }, [entries, todayEntries, today, hourNow]);

  const glasses = Math.floor((day?.waterMl ?? 0) / 250);

  /* SECTION 19'S ONE READING THAT COSTS NOTHING. `steps` was
     written by the form and read by its own widget and nothing
     else, so "your steps have fallen from 8,000 to 4,500" could
     not be said. Seven days, and only where there are at least
     three of them: a mean of one day is that day. */
  const stepAvg = useMemo(() => {
    const week = days
      .filter((d) => d.steps != null && dayNumber(d.date) > dayNumber(realToday) - 8)
      .map((d) => d.steps as number);
    return week.length >= 3 ? week.reduce((a, b) => a + b, 0) / week.length : null;
  }, [days, realToday]);

  const goal = useMemo(() => {
    if (!body || !burn) return null;
    return target({
      body, maintenance: burn.maintenance, restingKcal: burn.resting,
      kind: profile?.goal_kind ?? "maintain",
      ratePct: profile?.goal_rate ?? 0.5,
    });
  }, [body, burn, profile]);

  const write = useCallback(async (patch: Partial<Day>) => {
    if (!w || !loaded) return;
    setSaving("saving");
    const next: Day = { ...(day ?? { date: today }), ...patch, date: today };
    setDays((prev) => {
      const rest = prev.filter((d) => d.date !== today);
      return [...rest, next].sort((a, b) => a.date.localeCompare(b.date));
    });
    const ok = await saveDay(w, next);
    setSaving(ok ? "saved" : pendingCount() > 0 ? "queued" : "idle");
    if (ok) window.setTimeout(() => setSaving("idle"), 1600);
  }, [w, day, today, loaded]);

  const log = useCallback(async (e: Omit<Entry, "date">) => {
    if (!w || !loaded) return;
    setSaving("saving");
    /* The hour goes in `at_time`, which is the column for it.
       Backdating writes noon rather than the clock, because the
       clock is now and now is not when that food was eaten: a
       reader filling in Tuesday on Thursday would otherwise put
       every one of Tuesday's meals at half past nine at night
       and skew their own by-hour reading. */
    const at = today === isoDate() ? clockTime() : "12:00";
    const saved = await addEntry(w, { ...e, date: today, atTime: e.atTime ?? at });
    if (saved) setEntries((prev) => [...prev, saved]);
    const after = totalFor([...todayEntries, { ...e, date: today }]);
    await write({ kcal: Math.round(after.kcal), proteinG: after.protein,
      carbsG: after.carbs, fatG: after.fat, fibreG: after.fibre });
  }, [w, today, todayEntries, write, loaded]);

  /* A MISTYPED 2,500 WAS PERMANENT. `removeEntry` has existed
     since the day this file was written and nothing called it,
     so the eaten list was a list of things that could only ever
     be added to. The day's totals are recomputed from what is
     left rather than subtracted from, so a row removed twice
     cannot take the total below what is there. */
  const unlog = useCallback(async (id: string) => {
    if (!w || !loaded) return;
    setSaving("saving");
    const ok = await removeEntry(w, id);
    if (!ok) { setSaving("idle"); return; }
    const left = todayEntries.filter((x) => x.id !== id);
    setEntries((prev) => prev.filter((x) => x.id !== id));
    const after = totalFor(left);
    await write({ kcal: Math.round(after.kcal), proteinG: after.protein,
      carbsG: after.carbs, fatG: after.fat, fibreG: after.fibre });
  }, [w, todayEntries, write, loaded]);

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  /* SIGNED OUT, THE CARDS ARE THE PAGE. Four of them work
     completely without an account: the body, the glossary, the
     prices and what to expect. A tall sign-in block above them
     pushes the usable half of this tool below the fold in order
     to advertise the half that needs a login, which is the wrong
     way round for somebody who has just arrived. One line, and it
     gets out of the way. */
  if (!w) {
    return (
      <p className="dt-invite-line">
        <T
          en="Logging a weight and what you ate needs an account, so that it is on your phone too."
          bn="ওজন আর খাওয়া লিখতে অ্যাকাউন্ট লাগে, তাহলে ফোনেও পাবেন।"
        />
        <ButtonLink href="/account" size="sm">
          <T en="Sign in" bn="সাইন ইন" />
        </ButtonLink>
        <T
          en="Everything below works without one."
          bn="নিচের সবকিছু অ্যাকাউন্ট ছাড়াই চলে।"
        />
      </p>
    );
  }

  const remaining = goal ? goal.kcal - totals.kcal : 0;
  const protein = body ? proteinFloor(burn?.lean ?? 0, profile?.goal_rate ?? 0.5) : null;
  const waist = [...days].reverse().find((d) => d.waistCm != null);
  const stripDays = Array.from({ length: 14 }, (_, i) => {
    const date = shiftDate(today, i - 13);
    const d = days.find((x) => x.date === date);
    const kind = !d ? "none"
      : d.weightKg != null && d.kcal != null ? "both"
        : d.weightKg != null ? "weighed" : "logged";
    return { date, kind };
  });

  return (
    <div className="dt-today">
      <section className="dt-doing"
               aria-label={lang === "bn" ? "আজকের হিসাব লিখুন" : "Log today"}>
        <LogForm
          day={day}
          entries={todayEntries}
          saving={saving}
          place={profile?.place ?? "bd"}
          date={today}
          today={realToday}
          ready={loaded}
          onDay={write}
          onEntry={log}
          onRemove={unlog}
          onDate={setToday}
        />
      </section>

      <aside className="dt-board"
             aria-label={lang === "bn" ? "আজকের এক নজর" : "Today at a glance"}>
        <Widget href="/tools/diet/goal" title={<T en="Today" bn="আজ" />}>
          {goal
            ? (
              <Ring
                done={totals.kcal} total={goal.kcal}
                label={<span className="mono">{digits(Math.abs(Math.round(remaining)), lang)}</span>}
              />
            )
            : <Waiting
                en="Your height, weight and age give a target."
                bn="উচ্চতা, ওজন আর বয়স দিলে একটা লক্ষ্য আসবে।"
              />}
          <span className="dt-w-said">
            {goal
              ? <T
                  en={remaining >= 0 ? `${Math.round(remaining)} left of ${goal.kcal}`
                    : `${Math.abs(Math.round(remaining))} over ${goal.kcal}`}
                  bn={remaining >= 0
                    ? `${digits(Math.round(remaining), "bn")} বাকি, ${digits(goal.kcal, "bn")} এর মধ্যে`
                    : `${digits(Math.abs(Math.round(remaining)), "bn")} বেশি, ${digits(goal.kcal, "bn")} এর চেয়ে`}
                />
              : null}
          </span>
        </Widget>

        {/* WHERE THE DAY IS GOING, live. It appears only once
            there is enough history to know this reader's own
            shape, because a projection from an assumed shape is
            a projection from somebody else's day. */}
        <Widget href="/tools/diet/nutrition" title={<T en="Where today lands" bn="আজ কোথায় গিয়ে দাঁড়াবে" />}>
          {pace
            ? (
              <>
                <span className="dt-w-big mono">{digits(Math.round(pace.landing), lang)}</span>
                <span className="dt-w-said">
                  <T
                    en={`if today goes the way your days usually go. ${Math.round(pace.usualShare * 100)}% of a day is normally in by now.`}
                    bn={`আপনার দিন সাধারণত যেভাবে যায় সেভাবে গেলে। এই সময়ের মধ্যে সাধারণত দিনের ${digits(Math.round(pace.usualShare * 100), "bn")}% হয়ে যায়।`}
                  />
                </span>
              </>
            )
            : <Waiting
                en="A few weeks of logging shows when your calories actually land, and then this can say where the day is going."
                bn="কয়েক সপ্তাহ লিখলে বোঝা যায় আপনার ক্যালোরি আসলে কখন আসে, তখন এটা বলতে পারবে দিনটা কোথায় গিয়ে দাঁড়াবে।"
              />}
        </Widget>

        {/* The streak. It counts SHOWING UP, never hitting a
            target, and `best` sits beside `current` because a
            number that can only fall is a number people stop
            looking at. */}
        <Widget href="/tools/diet/trend" title={<T en="Days logged" bn="যত দিন লেখা" />}>
          <span className="dt-w-big mono">{digits(run.current, lang)}</span>
          <span className="dt-w-said">
            <T
              en={run.best > run.current ? `in a row. Your best is ${run.best}`
                : run.current > 0 ? "in a row, and that is your best" : "Log anything today to start"}
              bn={run.best > run.current
                ? `দিন টানা। আপনার সেরা ${digits(run.best, "bn")}`
                : run.current > 0 ? "দিন টানা, আর এটাই আপনার সেরা" : "আজ কিছু লিখলেই শুরু"}
            />
          </span>
          <Strip days={stripDays} />
        </Widget>

        <Widget href="/tools/diet/trend" title={<T en="Trend" bn="ধারা" />}>
          {line.length > 1
            ? (
              <>
                <Spark
                  points={line.map((p) => ({ x: p.day, y: p.kg }))}
                  scale={points.map((p) => ({ x: p.day, y: p.kg }))}
                />
                <span className="dt-w-said">
                  {rate
                    ? <T
                        en={`${rate.mid >= 0 ? "+" : ""}${rate.mid.toFixed(2)} kg a week`}
                        bn={`সপ্তাহে ${digits(rate.mid.toFixed(2), "bn")} কেজি`}
                      />
                    : <T en="A week of weighings gives a rate." bn="এক সপ্তাহ ওজন দিলে হার আসবে।" />}
                </span>
              </>
            )
            : <Waiting
                en="Two weighings draw a line. Seven make it mean something."
                bn="দুই দিনের ওজনে রেখা আঁকা হয়। সাত দিনে সেটার মানে দাঁড়ায়।"
              />}
        </Widget>

        <Widget href="/tools/diet/trend" title={<T en="What you burn" bn="আপনার খরচ" />}>
          {burn
            ? (
              <>
                <span className="dt-w-big mono">{digits(Math.round(burn.maintenance / 10) * 10, lang)}</span>
                <span className="dt-w-said">
                  <T
                    en={burn.learned ? "measured from your own log" : "estimated, until fourteen days of logs"}
                    bn={burn.learned ? "আপনার নিজের খাতা থেকে মাপা" : "আন্দাজ, চৌদ্দ দিন লেখা না হওয়া পর্যন্ত"}
                  />
                </span>
              </>
            )
            : <Waiting
                en={UNLOCKS[2].en} bn={UNLOCKS[2].bn}
              />}
        </Widget>

        <Widget href="/tools/diet/nutrition" title={<T en="Protein" bn="প্রোটিন" />}>
          {protein
            ? (
              <>
                <span className="dt-w-big mono">
                  {digits(Math.round(totals.protein), lang)}
                </span>
                <span className="dt-w-said">
                  <T
                    en={`of at least ${Math.round(protein.low)} g`}
                    bn={`কমপক্ষে ${digits(Math.round(protein.low), "bn")} গ্রামের মধ্যে`}
                  />
                </span>
              </>
            )
            : <Waiting
                en="A tape measurement gives a lean mass, and the floor follows from it."
                bn="ফিতার মাপ দিলে চর্বি ছাড়া ভর পাওয়া যায়, আর সর্বনিম্ন সেখান থেকেই আসে।"
              />}
        </Widget>

        <Widget href="/tools/diet/you" title={<T en="The body" bn="শরীর" />}>
          {waist?.waistCm && profile?.height_cm
            ? (
              <>
                <span className="dt-w-big mono">
                  {digits(whtr(waist.waistCm, profile.height_cm).toFixed(2), lang)}
                </span>
                <span className="dt-w-said">
                  <T
                    en={`waist to height${body ? `, BMI ${bmi(body.weightKg, body.heightCm).toFixed(1)}` : ""}`}
                    bn={`কোমর ও উচ্চতা${body ? `, বিএমআই ${digits(bmi(body.weightKg, body.heightCm).toFixed(1), "bn")}` : ""}`}
                  />
                </span>
              </>
            )
            : <Waiting
                en="A waist measurement gives the better of the two numbers."
                bn="কোমরের মাপ দিলে দুটোর মধ্যে ভালোটা পাওয়া যায়।"
              />}
        </Widget>

        {/* A ZERO IS NOT AN EMPTY STATE. Section 24 names it,
            `widgets.tsx` repeats it fifteen lines above the
            component, and this widget rendered a bare 0 on every
            board before the first glass of the day. Both of
            these also pointed at `/journal`, which draws neither
            a water figure nor a step count. */}
        <Widget href="/tools/diet/health" title={<T en="Water" bn="পানি" />}>
          {glasses > 0
            ? (
              <>
                <span className="dt-w-big mono">{digits(glasses, lang)}</span>
                <span className="dt-w-said"><T en="glasses today" bn="গ্লাস আজ" /></span>
              </>
            )
            : <Waiting
                en="Tap a glass on the left as you drink one. Thirst is read as hunger more often than not."
                bn="এক গ্লাস খেলে বাঁ পাশে চাপ দিন। তেষ্টাকে অনেক সময় ক্ষুধা বলে ভুল হয়।"
              />}
        </Widget>

        <Widget href="/tools/diet/trend" title={<T en="Steps" bn="পদক্ষেপ" />}>
          {day?.steps
            ? (
              <>
                <span className="dt-w-big mono">{digits(day.steps, lang)}</span>
                {stepAvg !== null ? (
                  <span className="dt-w-said">
                    <T
                      en={`a week's average is ${Math.round(stepAvg / 100) * 100}`}
                      bn={`সপ্তাহের গড় ${digits(Math.round(stepAvg / 100) * 100, "bn")}`}
                    />
                  </span>
                ) : null}
              </>
            )
            : <Waiting
                en="Steps are the largest variable in what you burn, and the one that quietly falls on a diet."
                bn="খরচের সবচেয়ে বড় পরিবর্তনশীল অংশ হাঁটা, আর ডায়েটের সময় এটাই চুপচাপ কমে যায়।"
              />}
        </Widget>

        {/* EVERY PAGE THAT PRINTS A TARGET PRINTS THIS, and this
            page prints one in the first widget. Section 31's
            first rule, held on `/you` and on `/goal` and missing
            here, which is the page a reader actually lands on. */}
        <p className="dt-w-legal" data-wide>
          <T
            en="These numbers are general education and not medical advice. They do not know your history, your medicines or anything a clinician would ask about first."
            bn="এই সংখ্যাগুলো সাধারণ তথ্যের জন্য, চিকিৎসা পরামর্শ নয়। আপনার রোগের ইতিহাস, ওষুধ বা একজন চিকিৎসক প্রথমেই যা জিজ্ঞেস করতেন, তার কিছুই এগুলো জানে না।"
          />
        </p>
      </aside>
    </div>
  );
}
