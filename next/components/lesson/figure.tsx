/* ============================================================
   lesson/figure.tsx: the ten drawings a lesson can carry.

   A figure is DATA in a row and a SHAPE here. Ten shapes, and
   between them they cover what a school about money actually has
   to show: a process, a thing broken into parts, a trade-off, two
   axes, a loop, a climb, a history, a screen with numbers on it,
   an overlap, and a hierarchy.

   ---- why these are HTML and not SVG ----

   Because every label is two labels. A figure says itself in
   Bangla and in English out of one definition, which means each
   piece of text is a pair of spans with `display: none` on one of
   them, and `<text>` in SVG neither wraps nor hides that way. It
   would also need a font size chosen against a viewBox rather
   than against the reader's own type size, which is the one
   setting on this site that a figure must not ignore.

   So the boxes, the labels and the bars are HTML in `@layer
   lesson`, and geometry that CSS genuinely cannot do, the beam
   of a scale and the circles of a venn, is the only SVG here.

   ---- and why a figure is never a photograph ----

   A photograph of a trading floor teaches nothing about a
   trading floor. A drawing of what happens between pressing Buy
   and the share landing in a BO account teaches the whole
   lesson. Drawn from data it is also right in both themes, right
   at any width, and readable by a screen reader from the same
   text the eye gets, none of which an uploaded picture is.
   ============================================================ */

import type { FigureBlock, Say, Tone } from "@reiad/shared/lesson";
import { bnNum } from "@reiad/shared/lesson";
import { T, TBlock } from "./lang";

type Part = FigureBlock["parts"][number];

const toneOf = (t: Tone | undefined): string => t ?? "plain";

/** A number under a label, in both scripts. Small enough to
    repeat here rather than pull `numSay` in: a figure prints
    plain counts and percentages, never taka. */
function Num({ n, unit }: { n: number; unit?: string }) {
  const text = Number.isInteger(n) ? String(n) : n.toFixed(1);
  return (
    <span className="ls-fig-num mono">
      <span className="ls-bn" lang="bn">{bnNum(text)}{unit ?? ""}</span>
      <span className="ls-en" lang="en">{text}{unit ?? ""}</span>
    </span>
  );
}

function Box({ part, n }: { part: Part; n?: number }) {
  return (
    <div className="ls-fig-box" data-tone={toneOf(part.tone)}>
      {n === undefined ? null : <span className="ls-fig-n mono">{bnNum(n)}</span>}
      <span className="ls-fig-text"><T s={part.text} /></span>
      {part.note ? <span className="ls-fig-note"><T s={part.note} /></span> : null}
    </div>
  );
}

/* ---------- the ten ---------- */

function Flow({ parts }: { parts: Part[] }) {
  return (
    <ol className="ls-fig-flow">
      {parts.map((p, i) => (
        <li key={i}><Box part={p} n={i + 1} /></li>
      ))}
    </ol>
  );
}

