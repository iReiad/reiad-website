/* ============================================================
   _lib/quiz.ts: a Coursera quiz export, turned into questions.

   ---- why this cannot be `sanitiseHTML` ----

   A quiz page arrives as a saved Coursera document and every
   answer in it lives inside a `<form>`. `sanitiseHTML()` drops
   `form` WHOLE, contents and all, and it is right to: an article
   out of the Studio has no business carrying a form, and the
   Studio's sanitiser and the server's have to agree.

   So running it over a quiz leaves the questions and deletes
   every option, which is exactly what the page did: "Question 2",
   a rule, "Question 3", a rule. Nothing looked broken. The words
   that were missing were the ones nobody had counted.

   The fix is not to widen the allowlist. That would let a form
   into every article on the site to serve one page that is not an
   article. This reads the structure FIRST, keeps what it
   understands, and sanitises only the prose it hands on. What
   reaches the browser is data, not somebody else's markup, and
   the browser builds its own inputs from it.

   ---- the shape it is reading ----

       <h3>Question 1</h3>
       <co-content>  ...the prompt: <p>, <img>, sometimes <h2>  </co-content>
       <form>
         <label>
           <input name="0" type="radio"/>
           <co-content><span>An option</span></co-content>
           <br/>
         </label>
         ...
       </form>
       <hr/>
       <h3>Question 2</h3>
       ...

   `type` is the one thing worth reading off the input: `radio` is
   pick one and `checkbox` is "select all that apply", and a page
   that offers radios for a select-all question is quietly telling
   the reader the wrong thing about the question.

   ---- what is NOT in the file ----

   The answers. There is no `checked`, no `correct`, no data
   attribute, nothing: Coursera marks a quiz on its own server and
   the export is the paper, not the marking scheme. So this cannot
   score, and nothing here pretends to. A reader answers, the
   answer is kept, and that is the whole of the promise. Inventing
   a "correct" would mean guessing, and a wrong tick on a right
   answer is worse than no tick at all.
   ============================================================ */

import { sanitiseHTML } from "./sanitise.ts";

export interface QuizQuestion {
  /** As printed on the page: "Question 3" is 3. Read rather than
      counted, because a quiz that starts at 2 is a quiz that was
      exported that way and the reader should see what it says. */
  n: number;
  /** The prompt, sanitised. HTML because it carries paragraphs,
      emphasis and sometimes a diagram as a data: URI. */
  prompt: string;
  /** Checkbox rather than radio: "select all that apply". */
  multiple: boolean;
  /** Option text, in the order the export lists them. Plain text
      rather than HTML: an option is a sentence, and one that
      needed markup would be a question in disguise. */
  options: string[];
}

/** Tags out, entities decoded, whitespace collapsed.

    Only ever run over one option, which is a `<label>` holding an
    `<input>`, a `<co-content>`, a `<span>` and a `<br>`. Dropping
    the tags leaves the sentence. */
function textOf(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

/** The options inside one `<form>`, and whether more than one may
    be chosen. */
function optionsIn(block: string): { options: string[]; multiple: boolean } {
  const form = /<form\b[^>]*>([\s\S]*?)<\/form\s*>/i.exec(block);
  if (!form) return { options: [], multiple: false };

  const options: string[] = [];
  let multiple = false;

  for (const label of form[1].matchAll(/<label\b[^>]*>([\s\S]*?)<\/label\s*>/gi)) {
    const inner = label[1];
    if (/<input\b[^>]*type\s*=\s*["']?checkbox/i.test(inner)) multiple = true;

    const text = textOf(inner);
    /* An empty label is a spacer, not a choice. Keeping one would
       put a nameless radio button under a question. */
    if (text) options.push(text);
  }

  return { options, multiple };
}

/**
 * Every question in a quiz export.
 *
 * Returns an empty array for anything that is not one, which is
 * the honest answer for a file whose shape this does not
 * recognise: the caller falls back to rendering it as a reading,
 * so an unparseable quiz is still readable rather than blank.
 */
export function parseQuiz(html: string): QuizQuestion[] {
  const text = String(html ?? "").replace(/\r\n?/g, "\n");

  /* Split on the question headings rather than walking the
     document. Everything between one `<h3>Question N</h3>` and the
     next belongs to that question, which is the whole of this
     format's structure. */
  const heads = [...text.matchAll(/<h3\b[^>]*>\s*Question\s+(\d+)\s*<\/h3\s*>/gi)];
  if (!heads.length) return [];

  const out: QuizQuestion[] = [];

  for (let i = 0; i < heads.length; i += 1) {
    const head = heads[i];
    const from = (head.index ?? 0) + head[0].length;
    const to = i + 1 < heads.length ? (heads[i + 1].index ?? text.length) : text.length;
    const block = text.slice(from, to);

    /* The prompt is everything before the form. Sanitised, because
       it is prose from somewhere else and it is about to be put
       into this page: the same treatment a reading gets, and the
       same sanitiser. */
    const beforeForm = block.split(/<form\b/i)[0];
    const prompt = sanitiseHTML(beforeForm);

    const { options, multiple } = optionsIn(block);

    /* A heading with neither prose nor options under it is a
       fragment of a broken export, not a question. */
    if (!prompt && !options.length) continue;

    out.push({ n: Number(head[1]), prompt, multiple, options });
  }

  return out;
}
