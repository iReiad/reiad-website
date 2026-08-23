"use client";

/* ============================================================
   diet/onboard.tsx: the first ninety seconds.

   `DIET.md` section 26. A first screen of thirty fields is a tool
   nobody finishes setting up. FOUR QUESTIONS, AND THEN A NUMBER:
   height, weight, age and which formula to use. That is enough
   for a BMI, a BMR, an estimated maintenance and a first target,
   and the reader has something true before they have decided to
   trust anything.

   ---- why it is here and not on `/tools/diet/you` ----

   `/you` asks these four already and can keep them. But a reader
   who has just signed in lands HERE, and the board they land on
   is nine widgets all saying "waiting for your height". Sending
   them to another page to fix that is the step at which people
   stop: the fix belongs where the problem is visible.

   ---- everything else is asked when it would change an answer ----

   The tape when body fat is first offered. The ancestry at the
   first BMI, because it changes the cut-off and the page says so
   there. A goal and a rate on the goal page, once there is a
   maintenance figure worth setting one against. Medicines, the
   cycle and clinic numbers are NEVER asked: they are offered on
   their own pages and the whole tool works without any of them.

   ---- and the weight half can be skipped ----

   A reader who wants to log food and nothing else gets the
   nutrition and insight pages with no weight field at all.
   Section 31 requires that mode for a completely different
   reason, and building it once serves both, so the skip is not a
   courtesy: it is the same feature.
   ============================================================ */

import { useState } from "react";
import type { Ancestry, Sex } from "@reiad/shared/diet";
import { saveProfile, isoDate, type Profile, type Who } from "../../lib/diet-api";
import { Button } from "../ui/button";
import { Field, Select } from "../ui/field";
import { T, TBlock, useToolLang } from "./lang";

const num = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

