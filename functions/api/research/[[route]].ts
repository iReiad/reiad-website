/* ============================================================
   /api/research/*: the Research Studio's Worker surface.

   GET  /api/research/status              which indexes are on
   GET  /api/research/lookup/doi/<doi>    one record, verified
   GET  /api/research/lookup/isbn/<isbn>  one book
   GET  /api/research/lookup/url?u=       a page's own tags (the clipper)
   GET  /api/research/lookup/ref?q=       a messy reference matched by Crossref (the workshop)
   GET  /api/research/lookup/journals?q=  journals by name or concept, from OpenAlex
   GET  /api/research/lookup/journal/<issn>   one journal's DOAJ record
   POST /api/research/zotero/pull         a page of somebody's Zotero library

   And the reading room's files, RESEARCH.md section 23, every one
   of them the signed-in reader's own and under their prefix:

   GET    /api/research/files            what the reader holds, against the quota
   PUT    /api/research/file?name=       store one file, answer its key
   GET    /api/research/ticket/<key>     a thirty-minute pass for one file
   GET    /api/research/file/<key>?t=    the bytes, whole or a Range, on that pass
   DELETE /api/research/files            everything under the prefix (the erase)
   POST   /api/research/capture          a web page, fetched, cleaned and stored

   And Finding, RESEARCH.md section 10, every one for a signed-in
   reader because each spends a key's allowance:

   GET    /api/research/search?q=&author=&from=&to=&oa=1&type=&db=a,b
   GET    /api/research/related/<doi>    OpenAlex's three lists
   GET    /api/research/oa/<doi>         a free copy, through Unpaywall
   GET    /api/research/market/<symbol>?full=1   a daily series, through Alpha Vantage (section 14)
   GET    /api/research/climate?lat=&lon=&from=&to=   daily temperature and rain at a point, through Open-Meteo's archive (section 36)
   POST   /api/research/transcribe      one stored audio file, through Workers AI (section 15)
   POST   /api/research/assistant       a task for the model, streamed back as it answers (section 21)
   POST   /api/research/embed           embeddings for the semantic search, through Workers AI
   PUT    /api/research/survey          a survey copied to D1 for its public page
   GET    /api/research/survey/<token>/responses   what strangers answered, for the owner
   POST   /api/research/survey/<token>  open or close it
   PUT    /api/research/alerts           a flagged search, copied to D1 for the cron
   DELETE /api/research/alerts/<id>      the flag taken off
   GET    /api/research/alerts/hits      what the cron found, collected and cleared

   And the calendar going OUT (section 17): the browser writes the
   reader's dates as one iCalendar file, and any calendar that has
   the token reads it. The token is long-lived and remade on
   request, and it is the only credential a calendar app ever
   holds, because the studio holds none of theirs.

   PUT    /api/research/calendar         the file, answered with the token
   POST   /api/research/calendar/reset   a new token; the old one stops
   GET    /api/research/ics/<token>      text/calendar, for a subscription

   `RESEARCH.md` sections 10 and 22. This is the WHOLE of the
   studio's Worker surface in stage 1, and the split is the diet
   tool's: the reader's own rows are the browser's, read and
   written as the reader through PostgREST, and somebody else's
   database is the Worker's. Nothing about a reader's rows passes
   through here.

   ---- public on purpose, but for the pull ----

   The lookups take no bearer: they read public indexes and
   answer with a record anybody could fetch, and they are what
   makes the capture box work on the one page of this tool that
   needs no account to be useful. `scripts/check-admin.ts` names
   this file as public with that reason. They are throttled,
   because an anonymous relay to somebody else's service is the
   thing the open internet abuses first.

   The Zotero pull is the exception: it carries the reader's own
   API key in the body for one request and never stores it, and
   it answers only a signed-in reader, because a relay that
   forwards any key it is handed to Zotero is a relay.
   ============================================================ */

