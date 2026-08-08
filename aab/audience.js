/* ============================================================
   audience.js — the front door.

   Two completely different people arrive at this site:

     · a Bangladeshi reader who wants to understand money, in
       Bangla, and has no interest whatsoever in a CV;
     · a recruiter or a client, in English, who wants the work
       and the credentials and does not need a savings lesson.

   Serving both from one undifferentiated homepage means each of
   them reads past the other's half. So the home page asks once,
   in two big doors, and remembers the answer.

   What the answer changes:
     · the order of the header nav (CSS only — see the `audience`
       block in styles.css, so there is no flash and no reflow)
     · which column of the overlay menu comes first
     · how the Ctrl+K palette ranks its results
     · which half of the home page leads

   What it never changes: what exists. Nothing is hidden from
   anybody, no page becomes unreachable, and the choice is
   reversible from the menu and the footer on every page. It is a
   preference, not a gate — someone who picked "hiring" and then
   wants to read the Bangla library must never hit a wall.

   The attribute itself is set before first paint by the inline
   script in each page's <head>, next to the theme. This module
   handles the behaviour on top of it.
   ============================================================ */

const KEY = "audience";
const VALID = new Set(["learn", "work"]);

export const getAudience = () => {
  try {
    const v = localStorage.getItem(KEY);
    return VALID.has(v) ? v : null;
  } catch {
    return null;
  }
};

export function setAudience(value) {
  if (!VALID.has(value)) return;
  try { localStorage.setItem(KEY, value); } catch { /* private mode */ }
  apply(value);
  dispatchEvent(new CustomEvent("audience:change", { detail: value }));
}

export function clearAudience() {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  document.documentElement.removeAttribute("data-audience");
  dispatchEvent(new CustomEvent("audience:change", { detail: null }));
}

function apply(value) {
  if (value) document.documentElement.setAttribute("data-audience", value);
  else document.documentElement.removeAttribute("data-audience");
}

/* ------------------------------------------------------------
   the doorway on the home page

   The markup ships in index.html rather than being built here,
   for two reasons: it must not flash in after paint, and with
   JavaScript off the two doors still have to be working links to
   the two halves of the site.
   ------------------------------------------------------------ */
function initDoorway() {
  const doorway = document.getElementById("doorway");
  if (!doorway) return;

  doorway.addEventListener("click", (e) => {
    const door = e.target.closest("[data-audience-pick]");
    if (!door) return;
    // Let a modified click open a tab without silently setting a preference
    if (e.metaKey || e.ctrlKey || e.shiftKey) return;
    setAudience(door.dataset.audiencePick);
    // the href carries on to the destination on its own
  });
}

/* ------------------------------------------------------------
   the switcher

   Small, quiet, and on every page — in the footer, and again in
   the overlay menu. Someone who chose wrong should be one tap
   from fixing it, wherever they realise.
   ------------------------------------------------------------ */
function switcherLabel(current) {
  return current === "work"
    ? "আমি শিখতে এসেছি: switch to the Bangla library"
    : "I'm hiring / need work done: switch";
}

function buildSwitcher() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "audience-switch";
  const paint = () => {
    const current = getAudience();
    button.textContent = switcherLabel(current);
    button.dataset.to = current === "work" ? "learn" : "work";
  };
  paint();
  button.addEventListener("click", () => {
    setAudience(button.dataset.to);
    paint();
  });
  addEventListener("audience:change", paint);
  return button;
}

function initSwitcher() {
  const foot = document.querySelector("footer .wrap");
  if (!foot || foot.querySelector(".audience-switch")) return;
  const row = document.createElement("p");
  row.className = "audience-row";
  row.append(buildSwitcher());
  foot.append(row);
}

/* ------------------------------------------------------------
   ranking help for the command palette

   Both audiences see every result. The one they came for simply
   sorts above the one they didn't.
   ------------------------------------------------------------ */
const WORK_HINTS = new Set(["Page", "Article"]);
const WORK_URLS = ["/portfolio", "/about", "/contact", "/colophon"];

export function audienceBoost(item) {
  const who = getAudience();
  if (!who) return 0;
  const isLearn =
    item.url.startsWith("/learn") ||
    item.url.startsWith("/tools") ||
    item.hint === "Learn" ||
    item.hint === "Tool";
  const isWork = WORK_URLS.some((u) => item.url.startsWith(u)) ||
    (WORK_HINTS.has(item.hint) && !isLearn);

  if (who === "learn" && isLearn) return 220;
  if (who === "work" && isWork) return 220;
  return 0;
}

/** Menu column order, so the overlay leads with the right half. */
export function menuOrder(titles) {
  const who = getAudience();
  if (who !== "work") return titles;
  // recruiters get pages and writing first, the library after
  return [...titles].sort((a, b) => Number(b.work ?? 0) - Number(a.work ?? 0));
}

export function initAudience() {
  apply(getAudience());
  initDoorway();
  initSwitcher();
}
