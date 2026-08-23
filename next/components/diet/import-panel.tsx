"use client";

/* ============================================================
   diet/import-panel.tsx: arriving from another app.

   `DIET.md` section 26. "Leaving should be as easy as arriving"
   is already this site's rule about accounts, and the reverse is
   what stops somebody arriving at all: a reader with three years
   of data elsewhere is being asked to abandon it.

   ---- the preview screen is the whole feature ----

   An importer that guesses silently is an importer that fills a
   year of somebody's history with the wrong column, and the
   reader finds out in March. So this shows, before anything is
   written: which column it thinks is which, HOW SURE IT IS of
   each guess, the first rows as they would be read, the span of
   dates, and every row it would drop with the reason.

   Nothing is committed until a button is pressed, and the
   parsing is `shared/csv.ts`, which has no DOM in it and is
   tested under plain node. A parser that can only be exercised
   by clicking is a parser nobody exercises.

   ---- and a bad import is undone as one operation ----

   Every row carries `origin` of `import:<name>` rather than
   `logged`, so an imported year and a logged year can be told
   apart, and undoing is one delete rather than three hundred.

   ---- the file never leaves the browser ----

   It is read with `FileReader` and parsed here. Nothing is
   uploaded anywhere: what reaches the network is the rows the
   reader agreed to, going to their own account.
   ============================================================ */

import { useState } from "react";
import {
  parseCSV, guessColumns, preview,
  type Field, type Preview, type Sheet,
} from "@reiad/shared/csv";
import type { Day } from "@reiad/shared/diet";
import { importDays, undoImport, importOrigins, who, type Who } from "../../lib/diet-api";
import { Button } from "../ui/button";
import { Select } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";

const FIELDS: Array<{ id: Field; en: string; bn: string }> = [
  { id: "ignore", en: "Ignore this column", bn: "এই কলামটা বাদ" },
  { id: "date", en: "The date", bn: "তারিখ" },
  { id: "weightKg", en: "Weight, kg", bn: "ওজন, কেজি" },
  { id: "kcal", en: "Calories", bn: "ক্যালোরি" },
  { id: "proteinG", en: "Protein, g", bn: "প্রোটিন, গ্রাম" },
  { id: "carbsG", en: "Carbohydrate, g", bn: "শর্করা, গ্রাম" },
  { id: "fatG", en: "Fat, g", bn: "চর্বি, গ্রাম" },
  { id: "fibreG", en: "Fibre, g", bn: "আঁশ, গ্রাম" },
  { id: "steps", en: "Steps", bn: "পদক্ষেপ" },
  { id: "waterMl", en: "Water, ml", bn: "পানি, মিলি" },
  { id: "sleepHours", en: "Sleep, hours", bn: "ঘুম, ঘণ্টা" },
  { id: "note", en: "A note", bn: "নোট" },
];

