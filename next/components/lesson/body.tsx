/* ============================================================
   lesson/body.tsx: two bodies, one set of blocks, in order.

   A lesson's prose is HTML in a row. Both bodies carry the same
   mount markers:

       <div class="mount" data-mount="pe-lab"></div>

   `splitBody()` cuts each one at those markers, and this walks
   the two lists together: Bangla chunk, English chunk, block,
   Bangla chunk, English chunk, block. So the PROSE is rendered
   twice, once per language, and the BLOCK is rendered once,
   between them.

   ---- why the block is not rendered twice ----

   Because it holds state. A quiz rendered in both columns is two
   quizzes, and the reader answers the one they can see while the
   other keeps its own idea of what was pressed; switch language
   mid-lesson and the answers vanish. A block says itself in both
   languages out of one definition, which is exactly what a `Say`
   is for.

   ---- and why the two bodies must agree ----

   The interleave only lines up if both carry the same mount ids
   in the same order. `check-money.ts` fails when they do not,
   rather than letting a block go missing from one language on a
   page that renders perfectly. Here, if it happens anyway, the
   Bangla body's order wins and every block is still rendered:
   a lesson with a block in the wrong place beats a lesson with
   no block at all.
   ============================================================ */

import { parseBlocks, splitBody, type Blocks } from "@reiad/shared/lesson";
import { LessonBlock } from "./block";

/** One chunk of prose, in one language. `dangerouslySetInnerHTML`
    for the same reason an article's body uses it: this is the
    writing, sanitised on the way into the row by
    `functions/_lib/sanitise.ts`, and escaping it would print the
    tags. */
function Prose({ html, lang }: { html: string; lang: "bn" | "en" }) {
  if (!html.trim()) return null;
  return (
    <div className={lang === "bn" ? "ls-bn" : "ls-en"} lang={lang}
         dangerouslySetInnerHTML={{ __html: html }} />
  );
}

export function LessonBody(
  { bn, en, blocks, lesson, school }:
  { bn: string; en: string; blocks: unknown; lesson: string; school: string }
) {
  const all: Blocks = parseBlocks(blocks);
  const bangla = splitBody(bn);
  /* A lesson with no English half is a real state: 205 lessons
     were exactly that on the day the column arrived, and three
     other schools still are. The Bangla is then the whole lesson
     and the switch has nothing to switch to, which
     `<LessonLangSwitch>` in the route answers by not rendering. */
  const english = en.trim() ? splitBody(en) : null;

  const ids = bangla.ids;
  const rendered = new Set<string>();

  return (
    <div className="ls-body">
      {bangla.parts.map((part, i) => {
        const id = ids[i];
        const block = id ? all[id] : undefined;
        if (id) rendered.add(id);
        return (
          <div key={i} className="ls-slice">
            <Prose html={part} lang="bn" />
            {english ? <Prose html={english.parts[i] ?? ""} lang="en" /> : null}
            {block ? (
              <LessonBlock id={id} block={block} lesson={lesson} school={school} />
            ) : null}
          </div>
        );
      })}

      {/* A block the prose never mounted still belongs to the
          lesson, so it goes at the end rather than being dropped.
          `check-money.ts` fails on one of these, which is what
          stops the tail becoming where blocks live. */}
      {Object.entries(all)
        .filter(([id]) => !rendered.has(id))
        .map(([id, block]) => (
          <LessonBlock key={id} id={id} block={block} lesson={lesson} school={school} />
        ))}
    </div>
  );
}
