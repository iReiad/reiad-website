"use client";

/* ============================================================
   The three queues, as three specs.

   ADMIN.md §6 stage 4: Comments, Questions and Enquiries, the
   passphrase half. `queue.tsx` is the engine; everything here is
   data about one list, and adding a fourth queue should be an
   object rather than a component.

   Every column named below is one the endpoint actually selects.
   Comments is the one to watch: it answers a NARROWER row than
   `CommentRow`, because the admin SELECT is a column list rather
   than a `*`, and `AdminComment` in the handler is picked out of
   the row type for exactly that reason.
   ============================================================ */

import { AdminQueue } from "./queue";
import type { QueueSpec } from "./queue";
import type { CommentRow, EnquiryRow, QuestionRow } from "@reiad/shared/rows";

/** What `/api/comments?status=` selects, which is not a whole row. */
type AdminComment = Pick<CommentRow,
  "id" | "slug" | "section" | "parent_id" | "author_name" | "body"
  | "created_at" | "author_id" | "status" | "approved_at">;

const day = (iso: string | null): string => (iso ?? "").slice(0, 10);

/* ---------------- comments ---------------- */

const COMMENTS: QueueSpec<AdminComment> = {
  title: "Comments",
  blurb: "The moderation queue. An admin's own comment skips it, because "
    + "approving yourself is a button with one possible answer.",
  endpoint: "/api/comments",
  listKey: "comments",
  filters: [
    { id: "pending", label: "Waiting" },
    { id: "live", label: "Live" },
    { id: "binned", label: "Binned" },
  ],
  query: (f) => `status=${f}`,
  id: (c) => c.id,
  head: (c) => `${c.author_name || "somebody"} on /${c.section}/${c.slug}`,
  body: (c) => c.body,
  meta: (c) => `${day(c.created_at)}${c.parent_id ? " · a reply" : ""}`,
  actions: [
    { label: "Approve", kind: "soft", patch: { status: "live" },
      when: (c) => c.status !== "live" },
    { label: "Bin", patch: { status: "binned" }, when: (c) => c.status !== "binned" },
    { label: "Back to waiting", patch: { status: "pending" },
      when: (c) => c.status !== "pending" },
    { label: "Delete", kind: "quiet", remove: true,
      confirm: "Delete this comment and any replies to it?" },
  ],
  empty: "Nothing in this state.",
};

/* ---------------- questions ---------------- */

/* `?status=published` is deliberately not a filter here. That one
   value takes the endpoint down its PUBLIC branch, which answers
   the reader's list rather than the queue: no email, no counts,
   and no 401 for somebody without the passphrase. Answered
   questions are under "Everything", which is the admin branch and
   shows them with the rest. */
const QUESTIONS: QueueSpec<QuestionRow> = {
  title: "Questions",
  blurb: "What readers have asked. Publishing an answer is what puts the "
    + "question on the piece it was asked on.",
  endpoint: "/api/questions",
  listKey: "questions",
  filters: [
    { id: "pending", label: "Waiting" },
    { id: "all", label: "Everything" },
    { id: "spam", label: "Spam" },
    { id: "archived", label: "Archived" },
  ],
  query: (f) => `status=${f}`,
  id: (q) => q.id,
  head: (q) => `${q.name || "anonymous"}${q.slug ? ` on ${q.slug}` : ""}`,
  body: (q) => q.body,
  meta: (q) => `${day(q.created_at)} · ${q.status}`,
  compose: {
    key: "answer",
    label: "The answer, as it will read under the piece",
    value: (q) => q.answer ?? "",
    send: "Publish the answer",
    /* Publishing is the same PATCH: the endpoint stamps
       `answered_at` when the status becomes published, so sending
       an answer without it would store prose nobody sees. */
    also: { status: "published" },
  },
  actions: [
    { label: "Save without publishing", patch: { status: "pending" },
      when: (q) => q.status !== "pending" },
    { label: "Archive", patch: { status: "archived" },
      when: (q) => q.status !== "archived" },
    { label: "Spam", patch: { status: "spam" }, when: (q) => q.status !== "spam" },
    { label: "Delete", kind: "quiet", remove: true,
      confirm: "Delete this question? The reader's email goes with it." },
  ],
  empty: "Nothing waiting.",
};

/* ---------------- enquiries ---------------- */

const ENQUIRIES: QueueSpec<EnquiryRow> = {
  title: "Enquiries",
  blurb: "The contact form. Notes are private and are never sent anywhere.",
  endpoint: "/api/enquiries",
  listKey: "enquiries",
  filters: [
    { id: "new", label: "New" },
    { id: "replied", label: "Replied" },
    { id: "closed", label: "Closed" },
    { id: "all", label: "Everything" },
  ],
  /* No query: this endpoint answers the whole list, sorted so the
     new ones lead, and narrowing it four times would be four
     copies of one answer. */
  query: () => "",
  local: (e, f) => f === "all" || e.status === f,
  id: (e) => e.id,
  head: (e) => `${e.name || "somebody"} · ${e.kind}`,
  body: (e) => e.message,
  meta: (e) => `${day(e.created_at)} · ${e.email}`,
  compose: {
    key: "notes",
    label: "A private note. Nobody but this panel reads it.",
    value: (e) => e.notes ?? "",
    send: "Save the note",
  },
  actions: [
    { label: "Replied", kind: "soft", patch: { status: "replied" },
      when: (e) => e.status !== "replied" },
    { label: "Close", patch: { status: "closed" }, when: (e) => e.status !== "closed" },
    { label: "Reopen", patch: { status: "new" }, when: (e) => e.status !== "new" },
    { label: "Delete", kind: "quiet", remove: true,
      confirm: "Delete this enquiry, and the note on it?" },
  ],
  empty: "Nothing here.",
};

export const CommentsPanel = () => <AdminQueue spec={COMMENTS} />;
export const QuestionsPanel = () => <AdminQueue spec={QUESTIONS} />;
export const EnquiriesPanel = () => <AdminQueue spec={ENQUIRIES} />;