export function ImportPanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [name, setName] = useState("");
  const [sheet, setSheet] = useState<Sheet | null>(null);
  const [mapping, setMapping] = useState<Field[]>([]);
  const [guesses, setGuesses] = useState<Array<"exact" | "loose" | "none">>([]);
  const [done, setDone] = useState<{ written: number; failed: number } | null>(null);
  const [origins, setOrigins] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useState(() => {
    void who().then(async (me) => {
      setW(me);
      setAnswered(true);
      if (me) setOrigins(await importOrigins(me));
    });
    return undefined;
  });

  const take = (file: File): void => {
    const reader = new FileReader();
    reader.onload = () => {
      const parsed = parseCSV(String(reader.result ?? ""));
      const g = guessColumns(parsed.header);
      setSheet(parsed);
      setMapping(g.map((x) => x.field));
      setGuesses(g.map((x) => x.how));
      setName(file.name.replace(/\.csv$/i, "").slice(0, 40));
      setDone(null);
    };
    reader.readAsText(file);
  };

  const shown: Preview | null = sheet ? preview(sheet, mapping) : null;

  const commit = async (): Promise<void> => {
    if (!w || !shown?.rows.length) return;
    setBusy(true);
    const days: Day[] = shown.rows.map((r) => ({ ...r, date: r.date }));
    const got = await importDays(w, days, `import:${name || "csv"}`);
    setDone(got);
    setOrigins(await importOrigins(w));
    setBusy(false);
  };

  const undo = async (origin: string): Promise<void> => {
    if (!w) return;
    setBusy(true);
    await undoImport(w, origin);
    setOrigins(await importOrigins(w));
    setBusy(false);
  };

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;
  if (!w) {
    return (
      <p className="dt-intro">
        <T
          en="An import writes days on to an account, so this one needs you to be signed in. Nothing is uploaded: the file is read in this browser and only the rows you agree to are sent."
          bn="আমদানি করলে দিনগুলো অ্যাকাউন্টে লেখা হয়, তাই এর জন্য সাইন ইন লাগে। ফাইল কোথাও পাঠানো হয় না: এটা এই ব্রাউজারেই পড়া হয়, আর আপনি যে সারিগুলোতে রাজি হবেন কেবল সেগুলোই যায়।"
        />
      </p>
    );
  }

  return (
    <div className="dt-import">
      <section aria-labelledby="dt-import-h">
        <h2 id="dt-import-h">
          <T en="Bring a file from another app" bn="অন্য অ্যাপ থেকে ফাইল আনুন" />
        </h2>
        <TBlock
          en={(
            <p className="dt-intro">
              MyFitnessPal, Cronometer and LoseIt all export CSV, and so does
              every scale worth owning. The file is read in this browser and
              nothing is written until you have looked at what it would write.
            </p>
          )}
          bn={(
            <p className="dt-intro">
              মাইফিটনেসপাল, ক্রোনোমিটার আর লুজইট সবই সিএসভি ফাইল দেয়, আর কাজের
              প্রতিটা দাঁড়িপাল্লাও দেয়। ফাইলটা এই ব্রাউজারেই পড়া হয়, আর কী লেখা হবে
              তা আপনি দেখে না নেওয়া পর্যন্ত কিছুই লেখা হয় না।
            </p>
          )}
        />

        <label className="dt-import-pick">
          <span><T en="Choose a CSV" bn="একটা সিএসভি বাছুন" /></span>
          <input
            type="file" accept=".csv,text/csv"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) take(f); }}
          />
        </label>
      </section>

      {sheet && shown ? (
        <section aria-labelledby="dt-map-h">
          <h2 id="dt-map-h"><T en="What it would write" bn="কী লেখা হবে" /></h2>
          <p className="dt-intro">
            <T
              en={`${shown.rows.length} days would be written${shown.from ? `, from ${shown.from} to ${shown.to}` : ""}. ${shown.skipped.length} rows would be dropped. Check the dates: a file that reads as the wrong year is a file whose date column was misread.`}
              bn={`${digits(shown.rows.length, "bn")} দিন লেখা হবে${shown.from ? `, ${shown.from} থেকে ${shown.to} পর্যন্ত` : ""}। ${digits(shown.skipped.length, "bn")}টি সারি বাদ যাবে। তারিখগুলো দেখে নিন: ভুল বছর দেখালে বুঝতে হবে তারিখের কলামটা ভুল পড়া হয়েছে।`}
            />
          </p>

          <div className="dt-map">
            {sheet.header.map((h, i) => (
              <div className="dt-map-col" key={`${h}-${i}`}>
                <Select
                  id={`dt-map-${i}`}
                  value={mapping[i]}
                  onChange={(e) => setMapping((m) => {
                    const next = [...m];
                    next[i] = e.target.value as Field;
                    return next;
                  })}
                  label={<span className="mono">{h || `#${i + 1}`}</span>}
                  hint={(
                    <T
                      en={guesses[i] === "exact" ? "matched by name"
                        : guesses[i] === "loose" ? "a loose match: check this one"
                          : "not recognised, so it is ignored unless you say otherwise"}
                      bn={guesses[i] === "exact" ? "নাম মিলেছে"
                        : guesses[i] === "loose" ? "আন্দাজে মেলানো: এটা দেখে নিন"
                          : "চেনা যায়নি, তাই আপনি না বললে বাদ থাকবে"}
                    />
                  )}
                >
                  {FIELDS.map((f) => (
                    <option key={f.id} value={f.id}>{lang === "bn" ? f.bn : f.en}</option>
                  ))}
                </Select>
                <p className="dt-map-eg mono">
                  {sheet.rows.slice(0, 3).map((r) => r[i]).filter(Boolean).join(" · ") || "–"}
                </p>
              </div>
            ))}
          </div>

          {shown.skipped.length ? (
            <details className="dt-import-drop">
              <summary>
                <T en={`${shown.skipped.length} rows would be dropped`}
                   bn={`${digits(shown.skipped.length, "bn")}টি সারি বাদ যাবে`} />
              </summary>
              <ul className="dt-import-why">
                {shown.skipped.slice(0, 40).map((sk, i) => (
                  <li key={i}>
                    <span className="mono">{digits(sk.line, lang)}</span> {sk.why}
                  </li>
                ))}
              </ul>
            </details>
          ) : null}

          <div className="dt-import-go">
            <Button kind="solid" disabled={!shown.rows.length || busy}
                    onClick={() => void commit()}>
              <T en={`Write these ${shown.rows.length} days`}
                 bn={`এই ${digits(shown.rows.length, "bn")} দিন লিখুন`} />
            </Button>
            {done ? (
              <span className="dt-said" role="status" aria-live="polite">
                <T en={`${done.written} written${done.failed ? `, ${done.failed} failed` : ""}.`}
                   bn={`${digits(done.written, "bn")}টি লেখা হয়েছে${done.failed ? `, ${digits(done.failed, "bn")}টি হয়নি` : ""}।`} />
              </span>
            ) : null}
          </div>

          <Note tone="quiet">
            <TBlock
              en={(
                <p>
                  A day already logged here is replaced by the imported one,
                  which is the right way round: you chose to import, and the
                  alternative is a file that half applies with no way to tell
                  which half. Every imported day is marked as imported and the
                  whole import can be undone in one press.
                </p>
              )}
              bn={(
                <p>
                  এখানে আগে লেখা কোনো দিন থাকলে আমদানি করা দিনটি তার জায়গা নেবে,
                  আর এটাই ঠিক: আপনি নিজে আমদানি করতে চেয়েছেন, আর নইলে ফাইলটা
                  অর্ধেক বসত আর কোন অর্ধেক তা বোঝার উপায় থাকত না। প্রতিটি আমদানি
                  করা দিন চিহ্নিত থাকে, আর পুরো আমদানি এক চাপে ফেরত নেওয়া যায়।
                </p>
              )}
            />
          </Note>
        </section>
      ) : null}

      {origins.length ? (
        <section aria-labelledby="dt-undo-h">
          <h2 id="dt-undo-h"><T en="Imports on this account" bn="এই অ্যাকাউন্টে যা আমদানি হয়েছে" /></h2>
          <p className="dt-intro">
            <T
              en="Each one is undone as a single operation, which is the whole reason an imported day carries where it came from."
              bn="প্রতিটি এক ধাপেই ফেরত নেওয়া যায়, আর আমদানি করা দিনে কোথা থেকে এসেছে তা লেখা থাকার কারণই এটা।"
            />
          </p>
          <ul className="dt-import-list">
            {origins.map((o) => (
              <li key={o}>
                <span className="mono">{o}</span>
                <Button size="sm" disabled={busy} onClick={() => void undo(o)}>
                  <T en="Undo this import" bn="এই আমদানি ফেরত নিন" />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
