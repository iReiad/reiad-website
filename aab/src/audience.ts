/* audience.ts: the front door. Two axes, not three doors:
   `audience` is "learn" or "work" (who you are) and `track` is
   "finance" or "skills" (which library), meaningful only for a
   learner, so it refines and never contradicts.
   It changes what LEADS, never what exists: nothing is hidden and
   the choice is reversible from the menu and the footer. Both
   attributes are set before first paint by the boot script. */

const KEY = "audience";
const TRACK_KEY = "track";

/* The two vocabularies, said once. `AUDIENCES` in
   `shared/nav.ts` is the same pair and the boot script in
   `shell.tsx` accepts the same pair: a third value written here
   and nowhere else would be an attribute the stylesheet has no
   rule for. The unions below are derived rather than written out
   again, and the guards read these lists, so there is one copy of
   each word. */
const VALID = ["learn", "work"] as const;
const TRACKS = ["finance", "skills"] as const;

/** Who is reading: someone here to learn, or a recruiter. */
export type Audience = (typeof VALID)[number];
/** Which half of the library a learner came for. */
export type Track = (typeof TRACKS)[number];

const isAudience = (v: unknown): v is Audience => VALID.some((a) => a === v);
const isTrack = (v: unknown): v is Track => TRACKS.some((t) => t === v);

export const getAudience = (): Audience | null => {
  try {
    const v = localStorage.getItem(KEY);
    return isAudience(v) ? v : null;
  } catch {
    return null;
  }
};

export const getTrack = (): Track | null => {
  try {
    const v = localStorage.getItem(TRACK_KEY);
    return isTrack(v) ? v : null;
  } catch {
    return null;
  }
};

export function setAudience(value: string | undefined, track?: string): void {
  if (!isAudience(value)) return;
  try {
    localStorage.setItem(KEY, value);
    /* A recruiter has no track. Clearing it rather than leaving
       the last one lying around means the work half is never
       described as "finance" or "skills": it is neither. */
    if (value === "work") localStorage.removeItem(TRACK_KEY);
    else if (isTrack(track)) localStorage.setItem(TRACK_KEY, track);
  } catch { /* private mode */ }
  apply(value, value === "work" ? null : (track ?? getTrack()));
  dispatchEvent(new CustomEvent("audience:change", { detail: value }));
}

export function setTrack(track?: string): void {
  if (!isTrack(track)) return;
  setAudience("learn", track);
}

export function clearAudience(): void {
  try {
    localStorage.removeItem(KEY);
    localStorage.removeItem(TRACK_KEY);
  } catch { /* ignore */ }
  document.documentElement.removeAttribute("data-audience");
  document.documentElement.removeAttribute("data-track");
  dispatchEvent(new CustomEvent("audience:change", { detail: null }));
}

function apply(value: Audience | null, track: string | null = getTrack()): void {
  const root = document.documentElement;
  if (value) root.setAttribute("data-audience", value);
  else root.removeAttribute("data-audience");

  /* "learn", not "money". The audience is one of the two words in
     VALID above and the school's move to /money/ did not rename
     it, so this read "money" and could not be true: `data-track`
     was never set on any page. */
  if (value === "learn" && isTrack(track)) root.setAttribute("data-track", track);
  else root.removeAttribute("data-track");
}

/* ------------------------------------------------------------
   the doorway on the home page

   The markup ships in index.html rather than being built here,
   for two reasons: it must not flash in after paint, and with
   JavaScript off the two doors still have to be working links to
   the two halves of the site.
   ------------------------------------------------------------ */
function initDoorway(): void {
  const doorway = document.getElementById("doorway");
  if (!doorway) return;

  doorway.addEventListener("click", (e) => {
    const door = e.target instanceof Element
      ? e.target.closest<HTMLElement>("[data-audience-pick]")
      : null;
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
/* SWITCHING RELOADS, and it has to. `data-audience` reorders the
   blocks and nothing else: the headline, the standfirst and the
   button row are chosen before the first paint by the boot
   script, so a switch without a reload leaves the sections in the
   new order under a hero addressing the audience you just
   stopped being. The page is in the cache, so it reads as a
   rearrangement rather than as a navigation. */
function reload(): void {
  /* Guarded: a reload loop is the worst possible failure mode for
     this, and a browser that refuses the write above would give
     us one. If the value did not stick, do not reload. */
  try {
    if (localStorage.getItem(KEY) === document.documentElement.dataset.audience) {
      location.reload();
    }
  } catch { /* private mode: the ordering still changed, live with it */ }
}

function switcherLabel(current: Audience | null): string {
  return current === "work"
    ? "আমি শিখতে এসেছি: switch to the Bangla library"
    : "I'm hiring / need work done: switch";
}

function buildSwitcher(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "audience-switch";
  const paint = () => {
    const current = getAudience();
    button.textContent = switcherLabel(current);
    /* "learn", not "money": setAudience() takes one of the two
       words in VALID and dropped everything else, so this button
       switched a recruiter to nothing at all and then reloaded. */
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
function buildTrackSwitcher(): HTMLButtonElement {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "audience-switch track-switch";
  const paint = () => {
    const who = getAudience();
    const track = getTrack();
    // "learn", not "money", so this was hidden on every page.
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

function initSwitcher(): void {
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
const WORK_URLS = ["/portfolio", "/about", "/contact"];
const SKILL_URLS = ["/skills", "/deutsch"];

/** As much of one Ctrl+K row as ranking reads. `hint` is
    optional because `SearchEntry` in `shared/content.ts` has it
    optional: a page with no hint is a row with no hint. */
export interface PaletteItem {
  url: string;
  hint?: string;
}

export function audienceBoost(item: PaletteItem): number {
  const who = getAudience();
  if (!who) return 0;
  const isSkill = SKILL_URLS.some((u) => item.url.startsWith(u));
  const isMoney =
    item.url.startsWith("/money") ||
    item.url.startsWith("/tools") ||
    item.hint === "Learn" ||
    item.hint === "Tool";
  const isLearn = isMoney || isSkill;
  const isWork = WORK_URLS.some((u) => item.url.startsWith(u)) ||
    (item.hint !== undefined && WORK_HINTS.has(item.hint) && !isLearn);

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
export function menuOrder<T extends { work?: unknown }>(titles: T[]): T[] {
  const who = getAudience();
  if (who !== "work") return titles;
  // recruiters get pages and writing first, the library after
  return [...titles].sort((a, b) => Number(b.work ?? 0) - Number(a.work ?? 0));
}

export function initAudience(): void {
  apply(getAudience());
  initDoorway();
  initSwitcher();
}
