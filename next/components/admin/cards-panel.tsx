"use client";

/* ============================================================
   cards-panel.tsx: every piece and every lesson gets a picture,
   without anybody deciding which.

   THE PROBLEM THIS IS FOR

   A card is drawn when a piece is published, in the browser, by
   the person publishing it. So a piece written before that code
   existed has none, and a LESSON has never had one at all: all
   251 of them fall back to their stage's standing card, so a
   reader pasting three lessons of one stage into a chat pastes
   the same picture three times.

   Nothing can draw them on the server. A card is a canvas, a
   canvas is a browser, and the two Workers here have neither. So
   this is a QUEUE rather than a job: the desk asks what has no
   picture, draws one, sends it back, and does the next. Left
   open, it works through everything; closed, it stops where it
   was and the next visit carries on, because the queue is
   whatever the database still answers with.

   ---- one at a time, and slowly ----

   Each card is a canvas, an SVG rasterised through an image, a
   JPEG encode and an upload to R2. Six at once would be six
   uploads racing for one connection and a page that stops
   answering the pointer. One at a time with a pause between is
   slower on paper and finishes sooner in practice, and it leaves
   the desk usable while it runs, which matters because this runs
   for minutes.

   ---- and it is not a background thread ----

   It runs while the panel is mounted and stops when it is not.
   Said out loud in the copy, because a queue that claims to run
   in the background and stops when a tab closes is worse than
   one that says it needs the tab open.
   ============================================================ */

import { useCallback, useEffect, useRef, useState } from "react";
import { adminCall, isLocked } from "../../lib/admin-api";
import { runtimeModule } from "../account/runtime";
import { artOf } from "../../lib/art";
import { Surface } from "../ui/surface";
import { Button } from "../ui/button";

type CardModule = typeof import("/share-card.js");
type ApiModule = typeof import("/api.js");

interface PieceRow {
  slug: string; title: string; tag: string; section: string;
}
interface LessonRow {
  school: string; stage: string; slug: string; title: string;
  en: string; icon: string;
}
interface Queue { pieces: PieceRow[]; lessons: LessonRow[] }

/** Between two cards. Long enough that the page answers a
    pointer and short enough that 250 lessons is minutes rather
    than an afternoon. */
const BREATH = 350;

type Phase = "loading" | "locked" | "error" | "ready";

