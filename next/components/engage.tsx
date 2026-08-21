"use client";

/* ============================================================
   engage.tsx: what a reader can do besides read.

   Two things under a piece: a row of three reactions, and a
   moderated question box with the questions already answered
   above it.

   ---- it is allowed to not exist ----

   `backendReady()` first, and nothing is drawn if the answer is
   no. That is not defensiveness: this site runs without its
   database, every article still reads, and a reaction row that
   cannot record anything is worse than no row.

   ---- one reaction per reader per piece ----

   `reacted:<slug>` in localStorage, and it is the whole of the
   rule. Not an account, not a cookie, not a fingerprint: what is
   recorded on the server is a number, and what is recorded here
   is that this browser has already added to it. A reader who
   clears their storage can press again, and that is the right
   trade for asking nothing of them.

   ---- what this replaces ----

   `archive/modules/engage.js`, 186 lines, dynamically imported by
   `app.js` on `/insights/` paths and appending itself into the
   article it found by selector.

   AND IT COUNTED EVERY VIEW TWICE. `initDynamic()` in `app.js`
   calls `countView()` for every page on the site and then imports
   this module, whose top level called `countView()` again, so an
   insights piece posted `signals/view` twice per load and a
   cooking or travel piece posted it once. The numbers were not
   just high, they were high for one section and not the others,
   which is worse: nothing in them was comparable. There is no
   `countView()` here. The shell counts a view; a component about
   reactions does not.

   ---- and it is insights-only, which is not this file's doing ----

   `app.js` imported this on `/insights/` and nowhere else, so a
   cooking or travel piece has never had reactions or a question
   box. The route decides that now, in the same place and the same
   way, because a port that quietly turned the feature on for two
   more sections would not be a port. Whether they should have it
   is a decision somebody can take on purpose.
   ============================================================ */

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { Button } from "./ui/button";
import { Field, TextArea } from "./ui/field";
import { runtimeModule } from "./account/runtime";

type ApiModule = typeof import("/api.js");
const apiModule = () => runtimeModule<ApiModule>("/api.js");

/** One question, as `/api/questions` answers it. Only what is
    drawn: the endpoint sends no email address and this asks for
    none. */
interface Question {
  id?: number;
  name?: string | null;
  body: string;
  answer?: string | null;
}

const REACTIONS = [
  { kind: "helpful", label: "This helped", icon: "✓" },
  { kind: "confusing", label: "Lost me somewhere", icon: "?" },
  { kind: "more", label: "Go deeper on this", icon: "+" },
] as const;

/** What the line under the question box is saying. */
type Said = { text: string; bad?: boolean } | null;

/* ============================================================
   The three reactions
   ============================================================ */

function Reactions({ slug }: { slug: string }) {
  const key = `reacted:${slug}`;
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [chosen, setChosen] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    /* Read on mount rather than during render: what this browser
       has already pressed is not something the server knows, and
       reading it while rendering is how the markup React adopts
       stops matching the markup it was given. */
    setChosen(localStorage.getItem(key));
    void apiModule()
      .then((m) => m.reactions(slug))
      .then((got) => { if (alive && got) setCounts(got); })
      .catch(() => {});
    return () => { alive = false; };
  }, [key, slug]);

  const press = useCallback(async (kind: string) => {
    if (localStorage.getItem(key)) return;      // one per reader, per piece
    localStorage.setItem(key, kind);
    setChosen(kind);
    try {
      const { react } = await apiModule();
      const result = await react(slug, kind);
      if (result?.counts) setCounts(result.counts as Record<string, number>);
    } catch { /* the press is recorded here either way */ }
  }, [key, slug]);

  return (
    <div className="engage-block">
      <span className="mono section-label">Was this any use?</span>
      <div className="react-row">
        {REACTIONS.map(({ kind, label, icon }) => (
          <button
            key={kind}
            className="react"
            type="button"
            data-kind={kind}
            aria-pressed={chosen === kind ? "true" : undefined}
            onClick={() => void press(kind)}
          >
            <span className="ic">{icon}</span>
            <span>{label}</span>
            <b>{counts[kind] ? String(counts[kind]) : ""}</b>
          </button>
        ))}
      </div>
      <p className="muted" style={{ fontSize: "0.84rem", marginTop: "10px" }}>
        Anonymous: it records a number and nothing about you.
      </p>
    </div>
  );
}

