"use client";

/* ============================================================
   diet/food-picker.tsx: food found rather than typed.

   `DIET.md` sections 12, 13 and 22. A tool that makes somebody
   type "chicken curry, 380" from memory is a tool they use for
   four days, so food is SEARCHED, and the search reaches three
   places: this site's own portion library, and two open
   databases through the Worker.

   ---- a result is not an entry, and that gap is the tool ----

   Every figure that arrives here is stated FOR something: per
   100 g out of either database, per cup or per plate out of the
   library. What was eaten is a different number, so the portion
   is printed on every result and there is a step between the tap
   and the row where the reader says how much.

   It logged the row's own portion once, silently, with no unit
   on screen: a tap on "chicken breast" after eating 250 g put
   165 kcal in the log. An error in the flattering direction is
   the failure this whole tool is built around, so `scaleTo()`
   REFUSES an amount it cannot scale honestly and nothing is
   written rather than something being guessed.

   ---- everything is scaled, never just the calories ----

   `loggedFrom()` in `shared/foods.ts` is the whole of that
   arithmetic and it is asserted in `functions/_lib/food.test.ts`.
   Scaling the energy alone is how a log ends up reading 2,400
   kcal and 40 g of protein.

   ---- the source is printed on every result, always ----

   A reader has to be able to tell a figure this site checked
   from a figure a stranger typed into a public database from a
   figure out of a government laboratory. Almost no app shows
   this and it is the difference between a number and a rumour.
   `completeness` is the second half of it: a crowdsourced row
   missing half its fields has to LOOK worse than a laboratory
   one.

   ---- and the browser never talks to either upstream ----

   `/api/diet/food` and nothing else, exactly as `/tools/live`
   asks `/api/broker/*` rather than talking to Trading 212. The
   CSP does not change, `check-csp.ts` scans every string here,
   and a hostname written into this file would rightly fail it.

   ---- a found food is copied, not referenced ----

   What goes into the row is the numbers, the source and the
   upstream id, so the log does not depend on a public database
   still being there next year. A history that changed because
   somebody edited an entry in one would be worse than one that
   went missing: nothing would announce it.
   ============================================================ */

import { useEffect, useState } from "react";
import type { Entry } from "@reiad/shared/diet";
import {
  DEFAULT_PLACE, barcodeOf, loggedFrom, portionWords, scaleTo,
  search as searchLibrary,
  type FoundFood, type Place, type Portion,
} from "@reiad/shared/foods";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { T, digits, useToolLang } from "./lang";

/** A result, whatever it came from. It IS a `FoundFood`, so it
    goes into `loggedFrom()` with nothing to adapt, and the four
    fields on top are what the list draws rather than what the
    log stores. */
interface Hit extends FoundFood {
  id: string;
  source: string;
  brand?: string;
  /** Where a library row's figure came from ("USDA FoodData
      Central, SR Legacy"). A `Portion`'s own `source` is that
      citation, and an entry's `source` is the WORD for which of
      the three places answered, so the two cannot share a name. */
  cite?: string;
  /** How much of the upstream record is there, 0 to 1. Only the
      two public databases carry one: the library's rows are not
      scored on the same nine fields and a flat 1 here would be a
      claim nobody checked. */
  completeness?: number;
}

/** What the Worker sends. Its own shape, read once, here. */
interface WireHit {
  id: string;
  source: string;
  label: string;
  brand?: string;
  qty: number;
  unit: string;
  grams?: number;
  kcal: number;
  protein?: number; carbs?: number; fat?: number; fibre?: number;
  sodium?: number; iron?: number; calcium?: number; satfat?: number;
  completeness?: number;
}

type UpstreamState = "ok" | "failed" | "unconfigured" | "skipped";

interface Answer {
  results?: WireHit[];
  result?: WireHit | null;
  sources?: Partial<Record<"off" | "fdc", UpstreamState>>;
}

const SOURCE_WORD: Record<string, { en: string; bn: string }> = {
  library: { en: "checked here", bn: "এখানে যাচাই করা" },
  own:     { en: "yours", bn: "আপনার নিজের" },
  fdc:     { en: "US food lab", bn: "মার্কিন খাদ্য গবেষণাগার" },
  off:     { en: "open database", bn: "মুক্ত ডেটাবেস" },
  label:   { en: "off the packet", bn: "প্যাকেটের গায়ে লেখা" },
  free:    { en: "typed in", bn: "নিজে লেখা" },
};

/** What a database that did not answer is called on the page. A
    search where one of the two is missing says so: half a list
    that looks whole is the untrue sentence this route's
    `sources` field exists to prevent. */
