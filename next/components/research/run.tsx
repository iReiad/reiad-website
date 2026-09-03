"use client";

/* ============================================================
   research/run.tsx: one run, whole. RESEARCH.md section 14.

   A run is a page so a draft's figure or table can point at it:
   the label, the kind, the dataset, exactly what was asked, the
   code, the answer's tables, the APA rendering and the figure.
   The figure is the stored SVG shown through an image from a data
   URL, never written into the document, so a row can hold nothing
   that runs.
   ============================================================ */

import { useEffect, useState } from "react";
import { getRun, type Run } from "../../lib/research-api";
import { Button, ButtonLink } from "../ui/button";
import { Chip } from "../ui/chip";
import { Surface } from "../ui/surface";
import { W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { ResultTable, type OutTable } from "./lab";

const svgUrl = (svg: string): string => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

function download(name: string, body: string, type: string): void {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement("a");
  a.href = url; a.download = name;
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const csvOf = (t: OutTable): string => {
  const esc = (v: unknown): string => `"${String(v ?? "").replace(/"/g, "\"\"")}"`;
  return `${[t.columns.map(esc).join(","), ...t.rows.map((r) => r.map(esc).join(","))].join("\n")}\n`;
};

export function RunPage({ id }: { id: string }) {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [run, setRun] = useState<Run | null | undefined>(undefined);
  useEffect(() => { if (w) void getRun(w, id).then(setRun); }, [w, id]);
  if (!w) return <SignedOut answered={answered} />;
  if (run === undefined) return <p className="text-t2 text-ink-soft" role="status"><W k="rs.moment" /></p>;
  if (run === null) return <p className="text-t2 text-ink-soft"><W k="rs.lab.run.missing" /></p>;
  const out = run.output as { summary?: string; tables?: OutTable[]; apa?: string | null; notes?: string | null; columns?: string[]; rows?: unknown[][]; total?: number };
  const tables: OutTable[] = out.tables ?? (out.columns && out.rows ? [{ title: `${out.total ?? out.rows.length}`, columns: out.columns, rows: out.rows as OutTable["rows"] }] : []);
  return (
    <div className="grid gap-3" data-testid="rs-run">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-t3 font-medium mr-auto">{run.label || run.kind}</h2>
        <Chip tone="accent">{run.kind}</Chip>
        <Chip>{new Date(run.created_at).toLocaleString(lang === "bn" ? "bn-BD" : "en-GB")}</Chip>
        <ButtonLink href="/tools/research/lab" kind="ghost" size="sm"><W k="rs.lab.back" /></ButtonLink>
      </div>
      {out.summary ? <p className="text-t1">{out.summary}</p> : null}
      <Surface material="sunk" className="px-3 py-2 grid gap-1 text-t1">
        <p><W k="rs.lab.run.input" />: <code>{JSON.stringify(run.input)}</code></p>
        {run.data_hash ? <p><W k="rs.lab.run.hash" />: <code>{run.data_hash}</code></p> : null}
        {run.code ? <pre className="whitespace-pre-wrap font-mono">{run.code}</pre> : null}
      </Surface>
      {tables.map((t, i) => (
        <Surface key={i} material="pane" className="px-4 py-3 grid gap-2">
          <ResultTable table={t} />
          <div><Button type="button" kind="ghost" size="sm" onClick={() => download(`${(run.label || run.kind).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}-${i + 1}.csv`, csvOf(t), "text/csv")}><W k="rs.rev.extract.csv" /></Button></div>
        </Surface>
      ))}
      {out.apa ? (
        <Surface material="pane" className="px-4 py-3 grid gap-2">
          <p className="text-t1 text-ink-soft"><W k="rs.lab.apa" /></p>
          <pre className="text-t1 whitespace-pre-wrap" data-testid="rs-run-apa">{out.apa}</pre>
          <div><Button type="button" kind="ghost" size="sm" onClick={() => { void navigator.clipboard?.writeText(out.apa ?? ""); }}><W k="rs.lab.apa.copy" /></Button></div>
        </Surface>
      ) : null}
      {run.figure ? (
        <Surface material="pane" className="px-4 py-3 grid gap-2">
          <img src={svgUrl(run.figure)} alt={run.label} className="max-w-full h-auto" data-testid="rs-run-figure" />
          <div><Button type="button" kind="ghost" size="sm" onClick={() => download(`${(run.label || run.kind).replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.svg`, run.figure ?? "", "image/svg+xml")}><W k="rs.rev.svg" /></Button></div>
        </Surface>
      ) : null}
      <p className="text-t1 text-ink-soft">{both("rs.lab.run.cite")} <code>run:{run.id}</code></p>
    </div>
  );
}
