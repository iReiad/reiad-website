/* `/app.js`, the furniture: header, menu, palette, theme. See
   ./README.md. Only the two helpers the desk calls are declared;
   the rest of that file runs on import and exports nothing this
   app needs. */

/** One line at the bottom of the screen, gone after a moment. */
export function toast(message: string): void;

/** Copy, then say so. Falls back to a hidden textarea where the
    clipboard API is not available, which is any insecure context. */
export function copyText(text: string, message?: string): Promise<void>;
