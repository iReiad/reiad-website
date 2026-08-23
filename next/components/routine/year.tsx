"use client";

/* ============================================================
   routine/year.tsx: what a stretch of days has to say.

   Rich, useful, and never a scoreboard. `ROUTINE.md` §6 and §7
   are the plan; the rules that matter here are the ones that are
   easy to break while trying to be helpful:

     NOTHING GOES DOWN. The flock and the garden are "how many
     times ever". No window, no reset, no next milestone named. A
     person who stops for a fortnight comes back to find them
     exactly as they left them.

     AN UNMARKED DAY IS NOT A HOLE. Empty heatmap cells are the
     paper colour, not a gap and not a colour that means
     something went wrong.

     NO CORRELATION IS EVER PRINTED. The mood ribbon sits on the
     same date axis as the heatmap so a pattern is VISIBLE, and
     the tool never says one is there. It does not know.

   ---- the charts are drawn here ----

   Six panels of SVG rather than a charting dependency, which
   would be sixty kilobytes to draw a grid of squares and some
   bars. Every one of them is a `map` over an array.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  done, heat, consistency, neverMarked, changed, balance,
  everMarked, flock, garden, seasonOf, echo, written, moodColour,
  type Band, type Task, type RoutineShape, type Entry, type Cell,
  GROWN,
} from "@reiad/shared/routine";
import { runtimeModule } from "../account/runtime";
import { Button } from "../ui/button";
import { Field } from "../ui/field";

type AccountModule = typeof import("/account.js");
type RoutineModule = typeof import("/routine.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");
const routineModule = () => runtimeModule<RoutineModule>("/routine.js");

const BN = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");
const bn = (n: number | string): string => String(n).replace(/\d/g, (d) => BN[Number(d)]);

/** The two tasks that have a drawing behind them, and the tasks
    are named by id rather than by label because a reader can
    rename anything and the birds should not leave when they do. */