/* ============================================================
   The questions already answered
   ============================================================ */

function Answered({ questions }: { questions: Question[] }) {
  return (
    <div className="engage-block">
      <span className="mono section-label">Questions readers asked</span>
      <div className="qa-list">
        {questions.map((q, i) => (
          <article className="qa" key={q.id ?? i}>
            <p className="q">
              <span className="mono who">{q.name?.trim() || "A reader"}</span>
              <span>{q.body}</span>
            </p>
            {q.answer ? (
              <div className="a">
                <span className="mono who">Rony</span>
                <p>{q.answer}</p>
              </div>
            ) : null}
          </article>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   Asking one
   ============================================================ */

function Ask({ slug }: { slug: string }) {
  const [said, setSaid] = useState<Said>(null);
  const [sent, setSent] = useState(false);

  const send = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget));
    if (String(data.body).trim().length < 10) {
      setSaid({ text: "A bit more detail and I can actually answer it.", bad: true });
      return;
    }
    setSaid({ text: "Sending…" });
    try {
      const { ask } = await apiModule();
      const result = await ask({ ...data, slug });
      if (result?.ok) { setSent(true); return; }
      throw new Error("refused");
    } catch {
      setSaid({ text: "That didn't send. Email i@reiad.co.uk instead?", bad: true });
    }
  };

  return (
    <div className="engage-block">
      <span className="mono section-label">Ask about this piece</span>
      {sent ? (
        <p className="verdict">
          Got it. I read every one of these. If it&apos;s a question other people
          will have, the answer appears on this page: otherwise you&apos;ll get an
          email, if you left one.
        </p>
      ) : (
        <form className="ask-form" onSubmit={send}>
          {/* THE BOXES ARE THE LIBRARY'S, which is the one thing
              here that is not what the module did. It wrapped a
              bare `<input>` in a `<label>` with a `<span>` in it,
              which is the eleventh-hand-written-input shape
              `ui/field.tsx` exists to end: `check-components.ts`
              is a ratchet and a new one of those may not be
              added. What was a placeholder standing in for a
              label is a label now, and the two things a reader is
              owed, that the name may be published and the email
              never is, are hints rather than grey text that
              disappears the moment they type. */}
          <TextArea
            id="ask-body" name="body" rows={3} required
            label="Your question"
            placeholder={"Ask about anything in this piece, if it's a good question"
              + " it usually means the writing wasn't clear enough."}
          />
          <div className="field-row">
            <Field
              id="ask-name" type="text" name="name"
              label="Name (optional)" hint="Shown if I publish the answer"
            />
            <Field
              id="ask-email" type="email" name="email"
              label="Email (optional)" hint="Only so I can reply: never shown"
            />
          </div>
          {/* Honeypot: invisible to people, irresistible to bots.
              `functions/_lib/input.ts` is what reads it, and
              `scripts/input.test.ts` holds it to still being read. */}
          <input
            type="text" name="website" tabIndex={-1} autoComplete="off"
            aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}
          />
          <Button kind="solid" type="submit">Send it</Button>
          {said ? (
            <p className={`gate-msg mono${said.bad ? " err" : ""}`} role="status">
              {said.text}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}

/* ============================================================
   The whole of it
   ============================================================ */

export function Engage({ slug }: { slug: string }) {
  /* `null` until the answer is known, so that "not asked yet" and
     "asked, and there is no database" are different states. The
     second draws nothing at all. */
  const [ready, setReady] = useState<boolean | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const { backendReady, getQuestions } = await apiModule();
        const up = await backendReady();
        if (!alive) return;
        setReady(up);
        if (!up) return;
        const got = await getQuestions(slug);
        if (alive && Array.isArray(got)) setQuestions(got as Question[]);
      } catch {
        if (alive) setReady(false);
      }
    })();
    return () => { alive = false; };
  }, [slug]);

  if (!ready) return null;

  return (
    <section className="engage">
      <Reactions slug={slug} />
      {questions.length ? <Answered questions={questions} /> : null}
      <Ask slug={slug} />
    </section>
  );
}
