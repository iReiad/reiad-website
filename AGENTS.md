# Quick start for Codex

Read this first. Use targeted searches instead of loading whole directories.

- Read `CLAUDE.md` for constraints. Use `rg -n` on `MAP.md` for only the feature being changed; do not load the full map or handbook. This replaces the older full-map reading instruction.
- Homepage: `next/app/(home)/page.tsx`.
- Public course discovery: `next/app/(site)/skills/(hub)/page.tsx` and `next/components/course-discovery.tsx`.
- Subject hubs: `next/components/school-hub-page.tsx`; lessons: routes under `next/app/[section]/`.
- Shared cards/buttons: `next/components/deck.tsx`, `next/components/ui/button.tsx`.
- Theme: `next/styles/site.css`. Navigation and subject colours: `shared/nav.ts`. Counts/curricula: `shared/content.ts`.
- Learner progress: `next/components/home/board.tsx`, `next/lib/progress.ts`. Preserve all storage keys.
- Private third-party courses: `next/components/course-shell.tsx`. Never expose their catalogue or bypass admin access.
- APIs/accounts/deployment: inspect only if the task changes them. Public UI work generally does not need those files.
- Reuse installed dependencies. Avoid recursive home-directory searches, whole-repository dumps, lockfile reads, and repeated unchanged checks.
- Start with `git status --short`. Read only the changed route, component and relevant CSS ranges. Search before expanding context.
- After CSS changes: `node scripts/build-fallback.ts`; update the service-worker version and manifest. New files require `node scripts/build-map.ts`.
- Validate with `node scripts/check-all.ts --changed`; run the full suite once before a PR. Use browser checks for the actual affected journey.

This is a navigation aid, not a cache of file contents. Verify current source before editing. Keep this guide short and update pointers when moving files.
