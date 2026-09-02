# The Research Studio

`/tools/research`. One place to do a piece of academic research from
the first question to the last footnote: find the literature, read
it, keep what it said, ask the data, listen to the people, write it
up, cite it properly, plan the months, and take all of it away when
you leave. A tool under `/tools`, listed in the rail like the
calculators, the routine and the diet tool, and built the way they
are built: routes under `next/`, rows under row-level security, the
site's own glass, the site's own keyboard, in Bangla and in English.

**This file is the plan, and nothing in it is built.** It was written
on 2 September 2026, in one sitting, before a line of the studio
existed, so that the building can be judged against something rather
than against whoever last remembered what was wanted. It is long on
purpose: every room, every table, every connection and every gap that
a year of real research would have found is written down here, so
that the work is a matter of executing a list rather than of
discovering the list while executing.

The order of the file is the order a reader needs it in, not the
order it will be built in. Section 31 is the build order and section
36 amends it. Section 34 is every decision this plan takes, in one
list, so that the build does not reopen them, and section 36 adds
ten more.

**What was read to write it.** The site as it stands, in particular
the diet tool, whose fifteen routes and one pages table are the shape
this borrows, and the research desk under `/admin`, which this
replaces. The Notion workspace: the home page with its three live
projects (a funded doctorate with a 2028 intake, a book on halal
micro-investing for Bangladesh, and an application whose strongest
paragraph is the investing platform), the supervisor shortlist for
banking and ethical finance, and the Drive document on faculty
alignment for an MPhil in finance and risk management with a focus on
Islamic funds. Nothing in this plan is specific to those three, but
every room was walked through with them in hand, and section 29 is
that walk written down.

**What could not be read, said plainly.** Conversations and memory
held on claude.ai are not reachable from this session, and no tool
here can open them. If a decision was taken there that this plan
contradicts, the plan is what has to move, and section 34 is where
to change it.

**A note on file names in this file.** `scripts/check-pointers.ts`
reads every tracked file and fails on a path into this repository
that reaches nothing. A plan for things that do not exist yet cannot
name them with their extensions, so every file this plan promises is
written without one (`next/lib/research-pages.ts`, not the `.ts` form),
and every file it names WITH an extension is one that exists today.
That is a rule about this document, and it is also the first thing
the build gets to delete: once a file exists, the sentence naming it
gains its extension.

---

## 0. The rule under all of it

Three rules, and they are the site's own, applied to a tool that
will be sat at for years rather than glanced at for seconds.

**Nothing typed that could have been picked.** The research desk
learnt this first and it holds here with more force, because a desk
of dead references is a desk nobody trusts. A source arrives by DOI,
by ISBN, by search result, by file, by import, or by a paste that is
parsed into a record; the reader corrects a record, and does not
type one from nothing unless the studio has genuinely failed to find
it, in which case the record says so. A citation is a chip that
points at a source row, never a string. A tool is picked from
`shared/nav.ts`. A person is picked from the people the studio
already knows. A figure in a draft points at the run that made it.

**Nothing counts down, nothing turns red, and no missed day is
announced.** The routine and the diet tool both refuse this and the
argument is stronger for a doctorate, which is four years of days on
which something was not finished. A deadline is a date on a board
with the distance to it written as a fact. A word budget is a meter
that fills. A reading queue is a queue. Nothing here can be failed,
and there is no streak anywhere in it.

**The account is the record and the browser is a mirror.** Every
row belongs to one person, sits behind `auth.uid() = user_id` with
`user_id` defaulted rather than sent, and reaches every device the
person owns. Nothing about the reader's work is kept only in a
browser except the in-flight copy of what they are typing, and
section 23 says exactly which keys those are.

**And a plan is a list of claims a check can hold.** `DIET.md` is
held by `scripts/check-diet.ts`, `ADMIN.md` by `scripts/admin.test.ts`,
and this file will be held by a check of its own under `scripts/`,
named in section 30 without its extension for the reason the
preamble gives. Every rule below that could be broken silently is
listed there as a question, and the build is not finished until each
question is asked by code rather than by prose.

---

## 1. What it is, and the seven things it refuses to be

It is **a building with rooms**. Each room is one kind of work a
researcher does, each has its own address, its own colour and its
own tools, and every room opens on to every other through the same
strip. A source found in one room is read in the next, quoted in a
third and cited in a fourth, and it is one row throughout.

It is **software rather than a page**. Three panes where a page would
have one: a list, the thing chosen from it, and a side rail carrying
what is connected to it and the assistant. Keyboard on everything.
Drag where a drag is the natural verb. Every write lands as it is
made and nothing has a Save button. A reader should be able to sit
in it for a six hour stretch and never feel the website underneath.

It is **for now and for the next decade**, which is why the shape is
tables rather than pages: a new room is a line in one table, a new
tool a card in another, a new kind of source a word in a vocabulary,
a new outside service an adapter with a status line. Section 34 lists
those extension points by name.

What it refuses to be, because each refusal is a decision the build
would otherwise have to take a hundred times:

1. **Not a Zotero.** A reference manager is a solved problem and the
   studio does not compete with it; it IMPORTS from it, through
   Zotero's own Web API, and exports to it in every format it reads.
   What the studio adds is everything a reference manager stops at:
   the reading, the argument, the data, the writing and the plan,
   in one place, attached to the same rows.
2. **Not a chatbot with a library attached.** The assistant is a
   room off every room, it reads only what the studio holds, it
   cites only rows that exist, it never writes into a draft without
   a press, and every answer is kept as a note with the prompt and
   the model on it. Section 21 is the whole of it.
3. **Not a place where a number has no source.** A figure in a
   draft points at a run; a run points at a dataset and the code
   that read it; a claim in the argument map points at a page of a
   source. The chain is drawn on the page.
4. **Not a tracker that shames.** Section 0's second rule.
5. **Not a silo.** Everything comes out: one archive with every row
   in open formats, every file, and every draft as a Word document,
   and the account page's two buttons carry every table the studio
   creates from the commit that creates it. Section 24.
6. **Not a second design.** The glass, the tones, the deck, the
   strip, the meters and the sound cues are the site's own, and a
   control the studio needs that does not exist goes into
   `next/components/ui/` for every page rather than into a room.
7. **Not a copy of the desk it replaces.** The research desk under
   `/admin` was a question, a note and three lists. The studio keeps
   the two ideas that were right (one write per save, nothing typed
   that can be picked) and nothing else: no code, no stylesheet, no
   route. Section 4 says how it goes.

---

## 2. Who it is for, and what it opens on

**One person today, and the rows are shaped so that it could be
more than one tomorrow.** Every table is reader-owned; nothing is
admin-only in the database, exactly as the desk's migration argued.
The page is open to any signed-in reader from the first stage,
because there is nothing in it to protect from a stranger: they
would see their own empty studio.

**Three projects on the day it opens**, out of the Notion home page,
and they are three different KINDS of project, which is why a project
carries a kind at all:

| | kind | what the studio has to be good at |
| --- | --- | --- |
| a doctorate in banking and ethical finance, intake 2028 | `degree` | a literature that spans econometrics, Islamic jurisprudence and policy; a proposal that has to cite a prospective supervisor's own papers; data from the Dhaka Stock Exchange, Bangladesh Bank and audited annual reports; a supervisor shortlist with a spouse-visa filter that was never verified |
| a book on halal micro-investing for Bangladesh | `book` | chapters with no structure yet, two drafts that need a place to sit, Bangla prose beside English sources, and a way out of the studio into the Article Studio so a chapter can become a piece on the site |
| an application to a foundation | `application` | a positioning paragraph that is nearly a cover letter, a CV drawn from the same library, and a deadline |

**All three share one thread, the investing platform**, which the
home page calls the research basis for the doctorate, the companion
to the book, and the strongest paragraph in the application. The
studio has to let one source, one note and one dataset belong to
three projects at once, which is why a row carries `projects` as an
array rather than one foreign key.

**And the fields it has to be honest about, because they are the
fields the reader works in:**

- **Finance and economics**, where the literature is on SSRN, RePEc
  and the big publishers as much as in open indexes, the data is
  time series and panels, and the methods are the ones the Drive
  document names: Fama-MacBeth, GARCH, ARDL, CSAD herding, panel
  regressions, event studies. Section 14 has each.
- **Islamic finance**, where a source can be a verse, a hadith, a
  fatwa, an AAOIFI standard or a Shariah board's ruling, none of
  which has a DOI and all of which have a citation form of their
  own. Section 9 gives them types.
- **Law**, out of the LLB and LLM modules in Drive, where a source
  is a case with a neutral citation or a statute with a section
  number, and the style is OSCOLA, which is footnotes rather than
  brackets and which most citation tools get wrong. Section 16 has
  the footnote engine because of this.
- **Qualitative work**, interviews with Shariah board members and
  retail investors, in Bangla, transcribed, coded, and quoted in
  English with the original kept. Section 15.

**Both languages, the site's way.** The chrome, the labels and every
explanatory sentence are said twice and the stylesheet shows one,
keyed on `data-tool-lang`, exactly as the diet tool does. The
reader's own writing is in whichever language they wrote it, and the
studio never translates it without being asked.

---

## 3. The floor plan

Seventeen addresses, and the table in `next/lib/research-pages.ts` is
the count, not this paragraph. Each room has a tone out of the seven
the rail already themes six schools with, and a drawing out of the
twelve in `shared/art.ts`, for the reason `next/lib/diet-pages.ts`
gives: fifteen pages that look identical are fifteen pages a reader
navigates by reading, and a colour tells them where they are before
the heading does. Repeats are fine and there are repeats.

| Room | Address | বাংলা | tone | art | what happens there |
| --- | --- | --- | --- | --- | --- |
| **The Board** | `/tools/research` | বোর্ড | gold | sheets | today, the inbox, pick up where you left off, one search box over everything |
| **Questions** | `/tools/research/questions` | প্রশ্ন | violet | arch | the questions, the hypotheses, the argument map, the gap matrix |
| **Library** | `/tools/research/library` | লাইব্রেরি | green | book | every source, and one page per source |
| **Find** | `/tools/research/find` | খোঁজ | teal | bubbles | search across the world's indexes, saved searches, weekly alerts |
| **Reading room** | `/tools/research/read` | পড়ার ঘর | blue | sheets | the queue, and the reader itself at `/tools/research/read/<id>` |
| **Notebook** | `/tools/research/notes` | খাতা | plum | cards | every kind of note, the daily log, the links between them |
| **Review room** | `/tools/research/review` | রিভিউ | rose | sheets | a systematic or scoping review from protocol to PRISMA |
| **Lab** | `/tools/research/lab` | ল্যাব | blue | chart | datasets, SQL, statistics, charts, and every result as a run |
| **Field room** | `/tools/research/field` | মাঠ | green | ridge | participants, interviews, transcripts, coding, surveys |
| **Writing desk** | `/tools/research/write` | লেখার টেবিল | violet | book | chapters and papers, citations, footnotes, exports |
| **Planner** | `/tools/research/plan` | পরিকল্পনা | gold | calendar | projects, milestones, the task board, meetings, deadlines, the timeline |
| **Atlas** | `/tools/research/atlas` | মানচিত্র | teal | bubbles | the graph of everything, the citation network, the canvas, the people |
| **Workshop** | `/tools/research/tools` | যন্ত্রপাতি | gold | gauge | thirty small tools, one card each |
| **Methods** | `/tools/research/methods` | পদ্ধতি | plum | cards | how to do a thing, as a lesson with a worked example |
| **Archive** | `/tools/research/archive` | আর্কাইভ | rose | plate | every file, every export, every version, and the way out |
| **Assistant** | `/tools/research/ask` | সহকারী | teal | bubbles | the long conversations; the same assistant is a drawer in every room |
| **Settings** | `/tools/research/settings` | সেটিংস | the site's default | gauge | the citation style, the name on exports, the connections, the keys |

**Why rooms and not tabs.** The account page is eight panels on one
address because it is one page; the diet tool is fifteen addresses
because each has its own data, its own metadata and its own link
somebody might send. A room here is the second kind: a supervisor
can be sent `/tools/research/write/<id>` (section 24), the assistant
can be asked to open `/tools/research/lab`, and the browser's Back
button means what it says.

**The names are the trade's own, in both languages**, and the Bangla
takes an English word where the English word is the one a Bangla
speaking researcher already uses: ল্যাব, লাইব্রেরি, রিভিউ. The rule
the money school's brief gave applies: use the English term where
necessary rather than inventing a Bangla one.

---

## 4. Where it lives

**Routes.** Under `next/app/(site)/tools/research/`, one directory
per room, each with a `page` and the rooms with children with their
own `[id]` directories. One `layout` for the whole tree, through
`siteLayout({ current: "research" })` in `next/components/page.tsx`,
and NO second layout anywhere below it: `/admin/research` sat inside
two shells for a week and `scripts/check-routes.ts` now counts.

**The Worker.** One line in `NEXT_ROUTES` in `worker.js`, a prefix
rather than a list of seventeen: `/^\/tools\/research(\/.*)?$/i`,
and two entries in `run_worker_first` in `wrangler.toml`,
`"/tools/research"` and `"/tools/research/*"`, both, for the reason
the course section's comment gives at length: a bare path and its
own star are two rules. `scripts/check-routes.ts` holds all three
places to each other.

**The menu.** One entry in the `make` group of `shared/nav.ts`:

```ts
{ label: "Research", sub: "গবেষণা", href: "/tools/research",
  icon: "microscope", key: "research", art: "sheets",
  accent: "var(--gold)" },
```

That one line puts it in the rail, the footer, the drawer, the tools
hub's deck, the Ctrl+K palette, `TOOL_KEYS` (so `next/components/used.tsx`
records the day it was last opened), and `/api/site`, so the
Android app lists it at its next fetch. `microscope` is a name
`next/lib/school-icons.ts` already draws; `scripts/check-icons.ts`
would fail on one that was not.

**The pages table.** `next/lib/research-pages.ts`, the same shape as
`next/lib/diet-pages.ts`: `href`, `tab` and `title` in both
languages, `go`, `dek`, `tone`, `art`, `needsAccount`, and `needs`,
the rooms this room reads from. The strip across every room and the
deck on the board are both built from it, so a room added there
appears in both at once and nowhere can name a different set.

**The strip.** `next/components/diet/strip.tsx` is the pattern, and
it moves: a strip of links with a roving tabindex, arrows, Home and
End, that is deliberately not a `role="tablist"` because these are
documents rather than panels. Rather than copying it, the diet strip
becomes `next/components/ui/room-strip`, takes its table as a prop,
and both tools use it. That is a conversion the diet tool gets for
free and the third tool that wants a strip gets for one line.

**The components** live in `next/components/research/`, one file per
room and a `shared` subdirectory for the panes and pickers every room
uses. `next/components/research.tsx` already exists and is the About
page's three research cards; it keeps its name, the directory sits
beside it, and the two are unrelated. The build should not rename
the About page's file to tidy this: `scripts/check-pointers.ts` has
an entry keyed on that name.

**The rows** live in Supabase under `research_` tables, section 23,
read and written by the browser as the reader through PostgREST with
the reader's own bearer, exactly as `next/lib/diet-api.ts` does. This
project holds no service-role key and the studio is not a reason to
start.

**The files** live in R2 under `research/<user id>/`, written and
read through the Worker with a signed ticket, section 23.

**The outside world** is reached only by the Worker, through
`functions/api/research/`, section 22. Nothing under `next/` names a
host that is not this site's; `scripts/check-csp.ts` would fail it.

### The research desk goes, and what it leaves behind

The desk under `/admin/research` is retired in the studio's first
stage, and retired properly:

- the desk's threads component goes to `archive/desk-research/threads.tsx`, with the
  forty-five `.rd-` rules in `@layer admin` of `next/styles/site.css`
  and the route directory. `scripts/check-css.ts` would otherwise
  report forty-five rules styling nothing.
- `/admin/research` becomes a 301 to `/tools/research/questions` in
  `aab/_redirects`, and the entry comes OUT of `run_worker_first` and
  out of `NEXT_ROUTES`, because a path a Worker answers first never
  reaches the rules file.
- The `threads` rows are carried, not dropped. The first migration
  creates `research_questions` and copies every thread into it in
  the same file: `question` to `text`, `state` to `state`, the note
  and the sources and the steps out of `body` into the shape section
  8 gives, and the three link lists into evidence rows. Then it drops
  `public.threads`. One migration, so there is no commit on which
  both tables exist and neither is the record.
- `"threads"` leaves `MINE_TABLES` in `aab/src/account-page.ts` in
  the same commit and `"research_questions"` arrives, or
  `scripts/check-account.ts` fails, which is what it is for.
- its test goes with it, as `archive/desk-research/threads.test.ts`. Its lesson about a
  controlled field is section 12's, written into the studio's own
  test.
- The `/admin` panel that linked to the desk links to the studio.
- `ADMIN.md` section 7 gets one paragraph saying where the desk went
  and why, and nothing else changes in that file.

**The name.** `/studio` is the Article Studio and stays. "Research
Studio" is what the page is called; the address is `/tools/research`
and the key is `research`. Nothing in code is called `studio` that
is not already.

---

## 5. What it looks like, and why it is allowed to be colourful

**The site's design system, and that is not a compromise.** Every
surface is the material in `@layer glow`, every card is `<GoCard>`
or `<InfoCard>` out of `next/components/deck.tsx`, every control is
in `next/components/ui/`, and `--accent` does what a room's colour
is for. A room's tone becomes `--accent` inside that room, exactly
as a school's colour does, so the chips, the meters, the rules and
every focus ring follow it without a single rule naming a colour.
`scripts/check-accents.ts` fails on one that does.

