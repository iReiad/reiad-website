/* ============================================================
   lesson/lab.tsx: the two blocks made of numbers.

   `chart` draws numbers that are in the row. `lab` draws numbers
   a model computed from where the reader put the sliders.

   ---- why a chart is SVG here and a figure is not ----

   Because a chart has no prose in it. Its labels are years and
   percentages, its shape is geometry, and geometry is what SVG
   is for. A figure's labels are sentences in two languages, which
   is why that file is HTML. Neither is the general answer; each
   is the answer for what it draws.

   ---- and every chart has a table under it ----

   `<svg>` with no text is a picture of nothing to a screen
   reader, and a summary saying "a rising line" is a description
   of the drawing rather than the data. So the same numbers are
   also a table, visually hidden, in both languages, and that
   table is what a reader who cannot see the drawing gets.
   ============================================================ */

"use client";

import { useState } from "react";
import { bnNum, type ChartBlock, type LabBlock, type Say, type Tone } from "@reiad/shared/lesson";
import { LABS, labDefaults, type LabChart, type LabModel } from "@reiad/shared/lesson-labs";
import { T, TBlock, TPair, numSay, pick } from "./lang";
import { useReadLang } from "./lang-switch";

/* ---------- the drawing ---------- */

const WIDTH = 100;
const HEIGHT = 46;

interface Drawn {
  shape: "line" | "bar" | "stack" | "donut";
  labels: string[];
  series: { name: Say; values: number[]; tone?: Tone }[];
  unit?: Say;
  mark?: { at: number; label: Say };
}

