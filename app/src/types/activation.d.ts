declare global {
    interface Document {
        readonly prerendering?: boolean;
    }
}
/** True while this document is a prerender nobody has opened. */
export declare const isPrerendering: () => boolean;
/** True if this document was EVER prerendered, even if it is now
    activated. Useful for one-shot work that ran too early. */
export declare const wasPrerendered: () => boolean;
/**
 * Run fn once the page is really being looked at.
 *
 * On an ordinary navigation that is immediately. On a prerender
 * it is when the reader clicks the link that was prerendered,
 * which may be never, in which case fn never runs, which is the
 * entire point.
 */
export declare function whenActivated(fn: () => void): void;
