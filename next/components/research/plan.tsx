"use client";

/* ============================================================
   research/plan.tsx: the planner. RESEARCH.md section 17.

   Four views over the rows the studio already keeps. The board
   is the tasks room's four lanes with drag; the dates are events
   with a body shaped by their kind, a meeting's actions becoming
   tasks; the timeline is the year drawn in SVG, the present as a
   line and the past shaded; and a session is the time log, a
   timer with a bell that writes a line to the daily note when it
   stops. The calendar goes OUT: the reader's dates as an
   iCalendar file behind a token, and the studio holds no grant
   to anybody's calendar.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { TASK_LANES, LANE_NAMES, toneVar, type TaskLane } from "@reiad/shared/research";
import {
  EVENT_KINDS, EVENT_KIND_NAMES, EVENT_TONES, SESSION_MINUTES, SUBMISSION_STATES, SUBMISSION_STATE_NAMES, minutesBetween, toIcs,
  type EventKind, type SubmissionState,
} from "@reiad/shared/research-plan";
import {
  addEvent, addTask, appendToDay, endSession, listDocuments, listEvents, listProjects, listSessions, listTasks, pushCalendar,
  removeEvent, resetCalendar, saveEvent, saveTask, startSession,
  type Document, type Event, type Project, type Session, type Task, type Who,
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

type View = "board" | "dates" | "timeline" | "sessions";

export function Planner() {
  const { w, answered } = useWho();
  const [view, setView] = useState<View>("board");
  useKeys(useMemo(() => ({
    "1": () => setView("board"), "2": () => setView("dates"), "3": () => setView("timeline"), "4": () => setView("sessions"),
  }), []), Boolean(w));
  if (!w) return <SignedOut answered={answered} />;
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {(["board", "dates", "timeline", "sessions"] as const).map((v, i) => (
          <ChipButton key={v} pressed={view === v} onClick={() => setView(v)}>{i + 1} {both(`rs.plan.${v}`)}</ChipButton>
        ))}
        <span className="grow" />
        <ChipLink href="/tools/research/plan/week"><W k="rs.plan.week.review" /></ChipLink>
      </div>
      {view === "board" ? <Tasks /> : null}
      {view === "dates" ? <Dates w={w} /> : null}
      {view === "timeline" ? <Timeline w={w} /> : null}
      {view === "sessions" ? <Sessions w={w} /> : null}
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
