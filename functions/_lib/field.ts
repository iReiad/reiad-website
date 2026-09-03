/* ============================================================
   functions/_lib/field.ts: the field room's Worker half.
   RESEARCH.md section 15.

   Transcription is Workers AI on the `AI` binding, which
   wrangler.toml explains is turned on in the dashboard rather than
   declared; without it the room says so and the reader types.
   Surveys are the one thing that lives in D1: the form a stranger
   reads with no bearer, and the answers the throttled public
   endpoint writes, because the Worker cannot insert into Supabase
   as nobody and this project holds no key that would let it.
   ============================================================ */

import type { D1Database } from "./db.ts";
import type { SurveyFormRow, SurveyResponseRow } from "../../shared/rows.ts";
import { cleanAnswers, segmentsFromModel, type Answers, type Segment, type SurveyQuestion } from "../../shared/research-field.ts";

interface Ai { run: (model: string, input: Record<string, unknown>) => Promise<unknown> }
export interface AiEnv { AI?: Ai }

export const canTranscribe = (env: AiEnv): boolean => Boolean(env.AI);

/** Whisper large-v3-turbo on the bytes of one file, as segments.
    The model's answer is a service's, so it is narrowed rather
    than believed: an unknown shape becomes plain text split
    evenly, never a thrown page. */
export async function transcribe(env: AiEnv, bytes: ArrayBuffer, language: string | null): Promise<{ segments: Segment[]; text: string } | null> {
  if (!env.AI) return null;
  const b64 = btoa(String.fromCharCode(...new Uint8Array(bytes)));
  const answer = await env.AI.run("@cf/openai/whisper-large-v3-turbo", { audio: b64, ...(language ? { language } : {}) }) as Record<string, unknown> | null;
  if (!answer || typeof answer !== "object") return null;
  const text = typeof answer.text === "string" ? answer.text : "";
  const segments = segmentsFromModel({
    text,
    segments: Array.isArray(answer.segments) ? (answer.segments as { start?: number; end?: number; text?: string }[]) : undefined,
    vtt: typeof answer.vtt === "string" ? answer.vtt : undefined,
  });
  return { segments, text };
}

/* ---------- surveys in D1 ---------- */

export const TOKEN = /^[a-f0-9]{22}$/;

export async function publishSurvey(d1: D1Database, owner: string, s: { token: string; title: string; intro: string; questions: SurveyQuestion[]; open: boolean }): Promise<void> {
  await d1.prepare(
    "INSERT INTO survey_forms (token, owner, title, intro, questions, open, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    + " ON CONFLICT(token) DO UPDATE SET title = excluded.title, intro = excluded.intro, questions = excluded.questions, open = excluded.open",
  ).bind(s.token, owner, s.title, s.intro, JSON.stringify(s.questions), s.open ? 1 : 0, new Date().toISOString()).run();
}

export async function surveyForm(d1: D1Database, token: string): Promise<SurveyFormRow | null> {
  if (!TOKEN.test(token)) return null;
  return d1.prepare("SELECT * FROM survey_forms WHERE token = ?").bind(token).first<SurveyFormRow>();
}

/** A stranger's answers, checked against the questions. */
export async function respond(d1: D1Database, form: SurveyFormRow, raw: Record<string, unknown>): Promise<Answers> {
  const questions = JSON.parse(form.questions) as SurveyQuestion[];
  const answers = cleanAnswers(questions, raw);
  await d1.prepare("INSERT INTO survey_responses (token, answers, created_at) VALUES (?, ?, ?)")
    .bind(form.token, JSON.stringify(answers), new Date().toISOString()).run();
  return answers;
}

/** The owner's read: every response, oldest first. */
export async function responsesOf(d1: D1Database, owner: string, token: string): Promise<{ answers: Answers; at: string }[] | null> {
  const form = await surveyForm(d1, token);
  if (!form || form.owner !== owner) return null;
  const rows = await d1.prepare("SELECT * FROM survey_responses WHERE token = ? ORDER BY id ASC").bind(token).all<SurveyResponseRow>();
  return (rows.results ?? []).map((r: SurveyResponseRow) => ({ answers: JSON.parse(r.answers) as Answers, at: r.created_at }));
}

export async function closeSurvey(d1: D1Database, owner: string, token: string, open: boolean): Promise<boolean> {
  const form = await surveyForm(d1, token);
  if (!form || form.owner !== owner) return false;
  await d1.prepare("UPDATE survey_forms SET open = ? WHERE token = ?").bind(open ? 1 : 0, token).run();
  return true;
}
