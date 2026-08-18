/* A date the way this page has always written one: "3 Aug 2026",
   and an empty string rather than "Invalid Date" for a row whose
   timestamp did not survive whatever wrote it.

   Its own file because three sections of the account page show a
   date and they have to agree: a reading list saying "3 Aug" and
   a scenario saying "03/08/2026" is two answers to one question,
   which is what this whole port is for. */
export const when = (iso: string | null | undefined): string => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.valueOf())
    ? ""
    : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
};
