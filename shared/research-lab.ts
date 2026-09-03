/* ============================================================
   shared/research-lab.ts: the lab's own arithmetic that is not a
   statistic. RESEARCH.md section 14, and 36 for the replication
   template.

   A delimited file read into columns with their types inferred;
   the importers that know a Dhaka Stock Exchange export or an
   Alpha Vantage series by its column names; the four sanity
   checks a replication runs on every dataset by itself; a fit
   printed as an APA table; and a chart drawn as an SVG string, so
   a run's figure is a file and not a canvas. Pure, so node reads
   it too, and held by scripts/research.test.ts.
   ============================================================ */

import type { Fit } from "./research-stats.ts";

export const RUN_KINDS = ["sql", "stat", "chart", "python", "check"] as const;
export type RunKind = typeof RUN_KINDS[number];

export const COLUMN_TYPES = ["number", "text", "date", "boolean"] as const;
export type ColumnType = typeof COLUMN_TYPES[number];

/** One row of a dataset's dictionary. `variable_id` is a row of
    the questions room of kind `variable`, which is what makes the
    thesis's variable table and this list one list. */
export interface Column { name: string; type: ColumnType; unit?: string; definition?: string; variable_id?: string | null }

export type Cell = string | number | null;
export interface Table { columns: string[]; rows: Cell[][] }

/* ---------- reading a delimited file ---------- */

export function detectDelimiter(head: string): "," | "\t" | ";" | "|" {
  const counts: [string, number][] = [",", "\t", ";", "|"].map((d) => [d, head.split(d).length - 1]);
  counts.sort((a, b) => b[1] - a[1]);
  return (counts[0][1] > 0 ? counts[0][0] : ",") as "," | "\t" | ";" | "|";
}

/** RFC 4180: quotes, doubled quotes, and a delimiter or a newline
    inside quotes. A trailing empty line is not a row. */
export function parseDelimited(text: string, delimiter?: string): Table {
  const src = text.replace(/^﻿/, "");
  const delim = delimiter ?? detectDelimiter(src.split(/\r?\n/, 1)[0] ?? "");
  const rows: string[][] = [];
  let row: string[] = [], cell = "", quoted = false;
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') { cell += '"'; i += 1; } else quoted = false;
      } else cell += ch;
      continue;
    }
    if (ch === '"') { quoted = true; continue; }
    if (ch === delim) { row.push(cell); cell = ""; continue; }
    if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i += 1;
      row.push(cell); cell = "";
      rows.push(row); row = [];
      continue;
    }
    cell += ch;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const header = (rows.shift() ?? []).map((h, i) => h.trim() || `column_${i + 1}`);
  const body = rows.filter((r) => r.some((c) => c.trim() !== "")).map((r) => header.map((_h, i) => cellOf(r[i] ?? "")));
  return { columns: header, rows: body };
}

const NUMBER = /^[-+]?(\d{1,3}(,\d{3})+|\d+)(\.\d+)?([eE][-+]?\d+)?$/;

/** A number where the text is one (thousands commas allowed), an
    empty cell as null, and anything else as the text it was. */
export const cellOf = (raw: string): Cell => {
  const t = raw.trim();
  if (t === "" || /^(na|n\/a|null|nan|\.|-)$/i.test(t)) return null;
  if (NUMBER.test(t)) return Number(t.replace(/,/g, ""));
  return t;
};

const DATE = /^(\d{4}-\d{2}-\d{2}|\d{1,2}[/-]\d{1,2}[/-]\d{2,4}|\d{4}\/\d{2}\/\d{2})(\s.*)?$/;

/** The type of each column, from what its first five hundred
    non-empty cells look like. */
export function inferColumns(table: Table): Column[] {
  return table.columns.map((name, j) => {
    let numbers = 0, dates = 0, bools = 0, seen = 0;
    for (const r of table.rows) {
      const v = r[j];
      if (v === null || v === undefined) continue;
      seen += 1;
      if (typeof v === "number") numbers += 1;
      else if (DATE.test(v)) dates += 1;
      else if (/^(true|false|yes|no)$/i.test(v)) bools += 1;
      if (seen >= 500) break;
    }
    const type: ColumnType = !seen ? "text" : numbers === seen ? "number" : dates === seen ? "date" : bools === seen ? "boolean" : "text";
    return { name, type };
  });
}

