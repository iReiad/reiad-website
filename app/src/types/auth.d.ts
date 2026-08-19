/** Whether the owner came through the server's gate or the
    browser's. The desk has nothing it could show when it is
    false, which is the whole reason it is answered. */
export interface Owner {
    server: boolean;
}
export declare function requireOwner(protectedRoot: HTMLElement): Promise<Owner>;
/** Sign out, server session if there is one, local flag either way. */
export declare function lock(): Promise<void>;
