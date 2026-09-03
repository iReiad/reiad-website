"use client";

/* ============================================================
   research/queue.tsx: what is waiting to be read.

   Every source with a file and a status short of read, and every
   book, in priority order and then by when it was last touched.
   Each row says its abstract's first line, its `why`, its page
   count and where the reader got to. Enter opens the top one; j
   and k walk the list. On a phone this page and the reader are
   the studio. RESEARCH.md section 11.
   ============================================================ */

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { fileSize, sourceType, toneVar, type SourceFile } from "@reiad/shared/research";
import { listQueue, type Source } from "../../lib/research-api";
import { forgetFile, listKept, type KeptFile } from "../../lib/offline-files";
import { Chip, ChipButton } from "../ui/chip";
import { Surface } from "../ui/surface";
import { W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";
import { useKeys } from "./keys";
import { KEPT_EVENT, readHref } from "./files";
import { Reader } from "./reader";

/** The queue, or the reader: `?source=` decides, read after the
    first paint because the server has no idea and must not guess. */
export function ReadingRoom() {
  const [source, setSource] = useState<string | null | undefined>(undefined);
  useEffect(() => {
    const read = (): void => setSource(new URLSearchParams(location.search).get("source"));
    read();
    window.addEventListener("popstate", read);
    return () => window.removeEventListener("popstate", read);
  }, []);
  if (source === undefined) return null;
  return source ? <Reader id={source} /> : <Queue />;
}

export function Queue() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const router = useRouter();
  const [rows, setRows] = useState<Source[] | null>(null);
  const [on, setOn] = useState(0);

  useEffect(() => { if (w) void listQueue(w).then(setRows); }, [w]);

  const open = (s: Source | undefined): void => { const href = s ? readHref(s) : null; if (href) router.push(href); };

  useKeys(useMemo(() => ({
    Enter: () => open(rows?.[on]),
    j: () => setOn((i) => Math.min((rows?.length ?? 1) - 1, i + 1)),
    k: () => setOn((i) => Math.max(0, i - 1)),
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }), [rows, on]), Boolean(w));

  if (!w) return <SignedOut answered={answered} />;

  return (
    <Surface material="pane" className="rs-tint px-5 py-4 grid gap-3">
      <h2 className="text-t3 font-medium"><W k="rs.read.queue" /> {rows ? <Chip>{rows.length}</Chip> : null}</h2>
      <p className="text-t2 text-ink-soft"><W k="rs.read.queue.hint" /></p>
      {rows === null ? <p className="text-t2 text-ink-soft"><W k="rs.moment" /></p>
        : !rows.length ? <p className="text-t2 text-ink-soft"><W k="rs.read.queue.empty" /></p> : (
          <ul className="rs-rows grid gap-1">
            {rows.map((s, i) => {
              const type = sourceType(s.type);
              const pdf = (s.files as SourceFile[]).find((f) => f.kind === "pdf") ?? (s.files as SourceFile[])[0];
              return (
                <li key={s.id}>
                  <button type="button" className="rs-row" aria-current={i === on ? "true" : undefined}
                          style={{ "--tone": toneVar(type.tone) } as React.CSSProperties}
                          onClick={() => { setOn(i); open(s); }}>
                    <span className="rs-row-dot" aria-hidden="true" />
                    <span className="rs-row-main">
                      <span className="rs-row-title">{s.title}</span>
                      <span className="rs-row-sub">
                        {s.authors}{s.year ? ` · ${s.year}` : ""}{s.why ? ` · ${s.why}` : s.abstract ? ` · ${s.abstract.slice(0, 120)}` : ""}
                      </span>
                    </span>
                    <span className="rs-row-meta">
                      {s.priority ? <span className="text-t1 mono">{"★".repeat(s.priority)}</span> : null}
                      <span className="text-t1 text-ink-soft mono">
                        {pdf?.pages ? `${pdf.page ?? 1} / ${pdf.pages}` : lang === "bn" ? type.name.bn : type.name.en}
                      </span>
                      <span className="text-t1 text-ink-soft">{both(`rs.lib.status.${s.status}`)}</span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
    </Surface>
  );
}
