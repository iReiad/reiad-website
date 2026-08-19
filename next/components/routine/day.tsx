"use client";

/* ============================================================
   routine/day.tsx: the day, and the twenty seconds it has to fit
   into.

   Open it, mark three things, write a line, close it. That is
   the whole brief and everything here serves it.

   ---- what it will never do ----

   ROUTINE.md §0: nothing this tool remembers ever goes down.
   There is no streak here, no target, nothing red, and no zero.
   An empty day says so in words, because `done()` answers null
   rather than 0 and a zero is a judgement wearing a number's
   clothes.

   ---- optimistic, and honest about failing ----

   A mark appears the moment it is pressed. If the write fails it
   STAYS ON SCREEN, a retry is queued, and one plain line says so.
   Never discard input silently and never roll a tick back under
   somebody's finger: they marked it, they were right, and the
   network is not their problem.

   The queue is one deep on purpose. Every save sends the WHOLE
   day, so a second edit while the first is in flight makes the
   first redundant rather than lost, and the retry always carries
   the newest state. `saveDay()` says why the whole day goes:
   merge-duplicates replaces the row, so a partial write would
   erase the note somebody wrote this morning.

   ---- the tick is the only motion ----

   It strokes itself on like a pen, an SVG path animating
   `stroke-dashoffset` to 0 over about 380ms, and nothing else on
   this page animates. `prefers-reduced-motion: reduce` renders it
   instantly, in the stylesheet, so this file does not check.
   ============================================================ */

import {
  useCallback, useEffect, useMemo, useRef, useState,
} from "react";
import {
  TEMPLATES, FIRST_RUN, MOODS, done, bandTasks,
  type Band, type Task, type RoutineShape,
} from "@reiad/shared/routine";
import { runtimeModule } from "../account/runtime";
import { Button, ButtonLink } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field, TextArea } from "../ui/field";

type AccountModule = typeof import("/account.js");
type RoutineModule = typeof import("/routine.js");

const accountModule = () => runtimeModule<AccountModule>("/account.js");
const routineModule = () => runtimeModule<RoutineModule>("/routine.js");

/* Which language the labels are in. Kept on the profile, so it
   follows a reader between devices, and defaulting to both
   because this site is bilingual and the answer for most people
   is "show me both". */
type Locale = "both" | "en" | "bn";

/** Bengali digits, from their code points rather than typed.

    A port of this retyped the string once and produced the
    DEVANAGARI digits, which look close enough in a diff to
    survive review and put every number on a Bangla page into the
    wrong script. `shared/schools.ts` carries the same note. */
const BN = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");
const bn = (n: number | string): string => String(n).replace(/\d/g, (d) => BN[Number(d)]);

/** A name in whichever languages are wanted. */
function label(thing: { en: string; bn: string }, locale: Locale): string {
  if (locale === "en") return thing.en;
  if (locale === "bn") return thing.bn;
  return `${thing.bn} · ${thing.en}`;
}

/* ---------- the tick ---------- */

/** The one piece of motion. A single path, drawn on when it is
    full and half-drawn when it is half.

    `pathLength="1"` normalises the dash arithmetic, so the
    stylesheet animates `stroke-dashoffset` from 1 to 0 without
    anybody measuring the path. */
