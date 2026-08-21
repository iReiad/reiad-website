/* ============================================================
   Studio.tsx: paste the article, paste the photos, publish.

   The state of this page is four things: the fields, the topics,
   what the piece is tied to, and a counter that says the article
   body has changed. The body itself is not state, deliberately:
   it lives in the contenteditable, and the note at the top of
   Editor.tsx says why. `rev` is how a component tree finds out
   that something React does not own has moved.

   Everything else here is derived. `meta` is a function of the
   fields, the topics and the body; the preview, the meters, the
   pre-flight panel and the publish payload are all functions of
   `meta`. The old Studio recomputed the same thing at eleven call
   sites and had to remember to.
   ============================================================ */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
/* The site's own components, across the workspace boundary.
   `dedupe` in `app/vite.config.ts` is what holds that up: one
   React in the bundle, whichever directory asked for it. */
import { Button, ButtonLink } from "../../../next/components/ui/button.tsx";
import { Eyebrow, SectionLabel } from "../../../next/components/ui/label.tsx";
import type { EditorHandle } from "/editor.js";
import { findSection, pieceUrl } from "/content.js";
import { topicsFromTag as topicsFrom } from "./piece.ts";
import { lock } from "/auth.js";
import { toast } from "../site.ts";
import { api, listArticles, readArticle, type Article } from "../api.ts";

import { Editor } from "./Editor.tsx";
import { Fields } from "./Fields.tsx";
import { Preview, type ViewMode, type ViewTheme, type ViewWidth } from "./Preview.tsx";
import { Preflight } from "./Preflight.tsx";
import { OpenSheet, NotionSheet } from "./Sheets.tsx";
import { preflight } from "./preflight.ts";
import { publish } from "./publish.ts";
import { notionPage, notionStatus } from "./notion.ts";
import {
  blankFields, blankTied, metaOf, type Fields as FieldValues, type Tied,
} from "./piece.ts";
import {
  dropDraft, latestDraft, listDrafts, newDraftId, putDraft, type Draft,
} from "./drafts.ts";

/** What the URL is asking for, if anything. The desk's Edit links
    land here: ?edit=<slug> for a piece in the database,
    ?file=<section>:<slug> for one that is still a file. */
function askedFor() {
  const query = new URLSearchParams(location.search);
  return { slug: query.get("edit"), file: query.get("file") };
}

