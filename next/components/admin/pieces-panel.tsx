"use client";

/* ============================================================
   Published: everything in the database, and what is wrong with it.

   ADMIN.md §3 B 2, ported out of `archive/desk-react/Published.tsx`. A port
   is finished when it does what the thing it replaced did, not
   when it renders, so every action the desk had is here: publish
   and unpublish, move between sections, copy the link, delete,
   the version history, and Draw card.

   ---- the thing it flags ----

   A piece whose photo never reached R2 has no share card at all,
   and every link to it pastes as the site's default picture. That
   is the warning pill, and Draw card fixes it in place without
   making anybody reopen the piece in the editor.

   ---- why four modules are loaded at run time ----

   `/app.js`, `/api.js`, `/share-card.js` and `/photo.js` are
   served by the OTHER Worker at those addresses. They are not
   files in this project and nothing here can resolve them at build
   time, which is what `runtimeModule` is for. Every call to one is
   inside an event handler, so the server render reaches none of
   them: drawing a card needs a canvas, and the server has none.
   ============================================================ */

import { useCallback, useEffect, useMemo, useState } from "react";
import { SECTIONS, findSection, pieceUrl } from "@reiad/shared/content";
import type { ArticleStatus, Section as SectionId } from "@reiad/shared/rows";
import { accentStyle } from "@reiad/shared/nav";
import { artOf } from "../../lib/art";
import { adminCall, isLocked } from "../../lib/admin-api";
import { runtimeModule } from "../account/runtime";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";
import { Field, Select } from "../ui/field";

type AppModule = typeof import("/app.js");
type ApiModule = typeof import("/api.js");
type CardModule = typeof import("/share-card.js");
type PhotoModule = typeof import("/photo.js");

/** What `/api/articles?all=1` answers per row: `PUBLIC_COLUMNS` in
    the handler, with `topics` split into a list on the way out. */
interface Piece {
  slug: string;
  title: string;
  dek: string;
  tag: string;
  topics: string[];
  lang: string;
  minutes: number;
  status: ArticleStatus;
  section: SectionId;
  cover: string;
  published_at: string | null;
  updated_at: string;
  /** Computed by the endpoint, never stored: the body still holds
      a photo as a `data:` URL rather than a `/media` path. */
  embedded: number;
}

interface Version {
  id: number;
  title: string;
  dek: string;
  tag: string;
  lang: string;
  cover: string;
  saved_at: string;
  size: number;
}

const toast = async (message: string): Promise<void> => {
  const app = await runtimeModule<AppModule>("/app.js");
  app.toast(message);
};

/** What a pasted link will show, when that is worth saying.

    Nothing for the two good cases: a card the Studio drew, or no
    cover at all, which falls back to the section's standing card.
    A raw photo is worth flagging, because every photo here is a
    WebP and the scrapers behind WhatsApp, Facebook and LinkedIn
    will not read one. */
const WARN_WHY: Record<string, string> = {
  "photo not hosted":
    "Its photo is still inside the article body rather than in R2, so it has no "
    + "social card at all and shares as the site default. Draw card moves the photo "
    + "out and draws one.",
  "photo, not a card":
    "Its social card is the photo itself, in a format WhatsApp, Facebook and "
    + "LinkedIn will not read. Draw card fixes it.",
};

/* `isDrawnCard` lives in `/share-card.js` and this list must not
   ask for it: a warning is computed for every row on every render
   and loading a module for that would be a fetch per paint. The
   card slug is a fact about where uploadMedia puts one, and it is
   the same fact in both places. */
const isDrawnCard = (cover: string): boolean => /\/media\/card-/.test(cover);

const coverWarning = (a: Piece): string | null => {
  if (a.embedded) return "photo not hosted";
  if (a.cover && !isDrawnCard(a.cover)) return "photo, not a card";
  return null;
};

const day = (iso: string | null): string => (iso ?? "").slice(0, 10);

/* ============================================================
   Draw the missing card, without opening the editor.

   The piece is published and its photos are on /media already, so
   everything the card needs is a fetch away. Making somebody
   reopen the piece and publish it again to fix a picture would be
   busywork with a chance of changing something else.
   ============================================================ */

