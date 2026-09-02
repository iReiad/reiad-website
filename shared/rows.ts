/* ============================================================
   rows.ts: what a row of this database actually is.

   archive/TRANSITION.md Stage 12, step 1: the types first, and only
   the types. Nothing moves here. Twenty-three handlers under
   `functions/` read and write these tables and every one of them
   re-derives the shape of a row from the SQL it happens to have
   written; `shared/look.ts` describes an `Article` and only the
   Next.js route can see it. This is the one description, in the
   one directory the Worker, the browser and Next can all reach.

   ---- one file, where there were two ----

   This was a `rows.js` holding the runtime constants and a
   `rows.d.ts` holding every interface below, which is the shape
   TypeScript forces on a JavaScript module that wants types. It is
   TypeScript now, so the two halves are one file and the types are
   derived from the constants in the same place they are declared:
   a status added to `COMMENT_STATUS` is in `CommentStatus` by
   construction rather than by somebody remembering to edit a
   second file.

   ---- what this is not ----

   Not a validator and not an ORM. A row is whatever D1 returns;
   this says what that is supposed to look like so a handler
   returning the wrong shape is a type error rather than a page
   with an empty field on it. Validation is step 2 of the same
   stage and is a separate thing on purpose: one place that decides
   what a bad REQUEST looks like, which is not the same question as
   what a stored row looks like.

   `scripts/check-rows.ts` reads this file and fails if an
   interface stops naming the columns its table has, or if a
   handler keeps its own copy of one of the vocabularies below.
   ============================================================ */

/* ---------- the vocabularies ----------

   Each one is the set of values a column may hold, and the type
   under it is derived rather than typed twice. */

/** The three mounts a piece of writing can live at. */
export const SECTIONS = ["insights", "cooking", "travel"] as const;

/** Draft or live, and nothing else. The renderer, the sitemap,
    the feed and every hub filter on this, and a fourth value
    would be invisible to all four. */
export const ARTICLE_STATUS = ["draft", "live"] as const;

/** A reader's question, through moderation.

    `pending` is where everything starts and it is the whole point
    of the table: nothing a stranger writes appears anywhere until
    somebody has read it. */
export const QUESTION_STATUS = ["pending", "published", "spam", "archived"] as const;

/** A comment, through the same moderation.

    `live` rather than `approved`, and `binned` rather than
    `spam`, because that is what the column actually holds:
    `functions/api/comments/[[id]].ts` writes those three and the
    thread query filters on `status = 'live'`. This file is a
    description of the database and not a proposal for a better
    one; renaming a state here and nowhere else would be a
    description that lies. */
export const COMMENT_STATUS = ["pending", "live", "binned"] as const;

/** Confirmed opt-in, spelled out. `pending` is somebody who has
    asked and not yet clicked the link in their email, and it is
    NOT a state anything may send to. */
export const SUBSCRIBER_STATUS = ["pending", "confirmed", "unsubscribed"] as const;

/** An enquiry, through the inbox. */
export const ENQUIRY_STATUS = ["new", "replied", "closed"] as const;

/** What an enquiry is about, which decides where it is filed and
    nothing else. */
export const ENQUIRY_KIND = ["hiring", "project", "reader", "general"] as const;

/** A lesson or a stage: written, or promised and not yet
    written. A ladder shows both and marks the difference. */
export const SCHOOL_STATUS = ["live", "soon"] as const;

/** The four schools, in the order the site lists them.

    The same list `shared/schools.ts` exports, and it is here as
    well because a row's `school` column is one of these and a
    description of the row should say so. `schools.test.ts`
    fails if the two ever disagree. */
export const SCHOOLS = ["money", "deutsch", "quran", "english"] as const;

export type Section = (typeof SECTIONS)[number];
export type ArticleStatus = (typeof ARTICLE_STATUS)[number];
export type QuestionStatus = (typeof QUESTION_STATUS)[number];
export type CommentStatus = (typeof COMMENT_STATUS)[number];
export type SubscriberStatus = (typeof SUBSCRIBER_STATUS)[number];
export type EnquiryStatus = (typeof ENQUIRY_STATUS)[number];
export type EnquiryKind = (typeof ENQUIRY_KIND)[number];
export type SchoolStatus = (typeof SCHOOL_STATUS)[number];
export type School = (typeof SCHOOLS)[number];

/* ---------- the rows ---------- */

/** A piece of writing. The Studio writes it, the renderer reads
    it, and `shared/look.ts` has described it since Stage 10 for
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
  /** Sanitised HTML, by `functions/_lib/sanitise.ts` on the way
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
/** What the Research Studio's lookups cache: a DOI's record, a
    book, a search, keyed by the request and nothing about a
    reader, because a DOI's record is the same for everybody and
    a rate limit is a shared resource. `functions/_lib/scholar.ts`
    is the only writer. */
export interface ScholarCacheRow {
  key: string;
  json: string;
  fetched_at: string;
}

export interface ThrottleRow {
  bucket: string;
  count: number;
  resets: string;
}

/** A school's ladder. `meta` is that school's own fields as JSON,
    round-tripped exactly, and `shared/schools.ts` spreads it back
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
  /** The same lesson in English, empty where nobody has written
      one. `body` is the learning language and is what a reader
      with JavaScript off gets; this is the other half of the
      pair the stylesheet chooses between. */
  body_en: string;
  /** The lesson's interactive and drawn parts, as JSON: a map of
      mount id to block. Said once and shown in both languages,
      because a quiz whose options were written twice is a quiz
      that can disagree with itself. `shared/lesson.ts` is the
      shape and MONEY.md is why. */
  blocks: string;
  updated_at: string;
}

/* ---------- the tables ---------- */

/** Every table this database has, and what it is for.

    Written down because `restore.ts`, `backup.js` and
    `snapshot.mjs` each hold their own list of tables and the
    three have disagreed before: the schools' three tables were in
    the nightly R2 snapshot and in neither of the other two for a
    day. This does not fix that by itself, and it is what the fix
    will read. */
export const TABLES: Record<string, string> = {
  articles: "every piece of writing, draft and live",
  article_versions: "the body before the last overwrite, and the nineteen before that",
  questions: "reader questions, moderated",
  comments: "comments, moderated, with a Supabase author id attached",
  subscribers: "confirmed opt-in only",
  enquiries: "client enquiries",
  views: "a counter per path per day, with no identity of any kind",
  reactions: "this helped, and friends",
  sessions: "admin sessions",
  settings: "the admin password hash, among other things",
  throttle: "the public write endpoints, slowed down without holding an IP",
  scholar_cache: "what Crossref, OpenAlex and Open Library answered for one DOI, ISBN or address, kept so the Research Studio never asks twice for the same record",
  school_stages: "a school's ladder",
  school_sections: "a stage's sections",
  school_lessons: "a lesson, and its prose",
};

/** Is this one of the values that column is allowed to hold?

    A guard rather than a validator: it answers the question a
    handler asks before it writes, and it is the same question
    every one of them currently answers with its own inline array.

        if (!allowed(COMMENT_STATUS, status)) return bad("status");
 */
export const allowed = (values: readonly string[], value: unknown): boolean =>
  values.includes(String(value));
