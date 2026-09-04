"use client";

/* A year in one page. `DIET.md` sections 10, 16 and 18.

   THE CHART IS THE TREND PAGE'S CHART and none of its decisions is
   retaken: the y axis does not start at zero and says so, the scale
   readings are drawn behind the trend, nothing is encoded in colour
   alone, and there is a table underneath named by `aria-describedby`. It
   borrows that chart's classes rather than growing its own set.

   What a year adds is the frame: the phases banded across the BODY of the
   plot, the seasons along its FOOT, and the marked days as rings.
   Position is what separates the two kinds of band.

   THE AXIS IS ALWAYS A YEAR, WHATEVER THE LOG HOLDS. Until the log
   reaches back a year the axis starts at the first weighing and runs a
   year forward, with the unlived part shaded; after that it is the last
   365 days. One expression, no threshold.

   Intake, steps, sleep, hunger and ketones are not on it: every one would
   need a second y axis, which is the lie the axis rule exists to stop. */

import { useEffect, useMemo, useState } from "react";
import {
  calendarKnownTo, markNamed, protocolName, seasonsOn, slopePerWeek,
  stretches, trend, weighings,
  type Day, type Phase, type Place, type Point, type Protocol,
  type Season, type SeasonId, type Stretch,
} from "@reiad/shared/diet";
import { DEFAULT_PLACE } from "@reiad/shared/foods";
import {
  dayNumber, getDays, getPhases, getProfile, isoDate, shiftDate, who,
  type Profile, type Who,
} from "../../lib/diet-api";
import { T, digits, useToolLang, type ToolLang } from "./lang";
import { Invite } from "./invite";

const YEAR = 365;

/** A month more than the axis is fetched, and that is what makes
    the rule above answerable rather than a guess: asking for
    exactly a year makes a reader with three years of log and one
    with three hundred days look identical, because both have
    their first row inside the window. `getDays` caps at 800
    rows, so this is well inside it. */
const FETCH = YEAR + 30;

const W = 960;
const H = 300;
const PAD = { l: 46, r: 16, t: 28, b: 38 };
const PLOT_B = H - PAD.b;

/** Where the season strip starts. The phases stop here and the
    seasons run below it, so the two kinds of band never overlap
    and a reader tells them apart by where they are rather than
    by what colour they are. */
const SEASON_TOP = PLOT_B - 12;

/* A calendar rather than site data, so it is written out. The
   axis carries twelve of these and an SVG `<text>` cannot hold
   the two spans `T` renders, which is exactly what
   `useToolLang` is for. */
const MONTHS: Record<ToolLang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  bn: ["জানু", "ফেব্রু", "মার্চ", "এপ্রিল", "মে", "জুন",
    "জুলাই", "আগ", "সেপ্ট", "অক্টো", "নভে", "ডিসে"],
};

/** Why a stretch carries no rate, in words. `Stretch.why` is the
    reason the arithmetic already worked out, and a page that
    leaves it as something the code knows and the reader does not
    is a page with an unexplained gap in it. */
const WHY: Record<NonNullable<Stretch["why"]>, { en: string; bn: string }> = {
  settling: { en: "still settling", bn: "এখনো থিতু হয়নি" },
  "too short": { en: "shorter than a week", bn: "এক সপ্তাহের চেয়ে কম" },
  rebound: { en: "the rebound has not finished", bn: "ফেরত আসাটা এখনো শেষ হয়নি" },
};

/** One protocol across one run of days, as the chart bands it.
    The settling window at the head of a phase is a band of its
    own, so the days a rate may not be fitted to are visible
    rather than absent. */
interface YearBand {
  key: string;
  protocol: Protocol;
  from: number;
  to: number;
  readable: boolean;
}

/** One run of days inside one season, which is what a year needs
    and `seasonsOn()` does not return: it answers for one date. */
interface SeasonRun {
  key: string;
  season: Season;
  from: number;
  to: number;
}

