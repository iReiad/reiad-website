"use client";

/* ============================================================
   diet/recipe-panel.tsx: build the dish once, then a portion of
   it is one tap for ever.

   `DIET.md` section 13, and the argument under the whole of it:
   a food diary is abandoned because of FRICTION rather than
   motivation. A home-cooked dinner is six searches and six
   amounts the first time and it should be one tap the tenth.

   ---- the ingredient picker is the food picker ----

   `food-picker.tsx` already searches this site's own portion
   library and the two open databases through the Worker, prints
   the source on every result, and makes the reader say HOW MUCH
   before anything is written. An ingredient is exactly that:
   `loggedFrom()` returns the shape this list holds, so there is
   nothing to adapt and there is no second search to keep in
   step.

   ---- and the total is a floor, never a figure ----

   `next/lib/recipes.ts` is the arithmetic and its header is the
   argument. What this file has to do is SAY it: an ingredient
   that states no energy is named, the totals it belongs to read
   "at least", and a reader is never shown a confident number
   for a pot that is missing a third of itself. An error in the
   flattering direction is the failure this whole tool is built
   around.

   ---- a saved recipe is a row, and a logged portion is not ----

   The recipe is one `diet_foods` row with its ingredients in
   `parts` and its yield in `serves`. Logging it writes ONE
   `diet_entries` row carrying its own numbers, so editing the
   recipe later does not rewrite what was eaten last month.
   ============================================================ */

import { useEffect, useMemo, useState } from "react";
import type { Entry } from "@reiad/shared/diet";
import {
  DEFAULT_PLACE, portionWords, type FoundFood, type Place,
} from "@reiad/shared/foods";
import {
  SERVING, logRecipe, pot, servingsOf, shoppingList, toRecipe,
  type Part, type Recipe,
} from "../../lib/recipes";
import {
  addEntry, getOwnFoods, getProfile, isoDate, clockTime, saveOwnFood, who,
  type OwnFood, type Who,
} from "../../lib/diet-api";
import { Button } from "../ui/button";
import { ChipButton } from "../ui/chip";
import { Field } from "../ui/field";
import { Note } from "../ui/note";
import { T, TBlock, digits, useToolLang } from "./lang";
import { FoodPicker } from "./food-picker";

/** The four macros, in both languages, in the order a label
    prints them. A fifth would be a decision rather than a tweak:
    everything past these four is a micronutrient and section 15
    reads those through coverage. */
const MACROS = [
  { key: "protein", en: "protein", bn: "প্রোটিন" },
  { key: "carbs", en: "carbohydrate", bn: "শর্করা" },
  { key: "fat", en: "fat", bn: "চর্বি" },
  { key: "fibre", en: "fibre", bn: "আঁশ" },
] as const;

const num = (raw: string): number | undefined => {
  const n = Number(raw.trim());
  return raw.trim() !== "" && Number.isFinite(n) && n > 0 ? n : undefined;
};

/** "at least 384" against "384", which is the whole of what a
    floor means on the page. It is a word rather than a symbol
    because a reader who meets "≥" has to be told what it is. */
const said = (
  value: number, floor: boolean, lang: "en" | "bn",
): string => {
  const n = digits(value, lang);
  if (!floor) return n;
  return lang === "bn" ? `অন্তত ${n}` : `at least ${n}`;
};

/** What the reader called this ingredient, in the language they
    are reading. A part copied out of the library carries both;
    one out of a public database or typed by hand carries only
    the English, and showing that to a Bangla reader is better
    than showing a blank. */
const partName = (p: Part, lang: "en" | "bn"): string =>
  (lang === "bn" ? p.labelBn : undefined) ?? p.label;

const partAmount = (p: Part, lang: "en" | "bn"): string =>
  p.qty === undefined || !p.unit
    ? ""
    : portionWords(digits(p.qty, lang), p.unit, lang);

/** The pot's macros as the row stores them. Absent stays absent:
    a nought would read as "none of it", which is the one thing
    `shared/foods.ts` refuses to write for a figure nobody has. */
const potMacros = (food: FoundFood): Record<string, number> => {
  const out: Record<string, number> = {};
  for (const m of MACROS) {
    const value = food[m.key];
    if (value !== undefined) out[m.key] = value;
  }
  return out;
};

