"use client";

/* ============================================================
   research/archive.tsx: everything that happened, the bin, and
   the way out.

   The activity log is one line per write, written by
   `research-api.ts` on every call. The bin is every source and
   note with `deleted_at` set, restorable for thirty days. The
   copy is every table as JSON with the library as BibTeX and
   RIS beside it, built in the browser; the account page's own
   "take a copy of everything" carries the same rows, and this
   is the studio's own door for the same reason the diet tool has
   a doctor's page.
   ============================================================ */

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toneVar } from "@reiad/shared/research";
import { toBibtex, toRis } from "@reiad/shared/research-bib";
import {
  listActivity, listCollections, listLists, listNotes, listProjects, listQuestions, listSources,
  listTasks, unbin, type Activity, type Note, type Source,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipButton, ChipLink } from "../ui/chip";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho, when } from "./use-who";

export function Archive() {
  const { w, answered } = useWho();
  const [log, setLog] = useState<Activity[] | null>(null);
  const [binnedSources, setBinnedSources] = useState<Source[]>([]);
  const [binnedNotes, setBinnedNotes] = useState<Note[]>([]);
  const [busy, setBusy] = useState(false);
  const [href, setHref] = useState<{ json: string; bib: string; ris: string } | null>(null);

  const reload = useCallback(async () => {
    if (!w) return;
    const [a, s, n] = await Promise.all([listActivity(w, 300), listSources(w, { binned: true }), listNotes(w, { binned: true })]);
    setLog(a);
    setBinnedSources(s);
    setBinnedNotes(n);
  }, [w]);
  useEffect(() => { void reload(); }, [reload]);

  const copy = useCallback(async () => {
    if (!w) return;
    setBusy(true);
    try {
      const [projects, collections, sources, notes, questions, tasks, lists, activity] = await Promise.all([
        listProjects(w), listCollections(w), listSources(w, { limit: 5000 }), listNotes(w, { limit: 5000 }),
        listQuestions(w), listTasks(w), listLists(w), listActivity(w, 5000),
      ]);
      const bundle = {
        studio: "reiad.co.uk research studio", taken: new Date().toISOString(),
        projects, collections, sources, notes, questions, tasks, lists, activity,
      };
      const blob = (text: string, type: string): string => URL.createObjectURL(new Blob([text], { type }));
      setHref({
        json: blob(JSON.stringify(bundle, null, 2), "application/json"),
        bib: blob(sources.map((s) => toBibtex(s.csl, s.key)).join("\n\n"), "application/x-bibtex"),
        ris: blob(sources.map((s) => toRis(s.csl, s.key)).join("\n\n"), "application/x-research-info-systems"),
      });
      cue("saved");
    } finally { setBusy(false); }
  }, [w]);

  const restore = async (table: "research_sources" | "research_notes", id: string, title: string): Promise<void> => {
    if (!w) return;
    if (await unbin(w, table, id, title)) { cue("saved"); await reload(); }
  };

  if (!w) return <SignedOut answered={answered} />;

  const day = new Date().toISOString().slice(0, 10);

  return (
    <div className="grid gap-6">
      <Surface material="pane" className="px-5 py-4 grid gap-3" accent={toneVar("rose")}>
        <h2 className="text-t3 font-medium"><W k="rs.arc.export" /></h2>
        <p className="text-t2 text-ink-soft"><W k="rs.arc.export.hint" /></p>
        <div className="flex flex-wrap gap-2 items-center">
          <Button kind="solid" size="sm" disabled={busy} onClick={() => { void copy(); }}><W k="rs.arc.export" /></Button>
          {href ? (
            <>
              <ChipLink href={href.json} download={`research-studio-${day}.json`}>JSON</ChipLink>
              <ChipLink href={href.bib} download={`research-library-${day}.bib`}>BibTeX</ChipLink>
              <ChipLink href={href.ris} download={`research-library-${day}.ris`}>RIS</ChipLink>
            </>
          ) : null}
        </div>
      </Surface>

      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h2 className="text-t3 font-medium"><W k="rs.arc.bin" /></h2>
        <p className="text-t1 text-ink-soft"><W k="rs.lib.bin.hint" /></p>
        {!binnedSources.length && !binnedNotes.length ? <p className="text-t2 text-ink-soft"><W k="rs.none" /></p> : (
          <ul className="grid gap-1 text-t2">
            {binnedSources.map((s) => (
              <li key={s.id} className="flex items-center gap-2">
                <ChipButton onClick={() => { void restore("research_sources", s.id, s.title); }}><W k="rs.restore" /></ChipButton>
                <span>{s.title}</span><span className="text-t1 text-ink-soft mono">{when(s.deleted_at)}</span>
              </li>
            ))}
            {binnedNotes.map((n) => (
              <li key={n.id} className="flex items-center gap-2">
                <ChipButton onClick={() => { void restore("research_notes", n.id, n.title || n.kind); }}><W k="rs.restore" /></ChipButton>
                <span>{n.title || n.text.slice(0, 60)}</span><span className="text-t1 text-ink-soft mono">{when(n.deleted_at)}</span>
              </li>
            ))}
          </ul>
        )}
      </Surface>

      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h2 className="text-t3 font-medium"><W k="rs.arc.activity" /></h2>
        {log === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
          : !log.length ? <p className="text-t2 text-ink-soft"><W k="rs.arc.activity.empty" /></p> : (
            <ol className="grid gap-1 text-t2">
              {log.map((a) => (
                <li key={a.id} className="flex flex-wrap items-baseline gap-2">
                  <span className="text-t1 text-ink-soft mono w-16">{when(a.created_at)}</span>
                  <Chip>{a.kind}</Chip>
                  <span className="text-t1 text-ink-soft">{a.action}</span>
                  {a.item_id && (a.kind === "sources" || a.kind === "notes") ? (
                    <Link href={`/tools/research/${a.kind === "sources" ? "library" : "notes"}/${a.item_id}`}>{a.summary}</Link>
                  ) : <span>{a.summary}</span>}
                </li>
              ))}
            </ol>
          )}
        <p className="text-t1 text-ink-soft"><T en="Versions of a note are kept every ten minutes of typing and will be listed here in a later stage." bn="নোটের সংস্করণ প্রতি দশ মিনিটের লেখায় রাখা হয়, আর পরের ধাপে এখানে দেখানো হবে।" /> {both("rs.arc.versions")}</p>
      </Surface>
    </div>
  );
}
