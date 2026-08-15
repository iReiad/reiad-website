/* ============================================================
   Desk.tsx: the tabs, and what is behind them.

   The panel a reader is looking at is kept in the URL hash, which
   the old desk did too and for the same reason: reloading the page
   after approving something should not send you back to the first
   tab.
   ============================================================ */

import { useEffect, useState } from "react";
import { Comments } from "./Comments.tsx";
import { Questions } from "./Questions.tsx";
import { Published } from "./Published.tsx";

const PANELS = {
  queue: { label: "Questions", render: Questions },
  comments: { label: "Comments", render: Comments },
  articles: { label: "Published", render: Published },
} as const;

type Key = keyof typeof PANELS;
const KEYS = Object.keys(PANELS) as Key[];

const fromHash = (): Key => {
  const k = location.hash.replace("#", "") as Key;
  return KEYS.includes(k) ? k : "queue";
};

/** One line, gone after a moment. The site's own toast lives in
    app.js and is not importable as a module here, so this is the
    same idea rendered by the component that raised it. */
function Toast({ text }: { text: string | null }) {
  if (!text) return null;
  return <p className="admin-count mono" role="status" aria-live="polite">{text}</p>;
}

export function Desk() {
  const [panel, setPanel] = useState<Key>(fromHash);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const onHash = () => setPanel(fromHash());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const show = (key: Key) => {
    setPanel(key);
    history.replaceState(null, "", `#${key}`);
  };

  /* Real tabs: the roving tabindex and arrow keys the role implies,
     which the old desk got right and is worth not losing. */
  const onKey = (e: React.KeyboardEvent) => {
    const i = KEYS.indexOf(panel);
    if (e.key === "ArrowRight") show(KEYS[(i + 1) % KEYS.length]);
    else if (e.key === "ArrowLeft") show(KEYS[(i - 1 + KEYS.length) % KEYS.length]);
    else return;
    e.preventDefault();
  };

  const Panel = PANELS[panel].render;

  return (
    <>
      <div className="hero" style={{ paddingBlock: "52px 20px" }}>
        <span className="eyebrow mono">The desk · private</span>
        <h1 style={{ fontSize: "clamp(1.9rem,4.4vw,2.8rem)" }}>The site, answering back.</h1>
        <p className="lede">
          Everything readers have sent, and what they are actually reading.
          Nothing here is public, and nothing here can identify anyone.
        </p>
      </div>

      <div className="studio-bar">
        <a className="btn btn-ghost" href="/studio.html">← The Studio</a>
        <span className="studio-now">React · Stage 9</span>
      </div>

      <div
        className="chip-row"
        role="tablist"
        aria-label="What the site collected"
        onKeyDown={onKey}
        style={{ marginTop: "26px" }}
      >
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`tab-${key}`}
            aria-selected={String(key === panel) as "true" | "false"}
            aria-controls="desk-panel"
            tabIndex={key === panel ? 0 : -1}
            className="chip"
            onClick={() => show(key)}
          >
            {PANELS[key].label}
          </button>
        ))}
      </div>

      <section
        className="admin-panel"
        id="desk-panel"
        role="tabpanel"
        aria-labelledby={`tab-${panel}`}
        tabIndex={0}
        style={{ marginTop: "18px" }}
      >
        <Panel onToast={setToast} />
      </section>

      <Toast text={toast} />

      <div className="note measure" style={{ marginTop: "30px" }}>
        <strong>Nothing here is a one-way door.</strong> Binning or archiving
        only moves something: it can go back to waiting at any time. Only
        <em> Delete</em> removes anything, and it asks first.
      </div>
    </>
  );
}
