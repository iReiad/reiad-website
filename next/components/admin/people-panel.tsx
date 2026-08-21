"use client";

/* ============================================================
   admin/people-panel.tsx: the one panel that needs both.

   ADMIN.md §3 D. A person on this site is two records that do not
   know about each other: a Supabase account, and a set of rows in
   D1 written under their name. `profiles` is answered by row-level
   security to a reader's own bearer; `comments` is answered by the
   Studio passphrase over D1. A cookie is not a JWT and D1 has no
   notion of a Supabase reader, so the join can only happen HERE,
   in a browser holding both, and that is the whole reason this
   panel is last and the reason §1's "together" has a real answer.

   ---- what the join key actually is ----

   `comments.author_id`, and it is the ONLY one this database
   offers. It is written from a verified access token, so it names
   an account rather than a typed string. `author_name` beside it
   is a COPY of the display name at the time of writing, which is
   `shared/rows.ts` doing its job: D1 holds what a signed-out
   reader needs to draw the page and Supabase holds who people
   are.

   Questions and enquiries are NOT joinable, and saying so on the
   page matters more than showing them. Both carry a name and an
   email typed into a form by anybody, signed in or not, and
   neither carries an id. Matching them by name would be matching
   on a string anybody can type, which is a worse answer than no
   answer on a page where a wrong one is expensive.

   ---- and the absence is the design ----

   ADMIN.md §3 D asks for `days-active` and for what somebody has
   saved. Neither is readable from here and neither should be:
   `progress` and `library` are `auth.uid() = user_id`, so they
   answer the reader's own token and nothing else, and the only
   key that would open them is a service-role key this project
   does not hold. So this panel says what it cannot show rather
   than drawing an empty column, which is the same rule as never
   drawing a locked panel as an empty one.

   `profiles` is the one table whose select policy is `using
   (true)`, and that is why the account half needs a BEARER rather
   than an admin: what the account opens here is row-level
   security's answer, not a privilege. `admins` is the other half
   of §3 D's question and it answers only about YOU, by policy,
   which is exactly what stops an admin being minted from a
   browser and exactly why this cannot list the others.
   ============================================================ */

import { useEffect, useState } from "react";
import { Surface } from "../ui/surface";
import { StatRow, StatTile } from "../ui/stat";
import { Row } from "./row";
import { runtimeModule } from "../account/runtime";
import type { CommentRow } from "@reiad/shared/rows";

type AccountModule = typeof import("/account.js");

/** One person's comments, as `/api/comments?by=author` counts
    them. The two identifying fields are picked out of `CommentRow`
    rather than spelled again: one vocabulary, one place. */
type AuthorTally = Pick<CommentRow, "author_id" | "author_name"> & {
  comments: number;
  live: number;
  pending: number;
  binned: number;
  /** ISO, of their latest one. */
  last_at: string;
};

/** The columns this panel selects out of `profiles`, spelled the
    way the table spells them. Everything in that row is already
    world readable, which is the policy the comment above explains;
    nothing else about a person is asked for anywhere here. */
interface ProfileRow {
  id: string;
  display_name: string;
  created_at: string;
  updated_at: string;
  following: string[] | null;
  pace: string;
  setup_at: string | null;
}

const PROFILE_COLUMNS
  = "id,display_name,created_at,updated_at,following,pace,setup_at";

/** Both lists stop here, and both stores are asked for their real
    totals separately, so a capped list can never be read as one.
    The same number as the queue's, for the same reason. */
const LIMIT = 200;

/** One row of the panel: an account, its comments, or one without
    the other. A person with no profile row is the thing only a
    join can find, and it is usually an account that has been
    erased: `profiles` cascades from `auth.users` and D1 keeps the
    words. */
interface Person {
  id: string;
  profile: ProfileRow | null;
  tally: AuthorTally | null;
}

type PassState = "loading" | "locked" | "error" | "ok";
type AccountState = "loading" | "signedout" | "error" | "ok";

const day = (iso: string | null | undefined): string => (iso ?? "").slice(0, 10);

/** `Content-Range: 0-24/431`, which is what `Prefer: count=exact`
    buys. Null when the header is not exposed, and the caller then
    states no total at all rather than passing a capped list off as
    one. */
function totalFrom(header: string | null): number | null {
  /* `*` where PostgREST was not asked to count, and an empty
     string where the header is malformed. `Number("")` is 0, which
     would draw a site with no accounts on it, so the emptiness is
     tested before the number is. */
  const after = (header ?? "").split("/")[1] ?? "";
  if (!after) return null;
  const n = Number(after);
  return Number.isFinite(n) ? n : null;
}

