/* ============================================================
   shared/research-field.ts: the field room's vocabulary and
   arithmetic. RESEARCH.md section 15.

   A transcript's segments, read out of pasted text or out of what
   the Worker's transcription answered; the matrices derived from
   the codings (code by participant, co-occurrence, frequency over
   the interviews in order); a survey's questions and its answers
   as a table the lab can read. Pure, held by
   scripts/research-field.test.ts.
   ============================================================ */

import type { Word } from "./research.ts";

export const CONSENT_STATES = ["pending", "given", "withdrawn"] as const;
export type ConsentState = typeof CONSENT_STATES[number];
export const CONSENT_NAMES: Record<ConsentState, Word> = {
  pending: { en: "Pending", bn: "অপেক্ষমাণ" },
  given: { en: "Given", bn: "দেওয়া হয়েছে" },
  withdrawn: { en: "Withdrawn", bn: "প্রত্যাহার" },
};

/** `file` is the signed form's R2 key, uploaded through the same
    path a source's file takes, and `file_name` what it was called. */
export interface Consent { status?: ConsentState; date?: string; file?: string; file_name?: string; scope?: string; quotes?: boolean; withdrawn?: string }

export const TRANSCRIPT_STATES = ["draft", "checked"] as const;
export type TranscriptState = typeof TRANSCRIPT_STATES[number];

export interface Segment { start: number; end: number; speaker: string; text: string }

/** `[hh:]mm:ss` or `mm:ss.s` to seconds. */
export function secondsOf(stamp: string): number | null {
  const m = /^(?:(\d{1,2}):)?(\d{1,2}):(\d{2}(?:\.\d+)?)$/.exec(stamp.trim());
  if (!m) return null;
  return (m[1] ? Number(m[1]) * 3600 : 0) + Number(m[2]) * 60 + Number(m[3]);
}

export const stampOf = (s: number): string => {
  const t = Math.max(0, Math.round(s));
  const h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), sec = t % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

/** Pasted text into segments. A line that opens with a time and
    optionally a speaker (`[12:34] P07: ...`, `12:34 Interviewer:`)
    starts a segment; a blank line starts one too; anything else
    joins the segment before it. Times missing are spaced evenly
    over `duration` where one is known, so a coding still has a
    place on the player. */
export function segmentsOf(text: string, duration: number | null = null): Segment[] {
  const out: Segment[] = [];
  const HEAD = /^\s*\[?((?:\d{1,2}:)?\d{1,2}:\d{2}(?:\.\d+)?)\]?\s*(?:([^:\n]{1,40}):)?\s*(.*)$/;
  const SPEAKER = /^([A-Za-z0-9ঀ-৿ _.-]{1,40}):\s+(.*)$/;
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const line = raw.trim();
    if (!line) { if (out.length && out[out.length - 1].text) out.push({ start: -1, end: -1, speaker: "", text: "" }); continue; }
    const h = HEAD.exec(line);
    if (h && secondsOf(h[1]) !== null) {
      out.push({ start: secondsOf(h[1]) ?? -1, end: -1, speaker: (h[2] ?? "").trim(), text: h[3].trim() });
      continue;
    }
    const s = SPEAKER.exec(line);
    if (s && (!out.length || out[out.length - 1].text)) { out.push({ start: -1, end: -1, speaker: s[1].trim(), text: s[2].trim() }); continue; }
    const last = out[out.length - 1];
    if (!last) out.push({ start: -1, end: -1, speaker: "", text: line });
    else last.text = last.text ? `${last.text} ${line}` : line;
  }
  const segs = out.filter((s) => s.text);
  const n = segs.length;
  const timed = segs.some((s) => s.start >= 0);
  segs.forEach((s, i) => {
    if (s.start >= 0) return;
    /* After a timed segment an untimed one follows it a second
       later, so the order on the player is the order on the page;
       with no times at all they are spaced over the duration. */
    s.start = timed ? (i ? segs[i - 1].start + 1 : 0) : duration && n ? (i * duration) / n : i * 30;
  });
  segs.forEach((s, i) => { if (s.end < 0) s.end = i + 1 < n ? segs[i + 1].start : duration ?? s.start + 30; });
  return segs;
}

/** What the transcription model answers, whatever its shape, as
    segments: a `segments` list with times if it gave one, the
    `vtt` if it gave that, and the plain text otherwise. */
