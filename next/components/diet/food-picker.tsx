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

   ---- and three of section 14's corrections live here ----

   Because all three are about the moment a row is written rather
   than about a page.

   A HAND is a first-class amount, not a fallback. Weighing is
   the most accurate method and it is the one most people
   abandon, so the four hand portions sit beside the number box
   and set it. They need a row that says what its own portion
   WEIGHS, and `scaleTo()` refuses in grams for a row that does
   not, which is why they are offered only where that is true.

   A PLATE SOMEBODY ELSE COOKED IS A RANGE. One press widens the
   figure into `est_low` and `est_high`, the midpoint stays the
   total's, and `totalFor()` in `shared/diet.ts` adds the widths
   up as the day's spread. Where there is no row at all, two
   numbers and a name are a whole entry.

   SMALL EXTRAS ARE ONE TAP, in the open rather than behind a
   summary, because a thing that takes two taps to log is a thing
   that does not get logged. `next/lib/recipes.ts` holds all
   three sets of figures and `next/recipes.test.ts` asserts them.

   ---- and the whole of it works without a mouse ----

   Section 13: type, arrow, enter. The results are a roving
   tabindex, which is the account page's pattern and the only one
   this site has, so the list is ONE tab stop rather than six and
   the arrows walk it. Enter on the search box takes the first
   result, Enter in the amount box ADDS IT, and Escape backs out
   of the step.

   The amount box is the one that matters. Every path here ended
   at a button four tab stops past the field somebody had just
   typed in: the unit chips, the four hand chips and the ate-out
   chip all sit between the number and Add, so a reader who never
   touches a pointer typed a portion and then pressed Tab five
   times, or gave up. A form that cannot be submitted from the
   field it ends in is a form that looks finished.
   ============================================================ */

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { Entry } from "@reiad/shared/diet";
import {
  DEFAULT_PLACE, barcodeOf, loggedFrom, portionWords, scaleTo,
  search as searchLibrary,
  type FoundFood, type Place, type Portion,
} from "@reiad/shared/foods";
import { EXTRAS, HANDS, outRange, widened } from "../../lib/recipes";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { T, TBlock, digits, useToolLang } from "./lang";

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

