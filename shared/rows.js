/* ============================================================
   rows.js: what a row of this database actually is.

   TRANSITION.md Stage 12, step 1: the types first, and only the
   types. Nothing moves here. Twenty-three handlers under
   `functions/` read and write these tables and every one of them
   re-derives the shape of a row from the SQL it happens to have
   written; `shared/look.js` describes an `Article` and only the
   Next.js route can see it. This is the one description, in the
   one directory the Worker, the browser and Next can all reach.

   ---- why a .js file when the content is types ----

   Because `shared/` is an npm package and an export has to
   resolve to something at runtime, and because there is a real
   runtime value worth keeping beside the descriptions: the set
   of values each status column is allowed to hold. Those are
   written as constants below and the types are derived FROM
   them, so a status added to one is added to the other by
   construction rather than by memory. `rows.d.ts` describes what
   this exports and every row it describes.

   ---- what this is not ----

   Not a validator and not an ORM. A row is whatever D1 returns;
   this says what that is supposed to look like so a handler
   returning the wrong shape is a type error rather than a page
   with an empty field on it. Validation is step 2 of the same
   stage and is a separate thing on purpose: one place that
   decides what a bad REQUEST looks like, which is not the same
   question as what a stored row looks like.
   ============================================================ */

/** The three mounts a piece of writing can live at. */
export const SECTIONS = ["insights", "cooking", "travel"];

/** Draft or live, and nothing else. The renderer, the sitemap,
    the feed and every hub filter on this, and a fourth value
    would be invisible to all four. */
export const ARTICLE_STATUS = ["draft", "live"];

/** A reader's question, through moderation.

    `pending` is where everything starts and it is the whole point
    of the table: nothing a stranger writes appears anywhere until
    somebody has read it. */
export const QUESTION_STATUS = ["pending", "published", "spam", "archived"];

/** A comment, through the same moderation.

    `live` rather than `approved`, and `binned` rather than
    `spam`, because that is what the column actually holds:
    `functions/api/comments/[[id]].js` writes those three and the
    thread query filters on `status = 'live'`. This file is a
    description of the database and not a proposal for a better
    one; renaming a state here and nowhere else would be a
    description that lies. */
export const COMMENT_STATUS = ["pending", "live", "binned"];

/** Confirmed opt-in, spelled out. `pending` is somebody who has
    asked and not yet clicked the link in their email, and it is
    NOT a state anything may send to. */
export const SUBSCRIBER_STATUS = ["pending", "confirmed", "unsubscribed"];

/** An enquiry, through the inbox. */
export const ENQUIRY_STATUS = ["new", "replied", "closed"];

/** What an enquiry is about, which decides where it is filed and
    nothing else. */
export const ENQUIRY_KIND = ["hiring", "project", "reader", "general"];

/** A lesson or a stage: written, or promised and not yet
    written. A ladder shows both and marks the difference. */
export const SCHOOL_STATUS = ["live", "soon"];

/** The four schools, in the order the site lists them.

    The same list `shared/schools.js` exports, and it is here as
    well because a row's `school` column is one of these and a
    description of the row should say so. `schools.test.mjs`
    fails if the two ever disagree. */
export const SCHOOLS = ["learn", "deutsch", "quran", "english"];

/** Every table this database has, and what it is for.

    Written down because `restore.mjs`, `backup.js` and
    `snapshot.mjs` each hold their own list of tables and the
    three have disagreed before: the schools' three tables were in
    the nightly R2 snapshot and in neither of the other two for a
    day. This does not fix that by itself, and it is what the fix
    will read. */
export const TABLES = {
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
export const allowed = (values, value) => values.includes(String(value));
