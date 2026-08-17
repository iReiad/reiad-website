/* Types for rows.js: what a row of this database is.

   archive/TRANSITION.md Stage 12, step 1. Every handler under
   `functions/` reads these tables and re-derives their shape from
   whatever SQL it happens to have written, so a row is `any` on
   the way out of D1 and stays `any` all the way to the page. This
   is the one description of them.

   The status unions are derived from the arrays in `rows.js`
   rather than retyped, so adding a value to one adds it to the
   other by construction. `scripts/check-rows.mjs` holds those
   arrays to what the handlers actually write. */

export const SECTIONS: readonly ["insights", "cooking", "travel"];
export const ARTICLE_STATUS: readonly ["draft", "live"];
export const QUESTION_STATUS: readonly ["pending", "published", "spam", "archived"];
export const COMMENT_STATUS: readonly ["pending", "live", "binned"];
export const SUBSCRIBER_STATUS: readonly ["pending", "confirmed", "unsubscribed"];
export const ENQUIRY_STATUS: readonly ["new", "replied", "closed"];
export const ENQUIRY_KIND: readonly ["hiring", "project", "reader", "general"];
export const SCHOOL_STATUS: readonly ["live", "soon"];
export const SCHOOLS: readonly ["money", "deutsch", "quran", "english"];

export type Section = (typeof SECTIONS)[number];
export type ArticleStatus = (typeof ARTICLE_STATUS)[number];
export type QuestionStatus = (typeof QUESTION_STATUS)[number];
export type CommentStatus = (typeof COMMENT_STATUS)[number];
export type SubscriberStatus = (typeof SUBSCRIBER_STATUS)[number];
export type EnquiryStatus = (typeof ENQUIRY_STATUS)[number];
export type EnquiryKind = (typeof ENQUIRY_KIND)[number];
export type SchoolStatus = (typeof SCHOOL_STATUS)[number];
export type School = (typeof SCHOOLS)[number];

/** A piece of writing. The Studio writes it, the renderer reads
    it, and `shared/look.js` has described it since Stage 10 for
    the Next.js route alone. That description is the same shape
    and is kept: this one adds the columns a route never needed
    and the Worker's own handlers do. */
export interface ArticleRow {
  slug: string;
  title: string;
  dek: string;
  tag: string;
  /** Pipe separated, which is what the column holds: an array
      here would be a description of what somebody wishes it was.
      `Equities|Beginner`. */
  topics: string;
  lang: string;
  /** Sanitised HTML, by `functions/_lib/sanitise.js` on the way
      in. Never sanitised on the way out, which is why the way in
      is the only place that may be wrong. */
  body: string;
  minutes: number;
  status: ArticleStatus;
  section: Section;
  /** ISO date, set when it goes live, null before that. */
  published_at: string | null;
  created_at: string;
  updated_at: string;
  /** `/media/...`, the lead image and the og:image both. Empty
      when the piece has neither. */
  cover: string;
  notion_page_id: string | null;
  notion_synced_at: string | null;
}

/** The body before the last overwrite, and the nineteen before
    that. Publishing replaces an article in place. */
export interface ArticleVersionRow {
  id: number;
  slug: string;
  title: string;
  dek: string;
  tag: string;
  lang: string;
  body: string;
  cover: string;
  saved_at: string;
}

/** A reader's question. `slug` is the article it was asked on,
    and null means it was asked in general. */
export interface QuestionRow {
  id: number;
  slug: string | null;
  /** Shown if published. */
  name: string;
  /** Never shown, and only so that somebody can reply. It is one
      of the two reasons `content/articles.backup.json` selects
      columns rather than rows. */
  email: string | null;
  body: string;
  answer: string | null;
  status: QuestionStatus;
  created_at: string;
  answered_at: string | null;
}

/** A comment, moderated exactly like a question and with an
    author attached.

    `author_id` is a Supabase user id, written only after the
    Worker has verified the signature on the reader's access
    token. `author_name` is a COPY of the display name at the
    time of writing, which is the seam in archive/TRANSITION.md doing its
    job: D1 holds what a signed-out reader needs to render the
    page, Supabase holds who people are, and the two never join.

    `body` is text and stays text. A comment is never HTML, so
    there is no sanitiser here to get wrong. */
export interface CommentRow {
  id: number;
  slug: string;
  section: Section;
  parent_id: number | null;
  author_id: string;
  author_name: string;
  body: string;
  status: CommentStatus;
  created_at: string;
  approved_at: string | null;
}

/** Confirmed opt-in only. `pending` is somebody who has asked and
    not clicked the link in their email, and nothing may send to
    that state. */
export interface SubscriberRow {
  email: string;
  /** Confirm and unsubscribe are the same link with a different
      path, and this is what makes both work without a login. */
  token: string;
  status: SubscriberStatus;
  lang: string;
  /** Which page they signed up from. */
  source: string;
  created_at: string;
  confirmed_at: string | null;
}

export interface EnquiryRow {
  id: number;
  name: string;
  email: string;
  kind: EnquiryKind;
  message: string;
  status: EnquiryStatus;
  notes: string;
  created_at: string;
}

/** A counter per path per day. No identity of any kind, which is
    the whole design of it. */
export interface ViewRow {
  path: string;
  day: string;
  count: number;
}

/** "This helped", and friends. */
export interface ReactionRow {
  slug: string;
  kind: string;
  count: number;
}

export interface SessionRow {
  token: string;
  label: string;
  created_at: string;
  expires_at: string;
}

export interface SettingRow {
  key: string;
  value: string;
}

/** The public write endpoints, slowed down without the table ever
    holding an IP address: the bucket is a salted hash of the
    caller and the salt rotates daily. */
export interface ThrottleRow {
  bucket: string;
  count: number;
  resets: string;
}

/** A school's ladder. `meta` is that school's own fields as JSON,
    round-tripped exactly, and `shared/schools.js` spreads it back
    out. What is deliberately NOT in it: anything that decides a
    URL or a layout. */
export interface SchoolStageRow {
  school: School;
  slug: string;
  position: number;
  title: string;
  status: SchoolStatus;
  meta: string;
  /** When the Studio last saved it. The three school tables are
      the only ones that carry this, because they are the only
      ones a person edits row by row from a page. */
  updated_at: string;
}

export interface SchoolSectionRow {
  school: School;
  stage: string;
  ident: string;
  position: number;
  title: string;
  meta: string;
  updated_at: string;
}

export interface SchoolLessonRow {
  school: School;
  stage: string;
  slug: string;
  section: string;
  position: number;
  title: string;
  minutes: number;
  status: SchoolStatus;
  meta: string;
  /** The prose. Empty for a lesson the ladder names and nobody
      has written yet, which is a real state and not a gap: the
      route draws a waiting page for it. */
  body: string;
  updated_at: string;
}

/** Every table, and one sentence on what it is for. */
export const TABLES: Record<string, string>;

/** Is this one of the values that column is allowed to hold? */
export function allowed(values: readonly string[], value: unknown): boolean;
