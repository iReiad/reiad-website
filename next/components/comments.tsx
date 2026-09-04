"use client";

/* The thread under a piece. Three states, and the quiet one matters most:

     signed out    the thread, and a line saying what signing in would let
                   you do. Never a wall: an approved comment is public.
     signed in     the same, plus a box.
     just posted   a note saying it is waiting to be approved, because a
                   comment that vanishes on submit looks exactly like one
                   that failed.

   NOTHING HERE IS HTML. A body is text on the way in, text in the column
   and text on the way out; `{c.body}` in JSX is a text node by
   construction. The way to lose that is `dangerouslySetInnerHTML`.

   And it is allowed to not exist: every failure is swallowed, so a piece
   with a broken thread reads perfectly and has no thread. */

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { runtimeModule } from "./account/runtime";

    /* `/account.js` is served by the other Worker at that address and is
       not a file in this project. `next/tsconfig.json` maps the path to
       its declaration; `runtime.ts` says why the specifier has to be a
       variable at run time. */
type AccountModule = typeof import("/account.js");
const accountModule = () => runtimeModule<AccountModule>("/account.js");

    /** One comment as `/api/comments` answers it. `author_id` is
        deliberately absent: the endpoint does not send it and
        `scripts/comments.test.ts` fails if it starts. */
export interface Comment {
  id: number;
  author_name?: string | null;
  body: string;
  created_at?: string | null;
  replies?: Comment[];
}

/** What the endpoint answers, of the parts this reads. */
interface Reply {
  ok?: boolean;
  /** True when the writer's own comment skipped the queue, which
      only an admin's does. The thread can simply show it. */
  live?: boolean;
  reason?: string;
  comments?: Comment[];
}

const when = (iso: string | null | undefined): string => {
  const then = Date.parse(String(iso));
  if (!Number.isFinite(then)) return "";
  const days = Math.floor((Date.now() - then) / 86_400_000);
  if (days < 1) return "today";
  if (days === 1) return "yesterday";
  if (days < 30) return `${days} days ago`;
  return new Date(then).toLocaleDateString("en-GB",
    { day: "numeric", month: "short", year: "numeric" });
};

/** The initial in the little circle, which is all the avatar
    there is. */
const initial = (name: string | null | undefined): string =>
  (String(name ?? "").trim()[0] ?? "?").toUpperCase();

/** What the note under the box is saying, and how it reads. */
type Note = { text: string; state?: "ok" | "warn" } | null;

/* ============================================================
   One comment, and its replies one level down
   ============================================================ */

export function CommentCard({ comment, onReply }: {
  comment: Comment;
  onReply?: (c: Comment) => void;
}) {
  return (
    <li className="comment">
      <span className="comment-who">
        <span className="comment-mark">{initial(comment.author_name)}</span>
        <strong>{comment.author_name || "Reader"}</strong>
        <span className="mono comment-when">{when(comment.created_at)}</span>
      </span>
      {/* A text node, which is the whole of the rule at the top. */}
      <p className="comment-body">{comment.body}</p>
      {onReply ? (
        <button className="link-btn comment-reply" type="button"
                onClick={() => onReply(comment)}>
          Reply
        </button>
      ) : null}
      {comment.replies?.length ? (
        <ul className="comment-replies">
              {/* No `onReply` on a reply: the thread is one level deep and
                  the endpoint refuses a second with
                  `replies-are-one-level`. Not offering the button is how a
                  reader finds that out without being told. */}
          {comment.replies.map((r) => <CommentCard key={r.id} comment={r} />)}
        </ul>
      ) : null}
    </li>
  );
}

/* ============================================================
   The whole thread
   ============================================================ */

