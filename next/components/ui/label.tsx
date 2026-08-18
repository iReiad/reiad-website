/* ============================================================
   ui/label.tsx: the small line above a heading.

   `className="section-label mono"` appears forty-three times in
   the routes, and `.eyebrow` is the same object under a second
   name. Both are a short line in the mono face, uppercase, in the
   quiet ink, sitting above a heading and saying what part of the
   page this is.

   ---- it is not a heading ----

   A `<span>`, deliberately. It reads as one to a person and would
   be a second, wrong heading to a screen reader working down the
   outline: an eyebrow above an h2 is not an h1. The heading under
   it carries the level.
   ============================================================ */

import type { ReactNode } from "react";

export function SectionLabel({
  children, className,
}: { children: ReactNode; className?: string }) {
  return (
    <span
      className={["block font-mono text-t1 font-medium uppercase",
        "tracking-[0.07em] text-ink-soft", className].filter(Boolean).join(" ")}
    >
      {children}
    </span>
  );
}

/**
 * The label, its heading and whatever sits beside them.
 *
 * A header is three things often enough to be one component: the
 * eyebrow, the title, and an action on the right. Written out at
 * every call site, the action ends up under the title on a phone
 * about half the time, because whoever wrote that one forgot to
 * let it wrap.
 */
export function SectionHead({
  label, title, action, as: Tag = "h2",
}: {
  label?: ReactNode;
  title: ReactNode;
  action?: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
      <div className="flex flex-col gap-1">
        {label ? <SectionLabel>{label}</SectionLabel> : null}
        <Tag className="text-t5 leading-tight text-ink">{title}</Tag>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
