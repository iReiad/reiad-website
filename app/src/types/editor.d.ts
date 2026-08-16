/* `/editor.js`, the writing surface. See ./README.md.

   Everything here used to live inside `aab/studio.js`. It is a
   module because the React Studio needs the same one: a
   contenteditable with a sanitiser, a slash menu, markdown rules
   and a figure toolbar is the last thing on this site that should
   exist twice, and each of those has already been the site of a
   bug nobody would have found by reading. */

/** The article's class allowlist, as the browser enforces it.
    `check-css.mjs` reads this out of editor.js by name and fails
    if it disagrees with the server's. */
export const KEEP_CLASSES: Set<string>;

/** Arbitrary pasted HTML, reduced to the small set of tags the
    site styles. Used on the way in from a paste and again on the
    way out to the database. */
export function sanitize(html: string): string;

export function textToHtml(text: string): string;
export function escapeHtml(s: unknown): string;

/** A headline turned into a URL: lower case, hyphens, and it stops
    at about forty characters but never mid-word. */
export function slugify(s: string): string;

export function readingStats(html: string): { words: number; photos: number; minutes: number };

/** The placeholder a fresh figure's caption carries. */
export const CAPTION_HINT: string;

/** Captions the writer never touched should not ship. */
export function dropUntouchedCaptions(html: string): string;

/** The copy inside a block, in the language the piece is written
    in. A Bangla piece with an English "At a glance" over its
    Bangla facts is a piece with an English word in it. */
export const WORDS: Record<"en" | "bn", Record<string, string>>;

/** One of the blocks a long read is made of. `key` is present only
    for the ones a toolbar button can name. */
export interface Block {
  label: string;
  hint: string;
  key?: string;
  run?: () => void;
  html?: () => string;
}

export interface EditorHandle {
  blocks: Block[];
  run(block: Block): void;
  byKey(key: string): Block | undefined;

  insertImages(files: FileList | File[]): Promise<void>;
  insertHtmlAtCaret(html: string): void;
  insertBlockHtml(html: string): void;
  /** Ask for a URL and wrap the selection in it. */
  link(): void;
  /** A formatting command straight through to the browser. */
  command(cmd: string, value?: string | null): void;

  html(): string;
  setHtml(value: string): void;
  clear(): void;
  focus(): void;
  /** Take every listener, the slash menu and the figure bar back
      off the page. React unmounts; the old Studio never did. */
  destroy(): void;
}

export function createEditor(options: {
  root: HTMLElement;
  onChange?: () => void;
  lang?: () => string | undefined;
  toast?: (message: string) => void;
  pickPhoto?: () => void;
  onSave?: () => void;
  onPublish?: () => void;
}): EditorHandle;
