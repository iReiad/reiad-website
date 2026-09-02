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
