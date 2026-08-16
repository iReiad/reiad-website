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
   JavaScript; its shape is written down in `site-modules.d.ts`. */
import { api as rawApi } from "/api.js";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

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

export interface Subscriber {
  email: string;
  status: string;
  lang: string;
  source: string;
  created_at: string;
  confirmed_at: string | null;
}

/** One earlier body of an article, kept when a republish overwrote it. */
export interface Version {
  id: number;
  title: string;
  saved_at: string;
  size: number;
}

/* A type alias rather than an interface, and not by accident: an
   interface gets no implicit index signature, so `Reply<Stats>`
   cannot be handed to a helper that takes the loose shape every
   endpoint returns. `useRows` is that helper. */
/** A path, a day and a number. That is the entire record. */
export type Stats = {
  days: number;
  since: string;
  total: number;
  top: { path: string; views: number }[];
  daily: { day: string; views: number }[];
  reactions: { slug: string; kind: string; count: number }[];
};

/* ============================================================
   The calls, named

   Every one of these is a URL that existed already. Naming them
   here is the point: a panel asks for `listEnquiries()` and gets
   `Enquiry[]`, rather than assembling a query string and then
   rediscovering what came back by reading the SQL in `functions/`.
   ============================================================ */

export const listComments = (status: Status) =>
  api<{ comments: Comment[] }>(`comments?status=${encodeURIComponent(status)}`);

export const setCommentStatus = (id: number, status: Status) =>
  api<{ comment: Comment }>(`comments/${id}`, { method: "PATCH", body: { status } });

export const deleteComment = (id: number) =>
  api<{ deleted: number }>(`comments/${id}`, { method: "DELETE" });

/* Questions carry a search term as well as a status, because the
   queue is searched on the server: it can hold three hundred rows
   and the interesting one is usually found by remembering a word
   of it rather than by scrolling. */
export const listQuestions = (status: string, q = "") =>
  api<{ questions: Question[]; counts: Record<string, number> }>(
    `questions?${new URLSearchParams({ status, ...(q ? { q } : {}) })}`
  );

export const answerQuestion = (id: number, answer: string, status: string) =>
  api<{ question: Question }>(`questions/${id}`, { method: "PATCH", body: { answer, status } });

export const deleteQuestion = (id: number) =>
  api<{ deleted: number }>(`questions/${id}`, { method: "DELETE" });

export const listEnquiries = () =>
  api<{ enquiries: Enquiry[] }>("enquiries");

export const saveEnquiry = (id: number, status: string, notes: string) =>
  api<{ enquiry: Enquiry }>(`enquiries/${id}`, { method: "PATCH", body: { status, notes } });

export const listSubscribers = () =>
  api<{ subscribers: Subscriber[]; counts: Record<string, number> }>("subscribers");

export const readStats = (days: number) =>
  api<Stats>(`signals/stats?days=${days}`);

/* `all=1` is what makes this the desk's list rather than the
   reader's: drafts included. */
export const listArticles = () =>
  api<{ articles: Article[] }>("articles?all=1");

export const readArticle = (slug: string) =>
  api<{ article: Article & { body: string } }>(`articles/${encodeURIComponent(slug)}`);

export const patchArticle = (slug: string, body: Record<string, unknown>) =>
  api<{ article: Article }>(`articles/${encodeURIComponent(slug)}`, { method: "PATCH", body });

export const deleteArticle = (slug: string) =>
  api<{ deleted: string }>(`articles/${encodeURIComponent(slug)}`, { method: "DELETE" });

export const listVersions = (slug: string) =>
  api<{ versions: Version[] }>(`articles/${encodeURIComponent(slug)}/versions`);

export const restoreVersion = (slug: string, id: number) =>
  api<{ restored: number }>(`articles/${encodeURIComponent(slug)}/versions`,
    { method: "POST", body: { id } });