function Tick({ state }: { state: 0 | 0.5 | 1 }) {
  return (
    <span className="rt-tick" data-state={state} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path d="M4 12.5 L9.5 18 L20 6.5" pathLength={1}
              stroke="currentColor" strokeWidth={2.6}
              strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

/* ---------- one task ---------- */

function TaskRow({ task, mark, locale, onPress, index }: {
  task: Task;
  mark: number;
  locale: Locale;
  onPress: () => void;
  index: number;
}) {
  const state: 0 | 0.5 | 1 = mark >= 1 ? 1 : mark > 0 ? 0.5 : 0;
  const said = state === 1 ? "done" : state === 0.5 ? "half" : "not today";

  return (
    <li className="rt-task">
      {/* A real button, and the whole row is it: the target is
          the line and not the 24px tick at the end of it, which
          is the difference between a list that works with a thumb
          and one that does not. */}
      <button type="button" className="rt-mark" onClick={onPress}
              data-state={state}
              aria-pressed={state > 0}
              aria-label={`${label(task, locale)}, ${said}`}>
        <Tick state={state} />
        <span className="rt-task-name">{label(task, locale)}</span>
        {/* The number key that marks it, for somebody who has
            learnt the list. Hidden from a screen reader because
            the shortcut is announced on the list itself. */}
        {index < 9 ? <span className="rt-key mono" aria-hidden="true">{index + 1}</span> : null}
        {typeof task.hours === "number" ? (
          <span className="rt-hours mono" aria-hidden="true">
            {locale === "en" ? task.hours : bn(task.hours)}
          </span>
        ) : null}
      </button>
    </li>
  );
}

/* ---------- the day ---------- */

interface DayState {
  marks: Record<string, number>;
  mood: string | null;
  note: string;
  chose: string;
}

const EMPTY: DayState = { marks: {}, mood: null, note: "", chose: "" };

export function RoutineDay() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [shape, setShape] = useState<RoutineShape | null>(null);
  const [routineId, setRoutineId] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>("both");
  const [roll, setRoll] = useState(4);
  const [date, setDate] = useState<string | null>(null);
  const [day, setDay] = useState<DayState>(EMPTY);
  const [saved, setSaved] = useState<"idle" | "saving" | "ok" | "later">("idle");

  /* The newest state, for the debounce and the retry. A ref
     rather than state because the timer closes over it and a
     stale closure here is a save that writes what the day looked
     like two keystrokes ago. */
  const latest = useRef<DayState>(EMPTY);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retry = useRef<ReturnType<typeof setTimeout> | null>(null);

  /* ---- who is reading, and what their routine is ---- */
  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [acc, rt] = await Promise.all([accountModule(), routineModule()]);
        const who = acc.current();
        if (!live) return;
        if (!who) { setSignedIn(false); setReady(true); return; }
        setSignedIn(true);

        const profile = acc.cachedProfile() ?? await acc.getProfile();
        const loc = String((profile as { routine_locale?: string } | null)?.routine_locale ?? "both");
        const hour = Number((profile as { routine_day_roll?: number } | null)?.routine_day_roll ?? 4);
        if (live) {
          setLocale((loc === "en" || loc === "bn") ? loc : "both");
          setRoll(Number.isFinite(hour) ? hour : 4);
        }

        let mine = await rt.activeRoutine();
        /* First visit: a routine is copied on to the account so
           there is something to mark. `A simple day` and not
           Sadia's, deliberately, because a first run should not
           be a wall of somebody else's life. */
        if (!mine) {
          const seed = TEMPLATES.find((t) => t.slug === FIRST_RUN) ?? TEMPLATES[0];
          mine = await rt.makeRoutine(seed.name, seed.data);
        }
        if (!live) return;
        setRoutineId(mine.id);
        setShape({ bands: mine.bands as Band[], tasks: mine.tasks as Task[] });
        setDate(rt.todayFor(Number.isFinite(hour) ? hour : 4));
      } catch (err) {
        console.warn("routine: could not open", err);
      } finally {
        if (live) setReady(true);
      }
    })();
    return () => { live = false; };
  }, []);

  /* ---- the day being looked at ---- */
  useEffect(() => {
    if (!date || !signedIn) return;
    let live = true;
    (async () => {
      const rt = await routineModule();
      const row = await rt.dayEntry(date);
      if (!live) return;
      const next: DayState = row
        ? {
          marks: row.marks ?? {},
          mood: row.mood,
          note: row.note ?? "",
          chose: row.chose ?? "",
        }
        : EMPTY;
      latest.current = next;
      setDay(next);
      setSaved("idle");
    })();
    return () => { live = false; };
  }, [date, signedIn]);

  /* ---- writing ---- */

  const push = useCallback(async () => {
    if (!routineId || !date) return;
    const sending = latest.current;
    setSaved("saving");
    try {
      const rt = await routineModule();
      await rt.saveDay(routineId, date, sending);
      /* Only if nothing has been typed since. A "saved" under a
         half-typed word is a lie about the half. */
      if (latest.current === sending) setSaved("ok");
      if (retry.current) { clearTimeout(retry.current); retry.current = null; }
    } catch (err) {
      console.warn("routine: not saved yet", err);
      setSaved("later");
      /* The mark stays where it is and we try again. Nothing is
         rolled back, ever: they marked it and they were right. */
      if (!retry.current) {
        retry.current = setTimeout(() => { retry.current = null; void push(); }, 6000);
      }
    }
  }, [routineId, date]);

  const change = useCallback((next: DayState) => {
    latest.current = next;
    setDay(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void push(); }, 500);
  }, [push]);

  /* Empty, full, half, empty. Half is 0.5 and it is a real
     answer rather than a lesser kind of nothing. */
  const cycle = useCallback((id: string) => {
    const was = latest.current.marks[id] ?? 0;
    const now = was === 0 ? 1 : was >= 1 ? 0.5 : 0;
    const marks = { ...latest.current.marks };
    if (now === 0) delete marks[id]; else marks[id] = now;
    change({ ...latest.current, marks });
  }, [change]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
    if (retry.current) clearTimeout(retry.current);
  }, []);

  /* ---- moving between days ---- */

  const shift = useCallback((by: number) => {
    setDate((was) => {
      if (!was) return was;
      const d = new Date(`${was}T12:00:00`);
      d.setDate(d.getDate() + by);
      const p = (n: number) => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
    });
  }, []);

  /* Arrows move the day, digits mark a task. Ignored while
     something is being typed into, which is the difference
     between a shortcut and a page that fights the writer. */
  const order = useMemo(
    () => (shape ? shape.tasks.filter((t) => !t.archived).sort((a, b) => a.order - b.order) : []),
    [shape],
  );
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|TEXTAREA)$/.test(el.tagName)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === "ArrowLeft") { shift(-1); e.preventDefault(); return; }
      if (e.key === "ArrowRight") { shift(1); e.preventDefault(); return; }
      if (/^[1-9]$/.test(e.key)) {
        const task = order[Number(e.key) - 1];
        if (task) { cycle(task.id); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [order, shift, cycle]);

  /* ---- what to draw ---- */

  if (!ready) {
    return <p className="rt-quiet" role="status">এক মুহূর্ত…</p>;
  }

  if (!signedIn) {
    return (
      <div className="rt-invite">
        <h2>আপনার নিজের রুটিন</h2>
        <p>
          A day of your own: mark what you did, write one good thing, and keep
          it. It is yours, it is private, and nothing here counts days in a row
          or turns red.
        </p>
        <Button kind="solid"
                onClick={() => document.querySelector<HTMLElement>(".account-btn")?.click()}>
          Sign in to start
        </Button>
      </div>
    );
  }

  if (!shape || !date) {
    return <p className="rt-quiet" role="status">রুটিনটা খুলতে পারলাম না।</p>;
  }

  const fraction = done(shape, { entry_date: date, marks: day.marks });
  const bands = [...shape.bands].sort((a, b) => a.order - b.order);
  const chose = shape.tasks.find((t) => t.id === "own" && !t.archived);

  return (
    <div className="rt-day">
      <header className="rt-head">
        <div className="rt-when">
          <Button kind="quiet" size="sm" onClick={() => shift(-1)}
                  aria-label="আগের দিন">‹</Button>
          <span className="rt-date">{dayName(date, locale)}</span>
          <Button kind="quiet" size="sm" onClick={() => shift(1)}
                  aria-label="পরের দিন">›</Button>
        </div>

        {/* NO ZERO, EVER. `done()` answers null for a day with
            nothing on it and the page says so in words. */}
        <p className="rt-figure" aria-live="polite">
          {fraction === null
            ? "আজ এখনো খালি"
            : `${locale === "en" ? Math.round(fraction * 100) : bn(Math.round(fraction * 100))}%`}
        </p>
      </header>

      {bands.map((band) => {
        const tasks = bandTasks(shape, band.id);
        if (tasks.length === 0) return null;
        return (
          <section className="rt-band" key={band.id}
                   style={{ "--accent": band.colour } as React.CSSProperties}>
            <h2 className="rt-band-name">{label(band, locale)}</h2>
            <ul className="rt-tasks">
              {tasks.map((task) => (
                <TaskRow key={task.id} task={task} locale={locale}
                         mark={day.marks[task.id] ?? 0}
                         index={order.indexOf(task)}
                         onPress={() => cycle(task.id)} />
              ))}
            </ul>
          </section>
        );
      })}

      {/* What she chose, beside the task that has no hours. One
          line turns a tick into a diary. */}
      {chose ? (
        <div className="rt-chose">
          <Field id="rt-chose" label={label(chose, locale)} type="text"
                 maxLength={200} value={day.chose} placeholder="…"
                 onChange={(e) => change({ ...latest.current, chose: e.target.value })} />
        </div>
      ) : null}

      <section className="rt-mood">
        <h2>আজকে কেমন লাগছে?</h2>
        <div className="rt-moods">
          {MOODS.map((m) => (
            <ChipButton key={m.id} pressed={day.mood === m.id}
                        onClick={() => change({
                          ...latest.current,
                          mood: latest.current.mood === m.id ? null : m.id,
                        })}>
              {label(m, locale)}
            </ChipButton>
          ))}
        </div>
      </section>

      <div className="rt-note">
        <TextArea id="rt-note" rows={3} maxLength={2000} value={day.note}
                  label="একটা ভালো কিছু · One good thing today"
                  onChange={(e) => change({ ...latest.current, note: e.target.value })} />
      </div>

      {/* Quiet, never a modal, never over the content. And the
          failure is a promise rather than an apology: it stays on
          screen and we keep trying. */}
      {/* The other surface, from here rather than from the rail:
          "what is on my list" is a question somebody has while
          looking at the list, and never one they have while
          deciding where to go. */}
      <p className="rt-to-settings">
        <ButtonLink kind="quiet" size="sm" href="/tools/routine/settings">
          change what is on this list
        </ButtonLink>
        {/* The paper fallback, and it is linked from the day
            rather than buried in settings for the reason it
            exists: somebody wants it on the day the screen is
            flat, which is not a day they will go looking. */}
        <ButtonLink kind="quiet" size="sm" href="/tools/routine/print">
          the week on paper
        </ButtonLink>
      </p>

      <p className="rt-saved" data-state={saved} role="status">
        {saved === "ok" ? "saved"
          : saved === "later" ? "not saved yet, we will keep trying"
            : saved === "saving" ? "…" : ""}
      </p>
    </div>
  );
}

/** The date, written the way somebody says it.

    `T12:00:00` on the way in, because a bare `YYYY-MM-DD` is
    parsed as UTC midnight and formatted in local time, which is
    the previous day for everybody west of Greenwich and an hour
    of every evening east of it. */
function dayName(iso: string, locale: Locale): string {
  const d = new Date(`${iso}T12:00:00`);
  const fmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : "bn-BD", {
    weekday: "long", day: "numeric", month: "long",
  });
  return fmt.format(d);
}
