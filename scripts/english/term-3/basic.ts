/* ============================================================
   টার্ম ৩, বেসিক: খেলার নিয়ম. Parts 1 to 10, one file each,
   gathered here into the rung.

   What seeds these rows. See `scripts/english/shape.ts` for why
   the files are kept and what they are not. A part is its own
   file (`01-players.ts` to `10-sentences.ts`) so that a
   correction to one sits in a diff of its own and a file stays
   the size of one lesson.

   House rules for the text in every part:

     · the learner is তুমি, as in every part of this school
     · every English string is the thing being taught and carries
       lang="en"; every Bangla string is what it means or why it
       works, never the other way round
     · the same four people walk through every part: রাফি (class
       eight, cricket), মিতু আপু (class ten, the exam), নানু (the
       stories) and তানভীর ভাই (the films), so a rule arrives in a
       scene a reader already knows
     · a part takes its topic end to end: the rule, the deeper
       rules under it, the rebels, the exam's way of asking, the
       traps, and a checklist to close on
     · a part carries games of several kinds, not one: something
       to sort, something to build, something to find, something
       to guess before reading, and a sheet to type into where
       the topic is a table
     · every part ends on something said out loud
   ============================================================ */

import type { Written } from "../shape.ts";
import { PART as players } from "./01-players.ts";
import { PART as nouns } from "./02-nouns.ts";
import { PART as pronouns } from "./03-pronouns.ts";
import { PART as articles } from "./04-articles.ts";
import { PART as adjectives } from "./05-adjectives.ts";
import { PART as agreement } from "./06-agreement.ts";
import { PART as tenses } from "./07-tenses.ts";
import { PART as adverbs } from "./08-adverbs.ts";
import { PART as prepositions } from "./09-prepositions.ts";
import { PART as sentences } from "./10-sentences.ts";

export const LESSONS: Written = {
  players, nouns, pronouns, articles, adjectives,
  agreement, tenses, adverbs, prepositions, sentences,
};
