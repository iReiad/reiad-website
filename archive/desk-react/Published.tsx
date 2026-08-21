/* ============================================================
   Published.tsx: everything that is live, and what is wrong with
   it.

   ---- what this panel is a list OF ----

   Not the database. Most of what is published on this site is not
   in the database: the case studies, the older insights, the piece
   about onions and the one about visas are committed files,
   written before the Studio or written straight into the
   repository. A panel called Published that listed only rows
   showed, on the day the database happened to hold two of them, a
   site with two articles on it.

   So it is the rows plus everything `content.js` says is live that
   the rows have not taken over. That is the same manifest the
   menu, the palette and the sitemap read, which makes this list
   the site rather than a copy of part of it. A file piece cannot
   be published, moved or deleted from here, because there is no
   row to change: it can be opened in the Studio, and publishing it
   from there takes over its URL and gives it every other action.
   That is Stage 3 of archive/TRANSITION.md, one piece at a time.

   ---- and the thing it flags ----

   A piece whose photo never reached R2 has no share card at all,
   and every link to it pastes as the site's default picture. That
   is `pill-warn`, and Draw card fixes it in place without making
   anyone reopen the piece in the editor.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import type { Article } from "./api.ts";
import {
  listArticles, readArticle, patchArticle, deleteArticle,
} from "./api.ts";
import { useRows } from "./useRows.ts";
/* The colour a section owns, from the one table the rail, the
   footer and every route already read. `styles.css` kept its own
   copy of two of them and both were wrong: cooking was gold where
   the rail says rose, and travel was plain ink where the rail says
   plum. A second copy of a mapping does not stay right, it stays
   whatever it was on the day it was typed. */
import { accentStyle } from "../../next/lib/nav.ts";
import { History } from "./History.tsx";
import {
  SECTIONS, findSection, pieceUrl, isDrawnCard, coverFromHTML,
  shareCardBlob, cardSlug, hostPhotosIn, isHosted, uploadMedia, toast, copyText,
} from "./site.ts";
import {
  Broken, Chip, ChipLink, Count, Empty, Filters, Loading, Pill, SearchBox, when,
} from "./bits.tsx";

/* A piece, and there is only one kind of one now.

   This carried a `file: true` variant until Stage 11.2, for the
   pieces that were committed HTML with an entry in `content.js`,
   and every action in this panel branched on it. There are none:
   every piece is a row, the last three files went to `archive/`,
   and the arrays this read them out of are empty. A panel that
   still offered to import them would be offering a door to a room
   that is not there. */
type Piece = Article;

const SECTION_FILTERS: [string, string][] = [
  ["all", "Everywhere"],
  ...SECTIONS.map((sec) => [sec.id, sec.id === "insights" ? sec.en : sec.bn] as [string, string]),
];

/** Newest first. */
const byDate = (a: Piece, b: Piece) =>
  String(b.updated_at ?? "").localeCompare(String(a.updated_at ?? ""));

/** What a pasted link will show, when that is worth saying.

    Nothing for the two good cases: a card the Studio drew (a
    JPEG), or no cover at all, which falls back to the section's
    own card. A raw photo is worth flagging, because every photo on
    this site is a WebP and the scrapers behind WhatsApp, Facebook
    and LinkedIn will not read one.

    A photo still embedded in the body is the worse of the two and
    is checked first: it means the piece has a picture, no card at
    all, and nothing of it in R2. `embedded` is computed by the
    API. */
function coverWarning(a: Piece): string | null {
  if (a.embedded) return "photo not hosted";
  if (a.cover && !isDrawnCard(a.cover)) return "photo, not a card";
  return null;
}

const WARN_WHY: Record<string, string> = {
  "photo not hosted":
    "Its photo is still inside the article body rather than in R2, so it has no "
    + "social card at all and shares as the site default. Draw card moves the photo "
    + "out and draws one.",
  "photo, not a card":
    "Its social card is the photo itself, in a format WhatsApp, Facebook and "
    + "LinkedIn will not read. Draw card fixes it.",
};

/* ============================================================
   Draw the missing card, here, without opening the editor.

   The piece is already published and its photos are already on
   /media: everything the card needs is a fetch away, so making
   someone reopen the piece and publish it again to fix a picture
   would be busywork with a chance of changing something else.
   ============================================================ */