**Vibrant is a property of the rows, not of the chrome.** The site
is deliberately quiet around prose, and the studio keeps that. What
makes the studio colourful is that the THINGS in it carry colour:

| the thing | carries | so that |
| --- | --- | --- |
| a room | one of the seven tones | the strip is scannable and a room is known before it is read |
| a source | a tone by type, out of `shared/research.ts` | a case, a paper, a dataset and a verse read as four kinds of thing in one list |
| a highlight | one of five colours with a meaning | claim, evidence, method, quote, question; the colours are the five that `scripts/check-contrast.ts` has already measured against both grounds |
| a code in the codebook | a colour the reader chooses from the seven | a coded transcript reads at a glance |
| a project | a tone | three projects side by side on the board are three colours |
| a lane on the task board | the site's four states, no red | done is green, waiting is gold, nothing is red |
| a card in a deck | a scene out of `next/components/card-art.tsx` | the board is a room, not a menu |

Two of those are new tables of colour (source types, highlight
meanings) and both are DATA in `shared/research.ts`, so the Android app
gets them at its next fetch.

**Three panes, and the middle one is the work.** Every room that
holds a list is the same arrangement: the list on the left, the
chosen thing in the middle, and a side rail on the right carrying
what is connected to it (its sources, its notes, its questions, its
runs) and the assistant's drawer. The left and right panes fold, the
widths are remembered per device under `research-pane` (section 23),
and below 900px the three become one column with the list as a
sheet, which is the arrangement the account menu already uses.

**A dense mode**, one toggle in Settings, which takes the leading
and the padding down a step across the studio. It is the one place
on this site where a reader may ask for LESS air, and it is a
`data-density` attribute on the studio's root rather than a second
stylesheet.

**Nothing moves that the reader did not move.** The tilt, the glow
and the reliefs are the site's and they apply; a room adds no motion
of its own beyond the two that carry meaning: a task sliding into
its new lane after a drop, and a highlight's colour rising as it is
made. Both under `prefers-reduced-motion`. Nothing flashes, for the
reason `@layer weather` gives about a bright frame on a dark page.

**Sound, sparingly.** `saved` when a write lands where the reader
would otherwise wonder; `tick` on a task or a screening decision;
`next` and `prev` when the reader steps through a queue. Nothing
else, and all of them through `cue()` in `next/lib/sound.ts`.

**The reading hush applies in the reading room.** It is the one room
where the reader is reading rather than working, so the rail and the
strip go quiet past the first page and come back on hover, focus or
the keyboard, exactly as they do on a piece. `scripts/check-relief.ts`
knows the hush by name and the reader's own scroll-driven rules go
inside the same guard.

**The phone.** Every room works at 360px because a reader on a bus
will open the queue and read, tick a task, or capture a thought. The
reader itself is the room that has to be good on a phone, section
11, and the lab is the one that can honestly say it is better on a
laptop and still lets a phone read a run.

**What "software" means here, concretely:**

- every list has a filter box, a sort, and a count that counts;
- every object has an address, a title, a coloured chip saying what
  it is, a "connected" rail, and a "where this is used" list;
- every write is immediate, with one word saying it landed, and a
  pending mark when the connection is bad (the diet tool's
  `queue()`), never a Save button;
- every destructive action is a two-step and reversible for thirty
  days (a `deleted_at` column rather than a delete, and an Archive
  room list of what is in the bin);
- every long list is virtualised past two hundred rows, because a
  library of four thousand sources is the ordinary case by the third
  year;
- the palette knows the rooms: the studio registers its rooms and
  the reader's recent objects with the site's own Ctrl+K palette
  through a `reiad:palette` event `aab/src/app.ts` listens for,
  rather than growing a second palette.

---

## 6. The keyboard, and the site's own keys

`aab/src/app.ts` binds `/` and Ctrl+K to the palette, `?` to the
shortcut sheet, `t` to the theme and `g` to a go-to, on `window`, on
every page. The desk took `/` for one build and both listeners ran.
**A shortcut that collides does the other thing**, so every key here
was checked against that list first, and the studio's test asserts
that `/` still opens the palette inside every room.

| key | does | where |
| --- | --- | --- |
| `f` | focus the room's filter box | every room with a list |
| `n` | new: a source, a note, a task, a question, whatever the room holds | every room |
| `c` | capture: a one-line note into the inbox from anywhere | everywhere in the studio |
| `j` / `k` | down and up the list | every list |
| `Enter` / `Escape` | open, and back to the list | every list |
| `e` | edit the chosen thing's title in place | every list |
| `[` / `]` | fold the left and right panes | every three-pane room |
| `1` to `5` | the five highlight meanings, while text is selected | the reading room |
| `y` / `x` / `m` | include, exclude, maybe | screening in the review room |
| `.` | toggle the assistant drawer | everywhere |
| `g` then `r` | the board | the site's own go-to, taught one more letter |
| `Shift`+`?` | the studio's own shortcut sheet, appended to the site's | everywhere |

None fires while a field, the editor or a dialog has the focus,
which is what makes a single letter safe. The `typing()` guard the
desk wrote is the one to keep, moved into `next/components/ui/` so
the calculators can use it too.

**`g r` rather than a second go-to.** The site's `g` reads a table
of letters; the studio adds a row to it rather than binding `g` a
second time. That row is the one thing in `aab/src/app.ts` this
plan touches, and touching an existing module is allowed where a new
one under `aab/src/` is not.

---

## 7. The Board

The front door, and the one page a reader opens every day. It is
`shared/widgets.ts`'s idea applied to one tool: a board of widgets
rather than a menu of rooms, because a menu is what you read once.

**What is on it, from the top:**

1. **The capture line.** One text box, always focused on arrival.
   Type, press Enter, and it is a note in the inbox with today's
   date. Paste a DOI and it is a source. Paste a URL and it is a
   web capture (section 11). Paste a BibTeX entry and it is a source.
   Type a line starting with `todo` and it is a task. The box
   decides by shape and says what it decided before it saves.
2. **Today.** The tasks in the `today` lane, the events on today's
   calendar, and the session timer (section 17). No count of days
   in a row anywhere near it.
3. **Pick up where you left off.** The last document edited, the
   last source read with its page, the last dataset opened, each
   as a `<GoCard>` with the room's scene. Out of `research_sessions`
   and the `updated_at` of the rows, not out of localStorage, so the
   phone offers what the laptop left.
4. **The inbox.** Captures not yet filed, alerts from saved searches
   (section 10), sources with a file and no reading, notes with no
   links, tasks with no project. Every row is one press from being
   filed and the inbox's job is to become empty.
5. **The next dates.** The nearest five events across every project,
   with the distance as a fact: "in 12 days", never a colour.
6. **One search box over everything.** Sources, notes, documents,
   questions, codes, people and runs, through Postgres full text
   search over each table's `fts` column and, from stage 11, the
   semantic search of section 21. Results grouped by kind, each
   wearing its kind's colour.
7. **The rooms.** The deck out of the pages table, last, because by
   the second week the reader arrives knowing where they are going.

**The connections line** sits under the search box in Settings
rather than on the board, section 22, but the board carries one
quiet sentence when a connection the reader relies on is off
("OpenAlex is not connected, so Find is using Crossref and Semantic
Scholar"), because a search that silently shrank is worse than one
that says so.

**Widgets the front page can carry.** The site's own home page is a
board of widgets out of `shared/widgets.ts`, and three of the
studio's are worth offering there: "next deadline", "reading queue"
and "pick up where you left off". They are three entries in that
catalogue with a renderer on the site's side, and the Android app
skips a kind it cannot draw, which is the arrangement that file
already makes.

---

## 8. Questions

Where the research desk's idea lives on, made bigger: not a note
with three lists, but the argument of the whole project, as a tree.

**A question is a row with a parent.** The research question at the
top, sub-questions under it, hypotheses under those, and claims
under those, each a row of `research_questions` with `kind` in
`question | hypothesis | claim` and `parent_id`. The tree is the
outline of the thesis before the thesis exists, and it is what the
writing desk's outline (section 16) can be seeded from.

**Each carries evidence, and evidence is a pointer.** A row's `body`
holds `evidence`: a list of `{ source_id, stance, page, quote,
note }` where `stance` is `supports | contradicts | method | context`.
Nothing there is typed that is not a page number or a note; the
source is picked, the quote is a highlight (section 11) dragged in.
A claim with two supporting sources and one contradicting is drawn
as exactly that, and a claim with none is drawn as a claim with
none, which is the honest picture.

**The argument map** is the same rows drawn as a graph: questions
down the left, sources across the top, and a mark where a source
speaks to a question. Read one way it is "what does the literature
say about each question"; read the other it is "which questions does
this paper touch". It is `<Scene>`-free and drawn in SVG, because it
is a table with lines on it.

**The gap matrix** is the argument map with themes instead of
questions: rows of tags, columns of sources, and the empty cells are
the gaps. Tags are the library's tags, so the matrix is derived and
never maintained.

**A variables registry**, because quantitative work in this field
starts with a table nobody keeps: every construct (herding, Shariah
compliance, liquidity), how it is measured (CSAD, the DSEX Shariah
index membership, LCR), where the data comes from, and which source
first defined it that way. `research_questions` rows of kind
`variable`, with `body.measure`, `body.source_id` and `body.dataset_id`.
The lab (section 14) offers these names when a column is described,
so a dataset's dictionary and the thesis's variable table are one
list.

**The states are the desk's three** (`open | parked | answered`),
and `answered` keeps the row rather than hiding it, because the
answer is the point.

**What the old threads become.** Each thread is one question row
with the note as `body.note`, the steps as tasks in the planner
linked to the question, the sources as evidence rows with stance
`context`, the checks and tools and pages as `links`. Nothing is
lost and nothing needs re-typing.

---

## 9. The Library: what a source is

A source is one row of `research_sources`, and the columns are the
things a list has to show without opening the row; everything else
is in `csl`, which is the canonical record.

**CSL-JSON is the shape, and that is the whole reason citations
work.** The Citation Style Language's JSON is what every citation
processor reads, what Zotero exports, what Crossref and OpenAlex can
be mapped to in twenty lines, and what a style file turns into APA,
Harvard, OSCOLA or Chicago. Store that shape, complete, per source,
and every style is a rendering rather than a migration. The columns
beside it are copies for listing and searching, filled from `csl` on
every write.

| column | what it is | why it is outside `csl` |
| --- | --- | --- |
| `type` | one of the vocabulary below | the list filters on it and colours by it |
| `title`, `year`, `authors` (text, first three) | what a row shows | sorting and the list |
| `doi`, `isbn`, `url`, `identifiers` (jsonb: arXiv, OpenAlex, Semantic Scholar, SSRN, PMID, neutral citation) | the keys the outside world knows it by | dedupe, lookups, and the retraction check |
| `key` | the citation key, unique per reader | what a draft's chip stores; never changes once a draft uses it |
| `status` | `unread | skimmed | read | annotated | cited` | the queue and the meters |
| `priority` | 0 to 3 | the queue's order |
| `rating` | 0 to 5, the reader's own | a list sort |
| `why` | one line, "why I saved this" | the thing a reader forgets first |
| `tags` | `text[]`, lowercased | the gap matrix and every filter |
| `projects` | `uuid[]` | one source, three projects |
| `abstract` | text | search and the queue's preview |
| `files` | jsonb: `[{ key, kind, size, pages, page }]` | the reading room, and `page` is where the reader got to |
| `oa` | jsonb, Unpaywall's answer, dated | a free copy where there is one |
| `retracted` | jsonb, Crossref's answer, dated | never cite one unknowingly |
| `hash` | normalised title plus year | dedupe on import |
| `fts` | generated `tsvector` over title, abstract, authors, tags, why | the board's search |
| `added_via` | `doi | search | bibtex | ris | zotero | pdf | url | manual | review` | the provenance line on the source page |
| `deleted_at` | timestamptz | the thirty-day bin |

**The types**, in `shared/research.ts` as a vocabulary with a colour, a
CSL type and a citation shape each, because a source is not always
a paper:

| type | CSL type | how it is cited | why it is its own type |
| --- | --- | --- | --- |
| `article` | `article-journal` | the ordinary way | |
| `preprint` | `article` | with the repository named | SSRN and arXiv are where finance lives first |
| `book`, `chapter` | `book`, `chapter` | with edition and pages | an edition is a fact about which page said what |
| `thesis` | `thesis` | with the university | the literature of a doctorate is half theses |
| `report` | `report` | with the body and the number | Bangladesh Bank, the IMF, AAOIFI |
| `case` | `legal_case` | OSCOLA: name, year, neutral citation, court | law |
| `statute` | `legislation` | OSCOLA: title, year, section | law |
| `standard` | `standard` | AAOIFI Shariah Standard No. 17, or IFRS | Islamic finance is written in standards |
| `fatwa` | `document` | the board, the number, the date | a Shariah ruling is a source and has no DOI |
| `quran` | `book` with `chapter-number` and `page` as verse | Q 2:275, the translator named | the Quran server connector (section 22) fills the text and the translation; the citation form is fixed |
| `hadith` | `book` | collection, book, number, grade | Sunnah.com's numbering |
| `dataset` | `dataset` | with the publisher, the version and the access date | the lab links a dataset to its source row |
| `web` | `webpage` | with the access date and the archived copy | a captured page is a source too |
| `interview` | `interview` | pseudonym, date, place, in the reader's own record | the field room's rows are sources for citation purposes |
| `software`, `video`, `speech`, `personal` | as CSL names them | | the long tail, so nothing is `other` |

**Duplicates are refused on arrival, not cleaned later.** A DOI
match is a duplicate. An ISBN match is a duplicate. A `hash` match
(title lowercased, punctuation and stop words stripped, plus the
year) is offered as "probably the same, merge?" and the merge keeps
both records' files and notes on one row. The library's own list
has a "find duplicates" action that walks the hashes once.

**The citation key is stable.** `authorYEARword` (`bashar2020empirical`),
made once when the row is created, made unique with a letter, and
never regenerated: a chip in a draft stores the key, and a key that
moved is a citation that broke. Renaming a key is a deliberate
action that rewrites every chip that holds it in the same
transaction, and the source page says how many that is before the
rename lands.

**The retraction check asks Crossref** for the DOI's `update-to`
relationship on import and monthly by the alerts cron, and a
retracted source wears a chip that cannot be turned off, on the
list, on the source page and on every citation of it in a draft.

**The open access lookup asks Unpaywall** on import, once, with the
site's email, and keeps the answer dated. A source with a free copy
shows the link; a source without one shows the publisher's page and
the library's request line (section 29's interlibrary loan tracker).

**A version is a fact about a source.** A working paper becomes a
journal article, a second edition supersedes the first, a bill
becomes an Act. `identifiers.supersedes` and `supersededBy` link two
rows, and a chip on the older one says so. What a draft cited stays
cited: a quotation on page 14 of the working paper is not on page 14
of the article.

