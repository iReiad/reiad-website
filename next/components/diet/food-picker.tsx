"use client";

/* ============================================================
   diet/food-picker.tsx: food found rather than typed.

   `DIET.md` sections 12 and 13. A tool that makes somebody type
   "chicken curry, 380" from memory is a tool they use for four
   days, so food is SEARCHED, and the search reaches three
   places: this site's own portion library, and two open
   databases through the Worker.

   ---- the source is printed on every result, always ----

   A reader has to be able to tell a figure this site checked
   from a figure a stranger typed into a public database from a
   figure out of a government laboratory. Almost no app shows
   this and it is the difference between a number and a rumour.

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

import { useEffect, useRef, useState } from "react";
import type { Entry } from "@reiad/shared/diet";
import { search as searchLibrary } from "@reiad/shared/foods";
import { Button } from "../ui/button";
import { T, digits, useToolLang } from "./lang";

interface Hit {
  id: string;
  source: string;
  label: string;
  brand?: string;
  qty: number;
  unit: string;
  kcal: number;
  protein?: number; carbs?: number; fat?: number; fibre?: number;
  completeness?: number;
}

const SOURCE_WORD: Record<string, { en: string; bn: string }> = {
  library: { en: "checked here", bn: "এখানে যাচাই করা" },
  own:     { en: "yours", bn: "আপনার নিজের" },
  fdc:     { en: "US food lab", bn: "মার্কিন খাদ্য গবেষণাগার" },
  off:     { en: "open database", bn: "মুক্ত ডেটাবেস" },
  free:    { en: "typed in", bn: "নিজে লেখা" },
};

export function FoodPicker({ onPick, place = "uk" }: {
  onPick: (e: Omit<Entry, "date">) => void;
  /** Which portion library leads. The other country's is
      still searched, because a reader in Dhaka who eats
      porridge should still find it. */
  place?: "bd" | "uk";
}) {
  const lang = useToolLang();
  const [q, setQ] = useState("");
  const [hits, setHits] = useState<Hit[]>([]);
  const [looking, setLooking] = useState(false);
  const [free, setFree] = useState({ label: "", kcal: "" });
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    if (q.trim().length < 2) { setHits([]); return; }
    /* Debounced, because a request per keystroke is a request
       per keystroke for everybody, and the Worker caches by
       query rather than by reader. */
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
    const own: Hit[] = searchLibrary(q.trim(), place).slice(0, 6).map((f) => ({
      id: `library:${f.id}`,
      source: "library",
      label: lang === "bn" ? f.bn : f.en,
      qty: f.qty,
      unit: f.unit,
      kcal: f.kcal,
      protein: f.protein,
      carbs: f.carbs,
      fat: f.fat,
      fibre: f.fibre,
      completeness: 1,
    }));
    setHits(own);

    timer.current = window.setTimeout(() => {
      setLooking(true);
      void fetch(`/api/diet/food?q=${encodeURIComponent(q.trim())}&place=${place}`)
        .then((r) => (r.ok ? r.json() as Promise<{ results?: Hit[] }> : { results: [] }))
        .then((d) => setHits([...own, ...(d.results ?? [])]))
        .catch(() => setHits(own))
        .finally(() => setLooking(false));
    }, 300);
    return () => { if (timer.current) window.clearTimeout(timer.current); };
  }, [q, place, lang]);

  const take = (h: Hit): void => {
    onPick({
      label: h.label,
      qty: h.qty,
      unit: h.unit,
      kcal: h.kcal,
      macros: {
        protein: h.protein ?? 0, carbs: h.carbs ?? 0,
        fat: h.fat ?? 0, fibre: h.fibre ?? 0,
      },
      /* Composition attached is what `totalFor()` counts as
         covered, so a library item raises the day's coverage and
         a free-typed one does not. That is the honest
         arithmetic: the gap is real. */
      micros: h.source === "library" || h.source === "fdc"
        ? { fibre: h.fibre ?? 0 } : undefined,
      source: h.source,
      sourceId: h.id,
    });
    setQ("");
    setHits([]);
  };

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

      {hits.length > 0 ? (
        <ul className="dt-hits">
          {hits.map((h) => (
            <li key={h.id}>
              <button type="button" className="dt-hit" onClick={() => take(h)}>
                <span className="dt-hit-name">
                  {h.label}
                  {h.brand ? <span className="dt-hit-brand"> {h.brand}</span> : null}
                </span>
                <span className="dt-hit-kcal mono">{digits(Math.round(h.kcal), lang)}</span>
                <span className="dt-hit-src">
                  <T
                    en={SOURCE_WORD[h.source]?.en ?? h.source}
                    bn={SOURCE_WORD[h.source]?.bn ?? h.source}
                  />
                </span>
              </button>
            </li>
          ))}
        </ul>
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
            placeholder="kcal"
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
    </div>
  );
}
