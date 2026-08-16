/* ============================================================
   Preview.tsx: what a reader actually meets.

   An article is not the only thing. Most readers meet the card on
   the Insights page, or the box that appears when somebody pastes
   the link into WhatsApp, and both of those decide whether the
   article gets opened at all. Neither was visible from anywhere
   before these three views existed.

   The article view is the one place on this site where React
   renders HTML it did not write, through `dangerouslySetInnerHTML`.
   That is not a shortcut: the body has been through `sanitize()`
   on the way in from the paste and again in `metaOf()` a moment
   ago, which is the same function the server runs before storing
   it. Parsing it into React elements instead would mean a third
   implementation of the article's vocabulary, which is exactly
   the thing the three-place rule in CLAUDE.md exists to prevent.
   Everything the writer typed is escaped by that sanitiser; every
   other string on this page is an ordinary React child.
   ============================================================ */

import { useMemo } from "react";
import { findSection } from "/content.js";
import { coverFor, type Meta } from "./piece.ts";

const WIDTHS: Record<string, string> = { phone: "390px", tablet: "768px", full: "100%" };
const FOCUS_POSITION: Record<string, string> = {
  top: "50% 0", bottom: "50% 100%", centre: "50% 50%",
};

export type ViewMode = "article" | "card" | "share";
export type ViewWidth = "phone" | "tablet" | "full";
export type ViewTheme = "auto" | "light" | "dark";

