/* ============================================================
   shared/research-graph.ts: the atlas's arithmetic.

   RESEARCH.md sections 8 and 18. A graph laid out by a small
   force simulation that is DETERMINISTIC (seeded from the ids, a
   fixed number of steps), so the same rows draw the same picture
   every time and a test can hold it; the argument map and the
   gap matrix as cells; the literature timeline as one dot per
   source. Pure, so scripts/research.test.ts covers every one.
   No library: a few hundred nodes at sixty steps is a few
   million multiplications, which is nothing, and the picture is
   SVG the site already knows how to colour.
   ============================================================ */

export interface GraphNode { id: string; kind: string; label: string; tone?: string; size?: number; href?: string }
export interface GraphEdge { from: string; to: string; kind?: string }
export interface Placed extends GraphNode { x: number; y: number }

/** A number in [0, 1) out of a string, the same every time. */
function seeded(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i += 1) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 15; h = Math.imul(h, 2246822507); h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/** Fruchterman-Reingold in a box, sixty steps, cooling. Nodes
    start on a circle in id order rather than at random, which is
    what makes the layout the same on every visit. */
export function layout(nodes: GraphNode[], edges: GraphEdge[], width = 1000, height = 700, steps = 60): Placed[] {
  const n = nodes.length;
  if (!n) return [];
  const placed: Placed[] = nodes.map((node, i) => ({
    ...node,
    x: width / 2 + (Math.min(width, height) * 0.38) * Math.cos((i / n) * Math.PI * 2 + seeded(node.id) * 0.3),
    y: height / 2 + (Math.min(width, height) * 0.38) * Math.sin((i / n) * Math.PI * 2 + seeded(node.id) * 0.3),
  }));
  const index = new Map(placed.map((p, i) => [p.id, i]));
  const links = edges.map((e) => [index.get(e.from), index.get(e.to)] as [number | undefined, number | undefined])
    .filter((l): l is [number, number] => l[0] !== undefined && l[1] !== undefined && l[0] !== l[1]);
  const k = Math.sqrt((width * height) / n) * 0.6;
  let temp = width / 8;
  for (let step = 0; step < steps; step += 1) {
    const dx = new Float64Array(n);
    const dy = new Float64Array(n);
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        let vx = placed[i].x - placed[j].x;
        let vy = placed[i].y - placed[j].y;
        let d = Math.hypot(vx, vy);
        if (d < 1) { vx = (seeded(placed[i].id + placed[j].id) - 0.5); vy = (seeded(placed[j].id + placed[i].id) - 0.5); d = 1; }
        const f = (k * k) / d;
        dx[i] += (vx / d) * f; dy[i] += (vy / d) * f;
        dx[j] -= (vx / d) * f; dy[j] -= (vy / d) * f;
      }
    }
    for (const [a, b] of links) {
      const vx = placed[a].x - placed[b].x;
      const vy = placed[a].y - placed[b].y;
      const d = Math.max(1, Math.hypot(vx, vy));
      const f = (d * d) / k;
      dx[a] -= (vx / d) * f; dy[a] -= (vy / d) * f;
      dx[b] += (vx / d) * f; dy[b] += (vy / d) * f;
    }
    for (let i = 0; i < n; i += 1) {
      const d = Math.max(1, Math.hypot(dx[i], dy[i]));
      const move = Math.min(d, temp);
      placed[i].x = Math.min(width - 30, Math.max(30, placed[i].x + (dx[i] / d) * move));
      placed[i].y = Math.min(height - 30, Math.max(30, placed[i].y + (dy[i] / d) * move));
    }
    temp *= 0.93;
  }
  return placed.map((p) => ({ ...p, x: Math.round(p.x * 10) / 10, y: Math.round(p.y * 10) / 10 }));
}

/* ---------- the argument map and the gap matrix ---------- */

export interface Cell { row: string; col: string; marks: string[] }

/** Questions down the side, sources across the top, a mark where
    a source speaks to a question: the stances. Read one way it is
    what the literature says about each question; read the other
    it is which questions a paper touches. */
export function argumentMap(
  questions: { id: string; body?: { evidence?: { source_id: string; stance: string }[] } }[],
  sources: { id: string }[],
): Cell[] {
  const cells: Cell[] = [];
  const have = new Set(sources.map((s) => s.id));
  for (const q of questions) {
    for (const e of q.body?.evidence ?? []) {
      if (!have.has(e.source_id)) continue;
      const cell = cells.find((c) => c.row === q.id && c.col === e.source_id);
      if (cell) cell.marks.push(e.stance); else cells.push({ row: q.id, col: e.source_id, marks: [e.stance] });
    }
  }
  return cells;
}

/** Rows of tags, columns of sources, and the empty cells are the
    gaps. Derived from the library's own tags and never maintained. */
export function gapMatrix(sources: { id: string; tags: string[] }[]): { tags: string[]; cells: Cell[]; gaps: number } {
  const tags = [...new Set(sources.flatMap((s) => s.tags))].sort();
  const cells: Cell[] = [];
  for (const t of tags) for (const s of sources) if (s.tags.includes(t)) cells.push({ row: t, col: s.id, marks: ["has"] });
  return { tags, cells, gaps: tags.length * sources.length - cells.length };
}

/* ---------- the literature timeline ---------- */

export interface Dot { id: string; year: number; lane: string; type: string; size: number; title: string }

/** One dot per source with a year, in a lane per tag the reader
    chose (or one lane), sized by citations where known. */
export function timeline(
  sources: { id: string; year: number | null; type: string; tags: string[]; title: string; identifiers?: Record<string, string>; oa?: unknown }[],
  lanes: string[] = [],
): { dots: Dot[]; years: [number, number] | null; lanes: string[] } {
  const dots: Dot[] = [];
  const used = new Set<string>();
  for (const s of sources) {
    if (!s.year) continue;
    const lane = lanes.find((l) => s.tags.includes(l)) ?? (lanes.length ? "other" : "all");
    used.add(lane);
    dots.push({ id: s.id, year: s.year, lane, type: s.type, size: 1, title: s.title });
  }
  const years = dots.length ? [Math.min(...dots.map((d) => d.year)), Math.max(...dots.map((d) => d.year))] as [number, number] : null;
  return { dots, years, lanes: lanes.length ? [...lanes.filter((l) => used.has(l)), ...(used.has("other") ? ["other"] : [])] : ["all"] };
}