const dayLabel = (iso: string): string => new Intl.DateTimeFormat("en-GB", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${iso}T12:00:00Z`));

/* ---------- the heatmap ---------- */

/** Twelve weeks, one cell per day, oldest first.

    An empty day is the PAPER colour rather than a gap: it is not
    a hole in a year and must not read as one. */
function Heat({ cells, onPick }: { cells: Cell[]; onPick: (d: string) => void }) {
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  const today = cells[cells.length - 1]?.date;

  return (
    <div className="rt-heat" role="group" aria-label="The last twelve weeks">
      {weeks.map((week) => (
        <div className="rt-heat-week" key={week[0].date}>
          {week.map((cell) => (
            <button type="button" key={cell.date}
                    className="rt-heat-day"
                    data-here={cell.date === today ? "" : undefined}
                    /* The opacity IS the number. A fraction of
                       null leaves it at zero, which is paper. */
                    style={{ "--fill": cell.fraction ?? 0 } as React.CSSProperties}
                    onClick={() => onPick(cell.date)}
                    aria-label={cell.fraction === null
                      ? `${dayLabel(cell.date)}, nothing marked`
                      : `${dayLabel(cell.date)}, ${Math.round(cell.fraction * 100)}%`} />
          ))}
          {/* The mood, on the same date axis and directly under
              it, so a pattern is VISIBLE. Nothing claims one is
              there: this tool does not know and will not say. */}
          <div className="rt-mood-strip" aria-hidden="true">
            {week.map((cell) => (
              <i key={cell.date}
                 /* The colour travels with the mood rather than
                    living in the stylesheet, the same way a
                    band's does. A rule naming `--green` paints
                    green on a page wearing blue. */
                 style={cell.mood
                   ? ({ "--mood": moodColour(cell.mood) } as React.CSSProperties)
                   : undefined} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------- the things that only grow ---------- */

function Bird({ n }: { n: number }) {
  return (
    <svg className="rt-bird" viewBox="0 0 24 18" fill="none" aria-hidden="true"
         style={{ "--n": n } as React.CSSProperties}>
      <path d="M2 11c3-6 8-8 11-6 2 1 2 4 0 5l6 1-5 3c-4 2-9 1-12-3Z"
            fill="currentColor" opacity="0.85" />
      <circle cx="15" cy="7.5" r="0.9" fill="var(--paper)" />
    </svg>
  );
}

function Sprout({ n }: { n: number }) {
  return (
    <svg className="rt-plant" viewBox="0 0 20 26" fill="none" aria-hidden="true"
         style={{ "--n": n } as React.CSSProperties}>
      <path d="M10 26V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M10 15c-5 0-6-4-6-6 4 0 6 2 6 6Z" fill="currentColor" opacity="0.8" />
      <path d="M10 12c5 0 6-4 6-7-4 0-6 3-6 7Z" fill="currentColor" opacity="0.6" />
    </svg>
  );
}

/** The flock and the garden.

    NO NUMBER IS SHOWN and no next one is named. A named threshold
    is a target, and there are none of those here: these are a
    presence rather than a reward, and skipping a month changes
    nothing about them at all. */
function Living({ birds, plants }: { birds: number; plants: number }) {
  const flying = flock(birds);
  const grown = garden(plants);
  if (flying === 0 && grown.length === 0) return null;

  return (
    <div className="rt-living">
      {flying > 0 ? (
        <p className="rt-flock" aria-label={`${flying} birds`}>
          {Array.from({ length: flying }, (_, i) => <Bird key={i} n={i} />)}
        </p>
      ) : null}
      {grown.length > 0 ? (
        <p className="rt-garden">
          {grown.map((p, i) => <Sprout key={p.en} n={i} />)}
          <span className="rt-quiet">{grown.map((p) => p.bn).join(", ")}</span>
        </p>
      ) : null}
    </div>
  );
}

/* ---------- the jar ---------- */

/** Every good thing, in a jar. Press it and one comes back out.

    Over a year this is the best thing in the tool and it is a
    random index. It can only ever get fuller. */
function Jar({ notes }: { notes: Entry[] }) {
  const [out, setOut] = useState<Entry | null>(null);
  const shake = useCallback(() => {
    if (notes.length === 0) return;
    setOut(notes[Math.floor(Math.random() * notes.length)]);
  }, [notes]);

  if (notes.length === 0) {
    return (
      <p className="rt-quiet">
        Write one good thing on a day and it goes in the jar.
      </p>
    );
  }

  return (
    <div className="rt-jar-panel">
      <button type="button" className="rt-jar" onClick={shake}
              aria-label={`Take one of ${notes.length} good things out of the jar`}>
        <svg viewBox="0 0 60 76" fill="none" aria-hidden="true">
          <rect x="14" y="4" width="32" height="8" rx="2" fill="currentColor" opacity="0.5" />
          <path d="M10 18c0-3 3-6 8-6h24c5 0 8 3 8 6v48c0 4-3 6-8 6H18c-5 0-8-2-8-6V18Z"
                stroke="currentColor" strokeWidth="2" opacity="0.6" />
          {/* The fill is how many are in it, capped so that a
              full jar stays a jar. Nothing says how many more. */}
          <rect x="12" y={70 - Math.min(50, notes.length * 1.6)} width="36"
                height={Math.min(50, notes.length * 1.6)} rx="4"
                fill="currentColor" opacity="0.18" />
        </svg>
        <span className="mono">{bn(notes.length)}</span>
      </button>
      {out ? (
        <blockquote className="rt-out">
          <p>{out.note}</p>
          <cite>{dayLabel(out.entry_date)}</cite>
        </blockquote>
      ) : (
        <p className="rt-quiet">Press the jar.</p>
      )}
    </div>
  );
}

/* ---------- the page ---------- */

export function RoutineYear() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [shape, setShape] = useState<RoutineShape | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [today, setToday] = useState("");
  const [find, setFind] = useState("");

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [acc, rt] = await Promise.all([accountModule(), routineModule()]);
        if (!acc.current()) { if (live) { setSignedIn(false); setReady(true); } return; }
        if (live) setSignedIn(true);
        const mine = await rt.activeRoutine();
        if (!live || !mine) { if (live) setReady(true); return; }
        const day = rt.todayFor(4);
        const all = await rt.daysBetween("1970-01-01", "2999-12-31");
        if (!live) return;
        setShape({ bands: mine.bands as Band[], tasks: mine.tasks as Task[] });
        setEntries(all.map((e): Entry => ({
          entry_date: e.entry_date, marks: e.marks ?? {},
          mood: e.mood, note: e.note, chose: e.chose,
        })));
        setToday(day);
      } finally { if (live) setReady(true); }
    })();
    return () => { live = false; };
  }, []);

  const notes = useMemo(() => written(entries), [entries]);
  const found = useMemo(() => {
    const q = find.trim().toLowerCase();
    return q ? notes.filter((e) => String(e.note ?? "").toLowerCase().includes(q)) : notes;
  }, [notes, find]);

  if (!ready) return <p className="rt-quiet" role="status">এক মুহূর্ত…</p>;
  if (!signedIn || !shape) {
    return <p className="rt-quiet">Sign in on the day page and this fills in.</p>;
  }

  /* An invitation rather than an apology. */
  if (entries.length === 0) {
    return (
      <p className="rt-quiet rt-empty">
        Mark a few things and this page starts filling in.
      </p>
    );
  }

  const cells = heat(shape, entries, today);
  const tally = consistency(shape, entries, today);
  const never = neverMarked(shape, entries);
  const shares = balance(shape, entries);
  const season = seasonOf(today);
  const back = echo(entries, today);
  const birds = everMarked(entries, GROWN.birds);
  const plants = everMarked(entries, GROWN.plants);

  /* The one task worth a sentence: the most-marked thing, said
     factually. Two numbers, no arrow, no verdict. */
  const top = tally.find((t) => t.marked > 0);
  const shift = top ? changed(entries, top.task.id, today) : null;

  return (
    <div className="rt-year" style={{ "--season": season.colour } as React.CSSProperties}>
      <p className="rt-season">
        <span lang="bn">{season.bn}</span>
        <span className="rt-quiet"> · {season.en}</span>
      </p>

      <Living birds={birds} plants={plants} />

      <section className="rt-panel">
        <h3>শেষ বারো সপ্তাহ</h3>
        <Heat cells={cells} onPick={(d) => { location.href = `/tools/routine#${d}`; }} />
      </section>

      {back ? (
        <section className="rt-panel rt-echo">
          <h3 lang="bn">{back.bn}</h3>
          <blockquote><p>{back.entry.note}</p></blockquote>
        </section>
      ) : null}

      <section className="rt-panel">
        <h3>একটা ভালো কিছু</h3>
        <Jar notes={notes} />
      </section>

      <section className="rt-panel">
        <h3>শেষ চার সপ্তাহ</h3>
        <ul className="rt-bars">
          {tally.map(({ task, marked, of }) => (
            <li key={task.id}>
              <span className="rt-bar-name">{task.bn} · {task.en}</span>
              <span className="rt-bar" aria-hidden="true"
                    style={{
                      "--of": marked / of,
                      "--accent": shape.bands.find((b) => b.id === task.band)?.colour,
                    } as React.CSSProperties}>
                <i />
              </span>
              <span className="rt-bar-n mono">{bn(marked)}</span>
            </li>
          ))}
        </ul>
        {shift && shift.now + shift.before > 0 ? (
          <p className="rt-quiet rt-changed">
            {`${top?.task.en} is marked on ${shift.now} of the last ${shift.of} days. `
              + `Before that it was ${shift.before} of ${shift.of}.`}
          </p>
        ) : null}
      </section>

      {/* THE MOST IMPORTANT PANEL. A routine full of aspirational
          tasks is what makes a tracker feel bad, and the fix is
          taking them out rather than trying harder. Nothing nags
          and nothing counts them: the list simply exists. */}
      {never.length > 0 ? (
        <section className="rt-panel">
          <h3>Still waiting</h3>
          <p className="rt-quiet">
            These have not been marked yet. That is allowed, and taking one off
            the list is allowed too.
          </p>
          <ul className="rt-waiting">
            {never.map((t) => <li key={t.id}>{t.bn} · {t.en}</li>)}
          </ul>
          <Button kind="ghost" size="sm"
                  onClick={() => { location.href = "/tools/routine/settings"; }}>
            change the list
          </Button>
        </section>
      ) : null}

      {shares.length > 0 ? (
        <section className="rt-panel">
          <h3>একটা সাধারণ দিন</h3>
          <div className="rt-balance" role="img"
               aria-label={shares.map((s) => `${s.band.en} ${Math.round(s.share * 100)}%`).join(", ")}>
            {shares.map(({ band, share }) => (
              <i key={band.id} style={{
                "--of": share, "--accent": band.colour,
              } as React.CSSProperties} />
            ))}
          </div>
          <ul className="rt-key-list">
            {shares.map(({ band, share }) => (
              <li key={band.id}>
                <i style={{ "--accent": band.colour } as React.CSSProperties} />
                {band.bn} · {Math.round(share * 100)}%
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="rt-panel">
        <h3>যা যা লিখেছি</h3>
        <Field id="rt-find" label="Search what you have written" type="search"
               value={find} onChange={(e) => setFind(e.target.value)} />
        <ul className="rt-log">
          {found.map((e) => (
            <li key={e.entry_date}>
              <p>{e.note}</p>
              <cite>
                {dayLabel(e.entry_date)}
                {e.mood ? <span className="rt-quiet"> · {e.mood}</span> : null}
              </cite>
            </li>
          ))}
        </ul>
        {found.length === 0 ? <p className="rt-quiet">Nothing with those words in it.</p> : null}
      </section>
    </div>
  );
}
