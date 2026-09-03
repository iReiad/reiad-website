/* ============================================================
   shared/research-plan.ts: the planner's vocabulary and arithmetic.

   RESEARCH.md section 17. The kinds of event and the states a
   submission passes through, both CHECK constraints in the
   migration that scripts/check-research.ts holds this file to;
   the week's boundaries; and an ICS calendar written out of a
   list of events, so Google Calendar, Outlook and a phone can
   show the studio's dates without the studio holding a grant to
   anybody's calendar.
   ============================================================ */

import type { Word } from "./research.ts";

export const EVENT_KINDS = ["milestone", "deadline", "meeting", "conference", "submission", "other"] as const;
export type EventKind = typeof EVENT_KINDS[number];

export const EVENT_KIND_NAMES: Record<EventKind, Word> = {
  milestone: { en: "Milestone", bn: "মাইলফলক" },
  deadline: { en: "Deadline", bn: "শেষ তারিখ" },
  meeting: { en: "Meeting", bn: "সভা" },
  conference: { en: "Conference", bn: "সম্মেলন" },
  submission: { en: "Submission", bn: "জমা" },
  other: { en: "Other", bn: "অন্য" },
};

export const EVENT_TONES: Record<EventKind, string> = {
  milestone: "gold", deadline: "rose", meeting: "blue", conference: "violet", submission: "teal", other: "plum",
};

/** Where a paper is with a journal. Not a CHECK constraint: it
    lives inside a submission's body, and the list is the app's. */
export const SUBMISSION_STATES = ["preparing", "submitted", "under-review", "revise", "accepted", "rejected", "published"] as const;
export type SubmissionState = typeof SUBMISSION_STATES[number];

export const SUBMISSION_STATE_NAMES: Record<SubmissionState, Word> = {
  preparing: { en: "Preparing", bn: "তৈরি হচ্ছে" },
  submitted: { en: "Submitted", bn: "জমা দেওয়া" },
  "under-review": { en: "Under review", bn: "পর্যালোচনায়" },
  revise: { en: "Revise and resubmit", bn: "সংশোধন করে আবার" },
  accepted: { en: "Accepted", bn: "গৃহীত" },
  rejected: { en: "Rejected", bn: "প্রত্যাখ্যাত" },
  published: { en: "Published", bn: "প্রকাশিত" },
};

/** The bodies an event's kind gives it. Every field optional, and
    a kind may carry more than it lists: the desk reads what it
    knows and keeps the rest. */
export interface EventBody {
  agenda?: string;
  minutes?: string;
  decisions?: string;
  actions?: string[];
  people?: string[];
  journal?: string;
  status?: SubmissionState;
  dates?: Partial<Record<SubmissionState, string>>;
  comments?: { comment: string; response: string; change: string }[];
  url?: string;
}

/** Who a person is to the project. A CHECK constraint on
    research_people that scripts/check-research.ts holds this to. */
export const PEOPLE_ROLES = ["supervisor", "author", "examiner", "gatekeeper", "colleague", "other"] as const;
export type PersonRole = typeof PEOPLE_ROLES[number];

export const PEOPLE_ROLE_NAMES: Record<PersonRole, Word> = {
  supervisor: { en: "Supervisor", bn: "সুপারভাইজার" },
  author: { en: "Author", bn: "লেখক" },
  examiner: { en: "Examiner", bn: "পরীক্ষক" },
  gatekeeper: { en: "Gatekeeper", bn: "দ্বাররক্ষী" },
  colleague: { en: "Colleague", bn: "সহকর্মী" },
  other: { en: "Other", bn: "অন্য" },
};

/** Twenty-five minutes, the default session, and the bell at its
    end is the `stage` cue at low gain. */
export const SESSION_MINUTES = 25;

/* ---------- the week ---------- */

/** Monday 00:00 of the week `day` is in, in local time, as ISO
    date. A week starts on Monday here because a research week does. */
export function weekStart(day: Date): string {
  const d = new Date(day);
  const back = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - back);
  d.setHours(0, 0, 0, 0);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export const minutesBetween = (a: string, b: string): number =>
  Math.max(0, Math.round((new Date(b).getTime() - new Date(a).getTime()) / 60000));

/* ---------- ICS out ---------- */

export interface CalendarEvent {
  id: string;
  title: string;
  starts: string;
  ends?: string | null;
  all_day?: boolean;
  place?: string;
  kind?: string;
  updated_at?: string;
}

const icsText = (s: string): string => s.replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
const stamp = (iso: string): string => new Date(iso).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
const dayOf = (iso: string): string => iso.slice(0, 10).replace(/-/g, "");

/** Lines folded at 75 octets, as RFC 5545 asks; a line longer than
    that is legal only when continued with a leading space. */
const fold = (line: string): string => {
  const out: string[] = [];
  let rest = line;
  while (rest.length > 74) { out.push(rest.slice(0, 74)); rest = " " + rest.slice(74); }
  out.push(rest);
  return out.join("\r\n");
};

/** An iCalendar file of the events. An all-day event is a DATE and
    ends the day after it starts, which is how the format says
    "one day"; a timed one carries both instants in UTC. */
