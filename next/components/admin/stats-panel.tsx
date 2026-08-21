"use client";

/* ============================================================
   Stats: what the site is being read for.

   Ported from `app/src/Stats.tsx`, which is the one panel the
   desk had and this page did not. ADMIN.md §2 names Stats among
   the desk's nine, and §3 B, which describes those nine one at a
   time, stops at History: a whole panel went missing between two
   lists in the same file.

   §4 is the constraint it is under, and what it reads already
   meets it. `POST /api/signals/view` writes a path, a day and a
   number, and that is the whole record: no cookie, no session, no
   fingerprint and no third party. Nothing here asks for more than
   the site already counts, and nothing here could.

   ---- a path is named rather than printed ----

   What is stored is a PATH, so the table read like a server log.
   The most read page on this site is usually a tool, a stage or a
   case study, and none of those is a row. `searchIndex()` in
   `shared/content.ts` knows the title of every page, tool, stage
   and lesson, so it is asked first; the pieces ARE rows, so
   `/api/articles` is asked second and wins where both answer,
   which is how a piece retitled this morning shows this
   morning's title.

   That second call names things and gates nothing. A refusal on
   it costs the titles and leaves every figure alone.

   ---- what the endpoint cannot answer, and is said on the page ----

   `top` is the busiest paths rather than all of them, so the
   number of paths here is a length and never "how many pages were
   read". `reactions` carries no date, so it is all time and
   cannot follow the window the rest of the panel is under. Both
   are written under the figures they belong to rather than left
   for a reader to assume.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { pieceUrl, searchIndex } from "@reiad/shared/content";
import type { ReactionRow, Section as SectionId, ViewRow } from "@reiad/shared/rows";
import { adminCall, isLocked } from "../../lib/admin-api";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";
import { SectionLabel } from "../ui/label";

/** What the two grouped queries answer. Neither is a `ViewRow`: a
    `SUM(count)` comes back under a column the table does not have,
    which is the same reason the endpoint picks them apart. */
type PathViews = Pick<ViewRow, "path"> & { views: number };
type DayViews = Pick<ViewRow, "day"> & { views: number };

interface Figures {
  /** Echoed back after the endpoint's own clamp, so the axis is
      the window that was answered rather than the one asked for. */
  days: number;
  since: string;
  total: number;
  top: PathViews[];
  daily: DayViews[];
  /** Optional here and nowhere else in this file: the reactions
      table is the one part of the answer the panel can do without,
      and a Worker that stopped sending it should cost the
      reactions list rather than the chart, the figures and the
      table with it. */
  reactions?: ReactionRow[];
}

/** What `/api/articles?all=1` answers, narrowed to the three
    columns this panel needs to turn a path into a title. */
interface Piece {
  slug: string;
  title: string;
  section: SectionId;
}

/** Is this really a stats answer?

    Asserted rather than assumed, and not defensiveness for its own
    sake: a throw during render in a client component unmounts the
    WHOLE route. An endpoint answering `{ ok: true }` and nothing
    else took `/admin` down to "This page couldn't load" with every
    panel gone, Health included. `health.tsx` and `courses-panel.tsx`
    carry the same guard, and `next/admin.test.ts` drives it. */
const isFigures = (d: unknown): d is Figures => {
  const f = d as Figures | null;
  return !!f && typeof f === "object"
    && typeof f.since === "string" && typeof f.total === "number"
    && typeof f.days === "number"
    && Array.isArray(f.top) && f.top.every((r) => typeof r?.path === "string")
    && Array.isArray(f.daily) && f.daily.every((r) => typeof r?.day === "string");
};

/* The three windows, and the last of them is what the endpoint
   clamps to: asking for more answers ninety days anyway. */
const WINDOWS = [["7", "7 days"], ["30", "30 days"], ["90", "90 days"]] as const;
type Window = (typeof WINDOWS)[number][0];

const DAY = 86_400_000;

/** The window as a row per day, gaps filled in.

    A day with no row is a day nothing was counted, because the row
    exists only where a page was read. Drawing the days that HAVE
    rows and no others would put a fortnight of silence and a
    fortnight of reading at the same width, which is a line that
    says something happened. */
