"use client";

/* ============================================================
   research/plan.tsx: the planner. RESEARCH.md section 17.

   Six views over the rows the studio already keeps. The board
   is the tasks room's lanes with drag and the reading queue; the
   dates are events with a body shaped by their kind, a meeting's
   actions becoming tasks; the timeline is the year drawn in SVG,
   the present as a line and the past shaded; a session is the
   time log, a timer with a bell that writes a line to the daily
   note when it stops; the Gantt is every task with a due date
   and every event with an end, as bars by project on a month
   axis; and the project page is one project whole, each of its
   lists a link to the room that owns it. The calendar goes OUT:
   the reader's dates as an iCalendar file behind a token, and
   the studio holds no grant to anybody's calendar.

   Nothing here counts days in a row and nothing is red for being
   late: a due date is a fact, which is the rule the routine and
   check-research both hold.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SOURCE_STATUSES, TASK_LANES, LANE_NAMES, toneVar, type TaskLane, type Tone } from "@reiad/shared/research";
import {
  EVENT_KINDS, EVENT_KIND_NAMES, EVENT_TONES, GANTT, SESSION_MINUTES, SUBMISSION_STATES, SUBMISSION_STATE_NAMES, ganttLayout, minutesBetween, toIcs,
  type EventKind, type GanttRow, type SubmissionState,
} from "@reiad/shared/research-plan";
import { countWords } from "@reiad/shared/research-write";
import {
  addEvent, addTask, appendToDay, endSession, listDocuments, listEvents, listProjects, listQuestions, listSessions, listSources, listTasks, pushCalendar,
  removeEvent, resetCalendar, saveEvent, saveTask, startSession,
  type Document, type Event, type Project, type Question, type Session, type Source, type Task, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, when, isoDay } from "./use-who";
import { useKeys } from "./keys";
import { Tasks } from "./tasks";

type View = "board" | "dates" | "timeline" | "sessions" | "gantt" | "project";

/** The strip's order is the keys' order, and sessions keeps 4
    because the browser test presses it by that name. */
const VIEWS = ["board", "dates", "timeline", "sessions", "gantt", "project"] as const;

export function Planner() {
  const { w, answered } = useWho();
  const [view, setView] = useState<View>("board");
  const [project, setProject] = useState<string>("");
  /* `?project=<id>` opens the project page. Read after the first
     paint because the server has no idea and must not guess. */
  useEffect(() => {
    const id = new URLSearchParams(location.search).get("project");
    if (id) { setProject(id); setView("project"); }
  }, []);
  const pick = useCallback((id: string) => {
    setProject(id);
    const url = new URL(location.href);
    if (id) url.searchParams.set("project", id); else url.searchParams.delete("project");
    history.replaceState(history.state, "", url);
  }, []);
  useKeys(useMemo(() => Object.fromEntries(VIEWS.map((v, i) => [String(i + 1), () => setView(v)])), []), Boolean(w));
  if (!w) return <SignedOut answered={answered} />;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((v, i) => (
          <ChipButton key={v} pressed={view === v} onClick={() => setView(v)}>{i + 1} {both(`rs.plan.${v}`)}</ChipButton>
        ))}
        <span className="grow" />
        <ChipLink href="/tools/research/plan/week"><W k="rs.plan.week.review" /></ChipLink>
      </div>
      {view === "board" ? <Tasks /> : null}
      {view === "dates" ? <Dates w={w} /> : null}
      {view === "timeline" ? <Timeline w={w} /> : null}
      {view === "sessions" ? <Sessions w={w} /> : null}
      {view === "gantt" ? <Gantt w={w} /> : null}
      {view === "project" ? <ProjectPage w={w} id={project} onPick={pick} onView={setView} /> : null}
    </div>
  );
}

/* ---------- the dates ---------- */

