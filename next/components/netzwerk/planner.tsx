"use client";

/* ============================================================
   netzwerk/planner.tsx: the study planner, whole.

   The learners on this device come out of `lib/netzwerk-store.ts`
   through `useSyncExternalStore`, with a server snapshot of
   nothing: what a browser holds is not a fact the server has, so
   the server renders the frame and the tool draws itself after
   hydration. Until then it says so rather than flashing the
   "add a learner" form at somebody who has three.

   Eleven panels on `ui/tab-panels.tsx`, one on screen at a time,
   chosen from the fragment, so `#week` opens tonight's page.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import { ROUTES_TABLE, mondayOnOrAfter, today, type Learner, type Route } from "@reiad/shared/netzwerk";
import {
  activeId, addLearner, parsePlans, rawPlans, removeLearner, saveLearner, setActive, subscribe,
} from "../../lib/netzwerk-store";
import { TabPanels, type Panel } from "../ui/tab-panels";
import { Field } from "../ui/field";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { StartPanel } from "./start";
import { PlanPanel, WeekPanel } from "./week";
import { ChaptersPanel, GrammarPanel } from "./chapters";
import { LogPanel, PracticePanel } from "./log";
import { ExamsPanel, LibraryPanel, MethodPanel, TipsPanel } from "./refs";

function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

export function Planner() {
  const mounted = useMounted();
  const raw = useSyncExternalStore(subscribe, rawPlans, () => "");
  const learners = useMemo(() => parsePlans(raw), [raw]);
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => { setChosen(activeId()); }, []);

  const learner = learners.find((l) => l.id === chosen) ?? learners[0] ?? null;

  const pick = useCallback((id: string) => { setChosen(id); setActive(id); }, []);

  const update = useCallback((fn: (l: Learner) => Learner) => {
    const now = parsePlans(rawPlans()).find((l) => l.id === learner?.id);
    if (!now) return;
    saveLearner(fn(now));
  }, [learner?.id]);

  if (!mounted) {
    return <p className="text-t4 text-ink-soft">Opening your plan…</p>;
  }

  if (!learner) return <NewLearner onMade={pick} first />;

  const panels: Panel[] = [
    { id: "start", label: "Start", node: <StartPanel learner={learner} update={update}
        onRemove={() => { if (confirm(`Remove ${learner.name} and everything they ticked?`)) removeLearner(learner.id); }} /> },
    { id: "week", label: "This week", node: <WeekPanel learner={learner} update={update} /> },
    { id: "plan", label: "Plan", node: <PlanPanel learner={learner} update={update} /> },
    { id: "chapters", label: "Chapters", node: <ChaptersPanel learner={learner} update={update} /> },
    { id: "grammar", label: "Grammar", node: <GrammarPanel /> },
    { id: "method", label: "Method", node: <MethodPanel learner={learner} /> },
    { id: "log", label: "Daily log", node: <LogPanel learner={learner} update={update} /> },
    { id: "practice", label: "Weekly score", node: <PracticePanel learner={learner} update={update} /> },
    { id: "library", label: "Resources", node: <LibraryPanel /> },
    { id: "exams", label: "Exams", node: <ExamsPanel /> },
    { id: "tips", label: "Tips", node: <TipsPanel /> },
  ];

  return (
    /* `contain: inline-size`, for the reason `.dt-tabs` gives in the
       stylesheet: a scrolling table's min-content width otherwise
       reaches `main.wrap`, which is `fit-content`, and the whole
       page grows past the viewport on a phone. */
    <div className="grid min-w-0 gap-4 contain-inline-size">
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Learners on this device">
        {learners.map((l) => (
          <ChipButton key={l.id} pressed={l.id === learner.id} onClick={() => pick(l.id)}>
            {l.name} · Route {l.route}
          </ChipButton>
        ))}
        <NewLearner onMade={pick} />
      </div>
      <TabPanels key={learner.id} label="The study planner" panels={panels} />
    </div>
  );
}

/** Add a learner: a name, a route and a start date. Nothing else
    is asked; everything else has a default on the Start sheet. */
function NewLearner({ onMade, first }: { onMade: (id: string) => void; first?: boolean }) {
  const [open, setOpen] = useState(Boolean(first));
  const [route, setRoute] = useState<Route>("A");

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim() || "Me";
    const start = String(f.get("start") || "") || mondayOnOrAfter(today());
    const made = addLearner(name, route, start);
    onMade(made.id);
    setOpen(false);
  };

  if (!open) {
    return <Button kind="soft" size="sm" onClick={() => setOpen(true)}>+ Add a learner</Button>;
  }

  return (
    <form onSubmit={submit}
          className="grid w-full gap-4 rounded-card border border-hairline bg-panel p-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      {first ? (
        <p className="text-t5 md:col-span-2">
          <b>Who is studying?</b> A learner is a name, a route and a start date. Two people can share this device; each gets their own plan.
        </p>
      ) : null}
      <Field id="nw-new-name" name="name" label="Name" placeholder="Your name" autoFocus={!first} />
      <Field id="nw-new-start" name="start" label="Start date" type="date"
             hint="Any day; it moves to the Monday after." />
      <fieldset className="grid gap-2 md:col-span-2">
        <legend className="font-code text-t1 uppercase tracking-wide text-ink-soft">Route</legend>
        <div className="grid gap-2 md:grid-cols-2">
          {ROUTES_TABLE.map((r) => (
            <label key={r.route}
                   className={["grid cursor-pointer gap-1 rounded-tight border p-3",
                     route === r.route ? "border-accent bg-accent-soft" : "border-hairline"].join(" ")}>
              <span className="flex items-center gap-2">
                <input type="radio" name="nw-new-route" value={r.route} checked={route === r.route}
                       onChange={() => setRoute(r.route)} className="accent-accent" />
                <b>{r.name}</b>
                <span className="font-code text-t1 text-ink-soft">{r.weeks} weeks</span>
              </span>
              <span className="pl-6 text-t3 text-ink-soft">{r.path}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="flex gap-2 md:col-span-2">
        <Button kind="solid" type="submit">Start the plan</Button>
        {!first ? <Button kind="quiet" onClick={() => setOpen(false)}>Cancel</Button> : null}
      </div>
    </form>
  );
}
