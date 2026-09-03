"use client";

/* ============================================================
   research/settings.tsx: projects, preferences, connections.

   The projects are rows; the preferences are one jsonb column on
   `profiles`, spread on every write; the connections are what
   the Worker says is on, plus the one pull that takes a reader's
   own key for one request and forgets it.

   ---- the Zotero pull ----

   Page by page through the Web API, each item checked for a
   duplicate by DOI, ISBN and title hash before it is added, each
   Zotero collection made once as a studio collection keyed by
   its Zotero key, so a second pull updates rather than
   duplicates. The key never touches a row.
   ============================================================ */

import { useCallback, useEffect, useState } from "react";
import { PROJECT_KINDS, PROJECT_KIND_NAMES, TONES, fileSize, toneVar, type ProjectKind, type Tone } from "@reiad/shared/research";
import { GBP_PER_USD, pounds } from "@reiad/shared/research-assist";
import {
  addCollection, addProject, addSource, fileUsage, findDuplicate, getPrefs, listCollections, listNotes, listProjects,
  logImport, savePrefs, serviceStatus, zoteroPage, type ServiceState,
  type Prefs, type Project, type Usage,
} from "../../lib/research-api";
import { Button } from "../ui/button";
import { Chip, ChipLink } from "../ui/chip";
import { Field, Select } from "../ui/field";
import { Meter } from "../ui/meter";
import { Surface } from "../ui/surface";
import { cue } from "../../lib/sound";
import { T, W, both, useToolLang } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";

const DENSITY_KEY = "research-dense";

