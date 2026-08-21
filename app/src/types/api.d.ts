/** What every endpoint on this site answers with, at minimum.

    `_lib/http.ts` writes `{ ok: true, ... }` or
    `{ ok: false, reason }`, and `status` is added below so a
    caller can tell a 404 from a 400 without a second argument. */
export interface ApiReply {
    ok?: boolean;
    reason?: string;
    status?: number;
    [key: string]: unknown;
}
/** How many of each reaction a piece has. */
export type Counts = Record<string, number>;
export interface ApiOptions {
    method?: string;
    body?: unknown;
    timeout?: number;
}
/** null means "not available", never an exception to handle. */
export declare function api(path: string, { method, body, timeout }?: ApiOptions): Promise<ApiReply | null>;
export declare function backendReady(): Promise<boolean>;
export declare const getArticles: () => Promise<unknown[] | null>;
export declare const getArticle: (slug: string) => Promise<unknown | null>;
export declare const getQuestions: (slug: string) => Promise<unknown[] | null>;
export declare const search: (q: string) => Promise<unknown[] | null>;
export declare const ask: (payload: unknown) => Promise<ApiReply | null>;
export declare const subscribe: (payload: unknown) => Promise<ApiReply | null>;
export declare const sendEnquiry: (payload: unknown) => Promise<ApiReply | null>;
export declare const react: (slug: string, kind: string) => Promise<ApiReply | null>;
export declare const reactions: (slug: string) => Promise<Counts | null>;
export declare function uploadMedia(blob: Blob, slug: string): Promise<{
    url?: string;
} | null>;
export declare const listMedia: (slug?: string) => Promise<ApiReply | null>;
export declare const notion: {
    status: () => Promise<ApiReply | null>;
    pages: (q?: string) => Promise<ApiReply | null>;
    page: (id: string) => Promise<ApiReply | null>;
};
export declare const auth: {
    me: () => Promise<ApiReply | null>;
    params: () => Promise<ApiReply | null>;
    setup: (payload: unknown) => Promise<ApiReply | null>;
    login: (payload: unknown) => Promise<ApiReply | null>;
    logout: () => Promise<ApiReply | null>;
};
/** Count a page view. Fire-and-forget: the reader never waits for it,
    and what's recorded is a path and a date, nothing else. */
export declare function countView(path?: string): void;
