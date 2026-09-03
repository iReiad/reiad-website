"use client";

/* ============================================================
   research/methods.tsx: the methods room. RESEARCH.md section 20.

   A method is a piece with the tag `method`, so the room owns no
   rows: it draws the twelve the table plans, by kind, and asks the
   public articles list which of them have been written. A written
   one is a card that goes to the piece, with its cover; one with a
   lesson written here under `lib/methods/` goes there; one with
   neither is promised rather than linked, which is the deck's own
   distinction. A method piece the table does not plan is listed
   after them, so the newest lesson is never the one without a
   card. Public, because a piece is public: the one part of the
   studio a stranger reads.
   ============================================================ */

import { useEffect, useState } from "react";
import { lookFor } from "@reiad/shared/look";
import { toneVar } from "@reiad/shared/research";
import { GoCard, SoonCard } from "../deck";
import { KIND_TONE, METHOD_KINDS, RESEARCH_METHODS, isMethodPiece, type MethodKind } from "../../lib/research-methods";
import { writtenLesson } from "../../lib/methods/written";
import { researchPage } from "../../lib/research-pages";
import { T, W, both } from "./lang";

interface Listed { slug: string; title: string; dek: string | null; tag: string | null; topics: string | null; lang: string | null; minutes: number | null; section: string | null; cover: string | null }

const urlOf = (p: Listed): string => `${lookFor(p.section ?? "insights").mount}${p.slug}.html`;

export function Methods() {
  const [pieces, setPieces] = useState<Listed[] | null | "failed">(null);
  const art = researchPage("/tools/research/methods")?.art;

  useEffect(() => {
    let alive = true;
    fetch("/api/articles")
      .then((r): Promise<{ ok?: boolean; articles?: Listed[] } | null> => (r.ok ? r.json() as Promise<{ ok?: boolean; articles?: Listed[] }> : Promise.resolve(null)))
      .then((d) => { if (alive) setPieces(d?.ok && Array.isArray(d.articles) ? d.articles.filter(isMethodPiece) : "failed"); })
      .catch(() => { if (alive) setPieces("failed"); });
    return () => { alive = false; };
  }, []);

  const written = new Map((pieces === null || pieces === "failed" ? [] : pieces).map((p) => [p.slug, p]));
  const more = pieces === null || pieces === "failed" ? [] : pieces.filter((p) => !RESEARCH_METHODS.some((m) => m.slug === p.slug));

  return (
    <div className="grid gap-6" data-testid="rs-methods">
      <p className="text-t1 text-ink-soft"><W k="rs.me.hint" /></p>
      {pieces === "failed" ? <p className="text-t1 text-ink-soft" role="status"><W k="rs.me.offline" /></p> : null}
      {METHOD_KINDS.map((kind: MethodKind) => (
        <section key={kind} aria-labelledby={`rs-me-${kind}`} id={kind}>
          <h2 id={`rs-me-${kind}`} className="text-t3 font-medium mb-3"><W k={`rs.me.kind.${kind}`} /></h2>
          <div className="cards grid-2">
            {RESEARCH_METHODS.filter((m) => m.kind === kind).map((m) => {
              const p = written.get(m.slug);
              const lesson = p ? undefined : writtenLesson(m.slug);
              return p ? (
                <GoCard key={m.slug} id={m.slug} href={urlOf(p)} art={p.cover ? undefined : art} cover={p.cover ?? undefined} accent={toneVar(KIND_TONE[kind])}
                        chip={<span className="mono">{p.minutes ?? 1} min</span>}
                        title={<T en={m.title.en} bn={m.title.bn} />} dek={<T en={m.dek.en} bn={m.dek.bn} />} go={<W k="rs.me.read" />} />
              ) : lesson ? (
                <GoCard key={m.slug} id={m.slug} href={`/tools/research/methods/${m.slug}`} art={art} accent={toneVar(KIND_TONE[kind])}
                        chip={<span className="mono">{lesson.minutes} min · <W k="rs.me.here" /></span>}
                        title={<T en={m.title.en} bn={m.title.bn} />} dek={<T en={m.dek.en} bn={m.dek.bn} />} go={<W k="rs.me.open" />} />
              ) : (
                <SoonCard key={m.slug} id={m.slug} accent={toneVar(KIND_TONE[kind])} soon={<W k="rs.me.planned" />}
                          title={<T en={m.title.en} bn={m.title.bn} />} dek={<T en={m.dek.en} bn={m.dek.bn} />} />
              );
            })}
          </div>
        </section>
      ))}
      {more.length ? (
        <section aria-labelledby="rs-me-more" data-testid="rs-methods-more">
          <h2 id="rs-me-more" className="text-t3 font-medium mb-3"><W k="rs.me.more" /></h2>
          <div className="cards grid-2">
            {more.map((p) => (
              <GoCard key={p.slug} id={p.slug} href={urlOf(p)} art={p.cover ? undefined : art} cover={p.cover ?? undefined} accent={toneVar("plum")} lang={p.lang ?? undefined}
                      chip={<span className="mono">{p.minutes ?? 1} min</span>} title={p.title} dek={p.dek ?? ""} go={both("rs.me.read")} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
