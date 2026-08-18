/* ============================================================
   arbeitsbuch.js: the German practice book, made daily.

   `schools/workbook.js` is the whole program and its header says
   why there is one rather than two. This file is what the German
   school owns: its storage key, its curriculum, and the one-off
   rename below.

   Everything is stored on this device only. Nothing is sent
   anywhere, and there is nothing to log in to.
   ============================================================ */

import { findStufe, dayId } from "/deutsch/curriculum.js";
import * as progress from "/deutsch/progress.js";
import { initWorkbook } from "/schools/workbook.js";

const WRITE_KEY = "deutsch-schrift";

/* Box keys are namespaced by Stufe: "stufe-2/tag-1-tausche-1".
   The first book shipped before there was a second one and wrote
   them bare, as "tag-1-tausche-1", which now means day 1 of every
   book would open showing whatever was written on day 1 of Stufe
   1. Everything bare in storage was written in Stufe 1, because
   for as long as bare keys were written it was the only book, so
   the rename is safe and needs no guesswork.

   This runs once: after the rewrite there are no bare keys left
   to match. It is deliberately not a version flag, because a
   learner with two devices and one old backup would need it to
   run again on the device that has not seen it yet. */
function migrate(schrift, key) {
  const bare = Object.keys(schrift).filter((k) => /^(tag-|huete-)/.test(k));
  if (!bare.length) return schrift;
  bare.forEach((k) => {
    const moved = `stufe-1/${k}`;
    /* Never overwrite: if this device has already written in the
       namespaced box, that is the newer text and it wins. */
    if (!(moved in schrift)) schrift[moved] = schrift[k];
    delete schrift[k];
  });
  try {
    localStorage.setItem(key, JSON.stringify(schrift));
  } catch { /* private mode, or full: the text is still on screen */ }
  return schrift;
}

initWorkbook({
  writeKey: WRITE_KEY,
  findStage: findStufe,
  progress,
  dayId,
  migrate,
  /* "all thirty done, now Tag 31": the German book counts its
     days in German from here on, because the learner is about to
     meet them that way. */
  allDoneWord: "Tag",
});
