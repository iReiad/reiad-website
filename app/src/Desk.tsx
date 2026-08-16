/* ============================================================
   Desk.tsx: the six panels, and what is waiting behind them.

   Which panel you are looking at is kept in the URL hash, which
   the old desk did too and for the same reason: reloading after
   approving something should not send you back to the first tab,
   and a bookmark should be able to land on the queue.

   The tabs are real tabs. `aria-selected` rather than
   `aria-pressed`, each one naming the panel it controls, a roving
   tabindex, and the arrow, Home and End keys the role implies.
   That was right in the old desk and is the sort of thing a port
   loses quietly.
   ============================================================ */

import { useEffect, useState } from "react";
import { Comments } from "./Comments.tsx";
import { Questions } from "./Questions.tsx";
import { Enquiries } from "./Enquiries.tsx";
import { Subscribers } from "./Subscribers.tsx";
import { Stats } from "./Stats.tsx";
import { Published } from "./Published.tsx";
import { Overview, type Waiting } from "./Overview.tsx";
import { markSeen } from "./seen.ts";
import { listQuestions, listEnquiries, listSubscribers, readStats } from "./api.ts";

const PANELS = {
  queue: { label: "Questions", render: Questions },
  comments: { label: "Comments", render: Comments },
  enquiries: { label: "Enquiries", render: Enquiries },
  subscribers: { label: "Subscribers", render: Subscribers },
  stats: { label: "What's read", render: Stats },
  articles: { label: "Published", render: Published },
} as const;

type Key = keyof typeof PANELS;
const KEYS = Object.keys(PANELS) as Key[];

const fromHash = (): Key => {
  const k = location.hash.replace("#", "") as Key;
  return KEYS.includes(k) ? k : "queue";
};

export function Desk() {
  const [panel, setPanel] = useState<Key>(fromHash);
  const [waiting, setWaiting] = useState<Waiting | null>(null);

  useEffect(() => {
    const onHash = () => setPanel(fromHash());
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  /* Whatever was new this visit stops being new on the next one.
     On pagehide rather than on unload, because unload does not
     fire on a phone: closing the tab from the app switcher is the
     normal way to leave this page and never fired it once. */
  useEffect(() => {
    addEventListener("pagehide", markSeen);
    return () => removeEventListener("pagehide", markSeen);
  }, []);

  /* One round of counting, for the tiles and the tab badges both.
     Four requests, and they are the same four the panels behind
     them would each make on their own, so this is the cost of the
     overview rather than a duplicate of it. */
  useEffect(() => {
    let live = true;
    Promise.all([
      listQuestions("pending"),
      listEnquiries(),
      listSubscribers(),
      readStats(30),
    ]).then(([q, e, s, v]) => {
      if (!live) return;
      setWaiting({
        questions: q?.ok ? q.questions.length : 0,
        enquiries: e?.ok ? e.enquiries.filter((row) => row.status === "new").length : 0,
        subscribers: s?.ok ? Number(s.counts?.confirmed ?? 0) : 0,
        views: v?.ok ? Number(v.total ?? 0) : 0,
      });
    });
    return () => { live = false; };
  }, []);

  const show = (key: Key) => {
    setPanel(key);
    if (location.hash.slice(1) !== key) history.replaceState(null, "", `#${key}`);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const i = KEYS.indexOf(panel);
    const next =
      e.key === "ArrowRight" ? (i + 1) % KEYS.length
      : e.key === "ArrowLeft" ? (i - 1 + KEYS.length) % KEYS.length
      : e.key === "Home" ? 0
      : e.key === "End" ? KEYS.length - 1
      : -1;
    if (next < 0) return;
    e.preventDefault();
    show(KEYS[next]);
    document.getElementById(`desk-tab-${KEYS[next]}`)?.focus();
  };

  /* Only the two that mean a person is waiting for a reply, and
     only when the number is not zero. A badge reading nought is a
     worse thing than no badge. */
  const badge = (key: Key) =>
    key === "queue" ? waiting?.questions
    : key === "enquiries" ? waiting?.enquiries
    : 0;

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
        <a className="btn btn-ghost" href="/studio/index.html">← The Studio</a>
        {/* There is no link back to the old desk any more, because
            there is no old desk: `desk.html` and `desk.js` are in
            `archive/` as of 16 August 2026 and are not deployed.
            The rollback is a revert now rather than a click, which
            is the point at which a port stops being a trial. */}
        <span className="studio-now">React</span>
      </div>

      <Overview waiting={waiting} go={(key) => show(key as Key)} />

      {/* The tabs and the panel share one <section>, which is the
          shape the old desk had and is not cosmetic. `section` in
          the base layer carries this site's vertical rhythm:
          `padding-block: var(--step) 6px`, 68px of it. Making the
          panel its own section rather than the pair of them put
          those 68px BETWEEN the tab strip and the filters, so the
          panel looked detached from the tab that opened it. */}
      <section style={{ marginTop: "26px" }}>
      <div
        className="chip-row"
        role="tablist"
        aria-label="What the site collected"
        onKeyDown={onKey}
      >
        {KEYS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            id={`desk-tab-${key}`}
            aria-selected={String(key === panel) as "true" | "false"}
            aria-controls="desk-panel"
            tabIndex={key === panel ? 0 : -1}
            className="chip"
            onClick={() => show(key)}
          >
            {PANELS[key].label}
            {badge(key) ? <span className="tab-count">{badge(key)}</span> : null}
          </button>
        ))}
      </div>

      <div
        className="admin-panel"
        id="desk-panel"
        role="tabpanel"
        aria-labelledby={`desk-tab-${panel}`}
        tabIndex={0}
      >
        {/* Keyed on the panel, so switching tabs unmounts the old
            one rather than handing its state to the new one. Two
            panels here hold typed text, and a half-written answer
            reappearing inside a private note would be a real
            mistake, not a cosmetic one. */}
        <Panel key={panel} />
      </div>
      </section>

      <div className="note measure" style={{ marginTop: "30px" }}>
        <strong>Nothing here is a one-way door.</strong> Archiving, binning or
        marking something as spam only moves it: <em>Everything</em> shows all of
        it, and anything can go back to waiting. Only <em>Delete</em> removes
        something, and it asks first.
      </div>
    </>
  );
}
