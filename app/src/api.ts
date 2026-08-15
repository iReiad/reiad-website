/* ============================================================
   api.ts: the site's API, with its shapes written down.

   `aab/api.js` already does the fetching, the timeout, the
   same-origin credentials and the "503 means no backend" rule, and
   it is loaded by every page on the site. Reimplementing it here
   would be a second client to keep in step with the first, so this
   imports it and adds the one thing it cannot have: types.

   The types are the point of this file. Every row shape below was
   previously known only by reading the SQL in `functions/`, and
   every desk panel rediscovered it by hand. Writing them down once
   is most of what Stage 9 is actually buying.
   ============================================================ */

/* The site's own client, borrowed rather than rebuilt. It is plain
   JavaScript with no types of its own, so it is declared here. */
// @ts-expect-error - /api.js is untyped JavaScript served by the site
import { api as rawApi } from "/api.js";

type Method = "GET" | "POST" | "PATCH" | "DELETE";

interface Options {
  method?: Method;
  body?: unknown;
  timeout?: number;
}

/** Whatever came back, plus the fields every endpoint sends. */
export type Reply<T> = (T & { ok: true; status: number })
  | { ok: false; reason: string; message?: string; status: number };

export const api = <T,>(path: string, options?: Options): Promise<Reply<T> | null> =>
  rawApi(path, options) as Promise<Reply<T> | null>;

/* ============================================================
   What the tables actually hold
   ============================================================ */

export type Status = "pending" | "live" | "binned";

export interface Comment {
  id: number;
  slug: string;
  section: string;
  parent_id: number | null;
  author_name: string;
  author_id?: string;
  body: string;
  status?: Status;
  created_at: string;
  approved_at?: string | null;
  replies?: Comment[];
}

export interface Question {
  id: number;
  slug: string | null;
  name: string;
  email?: string | null;
  body: string;
  answer: string | null;
  status: string;
  created_at: string;
  answered_at: string | null;
}

export interface Article {
  slug: string;
  title: string;
  dek: string;
  tag: string;
  topics: string[];
  lang: string;
  minutes: number;
  status: string;
  section: string;
  cover: string;
  embedded?: 0 | 1;
  published_at: string | null;
  updated_at: string;
}

export interface Enquiry {
  id: number;
  name: string;
  email: string;
  kind: string;
  message: string;
  status: string;
  notes: string;
  created_at: string;
}

/* ============================================================
   The calls, named
   ============================================================ */

export const listComments = (status: Status) =>
  api<{ comments: Comment[] }>(`comments?status=${encodeURIComponent(status)}`);

export const setCommentStatus = (id: number, status: Status) =>
  api<{ comment: Comment }>(`comments/${id}`, { method: "PATCH", body: { status } });

export const deleteComment = (id: number) =>
  api<{ deleted: number }>(`comments/${id}`, { method: "DELETE" });

export const listQuestions = (status: string) =>
  api<{ questions: Question[]; counts: Record<string, number> }>(
    `questions?status=${encodeURIComponent(status)}`
  );

export const answerQuestion = (id: number, answer: string, status: string) =>
  api<{ question: Question }>(`questions/${id}`, { method: "PATCH", body: { answer, status } });

export const listArticles = () =>
  api<{ articles: Article[] }>("articles?all=1");
