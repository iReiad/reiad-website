/* ============================================================
   One line of a panel: a dot, a label, and what it says.

   Lifted out of `health.tsx` when the second panel needed it.
   Three states and not two, because "not configured" is not the
   same as "broken", and a panel that paints them the same sends
   somebody looking for a fault that is a setting. Two wrangler
   secrets are missing on a working site by default.
   ============================================================ */

export type State = "up" | "down" | "unset";

export function Row(
  { label, state, note }: { label: string; state: State; note?: string },
) {
  return (
    <div className="ad-row" data-state={state}>
      <span className="ad-dot" aria-hidden="true" />
      <span className="ad-row-label">{label}</span>
      <span className="ad-row-note mono">{note ?? (
        state === "up" ? "ok" : state === "down" ? "unreachable" : "not set"
      )}</span>
    </div>
  );
}
