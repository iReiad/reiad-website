/** px on the long side: plenty for a blog, and it caps the bytes. */
export declare const MAX_EDGE = 1600;
export declare const QUALITY = 0.82;
export declare const isDataUrl: (src: string | null | undefined) => boolean;
/** Is this photo on somebody else's server? */
export declare const isOffSite: (src: string | null | undefined) => boolean;
/** Already ours, so there is nothing to do with it. */
export declare const isHosted: (src: string | null | undefined) => boolean;
/**
 * A URL the browser is actually allowed to read the bytes of.
 *
 * A same-origin path is fine. A cross-origin one is not: fetching
 * it to resize is blocked by CORS, which used to mean the upload
 * failed and the article silently kept an image hotlinked to a
 * server we do not control. Those go through /api/media/fetch,
 * which hands the bytes back same-origin.
 */
export declare const fetchableSrc: (src: string) => string;
/** A data: URL as a Blob, without a network request. See above. */
export declare function dataUrlToBlob(src: string): Blob;
/** The bytes of one photo, by whichever route its src allows. */
export declare function photoBytes(src: string): Promise<Blob>;
/** Resized and re-encoded, so a phone photo does not arrive at 6 MB. */
/** A photo, resized, with the size it ended up. */
export interface Encoded {
    blob: Blob;
    width: number;
    height: number;
}
export declare function encodeImage(source: ImageBitmapSource): Promise<Encoded>;
/**
 * Move every photo in a body out to /media, and hand back the
 * rewritten HTML.
 *
 * A photo that will not upload is LEFT WHERE IT IS and counted.
 * Dropping a picture out of somebody's article because a request
 * failed would be a far worse bug than the one this file is about.
 */
/** What `uploadMedia` in `/api.js` hands back. Declared here as a
    parameter rather than imported, because this module is handed
    the uploader rather than reaching for it: the Studio and the
    desk pass their own, and a test can pass one that fails. */
export type Upload = (blob: Blob, slug: string) => Promise<{
    url?: string;
    reason?: string;
} | null>;
export interface Hosted {
    html: string;
    uploaded: number;
    failed: number;
}
export declare function hostPhotosIn(html: string, slug: string, uploadMedia: Upload, onProgress?: (done: number, total: number) => void): Promise<Hosted>;
