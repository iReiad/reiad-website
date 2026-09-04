/* streak.ts: which days somebody actually turned up, under
   `days-active`. A day goes in when any of the four schools
   announces progress and never comes out.
   No flame, no warning, no notification: a count of days with a
   threat attached is a different product. Dates are LOCAL rather
   than UTC, because somebody in Dhaka reading at 1am has turned
   up today. Synced as a union, so two devices give the true set. */
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
        /* Whatever is under the key, which is not necessarily a list
           of dates: another tab, an older version of this file or a
           reader with the console open can all have put something
           else there, and a `day` that is not a string would reach
           every caller below. */
        const value = raw === null ? [] : JSON.parse(raw);
        const list = Array.isArray(value) ? value : [];
        return list.filter((d) => typeof d === "string");
    }
    catch {
        return [];
    }
};
const write = (days) => {
    try {
        localStorage.setItem(KEY, JSON.stringify(days));
        return true;
    }
    catch {
        return false; // private mode: the courses still work
    }
};
/** Every day this person has done something, oldest first. */
export const activeDays = () => [...new Set(read())].sort();
/** Today, recorded once. Returns whether it was new. */
export function markToday() {
    const days = read();
    const now = today();
    if (days.includes(now))
        return false;
    const next = [...days, now].sort();
    if (!write(next))
        return false;
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
        if (days.has(today(day)))
            n += 1;
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
    if (!days.size)
        return 0;
    const start = new Date();
    if (!days.has(today(start))) {
        start.setDate(start.getDate() - 1);
        if (!days.has(today(start)))
            return 0;
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
    EVENTS.forEach((event) => addEventListener(event, markToday, { passive: true }));
}