export const numberColumn = (table: Table, name: string): (number | null)[] => {
  const j = table.columns.indexOf(name);
  return table.rows.map((r) => (typeof r[j] === "number" ? (r[j] as number) : null));
};

/** Rows where every named column has a number, as columns. */
export function completeCases(table: Table, names: string[]): number[][] {
  const idx = names.map((n) => table.columns.indexOf(n));
  const out: number[][] = names.map(() => []);
  for (const r of table.rows) {
    const vals = idx.map((j) => r[j]);
    if (vals.every((v) => typeof v === "number")) vals.forEach((v, k) => out[k].push(v as number));
  }
  return out;
}

/** FNV-1a over the text, twice with two seeds, as sixteen hex
    digits: enough to say "the same bytes" in a run's record. */
export function hashText(text: string): string {
  const one = (seed: number): string => {
    let h = seed >>> 0;
    for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
    return h.toString(16).padStart(8, "0");
  };
  return one(2166136261) + one(0x9747b28c);
}

/* ---------- importers that know a file by its columns ---------- */

export interface Importer { id: "dse" | "alphavantage" | "french" | "emdat" | "generic"; name: string; detect: (columns: string[]) => boolean; rename: Record<string, string> }

const norm = (s: string): string => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** The Dhaka Stock Exchange's own export headings, the Alpha
    Vantage CSV, Ken French's factor files and EM-DAT, each renamed
    to the studio's canonical names so a regression written once
    runs on any of them. */
export const IMPORTERS: Importer[] = [
  {
    id: "dse", name: "Dhaka Stock Exchange",
    detect: (cols) => cols.some((c) => /trading code/i.test(c)) && cols.some((c) => /^(ltp|closep)/i.test(c.trim())),
    rename: { "date": "date", "trading code": "symbol", "ltp": "last", "high": "high", "low": "low", "openp": "open", "closep": "close", "ycp": "previous_close", "trade": "trades", "value mn": "value_mn", "volume": "volume" },
  },
  {
    id: "alphavantage", name: "Alpha Vantage",
    detect: (cols) => cols.some((c) => /timestamp/i.test(c)) && cols.some((c) => /adjusted close|close/i.test(c)),
    rename: { "timestamp": "date", "open": "open", "high": "high", "low": "low", "close": "close", "adjusted close": "adjusted_close", "volume": "volume", "dividend amount": "dividend", "split coefficient": "split" },
  },
  {
    id: "french", name: "Ken French factors",
    detect: (cols) => cols.some((c) => /mkt rf/i.test(norm(c))) && cols.some((c) => /^smb$/i.test(c.trim())),
    rename: { "mkt rf": "mkt_rf", "smb": "smb", "hml": "hml", "rmw": "rmw", "cma": "cma", "rf": "rf", "mom": "mom" },
  },
  {
    id: "emdat", name: "EM-DAT",
    detect: (cols) => cols.some((c) => /dis no|disno/i.test(c)) && cols.some((c) => /disaster type/i.test(c)),
    rename: { "disno": "event_id", "dis no": "event_id", "disaster type": "disaster_type", "country": "country", "iso": "iso", "start year": "start_year", "end year": "end_year", "total deaths": "deaths", "total affected": "affected", "total damage 000 us": "damage_thousand_usd" },
  },
];

export const importerFor = (columns: string[]): Importer["id"] => IMPORTERS.find((i) => i.detect(columns))?.id ?? "generic";

/** Canonical names where the importer knows one, and a safe SQL
    identifier otherwise: lower case, underscores, never empty and
    never two the same. */
export function canonicalColumns(columns: string[], importer: Importer["id"]): string[] {
  const map = IMPORTERS.find((i) => i.id === importer)?.rename ?? {};
  const used = new Set<string>();
  return columns.map((c, i) => {
    const key = norm(c.replace(/\*/g, ""));
    const hit = Object.keys(map).find((k) => key === k || key.startsWith(`${k} `));
    let name = hit ? map[hit] : key.replace(/ /g, "_") || `column_${i + 1}`;
    if (/^\d/.test(name)) name = `c_${name}`;
    let out = name, n = 2;
    while (used.has(out)) out = `${name}_${n++}`;
    used.add(out);
    return out;
  });
}

/* ---------- the four sanity checks ---------- */