async function drawCard(article: Piece, onDone: () => void) {
  const full = await readArticle(article.slug);
  let body = full?.ok ? full.article?.body ?? "" : "";
  let pick = coverFromHTML(body);

  if (!pick.own) {
    toast("No photo in that piece, so the section's card is the right one.");
    return;
  }

  /* The photo may still be sitting in the body as a data: URL,
     because for a while every attempt to move one out to R2 was
     blocked by connect-src before it left the browser. See the
     note at the top of photo.js. Those pieces are repaired here
     rather than by making somebody reopen each one in the editor
     and publish it again. */
  let rehosted = 0;
  if (!isHosted(pick.src)) {
    toast("Moving the photos to /media first…");
    const hosted = await hostPhotosIn(body, article.slug, uploadMedia);
    if (!hosted.uploaded) {
      toast("Those photos would not upload, so the card cannot be drawn yet.");
      return;
    }
    body = hosted.html;
    rehosted = hosted.uploaded;
    pick = coverFromHTML(body);
    if (!isHosted(pick.src)) { toast("Still no hosted photo to draw from."); return; }
  }

  toast("Drawing the card…");
  try {
    const stored = await uploadMedia(await shareCardBlob(pick), cardSlug(article.slug));
    if (!stored?.url) throw new Error("upload-failed");

    /* The body goes back only when it actually changed. A PATCH
       that rewrites a body it did not touch is a version snapshot
       nobody asked for. */
    const res = await patchArticle(article.slug,
      rehosted ? { cover: stored.url, body } : { cover: stored.url });
    if (!res?.ok) throw new Error("save-failed");

    toast(rehosted
      ? `${rehosted} photo${rehosted === 1 ? "" : "s"} moved to /media, card drawn.`
      : `Card drawn from the ${pick.lead ? "lead" : "first"} photo.`);
    onDone();
  } catch (err) {
    console.warn("share card failed", err);
    toast("Could not draw the card.");
  }
}

/* ============================================================
   Move a piece to another section.

   The one control on this page that changes a URL. The server
   refuses to serve a piece at a mount that is not its own, so the
   move is complete the moment it saves: the old address stops
   answering and the new one starts. That is why it asks first when
   the piece is live, and does not when it is a draft.
   ============================================================ */

