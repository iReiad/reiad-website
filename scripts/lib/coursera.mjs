/* ============================================================
   coursera.mjs: how a Drive folder of course files becomes a
   course, a module and a lesson.

   A third-party course arrives as an export, not as prose
   somebody wrote here, so the shape of it is the shape of the
   filenames. Those follow one rule and this file is that rule
   written down once, so that the importer and every check agree
   about what a lesson is.

     <course>/<module>/<group>/NN_slug.mp4
                              /NN_slug.en.txt
                              /NN_slug.en.srt
                              /NN_slug_instructions.html
                              /NN_slug_quiz.html
                              /NN_slug_Some_Attachment.docx

   Four levels, and the reader's model has three. The one that
   folds is the group: a lesson keeps the group's name as its
   SECTION, which is exactly what a stage's lessons already carry
   in `shared/schools.ts`, and the numbering runs across the
   module so the ladder reads straight down.

   ---- what counts as a lesson ----

   The `NN_slug` prefix, not the file. One lesson is a video, or
   a reading, or a quiz, and it may carry a transcript and any
   number of attachments beside it. Keying on the prefix rather
   than on the video is what stops a reading being invisible: a
   Coursera module is about a third readings, and a manifest
   built from `*.mp4` alone would quietly drop them.
   ============================================================ */

/** `04_introduction-to-the-course.mp4` -> `{ n: 4, slug: "introduction-to-the-course", rest: ".mp4" }`

    Anything without the numeric prefix is not part of a lesson
    and comes back null: the odd `_resources.html` sitting loose
    in a Resources folder is a file, not a step in a course. */
export function splitName(title) {
  const match = /^(\d{2})_(.+)$/.exec(title);
  if (!match) return null;

  const n = Number(match[1]);
  const tail = match[2];

  /* The suffix is whichever of the known endings this is, and the
     slug is what is left. Order matters: `.en.srt` has to be
     tried before `.srt` would be, and `_instructions.html` before
     a bare `.html`, or a reading's slug keeps `_instructions` in
     it and stops matching its own video. */
  for (const [suffix, kind] of SUFFIXES) {
    if (tail.endsWith(suffix)) {
      return { n, slug: tail.slice(0, -suffix.length), kind, suffix };
    }
  }

  /* An attachment: `03_learning-log-..._Learning_Log_Template.docx`.
     The slug runs to the last underscore before the document's own
     name, which is the only part of this rule that has to guess.
     It guesses by extension rather than by the name, because the
     name is a human title with underscores in it and the extension
     is not. */
  const dot = tail.lastIndexOf(".");
  if (dot === -1) return null;
  const ext = tail.slice(dot + 1).toLowerCase();
  if (!ATTACHMENT_EXT.has(ext)) return null;

  const under = tail.indexOf("_");
  if (under === -1) return null;
  return {
    n,
    slug: tail.slice(0, under),
    kind: "attachment",
    suffix: tail.slice(under),
    ext,
  };
}

/** Longest first, so `.en.txt` never loses to `.txt`. */
const SUFFIXES = [
  [".en.txt", "transcript"],
  [".en.srt", "captions"],
  ["_instructions.html", "reading"],
  ["_quiz.html", "quiz"],
  ["_exam.html", "exam"],
  [".mp4", "video"],
];

const ATTACHMENT_EXT = new Set([
  "docx", "doc", "xlsx", "xls", "pptx", "ppt", "pdf", "csv", "txt", "zip", "r", "rmd", "sql",
]);

/** Which of the three a lesson IS, given everything filed under
    its prefix. A video wins over a reading wins over a quiz: a
    step with a video in it is a video lesson whatever else came
    with it. */
export function kindOf(parts) {
  if (parts.some((p) => p.kind === "video")) return "video";
  if (parts.some((p) => p.kind === "reading")) return "reading";
  if (parts.some((p) => p.kind === "exam")) return "exam";
  if (parts.some((p) => p.kind === "quiz")) return "quiz";
  return "file";
}

/** `01_the-wonderful-world-of-data` -> `The wonderful world of data`.

    Sentence case rather than title case, deliberately: these are
    Coursera's own headings and they are written in sentence case,
    so title-casing them would be this site editing somebody
    else's words. The exceptions are the handful of names that are
    wrong in lower case. */
export function titleOf(slug) {
  const words = slug.replace(/^\d{2}_/, "").split("-").filter(Boolean);
  if (!words.length) return "";
  const said = words.map((w, i) => {
    const fixed = ACRONYMS[w.toLowerCase()];
    if (fixed) return fixed;
    return i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w;
  });
  return said.join(" ");
}

const ACRONYMS = {
  sql: "SQL", r: "R", bi: "BI", csv: "CSV", api: "API", ai: "AI",
  google: "Google", tableau: "Tableau", rstudio: "RStudio", excel: "Excel",
  bigquery: "BigQuery", kaggle: "Kaggle", tidyverse: "tidyverse",
};

/** A course folder is `4. Process Data from Dirty to Clean`, and
    both halves of that are wanted: the number orders the eight,
    and the rest is the title with the numbering taken off. */
export function splitCourse(title) {
  const match = /^(\d+)\.\s*(.+)$/.exec(title);
  if (!match) return null;
  return { n: Number(match[1]), title: match[2].trim() };
}

/* The addresses and the tick's id are NOT here. They are in
   `shared/courses.ts`, which is the one place the Worker, the
   browser and these scripts all read, and a second copy of
   "where does a lesson live" is the drift this whole file exists
   to prevent one level down. */