export function segmentsFromModel(answer: { text?: string; segments?: { start?: number; end?: number; text?: string }[]; vtt?: string }, duration: number | null = null): Segment[] {
  if (answer.segments?.length) {
    return answer.segments.filter((s) => (s.text ?? "").trim()).map((s) => ({ start: s.start ?? 0, end: s.end ?? (s.start ?? 0), speaker: "", text: (s.text ?? "").trim() }));
  }
  if (answer.vtt) {
    const out: Segment[] = [];
    for (const block of answer.vtt.replace(/\r/g, "").split(/\n\n+/)) {
      const lines = block.split("\n").filter(Boolean);
      const at = lines.findIndex((l) => l.includes("-->"));
      if (at < 0) continue;
      const [a, b] = lines[at].split("-->").map((x) => x.trim());
      const text = lines.slice(at + 1).join(" ").trim();
      if (text) out.push({ start: secondsOf(a) ?? 0, end: secondsOf(b) ?? 0, speaker: "", text });
    }
    if (out.length) return out;
  }
  return segmentsOf(answer.text ?? "", duration);
}

/* ---------- the matrices ---------- */

export interface CodingLike { code_id: string; participant_id: string | null; source_id: string | null; note_id: string }

export interface Matrix { rows: string[]; cols: string[]; cells: number[][] }

/** Code by participant: who said what. */
export function byParticipant(codings: CodingLike[], codes: string[], participants: string[]): Matrix {
  const cells = codes.map((c) => participants.map((p) => codings.filter((x) => x.code_id === c && x.participant_id === p).length));
  return { rows: codes, cols: participants, cells };
}

/** Code co-occurrence: two codes on the same transcript, counted
    once per transcript, so the diagonal is how many transcripts a
    code appears in. */
export function coOccurrence(codings: CodingLike[], codes: string[]): Matrix {
  const byNote = new Map<string, Set<string>>();
  for (const c of codings) byNote.set(c.note_id, (byNote.get(c.note_id) ?? new Set()).add(c.code_id));
  const cells = codes.map((a) => codes.map((b) => [...byNote.values()].filter((s) => s.has(a) && s.has(b)).length));
  return { rows: codes, cols: codes, cells };
}

/** Code frequency over the interviews in the order given: when a
    theme appeared. */
export function overInterviews(codings: CodingLike[], codes: string[], interviews: string[]): Matrix {
  const cells = codes.map((c) => interviews.map((s) => codings.filter((x) => x.code_id === c && x.source_id === s).length));
  return { rows: codes, cols: interviews, cells };
}

export const matrixCsv = (m: Matrix, corner = ""): string => {
  const esc = (s: string): string => `"${s.replace(/"/g, "\"\"")}"`;
  return `${[[corner, ...m.cols].map(esc).join(","), ...m.rows.map((r, i) => [esc(r), ...m.cells[i]].join(","))].join("\n")}\n`;
};

/* ---------- surveys ---------- */

export const QUESTION_TYPES = ["likert", "choice", "multi", "text", "number"] as const;
export type QuestionType = typeof QUESTION_TYPES[number];
export const QUESTION_TYPE_NAMES: Record<QuestionType, Word> = {
  likert: { en: "Likert (1 to 5)", bn: "লিকার্ট (১ থেকে ৫)" },
  choice: { en: "One of", bn: "একটি বেছে নিন" },
  multi: { en: "Any of", bn: "যেকোনো কয়টি" },
  text: { en: "Free text", bn: "মুক্ত লেখা" },
  number: { en: "A number", bn: "একটি সংখ্যা" },
};

export interface SurveyQuestion { id: string; type: QuestionType; en: string; bn: string; options?: { en: string; bn: string }[]; required?: boolean }
export type Answers = Record<string, string | number | string[] | null>;

/** A survey's questions typed as lines: `type | English | Bangla |
    option, option`, one a line, with an id from its position. */
export function questionsOf(text: string): SurveyQuestion[] {
  const out: SurveyQuestion[] = [];
  for (const raw of text.replace(/\r/g, "").split("\n")) {
    const parts = raw.split("|").map((p) => p.trim());
    if (parts.length < 2 || !parts[1]) continue;
    const type = (QUESTION_TYPES as readonly string[]).includes(parts[0]) ? (parts[0] as QuestionType) : "text";
    const required = parts[1].endsWith("*");
    const en = parts[1].replace(/\*$/, "").trim(), bn = (parts[2] || parts[1]).replace(/\*$/, "").trim();
    const q: SurveyQuestion = { id: `q${out.length + 1}`, type, en, bn, required };
    if ((type === "choice" || type === "multi") && parts[3]) {
      q.options = parts[3].split(",").map((o) => o.trim()).filter(Boolean).map((o) => { const [en, bn] = o.split("/").map((x) => x.trim()); return { en, bn: bn || en }; });
    }
    out.push(q);
  }
  return out;
}