export function PeoplePanel() {
  const [pass, setPass] = useState<PassState>("loading");
  const [account, setAccount] = useState<AccountState>("loading");

  const [authors, setAuthors] = useState<AuthorTally[]>([]);
  const [commentTotals, setCommentTotals] = useState({ authors: 0, comments: 0 });
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [profileTotal, setProfileTotal] = useState<number | null>(null);
  const [myId, setMyId] = useState<string | null>(null);
  const [myAdminRow, setMyAdminRow] = useState(false);

  useEffect(() => {
    let live = true;

    /* ---- D1, behind the passphrase ---- */
    const d1 = async (): Promise<void> => {
      try {
        const res = await fetch("/api/comments?by=author",
          { headers: { accept: "application/json" } });
        if (!live) return;
        /* 401 is no session, 403 is a session that is not an
           admin. Both mean the passphrase is not held, and neither
           is an error worth a red state. */
        if (res.status === 401 || res.status === 403) { setPass("locked"); return; }
        if (!res.ok) { setPass("error"); return; }
        const data = await res.json() as {
          authors?: AuthorTally[];
          totals?: { authors: number; comments: number };
        };
        setAuthors(Array.isArray(data.authors) ? data.authors : []);
        setCommentTotals(data.totals ?? { authors: 0, comments: 0 });
        setPass("ok");
      } catch { if (live) setPass("error"); }
    };

    /* ---- Supabase, as the reader ---- */
    const supabase = async (): Promise<void> => {
      try {
        const acc = await runtimeModule<AccountModule>("/account.js");
        const me = acc.current();
        const bearer = me ? await acc.token() : null;
        if (!live) return;
        if (!bearer) { setAccount("signedout"); return; }
        setMyId(me?.id ?? null);

        const headers = {
          apikey: acc.SUPABASE_KEY,
          Authorization: `Bearer ${bearer}`,
          accept: "application/json",
        };

        /* No `id=eq.<me>` here, and that is the deliberate
           opposite of `getProfile()`, where the missing filter was
           a real bug: this read WANTS the whole table, and the
           policy is what makes that legal rather than an
           oversight. Anything drawing ONE person's row still needs
           the filter, for the reason written out at length beside
           that function. */
        const rows = await fetch(
          `${acc.SUPABASE_URL}/rest/v1/profiles?select=${PROFILE_COLUMNS}`
          + `&order=created_at.desc&limit=${LIMIT}`,
          { headers: { ...headers, Prefer: "count=exact" } });
        if (!live) return;
        if (!rows.ok) { setAccount("error"); return; }
        const list = await rows.json() as ProfileRow[];
        setProfiles(Array.isArray(list) ? list : []);
        setProfileTotal(totalFrom(rows.headers.get("content-range")));

        /* The one question `admins` will answer, asked with the
           reader's own bearer exactly as the Worker asks it. An
           empty answer is not "no admins": it is "not this
           reader", and somebody listed in wrangler.toml has no row
           here at all. */
        const mine = await fetch(
          `${acc.SUPABASE_URL}/rest/v1/admins?select=user_id&limit=1`, { headers });
        if (!live) return;
        const held = mine.ok ? await mine.json() as unknown[] : [];
        setMyAdminRow(Array.isArray(held) && held.length > 0);
        setAccount("ok");
      } catch {
        /* `/account.js` is served by the other Worker, so it is
           absent under a bare `next start`. "Not signed in" is the
           honest answer to that, not an unhandled rejection. */
        if (live) setAccount("signedout");
      }
    };

    void d1();
    void supabase();
    return () => { live = false; };
  }, []);

  const waiting = pass === "loading" || account === "loading";
  const both = pass === "ok" && account === "ok";

  /* ---- the join, and it happens here because it can happen
     nowhere else ---- */
  const byId = new Map<string, Person>();
  if (both) {
    for (const profile of profiles) byId.set(profile.id, { id: profile.id, profile, tally: null });
    for (const tally of authors) {
      const found = byId.get(tally.author_id);
      if (found) found.tally = tally;
      else byId.set(tally.author_id, { id: tally.author_id, profile: null, tally });
    }
  }
  const people = [...byId.values()].sort((a, b) =>
    (b.tally?.comments ?? 0) - (a.tally?.comments ?? 0)
    || (b.profile?.created_at ?? "").localeCompare(a.profile?.created_at ?? ""));

  /* Every figure below either IS a total or says that it is not.
     ADMIN.md §0: an admin panel is the one page where a wrong
     number is expensive, and a count drawn off a capped list is a
     wrong number that looks exactly like a right one. `profileTotal`
     comes from PostgREST's own exact count and the two comment
     totals from SQL, so only the third tile is derived, and it is
     the one that has to say so. */
  const accountsCapped = profileTotal === null
    ? profiles.length >= LIMIT
    : profileTotal > profiles.length;
  const authorsCapped = commentTotals.authors > authors.length;
  const orphans = people.filter((p) => !p.profile).length;
  const accounts: string | number = profileTotal !== null
    ? profileTotal
    : accountsCapped ? `${LIMIT}+` : profiles.length;

  return (
    <Surface material="pane" className="ad-panel">
      <h3>People</h3>
      <p className="ad-quiet">
        An account in Supabase and the comments written under it in D1, joined
        on the one field that names both: a comment&apos;s author id, which is
        written from a verified token rather than typed.
      </p>

      {waiting ? <p className="ad-quiet" role="status">এক মুহূর্ত…</p> : null}

      {/* Two credentials, so a missing one has to say WHICH. An
          empty list here would read exactly like a site with no
          readers on it, which is the failure app/desk.test.ts
          exists for. */}
      {!waiting && !both ? (
        <>
          <div className="ad-rows">
            <Row label="The passphrase, for the comments"
                 state={pass === "ok" ? "up" : pass === "error" ? "down" : "unset"}
                 note={pass === "ok" ? "held"
                   : pass === "error" ? "/api/comments did not answer"
                     : "not held: sign in at the Studio"} />
            <Row label="A reader bearer, for the accounts"
                 state={account === "ok" ? "up" : account === "error" ? "down" : "unset"}
                 note={account === "ok" ? "held"
                   : account === "error" ? "Supabase did not answer"
                     : "not signed in: sign in to your account"} />
          </div>
          <p className="ad-quiet">
            Both are needed and neither can stand in for the other. Row-level
            security answers a reader&apos;s own token, and the passphrase is a
            cookie rather than a token; D1 has never heard of a Supabase
            reader. Nothing on this page can mint either one, so the two
            sign-ins are at <a href="/studio">the Studio</a> and{" "}
            <a href="/account">your account</a>.
          </p>
        </>
      ) : null}

      {both ? (
        <>
          <StatRow>
            <StatTile label="Accounts" value={accounts}
                      note={accountsCapped
                        ? `the newest ${profiles.length} are listed below`
                        : "all of them listed below"} />
            <StatTile label="Have commented" value={commentTotals.authors}
                      note={`${commentTotals.comments} comments in all`
                        + (authorsCapped ? `, busiest ${authors.length} listed` : "")} />
            <StatTile label="Authors with no account row" value={orphans}
                      note={accountsCapped || authorsCapped
                        ? "across the rows listed, not across both stores"
                        : "usually an account that has been erased"} />
          </StatRow>

          {people.length === 0 ? (
            <p className="ad-quiet">
              No accounts and no comments. Both halves answered; there is
              nobody here yet.
            </p>
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0">
              {people.map((person) => {
                const t = person.tally;
                const p = person.profile;
                const follows = (p?.following ?? []).join(", ");
                return (
                  <li key={person.id}
                      className="grid gap-2 rounded-[var(--radius-sm)] border
                                 border-hairline p-3">
                    <p className="m-0 flex flex-wrap items-baseline justify-between gap-2">
                      <strong className="min-w-0">
                        {p?.display_name || t?.author_name || "no name"}
                        {person.id === myId ? " (you)" : ""}
                      </strong>
                      <span className="mono text-[var(--t-2)] text-ink-soft">
                        {p ? `joined ${day(p.created_at)}` : "no account row"}
                      </span>
                    </p>

                    <p className="m-0 text-ink-soft">
                      {t
                        ? `${t.comments} comment${t.comments === 1 ? "" : "s"}: `
                          + `${t.live} live, ${t.pending} waiting, ${t.binned} binned. `
                          + `Last on ${day(t.last_at)}.`
                        : "No comments."}
                      {p && p.display_name && t && t.author_name !== p.display_name
                        ? ` Wrote as ${t.author_name}.`
                        : ""}
                    </p>

                    <p className="m-0 text-[var(--t-2)] text-ink-soft">
                      {p
                        ? `${follows ? `Following ${follows}` : "Following nothing"}`
                          + `${p.pace ? `, practising ${p.pace}` : ""}`
                          + `. ${p.setup_at ? "Settings answered" : "Settings not answered yet"}.`
                        : "Comments in D1 under an id Supabase does not have."}
                      {person.id === myId && myAdminRow
                        ? " An admin: this account has a row in the admins table."
                        : ""}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}

        </>
      ) : null}

      {/* Said in every state, including the locked one. What this
          panel will not show is a decision rather than a gap, and a
          decision that only appears once everything is working is
          one nobody reads on the day it matters. */}
      <p className="ad-quiet">
        Nobody&apos;s progress, notes, targets or routine is on this page:
        row-level security answers those tables to the reader&apos;s own token
        and to nothing else, and the only thing that could open them from here
        is a service-role key this project does not hold and is not going to.
      </p>

      <p className="ad-quiet">
        Three more things are absent for reasons of their own. Questions and
        enquiries carry a name and an email typed into a form rather than an
        author id, so nothing can attach one of them to an account without
        matching on a string anybody can type. An email address lives in
        Supabase&apos;s own user table, which nothing on this site reads. And
        whether anybody else is an admin cannot be shown: the admins table
        answers a reader about their own row and nobody else&apos;s, which is
        the property that makes an admin impossible to mint from a browser, and
        the other record of who is one is a list in the Worker&apos;s own
        configuration that no browser can read either.
      </p>

      <p className="ad-quiet">
        So &ldquo;when they last turned up&rdquo; here is the date of their
        last comment and nothing more. The other candidate was days-active,
        which is one of the keys behind the wall above.
      </p>
    </Surface>
  );
}
