/* ============================================================
   Editor.tsx: the one part of this page React does not own.

   A contenteditable is a piece of the DOM that the browser and
   the writer are both editing behind React's back. Rendering it
   from state, the way every other component here works, means
   replacing the node the caret is sitting in on every keystroke,
   and the caret goes to the end of the line every time. So the
   element is rendered exactly once, empty, and `createEditor()`
   from `/editor.js` takes it from there.

   What React still owns: the toolbar above it, which is a
   function of the block list and nothing else, and the decision
   about when the article's HTML is read back out.

   `dangerouslySetInnerHTML` on the div would have been the short
   way to seed it and is the wrong one twice: React would then
   believe it knows the contents, and the first render after any
   state change would put the original HTML back over whatever had
   been typed. The body is set through the handle instead, which is
   also how the old Studio loaded a draft.
   ============================================================ */

import { useEffect, useRef } from "react";
import { createEditor, type EditorHandle } from "/editor.js";
import { toast } from "../site.ts";

const PLACEHOLDER = `Paste your article here (Ctrl+V).

Type / for headings, lists, note boxes, tables and photos. Markdown works
too: ## for a heading, - for a bullet, > for a quote, --- for a divider.

Photos: paste a screenshot, drag an image file in, or use ＋ Photo above.
Click a photo for its size, its shape, which part of it to keep, and the alt
text. The one marked Lead becomes the share card.

Ctrl+K links · Ctrl+S saves the draft · Ctrl+Enter publishes.

Where it goes is at the top: Insights, the kitchen or travel. Change it any
time, the preview and the finished page follow.

Headings, bold, links and lists survive the paste, fonts, colours and
everything else Word smuggles in gets thrown away.`;

/* The formatting buttons, as the old Studio's markup had them.
   `cmd` goes straight to the browser; "link" is the one that asks
   a question first. */
const TOOLS: { group: string; items: [string, string, string, string?][] }[] = [
  { group: "Text style", items: [
    ["formatBlock", "p", "¶", "Paragraph"],
    ["formatBlock", "h2", "H2", "Heading"],
    ["formatBlock", "h3", "H3", "Sub-heading"],
  ] },
  { group: "Emphasis", items: [
    ["bold", "", "B", "Bold (Ctrl+B)"],
    ["italic", "", "I", "Italic (Ctrl+I)"],
  ] },
  { group: "Lists and quotes", items: [
    ["insertUnorderedList", "", "• List", "Bullet list"],
    ["insertOrderedList", "", "1. List", "Numbered list"],
    ["formatBlock", "blockquote", '" Quote', "Quote"],
  ] },
];

/* The blocks that get a button of their own. The rest of the list
   is a slash away, and both come from the same array in
   editor.js: naming them here by class is how the toolbar and the
   slash menu stay one list. */
const BLOCK_BUTTONS = ["at-a-glance", "side-note", "step-list", "checklist", "figures"];

export function Editor({
  handle, onChange, lang, onSave, onPublish,
}: {
  handle: React.RefObject<EditorHandle | null>;
  onChange: () => void;
  /** Read at the moment a block is inserted, not at mount: the
      block copy is written in the language the piece is in, and
      the picker can change after the editor exists. */
  lang: React.RefObject<string>;
  onSave: () => void;
  onPublish: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);
  const photoInput = useRef<HTMLInputElement>(null);
  /* Bumped when the editor is created, only so the toolbar renders
     a second time with a handle to talk to. The blocks are fixed
     after that. */
  const ready = useRef(false);

  useEffect(() => {
    if (!root.current) return;
    const ed = createEditor({
      root: root.current,
      onChange,
      lang: () => lang.current,
      toast,
      pickPhoto: () => photoInput.current?.click(),
      onSave,
      onPublish,
    });
    handle.current = ed;
    ready.current = true;
    onChange();          // the toolbar wants a handle; so does the preview

    return () => { ed.destroy(); handle.current = null; };
    /* Created once. The callbacks are refs and getters for exactly
       this reason: an editor that is torn down and rebuilt because
       a prop changed identity is an editor that loses the caret,
       the undo stack and the article. */
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ed = handle.current;

  return (
    <>
      {/* The writing tools. `studio-tools` makes this stick to the
          top of the window while the article scrolls under it: on a
          two-thousand-word piece the formatting buttons used to be a
          long scroll back up, which is how people end up not using
          them. */}
      <div className="pane-bar studio-tools" id="tool-bar">
        {TOOLS.map((row) => (
          <span className="tool-group" role="group" aria-label={row.group} key={row.group}>
            {row.items.map(([cmd, value, label, title]) => (
              <button
                className="chip"
                type="button"
                key={`${cmd}-${value}-${label}`}
                title={title}
                onClick={() => ed?.command(cmd, value || null)}
              >
                {label === "B" ? <b>B</b> : label === "I" ? <i>I</i> : label}
              </button>
            ))}
          </span>
        ))}

        <span className="tool-group" role="group" aria-label="Insert">
          <button className="chip" type="button" title="Add a link (Ctrl+K)"
                  onClick={() => ed?.link()}>Link</button>
          <button className="chip" type="button" id="add-photo" title="Add a photo"
                  onClick={() => photoInput.current?.click()}>＋ Photo</button>
        </span>

        <span className="tool-group" role="group" aria-label="Blocks">
          {BLOCK_BUTTONS.map((key) => {
            const block = ed?.byKey(key);
            return (
              <button
                className="chip"
                type="button"
                key={key}
                title={block ? `${block.label}: ${block.hint}` : undefined}
                onClick={() => { if (block) { ed?.focus(); ed?.run(block); } }}
              >
                {block?.label ?? key}
              </button>
            );
          })}
        </span>

        <span className="tool-hint mono">Type <kbd>/</kbd> for everything else</span>

        <input
          type="file" accept="image/*" multiple hidden
          ref={photoInput}
          onChange={(e) => {
            if (e.target.files?.length) ed?.insertImages(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      <div
        id="editor"
        ref={root}
        className="paste-area"
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        aria-label="Article body"
        data-placeholder={PLACEHOLDER}
      />
    </>
  );
}
