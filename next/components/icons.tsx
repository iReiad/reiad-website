/* ============================================================
   icons.tsx: one drawing set for the shell and the cards.

   ---- where the paths come from ----

   Most of them are already in this repository. The four schools
   each keep an `icons.js`, and `scripts/build-school-icons.mjs`
   copies those into `lib/school-icons.ts` because `next/` cannot
   import above its own directory. So anything the money school
   already draws is taken from there rather than redrawn: a
   second wallet that is nearly the same wallet is how two parts
   of one site stop looking like one site.

   What is added below is the handful the shell needs and no
   lesson ever did: a house, a magnifier for the palette, a half
   moon for the theme, a chevron, a burger, a cross.

   ---- why they are strings ----

   Same reason `school-icons.ts` holds strings: they are the
   inside of an `<svg>`, and `check-next.mjs` compares the
   generated copy against the browser module character for
   character. The ones added here are JSX-free for consistency
   with the ones that are not.
   ============================================================ */

import { SCHOOL_ICONS } from "../lib/school-icons";
import type { IconName } from "../lib/nav";

/** The ones no school draws. */
const SHELL: Partial<Record<IconName, string>> = {
  home: `<path d="M4 11 12 4l8 7"/><path d="M6.5 9.5V20h11V9.5"/><path d="M10 20v-5h4v5"/>`,
  skills: `<path d="M4 5.5h6v6H4z"/><path d="M14 5.5h6v6h-6z"/><path d="M4 15h6v4.5H4z"/><path d="M17 14.5v6"/><path d="M14 17.5h6"/>`,
  coins: `<ellipse cx="12" cy="6.5" rx="7.5" ry="3"/><path d="M4.5 6.5v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5"/><path d="M4.5 11.5v5c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-5"/>`,
  calculator: `<path d="M5 3.5h14v17H5z"/><path d="M8 7h8v3H8z"/><circle cx="8.7" cy="13.5" r="0.9"/><circle cx="12" cy="13.5" r="0.9"/><circle cx="15.3" cy="13.5" r="0.9"/><circle cx="8.7" cy="17" r="0.9"/><circle cx="12" cy="17" r="0.9"/><path d="M14.6 17h1.6"/>`,
  gauge: `<path d="M3.5 17a8.5 8.5 0 1 1 17 0"/><path d="M12 17 16 10"/><circle cx="12" cy="17" r="1.4"/>`,
  pen: `<path d="M4 20l1.2-4.2L16 5a2.1 2.1 0 0 1 3 3L8.2 18.8 4 20Z"/><path d="M14.2 6.8 17.2 9.8"/>`,
  mail: `<path d="M3.5 6h17v12h-17z"/><path d="m3.5 7 8.5 6 8.5-6"/>`,
  user: `<circle cx="12" cy="8" r="3.6"/><path d="M5 20.5a7 7 0 0 1 14 0"/>`,
  search: `<circle cx="10.8" cy="10.8" r="6.3"/><path d="M15.4 15.4 20.5 20.5"/>`,
  theme: `<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 0 0 16Z" fill="currentColor" stroke="none"/>`,
  chevron: `<path d="M9 5.5 15.5 12 9 18.5"/>`,
  menu: `<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>`,
  close: `<path d="M6 6 18 18"/><path d="M18 6 6 18"/>`,
  spark: `<path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4l-1.9-5.6L4.5 10.9 10.1 9 12 3.5Z"/>`,
  person: SCHOOL_ICONS.deutsch?.person,
};

/** School first, shell second. A name in both is the school's,
    which is the direction that keeps a lesson's heading and the
    sidebar link to it drawing the same thing. */
export const iconInner = (name: string): string =>
  SCHOOL_ICONS.learn?.[name] ?? SHELL[name as IconName] ?? "";

export function Icon({
  name, size = 20, className,
}: {
  name: IconName | string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor"
      strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      className={className}
      dangerouslySetInnerHTML={{ __html: iconInner(name) }}
    />
  );
}
