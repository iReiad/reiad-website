/* ============================================================
   /api/survey/<token>: the public half of a field room survey.
   RESEARCH.md section 15.

   GET  /api/survey/<token>   the form: title, intro, questions, open
   POST /api/survey/<token>   a stranger's answers, throttled

   It takes no bearer on purpose: a stranger with the link is who a
   survey is for. It reads one row of D1 by an unguessable token
   and writes one row of answers checked against the questions,
   throttled per address, and it knows nothing about who answered.
   The owner's half, publishing and collecting, is under
   /api/research/survey and reads the reader first.
   ============================================================ */

import { json } from "../../_lib/http.ts";
import { throttle } from "../../_lib/auth.ts";
import type { AuthContext } from "../../_lib/auth.ts";
import { db } from "../../_lib/db.ts";
import { respond, surveyForm } from "../../_lib/field.ts";

type Context = AuthContext & { params: { route?: string[] } };

/** Twenty answers a quarter hour from one address is a household;
    more is a script filling a form in. */
const ANSWERS = 20;

export async function onRequest(context: Context): Promise<Response> {
  const { request } = context;
  const token = context.params.route?.[0] ?? "";
  const d1 = await db(context.env);
  if (!d1) return json({ ok: false, reason: "not-configured" }, 503);
  const form = await surveyForm(d1, token);
  if (!form) return json({ ok: false, reason: "not-found" }, 404);
  if (request.method === "GET") {
    return json({ ok: true, title: form.title, intro: form.intro, questions: JSON.parse(form.questions) as unknown, open: Boolean(form.open) });
  }
  if (request.method === "POST") {
    if (!form.open) return json({ ok: false, reason: "closed" }, 410);
    if (await throttle(context, "survey", ANSWERS, 15)) return json({ ok: false, reason: "slow-down" }, 429);
    let raw: Record<string, unknown>;
    try { raw = await request.json() as Record<string, unknown>; } catch { return json({ ok: false, reason: "bad-json" }, 400); }
    if (!raw || typeof raw !== "object") return json({ ok: false, reason: "bad-json" }, 400);
    const answers = await respond(d1, form, raw);
    return json({ ok: true, answers }, 201);
  }
  return json({ ok: false, reason: "method" }, 405);
}
