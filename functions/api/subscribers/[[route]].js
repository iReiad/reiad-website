/* ============================================================
   /api/subscribers: the list you own.

   Confirmed opt-in only. Signing up stores a pending row and a
   token; the address doesn't count as a subscriber until that
   token comes back. No tracking pixels, no open tracking, and a
   one-click unsubscribe that doesn't ask why.

   POST /api/subscribers            { email }  → pending + token
   GET  /api/subscribers/confirm?t= → confirmed
   GET  /api/subscribers/remove?t=  → unsubscribed
   GET  /api/subscribers            admin: the list
   GET  /api/subscribers/export     admin: CSV

   NOTE: sending mail needs an email provider, which is a separate
   account and out of this site's hands. Everything up to the send
   is here, including the confirm link, so plugging one in later
   is a small job, and the list is yours in the meantime.
   ============================================================ */

import { all, db, one, run } from "../../_lib/db.js";
import { body, fail, isEmail, methods, notConfigured, ok, str, nowISO } from "../../_lib/http.ts";
import { requireAdmin, throttle } from "../../_lib/auth.js";

const token = () =>
  btoa(String.fromCharCode(...crypto.getRandomValues(new Uint8Array(18))))
    .replace(/[+/=]/g, "");

/** Confirm and unsubscribe links are clicked in a browser, so they
    answer with a page rather than JSON. */
const page = (title, message, tone = "ok") =>
  new Response(
    `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark"><title>${title}, Reiad's Library</title>
<link rel="stylesheet" href="/styles.css"><link rel="icon" href="/favicon.ico">
</head><body><main id="main"><div class="wrap" style="padding-block:110px;max-width:640px">
<span class="eyebrow mono">${tone === "ok" ? "Done" : "Hmm"}</span>
<h1 style="font-size:2rem">${title}</h1>
<p class="lede">${message}</p>
<p style="margin-top:26px"><a class="btn btn-solid" href="/insights.html">Read something →</a></p>
</div></main></body></html>`,
    { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } }
  );

export async function onRequest(context) {
  const { request, params } = context;
  const route = (params.route ?? [])[0] ?? "";
  const url = new URL(request.url);

  const d1 = await db(context.env);
  if (!d1) return notConfigured();

  /* ---------- confirm ---------- */
  if (route === "confirm") {
    const t = str(url.searchParams.get("t"), 40);
    const row = t && await one(d1, `SELECT * FROM subscribers WHERE token = ?`, t);
    if (!row) return page("That link has expired", "Sign up again and I'll send a fresh one.", "err");
    await run(d1,
      `UPDATE subscribers SET status = 'confirmed', confirmed_at = ? WHERE token = ?`,
      nowISO(), t);
    return page("You're on the list",
      "You'll hear from me when something new is published, and nothing else. " +
      "Every email has a one-click unsubscribe that works immediately.");
  }

  /* ---------- unsubscribe ---------- */
  if (route === "remove") {
    const t = str(url.searchParams.get("t"), 40);
    if (t) await run(d1, `UPDATE subscribers SET status = 'unsubscribed' WHERE token = ?`, t);
    return page("Unsubscribed",
      "You won't hear from me again. No hard feelings, and no confirmation email about " +
      "the confirmation: that's the whole point.");
  }

  /* ---------- CSV export ---------- */
  if (route === "export") {
    const guard = await requireAdmin(context);
    if (guard) return guard;
    const rows = await all(d1,
      `SELECT email, status, lang, source, created_at, confirmed_at
       FROM subscribers ORDER BY created_at DESC`);
    const csv = ["email,status,lang,source,created_at,confirmed_at"]
      .concat(rows.map((r) =>
        [r.email, r.status, r.lang, r.source, r.created_at, r.confirmed_at ?? ""]
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`).join(",")))
      .join("\n");
    return new Response(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="subscribers-${nowISO().slice(0, 10)}.csv"`,
        "Cache-Control": "no-store",
      },
    });
  }

  /* ---------- sign up / list ---------- */
  return methods(request, {
    POST: async () => {
      if (await throttle(context, "subscribe", 5, 60)) return fail("too-many", 429);

      const input = await body(request);
      if (str(input.website, 100)) return ok({ pending: true });   // honeypot
      const email = str(input.email, 200).toLowerCase();
      if (!isEmail(email)) return fail("bad-email");

      const existing = await one(d1, `SELECT status, token FROM subscribers WHERE email = ?`, email);
      if (existing?.status === "confirmed") return ok({ already: true });

      const t = existing?.token ?? token();
      await run(d1,
        `INSERT INTO subscribers (email, token, status, lang, source, created_at)
         VALUES (?, ?, 'pending', ?, ?, ?)
         ON CONFLICT(email) DO UPDATE SET status = 'pending', token = excluded.token`,
        email, t, input.lang === "bn" ? "bn" : "en", str(input.source, 120), nowISO());

      // Until an email provider is connected, the confirm link comes
      // straight back so the flow is complete and testable.
      const origin = context.env.SITE_ORIGIN || url.origin;
      return ok({ pending: true, confirmUrl: `${origin}/api/subscribers/confirm?t=${t}` });
    },

    GET: async () => {
      const guard = await requireAdmin(context);
      if (guard) return guard;
      const rows = await all(d1,
        `SELECT email, status, lang, source, created_at, confirmed_at
         FROM subscribers ORDER BY created_at DESC LIMIT 500`);
      const counts = await one(d1,
        `SELECT
           COUNT(*) AS total,
           SUM(status = 'confirmed') AS confirmed,
           SUM(status = 'pending') AS pending
         FROM subscribers`);
      return ok({ subscribers: rows, counts });
    },
  });
}
