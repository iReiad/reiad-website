/* ============================================================
   audience.js: the front door.

   Three completely different people arrive at this site:

     · a Bangladeshi reader who wants to understand money, in
       Bangla, and has no interest whatsoever in a CV;
     · a Bangladeshi reader who came for one of the other
       schools, German today, five more being written, and
       does not want a savings lesson either;
     · a recruiter or a client, in English, who wants the work
       and the credentials and needs neither.

   Serving all three from one undifferentiated homepage means
   each of them reads past the others' share of it. So the home
   page asks once and remembers the answer.

   TWO AXES, not three doors, and the distinction matters:

     audience   "learn" | "work"      who you are
     track      "finance" | "skills"  which library you came for,
                                      and only meaningful for a
                                      learner

   Keeping the learner one value rather than splitting it in two
   is what lets every rule written before the second school
   arrived, the nav order, the menu columns, the palette
   ranking, go on working untouched. `track` refines; it never
   contradicts.

   What the answer changes:
     · the order of the header nav (CSS only, see the `audience`
       block in styles.css, so there is no flash and no reflow)
     · which column of the overlay menu comes first
     · how the Ctrl+K palette ranks its results
     · which half of the home page leads, and which headline it
       is written in

   What it never changes: what exists. Nothing is hidden from
   anybody, no page becomes unreachable, and the choice is
   reversible from the menu and the footer on every page. It is a
   preference, not a gate: someone who picked "hiring" and then
   wants to read the Bangla library must never hit a wall.

   Both attributes are set before first paint by the inline
   script in each page's <head>, next to the theme. This module
   handles the behaviour on top of them.
   ============================================================ */

const KEY = "audience";
const TRACK_KEY = "track";
const VALID = new Set(["learn", "work"]);
const TRACKS = new Set(["finance", "skills"]);

export const getAudience = () => {
  try {
    const v = localStorage.getItem(KEY);
    return VALID.has(v) ? v : null;
  } catch {
    return null;
  }
};

export const getTrack = () => {
  try {
    const v = localStorage.getItem(TRACK_KEY);
    return TRACKS.has(v) ? v : null;
  } catch {
    return null;
  }
};

export function setAudience(value, track) {
  if (!VALID.has(value)) return;
  try {
    localStorage.setItem(KEY, value);
    /* A recruiter has no track. Clearing it rather than leaving
       the last one lying around means the work half is never
       described as "finance" or "skills"– it is neither. */
    if (value === "work") localStorage.removeItem(TRACK_KEY);
    else if (TRACKS.has(track)) localStorage.setItem(TRACK_KEY, track);
  } catch { /* private mode */ }
  apply(value, value === "work" ? null : (track ?? getTrack()));
  dispatchEvent(new CustomEvent("audience:change", { detail: value }));
}

export function setTrack(track) {
  if (!TRACKS.has(track)) return;
  setAudience("learn", track);
}

export function clearAudience() {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TRACK_KEY);
  } catch { /* ignore */ }
  document.documentElement.removeAttribute("data-audience");
  document.documentElement.removeAttribute("data-track");
  dispatchEvent(new CustomEvent("audience:change", { detail: null }));
}

function apply(value, track = getTrack()) {
  const root = document.documentElement;
  if (value) root.setAttribute("data-audience", value);
  else root.removeAttribute("data-audience");

  if (value === "learn" && TRACKS.has(track)) root.setAttribute("data-track", track);
  else root.removeAttribute("data-track");
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
    setAudience(door.dataset.audiencePick, door.dataset.trackPick);
    // the href carries on to the destination on its own
  });
}

/* ------------------------------------------------------------
   the switcher

   Small, quiet, and on every page: in the footer, and again in
   the overlay menu. Someone who chose wrong should be one tap
   from fixing it, wherever they realise.
   ------------------------------------------------------------ */
/* ------------------------------------------------------------
   Switching reloads the page, and it has to.

   Setting data-audience on <html> reorders the blocks, and that
   is all it does. It cannot touch the parts of a page that were
   decided BEFORE the CSS ran: the home page picks its headline,
   its standfirst and its button row in the inline script at the
   top of index.html, from the same stored value, because that
   choice has to be made before the first paint or the wrong
   headline is briefly visible.

   So a switch without a reload left a page half-swapped: the
   sections in the new order, under a hero still addressing the
   audience you just stopped being. The blocks moved and the
   headline did not, which reads as a bug even to someone who
   could not say what was wrong.

   A reload is also cheap here. The page is already in the HTTP
   cache, the service worker answers it, and browsers restore the
   scroll position themselves, so the switch reads as the page
   rearranging itself rather than as a navigation.
   ------------------------------------------------------------ */
function reload() {
  /* Guarded: a reload loop is the worst possible failure mode for
     this, and a browser that refuses the write above would give
     us one. If the value did not stick, do not reload. */
  try {
    if (localStorage.getItem(KEY) === document.documentElement.dataset.audience) {
      location.reload();
    }
  } catch { /* private mode: the ordering still changed, live with it */ }
}

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
    /* Going back to the library keeps whichever half of it they
       last read. Someone who came for German and wandered into a
       CV should land back in German, not in a savings lesson. */
    setAudience(button.dataset.to, getTrack() ?? "finance");
    paint();
    reload();
  });
  addEventListener("audience:change", paint);
  return button;
}

/** Finance ↔ skills, shown only to someone who is here to learn. */
function buildTrackSwitcher() {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "audience-switch track-switch";
  const paint = () => {
    const who = getAudience();
    const track = getTrack();
    button.hidden = who !== "learn";
    button.dataset.to = track === "skills" ? "finance" : "skills";
    button.textContent = track === "skills"
      ? "টাকা ও বিনিয়োগে ফিরে যান"
      : "দক্ষতার অংশে যান";
  };
  paint();
  button.addEventListener("click", () => {
    setTrack(button.dataset.to);
    paint();
    reload();
  });
  addEventListener("audience:change", paint);
  return button;
}

function initSwitcher() {
  const foot = document.querySelector("footer .wrap");
  if (!foot || foot.querySelector(".audience-switch")) return;
  const row = document.createElement("p");
  row.className = "audience-row";
  row.append(buildSwitcher(), buildTrackSwitcher());
  foot.append(row);
}

/* ------------------------------------------------------------
   ranking help for the command palette

   Both audiences see every result. The one they came for simply
   sorts above the one they didn't.
   ------------------------------------------------------------ */
const WORK_HINTS = new Set(["Page", "Article"]);
const WORK_URLS = ["/portfolio", "/about", "/contact", "/colophon"];
const SKILL_URLS = ["/skills", "/deutsch"];

export function audienceBoost(item) {
  const who = getAudience();
  if (!who) return 0;
  const isSkill = SKILL_URLS.some((u) => item.url.startsWith(u));
  const isMoney =
    item.url.startsWith("/learn") ||
    item.url.startsWith("/tools") ||
    item.hint === "Learn" ||
    item.hint === "Tool";
  const isLearn = isMoney || isSkill;
  const isWork = WORK_URLS.some((u) => item.url.startsWith(u)) ||
    (WORK_HINTS.has(item.hint) && !isLearn);

  if (who === "work") return isWork ? 220 : 0;
  if (!isLearn) return 0;

  /* Inside the library the track is a nudge, not a second wall:
     the half they came for goes above the half they didn't, and
     both stay well above the CV. */
  const track = getTrack();
  if (track === "skills") return isSkill ? 260 : 180;
  if (track === "finance") return isMoney ? 260 : 180;
  return 220;
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