async function drawCard(article: Piece, onDone: () => void): Promise<void> {
  const [card, photo, api] = await Promise.all([
    runtimeModule<CardModule>("/share-card.js"),
    runtimeModule<PhotoModule>("/photo.js"),
    runtimeModule<ApiModule>("/api.js"),
  ]);

  const full = await adminCall<{ article?: { body?: string } }>(
    `articles/${encodeURIComponent(article.slug)}`);
  let body = full.data?.article?.body ?? "";
  let pick = card.coverFromHTML(body);

  /* WHICH OF THE TWELVE THIS PIECE WEARS, and the wall behind it.

     `artOf` is the same call every hub on this site makes for the
     same row, so a piece's card and the card it wears on the
     board are the same picture. The drawings themselves are
     fetched once per page by `drawingFor`, because a desk drawing
     forty of these in a row should ask for 34 KB of SVG once. */
  const chosen = artOf({
    id: article.slug, section: article.section, title: article.title,
    tags: [article.tag],
  });
  const drawing = await card.drawingFor(chosen.subject);

  /* NO PHOTO IS NO LONGER A REASON NOT TO DRAW ONE. The card is
     the site's own material with the piece's title on it, and a
     photograph is what it stands on where there is one. It was a
     crop of a photograph and nothing else, which is why an
     unillustrated piece used to fall back to the section's
     standing card. */
  if (!pick.own) {
    await toast("No photo in that piece, so the card is drawn without one…");
    try {
      const stored = await api.uploadMedia(
        await card.shareCardBlob({ src: "", focus: "centre" }, {
          title: article.title, kicker: article.tag, section: article.section,
        }, drawing),
        card.cardSlug(article.slug));
      if (!stored?.url) throw new Error("upload-failed");
      await adminCall(`articles/${encodeURIComponent(article.slug)}`, {
        method: "PATCH", body: { cover: stored.url },
      });
      await toast("Card drawn.");
      onDone();
    } catch {
      await toast("That card would not draw.");
    }
    return;
  }

  /* The photo may still be sitting in the body as a data: URL,
     because for a while every attempt to move one out to R2 was
     blocked by connect-src before it left the browser. Those
     pieces are repaired here rather than one at a time in the
     editor. See the head of aab/photo.js. */
  let rehosted = 0;
  if (!photo.isHosted(pick.src)) {
    await toast("Moving the photos to /media first…");
    const hosted = await photo.hostPhotosIn(body, article.slug, api.uploadMedia);
    if (!hosted.uploaded) {
      await toast("Those photos would not upload, so the card cannot be drawn yet.");
      return;
    }
    body = hosted.html;
    rehosted = hosted.uploaded;
    pick = card.coverFromHTML(body);
    if (!photo.isHosted(pick.src)) {
      await toast("Still no hosted photo to draw from.");
      return;
    }
  }

  await toast("Drawing the card…");
  try {
    const stored = await api.uploadMedia(
      await card.shareCardBlob(pick, {
        title: article.title, kicker: article.tag, section: article.section,
      }, drawing),
      card.cardSlug(article.slug));
    if (!stored?.url) throw new Error("upload-failed");

    /* The body goes back only when it actually changed. A PATCH
       that rewrites a body it did not touch is a version snapshot
       nobody asked for. */
    const res = await adminCall(`articles/${encodeURIComponent(article.slug)}`, {
      method: "PATCH",
      body: rehosted ? { cover: stored.url, body } : { cover: stored.url },
    });
    if (!res.ok) throw new Error("save-failed");

    await toast(rehosted
      ? `${rehosted} photo${rehosted === 1 ? "" : "s"} moved to /media, card drawn.`
      : `Card drawn from the ${pick.lead ? "lead" : "first"} photo.`);
    onDone();
  } catch {
    await toast("Could not draw the card.");
  }
}

/* ============================================================
   The version history, as a real dialog.

   Publishing replaces an article in place and keeps twenty bodies
   behind it. Restoring is itself an overwrite and is snapshotted
   too, which is the sentence the confirm box says out loud,
   because it is the reason anybody would dare press it.

   `showModal()` rather than the `open` attribute: they are not the
   same thing, and `open` gives a dialog with no backdrop, no focus
   trap and no Escape.
   ============================================================ */