function MoveControl({ article, onDone }: { article: Piece; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const from = findSection(article.section);

  const change = async (id: string) => {
    const to = findSection(id);
    if (to.id === from.id) return;

    if (article.status === "live") {
      const ok = confirm(
        `Move "${article.title}" from ${from.en} to ${to.en}?\n\n`
        + `It is live, so its address changes from ${pieceUrl(from, article.slug)} `
        + `to ${pieceUrl(to, article.slug)}. Any link already shared will stop working.`
      );
      if (!ok) return;
    }

    setBusy(true);
    const res = await patchArticle(article.slug, { section: to.id });
    setBusy(false);

    if (res?.ok) { toast(`Moved to ${to.en}: ${pieceUrl(to, article.slug)}`); onDone(); }
    else toast("That did not move.");
  };

  return (
    <label className="move-field">
      <span className="mono">Move to</span>
      <select
        className="move-select"
        value={from.id}
        disabled={busy}
        onChange={(e) => change(e.target.value)}
      >
        {SECTIONS.map((sec) => (
          <option key={sec.id} value={sec.id}>
            {sec.id === "insights" ? sec.en : `${sec.bn} · ${sec.en}`}
          </option>
        ))}
      </select>
    </label>
  );
}

/* ============================================================
   One piece, as a row

   Two actions are in the open, because they are the two anyone
   actually wants: edit it, and open it. The other six sit behind
   More, which is a `<details>`, which means a real disclosure with
   real keyboard behaviour. On a phone the row was three wrapped
   lines of buttons per article and the list stopped being readable
   somewhere around the fourth piece.
   ============================================================ */

function Row({
  a, open, onOpen, onDone, onHistory,
}: {
  a: Piece;
  open: boolean;
  onOpen: (slug: string | null) => void;
  onDone: () => void;
  onHistory: (a: Piece) => void;
}) {
  const sec = findSection(a.section);
  const url = pieceUrl(sec, a.slug);
  const warn = coverWarning(a);

  const remove = async () => {
    if (!confirm(`Delete "${a.title}" from the database? This cannot be undone.`)) return;
    const res = await deleteArticle(a.slug);
    if (res?.ok) { toast("Deleted"); onDone(); } else toast("That did not delete");
  };

  const togglePublished = async () => {
    const res = await patchArticle(a.slug, { status: a.status === "live" ? "draft" : "live" });
    if (res?.ok) { toast(a.status === "live" ? "Unpublished" : "Published"); onDone(); }
    else toast("That did not save");
  };

  return (
    <div className={`admin-line article-line status-${a.status}`}>
      <a className="article-title" href={url}>{a.title}</a>

      <span className="line-facts">
        <span className={`pill section-pill section-${sec.id}`}
          style={accentStyle(sec.id)}>
          {sec.id === "insights" ? sec.en : sec.bn}
        </span>
        <Pill>{a.status}</Pill>
        {warn ? <Pill tone="warn" title={WARN_WHY[warn]}>{warn}</Pill> : null}
        {a.topics?.length ? (
          <span className="line-topics">
            {a.topics.slice(0, 3).map((t) => (
              <span className="topic-tag mono" key={t}>{t}</span>
            ))}
          </span>
        ) : null}
        <span className="mono muted">{when(a.updated_at)}</span>
      </span>

      <span className="line-actions">
        <ChipLink href={`/studio/index.html?edit=${encodeURIComponent(a.slug)}`}>
          Edit
        </ChipLink>
        <ChipLink href={url} target="_blank" rel="noopener">View</ChipLink>

        {/* One open at a time, so the panel below never opens under
            another. The old desk did this by walking the DOM on
            every toggle; here the panel remembers which slug is
            open, which is the same rule stated once.

            The `else if (open)` is not defensive noise. Opening a
            second row closes the first, which fires the first
            row's own toggle event a moment later, and a naive
            handler answers that by clearing the slug that was just
            set: both panels end up shut and the row you clicked
            never opened. Only the row that believes it is the open
            one is allowed to say it is closing. */}
        <details
          className="more-menu"
          open={open}
          onToggle={(e) => {
            if ((e.currentTarget as HTMLDetailsElement).open) onOpen(a.slug);
            else if (open) onOpen(null);
          }}
        >
          <summary className="chip">More</summary>
          <div className="more-body">
            <Chip onClick={togglePublished}>
              {a.status === "live" ? "Unpublish" : "Publish"}
            </Chip>
            <Chip onClick={() => onHistory(a)}>History</Chip>
            {warn ? <Chip onClick={() => drawCard(a, onDone)}>Draw card</Chip> : null}
            <Chip onClick={() => copyText(`${location.origin}${url}`, "Link copied")}>
              Copy link
            </Chip>
            <Chip onClick={remove}>Delete</Chip>
            <MoveControl article={a} onDone={onDone} />
          </div>
        </details>
      </span>
    </div>
  );
}

/* ============================================================
   The panel
   ============================================================ */

export function Published() {
  const [section, setSection] = useState("all");
  const [q, setQ] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [history, setHistory] = useState<Piece | null>(null);

  const { rows: stored, loading, failed, reload } = useRows<Article>(
    listArticles,
    (reply) => (reply.articles as Article[]) ?? [],
    []
  );

  /* An open More panel is a menu: it floats over the rows below
     it, so it has to close the way a menu closes. A `<details>`
     gives the keyboard behaviour and the disclosure semantics for
     nothing but does neither of these, and the old desk did
     neither either: the panel stayed open over the next three rows
     until you found its summary again, and the first click on the
     row underneath was swallowed by the panel covering it. */
  useEffect(() => {
    if (!openMenu) return;
    const outside = (e: PointerEvent) => {
      if (!(e.target as Element)?.closest?.("details.more-menu")) setOpenMenu(null);
    };
    const escape = (e: KeyboardEvent) => { if (e.key === "Escape") setOpenMenu(null); };
    addEventListener("pointerdown", outside);
    addEventListener("keydown", escape);
    return () => {
      removeEventListener("pointerdown", outside);
      removeEventListener("keydown", escape);
    };
  }, [openMenu]);

  const all = useMemo(() => [...stored as Piece[]].sort(byDate), [stored]);

  /* How many are in each section, so the filter says what is
     behind it rather than making you click to find out. */
  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: all.length };
    for (const a of all) {
      const id = findSection(a.section).id;
      tally[id] = (tally[id] ?? 0) + 1;
    }
    return tally;
  }, [all]);

  const shown = useMemo(() => {
    const needle = q.toLowerCase();
    return all
      .filter((a) => section === "all" || findSection(a.section).id === section)
      .filter((a) => !needle
        || `${a.title} ${a.slug} ${a.tag} ${(a.topics ?? []).join(" ")}`
            .toLowerCase().includes(needle));
  }, [all, section, q]);

  if (loading) return <Loading />;
  if (failed) return <Broken what="the published list" />;

  const needsCard = all.filter((a) => coverWarning(a)).length;

  return (
    <>
      <Filters options={SECTION_FILTERS} active={section} counts={counts} onPick={setSection} />
      <SearchBox id="search-published"
                 placeholder="Search titles, file names and topics" onSearch={setQ} />

      {/* Counted, never remembered. It used to end with "2 still
          to import", which was the number of pieces still written
          as files; there have been none since Stage 11.2 and there
          cannot be any again. */}
      <Count>
        {`${shown.length}${shown.length === all.length ? "" : ` of ${all.length}`} `}
        {`piece${all.length === 1 ? "" : "s"}`}
        {needsCard ? ` · ${needsCard} share card${needsCard === 1 ? "" : "s"} to draw` : ""}
      </Count>

      {shown.length === 0 ? (
        <Empty>{q ? "Nothing matches that." : "Nothing published in that section yet."}</Empty>
      ) : (
        <div className="admin-table">
          {shown.map((a) => (
            <Row
              key={`${a.section}/${a.slug}`}
              a={a}
              open={openMenu === a.slug}
              onOpen={setOpenMenu}
              onDone={reload}
              onHistory={setHistory}
            />
          ))}
        </div>
      )}

      {history ? (
        <History
          article={history}
          onClose={() => setHistory(null)}
          onRestored={reload}
        />
      ) : null}
    </>
  );
}
