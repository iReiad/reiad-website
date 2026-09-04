"use client";

/* The numbers a clinic gives you, and the medicines that change what a
   chart means. `DIET.md` sections 21 and 22.

   UNITS ARE STORED, NEVER ASSUMED: glucose is reported in mmol/L in the
   UK and commonly in mg/dL on a Bangladeshi lab report, and the two
   differ by a factor of eighteen. This is the one place in the tool where
   an assumed unit would be wrong exactly once, catastrophically.

   THE TOOL PRINTS A RANGE AND NOTHING ELSE. A reference range is a
   property of an ASSAY rather than of a person, so it comes from the lab
   that produced the number and everything past that is a clinician's job.

   THE MEDICINES LIST ADJUSTS NOTHING: it says what a drug does to the
   numbers ON THESE PAGES and stops. Adjusting an equation for a medicine
   would be practising medicine with arithmetic. */

import { useEffect, useState } from "react";
import {
  getLabs, getProfile, isoDate, removeLab, saveLab, saveProfile, who,
  type Lab, type Profile, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";
import { MARKERS, MEDS, markerById } from "./words";
import { Term } from "./glossary";



export function HealthPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    let alive = true;
    const paint = () => { void who().then((f) => { if (alive) { setW(f); setAnswered(true); } }); };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { alive = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let alive = true;
    void getProfile(w).then((p) => { if (alive) setProfile(p); });
    return () => { alive = false; };
  }, [w]);

  const taking = new Set(profile?.meds ?? []);
  /* THE READINGS THEMSELVES, which this page has described and
     never held. `diet_labs` has had a table, four policies and an
     index since the migration was written and no reader and no
     writer at all, while the card on the front door calls these
     "the only objective measurements in the whole tool". */
  const [labs, setLabs] = useState<Lab[]>([]);
  const [marker, setMarker] = useState(MARKERS[0].id);
  const [value, setValue] = useState("");
  const [taken, setTaken] = useState(() => isoDate());
  const [ownLow, setOwnLow] = useState("");
  const [ownHigh, setOwnHigh] = useState("");
  const [note, setNote] = useState("");
  const [said, setSaid] = useState<"" | "saved" | "failed">("");

  useEffect(() => {
    if (!w) { setLabs([]); return; }
    let alive = true;
    void getLabs(w).then((got) => { if (alive) setLabs(got); });
    return () => { alive = false; };
  }, [w]);

  const chosen = markerById(marker) ?? MARKERS[0];

  /* THE RANGE ON THE ROW, THE READER'S FIRST. A reference
     interval is a property of an assay and a population and is
     printed on the report they are holding; two labs differ by
     more than the changes this tool would be drawing. The
     default is offered, the boxes overwrite it, and anything
     drawn against the default says so. */
  const add = async (): Promise<void> => {
    const n = Number(value.trim());
    if (!w || !value.trim() || !Number.isFinite(n)) return;
    const saved = await saveLab(w, {
      takenOn: taken,
      marker: chosen.id,
      value: n,
      unit: chosen.unit,
      refLow: Number(ownLow) || chosen.low,
      refHigh: Number(ownHigh) || chosen.high,
      note: note.trim() || undefined,
    });
    if (!saved) { setSaid("failed"); window.setTimeout(() => setSaid(""), 4000); return; }
    setLabs((prev) => [...prev, saved].sort((a, b) => a.takenOn.localeCompare(b.takenOn)));
    setValue(""); setOwnLow(""); setOwnHigh(""); setNote("");
    setSaid("saved");
    window.setTimeout(() => setSaid(""), 1600);
  };

  const drop = async (id: string): Promise<void> => {
    if (!w) return;
    if (await removeLab(w, id)) setLabs((prev) => prev.filter((l) => l.id !== id));
  };

  const setCycle = async (patch: Profile): Promise<void> => {
    if (!w) return;
    const before = profile;
    setProfile((p) => ({ ...(p ?? {}), ...patch }));
    if (!await saveProfile(w, { ...(profile ?? {}), ...patch })) setProfile(before);
  };

  const toggle = async (id: string): Promise<void> => {
    if (!w) return;
    const next = new Set(taking);
    if (next.has(id)) next.delete(id); else next.add(id);
    const meds = [...next];
    setProfile((p) => ({ ...(p ?? {}), meds }));
    await saveProfile(w, { ...(profile ?? {}), meds });
  };

  return (
    <div className="dt-health">
      <section aria-labelledby="dt-lab-h">
        <h2 id="dt-lab-h"><T en="The numbers a clinic gives you" bn="ক্লিনিক যে সংখ্যাগুলো দেয়" /></h2>
        <p className="dt-intro">
          <T
            en="Twice a year somebody has blood taken and is handed a sheet of numbers they cannot read, which then goes in a drawer. Those are the only objective measurements in this entire tool."
            bn="বছরে দুবার রক্ত পরীক্ষা হয়, একটা কাগজ হাতে আসে যেটা পড়া যায় না, তারপর সেটা ড্রয়ারে যায়। এই পুরো যন্ত্রের একমাত্র বস্তুনিষ্ঠ মাপ ওগুলোই।"
          />
        </p>
        {/* WRITE ONE DOWN, which is the whole point of the page.
            Signed out this is still the list and the reasons: a
            reader can read what each marker is for without an
            account, and only keeping one needs a row. */}
        {answered && w ? (
          <div className="dt-lab-form">
            <Select
              id="dt-lab-marker" value={marker}
              onChange={(e) => setMarker(e.target.value)}
              label={<T en="Which number" bn="কোন সংখ্যা" />}
            >
              {MARKERS.map((m) => (
                <option key={m.id} value={m.id}>{lang === "bn" ? m.bn : m.en}</option>
              ))}
            </Select>
            <Field
              id="dt-lab-value" type="number" inputMode="decimal" step="any"
              label={<T en={`The reading, ${chosen.unit}`} bn={`মাপ, ${chosen.unit}`} />}
              value={value} onChange={(e) => setValue(e.target.value)}
            />
            <Field
              id="dt-lab-date" type="date" max={isoDate()}
              label={<T en="The date on the report" bn="রিপোর্টের তারিখ" />}
              value={taken} onChange={(e) => setTaken(e.target.value)}
            />
            <Field
              id="dt-lab-note" type="text"
              label={<T en="A note, if the week was unusual" bn="সপ্তাহটা অন্যরকম হলে একটা নোট" />}
              hint={(
                <T
                  en="Fasting or not, ill, a new medicine. Six months later this is the difference between a reading you can use and one you cannot."
                  bn="খালি পেটে কি না, অসুস্থ ছিলেন, নতুন ওষুধ। ছয় মাস পরে এই কথাটাই ঠিক করে দেয় মাপটা কাজে লাগবে কি না।"
                />
              )}
              value={note} onChange={(e) => setNote(e.target.value)}
            />
            <details className="dt-lab-own">
              <summary>
                <T en="My report's own range is different" bn="আমার রিপোর্টের সীমা আলাদা" />
              </summary>
              <p className="dt-hint">
                <T
                  en={`Left empty this uses ${chosen.from}. A reference interval belongs to the laboratory that ran the test, and two of them differ by more than the changes this tool would be drawing, so the one printed on your report is the one to use.`}
                  bn={`খালি রাখলে ব্যবহার হবে: ${chosen.from}। রেফারেন্স সীমা যে ল্যাব পরীক্ষা করেছে তার, আর দুই ল্যাবের পার্থক্য এই যন্ত্র যা আঁকবে তার চেয়ে বেশি, তাই আপনার রিপোর্টে ছাপা সীমাটাই ব্যবহার করুন।`}
                />
              </p>
              <div className="dt-lab-range">
                <Field
                  id="dt-lab-low" type="number" inputMode="decimal" step="any"
                  label={<T en="Low" bn="নিচের" />}
                  value={ownLow} onChange={(e) => setOwnLow(e.target.value)}
                />
                <Field
                  id="dt-lab-high" type="number" inputMode="decimal" step="any"
                  label={<T en="High" bn="উপরের" />}
                  value={ownHigh} onChange={(e) => setOwnHigh(e.target.value)}
                />
              </div>
            </details>
            <div className="dt-lab-go">
              <Button kind="soft" onClick={() => void add()} disabled={!value.trim()}>
                <T en="Keep this reading" bn="এই মাপটা রাখুন" />
              </Button>
              <span className="dt-save" data-state={said || "idle"}
                    role="status" aria-live="polite">
                {said === "failed"
                  ? <T en="Not saved. Nothing changed." bn="জমা হয়নি। কিছুই বদলায়নি।" />
                  : said === "saved"
                    ? <T en="Kept" bn="রাখা হয়েছে" />
                    : null}
              </span>
            </div>
          </div>
        ) : null}

        <LabHistory labs={labs} lang={lang} onDrop={drop} />

        <dl className="dt-defs">
          {MARKERS.map((m) => (
            <div key={m.id}>
              <dt><T en={m.en} bn={m.bn} /></dt>
              <dd><T en={m.why} bn={m.whyBn} /></dd>
            </div>
          ))}
        </dl>
        <p className="dt-why">
          <T
            en="The one on that list worth reading about before the appointment rather than after it is "
            bn="এই তালিকার যেটি নিয়ে সাক্ষাতের পরে নয়, আগেই পড়া উচিত সেটি হলো "
          />
          <Term id="hba1c" en="HbA1c" bn="এইচবিএ১সি" />
          <T
            en=", because it is an average of three months rather than a reading of this morning."
            bn=", কারণ এটা আজ সকালের মাপ নয়, তিন মাসের গড়।"
          />
        </p>
        <Note tone="quiet">
          <TBlock
            en={(
              <p>
                The tool prints the reference range your lab gave and nothing
                else. No interpretation, no colour on an out of range value, no
                &quot;your risk is&quot;. A reference range is a property of an
                assay rather than of a person, and everything past that point is
                a clinician&apos;s job. Units are stored rather than assumed:
                glucose is mmol/L here and commonly mg/dL on a Bangladeshi
                report, and the two differ by a factor of eighteen.
              </p>
            )}
            bn={(
              <p>
                আপনার ল্যাব যে সীমা দিয়েছে যন্ত্রটি কেবল সেটাই দেখায়, আর কিছু নয়।
                কোনো ব্যাখ্যা নেই, সীমার বাইরের সংখ্যায় কোনো রং নেই, ঝুঁকির কথা নেই।
                সীমাটা পরীক্ষার নিজের বৈশিষ্ট্য, মানুষের নয়, আর তার পরের সবটাই
                চিকিৎসকের কাজ। এককও ধরে নেওয়া হয় না, লিখে রাখা হয়: এখানে গ্লুকোজ
                mmol/L, আর বাংলাদেশি রিপোর্টে সাধারণত mg/dL, আর দুটোর মধ্যে আঠারো
                গুণ পার্থক্য।
              </p>
            )}
          />
        </Note>
      </section>

      <section aria-labelledby="dt-med-h">
        <h2 id="dt-med-h"><T en="Medicine that changes the arithmetic" bn="যে ওষুধ হিসাব বদলে দেয়" /></h2>
        <p className="dt-intro">
          <T
            en="Several very ordinary medicines change what these equations mean, and a tracker that does not know about them silently produces wrong readings and lets the reader conclude something about themselves. This is not a drug database and it interacts with nothing."
            bn="খুব সাধারণ কয়েকটি ওষুধ এই হিসাবগুলোর মানে বদলে দেয়, আর যে খাতা সেটা জানে না সে চুপচাপ ভুল হিসাব দেয় আর পাঠককে নিজের সম্পর্কে ভুল সিদ্ধান্তে পৌঁছে দেয়। এটা ওষুধের ডেটাবেস নয় আর কিছুর সঙ্গে মেলায় না।"
          />
        </p>
        {answered && w ? (
          <div className="dt-tags" role="group"
               aria-label={lang === "bn" ? "আপনি কী নেন" : "What you take"}>
            {MEDS.map((m) => (
              <ChipButton key={m.id} pressed={taking.has(m.id)} onClick={() => void toggle(m.id)}>
                <T en={m.en} bn={m.bn} />
              </ChipButton>
            ))}
          </div>
        ) : null}
        {/* EVERY EXPLANATION, ALWAYS. This filtered to what the
            reader had ticked, so the list was complete until
            somebody ticked anything and then collapsed to their
            own: a reader on a diuretic could not read what
            insulin does to these charts before starting a
            deficit, and that sentence is the strongest warning
            in this tool. Ticking marks a row; it does not hide
            the others. */}
        <dl className="dt-defs">
          {MEDS.map((m) => (
            <div key={m.id} data-taking={taking.has(m.id) ? "yes" : undefined}>
              <dt>
                <T en={m.en} bn={m.bn} />
                {taking.has(m.id) ? (
                  <span className="dt-yours">
                    <T en="you take this" bn="আপনি এটি নেন" />
                  </span>
                ) : null}
              </dt>
              <dd><T en={m.does} bn={m.doesBn} /></dd>
            </div>
          ))}
        </dl>
        <Note tone="warn">
          <TBlock
            en={(
              <p>
                Nothing here is a reason to start, stop or change a dose, and the
                tool never adjusts a number because of a medicine. Adjusting an
                equation for a drug would be practising medicine with arithmetic;
                saying what the drug does to a reading is explaining a chart.
              </p>
            )}
            bn={(
              <p>
                এখানকার কিছুই ওষুধ শুরু, বন্ধ বা ডোজ বদলানোর কারণ নয়, আর ওষুধের
                জন্য যন্ত্রটি কোনো সংখ্যা বদলায় না। ওষুধের জন্য সূত্র বদলানো মানে
                হিসাব দিয়ে চিকিৎসা করা; ওষুধ একটা মাপে কী করে তা বলা মানে চার্ট
                বুঝিয়ে দেওয়া।
              </p>
            )}
          />
        </Note>
      </section>

      {/* SECTION 18'S FIRST PIECE. A monthly cycle moves the
          scale one to two kilograms with no change in fat at
          all, and a reader who does not know that reads a
          fortnight of it as a stall and quits. Named here rather
          than on the trend page because it belongs with the
          other things about a body that change what a chart
          means, and because nothing on the trend page can see
          it: this tool does not ask, and will not. */}
      <section aria-labelledby="dt-cycle-h">
        <h2 id="dt-cycle-h"><T en="A month is longer than a week" bn="মাস সপ্তাহের চেয়ে বড়" /></h2>
        <p className="dt-intro">
          <T
            en="Water retention rises through "
            bn="শরীরে পানি জমে "
          />
          <Term id="luteal" en="the luteal phase" bn="মাসিক চক্রের শেষ পর্বে" />
          <T
            en=", the roughly two weeks before a period, so the scale can climb one to two kilograms and then drop it in a day. Across a whole cycle the trend is honest; across ten days inside one it is not, and a fortnight that reads as a stall is the commonest reason people stop."
            bn="। মাসিকের আগের প্রায় দুই সপ্তাহে, তাই দাঁড়িপাল্লা এক দুই কেজি উঠতে পারে আর তারপর একদিনেই নেমে যায়। পুরো চক্র ধরে দেখলে ধারা সৎ; ভেতরের দশ দিন ধরে দেখলে নয়, আর দুই সপ্তাহ আটকে আছে মনে হওয়াই মানুষের ছেড়ে দেওয়ার সবচেয়ে সাধারণ কারণ।"
          />
        </p>
        {/* OFF BY DEFAULT, ONE DATE, ASKED ONCE. The tool stores a
            start and a length rather than a log of periods,
            because everything it does with this is arithmetic on
            a repeating interval: a calendar of somebody's
            periods would be a more sensitive record collected
            for no extra answer, and not collecting it is the
            only way to be sure it cannot leak. */}
        {answered && w ? (
          <div className="dt-cycle-set">
            <ChipButton
              pressed={!!profile?.cycle_tracking}
              onClick={() => void setCycle({ cycle_tracking: !profile?.cycle_tracking })}
            >
              <T en="Read my cycle into the trend" bn="আমার চক্র ধারার হিসাবে ধরুন" />
            </ChipButton>

            {profile?.cycle_tracking ? (
              <div className="dt-cycle-when">
                <Field
                  id="dt-cycle-start" type="date" max={isoDate()}
                  label={<T en="The first day of your last period" bn="শেষ মাসিকের প্রথম দিন" />}
                  hint={(
                    <T
                      en="One date. The tool works the rest out and does not ask again."
                      bn="একটা তারিখ। বাকিটা যন্ত্র নিজেই হিসাব করে, আর আর জিজ্ঞেস করে না।"
                    />
                  )}
                  value={profile.cycle_start ?? ""}
                  onChange={(e) => void setCycle({ cycle_start: e.target.value || undefined })}
                />
                <Field
                  id="dt-cycle-days" type="number" inputMode="numeric" min={21} max={35}
                  label={<T en="How many days it usually runs" bn="সাধারণত কত দিনের চক্র" />}
                  hint={(
                    <T
                      en="Left empty this assumes 28, which is the median, and says so wherever it uses it."
                      bn="খালি রাখলে ২৮ ধরে নেওয়া হয়, যেটা মাঝামাঝি সংখ্যা, আর যেখানেই ব্যবহার হয় সেখানে সেটা বলা থাকে।"
                    />
                  )}
                  value={profile.cycle_days ? String(profile.cycle_days) : ""}
                  onChange={(e) => void setCycle({
                    cycle_days: Number(e.target.value) || undefined,
                  })}
                />
              </div>
            ) : null}
          </div>
        ) : null}

        <Note tone="quiet">
          <TBlock
            en={(
              <p>
                Turned off, this tool asks nothing about a cycle and keeps no
                date. Turned on it keeps one date and one number, never a log of
                periods: everything it does with them is arithmetic on a
                repeating interval, so a diary would be a more sensitive record
                collected for no extra answer.
              </p>
            )}
            bn={(
              <p>
                বন্ধ থাকলে এই যন্ত্র চক্র নিয়ে কিছুই জিজ্ঞেস করে না আর কোনো তারিখ
                রাখে না। চালু করলে একটা তারিখ আর একটা সংখ্যা রাখে, মাসিকের কোনো
                খাতা নয়: এগুলো দিয়ে যা করা হয় তার সবটাই একটা পুনরাবৃত্ত ব্যবধানের
                হিসাব, তাই খাতা রাখা মানে বাড়তি কোনো উত্তর ছাড়াই আরও স্পর্শকাতর
                তথ্য জমানো।
              </p>
            )}
          />
        </Note>
      </section>
    </div>
  );
}

    /** WHAT HAS BEEN KEPT, one marker at a time. A reading of any of these
        is a line over time rather than a latest value, so every marker
        with more than one reading gets the direction it moved, in its own
        units, against the range it is being read against.

        IT NEVER GRADES: no red, no "high", no verdict. `worseHigh` says
        which way a change went and nothing else. Deciding what a number
        means about a person is what the appointment is for. */
