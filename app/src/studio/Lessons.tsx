/* ============================================================
   Lessons.tsx: the schools' prose, edited where it lives.

   TRANSITION.md Stage 8, step 4. Until now a lesson was changed
   by editing `aab/<school>/content/<stage>.js`, running the
   school's builder and committing 60-odd regenerated pages. The
   text is a row in `school_lessons` as well now, and this is the
   surface that writes it.

   ---- what this is not ----

   It is not a second Studio. An article has a headline, a dek, a
   section, topics, a share card and a pre-flight panel, and none
   of that applies here: a lesson's title, its order and the stage
   it belongs to are the ladder, and the ladder is
   `curriculum.js`. So this page edits one thing, the prose, and
   the picker beside it is read-only.

   It is also not a second editor. `createEditor()` from
   `/editor.js` is the writing surface for the whole site and
   `Editor.tsx` already wraps it for React. The rule at the top of
   that file applies here unchanged: the contenteditable is
   rendered once and React never re-renders its contents.

   ---- the one thing worth being careful about ----

   The body is not React state, so "has this changed" cannot be
   answered by comparing props. `saved` holds the HTML as the
   database last confirmed it and `rev` ticks on every keystroke;
   dirty is a comparison of the editor's current HTML against
   `saved`. That is also why switching lessons asks before
   throwing anything away: there is no draft store behind this,
   unlike an article.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { EditorHandle } from "/editor.js";
import { toast } from "../site.ts";
import { Editor } from "./Editor.tsx";
import { Chip, Empty, Loading } from "../bits.tsx";
import {
  SCHOOLS, allCounts, elsewhere, ladder, lessonsOf, readLesson, saveLesson, lessonUrl,
  type Counts, type FullLesson, type Lesson, type SchoolId, type Stage,
} from "./lessons.ts";

/** What the URL is asking for. `?lessons` opens the picker;
    `?lessons=<school>/<stage>/<slug>` opens one lesson, which is
    what a link from a school's page can point at. */
function askedFor() {
  const raw = new URLSearchParams(location.search).get("lessons") ?? "";
  const [school, stage, slug] = raw.split("/").filter(Boolean);
  return { school, stage, slug };
}