export function Settings() {
  const { w, answered } = useWho();
  const lang = useToolLang();
  const [prefs, setPrefs] = useState<Prefs>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");
  const [kind, setKind] = useState<ProjectKind>("degree");
  const [tone, setTone] = useState<Tone>("violet");
  const [services, setServices] = useState<Record<string, ServiceState> | null>(null);
  const [usage, setUsage] = useState<Usage | null>(null);
  const [zUser, setZUser] = useState("");
  const [zKey, setZKey] = useState("");
  const [pulling, setPulling] = useState<string>("");
  const [saidPrefs, setSaidPrefs] = useState(false);
  const [spent, setSpent] = useState(0);

  useEffect(() => {
    if (!w) return;
    void getPrefs(w).then(setPrefs);
    void listProjects(w).then(setProjects);
    void serviceStatus().then(setServices);
    void fileUsage(w).then(setUsage);
    /* The month's assistant cost: the notes' own figures, summed. */
    const month = new Date().toISOString().slice(0, 7);
    void listNotes(w, { kind: "assistant", limit: 300 }).then((ns) =>
      setSpent(ns.filter((n) => n.created_at.slice(0, 7) === month).reduce((sum, n) => sum + (typeof n.meta.usd === "number" ? n.meta.usd : 0), 0)));
  }, [w]);

  const keep = useCallback(async (part: Prefs) => {
    if (!w) return;
    const next = await savePrefs(w, part);
    setPrefs(next);
    cue("saved");
    setSaidPrefs(true);
    setTimeout(() => setSaidPrefs(false), 1600);
    if (part.dense !== undefined) {
      document.documentElement.setAttribute("data-density", part.dense ? "dense" : "");
      try { localStorage.setItem(DENSITY_KEY, part.dense ? "1" : "0"); } catch { /* private mode */ }
    }
  }, [w]);

  const makeProject = useCallback(async () => {
    if (!w || !name.trim()) return;
    const p = await addProject(w, name.trim(), kind, tone);
    if (p) { cue("saved"); setName(""); setProjects((was) => [p, ...was]); }
  }, [w, name, kind, tone]);

  const pull = useCallback(async () => {
    if (!w || !zUser || !zKey) return;
    setPulling("…");
    let start = 0;
    let added = 0;
    let skipped = 0;
    let total = 0;
    const byZotero = new Map<string, string>();
    for (const c of await listCollections(w)) if (c.zotero_key) byZotero.set(c.zotero_key, c.id);
    try {
      for (;;) {
        const { page, reason } = await zoteroPage(w, zUser, zKey, start);
        if (!page) { setPulling(`${both("rs.notsaved")} (${reason ?? "?"})`); return; }
        total = page.total;
        /* Parents before children, so a child can name its parent. */
        const pending = [...page.collections];
        let guard = 0;
        while (pending.length && guard < 1000) {
          guard += 1;
          const c = pending.shift() as typeof pending[number];
          if (byZotero.has(c.key)) continue;
          if (c.parent && !byZotero.has(c.parent)) { pending.push(c); continue; }
          const made = await addCollection(w, c.name, c.parent ? byZotero.get(c.parent) ?? null : null, c.key);
          if (made) byZotero.set(c.key, made.id);
        }
        for (const item of page.items) {
          const dup = await findDuplicate(w, item.csl);
          if (dup?.sure) { skipped += 1; continue; }
          const s = await addSource(w, item.csl, {
            via: "zotero", verified: true, tags: item.tags,
            collections: item.collections.map((k) => byZotero.get(k)).filter((x): x is string => Boolean(x)),
            identifiers: { zotero: item.key },
          });
          if (s) added += 1;
        }
        setPulling(`${Math.min(start + 100, total)} / ${total}`);
        if (page.next === null) break;
        start = page.next;
      }
      await logImport(w, `zotero: ${added} of ${total}`);
      setPulling(`${added} ${both("rs.lib.imported")}, ${skipped} ${both("rs.lib.skipped")}`);
      cue("saved");
      setZKey("");
    } catch { setPulling(both("rs.notsaved")); }
  }, [w, zUser, zKey]);

  if (!w) return <SignedOut answered={answered} />;

  const origin = typeof location === "undefined" ? "https://reiad.co.uk" : location.origin;
  const bookmarklet = `javascript:location.href='${origin}/tools/research/clip?u='+encodeURIComponent(location.href)`;

  return (
    <div className="grid gap-6">
      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h2 className="text-t3 font-medium"><W k="rs.set.prefs" /> {saidPrefs ? <span className="text-t1 text-ink-soft mono"><W k="rs.saved" /></span> : null}</h2>
        <div className="grid gap-3 md:grid-cols-2">
          <Field id="rs-p-name" label={<W k="rs.set.name" />} defaultValue={prefs.name ?? ""} key={`n${prefs.name ?? ""}`}
                 onBlur={(e) => { if (e.target.value !== (prefs.name ?? "")) void keep({ name: e.target.value }); }} />
          <Field id="rs-p-aff" label={<W k="rs.set.affiliation" />} defaultValue={prefs.affiliation ?? ""} key={`a${prefs.affiliation ?? ""}`}
                 onBlur={(e) => { if (e.target.value !== (prefs.affiliation ?? "")) void keep({ affiliation: e.target.value }); }} />
          <Field id="rs-p-orcid" label={<W k="rs.set.orcid" />} defaultValue={prefs.orcid ?? ""} key={`o${prefs.orcid ?? ""}`}
                 placeholder="0000-0000-0000-0000"
                 onBlur={(e) => { if (e.target.value !== (prefs.orcid ?? "")) void keep({ orcid: e.target.value }); }} />
          <Select id="rs-p-style" label={<W k="rs.set.style" />} value={prefs.style ?? "apa"} onChange={(e) => { void keep({ style: e.target.value }); }}>
            <option value="apa">APA 7</option>
            <option value="harvard">Harvard (Cite Them Right)</option>
            <option value="oscola">OSCOLA</option>
            <option value="chicago">Chicago author-date</option>
          </Select>
        </div>
        <label className="flex items-center gap-2 text-t2">
          <input type="checkbox" checked={Boolean(prefs.dense)} onChange={(e) => { void keep({ dense: e.target.checked }); }} />
          <span><W k="rs.set.dense" /></span>
        </label>
        <p className="text-t1 text-ink-soft"><W k="rs.set.dense.hint" /></p>
        <label className="flex items-center gap-2 text-t2">
          <input id="rs-p-assistant" type="checkbox" checked={Boolean(prefs.assistant)} onChange={(e) => { void keep({ assistant: e.target.checked }); }} />
          <span><W k="rs.set.assistant" /></span>
        </label>
        <p className="text-t1 text-ink-soft"><W k="rs.set.assistant.hint" /> <span className="mono" data-testid="rs-set-spent"><W k="rs.set.assistant.month" /> {pounds(spent)} (£{GBP_PER_USD}/$)</span></p>
      </Surface>

      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h2 className="text-t3 font-medium"><W k="rs.projects" /></h2>
        <p className="text-t2 text-ink-soft"><W k="rs.set.projects.hint" /></p>
        {projects.length ? (
          <ul className="grid gap-1">
            {projects.map((p) => (
              <li key={p.id} className="flex items-center gap-2" style={{ "--accent": toneVar(p.tone) } as React.CSSProperties}>
                <span className="dt-tab-dot" aria-hidden="true" style={{ "--tone": toneVar(p.tone) } as React.CSSProperties} />
                <span className="font-medium">{p.name}</span>
                <Chip>{PROJECT_KIND_NAMES[p.kind][lang]}</Chip>
                <Chip>{p.state}</Chip>
              </li>
            ))}
          </ul>
        ) : null}
        <form className="grid gap-3 md:grid-cols-[minmax(0,1fr)_12rem_8rem_auto] items-end" onSubmit={(e) => { e.preventDefault(); void makeProject(); }}>
          <Field id="rs-pr-name" label={<W k="rs.set.project.name" />} value={name} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          <Select id="rs-pr-kind" label={<W k="rs.set.project.kind" />} value={kind} onChange={(e) => setKind(e.target.value as ProjectKind)}>
            {PROJECT_KINDS.map((k) => <option key={k} value={k}>{PROJECT_KIND_NAMES[k][lang]}</option>)}
          </Select>
          <Select id="rs-pr-tone" label={<T en="Colour" bn="রং" />} value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
            {TONES.map((t) => <option key={t} value={t}>{t}</option>)}
          </Select>
          <Button type="submit" kind="solid" disabled={!name.trim()}><W k="rs.set.project.new" /></Button>
        </form>
      </Surface>

      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h2 className="text-t3 font-medium"><W k="rs.set.files" /></h2>
        <p className="text-t2 text-ink-soft"><W k="rs.set.files.hint" /></p>
        {usage ? (
          <Meter done={usage.bytes} total={usage.quota} label={both("rs.set.files")}
                 figure={<span className="mono">{fileSize(usage.bytes)} / {fileSize(usage.quota)} · {usage.files}</span>} />
        ) : <p className="text-t1 text-ink-soft"><W k="rs.moment" /></p>}
      </Surface>

      <Surface material="pane" className="px-5 py-4 grid gap-3">
        <h2 className="text-t3 font-medium"><W k="rs.set.connections" /></h2>
        <p className="text-t2 text-ink-soft"><W k="rs.set.connections.hint" /></p>
        <ul className="flex flex-wrap gap-2">
          {services ? Object.entries(services).map(([k, v]) => (
            <li key={k}><Chip tone={v === "on" ? "accent" : "quiet"}>{k}: {both(v === "on" ? "rs.set.on" : v === "owner" ? "rs.set.owner" : "rs.set.off")}</Chip></li>
          )) : <li className="text-t2 text-ink-soft"><W k="rs.moment" /></li>}
        </ul>
        <h3 className="text-t2 font-medium mt-2"><W k="rs.set.zotero" /></h3>
        <p className="text-t1 text-ink-soft"><W k="rs.set.zotero.hint" /></p>
        <form className="grid gap-3 md:grid-cols-[10rem_minmax(0,1fr)_auto] items-end" onSubmit={(e) => { e.preventDefault(); void pull(); }}>
          <Field id="rs-z-user" label={<W k="rs.set.zotero.user" />} value={zUser} onChange={(e) => setZUser(e.target.value)} inputMode="numeric" autoComplete="off" />
          <Field id="rs-z-key" label={<W k="rs.set.zotero.key" />} value={zKey} onChange={(e) => setZKey(e.target.value)} type="password" autoComplete="off" />
          <Button type="submit" kind="soft" disabled={!zUser || !zKey || pulling === "…"}><W k="rs.set.zotero.go" /></Button>
        </form>
        {pulling ? <p className="text-t2 mono" role="status">{pulling}</p> : null}
        <h3 className="text-t2 font-medium mt-2"><W k="rs.set.clipper" /></h3>
        <p className="text-t1 text-ink-soft"><W k="rs.set.clipper.hint" /></p>
        <p><ChipLink href={bookmarklet} onClick={(e) => e.preventDefault()} draggable><W k="rs.set.clipper" /></ChipLink></p>
      </Surface>
    </div>
  );
}

/** The density, restored before the first paint would be better
    and is stage 5's; for now the settings room and the frame
    read it on mount. */
export function readDensity(): boolean {
  try { return localStorage.getItem(DENSITY_KEY) === "1"; } catch { return false; }
}
