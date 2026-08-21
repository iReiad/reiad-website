/* ============================================================
   Questions.tsx: the queue this site had before it had comments.

   Same moderation, no account attached, and an answer box: a
   question is published together with its answer, under the
   article it was asked on.

   ---- the bug this panel was rebuilt around, twice ----

   The first time was in `desk.js`: the queue only ever asked for
   `pending` and `published`, so anything archived or marked spam
   left the interface permanently, and the button that archives is
   labelled in a way that reads like filing something rather than
   deleting it. A real question sat invisible in the database for
   two days. Every status is reachable here and everything can be
   moved back, which is why there are five filters and why every
   card offers "Back to waiting".

   The second time was in the first React version of this file,
   which dropped the search box, the per-status counts and three
   of the five actions, and drew what was left with the compact
   row class meant for the article list. It looked like less of a
   page because it was less of a page.
   ============================================================ */

import { useState } from "react";
import type { Question } from "./api.ts";
import { listQuestions, answerQuestion, deleteQuestion } from "./api.ts";
import { useRows } from "./useRows.ts";
import { isNew } from "./seen.ts";
import { toast } from "./site.ts";
import { Button } from "../../next/components/ui/button.tsx";
import {
  Actions, Broken, Count, Empty, Filters, Loading, Pill, SearchBox, when,
} from "./bits.tsx";

const FILTERS = [
  ["pending", "Waiting"],
  ["published", "Published"],
  ["archived", "Archived"],
  ["spam", "Spam"],
  ["all", "Everything"],
] as const;

type Filter = typeof FILTERS[number][0];

/** One question, and every direction it can go from here.

    The answer is component state rather than a `<textarea>` read
    out of the DOM at submit time, which is the difference that
    made this worth porting: in the old desk any redraw of the
    panel threw away a half-typed answer, and approving the
    question above yours was a redraw. */
function Card({ q, onDone }: { q: Question; onDone: () => void }) {
  const [answer, setAnswer] = useState(q.answer ?? "");
  const [busy, setBusy] = useState(false);

  const act = async (next: string) => {
    setBusy(true);
    const res = await answerQuestion(q.id, answer, next);
    setBusy(false);
    if (res?.ok) {
      toast(next === "published" ? "Published" : `Moved to ${next}`);
      onDone();
    } else toast("That did not save");
  };

  const remove = async () => {
    if (!confirm("Delete this permanently? Archiving keeps it and hides it.")) return;
    setBusy(true);
    const res = await deleteQuestion(q.id);
    setBusy(false);
    if (res?.ok) { toast("Deleted"); onDone(); } else toast("That did not delete");
  };

  return (
    <div className={`admin-row status-${q.status}`}>
      <div className="admin-meta mono">
        {isNew(q.created_at) ? <Pill tone="new">new</Pill> : null}
        <Pill>{q.status}</Pill>
        <span>{q.slug ? `on ${q.slug}` : "general"}</span>
        <span>{q.name || "anonymous"}</span>
        <span>{when(q.created_at)}</span>
        {q.email ? <a href={`mailto:${q.email}`}>{q.email}</a> : null}
      </div>

      {/* A string child. React escapes it, and `.admin-q` keeps the
          reader's own line breaks with white-space: pre-wrap. */}
      <p className="admin-q">{q.body}</p>

      <textarea
        className="admin-answer"
        rows={3}
        placeholder="Your answer. It appears under the question on the article page."
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
      />

      {/* Every status can reach every other one. The point is that
          nothing here is a one-way door. */}
      <Actions>
        {q.status !== "published"
          ? (
            <Button kind="solid" disabled={busy} onClick={() => act("published")}>
              Answer &amp; publish
            </Button>
          )
          : <Button disabled={busy} onClick={() => act("pending")}>Unpublish</Button>}
        {q.status !== "archived"
          ? <Button disabled={busy} onClick={() => act("archived")}>Archive</Button> : null}
        {q.status !== "spam"
          ? <Button disabled={busy} onClick={() => act("spam")}>Spam</Button> : null}
        {q.status !== "pending"
          ? <Button disabled={busy} onClick={() => act("pending")}>Back to waiting</Button> : null}
        <Button disabled={busy} onClick={remove}>Delete</Button>
      </Actions>
    </div>
  );
}

export function Questions() {
  const [status, setStatus] = useState<Filter>("pending");
  const [q, setQ] = useState("");

  const { rows, extra, loading, failed, reload } = useRows<Question>(
    () => listQuestions(status, q),
    (reply) => (reply.questions as Question[]) ?? [],
    [status, q]
  );

  const counts = (extra?.counts as Record<Filter, number>) ?? undefined;

  return (
    <>
      <Filters options={FILTERS} active={status} counts={counts} onPick={setStatus} />
      <SearchBox id="search-questions"
                 placeholder="Search questions, names, articles" onSearch={setQ} />

      {loading ? <Loading /> : failed ? <Broken what="the queue" /> : (
        <>
          <Count>
            {rows.length
              ? `${rows.length} ${status === "all" ? "in total" : status}`
              : q ? "Nothing matches that." : "Nothing here."}
          </Count>

          {rows.length === 0 && !q ? (
            <Empty>
              {status === "pending"
                ? "Nothing waiting. Every question a reader has asked has been dealt with."
                : "Nothing with that status."}
            </Empty>
          ) : rows.map((row) => <Card key={row.id} q={row} onDone={reload} />)}
        </>
      )}
    </>
  );
}
