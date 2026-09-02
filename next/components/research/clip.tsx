"use client";

/* ============================================================
   research/clip.tsx: the bookmarklet's landing.

   `/tools/research/clip?u=<address>`, reached from a paper's own
   page by the bookmarklet Settings hands out. The Worker reads
   the page's `citation_*` tags, a DOI on the page wins and is
   looked up, and the source is filed and opened. A page with
   nothing to read stays as a capture holding the address, so
   the press is never lost.
   ============================================================ */

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { addNote, addSource, findDuplicate, lookupUrl } from "../../lib/research-api";
import { Surface } from "../ui/surface";
import { T, W } from "./lang";
import { SignedOut } from "./signed-out";
import { useWho } from "./use-who";

export function Clip() {
  const { w, answered } = useWho();
  const params = useSearchParams();
  const router = useRouter();
  const [said, setSaid] = useState<string>("");
  const done = useRef(false);
  const u = params.get("u") ?? "";

  useEffect(() => {
    if (!w || !u || done.current) return;
    done.current = true;
    void (async () => {
      const found = await lookupUrl(u);
      if (!found) {
        const n = await addNote(w, { kind: "capture", text: u, title: u.slice(0, 80) });
        setSaid("fail");
        if (n) router.replace(`/tools/research/notes/${n.id}`);
        return;
      }
      const dup = await findDuplicate(w, found.csl);
      if (dup?.sure) { router.replace(`/tools/research/library/${dup.source.id}`); return; }
      const s = await addSource(w, found.csl, {
        via: "url", verified: found.via !== "clip" || Boolean(found.csl.DOI),
        retracted: found.retracted ?? null,
        identifiers: found.openalex ? { openalex: found.openalex.id } : {},
      });
      if (s) router.replace(`/tools/research/library/${s.id}`);
      else setSaid("fail");
    })();
  }, [w, u, router]);

  if (!w) return <SignedOut answered={answered} />;
  return (
    <Surface material="pane" className="px-5 py-6 text-t2">
      {said === "fail" ? <W k="rs.board.decided.fail" /> : <><W k="rs.moment" /> <span className="mono text-t1 text-ink-soft">{u}</span></>}
      {!u ? <p><T en="Nothing to clip: the address is missing." bn="ক্লিপ করার কিছু নেই: ঠিকানাটা নেই।" /></p> : null}
    </Surface>
  );
}
