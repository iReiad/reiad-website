/* ============================================================
   school-hubs.ts: the four schools' hand-written pages.

   Three hubs. Prose, written by hand, explaining what each course
   asks of a learner every evening. Nothing in here comes out of a
   database and nothing about it is generated: the one live thing
   on each page is the ladder, and `/deutsch/hub.js` and its two
   siblings replace the fallback list below with one built from
   the reader's own progress, exactly as they did when these were
   files.

   ---- there were five ----

   The money school's hub and its full contents index have gone,
   August 2026. Both are rendered from the rows now, by
   `components/school-hub.tsx` and `components/school-contents.tsx`,
   which is where the other three are headed: a page that says how
   many lessons a school has should count them. The two strings
   are in `archive/schools-pages/`, where they were lifted from.

   ---- how it got here, and why it is a string ----

   archive/TRANSITION.md Stage 11.7. These five were `aab/money/index.html`
   and its four neighbours until 16 August 2026, and they are in
   `archive/schools-pages/` now. `archive/schools-builders/build-school-hubs.mjs`
   lifted them out verbatim, and `check-next.mjs` compared the copy
   against the original for as long as there was an original.

   They were copied rather than rewritten as JSX because a port is
   finished when it does what the thing it replaced did, and eight
   hundred lines of Bangla hand-converted into JSX is eight hundred
   chances to change a word that nobody reviewing the diff would
   catch. The reader who would catch it is the one this site is
   written for.

   ---- editing one ----

   Edit the string. This is the original now, not a copy of
   anything, and the generator that made it is archived because it
   had nothing left to read. What React owns is everything around
   the writing: the head, the header, the footer, the shell. That
   is the same division the article route has, where the body is
   HTML out of a row and the page around it is components.
   ============================================================ */

export interface SchoolHub {
  head: {
    title: string;
    description: string;
    canonical: string;
    ogImage: string;
    ogType: string;
  };
  /** The school's own scripts, in the order the page loads them.
      `/app.js` is not among them: every page of this site loads
      that one and the shell renders it. */
  scripts: string[];
}

export const SCHOOL_HUBS: Record<string, SchoolHub> = {
  "deutsch": {
    head: {
          "title": "জার্মান, বাংলায় · Deutsch von Herzen · Reiad's Library",
          "description": "বাংলা থেকে জার্মান, একদম শুরু থেকে: চারটা স্তর, রোজ একটা পাতার অনুশীলন। শব্দ মুখস্থ নয়, কাঠামো শেখা। বিনামূল্যে, লগইন ছাড়া।",
          "canonical": "https://reiad.co.uk/deutsch/index.html",
          "ogImage": "https://reiad.co.uk/og/deutsch.png",
          "ogType": "website"
    },
    scripts: ["/deutsch/hub.js"],
  },
  "quran": {
    head: {
          "title": "কুরআনের আরবি, অন্তর থেকে, Reiad's Library",
          "description": "তিন ধাপে ষাট দিন: কুরআনের শব্দ চেনা, বাক্য বোঝা, তারপর গোটা সূরা খুলে পড়া। বাংলায়, বিনামূল্যে, কোনো লেখা ছাড়াই।",
          "canonical": "https://reiad.co.uk/quran/index.html",
          "ogImage": "https://reiad.co.uk/og/quran.png",
          "ogType": "website"
    },
    scripts: ["/quran/hub.js"],
  },
  "english": {
    head: {
          "title": "মন থেকে ইংরেজি, বাংলাভাষীর জন্য, Reiad's Library",
          "description": "দুই টার্মে ইংরেজি: শব্দের ক্রম থেকে দুই মিনিট টানা বলা পর্যন্ত। মুখস্থ নয়, কাঠামো। সাথে ৩০ দিনের অনুশীলন খাতা, বাংলায়, বিনামূল্যে।",
          "canonical": "https://reiad.co.uk/english/index.html",
          "ogImage": "https://reiad.co.uk/og/english.png",
          "ogType": "website"
    },
    scripts: ["/english/hub.js"],
  },
};
