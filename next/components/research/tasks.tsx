"use client";

/* ============================================================
   research/tasks.tsx: the five lanes, with no red in them.

   `RESEARCH.md` section 17. Later, this week, today, waiting on,
   done. A due date is a fact beside a task and never a colour; a
   task in `waiting` says how long it has waited, so the oldest
   wait is visible.

   A card moves by drag (HTML5, no library: the site has none and
   the verb is one attribute) OR by the "Move to" menu on every
   card, which is the keyboard's way and the screen reader's. Both
   end in the same `saveTask`, so the activity log follows on its
   own. The sixth column is the reading queue: sources not yet
   read, as links into the reader, and nothing is dragged into or
   out of it.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import { LANE_NAMES, TASK_LANES, toneVar, type TaskLane } from "@reiad/shared/research";
import { addTask, listProjects, listSources, listTasks, removeTask, saveTask, type Project, type Source, type Task } from "../../lib/research-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Surface } from "../ui/surface";
import { Icon } from "../icons";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, when } from "./use-who";

const LANE_TONE: Record<TaskLane, "gold" | "blue" | "green" | "plum" | "teal"> = {
  later: "plum", week: "blue", today: "gold", waiting: "teal", done: "green",
};

/** The one MIME type a dragged card carries, so a drop on a lane
    can tell a task from a stray file or a selection of text. */
const DRAG_TYPE = "application/x-research-task";

/** A source is queued while it has not been read: the first of
    `SOURCE_STATUSES`, the migration's own word for it. */
const QUEUED_STATUS = "unread";

