/* Work-Alpha engine. One function, mount(root, plan, storage), draws the whole
   app from plan.json and a state object. No framework, no build step.
   storage = { load(): Promise<object|null>, save(state): Promise<void> } */

(function (global) {
  "use strict";

  const DAY_MS = 86400000;
  const KINDS = { setup: "Set up", think: "Think", read: "Read", write: "Write", data: "Data", people: "People", review: "Review" };

  /* ---------- state ---------- */

  function freshState(plan) {
    const tr = plan.tracks;
    return {
      version: 1,
      track: "A",
      decision: { scores: { A: [0, 0, 0, 0, 0, 0], B: [0, 0, 0, 0, 0, 0] }, reason: "" },
      done: {}, spent: {}, timer: null, goalsMet: {},
      logs: {},
      library: [].concat(
        tr.A.seeds.map((s, i) => ({ id: "A" + i, title: s, track: "A", verified: false, notfound: false, order: "", note: "", noteDone: false })),
        tr.B.seeds.map((s, i) => ({ id: "B" + i, title: s, track: "B", verified: false, notfound: false, order: "", note: "", noteDone: false }))
      ),
      venues: [].concat(
        tr.A.venues.map((v) => ({ track: "A", journal: v, oa: "", length: "", latest: "", rank: "", regular: false, alert: false })),
        tr.B.venues.map((v) => ({ track: "B", journal: v, oa: "", length: "", latest: "", rank: "", regular: false, alert: false }))
      ),
      gap: { rows: [], sentence: "" },
      data: { files: [], figures: "", tables: "" },
      people: {
        supervisors: Array.from({ length: 15 }, () => ({ name: "", institution: "", country: "", pillar: "", papers: "", grant: "", data: "", constraint: "", rank: "", contact: "", why: "" })),
        constraints: [], looseEnds: plan.looseEnds.map((l) => ({ item: l, status: "", note: "" })), deadlines: [], emails: []
      },
      review: { first: "", objections: ["", "", ""], second: "" },
      monthReview: { hours: "", goals: "", lessons: "", m2goal: "", m2days: "" },
      settings: { repo: "", name: "" }
    };
  }

  function merge(base, saved) {
    if (!saved || typeof saved !== "object") return base;
    const out = Object.assign({}, base);
    for (const k of Object.keys(saved)) out[k] = saved[k];
    for (const k of ["decision", "gap", "data", "people", "review", "monthReview", "settings"]) {
      out[k] = Object.assign({}, base[k], saved[k] || {});
    }
    return out;
  }

  /* ---------- helpers ---------- */

  const h = (tag, attrs, ...kids) => {
    const el = document.createElement(tag);
    if (attrs) for (const k of Object.keys(attrs)) {
      const v = attrs[k];
      if (k === "class") el.className = v;
      else if (k === "style") el.style.cssText = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else if (k === "html") el.innerHTML = v;
      else if (v !== false && v != null) el.setAttribute(k, v === true ? "" : v);
    }
    for (const kid of kids.flat()) {
      if (kid == null || kid === false) continue;
      el.appendChild(typeof kid === "string" || typeof kid === "number" ? document.createTextNode(String(kid)) : kid);
    }
    return el;
  };
  const dateOf = (s) => new Date(s + "T00:00:00");
  const iso = (d) => d.toISOString().slice(0, 10);
  const fmt = (s) => dateOf(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const fmtLong = (s) => dateOf(s).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });
  const mins = (m) => (m >= 60 ? Math.floor(m / 60) + "h" + (m % 60 ? " " + (m % 60) + "m" : "") : m + "m");
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  const todayIso = () => iso(new Date(Date.now() - new Date().getTimezoneOffset() * 60000));

  /* ---------- mount ---------- */

  function mount(root, plan, storage) {
    let state = freshState(plan);
    let page = "dashboard";
    let saveTimer = null;
    const allTasks = plan.days.flatMap((d) => d.tasks.map((t) => Object.assign({ day: d.n, date: d.date, goal: d.goal }, t)));
    const goalById = Object.fromEntries(plan.goals.map((g) => [g.id, g]));
    // sound: the site replaces this with cue() from next/lib/sound.ts

    root.classList.add("wa");
    root.innerHTML = "";

    const shell = {
      head: h("header", { class: "wa-head" }),
      track: h("section", { class: "wa-track" }),
      tabs: h("nav", { class: "wa-tabs", role: "tablist" }),
      main: h("main", { class: "wa-main" }),
      modal: h("div", { class: "wa-modal", hidden: true })
    };
    root.append(shell.head, shell.track, shell.tabs, shell.main, shell.modal);

    function save() {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => storage.save(state).catch(() => {}), 250);
    }
    function set(fn) { fn(state); save(); render(); }

    /* ---------- derived ---------- */

    const activeTracks = () => (state.track === "both" ? ["A", "B"] : [state.track]);
    const primary = () => (state.track === "both" ? "A" : state.track);
    const taskMinutes = (t) => state.spent[t.id] || 0;
    const isDone = (t) => !!state.done[t.id];
    const plannedTotal = allTasks.reduce((s, t) => s + t.minutes, 0) + plan.days.length * (plan.rituals.open.minutes + plan.rituals.close.minutes);
    const doneMinutes = () => allTasks.filter(isDone).reduce((s, t) => s + t.minutes, 0);
    const loggedMinutes = () => Object.values(state.spent).reduce((a, b) => a + b, 0);
    const dayProgress = (d) => {
      const ts = d.tasks;
      return ts.filter((t) => isDone(t)).length / ts.length;
    };
    const goalProgress = (g) => {
      const ts = allTasks.filter((t) => t.goal === g.id);
      return ts.length ? ts.filter(isDone).length / ts.length : 0;
    };
    const currentDay = () => {
      const today = todayIso();
      return plan.days.find((d) => d.date === today) || plan.days.find((d) => d.date >= today) || plan.days[plan.days.length - 1];
    };
    const nextDeadline = () => {
      const t = todayIso();
      const ds = state.people.deadlines.filter((d) => d.date && d.date >= t).sort((a, b) => a.date.localeCompare(b.date));
      return ds[0] || null;
    };
    const minutesByDate = () => {
      const m = {};
      for (const t of allTasks) {
        const when = state.done[t.id] ? state.done[t.id].slice(0, 10) : null;
        if (when) m[when] = (m[when] || 0) + (state.spent[t.id] || t.minutes);
      }
      for (const [d, l] of Object.entries(state.logs)) {
        const n = parseInt(l.time, 10);
        if (n && !m[d]) m[d] = n;
      }
      return m;
    };

    /* ---------- timer ---------- */

    let timerInterval = null;
    function startTimer(t) {
      if (state.timer && state.timer.taskId !== t.id) stopTimer();
      state.timer = { taskId: t.id, startedAt: Date.now() };
      save();
      runTimer();
    }
    function stopTimer() {
      if (!state.timer) return;
      const elapsed = Math.round((Date.now() - state.timer.startedAt) / 60000);
      state.spent[state.timer.taskId] = (state.spent[state.timer.taskId] || 0) + elapsed;
      state.timer = null;
      clearInterval(timerInterval);
      document.title = plan.name;
      save();
    }
    function runTimer() {
      clearInterval(timerInterval);
      timerInterval = setInterval(() => {
        if (!state.timer) return clearInterval(timerInterval);
        const t = allTasks.find((x) => x.id === state.timer.taskId);
        const el = Math.round((Date.now() - state.timer.startedAt) / 60000);
        const left = t.minutes - (state.spent[t.id] || 0) - el;
        document.title = (left >= 0 ? left + "m left" : Math.abs(left) + "m over") + " · " + t.title;
        const pill = root.querySelector("[data-timer-pill]");
        if (pill) pill.textContent = (left >= 0 ? left + " min left" : Math.abs(left) + " min over") + ": " + t.title;
      }, 15000);
    }

    /* ---------- head, track, tabs ---------- */

    function renderHead() {
      const pct = Math.round((doneMinutes() / plannedTotal) * 100);
      const day = currentDay();
      const dl = nextDeadline();
      const daysTo = dl ? Math.ceil((dateOf(dl.date) - dateOf(todayIso())) / DAY_MS) : null;
      shell.head.replaceChildren(
        h("div", { class: "wa-head-l" },
          h("div", { class: "wa-kicker" }, plan.subtitle),
          h("h1", { class: "wa-title" }, plan.name),
          h("p", { class: "wa-goal" }, plan.endGoal)
        ),
        h("div", { class: "wa-head-r" },
          ring(pct, 96, "#2457D6", "of the month", Math.round(doneMinutes() / 60) + "h / " + Math.round(plannedTotal / 60) + "h"),
          h("div", { class: "wa-head-facts" },
            h("div", { class: "wa-fact" }, h("b", null, "Day " + day.n + " of " + plan.days.length), h("span", null, fmt(day.date) + ": " + day.theme)),
            h("div", { class: "wa-fact" }, h("b", null, activeTracks().map((k) => plan.tracks[k].short).join(" + ")), h("span", null, state.decision.reason ? state.decision.reason.split("\n")[0] : "Track not decided yet (Day 1, task 3)")),
            h("div", { class: "wa-fact" }, h("b", null, dl ? daysTo + " days" : "No deadline yet"), h("span", null, dl ? "to " + dl.name : "Add one on the People page")),
            state.timer ? h("div", { class: "wa-fact wa-fact-timer", "data-timer-pill": true }, "Timer running") : null
          )
        )
      );
    }

    function ring(pct, size, color, label, sub) {
      const r = size / 2 - 7, c = 2 * Math.PI * r;
      const svg = h("div", { class: "wa-ring", style: "width:" + size + "px;height:" + size + "px" });
      svg.innerHTML =
        '<svg viewBox="0 0 ' + size + " " + size + '" width="' + size + '" height="' + size + '">' +
        '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="wa-ring-track"/>' +
        '<circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="wa-ring-fill" stroke="' + color + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + c * (1 - clamp(pct, 0, 100) / 100) + '"/>' +
        "</svg>";
      svg.append(h("div", { class: "wa-ring-txt" }, h("b", null, pct + "%"), h("small", null, label)));
      if (sub) svg.append(h("div", { class: "wa-ring-sub" }, sub));
      return svg;
    }

    function renderTrack() {
      const total = plan.days.length;
      shell.track.replaceChildren(
        h("div", { class: "wa-track-rail" },
          h("div", { class: "wa-track-fill", style: "width:" + Math.round((plan.days.filter((d) => dayProgress(d) === 1).length / total) * 100) + "%" }),
          plan.goals.map((g) => {
            const met = !!state.goalsMet[g.id], p = goalProgress(g);
            const left = ((g.day - 0.5) / total) * 100;
            return h("button", { class: "wa-flag" + (met ? " is-met" : p > 0 ? " is-live" : ""), style: "left:" + left + "%;--c:" + g.color, title: g.test, onclick: () => { page = "goals"; render(); document.getElementById("goal-" + g.id)?.scrollIntoView({ behavior: "smooth" }); } },
              h("span", { class: "wa-flag-pole" }),
              h("span", { class: "wa-flag-cloth" }, g.id),
              h("span", { class: "wa-flag-name" }, g.name),
              h("span", { class: "wa-flag-bar" }, h("i", { style: "width:" + Math.round(p * 100) + "%" }))
            );
          })
        )
      );
    }

    const PAGES = [
      ["dashboard", "Dashboard"], ["plan", "Plan"], ["goals", "Goals"], ["library", "Library"], ["gap", "Gap"],
      ["data", "Data"], ["people", "People"], ["prompts", "Prompts"], ["log", "Log"], ["decide", "Decide"], ["review", "Review"], ["settings", "Settings"]
    ];
    function renderTabs() {
      shell.tabs.replaceChildren(...PAGES.map(([id, name]) =>
        h("button", { class: "wa-tab" + (page === id ? " is-on" : ""), role: "tab", "aria-selected": page === id, onclick: () => { page = id; render(); } }, name)
      ));
    }

    /* ---------- pages ---------- */

    function renderMain() {
      const fn = pages[page] || pages.dashboard;
      shell.main.replaceChildren(fn());
      shell.main.classList.remove("wa-enter");
      void shell.main.offsetWidth;
      shell.main.classList.add("wa-enter");
    }

    const pages = {};

    pages.dashboard = () => {
      const day = currentDay();
      const m = minutesByDate();
      const kinds = {};
      for (const t of allTasks) { kinds[t.kind] = kinds[t.kind] || { planned: 0, done: 0 }; kinds[t.kind].planned += t.minutes; if (isDone(t)) kinds[t.kind].done += t.minutes; }
      return h("div", { class: "wa-grid wa-dash" },
        h("section", { class: "wa-card wa-span2" },
          h("h2", null, "Today: " + fmtLong(day.date)),
          h("p", { class: "wa-muted" }, "Day " + day.n + ", " + day.theme + ". Goal " + day.goal + ": " + goalById[day.goal].name + ". Planned " + mins(day.tasks.reduce((s, t) => s + t.minutes, 0) + plan.rituals.open.minutes + plan.rituals.close.minutes) + "."),
          ritualRow(plan.rituals.open, day, "open"),
          day.tasks.map((t) => taskRow(Object.assign({ day: day.n, date: day.date, goal: day.goal }, t))),
          ritualRow(plan.rituals.close, day, "close")
        ),
        h("section", { class: "wa-card" },
          h("h2", null, "Heatmap"),
          h("p", { class: "wa-muted" }, "Minutes of finished work per day. Planned days carry a ring."),
          heatmap(m)
        ),
        h("section", { class: "wa-card" },
          h("h2", null, "Where the hours go"),
          Object.entries(kinds).map(([k, v]) => h("div", { class: "wa-bar" },
            h("span", null, KINDS[k]),
            h("i", { class: "wa-bar-track" }, h("b", { style: "width:" + Math.round((v.done / v.planned) * 100) + "%;background:var(--k-" + k + ")" })),
            h("small", null, mins(v.done) + " / " + mins(v.planned))
          ))
        ),
        h("section", { class: "wa-card" },
          h("h2", null, "The gap sentence"),
          h("p", { class: state.gap.sentence ? "wa-big" : "wa-muted" }, state.gap.sentence || "Appears here after Day 4, task 6.")
        ),
        h("section", { class: "wa-card" },
          h("h2", null, "Goals"),
          plan.goals.map((g) => h("div", { class: "wa-bar" },
            h("span", { style: "color:" + g.color }, g.id + " " + g.name),
            h("i", { class: "wa-bar-track" }, h("b", { style: "width:" + Math.round(goalProgress(g) * 100) + "%;background:" + g.color })),
            h("small", null, state.goalsMet[g.id] ? "met" : "day " + g.day)
          ))
        ),
        h("section", { class: "wa-card" },
          h("h2", null, "Numbers"),
          stat("Papers verified", state.library.filter((r) => r.verified).length + " / 15"),
          stat("Notes done", state.library.filter((r) => r.noteDone).length + " / 10"),
          stat("Supervisors named", state.people.supervisors.filter((r) => r.name).length + " / 15"),
          stat("Deadlines dated", state.people.deadlines.filter((d) => d.date).length),
          stat("Hours on the clock", Math.round(loggedMinutes() / 60 * 10) / 10),
          stat("Days logged", Object.keys(state.logs).length + " / " + plan.days.length)
        )
      );
    };

    const stat = (k, v) => h("div", { class: "wa-stat" }, h("span", null, k), h("b", null, v));

    function heatmap(m) {
      const start = dateOf(plan.start);
      const first = new Date(start.getTime() - ((start.getDay() + 1) % 7) * DAY_MS); // Saturday before start
      const weeks = 6;
      const planned = new Set(plan.days.map((d) => d.date));
      const max = Math.max(60, ...Object.values(m));
      const grid = h("div", { class: "wa-heat" });
      const names = ["Sa", "Su", "Mo", "Tu", "We", "Th", "Fr"];
      names.forEach((n) => grid.append(h("span", { class: "wa-heat-lbl" }, n)));
      for (let w = 0; w < weeks; w++) for (let d = 0; d < 7; d++) {
        const dt = new Date(first.getTime() + (w * 7 + d) * DAY_MS), k = iso(dt), v = m[k] || 0;
        const cell = h("span", { class: "wa-heat-cell" + (planned.has(k) ? " is-planned" : "") + (k === todayIso() ? " is-today" : ""), title: fmt(k) + ": " + mins(v), style: "--v:" + (v / max).toFixed(2) });
        cell.append(h("i", null, dt.getDate() === 1 ? dt.toLocaleDateString("en-GB", { month: "short" }) : dt.getDate()));
        grid.append(cell);
      }
      return grid;
    }

    function ritualRow(r, day, which) {
      const id = "r-" + which + "-" + day.n;
      const done = !!state.done[id];
      return h("div", { class: "wa-task wa-ritual" + (done ? " is-done" : "") },
        h("button", { class: "wa-check", "aria-label": "Mark done", onclick: () => toggle(id, r.minutes) }),
        h("div", { class: "wa-task-body", onclick: () => openRitual(r) },
          h("b", null, r.title), h("span", { class: "wa-task-meta" }, mins(r.minutes) + " · ritual")
        )
      );
    }

    function taskRow(t) {
      const done = isDone(t), running = state.timer && state.timer.taskId === t.id;
      const spent = taskMinutes(t);
      return h("div", { class: "wa-task" + (done ? " is-done" : "") + (running ? " is-running" : ""), style: "--k:var(--k-" + t.kind + ")" },
        h("button", { class: "wa-check", "aria-label": "Mark done", onclick: () => toggle(t.id, t.minutes, t) }),
        h("div", { class: "wa-task-body", onclick: () => openTask(t) },
          h("b", null, t.title),
          h("span", { class: "wa-task-meta" }, h("em", { class: "wa-kind" }, KINDS[t.kind]), " ", mins(t.minutes), spent ? " · " + mins(spent) + " on the clock" : "", " · ", t.goal)
        ),
        h("button", { class: "wa-mini" + (running ? " is-on" : ""), onclick: () => (running ? (stopTimer(), render()) : (startTimer(t), render())) }, running ? "Stop" : "Start")
      );
    }

    function toggle(id, minutes, t) {
      set((s) => {
        if (s.done[id]) { delete s.done[id]; return; }
        s.done[id] = new Date().toISOString();
        if (t && s.timer && s.timer.taskId === id) stopTimer();
        if (!s.spent[id]) s.spent[id] = minutes;
        if (t) checkGoal(t.goal);
      });
    }
    function checkGoal(gid) {
      const ts = allTasks.filter((t) => t.goal === gid);
      if (ts.every(isDone) && !state.goalsMet[gid]) { state.goalsMet[gid] = new Date().toISOString(); burst(goalById[gid].color); }
    }
    function burst(color) {
      const b = h("div", { class: "wa-burst" });
      for (let i = 0; i < 18; i++) b.append(h("i", { style: "--a:" + (i * 20) + "deg;--c:" + color + ";--d:" + (0.6 + Math.random()) }));
      root.append(b);
      setTimeout(() => b.remove(), 1400);
    }

    /* ---------- modal: task detail ---------- */

    function openModal(title, body) {
      shell.modal.hidden = false;
      shell.modal.replaceChildren(
        h("div", { class: "wa-scrim", onclick: closeModal }),
        h("div", { class: "wa-sheet", role: "dialog", "aria-modal": "true" },
          h("button", { class: "wa-x", onclick: closeModal, "aria-label": "Close" }, "×"),
          h("h2", null, title), body)
      );
      document.addEventListener("keydown", escClose);
    }
    function closeModal() { shell.modal.hidden = true; document.removeEventListener("keydown", escClose); }
    function escClose(e) { if (e.key === "Escape") closeModal(); }

    function openRitual(r) {
      openModal(r.title, h("div", null, h("ol", { class: "wa-steps" }, r.steps.map((s) => h("li", null, s))), h("p", { class: "wa-muted" }, mins(r.minutes) + ". Same every day, on purpose.")));
    }

    function openTask(t) {
      const tk = plan.tracks;
      const trackNote = (k) => {
        const T = tk[k];
        return h("details", { class: "wa-trackbox", open: k === primary() },
          h("summary", null, "Track " + k + ": " + T.name),
          h("p", null, h("b", null, "Question. "), T.question),
          h("p", null, h("b", null, "Data. "), T.data),
          t.kind === "people" ? h("p", null, h("b", null, "Where to look. "), T.supervisorHunt) : null,
          t.kind === "read" ? h("p", null, h("b", null, "Venues. "), T.venues.join("; ")) : null
        );
      };
      const promptText = t.prompt.startsWith("USE:") ? null : t.prompt;
      openModal(t.title,
        h("div", { class: "wa-detail" },
          h("div", { class: "wa-detail-meta" }, h("span", { class: "wa-kind", style: "--k:var(--k-" + t.kind + ")" }, KINDS[t.kind]), h("span", null, mins(t.minutes)), h("span", null, "Day " + t.day + ", " + fmt(t.date)), h("span", { style: "color:" + goalById[t.goal].color }, t.goal + " " + goalById[t.goal].name)),
          h("h3", null, "Why this task exists"), h("p", null, t.why),
          h("h3", null, "Do exactly this"), h("ol", { class: "wa-steps" }, t.steps.map((s) => h("li", null, s))),
          h("h3", null, "The AI prompt"),
          promptText
            ? h("div", { class: "wa-promptbox" }, h("pre", null, promptText), h("button", { class: "wa-btn", onclick: (e) => copy(promptText, e.target) }, "Copy prompt"))
            : h("p", { class: "wa-muted" }, t.prompt),
          h("h3", null, "What you hand in"), h("p", null, t.output),
          h("h3", null, "Done means"), h("p", { class: "wa-done-test" }, t.done),
          activeTracks().map(trackNote),
          h("div", { class: "wa-row" },
            h("button", { class: "wa-btn wa-btn-p", onclick: () => { toggle(t.id, t.minutes, t); closeModal(); } }, isDone(t) ? "Un-tick" : "Mark done"),
            h("button", { class: "wa-btn", onclick: () => { state.timer && state.timer.taskId === t.id ? stopTimer() : startTimer(t); render(); closeModal(); } }, state.timer && state.timer.taskId === t.id ? "Stop timer" : "Start timer"),
            h("label", { class: "wa-inline" }, "Minutes spent ", h("input", { type: "number", min: 0, value: taskMinutes(t), onchange: (e) => set((s) => { s.spent[t.id] = parseInt(e.target.value, 10) || 0; }) }))
          )
        )
      );
    }

    function copy(text, btn) {
      const done = () => { const old = btn.textContent; btn.textContent = "Copied"; setTimeout(() => (btn.textContent = old), 1200); };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, done); else done();
    }

    /* ---------- plan page ---------- */

    pages.plan = () => h("div", { class: "wa-plan" },
      h("p", { class: "wa-muted" }, plan.workDays.join(" and ") + ", " + plan.hoursPerWeek + " hours a week. Click a day to expand it; click a task for the full guide."),
      plan.days.map((d) => {
        const p = dayProgress(d), g = goalById[d.goal];
        return h("details", { class: "wa-day", open: d.date === currentDay().date, style: "--c:" + g.color },
          h("summary", null,
            h("span", { class: "wa-day-n" }, d.n),
            h("span", { class: "wa-day-t" }, h("b", null, d.theme), h("small", null, fmtLong(d.date) + " · " + g.id + " " + g.name)),
            h("span", { class: "wa-day-p" }, ring(Math.round(p * 100), 44, g.color, ""))
          ),
          h("div", { class: "wa-day-body" },
            ritualRow(plan.rituals.open, d, "open"),
            d.tasks.map((t) => taskRow(Object.assign({ day: d.n, date: d.date, goal: d.goal }, t))),
            ritualRow(plan.rituals.close, d, "close"),
            h("div", { class: "wa-timeline" }, d.tasks.map((t) => h("i", { style: "flex:" + t.minutes + ";background:var(--k-" + t.kind + ")", title: t.title + " " + mins(t.minutes) })))
          )
        );
      })
    );

    /* ---------- goals page ---------- */

    pages.goals = () => h("div", { class: "wa-grid" },
      plan.goals.map((g) => {
        const ts = allTasks.filter((t) => t.goal === g.id), met = !!state.goalsMet[g.id];
        return h("section", { class: "wa-card wa-goalcard" + (met ? " is-met" : ""), id: "goal-" + g.id, style: "--c:" + g.color },
          h("div", { class: "wa-goal-head" }, ring(Math.round(goalProgress(g) * 100), 64, g.color, ""), h("div", null, h("h2", null, g.id + ". " + g.name), h("small", { class: "wa-muted" }, "Checkpoint at the end of Day " + g.day + ", " + fmt(plan.days[g.day - 1].date)))),
          h("p", null, h("b", null, "The test: "), g.test),
          h("ul", { class: "wa-list" }, ts.map((t) => h("li", { class: isDone(t) ? "is-done" : "" }, h("a", { href: "#", onclick: (e) => { e.preventDefault(); openTask(t); } }, "Day " + t.day + ": " + t.title)))),
          h("button", { class: "wa-btn" + (met ? "" : " wa-btn-p"), onclick: () => set((s) => { if (s.goalsMet[g.id]) delete s.goalsMet[g.id]; else { s.goalsMet[g.id] = new Date().toISOString(); burst(g.color); } }) }, met ? "Met on " + state.goalsMet[g.id].slice(0, 10) + " (undo)" : "The test is met")
        );
      })
    );

    /* ---------- generic grid ---------- */

    function grid(rows, cols, onChange, opts) {
      opts = opts || {};
      const table = h("table", { class: "wa-grid-t" });
      table.append(h("thead", null, h("tr", null, cols.map((c) => h("th", null, c.label)), opts.canDelete ? h("th", null, "") : null)));
      const tb = h("tbody");
      rows.forEach((row, i) => {
        const tr = h("tr", { class: opts.rowClass ? opts.rowClass(row) : "" });
        cols.forEach((c) => {
          let cell;
          if (c.type === "check") cell = h("td", { class: "wa-td-check" }, h("input", { type: "checkbox", checked: !!row[c.key], onchange: (e) => { row[c.key] = e.target.checked; onChange(row, c.key); } }));
          else if (c.type === "select") cell = h("td", null, h("select", { onchange: (e) => { row[c.key] = e.target.value; onChange(row, c.key); } }, [""].concat(c.options).map((o) => h("option", { value: o, selected: row[c.key] === o }, o || "..."))));
          else if (c.type === "date") cell = h("td", null, h("input", { type: "date", value: row[c.key] || "", onchange: (e) => { row[c.key] = e.target.value; onChange(row, c.key); } }));
          else if (c.type === "long") cell = h("td", null, h("button", { class: "wa-mini", onclick: () => openText(c.label, row[c.key] || "", (v) => { row[c.key] = v; onChange(row, c.key); }, c.template) }, row[c.key] ? "Edit (" + row[c.key].split(/\s+/).length + " words)" : "Write"));
          else cell = h("td", { contenteditable: c.readonly ? false : "true", class: c.readonly ? "wa-td-ro" : "", onblur: (e) => { const v = e.target.textContent.trim(); if (v !== (row[c.key] || "")) { row[c.key] = v; onChange(row, c.key); } } }, row[c.key] || "");
          tr.append(cell);
        });
        if (opts.canDelete) tr.append(h("td", null, h("button", { class: "wa-mini", onclick: () => { rows.splice(i, 1); onChange(null, null); } }, "×")));
        tb.append(tr);
      });
      table.append(tb);
      const wrap = h("div", { class: "wa-grid-wrap" }, table);
      if (opts.canAdd) wrap.append(h("button", { class: "wa-btn", onclick: () => { rows.push(opts.blank ? opts.blank() : {}); onChange(null, null); } }, "Add row"));
      return wrap;
    }

    function openText(title, value, onSave, template) {
      const ta = h("textarea", { class: "wa-ta", rows: 14 }, value || (template || ""));
      openModal(title, h("div", null, ta, h("div", { class: "wa-row" }, h("button", { class: "wa-btn wa-btn-p", onclick: () => { onSave(ta.value); closeModal(); } }, "Save"), template ? h("button", { class: "wa-btn", onclick: () => { ta.value = template; } }, "Reset to template") : null)));
    }

    const gridSave = () => { save(); renderMain(); };

    /* ---------- library ---------- */

    pages.library = () => {
      const rows = state.library.filter((r) => activeTracks().includes(r.track));
      const v = rows.filter((r) => r.verified).length, n = rows.filter((r) => r.noteDone).length;
      return h("div", null,
        h("div", { class: "wa-row wa-row-stats" }, stat("Verified", v + " / " + rows.length), stat("Notes done", n), stat("Not found", rows.filter((r) => r.notfound).length)),
        h("p", { class: "wa-muted" }, "Type in a cell to edit. Order 1 to 10 fixes the reading order. A citation exists only if the real paper is in Zotero: tick Verified only then."),
        grid(rows, [
          { key: "order", label: "Order" }, { key: "title", label: "Paper" }, { key: "track", label: "Track", readonly: true },
          { key: "verified", label: "Verified", type: "check" }, { key: "notfound", label: "Not found", type: "check" },
          { key: "noteDone", label: "Note done", type: "check" }, { key: "note", label: "Note", type: "long", template: plan.templates.paperNote }
        ], gridSave, { canAdd: true, canDelete: true, blank: () => ({ id: "n" + Date.now(), title: "", track: primary(), verified: false, notfound: false, order: "", note: "", noteDone: false }), rowClass: (r) => (r.notfound ? "is-off" : r.verified ? "is-ok" : "") }),
        h("h2", null, "Venues"),
        grid(state.venues.filter((r) => activeTracks().includes(r.track)), [
          { key: "journal", label: "Journal" }, { key: "oa", label: "Open access" }, { key: "length", label: "Article length" }, { key: "latest", label: "Latest issue" },
          { key: "rank", label: "My rank" }, { key: "regular", label: "Read regularly", type: "check" }, { key: "alert", label: "Alert set", type: "check" }
        ], gridSave, { canAdd: true, canDelete: true, blank: () => ({ track: primary(), journal: "" }) })
      );
    };

    /* ---------- gap ---------- */

    pages.gap = () => h("div", null,
      h("h2", null, "Gap matrix"),
      h("p", { class: "wa-muted" }, "One row per paper read. Look down each column: where every row is the same, a new paper could vary it."),
      grid(state.gap.rows, plan.gapColumns.map((c) => ({ key: c.toLowerCase().replace(/[^a-z]/g, ""), label: c })), gridSave, { canAdd: true, canDelete: true }),
      h("h2", null, "The gap sentence"),
      h("p", { class: "wa-muted" }, "Shape: Nobody has looked at [outcome] under [condition] in [place] using [data]. Survives a hostile review before it goes here."),
      h("textarea", { class: "wa-ta", rows: 3, placeholder: "Nobody has looked at...", onchange: (e) => set((s) => { s.gap.sentence = e.target.value; }) }, state.gap.sentence)
    );

    /* ---------- data ---------- */

    pages.data = () => h("div", null,
      h("h2", null, "Files"),
      grid(state.data.files, plan.dataColumns.map((c) => ({ key: c.toLowerCase().replace(/[^a-z]/g, ""), label: c, type: c === "Download date" ? "date" : c === "Sanity checks passed" ? "select" : "text", options: ["0", "1", "2", "3", "4"] })), gridSave, { canAdd: true, canDelete: true }),
      h("div", { class: "wa-grid" },
        h("section", { class: "wa-card" }, h("h2", null, "Figures"), h("p", { class: "wa-muted" }, "File names and one line each on what the figure shows."), h("textarea", { class: "wa-ta", rows: 6, onchange: (e) => set((s) => { s.data.figures = e.target.value; }) }, state.data.figures)),
        h("section", { class: "wa-card" }, h("h2", null, "Tables"), h("p", { class: "wa-muted" }, "Paste the summary table as text."), h("textarea", { class: "wa-ta", rows: 6, onchange: (e) => set((s) => { s.data.tables = e.target.value; }) }, state.data.tables))
      )
    );

    /* ---------- people ---------- */

    pages.people = () => {
      const P = state.people;
      return h("div", null,
        h("h2", null, "Supervisors"),
        h("p", { class: "wa-muted" }, "Fifteen rows. Rank A means perfect fit and you know why. Constraint is the funded-place, stipend, partner-visa test."),
        grid(P.supervisors, [
          { key: "name", label: "Name" }, { key: "institution", label: "Institution" }, { key: "country", label: "Country" }, { key: "pillar", label: "Pillar" },
          { key: "papers", label: "Last three papers", type: "long" }, { key: "grant", label: "Active grant", type: "select", options: ["yes", "no", "unknown"] },
          { key: "data", label: "Data I bring" }, { key: "constraint", label: "Constraint", type: "select", options: ["Pass", "Fail", "Unknown"] },
          { key: "rank", label: "Rank", type: "select", options: ["A", "B", "C"] }, { key: "contact", label: "Contact", type: "select", options: ["not contacted", "emailed", "replied", "call booked"] },
          { key: "why", label: "Why me for them", type: "long" }
        ], gridSave, { canAdd: true, canDelete: true, rowClass: (r) => (r.rank ? "is-rank-" + r.rank : "") }),
        h("h2", null, "Constraint check by country"),
        grid(P.constraints, [{ key: "country", label: "Country" }, { key: "route", label: "Funded route (scholarship name)" }, { key: "stipend", label: "Stipend" }, { key: "partner", label: "Partner visa rule" }, { key: "url", label: "Official URL" }, { key: "verdict", label: "Verdict", type: "select", options: ["Pass", "Fail", "Unknown"] }], gridSave, { canAdd: true, canDelete: true }),
        h("h2", null, "Deadlines"),
        h("p", { class: "wa-muted" }, "The dashboard counts down to the nearest one."),
        grid(P.deadlines, [{ key: "name", label: "Round" }, { key: "institution", label: "Institution" }, { key: "opens", label: "Opens", type: "date" }, { key: "date", label: "Closes", type: "date" }, { key: "needs", label: "Needs" }], gridSave, { canAdd: true, canDelete: true }),
        h("h2", null, "Loose ends"),
        grid(P.looseEnds, [{ key: "item", label: "Item" }, { key: "status", label: "Status", type: "select", options: ["done", "waiting", "not started"] }, { key: "note", label: "Fact, or who you asked and when" }], gridSave, { canAdd: true, canDelete: true }),
        h("h2", null, "Email log"),
        grid(P.emails, [{ key: "to", label: "To" }, { key: "subject", label: "Subject" }, { key: "sent", label: "Sent", type: "date" }, { key: "followup", label: "Follow up", type: "date" }, { key: "replied", label: "Replied", type: "check" }, { key: "next", label: "Next step" }], gridSave, { canAdd: true, canDelete: true })
      );
    };

    /* ---------- prompts ---------- */

    pages.prompts = () => h("div", { class: "wa-grid" },
      plan.prompts.map((p) => h("section", { class: "wa-card" },
        h("h2", null, p.name), h("p", { class: "wa-muted" }, "When: " + p.when),
        h("pre", { class: "wa-pre" }, p.text),
        h("button", { class: "wa-btn", onclick: (e) => copy(p.text, e.target) }, "Copy")
      )),
      h("section", { class: "wa-card" }, h("h2", null, "Paper note template"), h("pre", { class: "wa-pre" }, plan.templates.paperNote), h("button", { class: "wa-btn", onclick: (e) => copy(plan.templates.paperNote, e.target) }, "Copy")),
      h("section", { class: "wa-card" }, h("h2", null, "Research log template"), h("pre", { class: "wa-pre" }, plan.templates.log), h("button", { class: "wa-btn", onclick: (e) => copy(plan.templates.log, e.target) }, "Copy")),
      h("section", { class: "wa-card wa-span2" }, h("h2", null, "The fresh-chat rule"), h("p", null, "A chat that has read your notes is a collaborator and will encourage you. A hostile review only counts if it happens in a brand-new chat with nothing pasted but the text under review. Every review you keep in the Review page must say which kind it was."))
    );

    /* ---------- log ---------- */

    pages.log = () => {
      const fields = [["time", "Time spent (minutes)"], ["did", "What I did"], ["learned", "What I learned"], ["blocked", "What blocked me"], ["next", "Tomorrow's first task"]];
      return h("div", null,
        h("p", { class: "wa-muted" }, "Five lines a day. Fill them at Close the day. Time spent becomes the heatmap when no timers ran."),
        plan.days.map((d) => {
          const L = state.logs[d.date] || {};
          const filled = fields.filter(([k]) => L[k]).length;
          return h("details", { class: "wa-day", open: d.date === currentDay().date, style: "--c:" + goalById[d.goal].color },
            h("summary", null, h("span", { class: "wa-day-n" }, d.n), h("span", { class: "wa-day-t" }, h("b", null, fmtLong(d.date)), h("small", null, filled + " / 5 lines")), h("span", { class: "wa-day-p" }, ring(Math.round(filled / 5 * 100), 44, goalById[d.goal].color, ""))),
            h("div", { class: "wa-day-body wa-logform" }, fields.map(([k, lbl]) =>
              h("label", null, lbl, k === "time"
                ? h("input", { type: "number", min: 0, value: L[k] || "", onchange: (e) => set((s) => { s.logs[d.date] = Object.assign({}, s.logs[d.date], { [k]: e.target.value }); }) })
                : h("textarea", { rows: 2, onchange: (e) => set((s) => { s.logs[d.date] = Object.assign({}, s.logs[d.date], { [k]: e.target.value }); }) }, L[k] || ""))
            ))
          );
        })
      );
    };

    /* ---------- decide ---------- */

    pages.decide = () => {
      const D = state.decision;
      const sum = (k) => D.scores[k].reduce((a, b) => a + b, 0);
      return h("div", null,
        h("p", { class: "wa-muted" }, "Score each track 1 to 5 on the six criteria. Within 3 points is a tie: the tie-break is which dataset you can download tonight."),
        h("table", { class: "wa-grid-t wa-decide" },
          h("thead", null, h("tr", null, h("th", null, "Criterion"), h("th", null, "A: " + plan.tracks.A.short), h("th", null, "B: " + plan.tracks.B.short))),
          h("tbody", null, plan.decisionCriteria.map((c, i) => h("tr", null, h("td", null, c), ["A", "B"].map((k) =>
            h("td", null, h("div", { class: "wa-score" }, [1, 2, 3, 4, 5].map((n) => h("button", { class: D.scores[k][i] === n ? "is-on" : "", onclick: () => set((s) => { s.decision.scores[k][i] = n; }) }, n))))
          ))), h("tr", { class: "wa-total" }, h("td", null, "Total"), h("td", null, sum("A")), h("td", null, sum("B"))))
        ),
        h("div", { class: "wa-grid" },
          ["A", "B"].map((k) => h("section", { class: "wa-card" }, h("h2", null, "Track " + k + ": " + plan.tracks[k].name), h("p", null, h("b", null, "Question. "), plan.tracks[k].question), h("p", null, h("b", null, "Data. "), plan.tracks[k].data)))
        ),
        h("h2", null, "The decision"),
        h("div", { class: "wa-row" }, ["A", "B", "both"].map((k) => h("button", { class: "wa-btn" + (state.track === k ? " wa-btn-p" : ""), onclick: () => set((s) => { s.track = k; }) }, k === "both" ? "Both, A first" : "Track " + k))),
        h("p", { class: "wa-muted" }, "Three lines: what you chose, the strongest reason, the strongest reason against. The first line shows on the dashboard."),
        h("textarea", { class: "wa-ta", rows: 4, onchange: (e) => set((s) => { s.decision.reason = e.target.value; }) }, D.reason)
      );
    };

    /* ---------- review ---------- */

    pages.review = () => {
      const R = state.review, M = state.monthReview;
      const area = (obj, key, rows, ph) => h("textarea", { class: "wa-ta", rows: rows, placeholder: ph || "", onchange: (e) => set(() => { obj[key] = e.target.value; }) }, obj[key] || "");
      return h("div", null,
        h("h2", null, "Hostile review of proposal v1"),
        h("p", { class: "wa-muted" }, "Paste the fresh-chat answer unedited."),
        area(R, "first", 8),
        h("h2", null, "The three objections that would sink it"),
        R.objections.map((o, i) => h("input", { class: "wa-input", placeholder: "Objection " + (i + 1), value: o, onchange: (e) => set((s) => { s.review.objections[i] = e.target.value; }) })),
        h("h2", null, "Second review of v2"),
        area(R, "second", 6),
        h("h2", null, "Month review (Day 8)"),
        h("div", { class: "wa-grid" },
          h("section", { class: "wa-card" }, h("h3", null, "Hours logged vs planned"), area(M, "hours", 2, Math.round(loggedMinutes() / 60) + " logged of " + Math.round(plannedTotal / 60) + " planned")),
          h("section", { class: "wa-card" }, h("h3", null, "Goals met vs missed"), area(M, "goals", 2, Object.keys(state.goalsMet).length + " of " + plan.goals.length + " met")),
          h("section", { class: "wa-card wa-span2" }, h("h3", null, "Three biggest lessons"), area(M, "lessons", 4)),
          h("section", { class: "wa-card" }, h("h3", null, "Month 2 goal sentence"), area(M, "m2goal", 2)),
          h("section", { class: "wa-card" }, h("h3", null, "Month 2, first two days"), area(M, "m2days", 4))
        )
      );
    };

    /* ---------- settings ---------- */

    pages.settings = () => h("div", { class: "wa-grid" },
      h("section", { class: "wa-card" },
        h("h2", null, "You"),
        h("label", null, "Name for emails and README", h("input", { class: "wa-input", value: state.settings.name, onchange: (e) => set((s) => { s.settings.name = e.target.value; }) })),
        h("label", null, "GitHub repository (Day 8)", h("input", { class: "wa-input", value: state.settings.repo, onchange: (e) => set((s) => { s.settings.repo = e.target.value; }) }))
      ),
      h("section", { class: "wa-card" },
        h("h2", null, "Export and import"),
        h("p", { class: "wa-muted" }, "Everything on every page as one JSON file. Save it to 00-Admin on Day 8, and any time you like."),
        h("div", { class: "wa-row" },
          h("button", { class: "wa-btn wa-btn-p", onclick: exportJson }, "Export JSON"),
          h("label", { class: "wa-btn" }, "Import JSON", h("input", { type: "file", accept: ".json", hidden: true, onchange: importJson }))
        )
      ),
      h("section", { class: "wa-card" },
        h("h2", null, "Danger"),
        h("p", { class: "wa-muted" }, "Reset wipes every tick, note and row. Export first."),
        h("button", { class: "wa-btn wa-btn-danger", onclick: () => { if (confirm("Reset everything? Export first.")) { state = freshState(plan); save(); render(); } } }, "Reset month")
      ),
      h("section", { class: "wa-card" },
        h("h2", null, "The plan in numbers"),
        stat("Days", plan.days.length), stat("Tasks", allTasks.length), stat("Planned hours", Math.round(plannedTotal / 60)), stat("Goals", plan.goals.length), stat("Prompts", plan.prompts.length)
      )
    );

    function exportJson() {
      const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
      const a = h("a", { href: URL.createObjectURL(blob), download: todayIso() + "_work-alpha_state.json" });
      document.body.append(a); a.click(); a.remove();
    }
    function importJson(e) {
      const f = e.target.files[0]; if (!f) return;
      f.text().then((txt) => { state = merge(freshState(plan), JSON.parse(txt)); save(); render(); }).catch(() => alert("That file is not a Work-Alpha export."));
    }

    /* ---------- render ---------- */

    function render() { renderHead(); renderTrack(); renderTabs(); renderMain(); }

    return storage.load().then((saved) => {
      state = merge(state, saved);
      if (state.timer) runTimer();
      render();
      return { getState: () => state, setPage: (p) => { page = p; render(); } };
    });
  }

  function localStorageAdapter(key) {
    key = key || "work-alpha";
    return {
      load: () => Promise.resolve(JSON.parse(localStorage.getItem(key) || "null")),
      save: (s) => { localStorage.setItem(key, JSON.stringify(s)); return Promise.resolve(); }
    };
  }

  global.WorkAlpha = { mount, freshState, localStorageAdapter };
})(typeof window !== "undefined" ? window : globalThis);
