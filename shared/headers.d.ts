/* Types for headers.js. See ./README.md. */
export const SECURITY_HEADERS: Record<string, string>;
export function htmlResponse(
  body: string,
  options?: { cache?: string; status?: number },
): Response;
export function securityEntries(): [string, string][];
