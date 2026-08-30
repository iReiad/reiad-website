"use client";

/* ============================================================
   lesson/grid.tsx: a sheet the reader types into.

   The twelfth block kind, and the first one where a reader puts a
   NUMBER in rather than choosing between numbers somebody else
   wrote. `shared/lesson-grids.ts` says why that matters and owns
   every table this draws.

   ---- a table, and it stays a table ----

   Not a grid of divs. Rows and columns with headers is what a
   `<table>` is for, and it is what a screen reader announces as
   one: "row 4, Gross profit, 4200". The same markup a sighted
   reader scans down is the markup that reads out, which is not
   true of anything built out of boxes.

   ---- what is typed, and what answers ----

   A cell is `given`, `input` or `calc`. Only the `input` cells
   are focusable; the `calc` cells are `<output>`, which is the
   element that exists for exactly this and which a screen reader
   announces as a live result rather than as more table.

   ---- and a drill is the same object ----

   A cell with `expectSay` on it is a hole with a right answer in
   it, which is what makes one component serve a profit and loss
   account and a German verb's six forms. It marks nothing until
   the reader asks: a table that goes red while somebody is still
   typing the third letter of `nimmst` is a table that tells them
   they are wrong before they have finished being right.
   ============================================================ */

import { useState } from "react";
import type { GridBlock } from "@reiad/shared/lesson";
import {
  GRIDS, cellAt, gridStart, sayNumber, solve,
  type GridCell, type GridModel,
} from "@reiad/shared/lesson-grids";
import { Button } from "../ui/button";
import { T, TBlock } from "./lang";
import { useReadLang } from "./lang-switch";

/** Case-folded and trimmed, because a reader who typed "Nimmst"
    or "nimmst " has the answer. Not accent-folded: in German and
    in Arabic the mark IS the answer. */
const same = (a: string, b: string): boolean =>
  a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase();

export function Grid({ block }: { block: GridBlock }) {
  const model: GridModel | undefined = GRIDS[block.model];
  const lang = useReadLang();

  const [typed, setTyped] = useState<Record<string, number>>(
    () => model ? { ...gridStart(model), ...(block.preset ?? {}) } : {});
  const [said, setSaid] = useState<Record<string, string>>({});
  /* Nothing is marked until this is pressed. See the header. */
  const [marked, setMarked] = useState(false);

  /* A sheet that is not here is a row naming a release that has
     not happened, which is the same case `Lab` handles and for
     the same reason: the prose is the lesson. */
  if (!model) {
    return (
      <div className="ls-missing">
        <TBlock s={{
          bn: "এই ছকটা এখনো এই সংস্করণে নেই। লেখাটা পড়ে যান, ছকটা পরের বার।",
          en: "This sheet is not in this version yet. The lesson reads without it.",
        }} />
      </div>
    );
  }

  /* One id per row header, unique to this sheet on the page:
     two grids in one lesson would otherwise both point at
     `revenue` and the second one's boxes would be named by the
     first one's rows. */
  const headId = `g-${block.model}`;

  const at = solve(model, typed);
  const drill = model.rows.some((r) => r.cells.some((c) => c.expectSay !== undefined));
  const answers = model.rows.flatMap((r) => r.cells
    .map((c, i) => ({ c, key: cellAt(r.id, i) }))
    .filter((x) => x.c.expectSay !== undefined));
  const right = answers.filter((x) => same(said[x.key] ?? "", x.c.expectSay ?? "")).length;

  const verdict = model.verdict?.((id) => at[id] ?? 0);

  const cell = (c: GridCell, key: string, rowId: string) => {
    if (c.kind === "given") {
      return c.say
        ? <span className="ls-cell-word"><T s={c.say} /></span>
        : <span className="mono">{sayNumber(c.value ?? 0, c.fmt ?? model.fmt, lang)}</span>;
    }

    if (c.kind === "calc") {
      return (
        <output className="mono ls-cell-out" htmlFor={(c.from ?? []).join(" ")}>
          {sayNumber(at[key] ?? 0, c.fmt ?? model.fmt, lang)}
        </output>
      );
    }

    /* NAMED BY THE ROW HEADER, not by a label of its own.

       `<Field>` is the site's answer to an unlabelled box and it
       is the wrong answer inside a table: a cell already has a
       name, and it is the `<th scope="row">` at the start of its
       row. `aria-labelledby` at that header is a stronger
       association than a `<label>` beside the box, and a hidden
       label as well would announce the same words twice.
       `check-components.ts` skips an input that carries the
       attribute, which is a claim somebody can check rather than
       a file name on a list. */
    if (c.expectSay !== undefined) {
      const mine = said[key] ?? "";
      const ok = same(mine, c.expectSay);
      return (
        <input
          type="text"
          className="ls-cell-in"
          aria-labelledby={`${headId}-${rowId}`}
          value={mine}
          data-state={marked && mine ? (ok ? "right" : "wrong") : undefined}
          onChange={(e) => setSaid((was) => ({ ...was, [key]: e.target.value }))}
        />
      );
    }

    return (
      <input
        type="number"
        className="ls-cell-in mono"
        inputMode="decimal"
        aria-labelledby={`${headId}-${rowId}`}
        value={String(typed[key] ?? c.start ?? 0)}
        onChange={(e) => {
          const n = Number(e.target.value);
          setTyped((was) => ({ ...was, [key]: Number.isFinite(n) ? n : 0 }));
        }}
      />
    );
  };

  return (
    <div className="ls-grid">
      <div className="table-scroll">
        <table className="ls-sheet">
          <thead>
            <tr>
              <th scope="col"><T s={model.title} /></th>
              {model.columns.map((c, i) => (
                <th scope="col" key={i} className="mono"><T s={c} /></th>
              ))}
            </tr>
          </thead>
          <tbody>
            {model.rows.map((r) => (
              <tr key={r.id} data-lead={r.lead ? "" : undefined}>
                <th scope="row" id={`${headId}-${r.id}`}><T s={r.label} /></th>
                {r.cells.map((c, i) => (
                  <td key={i} data-kind={c.kind}>
                    {cell(c, cellAt(r.id, i), r.id)}
                    {c.note ? <span className="ls-cell-note"><T s={c.note} /></span> : null}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {drill ? (
        <div className="ls-sheet-foot">
          <Button kind="ghost" size="sm" onClick={() => setMarked(true)}>
            <T s={{ bn: "মিলিয়ে দেখুন", en: "Check them" }} />
          </Button>
          {marked ? (
            <p className="ls-sheet-score mono"
               data-state={right === answers.length ? "good" : "warn"}>
              <T s={{
                bn: `${right} / ${answers.length} ঠিক`,
                en: `${right} of ${answers.length} right`,
              }} />
            </p>
          ) : null}
        </div>
      ) : null}

      {verdict ? (
        <p className="ls-verdict" data-tone={verdict.tone}>
          <T s={verdict.text} />
        </p>
      ) : null}
    </div>
  );
}
