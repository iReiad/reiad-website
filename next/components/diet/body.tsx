/* ============================================================
   diet/body.tsx: measurements in, composition out.

   The first page of the diet tool that shows a number, and the
   first that shows a range. `DIET.md` section 2 is the reasoning
   and `shared/diet.ts` is every formula: nothing is recomputed
   here, because a route with its own copy of an equation is a
   route that will disagree with the check.

   ---- it stores nothing, on purpose ----

   Everything here is arithmetic over what is typed into it. No
   account, no row, no localStorage: a reader can work out what
   their body probably is without signing into anything, which is
   what makes this the stage that ships before the migration is
   used for anything.

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

import { useMemo, useState } from "react";
import {
  BMI_CUTS, bmi, bmiBand, whtr, whtrBand, fatEstimate, ffmiNormalised,
  restingBurn, mifflin,
  type Ancestry, type Body, type Sex,
} from "@reiad/shared/diet";
import { Field, Select } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang, type ToolLang } from "./lang";

/** A number typed into a box, which is a string until it is not.
    Empty is absent rather than zero: a waist of 0 is not a
    measurement anybody took. */
const num = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

const round = (n: number, dp = 1): string => n.toFixed(dp);

const BAND_WORDS: Record<string, { en: string; bn: string }> = {
  under:   { en: "under the healthy range", bn: "স্বাস্থ্যকর সীমার নিচে" },
  healthy: { en: "in the healthy range", bn: "স্বাস্থ্যকর সীমার মধ্যে" },
  raised:  { en: "above the healthy range", bn: "স্বাস্থ্যকর সীমার উপরে" },
  high:    { en: "well above the healthy range", bn: "অনেকটাই উপরে" },
};

const WHTR_WORDS: Record<string, { en: string; bn: string }> = {
  low:     { en: "below 0.4", bn: "০.৪ এর নিচে" },
  healthy: { en: "under 0.5, which is the mark to aim for", bn: "০.৫ এর নিচে, যেটাই লক্ষ্য" },
  raised:  { en: "0.5 or above", bn: "০.৫ বা তার বেশি" },
  high:    { en: "0.6 or above", bn: "০.৬ বা তার বেশি" },
};

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
            <p>
              <T
                en="Height, weight and age, and the numbers appear here. Nothing is stored and nothing is sent anywhere."
                bn="উচ্চতা, ওজন আর বয়স দিন, সংখ্যাগুলো এখানে আসবে। কিছুই জমা থাকে না, কোথাও যায় না।"
              />
            </p>
          </div>
        )
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

function Readout({ body, lang }: { body: Body; lang: ToolLang }) {
  const value = bmi(body.weightKg, body.heightCm);
  const band = bmiBand(value, body.ancestry);
  const ratio = body.waistCm ? whtr(body.waistCm, body.heightCm) : null;
  const fat = fatEstimate(body);
  const rest = restingBurn(body, fat.method === "navy" ? fat.leanKg : undefined);

  return (
    <div className="dt-readout">
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
                en="Predicts cardiometabolic risk better than BMI across ethnicities, and needs one tape measure."
                bn="বিভিন্ন জাতিগোষ্ঠীর ক্ষেত্রে বিএমআইয়ের চেয়ে ভালো ইঙ্গিত দেয়, আর লাগে শুধু একটা ফিতা।"
              />
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
            en="Mass over height squared. It cannot tell muscle from fat and says nothing about where the fat is, which is the part that matters."
            bn="ওজনকে উচ্চতার বর্গ দিয়ে ভাগ। এটি পেশি আর চর্বির পার্থক্য বোঝে না, আর চর্বি কোথায় জমেছে তা বলে না, যেটাই আসল ব্যাপার।"
          />
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
            en="What the protein floor is worked out from, and the number that tells a lifter their BMI is lying."
            bn="প্রোটিনের সর্বনিম্ন হিসাব এখান থেকেই আসে, আর যিনি ভার তোলেন তাঁকে এটাই বলে দেয় বিএমআই ভুল বলছে।"
          />
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
        </p>
      </div>
    </div>
  );
}