export function Tasks() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [rows, setRows] = useState<Task[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [queue, setQueue] = useState<Source[]>([]);
  const [title, setTitle] = useState("");
  const [lane, setLane] = useState<TaskLane>("week");
  const [due, setDue] = useState("");
  const [project, setProject] = useState("");
  const [over, setOver] = useState<TaskLane | null>(null);

  const reload = useCallback(async () => {
    if (!w) return;
    const [t, p, q] = await Promise.all([listTasks(w), listProjects(w), listSources(w, { status: QUEUED_STATUS, limit: 200 })]);
    setRows(t);
    setProjects(p);
    setQueue(q);
  }, [w]);
  useEffect(() => { void reload(); }, [reload]);

  const add = useCallback(async () => {
    if (!w || !title.trim()) return;
    const t = await addTask(w, title.trim(), lane, project || null, [], due || null);
    if (t) { cue("saved"); setTitle(""); setDue(""); setRows((was) => [t, ...(was ?? [])]); }
  }, [w, title, lane, project, due]);

  const move = useCallback(async (t: Task, to: TaskLane) => {
    if (!w || t.lane === to) return;
    const r = await saveTask(w, t, { lane: to });
    if (r.ok) {
      if (to === "done") cue("tick");
      setRows((was) => (was ?? []).map((x) => (x.id === t.id ? r.row : x)));
    }
  }, [w]);

  const drop = useCallback(async (t: Task) => {
    if (!w || !window.confirm(`${both("rs.delete")}: ${t.title}?`)) return;
    if (await removeTask(w, t)) setRows((was) => (was ?? []).filter((x) => x.id !== t.id));
  }, [w]);

  const byLane = useMemo(() => {
    const out = Object.fromEntries(TASK_LANES.map((l) => [l, [] as Task[]])) as Record<TaskLane, Task[]>;
    for (const t of rows ?? []) out[t.lane].push(t);
    /* Done folds after a week into the daily log, section 17. */
    out.done = out.done.filter((t) => !t.done_at || Date.now() - new Date(t.done_at).getTime() < 7 * 86400000);
    return out;
  }, [rows]);

  /* A lane accepts a drop only of a task, and says so while one
     is over it. `preventDefault` on dragover is what makes an
     element a drop target at all. */
  const onDragOver = (l: TaskLane) => (e: DragEvent<HTMLDivElement>): void => {
    if (!e.dataTransfer.types.includes(DRAG_TYPE)) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (over !== l) setOver(l);
  };
  const onDrop = (l: TaskLane) => (e: DragEvent<HTMLDivElement>): void => {
    const id = e.dataTransfer.getData(DRAG_TYPE);
    e.preventDefault();
    setOver(null);
    const t = (rows ?? []).find((x) => x.id === id);
    if (t) void move(t, l);
  };
  const onDragStart = (t: Task) => (e: DragEvent<HTMLLIElement>): void => {
    e.dataTransfer.setData(DRAG_TYPE, t.id);
    e.dataTransfer.setData("text/plain", t.title);
    e.dataTransfer.effectAllowed = "move";
  };

  if (!w) return <SignedOut answered={answered} />;

  return (
    <div className="grid gap-4">
      <Surface material="pane" className="px-5 py-4">
        <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_10rem_12rem_auto] items-end"
              onSubmit={(e) => { e.preventDefault(); void add(); }}>
          <Field id="rs-t-title" label={<W k="rs.tasks.new" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
          <Select id="rs-t-lane" label={<T en="Lane" bn="লেন" />} value={lane} onChange={(e) => setLane(e.target.value as TaskLane)}>
            {TASK_LANES.map((l) => <option key={l} value={l}>{LANE_NAMES[l][lang]}</option>)}
          </Select>
          <Field id="rs-t-due" label={<W k="rs.tasks.due" />} type="date" value={due} onChange={(e) => setDue(e.target.value)} />
          <Select id="rs-t-project" label={<W k="rs.project" />} value={project} onChange={(e) => setProject(e.target.value)}>
            <option value="">{both("rs.noproject")}</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </Select>
          <Button type="submit" kind="solid" disabled={!title.trim()}><W k="rs.new" /></Button>
        </form>
      </Surface>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {TASK_LANES.map((l) => (
          <Surface key={l} material="pane" accent={toneVar(LANE_TONE[l])}
                   className="px-4 py-3 grid gap-2 content-start data-[over=true]:bg-paper-sunk"
                   data-lane={l} data-over={over === l ? "true" : undefined}
                   onDragOver={onDragOver(l)} onDragEnter={onDragOver(l)}
                   onDragLeave={() => { if (over === l) setOver(null); }} onDrop={onDrop(l)}>
            <h2 className="text-t2 font-medium tracking-wide uppercase text-ink-soft flex items-center gap-2">
              <span className="dt-tab-dot" aria-hidden="true" /> {LANE_NAMES[l][lang]}
              <span className="mono text-t1">{byLane[l].length}</span>
            </h2>
            {rows === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
              : !byLane[l].length ? <p className="text-t2 text-ink-soft"><W k="rs.tasks.empty" /></p>
                : (
                  <ul className="grid gap-2">
                    {byLane[l].map((t) => (
                      <li key={t.id} className="grid gap-1 rs-task cursor-grab active:cursor-grabbing" draggable
                          data-task={t.id} title={both("rs.plan.drag")} onDragStart={onDragStart(t)} onDragEnd={() => setOver(null)}>
                        <span className="flex items-start gap-2">
                          {l !== "done" ? (
                            <ChipButton onClick={() => { void move(t, "done"); }} aria-label={`${LANE_NAMES.done[lang]}: ${t.title}`}>
                              <Icon name="check" size={14} />
                            </ChipButton>
                          ) : null}
                          <span className="grow">{t.title}</span>
                        </span>
                        <span className="flex flex-wrap items-center gap-2 text-t1 text-ink-soft mono">
                          {t.due ? <span>{both("rs.tasks.due")} {t.due}</span> : null}
                          {t.lane === "waiting" && t.waiting_since ? <span><W k="rs.tasks.waiting.since" /> {when(t.waiting_since)}</span> : null}
                          {t.project_id ? <span>{projects.find((p) => p.id === t.project_id)?.name ?? ""}</span> : null}
                          <Select id={`rs-t-move-${t.id}`} label={<W k="rs.tasks.move" />} hideLabel value={t.lane}
                                  onChange={(e) => { void move(t, e.target.value as TaskLane); }}>
                            {TASK_LANES.map((x) => <option key={x} value={x}>{LANE_NAMES[x][lang]}</option>)}
                          </Select>
                          <ChipButton onClick={() => { void drop(t); }} aria-label={`${both("rs.delete")}: ${t.title}`}>
                            <Icon name="close" size={12} />
                          </ChipButton>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
          </Surface>
        ))}
        <Surface material="pane" accent={toneVar("violet")} className="px-4 py-3 grid gap-2 content-start" data-lane="queue">
          <h2 className="text-t2 font-medium tracking-wide uppercase text-ink-soft flex items-center gap-2">
            <span className="dt-tab-dot" aria-hidden="true" /> <W k="rs.plan.queue" />
            <span className="mono text-t1">{queue.length}</span>
          </h2>
          <p className="text-t1 text-ink-soft"><W k="rs.plan.queue.hint" /></p>
          {rows === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
            : !queue.length ? <p className="text-t2 text-ink-soft"><W k="rs.plan.queue.empty" /></p>
              : (
                <ul className="rs-rows grid gap-1">
                  {queue.map((s) => (
                    <li key={s.id}>
                      <a className="rs-row no-underline" href={`/tools/research/read?source=${encodeURIComponent(s.id)}`}>
                        <span className="rs-row-dot" aria-hidden="true" />
                        <span className="rs-row-main">
                          <span className="rs-row-title">{s.title}</span>
                          <span className="rs-row-sub">{s.authors}{s.year ? ` · ${s.year}` : ""}</span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
        </Surface>
      </div>
    </div>
  );
}
