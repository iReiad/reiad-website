"use client";

/* ============================================================
   ui/tab-panels.tsx: a strip of choices where choosing one hides
   the rest.

   `ui/tabs.tsx` holds the two static shapes, `<TabBar>` and
   `<PageNav>`, and the argument for why they are two components
   rather than one with a `role` prop. This is the behaviour that
   makes a `<TabBar>` true: without something hiding the other
   panels, `role="tablist"` is a lie a screen reader acts on.

   The calculators have done this since they were written, in
   `aab/src/tools/tools.ts`, on markup a Worker rendered. This is
   the same four decisions as React, for pages whose panels are
   already components:

     · the panel is chosen from the FRAGMENT, so a link from the
       account menu or the palette opens that panel rather than
       scrolling to it, and `hashchange` keeps that true while the
       page is open.
     · the address is updated with `replaceState`, never by
       assigning `location.hash`, which would scroll the panel
       under the sticky bar on every press.
     · arrows, Home and End move within the strip, with a roving
       tabindex so the whole set is one tab stop.
     · NOTHING IS HIDDEN UNTIL THIS HAS RUN. The panels render
       open and the first effect closes them, so a reader with no
       JavaScript gets one long page rather than one section and
       seven buttons that do nothing. That is the same order
       `tools.ts` is careful about, and the reason hiding is never
       done in CSS alone.

   ---- the panels are the server's ----

   They arrive as a prop, already rendered. A client component's
   children are serialised into the payload rather than re-run
   here, so making the strip interactive does not make eight
   sections of markup the browser's job.
   ============================================================ */

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

export interface Panel {
  /** The fragment, and what the account menu links to. */
  id: string;
  label: string;
  node: ReactNode;
}

export function TabPanels({ label, panels, className }: {
  label: string;
  panels: Panel[];
  /** The column the strip and its panels share. The caller's
      decision rather than this component's: what a page's measure
      is belongs to the page. */
  className?: string;
}) {
  const [at, setAt] = useState<string | null>(null);
  const bar = useRef<HTMLDivElement>(null);

  const has = useCallback(
    (id: string) => panels.some((p) => p.id === id),
    [panels],
  );

  useEffect(() => {
    const fromHash = () => {
      const want = decodeURIComponent(location.hash.slice(1));
      setAt(has(want) ? want : panels[0]?.id ?? null);
    };
    fromHash();
    /* A link from the account menu, the palette or anywhere else
       on the site picks the panel rather than scrolling to it. */
    addEventListener("hashchange", fromHash);
    return () => removeEventListener("hashchange", fromHash);
  }, [has, panels]);

  const go = useCallback((id: string, focus = false) => {
    setAt(id);
    if (location.hash.slice(1) !== id) {
      history.replaceState(null, "", `${location.pathname}${location.search}#${id}`);
    }
    if (focus) {
      bar.current?.querySelector<HTMLAnchorElement>(`[href="#${CSS.escape(id)}"]`)?.focus();
    }
  }, []);

  const onKey = (e: React.KeyboardEvent) => {
    const i = panels.findIndex((p) => p.id === at);
    const last = panels.length - 1;
    const to =
      e.key === "ArrowRight" || e.key === "ArrowDown" ? (i >= last ? 0 : i + 1)
      : e.key === "ArrowLeft" || e.key === "ArrowUp" ? (i <= 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (to === null) return;
    e.preventDefault();
    go(panels[to].id, true);
  };

  /* Before the first effect: every panel open, and the strip is
     eight ordinary links to eight fragments. That is the page a
     reader with no JavaScript gets, and it is the page this one
     was until the strip started hiding things. */
  const on = at !== null;

  return (
    /* The strip and what it switches share one column, so the bar
       floats over the content it belongs to rather than spanning
       the window. `data-panels` is what tells the stylesheet a
       section here is the only one on screen, so it drops the
       leading that separates sections on a long page: set only
       once this has run, like every other part of the switch. */
    <div className={className} data-panels={on ? "on" : undefined}>
      <div ref={bar} className="tabs tabs-nav" data-sticky=""
           role={on ? "tablist" : undefined}
           aria-label={label} onKeyDown={onKey}>
        {panels.map((panel) => {
          const here = on && panel.id === at;
          return (
            <a key={panel.id} className="tab" href={`#${panel.id}`}
               id={`tab-${panel.id}`}
               role={on ? "tab" : undefined}
               aria-selected={on ? here : undefined}
               aria-controls={on ? `panel-${panel.id}` : undefined}
               tabIndex={on && !here ? -1 : 0}
               onClick={(e) => {
                 if (e.metaKey || e.ctrlKey || e.shiftKey) return;
                 e.preventDefault();
                 go(panel.id);
               }}>
              <span className="tab-en">{panel.label}</span>
            </a>
          );
        })}
      </div>

      {panels.map((panel) => (
        /* The wrapper carries the panel role, under its OWN id.
           The section inside keeps `id={panel.id}`, which is what
           the account menu links to and what `:target` answers,
           and two elements cannot share one id. */
        <div key={panel.id} id={`panel-${panel.id}`}
             hidden={on && panel.id !== at}
             role={on ? "tabpanel" : undefined}
             aria-labelledby={on ? `tab-${panel.id}` : undefined}>
          {panel.node}
        </div>
      ))}
    </div>
  );
}