export function Onboard({ w, onDone }: {
  w: Who;
  /** The board reloads the profile rather than being told the
      new one: one reader of that row, and it is already there. */
  onDone: () => void;
}) {
  const lang = useToolLang();
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [ancestry, setAncestry] = useState<Ancestry>("general");
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);

  const h = num(height);
  const a = num(age);
  const ready = !!h && !!a;
  /* UNDER 18 IS A REFUSAL HERE TOO, and it has to be: every
     equation this unlocks was fitted on adults, and letting the
     four questions through would put a reader in front of the
     numbers `/tools/diet/you` refuses to show them. */
  const tooYoung = a != null && a < 18;

  const go = async (): Promise<void> => {
    if (!h || !a || tooYoung) return;
    setSaving(true);
    const patch: Profile = {
      height_cm: h,
      birth_year: new Date().getFullYear() - Math.round(a),
      sex,
      ancestry,
      onboarded_at: isoDate(),
    };
    const ok = await saveProfile(w, patch);
    setSaving(false);
    if (ok) onDone(); else setFailed(true);
  };

  return (
    <section className="dt-onboard" aria-labelledby="dt-onboard-h">
      <h2 id="dt-onboard-h">
        <T en="Four questions, and then a number" bn="চারটি প্রশ্ন, তারপর একটা সংখ্যা" />
      </h2>
      <TBlock
        en={(
          <p className="dt-intro">
            Enough for a BMI, a resting burn, an estimate of what you burn in a
            day and a first target. Everything else is asked later, when it
            would change an answer, and your medicines, your cycle and your
            clinic results are never asked for at all.
          </p>
        )}
        bn={(
          <p className="dt-intro">
            একটা বিএমআই, বিশ্রামে খরচ, সারা দিনে কত খরচ তার আন্দাজ আর প্রথম একটা
            লক্ষ্যের জন্য এটুকুই যথেষ্ট। বাকি সব পরে জিজ্ঞেস করা হবে, যখন সেটা কোনো
            উত্তর বদলাবে, আর আপনার ওষুধ, চক্র বা পরীক্ষার ফল কখনোই চাওয়া হয় না।
          </p>
        )}
      />

      <div className="dt-onboard-form">
        <Field
          id="dt-ob-height" type="number" inputMode="decimal" min={50} max={250} step="0.5"
          label={<T en="Height, cm" bn="উচ্চতা, সেমি" />}
          value={height} onChange={(e) => setHeight(e.target.value)}
        />
        <Field
          id="dt-ob-age" type="number" inputMode="numeric" min={18} max={120} step="1"
          label={<T en="Age, years" bn="বয়স, বছর" />}
          value={age} onChange={(e) => setAge(e.target.value)}
        />
        <Select
          id="dt-ob-sex" value={sex}
          onChange={(e) => setSex(e.target.value as Sex)}
          label={<T en="Which formula to use" bn="কোন সূত্র ব্যবহার হবে" />}
          hint={(
            <T
              en="The two equations here have two forms. Kept for that and nothing else."
              bn="এখানকার সূত্র দুটোরই দুই রূপ আছে। কেবল এই কারণেই রাখা।"
            />
          )}
        >
          <option value="male">{lang === "bn" ? "পুরুষের সূত্র" : "The male form"}</option>
          <option value="female">{lang === "bn" ? "নারীর সূত্র" : "The female form"}</option>
        </Select>
        <Select
          id="dt-ob-ancestry" value={ancestry}
          onChange={(e) => setAncestry(e.target.value as Ancestry)}
          label={<T en="Which BMI cut-offs" bn="কোন বিএমআই সীমা" />}
          hint={(
            <T
              en="The WHO recommends lower action points for Asian populations and the NHS says the same. This follows you, not the country you are in."
              bn="এশীয় জনগোষ্ঠীর জন্য বিশ্ব স্বাস্থ্য সংস্থা কম সীমা বলে, এনএইচএসও তাই বলে। এটা আপনাকে অনুসরণ করে, আপনি কোন দেশে আছেন তা নয়।"
            />
          )}
        >
          <option value="general">
            {lang === "bn" ? "সাধারণ সীমা, ২৫ আর ৩০" : "The general cut-offs, 25 and 30"}
          </option>
          <option value="asian">
            {lang === "bn" ? "এশীয় সীমা, ২৩ আর ২৭.৫" : "The Asian cut-offs, 23 and 27.5"}
          </option>
        </Select>
      </div>

      {tooYoung ? (
        <TBlock
          en={(
            <p className="dt-onboard-stop" role="note">
              Every number this would unlock is worked out from an equation
              fitted on adults. Under 18, height and weight are read against a
              growth chart for your age instead, and there is no version of that
              this tool can do. The food half below works without any of this.
            </p>
          )}
          bn={(
            <p className="dt-onboard-stop" role="note">
              এটা যে সংখ্যাগুলো খুলে দিত তার প্রতিটি বড়দের ওপর তৈরি সূত্র থেকে আসে।
              ১৮ বছরের নিচে উচ্চতা আর ওজন বয়স অনুযায়ী বৃদ্ধির চার্টে দেখতে হয়, আর
              সেটা এই যন্ত্র পারে না। নিচের খাবারের অংশটা এসব ছাড়াই চলে।
            </p>
          )}
        />
      ) : null}

      <div className="dt-onboard-go">
        <Button kind="solid" onClick={() => void go()} disabled={!ready || tooYoung || saving}>
          <T en="That is enough to start" bn="শুরু করার জন্য এটুকুই যথেষ্ট" />
        </Button>
        {/* THE WEIGHT HALF CAN BE SKIPPED ENTIRELY, and this is
            not a courtesy: a reader who wants to log food and
            nothing else is the same mode section 31 requires for
            somebody for whom a weight target would be harmful,
            and building it once serves both. */}
        <Button onClick={onDone}>
          <T en="Skip this, I only want to log food" bn="এটা বাদ দিন, আমি শুধু খাবার লিখতে চাই" />
        </Button>
      </div>

      {failed ? (
        <p className="dt-said" data-state="failed" role="status" aria-live="polite">
          <T en="Not saved. Nothing was changed, so try again."
             bn="জমা হয়নি। কিছুই বদলায়নি, আবার চেষ্টা করুন।" />
        </p>
      ) : null}
    </section>
  );
}
