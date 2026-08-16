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

   Comments are rows rather than cards, unlike questions. That is
   not an inconsistency: a question is answered here, so it needs a
   text box and the room to use one, and a comment is only ever
   approved, hidden or binned.
   ============================================================ */

import { useMemo, useState } from "react";
import type { Comment, Status } from "./api.ts";
import { listComments, setCommentStatus, deleteComment } from "./api.ts";
import { useRows } from "./useRows.ts";
import { isNew } from "./seen.ts";
import { toast } from "./site.ts";
import {
  Broken, Chip, Count, Empty, Filters, Loading, Pill, SearchBox, when,
} from "./bits.tsx";

const FILTERS = [
  ["pending", "Waiting"],
  ["live", "Approved"],
  ["binned", "Binned"],
] as const;

export function Comments() {
  const [status, setStatus] = useState<Status>("pending");
  const [q, setQ] = useState("");

  const { rows, loading, failed, reload } = useRows<Comment>(
    () => listComments(status),
    (reply) => (reply.comments as Comment[]) ?? [],
    [status]
  );

  /* Searched here rather than at the endpoint, which is the
     opposite of what the questions queue does and is right for the
     same reason: the comments endpoint returns one status at a
     time and never more than a screenful or two, so a round trip
     per keystroke would buy nothing. */
  const shown = useMemo(() => {
    const needle = q.toLowerCase();
    if (!needle) return rows;
    return rows.filter((c) =>
      `${c.author_name} ${c.body} ${c.section}/${c.slug}`.toLowerCase().includes(needle));
  }, [rows, q]);

  const move = async (item: Comment, next: Status) => {
    const res = await setCommentStatus(item.id, next);
    if (res?.ok) { toast(next === "live" ? "Approved" : `Moved to ${next}`); reload(); }
    else toast("That did not save");
  };

  const remove = async (item: Comment) => {
    if (!confirm("Delete permanently? Binning keeps it and hides it.")) return;
    const res = await deleteComment(item.id);
    if (res?.ok) { toast("Deleted"); reload(); } else toast("That did not delete");
  };

  return (
    <>
      <Filters options={FILTERS} active={status} onPick={setStatus} />
      <SearchBox placeholder="Search comments, names, articles" onSearch={setQ} />

      {loading ? <Loading /> : failed ? <Broken what="comments" /> : (
        <>
          <Count>
            {shown.length === rows.length
              ? `${rows.length} comment${rows.length === 1 ? "" : "s"}`
              : `${shown.length} of ${rows.length}`}
          </Count>

          {shown.length === 0 ? (
            <Empty>
              {q ? "Nothing matches that."
                : status === "pending"
                  ? "Nothing waiting. Everything readers have written has been dealt with."
                  : "Nothing here."}
            </Empty>
          ) : (
            <div className="admin-table">
              {shown.map((c) => (
                <div className={`admin-line comment-line status-${c.status}`} key={c.id}>
                  <span className="line-facts">
                    {isNew(c.created_at) ? <Pill tone="new">new</Pill> : null}
                    <Pill>{c.author_name || "Reader"}</Pill>
                    <a
                      className="mono"
                      href={`/${c.section}/${c.slug}.html`}
                      target="_blank"
                      rel="noopener"
                    >
                      {c.section}/{c.slug}
                    </a>
                    {c.parent_id ? <Pill>reply</Pill> : null}
                    <span className="mono muted">{when(c.created_at)}</span>
                  </span>

                  {/* A string child. See the note above this file. */}
                  <p className="comment-body">{c.body}</p>

                  <span className="line-actions">
                    {c.status !== "live"
                      ? <Chip tone="move" onClick={() => move(c, "live")}>Approve</Chip> : null}
                    {c.status !== "binned"
                      ? <Chip onClick={() => move(c, "binned")}>Bin</Chip> : null}
                    {c.status === "live"
                      ? <Chip onClick={() => move(c, "pending")}>Hide again</Chip> : null}
                    <Chip onClick={() => remove(c)}>Delete</Chip>
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
