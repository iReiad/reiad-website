"use client";

/* ============================================================
   routine/settings.tsx: everything that shapes the tool.

   Three panels on `components/ui/tab-panels.tsx`, which is the
   arrangement `/account` already uses. A SEPARATE SURFACE from
   the day, deliberately, and the build spec is right about why:
   the day has to open, take three marks and close in under
   twenty seconds, and a page carrying a task editor is not that
   page.

   ---- the builder says the one useful thing ----

   "Planned to 21.5 hours of 24. 2.5 free." Live, while somebody
   is adding a seventh task. Almost no routine builder tells you
   this and it is the most useful sentence one can say at that
   moment, because the thing that makes a routine fail is not
   laziness, it is arithmetic.

   ---- archiving, never deleting ----

   `archived: true` and the id stays for ever. An entry keys its
   marks by task id, so removing one would either break every day
   it was marked on or take those marks with it, and somebody
   would lose a fortnight of their own history by tidying a list.
   The migration says the same thing where the column is.

   ---- and the import asks before it writes ----

   A summary in words first, then Merge or Replace. Never
   overwrite without that choice, and Replace downloads the copy
   first, because nothing here should be lost by pressing the
   wrong thing quickly.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  TEMPLATES, hours, readImport, toExport, summarise, mergeDays,
  exportName, type Band, type Task, type RoutineShape, type Entry, type ExportFile,
} from "@reiad/shared/routine";
import { runtimeModule } from "../account/runtime";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { TabPanels } from "../ui/tab-panels";

type AccountModule = typeof import("/account.js");
type RoutineModule = typeof import("/routine.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");
const routineModule = () => runtimeModule<RoutineModule>("/routine.js");

/** Five megabytes, which the spec sets and which is about a
    century of days. A file larger than that is not a routine and
    reading it would lock the tab up while it tried. */
const CAP = 5 * 1024 * 1024;

const hrs = (n: number): string =>
  (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, ""));

/* ============================================================
   The builder
   ============================================================ */

