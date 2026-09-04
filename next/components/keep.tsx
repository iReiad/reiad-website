"use client";

/* Keep this page, and write in the margin of it: two controls in one row,
   under the byline of a piece and the meta line of a lesson.

   SIGNED OUT, THIS RENDERS NOTHING. Not a greyed-out button, not a "sign
   in to save" prompt: the parts of this site that need an account are
   quiet about it rather than advertising.

   The page is the server's and the row is the browser's. WHICH page this
   is arrives as props, and the address prop is the canonical `.html` one:
   both routes answer at two addresses, so filing under
   `location.pathname` lets one page hold two rows, which is the one thing
   `public.library` may not do. WHAT THE ACCOUNT SAYS is fetched here with
   the reader's own token.

   `saved` and `note` are columns of the same row, so both buttons write
   through `keepPage()` and read the same state back: two endpoints is how
   a page ends up saved-but-note-lost when somebody taps both quickly. */

import { useCallback, useEffect, useRef, useState } from "react";
import type { LibraryRow } from "/saved.js";
import { Button } from "./ui/button";
import { TextArea } from "./ui/field";
import { runtimeModule } from "./account/runtime";

    /* Both modules are served by the other Worker at those addresses and
       are not files in this project. `runtime.ts` says why the specifier
       has to be a variable, and its Map is why declaring these costs
       nothing: one import per path per page. */
type AccountModule = typeof import("/account.js");
type SavedModule = typeof import("/saved.js");

const accountModule = () => runtimeModule<AccountModule>("/account.js");
const savedModule = () => runtimeModule<SavedModule>("/saved.js");

    /* Drawn rather than fetched, for the reason every icon here is: an SVG
       in a file is a request, and these two are twenty characters. */
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
        `undefined` is "the session module has not answered yet", which is
        NOT the same as signed out and must not draw the same. */
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
        rather than only shown, and empty until there is something to say,
        so it is not read out on load. */
function Said({ text }: { text: string }) {
  return <span className="keep-said" role="status">{text}</span>;
}

export function Keep({ url, title, kind }: KeepProps) {
  const [reader, setReader] = useState<Reader>(undefined);
  const [row, setRow] = useState<LibraryRow | null>(null);
      /* The account has answered about this page. Nothing is drawn before
         it does, because a Save button that says "Save" for a second and
         then flips to "Kept" has told the reader something false. */
  const [answered, setAnswered] = useState(false);

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [said, setSaid] = useState("");
  const [noteSaid, setNoteSaid] = useState("");

  const panel = useRef<HTMLDivElement>(null);

      /* Who is signed in, and staying up to date with it: signing in on
         the page you are reading should put the row there without a
         reload. Their ID rather than a yes or no, so the row is re-read
         when the reader CHANGES as well as when they arrive.

         `current()` is synchronous and answers off the session the module
         already holds, but the MODULE is fetched, so the first answer
         arrives a tick late. */
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
            /* `/saved.js` itself did not load, which is the only failure
               that reaches here: a failed READ inside it answers with a
               fallback, and an empty answer means a page nobody has kept.
               So the row stays away rather than being drawn dead: an
               unusable control is worse than none. */
      });
    return () => { alive = false; };
  }, [reader, url]);

      /* Focused when it opens, and from an effect rather than the handler:
         the box does not exist to be focused until React has committed the
         render that unhides it. */
  useEffect(() => {
    if (open) panel.current?.querySelector("textarea")?.focus();
  }, [open]);

      /* Both lines clear themselves. An effect rather than a `setTimeout`
         inside the handler, so a second press restarts the clock instead
         of the first press wiping the second message. */
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

      /** One write, whichever button asked for it. Only the column being
          changed is sent: a Save that also sent `note: ""` would erase
          what the reader wrote on their phone this morning. */
  const write = useCallback(async (
    patch: Partial<Pick<LibraryRow, "saved" | "note">>,
    tell: (text: string) => void,
    note: string,
  ): Promise<void> => {
    tell("");
    try {
      const m = await savedModule();
      const back = await m.keepPage({ url, title, kind, ...patch });
          /* The trigger in the migration deletes a row once both facts
             have gone, and it is an AFTER trigger, so PostgREST returns
             the row it WROTE rather than the row that survived. Keeping
             that answer would leave this holding an id for a row that no
             longer exists. */
      setRow(patch.saved === false && !back?.note ? null : back);
      tell(note);
    } catch (err) {
      tell((err as Error).message || "That did not save.");
    }
  }, [url, title, kind]);

      /* Nothing at all until this browser has said who it is and the
         account has answered about this page. The server renders none of
         it, which is how a reader with no account never finds out. */
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

          {/* A textarea rather than a contenteditable: this is a margin
              note, not writing. Nothing here is ever rendered as HTML,
              which is the same guarantee `account/library.tsx` makes. */}
      <div className="keep-panel" hidden={!open} ref={panel}>
            {/* `min-h-[6lh]` is not decoration: `<TextArea>` carries
                `min-h-24`, and `tw` is a later cascade layer than
                `components`, so the utility beats the `min-height: 6lh`
                `.keep-note` has always had and the box arrives two lines
                shorter. */}
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