function Stack({ parts }: { parts: Part[] }) {
  const total = parts.reduce((a, p) => a + Math.abs(p.value ?? 0), 0) || 1;
  return (
    <div className="ls-fig-stack">
      <div className="ls-fig-bar" role="presentation">
        {parts.map((p, i) => (
          <span key={i} className="ls-fig-seg" data-tone={toneOf(p.tone)}
                style={{ "--part": String(Math.abs(p.value ?? 0) / total) } as React.CSSProperties} />
        ))}
      </div>
      <ul className="ls-fig-keys">
        {parts.map((p, i) => (
          <li key={i} data-tone={toneOf(p.tone)}>
            <span className="ls-fig-swatch" aria-hidden="true" />
            <span className="ls-fig-text"><T s={p.text} /></span>
            <Num n={(Math.abs(p.value ?? 0) / total) * 100} unit="%" />
            {p.note ? <span className="ls-fig-note"><T s={p.note} /></span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Scale({ parts }: { parts: Part[] }) {
  const [left, right] = parts;
  const a = Math.abs(left?.value ?? 1);
  const b = Math.abs(right?.value ?? 1);
  /* Capped at twelve degrees. A beam that tips forty degrees
     because one side is four times the other reads as broken
     rather than as heavier, and the numbers under the pans are
     what carry the size anyway. */
  const tilt = Math.max(-12, Math.min(12, ((b - a) / Math.max(a + b, 1)) * 24));
  return (
    <div className="ls-fig-scale" style={{ "--tilt": `${tilt}deg` } as React.CSSProperties}>
      <div className="ls-fig-beam" aria-hidden="true">
        <span className="ls-fig-pivot" />
      </div>
      <div className="ls-fig-pans">
        {[left, right].map((p, i) => p ? (
          <div key={i} className="ls-fig-pan" data-tone={toneOf(p.tone)}
               data-side={i === 0 ? "left" : "right"}>
            <span className="ls-fig-text"><T s={p.text} /></span>
            <Num n={Math.abs(p.value ?? 0)} />
            {p.note ? <span className="ls-fig-note"><T s={p.note} /></span> : null}
          </div>
        ) : null)}
      </div>
    </div>
  );
}

function Matrix({ parts, axes }: { parts: Part[]; axes: FigureBlock["axes"] }) {
  const x = axes?.x;
  const y = axes?.y;
  return (
    <div className="ls-fig-matrix">
      <div className="ls-fig-axis is-y">
        <span><T s={y?.[0]} /></span>
        <span><T s={y?.[1]} /></span>
      </div>
      <div className="ls-fig-cells">
        {parts.slice(0, 4).map((p, i) => (
          <div key={i} className="ls-fig-cell" data-tone={toneOf(p.tone)}>
            <span className="ls-fig-text"><T s={p.text} /></span>
            {p.note ? <span className="ls-fig-note"><T s={p.note} /></span> : null}
          </div>
        ))}
      </div>
      <div className="ls-fig-axis is-x">
        <span><T s={x?.[0]} /></span>
        <span><T s={x?.[1]} /></span>
      </div>
    </div>
  );
}

function Cycle({ parts }: { parts: Part[] }) {
  return (
    <div className="ls-fig-cycle">
      <ol className="ls-fig-ring">
        {parts.map((p, i) => (
          <li key={i}><Box part={p} n={i + 1} /></li>
        ))}
      </ol>
      <p className="ls-fig-loop" aria-hidden="true" />
    </div>
  );
}

function Steps({ parts }: { parts: Part[] }) {
  return (
    <ol className="ls-fig-steps">
      {parts.map((p, i) => (
        <li key={i} style={{ "--rung": String(i) } as React.CSSProperties}>
          <Box part={p} n={i + 1} />
        </li>
      ))}
    </ol>
  );
}

function Timeline({ parts }: { parts: Part[] }) {
  return (
    <ol className="ls-fig-timeline">
      {parts.map((p, i) => (
        <li key={i} data-tone={toneOf(p.tone)}>
          <span className="ls-fig-when mono"><T s={p.note} /></span>
          <span className="ls-fig-dot" aria-hidden="true" />
          <span className="ls-fig-text"><T s={p.text} /></span>
        </li>
      ))}
    </ol>
  );
}

function Callouts({ parts, screen }: { parts: Part[]; screen: FigureBlock["screen"] }) {
  const marks = new Map<number, number>();
  parts.forEach((p, i) => { marks.set(Number(p.at), i + 1); });

  return (
    <div className="ls-fig-callouts">
      <div className="ls-fig-screen">
        {screen?.title ? (
          <p className="ls-fig-screen-title"><T s={screen.title} /></p>
        ) : null}
        <dl className="ls-fig-rows">
          {(screen?.rows ?? []).map((row, i) => (
            <div key={i} className="ls-fig-row" data-marked={marks.has(i) ? "1" : undefined}>
              <dt><T s={row.label} /></dt>
              <dd className="mono"><T s={row.value} /></dd>
              {marks.has(i)
                ? <span className="ls-fig-mark mono" aria-hidden="true">{bnNum(marks.get(i) as number)}</span>
                : null}
            </div>
          ))}
        </dl>
      </div>
      <ol className="ls-fig-notes">
        {parts.map((p, i) => (
          <li key={i} data-tone={toneOf(p.tone)}>
            <span className="ls-fig-n mono">{bnNum(i + 1)}</span>
            <span className="ls-fig-text"><T s={p.text} /></span>
            {p.note ? <span className="ls-fig-note"><T s={p.note} /></span> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function Venn({ parts }: { parts: Part[] }) {
  const [left, both, right] = parts;
  return (
    <div className="ls-fig-venn">
      <div className="ls-fig-circles" aria-hidden="true">
        <span className="ls-fig-circle is-left" />
        <span className="ls-fig-circle is-right" />
      </div>
      <div className="ls-fig-venn-keys">
        {[left, both, right].map((p, i) => p ? (
          <div key={i} className="ls-fig-venn-key" data-where={["left", "both", "right"][i]}
               data-tone={toneOf(p.tone)}>
            <span className="ls-fig-text"><T s={p.text} /></span>
            {p.note ? <span className="ls-fig-note"><T s={p.note} /></span> : null}
          </div>
        ) : null)}
      </div>
    </div>
  );
}

function Tree({ parts, screen }: { parts: Part[]; screen: FigureBlock["screen"] }) {
  return (
    <div className="ls-fig-tree">
      {screen?.title ? (
        <p className="ls-fig-root"><T s={screen.title} /></p>
      ) : null}
      <ul className="ls-fig-branches">
        {parts.map((p, i) => (
          <li key={i} data-tone={toneOf(p.tone)}>
            <span className="ls-fig-text"><T s={p.text} /></span>
            {p.note ? <span className="ls-fig-note"><T s={p.note} /></span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- the one export ---------- */

export function Figure({ block }: { block: FigureBlock }) {
  const parts = block.parts ?? [];

  const drawn = (() => {
    switch (block.shape) {
      case "flow": return <Flow parts={parts} />;
      case "stack": return <Stack parts={parts} />;
      case "scale": return <Scale parts={parts} />;
      case "matrix": return <Matrix parts={parts} axes={block.axes} />;
      case "cycle": return <Cycle parts={parts} />;
      case "steps": return <Steps parts={parts} />;
      case "timeline": return <Timeline parts={parts} />;
      case "callouts": return <Callouts parts={parts} screen={block.screen} />;
      case "venn": return <Venn parts={parts} />;
      case "tree": return <Tree parts={parts} screen={block.screen} />;
      /* A shape nobody has drawn yet is a list, which is what
         every one of these is underneath. A figure that threw
         would take the lesson down with it; a figure that renders
         its own data as text is merely plain. */
      default: return (
        <ul className="ls-fig-plain">
          {parts.map((p, i) => <li key={i}><T s={p.text} /></li>)}
        </ul>
      );
    }
  })();

  return (
    <figure className="ls-figure" data-shape={block.shape}>
      {drawn}
      {block.caption
        ? <figcaption className="ls-fig-cap"><TBlock s={block.caption} /></figcaption>
        : null}
    </figure>
  );
}

/** Whether a shape needs a `Say` in `note` to read as a date.
    Exported for `check-money.ts`, which fails a timeline whose
    points carry no `note`, because the line then has dots and no
    dates on it. */
export const SHAPES_NEEDING_NOTE: readonly string[] = ["timeline"];
