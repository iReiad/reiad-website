/* Work-Alpha engine. One function, mount(root, plan, storage), draws the
   whole app from plan.json and a state object.

   PLAIN DOM ON PURPOSE. The detail sheet, the editable grids and the timer
   all mutate the document, and a React render of the same tree would put
   the server's markup back over every keystroke. `mount.tsx` owns the
   host element and hands it in; nothing here looks a page up. */

import { cue } from "../../lib/sound";

/* ---------- the plan ---------- */

export type TrackId = "A" | "B";

export type TaskKind = "setup" | "think" | "read" | "write" | "data" | "people" | "review";

export interface Track {
  name: string;
  short: string;
  question: string;
  data: string;
  venues: string[];
  seeds: string[];
  supervisorHunt: string;
}

export interface Goal {
  id: string;
  name: string;
  day: number;
  color: string;
  test: string;
}

export interface Ritual {
  minutes: number;
  title: string;
  steps: string[];
}

export interface Task {
  id: string;
  minutes: number;
  kind: TaskKind;
  title: string;
  why: string;
  steps: string[];
  prompt: string;
  output: string;
  done: string;
}

export interface Day {
  n: number;
  date: string;
  theme: string;
  goal: string;
  tasks: Task[];
}

export interface Prompt {
  id: string;
  name: string;
  when: string;
  text: string;
}

export interface Plan {
  name: string;
  subtitle: string;
  start: string;
  hoursPerWeek: number;
  workDays: string[];
  endGoal: string;
  tracks: Record<TrackId, Track>;
  goals: Goal[];
  rituals: { open: Ritual; close: Ritual };
  days: Day[];
  prompts: Prompt[];
  templates: { paperNote: string; log: string };
  decisionCriteria: string[];
  looseEnds: string[];
  gapColumns: string[];
  supervisorColumns: string[];
  venueColumns: string[];
  dataColumns: string[];
}

/** A task with the day it belongs to folded in. */
export type PlannedTask = Task & { day: number; date: string; goal: string };

/* ---------- the state ---------- */

export type Cell = string | number | boolean | undefined;
export type GridRow = Record<string, Cell>;

export interface LibraryRow extends GridRow {
  id: string;
  title: string;
  track: TrackId;
  verified: boolean;
  notfound: boolean;
  order: string;
  note: string;
  noteDone: boolean;
}

export interface VenueRow extends GridRow {
  track: TrackId;
  journal: string;
}

export interface DeadlineRow extends GridRow {
  name?: string;
  institution?: string;
  opens?: string;
  date?: string;
  needs?: string;
}

export type LogField = "time" | "did" | "learned" | "blocked" | "next";

export interface WorkAlphaState {
  version: number;
  track: TrackId | "both";
  decision: { scores: Record<TrackId, number[]>; reason: string };
  /** Task id to the ISO time it was ticked. */
  done: Record<string, string>;
  /** Task id to minutes on the clock. */
  spent: Record<string, number>;
  timer: { taskId: string; startedAt: number } | null;
  goalsMet: Record<string, string>;
  logs: Record<string, Partial<Record<LogField, string>>>;
  library: LibraryRow[];
  venues: VenueRow[];
  gap: { rows: GridRow[]; sentence: string };
  data: { files: GridRow[]; figures: string; tables: string };
  people: {
    supervisors: GridRow[];
    constraints: GridRow[];
    looseEnds: GridRow[];
    deadlines: DeadlineRow[];
    emails: GridRow[];
  };
  review: { first: string; objections: string[]; second: string };
  monthReview: { hours: string; goals: string; lessons: string; m2goal: string; m2days: string };
  settings: { repo: string; name: string };
  /** Stamped by the storage on every save, so two copies of the
      state can say which is newer. */
  updated_at?: string;
}

export interface Storage {
  load(): Promise<Partial<WorkAlphaState> | null>;
  save(state: WorkAlphaState): Promise<void>;
}

export interface Mounted {
  getState(): WorkAlphaState;
  setPage(page: PageId): void;
}

const DAY_MS = 86400000;
const KINDS: Record<TaskKind, string> = {
  setup: "Set up", think: "Think", read: "Read", write: "Write",
  data: "Data", people: "People", review: "Review",
};

const supervisorRow = (): GridRow => ({
  name: "", institution: "", country: "", pillar: "", papers: "", grant: "",
  data: "", constraint: "", rank: "", contact: "", why: "",
});

export function freshState(plan: Plan): WorkAlphaState {
  const tr = plan.tracks;
  const seeds = (track: TrackId): LibraryRow[] => tr[track].seeds.map((s, i) => ({
    id: track + i, title: s, track, verified: false, notfound: false,
    order: "", note: "", noteDone: false,
  }));
  const venues = (track: TrackId): VenueRow[] => tr[track].venues.map((v) => ({
    track, journal: v, oa: "", length: "", latest: "", rank: "", regular: false, alert: false,
  }));
  return {
    version: 1,
    track: "A",
    decision: { scores: { A: [0, 0, 0, 0, 0, 0], B: [0, 0, 0, 0, 0, 0] }, reason: "" },
    done: {}, spent: {}, timer: null, goalsMet: {},
    logs: {},
    library: [...seeds("A"), ...seeds("B")],
    venues: [...venues("A"), ...venues("B")],
    gap: { rows: [], sentence: "" },
    data: { files: [], figures: "", tables: "" },
    people: {
      supervisors: Array.from({ length: 15 }, supervisorRow),
      constraints: [],
      looseEnds: plan.looseEnds.map((l) => ({ item: l, status: "", note: "" })),
      deadlines: [],
      emails: [],
    },
    review: { first: "", objections: ["", "", ""], second: "" },
    monthReview: { hours: "", goals: "", lessons: "", m2goal: "", m2days: "" },
    settings: { repo: "", name: "" },
  };
}

/** A saved state over a fresh one. The nested objects are merged a
    level down so a field added to the plan later is not lost to a
    save made before it existed. */
export function merge(base: WorkAlphaState, saved: unknown): WorkAlphaState {
  if (!saved || typeof saved !== "object") return base;
  const s = saved as Partial<WorkAlphaState>;
  return {
    ...base,
    ...s,
    decision: { ...base.decision, ...s.decision },
    gap: { ...base.gap, ...s.gap },
    data: { ...base.data, ...s.data },
    people: { ...base.people, ...s.people },
    review: { ...base.review, ...s.review },
    monthReview: { ...base.monthReview, ...s.monthReview },
    settings: { ...base.settings, ...s.settings },
  };
}

/* ---------- helpers ---------- */

type Kid = Node | string | number | null | false | undefined | Kid[];
type Attrs = Record<string, unknown>;