import { body, fail, methods, ok, str } from "../../_lib/http.ts";
import type { RouteContext } from "../../_lib/http.ts";
import { throttle } from "../../_lib/auth.ts";
import { readerFrom } from "../../_lib/reader.ts";
import type { ReaderEnv } from "../../_lib/reader.ts";
import { byDoi, byIsbn, clip, status, zoteroPull } from "../../_lib/scholar.ts";
import { canMarket, dailySeries } from "../../_lib/market.ts";
import { CLIMATE_A_MINUTE, climateQuery, dailyClimate } from "../../_lib/climate.ts";
import { checkJournal, findJournals, parseReference } from "../../_lib/workshop.ts";
import { ask, canAssist, canEmbed, embed, MODEL, type AssistantEnv } from "../../_lib/assistant.ts";
import { canTranscribe, closeSurvey, publishSurvey, responsesOf, transcribe, TOKEN, type AiEnv } from "../../_lib/field.ts";
import type { SurveyQuestion } from "../../../shared/research-field.ts";
import type { ScholarEnv } from "../../_lib/scholar.ts";
import { canTicket, checkTicket, mintTicket } from "../../_lib/ticket.ts";
import {
  RESEARCH_TICKET, capturePage, keyIsMine, readFile, removeAll, storeFile, usage,
} from "../../_lib/files.ts";
import type { FilesEnv } from "../../_lib/files.ts";
import type { Reader } from "../../_lib/reader.ts";
import { FILE_CAP, FILE_QUOTA, extOfName } from "../../../shared/research.ts";
import { orcidWorks, related, searchAll, unpaywall } from "../../_lib/scholar-search.ts";
import type { SearchQuery } from "../../_lib/scholar-search.ts";
import { db } from "../../_lib/db.ts";
import { isAdmin } from "../../_lib/admins.ts";
import type { AdminEnv } from "../../_lib/admins.ts";
import type { ResearchAlertHitRow, ResearchCalendarRow } from "../../../shared/rows.ts";

interface ResearchEnv extends ScholarEnv, ReaderEnv, FilesEnv, AiEnv, AssistantEnv, AdminEnv {}

/** A page a minute is a person reading; more is a crawler with a
    bearer, which is still somebody else's server being asked. */
const CAPTURES_A_MINUTE = 20;

/** Thirty federated searches a minute is a person refining a
    query; each one is up to seven requests to other people's
    servers on this site's keys. */
const SEARCHES_A_MINUTE = 30;

/** Generous for a capture box, tight for a relay: sixty lookups
    a minute from one address is a person pasting a reading list,
    six hundred is a script. */
const LOOKUPS_A_MINUTE = 60;