function History(
  { article, onClose, onRestored }:
  { article: Piece; onClose: () => void; onRestored: () => void },
) {
  const [versions, setVersions] = useState<Version[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [node, setNode] = useState<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!node) return;
    node.showModal();
    return () => node.close();
  }, [node]);

  useEffect(() => {
    let live = true;
    void (async () => {
      const r = await adminCall<{ versions?: Version[] }>(
        `articles/${encodeURIComponent(article.slug)}/versions`);
      if (!live) return;
      if (!r.ok) { setFailed(true); return; }
      setVersions(r.data?.versions ?? []);
    })();
    return () => { live = false; };
  }, [article.slug]);

  const restore = async (v: Version): Promise<void> => {
    const sure = window.confirm(
      `Put this version of "${article.title}" back?\n\n`
      + "What is live now is kept in the history too, so this can be undone.");
    if (!sure) return;
    const r = await adminCall(`articles/${encodeURIComponent(article.slug)}/versions`,
      { method: "POST", body: { id: v.id } });
    await toast(r.ok ? "Restored" : "That did not restore");
    if (r.ok) { onRestored(); onClose(); }
  };

  return (
    <dialog ref={setNode} onClose={onClose}
            className="ad-panel max-w-[min(46rem,92vw)] p-5">
      <h3>History of {article.title}</h3>
      {failed ? <p className="ad-quiet">That did not load.</p> : null}
      {versions === null && !failed
        ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {versions?.length === 0
        ? <p className="ad-quiet">No earlier body. This piece has been published once.</p>
        : null}
      {versions?.length ? (
        <ul className="m-0 grid list-none gap-2 p-0">
          {versions.map((v) => (
            <li key={v.id}
                className="flex flex-wrap items-baseline justify-between gap-2
                           rounded-[var(--radius-sm)] border border-hairline p-2">
              <span className="min-w-0">{v.title || article.title}</span>
              <span className="mono text-[var(--t-2)] text-ink-soft">
                {day(v.saved_at)} · {Math.round(v.size / 100) / 10}k
              </span>
              <Button size="sm" onClick={() => void restore(v)}>Put this back</Button>
            </li>
          ))}
        </ul>
      ) : null}
      <div className="mt-4">
        <Button size="sm" kind="soft" onClick={onClose}>Close</Button>
      </div>
    </dialog>
  );
}

/* ============================================================
   One piece, as a row
   ============================================================ */

