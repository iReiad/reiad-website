/* ============================================================
   Sheets.tsx: Open, and Import from Notion.

   Two dialogs, both `<dialog>` opened with showModal(), so the
   browser gives the focus trap, the inert background and Escape
   for nothing.

   Open lists three things that are all "something you could be
   working on" and are three different kinds of thing: drafts held
   in this browser and
   rows in the database. The middle one matters most and is the one
   that was missing longest: the pieces written before the Studio
   existed are HTML in the repository, so Open could not see them
   and there was no way to change a word of one without editing the
   file by hand.
   ============================================================ */

import { useEffect, useRef, useState } from "react";
import { SectionLabel } from "../../../next/components/ui/label.tsx";
import { Chip } from "../bits.tsx";
import type { Article } from "../api.ts";
import { notionPages, type NotionRow } from "./notion.ts";
import type { Draft } from "./drafts.ts";

function Sheet({
  title, onClose, children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const node = ref.current;
    node?.showModal();
    return () => node?.close();
  }, []);

  return (
    <dialog className="sheet" ref={ref} onClose={onClose}>
      <div className="pane-bar">
        <span className="mono">{title}</span>
        <button className="icon-btn" type="button" aria-label="Close" onClick={onClose}>✕</button>
      </div>
      <div className="sheet-body">{children}</div>
    </dialog>
  );
}

/* ============================================================
   Open
   ============================================================ */

export function OpenSheet({
  drafts, articles, openDraftId, dynamic, loading,
  onClose, onDraft, onDeleteDraft, onArticle,
}: {
  drafts: Draft[];
  articles: Article[];
  openDraftId: string | null;
  dynamic: boolean;
  loading: boolean;
  onClose: () => void;
  onDraft: (draft: Draft) => void;
  onDeleteDraft: (draft: Draft) => void;
  onArticle: (slug: string) => void;
}) {
  return (
    <Sheet title="Open" onClose={onClose}>
      {loading ? <p className="muted mono">Loading…</p> : (
        <>
          <SectionLabel>Drafts on this device</SectionLabel>
          {drafts.length === 0 ? <p className="muted">No drafts yet.</p> : null}
          {drafts.map((draft) => {
            const title = draft.fields?.title?.trim() || "Untitled";
            return (
              <div className="admin-line" key={draft.id}>
                <span>{title}{draft.id === openDraftId ? " (open)" : ""}</span>
                <span className="mono muted">
                  {draft.savedAt ? new Date(draft.savedAt).toLocaleString() : ""}
                </span>
                <Chip onClick={() => onDraft(draft)}>Open</Chip>
                <Chip onClick={() => onDeleteDraft(draft)}>Delete</Chip>
              </div>
            );
          })}

          {/* The pieces still written as committed files were
              listed here, with an Edit that read the page back out
              of its own HTML. There have been none since Stage
              11.2: every piece is a row, and the last three files
              are in `archive/`. */}

          {dynamic ? (
            <>
              <SectionLabel>Published through the Studio</SectionLabel>
              {articles.length === 0
                ? <p className="muted">Nothing in the database yet.</p> : null}
              {articles.map((a) => (
                <div className="admin-line" key={a.slug}>
                  <span>{a.title}</span>
                  <span className="mono">{a.status}</span>
                  <Chip onClick={() => onArticle(a.slug)}>Edit</Chip>
                </div>
              ))}
            </>
          ) : null}
        </>
      )}
    </Sheet>
  );
}

/* ============================================================
   Notion

   Write in Notion, pull the page in here, publish from here. The
   conversion happens server-side; what arrives is already the
   small set of tags the site styles, with its photos pointed at
   the same-origin proxy so they survive long enough to be
   re-hosted.
   ============================================================ */

/** The 32 hex characters on the end of any Notion URL. */
export const notionIdFrom = (text: string): string | null => {
  const match = String(text).match(/([0-9a-f]{32})|([0-9a-f-]{36})/i);
  return match ? match[0] : null;
};

export function NotionSheet({
  onClose, onImport,
}: {
  onClose: () => void;
  onImport: (pageId: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [pages, setPages] = useState<NotionRow[] | null>(null);
  const [problem, setProblem] = useState("");

  useEffect(() => {
    let live = true;
    setPages(null);
    setProblem("");

    // A pasted URL is a page, not a search term.
    const pasted = notionIdFrom(query);
    if (pasted && query.includes("notion.")) { onImport(pasted); return; }

    const t = setTimeout(async () => {
      const res = await notionPages(query);
      if (!live) return;
      if (!res?.ok) {
        setProblem(res && !res.ok && res.message
          ? res.message
          : "Notion didn't answer. Check NOTION_TOKEN, and that the page is shared "
            + "with the integration.");
        setPages([]);
        return;
      }
      setPages(res.pages ?? []);
    }, 300);

    return () => { live = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  return (
    <Sheet title="Import from Notion" onClose={onClose}>
      <label className="notion-search">
        <span className="mono">Search your Notion pages, or paste a page URL</span>
        <input
          type="search" id="notion-q" spellCheck={false} autoFocus
          placeholder="Dhaka Stock Exchange"
          value={query}
          onChange={(e) => setQuery(e.target.value.trim())}
        />
      </label>

      <div id="notion-body">
        {pages === null ? <p className="muted mono">Asking Notion…</p>
          : problem ? <p className="muted">{problem}</p>
          : pages.length === 0 ? (
            <p className="muted">
              Nothing found. Remember a page is invisible to the integration
              until you add it under the page&apos;s Connections menu.
            </p>
          ) : pages.map((page) => (
            <div className="admin-line" key={page.id}>
              <span>{page.icon ? `${page.icon} ` : ""}{page.title}</span>
              <span className="mono muted">
                {page.edited ? new Date(page.edited).toLocaleDateString() : ""}
              </span>
              <Chip onClick={() => onImport(page.id)}>Import</Chip>
            </div>
          ))}
      </div>
    </Sheet>
  );
}
