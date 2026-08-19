"use client";

/* ============================================================
   account/paths.tsx: where the reader is in each school.

   One row per school: how far through, the checkpoints ticked
   inside those lessons, and the one link that matters, which is
   the next thing to read.

   ---- the ladder comes down as a prop ----

   `next/lib/school-ladders.ts`, generated from the same rows the
   school pages render from, handed in by the route. Nothing here
   loads a `curriculum.js`, which is the rule
   `next/lib/progress.ts` states and the thing the version this
   replaces got wrong: it imported all four in the browser, 150 KB
   of them, to find out what a bar's denominator was.

   ---- and it renders nothing on the server ----

   Every number is one reader's, out of their own localStorage,
   mirrored from their account. The server has neither, so it
   draws nothing rather than four empty bars: "you have finished
   nothing" and "this has not loaded" must not look the same.
   ============================================================ */

import { useEffect, useState } from "react";
import type { LadderLesson } from "../../lib/school-ladders";
import { LADDER_SCHOOLS, schoolName } from "../../lib/nav";
import { subscribe } from "../../lib/progress";
import { useProfile } from "./profile";
import { checkpointsModule, standing, NO_CHECKS, type Standing } from "./standing";
import type { CheckpointStats } from "/checkpoints.js";

const plural = (n: number, one: string, many: string): string =>
  `${n} ${n === 1 ? one : many}`;

function Row({ school, accent, at }: {
  school: string;
  accent: string;
  at: Standing;
}) {
  const name = schoolName(school);
  const pct = Math.round(at.pct);

  const line = at.checks.done
    ? `${at.done} of ${at.total} chapters · `
      + `${plural(at.checks.done, "checkpoint", "checkpoints")} ticked in `
      + `${plural(at.checks.lessons, "lesson", "lessons")}`
    : `${at.done} of ${at.total} chapters`;

  return (
    /* Each row wears its own school's colour, which the rail
       taught the reader: the German book is blue and the Qur'anic
       scroll is teal. `--accent` is the one property that does
       it, so the bar, the resume card and its arrow all follow
       from this line. */
    <div className="ladder-row" data-started={at.touched ? "" : undefined}
         style={{ ["--accent" as string]: accent }}>
      <div className="ladder-head">
        <h3 className="bn-h">{name}</h3>
        <span className="ladder-pct mono">{pct}%</span>
      </div>
      <span className="meter" role="progressbar"
            aria-label={`${name}: ${at.done} of ${at.total} chapters finished`}
            aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <i style={{ width: `${pct}%` }} />
      </span>
      <p className="ladder-line">{line}</p>
      {at.next ? (
        <a className="ladder-go" href={at.next.url}>
          <span className="mono">{at.touched ? "Carry on" : "Start"}</span>
          <strong className="bn-h">{at.next.title}</strong>
        </a>
      ) : (
        <p className="ladder-line">
          {at.total ? "Every written chapter is finished."
                    : "Nothing written here yet."}
        </p>
      )}
    </div>
  );
}

export function Paths({ ladders }: {
  ladders: Record<string, LadderLesson[]>;
}) {
  /* The schools this reader said they were learning sort first.
     Read off the cached profile rather than fetched: it arrives
     with `profile:changed`, so the order settles the moment the
     account answers and again the moment they change it. */
  const profile = useProfile();
  const [checks, setChecks] = useState<Record<string, CheckpointStats> | null>(null);
  /* Bumped by anything that moves a tick, so a reader who ticks a
     lesson in another tab, or whose account's rows have only just
     landed on this device, sees the bar that moved. `subscribe`
     covers the same-tab event, the cross-tab `storage` one and
     `sync:done`. */
  const [, bump] = useState(0);

  useEffect(() => {
    let live = true;

    /* Re-read on every signal, not only on mount. The checkpoint
       counts are localStorage like the ticks are, so a set of
       numbers captured once is a sentence that is right only if
       the mirror happened to have landed first. It usually has,
       which is what makes this the kind of bug that ships. */
    const count = () => {
      checkpointsModule().then((m) => {
        if (!live) return;
        setChecks(Object.fromEntries(
          LADDER_SCHOOLS.map((s) => [s.key, m.checkpointStats(s.key)])));
      }).catch(() => {
        /* A checkpoint count that will not load is one clause of
           one sentence. The bars are the section and they do not
           wait for it. */
        if (live) setChecks({});
      });
    };

    count();
    const off = subscribe(() => { count(); bump((n) => n + 1); });
    return () => { live = false; off(); };
  }, []);

  if (checks === null) return null;

  /* Followed first, then anything with progress in it, then the
     rest. A reader who has said they are learning German should
     not scroll past three schools they have never opened to find
     out how German is going. */
  const chosen = new Set(profile?.following ?? []);
  const at = new Map(LADDER_SCHOOLS.map((s) => [
    s.key,
    standing(s.key, ladders[s.key] ?? [], checks[s.key] ?? NO_CHECKS),
  ]));
  const rank = (key: string): number =>
    chosen.has(key) ? 0 : at.get(key)?.touched ? 1 : 2;

  const rows = LADDER_SCHOOLS
    .filter((s) => (ladders[s.key] ?? []).length)
    .sort((a, b) => rank(a.key) - rank(b.key));

  if (!rows.length) {
    return <p className="acct-empty">No course ladders could be read just now.</p>;
  }

  return (
    <>
      {rows.map((s) => (
        <Row key={s.key} school={s.key} accent={s.accent} at={at.get(s.key)!} />
      ))}
    </>
  );
}
