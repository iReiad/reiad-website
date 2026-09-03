"use client";

/* ============================================================
   research/ask.tsx: the assistant. RESEARCH.md section 21.

   A task is picked from the list, given what it needs out of the
   studio's own rows, and sent through the Worker with the reader's
   bearer; the answer streams in, its [@key] marks become chips
   where the library holds the key and a strike-through with a
   search where it does not, and the whole answer is kept as a note
   of kind `assistant` with the prompt, the model, the context ids
   and the cost on it. Nothing here writes into a draft: copy is
   the insert.

   Two modes. `project` hands the model the studio's rows and the
   project's brief; `fresh` hands it nothing but the pasted text
   and a hostile reviewer's footing, which is the campaign's
   second reader. The prompt library is the seven shipped
   templates and any note of kind `prompt`, with `[MARKS]` filled
   here. "Index my library" is what the semantic search runs on:
   the rows chunked, embedded through the Worker and stored as the
   reader, so the RPC that finds them runs under row-level security.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { toneVar } from "@reiad/shared/research";
import {
  ASSISTANT_MODES, FRESH_SYSTEM, GBP_PER_USD, PROMPT_TEMPLATES, SYSTEM, TASKS, chunkText, costOf, fillPrompt, gbp, groundAnswer, placeholdersOf, pounds, taskOf,
  type AssistantMode, type ChunkKind, type Task,
} from "@reiad/shared/research-assist";
import { prisma } from "@reiad/shared/research-review";
import {
  addNote, askAssistant, chunkHref, embedTexts, getDocument, getPrefs, listChunks, listCodes, listDocuments, listHighlights, listNotes, listProjects, listQuestions, listRecords,
  listReviews, listRuns, listSources, matchChunks, replaceChunks, rows, savePrefs, serviceStatus, type ServiceState,
  type Code, type Document, type Highlight, type Match, type Note, type Project, type Question, type Review, type Run, type Source, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipLink } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";

/** What one call is handed, and the ids that went on the note. */
interface Context { text: string; ids: Record<string, string | string[]>; keys: string[]; source_id?: string | null; title?: string }

const NONE: Context = { text: "", ids: {}, keys: [] };
const cite = (s: Source): string => `[@${s.key}] ${s.authors} (${s.year ?? "n.d."}). ${s.title}.`;
const escapeHtml = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const monthStart = (): string => new Date().toISOString().slice(0, 7);
const spent = (notes: Note[]): number =>
  notes.filter((n) => n.created_at.slice(0, 7) === monthStart()).reduce((sum, n) => sum + (typeof n.meta.usd === "number" ? n.meta.usd : 0), 0);

