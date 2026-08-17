/** Every checkpoint ticked in one school. */
export declare function checkpointsOf(school: string): Set<string>;
/** How many checkpoints this school holds ticks for, and in how
    many lessons. The account page says both, because "nine
    checkpoints" and "nine checkpoints across three lessons" are
    different facts and the second is the one worth reading. */
export interface CheckpointStats {
    /** How many checkpoints this school holds ticks for. */
    done: number;
    /** In how many distinct lessons. */
    lessons: number;
}
export declare function checkpointStats(school: string): CheckpointStats;
/** Every lesson on the page, which is one or none. */
export declare function initCheckpoints(root?: ParentNode): number;
