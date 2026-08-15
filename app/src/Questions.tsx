/* ============================================================
   Questions.tsx: the queue this site had before it had comments.

   Same moderation, no account attached, and an answer box: a
   question is published together with its answer, under the
   article it was asked on.

   The answer is component state per question rather than one field
   read out of the DOM at submit time, which is the difference that
   made this worth porting first: the old version kept the typed
   answer in a `<textarea>` it had a reference to, and any redraw
   of the panel lost it.
   ============================================================ */

import { useState } from "react";
import type { Question } from "./api.ts";
import { listQuestions, answerQuestion, api } from "./api.ts";
import { useRows } from "./useRows.ts";
import { Broken, Count, Empty, Filters, Loading, when } from "./bits.tsx";

const FILTERS: [string, string][] = [
  ["pending", "Waiting"],
  ["published", "Published"],
  ["archived", "Archived"],
  ["spam", "Spam"],
  ["all", "Everything"],
];

function Row({ q, onDone, onToast }: {
  q: Question;
  onDone: () => void;
  onToast: (t: string) => void;
}) {
  const [answer, setAnswer] = useState(q.answer ?? "");
  const [busy, setBusy] = useState(false);

  const act = async (next: string) => {
    setBusy(true);
    const res = await answerQuestion(q.id, answer, next);
    setBusy(false);
    if (res?.ok) { onToast(next === "published" ? "Published" : `Moved to ${next}`); onDone(); }
    else onToast("That did not save");
  };

  const remove = async () => {
    if (!confirm("Delete this permanently? Archiving keeps it and hides it.")) return;
    const res = await api(`questions/${q.id}`, { method: "DELETE" });
    if (res?.ok) { onToast("Deleted"); onDone(); } else onToast("That did not delete");
  };

  return (
    <div className="admin-line">
      <span className="line-facts">
        <span className="pill">{q.name || "Anonymous"}</span>
        {q.slug ? (
          <a className="mono" href={`/insights/${q.slug}.html`} target="_blank" rel="noopener">
            {q.slug}
          </a>
        ) : <span className="mono muted">no article</span>}
        <span className="mono muted">{when(q.created_at)}</span>
      </span>

      <p className="comment-body">{q.body}</p>

      <textarea
        className="admin-answer"
        rows={3}
        placeholder="Your answer. It appears under the question on the article page."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      <span className="line-actions">
        <button type="button" className="chip chip-move" disabled={busy}
                onClick={() => act("published")}>Publish</button>
        <button type="button" className="chip" disabled={busy}
                onClick={() => act("archived")}>Archive</button>
        <button type="button" className="chip" disabled={busy}
                onClick={() => act("spam")}>Spam</button>
        <button type="button" className="chip" disabled={busy}
                onClick={remove}>Delete</button>
      </span>
    </div>
  );
}

export function Questions({ onToast }: { onToast: (text: string) => void }) {
  const [status, setStatus] = useState("pending");
  const { rows, loading, failed, reload } = useRows<Question>(
    () => listQuestions(status),
    (reply) => (reply.questions as Question[]) ?? [],
    [status]
  );

  return (
    <>
      <Filters options={FILTERS} active={status} onPick={setStatus} />

      {loading ? <Loading /> : failed ? <Broken what="questions" /> : (
        <>
          <Count>{rows.length} question{rows.length === 1 ? "" : "s"}</Count>
          {rows.length === 0
            ? <Empty>{status === "pending" ? "Nothing waiting." : "Nothing here."}</Empty>
            : (
              <div className="admin-table">
                {rows.map((q) => (
                  <Row key={q.id} q={q} onDone={reload} onToast={onToast} />
                ))}
              </div>
            )}
        </>
      )}
    </>
  );
}
