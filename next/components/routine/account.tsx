"use client";

/* ============================================================
   routine/account.tsx: the routine, from the account page.

   The routine is SET UP here and READ on its own page under
   Tools. That split is deliberate and it is the same one the
   rest of the account already makes: `/account` is where you
   decide what the site should do, and the tool is where you use
   it.

   So this panel is a summary and a door. It states what the
   account holds, offers the three things somebody comes to an
   account page for (change the shape of it, take a copy, start
   again), and links out. It deliberately does NOT repeat the
   dashboard: a second copy of a chart is a second thing to keep
   in step.

   Signed out it says nothing at all, because the panel it sits
   in is already behind an account.
   ============================================================ */

import { useEffect, useState } from "react";
import { done, type Band, type Task, type RoutineShape, type Entry }
  from "@reiad/shared/routine";
import { runtimeModule } from "../account/runtime";
import { ButtonLink } from "../ui/button";

type RoutineModule = typeof import("/routine.js");
const routineModule = () => runtimeModule<RoutineModule>("/routine.js");

const BN = Array.from({ length: 10 }, (_, i) => String.fromCharCode(0x09e6 + i)).join("");
const bn = (n: number): string => String(n).replace(/\d/g, (d) => BN[Number(d)]);

export function RoutineAccount() {
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState(0);
  const [marked, setMarked] = useState(0);

  useEffect(() => {
    let live = true;
    (async () => {
      try {
        const rt = await routineModule();
        const mine = await rt.activeRoutine();
        if (!live || !mine) return;
        const shape: RoutineShape = {
          bands: mine.bands as Band[], tasks: mine.tasks as Task[],
        };
        const all = await rt.daysBetween("1970-01-01", "2999-12-31");
        if (!live) return;
        setName(mine.name);
        setTasks(shape.tasks.filter((t) => !t.archived).length);
        setMarked(all.filter((e) => done(shape, {
          entry_date: e.entry_date, marks: e.marks ?? {},
          mood: e.mood, note: e.note, chose: e.chose,
        } as Entry) !== null).length);
      } finally { if (live) setReady(true); }
    })();
    return () => { live = false; };
  }, []);

  if (!ready) return <p className="rt-quiet" role="status">এক মুহূর্ত…</p>;

  if (!name) {
    return (
      <div className="rt-panel">
        <p>You have not built one yet. Start from a template or from nothing.</p>
        <ButtonLink kind="solid" size="sm" href="/tools/routine/settings">Build a routine</ButtonLink>
      </div>
    );
  }

  return (
    <div className="rt-panel">
      <p>
        <strong>{name}</strong> · {bn(tasks)} things a day, {bn(marked)} days written.
      </p>
      <div className="rt-action-row">
        <ButtonLink kind="solid" size="sm" href="/tools/routine">Open the dashboard</ButtonLink>
        <ButtonLink kind="ghost" size="sm" href="/tools/routine/settings">Change what is in it</ButtonLink>
        <ButtonLink kind="ghost" size="sm" href="/tools/routine/print">Print a week</ButtonLink>
      </div>
      <p className="rt-quiet">
        Your routine is on your account, so it is the same on every device you
        sign in on. Taking a copy of everything, including this, is on the
        Overview panel.
      </p>
    </div>
  );
}
