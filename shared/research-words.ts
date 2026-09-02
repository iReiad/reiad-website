/* ============================================================
   research-words.ts: the Research Studio's own words.

   Its own table beside `diet-words.ts`, for that file's reason:
   `stringKeys` in the stock fixture is "every phrase the stock
   check can render" and a studio phrase there weakens the app's
   assertion for both tools.

   In `shared/` because the Android app will draw the same rooms.
   Copy is DATA by the contract at the top of `CLAUDE.md`, so a
   line reworded here is reworded on a phone at the next fetch.

   `<W k="...">` in `next/components/research/lang.tsx` reads this
   and still renders BOTH languages into the DOM, which is the
   diet pages' own arrangement: the stylesheet picks, and the page
   works with JavaScript off. Both languages are REQUIRED and the
   type is what says so.
   ============================================================ */

import type { Phrase } from "./tool-strings.ts";

export const RESEARCH_WORDS: Record<string, Phrase> = {
  /* ---- the studio itself ---- */
  "rs.name": { en: "Research Studio", bn: "গবেষণা স্টুডিও" },
  "rs.lede": {
    en: "One place to do a piece of research from the first question to the last footnote. Everything you keep here is yours, on every device you sign in on.",
    bn: "প্রথম প্রশ্ন থেকে শেষ ফুটনোট পর্যন্ত একটা গবেষণা করার এক জায়গা। এখানে যা রাখবেন সবই আপনার, আর যে ডিভাইসে সাইন ইন করবেন সেখানেই থাকবে।",
  },
  "rs.signin.head": { en: "This is yours", bn: "এটা আপনার নিজের" },
  "rs.signin.body": {
    en: "The studio keeps your sources, notes and plans on your account, so they are the same on every device. Nothing here is shared with anybody.",
    bn: "স্টুডিও আপনার উৎস, নোট আর পরিকল্পনা আপনার অ্যাকাউন্টে রাখে, তাই সব ডিভাইসে একই থাকে। এখানকার কিছুই কারও সঙ্গে ভাগ হয় না।",
  },
  "rs.signin.go": { en: "Sign in", bn: "সাইন ইন" },
  "rs.moment": { en: "One moment", bn: "এক মুহূর্ত" },
  "rs.saved": { en: "Saved", bn: "রাখা হলো" },
  "rs.saving": { en: "Saving", bn: "রাখা হচ্ছে" },
  "rs.notsaved": { en: "That did not save. Try again.", bn: "এটা রাখা যায়নি। আবার চেষ্টা করুন।" },
  "rs.conflict": {
    en: "This changed somewhere else while you were typing. Reload to see the newer copy.",
    bn: "আপনি লিখতে লিখতে এটা অন্য কোথাও বদলে গেছে। নতুন কপি দেখতে পাতাটা রিলোড করুন।",
  },
  "rs.soon.head": { en: "This room is not built yet", bn: "এই ঘরটা এখনো তৈরি হয়নি" },
  "rs.soon.body": {
    en: "It is in the plan and it is coming. Until then, the library, the notebook, the questions and the task list are open.",
    bn: "এটা পরিকল্পনায় আছে আর আসছে। ততক্ষণ লাইব্রেরি, খাতা, প্রশ্ন আর কাজের তালিকা খোলা।",
  },
  "rs.rooms": { en: "The rooms", bn: "ঘরগুলো" },
  "rs.find": { en: "Filter", bn: "ছাঁকুন" },
  "rs.new": { en: "New", bn: "নতুন" },
  "rs.delete": { en: "Remove", bn: "সরান" },
  "rs.restore": { en: "Put back", bn: "ফিরিয়ে আনুন" },
  "rs.none": { en: "Nothing here yet.", bn: "এখানে এখনো কিছু নেই।" },
  "rs.all": { en: "All", bn: "সব" },
  "rs.project": { en: "Project", bn: "প্রজেক্ট" },
  "rs.projects": { en: "Projects", bn: "প্রজেক্টগুলো" },
  "rs.noproject": { en: "No project", bn: "কোনো প্রজেক্ট নয়" },
  "rs.tags": { en: "Tags", bn: "ট্যাগ" },
  "rs.collections": { en: "Collections", bn: "সংগ্রহ" },
  "rs.updated": { en: "Updated", bn: "হালনাগাদ" },

  /* ---- the board ---- */
  "rs.board.capture": { en: "Capture", bn: "টুকে রাখুন" },
  "rs.board.capture.hint": {
    en: "A thought, a DOI, a link, a pasted reference, or a line starting with todo. The box decides what it is and says so.",
    bn: "একটা ভাবনা, একটা DOI, একটা লিংক, পেস্ট করা রেফারেন্স, বা todo দিয়ে শুরু একটা লাইন। বাক্সটা নিজেই বুঝে নেয় সেটা কী, আর বলে দেয়।",
  },
  "rs.board.today": { en: "Today", bn: "আজ" },
  "rs.board.today.empty": {
    en: "Nothing is in today's lane. Move a task here from the planner when you decide to do it.",
    bn: "আজকের লেনে কিছু নেই। যখন ঠিক করবেন কোনটা করবেন, পরিকল্পনা থেকে সেটা এখানে আনুন।",
  },
  "rs.board.resume": { en: "Pick up where you left off", bn: "যেখানে ছেড়েছিলেন" },
  "rs.board.resume.empty": {
    en: "The last things you opened will appear here, on whichever device you open them on.",
    bn: "শেষ যা খুলেছিলেন সেগুলো এখানে দেখাবে, যে ডিভাইসেই খুলুন না কেন।",
  },
  "rs.board.inbox": { en: "Inbox", bn: "ইনবক্স" },
  "rs.board.inbox.empty": {
    en: "Captures not yet filed will wait here. The inbox's job is to become empty.",
    bn: "যেসব টুকরো এখনো গোছানো হয়নি সেগুলো এখানে অপেক্ষা করবে। ইনবক্সের কাজ খালি হয়ে যাওয়া।",
  },
  "rs.board.search": { en: "Search everything", bn: "সব কিছুতে খুঁজুন" },
  "rs.board.search.empty": {
    en: "Sources, notes, questions and tasks, by any word in them.",
    bn: "উৎস, নোট, প্রশ্ন আর কাজ, তার ভেতরের যেকোনো শব্দ দিয়ে।",
  },
  "rs.board.nothing": { en: "Nothing matched.", bn: "কিছু মেলেনি।" },
  "rs.board.decided.doi": { en: "A DOI. Looked up and filed as a source.", bn: "একটা DOI। খুঁজে উৎস হিসেবে রাখা হলো।" },
  "rs.board.decided.isbn": { en: "An ISBN. Looked up and filed as a book.", bn: "একটা ISBN। খুঁজে বই হিসেবে রাখা হলো।" },
  "rs.board.decided.url": { en: "A link. Clipped and filed as a source.", bn: "একটা লিংক। ক্লিপ করে উৎস হিসেবে রাখা হলো।" },
  "rs.board.decided.bib": { en: "A reference. Parsed and filed.", bn: "একটা রেফারেন্স। পড়ে রাখা হলো।" },
  "rs.board.decided.todo": { en: "A task, in this week's lane.", bn: "একটা কাজ, এই সপ্তাহের লেনে।" },
  "rs.board.decided.note": { en: "A capture, in the inbox.", bn: "একটা টুকরো, ইনবক্সে।" },
  "rs.board.decided.dup": { en: "Already in the library. Opened it instead.", bn: "লাইব্রেরিতে আগেই আছে। সেটাই খোলা হলো।" },
  "rs.board.decided.fail": { en: "Could not look that up. Kept as a capture.", bn: "এটা খুঁজে পাওয়া যায়নি। টুকরো হিসেবে রাখা হলো।" },

  /* ---- the library ---- */
  "rs.lib.add": { en: "Add a source", bn: "উৎস যোগ করুন" },
  "rs.lib.add.hint": {
    en: "A DOI, an ISBN, a link, or a pasted BibTeX, RIS or CSL record. Or drop a .bib, .ris or .json file on the list.",
    bn: "একটা DOI, ISBN, লিংক, বা পেস্ট করা BibTeX, RIS বা CSL রেকর্ড। অথবা তালিকার উপর একটা .bib, .ris বা .json ফাইল ছেড়ে দিন।",
  },
  "rs.lib.lookup": { en: "Look up", bn: "খুঁজুন" },
  "rs.lib.import": { en: "Import a file", bn: "ফাইল আনুন" },
  "rs.lib.imported": { en: "added", bn: "যোগ হলো" },
  "rs.lib.skipped": { en: "already there", bn: "আগেই ছিল" },
  "rs.lib.empty": {
    en: "No sources yet. Paste a DOI above, drop an export from Zotero or Scholar, or pull your Zotero library from Settings.",
    bn: "এখনো কোনো উৎস নেই। উপরে একটা DOI পেস্ট করুন, Zotero বা Scholar থেকে এক্সপোর্ট ছেড়ে দিন, বা সেটিংস থেকে আপনার Zotero লাইব্রেরি টেনে আনুন।",
  },
  "rs.lib.type": { en: "Type", bn: "ধরন" },
  "rs.lib.status": { en: "Reading", bn: "পড়া" },
  "rs.lib.status.unread": { en: "Unread", bn: "পড়া হয়নি" },
  "rs.lib.status.skimmed": { en: "Skimmed", bn: "চোখ বোলানো" },
  "rs.lib.status.read": { en: "Read", bn: "পড়া হয়েছে" },
  "rs.lib.status.annotated": { en: "Annotated", bn: "নোট করা" },
  "rs.lib.status.cited": { en: "Cited", bn: "উদ্ধৃত" },
  "rs.lib.priority": { en: "Priority", bn: "অগ্রাধিকার" },
  "rs.lib.rating": { en: "Your rating", bn: "আপনার মূল্যায়ন" },
  "rs.lib.why": { en: "Why I saved this", bn: "কেন রাখলাম" },
  "rs.lib.title": { en: "Title", bn: "শিরোনাম" },
  "rs.lib.authors": { en: "Authors", bn: "লেখক" },
  "rs.lib.authors.hint": { en: "Family, Given; Family, Given", bn: "পদবি, নাম; পদবি, নাম" },
  "rs.lib.year": { en: "Year", bn: "সাল" },
  "rs.lib.container": { en: "Journal, book or publisher", bn: "জার্নাল, বই বা প্রকাশক" },
  "rs.lib.volume": { en: "Volume", bn: "খণ্ড" },
  "rs.lib.issue": { en: "Issue", bn: "সংখ্যা" },
  "rs.lib.pages": { en: "Pages", bn: "পৃষ্ঠা" },
  "rs.lib.doi": { en: "DOI", bn: "DOI" },
  "rs.lib.url": { en: "Link", bn: "লিংক" },
  "rs.lib.abstract": { en: "Abstract", bn: "সারসংক্ষেপ" },
  "rs.lib.key": { en: "Citation key", bn: "উদ্ধৃতি কী" },
  "rs.lib.key.hint": {
    en: "Made once and never regenerated: a draft's citations hold it.",
    bn: "একবারই তৈরি হয়, আর বদলায় না: খসড়ার উদ্ধৃতিগুলো এটাই ধরে রাখে।",
  },
  "rs.lib.verified": { en: "Verified record", bn: "যাচাই করা রেকর্ড" },
  "rs.lib.unverified": { en: "Unverified: check me", bn: "যাচাই হয়নি: দেখে নিন" },
  "rs.lib.via": { en: "Added via", bn: "যেভাবে এসেছে" },
  "rs.lib.reference": { en: "Reference", bn: "রেফারেন্স" },
  "rs.lib.copybib": { en: "Copy as BibTeX", bn: "BibTeX হিসেবে কপি" },
  "rs.lib.copyris": { en: "Copy as RIS", bn: "RIS হিসেবে কপি" },
  "rs.lib.notes": { en: "Notes about this", bn: "এটা নিয়ে নোট" },
  "rs.lib.note.new": { en: "Write a literature note", bn: "পড়ার নোট লিখুন" },
  "rs.lib.bin": { en: "In the bin", bn: "বিনে" },
  "rs.lib.bin.hint": {
    en: "Kept for thirty days, then gone.",
    bn: "তিরিশ দিন রাখা হয়, তারপর চলে যায়।",
  },
  "rs.lib.open": { en: "Open", bn: "খুলুন" },
  "rs.lib.merge": {
    en: "Looks like the same paper as one already here.",
    bn: "মনে হচ্ছে এখানে আগে থেকেই থাকা একটা পেপারের সঙ্গে মিলে যাচ্ছে।",
  },

  /* ---- the notebook ---- */
  "rs.notes.kind": { en: "Kind", bn: "ধরন" },
  "rs.notes.title": { en: "Title", bn: "শিরোনাম" },
  "rs.notes.empty": {
    en: "No notes yet. Press New, or capture a thought from the board.",
    bn: "এখনো কোনো নোট নেই। নতুন চাপুন, বা বোর্ড থেকে একটা ভাবনা টুকে রাখুন।",
  },
  "rs.notes.source": { en: "About a source", bn: "যে উৎস নিয়ে" },
  "rs.notes.links": { en: "Links to", bn: "যেখানে যুক্ত" },
  "rs.notes.backlinks": { en: "Linked from", bn: "যেখান থেকে যুক্ত" },
  "rs.notes.body": { en: "The note", bn: "নোট" },
  "rs.notes.daily": { en: "Today's log", bn: "আজকের খাতা" },
  "rs.notes.daily.template": {
    en: "Time spent:\nWhat I did:\nWhat I learned:\nWhat is blocking me:\nTomorrow's first task:",
    bn: "কত সময়:\nকী করলাম:\nকী শিখলাম:\nকোথায় আটকে আছি:\nকালকের প্রথম কাজ:",
  },

  /* ---- questions ---- */
  "rs.q.new": { en: "New question", bn: "নতুন প্রশ্ন" },
  "rs.q.text": { en: "The question", bn: "প্রশ্নটা" },
  "rs.q.kind": { en: "Kind", bn: "ধরন" },
  "rs.q.state": { en: "State", bn: "অবস্থা" },
  "rs.q.state.open": { en: "Open", bn: "চলছে" },
  "rs.q.state.parked": { en: "Parked", bn: "থামানো" },
  "rs.q.state.answered": { en: "Answered", bn: "উত্তর পাওয়া" },
  "rs.q.note": { en: "Where this stands", bn: "এখন কোথায় আছে" },
  "rs.q.evidence": { en: "Evidence", bn: "প্রমাণ" },
  "rs.q.evidence.add": { en: "Add a source as evidence", bn: "উৎসকে প্রমাণ হিসেবে যোগ করুন" },
  "rs.q.evidence.empty": {
    en: "Nothing speaks to this yet. Pick a source from the library and say whether it supports it, contradicts it, gives a method, or gives context.",
    bn: "এটা নিয়ে এখনো কিছু বলে না। লাইব্রেরি থেকে একটা উৎস বেছে বলুন সেটা সমর্থন করে, খণ্ডন করে, পদ্ধতি দেয়, না প্রেক্ষাপট দেয়।",
  },
  "rs.q.stance.supports": { en: "supports", bn: "সমর্থন করে" },
  "rs.q.stance.contradicts": { en: "contradicts", bn: "খণ্ডন করে" },
  "rs.q.stance.method": { en: "gives a method", bn: "পদ্ধতি দেয়" },
  "rs.q.stance.context": { en: "gives context", bn: "প্রেক্ষাপট দেয়" },
  "rs.q.children": { en: "Under this", bn: "এর নিচে" },
  "rs.q.carried": { en: "Carried from the old desk", bn: "পুরোনো ডেস্ক থেকে আনা" },
  "rs.q.empty": {
    en: "No questions yet. A research question at the top, hypotheses under it, claims under those.",
    bn: "এখনো কোনো প্রশ্ন নেই। উপরে গবেষণার প্রশ্ন, তার নিচে অনুমান, তার নিচে দাবি।",
  },

  /* ---- tasks ---- */
  "rs.tasks.new": { en: "New task", bn: "নতুন কাজ" },
  "rs.tasks.due": { en: "Due", bn: "শেষ তারিখ" },
  "rs.tasks.empty": {
    en: "Nothing in this lane.",
    bn: "এই লেনে কিছু নেই।",
  },
  "rs.tasks.move": { en: "Move to", bn: "সরান" },
  "rs.tasks.days": { en: "days", bn: "দিন" },
  "rs.tasks.waiting.since": { en: "waiting since", bn: "অপেক্ষা শুরু" },

  /* ---- settings ---- */
  "rs.set.prefs": { en: "Preferences", bn: "পছন্দ" },
  "rs.set.name": { en: "Your name on exports", bn: "এক্সপোর্টে আপনার নাম" },
  "rs.set.affiliation": { en: "Affiliation", bn: "প্রতিষ্ঠান" },
  "rs.set.orcid": { en: "ORCID", bn: "ORCID" },
  "rs.set.style": { en: "Default citation style", bn: "ডিফল্ট উদ্ধৃতি রীতি" },
  "rs.set.dense": { en: "Dense mode", bn: "ঘন সাজানো" },
  "rs.set.dense.hint": {
    en: "Less air around everything in the studio. The one place on this site a reader may ask for less.",
    bn: "স্টুডিওর সব কিছুর চারপাশে কম ফাঁকা। এই সাইটে এটাই একমাত্র জায়গা যেখানে কম চাওয়া যায়।",
  },
  "rs.set.projects.hint": {
    en: "A doctorate, a paper, a book, an application. One source or note can belong to several.",
    bn: "একটা ডক্টরেট, একটা পেপার, একটা বই, একটা আবেদন। একটা উৎস বা নোট কয়েকটার হতে পারে।",
  },
  "rs.set.project.name": { en: "Name", bn: "নাম" },
  "rs.set.project.kind": { en: "Kind", bn: "ধরন" },
  "rs.set.project.new": { en: "New project", bn: "নতুন প্রজেক্ট" },
  "rs.set.connections": { en: "Connections", bn: "সংযোগ" },
  "rs.set.connections.hint": {
    en: "What the studio can reach from here. A service that is off is a sentence on the page, never an error.",
    bn: "স্টুডিও এখান থেকে কোথায় পৌঁছাতে পারে। যে সেবা বন্ধ, পাতায় সেটা একটা বাক্য, ভুল নয়।",
  },
  "rs.set.zotero": { en: "Pull from Zotero", bn: "Zotero থেকে আনুন" },
  "rs.set.zotero.hint": {
    en: "Your numeric user id and a read-only API key from zotero.org/settings/keys. Neither is stored: they are used for this one pull and forgotten.",
    bn: "zotero.org/settings/keys থেকে আপনার সংখ্যার ইউজার আইডি আর শুধু-পড়ার API কী। কোনোটাই রাখা হয় না: এই একবার টানার জন্য ব্যবহার হয়, তারপর ভুলে যাওয়া হয়।",
  },
  "rs.set.zotero.user": { en: "Zotero user id", bn: "Zotero ইউজার আইডি" },
  "rs.set.zotero.key": { en: "API key", bn: "API কী" },
  "rs.set.zotero.go": { en: "Pull the library", bn: "লাইব্রেরি টানুন" },
  "rs.set.clipper": { en: "Save to the studio", bn: "স্টুডিওতে রাখুন" },
  "rs.set.clipper.hint": {
    en: "Drag this to your bookmarks bar. On a paper's page, press it and the paper is filed here.",
    bn: "এটা আপনার বুকমার্ক বারে টেনে নিন। কোনো পেপারের পাতায় থাকা অবস্থায় চাপলে পেপারটা এখানে রাখা হবে।",
  },
  "rs.set.on": { en: "connected", bn: "সংযুক্ত" },
  "rs.set.off": { en: "not connected", bn: "সংযুক্ত নয়" },

  /* ---- the archive ---- */
  "rs.arc.activity": { en: "Everything that happened", bn: "যা যা হয়েছে" },
  "rs.arc.activity.empty": {
    en: "Every write the studio makes is a line here, so nothing is lost and everything can be found again.",
    bn: "স্টুডিও যা লেখে তার প্রতিটি এখানে এক লাইন, তাই কিছু হারায় না আর সব আবার খুঁজে পাওয়া যায়।",
  },
  "rs.arc.export": { en: "Take a copy", bn: "একটা কপি নিন" },
  "rs.arc.export.hint": {
    en: "Every row of the studio as JSON, and the library as BibTeX and RIS beside it.",
    bn: "স্টুডিওর প্রতিটি সারি JSON হিসেবে, আর পাশে লাইব্রেরি BibTeX আর RIS হিসেবে।",
  },
  "rs.arc.versions": { en: "Versions", bn: "সংস্করণ" },
  "rs.arc.bin": { en: "The bin", bn: "বিন" },
};

/** One phrase, or a loud marker for a key nobody wrote. */
export const word = (k: string): Phrase =>
  RESEARCH_WORDS[k] ?? { en: `[${k}]`, bn: `[${k}]` };
