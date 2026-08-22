/* ============================================================
   /tools/diet/you

   The body page. `DIET.md` section 2 is the reasoning; the
   arithmetic is `shared/diet.ts` and none of it is repeated
   here.

   The panel is a client component because the whole page is a
   calculator over what somebody types, and it stores nothing:
   there is no row, no account and no localStorage behind this
   address. That is what makes it the first page of the tool that
   could ship.
   ============================================================ */

import type { Metadata } from "next";
import { pageMeta } from "../../../../../lib/pageMeta";
import { BodyPanel } from "../../../../../components/diet/body";
import { LangSwitch, T, TBlock } from "../../../../../components/diet/lang";

export const metadata: Metadata = pageMeta({
  path: "/tools/diet/you",
  title: "Your body · Diet · Reiad's Library",
  description: "Waist to height, BMI on the cut-offs that apply to you, body "
    + "fat as a range rather than a number, lean mass and what you burn at "
    + "rest. Nothing is stored and no account is needed.",
  ogTitle: "Your body, with the error bars showing",
  ogDescription: "Waist to height leads, BMI sits beside it, and body fat is "
    + "printed as a range because that is what the method can support.",
  card: "tools",
});

export default function DietYouPage() {
  return (
    <main id="main" className="wrap dt-page">
      <header className="dt-head">
        <div className="dt-head-row">
          <h1><T en="Your body" bn="আপনার শরীর" /></h1>
          <LangSwitch />
        </div>
        <TBlock
          en={(
            <p className="dt-lede">
              Type what you know. Nothing is stored, nothing is sent anywhere,
              and no account is needed for any of it.
            </p>
          )}
          bn={(
            <p className="dt-lede">
              যা জানেন লিখুন। কিছুই জমা থাকে না, কোথাও পাঠানো হয় না, আর এর কোনো
              কিছুর জন্যই অ্যাকাউন্ট লাগে না।
            </p>
          )}
        />
      </header>

      <BodyPanel />

      <section className="dt-tape" aria-labelledby="dt-tape-h">
        <h2 id="dt-tape-h"><T en="Where the tape goes" bn="ফিতা কোথায় বসবে" /></h2>
        <TBlock
          en={(
            <>
              <p>
                Every number above is only as good as where the tape went, and
                waist means four different places to four different people.
              </p>
              <dl className="dt-defs">
                <dt>Waist</dt>
                <dd>
                  The narrowest point between the lowest rib and the top of the
                  hip bone, or at the navel if there is no narrowest point.
                  Standing, at the end of a normal breath out, tape level all the
                  way round, snug without denting.
                </dd>
                <dt>Neck</dt>
                <dd>Just below the larynx, tape sloping slightly down at the front.</dd>
                <dt>Hip</dt>
                <dd>The widest point of the buttocks, feet together.</dd>
              </dl>
              <p>
                <strong>The error that matters is not accuracy, it is
                inconsistency.</strong> A tape 1cm high one month and 1cm low the
                next invents a 2cm change that did not happen. Same time of day,
                same posture, before eating.
              </p>
            </>
          )}
          bn={(
            <>
              <p>
                উপরের প্রতিটি সংখ্যা ততটাই ভালো, ফিতা যতটা ঠিক জায়গায় বসেছে। আর
                কোমর বলতে চারজন মানুষ চারটে আলাদা জায়গা বোঝেন।
              </p>
              <dl className="dt-defs">
                <dt>কোমর</dt>
                <dd>
                  সবচেয়ে নিচের পাঁজর আর নিতম্বের হাড়ের উপরের মাঝখানে সবচেয়ে সরু
                  জায়গা, সরু জায়গা না থাকলে নাভি বরাবর। দাঁড়িয়ে, স্বাভাবিকভাবে
                  শ্বাস ছাড়ার পর, ফিতা চারদিকে সমান, চেপে না বসিয়ে।
                </dd>
                <dt>গলা</dt>
                <dd>স্বরযন্ত্রের ঠিক নিচে, সামনের দিকটা সামান্য ঢালু করে।</dd>
                <dt>নিতম্ব</dt>
                <dd>নিতম্বের সবচেয়ে চওড়া জায়গা, দুই পা একসঙ্গে।</dd>
              </dl>
              <p>
                <strong>যেটা আসল সমস্যা সেটা নিখুঁত হওয়া নয়, একেক বার একেক রকম
                হওয়া।</strong> এক মাসে ফিতা এক সেমি উপরে আর পরের মাসে এক সেমি নিচে
                বসলে দুই সেমি পরিবর্তন তৈরি হয়, যেটা আসলে ঘটেনি। একই সময়ে, একই
                ভঙ্গিতে, খাওয়ার আগে।
              </p>
            </>
          )}
        />
      </section>
    </main>
  );
}
