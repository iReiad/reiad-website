"use client";

/* ============================================================
   netzwerk/bits.tsx: the small pieces every planner panel uses.

   A level chip, a section head, a tick button, a table shell,
   and the date words. One file so the eleven panels look like
   one tool rather than eleven.
   ============================================================ */

import type { CSSProperties, ReactNode } from "react";
import { toneOf } from "../../lib/netzwerk-store";
import { ChipButton } from "../ui/chip";
import { SectionLabel } from "../ui/label";

export const accentOf = (level: string): CSSProperties =>
  ({ "--accent": toneOf(level) } as CSSProperties);

/** A level, in its own colour. */
export function LevelChip({ level }: { level: string }) {
  return (
    <span className="chip chip-accent" style={accentOf(level)}>{level}</span>
  );
}

/** A panel's head: the section label in both languages and one
    line under it saying what the panel is for. */
export function Head({ en, bn, note, children }: {
  en: string; bn: string; note?: ReactNode; children?: ReactNode;
}) {
  return (
    <div className="mb-5 grid gap-2">
      <SectionLabel>{en} · <span lang="bn">{bn}</span></SectionLabel>
      {note ? <p className="max-w-[60ch] text-t5 text-ink-soft">{note}</p> : null}
      {children}
    </div>
  );
}

/** A tick you press. `on` draws the pressed state and the mark. */
export function Tick({ on, onToggle, children, small }: {
  on: boolean; onToggle: () => void; children: ReactNode; small?: boolean;
}) {
  return (
    <ChipButton pressed={on} onClick={onToggle}
                className={small ? "text-t1" : undefined}>
      <span aria-hidden="true">{on ? "✓ " : ""}</span>{children}
    </ChipButton>
  );
}

/** A sheet: the spreadsheet's arrangement, with the header row
    pinned and the whole thing scrolling sideways on a phone. */
export function Sheet({ head, children, label }: {
  head: ReactNode[]; children: ReactNode; label: string;
}) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-card border border-hairline bg-panel contain-inline-size">
      <table className="w-full min-w-[640px] border-collapse text-t3" aria-label={label}>
        <thead className="sticky top-0 z-[1] bg-paper-sunk">
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col"
                  className="border-b border-hairline px-3 py-2 text-left font-code text-t1 uppercase tracking-wider text-ink-soft">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export const Td = ({ children, className, ...rest }: {
  children?: ReactNode; className?: string;
} & React.TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={["border-b border-hairline px-3 py-2 align-top", className].filter(Boolean).join(" ")}
      {...rest}>
    {children}
  </td>
);

/** "Mon 21 Sep", from `YYYY-MM-DD`. */
export function dayWord(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    weekday: "short", day: "numeric", month: "short",
  });
}

/** "21 Sep 2026". */
export function dateWord(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

/** Five dots, `n` of them filled, for a grammar point's priority. */
export function Dots({ n }: { n: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`priority ${n} of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <i key={i} className={["inline-block size-2 rounded-full", i <= n ? "bg-accent" : "bg-hairline"].join(" ")} />
      ))}
    </span>
  );
}