export function toIcs(events: CalendarEvent[], name = "Research Studio"): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//reiad.co.uk//research studio//EN", "CALSCALE:GREGORIAN",
    `X-WR-CALNAME:${icsText(name)}`,
  ];
  for (const e of events) {
    lines.push("BEGIN:VEVENT", `UID:${e.id}@reiad.co.uk`, `DTSTAMP:${stamp(e.updated_at ?? e.starts)}`);
    if (e.all_day !== false) {
      const end = e.ends && e.ends.slice(0, 10) > e.starts.slice(0, 10) ? e.ends : null;
      const next = new Date(e.starts.slice(0, 10) + "T00:00:00Z");
      next.setUTCDate(next.getUTCDate() + 1);
      lines.push(`DTSTART;VALUE=DATE:${dayOf(e.starts)}`, `DTEND;VALUE=DATE:${end ? dayOf(end) : next.toISOString().slice(0, 10).replace(/-/g, "")}`);
    } else {
      lines.push(`DTSTART:${stamp(e.starts)}`, `DTEND:${stamp(e.ends ?? e.starts)}`);
    }
    lines.push(`SUMMARY:${icsText(e.kind && e.kind !== "other" ? `${e.title} (${e.kind})` : e.title)}`);
    if (e.place) lines.push(`LOCATION:${icsText(e.place)}`);
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.map(fold).join("\r\n") + "\r\n";
}

/* ---------- the Gantt ---------- */

/** A row the Gantt draws. A task has no start column and none is
    added: its bar runs from the day the row was made (`created_at`)
    to its due date, and a task with no due date is not a bar. An
    event is a bar only where it has an end, which is what section
    17 says a Gantt is. `group` is the project's name, and "" is
    the rows with none. */
export interface GanttRow {
  id: string;
  title: string;
  start: string;
  end: string;
  group: string;
  tone: string;
  kind: "task" | "event";
  done?: boolean;
}

export interface GanttBar extends GanttRow { x1: number; x2: number; y: number }

export interface GanttLayout {
  width: number;
  height: number;
  /** ISO days, the first of a month each. `to` is exclusive. */
  from: string;
  to: string;
  months: { x: number; year: number; month: number }[];
  groups: { name: string; y: number; count: number }[];
  bars: GanttBar[];
  /** Null when the present is off the axis, which cannot happen
      while `now` is folded into the range, and is kept so a caller
      never draws a line at 0 or at `width` by mistake. */
  nowX: number | null;
}

/** The vertical rhythm, in the SVG's own units. */
export const GANTT = { top: 30, head: 22, row: 24, bar: 12 } as const;

const DAY = 86400000;
const monthOf = (ms: number): number => { const d = new Date(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1); };
const monthAfter = (ms: number): number => { const d = new Date(ms); return Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1); };
const isoOf = (ms: number): string => new Date(ms).toISOString().slice(0, 10);

/** Bars on a month axis, grouped by project, the present folded
    into the range so it is always on the page. Pure: the same rows
    and the same `now` draw the same picture, which is what
    scripts/research.test.ts holds it to. Groups are named ones in
    alphabetical order and the unnamed group last; bars inside a
    group are in order of start. An end before its start is a
    point, never a bar running backwards. */
export function ganttLayout(rows: GanttRow[], o: { width?: number; now?: Date } = {}): GanttLayout {
  const width = o.width ?? 1000;
  const nowMs = (o.now ?? new Date()).getTime();
  const dated = rows
    .map((r) => ({ r, s: new Date(r.start).getTime(), e: new Date(r.end).getTime() }))
    .filter((x) => Number.isFinite(x.s) && Number.isFinite(x.e))
    .map((x) => ({ ...x, e: Math.max(x.s, x.e) }));
  let lo = nowMs;
  let hi = nowMs;
  for (const x of dated) { lo = Math.min(lo, x.s); hi = Math.max(hi, x.e); }
  const fromMs = monthOf(lo);
  const toMs = monthAfter(hi);
  const span = toMs - fromMs;
  const x = (ms: number): number => Math.max(0, Math.min(width, ((ms - fromMs) / span) * width));

  const months: GanttLayout["months"] = [];
  for (let m = fromMs; m < toMs; m = monthAfter(m)) {
    const d = new Date(m);
    months.push({ x: x(m), year: d.getUTCFullYear(), month: d.getUTCMonth() });
  }

  const names = [...new Set(dated.map((d) => d.r.group))].sort((a, b) => (a === "" ? 1 : b === "" ? -1 : a.localeCompare(b)));
  const groups: GanttLayout["groups"] = [];
  const bars: GanttBar[] = [];
  let y = GANTT.top;
  for (const name of names) {
    const mine = dated.filter((d) => d.r.group === name).sort((a, b) => a.s - b.s || a.r.title.localeCompare(b.r.title));
    groups.push({ name, y, count: mine.length });
    y += GANTT.head;
    for (const d of mine) {
      const x1 = x(d.s);
      const x2 = Math.max(x1 + 4, x(d.e + DAY));
      bars.push({ ...d.r, x1, x2, y });
      y += GANTT.row;
    }
  }
  const nowX = nowMs >= fromMs && nowMs < toMs ? x(nowMs) : null;
  return { width, height: y + 8, from: isoOf(fromMs), to: isoOf(toMs), months, groups, bars, nowX };
}
