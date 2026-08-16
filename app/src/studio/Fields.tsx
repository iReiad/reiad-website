/* ============================================================
   Fields.tsx: everything about the piece that is not the piece.

   Where it goes comes first, because it changes the shape of
   everything under it: the URL, the note at the foot of the page,
   and which hub the piece appears on. The segmented control and
   the list behind it are both built from SECTIONS, so a fourth
   section appears here without this file being touched.

   ---- topics ARE the label ----

   There used to be two fields: a label, which is the small line
   above the headline, and a list of topics, which is what the
   piece is about. They were the same thing typed twice, and they
   drifted: a piece labelled "Explainer · Equities" and tagged
   "Visas, Paperwork" is a piece whose card says one thing and
   whose index says another. One field now, and the line above the
   headline is what it holds.
   ============================================================ */

import { useId, useMemo, useState } from "react";
import { SECTIONS, findSection } from "/content.js";
import { slugify } from "/editor.js";
import { toast } from "../site.ts";
import { MAX_TOPICS, type Fields as FieldValues } from "./piece.ts";

export function Fields({
  fields, setFields, topics, setTopics, known,
}: {
  fields: FieldValues;
  setFields: (patch: Partial<FieldValues>) => void;
  topics: string[];
  setTopics: (list: string[]) => void;
  /** Every topic already in use anywhere on the site, so the field
      suggests the vocabulary that exists rather than inviting a
      fourth spelling of the same word. */
  known: string[];
}) {
  const [typed, setTyped] = useState("");
  const listId = useId();
  const sec = findSection(fields.section);

  /** Add whatever is typed, split on commas so a paste of
      "Visas, Paperwork" becomes two chips rather than one long
      one. Case-insensitive, because "Visas" and "visas" are one
      topic and two chips is how a filter list ends up with both. */
  const addTopics = (text: string) => {
    const wanted = String(text).split(/[,،|]/).map((t) => t.trim()).filter(Boolean);
    const next = [...topics];
    let added = false;
    for (const t of wanted) {
      if (next.some((x) => x.toLowerCase() === t.toLowerCase())) continue;
      if (next.length >= MAX_TOPICS) continue;
      next.push(t);
      added = true;
    }
    if (added) setTopics(next);
    return added;
  };

  const commit = () => {
    if (!typed.trim()) return;
    if (addTopics(typed)) setTyped("");
    else toast(topics.length >= MAX_TOPICS ? "Six topics is plenty." : "Already there.");
  };

  /* The ones worth showing as buttons: what this piece has not got
     already, most useful first, and few enough to read at a
     glance. */
  const offer = useMemo(() => {
    const have = new Set(topics.map((t) => t.toLowerCase()));
    return known.filter((t) => !have.has(t.toLowerCase())).slice(0, 10);
  }, [known, topics]);

  return (
    <div className="studio-fields">
      <fieldset className="seg-field" id="section-field">
        <legend>Where it goes</legend>
        <div className="seg" id="f-section-seg" role="radiogroup" aria-label="Where it goes">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              role="radio"
              data-section={s.id}
              aria-checked={s.id === sec.id}
              data-on={s.id === sec.id ? "" : undefined}
              title={`${s.en}: ${s.mount}`}
              onClick={() => setFields({ section: s.id })}
            >
              {s.id === "insights" ? s.en : s.bn}
            </button>
          ))}
        </div>
        <span className="field-hint" id="section-hint">
          {`${sec.mount}<file>.html · ${sec.blurb}`}
        </span>
      </fieldset>

      <label>Headline
        <input
          type="text" id="f-title"
          placeholder="How the Dhaka Stock Exchange actually works"
          value={fields.title}
          onChange={(e) => setFields({ title: e.target.value })}
        />
      </label>

      <label>Standfirst: one or two sentences under the headline
        <textarea
          id="f-dek" rows={2}
          placeholder="What the DSEX index measures, how a BO account works, and the questions to ask first."
          value={fields.dek}
          onChange={(e) => setFields({ dek: e.target.value })}
        />
      </label>

      <div className="field-row">
        <label>Date
          <input type="date" id="f-date" value={fields.date}
                 onChange={(e) => setFields({ date: e.target.value })} />
        </label>
        <label>Language
          <select id="f-lang" value={fields.lang}
                  onChange={(e) => setFields({ lang: e.target.value })}>
            <option value="en">English</option>
            <option value="bn">বাংলা</option>
          </select>
        </label>
      </div>

      <div className="topic-block">
        <label htmlFor="f-topics">
          Topics: what it is about, and the line above the headline
        </label>
        <div
          className="topic-field" id="topic-field" data-count={topics.length}
          onClick={(e) => {
            if ((e.target as Element).closest(".topic-x")) return;
            (e.currentTarget.querySelector("#f-topics") as HTMLInputElement)?.focus();
          }}
        >
          <span className="topic-chips" id="topic-chips">
            {topics.map((t, i) => (
              <span className="topic-chip" key={t}>
                <span>{t}</span>
                <button
                  type="button" className="topic-x"
                  title={`Remove ${t}`}
                  aria-label={`Remove the topic ${t}`}
                  onClick={() => setTopics(topics.filter((_, j) => j !== i))}
                >✕</button>
              </span>
            ))}
          </span>
          <input
            type="text" id="f-topics" list={listId} spellCheck={false}
            placeholder="Add a topic, then Enter"
            aria-describedby="topic-hint"
            value={typed}
            onChange={(e) => {
              /* Picking from the datalist fires input, not keydown,
                 and the browser says so: a click on a suggestion is
                 an insertReplacementText, ordinary typing is an
                 insertText. Without that test the field committed a
                 chip the moment what was typed happened to match an
                 existing topic, so typing "Visas" turned into a chip
                 at "Visa" and left the writer holding an "s". */
              const how = (e.nativeEvent as InputEvent).inputType;
              const picked = !how || how === "insertReplacementText";
              if (picked && e.target.value.trim() && addTopics(e.target.value)) setTyped("");
              else setTyped(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
                if (!typed.trim()) return;          // Tab still tabs when empty
                e.preventDefault();
                commit();
                return;
              }
              /* Backspace on an empty box takes the last chip, the
                 way every tag field a writer has ever used behaves. */
              if (e.key === "Backspace" && !typed && topics.length) {
                setTopics(topics.slice(0, -1));
              }
            }}
            // Losing focus commits what is typed: nobody expects a
            // half-typed topic to vanish because they clicked the preview.
            onBlur={() => { if (typed.trim() && addTopics(typed)) setTyped(""); }}
          />
        </div>

        <datalist id={listId}>
          {known.map((t) => <option value={t} key={t} />)}
        </datalist>

        {/* What the site already calls things, so the fourth
            spelling of one topic never gets invented. */}
        <div className="topic-suggest" id="topic-suggest"
             hidden={!offer.length || topics.length >= MAX_TOPICS}>
          <span className="mono">Already in use</span>
          <span className="topic-known" id="topic-known">
            {offer.map((t) => (
              <button className="chip" type="button" key={t}
                      onClick={() => addTopics(t)}>{t}</button>
            ))}
          </span>
        </div>

        <span className="field-hint" id="topic-hint">
          Enter or a comma keeps one, up to six. Backspace takes the last one
          back. The first three become the line above the headline.
        </span>
      </div>

      <label>File name: leave blank and I&apos;ll make one from the headline
        <input
          type="text" id="f-slug" spellCheck={false}
          placeholder={fields.title.trim() ? slugify(fields.title) : "dse-basics"}
          value={fields.slug}
          /* Tidied as soon as you leave the box, so what is on screen
             is what the URL will be. Doing it on every keystroke would
             fight the typing: a hyphen you are about to follow with a
             word would vanish mid-thought. */
          onBlur={() => {
            const wanted = fields.slug.trim();
            if (!wanted) return;
            const tidy = slugify(wanted);
            if (tidy === wanted) return;
            setFields({ slug: tidy });
            toast(`File name tidied to "${tidy}", that is what the URL can be.`);
          }}
          onChange={(e) => setFields({ slug: e.target.value })}
        />
      </label>
    </div>
  );
}
