/* ============================================================
   streak.js: which days somebody actually turned up.

   The four courses each record WHAT has been read. None of them
   records WHEN, and that turns out to be the one thing a person
   setting up an account wants back: "how am I doing" is a question
   about days, not about lessons.

   So this keeps one list of dates. A day goes in when any of the
   four courses announces progress, once, and never comes out. It
   is about forty bytes a year.

   WHAT THIS IS NOT

   There is no flame, no "don't lose your streak", and nothing
   here is ever shown as a warning. The site has no notifications
   and is not getting any. A count of days is a fact somebody
   asked for; a count of days with a threat attached is a
   different product. `run()` exists because "eleven days in a
   row" is a nice thing to be told once on a settings page, not
   because anything should happen when it ends.

   Dates are local, not UTC. Somebody in Dhaka reading at 1am has
   turned up today, by any definition of "today" they would use.

   archive/TRANSITION.md, Stage 6: this rides on the same sync as the rest
   of the progress, as a union, so two devices give the true set
   of days rather than whichever synced last.
   ============================================================ */

const KEY = "days-active";

/* The four courses' own events, which they already fire. Nothing
   here has to be added to a school for this to work, which is the
   same bargain sync.js struck. */
const EVENTS = ["learn:progress", "deutsch:progress", "english:progress", "quran:progress"];

/** Local YYYY-MM-DD, which is what a person means by a date. */
export function today(at = new Date()) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${at.getFullYear()}-${pad(at.getMonth() + 1)}-${pad(at.getDate())}`;
}

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const value = raw === null ? [] : JSON.parse(raw);
    return Array.isArray(value) ? value.filter((d) => typeof d === "string") : [];
  } catch {
    return [];
  }
};

const write = (days) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(days));
    return true;
  } catch {
    return false;           // private mode: the courses still work
  }
};

/** Every day this person has done something, oldest first. */
export const activeDays = () => [...new Set(read())].sort();

/** Today, recorded once. Returns whether it was new. */
export function markToday() {
  const days = read();
  const now = today();
  if (days.includes(now)) return false;
  const next = [...days, now].sort();
  if (!write(next)) return false;
  dispatchEvent(new CustomEvent("streak:changed"));
  return true;
}

/**
 * How many of the last `span` days had something on them, counted
 * back from today inclusive. Seven is a week the way a person
 * means it: the last seven days, not since Monday.
 */
export function daysIn(span = 7) {
  const days = new Set(read());
  let n = 0;
  for (let back = 0; back < span; back += 1) {
    const day = new Date();
    day.setDate(day.getDate() - back);
    if (days.has(today(day))) n += 1;
  }
  return n;
}

/**
 * Consecutive days up to today, or up to yesterday if today is
 * still empty. Counting from yesterday matters: at nine in the
 * morning a run of eleven days is not over, and telling somebody
 * it has reset before they have had breakfast is just wrong.
 */
export function run() {
  const days = new Set(read());
  if (!days.size) return 0;

  const start = new Date();
  if (!days.has(today(start))) {
    start.setDate(start.getDate() - 1);
    if (!days.has(today(start))) return 0;
  }

  let n = 0;
  const cursor = new Date(start);
  while (days.has(today(cursor))) {
    n += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return n;
}

/** Wired once by app.js, on every page, signed in or not. */
export function initStreak() {
  EVENTS.forEach((event) =>
    addEventListener(event, markToday, { passive: true }));
}
