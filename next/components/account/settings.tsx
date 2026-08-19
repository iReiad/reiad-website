"use client";

/* ============================================================
   account/settings.tsx: the three questions, and the same form
   either way.

   THE RULE THE WHOLE PAGE IS BUILT AROUND, and this is where it
   is tested: nothing is asked for that the site does not then
   use, and nothing is shown that the site cannot measure. Every
   question here changes something the reader can point at
   afterwards.

     the name      appears beside anything they write
     the courses   the home page's band offers them first
     the pace      the last seven days are counted against it

   A fourth question would be a form. There is no birthday, no
   country and no "how did you hear about us" because nothing on
   this site would do anything with them.

   ---- setup asks, settings tells ----

   One form, two framings, decided by whether the profile carries
   a `setup_at`. Two forms would be two save handlers and two
   places for a label to drift, which is the argument the target
   form makes one section up.

   "Not now" is a real answer and is recorded as one: without it
   the page would ask again on every visit, which is how a polite
   question becomes nagging.
   ============================================================ */

import {
  useCallback, useEffect, useState, type FormEvent, type ReactNode,
} from "react";
import type { Profile } from "/account.js";
import { LADDER_SCHOOLS } from "../../lib/nav";
import { subscribe } from "../../lib/progress";
import { Button } from "../ui/button";
import { Field } from "../ui/field";
import { accountModule, useProfile } from "./profile";
import { startedCourses } from "./mirror";

/** The sentence under a question: what the answer is for, before
    anything has gone wrong. */
const Why = ({ children }: { children: ReactNode }) => (
  <p className="m-0 -mt-[3px] mb-0.5 max-w-[var(--measure)]
                text-[0.85rem] text-ink-soft">
    {children}
  </p>
);

/** One question. A `<fieldset>` because the courses and the paces
    are groups of controls that answer one thing, and a `<legend>`
    is the only label a screen reader reads for a group. */
const Question = ({ ask, why, children }: {
  ask: string;
  why: ReactNode;
  children: ReactNode;
}) => (
  <fieldset className="m-0 grid gap-[9px] border-0 p-0">
    <legend className="p-0 font-serif text-[1.04rem] text-ink">{ask}</legend>
    <Why>{why}</Why>
    {children}
  </fieldset>
);

const PACES = [
  { id: "daily", label: "Every day", note: "or as near as life allows" },
  { id: "often", label: "Most days", note: "four or five a week" },
  { id: "sometimes", label: "When I can", note: "no particular rhythm" },
];

