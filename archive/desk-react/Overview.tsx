/* ============================================================
   Overview.tsx: what actually needs you.

   Four tiles above the tabs, and the two that mean a person is
   waiting for a reply are the only two that can go gold. The rest
   are figures, and a figure is not a task.

   The counts are fetched once and handed down to the tab strip as
   well, so the badge on a tab and the number on a tile can never
   disagree: they are the same number rendered twice.
   ============================================================ */

export interface Waiting {
  questions: number;
  enquiries: number;
  subscribers: number;
  views: number;
}

export function Overview({
  waiting, go,
}: {
  waiting: Waiting | null;
  go: (panel: string) => void;
}) {
  if (!waiting) return null;

  const tile = (label: string, value: number, panel: string, urgent = false) => (
    <button
      type="button"
      className={`desk-tile${urgent && value ? " urgent" : ""}`}
      onClick={() => go(panel)}
    >
      <span className="k mono">{label}</span>
      <span className="v">{value}</span>
    </button>
  );

  const nothing = !waiting.questions && !waiting.enquiries;

  return (
    <>
      <div className="desk-tiles">
        {tile("Questions waiting", waiting.questions, "queue", true)}
        {tile("New enquiries", waiting.enquiries, "enquiries", true)}
        {tile("Confirmed subscribers", waiting.subscribers, "subscribers")}
        {tile("Views, 30 days", waiting.views, "stats")}
      </div>
      <p className="muted" style={{ marginTop: "14px" }}>
        {nothing ? "Nothing is waiting on you." : "The tiles above are clickable."}
      </p>
    </>
  );
}
