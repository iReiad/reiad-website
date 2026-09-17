/* ============================================================
   netzwerk-store.ts: what the study planner keeps in a browser.

   `shared/netzwerk.ts` is the book and the arithmetic; this is the
   half that touches a device. One key, `netzwerk-plan`, holding
   every learner on this device by id, each stamped, which is the
   shape `aab/src/sync.ts` carries as a `merge`: two devices editing
   two learners reconcile, and the newer copy of one learner wins.

   Which learner a tab had open is `sessionStorage`, because two
   people share one device here and that choice is the tab's rather
   than either account's. Both keys are rows in `shared/storage.ts`.
   ============================================================ */

import {
  newLearner, type Learner, type Route,
} from "@reiad/shared/netzwerk";

export const NETZWERK_KEY = "netzwerk-plan";
const ACTIVE_KEY = "netzwerk-active";
const EVENT = "netzwerk:changed";

type Stored = Record<string, Learner | number | undefined> & { ts?: number };

const isLearner = (v: unknown): v is Learner =>
  typeof v === "object" && v !== null
  && typeof (v as Learner).id === "string"
  && typeof (v as Learner).name === "string"
  && typeof (v as Learner).start === "string";

/** The raw string, for `useSyncExternalStore`: a snapshot has to
    be stable by identity between reads, and a parsed object would
    be new every time. */
export function rawPlans(): string {
  try { return localStorage.getItem(NETZWERK_KEY) ?? ""; } catch { return ""; }
}

/** Every learner on this device, in the order they were made. */
export function parsePlans(raw: string): Learner[] {
  if (!raw) return [];
  try {
    const held = JSON.parse(raw) as Stored;
    if (!held || typeof held !== "object") return [];
    return Object.values(held)
      .filter(isLearner)
      .map(fill)
      .sort((a, b) => (a.made ?? 0) - (b.made ?? 0));
  } catch {
    return [];
  }
}

/** A learner written by an older build may be missing a field
    this one reads, so the defaults are filled on read rather than
    trusted. `made` is when they were created and orders the list;
    it was not in the first shape, so an old learner sorts first. */
function fill(l: Learner): Learner & { made?: number } {
  const fresh = newLearner(l.id, l.name, l.route, l.start);
  return {
    ...fresh, ...l,
    settings: { ...fresh.settings, ...(l.settings ?? {}) },
    weeks: l.weeks ?? {},
    chapters: l.chapters ?? {},
    log: Array.isArray(l.log) ? l.log : [],
    practice: l.practice ?? {},
  };
}

function writeAll(learners: Learner[]): void {
  const held: Stored = { ts: Date.now() };
  for (const l of learners) held[l.id] = l;
  try {
    localStorage.setItem(NETZWERK_KEY, JSON.stringify(held));
  } catch {
    /* Storage off or full: the page still works for this visit. */
  }
  announce();
}

/** Write one learner, stamped. */
export function saveLearner(learner: Learner): void {
  const all = parsePlans(rawPlans()).filter((l) => l.id !== learner.id);
  all.push({ ...learner, ts: Date.now() });
  writeAll(all);
}

export function removeLearner(id: string): void {
  writeAll(parsePlans(rawPlans()).filter((l) => l.id !== id));
}

export function addLearner(name: string, route: Route, start: string): Learner {
  const learner = { ...newLearner(uid(), name, route, start), made: Date.now() } as Learner;
  saveLearner(learner);
  return learner;
}

/** The learner this tab had open. */
export function activeId(): string | null {
  try { return sessionStorage.getItem(ACTIVE_KEY); } catch { return null; }
}

export function setActive(id: string): void {
  try { sessionStorage.setItem(ACTIVE_KEY, id); } catch { /* the choice holds for this page */ }
  announce();
}

function announce(): void {
  try { window.dispatchEvent(new Event(EVENT)); } catch { /* SSR */ }
}

/** Three things change the plans under a page: this tab, another
    tab, and the account's exchange writing rows straight into
    storage, which fires neither of the other two. */
export function subscribe(fn: () => void): () => void {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  document.addEventListener("sync:done", fn);
  return () => {
    window.removeEventListener(EVENT, fn);
    window.removeEventListener("storage", fn);
    document.removeEventListener("sync:done", fn);
  };
}

export const uid = (): string =>
  `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;

/* ---------- the colours the planner draws with ----------

   Here rather than in a component, for the reason
   `lib/diet-pages.ts` gives: a component reads `--accent` and never
   names a colour, and `check-components.ts` fails one that does.
   A level is a thing a reader tells apart by colour across every
   panel, so each has one of the site's seven. */

export const LEVEL_TONE: Record<string, string> = {
  A1: "var(--teal)",
  A2: "var(--green)",
  B1: "var(--blue)",
  B2: "var(--violet)",
  bridge: "var(--gold)",
};

/** The colour for a plan week's level string, which on Route B
    reads "Bridge (A1)" for eight weeks. */
export const toneOf = (level: string): string =>
  level.startsWith("Bridge") ? LEVEL_TONE.bridge : (LEVEL_TONE[level] ?? "var(--accent)");
