import { type Piece } from "/pieces.js";
import "/prefs.js";
declare global {
    interface Navigator {
        /** Chrome's, and not in the DOM library. Optional because a
            browser that has not shipped it answers undefined, which is
            the case `initSpeculation()` below has to survive. */
        readonly connection?: {
            readonly saveData?: boolean;
        };
    }
}
export declare function addToSearchIndex(pieces: Piece[]): void;
/** Fire-and-forget toast using the popover API. */
export declare function toast(message: string): void;
/** Copy text, with a fallback for insecure contexts. */
export declare function copyText(text: string, message?: string): Promise<void>;
/** Download a Blob (or string) as a file. */
export declare function download(filename: string, data: Blob | string, type?: string): void;
