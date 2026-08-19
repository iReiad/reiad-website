export declare const KEEP_CLASSES: Set<string>;
/** Turn arbitrary HTML into the small set of tags the site styles. */
export declare function sanitize(html: string): string;
/** Plain text → paragraphs, keeping blank-line breaks. */
export declare function textToHtml(text: string): string;
export declare function escapeHtml(s: unknown): string;
export declare function slugify(s: string): string;
export interface ReadingStats {
    words: number;
    photos: number;
    minutes: number;
}
export declare function readingStats(html: string): ReadingStats;
export declare const CAPTION_HINT: string;
/** Captions the writer never touched shouldn't ship. */
export declare function dropUntouchedCaptions(html: string): string;
export declare const WORDS: Record<"en" | "bn", Record<string, string>>;
/** Build the <figure> that goes into the editor. */
export declare function figureHtml({ url, width, height }: {
    url: string;
    width: number;
    height: number;
}, alt?: string): string;
export interface ProcessedImage {
    url: string;
    width: number;
    height: number;
    type: string;
}
/** File/Blob → a downscaled WebP as a data URL, for the editor's
    own preview. Publishing turns it into a /media path. */
export declare function processImage(file: Blob): Promise<ProcessedImage>;
/** One of the blocks a long read is made of. `key` is present only
    for the ones a toolbar button can name, and every block carries
    exactly one of `run` and `html`. */
export interface Block {
    label: string;
    hint: string;
    key?: string;
    run?: () => void;
    html?: () => string;
}
export interface EditorOptions {
    /** The contenteditable. Handed in rather than looked up, which
        is the whole of what made this file possible. */
    root: HTMLElement;
    /** Something changed, redraw. */
    onChange?: () => void;
    /** "en" or "bn", for the copy inside a block. */
    lang?: () => string | undefined;
    toast?: (message: string) => void;
    /** Open the file picker. */
    pickPhoto?: () => void;
    /** Ctrl+S. */
    onSave?: () => void;
    /** Ctrl+Enter. */
    onPublish?: () => void;
}
/** What the page is handed. Named, because both Studios import
    this type by name from `/editor.js`. */
export interface EditorHandle {
    /** The blocks, for a toolbar that wants to draw its own buttons. */
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
/** Wire a contenteditable into a writing surface. */
export declare function createEditor({ root, onChange, lang, toast, pickPhoto, onSave, onPublish, }: EditorOptions): EditorHandle;
