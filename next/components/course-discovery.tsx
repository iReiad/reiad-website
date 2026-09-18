"use client";

/* course-discovery.tsx: public subjects filtered by a learner's goal, without private catalogue data. */
import { useId, useState } from "react";
import type { NavItem } from "@reiad/shared/nav";
import { Field } from "./ui/field";
import { GoCard, SoonCard } from "./deck";
import { Button, ButtonLink } from "./ui/button";

const FILTERS = [
  { id: "all", label: "সব বিষয়" },
  { id: "languages", label: "ভাষা শিখব" },
  { id: "money", label: "টাকা বুঝব" },
  { id: "life", label: "জীবনের দক্ষতা" },
] as const;
type Goal = typeof FILTERS[number]["id"];
const languageKeys = new Set(["deutsch", "english", "quran"]);
const bn = (value: number) => value.toLocaleString("bn-BD");

export function CourseDiscovery({ items, totals = {} }: { items: NavItem[]; totals?: Record<string, number> }) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [goal, setGoal] = useState<Goal>("all");
  const publicItems = items.filter((item) => !item.unlisted && !item.ownerOnly);
  const matches = publicItems.filter((item) => {
    const key = item.key ?? "";
    const category = goal === "all" || (goal === "languages" && languageKeys.has(key))
      || (goal === "money" && key === "money")
      || (goal === "life" && !languageKeys.has(key) && key !== "money");
    return category && `${item.label} ${item.sub ?? ""} ${item.blurb ?? ""}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
  });

  return <div className="course-discovery" lang="bn">
    <div className="discovery-controls">
      <div className="discovery-search">
        <Field id={searchId} label="আপনি কী শিখতে চান?" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="যেমন: ইংরেজি, টাকা, German…" />
      </div>
      <a href="/account" className="discovery-progress">আগের পড়া খুঁজছেন? <b>আমার অগ্রগতি ↗</b></a>
    </div>
    <div className="discovery-filters" role="group" aria-label="শেখার লক্ষ্য">
      {FILTERS.map((filter) => <Button key={filter.id} pressed={goal === filter.id} kind={goal === filter.id ? "solid" : "ghost"} onClick={() => setGoal(filter.id)}>{filter.label}</Button>)}
    </div>
    <p className="discovery-count" role="status">{bn(matches.length)}টি বিষয় পাওয়া গেছে</p>
    <div className="deck discovery-deck">
      {matches.map((item) => item.soon ? <SoonCard key={item.href} title={item.sub ?? item.label} icon={item.icon} accent={item.accent} dek={item.blurb} lang="bn" /> : <GoCard
        key={item.href} href={item.href} className="discovery-card" icon={item.icon} accent={item.accent}
        chip={item.ladder ? "ধাপে ধাপে কোর্স" : "পড়ে শিখুন"} title={item.sub ?? item.label} dek={item.blurb}
        go={item.ladder ? "কোর্স দেখুন" : "পড়া শুরু করুন"} lang="bn">
        <div className="discovery-card-facts"><span lang="en">{item.label}</span><span>{item.key && totals[item.key] ? `${bn(totals[item.key])}টি পাঠ` : "নিজের গতিতে"}</span></div>
        <div className="discovery-card-access"><b>ফ্রি</b><span>{item.ladder ? "শুরু থেকে শেখা" : "বাংলায় লেখা"}</span></div>
      </GoCard>)}
    </div>
    {!matches.length && <div className="discovery-empty"><h3>এই নামে কিছু পাওয়া যায়নি</h3><p>অন্য শব্দ দিয়ে খুঁজুন, অথবা সব বিষয় দেখুন।</p><Button kind="solid" onClick={() => { setQuery(""); setGoal("all"); }}>সব বিষয় দেখুন</Button></div>}
    <div className="discovery-help"><div><h3>আপনার সময়ে, আপনার গতিতে।</h3><p>পড়ার অগ্রগতি এই ব্রাউজারে থাকে। সাইন ইন করলে অন্য ডিভাইস থেকেও এগোতে পারবেন।</p></div><ButtonLink href="/account" kind="ghost">অগ্রগতি রাখুন</ButtonLink></div>
  </div>;
}
