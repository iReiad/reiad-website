"use client";

/* ============================================================
   research/questions.tsx: the argument of the project, as a
   tree.

   `RESEARCH.md` section 8. A question is a row with a parent:
   the research question at the top, hypotheses under it, claims
   under those. Each carries evidence, and evidence is a pointer
   at a source with a stance and a page, never a typed reference.

   A patch to the body is always a WHOLE body, because PostgREST
   replaces a jsonb column rather than merging: `patchBody` builds
   it from the row the last write returned. The desk's lesson,
   and its test carried forward.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  EVIDENCE_STANCES, QUESTION_KINDS, QUESTION_KIND_NAMES, QUESTION_STATES, toneVar,
  type QuestionKind, type QuestionState,
} from "@reiad/shared/research";
import {
  addQuestion, listProjects, listQuestions, listSources, remove, saveQuestion,
  type Evidence, type Project, type Question, type Source, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Empty } from "../ui/note";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { SAID, SETTLE, useWho, when } from "./use-who";
import { useKeys } from "./keys";

export function Questions() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [rows, setRows] = useState<Question[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [state, setState] = useState<QuestionState | "">("open");
  const [find, setFind] = useState("");
  const findBox = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    if (!w) return;
    const [q, p, s] = await Promise.all([listQuestions(w), listProjects(w), listSources(w, { limit: 500 })]);
    setRows(q);
    setProjects(p);
    setSources(s);
  }, [w]);
  useEffect(() => { void reload(); }, [reload]);

  /** The tree, flattened with depth, in position order. */
  const tree = useMemo(() => {
    const all = rows ?? [];
    const out: { q: Question; depth: number }[] = [];
    const walk = (parent: string | null, depth: number): void => {
      for (const q of all.filter((x) => (x.parent_id ?? null) === parent)) {
        out.push({ q, depth });
        if (depth < 6) walk(q.id, depth + 1);
      }
    };
    walk(null, 0);
    /* An orphan whose parent is gone still shows. */
    for (const q of all) if (!out.some((o) => o.q.id === q.id)) out.push({ q, depth: 0 });
    return out;
  }, [rows]);

  const shown = useMemo(() => {
    const needle = find.trim().toLowerCase();
    return tree.filter(({ q }) =>
      (!state || q.state === state)
      && (!needle || `${q.text} ${q.body.note ?? ""} ${q.tags.join(" ")}`.toLowerCase().includes(needle)));
  }, [tree, state, find]);

  const current = useMemo(() => rows?.find((q) => q.id === open) ?? null, [rows, open]);

  const make = useCallback(async (parent: string | null = null) => {
    if (!w) return;
    const text = window.prompt(both("rs.q.text"));
    if (!text?.trim()) return;
    const q = await addQuestion(w, text.trim(), parent ? "hypothesis" : "question", parent, current?.project_id ?? null);
    if (q) { cue("saved"); setOpen(q.id); await reload(); }
  }, [w, current, reload]);

  const move = useCallback((by: number) => {
    if (!shown.length) return;
    const at = shown.findIndex((x) => x.q.id === open);
    setOpen(shown[Math.min(shown.length - 1, Math.max(0, at + by))].q.id);
  }, [shown, open]);

  useKeys(useMemo(() => ({
    f: () => findBox.current?.focus(),
    n: () => { void make(null); },
    j: () => move(1),
    k: () => move(-1),
    "1": () => setState("open"),
    "2": () => setState("parked"),
    "3": () => setState("answered"),
    Escape: () => setOpen(null),
  }), [make, move]), Boolean(w));

  if (!w) return <SignedOut answered={answered} />;

  return (
    <div className="rs-panes">
      <section className="rs-list grid gap-3 content-start" aria-label="Questions / প্রশ্ন">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" kind="solid" onClick={() => { void make(null); }}><W k="rs.q.new" /></Button>
        </div>
        <Field id="rs-find" ref={findBox} label={<W k="rs.find" />} hideLabel placeholder={both("rs.find")}
               value={find} onChange={(e) => setFind(e.target.value)} autoComplete="off" />
        <div className="flex flex-wrap gap-2">
          <ChipButton pressed={state === ""} onClick={() => setState("")}><W k="rs.all" /></ChipButton>
          {QUESTION_STATES.map((s) => (
            <ChipButton key={s} pressed={state === s} onClick={() => setState(s)}><W k={`rs.q.state.${s}`} /></ChipButton>
          ))}
        </div>
        {rows === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
          : !shown.length ? <Empty title={<W k="rs.none" />} action={<span className="text-t2 text-ink-soft"><W k="rs.q.empty" /></span>} />
            : (
              <ul className="rs-rows grid gap-1">
                {shown.map(({ q, depth }) => (
                  <li key={q.id} style={{ paddingInlineStart: `${depth * 14}px` }}>
                    <button type="button" className="rs-row" aria-current={q.id === open ? "true" : undefined}
                            style={{ "--tone": toneVar("violet") } as React.CSSProperties}
                            onClick={() => setOpen(q.id)}>
                      <span className="rs-row-dot" aria-hidden="true" />
                      <span className="rs-row-main">
                        <span className="rs-row-title">{q.text}</span>
                        <span className="rs-row-sub">{QUESTION_KIND_NAMES[q.kind][lang]} · {(q.body.evidence ?? []).length} {both("rs.q.evidence").toLowerCase()}</span>
                      </span>
                      <span className="rs-row-meta"><Chip>{both(`rs.q.state.${q.state}`)}</Chip></span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
      </section>
      <section className="rs-main min-w-0">
        {current ? (
          <QuestionCard key={current.id} w={w} q={current} all={rows ?? []} projects={projects} sources={sources}
                        onChange={(x) => setRows((was) => (was ?? []).map((y) => (y.id === x.id ? x : y)))}
                        onChild={() => { void make(current.id); }}
                        onOpen={setOpen}
                        onGone={() => { setOpen(null); void reload(); }} />
        ) : (
          <Surface material="sunk" className="px-5 py-8 text-t2 text-ink-soft">
            <T en="Choose a question, or start one." bn="একটা প্রশ্ন বাছুন, বা একটা শুরু করুন।" />
          </Surface>
        )}
      </section>
    </div>
  );
}

function QuestionCard({ w, q, all, projects, sources, onChange, onChild, onOpen, onGone }: {
  w: Who; q: Question; all: Question[]; projects: Project[]; sources: Source[];
  onChange: (q: Question) => void; onChild: () => void; onOpen: (id: string) => void; onGone: () => void;
}) {
  const lang = useToolLang();
  const [text, setText] = useState(q.text);
  const [note, setNote] = useState(q.body.note ?? "");
  const [state, setState] = useState<"" | "saving" | "saved" | "conflict" | "failed">("");
  const [pick, setPick] = useState("");
  const [stance, setStance] = useState<Evidence["stance"]>("supports");
  const [page, setPage] = useState("");
  const seen = useRef(q.updated_at);
  const latest = useRef(q);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const said = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { latest.current = q; seen.current = q.updated_at; }, [q]);

  const write = useCallback(async (part: Partial<Question>) => {
    setState("saving");
    const r = await saveQuestion(w, q.id, part, part.text ?? latest.current.text, seen.current);
    if (r.ok) {
      seen.current = r.row.updated_at;
      latest.current = r.row;
      onChange(r.row);
      setState("saved");
      cue("saved");
      if (said.current) clearTimeout(said.current);
      said.current = setTimeout(() => setState(""), SAID);
    } else setState(r.conflict ? "conflict" : "failed");
  }, [w, q.id, onChange]);

  const later = useCallback((part: Partial<Question>) => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => { void write(part); }, SETTLE);
  }, [write]);

  /** A WHOLE body, out of the row the last write returned. */
  const patchBody = (part: Partial<Question["body"]>): Question["body"] =>
    ({ ...(latest.current.body ?? {}), ...part });

  const evidence = q.body.evidence ?? [];
  const children = all.filter((x) => x.parent_id === q.id);
  const titleOf = (id: string): string => sources.find((s) => s.id === id)?.title ?? "?";

  return (
    <div className="grid gap-4" style={{ "--accent": toneVar("violet") } as React.CSSProperties}>
      <div className="flex flex-wrap items-center gap-2">
        <Chip tone="accent">{QUESTION_KIND_NAMES[q.kind][lang]}</Chip>
        <span className="text-t1 text-ink-soft mono grow text-right" role="status">
          {state === "saving" ? <W k="rs.saving" /> : state === "saved" ? <W k="rs.saved" />
            : state === "conflict" ? <W k="rs.conflict" /> : state === "failed" ? <W k="rs.notsaved" /> : null}
        </span>
      </div>
      <Field id="rs-q-text" label={<W k="rs.q.text" />} value={text}
             onChange={(e) => { setText(e.target.value); later({ text: e.target.value }); }} />
      <div className="grid gap-3 md:grid-cols-3">
        <Select id="rs-q-kind" label={<W k="rs.q.kind" />} value={q.kind} onChange={(e) => { void write({ kind: e.target.value as QuestionKind }); }}>
          {QUESTION_KINDS.map((k) => <option key={k} value={k}>{QUESTION_KIND_NAMES[k][lang]}</option>)}
        </Select>
        <Select id="rs-q-state" label={<W k="rs.q.state" />} value={q.state} onChange={(e) => { void write({ state: e.target.value as QuestionState }); }}>
          {QUESTION_STATES.map((s) => <option key={s} value={s}>{both(`rs.q.state.${s}`)}</option>)}
        </Select>
        <Select id="rs-q-project" label={<W k="rs.project" />} value={q.project_id ?? ""} onChange={(e) => { void write({ project_id: e.target.value || null }); }}>
          <option value="">{both("rs.noproject")}</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </Select>
      </div>
      <TextArea id="rs-q-note" label={<W k="rs.q.note" />} rows={6} value={note}
                onChange={(e) => { setNote(e.target.value); later({ body: patchBody({ note: e.target.value }) }); }} />

      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h3 className="text-t2 font-medium"><W k="rs.q.evidence" /></h3>
        {evidence.length ? (
          <ul className="grid gap-2">
            {evidence.map((e, i) => (
              <li key={`${e.source_id}-${i}`} className="flex flex-wrap items-baseline gap-2 text-t2">
                <Chip tone={e.stance === "contradicts" ? "warn" : "accent"}>{both(`rs.q.stance.${e.stance}`)}</Chip>
                <Link href={`/tools/research/library/${e.source_id}`}>{titleOf(e.source_id)}</Link>
                {e.page ? <span className="text-t1 text-ink-soft mono">p. {e.page}</span> : null}
                <ChipButton aria-label={`${both("rs.delete")}: ${titleOf(e.source_id)}`}
                            onClick={() => { void write({ body: patchBody({ evidence: evidence.filter((_, j) => j !== i) }) }); }}>×</ChipButton>
              </li>
            ))}
          </ul>
        ) : <p className="text-t2 text-ink-soft"><W k="rs.q.evidence.empty" /></p>}
        <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_11rem_6rem_auto] items-end"
              onSubmit={(e) => {
                e.preventDefault();
                if (!pick) return;
                void write({ body: patchBody({ evidence: [...evidence, { source_id: pick, stance, page: page || undefined }] }) });
                setPick(""); setPage("");
              }}>
          <Select id="rs-q-pick" label={<W k="rs.q.evidence.add" />} value={pick} onChange={(e) => setPick(e.target.value)}>
            <option value="">–</option>
            {sources.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </Select>
          <Select id="rs-q-stance" label={<T en="Stance" bn="অবস্থান" />} value={stance} onChange={(e) => setStance(e.target.value as Evidence["stance"])}>
            {EVIDENCE_STANCES.map((s) => <option key={s} value={s}>{both(`rs.q.stance.${s}`)}</option>)}
          </Select>
          <Field id="rs-q-page" label={<W k="rs.lib.pages" />} value={page} onChange={(e) => setPage(e.target.value)} />
          <Button type="submit" kind="soft" size="sm" disabled={!pick}><W k="rs.new" /></Button>
        </form>
      </Surface>

      <Surface material="sunk" className="px-4 py-3 grid gap-2">
        <h3 className="text-t2 font-medium"><W k="rs.q.children" /></h3>
        {children.length ? (
          <ul className="grid gap-1 text-t2">
            {children.map((c) => (
              <li key={c.id}>
                <button type="button" className="link-btn" onClick={() => onOpen(c.id)}>{c.text}</button>
                <span className="text-t1 text-ink-soft mono"> {QUESTION_KIND_NAMES[c.kind][lang]}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div><Button size="sm" kind="soft" onClick={onChild}><W k="rs.q.new" /></Button></div>
      </Surface>

      {q.body.carried ? (
        <Surface material="sunk" className="px-4 py-3 grid gap-2 text-t2">
          <h3 className="font-medium"><W k="rs.q.carried" /></h3>
          {(q.body.carried.sources ?? []).map((s, i) => (
            <p key={`s${i}`}><a href={s.url} target="_blank" rel="noreferrer">{s.url}</a>{s.said ? <> : {s.said}</> : null}</p>
          ))}
          {(q.body.carried.steps ?? []).map((s, i) => (
            <p key={`t${i}`}>{s.done ? "✓ " : "· "}{s.text}</p>
          ))}
        </Surface>
      ) : null}

      <div className="flex gap-2 items-center">
        <ChipButton onClick={() => {
          if (!window.confirm(`${both("rs.delete")}: ${q.text}?`)) return;
          void remove(w, "research_questions", q.id, q.text).then((ok) => { if (ok) onGone(); });
        }}><W k="rs.delete" /></ChipButton>
        <span className="text-t1 text-ink-soft mono"><W k="rs.updated" />: {when(q.updated_at)}</span>
      </div>
    </div>
  );
}