export interface Sanity {
  rows: number;
  columns: number;
  statedN: number | null;
  nMatches: boolean | null;
  missing: { name: string; count: number; share: number }[];
  outliers: { name: string; max: number; median: number; ratio: number }[];
  coverage: { from: string | null; to: string | null; countries: string[] };
}

/** What a replication runs on every dataset before it trusts it:
    the shape against the paper's stated N, the missing values a
    column, a summary with anything a thousand times off its median
    flagged, and the date and country coverage. */
export function sanity(table: Table, columns: Column[], o: { statedN?: number | null; dateColumn?: string; countryColumn?: string } = {}): Sanity {
  const n = table.rows.length;
  const missing = table.columns.map((name, j) => {
    const count = table.rows.filter((r) => r[j] === null || r[j] === undefined).length;
    return { name, count, share: n ? count / n : 0 };
  }).filter((m) => m.count > 0);
  const outliers: Sanity["outliers"] = [];
  columns.forEach((c) => {
    if (c.type !== "number") return;
    const xs = numberColumn(table, c.name).filter((v): v is number => v !== null).map(Math.abs).sort((a, b) => a - b);
    if (xs.length < 3) return;
    const median = xs[Math.floor(xs.length / 2)];
    const max = xs[xs.length - 1];
    if (median > 0 && max / median >= 1000) outliers.push({ name: c.name, max, median, ratio: max / median });
  });
  const dateCol = o.dateColumn ?? columns.find((c) => c.type === "date")?.name;
  let from: string | null = null, to: string | null = null;
  if (dateCol) {
    const j = table.columns.indexOf(dateCol);
    const ds = table.rows.map((r) => r[j]).filter((v): v is string => typeof v === "string").sort();
    from = ds[0] ?? null; to = ds[ds.length - 1] ?? null;
  }
  const countryCol = o.countryColumn ?? columns.find((c) => /^(country|iso|iso3|nation)$/i.test(c.name))?.name;
  const countries = countryCol ? [...new Set(table.rows.map((r) => r[table.columns.indexOf(countryCol)]).filter((v): v is string => typeof v === "string"))].sort() : [];
  return {
    rows: n, columns: table.columns.length, statedN: o.statedN ?? null, nMatches: o.statedN ? o.statedN === n : null,
    missing, outliers, coverage: { from, to, countries },
  };
}

/* ---------- an APA table out of a fit ---------- */

export interface ApaOptions { stars?: boolean; digits?: number; title?: string; depvar?: string }

export const stars = (p: number): string => (p < 0.001 ? "***" : p < 0.01 ? "**" : p < 0.05 ? "*" : "");

const fmt = (v: number, digits: number): string => (Number.isFinite(v) ? v.toFixed(digits) : "");

/** Coefficients with the standard error in brackets on the line
    below, stars if wanted and a switch to say no, N and the fit's
    own measure in the foot, as Markdown and as rows a Word table
    can take. */
export function apaTable(fit: Fit & { pseudoR2?: number; link?: string }, o: ApaOptions = {}): { markdown: string; rows: string[][]; notes: string } {
  const digits = o.digits ?? 3;
  const dep = o.depvar ?? "y";
  const rows: string[][] = [["", dep]];
  fit.names.forEach((name, i) => {
    rows.push([name, `${fmt(fit.coef[i], digits)}${o.stars === false ? "" : stars(fit.p[i])}`]);
    rows.push(["", `(${fmt(fit.se[i], digits)})`]);
  });
  rows.push(["N", String(fit.n)]);
  if (fit.pseudoR2 !== undefined) rows.push(["Pseudo R²", fmt(fit.pseudoR2, digits)]);
  else { rows.push(["R²", fmt(fit.r2, digits)]); rows.push(["Adjusted R²", fmt(fit.adjR2, digits)]); }
  const seNote = fit.robust === "cluster" ? `Standard errors clustered by group (${fit.clusters ?? "?"} clusters) in parentheses.`
    : fit.robust === "classical" ? "Standard errors in parentheses." : `Heteroskedasticity-robust (${fit.robust}) standard errors in parentheses.`;
  const notes = `${seNote}${o.stars === false ? "" : " * p < .05, ** p < .01, *** p < .001."}`;
  const md = [
    o.title ? `**${o.title}**\n` : "",
    `| | ${dep} |`, "| --- | ---: |",
    ...rows.slice(1).map((r) => `| ${r[0]} | ${r[1]} |`),
    "", `*Note.* ${notes}`,
  ].filter((l) => l !== undefined).join("\n");
  return { markdown: md, rows, notes };
}

