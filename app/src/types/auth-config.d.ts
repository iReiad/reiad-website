/** What the setup screen writes out, and what `auth.ts` reads.
    Not `as const`: the block below is meant to be REPLACED
    wholesale by the one the setup screen prints, so every field
    here is a value the gate compares rather than a literal it
    can be narrowed to. */
export interface AuthConfig {
    configured: boolean;
    salt: string;
    hash: string;
    iterations: number;
    rememberDays: number;
    label: string;
}
export declare const AUTH: AuthConfig;
