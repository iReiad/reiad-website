"use client";

/* ============================================================
   keep.tsx: keep this page, and write in the margin of it.

   Two controls in one row, under the byline of a piece and under
   the meta line of a lesson. They are the same row on both
   because they are the same two questions, and a reader who
   learned them on an article should not have to find them again
   in a school.

   `archive/modules/keep.ts` was 220 lines that built this row with
   `document.createElement` and inserted it after `.byline`, which
   is the shape `components/scripts.tsx` is entirely about: a node
   a script adds to markup React has just adopted is a node React
   removes. It survived only because `SiteScripts` ran it from an
   effect.

   ---- it is an account feature and it says so by not being
        there ----

   Signed out, this renders nothing. Not a greyed-out button, not
   a "sign in to save" prompt: nothing. Every other part of this
   site works without an account and the ones that cannot are
   quiet about it rather than advertising. A reader who has never
   signed in has no idea this exists, which is the correct amount
   of nagging, and the moment they do sign in the row appears on
   the page they are already reading.

   ---- the page is the server's and the row is the browser's ----

   The rule `next/lib/progress.ts` states, one table along. WHICH
   page this is arrives as props: the address, the title and
   whether it is a piece or a lesson are three facts the route
   already holds, and the module was recovering all three by
   reading its own markup back out of the DOM. WHAT THE ACCOUNT
   SAYS about it is fetched here, with the reader's own token,
   because the server has no session and no business having one.

   That swap fixes something as well as tidying it. The module
   filed the row under `location.pathname`, and both routes answer
   at two addresses: `/insights/dse-basics` and
   `/insights/dse-basics.html` are one piece, `/money/terms/dsex`
   and `/money/terms/dsex.html` are one lesson. One page could
   therefore hold two rows, which is the one thing `public.library`
   is not allowed to do. The prop is the canonical `.html` address
   every link on this site already uses.

   ---- one row per page, two facts about it ----

   `saved` and `note` are columns of the same row, so both buttons
   write through `keepPage()` in `/saved.js` and both read the
   same state back. The alternative, two endpoints, is how a page
   ends up saved-but-note-lost when somebody taps both quickly.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";
import type { LibraryRow } from "/saved.js";
import { Button } from "./ui/button";
import { TextArea } from "./ui/field";
import { runtimeModule } from "./account/runtime";

/* Both modules are served by the other Worker at those addresses
   and are not files in this project. `runtime.ts` says why the
   specifier has to be a variable, and its Map is why declaring
   these beside `account/saved.tsx`'s costs nothing: one import
   per path per page, however many components ask. */
type AccountModule = typeof import("/account.js");
type SavedModule = typeof import("/saved.js");

const accountModule = () => runtimeModule<AccountModule>("/account.js");
const savedModule = () => runtimeModule<SavedModule>("/saved.js");

/* Drawn rather than fetched, for the reason every icon on this
   site is: an SVG in a file is a request, and these two are
   twenty characters each. */
const ICON = {
  keep: "M6 3h12a1 1 0 0 1 1 1v16l-7-4-7 4V4a1 1 0 0 1 1-1z",
  note: "M4 4h16v11H9l-5 4V4z",
} as const;

function Icon({ name }: { name: keyof typeof ICON }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"
         strokeLinejoin="round" aria-hidden="true">
      <path d={ICON[name]} />
    </svg>
  );
}

/** How long either line stays up before it empties again. */
const SAID_FOR = 2600;

/** Which reader this is, as far as this component needs to know.
    `undefined` is "the session module has not answered yet", which
    is NOT the same as signed out and must not draw the same. */
type Reader = string | null | undefined;

/** What this page is, as the library stores it. All three come
    from the route: see the note at the top. */
export interface KeepProps {
  /** The canonical address, which is what `url` in the row is and
      what the reading list links. */
  url: string;
  title: string;
  kind: LibraryRow["kind"];
}

/** A line that says one thing and then stops saying it. Announced
    rather than only shown, and empty until there is something to
    say, so it is not read out on load. */
function Said({ text }: { text: string }) {
  return <span className="keep-said" role="status">{text}</span>;
}

