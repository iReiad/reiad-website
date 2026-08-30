import { siteLayout } from "../../../../components/page";

/* `unlisted` in shared/nav.ts, so the rail and the footer skip it and
   `current` still marks it if somebody arrives. ADMIN.md is the
   plan for what goes inside.

   INSIDE `(panel)/` AND NOT AT `/admin/`, which is the same
   arrangement `/portfolio/(hub)/` and `/tools/(hub)/` are in and
   for the same reason. A layout at `/admin/` wraps everything
   under it, so `/admin/research` got this shell AND its own: two
   rails, two top bars, two boot scripts, and `margin-left:
   var(--rail-w)` applied twice, which took 268px off the desk's
   width. It rendered perfectly, because the two rails are
   `position: fixed` and sit exactly on top of each other.
   `check-routes.ts` asks now. */
export default siteLayout({
  current: "admin",
  skip: "Skip to the panel",
});