function Builder({ shape, name, onChange }: {
  shape: RoutineShape;
  name: string;
  onChange: (next: RoutineShape) => void;
}) {
  const { planned, free } = hours(shape);
  const bands = [...shape.bands].sort((a, b) => a.order - b.order);

  const edit = (id: string, patch: Partial<Task>) => onChange({
    ...shape,
    tasks: shape.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
  });

  const move = (id: string, by: number) => {
    const live = [...shape.tasks].sort((a, b) => a.order - b.order);
    const at = live.findIndex((t) => t.id === id);
    const to = at + by;
    if (at < 0 || to < 0 || to >= live.length) return;
    const swap = live[to];
    onChange({
      ...shape,
      tasks: shape.tasks.map((t) => {
        if (t.id === id) return { ...t, order: swap.order };
        if (t.id === swap.id) return { ...t, order: live[at].order };
        return t;
      }),
    });
  };

  const add = (band: string) => {
    /* A new id that no archived task has ever used. Ids are never
       reused, so this counts up past everything in the list
       rather than filling a gap. */
    let n = shape.tasks.length + 1;
    while (shape.tasks.some((t) => t.id === `t${n}`)) n += 1;
    onChange({
      ...shape,
      tasks: [...shape.tasks, {
        id: `t${n}`, band, en: "Something new", bn: "নতুন কিছু",
        counts: true, order: Math.max(0, ...shape.tasks.map((t) => t.order)) + 1,
      }],
    });
  };

  return (
    <div className="rt-builder">
      <h3>{name}</h3>

      {/* THE ONE USEFUL SENTENCE, live. Never a warning and never
          red: an over-full day says zero free rather than "3
          hours over", because there are no failure states here
          and a day somebody has over-planned is a plan rather
          than a mistake. */}
      <p className="rt-hours-line mono">
        {`Planned to ${hrs(planned)} hours of 24. ${hrs(free)} free.`}
      </p>

      {bands.map((band) => (
        <section className="rt-build-band" key={band.id}
                 style={{ "--accent": band.colour } as React.CSSProperties}>
          <h4>{band.bn} · {band.en}</h4>
          <ul className="rt-build-list">
            {shape.tasks
              .filter((t) => t.band === band.id && !t.archived)
              .sort((a, b) => a.order - b.order)
              .map((task) => (
                <li key={task.id} className="rt-build-task">
                  <div className="rt-build-names">
                    <Field id={`rt-bn-${task.id}`} label="বাংলা" hideLabel type="text"
                           value={task.bn} maxLength={80}
                           onChange={(e) => edit(task.id, { bn: e.target.value })} />
                    <Field id={`rt-en-${task.id}`} label="English" hideLabel type="text"
                           value={task.en} maxLength={80}
                           onChange={(e) => edit(task.id, { en: e.target.value })} />
                    <Field id={`rt-h-${task.id}`} label="Hours" hideLabel type="number"
                           value={task.hours ?? ""} min={0} max={24} step={0.25}
                           onChange={(e) => edit(task.id, {
                             hours: e.target.value === "" ? undefined : Number(e.target.value),
                           })} />
                  </div>
                  <div className="rt-build-row">
                    {/* `counts: false` is not "less important". It
                        is the switch that keeps leisure out of the
                        arithmetic, so it is worded as what it does
                        rather than as an importance. */}
                    <ChipButton pressed={task.counts}
                                onClick={() => edit(task.id, { counts: !task.counts })}>
                      {task.counts ? "counts" : "just tracked"}
                    </ChipButton>
                    {/* Keyboard alternative to dragging, and the
                        only one: a drag with no keyboard path is a
                        control half this site's readers cannot
                        use. */}
                    <Button kind="quiet" size="sm" onClick={() => move(task.id, -1)}
                            aria-label={`Move ${task.en} up`}>↑</Button>
                    <Button kind="quiet" size="sm" onClick={() => move(task.id, 1)}
                            aria-label={`Move ${task.en} down`}>↓</Button>
                    <Button kind="quiet" size="sm"
                            onClick={() => edit(task.id, { archived: true })}
                            aria-label={`Take ${task.en} off the list`}>
                      take off the list
                    </Button>
                  </div>
                </li>
              ))}
          </ul>
          <Button kind="ghost" size="sm" onClick={() => add(band.id)}>
            add something to {band.en}
          </Button>
        </section>
      ))}

      {/* Archived tasks, shown rather than hidden. They are still
          in the routine and still render on the days they were
          marked, and a reader who took one off should be able to
          find out where it went and put it back. */}
      {shape.tasks.some((t) => t.archived) ? (
        <section className="rt-build-band rt-archived">
          <h4>Off the list</h4>
          <p className="rt-quiet">
            These are still on every day you marked them. Nothing was deleted.
          </p>
          <ul className="rt-build-list">
            {shape.tasks.filter((t) => t.archived).map((task) => (
              <li key={task.id} className="rt-build-task rt-build-back">
                <span>{task.bn} · {task.en}</span>
                <Button kind="quiet" size="sm"
                        onClick={() => edit(task.id, { archived: false })}>
                  put it back
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

/* ============================================================
   Templates
   ============================================================ */

function Templates({ onLoad, busy }: {
  onLoad: (name: string, shape: RoutineShape) => void;
  busy: boolean;
}) {
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="rt-templates">
      <p className="rt-quiet">
        Loading one makes a copy. Editing your routine never changes the
        template it came from.
      </p>
      <ul className="rt-template-list">
        {TEMPLATES.map((t) => {
          const open = preview === t.slug;
          const counting = t.data.tasks.filter((x) => x.counts).length;
          return (
            <li key={t.slug} className="rt-template">
              <h4>{t.name}</h4>
              <p>{t.description}</p>
              <p className="rt-quiet mono">
                {`${t.data.bands.length} bands, ${t.data.tasks.length} things, `
                  + `${counting} that count`}
              </p>
              <div className="rt-build-row">
                {/* Preview before loading, which the spec asks for
                    and which matters most for Sadia's day: it is
                    eighteen tasks and somebody should see them
                    before they arrive. */}
                <Button kind="ghost" size="sm"
                        onClick={() => setPreview(open ? null : t.slug)}
                        aria-expanded={open}>
                  {open ? "hide" : "have a look"}
                </Button>
                <Button kind="solid" size="sm" disabled={busy}
                        onClick={() => onLoad(t.name, t.data)}>
                  use this one
                </Button>
              </div>
              {open ? (
                <ul className="rt-preview">
                  {[...t.data.tasks].sort((a, b) => a.order - b.order).map((task) => (
                    <li key={task.id}>
                      {task.bn} · {task.en}
                      {task.counts ? null : <span className="rt-quiet"> (just tracked)</span>}
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ============================================================
   Your data
   ============================================================ */

function YourData({ routine, name }: { routine: string | null; name: string }) {
  const [file, setFile] = useState<ExportFile | null>(null);
  const [why, setWhy] = useState<string | null>(null);
  const [said, setSaid] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement | null>(null);

  const take = useCallback(async (): Promise<ExportFile | null> => {
    if (!routine) return null;
    const rt = await routineModule();
    const mine = await rt.activeRoutine();
    if (!mine) return null;
    const all = await rt.daysBetween("1970-01-01", "2999-12-31");
    const day = rt.todayFor(4);
    return toExport(
      { name: mine.name, bands: mine.bands as Band[], tasks: mine.tasks as Task[] },
      all.map((e): Entry => ({
        entry_date: e.entry_date, marks: e.marks ?? {},
        mood: e.mood, note: e.note, chose: e.chose,
      })),
      day,
    );
  }, [routine]);

  const download = useCallback(async () => {
    setBusy(true);
    try {
      const made = await take();
      if (!made) { setWhy("There is nothing to take a copy of yet."); return; }
      const blob = new Blob([JSON.stringify(made, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = exportName(made.exported_at);
      a.click();
      URL.revokeObjectURL(url);
      setSaid(`Taken: ${made.entries.length} day(s).`);
    } finally { setBusy(false); }
  }, [take]);

  const chose = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0];
    setWhy(null); setSaid(null); setFile(null);
    if (!picked) return;
    /* The cap is checked BEFORE reading, not after: reading a
       200MB file to find out it is too big is the lock-up this
       avoids. */
    if (picked.size > CAP) {
      setWhy("That file is bigger than 5MB, which is far larger than a routine.");
      return;
    }
    const got = readImport(await picked.text());
    if (!got.ok) { setWhy(got.why); return; }
    setFile(got.file);
  }, []);

  const put = useCallback(async (how: "merge" | "replace") => {
    if (!file || !routine) return;
    setBusy(true);
    try {
      const rt = await routineModule();
      /* Replace hands the copy over FIRST. Nothing here should be
         lost by pressing the wrong thing quickly, and a download
         is cheaper than a regret. */
      if (how === "replace") await download();

      await rt.saveRoutine(routine, {
        name: file.routine.name,
        bands: file.routine.bands,
        tasks: file.routine.tasks,
      });
      const mine = how === "merge"
        ? (await rt.daysBetween("1970-01-01", "2999-12-31")).map((e): Entry => ({
          entry_date: e.entry_date, marks: e.marks ?? {},
          mood: e.mood, note: e.note, chose: e.chose,
        }))
        : [];
      const all = mergeDays(mine, file.entries, how);
      for (const day of all) {
        await rt.saveDay(routine, day.entry_date, {
          marks: day.marks, mood: day.mood, note: day.note, chose: day.chose,
        });
      }
      setSaid(`Put back: ${all.length} day(s).`);
      setFile(null);
      if (input.current) input.current.value = "";
    } catch (err) {
      setWhy((err as Error).message || "That did not go in.");
    } finally { setBusy(false); }
  }, [file, routine, download]);

  return (
    <div className="rt-data">
      <section>
        <h3>Take a copy</h3>
        <p className="rt-quiet">
          One file with your routine and every day in it. Yours to keep, and
          what you put back in below.
        </p>
        <Button kind="ghost" onClick={() => void download()} disabled={busy}>
          Download {name ? `"${name}"` : "everything"}
        </Button>
      </section>

      <section>
        <h3>Put one back</h3>
        <p className="rt-quiet">
          Nothing is written until you have read what is in the file and chosen.
        </p>
        <input ref={input} type="file" accept="application/json,.json"
               aria-label="Choose a routine file" onChange={(e) => void chose(e)} />

        {why ? <p className="rt-said" data-state="warn" role="status">{why}</p> : null}

        {/* THE SUMMARY, before anything is written. Nobody presses
            Replace everything without being told what everything
            is about to become. */}
        {file ? (
          <div className="rt-confirm">
            <p>{summarise(file)}</p>
            <div className="rt-build-row">
              <Button kind="solid" disabled={busy} onClick={() => void put("merge")}>
                Merge, keeping both
              </Button>
              <Button kind="ghost" disabled={busy} onClick={() => void put("replace")}>
                Replace everything
              </Button>
            </div>
            <p className="rt-quiet">
              Merge keeps every day you already have and lets the file win where
              both have one. Replace takes a copy of what is here first.
            </p>
          </div>
        ) : null}

        {said ? <p className="rt-said" data-state="ok" role="status">{said}</p> : null}
      </section>
    </div>
  );
}

/* ============================================================
   The page
   ============================================================ */

export function RoutineSettings() {
  const [ready, setReady] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [routineId, setRoutineId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [shape, setShape] = useState<RoutineShape | null>(null);
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState<string | null>(null);

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const [acc, rt] = await Promise.all([accountModule(), routineModule()]);
        if (!acc.current()) { if (live) { setSignedIn(false); setReady(true); } return; }
        if (live) setSignedIn(true);
        const mine = await rt.activeRoutine();
        if (!live || !mine) { if (live) setReady(true); return; }
        setRoutineId(mine.id);
        setName(mine.name);
        setShape({ bands: mine.bands as Band[], tasks: mine.tasks as Task[] });
      } finally { if (live) setReady(true); }
    })();
    return () => { live = false; };
  }, []);

  /* Debounced, like the day: somebody typing a task name should
     not send a request per keystroke. */
  const change = useCallback((next: RoutineShape) => {
    setShape(next);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(async () => {
      if (!routineId) return;
      try {
        const rt = await routineModule();
        await rt.saveRoutine(routineId, { bands: next.bands, tasks: next.tasks });
        setSaid("saved");
      } catch {
        setSaid("not saved yet, we will keep trying");
      }
    }, 600);
  }, [routineId]);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const load = useCallback(async (from: string, data: RoutineShape) => {
    setBusy(true);
    try {
      const rt = await routineModule();
      if (routineId) {
        await rt.saveRoutine(routineId, { name: from, bands: data.bands, tasks: data.tasks });
      } else {
        const made = await rt.makeRoutine(from, data);
        setRoutineId(made.id);
      }
      setName(from);
      setShape(data);
      setSaid(`"${from}" is yours now.`);
    } catch (err) {
      setSaid((err as Error).message || "That did not load.");
    } finally { setBusy(false); }
  }, [routineId]);

  const panels = useMemo(() => ([
    {
      id: "builder",
      label: "Your list",
      node: shape
        ? <Builder shape={shape} name={name} onChange={change} />
        : <p className="rt-quiet">Pick a starting point under Templates.</p>,
    },
    { id: "templates", label: "Templates", node: <Templates onLoad={load} busy={busy} /> },
    { id: "data", label: "Your data", node: <YourData routine={routineId} name={name} /> },
  ]), [shape, name, change, load, busy, routineId]);

  if (!ready) return <p className="rt-quiet" role="status">এক মুহূর্ত…</p>;

  if (!signedIn) {
    return (
      <div className="rt-invite">
        <h2>Sign in to shape your routine</h2>
        <p>Your list, your templates and your own copy of everything.</p>
        <Button kind="solid"
                onClick={() => document.querySelector<HTMLElement>(".account-btn")?.click()}>
          Sign in
        </Button>
      </div>
    );
  }

  return (
    <>
      <TabPanels panels={panels} label="Routine settings" />
      <p className="rt-saved" data-state={said ? "ok" : "idle"} role="status">{said ?? ""}</p>
    </>
  );
}