export function Keep({ url, title, kind }: KeepProps) {
  const [reader, setReader] = useState<Reader>(undefined);
  const [row, setRow] = useState<LibraryRow | null>(null);
  /* The account has answered about this page. Nothing is drawn
     before it does, because a Save button that says "Save" for a
     second and then flips to "Kept" is a button that has told the
     reader something false. */
  const [answered, setAnswered] = useState(false);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [said, setSaid] = useState("");
  const [noteSaid, setNoteSaid] = useState("");

  const panel = useRef<HTMLDivElement>(null);

  /* Who is signed in, and staying up to date with it. Signing in
     on the page you are reading should put the row there, and
     signing out should take it away, without a reload.

     Their ID rather than a yes or no, so that the row is re-read
     when the reader CHANGES as well as when they arrive: what the
     account says about this page is not a fact about the page.

     `current()` is synchronous and answers off the session the
     module already holds, but the MODULE is fetched, so the first
     answer arrives a tick late. `comments.tsx` has the same three
     lines for the same reason. */
  useEffect(() => {
    let alive = true;
    let account: AccountModule | null = null;

    const paint = () => { if (alive && account) setReader(account.current()?.id ?? null); };

    void accountModule().then((m) => {
      if (!alive) return;
      account = m;
      paint();
    }).catch(() => { if (alive) setReader(null); });

    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  /* What the account says about this page. */
  useEffect(() => {
    setAnswered(false);
    setRow(null);
    setDraft("");
    setOpen(false);
    if (!reader) return;

    let alive = true;
    void savedModule()
      .then((m) => m.libraryRow(url))
      .then((found) => {
        if (!alive) return;
        setRow(found);
        setDraft(found?.note ?? "");
        setAnswered(true);
      })
      .catch(() => {
        /* `/saved.js` itself did not load, which is the only
           failure that reaches here: a failed READ inside it
           answers with a fallback, deliberately, and an empty
           answer means a page nobody has kept. So this is two
           buttons that could not work at all, and the row stays
           away rather than being drawn dead: an unusable control
           is worse than none, because a reader presses it. */
      });
    return () => { alive = false; };
  }, [reader, url]);

  /* Focused when it opens, and from an effect rather than from
     the handler: the box does not exist to be focused until React
     has committed the render that unhides it. */
  useEffect(() => {
    if (open) panel.current?.querySelector("textarea")?.focus();
  }, [open]);

  /* Both lines clear themselves. An effect rather than a
     `setTimeout` inside the handler, so a second press restarts
     the clock instead of the first press wiping the second
     message. */
  useEffect(() => {
    if (!said) return;
    const t = setTimeout(() => setSaid(""), SAID_FOR);
    return () => clearTimeout(t);
  }, [said]);

  useEffect(() => {
    if (!noteSaid) return;
    const t = setTimeout(() => setNoteSaid(""), SAID_FOR);
    return () => clearTimeout(t);
  }, [noteSaid]);

  /** One write, whichever button asked for it. Only the column
      being changed is sent: a Save that also sent `note: ""` would
      erase what the reader wrote on their phone this morning. */
  const write = useCallback(async (
    patch: Partial<Pick<LibraryRow, "saved" | "note">>,
    tell: (text: string) => void,
    note: string,
  ): Promise<void> => {
    tell("");
    try {
      const m = await savedModule();
      const back = await m.keepPage({ url, title, kind, ...patch });
      /* The trigger in the migration deletes a row once both of
         its facts have gone, and it is an AFTER trigger, so what
         PostgREST returns is the row it WROTE and not the row
         that survived. Keeping that answer would leave this
         holding an id for a row that no longer exists. The flags
         come out of the patch, which is the half that is true. */
      setRow(patch.saved === false && !back?.note ? null : back);
      tell(note);
    } catch (err) {
      tell((err as Error).message || "That did not save.");
    }
  }, [url, title, kind]);

  /* Nothing at all until this browser has said who it is and the
     account has answered about this page. The server renders none
     of it, which is the whole of how a reader with no account
     finds out that this exists. */
  if (!reader || !answered) return null;

  const kept = Boolean(row?.saved);
  const has = Boolean(row?.note);

  const toggleKeep = () => {
    const next = !kept;
    void write({ saved: next }, setSaid,
      next ? "Kept. It is on your reading list." : "Taken off your list.");
  };

  const saveNote = () => {
    const text = draft.trim();
    /* Emptying the box is how a note is deleted, and it says so
       rather than silently keeping an empty one. */
    void write({ note: text }, setNoteSaid, text ? "Saved." : "Note removed.");
  };

  return (
    <>
      <div className="keep-bar">
        <button type="button" className="keep-btn" aria-pressed={kept}
                {...(kept ? { "data-on": "" } : {})} onClick={toggleKeep}>
          <Icon name="keep" />
          <span className="keep-word">{kept ? "Kept" : "Save"}</span>
        </button>

        <button type="button" className="keep-btn" aria-expanded={open}
                {...(has ? { "data-on": "" } : {})}
                onClick={() => setOpen((was) => !was)}>
          <Icon name="note" />
          <span className="keep-word">{has ? "Your note" : "Add a note"}</span>
        </button>

        <Said text={said} />
      </div>

      {/* A textarea rather than a contenteditable: this is a
          margin note, not writing, and `aab/editor.js` exists for
          the other thing. Nothing here is ever rendered as HTML,
          which is the same guarantee `account/library.tsx` makes
          where it lists them. */}
      <div className="keep-panel" hidden={!open} ref={panel}>
        {/* `min-h-[6lh]` is not decoration. `<TextArea>` carries
            `min-h-24`, and `tw` is a later cascade layer than
            `components`, so the utility beats the `min-height:
            6lh` that `.keep-note` has always had and the box
            arrives two lines shorter than it shipped. A port must
            not also be a redesign. */}
        <TextArea
          id="keep-note" hideLabel label="Your note on this page"
          className="keep-note min-h-[6lh]" rows={5} maxLength={20000}
          placeholder="For your eyes only. Nobody else can read this."
          value={draft} onChange={(e) => setDraft(e.target.value)}
        />
        <div className="keep-panel-actions">
          <Button kind="solid" size="sm" onClick={saveNote}>Save the note</Button>
          <Said text={noteSaid} />
        </div>
      </div>
    </>
  );
}
