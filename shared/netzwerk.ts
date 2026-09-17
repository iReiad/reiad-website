/* ============================================================
   netzwerk.ts: the Netzwerk neu study planner, A1 to B2.

   One workbook, ported whole: the chapter map, the grammar
   priority list, the daily method, the two routes' week-by-week
   plans, the chapter tracker's spaced reviews, the daily log and
   practice tracker arithmetic, the content library, the exams and
   the tips. `/deutsch/advanced` draws it and
   `next/lib/netzwerk-store.ts` keeps what a learner types.

   ---- the plan is GENERATED, never stored ----

   Both routes are a rule, not a list: a chapter is N sessions,
   every third chapter is followed by a Plattform and a review,
   every level ends in an exam block, and the bridge compresses A1
   and A2 into 48 sessions by chapter mode. `planFor()` writes the
   92 weeks out of those rules, and `scripts/netzwerk.test.ts`
   holds it to the workbook's own rows in
   `scripts/fixtures/netzwerk-plan.json`, cell by cell. A stored
   plan would be right on the day it was typed and wrong the first
   time a start date moved.

   ---- what is a learner's and what is the book's ----

   Everything below is the book's and is the same for everybody.
   A learner is a name, a route, a start date and their own
   settings, and everything they tick or type is keyed by chapter
   or by week against these tables: see `Learner` at the bottom.

   ---- two routes, not two people ----

   The workbook was written for two named learners. Here they are
   Route A (every chapter, 52 weeks) and Route B (the bridge, then
   B1 and B2, 40 weeks), and any number of learners can share one
   device on either.

   The data below is written out of the workbook by a script and
   is data, not prose: edit a value here and the page, the plan
   and the test all move. `hours` on a chapter is the workbook's
   own estimate for a 65-minute session and not a Klett figure.
   ============================================================ */

export type Level = "A1" | "A2" | "B1" | "B2";
export const LEVEL_ORDER: readonly Level[] = ["A1", "A2", "B1", "B2"];
export type Route = "A" | "B";

export interface LevelInfo {
  level: Level;
  book: string;
  /** Weeks on Route A. */
  weeksA: number;
  /** Weeks on Route B, or the bridge's share of them, in words. */
  weeksB: string;
  sessionsPerChapter: number;
  chapters: number;
  certify: string;
}

export interface RouteInfo {
  route: Route;
  name: string;
  path: string;
  weeks: number;
  sessions: number;
}

export interface StartInput { label: string; value: number | string; note: string }

export type Priority = "Core" | "Standard" | "Light";
export type BridgeMode = "Bridge-full" | "Bridge-skim" | "Full" | "Full+" | "Full (light)";

export interface Chapter {
  level: Level;
  n: number;
  title: string;
  themes: string;
  grammar: string;
  phrases: string;
  priority: Priority;
  /** Sessions on Route A. */
  sessions: number;
  /** Hours on Route A, the workbook's own estimate. */
  hours: number;
  tip: string;
  /** How Route B treats it. */
  bridge: BridgeMode;
  bridgeSessions: number;
  book: string;
  /** The line the week plan prints under "grammar focus". */
  focus: string;
}

export interface GrammarPoint {
  n: number;
  point: string;
  level: string;
  chapters: string;
  /** 5 is automatic in speech before moving up; 1 is recognise it. */
  priority: number;
  payoff: string;
  budget: string;
  rule: string;
  skip: string;
}

export interface MethodRow { block: string; minutes: string; what: string; how: string; why: string }
export interface MethodSection { id: string; title: string; columns: string[]; rows: MethodRow[] }

export interface Resource {
  level: string; skill: string; name: string; what: string; how: string; minutes: string; cost: string;
}

export interface Exam {
  level: Level; options: string; format: string; pass: string; when: string; where: string;
  prep: string; recommendation: string;
}

export interface Milestone { when: string; what: string }
export interface Tip { category: string; tip: string; why: string }

