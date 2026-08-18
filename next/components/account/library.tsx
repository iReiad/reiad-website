"use client";

/* ============================================================
   account/library.tsx: the reading list and the notes.

   `public.library` is ONE ROW PER PERSON PER PAGE, with `saved`
   and `note` as two columns of it. They are two facts about one
   thing rather than two things, which is why one component draws
   both lists and why removing from one must not remove from the
   other: a trigger in the migration takes the row away once both
   have gone.

   `/saved.js` is read at run time, for the reason the note at the
   top of `account/prefs.tsx` gives once.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import type { LibraryRow } from "/saved.js";
import { Button, ButtonLink } from "../ui/button";
import { savedModule } from "./saved";
import { when } from "./when";

/** Both lists come out of one read, so they are one component
    rendered twice rather than two that each fetch the table. */
function useLibrary() {
  const [rows, setRows] = useState<LibraryRow[] | null>(null);

  const reload = useCallback(async () => {
    const m = await savedModule();
    setRows(await m.listLibrary());
  }, []);

  useEffect(() => {
    reload().catch(() => setRows([]));
    const again = () => { reload().catch(() => setRows([])); };
    document.addEventListener("account:refresh", again);
    return () => document.removeEventListener("account:refresh", again);
  }, [reload]);

  return { rows, reload };
}

function Row({ row, showNote, onDone, onError }: {
  row: LibraryRow;
  showNote: boolean;
  onDone: () => Promise<void>;
  onError?: (message: string) => void;
}) {
  const [busy, setBusy] = useState(false);

  const drop = async () => {
    if (showNote && !confirm(`Delete your note on "${row.title || "this page"}"?`)) return;
    setBusy(true);
    try {
      const m = await savedModule();
      /* Taking a note off a page that is also on the reading list
         must not take the page off the list, and the other way
         round. So one control clears one column and the trigger
         in the migration removes the row once both have gone. */
      if (showNote) {
        await m.keepPage({ url: row.url, title: row.title, kind: row.kind, note: "" });
      } else if (row.note) {
        await m.keepPage({ url: row.url, title: row.title, kind: row.kind, saved: false });
      } else {
        await m.removeLibraryRow(row.id);
      }
      await onDone();
    } catch (err) {
      onError?.((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <article className="kept-row">
      <div className="kept-body">
        <span className="kept-kind mono">{row.kind === "lesson" ? "Lesson" : "Piece"}</span>
        <h3><a href={row.url}>{row.title || row.url}</a></h3>
        {/* The note as the reader typed it, and never as HTML.
            Nothing on this site renders a note as markup and
            nothing should: it is the one field here whose author
            and whose reader are the same person, which is exactly
            the case where nobody would notice it being used
            against them. JSX escapes it, which is the same
            guarantee `textContent` gave. */}
        {showNote ? <p className="kept-note">{row.note}</p> : null}
        <p className="kept-when mono">{when(row.updated_at)}</p>
      </div>
      <div className="kept-actions">
        <ButtonLink kind="ghost" size="sm" href={row.url}>Open</ButtonLink>
        <Button kind="ghost" size="sm" disabled={busy} onClick={drop}>
          {showNote ? "Delete" : "Remove"}
        </Button>
      </div>
    </article>
  );
}

export function ReadingList({ onError }: { onError?: (message: string) => void }) {
  const { rows, reload } = useLibrary();
  if (rows === null) return null;

  const kept = rows.filter((r) => r.saved);
  if (kept.length === 0) {
    return (
      <p className="acct-empty">
        Nothing kept yet. On any piece or lesson there is a Save button under
        the title, and what you save lands here.
      </p>
    );
  }
  return (
    <>
      {kept.map((row) => (
        <Row key={row.id} row={row} showNote={false} onDone={reload} onError={onError} />
      ))}
    </>
  );
}

export function Notes({ onError }: { onError?: (message: string) => void }) {
  const { rows, reload } = useLibrary();
  if (rows === null) return null;

  const written = rows.filter((r) => r.note);
  if (written.length === 0) {
    return (
      <p className="acct-empty">
        Nothing written yet. Every piece and every lesson has an
        &quot;Add a note&quot; button under the title.
      </p>
    );
  }
  return (
    <>
      {written.map((row) => (
        <Row key={row.id} row={row} showNote onDone={reload} onError={onError} />
      ))}
    </>
  );
}
