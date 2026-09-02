"use client";

/* ============================================================
   research/library.tsx: every source, and one page per source.

   Three panes: the list with its filters on the left, the chosen
   source in the middle as a form that saves as it is typed, and
   the source's own connections in its foot. Above the list, the
   add bar: a DOI, an ISBN, a link or a pasted record, or a file
   dropped on the list.

   Nothing typed that could have been picked: a source arrives by
   lookup, by parse or by import, and the reader corrects a
   record rather than typing one from nothing. Duplicates are
   refused on arrival by DOI and ISBN and offered as a merge by
   title hash.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SOURCE_STATUSES, SOURCE_TYPES, captureShape, sourceType, toneVar, type CslItem } from "@reiad/shared/research";
import { parseAny } from "@reiad/shared/research-bib";
import {
  addSource, findDuplicate, listCollections, listProjects, listSources, logImport, lookupDoi,
  lookupIsbn, lookupUrl,
  type Collection, type Project, type Source, type Who,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Empty } from "../ui/note";
import { Surface } from "../ui/surface";
import { Icon } from "../icons";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { SourceCard } from "./source";
import { useWho, when } from "./use-who";
import { useKeys } from "./keys";

export function Library({ openId }: { openId?: string }) {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [rows, setRows] = useState<Source[] | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [open, setOpen] = useState<string | null>(openId ?? null);
  const [find, setFind] = useState("");
  const [type, setType] = useState("");
  const [status, setStatus] = useState("");
  const [project, setProject] = useState("");
  const [binned, setBinned] = useState(false);
  const [line, setLine] = useState("");
  const [busy, setBusy] = useState(false);
  const [said, setSaid] = useState<string>("");
  const [merge, setMerge] = useState<{ found: CslItem; with: Source } | null>(null);
  const findBox = useRef<HTMLInputElement>(null);
  const fileBox = useRef<HTMLInputElement>(null);

  const reload = useCallback(async () => {
    if (!w) return;
    const [s, p, c] = await Promise.all([
      listSources(w, { type, status, project, binned }), listProjects(w), listCollections(w),
    ]);
    setRows(s);
    setProjects(p);
    setCollections(c);
  }, [w, type, status, project, binned]);

  useEffect(() => { void reload(); }, [reload]);
  useEffect(() => { if (openId) setOpen(openId); }, [openId]);

  const shown = useMemo(() => {
    if (!rows) return [];
    const needle = find.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((s) =>
      `${s.title} ${s.authors} ${s.year ?? ""} ${s.key} ${s.tags.join(" ")} ${s.why ?? ""}`
        .toLowerCase().includes(needle));
  }, [rows, find]);

  const current = useMemo(() => shown.find((s) => s.id === open) ?? rows?.find((s) => s.id === open) ?? null, [shown, rows, open]);

  const move = useCallback((by: number) => {
    if (!shown.length) return;
    const at = shown.findIndex((s) => s.id === open);
    const next = Math.min(shown.length - 1, Math.max(0, at + by));
    setOpen(shown[next].id);
  }, [shown, open]);

  useKeys(useMemo(() => ({
    f: () => findBox.current?.focus(),
    j: () => move(1),
    k: () => move(-1),
    Escape: () => setOpen(null),
  }), [move]), Boolean(w));

  /** One record in. Refused when a DOI or ISBN is already here,
      offered as a merge when only the title matches. */
  const take = useCallback(async (csl: CslItem, via: Parameters<typeof addSource>[2]["via"], extra: Partial<Parameters<typeof addSource>[2]> = {}): Promise<Source | null> => {
    if (!w) return null;
    const dup = await findDuplicate(w, csl);
    if (dup?.sure) { setOpen(dup.source.id); setSaid(both("rs.board.decided.dup")); return null; }
    if (dup && !extra.verified) { setMerge({ found: csl, with: dup.source }); return null; }
    const s = await addSource(w, csl, { via, verified: extra.verified ?? true, ...extra });
    return s;
  }, [w]);

  const add = useCallback(async () => {
    if (!w || !line.trim() || busy) return;
    setBusy(true);
    setSaid("");
    const text = line.trim();
    const shape = captureShape(text);
    try {
      let made: Source | null = null;
      if (shape === "doi" || shape === "isbn" || shape === "url") {
        const found = shape === "doi" ? await lookupDoi(text) : shape === "isbn" ? await lookupIsbn(text) : await lookupUrl(text);
        if (!found) { setSaid(both("rs.board.decided.fail")); return; }
        made = await take(found.csl, shape, {
          verified: found.via !== "clip" || Boolean(found.csl.DOI),
          retracted: found.retracted ?? null,
          oa: found.openalex ? { isOa: found.openalex.oa, url: found.openalex.oaUrl, at: new Date().toISOString() } : null,
          identifiers: found.openalex ? { openalex: found.openalex.id } : {},
        });
      } else {
        const { items, format } = parseAny(text);
        if (!items.length) { setSaid(both("rs.board.decided.fail")); return; }
        let count = 0;
        for (const item of items) {
          const s = await take(item, format === "csl" ? "csl" : format === "ris" ? "ris" : "bibtex", { verified: true });
          if (s) { made = s; count += 1; }
        }
        setSaid(`${count} ${both("rs.lib.imported")}, ${items.length - count} ${both("rs.lib.skipped")}`);
      }
      if (made) { cue("saved"); setLine(""); setOpen(made.id); }
      await reload();
    } finally { setBusy(false); }
  }, [w, line, busy, take, reload]);

  const importFile = useCallback(async (file: File) => {
    if (!w) return;
    setBusy(true);
    try {
      const text = await file.text();
      const { items, format } = parseAny(text);
      let count = 0;
      for (const item of items) {
        const s = await take(item, format === "csl" ? "csl" : format === "ris" ? "ris" : "bibtex", { verified: true });
        if (s) count += 1;
      }
      await logImport(w, `${file.name}: ${count} of ${items.length}`);
      setSaid(`${count} ${both("rs.lib.imported")}, ${items.length - count} ${both("rs.lib.skipped")}`);
      cue("saved");
      await reload();
    } finally { setBusy(false); }
  }, [w, take, reload]);

  if (!w) return <SignedOut answered={answered} />;

  return (
    <div className="grid gap-4">
      {/* ---- the add bar ---- */}
      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <form className="flex flex-wrap items-end gap-3" onSubmit={(e) => { e.preventDefault(); void add(); }}>
          <div className="grow min-w-[16rem]">
            <Field id="rs-add" label={<W k="rs.lib.add" />} hint={<W k="rs.lib.add.hint" />}
                   value={line} onChange={(e) => setLine(e.target.value)} autoComplete="off" disabled={busy} />
          </div>
          <Button type="submit" kind="solid" disabled={busy || !line.trim()}><W k="rs.lib.lookup" /></Button>
          <Button type="button" kind="soft" disabled={busy} onClick={() => fileBox.current?.click()}>
            <W k="rs.lib.import" />
          </Button>
          <input ref={fileBox} type="file" accept=".bib,.bibtex,.ris,.json,.txt" hidden
                 onChange={(e) => { const f = e.target.files?.[0]; if (f) void importFile(f); e.target.value = ""; }} />
        </form>
        {said ? <p className="text-t2 text-ink-soft" role="status">{said}</p> : null}
        {merge ? (
          <Surface material="sunk" className="px-4 py-3 grid gap-2">
            <p className="text-t2"><W k="rs.lib.merge" /> <strong>{merge.with.title}</strong></p>
            <div className="flex gap-2">
              <Button size="sm" kind="soft" onClick={() => { setOpen(merge.with.id); setMerge(null); }}><W k="rs.lib.open" /></Button>
              <Button size="sm" kind="quiet" onClick={() => {
                void addSource(w, merge.found, { via: "manual", verified: false }).then((s) => { setMerge(null); if (s) { setOpen(s.id); void reload(); } });
              }}><T en="Keep both" bn="দুটোই রাখুন" /></Button>
            </div>
          </Surface>
        ) : null}
      </Surface>

      <div className="rs-panes">
        {/* ---- the list ---- */}
        <section className="rs-list grid gap-3 content-start" aria-label="Sources / উৎস"
                 onDragOver={(e) => { e.preventDefault(); }}
                 onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) void importFile(f); }}>
          <Field id="rs-find" ref={findBox} label={<W k="rs.find" />} hideLabel placeholder={both("rs.find")}
                 value={find} onChange={(e) => setFind(e.target.value)} autoComplete="off" />
          <div className="grid gap-2 grid-cols-2">
            <Select id="rs-type" label={<W k="rs.lib.type" />} value={type} onChange={(e) => setType(e.target.value)}>
              <option value="">{both("rs.all")}</option>
              {SOURCE_TYPES.map((t) => <option key={t.id} value={t.id}>{lang === "bn" ? t.name.bn : t.name.en}</option>)}
            </Select>
            <Select id="rs-status" label={<W k="rs.lib.status" />} value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">{both("rs.all")}</option>
              {SOURCE_STATUSES.map((s) => <option key={s} value={s}>{both(`rs.lib.status.${s}`)}</option>)}
            </Select>
            <Select id="rs-project" label={<W k="rs.project" />} value={project} onChange={(e) => setProject(e.target.value)}>
              <option value="">{both("rs.all")}</option>
              {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </Select>
            <div className="flex items-end">
              <ChipButton pressed={binned} onClick={() => setBinned((b) => !b)}><W k="rs.lib.bin" /></ChipButton>
            </div>
          </div>
          <p className="text-t1 text-ink-soft mono">{shown.length}</p>
          {rows === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
            : !shown.length ? (
              <Empty title={<W k="rs.none" />} action={<span className="text-t2 text-ink-soft"><W k="rs.lib.empty" /></span>} />
            ) : (
              <ul className="rs-rows grid gap-1">
                {shown.map((s) => {
                  const t = sourceType(s.type);
                  return (
                    <li key={s.id}>
                      <button type="button" className="rs-row" aria-current={s.id === open ? "true" : undefined}
                              style={{ "--tone": toneVar(t.tone) } as React.CSSProperties}
                              onClick={() => setOpen(s.id)}>
                        <span className="rs-row-dot" aria-hidden="true" />
                        <span className="rs-row-main">
                          <span className="rs-row-title">{s.title}</span>
                          <span className="rs-row-sub">{s.authors}{s.year ? ` · ${s.year}` : ""}</span>
                        </span>
                        <span className="rs-row-meta">
                          <Chip>{both(`rs.lib.status.${s.status}`)}</Chip>
                          <span className="text-t1 text-ink-soft mono">{when(s.updated_at)}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
        </section>

        {/* ---- the open source ---- */}
        <section className="rs-main min-w-0" aria-live="polite">
          {current ? (
            <SourceCard w={w} source={current} projects={projects} collections={collections}
                        onChange={(s) => setRows((was) => (was ?? []).map((x) => (x.id === s.id ? s : x)))}
                        onGone={() => { setOpen(null); void reload(); }} />
          ) : (
            <Surface material="sunk" className="px-5 py-8 text-t2 text-ink-soft flex items-center gap-2">
              <Icon name="book" size={18} /> <T en="Choose a source, or add one above." bn="একটা উৎস বাছুন, বা উপরে একটা যোগ করুন।" />
            </Surface>
          )}
        </section>
      </div>
    </div>
  );
}