function LabHistory({ labs, lang, onDrop }: {
  labs: Lab[];
  lang: "en" | "bn";
  onDrop: (id: string) => void;
}) {
  if (!labs.length) return null;

  const byMarker = MARKERS
    .map((m) => ({ m, rows: labs.filter((l) => l.marker === m.id) }))
    .filter((g) => g.rows.length);

  return (
    <div className="dt-labs">
      {byMarker.map(({ m, rows }) => {
        const last = rows[rows.length - 1];
        const first = rows[0];
        const moved = rows.length > 1 ? last.value - first.value : null;
        const own = last.refLow !== m.low || last.refHigh !== m.high;
        return (
          <div className="dt-figure" key={m.id}>
            <h3><T en={m.en} bn={m.bn} /></h3>
            <p className="dt-value">
              <T en={`${last.value} ${last.unit}`}
                 bn={`${digits(last.value, "bn")} ${last.unit}`} />
            </p>
            <p className="dt-said">
              {moved === null
                ? <T en={`one reading, ${last.takenOn}`}
                     bn={`একটি মাপ, ${last.takenOn}`} />
                : <T
                    en={`${moved === 0 ? "unchanged" : moved > 0 ? "up" : "down"}`
                      + `${moved === 0 ? "" : ` ${Math.abs(moved).toFixed(2).replace(/\.?0+$/, "")} ${last.unit}`}`
                      + ` over ${rows.length} readings since ${first.takenOn}`}
                    bn={`${first.takenOn} থেকে ${digits(rows.length, "bn")}টি মাপে `
                      + `${moved === 0 ? "বদলায়নি"
                        : `${digits(Math.abs(moved).toFixed(2).replace(/\.?0+$/, ""), "bn")} ${last.unit} `
                          + `${moved > 0 ? "বেড়েছে" : "কমেছে"}`}`}
                  />}
            </p>
            <p className="dt-why">
              {last.refLow != null || last.refHigh != null ? (
                <T
                  en={`Read against ${last.refLow != null && last.refHigh != null
                    ? `${last.refLow} to ${last.refHigh}`
                    : last.refLow != null ? `${last.refLow} and above` : `${last.refHigh} and below`}`
                    + `${own ? ", off your own report." : `, which is this tool's default: ${m.from}.`}`}
                  bn={`যে সীমার বিপরীতে পড়া হচ্ছে: ${last.refLow != null && last.refHigh != null
                    ? `${digits(last.refLow, "bn")} থেকে ${digits(last.refHigh, "bn")}`
                    : last.refLow != null ? `${digits(last.refLow, "bn")} বা তার বেশি`
                      : `${digits(last.refHigh as number, "bn")} বা তার কম`}`
                    + `${own ? ", আপনার নিজের রিপোর্ট থেকে।" : `, এটি এই যন্ত্রের ধরে নেওয়া সীমা: ${m.from}।`}`}
                />
              ) : (
                <T en="No range on this one, so it is a figure over time and nothing else."
                   bn="এটির কোনো সীমা দেওয়া নেই, তাই এটা কেবল সময়ের সঙ্গে একটা সংখ্যা, আর কিছু নয়।" />
              )}
            </p>
            <ul className="dt-lab-rows">
              {[...rows].reverse().map((l) => (
                <li key={l.id ?? `${l.takenOn}-${l.value}`}>
                  <span className="mono">{digits(l.value, lang)}</span>
                  <span>{l.takenOn}{l.note ? `, ${l.note}` : ""}</span>
                  {l.id ? (
                    <button
                      type="button" className="dt-drop"
                      onClick={() => onDrop(l.id as string)}
                      aria-label={lang === "bn"
                        ? `${l.takenOn} এর ${m.bn} মুছুন`
                        : `Remove the ${m.en} from ${l.takenOn}`}
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