function Dates({ w }: { w: Who }) {
  const lang = useToolLang();
  const [events, setEvents] = useState<Event[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<EventKind>("deadline");
  const [when_, setWhen] = useState("");
  const [until, setUntil] = useState("");
  const [place, setPlace] = useState("");
  const [project, setProject] = useState("");
  const [feed, setFeed] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => { void listEvents(w).then(setEvents); void listProjects(w).then(setProjects); }, [w]);

  const add = useCallback(async () => {
    if (!title.trim() || !when_) return;
    const e = await addEvent(w, { title: title.trim(), kind, starts: when_.length === 10 ? `${when_}T00:00:00Z` : when_, ends: until ? (until.length === 10 ? `${until}T00:00:00Z` : until) : null, all_day: when_.length === 10, place, project_id: project || null });
    if (e) { setEvents((was) => [...(was ?? []), e].sort((a, b) => a.starts.localeCompare(b.starts))); setTitle(""); setWhen(""); setUntil(""); setPlace(""); cue("saved"); }
  }, [w, title, kind, when_, until, place, project]);

  const change = useCallback(async (e: Event, part: Partial<Event>) => {
    const r = await saveEvent(w, e, part);
    if (r.ok) setEvents((was) => (was ?? []).map((x) => x.id === e.id ? r.row : x));
  }, [w]);

  /** The whole list, pushed as one file; the address comes back. */
  const publish = useCallback(async (reset = false) => {
    const url = reset ? await resetCalendar(w) : await pushCalendar(w, toIcs(events ?? []));
    if (url) { setFeed(`${location.origin}${url}`); cue("saved"); }
  }, [w, events]);

  const now = Date.now();
  const coming = (events ?? []).filter((e) => new Date(e.starts).getTime() >= now - 86400000 && !e.done);
  const past = (events ?? []).filter((e) => !coming.includes(e));

  return (
    <div className="rs-panes">
      <section className="rs-list grid gap-3 content-start">
        <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar("gold")}>
          <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); void add(); }}>
            <Field id="rs-e-title" label={<W k="rs.plan.event.title" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
            <div className="grid grid-cols-2 gap-2">
              <Select id="rs-e-kind" label={<W k="rs.plan.event.kind" />} value={kind} onChange={(e) => setKind(e.target.value as EventKind)}>
                {EVENT_KINDS.map((k) => <option key={k} value={k}>{EVENT_KIND_NAMES[k][lang]}</option>)}
              </Select>
              <Select id="rs-e-project" label={<W k="rs.project" />} value={project} onChange={(e) => setProject(e.target.value)}>
                <option value="">{both("rs.noproject")}</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </Select>
              <Field id="rs-e-when" label={<W k="rs.plan.event.when" />} type="date" value={when_} onChange={(e) => setWhen(e.target.value)} />
              <Field id="rs-e-until" label={<W k="rs.plan.event.until" />} type="date" value={until} onChange={(e) => setUntil(e.target.value)} />
            </div>
            <Field id="rs-e-place" label={<W k="rs.plan.event.place" />} value={place} onChange={(e) => setPlace(e.target.value)} autoComplete="off" />
            <div><Button type="submit" kind="solid" size="sm" disabled={!title.trim() || !when_}><W k="rs.plan.event.new" /></Button></div>
          </form>
        </Surface>
        <Surface material="pane" className="px-4 py-3 grid gap-2">
          <h3 className="text-t2 font-medium"><W k="rs.plan.calendar" /></h3>
          <p className="text-t1 text-ink-soft"><W k="rs.plan.calendar.hint" /></p>
          <div className="flex flex-wrap gap-2 items-center">
            <ChipButton onClick={() => { void publish(); }}><W k="rs.plan.calendar.make" /></ChipButton>
            {feed ? <ChipButton onClick={() => { void publish(true); }}><W k="rs.plan.calendar.reset" /></ChipButton> : null}
            {feed ? <ChipButton onClick={() => { void navigator.clipboard?.writeText(feed).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); }}>{copied ? both("rs.saved") : both("rs.plan.calendar.copy")}</ChipButton> : null}
          </div>
          {feed ? <p className="text-t1 mono break-all" role="status">{feed}</p> : null}
        </Surface>
      </section>
      <section className="rs-main min-w-0 grid gap-3">
        {events === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p> : !events.length ? <p className="text-t2 text-ink-soft"><W k="rs.plan.none" /></p> : (
          <>
            <ul className="rs-rows grid gap-1">
              {coming.map((e) => <EventRow key={e.id} e={e} open={open === e.id} onOpen={() => setOpen(open === e.id ? null : e.id)} onChange={(part) => { void change(e, part); }} onGone={() => { void removeEvent(w, e).then((ok) => { if (ok) setEvents((was) => (was ?? []).filter((x) => x.id !== e.id)); }); }} w={w} />)}
            </ul>
            {past.length ? (
              <details>
                <summary className="text-t1 text-ink-soft cursor-pointer"><W k="rs.plan.past" /> · {past.length}</summary>
                <ul className="rs-rows grid gap-1 mt-2">
                  {past.map((e) => <EventRow key={e.id} e={e} open={open === e.id} onOpen={() => setOpen(open === e.id ? null : e.id)} onChange={(part) => { void change(e, part); }} onGone={() => { void removeEvent(w, e).then((ok) => { if (ok) setEvents((was) => (was ?? []).filter((x) => x.id !== e.id)); }); }} w={w} />)}
                </ul>
              </details>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}

const dayText = (iso: string): string => iso.slice(0, 10);

function EventRow({ e, open, onOpen, onChange, onGone, w }: {
  e: Event; open: boolean; onOpen: () => void; onChange: (part: Partial<Event>) => void; onGone: () => void; w: Who;
}) {
  const lang = useToolLang();
  const [actions, setActions] = useState((e.body.actions ?? []).join("\n"));
  const days = Math.round((new Date(e.starts).getTime() - Date.now()) / 86400000);
  const body = e.body;
  const set = (part: Partial<typeof body>): void => onChange({ body: { ...body, ...part } });
  const actionsToTasks = async (): Promise<void> => {
    const lines = actions.split("\n").map((l) => l.trim()).filter(Boolean);
    for (const line of lines) await addTask(w, line, "week", e.project_id, [{ kind: "event", id: e.id, title: e.title }]);
    set({ actions: lines });
    cue("saved");
  };
  return (
    <li className="grid gap-2">
      <button type="button" className="rs-row" aria-current={open ? "true" : undefined} style={{ "--tone": toneVar(EVENT_TONES[e.kind] as "gold") } as React.CSSProperties} onClick={onOpen}>
        <span className="rs-row-dot" aria-hidden="true" />
        <span className="rs-row-main">
          <span className="rs-row-title">{e.title}</span>
          <span className="rs-row-sub">{EVENT_KIND_NAMES[e.kind][lang]}{e.place ? ` · ${e.place}` : ""}{e.body.journal ? ` · ${e.body.journal}` : ""}{e.body.status ? ` · ${SUBMISSION_STATE_NAMES[e.body.status][lang]}` : ""}</span>
        </span>
        <span className="rs-row-meta">
          <span className="text-t1 mono">{dayText(e.starts)}{e.ends ? ` → ${dayText(e.ends)}` : ""}</span>
          <span className="text-t1 text-ink-soft mono">{days === 0 ? both("rs.board.today") : days > 0 ? `${days} ${both("rs.plan.wk.days")}` : both("rs.plan.past")}</span>
        </span>
      </button>
      {open ? (
        <Surface material="sunk" className="px-4 py-3 grid gap-2">
          {e.kind === "meeting" ? (
            <>
              <Field id={`rs-ev-people-${e.id}`} label={<W k="rs.plan.meeting.people" />} defaultValue={(body.people ?? []).join(", ")} onBlur={(ev) => set({ people: ev.target.value.split(",").map((p) => p.trim()).filter(Boolean) })} />
              <TextArea id={`rs-ev-agenda-${e.id}`} label={<W k="rs.plan.meeting.agenda" />} rows={2} defaultValue={body.agenda ?? ""} onBlur={(ev) => set({ agenda: ev.target.value })} />
              <TextArea id={`rs-ev-minutes-${e.id}`} label={<W k="rs.plan.meeting.minutes" />} rows={3} defaultValue={body.minutes ?? ""} onBlur={(ev) => set({ minutes: ev.target.value })} />
              <TextArea id={`rs-ev-decisions-${e.id}`} label={<W k="rs.plan.meeting.decisions" />} rows={2} defaultValue={body.decisions ?? ""} onBlur={(ev) => set({ decisions: ev.target.value })} />
              <TextArea id={`rs-ev-actions-${e.id}`} label={<W k="rs.plan.meeting.actions" />} rows={3} value={actions} onChange={(ev) => setActions(ev.target.value)} />
              <div><Button size="sm" kind="soft" onClick={() => { void actionsToTasks(); }} disabled={!actions.trim()}><W k="rs.tasks.move" /> → <W k="rs.plan.board" /></Button></div>
            </>
          ) : null}
          {e.kind === "submission" ? (
            <>
              <div className="grid gap-2 md:grid-cols-2">
                <Field id={`rs-ev-journal-${e.id}`} label={<W k="rs.plan.submission.journal" />} defaultValue={body.journal ?? ""} onBlur={(ev) => set({ journal: ev.target.value })} />
                <Select id={`rs-ev-status-${e.id}`} label={<W k="rs.plan.submission.status" />} value={body.status ?? "preparing"}
                        onChange={(ev) => { const st = ev.target.value as SubmissionState; set({ status: st, dates: { ...(body.dates ?? {}), [st]: isoDay() } }); }}>
                  {SUBMISSION_STATES.map((st) => <option key={st} value={st}>{SUBMISSION_STATE_NAMES[st][lang]}{body.dates?.[st] ? ` · ${body.dates[st]}` : ""}</option>)}
                </Select>
              </div>
              <h4 className="text-t1 font-medium uppercase tracking-wide text-ink-soft"><W k="rs.plan.submission.comments" /></h4>
              {(body.comments ?? []).map((c, i) => (
                <div key={i} className="grid gap-1 md:grid-cols-3 text-t2">
                  <span>{c.comment}</span><span>{c.response}</span><span>{c.change}</span>
                </div>
              ))}
              <CommentForm onAdd={(c) => set({ comments: [...(body.comments ?? []), c] })} id={e.id} />
            </>
          ) : null}
          <div className="flex flex-wrap gap-2">
            <ChipButton pressed={e.done} onClick={() => onChange({ done: !e.done })}><W k="rs.plan.event.done" /></ChipButton>
            <ChipButton onClick={() => { if (window.confirm(`${both("rs.delete")}: ${e.title}?`)) onGone(); }}><W k="rs.delete" /></ChipButton>
          </div>
        </Surface>
      ) : null}
    </li>
  );
}

function CommentForm({ onAdd, id }: { onAdd: (c: { comment: string; response: string; change: string }) => void; id: string }) {
  const [c, setC] = useState({ comment: "", response: "", change: "" });
  return (
    <form className="grid gap-2 md:grid-cols-[1fr_1fr_1fr_auto] items-end" onSubmit={(e) => { e.preventDefault(); if (c.comment.trim()) { onAdd(c); setC({ comment: "", response: "", change: "" }); } }}>
      <Field id={`rs-cm-c-${id}`} label={<W k="rs.plan.submission.comment" />} value={c.comment} onChange={(e) => setC({ ...c, comment: e.target.value })} />
      <Field id={`rs-cm-r-${id}`} label={<W k="rs.plan.submission.response" />} value={c.response} onChange={(e) => setC({ ...c, response: e.target.value })} />
      <Field id={`rs-cm-x-${id}`} label={<W k="rs.plan.submission.change" />} value={c.change} onChange={(e) => setC({ ...c, change: e.target.value })} />
      <Button type="submit" size="sm" kind="soft" disabled={!c.comment.trim()}><W k="rs.plan.submission.add" /></Button>
    </form>
  );
}

/* ---------- the timeline ---------- */

function Timeline({ w }: { w: Who }) {
  const lang = useToolLang();
  const [events, setEvents] = useState<Event[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [year, setYear] = useState(new Date().getFullYear());
  useEffect(() => { void listEvents(w).then(setEvents); void listDocuments(w).then(setDocs); }, [w]);
  const width = 1000;
  const start = new Date(`${year}-01-01T00:00:00`).getTime();
  const end = new Date(`${year + 1}-01-01T00:00:00`).getTime();
  const x = (iso: string): number => Math.max(0, Math.min(width, ((new Date(iso).getTime() - start) / (end - start)) * width));
  const inYear = events.filter((e) => new Date(e.starts).getTime() < end && new Date(e.ends ?? e.starts).getTime() >= start);
  const nowX = x(new Date().toISOString());
  const rowH = 26;
  const rows = inYear.length + docs.length;
  const height = 60 + rows * rowH;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2">
      <div className="flex items-center gap-2">
        <h2 className="text-t3 font-medium"><W k="rs.plan.timeline" /></h2>
        <span className="grow" />
        <ChipButton onClick={() => setYear((y) => y - 1)} aria-label="‹">‹</ChipButton>
        <span className="mono">{year}</span>
        <ChipButton onClick={() => setYear((y) => y + 1)} aria-label="›">›</ChipButton>
      </div>
      <p className="text-t1 text-ink-soft"><W k="rs.plan.timeline.hint" /></p>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: "40rem" }} role="img" aria-label={`${both("rs.plan.timeline")} ${year}`}>
          {nowX > 0 && nowX < width ? <rect x={0} y={0} width={nowX} height={height} fill="currentColor" opacity={0.05} /> : null}
          {Array.from({ length: 12 }, (_, m) => {
            const mx = (m / 12) * width;
            return (
              <g key={m}>
                <line x1={mx} y1={28} x2={mx} y2={height} stroke="currentColor" opacity={0.12} />
                <text x={mx + 4} y={18} fontSize={11} fill="currentColor" opacity={0.7} fontFamily="ui-monospace, monospace">
                  {new Date(year, m, 1).toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", { month: "short" })}
                </text>
              </g>
            );
          })}
          {inYear.map((e, i) => {
            const y = 40 + i * rowH;
            const x1 = x(e.starts);
            const x2 = e.ends ? Math.max(x1 + 6, x(e.ends)) : x1 + 6;
            return (
              <g key={e.id}>
                <rect x={x1} y={y} width={x2 - x1} height={14} rx={4} fill={toneVar(EVENT_TONES[e.kind] as "gold")} opacity={e.done ? 0.45 : 0.9} />
                <text x={Math.min(x2 + 6, width - 200)} y={y + 11} fontSize={11} fill="currentColor">{e.title}</text>
              </g>
            );
          })}
          {docs.map((d, i) => {
            const y = 40 + (inYear.length + i) * rowH;
            const x1 = x(d.created_at);
            const x2 = Math.max(x1 + 6, x(d.updated_at));
            return (
              <g key={d.id}>
                <rect x={x1} y={y + 2} width={x2 - x1} height={10} rx={3} fill="currentColor" opacity={0.3} />
                <text x={Math.min(x2 + 6, width - 200)} y={y + 11} fontSize={11} fill="currentColor" opacity={0.8}>{d.title}</text>
              </g>
            );
          })}
          {nowX > 0 && nowX < width ? <line x1={nowX} y1={0} x2={nowX} y2={height} stroke={toneVar("rose")} strokeWidth={2} /> : null}
        </svg>
      </div>
    </Surface>
  );
}

/* ---------- sessions ---------- */

function Sessions({ w }: { w: Who }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [running, setRunning] = useState<Session | null>(null);
  const [project, setProject] = useState("");
  const [room, setRoom] = useState("");
  const [note, setNote] = useState("");
  const [tick, setTick] = useState(0);
  const bell = useRef(false);

  useEffect(() => {
    void listProjects(w).then(setProjects);
    void listSessions(w).then((s) => { setSessions(s); const open = s.find((x) => !x.ended); if (open) setRunning(open); });
  }, [w]);
  useEffect(() => {
    if (!running) return undefined;
    const t = setInterval(() => setTick((n) => n + 1), 1000);
    return () => clearInterval(t);
  }, [running]);

  const elapsed = running ? Math.floor((Date.now() - new Date(running.started).getTime()) / 1000) : 0;
  useEffect(() => {
    if (running && elapsed >= SESSION_MINUTES * 60 && !bell.current) { bell.current = true; cue("stage"); }
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [tick]);

  const start = async (): Promise<void> => {
    const s = await startSession(w, room, project || null);
    if (s) { setRunning(s); bell.current = false; cue("press"); }
  };
  const stop = async (): Promise<void> => {
    if (!running) return;
    const r = await endSession(w, running, note);
    if (!r.ok) return;
    const mins = minutesBetween(running.started, r.row.ended ?? new Date().toISOString());
    const proj = projects.find((p) => p.id === running.project_id)?.name;
    await appendToDay(w, isoDay(), `${mins} ${both("rs.plan.minutes")}${proj ? ` · ${proj}` : ""}${room ? ` · ${room}` : ""}${note ? `: ${note}` : ""}`);
    setSessions((was) => [r.row, ...was.filter((x) => x.id !== r.row.id)]);
    setRunning(null);
    setNote("");
    cue("saved");
  };
  const todayMins = sessions.filter((s) => s.ended && s.started.slice(0, 10) === isoDay()).reduce((n, s) => n + minutesBetween(s.started, s.ended as string), 0);
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-3 content-start" accent={toneVar("green")}>
        <h2 className="text-t3 font-medium"><W k="rs.plan.sessions" /></h2>
        <p className="text-t1 text-ink-soft"><W k="rs.plan.session.hint" /></p>
        {running ? (
          <>
            <p className="text-t5 mono" role="timer" aria-live="off">{mm}:{ss}</p>
            <p className="text-t1 text-ink-soft"><W k="rs.plan.session.running" />{running.room ? ` · ${running.room}` : ""}</p>
            <TextArea id="rs-ss-note" label={<W k="rs.plan.session.note" />} rows={2} value={note} onChange={(e) => setNote(e.target.value)} />
            <div><Button kind="solid" size="sm" onClick={() => { void stop(); }}><W k="rs.plan.session.stop" /></Button></div>
          </>
        ) : (
          <>
            <Select id="rs-ss-project" label={<W k="rs.project" />} value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">{both("rs.noproject")}</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <Field id="rs-ss-room" label={<W k="rs.plan.session.room" />} value={room} onChange={(e) => setRoom(e.target.value)} autoComplete="off" />
            <div><Button kind="solid" size="sm" onClick={() => { void start(); }}><W k="rs.plan.session.start" /></Button></div>
          </>
        )}
        <p className="text-t1 text-ink-soft mono"><W k="rs.plan.session.today" />: {todayMins} <W k="rs.plan.minutes" /></p>
      </Surface>
      <Surface material="pane" className="px-4 py-3 grid gap-2">
        {sessions.filter((s) => s.ended).length ? (
          <ul className="grid gap-1 text-t2">
            {sessions.filter((s) => s.ended).slice(0, 40).map((s) => (
              <li key={s.id} className="flex flex-wrap items-baseline gap-2">
                <span className="text-t1 text-ink-soft mono w-16">{when(s.started)}</span>
                <span className="mono">{minutesBetween(s.started, s.ended as string)} {both("rs.plan.minutes")}</span>
                {s.room ? <Chip>{s.room}</Chip> : null}
                <span className="text-ink-soft">{s.note}</span>
              </li>
            ))}
          </ul>
        ) : <p className="text-t2 text-ink-soft"><W k="rs.none" /></p>}
      </Surface>
    </div>
  );
}

/* ---------- the Gantt ---------- */

const MONTH_LABEL = (lang: "en" | "bn", year: number, month: number): string =>
  new Date(Date.UTC(year, month, 1)).toLocaleString(lang === "bn" ? "bn-BD" : "en-GB", { month: "short", year: "2-digit", timeZone: "UTC" });

/** Bars on a month axis, out of `ganttLayout`. A task's bar
    starts at `created_at` because the table has no start column
    and none was added; the words say so on the page. */
function Gantt({ w }: { w: Who }) {
  const lang = useToolLang();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  useEffect(() => {
    void listTasks(w).then(setTasks);
    void listEvents(w).then(setEvents);
    void listProjects(w).then(setProjects);
  }, [w]);
  const layout = useMemo(() => {
    const nameOf = (id: string | null): string => projects.find((p) => p.id === id)?.name ?? "";
    const toneOf = (id: string | null): string => toneVar(projects.find((p) => p.id === id)?.tone ?? "blue");
    const rows: GanttRow[] = [
      ...tasks.filter((t) => t.due).map((t): GanttRow => ({
        id: t.id, title: t.title, start: t.created_at, end: t.due as string, group: nameOf(t.project_id), tone: toneOf(t.project_id), kind: "task", done: t.lane === "done",
      })),
      ...events.filter((e) => e.ends).map((e): GanttRow => ({
        id: e.id, title: e.title, start: e.starts, end: e.ends as string, group: nameOf(e.project_id), tone: toneVar(EVENT_TONES[e.kind] as Tone), kind: "event", done: e.done,
      })),
    ];
    return ganttLayout(rows);
  }, [tasks, events, projects]);
  const { width, height } = layout;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-2" data-testid="rs-gantt">
      <h2 className="text-t3 font-medium"><W k="rs.plan.gantt" /></h2>
      <p className="text-t1 text-ink-soft"><W k="rs.plan.gantt.hint" /></p>
      {!layout.bars.length ? <p className="text-t2 text-ink-soft"><W k="rs.plan.gantt.none" /></p> : (
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full" style={{ minWidth: "40rem" }} role="img" aria-label={both("rs.plan.gantt")}>
            {layout.nowX !== null ? <rect x={0} y={0} width={layout.nowX} height={height} fill="currentColor" opacity={0.05} /> : null}
            {layout.months.map((m) => (
              <g key={`${m.year}-${m.month}`}>
                <line x1={m.x} y1={GANTT.top - 4} x2={m.x} y2={height} stroke="currentColor" opacity={0.12} />
                <text x={m.x + 4} y={16} fontSize={11} fill="currentColor" opacity={0.7} fontFamily="ui-monospace, monospace">{MONTH_LABEL(lang, m.year, m.month)}</text>
              </g>
            ))}
            {layout.groups.map((g) => (
              <text key={g.name || "none"} x={4} y={g.y + 14} fontSize={11} fill="currentColor" opacity={0.8} fontWeight={600}>
                {g.name || both("rs.noproject")} · {g.count}
              </text>
            ))}
            {layout.bars.map((b) => (
              <g key={b.id} data-bar={b.kind}>
                <rect x={b.x1} y={b.y + (GANTT.row - GANTT.bar) / 2} width={b.x2 - b.x1} height={GANTT.bar} rx={b.kind === "task" ? 3 : 4}
                      fill={b.tone} opacity={b.done ? 0.4 : b.kind === "task" ? 0.7 : 0.9} />
                <text x={Math.min(b.x2 + 6, width - 220)} y={b.y + GANTT.row / 2 + 4} fontSize={11} fill="currentColor" opacity={b.done ? 0.6 : 1}>{b.title}</text>
              </g>
            ))}
            {layout.nowX !== null ? <line x1={layout.nowX} y1={0} x2={layout.nowX} y2={height} stroke={toneVar("rose")} strokeWidth={2} /> : null}
          </svg>
        </div>
      )}
    </Surface>
  );
}

/* ---------- the project page ---------- */

function ProjectPage({ w, id, onPick, onView }: { w: Who; id: string; onPick: (id: string) => void; onView: (v: View) => void }) {
  const lang = useToolLang();
  const [projects, setProjects] = useState<Project[] | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [docs, setDocs] = useState<Document[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const monthStart = useMemo(() => { const d = new Date(); d.setDate(1); d.setHours(0, 0, 0, 0); return d.toISOString(); }, []);
  useEffect(() => { void listProjects(w).then(setProjects); }, [w]);
  useEffect(() => {
    if (!id) return;
    void listQuestions(w).then(setQuestions);
    void listSources(w, { project: id, limit: 1000 }).then(setSources);
    void listDocuments(w, { project: id }).then(setDocs);
    void listTasks(w).then(setTasks);
    void listEvents(w, { project: id, from: new Date().toISOString() }).then(setEvents);
    void listSessions(w, monthStart).then(setSessions);
  }, [w, id, monthStart]);

  const p = projects?.find((x) => x.id === id) ?? null;
  /* Filtered here as well as in the query: a fake or a stale
     cache that ignores the filter must not draw another
     project's rows on this one. */
  const mine = {
    questions: questions.filter((q) => q.project_id === id),
    sources: sources.filter((s) => s.projects.includes(id)),
    docs: docs.filter((d) => d.project_id === id),
    tasks: tasks.filter((t) => t.project_id === id && t.lane !== "done"),
    dates: events.filter((e) => e.project_id === id && !e.done).slice(0, 3),
    sessions: sessions.filter((s) => s.project_id === id && s.ended),
  };
  const minutes = mine.sessions.reduce((n, s) => n + minutesBetween(s.started, s.ended as string), 0);
  const byStatus = SOURCE_STATUSES.map((st) => ({ st, n: mine.sources.filter((s) => s.status === st).length }));
  const byLane = TASK_LANES.filter((l) => l !== "done").map((l) => ({ l, rows: mine.tasks.filter((t) => t.lane === l) }));
  const head = (k: string, n: number) => (
    <h3 className="text-t2 font-medium flex items-center gap-2"><W k={k} /> <Chip>{n}</Chip></h3>
  );

  return (
    <div className="grid gap-3" data-testid="rs-project">
      <Surface material="pane" className="px-4 py-3 grid gap-2">
        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_16rem] items-end">
          <div>
            <h2 className="text-t3 font-medium">{p ? p.name : <W k="rs.plan.project" />}</h2>
            <p className="text-t1 text-ink-soft"><W k="rs.plan.project.hint" /></p>
          </div>
          {projects === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
            : !projects.length ? <p className="text-t2 text-ink-soft"><W k="rs.plan.project.none" /> <Link href="/tools/research/settings"><W k="rs.plan.project.go" /></Link></p>
              : (
                <Select id="rs-pp-project" label={<W k="rs.plan.project.pick" />} value={id} onChange={(e) => onPick(e.target.value)}>
                  <option value="">{both("rs.plan.project.pick")}</option>
                  {projects.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                </Select>
              )}
        </div>
      </Surface>
      {p ? (
        <div className="grid gap-3 max-w-[60rem]">
          <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar(p.tone)}>
            <h3 className="text-t2 font-medium"><W k="rs.plan.project.brief" /></h3>
            {p.body.brief || p.body.aims
              ? <p className="text-t2 whitespace-pre-line">{p.body.brief ?? p.body.aims}</p>
              : <p className="text-t2 text-ink-soft"><W k="rs.plan.project.brief.none" /></p>}
          </Surface>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            {head("rs.plan.project.questions", mine.questions.length)}
            {mine.questions.length ? <ul className="grid gap-1 text-t2">{mine.questions.map((q) => <li key={q.id}><Link href="/tools/research/questions">{q.text}</Link></li>)}</ul> : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
            <div><ChipLink href="/tools/research/questions"><W k="rs.plan.project.go" /></ChipLink></div>
          </Surface>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            {head("rs.plan.project.sources", mine.sources.length)}
            <ul className="flex flex-wrap gap-2 text-t2">
              {byStatus.map(({ st, n }) => <li key={st}><Link href="/tools/research/library" className="no-underline"><Chip>{both(`rs.lib.status.${st}`)} · {n}</Chip></Link></li>)}
            </ul>
            <div><ChipLink href="/tools/research/library"><W k="rs.plan.project.go" /></ChipLink></div>
          </Surface>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            {head("rs.plan.project.documents", mine.docs.length)}
            {mine.docs.length ? (
              <ul className="grid gap-1 text-t2">
                {mine.docs.map((d) => <li key={d.id} className="flex flex-wrap items-baseline gap-2"><Link href="/tools/research/write">{d.title}</Link><span className="text-t1 text-ink-soft mono">{countWords(d.text)} {both("rs.write.words")}{d.budget ? ` / ${d.budget}` : ""}</span></li>)}
              </ul>
            ) : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
            <div><ChipLink href="/tools/research/write"><W k="rs.plan.project.go" /></ChipLink></div>
          </Surface>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            {head("rs.plan.project.tasks", mine.tasks.length)}
            {mine.tasks.length ? byLane.filter((x) => x.rows.length).map(({ l, rows }) => (
              <div key={l} className="grid gap-1">
                <p className="text-t1 text-ink-soft mono uppercase">{LANE_NAMES[l][lang]} · {rows.length}</p>
                <ul className="grid gap-1 text-t2">{rows.map((t) => <li key={t.id}>{t.title}{t.due ? <span className="text-t1 text-ink-soft mono"> · {t.due}</span> : null}</li>)}</ul>
              </div>
            )) : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
            <div><ChipButton onClick={() => onView("board")}><W k="rs.plan.board" /></ChipButton></div>
          </Surface>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            {head("rs.plan.project.dates", mine.dates.length)}
            {mine.dates.length ? <ul className="grid gap-1 text-t2">{mine.dates.map((e) => <li key={e.id}><span className="text-t1 text-ink-soft mono">{dayText(e.starts)} </span>{e.title} <span className="text-t1 text-ink-soft">{EVENT_KIND_NAMES[e.kind][lang]}</span></li>)}</ul> : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
            <div><ChipButton onClick={() => onView("dates")}><W k="rs.plan.dates" /></ChipButton></div>
          </Surface>
          <Surface material="pane" className="px-4 py-3 grid gap-2">
            {head("rs.plan.project.sessions", mine.sessions.length)}
            <p className="text-t1 text-ink-soft mono">{minutes} {both("rs.plan.minutes")}</p>
            {mine.sessions.length ? (
              <ul className="grid gap-1 text-t2">
                {mine.sessions.slice(0, 12).map((s) => <li key={s.id} className="flex flex-wrap items-baseline gap-2"><span className="text-t1 text-ink-soft mono w-16">{when(s.started)}</span><span className="mono">{minutesBetween(s.started, s.ended as string)} {both("rs.plan.minutes")}</span>{s.room ? <Chip>{s.room}</Chip> : null}<span className="text-ink-soft">{s.note}</span></li>)}
              </ul>
            ) : null}
            <div><ChipButton onClick={() => onView("sessions")}><W k="rs.plan.sessions" /></ChipButton></div>
          </Surface>
        </div>
      ) : null}
    </div>
  );
}

/* ---------- the weekly review ---------- */

export function WeekReview() {
  const { w, answered } = useWho();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);
  const monday = useMemo(() => { const d = new Date(); const back = (d.getDay() + 6) % 7; d.setDate(d.getDate() - back); d.setHours(0, 0, 0, 0); return d; }, []);
  const since = monday.toISOString();
  const weekDay = `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  useEffect(() => {
    if (!w) return;
    void listTasks(w).then(setTasks);
    void listSessions(w, since).then(setSessions);
    void listEvents(w, { from: since }).then(setEvents);
  }, [w, since]);
  if (!w) return <SignedOut answered={answered} />;
  const done = tasks.filter((t) => t.lane === "done" && t.done_at && t.done_at >= since);
  const next = TASK_LANES.filter((l) => l === "today" || l === "week").flatMap((l) => tasks.filter((t) => t.lane === l));
  const waiting = tasks.filter((t) => t.lane === "waiting");
  const mins = sessions.filter((s) => s.ended).reduce((n, s) => n + minutesBetween(s.started, s.ended as string), 0);
  const keep = async (): Promise<void> => {
    if (!note.trim()) return;
    await appendToDay(w, weekDay, `${both("rs.plan.wk.note")}: ${note.trim()}`);
    setSaved(true); setNote(""); cue("saved");
  };
  const laneName = (l: TaskLane): string => LANE_NAMES[l].en;
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar("green")}>
        <h2 className="text-t3 font-medium"><W k="rs.plan.wk.done" /> <Chip>{done.length}</Chip></h2>
        {done.length ? <ul className="grid gap-1 text-t2">{done.map((t) => <li key={t.id}>{t.title}</li>)}</ul> : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
        <p className="text-t1 text-ink-soft mono"><W k="rs.plan.wk.time" />: {mins} {both("rs.plan.minutes")}</p>
      </Surface>
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar("blue")}>
        <h2 className="text-t3 font-medium"><W k="rs.plan.wk.next" /> <Chip>{next.length}</Chip></h2>
        {next.length ? <ul className="grid gap-1 text-t2">{next.map((t) => <li key={t.id}><span className="text-t1 text-ink-soft mono">{laneName(t.lane)} </span>{t.title}</li>)}</ul> : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
        {events.length ? <ul className="grid gap-1 text-t2">{events.slice(0, 5).map((e) => <li key={e.id}><span className="text-t1 text-ink-soft mono">{dayText(e.starts)} </span>{e.title}</li>)}</ul> : null}
      </Surface>
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar("gold")}>
        <h2 className="text-t3 font-medium"><W k="rs.plan.wk.waiting" /> <Chip>{waiting.length}</Chip></h2>
        {waiting.length ? <ul className="grid gap-1 text-t2">{waiting.map((t) => <li key={t.id}>{t.title} <span className="text-t1 text-ink-soft mono">{t.waiting_since ? `${Math.round((Date.now() - new Date(t.waiting_since).getTime()) / 86400000)} ${both("rs.plan.wk.days")}` : ""}</span></li>)}</ul> : <p className="text-t2 text-ink-soft"><W k="rs.plan.wk.nothing" /></p>}
      </Surface>
      <Surface material="pane" className="rs-tint px-4 py-3 grid gap-2" accent={toneVar("plum")}>
        <h2 className="text-t3 font-medium"><W k="rs.plan.wk.note" /></h2>
        <p className="text-t1 text-ink-soft"><W k="rs.plan.wk.note.hint" /></p>
        <TextArea id="rs-wk-note" label={<W k="rs.plan.wk.note" />} hideLabel rows={4} value={note} onChange={(e) => setNote(e.target.value)} />
        <div className="flex items-center gap-2">
          <Button kind="solid" size="sm" disabled={!note.trim()} onClick={() => { void keep(); }}><W k="rs.plan.wk.save" /></Button>
          {saved ? <span className="text-t1 text-ink-soft mono"><W k="rs.saved" /></span> : null}
          <span className="grow" />
          <Link href="/tools/research/plan" className="text-t1"><W k="rs.plan.board" /></Link>
        </div>
      </Surface>
    </div>
  );
}
