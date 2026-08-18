/** Rename the last crumb, for a page whose own name arrives after
    this ran.

    The course section is the only caller and the reason is in the
    branch above: its pages are shells, so the title the server
    sent is generic and the real one comes down with the
    catalogue. Rewrites the JSON-LD copy too, or the trail a
    crawler reads would disagree with the trail on the page. */
export declare function setHere(name: string): void;
export declare function initCrumbs(): void;
