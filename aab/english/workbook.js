/* ============================================================
   workbook.js: the English practice book, made daily.

   `schools/workbook.js` is the whole program and its header says
   why there is one rather than two. This file is what the
   English school owns, which is a storage key and a curriculum.

   There is no migration here and there should not be: keys have
   been namespaced by term from the first day this shipped, so
   there is nothing to rename.

   Everything is stored on this device only. Nothing is sent
   anywhere, and there is nothing to log in to.
   ============================================================ */

import { findTerm, dayId } from "/english/curriculum.js";
import * as progress from "/english/progress.js";
import { initWorkbook } from "/schools/workbook.js";

initWorkbook({
  writeKey: "english-write",
  findStage: findTerm,
  progress,
  dayId,
});