const dateLabelFor = (m: Meta) =>
  new Intl.DateTimeFormat(m.lang === "bn" ? "bn-BD" : "en-GB", {
    day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${m.date}T00:00:00Z`));

const clip = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/* ---------- the three views ---------- */

function ArticleView({ m }: { m: Meta }) {
  return (
    <article className="article">
      <span className="eyebrow mono">{m.tag}</span>
      <h1>{m.title}</h1>
      {m.dek ? <p className="lede">{m.dek}</p> : null}
      <p className="byline mono">
        <span>Rony Reiad</span><span className="dot" />
        <time>{dateLabelFor(m)}</time><span className="dot" />
        <span>{m.minutes} min read</span>
      </p>
      {m.body
        ? <div dangerouslySetInnerHTML={{ __html: m.body }} />
        : <p className="muted"><em>Your article will appear here as you paste it.</em></p>}
    </article>
  );
}

/* The same markup app.js builds for /insights.html, so what shows
   here is the card, not an impression of one. */
function CardView({ m }: { m: Meta }) {
  const sec = findSection(m.section);
  return (
    <div className="preview-frame">
      <span className="mono preview-caption">
        How it looks on {sec.id === "insights"
          ? "the Insights page and the home page"
          : `${sec.bn}, at ${sec.hub}`}
      </span>
      <div className="cards">
        <div className="cell sample-card">
          <span className="tag mono">{m.tag}</span>
          <h3>{m.title}</h3>
          <p>{m.dek || <em>No standfirst yet, so the card has nothing under the headline.</em>}</p>
          {m.topics.length ? (
            <span className="topic-tags">
              {m.topics.map((t) => <span className="topic-tag mono" key={t}>{t}</span>)}
            </span>
          ) : null}
          <span className="more">{dateLabelFor(m)} · {m.minutes} min read  →</span>
        </div>
      </div>
    </div>
  );
}

/* WhatsApp, LinkedIn, X and Slack all draw roughly this: the
   image, the domain, the title, the description. The truncation
   lengths are the conservative end of what they show. */
function ShareView({ m }: { m: Meta }) {
  const cover = useMemo(() => coverFor(m), [m]);
  return (
    <div className="preview-frame">
      <span className="mono preview-caption">What a pasted link looks like</span>
      <div className="share-card">
        <div className="share-image">
          <img src={cover.src} alt=""
               style={{ objectPosition: FOCUS_POSITION[cover.focus] ?? "50% 50%" }} />
        </div>
        <div className="share-text">
          <span className="mono share-host">reiad.co.uk</span>
          <strong>{clip(m.title, 60)}</strong>
          <p>{clip(m.dek, 160) || "No standfirst, so most apps show the URL here instead."}</p>
        </div>
      </div>
      <ul className="share-notes">
        <li>{m.title.length > 60
          ? `The headline is ${m.title.length} characters and will be cut around 60.`
          : `Headline fits: ${m.title.length} of about 60 characters.`}</li>
        <li>{m.dek.length > 160
          ? `The standfirst is ${m.dek.length} characters and will be cut around 160.`
          : `Standfirst fits: ${m.dek.length} of about 160 characters.`}</li>
        <li>{cover.own
          ? `Drawn from the ${cover.lead ? "lead photo" : "first photo, since none is marked Lead"}, `
            + `cropped to 1200×630 keeping the ${cover.focus}. `
            + "Click a photo in the editor to change which one, or which part."
          : "No photo in the piece, so the section's own card is used. "
            + "Add a photo and mark it Lead to put it here."}</li>
        <li>{cover.own
          ? "The card is drawn and uploaded as a JPEG when you publish: "
            + "WhatsApp, Facebook and LinkedIn will not read the WebP the article itself uses."
          : "Every section has its own card, so a piece without a photo still looks like itself."}</li>
      </ul>
    </div>
  );
}

/* ---------- the pane ---------- */

export function Preview({
  m, view, setView,
}: {
  m: Meta;
  view: { mode: ViewMode; width: ViewWidth; theme: ViewTheme };
  setView: (patch: Partial<{ mode: ViewMode; width: ViewWidth; theme: ViewTheme }>) => void;
}) {
  /* The weight meter measures what the server actually limits: the
     BODY, against the 1 MB cap in functions/api/articles. It used
     to measure a whole rendered page against 2 MB, which was the
     wrong number against the wrong limit and read comfortably
     while the real cap was already in sight. A photo still on a
     data: URL costs about 4/3 its bytes here, which is exactly why
     the meter is worth having until it has been uploaded. */
  const bytes = useMemo(() => new Blob([m.body ?? ""]).size, [m.body]);
  const kb = Math.round(bytes / 1024);
  const pct = Math.min(100, (bytes / (1024 * 1024)) * 100);
  const state = bytes > 2e6 ? "over" : bytes > 1e6 ? "warn" : "ok";

  /* A card and a share box have their own natural size;
     constraining them to a phone width would only be misleading. */
  const constrain = view.mode === "article" ? view.width : "full";

  const THEME_CYCLE: ViewTheme[] = ["auto", "light", "dark"];

  return (
    <div className="studio-pane">
      <div className="pane-bar">
        <span className="mono">2 · Live preview</span>
        <span className="studio-meter" id="meter" data-state={state}>
          <span className="bar"><i id="meter-bar" style={{ width: `${pct}%` }} /></span>
          <span id="meter-text">
            {kb > 1024 ? `${(kb / 1024).toFixed(1)} MB page` : `${kb} KB page`}
          </span>
        </span>
      </div>

      <div className="pane-bar preview-controls">
        <div className="chip-row seg" role="group" aria-label="What to preview">
          {(["article", "card", "share"] as ViewMode[]).map((mode) => (
            <button key={mode} type="button" className="chip"
                    data-view={mode}
                    aria-pressed={view.mode === mode}
                    onClick={() => setView({ mode })}>
              {mode === "article" ? "Article" : mode === "card" ? "Card" : "Share"}
            </button>
          ))}
        </div>
        <div className="chip-row seg" role="group" aria-label="Preview width">
          {(["phone", "tablet", "full"] as ViewWidth[]).map((width) => (
            <button key={width} type="button" className="chip"
                    data-width={width}
                    aria-pressed={view.width === width}
                    // Width is meaningless for the card and share views.
                    disabled={view.mode !== "article"}
                    onClick={() => setView({ width })}>
              {width === "phone" ? "Phone" : width === "tablet" ? "Tablet" : "Full"}
            </button>
          ))}
        </div>
        <button
          type="button" className="chip" id="preview-theme" aria-label="Preview theme"
          onClick={() => setView({
            theme: THEME_CYCLE[(THEME_CYCLE.indexOf(view.theme) + 1) % THEME_CYCLE.length],
          })}
        >Theme: {view.theme}</button>
      </div>

      {/* The site's theme switch is :root[data-theme], so it cannot
          be scoped. color-scheme can: it inherits, and the
          light-dark() in every token is resolved where the token is
          USED, which is inside here. */}
      <div className="preview-scroll" id="preview-scroll" data-preview-theme={view.theme}>
        <div id="preview-stage" data-width={constrain} style={{ maxWidth: WIDTHS[constrain] }}>
          <div id="preview" lang={m.lang}>
            {view.mode === "card" ? <CardView m={m} />
              : view.mode === "share" ? <ShareView m={m} />
              : <ArticleView m={m} />}
          </div>
        </div>
      </div>

      <div className="pane-bar" style={{ borderTop: "1px solid var(--hairline)", borderBottom: 0 }}>
        <span className="mono" id="stat-line">
          {m.words} word{m.words === 1 ? "" : "s"} · {m.minutes} min read
          {" · "}{m.photos} photo{m.photos === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}