function h<K extends keyof HTMLElementTagNameMap>(
  tag: K, attrs?: Attrs | null, ...kids: Kid[]
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") el.className = String(v);
      else if (k === "style") el.style.cssText = String(v);
      else if (k.startsWith("on") && typeof v === "function") {
        el.addEventListener(k.slice(2), v as EventListener);
      } else if (k === "html") el.innerHTML = String(v);
      else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : String(v));
    }
  }
  const add = (kid: Kid): void => {
    if (kid == null || kid === false) return;
    if (Array.isArray(kid)) { kid.forEach(add); return; }
    el.appendChild(typeof kid === "object" ? kid : document.createTextNode(String(kid)));
  };
  kids.forEach(add);
  return el;
}

const field = (e: Event): HTMLInputElement | HTMLTextAreaElement =>
  e.target as HTMLInputElement | HTMLTextAreaElement;
const box = (e: Event): HTMLInputElement => e.target as HTMLInputElement;
/** A cell as text. A tick is a checkbox, never words. */
const text = (v: Cell): string => (v == null || typeof v === "boolean" ? "" : String(v));

const dateOf = (s: string): Date => new Date(s + "T00:00:00");
const iso = (d: Date): string => d.toISOString().slice(0, 10);
const fmt = (s: string): string =>
  dateOf(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const fmtLong = (s: string): string =>
  dateOf(s).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
const mins = (m: number): string =>
  m >= 60 ? Math.floor(m / 60) + "h" + (m % 60 ? " " + (m % 60) + "m" : "") : m + "m";
const clamp = (x: number, a: number, b: number): number => Math.min(b, Math.max(a, x));
const todayIso = (): string =>
  iso(new Date(Date.now() - new Date().getTimezoneOffset() * 60000));

const PAGES = [
  ["dashboard", "Dashboard"], ["plan", "Plan"], ["goals", "Goals"], ["library", "Library"],
  ["gap", "Gap"], ["data", "Data"], ["people", "People"], ["prompts", "Prompts"],
  ["log", "Log"], ["decide", "Decide"], ["review", "Review"], ["settings", "Settings"],
] as const;

export type PageId = (typeof PAGES)[number][0];

interface Col {
  key: string;
  label: string;
  type?: "check" | "select" | "date" | "long" | "text";
  options?: string[];
  readonly?: boolean;
  template?: string;
}

interface GridOpts<R extends GridRow> {
  canAdd?: boolean;
  canDelete?: boolean;
  blank?: () => R;
  rowClass?: (row: R) => string;
}

/* ---------- mount ---------- */

export function mount(root: HTMLElement, plan: Plan, storage: Storage): Promise<Mounted> {
  let state = freshState(plan);
  let page: PageId = "dashboard";
  let saveTimer: ReturnType<typeof setTimeout> | undefined;
  const planned = (d: Day, t: Task): PlannedTask => ({ ...t, day: d.n, date: d.date, goal: d.goal });
  const allTasks: PlannedTask[] = plan.days.flatMap((d) => d.tasks.map((t) => planned(d, t)));
  const goalById: Record<string, Goal> = Object.fromEntries(plan.goals.map((g) => [g.id, g]));

  root.classList.add("wa");
  root.innerHTML = "";

  const shell = {
    head: h("header", { class: "wa-head" }),
    track: h("section", { class: "wa-track" }),
    tabs: h("nav", { class: "wa-tabs", role: "tablist" }),
    main: h("main", { class: "wa-main" }),
    modal: h("div", { class: "wa-modal", hidden: true }),
  };
  for (const part of [shell.head, shell.track, shell.tabs, shell.main, shell.modal]) root.appendChild(part);

  function save(): void {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => { storage.save(state).catch(() => {}); }, 250);
  }
  function set(fn: (s: WorkAlphaState) => void): void { fn(state); save(); render(); }

  /* ---------- derived ---------- */

  const activeTracks = (): TrackId[] => (state.track === "both" ? ["A", "B"] : [state.track]);
  const primary = (): TrackId => (state.track === "both" ? "A" : state.track);
  const taskMinutes = (t: Task): number => state.spent[t.id] || 0;
  const isDone = (t: Task): boolean => Boolean(state.done[t.id]);
  const plannedTotal = allTasks.reduce((s, t) => s + t.minutes, 0)
    + plan.days.length * (plan.rituals.open.minutes + plan.rituals.close.minutes);
  const doneMinutes = (): number => allTasks.filter(isDone).reduce((s, t) => s + t.minutes, 0);
  const loggedMinutes = (): number => Object.values(state.spent).reduce((a, b) => a + b, 0);
  const dayProgress = (d: Day): number => d.tasks.filter(isDone).length / d.tasks.length;
  const goalProgress = (g: Goal): number => {
    const ts = allTasks.filter((t) => t.goal === g.id);
    return ts.length ? ts.filter(isDone).length / ts.length : 0;
  };
  const currentDay = (): Day => {
    const today = todayIso();
    return plan.days.find((d) => d.date === today)
      || plan.days.find((d) => d.date >= today)
      || plan.days[plan.days.length - 1];
  };
  const dated = (d: DeadlineRow): d is DeadlineRow & { date: string } => Boolean(d.date);
  const nextDeadline = (): (DeadlineRow & { date: string }) | null => {
    const t = todayIso();
    const ds = state.people.deadlines.filter(dated).filter((d) => d.date >= t)
      .sort((a, b) => a.date.localeCompare(b.date));
    return ds[0] || null;
  };
  const minutesByDate = (): Record<string, number> => {
    const m: Record<string, number> = {};
    for (const t of allTasks) {
      const when = state.done[t.id] ? state.done[t.id].slice(0, 10) : null;
      if (when) m[when] = (m[when] || 0) + (state.spent[t.id] || t.minutes);
    }
    for (const [d, l] of Object.entries(state.logs)) {
      const n = parseInt(l.time ?? "", 10);
      if (n && !m[d]) m[d] = n;
    }
    return m;
  };

  /* ---------- timer ---------- */

  let timerInterval: ReturnType<typeof setInterval> | undefined;
  function startTimer(t: Task): void {
    if (state.timer && state.timer.taskId !== t.id) stopTimer();
    state.timer = { taskId: t.id, startedAt: Date.now() };
    save();
    runTimer();
  }
  function stopTimer(): void {
    if (!state.timer) return;
    const elapsed = Math.round((Date.now() - state.timer.startedAt) / 60000);
    state.spent[state.timer.taskId] = (state.spent[state.timer.taskId] || 0) + elapsed;
    state.timer = null;
    clearInterval(timerInterval);
    document.title = plan.name;
    save();
  }
  function runTimer(): void {
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      if (!state.timer) { clearInterval(timerInterval); return; }
      const t = allTasks.find((x) => x.id === state.timer?.taskId);
      if (!t) return;
      const el = Math.round((Date.now() - state.timer.startedAt) / 60000);
      const left = t.minutes - (state.spent[t.id] || 0) - el;
      document.title = (left >= 0 ? left + "m left" : Math.abs(left) + "m over") + " · " + t.title;
      const pill = root.querySelector("[data-timer-pill]");
      if (pill) {
        pill.textContent = (left >= 0 ? left + " min left" : Math.abs(left) + " min over") + ": " + t.title;
      }
    }, 15000);
  }

  /* ---------- head, track, tabs ---------- */

  function renderHead(): void {
    const pct = Math.round((doneMinutes() / plannedTotal) * 100);
    const day = currentDay();
    const dl = nextDeadline();
    const daysTo = dl ? Math.ceil((dateOf(dl.date).getTime() - dateOf(todayIso()).getTime()) / DAY_MS) : null;
    shell.head.replaceChildren(
      h("div", { class: "wa-head-l" },
        h("div", { class: "wa-kicker" }, plan.subtitle),
        h("h1", { class: "wa-title" }, plan.name),
        h("p", { class: "wa-goal" }, plan.endGoal)),
      h("div", { class: "wa-head-r" },
        ring(pct, 96, "var(--accent)", "of the month",
          Math.round(doneMinutes() / 60) + "h / " + Math.round(plannedTotal / 60) + "h"),
        h("div", { class: "wa-head-facts" },
          h("div", { class: "wa-fact" },
            h("b", null, "Day " + day.n + " of " + plan.days.length),
            h("span", null, fmt(day.date) + ": " + day.theme)),
          h("div", { class: "wa-fact" },
            h("b", null, activeTracks().map((k) => plan.tracks[k].short).join(" + ")),
            h("span", null, state.decision.reason
              ? state.decision.reason.split("\n")[0]
              : "Track not decided yet (Day 1, task 3)")),
          h("div", { class: "wa-fact" },
            h("b", null, dl ? daysTo + " days" : "No deadline yet"),
            h("span", null, dl ? "to " + dl.name : "Add one on the People page")),
          state.timer
            ? h("div", { class: "wa-fact wa-fact-timer", "data-timer-pill": true }, "Timer running")
            : null)));
  }

  function ring(pct: number, size: number, color: string, label: string, sub?: string): HTMLDivElement {
    const r = size / 2 - 7;
    const c = 2 * Math.PI * r;
    const svg = h("div", { class: "wa-ring", style: "width:" + size + "px;height:" + size + "px" });
    svg.innerHTML =
      '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '">'
      + '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="wa-ring-track"/>'
      /* STYLE, never the `stroke` attribute: a presentation attribute is
         not parsed as CSS, so `stroke="var(--green)"` paints nothing at
         all. Every colour here is a token now, so it has to be a
         declaration. */
      + '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="wa-ring-fill" style="stroke:'
      + color + '" stroke-dasharray="' + c + '" stroke-dashoffset="'
      + c * (1 - clamp(pct, 0, 100) / 100) + '"/>'
      + "</svg>";
    svg.appendChild(h("div", { class: "wa-ring-txt" }, h("b", null, pct + "%"), h("small", null, label)));
    if (sub) svg.appendChild(h("div", { class: "wa-ring-sub" }, sub));
    return svg;
  }

  function renderTrack(): void {
    const total = plan.days.length;
    const complete = plan.days.filter((d) => dayProgress(d) === 1).length;
    shell.track.replaceChildren(
      h("div", { class: "wa-track-rail" },
        h("div", { class: "wa-track-fill", style: "width:" + Math.round((complete / total) * 100) + "%" }),
        plan.goals.map((g) => {
          const met = Boolean(state.goalsMet[g.id]);
          const p = goalProgress(g);
          const left = ((g.day - 0.5) / total) * 100;
          return h("button", {
            class: "wa-flag" + (met ? " is-met" : p > 0 ? " is-live" : ""),
            style: "left:" + left + "%;--c:" + g.color,
            title: g.test,
            onclick: () => {
              page = "goals";
              render();
              document.getElementById("goal-" + g.id)?.scrollIntoView({ behavior: "smooth" });
            },
          },
          h("span", { class: "wa-flag-pole" }),
          h("span", { class: "wa-flag-cloth" }, g.id),
          h("span", { class: "wa-flag-name" }, g.name),
          h("span", { class: "wa-flag-bar" }, h("i", { style: "width:" + Math.round(p * 100) + "%" })));
        })));
  }

  function renderTabs(): void {
    shell.tabs.replaceChildren(...PAGES.map(([id, name]) =>
      h("button", {
        class: "wa-tab" + (page === id ? " is-on" : ""),
        role: "tab",
        "aria-selected": page === id,
        onclick: () => { page = id; render(); },
      }, name)));
  }

  function renderMain(): void {
    shell.main.replaceChildren(pages[page]());
    shell.main.classList.remove("wa-enter");
    void shell.main.offsetWidth;
    shell.main.classList.add("wa-enter");
  }

  /* ---------- dashboard ---------- */

  const stat = (k: string, v: string | number): HTMLDivElement =>
    h("div", { class: "wa-stat" }, h("span", null, k), h("b", null, v));

  function dashboard(): HTMLElement {
    const day = currentDay();
    const m = minutesByDate();
    const kinds: Partial<Record<TaskKind, { planned: number; done: number }>> = {};
    for (const t of allTasks) {
      const k = kinds[t.kind] ?? (kinds[t.kind] = { planned: 0, done: 0 });
      k.planned += t.minutes;
      if (isDone(t)) k.done += t.minutes;
    }
    const dayMinutes = day.tasks.reduce((s, t) => s + t.minutes, 0)
      + plan.rituals.open.minutes + plan.rituals.close.minutes;
    return h("div", { class: "wa-grid wa-dash" },
      h("section", { class: "wa-card wa-span2" },
        h("h2", null, "Today: " + fmtLong(day.date)),
        h("p", { class: "wa-muted" }, "Day " + day.n + ", " + day.theme + ". Goal " + day.goal + ": "
          + goalById[day.goal].name + ". Planned " + mins(dayMinutes) + "."),
        ritualRow(plan.rituals.open, day, "open"),
        day.tasks.map((t) => taskRow(planned(day, t))),
        ritualRow(plan.rituals.close, day, "close")),
      h("section", { class: "wa-card" },
        h("h2", null, "Heatmap"),
        h("p", { class: "wa-muted" }, "Minutes of finished work per day. Planned days carry a ring."),
        heatmap(m)),
      h("section", { class: "wa-card" },
        h("h2", null, "Where the hours go"),
        (Object.entries(kinds) as Array<[TaskKind, { planned: number; done: number }]>)
          .map(([k, v]) => h("div", { class: "wa-bar" },
            h("span", null, KINDS[k]),
            h("i", { class: "wa-bar-track" },
              h("b", { style: "width:" + Math.round((v.done / v.planned) * 100) + "%;background:var(--k-" + k + ")" })),
            h("small", null, mins(v.done) + " / " + mins(v.planned))))),
      h("section", { class: "wa-card" },
        h("h2", null, "The gap sentence"),
        h("p", { class: state.gap.sentence ? "wa-big" : "wa-muted" },
          state.gap.sentence || "Appears here after Day 4, task 6.")),
      h("section", { class: "wa-card" },
        h("h2", null, "Goals"),
        plan.goals.map((g) => h("div", { class: "wa-bar" },
          h("span", { style: "color:" + g.color }, g.id + " " + g.name),
          h("i", { class: "wa-bar-track" },
            h("b", { style: "width:" + Math.round(goalProgress(g) * 100) + "%;background:" + g.color })),
          h("small", null, state.goalsMet[g.id] ? "met" : "day " + g.day)))),
      h("section", { class: "wa-card" },
        h("h2", null, "Numbers"),
        stat("Papers verified", state.library.filter((r) => r.verified).length + " / 15"),
        stat("Notes done", state.library.filter((r) => r.noteDone).length + " / 10"),
        stat("Supervisors named", state.people.supervisors.filter((r) => r.name).length + " / 15"),
        stat("Deadlines dated", state.people.deadlines.filter((d) => d.date).length),
        stat("Hours on the clock", Math.round(loggedMinutes() / 60 * 10) / 10),
        stat("Days logged", Object.keys(state.logs).length + " / " + plan.days.length)));
  }

  function heatmap(m: Record<string, number>): HTMLDivElement {
    const start = dateOf(plan.start);
    /* The Saturday before the start, because the work days are the weekend. */
    const first = new Date(start.getTime() - ((start.getDay() + 1) % 7) * DAY_MS);
    const weeks = 6;
    const plannedDays = new Set(plan.days.map((d) => d.date));
    const max = Math.max(60, ...Object.values(m));
    const grid = h("div", { class: "wa-heat" });
    for (const n of ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"]) {
      grid.appendChild(h("span", { class: "wa-heat-lbl" }, n));
    }
    for (let w = 0; w < weeks; w++) {
      for (let d = 0; d < 7; d++) {
        const dt = new Date(first.getTime() + (w * 7 + d) * DAY_MS);
        const k = iso(dt);
        const v = m[k] || 0;
        const cell = h("span", {
          class: "wa-heat-cell" + (plannedDays.has(k) ? " is-planned" : "") + (k === todayIso() ? " is-today" : ""),
          title: fmt(k) + ": " + mins(v),
          style: "--v:" + (v / max).toFixed(2),
        });
        cell.appendChild(h("i", null, dt.getDate() === 1
          ? dt.toLocaleDateString("en-GB", { month: "short" })
          : dt.getDate()));
        grid.appendChild(cell);
      }
    }
    return grid;
  }

  function ritualRow(r: Ritual, day: Day, which: "open" | "close"): HTMLDivElement {
    const id = "r-" + which + "-" + day.n;
    const done = Boolean(state.done[id]);
    return h("div", { class: "wa-task wa-ritual" + (done ? " is-done" : "") },
      h("button", { class: "wa-check", "aria-label": "Mark done", onclick: () => toggle(id, r.minutes) }),
      h("div", { class: "wa-task-body", onclick: () => openRitual(r) },
        h("b", null, r.title),
        h("span", { class: "wa-task-meta" }, mins(r.minutes) + " · ritual")));
  }

  function taskRow(t: PlannedTask): HTMLDivElement {
    const done = isDone(t);
    const running = state.timer?.taskId === t.id;
    const spent = taskMinutes(t);
    return h("div", {
      class: "wa-task" + (done ? " is-done" : "") + (running ? " is-running" : ""),
      style: "--k:var(--k-" + t.kind + ")",
    },
    h("button", { class: "wa-check", "aria-label": "Mark done", onclick: () => toggle(t.id, t.minutes, t) }),
    h("div", { class: "wa-task-body", onclick: () => openTask(t) },
      h("b", null, t.title),
      h("span", { class: "wa-task-meta" },
        h("em", { class: "wa-kind" }, KINDS[t.kind]), " ", mins(t.minutes),
        spent ? " · " + mins(spent) + " on the clock" : "", " · ", t.goal)),
    h("button", {
      class: "wa-mini" + (running ? " is-on" : ""),
      onclick: () => { if (running) stopTimer(); else startTimer(t); render(); },
    }, running ? "Stop" : "Start"));
  }

  function toggle(id: string, minutes: number, t?: PlannedTask): void {
    set((s) => {
      if (s.done[id]) { delete s.done[id]; return; }
      s.done[id] = new Date().toISOString();
      cue("tick");
      if (t && s.timer && s.timer.taskId === id) stopTimer();
      if (!s.spent[id]) s.spent[id] = minutes;
      if (t) checkGoal(t.goal);
    });
  }
  function checkGoal(gid: string): void {
    const ts = allTasks.filter((t) => t.goal === gid);
    if (ts.every(isDone) && !state.goalsMet[gid]) {
      state.goalsMet[gid] = new Date().toISOString();
      goalMet(goalById[gid].color);
    }
  }
  function goalMet(color: string): void {
    cue("stage");
    const b = h("div", { class: "wa-burst" });
    for (let i = 0; i < 18; i++) {
      b.appendChild(h("i", { style: "--a:" + (i * 20) + "deg;--c:" + color + ";--d:" + (0.6 + Math.random()) }));
    }
    root.appendChild(b);
    setTimeout(() => b.remove(), 1400);
  }

  /* ---------- modal: task detail ---------- */

  function openModal(title: string, body: Node): void {
    shell.modal.hidden = false;
    shell.modal.replaceChildren(
      h("div", { class: "wa-scrim", onclick: closeModal }),
      h("div", { class: "wa-sheet", role: "dialog", "aria-modal": "true" },
        h("button", { class: "wa-x", onclick: closeModal, "aria-label": "Close" }, "×"),
        h("h2", null, title), body));
    document.addEventListener("keydown", escClose);
  }
  function closeModal(): void {
    shell.modal.hidden = true;
    document.removeEventListener("keydown", escClose);
  }
  function escClose(e: KeyboardEvent): void { if (e.key === "Escape") closeModal(); }

  function openRitual(r: Ritual): void {
    openModal(r.title, h("div", null,
      h("ol", { class: "wa-steps" }, r.steps.map((s) => h("li", null, s))),
      h("p", { class: "wa-muted" }, mins(r.minutes) + ". Same every day, on purpose.")));
  }

  function openTask(t: PlannedTask): void {
    const trackNote = (k: TrackId): HTMLDetailsElement => {
      const T = plan.tracks[k];
      return h("details", { class: "wa-trackbox", open: k === primary() },
        h("summary", null, "Track " + k + ": " + T.name),
        h("p", null, h("b", null, "Question. "), T.question),
        h("p", null, h("b", null, "Data. "), T.data),
        t.kind === "people" ? h("p", null, h("b", null, "Where to look. "), T.supervisorHunt) : null,
        t.kind === "read" ? h("p", null, h("b", null, "Venues. "), T.venues.join("; ")) : null);
    };
    const promptText = t.prompt.startsWith("USE:") ? null : t.prompt;
    const timing = (): boolean => state.timer?.taskId === t.id;
    openModal(t.title,
      h("div", { class: "wa-detail" },
        h("div", { class: "wa-detail-meta" },
          h("span", { class: "wa-kind", style: "--k:var(--k-" + t.kind + ")" }, KINDS[t.kind]),
          h("span", null, mins(t.minutes)),
          h("span", null, "Day " + t.day + ", " + fmt(t.date)),
          h("span", { style: "color:" + goalById[t.goal].color }, t.goal + " " + goalById[t.goal].name)),
        h("h3", null, "Why this task exists"), h("p", null, t.why),
        h("h3", null, "Do exactly this"), h("ol", { class: "wa-steps" }, t.steps.map((s) => h("li", null, s))),
        h("h3", null, "The AI prompt"),
        promptText
          ? h("div", { class: "wa-promptbox" },
            h("pre", null, promptText),
            h("button", { class: "wa-btn", onclick: (e: Event) => copy(promptText, e.currentTarget as HTMLElement) }, "Copy prompt"))
          : h("p", { class: "wa-muted" }, t.prompt),
        h("h3", null, "What you hand in"), h("p", null, t.output),
        h("h3", null, "Done means"), h("p", { class: "wa-done-test" }, t.done),
        activeTracks().map(trackNote),
        h("div", { class: "wa-row" },
          h("button", { class: "wa-btn wa-btn-p", onclick: () => { toggle(t.id, t.minutes, t); closeModal(); } },
            isDone(t) ? "Un-tick" : "Mark done"),
          h("button", {
            class: "wa-btn",
            onclick: () => { if (timing()) stopTimer(); else startTimer(t); render(); closeModal(); },
          }, timing() ? "Stop timer" : "Start timer"),
          h("label", { class: "wa-inline" }, "Minutes spent ",
            h("input", {
              type: "number", min: 0, value: taskMinutes(t),
              onchange: (e: Event) => set((s) => { s.spent[t.id] = parseInt(field(e).value, 10) || 0; }),
            })))));
  }

  function copy(text: string, btn: HTMLElement): void {
    const done = (): void => {
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => { btn.textContent = old; }, 1200);
    };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done);
    else done();
  }

  /* ---------- plan ---------- */

  function planPage(): HTMLElement {
    return h("div", { class: "wa-plan" },
      h("p", { class: "wa-muted" }, plan.workDays.join(" and ") + ", " + plan.hoursPerWeek
        + " hours a week. Click a day to expand it; click a task for the full guide."),
      plan.days.map((d) => {
        const p = dayProgress(d);
        const g = goalById[d.goal];
        return h("details", { class: "wa-day", open: d.date === currentDay().date, style: "--c:" + g.color },
          h("summary", null,
            h("span", { class: "wa-day-n" }, d.n),
            h("span", { class: "wa-day-t" }, h("b", null, d.theme),
              h("small", null, fmtLong(d.date) + " · " + g.id + " " + g.name)),
            h("span", { class: "wa-day-p" }, ring(Math.round(p * 100), 44, g.color, ""))),
          h("div", { class: "wa-day-body" },
            ritualRow(plan.rituals.open, d, "open"),
            d.tasks.map((t) => taskRow(planned(d, t))),
            ritualRow(plan.rituals.close, d, "close"),
            h("div", { class: "wa-timeline" }, d.tasks.map((t) =>
              h("i", { style: "flex:" + t.minutes + ";background:var(--k-" + t.kind + ")", title: t.title + " " + mins(t.minutes) })))));
      }));
  }

  /* ---------- goals ---------- */

  function goalsPage(): HTMLElement {
    return h("div", { class: "wa-grid" },
      plan.goals.map((g) => {
        const ts = allTasks.filter((t) => t.goal === g.id);
        const met = Boolean(state.goalsMet[g.id]);
        return h("section", { class: "wa-card wa-goalcard" + (met ? " is-met" : ""), id: "goal-" + g.id, style: "--c:" + g.color },
          h("div", { class: "wa-goal-head" },
            ring(Math.round(goalProgress(g) * 100), 64, g.color, ""),
            h("div", null, h("h2", null, g.id + ". " + g.name),
              h("small", { class: "wa-muted" }, "Checkpoint at the end of Day " + g.day + ", " + fmt(plan.days[g.day - 1].date)))),
          h("p", null, h("b", null, "The test: "), g.test),
          h("ul", { class: "wa-list" }, ts.map((t) =>
            h("li", { class: isDone(t) ? "is-done" : "" },
              h("a", { href: "#", onclick: (e: Event) => { e.preventDefault(); openTask(t); } }, "Day " + t.day + ": " + t.title)))),
          h("button", {
            class: "wa-btn" + (met ? "" : " wa-btn-p"),
            onclick: () => set((s) => {
              if (s.goalsMet[g.id]) delete s.goalsMet[g.id];
              else { s.goalsMet[g.id] = new Date().toISOString(); goalMet(g.color); }
            }),
          }, met ? "Met on " + state.goalsMet[g.id].slice(0, 10) + " (undo)" : "The test is met"));
      }));
  }

  /* ---------- generic grid ---------- */

  function grid<R extends GridRow>(rows: R[], cols: Col[], onChange: () => void, opts: GridOpts<R> = {}): HTMLDivElement {
    const table = h("table", { class: "wa-grid-t" });
    table.appendChild(h("thead", null, h("tr", null,
      cols.map((c) => h("th", null, c.label)),
      opts.canDelete ? h("th", null, "") : null)));
    const tb = h("tbody");
    rows.forEach((row, i) => {
      const tr = h("tr", { class: opts.rowClass ? opts.rowClass(row) : "" });
      for (const c of cols) {
        const put = (v: Cell): void => { (row as GridRow)[c.key] = v; onChange(); };
        let cell: HTMLTableCellElement;
        if (c.type === "check") {
          cell = h("td", { class: "wa-td-check" },
            h("input", { type: "checkbox", checked: Boolean(row[c.key]), onchange: (e: Event) => put(box(e).checked) }));
        } else if (c.type === "select") {
          cell = h("td", null, h("select", { onchange: (e: Event) => put(field(e).value) },
            ["", ...(c.options ?? [])].map((o) => h("option", { value: o, selected: row[c.key] === o }, o || "..."))));
        } else if (c.type === "date") {
          cell = h("td", null, h("input", { type: "date", value: row[c.key] || "", onchange: (e: Event) => put(field(e).value) }));
        } else if (c.type === "long") {
          const held = String(row[c.key] || "");
          cell = h("td", null, h("button", {
            class: "wa-mini",
            onclick: () => openText(c.label, held, put, c.template),
          }, held ? "Edit (" + held.split(/\s+/).length + " words)" : "Write"));
        } else {
          cell = h("td", {
            contenteditable: c.readonly ? false : "true",
            class: c.readonly ? "wa-td-ro" : "",
            onblur: (e: Event) => {
              const v = ((e.target as HTMLElement).textContent ?? "").trim();
              if (v !== text(row[c.key])) put(v);
            },
          }, text(row[c.key]));
        }
        tr.appendChild(cell);
      }
      if (opts.canDelete) {
        tr.appendChild(h("td", null, h("button", { class: "wa-mini", onclick: () => { rows.splice(i, 1); onChange(); } }, "×")));
      }
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    const wrap = h("div", { class: "wa-grid-wrap" }, table);
    if (opts.canAdd) {
      wrap.appendChild(h("button", { class: "wa-btn", onclick: () => { rows.push(opts.blank ? opts.blank() : {} as R); onChange(); } }, "Add row"));
    }
    return wrap;
  }

  function openText(title: string, value: string, onSave: (v: string) => void, template?: string): void {
    const ta = h("textarea", { class: "wa-ta", rows: 14 }, value || template || "");
    openModal(title, h("div", null, ta, h("div", { class: "wa-row" },
      h("button", { class: "wa-btn wa-btn-p", onclick: () => { onSave(ta.value); closeModal(); } }, "Save"),
      template ? h("button", { class: "wa-btn", onclick: () => { ta.value = template; } }, "Reset to template") : null)));
  }

  const gridSave = (): void => { save(); renderMain(); };

  /* ---------- library ---------- */

  function libraryPage(): HTMLElement {
    const rows = state.library.filter((r) => activeTracks().includes(r.track));
    const v = rows.filter((r) => r.verified).length;
    const n = rows.filter((r) => r.noteDone).length;
    return h("div", null,
      h("div", { class: "wa-row wa-row-stats" },
        stat("Verified", v + " / " + rows.length), stat("Notes done", n),
        stat("Not found", rows.filter((r) => r.notfound).length)),
      h("p", { class: "wa-muted" }, "Type in a cell to edit. Order 1 to 10 fixes the reading order. "
        + "A citation exists only if the real paper is in Zotero: tick Verified only then."),
      grid<LibraryRow>(rows, [
        { key: "order", label: "Order" }, { key: "title", label: "Paper" },
        { key: "track", label: "Track", readonly: true },
        { key: "verified", label: "Verified", type: "check" },
        { key: "notfound", label: "Not found", type: "check" },
        { key: "noteDone", label: "Note done", type: "check" },
        { key: "note", label: "Note", type: "long", template: plan.templates.paperNote },
      ], gridSave, {
        canAdd: true, canDelete: true,
        blank: () => ({ id: "n" + Date.now(), title: "", track: primary(), verified: false, notfound: false, order: "", note: "", noteDone: false }),
        rowClass: (r) => (r.notfound ? "is-off" : r.verified ? "is-ok" : ""),
      }),
      h("h2", null, "Venues"),
      grid<VenueRow>(state.venues.filter((r) => activeTracks().includes(r.track)), [
        { key: "journal", label: "Journal" }, { key: "oa", label: "Open access" },
        { key: "length", label: "Article length" }, { key: "latest", label: "Latest issue" },
        { key: "rank", label: "My rank" }, { key: "regular", label: "Read regularly", type: "check" },
        { key: "alert", label: "Alert set", type: "check" },
      ], gridSave, { canAdd: true, canDelete: true, blank: () => ({ track: primary(), journal: "" }) }));
  }

  /* ---------- gap ---------- */

  const slug = (c: string): string => c.toLowerCase().replace(/[^a-z]/g, "");

  function gapPage(): HTMLElement {
    return h("div", null,
      h("h2", null, "Gap matrix"),
      h("p", { class: "wa-muted" }, "One row per paper read. Look down each column: where every row is the same, a new paper could vary it."),
      grid(state.gap.rows, plan.gapColumns.map((c) => ({ key: slug(c), label: c })), gridSave, { canAdd: true, canDelete: true }),
      h("h2", null, "The gap sentence"),
      h("p", { class: "wa-muted" }, "Shape: Nobody has looked at [outcome] under [condition] in [place] using [data]. Survives a hostile review before it goes here."),
      h("textarea", {
        class: "wa-ta", rows: 3, placeholder: "Nobody has looked at...",
        onchange: (e: Event) => set((s) => { s.gap.sentence = field(e).value; }),
      }, state.gap.sentence));
  }

  /* ---------- data ---------- */

  function dataPage(): HTMLElement {
    return h("div", null,
      h("h2", null, "Files"),
      grid(state.data.files, plan.dataColumns.map((c): Col => ({
        key: slug(c), label: c,
        type: c === "Download date" ? "date" : c === "Sanity checks passed" ? "select" : "text",
        options: ["0", "1", "2", "3", "4"],
      })), gridSave, { canAdd: true, canDelete: true }),
      h("div", { class: "wa-grid" },
        h("section", { class: "wa-card" }, h("h2", null, "Figures"),
          h("p", { class: "wa-muted" }, "File names and one line each on what the figure shows."),
          h("textarea", { class: "wa-ta", rows: 6, onchange: (e: Event) => set((s) => { s.data.figures = field(e).value; }) }, state.data.figures)),
        h("section", { class: "wa-card" }, h("h2", null, "Tables"),
          h("p", { class: "wa-muted" }, "Paste the summary table as text."),
          h("textarea", { class: "wa-ta", rows: 6, onchange: (e: Event) => set((s) => { s.data.tables = field(e).value; }) }, state.data.tables))));
  }

  /* ---------- people ---------- */

  function peoplePage(): HTMLElement {
    const P = state.people;
    return h("div", null,
      h("h2", null, "Supervisors"),
      h("p", { class: "wa-muted" }, "Fifteen rows. Rank A means perfect fit and you know why. Constraint is the funded-place, stipend, partner-visa test."),
      grid(P.supervisors, [
        { key: "name", label: "Name" }, { key: "institution", label: "Institution" },
        { key: "country", label: "Country" }, { key: "pillar", label: "Pillar" },
        { key: "papers", label: "Last three papers", type: "long" },
        { key: "grant", label: "Active grant", type: "select", options: ["yes", "no", "unknown"] },
        { key: "data", label: "Data I bring" },
        { key: "constraint", label: "Constraint", type: "select", options: ["Pass", "Fail", "Unknown"] },
        { key: "rank", label: "Rank", type: "select", options: ["A", "B", "C"] },
        { key: "contact", label: "Contact", type: "select", options: ["not contacted", "emailed", "replied", "call booked"] },
        { key: "why", label: "Why me for them", type: "long" },
      ], gridSave, { canAdd: true, canDelete: true, rowClass: (r) => (r.rank ? "is-rank-" + r.rank : "") }),
      h("h2", null, "Constraint check by country"),
      grid(P.constraints, [
        { key: "country", label: "Country" }, { key: "route", label: "Funded route (scholarship name)" },
        { key: "stipend", label: "Stipend" }, { key: "partner", label: "Partner visa rule" },
        { key: "url", label: "Official URL" },
        { key: "verdict", label: "Verdict", type: "select", options: ["Pass", "Fail", "Unknown"] },
      ], gridSave, { canAdd: true, canDelete: true }),
      h("h2", null, "Deadlines"),
      h("p", { class: "wa-muted" }, "The dashboard counts down to the nearest one."),
      grid(P.deadlines, [
        { key: "name", label: "Round" }, { key: "institution", label: "Institution" },
        { key: "opens", label: "Opens", type: "date" }, { key: "date", label: "Closes", type: "date" },
        { key: "needs", label: "Needs" },
      ], gridSave, { canAdd: true, canDelete: true }),
      h("h2", null, "Loose ends"),
      grid(P.looseEnds, [
        { key: "item", label: "Item" },
        { key: "status", label: "Status", type: "select", options: ["done", "waiting", "not started"] },
        { key: "note", label: "Fact, or who you asked and when" },
      ], gridSave, { canAdd: true, canDelete: true }),
      h("h2", null, "Email log"),
      grid(P.emails, [
        { key: "to", label: "To" }, { key: "subject", label: "Subject" },
        { key: "sent", label: "Sent", type: "date" }, { key: "followup", label: "Follow up", type: "date" },
        { key: "replied", label: "Replied", type: "check" }, { key: "next", label: "Next step" },
      ], gridSave, { canAdd: true, canDelete: true }));
  }

  /* ---------- prompts ---------- */

  function promptsPage(): HTMLElement {
    const copyButton = (text: string): HTMLButtonElement =>
      h("button", { class: "wa-btn", onclick: (e: Event) => copy(text, e.currentTarget as HTMLElement) }, "Copy");
    return h("div", { class: "wa-grid" },
      plan.prompts.map((p) => h("section", { class: "wa-card" },
        h("h2", null, p.name), h("p", { class: "wa-muted" }, "When: " + p.when),
        h("pre", { class: "wa-pre" }, p.text),
        copyButton(p.text))),
      h("section", { class: "wa-card" }, h("h2", null, "Paper note template"),
        h("pre", { class: "wa-pre" }, plan.templates.paperNote), copyButton(plan.templates.paperNote)),
      h("section", { class: "wa-card" }, h("h2", null, "Research log template"),
        h("pre", { class: "wa-pre" }, plan.templates.log), copyButton(plan.templates.log)),
      h("section", { class: "wa-card wa-span2" }, h("h2", null, "The fresh-chat rule"),
        h("p", null, "A chat that has read your notes is a collaborator and will encourage you. "
          + "A hostile review only counts if it happens in a brand-new chat with nothing pasted but the text under review. "
          + "Every review you keep in the Review page must say which kind it was.")));
  }

  /* ---------- log ---------- */

  function logPage(): HTMLElement {
    const fields: Array<[LogField, string]> = [
      ["time", "Time spent (minutes)"], ["did", "What I did"], ["learned", "What I learned"],
      ["blocked", "What blocked me"], ["next", "Tomorrow's first task"],
    ];
    return h("div", null,
      h("p", { class: "wa-muted" }, "Five lines a day. Fill them at Close the day. Time spent becomes the heatmap when no timers ran."),
      plan.days.map((d) => {
        const L = state.logs[d.date] || {};
        const filled = fields.filter(([k]) => L[k]).length;
        const write = (k: LogField) => (e: Event): void =>
          set((s) => { s.logs[d.date] = { ...s.logs[d.date], [k]: field(e).value }; });
        return h("details", { class: "wa-day", open: d.date === currentDay().date, style: "--c:" + goalById[d.goal].color },
          h("summary", null,
            h("span", { class: "wa-day-n" }, d.n),
            h("span", { class: "wa-day-t" }, h("b", null, fmtLong(d.date)), h("small", null, filled + " / 5 lines")),
            h("span", { class: "wa-day-p" }, ring(Math.round(filled / 5 * 100), 44, goalById[d.goal].color, ""))),
          h("div", { class: "wa-day-body wa-logform" }, fields.map(([k, lbl]) =>
            h("label", null, lbl, k === "time"
              ? h("input", { type: "number", min: 0, value: L[k] || "", onchange: write(k) })
              : h("textarea", { rows: 2, onchange: write(k) }, L[k] || "")))));
      }));
  }

  /* ---------- decide ---------- */

  function decidePage(): HTMLElement {
    const D = state.decision;
    const sum = (k: TrackId): number => D.scores[k].reduce((a, b) => a + b, 0);
    const TRACKS: TrackId[] = ["A", "B"];
    return h("div", null,
      h("p", { class: "wa-muted" }, "Score each track 1 to 5 on the six criteria. Within 3 points is a tie: the tie-break is which dataset you can download tonight."),
      h("table", { class: "wa-grid-t wa-decide" },
        h("thead", null, h("tr", null, h("th", null, "Criterion"),
          h("th", null, "A: " + plan.tracks.A.short), h("th", null, "B: " + plan.tracks.B.short))),
        h("tbody", null,
          plan.decisionCriteria.map((c, i) => h("tr", null, h("td", null, c), TRACKS.map((k) =>
            h("td", null, h("div", { class: "wa-score" }, [1, 2, 3, 4, 5].map((n) =>
              h("button", { class: D.scores[k][i] === n ? "is-on" : "", onclick: () => set((s) => { s.decision.scores[k][i] = n; }) }, n))))))),
          h("tr", { class: "wa-total" }, h("td", null, "Total"), h("td", null, sum("A")), h("td", null, sum("B"))))),
      h("div", { class: "wa-grid" },
        TRACKS.map((k) => h("section", { class: "wa-card" },
          h("h2", null, "Track " + k + ": " + plan.tracks[k].name),
          h("p", null, h("b", null, "Question. "), plan.tracks[k].question),
          h("p", null, h("b", null, "Data. "), plan.tracks[k].data)))),
      h("h2", null, "The decision"),
      h("div", { class: "wa-row" }, (["A", "B", "both"] as const).map((k) =>
        h("button", { class: "wa-btn" + (state.track === k ? " wa-btn-p" : ""), onclick: () => set((s) => { s.track = k; }) },
          k === "both" ? "Both, A first" : "Track " + k))),
      h("p", { class: "wa-muted" }, "Three lines: what you chose, the strongest reason, the strongest reason against. The first line shows on the dashboard."),
      h("textarea", { class: "wa-ta", rows: 4, onchange: (e: Event) => set((s) => { s.decision.reason = field(e).value; }) }, D.reason));
  }

  /* ---------- review ---------- */

  function reviewPage(): HTMLElement {
    const R = state.review;
    const M = state.monthReview;
    const area = (get: () => string, put: (v: string) => void, rows: number, ph = ""): HTMLTextAreaElement =>
      h("textarea", { class: "wa-ta", rows, placeholder: ph, onchange: (e: Event) => set(() => put(field(e).value)) }, get() || "");
    return h("div", null,
      h("h2", null, "Hostile review of proposal v1"),
      h("p", { class: "wa-muted" }, "Paste the fresh-chat answer unedited."),
      area(() => R.first, (v) => { R.first = v; }, 8),
      h("h2", null, "The three objections that would sink it"),
      R.objections.map((o, i) => h("input", {
        class: "wa-input", placeholder: "Objection " + (i + 1), value: o,
        onchange: (e: Event) => set((s) => { s.review.objections[i] = field(e).value; }),
      })),
      h("h2", null, "Second review of v2"),
      area(() => R.second, (v) => { R.second = v; }, 6),
      h("h2", null, "Month review (Day 8)"),
      h("div", { class: "wa-grid" },
        h("section", { class: "wa-card" }, h("h3", null, "Hours logged vs planned"),
          area(() => M.hours, (v) => { M.hours = v; }, 2, Math.round(loggedMinutes() / 60) + " logged of " + Math.round(plannedTotal / 60) + " planned")),
        h("section", { class: "wa-card" }, h("h3", null, "Goals met vs missed"),
          area(() => M.goals, (v) => { M.goals = v; }, 2, Object.keys(state.goalsMet).length + " of " + plan.goals.length + " met")),
        h("section", { class: "wa-card wa-span2" }, h("h3", null, "Three biggest lessons"),
          area(() => M.lessons, (v) => { M.lessons = v; }, 4)),
        h("section", { class: "wa-card" }, h("h3", null, "Month 2 goal sentence"),
          area(() => M.m2goal, (v) => { M.m2goal = v; }, 2)),
        h("section", { class: "wa-card" }, h("h3", null, "Month 2, first two days"),
          area(() => M.m2days, (v) => { M.m2days = v; }, 4))));
  }

  /* ---------- settings ---------- */

  function settingsPage(): HTMLElement {
    return h("div", { class: "wa-grid" },
      h("section", { class: "wa-card" },
        h("h2", null, "You"),
        h("label", null, "Name for emails and README",
          h("input", { class: "wa-input", value: state.settings.name, onchange: (e: Event) => set((s) => { s.settings.name = field(e).value; }) })),
        h("label", null, "GitHub repository (Day 8)",
          h("input", { class: "wa-input", value: state.settings.repo, onchange: (e: Event) => set((s) => { s.settings.repo = field(e).value; }) }))),
      h("section", { class: "wa-card" },
        h("h2", null, "Export and import"),
        h("p", { class: "wa-muted" }, "Everything on every page as one JSON file. Save it to 00-Admin on Day 8, and any time you like."),
        h("div", { class: "wa-row" },
          h("button", { class: "wa-btn wa-btn-p", onclick: exportJson }, "Export JSON"),
          h("label", { class: "wa-btn" }, "Import JSON",
            h("input", { type: "file", accept: ".json", hidden: true, onchange: importJson })))),
      h("section", { class: "wa-card" },
        h("h2", null, "Danger"),
        h("p", { class: "wa-muted" }, "Reset wipes every tick, note and row. Export first."),
        h("button", {
          class: "wa-btn wa-btn-danger",
          onclick: () => { if (confirm("Reset everything? Export first.")) { state = freshState(plan); save(); render(); } },
        }, "Reset month")),
      h("section", { class: "wa-card" },
        h("h2", null, "The plan in numbers"),
        stat("Days", plan.days.length), stat("Tasks", allTasks.length),
        stat("Planned hours", Math.round(plannedTotal / 60)),
        stat("Goals", plan.goals.length), stat("Prompts", plan.prompts.length)));
  }

  function exportJson(): void {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = h("a", { href: URL.createObjectURL(blob), download: todayIso() + "_work-alpha_state.json" });
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  function importJson(e: Event): void {
    const f = box(e).files?.[0];
    if (!f) return;
    f.text()
      .then((txt) => { state = merge(freshState(plan), JSON.parse(txt)); save(); render(); })
      .catch(() => alert("That file is not a Work-Alpha export."));
  }

  const pages: Record<PageId, () => HTMLElement> = {
    dashboard, plan: planPage, goals: goalsPage, library: libraryPage, gap: gapPage,
    data: dataPage, people: peoplePage, prompts: promptsPage, log: logPage,
    decide: decidePage, review: reviewPage, settings: settingsPage,
  };

  function render(): void { renderHead(); renderTrack(); renderTabs(); renderMain(); }

  return storage.load().then((saved) => {
    state = merge(state, saved);
    if (state.timer) runTimer();
    render();
    return { getState: () => state, setPage: (p: PageId) => { page = p; render(); } };
  });
}

/** The standalone arrangement: one browser, one key. The site uses
    `storage.ts` instead, which keeps this key as a mirror. */
export function localStorageAdapter(key = "work-alpha"): Storage {
  return {
    load: () => Promise.resolve(JSON.parse(localStorage.getItem(key) || "null") as Partial<WorkAlphaState> | null),
    save: (s) => { localStorage.setItem(key, JSON.stringify(s)); return Promise.resolve(); },
  };
}
