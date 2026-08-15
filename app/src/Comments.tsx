/* ============================================================
   Comments.tsx: the moderation queue.

   Nothing a reader writes appears anywhere until it is approved
   here. That is the decision recorded in TRANSITION.md Stage 7 and
   the reason this panel exists.

   A comment body is rendered as a string child, which React
   escapes. There is no `dangerouslySetInnerHTML` in this file and
   there should never be one: a comment is text from the column to
   the screen, and this page is signed in as an administrator,
   which makes it the worst possible place to start parsing
   somebody else's markup.
   ============================================================ */

import { useState } from "react";
import type { Comment, Status } from "./api.ts";
import { listComments, setCommentStatus, deleteComment } from "./api.ts";
import { useRows } from "./useRows.ts";
import { Broken, Count, Empty, Filters, Loading, when } from "./bits.tsx";

const FILTERS: [Status, string][] = [
  ["pending", "Waiting"],
  ["live", "Approved"],
  ["binned", "Binned"],
];

export function Comments({ onToast }: { onToast: (text: string) => void }) {
  const [status, setStatus] = useState<Status>("pending");
  const { rows, loading, failed, reload } = useRows<Comment>(
    () => listComments(status),
    (reply) => (reply.comments as Comment[]) ?? [],
    [status]
  );

  const move = async (item: Comment, next: Status) => {
    const res = await setCommentStatus(item.id, next);
    if (res?.ok) { onToast(next === "live" ? "Approved" : `Moved to ${next}`); reload(); }
    else onToast("That did not save");
  };

  const remove = async (item: Comment) => {
    if (!confirm("Delete permanently? Binning keeps it and hides it.")) return;
    const res = await deleteComment(item.id);
    if (res?.ok) { onToast("Deleted"); reload(); } else onToast("That did not delete");
  };

  return (
    <>
      <Filters options={FILTERS} active={status} onPick={setStatus} />

      {loading ? <Loading /> : failed ? <Broken what="comments" /> : (
        <>
          <Count>{rows.length} comment{rows.length === 1 ? "" : "s"}</Count>

          {rows.length === 0 ? (
            <Empty>
              {status === "pending"
                ? "Nothing waiting. Everything readers have written has been dealt with."
                : "Nothing here."}
            </Empty>
          ) : (
            <div className="admin-table">
              {rows.map((c) => (
                <div className="admin-line comment-line" key={c.id}>
                  <span className="line-facts">
                    <span className="pill">{c.author_name || "Reader"}</span>
                    <a
                      className="mono"
                      href={`/${c.section}/${c.slug}.html`}
                      target="_blank"
                      rel="noopener"
                    >
                      {c.section}/{c.slug}
                    </a>
                    {c.parent_id ? <span className="pill">reply</span> : null}
                    <span className="mono muted">{when(c.created_at)}</span>
                  </span>

                  {/* A string child. React escapes it; nothing here parses it. */}
                  <p className="comment-body">{c.body}</p>

                  <span className="line-actions">
                    {c.status !== "live" && (
                      <button type="button" className="chip chip-move"
                              onClick={() => move(c, "live")}>Approve</button>
                    )}
                    {c.status !== "binned" && (
                      <button type="button" className="chip"
                              onClick={() => move(c, "binned")}>Bin</button>
                    )}
                    {c.status === "live" && (
                      <button type="button" className="chip"
                              onClick={() => move(c, "pending")}>Hide again</button>
                    )}
                    <button type="button" className="chip"
                            onClick={() => remove(c)}>Delete</button>
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
