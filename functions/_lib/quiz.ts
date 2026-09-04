/* _lib/quiz.ts: a Coursera quiz export, turned into questions.

   IT CANNOT BE `sanitiseHTML`. Every answer in a quiz page lives
   inside a `<form>`, and that function drops `form` WHOLE,
   contents and all, which is right for an article: running it over
   a quiz leaves the questions and deletes every option, and the
   page looked finished. Widening the allowlist would let a form
   into every article on the site to serve one page that is not an
   article. So this reads the structure FIRST and sanitises only
   the prose it hands on: what reaches the browser is data, and the
   browser builds its own inputs from it.

   The shape it reads:

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

   `type` is the one thing worth reading off the input: `radio` is
   pick one and `checkbox` is select-all, and offering radios for a
   select-all question tells the reader the wrong thing about it.

   THE ANSWERS ARE NOT IN THE FILE. No `checked`, no `correct`,
   nothing: Coursera marks on its own server and the export is the
   paper, not the marking scheme. So this cannot score and nothing
   here pretends to. A wrong tick on a right answer is worse than
   no tick. */

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

/** Tags out, entities decoded, whitespace collapsed. Only ever run
    over one option, which is a `<label>` holding an `<input>`, a
    `<co-content>`, a `<span>` and a `<br>`. */
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
 * the honest answer for a shape this does not recognise: the
 * caller falls back to rendering it as a reading, so an
 * unparseable quiz is still readable rather than blank.
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