function PieceRow(
  { a, onDone, onHistory }:
  { a: Piece; onDone: () => void; onHistory: (a: Piece) => void },
) {
  const sec = findSection(a.section);
  const url = pieceUrl(sec, a.slug);
  const warn = coverWarning(a);
  const [busy, setBusy] = useState(false);

  const patch = async (body: Record<string, unknown>, said: string): Promise<void> => {
    setBusy(true);
    const r = await adminCall(`articles/${encodeURIComponent(a.slug)}`,
      { method: "PATCH", body });
    setBusy(false);
    await toast(r.ok ? said : "That did not save");
    if (r.ok) onDone();
  };

  const remove = async (): Promise<void> => {
    if (!window.confirm(`Delete "${a.title}" from the database? This cannot be undone.`)) return;
    setBusy(true);
    const r = await adminCall(`articles/${encodeURIComponent(a.slug)}`, { method: "DELETE" });
    setBusy(false);
    await toast(r.ok ? "Deleted" : "That did not delete");
    if (r.ok) onDone();
  };

  /* The one control here that changes a URL. The Worker refuses to
     serve a piece at a mount that is not its own, so the move is
     complete the moment it saves: the old address stops answering
     and the new one starts. That is why it asks when the piece is
     live, and does not when it is a draft. */
  const move = async (id: string): Promise<void> => {
    const to = findSection(id);
    if (to.id === sec.id) return;
    if (a.status === "live" && !window.confirm(
      `Move "${a.title}" from ${sec.en} to ${to.en}?\n\n`
      + `It is live, so its address changes from ${url} to ${pieceUrl(to, a.slug)}. `
      + "Any link already shared will stop working.")) return;
    await patch({ section: to.id }, `Moved to ${to.en}: ${pieceUrl(to, a.slug)}`);
  };

  return (
    <li className="grid gap-2 rounded-[var(--radius-sm)] border border-hairline p-3">
      <p className="m-0 flex flex-wrap items-baseline gap-2">
        <a className="min-w-0 font-semibold" href={url}>{a.title}</a>
        <span className="pill" style={accentStyle(sec.id)}>
          {sec.id === "insights" ? sec.en : sec.bn}
        </span>
        <span className="pill">{a.status}</span>
        {warn ? <span className="pill" title={WARN_WHY[warn]}>{warn}</span> : null}
        <span className="mono ml-auto text-[var(--t-2)] text-ink-soft">
          {day(a.updated_at)}
        </span>
      </p>

      {a.topics?.length ? (
        <p className="mono m-0 text-[var(--t-2)] text-ink-soft">
          {a.topics.slice(0, 3).join(" · ")}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        <Button size="sm" kind="soft" disabled={busy}
                onClick={() => { location.href = `/studio/?edit=${encodeURIComponent(a.slug)}`; }}>
          Edit
        </Button>
        <Button size="sm" disabled={busy}
                onClick={() => { open(url, "_blank", "noopener"); }}>View</Button>
        <Button size="sm" disabled={busy}
                onClick={() => void patch(
                  { status: a.status === "live" ? "draft" : "live" },
                  a.status === "live" ? "Unpublished" : "Published")}>
          {a.status === "live" ? "Unpublish" : "Publish"}
        </Button>
        <Button size="sm" disabled={busy} onClick={() => onHistory(a)}>History</Button>
        {warn ? (
          <Button size="sm" disabled={busy}
                  onClick={() => void drawCard(a, onDone)}>Draw card</Button>
        ) : null}
        <Button size="sm" kind="quiet" disabled={busy}
                onClick={() => { void navigator.clipboard?.writeText(`${location.origin}${url}`); void toast("Link copied"); }}>
          Copy link
        </Button>
        <Button size="sm" kind="quiet" disabled={busy} onClick={() => void remove()}>
          Delete
        </Button>
        <div className="ml-auto">
          <Select id={`move-${a.slug}`} label="Move to" value={sec.id} disabled={busy}
                  onChange={(e) => void move(e.target.value)}>
            {SECTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.id === "insights" ? s.en : `${s.bn} · ${s.en}`}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </li>
  );
}

/* ============================================================
   The panel
   ============================================================ */

export function PiecesPanel() {
  const [phase, setPhase] = useState<"loading" | "locked" | "error" | "ready">("loading");
  const [all, setAll] = useState<Piece[]>([]);
  const [section, setSection] = useState("all");
  const [q, setQ] = useState("");
  const [history, setHistory] = useState<Piece | null>(null);

  const load = useCallback(async (): Promise<void> => {
    const r = await adminCall<{ articles?: Piece[] }>("articles?all=1");
    if (isLocked(r)) { setPhase("locked"); return; }
    if (!r.ok) { setPhase("error"); return; }
    const rows = r.data?.articles ?? [];
    setAll([...rows].sort((a, b) =>
      String(b.updated_at ?? "").localeCompare(String(a.updated_at ?? ""))));
    setPhase("ready");
  }, []);

  useEffect(() => { void load(); }, [load]);

  /* How many are in each section, so a filter says what is behind
     it rather than making somebody press it to find out. */
  const counts = useMemo(() => {
    const tally: Record<string, number> = { all: all.length };
    for (const a of all) {
      const id = findSection(a.section).id;
      tally[id] = (tally[id] ?? 0) + 1;
    }
    return tally;
  }, [all]);

  const shown = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return all
      .filter((a) => section === "all" || findSection(a.section).id === section)
      .filter((a) => !needle
        || `${a.title} ${a.slug} ${a.tag} ${(a.topics ?? []).join(" ")}`
          .toLowerCase().includes(needle));
  }, [all, section, q]);

  const needsCard = all.filter((a) => coverWarning(a)).length;

  return (
    <Surface material="pane" className="ad-panel" id="published">
      <h3>Published</h3>

      {phase === "loading" ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">
          The passphrase is not held, so the pieces are not readable from here.
          Sign in at <a href="/studio">the Studio</a>: it is the same session, and
          nothing on this page can mint it.
        </p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">/api/articles did not answer. Health above says
          whether the database is reachable.</p>
      ) : null}

      {phase === "ready" ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            {[["all", "Everywhere"] as const,
              ...SECTIONS.map((s) => [s.id, s.id === "insights" ? s.en : s.bn] as const)]
              .map(([id, label]) => (
                <Button key={id} size="sm" kind={id === section ? "soft" : "quiet"}
                        pressed={id === section} onClick={() => setSection(id)}>
                  {label}
                  <span className="mono ml-2 text-ink-soft">{counts[id] ?? 0}</span>
                </Button>
              ))}
            <div className="ml-auto min-w-48 flex-1">
              <Field id="published-search" label="Search the pieces" hideLabel
                     type="search" value={q} onChange={(e) => setQ(e.target.value)}
                     placeholder="Search titles, slugs and topics" />
            </div>
          </div>

          {/* Counted, never remembered. */}
          <p className="mono m-0 text-[var(--t-2)] text-ink-soft">
            {shown.length}{shown.length === all.length ? "" : ` of ${all.length}`}
            {` piece${all.length === 1 ? "" : "s"}`}
            {needsCard ? ` · ${needsCard} share card${needsCard === 1 ? "" : "s"} to draw` : ""}
          </p>

          {shown.length === 0 ? (
            <p className="ad-quiet">
              {q ? "Nothing matches that." : "Nothing published in that section yet."}
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0">
              {shown.map((a) => (
                <PieceRow key={`${a.section}/${a.slug}`} a={a}
                          onDone={() => void load()} onHistory={setHistory} />
              ))}
            </ul>
          )}
        </>
      ) : null}

      {history ? (
        <History article={history} onClose={() => setHistory(null)}
                 onRestored={() => void load()} />
      ) : null}
    </Surface>
  );
}
