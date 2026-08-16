/* ============================================================
   History.tsx: the way back from a republish you regret.

   Publishing replaces an article in place. Every overwrite keeps
   the body it replaced, twenty deep, so there is somewhere to go
   back to. Restoring is itself an overwrite and is snapshotted
   too: going back never costs you the newer version, which is the
   sentence the confirm box says out loud because it is the reason
   anyone would dare press it.

   A real `<dialog>`, opened with showModal(), so the browser gives
   the focus trap, the inert background and Escape for nothing. The
   old desk kept one empty dialog in `desk.html` and filled it from
   script; here the dialog is the component, which means it cannot
   be opened with the wrong article's versions in it.
   ============================================================ */

import { useEffect, useRef } from "react";
import type { Article, Version } from "./api.ts";
import { listVersions, restoreVersion } from "./api.ts";
import { useRows } from "./useRows.ts";
import { toast } from "./site.ts";
import { Broken, Chip, Count, Empty, Loading } from "./bits.tsx";

export function History({
  article, onClose, onRestored,
}: {
  article: Article;
  onClose: () => void;
  onRestored: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  const { rows, loading, failed } = useRows<Version>(
    () => listVersions(article.slug),
    (reply) => (reply.versions as Version[]) ?? [],
    [article.slug]
  );

  /* Opened as a modal on mount rather than rendered with the
     `open` attribute. They are not the same thing: `open` gives a
     dialog with no backdrop, no focus trap and no Escape. */
  useEffect(() => {
    const node = ref.current;
    node?.showModal();
    return () => node?.close();
  }, []);

  const restore = async (v: Version) => {
    const ok = confirm(
      `Put this version of "${article.title}" back?\n\n`
      + "What is live now is kept in the history too, so this can be undone."
    );
    if (!ok) return;
    const res = await restoreVersion(article.slug, v.id);
    if (res?.ok) { toast("Restored"); onRestored(); onClose(); }
    else toast("That did not restore");
  };

  return (
    <dialog className="sheet" ref={ref} onClose={onClose} aria-labelledby="history-title">
      <div className="pane-bar">
        <span className="mono" id="history-title">History: {article.title}</span>
        <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>✕</button>
      </div>

      <div className="sheet-body">
        {loading ? <Loading /> : failed ? <Broken what="the history" /> : rows.length ? (
          <>
            <Count>
              {rows.length} earlier version{rows.length === 1 ? "" : "s"}, newest first
            </Count>
            <div className="admin-table">
              {rows.map((v) => (
                <div className="admin-line" key={v.id}>
                  <span>{v.title || "(untitled)"}</span>
                  <span className="mono muted">{new Date(v.saved_at).toLocaleString()}</span>
                  <span className="mono muted">{Math.round((v.size ?? 0) / 1024)} KB</span>
                  <Chip onClick={() => restore(v)}>Restore</Chip>
                </div>
              ))}
            </div>
          </>
        ) : (
          <Empty>
            Nothing yet. A version is kept each time this article is overwritten,
            so the first one appears the next time you republish it.
          </Empty>
        )}
      </div>
    </dialog>
  );
}