/* ---------- charts, as SVG text ---------- */

export interface Series { name: string; points: { x: number; y: number }[] }
export interface ChartOptions {
  kind: "line" | "scatter" | "bar" | "hist";
  series: Series[];
  title?: string;
  xLabel?: string;
  yLabel?: string;
  width?: number;
  height?: number;
  /** x values are days since the epoch and are printed as dates. */
  xDates?: boolean;
  /** category labels for a bar chart, one per x. */
  categories?: string[];
}

export const PALETTE = ["#2f7d6d", "#c46a2a", "#4a63b8", "#a83a6b", "#6a8d2a", "#8a5cb8"];

const esc = (s: string): string => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Ticks that land on round numbers and cover the range. */
export function niceTicks(lo: number, hi: number, count = 6): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) return [0];
  if (lo === hi) return [lo];
  const span = hi - lo;
  const raw = span / Math.max(count - 1, 1);
  const mag = 10 ** Math.floor(Math.log10(raw));
  const norm2 = raw / mag;
  const step = (norm2 < 1.5 ? 1 : norm2 < 3 ? 2 : norm2 < 7 ? 5 : 10) * mag;
  const start = Math.ceil(lo / step) * step;
  const out: number[] = [];
  for (let v = start; v <= hi + 1e-9 * span; v += step) out.push(Number(v.toFixed(10)));
  return out;
}

const tickLabel = (v: number, dates: boolean): string => {
  if (dates) return new Date(v * 86400000).toISOString().slice(0, 10);
  if (Math.abs(v) >= 1e6) return `${(v / 1e6).toFixed(1)}m`;
  if (Math.abs(v) >= 1e4) return `${(v / 1e3).toFixed(0)}k`;
  return Number.isInteger(v) ? String(v) : v.toPrecision(3).replace(/\.?0+$/, "");
};

export function histogram(xs: number[], bins = 20): Series {
  const lo = Math.min(...xs), hi = Math.max(...xs);
  const w = (hi - lo) / bins || 1;
  const counts = new Array<number>(bins).fill(0);
  for (const v of xs) counts[Math.min(bins - 1, Math.floor((v - lo) / w))] += 1;
  return { name: "count", points: counts.map((c, i) => ({ x: lo + (i + 0.5) * w, y: c })) };
}

/** One SVG: axes with round ticks, the series in the palette, a
    legend when there is more than one, text in `currentColor` so
    the same file reads in both themes and in a thesis. */
