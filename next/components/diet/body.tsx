/* ============================================================
   diet/body.tsx: measurements in, composition out.

   The first page of the diet tool that shows a number, and the
   first that shows a range. `DIET.md` section 2 is the reasoning
   and `shared/diet.ts` is every formula: nothing is recomputed
   here, because a route with its own copy of an equation is a
   route that will disagree with the check.

   ---- it stores nothing until the reader asks it to ----

   Everything here is arithmetic over what is typed into it. No
   account, no row, no localStorage: a reader can work out what
   their body probably is without signing into anything, which is
   what makes this the stage that ships before the migration is
   used for anything.

   ONE BUTTON CHANGES THAT, and only for somebody already signed
   in. Height, year of birth, which formula and which cut-offs
   are the four facts every other page of this tool needs, and
   for a while nothing on this site could write them: `board`,
   `goal` and `summary` all gate on `profile.height_cm` and
   `profile.birth_year`, so on a real account there was no
   target, no protein floor, no learned maintenance, no
   projection and no BMI, and the goal page said "the body page
   is where the first two go" while this page stored neither.
   The write is explicit because the rest of the page is not: a
   reader who came here to work something out has not asked to
   be remembered.

   ---- the three rules it is here to hold on screen ----

   THE CUT-OFF FOLLOWS THE READER. The WHO's 2004 consultation
   recommends lower BMI action points for Asian populations, and
   the page says WHICH SET IT IS USING and why, beside the
   number. A tool serving Bangladesh that quietly used 25 would
   tell a large number of its readers they are fine when their
   own health service would not.

   WAIST TO HEIGHT LEADS. It needs one tape measure and no
   assumption about population, which is exactly the property BMI
   lacks, so it is first and BMI is beside it.

   NOTHING IS A POINT ESTIMATE. Body fat is printed as a range
   because the tape method is three to four points against DXA
   and the equation is worse. `fatEstimate()` returns the width
   with the value so this component cannot print one without the
   other even by accident.
   ============================================================ */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BMI_CUTS, bmi, bmiBand, whtr, whtrBand, fatEstimate, ffmiNormalised,
  restingBurn, mifflin,
  type Ancestry, type Body, type Sex,
} from "@reiad/shared/diet";
import { Field, Select } from "../ui/field";
import { Note } from "../ui/note";
import { Button } from "../ui/button";
import { getProfile, saveProfile, who, type Profile, type Who } from "../../lib/diet-api";
import { T, TBlock, digits, useToolLang, type ToolLang } from "./lang";
import { BAND_WORDS, WHTR_WORDS } from "./words";
import { Term } from "./glossary";

/** A number typed into a box, which is a string until it is not.
    Empty is absent rather than zero: a waist of 0 is not a
    measurement anybody took. */
const num = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

const round = (n: number, dp = 1): string => n.toFixed(dp);