**One page per source** at `/tools/research/library/<id>`: the
record as a form (every CSL field editable, with the citation
rendered live in the current style at the top so a correction is
seen at once), the files, the highlights, the notes about it, the
questions it is evidence for, the drafts that cite it, the related
works from OpenAlex (references, cited by, related), the OA and
retraction lines, and the provenance line ("added 3 March from a
search for `herding DSE`"). Nothing on it is a dead end.

**Books get page ranges and chapters** as child rows of type
`chapter` with the book as `container`, because a thesis cites
chapter 4 of a book, not the book.

---

## 10. Finding

**The browser never talks to an index.** `connect-src` is `'self'`
plus three hosts, `scripts/check-csp.ts` scans every string under
`next/` for a hostname, and one caller is the only place that can
meter requests, hold a key and cache honestly. Every lookup goes
through `functions/api/research/` and one adapter per service under
`functions/_lib/scholar/`, each with the same four functions: `search`,
`byId`, `related`, and `status`. Section 22 is the table of services;
this is what the room does with them.

**One search box, every index, one merged list.** A query goes to
every adapter that is on, in parallel, with a two-second budget
each; results are merged by DOI and by `hash`, ranked by how many
indexes returned them and by year, and each row says which indexes
had it. A source already in the library is drawn as such, with its
status, so the list is also "what have I got on this".

**Fielded search where the index supports it**: author, year range,
venue, open access only, type, and for OpenAlex the concept and the
institution. A Boolean builder (section 19) writes the string for
the reader, because every database has its own syntax and a
systematic review has to record exactly what was searched.

**Saved searches are rows** (`research_searches`): the string, the
databases, the date, the hit count, and which review they belong to
if any. That row IS the search log a systematic review's methods
section has to print, and the review room reads it (section 13).

**Alerts are saved searches with a flag.** A weekly cron in the
Worker (`0 6 * * 1`, added to `[triggers]` and to the
`event.cron` switch, or `scripts/check-crons.ts` fails) reruns every
flagged search against OpenAlex and Crossref, filters to works newer
than the last run, and writes the new ones to the reader's inbox as
`research_inbox` rows. **It cannot read the reader's rows to do
that**, because the Worker holds no service key, so the flagged
searches are ALSO written to D1 by the browser when the flag is set
(`research_alerts`: reader id, search string, databases, last run),
which is public data (a search string) keyed to a reader id, and the
Worker's answer is written to D1 too, for the browser to collect
into the inbox at the next visit. A copy of a search string is the
one duplication this plan makes on purpose, and it is the only way a
cron can work for a reader who is asleep.

**Related works** are OpenAlex's three lists on every source page
(references, cited by, related), each row one press from the
library, and the Atlas (section 18) draws them as a graph two hops
out, which is how the seminal papers of a field fall out of any
three starting points.

**The finance shelf.** SSRN has no API and is the first home of half
this field's literature. OpenAlex indexes SSRN and RePEc records, so
a search finds them; what the studio cannot do is fetch the PDF, and
the source page says "on SSRN" with the link rather than pretending.
Journals in the field (the Journal of Islamic Accounting and Business
Research, the Journal of Banking and Finance, and the rest) are a
saved list in Settings so a search can be scoped to them.

**The law shelf.** Find Case Law (the National Archives' open API,
with Atom feeds) for judgments of England and Wales; legislation.gov.uk's
open XML for statutes; both as adapters that answer `case` and
`statute` rows already in OSCOLA shape. BAILII forbids automated
access, so it is a link the reader follows and a record they paste.
Bangladesh's statutes at bdlaws are HTML with no API and are the
same: a link, a paste, a record with `added_via: manual` and the URL.

**The Islamic finance shelf.** The Quran server this session already
connects to has an open counterpart at quran.com, whose API v4 wants
a client credential; the adapter fetches a verse with a named
translation and files it as a `quran` source with the text in the
note, so a citation of Q 2:275 carries what it said. Sunnah.com's API
is by key on request; the adapter is the same shape. AAOIFI standards
are behind a paywall and are `standard` rows with the number and the
reader's own copy.

**The data shelf.** The World Bank and IMF open APIs, FRED with a
key, Alpha Vantage with a key for market series, and Bangladesh Bank
and the Dhaka Stock Exchange as CSV uploads, because neither has an
API worth the name. A data search files a `dataset` source AND a lab
dataset (section 14) in one action, so the citation and the numbers
arrive together.

**Everything is cached in D1** (`scholar_cache`: key, JSON, fetched
at) for a week for a lookup by id and a day for a search, because a
DOI's record is the same for everybody and a rate limit is a shared
resource. Nothing about a reader goes into that table.

---

## 11. The Reading room

**The queue first.** `/tools/research/read` is the list of sources
with a file and a status short of `read`, in priority order, each
with its abstract, its `why`, its page count and where the reader
got to. `Enter` opens the top one. On a phone this page and the
reader are the studio.

**The reader is pdf.js, self-hosted.** `pdfjs-dist` from npm,
bundled by Next, with its worker served from `next/public/` under
this origin and `worker-src 'self'` added to the policy in both
`aab/_headers` and `shared/headers.ts`, which `scripts/check-headers.ts`
keeps in step. Not a CDN: `script-src` is `'self'` and stays so.

**Highlights are anchored to text, not to pixels.** A highlight
stores the page, the text quoted, a prefix and suffix of thirty
characters, and the rectangles in PDF user space (viewport
independent), which is the W3C Web Annotation model's
`TextQuoteSelector` beside a position: if the rectangles fail (a
re-OCRed file, a different edition's PDF), the quote still finds
itself. `research_highlights`, one row per highlight, `meaning` in
`claim | evidence | method | quote | question`, a note beside it, and
the highlight's own address so a question's evidence and a draft's
quotation can point at it.

**Five meanings, five colours, five keys.** `1` to `5` while text is
selected. A highlight is a card in the right pane with its page, its
text and its note, and the cards are the source's outline when the
reading is done. Dragging one on to a question in the side rail
makes evidence; dragging one into a draft makes a quotation with a
page-numbered citation.

**Extraction cards** are highlights with structure: a number and its
unit, a sample size, a method name, a finding in one line, each a
field on the card rather than free text, so the review room's
extraction table (section 13) can be filled from the reading rather
than after it.

**One line at the end.** When status moves to `read`, the reader is
asked for one sentence, "what this said", which becomes the
literature note's first line (section 12). Not required, and the
question is asked once.

**Web pages** are captured through the Worker (`/api/research/capture`),
which fetches the page, runs it through the site's own sanitiser in
`functions/_lib/sanitise.ts` after a readability pass, and stores the
result as an `html` file in R2 beside the source. The reader shows
the stored copy with the same highlighter over its text, so a page
that changes or dies is still the page that was read. The access date
is the capture date, which is what the citation needs.

**Audio** (interviews, lectures) opens in a player with a waveform, a
transcript beside it if there is one (section 15), and a highlight
is a time range rather than a rectangle. The same five meanings.

**Books** are page ranges the reader types, because a book is a
physical thing: a `book` source with no file still has highlights,
each carrying a page number and typed text, marked `typed` so a
quotation from one says so.

**OCR is a later stage** (section 31): tesseract.js with the Bangla
and English models self-hosted, run in a worker, for a scanned PDF
whose text layer is empty. Until then a scanned file says "no text
layer" rather than failing to highlight.

**The phone.** The reader lays out one page wide, the highlight
toolbar sits under the selection, and the queue's next and previous
are swipes. `data-scrolling` on the root stands the glow down here as
it does everywhere.

**Kept offline, by choice.** A source's file can be marked "keep on
this device", which puts it in the Cache API under a budget the
Settings page shows; the service worker does not precache anything
of the studio's, and the marked files are the reader's own list.
Section 26.

---

## 12. The Notebook

**Six kinds of note, and the kind decides where it appears:**

| kind | is | appears |
| --- | --- | --- |
| `capture` | a thought, one line or a paragraph, from the capture box | in the inbox until filed |
| `literature` | what one source said, bound to it | on the source page, in the library's list |
| `permanent` | one idea in the reader's own words, linked to what it came from | the notebook proper; the Atlas draws these |
| `daily` | the lab notebook: what was done, decided, abandoned | one per day, the planner's day view |
| `meeting` | agenda, minutes, actions, with the people | the planner's events |
| `memo` | the qualitative memo: a thought about a code or a transcript | the field room |

Plus `assistant`, section 21, which is a kind rather than a flag so
the notebook can be filtered to what a person wrote.

**The editor is the site's one editor.** `createEditor()` in
`aab/editor.js`, built from `aab/src/editor.ts`, mounted into a shell
the notebook draws, exactly as the Studio and the practice books
mount it. `CLAUDE.md` says why a second contenteditable is the bug
and it is not repeated here. What the notebook adds are three
extensions to that module, in that module, so every editor on the
site gets them: a citation chip (`@` opens a picker over the library
and inserts a chip holding a key), a link chip (`[[` opens a picker
over notes, questions, sources and people), and a math block (KaTeX
rendered from `$$`, source kept as text). The sanitiser's allowlists
gain the chip's class in all three places `CLAUDE.md` names, and
`scripts/check-css.ts` fails if two of the three disagree.

**Links go both ways.** A note stores `links: uuid[]` of what it
points at; the backlinks are a query, never a second column.
Every object's side rail lists what links to it, which is what turns
four hundred notes into a notebook rather than a pile.

**Search is Postgres.** `fts` over title and text, `simple`
configuration so Bangla tokenises at all, plus `pg_trgm` for the
partial words a reader types while thinking. Semantic search over
the same text is section 21's.

**Versions.** Every write to a note or a document also inserts a row
into `research_versions` (kind, item id, body, at) when the previous
version is older than ten minutes, so a day's typing is a handful of
snapshots rather than a thousand, and the Archive room can open any
of them. Restoring is a copy forward, never a delete.

**Two tabs, one note.** The write carries the `updated_at` it last
saw as a PostgREST filter (`updated_at=eq.<seen>`); zero rows changed
means somebody else, usually the same person on a phone, wrote
first, and the page says so and offers both rather than silently
winning. The desk's controlled-field lesson holds too: the box is
the reader's, the row's answer never replaces what is under the
caret, and the studio's test types through a slow save and watches
the box across the window rather than at the end.

**Templates** are notes with a flag: a literature note template
(citation, summary, method, findings, my take, quotes), a meeting
template (attendees, agenda, decisions, actions), a memo template.
Three ship; the reader makes more by flagging any note.

**Markdown in, Markdown out.** A paste of Markdown is converted by
the editor's own input rules; an export writes the site's article
HTML back to Markdown with chips as `[@key]` and links as
`[[title]]`, which is the shape Obsidian and Pandoc read. A whole
vault can be imported from a zip and exported to one (section 24).

**The daily log is the planner's spine.** Every session (section 17)
appends to it, every task done writes a line, and the reader adds
their own. A year of daily notes is what "what did I do in March"
answers, and it is the one document a viva examiner might genuinely
ask for.

---

## 13. The Review room

For a systematic, scoping or narrative review, done to the standard
a methods section has to describe, and drawn as PRISMA at the end.

**A review is a row** (`research_reviews`) holding the protocol:
the question in a frame (PICO, SPIDER or plain), the inclusion and
exclusion criteria as a list with an id each, the databases to be
searched, the date range, the languages, and who screens. The
protocol is versioned like a note, because a protocol that changed
has to say when.

**The search log is the saved searches** of section 10 with the
review's id on them: database, string, date, hits, each a row the
methods section prints as a table, exported to Word by the writing
desk in one press.

**Records are not sources yet.** A search's results are imported as
`research_review_records`: the raw record as returned, a stage
(`found | deduplicated | title | fulltext | included | excluded`),
a reason id from the protocol for an exclusion, and the date of the
decision. A record becomes a library source only when it is
included, which keeps four thousand screened abstracts out of the
library and keeps the library the reader's own.

**Screening is a keyboard page.** Title and abstract in the middle,
`y` include, `x` exclude with a reason picked by number, `m` maybe,
`j`/`k` to move, a meter of how far through, and the queue's `next`
cue on each decision. Full-text screening is the same page with the
reader open beside it. Blind double screening is out of scope for
one person and said so in section 33; the columns are shaped so a
second screener is a second decision column rather than a redesign.

**PRISMA 2020 is derived.** The flow diagram's boxes are counts of
records by stage and reason, drawn in SVG from the rows, and never
typed. Change a decision and the diagram changes. It exports as SVG
and PNG for the thesis.

**Extraction is a sheet.** The review's extraction table is the
lesson sheet model in `shared/lesson-grids.ts` applied to a table
whose columns the reader defines (sample, country, period, method,
finding, effect size, quality), one row per included source,
prefilled from the extraction cards the reader made while reading
(section 11). It exports as CSV and as a Word table.

**Quality appraisal** is a checklist per included source, from a
template (CASP, JBI, or the reader's own), with the score derived and
the answers kept. Templates are data in `shared/research.ts`.

**Synthesis** is themes: tags across included sources, drawn as the
gap matrix of section 8 scoped to the review.

**A narrative review** is the same room with the screening stages
turned off: a protocol, a search log, and a synthesis. The
difference is a flag on the review row.

---

## 14. The Lab

Where the numbers are, and the one room that has to say honestly
what a browser can and cannot do.

**A dataset is a source and a file.** `research_datasets` holds the
name, the file keys, the dictionary, the provenance (a source row,
a URL, or "typed by me"), the licence and the notes; the file is CSV,
TSV, XLSX or Parquet in R2. Uploading writes a `dataset` source row
too, so the thesis can cite it.

**DuckDB in the browser is the engine.** `@duckdb/duckdb-wasm`,
self-hosted with its worker and WASM files under this origin, which
needs `'wasm-unsafe-eval'` added to `script-src` in both header
lists. It reads a 200 MB CSV on a laptop without a server, answers
SQL in milliseconds, and gives the lab a query language rather than
a menu of buttons. A file is loaded into DuckDB from the ticketed R2
URL and kept in the browser's origin private file system between
visits, so the second open is instant and nothing of the data passes
through the Worker after the upload.

**The dictionary is the variables registry.** Every column of a
dataset gets a row: name, type, unit, definition, and a link to the
variable in section 8, so the thesis's variable table, the
dataset's documentation and the lab's column labels are one list.

**A transform is SQL, saved.** Cleaning steps, joins, derived
columns (log returns, excess returns, dummies) are SQL views the
reader writes with help, kept as rows so a dataset's lineage is
readable and re-runnable. CodeMirror is the editor for these.

**Statistics, in two tiers.**

The first tier is TypeScript and runs in every browser: descriptive
statistics, correlation matrices, t-tests, ANOVA, chi-square,
Mann-Whitney, OLS with HC-robust standard errors, logistic
regression, and the finance helpers this field asks for by name:
simple and log returns, CAPM beta, Sharpe and Sortino, Fama-French
factor regressions against uploaded factor series, Fama-MacBeth
two-pass, CSAD herding regressions, an event study with abnormal
returns and a cumulative window, historical VaR, and an ADF test for
a unit root. Each is a function in `shared/research-stats` with a
test against a known dataset and R's answer to four decimals,
because a regression that is nearly right is worse than none.

The second tier is Python, later (section 31): Pyodide with pandas
and statsmodels, self-hosted, opened on demand in the lab's notebook
cells, for GARCH, ARDL, panel fixed effects with clustered errors,
and anything else the first tier does not do. It is 15 MB the first
time and cached after; it is opt-in; and the reader is told what it
costs before it loads. R through webR is the same shape and comes
after Python if wanted.

**Every result is a run.** `research_runs`: the kind (`sql | stat |
chart | python`), the inputs, the code, the hash of the data it read,
the output as JSON, the figure as SVG, a label, and the time. A run
is a page (`/tools/research/lab/run/<id>`), it can be re-run against
the data, and it is what a draft's figure or table points at. A table
in the thesis that cannot be traced to a run is the thing this room
exists to prevent.

**Charts** are the site's own `Spark` where a sparkline will do and
Observable Plot where it will not, rendered to SVG so a run's figure
is a file. The dataviz rules the site already follows apply: one
palette, both themes, a legend that reads.

**Tables in APA shape** come out of a run in one press: a regression
table with coefficients, standard errors in brackets, stars if the
reader wants them (and a switch to say no), N and R squared in the
foot, as a Word table and as Markdown.

**Market data** through the Worker: Alpha Vantage for daily series
by symbol with a key, cached a day; a saved series becomes a dataset
with its source. Dhaka's exchange is a CSV the reader downloads and
drops, and the lab's importer knows the DSE's column names.

**Power and sample size**, effect size conversions and a
"which test" picker are Workshop tools (section 19) that open with
the lab's data already selected.

---

## 15. The Field room

Qualitative work, which is people, and which is the one room where
somebody other than the reader has a stake in what is stored.

**Participants first, and they are pseudonyms.** `research_participants`:
a pseudonym (P07, "the treasurer"), a project, a role, and a consent
record (`consent`: status, date, the form's file key, what was
consented to, whether quotes may be used, withdrawal date if any).
The real name and contact, if kept at all, go in `sealed`, encrypted
in the browser with a passphrase the reader holds and the site never
sees, the same AES-GCM shape the broker key uses, so a leaked
database is a list of pseudonyms. Everything else in the room refers
to the pseudonym.

**An interview is a source of type `interview`** with the audio as
its file, the participant as its author, and the transcript as a
note of kind `transcript`: a list of segments `{ start, end,
speaker, text }` in `meta.segments`, rendered as prose with the time
in the margin, and a highlight on it is a time range.

**Transcription is Workers AI, through the Worker.** Cloudflare's
Whisper model on the `AI` binding, which `wrangler.toml` explains is
turned on in the dashboard rather than declared, so that `wrangler
dev` keeps working; without it the room says "transcription is not
connected" and the reader types or pastes, as `functions/api/news.ts`
already degrades. The large-v3-turbo model handles Bangla. A
transcript is never trusted blindly: it arrives as `draft`, the
reader corrects it against the audio with the player's `[` and `]`
nudging five seconds, and marks it `checked`. Audio is uploaded as
recorded (webm/opus from the browser's recorder, or an m4a from a
phone) and is the largest thing the studio stores, which is why
section 23 has a quota.

**The codebook is a tree.** `research_codes`: name, definition,
colour (one of the seven), parent, order, project. A code's
definition is written when the code is made, because a codebook
without definitions is one nobody else can apply, and the room asks
for it in the same box.

**Coding is selecting text and pressing a code.** A coding
(`research_codings`) is a code, a note (the transcript), a start and
end offset into the segment text, the text itself, and a memo. The
transcript shows codings as coloured underlines that stack, the
right pane lists the codes present, and pressing a code retrieves
every coded segment across the project in one list with the
participant and the time beside each.

**Matrices come out of the rows.** Code by participant (who said
what), code co-occurrence (which ideas travel together), code
frequency over the interviews in order (when a theme appeared). All
derived, all exportable as CSV, and drawn as heat tables with the
site's sequential palette.

**Memos are notes of kind `memo`**, linked to a code, a coding or a
participant, and the analytic memo that becomes a chapter section
is a memo the writing desk imports.

**Bangla and English side by side.** A quote in a transcript can
carry a translation as a second text on the coding, and a draft that
quotes it inserts both, the original in Bangla and the translation
beneath, because a thesis in English about interviews in Bangla has
to show its working.

**Surveys are the one thing that lives in D1.** A survey
(`research_surveys` in Supabase) is questions as JSON, a title, a
public token, and open or closed. Publishing it puts a copy of the
questions and the reader's id into D1 (`survey_forms`), and the form
page at `/tools/research/survey/<token>` is a public route the
Worker renders and the Worker receives: a stranger's answers go into
D1 (`survey_responses`) through a throttled endpoint, because the
Worker cannot insert into Supabase as nobody and this project holds
no key that would let it. The reader collects responses through a
gated endpoint that checks the survey's owner id against
`readerFrom()`, and the lab reads them as a dataset. Likert scales,
multiple choice, free text, a consent gate at the top, a thank-you
at the end, both languages on every question.

**The interview guide** is a note from a template, linked to the
project, with a "this was asked" tick per question per interview,
so the methods chapter can say which questions were put to whom.

---

## 16. The Writing desk

**A document is a row** (`research_documents`): kind (`chapter |
paper | proposal | abstract | letter | other`), a project, an order
within it, a title, an outline as JSON, the body as the site's
article HTML, the plain text beside it for search and counts, a word
budget, a citation style, and a state (`outline | drafting |
revising | done`). A thesis is a project's documents of kind
`chapter` in order; a paper is one document.

**The outline is the argument.** A document's outline is a tree of
headings the reader drags into order, seeded from the questions
tree of section 8 if they want, and the body's headings ARE the
outline: editing one edits the other. Each heading can carry a
budget, and the meter under it fills.

**The editor is the site's one editor**, with the three extensions
section 12 gives it, and the citation chip is where the desk earns
its name.

**A citation is a chip holding a key and a locator.** `@` opens a
picker over the library, filtered as the reader types, `Enter`
inserts a chip, and typing after it a page number, a paragraph or a
section sets the locator. The chip renders live in the document's
style through citeproc, so `(Bashar, 2020, p. 14)` in APA is `Bashar
2020, 14` in Chicago author-date is a footnote in OSCOLA, out of the
same chip. The bibliography at the end is a block that renders from
every chip in the document, in the style's order, and it is never
typed. A source cited in a draft moves to status `cited`.

**Footnotes exist, because OSCOLA does.** Law cites in footnotes,
with `ibid` and cross-references, and a citation processor can do
this only when the document tells it which citations share a note.
The editor gains a footnote block (a marker in the text, a note at
the foot, numbered by position), a citation chip inside a footnote
is one item in that note's cluster, and citeproc's `note` mode is
what renders it. This is the single hardest piece of the desk and
it is in stage 4 rather than later because a law chapter cannot be
written without it.

**Styles are files.** A dozen CSL files from the official
repository vendored under `next/public/csl/` with the licence beside
them, en-GB locale: APA 7, Harvard (Cite Them Right), OSCOLA,
Chicago author-date and notes, MLA 9, IEEE, Vancouver, Elsevier
Harvard, Emerald Harvard, and two the reader adds by pasting a CSL
file into Settings. The document's style is a setting per document
and the project's default is one per project, because a thesis and
a paper from it are in different styles.

**Figures and tables point at runs.** Inserting a figure opens the
lab's runs; the chip holds the run id and renders its SVG with a
caption and a number. Numbers are derived by position and kind
(Figure 3.2 is the second figure in chapter 3), and a cross-reference
chip (`see Figure 3.2`) renders from the same count, so nothing
renumbers by hand. A table from a run renders as a real table with
the APA shape of section 14.

**Quotations carry their page.** Dragging a highlight in inserts the
quote with a citation chip whose locator is the highlight's page,
and a quote longer than forty words becomes a block quotation by the
style's own rule.

**The glossary and the abbreviations list are derived.** A term the
reader marks once (a chip of kind `term`) is collected into a
glossary block; an abbreviation defined once (`Liquidity Coverage
Ratio (LCR)`) is collected into the list, and the desk warns quietly
when an abbreviation is used before it is defined.

**The claims audit** is a pane, not a script: every sentence in the
document that holds a number or a claim word (`shows`, `finds`,
`demonstrates`, `significant`) is listed with whether a citation chip
or a run chip sits within it, and the ones with neither are the
reader's list to work through. It is the rule at the top of
`CLAUDE.md` about numbers, applied to prose.

**The self-overlap check** compares the document's sentences with
the text of the library's own sources and the reader's other
documents by shingled n-grams, locally, and lists overlaps above a
length, so an unquoted paraphrase too close to its source is seen
before an examiner sees it. Not a plagiarism service and it says so:
it reads only what the studio holds.

**Exports, all from one row:**

| format | how | what it carries |
| --- | --- | --- |
| Word | the `docx` library in the browser | real headings, real footnotes, a real bibliography, tables, figures as images, the reader's name and affiliation from Settings |
| PDF | the site's print stylesheet and the browser's print | the same page, on paper |
| Markdown with citations | the editor's own writer | `[@key, p. 14]` in Pandoc's form, so Pandoc and Quarto read it |
| LaTeX skeleton plus BibTeX | a writer per block kind | for a journal that wants `.tex`; every source cited becomes a BibTeX entry |
| Google Docs | the Worker, through the Drive service account the course section already holds, into a folder the reader names | for a supervisor who lives in Docs |
| a piece on this site | `PUT /api/articles` into the Article Studio as a draft | how a book chapter becomes a page on reiad.co.uk |

**Versions** are section 12's, and a document can be "snapshotted"
by name ("sent to supervisor 14 May") so the Archive room can show
what was sent and what changed since, as a diff of the plain text.

**Counts that count.** Words, and words per section against budget,
in both scripts (Bangla words are counted by the same rule
`next/reading.test.ts` measures lines by), reading time, and the
number of citations, all in the document's foot, all derived.

**Bangla prose is welcome.** The book project is written in Bangla
with English sources; the editor already sets Bangla with its own
leading and face, chips render the citation in the document's style
regardless of the prose's language, and the export to Word carries
the Bangla font name so it opens correctly.

---

## 17. The Planner

**Projects hold everything.** `research_projects`: a name, a kind
(section 2), a state, a tone, and a `body` with the aims, the
institution's rules (word limit, style, submission format, the
regulations file as an R2 key), the data statement (section 25) and
the supervisors as people. Every row in the studio carries
`projects`, and the planner is where a project is looked at whole:
its documents with their meters, its milestones, its next five
dates, its open questions, its sources by status.

**Milestones are events**, and so are deadlines, meetings,
conferences and submissions: `research_events` with a kind, a time,
an optional end, a project, and a `body` shaped by the kind. A
meeting's body is agenda, minutes, decisions and actions (and the
actions become tasks). A submission's body is the journal, the
status (`preparing | submitted | under review | revise | accepted |
rejected | published`), the dates of each, and the reviewers'
comments as a table of comment, response and change, which is the
response letter written as it happens.

**The task board has four lanes and no red.** `research_tasks` with
`lane` in `later | week | today | waiting | done`, an order within
the lane, a due date that is a fact and not a colour, a project, and
`links` to whatever the task is about (a source to read, a question,
a document, a run). Drag between lanes with the site's `@dnd-kit`
(section 32), `tick` on done, and the done lane folds after a week
into the daily log where it belongs. "Waiting" is a lane because a
doctorate is half waiting for somebody: a supervisor's comments, an
ethics decision, a dataset request.

**The timeline** is the project's events and documents on a year
axis, drawn in SVG, with the present as a line and the past shaded,
so "where am I against the plan" is a picture. A Gantt view is the
same rows as bars where an event has an end.

**The calendar goes out, not in.** An ICS feed per reader at
`/api/research/ics?t=<ticket>`, a long-lived ticket minted in
Settings and revocable, so Google Calendar, Outlook and a phone show
the studio's dates without the studio holding an OAuth grant to
anybody's calendar. Reading a calendar IN is section 33.

**Sessions are the time log.** A session is started from the board
or from any room (`research_sessions`: project, room, started,
ended, note), the timer sits in the topbar's corner while it runs,
and stopping it appends a line to the daily log. A twenty-five
minute default with a bell that is the `stage` cue at low gain, no
count of sessions, no chart of hours unless the reader asks for one
on the project page, where it is drawn as a fact.

**The weekly review is a page**, `/tools/research/plan/week`: what
was done (from sessions and tasks), what is next (the lanes), what
is waiting and for how long, what was read, and one box for the
week's note. Sunday morning is a suggestion in Settings and never a
notification.

**The reading queue is the planner's too**: section 11's queue, with
a "this week" lane of its own.

---

## 18. The Atlas

**One graph of everything.** Sources, notes, questions, codes,
people, runs and documents as nodes; every link, citation, evidence
row, coding and `projects` membership as an edge. Drawn with
Cytoscape (section 32) in a canvas, filtered by kind and project,
coloured by the kinds' own colours, with a node's page one press
away. It is derived entirely from the rows and is never edited
here: the graph is a view.

**The citation network** is the graph two hops out from any chosen
sources, using OpenAlex's references and cited-by lists (section
10), with nodes not yet in the library drawn hollow and importable
by a press. This is how the ten papers every examiner expects to be
cited fall out of the three the reader started with, and it is the
one place the studio reaches outside its own rows to draw.