export async function onRequest(
  context: RouteContext<ResearchEnv, { route?: string[] }>,
): Promise<Response> {
  const { request, env, params } = context;
  const route = params.route ?? [];
  const url = new URL(request.url);
  const head = route[0] ?? "";

  if (head === "status") {
    return methods(request, {
      GET: async () => {
        /* The three metered services answer "owner" to anybody who
           is not: on, but not for you. The bearer is optional here
           and a bad one reads as signed out rather than as a 401,
           because the status is asked before a room decides what
           to draw. */
        let owner = false;
        try { const r = await readerFrom(request, env); owner = r ? await isAdmin(env, request, r.id) : false; } catch { owner = false; }
        const metered = (on: boolean): "on" | "off" | "owner" => (!on ? "off" : owner ? "on" : "owner");
        return ok({ services: { ...status(env), files: env.MEDIA && canTicket(env) ? "on" : "off", market: canMarket(env) ? "on" : "off", transcribe: metered(canTranscribe(env)), assistant: metered(canAssist(env)), embed: metered(canEmbed(env)) } });
      },
    });
  }

  /* ---- THE METERED SERVICES ARE THE OWNER'S ----
     The model key, the embeddings and the transcription all spend
     an allowance the site holds, not the reader: a key with a bill
     on it and a Workers AI quota that is one number for the whole
     site. Sign-up is open, so "signed in" alone would let any
     stranger with a Google account spend it at the throttle's
     rate. `isAdmin()` is the one place that decides, as it is for
     the broker's levers. A second reader ever getting the
     assistant means a per-reader key, sealed the way the broker's
     is, not a wider gate here. */
  const ownerOnly = async (reader: Reader): Promise<Response | null> =>
    (await isAdmin(env, request, reader.id)) ? null : fail("owner-only", 403);

  /* ---- the files: every branch reads the reader first ---- */
  const whoAsks = async (): Promise<Reader | Response> => {
    let reader: Reader | null;
    try { reader = await readerFrom(request, env); } catch { return fail("bad-token", 401); }
    return reader ?? fail("signed-out", 401);
  };

  if (head === "files") {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        return ok({ ...(await usage(bucket, reader.id)), cap: FILE_CAP, quota: FILE_QUOTA });
      },
      DELETE: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        return ok({ removed: await removeAll(bucket, reader.id) });
      },
    });
  }

  if (head === "file" && route.length === 1) {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    return methods(request, {
      PUT: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const buffer = await request.arrayBuffer();
        const name = url.searchParams.get("name") ?? "";
        const stored = await storeFile(bucket, reader.id, buffer, request.headers.get("Content-Type") ?? "", extOfName(name));
        if (!stored.ok) return fail(stored.reason, stored.status, stored.extra ?? {});
        return ok({ key: stored.key, ext: stored.ext, size: stored.size, already: stored.already });
      },
    });
  }

  if (head === "file" && route.length > 1) {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    const key = route.slice(1).join("/");
    return methods(request, {
      GET: async () => {
        /* The ticket is the whole of the proof here: a <audio> and
           pdf.js's own fetch carry no bearer. It names one key. */
        if (!await checkTicket(env, key, url.searchParams.get("t"), RESEARCH_TICKET)) {
          return fail("no-ticket", 403);
        }
        return readFile(bucket, key, request.headers.get("Range"));
      },
    });
  }

  if (head === "ticket") {
    const key = route.slice(1).join("/");
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (!keyIsMine(reader.id, key)) return fail("not-yours", 403);
        if (!canTicket(env)) return fail("not-configured", 503);
        const t = await mintTicket(env, key, RESEARCH_TICKET);
        return ok({ url: `/api/research/file/${key}?t=${t}` });
      },
    });
  }

  if (head === "search") {
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (await throttle({ request, env }, "research-search", SEARCHES_A_MINUTE, 1)) return fail("too-many", 429);
        const p = url.searchParams;
        const q = str(p.get("q"), 500).trim();
        if (!q) return fail("missing", 400);
        const query: SearchQuery = {
          q,
          author: str(p.get("author"), 200) || undefined,
          from: Number(p.get("from")) || undefined,
          to: Number(p.get("to")) || undefined,
          oa: p.get("oa") === "1",
          type: str(p.get("type"), 40) || undefined,
          databases: (p.get("db") ?? "").split(",").map((d) => d.trim()).filter(Boolean),
        };
        return ok(await searchAll(env, query));
      },
    });
  }

  if (head === "related") {
    const doi = route.slice(1).join("/");
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const found = await related(env, doi);
        if (!found) return fail("not-found", 404);
        return ok(found);
      },
    });
  }

  /* ---- the assistant, and the embeddings the search runs on ---- */
  if (head === "assistant") {
    return methods(request, {
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const owned = await ownerOnly(reader);
        if (owned) return owned;
        if (!canAssist(env)) return fail("no-key", 503);
        if (await throttle({ request, env }, "research-assistant", 30, 15)) return fail("too-many", 429);
        const sent = await body(request);
        const system = str(sent.system, 20000);
        const messages = Array.isArray(sent.messages) ? (sent.messages as { role?: string; content?: string }[]).filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string").map((m) => ({ role: m.role as "user" | "assistant", content: (m.content ?? "").slice(0, 120000) })) : [];
        if (!messages.length) return fail("missing", 400);
        const effort = (["low", "medium", "high", "xhigh"] as const).find((e) => e === sent.effort) ?? "medium";
        const upstream = await ask(env, { system, messages, effort });
        if (!upstream.ok || !upstream.body) return fail("upstream", 502, { status: upstream.status });
        return new Response(upstream.body, { status: 200, headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-store", "X-Model": MODEL } });
      },
    });
  }

  if (head === "embed") {
    return methods(request, {
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const owned = await ownerOnly(reader);
        if (owned) return owned;
        if (!canEmbed(env)) return fail("no-ai", 503);
        const sent = await body(request);
        const texts = Array.isArray(sent.texts) ? (sent.texts as unknown[]).filter((x): x is string => typeof x === "string" && x.trim().length > 0) : [];
        if (!texts.length) return fail("missing", 400);
        const vectors = await embed(env, texts);
        if (!vectors) return fail("no-ai", 503);
        return ok({ vectors });
      },
    });
  }

  /* ---- the field room: transcription, and the owner's half of a survey ---- */
  if (head === "transcribe") {
    return methods(request, {
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const owned = await ownerOnly(reader);
        if (owned) return owned;
        if (!env.MEDIA) return fail("not-configured", 503);
        if (!canTranscribe(env)) return fail("no-ai", 503);
        const sent = await body(request);
        const key = str(sent.key);
        if (!key || !keyIsMine(reader.id, key)) return fail("not-yours", 403);
        const held = await env.MEDIA.get(key);
        if (!held) return fail("not-found", 404);
        const language = str(sent.language) || null;
        const answer = await transcribe(env, await held.arrayBuffer(), language);
        if (!answer) return fail("no-ai", 503);
        return ok({ segments: answer.segments, text: answer.text });
      },
    });
  }

  if (head === "survey") {
    const d1 = await db(env);
    if (!d1) return fail("not-configured", 503);
    const token = route[1] ?? "";
    if (!token) {
      return methods(request, {
        PUT: async () => {
          const reader = await whoAsks();
          if (reader instanceof Response) return reader;
          const sent = await body(request);
          const t = str(sent.token);
          if (!TOKEN.test(t)) return fail("bad-token", 400);
          const questions = Array.isArray(sent.questions) ? (sent.questions as SurveyQuestion[]).slice(0, 100) : [];
          await publishSurvey(d1, reader.id, { token: t, title: str(sent.title).slice(0, 200), intro: str(sent.intro).slice(0, 4000), questions, open: sent.open !== false });
          return ok({ token: t, url: `/tools/research/survey/${t}` });
        },
      });
    }
    if (route[2] === "responses") {
      return methods(request, {
        GET: async () => {
          const reader = await whoAsks();
          if (reader instanceof Response) return reader;
          const responses = await responsesOf(d1, reader.id, token);
          if (!responses) return fail("not-found", 404);
          return ok({ responses });
        },
      });
    }
    return methods(request, {
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const sent = await body(request);
        const done = await closeSurvey(d1, reader.id, token, sent.open === true);
        return done ? ok({}) : fail("not-found", 404);
      },
    });
  }

  if (head === "market") {
    const symbol = decodeURIComponent(route[1] ?? "");
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (!canMarket(env)) return fail("no-key", 503);
        const series = await dailySeries(env, symbol, url.searchParams.get("full") === "1");
        if (!series) return fail("not-found", 404);
        return ok({ series });
      },
    });
  }

  if (head === "climate") {
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (await throttle({ request, env }, "research-climate", CLIMATE_A_MINUTE, 1)) return fail("too-many", 429);
        const asked = climateQuery(url.searchParams);
        if (!asked) return fail("bad-place", 400);
        const series = await dailyClimate(context, asked);
        if (!series) return fail("no-answer", 502);
        return ok({ series }, { "Cache-Control": "private, max-age=86400" });
      },
    });
  }

  if (head === "orcid") {
    const id = route[1] ?? "";
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const works = await orcidWorks(env, id);
        if (!works) return fail("not-found", 404);
        return ok({ works });
      },
    });
  }

  if (head === "oa") {
    const doi = route.slice(1).join("/");
    return methods(request, {
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const found = await unpaywall(env, doi);
        if (!found) return fail("not-configured", 503);
        return ok(found);
      },
    });
  }

  if (head === "alerts") {
    const d1 = await db(env);
    if (!d1) return fail("not-configured", 503);
    const sub = route[1] ?? "";
    return methods(request, {
      PUT: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const sent = await body(request);
        const id = str(sent.id, 80);
        const query = str(sent.query, 1000).trim();
        if (!id || !query) return fail("missing", 400);
        await d1.prepare(
          "INSERT INTO research_alerts (reader_id, id, query, fields, databases, seen, last_run, created_at)"
          + " VALUES (?, ?, ?, ?, ?, '[]', NULL, ?)"
          + " ON CONFLICT(reader_id, id) DO UPDATE SET query = excluded.query, fields = excluded.fields, databases = excluded.databases",
        ).bind(reader.id, id, query, JSON.stringify(sent.fields ?? {}), JSON.stringify(sent.databases ?? []), new Date().toISOString()).run();
        return ok({ id });
      },
      DELETE: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (!sub) return fail("missing", 400);
        await d1.prepare("DELETE FROM research_alerts WHERE reader_id = ? AND id = ?").bind(reader.id, sub).run();
        await d1.prepare("DELETE FROM research_alert_hits WHERE reader_id = ? AND alert_id = ?").bind(reader.id, sub).run();
        return ok({ id: sub });
      },
      GET: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (sub !== "hits") return fail("not-found", 404);
        const { results } = await d1.prepare("SELECT * FROM research_alert_hits WHERE reader_id = ? ORDER BY id LIMIT 200")
          .bind(reader.id).all<ResearchAlertHitRow>();
        const hits = (results ?? []).map((r) => {
          try { return { alert: r.alert_id, found_at: r.found_at, ...JSON.parse(r.json) }; } catch { return null; }
        }).filter(Boolean);
        const last = results?.length ? results[results.length - 1].id : 0;
        if (last) await d1.prepare("DELETE FROM research_alert_hits WHERE reader_id = ? AND id <= ?").bind(reader.id, last).run();
        return ok({ hits });
      },
    });
  }

  if (head === "calendar") {
    const d1 = await db(env);
    if (!d1) return fail("not-configured", 503);
    const token = (): string => [...crypto.getRandomValues(new Uint8Array(24))].map((b) => b.toString(16).padStart(2, "0")).join("");
    return methods(request, {
      PUT: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        const sent = await body(request);
        const ics = str(sent.ics, 200000);
        if (!ics.startsWith("BEGIN:VCALENDAR")) return fail("not-a-calendar", 400);
        const had = await d1.prepare("SELECT token FROM research_calendar WHERE reader_id = ?").bind(reader.id).first<{ token: string }>();
        const t = had?.token ?? token();
        await d1.prepare(
          "INSERT INTO research_calendar (reader_id, token, ics, updated_at) VALUES (?, ?, ?, ?)"
          + " ON CONFLICT(reader_id) DO UPDATE SET ics = excluded.ics, updated_at = excluded.updated_at",
        ).bind(reader.id, t, ics, new Date().toISOString()).run();
        return ok({ token: t, url: `/api/research/ics/${t}` });
      },
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (route[1] !== "reset") return fail("not-found", 404);
        const t = token();
        await d1.prepare("UPDATE research_calendar SET token = ? WHERE reader_id = ?").bind(t, reader.id).run();
        return ok({ token: t, url: `/api/research/ics/${t}` });
      },
    });
  }

  if (head === "ics") {
    const d1 = await db(env);
    if (!d1) return fail("not-configured", 503);
    const t = route[1] ?? "";
    return methods(request, {
      GET: async () => {
        if (!/^[0-9a-f]{48}$/.test(t)) return fail("not-found", 404);
        const row = await d1.prepare("SELECT ics FROM research_calendar WHERE token = ?").bind(t).first<Pick<ResearchCalendarRow, "ics">>();
        if (!row) return fail("not-found", 404);
        return new Response(row.ics, {
          headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Cache-Control": "private, max-age=300",
            "X-Content-Type-Options": "nosniff",
            "Content-Disposition": "inline; filename=\"research-studio.ics\"",
          },
        });
      },
    });
  }

  if (head === "capture") {
    if (!env.MEDIA) return fail("not-configured", 503);
    const bucket = env.MEDIA;
    return methods(request, {
      POST: async () => {
        const reader = await whoAsks();
        if (reader instanceof Response) return reader;
        if (await throttle({ request, env }, "research-capture", CAPTURES_A_MINUTE, 1)) {
          return fail("too-many", 429);
        }
        const sent = await body(request);
        const address = str(sent.url, 2000);
        if (!address) return fail("missing", 400);
        const got = await capturePage(bucket, reader.id, address);
        if (!got.ok) return fail(got.reason, got.status);
        return ok({ key: got.key, size: got.size, title: got.title, words: got.words, already: got.already });
      },
    });
  }

  if (head === "lookup") {
    return methods(request, {
      GET: async () => {
        /* `throttle` answers true when the caller is OVER the
           line, and only where D1 and a real origin exist: on a
           local dev server it answers false and nothing here
           needs to know. */
        if (await throttle({ request, env }, "research-lookup", LOOKUPS_A_MINUTE, 1)) {
          return fail("too-many", 429);
        }
        const kind = route[1] ?? "";
        if (kind === "doi") {
          const doi = decodeURIComponent(route.slice(2).join("/"));
          const found = await byDoi(env, doi);
          return found ? ok({ found }) : fail("not-found", 404);
        }
        if (kind === "isbn") {
          const found = await byIsbn(env, str(route[2], 40));
          return found ? ok({ found }) : fail("not-found", 404);
        }
        if (kind === "url") {
          const found = await clip(env, str(url.searchParams.get("u"), 2000));
          return found ? ok({ found }) : fail("not-found", 404);
        }
        if (kind === "ref") return ok({ matches: await parseReference(env, str(url.searchParams.get("q"), 500)) });
        if (kind === "journals") return ok({ journals: await findJournals(env, str(url.searchParams.get("q"), 200)) });
        if (kind === "journal") {
          const check = await checkJournal(env, str(route[2], 12));
          return check ? ok({ check }) : fail("bad-issn", 400);
        }
        return fail("not-found", 404);
      },
    });
  }

  if (head === "zotero" && route[1] === "pull") {
    return methods(request, {
      POST: async () => {
        let reader;
        try { reader = await readerFrom(request, env); } catch { return fail("bad-token", 401); }
        if (!reader) return fail("signed-out", 401);
        const sent = await body(request);
        const userId = str(sent.userId, 20).replace(/\D/g, "");
        const key = str(sent.key, 80);
        const start = Math.max(0, Number(sent.start ?? 0) || 0);
        if (!userId || !key) return fail("missing", 400);
        try {
          const page = await zoteroPull(userId, key, start);
          return ok({ page });
        } catch (e) {
          const reason = e instanceof Error ? e.message : "zotero";
          return fail(/403|401/.test(reason) ? "zotero-refused" : "zotero-failed", 502);
        }
      },
    });
  }

  return fail("not-found", 404);
}