export function Studio({ dynamic }: { dynamic: boolean }) {
  const [fields, setAllFields] = useState<FieldValues>(blankFields);
  const [topics, setTopics] = useState<string[]>([]);
  const [tied, setTied] = useState<Tied>(blankTied);
  const [rev, setRev] = useState(0);

  const [draftLine, setDraftLine] = useState("");
  const [busy, setBusy] = useState("");
  const [sheet, setSheet] = useState<"open" | "notion" | null>(null);
  const [taken, setTaken] = useState<Map<string, Article>>(new Map());
  const [hasNotion, setHasNotion] = useState(false);
  const [waiting, setWaiting] = useState(0);
  const [view, setViewState] = useState({
    mode: "article" as ViewMode, width: "full" as ViewWidth, theme: "auto" as ViewTheme,
  });

  const ed = useRef<EditorHandle | null>(null);
  const langRef = useRef(fields.lang);
  langRef.current = fields.lang;

  const setFields = useCallback(
    (patch: Partial<FieldValues>) => setAllFields((f) => ({ ...f, ...patch })), []);
  const setView = useCallback(
    (patch: Partial<typeof view>) => setViewState((v) => ({ ...v, ...patch })), []);

  /* ---------- the article has moved ----------

     Debounced at 200ms, which is the number the old Studio used
     and is there for one reason: `metaOf` runs the whole body
     through the sanitiser, and doing that on every keystroke of a
     two-thousand-word piece is work nobody asked for. */
  /* `ReturnType<typeof setTimeout>` rather than `number`: this
     file compiles with node's types in scope as well as the DOM's,
     and node's `setTimeout` returns a `Timeout`. Writing the
     return type down is what makes it right under either. */
  const bumpTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const bump = useCallback(() => {
    clearTimeout(bumpTimer.current);
    bumpTimer.current = setTimeout(() => setRev((n) => n + 1), 200);
  }, []);

  const meta = useMemo(
    () => metaOf(fields, topics, ed.current?.html() ?? ""),
    // `rev` is the dependency that matters: it is how this finds
    // out the contenteditable changed.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields, topics, rev]);

  const issues = useMemo(
    () => preflight(meta, { taken, openSlug: tied.slug, dynamic }),
    [meta, taken, tied.slug, dynamic]);
  const blocked = issues.some((i) => i.level === "error");

  /* ---------- what the site already calls things ----------

     Out of the database, and the label counts as topics, because
     that is what a label has always been here.

     It read `content.js` as well until Stage 11.2, when the arrays
     it read stopped holding pieces: every piece is a row. The
     visible consequence is that with no database there is no
     vocabulary to offer, which is honest rather than a loss.
     Nothing is being suggested from a list of what used to exist. */
  const known = useMemo(() => {
    const seen = new Map<string, string>();
    const add = (t: string) => {
      const key = String(t).trim().toLowerCase();
      if (key && !seen.has(key)) seen.set(key, String(t).trim());
    };
    for (const a of taken.values()) {
      if (a.topics?.length) a.topics.forEach(add);
      else topicsFrom(a.tag).forEach(add);
    }
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, [taken]);

  /* ---------- saving, on this device ---------- */

  const saveDraft = useCallback(async () => {
    const draft: Draft = {
      id: tied.draftId ?? newDraftId(),
      savedAt: Date.now(),
      slug: tied.slug, section: tied.section, notionPageId: tied.notionPageId,
      topics: [...topics],
      html: ed.current?.html() ?? "",
      fields: { ...fields },
    };
    if (!tied.draftId) setTied((t) => ({ ...t, draftId: draft.id }));
    await putDraft(draft);
    setDraftLine(`Draft saved ${new Date().toLocaleTimeString()}`);
  }, [fields, topics, tied]);

  /* Debounced at 700ms, separately from the preview: writing a
     megabyte of base64 into IndexedDB is not something to do four
     times a second. */
  useEffect(() => {
    if (!ed.current) return;
    const t = setTimeout(() => { void saveDraft(); }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev, fields, topics]);

  /* ---------- loading something in ---------- */

  const load = useCallback((
    next: { html: string; fields: Partial<FieldValues>; topics: string[]; tied: Partial<Tied> },
  ) => {
    ed.current?.setHtml(next.html);
    setAllFields((f) => ({ ...blankFields(), ...f, ...next.fields }));
    setTopics(next.topics);
    setTied((t) => ({ ...t, ...next.tied }));
    setRev((n) => n + 1);
  }, []);

  const loadDraft = useCallback((draft: Draft) => {
    load({
      html: draft.html ?? "",
      /* A draft written before sections existed has no section
         field, and Insights is where it would have gone. */
      fields: { ...blankFields(), ...draft.fields, section: draft.fields?.section ?? "insights" },
      /* And one written before the label became the topics has its
         label sitting in a field that no longer exists. It is the
         same list, so read it back rather than losing it. */
      topics: draft.topics?.length ? draft.topics : topicsFrom(draft.fields?.tag),
      tied: {
        draftId: draft.id ?? newDraftId(),
        slug: draft.slug ?? null,
        section: draft.section ?? null,
        notionPageId: draft.notionPageId ?? null,
      },
    });
    setDraftLine(draft.savedAt ? `Draft from ${new Date(draft.savedAt).toLocaleString()}` : "");
  }, [load]);

  /** Pull a published article back into the editor. Without this
      the Studio could only ever create: the way to change a
      published piece was to retype it and hope the slug matched. */
  const openArticle = useCallback(async (slug: string) => {
    const res = await readArticle(slug);
    const article = res?.ok ? res.article : null;
    if (!article) { toast("Couldn't load that one."); return; }

    load({
      html: article.body ?? "",
      fields: {
        title: article.title ?? "", dek: article.dek ?? "", slug: article.slug ?? "",
        date: (article.published_at ?? "").slice(0, 10)
          || new Date().toISOString().slice(0, 10),
        lang: article.lang === "bn" ? "bn" : "en",
        section: findSection(article.section).id,
      },
      topics: article.topics?.length ? article.topics : topicsFrom(article.tag),
      tied: {
        draftId: newDraftId(),
        slug: article.slug,
        section: findSection(article.section).id,
        notionPageId: (article as { notion_page_id?: string }).notion_page_id ?? null,
      },
    });
    setSheet(null);
    toast(`Editing "${article.title}". Publishing updates it in place.`);
  }, [load]);

  /* `openFile()` stood here: it read a committed piece back out
     of its own rendered page and loaded it into the editor, which
     is how the last file pieces were moved into the database. It
     went with them at Stage 11.2, along with the `?file=` address
     that opened it. */

  const importNotion = useCallback(async (pageId: string, silent = false) => {
    const res = await notionPage(pageId);
    if (!res?.ok) {
      toast(res && !res.ok && res.message ? res.message : "That page couldn't be imported.");
      return;
    }
    const page = res.page;

    ed.current?.setHtml(page.body || "");
    setAllFields((f) => ({
      ...f,
      ...(page.title ? { title: page.title } : {}),
      ...(page.dek ? { dek: page.dek } : {}),
      ...(page.date ? { date: page.date } : {}),
      ...(page.lang ? { lang: page.lang } : {}),
      ...(page.slug && !silent ? { slug: page.slug } : {}),
    }));
    if (page.tag) setTopics(topicsFrom(page.tag));
    setTied((t) => ({
      ...t,
      // A re-sync replaces the body of the piece already open; a
      // fresh import starts its own draft so it cannot land on one.
      draftId: silent ? t.draftId : newDraftId(),
      notionPageId: page.id,
    }));
    setRev((n) => n + 1);
    setSheet(null);

    toast(res.truncated
      ? "Imported, but the page was long enough to hit the block limit. Check the end of it."
      : silent ? "Re-synced from Notion."
      : `Imported "${page.title}". Photos upload when you publish.`);
  }, []);

  /* ---------- new, and clear ---------- */

  const blank = useCallback(() => {
    ed.current?.clear();
    setAllFields(blankFields());
    setTopics([]);
    setTied(blankTied());
    setRev((n) => n + 1);
    setDraftLine("");
  }, []);

  /* ---------- publishing ---------- */

  const send = useCallback(async (status: "live" | "draft") => {
    const m = metaOf(fields, topics, ed.current?.html() ?? "");

    if (!m.body.trim()) { toast("Paste the article text first."); ed.current?.focus(); return; }
    if (!fields.title.trim()) { toast("Give it a headline first."); return; }
    if (preflight(m, { taken, openSlug: tied.slug, dynamic }).some((i) => i.level === "error")) {
      toast('Fix the items marked "stops publishing" first.');
      document.getElementById("preflight")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setBusy(status === "live" ? "Publishing…" : "Saving…");
    try {
      const result = await publish({
        status, meta: m, tied,
        say: (text) => { setBusy(text); },
        remeta: (body) => metaOf(fields, topics, body),
      });

      /* The rewritten body goes back into the editor so the next
         save does not re-upload the same photos, and the draft
         stops carrying megabytes of base64 around with it. */
      if (result.body) { ed.current?.setHtml(result.body); setRev((n) => n + 1); }
      if (result.ok) {
        setTied((t) => ({ ...t, slug: m.slug, section: m.section }));
        const rows = await listArticles();
        if (rows?.ok) setTaken(new Map(rows.articles.map((a) => [a.slug, a])));
      }
      toast(result.message);
    } finally {
      setBusy("");
    }
  }, [fields, topics, tied, taken, dynamic]);

  /* ---------- boot ---------- */

  const booted = useRef(false);
  useEffect(() => {
    if (booted.current) return;
    booted.current = true;

    (async () => {
      const { slug, file } = askedFor();

      /* A URL that names a piece is an instruction, and restoring
         the last draft over the top of it is not carrying it out.
         The two used to race: whichever of the draft store and the
         fetch answered second won, so the desk's Edit link opened
         the right piece about half the time. */
      if (!slug && !file) {
        const latest = await latestDraft();
        if (latest) loadDraft(latest);
      }

      if (!dynamic) return;

      const rows = await listArticles();
      if (rows?.ok) setTaken(new Map(rows.articles.map((a) => [a.slug, a])));

      // The Notion button only appears if the token is actually set,
      // so it never offers something that answers "not configured".
      notionStatus().then((r) => setHasNotion(Boolean(r?.ok && r.configured)));

      // How many people are waiting, without having to go and look.
      Promise.all([
        api<{ questions: unknown[] }>("questions?status=pending"),
        api<{ enquiries: { status: string }[] }>("enquiries"),
      ]).then(([q, e]) => {
        setWaiting(
          (q?.ok ? q.questions.length : 0)
          + (e?.ok ? e.enquiries.filter((row) => row.status === "new").length : 0)
        );
      });

      if (!slug && !file) return;

      // Drop it from the URL so a reload does not discard whatever
      // has been typed since by loading the article over the top.
      history.replaceState(null, "", location.pathname);

      if (slug) { void openArticle(slug); return; }
      /* `?file=<section>:<slug>` opened a committed page for
         import. Nothing is a file any more, so the honest answer
         is that there is nothing at that address rather than a
         blank editor. */
      if (file) toast("There are no pieces written as files any more.");
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamic]);

  /* ---------- what the editor is holding, said out loud ---------- */

  const nowLine = useMemo(() => {
    const bits: string[] = [];
    if (tied.slug) {
      const live = findSection(tied.section ?? "");
      const going = findSection(fields.section);
      bits.push(`editing ${pieceUrl(live, tied.slug)}`);
      // Say it plainly: publishing will change the address and the
      // old one stops answering the moment it does.
      if (going.id !== live.id) bits.push(`moving to ${pieceUrl(going, tied.slug)}`);
    } else {
      bits.push(`new piece for ${findSection(fields.section).en}`);
    }
    if (tied.notionPageId) bits.push("linked to Notion");
    return bits.join(" · ");
  }, [tied, fields.section]);

  return (
    <>
      <div className="hero">
        <Eyebrow>Article Studio · private tool</Eyebrow>
        <h1 style={{ fontSize: "clamp(1.9rem,4.4vw,2.8rem)" }}>
          Paste the article. Paste the photos. Publish.
        </h1>
        <p className="lede">
          Write wherever you like (Word, Google Docs, Notion, your notes app)
          then paste it here. Formatting gets cleaned up, photos get resized and
          re-encoded, and you get a finished page in the site&apos;s own styles.
          Nothing leaves this browser.
        </p>
      </div>

      {/* What you are working on, and how to get at everything else.
          It follows the page down: on a long article the way back to
          Open, New and the desk should not be a scroll away. */}
      <div className="studio-bar">
        <span className="bar-group">
          <Button id="btn-new" onClick={() => {
            setTied(blankTied());
            blank();
            toast("New article. The one you were on is under Open.");
          }}>＋ New</Button>
          <Button id="btn-open" onClick={() => setSheet("open")}>Open…</Button>
          {/* The other writing surface. A lesson is prose in the
              same editor and is reached from here rather than from
              the desk, because this page is where writing happens
              and a tool nobody can find is the failure the
              publishing checklist in CLAUDE.md is about. */}
          <ButtonLink id="btn-lessons" href="/studio/?lessons">
            The schools…
          </ButtonLink>
        </span>
        {/* The link to the old Studio is gone with the page:
            `studio.html` and `studio.js` are in `archive/` as of
            16 August 2026 and are not deployed. */}
        <span className="bar-group" id="notion-group">
          {hasNotion ? (
            <Button id="btn-notion" onClick={() => setSheet("notion")}>
              Import from Notion
            </Button>
          ) : null}
          {dynamic && tied.notionPageId ? (
            <Button id="btn-resync" onClick={() => {
              if (!confirm("Replace the article body with the current Notion page? "
                + "Anything typed here is lost.")) return;
              void importNotion(tied.notionPageId as string, true);
            }}>Re-sync from Notion</Button>
          ) : null}
        </span>
        {dynamic ? (
          <ButtonLink id="btn-admin" href="/admin">
            {waiting ? `The admin panel (${waiting}) →` : "The admin panel →"}
          </ButtonLink>
        ) : null}
        <span className="studio-now" id="now-line">{nowLine}</span>
      </div>

      <div className="studio-grid">
        <div className="studio-pane editor">
          <div className="pane-bar">
            <span className="mono">1 · The article</span>
            <span className="mono" id="draft-line" style={{ fontSize: "0.66rem" }}>{draftLine}</span>
          </div>

          <Fields
            fields={fields} setFields={setFields}
            topics={topics} setTopics={setTopics}
            known={known}
          />

          <Editor
            handle={ed}
            onChange={bump}
            lang={langRef}
            onSave={() => { void saveDraft(); toast("Draft saved on this device."); }}
            onPublish={() => { if (dynamic && !blocked && !busy) void send("live"); }}
          />
        </div>

        <Preview m={meta} view={view} setView={setView} />
      </div>

      <section>
        <SectionLabel>3 · Publish it</SectionLabel>

        <Preflight issues={issues} started={Boolean(meta.body.trim() || fields.title.trim())} />

        <div className="row-flex publish-row">
          {dynamic ? (
            <>
              <Button kind="solid" id="btn-publish"
                      disabled={blocked || Boolean(busy)}
                      onClick={() => void send("live")}>
                {busy || "Publish to the site"}
              </Button>
              <Button id="btn-save-draft"
                      disabled={blocked || Boolean(busy)}
                      onClick={() => void send("draft")}>Save draft to the site</Button>
            </>
          ) : null}
          {dynamic && tied.slug ? (
            <Button id="btn-view" onClick={() => {
              // Where it is, not where it is going: the picker may
              // already be showing the section it is about to move to.
              open(pieceUrl(findSection(tied.section ?? ""), tied.slug as string),
                "_blank", "noopener");
            }}>View it</Button>
          ) : null}
          <Button id="btn-clear" onClick={async () => {
            if (!confirm("Clear the editor and delete this draft? "
              + "Anything already published stays published.")) return;
            if (tied.draftId) await dropDraft(tied.draftId);
            blank();
            toast("Cleared");
          }}>Clear</Button>
          <Button className="push" id="btn-lock"
                  title="Lock the Studio on this device"
                  onClick={() => {
                    if (confirm("Lock the Studio? Your draft stays saved on this device.")) lock();
                  }}>Lock</Button>
        </div>

        {/* Publishing to the database is the only route out of the
            Studio now: the file tools it used to offer described a
            workflow that no longer exists (archive/TRANSITION.md, Stage 4).
            So the one case worth saying out loud is the one where
            that route is unavailable. */}
        {dynamic ? (
          <ol className="studio-steps measure" id="steps-dynamic">
            <li>Press <strong>Publish to the site</strong>. Photos are uploaded to{" "}
              <code>/media</code> first, so the article itself stays small and the
              same photo pasted twice is only stored once.</li>
            <li>That&apos;s it: the piece is live, the Insights page picks it up, and
              readers can react and ask questions on it straight away.</li>
            <li>Changed your mind? <strong>Open…</strong> loads anything back in to
              edit and republish, and <strong>Published</strong> on
              {" "}<a href="/admin">the admin panel</a> unpublishes with one click.</li>
          </ol>
        ) : (
          <p className="note measure" id="no-database">
            <strong>No database.</strong> This editor cannot publish
            without one. Anything you type is kept on this device and
            will still be here when the connection is back.
          </p>
        )}

        <div className="note measure">
          <strong>Photos.</strong> Every one is resized to 1600px on its long
          side and re-encoded as WebP, which also strips the location data
          phones bury in JPEGs.
          <br /><br />
          <strong>Publishing</strong> uploads them to <code>/media</code> and
          leaves a link in the article, so the piece itself stays a few
          kilobytes and the same photo used twice is stored once.
          <br /><br />
          <strong>Until you publish</strong> they stay embedded in the
          editor, which is why the weight meter climbs as you paste. It
          measures the article against the 1 MB the database accepts, and
          publishing is what brings it back down.
        </div>
      </section>

      {sheet === "open" ? (
        <OpenSheetLoader
          dynamic={dynamic}
          openDraftId={tied.draftId}
          onClose={() => setSheet(null)}
          onDraft={(d) => { loadDraft(d); setSheet(null); }}
          onArticle={openArticle}
          onTaken={setTaken}
        />
      ) : null}

      {sheet === "notion" ? (
        <NotionSheet onClose={() => setSheet(null)} onImport={(id) => void importNotion(id)} />
      ) : null}
    </>
  );
}

/** The Open sheet's three lists, fetched when it opens rather than
    held in the page: they are only ever looked at on purpose. */
function OpenSheetLoader({
  dynamic, openDraftId, onClose, onDraft, onArticle, onTaken,
}: {
  dynamic: boolean;
  openDraftId: string | null;
  onClose: () => void;
  onDraft: (draft: Draft) => void;
  onArticle: (slug: string) => void;
  onTaken: (taken: Map<string, Article>) => void;
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    const [rows, res] = await Promise.all([
      listDrafts(),
      dynamic ? listArticles() : Promise.resolve(null),
    ]);
    setDrafts(rows);
    const found = res?.ok ? res.articles : [];
    setArticles(found);
    onTaken(new Map(found.map((a) => [a.slug, a])));
    setLoading(false);
  }, [dynamic, onTaken]);

  useEffect(() => { void reload(); }, [reload]);

  return (
    <OpenSheet
      drafts={drafts} articles={articles}
      openDraftId={openDraftId} dynamic={dynamic} loading={loading}
      onClose={onClose}
      onDraft={onDraft}
      onDeleteDraft={async (draft) => {
        const title = draft.fields?.title?.trim() || "Untitled";
        if (!confirm(`Delete the draft "${title}"?`)) return;
        await dropDraft(draft.id);
        void reload();
      }}
      onArticle={onArticle}
    />
  );
}