export function Ask() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [on, setOn] = useState<boolean | null>(null);
  const [services, setServices] = useState<Record<string, ServiceState> | null>(null);
  const [mode, setMode] = useState<AssistantMode>("project");
  const [taskId, setTaskId] = useState("ask");
  const [project, setProject] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [runs, setRuns] = useState<Run[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);
  const [pick, setPick] = useState<Record<string, string>>({});
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState<{ usd: number; model: string; stop: string | null } | null>(null);
  const [failed, setFailed] = useState<string | null>(null);
  const [saved, setSaved] = useState<Note | null>(null);
  const [passages, setPassages] = useState<Match[] | null>(null);
  const [month, setMonth] = useState(0);
  const [copied, setCopied] = useState(false);
  const [template, setTemplate] = useState("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [prompts, setPrompts] = useState<Note[]>([]);
  const [indexing, setIndexing] = useState<string | null>(null);
  const [rebuild, setRebuild] = useState(false);

  const task: Task = taskOf(taskId);

  useEffect(() => {
    if (!w) return;
    void getPrefs(w).then((p) => setOn(Boolean(p.assistant)));
    void serviceStatus().then(setServices);
    void listProjects(w).then(setProjects);
    void listSources(w, { limit: 500 }).then(setSources);
    void listQuestions(w).then(setQuestions);
    void listDocuments(w).then(setDocuments);
    void listReviews(w).then(setReviews);
    void listRuns(w).then(setRuns);
    void listCodes(w).then(setCodes);
    void listNotes(w, { kind: "assistant", limit: 300 }).then((ns) => setMonth(spent(ns)));
    void listNotes(w, { kind: "prompt", limit: 100 }).then(setPrompts);
  }, [w]);

  const keys = useMemo(() => sources.map((s) => s.key), [sources]);
  const canAsk = services?.assistant !== "off" && services?.assistant !== "owner";
  const ownersOnly = services?.assistant === "owner";
  const canEmbed = services?.embed === "on";
  const picked = {
    source: sources.find((s) => s.id === pick.source) ?? null,
    question: questions.find((q) => q.id === pick.question) ?? null,
    document: documents.find((d) => d.id === pick.document) ?? null,
    review: reviews.find((r) => r.id === pick.review) ?? null,
    run: runs.find((r) => r.id === pick.run) ?? null,
  };
  const needsLine = task.id === "summarise" && picked.source !== null && !picked.source.why;
  const textLabel = task.needs === "text" ? "rs.ask.text" : task.needs === "library" || task.needs === "question" || task.id === "strings" ? "rs.ask.yourq" : task.needs === "codebook" ? "rs.ask.segment" : "rs.ask.extra";
  const textRequired = mode === "fresh" || ["text", "library", "codebook"].includes(task.needs) || task.id === "draft";
  const ready = !busy && canAsk && on === true && !needsLine
    && (mode === "fresh" ? text.trim().length > 0
      : task.needs === "source" ? picked.source !== null
        : task.needs === "question" ? picked.question !== null
          : task.needs === "document" ? picked.document !== null
            : task.needs === "review" ? picked.review !== null
              : task.needs === "run" ? picked.run !== null
                : task.needs === "codebook" ? codes.length > 0 && text.trim().length > 0
                  : text.trim().length > 0);

  /* ---- what the task is handed ---- */
  const build = useCallback(async (who: Who): Promise<Context> => {
    if (mode === "fresh") return NONE;
    if (task.needs === "source" && picked.source) {
      const s = picked.source;
      const hl = await listHighlights(who, s.id);
      const lines = [cite(s)];
      if (s.why) lines.push(`Reader's one line: ${s.why}`);
      if (s.abstract) lines.push(`Abstract: ${s.abstract}`);
      if (hl.length) { lines.push("Highlights, in order:"); for (const h of hl) lines.push(`- ${h.page ? `p.${h.page}: ` : ""}${h.quote}${h.note ? ` (note: ${h.note})` : ""} [${h.meaning}]`); }
      return { text: lines.join("\n"), ids: { source: s.id }, keys: [s.key], source_id: s.id, title: s.title };
    }
    if (task.needs === "question" && picked.question) {
      const q = picked.question;
      const lines = [`Question: ${q.text}`];
      if (q.body.note) lines.push(`Note: ${q.body.note}`);
      const used: string[] = [];
      const cited: string[] = [];
      for (const e of q.body.evidence ?? []) {
        const s = sources.find((x) => x.id === e.source_id);
        if (!s) continue;
        used.push(s.id);
        cited.push(s.key);
        lines.push("", `${cite(s)} Stance: ${e.stance}${e.page ? `, p.${e.page}` : ""}`);
        if (e.quote) lines.push(`Quote: ${e.quote}`);
        if (e.note) lines.push(`Note: ${e.note}`);
        if (s.abstract) lines.push(`Abstract: ${s.abstract}`);
        for (const h of (await listHighlights(who, s.id)).slice(0, 20)) lines.push(`- ${h.page ? `p.${h.page}: ` : ""}${h.quote}`);
      }
      return { text: lines.join("\n"), ids: { question: q.id, sources: used }, keys: cited, title: q.text };
    }
    if (task.needs === "document" && picked.document) {
      const d = (await getDocument(who, picked.document.id)) ?? picked.document;
      return { text: `${d.title}\n\n${(d.text || "").slice(0, 60000)}`, ids: { document: d.id }, keys: [], title: d.title };
    }
    if (task.needs === "codebook") {
      const lines = ["Codebook:", ...codes.map((c) => `- ${c.name}: ${c.definition || "(no definition)"}`), "", "Segment:", text];
      return { text: lines.join("\n"), ids: { codes: codes.map((c) => c.id) }, keys: [], title: text.slice(0, 60) };
    }
    if (task.needs === "review" && picked.review) {
      const c = prisma(await listRecords(who, picked.review.id));
      const lines = [`Review: ${picked.review.title} (${picked.review.kind})`, `Identified: ${c.identified}`, `Duplicates removed: ${c.duplicates}`, `Screened: ${c.screened}`,
        `Excluded at title and abstract: ${c.excludedAtTitle}`, `Sought as full text: ${c.soughtFullText}`, `Excluded at full text: ${c.excludedAtFullText}`,
        `Excluded with reasons: ${Object.entries(c.byReason).map(([r, n]) => `${r} ${n}`).join(", ") || "none"}`, `Included: ${c.included}`,
        `Still pending: ${c.pending.title} at title, ${c.pending.fulltext} at full text`, `By database: ${Object.entries(c.byDatabase).map(([d, n]) => `${d} ${n}`).join(", ")}`];
      return { text: lines.join("\n"), ids: { review: picked.review.id }, keys: [], title: picked.review.title };
    }
    if (task.needs === "run" && picked.run) {
      const r = picked.run;
      const out = typeof r.output.apa === "string" ? r.output.apa : JSON.stringify(r.output, null, 1).slice(0, 8000);
      return { text: `Run: ${r.label} (${r.kind})\n${out}`, ids: { run: r.id }, keys: [], title: r.label };
    }
    if (task.needs === "library") {
      if (!canEmbed) { setPassages([]); return { ...NONE, title: text.slice(0, 60) }; }
      const vec = await embedTexts(who, [text.trim()]);
      const found = vec?.[0] ? await matchChunks(who, vec[0], 20) : [];
      setPassages(found);
      const cited: string[] = [];
      const lines = found.map((m) => {
        const s = m.kind === "source" || m.kind === "highlight" ? sources.find((x) => x.id === m.ref_id) : undefined;
        if (s) cited.push(s.key);
        return `${s ? `[@${s.key}] ` : `(${m.kind}: ${m.title}) `}${m.text}`;
      });
      return { text: lines.join("\n\n"), ids: { chunks: found.map((m) => m.id) }, keys: cited, title: text.slice(0, 60) };
    }
    return { ...NONE, title: text.slice(0, 60) };
  }, [mode, task, picked.source, picked.question, picked.document, picked.review, picked.run, codes, sources, text, canEmbed]);

  const run = useCallback(async () => {
    if (!w || !ready) return;
    setBusy(true);
    setAnswer("");
    setResult(null);
    setFailed(null);
    setSaved(null);
    setCopied(false);
    if (task.needs !== "library") setPassages(null);
    try {
      const ctx = await build(w);
      const brief = projects.find((p) => p.id === project);
      const system = mode === "fresh" ? FRESH_SYSTEM
        : brief ? `${SYSTEM}\nThe project: ${brief.name}. ${brief.body.brief ?? brief.body.aims ?? ""}`.trim() : SYSTEM;
      const content = mode === "fresh" ? text.trim()
        : [task.instruction, ctx.text ? `\n---\n${ctx.text}\n---` : "", text.trim() && task.needs !== "codebook" ? `\n${text.trim()}` : ""].join("\n").trim();
      const r = await askAssistant(w, { system, messages: [{ role: "user", content }], effort: task.effort }, (d) => setAnswer((was) => was + d));
      if ("error" in r) { setFailed(r.error); return; }
      const usd = costOf(r.usage, r.model);
      setResult({ usd, model: r.model, stop: r.stop });
      const note = await addNote(w, {
        kind: "assistant",
        title: `${mode === "fresh" ? "Fresh read" : task.name.en}: ${(ctx.title || text).slice(0, 60)}`,
        text: r.text,
        body: `<p>${escapeHtml(r.text).replace(/\n/g, "<br>")}</p>`,
        source_id: ctx.source_id ?? null,
        projects: brief ? [brief.id] : [],
        meta: { task: mode === "fresh" ? "fresh" : task.id, mode, fresh: mode === "fresh", model: r.model, context: ctx.ids, usage: r.usage, usd, gbp: gbp(usd), prompt: content.slice(0, 4000), stop: r.stop },
      });
      if (note) { setSaved(note); setMonth((m) => m + usd); cue("saved"); }
    } finally { setBusy(false); }
  }, [w, ready, build, projects, project, mode, task, text]);

  const copy = useCallback(async () => {
    try { await navigator.clipboard.writeText(answer); setCopied(true); cue("tick"); } catch { setCopied(false); }
  }, [answer]);

  const keepPrompt = useCallback(async () => {
    if (!w || !text.trim()) return;
    const n = await addNote(w, { kind: "prompt", title: text.trim().split("\n")[0].slice(0, 80), text: text.trim(), body: `<p>${escapeHtml(text.trim()).replace(/\n/g, "<br>")}</p>` });
    if (n) { setPrompts((was) => [n, ...was]); cue("saved"); }
  }, [w, text]);

  /* ---- the prompt library ---- */
  const templates = useMemo(() => [
    ...PROMPT_TEMPLATES.map((t, i) => ({ id: `t-${i}`, title: t.title[lang], body: t.body })),
    ...prompts.map((n) => ({ id: n.id, title: n.title || n.text.slice(0, 60), body: n.text })),
  ], [prompts, lang]);
  const chosen = templates.find((t) => t.id === template) ?? null;
  const marks = chosen ? placeholdersOf(chosen.body) : [];
  const usePrompt = (): void => {
    if (!chosen) return;
    setText(fillPrompt(chosen.body, values));
    setTemplate("");
    setValues({});
  };

  /* ---- the index ---- */
  const index = useCallback(async () => {
    if (!w || indexing !== null) return;
    setIndexing("…");
    try {
      const have = new Map<string, string>();
      if (!rebuild) for (const c of await listChunks(w)) { const k = `${c.kind}:${c.ref_id}`; if ((have.get(k) ?? "") < c.updated_at) have.set(k, c.updated_at); }
      const fresh = (kind: ChunkKind, ref: string, updated: string): boolean => (have.get(`${kind}:${ref}`) ?? "") < updated;
      const jobs: { kind: ChunkKind; ref: string; title: string; text: string }[] = [];
      const hls = await rows<Pick<Highlight, "source_id" | "page" | "quote" | "note" | "updated_at">>(w, "research_highlights", "select=source_id,page,quote,note,updated_at&order=page.asc.nullsfirst,created_at.asc&limit=5000");
      for (const s of await listSources(w, { limit: 2000 })) {
        const mine = hls.filter((h) => h.source_id === s.id);
        const latest = mine.reduce((m, h) => (h.updated_at > m ? h.updated_at : m), s.updated_at);
        if (!fresh("source", s.id, latest)) continue;
        const body = [cite(s), s.why ? `Reader's one line: ${s.why}` : "", s.abstract ?? "", ...mine.map((h) => `${h.page ? `p.${h.page}: ` : ""}${h.quote}${h.note ? ` (${h.note})` : ""}`)].filter(Boolean).join("\n\n");
        jobs.push({ kind: "source", ref: s.id, title: s.title, text: body });
      }
      for (const n of await listNotes(w, { limit: 2000 })) {
        if (n.kind === "assistant" || n.kind === "prompt" || !n.text.trim() || !fresh("note", n.id, n.updated_at)) continue;
        jobs.push({ kind: "note", ref: n.id, title: n.title || n.text.slice(0, 60), text: n.text });
      }
      for (const d of await listDocuments(w)) {
        if (!d.text.trim() || !fresh("document", d.id, d.updated_at)) continue;
        jobs.push({ kind: "document", ref: d.id, title: d.title, text: d.text });
      }
      if (!jobs.length) { setIndexing(both("rs.ask.index.uptodate")); return; }
      const pieces = jobs.flatMap((j, at) => chunkText(j.text).slice(0, 40).map((t, part) => ({ at, part, text: t })));
      const vectors: number[][] = [];
      for (let i = 0; i < pieces.length; i += 100) {
        const got = await embedTexts(w, pieces.slice(i, i + 100).map((p) => p.text));
        if (!got) { setIndexing(both("rs.ask.failed")); return; }
        vectors.push(...got);
        setIndexing(`${Math.min(i + 100, pieces.length)} / ${pieces.length}`);
      }
      let done = 0;
      for (const [at, j] of jobs.entries()) {
        const mine = pieces.map((p, i) => ({ ...p, vector: vectors[i] })).filter((p) => p.at === at);
        done += await replaceChunks(w, j.kind, j.ref, mine.map((p) => ({ part: p.part, title: j.title, text: p.text, embedding: p.vector })));
      }
      setIndexing(`${jobs.length} ${both("rs.ask.index.done")} · ${done}`);
      cue("saved");
    } catch { setIndexing(both("rs.ask.failed")); }
  }, [w, indexing, rebuild]);

  if (!w) return <SignedOut answered={answered} />;

  const grounded = groundAnswer(answer, keys);
  const byKey = new Map(sources.map((s) => [s.key, s.id]));

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-t1 text-ink-soft mr-auto"><W k="rs.ask.hint" /></p>
        <label className="flex items-center gap-2 text-t2">
          <input id="rs-ask-on" type="checkbox" checked={on === true} disabled={on === null}
                 onChange={(e) => { setOn(e.target.checked); void savePrefs(w, { assistant: e.target.checked }).then(() => cue("saved")); }} />
          <span><W k="rs.ask.switch" /></span>
        </label>
        <span className="text-t1 mono text-ink-soft" data-testid="rs-ask-cost"><W k="rs.ask.month" /> {pounds(month)}</span>
      </div>
      {ownersOnly ? <p className="text-t2 text-ink-soft" data-testid="rs-ask-owner"><W k="rs.ask.owner" /></p>
        : !canAsk ? <p className="text-t2 text-ink-soft" data-testid="rs-ask-notconnected"><W k="rs.ask.notconnected" /></p> : null}
      {on === false ? <p className="text-t2 text-ink-soft" data-testid="rs-ask-off"><W k="rs.ask.off" /> <Link href="/tools/research/settings"><W k="rs.ask.settings" /></Link></p> : null}

      <div className="grid gap-4 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] items-start">
        {/* ---- the task and what it is handed ---- */}
        <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3" accent={toneVar("teal")}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Select id="rs-ask-mode" label={<W k="rs.ask.mode" />} value={mode} onChange={(e) => setMode(e.target.value as AssistantMode)}>
              {ASSISTANT_MODES.map((m) => <option key={m} value={m}>{both(`rs.ask.mode.${m}`)}</option>)}
            </Select>
            <Select id="rs-ask-project" label={<W k="rs.ask.project" />} value={project} onChange={(e) => setProject(e.target.value)} disabled={mode === "fresh"}>
              <option value="">{both("rs.ask.project.none")}</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
          </div>
          {mode === "fresh" ? <p className="text-t1 text-ink-soft"><W k="rs.ask.mode.fresh.hint" /></p> : (
            <>
              <Select id="rs-ask-task" label={<W k="rs.ask.task" />} value={taskId} onChange={(e) => { setTaskId(e.target.value); setPassages(null); }}>
                {TASKS.map((t) => <option key={t.id} value={t.id}>{t.name[lang]}</option>)}
              </Select>
              {task.needs === "source" ? (
                <Select id="rs-ask-source" label={<W k="rs.ask.source" />} value={pick.source ?? ""} onChange={(e) => setPick((p) => ({ ...p, source: e.target.value }))}>
                  <option value="">{both("rs.ask.pick")}</option>
                  {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                </Select>
              ) : null}
              {task.needs === "question" ? (
                <Select id="rs-ask-question" label={<W k="rs.ask.question" />} value={pick.question ?? ""} onChange={(e) => setPick((p) => ({ ...p, question: e.target.value }))}>
                  <option value="">{both("rs.ask.pick")}</option>
                  {questions.map((q) => <option key={q.id} value={q.id}>{q.text}</option>)}
                </Select>
              ) : null}
              {task.needs === "document" ? (
                <Select id="rs-ask-document" label={<W k="rs.ask.document" />} value={pick.document ?? ""} onChange={(e) => setPick((p) => ({ ...p, document: e.target.value }))}>
                  <option value="">{both("rs.ask.pick")}</option>
                  {documents.map((d) => <option key={d.id} value={d.id}>{d.title}</option>)}
                </Select>
              ) : null}
              {task.needs === "review" ? (
                <Select id="rs-ask-review" label={<W k="rs.ask.review" />} value={pick.review ?? ""} onChange={(e) => setPick((p) => ({ ...p, review: e.target.value }))}>
                  <option value="">{both("rs.ask.pick")}</option>
                  {reviews.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </Select>
              ) : null}
              {task.needs === "run" ? (
                <Select id="rs-ask-run" label={<W k="rs.ask.run" />} value={pick.run ?? ""} onChange={(e) => setPick((p) => ({ ...p, run: e.target.value }))}>
                  <option value="">{both("rs.ask.pick")}</option>
                  {runs.map((r) => <option key={r.id} value={r.id}>{r.label} · {r.kind}</option>)}
                </Select>
              ) : null}
              {task.needs === "codebook" && !codes.length ? <p className="text-t1 text-ink-soft"><W k="rs.ask.codes.none" /> <Link href="/tools/research/field"><W k="rs.ask.field" /></Link></p> : null}
              {task.needs === "codebook" && codes.length ? <ul className="flex flex-wrap gap-1">{codes.map((c) => <li key={c.id}><Chip tone="quiet">{c.name}</Chip></li>)}</ul> : null}
              {task.needs === "library" && !canEmbed ? <p className="text-t1 text-ink-soft"><W k="rs.ask.embed.off" /></p> : null}
              {needsLine && picked.source ? (
                <p className="text-t1 text-ink-soft" data-testid="rs-ask-needs-line"><W k="rs.ask.needs.line" /> <Link href={`/tools/research/library/${picked.source.id}`}>{picked.source.title}</Link></p>
              ) : null}
            </>
          )}
          <TextArea id="rs-ask-q" label={<W k={mode === "fresh" ? "rs.ask.text" : textLabel} />} value={text} onChange={(e) => setText(e.target.value)} rows={mode === "fresh" || task.needs === "text" ? 8 : 3}
                    required={textRequired} />
          <div className="flex flex-wrap items-center gap-2">
            {on === true ? <Button type="button" kind="solid" disabled={!ready} onClick={() => { void run(); }}>{busy ? <W k="rs.ask.thinking" /> : <W k="rs.ask.go" />}</Button> : null}
            <Button type="button" kind="ghost" size="sm" disabled={!text.trim()} onClick={() => { void keepPrompt(); }}><W k="rs.ask.prompts.keep" /></Button>
            <span className="text-t1 text-ink-soft mono ml-auto">{task.effort}</span>
          </div>

          <details className="grid gap-2">
            <summary className="text-t2 font-medium cursor-pointer"><W k="rs.ask.prompts" /></summary>
            <p className="text-t1 text-ink-soft"><W k="rs.ask.prompts.hint" /></p>
            <Select id="rs-ask-template" label={<W k="rs.ask.prompts" />} hideLabel value={template} onChange={(e) => { setTemplate(e.target.value); setValues({}); }}>
              <option value="">{both("rs.ask.pick")}</option>
              {templates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
            </Select>
            {chosen ? (
              <div className="grid gap-2" data-testid="rs-ask-marks">
                <p className="text-t1 whitespace-pre-wrap">{chosen.body}</p>
                {marks.map((m) => (
                  <Field key={m} id={`rs-ask-ph-${m.replace(/\W/g, "_")}`} label={m} value={values[m] ?? ""} onChange={(e) => setValues((v) => ({ ...v, [m]: e.target.value }))} autoComplete="off" />
                ))}
                <div><Button type="button" kind="soft" size="sm" onClick={usePrompt}><W k="rs.ask.prompts.use" /></Button></div>
              </div>
            ) : null}
          </details>
        </Surface>

        {/* ---- the answer ---- */}
        <Surface material="pane" className="px-5 py-4 grid gap-3 min-h-64">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-t3 font-medium mr-auto"><W k="rs.ask.answer" /></h2>
            {answer ? <Button type="button" kind="ghost" size="sm" onClick={() => { void copy(); }}>{copied ? <W k="rs.ask.copied" /> : <W k="rs.ask.copy" />}</Button> : null}
          </div>
          {answer ? (
            <div className="text-t2 leading-relaxed whitespace-pre-wrap" data-testid="rs-ask-answer" aria-live="polite">
              {grounded.pieces.map((p, i) => p.key ? (
                p.known ? <ChipLink key={i} href={`/tools/research/library/${byKey.get(p.key) ?? ""}`}>{p.key}</ChipLink>
                  : <span key={i} className="inline-flex items-baseline gap-1"><s>{p.key}</s> <span className="text-t1 text-ink-soft"><W k="rs.ask.unknown" /></span> <Link className="text-t1" href={`/tools/research/find?q=${encodeURIComponent(p.key)}`}><W k="rs.ask.search" /></Link></span>
              ) : <span key={i}>{p.text}</span>)}
            </div>
          ) : <p className="text-t2 text-ink-soft"><W k={busy ? "rs.ask.thinking" : "rs.ask.answer.empty"} /></p>}
          {failed ? <p className="text-t2" role="alert" style={{ color: toneVar("rose") } as CSSProperties}><W k={failed === "too-many" ? "rs.ask.failed.limit" : "rs.ask.failed"} /> <span className="mono">{failed}</span></p> : null}
          {result ? (
            <p className="text-t1 text-ink-soft mono flex flex-wrap gap-3" data-testid="rs-ask-result">
              <span><W k="rs.ask.cost" /> {pounds(result.usd)} ({result.model})</span>
              {result.stop === "max_tokens" ? <span><W k="rs.ask.stopped" /></span> : null}
              {saved ? <Link href={`/tools/research/notes/${saved.id}`}><W k="rs.ask.kept" /></Link> : null}
            </p>
          ) : null}
          {grounded.unknown.length ? <p className="text-t1 text-ink-soft"><W k="rs.ask.unknown.hint" /></p> : null}
          {passages ? (
            <div className="grid gap-1">
              <h3 className="text-t2 font-medium"><W k="rs.ask.passages" /></h3>
              {passages.length ? (
                <ol className="rs-rows grid gap-1" data-testid="rs-ask-passages">
                  {passages.map((m) => (
                    <li key={m.id}>
                      <Link href={chunkHref(m.kind, m.ref_id)} className="rs-row">
                        <span className="rs-row-main"><span className="rs-row-title">{m.title}</span><span className="rs-row-sub">{m.text.slice(0, 220)}</span></span>
                        <span className="rs-row-meta mono">{Math.round(m.similarity * 100)}%</span>
                      </Link>
                    </li>
                  ))}
                </ol>
              ) : <p className="text-t1 text-ink-soft"><W k="rs.ask.passages.none" /></p>}
            </div>
          ) : null}
        </Surface>
      </div>

      {/* ---- the index ---- */}
      <Surface material="pane" className="px-5 py-4 grid gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-t3 font-medium mr-auto"><W k="rs.ask.index" /></h2>
          <label className="flex items-center gap-2 text-t1"><input id="rs-ask-rebuild" type="checkbox" checked={rebuild} onChange={(e) => setRebuild(e.target.checked)} /><span><W k="rs.ask.index.rebuild" /></span></label>
          <Button type="button" kind="soft" size="sm" disabled={!canEmbed || indexing === "…" || indexing?.includes("/") === true} onClick={() => { void index(); }} data-testid="rs-ask-index"><W k="rs.ask.index" /></Button>
        </div>
        <p className="text-t1 text-ink-soft"><W k="rs.ask.index.hint" /> {canEmbed ? null : <W k="rs.ask.embed.off" />}</p>
        {indexing ? <p className="text-t2 mono" role="status" data-testid="rs-ask-indexed">{indexing}</p> : null}
        <p className="text-t1 text-ink-soft"><T en={`Prices are the model's published ones, converted at ${GBP_PER_USD} pounds a dollar.`} bn={`দাম মডেলের প্রকাশিত দাম, ডলারে ${GBP_PER_USD} পাউন্ড ধরে।`} /></p>
      </Surface>
    </div>
  );
}