export function RecipePanel() {
  const lang = useToolLang();
  const [w, setW] = useState<Who | null>(null);
  const [answered, setAnswered] = useState(false);
  const [place, setPlace] = useState<Place>(DEFAULT_PLACE);

  const [rows, setRows] = useState<OwnFood[]>([]);
  const [loaded, setLoaded] = useState(false);

  /* The dish being built. Nothing is written until Save, so a
     half-built recipe is never a row somebody has to tidy up. */
  const [en, setEn] = useState("");
  const [bn, setBn] = useState("");
  const [serves, setServes] = useState("4");
  const [parts, setParts] = useState<Part[]>([]);
  const [saving, setSaving] = useState<"" | "saving" | "failed">("");

  /* How many portions of each saved recipe, keyed by its row id,
     and which recipes the shopping list is for. */
  const [portions, setPortions] = useState<Record<string, string>>({});
  const [logged, setLogged] = useState<Record<string, "going" | "done" | "failed">>({});
  const [shopping, setShopping] = useState<string[]>([]);

  useEffect(() => {
    let live = true;
    const paint = (): void => {
      void (async () => {
        const me = await who();
        if (!live) return;
        setW(me);
        setAnswered(true);
        if (!me) return;
        const profile = await getProfile(me);
        if (live && profile?.place) setPlace(profile.place);
      })();
    };
    paint();
    document.addEventListener("account:changed", paint);
    return () => { live = false; document.removeEventListener("account:changed", paint); };
  }, []);

  useEffect(() => {
    if (!w) return;
    let live = true;
    void getOwnFoods(w).then((found) => {
      if (!live) return;
      setRows(found);
      setLoaded(true);
    });
    return () => { live = false; };
  }, [w]);

  /** Every stored row that really is a recipe. `toRecipe` is
      what proves it: `parts` is a `jsonb` column, so what comes
      back is `unknown` and every field in it has to be checked
      rather than cast. */
  const recipes = useMemo(
    () => rows.map(toRecipe).filter((r): r is Recipe => r !== null),
    [rows],
  );

  const draft: Recipe = {
    en: en.trim(),
    bn: bn.trim() || undefined,
    serves: num(serves) ?? 0,
    parts,
  };
  const made = pot(draft);
  const each = servingsOf(draft, 1);

  const save = async (): Promise<void> => {
    if (!w || !made.food || !draft.en) return;
    setSaving("saving");
    /* THE ROW STATES ITS FIGURES FOR THE WHOLE POT, which is
       what `qty` and `unit` mean everywhere else in this tool:
       the numbers are for `qty` of `unit`. Anything reading this
       row later, including the Android app, can then scale it
       with the same `scaleTo()` a library row goes through. */
    const row: OwnFood = {
      label: draft.en,
      label_bn: draft.bn,
      kind: "recipe",
      parts: draft.parts,
      serves: draft.serves,
      qty: draft.serves,
      unit: SERVING,
      kcal: made.food.kcal,
      macros: potMacros(made.food),
      source: "recipe",
      /* Counted rather than remembered: what is on the page comes
         from the log, and these two are the row's own cache of it
         so that something reading `diet_foods` alone can order by
         them without fetching a year of entries. A recipe has
         been cooked no times on the day it is written. */
      uses: 0,
      last_used: undefined,
    };
    const ok = await saveOwnFood(w, row);
    if (!ok) { setSaving("failed"); return; }
    setSaving("");
    setEn(""); setBn(""); setServes("4"); setParts([]);
    setRows(await getOwnFoods(w));
  };

  const log = async (recipe: Recipe): Promise<void> => {
    const id = recipe.id;
    if (!w || !id) return;
    const n = num(portions[id] ?? "1") ?? 1;
    const row = logRecipe(recipe, n);
    /* Null is a refusal, and nothing is written. See the banner
       under the builder: a pot that cannot be divided honestly
       does not get logged as a guess. */
    if (!row) return;
    setLogged((state) => ({ ...state, [id]: "going" }));
    const wrote = await addEntry(w, {
      ...row, date: isoDate(), atTime: clockTime(),
    });
    setLogged((state) => ({ ...state, [id]: wrote ? "done" : "failed" }));
    if (!wrote) return;
    /* The row's own cache of what the log already says. A failure
       here changes nothing on any page, because nothing on any
       page reads it. */
    void saveOwnFood(w, {
      ...(rows.find((r) => r.id === id) ?? {}),
      id,
      label: recipe.en,
      uses: (recipe.uses ?? 0) + 1,
      last_used: isoDate(),
    });
  };

  const chosen = useMemo(
    () => recipes.filter((r) => r.id && shopping.includes(r.id)),
    [recipes, shopping],
  );
  const shop = useMemo(() => shoppingList(chosen), [chosen]);

  if (!answered) return <div className="dt-board-wait" aria-busy="true" />;

  if (!w) {
    return (
      <p className="dt-invite">
        <T
          en="A recipe belongs to an account, so the dish you built on this laptop is one tap on your phone."
          bn="রান্নার হিসাব অ্যাকাউন্টের সঙ্গে থাকে, তাই এই কম্পিউটারে বানানো রান্নাটা ফোনেও এক চাপে পাওয়া যায়।"
        />
      </p>
    );
  }

  return (
    <div className="dt-recipes">
      {/* ---- what is already built ---- */}
      <section className="dt-recipe-mine" aria-labelledby="dt-rec-mine-h">
        <h2 id="dt-rec-mine-h"><T en="Your dishes" bn="আপনার রান্না" /></h2>

        {!loaded ? (
          <p className="dt-hint">
            <T en="Fetching what you have built." bn="আপনি যা বানিয়েছেন তা আনা হচ্ছে।" />
          </p>
        ) : null}

        {loaded && !recipes.length ? (
          <p className="dt-hint">
            <T
              en="Nothing yet. Build a dish below, say how many it serves, and a portion of it becomes one tap from then on."
              bn="এখনো কিছু নেই। নিচে একটা রান্না বানান, কয় জনের জন্য বলুন, তারপর থেকে তার এক ভাগ এক চাপেই লেখা হবে।"
            />
          </p>
        ) : null}

        <ul className="dt-recipe-list">
          {recipes.map((recipe) => {
            const id = recipe.id as string;
            const one = servingsOf(recipe, 1);
            const which = pot(recipe);
            const state = logged[id];
            return (
              <li key={id} className="dt-recipe">
                <p className="dt-recipe-name">
                  <T en={recipe.en} bn={recipe.bn ?? recipe.en} />
                </p>
                <p className="dt-why">
                  <T
                    en={`Serves ${recipe.serves}. One portion is ${
                      one ? said(Math.round(one.kcal), which.floors.has("kcal"), "en") : "not a figure this can work out"
                    } kcal${
                      one && one.macros.protein !== undefined
                        ? `, ${said(one.macros.protein, which.floors.has("protein"), "en")} g protein` : ""
                    }.`}
                    bn={`${digits(recipe.serves, "bn")} ভাগ। এক ভাগে ${
                      one ? said(Math.round(one.kcal), which.floors.has("kcal"), "bn") : "হিসাব করা যাচ্ছে না এমন"
                    } ক্যালোরি${
                      one && one.macros.protein !== undefined
                        ? `, ${said(one.macros.protein, which.floors.has("protein"), "bn")} গ্রাম প্রোটিন` : ""
                    }।`}
                  />
                </p>

                <div className="dt-measure-row">
                  <Field
                    id={`dt-portions-${id}`}
                    type="number" inputMode="decimal" step="0.25" min={0}
                    label={<T en="Portions eaten" bn="কয় ভাগ খেয়েছেন" />}
                    value={portions[id] ?? "1"}
                    onChange={(e) => setPortions((p) => ({ ...p, [id]: e.target.value }))}
                  />
                  <Button
                    kind="solid"
                    disabled={state === "going" || !servingsOf(recipe, num(portions[id] ?? "1") ?? 0)}
                    onClick={() => void log(recipe)}
                  >
                    <T en="Log it" bn="লিখে ফেলুন" />
                  </Button>
                  <ChipButton
                    pressed={shopping.includes(id)}
                    onClick={() => setShopping((s) =>
                      s.includes(id) ? s.filter((x) => x !== id) : [...s, id])}
                  >
                    <T en="On the list" bn="বাজারের তালিকায়" />
                  </ChipButton>
                </div>

                {state === "done" ? (
                  <p className="dt-hint">
                    <T en="In today's log." bn="আজকের খাতায় উঠেছে।" />
                  </p>
                ) : null}
                {state === "failed" ? (
                  <p className="dt-hint">
                    <T
                      en="That did not save. It will go up when the connection comes back."
                      bn="এটা জমা হয়নি। সংযোগ ফিরলে চলে যাবে।"
                    />
                  </p>
                ) : null}

                <details className="dt-free">
                  <summary><T en="What is in it" bn="এতে কী কী আছে" /></summary>
                  <ul className="dt-eaten-list">
                    {recipe.parts.map((part, at) => (
                      <li key={`${id}-${at}`}>
                        <span>{partName(part, lang)}</span>
                        <span className="dt-hit-por">{partAmount(part, lang)}</span>
                        <span className="mono">
                          {part.kcal === undefined
                            ? "" : digits(Math.round(part.kcal), lang)}
                        </span>
                        <span className="dt-src">{part.source ?? ""}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---- building one ---- */}
      <section className="dt-recipe-build" aria-labelledby="dt-rec-build-h">
        <h2 id="dt-rec-build-h"><T en="Build a dish" bn="একটা রান্না বানান" /></h2>
        <TBlock
          en={<p className="dt-hint">Put in what went in the pot, then say how many
            portions it made. From then on, eating it is one tap and a
            fraction.</p>}
          bn={<p className="dt-hint">পাত্রে যা যা গেছে সব দিন, তারপর বলুন কয় ভাগ
            হয়েছে। এরপর থেকে এটা খাওয়া মানে এক চাপ আর একটা ভাগ।</p>}
        />

        <div className="dt-form">
          <Field
            id="dt-rec-en" type="text"
            label={<T en="What it is called" bn="নাম" />}
            value={en} onChange={(e) => setEn(e.target.value)}
          />
          <Field
            id="dt-rec-bn" type="text"
            label={<T en="The same name in Bangla" bn="বাংলায় একই নাম" />}
            hint={<T
              en="Not required. A dish with both is a dish that reads properly whichever language this tool is in."
              bn="না দিলেও চলে। দুটোই থাকলে যন্ত্র যে ভাষাতেই থাকুক, নামটা ঠিকভাবে পড়া যায়।"
            />}
            value={bn} onChange={(e) => setBn(e.target.value)}
          />
          <Field
            id="dt-rec-serves" type="number" inputMode="decimal" min={0.5} step="0.5"
            label={<T en="Portions it makes" bn="কয় ভাগ হয়" />}
            value={serves} onChange={(e) => setServes(e.target.value)}
          />
        </div>

        <FoodPicker onPick={(e: Omit<Entry, "date">) => setParts((p) => [...p, e])} place={place} />

        {parts.length ? (
          <ul className="dt-eaten-list">
            {parts.map((part, at) => (
              <li key={`${part.label}-${at}`}>
                <span>{partName(part, lang)}</span>
                <span className="dt-hit-por">{partAmount(part, lang)}</span>
                <span className="mono">
                  {part.kcal === undefined ? "" : digits(Math.round(part.kcal), lang)}
                </span>
                <button
                  type="button" className="dt-drop"
                  aria-label={lang === "bn" ? "এটা বাদ দিন" : "Take this out"}
                  onClick={() => setParts((p) => p.filter((_, i) => i !== at))}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="dt-hint">
            <T
              en="Nothing in the pot yet. Search above for what went in, and say how much of each."
              bn="পাত্রে এখনো কিছু নেই। উপরে খুঁজে যা যা দিয়েছেন যোগ করুন, আর কতটা করে দিয়েছেন লিখুন।"
            />
          </p>
        )}

        {/* WHAT IT COMES TO, and what it does not. */}
        <div className="dt-recipe-sum">
          {made.food && each ? (
            <>
              <p className="dt-value">
                <T
                  en={`${said(Math.round(each.kcal), made.floors.has("kcal"), "en")} kcal a portion`}
                  bn={`ভাগপ্রতি ${said(Math.round(each.kcal), made.floors.has("kcal"), "bn")} ক্যালোরি`}
                />
              </p>
              <ul className="dt-recipe-macros">
                {MACROS.map((m) => {
                  const value: number | undefined = each.macros[m.key];
                  if (value === undefined) return null;
                  return (
                    <li key={m.key}>
                      <T
                        en={`${said(value, made.floors.has(m.key), "en")} g ${m.en}`}
                        bn={`${said(value, made.floors.has(m.key), "bn")} গ্রাম ${m.bn}`}
                      />
                    </li>
                  );
                })}
              </ul>
              <p className="dt-why">
                <T
                  en={`The whole pot is ${said(Math.round(made.food.kcal), made.floors.has("kcal"), "en")} kcal, divided by ${draft.serves}.`}
                  bn={`পুরো পাত্র ${said(Math.round(made.food.kcal), made.floors.has("kcal"), "bn")} ক্যালোরি, ${digits(draft.serves, "bn")} দিয়ে ভাগ।`}
                />
              </p>
            </>
          ) : (
            <p className="dt-hint">
              <T
                en="A portion needs two things: something in the pot that carries a figure, and how many portions it makes."
                bn="এক ভাগ বের করতে দুটো জিনিস লাগে: পাত্রে এমন কিছু যার হিসাব আছে, আর কয় ভাগ হয়েছে।"
              />
            </p>
          )}

          {made.silent.length ? (
            <Note tone="warn" title={<T en="Counted as nothing" bn="কিছুই ধরা হয়নি" />}>
              <TBlock
                en={<p>{made.silent.map((p) => p.label).join(", ")} carries no
                  figure, so it adds nothing to the totals above. They are the
                  least this dish can be, not what it is.</p>}
                bn={<p>{made.silent.map((p) => partName(p, "bn")).join(", ")} এর কোনো
                  হিসাব নেই, তাই উপরের যোগফলে এটা কিছুই যোগ করেনি। ওই সংখ্যাগুলো
                  এই রান্নার সবচেয়ে কম হিসাব, আসল হিসাব নয়।</p>}
              />
            </Note>
          ) : null}

          {made.food && !made.micros.length ? (
            <p className="dt-why">
              <T
                en="Nutrients past the four above are carried only where every ingredient states one, so most pots with oil in them carry none. It is the safe way round: a dish claiming iron that only half of it stated would make the day look better read than it was."
                bn="উপরের চারটির বাইরের পুষ্টিগুলো তখনই ধরা হয়, যখন প্রতিটি উপকরণেই সেটার হিসাব থাকে, তাই তেল দেওয়া বেশিরভাগ রান্নাতেই সেগুলো থাকে না। এটাই নিরাপদ দিক: অর্ধেক উপকরণের হিসাব দিয়ে আয়রনের দাবি করলে দিনটা যতটা ভালো, তার চেয়ে ভালো দেখাত।"
              />
            </p>
          ) : null}

          <div className="dt-measure-row">
            <Button
              kind="solid"
              disabled={!made.food || !draft.en || saving === "saving"}
              onClick={() => void save()}
            >
              <T en="Save this dish" bn="রান্নাটা রাখুন" />
            </Button>
            {saving === "failed" ? (
              <span className="dt-hint">
                <T en="That did not save. Try again." bn="জমা হয়নি। আবার চেষ্টা করুন।" />
              </span>
            ) : null}
          </div>

          <p className="dt-why">
            <T
              en="A logged portion keeps its own numbers, so changing a dish later never rewrites what you ate last month."
              bn="খাতায় ওঠা এক ভাগ নিজের সংখ্যাগুলোই ধরে রাখে, তাই পরে রান্নাটা বদলালেও গত মাসে যা খেয়েছেন তা বদলায় না।"
            />
          </p>
        </div>
      </section>

      {/* ---- the shop ---- */}
      <section className="dt-shop" aria-labelledby="dt-shop-h">
        <h2 id="dt-shop-h"><T en="A list for the shop" bn="বাজারের তালিকা" /></h2>

        {!chosen.length ? (
          <p className="dt-hint">
            <T
              en="Press On the list against a dish above, or several, and what you need for them is added up here with a price where this site has checked one."
              bn="উপরের কোনো রান্নার পাশে বাজারের তালিকায় চাপুন, একটা বা কয়েকটা, তাহলে ওগুলোর জন্য যা লাগবে এখানে যোগ হয়ে যাবে, আর যেখানে এই সাইট দাম যাচাই করেছে সেখানে দামসহ।"
            />
          </p>
        ) : (
          <>
            <ul className="dt-shop-list">
              {shop.lines.map((line) => (
                <li key={line.key}>
                  <span>{lang === "bn" ? line.bn ?? line.en : line.en}</span>
                  <span className="dt-hit-por">
                    {line.unit ? portionWords(digits(line.qty, lang), line.unit, lang) : ""}
                  </span>
                  <span className="mono">
                    {line.cost === undefined
                      ? ""
                      : `${digits(line.cost, lang)} ${line.currency ?? ""}`}
                  </span>
                </li>
              ))}
            </ul>

            {shop.totals.map((total) => (
              <p className="dt-value" key={total.currency}>
                <T
                  en={`${said(total.cost, shop.unpriced.length > 0, "en")} ${total.currency}`}
                  bn={`${said(total.cost, shop.unpriced.length > 0, "bn")} ${total.currency}`}
                />
              </p>
            ))}

            {shop.unpriced.length ? (
              <p className="dt-why">
                <T
                  en={`${shop.unpriced.length} of these carry no checked price, so the figure above is the least the shop can cost rather than what it will cost. No shop is named and no link is offered, here or anywhere in this tool.`}
                  bn={`এর মধ্যে ${digits(shop.unpriced.length, "bn")}টির যাচাই করা দাম নেই, তাই উপরের সংখ্যাটা বাজারের সবচেয়ে কম খরচ, আসল খরচ নয়। কোনো দোকানের নাম বা লিঙ্ক এখানে বা এই যন্ত্রের কোথাও দেওয়া হয় না।`}
                />
              </p>
            ) : null}
          </>
        )}
      </section>
    </div>
  );
}
