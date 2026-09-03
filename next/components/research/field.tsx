"use client";

/* ============================================================
   research/field.tsx: the field room. RESEARCH.md section 15.

   People, by pseudonym. A participant's real name, if kept at all,
   is sealed in this browser under a passphrase the site never
   sees (lib/seal.ts). An interview is a source of type interview
   with the audio as its file and its transcript a note of kind
   transcript whose segments live in `meta.segments`; it arrives as
   a draft, from the Worker's model or from a paste, and is marked
   checked by a person. Coding is selecting text in a segment and
   pressing a code; a coding is offsets into that segment's text,
   so an edit to the prose is what a coding survives or does not,
   and the matrices are derived from the rows. A survey is
   questions as JSON with a public token; the answers live in D1.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { TONES, toneVar, type Tone } from "@reiad/shared/research";
import {
  CONSENT_NAMES, CONSENT_STATES, QUESTION_TYPE_NAMES, byParticipant, coOccurrence, guideOf, matrixCsv, overInterviews, questionsOf, questionsText,
  responsesTable, segmentsOf, stampOf, tableCsv, tokenOf, type Answers, type ConsentState, type Matrix, type Segment, type SurveyQuestion, type TranscriptState,
} from "@reiad/shared/research-field";
import {
  addCode, addCoding, addNote, addParticipant, addSource, addSurvey, fileTicket, listCodes, listCodings, listNotes, listParticipants, listSources, listSurveys,
  publishSurveyForm, removeCode, removeCoding, removeParticipant, removeSurvey, saveCoding, saveNote, saveParticipant, saveSurvey, surveyResponses,
  transcribeFile, uploadFile, type Code, type Coding, type Note, type Participant, type Source, type Survey, type Who,
} from "../../lib/research-api";
import { seal, unseal } from "../../lib/seal";
import { importFile } from "./lab";
import { Button, ButtonLabel } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select, TextArea } from "../ui/field";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { useKeys } from "./keys";

type View = "participants" | "interviews" | "codebook" | "retrieval" | "matrices" | "surveys" | "guide";
const VIEWS: View[] = ["participants", "interviews", "codebook", "retrieval", "matrices", "surveys", "guide"];

const ACCEPT = ".webm,.m4a,.mp3,.wav";

function download(name: string, body: string, type: string): void {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const when = (iso: string | null | undefined, lang: "en" | "bn"): string => (iso ? new Date(iso).toLocaleDateString(lang === "bn" ? "bn-BD" : "en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");

/** The participant an interview is of: its identifiers carry the
    row's id, and its author is the pseudonym. */
const participantOf = (s: Source): string | null => (typeof s.identifiers.participant === "string" ? s.identifiers.participant : null);

/* ---------- the room ---------- */

export function FieldRoom() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [view, setView] = useState<View>("participants");
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [interviews, setInterviews] = useState<Source[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);
  const [codings, setCodings] = useState<Coding[]>([]);
  const [transcripts, setTranscripts] = useState<Note[]>([]);
  const [ready, setReady] = useState(false);
  const [said, setSaid] = useState("");

  useEffect(() => {
    if (!w) return;
    void (async () => {
      const [p, s, c, k, n] = await Promise.all([listParticipants(w), listSources(w, { type: "interview", limit: 500 }), listCodes(w), listCodings(w), listNotes(w, { kind: "transcript", limit: 500 })]);
      setParticipants(p); setInterviews(s.filter((x) => x.type === "interview")); setCodes(c); setCodings(k); setTranscripts(n.filter((x) => x.kind === "transcript")); setReady(true);
    })();
  }, [w]);

  useKeys(useMemo(() => { const m: Record<string, () => void> = {}; VIEWS.forEach((v, i) => { m[String(i + 1)] = () => setView(v); }); return m; }, []), Boolean(w));

  const codingChanged = useCallback((c: Coding) => setCodings((was) => was.map((x) => (x.id === c.id ? c : x))), []);
  const codingMade = useCallback((c: Coding) => setCodings((was) => [...was, c]), []);
  const codingGone = useCallback((c: Coding) => setCodings((was) => was.filter((x) => x.id !== c.id)), []);

  if (!w) return <SignedOut answered={answered} />;
  const shared = { w, lang, participants, interviews, codes, codings, transcripts, setSaid };
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {VIEWS.map((v, i) => <ChipButton key={v} pressed={view === v} onClick={() => setView(v)}>{i + 1} {both(`rs.field.${v}`)}</ChipButton>)}
      </div>
      {said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
      {view === "participants" ? <Participants {...shared} ready={ready} onMade={(p) => setParticipants((was) => [...was, p].sort((a, b) => a.pseudonym.localeCompare(b.pseudonym)))} onChanged={(p) => setParticipants((was) => was.map((x) => (x.id === p.id ? p : x)))} onRemoved={(p) => setParticipants((was) => was.filter((x) => x.id !== p.id))} /> : null}
      {view === "interviews" ? (
        <Interviews
          {...shared} onMade={(s) => setInterviews((was) => [s, ...was])} onTranscript={(n) => setTranscripts((was) => (was.some((x) => x.id === n.id) ? was.map((x) => (x.id === n.id ? n : x)) : [n, ...was]))}
          onCoding={codingMade} onCodingGone={codingGone}
        />
      ) : null}
      {view === "codebook" ? <Codebook {...shared} onMade={(c) => setCodes((was) => [...was, c])} onRemoved={(c) => setCodes((was) => was.filter((x) => x.id !== c.id))} /> : null}
      {view === "retrieval" ? <Retrieval {...shared} onChanged={codingChanged} onGone={codingGone} /> : null}
      {view === "matrices" ? <Matrices {...shared} /> : null}
      {view === "surveys" ? <Surveys w={w} lang={lang} setSaid={setSaid} /> : null}
      {view === "guide" ? <Guide {...shared} /> : null}
    </div>
  );
}

interface Shared { w: Who; lang: "en" | "bn"; participants: Participant[]; interviews: Source[]; codes: Code[]; codings: Coding[]; transcripts: Note[]; setSaid: (s: string) => void }