export const questionsText = (qs: SurveyQuestion[]): string =>
  qs.map((q) => [q.type, q.en + (q.required ? "*" : ""), q.bn, (q.options ?? []).map((o) => (o.en === o.bn ? o.en : `${o.en} / ${o.bn}`)).join(", ")].filter((x, i) => i < 3 || x).join(" | ")).join("\n");

/** An answer checked against its question: a Likert is 1 to 5, a
    choice is one of the options, a multi is some of them, a number
    is one, and text is text cut at two thousand characters. Wrong
    answers become null rather than errors, so a form from a
    stranger cannot break the row. */
export function cleanAnswers(qs: SurveyQuestion[], raw: Record<string, unknown>): Answers {
  const out: Answers = {};
  for (const q of qs) {
    const v = raw[q.id];
    if (q.type === "likert") { const n = Number(v); out[q.id] = Number.isInteger(n) && n >= 1 && n <= 5 ? n : null; }
    else if (q.type === "number") { const n = Number(v); out[q.id] = typeof v !== "undefined" && v !== "" && Number.isFinite(n) ? n : null; }
    else if (q.type === "choice") { const opts = (q.options ?? []).map((o) => o.en); out[q.id] = typeof v === "string" && opts.includes(v) ? v : null; }
    else if (q.type === "multi") { const opts = (q.options ?? []).map((o) => o.en); out[q.id] = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && opts.includes(x)) : []; }
    else out[q.id] = typeof v === "string" ? v.slice(0, 2000) : null;
  }
  return out;
}

/** Responses as a table for the lab: one row a response, one
    column a question by id, a multi joined with a semicolon. */
export function responsesTable(qs: SurveyQuestion[], responses: { answers: Answers; at: string }[]): { columns: string[]; rows: (string | number | null)[][] } {
  const columns = ["submitted_at", ...qs.map((q) => q.id)];
  const rows = responses.map((r) => [r.at, ...qs.map((q) => { const v = r.answers[q.id]; return Array.isArray(v) ? v.join(";") : v ?? null; })]);
  return { columns, rows };
}

export const tableCsv = (t: { columns: string[]; rows: (string | number | null)[][] }): string => {
  const esc = (v: string | number | null): string => `"${String(v ?? "").replace(/"/g, "\"\"")}"`;
  return `${[t.columns.map(esc).join(","), ...t.rows.map((r) => r.map(esc).join(","))].join("\n")}\n`;
};

/** A public token: 22 characters from a UUID's own randomness. */
export const tokenOf = (uuid: string): string => uuid.replace(/-/g, "").slice(0, 22);

/* ---------- a quote into a draft, and a memo as a note ---------- */

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The block a coding becomes in a draft: the segment, its
    translation beneath where there is one (section 15: a thesis in
    English about interviews in Bangla shows its working), and a
    line naming the pseudonym, the interview and the time. Article
    HTML, so the writing desk's sanitiser keeps all of it. */
export function quoteBlock(q: { text: string; translation?: string | null; pseudonym: string; interview: string; at?: string }): { html: string; text: string } {
  const who = [q.pseudonym, q.interview, q.at].filter(Boolean).join(", ");
  const lines = [q.text.trim(), (q.translation ?? "").trim(), who].filter(Boolean);
  const html = `<blockquote>${lines.map((l, i) => (i === lines.length - 1 ? `<p><em>${esc(l)}</em></p>` : `<p>${esc(l)}</p>`)).join("")}</blockquote>`;
  return { html, text: lines.join("\n") };
}

/** A memo note's text: the coding's own memo field stays and is
    the first line, and what was typed follows it. */
export const memoText = (first: string | null | undefined, typed: string): string =>
  [(first ?? "").trim(), typed.trim()].filter(Boolean).join("\n");

export const memoBody = (text: string): string => text.split("\n").filter(Boolean).map((l) => `<p>${esc(l)}</p>`).join("");

/** The guide's questions with a tick per interview. */
export interface Guide { questions: string[]; asked: Record<string, number[]> }
export const guideOf = (meta: Record<string, unknown>): Guide => ({
  questions: Array.isArray(meta.questions) ? (meta.questions as string[]) : [],
  asked: typeof meta.asked === "object" && meta.asked ? (meta.asked as Record<string, number[]>) : {},
});