const UPSTREAM: Record<string, { en: string; bn: string }> = {
  off: { en: "The open database", bn: "মুক্ত ডেটাবেস" },
  fdc: { en: "The US food lab", bn: "মার্কিন খাদ্য গবেষণাগার" },
};

/** The back of a UK packet, which is per 100 g by law. `salt` is
    on it and sodium is not: they differ by the mass of the
    chloride, and this list is in milligrams. */
const SALT_TO_SODIUM_MG = 400;

const LABEL_FIELDS = [
  { key: "kcal", en: "Energy, kcal", bn: "শক্তি, ক্যালোরি" },
  { key: "protein", en: "Protein, g", bn: "প্রোটিন, গ্রাম" },
  { key: "carbs", en: "Carbohydrate, g", bn: "শর্করা, গ্রাম" },
  { key: "fat", en: "Fat, g", bn: "চর্বি, গ্রাম" },
  { key: "satfat", en: "of which saturates, g", bn: "তার মধ্যে স্যাচুরেটেড চর্বি, গ্রাম" },
  { key: "fibre", en: "Fibre, g", bn: "আঁশ, গ্রাম" },
  { key: "salt", en: "Salt, g", bn: "লবণ, গ্রাম" },
] as const;

type LabelKey = (typeof LABEL_FIELDS)[number]["key"];

const EMPTY_LABEL: Record<LabelKey | "name" | "grams", string> = {
  name: "", kcal: "", protein: "", carbs: "", fat: "", satfat: "",
  fibre: "", salt: "", grams: "",
};

/** A figure typed into a box. Empty is ABSENT rather than zero:
    a zero reads as "none of it" and is worse than silence, which
    is `shared/foods.ts`'s own rule about a nutrient nobody
    knows. */
const typed = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n >= 0 ? n : undefined;
};

const round2 = (n: number): number => Math.round(n * 100) / 100;

/** A library row, as a result. `source` is deliberately written
    AFTER the spread: a `Portion` carries its citation under that
    name and this list needs the word for which place answered. */
const fromLibrary = (f: Portion): Hit => ({
  ...f,
  id: `library:${f.id}`,
  source: "library",
  cite: f.source,
});

const fromWire = (w: WireHit): Hit => ({ ...w, en: w.label, bn: undefined });