export function FoodPicker({ onPick, place = DEFAULT_PLACE, ingredient = false }: {
  onPick: (e: Omit<Entry, "date">) => void;
  /** Which portion library leads. The other country's is
      still searched, because a reader in Dhaka who eats
      porridge should still find it. */
  place?: Place;
  /** This picker is filling a pot rather than a day.
      Eating out and small extras are things that happened to a
      READER, and offering them while somebody lists what went in
      a curry would put a restaurant plate in a recipe. The hand
      portions stay: two cupped hands of rice is how a pot gets
      described by the person who cooked it. */
  ingredient?: boolean;
}) {
  const lang = useToolLang();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [sources, setSources] = useState<Answer["sources"]>(undefined);
  const [looking, setLooking] = useState(false);
  const [free, setFree] = useState({ label: "", kcal: "" });
  const [sheet, setSheet] = useState(EMPTY_LABEL);
  const [plate, setPlate] = useState({ label: "", low: "", high: "" });

  /* The step between the tap and the row. `chosen` is what was
     tapped, `amount` and `unit` are what the reader says they
     ate, and nothing is written until they press Add. */
  const [chosen, setChosen] = useState<Hit | null>(null);
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  /* Whether this one was eaten somewhere the reader did not do
     the cooking. Cleared with every choice, because it is a fact
     about one plate rather than a setting. */
  const [out, setOut] = useState(false);

  /* WHICH RESULT THE ARROWS ARE ON. A roving tabindex, so the
     list is one tab stop and not one per result, which is the
     account page's arrangement and the only one this site has.
     It is an index rather than an id because the list is
     rebuilt on every keystroke and an id would point at a
     result that is no longer there. */
  const [active, setActive] = useState(0);
  const hitRefs = useRef<Array<HTMLButtonElement | null>>([]);

  /** The search box, by id rather than by ref. `<Field>` renders
      the input and does not forward one, and the id is already
      the thing its own label is wired to, so there is nothing
      here that can come to name a box that is not the box. */
  const focusBox = (): void => {
    (document.getElementById("dt-food-q") as HTMLInputElement | null)?.focus();
  };

  /** Focus one result, or the search box for anything before the
      first. Clamped rather than wrapped: a list that wraps from
      the last result back to the first hides the end of itself
      from somebody holding the arrow key down. */
  const focusHit = (at: number): void => {
    if (at < 0) { focusBox(); setActive(0); return; }
    const to = Math.min(at, hits.length - 1);
    if (to < 0) return;
    setActive(to);
    hitRefs.current[to]?.focus();
  };

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

  /* The arrows start at the top of whatever is on screen now.
     Without this the roving index survives a new search and
     Tab lands on the fourth result of a list the reader has
     never seen. */
  useEffect(() => { setActive(0); }, [hits]);

  /* Opening the step does not log anything. The box opens at the
     portion the row STATES, in the row's own unit, which is the
     one number here that is not a guess. */
  const take = (h: Hit): void => {
    setChosen(h);
    setAmount(String(h.qty));
    setUnit(h.unit);
    setOut(false);
    window.setTimeout(() => document.getElementById("dt-ate-n")?.focus(), 0);
  };

  const eaten = { n: Number(amount), unit };
  const preview = chosen ? scaleTo(chosen, eaten) : null;

  /** The band this entry would carry, or null where it is not
      being logged as one. Symmetric, so the midpoint is the
      figure above and the macros still follow from it. */
  const band = out && preview ? widened(preview.kcal) : null;

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

  /** A hand, as an amount in grams.

      IT SETS THE BOX RATHER THAN ADDING TO IT, and the box is
      right there to be edited: a reader who had two palms types
      200. Adding would have to know whether what is in the box
      is already a hand or the row's own portion, and guessing
      wrong is a doubled dinner. */
  const byHand = (grams: number): void => {
    setUnit("g");
    setAmount(String(grams));
  };

  const add = (): void => {
    if (!chosen) return;
    const row = loggedFrom(chosen, eaten, { source: chosen.source, sourceId: chosen.id });
    /* Null is a refusal and nothing is logged. See the banner. */
    if (!row) return;
    /* THE WIDTH, WHERE THE READER SAID THEY ATE OUT. The energy
       stays the midpoint, which is what it already was, so
       nothing about the row changes except that the day now
       knows how much of it is a guess. */
    onPick(band
      ? { ...row, kcal: band.mid, estLow: band.low, estHigh: band.high }
      : row);
    setChosen(null);
    setOut(false);
    setQ("");
    setHits([]);
    /* BACK TO THE BOX, because the next thing somebody logs is
       the next thing they ate. Landing on the body instead means
       the following Tab starts at the top of the page, and a
       reader adding four items to a dinner walks the whole form
       four times. */
    focusBox();
  };

  /** Out of the step, back to where the choosing happens. Escape
      is the one key a reader presses without being told to, so
      it has to mean the same thing here as it does in the
      account menu: put this away and leave me where I was. */
  const backOut = (): void => {
    setChosen(null);
    setOut(false);
    focusBox();
  };

  /** The search box. Down goes into the list, Enter takes the
      first result. Enter rather than "focus the first and let
      them press it again": a repeat dinner has to be three
      interactions and this is one of the three. */
  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (!hits.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); focusHit(0); return; }
    if (e.key === "Enter") { e.preventDefault(); take(hits[0]); }
  };

  /** One result. The arrows walk the list, Escape leaves it, and
      Enter is the button's own. */
  const onHitKey = (e: KeyboardEvent<HTMLButtonElement>, at: number): void => {
    if (e.key === "ArrowDown") { e.preventDefault(); focusHit(at + 1); return; }
    if (e.key === "ArrowUp") { e.preventDefault(); focusHit(at - 1); return; }
    if (e.key === "Escape") { e.preventDefault(); focusBox(); }
  };

  /** Enter in a field ADDS, where there is something to add.
      `disabled` is the same test the button uses, so a field that
      refuses and a button that is greyed out refuse together
      rather than one of them being a second opinion. */
  const onEnter = (run: () => void, allowed: boolean) =>
    (e: KeyboardEvent<HTMLInputElement>): void => {
      if (e.key !== "Enter") return;
      e.preventDefault();
      if (allowed) run();
    };

  /** A plate nobody weighed, out of two numbers and a name.
      NOTHING BUT ENERGY: a plate this tool did not see the
      making of has no composition it can state, and a protein
      figure borrowed from a row that was never this plate would
      be a confident number about somebody else's kitchen. */
  const plateReady = plate.label.trim() !== ""
    && outRange(Number(plate.low), Number(plate.high)) !== null;

  const fromPlate = (): void => {
    const range = outRange(Number(plate.low), Number(plate.high));
    const label = plate.label.trim();
    if (!range || !label) return;
    onPick({
      label,
      kcal: range.mid,
      estLow: range.low,
      estHigh: range.high,
      source: "free",
    });
    setPlate({ label: "", low: "", high: "" });
  };

  /** The tea with sugar, the biscuit with it, the mishti at
      somebody's house, the handful of something while cooking.
      One tap, a modest flat figure, and a range on it, because
      it is not accurate and it is far more accurate than the
      nothing that would otherwise be recorded. */
  const addExtras = (): void => {
    onPick({
      label: "Small extras",
      labelBn: "টুকিটাকি খাওয়া",
      kcal: EXTRAS.mid,
      estLow: EXTRAS.low,
      estHigh: EXTRAS.high,
      source: "free",
    });
  };

  /** A name and a number, which is always a valid entry. Named
      rather than inline, because Enter in either box and the
      button have to run the SAME thing: two copies of a writer
      is how one of them keeps a field the other drops. */
  const freeReady = free.label.trim() !== "" && Number(free.kcal) > 0;

  const addFree = (): void => {
    if (!freeReady) return;
    onPick({ label: free.label.trim(), kcal: Number(free.kcal), source: "free" });
    setFree({ label: "", kcal: "" });
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

  const packetReady = packet() !== null && Number(sheet.grams) > 0;

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
      <Field
        id="dt-food-q" type="search" autoComplete="off"
        label={<T en="Add something you ate" bn="যা খেয়েছেন যোগ করুন" />}
        placeholder={lang === "bn" ? "ভাত, ডিম, রুটি…" : "rice, egg, bread…"}
        hint={(
          <T
            en="Type, then the down arrow for the list and enter to take one. Enter on its own takes the first."
            bn="লিখুন, তারপর নিচের তির চেপে তালিকায় যান আর এন্টার চেপে একটা নিন। সরাসরি এন্টার চাপলে প্রথমটাই নেওয়া হয়।"
          />
        )}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={onSearchKey}
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
              onKeyDown={(e) => {
                if (e.key === "Escape") { e.preventDefault(); backOut(); return; }
                onEnter(add, preview !== null)(e);
              }}
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

          {/* THE HAND, WHICH IS NOT A FALLBACK. Section 14: the
              hand scales with the person, which is the property
              that makes it work, and a scale is the method most
              people abandon. Offered only where the row says what
              its own portion weighs, because `scaleTo()` rightly
              refuses grams for a row that never says. */}
          {chosen.grams !== undefined ? (
            <>
              <div className="dt-tags" role="group"
                   aria-label={lang === "bn" ? "হাত দিয়ে মাপ" : "Measured by hand"}>
                {HANDS.map((h) => (
                  <ChipButton key={h.id} onClick={() => byHand(h.grams)}>
                    <T en={`${h.en}, ${h.enOf}`} bn={`${h.bn}, ${h.bnOf}`} />
                  </ChipButton>
                ))}
              </div>
              <p className="dt-hint">
                <T
                  en="A hand grows with the person holding it, which is what makes it work. It is about a fifth out either way, and a fifth out every day for a year beats exact for eleven days."
                  bn="হাত যার, মাপও তার, আর এই কারণেই এটা কাজ করে। এতে পাঁচ ভাগের এক ভাগ এদিক-ওদিক হয়, আর সারা বছর ওইটুকু ভুলসহ লেখা এগারো দিন নিখুঁত লেখার চেয়ে ভালো।"
                />
              </p>
            </>
          ) : null}

          <p className="dt-measure-sum">
            {preview ? (
              <T
                en={`That is ${Math.round(preview.kcal)} kcal${
                  preview.macros.protein !== undefined
                    ? `, ${preview.macros.protein} g protein` : ""
                }${preview.grams !== undefined && unit !== "g"
                  ? `, ${preview.grams} g` : ""}.`}
                bn={`মানে ${digits(Math.round(preview.kcal), "bn")} ক্যালোরি${
                  preview.macros.protein !== undefined
                    ? `, ${digits(preview.macros.protein, "bn")} গ্রাম প্রোটিন` : ""
                }${preview.grams !== undefined && unit !== "g"
                  ? `, ${digits(preview.grams, "bn")} গ্রাম` : ""}।`}
              />
            ) : (
              <T
                en="Say how much, and this will log exactly that much of it."
                bn="কতটা খেয়েছেন লিখুন, ঠিক ততটাই লেখা হবে।"
              />
            )}
          </p>

          {/* A PLATE SOMEBODY ELSE COOKED IS NOT KNOWABLE.
              Section 14: a plate of kacchi biryani is somewhere
              between 700 and 1,100 kcal and anybody who says it
              is 863 is reading a number a website invented. So
              this one press keeps the figure and adds the width
              to it, and the width goes into the day rather than
              into a decimal place nobody can defend. */}
          {!ingredient ? (
            <div className="dt-measure-row">
              <ChipButton pressed={out} onClick={() => setOut(!out)}>
                <T en="I ate this out" bn="এটা বাইরে খেয়েছি" />
              </ChipButton>
              {band ? (
                <span className="dt-hint">
                  <T
                    en={`Logged as ${Math.round(band.low)} to ${Math.round(band.high)} kcal. The middle goes into the day and the width goes into how sure the day is.`}
                    bn={`${digits(Math.round(band.low), "bn")} থেকে ${digits(Math.round(band.high), "bn")} ক্যালোরি হিসেবে লেখা হবে। মাঝেরটা দিনের হিসাবে যাবে, আর কতটা নিশ্চিত সেটাও দিনের সঙ্গে থাকবে।`}
                  />
                </span>
              ) : null}
              {out && !preview ? (
                <span className="dt-hint">
                  <T
                    en="Say how much first. A width on a figure this cannot work out would be a range around nothing."
                    bn="আগে কতটা খেয়েছেন লিখুন। যে হিসাবই বের হয়নি, তার আশেপাশে কোনো সীমা টানার মানে হয় না।"
                  />
                </span>
              ) : null}
            </div>
          ) : null}

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
            <Button onClick={backOut}>
              <T en="Not that" bn="এটা নয়" />
            </Button>
            <span className="dt-hint">
              <T
                en="Enter in the box above adds it, escape goes back."
                bn="উপরের ঘরে এন্টার চাপলেই যোগ হবে, এস্কেপ চাপলে ফিরে যাবেন।"
              />
            </span>
          </div>
        </div>
      ) : null}

      {!chosen && hits.length > 0 ? (
        <ul className="dt-hits">
          {hits.map((h, at) => (
            <li key={h.id}>
              <button
                type="button" className="dt-hit"
                ref={(el) => { hitRefs.current[at] = el; }}
                tabIndex={at === Math.min(active, hits.length - 1) ? 0 : -1}
                onFocus={() => setActive(at)}
                onKeyDown={(e) => onHitKey(e, at)}
                onClick={() => take(h)}
              >
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

      {/* An answer came back and it was empty, which is a
          different sentence from "still looking" and from "one
          database is down" below. A barcode that nobody has
          added yet is the common case of it. */}
      {sources && !looking && hits.length === 0 && !chosen ? (
        <p className="dt-hint">
          <T
            en="Nothing found. Type it in below, or read it off the packet."
            bn="কিছু পাওয়া যায়নি। নিচে নিজে লিখুন, অথবা প্যাকেট দেখে লিখুন।"
          />
        </p>
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

      {/* SMALL EXTRAS, IN THE OPEN. Section 14: the tea with
          sugar, the biscuit with it, the mishti at somebody's
          house, the handful of something while cooking. None of
          it is logged and all of it is eaten. Behind a summary
          this would be two taps, and a thing that takes two taps
          is a thing that does not get logged. */}
      {!ingredient ? (
        <div className="dt-measure-row">
          <Button onClick={addExtras}>
            <T en="Small extras" bn="টুকিটাকি খাওয়া" />
          </Button>
          <span className="dt-hint">
            <T
              en={`The tea, the biscuit, the sweet at somebody's house, the handful while cooking. About ${EXTRAS.mid} kcal, and it could be anywhere from ${EXTRAS.low} to ${EXTRAS.high}. It is not accurate and it is far more accurate than nothing.`}
              bn={`চা, বিস্কুট, কারও বাসার মিষ্টি, রান্নার ফাঁকে এক মুঠো। মোটামুটি ${digits(EXTRAS.mid, "bn")} ক্যালোরি, আর সেটা ${digits(EXTRAS.low, "bn")} থেকে ${digits(EXTRAS.high, "bn")}-এর মধ্যে যেকোনো কিছু হতে পারে। এটা নিখুঁত নয়, কিন্তু কিছুই না লেখার চেয়ে অনেক বেশি সঠিক।`}
            />
          </span>
        </div>
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
            onKeyDown={onEnter(addFree, freeReady)}
          />
          <input
            className="dt-picker-box dt-picker-num" type="number" inputMode="numeric"
            aria-label={lang === "bn" ? "ক্যালোরি" : "Calories"}
            placeholder={lang === "bn" ? "ক্যালোরি" : "kcal"}
            value={free.kcal}
            onChange={(e) => setFree((f) => ({ ...f, kcal: e.target.value }))}
            onKeyDown={onEnter(addFree, freeReady)}
          />
          <Button disabled={!freeReady} onClick={addFree}>
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
          <Field
            id="dt-lab-name" type="text"
            label={<T en="What it is" bn="জিনিসটা কী" />}
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
              onKeyDown={onEnter(fromPacket, packetReady)}
            />
            <Button disabled={!packetReady} onClick={fromPacket}>
              <T en="Add" bn="যোগ" />
            </Button>
          </div>
        </div>
      </details>

      {/* A RESTAURANT PLATE, WHERE NO ROW FITS IT. Section 14
          again, and this is the half of it the search cannot
          answer: a plate somebody else cooked, out of a kitchen
          this site has never seen, with no packet and no row.
          Two numbers is the honest whole of what anybody knows
          about it. */}
      {!ingredient ? (
        <details className="dt-free">
          <summary><T en="Or you ate out" bn="অথবা বাইরে খেয়েছেন" /></summary>
          <TBlock
            en={<p className="dt-hint">A plate you did not cook is not knowable. Give the
              least it could have been and the most, and the middle goes into the
              day while the width goes into how sure the day is. That is more
              honest than a decimal point and it costs you nothing.</p>}
            bn={<p className="dt-hint">নিজে রান্না করেননি এমন খাবারের হিসাব ঠিকঠাক জানা
              যায় না। সবচেয়ে কম কত হতে পারে আর সবচেয়ে বেশি কত, দুটোই লিখুন; মাঝেরটা
              দিনের হিসাবে যাবে, আর কতটা নিশ্চিত সেটাও দিনের সঙ্গে থাকবে। এটা দশমিকের
              পরে একটা সংখ্যা বসানোর চেয়ে সৎ, আর এতে আপনার কিছু হারায় না।</p>}
          />
          <div className="dt-label-form">
            <Field
              id="dt-out-name" type="text"
              label={<T en="What it was" bn="কী খেয়েছিলেন" />}
              value={plate.label}
              onChange={(e) => setPlate((p) => ({ ...p, label: e.target.value }))}
              onKeyDown={onEnter(fromPlate, plateReady)}
            />
            <Field
              id="dt-out-low" type="number" inputMode="decimal" step="any" min={0}
              label={<T en="The least it could have been, kcal" bn="সবচেয়ে কম যত হতে পারে, ক্যালোরি" />}
              value={plate.low}
              onChange={(e) => setPlate((p) => ({ ...p, low: e.target.value }))}
              onKeyDown={onEnter(fromPlate, plateReady)}
            />
            <Field
              id="dt-out-high" type="number" inputMode="decimal" step="any" min={0}
              label={<T en="And the most, kcal" bn="আর সবচেয়ে বেশি, ক্যালোরি" />}
              value={plate.high}
              onChange={(e) => setPlate((p) => ({ ...p, high: e.target.value }))}
              onKeyDown={onEnter(fromPlate, plateReady)}
            />
            <div className="dt-measure-row">
              <Button disabled={!plateReady} onClick={fromPlate}>
                <T en="Add" bn="যোগ" />
              </Button>
              {plate.low && plate.high
                && !outRange(Number(plate.low), Number(plate.high)) ? (
                  <span className="dt-hint">
                    <T
                      en="The most has to be at least the least. Nothing is written until it is, because swapping them for you would be this tool deciding what you meant."
                      bn="বেশিরটা অন্তত কমটার সমান হতে হবে। তার আগে কিছুই লেখা হবে না, কারণ নিজে থেকে দুটো উল্টে দেওয়া মানে যন্ত্রের ধরে নেওয়া যে আপনি কী বলতে চেয়েছেন।"
                    />
                  </span>
                ) : null}
            </div>
          </div>
          <p className="dt-why">
            <T
              en="Energy only. A plate this tool did not see the making of has no protein or iron figure it can honestly state, and one borrowed from a row that was never this plate would be a confident number about somebody else's kitchen."
              bn="শুধু ক্যালোরি। যে রান্না এই যন্ত্র দেখেনি, তার প্রোটিন বা আয়রনের হিসাব সে সৎভাবে বলতে পারে না; অন্য কোনো সারি থেকে ধার করা সংখ্যা হতো অন্যের রান্নাঘর নিয়ে জোর গলায় বলা কথা।"
            />
          </p>
        </details>
      ) : null}
    </div>
  );
}