export function CardsPanel() {
  const [phase, setPhase] = useState<Phase>("loading");
  const [queue, setQueue] = useState<Queue | null>(null);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(0);
  const [failed, setFailed] = useState(0);
  const [now, setNow] = useState("");

  /* A ref rather than the state, because the loop below reads it
     between awaits and a closure would hold whatever the flag was
     when the loop started. That is the whole of why a "Stop"
     button on a loop like this usually does nothing. */
  const go = useRef(false);

  const load = useCallback(async () => {
    const r = await adminCall<Queue>("admin/cards");
    if (isLocked(r)) { setPhase("locked"); return; }
    if (!r.ok || !r.data) { setPhase("error"); return; }
    setQueue({ pieces: r.data.pieces ?? [], lessons: r.data.lessons ?? [] });
    setPhase("ready");
  }, []);

  useEffect(() => { void load(); }, [load]);

  /* Stop when the panel goes. Without this the loop carries on
     against an unmounted component, uploading cards and setting
     state nobody is reading. */
  useEffect(() => () => { go.current = false; }, []);

  const run = useCallback(async () => {
    if (!queue || running) return;
    go.current = true;
    setRunning(true);
    setDone(0);
    setFailed(0);

    const [card, api] = await Promise.all([
      runtimeModule<CardModule>("/share-card.js"),
      runtimeModule<ApiModule>("/api.js"),
    ]);
    /* Once for the whole run. The drawings are 34 KB and asking
       per card would be 34 KB times 250. */
    const table = await card.artTable();

    const drawFor = async (
      seed: string, words: { title: string; kicker?: string; section?: string },
      subject: string, store: (url: string) => Promise<boolean>,
    ): Promise<boolean> => {
      try {
        const wall = table?.motifOf[subject];
        const blob = await card.shareCardBlob({ src: "", focus: "centre" },
          { ...words, seed },
          table
            ? { subject: table.subjects[subject], motif: wall ? table.motifs[wall] : undefined }
            : {});
        const stored = await api.uploadMedia(blob, card.cardSlug(seed.replace(/\//g, "-")));
        if (!stored?.url) return false;
        return await store(stored.url);
      } catch {
        return false;
      }
    };

    for (const piece of queue.pieces) {
      if (!go.current) break;
      setNow(piece.title);
      const { subject } = artOf({
        id: piece.slug, section: piece.section, title: piece.title,
        tags: [piece.tag],
      });
      const won = await drawFor(piece.slug,
        { title: piece.title, kicker: piece.tag, section: piece.section },
        subject,
        async (url) => (await adminCall(`articles/${encodeURIComponent(piece.slug)}`,
          { method: "PATCH", body: { cover: url } })).ok === true);
      if (won) setDone((n) => n + 1); else setFailed((n) => n + 1);
      await new Promise((r) => setTimeout(r, BREATH));
    }

    for (const lesson of queue.lessons) {
      if (!go.current) break;
      setNow(lesson.title);
      /* A lesson's id is `<school>/<stage>/<slug>`, which is what
         its ticks are filed under and what `shared/art.ts` should
         hash: the same lesson has to be the same card every time
         it is drawn. */
      const id = `${lesson.school}/${lesson.stage}/${lesson.slug}`;
      const { subject } = artOf({
        id, section: lesson.school, title: lesson.en || lesson.title,
        tags: [lesson.icon],
      });
      const won = await drawFor(id,
        { title: lesson.title, kicker: lesson.stage.replace(/-/g, " "),
          section: lesson.school },
        subject,
        async (url) => (await adminCall(
          `schools/${lesson.school}/${lesson.stage}/${lesson.slug}`,
          { method: "PUT", body: { card: url } })).ok === true);
      if (won) setDone((n) => n + 1); else setFailed((n) => n + 1);
      await new Promise((r) => setTimeout(r, BREATH));
    }

    go.current = false;
    setRunning(false);
    setNow("");
    await load();
  }, [queue, running, load]);

  const waiting = (queue?.pieces.length ?? 0) + (queue?.lessons.length ?? 0);

  return (
    <Surface material="pane" className="ad-panel" id="cards">
      <h3>Pictures</h3>

      {phase === "loading" ? <p className="ad-quiet">Counting…</p> : null}
      {phase === "locked" ? (
        <p className="ad-quiet">Unlock with the passphrase to see what has no picture.</p>
      ) : null}
      {phase === "error" ? (
        <p className="ad-quiet">That did not answer.</p>
      ) : null}

      {phase === "ready" && queue ? (
        <>
          <p className="ad-quiet">
            {waiting === 0
              ? "Everything published has a picture of its own."
              : `${queue.pieces.length} piece${queue.pieces.length === 1 ? "" : "s"} `
                + `and ${queue.lessons.length} lesson${queue.lessons.length === 1 ? "" : "s"} `
                + "are still sharing a standing card."}
          </p>

          {waiting > 0 ? (
            <p className="ad-quiet">
              Each one is drawn here, in this tab, and sent back. It takes about
              a second each, so leave this open: closing it stops the run where
              it is, and starting again picks up whatever is left.
            </p>
          ) : null}

          <div className="ad-actions">
            {running ? (
              <Button onClick={() => { go.current = false; }}>Stop</Button>
            ) : (
              <Button kind="solid" onClick={() => void run()} disabled={waiting === 0}>
                Draw {waiting > 0 ? `all ${waiting}` : "them"}
              </Button>
            )}
            <Button kind="quiet" onClick={() => void load()} disabled={running}>
              Count again
            </Button>
          </div>

          {running || done || failed ? (
            <p className="ad-quiet mono">
              {done} drawn{failed ? `, ${failed} would not` : ""}
              {now ? ` · ${now}` : ""}
            </p>
          ) : null}
        </>
      ) : null}
    </Surface>
  );
}
