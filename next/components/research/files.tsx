"use client";

/* ============================================================
   research/files.tsx: the files a source carries.

   A PDF, audio, a data file or a picture, sent to the Worker as
   bytes and kept in R2 under the reader's prefix; the key comes
   back and goes on the source row as one of its `files`. A web
   page is captured the same way, through the Worker, so a page
   that changes or dies is still the page that was read.

   `files` is a jsonb column and PostgREST replaces it whole, so
   every write here sends the whole list it has. RESEARCH.md
   sections 11 and 23.
   ============================================================ */

import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { FILE_TYPES, fileKind, fileSize, toneVar, type SourceFile } from "@reiad/shared/research";
import { attachFile, captureUrl, saveSource, uploadFile, type Source, type Who } from "../../lib/research-api";
import { Button, ButtonLabel } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { cue } from "../../lib/sound";
import { W, both } from "./lang";

const ACCEPT = Object.keys(FILE_TYPES).map((ext) => `.${ext}`).join(",") + ",.jpeg,.htm";

export function FileBox({ w, source, onChange }: {
  w: Who; source: Source; onChange: (s: Source) => void;
}) {
  const box = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState("");
  const files = source.files as SourceFile[];

  const put = useCallback(async (file: File) => {
    setBusy(true);
    setSaid(both("rs.lib.uploading"));
    try {
      const up = await uploadFile(w, file);
      if (!up.ok) { setSaid(up.reason === "over-quota" ? both("rs.lib.file.quota") : both("rs.lib.file.failed")); return; }
      const r = await attachFile(w, source, {
        key: up.key, kind: fileKind(up.ext), ext: up.ext, size: up.size, name: file.name, added: new Date().toISOString(),
      }, source.updated_at);
      if (!r.ok) { setSaid(both("rs.notsaved")); return; }
      onChange(r.row);
      setSaid("");
      cue("saved");
    } finally { setBusy(false); }
  }, [w, source, onChange]);

  const capture = useCallback(async () => {
    if (!source.url) return;
    setBusy(true);
    setSaid(both("rs.moment"));
    try {
      const got = await captureUrl(w, source.url);
      if (!got.ok) { setSaid(both("rs.lib.file.failed")); return; }
      const r = await attachFile(w, source, {
        key: got.key, kind: "html", ext: "html", size: got.size, name: got.title || source.url, added: new Date().toISOString(),
      }, source.updated_at);
      if (!r.ok) { setSaid(both("rs.notsaved")); return; }
      onChange(r.row);
      setSaid("");
      cue("saved");
    } finally { setBusy(false); }
  }, [w, source, onChange]);

  const detach = useCallback(async (key: string) => {
    const r = await saveSource(w, source, { files: files.filter((f) => f.key !== key) } as Partial<Source>, source.updated_at);
    if (r.ok) { onChange(r.row); cue("saved"); } else setSaid(both("rs.notsaved"));
  }, [w, source, files, onChange]);

  const hasCapture = files.some((f) => f.kind === "html");

  return (
    <div className="grid gap-2">
      <h3 className="text-t2 font-medium"><W k="rs.lib.files" /></h3>
      {files.length ? (
        <ul className="grid gap-1 text-t2">
          {files.map((f) => (
            <li key={f.key} className="flex flex-wrap items-center gap-2">
              <span style={{ "--accent": toneVar(f.kind === "pdf" ? "blue" : f.kind === "audio" ? "rose" : f.kind === "html" ? "teal" : "gold") } as React.CSSProperties}>
                <Chip tone="accent">{f.ext}</Chip>
              </span>
              <span className="grow min-w-0 truncate">{f.name || f.key.split("/").pop()}</span>
              <span className="text-t1 text-ink-soft mono">{fileSize(f.size)}{f.pages ? ` · ${f.pages} ${both("rs.read.pages")}` : ""}</span>
              {f.kind === "pdf" || f.kind === "html" || f.kind === "audio" || f.kind === "image" ? (
                <ChipLink href={`/tools/research/read?source=${source.id}&file=${encodeURIComponent(f.key)}`}><W k="rs.lib.read" /></ChipLink>
              ) : null}
              <ChipButton onClick={() => { void detach(f.key); }}><W k="rs.lib.file.remove" /></ChipButton>
            </li>
          ))}
        </ul>
      ) : <p className="text-t1 text-ink-soft"><W k="rs.read.nofile" /></p>}
      <div className="flex flex-wrap items-center gap-2">
        <ButtonLabel kind="soft" size="sm">
          <W k="rs.lib.file.add" />
          <input ref={box} type="file" accept={ACCEPT} hidden disabled={busy}
                 onChange={(e) => { const f = e.target.files?.[0]; if (f) void put(f); e.target.value = ""; }} />
        </ButtonLabel>
        {source.url && !hasCapture ? (
          <Button kind="quiet" size="sm" disabled={busy} onClick={() => { void capture(); }} title={both("rs.lib.file.capture.hint")}>
            <W k="rs.lib.file.capture" />
          </Button>
        ) : null}
        <span className="text-t1 text-ink-soft"><W k="rs.lib.file.hint" /></span>
      </div>
      {said ? <p className="text-t1 text-ink-soft" role="status">{said}</p> : null}
    </div>
  );
}

/** A link into the reader for a source, at the file it should
    open on: the PDF first, then a captured page, then audio. */
export function readHref(s: Source): string | null {
  const files = s.files as SourceFile[];
  const first = files.find((f) => f.kind === "pdf") ?? files.find((f) => f.kind === "html") ?? files.find((f) => f.kind === "audio") ?? files[0];
  if (!first && s.type !== "book") return null;
  return first ? `/tools/research/read?source=${s.id}&file=${encodeURIComponent(first.key)}` : `/tools/research/read?source=${s.id}`;
}