export function FoodPicker({ onPick, place = DEFAULT_PLACE }: {
  onPick: (e: Omit<Entry, "date">) => void;
  /** Which portion library leads. The other country's is
      still searched, because a reader in Dhaka who eats
      porridge should still find it. */
  place?: Place;
}) {
  const lang = useToolLang();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [sources, setSources] = useState<Answer["sources"]>(undefined);
  const [looking, setLooking] = useState(false);
  const [free, setFree] = useState({ label: "", kcal: "" });
  const [sheet, setSheet] = useState(EMPTY_LABEL);

  /* The step between the tap and the row. `chosen` is what was
     tapped, `amount` and `unit` are what the reader says they
     ate, and nothing is written until they press Add. */
  const [chosen, setChosen] = useState<Hit | null>(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");

  useEffect(() => {
    const asked = q.trim();
    setChosen(null);
    if (asked.length < 2) { setHits([]); setSources(undefined); setLooking(false); return; }

    /* THE SITE'S OWN LIBRARY LEADS, and it answers with no
       request at all. It is small on purpose, it is the only
       source with real Bangladeshi home cooking in it, it is the
       only one written in both languages, and it is the only one
       whose figures this site has checked. A reader typing
       "rice" should not wait on a round trip to find out what a
       cup of it is.

       The two open databases come from the Worker underneath,
       and their results are appended rather than merged, so the
       ranking never mixes a checked figure into a list of
       strangers' ones. */
    const code = barcodeOf(asked);
    const own: Hit[] = code
      ? []
      : searchLibrary(asked, place).slice(0, 6).map(fromLibrary);
    setHits(own);
    setSources(undefined);

    /* Debounced, because a request per keystroke is a request
       per keystroke for everybody, and the Worker caches by
       query rather than by reader.

       SEQUENCED as well, which the debounce alone does not do:
       an answer for "ric" that arrives after the answer for
       "rice" would replace the list with the older one. `live`
       is per effect, so a request whose query is no longer on
       screen cannot write to state, and the abort saves the
       round trip as well. */
    let live = true;
    const stop = new AbortController();
    const timer = window.setTimeout(() => {
      setLooking(true);
      /* A number read off a packet is a lookup rather than a
         search: Open Food Facts is keyed on it. Typed rather than
         scanned, because `Permissions-Policy` on this site is
         `camera=()`. */
      const url = code
        ? `/api/diet/food/${code}`
        : `/api/diet/food?q=${encodeURIComponent(asked)}&place=${place}`;
      void fetch(url, { signal: stop.signal })
        .then((r) => (r.ok ? r.json() as Promise<Answer> : {} as Answer))
        .then((d) => {
          if (!live) return;
          const found = d.results ?? (d.result ? [d.result] : []);
          setHits([...own, ...found.map(fromWire)]);
          setSources(d.sources);
        })
        .catch(() => { if (live) setHits(own); })
        .finally(() => { if (live) setLooking(false); });
    }, 300);

    return () => { live = false; stop.abort(); window.clearTimeout(timer); };
  }, [q, place]);

  /* Opening the step does not log anything. The box opens at the
     portion the row STATES, in the row's own unit, which is the
     one number here that is not a guess. */
  const take = (h: Hit): void => {
    setChosen(h);
    setAmount(String(h.qty));
    setUnit(h.unit);
    window.setTimeout(() => document.getElementById("dt-ate-n")?.focus(), 0);
  };

  const eaten = { n: Number(amount), unit };
  const preview = chosen ? scaleTo(chosen, eaten) : null;

  /** The same food said the other way. The factor is what both
      units describe, so switching one to the other keeps the
      amount rather than resetting it. */
  const measureIn = (next: string): void => {
    if (!chosen || next === unit) return;
    const now = scaleTo(chosen, eaten);
    const factor = now?.factor ?? 1;
    setAmount(String(round2(
      next === "g" ? (chosen.grams ?? 0) * factor : chosen.qty * factor,
    )));
    setUnit(next);
  };

  const add = (): void => {
    if (!chosen) return;
    const row = loggedFrom(chosen, eaten, { source: chosen.source, sourceId: chosen.id });
    /* Null is a refusal and nothing is logged. See the banner. */
    if (!row) return;
    onPick(row);
    setChosen(null);
    setQ("");
    setHits([]);
  };

  /** The packet, as a per 100 g row. Nothing is invented: a field
      left empty stays absent all the way into the log. */
  const packet = (): FoundFood | null => {
    const kcal = typed(sheet.kcal);
    if (!sheet.name.trim() || kcal === undefined) return null;
    const salt = typed(sheet.salt);
    return {
      en: sheet.name.trim(),
      qty: 100, unit: "g", grams: 100,
      kcal,
      protein: typed(sheet.protein),
      carbs: typed(sheet.carbs),
      fat: typed(sheet.fat),
      fibre: typed(sheet.fibre),
      satfat: typed(sheet.satfat),
      sodium: salt === undefined ? undefined : round2(salt * SALT_TO_SODIUM_MG),
    };
  };

  const fromPacket = (): void => {
    const food = packet();
    if (!food) return;
    const row = loggedFrom(food, { n: Number(sheet.grams), unit: "g" }, { source: "label" });
    if (!row) return;
    onPick(row);
    setSheet(EMPTY_LABEL);
  };

  const said = (h: Hit, l: "en" | "bn"): string =>
    portionWords(l === "bn" ? digits(h.qty, "bn") : h.qty, h.unit, l);

  return (
    <div className="dt-picker">
      <label className="dt-picker-label" htmlFor="dt-food-q">
        <T en="Add something you ate" bn="যা খেয়েছেন যোগ করুন" />
      </label>
      <input
        id="dt-food-q" className="dt-picker-box" type="search" autoComplete="off"
        placeholder={lang === "bn" ? "ভাত, ডিম, রুটি…" : "rice, egg, bread…"}
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {looking ? <p className="dt-hint"><T en="Looking" bn="খোঁজা হচ্ছে" /></p> : null}

      {/* HOW MUCH, before anything is written. */}
      {chosen ? (
        <div className="dt-measure">
          <p className="dt-measure-what">
            <T en={chosen.en} bn={chosen.bn ?? chosen.en} />
            {chosen.brand ? <span className="dt-hit-brand"> {chosen.brand}</span> : null}
          </p>
          <p className="dt-hint">
            <T
              en={`These figures are for ${said(chosen, "en")}${
                chosen.grams !== undefined && chosen.unit !== "g"
                  ? ` (${chosen.grams} g)` : ""
              }, and ${Math.round(chosen.kcal)} kcal.`}
              bn={`এই সংখ্যাগুলো ${said(chosen, "bn")}${
                chosen.grams !== undefined && chosen.unit !== "g"
                  ? ` (${digits(chosen.grams, "bn")} গ্রাম)` : ""
              } আর ${digits(Math.round(chosen.kcal), "bn")} ক্যালোরির জন্য।`}
            />
          </p>

          <label className="dt-picker-label" htmlFor="dt-ate-n">
            <T en="How much did you eat" bn="কতটা খেয়েছেন" />
          </label>
          <div className="dt-measure-row">
            <input
              id="dt-ate-n" className="dt-picker-box dt-picker-num"
              type="number" inputMode="decimal" step="any" min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {chosen.grams !== undefined && chosen.unit !== "g" ? (
              <div className="dt-tags" role="group"
                   aria-label={lang === "bn" ? "কোন এককে" : "In which unit"}>
                <ChipButton pressed={unit === chosen.unit}
                            onClick={() => measureIn(chosen.unit)}>
                  <T
                    en={portionWords("", chosen.unit, "en").trim()}
                    bn={portionWords("", chosen.unit, "bn").trim()}
                  />
                </ChipButton>
                <ChipButton pressed={unit === "g"} onClick={() => measureIn("g")}>
                  <T en="g" bn="গ্রাম" />
                </ChipButton>
              </div>
            ) : (
              <span className="dt-hit-por">
                <T
                  en={portionWords("", unit, "en").trim()}
                  bn={portionWords("", unit, "bn").trim()}
                />
              </span>
            )}
          </div>

          <p className="dt-measure-sum">
            {preview ? (
              <T
                en={`That is ${Math.round(preview.kcal)} kcal${
                  preview.macros.protein !== undefined
                    ? `, ${preview.macros.protein} g protein` : ""
                }${preview.grams !== undefined ? `, ${preview.grams} g` : ""}.`}
                bn={`মানে ${digits(Math.round(preview.kcal), "bn")} ক্যালোরি${
                  preview.macros.protein !== undefined
                    ? `, ${digits(preview.macros.protein, "bn")} গ্রাম প্রোটিন` : ""
                }${preview.grams !== undefined
                  ? `, ${digits(preview.grams, "bn")} গ্রাম` : ""}।`}
              />
            ) : (
              <T
                en="Say how much, and this will log exactly that much of it."
                bn="কতটা খেয়েছেন লিখুন, ঠিক ততটাই লেখা হবে।"
              />
            )}
          </p>

          {/* Where the number came from, in full, at the moment
              it is about to become somebody's own row. */}
          <p className="dt-why">
            <T
              en={SOURCE_WORD[chosen.source]?.en ?? chosen.source}
              bn={SOURCE_WORD[chosen.source]?.bn ?? chosen.source}
            />
            {chosen.cite ? <span className="dt-hit-fill">{chosen.cite}</span> : null}
            {chosen.completeness !== undefined ? (
              <span className="dt-hit-fill">
                <T
                  en={`${Math.round(chosen.completeness * 100)}% of this record is filled in`}
                  bn={`এই রেকর্ডের ${digits(Math.round(chosen.completeness * 100), "bn")}% পূরণ করা আছে`}
                />
              </span>
            ) : null}
          </p>

          <div className="dt-measure-row">
            <Button kind="solid" disabled={!preview} onClick={add}>
              <T en="Add it" bn="যোগ করুন" />
            </Button>
            <Button onClick={() => setChosen(null)}>
              <T en="Not that" bn="এটা নয়" />
            </Button>
          </div>
        </div>
      ) : null}

      {!chosen && hits.length > 0 ? (
        <ul className="dt-hits">
          {hits.map((h) => (
            <li key={h.id}>
              <button type="button" className="dt-hit" onClick={() => take(h)}>
                <span className="dt-hit-name">
                  <T en={h.en} bn={h.bn ?? h.en} />
                  {h.brand ? <span className="dt-hit-brand"> {h.brand}</span> : null}
                  {/* WHAT THE NUMBER IS FOR, on every row. Both
                      databases answer per 100 g and the library
                      answers per cup or per plate, and a list
                      that hides which is which is a list that
                      logs one as the other. */}
                  <span className="dt-hit-por">
                    <T en={said(h, "en")} bn={said(h, "bn")} />
                  </span>
                </span>
                <span className="dt-hit-kcal mono">{digits(Math.round(h.kcal), lang)}</span>
                <span className="dt-hit-src">
                  <T
                    en={SOURCE_WORD[h.source]?.en ?? h.source}
                    bn={SOURCE_WORD[h.source]?.bn ?? h.source}
                  />
                  {h.completeness !== undefined ? (
                    <span className="dt-hit-fill">
                      <T
                        en={`${Math.round(h.completeness * 100)}% filled`}
                        bn={`${digits(Math.round(h.completeness * 100), "bn")}% পূরণ`}
                      />
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* One down means the other's results, and the page says
          so. A short list that looks whole is the untrue
          sentence. */}
      {sources ? (
        <>
          {(["off", "fdc"] as const).map((which) => (
            sources[which] === "failed" || sources[which] === "unconfigured" ? (
              <p className="dt-hint" key={which}>
                {sources[which] === "failed" ? (
                  <T
                    en={`${UPSTREAM[which].en} could not be asked just now.`}
                    bn={`${UPSTREAM[which].bn}কে এখন জিজ্ঞেস করা যায়নি।`}
                  />
                ) : (
                  <T
                    en={`${UPSTREAM[which].en} is not connected on this site.`}
                    bn={`${UPSTREAM[which].bn} এই সাইটে যুক্ত নেই।`}
                  />
                )}
              </p>
            ) : null
          ))}
        </>
      ) : null}

      {/* Free entry never goes away. A name and a number is
          always a valid entry, and the coverage rule already says
          on screen what that costs. */}
      <details className="dt-free">
        <summary><T en="Or type it yourself" bn="অথবা নিজেই লিখুন" /></summary>
        <div className="dt-free-row">
          <input
            className="dt-picker-box" type="text"
            aria-label={lang === "bn" ? "কী খেয়েছেন" : "What you ate"}
            placeholder={lang === "bn" ? "কী খেয়েছেন" : "What you ate"}
            value={free.label}
            onChange={(e) => setFree((f) => ({ ...f, label: e.target.value }))}
          />
          <input
            className="dt-picker-box dt-picker-num" type="number" inputMode="numeric"
            aria-label={lang === "bn" ? "ক্যালোরি" : "Calories"}
            placeholder={lang === "bn" ? "ক্যালোরি" : "kcal"}
            value={free.kcal}
            onChange={(e) => setFree((f) => ({ ...f, kcal: e.target.value }))}
          />
          <Button
            disabled={!free.label.trim() || !Number(free.kcal)}
            onClick={() => {
              onPick({ label: free.label.trim(), kcal: Number(free.kcal), source: "free" });
              setFree({ label: "", kcal: "" });
            }}
          >
            <T en="Add" bn="যোগ" />
          </Button>
        </div>
      </details>

      {/* THE LABEL, which is the one reliable source there is.
          UK packaging is per 100 g by law, so a form that takes
          those figures and a weight is the fastest accurate entry
          path that exists and it needs no database at all.
          `DIET.md` section 22. */}
      <details className="dt-free">
        <summary><T en="Or read it off a packet" bn="অথবা প্যাকেট দেখে লিখুন" /></summary>
        <p className="dt-hint">
          <T
            en="The figures on the back of a packet are per 100 g. Copy the ones that are there, leave the rest empty, and say what you actually ate."
            bn="প্যাকেটের পেছনের সংখ্যাগুলো প্রতি ১০০ গ্রামের হিসাবে। যেগুলো আছে সেগুলো লিখুন, বাকিগুলো খালি রাখুন, আর কতটা খেয়েছেন সেটা লিখুন।"
          />
        </p>
        <div className="dt-label-form">
          <label className="dt-picker-label" htmlFor="dt-lab-name">
            <T en="What it is" bn="জিনিসটা কী" />
          </label>
          <input
            id="dt-lab-name" className="dt-picker-box" type="text"
            value={sheet.name}
            onChange={(e) => setSheet((s) => ({ ...s, name: e.target.value }))}
          />

          {LABEL_FIELDS.map((f) => (
            <div className="dt-label-cell" key={f.key}>
              <label className="dt-picker-label" htmlFor={`dt-lab-${f.key}`}>
                <T en={f.en} bn={f.bn} />
              </label>
              <input
                id={`dt-lab-${f.key}`} className="dt-picker-box dt-picker-num"
                type="number" inputMode="decimal" step="any" min={0}
                value={sheet[f.key]}
                onChange={(e) => setSheet((s) => ({ ...s, [f.key]: e.target.value }))}
              />
            </div>
          ))}

          <label className="dt-picker-label" htmlFor="dt-lab-grams">
            <T en="How much of it you ate, in grams" bn="কত গ্রাম খেয়েছেন" />
          </label>
          <div className="dt-measure-row">
            <input
              id="dt-lab-grams" className="dt-picker-box dt-picker-num"
              type="number" inputMode="decimal" step="any" min={0}
              value={sheet.grams}
              onChange={(e) => setSheet((s) => ({ ...s, grams: e.target.value }))}
            />
            <Button
              disabled={!packet() || !(Number(sheet.grams) > 0)}
              onClick={fromPacket}
            >
              <T en="Add" bn="যোগ" />
            </Button>
          </div>
        </div>
      </details>
    </div>
  );
}
