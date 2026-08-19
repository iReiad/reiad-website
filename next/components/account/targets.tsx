"use client";

/* ============================================================
   account/targets.tsx: a goal with a number on it.

   `public.targets`, behind the same row-level security progress
   has. Three kinds, and they are three sources of progress that
   already existed rather than three shapes of form:

     course   reads the reader's own ticks
     habit    reads `days-active`
     metric   reads a number this site cannot see, so they type it

   A FOURTH KIND HAS TO PASS THAT TEST. If the site cannot measure
   it out of something it already holds, the bar would be a
   decoration, and a bar that is a decoration is worse than no bar
   because it looks like a fact.

   ---- the list and the form are one component ----

   They were a painter and a submit handler in `account-page.ts`,
   which meant the form knew the id of the list and the list knew
   nothing about the form. Adding a target repaints the list; that
   is one piece of state, so it is one component.

   ---- and nothing is measured on the server ----

   Every row belongs to one reader and is fetched with their own
   token, and a course target's progress is their own localStorage.
   So this renders nothing until the account has answered: "you
   have set nothing" and "this has not loaded" must not look the
   same.
   ============================================================ */

import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { Target, TargetKind } from "/saved.js";
import type { LadderLesson } from "../../lib/school-ladders";
import { LADDER_SCHOOLS } from "../../lib/nav";
import { subscribe } from "../../lib/progress";
import { Button } from "../ui/button";
import { Field, Select } from "../ui/field";
import { runtimeModule } from "./runtime";
import { NO_CHECKS, standing } from "./standing";

type SavedModule = typeof import("/saved.js");
type StreakModule = typeof import("/streak.js");

const savedModule = () => runtimeModule<SavedModule>("/saved.js");
const streakModule = () => runtimeModule<StreakModule>("/streak.js");

const KINDS: Array<{ id: TargetKind; label: string; note: string }> = [
  { id: "course", label: "Finish a course", note: "measured by your own ticks" },
  { id: "habit", label: "Turn up n days a week", note: "measured by the days you were here" },
  { id: "metric", label: "Reach a number", note: "a figure you keep and update yourself" },
];

interface Measured {
  at: number;
  of: number;
  unit: string;
}

/* ============================================================
   One target, drawn
   ============================================================ */