export const LEVELS: LevelInfo[] = [
  {"level": "A1", "book": "Netzwerk neu A1 (Klett, 2019)", "weeksA": 10, "weeksB": "3 (bridge)", "sessionsPerChapter": 4, "chapters": 12, "certify": "Optional – but the A1 certificate is the standard German spouse-visa requirement, so consider it if you need one."},
  {"level": "A2", "book": "Netzwerk neu A2 (Klett, 2020)", "weeksA": 10, "weeksB": "5 (bridge)", "sessionsPerChapter": 4, "chapters": 12, "certify": "Optional"},
  {"level": "B1", "book": "Netzwerk neu B1 (Klett, 2021)", "weeksA": 14, "weeksB": "14", "sessionsPerChapter": 5, "chapters": 12, "certify": "Yes – Goethe B1 is the first certificate employers/authorities recognise."},
  {"level": "B2", "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "weeksA": 18, "weeksB": "18", "sessionsPerChapter": 7, "chapters": 12, "certify": "Yes – Goethe B2 for skilled work / study."},
];

export const ROUTES_TABLE: RouteInfo[] = [
  {"route": "A", "name": "Route A", "path": "A1 → A2 → B1 → B2 (every chapter, 4/4/5/7 sessions per chapter)", "weeks": 52, "sessions": 312},
  {"route": "B", "name": "Route B", "path": "Bridge (A1+A2 compressed, 8 weeks) → B1 → B2", "weeks": 40, "sessions": 240},
];

export const INPUTS: StartInput[] = [
  {"label": "Start date (choose a Monday)", "value": "2026-09-21", "note": "Assumption: first Monday after the workbook was built. Change freely – all plans/trackers follow."},
  {"label": "Weekday session length, Mon–Fri (minutes)", "value": 65, "note": "High-effort but short. 65 min = 10 warm-up + 20 input + 10 grammar + 15 output + 10 listening."},
  {"label": "Saturday session length (minutes)", "value": 75, "note": "Saturday = self-check, Plattform/exam training, couple speaking."},
  {"label": "Study days per week", "value": 6, "note": "Sunday is rest or passive listening only."},
  {"label": "Weekly speaking target, outside sessions (minutes)", "value": 60, "note": "Recorded monologues + couple talk + tutor/tandem."},
  {"label": "Weekly listening target, outside sessions (minutes)", "value": 90, "note": "Podcasts / Nicos Weg / Easy German – passive time on commutes etc."},
  {"label": "Weekly writing pieces target", "value": 2, "note": "A1–A2: 60–100 words each. B1: 120–150. B2: 200+."},
  {"label": "New vocabulary cards per day (Anki)", "value": 15, "note": "From the Übungsbuch 'Lernwortschatz' list only. 15/day ≈ 90/week ≈ every chapter list covered."},
  {"label": "Realistic-plan multiplier (buffer on the aggressive plan)", "value": 1.3, "note": "Real life slips ~30%. Both finish dates are shown so you can plan around the honest one."},
];

export const METHOD_LINES: string[] = ["1. One 65-minute session a day, six days a week. Short and high-intensity beats long and passive.", "2. Every session ends with output: you SPEAK (recorded) and WRITE 5 sentences. Input without output does not become German.", "3. Audio first: play each Kursbuch page's audio with the book closed before you read. Listening is the skill self-learners neglect most.", "4. Grammar is learned from the chapter's 'Kurz und klar' page + 5 sentences of your own, then the Übungsbuch: never from reading the rule three times.", "5. Vocabulary only from the Übungsbuch 'Lernwortschatz' lists, as sentence cards in Anki, 15 new per day, reviews every day (10 min).", "6. Priority rule: verbs, cases, word order and the connectors get 100%. Culture texts, projects and film pages get one pass, no cards.", "7. Spaced review: each chapter is reviewed at +2 days, +7 days and +30 days (Chapter Tracker does the dates for you).", "8. Every third chapter: the book's Plattform pages are a timed exam-format self-test. Score < 70% = one repeat week before moving on.", "9. The partner advantage: 10–15 min of German-only talk daily; the Route A learner teaches the Route B learner the A1/A2 items they have just mastered (teaching = strongest retention).", "10. Route B: the bridge is not optional. B1 assumes ~200 hours of German. Eight bridge weeks on the A1/A2 'Kurz und klar' pages + word lists is the structured version of 'checking A1/A2 as needed'."];

export const LEGEND: string[] = ["Yellow fill = you type here", "Grey fill = example row (overwrite or delete)", "Orange = Core chapter / top-priority grammar", "Green = Light chapter (skim)", "Black text = formulas – don't overwrite; blue text = inputs"];

export const CHAPTERS: Chapter[] = [
  {"level": "A1", "n": 1, "title": "Guten Tag!", "themes": "Greetings, introducing yourself and others, asking how someone is, where you are from, numbers 0–20, alphabet & spelling, phone numbers, e-mail addresses, countries and languages.", "grammar": "sein; verb endings ich/du/Sie/er/sie; statement (verb 2nd), W-questions, yes/no questions; personal pronouns; numbers 0–20.", "phrases": "Ich heiße… / Ich komme aus… / Wie geht's? / Wie bitte? Können Sie das buchstabieren?", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Drill the 3 sentence shapes (statement / W-question / yes-no) until automatic. Country names: learn 10, not 40.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "sein, verb endings, 3 sentence shapes"},
  {"level": "A1", "n": 2, "title": "Freunde, Kollegen und ich", "themes": "Hobbies, friends, weekdays, making plans (cinema), jobs & working hours, numbers 20+, learning articles, filling in a form.", "grammar": "Full present-tense conjugation (incl. haben); articles der/die/das; er/sie/es for things; negation with nicht; weekdays; numbers 20–1000.", "phrases": "Ich spiele gern… / Ich arbeite als… / Hast du am Montag Zeit? / Ich bin von Beruf…", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "THE article habit starts here: never learn a noun without der/die/das (colour-code). Job list: learn only the 10 you'd actually use.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "conjugation, articles, nicht"},
  {"level": "A1", "n": 3, "title": "In Hamburg", "themes": "Places & buildings in a city, taxi ride, asking about places, transport, asking for and giving directions, events, seasons & months.", "grammar": "Definite/indefinite article & kein; noun plurals; Imperativ Sie (Gehen Sie geradeaus); mit dem Bus (first Dativ contact); Wo ist…?", "phrases": "Entschuldigung, wo ist…? / Gehen Sie links/rechts/geradeaus. / Gibt es hier…?", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Master 10 direction phrases as chunks. Skim the Hamburg event texts (international words are for confidence, not for cards).", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "kein, plurals, Imperativ Sie, directions"},
  {"level": "A1", "n": 4, "title": "Guten Appetit!", "themes": "Food & shops, understanding and replying to an invitation, planning shopping, supermarket dialogue, prices, meals & eating habits, word-learning strategies, jobs around food.", "grammar": "Akkusativ (den/einen/keinen); verbs with Akkusativ; möchten; word position of nicht; compound nouns; Imperativ du/ihr (basic).", "phrases": "Ich hätte gern… / Was kostet…? / Ich mag… / Kommst du am Samstag? – Ja, gern. / Leider…", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Akkusativ is the first real case: do EVERY Übungsbuch exercise here. Food vocabulary at 60% is fine: you'll meet it again in A2.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Akkusativ, möchten, Komposita"},
  {"level": "A1", "n": 5, "title": "Alltag und Familie", "themes": "Daily routine, telling the time, appointments/diary, family, arranging to meet, making an appointment by phone, apologising for being late.", "grammar": "Separable verbs (Satzklammer); clock times; temporal prepositions am/um/von…bis; possessive articles mein/dein/sein/ihr; first modal verbs (können/müssen).", "phrases": "Ich stehe um 7 Uhr auf. / Wann hast du Zeit? / Kann ich einen Termin haben? / Tut mir leid, ich komme zu spät.", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "The Satzklammer (verb bracket) is the most important word-order pattern in German. Say 30 separable-verb sentences aloud: not just fill-in-the-gaps.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "trennbare Verben, Uhrzeit, Possessivartikel"},
  {"level": "A1", "n": 6, "title": "Zeit mit Freunden", "themes": "Free time, dates & ordinal numbers, birthdays, writing an invitation, ordering & paying in a restaurant, pubs in D-A-CH, arranging by e-mail.", "grammar": "Dates & ordinals (am dritten…); personal pronouns in Akkusativ (mich, dich, ihn…); Präteritum of sein/haben (war/hatte); wollen.", "phrases": "Ich hätte gern… / Zahlen, bitte. / Zusammen oder getrennt? / Wann hast du Geburtstag? / Es war toll.", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Restaurant dialogue = memorise as a script. war/hatte you will use every single day: automate them.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Datum, Akk-Pronomen, war/hatte"},
  {"level": "A1", "n": 7, "title": "Arbeitsalltag", "themes": "Everyday conversations at work, an internship blog, who to talk to, money, the working day, saying where you're going, small talk in the office.", "grammar": "Modal verbs (müssen, können, wollen) with Satzklammer; Wohin? → zu/in/nach + Dativ/Akk chunks (zum Arzt, zur Bank, ins Büro, nach Hause); mit wem? (Dativ pronouns).", "phrases": "Ich muss noch… / Kannst du mir helfen? / Ich gehe zum… / Wie läuft's? / Schönes Wochenende!", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Modal verbs + bracket again (good: repetition). Learn the 'Wohin?' targets as fixed chunks; don't try to derive them from case rules yet.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Modalverben, Wohin?, mit wem?"},
  {"level": "A1", "n": 8, "title": "Fit und gesund", "themes": "Opinions on fitness, understanding and giving instructions (fitness app), personal details, body parts, an accident, at the doctor's, home remedies, hospital jobs.", "grammar": "Imperativ du/ihr; modal verbs sollen/dürfen; Mir tut … weh (Dativ pronoun); first Perfekt contact (reporting an accident); signs & short info texts.", "phrases": "Was fehlt Ihnen? / Ich habe Kopfschmerzen. / Nehmen Sie … / Gute Besserung!", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Body parts to 80%, doctor dialogue as a script. Home remedies and hospital jobs: read once, no cards.", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Imperativ du/ihr, sollen/dürfen, mir tut weh"},
  {"level": "A1", "n": 9, "title": "Meine Wohnung", "themes": "Rooms & furniture, flat ads, planning the furnishing, saying where things are, likes/dislikes, colours, describing a room, ways of living.", "grammar": "Two-way prepositions with Dativ (Wo? in/auf/unter/neben/vor/hinter/über/zwischen/an); Dativ articles dem/der/einem; gefallen + Dativ; adjectives after sein.", "phrases": "Die Lampe steht auf dem Tisch. / Die Wohnung gefällt mir. / Das finde ich schön/hässlich.", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Highest-value grammar of A1.2: the Dativ table + the 9 two-way prepositions. Describe YOUR own room aloud, every day this week, 60 seconds.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Wechselpräp. + Dativ (Wo?), gefallen"},
  {"level": "A1", "n": 10, "title": "Studium und Beruf", "themes": "Work & study, describing a day, talking about the past, the way to a job (job search), reporting on a day, phoning and checking, seasonal jobs.", "grammar": "Perfekt: haben/sein; regular ge-…-t, irregular ge-…-en; separable -ge-; -ieren without ge-; time expressions (gestern, letzte Woche); Präteritum sein/haben review.", "phrases": "Ich habe … gemacht. / Ich bin … gefahren. / Wann hast du angefangen? / Ich rufe wegen … an.", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "THE A1 grammar. Learn the 40 most common irregular participles by heart (chant them). Skip nothing in this chapter; give it 6 hours if needed.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Perfekt (haben/sein, Partizip II)"},
  {"level": "A1", "n": 11, "title": "Die Jacke gefällt mir!", "themes": "Clothes, needing new clothes, adverts, compliments, reporting on past events, shop dialogues, orientation in a department store, opening hours, Berlin.", "grammar": "Verbs with Dativ (gefallen, passen, stehen, gehören); Dativ personal pronouns (mir, dir, ihm, ihr, uns, euch, ihnen); demonstratives der/die/das & welch-?; Perfekt review.", "phrases": "Die Jacke steht dir gut. / Welche Größe haben Sie? / Kann ich das anprobieren? / Wo finde ich…?", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Chant the Dativ pronouns. Shop dialogue as a script. Berlin page = reading only, no vocabulary cards.", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Dativ-Pronomen, Verben mit Dativ, welch-?"},
  {"level": "A1", "n": 12, "title": "Ab in den Urlaub!", "themes": "Holiday greetings, travel preparations, hotel conversations, city tour suggestions, directions, announcements, postcard, travel reports, weather, destinations in Germany.", "grammar": "Perfekt with sein (fahren, gehen, fliegen, bleiben…); nach/in/an + countries and places (direction); weather; es gibt; A1 review.", "phrases": "Ich fahre nach… / Wir waren in… / Es regnet. / Viele Grüße aus… / Wie war's?", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Use as an A1 recap chapter. Write a 100-word postcard about a real trip and record yourself reading it.", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A1 (Klett, 2019)", "focus": "Perfekt mit sein, nach/in + Ort, Wetter"},
  {"level": "A2", "n": 1, "title": "Und was machst du?", "themes": "Introducing yourself in more detail, reporting past events, arranging to meet, giving reasons, presenting a restaurant, learning words with all senses.", "grammar": "Perfekt review (all verb types); subordinate clause with weil (verb at the end); denn vs weil; arranging/accepting/declining.", "phrases": "Ich kann nicht kommen, weil… / Das ist eine gute Idee. / Schade, da geht es leider nicht. / Geht es auch später?", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "'weil' sends the verb to the end: your first subordinate clause. Drill 40 spoken weil-sentences about your own life.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "weil (Verb am Ende), denn, Perfekt-Review"},
  {"level": "A2", "n": 2, "title": "Nach der Schulzeit", "themes": "Life after school, school memories, e-mail about vocational training, information on school & training, giving your opinion, German school types.", "grammar": "Präteritum of modal verbs (musste, konnte, wollte, durfte, sollte); subordinate clause with dass; past time expressions (früher, damals, vor 5 Jahren).", "phrases": "Ich finde, dass… / Meiner Meinung nach… / Früher musste ich… / Ich glaube, dass…", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "dass + modal-Präteritum are daily-use structures. The German school-system text is reference only: 15 minutes, no cards.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Modalverben Präteritum, dass"},
  {"level": "A2", "n": 3, "title": "Immer online?", "themes": "Media use, a short story, cartoon, advantages & disadvantages, comparing, preferences, opinions, a survey, cinema & a film comment, a star portrait.", "grammar": "Komparativ & Superlativ (größer, am größten; besser/mehr/lieber); comparisons with als / (genau)so…wie; gern–lieber–am liebsten.", "phrases": "Ein Vorteil ist… / Ich finde X besser als Y. / Am liebsten… / Ich bin dafür/dagegen.", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Comparison forms are a quick win. DO the film-comment writing task: it is a perfect B1 warm-up.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Komparativ/Superlativ, als/wie"},
  {"level": "A2", "n": 4, "title": "Große und kleine Gefühle", "themes": "Feelings, festivals, congratulations, reacting to invitations, choosing offers from ads, a birthday party, joy & regret, a festival in the south, feeling at home abroad.", "grammar": "Subordinate clause with wenn; verbs with prepositions (sich freuen auf/über, sich ärgern über, warten auf…); question words with preposition (worauf? / darauf).", "phrases": "Herzlichen Glückwunsch! / Ich freue mich auf… / Schade, dass… / Ich fühle mich wohl, wenn…", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Start a running 'Verb + Präposition' list now (you will add to it until B2). Festival texts: read once.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "wenn, Verben mit Präposition, wo(r)-/da(r)-"},
  {"level": "A2", "n": 5, "title": "Leben in der Stadt", "themes": "Describing pictures, job ads, a job interview, reporting on a city, describing things, banks & authorities, polite requests and reactions, Vienna's Ring.", "grammar": "Adjective endings after definite/indefinite article (Nom/Akk/Dat); polite requests with Konjunktiv II (Könnten Sie…? Würden Sie…?); verbs with Dativ + Akkusativ (geben, schicken, erklären).", "phrases": "Könnten Sie mir bitte…? / Ich hätte eine Frage. / Haben Sie Erfahrung mit…? / Die Stadt ist bekannt für…", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Adjective endings: learn the two tables, then rely on chunks. Aim for 80% accuracy by B1, not 100% now: perfectionism here kills speed.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Adjektivdeklination, Könnten Sie…?"},
  {"level": "A2", "n": 6, "title": "Arbeitswelten", "themes": "Work & leisure, a business trip, situations at the station, announcements, ticket counter, evening programme, telling a story, dream job, changes, phoning at work.", "grammar": "Subordinate clauses with als (single past event) vs wenn; Präteritum regular/irregular for narration; describing change (werden, immer + Komparativ); deshalb/darum.", "phrases": "Als ich … war, … / Einmal einfach nach… / Deshalb… / Könnte ich bitte mit … sprechen? / Ich rufe an, weil…", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Präteritum: learn the top 30 verb forms for READING; keep speaking in Perfekt. Telephone phrases = script.", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "als vs wenn, Präteritum, deshalb"},
  {"level": "A2", "n": 7, "title": "Ganz schön mobil", "themes": "Talking about transport, asking for information, getting around the city flexibly, describing the way, opinions on transport, commuting in D-A-CH, describing a chart, train stories.", "grammar": "Indirect questions (Wissen Sie, ob…? / Können Sie mir sagen, wann…?); prepositions of movement (durch, über, entlang, gegenüber, um…herum); chart description phrases.", "phrases": "Wissen Sie, ob…? / Die Grafik zeigt… / Die meisten… / Ich fahre lieber mit…, weil…", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Chart-description phrases matter for B1/B2 exams: keep those. Directions were done in A1: skim that part.", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "indirekte Fragen (ob/W-Wort), Grafik"},
  {"level": "A2", "n": 8, "title": "Gelernt ist gelernt!", "themes": "A chat about learning, exam types, an advert, a radio programme, a forum post, understanding and giving advice, working with languages, reading expectations, giving a short presentation.", "grammar": "Advice with sollte (Konjunktiv II); purpose clauses um … zu / damit; presentation phrases (Ich möchte euch … vorstellen; Zum Schluss…).", "phrases": "Du solltest… / An deiner Stelle würde ich… / Ich lerne Deutsch, um … zu … / Zum Schluss möchte ich sagen…", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "um…zu and damit are everywhere. Do the presentation task with your partner as the audience: twice.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "sollte, um…zu / damit, Präsentation"},
  {"level": "A2", "n": 9, "title": "Sportlich, sportlich", "themes": "Sports, favourite things, enthusiasm/hope/disappointment, live ticker comments, consequences & contradictions, suggestions and reactions, describing people & things, a travel report.", "grammar": "Relative clauses (Nominativ/Akkusativ: der/die/das, den); deshalb vs trotzdem; subordinate clause with obwohl; suggestions (Wie wäre es mit…? Lass uns…).", "phrases": "Das ist der Mann, der… / Trotzdem… / Obwohl es regnet, … / Wie wäre es mit…? / Super, ich bin dabei!", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "Relative clauses are the gateway to B1. Practise until the relative pronoun comes automatically (make 10 sentences about people you know).", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Relativsätze, trotzdem/obwohl"},
  {"level": "A2", "n": 10, "title": "Zusammen leben", "themes": "Housing situation, neighbours, complaining, apologising, asking a favour, giving locations, room-share experience reports, reporting on the past, presenting a city, pets, animal stories.", "grammar": "Two-way prepositions with Akkusativ vs Dativ (Wohin? stellen/legen/setzen/hängen vs Wo? stehen/liegen/sitzen/hängen); reflexive verbs (sich beschweren, sich entschuldigen); Präteritum/Perfekt narration.", "phrases": "Ich möchte mich beschweren. / Entschuldigen Sie bitte, … / Könnten Sie mir einen Gefallen tun? / Stell die Vase auf den Tisch.", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "stellen/stehen pairs are a classic exam item: nail them. Pet texts and animal stories: light, 20 minutes.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Wechselpräp. Akk vs Dativ, Reflexivverben"},
  {"level": "A2", "n": 11, "title": "Wie die Zeit vergeht!", "themes": "Life phases, wishing for more time, stress, giving advice, polite requests, planning together, asking others, living in another era, proverbs, a poem.", "grammar": "Konjunktiv II for wishes, requests, advice (hätte, wäre, würde, könnte); temporal prepositions (seit, vor, in, nach, während, bis); verbs with prepositions review.", "phrases": "Ich hätte gern mehr Zeit. / Wenn ich Zeit hätte, würde ich… / Seit zwei Jahren… / Vor einem Monat…", "priority": "Core", "sessions": 4, "hours": 5.0, "tip": "hätte/wäre/würde/könnte must be automatic: they carry half of polite German. Proverbs & poem: fun but low value, 20 minutes max.", "bridge": "Bridge-full", "bridgeSessions": 2, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Konjunktiv II (hätte/wäre/würde), seit/vor/in"},
  {"level": "A2", "n": 12, "title": "Gute Unterhaltung!", "themes": "Partner interview, information about buildings, a festival visit, buying concert tickets, musicians, follow-up questions, precise information about things & people, painting then and now, describing a picture.", "grammar": "Relative clauses with prepositions and in Dativ (mit dem…, in der…); adjective endings review (all cases); welch-? / was für ein?; picture description phrases.", "phrases": "Auf dem Bild sehe ich… / Im Vordergrund/Hintergrund… / Das ist die Band, mit der… / Was für ein…?", "priority": "Standard", "sessions": 4, "hours": 4.5, "tip": "Picture description = Goethe B1 Sprechen format: practise 3 pictures aloud. Art-history text = reading only.", "bridge": "Bridge-skim", "bridgeSessions": 1, "book": "Netzwerk neu A2 (Klett, 2020)", "focus": "Relativsätze mit Präposition, Bild beschreiben"},
  {"level": "B1", "n": 1, "title": "Gute Reise!", "themes": "Messages from holidays, travel stories, planning a trip, travel problems and complaints, mediation (explaining to someone in another language).", "grammar": "Perfekt vs Präteritum in narration; verbs with prepositions; review of subordinate clauses (weil, dass, wenn, obwohl); word formation: nouns from verbs (-ung, -er).", "phrases": "Ich möchte mich beschweren, denn… / Auf der Reise ist uns … passiert. / Könnten Sie mir erklären, …?", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "Use this chapter as your A2→B1 diagnostic: if the Übungsbuch takes more than double the planned time, insert one extra review week now, not later.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Erzählzeiten, Nebensätze-Review, Wortbildung"},
  {"level": "B1", "n": 2, "title": "Das ist ja praktisch!", "themes": "Everyday technology, how things work, instructions, complaints about products, online shopping, customer service.", "grammar": "Passiv Präsens (wird … gemacht); relative clauses with prepositions; modal particles (ja, doch, mal, denn): recognise & use 4 of them.", "phrases": "Das Gerät wird eingeschaltet, indem… / Ich habe ein Problem mit… / Das ist ja praktisch! / Kannst du mal…?", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "Passiv is the top B1 reading structure. Particles make you sound natural: learn four (doch, mal, ja, denn), ignore the rest.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Passiv Präsens, Modalpartikeln"},
  {"level": "B1", "n": 3, "title": "Veränderungen", "themes": "Life changes, moving, biographies, future plans, changes in society, before/after.", "grammar": "Plusquamperfekt + nachdem; Futur I (werden + Infinitiv for plans and predictions); bevor / während / seit(dem); word formation -ung / -heit / -keit.", "phrases": "Nachdem ich … hatte, … / Ich werde nächstes Jahr… / Früher …, heute … / Das hat sich verändert.", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "Plusquamperfekt: one rule only (nachdem + Plusquamperfekt, main clause in Präteritum/Perfekt), then move on. Don't over-study Futur: Germans use Präsens + time word.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Plusquamperfekt, nachdem, Futur I"},
  {"level": "B1", "n": 4, "title": "Arbeitswelt", "themes": "Job profiles, applications, CV and cover letter, job interview, rules at work, work-life balance, working abroad.", "grammar": "Konjunktiv II for politeness and unreal situations (Wenn ich … hätte, würde ich…); um…zu / damit review; noun-verb combinations (eine Entscheidung treffen); Genitiv basics.", "phrases": "Ich bewerbe mich um… / Ich habe Erfahrung in… / Wenn ich die Wahl hätte, … / Was sind Ihre Stärken?", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "Directly useful if you are job-hunting: write a real German CV summary and a 3-minute self-introduction for interviews (record it, correct it, re-record).", "bridge": "Full+", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Konjunktiv II irreal, Nomen-Verb-Verbindungen"},
  {"level": "B1", "n": 5, "title": "Umweltfreundlich?", "themes": "Environment, consumption, recycling, energy, mobility, protest & initiatives, statistics.", "grammar": "Passiv with modal verbs (muss getrennt werden); two-part connectors (nicht nur…sondern auch, sowohl…als auch, entweder…oder, weder…noch, je…desto); Genitiv (des/der; wegen, trotz).", "phrases": "Man sollte… / Einerseits…, andererseits… / Je mehr…, desto… / Wegen des Klimas…", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "Two-part connectors raise your B1/B2 writing score fast. Genitiv: recognise it; produce it only in writing.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Passiv + Modalverb, zweiteilige Konnektoren, Genitiv"},
  {"level": "B1", "n": 6, "title": "Blick nach vorn", "themes": "The future of work and technology, predictions, wishes, learning goals, life plans.", "grammar": "Futur I for assumptions (Er wird wohl…); Konjunktiv II unreal (Wenn ich könnte, …); falls; adjectives with -bar / -los / -voll.", "phrases": "In Zukunft wird es… / Ich vermute, dass… / Falls…, … / Wahrscheinlich…", "priority": "Standard", "sessions": 5, "hours": 5.5, "tip": "Perfect chapter for a 2-minute recorded monologue 'Meine Pläne'. Futurology texts: read once.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Futur I (Vermutung), falls, -bar/-los/-voll"},
  {"level": "B1", "n": 7, "title": "Zwischenmenschliches", "themes": "Friendships, planning something together, expressing sequences in time, arguing fairly, conflict conversations, strong together, fables and reading aloud.", "grammar": "Temporal subordinate clauses (bevor, nachdem, während, seit(dem), bis, sobald, solange); time expressions; adjectives with -ig / -lich; conflict phrases.", "phrases": "Bevor wir…, … / Sobald ich…, … / Ich verstehe deinen Punkt, aber… / Lass uns eine Lösung finden.", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "The temporal-connector set IS this chapter: make a one-page timeline sheet with an example for each. Fables = reading-aloud practice only.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "temporale Nebensätze (bevor/während/bis/sobald)"},
  {"level": "B1", "n": 8, "title": "Rund um Körper und Geist", "themes": "Health, in hospital, offering / accepting / declining help, warning someone, mental fitness, stress, nutrition myths.", "grammar": "Konjunktiv II advice (An deiner Stelle würde ich…); indem (Wie?); Passiv in past (wurde operiert); prepositions with Genitiv (trotz, wegen, während).", "phrases": "Kann ich dir helfen? – Danke, das wäre nett. / Du solltest…, indem du… / Pass auf, dass…", "priority": "Standard", "sessions": 5, "hours": 5.5, "tip": "indem + the help/advice phrases are the keepers. Skim the nutrition-myth texts.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "indem, Passiv Vergangenheit, trotz/wegen"},
  {"level": "B1", "n": 9, "title": "Kunststücke", "themes": "Art, music, literature, creativity, describing artworks, cultural events, a short story.", "grammar": "Partizip I/II as adjective (das lachende Kind, das gemalte Bild); adjective endings without article (frische Milch); Präteritum in narrative texts; reflexive verbs with prepositions.", "phrases": "Das Bild zeigt… / Es wirkt … auf mich. / Ich interessiere mich für… / Die Geschichte handelt von…", "priority": "Standard", "sessions": 5, "hours": 5.5, "tip": "Participle-as-adjective: understand it, produce it rarely. Do the picture-description speaking task twice; skip the short story if behind.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Partizip als Adjektiv, Adjektive ohne Artikel"},
  {"level": "B1", "n": 10, "title": "Miteinander", "themes": "Living together, volunteering, social engagement, generations, integration, rules for living together.", "grammar": "Relative clauses with wo / was / wer; ohne … zu / anstatt … zu; connectors dennoch / jedoch / allerdings; Konjunktiv II past (hätte gemacht / wäre gewesen).", "phrases": "Ich hätte das anders gemacht. / Wenn ich das gewusst hätte, … / Anstatt zu…, … / Allerdings…", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "Konjunktiv II past ('what would have happened') is loved by B2 exams: learn it now, properly.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Konjunktiv II Vergangenheit, ohne…zu, dennoch"},
  {"level": "B1", "n": 11, "title": "Stadt, Land, Fluss", "themes": "City vs countryside, regions of D-A-CH, geography, tourism, describing places, comparing places.", "grammar": "Attributive Komparativ/Superlativ (die schönste Stadt); brauchen … zu / nur … zu; Passiv Präteritum; innerhalb / außerhalb (Genitiv); location phrases review.", "phrases": "Die schönste Stadt, die ich kenne, … / Auf dem Land … / Du brauchst nicht zu… / Im Vergleich zu…", "priority": "Standard", "sessions": 5, "hours": 5.5, "tip": "Geography of D-A-CH = reading only. Attributive superlatives: practise 20 aloud.", "bridge": "Full", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "attributiver Superlativ, brauchen…zu"},
  {"level": "B1", "n": 12, "title": "Geld regiert die Welt?", "themes": "Money, banks, saving, consumption, economy basics, complaints and contracts, prices.", "grammar": "Passiv in all tenses; lassen (etwas machen lassen); nominalisation (das Sparen, beim Einkaufen); Konjunktiv II past review; noun-verb combinations.", "phrases": "Ich lasse mir … reparieren. / Das Konto wurde gesperrt. / Beim Sparen … / Ich würde vorschlagen, dass…", "priority": "Core", "sessions": 5, "hours": 6.0, "tip": "For a finance background: build a 60-word finance list (Zinsen, Konto, Anlage, Rendite, Kredit, Gebühr…) and use it for a B1-Sprechen-style presentation.", "bridge": "Full+", "bridgeSessions": 5, "book": "Netzwerk neu B1 (Klett, 2021)", "focus": "Passiv alle Zeiten, lassen, Nominalisierung"},
  {"level": "B2", "n": 1, "title": "Begegnungen", "themes": "First encounters, small talk, cultural differences, networking, describing people.", "grammar": "Word order in the middle field (te-ka-mo-lo), noun-verb combinations, modal particles in use; connecting sentences (Verbindungsadverbien).", "phrases": "Darf ich mich vorstellen? / Wie ich gehört habe, … / Übrigens… / Das kommt darauf an.", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "B2 opener: mostly consolidation. Spend the saved time on a 4-minute self-presentation, recorded.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Mittelfeld-Wortstellung, Verbindungsadverbien"},
  {"level": "B2", "n": 2, "title": "An die Arbeit", "themes": "Work, careers, applications, teamwork, workplace communication, meetings.", "grammar": "Konjunktiv II present & past; passive substitutes (sich lassen, sein + zu + Infinitiv, -bar); Bewerbung language.", "phrases": "Das lässt sich einrichten. / Das ist zu erledigen. / Hätte ich das gewusst, … / Ich schlage vor, …", "priority": "Core", "sessions": 7, "hours": 8.0, "tip": "Directly job-relevant. Do the application & interview tasks for real (use your actual CV).", "bridge": "Full+", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Konjunktiv II, Passiv-Ersatzformen"},
  {"level": "B2", "n": 3, "title": "Alles im Wandel", "themes": "Change, society, digitalisation, history, generations, statistics on change.", "grammar": "Plusquamperfekt & time relationships; temporal connectors (extended); participial attributes (die im Jahr 2020 gegründete Firma).", "phrases": "Im Laufe der Zeit… / Während früher…, ist heute… / Die Zahl … ist gestiegen/gesunken. / Das führte dazu, dass…", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "Participial attributes: learn to READ them (unpack into a relative clause); don't try to produce them in speech.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Zeitverhältnisse, Partizipialattribute"},
  {"level": "B2", "n": 4, "title": "Lass uns reden ...", "themes": "Communication, argumentation, media, conflict, giving feedback.", "grammar": "Indirect speech with Konjunktiv I (er sagt, er habe / sie sei); reporting verbs; argument connectors (zwar…aber, allerdings, dagegen).", "phrases": "Er behauptet, dass… / Laut … sei… / Ich stimme zu, allerdings… / Einerseits…, andererseits…", "priority": "Core", "sessions": 7, "hours": 8.0, "tip": "Konjunktiv I: recognise in news, produce only 'sei/habe' + dass. The argumentation phrases are the B2 exam backbone: memorise 15.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "indirekte Rede (Konjunktiv I), Argumentation"},
  {"level": "B2", "n": 5, "title": "Technik gut, alles gut?", "themes": "Technology, science, innovation, describing processes, pros and cons of technology.", "grammar": "Extended Passiv; nominal style ↔ verbal style (die Entwicklung → entwickeln); prepositions with Genitiv (aufgrund, infolge, mithilfe).", "phrases": "Aufgrund der Entwicklung… / Mithilfe von… / Es wird davon ausgegangen, dass… / Ein Nachteil besteht darin, dass…", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "Nominal style: practise turning 10 sentences each way: it's the key to reading German news and writing formally.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Nominalstil ↔ Verbalstil, Genitivpräpositionen"},
  {"level": "B2", "n": 6, "title": "Gesundheit!", "themes": "Health, sport, nutrition, medicine, stress, health systems.", "grammar": "Unreal comparisons (als ob + Konjunktiv II); consequence clauses (so … dass; zu … als dass); modal verbs in subjective meaning (soll / will).", "phrases": "Er tut so, als ob… / Es war so kalt, dass… / Er soll krank sein. / Sie will das nicht gewusst haben.", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "'als ob' and 'so…dass' are productive; subjective modals: understand, don't force into speech.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "als ob, so…dass, Modalverben subjektiv"},
  {"level": "B2", "n": 7, "title": "Wieder was gelernt!", "themes": "Learning, education, universities, lifelong learning, learning strategies.", "grammar": "Extended relative clauses (Genitiv: dessen/deren; wo(r)- forms); conditional connectors (falls, sofern, es sei denn, vorausgesetzt).", "phrases": "Der Kurs, dessen Inhalt… / Sofern…, … / Es sei denn, … / Vorausgesetzt, dass…", "priority": "Core", "sessions": 7, "hours": 8.0, "tip": "dessen/deren = high frequency in written German. Conditional connectors: pick 3 you'll actually use.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Relativsätze (dessen/deren), falls/sofern"},
  {"level": "B2", "n": 8, "title": "Einfach menschlich", "themes": "Emotions, relationships, ethics, decisions, personality.", "grammar": "Modal verbs expressing probability (muss / dürfte / könnte / kann nicht); fine points of adjective endings; expressing degrees of certainty.", "phrases": "Das muss ein Missverständnis sein. / Sie dürfte etwa 30 sein. / Es könnte sein, dass… / Vermutlich…", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "The probability modals are useful in speech (muss / könnte / dürfte). Everything else: consolidation.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Modalverben (Vermutung), Sicherheitsgrade"},
  {"level": "B2", "n": 9, "title": "Gut wirtschaften", "themes": "Economy, money, consumption, sustainability, companies, work and pay.", "grammar": "Nominalisation & Funktionsverbgefüge (zur Verfügung stellen, in Frage kommen); concessive/adversative (obwohl / während / dagegen / wohingegen).", "phrases": "… steht zur Verfügung. / Während die einen…, … / Im Gegensatz dazu… / Das kommt nicht in Frage.", "priority": "Core", "sessions": 7, "hours": 8.0, "tip": "Finance readers: this is your professional vocabulary chapter: add 80 economics terms to Anki with example sentences from the texts.", "bridge": "Full+", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Funktionsverbgefüge, konzessiv/adversativ"},
  {"level": "B2", "n": 10, "title": "Kunstvoll", "themes": "Art, culture, literature, film, creativity, describing and evaluating cultural works.", "grammar": "Participles I/II extended; text coherence (Textzusammenhang: pronouns, adverbs); style and register.", "phrases": "Das Werk zeichnet sich durch … aus. / Dabei handelt es sich um… / Im Vergleich dazu…", "priority": "Light", "sessions": 7, "hours": 7.0, "tip": "Lowest priority chapter for your goals: do the speaking task and the Übungsbuch grammar, skip the long literary texts.", "bridge": "Full (light)", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Textkohärenz, Partizipien erweitert"},
  {"level": "B2", "n": 11, "title": "Viel zu tun", "themes": "Time management, stress, work-life balance, planning, productivity.", "grammar": "Infinitive constructions (ohne … zu, anstatt … zu, um … zu); purpose & alternatives; prepositional adverbs (dabei, dafür, daran).", "phrases": "Ohne … zu…, … / Anstatt … zu…, … / Ich lege Wert darauf, dass… / Dabei geht es um…", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "Very speech-relevant infinitive constructions: drill them aloud. Time-management texts: read once.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Infinitivkonstruktionen, Präpositionaladverbien"},
  {"level": "B2", "n": 12, "title": "Aufgepasst!", "themes": "Safety, rules, law, environment protection, warnings, official language.", "grammar": "Passiv with modal verbs in all tenses; official/legal register; nominal style review; B2 overall review.", "phrases": "Es ist untersagt, … / … muss beachtet werden. / Hiermit… / Laut Vorschrift…", "priority": "Standard", "sessions": 7, "hours": 7.5, "tip": "Treat as the B2 review chapter, then move to Goethe B2 Modellsatz work.", "bridge": "Full", "bridgeSessions": 7, "book": "Kontext B2 (Klett) – Netzwerk neu ends at B1", "focus": "Passiv + Modalverb alle Zeiten, Amtssprache"},
];

export const GRAMMAR: GrammarPoint[] = [
  {"n": 1, "point": "Present-tense conjugation (incl. sein, haben, e→i/a→ä verbs)", "level": "A1", "chapters": "A1 K1–2", "priority": 5, "payoff": "Huge", "budget": "3 h", "rule": "Endings -e -st -t -en -t -en; stem-change only in du/er (sprechen→sprichst).", "skip": "Learning every irregular verb before you can speak – learn the 25 most frequent."},
  {"n": 2, "point": "Word order: verb 2nd, questions, Satzklammer (bracket)", "level": "A1", "chapters": "A1 K1, 5, 7", "priority": 5, "payoff": "Huge", "budget": "4 h (spread)", "rule": "Conjugated verb = position 2 in statements; everything else goes to the END (prefix, Partizip, infinitive).", "skip": "Theory. Drill with spoken sentences, not diagrams."},
  {"n": 3, "point": "Articles & gender (der/die/das) learned with the noun", "level": "A1", "chapters": "A1 K2–3", "priority": 5, "payoff": "Huge", "budget": "ongoing", "rule": "Never learn a noun without its article and plural: der Tisch, -e.", "skip": "Gender 'rules' lists – they cover 60% at best; the card habit covers 100%."},
  {"n": 4, "point": "Plural forms", "level": "A1", "chapters": "A1 K3", "priority": 3, "payoff": "Medium", "budget": "1 h", "rule": "Learn plural on the card (-e, -en, -er, -s, ¨-e).", "skip": "Memorising plural-rule tables."},
  {"n": 5, "point": "Negation nicht / kein", "level": "A1", "chapters": "A1 K3–4", "priority": 4, "payoff": "High", "budget": "1 h", "rule": "kein before nouns (with ein/no article), nicht for everything else; nicht goes late in the sentence.", "skip": "Edge cases of nicht position."},
  {"n": 6, "point": "Akkusativ (articles, ein/kein, pronouns mich/dich/ihn)", "level": "A1", "chapters": "A1 K4, 6", "priority": 5, "payoff": "Huge", "budget": "3 h", "rule": "Only masculine changes: der→den, ein→einen, er→ihn.", "skip": "Long lists of Akkusativ verbs – almost all verbs take Akkusativ by default."},
  {"n": 7, "point": "Modal verbs + Satzklammer (können, müssen, wollen, dürfen, sollen, möchten)", "level": "A1", "chapters": "A1 K5, 7, 8", "priority": 5, "payoff": "Huge", "budget": "3 h", "rule": "Modal at position 2, infinitive at the end: Ich muss heute lange arbeiten.", "skip": "möchten vs mögen philosophy – möchten = would like, done."},
  {"n": 8, "point": "Separable verbs (aufstehen, anrufen, einkaufen…)", "level": "A1", "chapters": "A1 K5", "priority": 5, "payoff": "Huge", "budget": "2 h", "rule": "Prefix goes to the end in main clauses; stays attached in Nebensatz/Infinitiv/Partizip (aufgestanden).", "skip": "Lists of inseparable prefixes beyond be-/ver-/er-."},
  {"n": 9, "point": "Possessive articles (mein, dein, sein, ihr, unser, euer, Ihr)", "level": "A1", "chapters": "A1 K5", "priority": 4, "payoff": "High", "budget": "1 h", "rule": "They decline exactly like ein/kein.", "skip": "Nothing – it's short. Just do it."},
  {"n": 10, "point": "Imperativ (Sie / du / ihr)", "level": "A1", "chapters": "A1 K3, 8", "priority": 3, "payoff": "Medium", "budget": "1 h", "rule": "Sie: verb + Sie; du: stem (no -st); ihr: -t form.", "skip": "Irregular Imperativ forms beyond sei/nimm/lies/sprich."},
  {"n": 11, "point": "Dativ (articles dem/der/dem/den + n, pronouns mir/dir/ihm/ihr)", "level": "A1", "chapters": "A1 K7, 9, 11", "priority": 5, "payoff": "Huge", "budget": "4 h", "rule": "Dativ after mit, nach, aus, zu, von, bei, seit and after gefallen/helfen/danken; plural nouns add -n.", "skip": "Trying to learn Dativ 'meaning' – learn the triggers (prepositions + 8 verbs)."},
  {"n": 12, "point": "Two-way prepositions Wo? (Dativ) vs Wohin? (Akkusativ)", "level": "A1/A2", "chapters": "A1 K9, A2 K10", "priority": 5, "payoff": "Huge", "budget": "3 h", "rule": "Movement to a place = Akkusativ; location = Dativ. stellen/legen/setzen → Akk; stehen/liegen/sitzen → Dat.", "skip": "Debating edge cases – 9 prepositions, 2 questions, done."},
  {"n": 13, "point": "Temporal prepositions (am, um, im, von…bis, seit, vor, nach, in, während)", "level": "A1/A2", "chapters": "A1 K5, A2 K11", "priority": 4, "payoff": "High", "budget": "1.5 h", "rule": "am + day, um + clock time, im + month/season, seit + ongoing, vor + ago.", "skip": "Nothing – short and high frequency."},
  {"n": 14, "point": "Perfekt (haben/sein + Partizip II)", "level": "A1", "chapters": "A1 K10–12", "priority": 5, "payoff": "Huge", "budget": "6 h", "rule": "sein with movement/change verbs (gehen, fahren, kommen, bleiben, werden); ge-…-t regular, ge-…-en irregular; no ge- for -ieren and inseparable prefixes.", "skip": "Learning 200 participles. Learn 40 by heart, the rest from cards as they appear."},
  {"n": 15, "point": "Präteritum of sein / haben / modal verbs", "level": "A1/A2", "chapters": "A1 K6, A2 K2", "priority": 5, "payoff": "Huge", "budget": "1.5 h", "rule": "war, hatte, konnte, musste, wollte, durfte, sollte – used in speech even at A1.", "skip": "Nothing – memorise the 7 forms this week."},
  {"n": 16, "point": "Präteritum of other verbs", "level": "A2/B1", "chapters": "A2 K6, B1 K1", "priority": 3, "payoff": "Low (speech)", "budget": "2 h", "rule": "For READING and written narration. In speech Germans use Perfekt (except the 7 above + wusste, dachte, gab, ging, kam).", "skip": "Producing Präteritum in conversation."},
  {"n": 17, "point": "Subordinate clauses: weil, dass, wenn, obwohl, ob (verb-final)", "level": "A2", "chapters": "A2 K1, 2, 4, 7, 9", "priority": 5, "payoff": "Huge", "budget": "4 h", "rule": "Conjugated verb goes to the END; comma before the conjunction; if the Nebensatz comes first, the main verb follows immediately (Weil…, gehe ich…).", "skip": "Rare conjunctions (sofern, insofern) before B2."},
  {"n": 18, "point": "Komparativ / Superlativ, als / wie", "level": "A2", "chapters": "A2 K3, B1 K11", "priority": 4, "payoff": "High", "budget": "1.5 h", "rule": "-er / am -sten; umlaut in short adjectives (größer); gut→besser→am besten, gern→lieber→am liebsten, viel→mehr→am meisten.", "skip": "Attributive superlative endings before B1."},
  {"n": 19, "point": "Verbs with fixed prepositions + wo(r)-/da(r)-", "level": "A2", "chapters": "A2 K4, K11 (ongoing)", "priority": 4, "payoff": "High", "budget": "ongoing", "rule": "Learn the verb WITH its preposition and case: sich freuen auf + Akk, warten auf + Akk, denken an + Akk, sprechen über + Akk.", "skip": "Trying to learn 100 at once – add 3 per chapter to your list."},
  {"n": 20, "point": "Adjective endings (after der/ein/no article)", "level": "A2/B1", "chapters": "A2 K5, 12; B1 K9", "priority": 3, "payoff": "Medium", "budget": "3 h (spread)", "rule": "After der-words: -e or -en; after ein-words the ending shows gender in Nom/Akk (-er/-e/-es); 80% accuracy is the target until B2.", "skip": "Perfectionism. Natives notice wrong VERBS far more than wrong adjective endings."},
  {"n": 21, "point": "Konjunktiv II present (würde, hätte, wäre, könnte, sollte, müsste)", "level": "A2/B1", "chapters": "A2 K8, 11; B1 K4, 6", "priority": 5, "payoff": "Huge", "budget": "3 h", "rule": "würde + infinitive for almost everything; only haben/sein/modals get their own forms (hätte, wäre, könnte…).", "skip": "Konjunktiv II forms of other verbs (käme, ginge) – recognise only."},
  {"n": 22, "point": "Relative clauses (der/die/das/den/dem, with prepositions, wo/was/wer)", "level": "A2/B1", "chapters": "A2 K9, 12; B1 K10", "priority": 5, "payoff": "High", "budget": "4 h", "rule": "Relative pronoun = definite article (except Dativ pl. denen, Genitiv dessen/deren); verb goes to the end; the preposition comes first (mit dem…).", "skip": "Genitiv relative pronouns before B2."},
  {"n": 23, "point": "Purpose: um … zu / damit", "level": "A2", "chapters": "A2 K8", "priority": 4, "payoff": "High", "budget": "1 h", "rule": "Same subject → um … zu + infinitive; different subjects → damit + Nebensatz.", "skip": "Nothing."},
  {"n": 24, "point": "Connectors: deshalb, trotzdem, denn, aber, sondern, außerdem (position 0 vs 1)", "level": "A2", "chapters": "A2 K6, 9", "priority": 4, "payoff": "High", "budget": "1.5 h", "rule": "denn/aber/und/oder/sondern = position 0 (no inversion); deshalb/trotzdem/außerdem/dann = position 1 → verb next.", "skip": "Long connector lists – these 7 cover 90% of A2/B1 speech."},
  {"n": 25, "point": "Indirect questions (ob / W-word)", "level": "A2", "chapters": "A2 K7", "priority": 4, "payoff": "High", "budget": "1 h", "rule": "Wissen Sie, ob…? / Können Sie mir sagen, wann…? – verb to the end.", "skip": "Nothing."},
  {"n": 26, "point": "Reflexive verbs (sich freuen, sich beschweren, sich anziehen)", "level": "A2", "chapters": "A2 K10", "priority": 3, "payoff": "Medium", "budget": "1 h", "rule": "mich/dich/sich/uns/euch/sich; Dativ reflexive (mir) only when there is another object (ich wasche mir die Hände).", "skip": "Lists of 'reflexive-only' verbs."},
  {"n": 27, "point": "Passiv (Präsens, with modals, Präteritum, Perfekt)", "level": "B1", "chapters": "B1 K2, 5, 8, 12", "priority": 4, "payoff": "Medium", "budget": "3 h", "rule": "werden + Partizip II; with modals: muss gemacht werden; Perfekt: ist gemacht worden. In speech 'man' often replaces it.", "skip": "Zustandspassiv theory before B2."},
  {"n": 28, "point": "Plusquamperfekt + nachdem", "level": "B1", "chapters": "B1 K3", "priority": 3, "payoff": "Medium", "budget": "1 h", "rule": "nachdem + hatte/war + Partizip II; main clause one tense later.", "skip": "Using it anywhere except with nachdem/bevor at B1."},
  {"n": 29, "point": "Temporal clauses (bevor, während, seit(dem), bis, sobald, solange, als)", "level": "B1", "chapters": "B1 K7", "priority": 4, "payoff": "High", "budget": "2 h", "rule": "All send the verb to the end; als = one completed past event, wenn = repeated/present/future.", "skip": "Nothing – make a timeline sheet with one example each."},
  {"n": 30, "point": "Futur I (werden + infinitive)", "level": "B1", "chapters": "B1 K3, 6", "priority": 3, "payoff": "Low–Medium", "budget": "1 h", "rule": "Prediction/assumption (Es wird regnen; Er wird wohl krank sein). For plans use Präsens + time word.", "skip": "Futur II."},
  {"n": 31, "point": "Two-part connectors (nicht nur…sondern auch, sowohl…als auch, entweder…oder, weder…noch, je…desto, zwar…aber)", "level": "B1", "chapters": "B1 K5", "priority": 4, "payoff": "High (writing)", "budget": "1.5 h", "rule": "Learn as fixed pairs; je + Komparativ + Nebensatz, desto + Komparativ + verb.", "skip": "Nothing – they're the cheapest way to sound B2."},
  {"n": 32, "point": "Genitiv + Genitiv prepositions (wegen, trotz, während, innerhalb, aufgrund)", "level": "B1", "chapters": "B1 K5, 8, 11", "priority": 2, "payoff": "Low", "budget": "1 h", "rule": "des/der + -s on masc./neut. nouns; in speech wegen + Dativ is common.", "skip": "Genitiv in conversation – use 'von + Dativ'."},
  {"n": 33, "point": "Konjunktiv II past (hätte/wäre + Partizip II; hätte … können)", "level": "B1/B2", "chapters": "B1 K10, 12; B2 K2", "priority": 4, "payoff": "High", "budget": "2 h", "rule": "hätte gemacht / wäre gegangen; with modal: hätte machen müssen (double infinitive).", "skip": "Nothing – exams love this."},
  {"n": 34, "point": "Participles as adjectives / participial attributes", "level": "B1/B2", "chapters": "B1 K9; B2 K3, 10", "priority": 2, "payoff": "Low", "budget": "1.5 h", "rule": "Partizip I (-end) = active/ongoing; Partizip II = completed/passive; unpack long attributes into a relative clause when reading.", "skip": "Producing them in speech – ever."},
  {"n": 35, "point": "Noun-verb combinations & nominal style (eine Entscheidung treffen, zur Verfügung stehen)", "level": "B1/B2", "chapters": "B1 K4, 12; B2 K5, 9", "priority": 3, "payoff": "Medium", "budget": "2 h", "rule": "Learn as chunks like vocabulary; nominal style is for written/formal German.", "skip": "Full Funktionsverb lists – learn the 25 most common."},
  {"n": 36, "point": "Indirect speech / Konjunktiv I", "level": "B2", "chapters": "B2 K4", "priority": 2, "payoff": "Low", "budget": "1.5 h", "rule": "Recognise 'er habe / sie sei' in news; produce with 'Er sagt, dass…' or würde.", "skip": "Full Konjunktiv I paradigms."},
  {"n": 37, "point": "Modal verbs in subjective meaning (muss / dürfte / könnte / soll / will)", "level": "B2", "chapters": "B2 K6, 8", "priority": 2, "payoff": "Low–Medium", "budget": "1 h", "rule": "muss = almost certain, dürfte = probably, könnte = possibly; soll = 'people say', will = 'claims'.", "skip": "Anything beyond recognising and using 'muss/könnte'."},
  {"n": 38, "point": "Passive substitutes (sich lassen, sein + zu, -bar, man)", "level": "B2", "chapters": "B2 K2", "priority": 3, "payoff": "Medium", "budget": "1 h", "rule": "Das lässt sich machen = das kann gemacht werden; das ist zu machen = das muss gemacht werden.", "skip": "Nothing."},
  {"n": 39, "point": "Modal particles (doch, mal, ja, denn, eigentlich, halt)", "level": "B1/B2", "chapters": "B1 K2; B2 K1", "priority": 2, "payoff": "Medium (naturalness)", "budget": "1 h", "rule": "Learn 4 with one example each; don't analyse.", "skip": "Explanations of particle 'meanings' – they don't have stable ones."},
  {"n": 40, "point": "Middle-field word order (te-ka-mo-lo; pronouns before nouns)", "level": "B2", "chapters": "B2 K1", "priority": 3, "payoff": "Medium", "budget": "1 h", "rule": "Time – cause – manner – place; pronouns go early (Ich habe es ihm gestern gegeben).", "skip": "Memorising the acronym – just listen a lot."},
];

export const METHOD: MethodSection[] = [
  {"id": "a", "title": "A. WEEKDAY SESSION (Mon–Fri, 65 min)", "columns": ["Block", "Minutes", "What", "How (protocol)", "Why"], "rows": [{"block": "1 Warm-up", "minutes": "10", "what": "Anki reviews (all due cards) + yesterday's 5 Redemittel from memory, aloud.", "how": "Phone only, book closed. Say each phrase twice. Failed cards = 'leech' tag.", "why": "Spacing beats cramming; speaking warm-up primes the mouth."}, {"block": "2 Input", "minutes": "20", "what": "Next Kursbuch double page.", "how": "1) Look at pictures/title, guess the topic in German. 2) Play the audio with the book CLOSED, note 3 things you caught. 3) Read + play again. 4) Do the tasks in pencil. 5) Check with the free Lösungen (klett-sprachen.de → Netzwerk neu → Downloads).", "why": "Listening-first builds the ear; self-checking builds independence."}, {"block": "3 Grammar", "minutes": "10", "what": "The page's grammar box → 'Kurz und klar' → 1–2 Übungsbuch exercises on exactly that point.", "how": "Copy the pattern ONCE into your notebook with 3 sentences about your own life. Then the exercises. Never re-read a rule a third time – make sentences instead.", "why": "Rules stick through use, not through reading."}, {"block": "4 Output", "minutes": "15", "what": "Speak + write.", "how": "Read the Redemittel aloud ×2. Record a 60–90 s monologue (phone voice memo) using ≥3 of them. Write 5 sentences with today's grammar; check them tomorrow in the warm-up.", "why": "Output is the bottleneck for self-learners – force it daily."}, {"block": "5 Listening", "minutes": "10", "what": "Chapter audio/video again, or one Nicos Weg episode.", "how": "Shadow for 2 minutes: repeat half a second behind the speaker, same rhythm. Then log the session in 'Daily Log'.", "why": "Shadowing fixes pronunciation and speed at the same time."}]},
  {"id": "b", "title": "B. SATURDAY SESSION (75 min)", "columns": ["Block", "Minutes", "What", "How (protocol)", "Why"], "rows": [{"block": "1 Self-check", "minutes": "15", "what": "Übungsbuch 'Das kann ich nach Kapitel X' page.", "how": "Do it cold, score it (%), write the score in the Chapter Tracker.", "why": "Honest signal of whether to move on."}, {"block": "2 Vocabulary", "minutes": "15", "what": "Lernwortschatz quiz.", "how": "Cover the German column, recall from the English/Bangla side; failed words back into Anki.", "why": "Recall practice, not recognition."}, {"block": "3 Leftovers", "minutes": "15", "what": "Übungsbuch exercises you skipped, or Intensivtrainer page.", "how": "Odd-numbered exercises only if you're behind.", "why": "Catch-up without guilt."}, {"block": "4 Couple speaking", "minutes": "15", "what": "German only.", "how": "Rotate weekly: describe your week / role-play the chapter dialogue / describe a picture / teach each other one grammar point.", "why": "Real interaction; teaching = strongest retention."}, {"block": "5 Plan", "minutes": "5", "what": "Log + look at next week's row in your Plan sheet.", "how": "Tick this week's Done box if all 6 sessions happened.", "why": "Keeps the tracker honest."}, {"block": "Plattform weeks", "minutes": "", "what": "When a Plattform session is scheduled, blocks 1–3 are replaced by the Plattform pages (timed exam-format tasks).", "how": "Time it like the real exam; score < 70% → repeat the weakest skill next week before continuing.", "why": "Exam format without exam pressure."}]},
  {"id": "c", "title": "C. SUNDAY", "columns": ["Rest / passive", "20–30", "No book. Easy German video, Nicos Weg episode, a German playlist, or nothing.", "Do not count this as study; it protects the streak.", "Recovery keeps the six-day rhythm sustainable."], "rows": []},
  {"id": "d", "title": "D. CHAPTER SESSION BREAKDOWN – A1 & A2 (4 sessions per chapter)", "columns": ["Session", "Minutes", "Kursbuch part", "Do", "Output"], "rows": [{"block": "S1", "minutes": "65", "what": "Auftaktseite (Lernziele) + Doppelseite 1", "how": "Read the Lernziele – they tell you what to be able to DO. Then blocks A1–A5 as above on Doppelseite 1. Start the chapter's Anki cards from the Lernwortschatz.", "why": "60-s recording on the chapter topic (even if it's bad)."}, {"block": "S2", "minutes": "65", "what": "Doppelseite 2 + the grammar box", "how": "Standard blocks. Grammar block = the chapter's main structure.", "why": "5 grammar sentences + recording."}, {"block": "S3", "minutes": "65", "what": "Doppelseite 3 (+4 if present)", "how": "Standard blocks. If the page is a long reading/Landeskunde text: one pass, no cards.", "why": "Retell the text in 5 sentences."}, {"block": "S4", "minutes": "65", "what": "'Kurz und klar' + film/Landeskunde page + 'Das kann ich'", "how": "Redemittel aloud ×3; grammar self-test from the summary; film page once with subtitles; 'Das kann ich' scored; enter the completion date in the Chapter Tracker (review dates appear).", "why": "Recorded 90-s monologue + 60–100-word text (e-mail, postcard, forum post)."}]},
  {"id": "e", "title": "E. CHAPTER SESSION BREAKDOWN – B1 (5 sessions per chapter)", "columns": ["Session", "Minutes", "Kursbuch part", "Do", "Output"], "rows": [{"block": "S1–S3", "minutes": "65", "what": "Doppelseiten 1–3", "how": "As in D.", "why": "Daily recording + 5 sentences."}, {"block": "S4", "minutes": "65", "what": "Doppelseite 4 + Wortbildung + Landeskunde / Video-Doku", "how": "Wortbildung boxes are worth it at B1 (they multiply vocabulary). Video once, then read the transcript (Lehrerhandbuch downloads or subtitles).", "why": "Summarise the video in 6 sentences aloud."}, {"block": "S5", "minutes": "65", "what": "'Kurz und klar' + 'Das kann ich' + exam-format output", "how": "Score the self-check; enter completion date.", "why": "3-min talk (Goethe B1 Sprechen Teil 2 style: present a topic) + 120–150-word text (E-Mail/Forumsbeitrag)."}]},
  {"id": "f", "title": "F. CHAPTER SESSION BREAKDOWN – B2 (Kontext B2, 7 sessions per chapter)", "columns": ["Session", "Minutes", "Part", "Do", "Output"], "rows": [{"block": "S1–S4", "minutes": "65", "what": "One Lektion/Doppelseite each + matching Übungsbuch", "how": "Audio first still applies. Read long texts twice: once for gist, once marking 10 chunks (not single words) for Anki.", "why": "Daily 2-min recording on the page's question."}, {"block": "S5", "minutes": "65", "what": "Grammar consolidation", "how": "Übungsbuch grammar section + the chapter's 'Grammatik' overview; write 10 own sentences per structure.", "why": "10 sentences, checked next day."}, {"block": "S6", "minutes": "65", "what": "Speaking", "how": "4-min presentation on the chapter theme (Goethe B2 Sprechen Teil 1 format) + 15-min discussion with partner or tutor.", "why": "Recording, listened back once, 3 corrections noted."}, {"block": "S7", "minutes": "65", "what": "Writing + self-check", "how": "200-word Leserbrief/Forumsbeitrag (Goethe B2 Schreiben Teil 1 format); self-correct with a checklist (verb position, endings, connectors); 'Das kann ich'.", "why": "Text + score + completion date in tracker."}]},
  {"id": "g", "title": "G. ROUTE B: THE BRIDGE SESSIONS (A1/A2 compressed, 8 weeks, 48 sessions)", "columns": ["Session type", "Minutes", "Blocks", "Detail", "Rule"], "rows": [{"block": "Bridge-full · Session A", "minutes": "65", "what": "15 Kurz und klar → 25 grammar ÜB → 15 Lernwortschatz → 10 audio", "how": "Read the chapter's 'Kurz und klar' grammar box; write the pattern + 5 own sentences. Übungsbuch grammar exercises for that chapter, odd numbers only. ALL Lernwortschatz words into Anki (vocabulary can't be compressed – only exercises can). One chapter audio, no reading.", "why": "If the grammar box has 3+ structures, split: do the top-priority one (see Grammar Priority) fully, the others as recognition."}, {"block": "Bridge-full · Session B", "minutes": "65", "what": "10 Redemittel aloud ×3 → 20 remaining ÜB → 15 audio + shadow → 10 recording → 10 Anki", "how": "Speak every Redemittel on 'Kurz und klar' three times. Remaining odd/even exercises as time allows. Replay audio with the text and shadow. 90-s recorded monologue on the chapter topic. Anki reviews.", "why": "Never end a bridge session without having spoken for 10 minutes."}, {"block": "Bridge-skim (1 session)", "minutes": "65", "what": "20 Kurz und klar → 25 Lernwortschatz → 10 audio → 10 Redemittel aloud", "how": "Understand the grammar box (no exercises), all words into Anki, audio once, phrases aloud.", "why": "Skim chapters are chosen because their grammar recurs later (A2/B1) – trust the map."}, {"block": "Bridge test (after A1, after A2)", "minutes": "65", "what": "Plattform 1–4 quick pass + Goethe Modellsatz Lesen/Hören", "how": "Timed. Score it. < 65% on A2 = add one more bridge week from the buffer before B1.", "why": "The score decides, not the calendar."}, {"block": "Extra daily", "minutes": "20", "what": "Anki + 5-min German with your partner", "how": "Outside the 65 min. On the bridge the Anki load is double the full route's (~30 new/day). Non-negotiable.", "why": "Bridge = 8 weeks only because vocabulary runs in parallel every day."}]},
  {"id": "h", "title": "H. PLATTFORM / REVIEW / MOCK SESSIONS", "columns": ["Type", "Minutes", "What", "How", "Pass rule"], "rows": [{"block": "Plattform (every 3rd chapter)", "minutes": "65", "what": "The book's Plattform pages (Prüfungstraining in A2/B1).", "how": "Do it timed and in one go, then check. Note the weakest skill (Hören/Lesen/Schreiben/Sprechen) and give it the first 20 min of next week's sessions.", "why": "≥ 70% → continue. < 70% → repeat the weakest skill for one week (use the buffer sessions)."}, {"block": "Review + speaking lab", "minutes": "65", "what": "The last 3 chapters.", "how": "1) Retell each chapter's topic for 2 min without notes. 2) Anki leeches. 3) Re-do the 5 hardest Übungsbuch exercises. 4) Read your error log and cross out what's fixed.", "why": "Every chapter reviewed at +2 / +7 / +30 days per the Chapter Tracker."}, {"block": "Mock exam", "minutes": "65–120", "what": "Goethe Modellsatz (free PDF + audio on goethe.de).", "how": "Split over two sessions: Hören+Lesen timed; Schreiben+Sprechen with your partner as examiner using the official Bewertungskriterien.", "why": "≥ 65% in each module = ready to book the real exam."}]},
];

export const LIBRARY: Resource[] = [
  {"level": "All", "skill": "Core", "name": "Netzwerk neu audio & video – Klett Augmented app (or allango)", "what": "All chapter audio/video, free, scan the page or use the code in the book.", "how": "Mandatory. Audio before reading, then shadow 2 min. Film 'Die Netzwerk-WG' (A1/A2) once per chapter with the transcript.", "minutes": "in sessions", "cost": "Free with the book"},
  {"level": "All", "skill": "Core", "name": "Klett Lösungen (klett-sprachen.de → Netzwerk neu → Downloads)", "what": "Free answer keys for Kursbuch and Übungsbuch.", "how": "Check every exercise the same day. Wrong answer = one line in the error log.", "minutes": "in sessions", "cost": "Free"},
  {"level": "All", "skill": "Vocabulary", "name": "Anki (PC/Android free; AnkiMobile iOS paid)", "what": "Spaced-repetition flashcards.", "how": "One deck per level. Card front: English (or Bangla) + a gap sentence; back: German with article + plural. 15 new/day, reviews daily.", "minutes": "70", "cost": "Free / ~$25 iOS"},
  {"level": "All", "skill": "Vocabulary", "name": "Netzwerk neu Glossar (English) + Goethe Wortliste A1/A2/B1 (free PDFs)", "what": "Official word lists per level.", "how": "Use the Goethe list at level end to spot gaps: highlight unknown words, add 10/day.", "minutes": "20", "cost": "Free"},
  {"level": "All", "skill": "Grammar", "name": "Grammatik aktiv A1–B1 / B2–C1 (Cornelsen) – or Netzwerk neu Intensivtrainer A1/A2/B1", "what": "Exercise-first grammar books.", "how": "Only for the weak-spot drill sessions. Never read a grammar book cover to cover.", "minutes": "30", "cost": "~€20 each"},
  {"level": "All", "skill": "Grammar", "name": "AI assistant (e.g. Claude) as Bangla explainer", "what": "Ask: 'Explain [structure] in Bangla with 5 German examples, then quiz me.'", "how": "For a beginner: any 'Kurz und klar' box you don't get in German/English → 5-minute Bangla explanation + quiz. Correct your recorded monologues' transcripts too.", "minutes": "30", "cost": "Free/paid"},
  {"level": "A1–A2", "skill": "Listening", "name": "Nicos Weg A1 / A2 (DW Learn German)", "what": "Free video course with a story, exercises and transcripts.", "how": "One episode a day in block 5 or on the commute; matches Netzwerk's topics closely.", "minutes": "60", "cost": "Free"},
  {"level": "A1–A2", "skill": "Listening", "name": "Easy German – 'Super Easy German' playlist (YouTube)", "what": "Street interviews, slow, German + English subtitles.", "how": "Watch once with subtitles, once without. Steal 3 phrases per video.", "minutes": "30", "cost": "Free"},
  {"level": "A1–A2", "skill": "Listening", "name": "Coffee Break German (podcast)", "what": "Bite-sized lessons with English explanations.", "how": "Passive commute listening only – it doesn't replace the book.", "minutes": "30", "cost": "Free"},
  {"level": "A1–A2", "skill": "Reading", "name": "Dino lernt Deutsch series (André Klein) – 'Café in Berlin' etc.", "what": "Graded readers with glossaries, A1–A2.", "how": "10 minutes before bed; don't look up more than 3 words per page.", "minutes": "40", "cost": "~€10 / free samples"},
  {"level": "A1–A2", "skill": "Reading", "name": "Nicos Weg texts + Netzwerk Lesetexte", "what": "Short authentic-style texts.", "how": "Read aloud once – reading practice doubles as pronunciation practice.", "minutes": "20", "cost": "Free"},
  {"level": "A2", "skill": "Speaking", "name": "HelloTalk / Tandem app", "what": "Language exchange with Germans learning English (or Bangla!).", "how": "From A2 K6: 3 voice messages a week. Text = writing practice with instant correction.", "minutes": "45", "cost": "Free"},
  {"level": "A1–A2", "skill": "Speaking", "name": "The couple protocol (see Tips & Traps)", "what": "Daily 10–15 min German-only window at home.", "how": "Same time every day (e.g. dinner). Topic = this week's chapter. Errors noted, not corrected mid-sentence.", "minutes": "90", "cost": "Free"},
  {"level": "B1", "skill": "Listening", "name": "Nicos Weg B1 + DW 'Langsam gesprochene Nachrichten'", "what": "Story course + slow daily news with transcript.", "how": "News: listen → read transcript → listen again. 3× a week.", "minutes": "60", "cost": "Free"},
  {"level": "B1", "skill": "Listening", "name": "Easy German main channel + Easy German Podcast", "what": "Natural-speed street interviews; conversational podcast (B1+).", "how": "Podcast on commutes; videos with German subtitles only.", "minutes": "60", "cost": "Free (podcast transcripts paid)"},
  {"level": "B1", "skill": "Listening", "name": "Slow German with Annik Rubens", "what": "Slow monologues on everyday German topics, with transcripts.", "how": "Shadow 3 minutes per episode.", "minutes": "30", "cost": "Free / paid transcripts"},
  {"level": "B1", "skill": "Reading", "name": "Nachrichtenleicht (Deutschlandfunk) + DW 'Top-Thema mit Vokabeln'", "what": "News in simple German, weekly; Top-Thema has audio + vocabulary + exercises.", "how": "2 articles a week; summarise each in 5 spoken sentences.", "minutes": "40", "cost": "Free"},
  {"level": "B1", "skill": "Reading", "name": "Deutsch perfekt magazine (B1–B2 marked texts)", "what": "Learner magazine with level-marked articles and glossaries.", "how": "One article a week, cards only for the marked words.", "minutes": "30", "cost": "~€8/issue or app"},
  {"level": "B1", "skill": "Writing", "name": "Journal 5 sentences/day → 120-word text weekly", "what": "Your own Goethe-B1-format practice.", "how": "Formats: informal e-mail, forum post, formal e-mail. Self-correct next day with the checklist (verb 2nd / verb-final / endings / connectors).", "minutes": "60", "cost": "Free"},
  {"level": "B1", "skill": "Speaking", "name": "italki community tutor (30 min) or tandem partner", "what": "Real conversation with correction.", "how": "Weekly from B1 K3. Bring the week's Redemittel and a 3-min talk to present.", "minutes": "30–60", "cost": "~$8–15 / session"},
  {"level": "B1–B2", "skill": "Exam", "name": "Goethe Modellsätze A1–B2 (goethe.de, free) + Bewertungskriterien", "what": "Official full model exams with audio and answer keys.", "how": "Scheduled in the Plan sheets. Do the Schreiben/Sprechen with your partner as the examiner.", "minutes": "as planned", "cost": "Free"},
  {"level": "B2", "skill": "Listening", "name": "Tagesschau in 100 Sekunden / ZDF heute / Deutschlandfunk Nova", "what": "Real news, real speed.", "how": "Daily 100 seconds; once a week a full 15-min bulletin with transcript check.", "minutes": "60", "cost": "Free"},
  {"level": "B2", "skill": "Listening", "name": "Podcasts: 'Auf den Punkt' (SZ), 'Easy German', 'Das Thema'", "what": "Current-affairs and conversational podcasts.", "how": "One per commute; note 5 chunks per episode.", "minutes": "90", "cost": "Free"},
  {"level": "B2", "skill": "Listening", "name": "Series with German audio + German subtitles (e.g. ZDF Mediathek, ARD, Netflix German originals)", "what": "Long-form native input.", "how": "1 episode a week; subtitles German only; rewatch 5 minutes with shadowing.", "minutes": "60", "cost": "Free (Mediathek) / subscription"},
  {"level": "B2", "skill": "Reading", "name": "Zeit Online / Spiegel / Tagesschau.de; for finance: Handelsblatt, Finanztip, boerse.ARD", "what": "Native press; finance press for professional vocabulary.", "how": "2 articles a week; nominal → verbal style practice on 5 sentences each.", "minutes": "60", "cost": "Free (partly paywalled)"},
  {"level": "B2", "skill": "Reading", "name": "Klett/Cornelsen B2 readers or a German novel you already know in English", "what": "Long-form reading.", "how": "10 pages a week; no dictionary except 3 words a page.", "minutes": "60", "cost": "~€10"},
  {"level": "B2", "skill": "Writing", "name": "200-word Leserbrief / Forumsbeitrag weekly (Goethe B2 Schreiben Teil 1 format)", "what": "Exam-format argumentative text.", "how": "Structure: Einleitung – 2 Argumente – Gegenargument – Fazit. Corrected by a tutor or AI, then rewritten once.", "minutes": "60", "cost": "Free"},
  {"level": "B2", "skill": "Speaking", "name": "Weekly tutor + 'Goethe B2 Sprechen' topic list (present + discuss)", "what": "Presentation (4 min) + discussion (5 min) format.", "how": "One topic a week, recorded, listened back, 3 corrections applied.", "minutes": "60", "cost": "~$10–20 / session"},
];

export const EXAMS: Exam[] = [
  {"level": "A1", "options": "Goethe-Zertifikat A1: Start Deutsch 1; ÖSD A1; telc A1", "format": "Hören (20 min), Lesen (25), Schreiben (20), Sprechen (15, group). ~65 min written.", "pass": "60% overall", "when": "Route A: after week 10. Route B: after bridge week 3 (mock only).", "where": "Goethe-Institut Bangladesh, Dhaka (Dhanmondi) – A1–B2 exams several times a year; book early.", "prep": "goethe.de Modellsatz A1 (PDF + MP3 + answer key).", "recommendation": "Sit it only if a visa needs it (German spouse visa normally requires A1 – check current exemptions for spouses of students/researchers). Otherwise just do the mock."},
  {"level": "A2", "options": "Goethe-Zertifikat A2; ÖSD A2; telc A2", "format": "Hören 30, Lesen 30, Schreiben 30, Sprechen 15 (pairs).", "pass": "60% per module group", "when": "Route A: week 20. Route B: bridge week 8 (mock).", "where": "As above.", "prep": "goethe.de Modellsatz A2.", "recommendation": "Optional. The mock is enough unless you want a confidence milestone."},
  {"level": "B1", "options": "Goethe-/ÖSD-Zertifikat B1 (modular – you can retake single modules); telc B1", "format": "Hören 40, Lesen 65, Schreiben 60, Sprechen 15 (pairs). Modules can be taken separately.", "pass": "60% in EACH module", "when": "Route A: week 34–36. Route B: week 22–24.", "where": "Goethe-Institut Bangladesh; ÖSD via partner centres (check availability).", "prep": "goethe.de Modellsatz B1 + 'Mit Erfolg zum Goethe-/ÖSD-Zertifikat B1' (Klett, paid).", "recommendation": "YES – first certificate that counts for jobs, Ausbildung and many visa routes. Book the exam 6 weeks before the planned end of B1 so the date pulls you."},
  {"level": "B2", "options": "Goethe-Zertifikat B2 (modular); telc B2; ÖSD B2", "format": "Lesen 65, Hören 40, Schreiben 75, Sprechen 15 (pairs). Modular.", "pass": "60% in EACH module", "when": "Route A: week 52–54. Route B: week 40–42.", "where": "Goethe-Institut Bangladesh.", "prep": "goethe.de Modellsatz B2 + Klett 'Mit Erfolg zum Goethe-Zertifikat B2'.", "recommendation": "YES – needed for skilled work / most study routes. Route B: take Lesen+Hören first, then Schreiben+Sprechen 4–6 weeks later if time is tight."},
];

export const MILESTONES: Milestone[] = [
  {"when": "Week 2", "what": "Both: first 90-s recording done; Anki deck has 150+ cards; couple protocol running daily."},
  {"when": "Route A week 5 / Route B week 3", "what": "Plattform 1 (A1) ≥ 70% / Route B bridge test A1 ≥ 65%."},
  {"when": "Route A week 10 / Route B week 8", "what": "A1 complete / bridge complete. Route A: Goethe A1 mock ≥ 65%. Route B: A2 mock Lesen+Hören ≥ 65% or add a bridge week."},
  {"when": "Route A week 20", "what": "A2 complete; 3-min monologue on any A2 topic without notes."},
  {"when": "Route B week 15 / Route A week 27", "what": "Half of B1: first tutor session done; 150-word text corrected."},
  {"when": "Route B week 22 / Route A week 34", "what": "B1 complete → Goethe B1 booked/sat."},
  {"when": "Route B week 40 / Route A week 52", "what": "B2 complete → Goethe B2 modules booked."},
];

export const TIPS: Tip[] = [
  {"category": "Give more importance", "tip": "Verbs first: conjugation, the 7 Präteritum forms (war/hatte/konnte…), Perfekt of the top 60 verbs. A wrong verb breaks a sentence; a wrong adjective ending doesn't.", "why": "Verbs carry meaning and word order; natives hear verb errors instantly."},
  {"category": "Give more importance", "tip": "The four cases as TRIGGERS, not as philosophy: which prepositions and which 8 verbs take Dativ; the rest is Akkusativ.", "why": "Cuts case-learning time by half."},
  {"category": "Give more importance", "tip": "Word order: verb 2nd, Satzklammer, verb-final in Nebensätze, position 0 vs 1 connectors. Drill aloud, never only on paper.", "why": "Word order is the #1 fluency blocker for English/Bangla speakers."},
  {"category": "Give more importance", "tip": "The 'Kurz und klar' page of every chapter – it is the chapter. If you can say everything on it, you have the chapter.", "why": "Klett condenses each chapter to one page; use it for review at +2/+7/+30 days."},
  {"category": "Give more importance", "tip": "Verb + preposition list (sich freuen auf, warten auf, denken an…) – start at A2 K4, add 3 per chapter.", "why": "Needed for wo(r)-/da(r)- questions and for every B1/B2 text."},
  {"category": "Give more importance", "tip": "Connectors: weil/dass/wenn/obwohl (A2), deshalb/trotzdem (A2), two-part connectors (B1), argument connectors (B2).", "why": "They are the cheapest way to score higher in Schreiben and Sprechen."},
  {"category": "Don't waste time", "tip": "Landeskunde/culture texts, 'Projekt' pages, D-A-CH statistics: read once, no vocabulary cards, no exercises.", "why": "Nice to know; almost never tested; low re-use."},
  {"category": "Don't waste time", "tip": "Film pages ('Die Netzwerk-WG', video documentaries): watch once with transcript/subtitles, shadow 2 minutes, move on. No rewatching 'for immersion'.", "why": "Passive rewatching feels productive and isn't."},
  {"category": "Don't waste time", "tip": "Pair/group games designed for classrooms: do the 2-minute couple version or skip.", "why": "The learning goal is the phrases, not the game."},
  {"category": "Don't waste time", "tip": "Phonetik boxes: 2 minutes of the drill, then stop. Pronunciation improves through shadowing, not through IPA study.", "why": "Time-boxed pronunciation beats theory."},
  {"category": "Don't waste time", "tip": "Perfect adjective endings before B2; Genitiv in speech; Präteritum of ordinary verbs in speech; Konjunktiv I paradigms; particle 'meanings'.", "why": "All low-payoff for speaking; recognition is enough until B2."},
  {"category": "Don't waste time", "tip": "Learning vocabulary outside the Lernwortschatz lists (random word-of-the-day apps, Duolingo).", "why": "The book's lists are level-calibrated and reused across chapters; extra apps fragment attention."},
  {"category": "Speed", "tip": "Time-box every exercise: 1 minute per item. Stuck → mark it, do the next, come back at the end.", "why": "Prevents 20-minute holes on one gap-fill."},
  {"category": "Speed", "tip": "Behind schedule? Do odd-numbered Übungsbuch exercises only. Never skip the Kursbuch audio, the Redemittel or the speaking output.", "why": "Exercises are compressible; input and output are not."},
  {"category": "Speed", "tip": "Grammar rule: 10 minutes max per new structure per session. It WILL return in the next chapter and in the Plattform.", "why": "The book spirals; trust it."},
  {"category": "Speed", "tip": "Check answers the same day. Wrong answer → one line in the error log ('weil → verb at end'). Cross out lines once fixed.", "why": "Your error log becomes your personal Grammatik."},
  {"category": "Vocabulary", "tip": "Sentence cards, not word cards: front 'I'm looking forward to the weekend' → back 'Ich freue mich auf das Wochenende (sich freuen auf + Akk)'.", "why": "Words without context don't transfer to speech."},
  {"category": "Vocabulary", "tip": "Every noun with article AND plural: 'der Termin, -e'. Colour-code der/die/das (blue/red/green) in the notebook and on cards.", "why": "Gender is learned once at input or never."},
  {"category": "Vocabulary", "tip": "15 new cards a day, 6 days a week. Reviews before new cards. Delete leeches after 8 fails and re-learn them in a sentence.", "why": "Sustainable pace = 4,500 cards a year ≈ B2 vocabulary."},
  {"category": "Speaking", "tip": "Record a 60–240 s monologue every session (length grows with level). Listen back once a week, note 3 recurring errors.", "why": "You can't fix what you can't hear."},
  {"category": "Speaking", "tip": "4-3-2 technique: say the same topic in 4 minutes, then 3, then 2. Fluency rises within one session.", "why": "Repetition under time pressure automates chunks."},
  {"category": "Speaking", "tip": "Shadow chapter audio 2 minutes a day: same speed, same melody, half a second behind.", "why": "Fixes rhythm, stress and speed together."},
  {"category": "Couple protocol", "tip": "Fixed daily 10–15 min German-only window (e.g. at dinner). Topic = the current chapter. Mistakes are noted on paper, never corrected mid-sentence; review the notes on Saturday.", "why": "Interaction daily without the 'correction fatigue' that kills couple study."},
  {"category": "Couple protocol", "tip": "The Route A learner teaches the Route B learner the A1/A2 grammar point they finished that week, in German, using 'Kurz und klar'. Route B teaches B1 structures back later.", "why": "Teaching is the strongest retention technique; it also keeps the levels connected."},
  {"category": "Couple protocol", "tip": "Saturday role-play: one plays the exam examiner with the Goethe Sprechen tasks; swap roles. Use the official Bewertungskriterien as a checklist.", "why": "Free exam simulation, every week."},
  {"category": "Couple protocol", "tip": "Shared error log (one page): each of you adds your top 3 errors weekly; the other person quizzes them.", "why": "Two sets of eyes on the same patterns."},
  {"category": "Route B", "tip": "The bridge is mandatory, not optional. B1 K1 assumes weil/dass/wenn, Perfekt, Dativ and Konjunktiv II as known. Without 8 bridge weeks, every B1 page is 80% unknown and the plan collapses in week 3.", "why": "Being honest now saves months later."},
  {"category": "Route B", "tip": "Anki load during the bridge is double (~30 new/day) because vocabulary is the one thing that can't be compressed. Budget 20 extra minutes daily.", "why": "Grammar compresses; words don't."},
  {"category": "Route B", "tip": "Use your finance/economics background: from B1 K4/K12 and B2 K2/K9 build a 150-word professional vocabulary and use it in every monologue.", "why": "Domain vocabulary + B2 = employable German; generic B2 is not."},
  {"category": "Route B", "tip": "Reference the A1/A2 books through the Grammatikübersicht at the back of each Übungsbuch, not by re-reading chapters.", "why": "That is the 'check A1/A2 as I go' plan, now with an index."},
  {"category": "Motivation", "tip": "Track the streak in the Daily Log. Never miss two days. A 15-minute minimum session (Anki + one recording) keeps the streak and still counts.", "why": "Consistency beats intensity over a year."},
  {"category": "Motivation", "tip": "Book the B1 exam 6 weeks before the plan says you'll be ready. A date on the calendar does more than any tracker.", "why": "Deadlines compress effort."},
  {"category": "Trap", "tip": "Counting passive video/podcast time as study.", "why": "It's support, not study; the tracker keeps them separate."},
  {"category": "Trap", "tip": "Translating word by word from English or Bangla; building sentences from grammar tables in real time.", "why": "Chunks (Redemittel) first, rules second."},
  {"category": "Trap", "tip": "'I'll speak when I'm ready.' You are ready at A1 K1.", "why": "Speaking readiness comes from speaking."},
  {"category": "Trap", "tip": "Buying more books. You need: Kursbuch + Übungsbuch per level (or the combined Teilbände), optionally the Intensivtrainer for weak spots, Goethe model tests. That's it.", "why": "More materials = less progress."},
];

/* ============================================================
   The two routes, written out of the rules
   ============================================================ */

export type SessionKind =
  | "chapter" | "plattform" | "review" | "drill" | "mock" | "exam"
  | "bridge" | "bridgeTest" | "consolidation";

export interface ChapterRef { level: Level; n: number }

export interface Session {
  text: string;
  kind: SessionKind;
  /** The level this session belongs to, or the bridge. */
  level: Level | "bridge";
  chapter?: ChapterRef;
}

export interface Week {
  n: number;
  /** "A1", or "Bridge (A1)", "Bridge (A1→A2)", "Bridge (A2)". */
  level: string;
  /** Monday to Saturday, six. */
  days: Session[];
  /** The chapters this week touches, first seen first. */
  chapters: ChapterRef[];
  focus: string;
  speaking: string;
  milestone: string;
  /** What the practice tracker lists as planned. */
  planned: string;
}

const EXAM_NAME: Record<Level, string> = {
  A1: "Goethe-Zertifikat A1 (Start Deutsch 1)",
  A2: "Goethe-Zertifikat A2",
  B1: "Goethe-Zertifikat B1",
  B2: "Goethe-Zertifikat B2",
};

const SPEAKING: Record<Level, string> = {
  A1: "Record a 60–90 s monologue on this week's topic (phone). Sat: 10 min German-only talk with partner.",
  A2: "2-min monologue using this week's Redemittel + 15-min couple conversation (Sat).",
  B1: "3-min opinion talk (recorded) + 20-min couple discussion. 1 tandem/tutor session if possible.",
  B2: "4-min presentation-style talk + 30-min discussion. Weekly tutor/tandem session.",
};
const SPEAKING_BRIDGE_EARLY =
  "Say every Redemittel on each 'Kurz und klar' page aloud twice. Daily 5-min German with your partner.";
const SPEAKING_BRIDGE_LATE =
  "Same + build up to a 5-min 'Über mich' monologue by the end of the bridge.";

export const NO_NEW_GRAMMAR = "Review / exam week – no new grammar";
export const PLATTFORM_MILESTONE = "Plattform self-test (≥70% to continue)";

export const chapterOf = (ref: ChapterRef): Chapter => {
  const found = CHAPTERS.find((c) => c.level === ref.level && c.n === ref.n);
  if (!found) throw new Error(`no chapter ${ref.level} K${ref.n}`);
  return found;
};

export const levelInfo = (level: Level): LevelInfo => {
  const found = LEVELS.find((l) => l.level === level);
  if (!found) throw new Error(`no level ${level}`);
  return found;
};

/** One level on Route A: every chapter, a Plattform and a review
    after every third, a drill as well from B1, and the exam block
    at the end. Four weeks of it on A1, eighteen on B2. */
function fullLevel(level: Level): Session[] {
  const per = levelInfo(level).sessionsPerChapter;
  const upper = level === "B1" || level === "B2";
  const out: Session[] = [];
  const at = (text: string, kind: SessionKind): Session => ({ text, kind, level });

  for (let k = 1; k <= 12; k++) {
    for (let i = 1; i <= per; i++) {
      out.push({ text: `${level} K${k} · Session ${i}/${per}`, kind: "chapter", level, chapter: { level, n: k } });
    }
    if (k % 3 === 0) {
      const p = k / 3;
      const a = k - 2;
      out.push(at(`${level} Plattform ${p}: Prüfungstraining, timed (covers K${a}–K${k})`, "plattform"));
      out.push(at(`${level} Review + speaking lab K${a}–K${k} (retell topics, error log, Anki leeches)`, "review"));
      if (upper) out.push(at(`${level} Weak-spot drill after K${k} (Intensivtrainer / Übungsbuch grammar)`, "drill"));
    }
  }

  const exam = EXAM_NAME[level];
  const mock1 = at(`Mock exam: ${exam} Modellsatz – Hören + Lesen (timed)`, "mock");
  const mock2 = at(`Mock exam: ${exam} Modellsatz – Schreiben + Sprechen (with partner)`, "mock");
  const final = at(`Final ${level} review: weak-spot drill from error log`, "exam");
  const buffer = at("Buffer / catch-up (or repeat the hardest Plattform)", "exam");

  if (!upper) {
    out.push(mock1, mock2, final, buffer);
  } else {
    out.push(
      at(`${level} Speaking: 3 recorded Sprechen tasks (presentation + discussion)`, "exam"),
      at(`${level} Writing: 2 exam-format texts, self-corrected next day`, "exam"),
      at(`${level} Reading marathon: 3 articles (Nachrichtenleicht / DW Top-Thema / Deutsch perfekt)`, "exam"),
      at(`${level} Listening marathon: 3 podcasts/news + transcript check`, "exam"),
      at(`${level} Grammar sprint: all 'Kurz und klar' pages re-tested`, "exam"),
      mock1, mock2, final, buffer,
      at(`${level} Vocabulary sprint: Anki leeches + 100-word active recall`, "exam"),
      at(`${level} Second mock (full, timed) or tutor session`, "exam"),
      at("Buffer / catch-up", "exam"),
    );
  }
  return out;
}

/** The bridge: A1 and A2 in 48 sessions, by each chapter's mode,
    a scored test after each book, and a consolidation week. */
function bridge(): Session[] {
  const out: Session[] = [];
  const at = (text: string, kind: SessionKind, chapter?: ChapterRef): Session =>
    ({ text, kind, level: "bridge", chapter });

  for (const level of ["A1", "A2"] as const) {
    for (const c of CHAPTERS.filter((ch) => ch.level === level)) {
      const ref = { level, n: c.n };
      if (c.bridge === "Bridge-full") {
        out.push(at(`Bridge ${level} K${c.n} · A: Kurz und klar → grammar ÜB (odd nos.) → Lernwortschatz → Anki`, "bridge", ref));
        out.push(at(`Bridge ${level} K${c.n} · B: Redemittel aloud ×3 → remaining ÜB → audio + shadow → 90-s recording`, "bridge", ref));
      } else {
        out.push(at(`Bridge ${level} K${c.n} · Skim: Kurz und klar + Lernwortschatz → Anki + audio once`, "bridge", ref));
      }
    }
    out.push(at(`Bridge test: ${level} Plattform 1–4 + Goethe ${level} Modellsatz Lesen/Hören (score it)`, "bridgeTest"));
  }
  out.push(
    at("Bridge consolidation: verb table – Perfekt/Präteritum of the top 60 verbs (chant + write)", "consolidation"),
    at("Bridge consolidation: case tables + Wechselpräpositionen speed drill", "consolidation"),
    at("Bridge consolidation: Nebensätze (weil/dass/wenn/obwohl/Relativsatz) speed drill aloud", "consolidation"),
    at("Bridge consolidation: 5-minute recorded 'Über mich' monologue + correction", "consolidation"),
    at("Bridge: Goethe A2 Modellsatz Sprechen with your partner (both roles) – or buffer if behind", "consolidation"),
  );
  return out;
}

const sameRef = (a: ChapterRef, b: ChapterRef): boolean => a.level === b.level && a.n === b.n;

function chaptersIn(days: Session[]): ChapterRef[] {
  const out: ChapterRef[] = [];
  for (const d of days) {
    if (d.chapter && !out.some((c) => sameRef(c, d.chapter!))) out.push(d.chapter);
  }
  return out;
}

/** Every session of a route, in order. Six a week. */
export function sessionsFor(route: Route): Session[] {
  return route === "A"
    ? [...fullLevel("A1"), ...fullLevel("A2"), ...fullLevel("B1"), ...fullLevel("B2")]
    : [...bridge(), ...fullLevel("B1"), ...fullLevel("B2")];
}

/** The whole plan: 52 weeks on Route A, 40 on Route B. */
export function planFor(route: Route): Week[] {
  const stream = sessionsFor(route);
  const weeks: Week[] = [];
  let lastBridge: Level = "A1";

  for (let n = 1; n * 6 <= stream.length; n++) {
    const days = stream.slice((n - 1) * 6, n * 6);
    const chapters = chaptersIn(days);
    const inBridge = days[0].level === "bridge";
    const after = stream[n * 6];

    let level: string;
    if (inBridge) {
      const has1 = chapters.some((c) => c.level === "A1");
      const has2 = chapters.some((c) => c.level === "A2");
      level = has1 && has2 ? "Bridge (A1→A2)"
        : has2 ? "Bridge (A2)" : has1 ? "Bridge (A1)" : `Bridge (${lastBridge})`;
      if (has2) lastBridge = "A2";
    } else {
      level = days[0].level;
    }

    const focus = chapters.length
      ? chapters.map((c) => `K${c.n}: ${chapterOf(c).focus}`).join(" | ")
      : NO_NEW_GRAMMAR;

    const speaking = inBridge
      ? (level.includes("A2") ? SPEAKING_BRIDGE_LATE : SPEAKING_BRIDGE_EARLY)
      : SPEAKING[days[0].level as Level];

    const parts: string[] = [];
    if (inBridge) {
      if (days.some((d) => d.kind === "bridgeTest")) parts.push("Bridge test – score decides");
      if (!after || after.level !== "bridge") parts.push("Bridge complete → B1 starts next week");
    } else {
      if (days.some((d) => d.kind === "plattform")) parts.push(PLATTFORM_MILESTONE);
      if (days.some((d) => d.kind === "mock")) parts.push("Mock exam week");
      if (!after || after.level !== days[0].level) parts.push(`${level} complete → enter score, decide on exam`);
    }

    const planned = chapters.length
      ? chapters.map((c) => `${c.level} K${c.n}`).join(", ")
      : "Review / exam";

    weeks.push({ n, level, days, chapters, focus, speaking, milestone: parts.join("; "), planned });
  }
  return weeks;
}

/** The week a chapter's first session falls in, or null for a
    chapter the route never opens (there is none, on either). */
export function planWeekOf(weeks: Week[], ref: ChapterRef): number | null {
  const week = weeks.find((w) => w.chapters.some((c) => sameRef(c, ref)));
  return week ? week.n : null;
}

/** The chapter rows a route tracks, in plan order: all 48, with
    the bridge mode on Route B's A1 and A2 rows, which is what the
    workbook's tracker printed beside those titles. */
export function trackedChapters(route: Route): Array<Chapter & { week: number | null; mode?: BridgeMode }> {
  const weeks = planFor(route);
  return CHAPTERS.map((c) => ({
    ...c,
    week: planWeekOf(weeks, c),
    mode: route === "B" && (c.level === "A1" || c.level === "A2") ? c.bridge : undefined,
  }));
}

/* ============================================================
   Dates
   ============================================================ */

/** `YYYY-MM-DD` plus some days, in UTC so a time zone cannot move
    a Monday to a Sunday. */
export function addDays(iso: string, days: number): string {
  const t = Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
  return new Date(t + days * 86_400_000).toISOString().slice(0, 10);
}

/** The Monday on or after a date. The workbook asks for a Monday
    and every week is Monday to Saturday. */
export function mondayOnOrAfter(iso: string): string {
  const t = Date.UTC(Number(iso.slice(0, 4)), Number(iso.slice(5, 7)) - 1, Number(iso.slice(8, 10)));
  const day = new Date(t).getUTCDay();
  const ahead = day === 1 ? 0 : (8 - day) % 7;
  return addDays(iso, ahead);
}

/** When week `n` starts, for a plan that started on `start`. */
export const weekStart = (start: string, n: number): string => addDays(start, (n - 1) * 7);

/** Which week a date falls in, or null before the start or past
    the end. */
export function weekAt(start: string, iso: string, total: number): number | null {
  const a = Date.parse(`${start}T00:00:00Z`);
  const b = Date.parse(`${iso}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return null;
  const n = Math.floor((b - a) / (7 * 86_400_000)) + 1;
  return n > total ? null : n;
}

/** Today, as `YYYY-MM-DD`, in the reader's own zone. */
export function today(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/* ============================================================
   What a learner is, and their arithmetic
   ============================================================ */

/** The workbook's inputs, per learner. */
export interface Settings {
  /** Minutes, Monday to Friday. */
  weekday: number;
  /** Minutes on Saturday. */
  saturday: number;
  /** Study days a week. */
  days: number;
  /** Weekly targets outside the sessions. */
  speaking: number;
  listening: number;
  writing: number;
  /** New Anki cards a day. */
  cards: number;
  /** Buffer on the aggressive plan: 1.3 is thirty per cent. */
  buffer: number;
}

export const DEFAULT_SETTINGS: Settings = {
  weekday: 65, saturday: 75, days: 6, speaking: 60, listening: 90, writing: 2, cards: 15, buffer: 1.3,
};

/** One chapter's ticks. Every field is optional because an
    untouched chapter is an empty object rather than a row of
    falses. */
export interface ChapterMark {
  kb?: boolean;
  ub?: boolean;
  anki?: boolean;
  kk?: boolean;
  spoken?: boolean;
  /** The 'Das kann ich' score, per cent. */
  score?: number | null;
  /** `YYYY-MM-DD`. Setting it is what starts the reviews. */
  completed?: string | null;
  r1?: boolean;
  r2?: boolean;
  r3?: boolean;
  notes?: string;
}

export interface LogEntry {
  id: string;
  date: string;
  level: string;
  chapter: string;
  type: string;
  minutes: number;
  cards: number;
  reviews: boolean;
  speaking: number;
  listening: number;
  writing: boolean;
  /** 1 to 5, or 0 for not said. */
  energy: number;
  hard: string;
}

/** A week's actuals. Absent means not typed, not nought. */
export interface PracticeWeek {
  speaking?: number | null;
  listening?: number | null;
  writing?: number | null;
  cards?: number | null;
  finished?: number | null;
  note?: string;
}

export interface Learner {
  id: string;
  name: string;
  route: Route;
  /** A Monday, `YYYY-MM-DD`. */
  start: string;
  settings: Settings;
  /** Weeks ticked done, by number. */
  weeks: Record<string, boolean>;
  /** By `${level}/${n}`. */
  chapters: Record<string, ChapterMark>;
  log: LogEntry[];
  /** By week number. */
  practice: Record<string, PracticeWeek>;
  /** When this learner was last written, for the account's merge. */
  ts: number;
}

export const chapterKey = (ref: ChapterRef): string => `${ref.level}/${ref.n}`;

/** The three review dates, two, seven and thirty days on. */
export const REVIEW_OFFSETS = [2, 7, 30] as const;

export function reviewDates(completed: string | null | undefined): [string, string, string] | null {
  if (!completed) return null;
  return [addDays(completed, 2), addDays(completed, 7), addDays(completed, 30)];
}

export type ChapterStatus =
  | "Not started" | "Review 1 pending" | "Review 2 pending" | "Review 3 pending" | "Mastered";

export function chapterStatus(m: ChapterMark | undefined): ChapterStatus {
  if (!m?.completed) return "Not started";
  if (m.r3) return "Mastered";
  if (m.r2) return "Review 3 pending";
  if (m.r1) return "Review 2 pending";
  return "Review 1 pending";
}

/** Reviews whose date has come and whose tick has not. */
export function reviewsDue(m: ChapterMark | undefined, on: string): number {
  const dates = reviewDates(m?.completed);
  if (!dates) return 0;
  const ticks = [m?.r1, m?.r2, m?.r3];
  return dates.filter((d, i) => d <= on && !ticks[i]).length;
}

export interface ChapterSummary {
  completed: number;
  total: number;
  pct: number;
  mastered: number;
  due: number;
  /** How many chapters stand at each status, for the chart. */
  byStatus: Record<ChapterStatus, number>;
}

export function chapterSummary(learner: Pick<Learner, "chapters">, on: string): ChapterSummary {
  const byStatus: Record<ChapterStatus, number> = {
    "Not started": 0, "Review 1 pending": 0, "Review 2 pending": 0, "Review 3 pending": 0, Mastered: 0,
  };
  let completed = 0;
  let mastered = 0;
  let due = 0;
  for (const c of CHAPTERS) {
    const m = learner.chapters[chapterKey(c)];
    const status = chapterStatus(m);
    byStatus[status] += 1;
    if (m?.completed) completed += 1;
    if (status === "Mastered") mastered += 1;
    due += reviewsDue(m, on);
  }
  const total = CHAPTERS.length;
  return { completed, total, pct: total ? Math.round((completed / total) * 100) : 0, mastered, due, byStatus };
}

/* ---- the start sheet's computed cells ---- */

export interface Forecast {
  hoursPerWeek: number;
  cardsPerWeek: number;
  weeks: number;
  weeksRealistic: number;
  finish: string;
  finishRealistic: string;
  sessions: number;
}

export function forecast(route: Route, start: string, s: Settings): Forecast {
  const info = ROUTES_TABLE.find((r) => r.route === route);
  if (!info) throw new Error(`no route ${route}`);
  const weeksRealistic = Math.round(info.weeks * s.buffer);
  return {
    hoursPerWeek: Math.round(((5 * s.weekday + s.saturday) / 60) * 100) / 100,
    cardsPerWeek: s.cards * s.days,
    weeks: info.weeks,
    weeksRealistic,
    finish: addDays(start, info.weeks * 7),
    finishRealistic: addDays(start, weeksRealistic * 7),
    sessions: info.sessions,
  };
}

/** The four weekly targets a practice week is scored against. */
export function weeklyTargets(s: Settings): { speaking: number; listening: number; writing: number; cards: number } {
  return { speaking: s.speaking, listening: s.listening, writing: s.writing, cards: s.cards * s.days };
}

/** The workbook's score: the average of actual over target across
    all four, each capped at one and a blank counting as nought,
    and nothing at all until at least one is typed. */
export function practiceScore(week: PracticeWeek | undefined, s: Settings): number | null {
  if (!week) return null;
  const t = weeklyTargets(s);
  const pairs: Array<[number | null | undefined, number]> = [
    [week.speaking, t.speaking], [week.listening, t.listening],
    [week.writing, t.writing], [week.cards, t.cards],
  ];
  if (!pairs.some(([a]) => typeof a === "number")) return null;
  const sum = pairs.reduce((n, [a, target]) => {
    const v = typeof a === "number" ? a : 0;
    return n + (target > 0 ? Math.min(v / target, 1) : 0);
  }, 0);
  return Math.round((sum / pairs.length) * 100);
}

/** The average of the weeks scored. */
export function practiceAverage(learner: Pick<Learner, "practice" | "settings">): number | null {
  const scores = Object.values(learner.practice)
    .map((w) => practiceScore(w, learner.settings))
    .filter((v): v is number => v !== null);
  if (!scores.length) return null;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/* ---- the daily log's summary ---- */

export interface LogSummary {
  sessions: number;
  minutes: number;
  average: number;
  last7: number;
  speaking7: number;
  listening7: number;
  energy: number | null;
  /** Sessions per day for the last twelve weeks, newest last, for
      the heat strip. */
}

export function logSummary(log: LogEntry[], on: string): LogSummary {
  const since = addDays(on, -6);
  const recent = log.filter((e) => e.date >= since && e.date <= on);
  const minutes = log.reduce((n, e) => n + (e.minutes || 0), 0);
  const withEnergy = log.filter((e) => e.energy > 0);
  return {
    sessions: log.length,
    minutes,
    average: log.length ? Math.round(minutes / log.length) : 0,
    last7: recent.length,
    speaking7: recent.reduce((n, e) => n + (e.speaking || 0), 0),
    listening7: recent.reduce((n, e) => n + (e.listening || 0), 0),
    energy: withEnergy.length
      ? Math.round((withEnergy.reduce((n, e) => n + e.energy, 0) / withEnergy.length) * 10) / 10
      : null,
  };
}

/** How many days in a row end today, counting a day as turned up
    if it has any entry. The workbook's rule is "never miss two
    days in a row", so the number a learner sees is the run. */
export function runOfDays(log: LogEntry[], on: string): number {
  const days = new Set(log.map((e) => e.date));
  let run = 0;
  let at = on;
  while (days.has(at)) { run += 1; at = addDays(at, -1); }
  return run;
}

/** What a fresh learner looks like. `id` is the caller's. */
export function newLearner(id: string, name: string, route: Route, start: string): Learner {
  return {
    id, name, route, start: mondayOnOrAfter(start),
    settings: { ...DEFAULT_SETTINGS },
    weeks: {}, chapters: {}, log: [], practice: {}, ts: Date.now(),
  };
}
