"use client";

/* ============================================================
   research/survey-form.tsx: a survey, as a stranger sees it.
   RESEARCH.md section 15.

   Reads the form from /api/survey/<token> with no bearer, draws a
   consent gate first, every question in both languages, and posts
   the answers to the same address. Nothing about who answered is
   asked or kept.
   ============================================================ */

import { useEffect, useState } from "react";
import type { Answers, SurveyQuestion } from "@reiad/shared/research-field";
import { Button } from "../ui/button";
import { Field, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";

interface Form { title: string; intro: string; questions: SurveyQuestion[]; open: boolean }

export function SurveyForm({ token }: { token: string }) {
  const [form, setForm] = useState<Form | null | undefined>(undefined);
  const [consented, setConsented] = useState(false);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [state, setState] = useState<"filling" | "sending" | "sent" | "failed">("filling");
  useEffect(() => {
    void fetch(`/api/survey/${encodeURIComponent(token)}`).then(async (r) => {
      const data = await r.json() as { ok: boolean } & Form;
      setForm(r.ok && data.ok ? { title: data.title, intro: data.intro, questions: data.questions, open: data.open } : null);
    }).catch(() => setForm(null));
  }, [token]);
  const set = (id: string, v: unknown): void => setAnswers((was) => ({ ...was, [id]: v }));
  const send = async (): Promise<void> => {
    setState("sending");
    try {
      const r = await fetch(`/api/survey/${encodeURIComponent(token)}`, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(answers) });
      setState(r.ok ? "sent" : "failed");
    } catch { setState("failed"); }
  };
  if (form === undefined) return <p className="text-t2 text-ink-soft" role="status">…</p>;
  if (form === null) return <p className="text-t2">No such survey / এমন কোনো জরিপ নেই।</p>;
  if (!form.open) return <p className="text-t2">This survey is closed. Thank you. / এই জরিপ বন্ধ। ধন্যবাদ।</p>;
  if (state === "sent") return <Surface material="pane" className="px-4 py-4"><p className="text-t2">Thank you. Your answers were received. / ধন্যবাদ। আপনার উত্তর পাওয়া গেছে।</p></Surface>;
  const missing = form.questions.filter((q) => q.required && (answers[q.id] === undefined || answers[q.id] === "" || (Array.isArray(answers[q.id]) && !(answers[q.id] as unknown[]).length)));
  return (
    <form className="grid gap-4" data-testid="rs-survey" onSubmit={(e) => { e.preventDefault(); if (consented && !missing.length) void send(); }}>
      <h1 className="text-t4 font-medium">{form.title}</h1>
      {form.intro ? <p className="text-t2 whitespace-pre-wrap">{form.intro}</p> : null}
      <Surface material="sunk" className="px-4 py-3">
        <label className="flex items-start gap-2 text-t2">
          <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} />
          <span>I have read the note above and consent to take part. My answers are anonymous. / আমি ওপরের কথাগুলো পড়েছি এবং অংশ নিতে সম্মত। আমার উত্তর বেনামি।</span>
        </label>
      </Surface>
      {form.questions.map((q, i) => (
        <Surface key={q.id} material="pane" className="px-4 py-3 grid gap-2">
          <p className="text-t2"><span className="text-ink-soft tabular-nums">{i + 1}. </span>{q.en}{q.required ? " *" : ""}<br /><span lang="bn">{q.bn}</span></p>
          {q.type === "likert" ? (
            <div className="flex flex-wrap gap-3" role="radiogroup">
              {[1, 2, 3, 4, 5].map((n) => <label key={n} className="flex items-center gap-1 text-t1"><input type="radio" name={q.id} value={n} checked={answers[q.id] === n} onChange={() => set(q.id, n)} />{n}</label>)}
              <span className="text-t1 text-ink-soft">1 = disagree / অসম্মত · 5 = agree / সম্মত</span>
            </div>
          ) : q.type === "choice" ? (
            <div className="grid gap-1">
              {(q.options ?? []).map((o) => <label key={o.en} className="flex items-center gap-2 text-t1"><input type="radio" name={q.id} value={o.en} checked={answers[q.id] === o.en} onChange={() => set(q.id, o.en)} />{o.en}{o.bn !== o.en ? ` / ${o.bn}` : ""}</label>)}
            </div>
          ) : q.type === "multi" ? (
            <div className="grid gap-1">
              {(q.options ?? []).map((o) => {
                const held = Array.isArray(answers[q.id]) ? (answers[q.id] as string[]) : [];
                return <label key={o.en} className="flex items-center gap-2 text-t1"><input type="checkbox" checked={held.includes(o.en)} onChange={(e) => set(q.id, e.target.checked ? [...held, o.en] : held.filter((x) => x !== o.en))} />{o.en}{o.bn !== o.en ? ` / ${o.bn}` : ""}</label>;
              })}
            </div>
          ) : q.type === "number" ? (
            <Field id={`sv-${q.id}`} hideLabel label={q.en} inputMode="decimal" value={String(answers[q.id] ?? "")} onChange={(e) => set(q.id, e.target.value)} autoComplete="off" />
          ) : (
            <TextArea id={`sv-${q.id}`} hideLabel label={q.en} value={String(answers[q.id] ?? "")} onChange={(e) => set(q.id, e.target.value)} rows={3} />
          )}
        </Surface>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" kind="solid" disabled={!consented || Boolean(missing.length) || state === "sending"}>Send / পাঠান</Button>
        {state === "failed" ? <span className="text-t1 text-danger" role="alert">That did not send. Please try again. / পাঠানো যায়নি। আবার চেষ্টা করুন।</span> : null}
      </div>
    </form>
  );
}