const axis = (since: string, days: number, daily: DayViews[]): DayViews[] => {
  const start = Date.parse(`${since}T00:00:00Z`);
  if (!Number.isFinite(start) || days < 1) return daily;
  const seen = new Map(daily.map((d) => [d.day, d.views]));
  return Array.from({ length: days + 1 }, (_, i) => {
    const day = new Date(start + i * DAY).toISOString().slice(0, 10);
    return { day, views: seen.get(day) ?? 0 };
  });
};

/* ---------- the line ----------

   Drawn as JSX rather than as a string of SVG handed to
   innerHTML, which is what the desk before the React one did.
   Nothing about that was unsafe, the numbers are the site's own,
   but a page signed in as an administrator has no business
   parsing markup it could build. */
function Line({ series }: { series: DayViews[] }) {
  const w = 600;
  const h = 90;
  const peak = Math.max(1, ...series.map((d) => d.views));
  const points = series
    .map((d, i) => [
      ((i / Math.max(1, series.length - 1)) * w).toFixed(1),
      (h - (d.views / peak) * (h - 10)).toFixed(1),
    ].join(","))
    .join(" ");

  return (
    <div className="chart-box w-full">
      <svg viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" role="img"
           aria-label={`Views per day, peaking at ${peak}`}>
        <polyline className="stroke-[var(--series-1)]" points={points} fill="none"
                  strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function StatsPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [days, setDays] = useState<Window>("30");
  const [figures, setFigures] = useState<Figures | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);

  /* Pressing another window keeps what is already drawn until the
     new answer lands: `figures` is not cleared and `phase` only
     opens on "loading", so the chart does not blink out and back
     three times while somebody compares the three. */
  const load = useCallback(async (): Promise<void> => {
    const r = await adminCall<Figures>(`signals/stats?days=${days}`);
    if (isLocked(r)) { setPhase("locked"); return; }
    if (!r.ok || !isFigures(r.data)) { setPhase("error"); return; }
    setFigures(r.data);
    setPhase("ready");
  }, [days]);

  useEffect(() => { void load(); }, [load]);

  /* Best effort, and deliberately not part of `phase`: this names
     the pieces and gates nothing, so a refusal costs the titles
     rather than the panel. */
  useEffect(() => {
    let live = true;
    void (async () => {
      const r = await adminCall<{ articles?: Piece[] }>("articles?all=1");
      if (!live || !r.ok) return;
      setPieces(Array.isArray(r.data?.articles) ? r.data.articles : []);
    })();
    return () => { live = false; };
  }, []);

  /* Built once per change of the piece list rather than once per
     row. The site's own index first, then the database over the
     top of it. */
  const titles = useMemo(() => {
    const map = new Map<string, string>();
    for (const entry of searchIndex()) map.set(entry.url.split("#")[0], entry.title);
    for (const p of pieces) map.set(pieceUrl(p.section, p.slug), p.title);
    return map;
  }, [pieces]);

  /** A reaction row carries a slug and no section, so the pieces
      are what turn one into a title and an address. */
  const bySlug = useMemo(() => {
    const map = new Map<string, { title: string; url: string }>();
    for (const p of pieces) map.set(p.slug, { title: p.title, url: pieceUrl(p.section, p.slug) });
    return map;
  }, [pieces]);

  /* Four spellings of one address. A view is recorded as
     `location.pathname`, which is `/money/basics-1` for a route,
     `/insights/x.html` where the suffix is part of the slug, and
     `/deutsch/` for somebody whose bookmark predates task #28. */
  const name = (path: string): string =>
    titles.get(path)
    ?? titles.get(`${path}.html`)
    ?? titles.get(path.replace(/\.html$/, ""))
    ?? titles.get(path.replace(/\/$/, ""))
    ?? path;

  const series = figures ? axis(figures.since, figures.days, figures.daily) : [];
  const busiest = (figures?.daily ?? [])
    .reduce<DayViews>((best, d) => (d.views > best.views ? d : best), { day: "", views: 0 });
  const reactions = (figures?.reactions ?? []).filter((r) => typeof r?.slug === "string");

  return (
    <Surface material="pane" className="ad-panel" id="stats">
      <h3>What is read</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so the figures are not readable from here.
          Sign in at <a href="/studio">the Studio</a>: it is the same session, and
          nothing on this page can mint it.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">
          /api/signals/stats did not answer, or answered something that is not a
          set of figures. That is the endpoint rather than the credential: Health
          above says whether the database is reachable.
        </p>
      ) : null}

      {phase === "ready" && figures ? (
        <>
          <div className="flex flex-wrap gap-2" role="group" aria-label="How far back">
            {WINDOWS.map(([id, label]) => (
              <Button key={id} size="sm" kind={id === days ? "soft" : "quiet"}
                      pressed={id === days} onClick={() => setDays(id)}>
                {label}
              </Button>
            ))}
          </div>

          <p className="admin-count mono m-0">Counted since {figures.since}</p>

          <div className="stat-row w-full">
            <div className="stat stat-lead">
              <span className="k">Views, {figures.days} days</span>
              <span className="v">{figures.total}</span>
              <span className="n">every page, not only the pieces</span>
            </div>
            <div className="stat">
              <span className="k">Paths listed</span>
              <span className="v">{figures.top.length}</span>
              <span className="n">the busiest, rather than every page seen</span>
            </div>
            <div className="stat">
              <span className="k">Busiest day</span>
              <span className="v">{busiest.views}</span>
              <span className="n">{busiest.day || "nothing counted yet"}</span>
            </div>
          </div>

          {figures.daily.length ? (
            <>
              <Line series={series} />
              <p className="mono m-0 text-[var(--t-2)] text-ink-soft">
                {series[0]?.day} to {series[series.length - 1]?.day}. A day with no
                row is drawn as a nought, because the row exists only where
                something was read.
              </p>
            </>
          ) : null}

          <SectionLabel>Most read</SectionLabel>
          {figures.top.length === 0 ? (
            <p className="ad-quiet">Nothing recorded in this window yet.</p>
          ) : (
            <ul className="m-0 grid w-full list-none gap-1 p-0">
              {figures.top.map((row) => (
                <li key={row.path}
                    className="flex flex-wrap items-baseline gap-2 border-b
                               border-hairline py-1">
                  <a className="min-w-0 flex-1 basis-56" href={row.path}>{name(row.path)}</a>
                  <span className="mono min-w-0 break-all text-[var(--t-2)] text-ink-soft">
                    {row.path}
                  </span>
                  <span className="mono ml-auto tabular-nums">{row.views}</span>
                </li>
              ))}
            </ul>
          )}

          {reactions.length ? (
            <>
              <SectionLabel>Reactions</SectionLabel>
              <ul className="m-0 grid w-full list-none gap-1 p-0">
                {reactions.map((r) => {
                  const piece = bySlug.get(r.slug);
                  return (
                    <li key={`${r.slug}-${r.kind}`}
                        className="flex flex-wrap items-baseline gap-2 border-b
                                   border-hairline py-1">
                      {piece ? (
                        <a className="min-w-0 flex-1 basis-56" href={piece.url}>{piece.title}</a>
                      ) : (
                        <span className="mono min-w-0 flex-1 basis-56 break-all">{r.slug}</span>
                      )}
                      <span className="mono text-[var(--t-2)] text-ink-soft">{r.kind}</span>
                      <span className="mono ml-auto tabular-nums">{r.count}</span>
                    </li>
                  );
                })}
              </ul>
              <p className="ad-quiet">
                All time. A reaction is a counter per piece per kind with no date on
                it, so this one list cannot follow the window above, and pretending
                it did would be the only wrong number on the page.
              </p>
            </>
          ) : null}

          <p className="tool-note">
            A path, a date and a number, that is the entire record. No cookies, no
            visitor identity, nothing shared with anyone. So this panel cannot say
            who read a page, whether one reader came back, or how long anybody
            stayed, and there is nothing to switch on that would let it.
          </p>
        </>
      ) : null}
    </Surface>
  );
}