export function BodyPanel() {
  /* Only the `<option>` text needs this, and `lang.tsx` says
     why: everything else on this page is rendered twice and
     chosen by the stylesheet, with no flash and no mismatch. */
  const lang = useToolLang();
  const [heightCm, setHeight] = useState("");
  const [weightKg, setWeight] = useState("");
  const [ageYears, setAge] = useState("");
  const [sex, setSex] = useState<Sex>("male");
  const [ancestry, setAncestry] = useState<Ancestry>("general");
  const [waistCm, setWaist] = useState("");
  const [hipCm, setHip] = useState("");
  const [neckCm, setNeck] = useState("");

  /* Signed in or not, and what the account already knows. Both
     start as "not asked yet" rather than as "no", because a
     button that appears a beat after the page does is better
     than one that offers to save to an account the reader does
     not have. */
  const [w, setW] = useState<Who | null>(null);
  const [asked, setAsked] = useState(false);
  const [kept, setKept] = useState<"" | "saving" | "saved" | "failed">("");

  useEffect(() => {
    let live = true;
    void (async () => {
      const me = await who();
      if (!live) return;
      setW(me);
      setAsked(true);
      if (!me) return;
      const p = await getProfile(me);
      if (!live || !p) return;
      /* PREFILL, NEVER OVERWRITE. An effect that lands while
         somebody is typing and replaces what they typed is worse
         than one that never ran. */
      if (p.height_cm) setHeight((v) => v || String(p.height_cm));
      if (p.birth_year) {
        setAge((v) => v || String(new Date().getFullYear() - (p.birth_year as number)));
      }
      if (p.sex) setSex(p.sex);
      if (p.ancestry) setAncestry(p.ancestry);
    })();
    return () => { live = false; };
  }, []);

  const body: Body | null = useMemo(() => {
    const h = num(heightCm);
    const w = num(weightKg);
    const a = num(ageYears);
    if (!h || !w || !a) return null;
    return {
      heightCm: h, weightKg: w, ageYears: a, sex, ancestry,
      waistCm: num(waistCm), hipCm: num(hipCm), neckCm: num(neckCm),
    };
  }, [heightCm, weightKg, ageYears, sex, ancestry, waistCm, hipCm, neckCm]);

  const cuts = BMI_CUTS[ancestry];

  /* THE FOUR THE REST OF THE TOOL NEEDS. Not the weight, which
     is a reading and belongs on a day's row, and not the tape,
     which is the same. These four change about once a decade. */
  const keep = async (): Promise<void> => {
    const h = num(heightCm);
    const a = num(ageYears);
    if (!w || !h || !a) return;
    setKept("saving");
    const patch: Profile = {
      height_cm: h,
      birth_year: new Date().getFullYear() - Math.round(a),
      sex,
      ancestry,
    };
    const before = await getProfile(w);
    const ok = await saveProfile(w, { ...(before ?? {}), ...patch });
    setKept(ok ? "saved" : "failed");
    window.setTimeout(() => setKept(""), 2600);
  };

  return (
    <div className="dt-body">
      <form className="dt-form" onSubmit={(e) => e.preventDefault()}>
        <fieldset className="dt-set">
          <legend><T en="The four it needs" bn="যে চারটি লাগবেই" /></legend>
          <Field
            id="dt-height" type="number" inputMode="decimal" min={50} max={250} step="0.5"
            label={<T en="Height, cm" bn="উচ্চতা, সেমি" />}
            value={heightCm} onChange={(e) => setHeight(e.target.value)}
          />
          <Field
            id="dt-weight" type="number" inputMode="decimal" min={20} max={400} step="0.1"
            label={<T en="Weight, kg" bn="ওজন, কেজি" />}
            value={weightKg} onChange={(e) => setWeight(e.target.value)}
          />
          <Field
            id="dt-age" type="number" inputMode="numeric" min={18} max={120} step="1"
            label={<T en="Age, years" bn="বয়স, বছর" />}
            value={ageYears} onChange={(e) => setAge(e.target.value)}
          />
          <Select
            id="dt-sex" value={sex}
            onChange={(e) => setSex(e.target.value as Sex)}
            label={<T en="Which formula to use" bn="কোন সূত্র ব্যবহার হবে" />}
            hint={(
              <T
                en="Mifflin-St Jeor and the tape method have two forms. Stored for that and nothing else."
                bn="মিফলিন আর ফিতার হিসাব, দুটোরই দুই রূপ আছে। কেবল এই কারণেই রাখা।"
              />
            )}
          >
            <option value="male">{lang === "bn" ? "পুরুষের সূত্র" : "The male form"}</option>
            <option value="female">{lang === "bn" ? "নারীর সূত্র" : "The female form"}</option>
          </Select>
          <Select
            id="dt-ancestry" value={ancestry}
            onChange={(e) => setAncestry(e.target.value as Ancestry)}
            label={<T en="Which BMI cut-offs" bn="কোন বিএমআই সীমা" />}
            hint={(
              <T
                en="The WHO recommends lower action points for Asian populations, and the NHS says the same. This follows you, not the country you are in."
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

          {/* Only for somebody already signed in, and only once
              the two that cannot be guessed are filled. An offer
              to save shown to a reader with no account is an
              advert. */}
          {asked && w && num(heightCm) && num(ageYears) ? (
            <div className="dt-keep">
              <Button kind="soft" size="sm" onClick={() => void keep()}
                      disabled={kept === "saving"}>
                <T en="Keep these four on my account" bn="এই চারটি আমার অ্যাকাউন্টে রাখুন" />
              </Button>
              <p className="dt-hint">
                <T
                  en="Height, year of birth, which formula and which cut-offs. Every other page of this tool needs them, and none of them can work them out on its own. Your weight and your tape measurements are not kept here: those belong to a day."
                  bn="উচ্চতা, জন্মসাল, কোন সূত্র আর কোন সীমা। এই টুলের বাকি সব পাতার এগুলো লাগে, আর কোনোটাই নিজে থেকে বের করতে পারে না। ওজন আর ফিতার মাপ এখানে রাখা হয় না: ওগুলো একটা দিনের।"
                />
              </p>
              {/* An honest state, not a word that says Saved
                  whatever happened. `aria-live` because a chip
                  that changes silently is a chip a screen reader
                  never mentions. */}
              <p className="dt-said" role="status" aria-live="polite" data-state={kept}>
                {kept === "saved"
                  ? <T en="Kept on your account." bn="আপনার অ্যাকাউন্টে রাখা হয়েছে।" />
                  : kept === "failed"
                    ? <T en="Not saved. Nothing was changed, so try again." bn="জমা হয়নি। কিছুই বদলায়নি, আবার চেষ্টা করুন।" />
                    : null}
              </p>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="dt-set">
          <legend><T en="The tape, if you have one" bn="ফিতা থাকলে" /></legend>
          <p className="dt-hint">
            <T
              en="A waist alone gives the better of the two numbers below. A neck as well, and hips for the female form, give a composition estimate."
              bn="শুধু কোমরের মাপেই নিচের ভালো সংখ্যাটা পাওয়া যায়। গলা, আর নারীদের ক্ষেত্রে নিতম্বও থাকলে শরীরের গঠনের একটা আন্দাজ মেলে।"
            />
          </p>
          <Field
            id="dt-waist" type="number" inputMode="decimal" min={30} max={250} step="0.5"
            label={<T en="Waist, cm" bn="কোমর, সেমি" />}
            value={waistCm} onChange={(e) => setWaist(e.target.value)}
          />
          <Field
            id="dt-neck" type="number" inputMode="decimal" min={20} max={80} step="0.5"
            label={<T en="Neck, cm" bn="গলা, সেমি" />}
            value={neckCm} onChange={(e) => setNeck(e.target.value)}
          />
          <Field
            id="dt-hip" type="number" inputMode="decimal" min={40} max={250} step="0.5"
            label={<T en="Hip, cm" bn="নিতম্ব, সেমি" />}
            value={hipCm} onChange={(e) => setHip(e.target.value)}
            disabled={sex === "male"}
            hint={sex === "male"
              ? <T en="Only the female form uses this." bn="কেবল নারীদের সূত্রে লাগে।" />
              : undefined}
          />
        </fieldset>
      </form>

      {body === null
        ? (
          <div className="dt-readout dt-readout-waiting">
            <h2 className="dt-readout-h"><T en="What that says about you" bn="এতে আপনার সম্পর্কে যা বোঝা যায়" /></h2>
            <p>
              <T
                en="Height, weight and age, and the numbers appear here. Nothing is stored and nothing is sent anywhere."
                bn="উচ্চতা, ওজন আর বয়স দিন, সংখ্যাগুলো এখানে আসবে। কিছুই জমা থাকে না, কোথাও যায় না।"
              />
            </p>
          </div>
        )
        : body.ageYears < 18
          ? <TooYoung />
          : <Readout body={body} lang={lang} />}

      <Note tone="quiet">
        <TBlock
          en={(
            <p>
              This page is general education and not medical advice. It does not
              know your history, your medicines or anything a clinician would ask
              about first.
            </p>
          )}
          bn={(
            <p>
              এই পাতাটি সাধারণ তথ্যের জন্য, চিকিৎসা পরামর্শ নয়। আপনার রোগের ইতিহাস,
              ওষুধ বা একজন চিকিৎসক প্রথমেই যা জিজ্ঞেস করতেন, তার কিছুই এটি জানে না।
            </p>
          )}
        />
      </Note>

      <p className="dt-cuts">
        <T
          en={`Using the ${ancestry === "asian" ? "Asian" : "general"} cut-offs: `
            + `${cuts.raised} and ${cuts.high}.`}
          bn={`${ancestry === "asian" ? "এশীয়" : "সাধারণ"} সীমা ব্যবহার হচ্ছে: `
            + `${digits(cuts.raised, "bn")} আর ${digits(cuts.high, "bn")}।`}
        />
      </p>
    </div>
  );
}

/** UNDER 18 IS A REFUSAL, NOT A WARNING.

    `DIET.md` section 31: "the equations are for adults and the
    tool says so and stops. This is not a soft warning; there is
    no child mode." Every formula on this page was fitted on
    adults: Mifflin-St Jeor is an adult equation, the Navy tape
    method was validated on adult service personnel, and the BMI
    cut-offs below are adult cut-offs against which a growing
    body is read on a centile chart instead.

    `min={18}` on the age box was the whole of this and it is
    advisory markup outside a submitted form, so typing 15 drew
    a complete readout. */
function TooYoung() {
  return (
    <div className="dt-readout dt-readout-stop" role="note">
      <h2 className="dt-readout-h"><T en="What that says about you" bn="এতে আপনার সম্পর্কে যা বোঝা যায়" /></h2>
      <div className="dt-figure dt-figure-lead">
        <h3><T en="This tool cannot answer for you" bn="এই টুল আপনার জন্য উত্তর দিতে পারে না" /></h3>
        <TBlock
          en={(
            <>
              <p>
                Every number this page would show is worked out from an equation
                fitted on adults. Under 18, height and weight are read against a
                growth chart for your age instead, and there is no version of
                that this page can do.
              </p>
              <p>
                A doctor or a school nurse has the right chart. Nothing here is a
                substitute for it, and a number that looks precise would be worse
                than no number at all.
              </p>
            </>
          )}
          bn={(
            <>
              <p>
                এই পাতা যে সংখ্যাগুলো দেখাত, তার প্রতিটি বড়দের ওপর তৈরি সূত্র থেকে আসে।
                ১৮ বছরের নিচে উচ্চতা আর ওজন বয়স অনুযায়ী বৃদ্ধির চার্টে দেখতে হয়, আর
                সেটা এই পাতা করতে পারে না।
              </p>
              <p>
                সঠিক চার্ট একজন ডাক্তার বা স্কুলের নার্সের কাছে আছে। এখানকার কিছুই তার
                বিকল্প নয়, আর নিখুঁত দেখতে একটা সংখ্যা কোনো সংখ্যা না থাকার চেয়েও খারাপ।
              </p>
            </>
          )}
        />
      </div>
    </div>
  );
}

function Readout({ body, lang }: { body: Body; lang: ToolLang }) {
  const value = bmi(body.weightKg, body.heightCm);
  const band = bmiBand(value, body.ancestry);
  const ratio = body.waistCm ? whtr(body.waistCm, body.heightCm) : null;
  const fat = fatEstimate(body);
  const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);

  return (
    <div className="dt-readout">
      <h2 className="dt-readout-h">
        <T en="What that says about you" bn="এতে আপনার সম্পর্কে যা বোঝা যায়" />
      </h2>
      {/* Waist to height leads. It is the number with the better
          evidence behind it and the one that needs no assumption
          about population. */}
      {ratio === null
        ? (
          <div className="dt-figure dt-figure-lead dt-figure-empty">
            <h3><T en="Waist to height" bn="কোমর ও উচ্চতার অনুপাত" /></h3>
            <p>
              <T
                en="A waist measurement gives you this, and it is the better of the two."
                bn="কোমরের মাপ দিলেই এটা পাওয়া যাবে, আর দুটোর মধ্যে এটাই ভালো।"
              />
            </p>
          </div>
        )
        : (
          <div className="dt-figure dt-figure-lead">
            <h3><T en="Waist to height" bn="কোমর ও উচ্চতার অনুপাত" /></h3>
            <p className="dt-value"><T en={round(ratio, 2)} bn={digits(round(ratio, 2), "bn")} /></p>
            <p className="dt-said">
              <T en={WHTR_WORDS[whtrBand(ratio)].en} bn={WHTR_WORDS[whtrBand(ratio)].bn} />
            </p>
            <p className="dt-why">
              <T
                en="Predicts cardiometabolic risk better than BMI across ethnicities, and needs one tape measure. "
                bn="বিভিন্ন জাতিগোষ্ঠীর ক্ষেত্রে বিএমআইয়ের চেয়ে ভালো ইঙ্গিত দেয়, আর লাগে শুধু একটা ফিতা। "
              />
              <Term id="whtr" en="What this ratio is" bn="এই অনুপাতটা কী" />
            </p>
          </div>
        )}

      <div className="dt-figure">
        <h3>BMI</h3>
        <p className="dt-value"><T en={round(value)} bn={digits(round(value), "bn")} /></p>
        <p className="dt-said">
          <T en={BAND_WORDS[band].en} bn={BAND_WORDS[band].bn} />
        </p>
        <p className="dt-why">
          <T
            en="Mass over height squared. It cannot tell muscle from fat and says nothing about where the fat is, which is the part that matters. "
            bn="ওজনকে উচ্চতার বর্গ দিয়ে ভাগ। এটি পেশি আর চর্বির পার্থক্য বোঝে না, আর চর্বি কোথায় জমেছে তা বলে না, যেটাই আসল ব্যাপার। "
          />
          <Term id="bmi" en="More on BMI" bn="বিএমআই নিয়ে আরও" />
        </p>
      </div>

      <div className="dt-figure">
        <h3><T en="Body fat" bn="শরীরের চর্বি" /></h3>
        <p className="dt-value">
          <T
            en={`${Math.round(fat.pct.low)} to ${Math.round(fat.pct.high)}%`}
            bn={`${digits(Math.round(fat.pct.low), "bn")} থেকে `
              + `${digits(Math.round(fat.pct.high), "bn")}%`}
          />
        </p>
        <p className="dt-said">
          <T
            en={fat.method === "navy"
              ? "From the tape, plus or minus about 3 to 4 points"
              : "From BMI, plus or minus about 5 points"}
            bn={fat.method === "navy"
              ? "ফিতার মাপ থেকে, প্রায় ৩ থেকে ৪ পয়েন্ট এদিক ওদিক"
              : "বিএমআই থেকে, প্রায় ৫ পয়েন্ট এদিক ওদিক"}
          />
        </p>
        <p className="dt-why">
          <T
            en="A range rather than a number, because that is what the method can support. Anything printing one decimal place here is making it up."
            bn="একটা সংখ্যা নয়, একটা সীমা, কারণ পদ্ধতিটা এর বেশি বলতে পারে না। এখানে দশমিকের ঘর দেখালে সেটা বানানো।"
          />
        </p>
      </div>

      <div className="dt-figure">
        <h3><T en="Lean mass" bn="চর্বি ছাড়া ভর" /></h3>
        <p className="dt-value"><T en={`${round(fat.leanKg)} kg`} bn={`${digits(round(fat.leanKg), "bn")} কেজি`} /></p>
        <p className="dt-said">
          <T
            en={`FFMI about ${round(ffmiNormalised(fat.leanKg, body.heightCm))}`}
            bn={`এফএফএমআই প্রায় `
              + `${digits(round(ffmiNormalised(fat.leanKg, body.heightCm)), "bn")}`}
          />
        </p>
        <p className="dt-why">
          <T
            en="What the protein floor is worked out from, and the number that tells a lifter their BMI is lying. "
            bn="প্রোটিনের সর্বনিম্ন হিসাব এখান থেকেই আসে, আর যিনি ভার তোলেন তাঁকে এটাই বলে দেয় বিএমআই ভুল বলছে। "
          />
          <Term id="lean" en="Lean mass and FFMI" bn="চর্বি ছাড়া ভর আর এফএফএমআই" />
        </p>
      </div>

      <div className="dt-figure">
        <h3><T en="Resting burn" bn="বিশ্রামে খরচ" /></h3>
        <p className="dt-value"><T en={`${Math.round(rest.kcal / 10) * 10} kcal`} bn={`${digits(Math.round(rest.kcal / 10) * 10, "bn")} ক্যালোরি`} /></p>
        <p className="dt-said">
          <T
            en={rest.method === "katch"
              ? "Katch-McArdle, from lean mass"
              : "Mifflin-St Jeor, from height and weight"}
            bn={rest.method === "katch"
              ? "ক্যাচ-ম্যাকআর্ডল, চর্বি ছাড়া ভর থেকে"
              : "মিফলিন-সেন্ট জিওর, উচ্চতা আর ওজন থেকে"}
          />
        </p>
        <p className="dt-why">
          <T
            en={rest.method === "katch"
              ? `The tape gave a composition, so this works from lean mass rather than guessing at it. Without it the estimate would be ${Math.round(mifflin(body) / 10) * 10}.`
              : "What your body costs doing nothing. A tape measurement replaces this with a better one that works from lean mass."}
            bn={rest.method === "katch"
              ? `ফিতা থেকে গঠন জানা গেছে, তাই এটা আন্দাজ না করে চর্বি ছাড়া ভর থেকে `
                + `হিসাব করে। ফিতা ছাড়া হত ${digits(Math.round(mifflin(body) / 10) * 10, "bn")}।`
              : "কিছু না করেও আপনার শরীর যা খরচ করে। ফিতার মাপ দিলে এর জায়গায় আরও ভালো একটা হিসাব আসে।"}
          />
          {" "}
          <Term id="bmr" en="What a resting burn is" bn="বিশ্রামে খরচ মানে কী" />
        </p>
      </div>
    </div>
  );
}
