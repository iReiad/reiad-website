/* ============================================================
   Preflight.tsx: before it goes out.

   An empty editor is not a problem worth shouting about yet, so
   the panel does not appear until something has been typed. After
   that it is always on screen: the whole point is that these are
   checked every time rather than when somebody remembers.
   ============================================================ */

import { LEVEL_LABEL, type Issue } from "./preflight.ts";

export function Preflight({ issues, started }: { issues: Issue[]; started: boolean }) {
  const errors = issues.filter((i) => i.level === "error");

  return (
    <div
      className="preflight"
      id="preflight"
      hidden={!started}
      data-state={errors.length ? "blocked" : "clear"}
    >
      <div className="pane-bar">
        <span className="mono">Before it goes out</span>
        <span className="mono" id="preflight-summary">
          {errors.length ? `${errors.length} to fix`
            : issues.length ? `${issues.length} note${issues.length === 1 ? "" : "s"}`
            : "All clear"}
        </span>
      </div>
      <ul id="preflight-list">
        {issues.map((issue) => (
          <li data-level={issue.level} key={`${issue.level}:${issue.text}`}>
            <span className="mono">{LEVEL_LABEL[issue.level]}</span>
            <span>{issue.text}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