export function Settings() {
  const profile = useProfile();

  const [name, setName] = useState<string | null>(null);
  const [following, setFollowing] = useState<Set<string> | null>(null);
  const [pace, setPace] = useState("");
  const [started, setStarted] = useState<Set<string>>(new Set());
  const [note, setNote] = useState<{ text: string; state: "ok" | "warn" } | null>(null);
  const [busy, setBusy] = useState(false);
  /* Whether this reader has answered, ever. Held separately from
     `profile.setup_at` so that pressing Save or Not now reframes
     the form at once rather than waiting for a re-read. */
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    const look = () => setStarted(startedCourses());
    look();
    /* Including `sync:done`: a course this reader started on their
       phone should already be ticked here the first time they open
       the page on a laptop. */
    return subscribe(look);
  }, []);

  /* The account's answers, once they arrive, and never over
     anything already typed: a reader who starts filling this in
     while the profile is still in flight must not have it taken
     away underneath them. */
  useEffect(() => {
    if (!profile) return;
    setName((was) => (was === null ? String(profile.display_name ?? "") : was));
    setFollowing((was) => was ?? new Set(profile.following ?? []));
    setPace((was) => was || String(profile.pace ?? ""));
    if (profile.setup_at) setAsked(true);
  }, [profile]);

  /* The name the account was opened with, as the placeholder
     answer, so somebody who has never saved sees their own name
     rather than an empty box. */
  useEffect(() => {
    let live = true;
    accountModule().then((m) => {
      const user = m.current();
      if (live && user?.name) setName((was) => (was === null ? String(user.name) : was));
    }).catch(() => {});
    return () => { live = false; };
  }, []);

  /* Union, not replacement. Somebody who follows German and has
     just started English should see both ticked. */
  const ticked = new Set([...(following ?? []), ...started]);

  const save = useCallback(async (patch: Partial<Profile>, said: string) => {
    setBusy(true);
    try {
      const m = await accountModule();
      await m.saveProfile(patch);
      setNote({ text: said, state: "ok" });
      setAsked(true);
      return true;
    } catch (err) {
      setNote({
        text: (err as Error).message || "That did not save.",
        state: "warn",
      });
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const typed = (name ?? "").trim();
    if (!typed) {
      setNote({ text: "A name cannot be empty.", state: "warn" });
      return;
    }
    /* Everything else on this page that shows part of the profile
       hears about the save through `profile:changed`, which
       `saveProfile` dispatches, so nothing is repainted from
       here. The ladders reorder by themselves. */
    await save({
      display_name: typed,
      following: [...ticked],
      pace,
      /* Answered, so stop asking. Set on the first save whether or
         not anything was ticked: somebody who saves a name and
         nothing else has still been through setup. */
      setup_at: new Date().toISOString(),
    }, "Saved.");
  };

  const toggle = (key: string) => {
    setFollowing(() => {
      const next = new Set(ticked);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  const setup = !asked;

  return (
    <>
      <div className="mt-3 grid gap-1 border-t border-hairline pt-5">
        <h3 id="settings-label" className="m-0 text-[1.08rem]">
          {setup ? "Set up your account" : "Your settings"}
        </h3>
        <p id="settings-intro"
           className="m-0 max-w-[var(--measure)] text-[0.9rem] text-ink-soft">
          {setup
            ? "Three things, and none of them required. Some of it is filled in "
              + "already from what this account knows. Change what is wrong, tick "
              + "what you are about to start, and this becomes your settings page."
            : "Three things, none of them required. You can change any of them "
              + "whenever you like."}
        </p>
      </div>

      <form id="settings-form" onSubmit={submit} data-mode={setup ? "setup" : "settings"}
            className="grid max-w-[620px] gap-[22px]">
        <Question ask="Your name"
                  why="What appears beside anything you write. Nothing else about
                       you is shown to anyone.">
          <div className="max-w-[340px]">
            <Field id="account-name" label="Your name" hideLabel type="text"
                   maxLength={40} autoComplete="name" placeholder="Your name"
                   value={name ?? ""} onChange={(e) => setName(e.target.value)} />
          </div>
        </Question>

        <Question ask="What are you here to learn?"
                  why="The home page offers these first when you come back, and a
                       course you pick here shows up even before you have opened it.">
          <div className="choice-grid" id="account-courses">
            {LADDER_SCHOOLS.map((school) => (
              <label className="choice" key={school.key} htmlFor={`course-${school.key}`}>
                <input type="checkbox" id={`course-${school.key}`} value={school.key}
                       checked={ticked.has(school.key)}
                       onChange={() => toggle(school.key)} />
                <span className="choice-body">
                  <strong className="bn-h">{school.bn} · {school.en}</strong>
                  {/* Said out loud, because a box that is already
                      ticked without explanation reads as a default
                      somebody chose for you. */}
                  <small>
                    {started.has(school.key)
                      ? "you have already started this"
                      : school.blurb}
                  </small>
                </span>
              </label>
            ))}
          </div>
        </Question>

        <Question ask="How often do you want to practise?"
                  why="Only so this page can tell you how the last week went.">
          <div className="choice-row" id="account-pace">
            {PACES.map((option) => (
              <label className="choice choice-pace" key={option.id} htmlFor={`pace-${option.id}`}>
                <input type="radio" name="pace" id={`pace-${option.id}`} value={option.id}
                       checked={pace === option.id}
                       onChange={() => setPace(option.id)} />
                <span className="choice-body">
                  <strong>{option.label}</strong>
                  <small>{option.note}</small>
                </span>
              </label>
            ))}
          </div>
        </Question>

        <div className="flex flex-wrap items-center gap-3">
          <Button kind="solid" type="submit" disabled={busy}>Save</Button>
          {setup ? (
            <Button kind="ghost" id="settings-skip" disabled={busy}
                    onClick={() => save({ setup_at: new Date().toISOString() },
                      "Fine. Everything above is here whenever you want it.")}>
              Not now
            </Button>
          ) : null}
          {note ? (
            <span className="signin-note" id="settings-note" data-state={note.state}>
              {note.text}
            </span>
          ) : null}
        </div>
      </form>
    </>
  );
}