**The literature timeline** is the library on a year axis, one dot
per source, sized by citation count where OpenAlex knows it,
coloured by type, with the reader's own tags as swim lanes. A field's
shape is visible in it: when the herding literature started, when
the Islamic fund papers arrived.

**The canvas is Excalidraw.** A free canvas per project
(`research_canvases`, the scene as JSON), for concept maps, theory
diagrams and the drawing of a model, with the studio's objects
droppable on to it as linked cards. Excalidraw's package is MIT and
embeds as a React component; its fonts are self-hosted. tldraw is
not used, section 32 says why.

**People** (`research_people`): supervisors, authors the reader
corresponds with, examiners, participants' gatekeepers. Name, role,
ORCID, email, institution, notes, and links to their sources. The
supervisor shortlist from Notion is fifteen of these rows with a
`body.fit` note each and the spouse-visa question as a task. An
author page shows every source of theirs in the library and, from
OpenAlex by ORCID, what they have published since.

---

## 19. The Workshop

Thirty small tools, each one card in a deck out of a table
(`next/lib/research-tools`), each with a Bangla and an English name,
a one-line dek, a tone, and an address under `/tools/research/tools/`.
Each is a page a reader can link to, most take a query string so a
result is shareable, and the ones that belong to a room open from
that room with its data already selected. They are small on purpose:
a tool here is a form and an answer.

| tool | does | reads |
| --- | --- | --- |
| Cite this | a DOI, ISBN, URL or pasted reference to a citation in any style, and into the library in one press | Crossref, OpenAlex, Open Library, citeproc |
| Parse a reference | a messy pasted reference to a CSL record, by asking Crossref's bibliographic search and showing the match's confidence | Crossref |
| Resolve an id | DOI, arXiv, PMID, SSRN, OpenAlex, neutral citation: what is it and where does it live | the adapters |
| Find a free copy | Unpaywall's answer for a DOI, with the version it is | Unpaywall |
| Is it retracted | Crossref's `update-to` for a DOI or for the whole library | Crossref |
| Journal finder | journals in OpenAlex by concept, with open access status, and whether DOAJ lists them | OpenAlex, DOAJ |
| Predatory check | DOAJ membership, publisher, and the questions to ask, never a blacklist | DOAJ |
| Boolean builder | a search string from fields and operators, in each database's syntax, saved as a search | the review room |
| Question builder | PICO, SPIDER and PEO frames into a question and criteria | the review room |
| Sample size and power | for a proportion, a mean, a correlation and a regression, with the assumptions written out | the lab |
| Effect size converter | d, r, eta squared, odds ratio, with confidence intervals | the lab |
| p to CI, CI to p | the conversions a reader does on the back of a paper | |
| Which test | a decision tree from the data's shape to a test, opening the lab's test with the data selected | the lab |
| Returns | prices to simple and log returns, with a chart | the lab |
| Currency and inflation | the site's own calculators, opened with the studio's numbers | the calculators |
| Hijri and Gregorian | dates both ways, for sources dated in the Islamic calendar | |
| Date arithmetic | days between, working days between, a deadline minus a buffer | the planner |
| Word counter | words, characters and reading time, in both scripts, on any pasted text | |
| Abbreviations | the document's abbreviations as a list, and the ones used before definition | the desk |
| Readability | sentence length and passive voice on a document, as facts, no grade | the desk |
| Self-overlap | section 16's check on any pasted text against the library | the desk |
| Table maker | a grid to Markdown, HTML, Word and LaTeX | |
| Equation editor | LaTeX in, KaTeX out, copied as an image or as source | |
| PRISMA drawer | the diagram from typed counts, for a review not run here | the review room |
| Quiz me | flashcards of terms and methods with spaced repetition (`ts-fsrs`), for the viva and for a new field's vocabulary | the notebook's `term` chips |
| Viva bank | the questions an examiner asks, with the reader's own answers kept beside each | the desk's documents |
| Ethics helper | a data statement and a consent form from a template, in both languages | the field room |
| Email templates | a request to an author for a paper, a note to a supervisor, a cover letter, with the reader's details from Settings | the people |
| CV and publications | a CV section built from the reader's own sources of type `article` where they are an author | the library |
| Random and sampling | random numbers, a random sample of rows, a random order, with the seed shown | the lab |

Two tools are already the site's (the currency and inflation
calculators) and open in place with values passed in the query;
`scripts/check-api.ts` holds the Worker routes the others call.

---

## 20. The Methods room

A method is a lesson. The money school already has twelve kinds of
interactive block, a sheet model and a lab model in `shared/lesson.ts`,
`shared/lesson-grids.ts` and `shared/lesson-labs.ts`, and a method
card wants exactly those: a worked example the reader can change,
a checklist, a sheet with a formula in it, and a note about where it
goes wrong.