export function YearPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [days, setDays] = useState<Day[]>([]);
  const [phases, setPhases] = useState<Phase[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);

  const today = isoDate();
  const end = dayNumber(today);

  useEffect(() => {
    let alive = true;
    const paint = () => {
      void who().then((f) => { if (alive) { setW(f); setAnswered(true); } });
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    void Promise.all([getDays(w, shiftDate(today, -FETCH)), getPhases(w), getProfile(w)])
      .then(([d, ph, pr]) => {
        if (!alive) return;
        setDays(d); setPhases(ph); setProfile(pr);
      });
    return () => { alive = false; };
  }, [w, today]);

  /* DRAWN AND FITTED ARE TWO LISTS, and `weighings()` is the one
     place that says which is which. A marked day and a settling
     window are both drawn and both left out of the slope. */
  const { drawn: all, fittable: allFittable, marked } = useMemo(
    () => weighings({ days, dayOf: dayNumber, phases, today: end }),
    [days, phases, end],
  );

      /* THE AXIS: 365 days INCLUSIVE, ending today once the log is a year
         old and starting at the first weighing until then. Both endpoints
         are drawn, so the axis is a year of DAYS and 364 day-steps wide,
         and `px` divides by `x1 - x0` rather than by the constant so the
         two cannot come apart. */
  const x0 = useMemo(() => {
    const first = all.length ? all[0].day : end;
    return first + YEAR - 1 <= end ? end - YEAR + 1 : first;
  }, [all, end]);
  const x1 = x0 + YEAR - 1;
  const within = useMemo(
    () => (p: Point): boolean => p.day >= x0 && p.day <= x1, [x0, x1],
  );

  const inYear = useMemo(
    () => days.filter((d) => {
      const n = dayNumber(d.date);
      return n >= x0 && n <= x1;
    }),
    [days, x0, x1],
  );
  const points = useMemo(() => all.filter(within), [all, within]);
  const fittable = useMemo(() => allFittable.filter(within), [allFittable, within]);
  const line = useMemo(() => trend(points), [points]);
  const markedDays = useMemo(() => new Set(marked.map((p) => p.day)), [marked]);

  const spans = useMemo(
    () => (phases.length ? stretches(phases, end) : []), [phases, end],
  );
  /** The stretches this year actually crosses. A phase run two
      years ago is still in `spans`, because `stretches()` splits
      the whole account, and a table listing it under a heading
      that says "this year" would be wrong. */
  const yearSpans = useMemo(
    () => spans.filter((s) => s.to >= x0 && s.from <= x1), [spans, x0, x1],
  );

  /* THE BANDS. `stretches()` sorts by start day and returns one
     stretch per phase in that order, so the two lists pair by
     index, and that pairing is what lets the settling head of a
     phase be drawn without this file working out a settling
     window of its own and disagreeing with the one the
     arithmetic used. */
  const bands = useMemo<YearBand[]>(() => {
    const ordered = [...phases].sort((a, b) => a.startDay - b.startDay);
    const out: YearBand[] = [];
    spans.forEach((s, i) => {
      const began = ordered[i]?.startDay ?? s.from;
      if (s.from > began) {
        out.push({
          key: `${s.protocol}-${began}-head`, protocol: s.protocol,
          from: began, to: s.from, readable: false,
        });
      }
      out.push({
        key: `${s.protocol}-${s.from}`, protocol: s.protocol,
        from: s.from, to: s.to, readable: s.readable,
      });
    });
    return out.filter((b) => b.to >= x0 && b.from <= x1);
  }, [phases, spans, x0, x1]);

  const where: Place = profile?.place ?? DEFAULT_PLACE;

  /* THE SEASONS, AS RUNS. `seasonsOn()` answers for one date, so
     the year is walked a day at a time and consecutive days
     under one season are collapsed into a run. The moving four
     run out on purpose, and where they do this returns fewer
     runs, which is why the sentence under the list says how far
     the table reaches. */
  const seasons = useMemo<SeasonRun[]>(() => {
    const out: SeasonRun[] = [];
    const open = new Map<SeasonId, SeasonRun>();
    for (let d = x0; d <= x1; d += 1) {
      const on = seasonsOn({ date: shiftDate(today, d - end), place: where });
      const here = new Set(on.map((s) => s.season.id));
      for (const id of [...open.keys()]) if (!here.has(id)) open.delete(id);
      for (const { season } of on) {
        const run = open.get(season.id);
        if (run) { run.to = d; continue; }
        const fresh: SeasonRun = { key: `${season.id}-${d}`, season, from: d, to: d };
        out.push(fresh);
        open.set(season.id, fresh);
      }
    }
    return out;
  }, [x0, x1, today, end, where]);

  /** The months the axis crosses, clamped to it. ONE list, read
      by the ticks under the chart AND by the table, so the two
      cannot come to disagree about where a month begins. */
  const months = useMemo(() => {
    const out: Array<{ key: string; from: number; to: number; month: number }> = [];
    const startIso = shiftDate(today, x0 - end);
    let y = Number(startIso.slice(0, 4));
    let m = Number(startIso.slice(5, 7));
    for (let guard = 0; guard < 14; guard += 1) {
      const pad = String(m).padStart(2, "0");
      const from = dayNumber(`${y}-${pad}-01`);
      const nextY = m === 12 ? y + 1 : y;
      const nextM = m === 12 ? 1 : m + 1;
      const next = dayNumber(`${nextY}-${String(nextM).padStart(2, "0")}-01`);
      out.push({
        key: `${y}-${pad}`, month: m - 1,
        from: Math.max(from, x0), to: Math.min(next - 1, x1),
      });
      if (next > x1) break;
      y = nextY; m = nextM;
    }
    return out;
  }, [today, x0, x1, end]);

  /* WHAT THE YEAR HOLDS, counted rather than remembered. The two
     add up to YEAR by construction rather than by arithmetic
     anybody has to check: the axis is a year of days, inclusive,
     and today is somewhere in it. */
  const elapsed = Math.min(end, x1) - x0 + 1;
  const toGo = Math.max(x1 - end, 0);
  const weighed = points.length;
  const logged = inYear.filter((d) => d.kcal != null).length;

  const markTally = useMemo(() => {
    const tally = new Map<string, { en: string; bn: string; n: number }>();
    for (const d of inYear) {
      for (const id of d.marks ?? []) {
        const named = markNamed(id);
        if (!named) continue;
        const row = tally.get(named.id);
        if (row) row.n += 1;
        else tally.set(named.id, { en: named.en, bn: named.bn, n: 1 });
      }
    }
    return [...tally.entries()].map(([id, row]) => ({ id, ...row }));
  }, [inYear]);

  const waists = useMemo(
    () => inYear.filter((d) => d.waistCm != null)
      .map((d) => ({ date: d.date, cm: d.waistCm as number })),
    [inYear],
  );

  const knownTo = calendarKnownTo();
  const pastTable = knownTo != null && shiftDate(today, x1 - end) > knownTo;

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return (
      <Invite
        en="A year is a year of your own weighings with your own protocols and marks on it, and all three live on your account."
        bn="এক বছরের হিসাব মানে আপনার নিজের এক বছরের ওজন, তার উপর আপনার নিজের নিয়ম আর চিহ্ন, আর তিনটাই আপনার অ্যাকাউন্টে থাকে।"
        shows={[
          {
            en: "The trend across a full year, with every scale reading drawn behind it.",
            bn: "পুরো এক বছরের ধারা, আর তার পেছনে দাঁড়িপাল্লার প্রতিটা মাপ।",
          },
          {
            en: "Every protocol you ran banded across it, each with its own rate, because a rate never crosses a change of protocol.",
            bn: "যে নিয়মগুলো চালিয়েছেন সেগুলো চওড়া পটি হিসেবে, প্রতিটির নিজের হারসহ, কারণ নিয়ম বদলের উপর দিয়ে কোনো হার টানা হয় না।",
          },
          {
            en: "Ramadan, the Eids, Puja, a British winter and a monsoon along the foot of it, with what each one does to the reading.",
            bn: "নিচের কিনারা ধরে রমজান, ঈদ, পূজা, বিলেতের শীত আর বর্ষা, আর প্রতিটা মাপকে কীভাবে বদলে দেয় তা সহ।",
          },
          {
            en: "The weight at each end, the days you marked, and how much of the year is written down.",
            bn: "দুই প্রান্তের ওজন, যে দিনগুলোয় চিহ্ন দিয়েছেন, আর বছরের কতটা লেখা আছে।",
          },
        ]}
      />
    );
  }

  /* ONE WEIGHING IS STILL DRAWN, and two are what draw a line.
     A reader on their first day should see the mark they just
     made sitting in the year rather than an empty frame, so the
     dot and the axis label are on `anyPoint` and only the two
     paths are on `drawLine`. */
  const anyPoint = points.length >= 1;
  const drawLine = points.length >= 2;
  const ys = anyPoint ? [...points.map((p) => p.kg), ...line.map((p) => p.kg)] : [];
  const y0 = anyPoint ? Math.min(...ys) : 0;
  const y1 = anyPoint ? Math.max(...ys) : 0;

  const px = (d: number): number => {
    const at = PAD.l + ((d - x0) / (x1 - x0)) * (W - PAD.l - PAD.r);
    return Math.min(Math.max(at, PAD.l), W - PAD.r);
  };
  /* Halfway up where every reading is the same weight, which is
     what one weighing is. At the top of the plot it would read as
     a high one. */
  const py = (kg: number): number =>
    y1 === y0
      ? PAD.t + (PLOT_B - PAD.t) / 2
      : PAD.t + (1 - (kg - y0) / (y1 - y0)) * (PLOT_B - PAD.t);
  const path = (ps: Point[]): string =>
    ps.map((p, i) => `${i ? "L" : "M"}${px(p.day).toFixed(1)},${py(p.kg).toFixed(1)}`).join("");

  /** The trend on a given day, which is the last value at or
      before it. Both ends of the year and every month's change
      are read off this rather than off a morning's reading. */
  const trendAt = (day: number): number | null => {
    let got: number | null = null;
    for (const p of line) if (p.day <= day) got = p.kg;
    return got;
  };

  const startKg = drawLine ? line[0].kg : null;
  const endKg = drawLine ? line[line.length - 1].kg : null;
  const change = startKg != null && endKg != null ? endKg - startKg : null;
  const markedTotal = markTally.reduce((s, m) => s + m.n, 0);

  return (
    <div className="dt-year">
      <figure className="dt-chart">
        <svg
          viewBox={`0 0 ${W} ${H}`} role="img"
          aria-describedby={points.length ? "dt-year-table" : undefined}
          aria-label={lang === "bn"
            ? "এক বছরের ওজনের ধারা, তার উপর নিয়মের সময়গুলো আর বছরের ঋতু"
            : "A year of the weight trend, with the protocol stretches and the seasons on it"}
        >
          {/* THE YEAR NOT YET LIVED. Shaded rather than left
              blank, because empty and "not yet" are two different
              statements and a blank makes the first one. */}
          {toGo > 0 ? (
            <rect
              className="dt-year-ahead"
              x={px(end)} y={PAD.t}
              width={Math.max(px(x1) - px(end), 1)} height={PLOT_B - PAD.t}
            />
          ) : null}

          {/* THE PHASES, ACROSS THE BODY OF THE PLOT. A stretch a
              rate may not be fitted to keeps `.dt-settling`,
              which is the mark the long view already draws for
              exactly that, and the stretch table says which is
              which in words. */}
          {bands.map((b) => (
            <rect
              key={b.key}
              className={b.readable ? "dt-year-phase" : "dt-settling"}
              x={px(b.from)} y={PAD.t}
              width={Math.max(px(b.to) - px(b.from), 1)} height={SEASON_TOP - PAD.t}
            >
              <title>{protocolName(b.protocol)[lang]}</title>
            </rect>
          ))}
          {bands.filter((b) => px(b.to) - px(b.from) > 46).map((b) => (
            <text className="dt-ax" key={`${b.key}-name`} x={px(b.from) + 3} y={PAD.t - 8}>
              {protocolName(b.protocol)[lang]}
            </text>
          ))}

          {/* THE SEASONS, ALONG THE FOOT. Faint, because none of
              them changes the arithmetic: what a season changes
              is what a flat month means. */}
          {seasons.map((s) => (
            <rect
              key={s.key} className="dt-year-season"
              x={px(s.from)} y={SEASON_TOP}
              width={Math.max(px(s.to + 1) - px(s.from), 1.5)}
              height={PLOT_B - SEASON_TOP}
            >
              <title>{s.season[lang]}</title>
            </rect>
          ))}
          {/* Inside the strip rather than above it: above, a name
              sits exactly where the trend line runs on a reader
              whose weight is near the bottom of the year. */}
          {seasons.filter((s) => px(s.to + 1) - px(s.from) > 40).map((s) => (
            <text className="dt-ax" key={`${s.key}-name`} x={px(s.from) + 3} y={SEASON_TOP + 9}>
              {s.season[lang]}
            </text>
          ))}

          {/* The axis, labelled, because it does not start at zero
              and a clipped axis with no label exaggerates every
              wobble. */}
          {anyPoint ? (
            <>
              <text className="dt-ax" x={4} y={py(y1) + 4}>{digits(y1.toFixed(1), lang)}</text>
              <line className="dt-ax-line" x1={PAD.l} y1={py(y1)} x2={W - PAD.r} y2={py(y1)} />
              {y1 === y0 ? null : (
                <>
                  <text className="dt-ax" x={4} y={py(y0) + 4}>
                    {digits(y0.toFixed(1), lang)}
                  </text>
                  <line className="dt-ax-line"
                        x1={PAD.l} y1={py(y0)} x2={W - PAD.r} y2={py(y0)} />
                </>
              )}
            </>
          ) : null}

          {/* The months, so a band can be placed in the year
              rather than only measured against the line. */}
          {months.map((mo) => (
            <g key={`${mo.key}-tick`}>
              <line
                className="dt-ax-line"
                x1={px(mo.from)} y1={PLOT_B} x2={px(mo.from)} y2={PLOT_B + 4}
              />
              <text className="dt-ax" x={px(mo.from) + 2} y={PLOT_B + 15}>
                {MONTHS[lang][mo.month]}
              </text>
            </g>
          ))}

          {drawLine ? (
            <>
              <path className="dt-scale-line" d={path(points)} />
              <path className="dt-trend-line" d={path(line)} />
            </>
          ) : null}
          {/* A marked day is a ring and an ordinary one a dot: a
              shape rather than a colour, and it is still drawn.
              Left out of the slope is not hidden from the
              reader. */}
          {points.map((p) => (
            <circle
              key={p.day} className="dt-dot"
              data-marked={markedDays.has(p.day) ? "" : undefined}
              cx={px(p.day)} cy={py(p.kg)} r={markedDays.has(p.day) ? 3.2 : 1.6}
            />
          ))}

          {/* WHERE THE LOG REACHES. Without it the shaded year
              ahead has no edge and the drawing says nothing about
              which day is now. */}
          {toGo > 0 ? (
            <>
              <line className="dt-ax-line" x1={px(end)} y1={PAD.t} x2={px(end)} y2={PLOT_B} />
              <text className="dt-ax" x={px(end) + 3} y={PAD.t - 18}>
                {lang === "bn" ? "আজ" : "today"}
              </text>
            </>
          ) : null}
        </svg>

        <figcaption className="dt-why">
          <T
            en="The heavy line is the trend and the thin one behind it is what the scale actually said, drawn because hiding it would make this look like flattery. A ring instead of a dot is a day you marked: it is drawn and it is left out of every rate. A band across the body of the plot is a stretch of one protocol, and the paler ones are the days a rate may not honestly be fitted to; the seasons run along the foot instead, so the two are told apart by where they are rather than by their colour. The tables below name every one of them. The vertical axis does not start at zero."
            bn="মোটা রেখাটি ধারা, আর পেছনের সরু রেখাটি দাঁড়িপাল্লা আসলে যা বলেছে, দেখানো হয়েছে কারণ লুকালে এটাকে তোষামোদ মনে হতো। বিন্দুর বদলে বৃত্ত মানে আপনার চিহ্ন দেওয়া দিন: সেটা আঁকা হয়, কিন্তু কোনো হারের হিসাবে ধরা হয় না। ছকের ভেতরের চওড়া পটিগুলো এক একটা নিয়মের সময়, আর হালকাগুলো সেই দিনগুলো যেখানে সৎভাবে হার বসানো যায় না; ঋতুগুলো নিচের কিনারা ঘেঁষে চলে, তাই দুটোকে রঙ দিয়ে নয়, অবস্থান দিয়ে আলাদা করা যায়। নিচের তালিকাগুলোয় প্রতিটির নাম আছে। উল্লম্ব অক্ষ শূন্য থেকে শুরু হয় না।"
          />
        </figcaption>
      </figure>

      {/* `.dt-intro` and not `.dt-hint`: this is the first thing
          said about the chart above rather than a note beside a
          control, and a hint is set at ten and a half pixels. */}
      {!drawLine ? (
        <p className="dt-intro">
          <T
            en="Two weighings draw a line, so there is no trend on this year yet. The frame above is the year itself: the seasons are already on it, every weighing is marked as you make it, and the line fills in from the left."
            bn="দুই দিনের ওজনে রেখা আঁকা হয়, তাই এই বছরে এখনো কোনো ধারা নেই। উপরের ছকটাই বছরটা: ঋতুগুলো আগেই বসানো আছে, আপনি যত ওজন লিখবেন প্রতিটাই সেখানে বসবে, আর রেখাটা বাঁ দিক থেকে ভরে উঠবে।"
          />
        </p>
      ) : null}

      <div className="dt-readout">
        <h2 className="dt-readout-h">
          <T en="What the year says" bn="বছরটা যা বলছে" />
        </h2>

        <div className="dt-figure dt-figure-lead">
          <h3><T en="Across the year" bn="সারা বছরে" /></h3>
          <p className="dt-value">
            {change != null
              ? <T
                  en={`${change >= 0 ? "+" : ""}${change.toFixed(1)} kg`}
                  bn={`${change >= 0 ? "+" : ""}${digits(change.toFixed(1), "bn")} কেজি`}
                />
              : <T en="Not yet" bn="এখনো নয়" />}
          </p>
          <p className="dt-said">
            {startKg != null && endKg != null
              ? <T
                  en={`from ${startKg.toFixed(1)} kg to ${endKg.toFixed(1)} kg`}
                  bn={`${digits(startKg.toFixed(1), "bn")} কেজি থেকে ${digits(endKg.toFixed(1), "bn")} কেজি`}
                />
              : <T
                  en="two weighings and this fills in"
                  bn="দুইটা ওজন হলেই এটা এসে যাবে"
                />}
          </p>
          <p className="dt-why">
            <T
              en="Both ends are read off the trend rather than off one morning, because a single reading is real weight plus a kilo or two of water, gut contents and salt. This is the difference between two dates and not a rate fitted through them: a line fitted across a change of protocol is fitted across a step in body water, so the rates are per stretch below."
              bn="দুই প্রান্তই একদিনের মাপ নয়, ধারা থেকে পড়া, কারণ একদিনের ওজন মানে আসল ওজনের সঙ্গে এক দুই কেজি পানি, পেটের খাবার আর লবণ। এটা দুই তারিখের পার্থক্য, তার ভেতর দিয়ে বসানো কোনো হার নয়: নিয়ম বদলের উপর দিয়ে রেখা টানা মানে শরীরের পানির ধাপের উপর দিয়ে টানা, তাই হারগুলো নিচে আলাদা আলাদা সময়ের জন্য দেওয়া।"
            />
          </p>
        </div>

        <div className="dt-figure">
          <h3><T en="How much is written down" bn="কতটা লেখা আছে" /></h3>
          <p className="dt-value">
            <T en={`${weighed}`} bn={digits(weighed, "bn")} />
          </p>
          <p className="dt-said">
            <T
              en={`${weighed === 1 ? "weighing" : "weighings"}, out of ${elapsed} ${elapsed === 1 ? "day" : "days"} so far`}
              bn={`দিনের ওজন, এ পর্যন্ত ${digits(elapsed, "bn")} দিনের মধ্যে`}
            />
          </p>
          <p className="dt-why">
            <T
              en={`Food is logged on ${logged} of them. Neither number is a score: the trend handles gaps by weighting on elapsed time rather than on rows, so weighing three times a week gives a correct trend with a wider band rather than a wrong one.`}
              bn={`এর মধ্যে ${digits(logged, "bn")} দিনে খাওয়ার হিসাবও লেখা আছে। কোনোটাই নম্বর নয়: ধারা ফাঁক সামলায় কত দিন পার হয়েছে তা দিয়ে, কত ঘর ভরেছে তা দিয়ে নয়, তাই সপ্তাহে তিন দিন ওজন করলেও ধারা ভুল হয় না, শুধু সীমাটা চওড়া হয়।`}
            />
          </p>
        </div>

        <div className={toGo > 0 ? "dt-figure dt-figure-empty" : "dt-figure"}>
          <h3><T en="How far into the year" bn="বছরের কতটা" /></h3>
          <p className={toGo > 0 ? "dt-value dt-value-ghost" : "dt-value"}>
            <T
              en={`${elapsed} / ${YEAR}`}
              bn={`${digits(elapsed, "bn")} / ${digits(YEAR, "bn")}`}
            />
          </p>
          <p className="dt-said">
            {toGo > 0
              ? <T
                  en={`${toGo} more ${toGo === 1 ? "day" : "days"} and this page covers a full year`}
                  bn={`আর ${digits(toGo, "bn")} দিন গেলে এই পাতায় পুরো এক বছর আসবে`}
                />
              : <T
                  en="a full year, and the axis now ends today"
                  bn="পুরো এক বছর, আর অক্ষটা এখন আজকের দিনে শেষ হয়"
                />}
          </p>
          <p className="dt-why">
            <T
              en="The chart is a year wide whatever the log holds. Until the log reaches back a year the axis starts at your first weighing and runs a year forward, so the shaded part to the right of today is the rest of this year rather than data that failed to load."
              bn="খাতায় যতটুকুই থাকুক, ছকটা এক বছর চওড়া। খাতা এক বছর পুরনো না হওয়া পর্যন্ত অক্ষ শুরু হয় আপনার প্রথম ওজনের দিন থেকে আর এক বছর সামনে যায়, তাই আজকের ডান পাশের ছায়া দেওয়া অংশটা এই বছরের বাকিটুকু, কোনো তথ্য আসতে না পারা নয়।"
            />
          </p>
        </div>

        {waists.length >= 2 ? (
          <div className="dt-figure">
            <h3><T en="The waist" bn="কোমর" /></h3>
            <p className="dt-value">
              <T
                en={`${waists[waists.length - 1].cm.toFixed(1)} cm`}
                bn={`${digits(waists[waists.length - 1].cm.toFixed(1), "bn")} সেমি`}
              />
            </p>
            <p className="dt-said">
              <T
                en={`from ${waists[0].cm.toFixed(1)} cm, over ${waists.length} measurements`}
                bn={`${digits(waists[0].cm.toFixed(1), "bn")} সেমি থেকে, ${digits(waists.length, "bn")} বার মাপা`}
              />
            </p>
            <p className="dt-why">
              <T
                en="A year is the span where this matters most. A waist that falls while the scale holds still is the one flat month the tool can settle on its own, and it is the difference between a stall and a body changing shape."
                bn="এই মাপটা এক বছরের হিসাবেই সবচেয়ে কাজে লাগে। দাঁড়িপাল্লা স্থির থাকলেও কোমর কমতে থাকলে সেই স্থির মাসটার মানে যন্ত্র নিজেই বলতে পারে, আর এখানেই আটকে যাওয়া আর শরীরের গড়ন বদলানোর পার্থক্য।"
              />
            </p>
          </div>
        ) : null}

        {markTally.length ? (
          <div className="dt-figure">
            <h3><T en="Days you marked" bn="যেসব দিনে চিহ্ন দিয়েছেন" /></h3>
            <p className="dt-value">
              <T en={`${markedTotal}`} bn={digits(markedTotal, "bn")} />
            </p>
            <p className="dt-said">
              {markTally.map((m, i) => (
                <span key={m.id}>
                  {i ? ", " : ""}
                  <T en={`${m.en}: ${m.n}`} bn={`${m.bn}: ${digits(m.n, "bn")}`} />
                </span>
              ))}
            </p>
            <p className="dt-why">
              <T
                en="Drawn as rings on the chart and left out of every rate, which is not the same as hidden. There is no penalty for any of them and no catch-up target the week after: a fever puts water on, and a fortnight of one produces trend data that means nothing."
                bn="ছকে বৃত্ত হিসেবে আঁকা আর সব হারের হিসাব থেকে বাদ, কিন্তু লুকানো নয়। এর জন্য কোনো শাস্তি নেই, পরের সপ্তাহে পুষিয়ে নেওয়ার কোনো লক্ষ্যও নেই: জ্বরে শরীরে পানি জমে, আর দুই সপ্তাহ জ্বর থাকলে ধারার হিসাব কিছুই বোঝায় না।"
              />
            </p>
          </div>
        ) : null}
      </div>

      <Stretches
        spans={yearSpans} declared={phases.length > 0}
        fittable={fittable} points={points} today={today} end={end}
      />

      <Seasons runs={seasons} today={today} end={end} knownTo={knownTo} past={pastTable} />

      {/* THE TABLE. A trend line that exists only as a path is a
          page a screen reader cannot read at all. By month rather
          than by day, because a year is 365 rows and the weighing
          by weighing table is the long view's. */}
      {points.length ? (
        <details className="dt-table-wrap">
          <summary><T en="The same year as a table" bn="একই বছর, তালিকায়" /></summary>
          <table id="dt-year-table" className="dt-table">
            <caption>
              <T
                en="Every month of this year, with the trend read at the end of it."
                bn="এই বছরের প্রতিটি মাস, আর মাস শেষে ধারা যা ছিল।"
              />
            </caption>
            <thead>
              <tr>
                <th scope="col"><T en="Month" bn="মাস" /></th>
                <th scope="col"><T en="Weighings" bn="ওজন" /></th>
                <th scope="col"><T en="Food logged" bn="খাওয়ার হিসাব" /></th>
                <th scope="col"><T en="Trend" bn="ধারা" /></th>
                <th scope="col"><T en="Change" bn="পরিবর্তন" /></th>
                <th scope="col"><T en="Marked" bn="চিহ্ন" /></th>
                <th scope="col"><T en="Season" bn="ঋতু" /></th>
              </tr>
            </thead>
            <tbody>
              {months.filter((mo) => mo.from <= end).map((mo) => {
                const rows = inYear.filter((d) => {
                  const n = dayNumber(d.date);
                  return n >= mo.from && n <= mo.to;
                });
                const at = trendAt(mo.to);
                const before = trendAt(mo.from - 1);
                const here = seasons.filter((s) => s.to >= mo.from && s.from <= mo.to);
                return (
                  <tr key={mo.key}>
                    <th scope="row" className="mono">{digits(mo.key, lang)}</th>
                    <td className="mono">
                      {digits(rows.filter((d) => d.weightKg != null).length, lang)}
                    </td>
                    <td className="mono">
                      {digits(rows.filter((d) => d.kcal != null).length, lang)}
                    </td>
                    <td className="mono">{at == null ? "" : digits(at.toFixed(1), lang)}</td>
                    <td className="mono">
                      {at == null || before == null
                        ? ""
                        : `${at - before >= 0 ? "+" : ""}${digits((at - before).toFixed(1), lang)}`}
                    </td>
                    <td className="mono">
                      {digits(rows.filter((d) => (d.marks?.length ?? 0) > 0).length, lang)}
                    </td>
                    <td>
                      {here.map((s, i) => (
                        <span key={s.key}>
                          {i ? ", " : ""}
                          <T en={s.season.en} bn={s.season.bn} />
                        </span>
                      ))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </details>
      ) : null}
    </div>
  );
}

    /** THE STRETCHES, AND WHY A YEAR HAS NO SINGLE RATE. A regression
        across a change of protocol is a regression across a step in body
        water: three days of keto followed by two of fasting looks like
        0.8 kg a day, which projects a goal weight inside a month and is a
        lie about somebody's body. So a year gets one rate per stretch.

        Where no protocol has ever been declared there is no boundary to
        cross and one rate over the year is the honest answer. Where one
        HAS been declared and none of it falls inside this year, there is
        no window at all, which is a different sentence: `declared` is what
        tells the two apart. */
function Stretches({ spans, declared, fittable, points, today, end }: {
  spans: Stretch[];
  declared: boolean;
  fittable: Point[];
  points: Point[];
  today: string;
  end: number;
}) {
  const lang = useToolLang();
  const iso = (day: number): string => shiftDate(today, day - end);

  if (!spans.length) {
    const rate = declared ? null : slopePerWeek(fittable);
    return (
      <section aria-labelledby="dt-year-rate-h">
        <h2 id="dt-year-rate-h"><T en="The rate" bn="হার" /></h2>
        <p className="dt-intro">
          {declared ? (
            <T
              en="No stretch of a protocol falls inside this year, so there is no window a rate may honestly be fitted to. A rate never crosses a change of protocol, and every day drawn here is outside one."
              bn="এই বছরের ভেতরে কোনো নিয়মের সময় পড়েনি, তাই সৎভাবে হার বসানোর মতো কোনো সময় নেই। নিয়ম বদলের উপর দিয়ে কোনো হার টানা হয় না, আর এখানে আঁকা প্রতিটা দিনই কোনো নিয়মের সময়ের বাইরে।"
            />
          ) : rate ? (
            <T
              en={`${rate.mid >= 0 ? "+" : ""}${rate.mid.toFixed(2)} kg a week, between ${rate.low.toFixed(2)} and ${rate.high.toFixed(2)}, fitted across the whole year. You have not told the tool you were following anything in particular, so there is no change of protocol for a line to cross and the year is one window. Start one on the long view and this becomes a rate per stretch.`}
              bn={`সপ্তাহে ${digits(rate.mid.toFixed(2), "bn")} কেজি, ${digits(rate.low.toFixed(2), "bn")} আর ${digits(rate.high.toFixed(2), "bn")} এর মধ্যে, পুরো বছরের উপর বসানো। আপনি বিশেষ কোনো নিয়ম মানছেন বলে লেখেননি, তাই রেখা পার হওয়ার মতো কোনো নিয়ম বদল নেই আর পুরো বছরটাই একটা সময়। লম্বা হিসাবের পাতায় একটা নিয়ম শুরু করলে এটা প্রতিটি সময়ের জন্য আলাদা হার হয়ে যাবে।`}
            />
          ) : (
            <T
              en="A week of weighings gives a rate and a shorter run carries none, because the noise is larger than the signal. Nothing here is following a protocol, so when there is a rate it will be one rate across the whole year."
              bn="এক সপ্তাহের মাপে একটা হার আসে, তার কম সময়ে কিছুই আসে না, কারণ ওঠানামা সংকেতের চেয়ে বড়। এখানে কোনো নিয়ম চলছে না, তাই হার এলে সেটা পুরো বছরের জন্য একটাই হবে।"
            />
          )}
        </p>
      </section>
    );
  }

  return (
    <section aria-labelledby="dt-year-rate-h">
      <h2 id="dt-year-rate-h">
        <T en="What you ran, and what it did" bn="যা যা চালিয়েছেন, আর তাতে যা হয়েছে" />
      </h2>
      <p className="dt-intro">
        <T
          en="One rate per stretch and never one across the lot. A line fitted across a change of protocol is fitted across a step in body water, and it reports a rate nobody is running."
          bn="প্রতিটি সময়ের জন্য আলাদা হার, সব মিলিয়ে একটা নয়। নিয়ম বদলের উপর দিয়ে বসানো রেখা আসলে শরীরের পানির ধাপের উপর দিয়ে বসানো, আর তাতে এমন একটা হার বেরোয় যেটা কেউ চালাচ্ছে না।"
        />
      </p>
      <div className="dt-table-wrap">
        <table className="dt-table">
          <caption>
            <T
              en="Every stretch this year crosses, in order"
              bn="এই বছরে যত সময় পড়েছে, ক্রম অনুযায়ী"
            />
          </caption>
          <thead>
            <tr>
              <th scope="col"><T en="What" bn="কী" /></th>
              <th scope="col"><T en="From" bn="থেকে" /></th>
              <th scope="col"><T en="To" bn="পর্যন্ত" /></th>
              <th scope="col"><T en="Rate a week" bn="সপ্তাহের হার" /></th>
            </tr>
          </thead>
          <tbody>
            {spans.map((s) => {
              const rate = s.readable
                ? slopePerWeek(fittable.filter((p) => p.day >= s.from && p.day <= s.to))
                : null;
              const name = protocolName(s.protocol);
              const seen = points.filter((p) => p.day >= s.from && p.day <= s.to).length;
              return (
                <tr key={`${s.protocol}-${s.from}`}>
                  <th scope="row"><T en={name.en} bn={name.bn} /></th>
                  <td className="mono">{digits(iso(s.from), lang)}</td>
                  <td className="mono">{digits(iso(s.to), lang)}</td>
                  <td>
                    {rate ? (
                      <span className="mono">
                        <T
                          en={`${rate.mid >= 0 ? "+" : ""}${rate.mid.toFixed(2)} kg`}
                          bn={`${rate.mid >= 0 ? "+" : ""}${digits(rate.mid.toFixed(2), "bn")} কেজি`}
                        />
                      </span>
                    ) : s.why ? (
                      <T en={WHY[s.why].en} bn={WHY[s.why].bn} />
                    ) : (
                      <T
                        en={`${seen} ${seen === 1 ? "weighing" : "weighings"}, not enough for a rate`}
                        bn={`${digits(seen, "bn")}টা ওজন, হার বের করার মতো যথেষ্ট নয়`}
                      />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

    /** THE SEASONS THIS YEAR CROSSES. A faint band with no name on it is
        decoration, so every band is named here with what it does to the
        reading. None of them changes the arithmetic: what they change is
        what a flat month means. The moving four are a table and it runs
        out on purpose, so a year reaching past it says so rather than
        drawing a fast in the wrong fortnight. */
function Seasons({ runs, today, end, knownTo, past }: {
  runs: SeasonRun[];
  today: string;
  end: number;
  knownTo: string | null;
  past: boolean;
}) {
  const lang = useToolLang();
  const iso = (day: number): string => shiftDate(today, day - end);
  if (!runs.length && !past) return null;

  return (
    <section className="dt-season" aria-labelledby="dt-year-season-h">
      <h2 id="dt-year-season-h">
        <T en="The seasons this year crosses" bn="এই বছরে যেসব সময় পড়েছে" />
      </h2>
      <p className="dt-intro">
        <T
          en="None of this changes the arithmetic. It changes what a flat month means, which is the part you would otherwise have to remember."
          bn="এতে হিসাবের কিছু বদলায় না। বদলায় স্থির একটা মাসের মানে, যেটা না থাকলে আপনাকেই মনে রাখতে হতো।"
        />
      </p>
      <dl className="dt-defs">
        {runs.map((r) => (
          <div key={r.key}>
            <dt>
              <T en={r.season.en} bn={r.season.bn} />
              {" "}
              <span className="mono">
                {r.to > r.from ? (
                  <T
                    en={`${iso(r.from)} to ${iso(r.to)}`}
                    bn={`${digits(iso(r.from), "bn")} থেকে ${digits(iso(r.to), "bn")}`}
                  />
                ) : (
                  digits(iso(r.from), lang)
                )}
              </span>
            </dt>
            <dd><T en={r.season.readEn} bn={r.season.readBn} /></dd>
          </div>
        ))}
      </dl>
      {past && knownTo ? (
        <p className="dt-why">
          <T
            en={`Ramadan, the two Eids and Durga Puja move about eleven days a year against this calendar and the day each begins is settled by sighting, so they are a table here rather than a formula. It is filled in to ${knownTo}, and this year reaches past that, so none of the four is drawn on the part beyond it. Mark the days yourself and they still count.`}
            bn={`রমজান, দুই ঈদ আর দুর্গাপূজা এই পঞ্জিকার হিসাবে বছরে প্রায় এগারো দিন করে সরে যায়, আর কোন দিনে শুরু সেটা চাঁদ দেখে ঠিক হয়, তাই এখানে সেগুলো সূত্র নয়, তালিকা। তালিকা ${knownTo} পর্যন্ত ভরা আছে, আর এই বছর তার পরেও যায়, তাই ওই অংশে চারটির কোনোটাই আঁকা হচ্ছে না। দিনগুলো নিজে চিহ্ন দিলে সেগুলো ঠিকই গোনা হবে।`}
          />
        </p>
      ) : null}
    </section>
  );
}