function Row({ target, measured, onChanged, onError }: {
  target: Target;
  measured: Measured;
  onChanged: () => Promise<void>;
  onError: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [now, setNow] = useState(String(target.reached ?? 0));

  const { at, of, unit } = measured;
  const pct = of ? (at / of) * 100 : 0;
  const finished = Boolean(target.done_at) || pct >= 100;
  const numbers = `${at} of ${of}${unit ? ` ${unit}` : ""}`;

  const act = async (run: () => Promise<unknown>) => {
    setBusy(true);
    try {
      await run();
      await onChanged();
    } catch (err) {
      onError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="target" data-done={finished ? "" : undefined}>
      <div className="target-head">
        <h3>{target.label}</h3>
        <span className="target-pct mono">{Math.round(Math.min(pct, 100))}%</span>
      </div>
      <span className="meter" role="progressbar" aria-label={`${target.label}: ${numbers}`}
            aria-valuenow={Math.round(Math.min(pct, 100))}
            aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${Math.max(0, Math.min(100, Math.round(pct)))}%` }} />
      </span>
      <p className="target-line">{finished ? `${numbers}. Done.` : numbers}</p>

      <div className="target-actions">
        {/* A number this site cannot see is a number the reader
            keeps, so the one control it gets is the one that
            updates it. */}
        {target.kind === "metric" ? (
          <>
            {/* The width is on the wrapper rather than the box:
                `<Field>` sets `w-full`, and two width utilities on
                one element is a fight decided by the order Tailwind
                emits them in rather than by the order they are
                written. */}
            <div className="w-[110px]">
              <Field id={`reached-${target.id}`} hideLabel
                     label={`Where ${target.label} is now`}
                     type="number" step="any" min="0" value={now}
                     onChange={(e) => setNow(e.target.value)} />
            </div>
            <Button kind="ghost" size="sm" disabled={busy}
                    onClick={() => act(async () => {
                      const m = await savedModule();
                      await m.updateTarget(target.id, { reached: Number(now) || 0 });
                    })}>
              Update
            </Button>
          </>
        ) : null}

        <Button kind="ghost" size="sm" disabled={busy}
                onClick={() => act(async () => {
                  const m = await savedModule();
                  await m.updateTarget(target.id, {
                    done_at: target.done_at ? null : new Date().toISOString(),
                  });
                })}>
          {target.done_at ? "Reopen" : "Mark done"}
        </Button>

        <Button kind="ghost" size="sm" disabled={busy}
                onClick={() => {
                  if (!confirm(`Remove "${target.label}"?`)) return;
                  act(async () => {
                    const m = await savedModule();
                    await m.removeTarget(target.id);
                  });
                }}>
          Remove
        </Button>
      </div>
    </div>
  );
}

/* ============================================================
   The form under the list

   One form that changes with the kind, rather than three forms:
   three would be three save handlers and three places for a label
   to drift.
   ============================================================ */

function AddTarget({ onAdded }: { onAdded: () => Promise<void> }) {
  const [kind, setKind] = useState<TargetKind>("course");
  const [note, setNote] = useState<{ text: string; state: "ok" | "warn" } | null>(null);
  const [busy, setBusy] = useState(false);

  const [subject, setSubject] = useState(LADDER_SCHOOLS[0]?.key ?? "money");
  const [days, setDays] = useState("4");
  const [label, setLabel] = useState("");
  const [reached, setReached] = useState("0");
  const [goal, setGoal] = useState("0");
  const [unit, setUnit] = useState("");

  /** What the form is asking for. Throws a sentence rather than
      returning null, so the one place that shows a complaint is
      the one place that catches it. */
  const read = (): Parameters<SavedModule["saveTarget"]>[0] => {
    if (kind === "course") {
      const school = LADDER_SCHOOLS.find((s) => s.key === subject);
      if (!school) throw new Error("Pick a course.");
      return { kind, subject, label: `Finish ${school.en}`, target: 0, unit: "chapters" };
    }
    if (kind === "habit") {
      const n = Number(days);
      if (!(n >= 1 && n <= 7)) throw new Error("Somewhere between one and seven days.");
      return { kind, subject: "week", label: `Read on ${n} days a week`, target: n, unit: "days" };
    }
    const what = label.trim();
    const number = Number(goal);
    if (!what) throw new Error("Say what you are tracking.");
    if (!(number > 0)) throw new Error("A target needs a number greater than nothing.");
    return {
      kind, subject: what.slice(0, 60), label: what, target: number,
      reached: Number(reached) || 0, unit: unit.trim(),
    };
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const m = await savedModule();
      await m.saveTarget(read());
      setNote({ text: "Added.", state: "ok" });
      setLabel("");
      setUnit("");
      setGoal("0");
      setReached("0");
      await onAdded();
    } catch (err) {
      setNote({ text: (err as Error).message || "That did not save.", state: "warn" });
    } finally {
      setBusy(false);
    }
  };

  return (
    /* A `<details>` rather than a second panel with its own open
       state in a script: nobody needs this open until they want
       it, and the disclosure is the one the rest of the site
       already uses. */
    <details id="target-more"
             className="rounded-card border border-hairline bg-panel
                        [&>summary]:list-none
                        [&>summary::-webkit-details-marker]:hidden">
      <summary className="flex min-h-[46px] cursor-pointer items-center gap-2
                          px-4 py-[13px] text-[0.92rem] text-green
                          before:font-mono before:text-base before:content-['+']">
        Add a target
      </summary>

      {/* The three ids below are the ones `next/account.test.mjs`
          drives and are the only ids in this file. They are hooks
          for the test rather than styling, which is the same
          reason the sections of this page carry one. */}
      <form id="target-form" onSubmit={submit}
            className="grid max-w-[620px] gap-4 px-4 pb-[18px]">
        <div className="choice-row" role="radiogroup" aria-label="What kind of target">
          {KINDS.map((k) => (
            <label key={k.id} className="choice choice-pace" htmlFor={`kind-${k.id}`}>
              <input type="radio" name="target-kind" id={`kind-${k.id}`} value={k.id}
                     checked={kind === k.id}
                     onChange={() => { setKind(k.id); setNote(null); }} />
              <span className="choice-body">
                <strong>{k.label}</strong>
                <small>{k.note}</small>
              </span>
            </label>
          ))}
        </div>

        {/* The fields differ per kind, on a grid that does not care
            how many there are. `target-number` is the one id the
            test drives, and it is on whichever number box the
            chosen kind shows, because only one kind renders. */}
        <div className="target-fields">
          {kind === "course" ? (
            <Select id="target-subject" label="Which course" value={subject}
                    onChange={(e) => setSubject(e.target.value)}>
              {LADDER_SCHOOLS.map((s) => (
                <option key={s.key} value={s.key}>{s.bn} · {s.en}</option>
              ))}
            </Select>
          ) : null}

          {kind === "habit" ? (
            <Field id="target-number" label="Days a week" type="number"
                   min="1" max="7" value={days}
                   onChange={(e) => setDays(e.target.value)} />
          ) : null}

          {kind === "metric" ? (
            <>
              <Field id="target-label" label="What you are tracking" type="text"
                     maxLength={80} value={label}
                     placeholder="Portfolio dividend yield"
                     onChange={(e) => setLabel(e.target.value)} />
              <Field id="target-now" label="Where it is now" type="number"
                     step="any" min="0" value={reached}
                     onChange={(e) => setReached(e.target.value)} />
              <Field id="target-number" label="Where you want it" type="number"
                     step="any" min="0" value={goal}
                     onChange={(e) => setGoal(e.target.value)} />
              <Field id="target-unit" label="Unit" type="text"
                     maxLength={20} placeholder="%" value={unit}
                     onChange={(e) => setUnit(e.target.value)} />
            </>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button kind="solid" type="submit" disabled={busy}>Add it</Button>
          {note ? (
            <span className="signin-note" data-state={note.state}>{note.text}</span>
          ) : null}
        </div>
      </form>
    </details>
  );
}

/* ============================================================
   The section
   ============================================================ */

export function Targets({ ladders }: {
  ladders: Record<string, LadderLesson[]>;
}) {
  const [rows, setRows] = useState<Target[] | null>(null);
  const [week, setWeek] = useState(0);
  const [note, setNote] = useState("");
  /* Bumped when a tick moves anywhere, because a course target is
     measured out of the reader's own ticks and a bar that only
     updates on reload is a bar that is wrong most of the time. */
  const [, bump] = useState(0);

  const reload = useCallback(async () => {
    const m = await savedModule();
    setRows(await m.listTargets());
  }, []);

  /* What a habit target measures. Read once for the section
     rather than per row: `daysIn(7)` is the same answer for every
     habit target on the page. */
  const recount = useCallback(async () => {
    const m = await streakModule();
    setWeek(m.daysIn(7));
  }, []);

  useEffect(() => {
    reload().catch(() => setRows([]));
    recount().catch(() => { /* no streak module, habits read 0 */ });

    /* `account-page.ts` still owns "erase everything", and it
       empties this table without knowing anything draws it. It
       says so on this channel; the listener goes when that file
       does. */
    const again = () => {
      reload().catch(() => setRows([]));
      recount().catch(() => {});
    };
    document.addEventListener("account:refresh", again);
    return () => document.removeEventListener("account:refresh", again);
  }, [reload, recount]);

  /* Recount as well as redraw. `days-active` is a synced key like
     the ticks are, so a habit target read once on mount is
     measured against whatever this device held BEFORE the
     account's rows landed: "0 of 4 days this week" for a reader
     who was here on five of them. */
  useEffect(() => subscribe(() => {
    recount().catch(() => {});
    bump((n) => n + 1);
  }), [recount]);

  const measure = (target: Target): Measured => {
    if (target.kind === "course") {
      /* `NO_CHECKS` rather than the real figure, and that is not a
         shortcut: a target counts CHAPTERS, and the checkpoints
         inside them are a separate sentence that belongs to the
         bars in `paths.tsx`. Loading the module here would be one
         import for a number nothing below reads. */
      const at = standing(target.subject, ladders[target.subject] ?? [], NO_CHECKS);
      return { at: at.done, of: Number(target.target) || at.total || 1, unit: "chapters" };
    }
    if (target.kind === "habit") {
      return { at: week, of: Number(target.target) || 7, unit: "days this week" };
    }
    return {
      at: Number(target.reached) || 0,
      of: Number(target.target) || 1,
      unit: target.unit || "",
    };
  };

  return (
    <>
      <div className="targets">
        {rows === null ? null : rows.length === 0 ? (
          <p className="acct-empty">
            Nothing set. A target is a sentence with a number in it: finish the
            money ladder, read on four days a week, get a portfolio yield to six
            per cent.
          </p>
        ) : (
          rows.map((target) => (
            <Row key={target.id} target={target} measured={measure(target)}
                 onChanged={reload} onError={setNote} />
          ))
        )}
      </div>
      {note ? <p className="signin-note" data-state="warn">{note}</p> : null}
      <AddTarget onAdded={reload} />
    </>
  );
}