export function Lessons() {
  const asked = useMemo(askedFor, []);

  const [counts, setCounts] = useState<Record<string, Counts>>({});
  const [school, setSchool] = useState<string>(asked.school || SCHOOLS[0].id);
  const [stages, setStages] = useState<Stage[]>([]);
  const [stage, setStage] = useState<string>(asked.stage || "");
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [open, setOpen] = useState<FullLesson | null>(null);

  const [loadingLadder, setLoadingLadder] = useState(true);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [busy, setBusy] = useState("");

  /* The editor's handle, the HTML as last stored, and a counter
     that ticks when the contenteditable changes. See the note at
     the top: none of the body is React state. */
  const handle = useRef<EditorHandle | null>(null);
  const [saved, setSaved] = useState("");
  const [rev, setRev] = useState(0);
  const bumped = useCallback(() => setRev((n) => n + 1), []);

  /* Every school on this site teaches in Bangla, so the blocks a
     writer inserts are labelled in Bangla. Read through a ref
     because the editor reads it at the moment of insertion. */
  const lang = useRef("bn");

  const dirty = useMemo(
    () => Boolean(open) && (handle.current?.html() ?? "") !== saved,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rev, saved, open]
  );

  /* The stage the picker is on, as an object rather than a slug,
     because what the list does next depends on its flags. */
  const onStage = useMemo(
    () => stages.find((s) => s.slug === stage) ?? null,
    [stages, stage]
  );
  const away = onStage ? elsewhere(onStage) : null;

  /* ---------- loading ---------- */

  useEffect(() => { void allCounts().then(setCounts); }, []);

  useEffect(() => {
    let live = true;
    setLoadingLadder(true);
    void ladder(school).then(({ stages: got }) => {
      if (!live) return;
      setStages(got);
      setLoadingLadder(false);
      /* Land on a stage rather than on nothing. The one the URL
         asked for if it is real, otherwise the first rung. */
      setStage((now) => (got.some((s) => s.slug === now) ? now : got[0]?.slug ?? ""));
    });
    return () => { live = false; };
  }, [school]);

  useEffect(() => {
    if (!stage) { setLessons([]); return; }
    let live = true;
    void lessonsOf(school, stage).then((got) => { if (live) setLessons(got); });
    return () => { live = false; };
  }, [school, stage]);

  /* ---------- opening one ---------- */

  const openLesson = useCallback(async (slug: string) => {
    /* Nothing in this stage is editable here, so do not open one.
       The list does not offer the buttons either; this is the
       second lock, because a URL can ask directly. */
    if (away) { toast("This stage's text does not live in these rows."); return; }

    if (dirty && !confirm(
      "This lesson has changes that are not saved. Open another one anyway?"
    )) return;

    setLoadingLesson(true);
    const got = await readLesson(school, stage, slug);
    setLoadingLesson(false);

    if (!got) { toast("That lesson did not answer."); return; }

    setOpen(got);
    setSaved(got.body ?? "");
    handle.current?.setHtml(got.body ?? "");
    bumped();
  }, [school, stage, dirty, bumped, away]);

  /* The lesson the URL named, once its stage has loaded. Runs at
     most once: after that the picker is in charge. */
  const landed = useRef(false);
  useEffect(() => {
    if (landed.current || !asked.slug || !lessons.length) return;
    landed.current = true;
    if (lessons.some((l) => l.slug === asked.slug)) void openLesson(asked.slug);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessons]);

  /* ---------- saving ---------- */

  const save = useCallback(async () => {
    if (!open || busy) return;
    const html = handle.current?.html() ?? "";

    setBusy("Saving…");
    const result = await saveLesson(open.school, open.stage, open.slug, { body: html });
    setBusy("");

    if ("error" in result) { toast(result.error); return; }

    /* What the database stored, not what was sent. The body goes
       through the server's sanitiser on the way in, so the two can
       differ, and the one worth showing is the one a reader will
       get. */
    const stored = result.lesson.body ?? "";
    setOpen(result.lesson);
    setSaved(stored);
    if (stored !== html) handle.current?.setHtml(stored);
    bumped();

    /* The row is saved; the page a reader sees is still the
       committed HTML until the school is rebuilt. Saying so is the
       whole point: a writer who thinks this published is a writer
       who will not run the builder. */
    setLessons((list) => list.map((l) => (
      l.slug === open.slug
        ? { ...l, ...result.lesson, written: Boolean(stored) }
        : l
    )));
    toast(stored ? "Saved to the database. Rebuild the school to publish it." : "Saved as unwritten.");
  }, [open, busy, bumped]);

  /* Ctrl+S and Ctrl+Enter both reach the editor's own handlers,
     and both mean the same thing here: there is one action. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [save]);

  /* Leaving with unsaved prose. There is no draft store behind
     this page, so the browser's own question is the only net. */
  useEffect(() => {
    const onLeave = (e: BeforeUnloadEvent) => { if (dirty) e.preventDefault(); };
    addEventListener("beforeunload", onLeave);
    return () => removeEventListener("beforeunload", onLeave);
  }, [dirty]);

  return (
    <>
      <div className="hero" style={{ paddingBlock: "52px 26px" }}>
        <span className="eyebrow mono">Lesson Studio · private tool</span>
        <h1 style={{ fontSize: "clamp(1.9rem,4.4vw,2.8rem)" }}>
          The schools, edited where they live.
        </h1>
        <p className="lede">
          Every lesson of the four schools is a row in the database. Pick one and
          write it here. The ladder itself (which lessons exist, what order they
          come in) stays in each school&apos;s <code>curriculum.js</code>, so this
          page changes prose and nothing else.
        </p>
      </div>

      <div className="studio-bar">
        <span className="bar-group">
          <a className="btn btn-ghost" href="/studio/">← The Article Studio</a>
          <a className="btn btn-ghost" href="/desk/index.html">The desk →</a>
        </span>
        <span className="studio-now">
          {open
            ? `${open.stage}/${open.slug}${dirty ? " · not saved" : " · saved"}`
            : "Nothing open"}
        </span>
      </div>

      <div className="studio-grid">
        <div className="studio-pane editor">
          <div className="pane-bar">
            <span className="mono">
              {open ? `${open.bn || open.slug}` : "1 · Pick a lesson"}
            </span>
            {open ? (
              <span className="mono" style={{ fontSize: "0.66rem" }}>
                <a href={lessonUrl(open.school, open.stage, open.slug)} target="_blank"
                   rel="noreferrer">the live page ↗</a>
              </span>
            ) : null}
          </div>

          {loadingLesson ? <Loading /> : null}

          {/* Rendered always, never conditionally. The editor is
              created once on mount and torn down on unmount, and
              putting it behind `open &&` would rebuild it, and lose
              the caret and the undo stack, every time a lesson is
              opened. It is hidden instead. */}
          <div hidden={!open}>
            <Editor
              handle={handle}
              onChange={bumped}
              lang={lang}
              onSave={() => void save()}
              onPublish={() => void save()}
            />
          </div>

          {!open && !loadingLesson ? (
            <Empty>Pick a lesson on the right to write it.</Empty>
          ) : null}

          {open ? (
            <div className="pane-bar">
              <button className="btn" type="button" disabled={!dirty || Boolean(busy)}
                      onClick={() => void save()}>
                {busy || (dirty ? "Save this lesson" : "Saved")}
              </button>
              <span className="mono" style={{ fontSize: "0.66rem" }}>
                Saving writes the row. The page a reader gets is rebuilt by{" "}
                <code>node aab/{open.school === "learn" ? "learn/build-lessons" : `${open.school}/build-${open.school}`}.mjs</code>.
              </span>
            </div>
          ) : null}
        </div>

        <div className="studio-pane">
          <div className="pane-bar">
            <span className="mono">2 · The schools</span>
            <span className="mono" style={{ fontSize: "0.66rem" }}>
              {counts[school]
                ? `${counts[school].written} of ${counts[school].total} written`
                : ""}
            </span>
          </div>

          <div className="pane-bar">
            {SCHOOLS.map((s) => (
              <Chip
                key={s.id}
                pressed={s.id === school}
                title={`${s.name}, at ${s.where}`}
                onClick={() => {
                  if (s.id === school) return;
                  if (dirty && !confirm(
                    "This lesson has changes that are not saved. Change school anyway?"
                  )) return;
                  setSchool(s.id as SchoolId);
                  setOpen(null);
                  setSaved("");
                  handle.current?.clear();
                }}
              >
                {s.name}
                {counts[s.id]
                  ? <span className="tab-count">{counts[s.id].written}/{counts[s.id].total}</span>
                  : null}
              </Chip>
            ))}
          </div>

          {loadingLadder ? <Loading /> : (
            <>
              <div className="pane-bar">
                {stages.map((s) => (
                  <Chip
                    key={s.slug}
                    pressed={s.slug === stage}
                    title={elsewhere(s)
                      ? `${s.slug}, written at ${elsewhere(s)?.where}`
                      : s.status === "live" ? s.slug : `${s.slug}, status: ${s.status}`}
                    onClick={() => setStage(s.slug)}
                  >
                    {s.bn || s.slug}
                    {elsewhere(s) ? <span className="tab-count">elsewhere</span> : null}
                  </Chip>
                ))}
              </div>

              {/* `.stack` and `.chip` are the site's own, out of
                  @layer utilities and @layer components. Nothing
                  here invents a class: `.steps` was the first thing
                  this list wanted and it already belongs to the
                  Learn hub, which is exactly the collision
                  check-css.mjs exists to catch. */}
              {/* A stage whose prose is not in these rows says so
                  rather than showing 18 lessons marked unwritten,
                  which is true of the rows and false about the
                  site. See `elsewhere()` for the whole story. */}
              {away ? (
                <Empty>
                  These {lessons.length} are not written here. They live{" "}
                  {away.what}, at{" "}
                  <a href={away.where} target="_blank" rel="noreferrer">{away.where}</a>.
                  {" "}The builder skips this stage, so text saved into these rows
                  would not reach a page.
                </Empty>
              ) : lessons.length ? (
                <div className="stack">
                  {lessons.map((l) => {
                    const isOpen = open?.slug === l.slug && open?.stage === stage;
                    return (
                      <Chip
                        key={l.slug}
                        pressed={isOpen}
                        title={`${l.slug}${l.status === "live" ? "" : ` · ${l.status}`}`}
                        onClick={() => void openLesson(l.slug)}
                      >
                        {l.bn || l.slug}
                        <span className="tab-count">
                          {l.written ? `${l.minutes || 0}m` : "unwritten"}
                        </span>
                      </Chip>
                    );
                  })}
                </div>
              ) : (
                <Empty>This stage has no lessons in the database.</Empty>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