export function chartSvg(o: ChartOptions): string {
  const W = o.width ?? 640, H = o.height ?? 360;
  const m = { top: o.title ? 36 : 16, right: 16, bottom: o.xLabel ? 52 : 36, left: o.yLabel ? 64 : 52 };
  const pw = W - m.left - m.right, ph = H - m.top - m.bottom;
  const all = o.series.flatMap((s) => s.points);
  if (!all.length) return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}"></svg>`;
  const xs = all.map((p) => p.x), ys = all.map((p) => p.y);
  let x0 = Math.min(...xs), x1 = Math.max(...xs);
  let y0 = Math.min(...ys), y1 = Math.max(...ys);
  if (o.kind === "bar" || o.kind === "hist") { y0 = Math.min(0, y0); y1 = Math.max(0, y1); }
  if (x0 === x1) { x0 -= 1; x1 += 1; }
  if (y0 === y1) { y0 -= 1; y1 += 1; }
  const bar = o.kind === "bar" || o.kind === "hist";
  const xt = bar && o.categories ? [] : niceTicks(x0, x1, 6);
  const yt = niceTicks(y0, y1, 6);
  if (!bar && yt.length) { y0 = Math.min(y0, yt[0]); y1 = Math.max(y1, yt[yt.length - 1]); }
  const n = Math.max(...o.series.map((s) => s.points.length));
  const slot = pw / Math.max(n, 1);
  const sx = (v: number): number => (bar && o.categories ? 0 : m.left + ((v - x0) / (x1 - x0)) * pw);
  const sy = (v: number): number => m.top + ph - ((v - y0) / (y1 - y0)) * ph;
  const parts: string[] = [];
  parts.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="system-ui, sans-serif" font-size="12">`);
  if (o.title) parts.push(`<text x="${m.left}" y="20" font-size="14" font-weight="600" fill="currentColor">${esc(o.title)}</text>`);
  for (const v of yt) {
    const y = sy(v);
    parts.push(`<line x1="${m.left}" y1="${y.toFixed(1)}" x2="${W - m.right}" y2="${y.toFixed(1)}" stroke="currentColor" stroke-opacity="0.12" />`);
    parts.push(`<text x="${m.left - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" fill="currentColor" fill-opacity="0.75">${esc(tickLabel(v, false))}</text>`);
  }
  if (bar && o.categories) {
    o.categories.forEach((c, i) => {
      parts.push(`<text x="${(m.left + slot * (i + 0.5)).toFixed(1)}" y="${m.top + ph + 16}" text-anchor="middle" fill="currentColor" fill-opacity="0.75">${esc(c.slice(0, 12))}</text>`);
    });
  } else {
    for (const v of xt) {
      const x = sx(v);
      parts.push(`<text x="${x.toFixed(1)}" y="${m.top + ph + 16}" text-anchor="middle" fill="currentColor" fill-opacity="0.75">${esc(tickLabel(v, Boolean(o.xDates)))}</text>`);
    }
  }
  parts.push(`<line x1="${m.left}" y1="${m.top + ph}" x2="${W - m.right}" y2="${m.top + ph}" stroke="currentColor" stroke-opacity="0.6" />`);
  parts.push(`<line x1="${m.left}" y1="${m.top}" x2="${m.left}" y2="${m.top + ph}" stroke="currentColor" stroke-opacity="0.6" />`);
  if (o.xLabel) parts.push(`<text x="${m.left + pw / 2}" y="${H - 10}" text-anchor="middle" fill="currentColor">${esc(o.xLabel)}</text>`);
  if (o.yLabel) parts.push(`<text transform="translate(14 ${m.top + ph / 2}) rotate(-90)" text-anchor="middle" fill="currentColor">${esc(o.yLabel)}</text>`);
  o.series.forEach((s, si) => {
    const colour = PALETTE[si % PALETTE.length];
    if (o.kind === "line") {
      const d = s.points.map((p, i) => `${i ? "L" : "M"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`).join(" ");
      parts.push(`<path d="${d}" fill="none" stroke="${colour}" stroke-width="1.8" stroke-linejoin="round" />`);
      const last = s.points[s.points.length - 1];
      if (last) parts.push(`<circle cx="${sx(last.x).toFixed(1)}" cy="${sy(last.y).toFixed(1)}" r="3" fill="${colour}" />`);
    } else if (o.kind === "scatter") {
      for (const p of s.points) parts.push(`<circle cx="${sx(p.x).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.5" fill="${colour}" fill-opacity="0.75" />`);
    } else {
      const k = o.series.length;
      const bw = (o.categories ? slot : pw / Math.max(s.points.length, 1)) / k * 0.8;
      s.points.forEach((p, i) => {
        const cx = o.categories ? m.left + slot * (i + 0.5) : sx(p.x);
        const x = cx - (bw * k) / 2 + si * bw;
        const top = sy(Math.max(p.y, 0)), base = sy(Math.min(p.y, 0));
        parts.push(`<rect x="${x.toFixed(1)}" y="${top.toFixed(1)}" width="${bw.toFixed(1)}" height="${Math.max(base - top, 0).toFixed(1)}" fill="${colour}" fill-opacity="0.85" />`);
      });
    }
  });
  if (o.series.length > 1) {
    o.series.forEach((s, si) => {
      const x = m.left + 8, y = m.top + 10 + si * 16;
      parts.push(`<rect x="${x}" y="${y - 8}" width="10" height="10" fill="${PALETTE[si % PALETTE.length]}" />`);
      parts.push(`<text x="${x + 14}" y="${y + 1}" fill="currentColor">${esc(s.name)}</text>`);
    });
  }
  parts.push("</svg>");
  return parts.join("\n");
}

/** Days since the epoch for a date string, so a date can be an x. */
export const dayOf = (iso: string): number | null => {
  const t = Date.parse(iso);
  return Number.isFinite(t) ? Math.round(t / 86400000) : null;
};