function Plot({ chart }: { chart: Drawn }) {
  const series = chart.series ?? [];
  const points = chart.labels.length;
  if (!points || !series.length) return null;

  const flat = series.flatMap((s) => s.values);
  const stacked = chart.shape === "stack";
  const columnTotals = stacked
    ? chart.labels.map((_, i) => series.reduce((a, s) => a + Math.max(0, s.values[i] ?? 0), 0))
    : [];
  const top = Math.max(
    stacked ? Math.max(...columnTotals) : Math.max(...flat, 0),
    chart.mark ? chart.mark.at : 0,
    0.0001);
  const bottom = Math.min(stacked ? 0 : Math.min(...flat, 0), chart.mark ? chart.mark.at : 0, 0);
  const span = top - bottom || 1;

  const x = (i: number): number => points === 1 ? WIDTH / 2 : (i / (points - 1)) * WIDTH;
  const y = (v: number): number => HEIGHT - ((v - bottom) / span) * HEIGHT;

  if (chart.shape === "donut") {
    const values = series[0].values;
    const total = values.reduce((a, b) => a + Math.max(0, b), 0) || 1;
    let turned = 0;
    return (
      <svg className="ls-plot" viewBox="0 0 40 40" role="presentation" preserveAspectRatio="xMidYMid meet">
        {values.map((v, i) => {
          const frac = Math.max(0, v) / total;
          const dash = frac * 100;
          const offset = 25 - turned * 100;
          turned += frac;
          return (
            <circle key={i} cx="20" cy="20" r="15.9155" fill="none" strokeWidth="7"
                    className="ls-plot-arc" data-i={i % 5}
                    strokeDasharray={`${dash} ${100 - dash}`}
                    strokeDashoffset={offset} />
          );
        })}
      </svg>
    );
  }

  return (
    <svg className="ls-plot" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="presentation"
         preserveAspectRatio="none">
      {/* The zero line, where the data crosses it. A bar chart
          whose negative bars hang off an invisible axis is a bar
          chart that looks like it has short bars. */}
      {bottom < 0 ? (
        <line className="ls-plot-zero" x1="0" x2={WIDTH} y1={y(0)} y2={y(0)} />
      ) : null}
      {chart.mark ? (
        <line className="ls-plot-mark" x1="0" x2={WIDTH} y1={y(chart.mark.at)} y2={y(chart.mark.at)} />
      ) : null}

      {chart.shape === "line" ? series.map((s, si) => {
        const path = s.values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(2)},${y(v).toFixed(2)}`).join(" ");
        return (
          <path key={si} className="ls-plot-line" data-tone={s.tone ?? "plain"} data-i={si} d={path} />
        );
      }) : null}

      {chart.shape === "bar" ? series.map((s, si) => {
        const width = (WIDTH / points) * (0.7 / series.length);
        return s.values.map((v, i) => {
          const left = x(i) - (WIDTH / points) * 0.35 + si * width
            + (points === 1 ? 0 : 0);
          const zero = y(Math.max(0, Math.min(0, v)) === 0 ? 0 : 0);
          const height = Math.abs(y(v) - zero);
          return (
            <rect key={`${si}-${i}`} className="ls-plot-bar" data-tone={s.tone ?? "plain"} data-i={si}
                  x={Math.max(0, left).toFixed(2)} width={width.toFixed(2)}
                  y={Math.min(y(v), zero).toFixed(2)} height={Math.max(0.4, height).toFixed(2)} />
          );
        });
      }) : null}

      {chart.shape === "stack" ? chart.labels.map((_, i) => {
        const width = (WIDTH / points) * 0.7;
        let base = 0;
        return (
          <g key={i}>
            {series.map((s, si) => {
              const v = Math.max(0, s.values[i] ?? 0);
              const y0 = y(base);
              base += v;
              const y1 = y(base);
              return (
                <rect key={si} className="ls-plot-bar" data-tone={s.tone ?? "plain"} data-i={si}
                      x={Math.max(0, x(i) - width / 2).toFixed(2)} width={width.toFixed(2)}
                      y={y1.toFixed(2)} height={Math.max(0.3, y0 - y1).toFixed(2)} />
              );
            })}
          </g>
        );
      }) : null}
    </svg>
  );
}

/** The same numbers as a table, which is what a reader who
    cannot see the drawing is given. Hidden from the eye, not
    from the accessibility tree. */
function PlotTable({ chart }: { chart: Drawn }) {
  return (
    <div className="ls-sr">
      <table>
        <thead>
          <tr>
            <th scope="col">
              <TPair bn="ধাপ" en="Step" />
            </th>
            {chart.series.map((s, i) => <th key={i} scope="col"><T s={s.name} /></th>)}
          </tr>
        </thead>
        <tbody>
          {chart.labels.map((label, i) => (
            <tr key={i}>
              <th scope="row">
                <span className="ls-bn" lang="bn">{bnNum(label)}</span>
                <span className="ls-en" lang="en">{label}</span>
              </th>
              {chart.series.map((s, si) => (
                <td key={si}>
                  <span className="ls-bn" lang="bn">{bnNum((s.values[i] ?? 0).toFixed(1))}</span>
                  <span className="ls-en" lang="en">{(s.values[i] ?? 0).toFixed(1)}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Legend({ chart }: { chart: Drawn }) {
  if (chart.series.length < 2 && !chart.unit) return null;
  return (
    <ul className="ls-legend">
      {chart.series.map((s, i) => (
        <li key={i} data-tone={s.tone ?? "plain"} data-i={i}>
          <span className="ls-key-swatch" aria-hidden="true" />
          <T s={s.name} />
        </li>
      ))}
      {chart.unit ? (
        <li className="ls-legend-unit mono"><T s={chart.unit} /></li>
      ) : null}
    </ul>
  );
}

export function Chart({ block }: { block: ChartBlock }) {
  const chart: Drawn = {
    shape: block.shape,
    labels: block.labels,
    series: block.series,
    unit: block.unit,
    mark: block.mark,
  };
  return (
    <div className="ls-chart">
      <Plot chart={chart} />
      <Legend chart={chart} />
      <PlotTable chart={chart} />
      {block.mark ? (
        <p className="ls-chart-mark mono"><T s={block.mark.label} /></p>
      ) : null}
      {block.source ? (
        <p className="ls-chart-source mono"><T s={block.source} /></p>
      ) : null}
    </div>
  );
}

/* ---------- the lab ---------- */

function Out({ label, value, fmt, tone, big, note }: {
  label: Say; value: number; fmt: string; tone?: Tone; big?: boolean; note?: Say;
}) {
  return (
    <div className={`ls-out${big ? " is-big" : ""}`} data-tone={tone ?? "plain"}>
      <span className="ls-out-label"><T s={label} /></span>
      <span className="ls-out-value"><T s={numSay(value, fmt)} /></span>
      {note ? <span className="ls-out-note"><T s={note} /></span> : null}
    </div>
  );
}

export function Lab({ block }: { block: LabBlock }) {
  const model: LabModel | undefined = LABS[block.model];
  const [values, setValues] = useState<Record<string, number>>(
    () => model ? labDefaults(model, block.preset) : {});
  const lang = useReadLang();

  /* A model that is not here is a row naming a release that has
     not happened. The lesson still renders: the prose is the
     lesson and a missing calculator must never take it down. */
  if (!model) {
    return (
      <div className="ls-missing">
        <TBlock s={{
          bn: "এই হিসাবটা এখনো এই সংস্করণে নেই। লেখাটা পড়ে যান, অঙ্কটা পরের বার।",
          en: "This calculator is not in this version yet. The lesson reads without it.",
        }} />
      </div>
    );
  }

  const hidden = new Set(block.hide ?? []);
  const shown = model.inputs.filter((i) => !hidden.has(i.id));
  const result = model.run(values);
  const chart: Drawn | null = result.chart
    ? { ...(result.chart as LabChart), mark: undefined }
    : null;

  return (
    <div className="ls-lab">
      <div className="ls-inputs">
        {shown.map((input) => (
          <label key={input.id} className="ls-input">
            <span className="ls-input-label"><T s={input.label} /></span>
            <span className="ls-input-value mono">
              <T s={numSay(values[input.id] ?? input.value, input.fmt)} />
            </span>
            <input
              type="range"
              className="ls-range"
              min={input.min}
              max={input.max}
              step={input.step}
              value={values[input.id] ?? input.value}
              aria-label={pick(input.label, lang)}
              onChange={(e) => setValues((was) => ({ ...was, [input.id]: Number(e.target.value) }))}
            />
            {input.note ? <span className="ls-input-note"><T s={input.note} /></span> : null}
          </label>
        ))}
      </div>

      <div className="ls-outs">
        {result.outs.map((o, i) => (
          <Out key={i} label={o.label} value={o.value} fmt={o.fmt}
               tone={o.tone} big={o.big} note={o.note} />
        ))}
      </div>

      {chart ? (
        <div className="ls-chart">
          <Plot chart={chart} />
          <Legend chart={chart} />
          <PlotTable chart={chart} />
        </div>
      ) : null}

      {result.verdict ? (
        <div className="ls-verdict" data-tone={result.verdict.tone}>
          <TBlock s={result.verdict.text} />
        </div>
      ) : null}

      <p className="ls-actions">
        <button type="button" className="ls-reset"
                onClick={() => setValues(labDefaults(model, block.preset))}>
          {lang === "bn" ? "শুরুর অবস্থায় ফেরান" : "Back to the start"}
        </button>
      </p>
    </div>
  );
}