export function Comments({ slug, section = "insights" }: {
  slug: string;
  section?: string;
}) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [signedIn, setSignedIn] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [note, setNote] = useState<Note>(null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const box = useRef<HTMLTextAreaElement>(null);

  const draw = useCallback(async () => {
    try {
      const res = await fetch(`/api/comments?slug=${encodeURIComponent(slug)}`);
      const data = await res.json() as Reply;
      setComments(data?.comments ?? []);
    } catch {
          /* A thread that will not load is not an error worth shouting
             about on somebody's reading page. */
      setComments([]);
    } finally {
      setLoaded(true);
    }
  }, [slug]);

  useEffect(() => { void draw(); }, [draw]);

      /* Who is signed in, and staying up to date with it. `current()` is
         synchronous and answers off the session the module already holds,
         but the MODULE is fetched, so the first answer arrives a tick late
         and the box appears then. */
  useEffect(() => {
    let alive = true;
    let account: AccountModule | null = null;

    const paint = () => { if (alive && account) setSignedIn(Boolean(account.current())); };

    void accountModule().then((m) => {
      if (!alive) return;
      account = m;
      paint();
    }).catch(() => {});

    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  const cancelReply = useCallback(() => setReplyingTo(null), []);

  const startReply = useCallback((c: Comment) => {
    setReplyingTo(c);
    box.current?.focus();
  }, []);

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = text.trim();
    if (body.length < 2) {
      setNote({ text: "There is nothing to post yet.", state: "warn" });
      return;
    }

    setSending(true);
    try {
      const { token } = await accountModule();
      const access = await token();
      if (!access) {
        setNote({ text: "Your session has expired. Sign in again.", state: "warn" });
        return;
      }

      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
          slug, section, body,
          parent_id: replyingTo?.id ?? null,
        }),
      });
      const data = await res.json().catch(() => null) as Reply | null;

      if (data?.ok) {
        setText("");
        setReplyingTo(null);
            /* Said plainly, because a comment that disappears on submit
               looks exactly like one that failed to send. The site's own
               people skip the queue, so their words are already up. */
        if (data.live) {
          await draw();
          setNote({ text: "Posted.", state: "ok" });
        } else {
          setNote({
            text: "Thank you. It is waiting to be read, and will appear once it is approved.",
            state: "ok",
          });
        }
        return;
      }
      if (data?.reason === "sign-in-required" || data?.reason === "bad-token") {
        setNote({ text: "Your session has expired. Sign in again and it will work.",
                  state: "warn" });
        return;
      }
      if (data?.reason === "too-many") {
        setNote({ text: "That is a lot of comments in a short time. Try again shortly.",
                  state: "warn" });
        return;
      }
      setNote({ text: "That did not send. Try again in a moment.", state: "warn" });
    } catch {
      setNote({ text: "That did not send. Try again in a moment.", state: "warn" });
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <h2 className="comment-title">Comments</h2>

      <ul className="comment-list">
        {loaded && !comments.length ? (
          <li className="comment-empty muted">No comments yet.</li>
        ) : (
          comments.map((c) => <CommentCard key={c.id} comment={c} onReply={startReply} />)
        )}
      </ul>

          {/* Rendered rather than hidden, and only when nobody is signed
              in: the sign-in line and the form are two states of one
              thing. */}
      {!signedIn ? (
        <p className="comment-invite">
          <button className="link-btn" type="button"
                  onClick={() => document.querySelector<HTMLElement>(".account-btn")?.click()}>
            Sign in
          </button>
          {" to join in. Everything already here is readable without an account."}
        </p>
      ) : (
        <form className="comment-form" onSubmit={send}>
          {replyingTo ? (
            <p className="comment-replying">
              {`Replying to ${replyingTo.author_name || "Reader"}. `}
              <button className="link-btn" type="button" onClick={cancelReply}>Cancel</button>
            </p>
          ) : null}
          <textarea
            ref={box}
            className="comment-box"
            rows={3}
            maxLength={4000}
            placeholder="Say something useful."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="comment-actions">
            <Button kind="solid" type="submit" disabled={sending}>Post</Button>
            <span className="mono comment-rule">
              Every comment is read before it appears.
            </span>
          </div>
        </form>
      )}

      {note ? (
        <p className="signin-note comment-note" data-state={note.state}>{note.text}</p>
      ) : null}
    </>
  );
}