/* ---------- participants, by pseudonym ---------- */

function Participants({ w, lang, participants, interviews, ready, onMade, onChanged, onRemoved, setSaid }: Shared & { ready: boolean; onMade: (p: Participant) => void; onChanged: (p: Participant) => void; onRemoved: (p: Participant) => void }) {
  const [pseudonym, setPseudonym] = useState("");
  const [role, setRole] = useState("");
  const [chosen, setChosen] = useState<string | null>(null);
  const [pass, setPass] = useState("");
  const [identity, setIdentity] = useState("");
  const [opened, setOpened] = useState<string | null>(null);
  const p = participants.find((x) => x.id === chosen) ?? null;
  useEffect(() => { setOpened(null); setIdentity(""); }, [chosen]);

  const add = async (): Promise<void> => {
    if (!pseudonym.trim()) return;
    const made = await addParticipant(w, { pseudonym: pseudonym.trim(), role: role.trim(), consent: { status: "pending" } });
    if (made) { onMade(made); setChosen(made.id); setPseudonym(""); setRole(""); cue("saved"); }
  };
  const consent = async (part: Partial<Participant["consent"]>): Promise<void> => {
    if (!p) return;
    const r = await saveParticipant(w, p, { consent: { ...p.consent, ...part } });
    if (r.ok) { onChanged(r.row); cue("saved"); }
  };
  const sealIt = async (): Promise<void> => {
    if (!p || !pass || !identity.trim()) return;
    const sealed = await seal(pass, identity.trim());
    const r = await saveParticipant(w, p, { sealed });
    if (r.ok) { onChanged(r.row); setIdentity(""); setOpened(null); cue("saved"); setSaid(both("rs.field.sealed.done")); }
  };
  const openIt = async (): Promise<void> => {
    if (!p?.sealed || !pass) return;
    const plain = await unseal(pass, p.sealed);
    if (plain === null) { setSaid(both("rs.field.sealed.wrong")); cue("refused"); return; }
    setOpened(plain);
  };
  const mine = p ? interviews.filter((s) => participantOf(s) === p.id) : [];

  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-list px-3 py-3 grid gap-3">
        <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); void add(); }}>
          <p className="text-t1 text-ink-soft"><W k="rs.field.participants.hint" /></p>
          <Field id="rs-fp-pseudonym" label={<W k="rs.field.pseudonym" />} value={pseudonym} onChange={(e) => setPseudonym(e.target.value)} autoComplete="off" />
          <Field id="rs-fp-role" label={<W k="rs.field.role" />} value={role} onChange={(e) => setRole(e.target.value)} autoComplete="off" />
          <Button type="submit" kind="solid" size="sm" disabled={!pseudonym.trim()}><W k="rs.field.participant.add" /></Button>
        </form>
        {ready && !participants.length ? <p className="text-t1 text-ink-soft"><W k="rs.field.participants.empty" /></p> : null}
        <ul className="rs-rows grid gap-1">
          {participants.map((x) => (
            <li key={x.id}>
              <button type="button" className="rs-row" aria-current={x.id === chosen ? "true" : undefined} onClick={() => setChosen(x.id)}>
                <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar(x.consent.status === "given" ? "green" : x.consent.status === "withdrawn" ? "rose" : "gold") } as CSSProperties} />
                <span className="rs-row-main"><span className="rs-row-title">{x.pseudonym}</span><span className="rs-row-sub">{x.role}{x.consent.status ? ` · ${CONSENT_NAMES[x.consent.status][lang]}` : ""}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </Surface>
      <div className="rs-main grid gap-3 min-w-0">
        {!p ? <p className="text-t2 text-ink-soft"><W k="rs.field.participants.pick" /></p> : (
          <>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-t3 font-medium mr-auto">{p.pseudonym}</h2>
                <Chip>{p.role || both("rs.field.role")}</Chip>
                <Button type="button" kind="quiet" size="sm" onClick={() => { if (confirm(both("rs.field.participant.remove"))) void removeParticipant(w, p).then((okd) => { if (okd) { onRemoved(p); setChosen(null); } }); }}><W k="rs.delete" /></Button>
              </div>
              <h3 className="text-t2 font-medium"><W k="rs.field.consent" /></h3>
              <p className="text-t1 text-ink-soft"><W k="rs.field.consent.hint" /></p>
              <div className="grid gap-2 md:grid-cols-3">
                <Select id="rs-fp-consent" label={<W k="rs.field.consent.status" />} value={p.consent.status ?? "pending"} onChange={(e) => { void consent({ status: e.target.value as ConsentState, ...(e.target.value === "withdrawn" ? { withdrawn: new Date().toISOString().slice(0, 10) } : {}) }); }}>
                  {CONSENT_STATES.map((s) => <option key={s} value={s}>{CONSENT_NAMES[s][lang]}</option>)}
                </Select>
                <Field id="rs-fp-date" type="date" label={<W k="rs.field.consent.date" />} value={p.consent.date ?? ""} onChange={(e) => { void consent({ date: e.target.value }); }} />
                <Field id="rs-fp-scope" label={<W k="rs.field.consent.scope" />} defaultValue={p.consent.scope ?? ""} onBlur={(e) => { if (e.target.value !== (p.consent.scope ?? "")) void consent({ scope: e.target.value }); }} autoComplete="off" />
              </div>
              <label className="flex items-center gap-2 text-t1"><input type="checkbox" checked={Boolean(p.consent.quotes)} onChange={(e) => { void consent({ quotes: e.target.checked }); }} /> <W k="rs.field.consent.quotes" /></label>
            </Surface>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <h3 className="text-t2 font-medium"><W k="rs.field.sealed" /></h3>
              <p className="text-t1 text-ink-soft"><W k="rs.field.sealed.hint" /></p>
              <div className="grid gap-2 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)_auto] items-end">
                <Field id="rs-fp-pass" type="password" label={<W k="rs.field.passphrase" />} value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="off" />
                <Field id="rs-fp-identity" label={<W k="rs.field.identity" />} value={identity} onChange={(e) => setIdentity(e.target.value)} autoComplete="off" />
                <Button type="button" kind="solid" size="sm" disabled={!pass || !identity.trim()} onClick={() => { void sealIt(); }}><W k="rs.field.seal" /></Button>
              </div>
              {p.sealed ? (
                <div className="flex flex-wrap items-center gap-2">
                  <Chip tone="accent">{both("rs.field.sealed.held")}</Chip>
                  <Button type="button" kind="soft" size="sm" disabled={!pass} onClick={() => { void openIt(); }}><W k="rs.field.unseal" /></Button>
                  {opened ? <span className="text-t1" data-testid="rs-fp-opened">{opened}</span> : null}
                </div>
              ) : null}
            </Surface>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <h3 className="text-t2 font-medium"><W k="rs.field.interviews" /></h3>
              {!mine.length ? <p className="text-t1 text-ink-soft"><W k="rs.none" /></p> : (
                <ul className="rs-rows grid gap-1">{mine.map((s) => <li key={s.id} className="rs-row"><span className="rs-row-main"><a className="rs-row-title" href={`/tools/research/library/${s.id}`}>{s.title}</a><span className="rs-row-sub">{when(s.created_at, lang)}</span></span></li>)}</ul>
              )}
            </Surface>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- interviews: the audio, the transcript, the coding ---------- */

/** Where a selection starts and ends inside one segment's text,
    by measuring the text from the segment's start to each end of
    the range, which is right whatever spans the underlines split
    the text into. */
function offsetsIn(seg: HTMLElement, range: Range): { start: number; end: number } | null {
  if (!seg.contains(range.startContainer) || !seg.contains(range.endContainer)) return null;
  const head = document.createRange();
  head.setStart(seg, 0);
  head.setEnd(range.startContainer, range.startOffset);
  const start = head.toString().length;
  const end = start + range.toString().length;
  return end > start ? { start, end } : null;
}

function Interviews({ w, lang, participants, interviews, codes, codings, transcripts, onMade, onTranscript, onCoding, onCodingGone, setSaid }: Shared & {
  onMade: (s: Source) => void; onTranscript: (n: Note) => void; onCoding: (c: Coding) => void; onCodingGone: (c: Coding) => void;
}) {
  const [chosen, setChosen] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [participant, setParticipant] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [paste, setPaste] = useState("");
  const [language, setLanguage] = useState("");
  const [selection, setSelection] = useState<{ segment: number; start: number; end: number; text: string } | null>(null);
  const player = useRef<HTMLAudioElement>(null);
  const interview = interviews.find((s) => s.id === chosen) ?? null;
  const transcript = interview ? transcripts.find((n) => n.source_id === interview.id) ?? null : null;
  const segments = useMemo(() => (Array.isArray(transcript?.meta.segments) ? (transcript.meta.segments as Segment[]) : []), [transcript]);
  const state = (transcript?.meta.state as TranscriptState | undefined) ?? "draft";
  const mine = useMemo(() => codings.filter((c) => transcript && c.note_id === transcript.id), [codings, transcript]);

  useEffect(() => {
    setAudioUrl(null); setSelection(null);
    const audio = interview?.files.find((f) => f.kind === "audio");
    if (audio) void fileTicket(w, audio.key).then(setAudioUrl);
  }, [interview, w]);

  useKeys(useMemo(() => ({
    "[": () => { if (player.current) player.current.currentTime = Math.max(0, player.current.currentTime - 5); },
    "]": () => { if (player.current) player.current.currentTime += 5; },
  }), []), Boolean(interview));

  const add = async (): Promise<void> => {
    if (!title.trim() || !participant) return;
    setBusy(true);
    try {
      const who = participants.find((p) => p.id === participant);
      let files: Source["files"] = [];
      if (file) {
        const up = await uploadFile(w, file);
        if (!up.ok) { setSaid(`${both("rs.lab.failed")}: ${up.reason}`); return; }
        files = [{ key: up.key, kind: "audio", size: up.size }];
      }
      const s = await addSource(w, { type: "interview", title: title.trim(), author: [{ literal: who?.pseudonym ?? "" }], issued: { "date-parts": [[new Date().getFullYear(), new Date().getMonth() + 1, new Date().getDate()]] } }, { via: "manual", verified: true, identifiers: { participant } });
      if (!s) return;
      const withFile = files.length ? await saveSourceFiles(w, s, files) : s;
      onMade(withFile); setChosen(withFile.id); setTitle(""); setFile(null); cue("saved");
    } finally { setBusy(false); }
  };
  const keepTranscript = async (segs: Segment[], st: TranscriptState): Promise<void> => {
    if (!interview) return;
    const text = segs.map((s) => s.text).join("\n");
    const body = segs.map((s) => `<p>${s.speaker ? `<strong>${s.speaker}:</strong> ` : ""}${s.text.replace(/</g, "&lt;")}</p>`).join("");
    if (transcript) {
      const r = await saveNote(w, transcript.id, { meta: { ...transcript.meta, segments: segs, state: st }, text, body }, transcript.title);
      if (r.ok) { onTranscript(r.row); cue("saved"); }
    } else {
      const n = await addNote(w, { kind: "transcript", title: `${interview.title}: ${both("rs.field.transcript")}`, source_id: interview.id, text, body, meta: { segments: segs, state: st, participant: participantOf(interview) } });
      if (n) { onTranscript(n); cue("saved"); }
    }
  };
  const fromPaste = async (): Promise<void> => {
    const segs = segmentsOf(paste, player.current?.duration && Number.isFinite(player.current.duration) ? player.current.duration : null);
    if (!segs.length) return;
    await keepTranscript(segs, "draft");
    setPaste("");
  };
  const fromModel = async (): Promise<void> => {
    const audio = interview?.files.find((f) => f.kind === "audio");
    if (!audio) return;
    setBusy(true);
    try {
      const got = await transcribeFile(w, audio.key, language || null);
      if (!got) { setSaid(both("rs.field.transcribe.off")); return; }
      await keepTranscript(got.segments, "draft");
    } finally { setBusy(false); }
  };
  const seek = (s: number): void => { if (player.current) { player.current.currentTime = s; void player.current.play().catch(() => undefined); } };
  const onSelect = (): void => {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0 || sel.isCollapsed) { setSelection(null); return; }
    const range = sel.getRangeAt(0);
    const node = range.startContainer instanceof HTMLElement ? range.startContainer : range.startContainer.parentElement;
    const seg = node?.closest<HTMLElement>("[data-seg]");
    /* Offsets are into the segment's TEXT, so they are measured
       inside the span that holds it and not from the paragraph,
       whose speaker prefix would put every coding a name late. */
    const text = seg?.querySelector<HTMLElement>("[data-text]");
    if (!seg || !text) { setSelection(null); return; }
    const at = offsetsIn(text, range);
    if (!at) { setSelection(null); return; }
    const index = Number(seg.dataset.seg);
    setSelection({ segment: index, start: at.start, end: at.end, text: segments[index]?.text.slice(at.start, at.end) ?? "" });
  };
  const code = async (c: Code): Promise<void> => {
    if (!selection || !transcript || !interview) return;
    const made = await addCoding(w, {
      code_id: c.id, note_id: transcript.id, source_id: interview.id, participant_id: participantOf(interview), segment: selection.segment, start_at: selection.start, end_at: selection.end, text: selection.text,
    });
    if (made) { onCoding(made); setSelection(null); window.getSelection()?.removeAllRanges(); cue("tick"); }
  };
  const present = [...new Set(mine.map((c) => c.code_id))].map((id) => codes.find((c) => c.id === id)).filter((c): c is Code => Boolean(c));

  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-list px-3 py-3 grid gap-3">
        <form className="grid gap-2" onSubmit={(e) => { e.preventDefault(); void add(); }}>
          <p className="text-t1 text-ink-soft"><W k="rs.field.interviews.hint" /></p>
          <Field id="rs-fi-title" label={<W k="rs.field.interview.title" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
          <Select id="rs-fi-participant" label={<W k="rs.field.participant" />} value={participant} onChange={(e) => setParticipant(e.target.value)}>
            <option value=""></option>
            {participants.map((p) => <option key={p.id} value={p.id}>{p.pseudonym}</option>)}
          </Select>
          <ButtonLabel kind="soft" size="sm">
            {file ? file.name : <W k="rs.field.audio" />}
            <input type="file" accept={ACCEPT} hidden data-testid="rs-fi-audio" onChange={(e) => { setFile(e.target.files?.[0] ?? null); }} />
          </ButtonLabel>
          <Button type="submit" kind="solid" size="sm" disabled={!title.trim() || !participant || busy}><W k="rs.field.interview.add" /></Button>
        </form>
        <ul className="rs-rows grid gap-1">
          {interviews.map((s) => (
            <li key={s.id}>
              <button type="button" className="rs-row" aria-current={s.id === chosen ? "true" : undefined} onClick={() => setChosen(s.id)}>
                <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar(transcripts.some((n) => n.source_id === s.id) ? "green" : "gold") } as CSSProperties} />
                <span className="rs-row-main"><span className="rs-row-title">{s.title}</span><span className="rs-row-sub">{s.authors}{s.files.some((f) => f.kind === "audio") ? ` · ${both("rs.field.audio")}` : ""}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </Surface>
      <div className="rs-main grid gap-3 min-w-0">
        {!interview ? <p className="text-t2 text-ink-soft"><W k="rs.field.interviews.pick" /></p> : (
          <>
            <Surface material="pane" className="px-4 py-3 grid gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-t3 font-medium mr-auto">{interview.title}</h2>
                <Chip>{interview.authors}</Chip>
                {transcript ? <Chip tone={state === "checked" ? "accent" : "warn"}>{both(`rs.field.transcript.${state}`)}</Chip> : null}
              </div>
              {audioUrl ? <audio ref={player} controls src={audioUrl} className="w-full" preload="metadata" /> : <p className="text-t1 text-ink-soft"><W k="rs.field.noaudio" /></p>}
              <p className="text-t1 text-ink-soft"><W k="rs.field.player.hint" /></p>
            </Surface>
            {!transcript ? (
              <Surface material="pane" className="px-4 py-3 grid gap-2">
                <h3 className="text-t2 font-medium"><W k="rs.field.transcript" /></h3>
                <p className="text-t1 text-ink-soft"><W k="rs.field.transcript.hint" /></p>
                <div className="flex flex-wrap items-end gap-2">
                  <Field id="rs-fi-lang" label={<W k="rs.field.language" />} value={language} onChange={(e) => setLanguage(e.target.value)} autoComplete="off" />
                  <Button type="button" kind="soft" size="sm" disabled={busy || !interview.files.some((f) => f.kind === "audio")} onClick={() => { void fromModel(); }}><W k="rs.field.transcribe" /></Button>
                </div>
                <TextArea id="rs-fi-paste" label={<W k="rs.field.paste" />} hint={<W k="rs.field.paste.hint" />} value={paste} onChange={(e) => setPaste(e.target.value)} rows={6} />
                <div><Button type="button" kind="solid" size="sm" disabled={!paste.trim()} onClick={() => { void fromPaste(); }}><W k="rs.field.paste.keep" /></Button></div>
              </Surface>
            ) : (
              <div className="rs-panes">
                <Surface material="pane" className="px-4 py-3 grid gap-2 min-w-0" data-testid="rs-transcript">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-t2 font-medium mr-auto"><W k="rs.field.transcript" /></h3>
                    <ChipButton pressed={state === "checked"} onClick={() => { void keepTranscript(segments, state === "checked" ? "draft" : "checked"); }}>{both("rs.field.transcript.checked")}</ChipButton>
                  </div>
                  <p className="text-t1 text-ink-soft"><W k="rs.field.coding.hint" /></p>
                  <div className="grid gap-2" onMouseUp={onSelect} onKeyUp={onSelect}>
                    {segments.map((s, i) => (
                      <div key={i} className="grid grid-cols-[3.5rem_minmax(0,1fr)] gap-2">
                        <button type="button" className="text-t1 text-ink-soft text-left tabular-nums" onClick={() => seek(s.start)}>{stampOf(s.start)}</button>
                        <p className="text-t2" data-seg={i}>{s.speaker ? <strong>{s.speaker}: </strong> : null}<span data-text><Marked text={s.text} codings={mine.filter((c) => c.segment === i)} codes={codes} /></span></p>
                      </div>
                    ))}
                  </div>
                </Surface>
                <Surface material="pane" className="px-3 py-3 grid gap-2">
                  {selection ? (
                    <div className="grid gap-1" data-testid="rs-selection">
                      <p className="text-t1 text-ink-soft"><W k="rs.field.selected" /></p>
                      <p className="text-t1">“{selection.text.slice(0, 160)}{selection.text.length > 160 ? "…" : ""}”</p>
                    </div>
                  ) : <p className="text-t1 text-ink-soft"><W k="rs.field.select" /></p>}
                  <div className="flex flex-wrap gap-1" data-testid="rs-code-strip">
                    {codes.map((c) => <ChipButton key={c.id} disabled={!selection} onClick={() => { void code(c); }} title={c.definition}><span className="rs-row-dot inline-block mr-1" style={{ "--tone": toneVar(c.colour) } as CSSProperties} />{c.name}</ChipButton>)}
                  </div>
                  {!codes.length ? <p className="text-t1 text-ink-soft"><W k="rs.field.codes.none" /></p> : null}
                  {present.length ? (
                    <div className="grid gap-1">
                      <p className="text-t1 text-ink-soft"><W k="rs.field.present" /></p>
                      <ul className="grid gap-1 text-t1">
                        {present.map((c) => <li key={c.id} className="flex items-center gap-2"><span className="rs-row-dot" style={{ "--tone": toneVar(c.colour) } as CSSProperties} />{c.name} <Chip>{mine.filter((x) => x.code_id === c.id).length}</Chip></li>)}
                      </ul>
                    </div>
                  ) : null}
                  {mine.length ? (
                    <ul className="grid gap-1 text-t1" data-testid="rs-codings">
                      {mine.map((c) => (
                        <li key={c.id} className="flex items-start gap-2">
                          <span className="rs-row-dot mt-1" style={{ "--tone": toneVar(codes.find((x) => x.id === c.code_id)?.colour ?? "green") } as CSSProperties} />
                          <span className="min-w-0"><span className="text-ink-soft">{codes.find((x) => x.id === c.code_id)?.name} · {stampOf(segments[c.segment]?.start ?? 0)}</span><br />{c.text.slice(0, 120)}</span>
                          <Button type="button" kind="quiet" size="sm" className="ml-auto" onClick={() => { void removeCoding(w, c).then((okd) => { if (okd) onCodingGone(c); }); }}><W k="rs.delete" /></Button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </Surface>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/** A file put on a source row after the upload: the library's own
    column, written the way the reading room writes it. */
async function saveSourceFiles(w: Who, s: Source, files: Source["files"]): Promise<Source> {
  const { saveSource } = await import("../../lib/research-api");
  const r = await saveSource(w, s, { files });
  return r.ok ? r.row : s;
}

/** A segment's text with its codings as coloured underlines. The
    text is split at every coding boundary and each piece carries
    the codes over it, so two codings that overlap stack rather
    than fight. */
function Marked({ text, codings, codes }: { text: string; codings: Coding[]; codes: Code[] }) {
  if (!codings.length) return <>{text}</>;
  const cuts = [...new Set([0, text.length, ...codings.flatMap((c) => [Math.min(c.start_at, text.length), Math.min(c.end_at, text.length)])])].sort((a, b) => a - b);
  return (
    <>
      {cuts.slice(0, -1).map((a, i) => {
        const b = cuts[i + 1];
        const over = codings.filter((c) => c.start_at <= a && c.end_at >= b);
        if (!over.length) return <span key={a}>{text.slice(a, b)}</span>;
        const tones = over.map((c) => codes.find((x) => x.id === c.code_id)?.colour ?? "green");
        return (
          <mark key={a} className="rs-mark" title={over.map((c) => codes.find((x) => x.id === c.code_id)?.name ?? "").join(", ")}
                style={{ background: "transparent", color: "inherit", boxShadow: tones.map((t, k) => `inset 0 -${(k + 1) * 3}px 0 -${k * 3}px ${toneVar(t as Tone)}`).join(", ") }}>
            {text.slice(a, b)}
          </mark>
        );
      })}
    </>
  );
}

/* ---------- the codebook, a tree with definitions ---------- */

function Codebook({ w, lang, codes, codings, onMade, onRemoved }: Shared & { onMade: (c: Code) => void; onRemoved: (c: Code) => void }) {
  const [name, setName] = useState("");
  const [definition, setDefinition] = useState("");
  const [colour, setColour] = useState<Tone>("green");
  const [parent, setParent] = useState("");
  const add = async (): Promise<void> => {
    if (!name.trim() || !definition.trim()) return;
    const c = await addCode(w, { name: name.trim(), definition: definition.trim(), colour, parent_id: parent || null, position: codes.length });
    if (c) { onMade(c); setName(""); setDefinition(""); cue("saved"); }
  };
  const roots = codes.filter((c) => !c.parent_id);
  const children = (id: string): Code[] => codes.filter((c) => c.parent_id === id);
  const Row = ({ c, depth }: { c: Code; depth: number }): React.ReactNode => (
    <>
      <li className="rs-row" style={{ marginInlineStart: `${depth * 1.25}rem` }}>
        <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar(c.colour) } as CSSProperties} />
        <span className="rs-row-main"><span className="rs-row-title">{c.name}</span><span className="rs-row-sub">{c.definition}</span></span>
        <span className="rs-row-meta flex items-center gap-1">
          <Chip>{codings.filter((x) => x.code_id === c.id).length}</Chip>
          <Button type="button" kind="quiet" size="sm" onClick={() => { if (confirm(both("rs.field.code.remove"))) void removeCode(w, c).then((okd) => { if (okd) onRemoved(c); }); }}><W k="rs.delete" /></Button>
        </span>
      </li>
      {children(c.id).map((k) => <Row key={k.id} c={k} depth={depth + 1} />)}
    </>
  );
  void lang;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.field.codebook.hint" /></p>
      <form className="grid gap-2 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,8rem)_minmax(0,10rem)_auto] items-end" onSubmit={(e) => { e.preventDefault(); void add(); }}>
        <Field id="rs-fc-name" label={<W k="rs.field.code.name" />} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
        <Field id="rs-fc-def" label={<W k="rs.field.code.definition" />} value={definition} onChange={(e) => setDefinition(e.target.value)} autoComplete="off" />
        <Select id="rs-fc-colour" label={<W k="rs.field.code.colour" />} value={colour} onChange={(e) => setColour(e.target.value as Tone)}>{TONES.map((t) => <option key={t} value={t}>{t}</option>)}</Select>
        <Select id="rs-fc-parent" label={<W k="rs.field.code.parent" />} value={parent} onChange={(e) => setParent(e.target.value)}><option value=""></option>{codes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select>
        <Button type="submit" kind="solid" size="sm" disabled={!name.trim() || !definition.trim()}><W k="rs.field.code.add" /></Button>
      </form>
      {!codes.length ? <p className="text-t2 text-ink-soft"><W k="rs.field.codes.none" /></p> : <ul className="rs-rows grid gap-1" data-testid="rs-codebook">{roots.map((c) => <Row key={c.id} c={c} depth={0} />)}</ul>}
    </Surface>
  );
}

/* ---------- retrieval: every coded segment of one code ---------- */

function Retrieval({ w, lang, codes, codings, participants, interviews, transcripts, onChanged, onGone }: Shared & { onChanged: (c: Coding) => void; onGone: (c: Coding) => void }) {
  const [code, setCode] = useState("");
  const rows = codings.filter((c) => !code || c.code_id === code);
  const nameOf = (id: string | null): string => participants.find((p) => p.id === id)?.pseudonym ?? "";
  const timeOf = (c: Coding): string => {
    const t = transcripts.find((n) => n.id === c.note_id);
    const segs = Array.isArray(t?.meta.segments) ? (t.meta.segments as Segment[]) : [];
    return stampOf(segs[c.segment]?.start ?? 0);
  };
  const keep = async (c: Coding, part: Partial<Coding>): Promise<void> => {
    const r = await saveCoding(w, c, part);
    if (r.ok) { onChanged(r.row); cue("saved"); }
  };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.field.retrieval.hint" /></p>
      <div className="flex flex-wrap gap-1">
        <ChipButton pressed={!code} onClick={() => setCode("")}>{both("rs.field.allcodes")}</ChipButton>
        {codes.map((c) => <ChipButton key={c.id} pressed={code === c.id} onClick={() => setCode(c.id)}><span className="rs-row-dot inline-block mr-1" style={{ "--tone": toneVar(c.colour) } as CSSProperties} />{c.name} ({codings.filter((x) => x.code_id === c.id).length})</ChipButton>)}
      </div>
      {!rows.length ? <p className="text-t2 text-ink-soft"><W k="rs.none" /></p> : (
        <ul className="grid gap-2" data-testid="rs-retrieval">
          {rows.map((c) => (
            <li key={c.id} className="grid gap-1">
              <p className="text-t1 text-ink-soft">{nameOf(c.participant_id)} · {interviews.find((s) => s.id === c.source_id)?.title ?? ""} · {timeOf(c)} · {codes.find((x) => x.id === c.code_id)?.name}</p>
              <p className="text-t2">{c.text}</p>
              <div className="grid gap-2 md:grid-cols-2">
                <Field id={`rs-ct-${c.id}`} label={<W k="rs.field.translation" />} defaultValue={c.translation ?? ""} onBlur={(e) => { if (e.target.value !== (c.translation ?? "")) void keep(c, { translation: e.target.value || null }); }} autoComplete="off" />
                <Field id={`rs-cm-${c.id}`} label={<W k="rs.field.memo" />} defaultValue={c.memo ?? ""} onBlur={(e) => { if (e.target.value !== (c.memo ?? "")) void keep(c, { memo: e.target.value || null }); }} autoComplete="off" />
              </div>
              <div><Button type="button" kind="quiet" size="sm" onClick={() => { void removeCoding(w, c).then((okd) => { if (okd) onGone(c); }); }}><W k="rs.delete" /></Button></div>
            </li>
          ))}
        </ul>
      )}
      <p className="text-t1 text-ink-soft">{lang === "bn" ? "" : ""}</p>
    </Surface>
  );
}

/* ---------- the matrices, derived ---------- */

function Heat({ m, rowName, colName, title }: { m: Matrix; rowName: (id: string) => string; colName: (id: string) => string; title: string }) {
  const max = Math.max(1, ...m.cells.flat());
  return (
    <div className="overflow-x-auto grid gap-1">
      <div className="flex flex-wrap items-center gap-2">
        <p className="text-t1 text-ink-soft mr-auto">{title}</p>
        <Button type="button" kind="ghost" size="sm" onClick={() => download(`${title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.csv`, matrixCsv({ rows: m.rows.map(rowName), cols: m.cols.map(colName), cells: m.cells }, title), "text/csv")}><W k="rs.rev.extract.csv" /></Button>
      </div>
      <table className="text-t1 tabular-nums">
        <thead><tr><th></th>{m.cols.map((c) => <th key={c} className="font-normal text-left align-bottom pr-2" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", maxHeight: "10rem" }}>{colName(c)}</th>)}</tr></thead>
        <tbody>
          {m.rows.map((r, i) => (
            <tr key={r}>
              <th className="text-left font-normal pr-2 whitespace-nowrap">{rowName(r)}</th>
              {m.cells[i].map((v, j) => <td key={j} className="text-center" style={{ minWidth: "2rem", background: v ? `color-mix(in oklab, var(--accent) ${Math.round((v / max) * 70) + 10}%, transparent)` : undefined }}>{v || ""}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Matrices({ codes, codings, participants, interviews }: Shared) {
  const codeIds = codes.map((c) => c.id);
  const codeName = (id: string): string => codes.find((c) => c.id === id)?.name ?? id;
  const pIds = participants.map((p) => p.id);
  const pName = (id: string): string => participants.find((p) => p.id === id)?.pseudonym ?? id;
  const ordered = [...interviews].sort((a, b) => a.created_at.localeCompare(b.created_at));
  const iName = (id: string): string => ordered.find((s) => s.id === id)?.title ?? id;
  if (!codings.length) return <Surface material="pane" className="px-4 py-3"><p className="text-t2 text-ink-soft"><W k="rs.field.matrices.none" /></p></Surface>;
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-4" data-testid="rs-matrices">
      <p className="text-t1 text-ink-soft"><W k="rs.field.matrices.hint" /></p>
      <Heat m={byParticipant(codings, codeIds, pIds)} rowName={codeName} colName={pName} title={both("rs.field.matrix.participant")} />
      <Heat m={coOccurrence(codings, codeIds)} rowName={codeName} colName={codeName} title={both("rs.field.matrix.cooccurrence")} />
      <Heat m={overInterviews(codings, codeIds, ordered.map((s) => s.id))} rowName={codeName} colName={iName} title={both("rs.field.matrix.interviews")} />
    </Surface>
  );
}

/* ---------- surveys, the one thing in D1 ---------- */

function Surveys({ w, lang, setSaid }: { w: Who; lang: "en" | "bn"; setSaid: (s: string) => void }) {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [chosen, setChosen] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [text, setText] = useState("");
  const [responses, setResponses] = useState<{ answers: Answers; at: string }[] | null>(null);
  useEffect(() => { void listSurveys(w).then(setSurveys); }, [w]);
  const s = surveys.find((x) => x.id === chosen) ?? null;
  useEffect(() => { setResponses(null); if (s) { setTitle(s.title); setIntro(s.intro); setText(questionsText(s.questions)); } }, [s]);

  const start = async (): Promise<void> => {
    const made = await addSurvey(w, { title: both("rs.field.survey.new"), questions: [], intro: "", token: tokenOf(crypto.randomUUID()) });
    if (made) { setSurveys((was) => [made, ...was]); setChosen(made.id); cue("saved"); }
  };
  const save = async (): Promise<void> => {
    if (!s) return;
    const r = await saveSurvey(w, s, { title: title.trim() || s.title, intro, questions: questionsOf(text) });
    if (r.ok) { setSurveys((was) => was.map((x) => (x.id === s.id ? r.row : x))); cue("saved"); setSaid(both("rs.saved")); }
  };
  const publish = async (open: boolean): Promise<void> => {
    if (!s) return;
    await save();
    const fresh = { ...s, title: title.trim() || s.title, intro, questions: questionsOf(text) };
    const done = await publishSurveyForm(w, fresh, open);
    if (!done) { setSaid(both("rs.field.survey.failed")); return; }
    const r = await saveSurvey(w, s, { open });
    if (r.ok) { setSurveys((was) => was.map((x) => (x.id === s.id ? r.row : x))); cue("saved"); }
  };
  const collect = async (): Promise<void> => {
    if (!s) return;
    const got = await surveyResponses(w, s.token);
    setResponses(got ?? []);
  };
  const asDataset = async (): Promise<void> => {
    if (!s || !responses) return;
    const table = responsesTable(s.questions, responses);
    const file = new File([tableCsv(table)], `${s.token}-responses.csv`, { type: "text/csv" });
    const made = await importFile(w, file, { name: `${s.title}: ${both("rs.field.responses")}`, provenance: { kind: "survey", token: s.token, responses: responses.length } });
    if ("error" in made) { setSaid(`${both("rs.lab.failed")}: ${made.error}`); return; }
    cue("saved"); setSaid(both("rs.field.survey.dataset.done"));
  };
  const url = s ? `${typeof location !== "undefined" ? location.origin : ""}/tools/research/survey/${s.token}` : "";
  return (
    <div className="rs-panes">
      <Surface material="pane" className="rs-list px-3 py-3 grid gap-3">
        <p className="text-t1 text-ink-soft"><W k="rs.field.surveys.hint" /></p>
        <div><Button type="button" kind="solid" size="sm" onClick={() => { void start(); }}><W k="rs.field.survey.new" /></Button></div>
        <ul className="rs-rows grid gap-1">
          {surveys.map((x) => (
            <li key={x.id}>
              <button type="button" className="rs-row" aria-current={x.id === chosen ? "true" : undefined} onClick={() => setChosen(x.id)}>
                <span className="rs-row-dot" aria-hidden="true" style={{ "--tone": toneVar(x.open ? "green" : "gold") } as CSSProperties} />
                <span className="rs-row-main"><span className="rs-row-title">{x.title}</span><span className="rs-row-sub">{x.questions.length} · {x.open ? both("rs.field.survey.open") : both("rs.field.survey.closed")}</span></span>
              </button>
            </li>
          ))}
        </ul>
      </Surface>
      <div className="rs-main grid gap-3 min-w-0">
        {!s ? <p className="text-t2 text-ink-soft"><W k="rs.field.surveys.pick" /></p> : (
          <Surface material="pane" className="px-4 py-3 grid gap-3">
            <div className="grid gap-2">
              <Field id="rs-fs-title" label={<W k="rs.rev.title" />} value={title} onChange={(e) => setTitle(e.target.value)} autoComplete="off" />
              <TextArea id="rs-fs-intro" label={<W k="rs.field.survey.intro" />} value={intro} onChange={(e) => setIntro(e.target.value)} rows={3} />
              <TextArea id="rs-fs-questions" label={<W k="rs.field.survey.questions" />} hint={<W k="rs.field.survey.questions.hint" />} value={text} onChange={(e) => setText(e.target.value)} rows={8} />
              <p className="text-t1 text-ink-soft">{Object.keys(QUESTION_TYPE_NAMES).map((k) => `${k}: ${QUESTION_TYPE_NAMES[k as keyof typeof QUESTION_TYPE_NAMES][lang]}`).join(" · ")}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" kind="solid" size="sm" onClick={() => { void save(); }}><W k="rs.field.survey.save" /></Button>
              <Button type="button" kind="soft" size="sm" onClick={() => { void publish(true); }}><W k="rs.field.survey.publish" /></Button>
              {s.open ? <Button type="button" kind="ghost" size="sm" onClick={() => { void publish(false); }}><W k="rs.field.survey.close" /></Button> : null}
              <Button type="button" kind="quiet" size="sm" onClick={() => { if (confirm(both("rs.field.survey.remove"))) void removeSurvey(w, s).then((okd) => { if (okd) { setSurveys((was) => was.filter((x) => x.id !== s.id)); setChosen(null); } }); }}><W k="rs.delete" /></Button>
            </div>
            {s.open ? <p className="text-t1"><W k="rs.field.survey.link" /> <a href={url} data-testid="rs-fs-link">{url}</a></p> : null}
            <div className="flex flex-wrap items-center gap-2">
              <Button type="button" kind="soft" size="sm" onClick={() => { void collect(); }}><W k="rs.field.survey.collect" /></Button>
              {responses ? <Chip tone="accent">{responses.length} {both("rs.field.responses")}</Chip> : null}
              {responses?.length ? <Button type="button" kind="ghost" size="sm" onClick={() => download(`${s.token}-responses.csv`, tableCsv(responsesTable(s.questions, responses)), "text/csv")}><W k="rs.rev.extract.csv" /></Button> : null}
              {responses?.length ? <Button type="button" kind="ghost" size="sm" onClick={() => { void asDataset(); }}><W k="rs.field.survey.dataset" /></Button> : null}
            </div>
            {responses?.length ? (
              <div className="overflow-x-auto" data-testid="rs-fs-responses">
                <table className="text-t1">
                  <thead><tr>{responsesTable(s.questions, responses).columns.map((c) => <th key={c} className="text-left font-normal text-ink-soft pr-3">{c}</th>)}</tr></thead>
                  <tbody>{responsesTable(s.questions, responses).rows.map((r, i) => <tr key={i}>{r.map((v, j) => <td key={j} className="pr-3">{v === null ? "" : String(v)}</td>)}</tr>)}</tbody>
                </table>
              </div>
            ) : null}
          </Surface>
        )}
      </div>
    </div>
  );
}

/* ---------- the interview guide: what was asked of whom ---------- */

function Guide({ w, interviews, setSaid }: Shared) {
  const [guide, setGuide] = useState<Note | null | undefined>(undefined);
  const [text, setText] = useState("");
  useEffect(() => {
    void listNotes(w, { kind: "memo", limit: 200 }).then((notes) => {
      const found = notes.find((n) => n.meta.guide === true) ?? null;
      setGuide(found);
      if (found) setText(guideOf(found.meta).questions.join("\n"));
    });
  }, [w]);
  const save = async (): Promise<void> => {
    const questions = text.split("\n").map((q) => q.trim()).filter(Boolean);
    if (guide) {
      const r = await saveNote(w, guide.id, { meta: { ...guide.meta, questions }, text: questions.join("\n"), body: questions.map((q) => `<p>${q.replace(/</g, "&lt;")}</p>`).join("") }, guide.title);
      if (r.ok) { setGuide(r.row); cue("saved"); setSaid(both("rs.saved")); }
    } else {
      const n = await addNote(w, { kind: "memo", title: both("rs.field.guide"), meta: { guide: true, questions, asked: {} }, text: questions.join("\n"), body: questions.map((q) => `<p>${q.replace(/</g, "&lt;")}</p>`).join("") });
      if (n) { setGuide(n); cue("saved"); }
    }
  };
  const tick = async (interview: string, q: number): Promise<void> => {
    if (!guide) return;
    const g = guideOf(guide.meta);
    const had = g.asked[interview] ?? [];
    const asked = { ...g.asked, [interview]: had.includes(q) ? had.filter((x) => x !== q) : [...had, q].sort((a, b) => a - b) };
    const r = await saveNote(w, guide.id, { meta: { ...guide.meta, asked } }, guide.title);
    if (r.ok) { setGuide(r.row); cue("tick"); }
  };
  const g = guide ? guideOf(guide.meta) : { questions: [], asked: {} };
  return (
    <Surface material="pane" className="px-4 py-3 grid gap-3">
      <p className="text-t1 text-ink-soft"><W k="rs.field.guide.hint" /></p>
      <TextArea id="rs-fg-questions" label={<W k="rs.field.guide.questions" />} value={text} onChange={(e) => setText(e.target.value)} rows={6} />
      <div><Button type="button" kind="solid" size="sm" onClick={() => { void save(); }}><W k="rs.field.guide.save" /></Button></div>
      {guide && g.questions.length && interviews.length ? (
        <div className="overflow-x-auto">
          <table className="text-t1" data-testid="rs-guide">
            <thead><tr><th></th>{interviews.map((s) => <th key={s.id} className="font-normal text-left align-bottom pr-2" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)", maxHeight: "10rem" }}>{s.title}</th>)}</tr></thead>
            <tbody>
              {g.questions.map((q, i) => (
                <tr key={i}>
                  <th className="text-left font-normal pr-2 max-w-[24rem]">{q}</th>
                  {interviews.map((s) => (
                    <td key={s.id} className="text-center">
                      <input type="checkbox" aria-label={`${q} · ${s.title}`} checked={(g.asked[s.id] ?? []).includes(i)} onChange={() => { void tick(s.id, i); }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </Surface>
  );
}