**So methods are pieces**, written in the Article Studio with the
tag `method`, held in D1 like every piece, and the room is a hub that
lists pieces with that tag, grouped by kind (finding, reading,
quantitative, qualitative, writing, citing). Nothing new is built to
hold them; what the studio adds is the room and the link from each
lab test, each field tool and each desk feature to its method
("how to read this table", "how to code a transcript", "what OSCOLA
wants in a footnote").

**The first twelve to write**, because they are the ones the three
projects will need in their first year: reading a paper in an hour;
a literature note that is worth keeping; a search string for a
systematic review; screening without losing your mind; OLS and what
the robust errors are for; a factor regression and what a beta
means; CSAD herding, step by step; an event study by hand; thematic
analysis in six steps; a codebook that another person could apply;
a citation in OSCOLA; a chapter outline from a question tree.

**They are in both languages** the way every lesson is, and they
are the one part of the studio a stranger can read, because a piece
is public: the room links to them, and the methods are the studio's
public face.

---

## 21. The Assistant

**Grounded, or nothing.** The assistant reads the studio's rows and
nothing else: the sources' records, abstracts and highlights, the
notes, the questions, the runs, the document being edited. It is
handed those as context by the browser, through the Worker, with
the reader's own bearer, and it answers with citations that are the
studio's own ids, rendered as chips. An answer that names a paper
the library does not hold is drawn with that name struck through and
"not in your library" beside it, and offered as a search. It does
not browse.

**What it is for**, as a list the drawer offers and the reader picks
from, because a blank prompt box is a tool nobody uses well:

- summarise this source in five lines, with page numbers;
- pull the method, the sample, the data and the finding out of this
  source into extraction fields;
- what do my highlights on this source say, in order;
- which of my sources speak to this question, and how;
- suggest codes for this segment out of my codebook, and say why;
- draft a paragraph on this question from these three sources,
  citing them, and show me the sentences you could not support;
- read this section as an examiner would, and list the questions;
- turn this search question into strings for OpenAlex, Scopus and
  Google Scholar;
- translate this quotation into English and keep the original;
- explain this regression table in plain words;
- write the PRISMA paragraph from this review's numbers;
- tidy this reference list against the library.

**It never writes into a draft on its own.** Every answer is a note
of kind `assistant` with the prompt, the model, the context ids and
the cost on it, and "insert" is a press that puts the text at the
caret with the citations as chips. What the reader inserts is the
reader's; what they do not is a note they can delete.

**Models, by task.** The Worker holds one key (`ANTHROPIC_API_KEY`,
a wrangler secret) and picks the model by the task's shape: the
small model for tagging, code suggestions and translations; the
middle model by default; the largest for a chapter read as an
examiner. The identifiers this session was given are
`claude-haiku-4-5-20251001`, `claude-sonnet-5` and `claude-fable-5-1`,
and the build reads the `claude-api` skill for the current
parameters, the prompt caching rules and the prices before writing
the adapter, rather than this plan asserting them.

**Streaming, and a cost meter.** Answers stream into the drawer;
every call's input and output tokens are written on the note and
summed on the Settings page as a month's figure in pounds, because
a running cost is the one number that decides whether this feature
stays on.

**Semantic search is the same door.** `research_chunks` holds every
source's abstract and highlights, every note and every document
section as chunks with an embedding from Workers AI's multilingual
model (`bge-m3`, which reads Bangla), computed by the Worker when a
row is written and stored by the browser as the reader. The board's
search box asks Postgres for the nearest chunks through an RPC that
runs as the reader under row-level security, and "ask my library" is
that search with the assistant reading the top twenty. Without the
`AI` binding the search box is full text only and says so.

**What it is not**, said here so nobody builds it: not an agent that
edits rows, not a chat with memory of its own beyond the notes it
made, not on by default for anybody (Settings has the switch and the
key's presence is what enables it), and not a substitute for reading.
The reading room asks for the reader's one line before the assistant
will summarise a source, which is a small friction on purpose.

---

## 22. Connections

Everything outside this site, in one table, and the rule is the
diet tool's: **the reader's own rows are the browser's, and somebody
else's database is the Worker's.** Every service below is reached
only from `functions/api/research/` through an adapter under
`functions/_lib/scholar/`, every key is a wrangler secret or a
sealed per-reader row, and `GET /api/research/status` says which of
them are on, in one word each, the way the diet route's `sources`
does. Nothing here is required: a service that is off is a sentence
on the page, never an error.

| service | for | credential | where it lives | limits, as read on 2 September 2026 | cached |
| --- | --- | --- | --- | --- | --- |
| **OpenAlex** | search, related works, citation counts, journals, authors by ORCID | an API key, required for all use since 13 February 2026, with a free daily allowance and usage billing beyond it; the old polite pool and `mailto` are gone | `OPENALEX_KEY` secret | 10 requests a second, 100,000 a day per key | a day per search, a week per work |
| **Crossref** | DOI records, bibliographic search, retraction (`update-to`), the `polite` pool by `mailto` | an email in the `mailto` parameter; rate limits revised from 1 December 2025 | `CROSSREF_MAILTO` var | the polite pool's published limits; the Worker keeps under them with a queue | a week per DOI |
| **Unpaywall** | a free copy for a DOI | an email parameter, no key | `UNPAYWALL_EMAIL` var | 100,000 calls a day | a month per DOI |
| **Semantic Scholar** | search, references, citations, TL;DR summaries | an API key by email; 1 request a second to start | `S2_KEY` secret | 1 a second on a new key; the Worker serialises | a day |
| **CORE** | open access full text search | an API key | `CORE_KEY` secret | per key | a day |
| **Europe PMC** | biomedical and some economics full text | none | | published courtesy limits | a day |
| **arXiv** | preprints | none; a three-second courtesy gap | | one request every three seconds | a day |
| **DOAJ** | journal and open access status | none | | courtesy | a week |
| **Open Library** | ISBN to record | none | | courtesy | a month |
| **Zotero Web API** | import a reader's library, collections and tags; export back | the reader's own key from zotero.org, read-only scope, kept sealed per reader | `research_connections` row, AES-GCM under `RESEARCH_TOKEN_KEY` | Zotero's own | not cached; a pull is a press |
| **ORCID public API** | an author's works | none for the public read | | courtesy | a week |
| **Find Case Law** | judgments of England and Wales | none; the National Archives' open API | | their published terms | a week |
| **legislation.gov.uk** | statutes as XML | none | | courtesy | a week |
| **quran.com API** | a verse and a translation as a `quran` source | OAuth client credentials | `QURAN_CLIENT_ID`, `QURAN_CLIENT_SECRET` secrets | their terms | permanently, a verse does not change |
| **sunnah.com API** | a hadith as a `hadith` source | a key by request | `SUNNAH_KEY` secret | their terms | permanently |
| **World Bank, IMF** | series as datasets | none | | courtesy | a day |
| **FRED** | US series | a key | `FRED_KEY` secret | 120 a minute | a day |
| **Alpha Vantage** | market series by symbol | a key | `ALPHAVANTAGE_KEY` secret | the plan's per-minute and per-day limits; the Worker meters | a day |
| **Bigdata.com** | financial news, filings, transcripts and its academic journals category | an API key | `BIGDATA_KEY` secret | the plan's | a day |
| **Workers AI** | transcription (Whisper) and embeddings (`bge-m3`) | the `AI` binding, added in the dashboard as `wrangler.toml` explains | dashboard | the account's neurons allowance | transcripts kept; embeddings kept |
| **Anthropic** | the assistant | an API key | `ANTHROPIC_API_KEY` secret | the account's | answers kept as notes |
| **Google Drive** | export a document to Docs, import a file from a folder | the service account the course section holds; the reader shares a folder with it | exists | Drive's | no |
| **Notion** | import a page as a note | the integration token the Studio holds | exists | Notion's | no |
| **the site's own Article Studio** | a chapter to a piece | the admin session | exists | | |

**Three things the table says between the lines.**

- **The two indexes that used to be free by courtesy now want a
  key.** OpenAlex requires one for every request since February and
  bills by usage above a free allowance; Crossref reset its limits
  in December. Both were the assumptions the old desk would have
  built on. The studio's Find is designed so that any one index can
  be off: the merge works over whatever answered, and the status
  line says what did.
- **Keys are wrangler secrets and nothing else.** The Notion home
  page lists eleven credentials sitting in plain text; none of the
  studio's ever goes in Notion, in a row, in a comment or in this
  file. A per-reader credential (Zotero) is sealed the way a broker
  key is sealed, and the Worker never learns it in the clear except
  inside one request.
- **Google Calendar is out, deliberately.** Reading somebody's
  calendar means an OAuth grant, a refresh token and a fourth way of
  being signed in; the ICS feed out (section 17) gives every calendar
  the studio's dates with none of that.

**What this session's connectors are for, which is a different
question.** Claude's sessions on this repository can reach Notion,
Drive, Gmail, Calendar, Slack, Supabase, Cloudflare, GitHub, Bigdata.com,
Alpha Vantage and the Quran server. Those are for BUILDING and for
checking the studio (reading a migration, running SQL on a branch,
checking a Worker's bindings), not for the studio at run time: the
studio is a website and reaches the world through its own Worker
with its own keys.

---

## 23. What gets stored, and where

Three stores and a browser, and which of the four a thing goes in is
decided by one question: whose is it, and who has to be able to
read it without a person present.

| store | holds | because |
| --- | --- | --- |
| **Supabase**, `research_*` tables | every row the reader made or chose | it is theirs; row-level security; every device; the account's two buttons |
| **R2**, `research/<user id>/` | files: PDFs, audio, captured pages, datasets, exports, consent forms | bytes do not belong in Postgres, and the site already has a bucket and a `MEDIA` binding |
| **D1** | `scholar_cache` (public lookups), `research_alerts` (the cron's copy of flagged searches and their answers), `survey_forms` and `survey_responses` (a stranger's answers), `share_comments` (a supervisor's comments on a shared draft) | the Worker has to read or write these with nobody signed in, and the Worker holds no key to Supabase |
| **the browser** | five keys, below | in-flight copies and facts about this machine |

### The tables

All `research_` prefixed, because this database already holds
`progress`, `library`, `targets`, `scenarios`, `routines` and the
diet tables, and a bare `notes` or `tasks` is a name the next tool
will want. Every table: `id uuid primary key default
gen_random_uuid()`, `user_id uuid not null default auth.uid()
references auth.users on delete cascade`, `created_at`,
`updated_at` with the shared `touch_updated_at` trigger, row-level
security enabled, four policies on `(select auth.uid()) = user_id`,
and the migration file carries `enable row level security` in the
same statement block as `create table`, because `scripts/check-rls.ts`
reads the file and the one thing it cannot forgive is a table with
none. The desk's migration, `supabase/migrations/20260830090000_threads.sql`,
is the template, and `supabase/migrations/20260823124900_own_rows_by_default.sql`
is the reason `user_id` carries a default.

```sql
create table public.research_projects (
  id, user_id, created_at, updated_at,          -- the six above, elided below
  name        text not null check (char_length(name) between 1 and 200),
  kind        text not null check (kind in ('degree','paper','book','application','review','other')),
  state       text not null default 'active' check (state in ('active','paused','done','archived')),
  tone        text not null default 'gold',      -- one of the seven token names
  body        jsonb not null default '{}'::jsonb  -- aims, rules, data statement, supervisors
);

create table public.research_sources (
  ...,
  type        text not null,                     -- the vocabulary in shared/research
  title       text not null,
  year        smallint,
  authors     text,                              -- first three, for the list
  doi         text, isbn text, url text,
  identifiers jsonb not null default '{}'::jsonb,
  key         text not null,                     -- the citation key
  csl         jsonb not null,                    -- the record
  status      text not null default 'unread' check (status in ('unread','skimmed','read','annotated','cited')),
  priority    smallint not null default 0,
  rating      smallint,
  why         text,
  tags        text[] not null default '{}',
  projects    uuid[] not null default '{}',
  abstract    text,
  files       jsonb not null default '[]'::jsonb,
  oa          jsonb, retracted jsonb,
  hash        text not null,
  added_via   text not null,
  deleted_at  timestamptz,
  fts         tsvector generated always as (
                to_tsvector('simple', coalesce(title,'') || ' ' || coalesce(abstract,'')
                  || ' ' || coalesce(authors,'') || ' ' || coalesce(why,'')
                  || ' ' || array_to_string(tags, ' '))) stored,
  unique (user_id, key)
);
create index on public.research_sources (user_id, status, priority desc, updated_at desc);
create index on public.research_sources using gin (tags);
create index on public.research_sources using gin (projects);
create index on public.research_sources using gin (fts);
create index on public.research_sources (user_id, doi) where doi is not null;
create index on public.research_sources (user_id, hash);
```

The rest follow the same shape and are listed rather than written
out, with the columns that are not obvious:

| table | the columns that matter | one jsonb, because |
| --- | --- | --- |
| `research_highlights` | `source_id`, `file_key`, `page`, `quote`, `prefix`, `suffix`, `rects jsonb`, `meaning`, `note`, `fields jsonb` (the extraction card), `position` | a highlight is read with its source and never alone |
| `research_notes` | `kind`, `title`, `body` (html), `text`, `source_id`, `projects`, `tags`, `links uuid[]`, `day date`, `meta jsonb`, `fts` | `meta` is the transcript's segments or a template's flag |
| `research_versions` | `kind`, `item_id`, `body`, `label`, `at` | the Archive room reads these |
| `research_questions` | `project_id`, `parent_id`, `kind`, `text`, `state`, `order`, `body jsonb` | `body.evidence` and `body.note`, one write, the desk's lesson |
| `research_codes` | `project_id`, `parent_id`, `name`, `definition`, `colour`, `order` | |
| `research_codings` | `code_id`, `note_id`, `segment`, `start`, `end`, `text`, `translation`, `memo` | |
| `research_participants` | `project_id`, `pseudonym`, `role`, `consent jsonb`, `sealed text` | `sealed` is ciphertext the site cannot read |
| `research_reviews` | `project_id`, `kind`, `protocol jsonb`, `state` | a protocol is one document |
| `research_review_records` | `review_id`, `search_id`, `raw jsonb`, `hash`, `stage`, `reason`, `decided_at`, `source_id` | `raw` is what the database returned, kept whole |
| `research_searches` | `review_id`, `database`, `string`, `ran_at`, `hits`, `alert boolean`, `last_alert` | |
| `research_inbox` | `kind`, `payload jsonb`, `filed_at` | an alert, a capture, a nudge; the board empties it |
| `research_datasets` | `project_id`, `name`, `files jsonb`, `dictionary jsonb`, `source_id`, `licence`, `notes` | |
| `research_runs` | `dataset_id`, `kind`, `input jsonb`, `code text`, `data_hash`, `output jsonb`, `figure text` (svg), `label` | a run is read whole or not at all |
| `research_documents` | `project_id`, `kind`, `order`, `title`, `outline jsonb`, `body`, `text`, `budget`, `style`, `state`, `fts` | |
| `research_tasks` | `project_id`, `title`, `lane`, `order`, `due date`, `done_at`, `links jsonb`, `note` | |
| `research_events` | `project_id`, `kind`, `title`, `at`, `until`, `body jsonb`, `done` | a meeting's minutes and a submission's reviewer table are shaped by `kind` |
| `research_people` | `name`, `role`, `orcid`, `email`, `institution`, `notes`, `sources uuid[]`, `body jsonb` | |
| `research_sessions` | `project_id`, `room`, `started`, `ended`, `note` | |
| `research_canvases` | `project_id`, `name`, `scene jsonb` | Excalidraw's own shape, kept whole |
| `research_surveys` | `project_id`, `title`, `questions jsonb`, `token`, `open boolean` | the D1 copy is made on publish |
| `research_connections` | `service`, `sealed text`, `label` | a reader's own Zotero key, sealed |
| `research_chunks` | `kind`, `item_id`, `seq`, `text`, `embedding vector(1024)` | `pgvector`, enabled in the same migration; an RPC `research_match(query vector, k int)` as `security invoker` |
| `research_shares` | `kind`, `item_id`, `token`, `expires`, `can_comment` | a supervisor's read-only link |

**And two columns on `profiles`**, because they are facts about a
person rather than about a project: `research_prefs jsonb` (the
default style, the name and affiliation on exports, the reading
speed, the dense mode, the assistant switch) and nothing else. The
`research_` prefix for the reason the routine's columns have one.

**Every one of them goes into BOTH halves of the account page in
the commit that creates it.** `scripts/check-account.ts` reads the
migrations for `user_id ... references auth.users` and fails on a
table `aab/src/account-page.ts` does not carry in both "take a copy"
and "erase"; `research_chunks` and `research_versions` are the two
somebody will forget because neither is looked at, and both hold the
reader's text.

### The files

R2, under `research/<user id>/<sha256 of the bytes>.<ext>`, so the
same PDF uploaded twice is stored once and a key can never point at
different bytes. Uploaded through `PUT /api/research/file`, which
reads the reader out of the bearer, checks the type against a short
list (pdf, html, webm, m4a, mp3, wav, csv, tsv, xlsx, parquet, png,
jpg, json), checks the size against a per-file cap of 100 MB and a
per-reader quota of 5 GB that Settings shows as a meter, and
answers with the key. Read through `GET /api/research/file/<key>?t=`
with a ticket minted by `GET /api/research/ticket/<key>` for thirty
minutes, the same signed pass `functions/_lib/ticket.ts` already
mints for a course video, because a `<video>`, an `<audio>` and
pdf.js's fetch send no header. The ticket's key is derived with
domain separation from the same secret, and it names ONE object.
**A key under another reader's prefix is refused before the bucket
is asked**, which is the course section's second lock.

`DELETE /api/research/files` removes everything under the reader's
prefix and is what the account page's erase calls after the rows are
gone, so leaving takes the files too. `scripts/check-account.ts`
gains a question for this: does the erase call the endpoint.

### The browser

Five keys, each a row in `shared/storage.ts` or `scripts/check-storage.ts`
fails, none synced, and each says why:

| key | held | what | why not synced |
| --- | --- | --- | --- |
| `research-pane` | device | the widths of the three panes and which are folded | a fact about this screen |
| `research-last` | device | the last room and the last object open here | the board's "pick up where you left off" is the rows; this is only the tab's own memory |
| `research-reader` | device | zoom and page-fit in the reader | a fact about this screen |
| `research-draft` | made | the editor's buffer for a write that has not landed | it is the in-flight copy; the row is the record, and it is cleared the moment the write lands |
| `research-queue` | made | writes waiting for a connection, the diet tool's `queue()` | shown as pending, retried, gone on landing; never read back as data |

No `research-lang`: the language switch is `tool-lang`, the one key
the calculators and the diet tool already share, carried by
`reader-prefs`.

### Sizes, and what they cost

Supabase's free tier holds 500 MB of database; a library of four
thousand sources with abstracts, ten thousand highlights and a
thousand notes is under 100 MB, and the chunks with their vectors
are the thing to watch (1,024 floats is 4 KB a chunk; fifty thousand
chunks is 200 MB), which is why an embedding is made per section and
not per sentence, and why the Settings page shows the count. R2's
free tier is 10 GB; a hundred interviews at an hour each in opus is
about 3 GB, and the quota is 5 GB per reader for that reason.
Workers AI's free allowance covers a few hours of transcription a
day. None of these numbers is in a sentence a reader sees; Settings
draws them from the rows and the bucket.

---

## 24. Getting in, and getting out

**In:**

| from | how | becomes |
| --- | --- | --- |
| Zotero | the Web API with the reader's own read-only key, all items or a collection, with tags, notes and attachments' metadata; the PDFs come only if the reader has them in Zotero's own storage and points the studio at a folder | sources, with `identifiers.zotero` so a second pull updates rather than duplicates |
| Mendeley, EndNote, Google Scholar, Scopus, Web of Science | a RIS, BibTeX, CSL-JSON or EndNote XML file exported from them, dropped on the library | sources, deduplicated on arrival |
| a folder of PDFs | dropped on the library; each file's first pages are read in the browser for a DOI or an arXiv id, which is looked up; the ones with neither get a title guess and a "check me" chip | sources with files |
| a DOI, an ISBN, a URL, a pasted reference | the capture box | one source |
| Obsidian, a folder of Markdown | a zip dropped on the notebook; `[[links]]` resolve to notes by title, `[@key]` to sources by key, front matter to tags | notes |
| Notion | the importer the Article Studio already has, one page at a time | a note |
| Google Docs | a `.docx` export dropped on the desk, read by the `docx` library's reader into the editor's HTML | a document |
| the old research desk | the migration of section 4 | questions |
| a CSV of anything | the lab | a dataset |

**Out, and it is the whole point of section 1's fifth refusal:**

| what | as |
| --- | --- |
| the library | CSL-JSON (complete), BibTeX, RIS, and Zotero RDF if wanted; every file beside it in a folder named by key |
| the notes | Markdown with front matter, links as `[[title]]`, citations as `[@key]`; one file per note; the daily log as one file per day |
| the documents | Word, PDF, Markdown, LaTeX plus BibTeX, each with its figures |
| the questions, codes, codings, participants (pseudonyms only, and the sealed field as ciphertext), reviews, records, searches, tasks, events, people, sessions | JSON, one file per table, and CSV for the tabular ones |
| the datasets and runs | the files as uploaded, the SQL as `.sql`, the runs as JSON with their SVG |
| the canvases | Excalidraw's own JSON, which opens at excalidraw.com |
| the graph | JSON nodes and edges, and GraphML for Gephi |
| everything | one zip of all of the above, built in the browser, from the Archive room, with a manifest saying what is in it and when it was made |

"Take a copy of everything" on the account page includes the JSON
half of that; the zip with the files is the Archive room's, because
5 GB of audio does not belong in the account page's one-file export.

**A backup the reader does not have to remember.** The Worker cannot
read the reader's rows, so a nightly export from the Worker is
impossible without a service key, and this project will not hold
one. The honest options, in the order to try them:

1. Supabase's own daily backups, which the Pro plan has and the free
   plan does not; the Settings page says which plan the project is
   on because that is the answer to "is this backed up".
2. `pg_cron` inside Supabase with `pg_net`, which lets the DATABASE
   push a nightly JSON export of one reader's tables to
   `POST /api/research/backup`, guarded by a shared secret the
   Worker holds, and the Worker writes it to R2 under the reader's
   prefix, kept a fortnight. No service key leaves Supabase, the
   site never learns one, and the export exists whether or not
   anybody opened the studio that week.
3. A quiet line on the board, monthly, "last copy taken 41 days
   ago", which is the fallback for a project on the free plan with
   no cron.

**Sharing with a supervisor.** A document, a source list or a
question tree can be shared as a read-only page at
`/tools/research/shared/<token>` (`research_shares`: a token, an
expiry, whether comments are allowed). The Worker renders it from a
SNAPSHOT the browser posts when the share is made (a copy of the
rendered HTML into R2 under the reader's prefix), because the Worker
cannot read the rows; so a share is a version, dated, and the
reader re-shares to update it. Comments from the supervisor go into
D1 (`share_comments`: token, anchor, text, name, at) through the
site's sanitiser and a throttle, and appear in the document's side
rail as a list the reader works through. No sign-in for the
supervisor, no account, no email collected beyond the name they
type.

---

## 25. Security, privacy, and other people's data

**Every table is row-level secured and `scripts/check-rls.ts` reads
the migration**, so the day the twenty-second table lands with no
policy is the day the check fails rather than the day a stranger
reads a transcript.

**Every endpoint under `functions/api/research/` is one of three
things**, and `scripts/check-admin.ts` gains the third: gated by
`requireAdmin`, gated by `readerFrom()` with the row's owner
checked, or named as public with its reason. The public ones are the
survey form's page and its POST, the shared snapshot's page and its
comment POST, and `status`. Each public one is throttled through
`throttle()` in `functions/_lib/auth.ts` and sanitised through
`functions/_lib/sanitise.ts`.

**A file is reached by ticket, and a ticket names one file under
one reader's prefix.** Section 23.

**Other people's data has its own rules**, because an interview is
somebody else's words:

- pseudonyms everywhere, real names sealed or absent;
- a consent record per participant with what was consented to, and
  a quote from a participant whose consent does not cover quotation
  is refused by the desk with the reason;
- a data statement per project (section 17's `body`), written from
  the ethics helper's template, saying what is held, where, for how
  long, and who can see it, which is the paragraph an ethics form
  asks for and a GDPR record needs;
- a project's `archived` state offers to delete audio and keep
  transcripts, which is the retention a consent form usually
  promises;
- the sealed field's passphrase is not recoverable, and Settings
  says so in the sentence beside the box.

**The policy grows by three words and nothing else.**
`'wasm-unsafe-eval'` in `script-src` for DuckDB, Pyodide and
tesseract; `worker-src 'self'` for pdf.js and DuckDB's workers;
nothing in `connect-src`, because every outside call is the Worker's.
Both in `aab/_headers` and `shared/headers.ts`, or
`scripts/check-headers.ts` fails. `'wasm-unsafe-eval'` is the
narrower of the two spellings and is the one to use; `'unsafe-eval'`
is never added.

**Secrets are wrangler secrets.** Section 22's third note. The
Notion page listing eleven plain-text credentials is the reader's
own to clean up and this plan says only that none of the studio's
will join them.

**The assistant sends the reader's text to a third party**, and the
Settings switch says so in one sentence, off until the reader turns
it on. What is sent is what the drawer shows as context, listed by
title before the call is made.

---

## 26. Performance: what each room costs to open

**The board must open like a page and the lab may open like an
application**, and the difference is written down as a budget the
studio check measures out of the Next build's manifest rather than
as a hope:

| room | loads on open | loads on demand | budget for the first paint |
| --- | --- | --- | --- |
| the board, the library, questions, the planner, the notebook | the site's shell and the room's own chunk | the editor module, on the first note opened | the chunk under 60 KB compressed |
| the reading room | the room's chunk | `pdfjs-dist` (about 400 KB compressed plus its worker) when a PDF is opened; the audio player for audio | the queue under 60 KB; the reader's own chunk under 500 KB |
| the writing desk | the room's chunk and the editor | citeproc and the chosen style (about 300 KB) on the first citation, `docx` on the first export, KaTeX on the first formula | under 200 KB before the first keystroke |
| the lab | the room's chunk | DuckDB (about 6 MB of WASM, cached by the browser), Observable Plot, CodeMirror; Pyodide (about 15 MB) only on a press that says what it costs | under 100 KB before the data is chosen |
| the field room | the room's chunk | the audio player, the coding layer | under 100 KB |
| the atlas | the room's chunk | Cytoscape (about 350 KB) for the graph, Excalidraw (about 1.5 MB) for the canvas, each on its own tab | under 60 KB |
| the workshop | the deck | each tool's own chunk | under 60 KB |

Every heavy library is `next/dynamic` with `ssr: false` and a
`loading` that says what is coming, and every one is a separate
chunk that only the room that needs it names. The studio check
reads the build's chunk sizes per route and fails on a room over its
budget, because a room that quietly grew a megabyte looks exactly
like one that did not.

**Long lists are virtualised**, section 5. **Files are cached** in
the browser's Cache API only when the reader marks them kept, under
a budget Settings shows, and DuckDB's copy of a dataset lives in the
origin private file system with a "forget" button beside each.

**The service worker precaches nothing of the studio.** Every
studio chunk carries a content hash, which is the first mechanism
`CLAUDE.md` describes, and the studio adds no stable-path bundle, so
there is nothing for `STABLE_BUNDLE` to learn and no `VERSION` bump.

---

## 27. Two languages, one switch

The diet tool's arrangement, exactly: both languages in the markup,
`data-tool-lang` on the root choosing one before the first paint,
the `<T>` component out of `next/components/diet/lang.tsx` promoted
to `next/components/ui/` so a third tool does not copy it, and a
words table `shared/research-words.ts` beside `shared/diet-words.ts`
for every phrase more than one runtime says, so the Android app
gets the studio's vocabulary at its next fetch.

**What is translated and what is not.** The chrome, the labels, the
empty states, the explanations, the tool names, the source types,
the highlight meanings and the assistant's task list are all said
twice. The reader's own text is never touched. A citation renders in
the style's language, which is English for every style vendored,
because no CSL locale exists for Bangla and a thesis in Bangla cites
in English form anyway; a `bn` locale is a contribution to the CSL
project rather than to this repository.

**Bangla digits** in counts and meters inside a `[lang="bn"]`
element through `bnNum` in `shared/schools.ts`, which is the site's
one place for that.

**The studio check asks the diet check's second question** for
every room: both halves of every `<T>` present, and no `aria-label`
written as an English string literal.

---

## 28. The Android app

**What reaches it with no release:** the rail entry (section 4),
the words table (section 27), the source-type and highlight-meaning
vocabularies (section 5) and the widget catalogue entries (section
7), because `/api/site` spreads the tables and `scripts/check-app-surface.ts`
holds every `export const` in `shared/` to being sent or named as
not for the app with a reason. `shared/research-stats` and the
adapters are code and are named as not for the app.

**What needs a release, and in what order:** a reading room (the
queue, the PDF with highlights, the one-line takeaway) first,
because a phone is where reading happens; the capture box and the
task board second; the rest is the website in a browser, which the
app already opens. Every row is the same PostgREST table under the
same policy, so the app's half is rendering rather than plumbing,
which is the contract `ANDROID.md` already describes.

---

## 29. What we will be missing during real work

The plan above was written room by room. This section was written
by walking the three projects through a year and noting what the
rooms did not have, and every item below is either already answered
above (with the section) or was ADDED to the plan because of this
walk, marked **added**. Nothing here is left as a wish.

### The first week: a proposal that has to name a supervisor's own papers

- **Finding a prospective supervisor's publications by name and
  ORCID** and reading them first: the people room with an ORCID
  lookup, section 18. **Added:** a person's page offers "import all
  their works from OpenAlex" as one press.
- **A proposal is a document of kind `proposal`** with a budget the
  institution sets: section 16. **Added:** the project's `body.rules`
  holds word limits, formatting and submission format, and the desk
  shows the limit beside the count, as a fact.
- **The university's regulations PDF** is a source of type `report`
  filed under the project, so it is one press away in the desk:
  section 9.
- **Fifteen universities with a visa question nobody verified:**
  fifteen people rows and one task per university in `waiting`, with
  the answer as a note when it comes: sections 17 and 18.
- **The Statement of Purpose cites a 2020 paper by a named
  professor**: the citation chip carries the locator, and the person
  row links to the source row, so the sentence "building on Bashar's
  2020 method" is a chip and a link rather than a memory.

### The first month: the literature is in six places

- SSRN, RePEc and the publishers: section 10's finance shelf.
- **A paper behind a paywall the reader can reach only through a
  library**: **added**, an interlibrary loan tracker, which is a
  task of kind `request` on the source with the library, the date
  asked and the date arrived, and a chip on the source reading
  "requested 12 days ago".
- **A paper with no DOI at all** (a Bangladesh Bank working paper, a
  conference paper): section 9's `report` type with `added_via:
  manual` and a `check me` chip until the record is complete.
- **A working paper that becomes an article halfway through the
  year**: section 9's supersedes link.
- **The reading is faster than the noting**: section 11's one-line
  takeaway, asked once at `read`.
- **A hundred PDFs from an old Zotero**: section 24's Zotero pull.

### Month three: the data does not come

- **A request to Bangladesh Bank that takes months**: a `waiting`
  task with a date, section 17, and **added** a "waiting since"
  column on the board's waiting lane so the oldest wait is visible.
- **DSE data as a spreadsheet with merged headers**: the lab's
  importer knows the exchange's shape, section 14, and a transform
  fixes the rest as SQL that is kept.
- **A dataset's licence and citation**: section 14's dataset source
  row.
- **Two datasets with different symbol spellings**: a transform with
  a mapping table, kept as a run so the join is documented.

### Month six: the first interview

- Consent, pseudonyms, the sealed real name: section 15.
- **Recording on a phone and uploading a 200 MB m4a**: section 23's
  cap is 100 MB per file, so **added**: the field room's uploader
  transcodes audio in the browser to opus at 32 kbps before upload
  (an hour is about 15 MB), through the browser's own encoder, and
  says so. The original stays on the phone.
- Transcription in Bangla with corrections: section 15.
- **A quote used in English with the Bangla kept**: section 15's
  translation on the coding, section 16's quotation.
- **"Who said the thing about liquidity in the second interview"**:
  code retrieval, section 15, and the board's search over notes.

### Month nine: a chapter is due

- Outline from the question tree, budgets, citations, footnotes:
  section 16.
- **Figures that renumber when a section moves**: section 16's
  derived numbering.
- **A table the supervisor wants in a different style**: the run's
  APA table with stars switched off, section 14.
- **Sending a draft and getting comments back without the
  supervisor making an account**: section 24's share and comments.
- **"Which version did I send"**: the named snapshot, section 16.
- **Two devices editing one chapter on the same afternoon**: section
  12's conflict answer.
- **An abbreviation used before it was defined, in chapter 4 when
  it was defined in chapter 2**: **added**, the abbreviations list is
  per project across documents in order, not per document.

### Month fourteen: a conference, and a paper from a chapter

- **The paper is the chapter, shorter, in another style**: a
  document made "from" another (a copy that remembers its parent),
  **added**, with its own style and budget, and a line on the desk
  saying which chapter it came from.
- **A conference deadline and a poster**: the event of kind
  `conference`, section 17; a poster is the document exported to
  PDF at a page size Settings offers (A0, A1), **added** as a print
  size option rather than a poster tool.
- **Slides**: **added** as an export of a document's outline to a
  Markdown deck the browser prints one heading per page, no slide
  editor.
- **Submission tracking and the reviewers' comments table**: the
  event of kind `submission`, section 17.
- **A preprint on SSRN with its own number**: `identifiers.ssrn` on
  the source, which is the reader's own paper as a source row of
  type `preprint`, and the CV tool reads it, section 19.

### Month twenty: writing up

- **Fifty thousand words across eight chapters, one bibliography**:
  **added**, a project-level bibliography that renders from every
  chip in every chapter in order, deduplicated, in the project's
  style, as a document of kind `bibliography` the desk keeps
  current.
- **A table of contents and a list of figures**: derived from the
  chapters' outlines and figure chips, **added** as two more derived
  blocks.
- **Appendices holding the interview guide, the consent form, the
  codebook and the search log**: each is already a row; **added**, an
  "insert as appendix" on each that renders it into a document of
  kind `appendix`.
- **The claims audit across the whole thesis**: section 16's pane,
  run per project, **added**.
- **A last check that nothing cited is retracted**: the monthly
  retraction pass, section 9, and a press on the project page.

### The viva

- The questions an examiner asks, with the reader's answers: the
  viva bank, section 19.
- **"What did you do in March 2027"**: the daily log, section 12.
- **"Why did you exclude those 212 records"**: the review's reasons,
  section 13.
- **Flashcards of the field's terms**: section 19's quiz.

### After: publishing, teaching, the next project

- **The book's chapters as pages on the site**: section 16's last
  export.
- **A CV and a publication list**: section 19.
- **Starting the next project with the same library**: `projects` is
  an array, section 2, and a new project starts with a source picker
  over the library.
- **Handing a supervisor or a co-author the whole thing**: the
  Archive room's zip, section 24.

### The things a year finds that no room owns

- **A parking lot**: **added**, a note of kind `capture` pinned to
  every document's side rail, for the sentence that does not belong
  here yet, so it is not lost and does not stay in the draft.
- **A "why did I stop"**: **added**, closing a session asks one
  optional line, which is what the next session opens with.
- **Reading on the bus with no signal**: kept files, section 11,
  and the queue's abstracts cached with the room.
- **A source read in the wrong edition**: the edition on the CSL
  record and the supersedes link, section 9.
- **The same paper saved twice by two routes**: refused on arrival,
  section 9.
- **A citation key changed after a chapter used it**: refused unless
  rewritten everywhere, section 9.
- **A highlight in a PDF the reader later replaced with a better
  scan**: anchored to text, section 11.
- **The assistant's cost creeping**: the month's figure in Settings,
  section 21.
- **OpenAlex's free allowance running out mid-month**: the status
  line, the merge over what answered, and the D1 cache, section 10
  and 22.
- **A phone with a small screen and a big thumb**: section 5 and 11.
- **Somebody else at the same laptop**: the mirror comes off at sign
  out, `CLAUDE.md`'s rule, and the five device keys are not the
  reader's data.
- **Losing the passphrase to the sealed names**: not recoverable,
  said in Settings, section 25; the pseudonyms and the research
  survive it.
- **The Bangla input on a laptop without a Bangla keyboard**:
  **added**, not a keyboard, but a note in Settings pointing at the
  operating system's own phonetic layout, because a phonetic
  transliterator in the editor is a second editor.
- **A thesis in Bangla**: section 16's last paragraph, and the Word
  export carrying the font.
- **Time zones between Dhaka and Brighton**: **added**, every event
  is stored in UTC and shown in the browser's zone with the zone
  named beside a meeting, because a meeting at "3pm" is the one
  place this goes wrong.

---

## 30. What must be checked

**Three guards, three halves**, the arrangement `DIET.md` section 33
made: the arithmetic in a test under `scripts/`, the pages in a check
under `scripts/`, and the built rooms in a browser test under
`next/`. The three are named here without their extensions for the
reason the preamble gives; the first stage creates all three, empty
but running, so that every later stage adds a question rather than a
file.

### The studio check, and the questions it asks

Each is a rule this plan states and nothing else holds:

1. **Every room in the pages table is a route, and every route is in
   the pages table.** Two lists that can disagree, held to each
   other.
2. **Every route is inside exactly one shell.** `scripts/check-routes.ts`
   asks this already; the studio's layout tree is the case it was
   written for.
3. **Both languages cover the same keys in every room**, and no
   `aria-label` is an English string literal.
4. **Every room's first paint is under its budget**, read from the
   build manifest, section 26.
5. **Every `research_*` table is in both halves of the account
   page**, and the erase calls the files endpoint. The first is
   `scripts/check-account.ts`'s; the second is new there.
6. **Every endpoint under the research route is gated or named
   public with a reason.** `scripts/check-admin.ts`, extended.
7. **Every source type in the vocabulary has a CSL type and a
   colour, and every colour is one of the seven.**
8. **Every vendored CSL style file renders the fixture library
   without an error**, and OSCOLA renders a footnote with `ibid`.
9. **No room names a host that is not this site's.**
   `scripts/check-csp.ts` already.
10. **Every heavy library is a dynamic import**, by reading the
    route chunks for the names of the six (pdfjs, duckdb, pyodide,
    excalidraw, cytoscape, citeproc) and failing on one in a shared
    chunk.
11. **Every adapter has the four functions and a status word**, and
    every status word is in the words table in both languages.
12. **Every widget on the board has an empty state that is a
    sentence**, the diet check's third question.
13. **Every storage key the studio writes is in `shared/storage.ts`**,
    `scripts/check-storage.ts` already.
14. **Nothing in the studio counts days in a row or paints a
    deadline red**: a grep for the words and the classes that would,
    the routine check's own rule.
15. **The old desk is gone**: no `.rd-` rule, no `/admin/research`
    in the route tables, a 301 in the redirects, no `threads` in the
    account list.

### The arithmetic test

Every function in `shared/research-stats` against a fixture dataset
and R's answer to four decimals: descriptives, correlation, the
t-tests, ANOVA, chi-square, OLS with HC1 errors, logistic
regression, CAPM beta, Sharpe, a three-factor regression, Fama-MacBeth,
CSAD, an event study's CAR, historical VaR, ADF. Plus the citation
key rule, the dedupe hash, the highlight anchor's fallback (the
quote found when the rectangles are wrong), the PRISMA counts from
a fixture of records, the word count in both scripts, and the
figure numbering by position.

### The browser test

Against the built routes, with a fixture Supabase the way
`next/account.test.ts` and `next/diet.test.ts` have one, and the
fixture is PostgREST-shaped and replaces a jsonb column rather than
merging, which is the archived desk test's lesson carried forward:

- the capture box files a DOI as a source, a URL as a capture, a
  `todo` line as a task;
- a highlight made in the reader survives a reload and is found by
  its quote when its rectangles are removed;
- a citation chip renders in three styles and a footnote renders
  `ibid` on the second citation of the same source;
- a Word export opens (the `docx` file is unzipped and its parts are
  checked for the heading, the footnote and the bibliography);
- screening by keyboard moves records through the stages and the
  PRISMA counts follow;
- a task dragged between lanes is written once and lands where it
  was dropped;
- typing through a slow save keeps every keystroke, watched across
  the window;
- two tabs writing one note produce a conflict message, not a
  silent win;
- `/` still opens the palette in every room, and `g r` opens the
  board;
- signed out, every room is a short invitation and not a blank
  shell;
- a room with no rows draws its empty sentence and no zero;
- a phone-width viewport shows the reader one page wide with the
  toolbar under the selection.

### The existing checks this touches, and what each will say

`scripts/check-routes.ts` (the route, the redirect, the two shells),
`scripts/check-account.ts` (the tables), `scripts/check-rls.ts` (the
policies), `scripts/check-storage.ts` (the five keys),
`scripts/check-app-surface.ts` (the words and the vocabularies),
`scripts/check-csp.ts` and `scripts/check-headers.ts` (the three
words added to the policy), `scripts/check-admin.ts` (the gates),
`scripts/check-css.ts` (the chip class in three places, the desk's
rules gone), `scripts/check-material.ts` and `scripts/check-relief.ts`
(every new pressable class placed, the reader's hush guarded),
`scripts/check-content.ts` (any count a room states),
`scripts/check-crons.ts` (the weekly alert), `scripts/check-api.ts`
(every endpoint the browser calls is routed), `scripts/check-icons.ts`
(the microscope), `scripts/check-closed.ts` (nothing new under
`aab/src/`), `scripts/check-pointers.ts` and `scripts/check-dashes.ts`
(this file). `node scripts/check-all.ts` is the list and it runs in
CI, which is the fourth check and the one that matters.

---

## 31. Stages

**The ratchet: every stage leaves the studio usable, every stage
lands as its own pull request or a small run of them, and no stage
starts before the previous one's checks are green.** The order is
by what the three projects need first, and the first three stages
are the ones that make the studio worth opening every day.

| stage | lands | usable for | held by |
| --- | --- | --- | --- |
| **1. The frame, and the desk goes** | the nav entry, the routes, the pages table, the strip (shared with the diet tool), the board with the capture box and the deck, Settings, `research_projects`, `research_sources` with DOI, ISBN, BibTeX, RIS, CSL-JSON and Zotero import, the source page, `research_notes` with the site's editor and links, `research_tasks` as a list, the account page's two halves, the three guards running, the desk archived and its threads carried | keeping a library and notes from day one | questions 1, 2, 3, 5, 6, 7, 13, 15 |
| **2. The reading room** | R2 files with tickets and quota, pdf.js, highlights with meanings and anchors, extraction cards, the one-line takeaway, the queue, web capture, book page ranges, the phone layout | reading properly, on a laptop and a phone | the highlight test, the anchor test, question 4 |
| **3. Find** | the adapters (OpenAlex, Crossref, Unpaywall, Semantic Scholar, arXiv, Europe PMC, CORE, DOAJ, Open Library, ORCID), the federated search page, saved searches, the weekly alert cron with its D1 copy, the cache, the status endpoint, the retraction and OA passes | never leaving the studio to find a paper | questions 9, 11 |
| **4. The writing desk** | documents, the outline, citation chips, citeproc with a dozen styles, footnotes and `ibid`, the bibliography block, versions and snapshots, Word, Markdown and LaTeX exports, counts and budgets | writing the proposal and the first chapter, in OSCOLA if needed | question 8, the export test |
| **5. The planner** | events, meetings and submissions, the four-lane board with drag, the timeline, the ICS feed, sessions and the daily log, the weekly review, the reading queue's lane | running the year | question 14 |
| **6. Questions and the atlas** | the question tree with evidence, the argument map, the gap matrix, the variables registry, the graph, the citation network, the literature timeline, people with ORCID | the argument, and the seminal papers | |
| **7. The review room** | protocol, the search log from saved searches, records and screening, PRISMA, extraction as a sheet, appraisal templates, synthesis | a systematic or scoping review | the PRISMA test |
| **8. The lab** | datasets in R2 and DuckDB, the dictionary bound to variables, SQL transforms, the first-tier statistics with tests, runs and their pages, charts, APA tables, market data, the DSE importer | the quantitative chapters | the arithmetic test, question 10 |
| **9. The field room** | participants and consent with the sealed field, audio upload with transcoding, Workers AI transcription with correction, the codebook, coding, retrieval, matrices, memos, surveys through D1, the interview guide | the qualitative chapters | the coding test |
| **10. The workshop** | the tools table and the thirty tools, several of which earlier stages already need (Cite this, Boolean builder, sample size) and land then | the small jobs | `scripts/check-api.ts` |
| **11. The assistant and semantic search** | the Anthropic adapter, the task list, notes of kind `assistant`, the cost meter, `research_chunks` with embeddings, the RPC, "ask my library" | reading faster and drafting with the library open | question 6, the grounding test (an answer naming an unknown paper is struck through) |
| **12. The methods room** | the hub over pieces tagged `method`, the first twelve pieces, the links from every tool to its method | learning a method where it is used | `scripts/check-pieces.ts` |
| **13. Later, in this order when wanted** | webR in the lab after Python; OCR in the reading room; the canvas in the atlas; the thirteenth drawing (a lens) in `shared/art-svg.ts` for the studio's own card; sharing with comments; the pg_cron backup; the front page's three research widgets; the app's reading room | | |

**Stage 1 landed on 2 September 2026, in the pull request that
carried this plan.** What it does, as against what it will:
`shared/nav.ts` has the entry, `next/lib/research-pages.ts` is the
pages table and every one of its seventeen rooms answers at its
address, the board's capture box files a DOI, an ISBN, an address,
BibTeX, RIS, CSL-JSON, a todo and a sentence each as the thing it
is, the library lists and searches and opens a source page that
autosaves, the notebook mounts the site's editor, the tasks are
five lanes, Settings holds the preferences and the projects and
pulls a Zotero library through the Worker, the archive exports
JSON, BibTeX and RIS, and
`supabase/migrations/20260902150000_research.sql` is the nine
tables. `scripts/check-research.ts` asks its five questions,
`scripts/research.test.ts` is the arithmetic and
`next/research-studio.test.ts` drives the board and the library in
a browser. The rooms stages 2 to 12 open say so on their own page
rather than answering 404.

**Stage 2 landed the same day.** What it does: a source carries
files, sent as bytes to `PUT /api/research/file` and kept in R2
under `research/<user id>/<sha256>.<ext>` by
`functions/_lib/files.ts`, against the 100 MB cap and the 5 GB
quota Settings draws as a meter; the bytes come back through a
thirty-minute ticket, whole or as a Range, because pdf.js and
`<audio>` send no bearer; a web page is captured through
`POST /api/research/capture`, cleaned by the site's own sanitiser
and kept as the page that was read. `/tools/research/read` is the
queue, and with `?source=` it is the reader:
`next/components/research/reader.tsx` draws a PDF with pdf.js's
legacy build and a text layer, a captured page as prose, audio as a
player and a book as a form, and a highlight in any of them is a
row of `research_highlights` anchored to its quote and thirty
characters either side, with the rectangles as a cache and
`findAnchor()` in `shared/research.ts` as the way back when they
are gone. Five meanings on the keys 1 to 5, a card each with a note
and the extraction fields, the place kept on the row, and one line
asked once when the status moves to read. Erasing the account
removes the files after the rows, and `scripts/check-account.ts`
asks that it does. Not yet from that section: the phone's swipes,
keeping a file offline, and OCR, which section 31 always put later.

**Stage 1 is a week of work and the studio is used from its end.**
Stages 2 to 5 are the next month, and at the end of stage 5 the
studio does everything the old desk did and everything a reference
manager does. Stages 6 to 12 are each independent of one another
and can be ordered by which project needs which first; the table's
order is the doctorate's.

**What every stage's pull request carries**, without exception: the
migration with its policies, the two halves of the account page,
the words in both languages, the storage rows, the check's new
questions, a paragraph in this file turning "will" into "does" and
adding the file names their extensions, and `node scripts/check-all.ts`
green.

---

## 32. What to borrow, and from where

The user's brief allows copying from repositories that deliver
similar tools, and the rule for doing it is the licence: **MIT, ISC,
BSD, Apache 2.0 and MPL 2.0 may be depended on and, where a file is
copied, kept with its notice; CPAL needs the attribution it asks
for; AGPL and GPL are read for ideas and never copied**, because a
website is network use and this repository is private. Every entry
below says which.

| need | borrow | licence | how it is used |
| --- | --- | --- | --- |
| rendering citations in any style | `citeproc-js` | CPAL 1.0 with AGPL as the alternative; the attribution notice is required | bundled; Settings credits it by name and link, which is the notice |
| reading and writing BibTeX, RIS, CSL-JSON | `@citation-js/core` with the bibtex, ris and csl plugins | MIT | the importers and exporters |
| the styles and the en-GB locale | `citation-style-language/styles` and `locales` | CC BY-SA 3.0 | a dozen files vendored under `next/public/csl/` with the licence beside them |
| the PDF | `pdfjs-dist` | Apache 2.0 | self-hosted worker, dynamic import |
| a highlight layer's shape | `react-pdf-highlighter-plus` and `-extended` | MIT | read for the coordinate model and the selection handling; the layer itself is written on `pdfjs-dist`'s text layer in the site's own components, because a borrowed toolbar is a second design |
| the anchor model for highlights | the W3C Web Annotation data model, as Hypothesis's client implements it | BSD 2 | the `TextQuoteSelector` beside a position, section 11; the data shape, not the client |
| the canvas | `@excalidraw/excalidraw` | MIT | dynamic import in the atlas; fonts self-hosted. `tldraw` is not used: its SDK is source-available under a licence that requires payment or a watermark for production use since its 4.0 release |
| the graph | `cytoscape` | MIT | the atlas |
| drag and drop | `@dnd-kit/core` and `@dnd-kit/sortable` | MIT | the planner's lanes, the outline, the codebook tree |
| SQL over files | `@duckdb/duckdb-wasm` | MIT | the lab; self-hosted WASM |
| statistics | `simple-statistics` (ISC) and `jstat` (MIT) for the distributions and the tests; `ml-matrix` (MIT) for the linear algebra under OLS | | wrapped by `shared/research-stats`, which owns the finance functions and the tests against R |
| charts | `@observablehq/plot` | ISC | the lab's figures; the site's `Spark` where a line will do |
| Python | `pyodide` | MPL 2.0 | later; self-hosted |
| R | `webr` | MPL 2.0 for the JavaScript; R runs as a program | later, after Python |
| maths | `katex` | MIT | the editor's math block; fonts self-hosted |
| a code editor | `@codemirror/*` | MIT | SQL, Python and BibTeX cells |
| Word files | `docx` | MIT | the desk's export, and the reader of a dropped `.docx` |
| OCR | `tesseract.js` | Apache 2.0 | later; the `ben` and `eng` models self-hosted |
| spaced repetition | `ts-fsrs` | MIT | the quiz tool |
| a spreadsheet grid for extraction tables | the site's own sheet model in `shared/lesson-grids.ts` first; `@univerjs` (Apache 2.0) only if a real spreadsheet turns out to be needed | | |
| the shape of a systematic review tool | `parsifal` (MIT, Python) and `asreview` (Apache 2.0, Python) | | read for the workflow and the screening ergonomics; nothing runs here |
| a reading workbench's ergonomics | `khoj-ai/openpaper` | AGPL 3.0 | read only |
| a reference manager's data model | Zotero | AGPL 3.0 | read only; imported through its Web API, section 24 |
| project and note linking | `ResearchHelper/research-helper` and `sophosia` | AGPL 3.0 | read only |
| reference parsing | `anystyle` | BSD 2, Ruby | not runnable in a Worker; Crossref's bibliographic search does the job, section 19 |
| PDF metadata extraction | GROBID | Apache 2.0, a Java service | not run here; a DOI on the first page plus Crossref covers most of it, and a "check me" chip covers the rest |

Nothing is loaded from a CDN. `script-src` is `'self'` and every
library above is bundled by Next or served from `next/public/`.

---

## 33. Out of scope for now, said rather than built

- **Collaboration inside the studio.** One person's rows, one
  person's keys. Sharing is a snapshot and comments, section 24;
  two people editing one note is not built and the columns do not
  pretend otherwise.
- **Blind double screening** in the review room. The record carries
  one decision; a second decision column is the change if a second
  screener ever exists.
- **Reading a calendar in.** The feed goes out; nothing comes in.
- **Google Scholar.** No API and its terms forbid scraping; a
  BibTeX export pasted in is the way, and the Boolean builder writes
  its syntax.
- **Scopus and Web of Science.** Institutional keys the reader does
  not have; their exports import.
- **A LaTeX editor.** The skeleton and the BibTeX export exist;
  editing LaTeX is Overleaf's job.
- **A slide editor and a poster tool.** An outline printed as a
  deck and a document printed at A0, section 29.
- **Automatic Bangla transliteration in the editor.** Section 29.
- **Plagiarism against the wider web.** The self-overlap check reads
  only what the studio holds, and says so.
- **An agent that acts on rows.** The assistant answers and offers;
  it does not write, delete or file.
- **A thirteenth drawing.** The studio wears `sheets` until a lens is
  drawn; that is stage 13.

---

## 34. Decisions taken in this plan

So the build does not reopen them. Each is one line; the section
holds the argument.

1. The studio is routes under `next/`, never a second Vite bundle
   (section 4).
2. The address is `/tools/research`, the key is `research`, the
   accent is the tools' gold, the drawing is `sheets` (section 4).
3. The research desk is archived, redirected, and its rows carried
   into `research_questions` in one migration; `threads` is dropped
   (section 4).
4. Seventeen rooms, in one pages table; the diet strip becomes a
   shared component rather than being copied (sections 3 and 4).
5. CSL-JSON is the canonical source record; columns beside it are
   copies for listing (section 9).
6. Citation keys never change under a draft (section 9).
7. Duplicates are refused on arrival (section 9).
8. Every outside call is the Worker's, through one adapter per
   service with four functions and a status word (sections 10, 22).
9. Alerts run from a D1 copy of the flagged searches, because the
   Worker holds no key to the reader's rows (section 10).
10. Highlights are anchored to quoted text with rectangles as a
    hint, not the other way round (section 11).
11. The editor is the site's one editor with three extensions made
    IN that module (section 12).
12. Notes and documents are versioned by time, and a two-tab
    conflict is shown, never silently won (section 12).
13. Review records are not sources until included (section 13).
14. PRISMA is derived from counts and never typed (section 13).
15. DuckDB is the lab's engine; Python and R come later and opt-in
    (section 14).
16. Every result is a run with its data hash, and a figure in a
    draft points at a run (section 14).
17. Participants are pseudonyms; real names are sealed with a
    passphrase the site never sees (section 15).
18. Transcription is Workers AI through the Worker, and degrades to
    typing (section 15).
19. Surveys and share comments live in D1 because a stranger writes
    them (sections 15, 24).
20. Footnotes and `ibid` are built in stage 4 because OSCOLA needs
    them (section 16).
21. Figure and table numbers, the glossary, the abbreviations, the
    bibliography, the table of contents and the list of figures are
    all derived (sections 16, 29).
22. The task board has no red and no streak; "waiting" is a lane
    (section 17).
23. The calendar goes out as ICS and nothing comes in (section 17).
24. Excalidraw is the canvas; tldraw is not used (section 18).
25. Methods are pieces tagged `method`, not a new content type
    (section 20).
26. The assistant reads only the studio's rows, cites only its ids,
    never writes without a press, and is off until switched on
    (section 21).
27. Semantic search is Workers AI embeddings in `pgvector` under
    row-level security (section 21).
28. Every credential is a wrangler secret or a sealed per-reader row
    (section 22).
29. Files are R2 under the reader's prefix, by ticket, with a cap
    and a quota; erase removes them (section 23).
30. Five device keys, none synced (section 23).
31. Nightly backup is Supabase's own or a pg_cron push, never a
    service key in the Worker (section 24).
32. The policy gains `'wasm-unsafe-eval'` and `worker-src 'self'`
    and nothing in `connect-src` (section 25).
33. Every heavy library is a dynamic import with a per-room budget
    the check measures (section 26).
34. Both languages in the markup, one shown, through the diet tool's
    component promoted to the library (section 27).
35. Stage 1 retires the desk and is usable at its end; stages 6 to
    12 are independent (section 31).
36. The licence rule for borrowing: permissive yes, CPAL with
    credit, copyleft read-only (section 32).

---

## 35. Glossary

The words this plan uses in a fixed sense, in both languages where
the studio shows them.

| word | বাংলা | means here |
| --- | --- | --- |
| room | ঘর | one of the seventeen addresses, with its own colour and tools |
| the board | বোর্ড | the front door, `/tools/research` |
| source | উৎস | one row of the library: a paper, a book, a case, a verse, a dataset, an interview |
| record | রেকর্ড | the CSL-JSON of a source, or a raw result in a review before it is a source |
| key | কী | the citation key, `bashar2020empirical` |
| chip | চিপ | a citation, a link, a figure or a term inside prose, holding an id rather than text |
| locator | পৃষ্ঠা | the page, paragraph or section a citation points at |
| highlight | হাইলাইট | a marked passage with one of five meanings |
| extraction card | তথ্য কার্ড | a highlight with fields: a number, a sample, a method, a finding |
| note | নোট | one of six kinds in the notebook |
| the daily log | দৈনিক খাতা | the note of kind `daily`, one per day |
| question | প্রশ্ন | a row in the question tree, of kind question, hypothesis, claim or variable |
| evidence | প্রমাণ | a pointer from a question to a page of a source, with a stance |
| review | রিভিউ | a systematic, scoping or narrative review with a protocol |
| screening | বাছাই | deciding a record in or out, by keyboard |
| PRISMA | প্রিজমা | the flow diagram of a review, derived from counts |
| dataset | ডেটাসেট | a file in the lab with a dictionary and a source |
| run | রান | one result: inputs, code, data hash, output, figure |
| code | কোড | a label in the codebook, applied to a passage |
| coding | কোডিং | one application of a code to a passage |
| memo | মেমো | a note about a code, a coding or a participant |
| participant | অংশগ্রহণকারী | a person in the field room, always by pseudonym |
| document | ডকুমেন্ট | a chapter, a paper, a proposal, in the writing desk |
| snapshot | স্ন্যাপশট | a named version of a document |
| lane | লেন | later, this week, today, waiting, done |
| session | সেশন | a timed stretch of work, written to the daily log |
| adapter | অ্যাডাপ্টার | the Worker's code for one outside service |
| ticket | টিকিট | a signed pass to one file for thirty minutes |
| sealed | সিলড | encrypted in the browser with a passphrase the site never sees |

---

## 36. The campaign plan, and what it adds to every room

Added on 2 September 2026, after the first draft, from two things:
the New Zealand campaign plan (agricultural and climate risk
economics; Lincoln, Massey, Otago and Motu; six months from an
orientation to a posted working paper, by replicating a published
paper and extending it to Bangladesh) and one brief for the studio
itself: **never having to leave this page**. Spreadsheets,
regressions and the rest of econometrics, citing out of Google
Scholar, saving lists of papers and opening and highlighting them,
graphs, Python built in or connected, everything saved and nothing
lost, everything connected so it can be found, every rough and every
history, and the whole document written, edited and presented, in
one place. Then everything else a year of finance, agriculture and
economics would ask for, added rather than left.

Every item below is placed in a room and is in the stages table of
section 31, which this section amends.

### Never leaving the page, item by item

| the ask | where it is answered |
| --- | --- |
| spreadsheet tasks | the Lab's Sheets, below, a real grid with formulas and `.xlsx` both ways |
| regressions and econometrics | the Lab's two tiers, section 14, with the additions below for panels, surveys and weather |
| citing from Google Scholar | the clipper below, the BibTeX paste, and the Zotero pull; Scholar itself has no API and forbids robots, so the studio meets it on the page Scholar links to |
| saving lists of papers | reading lists and collections, below |
| opening and highlighting them | the reading room, section 11 |
| making graphs | runs with figures, section 14, plus Python's own figures below; every figure is an SVG or PNG a document can hold |
| Python built in or connected | Pyodide in the browser AND Colab through Drive, below; both are stage 8 now rather than stage 13 |
| everything saved, nothing lost | every write immediate, versions, the thirty-day bin, the activity log below, and the backup of section 24 |
| well connected, easy to find | links, backlinks, the Atlas, one search over everything, and collections |
| all roughs and history | the `rough` state, the Roughs list and the activity log below |
| presenting, editing, writing the whole thing | the writing desk, section 16, plus slides and a deck view below |

### Collections, which are how a library is filed

`research_collections`: a tree with a name, a parent and an order,
and `collections uuid[]` on sources, notes, documents and datasets.
The campaign's `NZ-PhD` with `Ag-Econ`, `Climate-Risk`, `Insurance`,
`Methods` and `Target-Supervisors` under it is five rows. A Zotero
pull brings Zotero's collections across as these, so filing done
there is filing done here. Tags stay what they were: flat words for
the gap matrix; a collection is a folder somebody chose.

### The Zotero rule becomes a rule of the desk

The campaign's first non-negotiable is that a citation exists only
if the real paper is in the library. The studio holds it in code: a
source carries `verified`, set only when its record came from
Crossref, OpenAlex, Open Library or a database export, or when a
file is attached. A citation chip that holds an unverified source
renders with a mark, the claims audit lists every such chip, and the
assistant's suggestions never become sources at all: they become a
search. A reading list item that could not be found is deleted from
the list by a press that says so, which is the campaign's Day 2 rule
done in one place.

### The clipper: Google Scholar without leaving

A bookmarklet the Settings page hands out, "Save to the studio",
which sends the current page's address to `/tools/research/clip`.
The Worker fetches that page and reads the `citation_*` meta tags
(the Highwire tags every publisher, SSRN, RePEc and arXiv page
carries, and which are exactly what Scholar itself reads), the DOI,
and the Open Graph fallback, and files a verified source with the
PDF link where the tags name one. Scholar's own result pages are
not fetched: the clipper works on the page a Scholar result links
to, which is where the reader was going anyway. The other two ways
in from Scholar are the BibTeX its "Cite" offers, pasted into the
capture box, and its library's export dropped on the library.

### The Lab's Sheets: a real spreadsheet

The reader is strong in Excel and financial modelling, and the sheet
model in `shared/lesson-grids.ts` is a table with holes in it, not a
spreadsheet. So the Lab gains `/tools/research/lab/sheets`: a grid
with formulas, a formula bar, fills, sorts and filters, from Univer
(Apache 2.0, the successor to Luckysheet), with `.xlsx` in and out
through ExcelJS (MIT), because the free Univer does not carry that.
A workbook is a row (`research_sheets`, the workbook as JSON,
versioned like a note), a range can be sent to a run (a regression
over a range is a run whose input names the sheet, the range and the
sheet's version), and a run's table drops into a sheet. Two
templates ship: the supervisor directory with the campaign's
columns, and the outreach email log.

**The sheet is not the record of a dataset.** A dataset is a file
in R2 and a DuckDB table, section 14; a sheet is where a person
works by hand. A sheet can be saved as a dataset, and that is a copy
with a provenance line.

### Python built in, and Colab connected

Pyodide moves from stage 13 to stage 8, because Python is not a
later luxury for this reader but the campaign's own instrument: the
Lab's notebook has Python cells beside SQL cells, with pandas,
numpy, scipy, statsmodels and matplotlib loaded from the site's own
copy, and further packages by `micropip` where a pure wheel exists
(`linearmodels` for panels, `arch` for GARCH). A Python run stores
its code, its printed output and its figures as PNG, and a figure
chip in a document points at it. pandas reads Stata `.dta`, which is
what LSMS and HIES arrive as, so a survey opens in the Lab without
conversion.

Colab is the connected half, for anything too heavy for a browser:
"Open in Colab" writes a notebook that loads the dataset through a
ticketed URL and saves it to a Drive folder the reader has shared
with the service account the course section already holds; the
studio lists that folder and pulls a finished notebook back as a
run, with its outputs. Nothing about Colab is stored except the
folder's id.

R through webR stays after Python, section 31.

### Agricultural and climate risk economics, as methods and data

**Methods added to the two tiers of section 14.** First tier, in
TypeScript with tests against R: panel fixed effects with clustered
standard errors, difference in differences with an event-study plot,
probit beside logit, two-stage least squares, survey-weighted means
and regressions (weights, strata and clusters out of LSMS's own
design columns), degree days and rainfall shocks from a daily
series, and the actuarial arithmetic of a weather index insurance
contract: expected loss, a loaded premium, and basis risk against a
yield series. Second tier, in Python: regression discontinuity,
quantile regression, GARCH families through `arch`, synthetic
control, and anything with a random effects or a multilevel shape.
Farm risk gets mean-variance and stochastic dominance in the first
tier because both are arithmetic.

**Data adapters added to section 22's table**, each with the same
four functions and a status word:

| service | for | credential | note |
| --- | --- | --- | --- |
| **FAOSTAT** | production, prices, trade, all countries | none | open bulk and query API |
| **World Bank microdata catalogue** (LSMS, LSMS-ISA) | the survey catalogue and documentation | none for the catalogue; a file needs the reader's own registration | the studio finds and cites; the reader downloads and drops |
| **Harvard Dataverse** (IFPRI's Bangladesh surveys) | dataset search, files, and the citation Dataverse mints | none for public files; a token for restricted ones, sealed per reader | a dataset arrives with its DOI and its own citation |
| **Bangladesh Bureau of Statistics** (HIES) | household income and expenditure | none | manual: a `.dta` or `.csv` dropped on the Lab, with the source row typed once |
| **NASA POWER** | daily weather at a point, from 1981 | none | the "climate for a place" tool below |
| **ClimateSERV** (CHIRPS) | rainfall at a point or over an area | none | the same tool, second series |
| **Copernicus CDS** (ERA5) | reanalysis | a key | later: the files are large and the queue is slow; the tool says so and offers POWER first |
| **EM-DAT** | disaster events | the reader's own academic registration | manual: the CSV dropped, and the importer knows its shape |
| **Ken French Data Library** | asset pricing factors | none | a zip the importer knows the shape of, for the finance-adjacent case |
| **NZRIS** | New Zealand's funded projects | none; a portal rather than an API | manual: a paste from the portal into the people room's grants, below |
| **GitHub** | the visible-progress rule | the reader's own token, contents scope on one repository, sealed per reader | the bridge below |

FRED, the World Bank indicators, ORCID and OpenAlex are already in
the table. Motu's working papers are in OpenAlex and RePEc.

**"Climate for a place"** is a Workshop tool that takes a latitude
and longitude (or a district picked from a short list of
Bangladesh's), asks NASA POWER and ClimateSERV for daily
temperature and rainfall, and files the answer as a dataset with
its source and citation, so a weather regression starts from a row
rather than from a download.

### Replication, as a kind of project and a Lab template

`replication` joins the project kinds. A replication project's
`body` holds the paper (a source), the exact table to reproduce,
the datasets with their URLs, download dates and filter settings,
and the extension in one sentence. The Lab template that goes with
it is the campaign's own week:

1. **Raw is never edited.** A file dropped into a replication's
   `raw` collection is flagged immutable; a transform writes to
   `clean`, and the studio refuses a write to a raw file.
2. **The four sanity checks run on every dataset by themselves**:
   rows and columns against the paper's stated N, missing values per
   column, summary statistics with anything a thousand times off
   flagged, and the date and country coverage. They are a run, and
   the run is the first line of the dataset's page.
3. **Compare to the paper** is a panel on a run: the reader types
   the paper's coefficients and standard errors for the target table
   once, and every later run of that specification shows the gap
   beside each number, with the five usual causes (sample filter,
   transformation, clustering, missing values, and the fixed effects
   the paper actually used) as a checklist the reader ticks off.
4. **The extension is a second run** of the same specification on
   the Bangladesh data, drawn beside the first.

### Roughs and history

Two additions and both are rows. `rough` joins the document states
(`rough | outline | drafting | revising | done`), and a Roughs list
on the desk holds everything in that state, because a rough should
be easy to start and easy to find again. And `research_activity`
holds one line for every write the studio makes (the kind, the item,
the action, a one-line summary, the time), written by
`next/lib/research-api.ts` on every call so that nothing can forget to
log itself. The Archive room draws it as the history of the whole
project, searchable, and the daily log's automatic lines come out of
it rather than being written twice.

### Presenting

`slides` joins the document kinds. A slides document is an outline
whose headings are slides and whose paragraphs are bullets, edited
in the same editor, with a figure chip per run as on any document.
The deck view is a page (`/tools/research/write/<id>/present`) with
arrows and space to move, `f` for full screen, presenter notes in a
second window, and the site's own type. Export is PDF through the
print stylesheet at 16:9, and `.pptx` through `pptxgenjs` (MIT),
with the figures as images and the notes as speaker notes.

### The research log, the way the campaign writes it

The daily note's template is the campaign's five lines: time spent,
what I did, what I learned, what is blocking me, tomorrow's first
task. Closing a session fills the first from the timer; the
activity log fills the second as a list the reader edits down; the
last line is what the board's capture box shows the next morning,
prefilled and unsent, so the day starts where yesterday said it
should. The daily target is a fact on the board ("2h 10m of 2h 30m
today") and there is still no streak.

### Outreach

The people room gains the supervisor directory's columns as fields
on a person: institution, the pillar (primary industries,
environment, technology, health), whether they hold an active grant,
its end date, the last three papers (filled from OpenAlex by ORCID
or name in one press), the data the reader could bring them, the
contact status (`not contacted | emailed | replied | call booked`),
and a priority of A, B or C. Grants from NZRIS are `body.grants` on
a person, pasted from the portal: title, funder, institution, end
date. The email log is events of kind `email` on a person: subject,
sent, replied, next step; a draft is written by the assistant from
the campaign's outreach rules (under two hundred words, a specific
first sentence, one ask, no adverbs) and opened in `mailto:`,
because the studio does not send mail. The directory is also a
Sheets template for the reader who wants to see it as a grid.

### The prompt library, and the project's brief

`prompt` joins the note kinds: a note with `[PLACEHOLDERS]` that the
assistant's drawer lists and fills. The campaign's seven ship as
templates. A project's `body.brief` is its master prompt, the
context the assistant reads first in project mode, so "who I am,
what I have, how to work with me" is written once per project and
never pasted.

### The fresh-chat rule

The assistant has two modes and the drawer says which it is in.
`project` reads the brief and the rows. `fresh` reads nothing but
what the reader pasted, carries no brief, and answers as the
campaign's hostile reviewer. Every document has a "read this as a
hostile reviewer" button that opens a fresh drawer, and the answer
is kept as an `assistant` note marked `fresh`, so a review cannot be
mistaken for a collaborator's encouragement.

### Visible progress: the GitHub bridge

`POST /api/research/github/push`, with the reader's own token sealed
in `research_connections` (contents scope, one repository), commits
a project's code folder: every Python cell as a notebook, every SQL
transform as a file, every run's figure, and a README the studio
writes from the project's brief, its datasets and its current state.
A weekly "push this week's work" is a task the planner makes, which
is a reminder without being a nag. SSRN, ORCID and the Scholar
profile are outside the studio and are kept as facts on Settings and
as a `preprint` event with a checklist when the paper is posted.

### Deadlines and loose ends

`deadline` joins the event kinds, with an institution on it, for the
three scholarship rounds. The campaign's five loose ends (the
English test, the partner visa, domestic tuition status, alumni
library access, the round dates) are five tasks, three of them in
`waiting`. The six monthly deliverables are `milestone` events, and
the timeline of section 17 draws them.

### Venues and reading lists

`research_venues`: a journal with its ISSN, its OpenAlex id, whether
DOAJ lists it, the reader's own rank and a "read regularly" flag,
and a recent-issues feed from OpenAlex per flagged venue into the
inbox. The campaign's Day 2 journal map is eight of these rows.
`research_lists`: an ordered list of sources with a note per item
and a per-item state (`to find | saved | not found`), which is the
campaign's fifteen-paper list with the rule that a paper that cannot
be found leaves the list, done as a press.

### How to get this paper

Every source page carries one derived line: open access through
Unpaywall, the author's own page through OpenAlex, a request email
from the template with the author's name filled in, and the
interlibrary loan tracker of section 29. Alumni access is a fact on
Settings (which library, which proxy address) so the "publisher"
link rewrites through it where the reader has one.

### The folder tree, which is the export

The campaign's Drive tree (`00-Admin`, `01-Literature`, `02-Targets`,
`03-Paper` with `data`, `code`, `output` and `drafts`, `04-Proposal`,
`05-Outreach`) is what the Archive room's export writes, with the
campaign's own file naming (`YYYY-MM-DD_short-description_v1.ext`),
so a Drive folder and a studio export are the same shape. The
service account can read a folder the reader shares with it, so the
tree can be imported as well.

### What this changes in the stages table

- **Stage 1** also lands collections, the activity log, the clipper,
  reading lists, `prompt` notes, `verified` on a source and the
  `rough` state.
- **Stage 4** also lands `slides`, the deck view and the `.pptx`
  export.
- **Stage 5** also lands the research log's template and session
  fill, `deadline` and `milestone` events and the email log.
- **Stage 6** also lands the outreach fields, grants, venues and the
  people room's OpenAlex fill.
- **Stage 8** also lands Sheets, Python in the browser, Colab through
  Drive, the replication template and its four checks, the
  agricultural and climate adapters, "climate for a place", and the
  GitHub bridge. Pyodide leaves stage 13.
- **Stage 11** also lands the two assistant modes and the prompt
  library's runner.

### Decisions this section adds

37. Collections are a tree and a folder somebody chose; tags stay
    flat.
38. A citation chip on an unverified source is marked, and the
    assistant's suggestions never become sources without a lookup.
39. Google Scholar is met on the page it links to, through a
    bookmarklet and the Highwire tags, never by fetching Scholar.
40. The Lab's spreadsheet is Univer with ExcelJS for `.xlsx`; a
    sheet is not a dataset until saved as one.
41. Python is Pyodide in the browser from stage 8, with Colab
    connected through the Drive service account; R follows.
42. Raw files in a replication are immutable and the four sanity
    checks run on every dataset by themselves.
43. Every write is a line in the activity log, written by the API
    layer so nothing can forget.
44. Slides are a document kind with a deck view and a `.pptx`
    export, not a slide editor.
45. The assistant has a `fresh` mode that reads nothing, and every
    document can be sent to it as a hostile reviewer.
46. The GitHub bridge pushes with a sealed per-reader token, and
    the weekly push is a task rather than a nag.
